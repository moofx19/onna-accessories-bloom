
import React, { useEffect, useState } from 'react';
import useImage from '../hooks/useImage';
import { useAdvancedCurveDetection } from '../hooks/useAdvancedCurveDetection';
import { useCharmPlacement } from '../hooks/useCharmPlacement';

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
  const { detectNecklaceCurve } = useAdvancedCurveDetection();
  const [necklaceCurve, setNecklaceCurve] = useState<any[]>([]);
  const [detectionStatus, setDetectionStatus] = useState<'idle' | 'detecting' | 'complete'>('idle');
  const [confidence, setConfidence] = useState<number>(0);
  
  const charmPositions = useCharmPlacement(necklaceCurve, previewCharms.length);

  // Detect necklace curve when base image loads
  useEffect(() => {
    if (baseImageStatus === 'loaded' && selectedBase?.imageUrl) {
      setDetectionStatus('detecting');
      detectNecklaceCurve(selectedBase.imageUrl).then((result) => {
        setNecklaceCurve(result.curve);
        setConfidence(result.confidence);
        setDetectionStatus('complete');
        console.log(`Advanced curve detection for ${selectedBase.name}:`, 
          result.success ? 'Success' : 'Fallback', 
          `(${result.confidence.toFixed(2)} confidence)`);
      });
    }
  }, [baseImageStatus, selectedBase?.imageUrl, detectNecklaceCurve]);

  const CharmImage: React.FC<{ charm: Charm; x: number; y: number; rotation: number; scale: number }> = ({ 
    charm, x, y, rotation, scale 
  }) => {
    const [charmImage, charmImageStatus] = useImage(charm.imageUrl);
    
    if (charmImageStatus !== 'loaded' || !charmImage) return null;
    
    const size = 32 * scale; // Base size scaled
    
    return (
      <div
        className="absolute transition-all duration-300 ease-out"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
          width: `${size}px`,
          height: `${size}px`,
          zIndex: 10
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
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
            
            {/* Advanced detection status indicator */}
            {detectionStatus === 'detecting' && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                AI Analyzing Curve...
              </div>
            )}
            
            {detectionStatus === 'complete' && confidence > 0 && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                AI: {Math.round(confidence * 100)}% confident
              </div>
            )}
            
            {/* AI-positioned charms */}
            {detectionStatus === 'complete' && previewCharms.map((charm, index) => {
              const position = charmPositions[index];
              if (!position) return null;
              
              return (
                <CharmImage
                  key={`preview-${charm.id}-${index}`}
                  charm={charm}
                  x={position.x}
                  y={position.y}
                  rotation={position.rotation}
                  scale={position.scale}
                />
              );
            })}
            
            {/* Curve visualization (for debugging) */}
            {process.env.NODE_ENV === 'development' && necklaceCurve.length > 0 && (
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                style={{ zIndex: 5 }}
              >
                <path
                  d={`M ${necklaceCurve.map(point => `${point.x},${point.y}`).join(' L ')}`}
                  stroke="rgba(255, 0, 0, 0.5)"
                  strokeWidth="2"
                  fill="none"
                />
                {necklaceCurve.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill="red"
                    opacity="0.7"
                  />
                ))}
              </svg>
            )}
          </div>
          
          {/* Preview info */}
          <div className="mt-4 text-center">
            <h4 className="font-medium text-lg">{selectedBase.name}</h4>
            <p className="text-sm text-gray-600 mt-1">
              Base: EGP {selectedBase.price.toFixed(2)}
            </p>
            {totalCharmCount > 0 && (
              <p className="text-sm text-sage-600">
                + {totalCharmCount} charm{totalCharmCount !== 1 ? 's' : ''} (AI positioned)
              </p>
            )}
            <p className="text-lg font-semibold text-sage-800 mt-2">
              Total: EGP {totalPrice.toFixed(2)}
            </p>
            {detectionStatus === 'complete' && confidence > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Advanced AI curve detection • {Math.round(confidence * 100)}% accuracy
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LivePreview;
