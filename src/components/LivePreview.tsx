
import React from 'react';
import useImage from '../hooks/useImage';
import SmartCharmPositioning from './SmartCharmPositioning';

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
}

interface LivePreviewProps {
  selectedBase: BaseProduct | null;
  previewCharms: Charm[];
  totalPrice: number;
  totalCharmCount: number;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  selectedBase,
  previewCharms,
  totalPrice,
  totalCharmCount
}) => {
  const [baseImage, baseImageStatus] = useImage(selectedBase?.imageUrl || '');

  const CharmImage: React.FC<{ charm: Charm; x: number; y: number; rotation: number }> = ({ 
    charm, x, y, rotation 
  }) => {
    const [charmImage, charmImageStatus] = useImage(charm.imageUrl);
    
    if (charmImageStatus !== 'loaded' || !charmImage) return null;
    
    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white shadow-lg z-10 transition-all duration-300"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`
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

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
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
            
            {/* Smart positioned charms */}
            <SmartCharmPositioning 
              necklaceType={selectedBase.type}
              selectedCharms={previewCharms}
            >
              {(positions) => (
                <>
                  {previewCharms.map((charm, index) => {
                    const position = positions[index];
                    if (!position) return null;
                    
                    return (
                      <CharmImage
                        key={`preview-${charm.id}`}
                        charm={charm}
                        x={position.x}
                        y={position.y}
                        rotation={position.rotation}
                      />
                    );
                  })}
                </>
              )}
            </SmartCharmPositioning>
          </div>
          
          {/* Preview info */}
          <div className="mt-4 text-center">
            <h4 className="font-medium text-lg">{selectedBase.name}</h4>
            <p className="text-sm text-gray-600 mt-1">
              Base: EGP {selectedBase.price.toFixed(2)}
            </p>
            {totalCharmCount > 0 && (
              <p className="text-sm text-sage-600">
                + {totalCharmCount} charm{totalCharmCount !== 1 ? 's' : ''}
              </p>
            )}
            <p className="text-lg font-semibold text-sage-800 mt-2">
              Total: EGP {totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivePreview;
