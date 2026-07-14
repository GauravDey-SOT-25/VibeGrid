import { events, EventItem } from '../data/events';

export interface BotResponse {
  text: string;
  suggestedPrompts?: string[];
}

/**
 * Normalizes input text and checks for keywords.
 */
export function getBotResponse(userMessage: string): BotResponse {
  const query = userMessage.toLowerCase().trim();

  // Help command
  if (query.includes('help') || query === 'commands' || query === 'hi' || query === 'hello' || query === 'hey') {
    return {
      text: `👋 **Welcome to EventHub Support!** I'm your interactive event assistant.\n\nYou can ask me about upcoming events, categories, registrations, or use one of my quick commands below:\n\n` +
            `• **"tech"** - Discover tech events & summits\n` +
            `• **"music"** - Browse concerts & live music\n` +
            `• **"workshop"** - Find bootcamps & hands-on classes\n` +
            `• **"conference"** - View conferences & summits\n` +
            `• **"today"** - Find out what's happening today\n` +
            `• **"weekend"** - See events for the upcoming weekend\n` +
            `• **"categories"** - List all event categories\n` +
            `• **"register"** - Learn how to secure your spot\n` +
            `• **"contact"** - Get touch with support\n\n` +
            `How can I assist you today?`,
      suggestedPrompts: ['categories', 'tech', 'music', 'register', 'contact']
    };
  }

  // Categories command
  if (query.includes('categories') || query === 'category') {
    const categoriesSet = new Set(events.map(e => e.category));
    const list = Array.from(categoriesSet).map(c => `• **${c}**`).join('\n');
    return {
      text: `🏷️ **Available Event Categories:**\n\n${list}\n\nTo view events in a category, just type the category name (e.g. "Browse Technology" or "music")!`,
      suggestedPrompts: ['tech', 'music', 'workshop', 'conference']
    };
  }

  // Tech command
  if (query.includes('tech') || query.includes('technology') || query.includes('ai') || query.includes('developer') || query.includes('cyber')) {
    const techEvents = events.filter(e => e.category.toLowerCase() === 'technology' && e.status === 'upcoming').slice(0, 3);
    const list = techEvents.map(e => `🖥️ **${e.title}**\n📅 ${e.date} | 📍 ${e.venue}\n🎟️ ${e.maxAttendees - e.registeredCount} spots left!`).join('\n\n');
    return {
      text: `💻 **Upcoming Technology Events:**\n\n${list || 'No technology events scheduled currently.'}\n\nWant to know how to register? Ask me "**register**"!`,
      suggestedPrompts: ['register', 'help']
    };
  }

  // Music command
  if (query.includes('music') || query.includes('jazz') || query.includes('concert') || query.includes('band') || query.includes('electronic')) {
    const musicEvents = events.filter(e => e.category.toLowerCase() === 'music' && e.status === 'upcoming').slice(0, 3);
    const list = musicEvents.map(e => `🎵 **${e.title}**\n📅 ${e.date} | 📍 ${e.venue}\n🎟️ ${e.maxAttendees - e.registeredCount} spots left!`).join('\n\n');
    return {
      text: `🎷 **Upcoming Music Events:**\n\n${list || 'No music events scheduled currently.'}\n\nWant to know how to register? Ask me "**register**"!`,
      suggestedPrompts: ['register', 'help']
    };
  }

  // Workshop command
  if (query.includes('workshop') || query.includes('bootcamp') || query.includes('class') || query.includes('learn') || query.includes('masterclass')) {
    const workshops = events.filter(e => 
      (e.title.toLowerCase().includes('workshop') || 
       e.title.toLowerCase().includes('bootcamp') || 
       e.title.toLowerCase().includes('masterclass') || 
       e.description.toLowerCase().includes('workshop') || 
       e.category.toLowerCase() === 'education') && e.status === 'upcoming'
    ).slice(0, 3);
    const list = workshops.map(e => `✍️ **${e.title}**\n📅 ${e.date} | 📍 ${e.venue}\n🎟️ ${e.maxAttendees - e.registeredCount} spots left!`).join('\n\n');
    return {
      text: `🎓 **Upcoming Workshops & Classes:**\n\n${list || 'No workshops scheduled currently.'}\n\nWant to know how to register? Ask me "**register**"!`,
      suggestedPrompts: ['register', 'help']
    };
  }

  // Conference command
  if (query.includes('conference') || query.includes('summit') || query.includes('expo') || query.includes('exhibition')) {
    const conferences = events.filter(e => 
      (e.title.toLowerCase().includes('summit') || 
       e.title.toLowerCase().includes('conference') || 
       e.title.toLowerCase().includes('expo') || 
       e.title.toLowerCase().includes('exhibition') || 
       e.category.toLowerCase() === 'business') && e.status === 'upcoming'
    ).slice(0, 3);
    const list = conferences.map(e => `👔 **${e.title}**\n📅 ${e.date} | 📍 ${e.venue}\n🎟️ ${e.maxAttendees - e.registeredCount} spots left!`).join('\n\n');
    return {
      text: `💼 **Upcoming Conferences & Summits:**\n\n${list || 'No conferences scheduled currently.'}\n\nWant to know how to register? Ask me "**register**"!`,
      suggestedPrompts: ['register', 'help']
    };
  }

  // Today command
  if (query.includes('today') || query === 'now') {
    // Current date is 2026-07-09
    const todayEvents = events.filter(e => e.date === '2026-07-09' && e.status === 'upcoming');
    if (todayEvents.length > 0) {
      const list = todayEvents.map(e => `🌟 **${e.title}**\n🕒 ${e.time} | 📍 ${e.venue}`).join('\n\n');
      return {
        text: `📅 **Happening Today (July 9, 2026):**\n\n${list}`,
        suggestedPrompts: ['register', 'help']
      };
    } else {
      const nextEvent = events.find(e => e.date >= '2026-07-09' && e.status === 'upcoming');
      return {
        text: `📅 **Happening Today (July 9, 2026):**\n\nThere are no events scheduled for today. \n\n🚀 However, our next major upcoming event is **${nextEvent?.title}** scheduled on **${nextEvent?.date}** at **${nextEvent?.venue}**!`,
        suggestedPrompts: ['register', 'help']
      };
    }
  }

  // Weekend command
  if (query.includes('weekend') || query.includes('saturday') || query.includes('sunday')) {
    // Weekend for 2026-07-09 (Thursday) is Saturday 2026-07-11 and Sunday 2026-07-12
    // Let's filter events that occur between 2026-07-11 and 2026-07-12
    const weekendEvents = events.filter(e => (e.date === '2026-07-11' || e.date === '2026-07-12') && e.status === 'upcoming');
    if (weekendEvents.length > 0) {
      const list = weekendEvents.map(e => `🎉 **${e.title}**\n📅 ${e.date} (${e.time}) | 📍 ${e.venue}`).join('\n\n');
      return {
        text: `🗓️ **Happening This Weekend (July 11-12, 2026):**\n\n${list}`,
        suggestedPrompts: ['register', 'help']
      };
    } else {
      // Find nearest weekend events in the dataset
      const nextWeekendEvent = events.find(e => e.date >= '2026-07-09' && e.status === 'upcoming' && (e.title.includes('Stars') || e.category === 'Music' || e.date.endsWith('18') || e.date.endsWith('19')));
      return {
        text: `🗓️ **Happening This Weekend (July 11-12, 2026):**\n\nThere are no events scheduled for this immediate weekend. \n\n🎷 However, next weekend we have **Jazz Under the Stars** on **Saturday, July 18, 2026** at Central Park, New York!`,
        suggestedPrompts: ['music', 'register']
      };
    }
  }

  // Register command
  if (query.includes('register') || query.includes('book') || query.includes('ticket') || query.includes('signup') || query.includes('sign up')) {
    return {
      text: `🎟️ **How to Register for Events on EventHub:**\n\n` +
            `1. **Browse Events**: Scroll through our list of 50+ hand-picked events on the homepage.\n` +
            `2. **Click "Register Now"**: On any upcoming event card, click the orange registration button.\n` +
            `3. **Submit Your Details**: Fill in your Name and Email in the modal form, then click "Confirm Registration".\n` +
            `4. **Save Ticket**: You'll receive a unique registration ID immediately. Keep it safe!\n\n` +
            `*Tip: Registration is entirely free, but seats are limited!*`,
      suggestedPrompts: ['categories', 'help']
    };
  }

  // Contact command
  if (query.includes('contact') || query.includes('support') || query.includes('phone') || query.includes('email') || query.includes('helpdesk')) {
    return {
      text: `📞 **Contact EventHub Support:**\n\n` +
            `Have a question or need assistance with your booking?\n\n` +
            `• 📧 **Email Support:** support@eventhub.com\n` +
            `• 📱 **Phone Helpline:** +1 (800) 555-EVNT (Mon-Fri, 9 AM - 6 PM EST)\n` +
            `• 🏢 **HQ Address:** 100 Innovation Way, Suite 400, Austin, TX 78701\n\n` +
            `We will respond to all email inquiries within 24 hours.`,
      suggestedPrompts: ['help']
    };
  }

  // Fallback default response
  return {
    text: `😅 **Sorry, I couldn't understand your question.**\n\nTry asking about events, workshops, music, technology, today's events, or registration. You can also type "**help**" to see a full list of commands!`,
    suggestedPrompts: ['help', 'categories', 'register']
  };
}
