import { useState } from 'react';
import { Tag, CheckCircle, XCircle, Percent } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface PromoCodeData {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
  expiresAt?: Date;
}

const VALID_CODES: PromoCodeData[] = [
  { code: 'WELCOME20', discount: 20, type: 'percentage', description: 'New user discount' },
  { code: 'FLASH50', discount: 50, type: 'fixed', description: '$50 off Pro plan' },
  { code: 'CRYPTO10', discount: 10, type: 'percentage', description: '10% off all plans' },
  { code: 'NEWYEAR2025', discount: 25, type: 'percentage', description: 'New Year special', expiresAt: new Date('2025-01-31') },
];

export function PromoCodeInput({ onApply }: { onApply?: (code: PromoCodeData) => void }) {
  const [code, setCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<PromoCodeData | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const handleApplyCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a promo code",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const validCode = VALID_CODES.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (validCode) {
      // Check if expired
      if (validCode.expiresAt && validCode.expiresAt < new Date()) {
        toast({
          title: "Code Expired",
          description: "This promo code has expired",
          variant: "destructive",
        });
        setIsChecking(false);
        return;
      }

      setAppliedCode(validCode);
      onApply?.(validCode);
      toast({
        title: "Promo Code Applied!",
        description: `${validCode.description} - ${validCode.type === 'percentage' ? `${validCode.discount}% off` : `$${validCode.discount} off`}`,
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "This promo code is not valid. Try: WELCOME20",
        variant: "destructive",
      });
    }
    
    setIsChecking(false);
  };

  const removeCode = () => {
    setAppliedCode(null);
    setCode('');
    toast({
      title: "Promo Code Removed",
      description: "The discount has been removed",
    });
  };

  return (
    <Card className="bg-black/50 border-purple-500/20 p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold">Promo Code</h3>
        </div>

        {!appliedCode ? (
          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="bg-gray-800 border-gray-600 text-white"
              disabled={isChecking}
            />
            <Button
              onClick={handleApplyCode}
              disabled={isChecking}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isChecking ? 'Checking...' : 'Apply'}
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between p-3 bg-green-900/30 border border-green-500/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">{appliedCode.code}</p>
                  <p className="text-green-400 text-sm">
                    {appliedCode.type === 'percentage' 
                      ? `${appliedCode.discount}% discount applied`
                      : `$${appliedCode.discount} discount applied`}
                  </p>
                </div>
              </div>
              <button
                onClick={removeCode}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </motion.div>
          </AnimatePresence>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Percent className="w-3 h-3" />
          <span>Limited time offers available. Try: WELCOME20 for 20% off!</span>
        </div>
      </div>
    </Card>
  );
}

// Default export for compatibility
export default PromoCodeInput;