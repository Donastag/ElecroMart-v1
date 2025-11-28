
import React, { useState } from 'react';
import { BlackNovemberHero } from '../components/home/BlackNovemberHero';
import { ProductGrid } from '../components/product/ProductGrid';
import { CategoryBar } from '../components/home/CategoryBar';
import { SAMPLE_PRODUCTS } from '../constants';
import { Product } from '../types';

interface HomeProps {
  searchQuery: string;
  onAddToCart: (product: Product) => void;
}

export default function Home({ searchQuery, onAddToCart }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
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
          onAddToCart={onAddToCart} 
        />
      </div>
    </main>
  );
}
