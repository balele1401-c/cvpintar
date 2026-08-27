import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { dokuService } from '@/lib/doku/client';
import { PRO_PRICE_IDR } from '@/lib/constants';
import { validatePromoCode, calculateDiscountedPrice } from '@/lib/promo';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Silakan masuk terlebih dahulu untuk upgrade ke Pro.' },
        { status: 401 }
      );
    }

    let promoCode: string | undefined;
    try {
      const body = await request.json().catch(() => ({}));
      promoCode = body?.promoCode;
    } catch {
      // Body parsing optional
    }

    const validatedPromo = promoCode ? validatePromoCode(promoCode) : null;
    const { finalPrice, discountAmount } = calculateDiscountedPrice(
      PRO_PRICE_IDR,
      validatedPromo
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const invoiceNumber = `INV-KJ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create payment record in database securely via service_role admin client
    const supabaseAdmin = createAdminClient();
    const { error: paymentError } = await supabaseAdmin.from('payments').insert({
      user_id: user.id,
      provider: 'doku',
      provider_reference: invoiceNumber,
      amount: finalPrice,
      currency: 'IDR',
      status: 'PENDING',
    });

    if (paymentError) {
      console.error('Error recording pending payment:', paymentError);
      return NextResponse.json(
        { error: 'Gagal membuat catatan transaksi.' },
        { status: 500 }
      );
    }

    // Call DOKU client
    const checkoutResult = await dokuService.createCheckout({
      invoiceNumber,
      amount: finalPrice,
      customerName: user.user_metadata?.full_name || 'Pelanggan CVPintar',
      customerEmail: user.email || 'user@kerjaai.id',
      returnUrl: `${appUrl}/checkout/success?invoice=${invoiceNumber}`,
      notificationUrl: `${appUrl}/api/webhooks/doku`,
    });

    return NextResponse.json({
      ...checkoutResult,
      appliedPromo: validatedPromo
        ? {
            code: validatedPromo.code,
            discountAmount,
            discountPercentage: validatedPromo.discountPercentage,
          }
        : null,
    });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: 'Gagal memproses checkout DOKU.' },
      { status: 500 }
    );
  }
}
