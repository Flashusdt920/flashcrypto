import { useState, useEffect } from 'react';
import { Cookie, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const rejectAll = () => {
    localStorage.setItem('cookieConsent', 'none');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 backdrop-blur-lg border-t border-purple-500/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-purple-400 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Cookie Preferences</h3>
                <p className="text-gray-400 text-sm">
                  We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. 
                  By continuing to use our platform, you consent to our use of cookies.
                </p>
                {showDetails && (
                  <div className="mt-3 space-y-2 text-sm text-gray-400">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-green-400 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white">Necessary Cookies:</span> Required for platform functionality and security
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white">Analytics Cookies:</span> Help us improve our services
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-purple-400 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white">Marketing Cookies:</span> Used to personalize your experience
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-purple-400 hover:text-purple-300 text-sm mt-2"
                >
                  {showDetails ? 'Hide Details' : 'Learn More'}
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={rejectAll}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Reject All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={acceptNecessary}
                className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
              >
                Necessary Only
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Accept All
              </Button>
            </div>
            
            <button
              onClick={() => setShowBanner(false)}
              className="absolute top-4 right-4 md:static text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}