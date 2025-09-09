import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '@/components/SEOHead';
import VideoTestimonials from '@/components/VideoTestimonials';
import CountryFlags from '@/components/CountryFlags';
import { SecurityAuditBadge } from '@/components/SecurityAudit';

export default function Dashboard() {
  const { user } = useAuth();

  // SEO optimization for dashboard page

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions', user?.id],
    enabled: !!user?.id,
  });

  const { data: wallets } = useQuery({
    queryKey: ['/api/wallets', user?.id],
    enabled: !!user?.id,
  });

  // Calculate available balance based on wallet balances
  const calculateBalance = () => {
    // Sum up all wallet balances
    if (wallets && (wallets as any[]).length > 0) {
      const totalBalance = (wallets as any[]).reduce((sum: number, wallet: any) => {
        return sum + parseFloat(wallet.balance || 0);
      }, 0);
      return totalBalance;
    }
    // Default total for all cryptos: BTC (3M) + ETH (7M) + USDT (8M) + BNB (4.5M)
    return 22500000;
  };

  // Calculate total flash fees paid
  const calculateFlashFeesPaid = () => {
    const feePerTransaction = 0.019; // ETH per transaction
    const completedTransactions = (transactions as any[]).filter((tx: any) => tx.status === 'completed' && tx.gasFeePaid);
    return (completedTransactions.length * feePerTransaction).toFixed(3);
  };

  const currentBalance = calculateBalance();
  const flashFeesPaid = calculateFlashFeesPaid();

  const statsCards = [
    {
      icon: '💰',
      title: 'Available Balance',
      value: `$${currentBalance.toLocaleString()}`,
      change: wallets && (wallets as any[]).length > 0 ? `${(wallets as any[]).length} wallets` : '4 wallets',
      positive: currentBalance > 0,
    },
    {
      icon: '📈',
      title: 'Total Transactions',
      value: (transactions as any[]).length.toString(),
      change: (transactions as any[]).filter((tx: any) => tx.status === 'completed').length + ' completed',
      positive: true,
    },
    {
      icon: '⚡',
      title: 'Flash Fees Paid',
      value: `${flashFeesPaid} ETH`,
      change: `${(transactions as any[]).filter((tx: any) => tx.gasFeePaid).length} payments`,
      positive: false,
    },
    {
      icon: '🌐',
      title: 'Networks',
      value: 'Multi-Chain',
      change: '4 Networks',
      positive: true,
    },
  ];

  const networkStatus = [
    { name: 'Bitcoin', status: 'Online', color: 'bg-green-500' },
    { name: 'Ethereum', status: 'Online', color: 'bg-green-500' },
    { name: 'BSC', status: 'Online', color: 'bg-green-500' },
    { name: 'Tron', status: 'Slow', color: 'bg-yellow-500' },
  ];

  return (
    <>
      <SEOHead 
        title="⚡ Dashboard - Bolt Crypto Flasher"
        description="Monitor your cryptocurrency flash transactions, track balances, and manage your crypto portfolio. Real-time analytics for Bitcoin, USDT, Ethereum, and BNB transactions."
        canonical="/dashboard"
        ogImage="/dashboard-preview.png"
      />
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {statsCards.map((card, index) => (
          <Card key={index} className="glass-card border-0 crypto-glow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="text-xl sm:text-2xl">{card.icon}</div>
                <div className={`text-xs sm:text-sm ${card.positive ? 'text-green-500' : 'text-yellow-500'}`}>
                  {card.change}
                </div>
              </div>
              <h3 className="text-sm sm:text-lg font-semibold mb-1 leading-tight">{card.title}</h3>
              <p className={`text-lg sm:text-2xl font-bold ${
                card.title === 'Available Balance' ? 'text-green-500' : 
                card.title === 'Total Transactions' ? 'text-accent' :
                card.title === 'Flash Fees Paid' ? 'text-yellow-500' : 'text-white'
              }`}>
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card border-0">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {transactionsLoading ? (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (transactions as any[]).length > 0 ? (
                  (transactions as any[]).slice(0, 3).map((tx: any) => (
                    <div key={tx.id} className="transaction-card flex items-center justify-between p-4 bg-secondary rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          tx.status === 'completed' ? 'bg-green-500 bg-opacity-20' : 'bg-yellow-500 bg-opacity-20'
                        }`}>
                          <i className={`fas fa-arrow-up ${
                            tx.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                          }`}></i>
                        </div>
                        <div>
                          <p className="font-medium">{tx.token} Transfer</p>
                          <p className="text-sm text-muted-foreground">
                            To: {tx.toAddress.substring(0, 10)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          tx.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                        }`}>
                          {tx.amount} {tx.token}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Network Status</h3>
              <div className="space-y-4">
                {networkStatus.map((network) => (
                  <div key={network.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${network.color} rounded-full ${
                        network.status === 'Slow' ? 'pulse-animation' : ''
                      }`}></div>
                      <span>{network.name}</span>
                    </div>
                    <span className={`text-sm ${
                      network.status === 'Online' ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                      {network.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Enhanced Features Section */}
      <div className="mt-8 space-y-6">
        {/* Security Audit Badge */}
        <SecurityAuditBadge />
        
        {/* Video Testimonials */}
        <VideoTestimonials />
        
        {/* Global Presence */}
        <CountryFlags />
      </div>
      </div>
    </>
  );
}