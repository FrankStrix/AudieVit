import { useState, useRef, useCallback } from 'react';
import { loadModel, startListening, stopListening } from '../services/voiceClassifier';
import { speak } from '../services/textToSpeech';
import { getResponse } from '../services/responseGenerator';

type Status = 'idle' | 'loading' | 'ready' | 'listening' | 'speaking';

function VoiceAssistant() {
  const [status, setStatus] = useState<Status>('idle');
  const [lastCommand, setLastCommand] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [error, setError] = useState('');
  const busyRef = useRef(false);

  const handleCommand = useCallback(async (word: string, confidence: number) => {
    if (busyRef.current) return;
    busyRef.current = true;

    const response = getResponse(word);
    setLastCommand(`${word} (${(confidence * 100).toFixed(0)}%)`);
    setLastResponse(response);
    setStatus('speaking');

    await speak(response);
    setStatus('listening');
    busyRef.current = false;
  }, []);

  const handleStart = useCallback(async () => {
    setError('');
    setStatus('loading');

    try {
      await loadModel();
      setStatus('listening');
      await startListening(handleCommand);
    } catch (err) {
      setError(String(err));
      setStatus('idle');
    }
  }, [handleCommand]);

  const handleStop = useCallback(async () => {
    await stopListening();
    busyRef.current = false;
    setStatus('ready');
  }, []);

  return (
    <div>
      <h2>AudieVit - Voice Assistant</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <p>Status: <strong>{status}</strong></p>
        {lastCommand && <p>Command: <strong>{lastCommand}</strong></p>}
        {lastResponse && <p>Response: <em>{lastResponse}</em></p>}
      </div>

      <div style={{ marginTop: 16 }}>
        {status === 'idle' || status === 'ready' ? (
          <button onClick={handleStart}>
            {status === 'ready' ? 'Restart' : 'Start Listening'}
          </button>
        ) : (
          <button onClick={handleStop} disabled={status === 'loading'}>
            Stop
          </button>
        )}
      </div>
    </div>
  );
}

export default VoiceAssistant;
