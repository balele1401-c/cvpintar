import { generateDokuDigest, generateDokuSignature } from './signature';

export interface CreatePaymentRequest {
  invoiceNumber: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  returnUrl: string;
  notificationUrl: string;
}

export interface DokuCheckoutResponse {
  paymentUrl: string;
  invoiceNumber: string;
  isSandboxMock?: boolean;
}

export class DokuService {
  private getClientConfig() {
    const clientId = process.env.DOKU_CLIENT_ID || '';
    const secretKey = process.env.DOKU_SECRET_KEY || '';
    const isSandbox = process.env.DOKU_ENVIRONMENT !== 'production';
    const baseUrl = isSandbox
      ? 'https://api-sandbox.doku.com'
      : 'https://api.doku.com';

    return { clientId, secretKey, isSandbox, baseUrl };
  }

  /**
   * Generates a Real-time DOKU Checkout Session directly via DOKU Payment Gateway
   */
  async createCheckout(req: CreatePaymentRequest): Promise<DokuCheckoutResponse> {
    const { clientId, secretKey, baseUrl } = this.getClientConfig();

    if (!clientId || !secretKey || clientId === 'your-doku-client-id-here') {
      throw new Error(
        'Kredensial DOKU (DOKU_CLIENT_ID / DOKU_SECRET_KEY) belum dikonfigurasi di .env.local.'
      );
    }

    const requestTarget = '/checkout/v1/payment';
    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const requestTimestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

    const bodyPayload = {
      order: {
        invoice_number: req.invoiceNumber,
        amount: req.amount,
        currency: 'IDR',
        callback_url: req.returnUrl,
        auto_redirect: true,
      },
      payment: {
        payment_due_date: 60, // 60 minutes
      },
      customer: {
        name: req.customerName || 'Pelanggan CVPintar',
        email: req.customerEmail,
      },
    };

    const rawBody = JSON.stringify(bodyPayload);
    const digest = generateDokuDigest(rawBody);
    const signature = generateDokuSignature(
      clientId,
      requestId,
      requestTimestamp,
      requestTarget,
      digest,
      secretKey
    );

    const response = await fetch(`${baseUrl}${requestTarget}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': clientId,
        'Request-Id': requestId,
        'Request-Timestamp': requestTimestamp,
        'Signature': signature,
        'Digest': digest,
      },
      body: rawBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DOKU API Error response:', response.status, errorText);
      throw new Error(`DOKU Payment Gateway Error (${response.status}): ${errorText}`);
    }

    const responseData = await response.json();
    const paymentUrl =
      responseData?.response?.payment?.url ||
      responseData?.payment?.url;

    if (!paymentUrl) {
      console.error('DOKU response missing payment URL:', responseData);
      throw new Error('Gagal mendapatkan URL pembayaran dari DOKU.');
    }

    return {
      paymentUrl,
      invoiceNumber: req.invoiceNumber,
      isSandboxMock: false,
    };
  }
}

export const dokuService = new DokuService();
