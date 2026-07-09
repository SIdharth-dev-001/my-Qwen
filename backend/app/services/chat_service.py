from app.client.OllamaClient import OllamaClient


class ChatService:

    def __init__(self):
        self.ollama_service = OllamaClient()

    def chat(self, message: str):
        response = self.ollama_service.generate(message)

        return {
            "response": response["response"]
        }