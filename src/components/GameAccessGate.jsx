import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loadParentalControls } from '../services/parentalControlsService';
import { canPlayMode, difficultyCeiling } from '../services/gameAccessPolicy.mjs';
import Header from './ui/Header';

const DifficultyContext = createContext('easy');
export const useDifficultyCeiling = () => useContext(DifficultyContext);

export default function GameAccessGate({ mode, children }) {
  const { user } = useAuth();
  const owner = user?.id ?? 'guest';
  const [result, setResult] = useState(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    let request = 0;
    async function refresh() {
      const current = ++request;
      try {
        const controls = await loadParentalControls({ strict: true });
        if (active && request === current) setResult({ owner, mode, allowed: canPlayMode(controls, mode), ceiling: difficultyCeiling(controls.maxDifficultyLevel) });
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
  if (current?.allowed) return <DifficultyContext.Provider key={current.ceiling} value={current.ceiling}>{children}</DifficultyContext.Provider>;
  return <><Header /><main className="min-h-screen bg-background text-foreground pt-28 px-6">
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-heading">{!current ? 'Checking game access…' : current.error ? 'Game settings unavailable' : 'This game is turned off'}</h1>
      <p role="status">{!current ? 'Please wait while we check the saved parent settings.' : current.error ? 'We could not check the parent settings. Please try again before playing.' : 'A parent can turn this game back on in Parent Controls.'}</p>
      {current?.error && <button className="underline block" onClick={() => { setResult(null); setRetry(n => n + 1); }}>Try again</button>}
      <Link className="underline block" to="/game-home-dashboard">Back to home</Link>
      <Link className="underline block" to="/parent-controls-dashboard">Parent Controls</Link>
    </div>
  </main></>;
}
