import math
import re
from typing import List


class PostService:

    # =====================================
    # READING TIME CALCULATION
    # =====================================
    @staticmethod
    def calculate_reading_time(content: str) -> str:
        """
        Calculates approximate reading time.

        Average reading speed:
        200 words per minute
        """

        if not content:
            return "1 min read"

        words_per_minute = 200

        words = len(
            re.findall(r"\w+", content)
        )

        minutes = max(
            1,
            math.ceil(words / words_per_minute)
        )

        return f"{minutes} min read"

    # =====================================
    # SLUG GENERATION
    # =====================================
    @staticmethod
    def generate_slug(title: str) -> str:
        """
        Generates SEO-friendly slug.

        Example:
        'Hello World!!!'
        ->
        'hello-world'
        """

        if not title:
            return ""

        slug = title.lower().strip()

        # replace spaces/underscores with -
        slug = re.sub(r"[\s_]+", "-", slug)

        # remove non-alphanumeric chars except -
        slug = re.sub(r"[^a-z0-9\-]", "", slug)

        # remove duplicate -
        slug = re.sub(r"-+", "-", slug)

        # remove leading/trailing -
        slug = slug.strip("-")

        return slug

    # =====================================
    # TITLE VALIDATION
    # =====================================
    @staticmethod
    def validate_title(title: str) -> str:
        """
        Validates post title.
        """

        if not title:
            raise ValueError("Title is required")

        title = title.strip()

        if len(title) < 3:
            raise ValueError(
                "Title must contain at least 3 characters"
            )

        if len(title) > 255:
            raise ValueError(
                "Title cannot exceed 255 characters"
            )

        return title

    # =====================================
    # CONTENT VALIDATION
    # =====================================
    @staticmethod
    def validate_content(content: str) -> str:
        """
        Validates post content.
        """

        if not content:
            raise ValueError("Content is required")

        content = content.strip()

        if len(content) < 20:
            raise ValueError(
                "Content is too short"
            )

        return content

    # =====================================
    # STATUS VALIDATION
    # =====================================
    @staticmethod
    def validate_status(status: str) -> str:
        """
        Validates post status.
        """

        allowed_statuses = [
            "draft",
            "published"
        ]

        if status not in allowed_statuses:
            raise ValueError(
                f"Status must be one of: {allowed_statuses}"
            )

        return status

    # =====================================
    # TAGS VALIDATION
    # =====================================
    @staticmethod
    def validate_tags(tags: List[str]) -> List[str]:
        """
        Cleans and validates tags.
        """

        if not tags:
            return []

        cleaned_tags = []

        for tag in tags:

            if not tag:
                continue

            clean_tag = tag.strip().lower()

            if len(clean_tag) < 2:
                continue

            if len(clean_tag) > 30:
                continue

            if clean_tag not in cleaned_tags:
                cleaned_tags.append(clean_tag)

        return cleaned_tags

    # =====================================
    # FULL POST VALIDATION
    # =====================================
    @classmethod
    def validate_post_data(
        cls,
        title: str,
        content: str,
        status: str,
        tags: List[str],
    ):
        """
        Full post validation helper.
        """

        validated_title = cls.validate_title(title)

        validated_content = cls.validate_content(content)

        validated_status = cls.validate_status(status)

        validated_tags = cls.validate_tags(tags)

        generated_slug = cls.generate_slug(validated_title)

        reading_time = cls.calculate_reading_time(
            validated_content
        )

        return {
            "title": validated_title,
            "content": validated_content,
            "status": validated_status,
            "tags": validated_tags,
            "slug": generated_slug,
            "read_time": reading_time,
        }