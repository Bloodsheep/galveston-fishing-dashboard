const GALVESTON = {
  lat: 29.31,
  lon: -94.79331,
  tideStation: "8771450"
};

const SPECIES_PROFILES = {
  trout: {
    name: "Speckled Trout",
    shortName: "Trout",
    bait: "Live shrimp; croaker; finger mullet / pinfish",
    artificial: "Soft plastics, topwaters, spoons, suspending plugs",
    rig: "Popping cork + shrimp; free-shrimp drift; 1/8–1/4 oz jighead",
    structure: "Oyster/shell reefs, grass edges, marsh edges, channels, bird schools",
    tip: "Warm weather: shallow early/late, then slide toward deeper drop-offs, channels or reef edges as the day heats up.",
    regs: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/saltwater-fishing/bag-length-limits/seatrout-bag-length-limits",
    scoring: "dawn_tide",
    zones: [
      {key:"east-bay", name:"East Bay Shell / Reef Country", lat:29.49, lon:-94.67, tone:"water",
       summary:"Broad shell/reef search area for bait, harder bottom and repeatable contour changes.",
       tactic:"Controlled drift across productive shell; mark bite depth and repeat outside the school."},
      {key:"jetties", name:"Galveston Jetties / Bay Entrance", lat:29.35, lon:-94.71, tone:"amber",
       summary:"Gulf-water exchange, current seams and bait movement when conditions allow.",
       tactic:"Fish the seam from safe water; keep ship traffic and rock clearance primary."},
      {key:"lower-bay", name:"Lower Bay / Texas City Side", lat:29.38, lon:-94.86, tone:"green",
       summary:"Broad reef/structure option when wind and current set up a manageable drift.",
       tactic:"Scan shell/structure first, then set repeatable wind-driven passes."},
      {key:"west-bay", name:"West Bay Reefs / Shorelines", lat:29.20, lon:-95.02, tone:"green",
       summary:"Reefs, shorelines and drains can all produce when bait and moving water intersect.",
       tactic:"Match the drift to the tide and keep the big engines away from shallow fish."},
      {key:"beachfront", name:"Galveston Beachfront / Surf", lat:29.25, lon:-94.82, tone:"water",
       summary:"Clean-water option in manageable wind/swell, especially around dawn.",
       tactic:"Work guts/bars parallel to shore from safe water; follow bait movement."}
    ]
  },

  redfish: {
    name: "Redfish",
    shortName: "Reds",
    bait: "Live shrimp; finger mullet; croaker; small blue crab; cut mullet for larger fish",
    artificial: "Gold/silver spoons, shrimp-style plastics, paddletails, shallow plugs",
    rig: "Popping cork in shallows; free-lined shrimp; slip-sinker/bottom rig for baitfish or crab",
    structure: "Shallow bay edges, oyster reefs, marsh drains, points, guts, jetties and pilings",
    tip: "Think edges and bottom food. On outgoing water, drains become especially interesting; on incoming water, work flooded shoreline/reef edges.",
    regs: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/saltwater-fishing/bag-length-limits/drum-bag-length-limits/",
    scoring: "tide_edges",
    zones: [
      {key:"west-marsh", name:"West Bay Marsh / Drain Country", lat:29.19, lon:-95.07, tone:"green",
       summary:"Broad shallow-edge and drain strategy area for reds moving with bait.",
       tactic:"Outgoing: sit outside drain mouths. Incoming: work flooded edges and points."},
      {key:"east-reef", name:"East Bay Oyster / Shoreline Edges", lat:29.50, lon:-94.67, tone:"water",
       summary:"Oyster and shoreline breaks provide bottom forage and ambush edges.",
       tactic:"Keep the boat on the deeper side and cast across shell/shoreline transitions."},
      {key:"jetties-red", name:"Jetties / Pass — Bull Red Option", lat:29.34, lon:-94.70, tone:"amber",
       summary:"Pass/current habitat can hold larger red drum; this is the exposed-water option.",
       tactic:"Natural bait near bottom where legal/safe; prioritize current, traffic and sea-state safety."},
      {key:"lower-red", name:"Lower Bay Points / Structure", lat:29.36, lon:-94.88, tone:"green",
       summary:"Broad structure/point option when wind makes the far-open bay less attractive.",
       tactic:"Search shoreline breaks, shell and current edges rather than featureless water."}
    ]
  },

  flounder: {
    name: "Southern Flounder",
    shortName: "Flounder",
    bait: "Mud minnows / killifish; live shrimp; small baitfish",
    artificial: "Soft-plastic jigs worked slowly along bottom; shallow spoons around vegetation",
    rig: "Bottom-oriented jig or Carolina/slip-style bait rig; slow presentation",
    structure: "Channel edges, passes, jetties, oyster reefs, bayou/slough mouths and muddy back-bay edges",
    tip: "Flounder are ambush fish. Slow down, stay close to bottom, and concentrate on chokepoints rather than covering huge featureless flats.",
    regs: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/saltwater-fishing/bag-length-limits/flounder-bag-length-limits",
    scoring: "bottom_current",
    zones: [
      {key:"flounder-pass", name:"Galveston Pass / Channel Edges", lat:29.34, lon:-94.72, tone:"amber",
       summary:"Broad migration/current chokepoint around bay-to-Gulf connections.",
       tactic:"Work bottom transitions and current breaks without obstructing navigation."},
      {key:"west-drains", name:"West Bay Bayou / Drain Mouths", lat:29.20, lon:-95.03, tone:"green",
       summary:"Muddy back-bay edges, drains and slough mouths fit flounder ambush behavior.",
       tactic:"Slow bait or jig across the mouth and along the first depth change."},
      {key:"lower-channel", name:"Lower Bay Channel / Reef Edges", lat:29.37, lon:-94.87, tone:"water",
       summary:"Channel edges and oyster/structure transitions concentrate bottom-oriented ambush water.",
       tactic:"Graph the break, then work it slowly rather than drifting too fast."},
      {key:"jetty-flounder", name:"Jetty / Rock Transition", lat:29.33, lon:-94.71, tone:"amber",
       summary:"Rock-to-bottom transitions can funnel prey and hold flounder.",
       tactic:"Fish the softer edge next to hard structure while maintaining safe rock clearance."}
    ]
  },

  sheepshead: {
    name: "Sheepshead",
    shortName: "Sheepshead",
    bait: "Fiddler crabs; small crabs; shrimp; other shellfish-style natural baits",
    artificial: "Small crab/shrimp imitations where practical; natural bait is usually the simpler starting point",
    rig: "Small strong hook, minimal weight needed to stay tight to structure",
    structure: "Jetties, rock piles, reefs, bridge/pier pilings and barnacle-covered hard structure",
    tip: "This is a structure game. Get the bait very close to hard substrate, keep contact, and be ready for subtle bites before the fish steals the bait.",
    regs: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/saltwater-fishing/bag-length-limits/sheepshead-bag-length-limits",
    scoring: "hard_structure",
    zones: [
      {key:"sheep-jetties", name:"Galveston Jetties", lat:29.34, lon:-94.70, tone:"amber",
       summary:"Classic hard-structure habitat with rocks, barnacles and current.",
       tactic:"Fish tight to structure from a safe boat position; current determines weight."},
      {key:"sheep-dike", name:"Texas City Dike / Hard Structure", lat:29.38, lon:-94.89, tone:"green",
       summary:"Broad hard-structure strategy area with pilings/rock-style habitat nearby.",
       tactic:"Probe structure vertically or with short controlled casts; avoid snag-heavy overcasting."},
      {key:"sheep-lower", name:"Lower Bay Pilings / Reef Structure", lat:29.35, lon:-94.85, tone:"water",
       summary:"Look for barnacle-covered pilings, rock, shell and other hard substrate.",
       tactic:"Use sonar/chart structure as confirmation, then fish physically tight to the target."}
    ]
  },

  blackdrum: {
    name: "Black Drum",
    shortName: "Black Drum",
    bait: "Shrimp; crab; squid; cut fish",
    artificial: "Natural bait is the primary starting point; scent and bottom placement matter more than lure flash",
    rig: "Bottom rig or light drop rig with enough weight to maintain bottom contact",
    structure: "Channels, passes, reefs, jetties, pilings and bottom transitions",
    tip: "Think smell, bottom and current. Put the bait where drum can find it and avoid moving too quickly when fish are holding on a bottom feature.",
    regs: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/saltwater-fishing/bag-length-limits/drum-bag-length-limits/",
    scoring: "bottom_current",
    zones: [
      {key:"drum-channel", name:"Lower Bay / Channel Structure", lat:29.37, lon:-94.86, tone:"water",
       summary:"Channels and bottom transitions are practical places to search for drum.",
       tactic:"Graph bottom changes and fish bait on or immediately beside the feature."},
      {key:"drum-jetties", name:"Jetties / Pass Current", lat:29.34, lon:-94.70, tone:"amber",
       summary:"Hard structure plus current and shellfish forage can suit black drum.",
       tactic:"Use enough weight for bottom contact while keeping a safe current/rock position."},
      {key:"drum-east", name:"East Bay Reef / Shell", lat:29.48, lon:-94.69, tone:"green",
       summary:"Shell and bottom forage make reef country worth checking.",
       tactic:"Fish the bottom on the edge rather than parking directly over the structure."}
    ]
  },

  spanish: {
    name: "Spanish Mackerel",
    shortName: "Spanish",
    bait: "Small live baitfish; shrimp can work when fish are mixed on bait",
    artificial: "Fast flashy spoons, small metal jigs and baitfish-profile lures",
    rig: "Cast/retrieve or troll flashy baitfish presentations; use bite-resistant leader only as needed",
    structure: "Beachfront/nearshore bait, jetties, passes, channel entrances and surface-feeding schools",
    tip: "This is a clean-water, bait-school search. Look for birds, nervous bait and fast-moving surface activity; keep presentations moving.",
    regs: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/saltwater-fishing/bag-length-limits/mackerel-bag-length-limits",
    scoring: "clean_bait",
    zones: [
      {key:"spanish-beach", name:"Beachfront / Nearshore Bait", lat:29.25, lon:-94.80, tone:"water",
       summary:"Broad nearshore search area when water is clean and sea state is manageable.",
       tactic:"Search for birds/bait and work parallel to moving schools without running through them."},
      {key:"spanish-jetties", name:"Jetties / Gulf Side", lat:29.32, lon:-94.68, tone:"amber",
       summary:"Pass current and bait concentration can attract mackerel.",
       tactic:"Cast flashy lures through bait/current edges while maintaining safe clearance."},
      {key:"spanish-entrance", name:"Bay Entrance / Channel Edge", lat:29.36, lon:-94.73, tone:"green",
       summary:"Moving water around the entrance can collect bait and predators.",
       tactic:"Watch for surface life first; use sonar only to help track the school after visual contact."}
    ]
  },

  general: {
    name: "General Inshore",
    shortName: "Inshore",
    bait: "Live shrimp is the best universal starting bait; finger mullet / baitfish are a strong second option",
    artificial: "Soft plastics, spoons and small baitfish-profile lures",
    rig: "Popping cork + shrimp or a simple jighead; adjust depth/weight to current",
    structure: "Reefs, marsh drains, shoreline points, passes, jetties and bait schools",
    tip: "When you do not care which species bites first, prioritize bait + structure + moving water and let the signs tell you what is feeding.",
    regs: "https://tpwd.texas.gov/regulations/outdoor-annual/fishing/",
    scoring: "general",
    zones: [
      {key:"general-east", name:"East Bay Reef Country", lat:29.49, lon:-94.67, tone:"water",
       summary:"Shell/reef search water for mixed inshore species.",
       tactic:"Find bait and hard bottom, then make controlled passes."},
      {key:"general-west", name:"West Bay Drains / Shorelines", lat:29.20, lon:-95.02, tone:"green",
       summary:"Drains and shoreline breaks can produce a mixed bag on moving water.",
       tactic:"Match position to current direction and fish the edge, not dead water."},
      {key:"general-jetties", name:"Galveston Jetties / Pass", lat:29.34, lon:-94.70, tone:"amber",
       summary:"High-diversity structure/current option when sea state and traffic permit.",
       tactic:"Let bait/current dictate the target depth while keeping safety first."},
      {key:"general-lower", name:"Lower Bay Structure", lat:29.38, lon:-94.86, tone:"green",
       summary:"A practical structure-focused area when conditions push you away from exposed water.",
       tactic:"Use sonar to identify bottom changes and bait, then fish the most active edge."}
    ]
  }
};

function currentProfile() {
  return SPECIES_PROFILES[state.selectedSpecies] || SPECIES_PROFILES.trout;
}

function currentZones() {
  return currentProfile().zones;
}

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
  themeMode: localStorage.getItem("galvestonThemeMode") || "auto",
  selectedSpecies: localStorage.getItem("galvestonTargetSpecies") || "trout"
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

  currentZones().forEach(zone => {
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
  const species = state.selectedSpecies;

  if (wind !== null && wind >= 20) {
    if (species === "spanish") return "spanish-entrance";
    if (species === "redfish") return "lower-red";
    if (species === "flounder") return "lower-channel";
    if (species === "sheepshead") return "sheep-lower";
    if (species === "blackdrum") return "drum-channel";
    if (species === "general") return "general-lower";
    return "lower-bay";
  }

  if (species === "redfish") {
    if (tide === "Outgoing") return "west-marsh";
    if (tide === "Incoming") return "east-reef";
    return wind !== null && wind >= 15 ? "lower-red" : "west-marsh";
  }

  if (species === "flounder") {
    if (tide === "Outgoing") return "west-drains";
    if (tide === "Incoming") return "flounder-pass";
    return "lower-channel";
  }

  if (species === "sheepshead") {
    return wind !== null && wind >= 15 ? "sheep-lower" : "sheep-jetties";
  }

  if (species === "blackdrum") {
    return tide === "Incoming" || tide === "Outgoing"
      ? "drum-jetties"
      : "drum-channel";
  }

  if (species === "spanish") {
    if (clarity === "green" && (wind === null || wind <= 12)) return "spanish-beach";
    return "spanish-entrance";
  }

  if (species === "general") {
    if (wind !== null && wind >= 15) return "general-lower";
    if (tide === "Outgoing") return "general-west";
    if (tide === "Incoming") return "general-east";
    return "general-jetties";
  }

  // Speckled trout default.
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

function updateSpeciesPlan() {
  const profile = currentProfile();

  $("speciesTitle").textContent = profile.name;
  $("speciesBait").textContent = profile.bait;
  $("speciesArtificial").textContent = profile.artificial;
  $("speciesRig").textContent = profile.rig;
  $("speciesStructure").textContent = profile.structure;
  $("speciesTip").textContent = profile.tip;
  $("speciesRegLink").href = profile.regs;

  $("speciesBadge").textContent = profile.shortName.toUpperCase();
}

function buildFishingCall() {
  const clarity = $("claritySelect").value;
  const time = $("timeSelect").value;
  const tide = state.tideDirection;
  const wind = state.windMph;
  const profile = currentProfile();

  let grade = "GO";
  let presentation = profile.rig;
  let boat = "Approach quietly from upwind/upcurrent and keep the big engines off the fish.";
  let sonar = "Use chart/SideVü to find structure or bait, then live/forward view to confirm fish position.";
  const reasons = [];

  if (wind !== null) {
    if (wind >= 20) {
      grade = "CAUTION";
      boat = "Protected water only if conditions are otherwise safe; do not force exposed water.";
      reasons.push(`Wind is around ${wind} mph: strong-wind penalty and potential open-water no-go.`);
    } else if (wind >= 15) {
      grade = "CONDITIONAL";
      boat = "Favor protected structure and short controlled drifts.";
      reasons.push(`Wind is around ${wind} mph: favor protected water.`);
    } else if (wind >= 5) {
      reasons.push(`Wind is around ${wind} mph: useful for controlled boat positioning.`);
    } else {
      reasons.push(`Wind is light at about ${wind} mph: stealth matters.`);
    }
  }

  if (tide === "Incoming") {
    reasons.push("Incoming tide is moving bait and water inward.");
  } else if (tide === "Outgoing") {
    reasons.push("Outgoing tide can concentrate bait around drains, cuts and down-current edges.");
  }

  if (clarity === "muddy") {
    reasons.push("Muddy/chocolate water: prioritize cleaner-water edges or species that rely less on sight.");
  } else if (clarity === "green") {
    reasons.push("Green/clean water supports longer visual range and natural presentations.");
  } else {
    reasons.push("Stained/fishable water is a strong general inshore condition.");
  }

  // Species-specific current presentation / sonar guidance.
  if (state.selectedSpecies === "redfish") {
    presentation = tide === "Outgoing"
      ? "Shrimp/finger mullet near drain mouths; spoon or paddletail along the edge"
      : "Popping cork + shrimp or spoon/plastic across flooded shoreline and oyster edges";
    sonar = "Use SideVü/chart to locate oyster/shoreline breaks; in very shallow water, visual bait/tailing signs beat sonar.";
  } else if (state.selectedSpecies === "flounder") {
    presentation = "Mud minnow or shrimp, or a soft-plastic jig worked slowly along bottom";
    sonar = "Find the channel/reef/bottom transition first; flounder are an ambush-bottom target, so work the edge slowly.";
    boat = "Hold off the edge and cast across the chokepoint; avoid drifting too fast over the target.";
  } else if (state.selectedSpecies === "sheepshead") {
    presentation = "Fiddler/small crab or shrimp tight to hard structure with minimal necessary weight";
    sonar = "Use sonar/chart to identify pilings, rock and hard structure, then fish physically tight to it.";
    boat = "Hold a safe casting/vertical-fishing distance from rocks or pilings; current dictates weight.";
  } else if (state.selectedSpecies === "blackdrum") {
    presentation = "Shrimp, crab, squid or cut bait on/near bottom";
    sonar = "Graph bottom transitions and structure; focus on bottom contact rather than chasing suspended marks.";
    boat = "Hold upcurrent of the bottom feature and let bait settle into the strike zone.";
  } else if (state.selectedSpecies === "spanish") {
    presentation = "Fast flashy spoon or small baitfish lure; follow visible bait schools";
    sonar = "Birds and surface bait are primary; use forward sonar to follow school direction after locating activity.";
    boat = "Approach from outside the school and intercept; never run the boat through feeding fish.";
    if (clarity === "muddy") reasons.push("Spanish mackerel strongly favor a cleaner-water/bait-school search in this heuristic.");
  } else if (state.selectedSpecies === "general") {
    presentation = "Live shrimp under a cork or simple soft plastic; let bait signs decide the next adjustment";
    sonar = "Find bait + structure first, then identify whether fish are shallow, suspended or bottom-oriented.";
  } else {
    // Trout
    presentation = (time === "pre" || time === "morning")
      ? "Topwater first; then 1/8 oz plastic or live shrimp/croaker"
      : "Natural soft plastic or live bait; move deeper as heat builds";
    sonar = "Use SideVü/chart for reef edges and live/forward sonar for bait/fish; mark exact bite depth.";
  }

  state.recommendedZoneKey = chooseStrategyZone({ tide, clarity, wind, time });
  const chosenZone = currentZones().find(z => z.key === state.recommendedZoneKey);

  $("callGrade").textContent = grade;
  setGradeStyle(grade);
  $("zoneCall").textContent = chosenZone?.name || "Find bait + structure + moving water";
  $("presentationCall").textContent = presentation;
  $("boatCall").textContent = boat;
  $("sonarCall").textContent = sonar;
  $("reasoning").textContent = `${profile.name}: ${reasons.join(" ")}`;

  updateSpeciesPlan();
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

function speciesScoreModifier({ date, wind, tide, clarity, sunTimes }) {
  const profile = currentProfile();
  let modifier = 0;

  const fromSunrise = sunTimes.sunrise
    ? (date.getTime() - sunTimes.sunrise.getTime()) / 3600000
    : null;

  const daylight =
    sunTimes.sunrise && sunTimes.sunset
      ? date >= sunTimes.sunrise && date <= sunTimes.sunset
      : true;

  switch (profile.scoring) {
    case "dawn_tide":
      if (fromSunrise !== null && fromSunrise >= -1 && fromSunrise <= 2.5) modifier += 5;
      if (wind !== null && wind >= 5 && wind <= 12) modifier += 3;
      break;

    case "tide_edges":
      if (tide.direction !== "Unknown") modifier += 5;
      if (wind !== null && wind <= 15) modifier += 2;
      break;

    case "bottom_current":
      if (tide.direction !== "Unknown") modifier += 5;
      if (wind !== null && wind <= 15) modifier += 2;
      break;

    case "hard_structure":
      if (tide.direction !== "Unknown") modifier += 4;
      if (wind !== null && wind <= 15) modifier += 3;
      break;

    case "clean_bait":
      if (clarity === "green") modifier += 8;
      if (clarity === "muddy") modifier -= 10;
      if (daylight) modifier += 5;
      if (wind !== null && wind <= 12) modifier += 3;
      break;

    default:
      break;
  }

  return modifier;
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

  const speciesModifier = speciesScoreModifier({
    date,
    wind,
    tide,
    clarity,
    sunTimes
  });

  score += speciesModifier;

  if (speciesModifier > 0) reasons.push(`${currentProfile().shortName.toLowerCase()} habitat/timing boost`);
  if (speciesModifier < 0) reasons.push(`${currentProfile().shortName.toLowerCase()} condition penalty`);

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

  return currentZones().find(zone => zone.key === key)?.name || "Find bait + structure";
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

  renderSpeciesMap();
  renderUserWaypoints();
}

function clearSpeciesMarkers() {
  state.zoneMarkers.forEach(marker => {
    if (state.map) state.map.removeLayer(marker);
  });
  state.zoneMarkers.clear();
}

function renderSpeciesMap() {
  if (!state.map || typeof L === "undefined") return;

  clearSpeciesMarkers();

  currentZones().forEach(zone => {
    const marker =
      makeCircleMarker(zone.lat, zone.lon, zone.tone, 8)
        .addTo(state.map)
        .bindPopup(`
          <strong>${escapeHtml(zone.name)}</strong>
          <p>${escapeHtml(zone.summary)}</p>
          <small>${escapeHtml(currentProfile().name)} strategy area — approximate, not a navigation waypoint.</small>
        `);

    marker.on("click", () => focusZone(zone.key));
    state.zoneMarkers.set(zone.key, marker);
  });

  renderZoneCards();
  updateRecommendedZone();
}

function renderZoneCards() {
  $("zoneCards").innerHTML = currentZones().map(zone => `
    <button
      class="zone-card ${zone.key === state.recommendedZoneKey ? "recommended" : ""}"
      data-zone-key="${escapeHtml(zone.key)}"
      type="button"
    >
      <strong>${escapeHtml(zone.name)}</strong>
      <p>${escapeHtml(zone.summary)}</p>
      <span class="zone-tag">${escapeHtml(currentProfile().shortName.toUpperCase())}</span>
    </button>
  `).join("");

  document.querySelectorAll(".zone-card").forEach(card => {
    card.addEventListener("click", () => focusZone(card.dataset.zoneKey));
  });
}

function updateRecommendedZone() {
  renderZoneCards();

  const zone = currentZones().find(z => z.key === state.recommendedZoneKey);
  if (!zone) return;

  $("recommendedZoneBanner").innerHTML =
    `<strong>${escapeHtml(currentProfile().name)} starting-area match:</strong> ${escapeHtml(zone.name)} — ${escapeHtml(zone.tactic)}`;

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
  const zone = currentZones().find(z => z.key === key);
  if (!zone || !state.map) return;

  state.map.flyTo([zone.lat, zone.lon], 11, { duration: .7 });

  const marker = state.zoneMarkers.get(key);
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
  const speciesChoice = $("wpSpecies").value;
  const species = speciesChoice === "current" ? state.selectedSpecies : speciesChoice;
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
    species,
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

  const allWaypoints = getWaypoints();

  // Backward compatibility: V2/V3 waypoints had no species tag.
  const waypoints = allWaypoints.filter(wp => {
    const tag = wp.species || "all";
    return tag === "all" || tag === state.selectedSpecies;
  });

  $("waypointList").innerHTML =
    waypoints.length
      ? waypoints.map(wp => {
          const speciesKey = wp.species || "all";
          const speciesName =
            speciesKey === "all"
              ? "All Species"
              : (SPECIES_PROFILES[speciesKey]?.name || speciesKey);

          return `
            <div class="waypoint-item">
              <div>
                <strong>${escapeHtml(wp.name)}</strong>
                <div class="waypoint-meta">
                  <span class="waypoint-species-chip">${escapeHtml(speciesName)}</span>
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
          `;
        }).join("")
      : `<p class="muted small">No personal waypoints saved for ${escapeHtml(currentProfile().name)} on this device yet.</p>`;

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

$("speciesSelect").value = state.selectedSpecies;

$("speciesSelect").addEventListener(
  "change",
  event => {
    state.selectedSpecies = event.target.value;

    localStorage.setItem(
      "galvestonTargetSpecies",
      state.selectedSpecies
    );

    // New waypoints default to tagging the current target.
    $("wpSpecies").value = "current";

    buildFishingCall();
    renderSpeciesMap();
    renderUserWaypoints();
    refreshMarkerColors();
  }
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
$("speciesSelect").value = state.selectedSpecies;
updateSpeciesPlan();
applyTheme();
initMap();
refreshLive();

// Re-evaluate automatic day/night mode every 5 minutes.
setInterval(() => {
  if (state.themeMode === "auto") {
    applyTheme();
  }
}, 5 * 60 * 1000);
