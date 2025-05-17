import React from 'react';

interface MegaLuckyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MegaLuckyLogo: React.FC<MegaLuckyLogoProps> = ({ size = 'md', className = '' }) => {
  // Determine size dimensions
  const dimensions = {
    sm: { width: 100, height: 30, textSize: 'text-xs', logoText: 'text-[8px]' },
    md: { width: 160, height: 40, textSize: 'text-sm', logoText: 'text-[10px]' },
    lg: { width: 220, height: 60, textSize: 'text-xl', logoText: 'text-[14px]' },
  };

  const { width, height, textSize, logoText } = dimensions[size];

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Background gradient - using a pill shape instead of rectangle */}
      <div className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full blur-md opacity-40"></div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-purple-500 rounded-full blur-md opacity-40"></div>
      </div>

      {/* Text content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative text-center flex items-center justify-center">
          <h1 className={`font-bold ${textSize} text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500`}>
            <span className="font-normal mr-0.5">Mega</span>
            <span className="font-extrabold">Lucky</span>
          </h1>
          <div className={`${logoText} ml-2 pl-2 border-l border-white/20 text-white/80 tracking-wider`}>WIN BIG TODAY</div>
        </div>
      </div>

      {/* Decorative sparkles */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-150"></div>
      <div className="absolute top-1/2 right-1/5 w-[2px] h-[2px] bg-indigo-300 rounded-full animate-pulse delay-300"></div>
    </div>
  );
};

export default MegaLuckyLogo; 