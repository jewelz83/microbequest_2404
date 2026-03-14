import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

import Header from '../../components/ui/Header';
import CharacterGuide from '../../components/ui/CharacterGuide';
import FunFactModal from '../../components/ui/FunFactModal';
import useGuideVisibility from '../../hooks/useGuideVisibility';
import TimelineBar from './components/TimelineBar';
import EraBackground from './components/EraBackground';

import MiniGame from './components/MiniGame';

import ToolEvolution from './components/ToolEvolution';
import Button from '../../components/ui/Button';


const MicrobeTimelineAdventure = () => {
  const [selectedEra, setSelectedEra] = useState('discovery');
  const { shouldShowGuide, hideGuide } = useGuideVisibility('microbe-timeline-adventure');
  const [showFunFact, setShowFunFact] = useState(false);
  const [currentFunFact, setCurrentFunFact] = useState(null);
  const [unlockedEras, setUnlockedEras] = useState(['discovery']);
  const [collectedCards, setCollectedCards] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [activeMinigame, setActiveMinigame] = useState(null);
  const [showToolEvolution, setShowToolEvolution] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [unlockedEvents, setUnlockedEvents] = useState(['leeuwenhoek-discovery']);

  // Timeline Era Data Structure
  const timelineEras = {
    discovery: {
      id: 'discovery',
      name: 'The Discovery Era',
      subtitle: 'First Glimpses of the Invisible World',
      period: '1670s-1850s',
      yearRange: { start: 1670, end: 1850 },
      theme: 'Old laboratory with candles, parchment',
      background: 'sepia',
      color: 'amber',
      completed: false,
      keyEvents: [
        {
          id: 'leeuwenhoek-discovery',
          year: 1676,
          scientist: 'Antonie van Leeuwenhoek',
          title: 'Discovers "animalcules"',
          description: 'First observations of living microorganisms using homemade microscopes',
          minigame: 'microscope-focus',
          fact: 'Leeuwenhoek made over 500 microscopes in his lifetime!',
          points: 25,
          unlocked: true
        },
        {
          id: 'first-bacteria',
          year: 1683,
          scientist: 'Antonie van Leeuwenhoek',
          title: 'First bacteria observed',
          description: 'Drew detailed sketches of bacterial shapes - rods, spheres, and spirals',
          minigame: 'bacteria-drawing',
          fact: 'His drawings from 340 years ago are still accurate today!',
          points: 30,
          unlocked: false
        },
        {
          id: 'jenner-vaccination',
          year: 1796,
          scientist: 'Edward Jenner',
          title: 'Invents vaccination',
          description: 'Creates first vaccine using cowpox to prevent smallpox',
          minigame: 'vaccination-timeline',
          fact: 'The word "vaccine" comes from "vacca" meaning cow in Latin!',
          points: 40,
          unlocked: false
        },
        {
          id: 'pasteur-generation',
          year: 1850,
          scientist: 'Louis Pasteur',
          title: 'Disproves spontaneous generation',
          description: 'Swan neck flask experiment proves microbes come from other microbes',
          minigame: 'swan-flask-experiment',
          fact: 'Some of Pasteur\'s original flasks are still sterile today!',
          points: 35,
          unlocked: false
        }
      ]
    },
    germTheory: {
      id: 'germTheory',
      name: 'The Germ Theory Era',
      subtitle: 'Microbes Cause Disease!',
      period: '1850s-1900s',
      yearRange: { start: 1850, end: 1900 },
      theme: 'Victorian laboratory, gas lamps',
      background: 'victorian',
      color: 'emerald',
      completed: false,
      keyEvents: [
        {
          id: 'snow-cholera',
          year: 1854,
          scientist: 'John Snow',
          title: 'Traces cholera to contaminated water',
          description: 'Maps disease outbreak to identify water pump as source',
          minigame: 'outbreak-mapping',
          fact: 'John Snow is considered the father of modern epidemiology!',
          points: 45,
          unlocked: false
        },
        {
          id: 'lister-antiseptic',
          year: 1865,
          scientist: 'Joseph Lister',
          title: 'Introduces antiseptic surgery',
          description: 'Uses carbolic acid to prevent surgical infections',
          minigame: 'operating-room-cleaning',
          fact: 'Before Lister, 50% of surgical patients died from infection!',
          points: 40,
          unlocked: false
        },
        {
          id: 'koch-tuberculosis',
          year: 1882,
          scientist: 'Robert Koch',
          title: 'Discovers TB bacterium',
          description: 'Establishes Koch\'s postulates for proving disease causation',
          minigame: 'kochs-postulates',
          fact: 'Koch\'s postulates are still used by scientists today!',
          points: 50,
          unlocked: false
        },
        {
          id: 'pasteur-rabies',
          year: 1885,
          scientist: 'Louis Pasteur',
          title: 'Creates rabies vaccine',
          description: 'Saves Joseph Meister, first person to receive rabies vaccine',
          minigame: 'pasteur-laboratory',
          fact: 'Pasteur had never gone to medical school, he was a chemist!',
          points: 55,
          unlocked: false
        },
        {
          id: 'fleming-penicillin',
          year: 1928,
          scientist: 'Alexander Fleming',
          title: 'Discovers penicillin',
          description: 'Accidentally notices mold killing bacteria in petri dish',
          minigame: 'petri-dish-detective',
          fact: 'Fleming\'s "lucky accident" has saved millions of lives!',
          points: 60,
          unlocked: false
        }
      ]
    },
    modern: {
      id: 'modern',
      name: 'The Modern Era',
      subtitle: 'New Tools, New Discoveries',
      period: '1900s-1950s',
      yearRange: { start: 1900, end: 1950 },
      theme: 'Modern lab with electric lights',
      background: 'modern',
      color: 'blue',
      completed: false,
      keyEvents: [
        {
          id: 'electron-microscope',
          year: 1933,
          scientist: 'Ernst Ruska',
          title: 'Electron microscope invented',
          description: 'New technology allows 1000x better magnification than light microscopes',
          minigame: 'microscope-comparison',
          fact: 'Electron microscopes can magnify up to 2 million times!',
          points: 45,
          unlocked: false
        },
        {
          id: 'antibiotics-production',
          year: 1940,
          scientist: 'Multiple Scientists',
          title: 'Antibiotics mass-produced',
          description: 'Penicillin manufactured to treat wounded WWII soldiers',
          minigame: 'antibiotic-assembly',
          fact: 'Mass production of penicillin saved thousands of soldiers in WWII!',
          points: 50,
          unlocked: false
        },
        {
          id: 'dna-structure-study',
          year: 1952,
          scientist: 'Rosalind Franklin',
          title: 'DNA structure being studied',
          description: 'X-ray crystallography reveals clues about DNA structure',
          minigame: 'dna-building',
          fact: 'Franklin\'s Photo 51 was crucial for discovering DNA structure!',
          points: 55,
          unlocked: false
        }
      ]
    },
    dnaRevolution: {
      id: 'dnaRevolution',
      name: 'The DNA Revolution',
      subtitle: 'Understanding Life\'s Code',
      period: '1950s-2000s',
      yearRange: { start: 1950, end: 2000 },
      theme: 'High-tech lab with computers',
      background: 'hightech',
      color: 'purple',
      completed: false,
      keyEvents: [
        {
          id: 'watson-crick-dna',
          year: 1953,
          scientist: 'Watson & Crick',
          title: 'Discover DNA structure',
          description: 'Determines double helix structure of DNA using Franklin\'s data',
          minigame: 'double-helix-building',
          fact: 'The DNA double helix model was built using metal plates and wires!',
          points: 65,
          unlocked: false
        },
        {
          id: 'genetic-engineering',
          year: 1973,
          scientist: 'Boyer & Cohen',
          title: 'Genetic engineering begins',
          description: 'First successful DNA recombination experiment',
          minigame: 'gene-splicing',
          fact: 'The first genetically engineered medicine was human insulin!',
          points: 70,
          unlocked: false
        },
        {
          id: 'hiv-discovery',
          year: 1983,
          scientist: 'Luc Montagnier',
          title: 'HIV virus discovered',
          description: 'Identifies virus causing AIDS pandemic',
          minigame: 'virus-hunter',
          fact: 'HIV was one of the fastest identified disease-causing viruses in history!',
          points: 60,
          unlocked: false
        },
        {
          id: 'pcr-invention',
          year: 1990,
          scientist: 'Kary Mullis',
          title: 'PCR and DNA sequencing advances',
          description: 'Polymerase chain reaction allows rapid DNA copying',
          minigame: 'dna-copying',
          fact: 'PCR is used in COVID-19 tests to detect the virus!',
          points: 55,
          unlocked: false
        }
      ]
    },
    modernAge: {
      id: 'modernAge',
      name: 'The Modern Age',
      subtitle: 'Microbiome and Beyond',
      period: '2000s-Present',
      yearRange: { start: 2000, end: 2024 },
      theme: 'Ultra-modern lab with tablets and robots',
      background: 'futuristic',
      color: 'cyan',
      completed: false,
      keyEvents: [
        {
          id: 'human-genome',
          year: 2003,
          scientist: 'Human Genome Project',
          title: 'Human Genome Project completed',
          description: 'Complete sequence of human DNA mapped',
          minigame: 'microbiome-explorer',
          fact: 'Your body has 10 times more microbial cells than human cells!',
          points: 75,
          unlocked: false
        },
        {
          id: 'crispr-discovery',
          year: 2012,
          scientist: 'Doudna & Charpentier',
          title: 'CRISPR gene editing discovered',
          description: 'Revolutionary gene editing tool discovered',
          minigame: 'gene-editor',
          fact: 'CRISPR won the Nobel Prize in Chemistry in 2020!',
          points: 80,
          unlocked: false
        },
        {
          id: 'covid-pandemic',
          year: 2020,
          scientist: 'Multiple Scientists',
          title: 'COVID-19 pandemic',
          description: 'Fastest vaccine development in human history',
          minigame: 'vaccine-development',
          fact: 'mRNA vaccines were developed in just 11 months!',
          points: 85,
          unlocked: false
        },
        {
          id: 'microbiome-research',
          year: 2024,
          scientist: 'Current Researchers',
          title: 'Microbiome research',
          description: 'Scientists discover new microbes and their roles daily',
          minigame: 'meet-your-microbes',
          fact: 'Scientists discover about 15,000 new microbial species every year!',
          points: 90,
          unlocked: false
        }
      ]
    }
  };

  // Famous Scientists Data
  const famousScientists = {
    'leeuwenhoek': {
      name: 'Antonie van Leeuwenhoek',
      dates: '1632-1723',
      title: 'Father of Microbiology',
      discovery: 'First to observe living microorganisms',
      portrait: '/assets/images/scientists/leeuwenhoek.png',
      funFacts: [
        'Made over 500 microscopes by hand',
        'Was originally a cloth merchant',
        'Never shared his lens-making secrets'
      ],
      rarity: 'legendary',
      points: 100
    },
    'jenner': {
      name: 'Edward Jenner',
      dates: '1749-1823',
      title: 'Vaccination Pioneer',
      discovery: 'Created first vaccine',
      portrait: '/assets/images/scientists/jenner.png',
      funFacts: [
        'Used cowpox to prevent smallpox',
        'Saved millions of lives',
        'Word "vaccine" comes from Latin for cow'
      ],
      rarity: 'rare',
      points: 85
    },
    'pasteur': {
      name: 'Louis Pasteur',
      dates: '1822-1895',
      title: 'Germ Theory Pioneer',
      discovery: 'Proved germs cause disease',
      portrait: '/assets/images/scientists/pasteur.png',
      funFacts: [
        'Invented pasteurization process',
        'Created rabies vaccine',
        'Never went to medical school'
      ],
      rarity: 'legendary',
      points: 100
    },
    'koch': {
      name: 'Robert Koch',
      dates: '1843-1910',
      title: 'Disease Detective',
      discovery: 'Identified TB and cholera bacteria',
      portrait: '/assets/images/scientists/koch.png',
      funFacts: [
        'Established Koch\'s postulates',
        'Won Nobel Prize in 1905',
        'Founded modern bacteriology'
      ],
      rarity: 'rare',
      points: 85
    },
    'lister': {
      name: 'Joseph Lister',
      dates: '1827-1912',
      title: 'Antiseptic Surgery Pioneer',
      discovery: 'Introduced surgical antiseptics',
      portrait: '/assets/images/scientists/lister.png',
      funFacts: [
        'Reduced surgical deaths by 80%',
        'Used carbolic acid as antiseptic',
        'Listerine mouthwash named after him'
      ],
      rarity: 'uncommon',
      points: 70
    },
    'fleming': {
      name: 'Alexander Fleming',
      dates: '1881-1955',
      title: 'Penicillin Discoverer',
      discovery: 'Discovered penicillin antibiotic',
      portrait: '/assets/images/scientists/fleming.png',
      funFacts: [
        'Discovery was accidental',
        'Saved millions during WWII',
        'Won Nobel Prize in 1945'
      ],
      rarity: 'legendary',
      points: 100
    },
    'salk': {
      name: 'Jonas Salk',
      dates: '1914-1995',
      title: 'Polio Vaccine Creator',
      discovery: 'Developed polio vaccine',
      portrait: '/assets/images/scientists/salk.png',
      funFacts: [
        'Never patented his vaccine',
        'Tested vaccine on himself first',
        'Eliminated polio in many countries'
      ],
      rarity: 'rare',
      points: 85
    },
    'franklin': {
      name: 'Rosalind Franklin',
      dates: '1920-1958',
      title: 'DNA Structure Pioneer',
      discovery: 'X-ray crystallography of DNA',
      portrait: '/assets/images/scientists/franklin.png',
      funFacts: [
        'Photo 51 revealed DNA structure',
        'Died before Nobel Prize awarded',
        'Also studied RNA and virus structure'
      ],
      rarity: 'legendary',
      points: 100
    },
    'watson-crick': {
      name: 'Watson & Crick',
      dates: '1928- & 1916-2004',
      title: 'DNA Double Helix Discoverers',
      discovery: 'Determined DNA structure',
      portrait: '/assets/images/scientists/watson-crick.png',
      funFacts: [
        'Built physical model with metal',
        'Used Franklin\'s X-ray data',
        'Won Nobel Prize in 1962'
      ],
      rarity: 'legendary',
      points: 100
    },
    'doudna-charpentier': {
      name: 'Doudna & Charpentier',
      dates: '1964- & 1968-',
      title: 'CRISPR Pioneers',
      discovery: 'Developed CRISPR gene editing',
      portrait: '/assets/images/scientists/doudna-charpentier.png',
      funFacts: [
        'Won Nobel Prize in 2020',
        'CRISPR can edit any gene',
        'Revolutionary for medicine'
      ],
      rarity: 'legendary',
      points: 100
    }
  };

  // Get current era data
  const currentEra = timelineEras?.[selectedEra];

  // Character guide messages by era
  const getCharacterMessage = (eraId) => {
    const messages = {
      discovery: "Welcome to the Discovery Era! Let\'s start with Leeuwenhoek\'s amazing microscopes. Click on the first event to begin your journey through time!",
      germTheory: "Now we\'re in the Victorian era where scientists discovered that tiny microbes cause big diseases! Exciting times ahead!",
      modern: "The 20th century brought incredible new tools! Electric lights, better microscopes, and life-saving medicines. Let's explore!",
      dnaRevolution: "We're entering the age of genetics! Scientists are now reading the very code of life itself. This is where it gets really exciting!",
      modernAge: "Welcome to today's world of biotechnology! We can now edit genes, sequence entire genomes, and discover new microbes daily!"
    };
    return messages?.[eraId] || "Let's explore this fascinating era together!";
  };

  // Handle era selection
  const handleEraSelect = (eraId) => {
    if (unlockedEras?.includes(eraId)) {
      // STEP 2: Add click test
      console.log(`Era ${getEraNumber(eraId)} clicked`);
      alert(`You clicked Era ${getEraNumber(eraId)}!`);
      
      // STEP 3: Simple navigation
      setSelectedEra(eraId);
      setShowTimeline(false);
      // Guide visibility is now managed by the hook, no manual setting needed
    }
  };

  // Helper function to get era number
  const getEraNumber = (eraId) => {
    const eraOrder = ['discovery', 'germTheory', 'modern', 'dnaRevolution', 'modernAge'];
    return eraOrder?.indexOf(eraId) + 1;
  };

  // Handle back to timeline
  const handleBackToTimeline = () => {
    setShowTimeline(true);
  };

  // Handle event completion
  const handleEventComplete = (eventId, points) => {
    // Mark event as completed
    if (!completedEvents?.includes(eventId)) {
      setCompletedEvents(prev => [...prev, eventId]);
    }
    
    // Add points
    setTotalPoints(prev => prev + points);
    
    // Check if this unlocks next event in era
    const currentEraData = timelineEras?.[selectedEra];
    const eventIndex = currentEraData?.keyEvents?.findIndex(e => e?.id === eventId);
    
    if (eventIndex !== -1 && eventIndex < currentEraData?.keyEvents?.length - 1) {
      const nextEvent = currentEraData?.keyEvents?.[eventIndex + 1];
      if (!unlockedEvents?.includes(nextEvent?.id)) {
        setUnlockedEvents(prev => [...prev, nextEvent?.id]);
      }
    }
    
    // Check if era is complete
    const allEventsInEra = currentEraData?.keyEvents?.map(e => e?.id) || [];
    const allEventsCompleted = allEventsInEra?.every(id => 
      completedEvents?.includes(id) || id === eventId
    );
    
    if (allEventsCompleted) {
      // Unlock next era
      const eraOrder = ['discovery', 'germTheory', 'modern', 'dnaRevolution', 'modernAge'];
      const currentIndex = eraOrder?.indexOf(selectedEra);
      if (currentIndex < eraOrder?.length - 1) {
        const nextEra = eraOrder?.[currentIndex + 1];
        if (!unlockedEras?.includes(nextEra)) {
          setUnlockedEras(prev => [...prev, nextEra]);
          // Unlock first event of next era
          const nextEraData = timelineEras?.[nextEra];
          if (nextEraData?.keyEvents?.[0]) {
            setUnlockedEvents(prev => [...prev, nextEraData?.keyEvents?.[0]?.id]);
          }
        }
      }
    }
  };

  // Handle scientist card collection
  const handleCollectScientist = (scientistId) => {
    if (!collectedCards?.includes(scientistId)) {
      setCollectedCards(prev => [...prev, scientistId]);
      const scientist = famousScientists?.[scientistId];
      setTotalPoints(prev => prev + scientist?.points);
      
      // Show collection notification
      setCurrentFunFact({
        title: `Collected: ${scientist?.name}`,
        content: `You've earned ${scientist?.points} points! ${scientist?.funFacts?.[0]}`,
        type: 'collection'
      });
      setShowFunFact(true);
    }
  };

  // Handle minigame launch
  const handleMinigameLaunch = (minigameId, eventData) => {
    setActiveMinigame({
      id: minigameId,
      eventData: eventData,
      onComplete: (result) => {
        handleEventComplete(eventData?.id, eventData?.points + (result?.score || 0));
        setActiveMinigame(null);
      },
      onClose: () => setActiveMinigame(null)
    });
  };

  // Handle fun fact display
  const handleShowFunFact = (fact, title = "Did You Know?") => {
    setCurrentFunFact({ title, content: fact, type: 'fact' });
    setShowFunFact(true);
  };

  // Helper function to get era icon
  const getEraIcon = (eraId) => {
    const icons = {
      discovery: 'Search',
      germTheory: 'Shield',
      modern: 'Zap',
      dnaRevolution: 'Dna',
      modernAge: 'Rocket'
    };
    return icons?.[eraId] || 'Circle';
  };

  // If timeline is hidden, show era content
  if (!showTimeline) {
    return (
      <div className="min-h-screen bg-background overflow-hidden">
        <Header />
        
        <main className="pt-20 pb-8 relative">
          {/* Era Background */}
          <EraBackground era={currentEra} />
          
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            {/* Back to Timeline Button */}
            <div className="mb-8 animate-slide-up">
              <Button
                onClick={handleBackToTimeline}
                variant="outline"
                iconName="ArrowLeft"
                className="mb-6"
              >
                Back to Timeline
              </Button>
            </div>

            {/* Era Welcome Content */}
            <section className="text-center mb-12 animate-slide-up">
              <div className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-12 shadow-pronounced max-w-4xl mx-auto">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-${currentEra?.color}-500 to-${currentEra?.color}-600 flex items-center justify-center`}>
                  <Icon 
                    name={getEraIcon(currentEra?.id)} 
                    size={48} 
                    className="text-white" 
                    strokeWidth={2} 
                  />
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-heading text-foreground mb-4">
                  Welcome to Era {getEraNumber(selectedEra)}!
                </h1>
                
                <h2 className={`text-3xl font-heading mb-4 text-${currentEra?.color}-600`}>
                  {currentEra?.name}
                </h2>
                
                <p className="font-body text-xl text-muted-foreground mb-6 leading-relaxed">
                  {currentEra?.subtitle}
                </p>
                
                <div className="flex items-center justify-center space-x-6 text-lg mb-8">
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={20} className="text-muted-foreground" />
                    <span className="font-mono text-foreground">{currentEra?.period}</span>
                  </div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={20} className="text-muted-foreground" />
                    <span className="font-body text-foreground">{currentEra?.theme}</span>
                  </div>
                </div>

                {/* Era Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                  <div className="text-center">
                    <div className={`text-2xl font-heading text-${currentEra?.color}-600 mb-1`}>
                      {currentEra?.keyEvents?.length}
                    </div>
                    <div className="font-caption text-sm text-muted-foreground">
                      Discoveries
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-heading text-${currentEra?.color}-600 mb-1`}>
                      {currentEra?.keyEvents?.filter(e => e?.unlocked)?.length}
                    </div>
                    <div className="font-caption text-sm text-muted-foreground">
                      Unlocked
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-heading text-${currentEra?.color}-600 mb-1`}>
                      {currentEra?.keyEvents?.reduce((sum, event) => sum + (event?.points || 0), 0)}
                    </div>
                    <div className="font-caption text-sm text-muted-foreground">
                      Total Points
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Coming Soon Message */}
            <section className="text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-8 max-w-2xl mx-auto">
                <Icon name="Construction" size={48} className="text-primary mx-auto mb-4" />
                <h3 className="font-heading text-xl text-foreground mb-3">
                  Era Content Coming Soon!
                </h3>
                <p className="font-body text-muted-foreground mb-6">
                  We're building an amazing interactive experience for {currentEra?.name}. 
                  Stay tuned for timeline events, mini-games, and scientist discoveries!
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    onClick={handleBackToTimeline}
                    variant="primary"
                    iconName="ArrowLeft"
                  >
                    Back to Timeline
                  </Button>
                  <Button
                    variant="outline"
                    iconName="Star"
                    onClick={() => handleShowFunFact(
                      `Did you know? ${currentEra?.keyEvents?.[0]?.fact || 'This era contains amazing discoveries!'}`
                    )}
                  >
                    Era Fun Fact
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Character Guide */}
        <CharacterGuide
          character="aunt-juju"
          message={`Great choice! You're now exploring ${currentEra?.name}. This era spans ${currentEra?.period} and includes ${currentEra?.keyEvents?.length} major discoveries. Click 'Back to Timeline' when you're ready to explore other eras!`}
          emotion="excited"
          position="bottom-right"
          isVisible={shouldShowGuide}
          onClose={hideGuide}
          showHint={true}
          hintText="Full era content is coming soon! For now, explore different eras from the timeline."
        />

        {/* Fun Fact Modal */}
        <FunFactModal
          isOpen={showFunFact}
          onClose={() => setShowFunFact(false)}
          title={currentFunFact?.title}
          content={currentFunFact?.content}
          type={currentFunFact?.type}
          microbe={null}
          onViewDetails={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      <main className="pt-20 pb-8 relative">
        {/* Era Background */}
        <EraBackground era={currentEra} />
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          {/* Timeline Header */}
          <section className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 mb-4">
              <Icon name="Clock" size={16} strokeWidth={2} />
              <span className="font-caption text-sm font-medium">Time Travel Adventure</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-heading text-foreground mb-4">
              Microbe Timeline Adventure
            </h1>
            
            <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
              Join Aunt Juju and Charlie on an epic journey through 350+ years of microbiology discoveries!
            </p>

            {/* Era Title Card */}
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-pronounced max-w-2xl mx-auto">
              <h2 className={`text-2xl font-heading mb-2 text-${currentEra?.color}-600`}>
                {currentEra?.name}
              </h2>
              <p className="font-body text-muted-foreground mb-3">
                {currentEra?.subtitle}
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={16} className="text-muted-foreground" />
                  <span className="font-mono text-foreground">{currentEra?.period}</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={16} className="text-muted-foreground" />
                  <span className="font-body text-foreground">{currentEra?.theme}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Era Events Grid */}
          <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentEra?.keyEvents?.map((event, index) => {
                const isUnlocked = unlockedEvents?.includes(event?.id);
                const isCompleted = completedEvents?.includes(event?.id);
                
                return (
                  <div
                    key={event?.id}
                    className={`
                      bg-card border-2 rounded-xl p-6 shadow-moderate transition-all duration-fast
                      animate-slide-up hover:shadow-pronounced
                      ${isUnlocked
                        ? 'border-border hover:border-primary/30 cursor-pointer' : 'border-border opacity-50 cursor-not-allowed'
                      }
                      ${isCompleted ? 'ring-2 ring-success bg-success/5' : ''}
                    `}
                    style={{ animationDelay: `${index * 150}ms` }}
                    onClick={() => isUnlocked && handleMinigameLaunch(event?.minigame, event)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center text-white font-heading font-bold
                          bg-gradient-to-br from-${currentEra?.color}-500 to-${currentEra?.color}-600
                        `}>
                          {event?.year}
                        </div>
                        <div>
                          <h3 className="font-heading text-lg text-foreground">{event?.title}</h3>
                          <p className="font-caption text-sm text-primary">{event?.scientist}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {isCompleted && (
                          <Icon name="CheckCircle" size={20} className="text-success" />
                        )}
                        {isUnlocked ? (
                          <Icon name="Play" size={20} className="text-primary" />
                        ) : (
                          <Icon name="Lock" size={20} className="text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">
                      {event?.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleShowFunFact(event?.fact);
                        }}
                        className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-fast"
                      >
                        <Icon name="Info" size={16} strokeWidth={2} />
                        <span className="font-caption text-sm">Fun Fact</span>
                      </button>
                      
                      <div className="flex items-center space-x-1 text-primary">
                        <Icon name="Star" size={16} strokeWidth={2} />
                        <span className="font-mono text-sm font-medium">{event?.points} pts</span>
                      </div>
                    </div>
                    
                    {!isUnlocked && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="font-caption text-xs text-muted-foreground text-center">
                          Complete previous events to unlock
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Action Buttons */}
          <section className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Button
              variant="secondary"
              onClick={() => setShowToolEvolution(true)}
              iconName="Microscope"
            >
              Tool Evolution
            </Button>
            
            <Link to="/progress-achievement-hub">
              <Button variant="outline" iconName="Trophy">
                View Progress
              </Button>
            </Link>
            
            <Link to="/game-home-dashboard">
              <Button variant="ghost" iconName="Home">
                Back to Dashboard
              </Button>
            </Link>
          </section>
        </div>

        {/* Timeline Navigation Bar */}
        <TimelineBar
          eras={Object?.values(timelineEras)}
          selectedEra={selectedEra}
          unlockedEras={unlockedEras}
          onEraSelect={handleEraSelect}
        />
      </main>
      {/* Character Guide */}
      <CharacterGuide
        character="aunt-juju"
        message={getCharacterMessage(selectedEra)}
        emotion="excited"
        position="bottom-right"
        isVisible={shouldShowGuide}
        onClose={hideGuide}
        showHint={true}
        hintText="Click on any unlocked event to start a mini-game and learn about that discovery!"
      />
      {/* Fun Fact Modal */}
      <FunFactModal
        isOpen={showFunFact}
        onClose={() => setShowFunFact(false)}
        title={currentFunFact?.title}
        content={currentFunFact?.content}
        type={currentFunFact?.type}
        microbe={null}
        onViewDetails={() => {}}
      />
      {/* Active Minigame */}
      {activeMinigame && (
        <MiniGame
          id={activeMinigame?.id}
          eventData={activeMinigame?.eventData}
          onComplete={activeMinigame?.onComplete}
          onClose={activeMinigame?.onClose}
        />
      )}
      {/* Tool Evolution Modal */}
      <ToolEvolution
        isOpen={showToolEvolution}
        onClose={() => setShowToolEvolution(false)}
        currentEra={selectedEra}
      />
      {/* Progress Display */}
      <div className="fixed top-24 right-4 z-30">
        <div className="bg-card border border-border rounded-lg p-3 shadow-moderate">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Star" size={16} className="text-primary" />
            <span className="font-mono text-sm font-semibold text-foreground">{totalPoints}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Collection" size={16} className="text-secondary" />
            <span className="font-mono text-sm text-foreground">{collectedCards?.length}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicrobeTimelineAdventure;