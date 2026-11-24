import React, { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface FoodImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const FoodImage: React.FC<FoodImageProps> = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F2EAE0] text-[#6B1826] aspect-square w-full ${className}`}
        role="img"
        aria-label={alt}
      >
        <UtensilsCrossed className="w-8 h-8 mb-2 opacity-70" />
        <span className="text-xs font-medium text-center px-3 text-[#2B1810]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`w-full aspect-square object-cover object-center bg-[#F2EAE0] ${className}`}
      loading="lazy"
    />
  );
};
