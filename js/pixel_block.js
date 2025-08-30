/*
==================== PIXEL BLOCK PAGE FUNCTIONALITY ====================

This file handles:
1. Simple image modal functionality for full-screen viewing
2. Translation support for the Pixel Block page
3. Interactive gallery features with multiple images per item

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

// Global variables for image navigation
let currentImages = [];
let currentImageIndex = 0;

// Function to show image in modal
function showImageInModal(imageSrc, altText) {
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modalImage.alt = altText;
}

// Function to show next image
function showNextImage() {
    if (currentImages.length > 1) {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        showImageInModal(currentImages[currentImageIndex], 'Image');
    }
}

// Function to show previous image
function showPreviousImage() {
    if (currentImages.length > 1) {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        showImageInModal(currentImages[currentImageIndex], 'Image');
    }
}

// Function to update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const imageCounter = document.getElementById('imageCounter');
    
    if (currentImages.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        imageCounter.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        imageCounter.style.display = 'block';
        imageCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
    }
}

// Simple Image Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    
    // Add click event listeners to all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get images array from data attribute
            const imagesData = this.getAttribute('data-images');
            currentImages = JSON.parse(imagesData);
            currentImageIndex = 0;
            const imageAlt = this.querySelector('img').getAttribute('alt');
            
            // Show first image
            showImageInModal(currentImages[0], imageAlt);
            
            // Update navigation
            updateNavigationButtons();
            
            // Show the modal
            imageModal.show();
        });
    });
    
    // Navigation button event listeners
    document.getElementById('prevBtn').addEventListener('click', showPreviousImage);
    document.getElementById('nextBtn').addEventListener('click', showNextImage);
    
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
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (imageModal._isShown) {
            if (e.key === 'ArrowLeft') {
                showPreviousImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
    
    // Initialize the page UI with current language
    if (window.updatePixelBlockPageUI) {
        window.updatePixelBlockPageUI();
    }
});

// Export for global access
window.pixelBlockTranslations = pixelBlockTranslations;
