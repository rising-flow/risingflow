/**
 * SongService - Handles all song-related data operations
 * This service is responsible for fetching and processing song data from various games.
 */

import { fetchJson } from './DataService.js';

// Game Data Source Mapping
const gameDataSources = {
    'Dance Dance Revolution': {
        type: 'folder',
        path: 'data/Stepmania/'
    },
    'Project Diva': {
        type: 'file',
        path: 'data/Project Diva/project_diva.json'
    },
    'Taiko no Tatsujin': {
        type: 'multi_file',
        files: [
            'data/Taiko no Tatsujin/taiko_no_tatsujin_pops.json',
            'data/Taiko no Tatsujin/taiko_no_tatsujin_anime.json',
            'data/Taiko no Tatsujin/taiko_no_tatsujin_vocaloid.json',
            'data/Taiko no Tatsujin/taiko_no_tatsujin_variety.json',
            'data/Taiko no Tatsujin/taiko_no_tatsujin_game_music.json',
            'data/Taiko no Tatsujin/taiko_no_tatsujin_namco_original.json',
            'data/Taiko no Tatsujin/taiko_no_tatsujin_classic.json'
        ]
    },
    'YARG': {
        type: 'file',
        path: 'data/YARG/yarg_songs.json'
    }
};

// Global to store category order for Stepmania
let stepmaniaCategoryOrder = [];

/**
 * Fetch all JSON files in the Stepmania folder.
 * @param {string} folderPath - Path to the folder.
 * @returns {Promise<Array<{categoryName: string, data: object, order: number}>>}
 */
async function fetchStepmaniaFiles(folderPath) {
    // Try to load a manifest first to allow deterministic file lists
    const manifest = await fetchJson('/data/_manifests/stepmania.json');
    const jsonFiles = manifest && Array.isArray(manifest.files) ? manifest.files : [
        '1 - Anime Channel.json',
        '2 - KPOP Channel.json',
        '3 - World POP Channel.json',
        '4 - JPOP Channel.json',
        '5 - Vocaloid Channel.json',
        '6 - Touhou Channel.json',
        '7 - Games Channel.json',
        '8 - Dance Dance Revolution 1st Mix.json',
        '9 - Dance Dance Revolution 2nd Mix.json',
        '10 - Dance Dance Revolution 2nd Mix Club & Link Versions.json',
        '11 - Dance Dance Revolution 3rd Mix.json',
        '12 - Dance Dance Revolution 3rd Mix Plus & Korea Versions.json',
        '13 - Dance Dance Revolution 4th Mix.json',
        '14 - Dance Dance Revolution 4th Mix Plus.json',
        '15 - Dance Dance Revolution 5th Mix.json',
        '16 - Dance Dance Revolution 6th Mix - MAX.json',
        '17 - Dance Dance Revolution 7th Mix - MAX2.json',
        '18 - Dance Dance Revolution 8th Mix -  Extreme.json',
        '19 - Dance Dance Revolution SuperNOVA.json',
        '20 - Dance Dance Revolution SuperNOVA 2.json',
        '21 - Dance Dance Revolution X.json',
        '22 - Dance Dance Revolution X2.json',
        '23 - Dance Dance Revolution X3.json',
        '24 - Dance Dance Revolution 2013.json',
        '25 - Dance Dance Revolution 2014.json',
        '26 - Dance Dance Revolution A.json',
        '27 - Dance Dance Revolution A20.json',
        '28 - Dance Dance Revolution A20 Plus.json',
        '29 - Dance Dance Revolution A3.json',
        '30 - Dance Dance Revolution Grand Prix.json',
        '31 - Dance Dance Revolution PS1 Exclusives.json',
        '32 - Dance Dance Revolution PS2 Exclusives.json',
        '33 - Dance Dance Revolution PS3 Exclusives.json',
        '34 - Dance Dance Revolution Xbox Exclusives.json',
        '35 - Dance Dance Revolution Xbox 360 Exclusives.json',
        '36 -Dance Dance Revolution Wii Exclusives.json'
    ];

    const fetchPromises = jsonFiles.map(async file => {
        try {
            const data = await fetchJson('/' + folderPath + file);
            if (!data) return null;
            const match = file.match(/^[0-9]+\s*[-_]?\s*(.*)\.json$/i);
            const categoryName = match ? match[1] : file.replace('.json', '');
            const order = parseInt(file.match(/^([0-9]+)/)?.[1] || '9999', 10);
            return { categoryName, data, order };
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
            return null;
        }
    });

    const results = (await Promise.all(fetchPromises)).filter(Boolean);
    results.sort((a, b) => a.order - b.order);
    
    // Store the order for Stepmania
    stepmaniaCategoryOrder = results.map(r => r.categoryName);
    return results.map(({categoryName, data}) => ({categoryName, data}));
}

/**
 * Fetch all JSON files for multi_file games (like Taiko).
 * @param {string[]} fileList - List of file paths.
 * @returns {Promise<Array<{categoryName: string, data: object}>>}
 */
async function fetchMultiJsonFiles(fileList) {
    const fetchPromises = fileList.map(async file => {
        try {
            const data = await fetchJson('/' + file);
            if (!data) return null;
            const match = file.match(/taiko_no_tatsujin_(.*)\.json$/i);
            const categoryName = match ? match[1].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : file;
            return { categoryName, data };
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
            return null;
        }
    });

    return (await Promise.all(fetchPromises)).filter(Boolean);
}

/**
 * Load songs for a specific game.
 * @param {string} gameName - Name of the game.
 * @returns {Promise<{[categoryName: string]: object[]}>}
 */
export async function loadSongsForGame(gameName) {
    const allSongsData = {};

    if (!gameDataSources[gameName]) {
        throw new Error(`Game "${gameName}" not found`);
    }

    const source = gameDataSources[gameName];

    try {
        if (source.type === 'multi_file') {
            // For Taiko and other multi-file games: prefer a manifest list if present
            const manifest = await fetchJson('/data/_manifests/taiko.json');
            const fileList = manifest && Array.isArray(manifest.files) ? manifest.files : source.files;
            const results = await fetchMultiJsonFiles(fileList);
            results.forEach(({ categoryName, data }) => {
                allSongsData[categoryName] = data;
            });
        } else if (source.type === 'folder') {
            // For Stepmania: load all files in folder
            const results = await fetchStepmaniaFiles(source.path);
            results.forEach(({ categoryName, data }) => {
                allSongsData[categoryName] = data;
            });
        } else if (source.type === 'file') {
            // For single file games
            const data = await fetchJson('/' + source.path);
            if (!data) throw new Error('File not found');
            
            // Special handling for YARG: group by artist
            if (gameName === 'YARG') {
                const artistGroups = {};
                data.forEach(song => {
                    const artist = song.artist || 'Unknown Artist';
                    if (!artistGroups[artist]) {
                        artistGroups[artist] = [];
                    }
                    artistGroups[artist].push(song);
                });
                
                // Sort songs within each artist group by title
                Object.keys(artistGroups).forEach(artist => {
                    artistGroups[artist].sort((a, b) => {
                        const titleA = (a.title || '').toLowerCase();
                        const titleB = (b.title || '').toLowerCase();
                        return titleA.localeCompare(titleB);
                    });
                });
                
                // Store artist groups as categories
                Object.keys(artistGroups).forEach(artist => {
                    allSongsData[artist] = artistGroups[artist];
                });
            } else {
                allSongsData[gameName] = data;
            }
        }

        return allSongsData;
    } catch (error) {
        console.error(`Error loading songs for ${gameName}:`, error);
        return {};
    }
}

/**
 * Get the category order for sorting (mainly for Stepmania).
 * @returns {string[]}
 */
export function getStepmaniaOrder() {
    return stepmaniaCategoryOrder;
}

/**
 * Safely get text content from a potentially null field, prioritizing transliterated versions.
 * @param {string} originalField - Original field value.
 * @param {string} translitField - Transliterated field value.
 * @returns {string}
 */
export function getText(originalField, translitField) {
    return translitField && translitField.trim() !== '' ? translitField : originalField || '';
}

/**
 * Determine game type from song structure.
 * @param {object} song - Song object.
 * @returns {string}
 */
export function getGameType(song) {
    // YARG songs have a specific structure with difficulties object containing guitar, bass, drums, vocals
    if (song.difficulties && 
        song.difficulties.hasOwnProperty('guitar') && 
        song.difficulties.hasOwnProperty('bass') && 
        song.difficulties.hasOwnProperty('drums')) {
        return 'YARG';
    }
    return 'default';
}