from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..repositories.category_repo import CategoryRepository
from ..schemas.post import CategoryResponse

router = APIRouter(
    prefix="/api/categories",
    tags=["Categories"]
)


@router.get("/", response_model=list[CategoryResponse])
async def get_categories(
    db: AsyncSession = Depends(get_db)
):
    repo = CategoryRepository(db)

    return await repo.get_all()