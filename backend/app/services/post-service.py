import math
import re

class PostService:
    @staticmethod
    def calculate_reading_time(content: str) -> str:
        words_per_minute = 200
        words = len(re.findall(r'\w+', content))
        minutes = math.ceil(words / words_per_minute)
        return f"{minutes} min read"

    @staticmethod
    def generate_slug(title: str) -> str:
        return title.lower().replace(" ", "-").replace("/", "-")