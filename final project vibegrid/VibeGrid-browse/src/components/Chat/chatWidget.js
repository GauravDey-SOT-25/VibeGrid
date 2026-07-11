import { getBotResponse } from './chatBotLogic.js';

// SVG Icons
const ICON_MSG_SQUARE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
const ICON_MINUS = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
const ICON_CHEVRON_UP = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up"><polyline points="18 15 12 9 6 15"/></svg>`;
const ICON_X = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ICON_SEND = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
const ICON_BOT = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;
const ICON_USER = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMessageText(text) {
  return text.split('\n').map(line => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return parts.map(part => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return `<strong>${escapeHtml(part.slice(2, -2))}</strong>`;
      }
      return escapeHtml(part);
    }).join('');
  }).join('<br />');
}

export class ChatWidget {
  constructor() {
    this.isOpen = false;
    this.isMinimized = false;
    this.unreadCount = 0;
    this.isTyping = false;
    this.messages = [];
  }

  init() {
    const root = document.getElementById('chat-widget-root');
    if (!root) {
      console.error('[ChatWidget] Mount point "#chat-widget-root" not found in DOM.');
      return;
    }

    // Initialize with welcome message
    const welcomeMsg = {
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
    this.messages.push(welcomeMsg);

    // Build overall widget template
    root.innerHTML = `
      <!-- Trigger button -->
      <button type="button" class="eh-chat-trigger" id="eh-chat-trigger" aria-haspopup="dialog" aria-expanded="false" aria-label="Open EventHub Support Chat">
        ${ICON_MSG_SQUARE}
        <span class="eh-chat-badge" id="eh-chat-badge" style="display: none;">0</span>
      </button>

      <!-- Chat window container -->
      <div class="eh-chat-window" id="eh-chat-window" role="dialog" aria-label="EventHub Customer Support Chatbot" style="display: none;">
        <!-- Header -->
        <div class="eh-chat-header" role="banner" aria-label="Chat header bar">
          <div class="eh-chat-header-brand">
            <div class="eh-chat-header-icon" aria-hidden="true">
              ${ICON_MSG_SQUARE}
            </div>
            <div class="eh-chat-header-info">
              <span class="eh-chat-header-title">EventHub Assistant</span>
              <div class="eh-chat-header-status">
                <span class="eh-chat-header-status-dot" aria-hidden="true"></span>
                <span>Online Agent</span>
              </div>
            </div>
          </div>
          <div class="eh-chat-header-actions">
            <button type="button" class="eh-chat-header-btn" id="eh-chat-minimize-btn" aria-label="Minimize Chat" title="Minimize">
              ${ICON_MINUS}
            </button>
            <button type="button" class="eh-chat-header-btn" id="eh-chat-close-btn" aria-label="Close Chat Window" title="Close">
              ${ICON_X}
            </button>
          </div>
        </div>

        <!-- Messages list wrapper -->
        <div class="eh-chat-messages-container" id="eh-chat-messages-container" role="region" aria-label="Chat history stream">
        </div>

        <!-- Input Compose form -->
        <div class="eh-chat-input-container" role="form" aria-label="Compose chat message">
          <input type="text" class="eh-chat-input-field" id="eh-chat-input-field" placeholder="Type your message..." aria-label="Type message text" />
          <button type="button" class="eh-chat-send-btn" id="eh-chat-send-btn" disabled aria-label="Send message" title="Send">
            ${ICON_SEND}
          </button>
        </div>
      </div>
    `;

    this.triggerBtn = document.getElementById('eh-chat-trigger');
    this.chatWindow = document.getElementById('eh-chat-window');
    this.badge = document.getElementById('eh-chat-badge');
    this.messagesContainer = document.getElementById('eh-chat-messages-container');
    this.inputField = document.getElementById('eh-chat-input-field');
    this.sendBtn = document.getElementById('eh-chat-send-btn');
    this.minimizeBtn = document.getElementById('eh-chat-minimize-btn');
    this.closeBtn = document.getElementById('eh-chat-close-btn');

    // Attach listeners
    this.triggerBtn.addEventListener('click', () => this.openWidget());
    this.closeBtn.addEventListener('click', () => this.closeWidget());
    this.minimizeBtn.addEventListener('click', () => this.toggleMinimize());
    
    this.inputField.addEventListener('input', () => {
      const empty = !this.inputField.value.trim();
      this.sendBtn.disabled = empty || this.isTyping;
    });

    this.inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.submitMessage();
      }
    });

    this.sendBtn.addEventListener('click', () => this.submitMessage());

    // Initial render
    this.render();
  }

  openWidget() {
    this.isOpen = true;
    this.isMinimized = false;
    this.unreadCount = 0;
    this.updateUIState();
    this.render();
  }

  closeWidget() {
    this.isOpen = false;
    this.isMinimized = false;
    this.updateUIState();
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    if (this.isMinimized) {
      this.chatWindow.classList.add('is-minimized');
      this.minimizeBtn.innerHTML = ICON_CHEVRON_UP;
      this.minimizeBtn.setAttribute('aria-label', 'Expand Chat');
      this.minimizeBtn.setAttribute('title', 'Expand');
    } else {
      this.chatWindow.classList.remove('is-minimized');
      this.minimizeBtn.innerHTML = ICON_MINUS;
      this.minimizeBtn.setAttribute('aria-label', 'Minimize Chat');
      this.minimizeBtn.setAttribute('title', 'Minimize');
      this.unreadCount = 0;
      this.updateUIState();
    }
  }

  updateUIState() {
    // Handle triggers showing
    if (this.isOpen) {
      this.triggerBtn.style.display = 'none';
      this.chatWindow.style.display = 'flex';
      // Wait a microtask to trigger CSS transition scaling
      setTimeout(() => this.chatWindow.classList.add('is-open'), 10);
    } else {
      this.chatWindow.classList.remove('is-open');
      this.chatWindow.classList.remove('is-minimized');
      this.triggerBtn.style.display = 'flex';
      setTimeout(() => {
        if (!this.isOpen) this.chatWindow.style.display = 'none';
      }, 250); // matches CSS transitions
    }

    // Badge
    if (this.unreadCount > 0) {
      this.badge.textContent = this.unreadCount;
      this.badge.style.display = 'flex';
      this.badge.setAttribute('aria-label', `${this.unreadCount} unread messages`);
    } else {
      this.badge.style.display = 'none';
    }
  }

  submitMessage() {
    const text = this.inputField.value.trim();
    if (!text || this.isTyping) return;

    this.inputField.value = '';
    this.sendBtn.disabled = true;

    // Send user message
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: currentTime
    };
    this.messages.push(userMsg);
    this.render();

    // Start bot typing
    this.isTyping = true;
    this.render();

    setTimeout(() => {
      const response = getBotResponse(text);
      const botMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: response.suggestedPrompts
      };
      this.messages.push(botMsg);
      this.isTyping = false;

      if (!this.isOpen || this.isMinimized) {
        this.unreadCount++;
      }

      this.updateUIState();
      this.render();
    }, 700);
  }

  sendQuickPrompt(promptText) {
    this.inputField.value = promptText;
    this.submitMessage();
  }

  render() {
    if (!this.messagesContainer) return;

    this.messagesContainer.innerHTML = '';

    // Render bubbles
    this.messages.forEach(msg => {
      const isUser = msg.sender === 'user';
      const row = document.createElement('div');
      row.className = `eh-chat-bubble-row ${isUser ? 'is-user' : 'is-bot'}`;
      row.setAttribute('role', 'log');
      row.setAttribute('aria-label', `${isUser ? 'You' : 'Assistant'} says`);

      let avatar = '';
      if (isUser) {
        avatar = `<div class="eh-chat-bubble-avatar" style="margin-left: 8px; background: var(--border-dark); color: var(--text-primary)" aria-hidden="true">${ICON_USER}</div>`;
      } else {
        avatar = `<div class="eh-chat-bubble-avatar" aria-hidden="true">${ICON_BOT}</div>`;
      }

      const formattedText = formatMessageText(msg.text);

      const content = `
        ${!isUser ? avatar : ''}
        <div class="eh-chat-bubble-content-wrapper">
          <div class="eh-chat-bubble">
            ${formattedText}
          </div>
          <span class="eh-chat-bubble-time" aria-label="Sent at ${msg.timestamp}">
            ${msg.timestamp}
          </span>
        </div>
        ${isUser ? avatar : ''}
      `;

      row.innerHTML = content;
      this.messagesContainer.appendChild(row);
    });

    // Render typing indicator
    if (this.isTyping) {
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'eh-chat-bubble-row is-bot';
      typingIndicator.setAttribute('aria-live', 'polite');
      typingIndicator.setAttribute('aria-label', 'Bot is typing');
      typingIndicator.innerHTML = `
        <div class="eh-chat-bubble-avatar" aria-hidden="true">${ICON_BOT}</div>
        <div class="eh-typing-indicator-container">
          <div class="eh-typing-dots">
            <span class="eh-typing-dot"></span>
            <span class="eh-typing-dot"></span>
            <span class="eh-typing-dot"></span>
          </div>
        </div>
      `;
      this.messagesContainer.appendChild(typingIndicator);
    }

    // Render suggested chips (from the absolute latest bot message if not typing)
    const lastBotMessage = [...this.messages].reverse().find(m => m.sender === 'bot');
    const showSuggestions = lastBotMessage && lastBotMessage.suggestedPrompts && lastBotMessage.suggestedPrompts.length > 0 && !this.isTyping;

    if (showSuggestions) {
      const suggestionsGroup = document.createElement('div');
      suggestionsGroup.className = 'eh-chat-suggestions';
      suggestionsGroup.setAttribute('role', 'group');
      suggestionsGroup.setAttribute('aria-label', 'Suggested quick replies');

      lastBotMessage.suggestedPrompts.forEach(prompt => {
        const btn = document.createElement('button');
        btn.className = 'eh-chat-suggestion-chip';
        btn.textContent = prompt;
        btn.setAttribute('aria-label', `Ask about ${prompt}`);
        btn.addEventListener('click', () => this.sendQuickPrompt(prompt));
        suggestionsGroup.appendChild(btn);
      });

      this.messagesContainer.appendChild(suggestionsGroup);
    }

    // Scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

// Auto install / bootstrap helper
export function bootstrapChatWidget() {
  let container = document.getElementById('chat-widget-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'chat-widget-root';
    document.body.appendChild(container);
  }
  const widget = new ChatWidget();
  widget.init();
  return widget;
}
