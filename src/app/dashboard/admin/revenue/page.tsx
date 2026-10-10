import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { RevenueClient } from './RevenueClient';

const ADMIN_EMAIL = 'ecomdarrell@gmail.com';

export default async function RevenuePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  if (user.email !== ADMIN_EMAIL) redirect('/dashboard');

  const { data: revenues } = await supabase
    .from('revenue_transactions')
    .select('id, user_id, email, plan_id, amount_fcfa, source, order_id, created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, email, first_name, plan');

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
        revenues={revenues || []}
        profiles={allProfiles || []}
      />
    </div>
  );
}