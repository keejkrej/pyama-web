#!/bin/bash

# Start the Electron app for development
echo "Starting Electron development environment..."

# Navigate to frontend directory
cd frontend

# Start the Vite dev server in the background
echo "Starting Vite dev server..."
npm run dev &
VITE_PID=$!

# Wait for Vite to start
echo "Waiting for Vite to start..."
sleep 3

# Start Electron
echo "Starting Electron..."
npm run electron:dev

# When Electron exits, kill the Vite server
kill $VITE_PID