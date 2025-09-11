import React from 'react';

interface CustomIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const CustomIcon: React.FC<CustomIconProps> = ({ 
  size = 24, 
  className,
  style 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Background Circle */}
      <circle cx="32" cy="32" r="30" fill="url(#gradient1)" stroke="url(#gradient2)" strokeWidth="2"/>
      
      {/* Main Magnifying Glass */}
      <g transform="translate(6, 6)">
        {/* Search Circle Background */}
        <circle cx="22" cy="22" r="18" fill="white" stroke="white" strokeWidth="2"/>
        
        {/* Search Circle Border */}
        <circle cx="22" cy="22" r="18" stroke="#1D4ED8" strokeWidth="3" fill="none"/>
        
        {/* Search Handle */}
        <path d="M36 36L48 48" stroke="#1D4ED8" strokeWidth="5" strokeLinecap="round"/>
        
        {/* Pills/Capsules inside */}
        <g transform="translate(10, 10)">
          {/* Pill 1 */}
          <ellipse cx="8" cy="6" rx="6" ry="3" fill="#1D4ED8" transform="rotate(25 8 6)"/>
          <ellipse cx="5" cy="6" rx="3" ry="3" fill="#3B82F6" transform="rotate(25 5 6)"/>
          
          {/* Pill 2 */}
          <ellipse cx="18" cy="18" rx="6" ry="3" fill="#1D4ED8" transform="rotate(-15 18 18)"/>
          <ellipse cx="21" cy="18" rx="3" ry="3" fill="#60A5FA" transform="rotate(-15 21 18)"/>
          
          {/* Connection Network */}
          <circle cx="6" cy="12" r="2" fill="#1D4ED8"/>
          <circle cx="14" cy="8" r="2" fill="#1D4ED8"/>
          <circle cx="20" cy="14" r="2" fill="#1D4ED8"/>
          <circle cx="12" cy="20" r="2" fill="#1D4ED8"/>
          
          {/* Network Lines */}
          <path d="M6 12L14 8M14 8L20 14M20 14L12 20M12 20L6 12" stroke="#1D4ED8" strokeWidth="1.5"/>
          
          {/* Medical Shield */}
          <g transform="translate(16, 2)">
            <path d="M4 0C2 0 0 1 0 2V6C0 9 2 12 4 13C6 12 8 9 8 6V2C8 1 6 0 4 0Z" 
                  fill="#10B981"/>
            {/* Cross in shield */}
            <rect x="3.5" y="2" width="1" height="6" fill="white"/>
            <rect x="1.5" y="4" width="5" height="1" fill="white"/>
          </g>
        </g>
      </g>
      
      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#1D4ED8', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#1E40AF', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#60A5FA', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#2563EB', stopOpacity:1}} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CustomIcon;
