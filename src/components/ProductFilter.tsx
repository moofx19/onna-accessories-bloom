
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { FilterOptions } from '../types';
import { products } from '../data/products';

interface ProductFilterProps {
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  currentFilters: FilterOptions;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilterChange, currentFilters }) => {
  const [priceRange, setPriceRange] = useState<number[]>([currentFilters.minPrice, currentFilters.maxPrice]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Get min and max prices from products
  const allPrices = products.map(p => p.salePrice || p.price);
  const minProductPrice = Math.min(...allPrices);
  const maxProductPrice = Math.max(...allPrices);
  
  // Get all unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  // Get all unique tags
  const allTags = Array.from(new Set(products.flatMap(p => p.tags || [])));
  
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };
  
  const handlePriceChangeCommitted = () => {
    onFilterChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    });
  };
  
  const handleCategoryToggle = (category: string) => {
    const newCategories = currentFilters.categories.includes(category)
      ? currentFilters.categories.filter(c => c !== category)
      : [...currentFilters.categories, category];
    
    onFilterChange({
      categories: newCategories
    });
  };
  
  const handleTagToggle = (tag: string) => {
    const newTags = currentFilters.tags?.includes(tag)
      ? currentFilters.tags.filter(t => t !== tag)
      : [...(currentFilters.tags || []), tag];
    
    onFilterChange({
      tags: newTags
    });
  };
  
  const handleSaleToggle = () => {
    onFilterChange({
      onSaleOnly: !currentFilters.onSaleOnly
    });
  };
  
  const handleSortChange = (value: string) => {
    onFilterChange({
      sortBy: value as FilterOptions['sortBy']
    });
  };
  
  const resetFilters = () => {
    setPriceRange([minProductPrice, maxProductPrice]);
    onFilterChange({
      minPrice: minProductPrice,
      maxPrice: maxProductPrice,
      categories: [],
      tags: [],
      onSaleOnly: false,
      sortBy: 'newest'
    });
  };
  
  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };
  
  return (
    <div>
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <Button 
          variant="outline" 
          className="w-full text-sage-700 border-sage-300"
          onClick={toggleMobileFilter}
        >
          {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>
      
      {/* Filter content */}
      <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} md:block`}>
        <div className="space-y-6">
          {/* Price filter */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Price Range</h3>
            <div className="px-2">
              <Slider
                defaultValue={[currentFilters.minPrice, currentFilters.maxPrice]}
                min={minProductPrice}
                max={maxProductPrice}
                step={1}
                value={priceRange}
                onValueChange={handlePriceChange}
                onValueCommit={handlePriceChangeCommitted}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>EGP {priceRange[0].toFixed(2)}</span>
                <span>EGP {priceRange[1].toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Category filter */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <Checkbox
                    id={`category-${category}`}
                    checked={currentFilters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="ml-2 text-gray-600 capitalize cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tags filter */}
          {allTags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
              <div className="space-y-2">
                {allTags.map((tag) => (
                  <div key={tag} className="flex items-center">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={currentFilters.tags?.includes(tag) || false}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <Label
                      htmlFor={`tag-${tag}`}
                      className="ml-2 text-gray-600 capitalize cursor-pointer"
                    >
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Sale filter */}
          <div>
            <div className="flex items-center">
              <Checkbox 
                id="sale-only"
                checked={currentFilters.onSaleOnly}
                onCheckedChange={handleSaleToggle}
              />
              <Label
                htmlFor="sale-only"
                className="ml-2 text-gray-600 cursor-pointer"
              >
                Sale Items Only
              </Label>
            </div>
          </div>
          
          {/* Sort */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Sort By</h3>
            <Select
              value={currentFilters.sortBy}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {/* Reset button */}
          <Button
            onClick={resetFilters}
            variant="outline"
            className="w-full mt-4 text-sage-700 border-sage-300"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
