import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Play, Lock, CheckCircle, Star, Clock, Users } from 'lucide-react';

const CaseSelectionBoard = ({ unlockedCases, completedCases, onSelectCase, onBack, playerStats }) => {
  const cases = [
    {
      id: 1,
      title: "The School Cafeteria Outbreak",
      difficulty: "Easy",
      location: "Lincoln Elementary School",
      victims: 15,
      timeframe: "Yesterday",
      description: "15 students got sick after eating lunch. Help Aunt Juju find the source!",
      suspect: "Food poisoning bacteria",
      clues: 5,
      points: 50,
      briefing: "Aunt Juju gets a call from the school principal. Something in the cafeteria made students sick!",
      image: "🏫",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 2,
      title: "The Mysterious Water Well",
      difficulty: "Easy-Medium",
      location: "Summer Camp Pine Valley",
      victims: 8,
      timeframe: "3 days ago",
      description: "Kids at summer camp got sick after drinking from the well. Test the water!",
      suspect: "Waterborne parasite",
      clues: 6,
      points: 75,
      briefing: "The camp director reports mysterious illnesses. Only kids who drank from the well are affected.",
      image: "🏕️",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 3,
      title: "Hospital Hand Sanitizer Failure",
      difficulty: "Medium",
      location: "City General Hospital",
      victims: 12,
      timeframe: "This week",
      description: "Patients getting infections despite hand sanitizer use. What\'s wrong?",
      suspect: "Resistant bacteria",
      clues: 7,
      points: 100,
      briefing: "Dr. Smith is puzzled - infections are rising despite strict hygiene protocols.",
      image: "🏥",
      color: "from-red-500 to-pink-600"
    },
    {
      id: 4,
      title: "The Moldy Building Mystery",
      difficulty: "Medium",
      location: "Riverside Middle School",
      victims: 20,
      timeframe: "Past month",
      description: "Students developing respiratory problems in an old building. Check the air!",
      suspect: "Fungal spores",
      clues: 8,
      points: 100,
      briefing: "The nurse reports increasing asthma attacks. Something in the building is making kids sick.",
      image: "🏢",
      color: "from-purple-500 to-violet-600"
    },
    {
      id: 5,
      title: "Food Festival Outbreak",
      difficulty: "Hard",
      location: "Downtown Food Festival",
      victims: 50,
      timeframe: "Last weekend",
      description: "Multiple vendors, multiple victims. Which food source caused the outbreak?",
      suspect: "Multiple culprits",
      clues: 10,
      points: 150,
      briefing: "The health department needs help - this is a complex multi-source outbreak!",
      image: "🎪",
      color: "from-orange-500 to-red-600"
    },
    {
      id: 6,
      title: "The Antibiotic Mystery",
      difficulty: "Hard",
      location: "Metro Medical Center",
      victims: 3,
      timeframe: "Ongoing",
      description: "Patient\'s infection not responding to treatment. Why aren\'t antibiotics working?",
      suspect: "Resistant superbug",
      clues: 9,
      points: 200,
      briefing: "A serious case - we need to understand why standard treatments are failing.",
      image: "💊",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-200';
      case 'Easy-Medium': return 'bg-yellow-500/20 text-yellow-200';
      case 'Medium': return 'bg-orange-500/20 text-orange-200';
      case 'Hard': return 'bg-red-500/20 text-red-200';
      default: return 'bg-gray-500/20 text-gray-200';
    }
  };

  const isUnlocked = (caseId) => unlockedCases?.includes(caseId);
  const isCompleted = (caseId) => completedCases?.includes(caseId);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-800 py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
              <span className="text-lg">Back to Home</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">🕵️‍♀️ Case Selection Board</h1>
              <p className="text-purple-200">Choose your investigation</p>
            </div>
            <div className="text-right text-white">
              <div className="text-sm opacity-80">Detective Stats</div>
              <div className="font-semibold">{completedCases?.length}/6 Cases Solved</div>
            </div>
          </div>
        </div>
      </div>
      {/* Cases Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {cases?.map((caseData, index) => (
            <motion.div
              key={caseData?.id}
              className={`relative overflow-hidden rounded-2xl border-2 ${
                isUnlocked(caseData?.id) 
                  ? 'border-white/20 bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/15' :'border-gray-500/30 bg-gray-800/30 cursor-not-allowed'
              } transition-all duration-300`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={isUnlocked(caseData?.id) ? { scale: 1.02, y: -5 } : {}}
            >
              {/* Case Header */}
              <div className={`bg-gradient-to-r ${caseData?.color} p-6 relative`}>
                <div className="absolute top-4 right-4">
                  {isCompleted(caseData?.id) ? (
                    <CheckCircle size={28} className="text-white" />
                  ) : !isUnlocked(caseData?.id) ? (
                    <Lock size={28} className="text-white/60" />
                  ) : (
                    <div className="w-7 h-7 border-2 border-white/40 rounded-full" />
                  )}
                </div>
                
                <div className="text-6xl mb-4">{caseData?.image}</div>
                <h3 className="text-xl font-bold text-white mb-2">{caseData?.title}</h3>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(caseData?.difficulty)}`}>
                  <Star size={12} />
                  {caseData?.difficulty}
                </div>
              </div>

              {/* Case Details */}
              <div className="p-6 space-y-4">
                <p className="text-white/90 leading-relaxed">{caseData?.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-blue-200">
                    <Users size={16} />
                    <span>{caseData?.victims} affected</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-200">
                    <Clock size={16} />
                    <span>{caseData?.timeframe}</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-white/60 mb-1">Location</div>
                  <div className="text-white font-medium">{caseData?.location}</div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-white/60 mb-1">Suspected Culprit</div>
                  <div className="text-yellow-200 font-medium">{caseData?.suspect}</div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">{caseData?.clues} clues to find</span>
                  <span className="text-green-300 font-semibold">{caseData?.points} points</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => isUnlocked(caseData?.id) && onSelectCase(caseData)}
                  disabled={!isUnlocked(caseData?.id)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    isUnlocked(caseData?.id)
                      ? isCompleted(caseData?.id)
                        ? 'bg-green-600/80 text-white hover:bg-green-600' :'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' :'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {!isUnlocked(caseData?.id) ? (
                    <>
                      <Lock size={20} />
                      Locked
                    </>
                  ) : isCompleted(caseData?.id) ? (
                    <>
                      <CheckCircle size={20} />
                      Replay Case
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      Start Investigation
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Summary */}
        <motion.div 
          className="mt-12 max-w-4xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Detective Progress</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{completedCases?.length}</div>
                <div className="text-white/80">Cases Solved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{playerStats?.totalPoints}</div>
                <div className="text-white/80">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{playerStats?.badgesEarned?.length}</div>
                <div className="text-white/80">Badges Earned</div>
              </div>
            </div>

            {playerStats?.badgesEarned?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="text-center text-white/80 mb-3">Latest Badges</div>
                <div className="flex justify-center flex-wrap gap-2">
                  {playerStats?.badgesEarned?.slice(-5)?.map((badge, index) => (
                    <div key={index} className="bg-yellow-500/20 text-yellow-200 px-3 py-1 rounded-full text-sm border border-yellow-400/30">
                      🏆 {badge}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CaseSelectionBoard;