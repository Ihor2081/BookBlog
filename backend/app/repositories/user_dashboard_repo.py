from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, delete
from ..models.models import Post, Like

class UserDashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_posts(self, user_id: int):
        """Отримати всі пости конкретного автора"""
        result = await self.db.execute(
            select(Post).where(Post.author_id == user_id).order_by(Post.created_at.desc())
        )
        return result.scalars().all()

    async def get_user_stats(self, user_id: int):
        """Зібрати статистику для карток в UserDashboard.tsx"""
        # Кількість постів
        post_count_res = await self.db.execute(
            select(func.count(Post.id)).where(Post.author_id == user_id)
        )
        
        # Сума переглядів
        views_sum_res = await self.db.execute(
            select(func.sum(Post.views)).where(Post.author_id == user_id)
        )
        
        # Загальна кількість лайків під усіма постами автора
        likes_count_res = await self.db.execute(
            select(func.count(Like.id)).join(Post).where(Post.author_id == user_id)
        )

        return {
            "total_posts": post_count_res.scalar() or 0,
            "total_views": views_sum_res.scalar() or 0,
            "total_likes": likes_count_res.scalar() or 0
        }
    async def delete_post_securely(self, post_id: int, user_id: int) -> bool:
        from ..models.models import Post
        # Видаляємо лише якщо ID поста та ID автора збігаються
        result = await self.db.execute(
            delete(Post).where(Post.id == post_id, Post.author_id == user_id)
        )
        await self.db.commit()
        return result.rowcount > 0 # Поверне True, якщо пост був знайдений і видалений