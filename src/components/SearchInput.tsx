
import React, { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Search, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface SearchInputProps {
  className?: string;
  onClose?: () => void;
  isCompact?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  className, 
  onClose,
  isCompact = false
}) => {
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    if (localQuery.trim()) {
      navigate('/search');
      if (onClose) onClose();
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    clearSearch();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative flex items-center ${className || ''}`}
    >
      <div className="relative w-full flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-sage-400" />
        <Input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search products..."
          className={`pl-9 pr-8 ${isCompact ? 'h-8 text-sm' : 'h-10'} bg-white/90 border-sage-200 focus-visible:ring-sage-500`}
        />
        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-sage-400 hover:text-sage-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {!isCompact && (
        <Button 
          type="submit" 
          className="ml-2 bg-sage-500 hover:bg-sage-600 text-white"
        >
          Search
        </Button>
      )}
    </form>
  );
};

export default SearchInput;
