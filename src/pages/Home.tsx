
import React from 'react';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { useProducts } from '../hooks/useApi';

const Home: React.FC = () => {
  const { products, loading, error } = useProducts();
  
  // Get featured products (products with sale or new status, limited to 6)
  const featuredProducts = products
    .filter(product => product.isSale || product.isNew || product.buyXGetY?.length > 0)
    .slice(0, 6);
  
  return (
    <MainLayout>
      {/* Hero Slider */}
      <section>
        <HeroSlider />
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-sage-800 mb-2">Featured Products</h2>
            <p className="text-sage-600 max-w-2xl mx-auto">
              Discover our collection of thoughtfully designed accessories that elevate any outfit
            </p>
          </div>
          
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sage-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading featured products...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500">Error loading products: {error}</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Button 
                  asChild
                  variant="outline" 
                  size="lg" 
                  className="border-sage-300 text-sage-700 hover:bg-sage-50"
                >
                  <Link to="/shop">View All Products</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">No featured products available at the moment.</p>
              <Button 
                asChild
                variant="outline" 
                className="border-sage-300 text-sage-700 hover:bg-sage-50 mt-4"
              >
                <Link to="/shop">Browse All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Categories Banner */}
      <section className="py-12 bg-sage-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-medium text-sage-800 mb-2">Shop by Category</h2>
            <p className="text-sage-600">Browse our collections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Necklaces */}
            <div className="relative h-80 overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Necklaces" 
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-medium text-white mb-4">Necklaces</h3>
                <Button 
                  asChild
                  variant="outline" 
                  className="bg-white text-sage-700 hover:bg-sage-50"
                >
                  <Link to="/category/necklaces">Shop Now</Link>
                </Button>
              </div>
            </div>
            
            {/* Earrings */}
            <div className="relative h-80 overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1574534884553-d5f5e0089263?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Earrings" 
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-medium text-white mb-4">Earrings</h3>
                <Button 
                  asChild
                  variant="outline" 
                  className="bg-white text-sage-700 hover:bg-sage-50"
                >
                  <Link to="/category/earrings">Shop Now</Link>
                </Button>
              </div>
            </div>
            
            {/* Bracelets */}
            <div className="relative h-80 overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1635767798638-3665c3f7c9ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Bracelets" 
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-medium text-white mb-4">Bracelets</h3>
                <Button 
                  asChild
                  variant="outline" 
                  className="bg-white text-sage-700 hover:bg-sage-50"
                >
                  <Link to="/category/bracelets">Shop Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Banner */}
      <section className="py-20 bg-sage-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-sage-800 mb-4">Join Our Community</h2>
            <p className="text-sage-600 mb-8">
              Sign up to receive early access to new collections, exclusive offers, and styling inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                required
              />
              <Button 
                type="submit"
                className="bg-sage-500 hover:bg-sage-600 text-white"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
