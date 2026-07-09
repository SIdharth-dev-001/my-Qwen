import requests
from app.core.config import config
from app.exceptions.ollama_exception import OllamaConnectionError, OllamaTimeoutError


class OllamaClient:
    def __init__(self):
        self.base_url = config.OLLAMA_BASE_URL
        self.model = config.OLLAMA_MODEL
        self.timeout = config.OLLAMA_TIMEOUT

    def generate(self, prompt: str):
        print(f"Timeout: {self.timeout}")
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=self.timeout
            )

            response.raise_for_status()

            return response.json()["response"]
        except requests.exceptions.ConnectionError:
            raise OllamaConnectionError()
        except requests.exceptions.Timeout:
            raise OllamaTimeoutError(
                f"Ollama request timed out after {self.timeout} seconds."
            )