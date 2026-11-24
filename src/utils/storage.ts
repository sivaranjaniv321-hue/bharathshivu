import { CartItem, Order, Review } from '../types';

const CART_KEY = 'bharath_delights_cart_v1';
const ORDERS_KEY = 'bharath_delights_orders_v1';
const LAST_ORDER_KEY = 'bharath_delights_last_order_v1';
const REVIEWS_KEY = 'bharath_delights_reviews_v1';

// Sample reviews are explicitly marked with isSample: true so customers know they are sample demonstrations.
const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'sample-1',
    customerName: 'Ananya Sundaram',
    rating: 5,
    text: 'The Banana Leaf Meals and Ghee Dosa reminded me of traditional family feasts in Thanjavur. Crisp packaging and generous sambar.',
    date: 'Sample Review · Nov 2026',
    isSample: true,
  },
  {
    id: 'sample-2',
    customerName: 'Karthik Natarajan',
    rating: 5,
    text: 'Seeraga Samba Chicken Biryani and Chicken Chettinad have an authentic roasted spice aroma without being overly oily.',
    date: 'Sample Review · Nov 2026',
    isSample: true,
  },
  {
    id: 'sample-3',
    customerName: 'Meenakshi Balasubramanian',
    rating: 4,
    text: 'Fresh Filter Coffee, soft Idlis, and creamy Payasam arrived warm. Easy ordering flow and clear pricing.',
    date: 'Sample Review · Oct 2026',
    isSample: true,
  },
];

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  try {
    const existing = loadOrders();
    const updated = [order, ...existing];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    localStorage.setItem(LAST_ORDER_KEY, order.orderNumber);
  } catch {
    // Ignore storage quota errors
  }
}

export function updateOrder(updatedOrder: Order): void {
  try {
    const existing = loadOrders();
    const updated = existing.map((o) =>
      o.orderNumber === updatedOrder.orderNumber ? updatedOrder : o
    );
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
}

export function getLastSubmittedOrder(): Order | null {
  try {
    const lastId = localStorage.getItem(LAST_ORDER_KEY);
    if (!lastId) return null;
    const orders = loadOrders();
    return orders.find((o) => o.orderNumber === lastId) ?? null;
  } catch {
    return null;
  }
}

export function loadReviews(): Review[] {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (!raw) {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(SAMPLE_REVIEWS));
      return SAMPLE_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_REVIEWS;
  } catch {
    return SAMPLE_REVIEWS;
  }
}

export function addCustomerReview(customerName: string, rating: number, text: string): Review[] {
  const existing = loadReviews();
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const newReview: Review = {
    id: `review-${Date.now()}`,
    customerName: customerName.trim(),
    rating,
    text: text.trim(),
    date: today,
    isSample: false,
  };
  const updated = [newReview, ...existing];
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
  return updated;
}
