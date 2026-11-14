import test from 'node:test';
import assert from 'node:assert/strict';
import {neighbors,freshPond,pondReducer,planRoute,inLeaf,distance,cameraFor,WORLD} from '../src/pages/life-in-a-drop/pond.mjs';
const tick=s=>pondReducer(s,{type:'tick',dt:100});
test('routes navigate around the leaf from either side and reject destinations on it',()=>{
 for(const from of [{x:220,y:450},{x:1200,y:220},{x:1150,y:660},{x:650,y:650}])for(const to of [{x:220,y:450},...neighbors.map(n=>n.anchor)]){
  const path=planRoute(from,to);assert.ok(path.length);let p=from;
  for(const q of path){for(let i=0;i<=50;i++)assert.equal(inLeaf({x:p.x+(q.x-p.x)*i/50,y:p.y+(q.y-p.y)*i/50}),false);p=q;}
  assert.ok(distance(p,to)<.01);
 }
 assert.deepEqual(planRoute({x:220,y:450},{x:650,y:440}),[]);
});
test('following reaches both encounters through play; only reached close-ups create notes',()=>{
 let s=pondReducer(freshPond(),{type:'start'});
 assert.equal(pondReducer(s,{type:'feature',id:'paramecium'}),s);
 for(const n of neighbors){s=pondReducer(s,{type:'follow',id:n.id});for(let i=0;i<200;i++)s=tick(s);assert.ok(s.seen.includes(n.id));s=pondReducer(s,{type:'feature',id:n.id});s=pondReducer(s,{type:'feature',id:n.id});}
 assert.equal(s.features.length,2);assert.equal(s.moved,true);
});
test('pause freezes the expedition and reset removes only session observations',()=>{
 let s=pondReducer(pondReducer(freshPond(),{type:'start'}),{type:'follow',id:'euglena'});s=pondReducer(s,{type:'setPause',value:true});
 assert.equal(tick(s),s);assert.equal(pondReducer(s,{type:'feature',id:'euglena'}),s);assert.equal(pondReducer(s,{type:'follow',id:'paramecium'}),s);
 assert.equal(pondReducer(s,{type:'setPause',value:true}).paused,true);
 assert.deepEqual(pondReducer(s,{type:'reset'}),freshPond());
});
test('manual movement takes over follow assistance and stays inside world bounds',()=>{
 let s=pondReducer(pondReducer(freshPond(),{type:'start'}),{type:'follow',id:'euglena'});s=pondReducer(s,{type:'tick',dt:100,direction:{x:-1,y:0}});assert.equal(s.following,null);assert.equal(s.route.length,0);
 for(let i=0;i<300;i++)s=pondReducer(s,{type:'tick',dt:100,direction:{x:-1,y:-1}});
 assert.ok(s.player.x>=70&&s.player.y>=70);
 for(const w of [640,960])for(const p of [{x:70,y:70},{x:1530,y:830}]){const c=cameraFor(p,w,w===640?480:540);assert.ok(c.x>=0&&c.y>=0&&c.x+c.width<=WORLD.width&&c.y+c.height<=WORLD.height);}
});
