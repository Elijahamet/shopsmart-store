"use client"

import { useEffect } from "react"
import "./globals.css"

export default function Page() {
  useEffect(() => {
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
    let cart = JSON.parse(localStorage.getItem("luxe-cart") || "[]")
    let wishlist = JSON.parse(localStorage.getItem("luxe-wishlist") || "[]")
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

    // Render products with premium styling
    function renderProducts() {
      const filteredProducts = products.filter((product) => {
        const matchesCategory = currentFilter === "all" || product.category === currentFilter
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
      })

      if (productsGrid) {
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

      if (cartCount) cartCount.textContent = totalItems
      if (cartTotal) cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`

      if (cartItems) {
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
    }

    // Show premium toast notification
    function showToast(message) {
      if (toast) {
        toast.textContent = message
        toast.classList.add("show")
        setTimeout(() => {
          toast.classList.remove("show")
        }, 3500)
      }
    }

    // Close cart drawer
    function closeCartDrawer() {
      if (cartDrawer) cartDrawer.classList.remove("open")
      if (cartOverlay) cartOverlay.classList.remove("active")
      document.body.style.overflow = "auto"
    }
    // Make functions global so they can be called from onclick handlers
    ;(window as any).addToCart = addToCart
    ;(window as any).removeFromCart = removeFromCart
    ;(window as any).updateQuantity = updateQuantity
    ;(window as any).toggleWishlist = toggleWishlist

    // Initialize app
    function init() {
      renderProducts()
      updateCartUI()

      // Load theme
      const savedTheme = localStorage.getItem("luxe-theme") || "light"
      document.documentElement.setAttribute("data-theme", savedTheme)
      if (themeToggle) themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙"

      // Setup event listeners
      if (searchBar) {
        searchBar.addEventListener("input", (e) => {
          searchQuery = (e.target as HTMLInputElement).value
          renderProducts()
        })
      }

      filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          filterBtns.forEach((b) => b.classList.remove("active"))
          btn.classList.add("active")
          currentFilter = (btn as HTMLElement).dataset.category || "all"
          renderProducts()
        })
      })

      if (cartIcon) {
        cartIcon.addEventListener("click", () => {
          if (cartDrawer) cartDrawer.classList.add("open")
          if (cartOverlay) cartOverlay.classList.add("active")
          document.body.style.overflow = "hidden"
        })
      }

      if (closeCart) closeCart.addEventListener("click", closeCartDrawer)
      if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer)

      if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
          if (cart.length > 0) {
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
            showToast("🎉 Thank you for choosing LUXE COLLECTIVE!")

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
      }

      if (themeToggle) {
        themeToggle.addEventListener("click", () => {
          const currentTheme = document.documentElement.getAttribute("data-theme")
          const newTheme = currentTheme === "dark" ? "light" : "dark"

          document.documentElement.setAttribute("data-theme", newTheme)
          localStorage.setItem("luxe-theme", newTheme)
          themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙"
        })
      }

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeCartDrawer()
        }
        if (e.key === "/" && !(e.target as HTMLElement).matches("input")) {
          e.preventDefault()
          if (searchBar) searchBar.focus()
        }
      })
    }

    // Initialize the premium app
    init()
  }, [])

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">◆</span>
            <span className="logo-text">LUXE COLLECTIVE</span>
          </div>
          <nav>
            <ul className="nav-links">
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#collections">Collections</a>
              </li>
              <li>
                <a href="#wishlist" id="wishlistLink">
                  Wishlist
                </a>
              </li>
              <li>
                <a href="#membership">Membership</a>
              </li>
              <li>
                <button className="theme-toggle" id="themeToggle">
                  🌙
                </button>
              </li>
              <li>
                <button className="cart-icon" id="cartIcon">
                  <span className="cart-icon-text">Cart</span>
                  <span className="cart-count" id="cartCount">
                    0
                  </span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>Curated Excellence</h1>
          <p>Discover handpicked luxury items from the world&apos;s finest artisans</p>
          <div className="hero-badge">
            <span>✦ MEMBERS ONLY ✦</span>
          </div>
        </div>
        <div className="hero-overlay"></div>
      </section>

      {/* Exclusive Banner */}
      <section className="exclusive-banner">
        <div className="banner-content">
          <span className="banner-icon">👑</span>
          <span>Exclusive access to limited collections • Free concierge service • Priority shipping</span>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="search-section" id="collections">
        <div className="search-container">
          <input type="text" className="search-bar" id="searchBar" placeholder="Search our curated collections..." />
          <div className="search-icon">🔍</div>
        </div>
        <div className="filters">
          <button className="filter-btn active" data-category="all">
            All Collections
          </button>
          <button className="filter-btn" data-category="electronics">
            Tech & Innovation
          </button>
          <button className="filter-btn" data-category="clothing">
            Fashion & Style
          </button>
          <button className="filter-btn" data-category="home">
            Home & Living
          </button>
          <button className="filter-btn" data-category="books">
            Literature & Arts
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-container">
        <div className="section-header">
          <h2>Curated Collections</h2>
          <p>Each item is carefully selected for its exceptional quality and craftsmanship</p>
        </div>
        <div className="products-grid" id="productsGrid">
          {/* Products will be dynamically generated */}
        </div>
      </section>

      {/* Cart Drawer */}
      <div className="cart-overlay" id="cartOverlay"></div>
      <div className="cart-drawer" id="cartDrawer">
        <div className="cart-header">
          <h3>Your Selection</h3>
          <button className="close-cart" id="closeCart">
            ✕
          </button>
        </div>
        <div className="cart-items" id="cartItems">
          {/* Cart items will be dynamically generated */}
        </div>
        <div className="cart-footer">
          <div className="cart-total" id="cartTotal">
            Total: $0.00
          </div>
          <div className="cart-benefits">
            <div className="benefit">✓ Free White-Glove Delivery</div>
            <div className="benefit">✓ 30-Day Return Guarantee</div>
          </div>
          <button className="checkout-btn" id="checkoutBtn">
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <div className="toast" id="toast">
        ✨ Added to Your Collection
      </div>
    </div>
  )
}
