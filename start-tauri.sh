#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Starting Pyama Desktop App with Tauri..."

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Start Tauri app (backend will be started automatically by Tauri)
echo "⚡ Starting Tauri desktop app with integrated backend..."
cd "$SCRIPT_DIR/frontend" && npm run tauri:dev

# Wait for processes
wait