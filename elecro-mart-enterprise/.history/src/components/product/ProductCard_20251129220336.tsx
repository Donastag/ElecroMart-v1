"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Star, ShoppingCart, Heart, Sparkles, Loader2, ImageOff, Download } from 'lucide-react';
import { Product } from '../../types'; // Adjusted path
import { generateProductImage } from '../../lib/gemini'; // Adjusted path

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="text-gray-400 text-sm">Product Image</div>
        )}
      </div>
      <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
      <p className="text-gray-600 mb-4">{product.price}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="w-full bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  )
}
