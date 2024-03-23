import { useEffect, useState } from 'react';
import { useSocket } from './useSocket';
import Markdown from 'react-markdown';

export function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const socket = useSocket();

  useEffect(() => {
    socket.on('chat', (data: string) => {
      setResponse((prevState) => {
        return prevState + data;
      });
    });

    socket.on('prompt_completed', () => {
      setPrompt('');
    });
  }, [socket]);

  const handleSend = () => {
    socket.emit('chat', prompt);
  };

  return (
    <div>
      <input
        type="text"
        name="prompt"
        id="prompt"
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
      />
      <button onClick={handleSend}>Send</button>
      <div>
        <Markdown>{response}</Markdown>
      </div>
    </div>
  );
}

export default App;
