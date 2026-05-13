from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.models import Category


class CategoryRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self):

        result = await self.db.execute(
            select(Category).order_by(Category.name)
        )

        return result.scalars().all()