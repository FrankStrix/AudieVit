import { useState, useEffect } from 'react';
import { initDatabase } from './services/database';
import VoiceAssistant from './components/VoiceAssistant';

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initDatabase().then(() => setReady(true)).catch(console.error);
  }, []);

  if (!ready) {
    return <div className="loading">Caricamento database...</div>;
  }

  return <VoiceAssistant />;
}

export default App;
