import React, { useEffect, useRef } from 'react';
import ChatBubble, { Message } from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import '../../styles/ChatMessages.css';

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  onSendPrompt: (prompt: string) => void;
}

export default function ChatMessages({ messages, isTyping, onSendPrompt }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Automatically scroll container to bottom whenever messages or typing state updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Retrieve suggested prompts from the absolute latest bot message in the chat
  const lastBotMessage = [...messages].reverse().find(m => m.sender === 'bot');
  const showSuggestions = lastBotMessage && lastBotMessage.suggestedPrompts && lastBotMessage.suggestedPrompts.length > 0 && !isTyping;

  return (
    <div 
      className="eh-chat-messages-container" 
      ref={containerRef}
      role="region" 
      aria-label="Chat history stream"
    >
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}

      {isTyping && <TypingIndicator />}

      {showSuggestions && lastBotMessage && lastBotMessage.suggestedPrompts && (
        <div className="eh-chat-suggestions" role="group" aria-label="Suggested quick replies">
          {lastBotMessage.suggestedPrompts.map((prompt, idx) => (
            <button
              key={`${lastBotMessage.id}-suggest-${idx}`}
              className="eh-chat-suggestion-chip"
              onClick={() => onSendPrompt(prompt)}
              aria-label={`Ask about ${prompt}`}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
