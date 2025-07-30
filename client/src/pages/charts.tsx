import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  timestamp: number;
}

interface ChartData {
  timestamp: number;
  price: number;
  date: string;
}

export default function Charts() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [timeframe, setTimeframe] = useState('7d');

  // Fetch market data
  const { data: marketData = [] } = useQuery<MarketData[]>({
    queryKey: ['/api/market/prices'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch historical chart data
  const { data: chartData = [] } = useQuery<ChartData[]>({
    queryKey: ['/api/market/history', selectedSymbol, timeframe],
    refetchInterval: 60000, // Refresh every minute
  });

  const supportedCoins = ['BTC', 'ETH', 'BNB', 'TRX', 'SOL', 'USDT'];

  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(6)}`;
    if (price < 100) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
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

  const selectedCoinData = marketData.find(coin => coin.symbol === selectedSymbol);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Market Charts</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Real-time cryptocurrency market data
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketData.slice(0, 4).map((coin) => (
          <Card key={coin.symbol} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{coin.symbol}</p>
                  <p className="text-2xl font-bold">{formatPrice(coin.price)}</p>
                </div>
                <div className={`flex items-center space-x-1 ${getChangeColor(coin.change24h)}`}>
                  {getChangeIcon(coin.change24h)}
                  <span className="text-sm font-medium">
                    {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Volume</span>
                  <span className="font-medium">{formatVolume(coin.volume24h)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Market Cap</span>
                  <span className="font-medium">{formatMarketCap(coin.marketCap)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Select Cryptocurrency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {supportedCoins.map((symbol) => (
                <Button
                  key={symbol}
                  variant={selectedSymbol === symbol ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setSelectedSymbol(symbol)}
                >
                  {symbol}
                </Button>
              ))}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Timeframe</p>
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
          </CardContent>
        </Card>

        {/* Price Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{selectedSymbol} Price Chart</span>
              {selectedCoinData && (
                <div className={`flex items-center space-x-1 ${getChangeColor(selectedCoinData.change24h)}`}>
                  {getChangeIcon(selectedCoinData.change24h)}
                  <span className="text-lg font-bold">
                    {formatPrice(selectedCoinData.price)}
                  </span>
                  <span className="text-sm">
                    ({selectedCoinData.change24h > 0 ? '+' : ''}{selectedCoinData.change24h.toFixed(2)}%)
                  </span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={['dataMin', 'dataMax']}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatPrice(value)}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatPrice(value), 'Price']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#8884d8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-400 text-gray-500">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Loading chart data...</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Market Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Market Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">
                {formatMarketCap(marketData.reduce((sum, coin) => sum + coin.marketCap, 0))}
              </p>
              <p className="text-sm text-gray-500">Total Market Cap</p>
            </div>
            <div className="text-center">
              <Activity className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">
                {formatVolume(marketData.reduce((sum, coin) => sum + coin.volume24h, 0))}
              </p>
              <p className="text-sm text-gray-500">24h Volume</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{marketData.length}</p>
              <p className="text-sm text-gray-500">Tracked Assets</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}