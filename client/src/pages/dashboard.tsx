import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { user } = useAuth();

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions', user?.id],
    enabled: !!user?.id,
  });

  const { data: wallets } = useQuery({
    queryKey: ['/api/wallets', user?.id],
    enabled: !!user?.id,
  });

  const statsCards = [
    {
      icon: '💰',
      title: 'Total Balance',
      value: '$5,000,000',
      change: '+12.5%',
      positive: true,
    },
    {
      icon: '📈',
      title: 'Active Transactions',
      value: transactions.length.toString(),
      change: '+8.2%',
      positive: true,
    },
    {
      icon: '⚡',
      title: 'Gas Fees Paid',
      value: '0.024 ETH',
      change: '-2.1%',
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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <Card key={index} className="glass-card border-0 crypto-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{card.icon}</div>
                <div className={`text-sm ${card.positive ? 'text-green-500' : 'text-yellow-500'}`}>
                  {card.change}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
              <p className={`text-2xl font-bold ${
                card.title === 'Total Balance' ? 'text-green-500' : 
                card.title === 'Active Transactions' ? 'text-accent' :
                card.title === 'Gas Fees Paid' ? 'text-yellow-500' : 'text-white'
              }`}>
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card border-0">
            <CardContent className="p-6">
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
                ) : transactions.length > 0 ? (
                  transactions.slice(0, 3).map((tx: any) => (
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
    </div>
  );
}