import test from 'node:test';
import assert from 'node:assert/strict';
import {slides,movementObserved,movementFeedback} from '../src/pages/microscope-discovery-lab/discovery.mjs';
test('movement discovery requires observations from both specimens',()=>{
 assert.equal(movementObserved(['paramecium:cilia']),false);
 assert.equal(movementObserved(['bacteria:flagella']),false);
 assert.equal(movementObserved(['paramecium:cilia','bacteria:flagella']),true);
 assert.equal(movementObserved(['paramecium:nucleus','bacteria:wall']),false);
 assert.equal(new Set(slides.map(s=>s.id)).size,4);
 for(const s of slides) assert.equal(new Set(s.features.map(f=>f[0])).size,3);
 assert.match(movementFeedback('same'),/number and length/);
 assert.match(movementFeedback('different'),/not proof/);
});
