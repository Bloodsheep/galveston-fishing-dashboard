# Galveston Fishing Dashboard — V2

V2 keeps the original phone-first dashboard and adds restrained color plus a fishing-zone / waypoint map.

## V2 changes

- Functional accent colors:
  - aqua/blue = water, tide and weather information
  - green = favorable / go
  - amber = conditional / current / caution
  - red = stronger caution
  - purple = sonar / personal waypoint accents
- Interactive Galveston-area map using Leaflet + OpenStreetMap.
- Five broad fishing strategy zones.
- The decision engine highlights the broad strategy-zone match for current conditions.
- Save your own exact latitude/longitude waypoints in the browser.
- "Use My Current Position" can populate a waypoint from your phone GPS.
- Existing NOAA tide, NWS weather, fuel estimator and trip log remain.

## Important map note

Preset strategy pins are approximate broad-area centers. They are NOT safe navigation waypoints,
routes, channel markers or recommended boat approaches.

Your personal waypoints are saved only in the current browser's local storage. Verify coordinates
before using them and use your Garmin/chartplotter and current nautical charts for navigation.

## Update the GitHub Pages site

If V1 is already working:

1. Unzip this folder.
2. In your GitHub repository, replace:
   - index.html
   - styles.css
   - app.js
   - sw.js
   - manifest.webmanifest
3. Commit the changes.
4. Wait for GitHub Pages to redeploy.
5. On your phone, reload the page.

If the old visual design sticks around because of the service worker, close the installed web app/browser tab
and open it again. The V2 service worker uses a new cache name.

## Run locally

Open the folder in VS Code and use Live Server, exactly like V1.

## Network behavior

The core app shell can be cached, but live NOAA/NWS data and map tiles require connectivity.
The map itself loads Leaflet from a CDN.

## Next logical V3

- Today / Tomorrow / Weekend planning
- sunrise/sunset
- marine forecast / wave conditions where appropriate
- rank zones by the upcoming fishing window instead of only current conditions
- export/import saved waypoints and trip logs
