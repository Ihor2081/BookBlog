from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy.ext.asyncio import AsyncSession

from typing import List, Optional

from ..core.database import get_db
from ..core.security import get_current_user

from ..models.models import User

from ..repositories.post_repo import PostRepository

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
    "/",
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
    """
    Get all published posts
    with pagination, filtering,
    searching and sorting.
    """

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
            PostService.calculate_reading_time(
                post.content
            )
        )

        post.likes_count = len(post.likes)

    return posts


# =====================================
# GET POST BY SLUG
# =====================================
@router.get(
    "/{slug}",
    response_model=PostResponse
)
async def get_post_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Get post by SEO slug.
    """

    repo = PostRepository(db)

    post = await repo.get_by_slug(slug)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    # increment views
    await repo.increment_views(post.id)

    # refresh updated views
    post = await repo.get_by_slug(slug)

    post.read_time = (
        PostService.calculate_reading_time(
            post.content
        )
    )

    post.likes_count = len(post.likes)

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
    """
    Create new post.
    """

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

    post.likes_count = 0

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
    """
    Update own post.
    """

    repo = PostRepository(db)

    existing_post = await db.get(
        type(repo).__dict__["__annotations__"].get("Post", object),
        post_id
    )

    existing_post = await db.get(
        __import__(
            "app.models.models",
            fromlist=["Post"]
        ).Post,
        post_id,
    )

    if not existing_post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    # only author or admin
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

    # slug regeneration
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
        PostService.calculate_reading_time(
            updated_post.content
        )
    )

    updated_post.likes_count = len(
        updated_post.likes
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
    """
    Delete own post.
    """

    repo = PostRepository(db)

    existing_post = await db.get(
        __import__(
            "app.models.models",
            fromlist=["Post"]
        ).Post,
        post_id,
    )

    if not existing_post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    # author/admin protection
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
):
    """
    Like system placeholder.
    """

    return {
        "status": "success"
    }