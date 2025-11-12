import csv
import json
import os

# Path to the CSV file
csv_path = os.path.join(os.path.dirname(__file__), 'taiko.csv')

# Output directory (same as CSV)
out_dir = os.path.dirname(csv_path)

# Category mapping (CSV header to output file suffix)
categories = [
    'Pops',
    'Anime',
    'VOCALOID™',
    'Variety',
    'Game Music',
    'NAMCO Original',
    'Classic'
]

# Difficulty order
difficulty_keys = ['Easy', 'Medium', 'Hard', 'Oni', 'Ura Oni']

def parse_difficulties(row):
    # Difficulties are in columns 4-8 (0-based index)
    diffs = {}
    for i, key in enumerate(difficulty_keys):
        val = row[4 + i].strip()
        if val:
            diffs[key] = val
    return diffs

def parse_title_and_artist(title_field):
    # Use the part before the first Japanese newline as the title
    # Try to extract artist from brackets if present
    if '【' in title_field and '】' in title_field:
        title = title_field.split('【')[0].strip()
        artist = title_field.split('【')[1].split('】')[0].strip()
        title = f"{title}【{artist}】"
    else:
        title = title_field.strip()
        artist = ""
    return title, artist

def main():
    with open(csv_path, encoding='utf-8') as f:
        reader = csv.reader(f)
        current_category = None
        songs_by_category = {cat: [] for cat in categories}
        for row in reader:
            # Detect category header
            if len(row) > 2 and row[2] in categories:
                current_category = row[2]
                continue
            # Skip empty or non-song rows
            if not current_category or len(row) < 4 or not row[3].strip():
                continue
            # Parse title and artist
            title, artist = parse_title_and_artist(row[3])
            # Parse difficulties
            diffs = parse_difficulties(row)
            if not diffs:
                continue  # Skip songs with no difficulties
            song = {
                "title": title,
                "artist": artist,
                "difficulties": diffs
            }
            songs_by_category[current_category].append(song)
    # Write each category to its own JSON file
    for cat in categories:
        out_path = os.path.join(out_dir, f'taiko_no_tatsujin_{cat.lower().replace("™", "").replace(" ", "_")}.json')
        with open(out_path, 'w', encoding='utf-8') as out_f:
            json.dump(songs_by_category[cat], out_f, ensure_ascii=False, indent=2)
    print("Done! JSON files created for:", ', '.join(categories))

if __name__ == '__main__':
    main() 