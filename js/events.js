// Events Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize event card interactions
    initializeEventCards();
});



// Initialize event card interactions
function initializeEventCards() {
    // Event registration buttons
    const registerButtons = document.querySelectorAll('[id$="-register"]');
    registerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventTitle = this.closest('.event-card').querySelector('h3').textContent;
            showRegistrationModal(eventTitle);
        });
    });

    // Event details buttons
    const detailsButtons = document.querySelectorAll('[id$="-details"]');
    detailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventCard = this.closest('.event-card');
            const eventTitle = eventCard.querySelector('h3').textContent;
            const eventDescription = eventCard.querySelector('p').textContent;
            showEventDetailsModal(eventTitle, eventDescription);
        });
    });

    // Gallery buttons for past events
    const galleryButtons = document.querySelectorAll('[id$="-gallery"]');
    galleryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventTitle = this.closest('.event-card').querySelector('h3').textContent;
            showGalleryModal(eventTitle);
        });
    });

    // Results buttons for past events
    const resultsButtons = document.querySelectorAll('[id$="-results"]');
    resultsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventCard = this.closest('.event-card');
            const eventTitle = eventCard.querySelector('h3').textContent;
            const winner = eventCard.querySelector('[id$="-winner"]').textContent;
            showResultsModal(eventTitle, winner);
        });
    });
}

// Show registration modal
function showRegistrationModal(eventTitle) {
    const modalHtml = `
        <div class="modal fade" id="registrationModal" tabindex="-1" aria-labelledby="registrationModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="registrationModalTitle">Inscrição - ${eventTitle}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
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
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('registrationModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('registrationModal'));
    modal.show();
    
    // Clean up modal after it's hidden
    document.getElementById('registrationModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Show event details modal
function showEventDetailsModal(eventTitle, eventDescription) {
    const modalHtml = `
        <div class="modal fade" id="eventDetailsModal" tabindex="-1" aria-labelledby="eventDetailsModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="eventDetailsModalTitle">${eventTitle}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h6>Descrição</h6>
                        <p>${eventDescription}</p>
                        
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
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="showRegistrationModal('${eventTitle}')">
                            Inscrever-se
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('eventDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
    modal.show();
    
    // Clean up modal after it's hidden
    document.getElementById('eventDetailsModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Show gallery modal
function showGalleryModal(eventTitle) {
    const modalHtml = `
        <div class="modal fade" id="galleryModal" tabindex="-1" aria-labelledby="galleryModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="galleryModalTitle">Galeria - ${eventTitle}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="text-muted">A galeria de fotos será disponibilizada em breve.</p>
                        <i class="fas fa-images fa-3x text-muted"></i>
                        <p class="mt-3">Fique atento às nossas redes sociais para ver as fotos do evento!</p>
                        <a href="https://instagram.com/_risingflow" target="_blank" class="btn btn-outline-primary">
                            <i class="fab fa-instagram"></i> Ver no Instagram
                        </a>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('galleryModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('galleryModal'));
    modal.show();
    
    // Clean up modal after it's hidden
    document.getElementById('galleryModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Show results modal
function showResultsModal(eventTitle, winner) {
    const modalHtml = `
        <div class="modal fade" id="resultsModal" tabindex="-1" aria-labelledby="resultsModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="resultsModalTitle">Resultados - ${eventTitle}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="mb-4">
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
                                    <li><i class="fas fa-users"></i> Participantes: 32</li>
                                    <li><i class="fas fa-clock"></i> Duração: 6 horas</li>
                                    <li><i class="fas fa-star"></i> Pontuação máxima: 98.5%</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('resultsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('resultsModal'));
    modal.show();
    
    // Clean up modal after it's hidden
    document.getElementById('resultsModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Utility function to format dates
function formatEventDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    return date.toLocaleDateString('pt-BR', options);
}

// Utility function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Export functions for global access
window.showRegistrationModal = showRegistrationModal;
window.showEventDetailsModal = showEventDetailsModal;
window.showGalleryModal = showGalleryModal;
window.showResultsModal = showResultsModal;

// Events page UI update function for language switching
window.updateEventsPageUI = function() {
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
    const t = window.translations ? window.translations[lang] : null;
    
    if (!t) return;
    
    // Update page titles
    const upcomingEventsTitle = document.getElementById('upcoming-events-title');
    if (upcomingEventsTitle) upcomingEventsTitle.textContent = t.upcomingEventsTitle;
    
    const pastEventsTitle = document.getElementById('past-events-title');
    if (pastEventsTitle) pastEventsTitle.textContent = t.pastEventsTitle;
    
    // Re-render events with updated language
    if (window.eventManager) {
        const upcomingContainer = document.getElementById('upcoming-events-container');
        const pastContainer = document.getElementById('past-events-container');
        
        if (upcomingContainer) {
            window.eventManager.renderUpcomingEvents(upcomingContainer);
        }
        
        if (pastContainer) {
            window.eventManager.renderPastEvents(pastContainer);
        }
    }
}; 