# Agent Quick Guide — Rising Flow (JS)

Purpose: provide a compact, high-signal reference an automated agent (or developer) can use to implement new features quickly without reading the whole repository. Keep this file as the canonical short-form reference for architecture, visual structure, and JSON data handling.

## 1. Visual Guide (UI map)
This section maps visible pages/components to the JS modules and DOM entry points.

- Pages and their entry points
  - Home (`index.html`)
    - Entry module: `js/main.js` (global init)
    - UI elements: `#language-flag`, `#hero-announcer`, `#pixelBlockModal`
  - Events pages (`upcoming_events.html`, `past_events.html`)
    - Entry module: `js/pages/events.js`
    - DOM containers: `#upcoming-events-container`, `#past-events-container`
    - Modals: `#eventDetailsModal`, `#eventGalleryModal`
  - Song Search (`song_search.html`)
    - Entry module: `js/pages/song-search.js`
    - DOM containers: `#category-list`, `#filter-input`, `#filter-tags`, `#game-selection`
  - Contact (`contact.html`)
    - Entry module: `js/pages/contact.js`
    - DOM elements: `#contact-form`, `#contact-title`, `#thankYouModal`
  - Pixel Block (`pixel_block.html`)
    - Entry module: `js/pages/pixel-block.js`
    - DOM elements: gallery `.gallery-item`, `#imageModal`, `#purchase-btn`

- Shared utilities/components
  - `js/components/LanguageSwitcher.js` — language state and translations
    - Use: `window.getCurrentLang()` or import `LanguageSwitcher`
  - `js/components/UIManager.js` — modal creation, show/hide, helpers
    - Use: `const ui = new UIManager()` or `window.uiManager`
  - `js/main.js` — bootstraps LanguageSwitcher and UIManager on page load

## 2. Architecture Guide (how to add a feature)
Follow these steps when implementing a new feature or page. The goal is minimal reading and safe, predictable edits.

1. Pick the target page (or create a new HTML file).
   - If the feature is global (e.g., site-wide banner), modify `js/main.js` or add a component in `js/components/`.
   - If the feature is page-specific, add code in `js/pages/<feature>.js` and wire it in the HTML with a module script tag.

2. Create a new module file under the correct folder:
   - Reusable UI: `js/components/MyComponent.js` (export default class MyComponent)
   - Data operations: `js/services/MyService.js` (export functions)
   - Page logic: `js/pages/my-feature.js` (initialize on DOMContentLoaded)

3. Data flow rules
   - Services return plain JS objects/arrays (no DOM). Keep network calls in `services`.
   - Pages import services and UI components and handle DOM updates only.
   - UIManager handles modals and consistent UIs across pages.

4. Language support
   - Use `window.getCurrentLang()` and define `updateUI()` function on your page class.
   - The LanguageSwitcher will call `window.update<YourPage>PageUI` automatically when languages change.

5. Export and Legacy Integration
   - Make page update callable globally: `window.updateMyPageUI = () => page.updateUI();`
   - Avoid polluting `window` for new features unless backward compatibility is required.

6. Testing minimal:
   - Quick manual smoke tests: open HTML, check console for errors, test interactions.

## 3. Reading JSON Guide (data shapes & common locations)
Rising Flow stores all content as JSON files under `data/`. Services already implemented show common patterns.

- Events
  - Location: `data/events/upcoming/<eventFolder>/event.json` and `data/events/past/<eventFolder>/event.json`
  - Typical shape (example):
    ```json
    {
      "id": "cosgeek2025",
      "title": "Cosgeek 2025",
      "description": "Evento de games e cultura pop...",
      "starting_date": "2025-03-12",
      "ending_date": "2025-03-14",
      "title_image": "cover.jpg",
      "location": "São Paulo",
      "games": ["DDR", "Taiko"],
      "instagram_url": "https://instagram.com/_risingflow",
      "website_url": "https://risingflow.example",
      "gallery_images": ["1.jpg", "2.jpg"],
      "winner": "Jogador 1",
      "participants_count": 32
    }
    ```
  - Use `js/services/EventService.js#getAllEvents()` to load and process events.

- Songs (multiple formats)
  - Stepmania (folder of numbered JSON files): `data/Stepmania/*.json` — categories per file
  - Project Diva: `data/Project Diva/project_diva.json` — single file
  - Taiko: several files under `data/Taiko no Tatsujin/*.json`
  - YARG: `data/YARG/yarg_songs.json`

  - Songs shape (example for Stepmania):
    ```json
    {
      "title": "Song Title",
      "title_translit": "Song Title Translit",
      "artist": "Artist",
      "artist_translit": "Artist Translit",
      "subtitle": "Subtitle",
      "subtitle_translit": "Subtitle Translit",
      "single_difficulties": {"Beginner": "1", "Easy": "4", "Medium": "7"},
      "double_difficulties": {"Beginner": "N/A"}
    }
    ```

  - For YARG, songs include `difficulties` object with `guitar`, `bass`, `drums`, `vocals`, etc.

- Best practices when reading JSON
  - Always `try/catch` fetch calls and fallback gracefully if a file is missing.
  - Normalize fields: prefer translit fields for sorting/filtering if available.
  - Don’t assume folder listings are available via fetch — use manifest files if needed.

## 4. Quick Patterns & Snippets

- Page initialization pattern (boilerplate):
```javascript
import UIManager from '../components/UIManager.js';
import MyService from '../services/MyService.js';

class MyPage {
  constructor() {
    this.ui = new UIManager();
    this.init();
  }

  async init() {
    const data = await MyService.loadSomething();
    this.render(data);
    window.updateMyPageUI = () => this.updateUI();
  }

  updateUI() { /* language updates */ }
}

document.addEventListener('DOMContentLoaded', () => new MyPage());
```

- Fetch JSON safely:
```javascript
export async function fetchJson(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Not found');
    return await res.json();
  } catch (e) {
    console.error('Failed to load', path, e);
    return null;
  }
}
```

- Use UIManager for modals:
```javascript
const ui = new UIManager();
ui.showModal('id','Title','<p>content</p>');
```

## 5. Where to look when things break (fast triage)
1. Browser console: first stop. Copy & paste the top error.
2. Check network tab for 404s (missing JSON files or module loads).
3. Ensure pages load `type="module"` scripts (module errors often happen when not using `type="module"`).
4. If translation keys missing, inspect `js/components/LanguageSwitcher.js`.
5. For events issues, open `js/services/EventService.js` and `js/pages/events.js`.

## 6. Conventions & Rules
- Keep services pure (no DOM). Pages handle DOM only.
- Export named functions for services, default classes for components.
- Make page update functions available via `window.updateXPageUI` for LanguageSwitcher compatibility.
- Use `data-` attributes on elements to store small metadata (e.g., `data-event-id`).

---

If you'd like, I can:
- Add a small checklist template for new feature PRs (file changes, tests, smoke steps).
- Generate a minimal unit test harness (Jest) for services to protect data parsing.

Mark the `AGENT_GUIDE.md` todo as completed when you want me to finalize. I'll wait for your go-ahead to mark it done.