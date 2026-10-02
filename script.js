// State management
let cart = [];

// Sample Products
const products = [
  { id: 1, name: "Wireless Headphones", price: 99.99, category: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
  { id: 2, name: "Smart Watch", price: 199.99, category: "electronics", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
  { id: 3, name: "Running Shoes", price: 79.99, category: "clothing", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" },
  { id: 4, name: "Cotton T-Shirt", price: 19.99, category: "clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80" },
  { id: 5, name: "Desk Lamp", price: 39.99, category: "home", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80" },
  { id: 6, name: "Coffee Mug", price: 14.99, category: "home", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80" }
];

// Initialize functionality when the page loads
document.addEventListener('DOMContentLoaded', () => {
  loadCart(); // Load cart from local storage
  
  // Mobile Menu Toggle logic
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Cart Sidebar Toggle logic
  const cartIcon = document.getElementById('cart-icon');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeCartBtn = document.getElementById('close-cart');
  
  if (cartIcon && cartSidebar) {
    cartIcon.addEventListener('click', () => {
      cartSidebar.classList.add('open');
      renderCartItems(); // Update cart UI when opened
    });
  }
  
  if (closeCartBtn && cartSidebar) {
    closeCartBtn.addEventListener('click', () => {
      cartSidebar.classList.remove('open');
    });
  }

  // Search Functionality
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      // Only run search if we are on the products page
      if (window.location.pathname.includes('products.html')) {
        const filteredProducts = products.filter(p => p.name.toLowerCase().includes(query));
        renderProducts(filteredProducts);
      }
    });
  }

  // Render products if we are on pages that have the products container
  const productsContainer = document.getElementById('products-container');
  if (productsContainer) {
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    if (isHomePage) {
      // Show only first 3 products as featured on the home page
      renderProducts(products.slice(0, 3));
    } else {
      // Show all products on the products page
      renderProducts(products);
      setupFilters(); // Initialize category filters
    }
  }

  // Contact Form Validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent page reload
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Basic validation
      if (name && email && message) {
        alert('Thank you, ' + name + '! Your message has been sent successfully.');
        contactForm.reset(); // Clear the form
      } else {
        alert('Please fill in all fields.');
      }
    });
  }
});

// Setup Category Filters for Products Page
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove 'active' class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add 'active' class to the clicked button
      btn.classList.add('active');
      
      const category = btn.dataset.category;
      if (category === 'all') {
        renderProducts(products); // Show all
      } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered); // Show filtered by category
      }
    });
  });
}

// Function to render products HTML dynamically
function renderProducts(productsToRender) {
  const container = document.getElementById('products-container');
  if (!container) return;
  
  container.innerHTML = ''; // Clear container
  
  if (productsToRender.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products found.</p>';
    return;
  }
  
  // Create card for each product
  productsToRender.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

// Cart Functions

// Add product to cart array
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    cart.push(product);
    saveCart();
    updateCartCount();
    alert(product.name + ' added to cart!');
  }
}

// Remove product from cart array by its index
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  renderCartItems(); // Re-render the sidebar HTML
}

// Update the badge number on the cart icon
function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
  }
}

// Render items inside the cart sidebar
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  
  if (!cartItemsContainer || !cartTotalElement) return;
  
  cartItemsContainer.innerHTML = '';
  let total = 0;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalElement.textContent = '0.00';
    return;
  }
  
  cart.forEach((item, index) => {
    total += item.price;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });
  
  cartTotalElement.textContent = total.toFixed(2);
}

// Local Storage functionality to save cart data between page reloads
function saveCart() {
  localStorage.setItem('shopeasy_cart', JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem('shopeasy_cart');
  if (saved) {
    cart = JSON.parse(saved);
  }
  updateCartCount();
}
