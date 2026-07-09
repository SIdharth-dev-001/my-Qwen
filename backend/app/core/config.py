from dotenv import load_dotenv
import os

load_dotenv()


class Config:
    APP_NAME = os.getenv("APP_NAME")
    APP_VERSION = os.getenv("APP_VERSION")

    OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL")

    OLLAMA_TIMEOUT = int(os.getenv("OLLAMA_TIMEOUT", 30))


config = Config()