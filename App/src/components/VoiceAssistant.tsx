import { useState, useRef, useCallback, useEffect } from 'react';
import { startListening, stopListening } from '../services/speechRecognition';
import { generateResponse } from '../services/ollama';
import { speak, stopSpeaking } from '../services/textToSpeech';
import { detectLanguage } from '../services/language';
import type { LangInfo } from '../services/language';
import {
  createSession, addMessage, getSessionMessages,
  getSessions, clearAllSessions, persistNow,
} from '../services/database';
import type { Message, Session } from '../types/database';

type Status = 'idle' | 'listening' | 'processing' | 'speaking';
type Page = 'welcome' | 'app';
type View = 'chat' | 'history';

const tips = [
  { icon: '\u{1F3A4}', title: 'Prova a chiedere', text: '"Qual è la capitale del Giappone?"', tag: 'domanda' },
  { icon: '\u{1F4A1}', title: 'Suggerimento', text: 'Parla chiaramente per una trascrizione migliore.', tag: 'consiglio' },
  { icon: '\u{1F30D}', title: 'Lingua', text: "L'assistente riconosce e risponde in italiano, inglese, francese e tedesco.", tag: 'info' },
  { icon: '\u{1F512}', title: 'Privacy', text: 'Tutto gira in locale. Nessun dato esce dal tuo computer.', tag: 'sicurezza' },
];

const rightTips = [
  { icon: '\u{1F4AC}', title: 'Comandi utili', text: '"Riepiloga", "Spiega", "Traduci in inglese"', tag: 'esempi' },
  { icon: '\u{1F4C4}', title: 'Cronologia', text: 'Le conversazioni passate sono salvate e consultabili.', tag: 'funzione' },
  { icon: '\u{1F916}', title: 'Modello AI', text: 'Usa Ollama in locale per risposte rapide.', tag: 'tecnologia' },
];

function getFirstWords(text: string, count: number): string {
  return text.split(/\s+/).slice(0, count).join(' ');
}

function VoiceAssistant() {
  const [page, setPage] = useState<Page>('welcome');
  const [view, setView] = useState<View>('chat');
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [interimText, setInterimText] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const processingRef = useRef(false);
  const pendingTextRef = useRef('');
  const statusRef = useRef(status);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const ttsQueueRef = useRef<string[]>([]);
  const speakingRef = useRef(false);
  const spokenOffsetRef = useRef(0);
  const queueDrainResolveRef = useRef<(() => void) | null>(null);
  const currentTtsLangRef = useRef<LangInfo>({ code: 'it', name: 'italiano', tts: 'it-IT' });
  statusRef.current = status;

  const refreshSessions = useCallback(() => {
    setSessions(getSessions());
  }, []);

  function splitChunks(text: string, maxLen = 200): string[] {
    if (text.length <= maxLen) return [text];
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
      let end = Math.min(i + maxLen, text.length);
      if (end < text.length) {
        const brk = text.lastIndexOf(' ', end);
        if (brk > i) end = brk;
      }
      chunks.push(text.slice(i, end).trim());
      i = end;
    }
    return chunks;
  }

  function speakNext() {
    if (speakingRef.current) return;
    const text = ttsQueueRef.current.shift();
    if (!text) {
      speakingRef.current = false;
      queueDrainResolveRef.current?.();
      queueDrainResolveRef.current = null;
      return;
    }
    speakingRef.current = true;
    speak(text, currentTtsLangRef.current).then(() => {
      speakingRef.current = false;
      setTimeout(speakNext, 120);
    });
  }

  function waitForQueueDrain(): Promise<void> {
    if (ttsQueueRef.current.length === 0 && !speakingRef.current) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      queueDrainResolveRef.current = resolve;
    });
  }

  useEffect(() => {
    if (page === 'app') refreshSessions();
  }, [page, refreshSessions]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  function startNewSession() {
    if (sessionId && messages.length === 0) {
      setView('chat');
      return;
    }
    const id = createSession();
    setSessionId(id);
    setMessages([]);
    setStreamingText('');
    setView('chat');
    setError('');
    refreshSessions();
  }

  function loadSession(id: number) {
    setSessionId(id);
    setMessages(getSessionMessages(id));
    setStreamingText('');
    setView('chat');
    setError('');
  }

  const processText = useCallback(
    async (text: string) => {
      if (processingRef.current) return;
      processingRef.current = true;

      stopListening();
      pendingTextRef.current = '';
      setInterimText('');
      setError('');

      let sid = sessionId;
      if (!sid) {
        sid = createSession();
        setSessionId(sid);
      }

      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      setStreamingText('');
      ttsQueueRef.current = [];
      speakingRef.current = false;
      spokenOffsetRef.current = 0;
      currentTtsLangRef.current = detectLanguage(text);
      setMessages((prev) => [...prev, { id: -1, session_id: sid!, role: 'user', content: text, created_at: new Date().toISOString() }]);
      setStatus('processing');

      addMessage(sid, 'user', text);

      try {
        let fullAnswer = '';
        await generateResponse(
          text,
          (fullText) => {
            if (!processingRef.current) return;
            fullAnswer = fullText;
            setStreamingText(fullText);

            const pending = fullText.slice(spokenOffsetRef.current);
            const sentenceRegex = /(.*?[.!?](\s|$))/g;
            let match: RegExpExecArray | null;
            let consumed = 0;

            while ((match = sentenceRegex.exec(pending)) !== null) {
              const sentence = match[1].trim();
              if (sentence && /[.!?]$/.test(sentence)) {
                const chunks = splitChunks(sentence);
                ttsQueueRef.current.push(...chunks);
                consumed = match.index + match[0].length;
              } else {
                break;
              }
            }

            if (consumed > 0) {
              spokenOffsetRef.current += consumed;
            }

            speakNext();
          },
          history,
        );
        if (!processingRef.current) return;

        setStreamingText('');
        setMessages((prev) => [...prev, { id: -2, session_id: sid!, role: 'assistant', content: fullAnswer, created_at: new Date().toISOString() }]);
        setStatus('speaking');

        addMessage(sid, 'assistant', fullAnswer);
        persistNow();
        refreshSessions();

        if (spokenOffsetRef.current < fullAnswer.length) {
          const remaining = fullAnswer.slice(spokenOffsetRef.current).trim();
          if (remaining) {
            const chunks = splitChunks(remaining);
            ttsQueueRef.current.push(...chunks);
            spokenOffsetRef.current = fullAnswer.length;
          }
        }
        speakNext();
        await waitForQueueDrain();
      } catch (err) {
        if (!processingRef.current) return;
        setError(String(err));
      }

      if (processingRef.current) {
        setStatus('idle');
        processingRef.current = false;
      }
    },
    [sessionId, messages, refreshSessions],
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

    if (status === 'speaking' || status === 'processing') {
      stopSpeaking();
      ttsQueueRef.current = [];
      speakingRef.current = false;
      spokenOffsetRef.current = 0;
      processingRef.current = false;
      stopListening();
      setInterimText('');
      pendingTextRef.current = '';
      setStreamingText('');
      setStatus('idle');
      return;
    }

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

  const buttonDisabled = status === 'idle';
  const buttonLabel = status === 'processing' ? 'Ferma (elaborazione)' : 'Ferma';

  if (page === 'welcome') {
    return (
      <div className="welcome-page">
        <div className="welcome-content">
          <div className="welcome-brand">
            <svg className="welcome-logo" viewBox="0 0 24 24" width={56} height={56} fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
            <h1>AudieVit</h1>
            <p>Il tuo assistente vocale AI, locale e privato.</p>
          </div>

          <div className="creator-card">
            <div className="creator-avatar">FS</div>
            <div className="creator-info">
              <h3>FrankStrix</h3>
              <p className="creator-role">Sviluppatore &middot; Creatore di AudieVit</p>
              <p className="creator-bio">
                Appassionato di intelligenza artificiale, voce e tecnologia locale.
                Crede in un futuro dove l&apos;AI &egrave; accessibile e rispettosa della privacy.
              </p>
            </div>
          </div>

          <button className="btn-start" onClick={() => { setPage('app'); startNewSession(); }}>
            Iniziamo!
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="app-header">
        <div className="header-brand">
          <svg className="header-logo" viewBox="0 0 24 24" width={24} height={24} fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          <h2>AudieVit</h2>
        </div>
        <nav className="header-nav">
          <button className="btn-ghost" onClick={() => { setView(view === 'chat' ? 'history' : 'chat'); refreshSessions(); }}>
            {view === 'chat' ? 'Cronologia' : 'Chat'}
          </button>
          <button className="btn-ghost" onClick={startNewSession}>Nuova chat</button>
          <a href="#" target="_blank" rel="noopener noreferrer">Documentazione</a>
        </nav>
      </header>

      <div className="main-layout">
        <aside className="tips-panel">
          {tips.map((tip, i) => (
            <div className="tip-card" key={i}>
              <span className="tip-icon">{tip.icon}</span>
              <h4>{tip.title}</h4>
              <p>{tip.text}</p>
              <span className="tip-tag">{tip.tag}</span>
            </div>
          ))}
        </aside>

        <div className="chat-area">
          {view === 'history' ? (
            <section className="history">
              <h2>Cronologia sessioni</h2>
              {sessions.length === 0 ? (
                <p className="empty">Nessuna sessione ancora.</p>
              ) : (
                <>
                  <ul>
                    {sessions.map((s) => (
                      <li key={s.id} onClick={() => { loadSession(s.id); }} className="clickable">
                        <span className="timestamp">
                          {new Date(s.created_at).toLocaleString('it-IT')}
                        </span>
                        <span className="q"><strong>Prima domanda:</strong> {s.preview ? getFirstWords(s.preview, 8) : '(vuota)'}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="btn-danger" onClick={() => { clearAllSessions(); refreshSessions(); if (sessionId) { setSessionId(null); setMessages([]); } }}>
                    Cancella tutto
                  </button>
                </>
              )}
            </section>
          ) : (
            <div className="assistant-container">
              {error && <p className="error">{error}</p>}

              <div className="status-bar">
                <span className={`status-dot status-${status}`} />
                <span>{statusLabel[status]}</span>
              </div>

              <section className="conversation chat-messages">
                {messages.length === 0 && !streamingText && (
                  <div className="empty-chat">
                    <p>Premi "Inizia Ascolto" e parla per iniziare una conversazione.</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.role === 'user' ? 'question' : 'answer'}`}>
                    <strong>{msg.role === 'user' ? 'Tu' : 'Assistente'}:</strong>
                    <span>{msg.content}</span>
                  </div>
                ))}

                {streamingText && (
                  <div className="message answer streaming">
                    <strong>Assistente:</strong>
                    <span>{streamingText}</span>
                  </div>
                )}

                {status === 'processing' && !streamingText && (
                  <div className="message interim">
                    <em>Elaborazione in corso...</em>
                  </div>
                )}

                <div ref={chatEndRef} />
              </section>

              {interimText && status === 'listening' && (
                <div className="listening-zone">
                  <span className="listening-label">Sto Ascoltando...</span>
                  <p className="listening-text">{interimText}</p>
                </div>
              )}

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
            </div>
          )}
        </div>

        <aside className="tips-panel">
          {rightTips.map((tip, i) => (
            <div className="tip-card" key={i}>
              <span className="tip-icon">{tip.icon}</span>
              <h4>{tip.title}</h4>
              <p>{tip.text}</p>
              <span className="tip-tag">{tip.tag}</span>
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}

export default VoiceAssistant;
