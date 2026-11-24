import React, { useState } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { PageRoute } from '../types';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentPage: PageRoute;
  cartCount: number;
  searchQuery: string;
  onNavigate: (page: PageRoute) => void;
  onSearchSubmit: (query: string) => void;
}

const NAV_LINKS: { id: PageRoute; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'about', label: 'About Us' },
  { id: 'my-orders', label: 'My Orders' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  cartCount,
  searchQuery,
  onNavigate,
  onSearchSubmit,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleLinkClick = (page: PageRoute) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(localQuery);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-sm border-b border-[#E5DDD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-[72px] flex items-center justify-between gap-6">
          {/* Zone 1: Brand Logo */}
          <BrandLogo variant="dark" onClick={() => handleLinkClick('home')} />

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017] ${
                    isActive
                      ? 'text-[#6B1826] border-[#6B1826] font-semibold'
                      : 'text-[#4A3B32] border-transparent hover:text-[#6B1826] hover:border-[#D4A017]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Search & Cart Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setLocalQuery(searchQuery);
                setSearchOpen((prev) => !prev);
              }}
              className="w-10 h-10 rounded-lg border border-[#E5DDD0] bg-white text-[#2B1810] hover:border-[#6B1826] hover:text-[#6B1826] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Search menu"
              aria-expanded={searchOpen}
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('cart')}
              className="inline-flex items-center gap-2 h-10 px-3.5 sm:px-4 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017]"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
              <span
                className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded bg-[#D4A017] text-[#2B1810] text-xs font-bold tabular-nums"
                data-testid="cart-badge"
              >
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden w-10 h-10 rounded-lg border border-[#E5DDD0] bg-white text-[#2B1810] flex items-center justify-center hover:border-[#6B1826] cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <form
            onSubmit={handleSearchFormSubmit}
            className="pb-3.5 pt-1 flex items-center gap-2 border-t border-[#F0E8DC]"
          >
            <input
              type="search"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search dishes (e.g., Masala Dosa, Chicken Biryani, Payasam)..."
              className="flex-1 h-10 px-3.5 rounded-lg border border-[#D8CCBC] bg-white text-sm text-[#2B1810] placeholder:text-[#8A796D] focus:outline-none focus:border-[#6B1826]"
              autoFocus
            />
            <button
              type="submit"
              className="h-10 px-4 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] text-white text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              Search Menu
            </button>
          </form>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          className="lg:hidden bg-[#FFFDF9] border-t border-[#E5DDD0] px-4 py-4 space-y-1.5"
          aria-label="Mobile Navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#6B1826] text-white font-semibold'
                    : 'text-[#2B1810] hover:bg-[#F2EAE0]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handleLinkClick('cart')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors cursor-pointer ${
              currentPage === 'cart'
                ? 'bg-[#6B1826] text-white font-semibold'
                : 'text-[#2B1810] hover:bg-[#F2EAE0]'
            }`}
          >
            <span>Cart</span>
            <span className="tabular-nums font-bold">{cartCount} items</span>
          </button>
        </nav>
      )}
    </header>
  );
};
