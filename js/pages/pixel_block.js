// Pixel Block Page - Dynamic product loading
document.addEventListener('DOMContentLoaded', async () => {
    const pixelBlockService = new PixelBlockService();
    
    // Load products
    const products = await pixelBlockService.loadProducts();
    
    if (products.length === 0) {
        console.error('No products loaded');
        return;
    }
    
    // Render products
    renderProducts(products);
    
    // Initialize modal functionality
    initializeModal();
});

function renderProducts(products) {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) {
        console.error('Gallery grid not found');
        return;
    }
    
    // Clear existing content
    galleryGrid.innerHTML = '';
    
    // Get current language
    const currentLang = document.getElementById('language-flag')?.dataset.lang || 'pt';
    
    // Render each product
    products.forEach(product => {
        const galleryItem = createGalleryItem(product, currentLang);
        galleryGrid.appendChild(galleryItem);
    });
}

function createGalleryItem(product, lang) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.dataset.images = JSON.stringify(product.images);
    
    const displayName = lang === 'en' ? (product.name_en || product.name) : product.name;
    const firstImage = product.images[0];
    
    div.innerHTML = `
        <img src="${firstImage}" alt="${displayName}" class="pixel-icon">
        <div class="icon-overlay">
            <i class="fas fa-search-plus"></i>
        </div>
        <div class="icon-name">${displayName}</div>
    `;
    
    return div;
}

function initializeModal() {
    const modalElement = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const imageCounter = document.getElementById('imageCounter');
    
    let currentImages = [];
    let currentIndex = 0;
    let bsModal = null;
    
    if (modalElement) {
        bsModal = new bootstrap.Modal(modalElement);
    }
    
    // Open modal when clicking on gallery items
    document.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        if (galleryItem && bsModal) {
            currentImages = JSON.parse(galleryItem.dataset.images);
            currentIndex = 0;
            showImage(currentIndex);
            bsModal.show();
        }
    });
    
    // Navigate images
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            showImage(currentIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % currentImages.length;
            showImage(currentIndex);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modalElement && modalElement.classList.contains('show')) {
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
                showImage(currentIndex);
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % currentImages.length;
                showImage(currentIndex);
            }
        }
    });
    
    function showImage(index) {
        if (modalImg && currentImages[index]) {
            modalImg.src = currentImages[index];
            
            // Update counter
            if (imageCounter) {
                imageCounter.textContent = `${index + 1} / ${currentImages.length}`;
                imageCounter.style.display = currentImages.length > 1 ? 'inline' : 'none';
            }
            
            // Update navigation button visibility
            if (prevBtn && nextBtn) {
                prevBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
                nextBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
            }
        }
    }
}
