'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Plus,
  BarChart3,
  Coins,
  Gift,
  User,
} from 'lucide-react';

const mobileNavItems = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: Plus },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Credits', href: '/dashboard/credits', icon: Coins },
  { name: 'Parrainage', href: '/dashboard/referral', icon: Gift },
  { name: 'Settings', href: '/dashboard/settings', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed left-3 right-3 z-40"
      style={{ bottom: 'max(12px, env(safe-area-inset-bottom))' }}
      aria-label="Navigation principale"
    >
      <div
        className="rounded-full bg-white px-1 py-1"
        style={{
          boxShadow:
            '0 4px 20px rgba(15, 23, 42, 0.10), 0 1px 2px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div className="flex items-center justify-around">
          {mobileNavItems.map((item) => {
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
                aria-label={item.name}
                className="relative flex items-center justify-center rounded-full p-2.5"
              >
                {isActive && (
                  <motion.span
                    layoutId="mobile-nav-halo"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(99,102,241,0.14) 0%, rgba(139,92,246,0.14) 100%)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 32,
                      mass: 0.8,
                    }}
                  />
                )}

                <Icon
                  className="relative h-[20px] w-[20px] transition-colors duration-200"
                  strokeWidth={isActive ? 2.4 : 1.9}
                  style={{
                    color: isActive ? '#6366F1' : '#18181B',
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