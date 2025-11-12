Rising Flow — data/ folder guide

This folder contains JSON data used by the site (events, songs, game manifests).

Goals:
- Use small manifest files to list folders and important files rather than scanning directories from client-side code.
- Keep large datasets as static JSON under `data/` and reference them directly from services.

Recommended structure:

- data/
  - _manifests/
    - events.json        # lists upcoming/past event folder names
    - games.json         # optional: list game folders for song search
  - events/
    - upcoming/<folder>/event.json
    - past/<folder>/event.json
  - Stepmania/           # lots of JSON files (leave as-is)
  - Project Diva/
  - Taiko no Tatsujin/
  - YARG/

Tooling:
- Use a local script (provided under `tools/`) to generate/update manifests based on the filesystem.
- Keep manifests small and commit them. Avoid running directory scans in browser code.

Services:
- `js/services/EventService.js` will attempt to read `/data/_manifests/events.json` and fall back to legacy placeholders if missing.
- `js/services/SongService.js` reads files directly but can be extended to use a `games.json` manifest.
