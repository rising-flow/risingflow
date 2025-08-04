// Event Loader and Manager
class EventManager {
    constructor() {
        this.events = [];
        this.upcomingEvents = [];
        this.pastEvents = [];
    }

    // Load all events from the data folder
    async loadAllEvents() {
        try {
            // Load upcoming events
            const upcomingResponse = await fetch('./data/events/upcoming/');
            if (upcomingResponse.ok) {
                const upcomingFolders = await this.getEventFolders('./data/events/upcoming/');
                for (const folder of upcomingFolders) {
                    const eventData = await this.loadEventData(`./data/events/upcoming/${folder}/event.json`);
                    if (eventData) {
                        this.events.push(eventData);
                    }
                }
            }

            // Load past events
            const pastResponse = await fetch('./data/events/past/');
            if (pastResponse.ok) {
                const pastFolders = await this.getEventFolders('./data/events/past/');
                for (const folder of pastFolders) {
                    const eventData = await this.loadEventData(`./data/events/past/${folder}/event.json`);
                    if (eventData) {
                        this.events.push(eventData);
                    }
                }
            }

            this.categorizeEvents();
            return true;
        } catch (error) {
            console.error('Error loading events:', error);
            return false;
        }
    }

    // Get list of event folders (this would need server-side implementation)
    async getEventFolders(path) {
        // For now, we'll use a hardcoded list
        // In a real implementation, this would be handled server-side
        if (path.includes('upcoming')) {
            return ['event-001'];
        } else if (path.includes('past')) {
            return ['event-002'];
        }
        return [];
    }

    // Load individual event data
    async loadEventData(path) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error(`Error loading event data from ${path}:`, error);
        }
        return null;
    }

    // Categorize events as upcoming or past based on dates
    categorizeEvents() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.upcomingEvents = [];
        this.pastEvents = [];

        this.events.forEach(event => {
            const endDate = new Date(event.ending_date);
            endDate.setHours(0, 0, 0, 0);
            
            // Event is considered "past" the day after its ending date
            const pastThreshold = new Date(endDate);
            pastThreshold.setDate(pastThreshold.getDate() + 1);

            if (today >= pastThreshold) {
                this.pastEvents.push(event);
            } else {
                this.upcomingEvents.push(event);
            }
        });

        // Sort upcoming events by start date (earliest first)
        this.upcomingEvents.sort((a, b) => new Date(a.starting_date) - new Date(b.starting_date));
        
        // Sort past events by end date (most recent first)
        this.pastEvents.sort((a, b) => new Date(b.ending_date) - new Date(a.ending_date));
    }

    // Render upcoming events
    renderUpcomingEvents(container) {
        if (!container) return;

        container.innerHTML = '';
        
        if (this.upcomingEvents.length === 0) {
            const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
            const t = window.translations[currentLang];
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">${currentLang === 'pt-BR' ? 'Não há mais eventos programados no momento.' : 'No more events scheduled at the moment.'}</p>
                    <p class="text-muted">${currentLang === 'pt-BR' ? 'Volte sempre para ver novos eventos!' : 'Check back often for new events!'}</p>
                </div>
            `;
            return;
        }

        this.upcomingEvents.forEach(event => {
            const eventCard = this.createUpcomingEventCard(event);
            container.appendChild(eventCard);
        });
    }

    // Render past events
    renderPastEvents(container) {
        if (!container) return;

        container.innerHTML = '';
        
        if (this.pastEvents.length === 0) {
            const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">${currentLang === 'pt-BR' ? 'Nenhum evento passado disponível no momento.' : 'No past events available at the moment.'}</p>
                    <p class="text-muted">${currentLang === 'pt-BR' ? 'Fique atento aos próximos eventos!' : 'Stay tuned for upcoming events!'}</p>
                </div>
            `;
            return;
        }

        this.pastEvents.forEach(event => {
            const eventCard = this.createPastEventCard(event);
            container.appendChild(eventCard);
        });
    }

    // Create upcoming event card
    createUpcomingEventCard(event) {
        const startDate = new Date(event.starting_date);
        const endDate = new Date(event.ending_date);
        const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
        const t = window.translations ? window.translations[currentLang] : {};
        
        const card = document.createElement('div');
        card.className = 'col-lg-6 col-md-12 mb-4';
        card.innerHTML = `
            <div class="event-card upcoming-event">
                <div class="event-image">
                    <img src="./data/events/upcoming/${event.id}/${event.title_image}" alt="${event.title}">
                    <div class="event-date">
                        <span class="day">${startDate.getDate()}</span>
                        <span class="month">${this.getMonthAbbreviation(startDate.getMonth())}</span>
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
                            <span>${this.formatDateRange(startDate, endDate)}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-gamepad"></i>
                            <span>${event.games.join(', ')}</span>
                        </div>
                    </div>
                    <div class="event-actions">
                        <button class="btn btn-primary" onclick="window.open('${event.instagram_url}', '_blank')">
                            <i class="fab fa-instagram"></i> Instagram
                        </button>
                        <button class="btn btn-outline-primary" onclick="window.open('${event.website_url}', '_blank')">
                            <i class="fas fa-globe"></i> ${t.website || 'Website'}
                        </button>
                        <button class="btn btn-outline-secondary" onclick="showEventDetails('${event.id}')">
                            <i class="fas fa-info-circle"></i> ${t.details || 'Detalhes'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    // Create past event card
    createPastEventCard(event) {
        const endDate = new Date(event.ending_date);
        const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
        const t = window.translations ? window.translations[currentLang] : {};
        
        const card = document.createElement('div');
        card.className = 'col-lg-6 col-md-12 mb-4';
        card.innerHTML = `
            <div class="event-card past-event">
                <div class="event-image">
                    <img src="./data/events/past/${event.id}/${event.title_image}" alt="${event.title}">
                    <div class="event-date">
                        <span class="day">${endDate.getDate()}</span>
                        <span class="month">${this.getMonthAbbreviation(endDate.getMonth())}</span>
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
                        <button class="btn btn-outline-primary" onclick="showEventGallery('${event.id}')">
                            <i class="fas fa-images"></i> ${t.viewGallery || 'Ver Galeria'}
                        </button>
                        <button class="btn btn-outline-secondary" onclick="window.open('${event.instagram_highlights}', '_blank')">
                            <i class="fab fa-instagram"></i> ${t.highlights || 'Destaques'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    // Helper methods
    getMonthAbbreviation(month) {
        const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
        return months[month];
    }

    formatDateRange(startDate, endDate) {
        if (startDate.toDateString() === endDate.toDateString()) {
            return startDate.toLocaleDateString('pt-BR');
        } else {
            return `${startDate.toLocaleDateString('pt-BR')} - ${endDate.toLocaleDateString('pt-BR')}`;
        }
    }
}

// Global event manager instance
window.eventManager = new EventManager();

// Show event details modal for upcoming events
function showEventDetails(eventId) {
    const event = window.eventManager.upcomingEvents.find(e => e.id === eventId);
    if (!event) return;

    const modal = document.getElementById('eventDetailsModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');

    modalTitle.textContent = event.title;
    modalBody.innerHTML = `
        <div class="event-details-content">
            <h5>Contribuição da Rising Flow</h5>
            <p>${event.rising_flow_contribution}</p>
            
            <h5>Informações do Evento</h5>
            <ul>
                <li><strong>Local:</strong> ${event.location}</li>
                <li><strong>Data:</strong> ${window.eventManager.formatDateRange(new Date(event.starting_date), new Date(event.ending_date))}</li>
                <li><strong>Jogos:</strong> ${event.games.join(', ')}</li>
                ${event.registration_required ? `<li><strong>Inscrição:</strong> Obrigatória</li>` : ''}
                ${event.entry_fee ? `<li><strong>Taxa de Inscrição:</strong> ${event.entry_fee}</li>` : ''}
            </ul>
            
            <div class="event-links mt-3">
                <a href="${event.instagram_url}" target="_blank" class="btn btn-primary me-2">
                    <i class="fab fa-instagram"></i> Instagram do Evento
                </a>
                <a href="${event.website_url}" target="_blank" class="btn btn-outline-primary">
                    <i class="fas fa-globe"></i> Website do Evento
                </a>
            </div>
        </div>
    `;

    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

// Show event gallery modal for past events
function showEventGallery(eventId) {
    const event = window.eventManager.pastEvents.find(e => e.id === eventId);
    if (!event || !event.gallery_images) return;

    const modal = document.getElementById('eventGalleryModal');
    const modalTitle = modal.querySelector('.modal-title');
    const carousel = modal.querySelector('.carousel-inner');
    const indicators = modal.querySelector('.carousel-indicators');

    modalTitle.textContent = `${event.title} - Galeria`;
    
    // Clear and populate carousel
    carousel.innerHTML = '';
    indicators.innerHTML = '';
    
    event.gallery_images.forEach((image, index) => {
        // Create carousel item
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        carouselItem.innerHTML = `
            <img src="./data/events/past/${event.id}/${image}" class="d-block w-100" alt="Foto ${index + 1} do evento">
        `;
        carousel.appendChild(carouselItem);
        
        // Create indicator
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', '#eventGalleryCarousel');
        indicator.setAttribute('data-bs-slide-to', index.toString());
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        if (index === 0) {
            indicator.className = 'active';
            indicator.setAttribute('aria-current', 'true');
        }
        indicators.appendChild(indicator);
    });

    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

// Initialize event manager when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    await window.eventManager.loadAllEvents();
    
    // Render events based on current page
    const upcomingContainer = document.getElementById('upcoming-events-container');
    const pastContainer = document.getElementById('past-events-container');
    
    if (upcomingContainer) {
        window.eventManager.renderUpcomingEvents(upcomingContainer);
    }
    
    if (pastContainer) {
        window.eventManager.renderPastEvents(pastContainer);
    }
}); 