from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.models import Comment, Post, User
from ..schemas.comment import CommentCreate


class CommentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_comments_by_post(self, post_id: int):
        """
        Get all comments for a specific post
        """

        if post_id <= 0:
            raise ValueError("Invalid post_id")

        # check if post exists
        post_result = await self.db.execute(
            select(Post).where(Post.id == post_id)
        )

        post = post_result.scalar_one_or_none()

        if not post:
            raise ValueError("Post not found")

        result = await self.db.execute(
            select(Comment)
            .options(selectinload(Comment.user))
            .where(Comment.post_id == post_id)
            .order_by(Comment.created_at.desc())
        )

        comments = result.scalars().all()

        return comments

    async def create_comment(
        self,
        post_id: int,
        comment_data: CommentCreate,
        user_id: Optional[int] = None
    ):
        """
        Create new comment
        """

        # validate post_id
        if post_id <= 0:
            raise ValueError("Invalid post_id")

        # validate content
        if not comment_data.content.strip():
            raise ValueError("Comment cannot be empty")

        # check if post exists
        post_result = await self.db.execute(
            select(Post).where(Post.id == post_id)
        )

        post = post_result.scalar_one_or_none()

        if not post:
            raise ValueError("Post not found")

        # optional user validation
        if user_id:
            user_result = await self.db.execute(
                select(User).where(User.id == user_id)
            )

            user = user_result.scalar_one_or_none()

            if not user:
                raise ValueError("User not found")

        # create comment
        new_comment = Comment(
            content=comment_data.content.strip(),
            post_id=post_id,
            user_id=user_id,
            guest_name=(
                comment_data.guest_name.strip()
                if not user_id and comment_data.guest_name
                else None
            )
        )

        self.db.add(new_comment)

        await self.db.commit()
        await self.db.refresh(new_comment)

        return new_comment

    async def delete_comment(self, comment_id: int):
        """
        Delete comment by id
        """

        result = await self.db.execute(
            select(Comment).where(Comment.id == comment_id)
        )

        comment = result.scalar_one_or_none()

        if not comment:
            raise ValueError("Comment not found")

        await self.db.delete(comment)
        await self.db.commit()

        return True

    async def get_comment_by_id(self, comment_id: int):
        """
        Get single comment by id
        """

        result = await self.db.execute(
            select(Comment)
            .options(selectinload(Comment.user))
            .where(Comment.id == comment_id)
        )

        return result.scalar_one_or_none()