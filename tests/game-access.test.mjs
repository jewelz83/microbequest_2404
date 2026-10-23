import test from 'node:test';
import assert from 'node:assert/strict';
import { canPlayMode } from '../src/services/gameAccessPolicy.mjs';
test('disabled games and malformed permissions never permit play', () => {
  for (const controls of [null, {}, { allowedGameModes: [] }, { allowedGameModes: 'matching' }]) {
    assert.equal(canPlayMode(controls, 'matching'), false);
  }
  assert.equal(canPlayMode({ allowedGameModes: ['quiz'] }, 'matching'), false);
  assert.equal(canPlayMode({ allowedGameModes: ['quiz'] }, 'quiz'), true);
});
