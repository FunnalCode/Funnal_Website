/* ============================== v13: Lock In redesign, crew hunts, wagers ============================== */
const CREW_HP=1.6,CREW_PAY=1.2;
/* ---------- crew hunts: one ship, one monster, both captains firing ---------- */
function crewSegsFor(cid){const segs=[];coopPlayers().forEach(p=>{const ses=(COOP_SES&&COOP_SES[p])||G?.players[p]?.sessions||[];ses.forEach(x=>{if(x.mode==='crewhunt'&&x.cid===cid)segs.push({p,s:x.s,e:x.e||x.s+(x.dur||0),diff:x.diff});});
  const lk=S.players[p]?.lock;if(lk&&lk.mode==='crewhunt'&&lk.cid===cid)segs.push({p,s:lk.s,e:Infinity,diff:lk.diff,live:1});});return segs.sort((a,b)=>a.s-b.s);}
function crewHuntRun(sid,diff,dms,t0){const d=VOYAGE_DIFF[diff];if(!d||!d.tier)return{kills:[],cur:null,crits:0};const T=VOYAGE_TIERS.find(x=>x.id===d.tier);const ti=VOYAGE_TIERS.indexOf(T);const mons=T.mon.map(m=>m[0]);const start=Math.max(0,mons.indexOf(diff));
  const W=n=>{const w=huntWave(mons,start,n,t0);return{...w,hp:Math.round(w.hp*CREW_HP)};};const kills=[];let n=0,w=W(0),dmg=0,crits=0,last=null;
  for(const e of dms){const crit=h32(e.id+'crit')%100<12;if(crit)crits++;dmg+=crit?3:1;last={id:e.id,crit,t:e.t,p:e.pid};
    while(dmg>=w.hp){dmg-=w.hp;const base=monBase(w.mon,t0);const r=h32(String(h32(sid+'drop'+n))+'x')%100;const k=w.elite?(r<35?2:1):(r<7?2:r<33?1:0);
      kills.push({n,mon:w.mon,elite:w.elite,t:e.t,by:e.pid,xp:Math.round((base*3+ti*15)*(w.elite?2:1)*CREW_PAY),g:Math.round((base*.45+ti*3)*(w.elite?2:1)*CREW_PAY),drop:huntPart(w.mon,k)});n++;w=W(n);}}
  return{kills,cur:{...w,dmg,left:w.hp-dmg},crits,last,crew:1};}
let _chm={k:'',v:null};
function crewHunt(cid,evs){evs=evs||G?.evs||[];const segs=crewSegsFor(cid);if(!segs.length)return null;const k=cid+'|'+evs.length+'|'+(evs.length?evs[evs.length-1].id:'')+'|'+segs.map(x=>x.p+x.s+':'+x.e).join();if(_chm.k===k)return _chm.v;
  const t0=segs[0].s;const dms=evs.filter(e=>e.k==='d'&&segs.some(x=>x.p===e.pid&&e.t>=x.s&&e.t<=x.e)).sort((a,b)=>a.t-b.t);const v={...crewHuntRun(cid,segs[0].diff,dms,t0),segs,dms};
  v.by={};dms.forEach(e=>v.by[e.pid]=(v.by[e.pid]||0)+1);_chm={k,v};return v;}
function crewHuntPay(p,x,s,evs){const h=crewHunt(x.cid,evs);if(!h)return;const e=x.e||x.s+(x.dur||0);const mine=h.kills.filter(k=>k.t>=x.s&&k.t<=e);
  mine.forEach(k=>{s.dayXp+=k.xp;s.dayG+=k.g;s.vBoss=(s.vBoss||0)+1;(s.vk=s.vk||{})[k.mon]=(s.vk[k.mon]||0)+1;(s.drops=s.drops||{})[k.drop.id]=(s.drops[k.drop.id]||0)+1;});s.bestWaves=Math.max(s.bestWaves||0,mine.length);s.crewKills=(s.crewKills||0)+mine.length;}
const _hl13=huntLive;huntLive=function(lk){if(lk&&lk.mode==='crewhunt')return crewHunt(lk.cid,G?.evs);return _hl13(lk);};
function drawCrewHuntExtras(c,t,lk){const segs=crewSegsFor(lk.cid);const cap=coopCap(lk.cid),mate=coopPlayers().find(p=>p!==cap);const aboard=coopPlayers().every(p=>segs.some(x=>x.p===p&&x.live));
  if(aboard){c.save();c.translate(70,122);c.scale(.62,.62);try{drawKeeper(c,0,0,mate,S.players[mate]||{},t);}catch(e){}c.restore();}
  txt(c,`Crew hunt · captain ${pnameRaw(cap)}${aboard?'':' · waiting for '+pnameRaw(cap===S.me?mate:cap)}`,160,26,'#3F5160',6.4,'center');}
function crewHuntCardHtml(lk){const h=crewHunt(lk.cid);const o=coopPartner();const segs=h?.segs||[];const aboard=segs.some(x=>x.p===o&&x.live),was=segs.some(x=>x.p===o);
  return `<div class="liCrew"><span>${aboard?`⚔️ <b>${pname(o)} is aboard.</b> Two gunners, one monster.`:was?`${pname(o)} has gone ashore.`:`Waiting for ${pname(o)} to climb aboard…`}</span>${h?`<small>${coopPlayers().map(p=>`${pname(p)} ${h.by[p]||0} shots`).join(' · ')} · captain ${pname(coopCap(lk.cid))}</small>`:''}</div>`;}
const _ls13=ACT.lockStart;ACT.lockStart=async function(){if(S.view.lockMode!=='crewhunt')return _ls13.apply(this,arguments);const o=coopPartner(),op=coopOpen(o);if(op&&op.mode==='crewhunt')return ACT.coopJoin();
  const cm=+($('#lockCustom')?.value||0);const m=cm>=5?Math.min(180,cm):S.view.lockDur||25;const tier=voyageTier(m);const dd=tier.mon.some(x=>x[0]===S.view.lockDiff)?S.view.lockDiff:tier.mon[1][0];const cid=uid();
  try{await writePlayer(S.me,{lock:{id:uid(),s:Date.now(),dur:m*60000,paused:0,pausedAt:null,diff:dd,mode:'crewhunt',bait:'',hv:2,cid,cdur:m*60000}});SND.open?.();
    toast(`<b>Crew hunt launched.</b> ${pname(coopCap(cid))} has the helm. ${pname(o)} has been called to the dock.`,'level',4200);}catch(e){writeFail(e);}};

/* ---------- the Lock In screen ---------- */
const LI_MODES=[['hunt','⚔️','Monster hunt','Solo. Sink waves of monsters.'],['fish','🎣','Fishing trip','Solo. Every DM is a cast.'],['crewhunt','🏴‍☠️','Crew hunt','Together. Bigger monsters, shared loot.'],['coop','🤝','Crew fishing','Together. Two rods, 50 giants.']];
function liMonsterPicker(tier,diff){return `<div class="liMons" style="grid-template-columns:repeat(${tier.mon.length},minmax(0,1fr))">${tier.mon.map(([k])=>{const d=VOYAGE_DIFF[k];return `<button class="liMon ${diff===k?'on':''}" data-act="lockDiff" data-d="${k}"><canvas class="monIco" width="120" height="120" data-mon="${k}"></canvas><b>${esc(d.name)}</b><small>${'●'.repeat(d.lvl)}${'○'.repeat(4-d.lvl)} · ${monBase(k)} HP</small></button>`;}).join('')}</div>`;}
SCREENS.lockin=()=>{const pl=S.players[S.me]||{};const lk=pl.lock;const me=G.players[S.me];
  if(lk&&lk.s){const el=lockElapsed(lk);const dms=myDmSince(S.me,lk.s);const mins=el/60000;const vb=voyageBoss(lk);const left=Math.max(0,vb.hp-dms);const fish=isFish(lk.mode);
    const label=lk.mode==='coop'?'🤝 Crew fishing':lk.mode==='crewhunt'?'🏴‍☠️ Crew hunt':fish?'🎣 Fishing trip':'⚔️ Monster hunt';
    const hint=lk.pausedAt?'Paused. The sea will wait.':fish?'Every DM you log is a cast.':'Every DM fires a cannonball. About 1 in 8 is a critical hit.';
    const body=lk.mode==='coop'?coopCardHtml(lk):lk.mode==='crewhunt'?crewHuntCardHtml(lk)+huntCardHtml(lk):fish?(()=>{const tr=fishCatches(S.me).list.filter(x=>x.t>=lk.s&&!x.crew);return `<div class="vboss"><b>${tr.length} fish landed this trip</b><div class="tripFish">${tr.slice(-12).reverse().map(x=>`<canvas class="fishIco" width="72" height="72" data-f="${x.f.id}" data-v="${x.v||''}" title="${esc(x.f.name)}"></canvas>`).join('')}</div></div>`;})()
      :lk.hv===2?huntCardHtml(lk):`<div class="vboss"><small>${esc(vb.desc)}</small>${left?`<div class="hp"><i class="s" style="width:${100-left/vb.hp*100}%"></i><i class="x" style="flex:1"></i><span>${left} / ${vb.hp} HP</span></div>`:`<b class="done">Defeated! +${vb.xp} XP and ${vb.g} doubloons when you land.</b>`}</div>`;
    return `<canvas id="scene" class="scene" width="960" height="540" aria-label="Your voyage"></canvas>
    <div class="pad"><div class="card liLive"><div class="liTop"><span class="pill">${label}</span><div class="timer" id="lockTimer">${clockStr(lk.dur-el)}</div><button class="iconBtn" data-act="focusOn" aria-label="Full screen" title="Full screen">⛶</button></div>
     ${bar(el,lk.dur)}<p class="liHint">${hint}</p>${body}
     <div class="liNums"><div><b class="num">${dms}</b><small>DMs</small></div><div><b class="num" id="lockPace">${mins>0.5?Math.round(dms/mins*60):'—'}</b><small>per hour</small></div><div><b class="num">${fmtN(dms*(lk.s>=V10_AT?1:3))}</b><small>chest</small></div></div>
     <div class="liCtl">${lk.pausedAt?`<button class="btn primary sm" data-act="lockResume">Resume</button>`:`<button class="btn sm" data-act="lockPause">Pause</button>`}<button class="btn sm" data-act="lockFinish">Drop anchor</button><button class="btn ghost sm" data-act="lockCancel">Abandon</button></div></div></div>`;}
  const mode=LI_MODES.some(x=>x[0]===S.view.lockMode)?S.view.lockMode:'hunt';const tier=voyageTier(S.view.lockDur||25);const diff=tier.mon.some(m=>m[0]===S.view.lockDiff)?S.view.lockDiff:tier.mon[1][0];const o=coopPartner(),op=coopOpen(o);
  const panel=mode==='coop'?coopPanelHtml(tier):mode==='fish'?fishPanelHtml(tier)
    :mode==='crewhunt'?`<p class="liBlurb">Both of you sail one ship (a coin toss picks the captain) and fire at the same monster. Monsters are ${Math.round((CREW_HP-1)*100)}% tougher, every kill pays both of you ${Math.round((CREW_PAY-1)*100)}% more than a solo kill, and drops go in both Bestiaries. ${pname(o)} gets a call to the dock and can join any time.</p>${op&&op.mode==='crewhunt'?`<div class="coopNote"><b>${pname(o)} is already hunting</b> with ${clockStr(op.left)} left. <button class="btn sm primary" data-act="coopJoin">Climb aboard</button></div>`:''}<small class="liLab">First monster</small>${liMonsterPicker(tier,diff)}`
    :`<p class="liBlurb">${esc(tier.blurb)} Sink a monster and a tougher one arrives. Every 4th wave is an Elite worth double, and every kill drops a part for your Bestiary.</p><small class="liLab">First monster</small>${liMonsterPicker(tier,diff)}`;
  const go=mode==='coop'?(op&&op.mode==='coop'?'Climb aboard':'Set sail and call the crew'):mode==='crewhunt'?(op&&op.mode==='crewhunt'?'Climb aboard':'Set sail and call the crew'):mode==='fish'?'Cast off':'Set sail';
  const inv=op?`<div class="card coopInvite"><b>${op.mode==='crewhunt'?'⚔️':'🎣'} ${pname(o)} is waiting at the dock</b><small>A ${op.mode==='crewhunt'?'crew hunt':'crew fishing trip'} with ${clockStr(op.left)} left. ${pname(coopCap(op.cid))} is captain.</small><button class="btn primary" data-act="coopJoin">Climb aboard</button></div>`:'';
  return `<div class="pad lockin">${inv}<div class="card"><h2>Lock In</h2><p class="muted liIntro">Pick a voyage and a length, then log DMs as you go. They still count towards the crew target as normal.</p>
    <div class="liModes">${LI_MODES.map(([k,ic,n,d])=>`<button class="liMode ${mode===k?'on':''}" data-act="lockMode" data-m="${k}"><span class="ic">${ic}</span><b>${n}</b><small>${d}</small></button>`).join('')}</div></div>
   <div class="card"><div class="row between"><h3>How long?</h3><label class="liCustom">or <input id="lockCustom" type="number" min="5" max="180" placeholder="mins"></label></div><div class="seg" style="margin-top:6px">${VOYAGE_TIERS.map(T=>`<button class="${tier.id===T.id?'on':''}" data-act="lockDur" data-m="${T.m}">${T.m} min</button>`).join('')}</div>
    <div class="liPanel">${panel}</div><button class="btn primary liGo" data-act="lockStart">${go}</button></div>
   <div class="liStats"><span><b>${me.m.sessions}</b> voyages</span><span><b>${me.m.islands||0}</b> islands</span><span><b>${me.m.vBoss||0}</b> monster${(me.m.vBoss||0)===1?'':'s'} sunk</span><span><b>${me.m.bestSession}</b> best voyage</span></div>
   ${me.sessions.length?`<details class="card liLog"><summary>Ship's log</summary><div class="list" style="margin-top:6px">${[...me.sessions].sort((a,b)=>b.s-a.s).slice(0,8).map(s=>`<div class="li"><span class="grow">${shortDate(s.date)} · ${s.mode==='crewhunt'?'crew hunt':s.mode==='coop'?'crew fishing':isFish(s.mode)?'fishing':'hunt'} · ${Math.round(s.dur/60000)} min${s.full?' · reached the island':''}</span><b>${s.dms} DMs</b></div>`).join('')}</div></details>`:''}</div>`;};

/* ---------- wagers: the old multiplayer challenges, now a corner of Quests ---------- */
ACT.chalStakeIn=()=>{const v=Math.max(0,Math.floor(+($('#stakeIn')?.value||0)));S.view.stake=v;render();};
function wagersHtml(){const live=G.chals.filter(c=>['pending','countdown','live'].includes(c.state)).length;const me=G.players[S.me],ob=G.players[coopPartner()]?.balance||0;const max=Math.min(me.balance,ob);const st=Math.min(S.view.stake||0,max);
  let h=challengesHtml();h=h.replace('<div class="card chal2">','<div class="chal2 wagerBody">').replace(/<h3>Multiplayer challenges<\/h3><small>[^<]*<\/small>/,'');
  // 21 Nov: no stakes here any more (betting lives in the Tavern); duels and co-op goals still count for the Rivalry achievements
  S.view.stake=0;h=h.replace(/<div class="stakeRow">[\s\S]*?<\/div><\/div>/,'');
  return `<details class="card wagers" ${live?'open':''}><summary><b>⚔️ Challenges</b><small>${live?`${live} live`:'duels and co-op goals, no stakes'}</small></summary>${h}</details>`;}
const _quests13=SCREENS.quests;SCREENS.quests=()=>{const h=_quests13();return h+`<div class="pad" style="padding-top:0">${wagersHtml()}</div>`;};
(()=>{const i=HELP.findIndex(x=>x[0]==='Crew trips');HELP.splice(i<0?HELP.length:i+1,0,['Crew hunts','Pick Crew hunt in Lock In to hunt together on one ship. A coin toss picks the captain, and the other captain gets a call to the dock and can join any time. Both of you fire at the same monster with every DM. Crew monsters have 60% more HP, but every kill pays both of you 20% more than a solo kill and the drop goes in both Bestiaries. You only earn kills made while you were aboard.'],['Challenges','Duels and co-op challenges live in the Challenges corner at the bottom of Quests. There are no stakes on them: for betting, go to the Tavern and challenge each other there.']);})();
