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
      description: "Please login with your new credentials",
    });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black bg-opacity-50 border border-purple-500 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BoltTextLogo />
          </div>
          <p className="text-gray-300 mt-2">Professional Flash Transaction Platform</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-purple-500"
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-purple-500"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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
    </div>
  );
}