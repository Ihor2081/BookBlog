from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from ..repositories.post_repo import PostRepository
from ..services.post_logic import PostService

router = APIRouter(prefix="/api/posts", tags=["Posts"])
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from ..core.database import get_db
from ..schemas.post import PostResponse  # Переконайтеся, що схеми створені
from ..repositories.post_repo import PostRepository
from ..services.post_logic import PostService

router = APIRouter(prefix="/api/posts", tags=["Posts"])

@router.get("/", response_model=List[PostResponse])
async def get_posts(
    skip: int = 0, 
    limit: int = 10, 
    category_id: Optional[int] = None,
    sort_by: Optional[str] = "recent", # recent, popular-views, popular-likes
    db: AsyncSession = Depends(get_db)
):
    """Отримання списку всіх опублікованих постів з фільтрацією та сортуванням"""
    repo = PostRepository(db)
    posts = await repo.get_posts(skip=skip, limit=limit, category_id=category_id, sort_by=sort_by)
    
    # Додаємо розрахунок часу читання "на льоту" через сервіс
    for post in posts:
        post.read_time = PostService.calculate_read_time(post.content)
        
    return posts

@router.get("/{slug}", response_model=PostResponse)
async def get_post_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    """Отримання детальної інформації про пост за його SEO-friendly URL (slug)"""
    repo = PostRepository(db)
    post = await repo.get_by_slug(slug)
    
    if not post:
        raise HTTPException(status_code=404, detail="Статтю не знайдено")
    
    # Автоматично інкрементуємо перегляди при кожному відкритті сторінки
    await repo.increment_views(post.id)
    
    # Додаємо час читання
    post.read_time = PostService.calculate_read_time(post.content)
    
    return post

@router.get("/", response_model=List[PostResponse])
async def list_posts(
    skip: int = 0, 
    limit: int = 10, 
    category_id: Optional[int] = None,
    sort_by: str = Query("recent", enum=["recent", "popular-views", "popular-likes"]),
    db: AsyncSession = Depends(get_db)
):
    repo = PostRepository(db)
    posts = await repo.get_posts(
        skip=skip, 
        limit=limit, 
        category_id=category_id, 
        sort_by=sort_by
    )

@router.post("/{post_id}/like")
async def like_post(post_id: int, db: AsyncSession = Depends(get_db)):
    # Логіка лайків
    return {"status": "success"}