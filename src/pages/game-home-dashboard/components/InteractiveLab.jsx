import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const InteractiveLab = ({ className = "" }) => {
  const [activeEquipment, setActiveEquipment] = useState(null);
  const [animatingEquipment, setAnimatingEquipment] = useState(new Set());

  const labEquipment = [
  {
    id: 'microscope',
    name: 'Digital Microscope',
    position: { top: '20%', left: '15%' },
    icon: 'Microscope',
    description: 'Examine specimens up close',
    action: 'View Microbes',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    sound: 'click'
  },
  {
    id: 'petri-dish',
    name: 'Petri Dish',
    position: { top: '45%', left: '35%' },
    icon: 'Circle',
    description: 'Culture bacteria samples',
    action: 'Start Culture',
    color: 'text-success',
    bgColor: 'bg-success/10',
    sound: 'bubble'
  },
  {
    id: 'test-tubes',
    name: 'Test Tubes',
    position: { top: '30%', right: '20%' },
    icon: 'TestTube',
    description: 'Mix chemical solutions',
    action: 'Mix Solutions',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    sound: 'fizz'
  },
  {
    id: 'centrifuge',
    name: 'Centrifuge',
    position: { bottom: '25%', left: '25%' },
    icon: 'RotateCw',
    description: 'Separate cell components',
    action: 'Start Spin',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    sound: 'whir'
  },
  {
    id: 'incubator',
    name: 'Incubator',
    position: { bottom: '20%', right: '15%' },
    icon: 'Thermometer',
    description: 'Maintain optimal temperature',
    action: 'Set Temperature',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    sound: 'hum'
  }];


  const handleEquipmentClick = (equipment) => {
    setActiveEquipment(equipment);

    // Add animation
    setAnimatingEquipment((prev) => new Set([...prev, equipment.id]));

    // Remove animation after duration
    setTimeout(() => {
      setAnimatingEquipment((prev) => {
        const newSet = new Set(prev);
        newSet?.delete(equipment?.id);
        return newSet;
      });
    }, 1000);

    // Auto-hide tooltip after 3 seconds
    setTimeout(() => {
      setActiveEquipment(null);
    }, 3000);
  };

  return (
    <div className={`bg-card border border-border rounded-2xl p-6 shadow-moderate ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center">
            <Icon name="Beaker" size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">Interactive Laboratory</h3>
            <p className="font-caption text-sm text-muted-foreground">
              Click on equipment to learn more
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded-full animate-pulse-soft" />
          <span className="font-caption text-sm text-muted-foreground">Lab Active</span>
        </div>
      </div>
      {/* Laboratory Environment */}
      <div className="relative">
        {/* Background Laboratory Image */}
        <div className="relative w-full h-64 lg:h-80 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl overflow-hidden border border-border">
          <Image
            src="https://images.unsplash.com/photo-1657778752180-53adc732cf9e"
            alt="Modern scientific laboratory with workbenches, equipment, microscopes, test tubes, and research instruments arranged on clean white surfaces"
            className="w-full h-full object-cover opacity-80" />

          
          {/* Laboratory Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />

          {/* Interactive Equipment Points */}
          {labEquipment?.map((equipment) =>
          <button
            key={equipment?.id}
            onClick={() => handleEquipmentClick(equipment)}
            className={`
                absolute w-12 h-12 rounded-full border-2 border-white shadow-moderate
                flex items-center justify-center transition-all duration-fast
                hover:scale-110 hover:shadow-pronounced
                ${equipment?.bgColor} ${equipment?.color}
                ${animatingEquipment?.has(equipment?.id) ? 'animate-bounce-gentle scale-125' : ''}
              `}
            style={equipment?.position}>

              <Icon
              name={equipment?.icon}
              size={20}
              strokeWidth={2.5} />

              
              {/* Pulse Ring */}
              <div className={`
                absolute inset-0 rounded-full border-2 animate-ping
                ${equipment?.color?.replace('text-', 'border-')}
              `} />
            </button>
          )}

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)]?.map((_, i) =>
            <div
              key={i}
              className={`
                  absolute w-2 h-2 rounded-full animate-bounce-gentle opacity-60
                  ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-accent'}
                `}
              style={{
                left: `${10 + i * 15}%`,
                top: `${15 + i * 12}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '3s'
              }} />

            )}
          </div>
        </div>

        {/* Equipment Tooltip */}
        {activeEquipment &&
        <div className="absolute top-4 left-4 right-4 z-10">
            <div className={`
              ${activeEquipment?.bgColor} border-2 ${activeEquipment?.color?.replace('text-', 'border-')}/20
              rounded-xl p-4 shadow-pronounced animate-slide-up backdrop-blur-sm
            `}>
              <div className="flex items-start space-x-3">
                <div className={`
                  w-10 h-10 ${activeEquipment?.bgColor} rounded-full 
                  flex items-center justify-center border border-white/20
                `}>
                  <Icon
                  name={activeEquipment?.icon}
                  size={20}
                  className={activeEquipment?.color}
                  strokeWidth={2.5} />

                </div>
                
                <div className="flex-1">
                  <h4 className="font-heading text-foreground mb-1">
                    {activeEquipment?.name}
                  </h4>
                  <p className="font-body text-sm text-muted-foreground mb-2">
                    {activeEquipment?.description}
                  </p>
                  
                  <button className={`
                    px-3 py-1 rounded-full font-caption text-xs font-medium
                    ${activeEquipment?.color} ${activeEquipment?.bgColor} 
                    border ${activeEquipment?.color?.replace('text-', 'border-')}/20
                    hover:opacity-80 transition-opacity duration-fast
                  `}>
                    {activeEquipment?.action}
                  </button>
                </div>
                
                <button
                onClick={() => setActiveEquipment(null)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors duration-fast">

                  <Icon name="X" size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        }
      </div>
      {/* Equipment Legend */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-3">
        {labEquipment?.map((equipment) =>
        <button
          key={equipment?.id}
          onClick={() => handleEquipmentClick(equipment)}
          className={`
              flex items-center space-x-2 p-2 rounded-lg transition-all duration-fast
              hover:${equipment?.bgColor} hover:scale-105
              ${activeEquipment?.id === equipment?.id ? equipment?.bgColor : 'bg-muted/30'}
            `}>

            <Icon
            name={equipment?.icon}
            size={16}
            className={equipment?.color}
            strokeWidth={2} />

            <span className="font-caption text-xs text-foreground truncate">
              {equipment?.name}
            </span>
          </button>
        )}
      </div>
      {/* Lab Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="Zap" size={16} className="text-accent" />
              <span className="font-mono text-sm font-semibold text-foreground">5</span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Equipment</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="FlaskConical" size={16} className="text-primary" />
              <span className="font-mono text-sm font-semibold text-foreground">12</span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Experiments</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="Award" size={16} className="text-success" />
              <span className="font-mono text-sm font-semibold text-foreground">8</span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Discoveries</p>
          </div>
        </div>
      </div>
    </div>);

};

export default InteractiveLab;