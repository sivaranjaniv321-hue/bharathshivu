import React from 'react';
import { MessageCircle, Package } from 'lucide-react';
import { Order, PageRoute } from '../types';
import { FoodImage } from '../components/FoodImage';
import { buildCustomerWhatsAppUrl } from '../utils/whatsapp';

interface MyOrdersPageProps {
  orders: Order[];
  onNavigate: (page: PageRoute) => void;
}

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({ orders, onNavigate }) => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="pb-6 border-b border-[#E5DDD0] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B1826]">
            Order History
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#2B1810]">
            My Orders
          </h1>
          <p className="mt-1.5 text-xs text-[#6B5A4E]">
            Demonstration order history stored locally in your browser.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('menu')}
          className="text-sm font-semibold text-[#6B1826] hover:underline self-start sm:self-auto cursor-pointer"
        >
          Order More Food
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 bg-white border border-[#E5DDD0] rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-[#F2EAE0] text-[#6B1826] flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#2B1810]">
            No Previous Orders Yet
          </h2>
          <p className="mt-2 text-sm text-[#5C4B41] max-w-md mx-auto">
            Once you place an order at Bharath Delights, your receipt, ordered food photos, and delivery status will appear here.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="mt-6 px-6 py-3 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] text-white text-sm font-semibold cursor-pointer"
          >
            View Menu
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => {
            const address = [
              order.customer.houseNumber,
              order.customer.streetName,
              order.customer.area,
              order.customer.city,
              order.customer.district,
              order.customer.pinCode,
            ]
              .filter(Boolean)
              .join(', ');

            return (
              <article
                key={order.orderNumber}
                className="bg-white border border-[#E5DDD0] rounded-2xl overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-5 bg-[#FFFDF9] border-b border-[#EFE7DB] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 text-sm">
                      <span className="font-bold text-[#6B1826] tabular-nums">
                        {order.orderNumber}
                      </span>
                      <span className="text-[#9B8A7E]" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-xs text-[#5C4B41]">{order.createdAt}</span>
                      <span className="text-[#9B8A7E]" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-xs font-semibold text-[#1E6B3A]">{order.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#5C4B41]">
                      Delivered to: {order.customer.fullName} — {address}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-[#6B5A4E]">{order.paymentMethod}</p>
                      <p className="text-lg font-bold text-[#2B1810] tabular-nums">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                    {order.whatsappDelivery?.status === 'sent' && order.whatsappDelivery.messageId ? (
                      <span className="text-xs font-semibold text-[#1E6B3A] whitespace-nowrap">
                        WhatsApp Sent
                      </span>
                    ) : (
                      <a
                        href={buildCustomerWhatsAppUrl(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1E6B3A] hover:bg-[#17552E] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                        title={`Open WhatsApp message to ${order.customer.whatsappNumber}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Open WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-[#F0E8DC] bg-[#FAF6EF]/50"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[#E5DDD0]">
                        <FoodImage src={item.image} alt={item.name} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#2B1810] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#5C4B41] tabular-nums">
                          Qty {item.quantity} · ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
