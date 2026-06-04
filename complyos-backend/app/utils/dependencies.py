from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from app.config import settings

async def verify_token(token: str) -> dict:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

async def get_current_user(token: str = Depends()) -> dict:
    """Get current authenticated user from token"""
    payload = await verify_token(token)
    return payload
