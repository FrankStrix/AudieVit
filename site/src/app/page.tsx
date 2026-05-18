import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-6 text-5xl font-bold">AudieVit</h1>
        <p className="mb-8 text-xl text-slate-300">
          AI vocale locale che riconosce la tua voce e risponde alle tue
          domande.
        </p>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-slate-700/50 p-6">
            <h2 className="mb-2 text-lg font-semibold">Backend AI</h2>
            <p className="text-sm text-slate-400">
              Flask &bull; Ollama &bull; Whisper &bull; Piper TTS &bull; Docker
            </p>
          </div>
          <div className="rounded-xl bg-slate-700/50 p-6">
            <h2 className="mb-2 text-lg font-semibold">App Desktop</h2>
            <p className="text-sm text-slate-400">
              Electron &bull; React &bull; Vite &bull; RecordRTC
            </p>
          </div>
          <div className="rounded-xl bg-slate-700/50 p-6">
            <h2 className="mb-2 text-lg font-semibold">Open Source</h2>
            <p className="text-sm text-slate-400">
              Documentazione &bull; Community &bull; GitHub
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/download"
            className="rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold transition hover:bg-green-500"
          >
            Scarica l&apos;App
          </Link>
          <Link
            href="/docs"
            className="rounded-lg border border-slate-500 px-6 py-4 font-medium transition hover:bg-slate-700"
          >
            Documentazione
          </Link>
          <Link
            href="/chat"
            className="rounded-lg bg-blue-600 px-6 py-4 font-medium transition hover:bg-blue-500"
          >
            Prova la Chat
          </Link>
        </div>
      </div>
    </main>
  );
}
