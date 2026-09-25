from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/contacts", tags=["contacts"])

@router.get("/", response_model=List[schemas.ContactOut])
def get_contacts(db: Session = Depends(get_db)):
    return db.query(models.Contact).order_by(models.Contact.first_seen_at.desc()).all()
