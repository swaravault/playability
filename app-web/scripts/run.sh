#!/bin/bash
# Web App Run Script
# ==================
# Starts the development server.

set -e
cd "$(dirname "$0")/.."

npm run dev
