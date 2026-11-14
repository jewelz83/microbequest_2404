import React from 'react';
export default function TeachingModel({id,zoom=1,feature}) {
 return <svg viewBox="0 0 360 270" role="img" aria-label={`${id === 'bacteria' ? 'E. coli' : id} simplified teaching diagram, with exaggerated structures and added colors`} style={{width:'100%',height:'100%'}}>
 <g transform={`translate(180 135) scale(${zoom}) translate(-180 -135)`}>
 {id === 'paramecium' && <>
   {Array.from({length:32},(_,i)=>{const a=i*Math.PI/16;return <line key={i} x1={180+110*Math.cos(a)} y1={135+64*Math.sin(a)} x2={180+125*Math.cos(a)} y2={135+79*Math.sin(a)} stroke="#6d28d9" strokeWidth="3" />;})}
   <ellipse cx="180" cy="135" rx="111" ry="65" fill="#ddd6fe" stroke="#6d28d9" strokeWidth="4"/><ellipse cx="189" cy="128" rx="27" ry="17" fill="#8b5cf6"/><circle cx="136" cy="145" r="16" fill="#fbbf24" stroke="#b45309" strokeWidth="2"/><circle cx="225" cy="153" r="13" fill="#fbbf24"/><path d="M92 115q60 5 74 30" fill="none" stroke="#a78bfa" strokeWidth="5"/>
 </>}
 {id === 'bacteria' && <>
  <path d="M245 105q45-50 65-10t35-10M245 135q35-20 55 10t45 15M245 162q45 50 68 20t30 35" fill="none" stroke="#047857" strokeWidth="4"/><rect x="66" y="78" width="190" height="115" rx="57" fill="#a7f3d0" stroke="#047857" strokeWidth="7"/><rect x="77" y="89" width="168" height="93" rx="46" fill="none" stroke="#34d399" strokeWidth="3"/><path d="M117 133q18-42 30 0t30 0t30 0" fill="none" stroke="#6d28d9" strokeWidth="5"/>
 </>}
 {id === 'mold' && <>
  <path d="M45 232h260M110 232q20-70 60-90V80M170 142l-40-35V75M170 125l45-24V70M170 103l22-17V60M170 92l-20-20V55" fill="none" stroke="#047857" strokeWidth="7"/>
  {[130,150,170,192,215].map((x,i)=><g key={x}>{[0,1,2].map(n=><circle key={n} cx={x} cy={45+i%2*12-n*12} r="7" fill="#4ade80" stroke="#047857" strokeWidth="2"/>)}</g>)}
 </>}
 {id === 'virus' && <>
  {Array.from({length:16},(_,i)=>{const a=i*Math.PI/8;return <g key={i}><line x1={180+72*Math.cos(a)} y1={135+72*Math.sin(a)} x2={180+91*Math.cos(a)} y2={135+91*Math.sin(a)} stroke="#be185d" strokeWidth="5"/><circle cx={180+93*Math.cos(a)} cy={135+93*Math.sin(a)} r="6" fill="#be185d"/></g>;})}
  <circle cx="180" cy="135" r="72" fill="#fbcfe8" stroke="#be185d" strokeWidth="6"/><circle cx="180" cy="135" r="59" fill="#fce7f3" stroke="#f472b6" strokeWidth="3"/>{[0,1,2,3,4,5,6,7].map(i=><path key={i} d={`M${147+i*9} 110q-8 13 0 25t0 25`} fill="none" stroke="#7c3aed" strokeWidth="3"/>)}
 </>}
 {feature && (()=>{const box={paramecium:{cilia:[180,135,124,78],vacuole:[136,145,21,21],nucleus:[189,128,31,22]},bacteria:{flagella:[300,142,54,82],wall:[161,135,99,62],dna:[164,135,57,30]},mold:{hyphae:[173,231,133,12],spores:[171,40,64,37],branch:[171,111,59,49]},virus:{proteins:[180,135,98,98],envelope:[180,135,75,75],rna:[180,135,43,39]}}[id]?.[feature];return box && <ellipse cx={box[0]} cy={box[1]} rx={box[2]} ry={box[3]} fill="none" stroke="#b45309" strokeWidth="4" strokeDasharray="7 4"/>;})()}
 </g></svg>;
}
