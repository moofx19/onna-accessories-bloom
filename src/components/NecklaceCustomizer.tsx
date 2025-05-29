
import React, { useState, useRef, useEffect } from "react";
import DisplayNecklace from "./DisplayNecklace";
import CharmSelector from "./CharmSelector";

const basePrice = 395;

const charms = [
  { id: "A", label: "A", price: 65, image: "/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png" },
  { id: "B", label: "B", price: 65, image: "/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png" },
  { id: "C", label: "C", price: 65, image: "/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png" },
  { id: "D", label: "D", price: 65, image: "/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png" },
  { id: "E", label: "E", price: 65, image: "/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png" },
];

const NecklaceCustomizer = () => {
  const [selectedCharm, setSelectedCharm] = useState(null);
  const [exportedImage, setExportedImage] = useState("");

  const totalPrice = basePrice + (selectedCharm?.price || 0);

  const handleSave = async () => {
    if (!exportedImage) {
      alert("Please wait for the image to be generated");
      return;
    }

    try {
      // Here you would send to your backend
      console.log("Saving necklace image:", {
        image: exportedImage,
        charm: selectedCharm?.id,
        price: totalPrice,
      });
      
      // For demonstration, create a download link
      const link = document.createElement('a');
      link.download = 'customized-necklace.png';
      link.href = exportedImage;
      link.click();
      
      alert("Necklace image saved successfully!");
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save necklace");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-lg font-bold mb-2 text-gray-900">Customize Your Necklace</h2>
      <DisplayNecklace selectedCharm={selectedCharm} onExportImage={setExportedImage} />
      <p className="text-xl font-semibold mt-2 text-gray-900">EGP {totalPrice.toFixed(2)}</p>
      <CharmSelector charms={charms} selected={selectedCharm} onSelect={setSelectedCharm} />

      <button
        onClick={handleSave}
        disabled={!exportedImage}
        className="mt-4 w-full px-4 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Customized Necklace
      </button>
    </div>
  );
};

export default NecklaceCustomizer;
