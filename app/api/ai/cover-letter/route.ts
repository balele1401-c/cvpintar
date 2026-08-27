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
          error: 'Fitur Cover Letter Generator eksklusif untuk pelanggan CVPintar Pro.',
          isProRequired: true,
        },
        { status: 403 }
      );
    }

    const { company, position, skills } = await request.json();

    if (!company || !position) {
      return NextResponse.json(
        { error: 'Nama perusahaan dan posisi target wajib diisi.' },
        { status: 400 }
      );
    }

    const applicantName =
      user.user_metadata?.full_name || 'Pelamar CVPintar';

    const letter = await aiProvider.generateCoverLetter(
      company,
      position,
      skills || 'Keahlian Terkait',
      applicantName
    );

    // Track usage
    const supabaseAdmin = createAdminClient();
    const todayStr = new Date().toISOString().split('T')[0];
    await supabaseAdmin.from('ai_usage').insert({
      user_id: user.id,
      feature: 'cover_letter',
      usage_count: 1,
      usage_date: todayStr,
    });


    return NextResponse.json({ result: letter });
  } catch (error) {
    console.error('Error in cover letter route:', error);
    return NextResponse.json(
      { error: 'Gagal membuat surat lamaran kerja.' },
      { status: 500 }
    );
  }
}
