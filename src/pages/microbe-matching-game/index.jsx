import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import CharacterGuide from '../../components/ui/CharacterGuide';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import CharacterGuidePanel from './components/CharacterGuidePanel';
import EducationalInfoPanel from './components/EducationalInfoPanel';

const MicrobeMatchingGame = () => {
  // Game state
  const [gameState, setGameState] = useState('playing'); // 'playing', 'paused', 'completed'
  const [difficulty, setDifficulty] = useState('easy');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [hintMessage, setHintMessage] = useState('');
  const [selectedMicrobeInfo, setSelectedMicrobeInfo] = useState(null);
  const [showEducationalPanel, setShowEducationalPanel] = useState(false);

  // Enhanced microbe data with complete information
  const microbeData = [
  {
    id: 1,
    name: 'E. coli',
    category: 'bacteria',
    image: "https://images.unsplash.com/photo-1707079918208-d4b0c55eded6",
    imageAlt: 'Microscopic view of rod-shaped E. coli bacteria in blue and purple colors',
    pairId: 'ecoli',
    scientificName: 'Escherichia coli',
    size: '2-3 micrometers long, 0.5 micrometers wide',
    habitat: 'Intestinal tract of humans and warm-blooded animals, soil, and water contaminated with fecal matter',
    description: 'E. coli is a rod-shaped bacterium commonly found in the intestines of humans and warm-blooded animals. Most strains are harmless and actually help with digestion by producing vitamin K and preventing harmful bacteria from establishing in the intestines.',
    facts: [
    'E. coli can multiply every 20 minutes under ideal conditions',
    'Most E. coli strains are completely harmless to humans',
    'Scientists use E. coli in laboratories to study genetics and produce insulin',
    'E. coli helps produce vitamin K in your intestines',
    'It was first discovered by German pediatrician Theodor Escherich in 1885'],

    funFact: 'E. coli bacteria are so small that about 1 million could fit on the head of a pin!',
    safetyTip: 'Always wash your hands before eating and after using the bathroom to prevent harmful E. coli infections.',
    relatedMicrobes: ['Salmonella', 'Lactobacillus', 'Streptococcus']
  },
  {
    id: 2,
    name: 'E. coli',
    category: 'bacteria',
    image: "https://images.unsplash.com/photo-1707079918208-d4b0c55eded6",
    imageAlt: 'Microscopic view of rod-shaped E. coli bacteria in blue and purple colors',
    pairId: 'ecoli',
    scientificName: 'Escherichia coli',
    size: '2-3 micrometers long, 0.5 micrometers wide',
    habitat: 'Intestinal tract of humans and warm-blooded animals, soil, and water contaminated with fecal matter',
    description: 'E. coli is a rod-shaped bacterium commonly found in the intestines of humans and warm-blooded animals. Most strains are harmless and actually help with digestion by producing vitamin K and preventing harmful bacteria from establishing in the intestines.',
    facts: [
    'E. coli can multiply every 20 minutes under ideal conditions',
    'Most E. coli strains are completely harmless to humans',
    'Scientists use E. coli in laboratories to study genetics and produce insulin',
    'E. coli helps produce vitamin K in your intestines',
    'It was first discovered by German pediatrician Theodor Escherich in 1885'],

    funFact: 'E. coli bacteria are so small that about 1 million could fit on the head of a pin!',
    safetyTip: 'Always wash your hands before eating and after using the bathroom to prevent harmful E. coli infections.',
    relatedMicrobes: ['Salmonella', 'Lactobacillus', 'Streptococcus']
  },
  {
    id: 3,
    name: 'Influenza Virus',
    category: 'virus',
    image: "https://images.unsplash.com/photo-1579781403337-de692320718a",
    imageAlt: 'Detailed 3D rendering of influenza virus showing spherical shape with characteristic surface glycoproteins and spikes in blue and orange colors',
    pairId: 'influenza',
    scientificName: 'Influenza A/B/C virus',
    size: '80-120 nanometers in diameter (about 100 times smaller than bacteria)',
    habitat: 'Respiratory system of humans, birds, and other animals; spreads through airborne droplets',
    description: 'The influenza virus causes seasonal flu and is much smaller than bacteria. It needs to infect living cells to reproduce and contains genetic material (RNA) surrounded by a protective protein coat with surface spikes.',
    facts: [
    'Influenza viruses change their surface proteins every year, requiring new vaccines',
    'The virus spreads through tiny droplets when people cough, sneeze, or talk',
    'There are three main types: Influenza A (causes pandemics), B, and C',
    'Influenza A viruses are named after two surface proteins: H and N (like H1N1)',
    'The 1918 flu pandemic infected about one-third of the world\'s population'],

    funFact: 'Viruses are so tiny that they can only be seen with electron microscopes that magnify objects over 100,000 times!',
    safetyTip: 'Cover your mouth when you cough, wash your hands frequently, and get your flu vaccine every year.',
    relatedMicrobes: ['Rhinovirus', 'Coronavirus', 'Respiratory Syncytial Virus']
  },
  {
    id: 4,
    name: 'Influenza Virus',
    category: 'virus',
    image: "https://images.unsplash.com/photo-1579781403337-de692320718a",
    imageAlt: 'Detailed 3D rendering of influenza virus showing spherical shape with characteristic surface glycoproteins and spikes in blue and orange colors',
    pairId: 'influenza',
    scientificName: 'Influenza A/B/C virus',
    size: '80-120 nanometers in diameter (about 100 times smaller than bacteria)',
    habitat: 'Respiratory system of humans, birds, and other animals; spreads through airborne droplets',
    description: 'The influenza virus causes seasonal flu and is much smaller than bacteria. It needs to infect living cells to reproduce and contains genetic material (RNA) surrounded by a protective protein coat with surface spikes.',
    facts: [
    'Influenza viruses change their surface proteins every year, requiring new vaccines',
    'The virus spreads through tiny droplets when people cough, sneeze, or talk',
    'There are three main types: Influenza A (causes pandemics), B, and C',
    'Influenza A viruses are named after two surface proteins: H and N (like H1N1)',
    'The 1918 flu pandemic infected about one-third of the world\'s population'],

    funFact: 'Viruses are so tiny that they can only be seen with electron microscopes that magnify objects over 100,000 times!',
    safetyTip: 'Cover your mouth when you cough, wash your hands frequently, and get your flu vaccine every year.',
    relatedMicrobes: ['Rhinovirus', 'Coronavirus', 'Respiratory Syncytial Virus']
  },
  {
    id: 5,
    name: 'Penicillium',
    category: 'fungi',
    image: "https://images.unsplash.com/photo-1703500584838-ba17cd6c1b5f",
    imageAlt: 'Green and blue Penicillium mold colonies growing in circular patterns on laboratory medium',
    pairId: 'penicillium',
    scientificName: 'Penicillium chrysogenum',
    size: 'Individual cells 2-4 micrometers, but forms visible colonies several centimeters wide',
    habitat: 'Soil, decaying organic matter, food (especially bread and citrus fruits), and indoor environments with moisture',
    description: 'Penicillium is a blue-green mold fungus famous for producing penicillin, the first widely-used antibiotic. It grows in thread-like structures called hyphae and reproduces by releasing spores into the air.',
    facts: [
    'Alexander Fleming discovered penicillin from Penicillium mold in 1928 by accident',
    'Penicillin has saved millions of lives by fighting bacterial infections',
    'Penicillium spores are everywhere in the air and can land on food',
    'Some Penicillium species are used to make blue cheese like Roquefort',
    'The fungus gets its blue-green color from the spores it produces'],

    funFact: 'The discovery of penicillin from moldy bread changed medicine forever and earned Fleming a Nobel Prize!',
    safetyTip: 'Don\'t eat moldy food, but remember that some molds like Penicillium help make life-saving medicines.',
    relatedMicrobes: ['Aspergillus', 'Saccharomyces cerevisiae', 'Candida albicans']
  },
  {
    id: 6,
    name: 'Penicillium',
    category: 'fungi',
    image: "https://images.unsplash.com/photo-1703500584838-ba17cd6c1b5f",
    imageAlt: 'Green and blue Penicillium mold colonies growing in circular patterns on laboratory medium',
    pairId: 'penicillium',
    scientificName: 'Penicillium chrysogenum',
    size: 'Individual cells 2-4 micrometers, but forms visible colonies several centimeters wide',
    habitat: 'Soil, decaying organic matter, food (especially bread and citrus fruits), and indoor environments with moisture',
    description: 'Penicillium is a blue-green mold fungus famous for producing penicillin, the first widely-used antibiotic. It grows in thread-like structures called hyphae and reproduces by releasing spores into the air.',
    facts: [
    'Alexander Fleming discovered penicillin from Penicillium mold in 1928 by accident',
    'Penicillin has saved millions of lives by fighting bacterial infections',
    'Penicillium spores are everywhere in the air and can land on food',
    'Some Penicillium species are used to make blue cheese like Roquefort',
    'The fungus gets its blue-green color from the spores it produces'],

    funFact: 'The discovery of penicillin from moldy bread changed medicine forever and earned Fleming a Nobel Prize!',
    safetyTip: 'Don\'t eat moldy food, but remember that some molds like Penicillium help make life-saving medicines.',
    relatedMicrobes: ['Aspergillus', 'Saccharomyces cerevisiae', 'Candida albicans']
  },
  {
    id: 7,
    name: 'Paramecium',
    category: 'protozoa',
    image: "https://images.unsplash.com/photo-1569333393870-182ed614e9b2",
    imageAlt: 'Elongated single-celled Paramecium organism with visible internal structures and cilia',
    pairId: 'paramecium',
    scientificName: 'Paramecium caudatum',
    size: '200-300 micrometers long (visible under a basic microscope)',
    habitat: 'Freshwater environments like ponds, lakes, streams, and puddles rich in organic matter',
    description: 'Paramecium is a slipper-shaped, single-celled organism covered in tiny hair-like structures called cilia. It swims by beating these cilia and feeds on bacteria and small particles by sweeping them into its oral groove.',
    facts: [
    'Paramecium can swim at speeds of up to 4 body lengths per second',
    'It has two nuclei: a large one for daily functions and a small one for reproduction',
    'Thousands of cilia beat in coordinated waves to help it swim and feed',
    'It can reverse direction by changing how its cilia beat',
    'Paramecium reproduces by splitting in half (binary fission) about once per day'],

    funFact: 'Paramecium can be seen swimming around with just a basic microscope - it looks like a tiny slipper dancing in water!',
    safetyTip: 'Pond water contains many microorganisms like Paramecium - it\'s safe to observe but don\'t drink it!',
    relatedMicrobes: ['Euglena', 'Amoeba', 'Stentor']
  },
  {
    id: 8,
    name: 'Paramecium',
    category: 'protozoa',
    image: "https://images.unsplash.com/photo-1569333393870-182ed614e9b2",
    imageAlt: 'Elongated single-celled Paramecium organism with visible internal structures and cilia',
    pairId: 'paramecium',
    scientificName: 'Paramecium caudatum',
    size: '200-300 micrometers long (visible under a basic microscope)',
    habitat: 'Freshwater environments like ponds, lakes, streams, and puddles rich in organic matter',
    description: 'Paramecium is a slipper-shaped, single-celled organism covered in tiny hair-like structures called cilia. It swims by beating these cilia and feeds on bacteria and small particles by sweeping them into its oral groove.',
    facts: [
    'Paramecium can swim at speeds of up to 4 body lengths per second',
    'It has two nuclei: a large one for daily functions and a small one for reproduction',
    'Thousands of cilia beat in coordinated waves to help it swim and feed',
    'It can reverse direction by changing how its cilia beat',
    'Paramecium reproduces by splitting in half (binary fission) about once per day'],

    funFact: 'Paramecium can be seen swimming around with just a basic microscope - it looks like a tiny slipper dancing in water!',
    safetyTip: 'Pond water contains many microorganisms like Paramecium - it\'s safe to observe but don\'t drink it!',
    relatedMicrobes: ['Euglena', 'Amoeba', 'Stentor']
  },
  {
    id: 9,
    name: 'Streptococcus',
    category: 'bacteria',
    image: "https://images.unsplash.com/photo-1575467252250-c0e889b69d2b",
    imageAlt: 'Chain-like arrangement of spherical Streptococcus bacteria in pink and purple staining',
    pairId: 'streptococcus',
    scientificName: 'Streptococcus pyogenes',
    size: '0.6-1.0 micrometers in diameter, arranged in chains of 4-10 cells',
    habitat: 'Human throat, skin, and respiratory tract; some species live harmlessly, others cause infections',
    description: 'Streptococcus bacteria are spherical (round) and grow in chains like beads on a string. Some species are helpful and live peacefully in our bodies, while others can cause sore throats, skin infections, or more serious illnesses.',
    facts: [
    'Streptococcus gets its name from "strepto" meaning twisted chain',
    'Strep throat is caused by Streptococcus pyogenes bacteria',
    'Some Streptococcus species help make yogurt and cheese',
    'These bacteria don\'t need oxygen to survive (they\'re anaerobic)',
    'Rapid strep tests can identify strep throat infections in minutes'],

    funFact: 'Under a microscope, Streptococcus bacteria look like tiny purple pearls strung together in a necklace!',
    safetyTip: 'If you have a persistent sore throat, see a doctor - it might be strep throat that needs antibiotic treatment.',
    relatedMicrobes: ['Staphylococcus', 'E. coli', 'Lactobacillus']
  },
  {
    id: 10,
    name: 'Streptococcus',
    category: 'bacteria',
    image: "https://images.unsplash.com/photo-1575467252250-c0e889b69d2b",
    imageAlt: 'Chain-like arrangement of spherical Streptococcus bacteria in pink and purple staining',
    pairId: 'streptococcus',
    scientificName: 'Streptococcus pyogenes',
    size: '0.6-1.0 micrometers in diameter, arranged in chains of 4-10 cells',
    habitat: 'Human throat, skin, and respiratory tract; some species live harmlessly, others cause infections',
    description: 'Streptococcus bacteria are spherical (round) and grow in chains like beads on a string. Some species are helpful and live peacefully in our bodies, while others can cause sore throats, skin infections, or more serious illnesses.',
    facts: [
    'Streptococcus gets its name from "strepto" meaning twisted chain',
    'Strep throat is caused by Streptococcus pyogenes bacteria',
    'Some Streptococcus species help make yogurt and cheese',
    'These bacteria don\'t need oxygen to survive (they\'re anaerobic)',
    'Rapid strep tests can identify strep throat infections in minutes'],

    funFact: 'Under a microscope, Streptococcus bacteria look like tiny purple pearls strung together in a necklace!',
    safetyTip: 'If you have a persistent sore throat, see a doctor - it might be strep throat that needs antibiotic treatment.',
    relatedMicrobes: ['Staphylococcus', 'E. coli', 'Lactobacillus']
  },
  {
    id: 11,
    name: 'Rhinovirus',
    category: 'virus',
    image: "https://images.unsplash.com/photo-1728919083930-fdeef71420cd",
    imageAlt: 'Microscopic view of small spherical rhinovirus particles with distinctive surface structure in red and pink colors, smaller and different from influenza virus',
    pairId: 'rhinovirus',
    scientificName: 'Human rhinovirus',
    size: '25-30 nanometers in diameter (incredibly tiny - 1000x smaller than bacteria)',
    habitat: 'Human nasal passages and upper respiratory tract; spreads through airborne droplets and contaminated surfaces',
    description: 'Rhinovirus is the most common cause of the common cold. It\'s extremely small and has over 100 different types, which is why people can catch colds multiple times. The virus attaches to cells in your nose and throat.',
    facts: [
    'There are more than 100 different types of rhinoviruses',
    'Rhinoviruses cause about 30-50% of all common colds',
    'The virus can survive on surfaces for several hours',
    'It spreads easily through sneezing, coughing, and touching contaminated surfaces',
    'Rhinoviruses prefer the cooler temperature of your nasal passages (33-35°C)'],

    funFact: 'You can catch a cold from the same rhinovirus type only once, but with over 100 types, that\'s why colds keep coming back!',
    safetyTip: 'Wash your hands frequently, avoid touching your face, and stay away from people who are sneezing or coughing.',
    relatedMicrobes: ['Influenza virus', 'Coronavirus', 'Adenovirus']
  },
  {
    id: 12,
    name: 'Rhinovirus',
    category: 'virus',
    image: "https://images.unsplash.com/photo-1728919083930-fdeef71420cd",
    imageAlt: 'Microscopic view of small spherical rhinovirus particles with distinctive surface structure in red and pink colors, smaller and different from influenza virus',
    pairId: 'rhinovirus',
    scientificName: 'Human rhinovirus',
    size: '25-30 nanometers in diameter (incredibly tiny - 1000x smaller than bacteria)',
    habitat: 'Human nasal passages and upper respiratory tract; spreads through airborne droplets and contaminated surfaces',
    description: 'Rhinovirus is the most common cause of the common cold. It\'s extremely small and has over 100 different types, which is why people can catch colds multiple times. The virus attaches to cells in your nose and throat.',
    facts: [
    'There are more than 100 different types of rhinoviruses',
    'Rhinoviruses cause about 30-50% of all common colds',
    'The virus can survive on surfaces for several hours',
    'It spreads easily through sneezing, coughing, and touching contaminated surfaces',
    'Rhinoviruses prefer the cooler temperature of your nasal passages (33-35°C)'],

    funFact: 'You can catch a cold from the same rhinovirus type only once, but with over 100 types, that\'s why colds keep coming back!',
    safetyTip: 'Wash your hands frequently, avoid touching your face, and stay away from people who are sneezing or coughing.',
    relatedMicrobes: ['Influenza virus', 'Coronavirus', 'Adenovirus']
  }];


  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled?.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled?.[j], shuffled?.[i]];
    }
    return shuffled;
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    const cardCount = difficulty === 'easy' ? 12 : difficulty === 'medium' ? 16 : 24;
    const gameCards = shuffleArray(microbeData?.slice(0, cardCount));
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setMoves(0);
    setTimeElapsed(0);
    setHintsRemaining(3);
    setGameState('playing');
    setShowHint(false);
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Initialize game on mount and difficulty change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle card click
  const handleCardClick = (card) => {
    if (flippedCards?.length >= 2) return;
    if (flippedCards?.includes(card?.id)) return;
    if (matchedCards?.includes(card?.id)) return;

    const newFlippedCards = [...flippedCards, card?.id];
    setFlippedCards(newFlippedCards);
    setMoves((prev) => prev + 1);

    if (newFlippedCards?.length === 2) {
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards?.find((c) => c?.id === firstCardId);
      const secondCard = cards?.find((c) => c?.id === secondCardId);

      if (firstCard?.pairId === secondCard?.pairId) {
        // Match found
        setTimeout(() => {
          setMatchedCards((prev) => [...prev, firstCardId, secondCardId]);
          setFlippedCards([]);
          setScore((prev) => prev + 100);

          // Show educational info for first match of each type
          if (!matchedCards?.some((id) => {
            const matchedCard = cards?.find((c) => c?.id === id);
            return matchedCard && matchedCard?.pairId === firstCard?.pairId;
          })) {
            setSelectedMicrobeInfo(firstCard);
            setShowEducationalPanel(true);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
        }, 1500);
      }
    }
  };

  // Check for game completion
  useEffect(() => {
    if (matchedCards?.length === cards?.length && cards?.length > 0) {
      setGameState('completed');
    }
  }, [matchedCards?.length, cards?.length]);

  // Handle hint
  const handleHint = () => {
    if (hintsRemaining > 0 && gameState === 'playing') {
      setHintsRemaining((prev) => prev - 1);

      // Find unmatched cards
      const unmatchedCards = cards?.filter((card) => !matchedCards?.includes(card?.id));
      if (unmatchedCards?.length >= 2) {
        const randomCard = unmatchedCards?.[Math.floor(Math.random() * unmatchedCards?.length)];
        const pairCard = unmatchedCards?.find((card) =>
        card?.pairId === randomCard?.pairId && card?.id !== randomCard?.id
        );

        if (pairCard) {
          setHintMessage(`Look for another ${randomCard?.name}! ${randomCard?.category === 'bacteria' ? 'Bacteria are single-celled organisms.' : randomCard?.category === 'virus' ? 'Viruses need host cells to reproduce.' : randomCard?.category === 'fungi' ? 'Fungi can be helpful or harmful.' : 'Protozoa are single-celled animals.'}`);
          setShowHint(true);

          setTimeout(() => {
            setShowHint(false);
            setHintMessage('');
          }, 5000);
        }
      }
    }
  };

  // Handle pause/resume
  const handlePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  // Handle restart
  const handleRestart = () => {
    initializeGame();
  };

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  const matches = matchedCards?.length / 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <Header />
      <main className="pt-20 pb-8 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-moderate">
                <Icon name="Puzzle" size={24} color="white" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-heading text-foreground">
                Microbe Matching Game
              </h1>
            </div>
            <p className="text-lg font-body text-muted-foreground max-w-2xl mx-auto">
              Test your memory and learn about microorganisms! Match pairs of identical microbes to discover fascinating facts about the microscopic world.
            </p>
          </div>

          {/* Game Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Character Guide */}
            <div className="lg:col-span-1 space-y-6">
              <CharacterGuidePanel
                gameState={gameState}
                score={score}
                matches={matches}
                moves={moves}
                showHint={showHint}
                hintMessage={hintMessage} />

              
              {/* Progress Indicator */}
              <ProgressIndicator
                completedActivities={matches}
                totalActivities={cards?.length / 2}
                discoveredMicrobes={matches}
                totalMicrobes={20}
                achievements={matches >= 3 ? ['Memory Master', 'Microbe Explorer'] : matches >= 1 ? ['First Match'] : []} />

            </div>

            {/* Main Game Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Game Controls */}
              <GameControls
                score={score}
                timeElapsed={timeElapsed}
                moves={moves}
                hintsRemaining={hintsRemaining}
                gameState={gameState}
                difficulty={difficulty}
                onHint={handleHint}
                onPause={handlePause}
                onRestart={handleRestart}
                onDifficultyChange={handleDifficultyChange} />


              {/* Game Board */}
              <div className="relative">
                <GameBoard
                  cards={cards}
                  onCardClick={handleCardClick}
                  flippedCards={flippedCards}
                  matchedCards={matchedCards}
                  gameState={gameState}
                  difficulty={difficulty} />


                {/* Pause Overlay */}
                {gameState === 'paused' &&
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                    <div className="bg-card p-8 rounded-2xl shadow-pronounced text-center animate-slide-up">
                      <Icon name="Pause" size={48} className="text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-heading text-foreground mb-2">Game Paused</h3>
                      <p className="font-body text-muted-foreground mb-4">Take your time to think!</p>
                      <Button onClick={handlePause} iconName="Play" iconPosition="left">
                        Resume Game
                      </Button>
                    </div>
                  </div>
                }
              </div>

              {/* Navigation Links */}
              <div className="bg-card rounded-xl p-6 shadow-moderate border border-border">
                <h3 className="font-heading text-lg text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="Compass" size={20} className="text-primary" />
                  <span>Continue Your Adventure</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link
                    to="/world-explorer-mode"
                    className="flex items-center space-x-3 p-4 bg-muted/50 hover:bg-primary/10 rounded-lg transition-colors duration-fast group">

                    <Icon name="Globe" size={20} className="text-primary group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-body font-semibold text-foreground">Explore World</h4>
                      <p className="font-caption text-xs text-muted-foreground">Discover hidden microbes</p>
                    </div>
                  </Link>
                  
                  <Link
                    to="/quiz-challenge-system"
                    className="flex items-center space-x-3 p-4 bg-muted/50 hover:bg-secondary/10 rounded-lg transition-colors duration-fast group">

                    <Icon name="Brain" size={20} className="text-secondary group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-body font-semibold text-foreground">Take Quiz</h4>
                      <p className="font-caption text-xs text-muted-foreground">Test your knowledge</p>
                    </div>
                  </Link>
                  
                  <Link
                    to="/microscope-discovery-lab"
                    className="flex items-center space-x-3 p-4 bg-muted/50 hover:bg-accent/10 rounded-lg transition-colors duration-fast group">

                    <Icon name="Microscope" size={20} className="text-accent group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-body font-semibold text-foreground">Lab Discovery</h4>
                      <p className="font-caption text-xs text-muted-foreground">Examine specimens</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Educational Info Panel */}
      <EducationalInfoPanel
        microbe={selectedMicrobeInfo}
        isVisible={showEducationalPanel}
        onClose={() => {
          setShowEducationalPanel(false);
          setSelectedMicrobeInfo(null);
        }} />

      {/* Character Guide for Hints */}
      <CharacterGuide
        character="aunt-juju"
        message={hintMessage}
        emotion="thinking"
        position="bottom-right"
        isVisible={showHint}
        showHint={true}
        hintText="Remember the shapes and colors of the microbes you've seen!"
        onClose={() => setShowHint(false)} />

    </div>);


};

export default MicrobeMatchingGame;