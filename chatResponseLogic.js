// chatResponseLogic.js

import { getAllEvents } from "./eventService.js";

/**
 * Returns matching events based on user message
 */
export async function getChatResponse(userMessage) {
    const events = await getAllEvents();

    const message = userMessage.toLowerCase();

    // Category Keywords
    const categories = [
        "technology",
        "music",
        "sports",
        "business",
        "food",
        "education",
        "community",
        "entertainment",
        "health",
        "art"
    ];

    // Find matching category
    const matchedCategory = categories.find(category =>
        message.includes(category)
    );

    if (matchedCategory) {

        const filteredEvents = events.filter(event =>
            event.category.toLowerCase().includes(matchedCategory)
        );

        if (filteredEvents.length > 0) {
            return filteredEvents;
        }

        return [];
    }

    // Search by title
    const titleResults = events.filter(event =>
        event.title.toLowerCase().includes(message)
    );

    if (titleResults.length > 0) {
        return titleResults;
    }

    return [];
}