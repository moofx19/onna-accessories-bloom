
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Charm {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: 'letters' | 'symbols' | 'birthstones' | 'zodiac';
}

interface BaseNecklace {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  type: 'gold' | 'silver' | 'rose-gold';
}

interface SimpleNecklaceCustomizerProps {
  onCustomizationChange: (
    baseProduct: BaseNecklace | null, 
    selectedCharms: Charm[], 
    totalPrice: number
  ) => void;
}

const SimpleNecklaceCustomizer: React.FC<SimpleNecklaceCustomizerProps> = ({
  onCustomizationChange
}) => {
  const [selectedBase, setSelectedBase] = useState<BaseNecklace | null>(null);
  const [selectedCharms, setSelectedCharms] = useState<Charm[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('letters');

  // Base necklaces data
  const baseNecklaces: BaseNecklace[] = [
    {
      id: 'gold-chain',
      name: 'Gold Chain',
      imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
      price: 395,
      type: 'gold'
    },
    {
      id: 'silver-chain',
      name: 'Silver Chain',
      imageUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=300&h=300&fit=crop',
      price: 345,
      type: 'silver'
    },
    {
      id: 'rose-gold-chain',
      name: 'Rose Gold Chain',
      imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop',
      price: 425,
      type: 'rose-gold'
    }
  ];

  // Charms data
  const charms: Charm[] = [
    // Letters
    { id: 'letter-A', name: 'A', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop', price: 65, category: 'letters' },
    { id: 'letter-B', name: 'B', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop', price: 65, category: 'letters' },
    { id: 'letter-C', name: 'C', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', price: 65, category: 'letters' },
    { id: 'letter-D', name: 'D', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop', price: 65, category: 'letters' },
    { id: 'letter-E', name: 'E', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop', price: 65, category: 'letters' },
    
    // Symbols
    { id: 'heart', name: 'Heart', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', price: 75, category: 'symbols' },
    { id: 'star', name: 'Star', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop', price: 75, category: 'symbols' },
    { id: 'moon', name: 'Moon', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop', price: 75, category: 'symbols' },
    { id: 'sun', name: 'Sun', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop', price: 75, category: 'symbols' },
    
    // Birthstones
    { id: 'ruby', name: 'Ruby', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', price: 95, category: 'birthstones' },
    { id: 'emerald', name: 'Emerald', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop', price: 95, category: 'birthstones' },
    { id: 'sapphire', name: 'Sapphire', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop', price: 95, category: 'birthstones' },
    
    // Zodiac
    { id: 'aries', name: 'Aries', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', price: 85, category: 'zodiac' },
    { id: 'taurus', name: 'Taurus', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop', price: 85, category: 'zodiac' },
    { id: 'gemini', name: 'Gemini', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop', price: 85, category: 'zodiac' },
  ];

  const categories = [
    { id: 'letters', name: 'Letters' },
    { id: 'symbols', name: 'Symbols' },
    { id: 'birthstones', name: 'Birthstones' },
    { id: 'zodiac', name: 'Zodiac' }
  ];

  const filteredCharms = charms.filter(charm => charm.category === activeCategory);

  const handleBaseSelect = (base: BaseNecklace) => {
    setSelectedBase(base);
    updateCustomization(base, selectedCharms);
  };

  const handleCharmSelect = (charm: Charm) => {
    let newCharms: Charm[];
    
    if (selectedCharms.find(c => c.id === charm.id)) {
      // Remove charm if already selected
      newCharms = selectedCharms.filter(c => c.id !== charm.id);
    } else {
      // Add charm if under limit (max 5)
      if (selectedCharms.length < 5) {
        newCharms = [...selectedCharms, charm];
      } else {
        return; // Don't add if at limit
      }
    }
    
    setSelectedCharms(newCharms);
    updateCustomization(selectedBase, newCharms);
  };

  const updateCustomization = (base: BaseNecklace | null, charms: Charm[]) => {
    const basePrice = base?.price || 0;
    const charmsPrice = charms.reduce((total, charm) => total + charm.price, 0);
    const totalPrice = basePrice + charmsPrice;
    
    onCustomizationChange(base, charms, totalPrice);
  };

  const isCharmSelected = (charmId: string) => {
    return selectedCharms.some(charm => charm.id === charmId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Base Necklace Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Your Base Necklace</h3>
        <div className="grid grid-cols-3 gap-4">
          {baseNecklaces.map((base) => (
            <button
              key={base.id}
              onClick={() => handleBaseSelect(base)}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedBase?.id === base.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 overflow-hidden">
                <img 
                  src={base.imageUrl} 
                  alt={base.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-medium text-gray-900">{base.name}</p>
              <p className="text-sm text-sage-600">EGP {base.price}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Necklace Preview */}
      {selectedBase && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Customized Necklace</h3>
          <div className="relative w-80 h-80 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
            {/* Base necklace */}
            <img 
              src={selectedBase.imageUrl}
              alt={selectedBase.name}
              className="w-full h-full object-cover"
            />
            
            {/* Selected charms positioned on the necklace */}
            {selectedCharms.map((charm, index) => {
              const positions = [
                { top: '45%', left: '50%' }, // center
                { top: '35%', left: '40%' }, // top left
                { top: '35%', left: '60%' }, // top right
                { top: '55%', left: '35%' }, // bottom left
                { top: '55%', left: '65%' }, // bottom right
              ];
              const position = positions[index] || positions[0];
              
              return (
                <div
                  key={charm.id}
                  className="absolute w-8 h-8 bg-white rounded-full border-2 border-white shadow-lg overflow-hidden transform -translate-x-1/2 -translate-y-1/2"
                  style={{ top: position.top, left: position.left }}
                >
                  <img 
                    src={charm.imageUrl}
                    alt={charm.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          </div>
          
          {/* Price display */}
          <div className="text-center mt-4">
            <p className="text-2xl font-semibold text-gray-900">
              EGP {((selectedBase?.price || 0) + selectedCharms.reduce((total, charm) => total + charm.price, 0)).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              Base: EGP {selectedBase.price} + {selectedCharms.length} charm{selectedCharms.length !== 1 ? 's' : ''}: EGP {selectedCharms.reduce((total, charm) => total + charm.price, 0)}
            </p>
          </div>
        </div>
      )}

      {/* Charm Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Select Charms ({selectedCharms.length}/5)
        </h3>
        
        {/* Category tabs */}
        <div className="flex space-x-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className={activeCategory === category.id ? 'bg-sage-500 hover:bg-sage-600' : ''}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Charm grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {filteredCharms.map((charm) => {
            const isSelected = isCharmSelected(charm.id);
            const canSelect = selectedCharms.length < 5 || isSelected;
            
            return (
              <button
                key={charm.id}
                onClick={() => handleCharmSelect(charm)}
                disabled={!canSelect}
                className={`relative p-3 border-2 rounded-lg transition-all ${
                  isSelected
                    ? 'border-sage-500 bg-sage-50 ring-2 ring-sage-200'
                    : canSelect
                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    : 'border-gray-100 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2 overflow-hidden mx-auto">
                  <img 
                    src={charm.imageUrl}
                    alt={charm.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-medium text-gray-900">{charm.name}</p>
                <p className="text-xs text-sage-600">+EGP {charm.price}</p>
                
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-sage-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected charms list */}
      {selectedCharms.length > 0 && (
        <div className="bg-sage-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Selected Charms:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCharms.map((charm) => (
              <div
                key={charm.id}
                className="flex items-center bg-white rounded-full px-3 py-1 text-sm shadow-sm"
              >
                <span className="text-gray-900">{charm.name}</span>
                <span className="mx-1 text-gray-500">•</span>
                <span className="text-sage-600">EGP {charm.price}</span>
                <button
                  onClick={() => handleCharmSelect(charm)}
                  className="ml-2 text-red-400 hover:text-red-600 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleNecklaceCustomizer;
