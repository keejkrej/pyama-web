# Pyama Scientific Image Processing - FastAPI + React

A modern web application for scientific image processing and analysis, refactored from Flask to FastAPI with a React frontend.

## Project Structure

```
pyama-web/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── models.py       # Pydantic models
│   │   ├── routers/        # API route handlers
│   │   ├── services/       # Business logic and utilities
│   │   └── core/           # Configuration
│   ├── requirements.txt
│   └── main.py            # Entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   └── App.tsx        # Main app component
│   └── package.json
└── README_REFACTORED.md
```

## Features

- **Modern Architecture**: FastAPI backend with React TypeScript frontend
- **Type Safety**: Full TypeScript support and Pydantic models
- **Async Processing**: Background tasks for long-running operations
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Responsive UI**: Modern React components with Tailwind CSS

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   python main.py
   ```

   The API will be available at `http://localhost:8000`
   API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

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

## Production Deployment

### Backend
Use a production ASGI server like Gunicorn with Uvicorn workers:
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### Frontend
Build the production bundle:
```bash
cd frontend
npm run build
```

Deploy the `dist/` folder to a web server or CDN.

## Migration Notes

This refactored version maintains the same core functionality as the original Flask application while providing:

- Better scalability and performance
- Modern development practices
- Improved user experience
- Easier maintenance and testing

The original Flask application remains in the root directory for reference.