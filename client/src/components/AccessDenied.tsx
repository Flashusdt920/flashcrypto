import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, LogOut, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function AccessDenied() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const openTelegram = () => {
    window.open('https://t.me/Henryphilipbolt', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black bg-opacity-50 border-red-500" data-testid="access-denied-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white" data-testid="text-access-denied-title">
            Access Denied
          </CardTitle>
          <CardDescription className="text-gray-300 mt-2" data-testid="text-access-denied-message">
            Your subscription has been rejected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-900 bg-opacity-30 border border-red-600 rounded-lg p-4">
            <p className="text-white text-sm" data-testid="text-rejection-reason">
              We were unable to verify your payment. Your subscription request has been rejected. 
              Please contact our support team for assistance or to resolve any payment issues.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={openTelegram}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              data-testid="button-contact-support"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support on Telegram
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-400">
              Support: @Henryphilipbolt
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}