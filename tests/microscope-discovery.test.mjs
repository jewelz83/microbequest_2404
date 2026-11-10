import test from 'node:test';
import assert from 'node:assert/strict';
import {micrographs,specimenIntroductions} from '../src/pages/microscope-discovery-lab/micrographs.mjs';
import {slides,movementObserved,movementFeedback} from '../src/pages/microscope-discovery-lab/discovery.mjs';
test('movement discovery requires observations from both specimens',()=>{
 assert.equal(movementObserved(['paramecium:cilia']),false);
 assert.equal(movementObserved(['bacteria:flagella']),false);
 assert.equal(movementObserved(['paramecium:cilia','bacteria:flagella']),true);
 assert.equal(movementObserved(['paramecium:nucleus','bacteria:wall']),false);
 assert.equal(new Set(slides.map(s=>s.id)).size,4);
 for(const s of slides) assert.equal(new Set(s.features.map(f=>f[0])).size,3);
 assert.match(movementFeedback('same'),/number and length/);
 assert.match(movementFeedback('different'),/does not demonstrate movement/);
});

test('every specimen has context, attribution and only bounded photo regions',()=>{
 for(const slide of slides){
  const m=micrographs[slide.id],intro=specimenIntroductions[slide.id];
  assert.ok(intro.what && intro.where && intro.why && intro.task);
  assert.ok(m.source.startsWith('https://') && m.credit && m.license);
  for(const [id,box] of Object.entries(m.regions)){
   assert.ok(slide.features.some(f=>f[0]===id));
   const [x,y,rx,ry]=box; assert.ok(x-rx>=0 && x+rx<=100 && y-ry>=0 && y+ry<=100);
  }
 }
 assert.equal(micrographs.bacteria.regions.dna,undefined);
 assert.equal(micrographs.virus.regions.rna,undefined);
 assert.equal(micrographs.paramecium.regions.nucleus,undefined);
});
