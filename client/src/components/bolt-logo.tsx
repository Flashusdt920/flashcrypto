import React from 'react';

interface BoltLogoProps {
  size?: number;
  className?: string;
}

export const BoltLogo: React.FC<BoltLogoProps> = ({ size = 32, className = "" }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* 4D Effect Background Shadow */}
        <defs>
          <linearGradient id="boltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="25%" stopColor="#FFA500" />
            <stop offset="50%" stopColor="#FF6B35" />
            <stop offset="75%" stopColor="#F7931E" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
          <linearGradient id="boltShadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#CD853F" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* 3D Shadow Effect */}
        <path
          d="M18 3l-2 1-8 12h6l-4 13 2-1 8-12h-6l4-13z"
          fill="url(#boltShadow)"
          transform="translate(2,2)"
          opacity="0.3"
        />
        
        {/* Main Bolt Shape with 4D gradient */}
        <path
          d="M18 3l-2 1-8 12h6l-4 13 2-1 8-12h-6l4-13z"
          fill="url(#boltGradient)"
          filter="url(#glow)"
          stroke="#FFD700"
          strokeWidth="0.5"
        />
        
        {/* Highlight for 3D effect */}
        <path
          d="M16 3l1 0.5-6 9h4l-3 10 1-0.5 6-9h-4l1-10z"
          fill="#FFFFFF"
          opacity="0.4"
        />
        
        {/* Inner energy lines */}
        <path
          d="M15 6l-1 0.2-4 6h2l-2 8 1-0.2 4-6h-2l2-8z"
          fill="#FFFF00"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};

export const BoltTextLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <BoltLogo size={28} />
      <span className="font-bold text-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
        Bolt Crypto Flasher
      </span>
    </div>
  );
};