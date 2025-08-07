import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Register from './register';
import { BoltTextLogo } from '@/components/bolt-logo';
import { LiveStats, SocialProofPopup, LiveTransactionFeed } from '@/components/TrustSignals';
import Footer from '@/components/Footer';
import LiveChat from '@/components/LiveChat';
import CountdownTimer from '@/components/CountdownTimer';
import { SecurityBadgeBar, FloatingSecurityBadge, MoneyBackGuarantee, TrustPilotWidget } from '@/components/SecurityBadges';
import TransactionCalculator from '@/components/TransactionCalculator';
import LimitedSpotsWidget, { UrgencyBanner } from '@/components/LimitedSpotsWidget';
import AsSeenOn from '@/components/AsSeenOn';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(username, password);
      
      if (!success) {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please check your username and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSuccess = () => {
    setShowRegister(false);
    toast({
      title: "Registration Successful",
      description: "Account created! You can now purchase a subscription to access the platform.",
    });
    // Refresh the page to trigger auth state update
    window.location.reload();
  };

  // Show registration page
  if (showRegister) {
    return (
      <Register
        onRegistrationSuccess={handleRegistrationSuccess}
        onBackToLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <UrgencyBanner />
      <SecurityBadgeBar />
      <SocialProofPopup />
      <FloatingSecurityBadge />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* As Seen On */}
        <AsSeenOn />
        
        {/* Live Stats at Top */}
        <div className="max-w-6xl mx-auto mb-8">
          <LiveStats />
        </div>

        {/* Countdown Timer and Limited Spots */}
        <div className="max-w-4xl mx-auto mb-6 grid md:grid-cols-2 gap-4">
          <CountdownTimer />
          <LimitedSpotsWidget />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Left Column - Trust Elements */}
          <div className="w-full max-w-md space-y-6">
            <TrustPilotWidget />
            <TransactionCalculator />
            <MoneyBackGuarantee />
          </div>

          {/* Center - Login Form */}
          <Card className="w-full max-w-md bg-black bg-opacity-50 border border-purple-500 shadow-2xl">
            <CardHeader className="text-center p-4 sm:p-6">
              <div className="flex justify-center mb-3 sm:mb-4">
                <BoltTextLogo />
              </div>
              <p className="text-gray-300 mt-2 text-sm sm:text-base">Professional Flash Transaction Platform</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-xs text-green-400">🔒 SSL Secured</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-blue-400">99.9% Uptime</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white text-sm sm:text-base">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white focus:border-purple-500 text-base"
                    placeholder="Enter your username"
                    disabled={isLoading}
                    autoComplete="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white text-sm sm:text-base">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white focus:border-purple-500 text-base"
                    placeholder="Enter your password"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="text-center mt-6">
                  <p className="text-gray-400 text-sm mb-3">
                    Don't have an account?
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowRegister(true)}
                    className="w-full text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                  >
                    Create New Account
                  </Button>
                </div>

                <div className="border-t border-gray-600 pt-4 mt-6">
                  <p className="text-xs text-gray-500 text-center">
                    By signing in, you agree to our terms and will be redirected to our Telegram channel for support.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Live Transaction Feed */}
          <div className="w-full max-w-md">
            <LiveTransactionFeed />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      
      {/* Support Widgets */}
      <LiveChat />
    </div>
  );
}