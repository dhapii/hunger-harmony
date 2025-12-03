import { useState } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductImage } from '@/types';

interface ImageCarouselProps {
  images: ProductImage[];
  className?: string;
}

export function ImageCarousel({ images, className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'relative aspect-[4/3] rounded-lg bg-muted flex items-center justify-center',
          className
        )}
      >
        <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <div className={cn('relative aspect-[4/3] rounded-lg overflow-hidden group', className)}>
      <img
        src={images[currentIndex]?.imageUrl}
        alt="Product"
        className="w-full h-full object-cover transition-transform duration-300"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  idx === currentIndex ? 'bg-accent' : 'bg-foreground/50'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
