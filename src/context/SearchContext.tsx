
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';
import { products as allProducts } from '../data/products';

interface SearchContextType {
  searchQuery: string;
  searchResults: Product[];
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    const results = allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      searchResults,
      setSearchQuery: handleSearch,
      clearSearch,
      isSearching
    }}>
      {children}
    </SearchContext.Provider>
  );
};
