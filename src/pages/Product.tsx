
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import MainLayout from '../components/Layout/MainLayout';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
  
  // Get related products (same category, exclude current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Product image */}
          <div className="md:w-1/2">
            <div className="rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-auto object-center object-cover" 
              />
            </div>
          </div>
          
          {/* Product details */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-medium text-gray-900 mb-2">{product.name}</h1>
            
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
            <div className="text-gray-600 mb-6">
              <p>
                This elegant {product.name.toLowerCase()} is a timeless addition to your jewelry collection.
                Handcrafted with care, this piece can elevate any outfit from casual to formal.
                Its simple yet sophisticated design makes it perfect for everyday wear or special occasions.
              </p>
            </div>
            
            {/* Category */}
            <div className="mb-6">
              <span className="text-gray-700">Category: </span>
              <Link 
                to={`/category/${product.category}`} 
                className="text-sage-600 hover:text-sage-800 capitalize"
              >
                {product.category}
              </Link>
            </div>
            
            {/* Add to cart button */}
            <Button 
              onClick={() => addToCart(product)}
              className="bg-sage-500 hover:bg-sage-600 text-white w-full py-6 mb-4"
            >
              Add to Cart
            </Button>
            
            {/* Shipping info */}
            <div className="text-sm text-gray-600 border-t border-gray-200 pt-6 space-y-2">
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
