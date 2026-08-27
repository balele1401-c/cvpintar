import { createAdminClient } from '@/lib/supabase/admin';
import { UserPlan } from '@/types';

/**
 * Server-side helper to determine real, non-expired user plan.
 * If a Pro subscription has passed expires_at, automatically marks it expired
 * and downgrades profiles.plan to 'free'.
 */
export async function getVerifiedUserPlan(userId: string): Promise<UserPlan> {
  const supabaseAdmin = createAdminClient();

  // 1. Fetch active subscription for user
  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!subscription) {
    // No active subscription, ensure profile says free
    return 'free';
  }

  // 2. Check expiration date
  if (subscription.expires_at) {
    const expiresAt = new Date(subscription.expires_at).getTime();
    const now = Date.now();

    if (now > expiresAt) {
      // Subscription has expired -> downgrade in background
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('id', subscription.id);

      await supabaseAdmin
        .from('profiles')
        .update({ plan: 'free', updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      return 'free';
    }
  }

  return (subscription.plan as UserPlan) || 'free';
}
