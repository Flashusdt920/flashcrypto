import { ChartLine, NotebookPen, History, Settings, LogOut, Menu, X, Shield, Home, Send, Activity, LayoutGrid } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { BoltTextLogo, BoltLogo } from './bolt-logo';
import { useLanguage } from './MultiLanguage';

const createNavItems = (t: (key: string) => string) => [
  { path: '/home', icon: LayoutGrid, label: 'Dashboard', description: 'Overview & Analytics' },
  { path: '/send', icon: Send, label: 'Send Transaction', description: 'Flash Transfer' },
  { path: '/history', icon: Activity, label: 'Transaction History', description: 'View All Activity' },
  { path: '/settings', icon: Settings, label: 'Settings', description: 'Preferences & Security' },
];

const adminNavItems = [
  { path: '/admin', icon: Shield, label: 'Admin Control', description: 'System Management' },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  
  const navItems = createNavItems(t);
  const isAdmin = user && (user.username === 'admin' || user.username === 'SoftwareHenry' || user.role === 'admin');
  const allNavItems = isAdmin ? [...navItems, ...adminNavItems] : navItems;

  return (
    <>
      {/* Premium Enterprise Header */}
      <div className="fixed top-0 left-0 right-0 z-50 enterprise-header px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Premium Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 group w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />
              )}
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-500/0 to-yellow-600/0 group-hover:from-yellow-500/10 group-hover:to-yellow-600/10 transition-all duration-300"></span>
            </button>

            {/* Premium Brand */}
            <Link href="/home">
              <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                <div className="relative">
                  <BoltLogo size={24} className="relative z-10" />
                  <div className="absolute inset-0 bg-yellow-500/30 blur-xl group-hover:bg-yellow-500/50 transition-all duration-300"></div>
                </div>
                <div>
                  <h1 className="text-base sm:text-xl font-bold text-gold-gradient tracking-tight">
                    BOLT FLASHER
                  </h1>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider">Enterprise Platform</p>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Premium User Info - Mobile Optimized */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-yellow-500/10">
              <div className="status-online"></div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">System Online</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wider font-medium hidden sm:block">Authenticated User</p>
              <p className="text-xs sm:text-sm font-bold text-gold tracking-tight">{user?.username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Enterprise Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 sm:w-72 enterprise-sidebar z-50 transform transition-all duration-500 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="px-6 py-8 mt-16 border-b border-yellow-500/10">
          <Link href="/home" onClick={() => setIsOpen(false)}>
            <div className="group">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 flex items-center justify-center">
                    <BoltLogo size={24} />
                  </div>
                  <div className="absolute inset-0 bg-yellow-500/20 blur-xl"></div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Bolt Flasher</h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Professional Suite</p>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="px-4 py-6 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium px-3 mb-3">Main Navigation</p>
          
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
              >
                <button
                  className={`enterprise-nav-item flex items-center w-full px-3 py-3 group ${
                    isActive ? 'active' : ''
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <div className={`mr-3 p-2 rounded-lg ${
                      isActive 
                        ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10' 
                        : 'bg-gray-800/30 group-hover:bg-gray-800/50'
                    } transition-all duration-300`}>
                      <Icon className={`w-5 h-5 ${
                        isActive ? 'text-yellow-500' : 'text-gray-400 group-hover:text-yellow-500'
                      } transition-colors duration-300`} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-semibold ${
                        isActive ? 'text-yellow-500' : 'text-gray-200 group-hover:text-white'
                      } transition-colors duration-300`}>
                        {item.label}
                      </p>
                      <p className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                  )}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Premium Features Section */}
        <div className="px-4 py-4 border-t border-yellow-500/10">
          <div className="px-3 py-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium mb-2">Platform Status</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Network</span>
                <span className="text-green-400 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">API Status</span>
                <span className="text-green-400 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Security</span>
                <span className="text-yellow-500 font-medium">Max Level</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-6 border-t border-yellow-500/10">
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 transition-all duration-300 group"
          >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-sm font-semibold tracking-wide">Sign Out</span>
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-[10px] text-gray-500">© 2025 Bolt Flasher Enterprise</p>
            <p className="text-[9px] text-gray-600 mt-1">Version 3.0.0 Professional</p>
          </div>
        </div>
      </div>
    </>
  );
}