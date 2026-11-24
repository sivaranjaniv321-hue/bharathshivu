import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../data/menu';
import {
  CartItem,
  CustomerDetails,
  Order,
  PageRoute,
  PaymentMethod,
} from '../types';
import { FoodImage } from '../components/FoodImage';
import {
  sendOrderConfirmationViaBackend,
  validateWhatsAppWithCountryCode,
  WHATSAPP_COUNTRY_CODES,
} from '../utils/whatsapp';

interface CheckoutPageProps {
  cart: CartItem[];
  onNavigate: (page: PageRoute) => void;
  onPlaceOrder: (order: Order) => void;
}

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; description: string }[] = [
  {
    id: 'Cash on Delivery',
    label: 'Cash on Delivery',
    description: 'Pay in cash when your order arrives at your doorstep.',
  },
  {
    id: 'GPay',
    label: 'GPay (Demo)',
    description: 'Demonstration option only — no live gateway or UPI PIN requested.',
  },
  {
    id: 'PhonePe',
    label: 'PhonePe (Demo)',
    description: 'Demonstration option only — no live gateway or UPI PIN requested.',
  },
  {
    id: 'Paytm',
    label: 'Paytm (Demo)',
    description: 'Demonstration option only — no live gateway or UPI PIN requested.',
  },
  {
    id: 'UPI',
    label: 'UPI (Demo)',
    description: 'Demonstration option only — verify payment on delivery or restaurant confirmation.',
  },
];

const INITIAL_CUSTOMER: CustomerDetails = {
  fullName: '',
  mobileNumber: '',
  whatsappNumber: '',
  houseNumber: '',
  streetName: '',
  area: '',
  city: '',
  district: '',
  pinCode: '',
  deliveryInstructions: '',
};

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  onNavigate,
  onPlaceOrder,
}) => {
  const [customer, setCustomer] = useState<CustomerDetails>(INITIAL_CUSTOMER);
  const [whatsappCountryCode, setWhatsappCountryCode] = useState('+91');
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const deliveryCharge =
    cart.length === 0 || subtotal >= RESTAURANT_CONFIG.freeDeliveryThreshold
      ? 0
      : RESTAURANT_CONFIG.deliveryCharge;
  const grandTotal = subtotal + deliveryCharge;

  if (cart.length === 0) {
    return (
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white border border-[#E5DDD0] rounded-2xl p-10">
          <h1 className="font-display text-3xl font-bold text-[#2B1810]">
            Your Cart is Empty
          </h1>
          <p className="mt-2 text-sm text-[#5C4B41]">
            Please add at least one dish from our menu before proceeding to checkout.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="mt-6 px-6 py-3 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] text-white text-sm font-semibold cursor-pointer"
          >
            Browse Menu
          </button>
        </div>
      </section>
    );
  }

  const updateField = (field: keyof CustomerDetails, value: string) => {
    setCustomer((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'mobileNumber' && sameAsMobile) {
        next.whatsappNumber = value;
      }
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSameAsMobileToggle = (checked: boolean) => {
    setSameAsMobile(checked);
    if (checked) {
      setCustomer((prev) => ({ ...prev, whatsappNumber: prev.mobileNumber }));
      setErrors((prev) => ({ ...prev, whatsappNumber: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerDetails, string>> = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const pinRegex = /^\d{6}$/;

    if (!customer.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }
    const cleanMobile = customer.mobileNumber.replace(/\D/g, '');
    if (!phoneRegex.test(cleanMobile)) {
      newErrors.mobileNumber = 'Enter a valid 10-digit mobile number.';
    }
    const whatsappCheck = validateWhatsAppWithCountryCode(
      whatsappCountryCode,
      customer.whatsappNumber
    );
    if (!whatsappCheck.valid) {
      newErrors.whatsappNumber = whatsappCheck.error;
    }
    if (!customer.houseNumber.trim()) {
      newErrors.houseNumber = 'House / Flat Number is required.';
    }
    if (!customer.streetName.trim()) {
      newErrors.streetName = 'Street Name is required.';
    }
    if (!customer.area.trim()) {
      newErrors.area = 'Area / Locality is required.';
    }
    if (!customer.city.trim()) {
      newErrors.city = 'City is required.';
    }
    if (!customer.district.trim()) {
      newErrors.district = 'District is required.';
    }
    if (!pinRegex.test(customer.pinCode.trim())) {
      newErrors.pinCode = 'Enter a valid 6-digit PIN Code.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validate()) return;

    const whatsappCheck = validateWhatsAppWithCountryCode(
      whatsappCountryCode,
      customer.whatsappNumber
    );
    if (!whatsappCheck.valid) return;

    setIsSubmitting(true);
    try {
      const orderNum = `BD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const isCod = paymentMethod === 'Cash on Delivery';

      const newOrder: Order = {
        orderNumber: orderNum,
        createdAt: new Date().toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        customer: {
          ...customer,
          fullName: customer.fullName.trim(),
          mobileNumber: customer.mobileNumber.replace(/\D/g, ''),
          whatsappNumber: whatsappCheck.e164,
          houseNumber: customer.houseNumber.trim(),
          streetName: customer.streetName.trim(),
          area: customer.area.trim(),
          city: customer.city.trim(),
          district: customer.district.trim(),
          pinCode: customer.pinCode.trim(),
          deliveryInstructions: customer.deliveryInstructions.trim(),
        },
        items: cart.map(({ item, quantity }) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity,
          image: item.image,
          isVeg: item.isVeg,
        })),
        subtotal,
        deliveryCharge,
        totalAmount: grandTotal,
        paymentMethod,
        paymentNote: isCod
          ? 'Cash on Delivery — Pay upon delivery'
          : `${paymentMethod} (Demonstration Mode — Payment not processed online; settle via verified UPI/Cash on delivery)`,
        status: 'Order Received',
        estimatedDeliveryTime: RESTAURANT_CONFIG.estimatedDeliveryTime,
      };

      const whatsappDelivery = await sendOrderConfirmationViaBackend(newOrder);
      onPlaceOrder({
        ...newOrder,
        whatsappDelivery,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDemoOnlinePayment = paymentMethod !== 'Cash on Delivery';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="pb-6 border-b border-[#E5DDD0]">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B1826]">
          Delivery &amp; Payment
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#2B1810]">
          Checkout
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer Details & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Information */}
          <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold text-[#2B1810] mb-5">
              1. Customer &amp; Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-[#2B1810] mb-1">
                  Full Name <span className="text-[#8C1D2D]">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={customer.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#D8CCBC] bg-white text-sm focus:outline-none focus:border-[#6B1826]"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-[#8C1D2D] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-[#2B1810] mb-1">
                  Mobile Number <span className="text-[#8C1D2D]">*</span>
                </label>
                <input
                  id="mobileNumber"
                  type="tel"
                  maxLength={10}
                  value={customer.mobileNumber}
                  onChange={(e) => updateField('mobileNumber', e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#D8CCBC] bg-white text-sm tabular-nums focus:outline-none focus:border-[#6B1826]"
                />
                {errors.mobileNumber && (
                  <p className="mt-1 text-xs text-[#8C1D2D] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {errors.mobileNumber}
                  </p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="whatsappNumber" className="block text-sm font-medium text-[#2B1810]">
                    WhatsApp Number <span className="text-[#8C1D2D]">*</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-[#5C4B41] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsMobile}
                      onChange={(e) => handleSameAsMobileToggle(e.target.checked)}
                      className="accent-[#6B1826]"
                    />
                    <span>Same as mobile</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="whatsappCountryCode" className="sr-only">
                    Country Code
                  </label>
                  <select
                    id="whatsappCountryCode"
                    value={whatsappCountryCode}
                    onChange={(e) => {
                      setWhatsappCountryCode(e.target.value);
                      if (errors.whatsappNumber) {
                        setErrors((prev) => ({ ...prev, whatsappNumber: undefined }));
                      }
                    }}
                    className="h-11 px-2.5 rounded-lg border border-[#D8CCBC] bg-[#FAF6EF] text-sm font-medium text-[#2B1810] tabular-nums focus:outline-none focus:border-[#6B1826] shrink-0"
                  >
                    {WHATSAPP_COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="whatsappNumber"
                    type="tel"
                    maxLength={16}
                    value={customer.whatsappNumber}
                    onChange={(e) => updateField('whatsappNumber', e.target.value)}
                    placeholder="e.g., 9876543210"
                    className="w-full h-11 px-3.5 rounded-lg border border-[#D8CCBC] bg-white text-sm tabular-nums focus:outline-none focus:border-[#6B1826]"
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#6B5A4E]">
                  Your order confirmation will be sent to this WhatsApp number (with country code).
                </p>
                {errors.whatsappNumber && (
                  <p className="mt-1 text-xs text-[#8C1D2D] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {errors.whatsappNumber}
                  </p>
                )}
              </div>

              {/* House Number */}
              <div>
                <label htmlFor="houseNumber" className="block text-sm font-medium text-[#2B1810] mb-1">
                  House / Flat Number <span className="text-[#8C1D2D]">*</span>
                </label>
                <input
                  id="houseNumber"
                  type="text"
                  value={customer.houseNumber}
                  onChange={(e) => updateField('houseNumber', e.target.value)}
                  placeholder="e.g., No. 12 / Flat 2B"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#D8CCBC] bg-white text-sm focus:outline-none focus:border-[#6B1826]"
                />
                {errors.houseNumber && (
                  <p className="mt-1 text-xs text-[#8C1D2D]">{errors.houseNumber}</p>
                )}
              </div>

              {/* Street Name */}
              <div>
                <label htmlFor="streetName" className="block text-sm font-medium text-[#2B1810] mb-1">
                  Street Name <span className="text-[#8C1D2D]">*</span>
                </label>
                <input
                  id="streetName"
                  type="text"
                  value={customer.streetName}
                  onChange={(e) => updateField('streetName', e.target.value)}
                  placeholder="e.g., South Masi Street"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#D8CCBC] bg-white text-sm focus:outline-none focus:border-[#6B1826]"
                />
                {errors.streetName && (
                  <p className="mt-1 text-xs text-[#8C1D2D]">{errors.streetName}</p>
                )}
              </div>

              {/* Area */}
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-[#2B1810] mb-1">
                  Area / Locality <span className="text-[#8C1D2D]">*</span>
                </label>
                <input
                  id="area"
                  type="text"
                  value={customer.area}
                  onChange={(e) => updateField('area', e.target.value)}
                  placeholder="e.g., Anna Nagar"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#D8CCBC] bg-white text-sm focus:outline-none focus:border-[#6B1826]"
                />
                {errors.area && <p className="mt-1 text-xs text-[#8C1D2D]">{errors.area}</p>}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-[#2B1810] mb-1">
                  City <span className="text-[#8C1D2D]">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  value={customer.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="e.g., Madurai"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#D8CCBC] bg-white text-sm focus:outline-none focus:border-[#6B1826]"
                />
                {errors.city && <p className="mt-1 text-xs text-[#8C1D2D]">{errors.city}</p>}
              </div>

              {/* District */}
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-[#2B1810] mb-1">
                  District <span className="text-[#8C1D2D]">*</span>
                </label>
                <input
                  id="district"
                  type="text"
                  value={customer.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  placeholder="e.g., Madurai"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#D8CCBC] bg-white text-sm focus:outline-none focus:border-[#6B1826]"
                />
                {errors.district && (
                  <p className="mt-1 text-xs text-[#8C1D2D]">{errors.district}</p>
                )}
              </div>

              {/* PIN Code */}
              <div>
                <label htmlFor="pinCode" className="block text-sm font-medium text-[#2B1810] mb-1">
                  PIN Code <span className="text-[#8C1D2D]">*</span>
                </label>
                <input
                  id="pinCode"
                  type="text"
                  maxLength={6}
                  value={customer.pinCode}
                  onChange={(e) => updateField('pinCode', e.target.value)}
                  placeholder="6-digit PIN Code"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#D8CCBC] bg-white text-sm tabular-nums focus:outline-none focus:border-[#6B1826]"
                />
                {errors.pinCode && (
                  <p className="mt-1 text-xs text-[#8C1D2D]">{errors.pinCode}</p>
                )}
              </div>

              {/* Delivery Instructions */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="deliveryInstructions"
                  className="block text-sm font-medium text-[#2B1810] mb-1"
                >
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  id="deliveryInstructions"
                  rows={2}
                  value={customer.deliveryInstructions}
                  onChange={(e) => updateField('deliveryInstructions', e.target.value)}
                  placeholder="Landmark, gate instructions, or spice preferences..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8CCBC] bg-white text-sm focus:outline-none focus:border-[#6B1826]"
                />
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold text-[#2B1810] mb-2">
              2. Payment Method
            </h2>
            <p className="text-xs text-[#5C4B41] mb-4">
              Select one payment option. We never collect UPI PINs, passwords, or banking credentials.
            </p>

            <div className="space-y-3">
              {PAYMENT_OPTIONS.map((opt) => {
                const selected = paymentMethod === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      selected
                        ? 'border-[#6B1826] bg-[#FAF6EF]'
                        : 'border-[#E5DDD0] bg-white hover:border-[#CBBBA9]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.id}
                      checked={selected}
                      onChange={() => setPaymentMethod(opt.id)}
                      className="mt-1 accent-[#6B1826]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#2B1810]">{opt.label}</p>
                      <p className="text-xs text-[#5C4B41] mt-0.5">{opt.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {isDemoOnlinePayment && (
              <div className="mt-4 p-4 rounded-xl bg-[#FAF6EF] border border-[#D4A017] text-xs text-[#4A3B32] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#6B1826] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#2B1810]">
                    Demonstration Payment Notice
                  </p>
                  <p className="mt-1 leading-relaxed">
                    {paymentMethod} is displayed for demonstration purposes only. No live payment gateway is connected, and your order is not marked as paid online. You may confirm your order now and settle payment after restaurant verification or on delivery.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <aside className="lg:col-span-5 bg-white border border-[#E5DDD0] rounded-2xl p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold text-[#2B1810] pb-4 border-b border-[#EFE7DB]">
            Order Summary ({cart.reduce((s, c) => s + c.quantity, 0)} items)
          </h2>

          <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
            {cart.map(({ item, quantity }) => (
              <div
                key={item.id}
                className="flex items-center gap-3 pb-3 border-b border-[#F4EDE2] last:border-b-0"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[#E5DDD0]">
                  <FoodImage src={item.image} alt={item.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#2B1810] truncate">{item.name}</p>
                  <p className="text-xs text-[#6B5A4E] tabular-nums">
                    ₹{item.price} × {quantity}
                  </p>
                </div>
                <p className="text-sm font-bold text-[#2B1810] tabular-nums shrink-0">
                  ₹{item.price * quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#EFE7DB] space-y-2.5 text-sm">
            <div className="flex justify-between text-[#4A3B32]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#2B1810] tabular-nums">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-[#4A3B32]">
              <span>Delivery Charge</span>
              <span className="font-semibold text-[#2B1810] tabular-nums">
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="pt-2.5 border-t border-[#EFE7DB] flex justify-between items-center font-bold text-base text-[#2B1810]">
              <span>Total Amount</span>
              <span className="text-xl text-[#6B1826] tabular-nums">₹{grandTotal}</span>
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <p className="mt-4 text-xs text-[#8C1D2D] font-medium">
              Please fill in all required customer and address fields highlighted above.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full py-3.5 px-5 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>
              {isSubmitting ? 'Confirming Order...' : `Confirm Order · ₹${grandTotal}`}
            </span>
          </button>

          <p className="mt-3 text-xs text-[#6B5A4E] flex items-center justify-center gap-1.5 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E6B3A] shrink-0" aria-hidden="true" />
            <span>
              Order confirmation targets your own WhatsApp number ({whatsappCountryCode}).
            </span>
          </p>
        </aside>
      </form>
    </section>
  );
};
