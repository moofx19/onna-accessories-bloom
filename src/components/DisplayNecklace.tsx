
import React, { useRef, useEffect } from "react";

interface Charm {
  id: string;
  label: string;
  price: number;
  image: string;
}

interface DisplayNecklaceProps {
  selectedCharm: Charm | null;
  onExportImage?: (dataUrl: string) => void;
}

const DisplayNecklace: React.FC<DisplayNecklaceProps> = ({ selectedCharm, onExportImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const baseImage = new Image();
    baseImage.crossOrigin = "anonymous";
    baseImage.src = "/lovable-uploads/76c36594-b8a6-4272-bb02-6ee87c1302b8.png";

    baseImage.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      if (selectedCharm) {
        const charmImage = new Image();
        charmImage.crossOrigin = "anonymous";
        charmImage.src = selectedCharm.image;

        charmImage.onload = () => {
          // Position charm at the center-bottom of the necklace
          const charmSize = 32;
          const charmX = canvas.width / 2 - charmSize / 2;
          const charmY = canvas.height / 2 + 10;
          
          ctx.drawImage(charmImage, charmX, charmY, charmSize, charmSize);

          // Export as base64 if callback provided
          const dataUrl = canvas.toDataURL("image/png");
          if (onExportImage) onExportImage(dataUrl);
        };
      } else {
        const dataUrl = canvas.toDataURL("image/png");
        if (onExportImage) onExportImage(dataUrl);
      }
    };
  }, [selectedCharm, onExportImage]);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        width={240} 
        height={240} 
        style={{ display: "none" }} 
      />
      <div className="relative w-60 h-60 mx-auto">
        <img 
          src="/lovable-uploads/76c36594-b8a6-4272-bb02-6ee87c1302b8.png" 
          alt="Necklace" 
          className="w-full h-full object-contain"
        />
        {selectedCharm && (
          <img
            src={selectedCharm.image}
            alt={selectedCharm.label}
            className="absolute top-[88%] left-[45%] w-6 h-6"
          />
        )}
      </div>
    </>
  );
};

export default DisplayNecklace;
