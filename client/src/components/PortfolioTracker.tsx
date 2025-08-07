import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  allocation: number;
  color: string;
}

interface PortfolioData {
  totalValue: number;
  totalChange24h: number;
  totalChangePercent: number;
  assets: Asset[];
}

const mockChartData = [
  { time: '00:00', value: 45000 },
  { time: '04:00', value: 46500 },
  { time: '08:00', value: 44800 },
  { time: '12:00', value: 47200 },
  { time: '16:00', value: 48900 },
  { time: '20:00', value: 50250 },
  { time: 'Now', value: 51234 },
];

export function PortfolioTracker() {
  const [timeframe, setTimeframe] = useState('24h');
  const [portfolioData] = useState<PortfolioData>({
    totalValue: 51234.56,
    totalChange24h: 2847.32,
    totalChangePercent: 5.89,
    assets: [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        balance: 0.85,
        value: 25617.30,
        change24h: 3.45,
        allocation: 50,
        color: '#F7931A',
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 5.23,
        value: 15370.45,
        change24h: 7.82,
        allocation: 30,
        color: '#627EEA',
      },
      {
        symbol: 'USDT',
        name: 'Tether',
        balance: 5000,
        value: 5000.00,
        change24h: 0.01,
        allocation: 10,
        color: '#26A17B',
      },
      {
        symbol: 'BNB',
        name: 'Binance Coin',
        balance: 12.5,
        value: 3123.75,
        change24h: -2.34,
        allocation: 6,
        color: '#F3BA2F',
      },
      {
        symbol: 'TRX',
        name: 'Tron',
        balance: 25000,
        value: 2123.06,
        change24h: 4.56,
        allocation: 4,
        color: '#FF0013',
      },
    ],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <PieChart className="w-7 h-7 text-purple-400" />
            Portfolio Tracker
          </h2>
          <p className="text-gray-400 mt-1">Monitor your crypto holdings in real-time</p>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex gap-2">
          {['1h', '24h', '7d', '30d', '1y'].map((tf) => (
            <Button
              key={tf}
              size="sm"
              variant={timeframe === tf ? 'default' : 'outline'}
              onClick={() => setTimeframe(tf)}
              className={timeframe === tf ? 'bg-purple-600' : ''}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      {/* Portfolio Value Card */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Portfolio Value</p>
            <p className="text-4xl font-bold text-white mt-1">
              ${portfolioData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2 mt-3">
              {portfolioData.totalChange24h > 0 ? (
                <>
                  <ArrowUpRight className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">
                    +${portfolioData.totalChange24h.toFixed(2)} ({portfolioData.totalChangePercent.toFixed(2)}%)
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-medium">
                    ${portfolioData.totalChange24h.toFixed(2)} ({portfolioData.totalChangePercent.toFixed(2)}%)
                  </span>
                </>
              )}
              <span className="text-gray-500 text-sm">24h</span>
            </div>
          </div>
          
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Activity className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>
      </Card>

      {/* Chart and Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2 bg-black/50 border-purple-500/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Area type="monotone" dataKey="value" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Allocation Chart */}
        <Card className="bg-black/50 border-purple-500/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Allocation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie
                data={portfolioData.assets}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="allocation"
              >
                {portfolioData.assets.map((asset, index) => (
                  <Cell key={`cell-${index}`} fill={asset.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          
          <div className="space-y-2 mt-4">
            {portfolioData.assets.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-sm text-gray-400">{asset.symbol}</span>
                </div>
                <span className="text-sm text-white font-medium">{asset.allocation}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Asset List */}
      <Card className="bg-black/50 border-purple-500/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Holdings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 text-sm font-medium pb-3">Asset</th>
                <th className="text-right text-gray-400 text-sm font-medium pb-3">Balance</th>
                <th className="text-right text-gray-400 text-sm font-medium pb-3">Value</th>
                <th className="text-right text-gray-400 text-sm font-medium pb-3">24h Change</th>
                <th className="text-right text-gray-400 text-sm font-medium pb-3">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.assets.map((asset) => (
                <tr key={asset.symbol} className="border-b border-gray-800">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: asset.color + '33' }}
                      >
                        {asset.symbol[0]}
                      </div>
                      <div>
                        <p className="text-white font-medium">{asset.symbol}</p>
                        <p className="text-gray-400 text-xs">{asset.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right">
                    <p className="text-white">{asset.balance.toLocaleString()}</p>
                  </td>
                  <td className="text-right">
                    <p className="text-white font-medium">${asset.value.toLocaleString()}</p>
                  </td>
                  <td className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {asset.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{Math.abs(asset.change24h).toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={asset.allocation} className="w-16 h-2" />
                      <span className="text-gray-400 text-sm w-10 text-right">{asset.allocation}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/50 border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Best Performer</p>
              <p className="text-white font-semibold">ETH</p>
              <p className="text-green-400 text-sm">+7.82%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        
        <Card className="bg-black/50 border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Worst Performer</p>
              <p className="text-white font-semibold">BNB</p>
              <p className="text-red-400 text-sm">-2.34%</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
        </Card>
        
        <Card className="bg-black/50 border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Assets</p>
              <p className="text-white font-semibold">5</p>
              <p className="text-purple-400 text-sm">Diversified</p>
            </div>
            <PieChart className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
        
        <Card className="bg-black/50 border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Risk Level</p>
              <p className="text-white font-semibold">Medium</p>
              <p className="text-yellow-400 text-sm">Balanced</p>
            </div>
            <Activity className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
      </div>
    </div>
  );
}