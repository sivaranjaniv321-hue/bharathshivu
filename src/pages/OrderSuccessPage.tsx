import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Info, MessageCircle, RefreshCw } from 'lucide-react';
import { Order, PageRoute } from '../types';
import { FoodImage } from '../components/FoodImage';
import {
  buildCustomerWhatsAppUrl,
  formatDeliveryAddress,
  formatWhatsAppOrderMessage,
  sendOrderConfirmationViaBackend,
} from '../utils/whatsapp';

interface OrderSuccessPageProps {
  order: Order | null;
  onNavigate: (page: PageRoute) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  order,
  onNavigate,
  onUpdateOrder,
}) => {
  const [showMessagePreview, setShowMessagePreview] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Guard: Do not show the success page if an order has not been submitted
  if (!order) {
    return (
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white border border-[#E5DDD0] rounded-2xl p-10">
          <h1 className="font-display text-3xl font-bold text-[#2B1810]">
            No Order Submitted Yet
          </h1>
          <p className="mt-2.5 text-sm text-[#5C4B41]">
            Please add dishes to your cart and complete checkout to view an order confirmation.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="px-5 py-2.5 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] text-white text-sm font-semibold cursor-pointer"
            >
              Browse Menu
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 rounded-lg border border-[#D8CCBC] bg-white hover:bg-[#FAF6EF] text-[#2B1810] text-sm font-semibold cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  const address = formatDeliveryAddress(order.customer);
  const customerWhatsappUrl = buildCustomerWhatsAppUrl(order);
  const whatsappText = formatWhatsAppOrderMessage(order);
  const delivery = order.whatsappDelivery;
  const isConfirmedSent = delivery?.status === 'sent' && Boolean(delivery.messageId);
  const isFailed = delivery?.status === 'failed';

  const handleRetryCloudApi = async () => {
    if (isRetrying) return;
    setIsRetrying(true);
    try {
      const updatedDelivery = await sendOrderConfirmationViaBackend(order);
      onUpdateOrder({
        ...order,
        whatsappDelivery: updatedDelivery,
      });
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 sm:p-10">
        {/* Confirmation Header */}
        <div className="text-center pb-8 border-b border-[#EFE7DB]">
          <div className="w-14 h-14 rounded-full bg-[#E8F5EE] text-[#1E6B3A] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2B1810]">
            Thank you for ordering from Bharath Delights! Your order has been received.
          </h1>
          <p className="mt-2 text-sm text-[#5C4B41]">
            Order Number: <strong className="text-[#6B1826] tabular-nums">{order.orderNumber}</strong>
            {' · '}
            Status: <strong className="text-[#1E6B3A]">{order.status}</strong>
          </p>
        </div>

        {/* Customer WhatsApp Confirmation Status Block */}
        <div
          className={`my-6 p-5 rounded-xl border ${
            isConfirmedSent
              ? 'bg-[#E8F5EE] border-[#1E6B3A]'
              : isFailed
              ? 'bg-[#FDF3F4] border-[#8C1D2D]'
              : 'bg-[#FAF6EF] border-[#D4A017]'
          }`}
        >
          {isConfirmedSent ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#1E6B3A] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>WhatsApp Message Sent</span>
                </h2>
                <p className="mt-1 text-xs text-[#2B1810] leading-relaxed">
                  Confirmed by WhatsApp Business Platform Cloud API for{' '}
                  <strong className="tabular-nums">{delivery?.recipientNumber}</strong>.
                  Message ID: <span className="font-mono">{delivery?.messageId}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMessagePreview((v) => !v)}
                className="text-xs font-semibold text-[#1E6B3A] hover:underline self-start sm:self-center shrink-0 cursor-pointer"
              >
                {showMessagePreview ? 'Hide Message Preview' : 'View Sent Details'}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#2B1810] flex items-center gap-2">
                    {isFailed ? (
                      <AlertCircle className="w-5 h-5 text-[#8C1D2D] shrink-0" aria-hidden="true" />
                    ) : (
                      <Info className="w-5 h-5 text-[#6B1826] shrink-0" aria-hidden="true" />
                    )}
                    <span>
                      {isFailed
                        ? 'Automatic WhatsApp Delivery Failed'
                        : 'Manual WhatsApp Click-to-Chat Required'}
                    </span>
                  </h2>
                  <p className="mt-1 text-xs text-[#4A3B32] leading-relaxed">
                    {isFailed ? (
                      <>
                        Automatic delivery to{' '}
                        <strong className="tabular-nums">{order.customer.whatsappNumber}</strong>{' '}
                        was not confirmed by the WhatsApp service ({delivery?.error}). You can retry or open WhatsApp manually below.
                      </>
                    ) : (
                      <>
                        Automatic WhatsApp sending is not configured on the server yet (WhatsApp Business Platform Cloud API credentials are missing). Click below to open WhatsApp to your number{' '}
                        <strong className="tabular-nums">{order.customer.whatsappNumber}</strong>{' '}
                        — you must manually tap Send in WhatsApp.
                      </>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {isFailed && (
                    <button
                      type="button"
                      onClick={handleRetryCloudApi}
                      disabled={isRetrying}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#8C1D2D] bg-white hover:bg-[#FDF3F4] text-[#8C1D2D] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} aria-hidden="true" />
                      <span>{isRetrying ? 'Retrying...' : 'Retry Cloud API'}</span>
                    </button>
                  )}
                  <a
                    href={customerWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#1E6B3A] hover:bg-[#17552E] text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Open WhatsApp ({order.customer.whatsappNumber})</span>
                  </a>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E5DDD0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5C4B41]">
                <span>
                  Automatic background WhatsApp confirmations require WhatsApp Business Platform Cloud API credentials configured securely on the backend.
                </span>
                <button
                  type="button"
                  onClick={() => setShowMessagePreview((v) => !v)}
                  className="font-semibold text-[#6B1826] hover:underline self-start sm:self-auto shrink-0 cursor-pointer"
                >
                  {showMessagePreview ? 'Hide Message Preview' : 'Preview WhatsApp Message'}
                </button>
              </div>
            </div>
          )}

          {showMessagePreview && (
            <pre className="mt-3 p-3.5 rounded-lg bg-white border border-[#E5DDD0] text-xs text-[#2B1810] whitespace-pre-wrap font-mono overflow-x-auto">
              {whatsappText}
            </pre>
          )}
        </div>

        {/* Order Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-sm">
          <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#EFE7DB]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B5A4E]">
              Customer &amp; Delivery Address
            </p>
            <p className="mt-1.5 font-semibold text-[#2B1810]">{order.customer.fullName}</p>
            <p className="mt-0.5 text-xs text-[#4A3B32] tabular-nums">
              Mobile: {order.customer.mobileNumber} · WhatsApp: {order.customer.whatsappNumber}
            </p>
            <p className="mt-1.5 text-xs text-[#4A3B32] leading-relaxed">{address}</p>
            {order.customer.deliveryInstructions && (
              <p className="mt-1 text-xs text-[#6B5A4E]">
                Instructions: {order.customer.deliveryInstructions}
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#EFE7DB]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B5A4E]">
              Payment &amp; Delivery Timing
            </p>
            <p className="mt-1.5 font-semibold text-[#2B1810]">{order.paymentMethod}</p>
            <p className="mt-0.5 text-xs text-[#5C4B41]">{order.paymentNote}</p>
            <p className="mt-2 text-xs text-[#2B1810]">
              Estimated Delivery Time: <strong>{order.estimatedDeliveryTime}</strong>
            </p>
            <p className="mt-1 text-base font-bold text-[#6B1826] tabular-nums">
              Total Amount: ₹{order.totalAmount}
            </p>
          </div>
        </div>

        {/* Ordered Items with Food Images */}
        <div className="mt-6">
          <h2 className="font-display text-lg font-bold text-[#2B1810] mb-3">
            Ordered Food Items
          </h2>
          <div className="divide-y divide-[#F0E8DC] border border-[#EFE7DB] rounded-xl overflow-hidden">
            {order.items.map((item) => (
              <div key={item.id} className="p-3.5 bg-white flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#E5DDD0]">
                  <FoodImage src={item.image} alt={item.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#2B1810]">{item.name}</p>
                  <p className="text-xs text-[#6B5A4E] tabular-nums">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <p className="text-sm font-bold text-[#2B1810] tabular-nums">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={() => onNavigate('my-orders')}
            className="px-6 py-3 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            View My Orders
          </button>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="px-6 py-3 rounded-lg border border-[#D8CCBC] bg-white hover:bg-[#FAF6EF] text-[#2B1810] text-sm font-semibold transition-colors cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </section>
  );
};
