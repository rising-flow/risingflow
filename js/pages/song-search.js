/**
 * Song Search Page Entry Point
 * Handles song searching and filtering functionality
 */

import { loadSongsForGame, getStepmaniaOrder, getText, getGameType } from '../services/SongService.js';

class SongSearchPage {
    constructor() {
        this.allSongsData = {};
        this.filterTerms = new Set();
        this.stepmaniaCategoryOrder = [];
        
        this.initializeElements();
        this.setupEventListeners();
        this.setupTranslations();
        this.init();
    }

    initializeElements() {
        this.filterInput = document.getElementById('filter-input');
        this.addFilterBtn = document.getElementById('add-filter-btn');
        this.filterTagsContainer = document.getElementById('filter-tags');
        this.categoryListContainer = document.getElementById('category-list');
        this.loadingMessage = document.getElementById('loading-message');
        this.clearFiltersBtn = document.getElementById('clear-filters-btn');
        this.searchUIWrapper = document.getElementById('search-ui-wrapper');
    }

    setupTranslations() {
        this.translations = {
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
                songsLabel: 'músicas'
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
                songsLabel: 'songs'
            }
        };
    }

    init() {
        this.setupGameSelection();
        this.updateUI();
        
        // On initial load, show select a game message
        if (this.categoryListContainer) {
            this.categoryListContainer.innerHTML = '';
        }
        if (this.loadingMessage) {
            this.loadingMessage.textContent = this.getTranslations().selectGameTitle;
        }
        if (this.searchUIWrapper) {
            this.searchUIWrapper.classList.remove('visible');
        }
    }

    getCurrentLang() {
        return window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
    }

    getTranslations() {
        return this.translations[this.getCurrentLang()];
    }

    updateUI() {
        const t = this.getTranslations();
        
        document.title = t.pageTitle;
        
        const searchPageTitle = document.getElementById('search-page-title');
        if (searchPageTitle) searchPageTitle.textContent = t.searchPageTitle;
        
        if (this.filterInput) this.filterInput.placeholder = t.filterPlaceholder;
        if (this.addFilterBtn) this.addFilterBtn.title = t.addFilterTitle;
        if (this.clearFiltersBtn) this.clearFiltersBtn.title = t.clearFiltersTitle;
        
        const gameSelTitle = document.querySelector('.game-selection h2');
        if (gameSelTitle) gameSelTitle.textContent = t.selectGameTitle;
    }

    setupGameSelection() {
        const gameButtons = document.querySelectorAll('.game-btn');
        
        gameButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                // Update button states
                gameButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                
                // Load songs for selected game
                const gameName = btn.dataset.game;
                await this.loadSongsForGame(gameName);
                
                // Show search UI
                if (this.searchUIWrapper) {
                    this.searchUIWrapper.classList.add('visible');
                }
            });
        });
    }

    async loadSongsForGame(gameName) {
        try {
            // Clear existing data
            this.allSongsData = {};
            this.filterTerms.clear();
            
            if (this.filterInput) this.filterInput.value = '';
            this.renderFilterTags();
            if (this.categoryListContainer) this.categoryListContainer.innerHTML = '';
            
            const t = this.getTranslations();
            if (this.loadingMessage) this.loadingMessage.textContent = t.loadingSongs;

            // Load songs using service
            this.allSongsData = await loadSongsForGame(gameName);
            this.stepmaniaCategoryOrder = getStepmaniaOrder();

            if (this.loadingMessage) this.loadingMessage.textContent = '';
            this.applyFilter();
        } catch (error) {
            console.error('Error loading songs:', error);
            const t = this.getTranslations();
            if (this.loadingMessage) this.loadingMessage.textContent = t.noSongsAvailable;
        }
    }

    setupEventListeners() {
        // Add filter term on button click
        if (this.addFilterBtn) {
            this.addFilterBtn.addEventListener('click', () => this.addFilterTerm());
        }

        // Add filter term on Enter key press
        if (this.filterInput) {
            this.filterInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addFilterTerm();
                }
            });

            // Apply filter as user types
            this.filterInput.addEventListener('input', () => {
                this.updateClearButtonVisibility();
                this.applyFilter();
            });
        }

        // Clear all filters
        if (this.clearFiltersBtn) {
            this.clearFiltersBtn.addEventListener('click', () => {
                this.filterTerms.clear();
                if (this.filterInput) this.filterInput.value = '';
                this.renderFilterTags();
                this.applyFilter();
            });
        }
    }

    addFilterTerm() {
        if (!this.filterInput) return;
        
        const term = this.filterInput.value.trim();
        if (term) {
            this.filterTerms.add(term);
            this.renderFilterTags();
            this.applyFilter();
            this.filterInput.value = '';
        }
    }

    renderFilterTags() {
        if (!this.filterTagsContainer) return;
        
        this.filterTagsContainer.innerHTML = '';
        
        this.filterTerms.forEach(term => {
            const tag = document.createElement('span');
            tag.className = 'filter-tag';
            tag.textContent = term;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-tag-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', () => {
                this.filterTerms.delete(term);
                this.renderFilterTags();
                this.applyFilter();
            });

            tag.appendChild(removeBtn);
            this.filterTagsContainer.appendChild(tag);
        });
        
        this.updateClearButtonVisibility();
    }

    updateClearButtonVisibility() {
        if (!this.clearFiltersBtn || !this.filterInput) return;
        
        const hasFilters = this.filterTerms.size > 0 || this.filterInput.value.trim() !== '';
        this.clearFiltersBtn.style.display = hasFilters ? 'inline-flex' : 'none';
    }

    applyFilter() {
        if (!this.categoryListContainer) return;
        
        this.categoryListContainer.innerHTML = '';

        const searchTerm = this.filterInput ? this.filterInput.value.trim().toLowerCase() : '';
        const activeFilters = Array.from(this.filterTerms).map(term => term.toLowerCase());

        let categoriesToRender = {};

        // Filter songs by category
        for (const categoryName in this.allSongsData) {
            if (this.allSongsData.hasOwnProperty(categoryName)) {
                const songsInCategory = this.allSongsData[categoryName];
                
                const filteredSongs = songsInCategory.filter(song => {
                    const gameType = getGameType(song);
                    
                    const title = getText(song.title, song.title_translit).toLowerCase();
                    const artist = getText(song.artist, song.artist_translit).toLowerCase();
                    const subtitle = getText(song.subtitle, song.subtitle_translit).toLowerCase();
                    const mix = categoryName.toLowerCase();
                    const album = (gameType === 'YARG' && song.album) ? song.album.toLowerCase() : '';

                    const matchesSearchTerm = searchTerm === '' ||
                                              title.includes(searchTerm) ||
                                              artist.includes(searchTerm) ||
                                              subtitle.includes(searchTerm) ||
                                              mix.includes(searchTerm) ||
                                              album.includes(searchTerm);

                    const matchesFilterTags = activeFilters.every(filterTag =>
                        title.includes(filterTag) ||
                        artist.includes(filterTag) ||
                        subtitle.includes(filterTag) ||
                        mix.includes(filterTag) ||
                        album.includes(filterTag)
                    );

                    return matchesSearchTerm && matchesFilterTags;
                });

                if (filteredSongs.length > 0) {
                    filteredSongs.sort((a, b) => {
                        const titleA = getText(a.title, a.title_translit).toLowerCase();
                        const titleB = getText(b.title, b.title_translit).toLowerCase();
                        return titleA.localeCompare(titleB);
                    });
                    categoriesToRender[categoryName] = filteredSongs;
                }
            }
        }

        // Sort categories
        let sortedCategoryNames;
        const isStepmania = this.stepmaniaCategoryOrder.length > 0 && 
                           Object.keys(categoriesToRender).some(cat => this.stepmaniaCategoryOrder.includes(cat));
        
        if (isStepmania) {
            sortedCategoryNames = this.stepmaniaCategoryOrder.filter(cat => categoriesToRender.hasOwnProperty(cat));
        } else {
            sortedCategoryNames = Object.keys(categoriesToRender).sort((a, b) => a.localeCompare(b));
        }

        // Handle no results
        if (sortedCategoryNames.length === 0) {
            const t = this.getTranslations();
            const noResultsMessage = document.createElement('p');
            noResultsMessage.className = 'loading-message';
            
            if (searchTerm !== '' || activeFilters.length > 0) {
                noResultsMessage.textContent = t.noSongsFoundCriteria;
            } else {
                noResultsMessage.textContent = t.noSongsAvailable;
            }
            
            this.categoryListContainer.appendChild(noResultsMessage);
            if (this.loadingMessage) this.loadingMessage.textContent = '';
            return;
        }

        // Render categories
        sortedCategoryNames.forEach(categoryName => {
            const categorySongs = categoriesToRender[categoryName];
            const categoryDiv = this.createCategoryElement(categoryName, categorySongs);
            this.categoryListContainer.appendChild(categoryDiv);
        });

        if (this.loadingMessage) this.loadingMessage.textContent = '';
    }

    createCategoryElement(categoryName, categorySongs) {
        const t = this.getTranslations();
        
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.dataset.categoryName = categoryName;

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `
            <h2>${categoryName}</h2>
            <span class="song-count">(${categorySongs.length} ${t.songsLabel})</span>
            <i class="fas fa-chevron-down toggle-icon"></i>
        `;
        categoryDiv.appendChild(categoryHeader);

        const categoryContent = document.createElement('div');
        categoryContent.className = 'category-content';
        categoryDiv.appendChild(categoryContent);

        // Add toggle functionality
        categoryHeader.addEventListener('click', () => {
            const isExpanded = categoryContent.classList.contains('expanded');
            const icon = categoryHeader.querySelector('.toggle-icon');

            if (!isExpanded) {
                // Expanding: add letter filter and render songs
                if (!categoryContent.querySelector('.letter-filter-bar')) {
                    const letterFilterBar = this.createLetterFilterBar(categoryContent, categorySongs);
                    categoryContent.prepend(letterFilterBar);
                }
                
                const currentLetterFilter = categoryContent.querySelector('.letter-filter-bar')?.dataset.currentFilter || 'All';
                this.renderSongsIntoCategory(categoryContent, categorySongs, currentLetterFilter);

                categoryContent.classList.add('expanded');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                // Collapsing
                categoryContent.classList.remove('expanded');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');

                setTimeout(() => {
                    categoryContent.innerHTML = '';
                }, 300);
            }
        });

        return categoryDiv;
    }

    createLetterFilterBar(categoryContentDiv, categorySongs) {
        const filterBar = document.createElement('div');
        filterBar.className = 'letter-filter-bar';
        filterBar.dataset.currentFilter = 'All';

        // Create 'All' button
        const allButton = document.createElement('button');
        allButton.className = 'letter-filter-button active';
        allButton.textContent = 'All';
        allButton.dataset.filter = 'All';
        filterBar.appendChild(allButton);

        // Create A-Z buttons
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(65 + i);
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

        // Add click listener
        filterBar.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('letter-filter-button')) {
                const currentActive = filterBar.querySelector('.letter-filter-button.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }

                target.classList.add('active');
                filterBar.dataset.currentFilter = target.dataset.filter;

                this.renderSongsIntoCategory(categoryContentDiv, categorySongs, target.dataset.filter);
            }
        });

        return filterBar;
    }

    renderSongsIntoCategory(categoryContentDiv, categorySongs, letterFilter = 'All') {
        // Clear existing songs (but keep filter bar)
        const filterBar = categoryContentDiv.querySelector('.letter-filter-bar');
        categoryContentDiv.innerHTML = '';
        if (filterBar) {
            categoryContentDiv.appendChild(filterBar);
        }

        let songsToDisplay = categorySongs;
        if (letterFilter !== 'All') {
            songsToDisplay = categorySongs.filter(song => {
                const displayTitle = getText(song.title, song.title_translit);
                const firstChar = displayTitle.trim().charAt(0).toLowerCase();
                
                if (letterFilter === '#') {
                    return !/[a-z]/.test(firstChar);
                } else {
                    return firstChar === letterFilter.toLowerCase();
                }
            });
        }

        if (songsToDisplay.length === 0) {
            const t = this.getTranslations();
            const noSongsMessage = document.createElement('p');
            noSongsMessage.style.textAlign = 'center';
            noSongsMessage.style.padding = '10px 0';
            noSongsMessage.style.color = 'var(--color-dark-grey)';
            noSongsMessage.textContent = t.noSongsFoundLetter;
            categoryContentDiv.appendChild(noSongsMessage);
            return;
        }

        songsToDisplay.forEach(song => {
            const songItem = this.createSongItem(song);
            categoryContentDiv.appendChild(songItem);
        });
    }

    createSongItem(song) {
        const gameType = getGameType(song);
        const songItem = document.createElement('div');
        songItem.className = 'song-item';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'title';
        titleSpan.textContent = getText(song.title, song.title_translit);
        songItem.appendChild(titleSpan);

        // For YARG, don't show artist since it's already the category
        if (gameType !== 'YARG') {
            const artistSpan = document.createElement('span');
            artistSpan.className = 'artist';
            artistSpan.textContent = getText(song.artist, song.artist_translit);
            songItem.appendChild(artistSpan);
        }

        // For YARG, show album instead of subtitle
        if (gameType === 'YARG' && song.album) {
            const albumSpan = document.createElement('span');
            albumSpan.className = 'subtitle';
            albumSpan.textContent = song.album;
            songItem.appendChild(albumSpan);
        } else {
            const displaySubtitle = getText(song.subtitle, song.subtitle_translit);
            if (displaySubtitle) {
                const subtitleSpan = document.createElement('span');
                subtitleSpan.textContent = displaySubtitle;
                songItem.appendChild(subtitleSpan);
            }
        }

        const difficultiesDiv = this.createDifficultiesElement(song, gameType);
        songItem.appendChild(difficultiesDiv);

        return songItem;
    }

    createDifficultiesElement(song, gameType) {
        const difficultiesDiv = document.createElement('div');
        difficultiesDiv.className = 'difficulties';

        if (gameType === 'YARG' && song.difficulties) {
            this.renderYARGDifficulties(difficultiesDiv, song);
        } else if (song.single_difficulties || song.double_difficulties) {
            this.renderStepmaniaDigfficulties(difficultiesDiv, song);
        } else if (song.difficulties) {
            this.renderOtherDifficulties(difficultiesDiv, song);
        }

        return difficultiesDiv;
    }

    renderYARGDifficulties(container, song) {
        const yargDiffs = [];
        const yargOrder = ['guitar', 'bass', 'drums', 'vocals', 'vocals_harmony'];
        
        for (const diff of yargOrder) {
            if (song.difficulties[diff] !== undefined && song.difficulties[diff] !== -1) {
                yargDiffs.push(`${diff.charAt(0).toUpperCase() + diff.slice(1)}: ${song.difficulties[diff]}`);
            }
        }
        
        if (song.pro_drums) {
            yargDiffs.push('Pro Drums: Yes');
        }
        
        if (yargDiffs.length > 0) {
            const yargSpan = document.createElement('span');
            yargSpan.className = 'difficulty difficulty-yarg';
            yargSpan.textContent = yargDiffs.join(' | ');
            container.appendChild(yargSpan);
        }
    }

    renderStepmaniaDigfficulties(container, song) {
        const stepmaniaOrder = ['Beginner', 'Easy', 'Medium', 'Hard', 'Challenge'];

        // Render single difficulties
        if (song.single_difficulties) {
            const singleDiffs = [];
            for (const diff of stepmaniaOrder) {
                if (song.single_difficulties[diff] && 
                    song.single_difficulties[diff] !== 'N/A' && 
                    song.single_difficulties[diff] !== 'Not available') {
                    singleDiffs.push(`${diff}: ${song.single_difficulties[diff]}`);
                }
            }
            if (singleDiffs.length > 0) {
                const singleSpan = document.createElement('span');
                singleSpan.className = 'difficulty difficulty-single';
                singleSpan.textContent = 'Single: ' + singleDiffs.join(' | ');
                container.appendChild(singleSpan);
            }
        }

        // Render double difficulties
        if (song.double_difficulties) {
            const doubleDiffs = [];
            for (const diff of stepmaniaOrder) {
                if (song.double_difficulties[diff] && 
                    song.double_difficulties[diff] !== 'N/A' && 
                    song.double_difficulties[diff] !== 'Not available') {
                    doubleDiffs.push(`${diff}: ${song.double_difficulties[diff]}`);
                }
            }
            if (doubleDiffs.length > 0) {
                if (container.childNodes.length > 0) {
                    container.appendChild(document.createElement('br'));
                }
                const doubleSpan = document.createElement('span');
                doubleSpan.className = 'difficulty difficulty-double';
                doubleSpan.textContent = 'Doubles: ' + doubleDiffs.join(' | ');
                container.appendChild(doubleSpan);
            }
        }
    }

    renderOtherDifficulties(container, song) {
        const otherDiffs = [];
        for (const diff in song.difficulties) {
            if (Object.hasOwnProperty.call(song.difficulties, diff)) {
                const value = song.difficulties[diff];
                if (value && value !== 'N/A' && value !== 'Not available') {
                    otherDiffs.push(`${diff}: ${value}`);
                }
            }
        }
        if (otherDiffs.length > 0) {
            const otherSpan = document.createElement('span');
            otherSpan.className = 'difficulty difficulty-other';
            otherSpan.textContent = otherDiffs.join(' | ');
            container.appendChild(otherSpan);
        }
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const songSearchPage = new SongSearchPage();
    
    // Make update function available globally for language switcher
    window.updateSongSearcherUI = () => songSearchPage.updateUI();
});