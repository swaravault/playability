#!/usr/bin/env python3
"""
Unified Build & Run Script
===========================
This script combines setup, build, and run operations for all platform apps:
  - Web (app-web)
  - Android (app-android, via Capacitor)
  - iOS (app-ios, via Capacitor)
  - macOS Desktop (app-macos, via Electron)
  - Windows Desktop (app-windows, via Electron)

Configuration is loaded from app.config.json in the project root.

Usage:
  ./build.py [command] [options]

Commands:
  web:setup      Initial setup for the web app
  web:dev        Start the web app development server
  web:build      Build the web app for production

  android:setup  Initial setup for Android (install deps, copy assets, add platform)
  android:build  Build web app and sync to Android
  android:run    Build, sync, and run on Android device/emulator
  android:live   Start Android live reload dev server
  android:studio Open project in Android Studio
  android:apk    Build debug APK directly via Gradle

  ios:setup      Initial setup for iOS (install deps, copy assets, add platform)
  ios:build      Build web app and sync to iOS
  ios:run        Build, sync, and run on iOS device/simulator
  ios:live       Start iOS live reload dev server
  ios:xcode      Open project in Xcode

  mac:setup      Install dependencies for the macOS Desktop app
  mac:dev        Start the macOS Desktop app in development mode
  mac:build      Build the macOS Desktop app (app bundle)
  mac:dmg        Build the macOS Desktop app and create a DMG installer
  mac:zip        Build the macOS Desktop app and create a ZIP archive
  mac:package    Build the macOS Desktop app with all targets (DMG + ZIP)

  win:setup      Install dependencies for the Windows Desktop app
  win:dev        Start the Windows Desktop app in development mode
  win:build      Build the Windows Desktop app (default target)
  win:nsis       Build the Windows Desktop app and create an NSIS installer
  win:zip        Build the Windows Desktop app and create a ZIP archive
  win:package    Build the Windows Desktop app with all targets (NSIS + ZIP)

Options:
  -h, --help     Show this help message
"""

import os
import sys
import subprocess
import argparse
import json
import platform as sys_platform
from pathlib import Path
from datetime import datetime

# ═══════════════════════════════════════════════════════════
# Configuration Loading
# ═══════════════════════════════════════════════════════════

SCRIPT_DIR = Path(__file__).parent.absolute()
os.chdir(SCRIPT_DIR)

CONFIG_FILE = SCRIPT_DIR / "app.config.json"


def generate_version():
    """
    Generate version number from current date.
    Format: x.y.z where x = year-2025, y = month, z = day
    Examples:
      - 17-May-2026 → 1.5.17
      - 3-January-2027 → 2.1.3
    """
    now = datetime.now()
    year_offset = now.year - 2025
    return f"{year_offset}.{now.month}.{now.day}"


def update_version_in_config(version):
    """Update version in app.config.json and all package.json files.
    
    Also updates the global APP_VERSION so subsequent uses (e.g., DMG filename)
    reflect the new version.
    """
    global APP_VERSION
    print(f"📦 Auto-generating version: {version}")
    print(f"   (Based on date: {datetime.now().strftime('%d-%B-%Y')})")
    
    # Update app.config.json
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, 'r') as f:
            config = json.load(f)
        config["app"]["version"] = version
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f, indent=2)
            f.write('\n')
    
    # Update root package.json
    root_package = SCRIPT_DIR / "package.json"
    if root_package.exists():
        with open(root_package, 'r') as f:
            pkg = json.load(f)
        pkg["version"] = version
        with open(root_package, 'w') as f:
            json.dump(pkg, f, indent=2)
            f.write('\n')
    
    # Update platform package.json files
    for platform_dir in ["app-web", "app-android", "app-ios", "app-macos", "app-windows"]:
        platform_package = SCRIPT_DIR / platform_dir / "package.json"
        if platform_package.exists():
            with open(platform_package, 'r') as f:
                pkg = json.load(f)
            pkg["version"] = version
            with open(platform_package, 'w') as f:
                json.dump(pkg, f, indent=2)
                f.write('\n')
    
    # Update the global APP_VERSION so it's available for filename generation
    APP_VERSION = version


def load_config():
    """Load configuration from app.config.json."""
    if not CONFIG_FILE.exists():
        print(f"❌ Configuration file not found: {CONFIG_FILE}")
        print("   Please create app.config.json from the template.")
        sys.exit(1)
    
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)


CONFIG = load_config()

# Extract configuration values
APP_NAME = CONFIG.get("app", {}).get("name", "MyApp")
APP_DISPLAY_NAME = CONFIG.get("app", {}).get("displayName", APP_NAME)
APP_VERSION = CONFIG.get("app", {}).get("version", "1.0.0")

# Platform app directories from config
PLATFORMS_CONFIG = CONFIG.get("platforms", {})
APP_DIRS = {
    "web": PLATFORMS_CONFIG.get("web", {}).get("directory", "app-web"),
    "android": PLATFORMS_CONFIG.get("android", {}).get("directory", "app-android"),
    "ios": PLATFORMS_CONFIG.get("ios", {}).get("directory", "app-ios"),
    "mac": PLATFORMS_CONFIG.get("macos", {}).get("directory", "app-macos"),
    "win": PLATFORMS_CONFIG.get("windows", {}).get("directory", "app-windows"),
}

# Build configuration
BUILD_CONFIG = CONFIG.get("build", {})
SHARED_ASSETS = BUILD_CONFIG.get("sharedAssets", [
    "public/favicon.png",
    "public/logo-192.png",
    "public/vite.svg"
])

# Java Home configuration based on OS
JAVA_HOME_CONFIG = BUILD_CONFIG.get("javaHome", {})
CURRENT_OS = sys_platform.system().lower()
if CURRENT_OS == "darwin":
    DEFAULT_JAVA_HOME = JAVA_HOME_CONFIG.get("macos", "/Applications/Android Studio.app/Contents/jbr/Contents/Home")
elif CURRENT_OS == "linux":
    DEFAULT_JAVA_HOME = JAVA_HOME_CONFIG.get("linux", "/usr/lib/jvm/java-17-openjdk")
else:
    DEFAULT_JAVA_HOME = JAVA_HOME_CONFIG.get("windows", "C:\\Program Files\\Android\\Android Studio\\jbr")


# ═══════════════════════════════════════════════════════════
# Utility Functions
# ═══════════════════════════════════════════════════════════

def print_header(title):
    """Print a formatted section header."""
    print(f"\n{'═'*60}")
    print(f" {title}")
    print(f"{'═'*60}\n")


def run_cmd(cmd, env=None, check=True, cwd=None):
    """Run a shell command and stream output."""
    print(f"▶ {cmd}")
    run_env = os.environ.copy()
    if env:
        run_env.update(env)
    result = subprocess.run(cmd, shell=True, env=run_env, cwd=cwd)
    if check and result.returncode != 0:
        print(f"❌ Command failed with exit code {result.returncode}")
        sys.exit(result.returncode)
    return result.returncode


def get_app_dir(platform):
    """Get the app directory path for a given platform."""
    return APP_DIRS[platform]


def ensure_app_dir(platform):
    """Ensure the platform app directory exists, exit if not."""
    app_dir = get_app_dir(platform)
    if not os.path.exists(app_dir):
        print(f"❌ Platform directory '{app_dir}' not found.")
        print(f"   Expected directory structure: {app_dir}/")
        sys.exit(1)
    return app_dir


def copy_shared_assets(app_dir):
    """Copy shared public assets from root to the platform app."""
    os.makedirs(f"{app_dir}/public", exist_ok=True)
    for asset in SHARED_ASSETS:
        run_cmd(f"cp -f {asset} {app_dir}/public/ 2>/dev/null || true", check=False)


def _find_file_by_ext(directory, ext):
    """Find the most recently modified file with the given extension."""
    if not os.path.exists(directory):
        return None
    matches = []
    for entry in os.scandir(directory):
        if entry.is_file() and entry.name.endswith(ext):
            matches.append(entry.path)
    if not matches:
        return None
    return max(matches, key=os.path.getmtime)


def _electron_env():
    """Return env dict that unsets ELECTRON_RUN_AS_NODE (set by VS Code terminals)."""
    env = os.environ.copy()
    env.pop("ELECTRON_RUN_AS_NODE", None)
    return env


def _android_env():
    """Return env dict with JAVA_HOME set for Android builds."""
    env = {}
    if os.path.exists(DEFAULT_JAVA_HOME):
        env["JAVA_HOME"] = DEFAULT_JAVA_HOME
    return env


# ═══════════════════════════════════════════════════════════
# Web Commands (app-web)
# ═══════════════════════════════════════════════════════════

def cmd_web_setup():
    print_header(f"{APP_DISPLAY_NAME} Web App — Setup")
    app_dir = ensure_app_dir("web")

    print("📦 Installing dependencies...")
    run_cmd("npm install", cwd=app_dir)

    print("\n📁 Copying shared public assets...")
    copy_shared_assets(app_dir)

    print("\n✅ Setup complete!")
    print("Next steps:")
    print("  ./build.py web:dev    # Start development server")
    print("  ./build.py web:build  # Build for production")


def cmd_web_dev():
    print_header(f"{APP_DISPLAY_NAME} Web App — Development Server")
    app_dir = ensure_app_dir("web")
    run_cmd("npm run dev", cwd=app_dir)


def cmd_web_build():
    print_header(f"{APP_DISPLAY_NAME} Web App — Build Production")
    # Auto-generate version before build
    update_version_in_config(generate_version())
    app_dir = ensure_app_dir("web")
    run_cmd("npm run build", cwd=app_dir)
    print(f"\n✅ Build complete! Output in {app_dir}/dist/")


# ═══════════════════════════════════════════════════════════
# Android Commands (app-android)
# ═══════════════════════════════════════════════════════════

def cmd_android_setup():
    print_header(f"{APP_DISPLAY_NAME} Android App — Setup")
    app_dir = ensure_app_dir("android")

    print("📦 Installing dependencies...")
    run_cmd("npm install", cwd=app_dir)

    print("\n📁 Copying public assets...")
    copy_shared_assets(app_dir)

    print("\n🔨 Building web assets...")
    run_cmd("npm run build", cwd=app_dir)

    print("\n📱 Adding Android platform...")
    run_cmd("npx cap add android 2>/dev/null || true", cwd=app_dir, check=False)

    print("\n🔄 Syncing to Android...")
    run_cmd("npx cap sync android", cwd=app_dir, env=_android_env())

    print("\n✅ Setup complete!")
    print("Next steps:")
    print("  ./build.py android:run     # Run on device/emulator")
    print("  ./build.py android:studio  # Open in Android Studio")


def cmd_android_build():
    print_header(f"{APP_DISPLAY_NAME} Android App — Build & Sync")
    # Auto-generate version before build
    update_version_in_config(generate_version())
    app_dir = ensure_app_dir("android")
    run_cmd("npm run build", cwd=app_dir)
    run_cmd("npx cap sync android", cwd=app_dir, env=_android_env())
    print("\n✅ Build and sync complete!")


def cmd_android_run():
    print_header(f"{APP_DISPLAY_NAME} Android App — Run on Device")
    app_dir = ensure_app_dir("android")
    run_cmd("npm run build", cwd=app_dir)
    run_cmd("npx cap sync android", cwd=app_dir, env=_android_env())
    run_cmd("npx cap run android", cwd=app_dir, env=_android_env())


def cmd_android_live():
    print_header(f"{APP_DISPLAY_NAME} Android App — Live Reload")
    app_dir = ensure_app_dir("android")
    print("🔴 Starting live reload server...")
    print("   Make sure your device is on the same network.")
    run_cmd("npx cap run android --livereload --external", cwd=app_dir, env=_android_env())


def cmd_android_studio():
    print_header(f"{APP_DISPLAY_NAME} Android App — Open in Android Studio")
    app_dir = ensure_app_dir("android")
    run_cmd("npx cap open android", cwd=app_dir)


def cmd_android_apk():
    print_header(f"{APP_DISPLAY_NAME} Android App — Build Debug APK")
    # Auto-generate version before build
    update_version_in_config(generate_version())
    app_dir = ensure_app_dir("android")

    run_cmd("npm run build", cwd=app_dir)
    run_cmd("npx cap sync android", cwd=app_dir, env=_android_env())

    android_dir = os.path.join(app_dir, "android")
    if not os.path.exists(android_dir):
        print(f"❌ Android native project not found at {android_dir}")
        print("   Run './build.py android:setup' first.")
        sys.exit(1)

    print("\n🔨 Building APK via Gradle...")
    run_cmd("./gradlew :app:assembleDebug", cwd=android_dir, env=_android_env())

    apk_path = os.path.join(android_dir, "app/build/outputs/apk/debug/app-debug.apk")
    if os.path.exists(apk_path):
        print(f"\n✅ APK built successfully: {apk_path}")
    else:
        print(f"\n✅ Build finished. Check {android_dir}/app/build/outputs/apk/debug/")


# ═══════════════════════════════════════════════════════════
# iOS Commands (app-ios)
# ═══════════════════════════════════════════════════════════

def cmd_ios_setup():
    print_header(f"{APP_DISPLAY_NAME} iOS App — Setup")
    app_dir = ensure_app_dir("ios")

    print("📦 Installing dependencies...")
    run_cmd("npm install", cwd=app_dir)

    print("\n📁 Copying public assets...")
    copy_shared_assets(app_dir)

    print("\n🔨 Building web assets...")
    run_cmd("npm run build", cwd=app_dir)

    print("\n📱 Adding iOS platform...")
    run_cmd("npx cap add ios 2>/dev/null || true", cwd=app_dir, check=False)

    print("\n🔄 Syncing to iOS...")
    run_cmd("npx cap sync ios", cwd=app_dir)

    print("\n✅ Setup complete!")
    print("Next steps:")
    print("  ./build.py ios:run    # Run on simulator")
    print("  ./build.py ios:xcode  # Open in Xcode")


def cmd_ios_build():
    print_header(f"{APP_DISPLAY_NAME} iOS App — Build & Sync")
    # Auto-generate version before build
    update_version_in_config(generate_version())
    app_dir = ensure_app_dir("ios")
    run_cmd("npm run build", cwd=app_dir)
    run_cmd("npx cap sync ios", cwd=app_dir)
    print("\n✅ Build and sync complete!")


def cmd_ios_run():
    print_header(f"{APP_DISPLAY_NAME} iOS App — Run on Simulator")
    app_dir = ensure_app_dir("ios")
    run_cmd("npm run build", cwd=app_dir)
    run_cmd("npx cap sync ios", cwd=app_dir)
    run_cmd("npx cap run ios", cwd=app_dir)


def cmd_ios_live():
    print_header(f"{APP_DISPLAY_NAME} iOS App — Live Reload")
    app_dir = ensure_app_dir("ios")
    print("🔴 Starting live reload server...")
    run_cmd("npx cap run ios --livereload --external", cwd=app_dir)


def cmd_ios_xcode():
    print_header(f"{APP_DISPLAY_NAME} iOS App — Open in Xcode")
    app_dir = ensure_app_dir("ios")
    run_cmd("npx cap open ios", cwd=app_dir)


# ═══════════════════════════════════════════════════════════
# macOS Desktop Commands (app-macos)
# ═══════════════════════════════════════════════════════════

def cmd_mac_setup():
    print_header(f"{APP_DISPLAY_NAME} macOS Desktop App — Setup")
    app_dir = ensure_app_dir("mac")

    print("📦 Installing dependencies...")
    run_cmd("npm install", cwd=app_dir)

    print("\n📁 Copying shared public assets...")
    copy_shared_assets(app_dir)

    print("\n✅ Setup complete!")
    print("Next steps:")
    print("  ./build.py mac:dev    # Start in development mode")
    print("  ./build.py mac:dmg    # Build DMG installer")


def cmd_mac_dev():
    print_header(f"{APP_DISPLAY_NAME} macOS Desktop App — Development")
    app_dir = ensure_app_dir("mac")
    print("🚀 Starting Electron dev server...")
    print("   (ELECTRON_RUN_AS_NODE is automatically unset)")
    run_cmd("npm run dev", env=_electron_env(), cwd=app_dir)


def cmd_mac_build():
    print_header(f"{APP_DISPLAY_NAME} macOS Desktop App — Build")
    # Auto-generate version before build
    update_version_in_config(generate_version())
    app_dir = ensure_app_dir("mac")
    run_cmd("npm run build", env=_electron_env(), cwd=app_dir)
    print(f"\n✅ Build finished. Check {app_dir}/release/ for the app bundle.")


def _create_dmg_manual(app_dir):
    """Create DMG manually using hdiutil (fallback when electron-builder DMG fails)."""
    release_dir = os.path.join(app_dir, "release")
    
    # Find the .app bundle
    app_bundle = None
    for arch in ["mac-arm64", "mac-x64", "mac"]:
        candidate = os.path.join(release_dir, arch, f"{APP_NAME}.app")
        if os.path.exists(candidate):
            app_bundle = candidate
            arch_suffix = arch.replace("mac-", "").replace("mac", "universal")
            break
    
    if not app_bundle:
        print("⚠️ Could not find .app bundle for DMG creation")
        return None
    
    dmg_name = f"{APP_NAME}-{APP_VERSION}-{arch_suffix}.dmg"
    dmg_path = os.path.join(release_dir, dmg_name)
    staging_dir = f"/tmp/{APP_NAME.lower()}-dmg-staging"
    
    print(f"\n📀 Creating DMG manually: {dmg_name}")
    
    # Clean up and create staging directory
    run_cmd(f"rm -rf {staging_dir}", check=False)
    run_cmd(f"mkdir -p {staging_dir}")
    
    # Use ditto to copy the app bundle (preserves all metadata)
    run_cmd(f"ditto '{app_bundle}' '{staging_dir}/{APP_NAME}.app'")
    
    # Create DMG with UDZO format (compressed, read-only) and HFS+ filesystem
    # This avoids the mount/unmount issues with APFS + UDRW
    hdiutil_cmd = (
        f"hdiutil create -srcfolder '{staging_dir}/{APP_NAME}.app' "
        f"-volname '{APP_NAME}' -format UDZO -fs HFS+ -nospotlight -ov "
        f"'{dmg_path}'"
    )
    result = run_cmd(hdiutil_cmd, check=False)
    
    # Clean up staging directory
    run_cmd(f"rm -rf {staging_dir}", check=False)
    
    if os.path.exists(dmg_path):
        return dmg_path
    return None


def cmd_mac_dmg():
    print_header(f"{APP_DISPLAY_NAME} macOS Desktop App — Build DMG Installer")
    # Auto-generate version before build
    update_version_in_config(generate_version())
    app_dir = ensure_app_dir("mac")

    # Step 1: Build the app and create ZIP (which also produces the .app bundle)
    print("🔨 Building app bundle...")
    run_cmd("npm run build", env=_electron_env(), cwd=app_dir)
    run_cmd("npx electron-builder --mac zip", env=_electron_env(), cwd=app_dir)

    # Step 2: Create DMG manually (electron-builder DMG fails on ARM64)
    dmg_file = _create_dmg_manual(app_dir)

    if dmg_file:
        print(f"\n✅ DMG installer built successfully: {dmg_file}")
    else:
        release_dir = os.path.join(app_dir, "release")
        print(f"\n⚠️ DMG creation failed. The .app bundle is available in {release_dir}/")
        print("   Falling back to ZIP distribution.")


def cmd_mac_zip():
    print_header(f"{APP_DISPLAY_NAME} macOS Desktop App — Build ZIP Archive")
    # Auto-generate version before build
    update_version_in_config(generate_version())
    app_dir = ensure_app_dir("mac")
    run_cmd("npm run package:zip", env=_electron_env(), cwd=app_dir)

    release_dir = os.path.join(app_dir, "release")
    zip_file = _find_file_by_ext(release_dir, ".zip")
    if zip_file:
        print(f"\n✅ ZIP archive built successfully: {zip_file}")
    else:
        print(f"\n✅ Build finished. Check {release_dir}/ for the ZIP file.")


def cmd_mac_package():
    print_header(f"{APP_DISPLAY_NAME} macOS Desktop App — Full Package (DMG + ZIP)")
    # Auto-generate version before build
    update_version_in_config(generate_version())
    app_dir = ensure_app_dir("mac")

    # Build app and create ZIP (also produces .app bundle)
    run_cmd("npm run build", env=_electron_env(), cwd=app_dir)
    run_cmd("npx electron-builder --mac zip", env=_electron_env(), cwd=app_dir)

    # Create DMG manually (electron-builder DMG fails on ARM64)
    dmg_file = _create_dmg_manual(app_dir)

    release_dir = os.path.join(app_dir, "release")
    zip_file = _find_file_by_ext(release_dir, ".zip")

    print(f"\n✅ Full package build complete!")
    if dmg_file:
        print(f"   DMG: {dmg_file}")
    if zip_file:
        print(f"   ZIP: {zip_file}")
    if not dmg_file and not zip_file:
        print(f"   Check {release_dir}/ for output files.")


# ═══════════════════════════════════════════════════════════
# Windows Desktop Commands (app-windows)
# ═══════════════════════════════════════════════════════════

def cmd_win_setup():
    print_header(f"{APP_DISPLAY_NAME} Windows Desktop App — Setup")
    app_dir = ensure_app_dir("win")

    print("📦 Installing dependencies...")
    run_cmd("npm install", cwd=app_dir)

    print("\n📁 Copying shared public assets...")
    copy_shared_assets(app_dir)

    print("\n✅ Setup complete!")
    print("Next steps:")
    print("  ./build.py win:dev    # Start in development mode")
    print("  ./build.py win:nsis   # Build NSIS installer")


def cmd_win_dev():
    print_header(f"{APP_DISPLAY_NAME} Windows Desktop App — Development")
    app_dir = ensure_app_dir("win")
    print("🚀 Starting Electron dev server...")
    run_cmd("npm run dev", cwd=app_dir)


def cmd_win_build():
    print_header(f"{APP_DISPLAY_NAME} Windows Desktop App — Build")
    # Auto-generate version before build
    update_version_in_config(generate_version())
    app_dir = ensure_app_dir("win")
    run_cmd("npm run package", cwd=app_dir)
    print(f"\n✅ Build finished. Check {app_dir}/release/ for output.")


def cmd_win_nsis():
    print_header(f"{APP_DISPLAY_NAME} Windows Desktop App — Build NSIS Installer")
    # Auto-generate version before build
    update_version_in_config(generate_version())
    app_dir = ensure_app_dir("win")
    run_cmd("npm run package:nsis", cwd=app_dir)

    release_dir = os.path.join(app_dir, "release")
    exe_file = _find_file_by_ext(release_dir, ".exe")
    if exe_file:
        print(f"\n✅ NSIS installer built successfully: {exe_file}")
    else:
        print(f"\n✅ Build finished. Check {release_dir}/ for the installer.")


def cmd_win_zip():
    print_header(f"{APP_DISPLAY_NAME} Windows Desktop App — Build ZIP Archive")
    # Auto-generate version before build
    update_version_in_config(generate_version())
    app_dir = ensure_app_dir("win")
    run_cmd("npm run package:zip", cwd=app_dir)

    release_dir = os.path.join(app_dir, "release")
    zip_file = _find_file_by_ext(release_dir, ".zip")
    if zip_file:
        print(f"\n✅ ZIP archive built successfully: {zip_file}")
    else:
        print(f"\n✅ Build finished. Check {release_dir}/ for the ZIP file.")


def cmd_win_package():
    print_header(f"{APP_DISPLAY_NAME} Windows Desktop App — Full Package (NSIS + ZIP)")
    # Auto-generate version before build
    update_version_in_config(generate_version())
    app_dir = ensure_app_dir("win")
    run_cmd("npm run build && npx electron-builder --win nsis zip", cwd=app_dir)

    release_dir = os.path.join(app_dir, "release")
    exe_file = _find_file_by_ext(release_dir, ".exe")
    zip_file = _find_file_by_ext(release_dir, ".zip")

    print(f"\n✅ Full package build complete!")
    if exe_file:
        print(f"   NSIS: {exe_file}")
    if zip_file:
        print(f"   ZIP: {zip_file}")
    if not exe_file and not zip_file:
        print(f"   Check {release_dir}/ for output files.")


# ═══════════════════════════════════════════════════════════
# CLI Entry Point
# ═══════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(
        description=f"Unified Build & Run Script for {APP_DISPLAY_NAME} (Web, Android, iOS, macOS, Windows)",
        formatter_class=argparse.RawTextHelpFormatter
    )

    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Web commands
    subparsers.add_parser("web:setup", help="Initial setup for the web app")
    subparsers.add_parser("web:dev", help="Start the web app development server")
    subparsers.add_parser("web:build", help="Build the web app for production")

    # Android commands
    subparsers.add_parser("android:setup", help="Initial setup for Android")
    subparsers.add_parser("android:build", help="Build web app and sync to Android")
    subparsers.add_parser("android:run", help="Build, sync, and run on device/emulator")
    subparsers.add_parser("android:live", help="Start Android live reload dev server")
    subparsers.add_parser("android:studio", help="Open project in Android Studio")
    subparsers.add_parser("android:apk", help="Build debug APK directly via Gradle")

    # iOS commands
    subparsers.add_parser("ios:setup", help="Initial setup for iOS")
    subparsers.add_parser("ios:build", help="Build web app and sync to iOS")
    subparsers.add_parser("ios:run", help="Build, sync, and run on device/simulator")
    subparsers.add_parser("ios:live", help="Start iOS live reload dev server")
    subparsers.add_parser("ios:xcode", help="Open project in Xcode")

    # macOS Desktop commands
    subparsers.add_parser("mac:setup", help="Install dependencies for the macOS Desktop app")
    subparsers.add_parser("mac:dev", help="Start the macOS Desktop app in development mode")
    subparsers.add_parser("mac:build", help="Build the macOS Desktop app (app bundle)")
    subparsers.add_parser("mac:dmg", help="Build the macOS Desktop app and create a DMG installer")
    subparsers.add_parser("mac:zip", help="Build the macOS Desktop app and create a ZIP archive")
    subparsers.add_parser("mac:package", help="Build the macOS Desktop app with all targets (DMG + ZIP)")

    # Windows Desktop commands
    subparsers.add_parser("win:setup", help="Install dependencies for the Windows Desktop app")
    subparsers.add_parser("win:dev", help="Start the Windows Desktop app in development mode")
    subparsers.add_parser("win:build", help="Build the Windows Desktop app (default target)")
    subparsers.add_parser("win:nsis", help="Build the Windows Desktop app and create an NSIS installer")
    subparsers.add_parser("win:zip", help="Build the Windows Desktop app and create a ZIP archive")
    subparsers.add_parser("win:package", help="Build the Windows Desktop app with all targets (NSIS + ZIP)")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    commands = {
        # Web
        "web:setup":      cmd_web_setup,
        "web:dev":        cmd_web_dev,
        "web:build":      cmd_web_build,
        # Android
        "android:setup":  cmd_android_setup,
        "android:build":  cmd_android_build,
        "android:run":    cmd_android_run,
        "android:live":   cmd_android_live,
        "android:studio": cmd_android_studio,
        "android:apk":    cmd_android_apk,
        # iOS
        "ios:setup":      cmd_ios_setup,
        "ios:build":      cmd_ios_build,
        "ios:run":        cmd_ios_run,
        "ios:live":       cmd_ios_live,
        "ios:xcode":      cmd_ios_xcode,
        # macOS
        "mac:setup":      cmd_mac_setup,
        "mac:dev":        cmd_mac_dev,
        "mac:build":      cmd_mac_build,
        "mac:dmg":        cmd_mac_dmg,
        "mac:zip":        cmd_mac_zip,
        "mac:package":    cmd_mac_package,
        # Windows
        "win:setup":      cmd_win_setup,
        "win:dev":        cmd_win_dev,
        "win:build":      cmd_win_build,
        "win:nsis":       cmd_win_nsis,
        "win:zip":        cmd_win_zip,
        "win:package":    cmd_win_package,
    }

    commands[args.command]()


if __name__ == "__main__":
    main()
