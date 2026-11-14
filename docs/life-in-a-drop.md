# Life in a Drop first playable chapter

The November 10 Connected Worlds Adventure Plan supersedes the Germ Buster shooting/patrol concept. This first pond chapter implements exploration, two organism encounters and a microscopy connection. Mouth, gut, illness and timeline redesigns are future work. The quiz remains unchanged for feedback.

## Active behavior
- /life-in-a-drop is the canonical route. The former /germ-buster-tower-defense route renders the same adventure for old links. Both retain the existing tower_defense parent permission/time gate; its parent-facing label is Life in a Drop. No permission values, backend configuration, account persistence or billing logic change.
- A fictional craft travels through an illustrated pond with a submerged leaf. Mouse movement steers continuously within a dead-zone camera, arrows/WASD and direction buttons provide direct steering, and a click/tap sets a destination. Velocity and heading ease through acceleration, turns and stopping on animation frames. Manual steering takes over optional neighbor assistance. The craft cruises above the leaf rather than treating it as a collision wall. Routes and the craft are navigation devices, not biological behavior.
- Paramecium and a representative photosynthetic Euglena move near different habitat landmarks. Arriving beside a model opens its close-up immediately. This records proximity, not a measure of attention. Opening its cilia/flagellum view records the corresponding action in session notes. Both notes reveal a connection invitation, not a mastery award or unlock gate on other games.
- Structure selection highlights the matching structure in both the live-world drawing and close-up. Reference Paramecium micrograph is explicitly distinguished from animated drawings, with original credit/source/CC BY-SA 3.0 terms. Existing image bytes are unchanged. No real Euglena micrograph is claimed.
- Pause, journal, restart confirmation and leaving the document stop the simulation. Notes pause the scene and return to the same position. Restart confirms and clears only this session. No scores, fake awards, analytics, AI tutor, paid gate or automatic game-score writes.
- Structures animation can be disabled and follows reduced-motion preference. Follow buttons and directional controls provide alternatives to precise pointer navigation. Full nonvisual play and physical-touch device behavior remain unvalidated.

## Scientific boundaries
Models exaggerate scale/structures, use artificial routes/timing, and do not simulate light response, food uptake, fluid dynamics or identification of unknown specimens. Food-garden particles are illustrative, not sample results. Cilia/flagella explanations refer to living organisms; these animations are teaching examples. The Euglena drawing represents one photosynthetic form; its short flagellum is omitted explicitly. No inference of harmfulness is made from color/shape.

Sources reviewed November 14 2026:
- https://openstax.org/books/biology-2e/pages/23-3-groups-of-protists
- https://milnepublishing.geneseo.edu/botany/chapter/euglena/ (structure and diversity)
- src/pages/microscope-discovery-lab/micrographs.mjs and public/assets/micrographs/LICENSE.md for prepared reference imagery.
- MicrobeQuest_Connected_Worlds_Adventure_Plan.docx, November 10, attached by Julianne for this work.

## Verification
Unit tests cover leaf-safe route planning, encounter reachability, note gating/deduplication, pause/reset, manual takeover and camera/world bounds. Compilation is separate from hosted UI testing. Science/art editorial review, enjoyment/pacing with children, physical devices and broader accessibility remain before release. No production deployment or backend changes are authorized by this prototype.


## Navigation and leaf encounter follow-up
The leaf reveals magnified bacterial patches and branching fungal threads when the craft enters its neighborhood. Cruising near either patch changes the in-scene explanation; no modal or forced next action opens. One leaf visit note and two optional movement-structure notes form the three available notes. A leaf navigation button is an alternative to mouse/keyboard steering. The drawings are generic teaching examples, not species identification, measured growth or a validated decomposition simulation.

Leaf science reference: USGS, Scientists Start at the Base of the Food Chain to Understand Contaminant Affects on Energy Cycling in Streams, https://www.usgs.gov/programs/environmental-health-program/science/scientists-start-base-food-chain-understand .
