import { useAuth } from '@/hooks/use-auth';

import { useIsMobile } from '@/hooks/use-mobile';

export default function Header() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className={`glass-card border-b border-gray-700 p-4 ${isMobile ? 'mt-16' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold truncate">Dashboard</h2>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Welcome back to your crypto gateway</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full pulse-animation"></div>
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Online</span>
          </div>
          
          <div className="text-right">
            <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-24 sm:max-w-none">
              {isMobile ? user?.username : `Welcome, ${user?.username}`}
            </p>
            <p className="text-sm sm:text-lg font-bold text-green-500 balance-glow">$5,000,000.00</p>
          </div>
        </div>
      </div>
    </header>
  );
}