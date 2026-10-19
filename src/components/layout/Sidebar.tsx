'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Plus, BarChart3, Coins, Crown, Gift, User, Shield, TrendingUp } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';

const navItems = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: Plus },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Credits', href: '/dashboard/credits', icon: Coins },
  { name: 'Plan', href: '/dashboard/pricing', icon: Crown },
  { name: 'Parrainage', href: '/dashboard/referral', icon: Gift },
  { name: 'Settings', href: '/dashboard/settings', icon: User },
];

const adminItems = [
  { name: 'Admin', href: '/dashboard/admin', icon: Shield },
  { name: 'Revenus', href: '/dashboard/admin/revenue', icon: TrendingUp },
];

const AUTH_ROUTES = ['/login', '/signup', '/sign-up', '/register', '/forgot-password', '/reset-password', '/auth'];

export function Sidebar() {
  const pathname = usePathname();
  const isAdmin = useIsAdmin();

  const isAuthPage = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (isAuthPage) return null;

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-3.5rem)] fixed left-0 top-14 bg-white border-r border-gray-200 z-30">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          <span className="text-[#111827]">MakeIt</span>
          <span className="text-[#6366F1]">Ads</span>
        </Link>
      </div>

      <nav 
        className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overscroll-y-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg touch-manipulation"
            >
              {/* ✅ HALO GLISSANT PRINCIPAL */}
              {isActive && (
                <motion.div
                  layoutId="active-halo-desktop"
                  className="absolute inset-0 rounded-lg bg-indigo-50"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              
              <item.icon className={`relative z-10 w-4 h-4 transition-colors duration-150 ${isActive ? 'text-[#6366F1]' : 'text-gray-400'}`} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="pt-4 pb-2 px-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Admin</p>
            </div>
            {adminItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg touch-manipulation"
                >
                  {/* ✅ HALO GLISSANT ADMIN (layoutId différent pour éviter les conflits) */}
                  {isActive && (
                    <motion.div
                      layoutId="active-halo-admin"
                      className="absolute inset-0 rounded-lg bg-amber-50"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  
                  <item.icon className={`relative z-10 w-4 h-4 transition-colors duration-150 ${isActive ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-[#F9FAFB] rounded-lg p-3 border border-gray-200">
          <p className="text-xs font-medium text-gray-900">Besoin d&apos;aide ?</p>
          <p className="text-xs text-gray-500 mt-1 mb-2">Consultez nos ressources ou contactez le support.</p>
          <a href="mailto:support@makeitads.pro" className="inline-flex items-center text-[11px] font-medium text-[#6366F1] hover:text-[#5558e6] transition-colors duration-150">
            Contacter le support
          </a>
        </div>
      </div>
    </aside>
  );
}