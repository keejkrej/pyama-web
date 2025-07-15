# Pyama Scientific Image Processing

## Overview
Pyama is a scientific image processing application for analyzing ND2 microscopy files with particle tracking and analysis capabilities.

## Tech Stack
- **Backend**: FastAPI with Python 3.13+, uv package manager
- **Frontend**: React 19 + TypeScript, Vite, Tailwind CSS v4
- **Desktop**: Tauri (Rust) with automatic Python backend startup

## Project Structure
```
pyama-web/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── core/           # Core configuration
│   │   │   └── config.py   # App settings with Pydantic
│   │   ├── routers/        # API endpoints
│   │   │   ├── images.py   # Image processing endpoints
│   │   │   ├── analysis.py # Analysis pipeline endpoints
│   │   │   └── files.py    # File management endpoints
│   │   ├── services/       # Business logic
│   │   │   ├── cell_viewer.py  # Main ND2 processing service
│   │   │   ├── pyama_util.py   # Analysis utilities
│   │   │   └── utils.py        # Helper functions
│   │   ├── models.py       # Pydantic data models
│   │   └── main.py         # FastAPI app factory
│   ├── main.py             # Entry point (runs uvicorn)
│   └── pyproject.toml      # Python dependencies
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── HomePage.tsx
│   │   │   ├── ViewPage.tsx
│   │   │   ├── AnalysisPage.tsx
│   │   │   ├── PreprocessPage.tsx
│   │   │   └── ui/         # Reusable UI components
│   │   ├── services/       # API client
│   │   │   └── api.ts      # Axios-based API service
│   │   └── App.tsx         # Main app with routing
│   ├── src-tauri/          # Tauri desktop app
│   │   ├── src/
│   │   │   └── main.rs     # Rust code managing Python backend
│   │   └── tauri.conf.json # Tauri configuration
│   └── package.json        # Frontend dependencies
├── start-dev.sh            # Web development launcher
└── start-tauri.sh          # Desktop development launcher
```

## API Endpoints

### Image Processing (`/api`)
- `POST /select_paths` - Initialize viewer with ND2 and output paths
- `GET /view` - Get current viewer state and image data
- `POST /update_image` - Update position/channel/frame/particle
- `POST /update_particle_enabled` - Toggle particle enabled state

### Analysis Pipeline (`/api`)
- `GET /analysis` - Get analysis metadata (positions, channels, frames)
- `POST /do_segmentation` - Start background segmentation task
- `POST /do_tracking` - Start background tracking task
- `POST /do_square_rois` - Generate square ROIs
- `POST /do_export` - Export results to CSV

### File Management (`/api`)
- `GET /list_directory` - Browse directories (defaults to home)
- `POST /select_folder` - Confirm folder selection
- `GET /home_directory` - Get user's home directory path

## Key Data Models

### Request Models
- `PathSelection` - ND2 path, output path, redirect target
- `ImageUpdate` - Position, channel, frame, particle indices
- `SegmentationRequest` - Position/frame ranges, channel assignments
- `TrackingRequest` - Position range, expand labels flag
- `ExportRequest` - Position range, time interval in minutes

### Response Models
- `ImageResponse` - Base64 image, brightness plot, particle data
- `ViewResponse` - Initial view data with metadata
- `AnalysisResponse` - Analysis configuration metadata
- `StatusResponse` - Generic status/message response

## Data Flow

1. **Initialization**: User selects ND2 file and output directory
2. **Viewing**: Real-time image display with particle overlays
3. **Analysis Pipeline**:
   - Segmentation → Tracking → ROI Generation → Export
   - All heavy operations run as background tasks
4. **Export**: Results saved as CSV with particle tracking data

## Development

### Quick Start
```bash
# Web development (runs on :3000 + :8000)
./start-dev.sh

# Desktop development (Tauri manages backend)
./start-tauri.sh
```

### Manual Backend Start
```bash
cd backend
uv run python main.py  # Runs on http://localhost:8000
```

### Manual Frontend Start
```bash
cd frontend
npm run dev  # Runs on http://localhost:5173
```

### Build Commands
```bash
# Build web version
npm run build:web

# Build desktop app
npm run build:desktop

# Run linting
npm run lint
```

## Configuration

### Backend Settings (`backend/app/core/config.py`)
- `app_name`: "Pyama Scientific Image Processing"
- `debug`: True (development mode)
- `host`: "0.0.0.0"
- `port`: 8000
- `cors_origins`: Configured for localhost:3000, :5173

### Frontend Configuration
- Vite dev server: Port 5173
- API base URL: http://localhost:8000/api
- Tailwind CSS v4 with PostCSS
- TypeScript strict mode enabled

### Tauri Desktop App
- Auto-starts Python backend on launch
- Auto-stops backend on window close
- Tries multiple Python commands (python3, python, etc.)
- Window size: 1200x800

## Key Dependencies

### Python (Backend)
- **Core**: FastAPI, uvicorn, pydantic
- **Image Processing**: numpy, opencv-python, scikit-image, scipy
- **ND2 Files**: nd2reader, PIMS, h5py
- **Visualization**: matplotlib, plotly
- **Data**: pandas, numba

### JavaScript (Frontend)
- **Core**: React 19, TypeScript, Vite
- **Routing**: react-router-dom v7
- **UI**: Tailwind CSS v4, Radix UI components
- **HTTP**: axios
- **Desktop**: Tauri v2

## Important Notes

### Global State Management
- Backend uses a global `CellViewer` instance (consider dependency injection for production)
- State is shared between image and analysis routers

### Background Tasks
- Long-running operations (segmentation, tracking) use FastAPI BackgroundTasks
- No real-time progress updates currently implemented

### Image Data Transfer
- Images are converted to base64 JPEG strings for API transfer
- Brightness plots are serialized as Plotly HTML

### File Paths
- All file paths must be absolute (not relative)
- Frontend folder selector starts at user's home directory
- Path expansion handles `~` for home directory

## Testing
- No test files currently implemented
- Testing infrastructure ready:
  - Backend: pytest support via pyproject.toml
  - Frontend: npm test command configured

## Deployment Considerations
1. Replace global state with proper session management
2. Add authentication/authorization if needed
3. Configure production CORS origins
4. Implement proper error handling and logging
5. Add progress tracking for long operations
6. Consider using WebSockets for real-time updates

## Common Development Tasks

### Adding a New API Endpoint
1. Define request/response models in `backend/app/models.py`
2. Add endpoint to appropriate router in `backend/app/routers/`
3. Implement business logic in `backend/app/services/`
4. Update API client in `frontend/src/services/api.ts`
5. Create/update React components as needed

### Modifying Image Processing
- Core logic is in `backend/app/services/cell_viewer.py`
- Image utilities in `backend/app/services/utils.py`
- Analysis pipeline in `backend/app/services/pyama_util.py`

### UI Component Updates
- Components use Tailwind CSS v4 classes
- Radix UI for accessible components (Button, Dialog, etc.)
- Keep components in appropriate directories under `frontend/src/components/`

## Known Issues & Limitations
1. No multi-user support (single global state)
2. Large ND2 files may cause memory issues
3. No real-time progress for long operations
4. Limited error handling in frontend
5. No automated tests

## Future Enhancements
- WebSocket support for real-time updates
- Session-based state management
- Progress indicators for long operations
- Batch processing capabilities
- Plugin system for custom analysis algorithms
- Docker containerization
- Cloud deployment support