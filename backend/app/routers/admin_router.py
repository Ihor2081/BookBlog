from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..core.database import get_db
from ..core.security import verify_admin

from ..repositories.admin_repo import AdminRepository

from ..schemas.admin import (
    CategoryCreate,
    PostStatusUpdate,
)

from ..schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
)

from ..models.models import User, Category

from ..services.post_logic import PostService


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Panel"],
    dependencies=[Depends(verify_admin)],
)


# =========================================
# ANALYTICS
# =========================================

@router.get("/stats")
async def get_admin_dashboard_stats(
    db: AsyncSession = Depends(get_db),
):

    repo = AdminRepository(db)

    return await repo.get_analytics()


# =========================================
# POSTS
# =========================================

@router.get(
    "/posts",
    response_model=List[PostResponse],
)
async def admin_list_all_posts(
    db: AsyncSession = Depends(get_db),
):

    repo = AdminRepository(db)

    return await repo.get_all_posts_managed()


@router.post(
    "/posts",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
)
async def admin_create_post(
    post_data: PostCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(verify_admin),
):

    repo = AdminRepository(db)

    # =====================================
    # VALIDATION
    # =====================================

    if not PostService.validate_title(
        post_data.title
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid title",
        )

    if not PostService.validate_content(
        post_data.content
    ):
        raise HTTPException(
            status_code=400,
            detail="Content must contain at least 10 characters",
        )

    if not PostService.validate_status(
        post_data.status
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid status",
        )

    # =====================================
    # GENERATION
    # =====================================

    slug = PostService.create_slug(
        post_data.title
    )

    read_time = PostService.calculate_read_time(
        post_data.content
    )

    # =====================================
    # CREATE POST
    # =====================================
    category_exists = await db.scalar(
        select(Category).where(
           Category.id == post_data.category_id
        )
    )

    if not category_exists:
       raise HTTPException(
         status_code=400,
         detail="Category does not exist"
       )

    post = await repo.create_post(
        title=post_data.title,
        content=post_data.content,
        category_id=post_data.category_id,
        tags=post_data.tags,
        cover_image=post_data.cover_image,
        status=post_data.status,
        slug=slug,
        author_id=admin_user.id,
        read_time=read_time,
    )

    if not post:
        raise HTTPException(
            status_code=400,
            detail="Failed to create post",
        )

    return post


@router.patch("/posts/{post_id}/status")
async def admin_change_post_status(
    post_id: int,
    data: PostStatusUpdate,
    db: AsyncSession = Depends(get_db),
):

    repo = AdminRepository(db)

    updated = await repo.update_post_status(
        post_id,
        data.status,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    return {
        "message": f"Status changed to {data.status}"
    }

@router.put(
    "/posts/{post_id}",
    response_model=PostResponse,
)
async def admin_update_post(
    post_id: int,
    post_data: PostUpdate,
    db: AsyncSession = Depends(get_db),
):

    repo = AdminRepository(db)

    updated_post = await repo.update_post(
        post_id,
        post_data,
    )

    if not updated_post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    return updated_post

@router.delete("/posts/{post_id}")
async def admin_delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
):

    repo = AdminRepository(db)

    deleted = await repo.delete_post_any(
        post_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    return {
        "message": "Post deleted"
    }


# =========================================
# CATEGORIES
# =========================================

@router.post(
    "/categories",
    status_code=status.HTTP_201_CREATED,
)
async def admin_add_category(
    cat: CategoryCreate,
    db: AsyncSession = Depends(get_db),
):

    repo = AdminRepository(db)

    category = await repo.create_category(
        cat.name
    )

    if not category:
        raise HTTPException(
            status_code=400,
            detail="Category already exists",
        )

    return category