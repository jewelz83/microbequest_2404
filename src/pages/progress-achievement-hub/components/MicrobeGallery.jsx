import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MicrobeGallery = ({ 
  discoveredMicrobes = [], 
  className = "" 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMicrobe, setSelectedMicrobe] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const defaultMicrobes = [
    {
      id: 1,
      name: 'E. coli',
      category: 'bacteria',
      image: '/assets/images/microbes/ecoli-cartoon.png',
      imageAlt: 'Friendly cartoon E. coli bacteria with big eyes and smile, rod-shaped with blue and green coloring',
      discoveredAt: '2025-10-15T10:30:00Z',
      habitat: 'Intestinal tract',
      size: '2-3 micrometers',
      shape: 'Rod-shaped',
      facts: [
        'Can multiply every 20 minutes under ideal conditions',
        'Most strains are harmless and help with digestion',
        'Used extensively in scientific research and biotechnology'
      ],
      funFact: 'E. coli has been to space! Scientists study it on the International Space Station.',
      rarity: 'common',
      points: 10,
      isAnimated: true
    },
    {
      id: 2,
      name: 'Influenza Virus',
      category: 'virus',
      image: '/assets/images/microbes/influenza-cartoon.png',
      imageAlt: 'Cartoon influenza virus with spiky surface proteins, round shape with friendly face and purple coloring',
      discoveredAt: '2025-10-16T14:15:00Z',
      habitat: 'Respiratory system',
      size: '80-120 nanometers',
      shape: 'Spherical with spikes',
      facts: [
        'Changes its surface proteins every year',
        'Spreads through tiny droplets when people cough or sneeze',
        'Can cause seasonal epidemics and occasional pandemics'
      ],
      funFact: 'The flu virus is like a master of disguise - it changes its appearance every year!',
      rarity: 'uncommon',
      points: 25,
      isAnimated: true
    },
    {
      id: 3,
      name: 'Penicillium',
      category: 'fungi',
      image: '/assets/images/microbes/penicillium-cartoon.png',
      imageAlt: 'Cute cartoon Penicillium fungus with mushroom-like cap, green and blue coloring with smiling face',
      discoveredAt: '2025-10-14T09:45:00Z',
      habitat: 'Soil and decaying matter',
      size: '2-5 micrometers',
      shape: 'Branching filaments',
      facts: [
        'Produces the antibiotic penicillin',
        'Helps decompose organic matter in nature',
        'Some species are used to make blue cheese'
      ],
      funFact: 'This little fungus has saved millions of lives by making medicine!',
      rarity: 'rare',
      points: 50,
      isAnimated: true
    },
    {
      id: 4,
      name: 'Paramecium',
      category: 'protozoa',
      image: '/assets/images/microbes/paramecium-cartoon.png',
      imageAlt: 'Animated cartoon Paramecium with oval shape, tiny hair-like cilia around edges, and cheerful expression',
      discoveredAt: '2025-10-13T16:20:00Z',
      habitat: 'Freshwater ponds',
      size: '50-300 micrometers',
      shape: 'Slipper-shaped',
      facts: [
        'Moves using tiny hairs called cilia',
        'Eats bacteria and other small organisms',
        'Can reproduce by splitting in half'
      ],
      funFact: 'Paramecium is like a tiny vacuum cleaner, sweeping up food with its cilia!',
      rarity: 'uncommon',
      points: 30,
      isAnimated: true
    }
  ];

  const microbes = discoveredMicrobes?.length > 0 ? discoveredMicrobes : defaultMicrobes;

  const categories = [
    { value: 'all', label: 'All Microbes', icon: 'Grid3X3', count: microbes?.length },
    { value: 'bacteria', label: 'Bacteria', icon: 'Circle', count: microbes?.filter(m => m?.category === 'bacteria')?.length },
    { value: 'virus', label: 'Viruses', icon: 'Zap', count: microbes?.filter(m => m?.category === 'virus')?.length },
    { value: 'fungi', label: 'Fungi', icon: 'Flower', count: microbes?.filter(m => m?.category === 'fungi')?.length },
    { value: 'protozoa', label: 'Protozoa', icon: 'Waves', count: microbes?.filter(m => m?.category === 'protozoa')?.length }
  ];

  const filteredMicrobes = selectedCategory === 'all' 
    ? microbes 
    : microbes?.filter(microbe => microbe?.category === selectedCategory);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-success bg-success/10 border-success/20';
      case 'uncommon': return 'text-primary bg-primary/10 border-primary/20';
      case 'rare': return 'text-accent bg-accent/10 border-accent/20';
      case 'legendary': return 'text-error bg-error/10 border-error/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className={`bg-card rounded-2xl p-6 border border-border shadow-moderate ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-heading text-foreground">Microbe Collection</h3>
          <p className="font-caption text-sm text-muted-foreground">
            {microbes?.length} microorganisms discovered
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            iconName="Grid3X3"
          />
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            iconName="List"
          />
        </div>
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories?.map((category) => (
          <button
            key={category?.value}
            onClick={() => setSelectedCategory(category?.value)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-button transition-all duration-fast
              ${selectedCategory === category?.value
                ? 'bg-primary text-primary-foreground shadow-moderate'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            <Icon name={category?.icon} size={16} strokeWidth={2} />
            <span className="font-caption text-sm">{category?.label}</span>
            <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {category?.count}
            </span>
          </button>
        ))}
      </div>
      {/* Microbe Grid/List */}
      {filteredMicrobes?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Microscope" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="font-heading text-lg text-foreground mb-2">No microbes found</h4>
          <p className="font-body text-muted-foreground">
            Start exploring to discover amazing microorganisms!
          </p>
        </div>
      ) : (
        <div className={`
          ${viewMode === 'grid' ?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' :'space-y-3'
          }
        `}>
          {filteredMicrobes?.map((microbe) => (
            <div
              key={microbe?.id}
              onClick={() => setSelectedMicrobe(microbe)}
              className={`
                bg-card border border-border rounded-lg p-4 cursor-pointer
                transition-all duration-fast hover:shadow-moderate hover:border-primary/30
                ${selectedMicrobe?.id === microbe?.id ? 'ring-2 ring-primary bg-primary/5' : ''}
                ${viewMode === 'list' ? 'flex items-center space-x-4' : ''}
              `}
            >
              {/* Microbe Image */}
              <div className={`
                ${viewMode === 'grid' ? 'w-full h-32 mb-3' : 'w-16 h-16 flex-shrink-0'}
                bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden relative
              `}>
                <Image
                  src={microbe?.image}
                  alt={microbe?.imageAlt}
                  className={`w-full h-full object-cover ${microbe?.isAnimated ? 'hover:scale-110' : ''} transition-transform duration-300`}
                />
                
                {/* Rarity Badge */}
                <div className={`
                  absolute top-2 right-2 px-2 py-1 rounded-full border text-xs font-caption font-medium
                  ${getRarityColor(microbe?.rarity)}
                `}>
                  {microbe?.rarity}
                </div>

                {/* Animation Indicator */}
                {microbe?.isAnimated && (
                  <div className="absolute bottom-2 left-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse-soft"></div>
                  </div>
                )}
              </div>

              {/* Microbe Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-heading text-sm text-foreground">{microbe?.name}</h4>
                  <div className="flex items-center space-x-1 text-accent">
                    <Icon name="Star" size={14} strokeWidth={2} />
                    <span className="font-mono text-xs">{microbe?.points}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <Icon name="MapPin" size={12} className="text-muted-foreground" />
                    <span className="font-body text-muted-foreground">{microbe?.habitat}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs">
                    <Icon name="Ruler" size={12} className="text-muted-foreground" />
                    <span className="font-body text-muted-foreground">{microbe?.size}</span>
                  </div>
                </div>
                
                {/* Category and Date */}
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className="font-caption text-primary capitalize">
                    {microbe?.category}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {new Date(microbe.discoveredAt)?.toLocaleDateString()}
                  </span>
                </div>

                {/* Fun Fact Preview (Grid view only) */}
                {viewMode === 'grid' && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="font-caption text-xs text-muted-foreground line-clamp-2">
                      <Icon name="Lightbulb" size={12} className="inline mr-1" />
                      {microbe?.funFact}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Selected Microbe Details Modal */}
      {selectedMicrobe && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-pronounced border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2
                  ${getRarityColor(selectedMicrobe?.rarity)}
                `}>
                  <Icon name="Microscope" size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-heading text-foreground">{selectedMicrobe?.name}</h3>
                  <p className="font-caption text-sm text-muted-foreground capitalize">
                    {selectedMicrobe?.category} • {selectedMicrobe?.rarity}
                  </p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedMicrobe(null)}
                iconName="X"
              />
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="space-y-4">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden">
                    <Image
                      src={selectedMicrobe?.image}
                      alt={selectedMicrobe?.imageAlt}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-caption text-xs text-muted-foreground mb-1">Size</p>
                      <p className="font-body text-foreground">{selectedMicrobe?.size}</p>
                    </div>
                    <div>
                      <p className="font-caption text-xs text-muted-foreground mb-1">Shape</p>
                      <p className="font-body text-foreground">{selectedMicrobe?.shape}</p>
                    </div>
                    <div>
                      <p className="font-caption text-xs text-muted-foreground mb-1">Habitat</p>
                      <p className="font-body text-foreground">{selectedMicrobe?.habitat}</p>
                    </div>
                    <div>
                      <p className="font-caption text-xs text-muted-foreground mb-1">Points</p>
                      <p className="font-mono text-foreground font-semibold">+{selectedMicrobe?.points}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-heading text-lg text-foreground mb-2">Fun Fact</h4>
                    <p className="font-body text-sm text-muted-foreground bg-accent/10 p-3 rounded-lg border border-accent/20">
                      {selectedMicrobe?.funFact}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-heading text-lg text-foreground mb-2">Scientific Facts</h4>
                    <ul className="space-y-2">
                      {selectedMicrobe?.facts?.map((fact, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                          <span className="font-body text-muted-foreground">{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="font-caption text-xs text-muted-foreground">
                      Discovered on {new Date(selectedMicrobe.discoveredAt)?.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MicrobeGallery;