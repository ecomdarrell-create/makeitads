import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import Navbar from '@/components/shared/GlobalNavbar';
import GlobalFooter from '@/components/shared/GlobalFooter';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SaaSChatbot from '@/components/shared/SaaSChatbot';

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
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="md:pl-64 pt-16 pb-20 md:pb-0 min-h-screen">
        {/* pb-20 sur mobile pour ne pas cacher le contenu derrière la MobileNav */}
        {children}
        <div className="md:pl-0">
          <GlobalFooter />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
      <SaaSChatbot dashboard />
    </div>
);
}