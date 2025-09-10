import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export default function TelegramButton() {
  const telegramUsername = "PRIMASOFTWARES";
  const telegramUrl = `https://t.me/${telegramUsername}`;

  const handleClick = () => {
    window.open(telegramUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
        size="icon"
        title="Contact us on Telegram"
      >
        <svg 
          className="h-7 w-7 text-white group-hover:scale-110 transition-transform"
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
        </svg>
      </Button>
      
      {/* Tooltip on hover */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
          <div className="font-semibold">Need Help?</div>
          <div className="text-gray-300">Chat with us on Telegram</div>
          <div className="text-blue-400">@{telegramUsername}</div>
        </div>
        <div className="absolute top-full right-6 -mt-1">
          <div className="border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
}