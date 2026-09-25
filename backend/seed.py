from app.database import SessionLocal, engine, Base
from app import models

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if db.query(models.Form).count() > 0:
        print("Database already seeded.")
        return

    # Create first form
    f1 = models.Form(title="Customer Feedback", status="PUBLISHED", slug="custfdbk", thank_you_message="Thanks for your feedback!")
    db.add(f1)
    db.flush()

    q1 = models.Question(form_id=f1.id, type="SHORT_TEXT", title="What is your name?", required=True, position=0)
    q2 = models.Question(form_id=f1.id, type="EMAIL", title="What is your email?", required=True, position=1)
    q3 = models.Question(form_id=f1.id, type="MULTIPLE_CHOICE", title="How did you hear about us?", position=2)
    q4 = models.Question(form_id=f1.id, type="RATING", title="How would you rate your experience?", position=3)
    
    db.add_all([q1, q2, q3, q4])
    db.flush()

    db.add(models.QuestionOption(question_id=q3.id, label="Google", position=0))
    db.add(models.QuestionOption(question_id=q3.id, label="Instagram", position=1))
    db.add(models.QuestionOption(question_id=q3.id, label="Friend", position=2))

    # Add a draft form
    f2 = models.Form(title="Event Registration", status="DRAFT", slug="evntreg")
    db.add(f2)

    db.commit()
    db.close()
    print("Database seeded successfully.")

if __name__ == "__main__":
    seed()
