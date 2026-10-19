# Event Template Folder

This is a template folder for creating new events. Copy this entire folder and rename it to create a new event.

## How to Use

1. **Copy this folder** and rename it to your event name (e.g., `cosgeek2025`, `yarg-tournament-2026`)
2. **Edit `event.json`** with your event information
3. **Replace `logo.png`** with your event logo/banner image
4. **Create `gallery/` folder** (optional, for past events only) and add event photos
5. **Update `/data/_manifests/events.json`** to include your folder name

## Folder Structure

```
your-event-name/
├── event.json          # Event data (edit this)
├── logo.png            # Event logo/banner (replace this)
├── gallery/            # Optional: for past events only
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── photo3.jpg
└── README.md           # Optional: event-specific notes
```

## Event JSON Fields

### Required Fields (All Events)
- `id`: Unique identifier (e.g., "event-003")
- `title`: Event name
- `description`: Brief description
- `starting_date`: Start date (YYYY-MM-DD format)
- `ending_date`: End date (YYYY-MM-DD format)
- `location`: Event location/address
- `title_image`: Filename of main image (usually "logo.png")
- `games`: Array of games at the event

### Optional Fields (Upcoming Events)
- `instagram_url`: Instagram event page
- `website_url`: Event website
- `rising_flow_contribution`: What Rising Flow is bringing
- `registration_required`: true/false
- `entry_fee`: Entry fee or "Free"

### Optional Fields (Past Events Only)
- `winner`: Winner name
- `participants_count`: Number of participants
- `event_highlights`: Event summary
- `instagram_highlights`: Instagram highlights URL
- `gallery_images`: Array of gallery image paths

## Image Guidelines

- **logo.png**: 800x400px recommended, JPG or PNG
- **Gallery images**: Any size, JPG recommended, optimized for web
- All images should be placed in the event folder or `gallery/` subfolder

## Important

After creating your event folder:

1. Add the folder name to `/data/_manifests/events.json`:
   ```json
   {
     "upcoming": ["your-event-name"],
     "past": []
   }
   ```

2. The system will automatically classify it as upcoming/past based on the `ending_date`

3. No need to manually move folders - the date-based classification happens automatically in the code
