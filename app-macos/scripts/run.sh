#!/bin/bash
# macOS Desktop App Run Script
# =============================
# Starts the Electron app in development mode.
# Handles the ELECTRON_RUN_AS_NODE issue from VS Code terminals.

set -e
cd "$(dirname "$0")/.."

# Unset ELECTRON_RUN_AS_NODE (set by VS Code terminals)
# This is critical - without it, Electron won't start properly
unset ELECTRON_RUN_AS_NODE

echo "🚀 Starting Electron dev server..."
npm run dev
