# Galveston Fishing Dashboard

A phone-friendly fishing dashboard built with plain HTML, CSS, and JavaScript.

## What it does

- Loads NOAA high/low tide predictions for Galveston Pier 21 (station 8771450).
- Loads the NWS hourly forecast for Galveston.
- Combines tide direction, wind, user-selected water clarity, and time of day into a simple fishing call.
- Includes the Tidewater 272 CC quick reference and a rough fuel estimator.
- Saves trip notes locally on the device.
- Includes a service worker so the app shell can still open offline. Live NOAA/NWS data still requires internet access.

## Run it locally

The simplest method is VS Code + the Live Server extension.

1. Open this folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click `index.html`.
4. Choose "Open with Live Server".

You can also use Python if it is installed:

    python -m http.server 8000

Then visit:

    http://localhost:8000

## Publish with GitHub Pages

1. Create a GitHub repository named `galveston-fishing-dashboard`.
2. Upload all files in this folder to the repository root.
3. In the repo open Settings > Pages.
4. Under Build and deployment choose `Deploy from a branch`.
5. Select branch `main` and folder `/(root)`.
6. Save.
7. GitHub will provide the public Pages URL when deployment finishes.

## Main files

- `index.html` - page structure
- `styles.css` - phone-first design
- `app.js` - NOAA/NWS requests and fishing recommendation logic
- `manifest.webmanifest` - installable-web-app metadata
- `sw.js` - offline app-shell caching

## Important

This is a fishing planning aid, not a marine navigation or safety system. Verify marine weather, lightning, sea state, hazards, fuel, and current regulations before each trip.
