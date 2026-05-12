from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from slugify import slugify

from ..core.database import get_db
from ..core.security import verify_admin

from ..repositories.admin_repo import AdminRepository

from ..schemas.admin import (
    CategoryCreate,
    PostStatusUpdate,
)

from ..schemas.post import (
    PostCreate,
    PostResponse,
)

from ..models.models import User


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

    # =========================
    # SLUG GENERATION
    # =========================

    slug = slugify(post_data.title)

    # =========================
    # READING TIME
    # =========================

    word_count = len(post_data.content.split())

    minutes = max(1, word_count // 200)

    read_time = f"{minutes} min read"

    # =========================
    # CREATE POST
    # =========================

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
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не вдалося створити пост",
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пост не знайдено",
        )

    return {
        "message": f"Статус змінено на {data.status}"
    }


@router.delete(
    "/posts/{post_id}",
    status_code=status.HTTP_200_OK,
)
async def admin_delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
):

    repo = AdminRepository(db)

    deleted = await repo.delete_post_any(post_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пост не знайдено",
        )

    return {
        "message": "Пост видалено адміном"
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

    category = await repo.create_category(cat.name)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Категорія вже існує",
        )

    return category