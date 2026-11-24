import React from 'react';
import { Search, X } from 'lucide-react';
import { FILTER_CATEGORIES, MENU_ITEMS } from '../data/menu';
import { FilterCategory, MenuItem } from '../types';
import { FoodCard } from '../components/FoodCard';

interface MenuPageProps {
  selectedCategory: FilterCategory;
  searchQuery: string;
  getCartQty: (id: string) => number;
  onSelectCategory: (cat: FilterCategory) => void;
  onSearchChange: (q: string) => void;
  onSelectFood: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  selectedCategory,
  searchQuery,
  getCartQty,
  onSelectCategory,
  onSearchChange,
  onSelectFood,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Vegetarian'
        ? item.isVeg
        : selectedCategory === 'Non-Vegetarian'
        ? !item.isVeg
        : item.category === selectedCategory;

    const matchesSearch =
      normalizedQuery === ''
        ? true
        : item.name.toLowerCase().includes(normalizedQuery) ||
          item.shortDescription.toLowerCase().includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery) ||
          item.menuGroup.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  const handleReset = () => {
    onSelectCategory('All');
    onSearchChange('');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5DDD0]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B1826]">
            Curated Tamil Nadu Kitchen
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#2B1810]">
            Our Restaurant Menu
          </h1>
          <p className="mt-2 text-sm text-[#5C4B41]">
            39 freshly prepared Tamil Nadu breakfast, meals, biryani, snacks, sweets, and beverages.
          </p>
        </div>

        {/* Working Search Input */}
        <div className="w-full md:w-96 relative">
          <label htmlFor="menu-search" className="sr-only">
            Search food by name
          </label>
          <Search
            className="w-4 h-4 text-[#7D6B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="menu-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search food by name (e.g. Idli, Biryani)..."
            className="w-full h-11 pl-10 pr-10 rounded-lg border border-[#D8CCBC] bg-white text-sm text-[#2B1810] placeholder:text-[#8A796D] focus:outline-none focus:border-[#6B1826]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md text-[#6B5A4E] hover:bg-[#F2EAE0] flex items-center justify-center cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="py-6 flex flex-wrap items-center gap-2" role="group" aria-label="Menu category filters">
        {FILTER_CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017] ${
                isActive
                  ? 'bg-[#6B1826] text-white font-semibold'
                  : 'bg-white border border-[#E5DDD0] text-[#4A3B32] hover:border-[#6B1826] hover:text-[#6B1826]'
              }`}
              aria-pressed={isActive}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Result Count */}
      <div className="mb-6 flex items-center justify-between text-xs text-[#6B5A4E]">
        <p className="tabular-nums">
          Showing <strong>{filteredItems.length}</strong>{' '}
          {filteredItems.length === 1 ? 'dish' : 'dishes'}
          {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
          {normalizedQuery ? ` matching "${searchQuery.trim()}"` : ''}
        </p>
        {(selectedCategory !== 'All' || normalizedQuery !== '') && (
          <button
            type="button"
            onClick={handleReset}
            className="font-semibold text-[#6B1826] hover:underline cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Menu Grid or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
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
      ) : (
        <div className="bg-white border border-[#E5DDD0] rounded-2xl p-12 text-center max-w-lg mx-auto my-8">
          <h2 className="font-display text-2xl font-bold text-[#2B1810]">
            No matching dishes found
          </h2>
          <p className="mt-2 text-sm text-[#5C4B41]">
            Try clearing your search keyword or switching to another category filter.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-6 px-5 py-2.5 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Show All Dishes
          </button>
        </div>
      )}
    </section>
  );
};
