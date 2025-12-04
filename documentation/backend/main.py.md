# main.py - FastAPI Application Entry Point

## Overview
This is the main entry point for the ShelfCam FastAPI backend application. It initializes the FastAPI app, configures middleware, sets up database tables, and includes all API routers.

## Purpose
- **Primary Function**: Bootstrap and configure the entire FastAPI application
- **Key Responsibilities**:
  - Initialize FastAPI app with metadata
  - Configure CORS middleware for frontend communication
  - Create database tables on startup
  - Register all API route modules
  - Provide health check endpoints

## Code Structure

### Application Configuration
```python
app = FastAPI(
    title="ShelfCam API",
    description="AI-Powered Retail Shelf Monitoring System",
    version="1.0.0"
)
```
- Creates FastAPI instance with descriptive metadata
- Sets up automatic API documentation

### CORS Middleware
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
- Enables Cross-Origin Resource Sharing
- Allows frontend applications running on ports 5173 (Vite) and 3000 (React dev server)
- Permits all HTTP methods and headers for development

### Database Initialization
```python
Base.metadata.create_all(bind=engine)
```
- Automatically creates all database tables based on SQLAlchemy models
- Runs on application startup

### Router Registration
The application includes the following API modules:
- `auth.router` - Authentication and login endpoints
- `inventory.router` - Inventory management
- `shelf.router` - Shelf management
- `staff_assignment.router` - Staff-to-shelf assignments
- `staff_dashboard.router` - Staff dashboard data
- `alerts.router` - Alert management system
- `staff.router` - Staff/employee management
- `detect.router` - AI detection and image processing

### Endpoints

#### Root Endpoint
- **GET /** - Returns API status message
- **Response**: `{"message": "ShelfCam API is live!"}`

#### Health Check
- **GET /health** - Application health status
- **Response**: `{"status": "healthy"}`

## Dependencies
- **FastAPI**: Web framework
- **SQLAlchemy**: Database ORM
- **CORS Middleware**: Cross-origin request handling
- **Custom modules**: All route handlers and database models

## Usage
This file is executed to start the FastAPI server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Integration Points
- **Frontend**: Serves API endpoints for React frontend
- **Database**: Initializes and connects to database
- **AI Services**: Provides endpoints for image detection
- **Authentication**: Handles user login and authorization

## Configuration
- **Development**: Allows localhost origins for CORS
- **Production**: Should restrict CORS origins to production domains
- **Database**: Uses configuration from `app.core.config`

## Error Handling
- Relies on individual router modules for specific error handling
- FastAPI provides automatic HTTP exception handling
- Health check endpoint for monitoring application status