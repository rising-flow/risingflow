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

// Function to safely get text content from a potentially null field
function getText(field) {
    return field || ''; // Return empty string if null/undefined
}

// Function to load all JSON files
async function loadAllSongs() {
    console.log("Starting loadAllSongs...");
    loadingMessage.textContent = 'Loading songs...';
    categoryListContainer.innerHTML = ''; // Clear previous content

    const dataFolder = 'data/';
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
        'Dance Dance Revolution Wii Exclusives.json',
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

    try {
        const fetchPromises = jsonFiles.map(async file => {
            const response = await fetch(dataFolder + file);
            if (!response.ok) {
                console.error(`Failed to load ${file}: ${response.statusText}`);
                return null;
            }
            const data = await response.json();
            // Use the filename (without .json) as the category name
            const categoryName = file.replace('.json', '');
            allSongsData[categoryName] = data;
            return { categoryName, data };
        });

        const results = await Promise.all(fetchPromises);
        console.log("All JSON files loaded successfully.");
        loadingMessage.textContent = ''; // Hide loading message
        applyFilter(); // Initial render after loading
    } catch (error) {
        console.error("CRITICAL ERROR loading song data:", error);
        loadingMessage.textContent = 'Failed to load song data. Please try again later.';
    }
}

// Function to render song items
function renderSongItem(song) {
    const songItem = document.createElement('div');
    songItem.className = 'song-item';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'title';
    titleSpan.textContent = getText(song.title);
    songItem.appendChild(titleSpan);

    const artistSpan = document.createElement('span');
    artistSpan.className = 'artist';
    artistSpan.textContent = getText(song.artist);
    songItem.appendChild(artistSpan);

    if (song.subtitle) {
        const subtitleSpan = document.createElement('span');
        subtitleSpan.className = 'subtitle';
        subtitleSpan.textContent = getText(song.subtitle);
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
                const title = getText(song.title).toLowerCase();
                const artist = getText(song.artist).toLowerCase();
                const subtitle = getText(song.subtitle).toLowerCase();
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
        noResultsMessage.textContent = 'No songs found matching your criteria.';
        categoryListContainer.appendChild(noResultsMessage);
        loadingMessage.textContent = ''; // Ensure no other loading message is visible
        return;
    } else if (sortedCategoryNames.length === 0 && searchTerm === '' && activeFilters.length === 0) {
         // If no categories loaded at all (e.g., initial load failure) and no filters are active
         loadingMessage.textContent = 'No songs available.';
         return;
    }


    sortedCategoryNames.forEach(categoryName => {
        const categorySongs = categoriesToRender[categoryName];

        // Sort Songs Alphabetically within each category
        categorySongs.sort((a, b) => {
            const titleA = getText(a.title).toLowerCase();
            const titleB = getText(b.title).toLowerCase();
            return titleA.localeCompare(titleB);
        });

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        // Initial icon should be fa-chevron-down for collapsed state
        categoryHeader.innerHTML = `<h2>${categoryName}</h2><span class="song-count">(${categorySongs.length} songs)</span><i class="fas fa-chevron-down toggle-icon"></i>`;
        categoryDiv.appendChild(categoryHeader);

        const categoryContent = document.createElement('div');
        categoryContent.className = 'category-content';
        // REMOVED: categoryContent.classList.add('expanded'); // No longer start expanded

        categorySongs.forEach(song => {
            const songItem = renderSongItem(song);
            categoryContent.appendChild(songItem);
        });

        categoryDiv.appendChild(categoryContent);
        categoryListContainer.appendChild(categoryDiv);

        // Add toggle functionality
        categoryHeader.addEventListener('click', () => {
            categoryContent.classList.toggle('expanded');
            const icon = categoryHeader.querySelector('.toggle-icon');
            if (categoryContent.classList.contains('expanded')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
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


// Initial load of songs when the page loads
loadAllSongs();