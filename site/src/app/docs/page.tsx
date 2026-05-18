import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl bg-slate-900 px-4 py-16 text-white">
      <div className="mb-4">
        <Link href="/" className="text-sm text-blue-400 hover:underline">
          &larr; Home
        </Link>
      </div>

      <h1 className="mb-8 text-4xl font-bold">Documentazione</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">Architettura</h2>
        <p className="mb-2 text-slate-300">
          AudieVit è composto da tre moduli indipendenti:
        </p>
        <ul className="list-disc space-y-1 pl-6 text-slate-300">
          <li>
            <strong>Backend AI</strong> &mdash; Flask API + Ollama (LLM) +
            Whisper (STT) + Piper TTS
          </li>
          <li>
            <strong>App Desktop</strong> &mdash; Electron + React/Vite con
            registrazione audio
          </li>
          <li>
            <strong>Sito Web</strong> &mdash; Next.js su Vercel con
            documentazione e download
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">Setup completo</h2>

        <h3 className="mb-2 text-lg font-semibold text-blue-300">
          1. Backend (Flask + AI)
        </h3>
        <pre className="mb-6 overflow-x-auto rounded-lg bg-slate-800 p-4 text-sm text-green-400">
{`cd backend
pip install -r requirements.txt
python app.py`}
        </pre>

        <h3 className="mb-2 text-lg font-semibold text-blue-300">
          2. Ollama (LLM locale)
        </h3>
        <pre className="mb-6 overflow-x-auto rounded-lg bg-slate-800 p-4 text-sm text-green-400">
{`docker compose -f docker/docker-compose.yml up -d
docker exec -it audievit-ollama ollama pull llama3.2`}
        </pre>

        <h3 className="mb-2 text-lg font-semibold text-blue-300">
          3. App Desktop
        </h3>
        <pre className="mb-6 overflow-x-auto rounded-lg bg-slate-800 p-4 text-sm text-green-400">
{`cd app
npm install
npm run electron:dev`}
        </pre>

        <h3 className="mb-2 text-lg font-semibold text-blue-300">
          4. Sito (sviluppo locale)
        </h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 p-4 text-sm text-green-400">
{`cd site
npm install
npm run dev`}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">API Endpoints</h2>
        <div className="space-y-3 text-slate-300">
          <div className="rounded-lg bg-slate-800 p-4">
            <code className="text-green-400">GET /api/health</code>
            <p className="mt-1 text-sm">Verifica lo stato del backend.</p>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <code className="text-green-400">POST /api/transcribe</code>
            <p className="mt-1 text-sm">
              Trascrive un file audio (multipart: audio).
            </p>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <code className="text-green-400">POST /api/ask</code>
            <p className="mt-1 text-sm">
              Invia un prompt all&apos;LLM e riceve risposta (JSON: prompt).
            </p>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <code className="text-green-400">POST /api/speak</code>
            <p className="mt-1 text-sm">
              Sintetizza testo in audio (JSON: text).
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">Deploy su Vercel</h2>
        <p className="mb-2 text-slate-300">
          Il sito &egrave; deployato su Vercel. Per deployare la tua copia:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 p-4 text-sm text-green-400">
{`# Collega il repo a Vercel
vercel --prod

# Oppure: importa il progetto da
# https://vercel.com/new

# La cartella "site" è il progetto Next.js`}
        </pre>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-semibold">Tecnologie</h2>
        <div className="grid gap-4 text-slate-300 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-white">Backend</h3>
            <p>Flask, Ollama, Whisper, Piper TTS, Docker</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Frontend App</h3>
            <p>Electron, React, Vite, TailwindCSS, RecordRTC</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Sito</h3>
            <p>Next.js su Vercel</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Collegamenti materie</h3>
            <p>TDP: NodeJS, Docker, Ollama, REST</p>
            <p>Informatica: Database (SQLite)</p>
          </div>
        </div>
      </section>
    </main>
  );
}
