import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setUser(data.user));
  }, []);

  async function logout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  }

  if (user) {
    return (
      <main>
        <p>Hi, {user.name}!</p>
        <button onClick={logout}>Log out</button>
      </main>
    );
  }

  return (
    <main>
      <h2>Create an account</h2>
      <RegisterForm onLoggedIn={setUser} />
      <h2>Or log in</h2>
      <LoginForm onLoggedIn={setUser} />
    </main>
  );
}

export default App;