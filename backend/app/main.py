from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import forms, public, contacts, webhooks, auth
from .auth import get_current_user

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Typeform Clone API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(forms.router, prefix="/api", dependencies=[Depends(get_current_user)])
app.include_router(public.router, prefix="/api/public")
app.include_router(contacts.router, prefix="/api", dependencies=[Depends(get_current_user)])
app.include_router(webhooks.router, prefix="/api", dependencies=[Depends(get_current_user)])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Typeform Clone API"}
