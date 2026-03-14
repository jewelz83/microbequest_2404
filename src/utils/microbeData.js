// Comprehensive microbe data with fun facts and detailed information
export const microbeDatabase = {
  // Soil Environment Microbes
  'soil-1': {
    id: 'soil-1',
    name: 'Bacillus subtilis',
    type: 'bacteria',
    environment: 'soil',
    position: { x: 25, y: 35 },
    funFact: "This amazing bacteria can survive in space! Bacillus subtilis forms protective spores that can endure extreme radiation, making it one of the toughest life forms on Earth.",
    description: "A rod-shaped bacterium commonly found in soil and plant environments. It's known for its ability to form endospores when conditions become harsh.",
    benefits: ["Helps break down organic matter", "Produces natural antibiotics", "Used in agriculture as biocontrol agent"],
    size: "2-4 micrometers",
    habitat: "Soil, plant roots, and decomposing organic matter"
  },
  'soil-2': {
    id: 'soil-2',
    name: 'Mycorrhizal fungi',
    type: 'fungi',
    environment: 'soil',
    position: { x: 65, y: 55 },
    funFact: "These fungi create a 'wood wide web'! They connect plant roots underground, allowing trees to share nutrients and even send warning signals to each other about insect attacks.",
    description: "Beneficial fungi that form symbiotic relationships with plant roots, creating extensive underground networks.",
    benefits: ["Helps plants absorb water and nutrients", "Protects plants from diseases", "Improves soil structure"],
    size: "Networks can span entire forests",
    habitat: "Attached to plant roots in soil"
  },
  'soil-3': {
    id: 'soil-3',
    name: 'Soil amoeba',
    type: 'protozoa',
    environment: 'soil',
    position: { x: 45, y: 75 },
    funFact: "Soil amoebas are shape-shifting hunters! They can change their form completely to squeeze through tiny soil spaces while hunting bacteria and other prey.",
    description: "Single-celled organisms that move and feed using flexible extensions called pseudopodia.",
    benefits: ["Controls bacterial populations", "Releases nutrients for plants", "Improves soil food web"],
    size: "10-50 micrometers",
    habitat: "Moist soil and organic matter"
  },

  // Water Environment Microbes  
  'water-1': {
    id: 'water-1',
    name: 'E. coli',
    type: 'bacteria',
    environment: 'water',
    position: { x: 30, y: 25 },
    funFact: "Not all E. coli are harmful! Most strains live peacefully in your intestines and actually help produce vitamin K, which is essential for blood clotting.",
    description: "A common bacterium found in the intestines of humans and animals. While some strains can cause illness, most are harmless.",
    benefits: ["Produces vitamin K in gut", "Helps digest food", "Used in biotechnology research"],
    size: "2 micrometers long",
    habitat: "Intestines, water, and soil"
  },
  'water-2': {
    id: 'water-2',
    name: 'Paramecium',
    type: 'protozoa',
    environment: 'water',
    position: { x: 70, y: 45 },
    funFact: "Paramecia are natural vacuum cleaners! They have specialized 'mouth' structures that create whirlpools to suck in food particles, and they can eat up to 5,000 bacteria per day.",
    description: "Slipper-shaped, single-celled organisms covered in tiny hairs called cilia that help them swim and capture food.",
    benefits: ["Controls bacterial populations", "Food source for larger organisms", "Research model organism"],
    size: "50-300 micrometers",
    habitat: "Freshwater ponds, lakes, and streams"
  },
  'water-3': {
    id: 'water-3',
    name: 'Chlorella',
    type: 'algae',
    environment: 'water',
    position: { x: 50, y: 70 },
    funFact: "Chlorella is a nutritional powerhouse! This tiny algae contains more protein than beef and produces 20 times more oxygen per acre than trees. NASA even studied it as food for astronauts!",
    description: "Single-celled green algae that performs photosynthesis and is considered a superfood due to its high nutritional content.",
    benefits: ["Produces oxygen through photosynthesis", "Rich in proteins and vitamins", "Used as dietary supplement"],
    size: "2-10 micrometers",
    habitat: "Freshwater and marine environments"
  },

  // Body Environment Microbes
  'body-1': {
    id: 'body-1', 
    name: 'Lactobacillus',
    type: 'bacteria',
    environment: 'body',
    position: { x: 20, y: 30 },
    funFact: "Lactobacillus bacteria are nature's food preservers! They've been helping humans make yogurt, cheese, and fermented foods for thousands of years by producing lactic acid that prevents spoilage.",
    description: "Beneficial bacteria that live in the digestive system and help maintain gut health by producing lactic acid.",
    benefits: ["Aids digestion", "Boosts immune system", "Produces lactic acid", "Prevents harmful bacteria growth"],
    size: "0.5-1.2 micrometers",
    habitat: "Human gut, mouth, and fermented foods"
  },
  'body-2': {
    id: 'body-2',
    name: 'Common cold virus',
    type: 'virus',
    environment: 'body',
    position: { x: 60, y: 50 },
    funFact: "Cold viruses are master disguise artists! There are over 200 different types of cold viruses, and they constantly change their appearance, which is why you can catch multiple colds per year.",
    description: "Small infectious agents that cause the common cold by infecting cells in the nose and throat.",
    benefits: ["Helps strengthen immune system through exposure", "Drives medical research advances"],
    size: "20-300 nanometers (much smaller than bacteria)",
    habitat: "Respiratory tract of infected humans"
  },
  'body-3': {
    id: 'body-3',
    name: 'Gut bacteria',
    type: 'bacteria',
    environment: 'body',
    position: { x: 80, y: 70 },
    funFact: "Your gut bacteria are like a second brain! They produce neurotransmitters like serotonin (the happiness chemical) and can actually influence your mood, cravings, and behavior.",
    description: "Diverse collection of beneficial bacteria living in the human digestive system, forming the gut microbiome.",
    benefits: ["Aids food digestion", "Produces vitamins", "Protects against pathogens", "Supports immune system"],
    size: "Various sizes, typically 0.5-5 micrometers", 
    habitat: "Human large intestine and colon"
  }
};

// Helper function to get microbe by ID
export const getMicrobeById = (id) => {
  return microbeDatabase?.[id] || null;
};

// Helper function to get all microbes for an environment
export const getMicrobesByEnvironment = (environment) => {
  return Object.values(microbeDatabase)?.filter(microbe => microbe?.environment === environment);
};

// Helper function to get environment data structure for the exploration component
export const getEnvironmentData = () => {
  return {
    soil: {
      name: 'Soil Cross-Section',
      background: "https://images.unsplash.com/photo-1706225663100-1354e86470a2",
      backgroundAlt: 'High-resolution cross-section view of rich brown soil layers with visible organic matter, root systems and soil particles',
      layers: [
        { depth: '0-20%', color: 'bg-amber-800/20', name: 'Topsoil' },
        { depth: '20-60%', color: 'bg-orange-900/25', name: 'Subsoil' },
        { depth: '60-100%', color: 'bg-stone-800/30', name: 'Bedrock' }
      ],
      highlightedAreas: [
        {
          id: 'soil-organic-matter',
          name: 'Organic Matter Zone',
          description: 'Rich in decomposing materials where microbes thrive',
          x: 25, y: 40, width: 30, height: 20,
          color: 'bg-green-500/30',
          borderColor: 'border-green-400',
          icon: 'Leaf',
          hint: 'Bacteria love organic matter!'
        },
        {
          id: 'soil-root-zone',
          name: 'Root Zone',
          description: 'Area around plant roots where fungi form partnerships',
          x: 60, y: 50, width: 25, height: 25,
          color: 'bg-orange-500/30',
          borderColor: 'border-orange-400',
          icon: 'TreePine',
          hint: 'Fungi create networks with roots here!'
        },
        {
          id: 'soil-moisture-pocket',
          name: 'Moisture Pocket',
          description: 'Damp areas where protozoa hunt for prey',
          x: 40, y: 70, width: 20, height: 15,
          color: 'bg-blue-500/30',
          borderColor: 'border-blue-400',
          icon: 'Droplets',
          hint: 'Protozoa need moisture to survive!'
        }
      ],
      hiddenMicrobes: getMicrobesByEnvironment('soil')?.map(microbe => ({
        id: microbe?.id,
        x: microbe?.position?.x,
        y: microbe?.position?.y,
        type: microbe?.type,
        name: microbe?.name
      }))
    },
    water: {
      name: 'Water Droplet',
      background: "https://images.unsplash.com/photo-1602051261083-73f809d3f2c2",
      backgroundAlt: 'Ultra-clear water droplet with pristine transparency showing light refraction and microscopic detail',
      layers: [
        { depth: '0-30%', color: 'bg-blue-400/15', name: 'Surface Layer' },
        { depth: '30-70%', color: 'bg-blue-500/20', name: 'Middle Zone' },
        { depth: '70-100%', color: 'bg-blue-700/25', name: 'Deep Water' }
      ],
      highlightedAreas: [
        {
          id: 'water-surface-tension',
          name: 'Surface Tension Zone',
          description: 'Where bacteria cling to the water surface',
          x: 25, y: 20, width: 35, height: 15,
          color: 'bg-cyan-500/30',
          borderColor: 'border-cyan-400',
          icon: 'Waves',
          hint: 'Bacteria can float at the surface!'
        },
        {
          id: 'water-nutrient-rich',
          name: 'Nutrient-Rich Zone',
          description: 'Abundant food particles attract protozoa',
          x: 65, y: 40, width: 25, height: 20,
          color: 'bg-green-500/30',
          borderColor: 'border-green-400',
          icon: 'Sparkles',
          hint: 'Protozoa gather where food is plentiful!'
        },
        {
          id: 'water-photosynthesis',
          name: 'Light Zone',
          description: 'Bright area perfect for algae photosynthesis',
          x: 45, y: 65, width: 30, height: 20,
          color: 'bg-yellow-500/30',
          borderColor: 'border-yellow-400',
          icon: 'Sun',
          hint: 'Algae need sunlight to grow!'
        }
      ],
      hiddenMicrobes: getMicrobesByEnvironment('water')?.map(microbe => ({
        id: microbe?.id,
        x: microbe?.position?.x,
        y: microbe?.position?.y,
        type: microbe?.type,
        name: microbe?.name
      }))
    },
    body: {
      name: 'Human Body System',
      background: "https://images.unsplash.com/photo-1715523520522-27158f7d75de",
      backgroundAlt: 'Detailed anatomical illustration of human circulatory system with clearly defined blood vessels and organs',
      layers: [
        { depth: '0-25%', color: 'bg-red-400/15', name: 'Bloodstream' },
        { depth: '25-50%', color: 'bg-pink-500/20', name: 'Tissue' },
        { depth: '50-75%', color: 'bg-orange-600/18', name: 'Organs' },
        { depth: '75-100%', color: 'bg-yellow-700/20', name: 'Digestive System' }
      ],
      highlightedAreas: [
        {
          id: 'body-gut-microbiome',
          name: 'Gut Microbiome Hub',
          description: 'The intestinal tract where beneficial bacteria flourish',
          x: 75, y: 65, width: 20, height: 25,
          color: 'bg-green-500/40',
          borderColor: 'border-green-400',
          icon: 'Heart',
          hint: 'Your gut is home to trillions of helpful bacteria!',
          systemName: 'Digestive System'
        },
        {
          id: 'body-respiratory-tract',
          name: 'Respiratory Gateway',
          description: 'Airways where viruses often enter the body',
          x: 55, y: 35, width: 25, height: 20,
          color: 'bg-red-500/40',
          borderColor: 'border-red-400',
          icon: 'Wind',
          hint: 'Viruses love to travel through your nose and throat!',
          systemName: 'Respiratory System'
        },
        {
          id: 'body-probiotic-zone',
          name: 'Probiotic Sanctuary',
          description: 'Small intestine where lactobacillus helps digestion',
          x: 15, y: 25, width: 20, height: 20,
          color: 'bg-blue-500/40',
          borderColor: 'border-blue-400',
          icon: 'Shield',
          hint: 'Lactobacillus protects your digestive system!',
          systemName: 'Digestive System'
        },
        {
          id: 'body-immune-patrol',
          name: 'Immune Patrol Zone',
          description: 'Lymphatic areas where immune cells monitor for threats',
          x: 40, y: 55, width: 22, height: 18,
          color: 'bg-purple-500/40',
          borderColor: 'border-purple-400',
          icon: 'Shield',
          hint: 'Your immune system is always on guard!',
          systemName: 'Immune System'
        },
        {
          id: 'body-circulation-highway',
          name: 'Circulation Highway',
          description: 'Blood vessels where microbes can travel throughout the body',
          x: 30, y: 10, width: 35, height: 15,
          color: 'bg-red-500/30',
          borderColor: 'border-red-400',
          icon: 'Activity',
          hint: 'Blood carries both nutrients and sometimes unwanted visitors!',
          systemName: 'Circulatory System'
        }
      ],
      hiddenMicrobes: getMicrobesByEnvironment('body')?.map(microbe => ({
        id: microbe?.id,
        x: microbe?.position?.x,
        y: microbe?.position?.y,
        type: microbe?.type,
        name: microbe?.name
      }))
    }
  };
};