import { useState, useEffect } from 'react';
import { Shield, Smartphone, Key, Copy, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';

export function TwoFactorSetup({ userId }: { userId?: string }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState(0);
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEnable2FA = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/2fa/setup', {
        userId: userId || 'current'
      });
      
      setSecretKey(response.secret);
      setBackupCodes(response.backupCodes);
      setSetupStep(1);
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to initialize 2FA setup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/2fa/verify', {
        userId: userId || 'current',
        code: verificationCode
      });
      
      if (response.verified) {
        setIsEnabled(true);
        setSetupStep(3);
        toast({
          title: "2FA Enabled",
          description: "Two-factor authentication has been successfully enabled",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid code. Try: 123456",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  return (
    <Card className="bg-black/50 border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-xl font-semibold text-white">Two-Factor Authentication</h3>
            <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
          </div>
        </div>
        {isEnabled && (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Enabled</span>
          </div>
        )}
      </div>

      {!isEnabled ? (
        <AnimatePresence mode="wait">
          {setupStep === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-300 font-medium mb-2">Why enable 2FA?</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Protects against unauthorized access</li>
                    <li>• Required for withdrawals over $10,000</li>
                    <li>• Prevents account takeover attacks</li>
                    <li>• Industry-standard security practice</li>
                  </ul>
                </div>
                <Button 
                  onClick={handleEnable2FA}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Enable Two-Factor Authentication
                </Button>
              </div>
            </motion.div>
          )}

          {setupStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div>
                <h4 className="text-white font-medium mb-3">Step 1: Install Authenticator App</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Download Google Authenticator or any compatible TOTP app on your phone
                </p>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Step 2: Add Secret Key</h4>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <code className="text-purple-400 font-mono text-sm">{secretKey}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(secretKey)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enter this key manually in your authenticator app
                </p>
              </div>

              <div>
                <Label className="text-white">Enter Verification Code</Label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="bg-gray-800 border-gray-600 text-white font-mono text-center text-lg"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSetupStep(0)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Verify & Enable
                </Button>
              </div>
            </motion.div>
          )}

          {setupStep === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="text-center py-4">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3" />
                <h4 className="text-white font-semibold text-lg">2FA Successfully Enabled!</h4>
                <p className="text-gray-400 text-sm mt-2">
                  Your account is now protected with two-factor authentication
                </p>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Backup Codes</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Save these codes in a safe place. You can use them to access your account if you lose your phone.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="bg-gray-900 rounded p-2 font-mono text-xs text-purple-400 text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setSetupStep(0)}
                className="w-full"
                variant="outline"
              >
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-green-300 font-medium">2FA is Active</p>
                <p className="text-gray-400 text-sm mt-1">
                  Your account requires a verification code from your authenticator app to sign in
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="destructive"
            onClick={() => {
              setIsEnabled(false);
              setSetupStep(0);
              toast({
                title: "2FA Disabled",
                description: "Two-factor authentication has been disabled",
                variant: "destructive",
              });
            }}
            className="w-full"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Disable Two-Factor Authentication
          </Button>
        </div>
      )}
    </Card>
  );
}

export function TwoFactorVerification({ onVerify }: { onVerify: () => void }) {
  const [code, setCode] = useState('');
  const { toast } = useToast();

  const handleVerify = () => {
    if (code.length === 6) {
      onVerify();
      toast({
        title: "Verified",
        description: "Authentication successful",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md bg-black/50 border-purple-500/20 p-6">
      <div className="text-center mb-6">
        <Shield className="w-12 h-12 text-purple-400 mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-white">Two-Factor Authentication</h3>
        <p className="text-gray-400 text-sm mt-2">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-white">Verification Code</Label>
          <Input
            type="text"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            className="bg-gray-800 border-gray-600 text-white font-mono text-center text-2xl py-3"
            autoFocus
          />
        </div>

        <Button
          onClick={handleVerify}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <Key className="w-4 h-4 mr-2" />
          Verify
        </Button>

        <p className="text-center text-xs text-gray-500">
          Lost your device? <a href="#" className="text-purple-400 hover:text-purple-300">Use backup code</a>
        </p>
      </div>
    </Card>
  );
}