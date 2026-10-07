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
      {/* pb-28 sur mobile pour laisser respirer la MobileNav flottante */}
      <main className="md:pl-64 pt-16 pb-28 md:pb-0 min-h-screen">
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