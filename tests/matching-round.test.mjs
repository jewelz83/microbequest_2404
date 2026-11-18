import test from 'node:test';
import assert from 'node:assert/strict';
import {makeDeck,newRound,matchingReducer,pairFeedback,specimens} from '../src/pages/microbe-matching-game/matching.mjs';
const select=(s,id)=>matchingReducer(s,{type:'select',id});
test('decks contain exactly two cards per specimen, respect parent ceiling and keep clue mode balanced',()=>{
 for(const mode of ['pictures','clues'])for(const ceiling of ['easy','medium','hard','unknown']){
  const deck=makeDeck(mode,4,ceiling,()=>.2),count=['medium','hard'].includes(ceiling)?4:3;
  assert.equal(deck.length,count*2);assert.equal(new Set(deck.map(c=>c.id)).size,deck.length);
  for(const s of specimens.slice(0,count)){const pair=deck.filter(c=>c.specimen===s.id);assert.equal(pair.length,2);assert.equal(pair.filter(c=>c.kind==='clue').length,mode==='clues'?1:0);}
 }
});
test('duplicate, invalid and rapid third selections cannot corrupt the pending pair',()=>{
 let s=newRound(makeDeck());const a=s.deck[0];
 assert.equal(select(s,'bad-id'),s);s=select(s,a.id);assert.equal(select(s,a.id),s);
 const b=s.deck.find(c=>c.specimen!==a.specimen);s=select(s,b.id);
 assert.equal(s.attempts,1);assert.equal(s.result.match,false);assert.equal(select(s,s.deck.find(c=>!s.selected.includes(c.id)).id),s);
 assert.equal(s.matched.length,0);s=matchingReducer(s,{type:'advance',result:s.result});assert.deepEqual(s.selected,[]);assert.equal(s.result,null);
});
test('pause retains the current pair; reset discards it without delayed callbacks',()=>{
 let s=newRound(makeDeck('clues'));s=select(s,s.deck[0].id);s=matchingReducer(s,{type:'pause'});
 assert.equal(select(s,s.deck[1].id),s);assert.equal(matchingReducer(s,{type:'advance',result:s.result}),s);
 s=matchingReducer(s,{type:'pause'});assert.equal(s.selected.length,1);
 s=select(s,s.deck[1].id);s=matchingReducer(s,{type:'reset',deck:makeDeck()});assert.equal(s.attempts,0);assert.deepEqual(s.selected,[]);assert.equal(s.result,null);
});
test('each pair is counted once and completion follows automatic pair resolution',()=>{
 let s=newRound(makeDeck('clues'));
 for(const specimen of specimens.slice(0,3)){
  const pair=s.deck.filter(c=>c.specimen===specimen.id);s=select(select(s,pair[0].id),pair[1].id);
  assert.equal(s.result.match,true);assert.equal(select(s,pair[0].id),s);assert.equal(s.complete,false);
  assert.match(pairFeedback(s.result,'clues'),/fits this clue/);s=matchingReducer(s,{type:'advance',result:s.result});
 }
 assert.equal(s.complete,true);assert.equal(s.attempts,3);assert.equal(s.matched.length,6);assert.equal(matchingReducer(s,{type:'pause'}),s);assert.equal(select(s,s.deck[0].id),s);
});
test('unsuccessful pairs explain both examples instead of grading memory as science',()=>{
 for(const mode of ['pictures','clues'])for(const a of specimens)for(const b of specimens.filter(s=>s.id!==a.id)){
  const text=pairFeedback({match:false,first:a.id,second:b.id},mode);assert.ok(text.includes(a.name)&&text.includes(b.name));assert.ok(text.includes(a.notice)&&text.includes(b.notice));
 }
});

test('old pair callbacks cannot clear a new-round pair or a later pair',()=>{
 let s=newRound(makeDeck());s=select(select(s,s.deck[0].id),s.deck[1].id);const old=s.result;
 s=matchingReducer(s,{type:'reset',deck:makeDeck()});s=select(select(s,s.deck[0].id),s.deck[1].id);
 assert.equal(matchingReducer(s,{type:'advance',result:old}),s);
 const recent=s.result;s=matchingReducer(s,{type:'advance',result:recent});
 assert.equal(s.feedback,recent);assert.equal(s.result,null);assert.deepEqual(s.selected,[]);
 assert.equal(matchingReducer(s,{type:'advance',result:recent}),s);
});

test('pause freezes a pending automatic resolution and resume resolves the same pair once',()=>{
 let s=newRound(makeDeck());const pair=s.deck.filter(c=>c.specimen===s.deck[0].specimen);
 s=select(select(s,pair[0].id),pair[1].id);const result=s.result;
 s=matchingReducer(s,{type:'pause'});assert.equal(matchingReducer(s,{type:'advance',result}),s);
 s=matchingReducer(s,{type:'pause'});s=matchingReducer(s,{type:'advance',result});
 assert.equal(s.result,null);assert.equal(s.matched.length,2);assert.equal(s.attempts,1);
 assert.equal(matchingReducer(s,{type:'advance',result}),s);
});
