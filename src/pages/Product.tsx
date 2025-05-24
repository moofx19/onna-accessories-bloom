
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import MainLayout from '../components/Layout/MainLayout';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import ProductImageCarousel from '../components/ProductImageCarousel';
import CharmSelector from '../components/CharmSelector';
import QuantitySelector from '../components/QuantitySelector';
import ProductTabNavigation from '../components/ProductTabNavigation';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedCharms, setSelectedCharms] = useState<number[]>([]);
  
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

  // Find next and previous product IDs
  const productIds = products.map(p => p.id);
  const currentIndex = productIds.indexOf(Number(id));
  const nextProductId = currentIndex < productIds.length - 1 ? productIds[currentIndex + 1] : null;
  const prevProductId = currentIndex > 0 ? productIds[currentIndex - 1] : null;

  // Get related products (same category, exclude current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Calculate total price including selected charms
  const basePrice = product.salePrice || product.price;
  const charmsPrice = selectedCharms.length * 50; // Each charm costs EGP 50
  const totalPrice = (basePrice + charmsPrice) * quantity;
  
  const handleAddToCart = () => {
    const productWithCharms = {
      ...product,
      price: product.price + charmsPrice,
      salePrice: product.salePrice ? product.salePrice + charmsPrice : undefined,
      charms: selectedCharms.length,
      charmsDetails: selectedCharms
    };
    
    for (let i = 0; i < quantity; i++) {
      addToCart(productWithCharms);
    }
  };

  const goToNextProduct = () => {
    if (nextProductId) {
      navigate(`/product/${nextProductId}`);
      setSelectedCharms([]); // Reset charms when changing products
    }
  };

  const goToPrevProduct = () => {
    if (prevProductId) {
      navigate(`/product/${prevProductId}`);
      setSelectedCharms([]); // Reset charms when changing products
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Product Tab Navigation */}
        <ProductTabNavigation currentProductId={product.id} />
        
        <div className="flex flex-col md:flex-row md:gap-12">
          {/* Product image carousel */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="sticky top-24">
              <ProductImageCarousel images={[product.imageUrl]} />
            </div>
          </div>
          
          {/* Product details */}
          <div className="md:w-1/2">
            <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2">{product.name}</h1>
            
            {/* Price */}
            <div className="flex items-center mb-6">
              {product.salePrice ? (
                <>
                  <span className="font-medium text-2xl text-rose-500">EGP {(product.salePrice + charmsPrice).toFixed(2)}</span>
                  <span className="ml-3 text-lg text-gray-500 line-through">EGP {(product.price + charmsPrice).toFixed(2)}</span>
                </>
              ) : (
                <span className="font-medium text-2xl text-gray-900">EGP {(product.price + charmsPrice).toFixed(2)}</span>
              )}
            </div>
            
            {/* Badges */}
            <div className="flex mb-6">
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
            <div className="text-gray-600 mb-8">
              <p>
                This elegant {product.name.toLowerCase()} is a timeless addition to your jewelry collection.
                Customize it with beautiful charms to make it uniquely yours. Each charm tells a story and adds
                personal meaning to your jewelry piece.
              </p>
            </div>
            
            {/* Charm Selector */}
            <CharmSelector
              selectedCharms={selectedCharms}
              onCharmsChange={setSelectedCharms}
              maxCharms={5}
            />
            
            {/* Quantity selector */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quantity</h3>
              <div className="flex items-center justify-between">
                <QuantitySelector
                  quantity={quantity}
                  onIncrease={() => setQuantity(prev => prev + 1)}
                  onDecrease={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
                />
                <span className="font-medium text-lg text-gray-900">EGP {totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-4 mt-8">
              {prevProductId ? (
                <Button 
                  variant="secondary"
                  className="flex-1 py-6 text-sage-700"
                  onClick={goToPrevProduct}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  PREV TAB
                </Button>
              ) : (
                <Button 
                  variant="secondary"
                  className="flex-1 py-6 text-sage-700"
                  disabled
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  PREV TAB
                </Button>
              )}
              
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-sage-500 hover:bg-sage-600 text-white py-6"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                ADD TO CART
              </Button>
            </div>
            
            {/* Category */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <span className="text-gray-700">Category: </span>
              <Link 
                to={`/category/${product.category}`} 
                className="text-sage-600 hover:text-sage-800 capitalize"
              >
                {product.category}
              </Link>
            </div>
            
            {/* Shipping info */}
            <div className="text-sm text-gray-600 border-t border-gray-200 pt-6 mt-6 space-y-2">
              <p>Free shipping on orders over EGP 500</p>
              <p>30-day return policy</p>
              <p>Handcrafted with love in Egypt</p>
            </div>
          </div>
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
