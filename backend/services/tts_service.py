import asyncio
import edge_tts
import os
import uuid


class TTSService:
    def __init__(self, storage_dir: str):
        self.storage_dir = storage_dir
        self.voice = "it-IT-ElsaNeural"
        os.makedirs(storage_dir, exist_ok=True)

    def synthesize(self, text: str) -> str:
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(self.storage_dir, filename)
        asyncio.run(self._generate(text, filepath))
        return filename

    async def _generate(self, text: str, filepath: str):
        communicate = edge_tts.Communicate(text, self.voice)
        await communicate.save(filepath)
