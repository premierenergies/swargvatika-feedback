
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 bg-saffron-500 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-full animate-float"></div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full"></div>
      </div>
      <div className="text-xl font-bold bg-gradient-to-r from-saffron-500 via-saffron-600 to-green-500 bg-clip-text text-transparent">
        Swarg Vatika Trust
      </div>
    </div>
  );
};

export default Logo;
