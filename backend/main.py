from fastapi import FastAPI
from app.exceptions.handlers import register_exception_handlers

from app.api.chat import router as chat_router
from app.core.config import config

app = FastAPI(
    title=config.APP_NAME,
    version=config.APP_VERSION
)

register_exception_handlers(app)
app.include_router(chat_router)