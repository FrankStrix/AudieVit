import { useState } from 'react';

interface LoginProps {
  onLogin: (name: string) => void;
}

function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Inserisci il tuo nome');
      return;
    }
    setError('');
    onLogin(trimmed);
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>AudieVit</h1>
        <p className="subtitle">AI vocale locale</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Come ti chiami?</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Il tuo nome..."
            autoFocus
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Entra</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
