import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/Sidebar';
import Navbar from '@/components/shared/GlobalNavbar';
import GlobalFooter from '@/components/shared/GlobalFooter';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SaaSChatbot from '@/components/shared/SaaSChatbot';

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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

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
      <SaaSChatbot dashboard />
    </div>
  );
}