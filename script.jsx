// Premium product data with exclusive items
const products = [
  { id: 1, title: "Artisan Wireless Headphones", price: 299.99, category: "electronics", emoji: "🎧" },
  { id: 2, title: "Swiss Luxury Timepiece", price: 899.99, category: "electronics", emoji: "⌚" },
  { id: 3, title: "Cashmere Blend Sweater", price: 189.99, category: "clothing", emoji: "👕" },
  { id: 4, title: "Italian Leather Jacket", price: 459.99, category: "clothing", emoji: "🧥" },
  { id: 5, title: "Artisan Coffee Collection", price: 149.99, category: "home", emoji: "☕" },
  { id: 6, title: "Designer Table Lamp", price: 239.99, category: "home", emoji: "💡" },
  { id: 7, title: "Limited Edition Art Book", price: 89.99, category: "books", emoji: "📚" },
  { id: 8, title: "Culinary Masterclass Collection", price: 129.99, category: "books", emoji: "📖" },
  { id: 9, title: "Premium Audio System", price: 349.99, category: "electronics", emoji: "🔊" },
  { id: 10, title: "Merino Wool Coat", price: 389.99, category: "clothing", emoji: "🧥" },
  { id: 11, title: "Handcrafted Ceramic Vase", price: 159.99, category: "home", emoji: "🏺" },
  { id: 12, title: "Collector's Photography Book", price: 199.99, category: "books", emoji: "📷" },
]

// State management
let cart = JSON.parse(localStorage.getItem("luxe-cart")) || []
let wishlist = JSON.parse(localStorage.getItem("luxe-wishlist")) || []
let currentFilter = "all"
let searchQuery = ""

// DOM elements
const productsGrid = document.getElementById("productsGrid")
const searchBar = document.getElementById("searchBar")
const filterBtns = document.querySelectorAll(".filter-btn")
const cartIcon = document.getElementById("cartIcon")
const cartDrawer = document.getElementById("cartDrawer")
const cartOverlay = document.getElementById("cartOverlay")
const closeCart = document.getElementById("closeCart")
const cartItems = document.getElementById("cartItems")
const cartCount = document.getElementById("cartCount")
const cartTotal = document.getElementById("cartTotal")
const checkoutBtn = document.getElementById("checkoutBtn")
const toast = document.getElementById("toast")
const themeToggle = document.getElementById("themeToggle")

// Initialize app
function init() {
  renderProducts()
  updateCartUI()
  setupEventListeners()

  // Load theme
  const savedTheme = localStorage.getItem("luxe-theme") || "light"
  document.documentElement.setAttribute("data-theme", savedTheme)
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙"
}

// Render products with premium styling
function renderProducts() {
  const filteredProducts = products.filter((product) => {
    const matchesCategory = currentFilter === "all" || product.category === currentFilter
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">$${product.price}</div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        Add to Collection
                    </button>
                    <button class="wishlist-btn ${wishlist.includes(product.id) ? "active" : ""}" 
                            onclick="toggleWishlist(${product.id})"
                            title="Add to Wishlist">
                        ⭐
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Add to cart with premium messaging
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  localStorage.setItem("luxe-cart", JSON.stringify(cart))
  updateCartUI()
  showToast("✨ Added to Your Collection")
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("luxe-cart", JSON.stringify(cart))
  updateCartUI()
  showToast("🗑️ Removed from Collection")
}

// Update quantity
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(productId)
    } else {
      localStorage.setItem("luxe-cart", JSON.stringify(cart))
      updateCartUI()
    }
  }
}

// Toggle wishlist
function toggleWishlist(productId) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter((id) => id !== productId)
    showToast("💔 Removed from Wishlist")
  } else {
    wishlist.push(productId)
    showToast("💖 Added to Wishlist")
  }
  localStorage.setItem("luxe-wishlist", JSON.stringify(wishlist))
  renderProducts()
}

// Update cart UI with premium styling
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  cartCount.textContent = totalItems
  cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🛍️</div>
                <p>Your collection is empty</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Discover our curated items</p>
            </div>
        `
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <div class="cart-item-image">${item.emoji}</div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span style="margin: 0 1rem; font-weight: 600;">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

// Show premium toast notification
function showToast(message) {
  toast.textContent = message
  toast.classList.add("show")
  setTimeout(() => {
    toast.classList.remove("show")
  }, 3500)
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  searchBar.addEventListener("input", (e) => {
    searchQuery = e.target.value
    renderProducts()
  })

  // Filter buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      currentFilter = btn.dataset.category
      renderProducts()
    })
  })

  // Cart drawer
  cartIcon.addEventListener("click", () => {
    cartDrawer.classList.add("open")
    cartOverlay.classList.add("active")
    document.body.style.overflow = "hidden"
  })

  closeCart.addEventListener("click", closeCartDrawer)
  cartOverlay.addEventListener("click", closeCartDrawer)

  // Checkout with premium experience
  checkoutBtn.addEventListener("click", () => {
    if (cart.length > 0) {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      showToast("🎉 Thank you for choosing LUXE COLLECTIVE!")

      // Simulate premium checkout experience
      setTimeout(() => {
        alert(
          `Thank you for your exclusive purchase of $${total.toFixed(2)}!\n\n✨ Your items will be carefully prepared by our artisans\n🚚 White-glove delivery within 2-3 business days\n📞 Our concierge will contact you shortly`,
        )
        cart = []
        localStorage.setItem("luxe-cart", JSON.stringify(cart))
        updateCartUI()
        closeCartDrawer()
      }, 1000)
    }
  })

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("luxe-theme", newTheme)
    themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙"
  })

  // Keyboard shortcuts for premium UX
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCartDrawer()
    }
    if (e.key === "/" && !e.target.matches("input")) {
      e.preventDefault()
      searchBar.focus()
    }
  })
}

// Close cart drawer
function closeCartDrawer() {
  cartDrawer.classList.remove("open")
  cartOverlay.classList.remove("active")
  document.body.style.overflow = "auto"
}

// Initialize the premium app
init()

// Add some premium interactions
document.addEventListener("DOMContentLoaded", () => {
  // Add subtle animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe product cards for scroll animations
  setTimeout(() => {
    document.querySelectorAll(".product-card").forEach((card) => {
      observer.observe(card)
    })
  }, 100)
})
