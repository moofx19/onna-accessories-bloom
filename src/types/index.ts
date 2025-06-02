
export interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  variant?: string;
  charms?: number;
  tags?: string[];
  charmsDetails?: {
    zodiac: string[];
    initials: string[];
    symbols: string[];
    birthstones: string[];
  };
  baseProduct?: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    type: 'gold' | 'silver' | 'rose-gold';
  };
  buyXGetY?: {
    id: number;
    X: string;
    Y: string;
    expiration: string;
  }[];
}

export interface CartItem extends Product {
  quantity: number;
  isBonusItem?: boolean;
}

export type SortOption = "newest" | "price-low" | "price-high";

export interface FilterOptions {
  minPrice: number;
  maxPrice: number;
  categories: string[];
  tags?: string[];
  onSaleOnly: boolean;
  sortBy: SortOption;
}
