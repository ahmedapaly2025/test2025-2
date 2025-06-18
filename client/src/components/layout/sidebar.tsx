import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  ClipboardList,
  Users,
  FileText,
  BarChart3,
  Settings,
  Languages,
  History,
  Download,
  Menu,
  Zap
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'nav.dashboard', href: '/', icon: Home },
  { name: 'nav.tasks', href: '/tasks', icon: ClipboardList, badge: '12' },
  { name: 'nav.technicians', href: '/technicians', icon: Users, badge: '8' },
  { name: 'nav.invoices', href: '/invoices', icon: FileText, badge: '5' },
  { name: 'nav.reports', href: '/reports', icon: BarChart3 },
  { name: 'nav.settings', href: '/settings', icon: Settings },
];

const secondaryNavigation = [
  { name: 'nav.translation', href: '/translation', icon: Languages },
  { name: 'nav.history', href: '/history', icon: History },
  { name: 'nav.backup', href: '/backup', icon: Download },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const { t } = useLanguage();

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      <div className={cn(
        "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50",
        "lg:relative lg:translate-x-0",
        isCollapsed ? "w-16 -translate-x-full lg:translate-x-0" : "w-72 translate-x-0"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-sidebar-foreground">TeleBot Manager</h2>
                <p className="text-xs text-sidebar-foreground/60">Dashboard v2.0</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                      !isActive && "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                      isCollapsed && "px-2"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                    {!isCollapsed && (
                      <>
                        <span>{t(item.name as any)}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </Link>
              );
            })}
            
            {/* Separator */}
            <div className="pt-4 mt-4 border-t border-sidebar-border">
              {secondaryNavigation.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start mb-2",
                        isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                        !isActive && "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                        isCollapsed && "px-2"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                      {!isCollapsed && <span>{t(item.name as any)}</span>}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>
        </ScrollArea>
      </div>
    </>
  );
}
