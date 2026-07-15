// Sample Products Data (Real project-la ithu database-la irunthu varum)
const products = [
    { id: 1, name: "Trendy T-Shirt", price: "₹299", image: "https://picsum.photos/200/200?random=1" },
    { id: 2, name: "Smart Watch", price: "₹1,499", image: "https://picsum.photos/200/200?random=2" },
    { id: 3, name: "Wireless Earbuds", price: "₹999", image: "https://picsum.photos/200/200?random=3" },
    { id: 4, name: "Running Shoes", price: "₹799", image: "https://picsum.photos/200/200?random=4" }
];

const productsGrid = document.getElementById('products-grid');
const cartCount = document.getElementById('cart-count');
let currentCartCount = 0;

// Products-ai website-la render seiyum function
function displayProducts() {
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
    
productCard.innerHTML = `
    <a href="product.html" style="text-decoration: none; color: inherit;">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
    </a>
    <button class="add-to-cart" onclick="addToCart()">Add to Cart</button>
`;

        
        productsGrid.appendChild(productCard);
    });
}

// Add to Cart update function
function addToCart() {
    currentCartCount++;
    cartCount.innerText = currentCartCount;
    alert("Product added to IMA Store Cart! 🛒");
}

// Page load aagum pothu products-ai kaata
displayProducts();
