import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/use-language';
import { useAudioNotifications } from '@/hooks/use-audio-notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Search,
  Bell,
  Globe,
  ChevronDown,
  Menu,
  Volume2,
  VolumeX,
  LogOut
} from 'lucide-react';

interface TopbarProps {
  onSidebarToggle: () => void;
  isCollapsed: boolean;
}

export default function Topbar({ onSidebarToggle, isCollapsed }: TopbarProps) {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { isEnabled: audioEnabled, toggleAudio } = useAudioNotifications();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications/unread'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.reload();
  };

  return (
    <div className={cn(
      "fixed top-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border z-40 transition-all duration-300",
      isCollapsed ? "left-16" : "left-280"
    )}>
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:flex items-center space-x-2 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Audio Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAudio}
            className="text-muted-foreground hover:text-foreground"
          >
            {audioEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </Button>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="space-x-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {currentLanguage.toUpperCase()}
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className="flex items-center space-x-2"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs notification-dot"
                  >
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">{t('dashboard.notifications')}</h4>
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No new notifications</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification: any) => (
                      <div
                        key={notification.id}
                        className="p-2 bg-muted rounded-lg text-sm"
                      >
                        <p className="font-medium">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">{t('user.role')}</p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="gradient-bg text-white">
                    AU
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('user.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
