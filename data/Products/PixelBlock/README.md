# Pixel Block Products - JSON-Based System

## Overview
The Pixel Block page now dynamically loads products from JSON files, making it easy to add, remove, or update products without modifying HTML.

## Folder Structure
```
data/
  Products/
    PixelBlock/
      miku.json
      luka.json
      rin.json
      len.json
      gh_red.json
      gh_black.json
  _manifests/
    pixel_block.json
```

## Adding a New Product

### 1. Create a JSON file
Create a new file in `data/Products/PixelBlock/` with this structure:

```json
{
  "id": 7,
  "name": "Product Name (Portuguese)",
  "name_en": "Product Name (English)",
  "images": [
    "images/PixelBlock/main_image.png",
    "images/PixelBlock/support_image_1.jpeg",
    "images/PixelBlock/support_image_2.jpeg"
  ]
}
```

**Important Notes:**
- `id`: Must be unique. Use the next available number. This determines the display order.
- `name`: Portuguese name (shown by default)
- `name_en`: English name (shown when user switches to English)
- `images`: Array of image paths. The first image is the thumbnail, all images appear in the carousel.

### 2. Update the manifest
Run the Python script to regenerate the manifest:

```bash
python tools/generate_pixel_block_manifest.py
```

This will automatically scan `data/PixelBlock/` and update `data/_manifests/pixel_block.json`.

### 3. Test locally
```bash
python -m http.server 8000
```

Open `http://localhost:8000/pixel_block.html` and verify your product appears.

### 4. Deploy
Commit and push all changes:
```bash
git add data/Products/PixelBlock/*.json data/_manifests/pixel_block.json
git commit -m "Add new pixel block product"
git push
```

## Removing a Product
1. Delete the JSON file from `data/Products/PixelBlock/`
2. Run `python tools/generate_pixel_block_manifest.py`
3. Commit and push changes

## Updating a Product
1. Edit the JSON file in `data/Products/PixelBlock/`
2. Save changes
3. Commit and push (no need to regenerate manifest unless you renamed the file)

## How It Works

### Loading Process
1. Page loads and runs `js/pages/pixel_block.js`
2. `PixelBlockService.js` fetches `data/_manifests/pixel_block.json`
3. For each product filename in the manifest, fetches the product JSON
4. Products are sorted by `id` and rendered dynamically
5. Clicking a product opens a carousel with all images

### Files Involved
- `data/Products/PixelBlock/*.json` - Individual product data
- `data/_manifests/pixel_block.json` - List of all product files
- `js/services/PixelBlockService.js` - Handles data loading
- `js/pages/pixel_block.js` - Renders products and handles modal
- `tools/generate_pixel_block_manifest.py` - Generates manifest
- `pixel_block.html` - Main page (no hardcoded products)

## Example Product JSON

### Vocaloid Character
```json
{
  "id": 1,
  "name": "Hatsune Miku",
  "name_en": "Hatsune Miku",
  "images": [
    "images/PixelBlock/miku_cropped.png",
    "images/PixelBlock/vocaloid_support_1.jpeg",
    "images/PixelBlock/vocaloid_support_2.jpeg"
  ]
}
```

### Guitar Hero Controller
```json
{
  "id": 5,
  "name": "Guitar Hero Vermelha",
  "name_en": "Guitar Hero Red",
  "images": [
    "images/PixelBlock/gh_red_cropped.png",
    "images/PixelBlock/guitar_support_1.jpeg",
    "images/PixelBlock/guitar_support_2.jpeg"
  ]
}
```

## Troubleshooting

### Product doesn't appear
- Check console for errors (`F12` → Console tab)
- Verify JSON syntax is correct (use a JSON validator)
- Ensure manifest was regenerated after adding the file
- Hard refresh the page (`Ctrl+Shift+R`)

### Images don't load
- Verify image paths are correct (relative to project root)
- Check that image files exist in `images/PixelBlock/`
- Look for 404 errors in Network tab (`F12` → Network)

### Wrong order
- Check the `id` field in your JSON files
- Lower IDs appear first, higher IDs appear last
- IDs don't need to be consecutive, just unique
