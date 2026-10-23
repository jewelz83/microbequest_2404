import test from 'node:test';
import assert from 'node:assert/strict';
import { quizMetrics } from '../src/services/quizMetrics.mjs';
test('quiz progress starts at zero and includes the answered current question',()=>{
 assert.deepEqual(quizMetrics({totalQuestions:8}),{progress:0,accuracy:0,scorePercentage:0});
 assert.equal(quizMetrics({totalQuestions:8,answeredQuestions:1,correctAnswers:1}).accuracy,100);
});
test('weighted question points never inflate answer accuracy',()=>{
 const result=quizMetrics({totalQuestions:8,answeredQuestions:4,correctAnswers:3,score:50,maxScore:120});
 assert.equal(result.accuracy,75);assert.equal(result.progress,50);assert.equal(result.scorePercentage,42);
});
test('full weighted quiz and empty quiz have bounded results',()=>{
 assert.deepEqual(quizMetrics({totalQuestions:8,answeredQuestions:8,correctAnswers:8,score:120,maxScore:120}),{progress:100,accuracy:100,scorePercentage:100});
 assert.equal(quizMetrics({score:10}).scorePercentage,0);
});
