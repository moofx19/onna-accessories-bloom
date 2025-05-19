
import React, { useState, useEffect } from 'react';
import { heroSlides } from '../data/products';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

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
