import { Product } from './types';

export const SAMPLE_PRODUCTS: Product[] = [
  // Smartphones
  { 
    id: 101, 
    name: 'Apple iPhone 15 Pro Max (256GB)', 
    price: 'KSh 215,000', 
    originalPrice: 'KSh 230,000',
    image: '/images/products/apple-iphone-15-pro-max-(256gb).png',
    category: 'Smartphones',
    rating: 4.9,
    reviews: 342,
    isNew: true
  },
  { 
    id: 102, 
    name: 'Samsung Galaxy S24 Ultra', 
    price: 'KSh 198,000', 
    image: '/images/products/samsung-galaxy-s24-ultra.png',
    category: 'Smartphones',
    rating: 4.8,
    reviews: 156
  },
  
  // Computers
  { 
    id: 201, 
    name: 'MacBook Air 15" M3 Chip', 
    price: 'KSh 185,000', 
    image: '/images/products/macbook-air-15_-m3-chip.png',
    category: 'Computers',
    rating: 4.9,
    reviews: 89
  },
  { 
    id: 202, 
    name: 'HP Spectre x360 Laptop', 
    price: 'KSh 145,000', 
    originalPrice: 'KSh 165,000',
    image: '/images/products/hp-spectre-x360-laptop.png', 
    category: 'Computers',
    rating: 4.6,
    reviews: 45
  },

  // Gaming
  { 
    id: 301, 
    name: 'PlayStation 5 Console (Slim)', 
    price: 'KSh 75,000', 
    image: '/images/products/playstation-5-console-(slim).png', 
    category: 'Gaming',
    rating: 4.9,
    reviews: 1250
  },
  { 
    id: 11, 
    name: 'Wireless Gaming Mouse Pro', 
    price: 'KSh 5,900', 
    originalPrice: 'KSh 7,500',
    image: '/images/products/wireless-gaming-mouse-pro.png',
    category: 'Gaming',
    rating: 4.6,
    reviews: 201
  },

  // Televisions
  {
    id: 401,
    name: 'LG C3 55" OLED evo 4K TV',
    price: 'KSh 189,000',
    originalPrice: 'KSh 210,000',
    image: '/images/products/lg-c3-55_-oled-evo-4k-tv.png',
    category: 'Televisions',
    rating: 4.8,
    reviews: 67
  },
  {
    id: 402,
    name: 'Samsung 65" Neo QLED 4K',
    price: 'KSh 245,000',
    image: '/images/products/samsung-65_-neo-qled-4k.png', 
    category: 'Televisions',
    rating: 4.7,
    reviews: 42
  },

  // Networking
  {
    id: 501,
    name: 'TP-Link Archer AX55 Wi-Fi 6 Router',
    price: 'KSh 12,500',
    image: '/images/products/tp-link-archer-ax55-wi-fi-6-router.png',
    category: 'Networking',
    rating: 4.5,
    reviews: 112
  },

  // Accessories (Mobile/Gadgets)
  {
    id: 601,
    name: 'Anker 737 Power Bank',
    price: 'KSh 18,500',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',
    category: 'Accessories',
    rating: 4.8,
    reviews: 230
  },
  { 
    id: 1, 
    name: 'Sony WH-1000XM5 Wireless Headphones', 
    price: 'KSh 42,500', 
    originalPrice: 'KSh 48,000',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    category: 'Accessories',
    rating: 4.8,
    reviews: 124,
    isNew: true
  },

  // Existing Categories (Fashion, Home, Sports)
  { 
    id: 3, 
    name: 'Genuine Leather Crossbody Bag', 
    price: 'KSh 6,200', 
    originalPrice: 'KSh 8,500',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80', 
    category: 'Fashion',
    rating: 4.5,
    reviews: 45
  },
  { 
    id: 5, 
    name: 'Hydro Flask Wide Mouth', 
    price: 'KSh 4,500', 
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', 
    category: 'Home',
    rating: 4.8,
    reviews: 567
  },
  { 
    id: 6, 
    name: 'Lululemon Yoga Mat 5mm', 
    price: 'KSh 8,200', 
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80', 
    category: 'Sports',
    rating: 4.6,
    reviews: 78
  }
];

export const POPULAR_SEARCHES = ['iPhone 15', 'PS5', 'Laptops', 'Smart TV', 'Routers', 'Samsung', 'Fashion'];
export const CATEGORIES = ['All', 'Smartphones', 'Computers', 'Gaming', 'Televisions', 'Accessories', 'Networking', 'Fashion', 'Home', 'Sports'];