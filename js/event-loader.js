/**
 * LEGACY EVENT LOADER - REDIRECTED TO NEW ARCHITECTURE
 * 
 * This file now redirects to the new modular architecture.
 * The actual event loading functionality has been moved to:
 * - js/services/EventService.js (for data operations)
 * - js/pages/events.js (for page-specific logic)
 * 
 * This file is kept for backward compatibility with existing HTML files
 * that might still reference it.
 */

console.warn('event-loader.js is deprecated. Use js/pages/events.js for new implementations.');

// Legacy compatibility - redirect to new architecture
if (typeof window !== 'undefined') {
    // If the new architecture isn't loaded, provide minimal fallback
    if (!window.eventManager) {
        window.eventManager = {
            loadAllEvents: async function() {
                console.warn('Legacy eventManager called. Please migrate to the new architecture.');
                return false;
            },
            renderUpcomingEvents: function(container) {
                if (container) {
                    container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Please update to use the new event system.</p></div>';
                }
            },
            renderPastEvents: function(container) {
                if (container) {
                    container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Please update to use the new event system.</p></div>';
                }
            },
            upcomingEvents: [],
            pastEvents: []
        };
    }
    
    // Legacy modal functions
    window.showEventDetails = function(eventId) {
        console.warn('Legacy showEventDetails called. Please update HTML to use new event system.');
        if (window.uiManager) {
            window.uiManager.showModal('legacyModal', 'Notice', 'This page needs to be updated to use the new event system.');
        }
    };
    
    window.showEventGallery = function(eventId) {
        console.warn('Legacy showEventGallery called. Please update HTML to use new event system.');
        if (window.uiManager) {
            window.uiManager.showModal('legacyModal', 'Notice', 'This page needs to be updated to use the new event system.');
        }
    };
}

// Auto-redirect to new system if on events page
document.addEventListener('DOMContentLoaded', function() {
    const isEventsPage = document.getElementById('upcoming-events-container') || 
                        document.getElementById('past-events-container');
    
    if (isEventsPage) {
        console.log('Events page detected. Consider migrating to use js/pages/events.js as a module.');
        console.log('Add <script src="js/pages/events.js" type="module"></script> to your HTML.');
    }
}); 