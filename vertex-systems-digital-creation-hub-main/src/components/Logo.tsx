import React from 'react';

interface LogoProps {
  className?: string;
  glow?: boolean;
}

export default function Logo({ className = "h-12 w-auto", glow = false }: LogoProps) {
  return (
    <div className={`relative flex items-center group transition-all duration-500 ${className}`}>
      {/* Hidden SVG Filter to strip black background (turning it into transparency) */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="remove-black-bg" colorInterpolationFilters="sRGB">
            {/* 
              This matrix sets Alpha = (R + G + B) * 1.5 - 0.5
              This effectively makes black pixels transparent and keeps silver pixels opaque.
            */}
            <feColorMatrix 
              type="matrix" 
              values="1 0 0 0 0 
                      0 1 0 0 0 
                      0 0 1 0 0 
                      1 1 1 0 -1" 
            />
          </filter>
        </defs>
      </svg>

      {/* Background Glow */}
      {glow && (
        <div className="absolute inset-0 bg-blue-600/30 blur-[40px] rounded-full scale-150 animate-pulse" />
      )}
      
      {/* The Logo Image with the Filter Applied */}
      <img 
        src="/logo.png" 
        alt="Vertex Systems Logo" 
        className="h-full w-auto object-contain relative z-10"
        style={{ 
          filter: 'url(#remove-black-bg)',
          display: 'block'
        }} 
      />
    </div>
  );
}
