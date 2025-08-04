/*
==================== TRANSLATION GUIDE FOR NEW PAGES ====================

To ensure your new page supports language switching and translation:

1. Assign unique IDs to all text elements you want to translate (e.g., <h1 id="my-title">Title</h1>).

2. In your page-specific JS, create a translation object similar to:
   const myPageTranslations = {
     'pt-BR': { myTitle: 'Título', ... },
     'en-GB': { myTitle: 'Title', ... }
   };

3. Write a function (e.g., window.updateMyPageUI) that updates all relevant elements using the current language:
   window.updateMyPageUI = function() {
     const lang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
     const t = myPageTranslations[lang];
     document.getElementById('my-title').textContent = t.myTitle;
     // ...repeat for all translatable elements
   };

4. In js/script.js, the global language switcher will automatically call window.updateMyPageUI() if it exists after every language change.
   (No need to add extra event listeners for the flag on your page.)

5. Set the default text in your HTML to pt-BR for consistency.

6. If you add a new page, just follow steps 1-3 above and the translation will work automatically!

==========================================================================
*/
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
window.getCurrentLang = function() { return currentLang; };

function updateContent(lang) {
    htmlElement.lang = lang; // Update HTML lang attribute
    document.title = translations[lang].pageTitle;

    
    // Navigation
    const productsLinkText = document.getElementById('products-link-text');
    if (productsLinkText) productsLinkText.textContent = translations[lang].productsLink;
    const eventsLinkText = document.getElementById('events-link-text');
    if (eventsLinkText) eventsLinkText.textContent = translations[lang].eventsLink;
    const songSearchLink = document.getElementById('song-search-link');
    if (songSearchLink) songSearchLink.textContent = translations[lang].songSearchLink;
    const contactLink = document.getElementById('contact-link');
    if (contactLink) contactLink.textContent = translations[lang].contactLink;

    // Hero Section
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) heroTitle.textContent = translations[lang].heroTitle;
    const heroDescription = document.getElementById('hero-description');
    if (heroDescription) heroDescription.textContent = translations[lang].heroDescription;
    const learnMoreButton = document.getElementById('learn-more-button');
    if (learnMoreButton) learnMoreButton.textContent = translations[lang].learnMoreButton;

    // About Section
    const aboutHeading = document.getElementById('about-heading');
    if (aboutHeading) aboutHeading.textContent = translations[lang].aboutHeading;
    const aboutMusicTitle = document.getElementById('about-music-title');
    if (aboutMusicTitle) aboutMusicTitle.textContent = translations[lang].aboutMusicTitle;
    const aboutMusicDesc = document.getElementById('about-music-desc');
    if (aboutMusicDesc) aboutMusicDesc.textContent = translations[lang].aboutMusicDesc;
    const aboutCommunityTitle = document.getElementById('about-community-title');
    if (aboutCommunityTitle) aboutCommunityTitle.textContent = translations[lang].aboutCommunityTitle;
    const aboutCommunityDesc = document.getElementById('about-community-desc');
    if (aboutCommunityDesc) aboutCommunityDesc.textContent = translations[lang].aboutCommunityDesc;
    const aboutEventsTitle = document.getElementById('about-events-title');
    if (aboutEventsTitle) aboutEventsTitle.textContent = translations[lang].aboutEventsTitle;
    const aboutEventsDesc = document.getElementById('about-events-desc');
    if (aboutEventsDesc) aboutEventsDesc.textContent = translations[lang].aboutEventsDesc;
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
    if (window.updateContactPageUI) window.updateContactPageUI();
});

// Initialize content and flag on first load
updateContent(currentLang);
updateFlagButton(currentLang);
if (window.updateContactPageUI) window.updateContactPageUI();

// --- Hero Announcer Blurred Background Sync ---