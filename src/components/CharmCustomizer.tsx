
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Circle, Text } from 'react-konva';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, RotateCcw } from 'lucide-react';
import useImage from 'use-image';

interface Charm {
  id: string;
  name: string;
  category: 'zodiac' | 'initials' | 'symbols' | 'birthstones';
  imageUrl: string;
  price: number;
  position: { x: number; y: number };
}

interface CharmCategories {
  [key: string]: Charm[];
}

interface SelectedCharms {
  zodiac: string[];
  initials: string[];
  symbols: string[];
  birthstones: string[];
}

interface CharmCustomizerProps {
  baseNecklaceImage: string;
  onCharmsChange: (charms: SelectedCharms, totalPrice: number) => void;
  maxCharmsPerCategory?: number;
}

const CharmCustomizer: React.FC<CharmCustomizerProps> = ({
  baseNecklaceImage,
  onCharmsChange,
  maxCharmsPerCategory = 3
}) => {
  const [selectedCharms, setSelectedCharms] = useState<SelectedCharms>({
    zodiac: [],
    initials: [],
    symbols: [],
    birthstones: []
  });
  
  const [activeCategory, setActiveCategory] = useState<string>('symbols');
  const [previewCharms, setPreviewCharms] = useState<{ [key: string]: string }>({});
  
  // Load base necklace image
  const [baseImage] = useImage(baseNecklaceImage);
  
  // Mock charm data with positions for preview
  const charmData: CharmCategories = {
    symbols: [
      {
        id: 'heart',
        name: 'Heart',
        category: 'symbols',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
        price: 75,
        position: { x: 200, y: 120 }
      },
      {
        id: 'star',
        name: 'Star',
        category: 'symbols',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop',
        price: 75,
        position: { x: 160, y: 140 }
      },
      {
        id: 'moon',
        name: 'Moon',
        category: 'symbols',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=60&h=60&fit=crop',
        price: 75,
        position: { x: 240, y: 140 }
      }
    ],
    initials: [
      {
        id: 'letter-a',
        name: 'Letter A',
        category: 'initials',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=60&h=60&fit=crop',
        price: 65,
        position: { x: 180, y: 160 }
      },
      {
        id: 'letter-b',
        name: 'Letter B',
        category: 'initials',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop',
        price: 65,
        position: { x: 220, y: 160 }
      }
    ],
    zodiac: [
      {
        id: 'leo',
        name: 'Leo',
        category: 'zodiac',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
        price: 85,
        position: { x: 140, y: 120 }
      },
      {
        id: 'taurus',
        name: 'Taurus',
        category: 'zodiac',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=60&h=60&fit=crop',
        price: 85,
        position: { x: 260, y: 120 }
      }
    ],
    birthstones: [
      {
        id: 'ruby',
        name: 'Ruby',
        category: 'birthstones',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
        price: 95,
        position: { x: 200, y: 180 }
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
    const [charmImage] = useImage(charm.imageUrl);
    
    return (
      <KonvaImage
        image={charmImage}
        x={charm.position.x}
        y={charm.position.y}
        width={40}
        height={40}
        offsetX={20}
        offsetY={20}
      />
    );
  };

  const selectCharm = (charm: Charm) => {
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
    let total = 0;
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

  // Notify parent component of changes
  useEffect(() => {
    onCharmsChange(selectedCharms, getTotalPrice());
  }, [selectedCharms]);

  return (
    <div className="w-full">
      {/* Live Preview */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-center">Live Preview</h3>
        <div className="flex justify-center">
          <div className="relative bg-gray-50 rounded-lg p-4">
            <Stage width={400} height={300}>
              <Layer>
                {/* Base necklace */}
                {baseImage && (
                  <KonvaImage
                    image={baseImage}
                    width={400}
                    height={300}
                  />
                )}
                
                {/* Preview charms - only latest per category */}
                {getPreviewCharmsData().map((charm) => (
                  charm && <CharmPreviewImage key={`preview-${charm.id}`} charm={charm} />
                ))}
              </Layer>
            </Stage>
            
            {/* Preview summary */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Showing {Object.keys(previewCharms).length} charm{Object.keys(previewCharms).length !== 1 ? 's' : ''} 
                {getTotalCharmCount() > Object.keys(previewCharms).length && (
                  <span className="text-sage-600 ml-1">
                    ({getTotalCharmCount() - Object.keys(previewCharms).length} more in cart)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

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
          
          <div className="mt-3 pt-3 border-t border-sage-200">
            <p className="font-semibold text-sage-800">
              Total Charms Cost: +EGP {getTotalPrice().toFixed(2)}
            </p>
          </div>
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {charmData[activeCategory]?.map((charm) => {
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
      
      {/* Help Text */}
      <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <p className="font-medium mb-2">How it works:</p>
        <ul className="space-y-1 text-xs">
          <li>• Select up to {maxCharmsPerCategory} charms per category</li>
          <li>• Preview shows the most recent charm from each category</li>
          <li>• All selected charms are added to your cart</li>
          <li>• Eye icon (👁) indicates which charm is shown in preview</li>
        </ul>
      </div>
    </div>
  );
};

export default CharmCustomizer;
