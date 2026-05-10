from sqlalchemy import Column, Integer, String, Text, ForeignKey, Table, DateTime, Boolean, UniqueConstraint  
from sqlalchemy.orm import relationship
from sqlalchemy import Index, func
from datetime import datetime
from ..core.database import Base


# Зв'язок багато-до-багатьох для тегів
post_tags = Table(
    'post_tags', Base.metadata,
    Column('post_id', ForeignKey('posts.id'), primary_key=True),
    Column('tag_id', ForeignKey('tags.id'), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    
    posts = relationship("Post", back_populates="author")
    likes = relationship("Like", back_populates="user")
    comments = relationship("Comment", back_populates="user")

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    cover_image = Column(String(255), nullable=True)
   
    views = Column(Integer, default=0)
    status = Column(String(20), default="published", nullable=False) # draft / published
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    author_id = Column(Integer, ForeignKey("users.id"),nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    
    # likes_count = Column(Integer, default=0, nullable=False)
    # read_time = Column(Integer, nullable=True)  # хвилини або секунди

    author = relationship("User", back_populates="posts")
    category = relationship("Category")
    tags = relationship("Tag", secondary=post_tags)
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="post")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    # Для незареєстрованих (Guest)
    guest_name = Column(String(255), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    post_id = Column(Integer, ForeignKey("posts.id"), index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    post = relationship("Post", back_populates="comments")
    user = relationship("User", back_populates="comments")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)

class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True,nullable=False)

class Like(Base):
    __tablename__ = "likes"
    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="uq_user_post_like"),
        Index("ix_like_user_post", "user_id", "post_id"),
    )

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="likes")
    post = relationship("Post", back_populates="likes")