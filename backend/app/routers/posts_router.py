from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db             # Твій шлях до сесії БД
from app.schemas.auth import UserOut         # Твоя схема користувача

from typing import List, Optional

from app.core.database import get_db
from app.core.auth_deps import get_current_user

from app.models.models import User, Post

from app.repositories.post_repo import PostRepository

from ..schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
)

from ..services.post_logic import PostService


router = APIRouter(
    prefix="/api/posts",
    tags=["Posts"],
)


# =====================================
# GET ALL POSTS
# =====================================
@router.get(
    "",
    response_model=List[PostResponse]
)
async def get_posts(
    skip: int = 0,
    limit: int = 10,
    category_id: Optional[int] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = Query(
        default="recent",
        enum=[
            "recent",
            "popular-views",
            "popular-likes",
        ]
    ),
    db: AsyncSession = Depends(get_db),
):
    repo = PostRepository(db)

    posts = await repo.get_posts(
        skip=skip,
        limit=limit,
        category_id=category_id,
        tag=tag,
        search=search,
        sort_by=sort_by,
        status="published",
    )

    for post in posts:
        post.read_time = (
            PostService.calculate_read_time(
                post.content
            )
        )

    return posts


# =====================================
# GET POST BY ID
# =====================================
@router.get(
    "/id/{post_id}",
    response_model=PostResponse
)
async def get_post_by_id(
    post_id: int,
    db: AsyncSession = Depends(get_db),
):
    repo = PostRepository(db)

    post = await repo.get_by_id(post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    await repo.increment_views(post.id)

    post = await repo.get_by_id(post_id)

    post.read_time = (
        PostService.calculate_read_time(
            post.content
        )
    )

    return post


# =====================================
# GET POST BY SLUG
# =====================================
@router.get(
    "/slug/{slug}",
    response_model=PostResponse
)
async def get_post_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    repo = PostRepository(db)

    post = await repo.get_by_slug(slug)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    await repo.increment_views(post.id)

    post = await repo.get_by_slug(slug)

    post.read_time = (
        PostService.calculate_read_time(
            post.content
        )
    )

    return post


# =====================================
# CREATE POST
# =====================================
@router.post(
    "/",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_post(
    post_data: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    validated = (
        PostService.validate_post_data(
            title=post_data.title,
            content=post_data.content,
            status=post_data.status,
            tags=post_data.tags,
        )
    )

    repo = PostRepository(db)

    post = await repo.create_post(
        title=validated["title"],
        slug=validated["slug"],
        content=validated["content"],
        author_id=current_user.id,
        category_id=post_data.category_id,
        cover_image=post_data.cover_image,
        status=validated["status"],
        tags=validated["tags"],
    )

    post.read_time = validated["read_time"]

    return post


# =====================================
# UPDATE POST
# =====================================
@router.put(
    "/{post_id}",
    response_model=PostResponse
)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = PostRepository(db)

    existing_post = await repo.get_by_id(post_id)

    if not existing_post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    if (
        existing_post.author_id != current_user.id
        and not current_user.is_admin
    ):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions",
        )

    update_data = (
        post_data.model_dump(
            exclude_unset=True
        )
    )

    if "title" in update_data:
        update_data["slug"] = (
            PostService.generate_slug(
                update_data["title"]
            )
        )

    updated_post = await repo.update_post(
        post_id,
        update_data,
    )

    if not updated_post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    updated_post.read_time = (
        PostService.calculate_read_time(
            updated_post.content
        )
    )

    return updated_post


# =====================================
# DELETE POST
# =====================================
@router.delete(
    "/{post_id}",
    status_code=status.HTTP_200_OK,
)
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = PostRepository(db)

    existing_post = await repo.get_by_id(post_id)

    if not existing_post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    if (
        existing_post.author_id != current_user.id
        and not current_user.is_admin
    ):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions",
        )

    deleted = await repo.delete_post(
        post_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    return {
        "message": "Post deleted successfully"
    }


# =====================================
# LIKE POST
# =====================================
@router.post("/{post_id}/like")
async def like_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user) # Захищаємо роут, щоб лайкати могли тільки авторизовані
):
    repo = PostRepository(db)
    
    # Викликаємо метод репозиторію, який додасть або прибере лайк
    result = await repo.toggle_like(post_id=post_id, user_id=current_user.id)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Post not found"
        )
        
    return result # Повертає, наприклад: {"liked": True, "likes_count": 12}