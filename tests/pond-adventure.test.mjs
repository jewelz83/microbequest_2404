import test from 'node:test';
import assert from 'node:assert/strict';
import {neighbors,freshPond,pondReducer,planRoute,inLeaf,distance,cameraFor,WORLD} from '../src/pages/life-in-a-drop/pond.mjs';
const tick=s=>pondReducer(s,{type:'tick',dt:100});
test('direct destinations include the leaf surface instead of treating it as a wall',()=>{
 const from={x:220,y:450},to={x:650,y:440};assert.deepEqual(planRoute(from,to),[to]);
 let s=pondReducer(freshPond(),{type:'start'});s=pondReducer(s,{type:'travel',point:to});for(let i=0;i<150;i++)s=tick(s);
 assert.equal(s.leafFound,true);assert.ok(inLeaf(s.player));assert.ok(distance(s.player,to)<25);
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

test('mouse steering takes over assistance and smooth velocity settles after input stops',()=>{
 let s=pondReducer(pondReducer(freshPond(),{type:'start'}),{type:'follow',id:'euglena'});
 const before=s.player.x;s=pondReducer(s,{type:'tick',dt:16,pointer:{u:.7,v:.5},viewport:{width:960,height:540}});
 assert.ok(s.player.x>before);assert.ok(s.velocity.x>0&&s.velocity.x<310);assert.equal(s.following,null);assert.equal(s.route.length,0);
 for(let i=0;i<120;i++)s=pondReducer(s,{type:'tick',dt:16});assert.equal(s.velocity.x,0);assert.equal(s.velocity.y,0);
});
test('entering leaf habitats reveals distinct visits and does not duplicate notes',()=>{
 let s=pondReducer(freshPond(),{type:'start'});
 for(const point of [{x:545,y:430},{x:760,y:435}]){s=pondReducer(s,{type:'travel',point});for(let i=0;i<120;i++)s=tick(s);}
 assert.equal(s.leafFound,true);assert.deepEqual([...s.leafSpots].sort(),['bacteria','fungi']);const count=s.leafSpots.length;for(let i=0;i<100;i++)s=tick(s);assert.equal(s.leafSpots.length,count);
 assert.deepEqual(pondReducer(s,{type:'reset'}).leafSpots,[]);
});
test('neighborhood entry opens immediately and diagonal steering has no speed bonus',()=>{
 let s={...freshPond(),started:true,player:{...neighbors[0].anchor}};s=pondReducer(s,{type:'tick',dt:16});assert.ok(s.seen.includes('paramecium'));
 const start={...freshPond(),started:true};const right=pondReducer(start,{type:'tick',dt:16,direction:{x:1,y:0}}),diagonal=pondReducer(start,{type:'tick',dt:16,direction:{x:1,y:1}});
 assert.ok(Math.abs(Math.hypot(right.velocity.x,right.velocity.y)-Math.hypot(diagonal.velocity.x,diagonal.velocity.y))<.001);
});
test('steering keeps its bearing after multiple complete turns',()=>{
 const s={...freshPond(),started:true,heading:1080,velocity:{x:100,y:0}};
 const next=pondReducer(s,{type:'tick',dt:16,direction:{x:1,y:0}});assert.ok(Math.abs(next.heading-1080)<.001);
});
