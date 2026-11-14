import React from 'react';
export default function Organism({id,highlight=false,still=false}){
 return <g className={`pd-organism ${still?'pd-still':''} ${highlight?'pd-highlight':''}`}>
 {id==='paramecium'?<>
  <path d="M-72 0C-71-31-27-43 23-30S80 8 57 28-66 40-72 0Z" fill="#c5dfd6" fillOpacity=".8" stroke="#ecfeff" strokeWidth="2"/>
  {Array.from({length:30},(_,i)=>{const angle=i/30*Math.PI*2,x=Math.cos(angle)*72,y=Math.sin(angle)*33;return <path key={i} className="pd-cilium" d={`M${x} ${y}l${Math.cos(angle)*11} ${Math.sin(angle)*11}`} stroke={highlight?'#fde047':'#d9fbff'} strokeWidth={highlight?2.5:1.5} style={{animationDelay:`${i*.025}s`}}/>;})}
  <ellipse cx="-15" cy="-3" rx="19" ry="12" fill="#7fa6a0" stroke="#d9eece"/>
  {[[-40,12],[21,10],[32,-12],[-36,-14],[4,20]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={5+i%2*3} fill="#efffdf80" stroke="#7dada2"/>)}
  <path d="M52 0Q25 4 17 20" fill="none" stroke="#4f827f" strokeWidth="5"/>
 </>:<>
  <path d="M-65 0Q-27-35 35-23Q69-10 68 0Q24 34-20 25Q-50 20-65 0Z" fill="#82b945" fillOpacity=".86" stroke="#d4f8ac" strokeWidth="2"/>
  {[[-35,3],[-18,-12],[5,13],[23,-8],[40,9]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx="11" ry="5" transform={`rotate(${i*30} ${x} ${y})`} fill="#376d32"/>)}
  <ellipse cx="-5" cy="0" rx="12" ry="8" fill="#b7d28a"/>
  <circle cx="48" cy="-9" r="4" fill="#dc675b"/>
  <path className="pd-flagellum" d="M65-2C95-38 115 35 150-3" fill="none" stroke={highlight?'#fde047':'#c3efad'} strokeWidth={highlight?4:2.5}/>
 </>}
 </g>;
}
