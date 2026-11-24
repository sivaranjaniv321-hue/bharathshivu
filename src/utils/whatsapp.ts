import { RESTAURANT_CONFIG } from '../data/menu';
import { CustomerDetails, Order, WhatsAppDeliveryInfo } from '../types';

export const WHATSAPP_COUNTRY_CODES = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA / Canada (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+65', label: 'Singapore (+65)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+60', label: 'Malaysia (+60)' },
  { code: '+61', label: 'Australia (+61)' },
];

export function normalizeWhatsAppE164(countryCode: string, localOrFullNumber: string): string {
  const trimmed = localOrFullNumber.trim();
  if (trimmed.startsWith('+')) {
    return `+${trimmed.slice(1).replace(/\D/g, '')}`;
  }
  const cleanCode = countryCode.startsWith('+')
    ? `+${countryCode.slice(1).replace(/\D/g, '')}`
    : `+${countryCode.replace(/\D/g, '')}`;
  const digits = trimmed.replace(/\D/g, '').replace(/^0+/, '');
  return `${cleanCode}${digits}`;
}

export function validateWhatsAppWithCountryCode(
  countryCode: string,
  rawNumber: string
): { valid: true; e164: string } | { valid: false; error: string } {
  const trimmed = rawNumber.trim();
  if (!trimmed) {
    return { valid: false, error: 'WhatsApp number is required.' };
  }

  const e164 = normalizeWhatsAppE164(countryCode, trimmed);

  if (e164.startsWith('+91')) {
    const localDigits = e164.slice(3);
    if (!/^[6-9]\d{9}$/.test(localDigits)) {
      return {
        valid: false,
        error: 'Enter a valid 10-digit Indian WhatsApp number with +91 country code.',
      };
    }
    return { valid: true, e164 };
  }

  if (!/^\+[1-9]\d{7,14}$/.test(e164)) {
    return {
      valid: false,
      error: 'Enter a valid WhatsApp number with country code (e.g., +919876543210).',
    };
  }

  return { valid: true, e164 };
}

export function formatDeliveryAddress(customer: CustomerDetails): string {
  return [
    customer.houseNumber,
    customer.streetName,
    customer.area,
    customer.city,
    customer.district,
    `PIN: ${customer.pinCode}`,
  ]
    .filter(Boolean)
    .join(', ');
}

export function formatWhatsAppOrderMessage(order: Order): string {
  const addressParts = formatDeliveryAddress(order.customer);

  const itemLines = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name} × ${item.quantity} — ₹${item.price * item.quantity} (₹${item.price} each)`
    )
    .join('\n');

  const lines = [
    `*${RESTAURANT_CONFIG.name} — Order Confirmation*`,
    `Order Number: ${order.orderNumber}`,
    `Order Status: ${order.status}`,
    ``,
    `Customer Name: ${order.customer.fullName}`,
    `Delivery Address: ${addressParts}`,
    order.customer.deliveryInstructions
      ? `Delivery Instructions: ${order.customer.deliveryInstructions}`
      : null,
    ``,
    `*Ordered Food Items*`,
    itemLines,
    ``,
    `Subtotal: ₹${order.subtotal}`,
    `Delivery Charge: ${order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}`,
    `*Total Amount: ₹${order.totalAmount}*`,
    `Payment Method: ${order.paymentMethod}`,
    ``,
    `Thank you for ordering from ${RESTAURANT_CONFIG.name}!`,
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}

export function buildCustomerWhatsAppUrl(order: Order): string {
  const message = formatWhatsAppOrderMessage(order);
  const encoded = encodeURIComponent(message);
  // Sends directly to the customer's own WhatsApp number (never a fixed restaurant number)
  const customerDigits = order.customer.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${customerDigits}?text=${encoded}`;
}

export async function sendOrderConfirmationViaBackend(
  order: Order
): Promise<WhatsAppDeliveryInfo> {
  const recipientNumber = order.customer.whatsappNumber;
  try {
    const response = await fetch('/api/whatsapp/send-order-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderNumber: order.orderNumber,
        customerName: order.customer.fullName,
        customerWhatsapp: recipientNumber,
        deliveryAddress: formatDeliveryAddress(order.customer),
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        status: order.status,
        items: order.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      configured?: boolean;
      sent?: boolean;
      messageId?: string;
      confirmedAt?: string;
      mode?: 'cloud-api-text' | 'cloud-api-template';
      error?: string;
    };

    if (response.ok && data.sent && data.messageId) {
      return {
        status: 'sent',
        recipientNumber,
        mode: data.mode || 'cloud-api-text',
        messageId: data.messageId,
        confirmedAt: data.confirmedAt,
      };
    }

    if (data.configured === false) {
      return {
        status: 'not_configured',
        recipientNumber,
        mode: 'click-to-chat-fallback',
        error:
          data.error ||
          'WhatsApp Business Platform Cloud API is not configured on the server.',
      };
    }

    return {
      status: 'failed',
      recipientNumber,
      mode: 'cloud-api-text',
      error: data.error || 'WhatsApp service did not confirm delivery.',
    };
  } catch {
    return {
      status: 'failed',
      recipientNumber,
      mode: 'click-to-chat-fallback',
      error: 'Could not reach the backend WhatsApp confirmation service.',
    };
  }
}
