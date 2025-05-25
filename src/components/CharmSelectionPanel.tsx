
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, RotateCcw, GripVertical } from 'lucide-react';

interface Charm {
  id: string;
  name: string;
  category: 'zodiac' | 'initials' | 'symbols' | 'birthstones';
  imageUrl: string;
  price: number;
}

interface SelectedCharms {
  zodiac: string[];
  initials: string[];
  symbols: string[];
  birthstones: string[];
}

interface CharmSelectionPanelProps {
  selectedCharms: SelectedCharms;
  charmData: { [key: string]: Charm[] };
  previewCharms: { [key: string]: string };
  onRemoveCharm: (category: keyof SelectedCharms, charmId: string) => void;
  onClearAll: () => void;
  totalCharmCount: number;
  totalPrice: number;
}

const CharmSelectionPanel: React.FC<CharmSelectionPanelProps> = ({
  selectedCharms,
  charmData,
  previewCharms,
  onRemoveCharm,
  onClearAll,
  totalCharmCount,
  totalPrice
}) => {
  const getAllSelectedCharms = () => {
    const allCharms: (Charm & { category: keyof SelectedCharms })[] = [];
    
    (Object.entries(selectedCharms) as [keyof SelectedCharms, string[]][]).forEach(([category, charmIds]) => {
      charmIds.forEach(charmId => {
        const charm = charmData[category]?.find(c => c.id === charmId);
        if (charm) {
          allCharms.push({ ...charm, category });
        }
      });
    });
    
    return allCharms;
  };

  const allSelectedCharms = getAllSelectedCharms();

  if (totalCharmCount === 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg lg:static lg:border-0 lg:shadow-none lg:bg-gray-50 lg:rounded-lg">
        <div className="text-center text-gray-500">
          <p className="text-sm">No charms selected</p>
          <p className="text-xs mt-1">Choose charms to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg lg:static lg:border-0 lg:shadow-none lg:bg-sage-50 lg:rounded-lg">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h4 className="font-semibold text-sage-800">
              Selected Charms ({totalCharmCount})
            </h4>
            <p className="text-sm text-sage-600">
              +EGP {(totalPrice - (selectedCharms ? 450 : 0)).toFixed(2)} in charms
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearAll}
            className="text-rose-600 border-rose-300 hover:bg-rose-50"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>

        {/* Selected Charms Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-32 overflow-y-auto">
          {allSelectedCharms.map((charm) => {
            const isInPreview = previewCharms[charm.category] === charm.id;
            return (
              <div
                key={`${charm.category}-${charm.id}`}
                className={`relative border-2 rounded-lg p-2 ${
                  isInPreview 
                    ? 'border-sage-500 bg-sage-100' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* Preview indicator */}
                {isInPreview && (
                  <div className="absolute -top-1 -right-1 bg-sage-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    <span className="text-xs">👁</span>
                  </div>
                )}
                
                {/* Remove button */}
                <button
                  onClick={() => onRemoveCharm(charm.category, charm.id)}
                  className="absolute -top-1 -left-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-rose-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
                
                {/* Charm image */}
                <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden">
                  <img 
                    src={charm.imageUrl} 
                    alt={charm.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Charm info */}
                <div className="text-center">
                  <h5 className="font-medium text-xs text-gray-900 truncate">
                    {charm.name}
                  </h5>
                  <p className="text-xs text-sage-600">
                    EGP {charm.price}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className="text-xs mt-1 capitalize"
                  >
                    {charm.category}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Helper text */}
        <div className="mt-3 text-xs text-gray-500 text-center">
          <p>Charms with 👁 are currently shown in preview</p>
        </div>
      </div>
    </div>
  );
};

export default CharmSelectionPanel;
