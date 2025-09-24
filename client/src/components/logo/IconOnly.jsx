import React from 'react'

const IconOnly = ({ size = "default" }) => {
  const sizeClasses = {
    small: "w-14 h-14",
    default: "w-20 h-20",
    large: "w-24 h-24"
  };

  const textSizeClasses = {
    small: "text-2xl",
    default: "text-4xl",
    large: "text-5xl"
  };

  return (
    <div className="flex items-center justify-center gap-4 group">
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center relative shadow-lg shadow-emerald-500/30 group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-105`}>
        {/* Wallet Icon */}
        <div className="w-8 h-8 bg-white rounded-lg relative flex items-center justify-center shadow-inner">
          <span className="text-xl font-bold text-emerald-500">B</span>
          {/* Coin indicator */}
          <div className="absolute -top-1 -right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-white">₹</span>
          </div>
        </div>
        
        {/* Floating Coins Animation */}
        <div className="absolute -top-3 -right-3">
          <div className="w-4 h-4 bg-amber-400 rounded-full absolute animate-bounce shadow-sm" style={{ animationDelay: '0s' }}></div>
          <div className="w-4 h-4 bg-amber-400 rounded-full absolute top-1 right-2 animate-bounce shadow-sm" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-amber-400 rounded-full absolute -top-1 right-4 animate-bounce shadow-sm" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default IconOnly;