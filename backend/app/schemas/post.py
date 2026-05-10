from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


# =========================
# BASE
# =========================
class PostBase(BaseModel):
    title: str
    content: str

    # For MVP keep single category
    category_id: int

    # Tags list
    tags: List[str] = []

    # Draft / published
    status: str = "draft"


# =========================
# CREATE
# =========================
class PostCreate(PostBase):
    cover_image: Optional[str] = None

    # Optional custom slug
    slug: Optional[str] = None


# =========================
# UPDATE
# =========================
class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[int] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None
    cover_image: Optional[str] = None


# =========================
# RESPONSE
# =========================
class PostResponse(PostBase):
    id: int

    slug: str

    cover_image: Optional[str]

    views: int

    read_time: str

    likes_count: int

    created_at: datetime

    updated_at: Optional[datetime]

    author_id: int

    class Config:
        from_attributes = True