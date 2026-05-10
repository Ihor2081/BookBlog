from sqlalchemy.ext.asyncio import AsyncSession
from ..models.models import Comment
from ..schemas.comment import CommentCreate
from typing import Optional


class CommentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_comment(
        self,
        comment_data: CommentCreate,
        user_id: Optional[int] = None
    ):
        # 1. Валідація
        if not comment_data.post_id or comment_data.post_id <= 0:
            raise ValueError("Invalid post_id")

        if not comment_data.content.strip():
            raise ValueError("Comment cannot be empty")

        # 2. Створення коментаря
        new_comment = Comment(
            content=comment_data.content,
            post_id=comment_data.post_id,
            user_id=user_id,
            guest_name=comment_data.guest_name if not user_id else None
        )

        # 3. Save
        self.db.add(new_comment)
        await self.db.commit()
        await self.db.refresh(new_comment)

        return new_comment