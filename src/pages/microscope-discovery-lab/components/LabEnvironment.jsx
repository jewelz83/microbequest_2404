import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const LabEnvironment = ({ 
  isActive = true, 
  onEquipmentInteract,
  className = "" 
}) => {
  const [animatedElements, setAnimatedElements] = useState(new Set());
  const [bubbles, setBubbles] = useState([]);
  const [steamParticles, setSteamParticles] = useState([]);

  // Generate floating bubbles for beakers
  useEffect(() => {
    if (isActive) {
      const bubbleInterval = setInterval(() => {
        const newBubble = {
          id: Date.now() + Math.random(),
          x: 15 + Math.random() * 15, // Beaker area
          y: 85,
          size: 2 + Math.random() * 4,
          duration: 3 + Math.random() * 2
        };
        
        setBubbles(prev => [...prev?.slice(-12), newBubble]);
      }, 1200);

      // Generate steam particles
      const steamInterval = setInterval(() => {
        const newSteam = {
          id: Date.now() + Math.random() + 1000,
          x: 20 + Math.random() * 8,
          y: 65,
          duration: 4 + Math.random() * 2
        };
        
        setSteamParticles(prev => [...prev?.slice(-6), newSteam]);
      }, 2000);

      return () => {
        clearInterval(bubbleInterval);
        clearInterval(steamInterval);
      };
    }
  }, [isActive]);

  // Clean up old bubbles and steam
  useEffect(() => {
    const cleanup = setInterval(() => {
      setBubbles(prev => prev?.filter(bubble => 
        Date.now() - bubble?.id < bubble?.duration * 1000
      ));
      setSteamParticles(prev => prev?.filter(steam => 
        Date.now() - steam?.id < steam?.duration * 1000
      ));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  const handleElementClick = (elementType, elementId) => {
    setAnimatedElements(prev => new Set([...prev, elementId]));
    onEquipmentInteract && onEquipmentInteract(elementType, elementId);
    
    setTimeout(() => {
      setAnimatedElements(prev => {
        const newSet = new Set(prev);
        newSet?.delete(elementId);
        return newSet;
      });
    }, 1200);
  };

  const labEquipment = [
    {
      id: 'microscope-main',
      type: 'microscope',
      x: 42,
      y: 35,
      width: 20,
      height: 30,
      interactive: true,
      description: 'Professional Research Microscope - Zeiss Model'
    },
    {
      id: 'beaker-1',
      type: 'beaker',
      x: 12,
      y: 62,
      width: 10,
      height: 22,
      interactive: true,
      description: 'Culture Growth Medium - E.coli Nutrients'
    },
    {
      id: 'beaker-2',
      type: 'beaker',
      x: 25,
      y: 67,
      width: 8,
      height: 18,
      interactive: true,
      description: 'Sterile Nutrient Broth - pH 7.2'
    },
    {
      id: 'petri-dish',
      type: 'petri',
      x: 68,
      y: 72,
      width: 12,
      height: 12,
      interactive: true,
      description: 'Agar Plates - Active Bacterial Colonies'
    },
    {
      id: 'test-tubes',
      type: 'tubes',
      x: 78,
      y: 58,
      width: 10,
      height: 28,
      interactive: true,
      description: 'Sample Collection Tubes - Various Specimens'
    },
    {
      id: 'centrifuge',
      type: 'centrifuge',
      x: 65,
      y: 45,
      width: 14,
      height: 16,
      interactive: true,
      description: 'High-Speed Centrifuge - 15000 RPM'
    },
    {
      id: 'incubator',
      type: 'incubator',
      x: 8,
      y: 25,
      width: 16,
      height: 20,
      interactive: true,
      description: 'Temperature Controlled Incubator - 37°C'
    }
  ];

  return (
    <div className={`relative w-full h-full bg-gradient-to-b from-slate-100 via-blue-50 to-slate-200 rounded-lg overflow-hidden border-2 border-slate-300 shadow-inner ${className}`}>
      {/* Realistic Laboratory Background */}
      <div className="absolute inset-0">
        {/* Lab Bench - More realistic materials */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-400 via-gray-300 to-gray-250 border-t-4 border-gray-500 shadow-inner">
          {/* Bench texture and wear marks */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/30 to-transparent opacity-50"></div>
          <div className="absolute bottom-2 left-4 w-16 h-1 bg-gray-400/60 rounded-full"></div>
          <div className="absolute bottom-4 right-8 w-12 h-0.5 bg-gray-400/60 rounded-full"></div>
        </div>
        
        {/* Professional Laboratory Wall */}
        <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-slate-50 to-blue-50/80">
          {/* Clean room tiles pattern */}
          <div className="absolute inset-0 opacity-15">
            {[...Array(20)]?.map((_, i) => (
              <div
                key={i}
                className="absolute border border-blue-200/40"
                style={{
                  left: `${(i % 5) * 20}%`,
                  top: `${Math.floor(i / 5) * 16.66}%`,
                  width: '20%',
                  height: '16.66%'
                }}
              >
                {/* Subtle tile joints */}
                <div className="absolute inset-0 border border-slate-300/20"></div>
              </div>
            ))}
          </div>
          
          {/* Wall mounted equipment shadows */}
          <div className="absolute top-8 right-12 w-8 h-6 bg-slate-300/20 rounded-sm blur-sm"></div>
          <div className="absolute top-16 left-8 w-6 h-4 bg-slate-300/20 rounded-sm blur-sm"></div>
        </div>

        {/* Advanced Lighting System */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gradient-to-r from-transparent via-yellow-100/80 to-transparent rounded-full shadow-moderate">
          {/* LED strip indicators */}
          <div className="absolute top-1 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse-soft"></div>
          <div className="absolute top-1 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse-soft delay-75"></div>
        </div>
        
        {/* Professional light beam with realistic falloff */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-56 h-32 bg-gradient-to-b from-yellow-100/30 via-yellow-50/20 to-transparent rounded-b-3xl blur-sm"></div>
        
        {/* Ambient room lighting */}
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-radial from-yellow-50/10 via-transparent to-slate-100/20 opacity-60"></div>
      </div>

      {/* Advanced Laboratory Equipment */}
      {labEquipment?.map((equipment) => (
        <div
          key={equipment?.id}
          className={`absolute cursor-pointer transition-all duration-300 group ${
            animatedElements?.has(equipment?.id) ? 'animate-bounce-gentle scale-105' : 'hover:scale-102'
          }`}
          style={{
            left: `${equipment?.x}%`,
            top: `${equipment?.y}%`,
            width: `${equipment?.width}%`,
            height: `${equipment?.height}%`
          }}
          onClick={() => equipment?.interactive && handleElementClick(equipment?.type, equipment?.id)}
        >
          {/* Professional Equipment Rendering */}
          {equipment?.type === 'microscope' && (
            <div className="relative w-full h-full">
              {/* Advanced Microscope Base */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-gradient-to-t from-gray-800 via-gray-700 to-gray-600 rounded-lg shadow-pronounced border border-gray-900">
                {/* Base details and branding */}
                <div className="absolute top-2 left-2 w-3 h-1 bg-blue-400 rounded-sm"></div>
                <div className="absolute bottom-1 right-2 text-xs font-mono text-gray-400 opacity-60">ZEISS</div>
              </div>
              
              {/* Microscope Arm with realistic joints */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-4 h-16 bg-gradient-to-t from-gray-700 via-gray-600 to-gray-550 rounded-t-lg shadow-moderate">
                {/* Joint details */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-800 rounded-full"></div>
                <div className="absolute top-8 left-0 right-0 h-1 bg-gray-800 rounded-full"></div>
              </div>
              
              {/* Professional Microscope Head */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-lg shadow-pronounced border border-gray-900">
                {/* Eyepiece */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-black rounded-t-full border border-gray-600"></div>
                {/* Active LED indicator */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-blue-400 rounded-full animate-pulse-soft shadow-glow"></div>
                {/* Objective lenses */}
                <div className="absolute bottom-0 left-1/4 w-2 h-1 bg-gray-300 rounded-b-full"></div>
                <div className="absolute bottom-0 right-1/4 w-2 h-1 bg-gray-300 rounded-b-full"></div>
              </div>
              
              {/* Stage with sample holder */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-gradient-to-r from-gray-500 to-gray-400 rounded-sm shadow-moderate">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-gray-300 rounded-sm"></div>
              </div>
            </div>
          )}

          {equipment?.type === 'beaker' && (
            <div className="relative w-full h-full">
              {/* Professional Glass Beaker */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-5/6 bg-gradient-to-b from-blue-100/20 via-blue-50/40 to-blue-100/60 border-2 border-gray-400 rounded-b-lg shadow-moderate backdrop-blur-sm">
                {/* Graduated markings */}
                <div className="absolute right-0 top-2 w-2 h-px bg-gray-600 opacity-60"></div>
                <div className="absolute right-0 top-4 w-3 h-px bg-gray-600 opacity-60"></div>
                <div className="absolute right-0 top-6 w-2 h-px bg-gray-600 opacity-60"></div>
                
                {/* Active Culture Liquid */}
                <div className="absolute bottom-0 left-0 right-0 h-4/5 bg-gradient-to-t from-emerald-400/70 via-emerald-300/60 to-emerald-200/50 rounded-b-lg animate-pulse-soft">
                  {/* Liquid surface tension */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-emerald-500/80 rounded-full"></div>
                  {/* Micro-bubbles */}
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-emerald-100/80 rounded-full animate-bounce-gentle"></div>
                  <div className="absolute bottom-4 right-3 w-0.5 h-0.5 bg-emerald-100/80 rounded-full animate-bounce-gentle delay-100"></div>
                </div>
              </div>
              
              {/* Professional Spout */}
              <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-br from-gray-300 to-gray-400 rounded-tr-lg border-r border-t border-gray-500"></div>
              
              {/* Beaker Label */}
              <div className="absolute top-1 left-1 bg-white/90 border border-gray-300 rounded-sm px-1 py-0.5">
                <span className="text-xs font-mono text-gray-700">500mL</span>
              </div>
            </div>
          )}

          {equipment?.type === 'petri' && (
            <div className="relative w-full h-full">
              {/* Professional Petri Dish */}
              <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded-full border-2 border-gray-400 shadow-pronounced relative overflow-hidden">
                {/* Agar medium */}
                <div className="absolute inset-1 bg-gradient-to-br from-yellow-100/80 to-amber-50/90 rounded-full"></div>
                
                {/* Realistic Bacterial Colonies */}
                <div className="absolute top-3 left-3 w-3 h-3 bg-gradient-radial from-yellow-400 to-orange-500 rounded-full opacity-85 shadow-moderate">
                  {/* Colony texture */}
                  <div className="absolute inset-0.5 bg-yellow-300/60 rounded-full"></div>
                </div>
                <div className="absolute bottom-4 right-3 w-4 h-4 bg-gradient-radial from-emerald-400 to-green-600 rounded-full opacity-85 shadow-moderate">
                  <div className="absolute inset-0.5 bg-emerald-300/60 rounded-full"></div>
                  {/* Growth pattern */}
                  <div className="absolute top-1 left-1 w-1 h-1 bg-emerald-200/80 rounded-full"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-gradient-radial from-purple-400 to-violet-600 rounded-full opacity-85 animate-pulse-soft shadow-moderate">
                  <div className="absolute inset-0.5 bg-purple-300/60 rounded-full"></div>
                </div>
                
                {/* Dish lid reflection */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-full"></div>
              </div>
            </div>
          )}

          {equipment?.type === 'tubes' && (
            <div className="relative w-full h-full flex justify-center items-end space-x-1">
              {[...Array(4)]?.map((_, i) => (
                <div key={i} className="relative group">
                  {/* Professional Test Tube */}
                  <div className="w-2.5 h-20 bg-gradient-to-b from-blue-50/30 via-gray-50/40 to-gray-100/50 border border-gray-400 rounded-b-full shadow-moderate backdrop-blur-sm">
                    {/* Graduated markings */}
                    <div className="absolute right-0 top-2 w-1 h-px bg-gray-500 opacity-40"></div>
                    <div className="absolute right-0 top-6 w-1 h-px bg-gray-500 opacity-40"></div>
                    
                    {/* Sample Liquid */}
                    <div 
                      className={`absolute bottom-0 left-0 right-0 rounded-b-full transition-all duration-300 ${
                        i === 0 ? 'h-1/3 bg-gradient-to-t from-red-400/80 to-red-300/60' :
                        i === 1 ? 'h-1/2 bg-gradient-to-t from-blue-400/80 to-blue-300/60':
                        i === 2 ? 'h-2/5 bg-gradient-to-t from-yellow-400/80 to-yellow-300/60': 'h-3/5 bg-gradient-to-t from-green-400/80 to-green-300/60'
                      }`}
                    >
                      {/* Meniscus */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-current opacity-60 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Professional Cork/Cap */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-gradient-to-t from-amber-700 via-amber-600 to-amber-500 rounded-t-sm shadow-moderate border border-amber-800">
                    <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-800 rounded-full"></div>
                  </div>
                  
                  {/* Sample Label */}
                  <div className="absolute top-4 -left-2 bg-white/95 border border-gray-300 rounded-sm px-1 py-0.5 text-xs font-mono text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    S-{i+1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {equipment?.type === 'centrifuge' && (
            <div className="relative w-full h-full">
              {/* Centrifuge Base */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-3/4 bg-gradient-to-t from-gray-700 to-gray-500 rounded-lg shadow-pronounced border border-gray-800">
                {/* Control panel */}
                <div className="absolute top-2 left-2 right-2 h-4 bg-black rounded-sm border border-gray-600">
                  <div className="absolute top-1 left-2 w-6 h-1 bg-green-400 rounded-full animate-pulse-soft"></div>
                  <div className="absolute top-1 right-2 text-xs font-mono text-green-400">15K</div>
                </div>
                {/* Rotor chamber */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-2 border-gray-600">
                  {isActive && (
                    <div className="absolute inset-1 bg-gray-700 rounded-full animate-spin-slow">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-400 rounded-b-full"></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Lid */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4/5 h-1/3 bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-lg border border-gray-600 shadow-moderate">
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          )}

          {equipment?.type === 'incubator' && (
            <div className="relative w-full h-full">
              {/* Incubator Body */}
              <div className="w-full h-full bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-lg border-2 border-gray-400 shadow-pronounced">
                {/* Door with window */}
                <div className="absolute inset-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md border border-gray-300">
                  {/* Window */}
                  <div className="absolute top-2 left-2 right-2 h-8 bg-gradient-to-b from-blue-50/40 to-transparent rounded-sm border border-gray-300 backdrop-blur-sm">
                    {/* Interior lighting */}
                    <div className="absolute inset-1 bg-yellow-100/30 rounded-sm"></div>
                  </div>
                  
                  {/* Digital display */}
                  <div className="absolute bottom-2 left-2 right-2 h-4 bg-black rounded-sm border border-gray-400">
                    <div className="absolute top-1 left-2 text-xs font-mono text-green-400 animate-pulse-soft">37.0°C</div>
                    <div className="absolute top-1 right-2 w-2 h-1 bg-red-400 rounded-full animate-pulse-soft"></div>
                  </div>
                </div>
                
                {/* Handle */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-r-full shadow-moderate"></div>
              </div>
            </div>
          )}

          {/* Professional Equipment Labels */}
          {equipment?.interactive && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-md px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-10 shadow-moderate">
              <span className="font-caption text-xs text-gray-800 font-medium">{equipment?.description}</span>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-300 rotate-45"></div>
            </div>
          )}
        </div>
      ))}

      {/* Enhanced Floating Bubbles */}
      {bubbles?.map((bubble) => (
        <div
          key={bubble?.id}
          className="absolute bg-emerald-200/70 rounded-full animate-float-up pointer-events-none shadow-moderate backdrop-blur-sm border border-emerald-300/30"
          style={{
            left: `${bubble?.x}%`,
            bottom: `${bubble?.y}%`,
            width: `${bubble?.size}px`,
            height: `${bubble?.size}px`,
            animationDuration: `${bubble?.duration}s`
          }}
        >
          {/* Bubble highlight */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-white/40 rounded-full blur-sm"></div>
        </div>
      ))}

      {/* Steam Particles */}
      {steamParticles?.map((steam) => (
        <div
          key={steam?.id}
          className="absolute w-2 h-2 bg-gray-300/40 rounded-full animate-float-up-slow pointer-events-none blur-sm"
          style={{
            left: `${steam?.x}%`,
            bottom: `${steam?.y}%`,
            animationDuration: `${steam?.duration}s`
          }}
        ></div>
      ))}

      {/* Professional Ambient Particles */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)]?.map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-yellow-200/60 rounded-full animate-float-gentle blur-sm"
              style={{
                left: `${15 + (i * 10)}%`,
                top: `${8 + (i * 8)}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: '5s'
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Enhanced Interactive Controls */}
      <div className="absolute top-4 right-4 space-y-3">
        <button
          onClick={() => handleElementClick('lighting', 'main-light')}
          className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 rounded-full flex items-center justify-center shadow-pronounced transition-all duration-200 border border-yellow-500"
        >
          <Icon name="Lightbulb" size={18} color="white" strokeWidth={2.5} />
          <div className="absolute -inset-1 bg-yellow-400/20 rounded-full animate-ping"></div>
        </button>
        
        <button
          onClick={() => handleElementClick('ventilation', 'fan')}
          className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 hover:from-blue-300 hover:to-cyan-300 rounded-full flex items-center justify-center shadow-pronounced transition-all duration-200 border border-blue-500"
        >
          <Icon name="Wind" size={18} color="white" strokeWidth={2.5} />
        </button>
        
        <button
          onClick={() => handleElementClick('safety', 'emergency')}
          className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 hover:from-red-300 hover:to-red-400 rounded-full flex items-center justify-center shadow-pronounced transition-all duration-200 border border-red-600"
        >
          <Icon name="AlertTriangle" size={18} color="white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Professional Status Indicators */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-2 shadow-moderate">
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse-soft shadow-glow"></div>
          <span className="font-caption text-sm font-medium text-gray-800">Lab Systems Online</span>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-2 shadow-moderate">
          <Icon name="Thermometer" size={16} className="text-blue-600" />
          <span className="font-mono text-sm font-medium text-gray-800">22.5°C</span>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-2 shadow-moderate">
          <Icon name="Droplets" size={16} className="text-cyan-600" />
          <span className="font-mono text-sm font-medium text-gray-800">45% RH</span>
        </div>
      </div>

      {/* Air Quality Indicator */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg px-3 py-2 shadow-moderate">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft"></div>
          <span className="font-caption text-xs font-medium text-gray-700">Clean Room Grade A</span>
        </div>
      </div>
    </div>
  );
};

export default LabEnvironment;