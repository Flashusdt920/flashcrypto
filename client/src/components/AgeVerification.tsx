import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgeVerification() {
  const [showVerification, setShowVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('ageVerified');
    if (!verified) {
      setTimeout(() => setShowVerification(true), 500);
    } else {
      setIsVerified(true);
    }
  }, []);

  const handleVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      localStorage.setItem('ageVerified', 'true');
      localStorage.setItem('ageVerifiedDate', new Date().toISOString());
      setIsVerified(true);
      setShowVerification(false);
    } else {
      // Redirect to appropriate page
      window.location.href = 'https://www.google.com';
    }
  };

  if (!showVerification || isVerified) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-purple-900/50 to-black/50 border border-purple-500/30 rounded-xl p-8"
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <Shield className="w-20 h-20 text-purple-400" />
              <AlertTriangle className="w-8 h-8 text-yellow-400 absolute -bottom-2 -right-2" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Age Verification Required</h2>
              <p className="text-gray-400">
                You must be 18 years or older to access this cryptocurrency platform.
                This service involves financial transactions and is restricted to adults only.
              </p>
            </div>

            <div className="w-full space-y-3">
              <Button
                onClick={() => handleVerify(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                I am 18 or older
              </Button>
              
              <Button
                onClick={() => handleVerify(false)}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                size="lg"
              >
                I am under 18
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              By proceeding, you confirm that you meet the age requirement and agree to our Terms of Service.
              We use cookies to remember your age verification status.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}