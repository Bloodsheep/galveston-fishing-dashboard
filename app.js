const GALVESTON = {
  lat: 29.31,
  lon: -94.79331,
  tideStation: "8771450"
};

const state = {
  tides: [],
  tideDirection: "Unknown",
  nextTide: null,
  windMph: null,
  windDirection: "",
  forecast: []
};

const $ = (id) => document.getElementById(id);

function yyyymmdd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function parseNoaaLocal(value) {
  // NOAA lst_ldt values arrive as YYYY-MM-DD HH:mm
  return new Date(value.replace(" ", "T"));
}

function fmtTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function escapeHtml(value="") {
  return value.replace(/[&<>"']/g, (m) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[m]));
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

  const previous = [...predictions].reverse().find(p => p.time <= now);
  const next = predictions.find(p => p.time > now);

  state.tides = predictions;
  state.nextTide = next || null;
  state.tideDirection = next?.type === "H" ? "Incoming" :
                        next?.type === "L" ? "Outgoing" : "Unknown";

  $("tideState").textContent = state.tideDirection;
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
  const values = nums.map(Number);
  return Math.max(...values);
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
    if (wind !== null && wind <= 12) zone = tide === "Outgoing" ? zone : "Surf / reefs / flats with bait and moving water";
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
    presentation = clarity === "muddy" ? presentation : "Topwater first; then 1/8 oz plastic or live bait";
    reasons.push("Pre-sunrise: start shallow/active and let topwater cover water.");
  } else if (time === "midday") {
    if (wind === null || wind < 20) zone += " • favor deeper shell/channel structure after the early bite";
    reasons.push("Midday in warm-season conditions: be ready to slide deeper.");
  }

  if (zone.toLowerCase().includes("reef") || zone.toLowerCase().includes("shell")) {
    sonar = "Use SideVü/chart to find hard-bottom edge; forward/live view to confirm bait/fish; mark exact bite depth";
  } else if (zone.toLowerCase().includes("drain")) {
    sonar = "Forward/perspective view on the drain mouth; mark the stage point and current tongue";
  } else if (zone.toLowerCase().includes("surf")) {
    sonar = "Use live/forward sonar only where sea state is safe; follow bait along guts/bars";
  }

  $("callGrade").textContent = grade;
  $("zoneCall").textContent = zone;
  $("presentationCall").textContent = presentation;
  $("boatCall").textContent = boat;
  $("sonarCall").textContent = sonar;
  $("reasoning").textContent = reasons.length
    ? reasons.join(" ")
    : "Set water clarity and time window, then refresh the live tide and weather data.";
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

async function refreshLive() {
  $("liveStatus").textContent = "Refreshing live data…";
  const results = await Promise.allSettled([fetchTides(), fetchWeather()]);
  const failed = results.filter(r => r.status === "rejected");

  if (failed.length === 0) {
    $("liveStatus").textContent = "Live NOAA/NWS data loaded";
  } else if (failed.length === 1) {
    $("liveStatus").textContent = "Partial live data loaded";
    console.warn(failed[0].reason);
  } else {
    $("liveStatus").textContent = "Live data unavailable — manual inputs still work";
    failed.forEach(f => console.warn(f.reason));
  }

  $("lastUpdated").textContent = `Updated ${new Date().toLocaleTimeString([], {hour:"numeric", minute:"2-digit"})}`;
  buildFishingCall();
}

$("refreshBtn").addEventListener("click", refreshLive);
$("claritySelect").addEventListener("change", buildFishingCall);
$("timeSelect").addEventListener("change", buildFishingCall);
$("tripMiles").addEventListener("input", updateFuel);
$("mpgSelect").addEventListener("change", updateFuel);
$("saveLogBtn").addEventListener("click", saveLog);
$("clearLogBtn").addEventListener("click", () => {
  if (confirm("Clear all saved trip notes on this device?")) {
    localStorage.removeItem("galvestonTripLog");
    loadLog();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(console.warn));
}

loadLog();
updateFuel();
refreshLive();
