/**
 * Main Application Entry Point
 * Initializes global components and functionality that runs on every page
 */

import LanguageSwitcher from './components/LanguageSwitcher.js';
import UIManager from './components/UIManager.js';
import ImageService from './services/ImageService.js';

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
        this.setupHomepageCarousel();
        this.setupPrettyUrlHandler();
    }

    /**
     * Make internal links without .html work both on GitHub Pages (pretty URLs)
     * and locally (file:// or simple static servers that don't support pretty URLs).
     * Strategy:
     * - On file:// protocol, rewrite internal hrefs to point to .html files.
     * - Intercept clicks on internal links and try HEAD fetch of the target; if missing,
     *   try target + '.html' before navigating.
     */
    setupPrettyUrlHandler() {
        const isLocalFile = location.protocol === 'file:';

        function isExternal(href) {
            return /^(https?:|mailto:|tel:|#)/i.test(href);
        }

        // Rewrite anchors on file:// to append .html where appropriate
        if (isLocalFile) {
            document.querySelectorAll('a[href]').forEach(a => {
                try {
                    const href = a.getAttribute('href');
                    if (!href) return;
                    if (isExternal(href)) return;
                    // If href already has .html or ends with /, leave as-is
                    if (/\.html($|\?|#)/i.test(href) || href.endsWith('/')) return;
                    // Convert 'page' or './page' or '/page' to 'page.html' (relative preserved)
                    // Keep query/hash if present
                    const [base, rest] = href.split(/(?=[?#])/);
                    // don't rewrite if base contains a dot (likely file extension)
                    if (base.includes('.')) return;
                    const prefix = base.startsWith('/') ? '' : '';
                    a.setAttribute('href', `${prefix}${base}.html${rest || ''}`);
                } catch (e) {
                    // ignore malformed hrefs
                }
            });
        }

        // Intercept clicks on internal links and try a best-effort resolution
        document.addEventListener('click', async (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            const href = link.getAttribute('href');
            if (!href) return;
            if (isExternal(href)) return; // let browser handle external links

            // If the link already contains .html or ends with '/', let normal navigation occur
            if (/\.html($|[?#])/i.test(href) || href.endsWith('/')) return;

            // Prevent default and resolve the best target
            e.preventDefault();

            // Compute absolute URLs
            const candidate = new URL(href, location.href).toString();
            const candidateIndex = new URL(href.endsWith('/') ? href + 'index.html' : href + '/index.html', location.href).toString();
            const candidateHtml = new URL(href + '.html', location.href).toString();

            // If running on file:// we already rewrote anchors, but as a safety:
            if (isLocalFile) {
                // Navigate directly to the .html candidate
                location.href = candidateHtml;
                return;
            }

            // Try GET requests to check availability (GET is more compatible with static servers)
            try {
                let res = await fetch(candidate, { method: 'GET' });
                if (res.ok) {
                    location.href = candidate;
                    return;
                }

                res = await fetch(candidateIndex, { method: 'GET' });
                if (res.ok) {
                    location.href = candidateIndex;
                    return;
                }

                res = await fetch(candidateHtml, { method: 'GET' });
                if (res.ok) {
                    location.href = candidateHtml;
                    return;
                }
            } catch (e) {
                // network error or CORS — final fallback below
            }

            // Final fallback: navigate to the original candidate (may result in 404)
            location.href = candidate;
        });
    }

    async setupHomepageCarousel() {
        try {
            const manifest = await ImageService.loadManifest('carousel');
            if (!manifest || !manifest.images) return;

            const carousel = document.getElementById('hero-announcer');
            if (!carousel) return;

            const indicators = carousel.querySelector('.carousel-indicators');
            const inner = carousel.querySelector('.carousel-inner');
            if (!indicators || !inner) return;

            indicators.innerHTML = '';
            inner.innerHTML = '';

            manifest.images.forEach((img, index) => {
                const isActive = index === 0;
                // Indicator
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.setAttribute('data-bs-target', '#hero-announcer');
                btn.setAttribute('data-bs-slide-to', String(index));
                if (isActive) {
                    btn.className = 'active';
                    btn.setAttribute('aria-current', 'true');
                }
                btn.setAttribute('aria-label', `Slide ${index + 1}`);
                indicators.appendChild(btn);

                // Item
                const item = document.createElement('div');
                item.className = `carousel-item ${isActive ? 'active' : ''}`;
                item.style.backgroundImage = `url('/images/${img.file}')`;

                const link = document.createElement('a');
                link.href = img.link || '#';
                link.className = 'carousel-link';

                const caption = document.createElement('div');
                caption.className = 'carousel-caption d-flex flex-column justify-content-center align-items-center h-100';
                caption.innerHTML = `<h2>${img.title || ''}</h2>`;

                link.appendChild(caption);
                item.appendChild(link);
                inner.appendChild(item);
            });
        } catch (e) {
            // Fail silently — carousel is non-critical
            console.warn('Failed to initialize homepage carousel', e);
        }
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