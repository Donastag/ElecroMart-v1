import React, { useState } from 'react';
import { TopBar } from './components/layout/TopBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import Home from './pages/Home';
import { Product } from './types';

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddToCart = (product: Product) => {
    setCartCount((prev) => prev + 1);
    
    // Notification logic
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce flex items-center gap-2';
    notification.innerHTML = `<span>Added <span class="font-bold text-brand-500">${product.name}</span> to cart!</span>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      <Navbar 
        cartCount={cartCount} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      {/* Render the Home Page which contains the Black November Hero */}
      <Home searchQuery={searchQuery} onAddToCart={handleAddToCart} />

      <Footer />
    </div>
  );
}