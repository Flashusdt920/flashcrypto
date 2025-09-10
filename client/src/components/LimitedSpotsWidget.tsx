import { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LimitedSpotsWidget() {
  const [spotsLeft, setSpotsLeft] = useState(7);

  useEffect(() => {
    // Randomly decrease spots every 30-60 seconds
    const interval = setInterval(() => {
      setSpotsLeft(prev => {
        if (prev <= 3) return prev; // Keep at least 3 spots
        return prev - 1;
      });
    }, Math.random() * 30000 + 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      className="bg-gradient-to-r from-red-900/50 to-pink-900/50 border border-red-500/30 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
          <span className="text-white font-semibold">Limited Availability</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 font-bold">{spotsLeft}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-red-300 text-sm font-medium">
          Only {spotsLeft} spots remaining at current price!
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: `${(spotsLeft / 10) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-400">
          Price increases after these spots are filled
        </p>
      </div>
    </motion.div>
  );
}

export function UrgencyBanner() {
  const messages = [
    "🔥 Flash Sale: 20% OFF - Ends Soon!",
    "⚡ Limited Time: Get Premium Access Now",
    "🎯 Special Offer: Save $100 Today Only",
    "🚀 Join 10,000+ Successful Users",
    "💎 VIP Access Available - Limited Spots"
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-900 to-pink-900 py-2 px-4 text-center">
      <motion.p
        key={currentMessage}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="text-white font-medium text-sm"
      >
        {messages[currentMessage]}
      </motion.p>
    </div>
  );
}