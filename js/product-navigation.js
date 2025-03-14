/**
 * Product Navigation
 * Makes all product cards clickable and directs to product detail page
 */

document.addEventListener("DOMContentLoaded", () => {
    // Find all product cards on the page
    const productCards = document.querySelectorAll(".card");
    
    productCards.forEach(card => {
      // Get product information
      let productId;
      
      // Try to get product ID from different possible sources
      const addToCartButton = card.querySelector(".add_to_cart");
      if (addToCartButton) {
        productId = addToCartButton.getAttribute("data-id");
      }
      
      // If no ID found from add to cart button, try to find it from other elements
      if (!productId) {
        const idElement = card.querySelector("[data-product-id]");
        if (idElement) {
          productId = idElement.getAttribute("data-product-id");
        }
      }
      
      // If still no ID, try to extract from any href that might contain it
      if (!productId) {
        const linkElement = card.querySelector("a[href*='product-detail.html']");
        if (linkElement) {
          const url = new URL(linkElement.href);
          productId = url.searchParams.get("id");
        }
      }
      
      // Skip if no product ID found
      if (!productId) {
        console.warn("Product card found without ID, skipping click functionality", card);
        return;
      }
      
      // Make card clickable
      makeCardClickable(card, productId);
    });
    
    /**
     * Makes a card clickable to navigate to product detail page
     * @param {HTMLElement} card - The product card element
     * @param {string} productId - The product ID
     */
    function makeCardClickable(card, productId) {
      // Add a visual indicator that the card is clickable
      card.style.cursor = "pointer";
      
      // Add a subtle hover effect if not already present
      if (!card.classList.contains("clickable-card")) {
        card.classList.add("clickable-card");
        
        // Add hover styles with JavaScript to avoid modifying CSS files
        const style = document.createElement("style");
        style.textContent = `
          .clickable-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .clickable-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
        `;
        document.head.appendChild(style);
      }
      
      // Find elements that should not trigger navigation when clicked
      const nonClickableElements = card.querySelectorAll(
        ".add_to_cart, .card_top_icon, button, .wishlist-icon, .view-icon, a"
      );
      
      // Add click event to the card
      card.addEventListener("click", (event) => {
        // Check if the click was on a non-clickable element or its child
        for (const element of nonClickableElements) {
          if (element.contains(event.target)) {
            // If clicked on a non-clickable element, don't navigate
            return;
          }
        }
        
        // Navigate to product detail page
        window.location.href = `./product-detail.html?id=${productId}`;
      });
      
      // Find card image and title to make them explicitly clickable
      const cardImage = card.querySelector(".card_img");
      const cardTitle = card.querySelector(".card_title");
      
      // Make image clickable
      if (cardImage) {
        cardImage.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent double navigation
          window.location.href = `./product-detail.html?id=${productId}`;
        });
      }
      
      // Make title clickable
      if (cardTitle) {
        cardTitle.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent double navigation
          window.location.href = `./product-detail.html?id=${productId}`;
        });
        
        // Add underline on hover to indicate clickable title
        cardTitle.style.transition = "color 0.3s ease";
        cardTitle.addEventListener("mouseenter", () => {
          cardTitle.style.color = "var(--colo-primary)";
          cardTitle.style.textDecoration = "underline";
        });
        
        cardTitle.addEventListener("mouseleave", () => {
          cardTitle.style.color = "";
          cardTitle.style.textDecoration = "none";
        });
      }
    }
    
    // Add click functionality to products in other layouts
    addClickToProductGrid();
    addClickToFeaturedProducts();
    addClickToSearchResults();
    
    /**
     * Adds click functionality to products in grid layout
     */
    function addClickToProductGrid() {
      const gridProducts = document.querySelectorAll(".products .product-item");
      
      gridProducts.forEach(product => {
        const productId = product.getAttribute("data-id") || 
                          product.querySelector("[data-id]")?.getAttribute("data-id");
        
        if (productId) {
          makeCardClickable(product, productId);
        }
      });
    }
    
    /**
     * Adds click functionality to featured products
     */
    function addClickToFeaturedProducts() {
      const featuredProducts = document.querySelectorAll(".featured-products .product");
      
      featuredProducts.forEach(product => {
        const productId = product.getAttribute("data-id") || 
                          product.querySelector("[data-id]")?.getAttribute("data-id");
        
        if (productId) {
          makeCardClickable(product, productId);
        }
      });
    }
    
    /**
     * Adds click functionality to search results
     */
    function addClickToSearchResults() {
      const searchResults = document.querySelectorAll(".search-results .product");
      
      searchResults.forEach(product => {
        const productId = product.getAttribute("data-id") || 
                          product.querySelector("[data-id]")?.getAttribute("data-id");
        
        if (productId) {
          makeCardClickable(product, productId);
        }
      });
    }
  });