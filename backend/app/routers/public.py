from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
import httpx
from .. import models, schemas
from ..database import get_db

router = APIRouter()

async def fire_webhook(url: str, payload: dict):
    async with httpx.AsyncClient() as client:
        try:
            await client.post(url, json=payload, timeout=10.0)
        except Exception as e:
            print(f"Webhook failed for {url}: {e}")

@router.get("/forms/{slug}", response_model=schemas.FormOut)
def get_public_form(slug: str, db: Session = Depends(get_db)):
    form = db.query(models.Form).filter(models.Form.slug == slug, models.Form.status == "PUBLISHED").first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found or not published")
    return form

@router.post("/forms/{slug}/responses", response_model=schemas.ResponseOut, status_code=status.HTTP_201_CREATED)
def submit_response(slug: str, response: schemas.ResponseCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    form = db.query(models.Form).filter(models.Form.slug == slug, models.Form.status == "PUBLISHED").first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found or not published")
    
    # Server-side validation (basic)
    required_q_ids = [q.id for q in form.questions if q.required]
    submitted_q_ids = [a.question_id for a in response.answers if a.value and str(a.value).strip() != ""]
    
    for req_id in required_q_ids:
        if req_id not in submitted_q_ids:
            raise HTTPException(status_code=400, detail=f"Question {req_id} is required")
            
    db_response = models.Response(form_id=form.id)
    db.add(db_response)
    db.flush()
    
    email_extracted = None
    answers_payload = []
    
    for ans in response.answers:
        # verify question belongs to form
        q = next((q for q in form.questions if q.id == ans.question_id), None)
        if q:
            val = str(ans.value) if ans.value is not None else None
            db_ans = models.Answer(
                response_id=db_response.id,
                question_id=ans.question_id,
                value=val
            )
            db.add(db_ans)
            
            answers_payload.append({
                "question_id": q.id,
                "question_title": q.title,
                "answer": val
            })
            
            if q.type == 'EMAIL' and val:
                email_extracted = val
            
    # If email found, add to Contacts
    if email_extracted:
        existing = db.query(models.Contact).filter(models.Contact.email == email_extracted).first()
        if not existing:
            new_contact = models.Contact(email=email_extracted)
            db.add(new_contact)
            
    db.commit()
    db.refresh(db_response)
    
    # Fire Webhooks
    active_webhooks = db.query(models.Webhook).filter(models.Webhook.form_id == form.id, models.Webhook.is_active == True).all()
    if active_webhooks:
        payload = {
            "response_id": db_response.id,
            "form_id": form.id,
            "form_slug": form.slug,
            "answers": answers_payload,
            "submitted_at": db_response.submitted_at.isoformat()
        }
        for wh in active_webhooks:
            background_tasks.add_task(fire_webhook, wh.url, payload)
            
    return db_response
