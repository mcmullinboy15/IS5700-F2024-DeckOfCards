import { useState } from 'react'
import useMQTT from './mqtt'
import './App.css'

function App() {
  const { messages, sendMessage } = useMQTT<string>('ryanTest');
  const [input, setInput] = useState<string>('');

  const handleSendMessage = () => {
    sendMessage(input);
    setInput('');
  };

  return (
    <>
      <div>
      <h2>MQTT Chat</h2>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
    </>
  )
}

export default App
