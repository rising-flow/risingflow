/**
 * UIManager - Manages UI components like modals and other interactive elements
 * This component provides reusable UI functionality across the application.
 */

class UIManager {
    constructor() {
        this.activeModals = new Set();
    }

    /**
     * Creates a modal element and shows it
     * @param {string} id - Modal ID
     * @param {string} title - Modal title
     * @param {string} content - Modal content (HTML)
     * @param {object} options - Modal options
     * @returns {HTMLElement} - The modal element
     */
    showModal(id, title, content, options = {}) {
        const existingModal = document.getElementById(id);
        if (existingModal) {
            existingModal.remove();
        }

        const modalSize = options.size || '';
        const sizeClass = modalSize ? `modal-dialog-${modalSize}` : '';
        
        const modalHtml = `
            <div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="${id}Title" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered ${sizeClass}">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="${id}Title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                        ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = document.getElementById(id);
        
        // Clean up modal after it's hidden
        modal.addEventListener('hidden.bs.modal', () => {
            this.activeModals.delete(id);
            modal.remove();
        });

        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        this.activeModals.add(id);

        return modal;
    }

    /**
     * Creates and shows an event registration modal
     * @param {string} eventTitle - Event title
     */
    showRegistrationModal(eventTitle) {
        const content = `
            <p>Para se inscrever neste evento, entre em contato conosco através dos canais abaixo:</p>
            <div class="d-flex justify-content-center gap-3 mb-3">
                <a href="https://instagram.com/_risingflow" target="_blank" class="btn btn-outline-primary">
                    <i class="fab fa-instagram"></i> Instagram
                </a>
                <a href="mailto:contato@risingflow.com.br" class="btn btn-outline-primary">
                    <i class="fas fa-envelope"></i> Email
                </a>
            </div>
            <p class="text-muted small">Ou acesse nossa página de <a href="./contact">contato</a> para mais informações.</p>
        `;

        const footer = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
        `;

        this.showModal('registrationModal', `Inscrição - ${eventTitle}`, content, { footer });
    }

    /**
     * Creates and shows an event details modal
     * @param {string} eventTitle - Event title
     * @param {string} eventDescription - Event description
     * @param {object} event - Full event object for additional details
     */
    showEventDetailsModal(eventTitle, eventDescription, event = {}) {
        const content = `
            <h6>Descrição</h6>
            <p>${eventDescription}</p>
            
            ${event.rising_flow_contribution ? `
                <h6>Contribuição da Rising Flow</h6>
                <p>${event.rising_flow_contribution}</p>
            ` : ''}
            
            <h6>Programação</h6>
            <ul>
                <li>Credenciamento e check-in</li>
                <li>Apresentação das regras</li>
                <li>Competições e atividades</li>
                <li>Premiação</li>
            </ul>
            
            <h6>O que levar</h6>
            <ul>
                <li>Documento de identificação</li>
                <li>Roupa confortável</li>
                <li>Água e lanches</li>
                <li>Boa disposição!</li>
            </ul>

            ${event.instagram_url || event.website_url ? `
                <div class="event-links mt-3">
                    ${event.instagram_url ? `
                        <a href="${event.instagram_url}" target="_blank" class="btn btn-primary me-2">
                            <i class="fab fa-instagram"></i> Instagram do Evento
                        </a>
                    ` : ''}
                    ${event.website_url ? `
                        <a href="${event.website_url}" target="_blank" class="btn btn-outline-primary">
                            <i class="fas fa-globe"></i> Website do Evento
                        </a>
                    ` : ''}
                </div>
            ` : ''}
        `;

        const footer = `
            <button type="button" class="btn btn-primary" onclick="window.uiManager.showRegistrationModal('${eventTitle}')">
                Inscrever-se
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
        `;

        this.showModal('eventDetailsModal', eventTitle, content, { footer, size: 'lg' });
    }

    /**
     * Creates and shows a gallery modal
     * @param {string} eventTitle - Event title
     * @param {string[]} images - Array of image paths
     * @param {string} eventId - Event ID for image paths
     */
    showGalleryModal(eventTitle, images = [], eventId = '') {
        if (!images || images.length === 0) {
            const content = `
                <div class="text-center">
                    <p class="text-muted">A galeria de fotos será disponibilizada em breve.</p>
                    <i class="fas fa-images fa-3x text-muted"></i>
                    <p class="mt-3">Fique atento às nossas redes sociais para ver as fotos do evento!</p>
                    <a href="https://instagram.com/_risingflow" target="_blank" class="btn btn-outline-primary">
                        <i class="fab fa-instagram"></i> Ver no Instagram
                    </a>
                </div>
            `;

            const footer = `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            `;

            this.showModal('galleryModal', `Galeria - ${eventTitle}`, content, { footer, size: 'lg' });
            return;
        }

        const carouselId = 'eventGalleryCarousel';
        const content = `
            <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    ${images.map((_, index) => `
                        <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${index}" 
                                ${index === 0 ? 'class="active" aria-current="true"' : ''} 
                                aria-label="Slide ${index + 1}"></button>
                    `).join('')}
                </div>
                <div class="carousel-inner">
                    ${images.map((image, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="./data/events/past/${eventId}/${image}" class="d-block w-100" alt="Foto ${index + 1} do evento">
                        </div>
                    `).join('')}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        `;

        const footer = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
        `;

        this.showModal('galleryModal', `Galeria - ${eventTitle}`, content, { footer, size: 'lg' });
    }

    /**
     * Creates and shows a results modal
     * @param {string} eventTitle - Event title
     * @param {string} winner - Winner name
     * @param {object} event - Full event object with results data
     */
    showResultsModal(eventTitle, winner, event = {}) {
        const content = `
            <div class="text-center mb-4">
                <i class="fas fa-trophy fa-3x text-warning mb-3"></i>
                <h6>Vencedor</h6>
                <p class="h5">${winner}</p>
            </div>
            
            <div class="row text-start">
                <div class="col-md-6">
                    <h6>Classificação Final</h6>
                    <ol>
                        <li>${winner}</li>
                        <li>Segundo Lugar</li>
                        <li>Terceiro Lugar</li>
                    </ol>
                </div>
                <div class="col-md-6">
                    <h6>Estatísticas</h6>
                    <ul class="list-unstyled">
                        <li><i class="fas fa-users"></i> Participantes: ${event.participants_count || 32}</li>
                        <li><i class="fas fa-clock"></i> Duração: 6 horas</li>
                        <li><i class="fas fa-star"></i> Pontuação máxima: 98.5%</li>
                    </ul>
                </div>
            </div>
        `;

        const footer = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
        `;

        this.showModal('resultsModal', `Resultados - ${eventTitle}`, content, { footer });
    }

    /**
     * Show a simple confirmation dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {function} onConfirm - Callback for confirm action
     * @param {object} options - Additional options
     */
    showConfirmDialog(title, message, onConfirm, options = {}) {
        const confirmText = options.confirmText || 'Confirmar';
        const cancelText = options.cancelText || 'Cancelar';
        
        const footer = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${cancelText}</button>
            <button type="button" class="btn btn-primary" id="confirmAction">${confirmText}</button>
        `;

        const modal = this.showModal('confirmDialog', title, `<p>${message}</p>`, { footer });
        
        const confirmBtn = modal.querySelector('#confirmAction');
        confirmBtn.addEventListener('click', () => {
            onConfirm();
            bootstrap.Modal.getInstance(modal).hide();
        });
    }

    /**
     * Close a specific modal
     * @param {string} modalId - Modal ID to close
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal && this.activeModals.has(modalId)) {
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
        }
    }

    /**
     * Close all active modals
     */
    closeAllModals() {
        this.activeModals.forEach(modalId => {
            this.closeModal(modalId);
        });
    }

    /**
     * Utility function to validate email
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Utility function to format dates
     * @param {string} dateString - Date string to format
     * @returns {string}
     */
    formatEventDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return date.toLocaleDateString('pt-BR', options);
    }
}

// Export for module usage
export default UIManager;

// Also make it available globally for legacy code
window.UIManager = UIManager;