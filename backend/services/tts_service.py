import requests


class TTSService:
    def __init__(self, piper_url: str):
        self.piper_url = piper_url

    def synthesize(self, text: str) -> str:
        resp = requests.post(
            f"{self.piper_url}/synthesize",
            json={"text": text},
        )
        resp.raise_for_status()
        data = resp.json()
        return data.get("audio_path", "")
