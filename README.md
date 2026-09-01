# Galveston Fishing Dashboard — V4

V4 changes the app from a speckled-trout-focused dashboard into a species-aware Galveston fishing planner.

## Target Species

The top of the dashboard now includes:

- Speckled Trout
- Redfish
- Southern Flounder
- Sheepshead
- Black Drum
- Spanish Mackerel
- General Inshore

Speckled Trout remains the default.

Changing the target species changes:

- natural/live bait guidance
- artificial lure guidance
- suggested rig / presentation
- key structure
- current "What I Would Do" recommendation
- broad recommended fishing zones on the map
- map pins
- Fishing Outlook scoring adjustments
- best starting strategy
- personal waypoint filtering

## Personal waypoints

New saved waypoints can be tagged as:

- Current target species
- All species

Existing V2/V3 waypoints are preserved and treated as "All Species" so upgrading does not make them disappear.

## Preset map points

Preset colored points are broad strategy-area centers, NOT navigation waypoints.
They move/change when you choose another species.

Do not use them as:
- a safe route
- a channel marker
- a reef-edge coordinate
- an instruction to cross shallow water
- an approach line to rocks or jetties

Use current charts, your Garmin/chartplotter, seamanship and actual depth information for navigation.

## Bait logic

The initial profiles are intentionally practical rather than exhaustive:

- Trout: shrimp/croaker/baitfish + plastics/topwaters
- Redfish: shrimp/finger mullet/crab + spoons/plastics
- Flounder: mud minnows/shrimp + slow bottom jigs
- Sheepshead: crabs/shrimp tight to hard structure
- Black drum: shrimp/crab/squid/cut bait on bottom
- Spanish mackerel: baitfish + fast flashy metal/baitfish lures
- General Inshore: live shrimp as the universal first option

The app always links out to current TPWD regulations rather than treating cached size/bag limits as permanent.

## Deploy

If V3 is already on GitHub Pages:

1. Test V4 locally with Live Server.
2. Replace:
   - index.html
   - styles.css
   - app.js
   - sw.js
   - manifest.webmanifest
3. README.md is optional.
4. Commit.
5. Wait for GitHub Pages to redeploy.
6. Close/reopen the phone app if the previous service-worker cache is still visible.

Cache name: `galveston-fishing-v4`.

## Future expansion

Good V4.x additions would be:

- official TPWD artificial-reef datasets / coordinates
- import/export Garmin-compatible waypoint files where technically appropriate
- species-specific seasonal behavior
- bait-shop inventory / shopping checklist
- catch-log analytics by species, tide, wind, bait and waypoint
- automatic "what should we target today?" mode
