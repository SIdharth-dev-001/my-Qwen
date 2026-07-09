from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.exceptions.ollama_exception import (
    OllamaConnectionError,
    OllamaTimeoutError
)


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(OllamaConnectionError)
    async def ollama_connection_exception_handler(
        request: Request,
        exc: OllamaConnectionError
    ):
        return JSONResponse(
            status_code=503,
            content={
                "success": False,
                "message": str(exc)
            }
        )

    @app.exception_handler(OllamaTimeoutError)
    async def ollama_timeout_exception_handler(
        request: Request,
        exc: OllamaTimeoutError
    ):
        return JSONResponse(
            status_code=504,
            content={
                "success": False,
                "message": str(exc)
            }
        )