import test from 'node:test';
import assert from 'node:assert/strict';
import { createUsageStore, usageKey, BREAK_MS, readUsage, advanceUsage, usageDecision, localDay } from '../src/services/playUsage.mjs';
const controls = { screenTimeEnabled:true, dailyTimeLimitMinutes:60, sessionTimeLimitMinutes:30 };
function fixture(start = +new Date(2026,9,23,12)) {
  let now = start;
  const data = new Map();
  let queue = Promise.resolve();
  const storage = { getItem:k=>data.get(k) ?? null, setItem:(k,v)=>data.set(k,v), removeItem:k=>data.delete(k) };
  const locks = { request: (_key, options, fn) => { const task = queue.then(fn ?? options); queue = task.catch(()=>{}); return task; } };
  const store = createUsageStore({ storage, locks, clock:()=>now });
  return { store, data, storage, locks, clock:()=>now, move:ms=>now+=ms, record:owner=>JSON.parse(data.get(usageKey(owner))) };
}
test('boundaries and settings changes enforce daily and session allowances', () => {
  const now = +new Date(2026,9,23,12), r = readUsage(null,now);
  r.daily = 60*60_000-1; r.session = 30*60_000-1;
  assert.equal(usageDecision(r,controls,now).remaining,1);
  r.session++;
  assert.equal(usageDecision(r,controls,now).reason,'Time for a play break');
  r.daily++;
  assert.equal(usageDecision(r,controls,now).reason,'Daily play limit reached');
  assert.equal(usageDecision(r,{...controls,dailyTimeLimitMinutes:61,sessionTimeLimitMinutes:31},now).allowed,true);
  assert.equal(usageDecision(r,{screenTimeEnabled:false},now).allowed,true);
  for (const bad of [0,-1,NaN,Infinity,'30',null]) assert.throws(()=>usageDecision(r,{...controls,sessionTimeLimitMinutes:bad},now));
});
test('tabs count the union; reload and route stop preserve the session', async () => {
  const f=fixture();
  await Promise.all(['a','b'].map(tab=>f.store.update('guest',tab,controls,true)));
  f.move(1000);
  await f.store.update('guest','a',controls,true);
  await f.store.update('guest','b',controls,true);
  assert.equal(f.record('guest').daily,1000);
  await f.store.stop('guest','a');
  f.move(1000);
  await f.store.stop('guest','b');
  assert.equal(f.record('guest').daily,2000);
  f.move(10000);
  const reloaded=createUsageStore({storage:f.storage,locks:f.locks,clock:f.clock});
  await reloaded.update('guest','new',controls,true);
  assert.equal(f.record('guest').session,2000);
  f.move(500); await reloaded.stop('guest','new');
  assert.equal(f.record('guest').daily,2500);
});
test('hidden/non-game time stops; continuous fifteen-minute break resets only session', async () => {
  const f=fixture();
  await f.store.update('guest','a',controls,true);
  f.move(1000); await f.store.stop('guest','a');
  f.move(BREAK_MS-1); await f.store.update('guest','a',controls,false);
  assert.equal(f.record('guest').session,1000);
  f.move(1); await f.store.update('guest','a',controls,false);
  assert.equal(f.record('guest').session,0);
  assert.equal(f.record('guest').daily,1000);
});
test('midnight splits daily time without resetting ongoing session', async () => {
  const start=+new Date(2026,9,23,23,59,59), f=fixture(start);
  await f.store.update('guest','a',controls,true);
  f.move(2000); await f.store.update('guest','a',controls,true);
  assert.equal(f.record('guest').daily,1000);
  assert.equal(f.record('guest').session,2000);
  assert.equal(f.record('guest').day,localDay(start+2000));
});
test('account isolation, cancelled requests, and disabled controls retain prior totals', async () => {
  const f=fixture();
  await f.store.update('guest','a',controls,true);
  f.move(1000); await f.store.stop('guest','a');
  await f.store.update('user:A','a',controls,true,()=>false);
  await f.store.update('user:B','b',controls,true);
  f.move(1000); await f.store.stop('user:B','b');
  assert.equal(f.record('user:A').daily,0);
  assert.equal(f.record('user:B').daily,1000);
  await f.store.update('guest','a',{screenTimeEnabled:false},true);
  f.move(10000); await f.store.update('guest','a',controls,false);
  assert.equal(f.record('guest').daily,1000);
  await f.store.clear('user:A');
  assert.equal(f.data.has(usageKey('user:A')),false);
  assert.equal((await f.store.export('user:B')).daily,1000);
});
test('crash expiry is bounded and allowance bounds the final lease', async () => {
  const f=fixture(), short={...controls,sessionTimeLimitMinutes:0.01};
  await f.store.update('guest','a',short,true);
  f.move(5000);
  const decision=await f.store.update('guest','b',short,true);
  assert.equal(f.record('guest').daily,600);
  assert.equal(decision.allowed,false);
  assert.equal(Object.keys(f.record('guest').leases).length,0);
});
test('storage, corrupt data, unsupported locks and clock rollback fail closed', async () => {
  const f=fixture();
  await assert.rejects(createUsageStore({storage:f.storage}).update('guest','a',controls,true));
  const denied=createUsageStore({storage:{getItem(){throw new Error('denied');}},locks:f.locks});
  await assert.rejects(denied.update('guest','a',controls,true));
  for(const raw of ['bad','{}','null','{"version":1,"leases":[]}']) {
    f.data.set(usageKey('guest'),raw);
    await assert.rejects(f.store.update('guest','a',controls,true));
  }
  f.data.clear(); await f.store.update('guest','a',controls,true);
  f.move(-1); await assert.rejects(f.store.update('guest','a',controls,true));
});
test('local date/DST transitions count actual elapsed milliseconds', () => {
  const start=+new Date(2026,10,1,0,30), end=+new Date(2026,10,1,3,30);
  const r=readUsage(null,start); r.leases.a=end;
  advanceUsage(r,end);
  assert.equal(r.daily,end-start); assert.equal(r.session,end-start);
});
