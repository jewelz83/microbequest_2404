import { useDifficultyCeiling } from '../../components/GameAccessGate';
import { permitsDifficulty } from '../../services/gameAccessPolicy.mjs';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuizHost from './components/QuizHost';
import QuestionCard from './components/QuestionCard';
import AnswerFeedback from './components/AnswerFeedback';
import QuizProgress from './components/QuizProgress';
import QuizResults from './components/QuizResults';
import { saveGameScore } from '../../services/gameProgressService';
import { trackGameModeStart, trackGameModeComplete, trackQuizAnswer } from '../../services/analyticsService';

const QuizChallengeSystem = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [quizStarted, setQuizStarted] = useState(false);
  const [hostEmotion, setHostEmotion] = useState('happy');
  const [hostMessage, setHostMessage] = useState('');

  const maxDifficulty = useDifficultyCeiling();
  // Mock quiz data
  const questionBank = [
  {
    id: 1,
    title: "Bacterial Structure",
    text: "Which part of a bacterial cell helps it move around?",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_15494222b-1767981434996.png",
    imageAlt: "Microscopic view of bacterial cells showing flagella structures for movement",
    imageCaption: "Bacterial cells under microscope magnification",
    difficulty: "easy",
    points: 10,
    timeLimit: 60,
    options: [
    {
      id: 'a',
      text: "Cell wall - provides structural support",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b5fba6a0-1766069416862.png",
      imageAlt: "Diagram showing bacterial cell wall structure"
    },
    {
      id: 'b',
      text: "Flagella - whip-like structures for swimming",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_16e05f651-1775173127353.png",
      imageAlt: "Illustration of bacterial flagella in motion"
    },
    {
      id: 'c',
      text: "Nucleus - controls cell activities",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_18f949fae-1775916873171.png",
      imageAlt: "Cross-section diagram of cell nucleus"
    },
    {
      id: 'd',
      text: "Ribosomes - make proteins for the cell",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d9e5c54a-1767981434954.png",
      imageAlt: "Microscopic view of ribosomes in bacterial cell"
    }],

    correctAnswer: 'b',
    explanation: `Flagella are long, whip-like structures that extend from bacterial cells and rotate like propellers to help bacteria swim through liquid environments. Not all bacteria have flagella, but those that do can move toward nutrients or away from harmful substances.`,
    microbeInfo: {
      name: "E. coli",
      description: "A rod-shaped bacterium that uses multiple flagella to swim through your intestines.",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_16e05f651-1775173127353.png",
      imageAlt: "Detailed microscopic image of E. coli bacteria showing flagella",
      facts: [
      "Can swim 10 times its body length per second",
      "Has 4-6 flagella that work together like a motor"]

    }
  },
  {
    id: 2,
    title: "Virus Characteristics",
    text: "What do viruses need to reproduce and make copies of themselves?",
    image: "https://images.unsplash.com/flagged/photo-1584036561584-b03c19da874c",
    imageAlt: "3D rendered visualization of virus particles with spike proteins",
    imageCaption: "Computer model of virus structure and components",
    difficulty: "medium",
    points: 15,
    timeLimit: 45,
    options: [
    {
      id: 'a',
      text: "Sunlight and water like plants do",
      image: "https://images.unsplash.com/photo-1462885775124-e861c44bb4fe",
      imageAlt: "Bright sunlight streaming through water droplets"
    },
    {
      id: 'b',
      text: "A host cell to hijack and use",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1776e9550-1775916852395.png",
      imageAlt: "Diagram showing virus entering and taking over host cell"
    },
    {
      id: 'c',
      text: "Special food from the environment",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_10ffa772f-1775916855456.png",
      imageAlt: "Various nutrients and minerals in laboratory setting"
    },
    {
      id: 'd',
      text: "Other viruses to combine with",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1653122b3-1775916857358.png",
      imageAlt: "Multiple virus particles clustering together"
    }],

    correctAnswer: 'b',
    explanation: `Viruses are obligate parasites, meaning they absolutely must have a host cell to reproduce. They inject their genetic material into the host cell and use the cell's machinery to make copies of themselves, often destroying the host cell in the process.`,
    microbeInfo: {
      name: "Influenza Virus",
      description: "A respiratory virus that hijacks your cells to make thousands of copies of itself.",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b04d2fb9-1772811835111.png",
      imageAlt: "Detailed 3D model of influenza virus showing surface proteins",
      facts: [
      "Can make 1000 copies of itself in just 8 hours",
      "Changes its surface proteins to avoid your immune system"]

    }
  },
  {
    id: 3,
    title: "Fungal Growth",
    text: "How do fungi like mushrooms get their food and energy?",
    image: "https://images.unsplash.com/photo-1605638408557-a4bbd0941775",
    imageAlt: "Close-up view of mushroom fungi growing on decaying wood in forest",
    imageCaption: "Fungi breaking down organic matter in their natural habitat",
    difficulty: "medium",
    points: 15,
    timeLimit: 50,
    options: [
    {
      id: 'a',
      text: "They make their own food using sunlight",
      image: "https://images.unsplash.com/photo-1601313460844-932d78ccc82b",
      imageAlt: "Green plants photosynthesizing in bright sunlight"
    },
    {
      id: 'b',
      text: "They hunt and eat other small organisms",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ba3863a6-1775916852311.png",
      imageAlt: "Predatory microorganisms hunting smaller prey"
    },
    {
      id: 'c',
      text: "They break down dead organic matter",
      image: "https://images.unsplash.com/photo-1578306228420-ba4e658e7ed0",
      imageAlt: "Fungi decomposing fallen leaves and organic debris"
    },
    {
      id: 'd',
      text: "They absorb nutrients from the air",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c25ac532-1768024583815.png",
      imageAlt: "Microscopic particles floating in air currents"
    }],

    correctAnswer: 'c',
    explanation: `Fungi are decomposers that break down dead organic matter like fallen leaves, dead animals, and wood. They release enzymes that digest this material externally, then absorb the nutrients. This makes them essential recyclers in nature's ecosystem.`,
    microbeInfo: {
      name: "Shiitake Mushroom",
      description: "A wood-decomposing fungus that breaks down dead trees and returns nutrients to the soil.",
      image: "https://images.unsplash.com/photo-1729968650829-312e6116bdc2",
      imageAlt: "Cluster of shiitake mushrooms growing on decomposing log",
      facts: [
      "Can break down tough wood fibers that most organisms can't digest",
      "Forms underground networks that can span entire forests"]

    }
  },
  {
    id: 4,
    title: "Good Bacteria Heroes",
    text: "Which type of good bacteria helps you digest food and keeps your tummy healthy?",
    image: "https://images.unsplash.com/photo-1702258780335-4b12ed8c35db",
    imageAlt: "Colorful probiotic bacteria colonies in microscopic view",
    imageCaption: "Beneficial bacteria that live in your intestines",
    difficulty: "easy",
    points: 10,
    timeLimit: 60,
    options: [
    {
      id: 'a',
      text: "Lactobacillus - helps break down dairy and make vitamins",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1039862b4-1771242482354.png",
      imageAlt: "Healthy probiotic bacteria helping with digestion"
    },
    {
      id: 'b',
      text: "Streptococcus - causes strep throat infections",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_16338b106-1775916853000.png",
      imageAlt: "Harmful streptococcus bacteria chains"
    },
    {
      id: 'c',
      text: "Salmonella - makes you sick from bad food",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b94c787e-1775916871965.png",
      imageAlt: "Dangerous salmonella bacteria causing food poisoning"
    },
    {
      id: 'd',
      text: "None - all bacteria are harmful to humans",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_19e4fbec9-1775916870664.png",
      imageAlt: "Warning symbol representing harmful bacteria"
    }],

    correctAnswer: 'a',
    explanation: `Lactobacillus is a friendly bacteria superhero! It lives in your gut and helps digest lactose (milk sugar), produces vitamin K for blood clotting, and fights off bad bacteria. You can find it in yogurt, cheese, and fermented foods!`,
    microbeInfo: {
      name: "Lactobacillus acidophilus",
      description: "A friendly bacterium that makes your tummy happy and healthy!",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_197d56b1d-1775916872258.png",
      imageAlt: "Lactobacillus bacteria helping with digestion",
      facts: [
      "Makes lactic acid that gives yogurt its tangy taste",
      "Can survive the acidic environment of your stomach!"]

    }
  },
  {
    id: 5,
    title: "Microbe Size Challenge",
    text: "How many bacteria could fit on the period at the end of this sentence?",
    image: "https://images.unsplash.com/flagged/photo-1586703252585-8da4639b096c",
    imageAlt: "Extreme magnification showing tiny bacteria cells",
    imageCaption: "Bacteria are incredibly tiny - smaller than you can imagine!",
    difficulty: "hard",
    points: 20,
    timeLimit: 50,
    options: [
    {
      id: 'a',
      text: "About 10 bacteria",
      image: "https://images.unsplash.com/photo-1706203678409-ef1526a0078a",
      imageAlt: "Small number of bacteria"
    },
    {
      id: 'b',
      text: "About 100 bacteria",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_167fe57e2-1765311504022.png",
      imageAlt: "Moderate number of bacteria"
    },
    {
      id: 'c',
      text: "About 1,000 bacteria",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_16e05f651-1775173127353.png",
      imageAlt: "Large colony of bacteria"
    },
    {
      id: 'd',
      text: "About 1,000,000 bacteria!",
      image: "https://images.unsplash.com/photo-1521403684205-044b4ce8f4d3",
      imageAlt: "Massive bacterial population"
    }],

    correctAnswer: 'd',
    explanation: `Bacteria are SO tiny that about 1 MILLION bacteria could fit on a period at the end of a sentence! That's because bacteria are only about 1-2 micrometers long - you'd need a powerful microscope just to see one!`,
    microbeInfo: {
      name: "Size Comparison",
      description: "Understanding just how incredibly small microbes really are!",
      image: "https://images.unsplash.com/photo-1631824681077-ffb294002a88",
      imageAlt: "Scale comparison showing bacteria size",
      facts: [
      "A typical bacteria is about 2 micrometers (0.000002 meters) long",
      "1000 bacteria lined up = width of a human hair!"]

    }
  },
  {
    id: 6,
    title: "Hand Washing Science",
    text: "Why does washing your hands with soap help remove germs better than just water?",
    image: "https://images.unsplash.com/photo-1601372292857-536b935210a6",
    imageAlt: "Hands being washed with soap and bubbles",
    imageCaption: "Proper hand washing is one of the best ways to stay healthy!",
    difficulty: "medium",
    points: 15,
    timeLimit: 60,
    options: [
    {
      id: 'a',
      text: "Soap is sticky and traps germs like glue",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e10e63ef-1775916870287.png",
      imageAlt: "Sticky soap trapping particles"
    },
    {
      id: 'b',
      text: "Soap molecules grab germs and water washes them away",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_116230a48-1775916855667.png",
      imageAlt: "Soap molecules surrounding and removing bacteria"
    },
    {
      id: 'c',
      text: "Soap kills all germs instantly on contact",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1bd793930-1775916852986.png",
      imageAlt: "Antibacterial soap killing germs"
    },
    {
      id: 'd',
      text: "Soap makes your hands too slippery for germs",
      image: "https://images.unsplash.com/photo-1721620958961-cccc239cbb49",
      imageAlt: "Slippery soapy hands"
    }],

    correctAnswer: 'b',
    explanation: `Soap molecules are super clever! One end loves water (hydrophilic) and the other end loves oil and germs (hydrophobic). When you wash, soap surrounds germs and lifts them off your skin, then water rinses everything away. That's why you need to scrub for at least 20 seconds!`,
    microbeInfo: {
      name: "Hand Washing Chemistry",
      description: "The science behind why soap is a germ-fighting superhero!",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_13a26e13f-1775917123798.png",
      imageAlt: "Diagram showing how soap removes germs",
      facts: [
      "Singing 'Happy Birthday' twice = perfect 20-second hand wash!",
      "Soap doesn't kill germs, it just helps remove them"]

    }
  },
  {
    id: 7,
    title: "Antibiotic Knowledge", text: "Why won't antibiotics help you feel better if you have a cold or the flu?",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1683ec86f-1775916852647.png",
    imageAlt: "Antibiotic medicine pills and tablets",
    imageCaption: "Understanding when antibiotics work is important!",
    difficulty: "medium",
    points: 15,
    timeLimit: 55,
    options: [
    {
      id: 'a',
      text: "Antibiotics are too weak to fight cold viruses",
      image: "https://images.unsplash.com/photo-1688678004194-e22d547ed705",
      imageAlt: "Weak medicine"
    },
    {
      id: 'b',
      text: "Antibiotics only work on bacteria, not viruses!",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_11e0c3f71-1775916869659.png",
      imageAlt: "Antibiotics targeting bacteria specifically"
    },
    {
      id: 'c',
      text: "Cold viruses are immune to all medicines",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1adf4d006-1775916852489.png",
      imageAlt: "Protected virus particles"
    },
    {
      id: 'd',
      text: "You need to take them for a full month to work",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1fc5cd61f-1772057253733.png",
      imageAlt: "Long-term medication"
    }],

    correctAnswer: 'b',
    explanation: `Antibiotics are designed to kill bacteria by attacking their cell walls or stopping them from reproducing. But viruses don't have cell walls and work completely differently - they hide inside your cells! That's why antibiotics can't touch them. Your immune system is your best defense against viruses!`,
    microbeInfo: {
      name: "Antibiotic Resistance",
      description: "Why we need to use antibiotics wisely and only when necessary!",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c33cabdd-1775916853007.png",
      imageAlt: "Bacteria becoming resistant to antibiotics",
      facts: [
      "Taking antibiotics when you don't need them creates 'superbugs'",
      "Always finish your full antibiotic prescription!"]

    }
  },
  {
    id: 8,
    title: "Fungal Friends",
    text: "Which of these delicious foods is made with the help of friendly fungi?",
    image: "https://images.unsplash.com/photo-1719921020132-7757bde0ddf6",
    imageAlt: "Various bread and baked goods",
    imageCaption: "Fungi help us make lots of tasty foods!",
    difficulty: "easy",
    points: 10,
    timeLimit: 60,
    options: [
    {
      id: 'a',
      text: "Bread - yeast makes it rise and fluffy!",
      image: "https://images.unsplash.com/photo-1612982593409-5d926522b5ba",
      imageAlt: "Fresh baked bread loaves"
    },
    {
      id: 'b',
      text: "Orange juice - fresh squeezed from fruit",
      image: "https://images.unsplash.com/photo-1503624141236-2bd972ca51f7",
      imageAlt: "Glass of fresh orange juice"
    },
    {
      id: 'c',
      text: "French fries - fried potato slices",
      image: "https://images.unsplash.com/photo-1639744505770-1b27d5316fea",
      imageAlt: "Crispy french fries"
    },
    {
      id: 'd',
      text: "Chocolate milk - cocoa mixed with milk",
      image: "https://images.unsplash.com/photo-1631461352830-c37149298088",
      imageAlt: "Glass of chocolate milk"
    }],

    correctAnswer: 'a',
    explanation: `Bread is made with yeast, which is a type of fungus! When yeast eats sugar in the dough, it burps out carbon dioxide gas bubbles that make bread rise and become soft and fluffy. Yeast also makes the delicious bread smell we all love!`,
    microbeInfo: {
      name: "Saccharomyces cerevisiae (Baker's Yeast)",
      description: "The friendly fungus that helps make bread, pizza dough, and even beer!",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_123e5eaf5-1765095178139.png",
      imageAlt: "Yeast cells under microscope",
      facts: [
      "One packet of yeast contains billions of tiny yeast cells!",
      "Yeast has been helping humans make bread for over 5,000 years"]

    }
  },
  {
    id: 9,
    title: "Microbe Habitats",
    text: "Where in your body do you have the MOST microorganisms living?",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f129c161-1767642789391.png",
    imageAlt: "Human body outline showing microbiome locations",
    imageCaption: "You\'re like a walking microbe hotel!",
    difficulty: "medium",
    points: 15,
    timeLimit: 50,
    options: [
    {
      id: 'a',
      text: "Your mouth and teeth",
      image: "https://images.unsplash.com/photo-1731269451218-7786410c838c",
      imageAlt: "Person smiling showing teeth"
    },
    {
      id: 'b',
      text: "Your skin surface",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e0c4ef70-1772073487804.png",
      imageAlt: "Close-up of human skin"
    },
    {
      id: 'c',
      text: "Your gut and intestines",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_118737b8d-1773161063807.png",
      imageAlt: "Digestive system diagram"
    },
    {
      id: 'd',
      text: "Your lungs when you breathe",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_199e93b22-1764705540120.png",
      imageAlt: "Respiratory system diagram"
    }],

    correctAnswer: 'c',
    explanation: `Your gut is home to trillions of microbes - more than there are stars in our galaxy! These gut bacteria help you digest food, make vitamins, train your immune system, and even affect your mood. You have about 3 pounds of bacteria in your intestines!`,
    microbeInfo: {
      name: "Gut Microbiome",
      description: "The amazing ecosystem of microbes living in your digestive system!",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1fc418809-1775916852436.png",
      imageAlt: "Diverse gut bacteria colonies",
      facts: [
      "You have more bacterial cells than human cells in your body!",
      "Your gut bacteria produce serotonin, the 'happy chemical'"]

    }
  },
  {
    id: 10,
    title: "Discovery History",
    text: "Who was the first person to see and draw microorganisms using a microscope?",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1adc2f5db-1767895188769.png",
    imageAlt: "Historical antique microscope",
    imageCaption: "Early microscopes opened up a whole new world!",
    difficulty: "hard",
    points: 20,
    timeLimit: 60,
    options: [
    {
      id: 'a',
      text: "Louis Pasteur - invented pasteurization",
      image: "https://images.unsplash.com/photo-1676037887624-5a2009b9f429",
      imageAlt: "Portrait of Louis Pasteur"
    },
    {
      id: 'b',
      text: "Alexander Fleming - discovered penicillin",
      image: "https://images.unsplash.com/photo-1579165466693-28649e0bf0bd",
      imageAlt: "Penicillin growing on a petri dish"
    },
    {
      id: 'c',
      text: "Antoni van Leeuwenhoek - the microscope pioneer",
      image: "https://images.unsplash.com/photo-1614290335665-03caa2185a82",
      imageAlt: "Historical microscope from 1600s"
    },
    {
      id: 'd',
      text: "Marie Curie - discovered radioactivity",
      image: "https://images.unsplash.com/photo-1576669801838-1b1c52121e6a",
      imageAlt: "Laboratory with scientific equipment"
    }],

    correctAnswer: 'c',
    explanation: `Antoni van Leeuwenhoek was a Dutch scientist who made his own microscopes in the 1670s and became the first person to see bacteria! He called them "animalcules" (little animals) and drew detailed pictures of what he saw. His discovery opened up an entirely new world of science!`,
    microbeInfo: {
      name: "The Father of Microbiology",
      description: "Antoni van Leeuwenhoek\'s amazing discovery changed science forever!",
      image: "https://images.unsplash.com/photo-1663363913215-9db927aa77ea",
      imageAlt: "Replica of Leeuwenhoek\'s microscope",
      facts: [
      "He made over 500 microscopes by hand!",
      "His best microscope could magnify objects 275 times"]

    }
  }];


  const quizQuestions = questionBank.filter(question => permitsDifficulty(question.difficulty, maxDifficulty));
  const currentQuestion = quizQuestions?.[currentQuestionIndex];
  const totalQuestions = quizQuestions?.length;

  // Timer effect
  useEffect(() => {
    let timer;
    if (quizStarted && timeRemaining > 0 && !showResult && !showFeedback) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !showResult) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining, showResult, showFeedback]);

  const startQuiz = () => {
    setQuizStarted(true);
    trackGameModeStart('quiz-challenge');
    setHostEmotion('excited');
    setHostMessage('Let\'s begin our scientific adventure! Take your time and think carefully about each question.');
  };

  const handleAnswerSelect = (answerId) => {
    if (showResult) return;

    setSelectedAnswer(answerId);
    setShowResult(true);

    const isCorrect = answerId === currentQuestion?.correctAnswer;
    trackQuizAnswer(currentQuestionIndex, isCorrect, currentQuestion?.points);

    if (isCorrect) {
      setScore((prev) => prev + currentQuestion?.points);
      setCorrectAnswers((prev) => prev + 1);
      setHostEmotion('celebrating');
      setHostMessage('Excellent work! You really understand microbiology!');
    } else {
      setHostEmotion('encouraging');
      setHostMessage('That\'s okay! Learning from mistakes makes us better scientists!');
    }

    setTimeout(() => {
      setShowFeedback(true);
    }, 1500);
  };

  const handleTimeUp = () => {
    if (!selectedAnswer) {
      setSelectedAnswer(null);
      setShowResult(true);
      setHostEmotion('encouraging');
      setHostMessage('Time\'s up! Don\'t worry, let\'s learn from this question together.');

      setTimeout(() => {
        setShowFeedback(true);
      }, 1500);
    }
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setShowResult(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeRemaining(quizQuestions?.[currentQuestionIndex + 1]?.timeLimit || 60);
      setHostEmotion('happy');
      setHostMessage('Ready for the next challenge? You\'re doing great!');
    } else {
      setShowResults(true);
      setHostEmotion('celebrating');
      setHostMessage('Congratulations! You\'ve completed the quiz!');
      trackGameModeComplete('quiz-challenge', { score, correctAnswers, totalQuestions });
      // Persist quiz score to Supabase
      saveGameScore({
        gameMode: 'quiz-challenge',
        score,
        correctAnswers,
        totalQuestions,
        timeElapsed: 0,
        difficulty: 'mixed',
        metadata: {},
      })?.catch((err) => console.error('Failed to save quiz score:', err));
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowFeedback(false);
    setShowResults(false);
    setScore(0);
    setCorrectAnswers(0);
    setTimeRemaining(60);
    setQuizStarted(false);
    setHostEmotion('happy');
    setHostMessage('');
  };

  const getAchievements = () => {
    const achievements = [];
    const accuracy = correctAnswers / totalQuestions * 100;

    if (accuracy === 100) {
      achievements?.push({
        title: 'Perfect Score!',
        description: 'Answered all questions correctly',
        points: 50
      });
    } else if (accuracy >= 80) {
      achievements?.push({
        title: 'Microbe Master',
        description: 'Scored 80% or higher',
        points: 25
      });
    }

    if (correctAnswers >= 2) {
      achievements?.push({
        title: 'Quick Learner',
        description: 'Got multiple questions right',
        points: 15
      });
    }

    return achievements;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Quiz Introduction */}
          {!quizStarted &&
          <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center shadow-pronounced">
                  <Icon name="Brain" size={32} color="white" strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl sm:text-4xl font-heading text-foreground mb-3 sm:mb-4">
                  Quiz Challenge System
                </h1>
                <p className="text-base sm:text-lg font-body text-muted-foreground max-w-2xl mx-auto">
                  Test your microbiology knowledge with interactive questions!
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
                {/* Quiz Info */}
                <div className="bg-card rounded-2xl shadow-moderate border border-border p-5 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-heading text-foreground mb-4 sm:mb-6">
                    Ready to Begin?
                  </h2>

                  <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
                    <div className="flex items-center space-x-3">
                      <Icon name="HelpCircle" size={20} className="text-primary flex-shrink-0" />
                      <span className="font-body text-sm sm:text-base text-foreground">
                        {totalQuestions} engaging questions about microorganisms
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Clock" size={20} className="text-secondary flex-shrink-0" />
                      <span className="font-body text-sm sm:text-base text-foreground">
                        60 seconds per question with helpful hints
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Star" size={20} className="text-accent flex-shrink-0" />
                      <span className="font-body text-sm sm:text-base text-foreground">
                        Earn points and unlock achievements
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Microscope" size={20} className="text-success flex-shrink-0" />
                      <span className="font-body text-sm sm:text-base text-foreground">
                        Learn with visual diagrams and character guides
                      </span>
                    </div>
                  </div>

                  <Button
                  variant="default"
                  fullWidth
                  onClick={startQuiz}
                  iconName="Play"
                  iconPosition="left"
                  className="text-base sm:text-lg py-3">

                    Start Quiz Adventure
                  </Button>
                </div>

                {/* Character Guide */}
                <QuizHost
                character="aunt-juju"
                emotion="happy"
                message="Hello, young scientist! I'm Aunt Juju, and I'll be your guide through this exciting quiz adventure. Are you ready to explore the amazing world of microorganisms together?"
                isVisible={true}
                onMessageComplete={() => {}} />

              </div>

              {/* Navigation Links */}
              <div className="mt-8 sm:mt-12 text-center">
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  <Link to="/game-home-dashboard">
                    <Button variant="outline" iconName="Home" iconPosition="left">
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/world-explorer-mode">
                    <Button variant="outline" iconName="Compass" iconPosition="left">
                      Explore World
                    </Button>
                  </Link>
                  <Link to="/microscope-discovery-lab">
                    <Button variant="outline" iconName="Microscope" iconPosition="left">
                      Discovery Lab
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          }

          {/* Active Quiz */}
          {quizStarted && !showResults &&
          <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Main Quiz Area */}
                <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                  {/* Progress */}
                  <QuizProgress
                  currentQuestion={currentQuestionIndex + 1}
                  totalQuestions={totalQuestions}
                  score={score}
                  timeRemaining={timeRemaining}
                  difficulty={currentQuestion?.difficulty} />


                  {/* Question */}
                  <QuestionCard
                  question={currentQuestion}
                  onAnswerSelect={handleAnswerSelect}
                  selectedAnswer={selectedAnswer}
                  showResult={showResult}
                  correctAnswer={currentQuestion?.correctAnswer} />

                </div>

                {/* Side Panel — hidden on mobile to save space */}
                <div className="hidden lg:block lg:col-span-1">
                  <QuizHost
                  character="aunt-juju"
                  emotion={hostEmotion}
                  message={hostMessage}
                  isVisible={true}
                  onMessageComplete={() => {}} />

                </div>
              </div>
            </div>
          }

          {/* Answer Feedback Modal */}
          <AnswerFeedback
            isCorrect={selectedAnswer === currentQuestion?.correctAnswer}
            explanation={currentQuestion?.explanation}
            microbeInfo={currentQuestion?.microbeInfo}
            onContinue={handleContinue}
            isVisible={showFeedback} />


          {/* Quiz Results Modal */}
          <QuizResults
            score={score}
            totalQuestions={totalQuestions}
            correctAnswers={correctAnswers}
            timeSpent={totalQuestions * 60 - timeRemaining}
            achievements={getAchievements()}
            onRetry={handleRetry}
            onContinue={() => window.location.href = '/world-explorer-mode'}
            onBackToMenu={() => window.location.href = '/game-home-dashboard'}
            isVisible={showResults} />

        </div>
      </main>
    </div>);

};

export default QuizChallengeSystem;