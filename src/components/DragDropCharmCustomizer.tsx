
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, RotateCcw, Trash2 } from 'lucide-react';
import BaseSelector from './BaseSelector';

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

interface PlacedCharm {
  charm: Charm;
  x: number;
  y: number;
  id: string; // unique placement ID
}

interface SelectedCharms {
  zodiac: string[];
  initials: string[];
  symbols: string[];
  birthstones: string[];
}

interface DragDropCharmCustomizerProps {
  onCustomizationChange: (baseProduct: BaseProduct | null, charms: SelectedCharms, totalPrice: number) => void;
  maxCharmsPerCategory?: number;
}

const DragDropCharmCustomizer: React.FC<DragDropCharmCustomizerProps> = ({
  onCustomizationChange,
  maxCharmsPerCategory = 3
}) => {
  // Base product options
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

  // Charm data
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

  const [selectedBase, setSelectedBase] = useState<BaseProduct>(baseProducts[0]);
  const [placedCharms, setPlacedCharms] = useState<PlacedCharm[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('symbols');
  const [draggedCharm, setDraggedCharm] = useState<Charm | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const necklaceRef = useRef<HTMLDivElement>(null);

  const selectBase = (base: BaseProduct) => {
    setSelectedBase(base);
    // Remove charms that are not compatible with new base
    setPlacedCharms(prev => 
      prev.filter(placedCharm => 
        placedCharm.charm.compatibleBases.includes(base.id)
      )
    );
  };

  const handleDragStart = (charm: Charm) => {
    setDraggedCharm(charm);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!draggedCharm || !necklaceRef.current) return;

    const rect = necklaceRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100; // Convert to percentage
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if charm is compatible with selected base
    if (!draggedCharm.compatibleBases.includes(selectedBase.id)) {
      alert(`${draggedCharm.name} is not compatible with ${selectedBase.name}`);
      return;
    }

    const newPlacedCharm: PlacedCharm = {
      charm: draggedCharm,
      x,
      y,
      id: `${draggedCharm.id}-${Date.now()}`
    };

    setPlacedCharms(prev => [...prev, newPlacedCharm]);
    setDraggedCharm(null);
  };

  const removePlacedCharm = (placedCharmId: string) => {
    setPlacedCharms(prev => prev.filter(pc => pc.id !== placedCharmId));
  };

  const clearAllCharms = () => {
    setPlacedCharms([]);
  };

  const getTotalPrice = () => {
    const basePrice = selectedBase.price;
    const charmsPrice = placedCharms.reduce((total, pc) => total + pc.charm.price, 0);
    return basePrice + charmsPrice;
  };

  const getCompatibleCharms = () => {
    return charmData[activeCategory]?.filter(charm => 
      charm.compatibleBases.includes(selectedBase.id)
    ) || [];
  };

  const getSelectedCharmsForCallback = (): SelectedCharms => {
    const selectedCharms: SelectedCharms = {
      zodiac: [],
      initials: [],
      symbols: [],
      birthstones: []
    };

    placedCharms.forEach(pc => {
      selectedCharms[pc.charm.category].push(pc.charm.id);
    });

    return selectedCharms;
  };

  // Notify parent component of changes
  React.useEffect(() => {
    onCustomizationChange(selectedBase, getSelectedCharmsForCallback(), getTotalPrice());
  }, [selectedBase, placedCharms]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-screen">
      {/* Live Preview - Left Side */}
      <div className="lg:w-1/2">
        <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
          <h3 className="text-xl font-semibold mb-4 text-center">Drag & Drop Preview</h3>
          
          <div className="relative max-w-md mx-auto">
            <div 
              ref={necklaceRef}
              className={`relative w-full aspect-square border-4 border-dashed transition-colors ${
                isDragOver 
                  ? 'border-sage-500 bg-sage-50' 
                  : 'border-gray-300 bg-white'
              } rounded-lg overflow-hidden`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Base necklace image */}
              <img 
                src={selectedBase.imageUrl} 
                alt={selectedBase.name}
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
              />
              
              {/* Drag overlay */}
              {isDragOver && (
                <div className="absolute inset-0 bg-sage-500/20 flex items-center justify-center">
                  <div className="bg-white rounded-lg px-4 py-2 shadow-lg">
                    <p className="text-sage-800 font-medium">Drop charm here!</p>
                  </div>
                </div>
              )}
              
              {/* Placed charms */}
              {placedCharms.map((placedCharm) => (
                <div
                  key={placedCharm.id}
                  className="absolute group cursor-pointer"
                  style={{
                    left: `${placedCharm.x}%`,
                    top: `${placedCharm.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                >
                  <div className="relative">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
                      <img 
                        src={placedCharm.charm.imageUrl} 
                        alt={placedCharm.charm.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removePlacedCharm(placedCharm.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Preview info */}
            <div className="mt-4 text-center">
              <h4 className="font-medium text-lg">{selectedBase.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Base: EGP {selectedBase.price.toFixed(2)}
              </p>
              {placedCharms.length > 0 && (
                <p className="text-sm text-sage-600">
                  + {placedCharms.length} charm{placedCharms.length !== 1 ? 's' : ''} (manually placed)
                </p>
              )}
              <p className="text-lg font-semibold text-sage-800 mt-2">
                Total: EGP {getTotalPrice().toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Interface - Right Side */}
      <div className="lg:w-1/2 space-y-8">
        {/* Base Product Selection */}
        <BaseSelector
          bases={baseProducts}
          selectedBase={selectedBase}
          onBaseSelect={selectBase}
        />

        {/* Placed Charms Summary */}
        {placedCharms.length > 0 && (
          <div className="p-4 bg-sage-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-sage-800">Placed Charms ({placedCharms.length})</h4>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllCharms}
                className="text-rose-600 border-rose-300 hover:bg-rose-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {placedCharms.map(placedCharm => (
                <div key={placedCharm.id} className="relative group">
                  <div className="aspect-square bg-white rounded-md border p-1">
                    <img 
                      src={placedCharm.charm.imageUrl} 
                      alt={placedCharm.charm.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <button
                    onClick={() => removePlacedCharm(placedCharm.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <p className="text-xs text-center mt-1 text-gray-600 truncate">
                    {placedCharm.charm.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charm Selection */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Drag Charms to Necklace</h3>
          
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
              </Button>
            ))}
          </div>

          {/* Charm Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {getCompatibleCharms().map((charm) => (
              <div
                key={charm.id}
                className="border-2 border-gray-200 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-sage-300 hover:bg-sage-50 transition-all"
                draggable
                onDragStart={() => handleDragStart(charm)}
              >
                <div className="aspect-square bg-gray-100 rounded-md mb-3 overflow-hidden">
                  <img 
                    src={charm.imageUrl} 
                    alt={charm.name}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />
                </div>
                
                <h4 className="font-medium text-sm text-center mb-1">{charm.name}</h4>
                <p className="text-sage-600 text-center text-sm">+EGP {charm.price}</p>
                
                <div className="mt-2 text-center">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {charm.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {getCompatibleCharms().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No {activeCategory} charms available for {selectedBase.name}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">How to use:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Drag any charm from the selection area</li>
            <li>• Drop it anywhere on the necklace image</li>
            <li>• Click the X button to remove placed charms</li>
            <li>• Switch between base necklaces anytime</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DragDropCharmCustomizer;
