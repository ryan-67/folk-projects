import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import type { ChatMessage } from '../hooks/useProjectStore';

interface Props {
  messages: ChatMessage[];
  onSend: (text: string) => void;
}

export default function InlineChat({ messages, onSend }: Props) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="inline-chat">
      <div className="chat-header"><Bot size={14} /> Chat with Folk about this project</div>
      <div className="chat-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-empty">Ask folk anything about this project...</div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`chat-bubble ${m.role}`}>
            <div className="chat-avatar">{m.role === 'folk' ? <Bot size={12} /> : <User size={12} />}</div>
            <div className="chat-text">{m.text}</div>
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          placeholder="Ask folk..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="chat-send" disabled={!input.trim()}><Send size={14} /></button>
      </form>
    </div>
  );
}
