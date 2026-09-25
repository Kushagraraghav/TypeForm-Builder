from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime
import json

# ------------- Options -------------
class QuestionOptionBase(BaseModel):
    label: str
    position: int = 0

class QuestionOptionCreate(QuestionOptionBase):
    pass

class QuestionOptionUpdate(BaseModel):
    label: Optional[str] = None
    position: Optional[int] = None

class QuestionOptionOut(QuestionOptionBase):
    id: int
    question_id: int
    class Config:
        orm_mode = True
        from_attributes = True

# ------------- Questions -------------
class QuestionBase(BaseModel):
    type: str
    title: str = "New Question"
    description: Optional[str] = None
    required: bool = False
    position: int = 0
    settings_json: Optional[str] = None

class QuestionCreate(QuestionBase):
    options: Optional[List[QuestionOptionCreate]] = []

class QuestionUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    required: Optional[bool] = None
    position: Optional[int] = None
    settings_json: Optional[str] = None

class QuestionOut(QuestionBase):
    id: int
    form_id: int
    options: List[QuestionOptionOut] = []
    class Config:
        orm_mode = True
        from_attributes = True

# ------------- Forms -------------
class FormBase(BaseModel):
    title: str = "My Form"
    thank_you_message: str = "Thanks for completing this form! Your response has been submitted."
    theme_json: Optional[str] = None

class FormCreate(FormBase):
    pass

class FormUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    thank_you_message: Optional[str] = None
    theme_json: Optional[str] = None

class FormOut(FormBase):
    id: int
    slug: str
    status: str
    created_at: datetime
    updated_at: datetime
    questions: List[QuestionOut] = []
    response_count: Optional[int] = 0

    class Config:
        orm_mode = True
        from_attributes = True

# ------------- Reorder -------------
class QuestionReorderItem(BaseModel):
    id: int
    position: int

class QuestionReorder(BaseModel):
    questions: List[QuestionReorderItem]

# ------------- Answers -------------
class AnswerBase(BaseModel):
    question_id: int
    value: Optional[str] = None

class AnswerCreate(AnswerBase):
    pass

class AnswerOut(AnswerBase):
    id: int
    response_id: int
    class Config:
        orm_mode = True
        from_attributes = True

# ------------- Responses -------------
class ResponseCreate(BaseModel):
    answers: List[AnswerCreate]

class ResponseOut(BaseModel):
    id: int
    form_id: int
    submitted_at: datetime
    answers: List[AnswerOut] = []
    class Config:
        orm_mode = True
        from_attributes = True

# ------------- Contacts -------------
class ContactOut(BaseModel):
    id: int
    email: str
    first_seen_at: datetime
    class Config:
        orm_mode = True
        from_attributes = True

# ------------- Webhooks -------------
class WebhookBase(BaseModel):
    url: str
    is_active: bool = True

class WebhookCreate(WebhookBase):
    pass

class WebhookUpdate(BaseModel):
    url: Optional[str] = None
    is_active: Optional[bool] = None

class WebhookOut(WebhookBase):
    id: int
    form_id: int
    created_at: datetime
    class Config:
        orm_mode = True
        from_attributes = True
