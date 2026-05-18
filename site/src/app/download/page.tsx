import Link from "next/link";

const releasesUrl = "https://github.com/FrankStrix/audievit/releases";

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-4">
          <Link href="/" className="text-sm text-blue-400 hover:underline">
            &larr; Home
          </Link>
        </div>

        <h1 className="mb-8 text-4xl font-bold">Scarica AudieVit</h1>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl bg-slate-800 p-6">
            <h2 className="mb-3 text-xl font-semibold">App Desktop</h2>
            <p className="mb-4 text-slate-300">
              Applicazione Electron per Windows con registrazione vocale e chat
              AI.
            </p>
            <ul className="mb-6 space-y-2 text-sm text-slate-400">
              <li>✓ Riconoscimento vocale (Whisper)</li>
              <li>✓ Risposte AI (Ollama)</li>
              <li>✓ Sintesi vocale (Piper TTS)</li>
              <li>✓ 100% locale, nessun dato inviato al cloud</li>
            </ul>
            <a
              href={`${releasesUrl}/latest`}
              className="inline-block rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold transition hover:bg-green-500"
            >
              Scarica per Windows
            </a>
            <p className="mt-2 text-xs text-slate-500">
              Installer (.exe) &bull; Richiede Windows 10+
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-6">
            <h2 className="mb-3 text-xl font-semibold">Backend AI</h2>
            <p className="mb-4 text-slate-300">
              Server Flask con modelli AI da eseguire in locale o via Docker.
            </p>
            <ul className="mb-6 space-y-2 text-sm text-slate-400">
              <li>✓ API REST per trascrizione e chat</li>
              <li>✓ Supporto GPU (NVIDIA)</li>
              <li>✓ Docker Compose per setup rapido</li>
            </ul>
            <a
              href="https://github.com/matte/audievit"
              className="inline-block rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold transition hover:bg-blue-500"
            >
              Codice su GitHub
            </a>
          </div>
        </div>

        <section className="rounded-xl bg-slate-800 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Come installare (da terminale)
          </h2>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-green-400">
            {`# 1. Clona il repository
git clone https://github.com/matte/audievit.git
cd audievit

# 2. Avvia il backend
cd backend
pip install -r requirements.txt
python app.py

# 3. (Opzionale) Avvia Ollama con Docker
docker compose -f docker/docker-compose.yml up -d

# 4. In un altro terminale, avvia l'app
cd ../app
npm install
npm run electron:dev`}
          </pre>
        </section>

        <p className="mt-8 text-center text-sm text-slate-500">
          Tutti i download sono disponibili su{" "}
          <a
            href={releasesUrl}
            className="text-blue-400 hover:underline"
          >
            GitHub Releases
          </a>
        </p>
      </div>
    </main>
  );
}
