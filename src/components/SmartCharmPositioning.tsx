
import React, { useMemo } from 'react';

interface CharmPosition {
  x: number;
  y: number;
  rotation: number;
}

interface SmartCharmPositioningProps {
  necklaceType: 'gold' | 'silver' | 'rose-gold';
  selectedCharms: any[];
  children: (positions: CharmPosition[]) => React.ReactNode;
}

const SmartCharmPositioning: React.FC<SmartCharmPositioningProps> = ({
  necklaceType,
  selectedCharms,
  children
}) => {
  // Define SVG paths for different necklace types
  const necklacePaths = {
    gold: "M50 80 Q200 120 350 80 Q200 140 50 80",
    silver: "M60 90 Q200 130 340 90 Q200 150 60 90", 
    'rose-gold': "M55 85 Q200 125 345 85 Q200 145 55 85"
  };

  const positions = useMemo(() => {
    if (selectedCharms.length === 0) return [];

    // Create a temporary SVG element to calculate path points
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', necklacePaths[necklaceType]);
    svg.appendChild(path);
    
    // Temporarily add to DOM to get path calculations
    document.body.appendChild(svg);
    
    const totalLength = path.getTotalLength();
    const charmPositions: CharmPosition[] = [];
    
    // Distribute charms evenly along the path
    selectedCharms.forEach((_, index) => {
      const progress = (index + 1) / (selectedCharms.length + 1);
      const point = path.getPointAtLength(progress * totalLength);
      
      // Calculate rotation based on path tangent
      const tangentPoint = path.getPointAtLength(Math.min(progress * totalLength + 1, totalLength));
      const rotation = Math.atan2(tangentPoint.y - point.y, tangentPoint.x - point.x) * 180 / Math.PI;
      
      charmPositions.push({
        x: point.x,
        y: point.y,
        rotation
      });
    });
    
    // Clean up
    document.body.removeChild(svg);
    
    return charmPositions;
  }, [necklaceType, selectedCharms.length]);

  return <>{children(positions)}</>;
};

export default SmartCharmPositioning;
