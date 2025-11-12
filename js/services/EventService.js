/**
 * EventService - Handles all event-related data operations
 * This service is responsible for fetching, processing, and categorizing event data.
 */

/**
 * Fetches event data from a JSON file.
 * @param {string} path - The path to the event.json file.
 * @returns {Promise<object|null>}
 */
async function loadEventData(path) {
    try {
        const response = await fetch(path);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error(`Error loading event data from ${path}:`, error);
    }
    return null;
}

/**
 * Gets event folders for a specific type.
 * In a real app, this would be a server call or use a manifest file.
 * @param {string} type - 'upcoming' or 'past'.
 * @returns {Promise<string[]>}
 */
async function getEventFolders(type) {
    // This is a temporary solution. A better approach would be a manifest file.
    if (type === 'upcoming') {
        return ['Cosgeek 2025']; // Example folder based on your structure
    } else if (type === 'past') {
        return ['event-002']; // Example folder based on your structure
    }
    return [];
}

/**
 * Loads all events and categorizes them.
 * @returns {Promise<{upcomingEvents: object[], pastEvents: object[]}>}
 */
export async function getAllEvents() {
    const events = [];
    
    try {
        // Load upcoming events
        const upcomingFolders = await getEventFolders('upcoming');
        for (const folder of upcomingFolders) {
            const eventData = await loadEventData(`./data/events/upcoming/${folder}/event.json`);
            if (eventData) {
                events.push(eventData);
            }
        }

        // Load past events
        const pastFolders = await getEventFolders('past');
        for (const folder of pastFolders) {
            const eventData = await loadEventData(`./data/events/past/${folder}/event.json`);
            if (eventData) {
                events.push(eventData);
            }
        }

        // Categorize events
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = [];
        const pastEvents = [];

        events.forEach(event => {
            const endDate = new Date(event.ending_date);
            endDate.setHours(0, 0, 0, 0);
            
            const pastThreshold = new Date(endDate);
            pastThreshold.setDate(pastThreshold.getDate() + 1);

            if (today >= pastThreshold) {
                pastEvents.push(event);
            } else {
                upcomingEvents.push(event);
            }
        });

        // Sort events
        upcomingEvents.sort((a, b) => new Date(a.starting_date) - new Date(b.starting_date));
        pastEvents.sort((a, b) => new Date(b.ending_date) - new Date(a.ending_date));

        return { upcomingEvents, pastEvents };
    } catch (error) {
        console.error('Error loading events:', error);
        return { upcomingEvents: [], pastEvents: [] };
    }
}

/**
 * Helper function to get month abbreviation.
 * @param {number} month - Month index (0-11).
 * @returns {string}
 */
export function getMonthAbbreviation(month) {
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    return months[month];
}

/**
 * Helper function to format date range.
 * @param {Date} startDate - Start date.
 * @param {Date} endDate - End date.
 * @returns {string}
 */
export function formatDateRange(startDate, endDate) {
    if (startDate.toDateString() === endDate.toDateString()) {
        return startDate.toLocaleDateString('pt-BR');
    }
    return `${startDate.toLocaleDateString('pt-BR')} - ${endDate.toLocaleDateString('pt-BR')}`;
}