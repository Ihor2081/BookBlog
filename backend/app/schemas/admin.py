from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime


# =====================================
# CATEGORY SCHEMAS
# =====================================
class CategoryCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str):
        value = value.strip()

        if not value:
            raise ValueError(
                "Category name cannot be empty"
            )

        return value


class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


# =====================================
# TAG SCHEMAS
# =====================================
class TagCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=50
    )

    @field_validator("name")
    @classmethod
    def validate_tag_name(cls, value: str):
        value = value.strip().lower()

        if not value:
            raise ValueError(
                "Tag name cannot be empty"
            )

        return value


class TagResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


# =====================================
# ADMIN ANALYTICS
# =====================================
class PopularPost(BaseModel):
    id: int
    title: str
    views: int
    likes_count: int


class AdminDashboardStats(BaseModel):
    total_posts: int
    total_users: int
    total_views: int

    published_posts: int
    draft_posts: int

    popular_posts: List[PopularPost] = []


# =====================================
# POST STATUS UPDATE
# =====================================
class PostStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str):
        allowed_statuses = [
            "draft",
            "published"
        ]

        if value not in allowed_statuses:
            raise ValueError(
                f"Status must be one of: {allowed_statuses}"
            )

        return value


# =====================================
# ADMIN POST UPDATE
# =====================================
class AdminPostUpdate(BaseModel):
    title: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=255
    )

    content: Optional[str] = Field(
        default=None,
        min_length=20
    )

    category_id: Optional[int] = None

    tags: Optional[List[str]] = []

    cover_image: Optional[str] = None

    status: Optional[str] = "draft"


# =====================================
# ADMIN POST RESPONSE
# =====================================
class AdminPostResponse(BaseModel):
    id: int
    title: str
    slug: str

    content: str

    cover_image: Optional[str]

    status: str

    views: int
    likes_count: int
    read_time: str

    author_id: int
    category_id: Optional[int]

    created_at: datetime

    class Config:
        from_attributes = True