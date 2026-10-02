'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Layers, Coins, User } from 'lucide-react';

const mobileNavItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Generate', href: '/dashboard/generate', icon: PlusCircle },
  { name: 'Strategies', href: '/dashboard/strategies', icon: Layers },
  { name: 'Credits', href: '/dashboard/credits', icon: Coins },
  { name: 'Profile', href: '/dashboard/settings', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-40">
      <div className="flex items-center justify-around h-14">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
                isActive ? 'text-[#6366F1]' : 'text-gray-400'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[9px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}