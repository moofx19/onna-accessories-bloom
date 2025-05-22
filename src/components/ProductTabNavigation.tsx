
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

interface ProductTabNavigationProps {
  currentProductId: number;
}

const ProductTabNavigation: React.FC<ProductTabNavigationProps> = ({ currentProductId }) => {
  const productIds = products.map(product => product.id);
  const currentIndex = productIds.indexOf(currentProductId);
  
  const prevProductId = currentIndex > 0 ? productIds[currentIndex - 1] : null;
  const nextProductId = currentIndex < productIds.length - 1 ? productIds[currentIndex + 1] : null;
  
  return (
    <div className="flex justify-end mb-2">
      {prevProductId && (
        <Link to={`/product/${prevProductId}`} className="text-sm text-sage-600 hover:text-sage-800 flex items-center mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Prev</span>
        </Link>
      )}
      {nextProductId && (
        <Link to={`/product/${nextProductId}`} className="text-sm text-sage-600 hover:text-sage-800 flex items-center">
          <span>Next</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      )}
    </div>
  );
};

export default ProductTabNavigation;
