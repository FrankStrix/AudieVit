import os


class Config:
    OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:latest")
    WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base")
    MAX_AUDIO_DURATION = int(os.getenv("MAX_AUDIO_DURATION", "30"))
    STORAGE_DIR = os.getenv("STORAGE_DIR", "storage")
