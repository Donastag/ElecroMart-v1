export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}
