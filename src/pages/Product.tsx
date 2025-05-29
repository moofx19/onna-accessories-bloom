
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import MainLayout from '../components/Layout/MainLayout';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import BagCharmCustomizer from '../components/BagCharmCustomizer';
import { ShoppingCart } from 'lucide-react';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-medium text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/shop">Return to Shop</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Find next product ID
  const productIds = products.map(p => p.id);
  const currentIndex = productIds.indexOf(Number(id));
  const nextProductId = currentIndex < productIds.length - 1 ? productIds[currentIndex + 1] : null;

  // Get related products (same category, exclude current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const goToNextProduct = () => {
    if (nextProductId) {
      navigate(`/product/${nextProductId}`);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Product Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">{product.name}</h1>
          
          {/* Badges */}
          <div className="flex mb-4">
            {product.isNew && (
              <span className="bg-sage-500 text-white text-xs font-medium px-2.5 py-1 rounded-md inline-block mr-2">
                NEW
              </span>
            )}
            {product.isSale && (
              <span className="bg-rose-500 text-white text-xs font-medium px-2.5 py-1 rounded-md inline-block">
                SALE
              </span>
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-600 max-w-2xl">
            Create your perfect bag charm by selecting a base chain and choosing charms that reflect your personality. 
            Each combination tells your unique story with elegant craftsmanship and meaningful details.
          </p>
        </div>

        {/* Bag Charm Customizer */}
        <BagCharmCustomizer />
        
        {/* Action button */}
        <div className="flex gap-4 mt-12 max-w-md mx-auto lg:mx-0">
          <Button 
            onClick={handleAddToCart}
            className="flex-1 bg-sage-500 hover:bg-sage-600 text-white py-6"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            ADD TO CART - EGP {product.salePrice || product.price}
          </Button>
        </div>

        {/* Product Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 max-w-md mx-auto lg:mx-0">
          <span className="text-gray-700">Category: </span>
          <Link 
            to={`/category/${product.category}`} 
            className="text-sage-600 hover:text-sage-800 capitalize"
          >
            {product.category}
          </Link>
        </div>
        
        {/* Shipping info */}
        <div className="text-sm text-gray-600 border-t border-gray-200 pt-6 mt-6 space-y-2 max-w-md mx-auto lg:mx-0">
          <p>Free shipping on orders over EGP 500</p>
          <p>30-day return policy</p>
          <p>Handcrafted with love in Egypt</p>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-medium text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Product;
