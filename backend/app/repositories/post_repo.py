from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import desc, func, update, select, delete
from sqlalchemy.orm import selectinload

from ..models.models import Post, Like, Tag


class PostRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    # =====================================
    # BASE QUERY
    # =====================================
    def _base_query(self):
        return (
            select(Post)
            .options(
                selectinload(Post.author),
                selectinload(Post.category),
                selectinload(Post.tags),
            )
        )

    # =====================================
    # GET POSTS
    # SUPPORTS:
    # - pagination
    # - filtering
    # - sorting
    # =====================================
    async def get_posts(
        self,
        skip: int = 0,
        limit: int = 10,
        category_id: int | None = None,
        tag: str | None = None,
        search: str | None = None,
        status: str = "published",
        sort_by: str = "recent",
    ):
        query = self._base_query()

        # -------------------------
        # STATUS FILTER
        # -------------------------
        if status:
            query = query.where(Post.status == status)

        # -------------------------
        # CATEGORY FILTER
        # -------------------------
        if category_id is not None:
            query = query.where(Post.category_id == category_id)

        # -------------------------
        # TAG FILTER
        # -------------------------
        if tag:
            query = query.join(Post.tags).where(Tag.name == tag)

        # -------------------------
        # SEARCH FILTER
        # -------------------------
        if search:
            query = query.where(
                Post.title.ilike(f"%{search}%")
            )

        # -------------------------
        # SORTING
        # -------------------------
        if sort_by not in {
            "recent",
            "popular-views",
            "popular-likes",
        }:
            sort_by = "recent"

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

        # -------------------------
        # PAGINATION
        # -------------------------
        result = await self.db.execute(
            query.offset(skip).limit(limit)
        )

        return result.scalars().unique().all()

    # =====================================
    # GET POST BY SLUG
    # =====================================
    async def get_by_slug(self, slug: str):
        query = self._base_query().where(
            Post.slug == slug
        )

        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    # =====================================
    # CREATE POST
    # =====================================
    async def create_post(
        self,
        title: str,
        slug: str,
        content: str,
        author_id: int,
        category_id: int | None = None,
        cover_image: str | None = None,
        status: str = "draft",
        tags: list[str] | None = None,
    ):
        new_post = Post(
            title=title,
            slug=slug,
            content=content,
            author_id=author_id,
            category_id=category_id,
            cover_image=cover_image,
            status=status,
        )

        # -------------------------
        # TAGS
        # -------------------------
        if tags:
            existing_tags_result = await self.db.execute(
                select(Tag).where(Tag.name.in_(tags))
            )

            existing_tags = existing_tags_result.scalars().all()

            existing_tag_names = {
                tag.name for tag in existing_tags
            }

            new_tags = []

            for tag_name in tags:
                if tag_name not in existing_tag_names:
                    new_tag = Tag(name=tag_name)
                    self.db.add(new_tag)
                    new_tags.append(new_tag)

            await self.db.flush()

            new_post.tags = existing_tags + new_tags

        self.db.add(new_post)

        await self.db.commit()

        await self.db.refresh(new_post)

        return new_post

    # =====================================
    # UPDATE POST
    # =====================================
    async def update_post(
        self,
        post_id: int,
        data: dict,
    ):
        post = await self.db.get(Post, post_id)

        if not post:
            return None

        # -------------------------
        # SIMPLE FIELDS
        # -------------------------
        update_fields = [
            "title",
            "slug",
            "content",
            "cover_image",
            "status",
            "category_id",
        ]

        for field in update_fields:
            if field in data:
                setattr(post, field, data[field])

        # -------------------------
        # TAGS
        # -------------------------
        if "tags" in data:
            tag_names = data["tags"] or []

            existing_tags_result = await self.db.execute(
                select(Tag).where(Tag.name.in_(tag_names))
            )

            existing_tags = existing_tags_result.scalars().all()

            existing_tag_names = {
                tag.name for tag in existing_tags
            }

            new_tags = []

            for tag_name in tag_names:
                if tag_name not in existing_tag_names:
                    new_tag = Tag(name=tag_name)
                    self.db.add(new_tag)
                    new_tags.append(new_tag)

            await self.db.flush()

            post.tags = existing_tags + new_tags

        await self.db.commit()

        await self.db.refresh(post)

        return post

    # =====================================
    # DELETE POST
    # =====================================
    async def delete_post(self, post_id: int):
        query = delete(Post).where(Post.id == post_id)

        result = await self.db.execute(query)

        await self.db.commit()

        return result.rowcount > 0

    # =====================================
    # INCREMENT VIEWS
    # =====================================
    async def increment_views(self, post_id: int):
        await self.db.execute(
            update(Post)
            .where(Post.id == post_id)
            .values(views=Post.views + 1)
        )

        await self.db.commit()