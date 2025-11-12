/**
 * LanguageSwitcher - Manages language switching functionality
 * This component handles language state and translations across the application.
 */

// Text content for different languages
const translations = {
    'pt-BR': {
        pageTitle: 'Rising Flow - Início',
        productsLink: 'Produtos',
        eventsLink: 'Eventos',
        songSearchLink: 'Buscador de Músicas',
        contactLink: 'Contato',
        heroTitle: 'Bem-vindo ao Rising Flow!',
        heroDescription: 'Mergulhe no ritmo, aceite o desafio e experimente a melhor comunidade de jogos de música e dança. De batidas clássicas aos maiores sucessos, trazemos a experiência do arcade para você.',
        learnMoreButton: 'Saiba Mais',
        aboutHeading: 'Sobre a Rising Flow',
        aboutMusicTitle: 'Vasta Biblioteca de Músicas',
        aboutMusicDesc: 'Explore milhares de músicas de vários gêneros e artistas, constantemente atualizadas para manter seus pés em movimento.',
        aboutCommunityTitle: 'Comunidade Próspera',
        aboutCommunityDesc: 'Junte-se a uma comunidade apaixonada por jogos de ritmo. Compartilhe pontuações, dicas e participe de eventos online.',
        aboutEventsTitle: 'Eventos Emocionantes',
        aboutEventsDesc: 'Compita em torneios, participe de workshops e conecte-se com outros jogadores em nossos emocionantes eventos.',
        // Event pages translations
        eventsPageTitle: 'Eventos Rising Flow',
        upcomingEventsTitle: 'Próximos Eventos',
        upcomingTabText: 'Próximos Eventos',
        pastEventsTitle: 'Eventos Passados',
        pastTabText: 'Eventos Passados',
        noEventsMessage: 'Não há mais eventos programados no momento.',
        checkBackMessage: 'Volte sempre para ver novos eventos!',
        pastEventsMessage: 'Esses foram alguns dos nossos eventos mais recentes.',
        stayTunedMessage: 'Fique atento aos próximos eventos!',
        // Event card translations
        website: 'Website',
        details: 'Detalhes',
        winner: 'Vencedor',
        participants: 'participantes',
        viewGallery: 'Ver Galeria',
        highlights: 'Destaques',
        // Pixel Block translations
        pixelBlockLink: 'Pixel Block',
        pixelBlockModalTitle: 'Comprou um Pixel Block?',
        pixelBlockModalBody: 'Você comprou um Pixel Block? Clique no botão abaixo para navegar até a página e selecionar o personagem para montar. Caso contrário, clique no X para fechar o modal.',
        pixelBlockModalButton: 'Ir para Pixel Block'
    },
    'en-GB': { // UK English
        pageTitle: 'Rising Flow - Home',
        productsLink: 'Products',
        eventsLink: 'Events',
        songSearchLink: 'Song Searcher',
        contactLink: 'Contact',
        heroTitle: 'Welcome to Rising Flow!',
        heroDescription: 'Dive into the rhythm, embrace the challenge, and experience the ultimate music and dance game community. From classic beats to the latest hits, we bring the arcade experience to you.',
        learnMoreButton: 'Learn More',
        aboutHeading: 'About Rising Flow',
        aboutMusicTitle: 'Vast Music Library',
        aboutMusicDesc: 'Explore thousands of songs from various genres and artists, constantly updated to keep your feet moving.',
        aboutCommunityTitle: 'Thriving Community',
        aboutCommunityDesc: 'Join a passionate community of rhythm game enthusiasts. Share scores, tips, and participate in online events.',
        aboutEventsTitle: 'Exciting Events',
        aboutEventsDesc: 'Compete in tournaments, attend workshops, and connect with fellow players at our thrilling events.',
        // Event pages translations
        eventsPageTitle: 'Rising Flow Events',
        upcomingEventsTitle: 'Upcoming Events',
        upcomingTabText: 'Upcoming Events',
        pastEventsTitle: 'Past Events',
        pastTabText: 'Past Events',
        noEventsMessage: 'No more events scheduled at the moment.',
        checkBackMessage: 'Check back often for new events!',
        pastEventsMessage: 'These were some of our most recent events.',
        stayTunedMessage: 'Stay tuned for upcoming events!',
        // Event card translations
        website: 'Website',
        details: 'Details',
        winner: 'Winner',
        participants: 'participants',
        viewGallery: 'View Gallery',
        highlights: 'Highlights',
        // Pixel Block translations
        pixelBlockLink: 'Pixel Block',
        pixelBlockModalTitle: 'Did you buy a Pixel Block?',
        pixelBlockModalBody: 'Did you buy a Pixel Block? Click the button below to navigate to the page and select the character to assemble. Otherwise, click the X to close the modal.',
        pixelBlockModalButton: 'Go to Pixel Block'
    }
};

class LanguageSwitcher {
    constructor() {
        this.currentLang = 'pt-BR'; // Default language
        this.languageFlagButton = document.getElementById('language-flag');
        this.htmlElement = document.querySelector('html');
        this.pageUpdateCallbacks = [];
        
        // Make translations and current language globally accessible
        window.getCurrentLang = () => this.currentLang;
        window.translations = translations;
        
        this.init();
    }

    init() {
        if (this.languageFlagButton) {
            this.languageFlagButton.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Initialize content and flag on first load
        this.updateContent();
        this.updateFlagButton();
        this.notifyPageUpdaters();
    }

    toggleLanguage() {
        this.currentLang = (this.currentLang === 'pt-BR') ? 'en-GB' : 'pt-BR';
        this.updateContent();
        this.updateFlagButton();
        this.notifyPageUpdaters();
    }

    updateContent() {
        if (this.htmlElement) {
            this.htmlElement.lang = this.currentLang;
        }
        
        document.title = translations[this.currentLang].pageTitle;

        const t = translations[this.currentLang];

        // Navigation
        this.updateElement('products-link-text', t.productsLink);
        this.updateElement('events-link-text', t.eventsLink);
        this.updateElement('song-search-link', t.songSearchLink);
        this.updateElement('contact-link', t.contactLink);

        // Hero Section
        this.updateElement('hero-title', t.heroTitle);
        this.updateElement('hero-description', t.heroDescription);
        this.updateElement('learn-more-button', t.learnMoreButton);

        // About Section
        this.updateElement('about-heading', t.aboutHeading);
        this.updateElement('about-music-title', t.aboutMusicTitle);
        this.updateElement('about-music-desc', t.aboutMusicDesc);
        this.updateElement('about-community-title', t.aboutCommunityTitle);
        this.updateElement('about-community-desc', t.aboutCommunityDesc);
        this.updateElement('about-events-title', t.aboutEventsTitle);
        this.updateElement('about-events-desc', t.aboutEventsDesc);
        
        // Events page elements
        this.updateElement('events-page-title', t.eventsPageTitle);
        this.updateElement('upcoming-tab-text', t.upcomingTabText);
        this.updateElement('past-tab-text', t.pastTabText);
        
        // Pixel Block elements
        this.updateElement('pixel-block-link', t.pixelBlockLink);
        this.updateElement('pixelBlockModalLabel', t.pixelBlockModalTitle);
        
        const pixelBlockModalBody = document.querySelector('#pixelBlockModal .modal-body p');
        if (pixelBlockModalBody) pixelBlockModalBody.textContent = t.pixelBlockModalBody;
        
        const pixelBlockModalButton = document.querySelector('#pixelBlockModal .modal-footer .btn');
        if (pixelBlockModalButton) pixelBlockModalButton.textContent = t.pixelBlockModalButton;
    }

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    updateFlagButton() {
        if (!this.languageFlagButton) return;
        
        if (this.currentLang === 'pt-BR') {
            this.languageFlagButton.dataset.lang = 'en-GB';
            this.languageFlagButton.innerHTML = '<span class="fi fi-gb" title="Switch to English"></span>';
        } else {
            this.languageFlagButton.dataset.lang = 'pt-BR';
            this.languageFlagButton.innerHTML = '<span class="fi fi-br" title="Mudar para Português"></span>';
        }
    }

    notifyPageUpdaters() {
        // Call page-specific update functions if they exist
        if (window.updateContactPageUI) window.updateContactPageUI();
        if (window.updateEventsPageUI) window.updateEventsPageUI();
        if (window.updatePixelBlockPageUI) window.updatePixelBlockPageUI();
        if (window.updateSongSearcherUI) window.updateSongSearcherUI();
    }

    /**
     * Get current language
     * @returns {string}
     */
    getCurrentLang() {
        return this.currentLang;
    }

    /**
     * Get translations for current language
     * @returns {object}
     */
    getTranslations() {
        return translations[this.currentLang];
    }

    /**
     * Get translations for specific language
     * @param {string} lang - Language code
     * @returns {object}
     */
    getTranslationsForLang(lang) {
        return translations[lang] || translations['pt-BR'];
    }
}

// Export for module usage
export default LanguageSwitcher;

// Also make it available globally for legacy code
window.LanguageSwitcher = LanguageSwitcher;