import whisper


class WhisperService:
    def __init__(self, model_size: str = "base"):
        self.model = whisper.load_model(model_size)

    def transcribe(self, audio_file) -> str:
        result = self.model.transcribe(audio_file, language="it")
        return result["text"].strip()
