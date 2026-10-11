#!/bin/bash
# Web App Setup Script
# ====================
# Run this once after cloning the repository.

set -e
cd "$(dirname "$0")/.."

echo "📦 Installing dependencies..."
npm install

echo "📁 Copying shared assets..."
cp -f ../public/favicon.png ../public/logo-192.png ../public/vite.svg public/ 2>/dev/null || true

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  npm run dev    # Start development server"
echo "  npm run build  # Build for production"
