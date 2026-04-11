import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Star, ArrowRight, Lightbulb, GripVertical, MapPin } from 'lucide-react';

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// DRAG & DROP ORDERING GAME — TOUCH FRIENDLY
// vaccination-timeline, swan-flask-experiment, kochs-postulates, dna-copying, vaccine-development
// ─────────────────────────────────────────────
const DragDropOrderingGame = ({ gameData, eventData, onComplete }) => {
  const [items, setItems] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [shake, setShake] = useState(false);
  const [touchStartY, setTouchStartY] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    const shuffled = [...gameData?.steps]?.map((text, i) => ({ id: i, text, correctIndex: i }));
    for (let i = shuffled?.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled?.[j], shuffled?.[i]];
    }
    setItems(shuffled);
  }, []);

  // Mouse drag handlers
  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e, index) => { e?.preventDefault(); setDragOverIndex(index); };
  const handleDrop = (e, dropIndex) => {
    e?.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const newItems = [...items];
    const [dragged] = newItems?.splice(draggedIndex, 1);
    newItems?.splice(dropIndex, 0, dragged);
    setItems(newItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Touch handlers
  const handleTouchStart = (e, index) => {
    setDraggedIndex(index);
    setTouchStartY(e?.touches?.[0]?.clientY);
  };

  const handleTouchMove = (e) => {
    e?.preventDefault();
    if (draggedIndex === null || !listRef?.current) return;
    const touch = e?.touches?.[0];
    const elements = listRef?.current?.querySelectorAll('[data-item]');
    let overIndex = null;
    elements?.forEach((el, i) => {
      const rect = el?.getBoundingClientRect();
      if (touch?.clientY >= rect?.top && touch?.clientY <= rect?.bottom) {
        overIndex = i;
      }
    });
    if (overIndex !== null) setDragOverIndex(overIndex);
  };

  const handleTouchEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newItems = [...items];
      const [dragged] = newItems?.splice(draggedIndex, 1);
      newItems?.splice(dragOverIndex, 0, dragged);
      setItems(newItems);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    setTouchStartY(null);
  };

  const checkOrder = () => {
    setAttempts(a => a + 1);
    const correct = items?.every((item, index) => item?.correctIndex === index);
    if (correct) {
      setResult('success');
      setTimeout(() => onComplete({ score: eventData?.points, perfect: attempts === 0 }), 2000);
    } else {
      setResult('try-again');
      setShake(true);
      setTimeout(() => { setResult(null); setShake(false); }, 1500);
    }
  };

  // Move up/down buttons for accessibility & mobile fallback
  const moveItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items?.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems?.[newIndex], newItems?.[index]];
    setItems(newItems);
  };

  const stepColors = ['from-amber-500 to-orange-500','from-emerald-500 to-teal-500','from-blue-500 to-cyan-500','from-purple-500 to-violet-500','from-rose-500 to-pink-500','from-yellow-500 to-amber-500'];

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
        <p className="text-white/90 text-center font-semibold mb-1">{gameData?.task}</p>
        <p className="text-white/60 text-center text-sm">Drag to reorder, or use ↑↓ buttons on mobile</p>
      </div>
      <motion.div
        ref={listRef}
        animate={shake ? { x: [-8,8,-8,8,0] } : {}}
        transition={{ duration: 0.4 }}
        className="space-y-3"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items?.map((item, index) => (
          <div
            key={item?.id}
            data-item={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onTouchStart={(e) => handleTouchStart(e, index)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 select-none touch-none
              ${dragOverIndex === index && draggedIndex !== index ? 'border-yellow-400 bg-yellow-500/20 scale-105' : 'border-white/20 bg-white/5'}
              ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
              ${result === 'success' ? 'border-green-400 bg-green-500/20' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${stepColors?.[index % stepColors?.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {index + 1}
            </div>
            <GripVertical className="w-4 h-4 text-white/40 flex-shrink-0 cursor-grab" />
            <p className="text-white font-medium flex-1 text-sm">{item?.text}</p>

            {/* Up/Down buttons for touch fallback */}
            <div className="flex flex-col gap-1 flex-shrink-0">
              <button
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white text-xs flex items-center justify-center transition-all"
              >↑</button>
              <button
                onClick={() => moveItem(index, 1)}
                disabled={index === items?.length - 1}
                className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white text-xs flex items-center justify-center transition-all"
              >↓</button>
            </div>

            {result === 'success' && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
          </div>
        ))}
      </motion.div>
      <AnimatePresence>
        {result === 'try-again' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-orange-500/20 border border-orange-400/50 rounded-xl p-4 text-center">
            <p className="text-orange-200 font-semibold">Not quite right! Try rearranging the steps.</p>
          </motion.div>
        )}
        {result === 'success' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-green-500/20 border border-green-400/50 rounded-xl p-4 text-center">
            <p className="text-green-200 font-bold text-lg">🎉 Perfect Order! +{eventData?.points} points!</p>
          </motion.div>
        )}
      </AnimatePresence>
      {showHint && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-3 flex gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-200 text-sm">{gameData?.hint}</p>
        </motion.div>
      )}
      <div className="flex items-center justify-between">
        <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-2 text-yellow-300 hover:text-yellow-200 text-sm transition-colors">
          <Lightbulb className="w-4 h-4" />{showHint ? 'Hide Hint' : 'Need a Hint?'}
        </button>
        <button onClick={checkOrder} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
          Check Order <CheckCircle className="w-5 h-5" />
        </button>
      </div>
      <div className="flex justify-between text-white/50 text-sm">
        <span>Attempts: {attempts}</span>
        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-300" />{eventData?.points} pts</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SPOT & CLICK SCENE GAME
// outbreak-mapping, operating-room-cleaning, petri-dish-detective, virus-hunter
// ─────────────────────────────────────────────
const SpotClickGame = ({ gameData, eventData, onComplete }) => {
  const [found, setFound] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [clicks, setClicks] = useState([]);
  const [result, setResult] = useState(null);

  const targets = gameData?.targets || [];
  const required = gameData?.requiredCount || targets?.length;

  const handleSceneClick = (e) => {
    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = ((e?.clientX - rect?.left) / rect?.width) * 100;
    const y = ((e?.clientY - rect?.top) / rect?.height) * 100;
    let hitTarget = null;
    for (const target of targets) {
      const dist = Math.sqrt(Math.pow(x - target?.x, 2) + Math.pow(y - target?.y, 2));
      if (dist < (target?.radius || 7) && !found?.includes(target?.id)) { hitTarget = target; break; }
    }
    if (hitTarget) {
      const newFound = [...found, hitTarget?.id];
      setFound(newFound);
      setClicks(prev => [...prev, { x, y, hit: true, id: Date.now() }]);
      setAttempts(a => a + 1);
      if (newFound?.length >= required) {
        setResult('success');
        setTimeout(() => onComplete({ score: eventData?.points, perfect: attempts < 3 }), 2000);
      }
    } else {
      setClicks(prev => [...prev, { x, y, hit: false, id: Date.now() }]);
      setAttempts(a => a + 1);
    }
  };

  const getScene = () => {
    switch (gameData?.sceneType) {
      case 'outbreak-map': return (
        <div className="w-full h-full bg-gradient-to-br from-amber-900 to-orange-950 relative">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 56" preserveAspectRatio="none">
            <rect width="100" height="56" fill="#451a03"/>
            <rect x="0" y="18" width="100" height="3" fill="#78350f" opacity="0.8"/>
            <rect x="0" y="35" width="100" height="3" fill="#78350f" opacity="0.8"/>
            <rect x="20" y="0" width="3" height="56" fill="#78350f" opacity="0.8"/>
            <rect x="50" y="0" width="3" height="56" fill="#78350f" opacity="0.8"/>
            <rect x="75" y="0" width="3" height="56" fill="#78350f" opacity="0.8"/>
            {[{x:5,y:5,w:12,h:10},{x:25,y:5,w:20,h:10},{x:55,y:5,w:17,h:10},{x:78,y:5,w:18,h:10},{x:5,y:23,w:12,h:9},{x:25,y:23,w:20,h:9},{x:55,y:23,w:17,h:9},{x:78,y:23,w:18,h:9},{x:5,y:40,w:12,h:12},{x:25,y:40,w:20,h:12},{x:55,y:40,w:17,h:12},{x:78,y:40,w:18,h:12}]?.map((b,i) => <rect key={i} x={b?.x} y={b?.y} width={b?.w} height={b?.h} fill="#92400e" rx="1"/>)}
            <circle cx="50" cy="28" r="2" fill="#60a5fa"/><text x="50" y="33" textAnchor="middle" fontSize="2.5" fill="#93c5fd">PUMP</text>
          </svg>
          {targets?.map(t => (
            <div key={t?.id} className={`absolute w-5 h-5 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all ${found?.includes(t?.id) ? 'bg-green-500 border-green-300 scale-125' : 'bg-red-500/80 border-red-300 animate-pulse'}`} style={{left:`${t?.x}%`,top:`${t?.y}%`}}>
              {found?.includes(t?.id) ? <CheckCircle className="w-3 h-3 text-white"/> : <MapPin className="w-3 h-3 text-white"/>}
            </div>
          ))}
          <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-1 text-xs text-white">🗺️ 1854 London — Find sick households near the pump</div>
        </div>
      );
      case 'operating-room': return (
        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 relative">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 56" preserveAspectRatio="none">
            <rect width="100" height="56" fill="#1e293b"/>
            <rect x="30" y="20" width="40" height="16" rx="2" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
          </svg>
          {targets?.map(t => (
            <div key={t?.id} className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all ${found?.includes(t?.id) ? 'opacity-30 scale-90' : 'opacity-100'}`} style={{left:`${t?.x}%`,top:`${t?.y}%`}}>
              <div className={`w-10 h-10 rounded border-2 flex items-center justify-center text-xl ${found?.includes(t?.id) ? 'border-green-400 bg-green-900/50' : 'border-red-400 bg-red-900/50 animate-pulse'}`}>{found?.includes(t?.id) ? '✨' : t?.icon || '🦠'}</div>
            </div>
          ))}
          <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-1 text-xs text-white">🏥 1865 Operating Theatre — Clean all contaminated items</div>
        </div>
      );
      case 'petri-dish': return (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-slate-950 relative flex items-center justify-center">
          <div className="relative w-4/5 aspect-square max-h-full">
            <div className="absolute inset-0 rounded-full border-4 border-gray-600 bg-gradient-to-br from-amber-950/40 to-yellow-950/40"/>
            {targets?.map(t => (
              <div key={t?.id} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all cursor-pointer
                ${found?.includes(t?.id) ? 'border-green-400 bg-green-800/60 scale-110' : t?.type === 'bacteria' ? 'border-blue-400 bg-blue-900/60 hover:scale-105 animate-pulse' : 'border-yellow-600 bg-yellow-900/40 opacity-60'}`}
                style={{left:`${t?.x}%`,top:`${t?.y}%`,width:t?.size||'14%',height:t?.size||'14%'}}>
                {found?.includes(t?.id) ? '✓' : t?.type === 'bacteria' ? '🔵' : '🟡'}
              </div>
            ))}
          </div>
          <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-1 text-xs text-white">🧫 1928 Fleming's Lab — Click bacterial colonies (blue), not fungal (yellow)</div>
        </div>
      );
      default: return (
        <div className="w-full h-full bg-gradient-to-br from-indigo-950 to-purple-950 relative overflow-hidden">
          {Array.from({length:6})?.map((_,i) => <div key={i} className="absolute rounded-full border border-indigo-700/30 bg-indigo-900/20" style={{width:`${80+i*20}px`,height:`${80+i*20}px`,left:`${(i*17)%80}%`,top:`${(i*23)%70}%`,transform:'translate(-50%,-50%)'}}/>)}
          {targets?.map(t => (
            <motion.div key={t?.id} animate={!found?.includes(t?.id) ? {x:[0,5,-5,3,0],y:[0,-3,5,-2,0]} : {}} transition={{duration:3+t?.id,repeat:Infinity}}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all ${found?.includes(t?.id) ? 'opacity-20 scale-75' : 'cursor-pointer'}`} style={{left:`${t?.x}%`,top:`${t?.y}%`}}>
              <div className={`rounded-full flex items-center justify-center border-2 text-sm ${found?.includes(t?.id) ? 'border-green-400' : 'border-red-400/70 bg-red-900/40 hover:scale-110 transition-transform'}`} style={{width:'36px',height:'36px'}}>
                {found?.includes(t?.id) ? '✓' : '🦠'}
              </div>
            </motion.div>
          ))}
          <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-1 text-xs text-white">🔬 Find and click all the viruses hiding among the cells!</div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/10 rounded-xl p-3 border border-white/20 text-center">
        <p className="text-white font-semibold text-sm">{gameData?.task}</p>
        <p className="text-white/60 text-xs mt-1">Found: {found?.length} / {required}</p>
      </div>
      <div className="relative rounded-xl overflow-hidden border-2 border-white/20 cursor-crosshair" style={{aspectRatio:'16/9'}} onClick={handleSceneClick}>
        {getScene()}
        {clicks?.slice(-8)?.map(click => (
          <motion.div key={click?.id} initial={{scale:0,opacity:1}} animate={{scale:1.5,opacity:0}} transition={{duration:0.6}}
            className={`absolute w-8 h-8 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${click?.hit ? 'border-green-400 bg-green-400/30' : 'border-red-400 bg-red-400/20'}`}
            style={{left:`${click?.x}%`,top:`${click?.y}%`}}/>
        ))}
        {result === 'success' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
            <div className="bg-green-900/90 rounded-2xl p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3"/>
              <p className="text-white font-bold text-xl">Excellent Work!</p>
              <p className="text-green-200 text-sm mt-1">+{eventData?.points} points!</p>
            </div>
          </motion.div>
        )}
      </div>
      <div className="flex justify-center gap-2">
        {Array.from({length:required})?.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i < found?.length ? 'bg-green-400 scale-125' : 'bg-white/20'}`}/>)}
      </div>
      {showHint && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-3 flex gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5"/>
          <p className="text-yellow-200 text-sm">{gameData?.hint}</p>
        </motion.div>
      )}
      <div className="flex justify-between items-center">
        <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-2 text-yellow-300 text-sm"><Lightbulb className="w-4 h-4"/>{showHint ? 'Hide Hint' : 'Need a Hint?'}</button>
        <span className="text-white/50 text-sm flex items-center gap-1"><Star className="w-4 h-4 text-yellow-300"/>{eventData?.points} pts</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// DIAGRAM MATCHING GAME
// dna-building, double-helix-building, microbiome-explorer, meet-your-microbes
// ─────────────────────────────────────────────
const DiagramMatchingGame = ({ gameData, eventData, onComplete }) => {
  const [matches, setMatches] = useState({});
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [wrongSlots, setWrongSlots] = useState([]);
  const labels = gameData?.labels || [];
  const slots = gameData?.slots || [];

  const handleLabelClick = (label) => setSelectedLabel(selectedLabel?.id === label?.id ? null : label);
  const handleSlotClick = (slot) => {
    if (!selectedLabel) return;
    setMatches(prev => ({ ...prev, [slot?.id]: selectedLabel?.id }));
    setSelectedLabel(null);
  };
  const checkMatches = () => {
    setAttempts(a => a + 1);
    const wrong = [];
    let allCorrect = true;
    for (const slot of slots) { if (matches?.[slot?.id] !== slot?.correctLabel) { wrong?.push(slot?.id); allCorrect = false; } }
    if (allCorrect && Object.keys(matches)?.length === slots?.length) {
      setResult('success');
      setTimeout(() => onComplete({ score: eventData?.points, perfect: attempts === 0 }), 2000);
    } else { setWrongSlots(wrong); setResult('try-again'); setTimeout(() => { setResult(null); setWrongSlots([]); }, 1500); }
  };
  const usedLabels = Object.values(matches);
  return (
    <div className="space-y-4">
      <div className="bg-white/10 rounded-xl p-3 border border-white/20 text-center">
        <p className="text-white font-semibold text-sm">{gameData?.task}</p>
        <p className="text-white/60 text-xs mt-1">Click a label, then click where it belongs</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-xs text-center mb-3">Diagram</p>
          <div className="relative" style={{aspectRatio:'1'}}>
            {gameData?.diagramBg && <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">{gameData?.diagramBg}</div>}
            {slots?.map(slot => {
              const placedLabel = labels?.find(l => l?.id === matches?.[slot?.id]);
              const isWrong = wrongSlots?.includes(slot?.id);
              return (
                <button key={slot?.id} onClick={() => handleSlotClick(slot)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-lg border text-xs font-semibold transition-all
                    ${isWrong ? 'border-red-400 bg-red-900/60 text-red-200 animate-pulse' : placedLabel ? 'border-green-400/60 bg-green-900/40 text-green-200' : selectedLabel ? 'border-yellow-400 bg-yellow-500/20 text-yellow-200 hover:scale-110 cursor-pointer' : 'border-white/20 bg-white/5 text-white/40'}`}
                  style={{left:`${slot?.x}%`,top:`${slot?.y}%`}}>
                  {placedLabel ? placedLabel?.text : slot?.label || '?'}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-white/60 text-xs text-center">Labels</p>
          {labels?.map(label => {
            const isUsed = usedLabels?.includes(label?.id);
            const isSelected = selectedLabel?.id === label?.id;
            return (
              <button key={label?.id} onClick={() => !isUsed && handleLabelClick(label)}
                className={`w-full px-3 py-2 rounded-lg border text-sm font-medium text-left transition-all
                  ${isUsed ? 'border-white/10 bg-white/5 text-white/25 cursor-not-allowed' : isSelected ? 'border-yellow-400 bg-yellow-500/20 text-yellow-200 scale-105 shadow-lg shadow-yellow-500/20' : 'border-white/20 bg-white/10 text-white hover:border-white/40 cursor-pointer'}`}>
                {label?.text}{isUsed && <span className="ml-2 text-green-400 text-xs">✓ placed</span>}
              </button>
            );
          })}
        </div>
      </div>
      <AnimatePresence>
        {result === 'try-again' && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="bg-orange-500/20 border border-orange-400/50 rounded-xl p-3 text-center"><p className="text-orange-200 text-sm font-semibold">Some labels are wrong — check highlighted slots!</p></motion.div>}
        {result === 'success' && <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="bg-green-500/20 border border-green-400/50 rounded-xl p-3 text-center"><p className="text-green-200 font-bold">🎉 All labels correct! +{eventData?.points} points!</p></motion.div>}
      </AnimatePresence>
      {showHint && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-3 flex gap-2"><Lightbulb className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5"/><p className="text-yellow-200 text-sm">{gameData?.hint}</p></motion.div>}
      <div className="flex items-center justify-between">
        <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-2 text-yellow-300 text-sm"><Lightbulb className="w-4 h-4"/>{showHint ? 'Hide' : 'Hint?'}</button>
        <button onClick={checkMatches} disabled={Object.keys(matches)?.length < slots?.length} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl font-bold text-sm transition-all">Check Labels</button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TEMPERATURE DIAL GAME
// pasteur-laboratory
// ─────────────────────────────────────────────
const TemperatureDialGame = ({ gameData, eventData, onComplete }) => {
  const [dials, setDials] = useState((gameData?.dials || [])?.map(d => ({ ...d, current: d?.min })));
  const [submitted, setSubmitted] = useState(false);
  const [wrongDials, setWrongDials] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const adjustDial = (index, delta) => setDials(prev => prev?.map((d, i) => i !== index ? d : { ...d, current: Math.min(d?.max, Math.max(d?.min, Math.round((d?.current + delta) * 10) / 10)) }));
  const checkDials = () => {
    setAttempts(a => a + 1);
    const wrong = dials?.filter(d => Math.abs(d?.current - d?.target) > d?.tolerance)?.map(d => d?.id);
    if (wrong?.length === 0) { setSubmitted(true); setTimeout(() => onComplete({ score: eventData?.points, perfect: attempts === 0 }), 2000); }
    else { setWrongDials(wrong); setTimeout(() => setWrongDials([]), 1200); }
  };
  const dialColors = ['from-red-500 to-orange-500','from-blue-500 to-cyan-500','from-green-500 to-emerald-500'];
  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-xl p-4 border border-white/20 text-center"><p className="text-white font-semibold">{gameData?.task}</p></div>
      <div className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600">
        <div className="flex items-center gap-2 mb-5"><div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"/><span className="text-green-300 text-sm font-mono">PASTEUR LABORATORY — 1885</span></div>
        <div className="grid grid-cols-1 gap-5">
          {dials?.map((dial, index) => {
            const pct = ((dial?.current - dial?.min) / (dial?.max - dial?.min)) * 100;
            const isWrong = wrongDials?.includes(dial?.id);
            const isCorrect = submitted || Math.abs(dial?.current - dial?.target) <= dial?.tolerance;
            return (
              <div key={dial?.id} className={`bg-slate-900/60 rounded-xl p-4 border-2 transition-all ${isWrong ? 'border-red-500 animate-pulse' : isCorrect && submitted ? 'border-green-400' : 'border-slate-600'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div><p className="text-white font-semibold">{dial?.label}</p><p className="text-white/50 text-xs">{dial?.description}</p></div>
                  <div className={`text-2xl font-mono font-bold bg-gradient-to-r ${dialColors?.[index % dialColors?.length]} bg-clip-text text-transparent`}>{dial?.current}{dial?.unit}</div>
                </div>
                <div className="relative h-3 bg-slate-700 rounded-full mb-3">
                  <div className={`h-full rounded-full bg-gradient-to-r ${dialColors?.[index % dialColors?.length]} transition-all`} style={{width:`${pct}%`}}/>
                  <div className="absolute top-1/2 -translate-y-1/2 h-5 w-1 bg-yellow-400/60 rounded" style={{left:`${((dial?.target - dial?.min) / (dial?.max - dial?.min)) * 100}%`}}/>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-xs">{dial?.min}{dial?.unit}</span>
                  <div className="flex gap-3">
                    <button onClick={() => adjustDial(index, -dial?.step)} className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg transition-all flex items-center justify-center">−</button>
                    <button onClick={() => adjustDial(index, dial?.step)} className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg transition-all flex items-center justify-center">+</button>
                  </div>
                  <span className="text-white/40 text-xs">{dial?.max}{dial?.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {submitted && <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="bg-green-500/20 border border-green-400/50 rounded-xl p-3 text-center"><p className="text-green-200 font-bold">🧪 Perfect conditions! +{eventData?.points} points!</p></motion.div>}
      {showHint && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-3 flex gap-2"><Lightbulb className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5"/><p className="text-yellow-200 text-sm">{gameData?.hint}</p></motion.div>}
      <div className="flex justify-between items-center">
        <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-2 text-yellow-300 text-sm"><Lightbulb className="w-4 h-4"/>{showHint ? 'Hide Hint' : 'Need a Hint?'}</button>
        <button onClick={checkDials} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2">Run Experiment <CheckCircle className="w-5 h-5"/></button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SLIDER / INGREDIENT MIXING GAME
// microscope-comparison, antibiotic-assembly
// ─────────────────────────────────────────────
const SliderComparisonGame = ({ gameData, eventData, onComplete }) => {
  const [sliderValue, setSliderValue] = useState(50);
  const [mixValues, setMixValues] = useState((gameData?.ingredients || [])?.map(ing => ({ ...ing, current: 0 })));
  const [discovered, setDiscovered] = useState(false);
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleSliderExplore = (val) => { setSliderValue(val); if (val >= 75 && !discovered) setDiscovered(true); };
  const adjustMix = (index, delta) => setMixValues(prev => prev?.map((ing, i) => i !== index ? ing : { ...ing, current: Math.min(ing?.max, Math.max(0, ing?.current + delta)) }));
  const checkMix = () => {
    setAttempts(a => a + 1);
    let allCorrect = mixValues?.every(ing => Math.abs(ing?.current - ing?.target) <= ing?.tolerance);
    if (allCorrect) { setResult('success'); setTimeout(() => onComplete({ score: eventData?.points, perfect: attempts === 0 }), 2000); }
    else { setResult('wrong'); setTimeout(() => setResult(null), 1200); }
  };

  if (gameData?.mode === 'microscope') return (
    <div className="space-y-5">
      <div className="bg-white/10 rounded-xl p-4 border border-white/20 text-center"><p className="text-white font-semibold">{gameData?.task}</p><p className="text-white/60 text-sm mt-1">Drag the slider to compare views</p></div>
      <div className="relative rounded-xl overflow-hidden border-2 border-white/20" style={{aspectRatio:'16/9'}}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <div className="text-center"><svg viewBox="0 0 200 200" className="w-40 h-40 mx-auto"><defs><radialGradient id="emGrad"><stop offset="0%" stopColor="#e5e7eb"/><stop offset="100%" stopColor="#4b5563"/></radialGradient></defs><ellipse cx="100" cy="100" rx="60" ry="25" fill="url(#emGrad)"/>{Array.from({length:8})?.map((_,i) => <ellipse key={i} cx={60+i*12} cy={95+Math.sin(i)*6} rx="4" ry="2" fill="#6b7280" opacity="0.6"/>)}<text x="100" y="160" textAnchor="middle" fill="#9ca3af" fontSize="10">Electron Microscope — 1933</text></svg><p className="text-gray-400 text-xs">10,000x magnification</p></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-indigo-950 flex items-center justify-center" style={{clipPath:`inset(0 ${100-sliderValue}% 0 0)`}}>
          <div className="text-center"><svg viewBox="0 0 200 200" className="w-40 h-40 mx-auto" style={{filter:'blur(1.5px)'}}><ellipse cx="100" cy="100" rx="55" ry="22" fill="#7c3aed" opacity="0.7"/><text x="100" y="160" textAnchor="middle" fill="#a78bfa" fontSize="10">Light Microscope — 1870</text></svg><p className="text-purple-400 text-xs">1,000x magnification</p></div>
        </div>
        <div className="absolute top-0 bottom-0 w-1 bg-yellow-400" style={{left:`${sliderValue}%`,transform:'translateX(-50%)'}}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"><span className="text-black text-xs font-bold">↔</span></div>
        </div>
        <div className="absolute top-3 left-3 bg-black/60 rounded px-2 py-1 text-xs text-purple-300">Light</div>
        <div className="absolute top-3 right-3 bg-black/60 rounded px-2 py-1 text-xs text-gray-300">Electron</div>
        <input type="range" min="5" max="95" value={sliderValue} onChange={e => handleSliderExplore(Number(e?.target?.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"/>
      </div>
      {discovered && <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 text-center"><p className="text-blue-200 text-sm font-semibold">🔬 The electron microscope reveals 10x more detail!</p></motion.div>}
      <div className="flex justify-between items-center">
        <p className="text-white/50 text-sm">Drag the slider to compare</p>
        <button onClick={() => { if (discovered) { setResult('success'); setTimeout(() => onComplete({ score: eventData?.points, perfect: true }), 1000); } }} disabled={!discovered} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all">{discovered ? 'Complete Discovery!' : 'Keep Exploring...'}</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="bg-white/10 rounded-xl p-4 border border-white/20 text-center"><p className="text-white font-semibold">{gameData?.task}</p></div>
      <div className="flex justify-center">
        <div className="relative w-32 h-40">
          <svg viewBox="0 0 100 130" className="w-full h-full">
            <path d="M 35 10 L 35 50 L 15 100 Q 10 120 50 120 Q 90 120 85 100 L 65 50 L 65 10 Z" fill="none" stroke="#64748b" strokeWidth="3"/>
            <clipPath id="flaskClip"><path d="M 35 10 L 35 50 L 15 100 Q 10 120 50 120 Q 90 120 85 100 L 65 50 L 65 10 Z"/></clipPath>
            <rect x="0" y={120 - mixValues?.reduce((s,v) => s + v?.current, 0) * 0.6} width="100" height="120" fill="#22c55e" opacity="0.4" clipPath="url(#flaskClip)"/>
            <text x="50" y="70" textAnchor="middle" fill="#4ade80" fontSize="10" fontFamily="monospace">{mixValues?.reduce((s,v) => s + v?.current, 0)}ml</text>
          </svg>
        </div>
      </div>
      <div className="space-y-3">
        {mixValues?.map((ing, index) => {
          const pct = (ing?.current / ing?.max) * 100;
          const colors = ['from-green-500 to-emerald-600','from-blue-500 to-cyan-600','from-amber-500 to-orange-600'];
          return (
            <div key={ing?.id} className={`bg-white/5 rounded-xl p-4 border-2 transition-all ${result === 'wrong' && Math.abs(ing?.current - ing?.target) > ing?.tolerance ? 'border-red-400' : result === 'success' ? 'border-green-400' : 'border-white/10'}`}>
              <div className="flex items-center justify-between mb-2"><span className="text-white font-medium text-sm">{ing?.label}</span><span className={`font-mono font-bold text-lg bg-gradient-to-r ${colors?.[index % colors?.length]} bg-clip-text text-transparent`}>{ing?.current}{ing?.unit}</span></div>
              <div className="h-2 bg-white/10 rounded-full mb-3 overflow-hidden"><div className={`h-full rounded-full bg-gradient-to-r ${colors?.[index % colors?.length]} transition-all`} style={{width:`${pct}%`}}/></div>
              <div className="flex items-center justify-between">
                <span className="text-white/30 text-xs">0{ing?.unit}</span>
                <div className="flex gap-2">
                  <button onClick={() => adjustMix(index, -ing?.step)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center justify-center">−</button>
                  <button onClick={() => adjustMix(index, ing?.step)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center justify-center">+</button>
                </div>
                <span className="text-white/30 text-xs">{ing?.max}{ing?.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
      {result === 'success' && <motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-green-500/20 border border-green-400/50 rounded-xl p-3 text-center"><p className="text-green-200 font-bold">✅ Perfect formula! +{eventData?.points} points!</p></motion.div>}
      {showHint && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-3 flex gap-2"><Lightbulb className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5"/><p className="text-yellow-200 text-sm">{gameData?.hint}</p></motion.div>}
      <div className="flex justify-between items-center">
        <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-2 text-yellow-300 text-sm"><Lightbulb className="w-4 h-4"/>{showHint ? 'Hide' : 'Hint?'}</button>
        <button onClick={checkMix} className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2">Test Formula <CheckCircle className="w-5 h-5"/></button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// CRISPR SNIP & REPLACE GAME
// gene-splicing, gene-editor
// ─────────────────────────────────────────────
const CrisprSnipGame = ({ gameData, eventData, onComplete }) => {
  const [phase, setPhase] = useState('find');
  const [selectedBases, setSelectedBases] = useState([]);
  const [insertedGene, setInsertedGene] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [wrongSelection, setWrongSelection] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const dnaSequence = gameData?.sequence || [];
  const targetSequence = gameData?.targetSequence || [];
  const insertOptions = gameData?.insertOptions || [];
  const correctInsert = gameData?.correctInsert;

  const toggleBase = (index) => { if (phase !== 'find') return; setSelectedBases(prev => prev?.includes(index) ? prev?.filter(i => i !== index) : [...prev, index]); };
  const checkCut = () => {
    setAttempts(a => a + 1);
    const sorted = [...selectedBases]?.sort((a, b) => a - b);
    const isCorrect = sorted?.length === targetSequence?.length && sorted?.every((idx, i) => dnaSequence?.[idx] === targetSequence?.[i]);
    if (isCorrect) { setPhase('insert'); }
    else { setWrongSelection(true); setTimeout(() => setWrongSelection(false), 1000); }
  };
  const handleInsert = (option) => {
    setInsertedGene(option?.id);
    if (option?.id === correctInsert) { setPhase('done'); setTimeout(() => onComplete({ score: eventData?.points, perfect: attempts === 0 }), 2000); }
    else setTimeout(() => setInsertedGene(null), 1000);
  };
  const baseColors = { A:'bg-red-500', T:'bg-blue-500', G:'bg-green-500', C:'bg-yellow-500' };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {['find','cut','insert','done']?.map((p, i) => (
          <React.Fragment key={p}>
            <div className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${phase === p || (phase === 'insert' && p === 'cut') || phase === 'done' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/40'}`}>{i+1}. {p === 'find' ? 'Find Target' : p === 'cut' ? 'Cut DNA' : p === 'insert' ? 'Insert Gene' : 'Complete!'}</div>
            {i < 3 && <ArrowRight className="w-3 h-3 text-white/30"/>}
          </React.Fragment>
        ))}
      </div>
      <div className="bg-white/10 rounded-xl p-4 border border-white/20 text-center">
        <p className="text-white font-semibold text-sm">{phase === 'find' ? `Select the target sequence: ${targetSequence?.join('-')}` : phase === 'insert' ? 'Cut made! Choose the correct gene to insert:' : phase === 'done' ? '🎉 Gene successfully edited!' : 'Select the target bases'}</p>
      </div>
      <div className="bg-black/40 rounded-xl p-5 border border-white/10">
        <p className="text-white/50 text-xs text-center mb-4">DNA Strand — click bases to select</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {dnaSequence?.map((base, index) => (
            <motion.button key={index} onClick={() => toggleBase(index)} whileHover={phase === 'find' ? {scale:1.15} : {}} whileTap={phase === 'find' ? {scale:0.9} : {}}
              className={`w-10 h-10 rounded-lg font-bold text-white text-sm transition-all ${selectedBases?.includes(index) ? `${baseColors?.[base]} ring-2 ring-white shadow-lg scale-110` : `${baseColors?.[base]} opacity-80 ${phase === 'find' ? 'cursor-pointer hover:opacity-100' : 'cursor-default opacity-60'}`}`}>
              {base}
            </motion.button>
          ))}
        </div>
        <div className="flex justify-center gap-3 mt-4">
          {Object.entries(baseColors)?.map(([base, color]) => <div key={base} className="flex items-center gap-1"><div className={`w-3 h-3 rounded ${color}`}/><span className="text-white/50 text-xs">{base}</span></div>)}
        </div>
      </div>
      {phase === 'find' && (
        <div className="space-y-2">
          {wrongSelection && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-red-300 text-center text-sm">Wrong sequence — look for {targetSequence?.join('-')}!</motion.p>}
          <div className="flex justify-between items-center">
            <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-2 text-yellow-300 text-sm"><Lightbulb className="w-4 h-4"/>{showHint ? 'Hide' : 'Hint?'}</button>
            <button onClick={checkCut} disabled={selectedBases?.length === 0} className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-bold transition-all">✂️ Cut Here!</button>
          </div>
        </div>
      )}
      {phase === 'insert' && (
        <div className="space-y-3">
          <p className="text-white/70 text-sm text-center">Which gene should be inserted at the cut site?</p>
          <div className="grid grid-cols-2 gap-3">
            {insertOptions?.map(option => (
              <motion.button key={option?.id} onClick={() => handleInsert(option)} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                className={`p-4 rounded-xl border-2 text-left transition-all ${insertedGene === option?.id && option?.id !== correctInsert ? 'border-red-400 bg-red-900/40' : insertedGene === option?.id && option?.id === correctInsert ? 'border-green-400 bg-green-900/40' : 'border-white/20 bg-white/5 hover:border-purple-400 hover:bg-purple-900/20'}`}>
                <p className="text-white font-bold text-sm mb-1">{option?.name}</p>
                <p className="text-white/60 text-xs">{option?.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      )}
      {phase === 'done' && <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="bg-green-500/20 border border-green-400/50 rounded-xl p-4 text-center"><p className="text-green-200 font-bold">🧬 Gene edit successful! +{eventData?.points} points!</p></motion.div>}
      {showHint && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-3 flex gap-2"><Lightbulb className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5"/><p className="text-yellow-200 text-sm">{gameData?.hint}</p></motion.div>}
    </div>
  );
};

// ─────────────────────────────────────────────
// MICROSCOPE FOCUS GAME (original, preserved)
// ─────────────────────────────────────────────
const MicroscopeFocusGame = ({ gameData, eventData, onComplete, focusLevel, targetFocus, onAdjust, attempts }) => {
  const blurAmount = Math.min(Math.abs(focusLevel - targetFocus) / 2, 20);
  const isClose = Math.abs(focusLevel - targetFocus) <= 10;
  const renderShape = (type) => {
    const shapes = {
      rod: <svg className="w-12 h-12" viewBox="0 0 100 100"><rect x="30" y="20" width="40" height="60" rx="20" fill="#10b981" stroke="#059669" strokeWidth="3"/></svg>,
      sphere: <svg className="w-12 h-12" viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="#3b82f6" stroke="#2563eb" strokeWidth="3"/></svg>,
      spiral: <svg className="w-12 h-12" viewBox="0 0 100 100"><path d="M 30 50 Q 40 30, 50 50 T 70 50" stroke="#a855f7" strokeWidth="8" fill="none" strokeLinecap="round"/><path d="M 30 50 Q 40 70, 50 50 T 70 50" stroke="#9333ea" strokeWidth="8" fill="none" strokeLinecap="round"/></svg>,
    };
    return shapes?.[type] || shapes?.sphere;
  };
  return (
    <div className="space-y-6">
      <div className="bg-black/40 rounded-2xl p-6 border-4 border-gray-700 relative overflow-hidden">
        <div className="w-64 h-64 mx-auto rounded-full border-8 border-gray-600 overflow-hidden relative bg-black flex items-center justify-center" style={{filter:`blur(${blurAmount}px)`}}>
          <div className="w-full h-full bg-gradient-to-br from-green-900 to-teal-900 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-48 h-48">
              <circle cx="60" cy="80" r="20" fill="#22c55e" opacity="0.8"/>
              <ellipse cx="100" cy="60" rx="8" ry="25" fill="#16a34a" opacity="0.9"/>
              <path d="M 120 100 Q 140 80, 160 100 T 200 100" stroke="#4ade80" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <circle cx="140" cy="130" r="15" fill="#15803d" opacity="0.7"/>
            </svg>
          </div>
        </div>
        <div className="absolute top-3 right-3 bg-black/60 rounded-lg px-2 py-1"><span className={`text-xs font-mono ${isClose ? 'text-green-400' : 'text-white/60'}`}>{isClose ? '✓ FOCUSED' : 'Blurry...'}</span></div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-white/70"><span>Focus Level: {focusLevel}</span><span className={isClose ? 'text-green-400 font-bold' : 'text-white/40'}>{isClose ? 'Perfect Range!' : 'Keep adjusting...'}</span></div>
        <div className="w-full bg-white/10 rounded-full h-3"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-200" style={{width:`${focusLevel}%`}}/></div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => onAdjust('down')} className="w-14 h-14 bg-blue-800/50 hover:bg-blue-700/50 border-2 border-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold transition-all hover:scale-105">−</button>
          <button onClick={() => { if (isClose) onComplete({ score: eventData?.points, perfect: attempts === 0 }); }} disabled={!isClose} className="px-6 h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all text-sm">{isClose ? 'Lock Focus! ✓' : 'Not Sharp Yet'}</button>
          <button onClick={() => onAdjust('up')} className="w-14 h-14 bg-blue-800/50 hover:bg-blue-700/50 border-2 border-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold transition-all hover:scale-105">+</button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// BACTERIA DRAWING GAME (original, preserved)
// ─────────────────────────────────────────────
const BacteriaDrawingGame = ({ gameData, eventData, onComplete, selectedShapes, requiredShapes, onToggle, attempts }) => {
  const [showHint, setShowHint] = useState(false);
  const renderShape = (type) => {
    const shapes = {
      rod: <svg className="w-16 h-16" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="12" ry="38" fill="#1a5c3a" opacity="0.85"/><ellipse cx="48" cy="48" rx="10" ry="36" fill="#2d7a4f" opacity="0.7"/></svg>,
      sphere: <svg className="w-16 h-16" viewBox="0 0 100 100"><defs><radialGradient id="sg"><stop offset="0%" stopColor="#1e4a7a"/><stop offset="100%" stopColor="#081829"/></radialGradient></defs><circle cx="50" cy="50" r="35" fill="url(#sg)" opacity="0.9"/><ellipse cx="42" cy="42" rx="12" ry="10" fill="#3b6fa8" opacity="0.4"/></svg>,
      spiral: <svg className="w-16 h-16" viewBox="0 0 100 100"><path d="M 25 50 Q 35 25, 50 50 T 75 50" stroke="#7c3aed" strokeWidth="8" fill="none" strokeLinecap="round"/><path d="M 25 50 Q 35 75, 50 50 T 75 50" stroke="#6d28d9" strokeWidth="8" fill="none" strokeLinecap="round"/></svg>,
    };
    return shapes?.[type] || shapes?.sphere;
  };
  const checkDrawing = () => {
    const allSelected = requiredShapes?.every(s => selectedShapes?.includes(s));
    const noExtras = selectedShapes?.length === requiredShapes?.length;
    if (allSelected && noExtras) onComplete({ score: eventData?.points, perfect: attempts === 0 });
  };
  return (
    <div className="space-y-6">
      <div className="bg-amber-900/30 border border-amber-600 rounded-xl p-4"><p className="text-amber-200 text-center text-sm font-semibold">🔬 Leeuwenhoek observed these shapes — select all three!</p></div>
      <div className="grid grid-cols-3 gap-4">
        {['rod','sphere','spiral']?.map(shape => (
          <motion.button key={shape} onClick={() => onToggle(shape)} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
            className={`relative rounded-xl p-4 border-4 transition-all flex flex-col items-center gap-2 ${selectedShapes?.includes(shape) ? 'border-green-400 bg-green-900/40 shadow-lg shadow-green-500/30' : 'border-white/20 bg-white/5 hover:border-white/40'}`}>
            <div className="bg-white/10 rounded-lg p-2">{renderShape(shape)}</div>
            <span className="text-white font-bold text-sm capitalize">{shape}</span>
            {selectedShapes?.includes(shape) && <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute top-2 right-2 bg-green-500 rounded-full p-1"><CheckCircle className="w-4 h-4 text-white"/></motion.div>}
          </motion.button>
        ))}
      </div>
      <div className="bg-purple-700/30 border border-purple-500 rounded-lg p-3 text-center"><p className="text-purple-200 text-sm">Selected: {selectedShapes?.length} of {requiredShapes?.length} shapes</p></div>
      {showHint && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-3 flex gap-2"><Lightbulb className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5"/><p className="text-yellow-200 text-sm">{gameData?.hint}</p></motion.div>}
      <div className="flex justify-between items-center">
        <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-2 text-yellow-300 text-sm"><Lightbulb className="w-4 h-4"/>{showHint ? 'Hide' : 'Hint?'}</button>
        <button onClick={checkDrawing} disabled={selectedShapes?.length === 0} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all">Submit</button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN MINIGAME COMPONENT
// ─────────────────────────────────────────────
const MiniGame = ({ id, eventData, onComplete, onClose }) => {
  const [gameState, setGameState] = useState('instructions');
  const [attempts, setAttempts] = useState(0);
  const [gameData, setGameData] = useState({});
  const [focusLevel, setFocusLevel] = useState(0);
  const [targetFocus] = useState(45 + Math.floor(Math.random() * 10));
  const [selectedShapes, setSelectedShapes] = useState([]);
  const requiredShapes = ['rod','sphere','spiral'];

  useEffect(() => { initializeGame(id); }, [id]);

  const initializeGame = (gameId) => {
    const games = {
      'microscope-focus': { title:'Focus the Microscope', instructions:'Help Leeuwenhoek focus his homemade microscope to see the "animalcules" — living microorganisms!', task:'Adjust the focus dial until the image becomes sharp.', hint:'Move the focus slowly — tiny adjustments make a big difference!' },
      'bacteria-drawing': { title:'Identify Bacterial Shapes', instructions:'Leeuwenhoek sketched what he saw. Help him identify the three main shapes of bacteria!', task:'Select all three bacterial shapes he observed.', hint:'Look for a stick shape (rod), ball shape (sphere), and twisted shape (spiral)!' },
      'vaccination-timeline': { title:"Jenner\'s Vaccination Process", instructions:"Edward Jenner discovered cowpox could protect from deadly smallpox!", task:'Drag the steps into the correct order.', steps:['Observe milkmaids with cowpox were immune to smallpox','Collect cowpox material from an infected milkmaid','Inject cowpox into young James Phipps','Wait for James to recover from mild cowpox','Expose James to smallpox — he stays healthy!','Report findings to the Royal Society'], hint:"Think: observe first, then test your theory!" },
      'swan-flask-experiment': { title:"Pasteur\'s Swan Flask", instructions:"Pasteur designed an experiment to disprove spontaneous generation!", task:"Order the steps of Pasteur\'s experiment.", steps:['Fill flasks with nutrient broth','Boil the broth to kill all microbes','Seal one flask with a curved swan neck','Leave one flask open to the air','Wait several weeks and observe','Curved neck flask stays clear — microbes blocked!'], hint:"The S-shaped neck lets air in but traps dust carrying microbes!" },
      'kochs-postulates': { title:"Koch\'s Four Postulates", instructions:"Robert Koch developed four rules to prove a microbe causes disease!", task:"Arrange Koch\'s four postulates in order.", steps:['Find the microbe in every sick animal','Isolate the microbe and grow it in pure culture','Inject the pure culture into a healthy animal','Find the same microbe in the newly sick animal'], hint:"Find the suspect, isolate it, test it, confirm it!" },
      'dna-copying': { title:'PCR — Copying DNA', instructions:"Kary Mullis invented PCR — a way to make millions of copies of DNA!", task:'Order the PCR cycle steps correctly.', steps:['Heat DNA to 95°C — strands separate','Cool to 55°C — primers attach to each strand','Warm to 72°C — DNA polymerase builds new strands','Each original strand now has a copy','Repeat the cycle 30-40 times','Over 1 billion copies produced!'], hint:"Heat to separate, cool to prime, warm to copy — repeat!" },
      'vaccine-development': { title:'mRNA Vaccine Development', instructions:"Scientists developed COVID-19 vaccine in 11 months using mRNA technology!", task:'Order the mRNA vaccine development steps.', steps:['Sequence the virus genome to find target protein','Design mRNA instructions for the spike protein','Wrap mRNA in lipid nanoparticles for delivery','Test safety in clinical trials','Manufacture and distribute globally','Immune system learns to fight the real virus!'], hint:"Design → protect → test → produce!" },
      'outbreak-mapping': { title:'Map the Cholera Outbreak', instructions:"Dr. John Snow mapped cholera patients to find the contaminated pump!", task:'Click on all sick households near the water pump.', sceneType:'outbreak-map', targets:[{id:1,x:38,y:45,radius:7},{id:2,x:55,y:38,radius:7},{id:3,x:62,y:52,radius:7},{id:4,x:45,y:55,radius:7},{id:5,x:58,y:30,radius:7},{id:6,x:48,y:42,radius:7}], requiredCount:6, hint:"Look for clusters of illness near a single water source!" },
      'operating-room-cleaning': { title:"Lister\'s Antiseptic Procedure", instructions:"Before Lister, half of surgical patients died from infection!", task:'Click on all contaminated items to clean them.', sceneType:'operating-room', targets:[{id:1,x:20,y:30,icon:'🗡️'},{id:2,x:75,y:25,icon:'✂️'},{id:3,x:50,y:50,icon:'🩺'},{id:4,x:30,y:65,icon:'🧪'},{id:5,x:70,y:65,icon:'🩹'},{id:6,x:85,y:50,icon:'💊'}], requiredCount:6, hint:"Sterilize all surgical instruments — bacteria hide everywhere!" },
      'petri-dish-detective': { title:"Fleming\'s Petri Dish", instructions:"Fleming noticed mold killing bacteria in his petri dish!", task:'Click only on bacterial colonies (blue), not fungal mold (yellow).', sceneType:'petri-dish', targets:[{id:1,x:25,y:30,type:'bacteria',size:'18%'},{id:2,x:65,y:25,type:'bacteria',size:'14%'},{id:3,x:75,y:65,type:'bacteria',size:'16%'},{id:4,x:30,y:70,type:'bacteria',size:'12%'},{id:5,x:50,y:50,type:'fungi',size:'20%'},{id:6,x:45,y:75,type:'fungi',size:'15%'}], requiredCount:4, hint:"Bacterial colonies are smooth and round — don't click fuzzy fungal spots!" },
      'virus-hunter': { title:'Hunt the HIV Virus', instructions:"Luc Montagnier identified HIV in 1983 — one of the fastest virus discoveries!", task:'Find and click all the virus particles.', sceneType:'virus-hunt', targets:[{id:1,x:20,y:25},{id:2,x:70,y:20},{id:3,x:45,y:50},{id:4,x:80,y:60},{id:5,x:15,y:70}], requiredCount:5, hint:"Viruses are smaller than cells — look for tiny glowing particles!" },
      'dna-building': { title:'DNA Base Pairing', instructions:"Franklin's Photo 51 revealed DNA's structure. DNA has specific base-pairing rules!", task:'Match each DNA base to its correct partner.', diagramBg:'🧬', labels:[{id:'T',text:'Thymine (T)'},{id:'G',text:'Guanine (G)'},{id:'A2',text:'Adenine (A)'},{id:'C2',text:'Cytosine (C)'}], slots:[{id:'slot-A',label:'A pairs with ___',x:25,y:25,correctLabel:'T'},{id:'slot-C',label:'C pairs with ___',x:75,y:25,correctLabel:'G'},{id:'slot-T',label:'T pairs with ___',x:25,y:70,correctLabel:'A2'},{id:'slot-G',label:'G pairs with ___',x:75,y:70,correctLabel:'C2'}], hint:"Remember: A-T are a pair, C-G are a pair!" },
      'double-helix-building': { title:'Double Helix Assembly', instructions:"Watson and Crick built the first DNA double helix model using metal plates!", task:'Label the parts of the DNA double helix.', diagramBg:'🧬', labels:[{id:'backbone',text:'Sugar-Phosphate Backbone'},{id:'bases',text:'Base Pairs (rungs)'},{id:'helix',text:'Double Helix Twist'},{id:'hydrogen',text:'Hydrogen Bonds'}], slots:[{id:'slot-1',label:'Outer rails',x:20,y:30,correctLabel:'backbone'},{id:'slot-2',label:'Inner steps',x:75,y:30,correctLabel:'bases'},{id:'slot-3',label:'Overall shape',x:20,y:70,correctLabel:'helix'},{id:'slot-4',label:'Hold bases',x:75,y:70,correctLabel:'hydrogen'}], hint:"Think of DNA like a twisted ladder — rails are the backbone, rungs are the base pairs!" },
      'microbiome-explorer': { title:"Your Body\'s Microbiome", instructions:"Your body has more microbial cells than human cells! Different microbes live in different parts.", task:'Match each microbe to where it lives in your body.', diagramBg:'🧍', labels:[{id:'lactobacillus',text:'Lactobacillus'},{id:'streptococcus',text:'Streptococcus salivarius'},{id:'staphylococcus',text:'Staphylococcus epidermidis'},{id:'bifido',text:'Bifidobacterium'}], slots:[{id:'gut',label:'Small intestine',x:50,y:65,correctLabel:'lactobacillus'},{id:'mouth',label:'Mouth',x:50,y:20,correctLabel:'streptococcus'},{id:'skin',label:'Skin surface',x:15,y:50,correctLabel:'staphylococcus'},{id:'colon',label:'Large intestine',x:75,y:75,correctLabel:'bifido'}], hint:"Think about which bacteria help with digestion vs. protect skin!" },
      'meet-your-microbes': { title:'Meet Your Helpful Microbes', instructions:"Scientists discover 15,000 new microbial species every year! Most are helpful!", task:'Match each helpful microbe to what it does for your body.', diagramBg:'🦠', labels:[{id:'digestion',text:'Helps digest food'},{id:'vitamins',text:'Produces Vitamin K'},{id:'immune',text:'Trains immune system'},{id:'protection',text:'Blocks harmful bacteria'}], slots:[{id:'lacto',label:'Lactobacillus',x:25,y:25,correctLabel:'digestion'},{id:'ecoli',label:'E. coli (harmless)',x:75,y:25,correctLabel:'vitamins'},{id:'bifido',label:'Bifidobacterium',x:25,y:75,correctLabel:'immune'},{id:'strepto',label:'S. salivarius',x:75,y:75,correctLabel:'protection'}], hint:"Each microbe has a specialized role — think about where they live!" },
      'pasteur-laboratory': { title:"Pasteur\'s Rabies Vaccine Lab", instructions:"In 1885, Pasteur developed the first rabies vaccine by growing weakened virus in rabbit spinal cords!", task:'Set the correct temperature, pH, and incubation time to grow the weakened virus.', dials:[{id:'temp',label:'Incubator Temperature',description:'Must be close to body temperature',unit:'°C',min:25,max:45,step:1,target:37,tolerance:1,current:25},{id:'ph',label:'Culture pH Level',description:'Neutral pH keeps virus viable',unit:' pH',min:5.0,max:9.0,step:0.5,target:7.0,tolerance:0.5,current:5.0},{id:'days',label:'Incubation Days',description:'Time to weaken the virus',unit:' days',min:1,max:21,step:1,target:14,tolerance:1,current:1}], hint:"Body temp is 37°C, neutral pH is 7.0, and Pasteur dried preparations for about 2 weeks!" },
      'microscope-comparison': { title:"Ruska\'s Electron Microscope", instructions:"In 1933, Ernst Ruska invented the electron microscope — able to see viruses for the first time!", task:'Drag the slider to compare light vs electron microscope views.', mode:'microscope', hint:"Slide all the way right to see incredible detail the electron microscope reveals!" },
      'antibiotic-assembly': { title:'Mass-Producing Penicillin', instructions:"Florey and Chain cracked the formula in 1940 — mixing exact amounts to grow massive quantities of Penicillium mold!", task:'Mix the exact formula to produce penicillin.', ingredients:[{id:'sugar',label:'Glucose (carbon source)',unit:'ml',min:0,max:100,step:5,target:50,tolerance:5,start:0},{id:'nitrogen',label:'Corn Steep Liquor (nitrogen)',unit:'ml',min:0,max:60,step:5,target:30,tolerance:5,start:0},{id:'minerals',label:'Mineral Salts',unit:'ml',min:0,max:40,step:5,target:20,tolerance:5,start:0}], hint:"The ratio is 5:3:2 — 50ml glucose, 30ml nitrogen, 20ml mineral salts!" },
      'gene-splicing': { title:'Boyer & Cohen: First Gene Splicing', instructions:"In 1973, Boyer and Cohen performed the first successful gene splicing, creating recombinant DNA!", task:'Find the restriction enzyme cut site, cut it, then insert the correct gene.', sequence:['A','T','G','G','A','A','T','T','C','G','C','T','A','C'], targetSequence:['G','A','A','T','T','C'], insertOptions:[{id:'insulin',name:'Human Insulin Gene',description:'Makes bacteria produce life-saving insulin'},{id:'random',name:'Random Sequence',description:'This is what we just removed!'},{id:'toxin',name:'Bacterial Toxin Gene',description:'Would make bacteria dangerous'},{id:'marker',name:'GFP Marker Gene',description:'Makes cells glow green'}], correctInsert:'insulin', hint:"EcoRI cuts at G-A-A-T-T-C. Boyer and Cohen inserted the insulin gene!" },
      'gene-editor': { title:'CRISPR Gene Editing', instructions:"In 2012, Doudna and Charpentier developed CRISPR-Cas9 — molecular scissors to edit any gene!", task:'Find the mutated sequence, cut it out, and insert the healthy version.', sequence:['C','T','G','A','C','T','G','A','C','T','T','G','A','C','T'], targetSequence:['A','C','T','T','G'], insertOptions:[{id:'healthy',name:'Healthy Gene Sequence',description:'The correct, working version'},{id:'mutated',name:'Same Mutated Sequence',description:'This is what we just removed!'},{id:'wrong',name:'Random Gene Fragment',description:'Would not fix the mutation'},{id:'marker',name:'Fluorescent Marker',description:'Good for tracking, not treatment'}], correctInsert:'healthy', hint:"The mutation is in the A-C-T-T-G section — replace it with the healthy copy!" },
    };
    setGameData(games?.[gameId] || games?.['microscope-focus']);
  };

  const startGame = () => {
    setGameState('playing');
    setAttempts(0);
    if (id === 'microscope-focus') setFocusLevel(0);
    if (id === 'bacteria-drawing') setSelectedShapes([]);
  };

  const adjustFocus = (direction) => setFocusLevel(prev => direction === 'up' ? Math.min(prev + 5, 100) : Math.max(prev - 5, 0));

  const handleComplete = (result) => {
    setGameState('success');
    setTimeout(() => onComplete({ eventId: eventData?.id, score: result?.score, perfect: result?.perfect }), 2000);
  };

  const isDragDropGame = ['vaccination-timeline','swan-flask-experiment','kochs-postulates','dna-copying','vaccine-development']?.includes(id);
  const isSpotClickGame = ['outbreak-mapping','operating-room-cleaning','petri-dish-detective','virus-hunter']?.includes(id);
  const isDiagramGame = ['dna-building','double-helix-building','microbiome-explorer','meet-your-microbes']?.includes(id);
  const isDialGame = ['pasteur-laboratory']?.includes(id);
  const isSliderGame = ['microscope-comparison','antibiotic-assembly']?.includes(id);
  const isCrisprGame = ['gene-splicing','gene-editor']?.includes(id);

  const getGameIcon = () => {
    if (isDragDropGame) return '📋';
    if (isSpotClickGame) return '🔍';
    if (isDiagramGame) return '🧬';
    if (isDialGame) return '🧪';
    if (isSliderGame) return id === 'microscope-comparison' ? '🔬' : '⚗️';
    if (isCrisprGame) return '✂️';
    if (id === 'microscope-focus') return '🔬';
    if (id === 'bacteria-drawing') return '🦠';
    return '🔬';
  };

  const renderGameContent = () => {
    if (id === 'microscope-focus') return <MicroscopeFocusGame gameData={gameData} eventData={eventData} onComplete={handleComplete} focusLevel={focusLevel} targetFocus={targetFocus} onAdjust={adjustFocus} attempts={attempts}/>;
    if (id === 'bacteria-drawing') return <BacteriaDrawingGame gameData={gameData} eventData={eventData} onComplete={handleComplete} selectedShapes={selectedShapes} requiredShapes={requiredShapes} onToggle={(s) => setSelectedShapes(prev => prev?.includes(s) ? prev?.filter(x => x !== s) : [...prev, s])} attempts={attempts}/>;
    if (isDragDropGame) return <DragDropOrderingGame gameData={gameData} eventData={eventData} onComplete={handleComplete}/>;
    if (isSpotClickGame) return <SpotClickGame gameData={gameData} eventData={eventData} onComplete={handleComplete}/>;
    if (isDiagramGame) return <DiagramMatchingGame gameData={gameData} eventData={eventData} onComplete={handleComplete}/>;
    if (isDialGame) return <TemperatureDialGame gameData={gameData} eventData={eventData} onComplete={handleComplete}/>;
    if (isSliderGame) return <SliderComparisonGame gameData={gameData} eventData={eventData} onComplete={handleComplete}/>;
    if (isCrisprGame) return <CrisprSnipGame gameData={gameData} eventData={eventData} onComplete={handleComplete}/>;
    return (
      <div className="space-y-6 text-center">
        <div className="bg-white/5 border-2 border-white/20 rounded-xl p-12">
          <div className="text-6xl mb-4">{getGameIcon()}</div>
          <h3 className="text-xl font-bold text-white mb-3">{gameData?.task}</h3>
          <p className="text-white/70 mb-6">{gameData?.instructions}</p>
          <button onClick={() => { setAttempts(a => a+1); if (Math.random() > 0.3) handleComplete({ score: eventData?.points, perfect: attempts === 0 }); else { setGameState('try-again'); setTimeout(() => setGameState('playing'), 1500); }}}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all">Complete Activity</button>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <motion.div className="relative w-full max-w-4xl mx-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} exit={{scale:0.9,y:20}}>
          <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"><X className="w-6 h-6 text-white"/></button>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
            <div className="text-3xl mb-2">{getGameIcon()}</div>
            <h2 className="text-2xl font-bold text-white mb-1">{gameData?.title}</h2>
            <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-300"/>{eventData?.year}</span>
              <span>•</span><span>{eventData?.scientist}</span>
            </div>
          </div>
          <div className="p-6">
            {gameState === 'instructions' && (
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="space-y-6 text-center">
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">How to Play</h3>
                  <p className="text-white/90 leading-relaxed mb-4">{gameData?.instructions}</p>
                  <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3"><p className="text-yellow-200 font-semibold text-sm">Task: {gameData?.task}</p></div>
                </div>
                <button onClick={startGame} className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all flex items-center gap-3 mx-auto">Start Mini-Game <ArrowRight className="w-6 h-6"/></button>
                <p className="text-white/50 text-sm flex items-center justify-center gap-2"><Lightbulb className="w-4 h-4"/> Earn {eventData?.points} points!</p>
              </motion.div>
            )}
            {gameState === 'playing' && <motion.div initial={{opacity:0}} animate={{opacity:1}}>{renderGameContent()}</motion.div>}
            {gameState === 'try-again' && (
              <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="text-center">
                <div className="bg-orange-500/20 border-2 border-orange-400/50 rounded-xl p-8">
                  <div className="text-5xl mb-4">🔄</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Almost There!</h3>
                  <p className="text-white/80">Science takes practice — keep trying!</p>
                </div>
              </motion.div>
            )}
            {gameState === 'success' && (
              <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="text-center">
                <div className="bg-green-500/20 border-2 border-green-400/50 rounded-xl p-8">
                  <motion.div animate={{rotate:[0,360],scale:[1,1.2,1]}} transition={{duration:0.6}} className="inline-block mb-4"><CheckCircle className="w-20 h-20 text-green-400"/></motion.div>
                  <h3 className="text-3xl font-bold text-white mb-3">Excellent Work!</h3>
                  <p className="text-white/90 mb-4">You've completed {eventData?.title}!</p>
                  <div className="bg-white/10 rounded-lg p-4 inline-block mb-4"><div className="flex items-center gap-3 text-yellow-300"><Star className="w-8 h-8"/><span className="text-3xl font-bold">+{eventData?.points}</span><span className="text-xl">points</span></div></div>
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4"><p className="text-blue-200 text-sm"><strong>Fun Fact:</strong> {eventData?.fact}</p></div>
                </div>
              </motion.div>
            )}
          </div>
          <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 p-4 text-center"><p className="text-white/50 text-sm">{eventData?.year} • {eventData?.scientist}</p></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MiniGame;
