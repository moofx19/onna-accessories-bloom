
import React, { useEffect, useState } from 'react';
import useImage from '../hooks/useImage';
import { useAdvancedCurveDetection } from '../hooks/useAdvancedCurveDetection';
import { useCharmPlacement } from '../hooks/useCharmPlacement';
import { useIsMobile } from '../hooks/use-mobile';

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

interface MultiBasePreviewProps {
  baseProducts: BaseProduct[];
  selectedCharms: Charm[];
  onBaseSelect: (base: BaseProduct) => void;
  selectedBaseId?: string;
}

const MultiBasePreview: React.FC<MultiBasePreviewProps> = ({
  baseProducts,
  selectedCharms,
  onBaseSelect,
  selectedBaseId
}) => {
  const isMobile = useIsMobile();
  const { detectNecklaceCurve } = useAdvancedCurveDetection();
  const [curves, setCurves] = useState<{ [key: string]: any[] }>({});
  const [detectionStatus, setDetectionStatus] = useState<{ [key: string]: string }>({});

  // Detect curves for all base products
  useEffect(() => {
    baseProducts.forEach(async (base) => {
      if (!curves[base.id]) {
        setDetectionStatus(prev => ({ ...prev, [base.id]: 'detecting' }));
        try {
          const result = await detectNecklaceCurve(base.imageUrl);
          setCurves(prev => ({ ...prev, [base.id]: result.curve }));
          setDetectionStatus(prev => ({ ...prev, [base.id]: 'complete' }));
          console.log(`Curve detection for ${base.name}:`, result.success ? 'Success' : 'Fallback', `(${result.confidence.toFixed(2)} confidence)`);
        } catch (error) {
          console.error(`Curve detection failed for ${base.name}:`, error);
          setDetectionStatus(prev => ({ ...prev, [base.id]: 'failed' }));
        }
      }
    });
  }, [baseProducts, detectNecklaceCurve, curves]);

  // Responsive grid classes
  const getGridClasses = () => {
    if (isMobile) return 'grid-cols-1';
    return 'grid-cols-2 lg:grid-cols-2 xl:grid-cols-4';
  };

  const BasePreviewCard: React.FC<{ base: BaseProduct }> = ({ base }) => {
    const [baseImage, baseImageStatus] = useImage(base.imageUrl);
    const charmPositions = useCharmPlacement(curves[base.id] || [], selectedCharms.length);
    const isSelected = selectedBaseId === base.id;

    const CharmOverlay: React.FC<{ charm: Charm; x: number; y: number; rotation: number; scale: number }> = ({ 
      charm, x, y, rotation, scale 
    }) => {
      const [charmImage, charmImageStatus] = useImage(charm.imageUrl);
      
      if (charmImageStatus !== 'loaded' || !charmImage) return null;
      
      const size = 24 * scale; // Smaller size for multi-preview
      
      return (
        <div
          className="absolute transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
            width: `${size}px`,
            height: `${size}px`,
            zIndex: 10
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden border border-white shadow-md bg-white">
            <img 
              src={charm.imageUrl} 
              alt={charm.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      );
    };

    return (
      <div 
        className={`relative bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg ${
          isSelected ? 'border-sage-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => onBaseSelect(base)}
      >
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-sage-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-20">
            <span className="text-xs">✓</span>
          </div>
        )}

        {/* Detection status */}
        {detectionStatus[base.id] === 'detecting' && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded z-20">
            AI Analyzing...
          </div>
        )}

        <div className="relative w-full aspect-square p-4">
          {/* Base necklace */}
          {baseImageStatus === 'loaded' && baseImage ? (
            <img 
              src={base.imageUrl} 
              alt={base.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Loading...</span>
            </div>
          )}
          
          {/* AI-positioned charms */}
          {detectionStatus[base.id] === 'complete' && selectedCharms.map((charm, index) => {
            const position = charmPositions[index];
            if (!position) return null;
            
            return (
              <CharmOverlay
                key={`preview-${base.id}-${charm.id}-${index}`}
                charm={charm}
                x={position.x}
                y={position.y}
                rotation={position.rotation}
                scale={position.scale * 0.8} // Smaller for multi-preview
              />
            );
          })}
        </div>
        
        {/* Base info */}
        <div className="p-3 border-t border-gray-100">
          <h4 className="font-medium text-sm text-center truncate">{base.name}</h4>
          <p className="text-xs text-gray-600 text-center mt-1">EGP {base.price}</p>
          <div className={`text-xs text-center mt-1 capitalize px-2 py-1 rounded-full ${
            base.type === 'gold' ? 'bg-yellow-100 text-yellow-800' :
            base.type === 'silver' ? 'bg-gray-100 text-gray-800' :
            'bg-pink-100 text-pink-800'
          }`}>
            {base.type.replace('-', ' ')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center">Choose Your Necklace Base</h3>
      <div className={`grid ${getGridClasses()} gap-4`}>
        {baseProducts.map((base) => (
          <BasePreviewCard key={base.id} base={base} />
        ))}
      </div>
      {selectedCharms.length > 0 && (
        <p className="text-sm text-gray-600 text-center">
          AI-powered charm placement • {selectedCharms.length} charm{selectedCharms.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
};

export default MultiBasePreview;
