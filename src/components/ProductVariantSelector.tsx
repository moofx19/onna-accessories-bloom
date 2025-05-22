
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
} from '@/components/ui/carousel';

interface VariantOption {
  id: number;
  name: string;
  imageUrl: string;
  priceAdjustment: number;
}

interface ProductVariantSelectorProps {
  options: VariantOption[];
  selectedVariantId: number;
  onSelectVariant: (variantId: number) => void;
  title: string;
}

const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  options,
  selectedVariantId,
  onSelectVariant,
  title
}) => {
  return (
    <div className="my-6">
      <h3 className="text-sm font-medium uppercase tracking-wider text-gray-600 mb-3">
        {title}
      </h3>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {options.map((option) => (
            <CarouselItem key={option.id} className="pl-2 md:pl-4 basis-1/3 md:basis-1/5">
              <button
                className={`w-full h-full flex flex-col items-center ${
                  selectedVariantId === option.id
                    ? 'ring-2 ring-sage-500 ring-offset-2'
                    : 'ring-1 ring-gray-200 hover:ring-gray-300'
                } rounded-full p-1 transition-all`}
                onClick={() => onSelectVariant(option.id)}
                aria-label={`Select ${option.name} variant`}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img 
                    src={option.imageUrl} 
                    alt={option.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-sage-600 mt-2">
                  +${option.priceAdjustment.toFixed(2)}
                </span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ProductVariantSelector;
