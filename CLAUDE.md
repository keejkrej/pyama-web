# Pyama Scientific Image Processing

## Overview
Pyama is a scientific image processing application for analyzing ND2 microscopy files with particle tracking and analysis capabilities.

## Tech Stack
- **Backend**: FastAPI with Python 3.13+, uv package manager
- **Frontend**: React 19 + TypeScript, Vite, Tailwind CSS v4
- **Desktop**: Tauri (Rust) with automatic Python backend startup

## Development

### Quick Start
```bash
# Web development
./start-dev.sh

# Desktop development  
./start-tauri.sh
```

### Commands
```bash
# Install dependencies
npm install

# Build web version
npm run build

# Build desktop app
cd frontend && npm run tauri:build

# Linting
npm run lint
```

## Important Notes
- **Servers**: Backend runs on :8000, Frontend on :3000
- **Desktop App**: Automatically starts and stops Python backend
- **Styling**: Uses Tailwind CSS v4 with PostCSS (no CDN)
- **Folder Selector**: Defaults to home directory, scroll contained within containers