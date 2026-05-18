import { useState, useRef, useEffect } from "react";

export default function Recorder({ status, onStart, onStop }) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  const isDisabled = status === "transcribing" || status === "thinking" || status === "speaking";

  useEffect(() => {
    return () => {
      mediaRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const media = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRef.current = media;
      chunksRef.current = [];

      media.ondataavailable = (e) => chunksRef.current.push(e.data);
      media.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onStop(blob);
      };

      media.start();
      setRecording(true);
      onStart();
    } catch {
      setRecording(false);
    }
  };

  const stopRecording = () => {
    const media = mediaRef.current;
    if (!media) return;
    media.stop();
    media.stream.getTracks().forEach((t) => t.stop());
    setRecording(false);
  };

  const handleClick = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const isActive = recording || isDisabled;

  return (
    <div className="glass relative border-t border-white/5 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Microphone button */}
          <div className="relative">
            {recording && (
              <>
                <div className="recording-ring" />
                <div className="recording-ring" style={{ animationDelay: "0.5s" }} />
                <div className="recording-ring" style={{ animationDelay: "1s" }} />
              </>
            )}
            <button
              onClick={handleClick}
              disabled={isActive && !recording}
              className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${
                recording
                  ? "animate-pulse-glow scale-110 bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/40"
                  : isDisabled
                    ? "bg-white/5 text-white/20 cursor-not-allowed"
                    : "bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-lg shadow-violet-500/30 hover:scale-105 hover:shadow-violet-500/50 active:scale-95"
              }`}
            >
              {recording ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : isDisabled ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm-1 17.94V22h2v-2.06A7.002 7.002 0 0 0 19 13h-2a5 5 0 0 1-10 0H5a7.002 7.002 0 0 0 6 6.94z" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm-1 17.94V22h2v-2.06A7.002 7.002 0 0 0 19 13h-2a5 5 0 0 1-10 0H5a7.002 7.002 0 0 0 6 6.94z" />
                </svg>
              )}
            </button>
          </div>

          <div>
            <p className="text-sm font-medium text-white/70">
              {recording
                ? "Ascolto..."
                : isDisabled
                  ? status === "transcribing"
                    ? "Trascrizione in corso..."
                    : status === "thinking"
                      ? "AudieVit sta pensando..."
                      : status === "speaking"
                        ? "Riproduzione..."
                        : "Microfono"
                  : "Premi per parlare"}
            </p>
            <p className="text-[11px] text-white/30">
              {recording
                ? "Parla chiaramente..."
                : isDisabled
                  ? "Attendi il termine dell'elaborazione"
                  : "Registrazione vocale"}
            </p>
          </div>
        </div>

        {/* Waveform bars durante la registrazione */}
        {recording && (
          <div className="flex items-end gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="wave-bar w-1 rounded-full bg-gradient-to-t from-violet-500 to-purple-400"
                style={{
                  height: `${8 + Math.random() * 24}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Status spinner */}
        {isDisabled && !recording && (
          <div className="flex items-center gap-2 text-xs text-violet-400/60">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
            Elaborazione...
          </div>
        )}
      </div>
    </div>
  );
}
