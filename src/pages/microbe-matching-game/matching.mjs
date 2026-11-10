import {permitsDifficulty} from '../../services/gameAccessPolicy.mjs';
export const specimens=[
 {id:'paramecium',name:'Paramecium',group:'Protist',clue:'A single-celled freshwater protist that uses short cilia to move.',notice:'Look for the large, elongated cell and its fuzzy edge.',explain:'Paramecium is one cell. Short structures called cilia help it swim and move food toward its oral groove. The still photo cannot show it swimming.',where:'Often found in freshwater, including ponds.'},
 {id:'bacteria',name:'E. coli',group:'Bacterium',clue:'A rod-shaped bacterium commonly found in the intestines of people and animals.',notice:'Look for the small rod-shaped cells. Thin flagella extend nearby.',explain:'E. coli is a bacterium. Most kinds are harmless; some can cause illness. A rod shape alone cannot tell us whether a strain is harmful.',where:'Commonly found in the intestines of people and animals.'},
 {id:'mold',name:'Penicillium',group:'Fungus',clue:'A mold fungus that grows as branching threads with brush-like spore-bearing tips.',notice:'Follow the branching threads toward the brush-like tips.',explain:'Penicillium is a mold, a kind of fungus. Its branching threads are called hyphae. Some species produce penicillin; that does not mean moldy food is medicine.',where:'Found in places such as soil and decaying material.'},
 {id:'virus',name:'Influenza virus',group:'Virus',clue:'A non-cellular infectious particle that needs a host cell to make more particles.',notice:'Look for the long virus particles in this electron micrograph.',explain:'Influenza viruses are not cells. They need host cells to make more virus particles. This image shows influenza A (H5N1); not all influenza particles have this long shape.',where:'Influenza viruses infect the respiratory tract of their hosts.'}
];
export function makeDeck(mode='pictures',size=3,ceiling='easy',random=Math.random){
 const count=size===4&&permitsDifficulty('medium',ceiling)?4:3;
 const deck=specimens.slice(0,count).flatMap(s=>[
  {id:`${s.id}:picture`,specimen:s.id,kind:'picture'},
  {id:`${s.id}:partner`,specimen:s.id,kind:mode==='clues'?'clue':'picture'}
 ]);
 for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
 return deck;
}
export const newRound=deck=>({deck,selected:[],matched:[],attempts:0,result:null,paused:false,complete:false});
export function matchingReducer(state,action){
 if(action.type==='reset')return newRound(action.deck);
 if(action.type==='pause')return state.complete?state:{...state,paused:!state.paused};
 if(state.paused||state.complete)return state;
 if(action.type==='advance')return state.result?{...state,selected:[],result:null,complete:state.matched.length===state.deck.length}:state;
 if(action.type!=='select'||state.result||state.selected.includes(action.id)||state.matched.includes(action.id))return state;
 const card=state.deck.find(c=>c.id===action.id);if(!card)return state;
 const selected=[...state.selected,card.id];if(selected.length===1)return {...state,selected};
 const first=state.deck.find(c=>c.id===selected[0]),match=first.specimen===card.specimen;
 return {...state,selected,attempts:state.attempts+1,matched:match?[...state.matched,...selected]:state.matched,result:{match,first:first.specimen,second:card.specimen}};
}
export function pairFeedback(result,mode){
 const a=specimens.find(s=>s.id===result.first),b=specimens.find(s=>s.id===result.second);
 if(result.match)return mode==='clues'?`${a.name} fits this clue. ${a.explain}`:`Both pictures show the same reference image of ${a.name}. ${a.explain}`;
 return `${a.name} and ${b.name} are different examples. ${a.name}: ${a.notice} ${b.name}: ${b.notice} ${mode==='clues'?'Connect each picture with the clue describing that example.':'Look for the same image, rather than just a similar color.'} Take another look, then try again.`;
}
