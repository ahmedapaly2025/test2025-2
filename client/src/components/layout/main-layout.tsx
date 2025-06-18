import { useState, useEffect } from 'react';
import { ReactNode } from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggle={handleToggle} />
      <Topbar onSidebarToggle={handleToggle} isCollapsed={isCollapsed} />
      
      <main className={cn(
        "pt-16 transition-all duration-300",
        "lg:ml-72", // Always show full width on large screens
        isCollapsed ? "ml-0" : "ml-0" // No margin on mobile when collapsed
      )}>
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
