import React from 'react';
import { Minus, Plus, Star } from 'lucide-react';
import { MenuItem } from '../types';
import { FoodImage } from './FoodImage';
import { VegIndicator } from './VegIndicator';

interface FoodCardProps {
  item: MenuItem;
  cartQuantity: number;
  onSelect: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  cartQuantity,
  onSelect,
  onAddToCart,
  onUpdateQuantity,
}) => {
  return (
    <article className="group flex flex-col bg-white border border-[#E5DDD0] rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* 1:1 Food Image */}
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="relative w-full overflow-hidden bg-[#F2EAE0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1826] cursor-pointer"
        aria-label={`View details for ${item.name}`}
      >
        <FoodImage
          src={item.image}
          alt={item.name}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </button>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Clean Unboxed Metadata Line */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <VegIndicator isVeg={item.isVeg} />
            <span className="text-xs font-medium text-[#6B5A4E] truncate">
              {item.category}
            </span>
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#2B1810] tabular-nums shrink-0">
            <Star className="w-3.5 h-3.5 fill-[#D4A017] text-[#D4A017]" aria-hidden="true" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Dish Title */}
        <button
          type="button"
          onClick={() => onSelect(item)}
          className="text-left focus-visible:outline-none focus-visible:underline cursor-pointer"
        >
          <h3 className="font-display text-lg font-semibold text-[#2B1810] group-hover:text-[#6B1826] transition-colors leading-snug">
            {item.name}
          </h3>
        </button>

        {/* Short Description */}
        <p className="mt-1.5 text-sm text-[#5C4B41] leading-relaxed line-clamp-2 flex-1">
          {item.shortDescription}
        </p>

        {/* Price & Action Footer */}
        <div className="mt-4 pt-3.5 border-t border-[#F0E8DC] flex items-center justify-between gap-3">
          <span className="text-base font-bold text-[#2B1810] tabular-nums">
            ₹{item.price}
          </span>

          {cartQuantity > 0 ? (
            <div className="inline-flex items-center border border-[#6B1826] rounded-lg overflow-hidden bg-[#FAF6EF]">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="w-9 h-9 flex items-center justify-center text-[#6B1826] hover:bg-[#6B1826] hover:text-white transition-colors cursor-pointer"
                aria-label={`Decrease ${item.name} quantity`}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-[#2B1810] tabular-nums">
                {cartQuantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="w-9 h-9 flex items-center justify-center text-[#6B1826] hover:bg-[#6B1826] hover:text-white transition-colors cursor-pointer"
                aria-label={`Increase ${item.name} quantity`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(item)}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#6B1826] hover:bg-[#4F101B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017]"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
