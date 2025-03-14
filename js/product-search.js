/**
 * Product Search and Filter
 * Enables searching and filtering products by name or category
 */

document.addEventListener("DOMContentLoaded", () => {
    // Get search elements
    const searchForm = document.getElementById("product-search-form");
    const searchInput = document.getElementById("product-search-input");
    const categoryFilter = document.getElementById("search-filter-category");
    
    // Create search results container if it doesn't exist
    let searchResultsContainer = document.querySelector(".search-results-container");
    
    if (!searchResultsContainer) {
      searchResultsContainer = document.createElement("div");
      searchResultsContainer.className = "search-results-container";
      
      // Create search results header
      const searchResultsHeader = document.createElement("div");
      searchResultsHeader.className = "search-results-header";
      searchResultsHeader.innerHTML = `
        <div class="search-results-title">Search Results</div>
        <div class="search-results-count">0 products found</div>
      `;
      
      // Create search results grid
      const searchResults = document.createElement("div");
      searchResults.className = "search-results";
      
      // Append elements to container
      searchResultsContainer.appendChild(searchResultsHeader);
      searchResultsContainer.appendChild(searchResults);
      
      // Insert after the first section
      const firstSection = document.querySelector(".section");
      if (firstSection) {
        firstSection.parentNode.insertBefore(searchResultsContainer, firstSection.nextSibling);
      } else {
        // Fallback: append to body
        document.body.appendChild(searchResultsContainer);
      }
    }
    
    // Sample product data - in a real app, this would come from an API or database
    const products = [
      {
        id: "1",
        title: "HAVIT HV-G92 Gamepad",
        price: "120",
        category: "Gaming",
        image: "./image/items/item-1.png",
        description: "Experience gaming like never before with the HAVIT HV-G92 Gamepad."
      },
      {
        id: "2",
        title: "AK-900 Wired Keyboard",
        price: "80",
        category: "Computer Accessories",
        image: "./image/items/item-2.png",
        description: "The AK-900 Wired Keyboard offers a premium typing experience."
      },
      {
        id: "3",
        title: "IPS LCD Gaming Monitor",
        price: "370",
        category: "Monitors",
        image: "./image/items/item-3.png",
        description: "Immerse yourself in stunning visuals with our IPS LCD Gaming Monitor."
      },
      {
        id: "4",
        title: "S-Series Comfort Chair",
        price: "120",
        category: "Furniture",
        image: "./image/items/item-4.png",
        description: "The S-Series Comfort Chair provides exceptional comfort and support."
      },
      {
        id: "5",
        title: "The North Coat",
        price: "120",
        category: "Clothing",
        image: "./image/items/item-5.png",
        description: "Stay warm and stylish with The North Coat."
      },
      {
        id: "6",
        title: "RGB Liquid CPU Cooler",
        price: "160",
        category: "Computer Accessories",
        image: "./image/items/item-6.png",
        description: "Keep your CPU cool with the RGB Liquid CPU Cooler."
      },
      {
        id: "7",
        title: "Gucci Duffle Bag",
        price: "960",
        category: "Fashion",
        image: "./image/items/item-7.png",
        description: "Carry your essentials in style with the Gucci Duffle Bag."
      },
      {
        id: "8",
        title: "Small BookShelf",
        price: "360",
        category: "Furniture",
        image: "./image/items/item-8.png",
        description: "Organize your books with our Small BookShelf."
      }
    ];
    
    // Handle search form submission
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      performSearch();
    });
    
    // Handle input changes for real-time filtering
    searchInput.addEventListener("input", debounce(performSearch, 300));
    categoryFilter.addEventListener("change", performSearch);
    
    /**
     * Performs the search based on current input and filter values
     */
    function performSearch() {
      const searchTerm = searchInput.value.trim().toLowerCase();
      const categoryValue = categoryFilter.value;
      
      // Skip search if term is too short and no category is selected
      if (searchTerm.length < 2 && categoryValue === "all") {
        searchResultsContainer.classList.remove("active");
        return;
      }
      
      // Filter products based on search term and category
      const filteredProducts = products.filter(product => {
        const matchesSearch = searchTerm.length < 2 || 
                             product.title.toLowerCase().includes(searchTerm) || 
                             product.description.toLowerCase().includes(searchTerm);
        
        const matchesCategory = categoryValue === "all" || 
                               product.category === categoryValue;
        
        return matchesSearch && matchesCategory;
      });
      
      // Display search results
      displaySearchResults(filteredProducts, searchTerm);
    }
    
    /**
     * Displays search results in the container
     * @param {Array} results - Filtered products to display
     * @param {string} searchTerm - The search term for highlighting
     */
    function displaySearchResults(results, searchTerm) {
      const searchResultsElement = searchResultsContainer.querySelector(".search-results");
      const searchResultsCount = searchResultsContainer.querySelector(".search-results-count");
      
      // Update results count
      searchResultsCount.textContent = `${results.length} product${results.length !== 1 ? 's' : ''} found`;
      
      // Show search results container
      searchResultsContainer.classList.add("active");
      
      // Clear previous results
      searchResultsElement.innerHTML = "";
      
      if (results.length === 0) {
        // Display no results message
        searchResultsElement.innerHTML = `
          <div class="no-results">
            <h3>No products found</h3>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
            <button class="clear-search">Clear Search</button>
          </div>
        `;
        
        // Add event listener to clear search button
        const clearSearchButton = searchResultsElement.querySelector(".clear-search");
        clearSearchButton.addEventListener("click", () => {
          searchInput.value = "";
          categoryFilter.value = "all";
          searchResultsContainer.classList.remove("active");
        });
        
        return;
      }
      
      // Create product cards for each result
      results.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "card";
        productCard.setAttribute("data-product-id", product.id);
        
        // Highlight search term in title if present
        let highlightedTitle = product.title;
        if (searchTerm.length >= 2) {
          const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
          highlightedTitle = product.title.replace(regex, '<span class="product-highlight">$1</span>');
        }
        
        productCard.innerHTML = `
          <div class="card_top">
            <img src="${product.image}" alt="${product.title}" class="card_img" />
            <div class="card_top_icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="card_top_icon">
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
                class="card_top_icon">
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
            <h3 class="card_title">${highlightedTitle}</h3>
            <p class="card_price">$${product.price}</p>
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
              data-id="${product.id}"
              data-title="${product.title}"
              data-image="${product.image}"
              data-price="${product.price}">
              Add to Cart
            </button>
          </div>
        `;
        
        searchResultsElement.appendChild(productCard);
      });
      
      // Make product cards clickable
      makeProductCardsClickable();
      
      // Add event listeners to "Add to Cart" buttons
      addCartButtonListeners();
    }
    
    /**
     * Makes product cards clickable to navigate to product detail page
     */
    function makeProductCardsClickable() {
      const productCards = document.querySelectorAll(".search-results .card");
      
      productCards.forEach(card => {
        const productId = card.getAttribute("data-product-id");
        
        if (!productId) return;
        
        // Find elements that should not trigger navigation when clicked
        const nonClickableElements = card.querySelectorAll(
          ".add_to_cart, .card_top_icon, button"
        );
        
        // Add click event to the card
        card.addEventListener("click", (event) => {
          // Check if the click was on a non-clickable element or its child
          for (const element of nonClickableElements) {
            if (element && element.contains(event.target)) {
              // If clicked on a non-clickable element, don't navigate
              return;
            }
          }
          
          // Navigate to product detail page
          window.location.href = `./product-detail.html?id=${productId}`;
        });
        
        // Add cursor pointer to indicate clickable
        card.style.cursor = "pointer";
      });
    }
    
    /**
     * Adds event listeners to "Add to Cart" buttons
     */
    function addCartButtonListeners() {
      const addToCartButtons = document.querySelectorAll(".search-results .add_to_cart");
      
      addToCartButtons.forEach(button => {
        button.addEventListener("click", function(e) {
          e.preventDefault();
          e.stopPropagation(); // Prevent event bubbling
          
          // Get product data from button attributes
          const product = {
            id: this.getAttribute("data-id"),
            title: this.getAttribute("data-title"),
            price: this.getAttribute("data-price"),
            image: this.getAttribute("data-image"),
            quantity: 1
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
    }
    
    /**
     * Adds a product to the cart
     * @param {Object} product - The product to add to the cart
     * @param {number} quantity - The quantity to add
     * @returns {Array} - The updated cart
     */
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
      updateCartCount();
      
      // Show notification
      showNotification(`${product.title} added to cart!`);
      
      return cart;
    }
    
    /**
     * Updates the cart count in the UI
     */
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((total, item) => total + (parseInt(item.quantity) || 1), 0);
      
      // Update all cart count elements
      const cartCountElements = document.querySelectorAll(".cart-count");
      cartCountElements.forEach((element) => {
        element.textContent = count;
      });
    }
    
    /**
     * Shows a notification message
     * @param {string} message - The message to display
     */
    function showNotification(message) {
      // Create notification element if it doesn't exist
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
    
    /**
     * Debounce function to limit how often a function is called
     * @param {Function} func - The function to debounce
     * @param {number} wait - The debounce delay in milliseconds
     * @returns {Function} - The debounced function
     */
    function debounce(func, wait) {
      let timeout;
      return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
      };
    }
    
    /**
     * Escapes special characters in a string for use in a regular expression
     * @param {string} string - The string to escape
     * @returns {string} - The escaped string
     */
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  });