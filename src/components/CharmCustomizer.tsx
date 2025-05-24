
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, RotateCcw } from 'lucide-react';
import useImage from '../hooks/useImage';

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
  position: { x: number; y: number };
  compatibleBases: string[]; // Which base products this charm works with
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
  const [selectedBase, setSelectedBase] = useState<BaseProduct | null>(null);
  const [selectedCharms, setSelectedCharms] = useState<SelectedCharms>({
    zodiac: [],
    initials: [],
    symbols: [],
    birthstones: []
  });
  
  const [activeCategory, setActiveCategory] = useState<string>('symbols');
  const [previewCharms, setPreviewCharms] = useState<{ [key: string]: string }>({});
  
  // Load base necklace image
  const [baseImage, baseImageStatus] = useImage(selectedBase?.imageUrl || '');
  
  // Base product options
  const baseProducts: BaseProduct[] = [
    {
      id: 'gold-chain',
      name: 'Gold Chain Necklace',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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

  // Charm data with base compatibility
  const charmData: { [key: string]: Charm[] } = {
    symbols: [
      {
        id: 'heart',
        name: 'Heart',
        category: 'symbols',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
        price: 75,
        position: { x: 50, y: 40 },
        compatibleBases: ['gold-chain', 'silver-chain', 'rose-gold-chain']
      },
      {
        id: 'star',
        name: 'Star',
        category: 'symbols',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop',
        price: 75,
        position: { x: 35, y: 50 },
        compatibleBases: ['gold-chain', 'silver-chain']
      },
      {
        id: 'moon',
        name: 'Moon',
        category: 'symbols',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=60&h=60&fit=crop',
        price: 75,
        position: { x: 65, y: 50 },
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
        position: { x: 40, y: 60 },
        compatibleBases: ['gold-chain', 'silver-chain', 'rose-gold-chain']
      },
      {
        id: 'letter-b',
        name: 'Letter B',
        category: 'initials',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop',
        price: 65,
        position: { x: 60, y: 60 },
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
        position: { x: 30, y: 35 },
        compatibleBases: ['gold-chain', 'rose-gold-chain']
      },
      {
        id: 'taurus',
        name: 'Taurus',
        category: 'zodiac',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=60&h=60&fit=crop',
        price: 85,
        position: { x: 70, y: 35 },
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
        position: { x: 50, y: 65 },
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

  const CharmPreviewImage: React.FC<{ charm: Charm }> = ({ charm }) => {
    const [charmImage, charmImageStatus] = useImage(charm.imageUrl);
    
    if (charmImageStatus !== 'loaded' || !charmImage) return null;
    
    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white shadow-lg z-10"
        style={{
          left: `${charm.position.x}%`,
          top: `${charm.position.y}%`
        }}
      >
        <img 
          src={charm.imageUrl} 
          alt={charm.name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

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
      <div className="lg:w-1/2 lg:sticky lg:top-24 lg:h-fit">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Live Preview</h3>
          
          {!selectedBase ? (
            <div className="aspect-square max-w-md mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Select a base necklace to start customizing
              </p>
            </div>
          ) : (
            <div className="relative max-w-md mx-auto">
              <div className="relative w-full aspect-square">
                {/* Base necklace */}
                {baseImageStatus === 'loaded' && baseImage ? (
                  <img 
                    src={selectedBase.imageUrl} 
                    alt={selectedBase.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Loading...</span>
                  </div>
                )}
                
                {/* Preview charms - only latest per category */}
                {getPreviewCharmsData().map((charm) => (
                  charm && <CharmPreviewImage key={`preview-${charm.id}`} charm={charm} />
                ))}
              </div>
              
              {/* Preview info */}
              <div className="mt-4 text-center">
                <h4 className="font-medium text-lg">{selectedBase.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Base: EGP {selectedBase.price.toFixed(2)}
                </p>
                {getTotalCharmCount() > 0 && (
                  <p className="text-sm text-sage-600">
                    + {getTotalCharmCount()} charm{getTotalCharmCount() !== 1 ? 's' : ''}
                  </p>
                )}
                <p className="text-lg font-semibold text-sage-800 mt-2">
                  Total: EGP {getTotalPrice().toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selection Interface - Right Side */}
      <div className="lg:w-1/2 space-y-8">
        {/* Base Product Selection */}
        <div>
          <h3 className="text-xl font-semibold mb-4">1. Choose Your Base Necklace</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {baseProducts.map((base) => (
              <div
                key={base.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedBase?.id === base.id 
                    ? 'border-sage-500 bg-sage-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => selectBase(base)}
              >
                {selectedBase?.id === base.id && (
                  <div className="absolute top-2 right-2 bg-sage-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                )}
                
                <div className="aspect-square bg-gray-100 rounded-md mb-3 overflow-hidden">
                  <img 
                    src={base.imageUrl} 
                    alt={base.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h4 className="font-medium text-sm text-center mb-1">{base.name}</h4>
                <p className="text-sage-600 text-center text-sm">EGP {base.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charm Selection */}
        {selectedBase && (
          <div>
            <h3 className="text-xl font-semibold mb-4">2. Add Your Charms</h3>
            
            {/* Selected Charms Summary */}
            {getTotalCharmCount() > 0 && (
              <div className="mb-6 p-4 bg-sage-50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-sage-800">Selected Charms ({getTotalCharmCount()})</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAllCharms}
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
