
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, RotateCcw, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

interface Charm {
  id: string;
  name: string;
  category: 'zodiac' | 'initials' | 'symbols' | 'birthstones';
  imageUrl: string;
  price: number;
}

interface PersistentCharmTrayProps {
  selectedCharms: Charm[];
  onRemoveCharm: (charmId: string) => void;
  onClearAll: () => void;
  onReorderCharms: (fromIndex: number, toIndex: number) => void;
  totalPrice: number;
}

const PersistentCharmTray: React.FC<PersistentCharmTrayProps> = ({
  selectedCharms,
  onRemoveCharm,
  onClearAll,
  onReorderCharms,
  totalPrice
}) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (selectedCharms.length === 0) {
    return null;
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderCharms(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const CharmItem: React.FC<{ charm: Charm; index: number }> = ({ charm, index }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, index)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, index)}
      className={`relative flex-shrink-0 border-2 rounded-lg p-2 cursor-move transition-all ${
        draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      } border-gray-200 bg-white hover:border-sage-300`}
      style={{ width: isMobile ? '80px' : '100px' }}
    >
      {/* Drag handle */}
      <div className="absolute top-1 left-1 text-gray-400">
        <GripVertical className="w-3 h-3" />
      </div>
      
      {/* Remove button */}
      <button
        onClick={() => onRemoveCharm(charm.id)}
        className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-rose-600 transition-colors z-10"
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

  if (isMobile) {
    // Mobile: Bottom tray with expand/collapse
    return (
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg transition-all duration-300 z-50 ${
        isExpanded ? 'h-64' : 'h-20'
      }`}>
        {/* Collapse/Expand button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 right-4 bg-sage-500 text-white rounded-full p-2 hover:bg-sage-600 transition-colors"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <h4 className="font-semibold text-sage-800">
                Selected Charms ({selectedCharms.length})
              </h4>
              <p className="text-sm text-sage-600">
                Total: EGP {totalPrice.toFixed(2)}
              </p>
            </div>
            {isExpanded && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearAll}
                className="text-rose-600 border-rose-300 hover:bg-rose-50"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Charms */}
          {isExpanded && (
            <div className="flex gap-3 overflow-x-auto pb-4">
              {selectedCharms.map((charm, index) => (
                <CharmItem key={charm.id} charm={charm} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop: Side tray
  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-white border-l border-gray-200 shadow-lg w-80 max-h-96 overflow-y-auto z-50">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-semibold text-sage-800">
              Selected Charms ({selectedCharms.length})
            </h4>
            <p className="text-sm text-sage-600">
              Total: EGP {totalPrice.toFixed(2)}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearAll}
            className="text-rose-600 border-rose-300 hover:bg-rose-50"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Charms Grid */}
        <div className="grid grid-cols-2 gap-3">
          {selectedCharms.map((charm, index) => (
            <CharmItem key={charm.id} charm={charm} index={index} />
          ))}
        </div>

        {/* Helper text */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Drag to reorder charms on necklace</p>
        </div>
      </div>
    </div>
  );
};

export default PersistentCharmTray;
