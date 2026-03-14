import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle, XCircle, Lightbulb, AlertTriangle, TrendingUp, Shield, Users } from 'lucide-react';

const AnalysisCenter = ({ selectedCase, collectedClues, identifiedMicrobe, onSolutionSubmit, solutionSubmitted }) => {
  const [selectedSolutions, setSelectedSolutions] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Solution options for each case
  const getSolutionOptions = () => {
    const solutionsByCase = {
      1: { // Cafeteria
        problem: "Food poisoning outbreak from Salmonella in chicken salad",
        correctSolutions: [
          {
            id: 'temp-control',
            title: 'Implement Temperature Control',
            description: 'Keep cold foods below 40°F and hot foods above 140°F. Never leave food at room temperature.',
            category: 'immediate',
            icon: AlertTriangle
          },
          {
            id: 'separate-boards',
            title: 'Separate Cutting Boards',
            description: 'Use different cutting boards for raw meat and vegetables to prevent cross-contamination.',
            category: 'immediate',
            icon: Shield
          },
          {
            id: 'food-safety-training',
            title: 'Food Safety Training',
            description: 'Train all cafeteria staff in proper food handling, storage, and preparation techniques.',
            category: 'long-term',
            icon: Users
          }
        ],
        wrongSolutions: [
          {
            id: 'antibiotics-everyone',
            title: 'Give Antibiotics to All Students',
            description: 'Not necessary - most cases are self-limiting and overuse creates resistance.',
            reason: 'Antibiotics not needed for mild food poisoning'
          },
          {
            id: 'close-school',
            title: 'Close the Entire School',
            description: 'Too extreme - only the cafeteria needs attention.',
            reason: 'Disproportionate response to localized issue'
          }
        ]
      },
      2: { // Water Well
        problem: "Waterborne illness from contaminated well water (Giardia)",
        correctSolutions: [
          {
            id: 'boil-water',
            title: 'Immediate Boil Water Order',
            description: 'Boil all drinking water for 1 minute to kill parasites and bacteria until well is fixed.',
            category: 'immediate',
            icon: AlertTriangle
          },
          {
            id: 'fix-well-cap',
            title: 'Repair Well Cap',
            description: 'Replace damaged well cover to prevent surface water contamination.',
            category: 'immediate',
            icon: Shield
          },
          {
            id: 'upstream-protection',
            title: 'Protect Water Source',
            description: 'Work with farm to prevent agricultural runoff. Create buffer zone around well.',
            category: 'long-term',
            icon: TrendingUp
          }
        ],
        wrongSolutions: [
          {
            id: 'add-chlorine-only',
            title: 'Just Add Chlorine to Water',
            description: 'Chlorine alone won\'t kill Giardia cysts effectively.',
            reason: 'Parasites resist standard chlorination'
          },
          {
            id: 'blame-campers',
            title: 'Blame Campers for Poor Hygiene',
            description: 'The well is contaminated - this isn\'t about camper hygiene.',
            reason: 'Misidentifies the problem source'
          }
        ]
      },
      3: { // Hospital
        problem: "Hospital-acquired MRSA infections from inadequate hand hygiene",
        correctSolutions: [
          {
            id: 'proper-sanitizer',
            title: 'Switch to Effective Sanitizer',
            description: 'Use hand sanitizer with at least 60% alcohol. Check expiration dates regularly.',
            category: 'immediate',
            icon: AlertTriangle
          },
          {
            id: 'isolation-protocol',
            title: 'Strict Isolation Procedures',
            description: 'Isolate MRSA patients. Require gowns and gloves for all contact.',
            category: 'immediate',
            icon: Shield
          },
          {
            id: 'environmental-cleaning',
            title: 'Enhanced Environmental Cleaning',
            description: 'Daily disinfection of all surfaces, especially high-touch areas like doorknobs and bed rails.',
            category: 'immediate',
            icon: Shield
          },
          {
            id: 'staff-education',
            title: 'Staff Hand Hygiene Training',
            description: 'Mandatory training on when and how to perform hand hygiene. Monitor compliance.',
            category: 'long-term',
            icon: Users
          }
        ],
        wrongSolutions: [
          {
            id: 'antibiotics-all',
            title: 'Give Antibiotics to All Patients',
            description: 'Creates more resistance. Only treat active infections.',
            reason: 'Prophylactic antibiotics worsen resistance'
          },
          {
            id: 'close-hospital',
            title: 'Close the Hospital',
            description: 'Impractical and unnecessary with proper infection control.',
            reason: 'Extreme and unnecessary response'
          }
        ]
      },
      4: { // Mold Building
        problem: "Toxic black mold exposure causing respiratory problems",
        correctSolutions: [
          {
            id: 'evacuate-rooms',
            title: 'Evacuate Affected Classrooms',
            description: 'Immediately move students from Rooms 203 and 205 to safe areas.',
            category: 'immediate',
            icon: AlertTriangle
          },
          {
            id: 'professional-remediation',
            title: 'Professional Mold Remediation',
            description: 'Hire certified mold remediation specialists to remove all contaminated materials.',
            category: 'immediate',
            icon: Shield
          },
          {
            id: 'fix-moisture',
            title: 'Fix Moisture Source',
            description: 'Repair leaks, dry walls completely, improve ventilation to prevent future mold growth.',
            category: 'long-term',
            icon: TrendingUp
          },
          {
            id: 'hvac-cleaning',
            title: 'Clean HVAC System',
            description: 'Clean air ducts and replace filters to prevent spore distribution.',
            category: 'long-term',
            icon: Shield
          }
        ],
        wrongSolutions: [
          {
            id: 'paint-over',
            title: 'Just Paint Over the Mold',
            description: 'Doesn\'t remove mold, just hides it. Problem continues.',
            reason: 'Cosmetic fix doesn\'t address root cause'
          },
          {
            id: 'fans-only',
            title: 'Use Fans to Air Out Rooms',
            description: 'Spreads spores around. Makes problem worse.',
            reason: 'Distributes contamination instead of removing it'
          }
        ]
      },
      5: { // Food Festival
        problem: "Multi-source food poisoning outbreak (Staph, Salmonella, Listeria)",
        correctSolutions: [
          {
            id: 'close-vendors',
            title: 'Immediately Close Problem Vendors',
            description: 'Shut down Vendors 3, 7, and 9 until violations corrected.',
            category: 'immediate',
            icon: AlertTriangle
          },
          {
            id: 'mandatory-training',
            title: 'Mandatory Food Handler Training',
            description: 'Require food safety certification for all festival vendors.',
            category: 'long-term',
            icon: Users
          },
          {
            id: 'temperature-monitoring',
            title: 'Temperature Monitoring System',
            description: 'Require thermometers and temperature logs for all food vendors.',
            category: 'long-term',
            icon: Shield
          },
          {
            id: 'health-inspections',
            title: 'Pre-Festival Health Inspections',
            description: 'Inspect all vendors before allowing them to serve food at future festivals.',
            category: 'long-term',
            icon: TrendingUp
          }
        ],
        wrongSolutions: [
          {
            id: 'ban-festivals',
            title: 'Ban All Food Festivals',
            description: 'Too extreme. Better regulation is the answer.',
            reason: 'Overreaction - proper oversight is sufficient'
          },
          {
            id: 'blame-weather',
            title: 'Just Avoid Hot Days',
            description: 'Temperature was a factor but not the root cause.',
            reason: 'Ignores fundamental food safety failures'
          }
        ]
      },
      6: { // Antibiotic Resistance
        problem: "MRSA infection with antibiotic resistance",
        correctSolutions: [
          {
            id: 'switch-antibiotic',
            title: 'Switch to Vancomycin',
            description: 'Use sensitivity testing to select effective antibiotic (vancomycin or alternatives).',
            category: 'immediate',
            icon: AlertTriangle
          },
          {
            id: 'patient-education',
            title: 'Patient Education',
            description: 'Teach patient to complete full antibiotic course even when feeling better.',
            category: 'immediate',
            icon: Users
          },
          {
            id: 'infection-control',
            title: 'Strict Infection Control',
            description: 'Isolate patient, implement contact precautions to prevent spread.',
            category: 'immediate',
            icon: Shield
          },
          {
            id: 'stewardship-program',
            title: 'Antibiotic Stewardship Program',
            description: 'Hospital-wide program to prevent inappropriate antibiotic use.',
            category: 'long-term',
            icon: TrendingUp
          }
        ],
        wrongSolutions: [
          {
            id: 'higher-dose',
            title: 'Just Give Higher Dose of Same Antibiotic',
            description: 'Won\'t work - bacteria is resistant to this drug.',
            reason: 'Resistance means the drug doesn\'t work regardless of dose'
          },
          {
            id: 'multiple-antibiotics',
            title: 'Give All Antibiotics at Once',
            description: 'Dangerous and causes more resistance. Use targeted therapy.',
            reason: 'Causes toxicity and accelerates resistance development'
          }
        ]
      }
    };

    return solutionsByCase?.[selectedCase?.id] || solutionsByCase[1];
  };

  const solutions = getSolutionOptions();
  const allSolutions = [...solutions?.correctSolutions, ...solutions?.wrongSolutions].sort(() => Math.random() - 0.5);

  const handleSolutionToggle = (solutionId) => {
    if (showResults) return;

    setSelectedSolutions(prev =>
      prev?.includes(solutionId)
        ? prev?.filter(id => id !== solutionId)
        : [...prev, solutionId]
    );
  };

  const handleSubmit = () => {
    if (selectedSolutions?.length === 0) {
      alert('Please select at least one solution before submitting!');
      return;
    }

    setShowResults(true);

    // Calculate score
    const correctIds = solutions?.correctSolutions?.map(s => s?.id);
    const selectedCorrect = selectedSolutions?.filter(id => correctIds?.includes(id));
    const selectedWrong = selectedSolutions?.filter(id => !correctIds?.includes(id));

    const score = (selectedCorrect?.length * 10) - (selectedWrong?.length * 5);
    const isPerfect = selectedCorrect?.length === correctIds?.length && selectedWrong?.length === 0;

    setTimeout(() => {
      onSolutionSubmit({ score, isPerfect });
    }, 3000);
  };

  const isCorrectSolution = (solutionId) => {
    return solutions?.correctSolutions?.some(s => s?.id === solutionId);
  };

  const isSelected = (solutionId) => selectedSolutions?.includes(solutionId);

  const getCategoryColor = (category) => {
    const colors = {
      immediate: 'from-red-500 to-orange-500',
      'long-term': 'from-blue-500 to-purple-500'
    };
    return colors?.[category] || colors?.immediate;
  };

  const getCategoryBadge = (category) => {
    const badges = {
      immediate: { text: 'Immediate Action', color: 'bg-red-500/20 text-red-200 border-red-400/30' },
      'long-term': { text: 'Long-term Prevention', color: 'bg-blue-500/20 text-blue-200 border-blue-400/30' }
    };
    return badges?.[category] || badges?.immediate;
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/50 to-pink-900/50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="inline-flex items-center gap-3 bg-pink-500/20 border border-pink-400/30 rounded-full px-6 py-3 mb-4">
            <Target className="w-6 h-6 text-pink-300" />
            <h2 className="text-2xl font-bold text-white">Analysis Center</h2>
          </div>
          <p className="text-white/80 max-w-2xl mx-auto">
            Based on your investigation, recommend solutions to solve this outbreak and prevent future cases!
          </p>
        </motion.div>

        {/* Problem Summary */}
        <motion.div
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-4">
            <Lightbulb className="w-8 h-8 text-yellow-300 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Case Summary</h3>
              <p className="text-white/90">{solutions?.problem}</p>
              
              {identifiedMicrobe && (
                <div className="mt-4 bg-white/10 rounded-lg p-3">
                  <span className="text-green-300 font-semibold">Identified Microbe: </span>
                  <span className="text-white">{identifiedMicrobe?.name}</span>
                </div>
              )}
              
              <div className="mt-3 text-white/80 text-sm">
                Clues Collected: {collectedClues?.length}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Solution Selection */}
        {!showResults ? (
          <div>
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              Select the Best Solutions (Choose All That Apply)
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {allSolutions?.map((solution, index) => {
                const selected = isSelected(solution?.id);
                const IconComponent = solution?.icon || Target;
                const category = solution?.category;
                const badge = category ? getCategoryBadge(category) : null;

                return (
                  <motion.button
                    key={solution?.id}
                    className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                      selected
                        ? 'bg-blue-500/30 border-blue-400 shadow-lg shadow-blue-500/30'
                        : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/15'
                    }`}
                    onClick={() => handleSolutionToggle(solution?.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Selection Indicator */}
                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selected 
                        ? 'bg-blue-500 border-blue-400' 
                        : 'border-white/30'
                    }`}>
                      {selected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>

                    {/* Content */}
                    <div className="pr-8">
                      <div className="flex items-start gap-4 mb-4">
                        {IconComponent && (
                          <div className={`p-3 rounded-lg ${selected ? 'bg-white/20' : 'bg-white/10'}`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-lg mb-2">{solution?.title}</h4>
                          {badge && (
                            <span className={`inline-block text-xs px-3 py-1 rounded-full border ${badge?.color} mb-2`}>
                              {badge?.text}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {solution?.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Submit Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={handleSubmit}
                disabled={selectedSolutions?.length === 0}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-pink-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
              >
                <Target className="w-6 h-6" />
                Submit Solutions
              </button>
              <p className="text-white/60 text-sm mt-3">
                {selectedSolutions?.length} solution{selectedSolutions?.length !== 1 ? 's' : ''} selected
              </p>
            </motion.div>
          </div>
        ) : (
          /* Results Display */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Correct Solutions */}
              <div>
                <h4 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Correct Solutions
                </h4>
                <div className="space-y-3">
                  {solutions?.correctSolutions?.map((solution) => {
                    const wasSelected = isSelected(solution?.id);
                    return (
                      <div
                        key={solution?.id}
                        className={`p-4 rounded-lg border ${
                          wasSelected
                            ? 'bg-green-500/20 border-green-400/50'
                            : 'bg-red-500/20 border-red-400/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {wasSelected ? (
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <h5 className="font-semibold text-white mb-1">{solution?.title}</h5>
                            <p className="text-white/70 text-sm">{solution?.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Wrong Solutions */}
              <div>
                <h4 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                  <XCircle className="w-6 h-6" />
                  Incorrect Options
                </h4>
                <div className="space-y-3">
                  {solutions?.wrongSolutions?.map((solution) => {
                    const wasSelected = isSelected(solution?.id);
                    return (
                      <div
                        key={solution?.id}
                        className={`p-4 rounded-lg border ${
                          wasSelected
                            ? 'bg-red-500/20 border-red-400/50'
                            : 'bg-green-500/20 border-green-400/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {wasSelected ? (
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <h5 className="font-semibold text-white mb-1">{solution?.title}</h5>
                            {wasSelected && (
                              <p className="text-red-200 text-sm italic mb-2">Why this is wrong: {solution?.reason}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Final Message */}
            <motion.div
              className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-white mb-3">Case Complete!</h3>
              <p className="text-white/90 text-lg mb-4">
                Excellent work, Detective! You've successfully investigated the outbreak and recommended solutions.
              </p>
              <p className="text-green-300">
                Your recommendations will help prevent future outbreaks and protect the community!
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnalysisCenter;
