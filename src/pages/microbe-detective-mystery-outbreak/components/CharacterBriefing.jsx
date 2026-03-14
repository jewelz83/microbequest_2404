import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Users, MapPin, Clock, AlertTriangle } from 'lucide-react';
import CharacterSpriteSystem from '../../../components/ui/CharacterSpriteSystem';

const CharacterBriefing = ({ selectedCase, onStartInvestigation }) => {
  const [currentScene, setCurrentScene] = useState('aunt-juju');
  
  const getBriefingScenes = () => {
    switch (selectedCase?.id) {
      case 1:
        return {
          'aunt-juju': {
            character: 'Aunt Juju',
            characterType: 'aunt-juju',
            message: "Junior Detective, we've received an urgent call from Lincoln Elementary School. The principal reports that 15 students fell ill after eating lunch yesterday. This looks like a classic foodborne illness outbreak!",
            action: "Let's investigate this together. I'll guide you through proper epidemiological methods."
          },
          'charlie': {
            character: 'Charlie',
            characterType: 'charlie-zebra',
            message: "This case is un-ZEBRA-lievable! Food poisoning mysteries are tricky, but we've got this! I can already imagine those poor kids - we need to help them fast!",
            action: "Ready to be food safety detectives? Let's gallop into action!"
          },
          'scenario': {
            character: 'Case Details',
            avatar: '📋',
            message: "Yesterday at lunch, students ate chicken salad, fruit cups, and milk. Within hours, many developed stomach pain, fever, and diarrhea. The cafeteria staff is worried they did something wrong.",
            action: "Your mission: Find the source of contamination and prevent future outbreaks."
          }
        };
      case 2:
        return {
          'aunt-juju': {
            character: 'Aunt Juju',
            characterType: 'aunt-juju',
            message: "We have a waterborne outbreak at Summer Camp Pine Valley. Eight campers became ill, but here's the key clue - only those who drank from the camp well are affected. Campers who used bottled water are fine.",
            action: "Water contamination cases require careful testing. We need to examine the water source and trace the exposure pathway."
          },
          'charlie': {
            character: 'Charlie',
            characterType: 'charlie-zebra',
            message: "A water mystery at summer camp! This reminds me of those detective movies. The well water must have been contaminated somehow - but what could have gotten in there?",
            action: "Time to put on our detective hats and solve this aquatic mystery!"
          },
          'scenario': {
            character: 'Case Details',
            avatar: '📋',
            message: "The camp well has been used for years without problems. Recently, there was heavy rain and campers report the water tasted 'earthy.' Some campers have severe stomach upset and dehydration.",
            action: "Your mission: Test the water, identify the contaminant, and ensure safe drinking water."
          }
        };
      case 3:
        return {
          'aunt-juju': {
            character: 'Aunt Juju',
            characterType: 'aunt-juju',
            message: "This is a puzzling case at City General Hospital. Patients are developing infections despite the staff following hand hygiene protocols. Dr. Smith is concerned about antibiotic-resistant bacteria.",
            action: "Hospital outbreaks are serious. We need to investigate the hand sanitizer effectiveness and identify potential resistant organisms."
          },
          'charlie': {
            character: 'Charlie',
            characterType: 'charlie-zebra',
            message: "Wait, the hand sanitizer isn't working? That's like having a broken shield against germs! There must be something wrong with their hygiene systems.",
            action: "Let's figure out why their defenses are failing. Those patients need our help!"
          },
          'scenario': {
            character: 'Case Details',
            avatar: '📋',
            message: "Surgical patients are developing skin infections at their incision sites. The hospital has strict protocols, but infections are increasing. Staff report using hand sanitizer regularly.",
            action: "Your mission: Audit hygiene practices, test sanitizer effectiveness, and identify the bacterial culprit."
          }
        };
      case 4:
        return {
          'aunt-juju': {
            character: 'Aunt Juju',
            characterType: 'aunt-juju',
            message: "The school nurse at Riverside Middle School is reporting an increase in respiratory problems among students. They suspect it's related to the building environment - possibly mold growth after recent water damage.",
            action: "Environmental health investigations require us to test air quality and identify potential fungal contamination."
          },
          'charlie': {
            character: 'Charlie',
            characterType: 'charlie-zebra',
            message: "Mold mystery! I've heard that some molds can make people really sick, especially kids with asthma. We need to find these sneaky fungi before more students get affected!",
            action: "Time to become building inspectors and air quality detectives!"
          },
          'scenario': {
            character: 'Case Details',
            avatar: '📋',
            message: "After a pipe burst last month, some ceiling tiles got wet. Students in certain classrooms are coughing, wheezing, and some with asthma are having more attacks than usual.",
            action: "Your mission: Inspect the building, test air samples, and recommend remediation strategies."
          }
        };
      case 5:
        return {
          'aunt-juju': {
            character: 'Aunt Juju',
            characterType: 'aunt-juju',
            message: "This is a complex multi-vendor outbreak from the Downtown Food Festival. Over 50 people got sick, but they ate at different food stands. This suggests multiple contamination sources - a challenging investigation!",
            action: "Multi-source outbreaks require systematic investigation of each vendor and cross-referencing victim exposure patterns."
          },
          'charlie': {
            character: 'Charlie',
            characterType: 'charlie-zebra',
            message: "Wow, this is like solving multiple mysteries at once! Food festivals are supposed to be fun, not make people sick. We need to find all the bad vendors quickly!",
            action: "Ready for the ultimate food safety challenge? Let's investigate every vendor!"
          },
          'scenario': {
            character: 'Case Details',
            avatar: '📋',
            message: "Vendors sold hot dogs, salads, desserts, and beverages. Victims ate different combinations of foods. Some got sick within hours, others took a day or two. The health department needs urgent answers.",
            action: "Your mission: Map victim exposures, test food samples from each vendor, and identify all contamination sources."
          }
        };
      case 6:
        return {
          'aunt-juju': {
            character: 'Aunt Juju',
            characterType: 'aunt-juju',
            message: "This is a critical antibiotic resistance case at Metro Medical Center. A patient's serious bacterial infection isn't responding to standard antibiotic treatment. We need to understand why the medications are failing.",
            action: "Antibiotic resistance is a growing threat. We must identify the resistant organism and find alternative treatment options."
          },
          'charlie': {
            character: 'Charlie',
            characterType: 'charlie-zebra',
            message: "Antibiotic resistance sounds scary! It's like the bacteria have learned to fight back against medicine. We need to outsmart these super-germs and help the patient get better!",
            action: "This is serious detective work - let's solve this medical mystery!"
          },
          'scenario': {
            character: 'Case Details',
            avatar: '📋',
            message: "The patient has been taking the correct antibiotic dosage, but symptoms aren't improving after 3 days. Blood tests confirm bacterial infection. The medical team suspects resistant bacteria.",
            action: "Your mission: Identify the resistant bacteria strain, determine resistance mechanisms, and recommend alternative treatments."
          }
        };
      default:
        return {};
    }
  };

  const scenes = getBriefingScenes();
  const currentSceneData = scenes?.[currentScene];

  const sceneOrder = ['aunt-juju', 'charlie', 'scenario'];
  const currentIndex = sceneOrder?.indexOf(currentScene);

  const nextScene = () => {
    if (currentIndex < sceneOrder?.length - 1) {
      setCurrentScene(sceneOrder?.[currentIndex + 1]);
    }
  };

  const prevScene = () => {
    if (currentIndex > 0) {
      setCurrentScene(sceneOrder?.[currentIndex - 1]);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-6">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        
        {/* Briefing Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">🚨 Emergency Briefing</h2>
          <p className="text-purple-200">Get ready for your investigation, Detective!</p>
        </motion.div>

        {/* Main Briefing Area */}
        <motion.div 
          className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          
          {/* Character Speaking */}
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            
            {/* Character Avatar */}
            <motion.div 
              className="flex items-center justify-center"
              key={currentScene}
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {currentSceneData?.characterType ? (
                <CharacterSpriteSystem
                  character={currentSceneData?.characterType}
                  size="xlarge"
                  className="border-4 border-white/20 shadow-2xl"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-6xl border-4 border-white/20">
                  {currentSceneData?.avatar}
                </div>
              )}
            </motion.div>

            {/* Character Name */}
            <h3 className="text-2xl font-bold text-white">{currentSceneData?.character}</h3>

            {/* Message */}
            <motion.div 
              className="max-w-2xl"
              key={currentScene + '-message'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                "{currentSceneData?.message}"
              </p>
              
              {currentSceneData?.action && (
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
                  <p className="text-yellow-200 font-medium">{currentSceneData?.action}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevScene}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            >
              Previous
            </button>

            {/* Scene Indicators */}
            <div className="flex gap-2">
              {sceneOrder?.map((scene, index) => (
                <button
                  key={scene}
                  onClick={() => setCurrentScene(scene)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-purple-400' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {currentIndex < sceneOrder?.length - 1 ? (
              <button
                onClick={nextScene}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onStartInvestigation}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all flex items-center gap-2"
              >
                <Play size={20} />
                Begin Investigation
              </button>
            )}
          </div>
        </motion.div>

        {/* Case Quick Facts */}
        <motion.div 
          className="mt-6 grid md:grid-cols-4 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{selectedCase?.victims}</div>
            <div className="text-white/70 text-sm">People Affected</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
            <MapPin className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white truncate">{selectedCase?.location?.split(' ')?.[0]}</div>
            <div className="text-white/70 text-sm">Location</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
            <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{selectedCase?.timeframe}</div>
            <div className="text-white/70 text-sm">Timeline</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
            <AlertTriangle className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{selectedCase?.difficulty}</div>
            <div className="text-white/70 text-sm">Difficulty</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CharacterBriefing;