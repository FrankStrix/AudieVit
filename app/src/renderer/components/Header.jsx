export default function Header({ backendOk, onCheckBackend }) {
  return (
    <header className="glass z-10 flex items-center justify-between border-b border-white/5 px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 text-sm font-bold text-white shadow-lg shadow-purple-500/20">
          A
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-wide text-white/90">
            AudieVit
          </h1>
          <p className="text-[10px] font-medium tracking-wider text-white/30 uppercase">
            AI Vocale Locale
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onCheckBackend}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition hover:bg-white/5"
          title="Verifica connessione backend"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              backendOk === null
                ? "bg-yellow-500"
                : backendOk
                  ? "bg-green-400 shadow-sm shadow-green-400/50"
                  : "bg-red-400"
            }`}
          />
          Backend
        </button>

        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-[10px] font-medium text-white/40 ring-1 ring-white/10">
          v1
        </div>
      </div>
    </header>
  );
}
