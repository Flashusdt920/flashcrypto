import { useEffect, useState, memo, useMemo, useCallback } from 'react';
import { Shield, Lock, Award, TrendingUp, Users, Activity, CheckCircle, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TrustBadges = memo(function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-4">
      <div className="flex items-center gap-2 bg-green-900/20 border border-green-500/30 rounded-lg px-3 py-2">
        <Shield className="w-5 h-5 text-green-400" />
        <span className="text-sm font-medium text-green-400">SSL Secured</span>
      </div>
      <div className="flex items-center gap-2 bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2">
        <Lock className="w-5 h-5 text-blue-400" />
        <span className="text-sm font-medium text-blue-400">256-bit Encryption</span>
      </div>
      <div className="flex items-center gap-2 bg-purple-900/20 border border-purple-500/30 rounded-lg px-3 py-2">
        <Award className="w-5 h-5 text-purple-400" />
        <span className="text-sm font-medium text-purple-400">Verified Platform</span>
      </div>
      <div className="flex items-center gap-2 bg-yellow-900/20 border border-yellow-500/30 rounded-lg px-3 py-2">
        <CheckCircle className="w-5 h-5 text-yellow-400" />
        <span className="text-sm font-medium text-yellow-400">McAfee Secured</span>
      </div>
    </div>
  );
});

export const LiveStats = memo(function LiveStats() {
  const [stats, setStats] = useState({
    usersOnline: 169700,
    successRate: 99.9,
    totalTransactions: 1548293,
    countries: 147
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        usersOnline: prev.usersOnline + Math.floor(Math.random() * 10) - 3,
        successRate: 99.9,
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5),
        countries: 147
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Memoize formatted values to avoid recalculation
  const formattedStats = useMemo(() => ({
    usersOnline: stats.usersOnline.toLocaleString(),
    transactions: (stats.totalTransactions / 1000).toFixed(0) + 'K+'
  }), [stats.usersOnline, stats.totalTransactions]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-black/40 rounded-lg border border-purple-500/20">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Users className="w-5 h-5 text-green-400" />
          <span className="text-2xl font-bold text-white">{formattedStats.usersOnline}</span>
        </div>
        <p className="text-sm text-gray-400">Users Online</p>
      </motion.div>
      
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <span className="text-2xl font-bold text-white">{stats.successRate}%</span>
        </div>
        <p className="text-sm text-gray-400">Success Rate</p>
      </motion.div>
      
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-purple-400" />
          <span className="text-2xl font-bold text-white">{formattedStats.transactions}</span>
        </div>
        <p className="text-sm text-gray-400">Transactions</p>
      </motion.div>
      
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-yellow-400" />
          <span className="text-2xl font-bold text-white">{stats.countries}</span>
        </div>
        <p className="text-sm text-gray-400">Countries</p>
      </motion.div>
    </div>
  );
});

export const LiveTransactionFeed = memo(function LiveTransactionFeed() {
  const [transactions, setTransactions] = useState<Array<{
    id: string;
    crypto: string;
    amount: string;
    country: string;
    time: string;
  }>>([]);

  const cryptos = useMemo(() => ['BTC', 'ETH', 'USDT', 'BNB'], []);
  const countries = useMemo(() => ['USA', 'UK', 'Germany', 'Japan', 'Canada', 'Australia', 'France', 'Italy'], []);

  const generateTransaction = useCallback(() => ({
    id: `tx-${Date.now()}`,
    crypto: cryptos[Math.floor(Math.random() * cryptos.length)],
    amount: (Math.random() * 10000 + 100).toFixed(2),
    country: countries[Math.floor(Math.random() * countries.length)],
    time: 'Just now'
  }), [cryptos, countries]);

  useEffect(() => {
    // Generate initial transactions
    const initial = Array.from({ length: 5 }, () => generateTransaction());
    setTransactions(initial);

    // Add new transactions periodically
    const interval = setInterval(() => {
      setTransactions(prev => {
        const newTx = generateTransaction();
        return [newTx, ...prev.slice(0, 4)];
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [generateTransaction]);

  return (
    <div className="bg-black/40 rounded-lg border border-purple-500/20 p-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-purple-400" />
        Live Transactions
      </h3>
      <div className="space-y-3 max-h-64 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {transactions.map(tx => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-400">{tx.crypto}</span>
                </div>
                <div>
                  <p className="text-sm text-white">${tx.amount}</p>
                  <p className="text-xs text-gray-400">{tx.country}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{tx.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
});

export const SocialProofPopup = memo(function SocialProofPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'John D.',
    country: 'United States',
    plan: 'Premium'
  });

  const users = useMemo(() => [
    { name: 'John D.', country: 'United States', plan: 'Premium' },
    { name: 'Sarah M.', country: 'United Kingdom', plan: 'Premium' },
    { name: 'Alex K.', country: 'Germany', plan: 'Premium' },
    { name: 'Maria S.', country: 'Spain', plan: 'Premium' },
    { name: 'David L.', country: 'Canada', plan: 'Premium' },
    { name: 'Emma W.', country: 'Australia', plan: 'Premium' },
  ], []);

  useEffect(() => {
    const showPopup = () => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      setCurrentUser(randomUser);
      setIsVisible(true);
      
      setTimeout(() => setIsVisible(false), 5000);
    };

    // Initial delay
    const initialTimeout = setTimeout(showPopup, 10000);
    
    // Repeat every 30 seconds
    const interval = setInterval(showPopup, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [users]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: -50 }}
          className="fixed bottom-20 left-4 z-50 bg-gradient-to-r from-purple-900 to-violet-900 rounded-lg shadow-2xl p-4 border border-purple-500/30 max-w-xs"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">
                {currentUser.name} from {currentUser.country}
              </p>
              <p className="text-gray-300 text-xs">
                Just purchased {currentUser.plan} Access
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export const CountdownOffer = memo(function CountdownOffer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset to 3 hours when timer reaches 0
          return { hours: 3, minutes: 0, seconds: 0 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = useCallback((time: number) => time.toString().padStart(2, '0'), []);

  return (
    <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-yellow-400 font-semibold">Limited Time Offer</h3>
          <p className="text-gray-300 text-sm">Special pricing ends in:</p>
        </div>
        <div className="flex gap-2 text-2xl font-mono font-bold text-white">
          <span>{formatTime(timeLeft.hours)}</span>
          <span className="text-yellow-400">:</span>
          <span>{formatTime(timeLeft.minutes)}</span>
          <span className="text-yellow-400">:</span>
          <span>{formatTime(timeLeft.seconds)}</span>
        </div>
      </div>
    </div>
  );
});

// Default export with all components
export default {
  TrustBadges,
  LiveStats,
  LiveTransactionFeed,
  SocialProofPopup,
  CountdownOffer
};