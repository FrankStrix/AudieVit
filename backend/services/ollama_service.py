import requests
import json


class OllamaService:
    def __init__(self, base_url: str, model: str):
        self.base_url = base_url
        self.model = model

    def ask(self, prompt: str) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
        }
        resp = requests.post(
            f"{self.base_url}/api/generate",
            json=payload,
        )
        resp.raise_for_status()
        return resp.json()["response"]
