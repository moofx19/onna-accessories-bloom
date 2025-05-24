
import React from 'react';
import { Product } from '../types';
import { Button } from './ui/button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  return (
    <div className="group relative">
      <div className="overflow-hidden rounded-md bg-gray-100 mb-4">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="h-72 w-full object-cover object-center product-card-image"
          />
          {(product.isNew || product.isSale) && (
            <div className="absolute top-2 right-2">
              {product.isNew && (
                <span className="bg-sage-500 text-white text-xs font-medium px-2.5 py-1 rounded-md inline-block mr-1">
                  NEW
                </span>
              )}
              {product.isSale && (
                <span className="bg-rose-500 text-white text-xs font-medium px-2.5 py-1 rounded-md inline-block">
                  SALE
                </span>
              )}
            </div>
          )}
        </Link>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          <Link to={`/product/${product.id}`} className="hover:text-sage-500">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center mb-3">
          {product.salePrice ? (
            <>
              <span className="font-medium text-rose-500">EGP {product.salePrice.toFixed(2)}</span>
              <span className="ml-2 text-sm text-gray-500 line-through">EGP {product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-medium text-gray-900">EGP {product.price.toFixed(2)}</span>
          )}
        </div>
        <Button 
          onClick={() => addToCart(product)} 
          variant="outline" 
          className="w-full border-sage-300 text-sage-700 hover:bg-sage-50"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
