import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, CheckCircle, AlertCircle, ChevronRight, Lightbulb } from 'lucide-react';


const InterviewRoom = ({ selectedCase, onClueFound, collectedClues }) => {
  const [currentWitness, setCurrentWitness] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [interviewComplete, setInterviewComplete] = useState([]);

  // Witness and interview data for each case
  const getWitnessesForCase = () => {
    const witnessesByCase = {
      1: [ // Cafeteria
        {
          id: 'principal',
          name: 'Principal Martinez',
          role: 'School Principal',
          avatar: '👨‍💼',
          questions: [
            {
              q: "When did students first show symptoms?",
              a: "Right after lunch period ended, around 1:30 PM. Many students went to the nurse's office complaining of stomach pain.",
              clue: null
            },
            {
              q: "Did all students eat the same lunch?",
              a: "Most got the chicken salad special. Some students who brought lunch from home or bought pizza weren't affected.",
              clue: {
                id: 'interview-cafeteria-1',
                type: 'witness',
                title: 'Lunch Pattern',
                description: 'Only students who ate the chicken salad became ill.',
                icon: Users,
                color: 'orange'
              }
            },
            {
              q: "Any problems with cafeteria before?",
              a: "Actually, yes. Our refrigerator broke last week and we had to keep food in coolers until the repair arrived.",
              clue: {
                id: 'interview-cafeteria-2',
                type: 'witness',
                title: 'Equipment Issue',
                description: 'Broken refrigerator may have caused temperature problems.',
                icon: AlertCircle,
                color: 'red'
              }
            }
          ]
        },
        {
          id: 'cook',
          name: 'Maria (Head Cook)',
          role: 'Cafeteria Cook',
          avatar: '👩‍🍳',
          questions: [
            {
              q: "Walk me through how you prepared the chicken salad.",
              a: "I cooked the chicken at 10 AM, let it cool on the counter, then made the salad. We didn't have enough fridge space with the broken unit.",
              clue: {
                id: 'interview-cafeteria-3',
                type: 'witness',
                title: 'Food Temperature',
                description: 'Chicken sat at room temperature for 2.5 hours before serving.',
                icon: AlertCircle,
                color: 'red'
              }
            },
            {
              q: "Do you use separate cutting boards for raw meat?",
              a: "Usually yes, but we're short on supplies. Sometimes I rinse the board quickly and use it for vegetables right after.",
              clue: {
                id: 'interview-cafeteria-4',
                type: 'witness',
                title: 'Cross-Contamination',
                description: 'Raw chicken and vegetables shared same cutting board.',
                icon: AlertCircle,
                color: 'red'
              }
            }
          ]
        },
        {
          id: 'nurse',
          name: 'Nurse Johnson',
          role: 'School Nurse',
          avatar: '👩‍⚕️',
          questions: [
            {
              q: "What symptoms did students have?",
              a: "Nausea, vomiting, diarrhea, stomach cramps, and some had fever. Classic food poisoning symptoms appearing 2-4 hours after lunch.",
              clue: null
            },
            {
              q: "Were all cases equally severe?",
              a: "Most were moderate, but three students needed IV fluids for dehydration. They're okay now but it was scary.",
              clue: null
            }
          ]
        }
      ],
      2: [ // Water Well
        {
          id: 'director',
          name: 'Camp Director Sarah',
          role: 'Camp Director',
          avatar: '👩‍🏫',
          questions: [
            {
              q: "Tell me about the well water.",
              a: "We've used that well for 15 years without problems. But after the heavy rain last week, some campers said it tasted funny.",
              clue: {
                id: 'interview-well-1',
                type: 'witness',
                title: 'Taste Change',
                description: 'Water quality changed after recent rain.',
                icon: Users,
                color: 'orange'
              }
            },
            {
              q: "What did the water taste like?",
              a: "Kids said it was 'earthy' or 'muddy.' I didn't drink it myself - I always use bottled water. Maybe that's why I didn't get sick!",
              clue: null
            },
            {
              q: "Is there any farming nearby?",
              a: "Oh yes! There's a dairy farm just uphill. They use a lot of fertilizer on their fields. The rain probably caused runoff into our well area.",
              clue: {
                id: 'interview-well-2',
                type: 'witness',
                title: 'Upstream Contamination',
                description: 'Farm runoff from above may have polluted well water.',
                icon: AlertCircle,
                color: 'red'
              }
            }
          ]
        },
        {
          id: 'counselor',
          name: 'Counselor Mike',
          role: 'Camp Counselor',
          avatar: '👨‍🏫',
          questions: [
            {
              q: "Which campers got sick?",
              a: "Eight kids from Cabin 3 and Cabin 5. They all drank from the well. Kids who brought their own water bottles are fine.",
              clue: null
            },
            {
              q: "Did you inspect the well?",
              a: "Yeah, I looked at it yesterday. The wooden cover is cracked and doesn't fit right anymore. I could see daylight through the gaps.",
              clue: {
                id: 'interview-well-3',
                type: 'witness',
                title: 'Well Damage',
                description: 'Damaged well cap allows surface water contamination.',
                icon: AlertCircle,
                color: 'red'
              }
            }
          ]
        }
      ],
      3: [ // Hospital
        {
          id: 'dr-smith',
          name: 'Dr. Smith',
          role: 'Chief of Surgery',
          avatar: '👨‍⚕️',
          questions: [
            {
              q: "When did you notice the infection problem?",
              a: "About 2 months ago, surgical site infections started increasing. We've had 12 cases - that's triple our normal rate.",
              clue: null
            },
            {
              q: "What changed 2 months ago?",
              a: "The hospital switched to a cheaper hand sanitizer brand to cut costs. I raised concerns but was told it met basic requirements.",
              clue: {
                id: 'interview-hospital-1',
                type: 'witness',
                title: 'Product Change',
                description: 'New cheaper sanitizer started 2 months ago when infections began.',
                icon: AlertCircle,
                color: 'red'
              }
            },
            {
              q: "Are staff following hygiene protocols?",
              a: "They try, but we're understaffed and rushed. I've seen people skip proper handwashing or use too little sanitizer because we're always running out.",
              clue: {
                id: 'interview-hospital-2',
                type: 'witness',
                title: 'Hygiene Compliance',
                description: 'Staff rush and run out of supplies frequently.',
                icon: Users,
                color: 'orange'
              }
            }
          ]
        },
        {
          id: 'nurse',
          name: 'Nurse Rodriguez',
          role: 'Surgical Ward Nurse',
          avatar: '👩‍⚕️',
          questions: [
            {
              q: "What do you see on the ward daily?",
              a: "The sanitizer dispensers are empty half the time. We have to track down bottles. By the time I find one, I've already touched three doorknobs.",
              clue: null
            },
            {
              q: "How do the infected patients present?",
              a: "Redness, pus, and warmth around incisions. Fever starting day 3-4 post-surgery. The antibiotics aren't working as well as they should.",
              clue: {
                id: 'interview-hospital-3',
                type: 'witness',
                title: 'Antibiotic Resistance',
                description: 'Standard antibiotics showing reduced effectiveness.',
                icon: AlertCircle,
                color: 'red'
              }
            }
          ]
        }
      ],
      4: [ // Moldy Building
        {
          id: 'nurse',
          name: 'School Nurse Pat',
          role: 'School Nurse',
          avatar: '👨‍⚕️',
          questions: [
            {
              q: "Which students are affected?",
              a: "Mostly from Rooms 203 and 205. Twenty students total. Their symptoms get better on weekends but worse on Monday.",
              clue: {
                id: 'interview-mold-1',
                type: 'witness',
                title: 'Pattern Discovery',
                description: 'Symptoms tied to being in specific classrooms.',
                icon: Users,
                color: 'orange'
              }
            },
            {
              q: "What symptoms are you seeing?",
              a: "Coughing, wheezing, watery eyes, stuffy nose. Kids with asthma are having it really bad - I've used more rescue inhalers this month than all last year.",
              clue: null
            }
          ]
        },
        {
          id: 'janitor',
          name: 'Janitor Tom',
          role: 'Head Janitor',
          avatar: '👨‍🔧',
          questions: [
            {
              q: "Tell me about the pipe burst.",
              a: "Happened last month. Water flooded Rooms 203 and 205. We replaced the wet ceiling tiles and carpet, but I noticed the walls still feel damp.",
              clue: {
                id: 'interview-mold-2',
                type: 'witness',
                title: 'Hidden Moisture',
                description: 'Walls remain damp despite visible repairs.',
                icon: AlertCircle,
                color: 'red'
              }
            },
            {
              q: "Have you noticed anything else unusual?",
              a: "There's a musty smell in those rooms. And I see dark spots behind the new tiles when I checked. I reported it but no one followed up.",
              clue: {
                id: 'interview-mold-3',
                type: 'witness',
                title: 'Mold Growth',
                description: 'Dark spots and musty odor indicate mold behind tiles.',
                icon: AlertCircle,
                color: 'red'
              }
            }
          ]
        },
        {
          id: 'teacher',
          name: 'Teacher Ms. Garcia',
          role: 'Room 203 Teacher',
          avatar: '👩‍🏫',
          questions: [
            {
              q: "What have you observed in your classroom?",
              a: "The AC vent blows musty air. I've seen students near the vent cough more. I even developed a stuffy nose that won't go away.",
              clue: {
                id: 'interview-mold-4',
                type: 'witness',
                title: 'HVAC Spread',
                description: 'Air system distributing mold spores throughout room.',
                icon: AlertCircle,
                color: 'red'
              }
            }
          ]
        }
      ],
      5: [ // Food Festival
        {
          id: 'health-inspector',
          name: 'Health Inspector Davis',
          role: 'County Health Department',
          avatar: '👨‍💼',
          questions: [
            {
              q: "What did your investigation find?",
              a: "This is complex - at least three different vendors had violations. Vendor 3's hot dogs, Vendor 7's salads, and Vendor 9's ice cream all had problems.",
              clue: {
                id: 'interview-festival-1',
                type: 'witness',
                title: 'Multiple Sources',
                description: 'Three different vendors caused illnesses.',
                icon: AlertCircle,
                color: 'red'
              }
            },
            {
              q: "What specific violations did you find?",
              a: "Vendor 3: no thermometer, undercooked hot dogs. Vendor 7: unrefrigerated mayo-based salads in hot sun. Vendor 9: broken freezer, ice cream was soft.",
              clue: {
                id: 'interview-festival-2',
                type: 'witness',
                title: 'Temperature Abuse',
                description: 'All three vendors had temperature control failures.',
                icon: AlertCircle,
                color: 'red'
              }
            }
          ]
        },
        {
          id: 'victim',
          name: 'Festival Attendee Lisa',
          role: 'Outbreak Victim',
          avatar: '👩',
          questions: [
            {
              q: "What did you eat at the festival?",
              a: "I had a hot dog from Vendor 3 and potato salad from Vendor 7. Started feeling sick 4 hours later. My friend only ate pizza and was fine.",
              clue: null
            },
            {
              q: "Were conditions at the festival appropriate for food?",
              a: "It was a really hot day - like 95°F! Food was sitting out in the sun for hours. I remember thinking the potato salad looked warm.",
              clue: {
                id: 'interview-festival-3',
                type: 'witness',
                title: 'Weather Conditions',
                description: 'Extreme heat accelerated food spoilage.',
                icon: AlertCircle,
                color: 'red'
              }
            }
          ]
        },
        {
          id: 'vendor',
          name: 'Vendor 3 Worker',
          role: 'Hot Dog Stand',
          avatar: '👨‍🍳',
          questions: [
            {
              q: "Tell me about your food preparation.",
              a: "I just heat the hot dogs and serve them. I don't have a thermometer - I go by how they look. They seemed fine to me.",
              clue: null
            },
            {
              q: "Were you feeling well that day?",
              a: "Honestly? I had a stomach bug but needed the money. I tried to be careful but probably should have stayed home.",
              clue: {
                id: 'interview-festival-4',
                type: 'witness',
                title: 'Sick Food Handler',
                description: 'Ill worker contaminated food with own illness.',
                icon: AlertCircle,
                color: 'red'
              }
            }
          ]
        }
      ],
      6: [ // Antibiotic Resistance
        {
          id: 'doctor',
          name: 'Dr. Patel',
          role: 'Infectious Disease Specialist',
          avatar: '👨‍⚕️',
          questions: [
            {
              q: "Tell me about this patient's case.",
              a: "He's been hospitalized three times this year for different infections. Each time he got antibiotics, but he admits he stops taking them when he feels better.",
              clue: {
                id: 'interview-resistance-1',
                type: 'witness',
                title: 'Incomplete Treatment',
                description: 'Patient repeatedly stopped antibiotics early.',
                icon: AlertCircle,
                color: 'red'
              }
            },
            {
              q: "Why is this case so serious?",
              a: "The bacteria is MRSA - resistant to multiple antibiotics. It's spreading in the ICU. We've had to isolate the patient and implement strict precautions for staff.",
              clue: {
                id: 'interview-resistance-2',
                type: 'witness',
                title: 'Hospital Outbreak',
                description: 'Resistant bacteria spreading to other patients.',
                icon: AlertCircle,
                color: 'red'
              }
            }
          ]
        },
        {
          id: 'pharmacist',
          name: 'Pharmacist Chen',
          role: 'Hospital Pharmacist',
          avatar: '👩‍⚕️',
          questions: [
            {
              q: "Review the patient's medication history.",
              a: "Multiple antibiotic prescriptions over the past year. The pattern shows he picks up the prescription but never completes the full course.",
              clue: null
            },
            {
              q: "What treatment options remain?",
              a: "Vancomycin is our best bet now, but it's more toxic and expensive. If resistance to that develops, we're in real trouble. This is why completing antibiotics matters!",
              clue: {
                id: 'interview-resistance-3',
                type: 'witness',
                title: 'Limited Options',
                description: 'Few remaining antibiotics effective against this resistant strain.',
                icon: AlertCircle,
                color: 'red'
              }
            }
          ]
        },
        {
          id: 'patient',
          name: 'Patient (John)',
          role: 'Hospital Patient',
          avatar: '👨',
          questions: [
            {
              q: "Why did you stop taking your antibiotics?",
              a: "Once I felt better, I figured I was cured. The pills made me nauseous and I thought I didn't need them anymore. I didn't know it could make things worse.",
              clue: {
                id: 'interview-resistance-4',
                type: 'witness',
                title: 'Patient Education Gap',
                description: 'Lack of understanding about antibiotic resistance.',
                icon: Users,
                color: 'orange'
              }
            }
          ]
        }
      ]
    };

    return witnessesByCase?.[selectedCase?.id] || witnessesByCase[1];
  };

  const witnesses = getWitnessesForCase();
  const currentWitnessData = witnesses?.find(w => w?.id === currentWitness);
  const isWitnessInterviewed = (witnessId) => interviewComplete?.includes(witnessId);

  const handleAskQuestion = (question) => {
    if (question?.clue) {
      // Check if clue already collected
      const alreadyHasClue = collectedClues?.some(c => c?.id === question?.clue?.id);
      if (!alreadyHasClue) {
        onClueFound(question?.clue);
      }
    }

    if (currentQuestion < currentWitnessData?.questions?.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Interview complete
      setInterviewComplete(prev => [...prev, currentWitness]);
      setTimeout(() => {
        setCurrentWitness(null);
        setCurrentQuestion(0);
      }, 2000);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/50 to-orange-900/50 p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="inline-flex items-center gap-3 bg-orange-500/20 border border-orange-400/30 rounded-full px-6 py-3 mb-4">
            <Users className="w-6 h-6 text-orange-300" />
            <h2 className="text-2xl font-bold text-white">Interview Room</h2>
          </div>
          <p className="text-white/80 max-w-2xl mx-auto">
            Interview witnesses to gather crucial information about the outbreak!
          </p>
        </motion.div>

        {!currentWitness ? (
          /* Witness Selection */
          <div>
            <h3 className="text-xl font-bold text-white mb-6 text-center">Select a Witness to Interview</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {witnesses?.map((witness, index) => {
                const interviewed = isWitnessInterviewed(witness?.id);
                
                return (
                  <motion.button
                    key={witness?.id}
                    className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                      interviewed
                        ? 'bg-green-500/20 border-green-400/50'
                        : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/15'
                    }`}
                    onClick={() => !interviewed && setCurrentWitness(witness?.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={!interviewed ? { scale: 1.05, y: -5 } : {}}
                  >
                    {interviewed && (
                      <div className="absolute -top-3 -right-3 bg-green-500 rounded-full p-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}

                    <div className="text-6xl mb-4 text-center">{witness?.avatar}</div>
                    <h4 className="font-bold text-white text-lg mb-1">{witness?.name}</h4>
                    <p className="text-white/70 text-sm mb-4">{witness?.role}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      {interviewed ? (
                        <span className="text-green-300">✓ Interviewed</span>
                      ) : (
                        <>
                          <span className="text-orange-300">{witness?.questions?.length} questions</span>
                          <ChevronRight className="w-4 h-4 text-white/50" />
                        </>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {interviewComplete?.length > 0 && (
              <motion.div
                className="mt-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Lightbulb className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-white mb-2">Great Detective Work!</h4>
                <p className="text-white/80">
                  You've interviewed {interviewComplete?.length} / {witnesses?.length} witnesses. 
                  {interviewComplete?.length === witnesses?.length
                    ? " All interviews complete! Use your evidence in other tools."
                    : " Continue interviewing to gather more clues."
                  }
                </p>
              </motion.div>
            )}
          </div>
        ) : (
          /* Active Interview */
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWitness}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Witness Info */}
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-white/20">
                <div className="text-7xl">{currentWitnessData?.avatar}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{currentWitnessData?.name}</h3>
                  <p className="text-white/70 text-lg">{currentWitnessData?.role}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-white/60">
                    <MessageCircle className="w-4 h-4" />
                    <span>Question {currentQuestion + 1} of {currentWitnessData?.questions?.length}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentWitness(null);
                    setCurrentQuestion(0);
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ✕ End Interview
                </button>
              </div>

              {/* Question & Answer */}
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Your Question */}
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-blue-500 rounded-full p-2 mt-1">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-blue-200 text-sm mb-1">Your Question:</div>
                      <p className="text-white text-lg font-semibold">
                        {currentWitnessData?.questions?.[currentQuestion]?.q}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Witness Answer */}
                <motion.div
                  className="bg-orange-500/20 border border-orange-400/30 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-4xl">{currentWitnessData?.avatar}</div>
                    <div className="flex-1">
                      <div className="text-orange-200 text-sm mb-1">{currentWitnessData?.name}'s Answer:</div>
                      <p className="text-white text-lg leading-relaxed">
                        "{currentWitnessData?.questions?.[currentQuestion]?.a}"
                      </p>
                    </div>
                  </div>

                  {/* Clue Discovered */}
                  {currentWitnessData?.questions?.[currentQuestion]?.clue && (
                    <motion.div
                      className="mt-4 bg-green-500/20 border border-green-400/30 rounded-lg p-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex items-center gap-2 text-green-300 font-semibold mb-2">
                        <Lightbulb className="w-5 h-5" />
                        New Clue Discovered!
                      </div>
                      <p className="text-green-200 text-sm">
                        {currentWitnessData?.questions?.[currentQuestion]?.clue?.title}
                      </p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Next Button */}
                <motion.button
                  onClick={() => handleAskQuestion(currentWitnessData?.questions?.[currentQuestion])}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-orange-700 hover:to-red-700 transition-all flex items-center justify-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentQuestion < currentWitnessData?.questions?.length - 1 ? (
                    <>
                      Next Question
                      <ChevronRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Complete Interview
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {currentWitnessData?.questions?.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentQuestion ? 'bg-orange-400' : index < currentQuestion ? 'bg-green-400' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default InterviewRoom;

