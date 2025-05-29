
import React from "react";

interface Charm {
  id: string;
  label: string;
  price: number;
  image: string;
}

interface CharmSelectorProps {
  charms: Charm[];
  selected: Charm | null;
  onSelect: (charm: Charm | null) => void;
}

const CharmSelector: React.FC<CharmSelectorProps> = ({ charms, selected, onSelect }) => {
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-3 text-gray-900">Select a Charm</h3>
      <div className="grid grid-cols-3 gap-3">
        {charms.map((charm) => (
          <button
            key={charm.id}
            onClick={() => onSelect(selected?.id === charm.id ? null : charm)}
            className={`p-3 border-2 rounded-lg transition-all ${
              selected?.id === charm.id 
                ? "border-sage-500 bg-sage-50 ring-2 ring-sage-200" 
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src={charm.image} 
                alt={charm.label} 
                className="w-10 h-10 object-contain"
              />
            </div>
            <p className="text-sm font-medium text-gray-900">{charm.label}</p>
            <p className="text-xs text-sage-600">+EGP {charm.price}</p>
          </button>
        ))}
      </div>
      
      {selected && (
        <div className="mt-4 p-3 bg-sage-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              Selected: {selected.label}
            </span>
            <button
              onClick={() => onSelect(null)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharmSelector;
