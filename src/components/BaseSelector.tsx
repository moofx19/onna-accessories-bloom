
import React from 'react';

interface BaseProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  type: 'gold' | 'silver' | 'rose-gold';
}

interface BaseSelectorProps {
  bases: BaseProduct[];
  selectedBase: BaseProduct | null;
  onBaseSelect: (base: BaseProduct) => void;
}

const BaseSelector: React.FC<BaseSelectorProps> = ({
  bases,
  selectedBase,
  onBaseSelect
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Choose Your Base Necklace</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bases.map((base) => (
          <div
            key={base.id}
            className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
              selectedBase?.id === base.id 
                ? 'border-sage-500 bg-sage-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onBaseSelect(base)}
          >
            {selectedBase?.id === base.id && (
              <div className="absolute top-2 right-2 bg-sage-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-10">
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
  );
};

export default BaseSelector;
