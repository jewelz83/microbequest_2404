import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs/promises';

async function fixture() {
  const values = new Map();
  const state = { id: 'account-b', row: null, writes: [], readError: false, writeError: false, sessionError: false };
  const client = { auth: { async getSession() {
    if (state.sessionError) throw new Error('session unavailable');
    return { data: { session: state.id ? { user: { id: state.id } } : null } };
  } }, from(table) {
    const query = { select() { return query; }, eq() { return query; },
      async maybeSingle() { return { data: state.row, error: state.readError ? new Error('read failed') : null }; },
      async upsert(row) { state.writes.push({ table, row }); return { error: state.writeError ? new Error('write failed') : null }; },
      async insert(row) { state.writes.push({ table, row }); return { error: null }; },
    };
    return query;
  } };
  const context = vm.createContext({ console: { error() {} }, localStorage: {
    getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, v), removeItem: k => values.delete(k),
  } });
  const source = await fs.readFile(new URL('../src/services/parentalControlsService.js', import.meta.url), 'utf8');
  const module = new vm.SourceTextModule(source, { context });
  await module.link(() => new vm.SyntheticModule(['supabase'], function () { this.setExport('supabase', client); }, { context }));
  await module.evaluate();
  module.namespace.setParentalControlsIdentity(state.id);
  return { api: module.namespace, state, values };
}

test('a new signed-in account never imports consent from another browser user', async () => {
  const f = await fixture();
  f.values.set('microbequest_parental_controls', JSON.stringify({ progressTrackingConsent: true, consentGrantedAt: '2026-10-01T00:00:00Z', parentEmail: 'synthetic-a@example.com' }));
  const controls = await f.api.loadParentalControls();
  assert.equal(controls.progressTrackingConsent, false);
  assert.equal(controls.consentGrantedAt, null);
  assert.equal(controls.parentEmail, '');
  assert.equal(f.state.writes.length, 0);
});
test('failed authenticated reads never fall back to another user consent', async () => {
  const f = await fixture(); f.state.readError = true;
  f.values.set('microbequest_parental_controls', JSON.stringify({ progressTrackingConsent: true }));
  assert.equal((await f.api.loadParentalControls()).progressTrackingConsent, false);
});
test('authenticated parent settings never populate the shared guest cache', async () => {
  const f = await fixture();
  await f.api.saveParentalControls({ ...f.api.defaultControls, parentEmail: 'synthetic-b@example.com' });
  assert.equal(f.values.has('microbequest_parental_controls'), false);
  assert.equal(f.state.writes[0].row.user_id, 'account-b');
});
test('failed consent grant and withdrawal do not return success or append audit receipts', async () => {
  const f = await fixture(); f.state.writeError = true;
  await assert.rejects(f.api.grantVerifiableConsent(f.api.defaultControls, 'synthetic-b@example.com'));
  await assert.rejects(f.api.withdrawConsent(f.api.defaultControls, 'all'));
  assert.ok(f.state.writes.every(w => w.table === 'parental_controls'));
  assert.equal(f.values.size, 0);
});
test('unknown session cannot save private settings into the guest cache', async () => {
  const f = await fixture(); f.state.sessionError = true;
  assert.ok((await f.api.saveParentalControls(f.api.defaultControls)).error);
  assert.equal(f.state.writes.length, 0); assert.equal(f.values.size, 0);
});
