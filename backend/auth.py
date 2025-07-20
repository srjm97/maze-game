from bson import ObjectId
import httpx
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
from config import settings
from database import get_database
from models import User, UserResponse
from typing import Optional
import logging

logger = logging.getLogger(__name__)
security = HTTPBearer()

class GoogleAuth:
    GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
    GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

    @staticmethod
    async def exchange_code_for_token(code: str, redirect_uri: str) -> dict:
        """Exchange authorization code for access token"""
        async with httpx.AsyncClient() as client:
            token_data = {
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            }
            
            response = await client.post(GoogleAuth.GOOGLE_TOKEN_URL, data=token_data)
            
            if response.status_code != 200:
                logger.error(f"Token exchange failed: {response.text}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to exchange code for token"
                )
            
            return response.json()

    @staticmethod
    async def get_user_info(access_token: str) -> dict:
        """Get user information from Google"""
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {access_token}"}
            response = await client.get(GoogleAuth.GOOGLE_USER_INFO_URL, headers=headers)
            
            if response.status_code != 200:
                logger.error(f"Failed to get user info: {response.text}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to get user information"
                )
            
            return response.json()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(seconds=settings.JWT_EXPIRATION_TIME)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> UserResponse:
    """Get current authenticated user"""
    print(f"Received credentials: {credentials}")
    token = credentials.credentials
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        print(f"Decoded payload: {payload}")
        user_id: str = payload.get("sub")
        if user_id is None:
            print("No user_id in payload")
            raise credentials_exception
    except JWTError as e:
        print(f"JWT decode error: {e}")
        raise credentials_exception
    
    try:
        async with get_database() as db:
            user = await db.users.find_one({"_id": ObjectId(user_id)})
            print(f"Fetched user from DB: {user}")
            if user is None:
                raise credentials_exception
    except Exception as e:
        print(f"Error fetching user from DB: {e}")
        raise HTTPException(status_code=500, detail="Database error")
    
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user["name"],
        picture=user.get("picture"),
        created_at=user["created_at"]
    )