import { Shield, Lock, Award, CheckCircle, AlertTriangle, Key, Globe, Server } from 'lucide-react';
import { motion } from 'framer-motion';

export function SecurityBadgeBar() {
  const badges = [
    { icon: Lock, label: '256-bit Encryption', color: 'text-green-400' },
    { icon: Shield, label: 'McAfee Secured', color: 'text-blue-400' },
    { icon: Award, label: 'Norton Verified', color: 'text-yellow-400' },
    { icon: CheckCircle, label: 'PCI Compliant', color: 'text-purple-400' },
    { icon: Key, label: 'SSL Protected', color: 'text-green-400' },
    { icon: Globe, label: '147+ Countries', color: 'text-blue-400' },
    { icon: Server, label: '99.9% Uptime', color: 'text-purple-400' }
  ];

  return (
    <div className="bg-black/60 border-y border-purple-500/20 py-3">
      <div className="flex items-center justify-center gap-6 overflow-x-auto px-4">
        {badges.map((badge, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <badge.icon className={`w-5 h-5 ${badge.color}`} />
            <span className="text-sm text-gray-300">{badge.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function FloatingSecurityBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2 }}
      className="fixed left-4 bottom-20 z-40 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg shadow-xl p-3 border border-green-500/30"
    >
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-green-400" />
        <div>
          <p className="text-white font-semibold text-sm">Verified Secure</p>
          <p className="text-green-400 text-xs">SSL Protected</p>
        </div>
      </div>
    </motion.div>
  );
}

export function MoneyBackGuarantee() {
  return (
    <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-yellow-950 dark:text-black">7</span>
        </div>
        <div>
          <h3 className="text-yellow-400 font-semibold">7-Day Money Back Guarantee</h3>
          <p className="text-gray-300 text-sm">Not satisfied? Get a full refund within 7 days</p>
        </div>
      </div>
    </div>
  );
}

export function TrustPilotWidget() {
  return (
    <div className="bg-black/40 rounded-lg border border-purple-500/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white font-bold">TP</span>
          </div>
          <span className="text-white font-semibold">TrustPilot</span>
        </div>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(i => (
            <span key={i} className="text-yellow-400">⭐</span>
          ))}
        </div>
      </div>
      <p className="text-gray-300 text-sm mb-2">Rated 4.9/5 from 10,847 reviews</p>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Excellent</span>
          <span className="text-gray-400">95%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
        </div>
      </div>
    </div>
  );
}