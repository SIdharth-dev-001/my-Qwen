import requests
from app.core.config import config


class OllamaClient:

    BASE_URL = config.OLLAMA_BASE_URL

    def generate(self, prompt: str):
        response = requests.post(
            f"{self.BASE_URL}/api/generate",
            json={
                "model": config.OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            }
        )

        response.raise_for_status()

        return response.json()