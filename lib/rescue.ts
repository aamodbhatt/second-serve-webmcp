export type Diet = 'vegan' | 'vegetarian' | 'any';
export type Donor = { id:string; name:string; food:string; portions:number; diet:Diet; allergens:string[]; ready:number; deadline:number; x:number; y:number };
export type Kitchen = { id:string; name:string; capacity:number; diet:Diet; excludes:string[]; closes:number; x:number; y:number };
export type Assignment = { id:string; donorId:string; kitchenId:string; portions:number; minutes:number; locked:boolean };
export type Plan = { assignments:Assignment[]; portions:number; unassigned:number; score:number; travelMinutes:number; objective:'rescue'|'distance'; reasons:{donorId:string; portions:number; reason:string}[] };
export type Audit = { revision:number; actor:'human'|'agent'; action:string; at:string };
export type Workspace = { revision:number; donors:Donor[]; kitchens:Kitchen[]; now:number; maxMinutes:number; approved:Assignment[]; proposal:(Plan & {baseRevision:number; id:string})|null; audit:Audit[] };
export const time = (minutes:number) => `${Math.floor(minutes/60).toString().padStart(2,'0')}:${(minutes%60).toString().padStart(2,'0')}`;
export function seed():Workspace { return {revision:0,now:1020,maxMinutes:35,approved:[],proposal:null,audit:[],donors:[
{id:'d1',name:'The Green Kitchen',food:'Vegetable bowls',portions:120,diet:'vegan',allergens:['sesame'],ready:1020,deadline:1065,x:25,y:20},
{id:'d2',name:'Sunrise Bakery',food:'Bread & pastries',portions:80,diet:'vegetarian',allergens:['gluten','milk'],ready:1020,deadline:1140,x:15,y:65},
{id:'d3',name:'Campus Canteen',food:'Rice & dal',portions:100,diet:'vegan',allergens:[],ready:1020,deadline:1110,x:65,y:25},
{id:'d4',name:'Garden Bistro',food:'Seasonal grain bowls',portions:60,diet:'vegan',allergens:['gluten'],ready:1035,deadline:1125,x:45,y:75},
{id:'d5',name:'Market Collective',food:'Fruit & yogurt boxes',portions:70,diet:'vegetarian',allergens:['milk'],ready:1020,deadline:1155,x:80,y:60},
{id:'d6',name:'Neighbourhood Deli',food:'Chicken sandwiches',portions:50,diet:'any',allergens:['gluten','egg'],ready:1020,deadline:1095,x:35,y:45}],kitchens:[
{id:'k1',name:'Hope Community',capacity:130,diet:'vegan',excludes:[],closes:1110,x:30,y:30},
{id:'k2',name:'Open Table',capacity:100,diet:'vegetarian',excludes:[],closes:1140,x:22,y:72},
{id:'k3',name:'Night Shelter',capacity:110,diet:'any',excludes:[],closes:1170,x:60,y:50},
{id:'k4',name:'Little Steps',capacity:80,diet:'vegetarian',excludes:['sesame'],closes:1095,x:72,y:28},
{id:'k5',name:'Westside Pantry',capacity:60,diet:'any',excludes:['milk'],closes:1140,x:40,y:65}]} }
export function travel(d:Donor,k:Kitchen){ return Math.ceil(5+Math.hypot(d.x-k.x,d.y-k.y)*0.42) }
export function match(s:Workspace,d:Donor,k:Kitchen){
 const minutes=travel(d,k), arrival=Math.max(s.now,d.ready)+minutes;
 const failures:string[]=[];
 if(k.diet==='vegan'&&d.diet!=='vegan'||k.diet==='vegetarian'&&d.diet==='any') failures.push(`${k.name} requires ${k.diet} food`);
 const blocked=d.allergens.filter(a=>k.excludes.includes(a)); if(blocked.length) failures.push(`Excluded allergens: ${blocked.join(', ')}`);
 if(minutes>s.maxMinutes) failures.push(`Estimated ${minutes} min exceeds ${s.maxMinutes} min travel limit`);
 if(arrival>d.deadline) failures.push(`Estimated arrival ${time(arrival)} is after donor window ${time(d.deadline)}`);
 if(arrival>k.closes) failures.push(`Estimated arrival ${time(arrival)} is after kitchen closes ${time(k.closes)}`);
 if(k.capacity===0) failures.push('Kitchen has no available capacity');
 return {eligible:failures.length===0,minutes,arrival:time(arrival),failures,checks:['Diet compatibility','Declared allergen exclusions','Travel limit','Donor window','Kitchen closing time'],estimate:'Illustrative travel estimate: 5 + Euclidean coordinate distance × 0.42 minutes. No live traffic or food-safety certification.'};
}
export function validateAssignments(s:Workspace,assignments:Assignment[]){
 const donorUse:Record<string,number>={}, kitchenUse:Record<string,number>={}; const failures:string[]=[];
 for(const a of assignments){ const d=s.donors.find(x=>x.id===a.donorId),k=s.kitchens.find(x=>x.id===a.kitchenId);
 if(!d||!k){failures.push(`Unknown donor or kitchen in ${a.id}`);continue;}
 if(!Number.isInteger(a.portions)||a.portions<=0){failures.push(`Invalid portion count in ${a.id}`);continue;}
 const m=match(s,d,k); if(!m.eligible)failures.push(`${d.name} → ${k.name}: ${m.failures.join('; ')}`);
 donorUse[d.id]=(donorUse[d.id]||0)+a.portions; kitchenUse[k.id]=(kitchenUse[k.id]||0)+a.portions;
 }
 for(const d of s.donors)if((donorUse[d.id]||0)>d.portions)failures.push(`${d.name} is overallocated`);
 for(const k of s.kitchens)if((kitchenUse[k.id]||0)>k.capacity)failures.push(`${k.name} exceeds capacity`);
 return failures;
}
// Successive shortest augmenting paths with residual edges: integral maximum flow,
// then minimum cost for that flow. Locked edges are reserved before solving.
export function plan(s:Workspace,objective:Plan['objective']='rescue'):Plan {
 const locked=s.approved.filter(a=>a.locked).map(a=>({...a}));
 const violations=validateAssignments(s,locked);if(violations.length)throw new Error(`Protected commitments conflict: ${violations.join('. ')}. Resolve or unlock them in the board before replanning.`);
 const ds=s.donors.map(d=>d.portions-locked.filter(a=>a.donorId===d.id).reduce((n,a)=>n+a.portions,0));
 const ks=s.kitchens.map(k=>k.capacity-locked.filter(a=>a.kitchenId===k.id).reduce((n,a)=>n+a.portions,0));
 type Edge={to:number;rev:number;cap:number;cost:number;initial:number}; const n=2+ds.length+ks.length, sink=n-1,graph:Edge[][]=Array.from({length:n},()=>[]);
 const add=(u:number,v:number,cap:number,cost:number)=>{const edge:Edge={to:v,rev:graph[v].length,cap,cost,initial:cap};graph[u].push(edge);graph[v].push({to:u,rev:graph[u].length-1,cap:0,cost:-cost,initial:0});return edge;};
 ds.forEach((cap,i)=>add(0,1+i,cap,objective==='rescue'?Math.max(0,s.donors[i].deadline-s.now)*100:0));
 ks.forEach((cap,i)=>add(1+ds.length+i,sink,cap,0));
 const edges:{edge:Edge;d:Donor;k:Kitchen;minutes:number}[]=[];
 s.donors.forEach((d,i)=>s.kitchens.forEach((k,j)=>{const m=match(s,d,k);if(m.eligible)edges.push({edge:add(1+i,1+ds.length+j,Math.min(ds[i],ks[j]),m.minutes),d,k,minutes:m.minutes})}));
 for(;;){const dist=Array(n).fill(Infinity),prevN=Array(n).fill(-1),prevE=Array(n).fill(-1);dist[0]=0;
 for(let pass=0;pass<n-1;pass++){let changed=false;for(let u=0;u<n;u++)if(Number.isFinite(dist[u]))graph[u].forEach((e,j)=>{if(e.cap>0&&dist[e.to]>dist[u]+e.cost){dist[e.to]=dist[u]+e.cost;prevN[e.to]=u;prevE[e.to]=j;changed=true;}});if(!changed)break;}
 if(!Number.isFinite(dist[sink]))break;let amount=Infinity;
 for(let v=sink;v!==0;v=prevN[v])amount=Math.min(amount,graph[prevN[v]][prevE[v]].cap);
 for(let v=sink;v!==0;v=prevN[v]){const e=graph[prevN[v]][prevE[v]];e.cap-=amount;graph[v][e.rev].cap+=amount;}
 }
 const assignments=[...locked];for(const {edge,d,k,minutes} of edges){const portions=edge.initial-edge.cap;if(portions>0){const existing=assignments.find(a=>a.donorId===d.id&&a.kitchenId===k.id);if(existing){ // Keep a locked quantity exact; any extra is a separate proposed assignment.
 assignments.push({id:`${d.id}-${k.id}-extra`,donorId:d.id,kitchenId:k.id,portions,minutes,locked:false});
 }else assignments.push({id:`${d.id}-${k.id}`,donorId:d.id,kitchenId:k.id,portions,minutes,locked:false});}}
 const portions=assignments.reduce((n,a)=>n+a.portions,0),available=s.donors.reduce((n,d)=>n+d.portions,0);
 const reasons=s.donors.flatMap(d=>{const left=d.portions-assignments.filter(a=>a.donorId===d.id).reduce((n,a)=>n+a.portions,0);if(!left)return [];const eligible=s.kitchens.filter(k=>match(s,d,k).eligible);return [{donorId:d.id,portions:left,reason:eligible.length?'Compatible kitchen capacity is used by other meals; adjust capacity or commitments.':'No eligible kitchen within the declared dietary, allergen, and time constraints.'}]});
 return {assignments,portions,unassigned:available-portions,travelMinutes:assignments.reduce((n,a)=>n+a.minutes,0),score:assignments.reduce((n,a)=>n+a.minutes*a.portions,0),objective,reasons};
}
export function assertRevision(s:Workspace,revision:unknown){if(!Number.isInteger(revision)||revision!==s.revision)throw new Error(`Stale workspace. Expected revision ${s.revision}; call get_workspace and retry.`)}
export function object(input:unknown,keys:string[]){if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Expected an object');const v=input as Record<string,unknown>;for(const key of Object.keys(v))if(!keys.includes(key))throw new Error(`Unknown field: ${key}`);return v}
export function integer(v:unknown,min:number,max:number,name:string){if(typeof v!=='number'||!Number.isInteger(v)||v<min||v>max)throw new Error(`${name} must be an integer between ${min} and ${max}`);return v}
export function text(v:unknown,name:string){if(typeof v!=='string'||v.length<1||v.length>100)throw new Error(`${name} must be 1–100 characters`);return v}
export function dataset(input:unknown):Pick<Workspace,'donors'|'kitchens'|'now'|'maxMinutes'> {
 const v=object(input,['donors','kitchens','now','maxMinutes']);
 if(!Array.isArray(v.donors)||!Array.isArray(v.kitchens)||v.donors.length<1||v.kitchens.length<1||v.donors.length>40||v.kitchens.length>40)throw new Error('Provide 1–40 donors and 1–40 kitchens');
 const diet=(x:unknown):Diet=>{if(!['vegan','vegetarian','any'].includes(x as string))throw new Error('Diet must be vegan, vegetarian, or any');return x as Diet};
 const tags=(x:unknown)=>{if(!Array.isArray(x)||x.length>20)throw new Error('Allergen lists must contain at most 20 strings');return x.map(a=>text(a,'allergen').toLowerCase().trim())};
 const donors=v.donors.map(a=>{const d=object(a,['id','name','food','portions','diet','allergens','ready','deadline','x','y']);return {id:text(d.id,'id'),name:text(d.name,'name'),food:text(d.food,'food'),portions:integer(d.portions,1,10000,'portions'),diet:diet(d.diet),allergens:tags(d.allergens),ready:integer(d.ready,0,1439,'ready'),deadline:integer(d.deadline,0,1439,'deadline'),x:integer(d.x,0,100,'x'),y:integer(d.y,0,100,'y')}});
 const kitchens=v.kitchens.map(a=>{const k=object(a,['id','name','capacity','diet','excludes','closes','x','y']);return {id:text(k.id,'id'),name:text(k.name,'name'),capacity:integer(k.capacity,0,10000,'capacity'),diet:diet(k.diet),excludes:tags(k.excludes),closes:integer(k.closes,0,1439,'closes'),x:integer(k.x,0,100,'x'),y:integer(k.y,0,100,'y')}});
 if(new Set(donors.map(x=>x.id)).size!==donors.length||new Set(kitchens.map(x=>x.id)).size!==kitchens.length)throw new Error('IDs must be unique within donors and kitchens');
 if(donors.some(d=>d.ready>d.deadline))throw new Error('Ready time must precede donor deadline');
 return {donors,kitchens,now:integer(v.now,0,1439,'now'),maxMinutes:integer(v.maxMinutes,5,90,'maxMinutes')};
}
export function manifest(s:Workspace){const issues=validateAssignments(s,s.approved);return {status:issues.length?'needs_review':'approved_plan',revision:s.revision,scenarioTime:time(s.now),issues,disclaimer:'Planning aid using declared constraints and illustrative travel estimates. No deliveries have been booked or dispatched.',rows:s.approved.map(a=>({donor:s.donors.find(d=>d.id===a.donorId)!.name,food:s.donors.find(d=>d.id===a.donorId)!.food,kitchen:s.kitchens.find(k=>k.id===a.kitchenId)!.name,portions:a.portions,estimatedMinutes:a.minutes,locked:a.locked}))};}
