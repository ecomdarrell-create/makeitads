'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Layers,
  Coins,
  User,
  BadgeDollarSign,
} from 'lucide-react';

const mobileNavItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Generate', href: '/dashboard/generate', icon: PlusCircle },
  { name: 'Strategies', href: '/dashboard/strategies', icon: Layers },
  { name: 'Credits', href: '/dashboard/credits', icon: Coins },
  { name: 'Plans', href: '/dashboard/pricing', icon: BadgeDollarSign },
  { name: 'Profile', href: '/dashboard/settings', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed left-3 right-3 z-40"
      style={{
        bottom: 'max(12px, env(safe-area-inset-bottom))',
      }}
      aria-label="Navigation principale"
    >
      <div className="rounded-full border border-gray-100 bg-white/95 px-2 py-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="flex items-center justify-around">
          {mobileNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-label={item.name}
                className={`relative flex flex-col items-center justify-center gap-0.5 rounded-full px-2.5 py-1.5 transition-all duration-200 ${
                  isActive
                    ? 'text-[#6366F1]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-all ${
                    isActive ? 'stroke-[2.5px]' : 'stroke-2'
                  }`}
                />
                <span
                  className={`text-[9px] leading-none ${
                    isActive ? 'font-semibold' : 'font-medium'
                  }`}
                >
                  {item.name}
                </span>

                {/* Point actif sous l'icône */}
                {isActive && (
                  <span className="absolute -bottom-0.5 h-0.5 w-4 rounded-full bg-[#6366F1]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}