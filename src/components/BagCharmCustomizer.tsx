
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Charm {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface ChainBase {
  id: string;
  name: string;
  image: string;
  price: number;
}

const BagCharmCustomizer: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('CHARM 1');
  const [selectedCharm, setSelectedCharm] = useState<Charm | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Sample data - replace with your actual data
  const charmTabs = ['CHARM 1', 'CHARM 2', 'CHARM 3', 'CHARM 4', 'CHARM 5', 'CHARM 6', 'CHARM 7'];
  
  const charms: { [key: string]: Charm[] } = {
    'CHARM 1': [
      { id: 'a', name: 'A', price: 25, image: '/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png' },
      { id: 'b', name: 'B', price: 25, image: '/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png' },
      { id: 'c', name: 'C', price: 25, image: '/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png' },
      { id: 'd', name: 'D', price: 25, image: '/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png' },
      { id: 'e', name: 'E', price: 25, image: '/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png' },
    ],
    'CHARM 2': [
      { id: 'f', name: 'F', price: 25, image: '/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png' },
      { id: 'g', name: 'G', price: 25, image: '/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png' },
    ],
    'CHARM 3': [
      { id: 'h', name: 'H', price: 25, image: '/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png' },
      { id: 'i', name: 'I', price: 25, image: '/lovable-uploads/15e2b1f1-2003-47e2-b113-e707a71f8cae.png' },
    ],
  };

  const chainBases: ChainBase[] = [
    { id: 'gold', name: 'Gold Chain', image: '/lovable-uploads/9d852174-9bd0-4978-baf8-0007913866a9.png', price: 120 },
    { id: 'silver', name: 'Silver Chain', image: '/lovable-uploads/9d852174-9bd0-4978-baf8-0007913866a9.png', price: 100 },
  ];

  // Set default chain base
  const [selectedChain, setSelectedChain] = useState<ChainBase>(chainBases[0]);

  const getTotalPrice = () => {
    const charmPrice = selectedCharm?.price || 0;
    const chainPrice = selectedChain?.price || 0;
    return (charmPrice + chainPrice) * quantity;
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => prev + 1);
    } else if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleNextTab = () => {
    const currentIndex = charmTabs.indexOf(activeTab);
    if (currentIndex < charmTabs.length - 1) {
      setActiveTab(charmTabs[currentIndex + 1]);
    }
  };

  const handlePreviousTab = () => {
    const currentIndex = charmTabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(charmTabs[currentIndex - 1]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Bag charms 2</h1>
      
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-8`}>
        {/* Left side - Product Display */}
        <div className="space-y-6">
          {/* Main Product Image */}
          <div className="bg-gray-100 rounded-lg p-8 aspect-square flex items-center justify-center">
            <div className="relative">
              <img 
                src={selectedChain.image} 
                alt="Chain base" 
                className="w-64 h-64 object-contain"
              />
              {selectedCharm && (
                <img
                  src={selectedCharm.image}
                  alt={selectedCharm.name}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8"
                />
              )}
            </div>
          </div>

          {/* Price */}
          <div className="text-2xl font-bold text-sage-700">
            EGP {getTotalPrice().toFixed(2)}
          </div>

          {/* Navigation arrows (Previous/Next Tab) */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <button 
              className="flex items-center gap-2 hover:text-sage-600 disabled:opacity-50"
              onClick={handlePreviousTab}
              disabled={charmTabs.indexOf(activeTab) === 0}
            >
              ← Previous Tab
            </button>
            <span className="font-medium text-sage-700">{activeTab}</span>
            <button 
              className="flex items-center gap-2 hover:text-sage-600 disabled:opacity-50"
              onClick={handleNextTab}
              disabled={charmTabs.indexOf(activeTab) === charmTabs.length - 1}
            >
              Next Tab →
            </button>
          </div>
        </div>

        {/* Right side - Selection Interface */}
        <div className="space-y-6">
          {/* Mobile: Chain Base Selection First */}
          {isMobile && (
            <div>
              <h3 className="font-medium text-sm text-gray-600 mb-3">SELECT CHAINS BASE</h3>
              
              <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2'} gap-3`}>
                {chainBases.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => setSelectedChain(chain)}
                    className={`p-4 border rounded-lg aspect-square flex items-center justify-center transition-all ${
                      selectedChain?.id === chain.id 
                        ? 'border-sage-500 bg-sage-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img 
                      src={chain.image} 
                      alt={chain.name}
                      className="w-16 h-16 object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Charm Tabs */}
          <div>
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2 mb-4`}>
              {charmTabs.slice(0, isMobile ? 4 : 4).map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs ${activeTab === tab ? 'bg-sage-500 hover:bg-sage-600' : 'border-sage-300 text-sage-700 hover:bg-sage-50'}`}
                >
                  {tab}
                </Button>
              ))}
            </div>
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
              {charmTabs.slice(isMobile ? 4 : 4).map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs ${activeTab === tab ? 'bg-sage-500 hover:bg-sage-600' : 'border-sage-300 text-sage-700 hover:bg-sage-50'}`}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>

          {/* Charm Selection */}
          <div>
            <h3 className="font-medium text-sm text-gray-600 mb-3">INITIAL CHARMS</h3>
            <p className="text-sm text-gray-500 mb-4">select a charm</p>
            
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-5'} gap-3`}>
              {charms[activeTab]?.map((charm) => (
                <button
                  key={charm.id}
                  onClick={() => setSelectedCharm(selectedCharm?.id === charm.id ? null : charm)}
                  className={`p-2 border rounded-full aspect-square flex items-center justify-center transition-all ${
                    selectedCharm?.id === charm.id 
                      ? 'border-sage-500 bg-sage-500 text-white' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-lg font-medium">{charm.name.toLowerCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Chain Base Selection */}
          {!isMobile && (
            <div>
              <h3 className="font-medium text-sm text-gray-600 mb-3">SELECT CHAINS BASE</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {chainBases.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => setSelectedChain(chain)}
                    className={`p-4 border rounded-lg aspect-square flex items-center justify-center transition-all ${
                      selectedChain?.id === chain.id 
                        ? 'border-sage-500 bg-sage-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img 
                      src={chain.image} 
                      alt={chain.name}
                      className="w-16 h-16 object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <h3 className="font-medium text-sm text-gray-600 mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleQuantityChange(false)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-medium min-w-[2rem] text-center">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(true)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 border-sage-300 text-sage-700 hover:bg-sage-50"
              onClick={handleNextTab}
              disabled={charmTabs.indexOf(activeTab) === charmTabs.length - 1}
            >
              NEXT TAB
            </Button>
            <Button className="flex-1 bg-sage-500 hover:bg-sage-600">
              ADD TO CART
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BagCharmCustomizer;
