from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from ..core.database import get_db
from ..core.auth_deps import get_current_user
from ..models.models import User
from ..repositories.user_dashboard_repo import UserDashboardRepository
from ..schemas.user_dashboard import UserDashboardData, UserStats
from ..schemas.post import PostResponse
from ..services.post_logic import PostService

router = APIRouter(prefix="/api/dashboard", tags=["User Dashboard"])

@router.get("/", response_model=UserDashboardData)
async def get_dashboard_data(
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    """
    Завантажує статистику та список постів лише для авторизованого користувача.
    """
    repo = UserDashboardRepository(db)
    
    stats = await repo.get_user_stats(current_user.id)
    posts = await repo.get_user_posts(current_user.id)
    
    # Розрахунок часу читання для кожного поста перед відправкою на фронтенд
    for post in posts:
        post.read_time = PostService.calculate_read_time(post.content)
    
    return {
        "stats": stats,
        "posts": posts
    }

@router.get("/my-posts", response_model=List[PostResponse])
async def get_my_posts(
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    """
    Окремий захищений ендпоінт для отримання тільки списку постів автора.
    """
    repo = UserDashboardRepository(db)
    posts = await repo.get_user_posts(current_user.id)
    
    for post in posts:
        post.read_time = PostService.calculate_read_time(post.content)
        
    return posts

@router.delete("/posts/{post_id}")
async def delete_my_post(
    post_id: int, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    """
    Видалення поста з перевіркою власності.
    """
    repo = UserDashboardRepository(db)
    
    # Використовуємо метод репозиторію для безпечного видалення
    success = await repo.delete_post_securely(post_id, current_user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Ви не можете видалити цей пост або його не існує"
        )
    
    return {"message": "Пост успішно видалено"}