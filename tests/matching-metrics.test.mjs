import test from 'node:test';
import assert from 'node:assert/strict';
import { matchingMetrics } from '../src/services/matchingMetrics.mjs';
test('one successful pair from two flips is 100% efficient, not 500%', () => {
  const result = matchingMetrics({ matchedPairs:1, totalPairs:6, moves:2 });
  assert.equal(result.efficiencyPercent,100);
  assert.equal(result.progressPercent,17);
});
test('missed pairs reduce efficiency without inflating completion', () => {
  const result = matchingMetrics({ matchedPairs:1,totalPairs:6,moves:4 });
  assert.equal(result.efficiencyPercent,50);
  assert.equal(result.progressPercent,17);
});
test('every supported board reaches 100% completion independently of points', () => {
  for (const totalPairs of [6,8,12]) {
    const result = matchingMetrics({matchedPairs:totalPairs,totalPairs,moves:totalPairs*2});
    assert.equal(result.progressPercent,100);
    assert.equal(result.efficiencyPercent,100);
  }
});
test('new or reset boards have zero completion and efficiency', () => {
  assert.deepEqual(matchingMetrics({totalPairs:6}),{matchedPairs:0,totalPairs:6,progressPercent:0,efficiencyPercent:0});
});
test('invalid and inconsistent counters never produce NaN or percentages outside 0–100', () => {
  for (const data of [{}, {matchedPairs:NaN,totalPairs:6,moves:0}, {matchedPairs:12,totalPairs:6,moves:1}, {matchedPairs:-1,totalPairs:0,moves:-2}]) {
    const r=matchingMetrics(data);
    assert.ok(r.progressPercent>=0 && r.progressPercent<=100);
    assert.ok(r.efficiencyPercent>=0 && r.efficiencyPercent<=100);
  }
});
