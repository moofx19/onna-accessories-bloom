
import { ApiProduct, ApiCategory, ApiTag, ApiSlider } from '../types/api';
import { Product } from '../types';

// Transform API product to internal Product type
export function transformApiProduct(apiProduct: ApiProduct): Product {
  const basePrice = parseFloat(apiProduct.price);
  const salePrice = apiProduct.PriceAfterDiscount ? parseFloat(apiProduct.PriceAfterDiscount) : undefined;
  
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: basePrice,
    salePrice: salePrice,
    imageUrl: apiProduct.product_image[0]?.image ? 
      `https://test.kogear.store/storage/${apiProduct.product_image[0].image}` : 
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: apiProduct.category.title.toLowerCase(),
    isNew: false, // API doesn't provide this field
    isSale: !!salePrice,
    tags: apiProduct.tag_id ? [apiProduct.tag_id] : [],
  };
}

// Transform API category name for filtering
export function transformCategoryName(apiCategory: ApiCategory): string {
  return apiCategory.title.toLowerCase();
}

// Transform API tags for filtering
export function transformApiTags(apiTags: ApiTag[]): string[] {
  return apiTags.map(tag => tag.name.toLowerCase());
}

// Transform API slider to hero slide
export function transformApiSlider(apiSlider: ApiSlider) {
  return {
    id: apiSlider.id,
    imageUrl: `https://test.kogear.store/storage/${apiSlider.image}`,
    title: apiSlider.title,
    subtitle: apiSlider.description,
    ctaText: 'Shop Now'
  };
}

// Get unique categories from API products
export function getUniqueCategories(apiProducts: ApiProduct[]): string[] {
  const categories = apiProducts.map(product => product.category.title.toLowerCase());
  return Array.from(new Set(categories));
}

// Get all tags from API products
export function getAllTags(apiProducts: ApiProduct[]): string[] {
  const allTags: string[] = [];
  apiProducts.forEach(product => {
    if (product.tag_id) {
      allTags.push(product.tag_id);
    }
  });
  return Array.from(new Set(allTags));
}
