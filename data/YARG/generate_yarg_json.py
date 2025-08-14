import os
import json
import re
from pathlib import Path

def has_audio_file(directory):
    """Check if directory contains any audio files"""
    audio_extensions = ['.mp3', '.ogg', '.wav', '.flac', '.m4a', '.aac', '.wma']
    
    for file in os.listdir(directory):
        if any(file.lower().endswith(ext) for ext in audio_extensions):
            return True
    return False

def parse_ini_file(ini_path):
    """Parse song.ini file and extract required information"""
    song_data = {
        "name": None,
        "artist": None,
        "album": None,
        "pro_drums": False,
        "diff_guitar": -1,
        "diff_bass": -1,
        "diff_drums": -1,
        "diff_vocals": -1,
        "diff_vocals_harm": -1
    }
    
    try:
        with open(ini_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        # Parse each line
        for line in content.split('\n'):
            line = line.strip()
            if '=' in line:
                key, value = line.split('=', 1)
                key = key.strip().lower()
                value = value.strip()
                
                if key == 'name':
                    song_data["name"] = value
                elif key == 'artist':
                    song_data["artist"] = value
                elif key == 'album':
                    song_data["album"] = value
                elif key == 'pro_drums':
                    song_data["pro_drums"] = value.lower() in ['true', '1', 'yes']
                elif key == 'diff_guitar':
                    try:
                        song_data["diff_guitar"] = int(value) if value != '-1' else -1
                    except ValueError:
                        song_data["diff_guitar"] = -1
                elif key == 'diff_bass':
                    try:
                        song_data["diff_bass"] = int(value) if value != '-1' else -1
                    except ValueError:
                        song_data["diff_bass"] = -1
                elif key == 'diff_drums':
                    try:
                        song_data["diff_drums"] = int(value) if value != '-1' else -1
                    except ValueError:
                        song_data["diff_drums"] = -1
                elif key == 'diff_vocals':
                    try:
                        song_data["diff_vocals"] = int(value) if value != '-1' else -1
                    except ValueError:
                        song_data["diff_vocals"] = -1
                elif key == 'diff_vocals_harm':
                    try:
                        song_data["diff_vocals_harm"] = int(value) if value != '-1' else -1
                    except ValueError:
                        song_data["diff_vocals_harm"] = -1
                        
    except Exception as e:
        print(f"Error parsing {ini_path}: {e}")
        return None
    
    return song_data

def scan_yarg_songs(root_path):
    """Recursively scan YARG folders for songs"""
    songs = []
    root_path = Path(root_path)
    
    if not root_path.exists():
        print(f"Error: Path {root_path} does not exist!")
        return songs
    
    print(f"Scanning YARG songs in: {root_path}")
    
    # Walk through all directories
    for root, dirs, files in os.walk(root_path):
        # Check if song.ini exists in current directory
        ini_file = os.path.join(root, 'song.ini')
        
        if os.path.exists(ini_file):
            # Check if audio files exist in the same directory
            if has_audio_file(root):
                print(f"Found song: {root}")
                
                # Parse the song.ini file
                song_data = parse_ini_file(ini_file)
                
                if song_data and song_data["name"]:
                    # Check if all difficulties are -1 (no valid difficulties)
                    all_difficulties = [
                        song_data["diff_guitar"],
                        song_data["diff_bass"], 
                        song_data["diff_drums"],
                        song_data["diff_vocals"],
                        song_data["diff_vocals_harm"]
                    ]
                    
                    # Only add song if at least one difficulty is not -1
                    if any(diff != -1 for diff in all_difficulties):
                        # Format the song data similar to Project Diva format
                        formatted_song = {
                            "title": song_data["name"],
                            "artist": song_data["artist"] if song_data["artist"] else None,
                            "album": song_data["album"] if song_data["album"] else None,
                            "pro_drums": song_data["pro_drums"],
                            "difficulties": {
                                "guitar": song_data["diff_guitar"],
                                "bass": song_data["diff_bass"],
                                "drums": song_data["diff_drums"],
                                "vocals": song_data["diff_vocals"],
                                "vocals_harmony": song_data["diff_vocals_harm"]
                            }
                        }
                        songs.append(formatted_song)
                    else:
                        print(f"  Skipping: All difficulties are -1 in {ini_file}")
                else:
                    print(f"  Skipping: Invalid song data in {ini_file}")
            else:
                print(f"  Skipping: No audio files found in {root}")
    
    return songs

def main():
    # YARG songs path
    yarg_path = r"E:\YARC\Setlists"
    
    # Scan for songs
    songs = scan_yarg_songs(yarg_path)
    
    if not songs:
        print("No songs found!")
        return
    
    print(f"\nFound {len(songs)} songs!")
    
    # Create output directory if it doesn't exist
    output_dir = Path("data/YARG")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save to JSON file
    output_file = output_dir / "yarg_songs.json"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(songs, f, indent=2, ensure_ascii=False)
    
    print(f"\nJSON file generated successfully!")
    print(f"Output: {output_file}")
    print(f"Total songs: {len(songs)}")
    
    # Show first few songs as preview
    print("\nFirst 3 songs preview:")
    for i, song in enumerate(songs[:3]):
        print(f"{i+1}. {song['title']} - Artist: {song['artist']} - Album: {song['album']}")
        print(f"   Difficulties: Guitar: {song['difficulties']['guitar']}, Bass: {song['difficulties']['bass']}, Drums: {song['difficulties']['drums']}, Vocals: {song['difficulties']['vocals']}, Vocals Harmony: {song['difficulties']['vocals_harmony']}")
        print(f"   Pro Drums: {song['pro_drums']}")
        print()

if __name__ == "__main__":
    main()
