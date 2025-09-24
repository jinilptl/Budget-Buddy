const AppIcon = ({ size = "default" }) => {
  const sizeClasses = {
    small: "w-16 h-16",
    default: "w-20 h-20",
    large: "w-24 h-24"
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center relative shadow-2xl group cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-3`}>
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
      
      <span className="text-3xl font-bold text-white relative z-10 group-hover:scale-110 transition-transform duration-300">₹</span>
      
      {/* Corner indicator */}
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-xs font-bold text-white">+</span>
      </div>
    </div>
  );
};

export default AppIcon;