import test from 'node:test';
import assert from 'node:assert/strict';
import {packs,questionBank,getQuestions,newChallenge,challengeReducer} from '../src/pages/quiz-challenge-system/challenge.mjs';
const answer=(s,id)=>challengeReducer(s,{type:'answer',id});
test('each pack has three questions and optional medium question respects the parent ceiling',()=>{
 for(const pack of packs){
  assert.equal(getQuestions(pack.id,false,'hard').length,3);
  assert.equal(getQuestions(pack.id,true,'easy').length,3);
  assert.equal(getQuestions(pack.id,true,'medium').length,4);
  assert.equal(getQuestions(pack.id,true,'unknown').length,3);
 }
 for(const q of Object.values(questionBank)){
  assert.equal(q.options.filter(o=>o.id===q.correct).length,1);
  assert.equal(new Set(q.options.map(o=>o.id)).size,3);
  for(const o of q.options.filter(o=>o.id!==q.correct))assert.ok(o.feedback.length>60);
  assert.ok(q.hint&&q.explain&&q.success);
 }
});
test('wrong answers give another direct choice; duplicates and invalid answers do not count twice',()=>{
 let s=newChallenge(getQuestions('mix'));const q=s.questions[0],wrong=q.options.find(o=>o.id!==q.correct).id;
 assert.equal(answer(s,'unknown'),s);s=answer(s,wrong);assert.equal(s.result.correct,false);
 assert.equal(answer(s,wrong),s);assert.equal(s.index,0);
 assert.equal(challengeReducer(s,{type:'advance',result:s.result}),s);
 s=answer(s,q.correct);assert.equal(s.result.correct,true);assert.equal(s.attempts[q.id].length,2);assert.equal(answer(s,wrong),s);
});
test('only the current correct result can advance; stale callbacks cannot skip later questions or restarted rounds',()=>{
 let s=newChallenge(getQuestions('mix'));s=answer(s,s.questions[0].correct);const old=s.result;
 s=challengeReducer(s,{type:'advance',result:old});assert.equal(s.index,1);
 s=answer(s,s.questions[1].correct);assert.equal(challengeReducer(s,{type:'advance',result:old}),s);
 s=challengeReducer(s,{type:'reset',questions:getQuestions('mix')});s=answer(s,s.questions[0].correct);
 assert.equal(challengeReducer(s,{type:'advance',result:old}),s);
});
test('pause retains attempts and freezes automatic advancement; completion counts each question once',()=>{
 let s=newChallenge(getQuestions('detective',true,'medium'));
 for(const q of s.questions){
  s=answer(s,q.correct);const result=s.result;s=challengeReducer(s,{type:'pause'});
  assert.equal(challengeReducer(s,{type:'advance',result}),s);assert.equal(answer(s,q.correct),s);
  s=challengeReducer(s,{type:'pause'});s=challengeReducer(s,{type:'advance',result});
 }
 assert.equal(s.complete,true);assert.equal(Object.keys(s.attempts).length,4);
 assert.equal(challengeReducer(s,{type:'pause'}),s);assert.equal(answer(s,'unknown'),s);
 const reset=challengeReducer(s,{type:'reset',questions:getQuestions('mix')});assert.equal(reset.complete,false);assert.equal(reset.index,0);assert.deepEqual(reset.attempts,{});
});
