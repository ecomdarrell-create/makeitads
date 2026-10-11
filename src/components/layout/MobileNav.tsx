'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Plus,
  BarChart3,
  Coins,
  Crown,
  Gift,
  User,
} from 'lucide-react';

const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/sign-up',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/auth',
];

const items = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: Plus },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Credits', href: '/dashboard/credits', icon: Coins },
  { name: 'Plan', href: '/dashboard/pricing', icon: Crown },
  { name: 'Parrainage', href: '/dashboard/referral', icon: Gift },
  { name: 'Settings', href: '/dashboard/settings', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  const isAuthPage = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isAuthPage) return null;

  return (
    <nav
      className="md:hidden fixed left-2 right-2 z-40"
      style={{ bottom: 'max(12px, env(safe-area-inset-bottom))' }}
      aria-label="Navigation principale"
    >
      {/* ✅ Hauteur 48px (h-12) identique à la navbar, coins pilule préservés */}
      <div
        className="h-12 rounded-full bg-white px-1.5 flex items-center"
        style={{
          boxShadow:
            '0 4px 20px rgba(15, 23, 42, 0.10), 0 1px 2px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div className="flex w-full items-center justify-around">
          {items.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                aria-label={item.name}
                className="relative flex items-center justify-center rounded-full p-2 transition-colors duration-150"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.14) 0%, rgba(139,92,246,0.14) 100%)'
                    : 'transparent',
                }}
              >
                {/* ✅ Icône 22px + trait plus épais (strokeWidth 2.8 / 2.2) */}
                <Icon
                  className="relative h-[22px] w-[22px] transition-colors duration-150"
                  strokeWidth={isActive ? 2.8 : 2.2}
                  style={{
                    color: isActive ? '#6366F1' : '#0F172A',
                  }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}