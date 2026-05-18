import { useState } from "react";
import Recorder from "./components/Recorder";
import Chat from "./components/Chat";

export default function App() {
  const [messages, setMessages] = useState([]);

  function addMessage(role, text) {
    setMessages((prev) => [...prev, { role, text }]);
  }

  return (
    <div className="flex h-screen flex-col bg-slate-900 text-white">
      <header className="border-b border-slate-700 p-4">
        <h1 className="text-xl font-bold">AudieVit</h1>
        <p className="text-sm text-slate-400">AI vocale locale</p>
      </header>

      <Chat messages={messages} />
      <Recorder onTranscript={(text) => addMessage("user", text)} />
    </div>
  );
}
