import { forwardRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const Chat = forwardRef(function Chat({ messages, status }, ref) {
  const isEmpty = messages.length === 0;

  return (
    <div
      ref={ref}
      className="flex-1 space-y-1 overflow-y-auto px-4 py-6"
    >
      {isEmpty && (
        <div className="flex h-full flex-col items-center justify-center gap-4 animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-700/20 ring-1 ring-violet-500/20">
            <svg className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          </div>
          <div className="space-y-1.5 text-center">
            <p className="text-sm font-medium text-white/60">Premi il microfono per parlare</p>
            <p className="text-xs text-white/30 max-w-xs">
              La tua voce verrà trascritta e AudieVit ti risponderà a voce
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {status === "thinking" && (
        <div className="animate-slide-up">
          <TypingIndicator />
        </div>
      )}

      {status === "speaking" && (
        <div className="ml-2 flex items-center gap-2 text-xs text-violet-400/60 animate-fade-in">
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
          </svg>
          AudieVit sta parlando...
        </div>
      )}
    </div>
  );
});

export default Chat;
