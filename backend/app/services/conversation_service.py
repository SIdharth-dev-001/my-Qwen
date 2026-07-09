from uuid import uuid4

from app.models.conversation import Conversation
from datetime import datetime
from app.models.message import Message


class ConversationService:

    def __init__(self):
        self.conversations: dict[str, Conversation] = {}

    def create_conversation(self):

        conversation_id = str(uuid4())

        conversation = Conversation(
            conversation_id=conversation_id
        )

        self.conversations[conversation_id] = conversation

        return conversation
    
    def get_conversation(self, conversation_id: str):

        return self.conversations.get(conversation_id)
    
    def add_message(self, conversation_id: str, role: str, content: str):

        conversation = self.get_conversation(conversation_id)

        if conversation is None:
            return None

        message = Message(
            role=role,
            content=content,
            timestamp=datetime.utcnow()
        )

        conversation.messages.append(message)

        conversation.updated_at = datetime.utcnow()

        return message
    
    def get_messages(self, conversation_id: str):
        conversation = self.get_conversation(conversation_id)
        if conversation is None:
            return []
        return conversation.messages
    
    def build_prompt(self, conversation_id: str):

        messages = self.get_messages(conversation_id)

        if not messages:
            return ""

        prompt = []

        prompt.append(
            "You are My Qwen, a helpful AI assistant."
        )

        for message in messages:
            prompt.append(
                f"{message.role.capitalize()}: {message.content}"
            )

        prompt.append("Assistant:")

        return "\n".join(prompt)