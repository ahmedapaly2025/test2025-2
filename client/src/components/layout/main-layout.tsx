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
        // Responsive margins based on sidebar state
        isCollapsed 
          ? "ml-0 lg:ml-16" // No margin on mobile, small margin on desktop when collapsed
          : "ml-0 lg:ml-72"  // No margin on mobile, full margin on desktop when expanded
      )}>
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
