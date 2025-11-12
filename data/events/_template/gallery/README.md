# Gallery Folder

This folder is **optional** and only needed for **past events**.

Add event photos here for display in the gallery modal.

## How to Use

1. Add photos to this folder (e.g., `photo1.jpg`, `photo2.jpg`, etc.)
2. Update the `gallery_images` field in `event.json`:
   ```json
   "gallery_images": [
     "gallery/photo1.jpg",
     "gallery/photo2.jpg",
     "gallery/photo3.jpg"
   ]
   ```

## Image Guidelines

- **Format**: JPG recommended (smaller file size)
- **Size**: Any dimension, but optimize for web (compress before uploading)
- **Orientation**: Can be portrait, landscape, or square
- **Quantity**: Add as many as you want

## Notes

- Gallery is only shown for past events (events where `ending_date` has passed)
- Users can view the gallery by clicking the "Ver Galeria" / "View Gallery" button
- Images are displayed in a Bootstrap carousel modal
