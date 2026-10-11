import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { RevenueClient } from './RevenueClient';
import { normalizeCurrency } from '@/lib/currency';

const ADMIN_EMAILS = ['ecomdarrell@gmail.com', 'darrellkamga@gmail.com'];

export default async function RevenuePage() {
  // 1) Auth via client normal (cookies user)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  const isAdmin = user.email ? ADMIN_EMAILS.includes(user.email.toLowerCase().trim()) : false;
  if (!isAdmin) redirect('/dashboard');

  // 2) Admin client (bypass RLS)
  const admin = createAdminClient();

  const [revenuesRes, profilesRes, adminProfileRes] = await Promise.all([
    admin
      .from('revenue_transactions')
      .select('id, user_id, email, plan_id, amount_fcfa, source, order_id, created_at')
      .order('created_at', { ascending: false })
      .limit(500),
    admin
      .from('profiles')
      .select('id, email, first_name, plan'),
    admin
      .from('profiles')
      .select('currency')
      .eq('id', user.id)
      .maybeSingle(),
  ]);

  const revenues = revenuesRes.data ?? [];
  const profiles = profilesRes.data ?? [];
  const adminCurrency = normalizeCurrency(adminProfileRes.data?.currency);

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
      <BackButton href="/dashboard/admin" label="Retour admin" />

      <div className="mb-5">
        <h1 className="mb-1 text-base font-semibold text-[#111827] sm:text-lg">
          Revenus
        </h1>
        <p className="text-xs text-slate-600 sm:text-sm">
          Suivi du chiffre d&apos;affaires et des transactions.
        </p>
      </div>

      <RevenueClient
        revenues={revenues}
        profiles={profiles}
        currency={adminCurrency}
      />
    </div>
  );
}