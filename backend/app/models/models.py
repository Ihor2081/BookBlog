from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    Table,
    DateTime,
    Boolean,
    UniqueConstraint,
    Index,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..core.database import Base


# ==========================================
# MANY TO MANY: POSTS <-> TAGS
# ==========================================

post_tags = Table(
    "post_tags",
    Base.metadata,
    Column("post_id", ForeignKey("posts.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True),
)


# ==========================================
# USER
# ==========================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(255), unique=True, index=True, nullable=False)

    email = Column(String(255), unique=True, index=True, nullable=False)

    hashed_password = Column(String(255), nullable=False)

    is_admin = Column(Boolean, default=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # RELATIONSHIPS
    posts = relationship(
        "Post",
        back_populates="author",
        cascade="all, delete-orphan",
    )

    likes = relationship(
        "Like",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    comments = relationship(
        "Comment",
        back_populates="user",
        cascade="all, delete-orphan",
    )


# ==========================================
# POST
# ==========================================

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), index=True, nullable=False)

    slug = Column(String(255), unique=True, index=True, nullable=False)

    content = Column(Text, nullable=False)

    cover_image = Column(String(500), nullable=True)

    status = Column(
        String(20),
        default="draft",
        nullable=False,
    )

    views = Column(Integer, default=0)

    likes_count = Column(Integer, default=0)

    read_time = Column(String(50), default="1 min read")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # FOREIGN KEYS
    author_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    category_id = Column(
        Integer,
        ForeignKey("categories.id"),
        nullable=True,
    )

    # RELATIONSHIPS
    author = relationship(
        "User",
        back_populates="posts",
        lazy="selectin",
    )

    category = relationship(
        "Category",
        back_populates="posts",
        lazy="selectin",
    )

    tags = relationship(
        "Tag",
        secondary=post_tags,
        back_populates="posts",
        lazy="selectin",
    )

    comments = relationship(
        "Comment",
        back_populates="post",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    likes = relationship(
        "Like",
        back_populates="post",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


# ==========================================
# COMMENT
# ==========================================

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)

    content = Column(Text, nullable=False)

    guest_name = Column(String(255), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # FOREIGN KEYS
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    post_id = Column(
        Integer,
        ForeignKey("posts.id"),
        nullable=False,
        index=True,
    )

    # RELATIONSHIPS
    user = relationship(
        "User",
        back_populates="comments",
    )

    post = relationship(
        "Post",
        back_populates="comments",
    )


# ==========================================
# CATEGORY
# ==========================================

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), unique=True, nullable=False)

    slug = Column(String(255), unique=True, nullable=True)

    posts = relationship(
        "Post",
        back_populates="category",
    )


# ==========================================
# TAG
# ==========================================

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)

    name = Column(String(100), unique=True, nullable=False)

    posts = relationship(
        "Post",
        secondary=post_tags,
        back_populates="tags",
    )


# ==========================================
# LIKE
# ==========================================

class Like(Base):
    __tablename__ = "likes"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "post_id",
            name="uq_user_post_like",
        ),
        Index(
            "ix_like_user_post",
            "user_id",
            "post_id",
        ),
    )

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    post_id = Column(
        Integer,
        ForeignKey("posts.id"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="likes",
    )

    post = relationship(
        "Post",
        back_populates="likes",
    )