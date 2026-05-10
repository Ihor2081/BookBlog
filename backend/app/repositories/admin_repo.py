from sqlalchemy import select, func, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError

from ..models.models import Post, User, Category


class AdminRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    # =========================
    # ANALYTICS
    # =========================
    async def get_analytics(self):
        total_posts = await self.db.scalar(
            select(func.count(Post.id))
        )

        total_users = await self.db.scalar(
            select(func.count(User.id))
        )

        total_views = await self.db.scalar(
            select(func.sum(Post.views))
        )

        published_posts = await self.db.scalar(
            select(func.count(Post.id)).where(Post.status == "published")
        )

        draft_posts = await self.db.scalar(
            select(func.count(Post.id)).where(Post.status == "draft")
        )

        return {
            "total_posts": total_posts or 0,
            "total_users": total_users or 0,
            "total_views": total_views or 0,
            "published_posts": published_posts or 0,
            "draft_posts": draft_posts or 0,
        }

    # =========================
    # POSTS MANAGEMENT
    # =========================
    async def get_all_posts_managed(self):
        result = await self.db.execute(
            select(Post)
            .options(
                selectinload(Post.author),
                selectinload(Post.categories),
                selectinload(Post.tags),
            )
            .order_by(Post.created_at.desc())
        )

        return result.scalars().all()

    async def update_post_status(
        self,
        post_id: int,
        status: str,
    ) -> bool:

        if status not in ["draft", "published"]:
            return False

        query = (
            update(Post)
            .where(Post.id == post_id)
            .values(status=status)
        )

        result = await self.db.execute(query)

        await self.db.commit()

        return result.rowcount > 0

    async def delete_post_any(self, post_id: int) -> bool:
        query = delete(Post).where(Post.id == post_id)

        result = await self.db.execute(query)

        await self.db.commit()

        return result.rowcount > 0

    # =========================
    # CATEGORY MANAGEMENT
    # =========================
    async def create_category(self, name: str):

        existing_category = await self.db.scalar(
            select(Category).where(Category.name == name)
        )

        if existing_category:
            return None

        new_category = Category(name=name)

        try:
            self.db.add(new_category)

            await self.db.commit()

            await self.db.refresh(new_category)

            return new_category

        except IntegrityError:
            await self.db.rollback()
            return None