'use client'

interface ProductCardProps {
  id: number
  name: string
  price: string
  image?: string
  onAddToCart: (product: { id: number; name: string; price: string }) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  id, 
  name, 
  price, 
  image, 
  onAddToCart 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="text-gray-400 text-sm">Product Image</div>
        )}
      </div>
      <h4 className="font-semibold text-lg mb-2">{name}</h4>
      <p className="text-gray-600 mb-4">{price}</p>
      <button 
        onClick={() => onAddToCart({ id, name, price })}
        className="w-full bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  )
}