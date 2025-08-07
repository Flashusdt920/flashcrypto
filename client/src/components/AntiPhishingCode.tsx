import { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export function AntiPhishingSetup({ userId }: { userId?: string }) {
  const [code, setCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [savedCode, setSavedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSetupCode = async () => {
    if (code.length < 4 || code.length > 20) {
      toast({
        title: "Invalid Code",
        description: "Code must be between 4 and 20 characters",
        variant: "destructive",
      });
      return;
    }

    if (code !== confirmCode) {
      toast({
        title: "Codes Don't Match",
        description: "Please make sure both codes are identical",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/security/anti-phishing', {
        userId: userId || 'current',
        code: code
      });
      
      setSavedCode(code);
      setIsEnabled(true);
      setCode('');
      setConfirmCode('');
      toast({
        title: "Anti-Phishing Code Set",
        description: "Your anti-phishing code has been successfully configured",
      });
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to set anti-phishing code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = () => {
    setIsEnabled(false);
    setSavedCode('');
    toast({
      title: "Anti-Phishing Disabled",
      description: "Anti-phishing protection has been disabled",
      variant: "destructive",
    });
  };

  return (
    <Card className="bg-black/50 border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-xl font-semibold text-white">Anti-Phishing Code</h3>
            <p className="text-gray-400 text-sm">Protect yourself from phishing emails</p>
          </div>
        </div>
        {isEnabled && (
          <div className="flex items-center gap-2 text-green-400">
            <Lock className="w-5 h-5" />
            <span className="text-sm font-medium">Protected</span>
          </div>
        )}
      </div>

      {!isEnabled ? (
        <div className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-2">What is Anti-Phishing Code?</h4>
            <p className="text-gray-400 text-sm mb-2">
              A unique code that appears in all genuine emails from us. This helps you identify:
            </p>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Authentic emails from Bolt Flasher</li>
              <li>• Protection against phishing attempts</li>
              <li>• Secure communication verification</li>
            </ul>
          </div>

          <div>
            <Label className="text-white">Create Your Anti-Phishing Code</Label>
            <div className="relative">
              <Input
                type={showCode ? "text" : "password"}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 4-20 characters"
                className="bg-gray-800 border-gray-600 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use a memorable phrase that only you know
            </p>
          </div>

          <div>
            <Label className="text-white">Confirm Your Code</Label>
            <Input
              type={showCode ? "text" : "password"}
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              placeholder="Re-enter your code"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <Button
            onClick={handleSetupCode}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Shield className="w-4 h-4 mr-2" />
            Enable Anti-Phishing Code
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-green-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-green-300 font-medium">Anti-Phishing Active</p>
                <p className="text-gray-400 text-sm mt-1">
                  Your code will appear in all official emails from us
                </p>
                <div className="mt-3 p-2 bg-gray-900 rounded">
                  <p className="text-xs text-gray-500 mb-1">Your Code:</p>
                  <div className="flex items-center justify-between">
                    <code className="text-purple-400 font-mono">
                      {showCode ? savedCode : '••••••••'}
                    </code>
                    <button
                      onClick={() => setShowCode(!showCode)}
                      className="text-gray-400 hover:text-white"
                    >
                      {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-300 font-medium text-sm">Security Reminder</p>
                <p className="text-gray-400 text-xs mt-1">
                  Never share your anti-phishing code with anyone. We will never ask for it.
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="destructive"
            onClick={handleDisable}
            className="w-full"
          >
            Disable Anti-Phishing Code
          </Button>
        </div>
      )}
    </Card>
  );
}

export function AntiPhishingDisplay({ code }: { code?: string }) {
  if (!code) return null;

  return (
    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-purple-400" />
        <p className="text-xs text-gray-400">
          Anti-Phishing Code: <span className="text-purple-400 font-mono font-bold">{code}</span>
        </p>
      </div>
    </div>
  );
}