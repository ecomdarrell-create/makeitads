import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, CreditCard, LogOut } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6 max-w-3xl mx-auto">
      <BackButton href="/dashboard" label="Retour au dashboard" />

      <div className="mb-5">
        <h1 className="text-base sm:text-lg font-semibold text-[#111827] mb-1">
          Paramètres
        </h1>
        <p className="text-[10px] sm:text-xs text-gray-600">
          Gérez votre compte et vos préférences.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-[#6366F1]" />
            <h2 className="text-xs sm:text-sm font-semibold text-[#111827]">Profil</h2>
          </div>
          <div className="space-y-2.5">
            <div>
              <label className="block text-[10px] text-gray-600 mb-0.5">Prénom</label>
              <p className="text-xs text-[#111827]">{profile?.first_name || 'Non renseigné'}</p>
            </div>
            <div>
              <label className="block text-[10px] text-gray-600 mb-0.5">Nom</label>
              <p className="text-xs text-[#111827]">{profile?.last_name || 'Non renseigné'}</p>
            </div>
            <div>
              <label className="block text-[10px] text-gray-600 mb-0.5">Pays</label>
              <p className="text-xs text-[#111827]">{profile?.country || 'Non renseigné'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-[#6366F1]" />
            <h2 className="text-xs sm:text-sm font-semibold text-[#111827]">Email</h2>
          </div>
          <p className="text-xs text-[#111827]">{user.email}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-[#6366F1]" />
            <h2 className="text-xs sm:text-sm font-semibold text-[#111827]">Abonnement</h2>
          </div>
          <div className="space-y-2.5">
            <div>
              <label className="block text-[10px] text-gray-600 mb-0.5">Plan actuel</label>
              <p className="text-xs font-semibold text-[#111827] capitalize">
                {profile?.plan || 'free'}
              </p>
            </div>
            <div>
              <label className="block text-[10px] text-gray-600 mb-0.5">Crédits disponibles</label>
              <p className="text-xs font-semibold text-[#6366F1]">
                {profile?.credits_balance || 0} crédits
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] sm:text-xs font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#5558e6] transition-colors"
            >
              Voir les plans
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <form
            action={async () => {
              'use server';
              const supabase = await createClient();
              await supabase.auth.signOut();
              redirect('/login');
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}