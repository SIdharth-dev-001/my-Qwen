from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.exceptions.handlers import register_exception_handlers
from app.api.chat import router as chat_router
from app.core.config import config

app = FastAPI(
    title=config.APP_NAME,
    version=config.APP_VERSION
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Conversation-Id"],
)

register_exception_handlers(app)

app.include_router(chat_router)