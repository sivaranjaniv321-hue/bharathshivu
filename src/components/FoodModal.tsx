import React, { useEffect, useState } from 'react';
import { Minus, Plus, Star, X } from 'lucide-react';
import { MenuItem } from '../types';
import { FoodImage } from './FoodImage';
import { VegIndicator } from './VegIndicator';

interface FoodModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export const FoodModal: React.FC<FoodModalProps> = ({ item, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [item?.id]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const handleConfirmAdd = () => {
    onAddToCart(item, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="food-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#E5DDD0] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/95 text-[#2B1810] border border-[#E5DDD0] flex items-center justify-center hover:bg-[#6B1826] hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017]"
          aria-label="Close food details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left 1:1 Image */}
        <div className="bg-[#F2EAE0] flex items-center justify-center">
          <FoodImage src={item.image} alt={item.name} className="h-full" />
        </div>

        {/* Right Details */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <VegIndicator isVeg={item.isVeg} showLabel />
              <span className="text-xs text-[#6B5A4E]" aria-hidden="true">
                ·
              </span>
              <span className="text-xs font-medium text-[#6B5A4E]">{item.category}</span>
            </div>

            <h2
              id="food-modal-title"
              className="font-display text-2xl font-bold text-[#2B1810] leading-tight"
            >
              {item.name}
            </h2>

            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 font-semibold text-[#2B1810] tabular-nums">
                <Star className="w-4 h-4 fill-[#D4A017] text-[#D4A017]" aria-hidden="true" />
                {item.rating.toFixed(1)}
              </span>
              <span className="text-[#9B8A7E]" aria-hidden="true">
                ·
              </span>
              <span className="text-[#5C4B41]">{item.menuGroup}</span>
            </div>

            <p className="mt-4 text-sm text-[#4A3B32] leading-relaxed">
              {item.fullDescription}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-[#EFE7DB]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-[#6B5A4E]">Price per serving</p>
                <p className="text-2xl font-bold text-[#6B1826] tabular-nums">
                  ₹{item.price * quantity}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="inline-flex items-center border border-[#D8CCBC] rounded-lg bg-[#FAF6EF]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#2B1810] hover:bg-[#E7DDD0] rounded-l-lg transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span
                  className="w-10 text-center text-base font-semibold text-[#2B1810] tabular-nums"
                  aria-live="polite"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#2B1810] hover:bg-[#E7DDD0] rounded-r-lg transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="flex-1 py-3 px-5 bg-[#6B1826] hover:bg-[#4F101B] text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Add to Cart · ₹{item.price * quantity}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 border border-[#D8CCBC] text-[#2B1810] hover:bg-[#FAF6EF] font-medium text-sm rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
