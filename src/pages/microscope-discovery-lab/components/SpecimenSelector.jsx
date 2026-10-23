import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SpecimenSelector = ({
  specimens = [],
  selectedSpecimen,
  onSpecimenSelect,
  isLoading = false,
  className = ""
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const categories = [
  { id: 'all', label: 'All Specimens', icon: 'Grid3X3', color: 'text-foreground' },
  { id: 'bacteria', label: 'Bacteria', icon: 'Circle', color: 'text-success' },
  { id: 'virus', label: 'Viruses', icon: 'Zap', color: 'text-primary' },
  { id: 'fungi', label: 'Fungi', icon: 'Flower', color: 'text-accent' },
  { id: 'protozoa', label: 'Protozoa', icon: 'Waves', color: 'text-secondary' }];


  const sampleSpecimens = [
  {
    id: 1,
    name: 'E. coli Bacteria',
    category: 'bacteria',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1afb618e1-1772720842276.png",
    imageAlt: 'Microscopic view of E. coli bacteria showing rod-shaped green organisms',
    microscopeImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1e7986617-1774096897896.png",
    microscopeImageAlt: 'Detailed microscope view of E. coli bacteria with visible cellular structures',
    description: 'Rod-shaped bacteria commonly found in intestines',
    difficulty: 'beginner',
    magnification: '1000x',
    discoveryPoints: 15
  },
  {
    id: 2,
    name: 'Influenza Virus',
    category: 'virus',
    image: "https://images.unsplash.com/photo-1579781403337-de692320718a",
    imageAlt: 'Artistic representation of influenza virus particles in purple and blue colors',
    microscopeImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1ed1b5894-1775916879553.png",
    microscopeImageAlt: 'High magnification view of influenza virus showing geometric crystal-like structure',
    description: 'Respiratory virus causing seasonal flu',
    difficulty: 'intermediate',
    magnification: '50000x',
    discoveryPoints: 25
  },
  {
    id: 3,
    name: 'Penicillium Mold',
    category: 'fungi',
    image: "https://images.unsplash.com/photo-1693089517079-fbb071b9e92b",
    imageAlt: 'Green and blue Penicillium mold growing in circular patterns',
    microscopeImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1aac1edc6-1766548194115.png",
    microscopeImageAlt: 'Microscopic view of Penicillium showing branching fungal structures with spores',
    description: 'Beneficial mold used to make antibiotics',
    difficulty: 'intermediate',
    magnification: '400x',
    discoveryPoints: 20
  },
  {
    id: 4,
    name: 'Paramecium',
    category: 'protozoa',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_170178e6f-1765095177740.png",
    imageAlt: 'Elongated single-celled Paramecium organism with visible internal structures',
    microscopeImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1314dbf1c-1772978106232.png",
    microscopeImageAlt: 'Detailed view of Paramecium showing cilia and internal organelles',
    description: 'Single-celled organism with hair-like cilia',
    difficulty: 'advanced',
    magnification: '200x',
    discoveryPoints: 30
  }];


  const allSpecimens = specimens?.length > 0 ? specimens : sampleSpecimens;

  const filteredSpecimens = activeCategory === 'all' ?
  allSpecimens :
  allSpecimens?.filter((specimen) => specimen?.category === activeCategory);

  const handleSpecimenSelect = (specimen) => {
    if (specimen?.id === selectedSpecimen?.id) return;

    setIsTransitioning(true);
    setTimeout(() => {
      onSpecimenSelect(specimen);
      setIsTransitioning(false);
    }, 300);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':return 'text-success bg-success/10 border-success/20';
      case 'intermediate':return 'text-accent bg-accent/10 border-accent/20';
      case 'advanced':return 'text-error bg-error/10 border-error/20';
      default:return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg shadow-moderate ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Icon name="TestTube" size={16} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-heading text-sm text-foreground">Specimen Library</h3>
            <p className="font-caption text-xs text-muted-foreground">
              {filteredSpecimens?.length} specimens available
            </p>
          </div>
        </div>

        {isLoading &&
        <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="font-caption text-xs text-muted-foreground">Loading...</span>
          </div>
        }
      </div>
      {/* Category Filter */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) =>
          <button
            key={category?.id}
            onClick={() => setActiveCategory(category?.id)}
            className={`
                flex items-center space-x-2 px-3 py-2 rounded-button transition-all duration-fast
                ${activeCategory === category?.id ?
            'bg-primary text-primary-foreground shadow-moderate' :
            'bg-muted text-muted-foreground hover:bg-muted/80'}
              `
            }>

              <Icon name={category?.icon} size={14} strokeWidth={2} />
              <span className="font-caption text-xs">{category?.label}</span>
            </button>
          )}
        </div>
      </div>
      {/* Specimen Grid */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {filteredSpecimens?.length === 0 ?
        <div className="text-center py-8">
            <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="font-body text-sm text-muted-foreground">No specimens found in this category</p>
          </div> :

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredSpecimens?.map((specimen) =>
          <button
            key={specimen?.id}
            onClick={() => handleSpecimenSelect(specimen)}
            disabled={isTransitioning}
            className={`
                  group relative bg-card border rounded-lg p-3 text-left transition-all duration-fast
                  hover:shadow-moderate hover:border-primary/30 disabled:opacity-50
                  ${selectedSpecimen?.id === specimen?.id ?
            'ring-2 ring-primary bg-primary/5 border-primary' : 'border-border'}
                  ${
            isTransitioning ? 'animate-pulse' : ''}
                `}>

                {/* Specimen Image */}
                <div className="relative w-full h-20 bg-muted rounded-lg overflow-hidden mb-3">
                  <Image
                src={specimen?.image}
                alt={specimen?.imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-fast" />


                  {/* Difficulty Badge */}
                  <div className={`
                    absolute top-2 right-2 px-2 py-1 rounded-full border text-xs font-caption font-medium
                    ${getDifficultyColor(specimen?.difficulty)}
                  `}>
                    {specimen?.difficulty}
                  </div>

                  {/* Loading Overlay */}
                  {isTransitioning && selectedSpecimen?.id === specimen?.id &&
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
              }
                </div>

                {/* Specimen Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-heading text-sm text-foreground group-hover:text-primary transition-colors duration-fast">
                      {specimen?.name}
                    </h4>
                    <div className="flex items-center space-x-1 text-accent">
                      <Icon name="Star" size={12} strokeWidth={2} />
                      <span className="font-mono text-xs">{specimen?.discoveryPoints}</span>
                    </div>
                  </div>

                  <p className="font-body text-xs text-muted-foreground line-clamp-2">
                    {specimen?.description}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-caption text-primary capitalize">
                      {specimen?.category}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {specimen?.magnification}
                    </span>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedSpecimen?.id === specimen?.id &&
            <div className="absolute top-2 left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Check" size={14} color="white" strokeWidth={2.5} />
                  </div>
            }

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-fast rounded-lg pointer-events-none"></div>
              </button>
          )}
          </div>
        }
      </div>
      {/* Footer */}
      {selectedSpecimen &&
      <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Eye" size={16} className="text-primary" />
              <span className="font-body text-sm text-foreground">
                Now examining: <span className="font-semibold">{selectedSpecimen?.name}</span>
              </span>
            </div>

            <div className="flex items-center space-x-1 text-accent">
              <Icon name="Zap" size={14} strokeWidth={2} />
              <span className="font-caption text-xs">
                +{selectedSpecimen?.discoveryPoints} points
              </span>
            </div>
          </div>
        </div>
      }
    </div>);

};

export default SpecimenSelector;