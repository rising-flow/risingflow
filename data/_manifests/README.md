Data manifests for Rising Flow

Place lightweight JSON manifests here to avoid directory scanning from the client.

Recommended files:
- `events.json` — lists `upcoming` and `past` event folder names (strings)
- `games.json` — optional list of available game folders for the song browser

Example `events.json`:

```
{
  "upcoming": ["Cosgeek 2025"],
  "past": ["event-002"]
}
```

Notes:
- Keep manifests small. They are fetched at runtime by `js/services/EventService.js`.
- If a manifest is missing, services fall back to legacy placeholder behavior. Create manifests to make listing reliable.
