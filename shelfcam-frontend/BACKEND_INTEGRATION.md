# Backend Integration Guide

## Overview
The frontend is now configured to integrate with the FastAPI backend. It includes fallback mechanisms to work with localStorage when the backend is unavailable.

## API Endpoints Used

### Authentication
- `POST /auth/login` - User login with credentials

### Dashboard
- `GET /dashboard/stats` - Dashboard statistics
- `GET /alerts/active` - Active alerts for managers
- `GET /alerts/dashboard/{employee_id}` - Staff-specific alerts

### Shelves
- `GET /shelves/` - Get all shelves
- `POST /shelves/` - Create new shelf
- `PUT /shelves/{id}` - Update shelf

### Staff
- `GET /staff/` - Get all staff members
- `POST /staff-assignments/` - Assign staff to shelf

### Alerts
- `GET /alerts/` - Get alerts with filters
- `POST /alerts/acknowledge/{id}` - Acknowledge alert
- `POST /alerts/resolve/{id}` - Resolve alert

### Detection
- `POST /detect/` - Upload image for AI analysis

## Configuration

### Environment Variables
Create `.env` file with:
```
VITE_API_BASE_URL=http://localhost:8000
```

### Backend Requirements
1. Start the FastAPI backend on port 8000
2. Ensure CORS is configured to allow frontend origin
3. All endpoints should return JSON responses

## Fallback Behavior
- If backend is unavailable, the app uses localStorage data
- Mock data is provided for testing without backend
- Error messages are displayed for failed API calls

## Testing
1. Start backend: `uvicorn main:app --reload`
2. Start frontend: `npm run dev`
3. Test login and navigation between pages