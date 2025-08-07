import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export function EmailVerificationBanner({ email }: { email?: string }) {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();

  const handleSendVerification = () => {
    setShowVerification(true);
    toast({
      title: "Verification Email Sent",
      description: `Check your email ${email || 'inbox'} for the verification code`,
    });
  };

  const handleVerify = () => {
    if (verificationCode.length === 6) {
      setIsVerified(true);
      setShowVerification(false);
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit code from your email",
        variant: "destructive",
      });
    }
  };

  if (isVerified) {
    return (
      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div className="flex-1">
            <p className="text-green-300 font-medium">Email Verified</p>
            <p className="text-gray-400 text-sm">Your email address has been verified</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-yellow-300 font-medium">Email Not Verified</p>
          <p className="text-gray-400 text-sm mb-3">
            Verify your email to unlock all features and secure your account
          </p>
          
          {!showVerification ? (
            <Button
              size="sm"
              onClick={handleSendVerification}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Verification Email
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="bg-gray-800 border-gray-600 text-white font-mono"
                />
                <Button
                  onClick={handleVerify}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Verify
                </Button>
              </div>
              <button
                onClick={handleSendVerification}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Resend Code
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmailVerificationModal({ 
  isOpen, 
  onClose, 
  email 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  email: string;
}) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (code === '123456') {
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified",
        });
        onClose();
      } else {
        toast({
          title: "Invalid Code",
          description: "The verification code is incorrect",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gray-900 border-purple-500/30">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Verify Your Email</h3>
            <p className="text-gray-400 text-sm">
              We've sent a verification code to<br />
              <span className="text-purple-400 font-medium">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-white">Verification Code</Label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="bg-gray-800 border-gray-600 text-white font-mono text-center text-lg"
                autoFocus
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={isLoading || code.length !== 6}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>

            <div className="text-center space-y-2">
              <button className="text-sm text-purple-400 hover:text-purple-300">
                Resend verification code
              </button>
              <button
                onClick={onClose}
                className="block w-full text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}