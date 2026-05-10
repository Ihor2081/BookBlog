from pydantic import BaseModel
from typing import List
from .post import PostResponse

class UserStats(BaseModel):
    total_posts: int
    total_views: int
    total_likes: int

class UserDashboardData(BaseModel):
    stats: UserStats
    posts: List[PostResponse]