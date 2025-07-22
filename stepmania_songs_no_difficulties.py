import os
import json

stepmania_dir = os.path.join('data', 'Stepmania')
output = []

for filename in os.listdir(stepmania_dir):
    if filename.endswith('.json'):
        filepath = os.path.join(stepmania_dir, filename)
        with open(filepath, encoding='utf-8') as f:
            try:
                songs = json.load(f)
            except Exception as e:
                print(f'Error reading {filename}: {e}')
                continue
            for song in songs:
                if not song.get('single_difficulties') and not song.get('double_difficulties') and not song.get('difficulties'):
                    output.append({
                        'file': filename,
                        'title': song.get('title'),
                        'artist': song.get('artist')
                    })

with open('stepmania_songs_no_difficulties.json', 'w', encoding='utf-8') as out_f:
    json.dump(output, out_f, ensure_ascii=False, indent=2)

print(f"Found {len(output)} songs with no difficulties. Results saved to stepmania_songs_no_difficulties.json.") 