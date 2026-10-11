#!/bin/bash
# Web App Build Script
# ====================
# Builds the app for production.

set -e
cd "$(dirname "$0")/.."

npm run build

echo "✅ Build complete! Output in dist/"
