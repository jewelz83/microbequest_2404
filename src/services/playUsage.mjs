// Device-local restriction data only; never contains gameplay or analytics.
export const BREAK_MS = 15 * 60_000;
export const LEASE_MS = 2000;
export const usageKey = owner => `microbequest_usage:v1:${owner}`;
export const localDay = time => { const d = new Date(time); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; };
const midnightAfter = time => { const d = new Date(time); d.setHours(24,0,0,0); return +d; };
const number = n => Number.isFinite(n) && n >= 0;
export function readUsage(raw, now) {
  if (raw === null) return { version: 1, cursor: now, day: localDay(now), daily: 0, session: 0, lastPlay: 0, leases: {} };
  const r = JSON.parse(raw);
  if (r?.version !== 1 || ![r.cursor,r.daily,r.session,r.lastPlay].every(number) || typeof r.day !== 'string' || !r.leases || typeof r.leases !== 'object' || Array.isArray(r.leases) || !Object.values(r.leases).every(n => number(n) && n <= r.cursor + LEASE_MS)) throw new Error('Saved play time could not be read.');
  if (now < r.cursor) throw new Error('The device clock moved backward. Restore the clock and retry.');
  return r;
}
export function advanceUsage(r, now) {
  if (now < r.cursor) throw new Error('The device clock moved backward. Restore the clock and retry.');
  const end = Math.min(now, Math.max(r.cursor, ...Object.values(r.leases)));
  let start = r.cursor;
  while (start < end) {
    const stop = Math.min(end, midnightAfter(start));
    if (r.day !== localDay(start)) { r.day = localDay(start); r.daily = 0; }
    r.daily += stop - start;
    r.session += stop - start;
    r.lastPlay = stop;
    start = stop;
  }
  if (r.day !== localDay(now)) { r.day = localDay(now); r.daily = 0; }
  for (const id of Object.keys(r.leases)) if (r.leases[id] <= now) delete r.leases[id];
  if (now - r.lastPlay >= BREAK_MS) r.session = 0;
  r.cursor = now;
  return r;
}
export function usageDecision(r, controls, now) {
  if (controls?.screenTimeEnabled === false) return { allowed: true, remaining: Infinity };
  if (controls?.screenTimeEnabled !== true || ![controls.dailyTimeLimitMinutes, controls.sessionTimeLimitMinutes].every(n => number(n) && n > 0)) throw new Error('A parent needs to set valid daily and session limits.');
  const daily = controls.dailyTimeLimitMinutes * 60_000 - r.daily;
  const session = controls.sessionTimeLimitMinutes * 60_000 - r.session;
  if (daily <= 0) return { allowed: false, reason: 'Daily play limit reached', resumeAt: midnightAfter(now) };
  if (session <= 0) return { allowed: false, reason: 'Time for a play break', resumeAt: r.lastPlay + BREAK_MS };
  return { allowed: true, remaining: Math.min(daily, session) };
}
export function createUsageStore({ storage, locks, clock = Date.now }) {
  async function transaction(owner, operation) {
    if (!locks?.request) throw new Error('This browser cannot coordinate play limits. Use a browser with Web Locks support.');
    return locks.request(usageKey(owner), { signal: AbortSignal.timeout(1500) }, () => {
      const now = clock();
      const record = advanceUsage(readUsage(storage.getItem(usageKey(owner)), now), now);
      const result = operation(record, now);
      storage.setItem(usageKey(owner), JSON.stringify(record));
      return result;
    });
  }
  return {
    update(owner, tab, controls, active, valid = () => true) {
      return transaction(owner, (record, now) => {
        delete record.leases[tab];
        const decision = usageDecision(record, controls, now);
        if (active && valid() && decision.allowed && controls.screenTimeEnabled) record.leases[tab] = now + Math.min(LEASE_MS, decision.remaining);
        return { ...decision, granted: Boolean(record.leases[tab]), validUntil: now + Math.min(LEASE_MS, decision.remaining ?? LEASE_MS) };
      });
    },
    stop(owner, tab) { return transaction(owner, record => { delete record.leases[tab]; }); },
    export(owner) { return transaction(owner, record => structuredClone(record)); },
    clear(owner) {
      if (!locks?.request) return Promise.reject(new Error('Play-time storage is unavailable.'));
      return locks.request(usageKey(owner), () => storage.removeItem(usageKey(owner)));
    },
  };
}
export const browserUsageStore = () => createUsageStore({ storage: localStorage, locks: navigator.locks });
