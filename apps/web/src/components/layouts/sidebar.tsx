'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  History,
  Mic,
  UserCog,
  Users,
  Calendar,
  MessageSquare,
  Ticket,
  Settings,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Logs',
    href: '/dashboard/logs',
    icon: History,
  },
  {
    name: 'Présence Vocale',
    href: '/dashboard/presence',
    icon: Mic,
  },
  {
    name: 'Services',
    href: '/dashboard/services',
    icon: UserCog,
  },
  {
    name: 'Rôles',
    href: '/dashboard/roles',
    icon: Users,
  },
  {
    name: 'Calendrier',
    href: '/dashboard/calendar',
    icon: Calendar,
  },
  {
    name: 'Chat',
    href: '/dashboard/chat',
    icon: MessageSquare,
  },
  {
    name: 'Tickets',
    href: '/dashboard/tickets',
    icon: Ticket,
  },
  {
    name: 'Paramètres',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold">Discord Dashboard</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-4">
        <p className="text-xs text-gray-400">
          © 2026 Discord Dashboard
        </p>
      </div>
    </div>
  );
}
