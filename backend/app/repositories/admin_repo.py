from sqlalchemy import select, func, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError

from ..models.models import (
    Post,
    User,
    Category,
    Tag,
)


class AdminRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    # =====================================
    # ANALYTICS
    # =====================================

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
            select(func.count(Post.id))
            .where(Post.status == "published")
        )

        draft_posts = await self.db.scalar(
            select(func.count(Post.id))
            .where(Post.status == "draft")
        )

        return {
            "total_posts": total_posts or 0,
            "total_users": total_users or 0,
            "total_views": total_views or 0,
            "published_posts": published_posts or 0,
            "draft_posts": draft_posts or 0,
        }

    # =====================================
    # POSTS MANAGEMENT
    # =====================================

    async def get_all_posts_managed(self):

        result = await self.db.execute(
            select(Post)
            .options(
                selectinload(Post.author),
                selectinload(Post.category),
                selectinload(Post.tags),
            )
            .order_by(Post.created_at.desc())
        )

        return result.scalars().all()

    async def create_post(
        self,
        title: str,
        content: str,
        category_id: int | None,
        tags: list[str],
        cover_image: str | None,
        status: str,
        slug: str,
        author_id: int,
        read_time: str = "1 min read",
    ):

        new_post = Post(
            title=title,
            content=content,
            category_id=category_id,
            cover_image=cover_image,
            status=status,
            slug=slug,
            author_id=author_id,
            read_time=read_time,
        )

        # =========================
        # TAGS
        # =========================

        tag_objects = []

        for tag_name in tags:

            clean_tag = tag_name.strip().lower()

            existing_tag = await self.db.scalar(
                select(Tag).where(Tag.name == clean_tag)
            )

            if existing_tag:
                tag_objects.append(existing_tag)

            else:
                new_tag = Tag(name=clean_tag)

                self.db.add(new_tag)

                await self.db.flush()

                tag_objects.append(new_tag)

        new_post.tags = tag_objects

        # =========================
        # SAVE
        # =========================

        try:
            self.db.add(new_post)

            await self.db.commit()

            await self.db.refresh(new_post)

            return new_post

        except IntegrityError:

            await self.db.rollback()

            return None

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

    async def delete_post_any(
        self,
        post_id: int,
    ) -> bool:

        query = delete(Post).where(Post.id == post_id)

        result = await self.db.execute(query)

        await self.db.commit()

        return result.rowcount > 0

    # =====================================
    # CATEGORY MANAGEMENT
    # =====================================

    async def create_category(
        self,
        name: str,
    ):

        existing_category = await self.db.scalar(
            select(Category)
            .where(Category.name == name)
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