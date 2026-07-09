from fastapi import APIRouter

from app.schemas.chat import ChatRequest
from app.services.chat_service import ChatService

router = APIRouter()

chat_service = ChatService()


@router.post("/chat")
def chat(request: ChatRequest):
    return chat_service.chat(request.message)