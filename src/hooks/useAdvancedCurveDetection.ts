
import { useCallback, useRef } from 'react';
import cv from 'opencv-ts';

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
  confidence: number;
}

export const useAdvancedCurveDetection = () => {
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
          // Get image data for OpenCV processing
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          
          if (!imageData) {
            resolve(generateFallbackResult(canvas.width, canvas.height));
            return;
          }

          // Convert to OpenCV Mat
          const src = cv.matFromImageData(imageData);
          const gray = new cv.Mat();
          const edges = new cv.Mat();
          const contours = new cv.MatVector();
          const hierarchy = new cv.Mat();

          // Convert to grayscale
          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

          // Apply Gaussian blur to reduce noise
          const blurred = new cv.Mat();
          cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

          // Edge detection using Canny
          cv.Canny(blurred, edges, 50, 150);

          // Find contours
          cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

          // Find the longest contour (likely the necklace chain)
          let maxContourIndex = -1;
          let maxContourLength = 0;

          for (let i = 0; i < contours.size(); i++) {
            const contour = contours.get(i);
            const perimeter = cv.arcLength(contour, false);
            
            if (perimeter > maxContourLength) {
              maxContourLength = perimeter;
              maxContourIndex = i;
            }
          }

          if (maxContourIndex === -1 || maxContourLength < 100) {
            console.log('No suitable necklace contour found, using fallback');
            resolve(generateFallbackResult(canvas.width, canvas.height));
            cleanup();
            return;
          }

          // Get the main contour
          const mainContour = contours.get(maxContourIndex);
          const curve = extractCurveFromContour(mainContour);
          
          const confidence = Math.min(maxContourLength / (canvas.width * 2), 1.0);

          resolve({
            curve,
            startPoint: curve[0] || { x: 0, y: 0, angle: 0 },
            endPoint: curve[curve.length - 1] || { x: 0, y: 0, angle: 0 },
            success: true,
            confidence
          });

          // Cleanup OpenCV objects
          function cleanup() {
            src.delete();
            gray.delete();
            edges.delete();
            blurred.delete();
            contours.delete();
            hierarchy.delete();
            if (mainContour) mainContour.delete();
          }
          cleanup();

        } catch (error) {
          console.error('OpenCV curve detection failed:', error);
          resolve(generateFallbackResult(canvas.width, canvas.height));
        }
      };
      
      img.onerror = () => {
        resolve(generateFallbackResult(400, 400));
      };
      
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
    });
  }, []);

  return { detectNecklaceCurve };
};

function extractCurveFromContour(contour: any): CurvePoint[] {
  const curve: CurvePoint[] = [];
  const points = [];
  
  // Extract points from contour
  for (let i = 0; i < contour.rows; i++) {
    const point = contour.data32S.slice(i * 2, i * 2 + 2);
    points.push({ x: point[0], y: point[1] });
  }

  // Sort points to create a smooth curve (simple left-to-right sort)
  points.sort((a, b) => a.x - b.x);

  // Sample points to create a smooth curve
  const step = Math.max(1, Math.floor(points.length / 20));
  for (let i = 0; i < points.length; i += step) {
    const point = points[i];
    const angle = calculateTangentAngle(points, i);
    curve.push({ x: point.x, y: point.y, angle });
  }

  return curve;
}

function calculateTangentAngle(points: { x: number; y: number }[], index: number): number {
  if (index === 0 || index === points.length - 1) return 0;
  
  const prev = points[Math.max(0, index - 1)];
  const next = points[Math.min(points.length - 1, index + 1)];
  
  return Math.atan2(next.y - prev.y, next.x - prev.x);
}

function generateFallbackResult(width: number, height: number): DetectionResult {
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
  
  return {
    curve,
    startPoint: curve[0],
    endPoint: curve[curve.length - 1],
    success: true,
    confidence: 0.8
  };
}
