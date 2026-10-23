import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameProgressService } from '../src/services/gameProgressStore.mjs';

const consent = () => ({ progress_tracking_consent: true, consent_granted_at: '2026-10-01T00:00:00Z', consent_withdrawn_at: null });
const cacheKey = id => `microbequest_progress:v2:${id ? `user:${id}` : 'guest'}`;
function fixture() {
  const state = { id: null, consent: consent(), row: null, writes: [], rows: [], consentError: false, progressError: false };
  const values = new Map();
  const storage = { getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, v), removeItem: k => values.delete(k) };
  const client = {
    auth: { async getSession() {
      if (state.sessionError) throw new Error('session unavailable');
      return { data: { session: state.id ? { user: { id: state.id } } : null }, error: null };
    } },
    from(table) {
      const filters = {};
      let operation = 'select';
      const execute = async () => {
        if (table === 'parental_controls') {
          if (state.waitConsent) await state.waitConsent;
          return { data: state.consent, error: state.consentError ? new Error('consent unavailable') : null };
        }
        if (operation !== 'select') return { data: { id: 'saved' }, error: null };
        if (table === 'game_progress') {
          if (state.waitProgress) await state.waitProgress;
          return { data: state.row, error: state.progressError ? new Error('read unavailable') : null };
        }
        assert.equal(filters.user_id, state.id, 'history reads must be account filtered');
        return { data: state.rows, error: null };
      };
      const query = {
        select() { return query; }, eq(k, v) { filters[k] = v; return query; }, order() { return query; },
        insert(row) { operation = 'insert'; state.writes.push({ table, row }); return query; },
        upsert(row) { operation = 'upsert'; state.writes.push({ table, row }); return query; },
        maybeSingle: execute, single: execute, then(resolve, reject) { return execute().then(resolve, reject); },
      };
      return query;
    },
  };
  const service = createGameProgressService(client, () => storage);
  const switchTo = id => { state.id = id; service.setProgressIdentity(id); };
  switchTo(null);
  return { state, values, service, switchTo };
}
const progress = points => ({ unlockedEras: ['discovery'], unlockedEvents: ['leeuwenhoek-discovery'], completedEvents: ['synthetic-event'], totalPoints: points, collectedCards: [], achievements: [] });
const pending = () => { let release; const promise = new Promise(resolve => { release = resolve; }); return { promise, release }; };

test('guest data uses a separate key and never enters a signed-in account', async () => {
  const f = fixture();
  f.values.set('microbequest_progress', JSON.stringify(progress(999)));
  assert.equal((await f.service.loadProgress()).totalPoints, 0);
  await f.service.saveProgress(progress(25));
  assert.equal((await f.service.loadProgress()).totalPoints, 25);
  f.switchTo('account-a');
  assert.equal((await f.service.syncProgressOnLogin()).totalPoints, 0);
  assert.equal(f.state.writes.length, 0);
  assert.equal(JSON.parse(f.values.get(cacheKey(null))).totalPoints, 25);
});

test('switching accounts cannot reuse the previous account cache', async () => {
  const f = fixture();
  f.switchTo('account-a');
  await f.service.saveProgress(progress(80));
  f.switchTo('account-b');
  f.state.progressError = true;
  assert.equal((await f.service.loadProgress()).totalPoints, 0);
  f.switchTo('account-a');
  assert.equal((await f.service.loadProgress()).totalPoints, 80);
});

test('remote absence does not resurrect a deleted account record or upload a cache', async () => {
  const f = fixture(); f.switchTo('account-a');
  f.values.set(cacheKey('account-a'), JSON.stringify(progress(100)));
  assert.equal((await f.service.syncProgressOnLogin()).totalPoints, 0);
  assert.equal(f.state.writes.length, 0);
});

for (const [name, change] of [
  ['no consent record', f => { f.state.consent = null; }],
  ['tracking opted out', f => { f.state.consent.progress_tracking_consent = false; }],
  ['no explicit grant', f => { f.state.consent.consent_granted_at = null; }],
  ['withdrawn consent', f => { f.state.consent.consent_withdrawn_at = '2026-10-02T00:00:00Z'; }],
  ['invalid consent date', f => { f.state.consent.consent_granted_at = 'invalid'; }],
  ['unavailable consent', f => { f.state.consentError = true; }],
]) {
  test(`${name} blocks progress, scores and achievements, including local account caching`, async () => {
    const f = fixture(); f.switchTo('account-a'); change(f);
    f.values.set(cacheKey('account-a'), JSON.stringify(progress(100)));
    assert.equal((await f.service.saveProgress(progress(12))).skipped, true);
    assert.equal((await f.service.saveGameScore({ score: 600 })).skipped, true);
    assert.equal((await f.service.unlockAchievement('test', 'Test')).skipped, true);
    assert.equal((await f.service.resetProgress()).skipped, true);
    assert.equal((await f.service.loadProgress()).totalPoints, 0);
    assert.equal(f.state.writes.length, 0);
    assert.equal(f.values.has(cacheKey('account-a')), false);
  });
}

test('explicit permitted tracking saves only under the captured account', async () => {
  const f = fixture(); f.switchTo('account-a');
  await f.service.saveProgress(progress(42));
  await f.service.saveGameScore({ gameMode: 'microbe-matching', score: 600 });
  await f.service.unlockAchievement('test', 'Test');
  assert.deepEqual(f.state.writes.map(w => w.table), ['game_progress', 'game_scores', 'user_achievements']);
  assert.ok(f.state.writes.every(w => w.row.user_id === 'account-a'));
  assert.equal(JSON.parse(f.values.get(cacheKey('account-a'))).totalPoints, 42);
});

test('a new explicit grant after withdrawal can permit saving again', async () => {
  const f = fixture(); f.switchTo('account-a');
  f.state.consent.consent_withdrawn_at = '2026-09-01T00:00:00Z';
  await f.service.saveGameScore({ score: 10 });
  assert.equal(f.state.writes.length, 1);
});

test('account switching while consent is pending cancels the old save', async () => {
  const f = fixture(); f.switchTo('account-a');
  const gate = pending(); f.state.waitConsent = gate.promise;
  const save = f.service.saveProgress(progress(80));
  await new Promise(resolve => setImmediate(resolve));
  f.switchTo('account-b'); gate.release(); await save;
  assert.equal(f.state.writes.length, 0);
  assert.equal(f.values.size, 0);
});

test('old reads cannot populate a new account after a switch', async () => {
  const f = fixture(); f.switchTo('account-a');
  const gate = pending(); f.state.waitProgress = gate.promise;
  f.state.row = { total_points: 80 };
  const read = f.service.loadProgress();
  await new Promise(resolve => setImmediate(resolve));
  f.switchTo('account-b'); gate.release();
  assert.equal((await read).totalPoints, 0);
  assert.equal(f.values.size, 0);
});

test('session failure cannot silently write an account game into the guest cache', async () => {
  const f = fixture(); f.switchTo('account-a'); f.state.sessionError = true;
  assert.equal((await f.service.saveProgress(progress(10))).skipped, true);
  assert.equal(f.values.size, 0); assert.equal(f.state.writes.length, 0);
});

test('existing score and achievement history remains readable after opting out', async () => {
  const f = fixture(); f.switchTo('account-a'); f.state.consent.progress_tracking_consent = false;
  f.state.rows = [{ score: 60, achievement_id: 'test' }];
  assert.equal((await f.service.loadGameScores())[0].score, 60);
  assert.equal((await f.service.loadUserAchievements())[0].achievementId, 'test');
  assert.equal(await f.service.getBestScore('microbe-matching'), 60);
});

test('disabled browser storage never reports a successful guest save', async () => {
  const service = createGameProgressService({ auth: { async getSession() { return { data: { session: null } }; } } },
    () => { throw new Error('storage blocked'); });
  const result = await service.saveProgress(progress(10));
  assert.ok(result.error);
  assert.equal(result.local, false);
});
