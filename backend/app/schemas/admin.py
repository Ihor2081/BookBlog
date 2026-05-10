from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Схеми для категорій та тегів
class CategoryCreate(BaseModel):
    name: str

class TagCreate(BaseModel):
    name: str

# Статистика для Dashboard
class AdminDashboardStats(BaseModel):
    total_posts: int
    total_users: int
    total_views: int
    active_users: int
    popular_posts: List[dict]

# Оновлення статусу поста (draft/published)
class PostStatusUpdate(BaseModel):
    status: str