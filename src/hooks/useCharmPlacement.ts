
import { useMemo } from 'react';

interface CurvePoint {
  x: number;
  y: number;
  angle: number;
}

interface CharmPosition {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export const useCharmPlacement = (curve: CurvePoint[], charmCount: number) => {
  const positions = useMemo((): CharmPosition[] => {
    if (!curve.length || !charmCount) return [];

    const positions: CharmPosition[] = [];
    
    if (charmCount === 1) {
      // Single charm at the center of the curve
      const centerIndex = Math.floor(curve.length / 2);
      const centerPoint = curve[centerIndex];
      positions.push({
        x: centerPoint.x,
        y: centerPoint.y,
        rotation: centerPoint.angle * 180 / Math.PI,
        scale: 1
      });
    } else if (charmCount === 2) {
      // Two charms at the endpoints
      const startPoint = curve[0];
      const endPoint = curve[curve.length - 1];
      
      positions.push({
        x: startPoint.x,
        y: startPoint.y,
        rotation: startPoint.angle * 180 / Math.PI,
        scale: 1
      });
      
      positions.push({
        x: endPoint.x,
        y: endPoint.y,
        rotation: endPoint.angle * 180 / Math.PI,
        scale: 1
      });
    } else {
      // Multiple charms distributed evenly
      for (let i = 0; i < charmCount; i++) {
        // Calculate position along curve (excluding absolute endpoints for better distribution)
        const t = charmCount === 1 ? 0.5 : i / (charmCount - 1);
        const curveIndex = Math.floor(t * (curve.length - 1));
        const point = curve[curveIndex];
        
        // Calculate scale based on curve position (smaller at endpoints)
        const distanceFromCenter = Math.abs(t - 0.5) * 2;
        const scale = 0.8 + (1 - distanceFromCenter) * 0.2;
        
        positions.push({
          x: point.x,
          y: point.y,
          rotation: point.angle * 180 / Math.PI,
          scale
        });
      }
    }

    return positions;
  }, [curve, charmCount]);

  return positions;
};
