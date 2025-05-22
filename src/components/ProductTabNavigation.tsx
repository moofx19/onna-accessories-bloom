
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';

interface ProductTabNavigationProps {
  currentProductId: number;
}

const ProductTabNavigation: React.FC<ProductTabNavigationProps> = ({ currentProductId }) => {
  const navigate = useNavigate();
  const productIds = products.map(product => product.id);
  const currentIndex = productIds.indexOf(currentProductId);
  
  const prevProductId = currentIndex > 0 ? productIds[currentIndex - 1] : null;
  const nextProductId = currentIndex < productIds.length - 1 ? productIds[currentIndex + 1] : null;

  const goToNextProduct = () => {
    if (nextProductId) {
      navigate(`/product/${nextProductId}`);
    }
  };

  const goToPrevProduct = () => {
    if (prevProductId) {
      navigate(`/product/${prevProductId}`);
    }
  };
  
  return (
    <div className="flex justify-end mb-2">
      {prevProductId && (
        <button 
          onClick={goToPrevProduct}
          className="text-sm text-sage-600 hover:text-sage-800 flex items-center mr-4 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Prev</span>
        </button>
      )}
      {nextProductId && (
        <button 
          onClick={goToNextProduct}
          className="text-sm text-sage-600 hover:text-sage-800 flex items-center cursor-pointer"
        >
          <span>Next</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      )}
    </div>
  );
};

export default ProductTabNavigation;
