import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceNumber = searchParams.get('invoice');

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = createAdminClient();

    // Check user profile plan
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    // If profile is already pro, treat as success
    if (profile?.plan === 'pro') {
      return NextResponse.json({
        status: 'SUCCESS',
        plan: 'pro',
        invoiceNumber,
      });
    }

    if (invoiceNumber) {
      // Check payment record status
      const { data: payment } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('provider_reference', invoiceNumber)
        .eq('user_id', user.id)
        .single();

      if (payment) {
        return NextResponse.json({
          status: payment.status, // 'PENDING' | 'SUCCESS' | 'FAILED'
          plan: profile?.plan || 'free',
          amount: payment.amount,
          invoiceNumber,
        });
      }
    }

    return NextResponse.json({
      status: profile?.plan === 'pro' ? 'SUCCESS' : 'PENDING',
      plan: profile?.plan || 'free',
      invoiceNumber,
    });
  } catch (err) {
    console.error('Payment status check error:', err);
    return NextResponse.json({ error: 'Failed to verify status' }, { status: 500 });
  }
}
