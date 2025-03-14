// Utility functions for cart management
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || []
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
}

function addToCart(product, quantity = 1) {
  const cart = getCart()

  // Check if product already exists in cart
  const existingProductIndex = cart.findIndex((item) => item.id === product.id)

  if (existingProductIndex !== -1) {
    // Update quantity if product already exists
    cart[existingProductIndex].quantity =
      (Number.parseInt(cart[existingProductIndex].quantity) || 1) + Number.parseInt(quantity)
  } else {
    // Add new product to cart
    product.quantity = Number.parseInt(quantity)
    cart.push(product)
  }

  saveCart(cart)

  // Show notification
  showNotification(`${product.title} added to cart!`)

  return cart
}

function removeFromCart(productId) {
  let cart = getCart()
  cart = cart.filter((item) => item.id !== productId)
  saveCart(cart)
  return cart
}

function updateCartItemQuantity(productId, quantity) {
  const cart = getCart()
  const productIndex = cart.findIndex((item) => item.id === productId)

  if (productIndex !== -1) {
    cart[productIndex].quantity = Number.parseInt(quantity)

    // Remove item if quantity is 0
    if (cart[productIndex].quantity <= 0) {
      return removeFromCart(productId)
    }

    saveCart(cart)
  }

  return cart
}

function calculateCartTotal() {
  const cart = getCart()
  return cart.reduce((total, item) => {
    return total + Number.parseFloat(item.price) * (Number.parseInt(item.quantity) || 1)
  }, 0)
}

function clearCart() {
  localStorage.removeItem("cart")
  updateCartCount()
}

function updateCartCount() {
  const cart = getCart()
  const count = cart.reduce((total, item) => total + (Number.parseInt(item.quantity) || 1), 0)

  // Update all cart count elements
  const cartCountElements = document.querySelectorAll(".cart-count")
  cartCountElements.forEach((element) => {
    element.textContent = count
  })
}

function showNotification(message) {
  // Create notification element if it doesn't exist
  let notification = document.querySelector(".cart-notification")

  if (!notification) {
    notification = document.createElement("div")
    notification.className = "cart-notification"
    document.body.appendChild(notification)

    // Add styles
    notification.style.position = "fixed"
    notification.style.bottom = "20px"
    notification.style.right = "20px"
    notification.style.backgroundColor = "var(--colo-primary)"
    notification.style.color = "white"
    notification.style.padding = "15px 20px"
    notification.style.borderRadius = "5px"
    notification.style.zIndex = "1000"
    notification.style.opacity = "0"
    notification.style.transform = "translateY(20px)"
    notification.style.transition = "opacity 0.3s, transform 0.3s"
  }

  // Set message and show notification
  notification.textContent = message
  notification.style.opacity = "1"
  notification.style.transform = "translateY(0)"

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transform = "translateY(20px)"
  }, 3000)
}

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()
})

