import { useState } from 'react';

function RegisterForm({ onLoggedIn }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, name, password }),
    });
    const data = await res.json();
    if (data.error) setError(data.error);
    else onLoggedIn(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Name <input value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label>Email <input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <button>Create account</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}

export default RegisterForm;