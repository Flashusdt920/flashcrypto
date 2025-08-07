import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export function useKeyboardShortcuts() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const isInputFocused = document.activeElement?.tagName === 'INPUT' || 
                            document.activeElement?.tagName === 'TEXTAREA';
      
      if (isInputFocused && !e.ctrlKey && !e.metaKey) return;

      // Ctrl/Cmd + K - Quick search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toast({
          title: "Quick Search",
          description: "Quick search activated (Feature coming soon)",
        });
      }

      // Ctrl/Cmd + S - Send transaction
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setLocation('/send');
      }

      // Ctrl/Cmd + D - Dashboard
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setLocation('/dashboard');
      }

      // Ctrl/Cmd + H - History
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setLocation('/history');
      }

      // Ctrl/Cmd + P - Pricing
      if ((e.ctrlKey || e.metaKey) && e.key === 'p' && !e.shiftKey) {
        e.preventDefault();
        setLocation('/pricing');
      }

      // Ctrl/Cmd + , - Settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setLocation('/settings');
      }

      // Ctrl/Cmd + Shift + L - Logout
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        window.location.href = '/api/logout';
      }

      // ? - Show shortcuts help
      if (e.key === '?' && !isInputFocused) {
        e.preventDefault();
        showShortcutsHelp();
      }

      // Escape - Close modals
      if (e.key === 'Escape') {
        // This will be handled by individual modal components
        document.dispatchEvent(new CustomEvent('closeModal'));
      }
    };

    const showShortcutsHelp = () => {
      toast({
        title: "Keyboard Shortcuts",
        description: `• Ctrl/Cmd + S - Send Transaction
• Ctrl/Cmd + D - Dashboard
• Ctrl/Cmd + H - History
• Ctrl/Cmd + P - Pricing
• Ctrl/Cmd + , - Settings
• Ctrl/Cmd + K - Quick Search
• ? - Show this help`,
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setLocation, toast]);
}