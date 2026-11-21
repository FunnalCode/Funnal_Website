/* ============================== RENDER LOOP ============================== */
let renderQueued=false;
function refresh(force){if(force){G=derive();afterDerive();render();return;}if(renderQueued)return;renderQueued=true;requestAnimationFrame(()=>{renderQueued=false;G=derive();afterDerive();render();});}
function render(){
  if(!G)return;hud();
  const ae=document.activeElement;const typing=ae&&$('#screen').contains(ae)&&/INPUT|SELECT|TEXTAREA/.test(ae.tagName)&&ae.type!=='checkbox';
  if(typing&&S.lastScreen===S.screen)return;
  const fn=SCREENS[S.screen]||SCREENS.harbour;const sc=$('#screen');sc.innerHTML=fn();S.lastScreen=S.screen;
  if(S.screen==='book'){const sel=$('#bookFilter');if(sel)sel.value=S.view.book;}
  sc.querySelectorAll('canvas.icon').forEach(cv=>drawItemIcon(cv,cv.dataset.id));paintPets(sc);
  sc.querySelectorAll('canvas.collect').forEach(cv=>drawCollectIcon(cv,COLLECTIBLES.find(x=>x.id===cv.dataset.c),cv.dataset.f==='1'));
  const gi=$('#gullIco');if(gi)drawGullIcon(gi);
  document.querySelectorAll('#tabs a').forEach(a=>a.classList.toggle('on',a.dataset.s===S.screen||(a.dataset.s==='more'&&['book','rivals','herald','ledger','settings','log','pets','help','trophy','bestiary','hall','review','tavern','nest','market','vault'].includes(S.screen))));
}
function hud(){
  const me=S.me&&G.players[S.me];if(!me)return;
  $('#whoName').textContent=C().players[S.me]?.name||S.me;$('#whoName').style.color=pcol(S.me);
  const tf=activeForfeitsFor(S.me).find(f=>f.result==='title');$('#whoTitle').textContent=(me.prest?'★'.repeat(Math.min(me.prest,5))+' ':'')+(tf?'Professional Napper':me.dist?distTitle(me.dist):titleFor(me.li.level));
  $('#lvlNum').textContent=me.li.level>=100?'100'+(me.dist?' ✦'+me.dist:''):me.li.level;$('#xpFill').style.width=me.li.need?(me.li.into/me.li.need*100)+'%':(me.distInto/DIST_XP*100)+'%';$('#xpTxt').textContent=me.li.need?`${fmtN(me.li.into)} / ${fmtN(me.li.need)} XP`:`${fmtN(me.distInto)} / ${fmtN(DIST_XP)} to Distinction ${roman((me.dist||0)+1)}`;
  $('#glowNum').textContent=fmtN(me.balance);$('#myToday').textContent=G.days[G.today].p[S.me][S.fuMode?'f':'d']||0;
  const av=$('#whoAv');const key=S.me+JSON.stringify([S.players[S.me]?.hat,S.players[S.me]?.coat,activeForfeitsFor(S.me).length]);if(av.dataset.k!==key){av.dataset.k=key;av.style.backgroundImage=`url(${avatarCanvas(S.me)})`;}
  av.style.boxShadow=`0 0 0 3px ${pcolHex(S.me)}`;
}
function afterDerive(){
  if(!G||!S.me)return;if(!(S.loaded.config&&S.loaded.days&&S.loaded.players)){S.lastG=null;return;}const me=G.players[S.me];const prev=S.lastG;const D=G.days[G.today];
  // record achievement unlock dates for me (write once)
  const rec=(S.players[S.me]||{}).ach||{};const fresh=Object.keys(me.unlocked).filter(id=>!rec[id]&&!(S.achWritten||{})[id]);
  if(fresh.length&&S.loaded.players&&S.loaded.days&&!S.readOnly){S.achWritten=S.achWritten||{};const patch={};const now=Date.now();fresh.forEach(id=>{patch[id]=now;S.achWritten[id]=1;});writePlayer(S.me,{ach:patch}).catch(writeFail);
    if(!S.firstDerive){const sorted=fresh.map(id=>ACH_BY_ID[id]).sort((a,b)=>RARITIES.indexOf(b.rar)-RARITIES.indexOf(a.rar));sorted.slice(0,3).forEach(a=>toast(`<span class="rtag r-${a.rar}" style="color:var(--rc)">${a.rar} achievement</span><br><b>${esc(a.name)}</b> <small>+${RARITY_GLOW[a.rar]} ${CN} · ${pick(ACH_QUIPS,a.id)}</small>`,'',4200));SFX.ach();
      const big=sorted.find(a=>RARITIES.indexOf(a.rar)>=3);if(big){banner(big.name.toUpperCase(),`${big.rar[0].toUpperCase()+big.rar.slice(1)} achievement unlocked`);fireworks(2200);}}}
  if(prev&&!S.firstDerive){
    const pm=prev.players[S.me];if(me.li.level>pm.li.level&&me.prest===pm.prest){banner(`LEVEL ${me.li.level}`,`${titleFor(me.li.level)} · ${pick(LEVEL_QUIPS,me.li.level)}`);SFX.lvl();const unl=ITEMS.filter(i=>i.lvl>pm.li.level&&i.lvl<=me.li.level);if(unl.length)toast(`<b>New in the shop:</b> ${unl.map(i=>esc(i.name)).join(', ')}`,'',4500);}
    const newTrack=TRACK.filter(i=>i.track>pm.maxLevel&&i.track<=me.maxLevel);if(newTrack.length){setTimeout(()=>{banner('REWARD UNLOCKED',newTrack.map(i=>i.name).join(', '));fireworks(1800);},2800);}
    ['m','c'].forEach(k=>{if(me.counts[k]>pm.counts[k]){const btn=$('#b_'+k);if(btn)celebrate(k,btn);toast(`<b>${pname(other(S.me))} confirmed your ${k==='c'?'client':'meeting'}!</b> +${fmtN(KINDS[k].xp)} XP each`,'',4000);}});
    if(me.moth>pm.moth)toast(`<b>Your companion evolved!</b> It's now a ${esc(MOTH_STAGES[me.moth].name)}.`,'',4500);
    const nl=Object.keys(me.loot).filter(k=>!pm.loot[k]);nl.forEach(k=>{const c=COLLECTIBLES.find(x=>x.id===k);toast(`<b>Loot!</b> You found a ${esc(c.rar)} ${esc(c.name)}.`,'',3800);});
    const pD=prev.days[G.today];
    if(pD&&D.target){if(!pD.hit&&D.hit){banner('FOG DEFEATED',`${D.boss.name} is gone. Final blow: ${C().players[D.blow]?.name}`);fireworks(3000);SFX.c();}
      [125,150,200].forEach(m=>{if(pD.team<m&&D.team>=m&&D.hit)toast(`<b>Stretch goal ${m} reached!</b> Bonus XP and doubloons for both captains.`,'',3500);});
      const ph=r=>r<=.25?3:r<=.5?2:r<=.75?1:0;const a=ph((pD.target-pD.team)/pD.target),b=ph((D.target-D.team)/D.target);if(b>a&&!D.hit&&S.screen==='harbour')toast(`<b>${esc(D.boss.name)}:</b> "${esc(phaseLine(D.boss,(D.target-D.team)/D.target,false))}"`,'',3800);
      if(D.over.length>pD.over.length){const o=D.over[D.over.length-1];toast(`<b>Lead change!</b> ${pname(o.who)} overtakes ${pname(other(o.who))}.`,'',3000);}}
    const o=other(S.me);if(o&&G.players[o]&&prev.players[o]){const dd=G.players[o].counts.d-prev.players[o].counts.d;for(let i=0;i<Math.min(dd,3);i++)launchLantern(o);
      ['r','v','m','c'].forEach(k=>{if(G.players[o].counts[k]>prev.players[o].counts[k]){toast(`<b>${pname(o)}</b> logged: ${esc(KINDS[k].name)}!${SHARED_K[k]?` You get +${fmtN(KINDS[k].xp)} XP and +${fmtN(KINDS[k].g)} ${CN} too.`:''}`,'',3600);if(k==='c'){banner('NEW CLIENT!',`${C().players[o]?.name} landed one`);fireworks(3000);}}});}
    {const T=L(),gt=goldenFor(G.today);const ws=isWork(G.today)&&T.min>=gt.start&&T.min<gt.end;if(ws&&!S.goldenShown){S.goldenShown=G.today;banner('GOLDEN TIDE','25 minutes of double XP and doubloons');SND.horn();}if(!ws)S.goldenShown=null;}
    {const sg=sightingFor(G.today);const ss=sightingState(S.me,sg);if(ss&&ss.phase==='live'&&S.sightShown!==G.today){S.sightShown=G.today;banner(ss.pet.rar.toUpperCase()+' PET SPOTTED',`${ss.pet.name}: log ${ss.need} DMs in ${ss.win} minutes`);SND.horn();}
     if(ss&&ss.phase==='live'&&!ss.claimed&&ss.ok&&S.sightOk!==G.today){S.sightOk=G.today;toast(`<b>You've done it!</b> Claim your ${esc(ss.pet.name)} on the Harbour.`,'',6000);SND.unlock();}}
    {const pD=prev.days[G.today];if(pD&&emGrade(D.p[S.me]?.d||0)>emGrade(pD.p[S.me]?.d||0)){const g=emGrade(D.p[S.me]?.d||0);banner('EMISSARY '+EMISSARY[g].name.toUpperCase(),`DMs now worth ×${EMISSARY[g].mult}`);SND.unlock();}}
    G.pendingConf.filter(e=>e.pid!==S.me&&!prev.pendingConf.some(x=>x.id===e.id)).forEach(e=>{toast(`<b>${pname(e.pid)} logged a ${e.k==='c'?'new client':'meeting'}!</b> Confirm it on the Harbour and you both get paid.`,'',6000);tone(660,.1,'triangle',.05);});
    G.chals.forEach(ch=>{const p0=prev.chals.find(x=>x.id===ch.id);if(!p0&&ch.state==='pending'&&ch.c.by!==S.me)toast(`<b>${pname(ch.c.by)} challenges you!</b> Open Lock In to accept.`,'',6000);});
    G.chals.forEach(ch=>{const p=prev.chals.find(x=>x.id===ch.id);if(p&&p.state!==ch.state){if(ch.state==='live'){banner('GO!','Challenge started');tone(880,.2);}if(ch.state==='done'){const w=G.P.find(x=>ch.won[x]);banner(ch.coop?(ch.won[G.P[0]]?'CHALLENGE WON':'SO CLOSE'):(w?`${(C().players[w]?.name||'').toUpperCase()} WINS`:'DRAW'),`${G.P.map(x=>ch.cnt[x]).join(' – ')}`);}}
      if(false)toast(`<b>${pname(ch.c.by)} challenges you!</b> Open Lock In to accept.`,'',6000);});
  }
  if(S.firstDerive){let seen=null;try{seen=localStorage.getItem('hl_tour_v4')}catch(e){}if(!seen&&$('#modal').hidden)setTimeout(()=>runTour(0),900);}
  S.lastG=G;S.firstDerive=false;
}
function tick(){
  if(!G)return;const now=Date.now();
  // cooldown ring
  const btn=$('#b_d'),ring=$('#cdRing');const cd=C().cooldownSec*1000;const left=S.cdUntil-now;
  if(left>0){btn.classList.add('cooling');ring.style.strokeDashoffset=String(277*(1-left/Math.max(cd,S.cdUntil-S.cdStart)));$('#dmSub').textContent=`${S.quip||'reloading'} · ${Math.ceil(left/1000)}s`;}
  else if(btn.classList.contains('cooling')){btn.classList.remove('cooling');ring.style.strokeDashoffset='277';$('#dmSub').textContent=DM_SUB;tone(1320,.05,'triangle',.03);}
  const fr=$('#fRing');if(fr){fr.style.strokeDashoffset=left>0?String(277*(1-left/Math.max(cd,S.cdUntil-S.cdStart))):'277';$('#fDm').classList.toggle('cooling',left>0);}
  if(S.focus)focusTick();
  const tl=$('#timeLeft');if(tl)tl.textContent=timeLeftStr();
  document.querySelectorAll('.cdn').forEach(el=>{const t=+el.dataset.t;el.textContent=t-now>60000?clockStr(t-now):Math.max(0,Math.ceil((t-now)/1000))+'s';});
  const lk=S.players[S.me]?.lock;if(lk&&lk.s){const el=lockElapsed(lk);const lt=$('#lockTimer');if(lt)lt.textContent=clockStr(lk.dur-el);if(el>=lk.dur&&!S.finishing)finishLock(false);}
  // re-derive when day rolls over or challenge state changes
  const T=L(now);if(T.date!==G.today||G.chals.some(c=>(c.state==='countdown'&&now>=c.start)||(c.state==='live'&&(now>=c.end||(c.next&&now>=c.next)))))refresh();
  // final warning
  const cfg=C();if(isWork(T.date)&&T.min===hm(cfg.finalWarning)&&S.warned!==T.date){S.warned=T.date;const D=G.days[G.today];if(D.target&&!D.hit){toast(`<b>Final warning!</b> ${D.target-D.team} DMs to go. ${esc(pick(REMINDERS.deadline,T.date))}`.replace('{left}',D.target-D.team).replace('{mins}',hm(cfg.dayEnd)-T.min),'joke',9000);tone(220,.3,'sawtooth',.05);}}
}
let lastFrame=0;
// 21 Nov: full screen draws at the phone's real sharpness (up to 3x), and sharper still when pinch-zoomed, within a pixel budget
function focusDpr(){const z=(window.visualViewport&&visualViewport.scale)||1;let d=(devicePixelRatio||1)*Math.max(1,Math.round(z*4)/4);d=Math.min(d,6);const cap=/iPhone|iPad|Android/.test(navigator.userAgent)?10e6:14e6;const px=innerWidth*innerHeight*d*d;if(px>cap)d*=Math.sqrt(cap/px);return d;}
function frame(t){requestAnimationFrame(frame);if(t-lastFrame<40)return;lastFrame=t;if(!G)return;S.hits=[];
  if(S.focus){const fc=$('#focusCv');const lk=S.players[S.me]?.lock;if(fc){const dpr=focusDpr();const w=Math.round(innerWidth*dpr),h=Math.round(innerHeight*dpr);if(fc.width!==w||fc.height!==h){fc.width=w;fc.height=h;}
    const c=fc.getContext('2d');const s=Math.min(Math.max(w/W,h/H),w/(W-4),h/(H-8));const ox=(w-W*s)/2;const port=h>w*1.05;const oy=port?Math.max(0,Math.min(h-H*s,h*.46-96*s)):(h-H*s)/2;VIEW_EXT.top=Math.max(0,oy/s);VIEW_EXT.bot=Math.max(0,(h-oy)/s-H);VIEW_EXT.side=Math.max(0,ox/s);const hz=Math.round(oy+104*s);c.setTransform(1,0,0,1,0,0);c.fillStyle=SKY_TOP;c.fillRect(0,0,w,hz);c.fillStyle=SEA_BOT;c.fillRect(0,hz,w,h-hz);
    c.setTransform(s,0,0,s,ox,oy);try{drawFocusScene(c,t,lk);}catch(e){console.error(e);}S.focusXf={s,ox,oy,dpr};}return;}
  VIEW_EXT.top=VIEW_EXT.bot=VIEW_EXT.side=0;const cv=$('#scene');if(!cv)return;const c=prep(cv);
  try{if(S.screen==='harbour')drawHarbour(c,t);else if(S.screen==='ship'){if((S.view.shipMode||'ship')==='ship')drawShipScene(c,t,S.view.islet||S.me);else drawIslet(c,t,S.view.islet||S.me);}else if(S.screen==='lockin'){const lk=S.players[S.me]?.lock;if(lk)drawVoyage(c,t,lk,myDmSince(S.me,lk.s),Math.min(1,lockElapsed(lk)/lk.dur));}}catch(e){console.error(e);}}

/* ============================== IDENTITY ============================== */
function askWho(){if(S.authPid){resolveMe();return;}
  const P=C().playerIds;
  openModal(`<h2>Who's keeping the lantern?</h2><p class="muted">${S.mode==='local'?'Practice mode: pick a keeper. You can switch in Settings.':'Choose your keeper. This links your account to them, so it can only be done once per keeper.'}</p>
  <div class="grid2">${P.map(p=>{const taken=S.mode!=='local'&&S.players[p]?.uid&&S.players[p].uid!==S.uid;return `<button class="btn ${taken?'':'primary'}" data-act="claimKeeper" data-p="${p}" ${taken?'disabled':''} style="padding:16px;font-size:18px">${pname(p)}${taken?'<br><small>taken</small>':''}</button>`;}).join('')}</div>`);
}
async function claimKeeper(p){
  if(S.mode==='local'){S.me=p;closeModal();refresh(true);return;}
  try{const ref=S.db.doc('players/'+p);const lease=await ref.acquire({holder:S.uid,ttlMs:5000});if(!lease.acquired)return toast('Someone is claiming that keeper right now. Try again in a few seconds.','joke');
    const s=await ref.get();const d=s.exists?s.data():null;if(d&&d.uid&&d.uid!==S.uid){toast('That keeper is already taken.','joke');return askWho();}
    if(s.exists)await ref.update({uid:S.uid});else await ref.set({pid:p,uid:S.uid,decor:[],ach:{}});S.me=p;closeModal();refresh(true);banner(`WELCOME ABOARD, ${(C().players[p]?.name||p).toUpperCase()}`,'Your ship is ready');
  }catch(e){writeFail(e);}
}
function resolveMe(){
  if(!S.authPid)return;
  if(S.mode==='local'||S.mode==='supa'){S.me=S.authPid;return;}
  if(!S.loaded.players)return;
  const pl=S.players[S.authPid]||{};
  if(pl.uid&&pl.uid===S.uid){if(S.me!==S.authPid){S.me=S.authPid;refresh();}return;}
  if(!pl.uid){if(!S.claiming){S.claiming=true;claimKeeper(S.authPid).finally(()=>{S.claiming=false;});}return;}
  S.me=null;if($('#modal').hidden)openModal(`<h2>Captain ${pname(S.authPid)} is linked to another account</h2><p>Each captain is tied to one Claude account. If that's you on a different account, ask the game owner to release this captain in Settings, then reload.</p><button class="btn" data-act="logout">Use a different captain</button>`);
}
/* ============================== BOOT ============================== */
function route(){let h=(location.hash||'#harbour').slice(1);if(h==='islet')h='ship';S.screen=SCREENS[h]?h:'harbour';closeModal();refresh(true);$('#screen').scrollTop=0;}
function bindUI(){
  document.querySelectorAll('.act,.dm').forEach(b=>b.addEventListener('click',()=>logAction(b.dataset.k,b)));fuBind();
  $('#undo').addEventListener('click',undo);
  $('#who').addEventListener('click',()=>{location.hash='#ship';});
  $('#glowBox').addEventListener('click',()=>{location.hash='#shop';});
  document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.tagName==='SELECT')return;if(el.tagName==='INPUT'&&el.type==='checkbox'){ACT[el.dataset.act]?.(el.dataset,el);return;}const fn=ACT[el.dataset.act];if(fn){e.preventDefault();fn(el.dataset,el);}});
  document.addEventListener('change',e=>{const el=e.target;if(el.id==='bookFilter'){S.view.book=el.value;el.blur();render();}});
  $('#modal').addEventListener('click',e=>{if(e.target.id==='modal'&&!WHEEL.spinning&&S.me)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modal').hidden&&S.me)closeModal();if(S.focus&&(e.key===' '||e.code==='Space')){e.preventDefault();logAction('d',$('#fDm'));return;}if(e.key==='Escape'&&S.focus){focusOff();return;}if((e.key===' '||e.key==='Enter')&&e.target===document.body){e.preventDefault();logAction('d',$('#b_d'));}});
  window.addEventListener('hashchange',()=>{SND.tab();const tp=$('#tip');if(tp)tp.hidden=true;route();});
  document.addEventListener('pointerdown',e=>{const el=e.target.closest('button,a,.chip,summary');if(!el||el.closest('#actions')||el.id==='fDm'||el.id==='holdBtn')return;SND.pop();el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');},true);
  if(matchMedia('(hover:hover)').matches)document.addEventListener('pointerover',e=>{const el=e.target.closest('button,a,.chip,summary');if(el&&el!==S.hoverEl){S.hoverEl=el;SND.tick();}});
  setupTips();try{S.view.crewHide=localStorage.getItem('hl_crewHide')==='1';}catch(e){}
  $('#mute').addEventListener('click',()=>{S.sound=!S.sound;try{localStorage.setItem('hl_sound',S.sound?'1':'0')}catch(e){}$('#mute').classList.toggle('off',!S.sound);if(S.sound)SND.pop();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
}
function subscribe(){
  const db=S.db;let timer=setTimeout(()=>{const s=$('#sync');s.hidden=false;s.textContent='Still connecting to Funnal Cove… numbers may be out of date.';},10000);
  const ok=()=>{if(S.loaded.config&&S.loaded.days&&S.loaded.players){clearTimeout(timer);$('#sync').hidden=true;}};
  const err=e=>{console.warn(e);const s=$('#sync');s.hidden=false;s.textContent=e&&e.code==='revoked'?'Access to this game changed. Reload to continue.':'Lost the connection to Funnal Cove. Your recent taps may not have saved.';};
  db.doc('config/main').onSnapshot(s=>{S.config=s.exists?s.data():null;S.loaded.config=true;ok();resolveMe();refresh();},err);
  db.collection('days').onSnapshot(s=>{const m={};s.docs.forEach(d=>{if(d.exists)m[d.id]=d.data();});S.days=m;if(!s.metadata?.fromCache)S.loaded.days=true;ok();refresh();},err);
  db.collection('players').onSnapshot(s=>{const m={};s.docs.forEach(d=>{if(d.exists)m[d.id]=d.data();});S.players=m;S.loaded.players=true;ok();resolveMe();refresh();},err);
  db.collection('challenges').onSnapshot(s=>{const m={};s.docs.forEach(d=>{if(d.exists)m[d.id]=d.data();});S.challenges=m;refresh();},err);
  db.collection('sightings').onSnapshot(s=>{const m={};s.docs.forEach(d=>{if(d.exists)m[d.id]=d.data();});S.sightings=m;refresh();},err);
  db.collection('forfeits').onSnapshot(s=>{const m={};s.docs.forEach(d=>{if(d.exists)m[d.id]={id:d.id,...d.data()};});S.forfeits=m;refresh();},err);
}
async function boot(){
  try{themeBoot();}catch(e){console.warn(e);}
  try{S.sound=localStorage.getItem('hl_sound')!=='0';}catch(e){}$('#mute').classList.toggle('off',!S.sound);
  bindUI();S.screen=(location.hash||'#harbour').slice(1);if(S.screen==='islet')S.screen='ship';if(!SCREENS[S.screen])S.screen='harbour';
  let db=null,user=null;
  if(window.HL_SUPABASE&&window.supabase){S.mode='supa';const sb=window.supabase.createClient(window.HL_SUPABASE.url,window.HL_SUPABASE.key,{auth:{persistSession:true,storageKey:'hl-auth'}});S.sb=sb;
    const a=await supaGate(sb);S.authPid=a.pid;S.uid=a.uid;S.me=a.pid;S.isOwner=a.pid==='sam';S.db=makeSupaDB(sb);
    subscribe();setInterval(tick,250);requestAnimationFrame(frame);return;}
  try{if(window.claude&&typeof window.claude.use==='function'){[db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);}}catch(e){db=null;}
  if(db&&user){S.mode='shared';S.db=db;S.user=user;try{S.uid=await user.id();}catch(e){}try{S.isOwner=!!user.isOwner();}catch(e){S.isOwner=false;}
    try{const can=await user.can?.('data.write');if(can===false)S.readOnly=true;}catch(e){}
    if(!S.uid){S.mode='local';S.db=makeLocalDB();S.isOwner=true;}}
  else{S.mode='local';S.db=makeLocalDB();S.isOwner=true;}
  if(S.mode==='local'){const s=$('#sync');s.hidden=false;s.textContent='Practice mode: progress saves in this browser only.';setTimeout(()=>{s.hidden=true;},5000);}
  S.authPid=await gate();if(S.mode==='local')S.me=S.authPid;
  subscribe();setInterval(tick,250);requestAnimationFrame(frame);
}
boot();
