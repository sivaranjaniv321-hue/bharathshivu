import 'dotenv/config';
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const E164_REGEX = /^\+[1-9]\d{7,14}$/;
const API_VERSION_REGEX = /^v\d+\.\d+$/;
const PHONE_ID_REGEX = /^\d{5,30}$/;

interface OrderItemInput {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationPayload {
  orderNumber: string;
  customerName: string;
  customerWhatsapp: string;
  deliveryAddress: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  items: OrderItemInput[];
}

function sanitizeText(value: unknown, maxLen = 300): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\r\n\t]+/g, ' ').trim().slice(0, maxLen);
}

function buildConfirmationBody(payload: OrderConfirmationPayload): string {
  const itemLines = payload.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} x ${item.quantity} - ₹${item.price * item.quantity} (₹${item.price} each)`
    )
    .join('\n');

  return [
    'Bharath Delights — Order Confirmation',
    `Order Number: ${payload.orderNumber}`,
    `Order Status: ${payload.status}`,
    '',
    `Customer Name: ${payload.customerName}`,
    `Delivery Address: ${payload.deliveryAddress}`,
    '',
    'Ordered Items:',
    itemLines,
    '',
    `Total Amount: ₹${payload.totalAmount}`,
    `Payment Method: ${payload.paymentMethod}`,
    '',
    'Thank you for ordering from Bharath Delights!',
  ].join('\n');
}

function validateOrderPayload(
  body: unknown
): { valid: true; data: OrderConfirmationPayload } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body.' };
  }

  const record = body as Record<string, unknown>;
  const orderNumber = sanitizeText(record.orderNumber, 40);
  const customerName = sanitizeText(record.customerName, 120);
  const customerWhatsapp = sanitizeText(record.customerWhatsapp, 20);
  const deliveryAddress = sanitizeText(record.deliveryAddress, 400);
  const paymentMethod = sanitizeText(record.paymentMethod, 60);
  const status = sanitizeText(record.status, 60) || 'Order Received';
  const totalAmount = Number(record.totalAmount);

  if (!orderNumber || !customerName || !deliveryAddress || !paymentMethod) {
    return { valid: false, error: 'Missing required order confirmation fields.' };
  }
  if (!E164_REGEX.test(customerWhatsapp)) {
    return {
      valid: false,
      error: 'Customer WhatsApp number must include a valid country code (e.g. +919876543210).',
    };
  }
  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    return { valid: false, error: 'Total amount must be greater than zero.' };
  }
  if (!Array.isArray(record.items) || record.items.length === 0 || record.items.length > 100) {
    return { valid: false, error: 'Ordered items list is required.' };
  }

  const cleanItems: OrderItemInput[] = [];
  for (const rawItem of record.items) {
    if (!rawItem || typeof rawItem !== 'object') {
      return { valid: false, error: 'Invalid item entry.' };
    }
    const itemObj = rawItem as Record<string, unknown>;
    const name = sanitizeText(itemObj.name, 120);
    const quantity = Number(itemObj.quantity);
    const price = Number(itemObj.price);
    if (!name || !Number.isInteger(quantity) || quantity <= 0 || !Number.isFinite(price) || price < 0) {
      return { valid: false, error: 'Each ordered item must include a valid name, quantity, and price.' };
    }
    cleanItems.push({ name, quantity, price });
  }

  return {
    valid: true,
    data: {
      orderNumber,
      customerName,
      customerWhatsapp,
      deliveryAddress,
      paymentMethod,
      totalAmount,
      status,
      items: cleanItems,
    },
  };
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/whatsapp/status', (_req: Request, res: Response) => {
    const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME?.trim() || '';
    const configured = Boolean(token && phoneNumberId && PHONE_ID_REGEX.test(phoneNumberId));

    res.json({
      configured,
      templateConfigured: Boolean(templateName),
    });
  });

  app.post('/api/whatsapp/send-order-confirmation', async (req: Request, res: Response) => {
    const validation = validateOrderPayload(req.body);
    if (!validation.valid) {
      res.status(400).json({
        configured: false,
        sent: false,
        error: validation.error,
      });
      return;
    }

    const orderData = validation.data;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
    const rawVersion = process.env.WHATSAPP_API_VERSION?.trim() || 'v21.0';
    const apiVersion = API_VERSION_REGEX.test(rawVersion) ? rawVersion : 'v21.0';
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME?.trim();
    const templateLanguage = sanitizeText(process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en', 16) || 'en';

    if (!accessToken || !phoneNumberId || !PHONE_ID_REGEX.test(phoneNumberId)) {
      res.status(200).json({
        configured: false,
        sent: false,
        recipientNumber: orderData.customerWhatsapp,
        error:
          'WhatsApp Business Platform Cloud API credentials (WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID) are not configured on the server.',
      });
      return;
    }

    // Meta Cloud API expects digits without leading '+'
    const recipientDigits = orderData.customerWhatsapp.replace(/^\+/, '');
    const itemsSummary = orderData.items
      .map((i) => `${i.name} x${i.quantity} (₹${i.price * i.quantity})`)
      .join(', ')
      .slice(0, 900);

    const graphBody = templateName
      ? {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientDigits,
          type: 'template',
          template: {
            name: templateName,
            language: { code: templateLanguage },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: orderData.customerName },
                  { type: 'text', text: orderData.orderNumber },
                  { type: 'text', text: itemsSummary },
                  { type: 'text', text: `₹${orderData.totalAmount}` },
                  { type: 'text', text: orderData.paymentMethod },
                  { type: 'text', text: orderData.deliveryAddress },
                  { type: 'text', text: orderData.status },
                ],
              },
            ],
          },
        }
      : {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientDigits,
          type: 'text',
          text: {
            preview_url: false,
            body: buildConfirmationBody(orderData),
          },
        };

    try {
      const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
      const metaResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphBody),
      });

      const metaJson = (await metaResponse.json().catch(() => ({}))) as {
        messages?: Array<{ id?: string }>;
        error?: { message?: string; code?: number };
      };

      const messageId = metaJson?.messages?.[0]?.id;

      if (!metaResponse.ok || !messageId) {
        res.status(502).json({
          configured: true,
          sent: false,
          recipientNumber: orderData.customerWhatsapp,
          error:
            metaJson?.error?.message ||
            `WhatsApp Cloud API returned status ${metaResponse.status} without a delivery confirmation ID.`,
        });
        return;
      }

      res.status(200).json({
        configured: true,
        sent: true,
        recipientNumber: orderData.customerWhatsapp,
        messageId,
        confirmedAt: new Date().toISOString(),
        mode: templateName ? 'cloud-api-template' : 'cloud-api-text',
      });
    } catch {
      res.status(502).json({
        configured: true,
        sent: false,
        recipientNumber: orderData.customerWhatsapp,
        error: 'Unable to reach WhatsApp Business Platform Cloud API.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bharath Delights server listening on http://localhost:${PORT}`);
  });
}

createServer();
