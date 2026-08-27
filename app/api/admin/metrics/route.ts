import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }

    const email = user.email.toLowerCase().trim();

    const configuredAdmins = (process.env.ADMIN_EMAILS || 'admin@kerjaai.id')
      .split(',')
      .map((e) => e.trim().toLowerCase());

    const isAuthorized = configuredAdmins.includes(email);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Akses ditolak. Anda bukan administrator resmi CVPintar.' },
        { status: 403 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // 1. Total users & Pro users
    const { data: profiles, error: profError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, plan, created_at')
      .order('created_at', { ascending: false });

    if (profError) {
      console.error('Error fetching admin profiles:', profError);
    }

    const totalUsers = profiles?.length || 0;
    const proUsers = profiles?.filter((p) => p.plan === 'pro').length || 0;
    const recentProfiles = (profiles || []).slice(0, 10);

    // 2. Total CVs created
    const { count: totalCVs } = await supabaseAdmin
      .from('cvs')
      .select('*', { count: 'exact', head: true });

    // 3. Revenue & payments
    const { data: payments, error: payError } = await supabaseAdmin
      .from('payments')
      .select('id, provider_reference, amount, status, created_at, provider')
      .order('created_at', { ascending: false });

    if (payError) {
      console.error('Error fetching admin payments:', payError);
    }

    const successPayments = (payments || []).filter((p) => p.status === 'SUCCESS');
    const totalRevenue = successPayments.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0
    );
    const recentPayments = (payments || []).slice(0, 10);

    return NextResponse.json({
      metrics: {
        totalUsers,
        proUsers,
        totalRevenue,
        totalCVs: totalCVs || 0,
      },
      recentProfiles,
      recentPayments,
    });
  } catch (error) {
    console.error('Admin metrics exception:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server admin.' },
      { status: 500 }
    );
  }
}
