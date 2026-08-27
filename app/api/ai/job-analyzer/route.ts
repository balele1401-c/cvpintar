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

    const { jobDescription } = await request.json();

    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json(
        { error: 'Deskripsi lowongan kerja tidak boleh kosong.' },
        { status: 400 }
      );
    }

    // Check verified user plan on server
    const plan = await getVerifiedUserPlan(user.id);

    if (plan !== 'pro') {
      return NextResponse.json(
        {
          error: 'Job Description Analyzer eksklusif untuk pelanggan CVPintar Pro.',
          isProRequired: true,
        },
        { status: 403 }
      );
    }

    const analysis = await aiProvider.analyzeJobDescription(jobDescription);

    // Track usage
    const supabaseAdmin = createAdminClient();
    const todayStr = new Date().toISOString().split('T')[0];
    await supabaseAdmin.from('ai_usage').insert({
      user_id: user.id,
      feature: 'job_analyzer',
      usage_count: 1,
      usage_date: todayStr,
    });


    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in job analyzer route:', error);
    return NextResponse.json(
      { error: 'Gagal menganalisis lowongan kerja.' },
      { status: 500 }
    );
  }
}
