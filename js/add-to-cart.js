/**
 * Add to Cart Feature
 * This script handles adding products to the cart when the "Add to Cart" button is clicked.
 * Save this as js/add-to-cart.js and include it in your index.html
 */

document.addEventListener('DOMContentLoaded', function() {
    // Select all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add_to_cart');
    
    // Function to update cart count in the UI
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + (parseInt(item.quantity) || 1), 0);
      
      // Update count display
      const cartCountElements = document.querySelectorAll('.cart-count');
      cartCountElements.forEach(element => {
        element.textContent = count;
      });
    }
    
    // Function to add item to cart
    function addToCart(product, quantity = 1) {
      // Get current cart or initialize empty array
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if product already exists in cart
      const existingProductIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingProductIndex !== -1) {
        // Update quantity if product already exists
        cart[existingProductIndex].quantity = (parseInt(cart[existingProductIndex].quantity) || 1) + parseInt(quantity);
      } else {
        // Add new product to cart
        product.quantity = parseInt(quantity);
        cart.push(product);
      }
      
      // Save updated cart
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Update cart count in UI
      updateCartCount();
      
      // Show notification
      showAddedToCartNotification(product.title);
      
      return cart;
    }
    
    // Function to show notification
    function showAddedToCartNotification(productTitle) {
      // Create or get existing notification element
      let notification = document.querySelector('.cart-notification');
      
      if (!notification) {
        notification = document.createElement('div');
        notification.className = 'cart-notification';
        document.body.appendChild(notification);
        
        // Add styles to notification
        Object.assign(notification.style, {
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#db4444', // Primary color from your CSS
          color: 'white',
          padding: '15px 20px',
          borderRadius: '5px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          zIndex: '9999',
          transition: 'all 0.3s ease',
          opacity: '0',
          transform: 'translateY(20px)'
        });
      }
      
      // Set notification content
      notification.textContent = `${productTitle} added to cart!`;
      
      // Show notification
      setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
      }, 100);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
      }, 3000);
    }
    
    // Add click event to all "Add to Cart" buttons
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling to parent elements
        
        // Get product data from button data attributes
        const product = {
          id: this.getAttribute('data-id'),
          title: this.getAttribute('data-title'),
          price: this.getAttribute('data-price'),
          image: this.getAttribute('data-image')
        };
        
        // Add product to cart
        addToCart(product);
      });
    });
    
    // Initialize cart count on page load
    updateCartCount();
  });