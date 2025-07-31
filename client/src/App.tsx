import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Send from "./pages/send";
import History from "./pages/history";
import Charts from "./pages/charts";
import Settings from "./pages/settings";
import AdminPanel from "./pages/admin";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import NotFound from "./pages/not-found";
import Pricing from '@/pages/pricing';
import TelegramSupport from './components/TelegramSupport';

function AppContent() {
  const { isAuthenticated, isLoading, hasActiveSubscription, user, checkSubscription } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative">
        <Login />
        <TelegramSupport />
      </div>
    );
  }

  // If user is authenticated but doesn't have active subscription, show pricing
  // This applies to all users except admins
  if (isAuthenticated && !hasActiveSubscription) {
    return (
      <div className="relative">
        <Pricing
          user={user!}
          onSubscriptionComplete={checkSubscription}
        />
        <TelegramSupport />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-white">
      <Sidebar />
      <div className="lg:ml-64 ml-0 min-h-screen">
        <Header />
        <main className="px-2 py-3 sm:p-6 pb-20 lg:pb-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/send" component={Send} />
            <Route path="/history" component={History} />
            <Route path="/charts" component={Charts} />
            <Route path="/settings" component={Settings} />
            <Route path="/admin" component={AdminPanel} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      <TelegramSupport />
    </div>
  );
}

function App() {
  // Open Telegram link when app visibility changes (user leaves/closes tab)
  React.useEffect(() => {
    let hasOpenedTelegram = false;

    const handleVisibilityChange = () => {
      if (document.hidden && !hasOpenedTelegram) {
        hasOpenedTelegram = true;
        window.open('https://t.me/primasoftwares', '_blank');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;