/**
 * Product Detail Page with Cart Functionality
 * This script handles the product detail page and enables adding products to cart
 */

document.addEventListener("DOMContentLoaded", () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
  
    if (!productId) {
      // Redirect to home if no product ID is provided
      window.location.href = "./index.html";
      return;
    }
  
    // Sample product data - in a real app, this would come from an API or database
    const products = [
      {
        id: "1",
        title: "HAVIT HV-G92 Gamepad",
        price: "120",
        description:
          "Experience gaming like never before with the HAVIT HV-G92 Gamepad. This premium controller features ergonomic design, responsive buttons, and precision control for an immersive gaming experience. Compatible with multiple platforms including PC, PlayStation, and mobile devices.",
        images: ["./image/items/item-1.png", "./image/items/item-2.png", "./image/items/item-3.png"],
        sku: "GP-HV-G92",
        category: "Gaming",
        tags: "Gaming, Controller, Electronics",
      },
      {
        id: "2",
        title: "AK-900 Wired Keyboard",
        price: "80",
        description:
          "The AK-900 Wired Keyboard offers a premium typing experience with mechanical switches, customizable RGB lighting, and a durable aluminum frame. Perfect for gaming and professional use with programmable macros and anti-ghosting technology.",
        images: ["./image/items/item-2.png", "./image/items/item-3.png", "./image/items/item-4.png"],
        sku: "KB-AK-900",
        category: "Computer Accessories",
        tags: "Keyboard, Gaming, Electronics",
      },
      {
        id: "3",
        title: "IPS LCD Gaming Monitor",
        price: "370",
        description:
          "Immerse yourself in stunning visuals with our IPS LCD Gaming Monitor. Featuring a high refresh rate, ultra-low response time, and HDR support, this monitor delivers exceptional color accuracy and smooth gameplay. The adjustable stand and anti-glare screen ensure comfort during extended gaming sessions.",
        images: ["./image/items/item-3.png", "./image/items/item-4.png", "./image/items/item-5.png"],
        sku: "MN-IPS-27",
        category: "Monitors",
        tags: "Monitor, Gaming, Electronics",
      },
      {
        id: "4",
        title: "S-Series Comfort Chair",
        price: "120",
        description:
          "The S-Series Comfort Chair provides exceptional comfort and support for long hours of sitting. With ergonomic design, adjustable height, and premium materials, this chair is perfect for home offices and gaming setups.",
        images: ["./image/items/item-4.png", "./image/items/item-5.png", "./image/items/item-6.png"],
        sku: "CH-S-COMFORT",
        category: "Furniture",
        tags: "Chair, Office, Furniture",
      },
      {
        id: "5",
        title: "The North Coat",
        price: "120",
        description:
          "Stay warm and stylish with The North Coat. This premium winter coat features water-resistant material, thermal insulation, and a modern design that looks great in any setting.",
        images: ["./image/items/item-5.png", "./image/items/item-6.png", "./image/items/item-7.png"],
        sku: "CL-NORTH-COAT",
        category: "Clothing",
        tags: "Coat, Winter, Fashion",
      },
    ];
  
    // Find the product by ID
    const product = products.find((p) => p.id === productId);
  
    if (!product) {
      // Redirect to home if product is not found
      window.location.href = "./index.html";
      return;
    }
  
    // Populate product details
    document.getElementById("product-title").textContent = product.title;
    document.getElementById("product-price").textContent = `$${product.price}`;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-sku").textContent = product.sku;
    document.getElementById("product-category").textContent = product.category;
    document.getElementById("product-tags").textContent = product.tags;
  
    // Set main product image
    const mainImage = document.getElementById("main-product-image");
    mainImage.src = product.images[0];
    mainImage.alt = product.title;
  
    // Create thumbnails
    const thumbnailsContainer = document.querySelector(".product-detail-thumbnails");
    thumbnailsContainer.innerHTML = ''; // Clear existing thumbnails
    
    product.images.forEach((image, index) => {
      const thumbnail = document.createElement("div");
      thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`;
      thumbnail.innerHTML = `<img src="${image}" alt="${product.title} - Image ${index + 1}">`;
  
      // Add click event to change main image
      thumbnail.addEventListener("click", function () {
        mainImage.src = image;
  
        // Update active thumbnail
        document.querySelectorAll(".thumbnail").forEach((thumb) => {
          thumb.classList.remove("active");
        });
        this.classList.add("active");
      });
  
      thumbnailsContainer.appendChild(thumbnail);
    });
  
    // Quantity selector functionality
    const quantityInput = document.getElementById("quantity");
    const decreaseBtn = document.getElementById("decrease-quantity");
    const increaseBtn = document.getElementById("increase-quantity");
  
    decreaseBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
  
    increaseBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value);
      if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
      }
    });
  
    // Validate quantity input to ensure it's a number between 1 and 10
    quantityInput.addEventListener("change", () => {
      let value = parseInt(quantityInput.value);
      
      if (isNaN(value) || value < 1) {
        value = 1;
      } else if (value > 10) {
        value = 10;
      }
      
      quantityInput.value = value;
    });
  
    // Add to cart functionality
    const addToCartBtn = document.getElementById("add-to-cart");
    addToCartBtn.addEventListener("click", () => {
      const quantity = Number.parseInt(quantityInput.value);
      
      // Add product to cart
      addToCart(product, quantity);
      
      // Show success animation on button
      addToCartBtn.classList.add("added");
      addToCartBtn.textContent = "Added to Cart!";
      
      setTimeout(() => {
        addToCartBtn.classList.remove("added");
        addToCartBtn.textContent = "Add to Cart";
      }, 2000);
    });
  
    // Add to wishlist functionality
    const wishlistBtn = document.getElementById("add-to-wishlist");
    wishlistBtn.addEventListener("click", () => {
      // Toggle wishlist state
      wishlistBtn.classList.toggle("active");
      
      if (wishlistBtn.classList.contains("active")) {
        showNotification(`${product.title} added to wishlist!`);
      } else {
        showNotification(`${product.title} removed from wishlist!`);
      }
    });
  
    // Function to add item to cart
    function addToCart(product, quantity = 1) {
      // Get current cart or initialize empty array
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      
      // Prepare cart item
      const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        quantity: quantity
      };
  
      // Check if product already exists in cart
      const existingProductIndex = cart.findIndex((item) => item.id === product.id);
  
      if (existingProductIndex !== -1) {
        // Update quantity if product already exists
        cart[existingProductIndex].quantity = 
          (parseInt(cart[existingProductIndex].quantity) || 1) + parseInt(quantity);
      } else {
        // Add new product to cart
        cart.push(cartItem);
      }
  
      // Save updated cart
      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Update cart count
      updateCartCount();
      
      // Show notification
      showNotification(`${product.title} added to cart!`);
      
      return cart;
    }
  
    // Function to update cart count in the UI
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((total, item) => total + (parseInt(item.quantity) || 1), 0);
      
      // Update all cart count elements
      const cartCountElements = document.querySelectorAll(".cart-count");
      cartCountElements.forEach((element) => {
        element.textContent = count;
      });
      
      // Add cart count element if it doesn't exist
      const cartIcon = document.querySelector(".nav_cart");
      if (cartIcon && !document.querySelector(".cart-count")) {
        const countElement = document.createElement("span");
        countElement.className = "cart-count";
        countElement.textContent = count;
        
        // Add the count element to the cart icon's parent
        const cartLink = cartIcon.closest("a");
        if (cartLink) {
          cartLink.style.position = "relative";
          cartLink.appendChild(countElement);
        }
      }
    }
  
    // Function to show notification
    function showNotification(message) {
      // Create or get existing notification element
      let notification = document.querySelector(".cart-notification");
      
      if (!notification) {
        notification = document.createElement("div");
        notification.className = "cart-notification";
        document.body.appendChild(notification);
        
        // Add styles to notification
        Object.assign(notification.style, {
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "var(--colo-primary)",
          color: "white",
          padding: "15px 20px",
          borderRadius: "5px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          zIndex: "9999",
          transition: "all 0.3s ease",
          opacity: "0",
          transform: "translateY(20px)"
        });
      }
      
      // Set notification content
      notification.textContent = message;
      
      // Show notification
      setTimeout(() => {
        notification.style.opacity = "1";
        notification.style.transform = "translateY(0)";
      }, 100);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transform = "translateY(20px)";
      }, 3000);
    }
  
    // Load related products
    loadRelatedProducts(product);
    
    // Initialize cart count
    updateCartCount();
  });
  
  // Function to load related products
  function loadRelatedProducts(currentProduct) {
    const relatedProductsContainer = document.querySelector(".related-products");
    
    // Sample products for related products section
    const allProducts = [
      {
        id: "1",
        title: "HAVIT HV-G92 Gamepad",
        price: "120",
        image: "./image/items/item-1.png",
      },
      {
        id: "2",
        title: "AK-900 Wired Keyboard",
        price: "80",
        image: "./image/items/item-2.png",
      },
      {
        id: "3",
        title: "IPS LCD Gaming Monitor",
        price: "370",
        image: "./image/items/item-3.png",
      },
      {
        id: "4",
        title: "S-Series Comfort Chair",
        price: "120",
        image: "./image/items/item-4.png",
      },
      {
        id: "5",
        title: "The North Coat",
        price: "120",
        image: "./image/items/item-5.png",
      },
      {
        id: "6",
        title: "RGB Liquid CPU Cooler",
        price: "160",
        image: "./image/items/item-6.png",
      },
      {
        id: "7",
        title: "Gucci Duffle Bag",
        price: "960",
        image: "./image/items/item-7.png",
      },
      {
        id: "8",
        title: "Small BookShelf",
        price: "360",
        image: "./image/items/item-8.png",
      },
    ];
  
    // Filter out the current product and get up to 4 related products
    const relatedProducts = allProducts
      .filter((p) => p.id !== currentProduct.id)
      .slice(0, 4);
  
    // Clear existing related products
    relatedProductsContainer.innerHTML = '';
  
    // Add related products
    relatedProducts.forEach((relatedProduct) => {
      const productCard = document.createElement("div");
      productCard.className = "card";
      productCard.innerHTML = `
        <div class="card_top">
          <img src="${relatedProduct.image}" alt="${relatedProduct.title}" class="card_img" />
          <div class="card_top_icons">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="card_top_icon wishlist-icon">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="card_top_icon view-icon">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <div class="card_body">
          <h3 class="card_title">${relatedProduct.title}</h3>
          <p class="card_price">$${relatedProduct.price}</p>
          <div class="card_ratings">
            <div class="card_stars">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6">
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clip-rule="evenodd" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6">
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clip-rule="evenodd" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6">
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clip-rule="evenodd" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6">
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clip-rule="evenodd" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6">
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <p class="card_rating_numbers">(88)</p>
          </div>
          <button 
            class="add_to_cart"
            data-id="${relatedProduct.id}"
            data-title="${relatedProduct.title}"
            data-image="${relatedProduct.image}"
            data-price="${relatedProduct.price}">
            Add to Cart
          </button>
        </div>
      `;
  
      relatedProductsContainer.appendChild(productCard);
      
      // Make the entire card clickable to view product details
      const cardTop = productCard.querySelector(".card_top");
      const cardBody = productCard.querySelector(".card_body");
      
      [cardTop, cardBody].forEach(element => {
        if (element) {
          element.addEventListener("click", (e) => {
            // Don't navigate if clicking on add to cart button or icons
            if (!e.target.closest(".add_to_cart") && !e.target.closest(".card_top_icon")) {
              window.location.href = `./product-detail.html?id=${relatedProduct.id}`;
            }
          });
          
          // Add cursor pointer to indicate clickable
          element.style.cursor = "pointer";
        }
      });
    });
    
    // Add event listeners to all "Add to Cart" buttons in related products
    document.querySelectorAll(".related-products .add_to_cart").forEach(button => {
      button.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling
        
        // Get product data from button attributes
        const product = {
          id: this.getAttribute("data-id"),
          title: this.getAttribute("data-title"),
          price: this.getAttribute("data-price"),
          image: this.getAttribute("data-image")
        };
        
        // Add product to cart
        addToCart(product);
        
        // Show success animation on button
        this.classList.add("added");
        this.textContent = "Added!";
        
        setTimeout(() => {
          this.classList.remove("added");
          this.textContent = "Add to Cart";
        }, 2000);
      });
    });
    
    // Function to add item to cart (for related products)
    function addToCart(product, quantity = 1) {
      // Get current cart or initialize empty array
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      
      // Check if product already exists in cart
      const existingProductIndex = cart.findIndex((item) => item.id === product.id);
      
      if (existingProductIndex !== -1) {
        // Update quantity if product already exists
        cart[existingProductIndex].quantity = 
          (parseInt(cart[existingProductIndex].quantity) || 1) + parseInt(quantity);
      } else {
        // Add new product to cart
        product.quantity = parseInt(quantity);
        cart.push(product);
      }
      
      // Save updated cart
      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Update cart count
      const count = cart.reduce((total, item) => total + (parseInt(item.quantity) || 1), 0);
      
      // Update all cart count elements
      const cartCountElements = document.querySelectorAll(".cart-count");
      cartCountElements.forEach((element) => {
        element.textContent = count;
      });
      
      // Show notification
      let notification = document.querySelector(".cart-notification");
      
      if (!notification) {
        notification = document.createElement("div");
        notification.className = "cart-notification";
        document.body.appendChild(notification);
        
        // Add styles to notification
        Object.assign(notification.style, {
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "var(--colo-primary)",
          color: "white",
          padding: "15px 20px",
          borderRadius: "5px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          zIndex: "9999",
          transition: "all 0.3s ease",
          opacity: "0",
          transform: "translateY(20px)"
        });
      }
      
      // Set notification content
      notification.textContent = `${product.title} added to cart!`;
      
      // Show notification
      setTimeout(() => {
        notification.style.opacity = "1";
        notification.style.transform = "translateY(0)";
      }, 100);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transform = "translateY(20px)";
      }, 3000);
      
      return cart;
    }
  }