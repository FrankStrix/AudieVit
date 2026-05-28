# AudieVit — App

Applicazione principale dell'assistente vocale AI. React 19 + TypeScript + Vite 7.

## Prerequisiti

- **Node.js** 18+ e npm
- **Ollama** in esecuzione su `localhost:11434` con modello `llama2`

## Script

| Comando | Descrizione |
|---|---|
| `npm run dev` | Avvia il dev server su `localhost:1420` |
| `npm run build` | Compila TypeScript e produce il bundle in `dist/` |
| `npm run preview` | Serve il contenuto di `dist/` |

## Struttura

```
src/
├── main.tsx                        # Punto di ingresso React
├── App.tsx                         # Componente radice (init DB)
├── styles.scss                     # Sistema di stili (tema scuro)
├── components/
│   └── VoiceAssistant.tsx          # Componente principale
├── services/
│   ├── database.ts                 # SQLite + localStorage
│   ├── language.ts                 # Rilevamento lingua
│   ├── ollama.ts                   # Client Ollama
│   ├── speechRecognition.ts        # Web Speech API STT
│   └── textToSpeech.ts             # Web Speech API TTS
└── types/
    ├── database.ts                 # Interfacce Message e Session
    └── speech.d.ts                 # Dichiarazioni SpeechRecognition
```

## Configurazione

Il server Vite proxyà le richieste `/api/ollama/*` verso `localhost:11434`. Consulta `vite.config.ts`.

Per cambiare il modello AI, modifica il campo `model` in `src/services/ollama.ts:15`.
