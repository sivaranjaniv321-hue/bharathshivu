export type FoodCategory =
  | 'Breakfast'
  | 'Meals'
  | 'Rice'
  | 'Biryani'
  | 'Snacks'
  | 'Sweets'
  | 'Beverages';

export type FilterCategory =
  | 'All'
  | 'Vegetarian'
  | 'Non-Vegetarian'
  | FoodCategory;

export type PageRoute =
  | 'home'
  | 'menu'
  | 'about'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'my-orders'
  | 'reviews'
  | 'contact';

export interface MenuItem {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: FoodCategory;
  menuGroup: string;
  rating: number;
  isVeg: boolean;
  image: string;
  isPopular?: boolean;
  isTodaysSpecial?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  houseNumber: string;
  streetName: string;
  area: string;
  city: string;
  district: string;
  pinCode: string;
  deliveryInstructions: string;
}

export type PaymentMethod =
  | 'Cash on Delivery'
  | 'GPay'
  | 'PhonePe'
  | 'Paytm'
  | 'UPI';

export interface OrderItemSnapshot {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isVeg: boolean;
}

export type WhatsAppDeliveryStatus = 'sent' | 'not_configured' | 'failed';

export interface WhatsAppDeliveryInfo {
  status: WhatsAppDeliveryStatus;
  recipientNumber: string;
  mode: 'cloud-api-text' | 'cloud-api-template' | 'click-to-chat-fallback';
  messageId?: string;
  error?: string;
  confirmedAt?: string;
}

export interface Order {
  orderNumber: string;
  createdAt: string;
  customer: CustomerDetails;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentNote: string;
  status: string;
  estimatedDeliveryTime: string;
  whatsappDelivery?: WhatsAppDeliveryInfo;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  date: string;
  isSample: boolean;
}
