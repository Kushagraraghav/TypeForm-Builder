from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from .database import Base

def generate_slug():
    return uuid.uuid4().hex[:8]

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    forms = relationship("Form", back_populates="owner", cascade="all, delete-orphan")


class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # nullable for backwards compatibility
    title = Column(String, index=True, default="My Form")
    slug = Column(String, unique=True, index=True, default=generate_slug)
    status = Column(String, default="DRAFT")  # DRAFT or PUBLISHED
    thank_you_message = Column(Text, default="Thanks for completing this form! Your response has been submitted.")
    theme_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="forms")
    questions = relationship("Question", back_populates="form", cascade="all, delete-orphan", order_by="Question.position")
    responses = relationship("Response", back_populates="form", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id"))
    type = Column(String)  # SHORT_TEXT, LONG_TEXT, MULTIPLE_CHOICE, DROPDOWN, EMAIL, NUMBER, YES_NO, RATING
    title = Column(String, default="New Question")
    description = Column(String, nullable=True)
    required = Column(Boolean, default=False)
    position = Column(Integer, default=0)
    settings_json = Column(Text, nullable=True)

    form = relationship("Form", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan", order_by="QuestionOption.position")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")


class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    label = Column(String)
    position = Column(Integer, default=0)

    question = relationship("Question", back_populates="options")


class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id"))
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    form = relationship("Form", back_populates="responses")
    answers = relationship("Answer", back_populates="response", cascade="all, delete-orphan")


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("responses.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    value = Column(Text, nullable=True)  # Store everything as text/string for simplicity

    response = relationship("Response", back_populates="answers")
    question = relationship("Question", back_populates="answers")


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_seen_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Webhook(Base):
    __tablename__ = "webhooks"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id"))
    url = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    form = relationship("Form")
