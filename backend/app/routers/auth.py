from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
from datetime import timedelta
import os

from ..database import get_db
from ..models import User
from ..auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# Replace with your actual Google Client ID if needed
GOOGLE_CLIENT_ID = "828118333049-3d9tp6f6681p9nfi5f2vf5e6f10moqq4.apps.googleusercontent.com"

class GoogleAuthRequest(BaseModel):
    token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.post("/google", response_model=TokenResponse)
def google_auth(request: GoogleAuthRequest, db: Session = Depends(get_db)):
    try:
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(request.token, requests.Request(), GOOGLE_CLIENT_ID)
        
        email = idinfo.get('email')
        name = idinfo.get('name', '')
        
        if not email:
            raise ValueError("No email in token")
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Create user
        user = User(email=email, name=name)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    # Generate backend JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
