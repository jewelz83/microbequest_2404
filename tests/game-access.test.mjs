import test from 'node:test';
import assert from 'node:assert/strict';
import { canPlayMode, allowedDifficulties, permitsDifficulty, difficultyCeiling } from '../src/services/gameAccessPolicy.mjs';
test('disabled games and malformed permissions never permit play', () => {
  for (const controls of [null, {}, { allowedGameModes: [] }, { allowedGameModes: 'matching' }]) {
    assert.equal(canPlayMode(controls, 'matching'), false);
  }
  assert.equal(canPlayMode({ allowedGameModes: ['quiz'] }, 'matching'), false);
  assert.equal(canPlayMode({ allowedGameModes: ['quiz'] }, 'quiz'), true);
});
test('parent ceilings permit only levels at or below the saved ceiling', () => {
  assert.deepEqual(allowedDifficulties('easy'), ['easy']);
  assert.deepEqual(allowedDifficulties('medium'), ['easy', 'medium']);
  assert.deepEqual(allowedDifficulties('hard'), ['easy', 'medium', 'hard']);
  assert.equal(permitsDifficulty('hard', 'medium'), false);
  assert.equal(permitsDifficulty('medium', 'easy'), false);
  assert.equal(permitsDifficulty('unknown', 'hard'), false);
  for (const value of [undefined, null, '', 'expert']) {
    assert.equal(difficultyCeiling(value), 'easy');
    assert.equal(permitsDifficulty('medium', value), false);
  }
});
