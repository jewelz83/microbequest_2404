import React from 'react';
import Organism from './Organism';
import {neighbors,positionAt,cameraFor} from './pond.mjs';
export default function PondScene({state,selected,width,motion,onTravel,onChoose,onKeys,onRelease,sceneRef}){
 const camera=cameraFor(state.player,width,width===640?480:540);
 const pointer=e=>{const neighbor=e.target.closest('[data-neighbor]');if(neighbor){onChoose(neighbor.getAttribute('data-neighbor'));return;}const r=e.currentTarget.getBoundingClientRect();onTravel({x:camera.x+(e.clientX-r.left)/r.width*camera.width,y:camera.y+(e.clientY-r.top)/r.height*camera.height});e.currentTarget.focus({preventScroll:true});};
 return <div className={`pd-scene ${width===640?'pd-scene-mobile':''} ${motion?'':'pd-reduced'}`} ref={sceneRef} tabIndex={0} role="group" aria-label="Pond exploration field. Arrow keys move your craft. Click or tap open water to travel." onClick={pointer} onKeyDown={onKeys} onKeyUp={onRelease} onBlur={()=>onRelease(null)}>
 <svg viewBox={`${camera.x} ${camera.y} ${camera.width} ${camera.height}`} aria-hidden="true">
 <defs><radialGradient id="pd-water"><stop stopColor="#167a86"/><stop offset="1" stopColor="#082e46"/></radialGradient><radialGradient id="pd-light"><stop stopColor="#d4f4a2" stopOpacity=".28"/><stop offset="1" stopColor="#c7f9cf" stopOpacity="0"/></radialGradient><linearGradient id="pd-leaf" x2="1" y2="1"><stop stopColor="#59794d"/><stop offset="1" stopColor="#1c4b43"/></linearGradient></defs>
 <path d="M0 0H1600V900H0z" fill="url(#pd-water)"/><ellipse cx="1220" cy="190" rx="380" ry="270" fill="url(#pd-light)"/>
 {Array.from({length:100},(_,i)=><circle key={i} cx={40+(i*137)%1520} cy={40+(i*89)%820} r={1+i%4} fill={i%3?'#b7e4d0':'#dbeaae'} opacity={.08+(i%4)*.035}/>)}
 <g opacity=".5" stroke="#71a88b" fill="none" strokeWidth="7">{[80,170,1400,1510].map((x,i)=><path key={x} d={`M${x} 900q-40-180 20-320t-20-290m10 280q-65-45-65-110m55 175q80-70 75-150`}/>)}</g>
 <path d="M400 430Q580 255 885 420Q705 640 400 430Z" fill="url(#pd-leaf)" stroke="#89a77a" strokeWidth="3"/>
 <path d="M405 432Q600 420 875 421M510 425l46-68m35 63 48-80m-10 85 50 75m-155-70 58 75m114-84 85-45" fill="none" stroke="#89a77a" strokeWidth="3" opacity=".55"/>
 <text x="610" y="455" textAnchor="middle" fill="#c4d9b8" fontSize="17">A submerged leaf</text>
 <g opacity=".45">{[0,1,2,3,4,5,6,7].map(i=><g key={i} transform={`translate(${1080+i*30} ${690+Math.sin(i)*30}) rotate(${i*35})`}><ellipse rx="5" ry="2.5" fill="#f0deb2"/></g>)}</g>
 {neighbors.map(n=>{const p=positionAt(n.id,state.clock);return <g key={n.id} transform={`translate(${p.x} ${p.y}) rotate(${p.angle})`} data-neighbor={n.id}><ellipse rx="110" ry="75" fill={selected===n.id?'#e3f9cf0d':'transparent'} stroke={selected===n.id?'#fef08a':'#b1f2d066'} strokeWidth={selected===n.id?2:1} strokeDasharray="5 8"/><Organism id={n.id} still={!motion||state.paused} highlight={state.features.includes(n.id)}/><text y="76" textAnchor="middle" fill="#e1f7ec" fontSize="17">{state.seen.includes(n.id)?n.name:n.id==='paramecium'?'Rippling swimmer':'Green swimmer'}</text></g>;})}
 {state.route.length>0&&<g><path d={`M${state.player.x} ${state.player.y}${state.route.map(p=>`L${p.x} ${p.y}`).join('')}`} fill="none" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="6 9" opacity=".5"/><circle cx={state.route[state.route.length-1].x} cy={state.route[state.route.length-1].y} r="12" fill="none" stroke="#fde68a" strokeWidth="2"/></g>}
 <g transform={`translate(${state.player.x} ${state.player.y})`}><circle r="40" fill="#c4b5fd0a" stroke="#c4b5fd40"/><ellipse rx="29" ry="19" fill="#a78bfa" stroke="#e9d5ff" strokeWidth="3"/><ellipse cx="7" rx="12" ry="11" fill="#1c4260" stroke="#c4efff" strokeWidth="2"/><path d="M-30-10l-15-8v36l15-9" fill="#7c3aed" stroke="#ddd6fe" strokeWidth="2"/><text y="45" textAnchor="middle" fill="#f5eaff" fontSize="14">Your craft</text></g>
 </svg><span className="pd-model-label">Illustrated living-world model · not to scale</span>
 </div>;
}
