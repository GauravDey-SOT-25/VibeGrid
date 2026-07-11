import React from 'react';
import { Bot } from 'lucide-react';
import '../../styles/TypingIndicator.css';

export default function TypingIndicator() {
  return (
    <div className="eh-chat-bubble-row is-bot" aria-live="polite" aria-label="Bot is typing">
      <div className="eh-chat-bubble-avatar" aria-hidden="true">
        <Bot size={16} />
      </div>
      <div className="eh-typing-indicator-container">
        <div className="eh-typing-dots">
          <span className="eh-typing-dot"></span>
          <span className="eh-typing-dot"></span>
          <span className="eh-typing-dot"></span>
        </div>
      </div>
    </div>
  );
}
