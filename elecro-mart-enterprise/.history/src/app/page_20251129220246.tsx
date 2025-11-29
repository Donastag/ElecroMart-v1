"use client";

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlackNovemberHero } from '@/components/home/BlackNovemberHero';
import { CategoryBar } from '@/components/home/CategoryBar';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SAMPLE_PRODUCTS } from '@/lib/constants';
import { Product } from '@/types';

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleAddToCart = (product: Product) => {
    setCartCount((prev) => prev + 1);

    // Notification logic
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce flex items-center gap-2';
    notification.innerHTML = `<span>Added <span class="font-bold text-brand-500">${product.name}</span> to cart!</span>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      <Navbar
        cartCount={cartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-grow">
        {/* Black November Full Screen Hero / Slider */}
        <BlackNovemberHero />

        {/* Standard Shop Components */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'Featured Products' : `${selectedCategory} Products`}
            </h2>
            <span className="text-gray-500 text-sm">
              {filteredProducts.length} items found
            </span>
          </div>

          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
