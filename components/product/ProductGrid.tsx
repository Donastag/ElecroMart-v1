import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-400 mb-4">No products found</div>
        <p className="text-gray-500">Try adjusting your search or category filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};
