import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface FeeBreakdown {
  amount: number;
  networkFee: number;
  flashFee: number;
  serviceFee: number;
  total: number;
  estimatedTime: string;
}

export default function TransactionCalculator() {
  const [amount, setAmount] = useState('100');
  const [network, setNetwork] = useState('BTC');
  const [breakdown, setBreakdown] = useState<FeeBreakdown | null>(null);

  const networkFees = {
    BTC: { network: 0.0005, flash: 0.15, service: 0.02, time: '10-30 mins' },
    ETH: { network: 0.003, flash: 0.12, service: 0.02, time: '2-5 mins' },
    USDT: { network: 0.001, flash: 0.10, service: 0.01, time: '1-3 mins' },
    BNB: { network: 0.0008, flash: 0.08, service: 0.01, time: '1-2 mins' },
    TRX: { network: 0.0001, flash: 0.05, service: 0.01, time: '30-60 secs' }
  };

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const amountNum = parseFloat(amount);
      const fees = networkFees[network as keyof typeof networkFees];
      
      const networkFee = amountNum * fees.network;
      const flashFee = amountNum * fees.flash;
      const serviceFee = amountNum * fees.service;
      const total = amountNum + networkFee + flashFee + serviceFee;

      setBreakdown({
        amount: amountNum,
        networkFee,
        flashFee,
        serviceFee,
        total,
        estimatedTime: fees.time
      });
    } else {
      setBreakdown(null);
    }
  }, [amount, network]);

  return (
    <Card className="bg-black/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Calculator className="w-5 h-5 text-purple-400" />
          Transaction Fee Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="calc-amount" className="text-white">Amount</Label>
            <Input
              id="calc-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calc-network" className="text-white">Network</Label>
            <Select value={network} onValueChange={setNetwork}>
              <SelectTrigger id="calc-network" className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="USDT">Tether (USDT)</SelectItem>
                <SelectItem value="BNB">Binance (BNB)</SelectItem>
                <SelectItem value="TRX">Tron (TRX)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {breakdown && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Transaction Amount:</span>
              <span className="text-white font-semibold">{breakdown.amount} {network}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Network Fee:</span>
              <span className="text-yellow-400">+{breakdown.networkFee.toFixed(6)} {network}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Flash Fee (15%):</span>
              <span className="text-orange-400">+{breakdown.flashFee.toFixed(6)} {network}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Service Fee:</span>
              <span className="text-purple-400">+{breakdown.serviceFee.toFixed(6)} {network}</span>
            </div>
            
            <div className="border-t border-purple-500/30 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total Cost:</span>
                <span className="text-2xl font-bold text-purple-400">
                  {breakdown.total.toFixed(6)} {network}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">
                  Estimated Time: <Badge variant="outline" className="ml-1">{breakdown.estimatedTime}</Badge>
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="text-xs text-gray-500 flex items-start gap-1">
          <TrendingUp className="w-3 h-3 mt-0.5" />
          <span>Fees are subject to network conditions and may vary slightly at transaction time</span>
        </div>
      </CardContent>
    </Card>
  );
}