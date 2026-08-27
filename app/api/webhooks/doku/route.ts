import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyDokuSignature } from '@/lib/doku/signature';
import { PRO_PRICE_IDR } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let body: Record<string, unknown> = {};
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const headers = request.headers;
    const clientId = headers.get('client-id') || '';
    const requestId = headers.get('request-id') || '';
    const requestTimestamp = headers.get('request-timestamp') || '';
    const signature = headers.get('signature') || '';
    const devSimToken = headers.get('x-doku-dev-simulator') || '';
    const secretKey = process.env.DOKU_SECRET_KEY || '';
    const isProduction = process.env.NODE_ENV === 'production';

    // 1. Signature Verification Check
    const isDevSimulator = !isProduction && devSimToken === 'KERJAAI_DEV_SANDBOX_BYPASS';

    if (!isDevSimulator) {
      if (secretKey && secretKey !== 'your-doku-secret-key-here') {
        const isValid = verifyDokuSignature(
          signature,
          clientId,
          requestId,
          requestTimestamp,
          '/api/webhooks/doku',
          rawBody,
          secretKey
        );

        if (!isValid) {
          console.warn('Invalid DOKU webhook signature rejected:', { signature, clientId });
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
      } else if (isProduction) {
        // In production, missing DOKU_SECRET_KEY is a fatal security error
        console.error('FATAL: DOKU_SECRET_KEY is not configured in production.');
        return NextResponse.json({ error: 'Webhook processing disabled' }, { status: 500 });
      } else {
        // In development only, require dev token if no secret is set
        return NextResponse.json(
          { error: 'Missing webhook signature or dev simulation token' },
          { status: 401 }
        );
      }
    }


    const orderObj = body?.order as Record<string, unknown> | undefined;
    const transObj = body?.transaction as Record<string, unknown> | undefined;
    const resObj = body?.result as Record<string, unknown> | undefined;

    const invoiceNumber =
      (orderObj?.invoice_number as string) ||
      (transObj?.invoice_number as string) ||
      (body?.invoiceNumber as string);

    const receivedAmount = Number(orderObj?.amount || transObj?.amount || body?.amount);
    const receivedCurrency = (orderObj?.currency as string) || 'IDR';

    const transactionStatus =
      (transObj?.status as string) ||
      (body?.status as string) ||
      (resObj?.status === 'SUCCESS' ? 'SUCCESS' : 'PENDING');

    if (!invoiceNumber) {
      return NextResponse.json(
        { error: 'Missing invoice number' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // 2. Fetch payment record
    const { data: paymentRecord, error: fetchError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('provider_reference', invoiceNumber)
      .single();

    if (fetchError || !paymentRecord) {
      console.error('Payment record not found for invoice:', invoiceNumber);
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // 3. Idempotency check: If already SUCCESS, return 200 immediately
    if (paymentRecord.status === 'SUCCESS') {
      return NextResponse.json({ status: 'ALREADY_PROCESSED' }, { status: 200 });
    }

    // 4. Validate Amount and Currency match
    if (transactionStatus === 'SUCCESS') {
      if (
        receivedAmount &&
        (receivedAmount < Number(paymentRecord.amount) ||
          receivedAmount < PRO_PRICE_IDR ||
          receivedCurrency !== 'IDR')
      ) {
        console.error('Payment amount/currency mismatch:', {
          receivedAmount,
          expectedAmount: paymentRecord.amount,
          proPrice: PRO_PRICE_IDR,
          receivedCurrency,
        });
        return NextResponse.json(
          { error: 'Amount or currency mismatch' },
          { status: 400 }
        );
      }


      const now = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days subscription

      // A. Create/Update Subscription
      const { data: subData, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: paymentRecord.user_id,
          plan: 'pro',
          status: 'active',
          provider: 'doku',
          provider_reference: invoiceNumber,
          started_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (subError) {
        console.error('Error creating subscription:', subError);
      }

      // B. Update Payment record
      await supabaseAdmin
        .from('payments')
        .update({
          status: 'SUCCESS',
          subscription_id: subData?.id || null,
          paid_at: now.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('id', paymentRecord.id);

      // C. Activate Pro on Profile
      await supabaseAdmin
        .from('profiles')
        .update({
          plan: 'pro',
          updated_at: now.toISOString(),
        })
        .eq('user_id', paymentRecord.user_id);

      console.log(
        `[PRO ACTIVATED] User ${paymentRecord.user_id} upgraded to PRO via invoice ${invoiceNumber}`
      );
    } else if (transactionStatus === 'FAILED' || transactionStatus === 'EXPIRED') {
      await supabaseAdmin
        .from('payments')
        .update({
          status: transactionStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentRecord.id);
    }

    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('DOKU webhook exception:', error);
    return NextResponse.json(
      { error: 'Internal server error processing webhook' },
      { status: 500 }
    );
  }
}
