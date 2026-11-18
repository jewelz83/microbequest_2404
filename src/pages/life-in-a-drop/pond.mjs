export const WORLD={width:1600,height:900};
export const LEAF={x:650,y:440,rx:220,ry:135};
export const neighbors=[
 {id:'paramecium',name:'Paramecium',invitation:'Follow the rippling swimmer',place:'The food garden',structure:'Cilia',anchor:{x:1150,y:660},what:'A single-celled freshwater protist.',notice:'Short cilia beat along the edge. In living Paramecium, they help it swim and sweep food toward its oral groove.',question:'What happens around the edge as it moves?',note:'I reached the Paramecium model and opened its cilia view.'},
 {id:'euglena',name:'Euglena',invitation:'Follow the green swimmer',place:'The sunlit shallows',structure:'Long flagellum',anchor:{x:1200,y:220},what:'A single-celled freshwater organism. This model represents a photosynthetic form.',notice:'A long flagellum can help Euglena move. It also has a shorter flagellum that is not shown here. Some forms contain chloroplasts; not all Euglena have the same way of getting energy.',question:'Can you spot a different movement structure?',note:'I reached the Euglena model and opened its flagellum view.'}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const inLeaf=p=>((p.x-LEAF.x)/LEAF.rx)**2+((p.y-LEAF.y)/LEAF.ry)**2<1.08;
export function waterPoint(p){return {x:clamp(p.x,70,WORLD.width-70),y:clamp(p.y,70,WORLD.height-70)};}
// The craft cruises above the leaf surface. It is a habitat, not a wall.
export const planRoute=(from,to)=>[waterPoint(to)];
export const leafStations=[
 {id:'bacteria',x:545,y:430,title:'A bacterial neighborhood',text:'Bacteria can colonize fallen leaves. Some help break down dead material.'},
 {id:'fungi',x:760,y:435,title:'Threads on the leaf',text:'Fungi can grow on submerged dead leaves too, helping break down the material.'}
];
export const positionAt=(id,clock)=>{const n=neighbors.find(n=>n.id===id),t=clock/1000;return {x:n.anchor.x+Math.cos(t*(id==='paramecium'?.5:.7))*32,y:n.anchor.y+Math.sin(t*.65)*20,angle:Math.sin(t*.7)*16};};
export const freshPond=()=>({started:false,paused:false,player:{x:220,y:450},velocity:{x:0,y:0},heading:0,camera:{x:0,y:180},clock:0,route:[],following:null,moved:false,seen:[],features:[],leafFound:false,leafSpots:[]});
export const cameraFor=(player,width=960,height=540,previous=null)=>{
 let x=previous?.x??player.x-width*.43,y=previous?.y??player.y-height*.5;
 if(previous){if(player.x>x+width*.72)x=player.x-width*.72;else if(player.x<x+width*.22)x=player.x-width*.22;if(player.y>y+height*.73)y=player.y-height*.73;else if(player.y<y+height*.25)y=player.y-height*.25;}
 return {x:clamp(x,0,WORLD.width-width),y:clamp(y,0,WORLD.height-height),width,height};
};
export function pondReducer(s,a){
 if(a.type==='reset')return freshPond();
 if(a.type==='start')return {...s,started:true};
 if(a.type==='setPause')return {...s,paused:a.value,velocity:{x:0,y:0}};
 if(a.type==='pause')return {...s,paused:!s.paused,velocity:{x:0,y:0}};
 if(!s.started||s.paused)return s;
 if(a.type==='travel')return {...s,route:planRoute(s.player,a.point),following:null};
 if(a.type==='follow'){const n=neighbors.find(n=>n.id===a.id);return n?{...s,route:planRoute(s.player,n.anchor),following:n.id}:s;}
 if(a.type==='feature')return s.seen.includes(a.id)?{...s,features:[...new Set([...s.features,a.id])]}:s;
 if(a.type!=='tick')return s;
 const dt=clamp(a.dt,0,50)/1000,clock=s.clock+dt*1000,route=[...s.route],viewport=a.viewport||{width:960,height:540};
 const direction=a.direction||{x:0,y:0},keyboard=direction.x!==0||direction.y!==0;
 let target=null,desired={x:0,y:0},manual=keyboard||Boolean(a.pointer);
 if(keyboard){const length=Math.hypot(direction.x,direction.y);desired={x:direction.x/length*310,y:direction.y/length*310};route.length=0;}
 else{
  if(a.pointer){const c={x:clamp(s.camera.x,0,WORLD.width-viewport.width),y:clamp(s.camera.y,0,WORLD.height-viewport.height),width:viewport.width,height:viewport.height};target=waterPoint({x:c.x+a.pointer.u*c.width,y:c.y+a.pointer.v*c.height});route.length=0;}
  else if(route.length)target=route[0];
  if(target){const d=distance(s.player,target),speed=Math.min(310,Math.max(0,(d-12)*5));if(d>0)desired={x:(target.x-s.player.x)/d*speed,y:(target.y-s.player.y)/d*speed};if(d<18&&route.length)route.shift();}
 }
 const blend=1-Math.exp(-14*dt),velocity={x:s.velocity.x+(desired.x-s.velocity.x)*blend,y:s.velocity.y+(desired.y-s.velocity.y)*blend};
 if(Math.hypot(velocity.x,velocity.y)<.5)velocity.x=velocity.y=0;
 const player=waterPoint({x:s.player.x+velocity.x*dt,y:s.player.y+velocity.y*dt});
 if(player.x<=70||player.x>=WORLD.width-70)velocity.x=0;if(player.y<=70||player.y>=WORLD.height-70)velocity.y=0;
 let heading=s.heading;if(Math.hypot(velocity.x,velocity.y)>5){const targetHeading=Math.atan2(velocity.y,velocity.x)*180/Math.PI,delta=(((targetHeading-heading+180)%360)+360)%360-180;heading+=delta*(1-Math.exp(-12*dt));}
 const seen=[...s.seen];for(const n of neighbors)if(distance(player,positionAt(n.id,clock))<145&&!seen.includes(n.id))seen.push(n.id);
 const leafFound=s.leafFound||inLeaf(player),leafSpots=[...s.leafSpots];if(inLeaf(player))for(const spot of leafStations)if(distance(player,spot)<90&&!leafSpots.includes(spot.id))leafSpots.push(spot.id);
 const targetCamera=cameraFor(player,viewport.width,viewport.height,s.camera),cb=1-Math.exp(-10*dt),camera={x:clamp(s.camera.x+(targetCamera.x-s.camera.x)*cb,0,WORLD.width-viewport.width),y:clamp(s.camera.y+(targetCamera.y-s.camera.y)*cb,0,WORLD.height-viewport.height)};
 return {...s,player,velocity,heading,camera,route,clock,following:manual?null:s.following,moved:s.moved||distance(player,s.player)>0,seen,leafFound,leafSpots};
}
