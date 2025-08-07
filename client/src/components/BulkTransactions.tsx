import { useState } from 'react';
import { Upload, Send, AlertCircle, CheckCircle, XCircle, Download, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface BulkTransaction {
  id: string;
  recipient: string;
  amount: string;
  network: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  error?: string;
}

export function BulkTransactions() {
  const [transactions, setTransactions] = useState<BulkTransaction[]>([]);
  const [network, setNetwork] = useState('ETH');
  const [csvInput, setCsvInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const { toast } = useToast();

  const addTransaction = () => {
    const newTransaction: BulkTransaction = {
      id: Date.now().toString(),
      recipient: '',
      amount: '',
      network: network,
      status: 'pending',
    };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, field: string, value: string) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const removeTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const parseCsv = () => {
    const lines = csvInput.trim().split('\n');
    const parsed: BulkTransaction[] = [];

    lines.forEach((line, index) => {
      const [recipient, amount] = line.split(',').map(s => s.trim());
      if (recipient && amount) {
        parsed.push({
          id: `csv-${Date.now()}-${index}`,
          recipient,
          amount,
          network,
          status: 'pending',
        });
      }
    });

    if (parsed.length > 0) {
      setTransactions([...transactions, ...parsed]);
      setCsvInput('');
      toast({
        title: "CSV Imported",
        description: `Added ${parsed.length} transactions from CSV`,
      });
    } else {
      toast({
        title: "Invalid CSV",
        description: "Please check your CSV format: recipient,amount",
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = () => {
    const template = 'recipient_address,amount\n0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3,1.5\n0x123...abc,2.0\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_transactions_template.csv';
    a.click();
  };

  const validateTransactions = () => {
    const valid = transactions.every(t => t.recipient && t.amount && parseFloat(t.amount) > 0);
    if (!valid) {
      toast({
        title: "Validation Failed",
        description: "Please fill in all transaction details",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const processBulkTransactions = async () => {
    if (!validateTransactions()) return;

    setIsProcessing(true);
    setProcessedCount(0);

    // Simulate processing
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      
      // Update status to processing
      setTransactions(prev => prev.map(t => 
        t.id === transaction.id ? { ...t, status: 'processing' } : t
      ));

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Randomly succeed or fail for demo
      const success = Math.random() > 0.2;
      
      setTransactions(prev => prev.map(t => 
        t.id === transaction.id 
          ? { 
              ...t, 
              status: success ? 'success' : 'failed',
              error: success ? undefined : 'Insufficient balance'
            } 
          : t
      ));

      setProcessedCount(i + 1);
    }

    setIsProcessing(false);
    
    const successCount = transactions.filter(t => t.status === 'success').length;
    toast({
      title: "Bulk Processing Complete",
      description: `${successCount} of ${transactions.length} transactions successful`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'processing': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'processing': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Send className="w-7 h-7 text-purple-400" />
          Bulk Transactions
        </h2>
        <p className="text-gray-400 mt-1">Send multiple transactions in one batch</p>
      </div>

      {/* Network Selection */}
      <Card className="bg-black/50 border-purple-500/20 p-6">
        <Label className="text-white">Network</Label>
        <Select value={network} onValueChange={setNetwork}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-2">
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
      </Card>

      {/* Import Options */}
      <Card className="bg-black/50 border-purple-500/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Import Transactions</h3>
        
        {/* CSV Import */}
        <div className="space-y-4">
          <div>
            <Label className="text-white">Import from CSV</Label>
            <Textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="recipient_address,amount&#10;0x742d35Cc...,1.5&#10;0x123...abc,2.0"
              className="bg-gray-800 border-gray-600 text-white font-mono text-sm mt-2"
              rows={4}
            />
            <div className="flex gap-2 mt-2">
              <Button
                onClick={parseCsv}
                disabled={!csvInput || isProcessing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
              <Button
                onClick={downloadTemplate}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction List */}
      <Card className="bg-black/50 border-purple-500/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Transaction List</h3>
          <Button
            onClick={addTransaction}
            disabled={isProcessing}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <Upload className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No transactions added yet</p>
            <p className="text-gray-500 text-sm mt-1">Import from CSV or add manually</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="bg-gray-900/50 rounded-lg p-3 flex items-center gap-3"
              >
                <span className="text-gray-500 text-sm w-8">#{index + 1}</span>
                
                <Input
                  value={transaction.recipient}
                  onChange={(e) => updateTransaction(transaction.id, 'recipient', e.target.value)}
                  placeholder="Recipient address"
                  disabled={isProcessing}
                  className="bg-gray-800 border-gray-600 text-white font-mono text-sm flex-1"
                />
                
                <Input
                  value={transaction.amount}
                  onChange={(e) => updateTransaction(transaction.id, 'amount', e.target.value)}
                  placeholder="Amount"
                  disabled={isProcessing}
                  className="bg-gray-800 border-gray-600 text-white w-32"
                />
                
                <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
                  {transaction.network}
                </Badge>
                
                <div className={`flex items-center gap-1 ${getStatusColor(transaction.status)}`}>
                  {getStatusIcon(transaction.status)}
                  <span className="text-sm capitalize">{transaction.status}</span>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeTransaction(transaction.id)}
                  disabled={isProcessing}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {transactions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Transactions: {transactions.length}</p>
                <p className="text-white font-semibold">
                  Total Amount: {totalAmount.toFixed(4)} {network}
                </p>
              </div>
              
              {isProcessing && (
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">
                    Processing {processedCount}/{transactions.length}
                  </p>
                  <Progress 
                    value={(processedCount / transactions.length) * 100} 
                    className="w-32"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      {transactions.length > 0 && (
        <div className="flex gap-3">
          <Button
            onClick={() => setTransactions([])}
            variant="outline"
            disabled={isProcessing}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button
            onClick={processBulkTransactions}
            disabled={isProcessing || transactions.length === 0}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isProcessing ? 'Processing...' : `Send ${transactions.length} Transactions`}
          </Button>
        </div>
      )}
    </div>
  );
}