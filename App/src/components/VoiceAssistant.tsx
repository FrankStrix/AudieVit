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

  const handleTranscript = useCallback(
    async (text: string) => {
      if (processingRef.current) return;
      processingRef.current = true;

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

  function handleStart() {
    setError('');
    setStatus('listening');
    startListening(handleTranscript);
  }

  function handleStop() {
    stopListening();
    processingRef.current = false;
    setStatus('idle');
  }

  return (
    <div className="assistant-container">
      <header className="assistant-header">
        <h1>AudieVit</h1>
        <p className="user-greeting">Benvenuto, <strong>{userName}</strong></p>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="status-bar">
        <span className={`status-dot status-${status}`} />
        <span>{status === 'idle' ? 'In attesa' : status === 'listening' ? 'In ascolto...' : status === 'processing' ? 'Elaborazione...' : 'Parla...'}</span>
      </div>

      <section className="conversation">
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
