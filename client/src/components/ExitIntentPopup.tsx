import { useState, useEffect } from 'react';
import { X, Gift, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Detect when mouse leaves the viewport from the top
      if (e.clientY <= 0 && !hasShown) {
        const lastShown = localStorage.getItem('exitIntentLastShown');
        const now = Date.now();
        
        // Show only once per day
        if (!lastShown || now - parseInt(lastShown) > 86400000) {
          setShowPopup(true);
          setHasShown(true);
          localStorage.setItem('exitIntentLastShown', now.toString());
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  const handleClaim = () => {
    // Apply discount code
    localStorage.setItem('appliedDiscount', 'EXIT30');
    setShowPopup(false);
    window.location.href = '/pricing';
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="max-w-lg w-full bg-gradient-to-br from-purple-900 to-black border border-purple-500/30 rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 pb-0">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
                <Gift className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">
                Wait! Don't Leave Yet!
              </h2>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <p className="text-yellow-400 font-semibold">
                  Exclusive Offer - Valid for 10 minutes only!
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="bg-black/50 rounded-lg p-4 border border-purple-500/30">
              <div className="text-center mb-4">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  30% OFF
                </span>
                <p className="text-gray-300 mt-2">Your First Month Subscription</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Valid for all subscription plans</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Instant activation upon payment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">No hidden fees or commitments</span>
                </div>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-400" />
                <div className="flex-1">
                  <p className="text-red-400 font-semibold">Limited Time Offer</p>
                  <p className="text-xs text-gray-400">This offer expires when you leave the page</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleClaim}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                size="lg"
              >
                Claim 30% Discount
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                size="lg"
              >
                No Thanks
              </Button>
            </div>

            <p className="text-center text-xs text-gray-500">
              * Discount automatically applied at checkout. One-time use only.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}