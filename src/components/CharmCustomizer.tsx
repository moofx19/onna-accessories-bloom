
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, RotateCcw } from 'lucide-react';
import BaseSelector from './BaseSelector';
import LivePreview from './LivePreview';

interface BaseProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  type: 'gold' | 'silver' | 'rose-gold';
}

interface Charm {
  id: string;
  name: string;
  category: 'zodiac' | 'initials' | 'symbols' | 'birthstones';
  imageUrl: string;
  price: number;
  compatibleBases: string[];
}

interface SelectedCharms {
  zodiac: string[];
  initials: string[];
  symbols: string[];
  birthstones: string[];
}

interface CharmCustomizerProps {
  onCustomizationChange: (baseProduct: BaseProduct | null, charms: SelectedCharms, totalPrice: number) => void;
  maxCharmsPerCategory?: number;
}

const CharmCustomizer: React.FC<CharmCustomizerProps> = ({
  onCustomizationChange,
  maxCharmsPerCategory = 3
}) => {
  // Base product options with your uploaded chain image
  const baseProducts: BaseProduct[] = [
    {
      id: 'gold-chain',
      name: 'Gold Chain Necklace',
      imageUrl: '/lovable-uploads/9d852174-9bd0-4978-baf8-0007913866a9.png',
      price: 450,
      type: 'gold'
    },
    {
      id: 'silver-chain',
      name: 'Silver Chain Necklace',
      imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price: 350,
      type: 'silver'
    },
    {
      id: 'rose-gold-chain',
      name: 'Rose Gold Chain Necklace',
      imageUrl: 'https://images.unsplash.com/photo-1612903252418-ac93af19963d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price: 500,
      type: 'rose-gold'
    }
  ];

  // Initialize with the first base product (your uploaded chain)
  const [selectedBase, setSelectedBase] = useState<BaseProduct>(baseProducts[0]);
  const [selectedCharms, setSelectedCharms] = useState<SelectedCharms>({
    zodiac: [],
    initials: [],
    symbols: [],
    birthstones: []
  });
  
  const [activeCategory, setActiveCategory] = useState<string>('symbols');
  const [previewCharms, setPreviewCharms] = useState<{ [key: string]: string }>({});
  
  // Charm data with your uploaded charm images
  const charmData: { [key: string]: Charm[] } = {
    symbols: [
      {
        id: 'lemon-slice',
        name: 'Lemon Slice',
        category: 'symbols',
        imageUrl: '/lovable-uploads/b2ec9aa7-d1be-4b66-b363-3b42fd9206b1.png',
        price: 75,
        compatibleBases: ['gold-chain', 'silver-chain', 'rose-gold-chain']
      },
      {
        id: 'starfish',
        name: 'Starfish',
        category: 'symbols',
        imageUrl: '/lovable-uploads/293ddfc0-9173-4de2-a8f3-4a6078ac0a85.png',
        price: 85,
        compatibleBases: ['gold-chain', 'silver-chain']
      },
      {
        id: 'celestial',
        name: 'Celestial Night',
        category: 'symbols',
        imageUrl: '/lovable-uploads/2aacaef9-7bfc-4169-ae3b-5cd630804c4b.png',
        price: 95,
        compatibleBases: ['gold-chain', 'rose-gold-chain']
      }
    ],
    initials: [
      {
        id: 'letter-a',
        name: 'Letter A',
        category: 'initials',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=60&h=60&fit=crop',
        price: 65,
        compatibleBases: ['gold-chain', 'silver-chain', 'rose-gold-chain']
      },
      {
        id: 'letter-b',
        name: 'Letter B',
        category: 'initials',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop',
        price: 65,
        compatibleBases: ['gold-chain', 'silver-chain']
      }
    ],
    zodiac: [
      {
        id: 'leo',
        name: 'Leo',
        category: 'zodiac',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
        price: 85,
        compatibleBases: ['gold-chain', 'rose-gold-chain']
      },
      {
        id: 'taurus',
        name: 'Taurus',
        category: 'zodiac',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=60&h=60&fit=crop',
        price: 85,
        compatibleBases: ['silver-chain', 'gold-chain']
      }
    ],
    birthstones: [
      {
        id: 'ruby',
        name: 'Ruby',
        category: 'birthstones',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
        price: 95,
        compatibleBases: ['gold-chain', 'silver-chain', 'rose-gold-chain']
      }
    ]
  };

  const categories = [
    { id: 'symbols', name: 'Symbols', color: 'bg-blue-500' },
    { id: 'initials', name: 'Initials', color: 'bg-green-500' },
    { id: 'zodiac', name: 'Zodiac', color: 'bg-purple-500' },
    { id: 'birthstones', name: 'Birthstones', color: 'bg-red-500' }
  ];

  const selectBase = (base: BaseProduct) => {
    setSelectedBase(base);
    // Clear charms when changing base
    setSelectedCharms({
      zodiac: [],
      initials: [],
      symbols: [],
      birthstones: []
    });
    setPreviewCharms({});
  };

  const selectCharm = (charm: Charm) => {
    if (!selectedBase || !charm.compatibleBases.includes(selectedBase.id)) {
      return; // Charm not compatible with selected base
    }

    const category = charm.category;
    const currentSelected = selectedCharms[category];
    
    if (currentSelected.includes(charm.id)) {
      // Remove charm if already selected
      const newSelected = currentSelected.filter(id => id !== charm.id);
      setSelectedCharms(prev => ({
        ...prev,
        [category]: newSelected
      }));
      
      // Update preview to show previous charm or remove if none
      const newPreview = { ...previewCharms };
      if (newSelected.length > 0) {
        newPreview[category] = newSelected[newSelected.length - 1];
      } else {
        delete newPreview[category];
      }
      setPreviewCharms(newPreview);
    } else {
      // Add charm if under limit
      if (currentSelected.length < maxCharmsPerCategory) {
        const newSelected = [...currentSelected, charm.id];
        setSelectedCharms(prev => ({
          ...prev,
          [category]: newSelected
        }));
        
        // Update preview to show most recent charm
        setPreviewCharms(prev => ({
          ...prev,
          [category]: charm.id
        }));
      }
    }
  };

  const removeCharmFromCategory = (category: string, charmId: string) => {
    const newSelected = selectedCharms[category].filter(id => id !== charmId);
    setSelectedCharms(prev => ({
      ...prev,
      [category]: newSelected
    }));
    
    // Update preview
    const newPreview = { ...previewCharms };
    if (newSelected.length > 0) {
      newPreview[category] = newSelected[newSelected.length - 1];
    } else {
      delete newPreview[category];
    }
    setPreviewCharms(newPreview);
  };

  const clearAllCharms = () => {
    setSelectedCharms({
      zodiac: [],
      initials: [],
      symbols: [],
      birthstones: []
    });
    setPreviewCharms({});
  };

  const getTotalPrice = () => {
    let total = selectedBase ? selectedBase.price : 0;
    Object.entries(selectedCharms).forEach(([category, charmIds]) => {
      charmIds.forEach(charmId => {
        const charm = charmData[category]?.find(c => c.id === charmId);
        if (charm) total += charm.price;
      });
    });
    return total;
  };

  const getTotalCharmCount = () => {
    return Object.values(selectedCharms).flat().length;
  };

  const getPreviewCharmsData = () => {
    return Object.entries(previewCharms).map(([category, charmId]) => {
      return charmData[category]?.find(c => c.id === charmId);
    }).filter(Boolean);
  };

  const getCompatibleCharms = () => {
    if (!selectedBase) return [];
    return charmData[activeCategory]?.filter(charm => 
      charm.compatibleBases.includes(selectedBase.id)
    ) || [];
  };

  // Notify parent component of changes
  useEffect(() => {
    onCustomizationChange(selectedBase, selectedCharms, getTotalPrice());
  }, [selectedBase, selectedCharms]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-screen">
      {/* Always-Visible Live Preview - Left Side */}
      <div className="lg:w-1/2">
        <LivePreview
          selectedBase={selectedBase}
          previewCharms={getPreviewCharmsData()}
          totalPrice={getTotalPrice()}
          totalCharmCount={getTotalCharmCount()}
        />
      </div>

      {/* Selection Interface - Right Side */}
      <div className="lg:w-1/2 space-y-8">
        {/* Base Product Selection */}
        <BaseSelector
          bases={baseProducts}
          selectedBase={selectedBase}
          onBaseSelect={selectBase}
        />

        {/* Charm Selection */}
        {selectedBase && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Add Your Charms</h3>
            
            {/* Selected Charms Summary */}
            {getTotalCharmCount() > 0 && (
              <div className="mb-6 p-4 bg-sage-50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-sage-800">Selected Charms ({getTotalCharmCount()})</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedCharms({
                        zodiac: [],
                        initials: [],
                        symbols: [],
                        birthstones: []
                      });
                      setPreviewCharms({});
                    }}
                    className="text-rose-600 border-rose-300 hover:bg-rose-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                </div>
                
                {Object.entries(selectedCharms).map(([category, charmIds]) => (
                  charmIds.length > 0 && (
                    <div key={category} className="mb-2">
                      <span className="text-sm font-medium capitalize text-gray-700">{category}: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {charmIds.map(charmId => {
                          const charm = charmData[category]?.find(c => c.id === charmId);
                          const isInPreview = previewCharms[category] === charmId;
                          return charm ? (
                            <Badge 
                              key={charmId} 
                              variant="secondary"
                              className={`text-xs ${isInPreview ? 'bg-sage-200 text-sage-800' : 'bg-gray-200 text-gray-700'}`}
                            >
                              {charm.name} +EGP {charm.price}
                              {isInPreview && <span className="ml-1 text-sage-600">👁</span>}
                              <button
                                onClick={() => removeCharmFromCategory(category, charmId)}
                                className="ml-1 text-rose-500 hover:text-rose-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Category Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className={activeCategory === category.id ? 'bg-sage-500 hover:bg-sage-600' : ''}
                >
                  {category.name}
                  {selectedCharms[category.id].length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {selectedCharms[category.id].length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Charm Selection Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {getCompatibleCharms().map((charm) => {
                const isSelected = selectedCharms[charm.category].includes(charm.id);
                const isInPreview = previewCharms[charm.category] === charm.id;
                const canSelect = selectedCharms[charm.category].length < maxCharmsPerCategory;
                
                return (
                  <div
                    key={charm.id}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-sage-500 bg-sage-50' 
                        : canSelect || isSelected
                        ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        : 'border-gray-100 opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => (canSelect || isSelected) && selectCharm(charm)}
                  >
                    {/* Preview indicator */}
                    {isInPreview && (
                      <div className="absolute top-2 right-2 bg-sage-500 text-white rounded-full p-1">
                        <span className="text-xs">👁</span>
                      </div>
                    )}
                    
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 bg-sage-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                    )}
                    
                    <div className="aspect-square bg-gray-100 rounded-md mb-3 overflow-hidden">
                      <img 
                        src={charm.imageUrl} 
                        alt={charm.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <h4 className="font-medium text-sm text-center mb-1">{charm.name}</h4>
                    <p className="text-sage-600 text-center text-sm">+EGP {charm.price}</p>
                    
                    {!canSelect && !isSelected && (
                      <div className="absolute inset-0 bg-gray-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded">
                          Max {maxCharmsPerCategory}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {getCompatibleCharms().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No {activeCategory} charms available for {selectedBase.name}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharmCustomizer;
