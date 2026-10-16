import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/Sidebar';
import Navbar from '@/components/shared/GlobalNavbar';
import GlobalFooter from '@/components/shared/GlobalFooter';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ getSession() lit depuis le cookie → INSTANTANÉ, aucun appel réseau
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
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