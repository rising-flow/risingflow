# Rising Flow JavaScript Architecture

This document outlines the new modular architecture implemented for the Rising Flow website's JavaScript code.

## Overview

The JavaScript codebase has been refactored from a page-oriented structure to a modular, component-based architecture that follows modern best practices.

## Folder Structure

```
js/
├── components/           # Reusable UI components
│   ├── LanguageSwitcher.js  # Language switching functionality
│   └── UIManager.js         # Modal and UI management
├── services/            # Data services and business logic
│   ├── EventService.js     # Event data operations
│   └── SongService.js      # Song data operations
├── pages/              # Page-specific entry points
│   ├── contact.js         # Contact page logic
│   ├── events.js          # Events page logic
│   ├── pixel-block.js     # Pixel Block page logic
│   └── song-search.js     # Song search page logic
├── main.js             # Global application entry point
├── script.js           # Legacy compatibility layer
├── event-loader.js     # Legacy compatibility (deprecated)
├── events.js           # Legacy file (deprecated)
├── contact.js          # Legacy file (deprecated)
├── pixel_block.js      # Legacy file (deprecated)
└── song_search.js      # Legacy file (deprecated)
```

## Architecture Principles

### 1. ES6 Modules
- All new code uses `import`/`export` syntax
- No pollution of global namespace
- Clear dependency management
- Better code splitting and lazy loading

### 2. Component-Based Design
- Reusable components with clear interfaces
- Separation of concerns
- Easy testing and maintenance

### 3. Service Layer
- Business logic separated from UI logic
- Centralized data operations
- Consistent error handling

### 4. Page-Specific Entry Points
- Each page has its own main script
- Loads only necessary dependencies
- Better performance and maintainability

## Components

### LanguageSwitcher
**Location:** `js/components/LanguageSwitcher.js`

Manages all language-related functionality:
- Language state management
- Translation updates
- Global language change notifications

**Usage:**
```javascript
import LanguageSwitcher from './components/LanguageSwitcher.js';
const languageSwitcher = new LanguageSwitcher();
```

### UIManager
**Location:** `js/components/UIManager.js`

Handles all UI interactions:
- Modal creation and management
- Form validation
- User notifications

**Usage:**
```javascript
import UIManager from './components/UIManager.js';
const uiManager = new UIManager();
uiManager.showModal('myModal', 'Title', 'Content');
```

## Services

### EventService
**Location:** `js/services/EventService.js`

Handles all event-related operations:
- Event data fetching
- Event categorization (upcoming/past)
- Date formatting utilities

**Usage:**
```javascript
import { getAllEvents } from './services/EventService.js';
const { upcomingEvents, pastEvents } = await getAllEvents();
```

### SongService
**Location:** `js/services/SongService.js`

Manages song data operations:
- Game-specific song loading
- Song filtering and searching
- Multi-format support (Stepmania, YARG, etc.)

**Usage:**
```javascript
import { loadSongsForGame } from './services/SongService.js';
const songs = await loadSongsForGame('Dance Dance Revolution');
```

## Page Implementation

### Standard Page Structure

Each page follows this pattern:

```javascript
// js/pages/example.js
import RequiredService from '../services/RequiredService.js';
import UIManager from '../components/UIManager.js';

class ExamplePage {
    constructor() {
        this.uiManager = new UIManager();
        this.init();
    }

    init() {
        // Initialize page functionality
    }

    updateUI() {
        // Handle language changes
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const page = new ExamplePage();
    
    // Make update function available for language switcher
    window.updateExamplePageUI = () => page.updateUI();
});
```

### HTML Integration

To use the new modular system, update your HTML:

```html
<!-- Old way -->
<script src="js/event-loader.js"></script>
<script src="js/events.js"></script>

<!-- New way -->
<script src="js/main.js" type="module"></script>
<script src="js/pages/events.js" type="module"></script>
```

## Migration Guide

### For Existing Pages

1. **Identify Dependencies**: What services does your page need?
2. **Create Page Module**: Follow the standard page structure
3. **Update HTML**: Add module script tags
4. **Test**: Ensure all functionality works

### For New Pages

1. **Create Page Module**: Use the standard template
2. **Add Required Services**: Import only what you need
3. **Implement UI Logic**: Use UIManager for modals and interactions
4. **Add Translations**: Follow the language switcher pattern

## Backward Compatibility

The system maintains backward compatibility through:

- **Legacy script.js**: Provides fallback functionality
- **Legacy event-loader.js**: Redirects to new architecture
- **Global function stubs**: Prevent errors in old HTML

## Benefits

### For Developers
- **Clearer Code Organization**: Each file has a single responsibility
- **Better Debugging**: Easier to trace issues
- **Improved Testing**: Modular code is easier to test
- **Modern Tooling**: ES6 modules work with bundlers

### For Performance
- **Smaller Bundles**: Load only what's needed
- **Better Caching**: Individual modules can be cached separately
- **Lazy Loading**: Pages can load dependencies on demand

### For Maintenance
- **Easier Updates**: Changes are isolated to specific modules
- **Better Collaboration**: Team members can work on separate components
- **Consistent Patterns**: All pages follow the same structure

## Examples

### Adding a New Modal
```javascript
// In your page class
this.uiManager.showModal('customModal', 'My Title', '<p>Custom content</p>', {
    footer: '<button class="btn btn-primary" data-bs-dismiss="modal">OK</button>',
    size: 'lg'
});
```

### Adding Language Support
```javascript
// In your page class
updateUI() {
    const currentLang = window.getCurrentLang();
    const translations = {
        'pt-BR': { title: 'Título' },
        'en-GB': { title: 'Title' }
    };
    
    const t = translations[currentLang];
    document.getElementById('my-title').textContent = t.title;
}
```

### Loading Data
```javascript
// In your page class
async init() {
    try {
        const data = await loadSongsForGame('YARG');
        this.renderData(data);
    } catch (error) {
        console.error('Failed to load data:', error);
        this.uiManager.showModal('errorModal', 'Error', 'Failed to load data');
    }
}
```

## Future Improvements

- **TypeScript**: Add type safety
- **Build System**: Bundle for production
- **Unit Tests**: Test individual modules
- **Code Splitting**: Dynamic imports for better performance
- **Service Workers**: Offline functionality

## Troubleshooting

### Module Loading Issues
Ensure your server supports ES6 modules and serves `.js` files with the correct MIME type.

### Legacy Code Conflicts
If you encounter issues, check the browser console for deprecation warnings and update HTML to use the new modules.

### Missing Dependencies
Import statements will fail if dependencies are missing. Check the import paths and ensure all required files exist.