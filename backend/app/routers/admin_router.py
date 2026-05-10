from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from ..core.database import get_db
from ..core.security import verify_admin
from ..repositories.admin_repo import AdminRepository
from ..schemas.admin import CategoryCreate, PostStatusUpdate
# Додамо схему для статистики, щоб Swagger розумів структуру відповіді
from ..schemas.user_dashboard import UserStats 
from ..schemas.post import PostResponse

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Panel"],
    # Це правильне рішення: захищає одразу всі методи нижче
    dependencies=[Depends(verify_admin)]
)

@router.get("/stats") # Можна додати response_model=dict або спеціальну схему
async def get_admin_dashboard_stats(db: AsyncSession = Depends(get_db)):
    repo = AdminRepository(db)
    # Повертає {total_posts, total_users, total_views, active_users}
    return await repo.get_analytics()

@router.get("/posts", response_model=List[PostResponse])
async def admin_list_all_posts(db: AsyncSession = Depends(get_db)):
    repo = AdminRepository(db)
    # Важливо: у репозиторії має бути selectinload(Post.author)
    return await repo.get_all_posts_managed()

@router.patch("/posts/{post_id}/status")
async def admin_change_post_status(
    post_id: int, 
    data: PostStatusUpdate, 
    db: AsyncSession = Depends(get_db)
):
    repo = AdminRepository(db)
    updated = await repo.update_post_status(post_id, data.status)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Пост не знайдено"
        )
    return {"message": f"Статус змінено на {data.status}"}

@router.delete("/posts/{post_id}", status_code=status.HTTP_200_OK)
async def admin_delete_post(post_id: int, db: AsyncSession = Depends(get_db)):
    repo = AdminRepository(db)
    deleted = await repo.delete_post_any(post_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Пост не знайдено"
        )
    return {"message": "Пост видалено адміном"}

@router.post("/categories", status_code=status.HTTP_201_CREATED)
async def admin_add_category(cat: CategoryCreate, db: AsyncSession = Depends(get_db)):
    repo = AdminRepository(db)
    return await repo.create_category(cat.name)