import { ChartLine, NotebookPen, History, Settings, LogOut, Menu, X, Shield } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { BoltTextLogo, BoltLogo } from './bolt-logo';

const navItems = [
  { path: '/home', icon: ChartLine, label: 'Dashboard' },
  { path: '/send', icon: NotebookPen, label: 'Send Crypto' },
  { path: '/history', icon: History, label: 'Transaction History' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const adminNavItems = [
  { path: '/admin', icon: Shield, label: 'Admin Panel' },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const isAdmin = user && (user.username === 'admin' || user.username === 'SoftwareHenry' || user.role === 'admin');
  const allNavItems = isAdmin ? [...navItems, ...adminNavItems] : navItems;

  return (
    <>
      {/* Header with Hamburger Menu Button - Always visible */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/home">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <BoltLogo size={24} />
                <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                  Bolt Flasher
                </h1>
              </div>
            </Link>
          </div>
          
          {/* Quick user info on the right */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-muted-foreground">Welcome</p>
              <p className="text-sm font-semibold text-yellow-500">{user?.username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 glass-card border-r border-gray-700 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-700 mt-16">
          <Link href="/home" onClick={() => setIsOpen(false)}>
            <BoltTextLogo className="cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
          <p className="text-sm text-muted-foreground mt-2">Flash Crypto Transactions</p>
        </div>

        <nav className="p-4 space-y-2">
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
                  className={`sidebar-item flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 w-full text-left ${
                    isActive 
                      ? 'bg-accent bg-opacity-20 text-accent' 
                      : 'text-white hover:text-accent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-inherit'}`} />
                  <span>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 text-red-400 hover:bg-red-900 hover:bg-opacity-20 p-3 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}