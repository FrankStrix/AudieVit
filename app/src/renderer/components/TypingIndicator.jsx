export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-1">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-[10px] font-bold text-white shadow-md shadow-violet-500/20 shrink-0">
        A
      </div>
      <div className="glass-light flex items-center gap-1.5 rounded-2xl px-4 py-3.5">
        <span className="typing-dot h-2 w-2 rounded-full bg-violet-400" />
        <span className="typing-dot h-2 w-2 rounded-full bg-violet-400" />
        <span className="typing-dot h-2 w-2 rounded-full bg-violet-400" />
      </div>
    </div>
  );
}
