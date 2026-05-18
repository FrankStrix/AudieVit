"use client";

import { useState } from "react";
import Link from "next/link";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  async function checkBackend() {
    try {
      const res = await fetch("http://localhost:5000/api/health");
      setBackendOnline(res.ok);
    } catch {
      setBackendOnline(false);
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Errore: backend non raggiungibile. Avvia il server locale.",
        },
      ]);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-slate-900 p-4 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chat con AudieVit</h1>
        <Link href="/" className="text-sm text-blue-400 hover:underline">
          &larr; Home
        </Link>
      </div>

      <div className="mb-6 rounded-lg border border-yellow-600 bg-yellow-900/30 p-4 text-sm text-yellow-200">
        <strong>Demo locale:</strong> questa chat funziona solo se hai il backend
        AudieVit in esecuzione su <code>localhost:5000</code>.
        {backendOnline === false && (
          <p className="mt-1 text-red-400">
            &times; Backend non rilevato.{" "}
            <button
              onClick={checkBackend}
              className="underline hover:text-white"
            >
              Riprova
            </button>
          </p>
        )}
        {backendOnline === true && (
          <p className="mt-1 text-green-400">✓ Backend connesso!</p>
        )}
        {backendOnline === null && (
          <button
            onClick={checkBackend}
            className="mt-1 text-blue-300 underline hover:text-white"
          >
            Verifica connessione
          </button>
        )}
        <p className="mt-2">
          <Link href="/download" className="text-blue-300 underline">
            Scarica l&apos;app desktop
          </Link>{" "}
          per usare AudieVit offline.
        </p>
      </div>

      <div className="mb-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg p-4 ${
              msg.role === "user"
                ? "ml-12 bg-blue-700"
                : "mr-12 bg-slate-700"
            }`}
          >
            <p className="text-sm font-bold opacity-70">
              {msg.role === "user" ? "Tu" : "AudieVit"}
            </p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg bg-slate-700 p-3 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Scrivi un messaggio..."
        />
        <button
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium"
          onClick={sendMessage}
        >
          Invia
        </button>
      </div>
    </main>
  );
}
