
import React, { useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { useSearch } from '../context/SearchContext';
import ProductCard from '../components/ProductCard';
import SearchInput from '../components/SearchInput';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const SearchResults: React.FC = () => {
  const { searchQuery, searchResults, isSearching } = useSearch();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-medium text-sage-800 mb-6 text-center">Search Products</h1>
          <SearchInput className="w-full" />
        </div>
        
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-medium text-sage-800 mb-2">
              Results for "{searchQuery}"
            </h2>
            <p className="text-sage-600">
              Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
        
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-6">No products found matching "{searchQuery}".</p>
            <Button asChild variant="outline" className="border-sage-300 text-sage-700 hover:bg-sage-50">
              <Link to="/shop">Browse all products</Link>
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Search for products by name or category.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchResults;
