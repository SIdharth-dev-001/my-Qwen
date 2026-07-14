import requests
import time
from app.core.config import config
from app.exceptions.ollama_exception import OllamaConnectionError, OllamaTimeoutError


class OllamaClient:
    def __init__(self):
        self.base_url = config.OLLAMA_BASE_URL
        self.model = config.OLLAMA_MODEL
        self.timeout = config.OLLAMA_TIMEOUT


    def chat(self, messages: list[dict]):

        start_time = time.time()

        print("\n================ OLLAMA CHAT REQUEST ================")
        print(f"Message Count : {len(messages)}")
        print("Sending request to Ollama Chat API...")

        try:

            response = requests.post(
                f"{self.base_url}/api/chat",
                json={
                    "model": self.model,
                    "messages": messages,
                    "stream": False
                },
                timeout=self.timeout
            )

            response.raise_for_status()

            data = response.json()

            end_time = time.time()

            print("-----------------------------------------------")
            print(f"Ollama Chat Response Time : {end_time - start_time:.2f} seconds")
            print("===============================================\n")

            print("\n========== OLLAMA METRICS ==========")
            print(f"Prompt Tokens    : {data.get('prompt_eval_count')}")
            print(f"Generated Tokens : {data.get('eval_count')}")
            print(f"Load Duration    : {data.get('load_duration') / 1e9:.2f} sec")
            print(f"Prompt Eval      : {data.get('prompt_eval_duration') / 1e9:.2f} sec")
            print(f"Generation       : {data.get('eval_duration') / 1e9:.2f} sec")
            print("===================================\n")

            return data["message"]["content"]

        except requests.exceptions.ConnectionError:
            raise OllamaConnectionError()

        except requests.exceptions.Timeout:
            raise OllamaTimeoutError(
                f"Ollama request timed out after {self.timeout} seconds."
            )

    # def generate(self, prompt: str):
    #     start_time = time.time()

    #     print("\n================ OLLAMA REQUEST ================")
    #     print(f"Prompt Length : {len(prompt)} characters")
    #     print("Sending request to Ollama...")

    #     try:
    #         response = requests.post(
    #             f"{self.base_url}/api/generate",
    #             json={
    #                 "model": self.model,
    #                 "prompt": prompt,
    #                 "stream": False
    #             },
    #             timeout=self.timeout
    #         )

    #         response.raise_for_status()

    #         end_time = time.time()

    #         print("-----------------------------------------------")
    #         print(f"Ollama Response Time : {end_time - start_time:.2f} seconds")
    #         print("===============================================\n")

    #         response.raise_for_status()

    #         data = response.json()

    #         print("\n========== OLLAMA METRICS ==========")
    #         print(f"Prompt Tokens : {data.get('prompt_eval_count')}")
    #         print(f"Generated Tokens : {data.get('eval_count')}")
    #         print(f"Load Duration : {data.get('load_duration') / 1e9:.2f} sec")
    #         print(f"Prompt Eval : {data.get('prompt_eval_duration') / 1e9:.2f} sec")
    #         print(f"Generation : {data.get('eval_duration') / 1e9:.2f} sec")
    #         print("===================================\n")

    #         return data["response"]

    #     except requests.exceptions.ConnectionError:
    #         raise OllamaConnectionError()

    #     except requests.exceptions.Timeout:
    #         raise OllamaTimeoutError(
    #             f"Ollama request timed out after {self.timeout} seconds."
    #         )