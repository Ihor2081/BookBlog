from typing import Optional # Правильний імпорт
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from .database import get_db
from .config import settings
from ..models.models import User

# tokenUrl вказує на ендпоінт логіну
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Схема для опціонального токена (не видає 401, якщо токена немає)
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    """Обов'язкова авторизація (для Dashboard, Admin тощо)"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = await db.get(User, int(user_id))
    if user is None:
        raise credentials_exception
    return user

async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme_optional), 
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Опціональна авторизація (для коментарів від гостей)"""
    if not token:
        return None
        
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        
        user = await db.get(User, int(user_id))
        return user
    except JWTError:
        # Якщо токен є, але він "битий" або прострочений, 
        # ми все одно вважаємо користувача гостем
        return None