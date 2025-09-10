import { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset to 24 hours when timer reaches 0
          return { hours: 23, minutes: 59, seconds: 59 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
          <span className="text-white font-semibold">LIMITED TIME OFFER</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm">Ends Soon</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <div className="bg-black/50 rounded-lg px-3 py-2 min-w-[60px]">
            <div className="text-2xl font-bold text-white">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-400">HOURS</div>
          </div>
        </div>
        
        <div className="text-white text-2xl">:</div>
        
        <div className="text-center">
          <div className="bg-black/50 rounded-lg px-3 py-2 min-w-[60px]">
            <div className="text-2xl font-bold text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-400">MINS</div>
          </div>
        </div>
        
        <div className="text-white text-2xl">:</div>
        
        <div className="text-center">
          <div className="bg-black/50 rounded-lg px-3 py-2 min-w-[60px]">
            <div className="text-2xl font-bold text-red-400">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-400">SECS</div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-yellow-400 text-sm font-medium">
          🔥 20% OFF All Plans - Don't Miss Out!
        </p>
      </div>
    </div>
  );
}