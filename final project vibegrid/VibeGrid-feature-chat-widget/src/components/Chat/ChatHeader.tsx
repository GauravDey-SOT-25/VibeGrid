import React from 'react';
import { MessageSquare, Minus, ChevronUp, X } from 'lucide-react';
import '../../styles/ChatHeader.css';

interface ChatHeaderProps {
  isMinimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

export default function ChatHeader({ isMinimized, onMinimize, onClose }: ChatHeaderProps) {
  return (
    <div 
      className="eh-chat-header" 
      role="banner" 
      aria-label="Chat header bar"
    >
      <div className="eh-chat-header-brand">
        <div className="eh-chat-header-icon" aria-hidden="true">
          <MessageSquare size={18} />
        </div>
        <div className="eh-chat-header-info">
          <span className="eh-chat-header-title">EventHub Assistant</span>
          <div className="eh-chat-header-status">
            <span className="eh-chat-header-status-dot" aria-hidden="true"></span>
            <span>Online Agent</span>
          </div>
        </div>
      </div>

      <div className="eh-chat-header-actions">
        <button
          type="button"
          className="eh-chat-header-btn"
          onClick={onMinimize}
          aria-label={isMinimized ? "Expand Chat" : "Minimize Chat"}
          title={isMinimized ? "Expand" : "Minimize"}
        >
          {isMinimized ? <ChevronUp size={16} /> : <Minus size={16} />}
        </button>
        
        <button
          type="button"
          className="eh-chat-header-btn"
          onClick={onClose}
          aria-label="Close Chat Window"
          title="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
