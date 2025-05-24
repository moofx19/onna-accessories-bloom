
import React, { useState } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
} from '@/components/ui/carousel';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Charm {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: 'symbols' | 'letters' | 'birthstones' | 'zodiac';
  dependencies?: number[]; // IDs of charms that must be selected first
}

interface CharmSelectorProps {
  selectedCharms: number[];
  onCharmsChange: (charms: number[]) => void;
  maxCharms?: number;
}

const CharmSelector: React.FC<CharmSelectorProps> = ({
  selectedCharms,
  onCharmsChange,
  maxCharms = 5
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('symbols');

  // Mock charm data with dependencies
  const charms: Charm[] = [
    // Symbols category
    { id: 1, name: "Heart", imageUrl: "/placeholder.svg", price: 50, category: 'symbols' },
    { id: 2, name: "Star", imageUrl: "/placeholder.svg", price: 50, category: 'symbols' },
    { id: 3, name: "Moon", imageUrl: "/placeholder.svg", price: 50, category: 'symbols' },
    { id: 4, name: "Sun", imageUrl: "/placeholder.svg", price: 50, category: 'symbols' },
    { id: 5, name: "Infinity", imageUrl: "/placeholder.svg", price: 50, category: 'symbols' },
    
    // Letters category
    { id: 6, name: "Letter A", imageUrl: "/placeholder.svg", price: 50, category: 'letters' },
    { id: 7, name: "Letter B", imageUrl: "/placeholder.svg", price: 50, category: 'letters' },
    { id: 8, name: "Letter C", imageUrl: "/placeholder.svg", price: 50, category: 'letters' },
    { id: 9, name: "Letter D", imageUrl: "/placeholder.svg", price: 50, category: 'letters' },
    { id: 10, name: "Letter E", imageUrl: "/placeholder.svg", price: 50, category: 'letters' },
    
    // Birthstones category - these depend on having at least one symbol
    { id: 11, name: "January Ruby", imageUrl: "/placeholder.svg", price: 75, category: 'birthstones', dependencies: [1, 2, 3, 4, 5] },
    { id: 12, name: "February Amethyst", imageUrl: "/placeholder.svg", price: 75, category: 'birthstones', dependencies: [1, 2, 3, 4, 5] },
    { id: 13, name: "March Aquamarine", imageUrl: "/placeholder.svg", price: 75, category: 'birthstones', dependencies: [1, 2, 3, 4, 5] },
    
    // Zodiac category - these depend on having a birthstone
    { id: 14, name: "Aries", imageUrl: "/placeholder.svg", price: 60, category: 'zodiac', dependencies: [11, 12, 13] },
    { id: 15, name: "Taurus", imageUrl: "/placeholder.svg", price: 60, category: 'zodiac', dependencies: [11, 12, 13] },
    { id: 16, name: "Gemini", imageUrl: "/placeholder.svg", price: 60, category: 'zodiac', dependencies: [11, 12, 13] },
  ];

  const categories = [
    { id: 'symbols', name: 'Symbols', description: 'Basic charms to start your collection' },
    { id: 'letters', name: 'Letters', description: 'Personalize with initials' },
    { id: 'birthstones', name: 'Birthstones', description: 'Requires a symbol charm first' },
    { id: 'zodiac', name: 'Zodiac', description: 'Requires a birthstone charm first' }
  ];

  const filteredCharms = charms.filter(charm => charm.category === selectedCategory);

  const isCharmAvailable = (charm: Charm) => {
    if (!charm.dependencies) return true;
    return charm.dependencies.some(depId => selectedCharms.includes(depId));
  };

  const isCharmSelected = (charmId: number) => {
    return selectedCharms.includes(charmId);
  };

  const toggleCharm = (charmId: number) => {
    if (isCharmSelected(charmId)) {
      // Remove charm and any dependent charms
      const newCharms = selectedCharms.filter(id => {
        if (id === charmId) return false;
        const charm = charms.find(c => c.id === id);
        return !charm?.dependencies?.includes(charmId);
      });
      onCharmsChange(newCharms);
    } else {
      // Add charm if under limit
      if (selectedCharms.length < maxCharms) {
        onCharmsChange([...selectedCharms, charmId]);
      }
    }
  };

  const removeCharm = (charmId: number) => {
    const newCharms = selectedCharms.filter(id => {
      if (id === charmId) return false;
      const charm = charms.find(c => c.id === id);
      return !charm?.dependencies?.includes(charmId);
    });
    onCharmsChange(newCharms);
  };

  return (
    <div className="my-8">
      <h3 className="text-sm font-medium uppercase tracking-wider text-gray-600 mb-4">
        CUSTOMIZE YOUR CHARMS ({selectedCharms.length}/{maxCharms})
      </h3>
      
      {/* Selected Charms Display */}
      {selectedCharms.length > 0 && (
        <div className="mb-6 p-4 bg-sage-50 rounded-lg">
          <h4 className="text-sm font-medium text-sage-800 mb-3">Selected Charms:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCharms.map(charmId => {
              const charm = charms.find(c => c.id === charmId);
              return charm ? (
                <div key={charmId} className="flex items-center bg-white rounded-full px-3 py-1 text-sm">
                  <span>{charm.name}</span>
                  <button
                    onClick={() => removeCharm(charmId)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : null;
            })}
          </div>
          <p className="text-xs text-sage-600 mt-2">
            Total charm cost: +EGP {selectedCharms.length * 50}.00
          </p>
        </div>
      )}

      {/* Category Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={`text-xs ${
              selectedCategory === category.id 
                ? 'bg-sage-500 hover:bg-sage-600' 
                : 'border-gray-200 hover:border-sage-300'
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Category Description */}
      <p className="text-sm text-gray-600 mb-4">
        {categories.find(c => c.id === selectedCategory)?.description}
      </p>

      {/* Charm Selection Carousel */}
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {filteredCharms.map((charm) => {
            const isAvailable = isCharmAvailable(charm);
            const isSelected = isCharmSelected(charm.id);
            const canSelect = isAvailable && (selectedCharms.length < maxCharms || isSelected);
            
            return (
              <CarouselItem key={charm.id} className="pl-2 md:pl-4 basis-1/3 md:basis-1/5">
                <div className="relative">
                  <button
                    className={`w-full h-full flex flex-col items-center ${
                      isSelected
                        ? 'ring-2 ring-sage-500 ring-offset-2'
                        : canSelect
                        ? 'ring-1 ring-gray-200 hover:ring-gray-300'
                        : 'ring-1 ring-gray-100 opacity-50'
                    } rounded-lg p-3 transition-all ${
                      !canSelect ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    onClick={() => canSelect && toggleCharm(charm.id)}
                    disabled={!canSelect}
                    aria-label={`${isSelected ? 'Remove' : 'Add'} ${charm.name} charm`}
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mb-2 relative">
                      <img 
                        src={charm.imageUrl} 
                        alt={charm.name} 
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-sage-500/20 flex items-center justify-center">
                          <div className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      )}
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
                          <span className="text-white text-xs">🔒</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-center font-medium text-gray-700 mb-1">
                      {charm.name}
                    </span>
                    <span className="text-xs text-sage-600">
                      +EGP {charm.price.toFixed(2)}
                    </span>
                  </button>
                  
                  {!isAvailable && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Help text */}
      <div className="mt-4 text-xs text-gray-500">
        <p>• Select symbols first to unlock birthstones</p>
        <p>• Select birthstones to unlock zodiac charms</p>
        <p>• Maximum {maxCharms} charms per necklace</p>
      </div>
    </div>
  );
};

export default CharmSelector;
