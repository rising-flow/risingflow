/**
 * EventService - Handles all event-related data operations
 * This service is responsible for fetching, processing, and categorizing event data.
 * 
 * Events are stored in individual folders under /data/events/
 * Each folder contains an event.json file and associated assets (images, gallery, etc.)
 * The manifest file /data/_manifests/events.json lists all event folders
 */

import { fetchJson } from './DataService.js';

/**
 * Loads all events from their individual folders and categorizes them by date.
 * Events are automatically classified as upcoming or past based on their ending_date.
 * @returns {Promise<{upcomingEvents: object[], pastEvents: object[]}>}
 */
export async function getAllEvents() {
    try {
        // Load the manifest that lists all event folders
        const manifest = await fetchJson('/data/_manifests/events.json');
        
        if (!manifest) {
            console.warn('No events manifest found at /data/_manifests/events.json');
            return { upcomingEvents: [], pastEvents: [] };
        }

        const allEvents = [];
        
        // Get all folder names from manifest (both upcoming and past arrays)
        const allFolders = [
            ...(manifest.upcoming || []),
            ...(manifest.past || [])
        ];

        // Load each event.json from its folder
        for (const folder of allFolders) {
            try {
                const eventData = await fetchJson(`/data/events/${folder}/event.json`);
                if (eventData) {
                    // Add folder name to event data for building image paths
                    eventData.folder = folder;
                    allEvents.push(eventData);
                }
            } catch (err) {
                console.warn(`Failed to load event from folder: ${folder}`, err);
            }
        }

        // Categorize events by date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = [];
        const pastEvents = [];

        allEvents.forEach(event => {
            const endDate = new Date(event.ending_date);
            endDate.setHours(0, 0, 0, 0);
            
            // Event is past if today is after the end date
            if (today > endDate) {
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