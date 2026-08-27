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

    const plan = await getVerifiedUserPlan(user.id);
    if (plan !== 'pro') {
      return NextResponse.json(
        {
          error: 'Fitur Interview Preparation eksklusif untuk pelanggan CVPintar Pro.',
          isProRequired: true,
        },
        { status: 403 }
      );
    }

    const { role } = await request.json();

    if (!role || typeof role !== 'string') {
      return NextResponse.json(
        { error: 'Posisi yang ingin dilatih wajib diisi.' },
        { status: 400 }
      );
    }

    const questions = await aiProvider.generateInterviewQuestions(role);

    // Track usage
    const supabaseAdmin = createAdminClient();
    const todayStr = new Date().toISOString().split('T')[0];
    await supabaseAdmin.from('ai_usage').insert({
      user_id: user.id,
      feature: 'interview_prep',
      usage_count: 1,
      usage_date: todayStr,
    });


    return NextResponse.json({ result: questions });
  } catch (error) {
    console.error('Error in interview route:', error);
    return NextResponse.json(
      { error: 'Gagal memproses pertanyaan interview.' },
      { status: 500 }
    );
  }
}
