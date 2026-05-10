from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


# -------------------------
# BASE
# -------------------------
class PostBase(BaseModel):
    title: str
    content: str
    category_id: int
    tags: List[str] = []


# -------------------------
# CREATE POST
# -------------------------
class PostCreate(PostBase):
    cover_image: Optional[str] = None
    status: Optional[str] = "draft"


# -------------------------
# UPDATE POST
# -------------------------
class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[int] = None
    tags: Optional[List[str]] = None
    cover_image: Optional[str] = None
    status: Optional[str] = None


# -------------------------
# CATEGORY RESPONSE
# -------------------------
class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


# -------------------------
# AUTHOR RESPONSE
# -------------------------
class AuthorResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True


# -------------------------
# POST RESPONSE
# -------------------------
class PostResponse(PostBase):
    id: int
    slug: str

    cover_image: Optional[str] = None
    status: str

    views: int
    read_time: str
    likes_count: int

    created_at: datetime
    updated_at: Optional[datetime] = None

    author: Optional[AuthorResponse] = None
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True


# -------------------------
# SHORT POST CARD
# -------------------------
class PostCardResponse(BaseModel):
    id: int
    title: str
    slug: str
    cover_image: Optional[str] = None
    views: int
    likes_count: int
    read_time: str
    created_at: datetime

    class Config:
        from_attributes = True