import { useState } from 'react';
import { Clock, Calendar, Repeat, Play, Pause, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface ScheduledTransaction {
  id: string;
  recipient: string;
  amount: string;
  network: string;
  scheduledDate: Date;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

export default function TransactionScheduler() {
  const [scheduledTx, setScheduledTx] = useState<ScheduledTransaction[]>([
    {
      id: '1',
      recipient: '1A2B3C4D5E6F7G8H9I0J',
      amount: '0.5',
      network: 'BTC',
      scheduledDate: new Date(Date.now() + 86400000),
      frequency: 'once',
      status: 'pending'
    },
    {
      id: '2',
      recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      amount: '100',
      network: 'USDT',
      scheduledDate: new Date(Date.now() + 172800000),
      frequency: 'weekly',
      status: 'active'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    network: 'BTC',
    date: '',
    time: '',
    frequency: 'once'
  });

  const { toast } = useToast();

  const handleSchedule = () => {
    if (!formData.recipient || !formData.amount || !formData.date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const scheduledDate = new Date(`${formData.date}T${formData.time}`);
    const newTx: ScheduledTransaction = {
      id: Date.now().toString(),
      recipient: formData.recipient,
      amount: formData.amount,
      network: formData.network,
      scheduledDate,
      frequency: formData.frequency as ScheduledTransaction['frequency'],
      status: 'pending'
    };

    setScheduledTx([...scheduledTx, newTx]);
    setShowForm(false);
    setFormData({ recipient: '', amount: '', network: 'BTC', date: '', time: '', frequency: 'once' });
    
    toast({
      title: "Transaction Scheduled",
      description: `Your ${formData.network} transaction will be sent on ${scheduledDate.toLocaleString()}`,
    });
  };

  const handleCancel = (id: string) => {
    setScheduledTx(scheduledTx.map(tx => 
      tx.id === id ? { ...tx, status: 'cancelled' } : tx
    ));
    toast({
      title: "Transaction Cancelled",
      description: "The scheduled transaction has been cancelled",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return '';
    }
  };

  return (
    <Card className="bg-black/50 border-purple-500/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-purple-400" />
            Scheduled Transactions
          </CardTitle>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            {showForm ? 'Cancel' : 'Schedule New'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Recipient Address</Label>
                <Input
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  placeholder="Enter wallet address"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Amount</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Network</Label>
                <Select 
                  value={formData.network} 
                  onValueChange={(value) => setFormData({ ...formData, network: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
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

              <div className="space-y-2">
                <Label className="text-white">Frequency</Label>
                <Select 
                  value={formData.frequency} 
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">One Time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Time</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>

            <Button 
              onClick={handleSchedule}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Transaction
            </Button>
          </motion.div>
        )}

        <div className="space-y-3">
          {scheduledTx.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getStatusColor(tx.status)}>
                      {tx.status}
                    </Badge>
                    {tx.frequency !== 'once' && (
                      <Badge variant="outline" className="text-purple-400 border-purple-500/50">
                        <Repeat className="w-3 h-3 mr-1" />
                        {tx.frequency}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">To:</span>
                      <p className="text-white font-mono text-xs truncate">{tx.recipient}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <p className="text-white font-semibold">{tx.amount} {tx.network}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Scheduled:</span>
                      <p className="text-white">{tx.scheduledDate.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {tx.status === 'pending' && (
                    <>
                      <button className="text-green-400 hover:text-green-300">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300">
                        <Pause className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {tx.status !== 'completed' && tx.status !== 'cancelled' && (
                    <button 
                      onClick={() => handleCancel(tx.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {scheduledTx.length === 0 && !showForm && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No scheduled transactions</p>
              <p className="text-sm mt-1">Click "Schedule New" to create one</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}