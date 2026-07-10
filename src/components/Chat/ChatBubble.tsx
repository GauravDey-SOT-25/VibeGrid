import React from 'react';
import { Bot, User } from 'lucide-react';
import '../../styles/ChatBubble.css';

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
}

interface ChatBubbleProps {
  key?: string | number;
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === 'user';

  // Securely parses simple **bold** blocks and raw \n newlines for visual fidelity
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const parsedLine = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <React.Fragment key={lineIdx}>
          {parsedLine}
          {lineIdx < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div 
      className={`eh-chat-bubble-row ${isUser ? 'is-user' : 'is-bot'}`}
      role="log"
      aria-label={`${isUser ? 'You' : 'Assistant'} says`}
    >
      {!isUser && (
        <div className="eh-chat-bubble-avatar" aria-hidden="true">
          <Bot size={16} />
        </div>
      )}
      
      <div className="eh-chat-bubble-content-wrapper">
        <div className="eh-chat-bubble">
          {renderFormattedText(message.text)}
        </div>
        <span className="eh-chat-bubble-time" aria-label={`Sent at ${message.timestamp}`}>
          {message.timestamp}
        </span>
      </div>

      {isUser && (
        <div 
          className="eh-chat-bubble-avatar" 
          style={{ 
            marginLeft: '8px', 
            background: 'var(--border-dark)', 
            color: 'var(--text-primary)' 
          }}
          aria-hidden="true"
        >
          <User size={16} />
        </div>
      )}
    </div>
  );
}
