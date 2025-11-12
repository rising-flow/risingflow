# Event Management System

This folder contains all event data for the Rising Flow website. Events are automatically categorized as "upcoming" or "past" based on their dates.

## Folder Structure

Each event has its own folder with a standardized structure:

```
data/events/
├── _template/              # Template folder - copy this to create new events
│   ├── event.json         # Template event data
│   ├── logo.png.md        # Placeholder for logo
│   ├── gallery/           # Template gallery folder
│   └── README.md          # Instructions
├── _manifests/
│   └── events.json        # Lists all event folders
├── cosgeek2025/           # Example event folder
│   ├── event.json         # Event data
│   ├── logo.png           # Event logo/banner
│   └── gallery/           # Event photos (optional, for past events)
│       ├── photo1.jpg
│       └── photo2.jpg
├── event-002/             # Another event folder
│   ├── event.json
│   ├── title-image.jpg
│   └── gallery/
└── README.md              # This file
```

## Creating a New Event

### Step 1: Copy the Template
```bash
# Copy the _template folder
cp -r data/events/_template data/events/your-event-name
```

### Step 2: Edit event.json
Open `your-event-name/event.json` and fill in your event information:

```json
{
  "id": "event-003",
  "title": "Your Event Name",
  "description": "Brief event description",
  "starting_date": "2026-03-15",
  "ending_date": "2026-03-16",
  "location": "Event Location",
  "title_image": "logo.png",
  "games": ["DDR", "Taiko no Tatsujin"],
  "instagram_url": "https://www.instagram.com/your_event/",
  "website_url": "",
  "rising_flow_contribution": "What Rising Flow is bringing",
  "registration_required": false,
  "entry_fee": "Free"
}
```

### Step 3: Add Your Images
- Replace `logo.png` with your event logo (800x400px recommended)
- For past events: add photos to the `gallery/` folder

### Step 4: Register the Event
Add your folder name to `/data/_manifests/events.json`:

```json
{
  "upcoming": [
    "cosgeek2025",
    "your-event-name"
  ],
  "past": [
    "event-002"
  ]
}
```

**Note**: The manifest just lists folder names. The system automatically classifies events as upcoming/past based on their `ending_date`.

## Event Object Schema

### Required Fields (All Events)
- `id` (string): Unique event identifier (e.g., "event-003")
- `title` (string): Event name
- `description` (string): Brief event description
- `starting_date` (string): Start date in ISO format (YYYY-MM-DD)
- `ending_date` (string): End date in ISO format (YYYY-MM-DD)
- `location` (string): Event location/address
- `title_image` (string): Filename of the main event image (e.g., "logo.png")
- `games` (array): List of games featured at the event

### Optional Fields (Upcoming Events)
- `instagram_url` (string): Instagram event page
- `website_url` (string): Event website
- `rising_flow_contribution` (string): Rising Flow's participation details
- `registration_required` (boolean): Whether registration is required
- `entry_fee` (string): Entry fee information or "Free"

### Optional Fields (Past Events Only)
- `winner` (string): Event winner name
- `participants_count` (number): Number of participants
- `event_highlights` (string): Summary of event highlights
- `gallery_images` (array): Array of gallery image paths (e.g., `["gallery/photo1.jpg"]`)
- `instagram_highlights` (string): Instagram highlights URL

## How It Works

### Automatic Classification
The EventService automatically classifies events based on the current date:
- **Upcoming**: Events where `ending_date` is today or in the future
- **Past**: Events where `ending_date` has passed

The manifest (`/data/_manifests/events.json`) just lists all event folders - classification is automatic.

### Image Paths
All images are loaded relative to the event folder:
- Title image: `/data/events/{folder-name}/{title_image}`
- Gallery images: `/data/events/{folder-name}/{gallery_image_path}`

### File Naming Convention
- **event.json**: Always name the event data file `event.json`
- **logo.png**: Recommended name for title image (or use any name and update `title_image` field)
- **gallery/**: Optional subfolder for event photos

## UI Features

### Event Cards
Events are displayed as Bootstrap cards with:
- Event logo/image (4-column width)
- Title, description, date, location, games (8-column width)
- Click anywhere on card to view full details

### Tabs
- **Próximos Eventos / Upcoming Events**: Shows future events (sorted by start date)
- **Eventos Passados / Past Events**: Shows completed events (sorted by end date, most recent first)

### Modals
- Click any event card to see full details
- Past events can show image gallery (if `gallery_images` is provided)
- Social media links (Instagram, website, highlights)

## Quick Reference

### Adding an Event Checklist
- [ ] Copy `_template` folder and rename
- [ ] Edit `event.json` with event details
- [ ] Replace `logo.png` with event logo
- [ ] (Optional) Add gallery photos to `gallery/` folder
- [ ] Add folder name to `/data/_manifests/events.json`
- [ ] Test on local server

### Image Guidelines
- **Title Image**: 800x400px recommended, PNG/JPG, under 500KB
- **Gallery Images**: Any size, JPG recommended, compressed for web

### Common Issues
- **Event not showing?** Check that folder name is in `/data/_manifests/events.json`
- **Wrong tab?** System auto-classifies by date - check `ending_date` in event.json
- **Image not loading?** Verify `title_image` filename matches actual file in folder

## Example Folder Name Conventions
- Use lowercase and hyphens: `cosgeek2025`, `yarg-tournament-2026`
- Or camelCase: `cosgeek2025`, `yargTournament2026`
- Keep it short and readable
- No spaces or special characters 