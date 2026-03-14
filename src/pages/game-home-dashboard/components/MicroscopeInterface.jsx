import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MicroscopeInterface = ({ className = "" }) => {
  const [focusLevel, setFocusLevel] = useState(50);
  const [selectedMicrobe, setSelectedMicrobe] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const discoveredMicrobes = [
  {
    id: 1,
    name: 'E. coli',
    type: 'Bacteria',
    image: "https://images.unsplash.com/photo-1574341792525-683b103fffe8",
    alt: 'Rod-shaped E. coli bacteria with flagella, shown in bright green fluorescent microscopy with detailed cellular structure',
    description: 'Rod-shaped bacteria commonly found in intestines',
    magnification: '1000x',
    discoveredDate: '2025-10-15',
    rarity: 'Common',
    color: 'text-success'
  },
  {
    id: 2,
    name: 'Influenza Virus',
    type: 'Virus',
    image: "https://images.unsplash.com/photo-1706201320711-3d85bf15bac4",
    alt: 'Spherical influenza virus particles with surface proteins visible, displayed in blue and purple electron microscopy coloring',
    description: 'Respiratory virus causing seasonal flu',
    magnification: '50000x',
    discoveredDate: '2025-10-16',
    rarity: 'Uncommon',
    color: 'text-primary'
  },
  {
    id: 3,
    name: 'Penicillium',
    type: 'Fungi',
    image: "https://images.unsplash.com/photo-1707386820796-a80ca3dd8f87",
    alt: 'Branching Penicillium fungus with characteristic brush-like spore structures in microscopic detail showing green-blue coloration',
    description: 'Antibiotic-producing mold fungus',
    magnification: '400x',
    discoveredDate: '2025-10-17',
    rarity: 'Rare',
    color: 'text-accent'
  }];


  // Auto-cycle through microbes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setSelectedMicrobe((prev) => (prev + 1) % discoveredMicrobes?.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [discoveredMicrobes?.length]);

  const currentMicrobe = discoveredMicrobes?.[selectedMicrobe];

  const handleFocusChange = (newFocus) => {
    setFocusLevel(newFocus);
  };

  const handleMicrobeSelect = (index) => {
    if (index !== selectedMicrobe) {
      setIsAnimating(true);
      setTimeout(() => {
        setSelectedMicrobe(index);
        setIsAnimating(false);
      }, 200);
    }
  };

  return (
    <div className={`bg-card border border-border rounded-2xl p-6 shadow-moderate ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Icon name="Microscope" size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">Digital Microscope</h3>
            <p className="font-caption text-sm text-muted-foreground">
              {discoveredMicrobes?.length} specimens discovered
            </p>
          </div>
        </div>
        
        <Link to="/microscope-discovery-lab">
          <button className="flex items-center space-x-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-button transition-colors duration-fast">
            <Icon name="Zap" size={16} strokeWidth={2} />
            <span className="font-caption text-sm font-medium">Lab Mode</span>
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Microscope Viewport */}
        <div className="relative">
          <div className="relative w-full aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-full border-4 border-border overflow-hidden">
            {/* Viewport Content */}
            <div className={`
              relative w-full h-full transition-all duration-normal
              ${isAnimating ? 'scale-110 opacity-50' : 'scale-100 opacity-100'}
            `}>
              <Image
                src={currentMicrobe?.image}
                alt={currentMicrobe?.alt}
                className="w-full h-full object-cover" />

              
              {/* Focus Overlay */}
              <div
                className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20"
                style={{
                  background: `radial-gradient(circle, transparent ${focusLevel}%, rgba(0,0,0,0.3) ${focusLevel + 20}%)`
                }} />

            </div>

            {/* Focus Rings */}
            <div className="absolute inset-4 border-2 border-primary/30 rounded-full animate-pulse-soft" />
            <div className="absolute inset-8 border border-secondary/20 rounded-full" />
            
            {/* Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <div className="w-8 h-0.5 bg-accent/60 absolute -translate-x-1/2" />
                <div className="h-8 w-0.5 bg-accent/60 absolute -translate-y-1/2" />
              </div>
            </div>

            {/* Magnification Indicator */}
            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full border border-border">
              <span className="font-mono text-xs text-foreground font-medium">
                {currentMicrobe?.magnification}
              </span>
            </div>
          </div>

          {/* Focus Control */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-caption text-sm text-muted-foreground">Focus</span>
              <span className="font-mono text-sm text-foreground">{focusLevel}%</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={focusLevel}
                onChange={(e) => handleFocusChange(parseInt(e?.target?.value))}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary" />

              <div
                className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-fast"
                style={{ width: `${focusLevel}%` }} />

            </div>
          </div>
        </div>

        {/* Specimen Information */}
        <div className="space-y-4">
          {/* Current Specimen */}
          <div className="bg-muted/30 rounded-xl p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-heading text-foreground mb-1">{currentMicrobe?.name}</h4>
                <p className="font-caption text-sm text-muted-foreground">{currentMicrobe?.type}</p>
              </div>
              <div className={`
                px-2 py-1 rounded-full border font-caption text-xs font-medium
                ${currentMicrobe?.rarity === 'Common' ? 'bg-success/10 border-success/20 text-success' :
              currentMicrobe?.rarity === 'Uncommon' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-accent/10 border-accent/20 text-accent'}
              `}>
                {currentMicrobe?.rarity}
              </div>
            </div>
            
            <p className="font-body text-sm text-foreground mb-3">
              {currentMicrobe?.description}
            </p>
            
            <div className="flex items-center justify-between text-xs">
              <span className="font-caption text-muted-foreground">
                Discovered: {new Date(currentMicrobe.discoveredDate)?.toLocaleDateString()}
              </span>
              <div className="flex items-center space-x-1">
                <Icon name="Eye" size={12} className="text-primary" />
                <span className="font-mono text-primary">{currentMicrobe?.magnification}</span>
              </div>
            </div>
          </div>

          {/* Specimen Selector */}
          <div className="space-y-2">
            <h5 className="font-body font-semibold text-sm text-foreground">Discovered Specimens</h5>
            <div className="grid grid-cols-3 gap-2">
              {discoveredMicrobes?.map((microbe, index) =>
              <button
                key={microbe?.id}
                onClick={() => handleMicrobeSelect(index)}
                className={`
                    relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-fast
                    ${selectedMicrobe === index ?
                'border-primary shadow-moderate' :
                'border-border hover:border-primary/50'}
                  `
                }>

                  <Image
                  src={microbe?.image}
                  alt={microbe?.alt}
                  className="w-full h-full object-cover" />

                  
                  {/* Selection Indicator */}
                  {selectedMicrobe === index &&
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Icon name="Eye" size={16} color="white" strokeWidth={2.5} />
                    </div>
                }
                  
                  {/* Microbe Type Icon */}
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-card/90 rounded-full flex items-center justify-center">
                    <Icon
                    name={microbe?.type === 'Bacteria' ? 'Circle' : microbe?.type === 'Virus' ? 'Zap' : 'Flower'}
                    size={10}
                    className={microbe?.color}
                    strokeWidth={2} />

                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 pt-2">
            <Link to="/microscope-discovery-lab" className="flex-1">
              <button className="w-full py-2 px-3 bg-primary text-primary-foreground rounded-button font-caption text-sm font-medium hover:shadow-moderate transition-all duration-fast">
                Explore Lab
              </button>
            </Link>
            <button className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-button transition-colors duration-fast">
              <Icon name="Share" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>);

};

export default MicroscopeInterface;