# Event Management System

This folder contains all event data for the Rising Flow website. Events are automatically categorized as "upcoming" or "past" based on their dates.

## Folder Structure

```
data/events/
├── upcoming/           # Events that haven't ended yet
│   ├── event-001/     # Unique event folder
│   │   ├── event.json # Event data
│   │   └── title-image.jpg # Event banner/title image
│   └── event-002/
│       ├── event.json
│       └── title-image.jpg
└── past/              # Events that have ended
    ├── event-003/
    │   ├── event.json
    │   ├── title-image.jpg
    │   └── gallery/   # Event photos
    │       ├── photo1.jpg
    │       ├── photo2.jpg
    │       └── photo3.jpg
    └── event-004/
        ├── event.json
        ├── title-image.jpg
        └── gallery/
            ├── photo1.jpg
            └── photo2.jpg
```

## Adding New Events

### For Upcoming Events:

1. Create a new folder in `upcoming/` with a unique name (e.g., `event-005`)
2. Add `event.json` with the event data
3. Add `title-image.jpg` (recommended size: 800x400px)

### For Past Events:

1. Create a new folder in `past/` with a unique name (e.g., `event-006`)
2. Add `event.json` with the event data
3. Add `title-image.jpg`
4. Create a `gallery/` folder and add event photos

## Event JSON Structure

### Upcoming Events:
```json
{
  "id": "event-001",
  "title": "Event Title",
  "description": "Event description",
  "starting_date": "2025-03-15",
  "ending_date": "2025-03-16",
  "location": "Event Location",
  "title_image": "title-image.jpg",
  "instagram_url": "https://www.instagram.com/event",
  "website_url": "https://event-website.com",
  "rising_flow_contribution": "Description of what Rising Flow will bring to the event",
  "games": ["DDR", "Taiko no Tatsujin", "Project Diva", "YARG"],
  "registration_required": true,
  "entry_fee": "R$ 50,00"
}
```

### Past Events:
```json
{
  "id": "event-002",
  "title": "Event Title",
  "description": "Event description",
  "starting_date": "2024-11-10",
  "ending_date": "2024-11-10",
  "location": "Event Location",
  "title_image": "title-image.jpg",
  "gallery_images": [
    "gallery/photo1.jpg",
    "gallery/photo2.jpg",
    "gallery/photo3.jpg"
  ],
  "instagram_highlights": "https://www.instagram.com/risingflow_events/highlights/123456",
  "winner": "Winner Name",
  "participants_count": 32,
  "games": ["YARG"],
  "event_highlights": "Description of event highlights and results"
}
```

## Date Logic

- Events are considered "upcoming" until the day after their `ending_date`
- Events automatically move to "past" the day after they end
- Upcoming events are sorted by start date (earliest first)
- Past events are sorted by end date (most recent first)

## Button Functionality

### Upcoming Events:
- **Instagram**: Links to event's Instagram page
- **Website**: Links to event's website
- **Details**: Shows modal with Rising Flow's contribution and event information

### Past Events:
- **Ver Galeria**: Shows carousel modal with event photos
- **Destaques**: Links to Instagram highlights page

## Image Requirements

- **Title Image**: 800x400px recommended, JPG format
- **Gallery Images**: Any size, JPG format recommended
- All images should be optimized for web (compressed)

## Notes

- Event IDs must be unique across both upcoming and past events
- Dates should be in YYYY-MM-DD format
- The system automatically handles event categorization based on dates
- No manual intervention needed when events end - they automatically move to past events 