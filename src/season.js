/* ============================== SEASONS + SEASON PASS (Stage 1A) ==============================
   Six 8-week seasons a year, each with a free 40-tier pass per captain. Everything is worked out
   from logged taps: points = 1 per DM, 0.5 per follow-up, and for the shared kinds (they pay both
   captains) 10 per response, 25 per video sent, 60 per meeting, 150 per client. 40 points a tier.
   Tier rewards are claimed like quests (doubloons and XP); the cosmetics at 10, 20, 30 and 40 are
   simply yours once you reach the tier, and they show in the shop as season feats. */
// 21 Nov: the first one is the Christmas Event (1 to 24 December, 25 points a tier, so you can finish it by Christmas Eve);
// the seasons proper start after the holidays. Ids and numbers are kept so claims and cosmetics stay tied to the same pass.
const GSEASONS=[
  {n:1,id:'frozen',name:'The Christmas Event',label:'Christmas Event',tier:25,start:'2026-12-01',end:'2026-12-24',look:'winter',boss:'The Ice Kraken',blurb:'Snow on the rigging, the Ice Kraken, and a 40-tier pass to finish by Christmas Eve.'},
  {n:2,id:'storm',name:'Storm Season',label:'Season 1',start:'2027-01-05',end:'2027-03-01',look:'storm',boss:'The Thunder Serpent',blurb:'Dark skies, lightning and rain on the deck.'},
  {n:3,id:'blossom',name:'Blossom Tide',label:'Season 2',start:'2027-03-02',end:'2027-04-26',look:'spring',boss:'The Pollen Pufferfish',blurb:'Petals on the water and a pastel sky.'},
  {n:4,id:'golden',name:'Golden Hour',label:'Season 3',start:'2027-04-27',end:'2027-06-21',look:'summer',boss:'The Sunburnt Sea Lion',blurb:'Long sunsets and turquoise shallows.'},
  {n:5,id:'carnival',name:'Carnival Seas',label:'Season 4',start:'2027-06-22',end:'2027-08-16',look:'summer',boss:'The Party Kraken',blurb:'Bunting, lanterns and fireworks at night.'},
  {n:6,id:'harvest',name:'Harvest Moon',label:'Season 5',start:'2027-08-17',end:'2027-10-11',look:'autumn',boss:'The Headless Helmsman',blurb:'An orange moon, fog and pumpkins.'}
];
const seLabel=se=>se?(se.label||'Season '+se.n):'';const seTier=se=>(se&&se.tier)||SP_TIER;
const SP_TIER=40,SP_MAX=40,SP_PTS={d:1,f:.5,r:10,v:25,m:60,c:150};
// season 1 cosmetics (later seasons add theirs when they're built)
const SP_REWARDS={1:{10:'flag_snowflake',20:'sail_frostweave',30:'hat_frostcap',40:'hull_frostbite'}};
[
  {id:'flag_snowflake',name:'Snowflake Standard',cat:'flag',col:'#5C8FC2',sym:'snowflake',sc:'#FFFFFF'},
  {id:'sail_frostweave',name:'Frostweave Sails',cat:'sail',col:'#EEF7FC',col2:'#9FD3EE',pat:'stars'},
  {id:'hat_frostcap',name:'Frost-Captain Beanie',cat:'hat',st:'beanie',col:'#7FB6D6'},
  {id:'hull_frostbite',name:'Frostbite Galleon',cat:'hull',col:'#BFE3F2',col2:'#7FB6D6',ice:true}
].forEach(i=>{const s=Object.entries(SP_REWARDS[1]).find(([t,id])=>id===i.id);i.earn=['sp1',+s[0],`Reach tier ${s[0]} of the Christmas Event pass`,'tiers'];i.season=1;if(!ALL_ITEMS[i.id]){ITEMS.push(i);ALL_ITEMS[i.id]=i;}});

function seasonAt(date){return GSEASONS.find(s=>date>=s.start&&date<=s.end)||null;}
function seasonNext(date){return GSEASONS.find(s=>s.start>date)||null;}
function seasonPrev(date){return [...GSEASONS].reverse().find(s=>s.end<date)||null;}
function daysBetween(a,b){return Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/864e5);}

/* ---------- points and tiers, per captain ---------- */
let SP_CACHE={k:'',v:{}};
function seasonPoints(se,p){if(!G||!se)return 0;const key=se.id+se.start+se.end+'|'+G.evs.length+'|'+(G.evs.length?G.evs[G.evs.length-1].t:0);if(SP_CACHE.k!==key)SP_CACHE={k:key,v:{}};const ck=p;if(SP_CACHE.v[ck]!=null)return SP_CACHE.v[ck];
  let pts=0;for(const e of G.evs){if(e.date<se.start||e.date>se.end)continue;const v=SP_PTS[e.k];if(!v)continue;if(SHARED_K[e.k]||e.pid===p)pts+=v;}return SP_CACHE.v[ck]=pts;}
function seasonState(p,se){se=se||seasonAt(G.today);if(!se)return null;const pts=seasonPoints(se,p);const tiersRaw=Math.floor(pts/seTier(se));const tier=Math.min(SP_MAX,tiersRaw);
  return{se,pts,tier,stars:Math.max(0,tiersRaw-SP_MAX),into:pts-tiersRaw*seTier(se),daysLeft:Math.max(0,daysBetween(G.today,se.end)),rewards:SP_REWARDS[se.n]||{}};}
function tierReward(se,t){const cos=(SP_REWARDS[se.n]||{})[t];if(cos)return{xp:100,g:0,item:cos};if(t%5===0)return{xp:150,g:t===15||t===35?120:50,chest:t===15||t===35};return{xp:0,g:25+t};}
function tierKey(se,t){return `sp${se.n}_t${String(t).padStart(2,'0')}`;}
function unclaimedTiers(p,st){if(!st)return[];const me=G.players[p];const out=[];for(let t=1;t<=st.tier;t++){const k=tierKey(st.se,t);if(!me.claimed.has(k))out.push(t);}return out;}

/* season cosmetics: owned once the tier is reached, shown as feats with live progress */
const _deriveSP=derive;derive=function(){const g=_deriveSP.apply(this,arguments);try{const prevG=G;G=g;
  GSEASONS.forEach(se=>{const R_=SP_REWARDS[se.n];if(!R_)return;g.P.forEach(p=>{const pl=g.players[p];if(!pl)return;const pts=seasonPoints(se,p);const tier=Math.min(SP_MAX,Math.floor(pts/SP_TIER));
    Object.entries(R_).forEach(([t,id])=>{if(pl.earnP)pl.earnP[id]=tier;if(tier>=+t)pl.owned[id]=pl.owned[id]||1;});});});G=prevG;}catch(e){console.warn('season derive',e);}return g;};

/* ---------- the Season tab in Quests ---------- */
function tierIcon(se,t,st,me){const rw=tierReward(se,t);const got=st&&st.tier>=t;const cl=me&&me.claimed.has(tierKey(se,t));
  const inner=rw.item?`<canvas class="icon" data-id="${rw.item}"></canvas>`:rw.chest?'<span class="spChest">🎁</span>':rw.xp?`<b>${rw.xp}</b><small>XP</small>`:`<b>${rw.g}</b><small>${CN}</small>`;
  return `<div class="spTier ${got?'got':''} ${cl?'cl':''} ${rw.item?'cos':''}" title="Tier ${t}"><em class="tn">${t}</em>${inner}</div>`;}
function seasonTabHtml(){const today=G.today;const se=seasonAt(today);const me=G.players[S.me];
  if(!se){const nx=seasonNext(today);if(!nx)return '<div class="pad"><div class="card"><h3>Seasons</h3><p class="muted">No season is running.</p></div></div>';
    const d=daysBetween(today,nx.start);const R_=SP_REWARDS[nx.n]||{};
    return `<div class="pad"><div class="card season pre s-${nx.id}"><small class="muted">${esc(seLabel(nx))} · ${fmtDateLong(nx.start)} to ${fmtDateLong(nx.end)}</small><h2>${esc(nx.name)}</h2><p>${esc(nx.blurb)}</p>
      <div class="spCount"><b class="num">${d}</b><span>day${d===1?'':'s'} to go</span></div>
      <p class="tiny muted">A free 40-tier pass for each of you. Every DM moves you along: 1 point per DM, half for a follow-up, and big jumps for responses (10), videos sent (25), meetings (60) and clients (150), which count for both of you. A tier is ${seTier(nx)} points${nx.tier?`, so 1,000 points finishes it: about 56 a working day, which a normal day of DMs covers`:''}.</p>
      <h3 style="margin-top:12px">Season rewards</h3><div class="spCos">${Object.entries(R_).map(([t,id])=>`<div class="spCosI"><canvas class="icon" data-id="${id}"></canvas><b>${esc(ALL_ITEMS[id].name)}</b><small>Tier ${t}</small></div>`).join('')}</div>
      <p class="tiny muted" style="margin-top:8px">${nx.tier?'Event':'Season'} boss: <b>${esc(nx.boss)}</b>.</p></div></div>`;}
  const st=seasonState(S.me,se),un=unclaimedTiers(S.me,st);const oth=G.P.filter(p=>p!==S.me).map(p=>[p,seasonState(p,se)]);
  const pct=st.tier>=SP_MAX?100:Math.round(st.into/seTier(se)*100);const nextT=Math.min(SP_MAX,st.tier+1);const nr=tierReward(se,nextT);
  const track=Array.from({length:SP_MAX},(_,i)=>tierIcon(se,i+1,st,me)).join('');
  return `<div class="pad"><div class="card season s-${se.id}"><small class="muted">${seLabel(se)} · ${st.daysLeft} day${st.daysLeft===1?'':'s'} left</small><h2>${esc(se.name)}</h2>
    <div class="spHead"><div class="spTierBig"><small>Tier</small><b class="num">${st.tier}</b><small>of ${SP_MAX}</small></div><div class="grow">
      <div class="miniBar big"><i style="width:${pct}%"></i></div><small class="muted">${st.tier>=SP_MAX?`Pass complete! ${st.stars} season star${st.stars===1?'':'s'} so far.`:`${fmtN(seTier(se)-st.into)} points to tier ${nextT}: ${nr.item?esc(ALL_ITEMS[nr.item].name):nr.chest?'a frost chest':nr.xp?nr.xp+' XP':nr.g+' '+CN}`}</small>
      ${oth.map(([p,o])=>`<small class="muted" style="display:block">${esc(pname(p))}: tier ${o.tier}</small>`).join('')}</div></div>
    ${un.length?`<button class="btn primary" style="width:100%;margin-top:10px" data-act="spClaim">Claim ${un.length} tier reward${un.length===1?'':'s'}</button>`:''}
    <div class="spTrack" tabindex="0" aria-label="Season pass tiers">${track}</div>
    <p class="tiny muted" style="margin-top:8px">1 point per DM, half for a follow-up; responses 10, videos sent 25, meetings 60, clients 150 (these count for both of you). ${seTier(se)} points a tier.${(()=>{if(st.tier>=SP_MAX)return '';let wd=0;for(let d=G.today;d<=se.end;d=addDays(d,1))if(isWork(d))wd++;const need=SP_MAX*seTier(se)-st.pts;return wd?` To finish by ${fmtDateLong(se.end)}: about <b>${fmtN(Math.ceil(need/wd))}</b> points a working day.`:'';})()} Cosmetics at tiers 10, 20, 30 and 40 are yours as soon as you reach them.</p>
    <p class="tiny muted">Season boss: <b>${esc(se.boss)}</b>${se.n===1?' (arrives later in the season)':''}.</p></div>
    ${seasonPrev(today)?`<button class="btn ghost" data-act="spRecap" data-id="${seasonPrev(today).id}">Last season's recap</button>`:''}</div>`;}
function fmtDateLong(d){try{return new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});}catch(e){return d;}}
ACT.qTab=d=>{S.view.qtab=d.t;render();};
ACT.spClaim=async()=>{const se=seasonAt(G.today);const st=seasonState(S.me,se);const un=unclaimedTiers(S.me,st);if(!un.length)return;const bonus={};let xp=0,g=0;
  un.forEach(t=>{const rw=tierReward(se,t);bonus[tierKey(se,t)]={xp:rw.xp,g:rw.g,ts:Date.now()};xp+=rw.xp;g+=rw.g;});
  try{await writeDay(S.me,G.today,{bonus});SFX.ach();toast(`<b>Season rewards claimed!</b> +${fmtN(xp)} XP, +${fmtN(g)} ${CN}.${un.some(t=>tierReward(se,t).item)?' New cosmetics are in your wardrobe.':''}`);}catch(e){writeFail(e);}};
const _questsSP=SCREENS.quests;SCREENS.quests=()=>{const se=seasonAt(G.today);const un=se?unclaimedTiers(S.me,seasonState(S.me,se)).length:0;const tab=S.view.qtab||'quests';
  const bar=`<div class="pad" style="padding-bottom:0"><div class="seg qTabs"><button class="${tab==='quests'?'on':''}" data-act="qTab" data-t="quests">Quests</button><button class="${tab==='season'?'on':''}" data-act="qTab" data-t="season">${se?seLabel(se):'Christmas Event soon'}${un?` <span class="qBadge">${un}</span>`:''}</button></div></div>`;
  return bar+(tab==='season'?seasonTabHtml():_questsSP());};

/* ---------- Season Recap (first open after a season ends, and from the Season tab) ---------- */
function seasonRecapHtml(se){const dates=[];for(let d=se.start;d<=se.end&&d<=G.today;d=addDays(d,1))dates.push(d);const ds=dates.map(d=>G.days[d]).filter(Boolean);
  const per=G.P.map(p=>{const dm=ds.reduce((a,D)=>a+(D.p[p]?.d||0),0);const best=ds.reduce((a,D)=>Math.max(a,D.p[p]?.d||0),0);const st=seasonState(p,se);return{p,dm,best,tier:st?st.tier:0,stars:st?st.stars:0};});
  const team=ds.reduce((a,D)=>a+(D.team||0),0),hit=ds.filter(D=>D.target>0&&D.team>=D.target).length,sunk=hit;
  const kinds=k=>G.evs.filter(e=>e.k===k&&e.date>=se.start&&e.date<=se.end).length;
  return `<h2>${esc(seLabel(se))} recap</h2><p class="muted" style="margin:2px 0 10px">${esc(se.name)} · ${fmtDateLong(se.start)} to ${fmtDateLong(se.end)}</p>
   <div class="recapGrid"><div><b class="num">${fmtN(team)}</b><small>crew DMs</small></div><div><b class="num">${hit}</b><small>target days</small></div><div><b class="num">${kinds('r')}</b><small>responses</small></div><div><b class="num">${kinds('m')}</b><small>meetings</small></div><div><b class="num">${kinds('c')}</b><small>clients</small></div><div><b class="num">${sunk}</b><small>bosses sunk</small></div></div>
   <div class="recapPlayers">${per.map(x=>`<div><b>${esc(pname(x.p))}</b><small>${fmtN(x.dm)} DMs · best day ${x.best} · tier ${x.tier}${x.stars?` + ${x.stars} stars`:''}</small></div>`).join('')}</div>
   <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn primary" data-act="wnClose">Onwards</button></div>`;}
ACT.spRecap=d=>{const se=GSEASONS.find(s=>s.id===d.id);if(se)openModal(seasonRecapHtml(se));};
(function recapLoop(){let n=0;const iv=setInterval(()=>{n++;try{if(!S.me||!G||!$('#modal')||!$('#modal').hidden){if(n>90)clearInterval(iv);return;}const pv=seasonPrev(G.today);clearInterval(iv);if(!pv)return;const k='hl_recap_'+pv.id;if(localStorage.getItem(k))return;localStorage.setItem(k,'1');if(daysBetween(pv.end,G.today)<=14)openModal(seasonRecapHtml(pv));}catch(e){clearInterval(iv);}},2500);})();
HELP.push(['The Christmas Event and seasons','The Christmas Event runs from 1 to 24 December: each of you has a free 40-tier pass in the Christmas Event tab of Quests. 1 point per DM, half for a follow-up, and responses (10), videos sent (25), meetings (60) and clients (150) count for both of you. 25 points a tier, so 1,000 points finishes it: about 56 points a working day. Claim doubloons and XP as you go; the cosmetics at tiers 10, 20, 30 and 40 are yours as soon as you reach them. Proper 8-week seasons, each with its own look, boss and pass, start in January.']);

/* snowflake flag symbol */
if(typeof drawSymbolBase==='function'){const _dsb=drawSymbolBase;drawSymbolBase=function(c,sym,cx,cy,s,col){if(sym!=='snowflake')return _dsb.apply(this,arguments);c.strokeStyle=col;c.lineCap='round';c.lineWidth=.42*s;
  for(let i=0;i<3;i++){const a=i*Math.PI/3;c.beginPath();c.moveTo(cx-Math.cos(a)*2.3*s,cy-Math.sin(a)*2.3*s);c.lineTo(cx+Math.cos(a)*2.3*s,cy+Math.sin(a)*2.3*s);c.stroke();}
  for(let i=0;i<6;i++){const a=i*Math.PI/3,bx=cx+Math.cos(a)*1.5*s,by=cy+Math.sin(a)*1.5*s;c.lineWidth=.3*s;[-.6,.6].forEach(o=>{c.beginPath();c.moveTo(bx,by);c.lineTo(bx+Math.cos(a+o)*.8*s,by+Math.sin(a+o)*.8*s);c.stroke();});}};}
