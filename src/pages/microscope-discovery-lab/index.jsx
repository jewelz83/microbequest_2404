import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import CharacterGuide from '../../components/ui/CharacterGuide';

import useGuideVisibility from '../../hooks/useGuideVisibility';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import MicroscopeViewport from './components/MicroscopeViewport';
import SpecimenSelector from './components/SpecimenSelector';
import EducationalPanel from './components/EducationalPanel';
import LabEnvironment from './components/LabEnvironment';

const MicroscopeDiscoveryLab = () => {
  const [selectedSpecimen, setSelectedSpecimen] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [focusLevel, setFocusLevel] = useState(50);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [discoveredFeatures, setDiscoveredFeatures] = useState(new Set());
  const { shouldShowGuide: showGuide, hideGuide: setShowGuide } = useGuideVisibility('microscope-discovery-lab');
  const [guideMessage, setGuideMessage] = useState("");
  const [completedFacts, setCompletedFacts] = useState(new Set());
  const [labProgress, setLabProgress] = useState({
    specimensExamined: 0,
    featuresDiscovered: 0,
    factsLearned: 0
  });

  // Initialize guide message
  useEffect(() => {
    setGuideMessage("Welcome to the Microscope Discovery Lab! Select a specimen from the library to begin your microscopic exploration. Use the zoom and focus controls to examine microorganisms in detail.");
  }, []);

  // Update guide based on user actions
  useEffect(() => {
    if (selectedSpecimen && !discoveredFeatures?.has(selectedSpecimen?.id)) {
      setGuideMessage(`Great choice! You're now examining ${selectedSpecimen?.name}. Use the zoom controls to get a closer look and click on the glowing hotspots to discover special features!`);
    } else if (activeHotspot) {
      setGuideMessage(`Excellent discovery! You found the ${activeHotspot?.label}. Check the educational panel to learn more about this important structure.`);
    } else if (discoveredFeatures?.size > 0) {
      setGuideMessage("You're becoming a real microbiologist! Try examining different specimens to compare their unique features and structures.");
    }
  }, [selectedSpecimen, activeHotspot, discoveredFeatures]);

  const handleSpecimenSelect = (specimen) => {
    setIsLoading(true);
    setActiveHotspot(null);
    
    setTimeout(() => {
      setSelectedSpecimen(specimen);
      setZoomLevel(1);
      setFocusLevel(50);
      setIsLoading(false);
      
      // Update progress
      if (!discoveredFeatures?.has(specimen?.id)) {
        setLabProgress(prev => ({
          ...prev,
          specimensExamined: prev?.specimensExamined + 1
        }));
      }
    }, 800);
  };

  const handleHotspotClick = (hotspot) => {
    setActiveHotspot(hotspot);
    
    // Mark feature as discovered
    const featureKey = `${selectedSpecimen?.id}-${hotspot?.id}`;
    if (!discoveredFeatures?.has(featureKey)) {
      setDiscoveredFeatures(prev => new Set([...prev, featureKey]));
      setLabProgress(prev => ({
        ...prev,
        featuresDiscovered: prev?.featuresDiscovered + 1
      }));
    }
  };

  const handleFactComplete = (specimen) => {
    const factKey = `facts-${specimen?.id}`;
    if (!completedFacts?.has(factKey)) {
      setCompletedFacts(prev => new Set([...prev, factKey]));
      setLabProgress(prev => ({
        ...prev,
        factsLearned: prev?.factsLearned + 1
      }));
      
      setGuideMessage("Fantastic! You've learned all the facts about this microorganism. You're well on your way to becoming a microbe expert!");
    }
  };

  const handleEquipmentInteract = (equipmentType, equipmentId) => {
    if (equipmentType === 'microscope' && equipmentId === 'microscope-main') {
      setGuideMessage("This is our main research microscope! It can magnify specimens up to 5000 times their actual size. Perfect for studying the tiniest details of microorganisms.");
    } else if (equipmentType === 'beaker') {
      setGuideMessage("These beakers contain special nutrient solutions that help microorganisms grow and thrive in our laboratory environment.");
    } else if (equipmentType === 'petri') {
      setGuideMessage("Petri dishes are perfect for growing bacterial colonies. Each colored spot represents millions of bacteria!");
    } else if (equipmentType === 'tubes') {
      setGuideMessage("Test tubes hold our specimen samples. Each tube contains different types of microorganisms ready for examination.");
    }
  };

  const achievements = [
    "First Discovery",
    "Zoom Master", 
    "Feature Hunter"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-8 lg:py-12">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-moderate">
                  <Icon name="Microscope" size={24} color="white" strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl lg:text-4xl font-heading text-foreground">
                  Microscope Discovery Lab
                </h1>
              </div>
              
              <p className="text-lg font-body text-muted-foreground max-w-2xl mx-auto">
                Explore the invisible world of microorganisms through our interactive virtual microscope. 
                Discover bacteria, viruses, fungi, and more with scientifically accurate detail!
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="w-8 h-8 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon name="Eye" size={16} strokeWidth={2.5} />
                </div>
                <p className="font-mono text-lg font-semibold text-foreground">{labProgress?.specimensExamined}</p>
                <p className="font-caption text-xs text-muted-foreground">Specimens Examined</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon name="Search" size={16} strokeWidth={2.5} />
                </div>
                <p className="font-mono text-lg font-semibold text-foreground">{labProgress?.featuresDiscovered}</p>
                <p className="font-caption text-xs text-muted-foreground">Features Discovered</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="w-8 h-8 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon name="BookOpen" size={16} strokeWidth={2.5} />
                </div>
                <p className="font-mono text-lg font-semibold text-foreground">{labProgress?.factsLearned}</p>
                <p className="font-caption text-xs text-muted-foreground">Facts Learned</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Lab Interface */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Panel - Specimen Selector */}
              <div className="xl:col-span-3">
                <SpecimenSelector
                  selectedSpecimen={selectedSpecimen}
                  onSpecimenSelect={handleSpecimenSelect}
                  isLoading={isLoading}
                  className="h-full"
                />
              </div>

              {/* Center Panel - Microscope and Lab */}
              <div className="xl:col-span-6">
                <div className="space-y-6">
                  {/* Lab Environment */}
                  <div className="bg-card border border-border rounded-lg p-6 shadow-moderate">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-lg text-foreground">Virtual Laboratory</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse-soft"></div>
                        <span className="font-caption text-sm text-muted-foreground">Equipment Online</span>
                      </div>
                    </div>
                    
                    <div className="h-48 lg:h-64">
                      <LabEnvironment
                        isActive={true}
                        onEquipmentInteract={handleEquipmentInteract}
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Microscope Viewport */}
                  <div className="bg-card border border-border rounded-lg p-6 shadow-moderate">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading text-lg text-foreground">Microscope View</h3>
                      {selectedSpecimen && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Icon name="Zap" size={16} className="text-accent" />
                          <span className="font-body text-foreground">
                            Magnification: <span className="font-mono font-semibold">{selectedSpecimen?.magnification}</span>
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-center">
                      <MicroscopeViewport
                        selectedSpecimen={selectedSpecimen}
                        zoomLevel={zoomLevel}
                        onZoomChange={setZoomLevel}
                        focusLevel={focusLevel}
                        onFocusChange={setFocusLevel}
                        onHotspotClick={handleHotspotClick}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Educational Content */}
              <div className="xl:col-span-3">
                <div className="space-y-6">
                  {/* Educational Panel */}
                  <EducationalPanel
                    selectedSpecimen={selectedSpecimen}
                    activeHotspot={activeHotspot}
                    onFactComplete={handleFactComplete}
                    className="h-full"
                  />

                  {/* Progress Indicator */}
                  <ProgressIndicator
                    completedActivities={labProgress?.specimensExamined}
                    totalActivities={4}
                    discoveredMicrobes={labProgress?.featuresDiscovered}
                    totalMicrobes={12}
                    achievements={achievements}
                    className="lg:block hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading text-foreground mb-4">Continue Your Microbe Adventure</h2>
              <p className="font-body text-muted-foreground max-w-2xl mx-auto">
                Ready to explore more? Check out other exciting activities in MicrobeQuest!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Link
                to="/microbe-matching-game"
                className="group bg-card border border-border rounded-lg p-4 hover:shadow-moderate hover:border-primary/30 transition-all duration-fast"
              >
                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-fast">
                  <Icon name="Puzzle" size={20} strokeWidth={2.5} />
                </div>
                <h3 className="font-heading text-sm text-foreground mb-2 text-center">Matching Game</h3>
                <p className="font-caption text-xs text-muted-foreground text-center">Match microbe pairs</p>
              </Link>

              <Link
                to="/world-explorer-mode"
                className="group bg-card border border-border rounded-lg p-4 hover:shadow-moderate hover:border-primary/30 transition-all duration-fast"
              >
                <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-fast">
                  <Icon name="Compass" size={20} strokeWidth={2.5} />
                </div>
                <h3 className="font-heading text-sm text-foreground mb-2 text-center">World Explorer</h3>
                <p className="font-caption text-xs text-muted-foreground text-center">Discover hidden microbes</p>
              </Link>

              <Link
                to="/quiz-challenge-system"
                className="group bg-card border border-border rounded-lg p-4 hover:shadow-moderate hover:border-primary/30 transition-all duration-fast"
              >
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-fast">
                  <Icon name="Brain" size={20} strokeWidth={2.5} />
                </div>
                <h3 className="font-heading text-sm text-foreground mb-2 text-center">Quiz Challenge</h3>
                <p className="font-caption text-xs text-muted-foreground text-center">Test your knowledge</p>
              </Link>

              <Link
                to="/progress-achievement-hub"
                className="group bg-card border border-border rounded-lg p-4 hover:shadow-moderate hover:border-primary/30 transition-all duration-fast"
              >
                <div className="w-10 h-10 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-fast">
                  <Icon name="Trophy" size={20} strokeWidth={2.5} />
                </div>
                <h3 className="font-heading text-sm text-foreground mb-2 text-center">Progress Hub</h3>
                <p className="font-caption text-xs text-muted-foreground text-center">View achievements</p>
              </Link>
            </div>

            <div className="text-center mt-8">
              <Link to="/game-home-dashboard">
                <Button variant="outline" iconName="Home" iconPosition="left">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      {/* Character Guide */}
      <CharacterGuide
        character="aunt-juju"
        message={guideMessage}
        emotion="encouraging"
        position="bottom-right"
        isVisible={showGuide}
        onClose={() => setShowGuide(false)}
        showHint={selectedSpecimen && discoveredFeatures?.size === 0}
        hintText="Try clicking on the glowing spots in the microscope view to discover special features!"
      />
    </div>
  );
};

export default MicroscopeDiscoveryLab;