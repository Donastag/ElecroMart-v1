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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        marginBottom: '20px', 
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          Elecro.Mart Enterprise
        </h1>
        <p style={{ textAlign: 'center', color: '#6b7280' }}>
          Kenya's Premier Electronics Store - Electronics and Technology E-commerce Platform
        </p>
      </div>
      
      <div style={{
        backgroundColor: '#ea580c',
        color: 'white',
        padding: '40px 20px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>
          Kenya's Premier Electronics Store
        </h2>
        <p style={{ fontSize: '18px', marginBottom: '24px' }}>
          Discover the latest technology with AI-powered recommendations
        </p>
        <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex' }}>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px 0 0 8px',
              border: 'none',
              outline: 'none'
            }}
          />
          <button style={{
            backgroundColor: '#f97316',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer'
          }}>
            Search
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '40px 20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          textAlign: 'center',
          marginBottom: '32px',
          color: '#1f2937'
        }}>
          Featured Products
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {featuredProducts.map((product) => (
            <div 
              key={product.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af'
              }}>
                Product Image
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                {product.name}
              </h4>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                {product.price}
              </p>
              <button 
                onClick={() => handleAddToCart(product)}
                style={{
                  width: '100%',
                  backgroundColor: '#ea580c',
                  color: 'white',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        backgroundColor: '#111827',
        color: 'white',
        padding: '48px 20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Elecro.Mart</h3>
            <p style={{ color: '#9ca3af' }}>
              Kenya's premier destination for electronics and technology.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>About</a></li>
              <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</a></li>
              <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Support</a></li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Connect</h3>
            <p style={{ color: '#9ca3af' }}>
              Follow us for the latest tech updates and deals.
            </p>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '32px',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <p>© 2025 Elecro.Mart. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}