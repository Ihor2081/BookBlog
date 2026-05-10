from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import desc, func, update, select
from sqlalchemy.orm import selectinload
from ..models.models import Post, Like


class PostRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    def _base_query(self):
        return select(Post).options(
            selectinload(Post.author),
            selectinload(Post.category),
            selectinload(Post.tags)
        )

    async def get_posts(
        self,
        skip: int = 0,
        limit: int = 10,
        category_id: int = None,
        sort_by: str = "recent"
    ):
        query = self._base_query()

        # filter
        if category_id is not None:
            query = query.where(Post.category_id == category_id)

        # validate sort
        if sort_by not in {"recent", "popular-views", "popular-likes"}:
            sort_by = "recent"

        # sorting
        if sort_by == "recent":
            query = query.order_by(desc(Post.created_at))

        elif sort_by == "popular-views":
            query = query.order_by(desc(Post.views))

        elif sort_by == "popular-likes":
            like_count = func.count(Like.id).label("like_count")

            query = (
                query.outerjoin(Like, Like.post_id == Post.id)
                .group_by(Post.id)
                .order_by(desc(like_count))
            )

        # pagination
        result = await self.db.execute(
            query.offset(skip).limit(limit)
        )

        return result.scalars().unique().all()

    async def increment_views(self, post_id: int):
        await self.db.execute(
            update(Post)
            .where(Post.id == post_id)
            .values(views=Post.views + 1)
        )
        await self.db.commit()

    async def get_by_slug(self, slug: str):
        query = self._base_query().where(Post.slug == slug)

        result = await self.db.execute(query)
        return result.scalar_one_or_none()