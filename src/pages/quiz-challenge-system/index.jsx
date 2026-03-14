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

  // Mock quiz data
  const quizQuestions = [
  {
    id: 1,
    title: "Bacterial Structure",
    text: "Which part of a bacterial cell helps it move around?",
    image: "https://images.unsplash.com/photo-1714844437234-8debef441744",
    imageAlt: "Microscopic view of bacterial cells showing flagella structures for movement",
    imageCaption: "Bacterial cells under microscope magnification",
    difficulty: "easy",
    points: 10,
    timeLimit: 60,
    options: [
    {
      id: 'a',
      text: "Cell wall - provides structural support",
      image: "https://images.unsplash.com/photo-1586019117154-e0965c16a3ef",
      imageAlt: "Diagram showing bacterial cell wall structure"
    },
    {
      id: 'b',
      text: "Flagella - whip-like structures for swimming",
      image: "https://images.unsplash.com/photo-1631824683860-9a7aa1fe0713",
      imageAlt: "Illustration of bacterial flagella in motion"
    },
    {
      id: 'c',
      text: "Nucleus - controls cell activities",
      image: "https://images.unsplash.com/photo-1714846428077-42363bcae622",
      imageAlt: "Cross-section diagram of cell nucleus"
    },
    {
      id: 'd',
      text: "Ribosomes - make proteins for the cell",
      image: "https://images.unsplash.com/photo-1706647154179-c1fe7bf2f1a9",
      imageAlt: "Microscopic view of ribosomes in bacterial cell"
    }],

    correctAnswer: 'b',
    explanation: `Flagella are long, whip-like structures that extend from bacterial cells and rotate like propellers to help bacteria swim through liquid environments. Not all bacteria have flagella, but those that do can move toward nutrients or away from harmful substances.`,
    microbeInfo: {
      name: "E. coli",
      description: "A rod-shaped bacterium that uses multiple flagella to swim through your intestines.",
      image: "https://images.unsplash.com/photo-1574341792525-683b103fffe8",
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
    image: "https://images.unsplash.com/photo-1579781403337-de692320718a",
    imageAlt: "3D rendered visualization of virus particles with spike proteins",
    imageCaption: "Computer model of virus structure and components",
    difficulty: "medium",
    points: 15,
    timeLimit: 45,
    options: [
    {
      id: 'a',
      text: "Sunlight and water like plants do",
      image: "https://images.unsplash.com/photo-1560881410-b659d32d8be0",
      imageAlt: "Bright sunlight streaming through water droplets"
    },
    {
      id: 'b',
      text: "A host cell to hijack and use",
      image: "https://images.unsplash.com/photo-1706639448451-02a56cd7b0eb",
      imageAlt: "Diagram showing virus entering and taking over host cell"
    },
    {
      id: 'c',
      text: "Special food from the environment",
      image: "https://images.unsplash.com/photo-1579803165101-cfc62dfdbe45",
      imageAlt: "Various nutrients and minerals in laboratory setting"
    },
    {
      id: 'd',
      text: "Other viruses to combine with",
      image: "https://images.unsplash.com/photo-1707861107901-4a98927cbc61",
      imageAlt: "Multiple virus particles clustering together"
    }],

    correctAnswer: 'b',
    explanation: `Viruses are obligate parasites, meaning they absolutely must have a host cell to reproduce. They inject their genetic material into the host cell and use the cell's machinery to make copies of themselves, often destroying the host cell in the process.`,
    microbeInfo: {
      name: "Influenza Virus",
      description: "A respiratory virus that hijacks your cells to make thousands of copies of itself.",
      image: "https://images.unsplash.com/photo-1580377968211-b6425102326b",
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
    image: "https://images.unsplash.com/photo-1729830125745-235c84569ff0",
    imageAlt: "Close-up view of mushroom fungi growing on decaying wood in forest",
    imageCaption: "Fungi breaking down organic matter in their natural habitat",
    difficulty: "medium",
    points: 15,
    timeLimit: 50,
    options: [
    {
      id: 'a',
      text: "They make their own food using sunlight",
      image: "https://images.unsplash.com/photo-1626872574777-f9c4ca9e0e03",
      imageAlt: "Green plants photosynthesizing in bright sunlight"
    },
    {
      id: 'b',
      text: "They hunt and eat other small organisms",
      image: "https://images.unsplash.com/photo-1631824680987-8bae525fc696",
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
      image: "https://images.unsplash.com/photo-1545150724-ba225035114f",
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
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063",
    imageAlt: "Colorful probiotic bacteria colonies in microscopic view",
    imageCaption: "Beneficial bacteria that live in your intestines",
    difficulty: "easy",
    points: 10,
    timeLimit: 60,
    options: [
      {
        id: 'a',
        text: "Lactobacillus - helps break down dairy and make vitamins",
        image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da",
        imageAlt: "Healthy probiotic bacteria helping with digestion"
      },
      {
        id: 'b',
        text: "Streptococcus - causes strep throat infections",
        image: "https://images.unsplash.com/photo-1630094556251-2a1e50b60e7d",
        imageAlt: "Harmful streptococcus bacteria chains"
      },
      {
        id: 'c',
        text: "Salmonella - makes you sick from bad food",
        image: "https://images.unsplash.com/photo-1628527304948-06157ee3c8a6",
        imageAlt: "Dangerous salmonella bacteria causing food poisoning"
      },
      {
        id: 'd',
        text: "None - all bacteria are harmful to humans",
        image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42",
        imageAlt: "Warning symbol representing harmful bacteria"
      }
    ],
    correctAnswer: 'a',
    explanation: `Lactobacillus is a friendly bacteria superhero! It lives in your gut and helps digest lactose (milk sugar), produces vitamin K for blood clotting, and fights off bad bacteria. You can find it in yogurt, cheese, and fermented foods!`,
    microbeInfo: {
      name: "Lactobacillus acidophilus",
      description: "A friendly bacterium that makes your tummy happy and healthy!",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56",
      imageAlt: "Lactobacillus bacteria helping with digestion",
      facts: [
        "Makes lactic acid that gives yogurt its tangy taste",
        "Can survive the acidic environment of your stomach!"
      ]
    }
  },
  {
    id: 5,
    title: "Microbe Size Challenge",
    text: "How many bacteria could fit on the period at the end of this sentence?",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557",
    imageAlt: "Extreme magnification showing tiny bacteria cells",
    imageCaption: "Bacteria are incredibly tiny - smaller than you can imagine!",
    difficulty: "hard",
    points: 20,
    timeLimit: 50,
    options: [
      {
        id: 'a',
        text: "About 10 bacteria",
        image: "https://images.unsplash.com/photo-1617791160536-598cf32026fb",
        imageAlt: "Small number of bacteria"
      },
      {
        id: 'b',
        text: "About 100 bacteria",
        image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b",
        imageAlt: "Moderate number of bacteria"
      },
      {
        id: 'c',
        text: "About 1,000 bacteria",
        image: "https://images.unsplash.com/photo-1583911860205-72f8ac8ddcbe",
        imageAlt: "Large colony of bacteria"
      },
      {
        id: 'd',
        text: "About 1,000,000 bacteria!",
        image: "https://images.unsplash.com/photo-1580377968211-b6425102326b",
        imageAlt: "Massive bacterial population"
      }
    ],
    correctAnswer: 'd',
    explanation: `Bacteria are SO tiny that about 1 MILLION bacteria could fit on a period at the end of a sentence! That's because bacteria are only about 1-2 micrometers long - you'd need a powerful microscope just to see one!`,
    microbeInfo: {
      name: "Size Comparison",
      description: "Understanding just how incredibly small microbes really are!",
      image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18",
      imageAlt: "Scale comparison showing bacteria size",
      facts: [
        "A typical bacteria is about 2 micrometers (0.000002 meters) long",
        "1000 bacteria lined up = width of a human hair!"
      ]
    }
  },
  {
    id: 6,
    title: "Hand Washing Science",
    text: "Why does washing your hands with soap help remove germs better than just water?",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309",
    imageAlt: "Hands being washed with soap and bubbles",
    imageCaption: "Proper hand washing is one of the best ways to stay healthy!",
    difficulty: "medium",
    points: 15,
    timeLimit: 60,
    options: [
      {
        id: 'a',
        text: "Soap is sticky and traps germs like glue",
        image: "https://images.unsplash.com/photo-1563620396-b45187b1a2c0",
        imageAlt: "Sticky soap trapping particles"
      },
      {
        id: 'b',
        text: "Soap molecules grab germs and water washes them away",
        image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba",
        imageAlt: "Soap molecules surrounding and removing bacteria"
      },
      {
        id: 'c',
        text: "Soap kills all germs instantly on contact",
        image: "https://images.unsplash.com/photo-1628527304948-06157ee3c8a6",
        imageAlt: "Antibacterial soap killing germs"
      },
      {
        id: 'd',
        text: "Soap makes your hands too slippery for germs",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
        imageAlt: "Slippery soapy hands"
      }
    ],
    correctAnswer: 'b',
    explanation: `Soap molecules are super clever! One end loves water (hydrophilic) and the other end loves oil and germs (hydrophobic). When you wash, soap surrounds germs and lifts them off your skin, then water rinses everything away. That's why you need to scrub for at least 20 seconds!`,
    microbeInfo: {
      name: "Hand Washing Chemistry",
      description: "The science behind why soap is a germ-fighting superhero!",
      image: "https://images.unsplash.com/photo-1587556930116-0d19ab50411e",
      imageAlt: "Diagram showing how soap removes germs",
      facts: [
        "Singing 'Happy Birthday' twice = perfect 20-second hand wash!",
        "Soap doesn't kill germs, it just helps remove them"
      ]
    }
  },
  {
    id: 7,
    title: "Antibiotic Knowledge",
    text: "Why won't antibiotics help you feel better if you have a cold or the flu?",
    image: "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d",
    imageAlt: "Antibiotic medicine pills and tablets",
    imageCaption: "Understanding when antibiotics work is important!",
    difficulty: "medium",
    points: 15,
    timeLimit: 55,
    options: [
      {
        id: 'a',
        text: "Antibiotics are too weak to fight cold viruses",
        image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de",
        imageAlt: "Weak medicine"
      },
      {
        id: 'b',
        text: "Antibiotics only work on bacteria, not viruses!",
        image: "https://images.unsplash.com/photo-1579780672346-ece80a74b74c",
        imageAlt: "Antibiotics targeting bacteria specifically"
      },
      {
        id: 'c',
        text: "Cold viruses are immune to all medicines",
        image: "https://images.unsplash.com/photo-1585559604959-d99b3a46e8c6",
        imageAlt: "Protected virus particles"
      },
      {
        id: 'd',
        text: "You need to take them for a full month to work",
        image: "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d",
        imageAlt: "Long-term medication"
      }
    ],
    correctAnswer: 'b',
    explanation: `Antibiotics are designed to kill bacteria by attacking their cell walls or stopping them from reproducing. But viruses don't have cell walls and work completely differently - they hide inside your cells! That's why antibiotics can't touch them. Your immune system is your best defense against viruses!`,
    microbeInfo: {
      name: "Antibiotic Resistance",
      description: "Why we need to use antibiotics wisely and only when necessary!",
      image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926",
      imageAlt: "Bacteria becoming resistant to antibiotics",
      facts: [
        "Taking antibiotics when you don't need them creates 'superbugs'",
        "Always finish your full antibiotic prescription!"
      ]
    }
  },
  {
    id: 8,
    title: "Fungal Friends",
    text: "Which of these delicious foods is made with the help of friendly fungi?",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    imageAlt: "Various bread and baked goods",
    imageCaption: "Fungi help us make lots of tasty foods!",
    difficulty: "easy",
    points: 10,
    timeLimit: 60,
    options: [
      {
        id: 'a',
        text: "Bread - yeast makes it rise and fluffy!",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
        imageAlt: "Fresh baked bread loaves"
      },
      {
        id: 'b',
        text: "Orange juice - fresh squeezed from fruit",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
        imageAlt: "Glass of fresh orange juice"
      },
      {
        id: 'c',
        text: "French fries - fried potato slices",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
        imageAlt: "Crispy french fries"
      },
      {
        id: 'd',
        text: "Chocolate milk - cocoa mixed with milk",
        image: "https://images.unsplash.com/photo-1556530990-3a91c90c0df8",
        imageAlt: "Glass of chocolate milk"
      }
    ],
    correctAnswer: 'a',
    explanation: `Bread is made with yeast, which is a type of fungus! When yeast eats sugar in the dough, it burps out carbon dioxide gas bubbles that make bread rise and become soft and fluffy. Yeast also makes the delicious bread smell we all love!`,
    microbeInfo: {
      name: "Saccharomyces cerevisiae (Baker's Yeast)",
      description: "The friendly fungus that helps make bread, pizza dough, and even beer!",
      image: "https://images.unsplash.com/photo-1598972334790-8e67e00ec6e1",
      imageAlt: "Yeast cells under microscope",
      facts: [
        "One packet of yeast contains billions of tiny yeast cells!",
        "Yeast has been helping humans make bread for over 5,000 years"
      ]
    }
  },
  {
    id: 9,
    title: "Microbe Habitats",
    text: "Where in your body do you have the MOST microorganisms living?",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063",
    imageAlt: "Human body outline showing microbiome locations",
    imageCaption: "You're like a walking microbe hotel!",
    difficulty: "medium",
    points: 15,
    timeLimit: 50,
    options: [
      {
        id: 'a',
        text: "Your mouth and teeth",
        image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99",
        imageAlt: "Person smiling showing teeth"
      },
      {
        id: 'b',
        text: "Your skin surface",
        image: "https://images.unsplash.com/photo-1625073612670-970a91e0e97f",
        imageAlt: "Close-up of human skin"
      },
      {
        id: 'c',
        text: "Your gut and intestines",
        image: "https://images.unsplash.com/photo-1551076805-e1869033e561",
        imageAlt: "Digestive system diagram"
      },
      {
        id: 'd',
        text: "Your lungs when you breathe",
        image: "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3",
        imageAlt: "Respiratory system diagram"
      }
    ],
    correctAnswer: 'c',
    explanation: `Your gut is home to trillions of microbes - more than there are stars in our galaxy! These gut bacteria help you digest food, make vitamins, train your immune system, and even affect your mood. You have about 3 pounds of bacteria in your intestines!`,
    microbeInfo: {
      name: "Gut Microbiome",
      description: "The amazing ecosystem of microbes living in your digestive system!",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063",
      imageAlt: "Diverse gut bacteria colonies",
      facts: [
        "You have more bacterial cells than human cells in your body!",
        "Your gut bacteria produce serotonin, the 'happy chemical'"
      ]
    }
  },
  {
    id: 10,
    title: "Discovery History",
    text: "Who was the first person to see and draw microorganisms using a microscope?",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18",
    imageAlt: "Historical antique microscope",
    imageCaption: "Early microscopes opened up a whole new world!",
    difficulty: "hard",
    points: 20,
    timeLimit: 60,
    options: [
      {
        id: 'a',
        text: "Louis Pasteur - invented pasteurization",
        image: "https://images.unsplash.com/photo-1551076805-e1869033e561",
        imageAlt: "Portrait of Louis Pasteur"
      },
      {
        id: 'b',
        text: "Alexander Fleming - discovered penicillin",
        image: "https://images.unsplash.com/photo-1583911860205-72f8ac8ddcbe",
        imageAlt: "Penicillin growing on a petri dish"
      },
      {
        id: 'c',
        text: "Antoni van Leeuwenhoek - the microscope pioneer",
        image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b",
        imageAlt: "Historical microscope from 1600s"
      },
      {
        id: 'd',
        text: "Marie Curie - discovered radioactivity",
        image: "https://images.unsplash.com/photo-1581093458791-9d42e1c5f0c6",
        imageAlt: "Laboratory with scientific equipment"
      }
    ],
    correctAnswer: 'c',
    explanation: `Antoni van Leeuwenhoek was a Dutch scientist who made his own microscopes in the 1670s and became the first person to see bacteria! He called them "animalcules" (little animals) and drew detailed pictures of what he saw. His discovery opened up an entirely new world of science!`,
    microbeInfo: {
      name: "The Father of Microbiology",
      description: "Antoni van Leeuwenhoek's amazing discovery changed science forever!",
      image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18",
      imageAlt: "Replica of Leeuwenhoek's microscope",
      facts: [
        "He made over 500 microscopes by hand!",
        "His best microscope could magnify objects 275 times"
      ]
    }
  }];


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
    setHostEmotion('excited');
    setHostMessage('Let\'s begin our scientific adventure! Take your time and think carefully about each question.');
  };

  const handleAnswerSelect = (answerId) => {
    if (showResult) return;

    setSelectedAnswer(answerId);
    setShowResult(true);

    const isCorrect = answerId === currentQuestion?.correctAnswer;

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
        <div className="container mx-auto px-4 py-8">
          {/* Quiz Introduction */}
          {!quizStarted &&
          <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center shadow-pronounced">
                  <Icon name="Brain" size={40} color="white" strokeWidth={2.5} />
                </div>
                <h1 className="text-4xl font-heading text-foreground mb-4">
                  Quiz Challenge System
                </h1>
                <p className="text-lg font-body text-muted-foreground max-w-2xl mx-auto">
                  Test your microbiology knowledge with interactive questions and learn fascinating facts about the microscopic world around us!
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Quiz Info */}
                <div className="bg-card rounded-2xl shadow-moderate border border-border p-6">
                  <h2 className="text-2xl font-heading text-foreground mb-6">
                    Ready to Begin?
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <Icon name="HelpCircle" size={20} className="text-primary" />
                      <span className="font-body text-foreground">
                        {totalQuestions} engaging questions about microorganisms
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Clock" size={20} className="text-secondary" />
                      <span className="font-body text-foreground">
                        60 seconds per question with helpful hints
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Star" size={20} className="text-accent" />
                      <span className="font-body text-foreground">
                        Earn points and unlock achievements
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Microscope" size={20} className="text-success" />
                      <span className="font-body text-foreground">
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
                  className="text-lg py-3">

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
              <div className="mt-12 text-center">
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/game-home-dashboard">
                    <Button variant="outline" iconName="Home" iconPosition="left">
                      Back to Dashboard
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
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Main Quiz Area */}
                <div className="lg:col-span-3 space-y-6">
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

                {/* Side Panel */}
                <div className="lg:col-span-1">
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