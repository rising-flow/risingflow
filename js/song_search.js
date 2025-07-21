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
            const response = await fetch(`${dataFolder}${file}`);
            if (!response.ok) {
                console.error(`Failed to load ${file}: ${response.status} ${response.statusText}`);
                return null;
            }
            const data = await response.json();
            const categoryName = file.replace(/\.json$/, '');
            allSongsData[categoryName] = data;
            console.log(`Loaded ${file}. Songs count: ${data.length}`);
        });

        await Promise.all(fetchPromises);
        console.log("All fetch promises resolved. allSongsData:", allSongsData);
        
        if (Object.keys(allSongsData).length === 0) {
            loadingMessage.textContent = 'No song data loaded. Check console for fetch errors.';
            console.error("allSongsData is empty after loading. No files were successfully loaded or processed.");
        } else {
            loadingMessage.style.display = 'none'; // Hide loading message only if data loaded
            console.log("Loading message hidden.");
            renderCategories(); // Render after all data is loaded
            // Call updateClearButtonVisibility immediately after loading and rendering
            updateClearButtonVisibility(); 
        }
    } catch (error) {
        console.error("CRITICAL ERROR loading song data:", error);
        loadingMessage.textContent = 'Critical error loading songs. Check console for details.';
    }
}

// Function to render a single filter tag
function renderFilterTag(term) {
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('filter-tag');
    const textSpan = document.createElement('span');
    textSpan.textContent = term;
    tagDiv.appendChild(textSpan);

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-tag');
    removeBtn.innerHTML = '&times;';
    removeBtn.setAttribute('aria-label', `Remove filter: ${term}`);
    removeBtn.addEventListener('click', () => {
        filterTerms.delete(term);
        renderFilterTags(); // This will re-render all tags and call updateClearButtonVisibility
        applyFilter();
    });

    tagDiv.appendChild(removeBtn);
    filterTagsContainer.appendChild(tagDiv);
}

// Function to render all filter tags
function renderFilterTags() {
    filterTagsContainer.innerHTML = '';
    filterTerms.forEach(term => renderFilterTag(term));
    // Crucial: Call updateClearButtonVisibility every time filter tags are re-rendered
    updateClearButtonVisibility();
}

// Function to apply the current filter to all songs
function applyFilter() {
    console.log("Applying filter. Current filter terms:", Array.from(filterTerms).join(', '));
    renderCategories();
}

// Function to render (or re-render) all categories and their songs
function renderCategories() {
    console.log("Starting renderCategories...");
    categoryListContainer.innerHTML = ''; // Clear previous categories

    if (Object.keys(allSongsData).length === 0) {
        console.log("No categories in allSongsData. Not rendering categories.");
        return;
    }

    let categoriesRendered = 0;
    for (const categoryName in allSongsData) {
        console.log(`Processing category: ${categoryName}`);
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category-item');

        const filteredSongs = getFilteredSongs(categoryName);
        const totalSongs = allSongsData[categoryName].length;

        console.log(`Category: ${categoryName}, Filtered Songs: ${filteredSongs.length}, Total Songs: ${totalSongs}`);

        const categoryHeader = document.createElement('div');
        categoryHeader.classList.add('category-header');
        categoryHeader.innerHTML = `
            <span>${categoryName}</span>
            <span class="song-count">(${filteredSongs.length} / ${totalSongs})</span>
        `;
        categoryDiv.appendChild(categoryHeader);

        const categoryContent = document.createElement('div');
        categoryContent.classList.add('category-content');
        categoryDiv.appendChild(categoryContent);

        const sortedSongsInCurrentCategory = [...filteredSongs].sort((a, b) => {
            const artistA = (a.artist_translit || a.artist || '').toLowerCase();
            const artistB = (b.artist_translit || b.artist || '').toLowerCase();
            return artistA.localeCompare(artistB);
        });

        if (sortedSongsInCurrentCategory.length > 0) {
            sortedSongsInCurrentCategory.forEach(song => {
                const songItem = document.createElement('div');
                songItem.classList.add('song-item');

                const title = getText(song.title);
                const titleTranslit = getText(song.title_translit);
                const artist = getText(song.artist);
                const artistTranslit = getText(song.artist_translit);
                const subtitle = getText(song.subtitle);
                const subtitleTranslit = getText(song.subtitle_translit);

                let displayTitle = title;
                if (titleTranslit && titleTranslit.toLowerCase() !== title.toLowerCase()) {
                    displayTitle = `${title} (${titleTranslit})`;
                }

                let displayArtist = artist;
                if (artistTranslit && artistTranslit.toLowerCase() !== artist.toLowerCase()) {
                    displayArtist = `${artist} (${artistTranslit})`;
                } else if (!displayArtist) {
                     displayArtist = "Unknown Artist";
                }

                let displaySubtitle = subtitle;
                if (subtitleTranslit && subtitleTranslit.toLowerCase() !== subtitle.toLowerCase()) {
                    displaySubtitle = `${subtitle} (${subtitleTranslit})`;
                }
                if (displaySubtitle) {
                    displaySubtitle = `<div class="subtitle">${displaySubtitle}</div>`;
                } else {
                    displaySubtitle = '';
                }

                // Prepare difficulties
                let difficultiesHtml = '';
                const difficultyLevels = ['Beginner', 'Easy', 'Medium', 'Hard', 'Challenge'];

                const singleDiffs = song.single_difficulties || {};
                const doubleDiffs = song.double_difficulties || {};

                difficultyLevels.forEach(level => {
                    if (singleDiffs[level] !== undefined) {
                        difficultiesHtml += `<span class="difficulty-level">S ${level}: ${singleDiffs[level]}</span>`;
                    }
                });
                difficultyLevels.forEach(level => {
                    if (doubleDiffs[level] !== undefined) {
                        difficultiesHtml += `<span class="difficulty-level">D ${level}: ${doubleDiffs[level]}</span>`;
                    }
                });

                songItem.innerHTML = `
                    <div class="title">${displayTitle}</div>
                    <div class="artist">Artist: ${displayArtist}</div>
                    ${displaySubtitle}
                    <div class="difficulties">${difficultiesHtml}</div>
                `;
                categoryContent.appendChild(songItem);
            });
            categoriesRendered++;
        } else {
            categoryContent.innerHTML = '<div style="padding: 10px; text-align: center; color: var(--color-dark-grey);">No songs found matching filters in this category.</div>';
        }

        // Toggle functionality
        categoryHeader.addEventListener('click', () => {
            categoryContent.classList.toggle('expanded');
        });

        categoryListContainer.appendChild(categoryDiv);
    }
    if (categoriesRendered === 0 && Object.keys(allSongsData).length > 0) {
        console.log("No songs rendered across all categories, but data exists.");
        if (filterTerms.size === 0) {
             categoryListContainer.innerHTML = '<div style="text-align: center; padding: 50px; color: var(--color-dark-grey);">No songs found. Please check your JSON data structure or console for errors.</div>';
        }
    }
    console.log("Finished renderCategories.");
}

// Function to get filtered songs for a given category
function getFilteredSongs(categoryName) {
    const songs = allSongsData[categoryName];
    if (!songs) {
        console.warn(`Category '${categoryName}' not found in allSongsData.`);
        return [];
    }

    if (filterTerms.size === 0) {
        return songs; // Return all songs if no filter
    }

    const lowerCaseFilterTerms = Array.from(filterTerms).map(term => term.toLowerCase());

    return songs.filter(song => {
        const searchableFields = [
            getText(song.title),
            getText(song.subtitle),
            getText(song.artist),
            getText(song.title_translit),
            getText(song.subtitle_translit),
            getText(song.artist_translit)
        ].join(' ').toLowerCase();

        return lowerCaseFilterTerms.every(term => searchableFields.includes(term));
    });
}

// Function to manage the visibility of the "Clear All" button
function updateClearButtonVisibility() {
    // Show the button if there are any filter terms, otherwise hide it.
    if (filterTerms.size > 0) {
        clearFiltersBtn.style.display = 'flex';
    } else {
        clearFiltersBtn.style.display = 'none';
    }
    console.log(`Clear button visibility updated. Filter terms size: ${filterTerms.size}. Display: ${clearFiltersBtn.style.display}`);
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
    renderFilterTags();  // Re-render to remove all tag elements (and hide clear button)
    applyFilter();       // Re-apply filter (will show all songs)
    // No explicit call to updateClearButtonVisibility here as renderFilterTags already calls it.
});


// Initial load of songs when the page loads
window.onload = loadAllSongs;