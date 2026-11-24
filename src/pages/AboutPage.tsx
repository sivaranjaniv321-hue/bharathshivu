import React from 'react';
import { HERO_IMAGE } from '../data/menu';
import { PageRoute } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const pillars = [
    {
      number: '01',
      title: 'Traditional Tamil Nadu Recipes',
      description:
        'From soft morning idlis and crisp ghee roast dosas to Karaikudi Chicken Chettinad and Madurai Mutton Chukka, our kitchen honors regional heritage.',
    },
    {
      number: '02',
      title: 'Fresh Farm Ingredients',
      description:
        'We prepare chutneys, sambar powders, and biryani masalas in-house each day using fresh coconuts, curry leaves, shallots, and aged seeraga samba rice.',
    },
    {
      number: '03',
      title: 'Uncompromising Quality & Taste',
      description:
        'Every dish is cooked in small batches without artificial colors or shortcuts, preserving natural aroma, balanced spice, and homely warmth.',
    },
    {
      number: '04',
      title: 'Clean Hygiene & Thoughtful Packaging',
      description:
        'Meals are packed cleanly to preserve crispness for snacks and warmth for curries and biryanis right to your doorstep.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
      {/* Intro Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B1826]">
            About Bharath Delights
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-bold text-[#2B1810] leading-tight">
            Rooted in Tamil Nadu Hospitality
          </h1>
          <p className="mt-4 text-base text-[#4A3B32] leading-relaxed">
            In Tamil culture, food is more than a meal — it is an expression of warmth, care, and celebration. At <strong className="text-[#6B1826]">Bharath Delights</strong>, we bring the comforting taste of home-style Tamil kitchens and classic festive banana leaf feasts directly to your table.
          </p>
          <p className="mt-4 text-base text-[#4A3B32] leading-relaxed">
            Whether you are craving a morning filter coffee with crispy medu vada, a wholesome vegetarian South Indian thali, or slow-cooked Sunday biryani, our chefs craft every plate with patience and pride.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="px-6 py-3 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Explore Our Menu
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-5 py-3 rounded-lg border border-[#D8CCBC] bg-white hover:bg-[#F2EAE0] text-[#2B1810] text-sm font-semibold transition-colors cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-2xl overflow-hidden border border-[#E5DDD0] bg-[#F2EAE0]">
            <img
              src={HERO_IMAGE}
              alt="Traditional Tamil Nadu banana leaf feast served at Bharath Delights"
              referrerPolicy="no-referrer"
              className="w-full aspect-video object-cover"
            />
          </div>
        </div>
      </div>

      {/* Philosophy & Why Choose Us */}
      <div className="pt-10 border-t border-[#E5DDD0]">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B1826]">
            Our Food Philosophy
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold text-[#2B1810]">
            Why Guests Choose Bharath Delights
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="bg-white border border-[#E5DDD0] rounded-xl p-6"
            >
              <span className="text-xs font-bold text-[#D4A017] tabular-nums">
                {pillar.number}.
              </span>
              <h3 className="mt-1 font-display text-xl font-semibold text-[#2B1810]">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm text-[#5C4B41] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
