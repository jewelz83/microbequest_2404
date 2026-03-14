import React from 'react';
import Icon from '../../../components/AppIcon';

const EraBackground = ({ era, className = "" }) => {
  if (!era) return null;

  const getBackgroundElements = () => {
    switch (era?.background) {
      case 'sepia':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            {/* Candlelight effects */}
            <div className="absolute top-10 right-20 w-32 h-32 bg-orange-200 rounded-full opacity-30 animate-pulse" />
            <div className="absolute bottom-20 left-16 w-24 h-24 bg-amber-200 rounded-full opacity-40 animate-bounce-gentle" />
            
            {/* Parchment texture overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, #8B4513 1px, transparent 1px),
                                 radial-gradient(circle at 75% 75%, #D2B48C 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }} />
            </div>
          </div>
        );
        
      case 'victorian':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
            {/* Gas lamp effects */}
            <div className="absolute top-16 left-10 w-40 h-40 bg-green-200 rounded-full opacity-25 animate-pulse" />
            <div className="absolute bottom-32 right-12 w-28 h-28 bg-emerald-300 rounded-full opacity-30" />
            
            {/* Victorian pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full" style={{
                backgroundImage: `repeating-linear-gradient(45deg, 
                                 transparent, transparent 10px, 
                                 rgba(0,100,0,0.1) 10px, rgba(0,100,0,0.1) 20px)`
              }} />
            </div>
          </div>
        );
        
      case 'modern':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
            {/* Electric light effects */}
            <div className="absolute top-12 right-24 w-36 h-36 bg-blue-200 rounded-full opacity-20 animate-pulse" />
            <div className="absolute bottom-16 left-20 w-32 h-32 bg-sky-300 rounded-full opacity-25" />
            
            {/* Modern grid overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }} />
            </div>
          </div>
        );
        
      case 'hightech':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
            {/* Computer screen glows */}
            <div className="absolute top-20 left-16 w-44 h-44 bg-purple-200 rounded-full opacity-20 animate-pulse" />
            <div className="absolute bottom-24 right-16 w-36 h-36 bg-violet-300 rounded-full opacity-25" />
            
            {/* Circuit board pattern */}
            <div className="absolute inset-0 opacity-8">
              <div className="w-full h-full" style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(147,51,234,0.1) 2px, transparent 2px)`,
                backgroundSize: '30px 30px'
              }} />
            </div>
          </div>
        );
        
      case 'futuristic':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
            {/* Holographic effects */}
            <div className="absolute top-14 right-20 w-48 h-48 bg-cyan-200 rounded-full opacity-15 animate-pulse" />
            <div className="absolute bottom-20 left-24 w-40 h-40 bg-blue-300 rounded-full opacity-20" />
            
            {/* Digital grid */}
            <div className="absolute inset-0 opacity-6">
              <div className="w-full h-full" style={{
                backgroundImage: `linear-gradient(0deg, rgba(6,182,212,0.1) 50%, transparent 50%),
                                 linear-gradient(90deg, rgba(6,182,212,0.1) 50%, transparent 50%)`,
                backgroundSize: '40px 40px'
              }} />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-slate-100" />
        );
    }
  };

  const getFloatingElements = () => {
    const elements = [];
    const count = 12;
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 8 + 4;
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 10;
      const duration = Math.random() * 15 + 10;
      
      elements?.push(
        <div
          key={i}
          className="absolute rounded-full opacity-20 animate-float"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: getFloatingElementColor(),
            animationDelay: `${animationDelay}s`,
            animationDuration: `${duration}s`
          }}
        />
      );
    }
    return elements;
  };

  const getFloatingElementColor = () => {
    const colors = {
      sepia: '#D2691E',
      victorian: '#228B22',
      modern: '#4169E1',
      hightech: '#8A2BE2',
      futuristic: '#00CED1'
    };
    return colors?.[era?.background] || '#808080';
  };

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Background Gradient */}
      {getBackgroundElements()}
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        {getFloatingElements()}
      </div>
      
      {/* Era-specific decorative elements */}
      <div className="absolute inset-0">
        {era?.background === 'sepia' && (
          <>
            {/* Candles */}
            <Icon 
              name="Flame" 
              size={32} 
              className="absolute top-24 right-16 text-orange-400 opacity-60 animate-flicker" 
            />
            <Icon 
              name="Flame" 
              size={28} 
              className="absolute bottom-32 left-12 text-amber-500 opacity-50 animate-flicker" 
            />
          </>
        )}
        
        {era?.background === 'victorian' && (
          <>
            {/* Gas lamps */}
            <Icon 
              name="Lightbulb" 
              size={36} 
              className="absolute top-20 left-16 text-green-500 opacity-40 animate-pulse" 
            />
            <Icon 
              name="Lightbulb" 
              size={32} 
              className="absolute bottom-28 right-20 text-emerald-600 opacity-35" 
            />
          </>
        )}
        
        {era?.background === 'modern' && (
          <>
            {/* Electric elements */}
            <Icon 
              name="Zap" 
              size={40} 
              className="absolute top-16 right-12 text-blue-400 opacity-30 animate-pulse" 
            />
            <Icon 
              name="Battery" 
              size={36} 
              className="absolute bottom-24 left-16 text-sky-500 opacity-25" 
            />
          </>
        )}
        
        {era?.background === 'hightech' && (
          <>
            {/* Computer elements */}
            <Icon 
              name="Monitor" 
              size={44} 
              className="absolute top-12 left-20 text-purple-400 opacity-25 animate-pulse" 
            />
            <Icon 
              name="Cpu" 
              size={38} 
              className="absolute bottom-20 right-24 text-violet-500 opacity-30" 
            />
          </>
        )}
        
        {era?.background === 'futuristic' && (
          <>
            {/* Futuristic elements */}
            <Icon 
              name="Rocket" 
              size={48} 
              className="absolute top-16 right-16 text-cyan-400 opacity-20 animate-bounce-gentle" 
            />
            <Icon 
              name="Satellite" 
              size={42} 
              className="absolute bottom-16 left-20 text-blue-500 opacity-25 animate-pulse" 
            />
          </>
        )}
      </div>
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-background/10" />
    </div>
  );
};

export default EraBackground;