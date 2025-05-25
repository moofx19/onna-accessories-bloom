
import { useMemo } from 'react';

interface CharmPosition {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface CurvePoint {
  x: number;
  y: number;
  angle: number;
}

export const useCharmPlacement = (
  curve: CurvePoint[],
  charmCount: number
): CharmPosition[] => {
  return useMemo(() => {
    if (!curve || curve.length === 0 || charmCount === 0) {
      return [];
    }

    const positions: CharmPosition[] = [];
    
    if (charmCount === 1) {
      // Single charm goes in the center of the curve
      const centerIndex = Math.floor(curve.length / 2);
      const centerPoint = curve[centerIndex];
      positions.push({
        x: centerPoint.x,
        y: centerPoint.y,
        rotation: (centerPoint.angle * 180) / Math.PI,
        scale: 1.0
      });
    } else if (charmCount === 2) {
      // Two charms: one at 1/3 and one at 2/3 of the curve
      const firstIndex = Math.floor(curve.length / 3);
      const secondIndex = Math.floor((curve.length * 2) / 3);
      
      [firstIndex, secondIndex].forEach((index) => {
        const point = curve[index];
        positions.push({
          x: point.x,
          y: point.y,
          rotation: (point.angle * 180) / Math.PI,
          scale: 1.0
        });
      });
    } else {
      // Multiple charms: distribute evenly along the curve
      // Leave some space at the ends for a more natural look
      const startOffset = Math.floor(curve.length * 0.1); // 10% from start
      const endOffset = Math.floor(curve.length * 0.1);   // 10% from end
      const usableLength = curve.length - startOffset - endOffset;
      
      for (let i = 0; i < charmCount; i++) {
        const progress = charmCount === 1 ? 0.5 : i / (charmCount - 1);
        const curveIndex = startOffset + Math.floor(progress * usableLength);
        const safeIndex = Math.min(curveIndex, curve.length - 1);
        
        const point = curve[safeIndex];
        
        // Vary scale slightly for more natural look
        const baseScale = 1.0;
        const scaleVariation = 0.1; // ±10% variation
        const scale = baseScale + (Math.random() - 0.5) * scaleVariation;
        
        positions.push({
          x: point.x,
          y: point.y,
          rotation: (point.angle * 180) / Math.PI,
          scale: Math.max(0.8, Math.min(1.2, scale)) // Clamp scale between 0.8 and 1.2
        });
      }
    }

    return positions;
  }, [curve, charmCount]);
};
