export const arenas=[
 {id:'pond',name:'Pond patrol',question:'Can you protect a busy tiny world?',description:'A blue freshwater-inspired arcade field.',color:'#075985',specimen:'paramecium',fact:'Paramecium is a single-celled freshwater protist. Its cilia help it move and bring food toward its oral groove.'},
 {id:'soil',name:'Soil patrol',question:'Can you leave the residents in peace?',description:'A purple underground-inspired arcade field.',color:'#4c1d95',specimen:'mold',fact:'Many fungi and bacteria help break down dead material. Penicillium is one example of a mold found in places such as soil and decaying material.'}
];
// Internal good/bad keys retain the existing arcade engine's data contract.
// These are fictional mission roles, not species or biological classifications.
export const pulse={id:'pulse',name:'Patrol pulse',cost:0,isShootable:true,ammoType:'pulse',cooldown:230,projectileSpeed:12,projectileSize:5,projectileColor:'#fde047',effect:{badBacteria:-100,goodBacteria:-100,balanceForGood:-20}};
export function patrolWave(wave,random=Math.random){
 const roles=['bad','good','bad','bad','good','bad'];
 return roles.map((type,i)=>({id:`patrol-${wave}-${i}`,type,name:type==='bad'?'Marked target':'Resident',x:-30,y:60+random()*175,speed:'medium',health:1,currentHealth:1,isAlive:true,spawnDelay:i*850,damage:15,points:type==='bad'?10:-10}));
}
export const preparePatrol=state=>({...state,totalWaves:3,bacterialBalance:100,selectedToolId:pulse.id,ammoCount:{pulse:9999}});
export const aimPosition=(clientX,left,width)=>Math.max(20,Math.min(780,(clientX-left)*800/Math.max(1,width)));
