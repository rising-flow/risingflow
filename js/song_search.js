(function() {
// Data store for all songs, keyed by category name
const allSongsData = {};
const filterTerms = new Set(); // Using a Set to store unique filter terms

// DOM Elements
const filterInput = document.getElementById('filter-input');
const addFilterBtn = document.getElementById('add-filter-btn');
const filterTagsContainer = document.getElementById('filter-tags');
const categoryListContainer = document.getElementById('category-list');
const loadingMessage = document.getElementById('loading-message');
const clearFiltersBtn = document.getElementById('clear-filters-btn'); // Clear All button

// --- Language Translation for Song Searcher ---
const songSearcherTranslations = {
    'pt-BR': {
        pageTitle: 'Rising Flow - Buscador de Músicas',
        searchPageTitle: 'Buscador de Músicas',
        filterPlaceholder: 'Buscar por título, artista ou subtítulo...',
        addFilterTitle: 'Adicionar Filtro',
        clearFiltersTitle: 'Limpar Todos os Filtros',
        loadingSongs: 'Carregando músicas...',
        noSongsFoundLetter: 'Nenhuma música encontrada começando com esta letra.',
        noSongsFoundCriteria: 'Nenhuma música encontrada com seus critérios.',
        noSongsAvailable: 'Nenhuma música disponível.',
        selectGameTitle: 'Selecione um Jogo',
    },
    'en-GB': {
        pageTitle: 'Rising Flow - Song Searcher',
        searchPageTitle: 'Song Searcher',
        filterPlaceholder: 'Search by title, artist, or subtitle...',
        addFilterTitle: 'Add Filter',
        clearFiltersTitle: 'Clear All Filters',
        loadingSongs: 'Loading songs...',
        noSongsFoundLetter: 'No songs found starting with this letter.',
        noSongsFoundCriteria: 'No songs found matching your criteria.',
        noSongsAvailable: 'No songs available.',
        selectGameTitle: 'Select a Game',
    }
};

function getCurrentLang() {
    // Try to get from main language switcher, fallback to pt-BR
    const btn = document.getElementById('language-flag');
    if (btn && btn.dataset.lang) {
        return btn.dataset.lang === 'en-GB' ? 'en-GB' : 'pt-BR';
    }
    return 'pt-BR';
}

function updateSongSearcherUI() {
    const lang = getCurrentLang();
    const t = songSearcherTranslations[lang];
    document.title = t.pageTitle;
    const searchPageTitle = document.getElementById('search-page-title');
    if (searchPageTitle) searchPageTitle.textContent = t.searchPageTitle;
    const filterInput = document.getElementById('filter-input');
    if (filterInput) filterInput.placeholder = t.filterPlaceholder;
    const addFilterBtn = document.getElementById('add-filter-btn');
    if (addFilterBtn) addFilterBtn.title = t.addFilterTitle;
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) clearFiltersBtn.title = t.clearFiltersTitle;
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage && loadingMessage.textContent.trim() !== '') loadingMessage.textContent = t.loadingSongs;
    // Game selection title
    const gameSelTitle = document.querySelector('.game-selection h2');
    if (gameSelTitle) gameSelTitle.textContent = t.selectGameTitle;
}

// Function to safely get text content from a potentially null field, prioritizing transliterated versions
function getText(originalField, translitField) {
    return translitField && translitField.trim() !== '' ? translitField : originalField || '';
}

// --- Game Data Source Mapping ---
const gameDataSources = {
    'Dance Dance Revolution': {
        type: 'folder',
        path: 'data/Stepmania/'
    },
    'Project Diva': {
        type: 'file',
        path: 'project_diva.json'
    },
    'Taiko no Tatsujin': {
        type: 'folder',
        path: 'data/Taiko no Tatsujin/'
    },
    'YARG': {
        type: 'folder',
        path: 'data/YARG/'
    }
};

// --- Utility to fetch all JSON files in a folder (flat, not recursive) ---
async function fetchJsonFilesInFolder(folderPath) {
    // This function assumes you know the file names or have an API to list them.
    // For now, hardcode for Stepmania (DDR)
    if (folderPath === 'data/Stepmania/') {
        const jsonFiles = [
            'Anime Channel.json',
            'Dance Dance Revolution 1st Mix.json',
            'Dance Dance Revolution 2013.json',
            'Dance Dance Revolution 2014.json',
            'Dance Dance Revolution 2nd Mix Club & Link Versions.json',
            'Dance Dance Revolution 2nd.json',
            'Dance Dance Revolution 3rd Mix Plus & Korea Versions.json',
            'Dance Dance Revolution 3rd Mix.json',
            'Dance Dance Revolution 4th Mix Plus.json',
            'Dance Dance Revolution 4th Mix.json',
            'Dance Dance Revolution 5th Mix.json',
            'Dance Dance Revolution A.json',
            'Dance Dance Revolution A20 Plus.json',
            'Dance Dance Revolution A20.json',
            'Dance Dance Revolution A3.json',
            'Dance Dance Revolution Extreme.json',
            'Dance Dance Revolution Grand Prix.json',
            'Dance Dance Revolution PS1 Exclusives.json',
            'Dance Dance Revolution PS2 Exclusives.json',
            'Dance Dance Revolution PS3 Exclusives.json',
            'Dance Dance Revolution SuperNOVA.json',
            'Dance Dance Revolution SuperNOVA2.json',
            'Dance Dance Revolution X.json',
            'Dance Dance Revolution X2.json',
            'Dance Dance Revolution X3.json',
            'Dance Dance Revolution Xbox 360 Exclusives.json',
            'Dance Dance Revolution Xbox Exclusives.json',
            'Dance Dance RevolutionMAX.json',
            'Dance Dance RevolutionMAX2.json',
            'Games Channel.json',
            'JPOP Channel.json',
            'KPOP Channel.json',
            'Touhou Channel.json',
            'Vocaloid Channel.json',
            'World POP Channel.json'
        ];
        const fetchPromises = jsonFiles.map(async file => {
            const response = await fetch(folderPath + file);
            if (!response.ok) return null;
            const data = await response.json();
            const categoryName = file.replace('.json', '');
            return { categoryName, data };
        });
        return (await Promise.all(fetchPromises)).filter(Boolean);
    }
    // For other folders, return empty (no data yet)
    return [];
}

// --- Utility to fetch all JSON files in a folder (recursive) ---
async function fetchJsonFilesRecursively(folderPath) {
    // Use the Fetch API to try to get a list of files (requires server-side support for directory listing)
    // If not available, fallback to hardcoded lists for known folders (like Stepmania)
    // For now, try to fetch a manifest.json if present, otherwise fallback
    try {
        const manifestResponse = await fetch(folderPath + 'manifest.json');
        if (manifestResponse.ok) {
            const manifest = await manifestResponse.json();
            // manifest should be an array of file paths relative to folderPath
            const fetchPromises = manifest.filter(f => f.endsWith('.json')).map(async relPath => {
                const response = await fetch(folderPath + relPath);
                if (!response.ok) return null;
                const data = await response.json();
                // Use the file name (without .json) as the category name
                const categoryName = relPath.split('/').pop().replace('.json', '');
                return { categoryName, data };
            });
            return (await Promise.all(fetchPromises)).filter(Boolean);
        }
    } catch (e) {
        // No manifest, fallback
    }
    // Fallback: try to load all JSONs in Stepmania (flat)
    if (folderPath === 'data/Stepmania/') {
        return await fetchJsonFilesInFolder(folderPath);
    }
    // Otherwise, no data
    return [];
}

// --- Update: Use recursive loader for all folder-based games ---
async function loadSongsForGame(gameName) {
    allSongsData = {};
    filterTerms.clear();
    filterInput.value = '';
    renderFilterTags();
    categoryListContainer.innerHTML = '';
    loadingMessage.textContent = '';

    const lang = getCurrentLang();
    const t = songSearcherTranslations[lang];

    if (!gameDataSources[gameName]) {
        loadingMessage.textContent = t.noSongsAvailable;
        return;
    }
    const source = gameDataSources[gameName];
    loadingMessage.textContent = t.loadingSongs;

    if (source.type === 'folder') {
        const results = await fetchJsonFilesRecursively(source.path);
        if (results.length === 0) {
            loadingMessage.textContent = t.noSongsAvailable;
            return;
        }
        results.forEach(({ categoryName, data }) => {
            allSongsData[categoryName] = data;
        });
        loadingMessage.textContent = '';
        applyFilter();
    } else if (source.type === 'file') {
        try {
            const response = await fetch(source.path);
            if (!response.ok) throw new Error('File not found');
            const data = await response.json();
            allSongsData[gameName] = data;
            loadingMessage.textContent = '';
            applyFilter();
        } catch (e) {
            loadingMessage.textContent = t.noSongsAvailable;
        }
    }
}

// Function to render song items
function renderSongItem(song) {
    const songItem = document.createElement('div');
    songItem.className = 'song-item';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'title';
    // Use translit title if available, otherwise original title
    titleSpan.textContent = getText(song.title, song.title_translit);
    songItem.appendChild(titleSpan);

    const artistSpan = document.createElement('span');
    artistSpan.className = 'artist';
    // Use translit artist if available, otherwise original artist
    artistSpan.textContent = getText(song.artist, song.artist_translit);
    songItem.appendChild(artistSpan);

    // Only add subtitle if it exists (either original or translit)
    const displaySubtitle = getText(song.subtitle, song.subtitle_translit);
    if (displaySubtitle) {
        const subtitleSpan = document.createElement('span');
        subtitleSpan.className = 'subtitle';
        subtitleSpan.textContent = displaySubtitle;
        songItem.appendChild(subtitleSpan);
    }

    const difficultiesDiv = document.createElement('div');
    difficultiesDiv.className = 'difficulties';

    // Single difficulties
    if (song.single_difficulties) {
        for (const diff in song.single_difficulties) {
            if (Object.hasOwnProperty.call(song.single_difficulties, diff)) {
                const diffSpan = document.createElement('span');
                diffSpan.className = `difficulty difficulty-single ${diff.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                diffSpan.textContent = `${diff}: ${song.single_difficulties[diff]}`;
                difficultiesDiv.appendChild(diffSpan);
            }
        }
    }

    // Double difficulties
    if (song.double_difficulties) {
        for (const diff in song.double_difficulties) {
            if (Object.hasOwnProperty.call(song.double_difficulties, diff)) {
                const diffSpan = document.createElement('span');
                diffSpan.className = `difficulty difficulty-double ${diff.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                diffSpan.textContent = `D-${diff}: ${song.double_difficulties[diff]}`;
                difficultiesDiv.appendChild(diffSpan);
            }
        }
    }
    songItem.appendChild(difficultiesDiv);

    return songItem;
}

// Function to render songs within a given categoryContent div
// Now accepts an optional letterFilter
function renderSongsIntoCategory(categoryContentDiv, categorySongs, letterFilter = 'All') {
    // Clear existing content (important for re-rendering on filter changes or letter filter)
    categoryContentDiv.innerHTML = '';

    // Filter songs by letter if a filter is active
    let songsToDisplay = categorySongs;
    if (letterFilter !== 'All') {
        songsToDisplay = categorySongs.filter(song => {
            // Prioritize translit title for letter filtering
            const displayTitle = getText(song.title, song.title_translit);
            const firstChar = displayTitle.trim().charAt(0).toLowerCase();
            if (letterFilter === '#') {
                return !/[a-z]/.test(firstChar); // Check if it's not an alphabet character
            } else {
                return firstChar === letterFilter.toLowerCase();
            }
        });
    }

    if (songsToDisplay.length === 0) {
        const noSongsMessage = document.createElement('p');
        noSongsMessage.style.textAlign = 'center';
        noSongsMessage.style.padding = '10px 0';
        noSongsMessage.style.color = 'var(--color-dark-grey)';
        const lang = getCurrentLang();
        const t = songSearcherTranslations[lang];
        noSongsMessage.textContent = t.noSongsFoundLetter;
        categoryContentDiv.appendChild(noSongsMessage);
        return;
    }

    songsToDisplay.forEach(song => {
        const songItem = renderSongItem(song);
        categoryContentDiv.appendChild(songItem);
    });
}

// Function to create and attach the letter filter bar
function createLetterFilterBar(categoryContentDiv, categorySongs) {
    const filterBar = document.createElement('div');
    filterBar.className = 'letter-filter-bar';
    filterBar.dataset.currentFilter = 'All'; // Store the currently active filter

    // Create 'All' button
    const allButton = document.createElement('button');
    allButton.className = 'letter-filter-button active'; // 'All' is active by default
    allButton.textContent = 'All';
    allButton.dataset.filter = 'All';
    filterBar.appendChild(allButton);

    // Create A-Z buttons
    for (let i = 0; i < 26; i++) {
        const letter = String.fromCharCode(65 + i); // ASCII for 'A'
        const button = document.createElement('button');
        button.className = 'letter-filter-button';
        button.textContent = letter;
        button.dataset.filter = letter;
        filterBar.appendChild(button);
    }

    // Create '#' button for numbers/symbols
    const hashButton = document.createElement('button');
    hashButton.className = 'letter-filter-button';
    hashButton.textContent = '#';
    hashButton.dataset.filter = '#';
    filterBar.appendChild(hashButton);

    // Add click listener to the filter bar (event delegation)
    filterBar.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('letter-filter-button')) {
            // Remove active class from previously active button
            const currentActive = filterBar.querySelector('.letter-filter-button.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }

            // Add active class to clicked button
            target.classList.add('active');
            filterBar.dataset.currentFilter = target.dataset.filter; // Update active filter data

            // Re-render songs with the new letter filter
            renderSongsIntoCategory(categoryContentDiv, categorySongs, target.dataset.filter);
        }
    });

    return filterBar;
}


// Function to apply filters and render the categories and songs
function applyFilter() {
    console.log("Applying filter...");
    categoryListContainer.innerHTML = ''; // Clear current content

    const searchTerm = filterInput.value.trim().toLowerCase();
    const activeFilters = Array.from(filterTerms).map(term => term.toLowerCase());

    let categoriesToRender = {};

    // Iterate through each category in allSongsData
    for (const categoryName in allSongsData) {
        if (Object.hasOwnProperty.call(allSongsData, categoryName)) {
            const songsInCurrentCategory = allSongsData[categoryName];

            // Filter songs based on search term and active filter tags
            const filteredSongs = songsInCurrentCategory.filter(song => {
                // Use translit fields for filtering if available, otherwise original
                const title = getText(song.title, song.title_translit).toLowerCase();
                const artist = getText(song.artist, song.artist_translit).toLowerCase();
                const subtitle = getText(song.subtitle, song.subtitle_translit).toLowerCase();
                const mix = categoryName.toLowerCase(); // Use category name as mix

                // Check for search term match (title, artist, subtitle, mix)
                const matchesSearchTerm = searchTerm === '' ||
                                          title.includes(searchTerm) ||
                                          artist.includes(searchTerm) ||
                                          subtitle.includes(searchTerm) ||
                                          mix.includes(searchTerm);

                // Check for active filter tags match
                const matchesFilterTags = activeFilters.every(filterTag =>
                    title.includes(filterTag) ||
                    artist.includes(filterTag) ||
                    subtitle.includes(filterTag) ||
                    mix.includes(filterTag)
                );

                return matchesSearchTerm && matchesFilterTags;
            });

            if (filteredSongs.length > 0) {
                // Ensure songs within each category are sorted alphabetically by title
                filteredSongs.sort((a, b) => {
                    const titleA = getText(a.title, a.title_translit).toLowerCase(); // Use translit for sorting
                    const titleB = getText(b.title, b.title_translit).toLowerCase(); // Use translit for sorting
                    return titleA.localeCompare(titleB);
                });
                categoriesToRender[categoryName] = filteredSongs;
            }
        }
    }

    // Sort Categories Alphabetically
    let sortedCategoryNames = Object.keys(categoriesToRender).sort((a, b) => a.localeCompare(b));

    if (sortedCategoryNames.length === 0 && (searchTerm !== '' || activeFilters.length > 0)) {
        // Display a message if no results found after filtering
        const noResultsMessage = document.createElement('p');
        noResultsMessage.className = 'loading-message';
        const lang = getCurrentLang();
        const t = songSearcherTranslations[lang];
        noResultsMessage.textContent = t.noSongsFoundCriteria;
        categoryListContainer.appendChild(noResultsMessage);
        loadingMessage.textContent = ''; // Ensure no other loading message is visible
        return;
    } else if (sortedCategoryNames.length === 0 && searchTerm === '' && activeFilters.length === 0) {
         // If no categories loaded at all (e.g., initial load failure) and no filters are active
         const lang = getCurrentLang();
         const t = songSearcherTranslations[lang];
         loadingMessage.textContent = t.noSongsAvailable;
         return;
    }


    sortedCategoryNames.forEach(categoryName => {
        const categorySongs = categoriesToRender[categoryName];

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        // Store the category songs data on the div for easy access during toggle
        categoryDiv.dataset.categoryName = categoryName;

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `<h2>${categoryName}</h2><span class="song-count">(${categorySongs.length} songs)</span><i class="fas fa-chevron-down toggle-icon"></i>`;
        categoryDiv.appendChild(categoryHeader);

        const categoryContent = document.createElement('div');
        categoryContent.className = 'category-content';
        categoryDiv.appendChild(categoryContent);
        categoryListContainer.appendChild(categoryDiv);

        // Add toggle functionality
        categoryHeader.addEventListener('click', () => {
            const isExpanded = categoryContent.classList.contains('expanded');
            const icon = categoryHeader.querySelector('.toggle-icon');

            if (!isExpanded) {
                // Expanding: Render letter filter bar and then songs
                // Only create filter bar if it doesn't already exist
                if (!categoryContent.querySelector('.letter-filter-bar')) {
                    const letterFilterBar = createLetterFilterBar(categoryContent, categorySongs);
                    categoryContent.prepend(letterFilterBar); // Add at the top of category content
                }
                // Check currentFilter from existing filter bar or default to 'All'
                const currentLetterFilter = categoryContent.querySelector('.letter-filter-bar') ?
                                            categoryContent.querySelector('.letter-filter-bar').dataset.currentFilter : 'All';
                renderSongsIntoCategory(categoryContent, categorySongs, currentLetterFilter);

                categoryContent.classList.add('expanded');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                // Collapsing: Collapse, then clear content after transition
                categoryContent.classList.remove('expanded');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');

                // Clear content after transition to free up memory
                // Match this timeout to your CSS transition duration (0.5s)
                setTimeout(() => {
                    categoryContent.innerHTML = ''; // Clear songs and filter bar
                }, 500);
            }
        });
    });

    // Ensure loading message is clear if there are results
    if (sortedCategoryNames.length > 0) {
        loadingMessage.textContent = '';
    }
    console.log(`Rendered ${sortedCategoryNames.length} categories.`);
}


// Function to render filter tags
function renderFilterTags() {
    filterTagsContainer.innerHTML = ''; // Clear existing tags
    filterTerms.forEach(term => {
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.textContent = term;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-tag-btn';
        removeBtn.innerHTML = '&times;'; // 'times' character for close
        removeBtn.addEventListener('click', () => {
            filterTerms.delete(term);
            renderFilterTags(); // Re-render tags
            applyFilter();      // Re-apply filter
        });

        tag.appendChild(removeBtn);
        filterTagsContainer.appendChild(tag);
    });
    updateClearButtonVisibility(); // Update button visibility after rendering tags
}

// Function to update the visibility of the "Clear All Filters" button
function updateClearButtonVisibility() {
    // Show clear button if there are filter terms OR if there's text in the input
    if (filterTerms.size > 0 || filterInput.value.trim() !== '') {
        clearFiltersBtn.style.display = 'inline-flex'; // Use inline-flex for button styling
    } else {
        clearFiltersBtn.style.display = 'none';
    }
    console.log(`Clear button visibility updated. Filter terms size: ${filterTerms.size}. Input value: '${filterInput.value.trim()}'. Display: ${clearFiltersBtn.style.display}`);
}

// --- Event Listeners ---

// Add filter term on button click
addFilterBtn.addEventListener('click', () => {
    const term = filterInput.value.trim();
    if (term) {
        filterTerms.add(term);
        renderFilterTags(); // Renders tags and calls updateClearButtonVisibility
        applyFilter();
        filterInput.value = ''; // Clear input
    }
});

// Add filter term on Enter key press in input
filterInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const term = filterInput.value.trim();
        if (term) {
            filterTerms.add(term);
            renderFilterTags(); // Renders tags and calls updateClearButtonVisibility
            applyFilter();
            filterInput.value = ''; // Clear input
        }
    }
});

// Event listener for the Clear All Filters button
clearFiltersBtn.addEventListener('click', () => {
    filterTerms.clear(); // Clear all terms from the Set
    filterInput.value = ''; // Clear the input field as well
    renderFilterTags();  // Re-render to remove all tag elements (and hide clear button)
    applyFilter();       // Re-apply filter (will show all songs)
    // No explicit call to updateClearButtonVisibility here as renderFilterTags already calls it.
});

// Event listener for input changes to update clear button visibility and apply filter dynamically
filterInput.addEventListener('input', () => {
    updateClearButtonVisibility();
    applyFilter(); // Apply filter immediately as user types
});


// --- Game Selection Visual Feedback ---
// --- Game Selection Visual Feedback & Data Loading ---
document.addEventListener('DOMContentLoaded', function() {
    const gameButtons = document.querySelectorAll('.game-btn');
    gameButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            gameButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            const gameName = this.dataset.game;
            loadSongsForGame(gameName);
        });
    });
    // On initial load, show select a game message
    categoryListContainer.innerHTML = '';
    loadingMessage.textContent = songSearcherTranslations[getCurrentLang()].selectGameTitle;
});


// Listen for language changes from the main language switcher
const songSearchLanguageFlagButton = document.getElementById('language-flag');
if (songSearchLanguageFlagButton) {
    songSearchLanguageFlagButton.addEventListener('click', () => {
        setTimeout(() => {
            updateSongSearcherUI();
            applyFilter();
        }, 0);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateSongSearcherUI();
});
})();