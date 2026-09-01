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
  alerts: [],
  recommendedZoneKey: null,
  map: null,
  zoneMarkers: new Map(),
  userMarkers: [],
  themeMode: localStorage.getItem("galvestonThemeMode") || "auto"
};

const $ = (id) => document.getElementById(id);

function pad2(value) {
  return String(value).padStart(2, "0");
}

function yyyymmdd(date) {
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`;
}

function dateKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function localDateAtMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function sameDay(a, b) {
  return dateKey(a) === dateKey(b);
}

function parseNoaaLocal(value) {
  return new Date(value.replace(" ", "T"));
}

function fmtTime(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function fmtDay(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
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
  if (tone === "amber") return getCss("--amber") || "#dc9b28";
  if (tone === "green") return getCss("--green") || "#35ad68";
  if (tone === "user") return getCss("--purple") || "#8d72df";
  return getCss("--water") || "#18aabd";
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

/* ---------- Sunrise / sunset ----------
   Compact NOAA-style solar-position math. Accurate enough for deciding the
   app's display mode and fishing-window buckets. It is not a navigation tool.
*/
function degToRad(deg) { return deg * Math.PI / 180; }
function radToDeg(rad) { return rad * 180 / Math.PI; }
function normalizeDeg(deg) { return ((deg % 360) + 360) % 360; }

function solarEventUtc(date, latitude, longitude, isSunrise) {
  const zenith = 90.833;
  const start = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const yearStart = new Date(Date.UTC(date.getFullYear(), 0, 0));
  const dayOfYear = Math.floor((start - yearStart) / 86400000);

  const lngHour = longitude / 15;
  const t = dayOfYear + ((isSunrise ? 6 : 18) - lngHour) / 24;

  const M = (0.9856 * t) - 3.289;
  let L = M + (1.916 * Math.sin(degToRad(M))) + (0.020 * Math.sin(degToRad(2 * M))) + 282.634;
  L = normalizeDeg(L);

  let RA = radToDeg(Math.atan(0.91764 * Math.tan(degToRad(L))));
  RA = normalizeDeg(RA);

  const Lquadrant = Math.floor(L / 90) * 90;
  const RAquadrant = Math.floor(RA / 90) * 90;
  RA = RA + (Lquadrant - RAquadrant);
  RA /= 15;

  const sinDec = 0.39782 * Math.sin(degToRad(L));
  const cosDec = Math.cos(Math.asin(sinDec));

  const cosH =
    (Math.cos(degToRad(zenith)) - (sinDec * Math.sin(degToRad(latitude)))) /
    (cosDec * Math.cos(degToRad(latitude)));

  if (cosH > 1 || cosH < -1) return null;

  let H = isSunrise
    ? 360 - radToDeg(Math.acos(cosH))
    : radToDeg(Math.acos(cosH));

  H /= 15;

  const T = H + RA - (0.06571 * t) - 6.622;
  let UT = T - lngHour;
  UT = ((UT % 24) + 24) % 24;

  const hours = Math.floor(UT);
  const minutesFloat = (UT - hours) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60);

  return new Date(Date.UTC(
    date.getFullYear(), date.getMonth(), date.getDate(),
    hours, minutes, seconds
  ));
}

function getSunTimes(date) {
  return {
    sunrise: solarEventUtc(date, GALVESTON.lat, GALVESTON.lon, true),
    sunset: solarEventUtc(date, GALVESTON.lat, GALVESTON.lon, false)
  };
}

function resolveTheme() {
  const mode = state.themeMode;

  if (mode === "day" || mode === "night") return mode;

  const now = new Date();
  const { sunrise, sunset } = getSunTimes(now);

  if (!sunrise || !sunset) {
    const hour = now.getHours();
    return hour >= 7 && hour < 19 ? "day" : "night";
  }

  return now >= sunrise && now < sunset ? "day" : "night";
}

function applyTheme() {
  const resolved = resolveTheme();
  document.documentElement.dataset.theme = resolved;

  const status =
    state.themeMode === "auto"
      ? `Display: Auto → ${resolved === "day" ? "Day" : "Night"}`
      : `Display: ${resolved === "day" ? "Day" : "Night"}`;

  $("themeStatus").textContent = status;
  $("themeStatus").className =
    `status-pill ${resolved === "day" ? "tone-water" : "tone-sky"}`;

  const themeColor = resolved === "day" ? "#eaf3f5" : "#07151f";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", themeColor);

  refreshMarkerColors();
}

function refreshMarkerColors() {
  if (!state.map) return;

  STRATEGY_ZONES.forEach(zone => {
    const marker = state.zoneMarkers.get(zone.key);
    if (!marker) return;
    marker.setStyle({
      color: markerColor(zone.tone),
      fillColor: markerColor(zone.tone)
    });
  });

  state.userMarkers.forEach(marker => {
    marker.setStyle({
      color: markerColor("user"),
      fillColor: markerColor("user")
    });
  });
}

async function fetchTides() {
  const now = new Date();
  const begin = new Date(now);
  begin.setDate(begin.getDate() - 1);

  const end = new Date(now);
  end.setDate(end.getDate() + 8);

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
  state.tideDirection =
    next?.type === "H" ? "Incoming" :
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
  const nums = String(text).match(/\d+/g);
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
  state.forecast = periods;

  const current = periods[0];

  if (current) {
    state.windMph = parseWindMph(current.windSpeed);
    state.windDirection = current.windDirection || "";

    $("windNow").textContent =
      `${current.windSpeed || "—"} ${current.windDirection || ""}`.trim();

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

async function fetchAlerts() {
  try {
    const response = await fetch(
      `https://api.weather.gov/alerts/active?point=${GALVESTON.lat},${GALVESTON.lon}`,
      { headers: { "Accept": "application/geo+json" } }
    );

    if (!response.ok) throw new Error("NWS alerts request failed.");

    const json = await response.json();
    state.alerts = json.features || [];
    renderAlerts();
  } catch (error) {
    console.warn(error);
    state.alerts = [];
    $("alertPanel").classList.add("hidden");
  }
}

function renderAlerts() {
  const panel = $("alertPanel");

  if (!state.alerts.length) {
    panel.classList.add("hidden");
    return;
  }

  const first = state.alerts[0]?.properties || {};
  panel.classList.remove("hidden");

  $("alertHeadline").textContent =
    first.headline || first.event || "Active NWS weather alert";

  $("alertSeverity").textContent =
    (first.severity || "CHECK").toUpperCase();

  $("alertDetail").textContent =
    `${first.event || "Weather alert"}${first.expires ? ` • Expires ${new Date(first.expires).toLocaleString()}` : ""}. Open the NWS link below and verify conditions before departure.`;
}

function chooseStrategyZone({ tide, clarity, wind, time }) {
  if (wind !== null && wind >= 15) return "lower-bay";

  if (
    clarity === "green" &&
    (wind === null || wind <= 10) &&
    (time === "pre" || time === "morning")
  ) {
    return "beachfront";
  }

  if (tide === "Outgoing") return "west-bay";
  if (tide === "Incoming") return clarity === "green" ? "jetties" : "east-bay";

  return "east-bay";
}

function setGradeStyle(grade) {
  const gradeEl = $("callGrade");

  gradeEl.classList.remove(
    "grade-waiting",
    "grade-go",
    "grade-conditional",
    "grade-caution"
  );

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
      reasons.push(
        `Wind is around ${wind} mph: treat this as a potential no-go/open-water caution.`
      );
    } else if (wind >= 15) {
      grade = "CONDITIONAL";
      zone = "Protected shoreline / leeward bay";
      presentation = "Cork or 1/8–1/4 oz plastic";
      boat = "Short controlled drifts; minimize long exposed runs";
      reasons.push(
        `Wind is around ${wind} mph: favor protected water and shorter drifts.`
      );
    } else if (wind >= 5) {
      reasons.push(
        `Wind is around ${wind} mph: good range for repeatable controlled drifts.`
      );
    } else {
      reasons.push(
        `Wind is light at about ${wind} mph: stealth and long quiet approaches matter.`
      );
    }
  }

  if (tide === "Incoming") {
    zone = clarity === "green"
      ? "Passes / bay entrances / reef edges with Gulf-water influence"
      : "Passes, shoreline points and structure swept by incoming current";

    boat = "Set up upcurrent and let the incoming flow sweep the structure";
    reasons.push(
      "Incoming tide favors passes, entrances and cleaner Gulf-water influence."
    );
  } else if (tide === "Outgoing") {
    zone = "Marsh drains / bayou mouths / cuts / down-current reef edges";
    boat = "Hold outside the drain/current seam, not in the flow";
    reasons.push(
      "Outgoing tide favors bait exiting drains and backwater."
    );
  }

  if (clarity === "green") {
    if (wind !== null && wind <= 12) {
      zone =
        tide === "Outgoing"
          ? zone
          : "Surf / reefs / flats with bait and moving water";
    }

    presentation =
      (time === "pre" || time === "morning")
        ? "Topwater first; then natural 1/8 oz plastic"
        : "Natural soft plastic; live shrimp/croaker where appropriate";

    reasons.push(
      "Green/clean water rewards natural colors, longer casts and a quiet approach."
    );
  } else if (clarity === "stained") {
    presentation =
      (time === "pre" || time === "morning")
        ? "Topwater or 1/8 oz plastic; cork/shrimp"
        : "Plastic or cork/shrimp; use visible contrast if needed";

    reasons.push(
      "Stained but fishable water is strong trout water around shell, drains and seams."
    );
  } else {
    zone = "Find the nearest cleaner-water edge / current exchange";
    presentation =
      "Contrast plastic or popping cork; move quickly if water stays chocolate";

    reasons.push(
      "Muddy/chocolate water: prioritize finding cleaner water instead of grinding."
    );
  }

  if (time === "pre") {
    presentation =
      clarity === "muddy"
        ? presentation
        : "Topwater first; then 1/8 oz plastic or live bait";

    reasons.push(
      "Pre-sunrise: start shallow/active and let topwater cover water."
    );
  } else if (time === "midday") {
    if (wind === null || wind < 20) {
      zone += " • favor deeper shell/channel structure after the early bite";
    }

    reasons.push(
      "Midday in warm-season conditions: be ready to slide deeper."
    );
  }

  if (zone.toLowerCase().includes("reef") || zone.toLowerCase().includes("shell")) {
    sonar =
      "Use SideVü/chart to find hard-bottom edge; forward/live view to confirm bait/fish; mark exact bite depth";
  } else if (zone.toLowerCase().includes("drain")) {
    sonar =
      "Forward/perspective view on the drain mouth; mark the stage point and current tongue";
  } else if (zone.toLowerCase().includes("surf")) {
    sonar =
      "Use live/forward sonar only where sea state is safe; follow bait along guts/bars";
  }

  state.recommendedZoneKey =
    chooseStrategyZone({ tide, clarity, wind, time });

  $("callGrade").textContent = grade;
  setGradeStyle(grade);
  $("zoneCall").textContent = zone;
  $("presentationCall").textContent = presentation;
  $("boatCall").textContent = boat;
  $("sonarCall").textContent = sonar;

  $("reasoning").textContent =
    reasons.length
      ? reasons.join(" ")
      : "Set water clarity and time window, then refresh the live tide and weather data.";

  updateRecommendedZone();
  buildOutlooks();
}

/* ---------- V3 fishing-window scoring ---------- */

function tideContextAt(date) {
  if (!state.tides.length) {
    return { direction: "Unknown", nearestMinutes: null, next: null };
  }

  const previous = [...state.tides]
    .reverse()
    .find(t => t.time <= date);

  const next = state.tides.find(t => t.time > date);

  const direction =
    next?.type === "H" ? "Incoming" :
    next?.type === "L" ? "Outgoing" :
    "Unknown";

  const candidates = [previous, next].filter(Boolean);

  const nearestMinutes =
    candidates.length
      ? Math.min(
          ...candidates.map(t =>
            Math.abs(t.time.getTime() - date.getTime()) / 60000
          )
        )
      : null;

  return { direction, nearestMinutes, next };
}

function hourFishingScore(period, clarity, sunTimes) {
  const date = new Date(period.startTime);
  const wind = parseWindMph(period.windSpeed);
  const tide = tideContextAt(date);
  const forecastText =
    `${period.shortForecast || ""} ${period.detailedForecast || ""}`.toLowerCase();

  let score = 0;
  const reasons = [];

  // Wind: 35 pts
  if (wind === null) {
    score += 18;
  } else if (wind >= 5 && wind <= 12) {
    score += 35;
    reasons.push("excellent drift wind");
  } else if (wind <= 4) {
    score += 27;
    reasons.push("light wind / stealth");
  } else if (wind <= 15) {
    score += 25;
    reasons.push("workable wind");
  } else if (wind <= 19) {
    score += 12;
    reasons.push("protected-water wind");
  } else {
    score += 0;
    reasons.push("strong-wind penalty");
  }

  // Tide movement: 25 pts
  if (tide.nearestMinutes === null) {
    score += 12;
  } else if (tide.nearestMinutes < 35) {
    score += 7;
    reasons.push("near tide turn / possible slack");
  } else if (tide.nearestMinutes <= 150) {
    score += 22;
    reasons.push(`${tide.direction.toLowerCase()} movement`);
  } else {
    score += 25;
    reasons.push(`${tide.direction.toLowerCase()} tide`);
  }

  // Light / feeding window: 25 pts
  const fromSunrise =
    sunTimes.sunrise
      ? (date.getTime() - sunTimes.sunrise.getTime()) / 3600000
      : null;

  const toSunset =
    sunTimes.sunset
      ? (sunTimes.sunset.getTime() - date.getTime()) / 3600000
      : null;

  if (fromSunrise !== null && fromSunrise >= -1.25 && fromSunrise <= 2.5) {
    score += 25;
    reasons.push("dawn window");
  } else if (toSunset !== null && toSunset >= 0 && toSunset <= 2.25) {
    score += 20;
    reasons.push("evening window");
  } else {
    const hour = date.getHours();
    if (hour >= 8 && hour <= 10) score += 15;
    else if (hour >= 11 && hour <= 15) score += 7;
    else score += 11;
  }

  // Water clarity: 15 pts
  if (clarity === "stained") {
    score += 15;
    reasons.push("fishable stain");
  } else if (clarity === "green") {
    score += 14;
    reasons.push("clean water");
  } else {
    score += 5;
    reasons.push("muddy-water penalty");
  }

  // Weather wording penalties.
  const hazardWords = [
    "thunderstorm",
    "t-storm",
    "severe",
    "heavy rain",
    "tropical storm",
    "hurricane"
  ];

  if (hazardWords.some(word => forecastText.includes(word))) {
    score -= 30;
    reasons.push("storm-language penalty");
  } else if (forecastText.includes("rain") || forecastText.includes("showers")) {
    score -= 7;
    reasons.push("rain chance");
  }

  if (state.alerts.length) {
    score -= 10;
    reasons.push("active NWS alert");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    date,
    wind,
    windDirection: period.windDirection || "",
    tideDirection: tide.direction,
    forecast: period.shortForecast || "",
    reasons
  };
}

function scoreThreeHourWindows(dayDate) {
  if (!state.forecast.length) return [];

  const clarity = $("claritySelect").value;
  const sunTimes = getSunTimes(dayDate);
  const now = new Date();

  const periods = state.forecast.filter(period => {
    const date = new Date(period.startTime);

    if (!sameDay(date, dayDate)) return false;

    if (sameDay(dayDate, now) && date < now) return false;

    const hour = date.getHours();

    // Fishing-focused window, but keep a broad enough span for later starts.
    return hour >= 4 && hour <= 20;
  });

  const scoredHours =
    periods.map(period => hourFishingScore(period, clarity, sunTimes));

  const windows = [];

  for (let i = 0; i < scoredHours.length; i++) {
    const slice = scoredHours.slice(i, i + 3);
    if (!slice.length) continue;

    // Require reasonably contiguous periods.
    if (slice.length > 1) {
      const hoursApart =
        (slice[slice.length - 1].date - slice[0].date) / 3600000;

      if (hoursApart > slice.length) continue;
    }

    const avg =
      Math.round(
        slice.reduce((sum, item) => sum + item.score, 0) / slice.length
      );

    const maxWind =
      Math.max(
        ...slice.map(item => item.wind ?? 0)
      );

    const first = slice[0];
    const last = slice[slice.length - 1];

    const endDate = new Date(last.date.getTime() + 3600000);

    windows.push({
      score: avg,
      start: first.date,
      end: endDate,
      wind: maxWind,
      windDirection: first.windDirection,
      tideDirection: first.tideDirection,
      forecast: first.forecast,
      reasons: [...new Set(slice.flatMap(item => item.reasons))]
    });
  }

  return windows.sort((a, b) => b.score - a.score);
}

function nextWeekendDates() {
  const now = new Date();
  const today = localDateAtMidnight(now);
  const day = today.getDay(); // Sun 0 ... Sat 6

  let daysUntilSaturday = (6 - day + 7) % 7;

  // If it is Sunday, point to the following Saturday.
  if (day === 0) daysUntilSaturday = 6;

  // If it is Saturday late enough that no useful windows remain, next weekend.
  if (day === 6 && now.getHours() >= 18) daysUntilSaturday = 7;

  const saturday = addDays(today, daysUntilSaturday);
  const sunday = addDays(saturday, 1);

  return { saturday, sunday };
}

function scoreColor(score) {
  if (score >= 80) return "var(--green)";
  if (score >= 65) return "var(--water)";
  if (score >= 45) return "var(--amber)";
  return "var(--red)";
}

function scoreLabel(score) {
  if (score >= 80) return "Strong";
  if (score >= 65) return "Good";
  if (score >= 45) return "Conditional";
  return "Weak";
}

function timeBucket(date, sunTimes) {
  if (!date) return "morning";

  if (sunTimes.sunrise) {
    const delta =
      (date.getTime() - sunTimes.sunrise.getTime()) / 3600000;

    if (delta <= 0.5) return "pre";
    if (delta <= 4) return "morning";
  }

  if (sunTimes.sunset) {
    const until =
      (sunTimes.sunset.getTime() - date.getTime()) / 3600000;

    if (until >= 0 && until <= 3) return "evening";
  }

  return "midday";
}

function strategyForWindow(window, dayDate) {
  if (!window) return "No usable forecast window";

  const sunTimes = getSunTimes(dayDate);
  const time = timeBucket(window.start, sunTimes);

  const key = chooseStrategyZone({
    tide: window.tideDirection,
    clarity: $("claritySelect").value,
    wind: window.wind,
    time
  });

  return STRATEGY_ZONES.find(zone => zone.key === key)?.name || "Find bait + structure";
}

function buildOutlookModel(label, dayDate) {
  const windows = scoreThreeHourWindows(dayDate);
  const best = windows[0] || null;
  const sun = getSunTimes(dayDate);

  return {
    label,
    dayDate,
    best,
    sun,
    strategy: strategyForWindow(best, dayDate)
  };
}

function buildWeekendModel() {
  const { saturday, sunday } = nextWeekendDates();

  const sat = buildOutlookModel("Weekend", saturday);
  const sun = buildOutlookModel("Weekend", sunday);

  if (!sat.best && !sun.best) return sat;
  if (!sat.best) return sun;
  if (!sun.best) return sat;

  return sat.best.score >= sun.best.score ? sat : sun;
}

function outlookCardHtml(model) {
  const { label, dayDate, best, sun, strategy } = model;

  if (!best) {
    return `
      <article class="outlook-item" style="--score-color: var(--muted)">
        <div class="outlook-top">
          <div>
            <div class="outlook-day">${escapeHtml(label)}</div>
            <div class="outlook-date">${escapeHtml(fmtDay(dayDate))}</div>
          </div>
          <div class="score-ring">—</div>
        </div>
        <div class="outlook-window">Forecast not available yet</div>
        <div class="outlook-meta">
          <span>Sunrise ${fmtTime(sun.sunrise)} • Sunset ${fmtTime(sun.sunset)}</span>
        </div>
      </article>
    `;
  }

  const reasonText =
    best.reasons.slice(0, 3).join(" • ");

  return `
    <article class="outlook-item" style="--score-color: ${scoreColor(best.score)}">
      <div class="outlook-top">
        <div>
          <div class="outlook-day">${escapeHtml(label)}</div>
          <div class="outlook-date">${escapeHtml(fmtDay(dayDate))}</div>
        </div>
        <div class="score-ring" title="${escapeHtml(scoreLabel(best.score))}">
          ${best.score}
        </div>
      </div>

      <div class="outlook-window">
        ${fmtTime(best.start)}–${fmtTime(best.end)}
      </div>

      <div class="outlook-strategy">
        <span class="label">Start here</span>
        <strong>${escapeHtml(strategy)}</strong>
      </div>

      <div class="outlook-meta">
        <span><strong>${escapeHtml(scoreLabel(best.score))}</strong> fishing opportunity</span>
        <span>Wind: ${best.wind ?? "—"} mph ${escapeHtml(best.windDirection)}</span>
        <span>Tide: ${escapeHtml(best.tideDirection)}</span>
        <span>Sunrise ${fmtTime(sun.sunrise)} • Sunset ${fmtTime(sun.sunset)}</span>
        <span>${escapeHtml(reasonText)}</span>
      </div>
    </article>
  `;
}

function buildOutlooks() {
  if (!state.forecast.length) return;

  const today = localDateAtMidnight(new Date());
  const tomorrow = addDays(today, 1);

  const models = [
    buildOutlookModel("Today", today),
    buildOutlookModel("Tomorrow", tomorrow),
    buildWeekendModel()
  ];

  $("outlookCards").innerHTML =
    models.map(outlookCardHtml).join("");
}

/* ---------- Fuel / logs ---------- */

function updateFuel() {
  const miles = Number($("tripMiles").value || 0);
  const mpg = Number($("mpgSelect").value || 3);
  const base = mpg > 0 ? miles / mpg : 0;
  const with20 = base * 1.2;

  $("fuelEstimate").textContent =
    `${base.toFixed(1)} gal estimated burn • ${with20.toFixed(1)} gal with a simple 20% planning buffer`;
}

function loadLog() {
  const entries =
    JSON.parse(localStorage.getItem("galvestonTripLog") || "[]");

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
  const entries =
    JSON.parse(localStorage.getItem("galvestonTripLog") || "[]");

  entries.unshift({
    date: new Date().toLocaleString(),
    spot: $("logSpot").value.trim(),
    result: $("logResult").value.trim(),
    notes: $("logNotes").value.trim()
  });

  localStorage.setItem(
    "galvestonTripLog",
    JSON.stringify(entries.slice(0, 50))
  );

  $("logSpot").value = "";
  $("logResult").value = "";
  $("logNotes").value = "";

  loadLog();
}

/* ---------- Map ---------- */

function initMap() {
  if (typeof L === "undefined") {
    $("zoneMap").innerHTML =
      `<div class="reason-box">Map library could not load. The rest of the fishing dashboard still works.</div>`;
    return;
  }

  state.map = L.map("zoneMap", {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([29.34, -94.83], 9);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors"
    }
  ).addTo(state.map);

  STRATEGY_ZONES.forEach(zone => {
    const marker =
      makeCircleMarker(zone.lat, zone.lon, zone.tone, 8)
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
    <button
      class="zone-card ${zone.key === state.recommendedZoneKey ? "recommended" : ""}"
      data-zone-key="${escapeHtml(zone.key)}"
      type="button"
    >
      <strong>${escapeHtml(zone.name)}</strong>
      <p>${escapeHtml(zone.summary)}</p>
      <span class="zone-tag">
        ${escapeHtml(
          zone.tone === "amber"
            ? "CURRENT"
            : zone.tone === "green"
            ? "STRUCTURE"
            : "WATER"
        )}
      </span>
    </button>
  `).join("");

  document.querySelectorAll(".zone-card").forEach(card => {
    card.addEventListener(
      "click",
      () => focusZone(card.dataset.zoneKey)
    );
  });
}

function updateRecommendedZone() {
  renderZoneCards();

  const zone =
    STRATEGY_ZONES.find(z => z.key === state.recommendedZoneKey);

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
  const zone =
    STRATEGY_ZONES.find(z => z.key === key);

  if (!zone || !state.map) return;

  state.map.flyTo(
    [zone.lat, zone.lon],
    11,
    { duration: .7 }
  );

  const marker =
    state.zoneMarkers.get(key);

  if (marker) marker.openPopup();
}

function getWaypoints() {
  try {
    return JSON.parse(
      localStorage.getItem("galvestonWaypoints") || "[]"
    );
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

  if (
    !Number.isFinite(lat) || lat < -90 || lat > 90 ||
    !Number.isFinite(lon) || lon < -180 || lon > 180
  ) {
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

  localStorage.setItem(
    "galvestonWaypoints",
    JSON.stringify(waypoints.slice(0, 100))
  );

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
  const waypoints =
    getWaypoints().filter(wp => wp.id !== id);

  localStorage.setItem(
    "galvestonWaypoints",
    JSON.stringify(waypoints)
  );

  renderUserWaypoints();
}

function renderUserWaypoints() {
  state.userMarkers.forEach(marker => {
    if (state.map) state.map.removeLayer(marker);
  });

  state.userMarkers = [];

  const waypoints = getWaypoints();

  $("waypointList").innerHTML =
    waypoints.length
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
          <button
            class="danger"
            data-delete-wp="${escapeHtml(wp.id)}"
            type="button"
          >
            Delete
          </button>
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
    const marker =
      makeCircleMarker(wp.lat, wp.lon, "user", 7)
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
      $("wpLat").value =
        position.coords.latitude.toFixed(6);

      $("wpLon").value =
        position.coords.longitude.toFixed(6);

      btn.textContent = original;
      btn.disabled = false;

      if (state.map) {
        state.map.flyTo(
          [
            position.coords.latitude,
            position.coords.longitude
          ],
          13,
          { duration: .7 }
        );
      }
    },
    error => {
      btn.textContent = original;
      btn.disabled = false;

      alert(
        `Could not get current position: ${error.message}`
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 15000
    }
  );
}

/* ---------- Refresh ---------- */

async function refreshLive() {
  $("liveStatus").textContent =
    "Refreshing live data…";

  const results =
    await Promise.allSettled([
      fetchTides(),
      fetchWeather(),
      fetchAlerts()
    ]);

  const failed =
    results.filter(r => r.status === "rejected");

  if (failed.length === 0) {
    $("liveStatus").textContent =
      "Live NOAA/NWS data loaded";

    $("liveStatus").className =
      "status-pill tone-green";
  } else if (failed.length < results.length) {
    $("liveStatus").textContent =
      "Partial live data loaded";

    $("liveStatus").className =
      "status-pill tone-water";

    failed.forEach(item =>
      console.warn(item.reason)
    );
  } else {
    $("liveStatus").textContent =
      "Live data unavailable — manual inputs still work";

    $("liveStatus").className =
      "status-pill grade-conditional";

    failed.forEach(item =>
      console.warn(item.reason)
    );
  }

  $("lastUpdated").textContent =
    `Updated ${new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    })}`;

  applyTheme();
  buildFishingCall();
  buildOutlooks();
}

/* ---------- Events ---------- */

$("refreshBtn").addEventListener(
  "click",
  refreshLive
);

$("claritySelect").addEventListener(
  "change",
  () => {
    buildFishingCall();
    buildOutlooks();
  }
);

$("timeSelect").addEventListener(
  "change",
  buildFishingCall
);

$("tripMiles").addEventListener(
  "input",
  updateFuel
);

$("mpgSelect").addEventListener(
  "change",
  updateFuel
);

$("saveLogBtn").addEventListener(
  "click",
  saveLog
);

$("saveWaypointBtn").addEventListener(
  "click",
  saveWaypoint
);

$("useLocationBtn").addEventListener(
  "click",
  useCurrentPosition
);

$("themeSelect").value = state.themeMode;

$("themeSelect").addEventListener(
  "change",
  event => {
    state.themeMode = event.target.value;

    localStorage.setItem(
      "galvestonThemeMode",
      state.themeMode
    );

    applyTheme();
  }
);

$("clearLogBtn").addEventListener(
  "click",
  () => {
    if (confirm("Clear all saved trip notes on this device?")) {
      localStorage.removeItem("galvestonTripLog");
      loadLog();
    }
  }
);

if ("serviceWorker" in navigator) {
  window.addEventListener(
    "load",
    () =>
      navigator.serviceWorker
        .register("./sw.js")
        .catch(console.warn)
  );
}

loadLog();
updateFuel();
applyTheme();
initMap();
refreshLive();

// Re-evaluate automatic day/night mode every 5 minutes.
setInterval(() => {
  if (state.themeMode === "auto") {
    applyTheme();
  }
}, 5 * 60 * 1000);
