from fastapi import APIRouter

from app.schemas.chat import ChatRequest
from app.services.chat_service import ChatService
from app.utils.response import ApiResponse
from fastapi import Depends
from app.dependencies.chat import get_chat_service

router = APIRouter()

@router.post("/chat")
def chat(request: ChatRequest, chat_service: ChatService = Depends(get_chat_service)):
    response = chat_service.chat(request.conversation_id, request.message)
    return ApiResponse.success(
        message="Response generated successfully.",
        data=response
    )
