from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/forms", tags=["webhooks"])

@router.get("/{form_id}/webhooks", response_model=List[schemas.WebhookOut])
def get_webhooks(form_id: int, db: Session = Depends(get_db)):
    # Verify form exists
    if not db.query(models.Form).filter(models.Form.id == form_id).first():
        raise HTTPException(status_code=404, detail="Form not found")
    
    return db.query(models.Webhook).filter(models.Webhook.form_id == form_id).all()

@router.post("/{form_id}/webhooks", response_model=schemas.WebhookOut, status_code=status.HTTP_201_CREATED)
def create_webhook(form_id: int, webhook: schemas.WebhookCreate, db: Session = Depends(get_db)):
    if not db.query(models.Form).filter(models.Form.id == form_id).first():
        raise HTTPException(status_code=404, detail="Form not found")
        
    db_webhook = models.Webhook(**webhook.model_dump(), form_id=form_id)
    db.add(db_webhook)
    db.commit()
    db.refresh(db_webhook)
    return db_webhook

@router.patch("/webhooks/{webhook_id}", response_model=schemas.WebhookOut)
def update_webhook(webhook_id: int, webhook_update: schemas.WebhookUpdate, db: Session = Depends(get_db)):
    db_webhook = db.query(models.Webhook).filter(models.Webhook.id == webhook_id).first()
    if not db_webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
        
    update_data = webhook_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_webhook, key, value)
        
    db.commit()
    db.refresh(db_webhook)
    return db_webhook

@router.delete("/webhooks/{webhook_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_webhook(webhook_id: int, db: Session = Depends(get_db)):
    db_webhook = db.query(models.Webhook).filter(models.Webhook.id == webhook_id).first()
    if not db_webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    db.delete(db_webhook)
    db.commit()
