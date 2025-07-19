from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

class User(BaseModel):
    email: EmailStr
    name: str
    picture: Optional[str] = None
    google_id: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
