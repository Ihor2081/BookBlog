from sqlalchemy import select, func, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from ..models.models import Post, User, Category

class AdminRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    # --- Аналітика ---
    async def get_analytics(self):
        post_count = await self.db.execute(select(func.count(Post.id)))
        user_count = await self.db.execute(select(func.count(User.id)))
        view_sum = await self.db.execute(select(func.sum(Post.views)))
        
        return {
            "total_posts": post_count.scalar() or 0,
            "total_users": user_count.scalar() or 0,
            "total_views": view_sum.scalar() or 0,
            "active_users": 0 # Заглушка, як у фронтенді
        }

    # --- Керування постами ---
    async def get_all_posts_managed(self):
        # Завантажуємо разом з автором, щоб в адмінці було видно, хто написав
        result = await self.db.execute(
            select(Post).options(selectinload(Post.author)).order_by(Post.created_at.desc())
        )
        return result.scalars().all()

    async def update_post_status(self, post_id: int, status: str):
        # Перевіряємо існування поста перед оновленням
        query = update(Post).where(Post.id == post_id).values(status=status)
        result = await self.db.execute(query)
        await self.db.commit()
        return result.rowcount > 0 # Повертає True, якщо пост знайдено і оновлено

    async def delete_post_any(self, post_id: int):
        query = delete(Post).where(Post.id == post_id)
        result = await self.db.execute(query)
        await self.db.commit()
        return result.rowcount > 0

    # --- Керування категоріями ---
    async def create_category(self, name: str):
        new_cat = Category(name=name)
        self.db.add(new_cat)
        await self.db.commit()
        await self.db.refresh(new_cat)
        return new_cat