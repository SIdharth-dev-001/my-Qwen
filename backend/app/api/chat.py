from fastapi import APIRouter

from app.schemas.chat import ChatRequest
from app.services.chat_service import ChatService
from app.utils.response import ApiResponse
from fastapi import Depends
from app.dependencies.chat import get_chat_service
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.post("/chat")
def chat(request: ChatRequest, chat_service: ChatService = Depends(get_chat_service)):
    response = chat_service.chat(request.conversation_id, request.message)
    return ApiResponse.success(
        message="Response generated successfully.",
        data=response
    )


@router.post("/chat/stream")
def stream_chat(
    request: ChatRequest,
    chat_service: ChatService = Depends(get_chat_service)
):

    conversation_id, stream = chat_service.stream_chat(
        request.conversation_id,
        request.message
    )

    def generate():
        for chunk in stream:
            content = chunk.get("message", {}).get("content", "")
            if content:
                yield content.encode("utf-8")

    return StreamingResponse(
        generate(),
        media_type="text/plain",
        headers={
            "X-Conversation-Id": conversation_id
        }
    )