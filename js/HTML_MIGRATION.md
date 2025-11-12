# HTML Migration Guide

This guide shows how to update your HTML files to use the new modular JavaScript architecture.

## Main Entry Point

All pages should include the main entry point:

```html
<!-- Add this to all pages -->
<script src="js/main.js" type="module"></script>
```

## Page-Specific Updates

### Events Pages (upcoming_events.html, past_events.html)

**Before:**
```html
<script src="js/event-loader.js"></script>
<script src="js/events.js"></script>
```

**After:**
```html
<script src="js/main.js" type="module"></script>
<script src="js/pages/events.js" type="module"></script>
```

### Song Search Page (song_search.html)

**Before:**
```html
<script src="js/song_search.js"></script>
```

**After:**
```html
<script src="js/main.js" type="module"></script>
<script src="js/pages/song-search.js" type="module"></script>
```

### Contact Page (contact.html)

**Before:**
```html
<script src="js/contact.js"></script>
```

**After:**
```html
<script src="js/main.js" type="module"></script>
<script src="js/pages/contact.js" type="module"></script>
```

### Pixel Block Page (pixel_block.html)

**Before:**
```html
<script src="js/pixel_block.js"></script>
```

**After:**
```html
<script src="js/main.js" type="module"></script>
<script src="js/pages/pixel-block.js" type="module"></script>
```

### Home Page (index.html)

**Before:**
```html
<script src="js/script.js"></script>
```

**After:**
```html
<script src="js/main.js" type="module"></script>
<!-- Keep script.js for backward compatibility -->
<script src="js/script.js"></script>
```

## Complete Example

Here's a complete example for an events page:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rising Flow - Próximos Eventos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/events.css">
</head>
<body>
    <!-- Your content here -->
    
    <!-- JavaScript - Load in this order -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- New modular architecture -->
    <script src="js/main.js" type="module"></script>
    <script src="js/pages/events.js" type="module"></script>
    
    <!-- Legacy fallback (optional, for transition period) -->
    <script src="js/script.js"></script>
</body>
</html>
```

## Important Notes

### Module Support
- ES6 modules require `type="module"` attribute
- Modern browsers support this natively
- For older browsers, consider using a polyfill

### Script Order
1. External libraries (Bootstrap, etc.)
2. Main application entry point
3. Page-specific modules
4. Legacy scripts (if needed)

### HTTPS Requirement
ES6 modules require HTTPS in production (or localhost for development).

## Backward Compatibility

During migration, you can run both old and new systems:

```html
<!-- New system -->
<script src="js/main.js" type="module"></script>
<script src="js/pages/events.js" type="module"></script>

<!-- Old system (fallback) -->
<script src="js/event-loader.js"></script>
<script src="js/events.js"></script>
```

The new system will take precedence, and the old system will show deprecation warnings in the console.

## Testing

After migration, verify:
1. All page functionality works
2. Language switching works
3. Modals and interactions work
4. No JavaScript errors in console
5. Performance is maintained or improved