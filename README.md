# Pyama Scientific Image Processing

A modern scientific image processing application for analyzing ND2 microscopy files with particle tracking and analysis capabilities.

## Tech Stack

- **Backend**: FastAPI with Python 3.13+, uv package manager
- **Frontend**: React 19 + TypeScript, Vite, Tailwind CSS v4
- **Desktop**: Tauri (Rust) with automatic Python backend startup
- **Type Safety**: Full TypeScript support and Pydantic models
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

## Quick Start

### Web Development
```bash
# Start both backend and frontend in development mode
./start-dev.sh
```

### Desktop Development
```bash
# Start Tauri desktop app with auto-managed backend
./start-tauri.sh
```

## Development

### Prerequisites
- Python 3.13+
- Node.js 18+
- Rust (for Tauri desktop app)
- uv package manager

### Manual Setup

#### Backend
```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
python main.py
```
The API will be available at `http://localhost:8000`

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:3000`

### Building

#### Web Version
```bash
npm run build
```

#### Desktop App
```bash
cd frontend
npm run tauri:build
```

### Code Quality
```bash
# Run linting
npm run lint
```

## API Endpoints

### Image Processing
- `POST /api/select_paths` - Select ND2 and output paths
- `GET /api/view` - Get image viewer data
- `POST /api/update_image` - Update displayed image
- `POST /api/update_particle_enabled` - Toggle particle enabled state

### Analysis Pipeline
- `GET /api/analysis` - Get analysis configuration
- `POST /api/do_segmentation` - Start cell segmentation
- `POST /api/do_tracking` - Start cell tracking
- `POST /api/do_square_rois` - Generate square ROIs
- `POST /api/do_export` - Export data to CSV

### File Management
- `GET /api/list_directory` - List directory contents
- `POST /api/select_folder` - Select folder

## Key Improvements

1. **Performance**: FastAPI provides better performance than Flask
2. **Type Safety**: Full TypeScript and Pydantic integration
3. **Modern UI**: React components with proper state management
4. **API-First**: Clean separation between frontend and backend
5. **Background Tasks**: Long-running operations don't block the UI
6. **Documentation**: Auto-generated API documentation
7. **Development Experience**: Hot reload, better error handling

## Development

### Adding New Features

1. **Backend**: Add new routes in `backend/app/routers/`
2. **Frontend**: Add new components in `frontend/src/components/`
3. **API Client**: Update `frontend/src/services/api.ts`

### Running Tests

Backend tests (when implemented):
```bash
cd backend
pytest
```

Frontend tests:
```bash
cd frontend
npm test
```

## Features

- **ND2 File Processing**: Native support for Nikon ND2 microscopy files
- **Particle Tracking**: Advanced particle detection and tracking algorithms
- **Real-time Analysis**: Live image processing and visualization
- **Export Capabilities**: Export results in multiple formats (CSV, JSON)
- **Cross-platform**: Runs as web app or native desktop application

## Important Notes

- **Servers**: Backend runs on :8000, Frontend on :3000
- **Desktop App**: Automatically starts and stops Python backend
- **Styling**: Uses Tailwind CSS v4 with PostCSS (no CDN)
- **Folder Selector**: Defaults to home directory, scroll contained within containers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.