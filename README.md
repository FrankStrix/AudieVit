# AudieVit

AI vocale locale che riconosce la tua voce e risponde alle domande.

## Moduli

```
audievit/
├── backend/    # Flask API + Whisper + Ollama + Piper TTS + Docker
├── app/        # App desktop (Electron + React/Vite)
├── site/       # Sito web (Next.js) — deployato su Vercel
└── docs/       # Documentazione extra
```

## Requisiti

- Python 3.13+
- Node.js 24+
- Docker (opzionale, per Ollama)

## Sito Web (Vercel)

Il sito è hostato su Vercel all'indirizzo: [https://audievit.vercel.app](https://audievit.vercel.app)

Per deployare la tua copia:
```bash
cd site
npm install
npx vercel --prod
```

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
# L'installer .exe sarà in app/release/
```

### Docker (Ollama)
```bash
cd backend/docker
docker compose up -d
docker exec -it audievit-ollama ollama pull llama3.2
```

## Collegamenti materie

- **TDP**: NodeJS, Docker, Ollama, REST API
- **Informatica**: Database SQLite
