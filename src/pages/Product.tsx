
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import BagCharmCustomizer from '../components/BagCharmCustomizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useProduct, useProducts } from '../hooks/useApi';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const { product, loading, error } = useProduct(Number(id));
  const { products } = useProducts();
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sage-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
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
          
          {/* Price */}
          <div className="flex items-center mb-4">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-medium text-rose-500">EGP {product.salePrice.toFixed(2)}</span>
                <span className="ml-3 text-lg text-gray-500 line-through">EGP {product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-2xl font-medium text-gray-900">EGP {product.price.toFixed(2)}</span>
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

        {/* Product Information Tabs */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="category">Category</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  This customizable charm necklace is crafted with premium materials and attention to detail. 
                  Each piece is designed to be both beautiful and durable, perfect for everyday wear or special occasions. 
                  The modular design allows you to express your personal style by selecting from our collection of 
                  meaningful charms and elegant chain bases.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Materials</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Sterling silver or 18k gold plated</li>
                      <li>• Hypoallergenic metals</li>
                      <li>• Premium crystal accents</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Care Instructions</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Store in provided jewelry box</li>
                      <li>• Clean with soft cloth</li>
                      <li>• Avoid water and chemicals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="category" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Category Information</h3>
                <div className="bg-sage-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Category:</span> 
                    <Link 
                      to={`/category/${product.category}`} 
                      className="text-sage-600 hover:text-sage-800 capitalize ml-2"
                    >
                      {product.category}
                    </Link>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Explore our complete collection of {product.category} featuring various styles, 
                    designs, and customization options to suit every preference and occasion.
                  </p>
                </div>
                {product.tags && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Shipping & Returns</h3>
                
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">🚚 Free Shipping</h4>
                  <p className="text-green-700 text-sm">
                    Free shipping on orders over EGP 500 within Egypt
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Shipping Information</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Standard delivery: 3-5 business days</li>
                      <li>• Express delivery: 1-2 business days</li>
                      <li>• Orders processed within 24 hours</li>
                      <li>• Tracking provided for all orders</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Returns & Exchanges</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• 30-day return policy</li>
                      <li>• Free returns on defective items</li>
                      <li>• Original packaging required</li>
                      <li>• Personalized items are final sale</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Handcrafted with love in Egypt</span> - 
                    Each piece is carefully made by skilled artisans using traditional techniques 
                    combined with modern design principles.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
