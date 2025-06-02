
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import { Product, FilterOptions, SortOption } from '../types';
import MainLayout from '../components/Layout/MainLayout';
import { useProducts } from '../hooks/useApi';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { products: allProducts, loading, error } = useProducts();
  
  // Get products in this category
  const categoryProducts = allProducts.filter(p => p.category === category);
  
  // Get min and max prices from products in this category
  const allPrices = categoryProducts.map(p => p.salePrice || p.price);
  const minProductPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const maxProductPrice = allPrices.length > 0 ? Math.max(...allPrices) : 1000;
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    minPrice: minProductPrice,
    maxPrice: maxProductPrice,
    categories: [category || ''],
    tags: [],
    onSaleOnly: false,
    sortBy: 'newest'
  });

  // Update filters when products load
  useEffect(() => {
    if (categoryProducts.length > 0) {
      const allPrices = categoryProducts.map(p => p.salePrice || p.price);
      const minPrice = Math.min(...allPrices);
      const maxPrice = Math.max(...allPrices);
      
      setFilters(prev => ({
        ...prev,
        minPrice: minPrice,
        maxPrice: maxPrice,
        categories: [category || '']
      }));
    }
  }, [categoryProducts.length, category]);
  
  useEffect(() => {
    let result = categoryProducts.filter(product => {
      const productPrice = product.salePrice || product.price;
      
      // Price filter
      if (productPrice < filters.minPrice || productPrice > filters.maxPrice) {
        return false;
      }
      
      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const productTags = product.tags || [];
        const hasMatchingTag = filters.tags.some(filterTag => 
          productTags.includes(filterTag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }
      
      // Sale filter
      if (filters.onSaleOnly && !product.isSale) {
        return false;
      }
      
      return true;
    });
    
    // Sort
    result = sortProducts(result, filters.sortBy);
    
    setFilteredProducts(result);
  }, [filters, categoryProducts]);
  
  const sortProducts = (products: Product[], sortOption: SortOption): Product[] => {
    const sortedProducts = [...products];
    
    switch (sortOption) {
      case 'newest':
        return sortedProducts;
      case 'price-low':
        return sortedProducts.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceA - priceB;
        });
      case 'price-high':
        return sortedProducts.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceB - priceA;
        });
      default:
        return sortedProducts;
    }
  };
  
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    if (newFilters.categories) {
      // Ensure the current category is always included
      if (!newFilters.categories.includes(category || '')) {
        newFilters.categories = [...newFilters.categories, category || ''];
      }
    }
    
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };
  
  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sage-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-red-500 text-lg">Error loading products: {error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-medium text-sage-800 mb-8 text-center">{categoryTitle}</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="md:w-1/4">
            <ProductFilter 
              onFilterChange={handleFilterChange}
              currentFilters={filters}
              products={categoryProducts}
            />
          </div>
          
          {/* Products grid */}
          <div className="md:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">{filteredProducts.length} products</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
