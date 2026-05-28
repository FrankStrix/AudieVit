import { useState, useRef, useCallback, useEffect } from 'react';
import { startListening, stopListening } from '../services/speechRecognition';
import { generateResponse } from '../services/ollama';
import { speak, stopSpeaking } from '../services/textToSpeech';
import { addConversation, updateRisposta, getConversations } from '../services/database';
import type { Conversation } from '../types/database';

type Status = 'idle' | 'listening' | 'processing' | 'speaking';

function VoiceAssistant() {
  const [status, setStatus] = useState<Status>('idle');
  const [interimText, setInterimText] = useState('');
  const [lastDomanda, setLastDomanda] = useState('');
  const [lastRisposta, setLastRisposta] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState('');
  const processingRef = useRef(false);
  const pendingTextRef = useRef('');
  const statusRef = useRef(status);
  statusRef.current = status;

  const refreshConversations = useCallback(() => {
    setConversations(getConversations());
  }, []);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  const processText = useCallback(
    async (text: string) => {
      if (processingRef.current) return;
      processingRef.current = true;

      pendingTextRef.current = '';
      setInterimText('');
      setLastDomanda(text);
      setLastRisposta('');
      setStatus('processing');

      const convId = addConversation(text);
      refreshConversations();

      try {
        const risposta = await generateResponse(text);
        if (!processingRef.current) return;
        setLastRisposta(risposta);
        setStatus('speaking');

        updateRisposta(convId, risposta);
        refreshConversations();

        await speak(risposta);
      } catch (err) {
        if (!processingRef.current) return;
        setError(String(err));
        setLastRisposta('[Errore nel contattare Ollama]');
      }

      if (processingRef.current) {
        setStatus('listening');
        processingRef.current = false;
      }
    },
    [refreshConversations],
  );

  const handleFinal = useCallback(
    (text: string) => {
      const currentStatus = statusRef.current;
      if (currentStatus === 'speaking') {
        stopSpeaking();
        processingRef.current = false;
        processText(text);
        return;
      }
      if (currentStatus === 'processing') return;
      processText(text);
    },
    [processText],
  );

  const handleInterim = useCallback((text: string) => {
    setInterimText(text);
    pendingTextRef.current = text;
  }, []);

  function handleStart() {
    setError('');
    setInterimText('');
    pendingTextRef.current = '';
    setStatus('listening');
    startListening({ onFinal: handleFinal, onInterim: handleInterim });
  }

  function handleStop() {
    const pending = pendingTextRef.current;

    if (status === 'speaking') {
      stopSpeaking();
      processingRef.current = false;
      stopListening();
      setInterimText('');
      pendingTextRef.current = '';
      setStatus('idle');
      return;
    }

    if (status === 'processing') return;

    stopListening();
    pendingTextRef.current = '';

    if (pending) {
      setInterimText('');
      processText(pending);
    } else {
      setInterimText('');
      setStatus('idle');
    }
  }

  const statusLabel = {
    idle: 'In attesa',
    listening: 'In ascolto...',
    processing: 'Elaborazione...',
    speaking: 'Parla...',
  };

  const buttonDisabled = status === 'processing';
  const buttonLabel = status === 'processing' ? 'Elaborazione...' : 'Ferma';

  return (
    <div className="assistant-container">
      <header className="assistant-header">
        <h1>AudieVit</h1>
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

        {interimText && status === 'listening' && (
          <div className="message interim">
            <em>{interimText}</em>
          </div>
        )}
        {lastDomanda && (
          <div className="message question">
            <strong>Tu:</strong> {lastDomanda}
          </div>
        )}
        {lastRisposta && (
          <div className="message answer">
            <strong>Assistente:</strong> {lastRisposta}
          </div>
        )}
      </section>

      <div className="controls">
        {status === 'idle' ? (
          <button onClick={handleStart} className="btn-primary">
            Inizia Ascolto
          </button>
        ) : (
          <button onClick={handleStop} className="btn-danger" disabled={buttonDisabled}>
            {buttonLabel}
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
                  {new Date(c.orario).toLocaleString('it-IT')}
                </span>
                <span className="q"><strong>Q:</strong> {c.domanda}</span>
                {c.risposta_prima_parte && (
                  <span className="a"><strong>R:</strong> {c.risposta_prima_parte}...</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default VoiceAssistant;
