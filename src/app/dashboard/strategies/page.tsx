import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { StrategiesClient } from './StrategiesClient';

export default async function StrategiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: strategies } = await supabase
    .from('strategies')
    .select('id, title, type, platform, status, credits_cost, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6">
      <BackButton href="/dashboard" label="Retour au dashboard" />

      <div className="mb-5">
        <h1 className="mb-1 text-lg font-semibold text-[#111827] sm:text-xl">
          Vos stratégies
        </h1>
        <p className="text-xs text-slate-600">
          Retrouvez, filtrez et gérez l&apos;ensemble de vos stratégies générées.
        </p>
      </div>

      <StrategiesClient strategies={strategies || []} />
    </div>
  );
}