import { useState, useEffect } from 'react';
import ProjectCard from './components/ProjectCard';

function App() {
  const [dark, setDark] = useState(false); // theme state: false = light, true = dark
  const [serverMsg, setServerMsg] = useState('loading...'); // message from the server; starts as "loading..."

  useEffect(() => {
    // runs once, right after the page first appears
    fetch('/api/health') // ask Express (through the proxy) for the /api/health route
      .then((r) => r.json()) // read the reply and turn the JSON into a JS object
      .then((data) => setServerMsg(data.message)); // store data.message in state -> React re-draws the page
  }, []); // the empty [] means "run this effect only on the first load"

  return (
    <main className={dark ? 'dark' : 'light'}>
      <header>
        <h1>My Portfolio</h1>
        <button onClick={() => setDark(!dark)}>Toggle theme</button>
      </header>
      <p>Server says: {serverMsg}</p>
      <ProjectCard title="Team Project" description="A Flask web app." />
      <ProjectCard title="DocChat" description="React + AI you can ask about any document." />
    </main>
  );
}

export default App;