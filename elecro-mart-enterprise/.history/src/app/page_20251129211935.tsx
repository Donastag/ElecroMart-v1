'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/home/HeroSection'
import { ProductsGrid } from '@/components/product/ProductsGrid'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [cartItems, setCartItems] = useState<any[]>([])

  const handleAddToCart = (product: any) => {
    setCartItems(prev => [...prev, product])
  }

  // Sample products data - replace with real data when available
  const featuredProducts = [
    { id: 1, name: 'MacBook Air 15" M3', price: 'KSh 180,000', image: '/images/products/macbook-air-15_-m3-chip.png' },
    { id: 2, name: 'iPhone 15 Pro Max', price: 'KSh 165,000', image: '/images/products/apple-iphone-15-pro-max-(256gb).png' },
    { id: 3, name: 'Samsung Galaxy S24 Ultra', price: 'KSh 155,000', image: '/images/products/samsung-galaxy-s24-ultra.png' },
    { id: 4, name: 'PlayStation 5 Slim', price: 'KSh 65,000', image: '/images/products/playstation-5-console-(slim).png' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        cartCount={cartItems.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <HeroSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ProductsGrid 
        products={featuredProducts}
        onAddToCart={handleAddToCart}
      />
      <Footer />
    </div>
  )
}