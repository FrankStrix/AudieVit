export default function Chat({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4">
      {messages.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <p className="text-slate-500">
            Premi "Registra" e parla per iniziare...
          </p>
        </div>
      )}
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`rounded-lg p-4 max-w-[80%] ${
            msg.role === "user"
              ? "ml-auto bg-blue-700"
              : "mr-auto bg-slate-700"
          }`}
        >
          <p className="text-xs font-bold opacity-70 mb-1">
            {msg.role === "user" ? "Tu" : "AudieVit"}
          </p>
          <p>{msg.text}</p>
        </div>
      ))}
    </div>
  );
}
