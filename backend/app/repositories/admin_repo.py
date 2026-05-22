from sqlalchemy import select, func, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError

from ..models.models import (
    Post,
    User,
    Category,
    Comment,
    Like,
    Tag,
    post_tags,
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

        return result.scalars().unique().all()

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
        read_time: str,
    ):

        try:

            # =====================================
            # CHECK CATEGORY
            # =====================================

            if category_id is not None:

                category = await self.db.scalar(
                    select(Category)
                    .where(Category.id == category_id)
                )

                if not category:
                    return None

            # =====================================
            # CHECK SLUG
            # =====================================

            existing_slug = await self.db.scalar(
                select(Post)
                .where(Post.slug == slug)
            )

            if existing_slug:
                return None

            # =====================================
            # CREATE POST
            # =====================================

            new_post = Post(
                title=title.strip(),
                content=content.strip(),
                category_id=category_id,
                cover_image=cover_image,
                status=status,
                slug=slug,
                author_id=author_id,
                read_time=read_time,
            )

            # =====================================
            # TAGS
            # =====================================

            tag_objects = []

            for tag_name in tags:

                clean_tag = tag_name.strip().lower()

                if not clean_tag:
                    continue

                existing_tag = await self.db.scalar(
                    select(Tag)
                    .where(Tag.name == clean_tag)
                )

                if existing_tag:

                    tag_objects.append(existing_tag)

                else:

                    new_tag = Tag(name=clean_tag)

                    self.db.add(new_tag)

                    await self.db.flush()

                    tag_objects.append(new_tag)

            new_post.tags = tag_objects

            self.db.add(new_post)

            await self.db.commit()

            # =====================================
            # RELOAD POST
            # =====================================

            result = await self.db.execute(
                select(Post)
                .options(
                    selectinload(Post.author),
                    selectinload(Post.category),
                    selectinload(Post.tags),
                )
                .where(Post.id == new_post.id)
            )

            return result.scalar_one()

        except IntegrityError:

            await self.db.rollback()

            return None

        except Exception as e:

            await self.db.rollback()

            print("CREATE POST ERROR:", str(e))

            return None

    async def update_post(
        self,
        post_id: int,
        data,
    ):

        try:

            # =====================================
            # GET POST WITH RELATIONS
            # =====================================

            result = await self.db.execute(
                select(Post)
                .options(
                    selectinload(Post.author),
                    selectinload(Post.category),
                    selectinload(Post.tags),
                )
                .where(Post.id == post_id)
            )

            post = result.scalar_one_or_none()

            if not post:
                return None

            # =====================================
            # UPDATE DATA
            # =====================================

            update_data = data.model_dump(
                exclude_unset=True
            )

            # =====================================
            # HANDLE TAGS
            # =====================================

            tags = update_data.pop("tags", None)

            if tags is not None:

                tag_objects = []

                for tag_name in tags:

                    clean_tag = tag_name.strip().lower()

                    if not clean_tag:
                        continue

                    existing_tag = await self.db.scalar(
                        select(Tag)
                        .where(Tag.name == clean_tag)
                    )

                    if existing_tag:

                        tag_objects.append(existing_tag)

                    else:

                        new_tag = Tag(name=clean_tag)

                        self.db.add(new_tag)

                        await self.db.flush()

                        tag_objects.append(new_tag)

                post.tags = tag_objects

            # =====================================
            # HANDLE NORMAL FIELDS
            # =====================================

            allowed_fields = {
                "title",
                "content",
                "cover_image",
                "status",
                "slug",
                "category_id",
                "read_time",
            }

            for field, value in update_data.items():

                if field in allowed_fields:

                    setattr(post, field, value)

            await self.db.commit()

            # =====================================
            # RELOAD POST
            # =====================================

            result = await self.db.execute(
                select(Post)
                .options(
                    selectinload(Post.author),
                    selectinload(Post.category),
                    selectinload(Post.tags),
                )
                .where(Post.id == post.id)
            )

            updated_post = result.scalar_one()

            return updated_post

        except IntegrityError:

            await self.db.rollback()

            return None

        except Exception as e:

            await self.db.rollback()

            print("UPDATE POST ERROR:", str(e))

            return None

    async def update_post_status(
        self,
        post_id: int,
        status: str,
    ) -> bool:

        try:

            query = (
                update(Post)
                .where(Post.id == post_id)
                .values(status=status)
            )

            result = await self.db.execute(query)

            await self.db.commit()

            return result.rowcount > 0

        except Exception as e:

            await self.db.rollback()

            print("UPDATE STATUS ERROR:", str(e))

            return False

    async def delete_post_any(
        self,
        post_id: int,
    ) -> bool:

        try:

            await self.db.execute(
                delete(Comment)
                .where(Comment.post_id == post_id)
            )

            await self.db.execute(
                delete(Like)
                .where(Like.post_id == post_id)
            )

            await self.db.execute(
                delete(post_tags)
                .where(post_tags.c.post_id == post_id)
            )

            result = await self.db.execute(
                delete(Post)
                .where(Post.id == post_id)
            )

            await self.db.commit()

            return result.rowcount > 0

        except Exception as e:

            await self.db.rollback()

            print("DELETE ERROR:", str(e))

            return False

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

        except IntegrityError as e:

            await self.db.rollback()

            print("CREATE CATEGORY ERROR:", str(e))

            return None