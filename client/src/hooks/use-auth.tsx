import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasActiveSubscription: boolean;
  subscriptionStatus: 'none' | 'pending' | 'active' | 'rejected' | 'expired' | 'canceled';
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkSubscription: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin users who bypass subscription requirements
const ADMIN_USERS = ['admin', 'SoftwareHenry'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'none' | 'pending' | 'active' | 'rejected' | 'expired' | 'canceled'>('none');

  const checkSubscription = async (): Promise<boolean> => {
    if (!user) return false;
    
    // Admin users bypass subscription check (by username or role)
    if (ADMIN_USERS.includes(user.username) || user.role === 'admin') {
      setHasActiveSubscription(true);
      setSubscriptionStatus('active');
      return true;
    }

    try {
      const response = await fetch(`/api/subscriptions/${user.id}`, {
        credentials: 'include', // Essential for Safari iOS
      });
      if (response.ok) {
        const subscription = await response.json();
        const status = subscription.status || 'none';
        setSubscriptionStatus(status);
        const hasActive = status === 'active';
        setHasActiveSubscription(hasActive);
        return hasActive;
      } else if (response.status === 404) {
        // 404 means no subscription found - this is normal for new users
        setHasActiveSubscription(false);
        setSubscriptionStatus('none');
        return false;
      }
      // Other error statuses
      setHasActiveSubscription(false);
      setSubscriptionStatus('none');
      return false;
    } catch (error) {
      console.error('Subscription check error:', error);
      setHasActiveSubscription(false);
      setSubscriptionStatus('none');
      return false;
    }
  };

  useEffect(() => {
    // Check if user is already logged in from localStorage
    try {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          // Check subscription after setting user
          if (userData) {
            checkSubscription();
          }
        } catch (error) {
          // Clear invalid data
          try {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          } catch (e) {
            // Safari private mode may throw
          }
        }
      }
    } catch (e) {
      // localStorage may not be available in Safari private mode
      console.warn('localStorage not available');
    }
    setIsLoading(false);
  }, []);

  // Check subscription when user changes
  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setHasActiveSubscription(false);
      setSubscriptionStatus('none');
    }
  }, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Essential for Safari iOS
      });

      if (response.ok) {
        const data = await response.json();
        
        setUser(data.user);
        
        // Try to save to localStorage, but handle Safari private browsing mode
        try {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('auth_user', JSON.stringify(data.user));
        } catch (e) {
          // Safari in private mode may throw, but session cookies will still work
          console.warn('localStorage not available, using session storage only');
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include', // Essential for Safari iOS
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setHasActiveSubscription(false);
      setSubscriptionStatus('none');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      hasActiveSubscription,
      subscriptionStatus,
      login,
      logout,
      checkSubscription,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
