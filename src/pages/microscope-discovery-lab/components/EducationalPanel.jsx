import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const EducationalPanel = ({ 
  selectedSpecimen, 
  activeHotspot, 
  onFactComplete,
  className = "" 
}) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedFacts, setCompletedFacts] = useState(new Set());

  const educationalContent = {
    bacteria: {
      generalFacts: [
        "Bacteria are single-celled organisms that can be found everywhere on Earth!",
        "Most bacteria are helpful - they help us digest food and make vitamins.",
        "Bacteria can reproduce by splitting in half every 20 minutes.",
        "Some bacteria can survive in extreme temperatures, even in space!"
      ],
      structures: {
        'Cell Wall': "The cell wall is like a protective armor that keeps the bacteria safe and gives it shape.",
        'Nucleus': "Bacteria don't have a true nucleus like we do - their DNA floats freely inside!",
        'Flagella': "These are like tiny propellers that help bacteria swim through liquids."
      },
      funFacts: [
        "There are more bacteria in your mouth than people on Earth!",
        "Bacteria helped create the oxygen we breathe billions of years ago.",
        "Some bacteria can eat plastic and help clean up pollution."
      ]
    },
    virus: {
      generalFacts: [
        "Viruses are much smaller than bacteria - they\'re like tiny robots!",
        "Viruses need to live inside other cells to make copies of themselves.",
        "Not all viruses make us sick - some can actually help us!",
        "Viruses have been on Earth for billions of years."
      ],
      structures: {
        'Protein Coat': "This protective shell keeps the virus\'s genetic material safe.",
        'Genetic Material': "This contains the instructions for making new viruses.",
        'Spikes': "These help the virus attach to and enter cells."
      },
      funFacts: [
        "Viruses are so small that millions could fit on the head of a pin!",
        "Some viruses can help fight cancer by attacking tumor cells.",
        "The common cold is caused by over 200 different types of viruses."
      ]
    },
    fungi: {
      generalFacts: [
        "Fungi are neither plants nor animals - they\'re their own special group!",
        "Mushrooms are just the \'fruit\' of fungi - most of the organism is underground.",
        "Fungi help break down dead plants and animals, recycling nutrients.",
        "Some fungi can glow in the dark like natural nightlights!"
      ],
      structures: {
        'Cap': "The mushroom cap protects the spores and helps them spread.",
        'Stem': "The stem lifts the cap up high so spores can travel far.",
        'Spores': "These are like seeds that grow into new fungi."
      },
      funFacts: [
        "The largest living organism on Earth is a fungus in Oregon!",
        "Fungi help plants grow by sharing nutrients through their roots.",
        "Yeast is a fungus that helps make bread fluffy and pizza dough rise."
      ]
    },
    protozoa: {
      generalFacts: [
        "Protozoa are single-celled animals that live in water everywhere!",
        "They move around by swimming, crawling, or using tiny hairs called cilia.",
        "Protozoa eat bacteria, algae, and other tiny organisms.",
        "Some protozoa can change their shape like tiny shape-shifters!"
      ],
      structures: {
        'Cilia': "These tiny hairs beat like oars to help the protozoa swim.",
        'Food Vacuole': "This is like a stomach where food gets digested.",
        'Nucleus': "The control center that runs all the protozoa\'s activities."
      },
      funFacts: [
        "A single drop of pond water can contain thousands of protozoa!",
        "Some protozoa can live for hundreds of years by going to sleep.",
        "Protozoa help keep water clean by eating harmful bacteria."
      ]
    }
  };

  useEffect(() => {
    if (selectedSpecimen) {
      setCurrentFactIndex(0);
      setCompletedFacts(new Set());
    }
  }, [selectedSpecimen]);

  const getCurrentContent = () => {
    if (!selectedSpecimen) return null;
    
    const content = educationalContent?.[selectedSpecimen?.category];
    if (!content) return null;

    if (activeHotspot && content?.structures?.[activeHotspot?.label]) {
      return {
        type: 'structure',
        title: activeHotspot?.label,
        content: content?.structures?.[activeHotspot?.label],
        icon: 'Focus'
      };
    }

    return {
      type: 'general',
      title: 'Did You Know?',
      content: content?.generalFacts?.[currentFactIndex] || content?.generalFacts?.[0],
      icon: 'Lightbulb'
    };
  };

  const handleNextFact = () => {
    if (!selectedSpecimen) return;
    
    const content = educationalContent?.[selectedSpecimen?.category];
    const maxIndex = content?.generalFacts?.length - 1;
    
    setIsAnimating(true);
    setTimeout(() => {
      const nextIndex = currentFactIndex >= maxIndex ? 0 : currentFactIndex + 1;
      setCurrentFactIndex(nextIndex);
      
      const newCompleted = new Set(completedFacts);
      newCompleted?.add(currentFactIndex);
      setCompletedFacts(newCompleted);
      
      if (newCompleted?.size === content?.generalFacts?.length) {
        onFactComplete && onFactComplete(selectedSpecimen);
      }
      
      setIsAnimating(false);
    }, 200);
  };

  const handlePreviousFact = () => {
    if (!selectedSpecimen) return;
    
    const content = educationalContent?.[selectedSpecimen?.category];
    const maxIndex = content?.generalFacts?.length - 1;
    
    setIsAnimating(true);
    setTimeout(() => {
      const prevIndex = currentFactIndex <= 0 ? maxIndex : currentFactIndex - 1;
      setCurrentFactIndex(prevIndex);
      setIsAnimating(false);
    }, 200);
  };

  const currentContent = getCurrentContent();
  
  if (!selectedSpecimen || !currentContent) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading text-lg text-foreground mb-2">Educational Information</h3>
          <p className="font-body text-muted-foreground">
            Select a specimen to learn fascinating facts about microorganisms!
          </p>
        </div>
      </div>
    );
  }

  const content = educationalContent?.[selectedSpecimen?.category];
  const progress = content ? (completedFacts?.size / content?.generalFacts?.length) * 100 : 0;

  return (
    <div className={`bg-card border border-border rounded-lg shadow-moderate ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            selectedSpecimen?.category === 'bacteria' ? 'bg-success/10 text-success' :
            selectedSpecimen?.category === 'virus' ? 'bg-primary/10 text-primary' :
            selectedSpecimen?.category === 'fungi'? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'
          }`}>
            <Icon name={currentContent?.icon} size={16} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-heading text-sm text-foreground">{currentContent?.title}</h3>
            <p className="font-caption text-xs text-muted-foreground capitalize">
              {selectedSpecimen?.category} • {selectedSpecimen?.name}
            </p>
          </div>
        </div>
        
        {currentContent?.type === 'general' && (
          <div className="flex items-center space-x-2">
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {completedFacts?.size}/{content?.generalFacts?.length}
            </span>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-6">
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
          {/* Fact Content */}
          <div className="bg-muted/30 rounded-lg p-4 mb-4">
            <p className="font-body text-sm text-foreground leading-relaxed">
              {currentContent?.content}
            </p>
          </div>

          {/* Visual Diagram */}
          {selectedSpecimen && (
            <div className="relative bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center h-32">
                {selectedSpecimen?.category === 'bacteria' && (
                  <div className="relative">
                    <div className="w-20 h-32 bg-gradient-to-br from-success/60 to-success/80 rounded-full animate-pulse-soft">
                      <div className="absolute top-8 left-6 w-3 h-3 bg-white rounded-full"></div>
                      <div className="absolute top-8 right-6 w-3 h-3 bg-white rounded-full"></div>
                      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-8 h-4 border-b-2 border-white rounded-full"></div>
                    </div>
                    <div className="absolute -right-2 top-1/2 w-8 h-1 bg-success/60 rounded-full animate-bounce-gentle"></div>
                  </div>
                )}
                
                {selectedSpecimen?.category === 'virus' && (
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/60 to-primary/80 transform rotate-45 animate-spin-slow">
                      <div className="absolute inset-2 bg-primary/40 transform -rotate-45 rounded-sm">
                        <div className="absolute top-2 left-3 w-2 h-2 bg-white rounded-full"></div>
                        <div className="absolute top-2 right-3 w-2 h-2 bg-white rounded-full"></div>
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    {[...Array(6)]?.map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-6 bg-primary/60 rounded-full"
                        style={{
                          transform: `rotate(${i * 60}deg) translateY(-24px)`,
                          transformOrigin: 'center 24px'
                        }}
                      ></div>
                    ))}
                  </div>
                )}
                
                {selectedSpecimen?.category === 'fungi' && (
                  <div className="relative">
                    <div className="w-24 h-16 bg-gradient-to-br from-accent/60 to-accent/80 rounded-t-full animate-bounce-gentle">
                      <div className="absolute top-3 left-4 w-3 h-3 bg-white rounded-full opacity-60"></div>
                      <div className="absolute top-6 right-5 w-2 h-2 bg-white rounded-full opacity-60"></div>
                      <div className="absolute bottom-3 left-6 w-3 h-3 bg-white rounded-full"></div>
                      <div className="absolute bottom-3 right-6 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="w-6 h-12 bg-gradient-to-b from-yellow-200/60 to-yellow-400/60 mx-auto rounded-b-lg"></div>
                  </div>
                )}
                
                {selectedSpecimen?.category === 'protozoa' && (
                  <div className="relative">
                    <div className="w-28 h-16 bg-gradient-to-br from-secondary/60 to-secondary/80 rounded-full animate-pulse-soft">
                      <div className="absolute top-4 left-8 w-3 h-3 bg-white rounded-full"></div>
                      <div className="absolute top-4 right-8 w-3 h-3 bg-white rounded-full"></div>
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-2 border-b-2 border-white rounded-full"></div>
                    </div>
                    {[...Array(8)]?.map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-4 bg-secondary/40 rounded-full animate-wave"
                        style={{
                          left: `${20 + i * 8}%`,
                          top: '10%',
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          {currentContent?.type === 'general' && content && (
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousFact}
                className="flex items-center space-x-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-button transition-colors duration-fast"
              >
                <Icon name="ChevronLeft" size={16} strokeWidth={2} />
                <span className="font-caption text-sm text-foreground">Previous</span>
              </button>
              
              <div className="flex items-center space-x-1">
                {content?.generalFacts?.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-fast ${
                      index === currentFactIndex ? 'bg-primary' :
                      completedFacts?.has(index) ? 'bg-success' : 'bg-muted'
                    }`}
                  ></div>
                ))}
              </div>
              
              <button
                onClick={handleNextFact}
                className="flex items-center space-x-2 px-3 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-button transition-colors duration-fast"
              >
                <span className="font-caption text-sm">Next</span>
                <Icon name="ChevronRight" size={16} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Fun Facts Section */}
      {content && completedFacts?.size === content?.generalFacts?.length && (
        <div className="p-4 border-t border-border bg-accent/5">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Icon name="Star" size={14} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-heading text-sm text-accent mb-2">Bonus Fun Fact!</h4>
              <p className="font-body text-xs text-foreground">
                {content?.funFacts?.[Math.floor(Math.random() * content?.funFacts?.length)]}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalPanel;