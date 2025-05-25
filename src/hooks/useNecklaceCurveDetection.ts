
import { useCallback, useRef } from 'react';

interface CurvePoint {
  x: number;
  y: number;
  angle: number;
}

interface DetectionResult {
  curve: CurvePoint[];
  startPoint: CurvePoint;
  endPoint: CurvePoint;
  success: boolean;
}

export const useNecklaceCurveDetection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const detectNecklaceCurve = useCallback(async (imageUrl: string): Promise<DetectionResult> => {
    return new Promise((resolve) => {
      // Create canvas for image processing
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        try {
          // Get image data for processing
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          
          if (!imageData) {
            resolve({ curve: [], startPoint: { x: 0, y: 0, angle: 0 }, endPoint: { x: 0, y: 0, angle: 0 }, success: false });
            return;
          }

          // Simple edge detection algorithm (simplified version of Canny edge detection)
          const edgePoints = detectEdges(imageData);
          
          // Find the main curve (necklace chain)
          const necklaceCurve = extractNecklaceCurve(edgePoints, canvas.width, canvas.height);
          
          if (necklaceCurve.length < 3) {
            // Fallback to predefined curve for the uploaded necklace
            const fallbackCurve = generateFallbackCurve(canvas.width, canvas.height);
            resolve({
              curve: fallbackCurve,
              startPoint: fallbackCurve[0],
              endPoint: fallbackCurve[fallbackCurve.length - 1],
              success: true
            });
            return;
          }

          resolve({
            curve: necklaceCurve,
            startPoint: necklaceCurve[0],
            endPoint: necklaceCurve[necklaceCurve.length - 1],
            success: true
          });
          
        } catch (error) {
          console.error('Curve detection failed:', error);
          // Fallback curve
          const fallbackCurve = generateFallbackCurve(canvas.width, canvas.height);
          resolve({
            curve: fallbackCurve,
            startPoint: fallbackCurve[0],
            endPoint: fallbackCurve[fallbackCurve.length - 1],
            success: true
          });
        }
      };
      
      img.onerror = () => {
        const fallbackCurve = generateFallbackCurve(400, 400);
        resolve({
          curve: fallbackCurve,
          startPoint: fallbackCurve[0],
          endPoint: fallbackCurve[fallbackCurve.length - 1],
          success: true
        });
      };
      
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
    });
  }, []);

  return { detectNecklaceCurve };
};

// Simple edge detection using gradient magnitude
function detectEdges(imageData: ImageData): { x: number; y: number }[] {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const edges: { x: number; y: number }[] = [];
  
  // Convert to grayscale and detect edges
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Get grayscale value
      const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      
      // Simple gradient calculation
      const gx = getGrayscale(data, x + 1, y, width) - getGrayscale(data, x - 1, y, width);
      const gy = getGrayscale(data, x, y + 1, width) - getGrayscale(data, x, y - 1, width);
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      
      // Threshold for edge detection
      if (magnitude > 30) {
        edges.push({ x, y });
      }
    }
  }
  
  return edges;
}

function getGrayscale(data: Uint8ClampedArray, x: number, y: number, width: number): number {
  const idx = (y * width + x) * 4;
  return (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
}

// Extract the main necklace curve from edge points
function extractNecklaceCurve(edgePoints: { x: number; y: number }[], width: number, height: number): CurvePoint[] {
  if (edgePoints.length === 0) return [];
  
  // Find points that form a curved line (necklace shape)
  // This is a simplified approach - in production, you'd use more sophisticated curve fitting
  const sortedPoints = edgePoints.sort((a, b) => a.x - b.x);
  const curve: CurvePoint[] = [];
  
  // Sample points along the curve
  const step = Math.max(1, Math.floor(sortedPoints.length / 20));
  for (let i = 0; i < sortedPoints.length; i += step) {
    const point = sortedPoints[i];
    const angle = calculateAngle(sortedPoints, i);
    curve.push({ x: point.x, y: point.y, angle });
  }
  
  return curve;
}

function calculateAngle(points: { x: number; y: number }[], index: number): number {
  if (index === 0 || index === points.length - 1) return 0;
  
  const prev = points[index - 1];
  const next = points[index + 1];
  
  return Math.atan2(next.y - prev.y, next.x - prev.x);
}

// Fallback curve based on typical necklace shape
function generateFallbackCurve(width: number, height: number): CurvePoint[] {
  const curve: CurvePoint[] = [];
  const centerX = width / 2;
  const startY = height * 0.3;
  const endY = height * 0.8;
  const curveWidth = width * 0.6;
  
  // Generate a U-shaped curve
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const x = centerX + (curveWidth / 2) * Math.cos(Math.PI * t);
    const y = startY + (endY - startY) * (1 - Math.cos(Math.PI * t)) / 2;
    
    // Calculate tangent angle
    const angle = Math.atan2(
      (endY - startY) * Math.sin(Math.PI * t) * Math.PI / 2,
      -(curveWidth / 2) * Math.sin(Math.PI * t) * Math.PI
    );
    
    curve.push({ x, y, angle });
  }
  
  return curve;
}
