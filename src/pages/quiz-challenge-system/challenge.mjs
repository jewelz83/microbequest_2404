import {permitsDifficulty} from '../../services/gameAccessPolicy.mjs';
export const questionBank={
 cilia:{id:'cilia',image:'paramecium',lead:'Paramecium is one cell with short structures called cilia.',question:'What can its cilia help it do?',hint:'Think about a tiny cell moving through pond water.',correct:'swim',success:'Yes! Cilia help Paramecium move through water.',explain:'Cilia also sweep food toward an oral groove. The moving cilia blur along the edge in this prepared still photo. The image illustrates structure; knowledge about living Paramecium tells us what the structures do.',options:[
  {id:'sunlight',text:'Make food from sunlight.',feedback:'Cilia are movement structures, not tools for capturing sunlight. What might help a tiny cell swim?'},
  {id:'swim',text:'Swim through water.',feedback:''},
  {id:'plant',text:'Turn it into a plant.',feedback:'Having cilia does not turn a protist into a plant. Think about what moving tiny hairs could help the cell do.'}
 ]},
 mold:{id:'mold',image:'mold',lead:'Follow the thin branches toward the brush-like tips.',question:'Which description fits Penicillium?',hint:'Its branching threads are called hyphae. Which group grows this way?',correct:'fungus',success:'Yes! Penicillium is a mold, a kind of fungus.',explain:'Molds grow as threads called hyphae. Some Penicillium species help break down material; some produce penicillin. That does not make unknown mold or moldy food safe to use as medicine.',options:[
  {id:'virus',text:'A virus growing a set of legs.',feedback:'Those branches are fungal threads, not legs. Viruses are not cells and do not grow a body of hyphae.'},
  {id:'fungus',text:'A fungus made of branching threads.',feedback:''},
  {id:'plant',text:'A tiny plant with blue leaves.',feedback:'The blue structures are not leaves. This is a prepared microscope image, and its color does not make the specimen a plant. Think about the branching threads.'}
 ]},
 roles:{id:'roles',image:'bacteria',lead:'These rod-shaped cells are E. coli bacteria.',question:'Does being a bacterium mean it makes us sick?',hint:'Remember the communities of microbes that live in and on our bodies.',correct:'varied',success:'Right. Bacteria have many roles; they do not all cause illness.',explain:'Most kinds of E. coli are harmless, but some can cause illness. A picture of cell shape cannot tell us which strain is present or whether it could be harmful. Scientists use additional evidence.',options:[
  {id:'all',text:'Yes. Every bacterium causes illness.',feedback:'Many bacteria live in and on us without causing illness. Most kinds of E. coli are harmless, though some are not. Which answer allows for different roles?'},
  {id:'none',text:'No bacterium can ever cause illness.',feedback:'Some bacteria can cause illness, including some kinds of E. coli. We need an answer that includes both harmless and harmful kinds.'},
  {id:'varied',text:'No. Different bacteria can have different roles.',feedback:''}
 ]},
 motion:{id:'motion',image:'paramecium',lead:'You have a still photograph of a prepared Paramecium specimen.',question:'What would help you observe how a living Paramecium swims?',hint:'What kind of evidence can show a change in position over time?',correct:'video',success:'Yes! Watching a living specimen over time could show its movement.',explain:'A still image preserves one moment. A video of a living specimen, with a stable view and time information, can help a scientist observe how it moves. Enlarging this photo adds no new moments or optical detail.',options:[
  {id:'enlarge',text:'Make this same photo larger.',feedback:'Enlarging a still photo makes existing pixels bigger. It cannot show what happened before or after the picture.'},
  {id:'video',text:'Watch a video of a living specimen.',feedback:''},
  {id:'color',text:'Change the photo’s colors.',feedback:'Changing colors would change how the picture looks, not provide evidence of movement. What would show the cell over time?'}
 ]},
 scale:{id:'scale',image:'comparison',lead:'These two photos are displayed in equal-size boxes. Their scales are different.',question:'Can the boxes tell us which cell is larger in real life?',hint:'A display box is not a measurement of the specimen.',correct:'scale',success:'Exactly. We need scale information, not just equal-size boxes.',explain:'Images can be enlarged by different amounts. A calibrated scale bar relates distance in an image to real length. The E. coli source retains a 5 µm bar, but this Paramecium source has no calibrated bar. These display sizes alone are not a fair size comparison.',options:[
  {id:'same',text:'Yes. Equal boxes mean equal-size cells.',feedback:'We can enlarge different photos by different amounts. Equal boxes do not mean equal real sizes.'},
  {id:'scale',text:'No. We need scale information for the specimens.',feedback:''},
  {id:'longer',text:'Yes. The cell filling more of its box must be larger.',feedback:'A tiny cell can fill a display if its photo is enlarged enough. What evidence would connect image distance to real length?'}
 ]},
 strain:{id:'strain',image:'bacteria',lead:'A scientist has this reference image of E. coli.',question:'Which claim needs evidence beyond this picture?',hint:'A shape can be observed. A strain’s effect on a host needs other evidence.',correct:'harm',success:'Yes. Harmfulness cannot be decided from this cell picture.',explain:'Microscope images can reveal visible structures. To study a strain and what it can do, microbiologists use other evidence, such as genetic information and appropriate laboratory tests. A rod shape is not a danger label.',options:[
  {id:'rods',text:'The visible cells have a rod-like shape.',feedback:'We can observe that shape in the photo. Look for a claim about something the image cannot establish.'},
  {id:'gray',text:'This image is shown in grayscale.',feedback:'The displayed colors are something we can observe directly. Which claim is about an effect that shape and color cannot establish?'},
  {id:'harm',text:'This strain would cause illness.',feedback:''}
 ]},
 host:{id:'host',image:'virus',difficulty:'medium',lead:'This electron micrograph shows influenza A virus particles.',question:'What does an influenza virus need to make more virus particles?',hint:'A virus is not a cell. It depends on a living cell’s machinery.',correct:'cell',success:'Yes! Influenza viruses need host cells to make more particles.',explain:'Viruses cannot reproduce independently. Influenza viruses use processes in their host cells to make new particles. This micrograph shows prepared H5N1 particles, not an infection happening live; not all influenza particles have this long shape.',options:[
  {id:'food',text:'A meal of soil and dead leaves.',feedback:'Dead material can feed decomposers, but it does not give influenza virus particles a cell’s machinery. What living structure do they need?'},
  {id:'cell',text:'A suitable living host cell.',feedback:''},
  {id:'grow',text:'Enough room to grow by themselves.',feedback:'Extra space does not provide the machinery a virus needs to reproduce. A virus depends on a suitable host cell.'}
 ]}
};
export const packs=[{id:'mix',title:'Microbe mix',description:'Meet three microbes. Spot a structure and connect it to an idea.',ids:['cilia','mold','roles']},{id:'detective',title:'Science detective',description:'Decide what a picture can tell you, and what needs more evidence.',ids:['motion','scale','strain']}];
export const getQuestions=(pack,stretch,ceiling)=>[...(packs.find(p=>p.id===pack)||packs[0]).ids,...(stretch&&permitsDifficulty('medium',ceiling)?['host']:[])].map(id=>questionBank[id]);
export const newChallenge=questions=>({questions,index:0,attempts:{},result:null,paused:false,complete:false});
export function challengeReducer(state,action){
 if(action.type==='reset')return newChallenge(action.questions);
 if(action.type==='pause')return state.complete?state:{...state,paused:!state.paused};
 if(state.paused||state.complete)return state;
 if(action.type==='advance'){
  if(!state.result?.correct||action.result!==state.result)return state;
  return state.index===state.questions.length-1?{...state,complete:true}:{...state,index:state.index+1,result:null};
 }
 if(action.type!=='answer'||state.result?.correct)return state;
 const q=state.questions[state.index],option=q?.options.find(o=>o.id===action.id),prior=state.attempts[q?.id]||[];
 if(!option||prior.includes(action.id))return state;
 return {...state,attempts:{...state.attempts,[q.id]:[...prior,action.id]},result:{question:q.id,choice:action.id,correct:q.correct===action.id}};
}
