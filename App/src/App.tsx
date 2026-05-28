import { useState, useEffect } from 'react';
import { initDatabase } from './services/database';
import Login from './components/Login';
import VoiceAssistant from './components/VoiceAssistant';

function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initDatabase().then(() => setReady(true)).catch(console.error);
  }, []);

  if (!ready) {
    return <div className="loading">Caricamento database...</div>;
  }

  if (!userName) {
    return <Login onLogin={setUserName} />;
  }

  return <VoiceAssistant userName={userName} />;
}

export default App;
