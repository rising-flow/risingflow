/**
 * Events Page Entry Point
 * Handles both upcoming and past events rendering and interactions
 */

import { getAllEvents, getMonthAbbreviation, formatDateRange } from '../services/EventService.js';
import UIManager from '../components/UIManager.js';

class EventsPage {
    constructor() {
        this.events = { upcomingEvents: [], pastEvents: [] };
        this.uiManager = new UIManager();
        
        // Make UI manager globally available for legacy compatibility
        window.uiManager = this.uiManager;
        
        this.init();
    }

    async init() {
        try {
            this.events = await getAllEvents();
            this.renderEvents();
            this.setupEventHandlers();
        } catch (error) {
            console.error('Error initializing events page:', error);
        }
    }

    renderEvents() {
        const upcomingContainer = document.getElementById('upcoming-events-container');
        const pastContainer = document.getElementById('past-events-container');

        if (upcomingContainer) {
            this.renderUpcomingEvents(upcomingContainer);
        }

        if (pastContainer) {
            this.renderPastEvents(pastContainer);
        }
    }

    renderUpcomingEvents(container) {
        container.innerHTML = '';
        
        if (this.events.upcomingEvents.length === 0) {
            const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">${currentLang === 'pt-BR' ? 'Não há mais eventos programados no momento.' : 'No more events scheduled at the moment.'}</p>
                    <p class="text-muted">${currentLang === 'pt-BR' ? 'Volte sempre para ver novos eventos!' : 'Check back often for new events!'}</p>
                </div>
            `;
            return;
        }

        this.events.upcomingEvents.forEach(event => {
            const eventCard = this.createUpcomingEventCard(event);
            container.appendChild(eventCard);
        });
    }

    renderPastEvents(container) {
        container.innerHTML = '';
        
        if (this.events.pastEvents.length === 0) {
            const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">${currentLang === 'pt-BR' ? 'Nenhum evento passado disponível no momento.' : 'No past events available at the moment.'}</p>
                    <p class="text-muted">${currentLang === 'pt-BR' ? 'Fique atento aos próximos eventos!' : 'Stay tuned for upcoming events!'}</p>
                </div>
            `;
            return;
        }

        this.events.pastEvents.forEach(event => {
            const eventCard = this.createPastEventCard(event);
            container.appendChild(eventCard);
        });
    }

    createUpcomingEventCard(event) {
        const startDate = new Date(event.starting_date);
        const endDate = new Date(event.ending_date);
        const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
        const t = window.translations ? window.translations[currentLang] : {};
        
        const card = document.createElement('div');
        card.className = 'col-lg-6 col-md-12 mb-4';
        card.innerHTML = `
            <div class="event-card upcoming-event" data-event-id="${event.id}">
                <div class="event-image">
                    <img src="./data/events/upcoming/${event.id}/${event.title_image}" alt="${event.title}">
                    <div class="event-date">
                        <span class="day">${startDate.getDate()}</span>
                        <span class="month">${getMonthAbbreviation(startDate.getMonth())}</span>
                    </div>
                </div>
                <div class="event-content">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <div class="event-details">
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${formatDateRange(startDate, endDate)}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-gamepad"></i>
                            <span>${event.games.join(', ')}</span>
                        </div>
                    </div>
                    <div class="event-actions">
                        <a href="${event.instagram_url}" target="_blank" class="btn btn-primary">
                            <i class="fab fa-instagram"></i> Instagram
                        </a>
                        <a href="${event.website_url}" target="_blank" class="btn btn-outline-primary">
                            <i class="fas fa-globe"></i> ${t.website || 'Website'}
                        </a>
                        <button class="btn btn-outline-secondary details-btn" data-event-id="${event.id}">
                            <i class="fas fa-info-circle"></i> ${t.details || 'Detalhes'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    createPastEventCard(event) {
        const endDate = new Date(event.ending_date);
        const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
        const t = window.translations ? window.translations[currentLang] : {};
        
        const card = document.createElement('div');
        card.className = 'col-lg-6 col-md-12 mb-4';
        card.innerHTML = `
            <div class="event-card past-event" data-event-id="${event.id}">
                <div class="event-image">
                    <img src="./data/events/past/${event.id}/${event.title_image}" alt="${event.title}">
                    <div class="event-date">
                        <span class="day">${endDate.getDate()}</span>
                        <span class="month">${getMonthAbbreviation(endDate.getMonth())}</span>
                    </div>
                </div>
                <div class="event-content">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <div class="event-details">
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-trophy"></i>
                            <span>${t.winner || 'Vencedor'}: ${event.winner}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-users"></i>
                            <span>${event.participants_count} ${t.participants || 'participantes'}</span>
                        </div>
                    </div>
                    <div class="event-actions">
                        <button class="btn btn-outline-primary gallery-btn" data-event-id="${event.id}">
                            <i class="fas fa-images"></i> ${t.viewGallery || 'Ver Galeria'}
                        </button>
                        <a href="${event.instagram_highlights}" target="_blank" class="btn btn-outline-secondary">
                            <i class="fab fa-instagram"></i> ${t.highlights || 'Destaques'}
                        </a>
                        <button class="btn btn-outline-info results-btn" data-event-id="${event.id}">
                            <i class="fas fa-trophy"></i> Resultados
                        </button>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    setupEventHandlers() {
        // Event details buttons for upcoming events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.details-btn')) {
                const eventId = e.target.closest('.details-btn').dataset.eventId;
                const event = this.events.upcomingEvents.find(e => e.id === eventId);
                if (event) {
                    this.uiManager.showEventDetailsModal(event.title, event.description, event);
                }
            }
        });

        // Gallery buttons for past events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-btn')) {
                const eventId = e.target.closest('.gallery-btn').dataset.eventId;
                const event = this.events.pastEvents.find(e => e.id === eventId);
                if (event) {
                    this.uiManager.showGalleryModal(event.title, event.gallery_images, event.id);
                }
            }
        });

        // Results buttons for past events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.results-btn')) {
                const eventId = e.target.closest('.results-btn').dataset.eventId;
                const event = this.events.pastEvents.find(e => e.id === eventId);
                if (event) {
                    this.uiManager.showResultsModal(event.title, event.winner, event);
                }
            }
        });
    }

    // Method called by the language switcher
    updateUI() {
        this.renderEvents();
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const eventsPage = new EventsPage();
    
    // Make update function available globally for language switcher
    window.updateEventsPageUI = () => eventsPage.updateUI();
});

// Legacy support functions
window.showEventDetails = function(eventId) {
    if (window.uiManager) {
        const event = window.eventsPage?.events.upcomingEvents.find(e => e.id === eventId);
        if (event) {
            window.uiManager.showEventDetailsModal(event.title, event.description, event);
        }
    }
};

window.showEventGallery = function(eventId) {
    if (window.uiManager) {
        const event = window.eventsPage?.events.pastEvents.find(e => e.id === eventId);
        if (event) {
            window.uiManager.showGalleryModal(event.title, event.gallery_images, event.id);
        }
    }
};