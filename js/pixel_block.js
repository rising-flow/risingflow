/*
==================== PIXEL BLOCK PAGE FUNCTIONALITY ====================

This file handles:
1. Image modal functionality for full-screen viewing
2. Translation support for the Pixel Block page
3. Interactive gallery features

==========================================================================
*/

// Pixel Block page translations
const pixelBlockTranslations = {
    'pt-BR': {
        pageTitle: 'Rising Flow - Pixel Block',
        pixelBlockTitle: 'Pixel Block',
        pixelBlockSubtitle: 'Descubra nossa coleção exclusiva de ícones pixelados',
        galleryTitle: 'Modelos Pixel Block',
        // Navigation translations
        productsLink: 'Produtos',
        eventsLink: 'Eventos',
        songSearchLink: 'Buscador de Músicas',
        contactLink: 'Contato',
        pixelBlockLink: 'Pixel Block'
    },
    'en-GB': {
        pageTitle: 'Rising Flow - Pixel Block',
        pixelBlockTitle: 'Pixel Block',
        pixelBlockSubtitle: 'Discover our exclusive collection of pixelated icons',
        galleryTitle: 'Icon Gallery',
        // Navigation translations
        productsLink: 'Products',
        eventsLink: 'Events',
        songSearchLink: 'Song Searcher',
        contactLink: 'Contact',
        pixelBlockLink: 'Pixel Block'
    }
};

// Function to update the Pixel Block page UI based on current language
window.updatePixelBlockPageUI = function() {
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
    const t = pixelBlockTranslations[lang];
    
    // Update page title
    document.title = t.pageTitle;
    
    // Update navigation links
    document.getElementById('products-link-text').textContent = t.productsLink;
    document.getElementById('events-link-text').textContent = t.eventsLink;
    document.getElementById('song-search-link').textContent = t.songSearchLink;
    document.getElementById('contact-link').textContent = t.contactLink;
    document.getElementById('pixel-block-link').textContent = t.pixelBlockLink;
    
    // Update page content
    document.getElementById('pixel-block-title').textContent = t.pixelBlockTitle;
    document.getElementById('pixel-block-subtitle').textContent = t.pixelBlockSubtitle;
    document.getElementById('gallery-title').textContent = t.galleryTitle;
};

// Image Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    const modalImage = document.getElementById('modalImage');
    
    // Add click event listeners to all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            const imageAlt = this.querySelector('img').getAttribute('alt');
            
            // Set the modal image source and alt text
            modalImage.src = imageSrc;
            modalImage.alt = imageAlt;
            
            // Show the modal
            imageModal.show();
        });
    });
    
    // Close modal when clicking outside the image
    document.getElementById('imageModal').addEventListener('click', function(e) {
        if (e.target === this) {
            imageModal.hide();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModal._isShown) {
            imageModal.hide();
        }
    });
    
    // Initialize the page UI with current language
    if (window.updatePixelBlockPageUI) {
        window.updatePixelBlockPageUI();
    }
});

// Export for global access
window.pixelBlockTranslations = pixelBlockTranslations;
