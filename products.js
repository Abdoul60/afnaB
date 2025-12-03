// Base de données des produits
let products = [
    {
        id: 1,
        name: "Montre Personnalisée",
        category: "montres",
        price: 15000,
        image: "images/montre1.jpg",
        description: "Montre élégante avec gravure personnalisée",
        colors: ["Noir", "Or", "Argent"],
        inStock: true
    },
    {
        id: 2,
        name: "Lunettes de Soleil",
        category: "lunettes",
        price: 12000,
        image: "images/lunettes1.jpg",
        description: "Lunettes tendance avec verres teintés",
        colors: ["Noir", "Marron"],
        inStock: true
    },
    {
        id: 3,
        name: "Montre Sportive",
        category: "montres",
        price: 18000,
        image: "images/montre2.jpg",
        description: "Montre résistante à l'eau pour le sport",
        colors: ["Bleu", "Noir"],
        inStock: true
    },
    {
        id: 4,
        name: "Lunettes Optiques",
        category: "lunettes",
        price: 20000,
        image: "images/lunettes2.jpg",
        description: "Lunettes optiques avec verres progressifs",
        colors: ["Noir", "Marron", "Doré"],
        inStock: true
    },
    {
        id: 5,
        name: "Montre Luxe",
        category: "montres",
        price: 35000,
        image: "images/montre3.jpg",
        description: "Montre de luxe avec bracelet cuir véritable",
        colors: ["Noir", "Marron"],
        inStock: true
    },
    {
        id: 6,
        name: "Lunettes Vintage",
        category: "lunettes",
        price: 14000,
        image: "images/lunettes3.jpg",
        description: "Lunettes rétro style vintage",
        colors: ["Or", "Argent", "Rose"],
        inStock: true
    },
    {
        id: 7,
        name: "Montre Digitale",
        category: "montres",
        price: 8000,
        image: "images/montre4.jpg",
        description: "Montre digitale avec affichage LED",
        colors: ["Noir", "Blanc"],
        inStock: true
    },
    {
        id: 8,
        name: "Lunettes Polarisées",
        category: "lunettes",
        price: 16000,
        image: "images/lunettes4.jpg",
        description: "Lunettes polarisées anti-reflet",
        colors: ["Noir", "Bleu"],
        inStock: false
    }
];

// Charger les produits depuis localStorage
function loadProducts() {
    const stored = localStorage.getItem('afnaProducts');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        saveProducts();
    }
    return products;
}

// Sauvegarder les produits
function saveProducts() {
    localStorage.setItem('afnaProducts', JSON.stringify(products));
}

// Initialiser au chargement
loadProducts();

// Fonction pour récupérer tous les produits
function getAllProducts() {
    return products;
}

// Fonction pour récupérer les 4 premiers produits
function getFeaturedProducts() {
    return products.slice(0, 4);
}

// Fonction pour récupérer un produit par ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Fonction pour ajouter un nouveau produit
function addProduct(newProduct) {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const product = {
        id: newId,
        ...newProduct
    };
    products.push(product);
    saveProducts();
    console.log("Produit ajouté :", product);
    return product;
}

// Fonction pour mettre à jour un produit
function updateProduct(id, updatedData) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedData };
        saveProducts();
        return products[index];
    }
    return null;
}

// Fonction pour supprimer un produit
function deleteProduct(id) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products.splice(index, 1);
        saveProducts();
        return true;
    }
    return false;
}

// Fonction pour filtrer par catégorie
function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

// Fonction pour chercher un produit
function searchProducts(keyword) {
    return products.filter(product =>
        product.name.toLowerCase().includes(keyword.toLowerCase()) ||
        product.description.toLowerCase().includes(keyword.toLowerCase())
    );
}

// ========== GESTION DU PANIER ==========

// Récupérer le panier
function getCart() {
    const cart = localStorage.getItem('afnaCart');
    return cart ? JSON.parse(cart) : [];
}

// Ajouter au panier
function addToCart(productId, quantity = 1, color = 'Noir') {
    const product = getProductById(productId);
    if (!product) return false;

    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId && item.color === color);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            color: color
        });
    }

    localStorage.setItem('afnaCart', JSON.stringify(cart));
    return true;
}

// Supprimer du panier
function removeFromCart(productId, color = 'Noir') {
    let cart = getCart();
    cart = cart.filter(item => !(item.id === productId && item.color === color));
    localStorage.setItem('afnaCart', JSON.stringify(cart));
}

// Vider le panier
function clearCart() {
    localStorage.removeItem('afnaCart');
}

// Calculer le total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Obtenir le nombre d'articles
function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}