import { useState, useRef } from "react";

export default function Recorder({ onTranscript }) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const media = new MediaRecorder(stream);
    mediaRef.current = media;
    chunksRef.current = [];

    media.ondataavailable = (e) => chunksRef.current.push(e.data);
    media.onstop = sendAudio;

    media.start();
    setRecording(true);
  }

  function stopRecording() {
    mediaRef.current?.stop();
    mediaRef.current?.stream.getTracks().forEach((t) => t.stop());
    setRecording(false);
  }

  async function sendAudio() {
    if (chunksRef.current.length === 0) return;

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const form = new FormData();
    form.append("audio", blob, "recording.webm");

    const res = await fetch("http://localhost:5000/api/transcribe", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    onTranscript(data.text);

    // Auto-answer
    const answer = await fetch("http://localhost:5000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: data.text }),
    });
    const answerData = await answer.json();
    onTranscript("ai", answerData.response);
  }

  return (
    <div className="flex items-center gap-4 border-t border-slate-700 p-4">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`rounded-full px-6 py-3 font-medium ${
          recording
            ? "animate-pulse bg-red-600 hover:bg-red-500"
            : "bg-blue-600 hover:bg-blue-500"
        }`}
      >
        {recording ? "⏹ Ferma" : "🎤 Registra"}
      </button>
      <p className="text-sm text-slate-400">
        {recording ? "Registrazione in corso..." : "Premi per parlare"}
      </p>
    </div>
  );
}
