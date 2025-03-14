// Updated cart.js with integrated delete functionality
document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.querySelector(".cart-items");

  // Function to get cart from localStorage
  function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  }

  // Function to save cart to localStorage
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  // Function to update cart count in UI
  function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + (parseInt(item.quantity) || 1), 0);
    
    // Update all cart count elements
    const cartCountElements = document.querySelectorAll(".cart-count");
    cartCountElements.forEach((element) => {
      element.textContent = count;
    });
  }

  // Function to calculate cart total
  function calculateCartTotal() {
    const cart = getCart();
    return cart.reduce(
      (total, item) => total + Number.parseFloat(item.price) * (Number.parseInt(item.quantity) || 1),
      0
    );
  }

  // Function to remove item from cart
  function removeFromCart(productId) {
    let cart = getCart();
    
    // Find product to remove (for notification)
    const productToRemove = cart.find(item => item.id === productId);
    
    // Remove the product
    cart = cart.filter(item => item.id !== productId);
    
    // Save updated cart
    saveCart(cart);
    
    // Show notification if product was found
    if (productToRemove) {
      showNotification(`${productToRemove.title} removed from cart!`);
    }
    
    // Refresh cart display
    displayCartItems();
    
    return cart;
  }

  // Function to update item quantity
  function updateCartItemQuantity(productId, quantity) {
    const cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
      cart[productIndex].quantity = Number.parseInt(quantity);

      // Remove item if quantity is 0
      if (cart[productIndex].quantity <= 0) {
        return removeFromCart(productId);
      }

      saveCart(cart);
    }

    return cart;
  }

  // Function to show notification
  function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector(".cart-notification");

    if (!notification) {
      notification = document.createElement("div");
      notification.className = "cart-notification";
      document.body.appendChild(notification);

      // Add styles
      notification.style.position = "fixed";
      notification.style.bottom = "20px";
      notification.style.right = "20px";
      notification.style.backgroundColor = "var(--colo-primary)";
      notification.style.color = "white";
      notification.style.padding = "15px 20px";
      notification.style.borderRadius = "5px";
      notification.style.zIndex = "1000";
      notification.style.opacity = "0";
      notification.style.transform = "translateY(20px)";
      notification.style.transition = "opacity 0.3s, transform 0.3s";
    }

    // Set message and show notification
    notification.textContent = message;
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(20px)";
    }, 3000);
  }

  // Function to display cart items
  function displayCartItems() {
    const cart = getCart();

    // Clear existing items
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      // Display empty cart message
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <a href="./index.html"><button>Continue Shopping</button></a>
        </div>
      `;
      return;
    }

    // Display cart items
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart_item";
      cartItem.innerHTML = `
        <p class="cart_id">${item.id}</p>
        <p class="cart_title">${item.title}</p>
        <img src="${item.image}" alt="${item.title}" class="cart_img" />
        <div class="cart-item-quantity">
          <button class="quantity-decrease" data-id="${item.id}">-</button>
          <span>${item.quantity || 1}</span>
          <button class="quantity-increase" data-id="${item.id}">+</button>
        </div>
        <p class="cart_price">$${(Number.parseFloat(item.price) * (Number.parseInt(item.quantity) || 1)).toFixed(2)}</p>
        <button class="cart_delete" data-id="${item.id}">Delete</button>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    // Add cart summary
    const cartTotal = calculateCartTotal();
    const summaryElement = document.createElement("div");
    summaryElement.className = "cart-summary";
    summaryElement.innerHTML = `
      <div class="cart-summary-row">
        <span>Subtotal:</span>
        <span>$${cartTotal.toFixed(2)}</span>
      </div>
      <div class="cart-summary-row">
        <span>Shipping:</span>
        <span>$${(cartTotal > 0 ? 10 : 0).toFixed(2)}</span>
      </div>
      <div class="cart-summary-row">
        <span>Total:</span>
        <span>$${(cartTotal + (cartTotal > 0 ? 10 : 0)).toFixed(2)}</span>
      </div>
      <div class="cart-actions">
        <a href="./index.html"><button class="continue-shopping">Continue Shopping</button></a>
        <button class="checkout-btn">Proceed to Checkout</button>
      </div>
    `;
    cartItemsContainer.appendChild(summaryElement);

    // Add event listeners for delete buttons
    setupDeleteButtons();

    // Add event listeners for quantity buttons
    setupQuantityButtons();

    // Add event listener for checkout button
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        alert("Checkout functionality would be implemented here!");
      });
    }
  }

  // Function to set up delete buttons
  function setupDeleteButtons() {
    document.querySelectorAll(".cart_delete").forEach((button) => {
      button.addEventListener("click", function() {
        const productId = this.getAttribute("data-id");
        removeFromCart(productId);
      });
    });
  }

  // Function to set up quantity buttons
  function setupQuantityButtons() {
    document.querySelectorAll(".quantity-decrease").forEach((button) => {
      button.addEventListener("click", function() {
        const productId = this.getAttribute("data-id");
        const cart = getCart();
        const item = cart.find((item) => item.id === productId);
        const newQuantity = (Number.parseInt(item.quantity) || 1) - 1;

        if (newQuantity > 0) {
          updateCartItemQuantity(productId, newQuantity);
        } else {
          removeFromCart(productId);
        }

        displayCartItems();
      });
    });

    document.querySelectorAll(".quantity-increase").forEach((button) => {
      button.addEventListener("click", function() {
        const productId = this.getAttribute("data-id");
        const cart = getCart();
        const item = cart.find((item) => item.id === productId);
        const newQuantity = (Number.parseInt(item.quantity) || 1) + 1;

        updateCartItemQuantity(productId, newQuantity);
        displayCartItems();
      });
    });
  }

  // Make functions available globally
  window.getCart = getCart;
  window.removeFromCart = removeFromCart;
  window.updateCartItemQuantity = updateCartItemQuantity;
  window.displayCartItems = displayCartItems;

  // Initialize cart display
  displayCartItems();
  updateCartCount();
});