const clamp = (n, max = 100) => Math.max(0, Math.min(max, n));
export const freshCombat = () => ({gameState:'location-select', locationId:null, currentWave:1,totalWaves:3,immuneHealth:100,bacterialBalance:80,score:0,defensePoints:100,bacteria:[],projectiles:[],hitIndicators:[],selectedToolId:null,rapidFire:false,ammoCount:{antibiotic:25,probiotic:30,immuneCell:20,hygiene:40,antiseptic:15},playerShip:{x:400,y:350,width:40,height:30},cooldown:0,serial:0,shotsFired:0,kills:0,harmfulSpawned:0,waveReady:false,achievements:[]});
export function createWave(wave, location, types, random = Math.random) {
  return Array.from({length:Math.min(5+wave*2,15)},(_,i)=>{
    const pool=random()<0.3?location.goodBacteria:location.enemyTypes;
    const species=pool[Math.floor(random()*pool.length)];
    return {...types[species],id:`bacteria-${wave}-${i}`,x:-30,y:40+random()*220,currentHealth:types[species].health,isAlive:true,spawnDelay:i*1000};
  });
}
export function startCombat(location, bacteria) {
  const state=freshCombat();
  return {...state,gameState:'playing',locationId:location.id,totalWaves:location.challengeType==='survival'?5:3,bacteria,harmfulSpawned:bacteria.filter(b=>b.type==='bad').length};
}
export function fireCombat(state, tool) {
  if(state.gameState!=='playing'||state.waveReady||!tool||state.cooldown>0||state.defensePoints<tool.cost)return state;
  if(!tool.isShootable)return {...state,immuneHealth:clamp(state.immuneHealth+(tool.effect.immuneHealth||0)),bacterialBalance:clamp(state.bacterialBalance+(tool.effect.balance||0)),defensePoints:state.defensePoints-tool.cost,cooldown:tool.cooldown};
  if(!(state.ammoCount[tool.ammoType]>0))return state;
  const shots=tool.isSpreadShot?[-0.3,0,0.3]:[0];
  return {...state,cooldown:tool.cooldown||150,shotsFired:state.shotsFired+1,serial:state.serial+shots.length,defensePoints:state.defensePoints-tool.cost,ammoCount:{...state.ammoCount,[tool.ammoType]:state.ammoCount[tool.ammoType]-1},projectiles:[...state.projectiles,...shots.map((angle,i)=>({id:state.serial+i,x:state.playerShip.x,y:state.playerShip.y-20,speed:tool.projectileSpeed||12,angle:-Math.PI/2+angle,color:tool.projectileColor,size:tool.projectileSize,toolId:tool.id,isHoming:tool.isHoming}))]};
}
export function stepCombat(state, milliseconds, tools, difficulty='easy', keys={}) {
  if(state.gameState!=='playing')return state;
  const dt=Math.max(0,Math.min(100,milliseconds)), seconds=dt/1000;
  let next={...state,cooldown:Math.max(0,state.cooldown-dt),hitIndicators:state.hitIndicators.map(h=>({...h,ttl:h.ttl-dt})).filter(h=>h.ttl>0)};
  const direction=(keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0);
  next.playerShip={...state.playerShip,x:Math.max(20,Math.min(780,state.playerShip.x+direction*400*seconds))};
  if(state.waveReady)return next;
  if(keys.Space||keys.Enter||state.rapidFire)next=fireCombat(next,tools.find(t=>t.id===state.selectedToolId));
  const multiplier=difficulty==='hard'?1.6:difficulty==='medium'?1.25:1;
  let bacteria=state.bacteria.map(b=>{
    if(!b.isAlive||b.currentHealth<=0)return {...b,isAlive:false};
    if(b.spawnDelay>0)return {...b,spawnDelay:Math.max(0,b.spawnDelay-dt)};
    const speed=b.speed==='fast'?45:b.speed==='medium'?35:25;
    const x=b.x+speed*multiplier*seconds;
    if(x>825){
      if(b.type==='bad')next.immuneHealth=clamp(next.immuneHealth-(b.damage||10));
      return {...b,isAlive:false};
    }
    return {...b,x};
  });
  const projectiles=[];
  for(const p of next.projectiles){
    const tool=tools.find(t=>t.id===p.toolId);if(!tool)continue;
    let angle=p.angle;
    if(p.isHoming){
      const targets=bacteria.filter(b=>b.isAlive&&b.spawnDelay<=0&&b.type==='bad');
      targets.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));
      if(targets[0])angle=Math.atan2(targets[0].y-p.y,targets[0].x-p.x);
    }
    const x=p.x+Math.cos(angle)*p.speed*60*seconds,y=p.y+Math.sin(angle)*p.speed*60*seconds;
    // Only intercept organisms affected by this tool. A missile passes helpful bacteria.
    const hit=bacteria.find(b=>b.isAlive&&b.spawnDelay<=0&&tool.effect[b.type==='bad'?'badBacteria':'goodBacteria']&&Math.hypot(b.x-x,b.y-y)<25);
    if(hit){
      const amount=tool.effect[hit.type==='bad'?'badBacteria':'goodBacteria'];
      hit.currentHealth=clamp(hit.currentHealth+amount,hit.health);
      next.hitIndicators=[...next.hitIndicators,{id:++next.serial,x:hit.x,y:hit.y,damage:Math.abs(amount),type:hit.type,ttl:1500}];
      if(hit.currentHealth===0){
        hit.isAlive=false;next.score=Math.max(0,next.score+Math.round(hit.points*(difficulty==='hard'?2:difficulty==='medium'?1.5:1)));
        if(hit.type==='bad'){next.kills++;next.defensePoints=clamp(next.defensePoints+5,200);}
      }
      next.immuneHealth=clamp(next.immuneHealth+(tool.effect.immuneHealth||0));
      next.bacterialBalance=clamp(next.bacterialBalance+(tool.effect.balance||0));
    }else if(x>=-50&&x<=850&&y>=-50&&y<=450)projectiles.push({...p,x,y,angle});
  }
  next.bacteria=bacteria.filter(b=>b.isAlive);next.projectiles=projectiles;
  if(next.immuneHealth<=0||next.bacterialBalance<=0)return {...next,gameState:'game-over',rapidFire:false,projectiles:[]};
  if(next.bacteria.length===0)return {...next,waveReady:true,rapidFire:false,projectiles:[]};
  return next;
}
export function advanceCombat(state, bacteria=[]) {
  if(state.gameState!=='playing'||!state.waveReady)return state;
  if(state.currentWave===state.totalWaves){
    const won=state.locationId==='gut'?state.bacterialBalance>=80:state.locationId==='skin'?state.kills>=10:state.locationId==='mouth'?state.kills/Math.max(1,state.harmfulSpawned)>=0.7:true;
    return {...state,gameState:won?'victory':'game-over',achievements:won?[...(state.bacterialBalance>=90?['Balance Master']:[]),...(state.immuneHealth>=90?['Immune Champion']:[])]:[]};
  }
  const ammoCount={...state.ammoCount};for(const [key,max] of Object.entries(freshCombat().ammoCount))ammoCount[key]=Math.min(max,ammoCount[key]+Math.ceil(max/3));
  return {...state,currentWave:state.currentWave+1,bacteria,waveReady:false,cooldown:0,projectiles:[],hitIndicators:[],ammoCount,harmfulSpawned:state.harmfulSpawned+bacteria.filter(b=>b.type==='bad').length};
}
