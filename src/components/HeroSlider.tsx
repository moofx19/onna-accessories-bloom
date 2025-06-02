
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSliders } from '../hooks/useApi';
import { transformApiSlider } from '../utils/dataTransform';

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { sliders, loading, error } = useSliders();
  
  // Transform API sliders to hero slides format
  const heroSlides = sliders.filter(slider => slider.is_active === '1').map(transformApiSlider);

  // Auto slide effect
  useEffect(() => {
    if (heroSlides.length === 0) return;
    
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentSlide, heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  if (loading) {
    return (
      <div className="relative w-full h-96 bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sage-500"></div>
      </div>
    );
  }

  if (error || heroSlides.length === 0) {
    return (
      <div className="relative w-full h-96 bg-sage-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">Welcome to Our Store</h1>
          <p className="text-lg text-sage-600 mb-6">Discover our beautiful jewelry collection</p>
          <Button 
            asChild
            className="bg-sage-600 text-white hover:bg-sage-700 px-8 py-6"
          >
            <Link to="/shop">Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ 
          width: `${heroSlides.length * 100}%`, 
          transform: `translateX(-${currentSlide * (100 / heroSlides.length)}%)` 
        }}
      >
        {heroSlides.map((slide) => (
          <div key={slide.id} className="hero-slide">
            <img src={slide.imageUrl} alt={slide.title} />
            <div className="hero-content">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">{slide.title}</h1>
              <p className="text-lg md:text-xl mb-6">{slide.subtitle}</p>
              <Button 
                asChild
                className="bg-white text-sage-600 hover:bg-sage-100 hover:text-sage-700 border-0 rounded-none px-8 py-6"
              >
                <Link to="/shop">{slide.ctaText}</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={prevSlide} 
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-sm p-2 rounded-full text-white z-10 hover:bg-white/60"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-sm p-2 rounded-full text-white z-10 hover:bg-white/60"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-6 rounded-full transition-all ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
