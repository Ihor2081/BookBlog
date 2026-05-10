from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CommentCreate(BaseModel):
    content: str
    post_id: int
    guest_name: Optional[str] = None


class CommentResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    post_id: int
    user_id: Optional[int]
    guest_name: Optional[str]

    is_registered: bool  # OK

    class Config:
        from_attributes = True