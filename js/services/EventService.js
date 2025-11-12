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
        // Try multiple candidate locations for the manifest to support different
        // hosting layouts (root domain, repo subpath like GitHub Pages, nested).
        const candidates = [];
        // 1) Relative to current page
        candidates.push(new URL('data/_manifests/events.json', location.href).toString());
        // 2) Relative to site root (leading slash) — some servers support this
        try {
            candidates.push(new URL('/data/_manifests/events.json', location.origin).toString());
        } catch (e) {
            // ignore
        }
        // 3) Walk up path segments and try at each level (useful when page is nested)
        const pathParts = location.pathname.split('/').filter(Boolean);
        for (let i = pathParts.length; i >= 0; i--) {
            const base = location.origin + '/' + pathParts.slice(0, i).join('/') + (i === 0 ? '/' : '/');
            candidates.push(new URL('data/_manifests/events.json', base).toString());
        }

        let manifest = null;
        let manifestTried = [];
        for (const url of candidates) {
            manifestTried.push(url);
            manifest = await fetchJson(url);
            if (manifest) break;
        }

        if (!manifest) {
            console.warn('No events manifest found. Tried URLs:', manifestTried);
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
                // Encode folder to make safe URLs (spaces, accents, etc.)
                const safeFolder = encodeURIComponent(folder);
                const tried = [];

                // Try encoded path first
                tried.push(new URL(`data/events/${safeFolder}/event.json`, location.href).toString());
                // Also try raw folder name (some servers decode URLs differently)
                tried.push(new URL(`data/events/${folder}/event.json`, location.href).toString());

                let eventData = null;
                for (const p of tried) {
                    eventData = await fetchJson(p);
                    if (eventData) {
                        // store which URL succeeded
                        eventData._sourceEventJson = p;
                        break;
                    }
                }

                if (eventData) {
                    // Store both raw and encoded folder names. Use encoded for URL building.
                    eventData.folderRaw = folder;
                    eventData.folder = safeFolder; // encoded folder for URLs
                    allEvents.push(eventData);
                } else {
                    console.warn(`Event JSON not found for folder '${folder}'. Tried:`, tried);
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