from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True  # Для Pydantic v2 (щоб працювати з моделями SQLAlchemy)
        # Якщо використовуєш старий Pydantic v1, напиши замість цього: orm_mode = True