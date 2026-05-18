import { useState } from "react";

const API_BASE = "http://localhost:5000";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const [audioPlaying, setAudioPlaying] = useState(false);

  const handlePlayAudio = () => {
    if (!message.filename) return;
    setAudioPlaying(true);
    const audio = new Audio(`${API_BASE}/api/audio/${message.filename}`);
    audio.onerror = () => setAudioPlaying(false);
    audio.onended = () => setAudioPlaying(false);
    audio.play();
  };

  return (
    <div
      className={`animate-slide-up flex ${isUser ? "justify-end" : "justify-start"} px-1`}
    >
      <div
        className={`group relative max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-600/20"
            : "glass-light text-white/90"
        }`}
      >
        {/* Avatar per AI */}
        {!isUser && (
          <div className="absolute -left-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-[10px] font-bold text-white shadow-md shadow-violet-500/20">
            A
          </div>
        )}

        <p className={`text-sm leading-relaxed ${isUser ? "text-white/95" : "text-white/85"}`}>
          {message.text}
        </p>

        {/* Audio player per risposte AI */}
        {!isUser && message.filename && (
          <div className="mt-2 flex items-center gap-2 border-t border-white/5 pt-2">
            <button
              onClick={handlePlayAudio}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-violet-300 transition hover:bg-white/5 hover:text-violet-200"
            >
              {audioPlaying ? (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
              {audioPlaying ? "Riproducendo..." : "Riascolta"}
            </button>
          </div>
        )}

        {/* Timestamp */}
        <p className={`mt-1 text-[10px] ${isUser ? "text-right text-white/30" : "text-white/20"}`}>
          {new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
