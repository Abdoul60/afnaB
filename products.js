const firebaseConfig = {
  apiKey: "AIzaSyBlt2ngIUtgScbcBtZ4pa6Y_Rs5aR0dxNk",
  authDomain: "al-afna-business.firebaseapp.com",
  databaseURL: "https://al-afna-business-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "al-afna-business",
  storageBucket: "al-afna-business.firebasestorage.app",
  messagingSenderId: "876445206862",
  appId: "1:876445206862:web:7e79ed63f40425d6c7b61f"
};

// Initialiser Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
let products = [];

// ========== CHARGEMENT DES PRODUITS ==========

// Charger les produits depuis Firebase
function loadProducts() {
    return new Promise((resolve) => {
        database.ref('products').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convertir l'objet Firebase en tableau en préservant la clé si "id" absent
                products = Object.entries(data).map(([key, val]) => {
                    const idFromVal = val && val.id !== undefined ? val.id : undefined;
                    const id = idFromVal !== undefined
                        ? (typeof idFromVal === 'string' ? parseInt(idFromVal, 10) : idFromVal)
                        : (isNaN(parseInt(key, 10)) ? key : parseInt(key, 10));

                    return {
                        // garantir que les champs essentiels existent
                        id: id,
                        name: val.name || 'Produit',
                        category: val.category || 'autre',
                        price: val.price !== undefined ? val.price : 0,
                        image: val.image || 'images/placeholder.png',
                        description: val.description || '',
                        colors: Array.isArray(val.colors) ? val.colors : (val.colors ? [val.colors] : ['Noir']),
                        inStock: val.inStock !== undefined ? !!val.inStock : true,
                        ...val
                    };
                });
                // Trier par id pour un affichage stable (si id numérique)
                products.sort((a, b) => {
                    const ai = typeof a.id === 'number' ? a.id : parseInt(a.id, 10) || 0;
                    const bi = typeof b.id === 'number' ? b.id : parseInt(b.id, 10) || 0;
                    return ai - bi;
                });
                // Si des fonctions d'affichage existent, les appeler pour forcer la mise à jour
                if (typeof displayProducts === 'function') {
                    try { displayProducts(products); } catch (e) { console.warn('displayProducts error', e); }
                }
                if (typeof getFeaturedProducts === 'function') {
                    try { /* nothing - page peut appeler getFeaturedProducts() */ } catch (e) {}
                }
            } else {
                // Produits par défaut si la base est vide
                products = [
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
                    }
                ];
                saveProducts();
            }
            resolve(products);
        });
    });
}

// Sauvegarder tous les produits
function saveProducts() {
    const productsObj = {};
    products.forEach(product => {
        productsObj[product.id] = product;
    });
    database.ref('products').set(productsObj);
}

// Initialiser au chargement
loadProducts();

// ========== FONCTIONS PRODUITS ==========

function getAllProducts() {
    return products;
}

function getFeaturedProducts() {
    return products.slice(0, 4);
}

function getProductById(id) {
    return products.find(product => product.id === id);
}

function addProduct(newProduct) {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const product = {
        id: newId,
        ...newProduct
    };
    
    // Ajouter à Firebase
    database.ref(`products/${newId}`).set(product).then(() => {
        console.log("Produit ajouté et synchronisé :", product);
        // Ajouter au tableau local immédiatement
        products.push(product);
        // Déclencher une mise à jour du DOM si disponible
        if (typeof displayProducts === 'function') {
            displayProducts(products);
        }
    });
    
    return product;
}

function updateProduct(id, updatedData) {
    const product = { id, ...updatedData };
    
    // Mettre à jour dans Firebase
    database.ref(`products/${id}`).update(updatedData).then(() => {
        // Mettre à jour le tableau local
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedData };
        }
        // Rafraîchir l'affichage
        if (typeof displayProducts === 'function') {
            displayProducts(products);
        }
        console.log("Produit mis à jour :", product);
    });
    
    return product;
}

function deleteProduct(id) {
    // Supprimer de Firebase
    database.ref(`products/${id}`).remove().then(() => {
        // Supprimer du tableau local
        products = products.filter(p => p.id !== id);
        // Rafraîchir l'affichage
        if (typeof displayProducts === 'function') {
            displayProducts(products);
        }
        console.log("Produit supprimé (ID: " + id + ")");
    });
    
    return true;
}

function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

function searchProducts(keyword) {
    return products.filter(product =>
        product.name.toLowerCase().includes(keyword.toLowerCase()) ||
        product.description.toLowerCase().includes(keyword.toLowerCase())
    );
}

// ========== GESTION DU PANIER (reste en localStorage pour chaque utilisateur) ==========

function getCart() {
    const cart = localStorage.getItem('afnaCart');
    return cart ? JSON.parse(cart) : [];
}

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

function removeFromCart(productId, color = 'Noir') {
    let cart = getCart();
    cart = cart.filter(item => !(item.id === productId && item.color === color));
    localStorage.setItem('afnaCart', JSON.stringify(cart));
}

function clearCart() {
    localStorage.removeItem('afnaCart');
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}
