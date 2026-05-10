from fastapi import APIRouter, Depends
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..core.auth_deps import get_current_user_optional
from ..schemas.comment import CommentCreate, CommentResponse
from ..repositories.comment_repo import CommentRepository
from ..mappers.comment_mapper import to_comment_response

router = APIRouter(prefix="/api/comments", tags=["Comments"])


@router.post("/", response_model=CommentResponse)
async def add_comment(
    comment_data: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    repo = CommentRepository(db)

    user_id = current_user.id if current_user else None

    # дефолтне ім'я для гостя
    if not user_id and not comment_data.guest_name:
        comment_data.guest_name = "Anonymous Guest"

    comment = await repo.create_comment(
        comment_data,
        user_id=user_id
    )

    # ❗ НЕ мутуємо ORM об'єкт
    # Робимо safe response mapping
    # response = CommentResponse.model_validate(comment)

    # додаємо computed field
    # response.is_registered = bool(user_id)

    return to_comment_response(comment, bool(user_id))