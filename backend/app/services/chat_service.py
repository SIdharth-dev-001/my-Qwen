from app.clients.ollama_client import OllamaClient
from app.services.conversation_service import ConversationService
import requests
import json
from app.exceptions.ollama_exception import OllamaConnectionError, OllamaTimeoutError

class ChatService:

    def __init__(self, client : OllamaClient, conversation_service: ConversationService):
        self.client = client
        self.conversation_service = conversation_service

    def chat(self, conversation_id: str | None, message: str):

        # Create a new conversation if one doesn't exist
        if conversation_id is None:
            conversation = self.conversation_service.create_conversation()
            conversation_id = conversation.conversation_id

        # Store user's message
        self.conversation_service.add_message(
            conversation_id=conversation_id,
            role="user",
            content=message
        )

        # Build messages for Ollama
        messages = self.conversation_service.build_messages(conversation_id)

        # Get AI response
        response = self.client.chat(messages)

        # Store assistant response
        self.conversation_service.add_message(
            conversation_id=conversation_id,
            role="assistant",
            content=response
        )

        return {
            "conversation_id": conversation_id,
            "response": response
        }
    
    def stream_chat(self, conversation_id: str | None, message: str):

        # Create a new conversation if one doesn't exist
        if conversation_id is None:
            conversation = self.conversation_service.create_conversation()
            conversation_id = conversation.conversation_id

        # Store user's message
        self.conversation_service.add_message(
            conversation_id=conversation_id,
            role="user",
            content=message
        )

        # Build messages for Ollama
        messages = self.conversation_service.build_messages(conversation_id)

        # Stream response from Ollama
        stream = self.client.stream_chat(messages)

        # Return conversation id along with the stream
        return conversation_id, stream