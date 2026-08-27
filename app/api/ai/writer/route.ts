import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { aiProvider } from '@/lib/ai/provider';
import { getFeatureLimits } from '@/lib/constants';
import { getVerifiedUserPlan } from '@/lib/subscriptions';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Silakan masuk terlebih dahulu untuk menggunakan asisten AI.' },
        { status: 401 }
      );
    }

    const { rawText } = await request.json();

    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Teks deskripsi pengalaman tidak boleh kosong.' },
        { status: 400 }
      );
    }

    // Check user plan verified server-side
    const plan = await getVerifiedUserPlan(user.id);
    const limits = getFeatureLimits(plan);

    // Track & check daily usage via admin client
    const supabaseAdmin = createAdminClient();
    const todayStr = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabaseAdmin
      .from('ai_usage')
      .select('usage_count')
      .eq('user_id', user.id)
      .eq('feature', 'cv_writer')
      .eq('usage_date', todayStr)
      .single();

    const currentCount = usage?.usage_count || 0;

    if (currentCount >= limits.aiDailyLimit) {
      return NextResponse.json(
        {
          error:
            plan === 'free'
              ? 'Anda telah mencapai batas 5x AI harian pada Free Plan. Upgrade ke Pro untuk akses tanpa batas!'
              : 'Batas harian tercapai.',
          isLimitReached: true,
        },
        { status: 429 }
      );
    }

    // Call AI rewrite
    const optimizedText = await aiProvider.rewriteExperience(rawText);

    // Increment usage
    if (usage) {
      await supabaseAdmin
        .from('ai_usage')
        .update({ usage_count: currentCount + 1 })
        .eq('user_id', user.id)
        .eq('feature', 'cv_writer')
        .eq('usage_date', todayStr);
    } else {
      await supabaseAdmin.from('ai_usage').insert({
        user_id: user.id,
        feature: 'cv_writer',
        usage_count: 1,
        usage_date: todayStr,
      });
    }


    return NextResponse.json({
      result: optimizedText,
      usageRemaining: limits.aiDailyLimit - (currentCount + 1),
    });
  } catch (error) {
    console.error('Error in AI writer route:', error);
    return NextResponse.json(
      { error: 'Gagal memproses dengan AI. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
