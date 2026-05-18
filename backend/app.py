from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from services.whisper_service import WhisperService
from services.ollama_service import OllamaService
from services.tts_service import TTSService

app = Flask(__name__)
CORS(app)

whisper = WhisperService(Config.WHISPER_MODEL)
ollama = OllamaService(Config.OLLAMA_URL, Config.OLLAMA_MODEL)
tts = TTSService(Config.PIPER_URL)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/transcribe", methods=["POST"])
def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file"}), 400
    audio = request.files["audio"]
    text = whisper.transcribe(audio)
    return jsonify({"text": text})


@app.route("/api/ask", methods=["POST"])
def ask():
    data = request.get_json()
    prompt = data.get("prompt", "")
    response = ollama.ask(prompt)
    return jsonify({"response": response})


@app.route("/api/speak", methods=["POST"])
def speak():
    data = request.get_json()
    text = data.get("text", "")
    audio_path = tts.synthesize(text)
    return jsonify({"audio_path": audio_path})


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    prompt = data.get("prompt", "")
    response = ollama.ask(prompt)
    audio_path = tts.synthesize(response)
    return jsonify({"response": response, "audio_path": audio_path})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
