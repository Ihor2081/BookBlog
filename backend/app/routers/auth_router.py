from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from ..core.security import verify_password, create_access_token
from ..repositories.user_repo import UserRepository
from ..schemas.auth import UserCreate, UserLogin, Token, UserOut

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserOut)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    
    # Перевірка чи юзер вже існує
    existing_user = await repo.get_by_email(user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Користувач з таким email вже існує")
    
    return await repo.create_user(user_data)

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    user = await repo.get_by_email(credentials.email)
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Невірний email або пароль"
        )
    
    # Створення токена (кладемо ID та роль в payload)
    access_token = create_access_token(
        data={"sub": str(user.id), "is_admin": user.is_admin}
    )
    return {"access_token": access_token, "token_type": "bearer"}