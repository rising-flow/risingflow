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
 * Parse YYYY-MM-DD date string as local midnight to avoid timezone shifts.
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {Date|null} - Local midnight Date object or null if invalid
 */
function parseDateLocal(dateStr) {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return null;
    // new Date(year, monthIndex, day) creates a local-midnight Date (no timezone shift)
    return new Date(y, m - 1, d);
}

/**
 * Get date with time set to local midnight for comparison purposes.
 * @param {Date} date - Input date
 * @returns {number} - Timestamp at local midnight
 */
function dateOnly(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

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

        // Categorize events by date using local midnight to avoid timezone issues
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = [];
        const pastEvents = [];

        allEvents.forEach(event => {
            // Parse end date as local midnight to avoid timezone shift
            const endDate = parseDateLocal(event.ending_date);
            if (!endDate) {
                console.warn(`Invalid ending_date for event: ${event.id || event.title}`);
                return;
            }
            
            // Event is past if today is after the end date (both at local midnight)
            if (dateOnly(today) > dateOnly(endDate)) {
                pastEvents.push(event);
            } else {
                upcomingEvents.push(event);
            }
        });

        // Sort events using local date parsing
        upcomingEvents.sort((a, b) => {
            const dateA = parseDateLocal(a.starting_date);
            const dateB = parseDateLocal(b.starting_date);
            return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
        });
        pastEvents.sort((a, b) => {
            const dateA = parseDateLocal(a.ending_date);
            const dateB = parseDateLocal(b.ending_date);
            return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
        });

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
 * Helper function to format date range from ISO date strings.
 * @param {Date|string} startDate - Start date (Date object or YYYY-MM-DD string).
 * @param {Date|string} endDate - End date (Date object or YYYY-MM-DD string).
 * @returns {string}
 */
export function formatDateRange(startDate, endDate) {
    // Handle both Date objects (legacy) and string parsing (new)
    const start = startDate instanceof Date ? startDate : parseDateLocal(startDate);
    const end = endDate instanceof Date ? endDate : parseDateLocal(endDate);
    
    if (!start || !end) return '';
    
    // Compare dates at local midnight to avoid timezone issues
    if (start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth() &&
        start.getDate() === end.getDate()) {
        return start.toLocaleDateString('pt-BR');
    }
    return `${start.toLocaleDateString('pt-BR')} - ${end.toLocaleDateString('pt-BR')}`;
}