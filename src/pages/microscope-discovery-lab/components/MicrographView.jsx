import React from 'react';
import {micrographs} from '../micrographs.mjs';
export default function MicrographView({slide,feature,zoom,onObserve}) {
 const media=micrographs[slide.id];
 return <figure className="ml-real-figure">
  <div className="ml-eyepiece"><div className="ml-image-plane" style={{aspectRatio:`${media.width} / ${media.height}`,transform:`scale(${zoom})`}}>
    <img src={`/assets/micrographs/${slide.id}.jpg`} alt={`${slide.name}, real ${media.method.toLowerCase()} image; ${media.note}`} width={media.width} height={media.height}/>
    <svg className="ml-image-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Selectable image regions">
      {slide.features.filter(f=>media.regions[f[0]]).map((f,i)=>{const [x,y,rx,ry]=media.regions[f[0]],active=feature?.[0]===f[0];return <g key={f[0]} role="button" tabIndex="0" aria-label={`Examine ${f[1]} in the micrograph`} aria-pressed={active} onClick={()=>onObserve(f)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onObserve(f);}}}>
        <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={active?'#fde04730':'transparent'} stroke={active?'#fde047':'#ffffff99'} strokeWidth={active?1:.4} vectorEffect="non-scaling-stroke"/>
        <circle cx={x} cy={y-ry} r="2.4" fill={active?'#fde047':'#ffffff'} stroke="#111827" strokeWidth=".4"/>
        <text x={x} y={y-ry+.9} textAnchor="middle" fontSize="3" fill="#111827" aria-hidden="true">{i+1}</text>
      </g>;})}
    </svg>
  </div></div>
  <figcaption><strong>{media.method}</strong><p>{media.note}</p><p>Image: {media.credit} · <a href={media.source} target="_blank" rel="noopener noreferrer">Free source &amp; original image</a> · {media.licenseUrl ? <a href={media.licenseUrl} target="_blank" rel="noopener noreferrer">{media.license}</a> : media.license}</p>{slide.id==='paramecium' && <p>Highlight annotations for this image are also available under CC BY-SA 3.0.</p>}</figcaption>
 </figure>;
}
