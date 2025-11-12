/*
==================== LEGACY SCRIPT - TRANSITIONING TO MODULAR ARCHITECTURE ====================

This file is maintained for backward compatibility while we transition to a modular architecture.
New functionality should be implemented in the modular structure under:
- js/components/ (reusable components like LanguageSwitcher, UIManager)
- js/services/ (data services like EventService, SongService) 
- js/pages/ (page-specific logic)

The main entry point is js/main.js which initializes global components.

For new pages, follow the modular pattern shown in js/pages/
==========================================================================
*/

// Legacy language switcher - now handled by LanguageSwitcher component
// This is kept for pages that haven't been migrated yet

const languageFlagButton = document.getElementById('language-flag');
const htmlElement = document.querySelector('html');

// Basic fallback translations (full translations are in LanguageSwitcher component)
const legacyTranslations = {
    'pt-BR': {
        pageTitle: 'Rising Flow - Início',
    },
    'en-GB': {
        pageTitle: 'Rising Flow - Home',
    }
};

let currentLang = 'pt-BR';

// Legacy compatibility functions
window.getCurrentLang = function() { 
    return window.languageSwitcher ? window.languageSwitcher.getCurrentLang() : currentLang; 
};

window.translations = legacyTranslations;

// Legacy language toggle (will be handled by LanguageSwitcher when loaded)
if (languageFlagButton && !window.languageSwitcher) {
    languageFlagButton.addEventListener('click', () => {
        currentLang = (currentLang === 'pt-BR') ? 'en-GB' : 'pt-BR';
        document.title = legacyTranslations[currentLang].pageTitle;
        
        if (currentLang === 'pt-BR') {
            languageFlagButton.dataset.lang = 'en-GB';
            languageFlagButton.innerHTML = '<span class="fi fi-gb" title="Switch to English"></span>';
        } else {
            languageFlagButton.dataset.lang = 'pt-BR';
            languageFlagButton.innerHTML = '<span class="fi fi-br" title="Mudar para Português"></span>';
        }
    });
}

// Legacy modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only show modal if not handled by main.js
    if (!window.risingFlowApp) {
        const pixelBlockModalElement = document.getElementById('pixelBlockModal');
        if (pixelBlockModalElement) {
            const pixelBlockModal = new bootstrap.Modal(pixelBlockModalElement);
            pixelBlockModal.show();
        }
    }
});

// --- Hero Announcer Blurred Background Sync ---