import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/Sidebar';
import Navbar from '@/components/shared/GlobalNavbar';
import GlobalFooter from '@/components/shared/GlobalFooter';
import ExitIntentPopup from '@/components/shared/ExitIntentPopup';
// ✅ AILoader retiré d'ici pour éviter le conflit avec les loading.tsx du dossier dashboard
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard | MakeItAds',
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-[#F8F8FC]">
      {/* ✅ Seul le Pop-up de rétention reste ici */}
      <ExitIntentPopup /> 
      
      <Navbar />
      <Sidebar />
      <main className="md:pl-64 pt-16 pb-28 md:pb-0 min-h-screen">
        {children}
        <div className="md:pl-0">
          <GlobalFooter />
        </div>
      </main>
    </div>
  );
}