from app.api.routes import auth, role_protected
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, inventory,  shelf, staff_assignment, staff_dashboard, alerts, staff
from app.database.db import engine, Base
from app.core.config import settings
from app.api.routes import detect

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ShelfCam API",
    description="AI-Powered Retail Shelf Monitoring System",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "ShelfCam API is live!"}

app.include_router(auth.router)
app.include_router(inventory.router)
app.include_router(shelf.router)
app.include_router(staff_assignment.router)
app.include_router(staff_dashboard.router)
app.include_router(alerts.router)
app.include_router(staff.router)
app.include_router(detect.router)


@app.get("/health")
def health_check():
    return {"status": "healthy"}


