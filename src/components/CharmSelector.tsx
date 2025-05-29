
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
    <div className="mt-4">
      <h3 className="font-medium mb-2">Select a Charm</h3>
      <div className="flex space-x-2 overflow-x-auto">
        {charms.map((charm) => (
          <button
            key={charm.id}
            onClick={() => onSelect(selected?.id === charm.id ? null : charm)}
            className={`p-2 border rounded ${
              selected?.id === charm.id ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <img src={charm.image} alt={charm.label} className="w-8 h-8" />
            <p className="text-sm">+EGP {charm.price}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CharmSelector;
