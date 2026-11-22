/* ============================== 22 Nov: every fish on every trip ==============================
   Trips that start from FISH_V5_AT on: the trip length no longer picks the spot. Each trip gets a random spot
   (seeded by its start time, so both captains see the same one), and every fish in the game can bite on any trip.
   The spot only nudges the odds a little (deeper water: slightly more rare-and-up). Dawn and dusk fish keep their hours.
   Trips that started earlier keep their old rolls, so nothing already caught changes. */
const FISH_V5_AT=Date.UTC(2026,10,22,1,0);
function fishSpotOf(s,durMs){return (s||0)>=FISH_V5_AT?h32('spot'+s)%4:fishDepth(durMs);}
fishTripsOf=function(sessions,lock){const t=(sessions||[]).filter(x=>isFish(x.mode)).map(x=>({s:x.s,e:x.e||x.s+(x.dur||0),depth:fishSpotOf(x.s,x.cdur||x.planned||x.dur),bait:x.bait||''}));
  if(lock&&isFish(lock.mode))t.push({s:lock.s,e:Infinity,depth:fishSpotOf(lock.s,lock.cdur||lock.dur),bait:lock.bait||''});return t.sort((a,b)=>a.s-b.s);};
const _fp5={};
function fishPool5(ri,tc){const k=ri+'|'+tc;return _fp5[k]||(_fp5[k]=FISH.filter(f=>f.rar===FORDER[ri]&&(!f.time||f.time===tc)));}
function fishRollV5(id,t,trip,date){const u=k=>h32(id+k)/4294967296;
  let x=u('tr');const lm=trip.bait==='lure'?BAITS.lure.trans:1;for(const f of FISH_TRANS4){const pr=lm/f.odds;if(x<pr)return f;x-=pr;}
  if(u('fish')>=.72)return null;const w=fishWeights(trip.depth,trip.bait);let y=u('fr')*w.reduce((a,b)=>a+b,0),ri=0;for(;ri<5;ri++){if(y<w[ri])break;y-=w[ri];}
  const min=L(t).min,tc=min<540?'dawn':min>=1020?'dusk':'day';const fd=fishOfDay(date).id;
  for(;ri>=0;ri--){const pool=fishPool5(ri,tc);if(pool.length){let tot=0;for(const f of pool)tot+=f.id===fd?6:1;let z=u('fs')*tot;for(const f of pool){const ww=f.id===fd?6:1;if(z<ww)return f;z-=ww;}return pool[pool.length-1];}}
  return null;}
{const _r4=fishRollV2;fishRollV2=function(id,t,trip,date){return trip&&trip.s>=FISH_V5_AT?fishRollV5(id,t,trip,date):_r4(id,t,trip,date);};}

/* odds as a player sees them before setting off: averaged over the four spots, since the spot is a surprise */
function fishOddsAny(bait,tc){const tt=FISH_TRANS4.reduce((a,f)=>a+1/f.odds,0)*(bait==='lure'?BAITS.lure.trans:1);const pr=FORDER.map(()=>0);
  for(let d=0;d<4;d++){const w=fishWeights(d,bait),tot=w.reduce((a,b)=>a+b,0);FORDER.forEach((r,i)=>{let j=i;while(j>=0&&!fishPool5(j,tc).length)j--;if(j>=0)pr[j]+=w[i]/tot*.72/4;});}
  return FORDER.map((r,i)=>({r,p:pr[i]*(1-tt),n:fishPool5(i,tc).length})).concat([{r:'transcendent',p:tt,n:FISH_TRANS4.length,each:FISH_TRANS4.map(f=>f.odds)}]);}
{const _foF=fishOddsFor;fishOddsFor=function(f,dep,bait=''){if(f.rar==='transcendent')return _foF(f,dep,bait);const ri=FORDER.indexOf(f.rar);let p=0;
  for(let d=0;d<4;d++){const w=fishWeights(d,bait),tot=w.reduce((a,b)=>a+b,0);p+=w[ri]/tot*.72/4;}const n=FISH.filter(x=>x.rar===f.rar).length||1;return Math.max(1,Math.round(n/p));};}

{const _fp=fishPanelHtml;fishPanelHtml=function(tier){let h=_fp(tier);const bait=S.view.bait||S._bait||'';const min=L().min,tc=min<540?'dawn':min>=1020?'dusk':'day';
  const head=`<div class="tierHead"><b>Fishing: a surprise spot</b><small>Every trip drops anchor somewhere random: ${FISH_SPOTS.map(s=>s.name).join(', ')}. Every fish can bite on any trip, whatever the length, transcendent ones included. Deeper water nudges the odds a little, and a few fish only bite at dawn or dusk. Every DM is a cast, and about 7 in 10 land a fish.</small></div>`;
  h=h.replace(/<div class="tierHead">[\s\S]*?<\/small><\/div>/,head).replace(/ · bites deeper than this/,'');
  const rows=fishOddsAny(bait,tc).map(x=>{if(!x.n||!x.p)return `<span class="off"><b class="rtag r-${x.r}">${x.r}</b>not at this hour</span>`;
    const each=x.each?`each 1 in ${fmtN(Math.min(...x.each))} to ${fmtN(Math.max(...x.each))}`:`each fish 1 in ${fmtN(Math.round(x.n/x.p))}`;
    return `<span><b class="rtag r-${x.r}">${x.r}</b>any: 1 in ${fmtN(Math.max(1,Math.round(1/x.p)))} · ${each}</span>`;}).join('');
  return h.replace(/<div class="fishOdds">[\s\S]*?<\/div>/,`<div class="fishOdds"><small class="tiny muted" style="flex-basis:100%">Odds per cast (per DM), averaged over the four spots, right now</small>${rows}</div>`);};}

/* fish info: no more "bites at X and deeper" */
{const _fi=ACT.fishInfo;ACT.fishInfo=function(d){const r=_fi.apply(this,arguments);const m=$('#modal');if(m)m.querySelectorAll('p.muted').forEach(p=>{p.innerHTML=p.innerHTML.replace(/Bites at [^.,]+?(?: and deeper| only)/,'Bites on any trip');});return r;};}

/* the on-screen label follows the trip's own spot */
{const _df=drawFishing;drawFishing=function(c,t,lk){const s0=fishDepth;fishDepth=()=>fishSpotOf(lk.s,lk.cdur||lk.dur);try{_df(c,t,lk);}finally{fishDepth=s0;}};}
