import React, { useState } from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from './Button';

const DiscoveryCollection = ({ 
  discoveries = [], 
  isOpen = false, 
  onClose,
  selectedMicrobe = null,
  onSelectMicrobe,
  className = "" 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'all', label: 'All Microbes', icon: 'Grid3X3' },
    { value: 'bacteria', label: 'Bacteria', icon: 'Circle' },
    { value: 'virus', label: 'Viruses', icon: 'Zap' },
    { value: 'fungi', label: 'Fungi', icon: 'Flower' },
    { value: 'protozoa', label: 'Protozoa', icon: 'Waves' }
  ];

  // Sample discovery data structure
  const sampleDiscoveries = [
    {
      id: 1,
      name: 'E. coli',
      category: 'bacteria',
      image: '/assets/images/microbes/ecoli.png',
      discoveredAt: '2025-10-15',
      description: 'A rod-shaped bacterium commonly found in the intestines.',
      facts: ['Can multiply every 20 minutes', 'Most strains are harmless', 'Used in scientific research'],
      rarity: 'common',
      points: 10
    },
    {
      id: 2,
      name: 'Influenza Virus',
      category: 'virus',
      image: '/assets/images/microbes/influenza.png',
      discoveredAt: '2025-10-16',
      description: 'A respiratory virus that causes seasonal flu.',
      facts: ['Changes its surface proteins yearly', 'Spreads through droplets', 'Can cause pandemics'],
      rarity: 'uncommon',
      points: 25
    }
  ];

  const allDiscoveries = discoveries?.length > 0 ? discoveries : sampleDiscoveries;

  const filteredDiscoveries = allDiscoveries?.filter(microbe => {
    const matchesCategory = filterCategory === 'all' || microbe?.category === filterCategory;
    const matchesSearch = microbe?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         microbe?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-success bg-success/10 border-success/20';
      case 'uncommon': return 'text-primary bg-primary/10 border-primary/20';
      case 'rare': return 'text-accent bg-accent/10 border-accent/20';
      case 'legendary': return 'text-error bg-error/10 border-error/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className={`
        bg-card rounded-2xl shadow-pronounced border border-border 
        w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-up
        ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Icon name="Microscope" size={20} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-heading text-foreground">Discovery Collection</h2>
              <p className="font-caption text-sm text-muted-foreground">
                {allDiscoveries?.length} microbes discovered
              </p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={onClose} iconName="X" />
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-border space-y-4">
          {/* Search and View Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Icon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <input
                type="text"
                placeholder="Search microbes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-button font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
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
          <div className="flex flex-wrap gap-2">
            {categories?.map((category) => (
              <button
                key={category?.value}
                onClick={() => setFilterCategory(category?.value)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-button transition-all duration-fast
                  ${filterCategory === category?.value
                    ? 'bg-primary text-primary-foreground shadow-moderate'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                <Icon name={category?.icon} size={16} strokeWidth={2} />
                <span className="font-caption text-sm">{category?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Discovery Grid/List */}
        <div className="p-6 overflow-y-auto max-h-96">
          {filteredDiscoveries?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-lg text-foreground mb-2">No microbes found</h3>
              <p className="font-body text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'Start exploring to discover microbes!'}
              </p>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'grid' ?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' :'space-y-3'
              }
            `}>
              {filteredDiscoveries?.map((microbe) => (
                <div
                  key={microbe?.id}
                  onClick={() => onSelectMicrobe && onSelectMicrobe(microbe)}
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
                    bg-muted rounded-lg overflow-hidden relative
                  `}>
                    <Image
                      src={microbe?.image}
                      alt={microbe?.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Rarity Badge */}
                    <div className={`
                      absolute top-2 right-2 px-2 py-1 rounded-full border text-xs font-caption font-medium
                      ${getRarityColor(microbe?.rarity)}
                    `}>
                      {microbe?.rarity}
                    </div>
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
                    
                    <p className="font-body text-xs text-muted-foreground mb-3 line-clamp-2">
                      {microbe?.description}
                    </p>
                    
                    {/* Category and Date */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-caption text-primary capitalize">
                        {microbe?.category}
                      </span>
                      <span className="font-mono text-muted-foreground">
                        {new Date(microbe.discoveredAt)?.toLocaleDateString()}
                      </span>
                    </div>

                    {/* Facts Preview (Grid view only) */}
                    {viewMode === 'grid' && microbe?.facts && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="font-caption text-xs text-muted-foreground">
                          <Icon name="Info" size={12} className="inline mr-1" />
                          {microbe?.facts?.[0]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Trophy" size={16} className="text-accent" />
              <span className="font-body text-foreground">
                Total Points: <span className="font-mono font-semibold">
                  {allDiscoveries?.reduce((sum, m) => sum + m?.points, 0)}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="font-body text-foreground">
                Progress: <span className="font-mono font-semibold">
                  {Math.round((allDiscoveries?.length / 50) * 100)}%
                </span>
              </span>
            </div>
          </div>
          
          <Button variant="outline" onClick={onClose}>
            Close Collection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryCollection;