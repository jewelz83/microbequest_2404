import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Microscope, Beaker, Zap, Eye, TrendingUp } from 'lucide-react';

const ToolEvolution = ({ isOpen, onClose, currentEra }) => {
  const [selectedTool, setSelectedTool] = useState(0);

  const tools = [
    {
      id: 'microscope-simple',
      name: 'Simple Microscope',
      era: 'Discovery Era (1670s)',
      inventor: 'Antonie van Leeuwenhoek',
      icon: '🔬',
      magnification: '200x',
      description: 'A single lens microscope that could magnify up to 270 times. Leeuwenhoek ground his own lenses by hand to achieve unprecedented clarity.',
      innovation: 'First tool to reveal the microscopic world',
      limitations: [
        'Required very bright light',
        'Only one lens - limited magnification',
        'Difficult to use - needed steady hand',
        'Small viewing area'
      ],
      funFacts: [
        'Made over 500 microscopes but never sold a single one',
        'His lenses were so good that scientists couldn\'t replicate them for 150 years',
        'Kept his lens-making technique secret his entire life'
      ],
      image: '🔍'
    },
    {
      id: 'microscope-compound',
      name: 'Compound Microscope',
      era: 'Germ Theory Era (1850s)',
      inventor: 'Multiple inventors',
      icon: '🔬',
      magnification: '1000x',
      description: 'Uses multiple lenses to achieve higher magnification. The objective lens and eyepiece work together to magnify the image in stages.',
      innovation: 'Much higher magnification revealed bacterial details',
      limitations: [
        'Chromatic aberration (colored halos)',
        'Required careful alignment',
        'Expensive to manufacture',
        'Still needed good lighting'
      ],
      funFacts: [
        'Allowed scientists to see individual bacteria clearly',
        'Made Pasteur and Koch\'s discoveries possible',
        'Basic design still used in schools today'
      ],
      image: '🔬'
    },
    {
      id: 'microscope-electron',
      name: 'Electron Microscope',
      era: 'Golden Age (1930s)',
      inventor: 'Ernst Ruska',
      icon: '⚡',
      magnification: '1,000,000x',
      description: 'Uses beams of electrons instead of light to achieve incredible magnification. Can see individual viruses and even large molecules.',
      innovation: 'First time scientists could see viruses',
      limitations: [
        'Extremely expensive',
        'Samples must be dead (vacuum required)',
        'Images are black and white',
        'Requires extensive training to operate'
      ],
      funFacts: [
        'Can magnify up to 50 million times!',
        'Ruska won the Nobel Prize for this invention',
        'Made studying viruses possible for the first time',
        'Uses magnets instead of glass lenses'
      ],
      image: '⚡'
    },
    {
      id: 'culture-techniques',
      name: 'Culture Techniques',
      era: 'Germ Theory Era (1880s)',
      inventor: 'Robert Koch',
      icon: '🧫',
      magnification: 'N/A',
      description: 'Methods to grow bacteria in pure cultures. Koch developed solid media using gelatin and later agar, allowing bacteria to grow in isolated colonies.',
      innovation: 'Could grow and study single bacterial species',
      limitations: [
        'Some bacteria won\'t grow in lab',
        'Takes time (days to weeks)',
        'Risk of contamination',
        'Not all microbes can be cultured'
      ],
      funFacts: [
        'Agar comes from seaweed!',
        'Koch\'s assistant suggested using agar after seeing his wife make jam',
        'About 99% of bacteria in nature can\'t be cultured in labs',
        'Petri dishes are named after Julius Petri, Koch\'s assistant'
      ],
      image: '🧫'
    },
    {
      id: 'staining',
      name: 'Gram Staining',
      era: 'Germ Theory Era (1884)',
      inventor: 'Hans Christian Gram',
      icon: '🎨',
      magnification: 'N/A',
      description: 'A staining technique that colors bacteria purple or pink based on their cell wall structure, dividing bacteria into Gram-positive and Gram-negative groups.',
      innovation: 'Quick way to classify and identify bacteria',
      limitations: [
        'Doesn\'t work on all bacteria',
        'Technique sensitive - easy to mess up',
        'Only shows two categories',
        'Can\'t identify specific species'
      ],
      funFacts: [
        'Gram discovered it by accident while developing a staining method',
        'Still used in hospitals every day, over 140 years later',
        'The difference is in the thickness of the bacterial cell wall',
        'Purple = thick wall, Pink = thin wall'
      ],
      image: '🎨'
    },
    {
      id: 'pcr',
      name: 'PCR Machine',
      era: 'Molecular Era (1983)',
      inventor: 'Kary Mullis',
      icon: '🧬',
      magnification: 'N/A',
      description: 'Polymerase Chain Reaction - copies DNA millions of times in hours. Uses heating and cooling cycles to amplify specific DNA sequences.',
      innovation: 'Can study tiny amounts of DNA',
      limitations: [
        'Needs to know what DNA to look for',
        'Can amplify contamination',
        'Doesn\'t work on damaged DNA',
        'Can be expensive per test'
      ],
      funFacts: [
        'Mullis got the idea while driving on a California highway',
        'Won the Nobel Prize in 1993',
        'Used for everything from crime scene analysis to dinosaur DNA',
        'COVID tests use PCR technology!',
        'Can copy a single DNA molecule to a billion copies overnight'
      ],
      image: '🧬'
    },
    {
      id: 'dna-sequencing',
      name: 'DNA Sequencer',
      era: 'Modern Era (1990s-Present)',
      inventor: 'Multiple scientists',
      icon: '💻',
      magnification: 'N/A',
      description: 'Reads the exact order of DNA letters (A, T, C, G) in a genome. Modern machines can sequence entire bacterial genomes in hours.',
      innovation: 'Can read the complete genetic code',
      limitations: [
        'Very expensive equipment',
        'Generates huge amounts of data',
        'Requires powerful computers',
        'Complex data analysis needed'
      ],
      funFacts: [
        'The Human Genome Project took 13 years and $3 billion',
        'Today we can sequence a human genome in a day for $1000',
        'Has identified thousands of new bacterial species',
        'Helps track disease outbreaks in real-time',
        'Discovered bacteria that can only live in extreme environments'
      ],
      image: '💻'
    },
    {
      id: 'crispr',
      name: 'CRISPR Technology',
      era: 'Modern Era (2012)',
      inventor: 'Doudna & Charpentier',
      icon: '✂️',
      magnification: 'N/A',
      description: 'Molecular scissors that can cut and edit DNA with precision. Discovered by studying how bacteria defend against viruses.',
      innovation: 'Can edit genes like editing a document',
      limitations: [
        'Ethical concerns about gene editing',
        'Can have off-target effects',
        'Long-term effects unknown',
        'Expensive for therapies',
        'Not perfected yet for all applications'
      ],
      funFacts: [
        'CRISPR came from studying bacteria!',
        'Bacteria use it as an immune system against viruses',
        'Won the Nobel Prize in 2020',
        'Could cure genetic diseases in the future',
        'Being tested to fight cancer and HIV'
      ],
      image: '✂️'
    },
    {
      id: 'ai-microscopy',
      name: 'AI-Enhanced Microscopy',
      era: 'Future Era (2020s)',
      inventor: 'Various research teams',
      icon: '🤖',
      magnification: 'Variable',
      description: 'Artificial intelligence helps microscopes identify and count bacteria automatically, analyze images, and even predict bacterial behavior.',
      innovation: 'Combines computer power with microscopy',
      limitations: [
        'Requires training data',
        'Can make mistakes',
        'Needs human oversight',
        'Technology still developing'
      ],
      funFacts: [
        'AI can identify bacteria faster than human experts',
        'Can analyze thousands of images per minute',
        'Helps predict antibiotic resistance',
        'Used to discover new microbes automatically',
        'May revolutionize medical diagnostics'
      ],
      image: '🤖'
    }
  ];

  const currentTool = tools?.[selectedTool];

  const nextTool = () => {
    setSelectedTool((prev) => (prev + 1) % tools?.length);
  };

  const prevTool = () => {
    setSelectedTool((prev) => (prev - 1 + tools?.length) % tools?.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-5xl bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e?.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Microscope className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Tool Evolution</h2>
            </div>
            <p className="text-white/80 text-lg">
              Explore how microbiology tools evolved from simple lenses to AI-powered systems
            </p>
          </div>

          {/* Timeline Navigation */}
          <div className="bg-white/5 border-b border-white/10 p-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <button
                onClick={prevTool}
                className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <div className="flex items-center gap-2 overflow-x-auto px-4">
                {tools?.map((tool, index) => (
                  <button
                    key={tool?.id}
                    onClick={() => setSelectedTool(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                      index === selectedTool
                        ? 'bg-white text-purple-900' :'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {tool?.icon} {tool?.name?.split(' ')?.[0]}
                  </button>
                ))}
              </div>

              <button
                onClick={nextTool}
                className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Tool Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTool}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 max-h-[600px] overflow-y-auto"
            >
              {/* Tool Header */}
              <div className="text-center mb-8">
                <div className="text-8xl mb-4">{currentTool?.image}</div>
                <h3 className="text-4xl font-bold text-white mb-2">{currentTool?.name}</h3>
                <p className="text-xl text-purple-200 mb-3">{currentTool?.era}</p>
                <p className="text-white/70">Developed by: {currentTool?.inventor}</p>
                {currentTool?.magnification !== 'N/A' && (
                  <div className="mt-3 inline-block bg-green-500/20 border border-green-400/30 rounded-full px-6 py-2">
                    <span className="text-green-300 font-bold">
                      Magnification: {currentTool?.magnification}
                    </span>
                  </div>
                )}
              </div>

              {/* Tool Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Description */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-300" />
                    How It Works
                  </h4>
                  <p className="text-white/80 leading-relaxed">{currentTool?.description}</p>
                </div>

                {/* Innovation */}
                <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-300" />
                    Key Innovation
                  </h4>
                  <p className="text-green-200 leading-relaxed font-semibold">
                    {currentTool?.innovation}
                  </p>
                </div>

                {/* Limitations */}
                <div className="bg-orange-500/10 border border-orange-400/30 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-300" />
                    Limitations
                  </h4>
                  <ul className="space-y-2">
                    {currentTool?.limitations?.map((limitation, index) => (
                      <li key={index} className="text-orange-200 text-sm flex items-start gap-2">
                        <span className="text-orange-400">•</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fun Facts */}
                <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-purple-300" />
                    Fun Facts
                  </h4>
                  <ul className="space-y-2">
                    {currentTool?.funFacts?.map((fact, index) => (
                      <li key={index} className="text-purple-200 text-sm flex items-start gap-2">
                        <span className="text-purple-400">★</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-6 py-3">
                  <span className="text-white/60 text-sm">
                    Tool {selectedTool + 1} of {tools?.length}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60 text-sm">
                    {Math.round(((selectedTool + 1) / tools?.length) * 100)}% explored
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="bg-gradient-to-r from-indigo-800/50 to-purple-800/50 p-6 text-center border-t border-white/10">
            <p className="text-white/70 mb-3">
              Each tool opened new doors to understanding the microscopic world!
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={prevTool}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={nextTool}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ToolEvolution;