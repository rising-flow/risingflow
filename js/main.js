/**
 * Main Application Entry Point
 * Initializes global components and functionality that runs on every page
 */

import LanguageSwitcher from './components/LanguageSwitcher.js';
import UIManager from './components/UIManager.js';

class RisingFlowApp {
    constructor() {
        this.languageSwitcher = null;
        this.uiManager = null;
        this.init();
    }

    init() {
        // Initialize global components
        this.languageSwitcher = new LanguageSwitcher();
        this.uiManager = new UIManager();
        
        // Make components globally available for backward compatibility
        window.languageSwitcher = this.languageSwitcher;
        window.uiManager = this.uiManager;
        
        // Setup global functionality
        this.setupPixelBlockModal();
        this.setupGlobalEventListeners();
    }

    setupPixelBlockModal() {
        // Show the Pixel Block modal when the page loads (only on index)
        const isIndexPage = window.location.pathname === '/' || 
                           window.location.pathname.endsWith('index.html') ||
                           window.location.pathname === '/risingflow/';
        
        if (isIndexPage) {
            const pixelBlockModalElement = document.getElementById('pixelBlockModal');
            if (pixelBlockModalElement) {
                const pixelBlockModal = new bootstrap.Modal(pixelBlockModalElement);
                pixelBlockModal.show();
            }
        }
    }

    setupGlobalEventListeners() {
        // Add any global event listeners here
        
        // Handle navigation clicks for SPA-like behavior if needed
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="./"]');
            if (link && !link.target && !e.ctrlKey && !e.metaKey) {
                // Could implement SPA navigation here if desired
                // For now, let default navigation happen
            }
        });

        // Handle escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any custom modals if needed
                this.uiManager.closeAllModals();
            }
        });

        // Handle window resize for responsive adjustments
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        // Handle any responsive adjustments needed
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile-view', isMobile);
    }

    /**
     * Get the current application instance
     * @returns {RisingFlowApp}
     */
    static getInstance() {
        if (!window._risingFlowApp) {
            window._risingFlowApp = new RisingFlowApp();
        }
        return window._risingFlowApp;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = RisingFlowApp.getInstance();
    
    // Make app globally available
    window.risingFlowApp = app;
    
    console.log('Rising Flow application initialized');
});

// Export for module usage
export default RisingFlowApp;