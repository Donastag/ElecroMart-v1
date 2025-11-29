'use client'

import { useState } from 'react'

// Temporary placeholder page while we migrate components
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [cartItems, setCartItems] = useState<any[]>([])

  const handleAddToCart = (product: any) => {
    setCartItems(prev => [...prev, product])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar would go here */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Elecro.Mart</h1>
            <nav className="flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Products</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <button className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
                Cart ({cartItems.length})
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">
            Kenya's Premier Electronics Store
          </h2>
          <p className="text-xl mb-8">
            Discover the latest technology with AI-powered recommendations
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900"
            />
            <button className="bg-brand-500 px-6 py-3 rounded-r-lg hover:bg-brand-400">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder products */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <h4 className="font-semibold text-lg mb-2">Product {i}</h4>
                <p className="text-gray-600 mb-4">KSh 50,000</p>
                <button 
                  onClick={() => handleAddToCart({ id: i, name: `Product ${i}` })}
                  className="w-full bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Elecro.Mart</h3>
              <p className="text-gray-400">
                Kenya's premier destination for electronics and technology.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <p className="text-gray-400">
                Follow us for the latest tech updates and deals.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Elecro.Mart. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}