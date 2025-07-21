// --- Language Switcher (JavaScript) ---
const languageFlagButton = document.getElementById('language-flag');
const htmlElement = document.querySelector('html');

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
        aboutEventsDesc: 'Compita em torneios, participe de workshops e conecte-se com outros jogadores em nossos emocionantes eventos.'
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
        aboutEventsDesc: 'Compete in tournaments, attend workshops, and connect with fellow players at our thrilling events.'
    }
};

let currentLang = 'pt-BR'; // Default language

function updateContent(lang) {
    htmlElement.lang = lang; // Update HTML lang attribute
    document.title = translations[lang].pageTitle;

    // Navigation
    document.querySelector('a[href="#products"]').childNodes[0].nodeValue = translations[lang].productsLink + ' ';
    document.querySelector('a[href="#events"]').childNodes[0].nodeValue = translations[lang].eventsLink + ' ';
    document.getElementById('song-search-link').textContent = translations[lang].songSearchLink;
    document.getElementById('contact-link').textContent = translations[lang].contactLink;

    // Hero Section
    document.getElementById('hero-title').textContent = translations[lang].heroTitle;
    document.getElementById('hero-description').textContent = translations[lang].heroDescription;
    document.getElementById('learn-more-button').textContent = translations[lang].learnMoreButton;

    // About Section
    document.getElementById('about-heading').textContent = translations[lang].aboutHeading;
    document.getElementById('about-music-title').textContent = translations[lang].aboutMusicTitle;
    document.getElementById('about-music-desc').textContent = translations[lang].aboutMusicDesc;
    document.getElementById('about-community-title').textContent = translations[lang].aboutCommunityTitle;
    document.getElementById('about-community-desc').textContent = translations[lang].aboutCommunityDesc;
    document.getElementById('about-events-title').textContent = translations[lang].aboutEventsTitle;
    document.getElementById('about-events-desc').textContent = translations[lang].aboutEventsDesc;
}

function updateFlagButton(lang) {
    if (lang === 'pt-BR') {
        languageFlagButton.dataset.lang = 'en-GB';
        languageFlagButton.innerHTML = '<span class="fi fi-gb" title="Switch to English"></span>';
    } else {
        languageFlagButton.dataset.lang = 'pt-BR';
        languageFlagButton.innerHTML = '<span class="fi fi-br" title="Mudar para Português"></span>';
    }
}

languageFlagButton.addEventListener('click', () => {
    // Toggle language
    currentLang = (currentLang === 'pt-BR') ? 'en-GB' : 'pt-BR';
    updateContent(currentLang);
    updateFlagButton(currentLang);
});

// Initialize content and flag on first load
updateContent(currentLang);
updateFlagButton(currentLang);