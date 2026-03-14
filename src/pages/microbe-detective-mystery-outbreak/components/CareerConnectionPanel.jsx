import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Heart, TrendingUp, ChevronLeft, Sparkles, Microscope } from 'lucide-react';

const CareerConnectionPanel = ({ onBack, playerStats }) => {
  const [selectedCareer, setSelectedCareer] = useState(null);

  const careers = [
    {
      id: 'epidemiologist',
      title: 'Epidemiologist',
      icon: '🔬',
      tagline: 'Disease Detective & Outbreak Investigator',
      description: 'Epidemiologists are the real-life disease detectives! They investigate outbreaks, track diseases, and figure out how illnesses spread through communities.',
      dayInLife: [
        'Analyze disease patterns and outbreak data',
        'Interview patients and collect samples',
        'Work with labs to identify disease causes',
        'Develop strategies to stop disease spread',
        'Write reports and recommend public health policies'
      ],
      education: [
        'Bachelor\'s degree in biology, health science, or related field',
        'Master\'s in Public Health (MPH) or Epidemiology',
        'Optional: Doctoral degree (PhD) for research positions',
        'Training in statistics and data analysis'
      ],
      skills: [
        'Strong analytical and problem-solving abilities',
        'Detail-oriented and organized',
        'Good communication and writing skills',
        'Computer skills for data analysis',
        'Ability to work under pressure during outbreaks'
      ],
      salary: '$50,000 - $120,000+ per year',
      outlook: 'Growing field with increasing demand',
      coolFacts: [
        'Helped stop Ebola outbreaks in Africa',
        'Track everything from flu to food poisoning',
        'Work for CDC, WHO, or local health departments',
        'Can work internationally during global health emergencies'
      ],
      relatedTo: 'This is what Aunt Juju does! She investigates disease outbreaks just like you did in this game.'
    },
    {
      id: 'microbiologist',
      title: 'Microbiologist',
      icon: '🦠',
      tagline: 'Studying the Tiny World of Microbes',
      description: 'Microbiologists study bacteria, viruses, fungi, and parasites. They work in labs discovering new microbes, testing treatments, and understanding how tiny organisms affect our world.',
      dayInLife: [
        'Grow and study microbes in laboratory',
        'Use microscopes and advanced equipment',
        'Test how microbes respond to drugs',
        'Conduct experiments and document findings',
        'Collaborate with other scientists'
      ],
      education: [
        'Bachelor\'s degree in microbiology or biology',
        'Often need Master\'s or PhD for research',
        'Laboratory technique training',
        'Continuous learning about new discoveries'
      ],
      skills: [
        'Precision and attention to detail',
        'Patience for careful experiments',
        'Strong science and math background',
        'Computer skills for data analysis',
        'Curiosity and love of discovery'
      ],
      salary: '$45,000 - $100,000+ per year',
      outlook: 'Steady growth, especially in medical and pharmaceutical fields',
      coolFacts: [
        'Discover new antibiotics and vaccines',
        'Study microbes that can clean up oil spills',
        'Work in hospitals, research labs, or food safety',
        'Some microbiologists even study microbes in space!'
      ],
      relatedTo: 'You used microbiology skills when you identified microbes in the Digital Lab!'
    },
    {
      id: 'food-safety',
      title: 'Food Safety Specialist',
      icon: '🍽️',
      tagline: 'Protecting People Through Safe Food',
      description: 'Food safety specialists make sure our food is safe to eat. They inspect restaurants, investigate foodborne illness outbreaks, and teach people about safe food handling.',
      dayInLife: [
        'Inspect restaurants, cafeterias, and food facilities',
        'Check food temperatures and storage conditions',
        'Investigate food poisoning outbreaks',
        'Educate food handlers on safety practices',
        'Test food samples for contamination'
      ],
      education: [
        'Bachelor\'s degree in food science, public health, or biology',
        'Food Safety certification (ServSafe, CP-FS)',
        'On-the-job training in inspection procedures',
        'Continuing education on food safety regulations'
      ],
      skills: [
        'Knowledge of food science and microbiology',
        'Good communication and teaching abilities',
        'Attention to detail',
        'Ability to enforce regulations tactfully',
        'Problem-solving when outbreaks occur'
      ],
      salary: '$40,000 - $85,000 per year',
      outlook: 'Steady demand as food safety remains a priority',
      coolFacts: [
        'Prevent hundreds of foodborne illnesses',
        'Work for health departments, FDA, or USDA',
        'Travel to different restaurants and facilities',
        'Help develop food safety policies and regulations'
      ],
      relatedTo: 'Remember the cafeteria case? That\'s exactly what food safety specialists investigate!'
    },
    {
      id: 'public-health',
      title: 'Public Health Nurse',
      icon: '💉',
      tagline: 'Healthcare for Entire Communities',
      description: 'Public health nurses focus on preventing disease and promoting health in communities. They run vaccination clinics, teach health classes, and respond to health emergencies.',
      dayInLife: [
        'Run immunization and health screening clinics',
        'Teach health education classes in schools',
        'Visit patients at home for care',
        'Respond to disease outbreaks',
        'Coordinate community health programs'
      ],
      education: [
        'Nursing degree (Associate or Bachelor\'s)',
        'Pass nursing license exam (NCLEX)',
        'Optional: Bachelor of Science in Nursing (BSN)',
        'Some get Master\'s in Public Health'
      ],
      skills: [
        'Compassion and caring for others',
        'Strong communication skills',
        'Organizational abilities',
        'Cultural sensitivity',
        'Teaching and leadership skills'
      ],
      salary: '$50,000 - $95,000 per year',
      outlook: 'High demand, excellent job security',
      coolFacts: [
        'Work in schools, clinics, and community centers',
        'Help during disasters and emergencies',
        'Prevent disease through education and vaccines',
        'Make a difference in people\'s lives every day'
      ],
      relatedTo: 'School nurses and hospital nurses helped in many of your investigation cases!'
    },
    {
      id: 'environmental-health',
      title: 'Environmental Health Specialist',
      icon: '🌍',
      tagline: 'Protecting Health Through Clean Environments',
      description: 'These specialists investigate how our environment affects health. They test water quality, check air pollution, and make sure public places are safe and healthy.',
      dayInLife: [
        'Test water sources for contamination',
        'Inspect buildings for mold, lead, and hazards',
        'Monitor air quality',
        'Investigate environmental health complaints',
        'Educate public about environmental risks'
      ],
      education: [
        'Bachelor\'s in environmental health or science',
        'Professional certifications (REHS, NEHA)',
        'Training in testing and inspection methods',
        'Knowledge of environmental regulations'
      ],
      skills: [
        'Scientific knowledge of environmental factors',
        'Technical skills for testing equipment',
        'Problem-solving abilities',
        'Communication and report writing',
        'Physical ability for field work'
      ],
      salary: '$45,000 - $90,000 per year',
      outlook: 'Growing field as environmental concerns increase',
      coolFacts: [
        'Protect communities from lead poisoning',
        'Ensure water supplies are safe to drink',
        'Investigate mold problems in buildings',
        'Work outdoors and in various settings'
      ],
      relatedTo: 'The water well case and moldy building case? That\'s environmental health work!'
    },
    {
      id: 'infectious-disease',
      title: 'Infectious Disease Doctor',
      icon: '⚕️',
      tagline: 'Medical Expert in Fighting Infections',
      description: 'These specialized physicians diagnose and treat complex infections. They\'re experts in bacteria, viruses, parasites, and fungi, especially drug-resistant cases.',
      dayInLife: [
        'Examine patients with complicated infections',
        'Order and interpret lab tests',
        'Choose best antibiotics for each infection',
        'Consult with other doctors on difficult cases',
        'Stay updated on new diseases and treatments'
      ],
      education: [
        'Bachelor\'s degree (pre-med)',
        'Medical school (4 years) - MD or DO degree',
        'Residency in internal medicine (3 years)',
        'Fellowship in infectious diseases (2-3 years)',
        'Medical license and board certification'
      ],
      skills: [
        'Excellent diagnostic abilities',
        'Deep knowledge of microbiology',
        'Critical thinking and problem-solving',
        'Compassion for patients',
        'Commitment to lifelong learning'
      ],
      salary: '$200,000 - $350,000+ per year',
      outlook: 'Strong demand, especially after COVID-19',
      coolFacts: [
        'Treat antibiotic-resistant superbugs',
        'Help during epidemic and pandemic responses',
        'Travel internationally to fight disease outbreaks',
        'Discover and test new treatments'
      ],
      relatedTo: 'Doctors like Dr. Smith and Dr. Patel from your cases are infectious disease specialists!'
    }
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-teal-900 via-blue-900 to-purple-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-blue-800 py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
              <span className="text-lg">Back to Game</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                <Briefcase className="w-8 h-8" />
                Science Careers
              </h1>
              <p className="text-teal-200">Explore Your Future in Public Health</p>
            </div>
            <div className="text-right text-white">
              <div className="text-sm opacity-80">Your Progress</div>
              <div className="font-semibold">{playerStats?.casesCompleted} Cases Solved</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {!selectedCareer ? (
          /* Career Grid */
          <div>
            <motion.div 
              className="text-center mb-12"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="inline-flex items-center gap-3 bg-yellow-500/20 border border-yellow-400/30 rounded-full px-6 py-3 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <span className="text-yellow-200 font-semibold">Turn Your Detective Skills Into a Career!</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Real Careers in Public Health & Microbiology
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                The skills you used in this game - investigating outbreaks, identifying microbes, and solving problems - 
                are the same skills these professionals use every day to protect public health!
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {careers?.map((career, index) => (
                <motion.button
                  key={career?.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-left hover:bg-white/15 hover:border-white/30 transition-all group"
                  onClick={() => setSelectedCareer(career)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                    {career?.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{career?.title}</h3>
                  <p className="text-teal-200 text-sm mb-4 italic">{career?.tagline}</p>
                  <p className="text-white/70 text-sm mb-4 line-clamp-3">{career?.description}</p>
                  
                  <div className="flex items-center justify-end text-blue-300 font-semibold group-hover:gap-3 gap-2 transition-all">
                    <span>Learn More</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Educational Message */}
            <motion.div
              className="mt-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-start gap-4">
                <GraduationCap className="w-12 h-12 text-purple-300 flex-shrink-0" />
                <div>
                  <h4 className="text-2xl font-bold text-white mb-3">Start Your Journey Today!</h4>
                  <p className="text-white/90 mb-4">
                    You don't have to decide on a career now, but you can start preparing:
                  </p>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>Do well in science, math, and reading classes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>Join science clubs or health-related activities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>Volunteer at hospitals, clinics, or community health events</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>Stay curious and keep learning about science!</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Detailed Career View */
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCareer?.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-5xl mx-auto"
            >
              <button
                onClick={() => setSelectedCareer(null)}
                className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
              >
                <ChevronLeft size={20} />
                Back to Careers
              </button>

              {/* Career Header */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-8 mb-8">
                <div className="flex items-start gap-6">
                  <div className="text-8xl">{selectedCareer?.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-4xl font-bold text-white mb-2">{selectedCareer?.title}</h2>
                    <p className="text-2xl text-blue-200 italic mb-4">{selectedCareer?.tagline}</p>
                    <p className="text-white/90 text-lg leading-relaxed">{selectedCareer?.description}</p>
                    
                    {selectedCareer?.relatedTo && (
                      <div className="mt-6 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-1" />
                          <p className="text-yellow-200">{selectedCareer?.relatedTo}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Career Details Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Day in the Life */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Microscope className="w-6 h-6 text-teal-300" />
                    A Day in the Life
                  </h3>
                  <ul className="space-y-3">
                    {selectedCareer?.dayInLife?.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/80">
                        <span className="text-teal-400 font-bold">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Needed */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-green-300" />
                    Skills Needed
                  </h3>
                  <ul className="space-y-3">
                    {selectedCareer?.skills?.map((skill, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/80">
                        <span className="text-green-400">✓</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Education Path */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-purple-300" />
                    Education Path
                  </h3>
                  <ul className="space-y-3">
                    {selectedCareer?.education?.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/80">
                        <span className="text-purple-400 font-bold">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Career Facts */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Heart className="w-6 h-6 text-pink-300" />
                    Cool Facts
                  </h3>
                  <ul className="space-y-3 mb-4">
                    {selectedCareer?.coolFacts?.map((fact, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/80">
                        <span className="text-pink-400">★</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Salary & Outlook */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-2">💰 Salary Range</h4>
                  <p className="text-green-200 text-lg">{selectedCareer?.salary}</p>
                  <p className="text-white/60 text-sm mt-2">*Varies by experience, location, and employer</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-2">📈 Job Outlook</h4>
                  <p className="text-blue-200 text-lg">{selectedCareer?.outlook}</p>
                  <p className="text-white/60 text-sm mt-2">*Based on current trends and projections</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default CareerConnectionPanel;
