#!/usr/bin/env python3
"""
Manifest generator for Rising Flow Pixel Block products
Usage: python tools/generate_pixel_block_manifest.py
It will scan data/Products/PixelBlock folder and create data/_manifests/pixel_block.json
"""

import os
import json
from pathlib import Path

def list_json_files(directory):
    """List all JSON files in a given directory."""
    try:
        if not os.path.exists(directory):
            return []
        return sorted([f for f in os.listdir(directory) 
                if f.endswith('.json')])
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
    
    # Scan PixelBlock directory
    pixel_block_dir = data_root / 'Products' / 'PixelBlock'
    
    # Get all product JSON files
    products = list_json_files(pixel_block_dir)
    
    # Create manifest
    manifest = {
        'products': products
    }
    
    # Write manifest file
    manifest_path = manifests_dir / 'pixel_block.json'
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    
    print(f'Wrote data/_manifests/pixel_block.json')
    print(f'Found {len(products)} product(s)')

if __name__ == '__main__':
    main()
