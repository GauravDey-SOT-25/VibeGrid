import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { getBotResponse, BotResponse } from '../../utils/chatBotLogic';
import { Message } from './ChatBubble';
import '../../styles/ChatWidget.css';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize with a warm welcome message on mount
  useEffect(() => {
    const welcomeMsg: Message = {
      id: 'welcome-msg',
      sender: 'bot',
      text: `👋 **Welcome to EventHub Support!** I'm your interactive event assistant.\n\nYou can ask me about upcoming events, categories, registrations, or use one of my quick commands below:\n\n` +
            `• **"tech"** - Discover tech events & summits\n` +
            `• **"music"** - Browse concerts & live music\n` +
            `• **"workshop"** - Find bootcamps & hands-on classes\n` +
            `• **"conference"** - View conferences & summits\n` +
            `• **"today"** - Find out what's happening today\n` +
            `• **"weekend"** - See events for the upcoming weekend\n` +
            `• **"categories"** - List all event categories\n` +
            `• **"register"** - Learn how to secure your spot\n` +
            `• **"contact"** - Get in touch with support\n\n` +
            `How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: ['categories', 'tech', 'music', 'register']
    };
    setMessages([welcomeMsg]);
  }, []);

  // Clear unread badge count whenever the chat widget is opened and expanded
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = (text: string) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 1. Post user message to stream
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: currentTime
    };
    setMessages((prev) => [...prev, userMessage]);

    // 2. Engage typing simulation
    setIsTyping(true);

    // 3. Post delayed bot reply
    setTimeout(() => {
      const response: BotResponse = getBotResponse(text);
      const botMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: response.suggestedPrompts
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      // Increment notification badge if user has closed or collapsed the chat area
      if (!isOpen || isMinimized) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 700);
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleSendPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  return (
    <>
      {/* Floating Circular Toggle Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          className="eh-chat-trigger"
          onClick={toggleOpen}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label="Open EventHub Support Chat"
        >
          <MessageSquare size={26} />
          {unreadCount > 0 && (
            <span className="eh-chat-badge" aria-label={`${unreadCount} unread messages`}>
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Main Collapsible Chat Window Panel */}
      <div 
        className={`eh-chat-window ${isOpen ? 'is-open' : ''} ${isMinimized ? 'is-minimized' : ''}`}
        role="dialog"
        aria-label="EventHub Customer Support Chatbot"
      >
        <ChatHeader 
          isMinimized={isMinimized} 
          onMinimize={handleMinimize} 
          onClose={handleClose} 
        />
        
        <ChatMessages 
          messages={messages} 
          isTyping={isTyping} 
          onSendPrompt={handleSendPrompt} 
        />
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isTyping} 
        />
      </div>
    </>
  );
}
