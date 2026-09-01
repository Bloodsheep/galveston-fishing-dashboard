# Galveston Fishing Dashboard — V3

V3 adds daylight readability and trip planning on top of V2.

## Major V3 additions

### Automatic day/night display
Choose:
- Auto: Day / Night
- Day: High Contrast
- Night: Dark Marine

Auto uses Galveston sunrise/sunset timing to switch the display. The daytime theme uses a bright,
high-contrast marine palette intended to be easier to read outdoors. Your choice is saved in this browser.

### Fishing Outlook
The dashboard now creates:
- Today
- Tomorrow
- Weekend

Each card includes:
- fishing-opportunity score from 0–100
- best available 3-hour fishing window
- projected wind
- projected tide direction
- sunrise and sunset
- broad starting strategy zone
- a few of the reasons affecting the score

Scores use NOAA tide predictions, the NWS hourly forecast, selected water clarity, time relative to
sunrise/sunset, and simple forecast-language penalties.

IMPORTANT: the score is NOT a boating-safety score.

### NWS alert awareness
The app checks active NWS alerts for the Galveston coordinate and surfaces an alert banner when one exists.

### Existing V2 features retained
- Live NOAA tide predictions
- NWS hourly weather
- current fishing recommendation engine
- interactive strategy map
- personal saved waypoints
- phone GPS waypoint capture
- fuel estimate
- trip log
- offline app-shell caching

## Update the GitHub Pages site

If V2 is already deployed:

1. Test V3 locally using Live Server.
2. Replace these files in the existing GitHub repository:
   - index.html
   - styles.css
   - app.js
   - sw.js
   - manifest.webmanifest
3. README.md is optional.
4. Commit the changes.
5. Wait for GitHub Pages to redeploy.
6. Fully close and reopen the phone web app/browser page if an older cached version appears.

The service-worker cache name is bumped to `galveston-fishing-v3`.

## Day mode recommendation

Leave Display set to `Auto: Day / Night`.

Use manual Day mode if:
- you are in bright sun but Auto has not switched yet,
- you want maximum contrast at the console,
- or you are reviewing the app outdoors near sunrise/sunset.

Use Night mode when:
- running before sunrise,
- avoiding glare at the helm,
- or viewing indoors.

## Safety

A high fishing score means the fishing variables appear favorable under the app's simple heuristic.
It does not mean the Gulf, bay, jetties, passes, or surf are safe to operate in.

Always verify current:
- marine forecast
- warnings/advisories
- lightning
- seas / swell
- visibility
- currents
- navigation hazards
- fuel
- Texas fishing regulations
