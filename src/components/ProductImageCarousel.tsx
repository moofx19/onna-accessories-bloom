
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImageCarouselProps {
  images: string[];
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ images }) => {
  return (
    <div className="w-full relative">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="md:basis-full">
              <div className="bg-gray-100 rounded-lg overflow-hidden p-2 flex items-center justify-center">
                <img 
                  src={image} 
                  alt={`Product image ${index + 1}`}
                  className="w-full h-auto object-contain max-h-[500px]"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-between w-full absolute top-1/2 -translate-y-1/2 px-2">
          <CarouselPrevious className="relative left-0 h-10 w-10 rounded-full bg-white/70 hover:bg-white border-0">
            <ArrowLeft className="h-5 w-5 text-sage-600" />
          </CarouselPrevious>
          <CarouselNext className="relative right-0 h-10 w-10 rounded-full bg-white/70 hover:bg-white border-0">
            <ArrowRight className="h-5 w-5 text-sage-600" />
          </CarouselNext>
        </div>
      </Carousel>
    </div>
  );
};

export default ProductImageCarousel;
