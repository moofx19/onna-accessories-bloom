
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import MainLayout from '../components/Layout/MainLayout';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import ProductImageCarousel from '../components/ProductImageCarousel';
import ProductVariantSelector from '../components/ProductVariantSelector';
import QuantitySelector from '../components/QuantitySelector';
import ProductTabNavigation from '../components/ProductTabNavigation';
import { ShoppingCart } from 'lucide-react';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(1);
  
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

  // Mock data for product variants
  const chainVariants = [
    { id: 1, name: "Standard Chain", imageUrl: product.imageUrl, priceAdjustment: 0 },
    { id: 2, name: "Thin Chain", imageUrl: product.imageUrl, priceAdjustment: 10 },
    { id: 3, name: "Thick Chain", imageUrl: product.imageUrl, priceAdjustment: 20 },
    { id: 4, name: "Rope Chain", imageUrl: product.imageUrl, priceAdjustment: 15 },
    { id: 5, name: "Box Chain", imageUrl: product.imageUrl, priceAdjustment: 25 }
  ];

  // Create a mock array of product images for the carousel
  const productImages = [product.imageUrl];
  if (product.category === "necklaces" || product.category === "earrings") {
    // Add additional mock images for certain categories
    productImages.push(product.imageUrl);
  }
  
  // Get related products (same category, exclude current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Calculate price including variant adjustment
  const selectedVariantData = chainVariants.find(v => v.id === selectedVariant);
  const variantPriceAdjustment = selectedVariantData ? selectedVariantData.priceAdjustment : 0;
  const basePrice = product.salePrice || product.price;
  const totalPrice = (basePrice + variantPriceAdjustment) * quantity;
  
  const handleAddToCart = () => {
    const productWithVariant = {
      ...product,
      price: product.price + variantPriceAdjustment,
      salePrice: product.salePrice ? product.salePrice + variantPriceAdjustment : undefined,
      variant: selectedVariantData?.name
    };
    
    for (let i = 0; i < quantity; i++) {
      addToCart(productWithVariant);
    }
  };

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
    <MainLayout>
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Product Tab Navigation */}
        <ProductTabNavigation currentProductId={product.id} />
        
        <div className="flex flex-col md:flex-row md:gap-12">
          {/* Product image carousel */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="sticky top-24">
              <ProductImageCarousel images={productImages} />
            </div>
          </div>
          
          {/* Product details */}
          <div className="md:w-1/2">
            <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2">{product.name}</h1>
            
            {/* Price */}
            <div className="flex items-center mb-6">
              {product.salePrice ? (
                <>
                  <span className="font-medium text-2xl text-rose-500">${product.salePrice.toFixed(2)}</span>
                  <span className="ml-3 text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="font-medium text-2xl text-gray-900">${product.price.toFixed(2)}</span>
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
                Handcrafted with care, this piece can elevate any outfit from casual to formal.
                Its simple yet sophisticated design makes it perfect for everyday wear or special occasions.
              </p>
            </div>
            
            {/* Customization options */}
            <ProductVariantSelector
              options={chainVariants}
              selectedVariantId={selectedVariant}
              onSelectVariant={setSelectedVariant}
              title="SELECT THE CHAINS"
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
                <span className="font-medium text-lg text-gray-900">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-4 mt-8">
              <Button 
                variant="secondary"
                className="flex-1 py-6 text-sage-700"
                onClick={nextProductId ? goToNextProduct : undefined}
                disabled={!nextProductId}
              >
                NEXT TAB
              </Button>
              
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
              <p>Free shipping on orders over $50</p>
              <p>30-day return policy</p>
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
