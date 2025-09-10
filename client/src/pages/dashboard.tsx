import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import VideoTestimonials from '@/components/VideoTestimonials';
import CountryFlags from '@/components/CountryFlags';
import { SecurityAuditBadge } from '@/components/SecurityAudit';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useState } from 'react';
import { Activity } from 'lucide-react';

// Price Chart Component
function PriceChartSection() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [timeframe, setTimeframe] = useState('7d');

  // Fetch market data
  const { data: marketData = [] } = useQuery<any[]>({
    queryKey: ['/api/market/prices'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch historical chart data
  const { data: chartData = [] } = useQuery<any[]>({
    queryKey: ['/api/market/history', selectedSymbol, timeframe],
    refetchInterval: 60000, // Refresh every minute
  });

  const supportedCoins = ['BTC', 'ETH', 'BNB', 'TRX', 'SOL', 'USDT'];

  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(6)}`;
    if (price < 100) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toLocaleString()}`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const selectedCoinData = marketData.find((coin: any) => coin.symbol === selectedSymbol);

  return (
    <div className="space-y-6">
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketData.slice(0, 4).map((coin: any) => (
          <div key={coin.symbol} className="p-4 bg-secondary rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{coin.symbol}</p>
                <p className="text-xl font-bold">{formatPrice(coin.price)}</p>
              </div>
              <div className={`flex items-center space-x-1 ${getChangeColor(coin.change24h)}`}>
                {getChangeIcon(coin.change24h)}
                <span className="text-sm font-medium">
                  {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>Vol: {formatVolume(coin.volume24h)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Select Coin</p>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {supportedCoins.map((symbol) => (
                <Button
                  key={symbol}
                  variant={selectedSymbol === symbol ? "default" : "outline"}
                  size="sm"
                  className="justify-start"
                  onClick={() => setSelectedSymbol(symbol)}
                >
                  {symbol}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Timeframe</p>
            <div className="grid grid-cols-2 gap-2">
              {['1d', '7d', '30d', '90d'].map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-semibold">{selectedSymbol} Price Chart</h4>
            {selectedCoinData && (
              <div className={`flex items-center space-x-2 ${getChangeColor(selectedCoinData.change24h)}`}>
                <span className="text-lg font-bold">
                  {formatPrice(selectedCoinData.price)}
                </span>
                <span className="text-sm">
                  ({selectedCoinData.change24h > 0 ? '+' : ''}{selectedCoinData.change24h.toFixed(2)}%)
                </span>
              </div>
            )}
          </div>
          
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#888' }}
                />
                <YAxis 
                  domain={['dataMin', 'dataMax']}
                  tick={{ fontSize: 12, fill: '#888' }}
                  tickFormatter={(value) => formatPrice(value)}
                />
                <Tooltip 
                  formatter={(value: any) => [formatPrice(value), 'Price']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#facc15"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Loading chart data...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  // SEO optimization for dashboard page

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions', user?.id],
    enabled: !!user?.id,
  });

  const { data: wallets, refetch: refetchWallets } = useQuery({
    queryKey: ['/api/wallets', user?.id],
    enabled: !!user?.id,
  });
  
  // Reset balance mutation
  const resetBalanceMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/wallets/${user?.id}/reset`);
    },
    onSuccess: () => {
      toast({
        title: "Balance Reset",
        description: "Your wallet balances have been reset to initial values.",
      });
      refetchWallets();
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reset wallet balances.",
        variant: "destructive",
      });
    },
  });

  // Calculate available balance based on wallet balances
  const calculateBalance = () => {
    // Default total for all cryptos: BTC (3M) + ETH (7M) + USDT (8M) + BNB (4.5M) = $22.5M
    // The wallet balances are stored as the dollar values
    if (wallets && (wallets as any[]).length > 0) {
      const totalBalance = (wallets as any[]).reduce((sum: number, wallet: any) => {
        const balance = parseFloat(wallet.balance || '0');
        return sum + balance;
      }, 0);
      // If we have wallets, return their total
      return totalBalance > 0 ? totalBalance : 22500000;
    }
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
      value: `$${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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
        {/* Reset Balance Button for Admin Users */}
        {(user?.username === 'admin' || user?.username === 'SoftwareHenry') && (
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              onClick={() => resetBalanceMutation.mutate()}
              disabled={resetBalanceMutation.isPending}
              className="bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${resetBalanceMutation.isPending ? 'animate-spin' : ''}`} />
              Reset Wallet Balances
            </Button>
          </div>
        )}
        
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

      {/* Price Charts Section */}
      <div className="mt-8">
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Market Charts</CardTitle>
          </CardHeader>
          <CardContent>
            <PriceChartSection />
          </CardContent>
        </Card>
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