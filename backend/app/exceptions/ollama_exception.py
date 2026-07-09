class OllamaConnectionError(Exception):
    def __init__(self, message="Unable to connect to Ollama."):
        super().__init__(message)


class ModelNotFoundError(Exception):
    pass


class ValidationException(Exception):
    pass


class AuthenticationException(Exception):
    pass

class OllamaTimeoutError(Exception):
    """Ollama took too long to respond."""
    pass