import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EducationalInfoPanel = ({
  microbe = null,
  isVisible = false,
  onClose,
  className = ""
}) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fallback sample microbes data - only used if microbe prop doesn't have complete info
  const fallbackMicrobes = {
    'ecoli': {
      scientificName: 'Escherichia coli',
      size: '2-3 micrometers long, 0.5 micrometers wide',
      habitat: 'Intestinal tract of humans and warm-blooded animals',
      description: 'E. coli is a rod-shaped bacterium commonly found in the intestines of humans and warm-blooded animals. Most strains are harmless and actually help with digestion!',
      facts: [
        'E. coli can multiply every 20 minutes under ideal conditions',
        'Most E. coli strains are completely harmless to humans',
        'Scientists use E. coli in laboratories to study genetics',
        'E. coli helps produce vitamin K in your intestines',
        'It was first discovered by German pediatrician Theodor Escherich in 1885'
      ],
      funFact: 'E. coli bacteria are so small that about 1 million could fit on the head of a pin!',
      safetyTip: 'Always wash your hands before eating to keep harmful bacteria away.',
      relatedMicrobes: ['Salmonella', 'Lactobacillus', 'Streptococcus']
    },
    'influenza': {
      scientificName: 'Influenza A/B/C virus',
      size: '80-120 nanometers in diameter',
      habitat: 'Respiratory system of humans and animals',
      description: 'The influenza virus causes the seasonal flu. It\'s much smaller than bacteria and needs to infect cells to reproduce.',
      facts: [
        'Influenza viruses change their surface proteins every year',
        'The virus spreads through tiny droplets when people cough or sneeze',
        'There are three main types: Influenza A, B, and C',
        'Influenza A can cause pandemics that spread worldwide',
        'The 1918 flu pandemic infected about one-third of the world\'s population'
      ],
      funFact: 'Viruses are so tiny that they can only be seen with the most powerful microscopes!',
      safetyTip: 'Cover your mouth when you cough and get your flu vaccine every year.',
      relatedMicrobes: ['Rhinovirus', 'Coronavirus', 'Respiratory Syncytial Virus']
    },
    'penicillium': {
      scientificName: 'Penicillium chrysogenum',
      size: 'Individual cells 2-4 micrometers, forms visible colonies several centimeters wide',
      habitat: 'Soil, decaying organic matter, food, and moist indoor environments',
      description: 'Penicillium is a blue-green mold fungus famous for producing penicillin, the first widely-used antibiotic that has saved millions of lives.',
      facts: [
        'Alexander Fleming discovered penicillin from Penicillium mold in 1928 by accident',
        'Penicillin has saved millions of lives by fighting bacterial infections',
        'Penicillium spores are everywhere in the air and can land on food',
        'Some Penicillium species are used to make blue cheese like Roquefort',
        'The fungus gets its blue-green color from the spores it produces'
      ],
      funFact: 'The discovery of penicillin from moldy bread changed medicine forever and earned Fleming a Nobel Prize!',
      safetyTip: 'Don\'t eat moldy food, but remember that some molds help make life-saving medicines.',
      relatedMicrobes: ['Aspergillus', 'Saccharomyces cerevisiae', 'Candida albicans']
    },
    'paramecium': {
      scientificName: 'Paramecium caudatum',
      size: '200-300 micrometers long (visible under a basic microscope)',
      habitat: 'Freshwater environments like ponds, lakes, and streams rich in organic matter',
      description: 'Paramecium is a slipper-shaped, single-celled organism covered in tiny cilia that help it swim and feed on bacteria and small particles.',
      facts: [
        'Paramecium can swim at speeds of up to 4 body lengths per second',
        'It has two nuclei: a large one for daily functions and a small one for reproduction',
        'Thousands of cilia beat in coordinated waves to help it swim and feed',
        'It can reverse direction by changing how its cilia beat',
        'Paramecium reproduces by splitting in half about once per day'
      ],
      funFact: 'Paramecium looks like a tiny slipper dancing in water when viewed under a microscope!',
      safetyTip: 'Pond water contains many microorganisms - it\'s safe to observe but don\'t drink it!',
      relatedMicrobes: ['Euglena', 'Amoeba', 'Stentor']
    },
    'streptococcus': {
      scientificName: 'Streptococcus pyogenes',
      size: '0.6-1.0 micrometers in diameter, arranged in chains of 4-10 cells',
      habitat: 'Human throat, skin, and respiratory tract',
      description: 'Streptococcus bacteria are spherical and grow in chains like beads. Some species are helpful, while others can cause infections like strep throat.',
      facts: [
        'Streptococcus gets its name from "strepto" meaning twisted chain',
        'Strep throat is caused by Streptococcus pyogenes bacteria',
        'Some Streptococcus species help make yogurt and cheese',
        'These bacteria don\'t need oxygen to survive',
        'Rapid strep tests can identify strep throat infections in minutes'
      ],
      funFact: 'Under a microscope, Streptococcus bacteria look like tiny purple pearls strung together!',
      safetyTip: 'If you have a persistent sore throat, see a doctor - it might be strep throat.',
      relatedMicrobes: ['Staphylococcus', 'E. coli', 'Lactobacillus']
    },
    'rhinovirus': {
      scientificName: 'Human rhinovirus',
      size: '25-30 nanometers in diameter (1000x smaller than bacteria)',
      habitat: 'Human nasal passages and upper respiratory tract; spreads through airborne droplets',
      description: 'Rhinovirus is the most common cause of the common cold. With over 100 different types, it explains why people can catch colds multiple times.',
      facts: [
        'There are more than 100 different types of rhinoviruses',
        'Rhinoviruses cause about 30-50% of all common colds',
        'The virus can survive on surfaces for several hours',
        'It spreads easily through sneezing, coughing, and contaminated surfaces',
        'Rhinoviruses prefer the cooler temperature of your nasal passages'
      ],
      funFact: 'You can only catch a cold from each rhinovirus type once, but with 100+ types, colds keep coming back!',
      safetyTip: 'Wash your hands frequently, avoid touching your face, and stay away from sick people.',
      relatedMicrobes: ['Influenza virus', 'Coronavirus', 'Adenovirus']
    }
  };

  // Use microbe prop data if complete, otherwise fallback to sample data
  const currentMicrobe = microbe && microbe?.scientificName ? microbe : 
    (microbe?.pairId && fallbackMicrobes?.[microbe?.pairId] ? 
     { ...microbe, ...fallbackMicrobes?.[microbe?.pairId] } : 
     fallbackMicrobes?.ecoli);

  useEffect(() => {
    if (isVisible) {
      setCurrentFactIndex(0);
    }
  }, [isVisible, microbe]);

  const nextFact = () => {
    if (currentMicrobe?.facts && currentFactIndex < currentMicrobe?.facts?.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentFactIndex(currentFactIndex + 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const prevFact = () => {
    if (currentFactIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentFactIndex(currentFactIndex - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'bacteria':return 'text-success bg-success/10 border-success/20';
      case 'virus':return 'text-error bg-error/10 border-error/20';
      case 'fungi':return 'text-accent bg-accent/10 border-accent/20';
      case 'protozoa':return 'text-primary bg-primary/10 border-primary/20';
      default:return 'text-muted-foreground bg-muted border-border';
    }
  };

  if (!isVisible || !currentMicrobe) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className={`
        bg-card rounded-2xl shadow-pronounced border border-border 
        w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up
        ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-moderate">
              <Image
                src={currentMicrobe?.image}
                alt={currentMicrobe?.imageAlt}
                className="w-full h-full object-cover" />

            </div>
            <div>
              <h2 className="text-xl font-heading text-foreground">{currentMicrobe?.name}</h2>
              <p className="font-mono text-sm text-muted-foreground italic">
                {currentMicrobe?.scientificName}
              </p>
              <div className={`
                inline-flex items-center space-x-1 mt-1 px-2 py-1 rounded-full text-xs font-caption border
                ${getCategoryColor(currentMicrobe?.category)}
              `}>
                <Icon
                  name={currentMicrobe?.category === 'bacteria' ? 'Circle' :
                  currentMicrobe?.category === 'virus' ? 'Zap' :
                  currentMicrobe?.category === 'fungi' ? 'Flower' : 'Waves'}
                  size={12} />

                <span className="capitalize">{currentMicrobe?.category}</span>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={onClose} iconName="X" />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Ruler" size={16} className="text-primary" />
                <span className="font-caption text-sm font-semibold text-foreground">Size</span>
              </div>
              <p className="font-mono text-sm text-muted-foreground">{currentMicrobe?.size}</p>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="MapPin" size={16} className="text-secondary" />
                <span className="font-caption text-sm font-semibold text-foreground">Habitat</span>
              </div>
              <p className="font-body text-sm text-muted-foreground">{currentMicrobe?.habitat}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-heading text-lg text-foreground mb-3 flex items-center space-x-2">
              <Icon name="BookOpen" size={20} className="text-accent" />
              <span>About This Microbe</span>
            </h3>
            <p className="font-body text-foreground leading-relaxed">
              {currentMicrobe?.description}
            </p>
          </div>

          {/* Interactive Facts */}
          {currentMicrobe?.facts && currentMicrobe?.facts?.length > 0 &&
          <div className="mb-6">
              <h3 className="font-heading text-lg text-foreground mb-3 flex items-center space-x-2">
                <Icon name="Lightbulb" size={20} className="text-accent" />
                <span>Fun Facts</span>
              </h3>
              
              <div className="bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/20 rounded-lg p-4">
                <div className={`
                  transition-all duration-300 animate-smooth
                  ${isAnimating ? 'opacity-50 transform scale-95' : 'opacity-100 transform scale-100'}
                `}>
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    {currentMicrobe?.facts?.[currentFactIndex]}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={prevFact}
                  disabled={currentFactIndex === 0}
                  iconName="ChevronLeft"
                  iconPosition="left">

                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    {currentMicrobe?.facts?.map((_, index) =>
                  <div
                    key={index}
                    className={`
                          w-2 h-2 rounded-full transition-all duration-fast
                          ${index === currentFactIndex ? 'bg-accent' : 'bg-muted-foreground/30'}
                        `}>
                  </div>
                  )}
                  </div>
                  
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={nextFact}
                  disabled={currentFactIndex === currentMicrobe?.facts?.length - 1}
                  iconName="ChevronRight"
                  iconPosition="right">

                    Next
                  </Button>
                </div>
              </div>
            </div>
          }

          {/* Fun Fact & Safety Tip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {currentMicrobe?.funFact &&
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Sparkles" size={16} className="text-secondary" />
                  <span className="font-caption text-sm font-semibold text-secondary">Did You Know?</span>
                </div>
                <p className="font-body text-sm text-foreground">{currentMicrobe?.funFact}</p>
              </div>
            }
            
            {currentMicrobe?.safetyTip &&
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Shield" size={16} className="text-success" />
                  <span className="font-caption text-sm font-semibold text-success">Safety Tip</span>
                </div>
                <p className="font-body text-sm text-foreground">{currentMicrobe?.safetyTip}</p>
              </div>
            }
          </div>

          {/* Related Microbes */}
          {currentMicrobe?.relatedMicrobes && currentMicrobe?.relatedMicrobes?.length > 0 &&
          <div>
              <h4 className="font-heading text-md text-foreground mb-3 flex items-center space-x-2">
                <Icon name="Link" size={18} className="text-primary" />
                <span>Related Microbes</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentMicrobe?.relatedMicrobes?.map((related, index) =>
              <div
                key={index}
                className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-2 rounded-full border border-primary/20">

                    <Icon name="Microscope" size={14} />
                    <span className="font-caption text-sm">{related}</span>
                  </div>
              )}
              </div>
            </div>
          }
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="GraduationCap" size={16} className="text-accent" />
            <span className="font-body text-muted-foreground">Keep learning about microbes!</span>
          </div>
          
          <Button variant="default" onClick={onClose}>
            Continue Playing
          </Button>
        </div>
      </div>
    </div>);

};

export default EducationalInfoPanel;