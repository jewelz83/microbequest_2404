import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { browserUsageStore } from '../services/playUsage.mjs';
const Context = createContext(null);
export const usePlayUsage = () => useContext(Context);

// One coordinator survives game route changes. Persisted leases bound crash accounting
// to two seconds; expired grants never authorize a newly visible game.
export function PlayUsageProvider({ children }) {
  const request = useRef(null);
  const generation = useRef(0);
  const [result, setResult] = useState(null);
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible');
  const [now, setNow] = useState(Date.now());
  const coordinator = useRef(null);
  if (!coordinator.current) coordinator.current = { tab: crypto.randomUUID(), store: null };
  const register = React.useCallback(value => {
    const ticket = ++generation.current;
    request.current = { ...value, ticket };
    setResult(null);
    return () => {
      if (request.current?.ticket !== ticket) return;
      generation.current++;
      request.current = null;
      coordinator.current.store?.stop(value.owner, coordinator.current.tab).catch(() => {});
    };
  }, []);
  useEffect(() => {
    let busy = false;
    let alive = true;
    let previousWall = Date.now();
    let previousMono = performance.now();
    let clockError = false;
    async function tick() {
      const wall = Date.now(), mono = performance.now();
      // A forward or backward wall-clock jump during play must not grant time.
      if (Math.abs((wall - previousWall) - (mono - previousMono)) > 2000) clockError = true;
      previousWall = wall; previousMono = mono;
      setNow(wall);
      if (busy || !request.current) return;
      const current = request.current;
      busy = true;
      try {
        if (clockError) throw new Error('The device clock changed. Check the clock and reload before playing.');
        const c = coordinator.current;
        c.store ??= browserUsageStore();
        const decision = await c.store.update(current.owner, c.tab, current.controls, current.active && document.visibilityState === 'visible', () => alive && generation.current === current.ticket && document.visibilityState === 'visible');
        if (alive && generation.current === current.ticket) setResult({ ...decision, ticket: current.ticket, owner: current.owner });
      } catch (error) {
        if (alive && generation.current === current.ticket) setResult({ error: error.message, ticket: current.ticket, owner: current.owner });
      } finally { busy = false; }
    }
    function visibility() {
      setVisible(document.visibilityState === 'visible');
      setResult(null);
      const current = request.current;
      if (current && document.visibilityState !== 'visible') coordinator.current.store?.stop(current.owner, coordinator.current.tab).catch(() => {});
      tick();
    }
    const timer = setInterval(tick, 250);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', visibility);
    tick();
    return () => { alive = false; clearInterval(timer); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('pagehide', visibility); };
  }, []);
  const current = result?.ticket === request.current?.ticket ? result : null;
  const decision = current?.allowed && (!visible || !current.granted || current.validUntil <= now) ? null : current;
  return <Context.Provider value={{ register, decision }}>{children}</Context.Provider>;
}
