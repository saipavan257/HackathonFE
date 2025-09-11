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
      <g transform="translate(8, 8)">
        {/* Lens Glass Effect Background */}
        <circle cx="20" cy="20" r="16" fill="url(#lensGradient)" stroke="#E5E7EB" strokeWidth="1"/>
        
        {/* Lens Border (Thick Chrome Ring) */}
        <circle cx="20" cy="20" r="16" stroke="url(#chromeGradient)" strokeWidth="4" fill="none"/>
        
        {/* Inner Lens Glass */}
        <circle cx="20" cy="20" r="13" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
        
        {/* Lens Highlight */}
        <circle cx="17" cy="17" r="4" fill="rgba(255,255,255,0.6)"/>
        <circle cx="16" cy="16" r="2" fill="rgba(255,255,255,0.8)"/>
        
        {/* Magnifying Glass Handle */}
        <path d="M32 32L44 44" stroke="url(#handleGradient)" strokeWidth="6" strokeLinecap="round"/>
        <path d="M32 32L44 44" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
        
        {/* Pharmaceutical Capsules inside lens */}
        <g transform="translate(6, 6)">
          {/* Capsule 1 - Large Blue/White */}
          <g transform="rotate(35 12 8)">
            <rect x="8" y="6" width="8" height="4" rx="2" ry="2" fill="#1D4ED8"/>
            <rect x="8" y="6" width="4" height="4" rx="2" ry="2" fill="#3B82F6"/>
            <rect x="12" y="6" width="4" height="4" rx="2" ry="2" fill="#FFFFFF"/>
            {/* Capsule shine */}
            <rect x="9" y="7" width="1" height="2" rx="0.5" fill="rgba(255,255,255,0.6)"/>
          </g>
          
          {/* Capsule 2 - Medium Red/Yellow */}
          <g transform="rotate(-20 20 18)">
            <rect x="16" y="16" width="8" height="4" rx="2" ry="2" fill="#DC2626"/>
            <rect x="16" y="16" width="4" height="4" rx="2" ry="2" fill="#EF4444"/>
            <rect x="20" y="16" width="4" height="4" rx="2" ry="2" fill="#FDE047"/>
            {/* Capsule shine */}
            <rect x="17" y="17" width="1" height="2" rx="0.5" fill="rgba(255,255,255,0.5)"/>
          </g>
          
          {/* Capsule 3 - Small Green */}
          <g transform="rotate(10 8 22)">
            <rect x="6" y="20" width="6" height="3" rx="1.5" ry="1.5" fill="#059669"/>
            <rect x="6" y="20" width="3" height="3" rx="1.5" ry="1.5" fill="#10B981"/>
            <rect x="9" y="20" width="3" height="3" rx="1.5" ry="1.5" fill="#FFFFFF"/>
          </g>
          
          {/* Pills (Round tablets) */}
          <circle cx="24" cy="10" r="2.5" fill="#8B5CF6" opacity="0.9"/>
          <circle cx="24" cy="10" r="1.5" fill="#A855F7" opacity="0.7"/>
          <circle cx="24" cy="10" r="0.5" fill="rgba(255,255,255,0.8)"/>
          
          <circle cx="10" cy="24" r="2" fill="#F59E0B" opacity="0.9"/>
          <circle cx="10" cy="24" r="1.2" fill="#FBBF24" opacity="0.7"/>
          
          {/* Medical Cross Symbol */}
          <g transform="translate(18, 22)">
            <circle cx="2" cy="2" r="3" fill="#EF4444"/>
            <rect x="1.2" y="0.5" width="1.6" height="3" fill="white" rx="0.3"/>
            <rect x="0.5" y="1.2" width="3" height="1.6" fill="white" rx="0.3"/>
          </g>
        </g>
      </g>
      
      {/* Gradients */}
      <defs>
        {/* Background Gradients */}
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#1D4ED8', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#1E40AF', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#60A5FA', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#2563EB', stopOpacity:1}} />
        </linearGradient>
        
        {/* Lens Glass Effect */}
        <radialGradient id="lensGradient" cx="30%" cy="30%">
          <stop offset="0%" style={{stopColor:'rgba(255,255,255,0.8)', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'rgba(255,255,255,0.4)', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'rgba(255,255,255,0.1)', stopOpacity:1}} />
        </radialGradient>
        
        {/* Chrome Ring Effect */}
        <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#E5E7EB', stopOpacity:1}} />
          <stop offset="25%" style={{stopColor:'#F3F4F6', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#9CA3AF', stopOpacity:1}} />
          <stop offset="75%" style={{stopColor:'#D1D5DB', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#6B7280', stopOpacity:1}} />
        </linearGradient>
        
        {/* Handle Gradient */}
        <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#4B5563', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#6B7280', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#374151', stopOpacity:1}} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CustomIcon;
