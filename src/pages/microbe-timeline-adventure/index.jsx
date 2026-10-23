import React, { useState, useEffect, useRef } from 'react';
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
import {
  loadProgress,
  saveProgress,
  resetProgress as resetProgressService,
} from '../../services/gameProgressService';
import { useAuth } from '../../contexts/AuthContext';
import { trackTimelineEventComplete, trackEraComplete, trackEraUnlock } from '../../services/analyticsService';

const defaultProgress = {
  unlockedEras: ['discovery'],
  unlockedEvents: ['leeuwenhoek-discovery'],
  completedEvents: [],
  totalPoints: 0,
  collectedCards: [],
  achievements: [],
};

const MicrobeTimelineAdventure = () => {
  const completedIds = useRef(new Set());
  const [selectedEra, setSelectedEra] = useState('discovery');
  const { shouldShowGuide, hideGuide } = useGuideVisibility('microbe-timeline-adventure');
  const { isPremium } = useAuth();
  const [showFunFact, setShowFunFact] = useState(false);
  const [currentFunFact, setCurrentFunFact] = useState(null);
  const [unlockedEras, setUnlockedEras] = useState(defaultProgress?.unlockedEras);
  const [collectedCards, setCollectedCards] = useState(defaultProgress?.collectedCards);
  const [achievements, setAchievements] = useState(defaultProgress?.achievements);
  const [totalPoints, setTotalPoints] = useState(defaultProgress?.totalPoints);
  const [activeMinigame, setActiveMinigame] = useState(null);
  const [showToolEvolution, setShowToolEvolution] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [completedEvents, setCompletedEvents] = useState(defaultProgress?.completedEvents);
  const [unlockedEvents, setUnlockedEvents] = useState(defaultProgress?.unlockedEvents);
  const [showSaveNotice, setShowSaveNotice] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [progressLoaded, setProgressLoaded] = useState(false);

  // Load progress from Supabase (with localStorage fallback) on mount
  useEffect(() => {
    let cancelled = false;
    loadProgress()?.then((saved) => {
      if (cancelled) return;
      setUnlockedEras(saved?.unlockedEras ?? defaultProgress?.unlockedEras);
      setUnlockedEvents(saved?.unlockedEvents ?? defaultProgress?.unlockedEvents);
      completedIds.current = new Set(saved?.completedEvents ?? []);
      setCompletedEvents([...completedIds.current]);
      setTotalPoints(saved?.totalPoints ?? 0);
      setCollectedCards(saved?.collectedCards ?? []);
      setAchievements(saved?.achievements ?? []);
      setProgressLoaded(true);
    });
    return () => { cancelled = true; };
  }, []);

  // Auto-save whenever progress state changes (after initial load)
  useEffect(() => {
    if (!progressLoaded) return;
    let cancelled = false;
    let timer;
    saveProgress({ unlockedEras, unlockedEvents, completedEvents, totalPoints, collectedCards, achievements }).then((result) => {
      if (cancelled) return;
      const message = result?.skipped ? 'Progress saving is off or unavailable. You can keep playing.'
        : result?.cloud ? 'Progress saved to your account.'
        : result?.local ? 'Progress saved on this device.' : 'Progress could not be saved.';
      setSaveMessage(message);
      setShowSaveNotice(true);
      timer = setTimeout(() => setShowSaveNotice(false), 4000);
    });
    return () => { cancelled = true; clearTimeout(timer); };
  }, [unlockedEras, unlockedEvents, completedEvents, totalPoints, collectedCards, achievements, progressLoaded]);

  const handleResetProgress = async () => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      await resetProgressService();
      setUnlockedEras(defaultProgress?.unlockedEras);
      setUnlockedEvents(defaultProgress?.unlockedEvents);
      completedIds.current.clear();
      setCompletedEvents(defaultProgress?.completedEvents);
      setTotalPoints(defaultProgress?.totalPoints);
      setCollectedCards(defaultProgress?.collectedCards);
      setAchievements(defaultProgress?.achievements);
    }
  };

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
        { id: 'leeuwenhoek-discovery', year: 1676, scientist: 'Antonie van Leeuwenhoek', title: 'Discovers "animalcules"', description: 'First observations of living microorganisms using homemade microscopes', minigame: 'microscope-focus', fact: 'Leeuwenhoek made over 500 microscopes in his lifetime!', points: 25, unlocked: true },
        { id: 'first-bacteria', year: 1683, scientist: 'Antonie van Leeuwenhoek', title: 'First bacteria observed', description: 'Drew detailed sketches of bacterial shapes - rods, spheres, and spirals', minigame: 'bacteria-drawing', fact: 'His drawings from 340 years ago are still accurate today!', points: 30, unlocked: false },
        { id: 'jenner-vaccination', year: 1796, scientist: 'Edward Jenner', title: 'Invents vaccination', description: 'Creates first vaccine using cowpox to prevent smallpox', minigame: 'vaccination-timeline', fact: 'The word "vaccine" comes from "vacca" meaning cow in Latin!', points: 40, unlocked: false },
        { id: 'pasteur-generation', year: 1850, scientist: 'Louis Pasteur', title: 'Disproves spontaneous generation', description: 'Swan neck flask experiment proves microbes come from other microbes', minigame: 'swan-flask-experiment', fact: "Some of Pasteur\'s original flasks are still sterile today!", points: 35, unlocked: false }
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
        { id: 'snow-cholera', year: 1854, scientist: 'John Snow', title: 'Traces cholera to contaminated water', description: 'Maps disease outbreak to identify water pump as source', minigame: 'outbreak-mapping', fact: 'John Snow is considered the father of modern epidemiology!', points: 45, unlocked: false },
        { id: 'lister-antiseptic', year: 1865, scientist: 'Joseph Lister', title: 'Introduces antiseptic surgery', description: 'Uses carbolic acid to prevent surgical infections', minigame: 'operating-room-cleaning', fact: 'Before Lister, 50% of surgical patients died from infection!', points: 40, unlocked: false },
        { id: 'koch-tuberculosis', year: 1882, scientist: 'Robert Koch', title: 'Discovers TB bacterium', description: "Establishes Koch\'s postulates for proving disease causation", minigame: 'kochs-postulates', fact: "Koch\'s postulates are still used by scientists today!", points: 50, unlocked: false },
        { id: 'pasteur-rabies', year: 1885, scientist: 'Louis Pasteur', title: 'Creates rabies vaccine', description: 'Saves Joseph Meister, first person to receive rabies vaccine', minigame: 'pasteur-laboratory', fact: 'Pasteur had never gone to medical school, he was a chemist!', points: 55, unlocked: false },
        { id: 'fleming-penicillin', year: 1928, scientist: 'Alexander Fleming', title: 'Discovers penicillin', description: 'Accidentally notices mold killing bacteria in petri dish', minigame: 'petri-dish-detective', fact: "Fleming\'s lucky accident has saved millions of lives!", points: 60, unlocked: false }
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
        { id: 'electron-microscope', year: 1933, scientist: 'Ernst Ruska', title: 'Electron microscope invented', description: 'New technology allows 1000x better magnification than light microscopes', minigame: 'microscope-comparison', fact: 'Electron microscopes can magnify up to 2 million times!', points: 45, unlocked: false },
        { id: 'antibiotics-production', year: 1940, scientist: 'Multiple Scientists', title: 'Antibiotics mass-produced', description: 'Penicillin manufactured to treat wounded WWII soldiers', minigame: 'antibiotic-assembly', fact: 'Mass production of penicillin saved thousands of soldiers in WWII!', points: 50, unlocked: false },
        { id: 'dna-structure-study', year: 1952, scientist: 'Rosalind Franklin', title: 'DNA structure being studied', description: 'X-ray crystallography reveals clues about DNA structure', minigame: 'dna-building', fact: "Franklin\'s Photo 51 was crucial for discovering DNA structure!", points: 55, unlocked: false }
      ]
    },
    dnaRevolution: {
      id: 'dnaRevolution',
      name: 'The DNA Revolution',
      subtitle: "Understanding Life's Code",
      period: '1950s-2000s',
      yearRange: { start: 1950, end: 2000 },
      theme: 'High-tech lab with computers',
      background: 'hightech',
      color: 'purple',
      completed: false,
      keyEvents: [
        { id: 'watson-crick-dna', year: 1953, scientist: 'Watson & Crick', title: 'Discover DNA structure', description: "Determines double helix structure of DNA using Franklin's data", minigame: 'double-helix-building', fact: 'The DNA double helix model was built using metal plates and wires!', points: 65, unlocked: false },
        { id: 'genetic-engineering', year: 1973, scientist: 'Boyer & Cohen', title: 'Genetic engineering begins', description: 'First successful DNA recombination experiment', minigame: 'gene-splicing', fact: 'The first genetically engineered medicine was human insulin!', points: 70, unlocked: false },
        { id: 'hiv-discovery', year: 1983, scientist: 'Luc Montagnier', title: 'HIV virus discovered', description: 'Identifies virus causing AIDS pandemic', minigame: 'virus-hunter', fact: 'HIV was one of the fastest identified disease-causing viruses in history!', points: 60, unlocked: false },
        { id: 'pcr-invention', year: 1990, scientist: 'Kary Mullis', title: 'PCR and DNA sequencing advances', description: 'Polymerase chain reaction allows rapid DNA copying', minigame: 'dna-copying', fact: 'PCR is used in COVID-19 tests to detect the virus!', points: 55, unlocked: false }
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
        { id: 'human-genome', year: 2003, scientist: 'Human Genome Project', title: 'Human Genome Project completed', description: 'Complete sequence of human DNA mapped', minigame: 'microbiome-explorer', fact: 'Your body has 10 times more microbial cells than human cells!', points: 75, unlocked: false },
        { id: 'crispr-discovery', year: 2012, scientist: 'Doudna & Charpentier', title: 'CRISPR gene editing discovered', description: 'Revolutionary gene editing tool discovered', minigame: 'gene-editor', fact: 'CRISPR won the Nobel Prize in Chemistry in 2020!', points: 80, unlocked: false },
        { id: 'covid-pandemic', year: 2020, scientist: 'Multiple Scientists', title: 'COVID-19 pandemic', description: 'Fastest vaccine development in human history', minigame: 'vaccine-development', fact: 'mRNA vaccines were developed in just 11 months!', points: 85, unlocked: false },
        { id: 'microbiome-research', year: 2024, scientist: 'Current Researchers', title: 'Microbiome research', description: 'Scientists discover new microbes and their roles daily', minigame: 'meet-your-microbes', fact: 'Scientists discover about 15,000 new microbial species every year!', points: 90, unlocked: false }
      ]
    }
  };

  const famousScientists = {
    'leeuwenhoek': { name: 'Antonie van Leeuwenhoek', dates: '1632-1723', title: 'Father of Microbiology', discovery: 'First to observe living microorganisms', portrait: '/assets/images/scientists/leeuwenhoek.png', funFacts: ['Made over 500 microscopes by hand','Was originally a cloth merchant','Never shared his lens-making secrets'], rarity: 'legendary', points: 100 },
    'jenner': { name: 'Edward Jenner', dates: '1749-1823', title: 'Vaccination Pioneer', discovery: 'Created first vaccine', portrait: '/assets/images/scientists/jenner.png', funFacts: ['Used cowpox to prevent smallpox','Saved millions of lives','Word "vaccine" comes from Latin for cow'], rarity: 'rare', points: 85 },
    'pasteur': { name: 'Louis Pasteur', dates: '1822-1895', title: 'Germ Theory Pioneer', discovery: 'Proved germs cause disease', portrait: '/assets/images/scientists/pasteur.png', funFacts: ['Invented pasteurization process','Created rabies vaccine','Never went to medical school'], rarity: 'legendary', points: 100 },
    'koch': { name: 'Robert Koch', dates: '1843-1910', title: 'Disease Detective', discovery: 'Identified TB and cholera bacteria', portrait: '/assets/images/scientists/koch.png', funFacts: ["Established Koch\'s postulates",'Won Nobel Prize in 1905','Founded modern bacteriology'], rarity: 'rare', points: 85 },
    'lister': { name: 'Joseph Lister', dates: '1827-1912', title: 'Antiseptic Surgery Pioneer', discovery: 'Introduced surgical antiseptics', portrait: '/assets/images/scientists/lister.png', funFacts: ['Reduced surgical deaths by 80%','Used carbolic acid as antiseptic','Listerine mouthwash named after him'], rarity: 'uncommon', points: 70 },
    'fleming': { name: 'Alexander Fleming', dates: '1881-1955', title: 'Penicillin Discoverer', discovery: 'Discovered penicillin antibiotic', portrait: '/assets/images/scientists/fleming.png', funFacts: ['Discovery was accidental','Saved millions during WWII','Won Nobel Prize in 1945'], rarity: 'legendary', points: 100 },
  };

  const currentEra = timelineEras?.[selectedEra];

  const getCharacterMessage = (eraId) => {
    const messages = {
      discovery: "Welcome to the Discovery Era! Click on the first event to begin your journey!",
      germTheory: "Now we\'re in the Victorian era — microbes cause disease! Exciting times ahead!",
      modern: "The 20th century brought incredible new tools! Let\'s explore!",
      dnaRevolution: "We're entering the age of genetics! Scientists are reading the very code of life!",
      modernAge: "Welcome to today\'s world of biotechnology!"
    };
    return messages?.[eraId] || "Let's explore this fascinating era together!";
  };

  const handleEraSelect = (eraId) => {
    if (unlockedEras?.includes(eraId)) {
      setSelectedEra(eraId);
      setShowTimeline(false);
    }
  };

  const getEraNumber = (eraId) => {
    const eraOrder = ['discovery', 'germTheory', 'modern', 'dnaRevolution', 'modernAge'];
    return eraOrder?.indexOf(eraId) + 1;
  };

  const handleBackToTimeline = () => setShowTimeline(true);

  const handleEventComplete = (eventId, points) => {
    if (completedIds.current.has(eventId)) return;
    completedIds.current.add(eventId);
    setCompletedEvents([...completedIds.current]);
    setTotalPoints(prev => prev + points);
    trackTimelineEventComplete(eventId, selectedEra, points);

    const currentEraData = timelineEras?.[selectedEra];
    const eventIndex = currentEraData?.keyEvents?.findIndex(e => e?.id === eventId);

    if (eventIndex !== -1 && eventIndex < currentEraData?.keyEvents?.length - 1) {
      const nextEvent = currentEraData?.keyEvents?.[eventIndex + 1];
      if (!unlockedEvents?.includes(nextEvent?.id)) {
        setUnlockedEvents(prev => [...prev, nextEvent?.id]);
      }
    }

    const allEventsInEra = currentEraData?.keyEvents?.map(e => e?.id) || [];
    const allEventsCompleted = allEventsInEra?.every(id =>
      completedEvents?.includes(id) || id === eventId
    );

    if (allEventsCompleted) {
      const eraOrder = ['discovery', 'germTheory', 'modern', 'dnaRevolution', 'modernAge'];
      const currentIndex = eraOrder?.indexOf(selectedEra);
      trackEraComplete(selectedEra, currentEraData?.name);
      if (currentIndex < eraOrder?.length - 1) {
        const nextEra = eraOrder?.[currentIndex + 1];
        if (!unlockedEras?.includes(nextEra)) {
          setUnlockedEras(prev => [...prev, nextEra]);
          trackEraUnlock(nextEra);
          const nextEraData = timelineEras?.[nextEra];
          if (nextEraData?.keyEvents?.[0]) {
            setUnlockedEvents(prev => [...prev, nextEraData?.keyEvents?.[0]?.id]);
          }
        }
      }
    }

  };

  const handleCollectScientist = (scientistId) => {
    if (!collectedCards?.includes(scientistId)) {
      setCollectedCards(prev => [...prev, scientistId]);
      const scientist = famousScientists?.[scientistId];
      setTotalPoints(prev => prev + (scientist?.points || 0));
      setCurrentFunFact({ title: `Collected: ${scientist?.name}`, content: `You've earned ${scientist?.points} points! ${scientist?.funFacts?.[0]}`, type: 'collection' });
      setShowFunFact(true);
    }
  };

  const handleMinigameLaunch = (minigameId, eventData) => {
    setActiveMinigame({
      id: minigameId,
      eventData: {...eventData, alreadyCompleted:completedIds.current.has(eventData.id)},
      onComplete: (result) => {
        handleEventComplete(eventData?.id, eventData?.points || 0);
        setActiveMinigame(null);
      },
      onClose: () => setActiveMinigame(null)
    });
  };

  const handleShowFunFact = (fact, title = "Did You Know?") => {
    setCurrentFunFact({ title, content: fact, type: 'fact' });
    setShowFunFact(true);
  };

  const getEraIcon = (eraId) => {
    const icons = { discovery: 'Search', germTheory: 'Shield', modern: 'Zap', dnaRevolution: 'Dna', modernAge: 'Rocket' };
    return icons?.[eraId] || 'Circle';
  };

  // Save notice toast
  const SaveNotice = () => showSaveNotice ? (
    <div role="status" className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-800/95 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg animate-fade-in">
      <Icon name="Save" size={14} /> {saveMessage}
    </div>
  ) : null;

  // ERA VIEW
  if (!showTimeline) {
    const eraCompletedCount = currentEra?.keyEvents?.filter(e => completedEvents?.includes(e?.id))?.length || 0;
    const eraTotalPoints = currentEra?.keyEvents?.reduce((sum, e) => sum + (e?.points || 0), 0);

    return (
      <div className="min-h-screen bg-background overflow-hidden game-screen">
        <Header />
        <main className="pt-20 pb-32 safe-bottom relative">
          <EraBackground era={currentEra} />
          <div className="container mx-auto px-4 lg:px-6 relative z-10">

            <div className="mb-6 animate-slide-up flex items-center justify-between flex-wrap gap-4">
              <Button onClick={handleBackToTimeline} variant="outline" iconName="ArrowLeft">Back to Timeline</Button>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${currentEra?.color}-500 to-${currentEra?.color}-600 flex items-center justify-center`}>
                  <Icon name={getEraIcon(currentEra?.id)} size={20} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <h2 className={`font-heading text-lg text-${currentEra?.color}-600`}>{currentEra?.name}</h2>
                  <p className="font-mono text-xs text-muted-foreground">{currentEra?.period}</p>
                </div>
              </div>
            </div>

            <section className="mb-8 animate-slide-up">
              <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 shadow-moderate">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-caption text-sm text-muted-foreground">Era Progress</span>
                  <span className="font-mono text-sm text-foreground font-semibold">{eraCompletedCount} / {currentEra?.keyEvents?.length} discoveries</span>
                </div>
                <div className="w-full bg-border rounded-full h-2 mb-3">
                  <div className={`h-full bg-gradient-to-r from-${currentEra?.color}-500 to-${currentEra?.color}-400 rounded-full transition-all duration-moderate`}
                    style={{ width: `${currentEra?.keyEvents?.length > 0 ? (eraCompletedCount / currentEra?.keyEvents?.length) * 100 : 0}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1"><Icon name="Star" size={12} className="text-primary" /><span className="font-mono">{totalPoints} pts earned</span></span>
                  <span className="flex items-center space-x-1"><Icon name="Trophy" size={12} className="text-accent" /><span className="font-mono">{eraTotalPoints} pts available</span></span>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h3 className="font-heading text-xl text-foreground mb-4">Discoveries in this Era</h3>
              {selectedEra !== 'discovery' && !isPremium ? (
                <div className="rounded-xl p-8 text-center shadow-moderate" style={{ background: 'linear-gradient(135deg, #1a1030 0%, #2d1b69 50%, #1a1030 100%)', border: '1px solid rgba(139,92,246,0.4)' }}>
                  <div className="text-6xl mb-4">🔒</div>
                  <h3 className="font-heading text-xl text-white mb-3">This Era is Part of MicrobeQuest Premium</h3>
                  <p className="font-body text-purple-200 mb-6">Unlock 14 more discoveries, all 6 game modules, and 350+ years of microbiology history.</p>
                  <Link to="/premium">
                    <button className="px-6 py-3 rounded-xl font-heading font-bold text-gray-900 transition-all duration-fast hover:opacity-90 hover:scale-105" style={{ backgroundColor: '#FFC107' }}>
                      Unlock the Full Adventure 🌻
                    </button>
                  </Link>
                  <p className="font-caption text-sm text-purple-300 mt-4">From $1.99/month • Free for Title I schools</p>
                </div>
              ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentEra?.keyEvents?.map((event, index) => {
                  const isUnlocked = unlockedEvents?.includes(event?.id);
                  const isCompleted = completedEvents?.includes(event?.id);
                  return (
                    <div key={event?.id}
                      className={`bg-card border-2 rounded-xl p-6 shadow-moderate transition-all duration-fast animate-slide-up
                        ${isUnlocked ? 'border-border hover:border-primary/30 hover:shadow-pronounced cursor-pointer' : 'border-border opacity-50 cursor-not-allowed'}
                        ${isCompleted ? 'ring-2 ring-success bg-success/5' : ''}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => isUnlocked && !isCompleted && handleMinigameLaunch(event?.minigame, event)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-heading font-bold text-xs bg-gradient-to-br from-${currentEra?.color}-500 to-${currentEra?.color}-600 flex-shrink-0`}>{event?.year}</div>
                          <div>
                            <h3 className="font-heading text-lg text-foreground leading-tight">{event?.title}</h3>
                            <p className="font-caption text-sm text-primary">{event?.scientist}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {isCompleted && <Icon name="CheckCircle" size={20} className="text-success" />}
                          {isUnlocked && !isCompleted ? (
                            <div className="bg-primary/10 text-primary rounded-full p-1"><Icon name="Play" size={18} /></div>
                          ) : !isCompleted ? (
                            <Icon name="Lock" size={20} className="text-muted-foreground" />
                          ) : null}
                        </div>
                      </div>
                      <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">{event?.description}</p>
                      <div className="flex items-center justify-between">
                        <button onClick={(e) => { e?.stopPropagation(); handleShowFunFact(event?.fact); }}
                          className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-fast">
                          <Icon name="Info" size={16} strokeWidth={2} /><span className="font-caption text-sm">Fun Fact</span>
                        </button>
                        <div className="flex items-center space-x-2">
                          {isCompleted && <span className="font-caption text-xs text-success bg-success/10 px-2 py-1 rounded-full">Completed!</span>}
                          <div className="flex items-center space-x-1 text-primary">
                            <Icon name="Star" size={16} strokeWidth={2} /><span className="font-mono text-sm font-medium">{event?.points} pts</span>
                          </div>
                        </div>
                      </div>
                      {!isUnlocked && <div className="mt-3 pt-3 border-t border-border"><p className="font-caption text-xs text-muted-foreground text-center">Complete previous events to unlock</p></div>}
                      {isCompleted && (
                        <div className="mt-3 pt-3 border-t border-success/20">
                          <button onClick={(e) => { e?.stopPropagation(); handleMinigameLaunch(event?.minigame, event); }}
                            className="w-full text-center font-caption text-xs text-muted-foreground hover:text-primary transition-colors">Play again for fun →</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              )}
            </section>

            {eraCompletedCount === currentEra?.keyEvents?.length && currentEra?.keyEvents?.length > 0 && (
              <section className="text-center animate-slide-up mb-8">
                <div className="bg-success/10 border border-success/30 rounded-xl p-6 max-w-xl mx-auto">
                  <Icon name="Trophy" size={40} className="text-success mx-auto mb-3" />
                  <h3 className="font-heading text-xl text-foreground mb-2">Era Complete! 🎉</h3>
                  <p className="font-body text-muted-foreground mb-4">Amazing! You've completed all discoveries in {currentEra?.name}. Head back to explore the next era!</p>
                  <Button onClick={handleBackToTimeline} variant="primary" iconName="ArrowRight">Continue to Next Era</Button>
                </div>
              </section>
            )}

            <section className="flex flex-wrap items-center justify-center gap-4">
              <Button variant="secondary" onClick={() => setShowToolEvolution(true)} iconName="Microscope">Tool Evolution</Button>
              <Link to="/progress-achievement-hub"><Button variant="outline" iconName="Trophy">View Progress</Button></Link>
              <Link to="/game-home-dashboard"><Button variant="ghost" iconName="Home">Back to Dashboard</Button></Link>
            </section>
          </div>
        </main>

        <TimelineBar eras={Object.values(timelineEras).map(era => ({...era, completed:era.keyEvents.every(event => completedEvents.includes(event.id)), keyEvents:era.keyEvents.map(event => ({...event, completed:completedEvents.includes(event.id)}))}))} selectedEra={selectedEra} unlockedEras={unlockedEras} onEraSelect={handleEraSelect} />
        <CharacterGuide character="aunt-juju" message={getCharacterMessage(selectedEra)} emotion="excited" position="bottom-right" isVisible={shouldShowGuide} onClose={hideGuide} showHint={true} hintText="Click on any unlocked event card to start a mini-game and earn points!" />
        <FunFactModal isOpen={showFunFact} onClose={() => setShowFunFact(false)} title={currentFunFact?.title} content={currentFunFact?.content} type={currentFunFact?.type} microbe={null} onViewDetails={() => {}} />
        {activeMinigame && <MiniGame id={activeMinigame?.id} eventData={activeMinigame?.eventData} onComplete={activeMinigame?.onComplete} onClose={activeMinigame?.onClose} />}
        <ToolEvolution isOpen={showToolEvolution} onClose={() => setShowToolEvolution(false)} currentEra={selectedEra} />
        <SaveNotice />

        {/* Score widget — repositioned to avoid overlap on small screens */}
        <div className="fixed top-20 right-2 sm:top-24 sm:right-4 z-30">
          <div className="bg-card border border-border rounded-lg p-2 sm:p-3 shadow-moderate">
            <div className="flex items-center space-x-2 mb-2"><Icon name="Star" size={16} className="text-primary" /><span className="font-mono text-sm font-semibold text-foreground">{totalPoints}</span></div>
            <div className="flex items-center space-x-2"><Icon name="Collection" size={16} className="text-secondary" /><span className="font-mono text-sm text-foreground">{collectedCards?.length}/10</span></div>
            <button onClick={handleResetProgress} className="mt-2 text-xs text-muted-foreground hover:text-destructive transition-colors w-full text-center">Reset</button>
          </div>
        </div>
      </div>
    );
  }

  // TIMELINE VIEW
  return (
    <div className="min-h-screen bg-background overflow-hidden game-screen">
      <Header />
      <main className="pt-20 pb-8 safe-bottom relative">
        <EraBackground era={currentEra} />
        <div className="container mx-auto px-4 lg:px-6 relative z-10">

          <section className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 mb-4">
              <Icon name="Clock" size={16} strokeWidth={2} />
              <span className="font-caption text-sm font-medium">Time Travel Adventure</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-heading text-foreground mb-4">Microbe Timeline Adventure</h1>
            <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
              Join Aunt Juju and Charlie on an epic journey through 350+ years of microbiology discoveries!
            </p>
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-pronounced max-w-2xl mx-auto">
              <h2 className={`text-2xl font-heading mb-2 text-${currentEra?.color}-600`}>{currentEra?.name}</h2>
              <p className="font-body text-muted-foreground mb-3">{currentEra?.subtitle}</p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-2"><Icon name="Calendar" size={16} className="text-muted-foreground" /><span className="font-mono text-foreground">{currentEra?.period}</span></div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <div className="flex items-center space-x-2"><Icon name="MapPin" size={16} className="text-muted-foreground" /><span className="font-body text-foreground">{currentEra?.theme}</span></div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentEra?.keyEvents?.map((event, index) => {
                const isUnlocked = unlockedEvents?.includes(event?.id);
                const isCompleted = completedEvents?.includes(event?.id);
                return (
                  <div key={event?.id}
                    className={`bg-card border-2 rounded-xl p-6 shadow-moderate transition-all duration-fast animate-slide-up hover:shadow-pronounced
                      ${isUnlocked ? 'border-border hover:border-primary/30 cursor-pointer' : 'border-border opacity-50 cursor-not-allowed'}
                      ${isCompleted ? 'ring-2 ring-success bg-success/5' : ''}`}
                    style={{ animationDelay: `${index * 150}ms` }}
                    onClick={() => isUnlocked && handleMinigameLaunch(event?.minigame, event)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-heading font-bold bg-gradient-to-br from-${currentEra?.color}-500 to-${currentEra?.color}-600`}>{event?.year}</div>
                        <div>
                          <h3 className="font-heading text-lg text-foreground">{event?.title}</h3>
                          <p className="font-caption text-sm text-primary">{event?.scientist}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isCompleted && <Icon name="CheckCircle" size={20} className="text-success" />}
                        {isUnlocked ? <Icon name="Play" size={20} className="text-primary" /> : <Icon name="Lock" size={20} className="text-muted-foreground" />}
                      </div>
                    </div>
                    <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">{event?.description}</p>
                    <div className="flex items-center justify-between">
                      <button onClick={(e) => { e?.stopPropagation(); handleShowFunFact(event?.fact); }} className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-fast">
                        <Icon name="Info" size={16} strokeWidth={2} /><span className="font-caption text-sm">Fun Fact</span>
                      </button>
                      <div className="flex items-center space-x-1 text-primary">
                        <Icon name="Star" size={16} strokeWidth={2} /><span className="font-mono text-sm font-medium">{event?.points} pts</span>
                      </div>
                    </div>
                    {!isUnlocked && <div className="mt-3 pt-3 border-t border-border"><p className="font-caption text-xs text-muted-foreground text-center">Complete previous events to unlock</p></div>}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Button variant="secondary" onClick={() => setShowToolEvolution(true)} iconName="Microscope">Tool Evolution</Button>
            <Link to="/progress-achievement-hub"><Button variant="outline" iconName="Trophy">View Progress</Button></Link>
            <Link to="/game-home-dashboard"><Button variant="ghost" iconName="Home">Back to Dashboard</Button></Link>
          </section>
        </div>

        <TimelineBar eras={Object.values(timelineEras).map(era => ({...era, completed:era.keyEvents.every(event => completedEvents.includes(event.id)), keyEvents:era.keyEvents.map(event => ({...event, completed:completedEvents.includes(event.id)}))}))} selectedEra={selectedEra} unlockedEras={unlockedEras} onEraSelect={handleEraSelect} />
      </main>

      <CharacterGuide character="aunt-juju" message={getCharacterMessage(selectedEra)} emotion="excited" position="bottom-right" isVisible={shouldShowGuide} onClose={hideGuide} showHint={true} hintText="Click on any unlocked event to start a mini-game and learn about that discovery!" />
      <FunFactModal isOpen={showFunFact} onClose={() => setShowFunFact(false)} title={currentFunFact?.title} content={currentFunFact?.content} type={currentFunFact?.type} microbe={null} onViewDetails={() => {}} />
      {activeMinigame && <MiniGame id={activeMinigame?.id} eventData={activeMinigame?.eventData} onComplete={activeMinigame?.onComplete} onClose={activeMinigame?.onClose} />}
      <ToolEvolution isOpen={showToolEvolution} onClose={() => setShowToolEvolution(false)} currentEra={selectedEra} />
      <SaveNotice />

      {/* Score widget — repositioned to avoid overlap on small screens */}
      <div className="fixed top-20 right-2 sm:top-24 sm:right-4 z-30">
        <div className="bg-card border border-border rounded-lg p-2 sm:p-3 shadow-moderate">
          <div className="flex items-center space-x-2 mb-2"><Icon name="Star" size={16} className="text-primary" /><span className="font-mono text-sm font-semibold text-foreground">{totalPoints}</span></div>
          <div className="flex items-center space-x-2"><Icon name="Collection" size={16} className="text-secondary" /><span className="font-mono text-sm text-foreground">{collectedCards?.length}/10</span></div>
          <button onClick={handleResetProgress} className="mt-2 text-xs text-muted-foreground hover:text-destructive transition-colors w-full text-center">Reset</button>
        </div>
      </div>
    </div>
  );
};

export default MicrobeTimelineAdventure;
