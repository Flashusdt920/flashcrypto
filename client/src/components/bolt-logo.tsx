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
        className="drop-shadow-2xl"
      >
        {/* Enhanced 4D Effect with Animated Gradients */}
        <defs>
          <linearGradient id="boltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700">
              <animate attributeName="stop-color" values="#FFD700;#FFED4E;#FFD700" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="25%" stopColor="#FFA500">
              <animate attributeName="stop-color" values="#FFA500;#FF8C00;#FFA500" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#FF6B35" />
            <stop offset="75%" stopColor="#F7931E">
              <animate attributeName="stop-color" values="#F7931E;#FFA500;#F7931E" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#FFD700">
              <animate attributeName="stop-color" values="#FFD700;#FFED4E;#FFD700" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          <linearGradient id="boltShadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#CD853F" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feFlood floodColor="#FFD700" floodOpacity="0.5"/>
            <feComposite in2="coloredBlur" operator="in"/>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="blur4D" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5">
              <animate attributeName="stdDeviation" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
            </feGaussianBlur>
          </filter>
        </defs>
        
        {/* Pulsing Background Circle for 4D depth */}
        <circle cx="16" cy="16" r="14" fill="none" stroke="#FFD700" strokeWidth="0.3" opacity="0">
          <animate attributeName="r" values="14;16;14" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;0.5;0" dur="2s" repeatCount="indefinite"/>
        </circle>
        
        {/* Multiple 3D Shadow Layers for Depth */}
        <path
          d="M18 3l-2 1-8 12h6l-4 13 2-1 8-12h-6l4-13z"
          fill="#000000"
          transform="translate(3,3)"
          opacity="0.1"
        />
        
        <path
          d="M18 3l-2 1-8 12h6l-4 13 2-1 8-12h-6l4-13z"
          fill="url(#boltShadow)"
          transform="translate(2,2)"
          opacity="0.3"
        />
        
        {/* Main Bolt Shape with 4D gradient and subtle rotation */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 16 16"
            to="1 16 16"
            dur="10s"
            repeatCount="indefinite"/>
          <path
            d="M18 3l-2 1-8 12h6l-4 13 2-1 8-12h-6l4-13z"
            fill="url(#boltGradient)"
            filter="url(#glow)"
            stroke="#FFD700"
            strokeWidth="0.5"
          />
        </g>
        
        {/* Animated Highlight for 3D effect */}
        <path
          d="M16 3l1 0.5-6 9h4l-3 10 1-0.5 6-9h-4l1-10z"
          fill="#FFFFFF"
          opacity="0.4"
        >
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite"/>
        </path>
        
        {/* Inner energy core with pulsing effect */}
        <path
          d="M15 6l-1 0.2-4 6h2l-2 8 1-0.2 4-6h-2l2-8z"
          fill="#FFFF00"
          opacity="0.8"
        >
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite"/>
        </path>
        
        {/* Energy Sparks for 4D Effect */}
        <g opacity="0.7">
          <circle cx="12" cy="8" r="0.5" fill="#FFD700">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="20" cy="12" r="0.5" fill="#FFA500">
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="14" cy="20" r="0.5" fill="#FFD700">
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        {/* Subtle motion blur lines for speed effect */}
        <g opacity="0.3">
          <line x1="10" y1="7" x2="8" y2="7" stroke="#FFD700" strokeWidth="0.5" filter="url(#blur4D)">
            <animate attributeName="opacity" values="0;0.5;0" dur="1s" repeatCount="indefinite"/>
          </line>
          <line x1="22" y1="14" x2="24" y2="14" stroke="#FFA500" strokeWidth="0.5" filter="url(#blur4D)">
            <animate attributeName="opacity" values="0;0.5;0" dur="1s" begin="0.3s" repeatCount="indefinite"/>
          </line>
          <line x1="12" y1="22" x2="10" y2="22" stroke="#FFD700" strokeWidth="0.5" filter="url(#blur4D)">
            <animate attributeName="opacity" values="0;0.5;0" dur="1s" begin="0.6s" repeatCount="indefinite"/>
          </line>
        </g>
      </svg>
    </div>
  );
};

export const BoltTextLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <BoltLogo size={32} />
      <div className="flex flex-col">
        <span className="font-black text-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent tracking-tight">
          BOLT
        </span>
        <span className="text-[10px] font-bold text-orange-400/80 -mt-1 tracking-[0.2em] uppercase">
          Crypto Flasher
        </span>
      </div>
    </div>
  );
};