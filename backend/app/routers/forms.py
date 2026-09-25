from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
import json

router = APIRouter()

# --- Forms CRUD ---
@router.get("/forms", response_model=List[schemas.FormOut])
def get_forms(db: Session = Depends(get_db)):
    forms = db.query(models.Form).order_by(models.Form.updated_at.desc()).all()
    for f in forms:
        f.response_count = db.query(models.Response).filter(models.Response.form_id == f.id).count()
    return forms

@router.post("/forms", response_model=schemas.FormOut, status_code=status.HTTP_201_CREATED)
def create_form(form: schemas.FormCreate, db: Session = Depends(get_db)):
    db_form = models.Form(**form.model_dump())
    db.add(db_form)
    db.commit()
    db.refresh(db_form)
    db_form.response_count = 0
    return db_form

@router.get("/forms/{form_id}", response_model=schemas.FormOut)
def get_form(form_id: int, db: Session = Depends(get_db)):
    db_form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    db_form.response_count = db.query(models.Response).filter(models.Response.form_id == db_form.id).count()
    return db_form

@router.patch("/forms/{form_id}", response_model=schemas.FormOut)
def update_form(form_id: int, form_update: schemas.FormUpdate, db: Session = Depends(get_db)):
    db_form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    update_data = form_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_form, key, value)
    
    db.commit()
    db.refresh(db_form)
    db_form.response_count = db.query(models.Response).filter(models.Response.form_id == db_form.id).count()
    return db_form

@router.delete("/forms/{form_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_form(form_id: int, db: Session = Depends(get_db)):
    db_form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    db.delete(db_form)
    db.commit()

@router.post("/forms/{form_id}/duplicate", response_model=schemas.FormOut)
def duplicate_form(form_id: int, db: Session = Depends(get_db)):
    original = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Form not found")
    
    new_form = models.Form(
        title=f"{original.title} (Copy)",
        status="DRAFT",
        thank_you_message=original.thank_you_message,
        theme_json=original.theme_json
    )
    db.add(new_form)
    db.flush() # get new_form.id
    
    for q in original.questions:
        new_q = models.Question(
            form_id=new_form.id,
            type=q.type,
            title=q.title,
            description=q.description,
            required=q.required,
            position=q.position,
            settings_json=q.settings_json
        )
        db.add(new_q)
        db.flush()
        
        for opt in q.options:
            new_opt = models.QuestionOption(
                question_id=new_q.id,
                label=opt.label,
                position=opt.position
            )
            db.add(new_opt)
    
    db.commit()
    db.refresh(new_form)
    new_form.response_count = 0
    return new_form

@router.post("/forms/{form_id}/publish", response_model=schemas.FormOut)
def publish_form(form_id: int, db: Session = Depends(get_db)):
    db_form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    db_form.status = "PUBLISHED"
    db.commit()
    db.refresh(db_form)
    return db_form

@router.post("/forms/{form_id}/unpublish", response_model=schemas.FormOut)
def unpublish_form(form_id: int, db: Session = Depends(get_db)):
    db_form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    db_form.status = "DRAFT"
    db.commit()
    db.refresh(db_form)
    return db_form

# --- Questions CRUD ---
@router.post("/forms/{form_id}/questions", response_model=schemas.QuestionOut, status_code=status.HTTP_201_CREATED)
def create_question(form_id: int, question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    # Calculate position (max + 1)
    max_pos = db.query(models.Question).filter(models.Question.form_id == form_id).count()
    
    db_question = models.Question(
        form_id=form_id,
        type=question.type,
        title=question.title,
        description=question.description,
        required=question.required,
        position=max_pos,
        settings_json=question.settings_json
    )
    db.add(db_question)
    db.flush()
    
    if question.options:
        for opt in question.options:
            db_opt = models.QuestionOption(
                question_id=db_question.id,
                label=opt.label,
                position=opt.position
            )
            db.add(db_opt)
            
    db.commit()
    db.refresh(db_question)
    return db_question

@router.patch("/questions/{question_id}", response_model=schemas.QuestionOut)
def update_question(question_id: int, question_update: schemas.QuestionUpdate, db: Session = Depends(get_db)):
    db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    update_data = question_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_question, key, value)
    
    db.commit()
    db.refresh(db_question)
    return db_question

@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(question_id: int, db: Session = Depends(get_db)):
    db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(db_question)
    db.commit()

@router.put("/forms/{form_id}/questions/reorder")
def reorder_questions(form_id: int, reorder: schemas.QuestionReorder, db: Session = Depends(get_db)):
    for item in reorder.questions:
        db.query(models.Question).filter(models.Question.id == item.id, models.Question.form_id == form_id).update({"position": item.position})
    db.commit()
    return {"message": "Reordered successfully"}

# --- Options CRUD ---
@router.post("/questions/{question_id}/options", response_model=schemas.QuestionOptionOut)
def add_option(question_id: int, option: schemas.QuestionOptionCreate, db: Session = Depends(get_db)):
    max_pos = db.query(models.QuestionOption).filter(models.QuestionOption.question_id == question_id).count()
    db_opt = models.QuestionOption(
        question_id=question_id,
        label=option.label,
        position=max_pos
    )
    db.add(db_opt)
    db.commit()
    db.refresh(db_opt)
    return db_opt

@router.patch("/options/{option_id}", response_model=schemas.QuestionOptionOut)
def update_option(option_id: int, option_update: schemas.QuestionOptionUpdate, db: Session = Depends(get_db)):
    db_opt = db.query(models.QuestionOption).filter(models.QuestionOption.id == option_id).first()
    if not db_opt:
        raise HTTPException(status_code=404, detail="Option not found")
    if option_update.label is not None:
        db_opt.label = option_update.label
    if option_update.position is not None:
        db_opt.position = option_update.position
    db.commit()
    db.refresh(db_opt)
    return db_opt

@router.delete("/options/{option_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_option(option_id: int, db: Session = Depends(get_db)):
    db_opt = db.query(models.QuestionOption).filter(models.QuestionOption.id == option_id).first()
    if not db_opt:
        raise HTTPException(status_code=404, detail="Option not found")
    db.delete(db_opt)
    db.commit()

# --- Responses and Summary ---
@router.get("/forms/{form_id}/responses", response_model=List[schemas.ResponseOut])
def get_responses(form_id: int, db: Session = Depends(get_db)):
    return db.query(models.Response).filter(models.Response.form_id == form_id).order_by(models.Response.submitted_at.desc()).all()

@router.get("/responses/{response_id}", response_model=schemas.ResponseOut)
def get_response(response_id: int, db: Session = Depends(get_db)):
    resp = db.query(models.Response).filter(models.Response.id == response_id).first()
    if not resp:
        raise HTTPException(status_code=404, detail="Response not found")
    return resp

@router.get("/forms/{form_id}/summary")
def get_summary(form_id: int, db: Session = Depends(get_db)):
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    summary = {}
    for q in form.questions:
        q_data = {
            "title": q.title,
            "type": q.type,
            "count": db.query(models.Answer).filter(models.Answer.question_id == q.id).count(),
        }
        
        if q.type in ["MULTIPLE_CHOICE", "DROPDOWN", "YES_NO"]:
            # count per option/value
            counts = {}
            answers = db.query(models.Answer).filter(models.Answer.question_id == q.id).all()
            for a in answers:
                if a.value:
                    counts[a.value] = counts.get(a.value, 0) + 1
            q_data["distribution"] = counts
            
        elif q.type == "RATING":
            answers = db.query(models.Answer).filter(models.Answer.question_id == q.id).all()
            total = 0
            valid_count = 0
            for a in answers:
                try:
                    total += int(a.value)
                    valid_count += 1
                except:
                    pass
            q_data["average"] = round(total / valid_count, 2) if valid_count > 0 else 0
            
        summary[q.id] = q_data
        
    return summary
