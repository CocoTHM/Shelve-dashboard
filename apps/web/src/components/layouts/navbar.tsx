'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useServerStore } from '@/stores/server-store';
import { getDiscordAvatarUrl } from '@/lib/utils';
import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { selectedServer } = useServerStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  return (
    <div className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Server selector / Breadcrumb */}
      <div className="flex items-center space-x-4">
        {selectedServer && (
          <div className="flex items-center space-x-2">
            {selectedServer.icon && (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://cdn.discordapp.com/icons/${selectedServer.discordId}/${selectedServer.icon}.png`}
                  alt={selectedServer.name}
                />
                <AvatarFallback>{selectedServer.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <span className="font-semibold">{selectedServer.name}</span>
          </div>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={getDiscordAvatarUrl(user.discordId, user.avatar)}
                    alt={user.username}
                  />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block">{user.username}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user.username}</p>
                  {user.email && (
                    <p className="text-xs text-gray-500">{user.email}</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = '/dashboard/settings'}>
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
