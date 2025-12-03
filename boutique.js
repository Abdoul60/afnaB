let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
});

function displayProducts(productsToDisplay) {
    const container = document.getElementById('productsContainer');
    
    if (productsToDisplay.length === 0) {
        container.innerHTML = '<div class="no-products"><i class="fas fa-search"></i><br><br>Aucun produit trouvé</div>';
        return;
    }

    container.innerHTML = productsToDisplay.map(product => `
        <div class="product-item">
            <div class="product-image">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     loading="lazy"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22250%22><rect fill=%22%23f0f0f0%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2214%22>Image non disponible</text></svg>'">
                <div class="stock-badge ${!product.inStock ? 'out' : ''}">
                    ${product.inStock ? '✓ En Stock' : '✗ Rupture'}
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                
                <div class="product-colors">
                    ${product.colors.map(color => `
                        <div class="color-dot" 
                             title="${color}" 
                             style="background-color: ${getColorCode(color)};">
                        </div>
                    `).join('')}
                </div>

                <div class="product-footer">
                    <div class="product-price">
                        ${product.price.toLocaleString()} FCFA
                    </div>
                    <button class="product-btn ${!product.inStock ? 'disabled' : ''}" 
                            onclick="addToCartAction(${product.id})"
                            title="${!product.inStock ? 'Produit indisponible' : 'Ajouter au panier'}"
                            ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        <span class="cart-text">Ajouter</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCartAction(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const color = product.colors[0] || 'Noir';
    addToCart(productId, 1, color);
    
    alert(`✅ ${product.name} ajouté au panier!\n\nPrix: ${product.price.toLocaleString()} FCFA`);
}

function filterByCategory(category) {
    currentFilter = category;
    
    // Mise à jour des boutons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.filter-btn').classList.add('active');

    // Afficher les produits filtrés
    if (category === 'all') {
        displayProducts(products);
    } else {
        displayProducts(getProductsByCategory(category));
    }
}

function filterBySearch() {
    const searchTerm = document.getElementById('searchInput').value;
    if (searchTerm.trim() === '') {
        displayProducts(products);
    } else {
        const results = searchProducts(searchTerm);
        displayProducts(results);
    }
}

function getColorCode(colorName) {
    const colors = {
        'Noir': '#1a1a1a',
        'Blanc': '#ffffff',
        'Or': '#d4af37',
        'Argent': '#c0c0c0',
        'Marron': '#8b4513',
        'Bleu': '#2196F3',
        'Doré': '#ffd700',
        'Rose': '#ff69b4',
        'Gris': '#808080',
        'Rouge': '#ff0000',
        'Vert': '#27ae60',
        'Jaune': '#f1c40f',
        'Orange': '#e67e22',
        'Violet': '#8e44ad'
    };
    return colors[colorName] || '#cccccc';
}