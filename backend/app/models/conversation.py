from dataclasses import dataclass, field
from datetime import datetime
from typing import List

from app.models.message import Message


@dataclass
class Conversation:

    conversation_id: str

    created_at: datetime = field(default_factory=datetime.utcnow)

    updated_at: datetime = field(default_factory=datetime.utcnow)

    messages: List[Message] = field(default_factory=list)