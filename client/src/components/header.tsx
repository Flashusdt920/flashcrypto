import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { BoltLogo } from './bolt-logo';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from './MultiLanguage';
import { Bell, Globe, Shield, TrendingUp } from 'lucide-react';

export default function Header() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [location] = useLocation();
  const { t } = useLanguage();
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch(location) {
      case '/home':
      case '/dashboard':
        return 'Executive Dashboard';
      case '/send':
        return 'Transaction Center';
      case '/history':
        return 'Transaction Analytics';
      case '/settings':
        return 'System Configuration';
      case '/admin':
        return 'Administration Panel';
      default:
        return 'Executive Dashboard';
    }
  };

  const getPageDescription = () => {
    switch(location) {
      case '/home':
      case '/dashboard':
        return 'Real-time performance metrics and system analytics';
      case '/send':
        return 'Execute secure flash transactions across networks';
      case '/history':
        return 'Comprehensive transaction history and reporting';
      case '/settings':
        return 'Configure system preferences and security settings';
      case '/admin':
        return 'System administration and user management';
      default:
        return 'Enterprise cryptocurrency platform';
    }
  };

  const { data: transactions = [] } = useQuery({
    queryKey: ['/api/transactions', user?.id],
    enabled: !!user?.id,
  });

  // Calculate available balance based on transactions
  const calculateBalance = () => {
    const initialBalance = 5000000; // Starting balance
    const totalSent = (transactions as any[]).reduce((sum: number, tx: any) => {
      if (tx.status === 'completed') {
        return sum + parseFloat(tx.amount || 0);
      }
      return sum;
    }, 0);
    return initialBalance - totalSent;
  };

  return (
    <header className="enterprise-header px-4 sm:px-6 py-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-600/10"></div>
      </div>
      
      <div className="relative z-10">
        {/* Top Section */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {getPageTitle()}
              </h1>
              <div className="hidden sm:flex items-center gap-2">
                <Shield className="w-4 h-4 text-yellow-500" />
                <span className="text-[10px] text-yellow-500 uppercase tracking-wider font-medium">
                  Enterprise
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
              {getPageDescription()}
            </p>
          </div>
          
          {/* Right Section - Stats & Actions */}
          <div className="flex items-start gap-3">
            {/* Notifications */}
            <button className="hidden sm:flex relative p-2.5 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 group">
              <Bell className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            </button>
            
            {/* Global Network */}
            <button className="hidden sm:flex p-2.5 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 group">
              <Globe className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
            </button>
            
            <ThemeToggle />
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-yellow-500/10">
          <div className="flex items-center gap-6">
            {/* Balance Display - Hidden on Mobile */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/5">
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Portfolio Value</p>
                <p className="text-lg sm:text-xl font-bold text-green-500 gold-text-glow">
                  ${calculateBalance().toLocaleString()}.00
                </p>
              </div>
            </div>
            
            {/* Network Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20">
              <div className="status-online"></div>
              <span className="text-xs text-green-400 font-medium">All Systems Operational</span>
            </div>
          </div>
          
          {/* User Profile - Responsive */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Current Session</p>
              <p className="text-sm font-semibold text-yellow-500">
                {user?.username}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 flex items-center justify-center border border-yellow-500/20">
              <span className="text-xs sm:text-sm font-bold text-yellow-500">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}