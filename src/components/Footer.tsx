import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../data/menu';
import { PageRoute } from '../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#2B1810] text-[#EFE7DB] border-t border-[#4A2E22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <BrandLogo variant="light" onClick={() => onNavigate('home')} />
            <p className="mt-4 text-sm text-[#D6C7B8] leading-relaxed">
              {RESTAURANT_CONFIG.tagline}. Serving authentic vegetarian and non-vegetarian Tamil Nadu dishes prepared with fresh stone-ground spices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-base font-semibold text-[#F3D98B] mb-3">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { id: 'home' as PageRoute, label: 'Home' },
                { id: 'menu' as PageRoute, label: 'Full Menu' },
                { id: 'about' as PageRoute, label: 'About Us' },
                { id: 'my-orders' as PageRoute, label: 'My Orders' },
                { id: 'reviews' as PageRoute, label: 'Customer Reviews' },
                { id: 'contact' as PageRoute, label: 'Contact Us' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.id)}
                    className="text-[#D6C7B8] hover:text-[#F3D98B] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-display text-base font-semibold text-[#F3D98B] mb-3">
              Opening Hours
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D6C7B8]">
              {RESTAURANT_CONFIG.openingHours.map((slot) => (
                <li key={slot.label} className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#D4A017] mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-[#FAF6EF]">{slot.label}</p>
                    <p className="text-xs text-[#C4B2A0] tabular-nums">{slot.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Placeholders */}
          <div>
            <h3 className="font-display text-base font-semibold text-[#F3D98B] mb-3">
              Contact Details
            </h3>
            <ul className="space-y-3 text-sm text-[#D6C7B8]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4A017] mt-0.5 shrink-0" aria-hidden="true" />
                <span>{RESTAURANT_CONFIG.addressPlaceholder}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#D4A017] mt-0.5 shrink-0" aria-hidden="true" />
                <span>{RESTAURANT_CONFIG.phoneDisplayPlaceholder}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#4A2E22] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C4B2A0]">
          <p>© {new Date().getFullYear()} Bharath Delights. All rights reserved.</p>
          <p>Free delivery on orders ₹{RESTAURANT_CONFIG.freeDeliveryThreshold} and above · Standard delivery ₹{RESTAURANT_CONFIG.deliveryCharge}</p>
        </div>
      </div>
    </footer>
  );
};
