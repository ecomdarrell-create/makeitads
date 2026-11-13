'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Plus, Coins, Crown, BookOpen, Gift, User } from 'lucide-react';
import { useEffect } from 'react';

const AUTH_ROUTES = ['/login', '/signup', '/sign-up', '/register', '/forgot-password', '/reset-password', '/auth'];

const items = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: Plus },
  { name: 'Crédits', href: '/dashboard/credits', icon: Coins },
  { name: 'Tarifs', href: '/dashboard/pricing', icon: Crown },
  { name: 'À la une', href: '/insights', icon: BookOpen },
  { name: 'Parrainage', href: '/dashboard/referral', icon: Gift },
  { name: 'Profil', href: '/dashboard/settings', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  useEffect(() => {
    items.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  if (isAuthPage) return null;

  return (
    <nav
      className="md:hidden fixed left-2 right-2 z-40"
      style={{ bottom: 'max(12px, env(safe-area-inset-bottom))' }}
      aria-label="Navigation principale"
    >
      <div
        className="h-12 rounded-full bg-white px-1.5 flex items-center"
        style={{ boxShadow: '0 4px 20px rgba(15, 23, 42, 0.10), 0 1px 2px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.04)' }}
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
                className="relative flex items-center justify-center rounded-full p-2 touch-manipulation"
              >
                {/* ✅ Halo instantané (CSS au lieu de Framer Motion) */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-full transition-opacity duration-100 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(139,92,246,0.14))',
                  }}
                />
                <Icon
                  className={`relative z-10 h-[22px] w-[22px] transition-colors duration-75 ${
                    isActive ? 'text-[#6366F1]' : 'text-[#0F172A]'
                  }`}
                  strokeWidth={isActive ? 2.8 : 2.2}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}