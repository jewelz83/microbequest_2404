import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loadParentalControls } from '../services/parentalControlsService';
import { canPlayMode, difficultyCeiling, scheduleAllowsPlay } from '../services/gameAccessPolicy.mjs';
import { usePlayUsage } from '../contexts/PlayUsageContext';
import Header from './ui/Header';

const DifficultyContext = createContext('easy');
export const useDifficultyCeiling = () => useContext(DifficultyContext);

export default function GameAccessGate({ mode, children }) {
  const { user, loading } = useAuth();
  const { register, decision } = usePlayUsage();
  const owner = user?.id ? `user:${user.id}` : 'guest';
  const [result, setResult] = useState(null);
  const [retry, setRetry] = useState(0);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    const timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('focus', tick);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', tick); window.removeEventListener('focus', tick); };
  }, []);
  useEffect(() => {
    let active = true;
    let request = 0;
    async function refresh() {
      const current = ++request;
      try {
        const controls = await loadParentalControls({ strict: true });
        if (active && request === current) setResult(previous => previous?.owner === owner && previous?.mode === mode && JSON.stringify(previous.controls) === JSON.stringify(controls) ? previous : { owner, mode, controls, allowed: canPlayMode(controls, mode), ceiling: difficultyCeiling(controls.maxDifficultyLevel) });
      } catch {
        if (active && request === current) setResult({ owner, mode, error: true });
      }
    }
    refresh();
    const timer = setInterval(refresh, 15000);
    window.addEventListener('focus', refresh);
    return () => { active = false; clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [owner, mode, retry]);
  const current = result?.owner === owner && result?.mode === mode ? result : null;
  const scheduleBlocked = current?.allowed && !scheduleAllowsPlay(current.controls, now);
  const active = Boolean(!loading && current?.allowed && !scheduleBlocked);
  useLayoutEffect(() => {
    if (!current?.controls || loading) return;
    return register({ owner, controls: current.controls, active });
  }, [register, owner, current?.controls, active, loading]);
  const usage = decision?.owner === owner ? decision : null;
  const started = useRef(false);
  const bypass = current?.controls?.screenTimeEnabled === false;
  const timingBlocked = active && !bypass && !usage?.allowed;
  const canPlay = active && (bypass || usage?.allowed);
  if (canPlay) started.current = true;
  if (!active || (usage && !usage.allowed)) started.current = false;
  // Preserve an in-progress game during a brief visibility/settings recheck,
  // while hiding it from interaction until the next grant. Explicit denial unmounts it.
  const keepGame = active && (canPlay || (!usage && started.current));
  return <>
    {keepGame && <div hidden={!canPlay}><DifficultyContext.Provider key={current.ceiling} value={current.ceiling}>{children}</DifficultyContext.Provider></div>}
    {!canPlay && <><Header /><main className="min-h-screen bg-background text-foreground pt-28 px-6">
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-heading">{timingBlocked ? (usage?.error ? 'Play time unavailable' : usage?.reason || 'Checking play time…') : !current ? 'Checking game access…' : current.error ? 'Game settings unavailable' : scheduleBlocked ? 'It’s outside your play schedule' : 'This game is turned off'}</h1>
      <p role="status">{timingBlocked ? (usage?.error || (usage?.resumeAt ? `You can try again after ${new Date(usage.resumeAt).toLocaleString()}. Daily and session limits both apply.` : 'Please wait while we check this device’s play time.')) : !current ? 'Please wait while we check the saved parent settings.' : current.error ? 'We could not check the parent settings. Please try again before playing.' : scheduleBlocked ? 'Come back during the days and hours chosen in Parent Controls. The schedule uses this device’s local time.' : 'A parent can turn this game back on in Parent Controls.'}</p>
      {(current?.error || usage?.error) && <button className="underline block" onClick={() => { setResult(null); setRetry(n => n + 1); }}>Try again</button>}
      <Link className="underline block" to="/game-home-dashboard">Back to home</Link>
      <Link className="underline block" to="/parent-controls-dashboard">Parent Controls</Link>
    </div>
  </main></>}
  </>;
}
