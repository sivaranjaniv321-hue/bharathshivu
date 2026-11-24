import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { CartItem, FilterCategory, MenuItem, Order, PageRoute, Review } from './types';
import {
  addCustomerReview,
  getLastSubmittedOrder,
  loadCart,
  loadOrders,
  loadReviews,
  saveCart,
  saveOrder,
  updateOrder,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FoodModal } from './components/FoodModal';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { AboutPage } from './pages/AboutPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ContactPage } from './pages/ContactPage';

const VALID_ROUTES: PageRoute[] = [
  'home',
  'menu',
  'about',
  'cart',
  'checkout',
  'order-success',
  'my-orders',
  'reviews',
  'contact',
];

function getRouteFromHash(): PageRoute {
  const raw = window.location.hash.replace(/^#\/?/, '') as PageRoute;
  return VALID_ROUTES.includes(raw) ? raw : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>(() => getRouteFromHash());
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());
  const [lastOrder, setLastOrder] = useState<Order | null>(() => getLastSubmittedOrder());
  const [reviews, setReviews] = useState<Review[]>(() => loadReviews());

  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync URL hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getRouteFromHash());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Persist cart changes to localStorage
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const navigateTo = (page: PageRoute) => {
    const targetHash = page === 'home' ? '#/' : `#/${page}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const getCartQty = (id: string): number => {
    const found = cart.find((c) => c.item.id === id);
    return found ? found.quantity : 0;
  };

  const handleAddToCart = (item: MenuItem, quantityToAdd = 1) => {
    setCart((prev) => {
      const index = prev.findIndex((c) => c.item.id === item.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          quantity: updated[index].quantity + quantityToAdd,
        };
        return updated;
      }
      return [...prev, { item, quantity: quantityToAdd }];
    });
    showToast(`Added ${quantityToAdd} × ${item.name} to cart`);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.item.id === itemId
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((entry) => entry.item.id !== itemId));
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    navigateTo('menu');
  };

  const handleNavigateWithFilter = (filter: FilterCategory) => {
    setSelectedCategory(filter);
    setSearchQuery('');
    navigateTo('menu');
  };

  const handlePlaceOrder = (order: Order) => {
    saveOrder(order);
    setOrders(loadOrders());
    setLastOrder(order);
    setCart([]);
    navigateTo('order-success');
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    updateOrder(updatedOrder);
    setOrders(loadOrders());
    setLastOrder(updatedOrder);
  };

  const handleAddReview = (name: string, rating: number, text: string) => {
    const updated = addCustomerReview(name, rating, text);
    setReviews(updated);
  };

  const totalCartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EF] text-[#2B1810]">
      <Navbar
        currentPage={currentPage}
        cartCount={totalCartCount}
        searchQuery={searchQuery}
        onNavigate={navigateTo}
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            reviews={reviews}
            getCartQty={getCartQty}
            onNavigate={navigateTo}
            onNavigateWithFilter={handleNavigateWithFilter}
            onSelectFood={setModalItem}
            onAddToCart={(item) => handleAddToCart(item, 1)}
            onUpdateQuantity={handleUpdateQuantity}
          />
        )}

        {currentPage === 'menu' && (
          <MenuPage
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            getCartQty={getCartQty}
            onSelectCategory={setSelectedCategory}
            onSearchChange={setSearchQuery}
            onSelectFood={setModalItem}
            onAddToCart={(item) => handleAddToCart(item, 1)}
            onUpdateQuantity={handleUpdateQuantity}
          />
        )}

        {currentPage === 'about' && <AboutPage onNavigate={navigateTo} />}

        {currentPage === 'cart' && (
          <CartPage
            cart={cart}
            onNavigate={navigateTo}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            cart={cart}
            onNavigate={navigateTo}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {currentPage === 'order-success' && (
          <OrderSuccessPage
            order={lastOrder}
            onNavigate={navigateTo}
            onUpdateOrder={handleUpdateOrder}
          />
        )}

        {currentPage === 'my-orders' && (
          <MyOrdersPage orders={orders} onNavigate={navigateTo} />
        )}

        {currentPage === 'reviews' && (
          <ReviewsPage reviews={reviews} onAddReview={handleAddReview} />
        )}

        {currentPage === 'contact' && <ContactPage />}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Food Details Popup */}
      <FoodModal
        item={modalItem}
        onClose={() => setModalItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#2B1810] text-white text-sm shadow-lg border border-[#4A2E22]"
        >
          <Check className="w-4 h-4 text-[#D4A017] shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => navigateTo('cart')}
            className="ml-2 text-xs font-semibold text-[#F3D98B] hover:underline whitespace-nowrap cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
}
