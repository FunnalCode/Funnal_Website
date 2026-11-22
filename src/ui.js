/* ============================== HELPERS FOR UI ============================== */
function activeForfeitsFor(p){const now=Date.now();return Object.values(S.forfeits).filter(f=>f&&f.pid===p&&f.status==='spun'&&f.kind==='virtual'&&now-f.ts<86400000);}
function myDmSince(p,ts){return G?G.evs.filter(e=>e.pid===p&&e.k==='d'&&e.t>=ts).length:0;}
function pendingForfeits(p){
  if(!G)return[];const out=[];const cfg=G.cfg;const cut=addDays(G.today,-14);
  for(const d of G.workdays){if(d>=G.today||d<cut||absent(p,d,cfg))continue;const D=G.days[d];const dm=D?D.p[p].d:0;const tgt=targetFor(d,cfg);
    if(dm===0)out.push({date:d,type:'ind',why:`${C().players[p]?.name} logged zero DMs on ${shortDate(d)}`});
    if(tgt>0&&(D?D.team:0)<tgt)out.push({date:d,type:'team',why:`Team reached ${D?D.team:0}/${tgt} on ${shortDate(d)}`});}
  return out.filter(f=>!S.forfeits[`${f.date}_${p}_${f.type}`]);
}
function bar(v,max,cls=''){const w=max>0?clamp(v/max*100,0,100):0;return `<div class="prog ${cls}"><i style="width:${w}%"></i></div>`;}
function phaseLine(boss,ratio,hit){const l=boss.lines;if(hit)return l.dead;if(ratio<=.25)return l.p25;if(ratio<=.5)return l.p50;if(ratio<=.75)return l.p75;return l.start;}
function timeLeftStr(){const cfg=C();const today=L().date;if(!isWork(today,cfg))return 'Day off';const end=londonTs(today,hm(cfg.dayEnd));const st=londonTs(today,hm(cfg.dayStart));const now=Date.now();if(now<st)return `Starts in ${clockStr(st-now)}`;if(now>end)return 'Working day over';return `${clockStr(end-now)} left`;}

/* ============================== SCREENS ============================== */
const SCREENS={};
SCREENS.harbour=()=>{
  const D=G.days[G.today],P=G.P,tgt=D.target,team=D.team,hit=tgt>0&&team>=tgt,hp=Math.max(0,tgt-team),boss=D.boss,mod=D.mod;
  const seg=p=>tgt?clamp(D.p[p].d/Math.max(tgt,team)*100,0,100):0;
  const ms=[125,150,200].find(m=>team<m);const W=G.weeks[weekStart(G.today)];
  const rem=reminder();const mer=merchantToday(G.today);
  const act=P.flatMap(p=>activeForfeitsFor(p).map(f=>({...f,p})));
  const yd=G.workdays.filter(d=>d<G.today).pop();
  return `<canvas id="scene" class="scene" width="960" height="540" aria-label="Funnal Cove harbour and today's fog boss"></canvas>
  <div class="pad">
   ${eventsHtml()}
   ${crewCheckWrap()}
   ${rem?`<div class="remind"><span class="name">Gary the gull</span><canvas class="gull" id="gullIco"></canvas><div>${esc(rem)}</div><button class="btn sm ghost" data-act="nextReminder" aria-label="Another reminder">Next</button></div>`:''}
   <div class="card mission">
    ${tgt>0?`<div class="bossTop"><div><small>Today's sea foe · ${esc(niceDate(G.today))}</small><div class="bossName ${boss.rare?'rare':''}">${esc(boss.name)}${boss.rare?' <span class="pill" style="color:var(--r-legendary)">Rare</span>':''}</div></div><b class="score num">${team}<small> / ${tgt}</small></b></div>
    <div class="hp" role="img" aria-label="${hp} HP left">${P.map(p=>`<i class="${p===P[0]?'s':'j'}" style="width:${seg(p)}%"></i>`).join('')}<i class="x" style="flex:1"></i><span>${hit?'DEFEATED':hp+' HP'}</span></div>
    <div class="ticks"><b style="left:25%">75</b><b style="left:50%">50</b><b style="left:75%">25</b></div>
    <div class="speech withName"><span class="who2">${esc(boss.name.split(' ').slice(-1)[0])}</span>${esc(phaseLine(boss,hp/tgt,hit))}</div>
    <div class="contrib">${P.map(p=>`<span><i class="dot" style="background:${pcol(p)}"></i>${pname(p)} <b class="num">${D.p[p].d}</b>${absent(p,G.today)?' <small>(away)</small>':''}</span>`).join('')}<span class="pill" id="timeLeft">${timeLeftStr()}</span></div>
    <div class="row tiny muted" style="gap:14px"><span>Win: <b style="color:var(--ink)">+100 XP, +30 ${CN} each</b></span>${hit&&ms?`<span>Stretch goal: <b style="color:var(--ink)">${team}/${ms}</b></span>`:!hit?`<span>Next phase at ${[75,50,25].find(x=>hp>x)??0} HP</span>`:'<span>All stretch goals smashed</span>'}</div>
    <div class="twist"><b>${esc(mod.name)}</b><span>${esc(mod.desc)}</span></div>`
    :`<h2>No battle today</h2><p class="muted" style="margin:0">${isWork(G.today)?'Everyone is away. Rest up.':'It\'s not a scheduled working day. You can still log anything genuine, it all counts towards your lifetime totals.'}</p>`}
   </div>
   ${W&&W.hp?`<div class="card"><div class="row between"><div><small>Weekly boss</small><h3>${esc(W.boss.name)}</h3></div><b class="num">${fmtN(W.dmg)} / ${fmtN(W.hp)}</b></div>${bar(W.dmg,W.hp,'team')}<small>${W.done?'Defeated! +400 XP and +120 ${CN} to everyone who helped.':`Phases at 66% and 33%. ${fmtN(Math.max(0,W.hp-W.dmg))} DMs to go this week.`}</small></div>`:''}
   <div class="grid3">${['r','v','m','c'].map(k=>`<div class="stat"><b class="num">${P.reduce((a,p)=>a+D.p[p][k],0)}</b><small>${KINDS[k].short}s today</small></div>`).join('')}</div>
   ${act.length?`<div class="card flat" style="border-color:var(--bad)"><b>Active forfeits</b><div class="list" style="margin-top:6px">${act.map(f=>`<div class="li"><span class="grow">${pname(f.p)}: ${esc(f.text)}</span></div>`).join('')}</div></div>`:''}
   ${mer?`<a class="card" href="#shop" style="text-decoration:none;color:inherit;display:block"><b style="font-family:var(--display)">Pell's barge is in the harbour</b><br><small>Three rare items today only. Tap to browse.</small></a>`:''}
   ${yd?`<a class="card" href="#herald" style="text-decoration:none;color:inherit;display:block"><small>The Harbour Herald · ${shortDate(yd)}</small><div style="font:700 15px Georgia,serif">${esc(herald(yd).head)}</div></a>`:''}
  </div>`;
};
SCREENS.lockin=()=>{
  const pl=S.players[S.me]||{};const lk=pl.lock;const me=G.players[S.me];
  let main;
  if(lk&&lk.s){const el=lockElapsed(lk);const dms=myDmSince(S.me,lk.s);const mins=el/60000;
    main=`<canvas id="scene" class="scene" width="960" height="540" aria-label="Your voyage"></canvas>
    <div class="pad"><div class="card"><div class="timer" id="lockTimer">${clockStr(lk.dur-el)}</div><p class="muted" style="text-align:center;margin:4px 0 10px">${lk.pausedAt?'Paused':'Locked in. Log every DM with the big button.'}</p>
    <div class="grid3"><div class="stat"><b class="num">${dms}</b><small>DMs this session</small></div><div class="stat"><b class="num" id="lockPace">${mins>0.5?Math.round(dms/mins*60):'—'}</b><small>pace per hour</small></div><div class="stat"><b class="num">${me.m.bestSession}</b><small>session record</small></div><div class="stat"><b class="num">${G.days[G.today].team}/${G.days[G.today].target||'—'}</b><small>team today</small></div></div>
    ${bar(el,lk.dur)}
    <div class="row" style="margin-top:12px;justify-content:center">${lk.pausedAt?`<button class="btn primary" data-act="lockResume">Resume</button>`:`<button class="btn" data-act="lockPause">Pause</button>`}<button class="btn ghost" data-act="lockFinish">Finish now</button><button class="btn ghost" data-act="lockCancel">Cancel</button></div></div></div>`;}
  else{main=`<div class="pad"><div class="card"><h2>Lock In</h2><p class="muted" style="margin:4px 0 10px">Pick a session, set sail and log DMs. Your boat travels one nautical mile per DM.</p>
    <div class="seg">${[[15,'Sprint 15'],[25,'Pomodoro 25'],[45,'Focus 45'],[60,'Marathon 60']].map(([m,l])=>`<button class="${S.view.lockDur===m?'on':''}" data-act="lockDur" data-m="${m}">${l}</button>`).join('')}</div>
    <div class="row" style="margin-top:10px"><label class="f" for="lockCustom">Custom minutes<input id="lockCustom" type="number" min="5" max="180" placeholder="e.g. 35" style="width:110px"></label><button class="btn primary" data-act="lockStart" style="margin-left:auto;align-self:end">Set sail</button></div></div>
    <div class="grid3"><div class="stat"><b class="num">${me.m.sessions}</b><small>sessions</small></div><div class="stat"><b class="num">${fmtN(me.m.lockMin)}</b><small>minutes locked in</small></div><div class="stat"><b class="num">${me.m.bestSession}</b><small>best session DMs</small></div></div>
    ${me.sessions.length?`<div class="card"><h3>Recent voyages</h3><div class="list" style="margin-top:6px">${[...me.sessions].sort((a,b)=>b.s-a.s).slice(0,5).map(s=>`<div class="li"><span class="grow">${shortDate(s.date)} · ${Math.round(s.dur/60000)} min</span><b>${s.dms} DMs</b></div>`).join('')}</div></div>`:''}</div>`;}
  return main+`<div class="pad">${challengesHtml()}</div>`;
};
function challengesHtml(){
  const live=G.chals.filter(c=>['pending','countdown','live'].includes(c.state));const recent=G.chals.filter(c=>c.state==='done').slice(0,4);
  const D=G.days[G.today];const remaining=Math.max(0,D.target-D.team);
  const types=[['showdown','The 15-Minute Showdown','Head-to-head. Most DMs in 15 minutes wins.',15,0],['rivalry','The Rivalry','A 30-minute duel. Winner takes the bragging rights.',30,0],['sprint','The Century Sprint','Co-op: 40 team DMs in 30 minutes.',30,40],['lastpush','The Last Push',`Co-op: finish today's remaining ${remaining} DMs in 45 minutes.`,45,remaining],['bossrush','Boss Rush','Co-op: beat three mini-monsters (10, 15, 20 HP) in 30 minutes.',30,45],['race','Treasure Race','First captain to 25 DMs wins (30 minutes max).',30,25],['raid','Kraken Raid','Co-op: sink a 60 HP kraken together in 45 minutes.',45,60]];
  return `<div class="card"><h3>Multiplayer challenges</h3>
  ${live.map(ch=>{const c=ch.c;const t=types.find(x=>x[0]===c.type)||types[0];const mineToAccept=ch.state==='pending'&&!c.acc?.[S.me];
    return `<div class="li" style="display:grid;gap:6px;margin-top:8px"><div class="row between"><b>${esc(t[1])}</b><span class="pill">${ch.state==='pending'?'waiting for '+(mineToAccept?'you':pname(other(S.me))):ch.state==='countdown'?'starts in <span class="cdn" data-t="'+ch.start+'">'+Math.ceil((ch.start-Date.now())/1000)+'s</span>':'<span class="cdn" data-t="'+ch.end+'">'+clockStr(ch.end-Date.now())+'</span> left'}</span></div>
    ${ch.state!=='pending'?(ch.coop?`<div class="row between tiny"><span>Team ${ch.team} / ${c.target}</span><span>${G.P.map(p=>`${pname(p)} ${ch.cnt[p]}`).join(' · ')}</span></div>${bar(ch.team,c.target,'team')}`:`<div class="row between">${G.P.map(p=>`<span style="color:${pcol(p)};font:600 18px var(--display)">${pname(p)} ${ch.cnt[p]}</span>`).join('<span class="muted">vs</span>')}</div>`):''}
    <div class="row">${mineToAccept?`<button class="btn primary sm" data-act="chalAccept" data-id="${ch.id}">Accept</button><button class="btn ghost sm" data-act="chalDecline" data-id="${ch.id}">Decline</button>`:''}${ch.state==='pending'&&c.by===S.me?`<button class="btn ghost sm" data-act="chalDecline" data-id="${ch.id}">Cancel</button>`:''}</div></div>`;}).join('')}
  ${live.length?'':`<p class="muted tiny" style="margin:4px 0 8px">Start one and ${pname(other(S.me))} gets an invite on their screen. Every DM still needs its 5-second recharge.</p>
  <div class="list">${types.map(([id,n,d,m,tg])=>`<div class="li"><div class="grow"><b>${esc(n)}</b><br><small>${esc(d)}</small></div><button class="btn sm" data-act="chalCreate" data-type="${id}" data-m="${m}" data-tg="${tg}" ${id==='lastpush'&&!remaining?'disabled':''}>Challenge</button></div>`).join('')}</div>`}
  ${recent.length?`<h3 style="margin-top:12px">Recent results</h3><div class="list" style="margin-top:6px">${recent.map(ch=>{const t=types.find(x=>x[0]===ch.c.type)||types[0];const res=ch.coop?(ch.won[G.P[0]]?'Success':'Failed'):(G.P.find(p=>ch.won[p])?pname(G.P.find(p=>ch.won[p]))+' won':'Draw');return `<div class="li"><span class="grow">${esc(t[1])} · ${G.P.map(p=>ch.cnt[p]).join('–')}</span><b>${res}</b></div>`;}).join('')}</div>`:''}
  </div>`;
}
SCREENS.quests=()=>{
  const me=G.players[S.me];const q=questState(S.me);
  const row=(x,key)=>{const done=x.prog>=x.n;const claimed=me.claimed.has(key);return `<div class="li"><div class="grow"><b>${esc(x.name)}</b> <small>+${x.xp} XP · +${x.g} ${CN}</small>${bar(x.prog,x.n)}<small class="num">${Math.min(x.prog,x.n)} / ${x.n}</small></div>${claimed?'<span class="done">Claimed</span>':`<button class="btn sm ${done?'primary':''}" ${done?'':'disabled'} data-act="claim" data-key="${key}" data-xp="${x.xp}" data-g="${x.g}">Claim</button>`}</div>`;};
  return `<div class="pad">
  <div class="card"><div class="row between"><h2>Daily quests</h2><small>${shortDate(G.today)}</small></div><div class="list" style="margin-top:8px">${q.daily.map(x=>row(x,`q_d_${G.today}_${x.id}`)).join('')}</div></div>
  <div class="card"><div class="row between"><h2>Weekly quests</h2><small>week of ${shortDate(weekStart(G.today))}</small></div><div class="list" style="margin-top:8px">${q.weekly.map(x=>row(x,`q_w_${weekStart(G.today)}_${x.id}`)).join('')}</div></div>
  <a class="card nextReward" href="#log" style="text-decoration:none;color:inherit"><span class="appIco sm" style="background:#C9654A"><svg viewBox="0 0 24 24"><path d="M5 3h11l3 3v15H5zm3 5v2h8V8zm0 4v2h8v-2zm0 4v2h5v-2z"/></svg></span><div><b>Captain's Log</b><br><small>Free cosmetics and doubloons every level</small></div><span class="chev">›</span></a>
  <div class="card"><h2>Long voyages</h2><div class="list" style="margin-top:8px">${q.long.map(x=>row(x,`q_l_${x.id}`)).join('')}</div></div>
  <a class="card tvGo" href="#cove"><span class="appIco" style="background:#5E8C88"><svg viewBox="0 0 24 24"><path d="M3 20V11l5-4 5 4v9zm10 0v-7l4-3 4 3v7zM6 14h4v6H6z"/></svg></span><span class="grow"><b>Funnal Cove</b><small>Projects, landmarks and a preview of the finished town</small></span><span class="tvGoArrow">›</span></a>
  </div>`;
};
function questState(p){
  const me=G.players[p];const D=G.days[G.today];const ws=weekStart(G.today);const W=G.weeks[ws];
  const todaySes=me.sessions.filter(s=>s.date===G.today);
  const wDays=Object.values(G.days).filter(d=>d.date>=ws&&d.date<=G.today);
  const v={dDm:D.p[p].d,dSes:todaySes.length,dResp:D.p[p].r,dBoss:D.hit&&D.p[p].d>0?1:0,dEarly:D.p[p].b10,dShare:D.target?Math.round(D.p[p].d/D.target*100):0,dBestSes:Math.max(0,...todaySes.map(s=>s.dms||0)),
    wDm:wDays.reduce((a,d)=>a+d.p[p].d,0),wSes:me.sessions.filter(s=>s.date>=ws).length,wBoss:wDays.filter(d=>d.hit&&d.p[p].d>0).length,wWeekly:W&&W.done?1:0,wChal:G.chals.filter(c=>c.state==='done'&&c.start>=londonTs(ws,0)&&c.players.includes(p)).length,wResp:wDays.reduce((a,d)=>a+d.p[p].r,0),dFu:D.p[p].f||0,wFu:wDays.reduce((a,d)=>a+(d.p[p].f||0),0),
    ...me.m};
  const pickN=(pool,seed,n)=>[...pool].sort((a,b)=>h32(seed+a.id)-h32(seed+b.id)).slice(0,n);
  const map=x=>({...x,prog:v[x.m]||0});
  return{daily:pickN(fuQuestPool(DAILY_QUESTS,G.today,'d'),G.today+p,3).map(map),weekly:pickN(fuQuestPool(WEEKLY_QUESTS,ws,'w'),ws+p,3).map(map),long:fuQuestPool(LONG_QUESTS,G.today,'l').map(map)};
}
const APP_ICONS={bestiary:['#B5543A','M12 2c3 0 5 2.4 5 5.4 0 1.7-.7 3-1.8 4l1.8 6.6-2.4-1.4-1 3.4-1.6-2.6-1.6 2.6-1-3.4-2.4 1.4L8.8 11.4C7.7 10.4 7 9.1 7 7.4 7 4.4 9 2 12 2zm-2 4.4a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6zm4 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z'],hall:['#D99A17','M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z'],review:['#2C3E50','M4 20V10h3v10H4zm6.5 0V4h3v16h-3zM17 20v-7h3v7h-3z'],trophy:['#3E9FB8','M3.5 12c2.6-4.2 6.6-6 10.6-5.2 2.1.4 4 1.6 5.4 3.2l2-2.2v8.4l-2-2.2c-1.4 1.6-3.3 2.8-5.4 3.2C10.1 18 6.1 16.2 3.5 12zm11.3-1.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z'],pets:['#E0457B','M8.5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM4 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm16 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM12 11c3 0 6 4 6 7a3 3 0 0 1-3 3c-1.2 0-2-.6-3-.6s-1.8.6-3 .6a3 3 0 0 1-3-3c0-3 3-7 6-7z'],help:['#486790','M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 14a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6zm.2-10C10 6 8.6 7.3 8.6 9h2.2c0-.6.5-1.1 1.3-1.1s1.3.5 1.3 1.1c0 1.3-2.4 1.3-2.4 3.8v.5h2.2v-.3c0-1.7 2.5-1.9 2.5-4.1C15.7 7.2 14.3 6 12.2 6z'],log:['#C9654A','M5 3h11l3 3v15H5zm3 5v2h8V8zm0 4v2h8v-2zm0 4v2h5v-2z'],book:['#DDA94D','M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8z'],shop:['#E06034','M6 7V6a6 6 0 0 1 12 0v1h2a1 1 0 0 1 1 1.1l-1.2 12A2 2 0 0 1 17.8 22H6.2a2 2 0 0 1-2-1.9L3 8.1A1 1 0 0 1 4 7zm2 0h8V6a4 4 0 0 0-8 0z'],rivals:['#9B7FD9','M3 7l4.5 3.5L12 4l4.5 6.5L21 7l-2 11H5zM5 20h14v2H5z'],herald:['#5DBE9C','M4 3h13a2 2 0 0 1 2 2v1h1a1 1 0 0 1 1 1v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1zm2 4v4h5V7zm7 0v2h4V7zm0 4v2h4v-2zm-7 4v2h11v-2z'],ledger:['#4A7EC2','M4 20V10h3v10zm6.5 0V4h3v16zM17 20v-7h3v7z'],settings:['#7F8A95','M10.59 5.04L10.76 2.48L13.24 2.48L13.41 5.04L15.92 6.08L17.85 4.39L19.61 6.15L17.92 8.08L18.96 10.59L21.52 10.76L21.52 13.24L18.96 13.41L17.92 15.92L19.61 17.85L17.85 19.61L15.92 17.92L13.41 18.96L13.24 21.52L10.76 21.52L10.59 18.96L8.08 17.92L6.15 19.61L4.39 17.85L6.08 15.92L5.04 13.41L2.48 13.24L2.48 10.76L5.04 10.59L6.08 8.08L4.39 6.15L6.15 4.39L8.08 6.08zM12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2z']};
SCREENS.more=()=>`<div class="pad"><div class="phone"><div class="row between" style="margin-bottom:10px"><h2>More</h2><small>${esc(niceDate(G.today))}</small></div><div class="appGrid">
  ${[['log','Captain\'s Log',`Level ${G.players[S.me].li.level} rewards`],['pets','Pets',`${Object.keys(G.players[S.me].pets).length} of ${PETS.length}`],['trophy','Trophy case',`${Object.keys(fishCatches(S.me).by).length} of ${FISH.length} fish`],['bestiary','Bestiary',`${Object.keys(G.players[S.me].drops||{}).length} of 48 parts`],['hall','Hall of Fame',`${G.evs.filter(e=>e.k==='c').length} clients`],['review','Weekly review','Numbers & trends'],['help','How to play','Everything explained'],['book','Achievements',`${Object.keys(G.players[S.me].unlocked).length} of ${ACHIEVEMENTS.length}`],['rivals','Rivals','Leaderboards'],['herald','Herald','Paper & forfeits'],['ledger','Ledger','Business numbers'],['settings','Settings','Days off & more']].map(([h,n,d])=>`<a href="#${h}"><span class="appIco" style="background:${APP_ICONS[h][0]}"><svg viewBox="0 0 24 24"><path d="${APP_ICONS[h][1]}"/></svg></span>${n}<small>${d}</small></a>`).join('')}
  </div></div><p class="tiny muted" style="text-align:center">All counts are self-reported taps. The game trusts you.</p></div>`;
function achCard(a,me,clickable=false){const un=me.unlocked[a.id];const secret=a.secret&&!un;const prog=me.m[a.metric]||0;const date=(S.players[me.pid]?.ach||{})[a.id];
  return `<${clickable?'button':'div'} class="ach r-${a.rar} ${un?'':'locked'} ${secret?'secret':''}" ${clickable?`data-act="achInfo" data-id="${a.id}"`:''}><div class="row" style="gap:8px;flex-wrap:nowrap"><canvas class="medalArt" width="96" height="96" data-ach="${a.id}" data-un="${un?1:0}" data-sec="${secret?1:0}"></canvas><div><span class="rtag">${a.rar}</span>${a.tier?` <span class="tier">${a.tier}</span>`:''}</div></div>
  <b>${secret?'Hidden achievement':esc(a.name)}</b><small>${secret?'Keep playing. Some secrets need unusual combinations.':esc(a.desc)}</small>
  ${!un&&!secret&&a.target>1?`<div class="bar"><i style="width:${clamp(prog/a.target*100,0,100)}%"></i></div><small class="num">${fmtN(Math.min(prog,a.target))} / ${fmtN(a.target)}</small>`:''}
  ${un?`<small>${date?'Earned '+shortDate(L(date).date):'Earned'} · +${RARITY_GLOW[a.rar]} ${CN}</small>`:''}</${clickable?'button':'div'}>`;}
SCREENS.book=()=>{
  const pid=S.view.bookP||S.me;const me=G.players[pid];const f=S.view.book;const cats=[...new Set(ACHIEVEMENTS.map(a=>a.cat))];
  let list=ACHIEVEMENTS;if(f==='unlocked')list=list.filter(a=>me.unlocked[a.id]);else if(f==='locked')list=list.filter(a=>!me.unlocked[a.id]);else if(f!=='all')list=list.filter(a=>a.cat===f);
  const counts=RARITIES.map(r=>[r,ACHIEVEMENTS.filter(a=>a.rar===r&&me.unlocked[a.id]).length,ACHIEVEMENTS.filter(a=>a.rar===r).length]);
  return `<div class="pad"><div class="row between"><h2>Achievement Book</h2><div class="seg">${G.P.map(p=>`<button class="${p===pid?'on':''}" data-act="bookP" data-p="${p}">${pname(p)}</button>`).join('')}</div></div>
  <div class="row" style="gap:6px">${counts.map(([r,u,t])=>`<span class="pill r-${r}" style="border-color:var(--rc)"><span class="rtag">${r}</span> ${u}/${t}</span>`).join('')}</div>
  <label class="f" for="bookFilter">Show<select id="bookFilter" data-act="bookFilter"><option value="all">All ${ACHIEVEMENTS.length}</option><option value="unlocked">Unlocked</option><option value="locked">Locked</option>${cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select></label>
  <div class="achGrid">${list.map(a=>achCard(a,me,true)).join('')}</div></div>`;
};
function periodRange(per){const t=G.today;if(per==='day')return[t,t];if(per==='week')return[weekStart(t),t];if(per==='month')return[t.slice(0,8)+'01',t];return['0000',t];}
function sumRange(p,a,b){const o={d:0,r:0,v:0,m:0,c:0,f:0};for(const d in G.days)if(d>=a&&d<=b)for(const k in o)o[k]+=G.days[d].p[p][k]||0;return o;}
SCREENS.rivals=()=>{
  const per=S.view.lb;const[a,b]=periodRange(per);const P=G.P;const rows=P.map(p=>({p,...sumRange(p,a,b)}));
  const lead=[...rows].sort((x,y)=>y.d-x.d);const aw=awards(weekStart(G.today));
  const rec=P.map(p=>{const m=G.players[p].m;return{p,best:m.bestDay,streak:G.players[p].bestStreak,ses:m.bestSession,fb:m.finalBlows,ot:m.overtakes,ach:Object.keys(G.players[p].unlocked).length,cw:m.chalWon};});
  return `<div class="pad"><h2>Rivals</h2><div class="seg">${[['day','Today'],['week','Week'],['month','Month'],['life','Lifetime']].map(([k,n])=>`<button class="${per===k?'on':''}" data-act="lb" data-k="${k}">${n}</button>`).join('')}</div>
  <div class="card"><table class="lb"><thead><tr><th>Keeper</th><th>DMs</th><th>Resp.</th><th>Video</th><th>Meet</th><th>Client</th></tr></thead><tbody>${lead.map((r,i)=>`<tr><td style="color:${pcol(r.p)}">${i===0&&r.d>0&&r.d!==lead[1]?.d?'<span class="crown">♛</span> ':''}${pname(r.p)}</td><td>${fmtN(r.d)}</td><td>${r.r}</td><td>${r.v}</td><td>${r.m}</td><td>${r.c}</td></tr>`).join('')}</tbody></table></div>
  <div class="card"><h3>Personal records</h3><table class="lb" style="margin-top:6px"><thead><tr><th></th>${P.map(p=>`<th style="color:${pcol(p)}">${pname(p)}</th>`).join('')}</tr></thead><tbody>
  ${[['Best day (DMs)','best'],['Best streak','streak'],['Best Lock In session','ses'],['Final blows','fb'],['Overtakes','ot'],['Challenges won','cw'],['Achievements','ach']].map(([n,k])=>`<tr><td>${n}</td>${rec.map(r=>`<td>${fmtN(r[k])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  <div class="card"><div class="row between"><h3>Friday Awards Ceremony</h3><small>week of ${shortDate(weekStart(G.today))}${wd(G.today)===5?' · LIVE TODAY':''}</small></div>
   ${podium(aw)}
   <div class="list" style="margin-top:8px">${aw.map(x=>`<div class="li"><div class="grow"><b>${esc(x.name)}</b><br><small>${esc(x.rule)}</small></div><b style="color:${x.win?pcol(x.win):'var(--muted)'}">${x.win?pname(x.win):x.tie?'Shared':'Nobody yet'}</b></div>`).join('')}</div></div></div>`;
};
function awards(ws){const P=G.P;const we=addDays(ws,6);const prev=addDays(ws,-7);
  const v=p=>{const s=sumRange(p,ws,we),ps=sumRange(p,prev,addDays(prev,6));let steady=0,team=0;for(const d in G.days){if(d<ws||d>we)continue;const D=G.days[d];if(D.p[p].d>=30)steady++;if(D.hit&&D.p[p].d>0)team++;if(D.blow===p)team++;}
    return{wDm:s.d,wResp:s.r,wVid:s.v,wMeet:s.m,wClient:s.c,wImprove:ps.d>=20?Math.round((s.d-ps.d)/ps.d*100):-1e9,wComeback:comebacksIn(p,ws,we),wSteady:steady,wTeam:team};};
  const vals=Object.fromEntries(P.map(p=>[p,v(p)]));
  return AWARDS.map(a=>{const sc=P.map(p=>[p,vals[p][a.m]]);const max=Math.max(...sc.map(x=>x[1]));if(max<=0||max===-1e9)return{...a};const w=sc.filter(x=>x[1]===max);return w.length>1?{...a,tie:true}:{...a,win:w[0][0]};});}
function comebacksIn(p,a,b){let n=0;for(const d in G.days){if(d<a||d>b||d>=G.today)continue;const D=G.days[d];let r={},min=0;G.P.forEach(x=>r[x]=0);for(const e of D.seq){r[e.pid]++;min=Math.min(min,r[p]-r[other(p)]);}if(min<=-15&&D.p[p].d>D.p[other(p)].d)n++;}return n;}
function podium(aw){const P=G.P;const wins=P.map(p=>[p,aw.filter(a=>a.win===p).length]).sort((a,b)=>b[1]-a[1]);
  return `<div class="podium" aria-label="Awards won this week">${wins.map(([p,n],i)=>`<div style="height:${i===0?130:90}px;background:${i===0?'linear-gradient(#F2CF7A,#DDA94D)':'var(--track)'};color:${i===0?'#fff':'var(--ink)'}"><span style="font-size:22px">${i===0&&n>wins[1]?.[1]?'♛':''}</span><b>${pname(p)}</b><span>${n} award${n===1?'':'s'}</span></div>`).join('')}</div>`;}
function herald(date){
  const D=G.days[date]||{p:Object.fromEntries(G.P.map(p=>[p,{d:0,r:0,v:0,m:0,c:0,f:0}])),team:0,target:targetFor(date),boss:bossFor(date)};const P=G.P;
  const sorted=[...P].sort((a,b)=>D.p[b].d-D.p[a].d);const top=sorted[0],bottom=sorted[1];const clients=P.reduce((a,p)=>a+D.p[p].c,0);
  const zero=P.find(p=>D.p[p].d===0&&!absent(p,date));const vars={top:(C().players[top]?.name||'').toUpperCase(),bottom:(C().players[bottom]?.name||'').toUpperCase(),topn:D.p[top].d,team:D.team,short:Math.max(0,D.target-D.team),zero:(C().players[zero]?.name||'').toUpperCase()};
  const hit=D.target>0&&D.team>=D.target;const cat=clients?'client':zero?'zero':D.team>=150?'stretch':hit?'win':D.target>0?'miss':'win';
  const head=fill(pick(HEADLINES[cat],date),vars);
  const achs=P.flatMap(p=>Object.entries(S.players[p]?.ach||{}).filter(([id,ts])=>L(ts).date===date&&ACH_BY_ID[id]).map(([id])=>({p,a:ACH_BY_ID[id]})));
  return{date,D,head,hit,achs,top,bottom,clients};
}
SCREENS.herald=()=>{
  const yd=G.workdays.filter(d=>d<G.today).pop()||G.today;const h=herald(yd);const D=h.D;const P=G.P;
  const pend=pendingForfeits(S.me);const all=Object.values(S.forfeits).filter(Boolean).sort((a,b)=>b.ts-a.ts);
  const wall=all.filter(f=>f.result==='wall'&&f.status==='spun'&&Date.now()-f.ts<7*86400000);
  const owed=all.filter(f=>f.kind==='real'&&f.status==='spun');
  const quote=P.map(p=>activeForfeitsFor(p).find(f=>f.result==='headline')).find(Boolean);
  return `<div class="pad"><article class="paper"><div class="mast"><small style="color:#5a4a30">Est. the day the first cannon fired · Price: one DM</small><h1>THE SALTY HERALD</h1><small style="color:#5a4a30">${esc(niceDate(yd))}</small></div>
   <div class="head">${esc(quote?`${(C().players[quote.pid]?.name||'').toUpperCase()} FAILS. NATION IN SHOCK. MORE AT 11.`:h.head)}</div>
   <div class="cols"><div><h3>The numbers</h3>${P.map(p=>`${pname(p)}: <b>${D.p[p].d}</b> DMs, ${D.p[p].f||0} follow-ups, ${D.p[p].r} replies, ${D.p[p].v} video, ${D.p[p].m} meetings, ${D.p[p].c} clients`).join('<br>')}<br>Team: <b>${D.team}</b>${D.target?' of '+D.target:''}</div>
   <div><h3>Weather report</h3>${D.target?`${esc(D.boss.name)} ${h.hit?`was defeated${D.blow?`, final blow by ${pname(D.blow)}`:''}${D.hitMin!=null?` at ${String(Math.floor(D.hitMin/60)).padStart(2,'0')}:${String(D.hitMin%60).padStart(2,'0')}`:''}.`:`survived with ${D.target-D.team} HP and is reportedly "quite smug".`}`:'No fog. A day off.'}</div>
   <div><h3>Leaderboard</h3>${D.p[h.top].d===D.p[h.bottom]?.d?'Dead heat. Both keepers refuse to comment.':`${pname(h.top)} won the day by ${D.p[h.top].d-D.p[h.bottom].d}.`} ${pick(['Sources close to the loser cite "a dodgy wifi signal".','The gulls were unavailable for comment.','A rematch has been demanded.','The bakery has named a bun after the winner.'],yd)}</div>
   <div><h3>Bottle post</h3>${heraldBottle(yd,D)}</div>
   <div><h3>Achievements</h3>${h.achs.length?h.achs.slice(0,6).map(x=>`${pname(x.p)}: <i>${esc(x.a.name)}</i>`).join('<br>'):'A quiet day in the trophy cabinet.'}</div>
   <div><h3>Outstanding forfeits</h3>${owed.length?owed.slice(0,5).map(f=>`${pname(f.pid)}: ${esc(f.text)}`).join('<br>'):'All debts settled. Suspicious.'}</div></div></article>
  <div class="card"><h3>Your forfeits</h3>${pend.length?`<div class="list" style="margin-top:8px">${pend.map(f=>`<div class="li"><div class="grow"><b>${f.type==='team'?'Team failure':'Individual failure'}</b><br><small>${esc(f.why)}</small></div><button class="btn sm primary" data-act="wheel" data-d="${f.date}" data-t="${f.type}">Spin</button>${G.players[S.me].shields>0?`<button class="btn sm" data-act="shield" data-d="${f.date}" data-t="${f.type}">Shield</button>`:''}</div>`).join('')}</div>`:'<p class="muted" style="margin:6px 0 0">Nothing owed. Your conscience is spotless.</p>'}
   ${all.filter(f=>f.pid===S.me&&f.status==='spun'&&Date.now()-f.ts<86400000).map(f=>{const n=myDmSince(S.me,f.ts);return `<div class="li" style="margin-top:6px"><div class="grow"><b>Active:</b> ${esc(f.text)}<br><small>Redemption quest: send 30 DMs to lift it early (${Math.min(n,30)}/30)</small>${bar(n,30)}</div><button class="btn sm" data-act="redeem" data-id="${esc(f.id)}" ${n>=30?'':'disabled'}>Redeem</button>${f.kind==='real'?`<button class="btn sm ghost" data-act="paid" data-id="${esc(f.id)}">Paid it</button>`:''}</div>`;}).join('')}
   <p class="tiny muted" style="margin:8px 0 0">Forfeits are temporary and harmless: they never remove achievements, items or doubloons. Approved holidays, sick days and days off never trigger one. Missed days older than two weeks are quietly forgiven.</p></div>
  ${wall.length?`<div class="card"><h3>Wall of Shame</h3><div class="row" style="margin-top:8px">${wall.map(f=>`<div style="text-align:center"><img src="${avatarCanvas(f.pid)}" alt="" style="width:60px;height:60px;border-radius:50%;box-shadow:0 0 0 4px #C9654A"><br><small>${pname(f.pid)} · ${shortDate(f.date)}</small></div>`).join('')}</div></div>`:''}
  </div>`;
};
SCREENS.settings=()=>{
  const cfg=C();const admin=S.isOwner;const P=cfg.playerIds;const ff=approvedForfeits(cfg);
  const abs=Object.entries(cfg.absences||{}).sort().reverse().slice(0,20);
  return `<div class="pad"><h2>Settings</h2>
  <div class="card"><h3>You</h3><p class="tiny muted" style="margin:4px 0 8px">${S.mode==='local'?`Signed in as <b>${pname(S.me)}</b>. This copy saves in this browser only (no live sync between captains).`:S.mode==='supa'?`Signed in as <b>${pname(S.me)}</b> (${esc(HL_EMAIL[S.me]||'')}). Progress syncs live between both captains.`:`Signed in as <b>${pname(S.me)}</b>. Progress syncs live between both captains.`}</p>
   <div class="row"><label class="row tiny" for="sndT"><input id="sndT" type="checkbox" data-act="sound" ${S.sound?'checked':''}> Sound effects</label><button class="btn sm ghost" data-act="logout">Lock the treasure chest on this device</button></div></div>
  <div class="card"><h3>Your captain handle</h3>${S.players[S.me]?.handle?`<p style="margin:6px 0 0">You sail as <b>${esc(S.players[S.me].handle)}</b>. Handles are claimed once and can't be changed.</p>`:`<p class="tiny muted" style="margin:4px 0 8px">Pick the name shown across the game. You can claim it once, and both captains may pick the same name.</p><div class="row"><input id="handleIn" maxlength="20" placeholder="e.g. Salty Sam" style="flex:1"><button class="btn primary" data-act="claimHandle">Claim</button></div>`}</div>
  <div class="card"><h3>Daily mission ${admin?'':'<small>(the game owner can change these)</small>'}</h3>
   <div class="grid2" style="margin-top:8px">
    <label class="f" for="cfgTarget">Team target per working day<input id="cfgTarget" type="number" min="1" value="${cfg.target}" ${admin?'':'disabled'}></label>
    <label class="f" for="cfgCd">DM cooldown (seconds)<input id="cfgCd" type="number" min="1" max="120" value="${cfg.cooldownSec}" ${admin?'':'disabled'}></label>
    <label class="f" for="cfgStart">Day starts<input id="cfgStart" type="time" value="${cfg.dayStart}" ${admin?'':'disabled'}></label>
    <label class="f" for="cfgEnd">Day ends<input id="cfgEnd" type="time" value="${cfg.dayEnd}" ${admin?'':'disabled'}></label>
    <label class="f" for="cfgWarn">Final warning<input id="cfgWarn" type="time" value="${cfg.finalWarning}" ${admin?'':'disabled'}></label>
    <label class="f" for="cfgScale">Target when one keeper is away (%)<input id="cfgScale" type="number" min="10" max="100" value="${Math.round(cfg.absenceScale*100)}" ${admin?'':'disabled'}></label>
    <label class="f" for="cfgPen">Count forfeits from<input id="cfgPen" type="date" value="${cfg.startDate||''}" ${admin?'':'disabled'}></label>
   </div>
   <div class="row" style="margin-top:8px">${[1,2,3,4,5,6,0].map(d=>`<label class="pill" for="wd${d}"><input id="wd${d}" type="checkbox" class="wdBox" value="${d}" ${cfg.workdays.includes(d)?'checked':''} ${admin?'':'disabled'}>${DAYN[d]}</label>`).join('')}</div>
   <h3 style="margin-top:14px">Logging safeguards</h3><p class="tiny muted" style="margin:4px 0 8px">Daily caps and minimum gaps per button, per captain. Meetings and clients need a prospect name, a press-and-hold, and (if switched on) the other captain's confirmation before rewards are paid.</p>
   <div class="grid2">${['r','v','m','c'].map(k=>`<label class="f" for="cap_${k}">${KINDS[k].short}s: max per day<input id="cap_${k}" type="number" min="1" max="500" value="${cfg.caps[k]}" ${admin?'':'disabled'}></label><label class="f" for="cd_${k}">${KINDS[k].short}s: seconds between logs<input id="cd_${k}" type="number" min="1" max="600" value="${cfg.cooldowns[k]}" ${admin?'':'disabled'}></label>`).join('')}</div>
   <label class="f" for="sightMode" style="margin-top:8px">Pet sightings<select id="sightMode" ${admin?'':'disabled'}><option value="auto" ${cfg.sightingMode!=='email'?'selected':''}>Game picks a surprise time each working day</option><option value="email" ${cfg.sightingMode==='email'?'selected':''}>Started by the scheduled email reminder</option></select></label>
   <label class="row tiny" for="reqConf" style="margin-top:8px"><input id="reqConf" type="checkbox" ${cfg.requireConfirm?'checked':''} ${admin?'':'disabled'}> Crewmate must confirm meetings and clients</label>
   ${admin?`<button class="btn primary" style="margin-top:10px" data-act="saveCfg">Save mission settings</button>`:''}
   <p class="tiny muted">Times use UK time (Europe/London) and follow British Summer Time automatically.</p></div>
  ${daysOffCard()}
  <div class="card"><h3>Forfeit wheel</h3><p class="tiny muted" style="margin:4px 0 8px">A forfeit only goes on the wheel when both keepers approve it. Tick the ones you agree to.</p>
   <div class="list">${ff.map(f=>`<div class="li"><div class="grow">${esc(f.text)} <span class="pill">${f.kind==='real'?'real life':'in game'}</span><br><small>${P.map(p=>`${pname(p)} ${f.by[p]?'✓':'✗'}`).join(' · ')}</small></div><label class="pill" for="ap_${f.id}"><input id="ap_${f.id}" type="checkbox" data-act="approve" data-id="${f.id}" ${f.by[S.me]?'checked':''}> I approve</label></div>`).join('')}</div>
   <div class="row" style="margin-top:8px"><label class="f" for="newFf" style="flex:1">Add your own forfeit<input id="newFf" maxlength="90" placeholder="e.g. Wear a party hat on the next call"></label><select id="newFfKind" aria-label="Forfeit type"><option value="real">Real life</option><option value="virtual">In game</option></select><button class="btn" data-act="addFf" style="align-self:end">Add</button></div></div>
  <div class="card"><h3>Reminders</h3><p class="tiny muted" style="margin:4px 0 0">While the game is open, Gary the gull nags you on the Harbour screen and pops up at the final warning time. Reminders that arrive when the game is closed (email, scheduled summaries, the Friday recap) need a scheduler outside this page. Ask Claude to set up a scheduled email reminder and it can read this game's live numbers each morning, at the final warning and on Fridays.</p></div>
  ${S.mode!=='local'&&admin?`<div class="card"><h3>Keeper accounts</h3><div class="list" style="margin-top:8px">${P.map(p=>`<div class="li"><span class="grow">${pname(p)}: ${S.players[p]?.uid?'claimed':'not claimed yet'}</span>${S.players[p]?.uid?`<button class="btn sm ghost" data-act="release" data-p="${p}">Release</button>`:''}</div>`).join('')}</div><p class="tiny muted">Releasing lets someone else claim that keeper. Progress stays.</p></div>`:''}
  <p class="tiny muted">Hundred Cannons · built for Funnal. Rewards are worked out from the activity log, so they can't be awarded twice. Every number here is self-reported.</p></div>`;
};

/* ============================== REMINDERS ============================== */
function reminder(){
  if(!G||!S.me)return null;const D=G.days[G.today];if(!D.target)return null;const P=G.P;const cfg=G.cfg;const min=G.T.min;
  const[a,b]=[...P].sort((x,y)=>D.p[y].d-D.p[x].d);const left=Math.max(0,D.target-D.team);const mins=hm(cfg.dayEnd)-min;
  const v={leader:C().players[a]?.name,lagger:C().players[b]?.name,lead:D.p[a].d,gap:D.p[a].d-D.p[b].d,left,mins};
  const yd=G.workdays.filter(d=>d<G.today).pop();let cat='steady';
  const gt=goldenFor(G.today);const sgs=sightingState(S.me,sightingFor(G.today));
  if(isWork(G.today)&&min>=gt.start&&min<gt.end)cat='golden';else if(sgs&&sgs.phase==='live'&&!sgs.ok){cat='pet';v.rar=sgs.rar;v.need=sgs.need;}else if(D.hit)cat='won';else if(D.team===0&&min>=hm(cfg.dayStart)+30)cat='nobody';else if(mins<=60&&mins>0)cat='deadline';else if(left<=15)cat='close';
  else if(D.over.length&&Date.now()-D.over[D.over.length-1].t<20*60000){cat='overtaken';v.leader=C().players[D.over[D.over.length-1].who]?.name;v.lagger=C().players[other(D.over[D.over.length-1].who)]?.name;}
  else if(D.p[b].d===0&&D.p[a].d>=10&&!absent(b,G.today))cat='lagger';else if(v.gap>=15)cat='ahead';else if(yd&&G.days[yd]&&G.days[yd].target&&!G.days[yd].hit&&min<720)cat='missed';
  const list=REMINDERS[cat];return fill(list[(h32(G.today+cat)+S.reminderIdx)%list.length],v);
}

/* ============================== FX ============================== */
let AC=null;
function tone(f,d=.08,type='square',vol=.05,when=0){if(!S.sound)return;try{AC=AC||getAC();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.value=vol;o.connect(g);g.connect(AC.destination);const t=AC.currentTime+when;o.start(t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.stop(t+d+.02);}catch(e){}}
const SFX={d:()=>{tone(660,.06);tone(990,.08,'square',.04,.05);},r:()=>{[523,659,784].forEach((f,i)=>tone(f,.1,'triangle',.06,i*.07));},v:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,.12,'triangle',.06,i*.07));},m:()=>{[392,523,659,784,1046].forEach((f,i)=>tone(f,.14,'triangle',.07,i*.08));},c:()=>{[523,659,784,1046,784,1046,1318].forEach((f,i)=>tone(f,.18,'square',.06,i*.1));},no:()=>tone(140,.15,'sawtooth',.04),lvl:()=>{[784,988,1175,1568].forEach((f,i)=>tone(f,.15,'triangle',.07,i*.09));},ach:()=>{[880,1320].forEach((f,i)=>tone(f,.15,'triangle',.06,i*.1));}};
function floatText(text,x,y,col){const el=document.createElement('div');el.className='float';el.textContent=text;el.style.left=x+'px';el.style.top=y+'px';if(col)el.style.color=col;$('#fx').appendChild(el);setTimeout(()=>el.remove(),1000);}
function coins(n,from){const to=$('#glowBox').getBoundingClientRect();const r=from.getBoundingClientRect();for(let i=0;i<n;i++){const el=document.createElement('div');el.className='coin';const sx=r.left+r.width/2+(Math.random()-.5)*40,sy=r.top+r.height/2;el.style.left=sx+'px';el.style.top=sy+'px';$('#fx').appendChild(el);
  el.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${(Math.random()-.5)*60}px,${-40-Math.random()*40}px) scale(1.2)`,offset:.35},{transform:`translate(${to.left+to.width/2-sx}px,${to.top+to.height/2-sy}px) scale(.6)`,opacity:.8}],{duration:650+i*60,easing:'ease-in'}).onfinish=()=>el.remove();}}
function toast(html,cls='',ms=3200){const el=document.createElement('div');el.className='toast '+cls;el.innerHTML=html;$('#toasts').appendChild(el);setTimeout(()=>{el.style.transition='opacity .3s';el.style.opacity=0;setTimeout(()=>el.remove(),300);},ms);while($('#toasts').children.length>4)$('#toasts').firstChild.remove();}
function banner(title,sub){const el=document.createElement('div');el.className='banner';el.innerHTML=`<h1>${esc(title)}</h1>${sub?`<p>${esc(sub)}</p>`:''}`;document.body.appendChild(el);setTimeout(()=>el.remove(),2700);}
function fireworks(ms=2600,colors=['#DDA94D','#E06034','#C91E36','#486790','#5DBE9C']){const cv=$('#fireworks');cv.style.display='block';const c=cv.getContext('2d');cv.width=innerWidth;cv.height=innerHeight;const parts=[];const t0=performance.now();let last=0;
  function burst(){const x=Math.random()*cv.width,y=cv.height*(.15+Math.random()*.4);const col=colors[Math.floor(Math.random()*colors.length)];for(let i=0;i<40;i++){const a=Math.random()*7,s=1+Math.random()*4;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,col});}}
  (function f(now){if(now-last>280&&now-t0<ms-600){burst();last=now;}c.clearRect(0,0,cv.width,cv.height);for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.life-=.012;if(p.life>0){c.fillStyle=p.col;c.globalAlpha=p.life;c.fillRect(p.x,p.y,4,4);}}c.globalAlpha=1;if(now-t0<ms)requestAnimationFrame(f);else{cv.style.display='none';c.clearRect(0,0,cv.width,cv.height);}})(t0);}
function celebrate(k,btn){const r=btn.getBoundingClientRect();const kd=KINDS[k];floatText(`+${kd.xp} XP`,r.left+r.width/2-24,r.top-6);
  if(k==='d'){coins(2,btn);if(S.me)launchLantern(S.me);}
  else if(k==='f'){coins(1,btn);fuSplash(btn);}
  else if(k==='r'){coins(5,btn);toast('<b>A reply!</b> A real human wants to talk to you. Stay calm. Be normal.');}
  else if(k==='v'){coins(8,btn);banner('VIDEO MADE','Both captains get paid');}
  else if(k==='m'){coins(12,btn);banner('MEETING SET','Both captains get paid');fireworks(1600);}
  else if(k==='c'){coins(20,btn);banner('NEW CLIENT!','Both captains get paid');fireworks(3200);}
  (SFX[k]||SFX.d)();try{navigator.vibrate&&navigator.vibrate(k==='c'?[60,40,120]:15)}catch(e){}}

/* ============================== ACTIONS ============================== */
async function logAction(k,btn){
  if(!S.me)return askWho();if(S.readOnly)return toast('<b>View only.</b> Ask the owner to share this game with you as a Contributor or Editor.','joke',5000);
  if(k==='m'||k==='c')return openMCSheet(k);
  const now=Date.now(),cfg=C();
  if(k==='d'){if(now<S.cdUntil){btn.classList.remove('shake');void btn.offsetWidth;btn.classList.add('shake');SFX.no();toast(`<b>${esc(pick(JOKES,now))}</b> <small>${Math.ceil((S.cdUntil-now)/1000)}s to reload</small>`,'joke',1800);return;}S.cdStart=now;S.cdUntil=now+cfg.cooldownSec*1000;S.quip=DM_QUIPS[Math.floor(Math.random()*DM_QUIPS.length)];}
  else{const today=L(now).date;const n=G.days[today]?G.days[today].p[S.me][k]:0;const cap=k==='f'?FU_CAP:(cfg.caps[k]||99);if(n>=cap){toast(`<b>Daily limit reached.</b> ${cap} ${KINDS[k].short.toLowerCase()}s a day is the cap. Save some for tomorrow, legend.`,'joke',3000);return;}
    if(now<(S.btnLock[k]||0)){toast(`<b>${esc(pick(JOKES,now))}</b> <small>${Math.ceil((S.btnLock[k]-now)/1000)}s</small>`,'joke',1500);return;}const cdS=k==='f'?FU_CD:(cfg.cooldowns[k]||3);S.btnLock[k]=now+cdS*1000;if(k!=='f'){btn.classList.add('busy');setTimeout(()=>btn.classList.remove('busy'),cdS*1000);}}
  const id=uid();const date=L(now).date;S.pending[id]={id,pid:S.me,date,k,t:now};celebrate(k,btn);refresh();
  try{
    const lease=await S.db.doc(`cool/${S.me}_${k}`).acquire({holder:id,ttlMs:k==='d'?cfg.cooldownSec*1000:k==='f'?FU_CD*1000:clamp((cfg.cooldowns[k]||3)*1000,1000,600000)});
    if(!lease.acquired){delete S.pending[id];const exp=Date.parse(lease.expiresAt)||now+5000;if(k==='d'){S.cdStart=exp-cfg.cooldownSec*1000;S.cdUntil=exp;}toast('<b>Nice try. The button remembers.</b> <small>Another tab or device just logged one.</small>','joke',2600);refresh();return;}
    await writeDay(S.me,date,{ev:{[id]:{k,t:now}}});
  }catch(e){delete S.pending[id];refresh();writeFail(e);}
}
async function undo(){
  if(!S.me||!G)return;const cfg=C();const mine=[...G.evs,...G.pendingConf].filter(e=>e.pid===S.me&&Date.now()-e.t<cfg.undoMinutes*60000).sort((a,b)=>b.t-a.t);const e=mine[0];
  if(!e)return toast(`<b>Nothing to undo.</b> Your record is spotless. Suspiciously spotless. <small>You can undo your own logs from the last ${cfg.undoMinutes} minutes.</small>`,'',2500);
  if(S.pending[e.id])return toast('<b>Still saving that one.</b> Try again in a second.','',1500);
  try{await writeDay(S.me,e.date,{ev:{[e.id]:{u:1}}});toast(`<b>Undone:</b> one ${esc(KINDS[e.k].name)}. We'll pretend that never happened.`,'',2200);}catch(err){writeFail(err);}
}
const ACT={
  nextReminder(){S.reminderIdx++;render();},
  viewIslet(d){S.view.islet=d.p;render();},
  bookP(d){S.view.bookP=d.p;render();},
  lb(d){S.view.lb=d.k;render();},
  shopCat(d){S.view.shop=d.c;render();},
  lockDur(d){S.view.lockDur=+d.m;render();},
  async renameMoth(){openModal(`<h2>Name your companion</h2><input id="mothIn" maxlength="20" value="${esc(S.players[S.me]?.mothName||'Wick')}"><div class="row"><button class="btn primary" data-act="saveMoth">Save</button><button class="btn ghost" data-act="closeModal">Cancel</button></div>`);},
  async saveMoth(){const v=$('#mothIn').value.trim().slice(0,20);closeModal();if(v)try{await writePlayer(S.me,{mothName:v});}catch(e){writeFail(e);}},
  closeModal(){closeModal();},
  async place(d){const cat=d.cat==='deck'?'deck':'decor';const n=cat==='deck'?3:6;const pl=S.players[S.me]||{};const dec=[...(pl[cat]||[])];while(dec.length<n)dec.push(null);if(dec.includes(d.id)){dec[dec.indexOf(d.id)]=null;}else{const i=dec.findIndex(x=>!x);if(i<0)return toast('<b>No free spot.</b> Tap a filled spot to clear it first.');dec[i]=d.id;}try{await writePlayer(S.me,{[cat]:dec});tone(660,.06,'triangle',.04);}catch(e){writeFail(e);}},
  async unplace(d){const cat=d.cat==='deck'?'deck':'decor';const dec=[...((S.players[S.me]||{})[cat]||[])];dec[+d.i]=null;try{await writePlayer(S.me,{[cat]:dec});}catch(e){writeFail(e);}},
  shipMode(d){S.view.shipMode=d.m;render();},
  wardrobe(d){S.view.wardrobe=d.c;render();},
  async confirmMC(d){try{await writeDay(d.p,d.d,{ev:{[d.id]:{ok:S.me,okT:Date.now()}}});toast('<b>Confirmed.</b> Honesty 1, sea monsters 0. Rewards are on their way to '+pname(d.p)+'.');tone(784,.1,'triangle',.05);}catch(e){writeFail(e);}},
  async disputeMC(d){openModal(`<h2>Dispute this?</h2><p>It will be removed from the stats and nobody gets rewards for it. ${pname(d.p)} can log it again if it was a mistake.</p><div class="row"><button class="btn primary" data-act="doDispute" data-p="${d.p}" data-d="${d.d}" data-id="${d.id}">Dispute it</button><button class="btn ghost" data-act="closeModal">Keep it</button></div>`);},
  async doDispute(d){closeModal();try{await writeDay(d.p,d.d,{ev:{[d.id]:{x:S.me,xT:Date.now()}}});toast('Disputed. The parrot has filed a formal complaint.');}catch(e){writeFail(e);}},
  led(d){S.view.led=d.v;render();},
  ledNav(d){const tw=weekStart(G.today);const cur=S.view.ledWeek||tw;S.view.ledWeek=addDays(cur,7*+d.d);if(S.view.ledWeek>tw)S.view.ledWeek=tw;render();},
  ledNavM(d){const m=S.view.ledMonth||G.today.slice(0,7);const dt=new Date(Date.UTC(+m.slice(0,4),+m.slice(5,7)-1+(+d.d),1));S.view.ledMonth=dt.toISOString().slice(0,7);render();},
  heatWho(d){S.view.heatWho=d.w;render();},
  async csv(){try{await navigator.clipboard.writeText(csvText());toast('<b>Copied.</b> Paste it into a spreadsheet: one row per day, every button per captain.');}catch(e){openModal(`<h2>Your data as CSV</h2><p class="tiny muted">Select all and copy.</p><textarea style="width:100%;height:240px;font:12px monospace;border-radius:14px;padding:10px;border:0;box-shadow:inset 0 0 0 2px var(--line)">${esc(csvText())}</textarea><button class="btn" data-act="closeModal">Done</button>`);}},
  async buy(d){const it=ALL_ITEMS[d.id];const lk=itemLocked(it,G.players[S.me]);if(lk&&!String(d.id).startsWith('m_'))return toast('<b>Locked.</b> '+esc(lk),'joke');const me=G.players[S.me];const price=+d.p;if(me.balance<price)return toast('<b>Not enough doubloons.</b> Pell suggests sending more DMs. Pell is wise, and very greedy.','joke');if(me.owned[d.id]&&it.cat!=='shield')return;
    const id=uid();try{await writeDay(S.me,G.today,{spend:{[id]:{item:it.id,cost:price,ts:Date.now()}}});SFX.ach();toast(`<b>Bought ${esc(it.name)}!</b> Looking sharp, captain.`);
      banner('NEW '+it.name.toUpperCase(),CAT_NAMES[it.cat]);if(it.cat==='decor'||it.cat==='deck'){await ACT.place({id:it.id,cat:it.cat});}else if(EQUIP_CATS.includes(it.cat))await writePlayer(S.me,{[it.cat]:it.id});}catch(e){writeFail(e);}},
  async equip(d){const it=ALL_ITEMS[d.id];const cur=(S.players[S.me]||{})[it.cat];const dflt=SHIP_DEFAULT[it.cat];const next=cur===it.id?(dflt||null):it.id;try{await writePlayer(S.me,{[it.cat]:next});tone(880,.06,'triangle',.04);}catch(e){writeFail(e);}},
  async claim(d){if(G.players[S.me].claimed.has(d.key))return;try{await writeDay(S.me,G.today,{bonus:{[d.key]:{xp:+d.xp,g:+d.g,ts:Date.now()}}});SFX.ach();toast(`<b>Quest complete!</b> +${d.xp} XP, +${d.g} ${CN}. Gary is mildly impressed.`);}catch(e){writeFail(e);}},
  async fund(d){const p=G.proj.find(x=>x.id===d.id);const amt=Math.min(+d.a,p.g-p.funded,G.players[S.me].balance);if(amt<=0)return;try{await writeDay(S.me,G.today,{contrib:{[uid()]:{proj:p.id,amt,ts:Date.now()}}});toast(`<b>+${amt} ${CN}</b> towards ${esc(p.name)}`);}catch(e){writeFail(e);}},
  async prestige(){openModal(`<h2>Rekindle your lantern?</h2><p>Your level resets to 1 and you gain a permanent prestige star, a new lighthouse colour and access to prestige items. Lifetime stats, achievements, items and doubloons all stay.</p><div class="row"><button class="btn primary" data-act="doPrestige">Rekindle</button><button class="btn ghost" data-act="closeModal">Not yet</button></div>`);},
  async doPrestige(){closeModal();const me=G.players[S.me];if(me.li.level<50)return;const arr=[...((S.players[S.me]||{}).prestige||[]),me.xp];try{await writePlayer(S.me,{prestige:arr});banner('REKINDLED','A new star burns above your lighthouse');fireworks(3000);}catch(e){writeFail(e);}},
  async lockStart(){const cm=+($('#lockCustom')?.value||0);const m=cm>=5?Math.min(180,cm):S.view.lockDur;const tier=voyageTier(m);const dd=tier.mon.some(x=>x[0]===S.view.lockDiff)?S.view.lockDiff:tier.mon[1][0];try{await writePlayer(S.me,{lock:{id:uid(),s:Date.now(),dur:m*60000,paused:0,pausedAt:null,diff:dd,mode:S.view.lockMode==='fish'?'fish':'hunt',bait:S.view.lockMode==='fish'?(S._bait||''):'',hv:2}});tone(392,.2,'triangle',.06);tone(523,.25,'triangle',.06,.15);}catch(e){writeFail(e);}},
  async lockPause(){const lk=S.players[S.me].lock;try{await writePlayer(S.me,{lock:{...lk,pausedAt:Date.now()}});}catch(e){writeFail(e);}},
  async lockResume(){const lk=S.players[S.me].lock;try{await writePlayer(S.me,{lock:{...lk,paused:(lk.paused||0)+(Date.now()-lk.pausedAt),pausedAt:null}});}catch(e){writeFail(e);}},
  async lockCancel(){try{await writePlayer(S.me,{lock:null});toast('Voyage abandoned. No judgement. (Some judgement.)');}catch(e){writeFail(e);}},
  async lockFinish(){await finishLock(true);},
  async chalCreate(d){const id=uid();try{await S.db.collection('challenges').doc(id).set({type:d.type,dur:+d.m*60000,target:+d.tg,by:S.me,acc:{[S.me]:true},created:Date.now(),status:'pending'});toast(`<b>Challenge sent.</b> Waiting for ${pname(other(S.me))} to accept.`);}catch(e){writeFail(e);}},
  async chalAccept(d){try{await S.db.doc('challenges/'+d.id).update({acc:{[S.me]:true},start:Date.now()+10000,status:'on'});banner('CHALLENGE ACCEPTED','Starts in 10 seconds');}catch(e){writeFail(e);}},
  async chalDecline(d){try{await S.db.doc('challenges/'+d.id).update({status:S.challenges[d.id]?.by===S.me?'cancelled':'declined'});}catch(e){writeFail(e);}},
  wheel(d){openWheel(d.d,d.t);},
  async shield(d){try{await S.db.doc(`forfeits/${d.d}_${S.me}_${d.t}`).set({pid:S.me,date:d.d,type:d.t,status:'shield',ts:Date.now(),text:'Storm Shield used'});toast('<b>Shield raised.</b> That day never happened. Officially.');}catch(e){writeFail(e);}},
  async redeem(d){try{await S.db.doc('forfeits/'+d.id).update({status:'redeemed',redeemedAt:Date.now()});banner('REDEEMED','The shame lifts. Mostly.');}catch(e){writeFail(e);}},
  async paid(d){try{await S.db.doc('forfeits/'+d.id).update({status:'paid',paidAt:Date.now()});toast('<b>Debt settled.</b> A captain of honour. Gary is welling up.');}catch(e){writeFail(e);}},
  async achInfo(d){const a=ACH_BY_ID[d.id];const pid=S.view.bookP||S.me;const me=G.players[pid];const un=me.unlocked[a.id];const sc=(S.players[S.me]?.showcase)||[];
    openModal(`<div class="ach r-${a.rar} ${un?'':'locked'}" style="padding:14px"><canvas class="medalArt big" width="240" height="240" data-ach="${a.id}" data-un="${un?1:0}" data-sec="${a.secret&&!un?1:0}"></canvas><span class="rtag">${a.rar}${a.tier?' · '+a.tier:''} · ${esc(a.cat)}</span><h2>${a.secret&&!un?'Hidden achievement':esc(a.name)}</h2><p>${a.secret&&!un?'Some secrets need unusual combinations of genuine activity. No hints.':esc(a.secret?a.reveal:a.desc)}</p><small>Reward: ${RARITY_GLOW[a.rar]} doubloons</small></div>
    <div class="row">${un&&pid===S.me?`<button class="btn primary" data-act="toggleShow" data-id="${a.id}">${sc.includes(a.id)?'Remove from showcase':'Add to showcase'}</button>`:''}<button class="btn ghost" data-act="closeModal">Close</button></div>`);},
  async toggleShow(d){let sc=[...((S.players[S.me]?.showcase)||[])];sc=sc.includes(d.id)?sc.filter(x=>x!==d.id):[d.id,...sc].slice(0,3);closeModal();try{await writePlayer(S.me,{showcase:sc});toast('Showcase updated.');}catch(e){writeFail(e);}},
  sound(){S.sound=!S.sound;try{localStorage.setItem('hl_sound',S.sound?'1':'0')}catch(e){}},
  switchMe(){S.me=other(S.me);try{localStorage.setItem('hl_me',S.me)}catch(e){}S.view.islet=null;S.view.bookP=null;refresh(true);},
  async saveCfg(){const v=id=>$('#'+id).value;const wds=[...document.querySelectorAll('.wdBox')].filter(x=>x.checked).map(x=>+x.value);
    const patch={target:Math.max(1,+v('cfgTarget')||100),cooldownSec:clamp(+v('cfgCd')||5,1,120),dayStart:v('cfgStart')||'09:00',dayEnd:v('cfgEnd')||'17:30',finalWarning:v('cfgWarn')||'16:30',absenceScale:clamp((+v('cfgScale')||50)/100,.1,1),startDate:v('cfgPen')||'',workdays:wds.length?wds:[1,2,3,4,5,6,0],caps:Object.fromEntries(['r','v','m','c'].map(k=>[k,clamp(+v('cap_'+k)||1,1,500)])),cooldowns:Object.fromEntries(['r','v','m','c'].map(k=>[k,clamp(+v('cd_'+k)||1,1,600)])),requireConfirm:$('#reqConf').checked,sightingMode:$('#sightMode').value};
    try{await writeConfig(patch);toast('<b>Saved.</b> The sea monsters have been informed.');}catch(e){writeFail(e);}},
  async addAbs(){const d=$('#absDate').value,w=$('#absWho').value,t=$('#absType').value;if(!d)return;try{if(w==='__all'){const h=[...new Set([...(C().holidays||[]),d])];await writeConfig({holidays:h});}else await writeConfig({absences:{[d+'_'+w]:t}});toast('<b>Day off recorded.</b> Enjoy it. The monsters will wait. Grumpily.');}catch(e){writeFail(e);}},
  async rmHol(d){try{await writeConfig({holidays:(C().holidays||[]).filter(x=>x!==d.d)});}catch(e){writeFail(e);}},
  async rmAbs(d){try{await writeConfig({absences:{[d.k]:{__delete__:true}}});}catch(e){writeFail(e);}},
  async approve(d,el){try{await writeConfig({approvals:{[S.me]:{[d.id]:!!el.checked}}});}catch(e){writeFail(e);}},
  async addFf(){const t=$('#newFf').value.trim();if(!t)return;try{await writeConfig({custom:{['c'+uid()]:{text:t.slice(0,90),kind:$('#newFfKind').value,by:S.me}}});$('#newFf').value='';toast(`Added. ${pname(other(S.me))} needs to approve it too.`);}catch(e){writeFail(e);}},
  async release(d){try{await writePlayer(d.p,{uid:null});}catch(e){writeFail(e);}},
  async claimKeeper(d){await claimKeeper(d.p);},
  async spin(){await doSpin();},
  wheelMode(d){S.view.wheelMode=d.m;drawWheel(0);$('#wheelModeSeg').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.m===d.m));},
};
function lockElapsed(lk){const end=lk.pausedAt||Date.now();return Math.max(0,end-lk.s-(lk.paused||0));}
async function finishLock(early){const lk=S.players[S.me]?.lock;if(!lk||S.finishing)return;S.finishing=true;const el=lockElapsed(lk);const dms=myDmSince(S.me,lk.s);const vb=voyageBoss(lk);const beat=dms>=vb.hp;const full=!early&&el>=lk.dur-1000;
  try{if(el>=60000){await writeDay(S.me,L(lk.s).date,{ses:{[lk.id]:{s:lk.s,e:Date.now(),dur:Math.min(el,lk.dur),planned:lk.dur,dms,diff:lk.diff||'calm',mode:lk.mode||'hunt',bait:lk.bait||'',hv:lk.hv||0,cid:lk.cid||'',cdur:lk.cdur||0,beat:isFish(lk.mode)?false:beat,full}}});}await writePlayer(S.me,{lock:null});focusOff();
    const me=G.players[S.me];const mins=Math.max(1,el/60000);const chest=full?dms*3:0;
    openModal(`<div class="reveal">${full?'<div class="chestAnim"><i class="lid"></i><i class="box"></i><i class="shine"></i></div>':''}<h2>${full?'Treasure Island!':'Anchors down'}</h2>
     <div class="grid3"><div class="stat"><b>${Math.round(el/60000)} min</b><small>voyage</small></div><div class="stat"><b>${dms}</b><small>DMs sent</small></div><div class="stat"><b>${Math.round(dms/mins*60)}</b><small>per hour</small></div>
     <div class="stat"><b>${chest?'+'+chest:'—'}</b><small>chest doubloons</small></div><div class="stat"><b>${beat?'Beaten':'Escaped'}</b><small>${esc(vb.desc.toLowerCase())}</small></div><div class="stat"><b>${dms>me.m.bestSession?'NEW!':me.m.bestSession}</b><small>best voyage</small></div></div>
     ${el<60000?'<p class="tiny muted">Voyages under a minute aren\'t recorded.</p>':''}${!full&&el>=60000?'<p class="tiny muted">Dropping anchor early skips the treasure chest.</p>':''}
     <p class="muted">${dms>=20?'Absolute machine. Take five minutes, stretch, drink some water.':dms>=8?'Solid voyage. Stretch your legs before the next one.':'Every voyage counts. Quick break?'}</p><button class="btn primary" data-act="closeModal">Back to port</button></div>`);
    if(full){SND.chest();fireworks(2200);}}catch(e){writeFail(e);}S.finishing=false;}

/* ---------- Forfeit wheel ---------- */
let WHEEL={rot:0,date:null,type:null,spinning:false};
function wheelItems(){const all=approvedForfeits().filter(f=>f.ok);const m=S.view.wheelMode;const l=all.filter(f=>m==='both'?true:f.kind===m);return l.length?l:all.filter(f=>f.kind==='virtual');}
function openWheel(date,type){WHEEL={rot:0,date,type,spinning:false};
  openModal(`<h2>Wheel of Forfeits</h2><p class="tiny muted">${type==='team'?'Team failure':'Individual failure'} · ${esc(niceDate(date))}</p><div class="seg" id="wheelModeSeg">${[['virtual','In game'],['real','Real life'],['both','Both']].map(([m,n])=>`<button class="${S.view.wheelMode===m?'on':''}" data-act="wheelMode" data-m="${m}">${n}</button>`).join('')}</div><div class="wheelWrap"><div class="pin"></div><canvas id="wheel" width="300" height="300"></canvas></div><p id="wheelRes" style="text-align:center;min-height:2.6em;font-family:var(--display)"></p><div class="row" style="justify-content:center"><button class="btn primary" id="spinBtn" data-act="spin">Spin the wheel</button><button class="btn ghost" data-act="closeModal">Later</button></div>`);drawWheel(0);}
function drawWheel(rot){const cv=$('#wheel');if(!cv)return;const c=cv.getContext('2d');const it=wheelItems();const n=it.length;c.clearRect(0,0,300,300);const cols=['#E06034','#DDA94D','#7CC7E6','#9B7FD9','#5DBE9C','#E0457B'];
  for(let i=0;i<n;i++){const a0=rot+i/n*Math.PI*2,a1=rot+(i+1)/n*Math.PI*2;c.beginPath();c.moveTo(150,150);c.arc(150,150,145,a0,a1);c.closePath();c.fillStyle=cols[i%cols.length];c.fill();c.strokeStyle='#FFFCF4';c.lineWidth=3;c.stroke();
    c.save();c.translate(150,150);c.rotate((a0+a1)/2);c.fillStyle='#FFFFFF';c.font='700 11px Nunito, sans-serif';c.textAlign='right';const s=it[i].text;c.fillText(s.length>26?s.slice(0,25)+'…':s,138,4);c.restore();}
  disc(c,150,150,16,'#FFFCF4');disc(c,150,150,8,'#3F5160');}
async function doSpin(){if(WHEEL.spinning)return;const it=wheelItems();if(!it.length)return;WHEEL.spinning=true;$('#spinBtn').disabled=true;const n=it.length;const idx=Math.floor(Math.random()*n);
  const target=-Math.PI/2-(idx+.5)/n*Math.PI*2;const total=Math.PI*2*6+((target%(Math.PI*2))+Math.PI*2)%(Math.PI*2);const t0=performance.now(),dur=3600;let lastTick=0;
  await new Promise(res=>{(function f(now){const p=Math.min(1,(now-t0)/dur);const e=1-Math.pow(1-p,4);const r=total*e;drawWheel(r);const seg=Math.floor(r/(Math.PI*2/n));if(seg!==lastTick){lastTick=seg;tone(900,.02,'square',.03);}if(p<1)requestAnimationFrame(f);else res();})(t0);});
  const f=it[idx];$('#wheelRes').textContent=f.text;SFX.no();
  try{await S.db.doc(`forfeits/${WHEEL.date}_${S.me}_${WHEEL.type}`).set({pid:S.me,date:WHEEL.date,type:WHEEL.type,status:'spun',result:f.id,text:f.text,kind:f.kind,ts:Date.now()});}catch(e){writeFail(e);}
  WHEEL.spinning=false;}

/* ---------- Modal ---------- */
function openModal(html){const m=$('#modal');m.innerHTML=`<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;m.hidden=false;}
function closeModal(){const m=$('#modal');m.hidden=true;m.innerHTML='';}
