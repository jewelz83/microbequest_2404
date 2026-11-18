import test from 'node:test';
import assert from 'node:assert/strict';
import {arenas,pulse,patrolWave,preparePatrol,aimPosition} from '../src/pages/germ-buster-tower-defense/patrol.mjs';
import {startCombat,fireCombat,stepCombat,advanceCombat} from '../src/services/germCombat.mjs';
test('patrol waves always include marked targets and residents with reachable positions',()=>{
 for(let wave=1;wave<=3;wave++){
  const actors=patrolWave(wave,()=>.5);assert.equal(actors.filter(a=>a.type==='bad').length,4);assert.equal(actors.filter(a=>a.type==='good').length,2);assert.equal(new Set(actors.map(a=>a.id)).size,6);assert.ok(actors.every(a=>a.y>=60&&a.y<=235));
 }
 assert.equal(aimPosition(195,0,390),400);assert.equal(aimPosition(-10,0,390),20);assert.equal(aimPosition(900,0,390),780);
});
test('fictional pulse costs resident safety only on resident hits, never on target hits',()=>{
 for(const type of ['bad','good']){
  const actor={...patrolWave(1)[0],type,points:type==='good'?-10:10,x:400,y:320,spawnDelay:0};let s=preparePatrol(startCombat(arenas[0],[actor]));s=fireCombat(s,pulse);const next=stepCombat(s,16,[pulse]);
  assert.equal(next.bacterialBalance,type==='good'?80:100);assert.equal(next.kills,type==='good'?0:1);assert.equal(next.score,type==='good'?0:10);assert.equal(next.waveReady,true);
 }
});
test('both arenas have three waves; no body-health or species-label objective is required',()=>{
 for(const arena of arenas){let s=preparePatrol(startCombat(arena,patrolWave(1)));assert.equal(s.totalWaves,3);assert.equal(s.selectedToolId,'pulse');
  for(let i=1;i<=3;i++){s={...s,waveReady:true,bacteria:[]};s=advanceCombat(s,patrolWave(i+1));}
  assert.equal(s.gameState,'victory');assert.equal(s.currentWave,3);
 }
});
test('selective pulses can finish all waves without resident damage, while escapes can end the mission',()=>{
 let s=preparePatrol(startCombat(arenas[0],[]));
 for(let wave=1;wave<=3;wave++){
  s={...s,bacteria:[{...patrolWave(wave)[0],x:400,y:320,spawnDelay:0}],cooldown:0,waveReady:false};
  s=stepCombat(fireCombat(s,pulse),16,[pulse]);assert.equal(s.waveReady,true);
  s=advanceCombat(s,patrolWave(wave+1));
 }
 assert.equal(s.gameState,'victory');assert.equal(s.bacterialBalance,100);assert.equal(s.kills,3);
 let lost=preparePatrol(startCombat(arenas[0],patrolWave(1)));lost={...lost,immuneHealth:15,bacteria:[{...lost.bacteria[0],x:825,spawnDelay:0}]};
 assert.equal(stepCombat(lost,100,[pulse]).gameState,'game-over');
});
