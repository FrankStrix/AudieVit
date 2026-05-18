import { useState, useRef, useCallback } from "react";
import Header from "./components/Header";
import Chat from "./components/Chat";
import Recorder from "./components/Recorder";

const API_BASE = "http://localhost:5000";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | recording | transcribing | thinking | speaking
  const [backendOk, setBackendOk] = useState(null);
  const chatRef = useRef(null);
  const audioRef = useRef(null);

  const addMessage = useCallback((role, text, filename) => {
    setMessages((prev) => [...prev, { role, text, filename, id: Date.now() + Math.random() }]);
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  const checkBackend = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      setBackendOk(res.ok);
      return res.ok;
    } catch {
      setBackendOk(false);
      return false;
    }
  }, []);

  const playAudio = useCallback((filename) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    audioRef.current.src = `${API_BASE}/api/audio/${filename}`;
    audioRef.current.onended = () => setStatus("idle");
    audioRef.current.onerror = () => setStatus("idle");
    audioRef.current.play().catch(() => setStatus("idle"));
  }, []);

  const handleRecordingComplete = useCallback(async (audioBlob) => {
    setStatus("transcribing");

    const form = new FormData();
    form.append("audio", audioBlob, "recording.webm");

    let text;
    try {
      const res = await fetch(`${API_BASE}/api/transcribe`, { method: "POST", body: form });
      const data = await res.json();
      text = data.text || "";
    } catch {
      addMessage("user", "[Errore connessione backend]");
      setStatus("idle");
      scrollToBottom();
      return;
    }

    if (!text.trim()) {
      setStatus("idle");
      return;
    }

    addMessage("user", text, null);
    scrollToBottom();
    setStatus("thinking");

    let response, filename;
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      response = data.response || "";
      filename = data.filename || null;
    } catch {
      addMessage("ai", "[Errore: backend non raggiungibile]");
      setStatus("idle");
      scrollToBottom();
      return;
    }

    addMessage("ai", response, filename);
    scrollToBottom();

    if (filename) {
      setStatus("speaking");
      playAudio(filename);
    } else {
      setStatus("idle");
    }
  }, [addMessage, scrollToBottom, playAudio]);

  return (
    <div className="flex h-screen flex-col" style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #12122a 50%, #1a0a2e 100%)" }}>
      <Header backendOk={backendOk} onCheckBackend={checkBackend} />

      <Chat
        ref={chatRef}
        messages={messages}
        status={status}
      />

      <Recorder
        status={status}
        onStart={() => setStatus("recording")}
        onStop={handleRecordingComplete}
      />
    </div>
  );
}
