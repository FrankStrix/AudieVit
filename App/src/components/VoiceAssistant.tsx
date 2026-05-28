import { useState, useRef, useCallback, useEffect } from 'react';
import { startListening, stopListening } from '../services/speechRecognition';
import { generateResponse } from '../services/ollama';
import { speak } from '../services/textToSpeech';
import { addConversation, updateAnswer, getConversations } from '../services/database';
import type { Conversation } from '../types/database';

interface VoiceAssistantProps {
  userName: string;
}

type Status = 'idle' | 'listening' | 'processing' | 'speaking';

function VoiceAssistant({ userName }: VoiceAssistantProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [interimText, setInterimText] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const [lastAnswer, setLastAnswer] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState('');
  const processingRef = useRef(false);

  const refreshConversations = useCallback(() => {
    setConversations(getConversations());
  }, []);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  const handleFinal = useCallback(
    async (text: string) => {
      if (processingRef.current) return;
      processingRef.current = true;

      setInterimText('');
      setLastQuestion(text);
      setLastAnswer('');
      setStatus('processing');

      const convId = addConversation(userName, text, null);
      refreshConversations();

      try {
        const answer = await generateResponse(text);
        setLastAnswer(answer);
        setStatus('speaking');

        updateAnswer(convId, answer);
        refreshConversations();

        await speak(answer);
      } catch (err) {
        setError(String(err));
        setLastAnswer('[Errore nel contattare Ollama]');
      }

      setStatus('listening');
      processingRef.current = false;
    },
    [userName, refreshConversations],
  );

  const handleInterim = useCallback((text: string) => {
    setInterimText(text);
  }, []);

  function handleStart() {
    setError('');
    setInterimText('');
    setStatus('listening');
    startListening({ onFinal: handleFinal, onInterim: handleInterim });
  }

  function handleStop() {
    stopListening();
    processingRef.current = false;
    setInterimText('');
    setStatus('idle');
  }

  const statusLabel = {
    idle: 'In attesa',
    listening: 'In ascolto...',
    processing: 'Elaborazione...',
    speaking: 'Parla...',
  };

  return (
    <div className="assistant-container">
      <header className="assistant-header">
        <h1>AudieVit</h1>
        <p className="user-greeting">Benvenuto, <strong>{userName}</strong></p>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="status-bar">
        <span className={`status-dot status-${status}`} />
        <span>{statusLabel[status]}</span>
      </div>

      <section className="conversation">
        <div className="mic-visualizer">
          <div className={`mic-icon ${status === 'listening' ? 'mic-active' : ''}`}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </div>
          {status === 'listening' && (
            <div className="sound-waves">
              <span /><span /><span /><span /><span />
            </div>
          )}
        </div>

        {interimText && (
          <div className="message interim">
            <em>{interimText}</em>
          </div>
        )}
        {lastQuestion && (
          <div className="message question">
            <strong>Tu:</strong> {lastQuestion}
          </div>
        )}
        {lastAnswer && (
          <div className="message answer">
            <strong>Assistente:</strong> {lastAnswer}
          </div>
        )}
      </section>

      <div className="controls">
        {status === 'idle' ? (
          <button onClick={handleStart} className="btn-primary">
            Inizia Ascolto
          </button>
        ) : (
          <button onClick={handleStop} className="btn-danger">
            Ferma
          </button>
        )}
      </div>

      <section className="history">
        <h2>Cronologia</h2>
        {conversations.length === 0 ? (
          <p className="empty">Nessuna conversazione ancora.</p>
        ) : (
          <ul>
            {conversations.map((c) => (
              <li key={c.id}>
                <span className="timestamp">
                  {new Date(c.created_at).toLocaleString('it-IT')}
                </span>
                <span className="q"><strong>Q:</strong> {c.question}</span>
                {c.answer && <span className="a"><strong>A:</strong> {c.answer}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default VoiceAssistant;
