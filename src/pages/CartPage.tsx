import React from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../data/menu';
import { CartItem, PageRoute } from '../types';
import { FoodImage } from '../components/FoodImage';
import { VegIndicator } from '../components/VegIndicator';

interface CartPageProps {
  cart: CartItem[];
  onNavigate: (page: PageRoute) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  onNavigate,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const subtotal = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const deliveryCharge =
    cart.length === 0 || subtotal >= RESTAURANT_CONFIG.freeDeliveryThreshold
      ? 0
      : RESTAURANT_CONFIG.deliveryCharge;
  const grandTotal = subtotal + deliveryCharge;

  if (cart.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white border border-[#E5DDD0] rounded-2xl p-10 sm:p-14">
          <div className="w-14 h-14 rounded-full bg-[#F2EAE0] text-[#6B1826] flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[#2B1810]">
            Your Cart is Empty
          </h1>
          <p className="mt-2.5 text-sm text-[#5C4B41] max-w-md mx-auto">
            You have not added any dishes yet. Explore our fresh Tamil Nadu breakfast, meals, biryanis, snacks, and sweets to begin your order.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <span>View Menu</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="pb-6 border-b border-[#E5DDD0] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B1826]">
            Order Review
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#2B1810]">
            Your Cart
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('menu')}
          className="text-sm font-semibold text-[#6B1826] hover:underline self-start sm:self-auto cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(({ item, quantity }) => (
            <article
              key={item.id}
              className="bg-white border border-[#E5DDD0] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-[#E5DDD0] bg-[#F2EAE0]">
                <FoodImage src={item.image} alt={item.name} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <VegIndicator isVeg={item.isVeg} />
                  <h2 className="font-display text-lg font-semibold text-[#2B1810] truncate">
                    {item.name}
                  </h2>
                </div>
                <p className="mt-1 text-xs text-[#6B5A4E] tabular-nums">
                  ₹{item.price} per item · {item.category}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  {/* Quantity Steppers */}
                  <div className="inline-flex items-center border border-[#D8CCBC] rounded-lg bg-[#FAF6EF]">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-9 h-9 flex items-center justify-center text-[#2B1810] hover:bg-[#E7DDD0] rounded-l-lg transition-colors cursor-pointer"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold text-[#2B1810] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-9 h-9 flex items-center justify-center text-[#2B1810] hover:bg-[#E7DDD0] rounded-r-lg transition-colors cursor-pointer"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8C1D2D] hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Item Total */}
              <div className="sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F0E8DC] shrink-0">
                <p className="text-xs text-[#6B5A4E]">Item Total</p>
                <p className="text-lg font-bold text-[#2B1810] tabular-nums">
                  ₹{item.price * quantity}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Summary Card */}
        <aside className="lg:col-span-4 bg-white border border-[#E5DDD0] rounded-2xl p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold text-[#2B1810] pb-4 border-b border-[#EFE7DB]">
            Bill Summary
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between text-[#4A3B32]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#2B1810] tabular-nums">₹{subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-[#4A3B32]">
              <span>Delivery Charge</span>
              <span className="font-semibold text-[#2B1810] tabular-nums">
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            {subtotal < RESTAURANT_CONFIG.freeDeliveryThreshold && (
              <p className="text-xs text-[#6B5A4E] bg-[#FAF6EF] p-2.5 rounded-lg border border-[#EFE7DB]">
                Add ₹{RESTAURANT_CONFIG.freeDeliveryThreshold - subtotal} more for free delivery.
              </p>
            )}
            <div className="pt-3 border-t border-[#EFE7DB] flex items-center justify-between text-base font-bold text-[#2B1810]">
              <span>Grand Total</span>
              <span className="text-xl text-[#6B1826] tabular-nums">₹{grandTotal}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('checkout')}
              className="w-full py-3.5 px-5 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Proceed to Checkout
            </button>
            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="w-full py-3 px-5 rounded-lg border border-[#D8CCBC] bg-white hover:bg-[#FAF6EF] text-[#2B1810] text-sm font-semibold transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
};
