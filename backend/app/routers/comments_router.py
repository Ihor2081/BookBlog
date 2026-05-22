from fastapi import APIRouter, Depends
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..core.auth_deps import get_current_user_optional
from ..schemas.comment import CommentCreate, CommentResponse
from ..repositories.comment_repo import CommentRepository
from ..mappers.comment_mapper import to_comment_response

router = APIRouter(prefix="/api/comments", tags=["Comments"])


@router.get("/post/{post_id}", response_model=list[CommentResponse])
async def get_comments(
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    repo = CommentRepository(db)

    comments = await repo.get_comments_by_post(post_id)

    return [
        to_comment_response(comment, bool(comment.user_id))
        for comment in comments
    ]


@router.post("/post/{post_id}", response_model=CommentResponse)
async def add_comment(
    post_id: int,
    comment_data: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    repo = CommentRepository(db)

    user_id = current_user.id if current_user else None

    if not user_id and not comment_data.guest_name:
        comment_data.guest_name = "Anonymous Guest"

    comment = await repo.create_comment(
        post_id=post_id,
        comment_data=comment_data,
        user_id=user_id
    )

    return to_comment_response(comment, bool(user_id))