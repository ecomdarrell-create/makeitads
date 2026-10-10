import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { AnalyticsClient } from './AnalyticsClient';

const ADMIN_EMAIL = 'ecomdarrell@gmail.com';

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  if (user.email !== ADMIN_EMAIL) redirect('/dashboard');

  // Récupérer toutes les stats en parallèle
  const [
    { data: allProfiles },
    { data: allTransactions },
    { data: allStrategies },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, email, first_name, plan, credits_balance, created_at'),
    supabase
      .from('credit_transactions')
      .select('id, user_id, type, amount, created_at')
      .order('created_at', { ascending: false })
      .limit(5000),
    supabase
      .from('strategies')
      .select('id, user_id, type, credits_cost, created_at')
      .order('created_at', { ascending: false })
      .limit(5000),
  ]);

  const profiles = allProfiles || [];
  const transactions = allTransactions || [];
  const strategies = allStrategies || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
      <BackButton href="/dashboard/admin" label="Retour admin" />

      <div className="mb-5">
        <h1 className="mb-1 text-base font-semibold text-[#111827] sm:text-lg">
          Analytics
        </h1>
        <p className="text-xs text-slate-600 sm:text-sm">
          Vue d&apos;ensemble de l&apos;activité de la plateforme.
        </p>
      </div>

      <AnalyticsClient
        profiles={profiles}
        transactions={transactions}
        strategies={strategies}
      />
    </div>
  );
}