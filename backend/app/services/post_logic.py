import math
import re

class PostService:
    @staticmethod
    def calculate_read_time(content: str) -> str:
        words_per_minute = 200
        words = len(re.findall(r'\w+', content))
        minutes = math.ceil(words / words_per_minute)
        return f"{minutes} min read"

    @staticmethod
    def create_slug(title: str) -> str:
        # Проста конвертація в URL-friendly формат
        slug = title.lower().strip()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[\s_-]+', '-', slug)
        return slug