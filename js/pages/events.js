/**
 * Events Page Entry Point
 * Handles both upcoming and past events rendering with tabs and card-based layout
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
                <div class="col-12 text-center py-5">
                    <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <p class="text-muted">${currentLang === 'pt-BR' ? 'Não há eventos programados no momento.' : 'No events scheduled at the moment.'}</p>
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
                <div class="col-12 text-center py-5">
                    <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <p class="text-muted">${currentLang === 'pt-BR' ? 'Nenhum evento passado disponível no momento.' : 'No past events available at the moment.'}</p>
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
        
        const card = document.createElement('div');
        card.className = 'col-lg-6 col-md-12 mb-4';
        
        const imagePath = `/data/events/${event.folder}/${event.title_image}`;
        
        card.innerHTML = `
            <div class="card h-100 event-card" style="cursor: pointer;" data-event-id="${event.id}">
                <div class="row g-0 h-100">
                    <div class="col-4 d-flex align-items-center justify-content-center p-3" style="background-color: #f8f9fa;">
                        <img src="${imagePath}" alt="${event.title}" class="img-fluid rounded" style="max-height: 150px; object-fit: contain;">
                    </div>
                    <div class="col-8">
                        <div class="card-body d-flex flex-column h-100">
                            <h5 class="card-title mb-2">${event.title}</h5>
                            <p class="card-text text-muted mb-2" style="font-size: 0.9rem;">${event.description}</p>
                            <div class="mt-auto">
                                <div class="d-flex align-items-center mb-1">
                                    <i class="fas fa-calendar text-primary me-2" style="width: 16px;"></i>
                                    <small>${formatDateRange(startDate, endDate)}</small>
                                </div>
                                <div class="d-flex align-items-center mb-1">
                                    <i class="fas fa-map-marker-alt text-danger me-2" style="width: 16px;"></i>
                                    <small>${event.location}</small>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-gamepad text-success me-2" style="width: 16px;"></i>
                                    <small>${event.games.join(', ')}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    createPastEventCard(event) {
        const endDate = new Date(event.ending_date);
        const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
        
        const card = document.createElement('div');
        card.className = 'col-lg-6 col-md-12 mb-4';
        
        const imagePath = `/data/events/${event.folder}/${event.title_image}`;
        
        card.innerHTML = `
            <div class="card h-100 event-card" style="cursor: pointer;" data-event-id="${event.id}">
                <div class="row g-0 h-100">
                    <div class="col-4 d-flex align-items-center justify-content-center p-3" style="background-color: #f8f9fa;">
                        <img src="${imagePath}" alt="${event.title}" class="img-fluid rounded" style="max-height: 150px; object-fit: contain;">
                    </div>
                    <div class="col-8">
                        <div class="card-body d-flex flex-column h-100">
                            <h5 class="card-title mb-2">${event.title}</h5>
                            <p class="card-text text-muted mb-2" style="font-size: 0.9rem;">${event.description}</p>
                            <div class="mt-auto">
                                <div class="d-flex align-items-center mb-1">
                                    <i class="fas fa-calendar text-primary me-2" style="width: 16px;"></i>
                                    <small>${endDate.toLocaleDateString('pt-BR')}</small>
                                </div>
                                <div class="d-flex align-items-center mb-1">
                                    <i class="fas fa-trophy text-warning me-2" style="width: 16px;"></i>
                                    <small>${currentLang === 'pt-BR' ? 'Vencedor' : 'Winner'}: ${event.winner || 'N/A'}</small>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-users text-info me-2" style="width: 16px;"></i>
                                    <small>${event.participants_count || 0} ${currentLang === 'pt-BR' ? 'participantes' : 'participants'}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    setupEventHandlers() {
        // Click handler for event cards
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.event-card');
            if (card) {
                const eventId = card.dataset.eventId;
                
                // Check if it's an upcoming or past event
                let event = this.events.upcomingEvents.find(e => e.id === eventId);
                const isUpcoming = !!event;
                
                if (!event) {
                    event = this.events.pastEvents.find(e => e.id === eventId);
                }
                
                if (event) {
                    this.showEventDetailsModal(event, isUpcoming);
                }
            }
        });
    }

    showEventDetailsModal(event, isUpcoming) {
        const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
        const startDate = new Date(event.starting_date);
        const endDate = new Date(event.ending_date);
        const imagePath = `/data/events/${event.folder}/${event.title_image}`;
        
        let modalContent = `
            <div class="text-center mb-3">
                <img src="${imagePath}" alt="${event.title}" class="img-fluid rounded" style="max-height: 200px; object-fit: contain;">
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <strong><i class="fas fa-calendar me-2"></i>${currentLang === 'pt-BR' ? 'Datas' : 'Dates'}:</strong>
                    <p class="mb-0">${formatDateRange(startDate, endDate)}</p>
                </div>
                <div class="col-md-6 mb-3">
                    <strong><i class="fas fa-map-marker-alt me-2"></i>${currentLang === 'pt-BR' ? 'Local' : 'Location'}:</strong>
                    <p class="mb-0">${event.location}</p>
                </div>
            </div>
            <div class="mb-3">
                <strong><i class="fas fa-info-circle me-2"></i>${currentLang === 'pt-BR' ? 'Descrição' : 'Description'}:</strong>
                <p class="mb-0">${event.description}</p>
            </div>
            <div class="mb-3">
                <strong><i class="fas fa-gamepad me-2"></i>${currentLang === 'pt-BR' ? 'Jogos' : 'Games'}:</strong>
                <p class="mb-0">${event.games.join(', ')}</p>
            </div>
        `;
        
        if (event.rising_flow_contribution) {
            modalContent += `
                <div class="mb-3">
                    <strong><i class="fas fa-hands-helping me-2"></i>${currentLang === 'pt-BR' ? 'Contribuição Rising Flow' : 'Rising Flow Contribution'}:</strong>
                    <p class="mb-0">${event.rising_flow_contribution}</p>
                </div>
            `;
        }
        
        if (isUpcoming) {
            modalContent += `
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <strong><i class="fas fa-clipboard-check me-2"></i>${currentLang === 'pt-BR' ? 'Inscrição' : 'Registration'}:</strong>
                        <p class="mb-0">${event.registration_required ? (currentLang === 'pt-BR' ? 'Obrigatória' : 'Required') : (currentLang === 'pt-BR' ? 'Não obrigatória' : 'Not required')}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong><i class="fas fa-ticket-alt me-2"></i>${currentLang === 'pt-BR' ? 'Taxa de entrada' : 'Entry fee'}:</strong>
                        <p class="mb-0">${event.entry_fee || (currentLang === 'pt-BR' ? 'Gratuito' : 'Free')}</p>
                    </div>
                </div>
            `;
        } else {
            if (event.winner) {
                modalContent += `
                    <div class="mb-3">
                        <strong><i class="fas fa-trophy me-2"></i>${currentLang === 'pt-BR' ? 'Vencedor' : 'Winner'}:</strong>
                        <p class="mb-0">${event.winner}</p>
                    </div>
                `;
            }
            if (event.participants_count) {
                modalContent += `
                    <div class="mb-3">
                        <strong><i class="fas fa-users me-2"></i>${currentLang === 'pt-BR' ? 'Participantes' : 'Participants'}:</strong>
                        <p class="mb-0">${event.participants_count}</p>
                    </div>
                `;
            }
            if (event.event_highlights) {
                modalContent += `
                    <div class="mb-3">
                        <strong><i class="fas fa-star me-2"></i>${currentLang === 'pt-BR' ? 'Destaques' : 'Highlights'}:</strong>
                        <p class="mb-0">${event.event_highlights}</p>
                    </div>
                `;
            }
        }
        
        // Add social links
        let footerContent = '';
        if (event.instagram_url) {
            footerContent += `<a href="${event.instagram_url}" target="_blank" class="btn btn-primary me-2"><i class="fab fa-instagram"></i> Instagram</a>`;
        }
        if (event.instagram_highlights) {
            footerContent += `<a href="${event.instagram_highlights}" target="_blank" class="btn btn-outline-primary me-2"><i class="fab fa-instagram"></i> ${currentLang === 'pt-BR' ? 'Destaques' : 'Highlights'}</a>`;
        }
        if (event.website_url) {
            footerContent += `<a href="${event.website_url}" target="_blank" class="btn btn-outline-secondary me-2"><i class="fas fa-globe"></i> Website</a>`;
        }
        if (event.gallery_images && event.gallery_images.length > 0) {
            footerContent += `<button class="btn btn-outline-info me-2 gallery-btn" data-event-id="${event.id}"><i class="fas fa-images"></i> ${currentLang === 'pt-BR' ? 'Galeria' : 'Gallery'}</button>`;
        }
        footerContent += `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${currentLang === 'pt-BR' ? 'Fechar' : 'Close'}</button>`;
        
        this.uiManager.showModal(event.title, modalContent, footerContent);
        
        // Add gallery button handler
        if (event.gallery_images && event.gallery_images.length > 0) {
            setTimeout(() => {
                const galleryBtn = document.querySelector('.gallery-btn');
                if (galleryBtn) {
                    galleryBtn.addEventListener('click', () => {
                        // Close details modal first
                        const modal = document.getElementById('universalModal');
                        if (modal && window.bootstrap) {
                            const bsModal = window.bootstrap.Modal.getInstance(modal);
                            if (bsModal) bsModal.hide();
                        }
                        // Show gallery with proper paths
                        const galleryImages = event.gallery_images.map(img => `/data/events/${event.folder}/${img}`);
                        this.uiManager.showGalleryModal(event.title, galleryImages);
                    });
                }
            }, 100);
        }
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
    window.eventsPage = eventsPage;
});