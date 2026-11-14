export const WORLD={width:1600,height:900};
export const LEAF={x:650,y:440,rx:220,ry:135};
export const neighbors=[
 {id:'paramecium',name:'Paramecium',invitation:'Follow the rippling swimmer',place:'The food garden',structure:'Cilia',anchor:{x:1150,y:660},what:'A single-celled freshwater protist.',notice:'Short cilia beat along the edge. In living Paramecium, they help it swim and sweep food toward its oral groove.',question:'What happens around the edge as it moves?',note:'I watched the Paramecium model move and opened its cilia view.'},
 {id:'euglena',name:'Euglena',invitation:'Follow the green swimmer',place:'The sunlit shallows',structure:'Long flagellum',anchor:{x:1200,y:220},what:'A single-celled freshwater organism. This model represents a photosynthetic form.',notice:'A long flagellum can help Euglena move. It also has a shorter flagellum that is not shown here. Some forms contain chloroplasts; not all Euglena have the same way of getting energy.',question:'Can you spot a different movement structure?',note:'I watched the Euglena model move and opened its flagellum view.'}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const inLeaf=p=>((p.x-LEAF.x)/LEAF.rx)**2+((p.y-LEAF.y)/LEAF.ry)**2<1.08;
export function waterPoint(p){return {x:clamp(p.x,70,WORLD.width-70),y:clamp(p.y,70,WORLD.height-70)};}
function crossesLeaf(a,b){for(let i=0;i<=30;i++)if(inLeaf({x:a.x+(b.x-a.x)*i/30,y:a.y+(b.y-a.y)*i/30}))return true;return false;}
export function planRoute(from,to){
 const target=waterPoint(to);if(inLeaf(target))return [];
 if(!crossesLeaf(from,target))return [target];
 // Route through clear water around either end of the leaf. These waypoints
 // belong to the illustrated scene, not a physical model of pond currents.
 const nodes=[from,target,{x:330,y:250},{x:970,y:250},{x:330,y:650},{x:970,y:650}];
 const costs=nodes.map(()=>Infinity),previous=nodes.map(()=>-1),done=new Set();costs[0]=0;
 for(let k=0;k<nodes.length;k++){
  let best=-1;for(let i=0;i<nodes.length;i++)if(!done.has(i)&&(best<0||costs[i]<costs[best]))best=i;
  if(best<0||!Number.isFinite(costs[best]))break;done.add(best);if(best===1)break;
  for(let i=0;i<nodes.length;i++)if(!done.has(i)&&!crossesLeaf(nodes[best],nodes[i])){const cost=costs[best]+distance(nodes[best],nodes[i]);if(cost<costs[i]){costs[i]=cost;previous[i]=best;}}
 }
 if(!Number.isFinite(costs[1]))return [];
 const route=[];for(let i=1;i!==0;i=previous[i])route.unshift(nodes[i]);return route;
}
export const positionAt=(id,clock)=>{const n=neighbors.find(n=>n.id===id),t=clock/1000;return {x:n.anchor.x+Math.cos(t*(id==='paramecium'?.5:.7))*32,y:n.anchor.y+Math.sin(t*.65)*20,angle:Math.sin(t*.7)*16};};
export const freshPond=()=>({started:false,paused:false,player:{x:220,y:450},clock:0,route:[],following:null,moved:false,watch:{paramecium:0,euglena:0},seen:[],features:[]});
export function pondReducer(s,a){
 if(a.type==='reset')return freshPond();
 if(a.type==='start')return {...s,started:true};
 if(a.type==='setPause')return {...s,paused:a.value};
 if(a.type==='pause')return {...s,paused:!s.paused};
 if(!s.started||s.paused)return s;
 if(a.type==='travel')return {...s,route:planRoute(s.player,a.point),following:null};
 if(a.type==='follow'){const n=neighbors.find(n=>n.id===a.id);return n?{...s,route:planRoute(s.player,n.anchor),following:n.id}:s;}
 if(a.type==='feature')return s.seen.includes(a.id)?{...s,features:[...new Set([...s.features,a.id])]}:s;
 if(a.type!=='tick')return s;
 const dt=clamp(a.dt,0,100)/1000,clock=s.clock+dt*1000,route=[...s.route];let player={...s.player};
 const direction=a.direction||{x:0,y:0},manual=direction.x!==0||direction.y!==0;
 if(manual){const length=Math.hypot(direction.x,direction.y),next=waterPoint({x:player.x+direction.x/length*170*dt,y:player.y+direction.y/length*170*dt});if(!inLeaf(next))player=next;route.length=0;}
 else if(route.length){const target=route[0],d=distance(player,target),step=170*dt;if(d<=step){player=target;route.shift();}else player={x:player.x+(target.x-player.x)/d*step,y:player.y+(target.y-player.y)/d*step};}
 const watch={...s.watch},seen=[...s.seen];
 for(const n of neighbors){if(distance(player,positionAt(n.id,clock))<145){watch[n.id]=Math.min(3000,watch[n.id]+dt*1000);if(watch[n.id]>=3000&&!seen.includes(n.id))seen.push(n.id);}}
 return {...s,player,route,clock,following:manual?null:s.following,moved:s.moved||distance(player,s.player)>0,watch,seen};
}
export const cameraFor=(player,width=960,height=540)=>({x:clamp(player.x-width*.43,0,WORLD.width-width),y:clamp(player.y-height*.5,0,WORLD.height-height),width,height});
