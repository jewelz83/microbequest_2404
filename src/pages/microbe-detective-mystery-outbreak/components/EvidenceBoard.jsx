import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Users, AlertCircle, CheckCircle, Sparkles, Eye } from 'lucide-react';

const EvidenceBoard = ({ selectedCase, collectedClues, onClueFound, onSwitchTool }) => {
  const [hoveredClue, setHoveredClue] = useState(null);
  const [revealingClue, setRevealingClue] = useState(null);

  // Unsplash images by clue type
  const clueImages = {
    location: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
    timeline: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80',
    witness: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
    symptom: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    evidence: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&q=80',
  };

  // Case-specific images for richer visuals
  const caseImages = {
    // Case 1 - Cafeteria
    'cafeteria-1': 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&q=80',
    'cafeteria-2': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80',
    'cafeteria-3': 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&q=80',
    'cafeteria-4': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    'cafeteria-5': 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&q=80',
    // Case 2 - Water Well
    'well-1': 'https://images.unsplash.com/photo-1543674892-7d64d45df18b?w=400&q=80',
    'well-2': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80',
    'well-3': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
    'well-4': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    'well-5': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&q=80',
    'well-6': 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80',
    // Case 3 - Hospital
    'hospital-1': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80',
    'hospital-2': 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80',
    'hospital-3': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
    'hospital-4': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    'hospital-5': 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&q=80',
    'hospital-6': 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&q=80',
    'hospital-7': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80',
    // Case 4 - Mold
    'mold-1': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    'mold-2': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80',
    'mold-3': 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=400&q=80',
    'mold-4': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    'mold-5': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&q=80',
    'mold-6': 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80',
    'mold-7': 'https://images.unsplash.com/photo-1558618047-3f0e6afbc4d2?w=400&q=80',
    'mold-8': 'https://images.unsplash.com/photo-1597738928789-5e5dab79c4c9?w=400&q=80',
    // Case 5 - Food Festival
    'festival-1': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
    'festival-2': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80',
    'festival-3': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80',
    'festival-4': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    'festival-5': 'https://images.unsplash.com/photo-1448907503123-67254d59ca4f?w=400&q=80',
    'festival-6': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    'festival-7': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80',
    'festival-8': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80',
    'festival-9': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
    'festival-10': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
    // Case 6 - Antibiotic Resistance
    'antibiotic-1': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80',
    'antibiotic-2': 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80',
    'antibiotic-3': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
    'antibiotic-4': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    'antibiotic-5': 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&q=80',
    'antibiotic-6': 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&q=80',
    'antibiotic-7': 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=400&q=80',
    'antibiotic-8': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80',
    'antibiotic-9': 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&q=80',
  };

  const getClueImage = (clue) => caseImages[clue?.id] || clueImages[clue?.type] || clueImages.evidence;

  // Generate clues based on case
  const getCaseClues = () => {
    const cluesByCase = {
      1: [ // School Cafeteria
        {
          id: 'cafeteria-1',
          type: 'location',
          title: 'Cafeteria Kitchen',
          description: 'The chicken salad was prepared at 10 AM and left at room temperature until lunch at 12:30 PM.',
          icon: MapPin,
          color: 'blue',
          hint: 'Food safety rules require cold foods stay below 40°F'
        },
        {
          id: 'cafeteria-2',
          type: 'timeline',
          title: 'Illness Timeline',
          description: 'Students became sick 2-4 hours after eating lunch. Classic timing for bacterial food poisoning.',
          icon: Clock,
          color: 'purple',
          hint: 'Quick onset suggests bacterial toxins'
        },
        {
          id: 'cafeteria-3',
          type: 'witness',
          title: 'Cafeteria Worker Interview',
          description: 'Cook admits cutting raw chicken on same board as vegetables without washing in between.',
          icon: Users,
          color: 'orange',
          hint: 'Cross-contamination is a major food safety issue'
        },
        {
          id: 'cafeteria-4',
          type: 'symptom',
          title: 'Student Symptoms',
          description: 'All sick students report stomach pain, nausea, and diarrhea. No respiratory symptoms.',
          icon: AlertCircle,
          color: 'red',
          hint: 'Gastrointestinal symptoms point to food poisoning'
        },
        {
          id: 'cafeteria-5',
          type: 'evidence',
          title: 'Food Sample Results',
          description: 'Lab tests show high levels of Salmonella bacteria in chicken salad samples.',
          icon: Search,
          color: 'green',
          hint: 'Laboratory confirmation is crucial for diagnosis'
        }
      ],
      2: [ // Water Well
        {
          id: 'well-1',
          type: 'location',
          title: 'Well Inspection',
          description: 'Well cap is cracked and damaged. Recent heavy rains caused flooding near the well.',
          icon: MapPin,
          color: 'blue',
          hint: 'Surface water contamination from runoff'
        },
        {
          id: 'well-2',
          type: 'timeline',
          title: 'Illness Pattern',
          description: 'Only campers who drank from the well got sick. Bottled water drinkers remained healthy.',
          icon: Clock,
          color: 'purple',
          hint: 'Clear correlation between water source and illness'
        },
        {
          id: 'well-3',
          type: 'witness',
          title: 'Camp Director Report',
          description: 'Heavy rain three days ago. Farmers use fertilizer in nearby fields.',
          icon: Users,
          color: 'orange',
          hint: 'Agricultural runoff can contaminate water'
        },
        {
          id: 'well-4',
          type: 'symptom',
          title: 'Camper Symptoms',
          description: 'Severe diarrhea, stomach cramps, and dehydration. Some cases very serious.',
          icon: AlertCircle,
          color: 'red',
          hint: 'Waterborne parasites cause severe GI symptoms'
        },
        {
          id: 'well-5',
          type: 'evidence',
          title: 'Water Test Results',
          description: 'Microscopy reveals Giardia parasites and E. coli bacteria in water samples.',
          icon: Search,
          color: 'green',
          hint: 'Multiple contaminants from surface water'
        },
        {
          id: 'well-6',
          type: 'evidence',
          title: 'Additional Finding',
          description: 'Turbidity test shows water is cloudy with sediment particles.',
          icon: Search,
          color: 'green',
          hint: 'Physical evidence of contamination'
        }
      ],
      3: [ // Hospital
        {
          id: 'hospital-1',
          type: 'location',
          title: 'Hand Sanitizer Station',
          description: 'Dispensers are mostly empty. Staff reports they run out frequently.',
          icon: MapPin,
          color: 'blue',
          hint: 'Insufficient sanitizer use allows bacteria spread'
        },
        {
          id: 'hospital-2',
          type: 'timeline',
          title: 'Infection Trend',
          description: 'Infections increased after hospital switched to cheaper sanitizer brand 2 months ago.',
          icon: Clock,
          color: 'purple',
          hint: 'Product change correlates with outbreak'
        },
        {
          id: 'hospital-3',
          type: 'witness',
          title: 'Dr. Smith Interview',
          description: 'Noticed staff rushing between patients without proper hand hygiene time.',
          icon: Users,
          color: 'orange',
          hint: 'Time pressure affects safety protocols'
        },
        {
          id: 'hospital-4',
          type: 'symptom',
          title: 'Patient Infections',
          description: 'Surgical site infections with pus, redness, and fever. Same bacteria strain in multiple patients.',
          icon: AlertCircle,
          color: 'red',
          hint: 'Hospital-acquired infection pattern'
        },
        {
          id: 'hospital-5',
          type: 'evidence',
          title: 'Sanitizer Test',
          description: 'Cheaper brand only 50% alcohol (need 60%+). Also expired 6 months ago.',
          icon: Search,
          color: 'green',
          hint: 'Product ineffectiveness identified'
        },
        {
          id: 'hospital-6',
          type: 'evidence',
          title: 'Bacteria Culture',
          description: 'MRSA (Methicillin-resistant Staphylococcus aureus) identified in patient samples.',
          icon: Search,
          color: 'green',
          hint: 'Resistant bacteria requires extra precautions'
        },
        {
          id: 'hospital-7',
          type: 'evidence',
          title: 'Environmental Swabs',
          description: 'MRSA found on door handles and bed rails near affected patients.',
          icon: Search,
          color: 'green',
          hint: 'Environmental contamination spreading infection'
        }
      ],
      4: [ // Moldy Building
        {
          id: 'mold-1',
          type: 'location',
          title: 'Ceiling Investigation',
          description: 'Water-damaged ceiling tiles in Rooms 203 and 205. Visible dark spots.',
          icon: MapPin,
          color: 'blue',
          hint: 'Water damage creates mold growth conditions'
        },
        {
          id: 'mold-2',
          type: 'timeline',
          title: 'Problem Timeline',
          description: 'Pipe burst last month. Tiles replaced but problems started 2 weeks later.',
          icon: Clock,
          color: 'purple',
          hint: 'Mold takes time to grow and release spores'
        },
        {
          id: 'mold-3',
          type: 'witness',
          title: 'School Nurse Report',
          description: 'Students in affected rooms having asthma attacks. Students in other rooms are fine.',
          icon: Users,
          color: 'orange',
          hint: 'Localized health effects suggest environmental cause'
        },
        {
          id: 'mold-4',
          type: 'symptom',
          title: 'Student Health Pattern',
          description: 'Coughing, wheezing, stuffy nose, watery eyes. Worse during class time.',
          icon: AlertCircle,
          color: 'red',
          hint: 'Respiratory and allergic symptoms from air quality'
        },
        {
          id: 'mold-5',
          type: 'evidence',
          title: 'Air Quality Test',
          description: 'Elevated mold spore counts in affected classrooms. Mostly Aspergillus and Stachybotrys species.',
          icon: Search,
          color: 'green',
          hint: 'Laboratory confirms fungal contamination'
        },
        {
          id: 'mold-6',
          type: 'evidence',
          title: 'Moisture Reading',
          description: 'Hidden moisture detected in wall cavity behind water-damaged area.',
          icon: Search,
          color: 'green',
          hint: 'Source of ongoing mold growth identified'
        },
        {
          id: 'mold-7',
          type: 'evidence',
          title: 'HVAC Inspection',
          description: 'Air conditioning system spreading spores from affected rooms to other areas.',
          icon: Search,
          color: 'green',
          hint: 'Distribution system needs attention'
        },
        {
          id: 'mold-8',
          type: 'evidence',
          title: 'Black Mold Sample',
          description: 'Toxic black mold (Stachybotrys chartarum) found behind damaged tiles.',
          icon: Search,
          color: 'green',
          hint: 'Most dangerous type of mold identified'
        }
      ],
      5: [ // Food Festival
        {
          id: 'festival-1',
          type: 'location',
          title: 'Vendor Map',
          description: '12 different food vendors. Most victims ate at Vendors 3, 7, and 9.',
          icon: MapPin,
          color: 'blue',
          hint: 'Pattern analysis reveals problem vendors'
        },
        {
          id: 'festival-2',
          type: 'timeline',
          title: 'Illness Patterns',
          description: 'Some victims sick in 4 hours (bacterial toxin), others in 24 hours (bacterial infection).',
          icon: Clock,
          color: 'purple',
          hint: 'Different onset times suggest multiple organisms'
        },
        {
          id: 'festival-3',
          type: 'witness',
          title: 'Health Inspector Notes',
          description: 'Hot dog vendor (3) had no thermometer. Salad vendor (7) had unrefrigerated mayonnaise.',
          icon: Users,
          color: 'orange',
          hint: 'Multiple food safety violations found'
        },
        {
          id: 'festival-4',
          type: 'symptom',
          title: 'Victim Symptom Chart',
          description: 'Vendor 3 victims: vomiting. Vendor 7 victims: diarrhea. Vendor 9 victims: both.',
          icon: AlertCircle,
          color: 'red',
          hint: 'Symptom patterns help identify different microbes'
        },
        {
          id: 'festival-5',
          type: 'evidence',
          title: 'Hot Dog Sample',
          description: 'Staphylococcus aureus found in hot dogs from Vendor 3. Dogs were undercooked.',
          icon: Search,
          color: 'green',
          hint: 'Temperature abuse allowed bacterial growth'
        },
        {
          id: 'festival-6',
          type: 'evidence',
          title: 'Potato Salad Sample',
          description: 'Salmonella in Vendor 7 potato salad. Made with raw eggs, unrefrigerated.',
          icon: Search,
          color: 'green',
          hint: 'Mayonnaise-based salads need refrigeration'
        },
        {
          id: 'festival-7',
          type: 'evidence',
          title: 'Ice Cream Sample',
          description: 'Vendor 9 ice cream contained Listeria. Freezer temperature was too warm.',
          icon: Search,
          color: 'green',
          hint: 'Even frozen foods need proper temperature'
        },
        {
          id: 'festival-8',
          type: 'evidence',
          title: 'Hand Washing Station',
          description: 'Vendor 9 had no hand washing facilities. Worker handles money and food.',
          icon: Search,
          color: 'green',
          hint: 'Cross-contamination from poor hygiene'
        },
        {
          id: 'festival-9',
          type: 'witness',
          title: 'Food Handler Interview',
          description: 'Vendor 3 worker admits being sick with stomach flu but needed the money.',
          icon: Users,
          color: 'orange',
          hint: 'Ill food handlers spread disease'
        },
        {
          id: 'festival-10',
          type: 'evidence',
          title: 'Environmental Temperatures',
          description: 'Festival was on a hot day (95°F). Many foods sat in sun without ice.',
          icon: Search,
          color: 'green',
          hint: 'Environmental factors affect food safety'
        }
      ],
      6: [ // Antibiotic Resistance
        {
          id: 'antibiotic-1',
          type: 'location',
          title: 'Patient History',
          description: 'Patient previously hospitalized 3 times in past year. Multiple antibiotic courses.',
          icon: MapPin,
          color: 'blue',
          hint: 'Frequent antibiotic exposure breeds resistance'
        },
        {
          id: 'antibiotic-2',
          type: 'timeline',
          title: 'Treatment Timeline',
          description: 'Day 1-3: standard antibiotic (penicillin). No improvement. Day 4: switched medications.',
          icon: Clock,
          color: 'purple',
          hint: 'Resistance evident when treatment fails'
        },
        {
          id: 'antibiotic-3',
          type: 'witness',
          title: 'Doctor Interview',
          description: 'Patient admits not finishing previous antibiotic prescriptions. Took until felt better.',
          icon: Users,
          color: 'orange',
          hint: 'Incomplete treatment allows resistance to develop'
        },
        {
          id: 'antibiotic-4',
          type: 'symptom',
          title: 'Patient Condition',
          description: 'Worsening infection with fever, spreading rash, and elevated white blood cells.',
          icon: AlertCircle,
          color: 'red',
          hint: 'Untreated infection progressing dangerously'
        },
        {
          id: 'antibiotic-5',
          type: 'evidence',
          title: 'Culture Results',
          description: 'MRSA (Methicillin-Resistant Staphylococcus aureus) identified.',
          icon: Search,
          color: 'green',
          hint: 'Superbug resistant to common antibiotics'
        },
        {
          id: 'antibiotic-6',
          type: 'evidence',
          title: 'Sensitivity Testing',
          description: 'Bacteria resistant to penicillin, methicillin, and cephalosporins. Sensitive to vancomycin.',
          icon: Search,
          color: 'green',
          hint: 'Testing finds effective alternative treatment'
        },
        {
          id: 'antibiotic-7',
          type: 'evidence',
          title: 'Genetic Analysis',
          description: 'Bacteria has mecA gene - makes proteins that resist beta-lactam antibiotics.',
          icon: Search,
          color: 'green',
          hint: 'Genetic mutation causes resistance'
        },
        {
          id: 'antibiotic-8',
          type: 'evidence',
          title: 'Hospital Records',
          description: 'Same MRSA strain detected in 5 other patients. Outbreak in ICU.',
          icon: Search,
          color: 'green',
          hint: 'Resistant bacteria spreading in hospital'
        },
        {
          id: 'antibiotic-9',
          type: 'witness',
          title: 'Pharmacy Consult',
          description: 'Pharmacist notes patient\'s past antibiotics were appropriate but not completed.',
          icon: Users,
          color: 'orange',
          hint: 'Patient education is crucial for prevention'
        }
      ]
    };

    return cluesByCase?.[selectedCase?.id] || cluesByCase[1];
  };

  const allClues = getCaseClues();
  const isClueCollected = (clueId) => collectedClues?.some(c => c?.id === clueId);

  const handleClueClick = (clue) => {
    if (isClueCollected(clue?.id)) return;
    
    setRevealingClue(clue);
    setTimeout(() => {
      onClueFound(clue);
      setRevealingClue(null);
    }, 2000);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500/20 border-blue-400/30 text-blue-200',
      purple: 'bg-purple-500/20 border-purple-400/30 text-purple-200',
      orange: 'bg-orange-500/20 border-orange-400/30 text-orange-200',
      red: 'bg-red-500/20 border-red-400/30 text-red-200',
      green: 'bg-green-500/20 border-green-400/30 text-green-200'
    };
    return colors?.[color] || colors?.blue;
  };

  const getGlowColor = (color) => {
    const glows = {
      blue: 'shadow-blue-500/50',
      purple: 'shadow-purple-500/50',
      orange: 'shadow-orange-500/50',
      red: 'shadow-red-500/50',
      green: 'shadow-green-500/50'
    };
    return glows?.[color] || glows?.blue;
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/50 to-blue-900/50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="inline-flex items-center gap-3 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-4">
            <Search className="w-6 h-6 text-blue-300" />
            <h2 className="text-2xl font-bold text-white">Evidence Board</h2>
          </div>
          <p className="text-white/80 max-w-2xl mx-auto">
            Click on areas to gather clues. Each clue brings you closer to identifying the outbreak source!
          </p>
          <div className="mt-4 text-lg font-semibold text-blue-300">
            Clues Found: {collectedClues?.length} / {allClues?.length}
          </div>
        </motion.div>

        {/* Clues Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {allClues?.map((clue, index) => {
            const collected = isClueCollected(clue?.id);
            const revealing = revealingClue?.id === clue?.id;
            const IconComponent = clue?.icon;

            return (
              <motion.div
                key={clue?.id}
                className={`relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-300 ${
                  collected 
                    ? getColorClasses(clue?.color) + ' ' + getGlowColor(clue?.color) + ' shadow-lg'
                    : 'bg-slate-800/50 border-slate-600/50 hover:border-white/30 hover:bg-slate-700/50'
                }`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: collected ? 1 : 1.03, y: collected ? 0 : -4 }}
                onClick={() => !collected && handleClueClick(clue)}
                onMouseEnter={() => setHoveredClue(clue?.id)}
                onMouseLeave={() => setHoveredClue(null)}
              >
                {/* Image Header */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={getClueImage(clue)}
                    alt={clue?.title}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      collected ? 'opacity-90 scale-100' : 'opacity-30 scale-110 blur-sm grayscale'
                    }`}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Type badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs uppercase tracking-wider font-bold px-2 py-1 rounded-full
                      ${collected ? 'bg-white/20 text-white' : 'bg-black/40 text-white/60'}`}>
                      {clue?.type}
                    </span>
                  </div>

                  {/* Collection Badge */}
                  {collected && (
                    <motion.div
                      className="absolute top-3 right-3 bg-green-500 rounded-full p-1.5 shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}

                  {/* Lock icon for uncollected */}
                  {!collected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-3">
                        <Search className="w-8 h-8 text-white/70" />
                      </div>
                    </div>
                  )}

                  {/* Icon bottom left */}
                  <div className="absolute bottom-3 left-3">
                    <div className={`p-2 rounded-lg ${collected ? 'bg-white/20' : 'bg-black/40'}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Revealing Animation */}
                  {revealing && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-yellow-500/30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Sparkles className="w-12 h-12 text-yellow-300" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-base mb-2">{clue?.title}</h3>

                  {collected ? (
                    <>
                      <p className="text-white/90 text-sm leading-relaxed mb-3">
                        {clue?.description}
                      </p>
                      {clue?.hint && (
                        <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Eye className="w-4 h-4 text-yellow-300 mt-0.5 flex-shrink-0" />
                            <p className="text-yellow-200 text-xs">{clue?.hint}</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Search className="w-4 h-4" />
                        <span>Click to investigate this clue</span>
                      </div>
                      {hoveredClue === clue?.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-white/50 italic"
                        >
                          {clue?.type?.toUpperCase()} evidence available...
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Next Steps */}
        {collectedClues?.length > 0 && (
          <motion.div
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 rounded-xl p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Investigation Progress
            </h3>
            <p className="text-white/80 mb-4">
              Great work, Detective! You've collected {collectedClues?.length} clues. 
              {collectedClues?.length >= 3 
                ? " You have enough evidence to analyze in the Digital Lab!"
                : ` Find ${Math.min(3 - collectedClues?.length, allClues?.length - collectedClues?.length)} more clues to proceed.`
              }
            </p>
            
            {collectedClues?.length >= 3 && (
              <button
                onClick={() => onSwitchTool('lab')}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Analyze Evidence in Lab
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EvidenceBoard;
