from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import List, Optional


# =====================================
# CATEGORY RESPONSE
# =====================================

class CategoryResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


# =====================================
# TAG RESPONSE
# =====================================

class TagResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


# =====================================
# AUTHOR RESPONSE
# =====================================

class AuthorResponse(BaseModel):
    id: int
    username: str
    email: str

    model_config = ConfigDict(from_attributes=True)


# =====================================
# BASE POST
# =====================================

class PostBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)

    content: str = Field(..., min_length=10)

    category_id: Optional[int] = None

    tags: List[str] = []

    cover_image: Optional[str] = None

    status: Optional[str] = "draft"


# =====================================
# CREATE POST
# =====================================

class PostCreate(PostBase):
    slug: Optional[str] = None


# =====================================
# UPDATE POST
# =====================================

class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)

    content: Optional[str] = Field(None, min_length=10)

    category_id: Optional[int] = None

    tags: Optional[List[str]] = None

    cover_image: Optional[str] = None

    status: Optional[str] = None

    slug: Optional[str] = None


# =====================================
# SHORT POST CARD
# =====================================

class PostCardResponse(BaseModel):
    id: int

    title: str

    slug: str

    cover_image: Optional[str] = None

    views: int

    likes_count: int

    read_time: str

    created_at: datetime

    author: Optional[AuthorResponse] = None

    model_config = ConfigDict(from_attributes=True)


# =====================================
# FULL POST RESPONSE
# =====================================

class PostResponse(BaseModel):
    id: int

    title: str

    slug: str

    content: str

    cover_image: Optional[str] = None

    status: str

    views: int

    likes_count: int

    read_time: str

    created_at: datetime

    updated_at: Optional[datetime] = None

    author: Optional[AuthorResponse] = None

    category: Optional[CategoryResponse] = None

    tags: List[TagResponse] = []

    model_config = ConfigDict(from_attributes=True)


# =====================================
# PAGINATION RESPONSE
# =====================================

class PaginatedPostsResponse(BaseModel):
    total: int

    skip: int

    limit: int

    items: List[PostCardResponse]