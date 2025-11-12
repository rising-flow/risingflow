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
        // For custom domain GitHub Pages, files are served from domain root
        // For repo-based GitHub Pages, files are under /repo-name/
        // Try in order: domain root first, then relative to current page
        const candidates = [];
        
        // 1) Domain root (works for custom domains)
        candidates.push(`${location.origin}/data/_manifests/events.json`);
        
        // 2) Relative to current page directory
        const currentDir = location.pathname.endsWith('/') 
            ? location.pathname 
            : location.pathname.replace(/\/[^\/]*$/, '/');
        candidates.push(`${location.origin}${currentDir}data/_manifests/events.json`);
        
        // 3) If we're in a subdirectory, try going up one level
        if (currentDir !== '/') {
            const parentDir = currentDir.replace(/\/[^\/]*\/$/, '/');
            candidates.push(`${location.origin}${parentDir}data/_manifests/events.json`);
        }

        console.debug('[EventService] Manifest candidate URLs:', candidates);

        let manifest = null;
        let manifestTried = [];
        for (const url of candidates) {
            console.debug(`[EventService] Trying manifest: ${url}`);
            manifestTried.push(url);
            manifest = await fetchJson(url);
            if (manifest) {
                console.debug(`[EventService] Manifest found at: ${url}`);
                break;
            }
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

        console.debug('[EventService] All folders to load:', allFolders);

        // Determine the working base path from where manifest was found
        const workingBase = manifestTried[manifestTried.findIndex((url, i) => i < manifestTried.length - 1 || manifest)] || candidates[0];
        const basePath = workingBase.replace('/data/_manifests/events.json', '');
        console.debug('[EventService] Using base path for events:', basePath);

        // Load each event.json from its folder
        for (const folder of allFolders) {
            try {
                console.debug(`[EventService] Processing folder: "${folder}"`);
                // Encode folder to make safe URLs (spaces, accents, etc.)
                const safeFolder = encodeURIComponent(folder);
                const tried = [];

                // Try encoded path first
                tried.push(`${basePath}/data/events/${safeFolder}/event.json`);
                // Also try raw folder name (some servers decode URLs differently)
                tried.push(`${basePath}/data/events/${folder}/event.json`);

                console.debug(`[EventService] Event JSON candidate URLs for "${folder}":`, tried);

                let eventData = null;
                for (const p of tried) {
                    console.debug(`[EventService] Trying event URL: ${p}`);
                    eventData = await fetchJson(p);
                    if (eventData) {
                        console.debug(`[EventService] Event JSON loaded from: ${p}`);
                        // store which URL succeeded
                        eventData._sourceEventJson = p;
                        eventData._basePath = basePath; // store base for image URLs
                        break;
                    }
                }

                if (eventData) {
                    // Store both raw and encoded folder names. Use encoded for URL building.
                    eventData.folderRaw = folder;
                    eventData.folder = safeFolder; // encoded folder for URLs
                    allEvents.push(eventData);
                    console.debug(`[EventService] Added event: ${eventData.id || eventData.title}`);
                } else {
                    console.warn(`[EventService] Event JSON not found for folder '${folder}'. Tried:`, tried);
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