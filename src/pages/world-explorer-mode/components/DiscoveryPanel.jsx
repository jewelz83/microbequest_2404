import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const DiscoveryPanel = ({
  discoveredMicrobes = [],
  totalMicrobes = 9,
  onMicrobeSelect,
  selectedMicrobe = null,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentDiscovery, setRecentDiscovery] = useState(null);

  const microbeDatabase = {
    'soil-1': {
      id: 'soil-1',
      name: 'Bacillus subtilis',
      type: 'bacteria',
      environment: 'soil',
      image: "https://images.unsplash.com/photo-1707386821773-22f80ad5a5ad",
      imageAlt: 'Microscopic view of rod-shaped Bacillus subtilis bacteria in green and blue coloration',
      description: 'A beneficial soil bacterium that helps plants grow by protecting their roots from harmful microorganisms.',
      facts: [
      'Can form protective spores when conditions are tough',
      'Helps plants absorb nutrients from soil',
      'Used to make some types of medicine'],

      rarity: 'common',
      points: 10,
      discoveredAt: new Date()?.toISOString()
    },
    'soil-2': {
      id: 'soil-2',
      name: 'Mycorrhizal fungi',
      type: 'fungi',
      environment: 'soil',
      image: "https://images.unsplash.com/photo-1650694558186-ec904d29ec2d",
      imageAlt: 'Network of white fungal threads connecting to plant roots in dark soil',
      description: 'Friendly fungi that form partnerships with plant roots, helping them find water and nutrients.',
      facts: [
      'Creates underground networks between plants',
      'Exchanges nutrients for plant sugars',
      'Can live for hundreds of years'],

      rarity: 'uncommon',
      points: 25,
      discoveredAt: new Date()?.toISOString()
    },
    'soil-3': {
      id: 'soil-3',
      name: 'Soil amoeba',
      type: 'protozoa',
      environment: 'soil',
      image: "https://images.unsplash.com/photo-1706201320711-3d85bf15bac4",
      imageAlt: 'Single-celled amoeba with flowing pseudopods extending in multiple directions',
      description: 'A tiny single-celled organism that moves by stretching its body and helps keep soil healthy.',
      facts: [
      'Changes shape as it moves around',
      'Eats bacteria and keeps their numbers balanced',
      'Can survive by forming a protective cyst'],

      rarity: 'rare',
      points: 50,
      discoveredAt: new Date()?.toISOString()
    },
    'water-1': {
      id: 'water-1',
      name: 'E. coli',
      type: 'bacteria',
      environment: 'water',
      image: "https://images.unsplash.com/photo-1574341792525-683b103fffe8",
      imageAlt: 'Rod-shaped E. coli bacteria with flagella visible under microscope in blue-green staining',
      description: 'A common bacterium that lives in our intestines and helps us digest food properly.',
      facts: [
      'Most types are completely harmless',
      'Helps make vitamin K in our bodies',
      'Scientists use it to study how cells work'],

      rarity: 'common',
      points: 15,
      discoveredAt: new Date()?.toISOString()
    },
    'water-2': {
      id: 'water-2',
      name: 'Paramecium',
      type: 'protozoa',
      environment: 'water',
      image: "https://images.unsplash.com/photo-1707861107096-4c3b8a3ff175",
      imageAlt: 'Slipper-shaped Paramecium with visible cilia around its edge and internal structures',
      description: 'A slipper-shaped microorganism that swims around in pond water using tiny hairs called cilia.',
      facts: [
      'Has thousands of tiny hairs for swimming',
      'Can eat up to 5,000 bacteria per day',
      'Has two different types of nuclei'],

      rarity: 'uncommon',
      points: 30,
      discoveredAt: new Date()?.toISOString()
    },
    'water-3': {
      id: 'water-3',
      name: 'Chlorella',
      type: 'algae',
      environment: 'water',
      image: "https://images.unsplash.com/photo-1574483078807-f1c78259e290",
      imageAlt: 'Spherical green Chlorella algae cells clustered together showing bright green chloroplasts',
      description: 'A tiny green algae that makes its own food using sunlight, just like plants do.',
      facts: [
      'Produces oxygen that we breathe',
      'Can double its size every day',
      'Used as a healthy food supplement'],

      rarity: 'common',
      points: 20,
      discoveredAt: new Date()?.toISOString()
    },
    'body-1': {
      id: 'body-1',
      name: 'Lactobacillus',
      type: 'bacteria',
      environment: 'body',
      image: "https://images.unsplash.com/photo-1727814415354-025b7c3fcf58",
      imageAlt: 'Chain of rod-shaped Lactobacillus bacteria in purple staining under microscope',
      description: 'Helpful bacteria that live in our digestive system and help keep us healthy by fighting bad germs.',
      facts: [
      'Makes yogurt and cheese taste tangy',
      'Helps our immune system stay strong',
      'Produces natural antibiotics'],

      rarity: 'common',
      points: 15,
      discoveredAt: new Date()?.toISOString()
    },
    'body-2': {
      id: 'body-2',
      name: 'Common cold virus',
      type: 'virus',
      environment: 'body',
      image: "https://images.unsplash.com/photo-1707863081051-44f6540b0119",
      imageAlt: 'Spherical virus particles with spike proteins on surface in orange and red coloration',
      description: 'A tiny virus that sometimes makes us sneeze and cough, but our body learns to fight it off.',
      facts: [
      'Much smaller than bacteria',
      'Needs our cells to make copies of itself',
      'There are over 200 different cold viruses'],

      rarity: 'uncommon',
      points: 35,
      discoveredAt: new Date()?.toISOString()
    },
    'body-3': {
      id: 'body-3',
      name: 'Gut bacteria',
      type: 'bacteria',
      environment: 'body',
      image: "https://images.unsplash.com/photo-1706204786979-e2076316143f",
      imageAlt: 'Diverse collection of different shaped bacteria in the intestinal environment',
      description: 'A community of friendly bacteria living in our intestines that help us digest food and stay healthy.',
      facts: [
      'We have trillions of these helpful bacteria',
      'They help make vitamins our body needs',
      'Each person has a unique bacterial fingerprint'],

      rarity: 'rare',
      points: 45,
      discoveredAt: new Date()?.toISOString()
    }
  };

  const discoveredMicrobeData = discoveredMicrobes?.map((id) => microbeDatabase?.[id])?.filter(Boolean);
  const totalPoints = discoveredMicrobeData?.reduce((sum, microbe) => sum + microbe?.points, 0);
  const progressPercentage = discoveredMicrobes?.length / totalMicrobes * 100;

  useEffect(() => {
    if (discoveredMicrobes?.length > 0) {
      const latestDiscovery = discoveredMicrobes?.[discoveredMicrobes?.length - 1];
      const microbeData = microbeDatabase?.[latestDiscovery];
      if (microbeData) {
        setRecentDiscovery(microbeData);
        setTimeout(() => setRecentDiscovery(null), 3000);
      }
    }
  }, [discoveredMicrobes]);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':return 'text-success bg-success/10 border-success/20';
      case 'uncommon':return 'text-primary bg-primary/10 border-primary/20';
      case 'rare':return 'text-accent bg-accent/10 border-accent/20';
      case 'legendary':return 'text-error bg-error/10 border-error/20';
      default:return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bacteria':return 'Circle';
      case 'virus':return 'Zap';
      case 'fungi':return 'Flower';
      case 'protozoa':return 'Waves';
      case 'algae':return 'Leaf';
      default:return 'Microscope';
    }
  };

  return (
    <div className={`fixed top-20 right-4 z-30 ${className}`}>
      {/* Recent Discovery Animation */}
      {recentDiscovery &&
      <div className="mb-4 bg-card border-2 border-accent rounded-xl p-4 shadow-pronounced animate-slide-up">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent animate-bounce-gentle">
              <Image
              src={recentDiscovery?.image}
              alt={recentDiscovery?.imageAlt}
              className="w-full h-full object-cover" />

            </div>
            <div>
              <h4 className="font-heading text-sm text-accent">New Discovery!</h4>
              <p className="font-body text-xs text-foreground">{recentDiscovery?.name}</p>
              <div className="flex items-center space-x-1 mt-1">
                <Icon name="Star" size={12} className="text-accent" />
                <span className="font-mono text-xs text-accent">+{recentDiscovery?.points} points</span>
              </div>
            </div>
          </div>
        </div>
      }
      {/* Main Discovery Panel */}
      <div className="bg-card border-2 border-border rounded-xl shadow-pronounced overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 bg-primary/10 border-b border-border cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Microscope" size={16} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-heading text-sm text-foreground">Discoveries</h3>
              <p className="font-caption text-xs text-muted-foreground">
                {discoveredMicrobes?.length}/{totalMicrobes} found
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-accent">
              <Icon name="Star" size={14} strokeWidth={2} />
              <span className="font-mono text-xs font-semibold">{totalPoints}</span>
            </div>
            <Icon
              name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
              size={16}
              className="text-muted-foreground" />

          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-2 bg-muted/30">
          <div className="flex items-center justify-between mb-1">
            <span className="font-caption text-xs text-muted-foreground">Progress</span>
            <span className="font-mono text-xs text-primary font-semibold">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded &&
        <div className="max-h-80 overflow-y-auto">
            {discoveredMicrobeData?.length === 0 ?
          <div className="p-6 text-center">
                <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="font-body text-sm text-muted-foreground">
                  Start exploring to discover microorganisms!
                </p>
              </div> :

          <div className="p-4 space-y-3">
                {discoveredMicrobeData?.map((microbe) =>
            <div
              key={microbe?.id}
              onClick={() => onMicrobeSelect(microbe)}
              className={`
                      flex items-center space-x-3 p-3 rounded-lg cursor-pointer
                      transition-all duration-fast hover:bg-muted/50
                      ${selectedMicrobe?.id === microbe?.id ? 'bg-primary/10 border border-primary/30' : 'bg-muted/20'}
                    `}>

                    {/* Microbe Image */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border flex-shrink-0">
                      <Image
                  src={microbe?.image}
                  alt={microbe?.imageAlt}
                  className="w-full h-full object-cover" />

                    </div>

                    {/* Microbe Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-heading text-xs text-foreground truncate">
                          {microbe?.name}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <Icon name="Star" size={10} className="text-accent" />
                          <span className="font-mono text-xs text-accent">{microbe?.points}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Icon name={getTypeIcon(microbe?.type)} size={10} className="text-primary" />
                          <span className="font-caption text-xs text-primary capitalize">
                            {microbe?.type}
                          </span>
                        </div>
                        
                        <div className={`
                          px-2 py-0.5 rounded-full border text-xs font-caption font-medium
                          ${getRarityColor(microbe?.rarity)}
                        `}>
                          {microbe?.rarity}
                        </div>
                      </div>
                    </div>
                  </div>
            )}
              </div>
          }
          </div>
        }
      </div>
    </div>);

};

export default DiscoveryPanel;