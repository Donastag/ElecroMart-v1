import React, { useState, useEffect, useRef } from 'react';
import { Star, ShoppingCart, Heart, Sparkles, Loader2, ImageOff, Download } from 'lucide-react';
import { Product } from '../../types';
import { generateProductImage } from '../../lib/gemini';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [imageSrc, setImageSrc] = useState<string>(product.image || '');
  const [isGenerating, setIsGenerating] = useState<boolean>(!product.image);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const CACHE_KEY = `product-image-cache-${product.id}`;

  // 1. Check LocalStorage on Mount
  useEffect(() => {
    if (!product.image) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setImageSrc(cached);
        setIsAiGenerated(true);
        setIsGenerating(false);
        setIsImageLoaded(true); // Assume cached is ready
      }
    }
  }, [product.image, CACHE_KEY]);

  // 2. Intersection Observer for Lazy Loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.1
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // 3. Generate Image if not found in cache or props
  useEffect(() => {
    // Only generate if: Visible, No Props Image, No State Image, and Is flagged as Generating
    if (isVisible && !product.image && !imageSrc && isGenerating) {
      generateProductImage(product.name)
        .then((generatedUrl) => {
          if (generatedUrl) {
            setImageSrc(generatedUrl);
            setIsAiGenerated(true);
            
            // Try to cache in LocalStorage
            try {
              localStorage.setItem(CACHE_KEY, generatedUrl);
            } catch (e) {
              console.warn('LocalStorage quota exceeded, image not cached for next reload.');
            }
          }
          setIsGenerating(false);
        })
        .catch(() => {
          setIsGenerating(false);
        });
    }
  }, [product.name, product.image, imageSrc, isGenerating, isVisible, CACHE_KEY]);

  const handleDownloadImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageSrc) return;
    
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `${product.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div ref={cardRef} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Badges */}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm z-10">
            NEW
          </span>
        )}
        {product.originalPrice && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm z-10">
            SALE
          </span>
        )}
        
        {/* Image Display Logic */}
        {isGenerating ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-3">
            <div className="relative">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <Sparkles className="w-4 h-4 text-brand-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-xs font-medium animate-pulse">
              {isVisible ? 'Generating Photo...' : 'Pending...'}
            </span>
          </div>
        ) : imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={product.name}
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out ${isImageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
            />
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                 <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
              </div>
            )}
            
            {/* AI Generated Badge & Controls */}
            {isAiGenerated && isImageLoaded && (
              <>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1 z-10 pointer-events-none">
                  <Sparkles className="w-3 h-3 text-brand-400" />
                  <span>AI Generated</span>
                </div>
                
                {/* Download Button */}
                <button 
                  onClick={handleDownloadImage}
                  title="Download Image to save permanently"
                  className="absolute bottom-3 right-14 w-8 h-8 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors z-20"
                >
                  <Download className="w-4 h-4" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
             <ImageOff className="w-10 h-10 mb-2 opacity-50" />
             <span className="text-xs">No Image Available</span>
          </div>
        )}
        
        {/* Wishlist Button */}
        <button className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors translate-y-16 group-hover:translate-y-0 duration-300 z-20">
          <Heart className="w-5 h-5 fill-current" />
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-brand-600 font-semibold mb-1 uppercase tracking-wide">
          {product.category}
        </div>
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[48px]" title={product.name}>
          {product.name}
        </h3>
        
        <div className="mt-auto">
          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-2">
            <div className="text-lg font-bold text-gray-900">{product.price}</div>
            {product.originalPrice && (
              <div className="text-xs text-gray-400 line-through">{product.originalPrice}</div>
            )}
          </div>

          {/* Ratings Section */}
          <div className="flex items-center gap-1 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({product.reviews} reviews)
            </span>
          </div>

          {/* Action Section */}
          <button
            onClick={() => onAddToCart(product)}
            className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};