from app.clients.ollama_client import OllamaClient
from app.services.chat_service import ChatService
from app.services.conversation_service import ConversationService

ollama_client = OllamaClient()
conversation_service = ConversationService()


def get_chat_service():
    return ChatService(
        client=ollama_client,
        conversation_service=conversation_service
    )