import math
import re
from typing import Optional


class PostService:

    # =====================================
    # READING TIME
    # =====================================

    @staticmethod
    def calculate_read_time(content: str) -> str:
        """
        Calculates estimated reading time.

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
    def create_slug(title: str) -> str:
        """
        Converts title into SEO-friendly slug.
        """

        if not title:
            return ""

        slug = title.lower().strip()

        # remove special chars
        slug = re.sub(
            r"[^\w\s-]",
            "",
            slug
        )

        # replace spaces/underscores with "-"
        slug = re.sub(
            r"[\s_]+",
            "-",
            slug
        )

        # remove duplicate "-"
        slug = re.sub(
            r"-+",
            "-",
            slug
        )

        return slug.strip("-")

    # =====================================
    # CONTENT VALIDATION
    # =====================================

    @staticmethod
    def validate_content(content: str) -> bool:
        """
        Minimal content validation.
        """

        if not content:
            return False

        cleaned = content.strip()

        return len(cleaned) >= 10

    # =====================================
    # TITLE VALIDATION
    # =====================================

    @staticmethod
    def validate_title(title: str) -> bool:
        """
        Minimal title validation.
        """

        if not title:
            return False

        cleaned = title.strip()

        return 3 <= len(cleaned) <= 255

    # =====================================
    # STATUS VALIDATION
    # =====================================

    @staticmethod
    def validate_status(status: Optional[str]) -> bool:
        """
        Valid post statuses.
        """

        allowed_statuses = [
            "draft",
            "published"
        ]

        return status in allowed_statuses

    # =====================================
    # EXCERPT GENERATION
    # =====================================

    @staticmethod
    def generate_excerpt(
        content: str,
        max_length: int = 180
    ) -> str:
        """
        Generates short preview text.
        """

        if not content:
            return ""

        cleaned = re.sub(
            r"\s+",
            " ",
            content.strip()
        )

        if len(cleaned) <= max_length:
            return cleaned

        return cleaned[:max_length].rstrip() + "..."

    # =====================================
    # SEARCH NORMALIZATION
    # =====================================

    @staticmethod
    def normalize_search_query(query: str) -> str:
        """
        Cleans search input.
        """

        if not query:
            return ""

        query = query.lower().strip()

        query = re.sub(
            r"\s+",
            " ",
            query
        )

        return query