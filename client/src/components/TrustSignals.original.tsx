import { useEffect, useState } from 'react';
import { Shield, Lock, Award, TrendingUp, Users, Activity, CheckCircle, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TrustBadges() {
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
}

export function LiveStats() {
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
          <span className="text-2xl font-bold text-white">{stats.usersOnline.toLocaleString()}</span>
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
          <span className="text-2xl font-bold text-white">{(stats.totalTransactions / 1000).toFixed(0)}K+</span>
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
}

export function LiveTransactionFeed() {
  const [transactions, setTransactions] = useState<Array<{
    id: string;
    crypto: string;
    amount: string;
    country: string;
    time: string;
  }>>([]);

  const cryptos = ['BTC', 'ETH', 'USDT', 'BNB'];
  const countries = ['USA', 'UK', 'Germany', 'Japan', 'Canada', 'Australia', 'France', 'Italy'];

  useEffect(() => {
    // Generate initial transactions
    const initial = Array.from({ length: 5 }, (_, i) => ({
      id: `tx-${i}`,
      crypto: cryptos[Math.floor(Math.random() * cryptos.length)],
      amount: (Math.random() * 10 + 0.1).toFixed(4),
      country: countries[Math.floor(Math.random() * countries.length)],
      time: 'just now'
    }));
    setTransactions(initial);

    // Add new transaction every 3-7 seconds
    const interval = setInterval(() => {
      const newTx = {
        id: `tx-${Date.now()}`,
        crypto: cryptos[Math.floor(Math.random() * cryptos.length)],
        amount: (Math.random() * 10 + 0.1).toFixed(4),
        country: countries[Math.floor(Math.random() * countries.length)],
        time: 'just now'
      };

      setTransactions(prev => [newTx, ...prev.slice(0, 4)]);
    }, Math.random() * 4000 + 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/40 rounded-lg border border-purple-500/20 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-green-400 animate-pulse" />
        <h3 className="text-lg font-semibold text-white">Live Transactions</h3>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence>
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <div>
                  <p className="text-sm text-white">
                    {tx.amount} {tx.crypto} sent successfully
                  </p>
                  <p className="text-xs text-gray-400">
                    From {tx.country} • {tx.time}
                  </p>
                </div>
              </div>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function SocialProofPopup() {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({
    name: '',
    country: '',
    plan: '',
    time: ''
  });

  const names = ['John', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'Tom', 'Anna'];
  const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France'];
  const plans = ['Basic Plan', 'Pro Plan', 'Full Access'];

  useEffect(() => {
    const showNotification = () => {
      const newNotification = {
        name: names[Math.floor(Math.random() * names.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        plan: plans[Math.floor(Math.random() * plans.length)],
        time: `${Math.floor(Math.random() * 59) + 1} minutes ago`
      };

      setNotification(newNotification);
      setShow(true);

      setTimeout(() => setShow(false), 5000);
    };

    // Show first notification after 10 seconds
    const firstTimeout = setTimeout(showNotification, 10000);

    // Then show every 30-60 seconds
    const interval = setInterval(showNotification, Math.random() * 30000 + 30000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-20 right-4 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg shadow-xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">
                  {notification.name} from {notification.country}
                </p>
                <p className="text-gray-300 text-sm">
                  Just purchased {notification.plan}
                </p>
                <p className="text-gray-400 text-xs">{notification.time}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}