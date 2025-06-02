
// API Response types based on the external API
export interface ApiProduct {
  id: number;
  name: string;
  hasAddons: string;
  name_ar?: string;
  sku: string;
  description?: string;
  description_ar?: string;
  slug: string;
  price: string;
  PriceAfterDiscount?: string;
  AtStock: string;
  cat_id: string;
  sub_cat_id: string;
  created_at: string;
  updated_at: string;
  color_id: string;
  tag_id: string;
  category: ApiCategory;
  subcategory: ApiSubCategory;
  product_image: ApiProductImage[];
  buy_xget_y: any[];
  color: ApiColor;
  addons: ApiAddon[];
}

export interface ApiCategory {
  id: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  Active: string;
  created_at: string;
  updated_at: string;
  image?: string;
  banner?: string;
  subcategory_count?: string;
  product_count?: string;
  subcategory?: ApiSubCategory[];
  product?: ApiProduct[];
}

export interface ApiSubCategory {
  id: number;
  Cat_id: string;
  name: string;
  name_ar: string;
  category_count?: string;
  product_count?: string;
  category?: ApiCategory;
  product?: ApiProduct[];
}

export interface ApiProductImage {
  id: number;
  product_id: string;
  image: string;
}

export interface ApiColor {
  id: number;
  name: string;
  hex_code: string;
  created_at: string;
  updated_at: string;
}

export interface ApiAddon {
  id: number;
  title: string;
  title_ar: string;
  image: string;
  created_at: string;
  updated_at: string;
  price: string;
  pivot?: {
    product_id: string;
    Addon_id: string;
  };
}

export interface ApiTag {
  id: number;
  name: string;
  name_ar: string;
  created_at?: string;
  updated_at: string;
  product_count?: string;
  product?: ApiProduct[];
}

export interface ApiSlider {
  id: number;
  title: string;
  link: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  image: string;
  order: string;
  is_active: string;
  created_at: string;
  updated_at: string;
}

export interface ApiPromoCode {
  id: number;
  description: string;
  name: string;
  discount: string;
  startdate: string;
  enddate: string;
  IsFreeShip: string;
  Active: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiBuyXGetY {
  id: number;
  X: string;
  Y: string;
  expiration: string;
  created_at: string;
  updated_at: string;
  product: any[];
}

export interface ApiAuthResponse {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  token: string;
}

export interface ApiLoginRequest {
  email: string;
  password: string;
}

export interface ApiRegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}
