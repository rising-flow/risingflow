/**
 * Pixel Block Page Entry Point
 * Handles pixel block character selection and interactions
 */

import UIManager from '../components/UIManager.js';

class PixelBlockPage {
    constructor() {
        this.uiManager = new UIManager();
        this.selectedCharacter = null;
        this.init();
    }

    init() {
        this.setupCharacterSelection();
        this.setupPixelBlockModal();
        this.updateUI();
    }

    setupCharacterSelection() {
        const characterButtons = document.querySelectorAll('.character-btn');
        
        characterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove selection from other buttons
                characterButtons.forEach(b => b.classList.remove('selected'));
                
                // Add selection to clicked button
                btn.classList.add('selected');
                this.selectedCharacter = btn.dataset.character;
                
                // Show character details
                this.showCharacterDetails(this.selectedCharacter);
            });
        });

        // Add purchase button functionality
        const purchaseBtn = document.getElementById('purchase-btn');
        if (purchaseBtn) {
            purchaseBtn.addEventListener('click', () => {
                if (this.selectedCharacter) {
                    this.handlePurchase();
                } else {
                    this.uiManager.showModal(
                        'selectionModal',
                        'Seleção Necessária',
                        '<p>Por favor, selecione um personagem antes de continuar.</p>',
                        {
                            footer: '<button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>'
                        }
                    );
                }
            });
        }
    }

    setupPixelBlockModal() {
        // Modal functionality is handled by the main script
        // This ensures compatibility with existing modal setup
    }

    showCharacterDetails(character) {
        const detailsContainer = document.getElementById('character-details');
        if (!detailsContainer) return;

        const characters = {
            mario: {
                name: 'Mario',
                description: 'O famoso encanador do Reino dos Cogumelos!',
                difficulty: 'Fácil',
                pieces: 156,
                image: './images/PixelBlock/mario-preview.jpg'
            },
            luigi: {
                name: 'Luigi',
                description: 'O irmão mais alto e corajoso do Mario!',
                difficulty: 'Fácil',
                pieces: 163,
                image: './images/PixelBlock/luigi-preview.jpg'
            },
            link: {
                name: 'Link',
                description: 'O herói de Hyrule com sua espada e escudo!',
                difficulty: 'Médio',
                pieces: 234,
                image: './images/PixelBlock/link-preview.jpg'
            },
            sonic: {
                name: 'Sonic',
                description: 'O ouriço azul mais rápido do mundo!',
                difficulty: 'Médio',
                pieces: 198,
                image: './images/PixelBlock/sonic-preview.jpg'
            },
            pikachu: {
                name: 'Pikachu',
                description: 'O pokémon elétrico mais famoso!',
                difficulty: 'Fácil',
                pieces: 142,
                image: './images/PixelBlock/pikachu-preview.jpg'
            },
            megaman: {
                name: 'Mega Man',
                description: 'O robô azul lutador pela justiça!',
                difficulty: 'Difícil',
                pieces: 287,
                image: './images/PixelBlock/megaman-preview.jpg'
            }
        };

        const charData = characters[character];
        if (!charData) return;

        detailsContainer.innerHTML = `
            <div class="character-preview">
                <img src="${charData.image}" alt="${charData.name}" class="character-image">
                <div class="character-info">
                    <h3>${charData.name}</h3>
                    <p>${charData.description}</p>
                    <div class="character-stats">
                        <div class="stat">
                            <i class="fas fa-puzzle-piece"></i>
                            <span>${charData.pieces} peças</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-star"></i>
                            <span>Dificuldade: ${charData.difficulty}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-clock"></i>
                            <span>Tempo estimado: ${this.getEstimatedTime(charData.difficulty)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        detailsContainer.classList.add('visible');
    }

    getEstimatedTime(difficulty) {
        switch (difficulty) {
            case 'Fácil':
                return '30-45 min';
            case 'Médio':
                return '45-60 min';
            case 'Difícil':
                return '60-90 min';
            default:
                return '30-60 min';
        }
    }

    handlePurchase() {
        const content = `
            <div class="text-center">
                <i class="fas fa-shopping-cart fa-3x mb-3 text-primary"></i>
                <h5>Personagem Selecionado: ${this.selectedCharacter.charAt(0).toUpperCase() + this.selectedCharacter.slice(1)}</h5>
                <p>Você será redirecionado para a página de pagamento.</p>
                <p class="text-muted">Preço: R$ 29,90</p>
            </div>
        `;

        const footer = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="window.pixelBlockPage.proceedToPurchase()">
                Continuar Compra
            </button>
        `;

        this.uiManager.showModal('purchaseModal', 'Confirmar Compra', content, { footer });
    }

    proceedToPurchase() {
        // Simulate redirect to payment
        this.uiManager.showModal(
            'paymentModal',
            'Processando...',
            '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div><p class="mt-3">Redirecionando para pagamento...</p></div>'
        );

        setTimeout(() => {
            this.uiManager.closeModal('paymentModal');
            this.uiManager.showModal(
                'successModal',
                'Compra Realizada!',
                '<div class="text-center"><i class="fas fa-check-circle fa-3x text-success mb-3"></i><p>Sua compra foi realizada com sucesso! Você receberá um email com os detalhes.</p></div>',
                {
                    footer: '<button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>'
                }
            );
        }, 3000);
    }

    updateUI() {
        const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
        const translations = {
            'pt-BR': {
                pageTitle: 'Rising Flow - Pixel Block',
                pixelBlockTitle: 'Pixel Block',
                selectCharacterTitle: 'Selecione seu Personagem',
                purchaseButton: 'Comprar Pixel Block',
                characterDetailsTitle: 'Detalhes do Personagem',
                modalTitle: 'Comprou um Pixel Block?',
                modalBody: 'Você comprou um Pixel Block? Clique no botão abaixo para navegar até a página e selecionar o personagem para montar. Caso contrário, clique no X para fechar o modal.',
                modalButton: 'Ir para Pixel Block'
            },
            'en-GB': {
                pageTitle: 'Rising Flow - Pixel Block',
                pixelBlockTitle: 'Pixel Block',
                selectCharacterTitle: 'Select your Character',
                purchaseButton: 'Buy Pixel Block',
                characterDetailsTitle: 'Character Details',
                modalTitle: 'Did you buy a Pixel Block?',
                modalBody: 'Did you buy a Pixel Block? Click the button below to navigate to the page and select the character to assemble. Otherwise, click the X to close the modal.',
                modalButton: 'Go to Pixel Block'
            }
        };

        const t = translations[currentLang];
        if (!t) return;

        document.title = t.pageTitle;

        // Update page elements
        const pixelBlockTitle = document.getElementById('pixel-block-title');
        if (pixelBlockTitle) pixelBlockTitle.textContent = t.pixelBlockTitle;

        const selectTitle = document.getElementById('select-character-title');
        if (selectTitle) selectTitle.textContent = t.selectCharacterTitle;

        const purchaseBtn = document.getElementById('purchase-btn');
        if (purchaseBtn) purchaseBtn.textContent = t.purchaseButton;

        const detailsTitle = document.getElementById('character-details-title');
        if (detailsTitle) detailsTitle.textContent = t.characterDetailsTitle;

        // Update modal elements if they exist
        const modalLabel = document.getElementById('pixelBlockModalLabel');
        if (modalLabel) modalLabel.textContent = t.modalTitle;

        const modalBody = document.querySelector('#pixelBlockModal .modal-body p');
        if (modalBody) modalBody.textContent = t.modalBody;

        const modalButton = document.querySelector('#pixelBlockModal .modal-footer .btn');
        if (modalButton) modalButton.textContent = t.modalButton;
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const pixelBlockPage = new PixelBlockPage();
    
    // Make it globally available for modal interactions
    window.pixelBlockPage = pixelBlockPage;
    
    // Make update function available globally for language switcher
    window.updatePixelBlockPageUI = () => pixelBlockPage.updateUI();
});