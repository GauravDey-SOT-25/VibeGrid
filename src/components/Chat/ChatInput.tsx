import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Send } from 'lucide-react';
import '../../styles/ChatInput.css';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !disabled) {
      onSendMessage(trimmed);
      setInputValue(''); // Reset input box immediately
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent standard page refreshes
      handleSend();
    }
  };

  const isButtonDisabled = !inputValue.trim() || disabled;

  return (
    <div className="eh-chat-input-container" role="form" aria-label="Compose chat message">
      <input
        type="text"
        className="eh-chat-input-field"
        placeholder="Type your message..."
        value={inputValue}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Type message text"
      />
      
      <button
        type="button"
        className="eh-chat-send-btn"
        onClick={handleSend}
        disabled={isButtonDisabled}
        aria-label="Send message"
        title="Send"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
