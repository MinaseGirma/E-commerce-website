/**
 * Delete from Cart Feature
 * This script handles removing products from the cart.
 * Save this as js/delete-from-cart.js and include it in your cart.html
 */

document.addEventListener('DOMContentLoaded', function() {
    // Function to remove an item from the cart
    function removeFromCart(productId) {
      // Get current cart
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Find the product to remove
      const productToRemove = cart.find(item => item.id === productId);
      let productName = '';
      
      if (productToRemove) {
        productName = productToRemove.title;
        
        // Filter out the product with the matching ID
        cart = cart.filter(item => item.id !== productId);
        
        // Save updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show notification
        showRemovedFromCartNotification(productName);
        
        // Refresh cart display if on cart page
        if (typeof displayCartItems === 'function') {
          displayCartItems();
        }
      }
      
      return cart;
    }
    
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
    
    // Function to show notification
    function showRemovedFromCartNotification(productTitle) {
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
      notification.textContent = `${productTitle} removed from cart!`;
      
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
    
    // Add event listeners to delete buttons
    function setupDeleteButtons() {
      const deleteButtons = document.querySelectorAll('.cart_delete');
      
      deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
          const productId = this.getAttribute('data-id');
          removeFromCart(productId);
        });
      });
    }
    
    // Initialize delete buttons if on cart page
    if (document.querySelector('.cart-items')) {
      // Initial setup
      setupDeleteButtons();
      
      // Create a MutationObserver to watch for changes in the cart items container
      // This ensures delete buttons work even after the cart is updated
      const cartItemsContainer = document.querySelector('.cart-items');
      
      const observer = new MutationObserver(function(mutations) {
        setupDeleteButtons();
      });
      
      observer.observe(cartItemsContainer, { childList: true, subtree: true });
    }
    
    // Expose the removeFromCart function globally so it can be used by other scripts
    window.removeFromCart = removeFromCart;
  });