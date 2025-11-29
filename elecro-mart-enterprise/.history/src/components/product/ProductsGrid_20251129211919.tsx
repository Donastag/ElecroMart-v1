'use client'

import { ProductCard } from './ProductCard'

interface Product {
  id: number
  name: string
  price: string
  image?: string
}

interface ProductsGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ products, onAddToCart }) => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Featured Products
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  )
}