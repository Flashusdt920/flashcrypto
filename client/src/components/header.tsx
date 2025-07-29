import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { BoltLogo } from './bolt-logo';

export default function Header() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

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
    <header className={`glass-card border-b border-gray-700 p-4 ${isMobile ? 'mt-16' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold truncate">Dashboard</h2>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Welcome back to Bolt Crypto Flasher</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <BoltLogo size={20} className="hidden sm:block" />
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full pulse-animation"></div>
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Online</span>
          </div>
          
          <div className="text-right">
            <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-24 sm:max-w-none">
              {isMobile ? user?.username : `Welcome, ${user?.username}`}
            </p>
            <p className="text-sm sm:text-lg font-bold text-green-500 balance-glow">
              ${calculateBalance().toLocaleString()}.00
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}