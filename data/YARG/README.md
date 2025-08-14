# YARG Songs JSON Generator

This script generates a JSON file containing information about YARG songs by scanning through the YARG songs directory and parsing `song.ini` files.

## Requirements

- Python 3.6 or higher
- Access to the YARG songs directory (default: `E:\YARC\Setlists`)

## Usage

1. Make sure your YARG songs are located in the specified directory
2. Run the script:
   ```bash
   python generate_yarg_json.py
   ```

## What the script does

1. **Recursively scans** through all subdirectories in the YARG songs folder
2. **Looks for `song.ini` files** in each directory
3. **Checks for audio files** in the same directory (supports: .mp3, .ogg, .wav, .flac, .m4a, .aac, .wma)
4. **Parses the `song.ini` file** to extract:
   - `name` - Song name
   - `album` - Album name
   - `pro_drums` - Whether pro drums are available
   - `diff_guitar` - Guitar difficulty (number)
   - `diff_bass` - Bass difficulty (number)
   - `diff_drums` - Drums difficulty (number)
   - `diff_vocals` - Vocals difficulty (number)
   - `diff_vocals_harm` - Vocal harmony difficulty (number)

## Output

The script generates `yarg_songs.json` in the same directory with the following structure:

```json
[
  {
    "title": "Song Name",
    "album": "Album Name",
    "pro_drums": true,
    "difficulties": {
      "guitar": 5,
      "bass": 4,
      "drums": 6,
      "vocals": 3,
      "vocals_harmony": -1
    }
  }
]
```

## Notes

- If a difficulty field doesn't exist in the `song.ini` file, it will be set to `-1`
- Songs without audio files in the same directory are ignored
- The script handles encoding errors gracefully
- All difficulty values are converted to integers where possible

## Customization

To change the YARG songs directory, modify the `yarg_path` variable in the `main()` function:

```python
yarg_path = r"YOUR\CUSTOM\PATH\HERE"
```
