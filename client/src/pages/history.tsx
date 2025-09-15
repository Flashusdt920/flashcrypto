import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function History() {
  const { user } = useAuth();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['/api/transactions', user?.id],
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-green-500';
      case 'pending':
        return 'bg-yellow-500 text-yellow-500';
      case 'failed':
        return 'bg-red-500 text-red-500';
      default:
        return 'bg-gray-500 text-gray-500';
    }
  };

  const getTransactionIcon = (token: string) => {
    switch (token) {
      case 'BTC':
        return 'fas fa-bitcoin';
      case 'ETH':
        return 'fab fa-ethereum';
      case 'USDT':
        return 'fas fa-dollar-sign';
      case 'BNB':
        return 'fas fa-coins';
      default:
        return 'fas fa-coins';
    }
  };

  return (
    <Card className="glass-card border-0">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
          <h3 className="text-lg sm:text-xl font-semibold">Transaction History</h3>
          <div className="flex flex-wrap gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="bg-secondary border-gray-600 w-[120px] sm:w-auto min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="gas">Gas Payments</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="30days">
              <SelectTrigger className="bg-secondary border-gray-600 w-[120px] sm:w-auto min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="today">Today</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-secondary rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : transactions.length > 0 ? (
            transactions.map((tx: any) => (
              <div key={tx.id} className="transaction-card bg-secondary rounded-lg p-3 sm:p-4 border border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getStatusColor(tx.status)} bg-opacity-20 rounded-full flex items-center justify-center`}>
                      <i className={`${getTransactionIcon(tx.token)} ${getStatusColor(tx.status).split(' ')[1]} text-sm sm:text-base`}></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm sm:text-base">{tx.token} Transfer</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{tx.network} Network</p>
                      <p className="text-xs text-muted-foreground truncate">
                        TX: {tx.txHash?.substring(0, 16)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2">
                    <p className={`font-bold ${getStatusColor(tx.status).split(' ')[1]}`}>
                      {tx.amount} {tx.token}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                    <span className={`inline-block ${getStatusColor(tx.status)} bg-opacity-20 px-2 py-1 rounded text-xs capitalize`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <i className="fas fa-history text-4xl mb-4 opacity-50"></i>
              <p className="text-lg">No transactions found</p>
              <p className="text-sm">Your transaction history will appear here</p>
            </div>
          )}
        </div>

        {transactions.length > 0 && (
          <div className="flex justify-center mt-6">
            <Button variant="secondary" className="bg-secondary hover:bg-gray-600">
              Load More Transactions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
