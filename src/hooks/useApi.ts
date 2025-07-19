import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Product } from '../types';
import { transformApiProduct } from '../utils/dataTransform';
import { ApiProduct, ApiCategory, ApiTag, ApiSlider } from '../types/api';

// Hook for fetching products
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiProducts: ApiProduct[] = await apiService.products.getAll();
        const transformedProducts = apiProducts.map(transformApiProduct);
        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}

// Hook for fetching discounted products
export function useDiscountedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        setLoading(true);
        const apiProducts: ApiProduct[] = await apiService.products.getDiscounted();
        const transformedProducts = apiProducts.map(transformApiProduct);
        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch discounted products');
        console.error('Error fetching discounted products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, []);

  return { products, loading, error };
}

// Hook for fetching a single product
export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const apiProduct: ApiProduct = await apiService.products.getById(id);
        const transformedProduct = transformApiProduct(apiProduct);
        setProduct(transformedProduct);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
        console.error('Error fetching product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
}

// Hook for fetching categories
export function useCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const apiCategories: ApiCategory[] = await apiService.categories.getAll();
        setCategories(apiCategories);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        console.error('Error fetching categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

// Hook for fetching tags
export function useTags() {
  const [tags, setTags] = useState<ApiTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const apiTags: ApiTag[] = await apiService.tags.getAll();
        setTags(apiTags);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tags');
        console.error('Error fetching tags:', err);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, loading, error };
}

// Hook for fetching sliders
export function useSliders() {
  const [sliders, setSliders] = useState<ApiSlider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setLoading(true);
        const apiSliders: ApiSlider[] = await apiService.sliders.getAll();
        setSliders(apiSliders);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sliders');
        console.error('Error fetching sliders:', err);
        setSliders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  return { sliders, loading, error };
}

// Hook for fetching Buy X Get Y promotions
export function useBuyXGetY() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const promotionsData: any[] = await apiService.buyXGetY.getAll();
        setPromotions(promotionsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch promotions');
        console.error('Error fetching promotions:', err);
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return { promotions, loading, error };
}