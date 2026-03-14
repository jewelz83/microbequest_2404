import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, Beaker, Search, CheckCircle, XCircle, AlertCircle, Zap, FlaskConical } from 'lucide-react';

const DigitalLab = ({ selectedCase, collectedClues, onMicrobeIdentified, identifiedMicrobe }) => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [currentMicrobe, setCurrentMicrobe] = useState(null);
  const [showMicrobeOptions, setShowMicrobeOptions] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Microbe database for each case
  const getMicrobeOptions = () => {
    const microbesByCase = {
      1: { // Cafeteria
        correct: {
          id: 'salmonella',
          name: 'Salmonella enterica',
          type: 'Bacteria',
          shape: 'Rod-shaped',
          color: 'Pink/Red (Gram-negative)',
          movement: 'Motile with flagella',
          description: 'Common cause of food poisoning from contaminated poultry, eggs, and cross-contamination.',
          treatment: 'Usually self-limiting. Hydration. Antibiotics for severe cases.',
          prevention: 'Cook poultry to 165°F, avoid cross-contamination, refrigerate promptly.'
        },
        wrong: [
          {
            id: 'ecoli',
            name: 'E. coli',
            type: 'Bacteria',
            reason: 'While E. coli can cause food poisoning, the timing and chicken source point to Salmonella.'
          },
          {
            id: 'staph',
            name: 'Staphylococcus aureus',
            type: 'Bacteria',
            reason: 'Staph toxin acts faster (1-2 hours). This outbreak took 2-4 hours.'
          }
        ]
      },
      2: { // Water Well
        correct: {
          id: 'giardia',
          name: 'Giardia lamblia',
          type: 'Parasite (Protozoan)',
          shape: 'Pear-shaped with flagella',
          color: 'Transparent under microscope',
          movement: 'Tumbling, spinning motion',
          description: 'Waterborne parasite from fecal contamination. Causes severe diarrhea and dehydration.',
          treatment: 'Antiparasitic medications like metronidazole. Rehydration therapy.',
          prevention: 'Protect water sources from contamination, boil water, fix well caps.'
        },
        wrong: [
          {
            id: 'cryptosporidium',
            name: 'Cryptosporidium',
            type: 'Parasite',
            reason: 'Similar symptoms but microscopy showed classic Giardia with flagella.'
          },
          {
            id: 'cholera',
            name: 'Vibrio cholerae',
            type: 'Bacteria',
            reason: 'Cholera causes more severe "rice water" diarrhea and is rare in developed areas.'
          }
        ]
      },
      3: { // Hospital
        correct: {
          id: 'mrsa',
          name: 'MRSA (Methicillin-resistant Staphylococcus aureus)',
          type: 'Bacteria (Antibiotic-resistant)',
          shape: 'Grape-like clusters (cocci)',
          color: 'Purple (Gram-positive)',
          movement: 'Non-motile',
          description: 'Antibiotic-resistant bacteria common in hospitals. Causes skin and surgical site infections.',
          treatment: 'Vancomycin or other special antibiotics. Strict hygiene protocols.',
          prevention: 'Proper hand hygiene, effective sanitizers, isolation precautions, environmental cleaning.'
        },
        wrong: [
          {
            id: 'strep',
            name: 'Streptococcus',
            type: 'Bacteria',
            reason: 'Wrong growth pattern. MRSA grows in clusters, not chains.'
          },
          {
            id: 'regular-staph',
            name: 'Regular Staphylococcus aureus',
            type: 'Bacteria',
            reason: 'Resistance testing showed this is MRSA, not regular Staph.'
          }
        ]
      },
      4: { // Mold Building
        correct: {
          id: 'stachybotrys',
          name: 'Stachybotrys chartarum (Black Mold)',
          type: 'Fungus',
          shape: 'Branching filaments with spores',
          color: 'Black/dark green colonies',
          movement: 'Stationary, spreads via spores',
          description: 'Toxic black mold that grows on water-damaged materials. Produces mycotoxins affecting respiratory health.',
          treatment: 'Remove from environment, treat symptoms (inhalers, antihistamines).',
          prevention: 'Fix water leaks immediately, maintain dry buildings, remove water-damaged materials.'
        },
        wrong: [
          {
            id: 'aspergillus',
            name: 'Aspergillus',
            type: 'Fungus',
            reason: 'Aspergillus was present but black mold (Stachybotrys) is the main toxic culprit.'
          },
          {
            id: 'penicillium',
            name: 'Penicillium',
            type: 'Fungus',
            reason: 'Blue-green mold, less toxic than black mold found in this case.'
          }
        ]
      },
      5: { // Food Festival
        correct: {
          id: 'multiple',
          name: 'Multiple Pathogens',
          type: 'Mixed contamination',
          shape: 'Various (rods, cocci, chains)',
          color: 'Multiple staining patterns',
          movement: 'Various',
          description: 'Multi-source outbreak: Staph from Vendor 3, Salmonella from Vendor 7, Listeria from Vendor 9.',
          treatment: 'Treat each case based on specific pathogen and symptoms.',
          prevention: 'Comprehensive food safety training, proper refrigeration, food handler health policies, temperature monitoring.'
        },
        wrong: [
          {
            id: 'single-salmonella',
            name: 'Salmonella only',
            type: 'Bacteria',
            reason: 'Evidence shows three different microbes from three different vendors.'
          },
          {
            id: 'norovirus',
            name: 'Norovirus',
            type: 'Virus',
            reason: 'Viral gastroenteritis possible but tests confirmed bacterial causes.'
          }
        ]
      },
      6: { // Antibiotic Resistance
        correct: {
          id: 'mrsa-resistant',
          name: 'MRSA with mecA gene',
          type: 'Antibiotic-resistant Bacteria',
          shape: 'Grape clusters (cocci)',
          color: 'Purple (Gram-positive)',
          movement: 'Non-motile',
          description: 'MRSA with mecA gene producing PBP2a protein that prevents beta-lactam antibiotics from working.',
          treatment: 'Vancomycin, linezolid, or daptomycin. Sensitivity testing guides choice.',
          prevention: 'Complete antibiotic courses, avoid unnecessary antibiotics, infection control practices.'
        },
        wrong: [
          {
            id: 'vre',
            name: 'VRE (Vancomycin-resistant Enterococcus)',
            type: 'Bacteria',
            reason: 'Wrong bacteria family. Culture confirmed Staphylococcus, not Enterococcus.'
          },
          {
            id: 'normal-staph',
            name: 'Regular Staph (non-resistant)',
            type: 'Bacteria',
            reason: 'Treatment failure proves this is resistant MRSA.'
          }
        ]
      }
    };

    return microbesByCase?.[selectedCase?.id] || microbesByCase[1];
  };

  // Lab tests available
  const availableTests = [
    {
      id: 'microscopy',
      name: 'Microscopy',
      icon: Microscope,
      description: 'Examine samples under microscope to see microbe shape and movement',
      color: 'blue',
      requiresClues: 2
    },
    {
      id: 'gram-stain',
      name: 'Gram Stain',
      icon: Beaker,
      description: 'Staining test to identify bacteria type (Gram-positive or negative)',
      color: 'purple',
      requiresClues: 3
    },
    {
      id: 'culture',
      name: 'Culture Test',
      icon: FlaskConical,
      description: 'Grow microbes in lab to identify species and test treatments',
      color: 'green',
      requiresClues: 3
    },
    {
      id: 'resistance',
      name: 'Resistance Testing',
      icon: Zap,
      description: 'Test if bacteria can resist antibiotics',
      color: 'orange',
      requiresClues: 4
    }
  ];

  const handleTestSelect = (test) => {
    if (collectedClues?.length < test?.requiresClues) {
      alert(`You need at least ${test?.requiresClues} clues to run this test!`);
      return;
    }

    setSelectedTest(test);
    
    // Simulate test running
    setTimeout(() => {
      setTestResults(prev => [...prev, test?.id]);
      setSelectedTest(null);
      
      // After 3 tests, allow identification
      if (testResults?.length + 1 >= 2) {
        setShowMicrobeOptions(true);
      }
    }, 3000);
  };

  const handleMicrobeSelection = (microbe) => {
    setSelectedAnswer(microbe);
    
    const options = getMicrobeOptions();
    if (microbe?.id === options?.correct?.id) {
      setTimeout(() => {
        setCurrentMicrobe(options?.correct);
        onMicrobeIdentified(options?.correct);
      }, 1500);
    }
  };

  const microbeOptions = getMicrobeOptions();
  const allOptions = [microbeOptions?.correct, ...(microbeOptions?.wrong || [])].sort(() => Math.random() - 0.5);

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors?.[color] || colors?.blue;
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/50 to-green-900/50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="inline-flex items-center gap-3 bg-green-500/20 border border-green-400/30 rounded-full px-6 py-3 mb-4">
            <Beaker className="w-6 h-6 text-green-300" />
            <h2 className="text-2xl font-bold text-white">Digital Laboratory</h2>
          </div>
          <p className="text-white/80 max-w-2xl mx-auto">
            Run scientific tests on your collected evidence to identify the culprit microbe!
          </p>
        </motion.div>

        {identifiedMicrobe ? (
          /* Microbe Identified - Show Results */
          <motion.div
            className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border-2 border-green-400/50 rounded-2xl p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-center mb-6">
              <motion.div
                className="inline-block bg-green-500 rounded-full p-4 mb-4"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                transition={{ duration: 1 }}
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-2">Microbe Identified!</h3>
              <p className="text-green-200 text-lg">Excellent detective work!</p>
            </div>

            <div className="bg-white/10 rounded-xl p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xl font-bold text-white mb-3">{identifiedMicrobe?.name}</h4>
                  <div className="space-y-2 text-white/90">
                    <p><span className="font-semibold text-blue-300">Type:</span> {identifiedMicrobe?.type}</p>
                    <p><span className="font-semibold text-purple-300">Shape:</span> {identifiedMicrobe?.shape}</p>
                    <p><span className="font-semibold text-green-300">Color:</span> {identifiedMicrobe?.color}</p>
                    <p><span className="font-semibold text-orange-300">Movement:</span> {identifiedMicrobe?.movement}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                    <h5 className="font-bold text-blue-200 mb-2">About This Microbe</h5>
                    <p className="text-white/90 text-sm">{identifiedMicrobe?.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                  <h5 className="font-bold text-green-200 mb-2 flex items-center gap-2">
                    <Beaker className="w-4 h-4" />
                    Treatment
                  </h5>
                  <p className="text-white/90 text-sm">{identifiedMicrobe?.treatment}</p>
                </div>
                
                <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4">
                  <h5 className="font-bold text-purple-200 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Prevention
                  </h5>
                  <p className="text-white/90 text-sm">{identifiedMicrobe?.prevention}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-green-200 mb-4">
                Now that you've identified the microbe, head to the Analysis Center to recommend solutions!
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Lab Tests Grid */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-green-400" />
                Available Laboratory Tests
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {availableTests?.map((test) => {
                  const IconComponent = test?.icon;
                  const completed = testResults?.includes(test?.id);
                  const testing = selectedTest?.id === test?.id;
                  const canRun = collectedClues?.length >= test?.requiresClues;

                  return (
                    <motion.button
                      key={test?.id}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        completed
                          ? 'bg-green-500/20 border-green-400/50'
                          : canRun
                            ? 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/15'
                            : 'bg-gray-800/50 border-gray-600/30 cursor-not-allowed opacity-50'
                      }`}
                      onClick={() => canRun && !completed && handleTestSelect(test)}
                      disabled={!canRun || completed || testing}
                      whileHover={canRun && !completed ? { scale: 1.05, y: -5 } : {}}
                    >
                      {completed && (
                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <IconComponent className={`w-8 h-8 mx-auto mb-3 ${completed ? 'text-green-300' : 'text-white/80'}`} />
                      <h4 className="font-bold text-white text-center mb-2">{test?.name}</h4>
                      <p className="text-white/70 text-xs text-center">{test?.description}</p>
                      
                      <div className="mt-3 text-center">
                        {completed ? (
                          <span className="text-green-300 text-xs">✓ Complete</span>
                        ) : testing ? (
                          <span className="text-yellow-300 text-xs">⚗️ Testing...</span>
                        ) : canRun ? (
                          <span className="text-blue-300 text-xs">Click to run</span>
                        ) : (
                          <span className="text-red-300 text-xs">Need {test?.requiresClues} clues</span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Testing Animation */}
            <AnimatePresence>
              {selectedTest && (
                <motion.div
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl p-8 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="inline-block"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Beaker className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                    </motion.div>
                    <h4 className="text-2xl font-bold text-white mb-2">Running {selectedTest?.name}...</h4>
                    <p className="text-white/80">Analyzing your evidence samples</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Microbe Identification Options */}
            {showMicrobeOptions && !identifiedMicrobe && (
              <motion.div
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3 className="text-2xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
                  <Search className="w-6 h-6" />
                  Identify the Culprit Microbe
                </h3>
                <p className="text-white/80 text-center mb-6">
                  Based on your test results, which microorganism caused this outbreak?
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  {allOptions?.map((option) => {
                    const isSelected = selectedAnswer?.id === option?.id;
                    const isCorrect = option?.id === microbeOptions?.correct?.id;
                    const showResult = isSelected;

                    return (
                      <motion.button
                        key={option?.id}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          showResult
                            ? isCorrect
                              ? 'bg-green-500/30 border-green-400 shadow-lg shadow-green-500/50'
                              : 'bg-red-500/30 border-red-400 shadow-lg shadow-red-500/50'
                            : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/15'
                        }`}
                        onClick={() => !selectedAnswer && handleMicrobeSelection(option)}
                        disabled={!!selectedAnswer}
                        whileHover={!selectedAnswer ? { scale: 1.05, y: -5 } : {}}
                      >
                        {showResult && (
                          <div className="absolute -top-3 -right-3">
                            {isCorrect ? (
                              <div className="bg-green-500 rounded-full p-2">
                                <CheckCircle className="w-6 h-6 text-white" />
                              </div>
                            ) : (
                              <div className="bg-red-500 rounded-full p-2">
                                <XCircle className="w-6 h-6 text-white" />
                              </div>
                            )}
                          </div>
                        )}

                        <h4 className="font-bold text-white text-lg mb-2">{option?.name}</h4>
                        <p className="text-white/70 text-sm">{option?.type}</p>
                        
                        {showResult && !isCorrect && option?.reason && (
                          <p className="text-red-200 text-xs mt-3 italic">{option?.reason}</p>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Progress Indicator */}
            {testResults?.length > 0 && !showMicrobeOptions && (
              <motion.div
                className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-white/90">
                  Tests completed: {testResults?.length} / {availableTests?.length}
                  {testResults?.length >= 2 ? " - Ready to identify microbe!" : ` - Run ${2 - testResults?.length} more test(s)`}
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DigitalLab;
