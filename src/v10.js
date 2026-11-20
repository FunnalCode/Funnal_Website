/* ============================== v10: day off requests, crew pay, challenges v2, Distinction, fish balance ============================== */

/* ---------- day off requests: either captain asks, the other accepts ---------- */
function offReqs(){return Object.entries(C().offReq||{}).map(([id,r])=>r&&typeof r==='object'?{id,...r}:null).filter(r=>r&&r.by&&r.from);}
function offDates(r){const o=[];const to=r.to&&r.to>=r.from?r.to:r.from;for(let d=r.from,i=0;i<31&&d<=to;i++,d=addDays(d,1))o.push(d);return o;}
function offLabel(r){const ds=offDates(r);const f=d=>DAYN[wd(d)]+' '+shortDate(d);return ds.length>1?`${f(ds[0])} to ${f(ds[ds.length-1])} (${ds.length} days)`:f(ds[0]);}
function offReqHtml(){if(!G||!S.me)return '';const rs=offReqs().filter(r=>r.status==='pending');if(!rs.length)return '';
  const theirs=rs.filter(r=>r.by!==S.me),mine=rs.filter(r=>r.by===S.me);
  return `<div class="card offReq"><div class="row between"><h3>Day off requests</h3><small>the other captain decides</small></div><div class="list" style="margin-top:8px">
   ${theirs.map(r=>`<div class="li"><span class="cgIco">🏝️</span><div class="grow"><b>${pname(r.by)} asks for ${esc(offLabel(r))}</b><br><small>${esc(r.type||'day off')}${r.who==='__all'?' · whole crew off':''}${r.note?' · '+esc(r.note):''}</small></div><div class="offBtns"><button class="btn sm primary" data-act="offAccept" data-id="${r.id}">Accept</button><button class="btn sm ghost" data-act="offDecline" data-id="${r.id}">Decline</button></div></div>`).join('')}
   ${mine.map(r=>`<div class="li"><span class="cgIco">⏳</span><div class="grow"><b>You asked for ${esc(offLabel(r))}</b><br><small>Waiting for ${pname(other(S.me))} to accept</small></div><button class="btn sm ghost" data-act="offWithdraw" data-id="${r.id}">Withdraw</button></div>`).join('')}
  </div></div>`;}
function daysOffCard(){const cfg=C(),P=G.P,o=other(S.me);const lo=addDays(G.today,-14);
  const hol=(cfg.holidays||[]).filter(d=>d>=lo).sort().map(d=>({d,who:'__all',type:'holiday'}));const abs=Object.entries(cfg.absences||{}).map(([k,v])=>{const[d,p]=k.split('_');return{d,who:p,type:v,k};}).filter(x=>x.d>=lo).sort((a,b)=>a.d<b.d?-1:1);
  const rs=offReqs().filter(r=>r.status!=='withdrawn'&&(r.to||r.from)>=lo).sort((a,b)=>(b.ts||0)-(a.ts||0)).slice(0,8);
  const canRm=x=>x.d>=G.today&&(x.who==='__all'||x.who===S.me);
  return `<div class="card"><h3>Days off</h3><p class="tiny muted" style="margin:4px 0 8px">${P.length>1?`Ask for a day off and ${pname(o)} accepts it (and the other way round).`:'Add a day off.'} Days off never trigger forfeits or break streaks. When one captain is away the crew target scales down; when the whole crew is off there is no foe that day.</p>
   <div class="offForm"><label class="f" for="offFrom">From<input id="offFrom" type="date" value="${G.today}" min="${addDays(G.today,-2)}"></label><label class="f" for="offTo">To (optional)<input id="offTo" type="date" min="${G.today}"></label>
    <label class="f" for="offWho">Who<select id="offWho"><option value="me">Just me</option><option value="__all">Whole crew</option></select></label><label class="f" for="offType">Why<select id="offType"><option>holiday</option><option>sick</option><option>planned</option><option>other</option></select></label></div>
   <label class="f" for="offNote" style="margin-top:6px">Note (optional)<input id="offNote" maxlength="80" placeholder="e.g. Dentist, then a well-earned nap"></label>
   <button class="btn primary" style="margin-top:10px" data-act="offRequest">${P.length>1?'Ask '+pname(o):'Add day off'}</button>
   ${hol.length||abs.length?`<h4 class="offH">Booked</h4><div class="list">${[...hol,...abs].sort((a,b)=>a.d<b.d?-1:1).map(x=>`<div class="li"><span class="grow">${DAYN[wd(x.d)]} ${shortDate(x.d)} · ${x.who==='__all'?'whole crew':pname(x.who)} · ${esc(x.type)}</span>${canRm(x)?`<button class="btn sm ghost" data-act="${x.who==='__all'?'rmHol':'rmAbs'}" data-d="${x.d}" data-k="${x.k||''}">Cancel</button>`:''}</div>`).join('')}</div>`:''}
   ${rs.length?`<h4 class="offH">Requests</h4><div class="list">${rs.map(r=>`<div class="li"><span class="grow">${pname(r.by)} · ${esc(offLabel(r))}${r.who==='__all'?' · whole crew':''}</span><span class="pill">${r.status==='ok'?'accepted':r.status==='no'?'declined':'waiting'}</span></div>`).join('')}</div>`:''}
  </div>`;}
async function applyOff(r,patch){const ds=offDates(r);if(r.who==='__all')patch.holidays=[...new Set([...(C().holidays||[]),...ds])].sort();else{patch.absences={};ds.forEach(d=>patch.absences[d+'_'+r.by]=r.type||'holiday');}return patch;}
Object.assign(ACT,{
  async offRequest(){const from=$('#offFrom').value,to=$('#offTo').value||'',who=$('#offWho').value,type=$('#offType').value,note=($('#offNote').value||'').trim().slice(0,80);
    if(!from)return toast('<b>Pick a date first.</b>','joke');if(from<addDays(G.today,-2))return toast('<b>Too far back.</b> Day off requests can start at most two days ago.','joke',3000);
    if(to&&to<from)return toast('<b>The end date is before the start.</b> Time travel is a premium feature.','joke',3000);
    const r={by:S.me,who:who==='__all'?'__all':S.me,from,to:to&&to!==from?to:'',type,note,ts:Date.now(),status:'pending'};if(offDates(r).length>21)return toast('<b>21 days at most per request.</b> Split longer trips into two.','joke',3000);
    const id='o'+uid();try{if(G.P.length<2){await writeConfig(await applyOff(r,{offReq:{[id]:{...r,status:'ok',at:Date.now()}}}));toast('<b>Day off booked.</b>');}
      else{await writeConfig({offReq:{[id]:r}});toast(`<b>Asked ${pname(other(S.me))}.</b> It lands once they accept. Bribery with biscuits is traditional.`,'',4000);}render();}catch(e){writeFail(e);}},
  async offAccept(d){const r=offReqs().find(x=>x.id===d.id);if(!r||r.status!=='pending')return;if(r.by===S.me)return toast('<b>You can\'t accept your own request.</b> Nice try though.','joke');
    try{await writeConfig(await applyOff(r,{offReq:{[r.id]:{status:'ok',at:Date.now(),acc:S.me}}}));toast(`<b>Accepted.</b> ${pname(r.by)} has ${esc(offLabel(r))} off. The monsters will wait. Grumpily.`,'',4000);SND.pop&&SND.pop();}catch(e){writeFail(e);}},
  async offDecline(d){const r=offReqs().find(x=>x.id===d.id);if(!r||r.by===S.me)return;try{await writeConfig({offReq:{[r.id]:{status:'no',at:Date.now(),acc:S.me}}});toast('Declined. Maybe talk it through over a biscuit.','joke',3000);}catch(e){writeFail(e);}},
  async offWithdraw(d){const r=offReqs().find(x=>x.id===d.id);if(!r||r.by!==S.me)return;try{await writeConfig({offReq:{[r.id]:{status:'withdrawn',at:Date.now()}}});}catch(e){writeFail(e);}},
});
// tell the other captain when a request arrives or is answered
function checkOffReq(){if(!G||!S.me)return;const rs=offReqs();const key=rs.map(r=>r.id+r.status).join('|');if(S.offKey===undefined){S.offKey=key;S.offSeen=new Map(rs.map(r=>[r.id,r.status]));return;}if(key===S.offKey)return;S.offKey=key;
  rs.forEach(r=>{const was=S.offSeen.get(r.id);if(was===r.status)return;S.offSeen.set(r.id,r.status);
    if(!was&&r.status==='pending'&&r.by!==S.me){toast(`<b>${pname(r.by)} asked for a day off.</b> ${esc(offLabel(r))}. Accept or decline it on the Harbour.`,'',7000);try{SND.pop();}catch(e){}}
    if(was==='pending'&&r.by===S.me&&(r.status==='ok'||r.status==='no'))toast(r.status==='ok'?`<b>${pname(other(S.me))} accepted your day off.</b> ${esc(offLabel(r))} is booked.`:`<b>${pname(other(S.me))} declined your day off request.</b>`,r.status==='ok'?'':'joke',6000);});}
const _decor10=decorateView;decorateView=function(){_decor10();try{checkOffReq();}catch(e){console.error(e);}};

/* ============================== FISHING v4: balanced rarities, real sizes, unique sharks ============================== */
// Casts before FISH_V4_AT keep exactly the roll they had (old rarities, depths and odds are snapshotted below).
let FISH_V4_AT=V10_AT;
FISH.forEach(f=>{f.rar0=f.rar;f.depth0=f.depth;f.odds0=f.odds||0;});
const FISH_TRANS0=FISH.filter(f=>f.rar0==='transcendent');
// the very first fishing trips (before v2) roll from the original 100 fish with their original rarities
fishRoll=function(evId){const h=h32(evId+'fish');if(h%100>=72)return null;let x=h32(evId+'fr')%FISH_TOTAL_W,rar='common';for(const k in FISH_RAR){if(x<FISH_RAR[k].w){rar=k;break;}x-=FISH_RAR[k].w;}const pool=FISH_V1.filter(f=>f.rar0===rar);return pool[h32(evId+'fs')%pool.length];};
const FRW0={common:5500,uncommon:2500,rare:1200,epic:550,legendary:200,mythic:45};
// new weights per rarity (before depth and bait boosts); transcendent fish roll on their own odds
const FRW={common:5600,uncommon:2700,rare:1150,epic:320,legendary:100,mythic:55};
// name: [rarity, shape (null = keep), typical length in cm]
const FISH_TABLE={
 'Sardine':['common','long',20],'Anchovy':['common','long',15],'Mackerel':['common','long',35],'Herring':['common','oval',28],'Sprat':['common','oval',12],'Pilchard':['common','long',22],'Whiting':['common','long',35],'Pollock':['common','oval',55],
 'Dab':['common','flat',25],'Plaice':['common','flat',40],'Flounder':['common','flat',35],'Sole':['common','flat',35],'Goby':['common','long',10],'Blenny':['common','long',12],'Bream':['common','oval',35],'Mullet':['common','oval',45],
 'Wrasse':['common','oval',30],'Pouting':['common','oval',25],'Smelt':['common','long',18],'Rockling':['common','long',30],'Weever':['common','long',15],'Sand Eel':['common','eel',20],'Shanny':['common','long',12],'Dogfish':['common','shark',70],
 'Garfish':['common','long',60],'Scad':['common','oval',30],'Coley':['common','oval',60],'Haddock':['common','oval',50],
 'Bass':['uncommon','oval',55],'Gurnard':['uncommon','oval',35],'Cod':['uncommon','oval',80],'Hake':['uncommon','long',70],'Ling':['uncommon','eel',100],'John Dory':['uncommon','round',45],'Red Snapper':['uncommon','oval',60],'Sea Robin':['uncommon','oval',30],
 'Clownfish':['uncommon','oval',9],'Blue Tang':['uncommon','round',25],'Butterflyfish':['uncommon','round',15],'Damselfish':['uncommon','round',10],'Parrotfish':['uncommon','oval',45],'Triggerfish':['uncommon','round',40],'Pufferfish':['uncommon','puffer',30],'Boxfish':['uncommon','puffer',25],
 'Grouper':['uncommon','oval',90],'Halibut':['uncommon','flat',120],'Turbot':['uncommon','flat',60],'Catshark':['uncommon','shark',60],'Remora':['uncommon','long',45],'Pompano':['uncommon','round',40],'Blacktip Reef Shark':['uncommon','shark',150],'Lemon Shark':['uncommon','shark',240],'Nurse Shark':['uncommon','shark',280],
 'Angelfish':['rare','round',30],'Moorish Idol':['rare','round',20],'Flying Fish':['rare','long',30],'Bluefin Tuna':['rare','oval',200],'Yellowfin Tuna':['rare','oval',150],'Wahoo':['rare','long',150],'Moray Eel':['rare','eel',150],'Stonefish':['rare','round',35],
 'Frogfish':['rare','angler',20],'Cuttlefish':['rare','squid',40],'Electric Ray':['rare','ray',60],'Lanternfish':['rare','long',10],'Hatchetfish':['rare','round',6],'Bull Shark':['rare','shark',300],'Mako Shark':['rare','shark',320],'Thresher Shark':['rare','shark',500],
 'Lionfish':['rare','round',35],'Barracuda':['rare','long',120],'Mahi-Mahi':['rare','oval',110],'Tarpon':['rare','oval',150],'Monkfish':['rare','angler',90],
 'Anglerfish':['epic','angler',60],'Gulper Eel':['epic','eel',75],'Blobfish':['epic','puffer',30],'Viperfish':['epic','angler',30],'Firefly Squid':['epic','squid',7],'Ghost Shark':['epic','shark',100],'Dragonfish':['epic','long',40],'Tiger Shark':['epic','shark',450],
 'Basking Shark':['epic','shark',800],'Swordfish':['epic','sail',300],'Sailfish':['epic','sail',300],'Manta Ray':['epic','ray',450],'Seadragon':['epic','long',45],'Sunfish':['epic','round',180],'Mandarin Fish':['epic','oval',7],'Hammerhead':['epic','shark',400],
 'Golden Koi':['legendary',null,64],'Rainbow Marlin':['legendary',null,340],'Ember Eel':['legendary',null,120],'Moonfish':['legendary',null,100],'Sunscale Tuna':['legendary',null,220],'Great White Shark':['legendary',null,550],'Whale Shark':['legendary',null,1200],
 'Coelacanth':['legendary','oval',180],'Oarfish':['legendary','eel',500],'Barreleye':['legendary','oval',15],'Glass Octopus':['legendary','squid',45],'Goblin Shark':['legendary','shark',350],
 'Leviathan Hatchling':['mythic',null,400],'Phoenix Fin':['mythic',null,150],'Siren Carp':['mythic',null,120],'Abyssal Pearl-Eater':['mythic',null,90],'Megalodon':['mythic',null,1800],'Kraken Fry':['mythic',null,90],'Crystal Ray':['mythic',null,180],'Storm Salmon':['mythic',null,110],
 'The Inbox Eel':['mythic',null,120],'Disco Flounder':['mythic',null,60],
 'The Funnal Fish':['transcendent',null,200],"The Kraken's Goldfish":['transcendent',null,9],'Ghost Pike':['transcendent',null,95],'Clockwork Carp':['transcendent',null,60],'Lava Bass':['transcendent',null,75],'Galaxy Guppy':['transcendent',null,12],'The Mimic':['transcendent',null,88],'Sir Reginald Finn':['transcendent',null,70]};
const TRANS_ODDS={"The Kraken's Goldfish":2000,'Ghost Pike':2500,'Clockwork Carp':3000,'Lava Bass':3500,'Galaxy Guppy':4200,'The Mimic':5000,'Sir Reginald Finn':6500,'The Funnal Fish':8000};
FISH.forEach(f=>{const r=FISH_TABLE[f.name];if(!r)return;const[rar,shape,len]=r;f.len=len;if(shape)f.shape=shape;
  if(rar!==f.rar0){const h=h32('dep'+f.name);f.depth={common:0,uncommon:h%2,rare:h%3,epic:1+h%3,legendary:1+h%3,mythic:2+h%2,transcendent:0}[rar];}
  f.rar=rar;f.odds=TRANS_ODDS[f.name]||undefined;});
const FISH_TRANS4=FISH.filter(f=>f.rar==='transcendent').sort((a,b)=>a.odds-b.odds);
FISH_TRANS.length=0;FISH_TRANS4.forEach(f=>FISH_TRANS.push(f));
Object.assign(BAITS,{glow:{id:'glow',name:'Glow Worms',price:300,mult:1.6,desc:'Rare and better fish bite 60% more often'},squid:{id:'squid',name:'Squid Chunk',price:250,desc:'Fish come up about 20% bigger'},lure:{id:'lure',name:'Golden Lure',price:2500,trans:1.25,vmult:2,desc:'Doubles variant odds; transcendent fish bite 25% more'}});
function fishOfDay0(date){const pool=FISH.filter(f=>FISH_RI[f.rar0]<=3&&!f.time&&f.depth0<=1&&(!f.v3||date>='2026-11-14'));return pool[h32(date+'fotd')%pool.length];}
fishOfDay=function(date){if(date<L(FISH_V4_AT).date)return fishOfDay0(date);const pool=FISH.filter(f=>FISH_RI[f.rar]<=3&&!f.time&&f.depth<=1);return pool[h32(date+'fotd')%pool.length];};
bigOne=function(date){const ws=weekStart(date);const v4=ws>=weekStart(L(FISH_V4_AT).date)&&ws>'2026-11-09';const pool=FISH.filter(f=>(v4?f.rar:f.rar0)==='legendary'&&!f.time&&(!f.v3||ws>='2026-11-16'));return pool[h32(ws+'big')%pool.length];};
const FORDER=['common','uncommon','rare','epic','legendary','mythic'];const _fp0={},_fp4={};
function fishRollOld(id,t,trip,date){const u=k=>h32(id+k)/4294967296;
  let x=u('tr');const lm=trip.bait==='lure'?1.5:1;for(const f of FISH_TRANS0){const pr=lm/f.odds0;if(x<pr)return f;x-=pr;}
  if(u('fish')>=.72)return null;const dep=trip.depth,gl=trip.bait==='glow'?2:1;
  const w=FORDER.map((r,i)=>FRW0[r]*(i<2?1:(1+.06*dep*(i-1))*gl));let y=u('fr')*w.reduce((a,b)=>a+b,0),ri=0;for(;ri<5;ri++){if(y<w[ri])break;y-=w[ri];}
  const min=L(t).min,tc=min<540?'dawn':min>=1020?'dusk':'day';const fd=fishOfDay0(date).id;
  for(;ri>=0;ri--){const v3=t>=FISH_V3_AT;const k=ri+'|'+dep+'|'+tc+'|'+v3;const pool=_fp0[k]||(_fp0[k]=FISH.filter(f=>f.rar0===FORDER[ri]&&f.depth0<=dep&&(!f.time||f.time===tc)&&(v3||!f.v3)));
    if(pool.length){let tot=0;for(const f of pool)tot+=f.id===fd?6:1;let z=u('fs')*tot;for(const f of pool){const ww=f.id===fd?6:1;if(z<ww)return f;z-=ww;}return pool[pool.length-1];}}
  return null;}
function fishWeights(dep,bait){return FORDER.map((r,i)=>FRW[r]*(i<2?1:(1+.06*dep*(i-1))*(bait==='glow'?BAITS.glow.mult:1)));}
function fishRollV4(id,t,trip,date){const u=k=>h32(id+k)/4294967296;
  let x=u('tr');const lm=trip.bait==='lure'?BAITS.lure.trans:1;for(const f of FISH_TRANS4){const pr=lm/f.odds;if(x<pr)return f;x-=pr;}
  if(u('fish')>=.72)return null;const dep=trip.depth;const w=fishWeights(dep,trip.bait);let y=u('fr')*w.reduce((a,b)=>a+b,0),ri=0;for(;ri<5;ri++){if(y<w[ri])break;y-=w[ri];}
  const min=L(t).min,tc=min<540?'dawn':min>=1020?'dusk':'day';const fd=fishOfDay(date).id;
  for(;ri>=0;ri--){const k=ri+'|'+dep+'|'+tc;const pool=_fp4[k]||(_fp4[k]=FISH.filter(f=>f.rar===FORDER[ri]&&f.depth<=dep&&(!f.time||f.time===tc)));
    if(pool.length){let tot=0;for(const f of pool)tot+=f.id===fd?6:1;let z=u('fs')*tot;for(const f of pool){const ww=f.id===fd?6:1;if(z<ww)return f;z-=ww;}return pool[pool.length-1];}}
  return null;}
fishRollV2=function(id,t,trip,date){return t>=FISH_V4_AT?fishRollV4(id,t,trip,date):fishRollOld(id,t,trip,date);};
// the rarity a catch had when it was landed (old catches keep their old rarity for variants)
computeFish=function(p,evs,sessions,lock){const trips=fishTripsOf(sessions,lock);
  const key=evs.length+'|'+(evs.length?evs[evs.length-1].id:'')+'|'+trips.map(x=>x.s+':'+(x.e===Infinity?'L':x.e)+x.bait+x.depth).join();if(_fc[p]&&_fc[p].key===key)return _fc[p].v;
  const list=[],by={},best={},vars={};let whoppers=0,ti=0;
  if(trips.length)for(const e of evs){if(e.pid!==p||e.k!=='d')continue;while(ti<trips.length&&trips[ti].e<e.t)ti++;if(ti>=trips.length)break;const trip=trips[ti];if(e.t<trip.s)continue;
    const v2=e.t>=FISH_V2_AT,v4=e.t>=FISH_V4_AT;const f=v2?fishRollV2(e.id,e.t,trip,e.date||L(e.t).date):fishRoll(e.id);if(!f)continue;
    const cm=fishSize(f,e.id,v2?trip.bait:'');let v='';if(v2&&(e.t>=V11_AT||FISH_RI[v4?f.rar:f.rar0]<4)){const q=h32(e.id+'var')/4294967296/(trip.bait==='lure'?(v4?BAITS.lure.vmult:3):1);v=q<.004?'r':q<.015?'a':q<.032?'g':'';}
    list.push({f,t:e.t,id:e.id,cm,v,date:e.date||L(e.t).date,depth:trip.depth});by[f.id]=(by[f.id]||0)+1;if(!best[f.id]||cm>best[f.id].cm)best[f.id]={cm,t:e.t};if(v)vars[f.id+'~'+v]=(vars[f.id+'~'+v]||0)+1;if(cm/f.len>=1.3)whoppers++;}
  const v={list,by,best,vars,whoppers};_fc[p]={key,v};return v;};
// odds shown to players
function fishOddsFor(f,dep=3,bait=''){if(f.rar==='transcendent')return Math.round(f.odds/(bait==='lure'?BAITS.lure.trans:1));const w=fishWeights(dep,bait);const tot=w.reduce((a,b)=>a+b,0);const ri=FORDER.indexOf(f.rar);
  const n=FISH.filter(x=>x.rar===f.rar&&x.depth<=Math.max(dep,f.depth)).length||1;return Math.round(tot/w[ri]*n/.72);}
const _fishPanel4=fishPanelHtml;
fishPanelHtml=function(tier){let h=_fishPanel4(tier);const dep=fishDepth(tier.m*60000),bait=S.view.bait||'';const w=fishWeights(dep,bait),tot=w.reduce((a,b)=>a+b,0);const tt=FISH_TRANS4.reduce((a,f)=>a+1/f.odds,0)*(bait==='lure'?BAITS.lure.trans:1);
  const odds=`<div class="fishOdds">${Object.keys(FISH_RAR).map((r,i)=>{const none=r!=='transcendent'&&!FISH.some(f=>f.rar===r&&f.depth<=dep);const p=r==='transcendent'?tt:w[i]/tot*.72;return `<span class="${none?'off':''}"><b class="rtag r-${r}">${r}</b>${none?'deeper water only':'about 1 in '+fmtN(Math.max(1,Math.round(1/p)))}</span>`;}).join('')}</div>`;
  return h.replace(/<div class="fishOdds">[\s\S]*<\/div>$/,odds);};

/* ---------- every shark gets its own look ---------- */
function qAt(p0,q,p2,x){let lo=0,hi=1;const dec=p0[0]>p2[0];for(let i=0;i<16;i++){const m=(lo+hi)/2;const xm=(1-m)*(1-m)*p0[0]+2*(1-m)*m*q[0]+m*m*p2[0];if((xm>x)===dec)lo=m;else hi=m;}const m=(lo+hi)/2;return (1-m)*(1-m)*p0[1]+2*(1-m)*m*q[1]+m*m*p2[1];}
// a side-on shark built from a few numbers; v = variant colours {c1,c2}
function SHK(c,t,o,v){const C1=v?v.c1:o.c1,C2=v?v.c2:o.c2,F=v?v.c1:(o.f||o.c1),ink='#1F2630';const sw=Math.sin(t/(o.per||220))*.16;
  c.save();if(o.k)c.scale(o.k,o.k);
  const N=o.n||[12,.8],QT=o.qt||[5,-5],QB=o.qb||[1,5],tj=o.tj||1,TT=[-9,-1.3*tj],TB=[-9,1.1*tj];
  const top=x=>qAt(N,QT,TT,x),bot=x=>qAt(TB,QB,N,x);
  const fin=(x,h,w,lean=.5,col=F,up=true,tip='')=>{const y=up?top(x):bot(x);const s=up?-1:1;c.fillStyle=col;c.beginPath();c.moveTo(x-w,y-s*.4);c.quadraticCurveTo(x-w*.2+lean*w,y+s*h*.55,x+lean*w*.9-w*.1,y+s*h);c.quadraticCurveTo(x+w*.25,y+s*h*.35,x+w,y-s*.2);c.closePath();c.fill();
    if(tip){c.save();c.clip();c.fillStyle=tip;c.fillRect(x-w-2,up?y-h-1:y+h*.5,w*2+4,h*.5+1);c.restore();}};
  const TIP=o.pat==='tips'?'#1F2630':o.pat==='wtips'?'#FFFFFF':'';
  // far pectoral, then tail
  if(o.pec)fin(o.pec[0]-1,o.pec[1]*.7,o.pec[2]||2,.9,'rgba(0,0,0,.18)',false);
  c.save();c.translate(-9,0);c.rotate(sw);c.fillStyle=F;
  if(o.tail==='long'){c.beginPath();c.moveTo(.6,-1*tj);c.quadraticCurveTo(-7,-3.4,-16,-9);c.quadraticCurveTo(-8.4,-1.6,.6,1*tj);c.closePath();c.fill();poly(c,[[.2,.4],[-3,3.8],[-1.6,.3]],F);}
  else if(o.tail==='low'){c.beginPath();c.moveTo(.6,-1.1*tj);c.quadraticCurveTo(-4,-1.8,-8.6,-2.6);c.quadraticCurveTo(-6.4,.6,-4,1.4);c.quadraticCurveTo(-1.6,1.4,.6,1.1*tj);c.closePath();c.fill();}
  else if(o.tail==='cres'){c.beginPath();c.moveTo(.6,-.8);c.quadraticCurveTo(-2.4,-3.6,-4.8,-7);c.quadraticCurveTo(-3.4,0,-4.8,6.4);c.quadraticCurveTo(-2.4,3.2,.6,.8);c.closePath();c.fill();}
  else{c.beginPath();c.moveTo(.6,-1*tj);c.quadraticCurveTo(-2.6,-3.4,-5.2,-6.6*(o.tu||1));c.quadraticCurveTo(-3.2,-1.4,-3.2,0);c.quadraticCurveTo(-3,2,-4.2,4.4*(o.tl||1));c.quadraticCurveTo(-1.8,2.2,.6,1*tj);c.closePath();c.fill();
    if(TIP){c.save();c.clip();c.fillStyle=TIP;c.fillRect(-8,-9,8,9-3.8*(o.tu||1));c.fillRect(-8,2.9*(o.tl||1),8,5);c.restore();}}
  c.restore();
  // fins on top and below
  if(o.d2)fin(o.d2[0],o.d2[1],o.d2[2]||1.2,.6);if(o.anal)fin(o.anal[0],o.anal[1],o.anal[2]||1,.7,F,false);if(o.pel)fin(o.pel[0],o.pel[1],o.pel[2]||1.1,.7,F,false);
  const body=()=>{c.beginPath();c.moveTo(N[0],N[1]);c.quadraticCurveTo(QT[0],QT[1],TT[0],TT[1]);c.lineTo(TB[0],TB[1]);c.quadraticCurveTo(QB[0],QB[1],N[0],N[1]);c.closePath();};
  c.fillStyle=C1;body();c.fill();
  c.save();body();c.clip();
  const bl=o.bel||[1,3.6,11,2.2];ell(c,bl[0],bl[1],bl[2],bl[3],C2);
  if(o.pat==='spots')for(let i=0;i<16;i++){const x=-8+((i*53)%19),y=top(x)+1+((i*31)%7)/7*2.6;disc(c,x,y,.32+(i%3)*.1,'rgba(255,255,255,.75)');}
  if(o.pat==='dspots')for(let i=0;i<18;i++){const x=-8+((i*37)%20),y=top(x)+.8+((i*29)%9)/9*3.4;disc(c,x,y,.36+(i%3)*.12,'rgba(40,28,20,.55)');}
  if(o.pat==='saddles')for(let i=0;i<5;i++){const x=-7+i*3.6;c.fillStyle='rgba(50,34,24,.5)';c.beginPath();c.ellipse(x,top(x)+.6,1.2,2.6,0,0,TAU);c.fill();}
  if(o.pat==='stripes')for(let i=0;i<9;i++){const x=-8+i*2.2;c.strokeStyle='rgba(40,46,56,.5)';c.lineWidth=.55;c.beginPath();c.moveTo(x,top(x)-1);c.quadraticCurveTo(x-.6,top(x)+1.6,x+.2,top(x)+3);c.stroke();}
  ell(c,(N[0]-9)/2,top((N[0]-9)/2)+1.2,8,.7,'rgba(255,255,255,.18)');
  c.restore();
  // first dorsal and near pectoral on top of the body
  if(o.d1)fin(o.d1[0],o.d1[1],o.d1[2]||2.2,o.d1[3]??.55,F,true,TIP);
  if(o.pec)fin(o.pec[0],o.pec[1],o.pec[2]||2,.9,F,false,TIP);
  // gills, mouth, eye
  (o.gills||[]).forEach(x=>{line(c,x,top(x)+1.4,x-.4,bot(x)-1,'rgba(30,38,48,.35)',.3);});
  if(o.mouth==='smile'){c.strokeStyle='rgba(30,38,48,.6)';c.lineWidth=.35;c.beginPath();c.moveTo(N[0]-1.2,bot(N[0]-1.2)-.5);c.quadraticCurveTo(N[0]-3,bot(N[0]-3)-.2,N[0]-4.6,bot(N[0]-4.6)-.9);c.stroke();}
  if(o.mouth==='teeth'){const mx=N[0]-1.4;c.fillStyle='#6A1E2A';c.beginPath();c.moveTo(mx,bot(mx)-.8);c.quadraticCurveTo(mx-2.4,bot(mx)+1.2,mx-4.4,bot(mx-4.4)-.6);c.quadraticCurveTo(mx-2.4,bot(mx)-.6,mx,bot(mx)-.8);c.fill();for(let i=0;i<4;i++)poly(c,[[mx-.8-i*.9,bot(mx)-.5],[mx-1.1-i*.9,bot(mx)+.4],[mx-1.4-i*.9,bot(mx)-.4]],'#FFF');}
  if(o.barbels){line(c,N[0]-.6,N[1]+.6,N[0]-.2,N[1]+2.4,C1,.45);line(c,N[0]-1.4,N[1]+.8,N[0]-1.2,N[1]+2.6,C1,.45);}
  const E=o.eye||[N[0]-4,top(N[0]-4)+1.3,.7];if(!E[2]){}else if(o.cat){ell(c,E[0],E[1],E[2]*1.2,E[2]*.8,'#D9C25A');ell(c,E[0]+.1,E[1],E[2]*.22,E[2]*.75,ink);}else{disc(c,E[0],E[1],E[2],ink);disc(c,E[0]+E[2]*.3,E[1]-E[2]*.35,E[2]*.32,'rgba(255,255,255,.9)');}
  if(o.extra)o.extra(c,t,top,bot,C1,C2,F);
  c.restore();}
const SHARKS={
 f_dogfish:{c1:'#8A7F72',c2:'#E8DFD0',f:'#7A6F62',k:.85,n:[12,1],qt:[6,-3.6],qb:[2,4],tj:.8,d1:[-1,2.6,1.6,.7],d2:[-5.4,1.8,1.1],pec:[5,2.4,1.6],pel:[-3,1.2,1],tail:'low',pat:'spots',eye:[8.6,-.4,.8],cat:true,bel:[1,3,11,1.6],gills:[6.4,6,5.6]},
 f_catshark:{c1:'#9A6B45',c2:'#F1E2C8',f:'#8A5B38',k:.85,n:[11.6,1.2],qt:[7,-3.4],qb:[2,4.2],tj:.8,d1:[-3.6,2.2,1.4,.7],d2:[-6.4,1.6,1],pec:[5,2.2,1.6],pel:[-1,1.2,1],anal:[-5,1.2,1],tail:'low',pat:'saddles',eye:[8.4,-.2,.85],cat:true,bel:[1,3.2,11,1.5],gills:[6,5.6,5.2]},
 f_blacktip_reef_shark:{c1:'#8C99A6',c2:'#F1F4F6',f:'#7E8B98',n:[12,1],qt:[5.4,-4.8],qb:[1,4.8],d1:[1,5,2.4,.55],d2:[-5.4,1.4,.9],pec:[4.4,4.4,2.2],anal:[-5,1.2,.9],pat:'tips',mouth:'smile',eye:[8.2,-.6,.65],gills:[5.6,5,4.4,3.8]},
 f_lemon_shark:{c1:'#C8B054',c2:'#F4EDC8',f:'#B39C45',n:[11.6,1.4],qt:[7,-5],qb:[1,5],d1:[.6,4,2.2,.5],d2:[-4.6,3.4,1.9,.5],pec:[4.4,4,2.2],anal:[-5.6,1.4,1],mouth:'smile',eye:[8,-.4,.7],gills:[5.4,4.8,4.2,3.6]},
 f_nurse_shark:{c1:'#A8865C',c2:'#E6D3B4',f:'#957450',n:[11.4,1.6],qt:[8.4,-4.2],qb:[2,5.2],tj:.9,d1:[-3,3.2,1.8,.4],d2:[-6.2,2.4,1.4,.4],pec:[4,3.4,2.6],pel:[-1.6,1.6,1.4],anal:[-5.4,1.6,1.1],tail:'low',barbels:true,eye:[8.6,-.2,.55],bel:[1,3.8,11,1.8],extra:(c,t,top)=>{for(let i=0;i<6;i++){const x=-6+i*2.6;disc(c,x,top(x)+1.8,.25,'rgba(80,60,40,.35)');}}},
 f_bull_shark:{c1:'#7C8691',c2:'#E9EDF0',f:'#6D7782',n:[11.2,1.8],qt:[8,-6.2],qb:[2,6],tj:1.1,d1:[1.4,5,2.6,.5],d2:[-5.4,1.4,1],pec:[4.6,4.6,2.6],anal:[-5.4,1.4,1],mouth:'smile',eye:[8.6,-.2,.5],bel:[1,4,11,2.4],gills:[5.4,4.8,4.2,3.6]},
 f_mako_shark:{c1:'#2F5FB8',c2:'#F1F5FC',f:'#284F9C',n:[12.6,.4],qt:[4,-4.4],qb:[1,4.2],tj:.75,d1:[1.4,4.6,2,.6],d2:[-6.4,.9,.6],pec:[4.6,4,1.8],anal:[-6.2,.9,.6],tail:'cres',mouth:'teeth',eye:[8.8,-.6,.85],bel:[1,3,11,1.9],gills:[5.6,5,4.4,3.8,3.2],extra:(c)=>{ell(c,-4,0,4,.5,'rgba(255,255,255,.25)');}},
 f_thresher_shark:{c1:'#6E5E8C',c2:'#E6E1EE',f:'#5F5079',k:.72,n:[12,.8],qt:[5,-5.2],qb:[1,5],d1:[1.8,5,2.4,.5],d2:[-6,1,.6],pec:[4.4,5.6,2],anal:[-6,1,.6],tail:'long',eye:[8,-.8,1.05],mouth:'smile',gills:[5.2,4.6,4]},
 f_tiger_shark:{c1:'#8C8E86',c2:'#ECE9DF',f:'#7B7D75',n:[11.6,1.6],qt:[7.4,-5.8],qb:[1,5.6],d1:[1,5,2.6,.5],d2:[-5.4,1.6,1],pec:[4.4,4.4,2.6],anal:[-5.4,1.6,1],tu:1.1,pat:'stripes',mouth:'smile',eye:[8.4,-.4,.6],bel:[1,4,11,2.2],gills:[5.4,4.8,4.2,3.6]},
 f_basking_shark:{c1:'#5E6670',c2:'#AEB6BE',f:'#525A64',n:[12.4,.4],qt:[6,-5.6],qb:[2,6],d1:[0,5.6,2.8,.5],d2:[-5.6,1.4,1],pec:[3.6,4.6,2.6],anal:[-5.6,1.4,1],eye:[0,0,0],bel:[1,4.4,11,2],
  extra:(c,t,top,bot,C1,C2)=>{const g=.5+.5*Math.sin(t/700);for(let i=0;i<5;i++){const x=7.2-i*1.25;c.strokeStyle='rgba(30,36,44,.5)';c.lineWidth=.4;c.beginPath();c.moveTo(x,top(x)+.5);c.quadraticCurveTo(x-.9,(top(x)+bot(x))/2,x-.3,bot(x)-.3);c.stroke();}
   c.fillStyle='#E9E4DC';c.beginPath();c.ellipse(10.2,2.2,2.3,2+g*.5,-.15,0,TAU);c.fill();c.fillStyle='#4A2630';c.beginPath();c.ellipse(10.3,2.2,1.75,1.5+g*.45,-.15,0,TAU);c.fill();for(let i=0;i<5;i++)line(c,9.2+i*.5,.9,9.1+i*.5,3.5+g*.3,'rgba(240,230,220,.55)',.18);
   c.fillStyle=C1;c.beginPath();c.moveTo(8.4,-.4);c.quadraticCurveTo(11,-1.6,13.2,-.2);c.quadraticCurveTo(11.6,.6,9,1);c.closePath();c.fill();disc(c,10.4,-.9,.42,'#1F2630');}},
 f_hammerhead:{c1:'#8A97A3',c2:'#EEF1F4',f:'#7B8894',n:[10.6,.8],qt:[5,-5],qb:[1,4.8],d1:[1.4,6.4,2.2,.4],d2:[-5.6,1.2,.8],pec:[4,4,2],anal:[-5.6,1,.8],eye:[0,0,0],gills:[6,5.4,4.8,4.2],
  extra:(c,t,top,bot,C1,C2,F)=>{c.fillStyle=C1;c.beginPath();c.moveTo(9.4,-.6);c.quadraticCurveTo(11,-5.6,12.2,-6);c.quadraticCurveTo(13.6,-5.8,12.8,-4.2);c.lineTo(12.2,4.6);c.quadraticCurveTo(13.4,6.4,12,6.6);c.quadraticCurveTo(10.6,6.2,9.6,2.2);c.closePath();c.fill();line(c,12.6,-4.4,12.4,4.8,'rgba(255,255,255,.3)',.4);disc(c,12.5,-5,.55,'#1F2630');disc(c,12.4,5.6,.55,'#1F2630');disc(c,12.65,-5.2,.18,'#fff');}},
 f_goblin_shark:{c1:'#D9A0A8',c2:'#F2D6D9',f:'#C78E96',n:[10.6,1.6],qt:[6,-4.4],qb:[1,5],tj:.9,d1:[-1.6,3,2,.5],d2:[-5,2.4,1.6,.5],pec:[3.4,2.6,1.8],anal:[-4,2,1.4],tail:'low',eye:[7.6,-.2,.55],bel:[1,3.8,11,1.6],gills:[4.8,4.2,3.6,3,2.4],
  extra:(c,t,top,bot,C1)=>{c.fillStyle=C1;c.beginPath();c.moveTo(9,-1);c.quadraticCurveTo(12,-1.8,16.4,-1.6);c.quadraticCurveTo(16.8,-.8,16,-.4);c.quadraticCurveTo(12,.2,9.4,1);c.closePath();c.fill();ell(c,13,-1.2,2.4,.3,'rgba(255,255,255,.3)');
   const j=.5+.5*Math.sin(t/500);c.fillStyle='#8E3A48';c.beginPath();c.moveTo(10.4,1.2);c.quadraticCurveTo(12.4+j*1.4,2+j,13.2+j*1.6,3.2+j*.8);c.quadraticCurveTo(11.6,4,9.2,3.2);c.closePath();c.fill();for(let i=0;i<6;i++)line(c,10.2+i*.5,1.4+i*.3,10.4+i*.5,2.6+i*.3+j*.3,'#FFF',.25);}},
 f_ghost_shark:null};
const GHOST=(c,t,v)=>{const C1=v?v.c1:'#D9DEE6',C2=v?v.c2:'#F4F6FA',ink='#1F2630';const sw=Math.sin(t/260);
  c.strokeStyle=C1;c.lineWidth=.9;c.lineCap='round';c.beginPath();c.moveTo(-6,.4);for(let i=1;i<=8;i++)c.lineTo(-6-i*1.4,.4+Math.sin(i*.8+t/240)*.8*(i/8));c.stroke();
  c.fillStyle=C1;c.beginPath();c.moveTo(-6.6,-.8);c.quadraticCurveTo(0,-5.6,7,-3.4);c.quadraticCurveTo(10.4,-2.4,10.2,.6);c.quadraticCurveTo(9.4,3.6,5,3.2);c.quadraticCurveTo(-1,3.4,-6.6,1);c.closePath();c.fill();
  c.save();c.clip();ell(c,2,2.6,9,1.6,C2);line(c,-6,0,8,-.6,'rgba(120,130,150,.45)',.35);c.restore();
  poly(c,[[1,-3.6],[2.6,-9],[4.4,-3.4]],C1);line(c,1.4,-3.6,2.8,-9.6,'#8A93A3',.4);poly(c,[[-5.6,-1.6],[-1,-4.4],[-.4,-2.4]],C1);
  c.fillStyle=v?v.c1:'#C9D0DA';c.beginPath();c.moveTo(4.6,1.6);c.quadraticCurveTo(2+sw*.8,7.4,-2.4,8.2);c.quadraticCurveTo(.4,4.6,2.6,1.4);c.closePath();c.fill();
  disc(c,7,-1.4,1.9,'#E6F2E8');disc(c,7.2,-1.4,1.35,'#2A6E5C');disc(c,7.3,-1.4,.75,ink);disc(c,6.7,-2,.4,'#fff');c.strokeStyle='rgba(30,38,48,.5)';c.lineWidth=.3;c.beginPath();c.moveTo(9.6,1.6);c.quadraticCurveTo(9,2.4,8,2.2);c.stroke();};
Object.entries(SHARKS).forEach(([id,o])=>{if(o)FA[id]=(c,t,v)=>SHK(c,t,o,v);});FA.f_ghost_shark=GHOST;
const FA_VARIANT=new Set([...Object.keys(SHARKS)].filter(id=>id!=='f_goblin_shark'));
Object.assign(FA,{
 f_coelacanth(c,t){glowAt(c,0,0,14,'120,170,255',.3);const sw=Math.sin(t/240)*.12;
  c.save();c.translate(-8.4,0);c.rotate(sw);c.fillStyle='#2E4F8C';c.beginPath();c.moveTo(.4,-1.6);c.quadraticCurveTo(-3,-6,-5,-6.4);c.quadraticCurveTo(-3.6,-2,-3.4,0);c.quadraticCurveTo(-3.6,2,-5,6.4);c.quadraticCurveTo(-3,6,.4,1.6);c.closePath();c.fill();ell(c,-4.4,0,1.6,1,'#2E4F8C');c.restore();
  const lobe=(x,y,a,l)=>{c.save();c.translate(x,y);c.rotate(a+Math.sin(t/300+x)*.15);ell(c,l*.45,0,l*.5,1.1,'#2E4F8C');poly(c,[[l*.8,-1],[l*1.25,0],[l*.8,1]],'#3E62A6');c.restore();};
  lobe(-1,-4.2,-2.3,3.4);lobe(-3.6,3.6,2.2,3);lobe(3,3.6,1.9,3.4);lobe(-5.4,-2.6,-2.6,2.6);
  ell(c,0,0,9,4.8,'#3A5FA3');c.save();c.beginPath();c.ellipse(0,0,9,4.8,0,0,TAU);c.clip();ell(c,0,3.4,9,1.8,'#4A70B6');[[-5,-1],[-2.6,1.6],[0,-2.4],[2.4,.6],[4.6,-1.8],[-6.6,1.8],[1,2.6],[-3.4,-3]].forEach(([x,y],i)=>{c.fillStyle='rgba(235,242,255,.8)';c.beginPath();c.ellipse(x,y,.9+(i%3)*.25,.6,(i%2)*.6,0,TAU);c.fill();});for(let i=0;i<6;i++)c.fillRect(-7+i*2.6,-4.6,.12,9);c.restore();
  poly(c,[[-1,-4.4],[1.4,-8],[3.2,-4.2]],'#2E4F8C');for(let i=0;i<3;i++)line(c,1+i*.7,-4.4,1.6+i*.6,-7.4+i,'rgba(160,190,240,.5)',.25);
  c.strokeStyle='rgba(20,30,60,.6)';c.lineWidth=.35;c.beginPath();c.moveTo(8.8,.8);c.quadraticCurveTo(7.4,1.6,6,1.2);c.stroke();disc(c,6.2,-1.2,1.15,'#E8F2F0');disc(c,6.4,-1.2,.8,'#2A8A86');disc(c,6.5,-1.2,.4,'#0F1A2A');disc(c,6.1,-1.6,.25,'#fff');spk(c,-4,-6.6,1.6,t);},
 f_oarfish(c,t){glowAt(c,2,0,15,'255,214,180',.25);const P=[];for(let i=0;i<=22;i++){const u=i/22;P.push([12-u*24,Math.sin(u*7.4-t/260)*2.6*(.3+u*.7)-u*1.2+1]);}
  for(let i=1;i<P.length;i++){const[x,y]=P[i],[x0,y0]=P[i-1];c.fillStyle=i%2?'#E0453B':'#F06A50';c.beginPath();c.moveTo(x0,y0-1.4);c.lineTo(x,y-1.4);c.lineTo((x+x0)/2,(y+y0)/2-3.4-Math.sin(i+t/200)*.5);c.closePath();c.fill();}
  c.lineCap='round';c.strokeStyle='#C9D3DE';c.lineWidth=3.2;c.beginPath();P.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.strokeStyle='#EEF3F8';c.lineWidth=1.3;c.stroke();c.strokeStyle='rgba(90,110,140,.5)';c.lineWidth=.3;c.beginPath();P.forEach(([x,y],i)=>i?c.lineTo(x,y+.9):c.moveTo(x,y+.9));c.stroke();
  for(let i=2;i<P.length;i+=3)disc(c,P[i][0],P[i][1]-.2,.3,'rgba(80,100,130,.5)');
  const[hx,hy]=P[0];ell(c,hx-.6,hy,2.2,1.9,'#C9D3DE');for(let i=0;i<5;i++){const a=-2.2-i*.18+Math.sin(t/300+i)*.08;c.strokeStyle='#E0453B';c.lineWidth=.55;c.beginPath();c.moveTo(hx-1,hy-1.4);c.quadraticCurveTo(hx-1+Math.cos(a)*3,hy-1.4+Math.sin(a)*4,hx-1+Math.cos(a)*5.6,hy-1.4+Math.sin(a)*6.4);c.stroke();}
  disc(c,hx+.2,hy-.4,.75,'#1F2630');disc(c,hx+.4,hy-.7,.25,'#fff');line(c,hx+1.4,hy+.6,hx+.4,hy+1,'rgba(30,38,48,.5)',.3);},
 f_barreleye(c,t){glowAt(c,0,-2,13,'140,255,190',.35);const sw=Math.sin(t/220)*.15;fTail(c,-7,1.2,3.6,'#4A3A3A',sw);
  ell(c,-.6,1.6,7,3.2,'#5A4644');c.save();c.beginPath();c.ellipse(-.6,1.6,7,3.2,0,0,TAU);c.clip();ell(c,-.6,3.8,7,1.6,'#7A625C');for(let i=0;i<5;i++)line(c,-5+i*2.4,-1,-5.4+i*2.4,4.4,'rgba(30,20,20,.35)',.3);c.restore();
  poly(c,[[-3,-1],[-1.6,-3],[0,-1]],'#4A3A3A');poly(c,[[1,4.4],[2.4,6.6],[3.4,4.2]],'#4A3A3A');
  c.fillStyle='rgba(190,240,255,.28)';c.beginPath();c.moveTo(-1.6,-.6);c.quadraticCurveTo(-1,-7.6,4.6,-7);c.quadraticCurveTo(8.4,-6,7.6,-1);c.quadraticCurveTo(5,0,-1.6,-.6);c.fill();c.strokeStyle='rgba(220,250,255,.75)';c.lineWidth=.35;c.stroke();ell(c,1.6,-5.6,2.4,.5,'rgba(255,255,255,.35)');
  const g=.75+.25*Math.sin(t/300);[[3.2,-3.6],[5.2,-3.4]].forEach(([x,y])=>{c.fillStyle=`rgba(60,230,120,${g})`;c.beginPath();c.ellipse(x,y,.8,1.6,-.15,0,TAU);c.fill();disc(c,x,y-1.3,.55,'#B8FFD0');glowAt(c,x,y-1.3,2.4,'140,255,180',.6*g);});
  disc(c,6.4,.4,.35,'#1F2630');disc(c,6.9,-.2,.22,'#1F2630');line(c,7,1.4,6.2,1.6,'rgba(30,20,20,.6)',.3);spk(c,-5,-4,1.6,t);},
 f_glass_octopus(c,t){glowAt(c,0,0,14,'200,240,255',.3);for(let i=0;i<8;i++){const a=.5+i*.32,ph=t/300+i;c.strokeStyle='rgba(170,215,240,.8)';c.lineWidth=1.3-(i%2)*.3;c.lineCap='round';c.beginPath();c.moveTo(-1+i*.4,3);c.bezierCurveTo(-3+i*1.2+Math.sin(ph)*1.5,6,-6+i*2.2+Math.sin(ph+1)*2,8,-7+i*2.4+Math.sin(ph+2)*2.6,9.4);c.stroke();}
  c.fillStyle='rgba(185,225,248,.6)';c.beginPath();c.moveTo(-6,3);c.quadraticCurveTo(-7,-8.4,1,-8.6);c.quadraticCurveTo(8.6,-8,7,1.6);c.quadraticCurveTo(5,4.4,0,4);c.quadraticCurveTo(-4,4.2,-6,3);c.fill();c.strokeStyle='rgba(255,255,255,.95)';c.lineWidth=.5;c.stroke();
  ell(c,0,-6.4,4,.7,'rgba(255,255,255,.45)');ell(c,.6,-2.6,2.2,1.6,'#F2A33A');ell(c,.6,-2.6,1.4,1,'#F7C26A');c.strokeStyle='rgba(242,163,58,.7)';c.lineWidth=.3;c.beginPath();c.moveTo(.6,-1);c.quadraticCurveTo(1,1,2.6,1.6);c.stroke();
  [[-2.6,.6],[4,.6]].forEach(([x,y])=>{ell(c,x,y,1.4,.9,'rgba(60,70,90,.85)');disc(c,x+.3,y-.2,.3,'#fff');});line(c,-1.4,.6,2.8,.6,'rgba(120,140,170,.5)',.25);spk(c,6,-6,1.8,t);spk(c,-5,-5,1.4,t,2);}
});
// variants of FA sharks get their colours; everything else as before
const _drawFish10=drawFish;
drawFish=function(c,f,x,y,s,t=0,sil=false,v=''){if(f&&FA[f.id]&&v&&!sil&&!FA_VARIANT.has(f.id)){return drawTinted(c,f,x,y,s,t,v);}
  if(f&&FA[f.id]&&v&&!sil&&FA_VARIANT.has(f.id)){const hue=(t/12)%360;const vc={c1:v==='g'?'#E9B730':v==='a'?'#F6F1EA':`hsl(${hue},80%,62%)`,c2:v==='g'?'#FFE9A6':v==='a'?'#FFFFFF':`hsl(${(hue+90)%360},85%,82%)`};
  c.save();c.translate(x,y);glowAt(c,0,0,14*s,v==='g'?'255,214,110':v==='a'?'255,255,255':'200,150,255',.45);c.scale(s,s);FA[f.id](c,t,vc);c.restore();spk(c,x-7*s,y-6*s,2*s,t);spk(c,x+8*s,y+5*s,1.6*s,t,2);return;}
  return _drawFish10(c,f,x,y,s,t,sil,v);};

/* ---------- fishing rewards: harder, and more of them (anything earned before v4 is kept) ---------- */
const FISH_EARN={hull_sharkskin:50,hull_scales:6000,hull_koi:105,hull_angler:15,sail_net:25,sail_scales:1000,sail_koi:95,sail_jaws:200,sail_galaxy:3,fig_swordfish:40,fig_shark:75,fig_koi:30,fig_angler:5,fig_goldfish:5,flag_fish:10,flag_fin:25,dk_rods:100,dk_net:3000,dk_trophy:5,dk_tank:80,fishrack:500,aquarium:55};
const FISH_UNIT={fishSpecies:['Catch {n} different fish','species'],fishTotal:['Land {n} fish','fish'],fishWhoppers:['Land {n} Whoppers or bigger','whoppers'],fishVariants:['Catch {n} different variant fish (Golden, Albino or Rainbow)','variants'],fishLegend:['Catch {n} different legendary or rarer fish','species'],fishTrans:['Catch {n} different transcendent fish','species']};
Object.entries(FISH_EARN).forEach(([id,n])=>{const it=ALL_ITEMS[id];if(!it||!it.earn)return;it.earn0=it.earn[1];const u=FISH_UNIT[it.earn[0]];it.earn=[it.earn[0],n,u?u[0].replace('{n}',fmtN(n)):it.earn[2],u?u[1]:it.earn[3]];});
[{id:'hull_abyss',name:'Abyssal Hull',cat:'hull',col:'#0F1A3A',col2:'#0A1228',pat:'glow',desc:'Glows like something that should not exist.',earn:['fishMythic',5,'Catch 5 different mythic or rarer fish','species']},
 {id:'sail_leviathan',name:'Leviathan Sails',cat:'sail',col:'#2E1F4A',col2:'#9B5DE5',pat:'scales',earn:['fishMythic',10,'Catch 10 different mythic or rarer fish','species']},
 {id:'flag_record',name:'Record Breaker',cat:'flag',col:'#F2C462',sym:'fish',sc:'#2C3E50',gold:true,earn:['fishRecords',25,'Hold 25 size records at once','records']},
 {id:'hull_record',name:'Record Book Hull',cat:'hull',col:'#3A2F2A',col2:'#2A211D',pat:'royal',gold:true,earn:['fishRecords',60,'Hold 60 size records at once','records']},
 {id:'sail_rows',name:"Collector's Sails",cat:'sail',col:'#F4EFE4',col2:'#3E8DDB',pat:'koi',earn:['fishRows',5,'Complete 5 rarity rows of the trophy case','rows']},
 {id:'sail_shiny',name:'Shiny Sails',cat:'sail',col:'#FFF3C4',col2:'#E2AE2C',pat:'scales',earn:['fishVariants',120,'Catch 120 different variant fish','variants']},
 {id:'hull_funnalfish',name:'Funnal Fish Hull',cat:'hull',col:'#17181D',col2:'#0F1014',pat:'galaxy',gold:true,desc:'Every rumour, true.',earn:['fishTrans',8,'Catch all 8 transcendent fish','species']}].forEach(i=>{if(!ALL_ITEMS[i.id]){ITEMS.push(i);ALL_ITEMS[i.id]=i;}});
[['fmyth1','Mythical','Catch a mythic or rarer fish','legendary','Fishing',['fishMythic',1]],['fmyth10','Myth Hunter','Catch 10 different mythic or rarer fish','mythic','Fishing',['fishMythic',10]],
 ['frec25','Record Keeper','Hold 25 size records at once','rare','Fishing',['fishRecords',25]],['frec60','Weigh-in Champion','Hold 60 size records at once','epic','Fishing',['fishRecords',60]],
 ['frow1','Row Complete','Complete a rarity row of the trophy case','rare','Fishing',['fishRows',1]],['frow6','Six Rows Deep','Complete every row up to mythic','mythic','Fishing',['fishRows',6]],
 ['fish10k','Ten Thousand Fish','Land 10,000 fish','mythic','Fishing',['fishTotal',10000]],['fwhop250','Tall Tales','Land 250 Whoppers','legendary','Fishing',['fishWhoppers',250]],['fvar100','Shiny Collector','Catch 100 different variants','mythic','Fishing',['fishVariants',100]],
 ['fsp120','The Complete Trophy Case','Catch all 120 fish','transcendent','Fishing',['fishSpecies',120]],['ftr8','Every Rumour','Catch all 8 transcendent fish','transcendent','Fishing',['fishTrans',8]]]
 .forEach(([id,name,desc,rar,cat,[metric,target]])=>{if(ACH_BY_ID[id])return;const a={id,name,desc,rar,cat,metric,target,secret:false};ACHIEVEMENTS.push(a);ACH_BY_ID[id]=a;});
Object.assign(ACH_GLYPH,{fishMythic:'fishg',fishRecords:'trophy',fishRows:'fishg'});
const _fishMetrics4=fishMetrics;
fishMetrics=function(p,evs,sessions,lock){const m=_fishMetrics4(p,evs,sessions,lock);const fc=computeFish(p,evs,sessions,lock);const ids=Object.keys(fc.by);
  m.fishMythic=ids.filter(id=>FISH_RI[FISH_BY_ID[id].rar]>=5).length;m.fishRows=Object.keys(FISH_RAR).filter(r=>FISH.filter(f=>f.rar===r).every(f=>fc.by[f.id])).length;return m;};
// what the numbers were before v4 (old rarities), so nothing earned then is lost
function fishMetricsPre(p,evs,sessions,lock){const fc=computeFish(p,evs,sessions,lock);const l=fc.list.filter(x=>x.t<FISH_V4_AT);if(!l.length)return null;const by={},vars={};let wh=0;
  l.forEach(x=>{by[x.f.id]=1;if(x.v)vars[x.f.id+'~'+x.v]=1;if(x.cm/x.f.len>=1.3)wh++;});const ids=Object.keys(by);
  return{fishSpecies:ids.length,fishTotal:l.length,fishWhoppers:wh,fishVariants:Object.keys(vars).length,fishLegend:ids.filter(id=>FISH_RI[FISH_BY_ID[id].rar0]>=4).length,fishTrans:ids.filter(id=>FISH_BY_ID[id].rar0==='transcendent').length};}
// size records held, worked out inside derive (no G yet)
function fishRecordsHeld(P,evs,sessions,players){const best={};P.forEach(p=>{const fc=computeFish(p,evs,sessions[p],players[p]?.lock);for(const id in fc.best){const b=fc.best[id];if(!best[id]||b.cm>best[id].cm||(b.cm===best[id].cm&&b.t<best[id].t))best[id]={p,cm:b.cm,t:b.t};}});
  const o={};P.forEach(p=>o[p]=0);Object.values(best).forEach(b=>o[b.p]++);return o;}

/* ============================== MULTIPLAYER CHALLENGES v2: built for 5 DMs a minute ============================== */
const CHAL2={
 duel15:{name:'Quick Draw Duel',kind:'duel',dur:15,stake:true,desc:'Head to head: most DMs in 15 minutes wins. At full pace that is 70 or more each.',win:{xp:300,g:120},lose:{xp:80,g:20}},
 haul45:{name:'The Long Haul',kind:'duel',dur:45,stake:true,desc:'A 45-minute duel. Stamina wins this one, not a fast start.',win:{xp:650,g:260},lose:{xp:160,g:40}},
 race100:{name:'Treasure Race',kind:'race',dur:30,target:100,stake:true,desc:'First captain to 100 DMs takes the chest. 30 minutes on the clock.',win:{xp:450,g:170},lose:{xp:110,g:25}},
 tug:{name:'Tug of War',kind:'tug',dur:20,target:25,stake:true,desc:'Every DM pulls the rope your way. Lead by 25 and it is over. Otherwise whoever is ahead at 20 minutes wins.',win:{xp:350,g:130},lose:{xp:90,g:20}},
 hill:{name:'King of the Hill',kind:'hill',dur:30,stake:true,desc:'30 one-minute rounds. Send more DMs than your rival in a minute to take that round. Most rounds wins.',win:{xp:500,g:180},lose:{xp:120,g:30}},
 fuse:{name:'Short Fuse',kind:'fuse',dur:20,gap:15,coop:true,desc:'Co-op: keep the fuse lit for 20 minutes. If 15 seconds pass without a DM from either of you, it fizzles out.',win:{xp:400,g:140},lose:{xp:60,g:10}},
 triple:{name:'Triple Century',kind:'coop',dur:45,target:300,coop:true,desc:'Co-op: 300 crew DMs in 45 minutes. A bit over 3 a minute each, every single minute.',win:{xp:550,g:200},lose:{xp:80,g:15}},
 kraid:{name:'Kraken Raid',kind:'raid',dur:30,target:300,coop:true,desc:'Co-op: sink a 300 HP kraken in 30 minutes. Each DM hits for 1, and about 1 in 8 is a critical for 3.',win:{xp:600,g:220},lose:{xp:80,g:15}},
 rush:{name:'Boss Rush',kind:'rush',dur:30,hp:[60,90,120],coop:true,desc:'Co-op: three bosses back to back (60, 90 and 120 HP) in 30 minutes. Every boss you sink pays out.',each:{xp:150,g:50},all:{xp:250,g:90},lose:{xp:40,g:5}},
 lastpush:{name:'The Last Push',kind:'coop',dur:45,coop:true,desc:"Co-op: finish today's remaining DMs in 45 minutes.",win:{xp:300,g:100},lose:{xp:50,g:10}}};
const STAKES=[0,50,150,400];
const raidHit=e=>h32(e.id+'crit')%8===0?3:1;
function evalChallenge2(id,c,evs,now){const P=C().playerIds;const T=CHAL2[c.type]||CHAL2.duel15;const players=P.filter(p=>c.acc?.[p]);const allIn=P.every(p=>c.acc?.[p]);
  const start=c.start||0,end=start+(c.dur||T.dur*60000);
  let state=c.status==='declined'||c.status==='cancelled'?c.status:!allIn?(now-(c.created||0)>15*60000?'expired':'pending'):now<start?'countdown':now<end?'live':'done';
  const cnt=Object.fromEntries(P.map(p=>[p,0])),last={};const seq=[];
  if(start){let lo=0,hi=evs.length;while(lo<hi){const m=(lo+hi)>>1;if(evs[m].t<start)lo=m+1;else hi=m;}for(let i=lo;i<evs.length&&evs[i].t<=Math.min(end,now);i++){const e=evs[i];if(e.k!=='d'||!P.includes(e.pid))continue;seq.push(e);}}
  const team=()=>P.reduce((a,p)=>a+cnt[p],0);const won={},reward={};let lastSecond=null,doneAt=0,winner=null,draw=false,info={};const tgt=c.target||T.target||0;
  // walk the DMs in order; some challenges end early
  let rope=0,hp=tgt,boss=0,bhp=(T.hp||[])[0]||0,sunk=0,fizz=0,lastT=start,rounds={},roundWins=Object.fromEntries(P.map(p=>[p,0]));
  for(const e of seq){if(doneAt)break;
    if(T.kind==='fuse'&&e.t-lastT>T.gap*1000){fizz=lastT+T.gap*1000;doneAt=fizz;break;}
    cnt[e.pid]++;last[e.pid]=e.t;lastT=e.t;
    if(T.kind==='race'&&cnt[e.pid]>=tgt){winner=e.pid;doneAt=e.t;}
    if(T.kind==='tug'&&P.length>1){rope+=e.pid===P[0]?1:-1;if(Math.abs(rope)>=tgt){winner=rope>0?P[0]:P[1];doneAt=e.t;}}
    if(T.kind==='coop'&&tgt&&team()>=tgt){doneAt=e.t;}
    if(T.kind==='raid'){hp-=raidHit(e);if(hp<=0){hp=0;doneAt=e.t;}}
    if(T.kind==='rush'){bhp-=1;if(bhp<=0){sunk++;boss++;if(boss>=T.hp.length){doneAt=e.t;bhp=0;}else bhp=T.hp[boss];}}
    if(T.kind==='hill'){const r=Math.floor((e.t-start)/60000);(rounds[r]=rounds[r]||Object.fromEntries(P.map(p=>[p,0])))[e.pid]++;}}
  if(T.kind==='fuse'&&!doneAt&&state!=='pending'&&state!=='countdown'){const lim=lastT+T.gap*1000;if(lim<Math.min(now,end)){fizz=lim;doneAt=lim;}}
  if(doneAt&&(state==='live'||state==='done'))state='done';
  const elapsed=Math.max(0,(doneAt||Math.min(now,end))-start);
  if(T.kind==='hill'){const upto=Math.floor(((state==='done'?end:now)-start)/60000);for(const r in rounds){if(+r>=upto&&state!=='done')continue;const x=rounds[r];if(P.length>1&&x[P[0]]!==x[P[1]])roundWins[x[P[0]]>x[P[1]]?P[0]:P[1]]++;}info.rounds=roundWins;info.cur=Math.min(T.dur-1,Math.floor(elapsed/60000));info.curRound=rounds[info.cur]||Object.fromEntries(P.map(p=>[p,0]));}
  info.rope=rope;info.hp=hp;info.boss=boss;info.bhp=bhp;info.sunk=sunk;info.fizz=fizz;info.lastT=lastT;info.elapsed=elapsed;
  if(state==='done'){const[a,b]=P;const stake=c.stake||0;
    if(T.coop){let ok=false;if(T.kind==='fuse')ok=!fizz;else if(T.kind==='raid')ok=hp<=0;else if(T.kind==='rush')ok=sunk>=T.hp.length;else ok=team()>=tgt;
      P.forEach(p=>{won[p]=ok;if(T.kind==='rush'){reward[p]={xp:T.each.xp*sunk+(ok?T.all.xp:0)||T.lose.xp,g:T.each.g*sunk+(ok?T.all.g:0)||T.lose.g};}else reward[p]=ok?{...T.win}:{...T.lose};});
      if(ok&&T.kind!=='fuse'){const lt=Math.max(...P.map(p=>last[p]||0));if(end-lt<=10000)lastSecond=true;}}
    else{if(!winner){if(T.kind==='hill'){const ra=roundWins[a],rb=roundWins[b];if(ra!==rb)winner=ra>rb?a:b;}else if(T.kind==='tug'){if(rope)winner=rope>0?a:b;}else if(cnt[a]!==cnt[b])winner=cnt[a]>cnt[b]?a:b;}
      if(!winner){draw=true;P.forEach(p=>reward[p]={xp:Math.round((T.win.xp+T.lose.xp)/2),g:Math.round((T.win.g+T.lose.g)/2)});}
      else{const l=other(winner);won[winner]=true;reward[winner]={xp:T.win.xp,g:T.win.g+stake};reward[l]={xp:T.lose.xp,g:T.lose.g-stake};if(last[winner]&&end-last[winner]<=10000&&!doneAt)lastSecond=winner;}}}
  // when the state could next change by itself (for a timely refresh)
  let next=0;if(state==='live'){if(T.kind==='fuse')next=lastT+T.gap*1000+50;if(T.kind==='hill')next=start+(Math.floor((now-start)/60000)+1)*60000+50;}
  return{id,c,v:2,T,state,start,end,cnt,team:team(),coop:!!T.coop,won,reward,players,lastSecond,raceWin:T.kind==='race'?winner:null,winner,draw,info,doneAt,next,elapsed,tgt};}
const _evalChallenge1=evalChallenge;evalChallenge=function(id,c,evs,now){return c&&c.v===2?evalChallenge2(id,c,evs,now):_evalChallenge1(id,c,evs,now);};
// best results ever, per challenge
function chalRecords(){const R={};(G.chals||[]).filter(ch=>ch.v===2&&ch.state==='done').forEach(ch=>{const k=ch.c.type,T=ch.T;let val=null,who=null,lab='';
  if(T.kind==='duel'){who=G.P.slice().sort((a,b)=>ch.cnt[b]-ch.cnt[a])[0];val=ch.cnt[who];lab=val+' DMs';}
  else if(T.kind==='race'&&ch.winner){who=ch.winner;val=-ch.elapsed;lab=clockStr(ch.elapsed);}
  else if(T.kind==='tug'&&ch.winner&&ch.doneAt){who=ch.winner;val=-ch.elapsed;lab='won in '+clockStr(ch.elapsed);}
  else if(T.kind==='hill'&&ch.winner){who=ch.winner;val=ch.info.rounds[who];lab=val+' rounds';}
  else if(T.coop&&ch.won[G.P[0]]&&T.kind!=='fuse'){who='crew';val=-ch.elapsed;lab='done in '+clockStr(ch.elapsed);}
  else if(T.kind==='fuse'&&ch.won[G.P[0]]){who='crew';val=ch.team;lab=ch.team+' DMs, fuse never went out';}
  if(val==null)return;if(!R[k]||val>R[k].val)R[k]={val,who,lab,date:L(ch.start).date};});return R;}
function chalLive(ch){const T=ch.T,c=ch.c,P=G.P,i=ch.info;const sc=`<div class="cScore">${P.map(p=>`<span style="color:${pcol(p)}"><b class="num">${ch.cnt[p]}</b>${pname(p)}</span>`).join('<i>vs</i>')}</div>`;
  if(T.kind==='duel')return sc;
  if(T.kind==='race')return sc+P.map(p=>`<div class="cLane"><small>${pname(p)}</small>${bar(ch.cnt[p],ch.tgt,p===P[0]?'':'team')}</div>`).join('');
  if(T.kind==='tug'){const pos=50+clamp(i.rope/ch.tgt,-1,1)*50;return sc+`<div class="rope"><i style="left:${pos}%"></i><span style="left:0">${pname(P[1])} wins here</span><span style="right:0">${pname(P[0])}</span></div><small class="tiny muted">${i.rope?`${pname(i.rope>0?P[0]:P[1])} leads by ${Math.abs(i.rope)} of ${ch.tgt}`:'Dead level'}</small>`;}
  if(T.kind==='hill')return `<div class="cScore">${P.map(p=>`<span style="color:${pcol(p)}"><b class="num">${i.rounds[p]}</b>${pname(p)}</span>`).join('<i>rounds</i>')}</div><small class="tiny muted">Round ${i.cur+1} of ${T.dur}: ${P.map(p=>`${pname(p)} ${i.curRound[p]}`).join(' · ')}</small>`;
  if(T.kind==='fuse')return `<div class="fuse"><i style="width:${clamp((Date.now()-i.lastT)/(T.gap*1000),0,1)*100}%"></i></div><small class="tiny muted">${ch.team} DMs so far · fizzles in <b class="cdn" data-t="${i.lastT+T.gap*1000}">${Math.max(0,Math.ceil((i.lastT+T.gap*1000-Date.now())/1000))}s</b> without a DM</small>`;
  if(T.kind==='raid')return `<div class="row between tiny"><span>Kraken ${i.hp} / ${ch.tgt} HP</span><span>${P.map(p=>`${pname(p)} ${ch.cnt[p]}`).join(' · ')}</span></div>${bar(ch.tgt-i.hp,ch.tgt,'team')}`;
  if(T.kind==='rush')return `<div class="row between tiny"><span>Boss ${Math.min(i.boss+1,3)} of 3 · ${i.bhp} HP left</span><span>${i.sunk} sunk</span></div>${bar((T.hp[i.boss]||1)-i.bhp,T.hp[i.boss]||1,'team')}`;
  return `<div class="row between tiny"><span>Crew ${ch.team} / ${ch.tgt}</span><span>${P.map(p=>`${pname(p)} ${ch.cnt[p]}`).join(' · ')}</span></div>${bar(ch.team,ch.tgt,'team')}`;}
function chalResult(ch){const P=G.P,T=ch.T;const r=ch.reward[S.me]||{xp:0,g:0};const res=T.coop?(ch.won[S.me]?'Crew win':'Not this time'):ch.draw?'Draw':ch.winner===S.me?'You won':pname(ch.winner)+' won';
  return `<div class="li cRes"><div class="grow"><b>${esc(T.name)}</b><br><small>${res} · ${T.coop?`${ch.team} crew DMs`:P.map(p=>`${pname(p)} ${T.kind==='hill'?ch.info.rounds[p]+' rounds':ch.cnt[p]}`).join(' v ')} · ${shortDate(L(ch.start).date)}</small></div><small class="num">${r.xp?'+'+r.xp+' XP':''} ${r.g?(r.g>0?'+':'')+r.g+' '+CN:''}</small></div>`;}
challengesHtml=function(){const live=G.chals.filter(c=>['pending','countdown','live'].includes(c.state));const recent=G.chals.filter(c=>c.state==='done').slice(0,5);const o=other(S.me);
  const D=G.days[G.today];const remaining=Math.max(0,D.target-D.team);const rec=chalRecords();const st=S.view.stake||0;const bal=G.players[S.me].balance,obal=G.players[o]?.balance||0;
  return `<div class="card chal2"><div class="row between"><h3>Multiplayer challenges</h3><small>built for 5 DMs a minute</small></div>
  ${live.map(ch=>{const c=ch.c;const T=ch.T||CHAL2[c.type]||{name:c.type,desc:''};const mine=ch.state==='pending'&&!c.acc?.[S.me];
    return `<div class="li cLive" style="display:grid;gap:6px;margin-top:8px"><div class="row between"><b>${esc(T.name||c.type)}${c.stake?` <span class="pill">${c.stake} ${CN} each on it</span>`:''}</b><span class="pill">${ch.state==='pending'?'waiting for '+(mine?'you':pname(o)):ch.state==='countdown'?'starts in <span class="cdn" data-t="'+ch.start+'">'+Math.ceil((ch.start-Date.now())/1000)+'s</span>':'<span class="cdn" data-t="'+ch.end+'">'+clockStr(ch.end-Date.now())+'</span> left'}</span></div>
     ${ch.state==='pending'?`<small class="muted">${esc(T.desc||'')}</small>`:ch.v===2?chalLive(ch):`<div class="row between">${G.P.map(p=>`<span style="color:${pcol(p)};font:600 18px var(--display)">${pname(p)} ${ch.cnt[p]}</span>`).join('<span class="muted">vs</span>')}</div>`}
     <div class="row">${mine?`<button class="btn primary sm" data-act="chalAccept" data-id="${ch.id}" ${c.stake&&bal<c.stake?'disabled':''}>Accept${c.stake?` (${c.stake} ${CN})`:''}</button><button class="btn ghost sm" data-act="chalDecline" data-id="${ch.id}">Decline</button>`:''}${ch.state==='pending'&&c.by===S.me?`<button class="btn ghost sm" data-act="chalDecline" data-id="${ch.id}">Cancel</button>`:''}</div></div>`;}).join('')}
  ${live.length?'':`<p class="muted tiny" style="margin:4px 0 8px">Start one and ${pname(o)} gets an invite. Duels can carry a stake: the winner takes the pot.</p>
   <div class="stakeRow"><small>Stake for duels</small><div class="seg mini">${STAKES.map(s=>`<button class="${s===st?'on':''}" data-act="chalStake" data-s="${s}" ${s>bal||s>obal?'disabled':''}>${s?s:'None'}</button>`).join('')}</div></div>
   <div class="list">${Object.entries(CHAL2).map(([id,T])=>{const tg=id==='lastpush'?remaining:(T.target||0);const r=rec[id];return `<div class="li"><div class="grow"><b>${esc(T.name)}</b> <span class="pill">${T.coop?'co-op':'versus'} · ${T.dur} min</span><br><small>${esc(id==='lastpush'?`Co-op: finish today's remaining ${remaining} DMs in 45 minutes.`:T.desc)}</small><br><small class="cRew">Win: +${T.win?T.win.xp:T.each.xp*3+T.all.xp} XP, +${T.win?T.win.g:T.each.g*3+T.all.g} ${CN}${T.stake&&st?` + the ${st*2} pot`:''}${r?` · Record: ${esc(r.lab)}${r.who&&r.who!=='crew'?' ('+pname(r.who)+')':''}`:''}</small></div><button class="btn sm" data-act="chalCreate" data-type="${id}" data-m="${T.dur}" data-tg="${tg}" ${id==='lastpush'&&!remaining?'disabled':''}>Challenge</button></div>`;}).join('')}</div>`}
  ${recent.length?`<h4 class="offH">Recent</h4><div class="list">${recent.map(ch=>ch.v===2?chalResult(ch):`<div class="li"><div class="grow"><small>${esc(ch.c.type)} · ${G.P.map(p=>pname(p)+' '+ch.cnt[p]).join(' v ')}</small></div></div>`).join('')}</div>`:''}
  </div>`;};
Object.assign(ACT,{chalStake(d){S.view.stake=+d.s;render();},
  async chalCreate(d){const T=CHAL2[d.type];if(!T)return;const stake=T.stake?(S.view.stake||0):0;if(stake&&G.players[S.me].balance<stake)return toast('<b>Not enough doubloons for that stake.</b>','joke');
    const id=uid();try{await S.db.collection('challenges').doc(id).set({v:2,type:d.type,dur:+d.m*60000,target:+d.tg,stake,by:S.me,acc:{[S.me]:true},created:Date.now(),status:'pending'});toast(`<b>Challenge sent.</b> Waiting for ${pname(other(S.me))} to accept.`);}catch(e){writeFail(e);}},
  async chalAccept(d){const c=S.challenges[d.id];if(c&&c.stake&&G.players[S.me].balance<c.stake)return toast('<b>Not enough doubloons to match the stake.</b>','joke');try{await S.db.doc('challenges/'+d.id).update({acc:{[S.me]:true},start:Date.now()+10000,status:'on'});banner('CHALLENGE ACCEPTED','Starts in 10 seconds');}catch(e){writeFail(e);}}});
// result banner when a challenge you played finishes
function checkChal(){if(!G||!S.me)return;const done=new Set(G.chals.filter(c=>c.state==='done').map(c=>c.id));if(!S.chalSeen){S.chalSeen=done;return;}
  G.chals.filter(c=>c.state==='done'&&!S.chalSeen.has(c.id)&&c.v===2&&Date.now()-c.end<3600000&&c.players.includes(S.me)).forEach(ch=>{const r=ch.reward[S.me]||{xp:0,g:0};
    if(ch.coop)banner(ch.won[S.me]?'CREW WINS!':'SO CLOSE',`${ch.T.name}: +${r.xp} XP`);else banner(ch.draw?'DEAD HEAT':ch.winner===S.me?'YOU WIN!':'BEATEN',`${ch.T.name}: +${r.xp} XP${r.g?`, ${r.g>0?'+':''}${r.g} doubloons`:''}`);
    if(ch.won[S.me])fireworks(2200);try{(ch.won[S.me]?SND.level:SND.pop)();}catch(e){}});S.chalSeen=done;}
const _decor10b=decorateView;decorateView=function(){_decor10b();try{checkChal();}catch(e){console.error(e);}};
[{id:'flag_duellist',name:"Duellist's Colours",cat:'flag',col:'#8E2232',sym:'swords',sc:'#F2C462',earn:['chalWon',10,'Win 10 multiplayer challenges','wins']},
 {id:'sail_champion',name:"Champion's Sails",cat:'sail',col:'#2C3E50',col2:'#F2C462',pat:'compass',earn:['chalWon',40,'Win 40 multiplayer challenges','wins']},
 {id:'flag_raid',name:'Raid Banner',cat:'flag',col:'#2E4F8C',sym:'kraken',sc:'#FFFFFF',earn:['coopWins',10,'Win 10 co-op challenges together','wins']},
 {id:'hull_arena',name:'Arena Hull',cat:'hull',col:'#8E2232',col2:'#2E2B33',pat:'checker',earn:['chalPlayed',75,'Finish 75 multiplayer challenges','played']}].forEach(i=>{if(!ALL_ITEMS[i.id]){ITEMS.push(i);ALL_ITEMS[i.id]=i;}});
[['coop10','Two Hands, One Fuse','Win 10 co-op challenges','epic','Rivalry',['coopWins',10]],['coop50','Unbreakable Crew','Win 50 co-op challenges','mythic','Rivalry',['coopWins',50]]].forEach(([id,name,desc,rar,cat,[metric,target]])=>{if(ACH_BY_ID[id])return;const a={id,name,desc,rar,cat,metric,target,secret:false};ACHIEVEMENTS.push(a);ACH_BY_ID[id]=a;});
ACH_GLYPH.coopWins='swords';

/* ============================== DISTINCTION: rewards past level 100 ============================== */
const DIST_ITEMS=[
 {id:'flag_dist1',name:'Distinction Pennant',cat:'flag',col:'#2C3E50',sym:'star',sc:'#F2C462',gold:true,dtrack:1},
 {id:'sail_dist2',name:'Laurel Sails',cat:'sail',col:'#3B2A5A',col2:'#F2C462',pat:'grad',dtrack:2},
 {id:'hull_dist3',name:'Hall of Legends Hull',cat:'hull',col:'#4A1E3A',col2:'#331428',pat:'royal',gold:true,dtrack:3},
 {id:'hull_dist5',name:'Starfall Hull',cat:'hull',col:'#1B1F3A',col2:'#0F1228',pat:'galaxy',gold:true,dtrack:5},
 {id:'sail_dist7',name:'Night Sky Sails',cat:'sail',col:'#2A1B3D',col2:'#F2C462',pat:'galaxy',dtrack:7},
 {id:'flag_dist10',name:'The Eternal Flag',cat:'flag',col:'#F2C462',sym:'kraken',sc:'#4A1E3A',gold:true,dtrack:10},
 {id:'hull_dist15',name:'Mythic Armada Hull',cat:'hull',col:'#5B2A86',col2:'#3E1B5E',pat:'gems',gold:true,dtrack:15},
 {id:'sail_dist20',name:'Sails of the Sea God',cat:'sail',col:'#F2C462',col2:'#FFF3C4',pat:'scales',dtrack:20}];
DIST_ITEMS.forEach(i=>{if(!ALL_ITEMS[i.id]){ITEMS.push(i);ALL_ITEMS[i.id]=i;}});
function distanceHtml(me){const d=me.dist||0;const rows=[];for(let r=1;r<=30;r++){const items=DIST_ITEMS.filter(i=>i.dtrack===r),ti=DIST_TITLES.find(t=>t[0]===r);if(items.length||ti||r%5===0||r<=3)rows.push({r,items,ti});}
  return `<div class="card hero dist"><small>Beyond level 100</small><h2>Distinction ${d?roman(d):'—'}</h2>${me.li.level>=100?`${bar(me.distInto,DIST_XP)}<small class="num">${fmtN(me.distInto)} / ${fmtN(DIST_XP)} XP to Distinction ${roman(d+1)}</small>`:`<small>${fmtN(me.li.level)} / 100. Every ${fmtN(DIST_XP)} XP after level 100 earns a Distinction rank.</small>`}
   <p class="tiny muted" style="margin:8px 0 0">Each rank pays ${fmtN(DIST_GOLD)} doubloons. Some ranks unlock exclusive gear and new titles. Distinction items in the shop need a rank to buy.</p></div>
  <div class="track">${rows.map(x=>{const got=d>=x.r;return `<div class="tstep ${got?'got':''} ${!got&&rows.find(y=>y.r>d)===x?'next':''}"><span class="tl">${roman(x.r)}</span><div class="tbody">${x.ti?`<b>Title: ${esc(x.ti[1])}</b>`:''}${x.items.map(i=>`<div class="row" style="gap:8px;flex-wrap:nowrap"><canvas class="icon sm" data-id="${i.id}"></canvas><span>${esc(i.name)} <small>${esc(CAT_NAMES[i.cat])}</small></span></div>`).join('')}<small>${CN} ${fmtN(DIST_GOLD)}</small></div></div>`;}).join('')}</div>`;}
const _logScreen10=SCREENS.log;SCREENS.log=()=>{const me=G.players[S.me];const h=_logScreen10();return h.replace(/<\/div>\s*$/,'')+`<div class="pad" style="padding-top:0">${distanceHtml(me)}</div></div>`;};

/* ---------- download the weekly review as an image (shares on phones, downloads on desktop) ---------- */
async function weekImage(ws){const A=periodStats(datesOfWeek(ws)),B=periodStats(datesOfWeek(addDays(ws,-7)));const P=G.P;
  try{await Promise.all(['600 64px Fredoka','700 30px Nunito','800 30px Nunito'].map(f=>document.fonts.load(f)));}catch(e){}
  const W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');const D='Fredoka, "Trebuchet MS", sans-serif',N='Nunito, "Trebuchet MS", sans-serif';
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1E3550');g.addColorStop(.55,'#2C4A6A');g.addColorStop(1,'#16263A');c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let i=0;i<70;i++){c.fillStyle=`rgba(255,255,255,${.15+(i%5)*.08})`;c.beginPath();c.arc((i*157)%W,(i*91)%420,1+(i%3),0,TAU);c.fill();}
  c.fillStyle='#2A6E8C';c.beginPath();c.moveTo(0,1180);for(let x=0;x<=W;x+=20)c.lineTo(x,1180+Math.sin(x/60)*10);c.lineTo(W,H);c.lineTo(0,H);c.fill();c.fillStyle='#1F5A74';c.beginPath();c.moveTo(0,1230);for(let x=0;x<=W;x+=20)c.lineTo(x,1230+Math.sin(x/45+1)*8);c.lineTo(W,H);c.lineTo(0,H);c.fill();
  const card=(x,y,w,h,r=36,col='#FBF6EA')=>{c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.roundRect(x,y+8,w,h,r);c.fill();c.fillStyle=col;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();};
  const txt=(s,x,y,f,col,al='left')=>{c.font=f;c.fillStyle=col;c.textAlign=al;c.fillText(s,x,y);};
  txt('HUNDRED CANNONS · WEEKLY REVIEW',W/2,96,`700 26px ${N}`,'#F2C462','center');txt(`${shortDate(ws)} to ${shortDate(addDays(ws,6))}`,W/2,172,`600 64px ${D}`,'#FBF6EA','center');
  card(60,220,W-120,300);const big=[[A.team.d,'DMs'],[A.team.r,'replies'],[A.team.v,'videos'],[A.team.m,'meetings'],[A.team.c,'clients']];big.forEach(([n,l],i)=>{const x=60+(W-120)/5*(i+.5);txt(fmtN(n),x,360,`600 ${n>=1000?60:72}px ${D}`,i===0?'#2C3E50':'#3F5160','center');txt(l,x,404,`700 26px ${N}`,'#8A8272','center');});
  const dd=B.team.d?Math.round((A.team.d-B.team.d)/B.team.d*100):null;txt(dd==null?'First week on the books':`${dd>=0?'▲':'▼'} ${Math.abs(dd)}% DMs on the week before`,W/2,470,`700 28px ${N}`,dd==null||dd>=0?'#2F8F62':'#C2453A','center');
  card(60,560,W-120,250);txt('Who did what',100,620,`600 36px ${D}`,'#2C3E50');const mx=Math.max(1,...P.map(p=>A.p[p].d));
  P.forEach((p,i)=>{const y=670+i*70;txt(pnameRaw(p),100,y+28,`800 30px ${N}`,pcolHex(p));c.fillStyle='#EFE6D0';c.beginPath();c.roundRect(240,y,290,36,18);c.fill();c.fillStyle=pcolHex(p);c.beginPath();c.roundRect(240,y,Math.max(36,290*A.p[p].d/mx),36,18);c.fill();txt(`${fmtN(A.p[p].d)} DMs · ${fmtN(A.p[p].f||0)} follow-ups · ${A.p[p].r} replies`,W-100,y+28,`700 24px ${N}`,'#5A5A5A','right');});
  card(60,850,(W-150)/2,270);card(90+(W-150)/2,850,(W-150)/2,270);const rr=A.team.d?Math.round(A.team.r/A.team.d*1000)/10:0;
  txt('At the helm',100,910,`600 34px ${D}`,'#2C3E50');[`Foe sunk on ${A.hits} of ${A.days} days`,`Reply rate ${rr}%`,A.best?`Best day ${shortDate(A.best.date)}: ${A.best.team}`:'No best day yet',A.hits>=CREW_WEEK_NEED?'Crew week achieved':`Crew week: ${A.hits} of ${CREW_WEEK_NEED} days`].forEach((l,i)=>txt(l,100,962+i*42,`700 26px ${N}`,'#3F5160'));
  const x2=130+(W-150)/2;txt('At sea',x2,910,`600 34px ${D}`,'#2C3E50');P.forEach((p,i)=>{const y=962+i*84;c.font=`800 26px ${N}`;const nw=c.measureText(pnameRaw(p)+'  ').width;txt(pnameRaw(p),x2,y,`800 26px ${N}`,pcolHex(p));txt(`${A.fish[p].n} fish · ${A.kills[p]} monsters`,x2+nw,y,`700 24px ${N}`,'#3F5160');if(A.fish[p].big)txt(`Biggest: ${cmStr(A.fish[p].big.cm)} ${A.fish[p].big.f.name}`,x2,y+36,`700 21px ${N}`,'#8A8272');});
  const mvp=P.slice().sort((a,b)=>(A.p[b].d+A.p[b].f*.5+A.p[b].r*5+A.p[b].m*20+A.p[b].c*100)-(A.p[a].d+A.p[a].f*.5+A.p[a].r*5+A.p[a].m*20+A.p[a].c*100))[0];
  c.font=`600 34px ${D}`;const line=reviewLine(A,B,mvp);const words=line.split(' ');let ln='',y=1210;const lines=[];words.forEach(w=>{const t=ln?ln+' '+w:w;if(c.measureText(t).width>W-160){lines.push(ln);ln=w;}else ln=t;});lines.push(ln);
  lines.slice(0,2).forEach((l,i)=>txt(l,W/2,1206+i*44-(lines.length>1?20:0),`600 34px ${D}`,'#FBF6EA','center'));txt('funnal.co.uk/crew',W/2,1316,`700 22px ${N}`,'rgba(251,246,234,.7)','center');
  return cv;}
ACT.weekPng=async d=>{try{const cv=await weekImage(d.w);const blob=await new Promise(r=>cv.toBlob(r,'image/png'));const name=`hundred-cannons-week-${d.w}.png`;const file=new File([blob],name,{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})&&/iPhone|iPad|Android/i.test(navigator.userAgent)){try{await navigator.share({files:[file],title:'Hundred Cannons weekly review'});return;}catch(e){if(e.name==='AbortError')return;}}
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);toast('<b>Review downloaded.</b>');}catch(e){console.error(e);toast('<b>Could not make the image.</b> Try again in a moment.','joke');}};

/* ---------- How to play: rewritten for v10 ---------- */
HELP.length=0;[
 ['The goal','Your crew (Sam and James together) aims for 100 Instagram DMs a day, 7 days a week. Each DM you log fires a cannonball at today\'s sea foe, which has 100 HP. Sink it and you both get a reward. If one of you has a day off the target scales down; if you are both off there is no foe that day.'],
 ['The five buttons','DM sent: tap once after each personalised DM (5-second reload, so 5 a minute is very doable). Response: any real human reply to a DM, good or bad. Auto-replies do not count. Responses, videos, meetings and clients pay both captains, whoever logs them. Video: a personalised video sent to a prospect. Meeting: a meeting booked or held with a prospect. Client: a new paying client. Videos, meetings and clients pay BOTH captains exactly the same, whoever logs them. Meetings and clients ask for the prospect\'s name, need a press-and-hold, and pay out once the other captain confirms them on the Harbour.'],
 ['What each one pays','DM: 10 XP and 2 doubloons (boosted by your emissary flag and Golden Tide). Response: 45 XP and 10 doubloons each. Video: 120 XP and 30 doubloons each. Meeting: 400 XP and 150 doubloons each. Client: 2,000 XP and 1,000 doubloons each, plus a full-screen celebration and a plaque in the Client Hall of Fame.'],
 ['Levels and Distinction','XP raises your level from 1 to 100. Early levels fly by; later ones take longer, so level 100 is roughly a year of steady play. Every level pays doubloons and named levels unlock free gear and ranks (see the Captain\'s Log). Past level 100 you earn Distinction ranks: one for every 25,000 XP, each paying 1,500 doubloons, with exclusive Distinction gear and titles at some ranks. A few shop items need a Distinction rank to buy.'],
 ['Emissary flag','Each of you has your own emissary flag above your own ship. It grows with your own DMs today: Grade I at 0 (×1), II at 10 (×1.2), III at 22 (×1.4), IV at 35 (×1.7) and V at 50 (×2). The multiplier boosts XP and doubloons from your DMs, including DMs on voyages and fishing trips. It resets every morning.'],
 ['Golden Tide','Once a day there is a 25-minute Golden Tide at a surprise time between 09:30 and 16:40. Everything logged during it scores double. Stack it with Grade V for 4x DMs.'],
 ['Pet sightings','Every day, between 07:00 and 19:00, a limited-time pet is spotted (you both get an email when it appears). Log the shown number of DMs before the window closes, then claim it. Rarer pets give shorter windows and need more DMs.'],
 ['Days off','In Settings, ask for a day off (or a run of days) for yourself or the whole crew. The other captain accepts or declines it on their Harbour. Accepted days off never trigger forfeits or break streaks. You can cancel a day off of your own that has not happened yet.'],
 ['Lock In voyages','Pick a time and set sail, either on a monster hunt or a fishing trip. Every DM fires at the monster or casts a line. Tap bottles and chests at sea for loot. When the timer ends you reach Treasure Island, and a finished voyage pays a doubloon for every DM you sent on it. Full screen leaves just the scene and the DM button (space bar works too).'],
 ['Monster hunts','Monsters come in waves and are built for a crew that can send 5 DMs a minute: the first wave\'s HP shows on each monster card, and each wave is 15% tougher. About 1 in 8 DMs is a critical hit for 3 damage, and every 4th wave is a golden Elite worth double. Each kill pays XP and doubloons and drops a part (common, rare or a legendary trophy) for your Bestiary.'],
 ['Fishing trips','Every DM is a cast and about 7 in 10 land a fish. The voyage length picks your spot: The Shallows (15 min), Open Sea (25), Deep Water (45) or The Abyss (60). Deeper water has more species and better odds on rare fish, and some fish only bite deep, before 09:00 or after 17:00. There are 120 fish: 28 common, 25 uncommon, 21 rare, 16 epic, 12 legendary, 10 mythic and 8 transcendent. Transcendent fish roll on their own odds, from 1 in 2,000 casts (The Kraken\'s Goldfish) to 1 in 8,000 (The Funnal Fish, the rarest thing in the game). Every shark has its own look.'],
 ['Sizes, variants and bait','Every catch has a size, and each species has a record holder (a gold crown in the Trophy case). A catch 30% over typical size is a Whopper. About 1 catch in 30 is a Golden, Albino or Rainbow variant, and that now includes legendary, mythic and transcendent fish. Bait lasts one trip: Glow Worms (300) make rare-or-better fish 60% more likely, Squid Chunk (250) makes fish about 20% bigger, and the Golden Lure (2,500) doubles variant odds and makes transcendent fish 25% more likely. The Fish of the day is 6 times more likely, and the first captain to land the week\'s Big One wins 500 doubloons.'],
 ['Fishing rewards','Fish gear unlocks from the Trophy case: species caught, fish landed, Whoppers, variants, legendary and mythic species, records held and complete rarity rows. The best pieces take months: 105 species, 6,000 fish, 200 Whoppers, 120 variants, all 8 transcendent fish. Anything you had already earned before this update stays yours.'],
 ['Challenges','From Lock In, challenge the other captain. Versus: Quick Draw Duel (15 min), The Long Haul (45 min), Treasure Race (first to 100 DMs), Tug of War (lead by 25) and King of the Hill (30 one-minute rounds). Duels can carry a stake of 50, 150 or 400 doubloons each, and the winner takes the pot. Co-op: Short Fuse (no 15-second gap for 20 minutes), Triple Century (300 crew DMs in 45 minutes), Kraken Raid (300 HP in 30 minutes), Boss Rush (60, 90 and 120 HP bosses) and The Last Push. Best results are kept as records, and wins unlock challenge gear.'],
 ['Crew goals','Crew week: sink the daily sea foe on 5 days in a week for +400 doubloons and 300 XP each. Weekly foe: beat the whole week\'s target for +120 doubloons and 400 XP each. Friday Kraken: every Friday, if you both log 30 or more DMs, you each get +200 doubloons and 150 XP. Grand ventures are giant pirate projects built from your combined lifetime DMs (the Jetty at 2,500 up to Funnal Island at 100,000), each paying you both and adding a monument to the harbour.'],
 ['Reviews','The Weekly review in the More tab compares this week with last: DMs, replies, videos, meetings and clients for each captain, your busiest hours, fishing and monster hunts. Download the review as an image to share. The game also shows an end-of-day card after 17:30 and an end-of-week card on Sunday evening.'],
 ['Forfeits','If you log zero DMs on a working day, or the crew misses the target, you owe a forfeit. Spin the wheel in the Herald. Forfeits are silly and temporary. Accepted days off never count. Storm Shields cancel one.'],
 ['Your hideout','Switch from Ship to Hideout to see your pirate cove. It upgrades as you level up: a dock at level 5, a lookout tower at 10, a torch-lit skull cave at 20, a rope bridge and hammock at 30, a cannon battery at 40 and a crown for the skull at 50. Clients you win hang on the wall as gold plaques.'],
 ['Rigging your ship','Besides shop items and level rewards, some hulls, sails, figureheads, flags and deck pieces are earned: fish gear, boss trophies, hunter gear, challenge gear, veteran pieces and Distinction gear. Every locked item in the Shop shows what it needs and how far along you are.'],
 ['Full screen and sea sounds','Every harbour, ship, hideout and voyage view has a full screen button. On a phone it fits the whole scene to the screen width, so nothing is cut off. You get the scene, a DM sent button and a soundscape of sea, wind and gulls. The wave button turns the soundscape off; the speaker button mutes everything. The sky follows real UK sunrise and sunset.'],
 ['Honesty','All counts are self-reported. Caps, reload timers and crew confirmation stop accidental spam, but the game works because you both log honestly.'],
].forEach(x=>HELP.push(x));

/* ---------- Salty Herald teaser on the Harbour ---------- */
function heraldCard(yd){const h=herald(yd);const D=h.D;const P=G.P;const tops=P.map(p=>`${pnameRaw(p)} ${D.p[p].d}`).join(' · ');
  const sub=h.clients?`${h.clients} new client${h.clients>1?'s':''}! Full story inside.`:h.hit?`Foe sunk with ${D.team} DMs. ${tops}.`:D.team?`${D.team} of ${D.target} DMs. ${tops}. Forfeits on page 2.`:'A quiet day at sea. The editor is not amused.';
  const stamp=h.clients?'SCOOP':h.hit?'EXTRA!':'GOSSIP';
  return `<a class="heraldCard" href="#herald"><div class="hMast"><b>THE SALTY HERALD</b><small>${esc(niceDate(yd))} · one DM</small></div><div class="hRule"></div><h4>${esc(h.head)}</h4><p>${esc(sub)}</p><span class="hStamp">${stamp}</span></a>`;}

/* ---------- fishing odds that match the real roll: per cast for each rarity, and per fish ---------- */
function fishOddsTable(dep,bait,tc){const w=fishWeights(dep,bait);const tot=w.reduce((a,b)=>a+b,0);const pool=ri=>FISH.filter(f=>f.rar===FORDER[ri]&&f.depth<=dep&&(!f.time||f.time===tc));
  const pr=FORDER.map(()=>0);FORDER.forEach((r,i)=>{let j=i;while(j>=0&&!pool(j).length)j--;if(j>=0)pr[j]+=w[i]/tot*.72;});
  const tt=FISH_TRANS4.reduce((a,f)=>a+1/f.odds,0)*(bait==='lure'?BAITS.lure.trans:1);
  return FORDER.map((r,i)=>({r,p:pr[i]*(1-tt),n:pool(i).length})).concat([{r:'transcendent',p:tt,n:FISH_TRANS4.length,each:FISH_TRANS4.map(f=>f.odds)}]);}
fishPanelHtml=function(tier){let h=_fishPanel4(tier);const dep=fishDepth(tier.m*60000),bait=S.view.bait||S._bait||'';const min=L().min,tc=min<540?'dawn':min>=1020?'dusk':'day';
  const rows=fishOddsTable(dep,bait,tc).map(x=>{if(!x.n||!x.p)return `<span class="off"><b class="rtag r-${x.r}">${x.r}</b>${x.r==='mythic'||x.r==='legendary'?'deeper water only':'none here'}</span>`;
    const each=x.each?`each 1 in ${fmtN(Math.min(...x.each))} to ${fmtN(Math.max(...x.each))}`:`each fish 1 in ${fmtN(Math.round(x.n/x.p))}`;
    return `<span><b class="rtag r-${x.r}">${x.r}</b>any: 1 in ${fmtN(Math.max(1,Math.round(1/x.p)))} · ${each}</span>`;}).join('');
  return h.replace(/<div class="fishOdds">[\s\S]*?<\/div>/,`<div class="fishOdds"><small class="tiny muted" style="flex-basis:100%">Odds per cast (per DM) at this spot, right now</small>${rows}</div>`);};

/* ---------- variants for every fish (legendary, mythic and transcendent too): the unique art gets recoloured ---------- */
const V11_AT=Date.UTC(2026,10,14,15,0);
const _tintCv=document.createElement('canvas');
function drawTinted(c,f,x,y,s,t,v){const tr=c.getTransform?c.getTransform():{a:1};const R=s*Math.max(2,Math.hypot(tr.a,tr.b||0));const S2=Math.min(1600,Math.ceil(64*R)),cv=_tintCv;cv.width=cv.height=S2;const k=cv.getContext('2d');k.setTransform(1,0,0,1,0,0);k.clearRect(0,0,S2,S2);
  k.translate(S2/2,S2/2);k.scale(S2/64,S2/64);FA[f.id](k,t);k.setTransform(1,0,0,1,0,0);
  k.globalCompositeOperation='source-atop';if(v==='r'){const hue=(t/12)%360;const g=k.createLinearGradient(0,0,S2,S2);for(let i=0;i<=6;i++)g.addColorStop(i/6,`hsla(${(hue+i*60)%360},90%,62%,.62)`);k.fillStyle=g;}else k.fillStyle=v==='g'?'rgba(240,190,50,.62)':'rgba(255,255,255,.66)';
  k.fillRect(0,0,S2,S2);k.globalCompositeOperation='source-over';
  c.save();glowAt(c,x,y,15*s,v==='g'?'255,214,110':v==='a'?'255,255,255':'200,150,255',.5);c.drawImage(cv,x-32*s,y-32*s,64*s,64*s);c.restore();spk(c,x-8*s,y-7*s,2*s,t);spk(c,x+9*s,y+5*s,1.8*s,t,2);}
