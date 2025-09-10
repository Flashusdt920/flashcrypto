import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ArrowDownCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SimulatedWalletProps {
  recipientAddress?: string;
  incomingAmount?: string;
  token?: string;
  isReceiving?: boolean;
  onTransactionComplete?: () => void;
}

export default function SimulatedWallet({ 
  recipientAddress, 
  incomingAmount, 
  token = 'USDT',
  isReceiving = false,
  onTransactionComplete
}: SimulatedWalletProps) {
  const [balance, setBalance] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [showReceiving, setShowReceiving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transactionHash, setTransactionHash] = useState('');

  // Generate random initial balance between 100-5000
  useEffect(() => {
    const randomBalance = Math.floor(Math.random() * 4900) + 100;
    setBalance(randomBalance);
  }, []);

  // Handle incoming transaction
  useEffect(() => {
    if (isReceiving && incomingAmount) {
      setShowReceiving(true);
      setPreviousBalance(balance);
      setProgress(0);
      
      // Generate random transaction hash
      const hash = '0x' + Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      setTransactionHash(hash);

      // Simulate receiving progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setBalance(balance + parseFloat(incomingAmount));
            setTimeout(() => {
              setShowReceiving(false);
              onTransactionComplete?.();
            }, 2000);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isReceiving, incomingAmount, balance, onTransactionComplete]);

  const formatAddress = (address: string) => {
    if (!address) return 'Waiting for address...';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Wallet className="h-5 w-5" />
          Recipient Wallet Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Address */}
        <div className="bg-black/30 p-3 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Wallet Address</p>
          <p className="font-mono text-sm text-green-400">
            {formatAddress(recipientAddress || '')}
          </p>
        </div>

        {/* Balance Display */}
        <div className="bg-black/30 p-4 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Current Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {formatBalance(balance)}
            </span>
            <span className="text-lg text-gray-400">{token}</span>
          </div>
          
          {showReceiving && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-green-400">
                <ArrowDownCircle className="h-4 w-4 animate-bounce" />
                <span className="text-sm">
                  Receiving +{formatBalance(parseFloat(incomingAmount || '0'))} {token}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {progress === 100 && showReceiving && (
            <div className="mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-semibold">Transaction Confirmed!</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Previous Balance: {formatBalance(previousBalance)} {token}</p>
                <p className="text-xs text-gray-400">Received: +{formatBalance(parseFloat(incomingAmount || '0'))} {token}</p>
                <p className="text-xs text-green-400 font-semibold">New Balance: {formatBalance(balance)} {token}</p>
              </div>
            </div>
          )}
        </div>

        {/* Transaction Details */}
        {showReceiving && transactionHash && (
          <div className="bg-black/30 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Transaction Hash</span>
              <Clock className="h-3 w-3 text-yellow-400 animate-spin" />
            </div>
            <p className="font-mono text-xs text-green-400 break-all">
              {transactionHash}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Status:</span>
              <span className={progress === 100 ? 'text-green-400' : 'text-yellow-400'}>
                {progress === 100 ? 'Confirmed' : 'Pending...'}
              </span>
            </div>
          </div>
        )}

        {/* Network Info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            <span>Network: {token === 'USDT' ? 'TRC-20' : 'Mainnet'}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <TrendingUp className="h-3 w-3" />
            <span>Live</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}