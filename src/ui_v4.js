/* ============================== SOUND (synthesised, same family as funnal.co.uk) ============================== */
/* one shared audio context, unlocked on the first tap, and allowed to play when an iPhone is on silent */
function getAC(){try{if(!window.__hlAC){window.__hlAC=new (window.AudioContext||window.webkitAudioContext)();}const a=window.__hlAC;if(a.state!=='running')a.resume().catch(()=>{});return a;}catch(e){return null;}}
(function(){try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch(e){}
  let el=null;const unlock=()=>{const a=getAC();if(a){try{const b=a.createBuffer(1,1,22050),s=a.createBufferSource();s.buffer=b;s.connect(a.destination);s.start(0);}catch(e){}}
    try{if(!el){el=document.createElement('audio');el.setAttribute('playsinline','');el.setAttribute('x-webkit-airplay','deny');el.loop=true;el.preload='auto';
      el.src='data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YSADAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==';}const p=el.play();if(p&&p.catch)p.catch(()=>{});}catch(e){}
    if(a&&a.state==='running'){['touchend','pointerdown','keydown','click'].forEach(ev=>document.removeEventListener(ev,unlock,true));}};
  ['touchend','pointerdown','keydown','click'].forEach(ev=>document.addEventListener(ev,unlock,true));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&window.__hlAC&&window.__hlAC.state!=='running')window.__hlAC.resume().catch(()=>{});});})();
const SND=(()=>{let ac=null,master=null;let last={};
  function ctx(){if(!S.sound)return null;try{if(!ac){ac=getAC();if(!ac)return null;master=ac.createGain();master.gain.value=.55;master.connect(ac.destination);}if(ac.state==='suspended')ac.resume();return ac;}catch(e){return null;}}
  function osc(type,f0,f1,dur,vol,when=0){const a=ctx();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type;const t=a.currentTime+when;o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.03);}
  function noise(dur,vol,freq,q=1,when=0,type='lowpass'){const a=ctx();if(!a)return;const n=Math.floor(a.sampleRate*dur);const b=a.createBuffer(1,n,a.sampleRate);const d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);const s=a.createBufferSource();s.buffer=b;const f=a.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;const g=a.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(master);s.start(a.currentTime+when);}
  const thr=(k,ms)=>{const n=performance.now();if(last[k]&&n-last[k]<ms)return false;last[k]=n;return true;};
  return{
    tick(){if(thr('tick',45))osc('sine',2400,1800,.025,.025);},
    pop(){osc('sine',520,880,.07,.09);osc('triangle',1040,1300,.05,.03,.01);},
    tab(){osc('sine',660,660,.06,.06);osc('sine',990,990,.07,.05,.05);},
    open(){osc('sine',380,760,.14,.07);noise(.12,.03,2400,1,0,'bandpass');},
    close(){osc('sine',700,340,.12,.06);},
    success(){[523,659,784,1046].forEach((f,i)=>osc('triangle',f,f,.16,.07,i*.07));},
    coin(){osc('square',1568,1568,.06,.025);osc('square',2093,2093,.12,.025,.05);},
    cannon(){noise(.35,.5,320,.8);osc('sine',140,48,.3,.22);noise(.08,.12,3000,1,0,'highpass');},
    splash(){noise(.4,.18,900,.6,0,'bandpass');},
    horn(){osc('sawtooth',196,190,.9,.05);osc('sawtooth',247,240,.9,.035);osc('sine',98,98,.9,.06);},
    chest(){noise(.15,.1,500,1);[784,988,1175,1568,2093].forEach((f,i)=>osc('triangle',f,f,.22,.06,.12+i*.07));},
    err(){osc('square',180,120,.16,.05);},
    level(){[523,659,784,1046,1318].forEach((f,i)=>osc('triangle',f,f,.2,.07,i*.08));},
    hold(){osc('sine',220,660,.95,.05);},
    unlock(){[1046,1318,1568].forEach((f,i)=>osc('sine',f,f,.25,.06,i*.06));},
  };})();
// remap the game's existing effects onto the new sound set
SFX.d=()=>{SND.cannon();setTimeout(SND.coin,180);};SFX.r=()=>{SND.pop();SND.success();};SFX.v=()=>{SND.success();SND.coin();};SFX.m=()=>{SND.success();SND.chest();};SFX.c=()=>{SND.chest();setTimeout(SND.level,300);};
SFX.no=()=>SND.err();SFX.lvl=()=>SND.level();SFX.ach=()=>SND.unlock();
function tone(f,d=.08,type='sine',vol=.05,when=0){/* legacy calls: soften into the new palette */if(f<300)SND.err();else SND.pop();}
const _openModal=openModal,_closeModal=closeModal;
openModal=function(html){_openModal(html);SND.open();};
closeModal=function(){const was=!$('#modal').hidden;_closeModal();if(was)SND.close();};

/* ============================== TOOLTIPS ON SCENES ============================== */
function setupTips(){
  const tip=document.createElement('div');tip.id='tip';tip.hidden=true;document.body.appendChild(tip);
  const find=(cv,ev)=>{const r=cv.getBoundingClientRect();let x=(ev.clientX-r.left)/r.width*W,y=(ev.clientY-r.top)/r.height*H;if(cv.id==='focusCv'&&S.focusXf){const f=S.focusXf;x=((ev.clientX-r.left)*f.dpr-f.ox)/f.s;y=((ev.clientY-r.top)*f.dpr-f.oy)/f.s;}for(let i=S.hits.length-1;i>=0;i--){const h=S.hits[i];if(x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h)return h;}return null;};
  const show=(h,ev)=>{if(!h){tip.hidden=true;return;}tip.innerHTML=`<b>${esc(h.title)}</b><span>${esc(h.body)}</span>`;tip.hidden=false;const w=Math.min(280,innerWidth-24);tip.style.maxWidth=w+'px';const x=clamp(ev.clientX-w/2,12,innerWidth-w-12),y=ev.clientY-14;tip.style.left=x+'px';tip.style.top=y+'px';tip.classList.toggle('below',y<160);};
  document.addEventListener('pointermove',ev=>{const cv=ev.target.closest&&ev.target.closest('canvas.scene');if(!cv||ev.pointerType==='touch'){if(!tip.hidden&&!S.tipPinned)tip.hidden=true;return;}const h=find(cv,ev);cv.style.cursor=h?(h.act?'pointer':'help'):'default';if(h&&h!==S.tipLast)SND.tick();S.tipLast=h;show(h,ev);});
  document.addEventListener('click',ev=>{const cv=ev.target.closest&&ev.target.closest('canvas.scene');if(!cv){tip.hidden=true;S.tipPinned=false;return;}const h=find(cv,ev);
    if(h&&h.act&&h.act.collect){collectFloat(h.act);tip.hidden=true;return;}
    S.tipPinned=!!h;show(h,ev);if(h)SND.pop();clearTimeout(S.tipT);S.tipT=setTimeout(()=>{tip.hidden=true;S.tipPinned=false;},4200);});
}
async function collectFloat(a){if(!S.me||G.players[S.me].claimed.has(a.collect))return;const g=a.kind==='chest'?25:10;try{await writeDay(S.me,G.today,{bonus:{[a.collect]:{xp:15,g,ts:Date.now()}}});SND.chest();toast(`<b>${a.kind==='chest'?'Treasure!':'A note inside says: "Keep going, captain."'}</b> +15 XP, +${g} ${CN}`);}catch(e){writeFail(e);}}

/* ============================== HARBOUR EVENT PANELS ============================== */
function eventsHtml(){
  const now=Date.now(),T=L(now),D=G.days[G.today];const work=isWork(G.today);let out='';
  // emissary
  const myD=D.p[S.me]?.d||0;const gr=emGrade(myD);const nx=EMISSARY[gr+1];
  out+=`<div class="ev em" data-act="help" data-h="Emissary flag"><span class="emflag g${gr}"><i></i><b>${['I','II','III','IV','V'][gr]}</b></span><div class="grow"><b>Emissary ${EMISSARY[gr].name}</b><small>DMs worth ×${EMISSARY[gr].mult}${nx?` · Grade ${['I','II','III','IV','V'][gr+1]} at ${nx.at} of your DMs (${nx.at-myD} to go)`:' · maximum grade!'}</small></div><span class="q">?</span></div>`;
  if(work){const gt=goldenFor(G.today);const live=T.min>=gt.start&&T.min<gt.end;const done=T.min>=gt.end;const hm2=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
    out+=`<div class="ev gold ${live?'live':''}" data-act="help" data-h="Golden Tide"><span class="sun"></span><div class="grow"><b>${live?'GOLDEN TIDE: everything scores double!':done?'Golden Tide has passed':'Golden Tide today'}</b><small>${live?`ends ${hm2(gt.end)} · <span class="cdn" data-t="${londonTs(G.today,gt.end)}"></span> left`:done?`It was ${hm2(gt.start)}–${hm2(gt.end)}. Back tomorrow.`:`A surprise 25 minutes of double XP and doubloons. ${T.min<gt.start-120?'Time revealed at '+hm2(Math.max(0,gt.start-120))+'.':'Starts at '+hm2(gt.start)+'.'}`}</small></div><span class="q">?</span></div>`;}
  const sg=sightingFor(G.today);const ss=sightingState(S.me,sg,now);
  if(ss){const R=ss.rar;const hm2=t=>{const l=L(t);return String(Math.floor(l.min/60)).padStart(2,'0')+':'+String(l.min%60).padStart(2,'0');};
    const show=ss.phase!=='soon'||ss.claimed;
    out+=`<div class="ev pet r-${R} ${ss.phase==='live'?'live':''}"><canvas class="petIco" data-pet="${ss.pet.id}" data-sil="${show?0:1}"></canvas><div class="grow"><b>${ss.claimed?`You caught the ${esc(ss.pet.name)}!`:ss.phase==='soon'?'A pet sighting is coming today':ss.phase==='live'?`${esc(ss.pet.name)} spotted!`:ss.ok?`Claim your ${esc(ss.pet.name)}`:`The ${esc(ss.pet.name)} swam away`}</b>
      <small><span class="rtag">${R}</span> · ${ss.phase==='soon'?`Some time between 07:00 and 19:00. Rarer pets need more DMs (up to 50 in 45 minutes).`:ss.phase==='live'?`Log ${ss.need} DMs before ${hm2(ss.end)} (<span class="cdn" data-t="${ss.end}"></span>) · ${Math.min(ss.n,ss.need)}/${ss.need}`:ss.claimed?'Now in your pet collection.':ss.ok?`You logged ${ss.n} DMs in the window.`:`Window was ${hm2(ss.start)}–${hm2(ss.end)}. Another sighting tomorrow.`}</small>${ss.phase==='live'&&!ss.claimed?bar(ss.n,ss.need):''}</div>
      ${!ss.claimed&&ss.ok?`<button class="btn sm primary" data-act="claimPet" data-pet="${ss.pet.id}">Claim</button>`:'<span class="q" data-act="help" data-h="Pet sightings">?</span>'}</div>`;}
  return `<div class="events">${out}</div>`;
}
function crewCheckWrap(){const n=G.pendingConf.length;if(!n||!G.cfg.requireConfirm)return '';const mine=G.pendingConf.filter(e=>e.pid!==S.me).length;
  if(S.view.crewHide)return `<button class="crewPill" data-act="crewToggle">Crew check · ${n}${mine?` <b>${mine} need you</b>`:''}<span>Show</span></button>`;
  return crewCheckHtml().replace('<small>Rewards land once confirmed</small>','<button class="btn sm ghost" data-act="crewToggle">Hide</button>');}

/* ============================== PETS SCREEN ============================== */
SCREENS.pets=()=>{const me=G.players[S.me];const pl=S.players[S.me]||{};const se=seasonOf(G.today);const got=me.pets;
  const groups=['evergreen','winter','spring','summer','autumn'];
  return `<div class="pad"><div class="row between"><h2>Pet collection</h2><span class="pill">${Object.keys(got).length}/${PETS.length}</span></div>
  <div class="card flat"><p class="tiny" style="margin:0">One pet is sighted every working day between 07:00 and 19:00. Log enough DMs inside its window, then claim it. This season is <b>${se}</b> (until ${shortDate(seasonEnds(G.today))}): ${se} pets and evergreen pets can appear. Seasonal pets return next year.</p>
   <div class="rates">${Object.entries(PET_RARITY).map(([r,x])=>`<span class="r-${r}"><b class="rtag">${r}</b>${x.p}% · ${x.win} min · ${x.need} DMs</span>`).join('')}</div></div>
  ${groups.map(g=>`<div class="card"><div class="row between"><h3 style="text-transform:capitalize">${g}${g===se?' <span class="pill live">in season</span>':''}</h3></div><div class="petGrid">${PETS.filter(p=>p.season===g).map(p=>{const own=got[p.id];const on=pl.pet===p.id;return `<button class="petCard r-${p.rar} ${own?'':'locked'} ${on?'on':''}" ${own?`data-act="equipPet" data-pet="${p.id}"`:'disabled'}><canvas class="petIco" data-pet="${p.id}" data-sil="${own?0:1}"></canvas><b>${own?esc(p.name):'???'}</b><span class="rtag">${p.rar}</span>${on?'<small>Sailing with you</small>':own?'<small>Tap to bring aboard</small>':''}</button>`;}).join('')}</div></div>`).join('')}</div>`;};

/* ============================== HELP & TOUR ============================== */
SCREENS.help=()=>`<div class="pad"><div class="card hero"><h2>How Hundred Cannons works</h2><p class="muted" style="margin:6px 0 0">The short version: send a personalised DM, tap DM sent. Together you aim for 100 a day. Everything else (levels, pets, ships, battles) grows out of that.</p><button class="btn primary" style="margin-top:10px" data-act="tour">Play the 30-second tour</button></div>
  ${HELP.map(([h,b])=>`<details class="card help" ${S.view.helpOpen===h?'open':''}><summary><b>${esc(h)}</b></summary><p>${esc(b)}</p></details>`).join('')}</div>`;
const TOUR=[['Welcome aboard','Hundred Cannons turns Instagram outreach into a pirate game for Sam and James. Every real DM you send, you log here with one tap. Gary the gull will be supervising. Badly.','b_d'],['The DM button','Tap it right after sending each personalised DM. It reloads for 5 seconds, so it can\'t be spammed. Space bar works too.','b_d'],['Bigger moments','Response, Video, Meeting and Client sit above it. Meetings and clients need the prospect\'s name and the other captain\'s confirmation.','b_c'],['Your crew target','Together you aim for 100 DMs a day. Each DM fires at today\'s sea monster on the Harbour. Tap anything in the scene to learn what it is.','tabs'],['Grow your ship','Earn XP and doubloons, unlock cosmetics, collect daily pets and Lock In for focused voyages. The Help page in More explains everything.','tabs']];
function runTour(i=0){const s=TOUR[i];if(!s){try{localStorage.setItem('hl_tour_v4','1')}catch(e){}closeModal();return;}
  document.querySelectorAll('.tourGlow').forEach(e=>e.classList.remove('tourGlow'));const el=document.getElementById(s[2]);if(el)el.classList.add('tourGlow');
  _openModal(`<div class="tour"><span class="pill">${i+1} of ${TOUR.length}</span><h2>${esc(s[0])}</h2><p>${esc(s[1])}</p><div class="row"><button class="btn primary" data-act="tourNext" data-i="${i+1}">${i===TOUR.length-1?'Set sail':'Next'}</button><button class="btn ghost" data-act="tourNext" data-i="99">Skip</button></div></div>`);SND.tab();}

/* ============================== LOCK IN (voyage) ============================== */
SCREENS.lockin=()=>{
  const pl=S.players[S.me]||{};const lk=pl.lock;const me=G.players[S.me];let main;
  if(lk&&lk.s){const el=lockElapsed(lk);const dms=myDmSince(S.me,lk.s);const mins=el/60000;const vb=voyageBoss(lk);const left=Math.max(0,vb.hp-dms);
    main=`<canvas id="scene" class="scene" width="960" height="540" aria-label="Your voyage"></canvas>
    <div class="pad"><div class="card"><div class="row between"><span class="pill">${lk.mode==='coop'?'Crew trip':isFish(lk.mode)?'Fishing trip':esc(vb.name)}</span><button class="btn sm" data-act="focusOn">Full screen</button></div><div class="timer" id="lockTimer">${clockStr(lk.dur-el)}</div><p class="muted" style="text-align:center;margin:4px 0 10px">${lk.pausedAt?'Paused':isFish(lk.mode)?'Anchor down, line out. Every DM you log is a cast.':'Every DM fires a cannon and fills your treasure chest. Aim for the face.'}</p>
    ${lk.mode==='coop'?coopCardHtml(lk):''}${!isFish(lk.mode)&&lk.hv===2?huntCardHtml(lk):isFish(lk.mode)?(()=>{const tr=fishCatches(S.me).list.filter(x=>x.t>=lk.s);return `<div class="vboss"><small>Fishing trip · every DM is a cast</small><b>${tr.length} fish landed this trip</b><div class="tripFish">${tr.slice(-12).reverse().map(x=>`<canvas class="fishIco" width="72" height="72" data-f="${x.f.id}" title="${esc(x.f.name)}"></canvas>`).join('')}</div></div>`;})():`<div class="vboss"><small>${esc(vb.desc)}</small>${left?`<div class="hp"><i class="s" style="width:${100-left/vb.hp*100}%"></i><i class="x" style="flex:1"></i><span>${left} / ${vb.hp} HP</span></div>`:`<b class="done">Defeated! +${vb.xp} XP and ${vb.g} doubloons when you land.</b>`}</div>`}
    <div class="grid3" style="margin-top:10px"><div class="stat"><b class="num">${dms}</b><small>DMs this voyage</small></div><div class="stat"><b class="num" id="lockPace">${mins>0.5?Math.round(dms/mins*60):'—'}</b><small>pace per hour</small></div><div class="stat"><b class="num">${dms*3}</b><small>chest doubloons</small></div><div class="stat"><b class="num">${me.m.bestSession}</b><small>best voyage</small></div></div>
    ${bar(el,lk.dur)}
    <div class="row" style="margin-top:12px;justify-content:center">${lk.pausedAt?`<button class="btn primary" data-act="lockResume">Resume</button>`:`<button class="btn" data-act="lockPause">Pause</button>`}<button class="btn ghost" data-act="lockFinish">Drop anchor early</button><button class="btn ghost" data-act="lockCancel">Abandon</button></div></div></div>`;}
  else{const coop=S.view.lockMode==='coop',fishing=S.view.lockMode==='fish'||coop;const tier=voyageTier(S.view.lockDur||25);const diff=tier.mon.some(m=>m[0]===S.view.lockDiff)?S.view.lockDiff:tier.mon[1][0];main=`<div class="pad"><div class="card hero"><h2>Lock In voyage</h2><p class="muted" style="margin:4px 0 10px">Set sail into open water. Every DM fires at the monster hunting you and adds 3 doubloons to your chest. Reach Treasure Island when the timer ends. Tap bottles and chests that float past.</p>
    <div class="seg modeSeg"><button class="${fishing?'':'on'}" data-act="lockMode" data-m="hunt">⚔️ Hunt</button><button class="${fishing&&!coop?'on':''}" data-act="lockMode" data-m="fish">🎣 Fishing</button><button class="${coop?'on':''}" data-act="lockMode" data-m="coop">🤝 Crew trip</button></div>
    <small>Voyage length</small><div class="seg" style="margin-top:4px">${VOYAGE_TIERS.map(T=>`<button class="${tier.id===T.id?'on':''}" data-act="lockDur" data-m="${T.m}">${T.m} min</button>`).join('')}</div>
    ${coop?coopPanelHtml(tier):fishing?fishPanelHtml(tier):`<div class="tierHead"><b>${esc(tier.name)}</b><small>${esc(tier.blurb)} Monsters come in waves: sink one and the next arrives, a little tougher. Every 4th wave is an Elite worth double. Each kill drops a part for your Bestiary. Pick who you face first.</small></div>
    <div class="diffs">${tier.mon.map(([k])=>{const d=VOYAGE_DIFF[k];return `<button class="diff ${diff===k?'on':''}" data-act="lockDiff" data-d="${k}"><canvas class="monIco" width="120" height="120" data-mon="${k}"></canvas><span class="dTxt"><span class="dLvl">${'●'.repeat(d.lvl)}${'○'.repeat(4-d.lvl)}</span><b>${esc(d.name)}</b><small>${esc(d.desc)}</small><small class="dStat">First wave ${monBase(k)} HP · +${Math.round(monBase(k)*3+VOYAGE_TIERS.indexOf(tier)*15)} XP a kill</small></span></button>`;}).join('')}</div>`}
    <div class="row" style="margin-top:12px"><label class="f" for="lockCustom">Custom minutes<input id="lockCustom" type="number" min="5" max="180" placeholder="e.g. 35" style="width:110px"></label><button class="btn primary" data-act="lockStart" style="margin-left:auto;align-self:end">${coop?'Set sail and call the crew':'Set sail'}</button></div></div>
    <div class="grid3"><div class="stat"><b class="num">${me.m.sessions}</b><small>voyages</small></div><div class="stat"><b class="num">${me.m.islands}</b><small>treasure islands</small></div><div class="stat"><b class="num">${me.m.vBoss}</b><small>monsters beaten</small></div></div>
    ${me.sessions.length?`<div class="card"><h3>Ship's log</h3><div class="list" style="margin-top:6px">${[...me.sessions].sort((a,b)=>b.s-a.s).slice(0,5).map(s=>`<div class="li"><span class="grow">${shortDate(s.date)} · ${Math.round(s.dur/60000)} min ${s.full?'· reached the island':''} ${s.beat?'· monster beaten':''}</span><b>${s.dms} DMs</b></div>`).join('')}</div></div>`:''}</div>`;}
  return main;
};
function focusHtml(){return `<div id="focus" role="dialog" aria-label="Full screen voyage"><canvas id="focusCv" class="scene" width="1280" height="720"></canvas>
  <div class="fTop"><span class="fTimer" id="fTimer">--:--</span><span class="fStat" id="fStat"></span><button class="fExit" data-act="focusOff" aria-label="Exit full screen">✕</button></div>
  <button class="fDm" id="fDm" aria-label="DM sent"><span class="dmIcon"><svg class="mk"><use href="#funnal"/></svg><svg class="ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="track"/><circle cx="50" cy="50" r="44" class="prog" id="fRing"/></svg></span><b>DM sent</b><small>click or press space</small></button></div>`;}
function focusOn(){if(S.focus)return;S.focus=true;document.body.insertAdjacentHTML('beforeend',focusHtml());$('#fDm').addEventListener('click',()=>logAction('d',$('#fDm')));const f=$('#focus');try{f.requestFullscreen?.().catch(()=>{});}catch(e){}SND.open();}
function focusOff(){if(!S.focus)return;S.focus=false;try{if(document.fullscreenElement)document.exitFullscreen();}catch(e){}$('#focus')?.remove();SND.close();}
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&S.focus){/* keep overlay; user pressed Esc to leave OS full screen */}});

Object.assign(ACT,{
  help(d){S.view.helpOpen=d.h;location.hash='#help';},
  tour(){runTour(0);},tourNext(d){runTour(+d.i);},
  crewToggle(){S.view.crewHide=!S.view.crewHide;try{localStorage.setItem('hl_crewHide',S.view.crewHide?'1':'0')}catch(e){}render();},
  async claimPet(d){const key='pet_'+G.today;if(G.players[S.me].claimed.has(key))return;const pet=PET_BY_ID[d.pet];try{await writeDay(S.me,G.today,{bonus:{[key]:{pet:d.pet,xp:{common:40,uncommon:60,rare:90,epic:140,legendary:220,mythic:400}[pet.rar],g:{common:10,uncommon:15,rare:25,epic:40,legendary:70,mythic:150}[pet.rar],ts:Date.now()}}});
    SND.chest();openModal(`<div class="reveal r-${pet.rar}"><canvas class="petIco big" data-pet="${pet.id}" data-sil="0"></canvas><span class="rtag">${pet.rar} pet</span><h2>${esc(pet.name)}</h2><p class="muted">It followed you home. You're legally its parent now. Bring it aboard from Ship or Pets.</p><div class="row" style="justify-content:center"><button class="btn primary" data-act="equipPet" data-pet="${pet.id}">Bring aboard</button><button class="btn ghost" data-act="closeModal">Later</button></div></div>`);
    paintPets();if(['legendary','mythic','epic'].includes(pet.rar))fireworks(2600);}catch(e){writeFail(e);}},
  async equipPet(d){closeModal();const cur=(S.players[S.me]||{}).pet;try{await writePlayer(S.me,{pet:cur===d.pet?null:d.pet});SND.pop();}catch(e){writeFail(e);}},
  lockDiff(d){S.view.lockDiff=d.d;render();},
  focusOn(){focusOn();},focusOff(){focusOff();},
  async claimHandle(){const v=($('#handleIn')?.value||'').trim().replace(/[^A-Za-z0-9 _.'-]/g,'').slice(0,20);if(v.length<2)return toast('<b>Pick a handle</b> of 2 to 20 letters or numbers.','joke');if(S.players[S.me]?.handle)return;
    openModal(`<h2>Claim "${esc(v)}"?</h2><p>Handles can only be claimed once and can't be changed afterwards. Both captains may pick the same one.</p><div class="row"><button class="btn primary" data-act="doHandle" data-v="${esc(v)}">Claim it</button><button class="btn ghost" data-act="closeModal">Think again</button></div>`);},
  async doHandle(d){closeModal();try{await writePlayer(S.me,{handle:d.v,handleAt:Date.now()});SND.unlock();toast(`<b>Ahoy, ${esc(d.v)}!</b> The name is set in stone. Well, in a database.`);}catch(e){writeFail(e);}},
});
function paintPets(root=document){root.querySelectorAll('canvas.petIco').forEach(cv=>drawPetIcon(cv,PET_BY_ID[cv.dataset.pet],cv.dataset.sil==='1'));}
