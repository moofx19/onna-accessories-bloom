
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
  
  // Check if product has active Buy X Get Y promotion
  const hasActivePromotion = product.buyXGetY && product.buyXGetY.length > 0 && 
    product.buyXGetY.some(promo => new Date(promo.expiration) > new Date());
  
  const activePromotion = hasActivePromotion ? 
    product.buyXGetY?.find(promo => new Date(promo.expiration) > new Date()) : null;
  
  return (
    <div className="group relative">
      <div className="overflow-hidden rounded-md bg-gray-100 mb-4">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="h-72 w-full object-cover object-center product-card-image"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-sage-500 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                NEW
              </span>
            )}
            {product.isSale && (
              <span className="bg-rose-500 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                SALE
              </span>
            )}
            {activePromotion && (
              <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                Buy {activePromotion.X} Get {activePromotion.Y}
              </span>
            )}
          </div>
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
        {activePromotion && (
          <p className="text-sm text-green-600 mb-2">
            Buy {activePromotion.X} Get {activePromotion.Y} Free!
          </p>
        )}
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
