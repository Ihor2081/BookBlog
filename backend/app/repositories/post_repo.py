from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import desc, func, update, select, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError

from ..models.models import (
    Post,
    Like,
    Tag,
    Comment,
    Category,
)


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
                selectinload(Post.comments),
                selectinload(Post.likes),
            )
        )

    # =====================================
    # GET POSTS
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

        # =====================================
        # STATUS FILTER
        # =====================================
        if status:
            query = query.where(
                Post.status == status
            )

        # =====================================
        # CATEGORY FILTER
        # =====================================
        if category_id is not None:
            query = query.where(
                Post.category_id == category_id
            )

        # =====================================
        # TAG FILTER
        # =====================================
        if tag:
            query = (
                query.join(Post.tags)
                .where(Tag.name == tag)
            )

        # =====================================
        # SEARCH FILTER
        # =====================================
        if search:
            query = query.where(
                Post.title.ilike(f"%{search}%")
            )

        # =====================================
        # SORTING
        # =====================================
        allowed_sorts = {
            "recent",
            "popular-views",
            "popular-likes",
        }

        if sort_by not in allowed_sorts:
            sort_by = "recent"

        if sort_by == "recent":
            query = query.order_by(
                desc(Post.created_at)
            )

        elif sort_by == "popular-views":
            query = query.order_by(
                desc(Post.views)
            )

        elif sort_by == "popular-likes":
            like_count = func.count(Like.id)

            query = (
                query.outerjoin(
                    Like,
                    Like.post_id == Post.id,
                )
                .group_by(Post.id)
                .order_by(desc(like_count))
            )

        # =====================================
        # PAGINATION
        # =====================================
        result = await self.db.execute(
            query.offset(skip).limit(limit)
        )

        return result.scalars().unique().all()

    # =====================================
    # GET POST BY ID
    # =====================================
    async def get_by_id(
        self,
        post_id: int,
    ):
        result = await self.db.execute(
            self._base_query().where(
                Post.id == post_id
            )
        )

        return result.scalar_one_or_none()

    # =====================================
    # GET POST BY SLUG
    # =====================================
    async def get_post_by_slug(
        self,
        slug: str,
    ):
        result = await self.db.execute(
            self._base_query().where(
                Post.slug == slug
            )
        )

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
        read_time: str = "1 min read",
    ):
        # =====================================
        # CHECK SLUG
        # =====================================
        existing_slug = await self.db.scalar(
            select(Post).where(
                Post.slug == slug
            )
        )

        if existing_slug:
            return None

        # =====================================
        # CHECK CATEGORY
        # =====================================
        if category_id is not None:
            category = await self.db.scalar(
                select(Category).where(
                    Category.id == category_id
                )
            )

            if not category:
                return None

        # =====================================
        # CREATE POST
        # =====================================
        new_post = Post(
            title=title.strip(),
            slug=slug.strip(),
            content=content.strip(),
            author_id=author_id,
            category_id=category_id,
            cover_image=cover_image,
            status=status,
            read_time=read_time,
        )

        # =====================================
        # TAGS
        # =====================================
        tag_objects = []

        if tags:
            cleaned_tags = list(
                {
                    tag.strip().lower()
                    for tag in tags
                    if tag.strip()
                }
            )

            if cleaned_tags:
                existing_tags_result = await self.db.execute(
                    select(Tag).where(
                        Tag.name.in_(cleaned_tags)
                    )
                )

                existing_tags = (
                    existing_tags_result
                    .scalars()
                    .all()
                )

                existing_tag_names = {
                    tag.name for tag in existing_tags
                }

                tag_objects.extend(existing_tags)

                for tag_name in cleaned_tags:
                    if tag_name not in existing_tag_names:
                        new_tag = Tag(name=tag_name)

                        self.db.add(new_tag)

                        await self.db.flush()

                        tag_objects.append(new_tag)

        new_post.tags = tag_objects

        # =====================================
        # SAVE
        # =====================================
        try:
            self.db.add(new_post)

            await self.db.commit()

            return await self.get_by_id(
                new_post.id
            )

        except IntegrityError:
            await self.db.rollback()

            return None

    # =====================================
    # UPDATE POST
    # =====================================
    async def update_post(
        self,
        post_id: int,
        data: dict,
    ):
        post = await self.db.get(
            Post,
            post_id,
        )

        if not post:
            return None

        # =====================================
        # CHECK SLUG
        # =====================================
        if "slug" in data:
            existing_slug = await self.db.scalar(
                select(Post).where(
                    Post.slug == data["slug"],
                    Post.id != post_id,
                )
            )

            if existing_slug:
                return None

        # =====================================
        # UPDATE SIMPLE FIELDS
        # =====================================
        update_fields = [
            "title",
            "slug",
            "content",
            "cover_image",
            "status",
            "category_id",
            "read_time",
        ]

        for field in update_fields:
            if field in data:
                setattr(
                    post,
                    field,
                    data[field],
                )

        # =====================================
        # UPDATE TAGS
        # =====================================
        if "tags" in data:
            tag_names = data["tags"] or []

            cleaned_tags = list(
                {
                    tag.strip().lower()
                    for tag in tag_names
                    if tag.strip()
                }
            )

            existing_tags_result = await self.db.execute(
                select(Tag).where(
                    Tag.name.in_(cleaned_tags)
                )
            )

            existing_tags = (
                existing_tags_result
                .scalars()
                .all()
            )

            existing_tag_names = {
                tag.name for tag in existing_tags
            }

            new_tags = []

            for tag_name in cleaned_tags:
                if tag_name not in existing_tag_names:
                    new_tag = Tag(name=tag_name)

                    self.db.add(new_tag)

                    await self.db.flush()

                    new_tags.append(new_tag)

            post.tags = existing_tags + new_tags

        # =====================================
        # SAVE
        # =====================================
        try:
            await self.db.commit()

            return await self.get_by_id(
                post.id
            )

        except IntegrityError:
            await self.db.rollback()

            return None

    # =====================================
    # DELETE POST
    # =====================================
    async def delete_post(
        self,
        post_id: int,
    ):
        try:
            result = await self.db.execute(
                delete(Post).where(
                    Post.id == post_id
                )
            )

            await self.db.commit()

            return result.rowcount > 0

        except Exception:
            await self.db.rollback()

            return False

    # =====================================
    # INCREMENT VIEWS
    # =====================================
    async def increment_views(
        self,
        post_id: int,
    ):
        await self.db.execute(
            update(Post)
            .where(Post.id == post_id)
            .values(
                views=Post.views + 1
            )
        )

        await self.db.commit()

    # =====================================
    # GET RELATED POSTS
    # =====================================
    async def get_related_posts(
        self,
        post_id: int,
        category_id: int | None,
        limit: int = 3,
    ):
        query = self._base_query().where(
            Post.id != post_id,
            Post.status == "published",
        )

        if category_id:
            query = query.where(
                Post.category_id == category_id
            )

        query = (
            query.order_by(
                desc(Post.created_at)
            )
            .limit(limit)
        )

        result = await self.db.execute(query)

        return result.scalars().unique().all()

    # =====================================
    # GET POSTS COUNT
    # =====================================
    async def get_posts_count(
        self,
        status: str = "published",
    ):
        query = select(func.count(Post.id))

        if status:
            query = query.where(
                Post.status == status
            )

        return await self.db.scalar(query) or 0