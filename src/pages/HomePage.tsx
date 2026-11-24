import React from 'react';
import { ArrowRight, Clock, MapPin, Phone, Star } from 'lucide-react';
import { HERO_IMAGE, MENU_ITEMS, RESTAURANT_CONFIG } from '../data/menu';
import { FilterCategory, MenuItem, PageRoute, Review } from '../types';
import { FoodCard } from '../components/FoodCard';
import { VegIndicator } from '../components/VegIndicator';

interface HomePageProps {
  reviews: Review[];
  getCartQty: (id: string) => number;
  onNavigate: (page: PageRoute) => void;
  onNavigateWithFilter: (filter: FilterCategory) => void;
  onSelectFood: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  reviews,
  getCartQty,
  onNavigate,
  onNavigateWithFilter,
  onSelectFood,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const popularItems = MENU_ITEMS.filter((item) => item.isPopular).slice(0, 4);
  const specialItems = MENU_ITEMS.filter((item) => item.isTodaysSpecial).slice(0, 4);
  const vegHighlights = MENU_ITEMS.filter((item) => item.isVeg).slice(0, 3);
  const nonVegHighlights = MENU_ITEMS.filter((item) => !item.isVeg).slice(0, 3);
  const previewReviews = reviews.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#FFFDF9] border-b border-[#E5DDD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Hero Copy */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B1826]">
                Authentic Tamil Nadu Kitchen
              </p>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-[#2B1810] leading-[1.12]">
                Taste the Tradition of Tamil Nadu
              </h1>
              <p className="mt-4 text-base text-[#4A3B32] leading-relaxed max-w-xl">
                Welcome to <strong className="text-[#6B1826]">Bharath Delights</strong>. From crisp morning dosas and fragrant seeraga samba biryanis to festive banana leaf meals, every dish is prepared fresh with pure ghee, hand-roasted spices, and time-honored Tamil recipes.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('menu')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] text-white font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017]"
                >
                  <span>View Menu</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center px-5 py-3.5 rounded-lg border border-[#D8CCBC] bg-white hover:bg-[#F2EAE0] text-[#2B1810] font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Our Story
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-[#EFE7DB] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#5C4B41]">
                <span>Freshly Prepared Daily</span>
                <span aria-hidden="true">·</span>
                <span>Vegetarian &amp; Non-Vegetarian</span>
                <span aria-hidden="true">·</span>
                <span>Est. Delivery {RESTAURANT_CONFIG.estimatedDeliveryTime}</span>
              </div>
            </div>

            {/* Hero 16:9 Traditional Dining Image */}
            <div className="lg:col-span-7">
              <div className="h-full min-h-[260px] sm:min-h-[360px] rounded-2xl overflow-hidden border border-[#E5DDD0] bg-[#F2EAE0] shadow-sm">
                <img
                  src={HERO_IMAGE}
                  alt="Traditional Tamil Nadu banana leaf feast at Bharath Delights"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Food Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B1826]">
              Guest Favorites
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-[#2B1810]">
              Popular Dishes
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B1826] hover:text-[#4F101B] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              cartQuantity={getCartQty(item.id)}
              onSelect={onSelectFood}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      </section>

      {/* Today's Special Dishes */}
      <section className="bg-[#F2EAE0] border-y border-[#E5DDD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B1826]">
                Chef&apos;s Selection
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold text-[#2B1810]">
                Today&apos;s Special Dishes
              </h2>
            </div>
            <p className="text-sm text-[#5C4B41]">
              Crafted fresh each morning and afternoon in small batches.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                cartQuantity={getCartQty(item.id)}
                onSelect={onSelectFood}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Vegetarian & Non-Vegetarian Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {/* Vegetarian Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <VegIndicator isVeg={true} />
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2B1810]">
                Vegetarian Delights
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateWithFilter('Vegetarian')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B1826] hover:text-[#4F101B] cursor-pointer self-start sm:self-auto"
            >
              <span>Browse All Vegetarian</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vegHighlights.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                cartQuantity={getCartQty(item.id)}
                onSelect={onSelectFood}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        </div>

        <hr className="border-[#E5DDD0]" />

        {/* Non-Vegetarian Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <VegIndicator isVeg={false} />
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2B1810]">
                Non-Vegetarian Specialties
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateWithFilter('Non-Vegetarian')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B1826] hover:text-[#4F101B] cursor-pointer self-start sm:self-auto"
            >
              <span>Browse All Non-Vegetarian</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nonVegHighlights.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                cartQuantity={getCartQty(item.id)}
                onSelect={onSelectFood}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Preview */}
      <section className="bg-[#FFFDF9] border-t border-[#E5DDD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B1826]">
                Guest Feedback
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold text-[#2B1810]">
                Customer Reviews
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('reviews')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B1826] hover:text-[#4F101B] cursor-pointer self-start sm:self-auto"
            >
              <span>Read &amp; Write Reviews</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewReviews.map((review) => (
              <article
                key={review.id}
                className="bg-white border border-[#E5DDD0] rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-[#D4A017] text-[#D4A017]'
                              : 'text-[#D8CCBC]'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[#6B5A4E]">{review.date}</span>
                  </div>
                  <p className="text-sm text-[#3F3128] leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
                <p className="mt-4 pt-3 border-t border-[#F0E8DC] text-sm font-semibold text-[#2B1810]">
                  {review.customerName}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information Band */}
      <section className="bg-[#6B1826] text-[#FAF6EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Visit or Order from Bharath Delights
              </h2>
              <p className="mt-2 text-sm text-[#F3D98B] leading-relaxed">
                Questions about bulk catering, spice preferences, or delivery? Reach out to our kitchen team.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4A017] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-white">Address</p>
                  <p className="mt-1 text-xs text-[#EFE7DB] leading-relaxed">
                    {RESTAURANT_CONFIG.addressPlaceholder}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D4A017] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-white">Phone &amp; WhatsApp</p>
                  <p className="mt-1 text-xs text-[#EFE7DB]">
                    {RESTAURANT_CONFIG.phoneDisplayPlaceholder}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4A017] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-white">Daily Hours</p>
                  <p className="mt-1 text-xs text-[#EFE7DB]">7:00 AM – 10:30 PM</p>
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="mt-2 text-xs font-semibold text-[#F3D98B] underline hover:text-white cursor-pointer"
                  >
                    Contact Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
