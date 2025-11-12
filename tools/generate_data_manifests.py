#!/usr/bin/env python3
"""
Simple manifest generator for Rising Flow data folder
Usage: python tools/generate_data_manifests.py
It will scan data/events folder and create data/_manifests/events.json
"""

import os
import json
from pathlib import Path

def list_folders(directory):
    """List all subdirectories in a given directory."""
    try:
        if not os.path.exists(directory):
            return []
        return [f for f in os.listdir(directory) 
                if os.path.isdir(os.path.join(directory, f)) and not f.startswith('_')]
    except Exception:
        return []

def ensure_dir(directory):
    """Ensure a directory exists, create if it doesn't."""
    os.makedirs(directory, exist_ok=True)

def main():
    # Get the script's directory and navigate to project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    data_root = project_root / 'data'
    manifests_dir = data_root / '_manifests'
    
    # Ensure manifests directory exists
    ensure_dir(manifests_dir)
    
    # Scan events directory
    events_dir = data_root / 'events'
    
    # Get all event folders (excluding template and manifest folders)
    all_events = list_folders(events_dir)
    
    # Create manifest
    manifest = {
        'upcoming': all_events,
        'past': []
    }
    
    # Write manifest file
    manifest_path = manifests_dir / 'events.json'
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    
    print(f'Wrote data/_manifests/events.json')
    print(f'Found {len(all_events)} event(s)')

if __name__ == '__main__':
    main()
