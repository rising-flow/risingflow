// PixelBlockService - Handles loading and managing Pixel Block products
class PixelBlockService {
    constructor() {
        this.basePath = this.detectBasePath();
        this.products = [];
    }

    detectBasePath() {
        const pathname = window.location.pathname;
        if (pathname.includes('/risingflow/')) {
            return '/risingflow/';
        }
        return '/';
    }

    async loadProducts() {
        try {
            // Load the manifest
            const manifestUrl = `${this.basePath}data/_manifests/pixel_block.json`;
            console.log('Loading pixel block manifest from:', manifestUrl);
            
            const manifestResponse = await fetch(manifestUrl);
            if (!manifestResponse.ok) {
                throw new Error(`Failed to load manifest: ${manifestResponse.status}`);
            }
            
            const manifest = await manifestResponse.json();
            console.log('Loaded manifest:', manifest);
            
            // Load each product
            const productPromises = manifest.products.map(async (filename) => {
                const productUrl = `${this.basePath}data/Products/PixelBlock/${filename}`;
                try {
                    const response = await fetch(productUrl);
                    if (!response.ok) {
                        console.warn(`Failed to load product ${filename}`);
                        return null;
                    }
                    return await response.json();
                } catch (error) {
                    console.warn(`Error loading product ${filename}:`, error);
                    return null;
                }
            });
            
            const loadedProducts = await Promise.all(productPromises);
            this.products = loadedProducts.filter(p => p !== null);
            
            // Sort by ID
            this.products.sort((a, b) => a.id - b.id);
            
            console.log(`Loaded ${this.products.length} products`);
            return this.products;
            
        } catch (error) {
            console.error('Error loading pixel block products:', error);
            return [];
        }
    }

    getProducts() {
        return this.products;
    }
}

// Export for use in other scripts
window.PixelBlockService = PixelBlockService;
