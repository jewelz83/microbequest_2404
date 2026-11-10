import test from 'node:test';
import assert from 'node:assert/strict';
import {habitats,cluesReady,fieldFeedback} from '../src/pages/world-explorer-mode/fieldwork.mjs';
import {micrographs} from '../src/pages/microscope-discovery-lab/micrographs.mjs';
test('field reflection needs every distinct clue, in any order',()=>{
 for(const habitat of habitats){
  const ids=habitat.clues.map(c=>c.id);
  assert.equal(cluesReady(habitat),false);
  assert.equal(cluesReady(habitat,[ids[0],ids[0],ids[1]]),false);
  assert.equal(cluesReady(habitat,[...ids].reverse()),true);
  assert.equal(cluesReady(habitat,['unknown',ids[0],ids[1]]),false);
 }
});
test('each habitat has a supported explanation, distinct misconception feedback and attributed reference image',()=>{
 assert.equal(new Set(habitats.map(h=>h.id)).size,3);
 for(const habitat of habitats){
  assert.equal(habitat.options.filter(o=>o.id==='supported').length,1);
  assert.equal(new Set(habitat.options.map(o=>o.feedback)).size,3);
  for(const option of habitat.options) assert.ok(fieldFeedback(habitat,option.id).length>80);
  assert.equal(fieldFeedback(habitat,'unknown'),'');
  assert.ok(micrographs[habitat.specimen].source);
  assert.ok(habitat.career && habitat.wonder);
 }
});
