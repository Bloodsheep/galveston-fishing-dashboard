const GALVESTON = {
  lat: 29.31,
  lon: -94.79331,
  tideStation: "8771450"
};

const STRATEGY_ZONES = [
  {
    key: "east-bay",
    name: "East Bay Shell / Reef Country",
    lat: 29.49,
    lon: -94.67,
    tone: "water",
    tags: ["reef", "shell", "incoming", "midbay"],
    summary: "Broad shell/reef search area. Look for bait, harder bottom and repeatable contour changes.",
    tactic: "Controlled drift across productive contour; mark every bite and repeat outside the school."
  },
  {
    key: "jetties",
    name: "Galveston Jetties / Bay Entrance",
    lat: 29.35,
    lon: -94.71,
    tone: "amber",
    tags: ["pass", "entrance", "incoming", "current", "jetty"],
    summary: "Strong current influence and Gulf-water exchange. Sea state and ship traffic matter.",
    tactic: "Work current seams from a safe holding position; never let position-hold replace seamanship."
  },
  {
    key: "lower-bay",
    name: "Lower Bay / Texas City Side",
    lat: 29.38,
    lon: -94.86,
    tone: "green",
    tags: ["protected", "structure", "wind", "lowerbay"],
    summary: "Useful broad option when structure, current and a more manageable lee line up.",
    tactic: "Use wind to make short repeatable drifts and scan structure before committing."
  },
  {
    key: "west-bay",
    name: "West Bay / Drains & Shorelines",
    lat: 29.20,
    lon: -95.02,
    tone: "green",
    tags: ["drain", "outgoing", "shoreline", "protected"],
    summary: "Broad drain/shoreline strategy area, especially when bait is being pulled from backwater.",
    tactic: "Sit outside the current tongue; cast upcurrent so the lure or bait exits naturally."
  },
  {
    key: "beachfront",
    name: "Galveston Beachfront / Surf",
    lat: 29.25,
    lon: -94.82,
    tone: "water",
    tags: ["surf", "green", "calm", "incoming"],
    summary: "A clean-water option only when wind, swell, visibility and breaker conditions allow.",
    tactic: "Work guts/bars parallel to the beach; stay outside unsafe breakers and keep the bow controlled."
  }
];

const state = {
  tides: [],
  tideDirection: "Unknown",
  nextTide: null,
  windMph: null,
  windDirection: "",
  forecast: [],
  recommendedZoneKey: null,
  map: null,
  zoneMarkers: new Map(),
  userMarkers: []
};

const $ = (id) => document.getElementById(id);

function yyyymmdd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function parseNoaaLocal(value) {
  return new Date(value.replace(" ", "T"));
}

function fmtTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function escapeHtml(value="") {
  return String(value).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[m]));
}

function getCss(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function markerColor(tone) {
  if (tone === "amber") return getCss("--amber") || "#f0ba57";
  if (tone === "green") return getCss("--green") || "#64d38b";
  if (tone === "user") return getCss("--purple") || "#b59aff";
  return getCss("--water") || "#36c5d8";
}

function makeCircleMarker(lat, lon, tone, radius=8) {
  return L.circleMarker([lat, lon], {
    radius,
    weight: 2,
    color: markerColor(tone),
    fillColor: markerColor(tone),
    fillOpacity: .72
  });
}

async function fetchTides() {
  const now = new Date();
  const begin = new Date(now);
  begin.setDate(begin.getDate() - 1);
  const end = new Date(now);
  end.setDate(end.getDate() + 2);

  const url = new URL("https://api.tidesandcurrents.noaa.gov/api/prod/datagetter");
  url.search = new URLSearchParams({
    begin_date: yyyymmdd(begin),
    end_date: yyyymmdd(end),
    station: GALVESTON.tideStation,
    product: "predictions",
    datum: "MLLW",
    time_zone: "lst_ldt",
    interval: "hilo",
    units: "english",
    application: "GalvestonFishingDashboard",
    format: "json"
  });

  const response = await fetch(url);
  if (!response.ok) throw new Error("NOAA tide request failed.");
  const json = await response.json();
  const predictions = (json.predictions || []).map(p => ({
    time: parseNoaaLocal(p.t),
    height: Number(p.v),
    type: p.type
  }));

  const next = predictions.find(p => p.time > now);

  state.tides = predictions;
  state.nextTide = next || null;
  state.tideDirection = next?.type === "H" ? "Incoming" :
                        next?.type === "L" ? "Outgoing" : "Unknown";

  $("tideState").textContent = state.tideDirection;
  $("tideState").classList.toggle("amber-text", state.tideDirection === "Outgoing");

  $("nextTide").textContent = next
    ? `Next ${next.type === "H" ? "high" : "low"}: ${fmtTime(next.time)} • ${next.height.toFixed(2)} ft MLLW`
    : "No upcoming tide event found.";

  const upcoming = predictions.filter(p => p.time > now).slice(0, 4);
  $("tideEvents").innerHTML = upcoming.map(p => `
    <div class="mini-item">
      <strong>${p.type === "H" ? "HIGH" : "LOW"}</strong>
      ${fmtTime(p.time)} • ${p.height.toFixed(2)} ft
    </div>
  `).join("");
}

function parseWindMph(text="") {
  const nums = text.match(/\d+/g);
  if (!nums?.length) return null;
  return Math.max(...nums.map(Number));
}

async function fetchWeather() {
  const pointResponse = await fetch(
    `https://api.weather.gov/points/${GALVESTON.lat},${GALVESTON.lon}`,
    { headers: { "Accept": "application/geo+json" } }
  );

  if (!pointResponse.ok) throw new Error("NWS point request failed.");
  const point = await pointResponse.json();

  const hourlyUrl = point.properties?.forecastHourly;
  if (!hourlyUrl) throw new Error("NWS hourly forecast URL missing.");

  const forecastResponse = await fetch(hourlyUrl, {
    headers: { "Accept": "application/geo+json" }
  });

  if (!forecastResponse.ok) throw new Error("NWS forecast request failed.");
  const forecast = await forecastResponse.json();

  const periods = forecast.properties?.periods || [];
  state.forecast = periods.slice(0, 6);

  const current = periods[0];
  if (current) {
    state.windMph = parseWindMph(current.windSpeed);
    state.windDirection = current.windDirection || "";
    $("windNow").textContent = `${current.windSpeed || "—"} ${current.windDirection || ""}`.trim();
    $("weatherNow").textContent =
      `${current.temperature ?? "—"}°${current.temperatureUnit || "F"} • ${current.shortForecast || "Forecast unavailable"}`;
  }

  $("forecastStrip").innerHTML = periods.slice(0, 6).map(p => {
    const start = new Date(p.startTime);
    return `
      <div class="forecast-item">
        <strong>${fmtTime(start)}</strong><br>
        ${p.temperature}°${p.temperatureUnit}<br>
        ${p.windSpeed} ${p.windDirection}
      </div>
    `;
  }).join("");
}

function chooseStrategyZone({ tide, clarity, wind, time }) {
  if (wind !== null && wind >= 20) return "lower-bay";
  if (wind !== null && wind >= 15) return "lower-bay";

  if (clarity === "green" && (wind === null || wind <= 10) && (time === "pre" || time === "morning")) {
    return "beachfront";
  }

  if (tide === "Outgoing") return "west-bay";
  if (tide === "Incoming") return clarity === "green" ? "jetties" : "east-bay";

  return "east-bay";
}

function setGradeStyle(grade) {
  const gradeEl = $("callGrade");
  gradeEl.classList.remove("grade-waiting", "grade-go", "grade-conditional", "grade-caution");
  gradeEl.classList.add(
    grade === "GO" ? "grade-go" :
    grade === "CONDITIONAL" ? "grade-conditional" :
    grade === "CAUTION" ? "grade-caution" :
    "grade-waiting"
  );
}

function buildFishingCall() {
  const clarity = $("claritySelect").value;
  const time = $("timeSelect").value;
  const tide = state.tideDirection;
  const wind = state.windMph;

  let grade = "GO";
  let zone = "Find bait + structure + moving water";
  let presentation = "1/8 oz soft plastic; cork/shrimp as confidence bait";
  let boat = "Approach quietly from upwind/upcurrent";
  let sonar = "Scan bait/structure; mark bites and repeat";
  const reasons = [];

  if (wind !== null) {
    if (wind >= 20) {
      grade = "CAUTION";
      zone = "Protected water only if conditions are otherwise safe";
      boat = "Do not force an open-bay run";
      reasons.push(`Wind is around ${wind} mph: treat this as a potential no-go/open-water caution.`);
    } else if (wind >= 15) {
      grade = "CONDITIONAL";
      zone = "Protected shoreline / leeward bay";
      presentation = "Cork or 1/8–1/4 oz plastic";
      boat = "Short controlled drifts; minimize long exposed runs";
      reasons.push(`Wind is around ${wind} mph: favor protected water and shorter drifts.`);
    } else if (wind >= 5) {
      reasons.push(`Wind is around ${wind} mph: good range for repeatable controlled drifts.`);
    } else {
      reasons.push(`Wind is light at about ${wind} mph: stealth and long quiet approaches matter.`);
    }
  }

  if (tide === "Incoming") {
    zone = clarity === "green"
      ? "Passes / bay entrances / reef edges with Gulf-water influence"
      : "Passes, shoreline points and structure swept by incoming current";
    boat = "Set up upcurrent and let the incoming flow sweep the structure";
    reasons.push("Incoming tide favors passes, entrances and cleaner Gulf-water influence.");
  } else if (tide === "Outgoing") {
    zone = "Marsh drains / bayou mouths / cuts / down-current reef edges";
    boat = "Hold outside the drain/current seam, not in the flow";
    reasons.push("Outgoing tide favors bait exiting drains and backwater.");
  }

  if (clarity === "green") {
    if (wind !== null && wind <= 12) {
      zone = tide === "Outgoing" ? zone : "Surf / reefs / flats with bait and moving water";
    }
    presentation = (time === "pre" || time === "morning")
      ? "Topwater first; then natural 1/8 oz plastic"
      : "Natural soft plastic; live shrimp/croaker where appropriate";
    reasons.push("Green/clean water rewards natural colors, longer casts and a quiet approach.");
  } else if (clarity === "stained") {
    presentation = (time === "pre" || time === "morning")
      ? "Topwater or 1/8 oz plastic; cork/shrimp"
      : "Plastic or cork/shrimp; use visible contrast if needed";
    reasons.push("Stained but fishable water is strong trout water around shell, drains and seams.");
  } else {
    zone = "Find the nearest cleaner-water edge / current exchange";
    presentation = "Contrast plastic or popping cork; move quickly if water stays chocolate";
    reasons.push("Muddy/chocolate water: prioritize finding cleaner water instead of grinding.");
  }

  if (time === "pre") {
    presentation = clarity === "muddy"
      ? presentation
      : "Topwater first; then 1/8 oz plastic or live bait";
    reasons.push("Pre-sunrise: start shallow/active and let topwater cover water.");
  } else if (time === "midday") {
    if (wind === null || wind < 20) {
      zone += " • favor deeper shell/channel structure after the early bite";
    }
    reasons.push("Midday in warm-season conditions: be ready to slide deeper.");
  }

  if (zone.toLowerCase().includes("reef") || zone.toLowerCase().includes("shell")) {
    sonar = "Use SideVü/chart to find hard-bottom edge; forward/live view to confirm bait/fish; mark exact bite depth";
  } else if (zone.toLowerCase().includes("drain")) {
    sonar = "Forward/perspective view on the drain mouth; mark the stage point and current tongue";
  } else if (zone.toLowerCase().includes("surf")) {
    sonar = "Use live/forward sonar only where sea state is safe; follow bait along guts/bars";
  }

  state.recommendedZoneKey = chooseStrategyZone({ tide, clarity, wind, time });

  $("callGrade").textContent = grade;
  setGradeStyle(grade);
  $("zoneCall").textContent = zone;
  $("presentationCall").textContent = presentation;
  $("boatCall").textContent = boat;
  $("sonarCall").textContent = sonar;
  $("reasoning").textContent = reasons.length
    ? reasons.join(" ")
    : "Set water clarity and time window, then refresh the live tide and weather data.";

  updateRecommendedZone();
}

function updateFuel() {
  const miles = Number($("tripMiles").value || 0);
  const mpg = Number($("mpgSelect").value || 3);
  const base = mpg > 0 ? miles / mpg : 0;
  const with20 = base * 1.2;

  $("fuelEstimate").textContent =
    `${base.toFixed(1)} gal estimated burn • ${with20.toFixed(1)} gal with a simple 20% planning buffer`;
}

function loadLog() {
  const entries = JSON.parse(localStorage.getItem("galvestonTripLog") || "[]");

  $("tripLog").innerHTML = entries.map(entry => `
    <div class="trip-item">
      <strong>${escapeHtml(entry.spot || "Trip note")}</strong>
      <span class="muted small">${escapeHtml(entry.date)}</span>
      <p>${escapeHtml(entry.result || "")}</p>
      <p class="muted">${escapeHtml(entry.notes || "")}</p>
    </div>
  `).join("");
}

function saveLog() {
  const entries = JSON.parse(localStorage.getItem("galvestonTripLog") || "[]");

  entries.unshift({
    date: new Date().toLocaleString(),
    spot: $("logSpot").value.trim(),
    result: $("logResult").value.trim(),
    notes: $("logNotes").value.trim()
  });

  localStorage.setItem("galvestonTripLog", JSON.stringify(entries.slice(0, 50)));

  $("logSpot").value = "";
  $("logResult").value = "";
  $("logNotes").value = "";

  loadLog();
}

function initMap() {
  if (typeof L === "undefined") {
    $("zoneMap").innerHTML = `<div class="reason-box">Map library could not load. The rest of the fishing dashboard still works.</div>`;
    return;
  }

  state.map = L.map("zoneMap", {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([29.34, -94.83], 9);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(state.map);

  STRATEGY_ZONES.forEach(zone => {
    const marker = makeCircleMarker(zone.lat, zone.lon, zone.tone, 8)
      .addTo(state.map)
      .bindPopup(`
        <strong>${escapeHtml(zone.name)}</strong>
        <p>${escapeHtml(zone.summary)}</p>
        <small>Approximate strategy-zone center — not a navigation waypoint.</small>
      `);

    marker.on("click", () => focusZone(zone.key));
    state.zoneMarkers.set(zone.key, marker);
  });

  renderZoneCards();
  renderUserWaypoints();
}

function renderZoneCards() {
  $("zoneCards").innerHTML = STRATEGY_ZONES.map(zone => `
    <button class="zone-card ${zone.key === state.recommendedZoneKey ? "recommended" : ""}"
            data-zone-key="${escapeHtml(zone.key)}"
            type="button">
      <strong>${escapeHtml(zone.name)}</strong>
      <p>${escapeHtml(zone.summary)}</p>
      <span class="zone-tag">${escapeHtml(zone.tone === "amber" ? "CURRENT" : zone.tone === "green" ? "STRUCTURE" : "WATER")}</span>
    </button>
  `).join("");

  document.querySelectorAll(".zone-card").forEach(card => {
    card.addEventListener("click", () => focusZone(card.dataset.zoneKey));
  });
}

function updateRecommendedZone() {
  renderZoneCards();

  const zone = STRATEGY_ZONES.find(z => z.key === state.recommendedZoneKey);
  if (!zone) return;

  $("recommendedZoneBanner").innerHTML =
    `<strong>Best strategy-zone match right now:</strong> ${escapeHtml(zone.name)} — ${escapeHtml(zone.tactic)}`;

  state.zoneMarkers.forEach((marker, key) => {
    const selected = key === state.recommendedZoneKey;
    marker.setStyle({
      radius: selected ? 11 : 8,
      weight: selected ? 4 : 2,
      fillOpacity: selected ? .9 : .72
    });
  });
}

function focusZone(key) {
  const zone = STRATEGY_ZONES.find(z => z.key === key);
  if (!zone || !state.map) return;

  state.map.flyTo([zone.lat, zone.lon], 11, { duration: .7 });
  const marker = state.zoneMarkers.get(key);
  if (marker) marker.openPopup();
}

function getWaypoints() {
  try {
    return JSON.parse(localStorage.getItem("galvestonWaypoints") || "[]");
  } catch {
    return [];
  }
}

function saveWaypoint() {
  const name = $("wpName").value.trim();
  const type = $("wpType").value;
  const lat = Number($("wpLat").value);
  const lon = Number($("wpLon").value);
  const notes = $("wpNotes").value.trim();

  if (!name) {
    alert("Give the waypoint a name first.");
    return;
  }

  if (!Number.isFinite(lat) || lat < -90 || lat > 90 ||
      !Number.isFinite(lon) || lon < -180 || lon > 180) {
    alert("Enter a valid latitude and longitude.");
    return;
  }

  const waypoints = getWaypoints();
  waypoints.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    type,
    lat,
    lon,
    notes,
    created: new Date().toLocaleString()
  });

  localStorage.setItem("galvestonWaypoints", JSON.stringify(waypoints.slice(0, 100)));

  $("wpName").value = "";
  $("wpLat").value = "";
  $("wpLon").value = "";
  $("wpNotes").value = "";

  renderUserWaypoints();

  if (state.map) {
    state.map.flyTo([lat, lon], 12, { duration: .7 });
  }
}

function deleteWaypoint(id) {
  const waypoints = getWaypoints().filter(wp => wp.id !== id);
  localStorage.setItem("galvestonWaypoints", JSON.stringify(waypoints));
  renderUserWaypoints();
}

function renderUserWaypoints() {
  state.userMarkers.forEach(marker => {
    if (state.map) state.map.removeLayer(marker);
  });
  state.userMarkers = [];

  const waypoints = getWaypoints();

  $("waypointList").innerHTML = waypoints.length
    ? waypoints.map(wp => `
      <div class="waypoint-item">
        <div>
          <strong>${escapeHtml(wp.name)}</strong>
          <div class="waypoint-meta">
            <span>${escapeHtml(wp.type)}</span>
            <span>${Number(wp.lat).toFixed(5)}, ${Number(wp.lon).toFixed(5)}</span>
          </div>
          ${wp.notes ? `<p class="muted small">${escapeHtml(wp.notes)}</p>` : ""}
        </div>
        <button class="danger" data-delete-wp="${escapeHtml(wp.id)}" type="button">Delete</button>
      </div>
    `).join("")
    : `<p class="muted small">No personal waypoints saved on this device yet.</p>`;

  document.querySelectorAll("[data-delete-wp]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (confirm("Delete this saved waypoint?")) {
        deleteWaypoint(btn.dataset.deleteWp);
      }
    });
  });

  if (!state.map || typeof L === "undefined") return;

  waypoints.forEach(wp => {
    const marker = makeCircleMarker(wp.lat, wp.lon, "user", 7)
      .addTo(state.map)
      .bindPopup(`
        <strong>${escapeHtml(wp.name)}</strong>
        <p>${escapeHtml(wp.notes || wp.type)}</p>
        <small>${Number(wp.lat).toFixed(5)}, ${Number(wp.lon).toFixed(5)}</small>
      `);

    state.userMarkers.push(marker);
  });
}

function useCurrentPosition() {
  if (!navigator.geolocation) {
    alert("This browser does not expose geolocation.");
    return;
  }

  const btn = $("useLocationBtn");
  const original = btn.textContent;
  btn.textContent = "Getting position…";
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    position => {
      $("wpLat").value = position.coords.latitude.toFixed(6);
      $("wpLon").value = position.coords.longitude.toFixed(6);

      btn.textContent = original;
      btn.disabled = false;

      if (state.map) {
        state.map.flyTo(
          [position.coords.latitude, position.coords.longitude],
          13,
          { duration: .7 }
        );
      }
    },
    error => {
      btn.textContent = original;
      btn.disabled = false;
      alert(`Could not get current position: ${error.message}`);
    },
    {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 15000
    }
  );
}

async function refreshLive() {
  $("liveStatus").textContent = "Refreshing live data…";

  const results = await Promise.allSettled([fetchTides(), fetchWeather()]);
  const failed = results.filter(r => r.status === "rejected");

  if (failed.length === 0) {
    $("liveStatus").textContent = "Live NOAA/NWS data loaded";
    $("liveStatus").className = "status-pill tone-green";
  } else if (failed.length === 1) {
    $("liveStatus").textContent = "Partial live data loaded";
    $("liveStatus").className = "status-pill tone-water";
    console.warn(failed[0].reason);
  } else {
    $("liveStatus").textContent = "Live data unavailable — manual inputs still work";
    $("liveStatus").className = "status-pill grade-conditional";
    failed.forEach(f => console.warn(f.reason));
  }

  $("lastUpdated").textContent =
    `Updated ${new Date().toLocaleTimeString([], {hour:"numeric", minute:"2-digit"})}`;

  buildFishingCall();
}

$("refreshBtn").addEventListener("click", refreshLive);
$("claritySelect").addEventListener("change", buildFishingCall);
$("timeSelect").addEventListener("change", buildFishingCall);
$("tripMiles").addEventListener("input", updateFuel);
$("mpgSelect").addEventListener("change", updateFuel);
$("saveLogBtn").addEventListener("click", saveLog);
$("saveWaypointBtn").addEventListener("click", saveWaypoint);
$("useLocationBtn").addEventListener("click", useCurrentPosition);

$("clearLogBtn").addEventListener("click", () => {
  if (confirm("Clear all saved trip notes on this device?")) {
    localStorage.removeItem("galvestonTripLog");
    loadLog();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("./sw.js").catch(console.warn)
  );
}

loadLog();
updateFuel();
initMap();
refreshLive();
