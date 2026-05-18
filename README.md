# AudieVit

AI vocale locale che riconosce la tua voce e risponde alle domande.

## Moduli

```
audievit/
├── backend/    # Flask API + Whisper (STT) + Ollama (LLM) + Edge-TTS
├── app/        # App desktop (Electron + React/Vite)
├── site/       # Sito web (Next.js) su Vercel
└── docs/       # Documentazione
```

## Requisiti

- Python 3.13+
- Node.js 24+
- Docker (opzionale, per Ollama)
- Ollama con modello (es. `llama3.2`)

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### App Desktop
```bash
cd app
npm install
npm run electron:dev
```

### Build App per Windows
```bash
cd app
npm run electron:build:win
# .exe in app/release/
```

### Docker (Ollama)
```bash
cd backend/docker
docker compose up -d
docker exec -it audievit-ollama ollama pull llama3.2
```
