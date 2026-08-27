import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { aiProvider } from '@/lib/ai/provider';
import { getVerifiedUserPlan } from '@/lib/subscriptions';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Silakan masuk terlebih dahulu.' },
        { status: 401 }
      );
    }

    const { cvText, targetJob } = await request.json();

    if (!cvText || typeof cvText !== 'string') {
      return NextResponse.json(
        { error: 'Data CV tidak valid untuk dianalisis.' },
        { status: 400 }
      );
    }

    // Check user plan - Server-side Authorization Check
    const plan = await getVerifiedUserPlan(user.id);

    if (plan !== 'pro') {
      return NextResponse.json(
        {
          error: 'Fitur ATS Score Checker eksklusif untuk pelanggan CVPintar Pro.',
          isProRequired: true,
        },
        { status: 403 }
      );
    }

    // Perform analysis
    const analysis = await aiProvider.checkATS(cvText, targetJob);

    // Track usage
    const supabaseAdmin = createAdminClient();
    const todayStr = new Date().toISOString().split('T')[0];
    await supabaseAdmin.from('ai_usage').insert({
      user_id: user.id,
      feature: 'ats_checker',
      usage_count: 1,
      usage_date: todayStr,
    });


    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in ATS Checker route:', error);
    return NextResponse.json(
      { error: 'Gagal menganalisis skor ATS.' },
      { status: 500 }
    );
  }
}
