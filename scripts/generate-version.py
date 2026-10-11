#!/usr/bin/env python3
"""
Version Number Generator
========================
Generates a version number in the format x.y.z where:
  - x = current year - 2025
  - y = current month (1-12)
  - z = current day of month

Examples:
  - 17-May-2026 → 1.5.17
  - 3-January-2027 → 2.1.3
  - 31-December-2025 → 0.12.31

This script updates the version in app.config.json and can also
update package.json files in platform directories.
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path


def generate_version(date=None):
    """Generate version number from date."""
    if date is None:
        date = datetime.now()
    
    year_offset = date.year - 2025
    month = date.month
    day = date.day
    
    return f"{year_offset}.{month}.{day}"


def update_json_file(file_path, version, key_path=["version"]):
    """Update version in a JSON file."""
    if not os.path.exists(file_path):
        print(f"  ⚠️ File not found: {file_path}")
        return False
    
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        # Navigate to the nested key
        obj = data
        for key in key_path[:-1]:
            if key not in obj:
                obj[key] = {}
            obj = obj[key]
        
        old_version = obj.get(key_path[-1], "unknown")
        obj[key_path[-1]] = version
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
            f.write('\n')
        
        print(f"  ✅ {file_path}: {old_version} → {version}")
        return True
    except Exception as e:
        print(f"  ❌ Error updating {file_path}: {e}")
        return False


def main():
    """Main entry point."""
    # Get script directory and project root
    script_dir = Path(__file__).parent.absolute()
    project_root = script_dir.parent
    
    # Generate version
    version = generate_version()
    print(f"\n📦 Generated version: {version}")
    print(f"   (Based on date: {datetime.now().strftime('%d-%B-%Y')})\n")
    
    # Update app.config.json
    print("Updating configuration files:")
    
    config_file = project_root / "app.config.json"
    update_json_file(config_file, version, ["app", "version"])
    
    # Update root package.json
    root_package = project_root / "package.json"
    update_json_file(root_package, version, ["version"])
    
    # Update platform package.json files
    platforms = ["app-web", "app-android", "app-ios", "app-macos", "app-windows"]
    for platform in platforms:
        platform_package = project_root / platform / "package.json"
        if platform_package.exists():
            update_json_file(platform_package, version, ["version"])
    
    print(f"\n✅ Version updated to {version}\n")
    
    # Return version for use by other scripts
    return version


if __name__ == "__main__":
    main()
