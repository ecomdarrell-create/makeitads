import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="md:pl-64 pb-20 md:pb-0 min-h-screen">
        {/* pb-20 sur mobile pour ne pas cacher le contenu derrière la MobileNav */}
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
);
}