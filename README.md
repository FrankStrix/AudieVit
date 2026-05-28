# AudieVit 🎧

> AI vocale locale che riconosce la tua voce e risponde alle domande.

**AudieVit** è un assistente vocale AI che gira interamente nel tuo browser, senza inviare dati a server esterni. Riconoscimento vocale, generazione risposte e sintesi vocale avvengono tutti in locale.

[Documentazione](https://github.com/FrankStrix/AudieVit) • [Segnala un problema](https://github.com/FrankStrix/AudieVit/issues)

---

## Panoramica

| Applicazione | Stack | Scopo |
|---|---|---|
| [`App/`](./App) | React 19 + TypeScript + Vite 7 + sql.js | Assistente vocale |
| [`Site/`](./Site) | Angular 21 + TypeScript | Documentazione |

## Come funziona

```
Microfono → Web Speech API (STT) → trascrizione → Ollama (LLM) → risposta → Web Speech API (TTS) → voce
```

- **Speech-to-Text**: API `SpeechRecognition` del browser
- **AI**: [Ollama](https://ollama.ai) in locale (modello `llama2`)
- **Text-to-Speech**: API `SpeechSynthesis` del browser
- **Multi-lingua**: Rilevamento automatico IT/EN/FR/ES/DE
- **Persistenza**: SQLite (sql.js) su `localStorage`
- **Privacy**: Nessun dato lascia il tuo computer

## Avvio rapido

```bash
# Prerequisiti: Node.js, npm, Ollama in esecuzione
git clone https://github.com/FrankStrix/AudieVit.git
cd AudieVit/App
npm install
npm run dev
```

Apri **http://localhost:1420** nel browser.

## Licenza

Progetto open source.
