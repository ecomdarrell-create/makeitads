'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Plus,
  BarChart3,
  Coins,
  BadgeDollarSign,
  Gift,
  User,
} from 'lucide-react';

const navItems = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: Plus },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Credits', href: '/dashboard/credits', icon: Coins },
  { name: 'Parrainage', href: '/dashboard/referral', icon: Gift },
  { name: 'Settings', href: '/dashboard/settings', icon: User },
];

// ✅ Routes sur lesquelles la sidebar NE doit PAS s'afficher
const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/sign-up',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/auth',
];

export function Sidebar() {
  const pathname = usePathname();

  // ✅ Sécurité : ne jamais afficher la sidebar sur les pages d'auth
  const isAuthPage = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isAuthPage) return null;

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-3.5rem)] fixed left-0 top-14 bg-white border-r border-gray-200 z-30">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          <span className="text-[#111827]">MakeIt</span>
          <span className="text-[#6366F1]">Ads</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 text-[#6366F1]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#111827]'
              }`}
            >
              <item.icon
                className={`w-4 h-4 ${isActive ? 'text-[#6366F1]' : 'text-gray-400'}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-[#F9FAFB] rounded-lg p-3 border border-gray-200">
          <p className="text-xs font-medium text-gray-900">Besoin d&apos;aide ?</p>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Consultez nos ressources ou contactez le support.
          </p>
          <a
            href="https://t.me/MakeitAds_CEO"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-[11px] font-medium text-[#6366F1] hover:text-[#5558e6]"
          >
            Contacter via Telegram
          </a>
        </div>
      </div>
    </aside>
  );
}