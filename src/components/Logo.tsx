import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  // Determine size dimensions
  const dimensions = {
    sm: { height: 30, textSize: 'text-base' },
    md: { height: 40, textSize: 'text-xl' },
    lg: { height: 60, textSize: 'text-3xl' },
  };

  const { height, textSize } = dimensions[size];
  
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/MegaLuckyLogo.png"
        alt="MegaLucky Logo" 
        style={{ height: `${height}px` }}
        className="mr-2"
      />
      <span 
        className={`${textSize} font-bold`}
        style={{ 
          color: '#196539',
          fontFamily: 'Segoe TV Bold, Segoe UI, sans-serif',
          fontWeight: 'bold'
        }}
      >
        MegaLucky
      </span>
    </div>
  );
};

export default Logo; 