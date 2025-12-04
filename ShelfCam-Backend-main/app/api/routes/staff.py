from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.employee import Employee

router = APIRouter(tags=["Staff"])

@router.get("/staff/")
def get_all_staff(db: Session = Depends(get_db)):
    """Get all staff members"""
    try:
        staff = db.query(Employee).all()
        return {"staff": staff}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/employees/")
def get_all_employees(db: Session = Depends(get_db)):
    """Alternative endpoint - get all employees"""
    try:
        employees = db.query(Employee).all()
        return {"employees": employees}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))