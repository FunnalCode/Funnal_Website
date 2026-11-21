/* ============================== v15: raids, Lock In groups, parrot, hideout tidy, clarity ============================== */
/* ---------- crew hunts become raids: one huge boss at a time, broadsides, phase rewards ---------- */
const BROADSIDE_MS=10000;
crewSegsFor=function(cid){const segs=[];coopPlayers().forEach(p=>{const ses=(COOP_SES&&COOP_SES[p])||G?.players[p]?.sessions||[];ses.forEach(x=>{if(x.mode==='crewhunt'&&x.cid===cid)segs.push({p,s:x.s,e:x.e||x.s+(x.dur||0),diff:x.diff,cdur:x.cdur});});
  const lk=S.players[p]?.lock;if(lk&&lk.mode==='crewhunt'&&lk.cid===cid)segs.push({p,s:lk.s,e:Infinity,diff:lk.diff,cdur:lk.cdur,live:1});});return segs.sort((a,b)=>a.s-b.s);};
function raidHp(cdurMin,k){return Math.round(Math.max(30,cdurMin*2.2)*(1+.5*k));}
function raidRun(sid,diff,dms,t0,cdurMin){const d=VOYAGE_DIFF[diff];if(!d||!d.tier)return{kills:[],phases:[],cur:null,crits:0,broadsides:0};const T=VOYAGE_TIERS.find(x=>x.id===d.tier);const mons=T.mon.map(m=>m[0]);const start=Math.max(0,mons.indexOf(diff));
  const boss=k=>{const mon=mons[(start+k)%mons.length];const hp=raidHp(cdurMin,k);return{n:k,mon,elite:true,raid:true,hp,xp:Math.round(hp*6),g:Math.round(hp*1.6)};};
  const kills=[],phases=[];let k=0,w=boss(0),dmg=0,crits=0,bs=0,last=null;const lastBy={};let broke=0;
  for(const e of dms){const crit=h32(e.id+'crit')%100<12;const mate=Object.keys(lastBy).find(p=>p!==e.pid);const broad=mate&&e.t-lastBy[mate]<=BROADSIDE_MS;lastBy[e.pid]=e.t;
    let hit=crit?3:1;if(broad){hit*=2;bs++;}if(crit)crits++;dmg+=hit;last={id:e.id,crit,broad,t:e.t,p:e.pid};
    while(broke<2&&dmg>=w.hp*(broke+1)/3&&dmg<w.hp){broke++;phases.push({n:w.n,mon:w.mon,phase:broke,t:e.t,xp:Math.round(w.xp*.2),g:Math.round(w.g*.2)});}
    while(dmg>=w.hp){dmg-=w.hp;const paid=broke*.2;const r=h32(String(h32(sid+'raid'+k))+'x')%100;kills.push({n:k,mon:w.mon,elite:true,raid:true,t:e.t,by:e.pid,xp:Math.round(w.xp*(1-paid)),g:Math.round(w.g*(1-paid)),drop:huntPart(w.mon,r<30?2:1)});k++;w=boss(k);broke=0;
      while(broke<2&&dmg>=w.hp*(broke+1)/3&&dmg<w.hp){broke++;phases.push({n:w.n,mon:w.mon,phase:broke,t:e.t,xp:Math.round(w.xp*.2),g:Math.round(w.g*.2)});}}}
  return{kills,phases,cur:{...w,dmg,left:w.hp-dmg,phase:broke},crits,broadsides:bs,last,crew:1};}
crewHunt=function(cid,evs){evs=evs||G?.evs||[];const segs=crewSegsFor(cid);if(!segs.length)return null;const k='r'+cid+'|'+evs.length+'|'+(evs.length?evs[evs.length-1].id:'')+'|'+segs.map(x=>x.p+x.s+':'+x.e).join();if(_chm.k===k)return _chm.v;
  const t0=segs[0].s;const dms=evs.filter(e=>e.k==='d'&&segs.some(x=>x.p===e.pid&&e.t>=x.s&&e.t<=x.e)).sort((a,b)=>a.t-b.t);const cd=(segs.find(x=>x.cdur)?.cdur||25*60000)/60000;
  const v={...raidRun(cid,segs[0].diff,dms,t0,cd),segs,dms};v.by={};dms.forEach(e=>v.by[e.pid]=(v.by[e.pid]||0)+1);_chm={k,v};return v;};
crewHuntPay=function(p,x,s,evs){const h=crewHunt(x.cid,evs);if(!h)return;const e=x.e||x.s+(x.dur||0);const inW=q=>q.t>=x.s&&q.t<=e;
  h.phases.filter(inW).forEach(q=>{s.dayXp+=q.xp;s.dayG+=q.g;});
  const mine=h.kills.filter(inW);mine.forEach(k=>{s.dayXp+=k.xp;s.dayG+=k.g;s.vBoss=(s.vBoss||0)+1;(s.vk=s.vk||{})[k.mon]=(s.vk[k.mon]||0)+1;(s.drops=s.drops||{})[k.drop.id]=(s.drops[k.drop.id]||0)+1;});s.raids=(s.raids||0)+mine.length;};
function raidCardHtml(lk){const h=crewHunt(lk.cid);if(!h||!h.cur)return '';const w=h.cur,vd=VOYAGE_DIFF[w.mon];const banked=h.kills.reduce((a,k)=>a+k.xp,0)+h.phases.reduce((a,k)=>a+k.xp,0),bg=h.kills.reduce((a,k)=>a+k.g,0)+h.phases.reduce((a,k)=>a+k.g,0);
  const broadNow=h.last&&h.last.broad&&Date.now()-h.last.t<4000;
  return `<div class="vboss raidCard"><small>Raid boss ${w.n+1} · ${esc(vd.name)}</small><div class="raidPh">${[0,1,2].map(i=>`<i class="${i<w.phase?'on':''}"></i>`).join('')}<span>Phase ${w.phase+1} of 3</span></div>
   <div class="hp"><i class="s" style="width:${100-w.left/w.hp*100}%"></i><i class="x" style="flex:1"></i><span>${w.left} / ${w.hp} HP</span></div>
   <small>${broadNow?'<b class="broad">BROADSIDE! Double damage.</b> ':''}Fire within 10 seconds of each other for a <b>broadside</b> (double damage). ${h.broadsides} so far.</small>
   <small>${h.kills.length?`${h.kills.length} raid boss${h.kills.length>1?'es':''} sunk. `:''}Banked so far: +${fmtN(banked)} XP and ${fmtN(bg)} ${CN} each. Every phase you break pays out, even if the boss survives.</small></div>`;}
const _hc15=huntCardHtml;huntCardHtml=function(lk){return lk&&lk.mode==='crewhunt'?raidCardHtml(lk):_hc15(lk);};
// phase-break toasts
let _raidSeen={};setInterval(()=>{try{const lk=S.players[S.me]?.lock;if(!lk||lk.mode!=='crewhunt'||!G)return;const h=crewHunt(lk.cid);if(!h)return;const n=h.phases.length,b=h.broadsides;const s=_raidSeen[lk.cid];_raidSeen[lk.cid]={n,b};if(!s)return;
  if(n>s.n){const q=h.phases[n-1];toast(`<b>Phase ${q.phase} broken!</b> +${q.xp} XP, +${q.g} ${CN} each. The ${esc(VOYAGE_DIFF[q.mon].name)} is getting angry.`,'level',3200);try{SND.chest();}catch(e){}}
  else if(b>s.b&&h.last?.broad){try{tone(180,.18,'sawtooth',.06);tone(120,.25,'square',.05,.08);}catch(e){}}}catch(e){}},1000);

/* ---------- Lock In: two headings (Fishing, Monsters) with a Solo / Crew toggle ---------- */
function liSplit(m){return{sec:(m==='fish'||m==='coop')?'fish':'mon',crew:m==='coop'||m==='crewhunt'};}
function liJoin(sec,crew){return sec==='fish'?(crew?'coop':'fish'):(crew?'crewhunt':'hunt');}
ACT.liSec=d=>{const c=liSplit(S.view.lockMode||'hunt');S.view.lockMode=liJoin(d.s,c.crew);render();};
ACT.liParty=d=>{const c=liSplit(S.view.lockMode||'hunt');S.view.lockMode=liJoin(c.sec,d.c==='crew');render();};
const _lockin15=SCREENS.lockin;SCREENS.lockin=()=>{let h=_lockin15();if(S.players[S.me]?.lock)return h;const m=LI_MODES.some(x=>x[0]===S.view.lockMode)?S.view.lockMode:'hunt';const {sec,crew}=liSplit(m);const o=coopPartner();
  const groups=`<div class="liGroups"><button class="liGroup ${sec==='fish'?'on':''}" data-act="liSec" data-s="fish"><canvas class="liArt" width="300" height="140" data-liart="fish"></canvas><b>Fishing</b><small>Every DM is a cast.</small></button><button class="liGroup ${sec==='mon'?'on':''}" data-act="liSec" data-s="mon"><canvas class="liArt" width="300" height="140" data-liart="mon"></canvas><b>Monsters</b><small>Every DM fires a cannonball.</small></button></div>
   <div class="seg liParty"><button class="${crew?'':'on'}" data-act="liParty" data-c="solo">Solo</button><button class="${crew?'on':''}" data-act="liParty" data-c="crew">Crew with ${pname(o)}</button></div>
   <p class="liWhat">${sec==='fish'?(crew?'<b>Crew fishing.</b> One ship, two rods. Everything either of you lands counts for both, and 50 giants that need both of you to reel in.':'<b>Solo fishing.</b> Fill your trophy case: 120 species, sizes, variants and bait.')
     :(crew?'<b>Raid.</b> One huge raid boss sized to your trip, with three phases. Fire within 10 seconds of each other for double-damage broadsides. Every phase you break pays you both.':'<b>Monster hunt.</b> Waves of monsters that get tougher as you go. Every 4th is an Elite, and every kill drops a Bestiary part.')}</p>`;
  h=h.replace(/<div class="liModes">[\s\S]*?<\/button><\/div><\/div>/,groups+'</div>');
  if(m==='hunt')h=h.replace(/<p class="liBlurb">[\s\S]*?<\/p>/,'');
  if(m==='crewhunt'){h=h.replace(/<p class="liBlurb">[\s\S]*?<\/p>/,`<p class="liBlurb">A coin toss picks the captain and you sail their ship. ${pname(o)} gets a call to the dock and can join any time. The raid boss has about ${raidHp(+(S.view.lockDur||25),0)} HP for this length of trip, and you only earn what's broken while you're aboard.</p>`).replace('<small class="liLab">First monster</small>','<small class="liLab">Raid boss</small>');}
  return h;};
coopPanelHtml=(function(orig){return function(tier){let h=orig(tier);const op=coopOpen(coopPartner());if(op)h=h.replace(/<div class="coopNote">[\s\S]*?<\/div>/,'');return h.replace(/<div class="tierHead">[\s\S]*?<\/div>/,'');};})(coopPanelHtml);

/* ---------- ship's parrot: one clear story with pets ---------- */
CAT_NAMES.moth='Parrot gear';
const PARROT_STORY='Your ship’s parrot is yours from day one and grows with every DM you send (egg, hatchling, chick, parrot, macaw, phoenix). Dress it with Parrot gear from the Shop. Pets are different: you collect them from daily sightings and pick one to ride along.';
function parrotCardHtml(pid){const me=G.players[pid],pl=S.players[pid]||{};const st=MOTH_STAGES[me.moth],nx=MOTH_STAGES[me.moth+1];
  return `<div class="card parrotCard"><div class="row between"><div><small>Ship's parrot</small><h3>${esc(pl.mothName||'Polly')} the ${esc(st.name)}</h3></div>${pid===S.me?'<button class="btn sm ghost" data-act="renameMoth">Rename</button>':''}</div>
   <div class="parrotStages">${MOTH_STAGES.map((s,i)=>`<span class="${i<=me.moth?'on':''}" title="${esc(s.name)} at ${fmtN(s.at)} DMs">${esc(s.name)}</span>`).join('')}</div>
   ${nx?`<small>Grows into a ${esc(nx.name)} at ${fmtN(nx.at)} lifetime DMs</small>${bar(me.counts.d-st.at,nx.at-st.at)}`:'<small>Fully grown. Sings sea shanties when you send DMs.</small>'}<p class="tiny muted" style="margin:6px 0 0">${PARROT_STORY}</p></div>`;}
const _ship15=SCREENS.ship;SCREENS.ship=()=>{const h=_ship15();const pid=S.view.islet||S.me;const i=h.indexOf('<small>Companion</small>');if(i<0)return h;const a=h.lastIndexOf('<div class="card">',i);const j=h.indexOf('<div class="card"',i);if(a<0||j<0)return h;return h.slice(0,a)+parrotCardHtml(pid)+'\n   '+h.slice(j);};
const _pets15=SCREENS.pets;SCREENS.pets=()=>{const h=_pets15();return h.replace(/(<div class="pad">)/,`$1${parrotCardHtml(S.me)}`);};
// the Parrot Perch hat duplicated the ship's parrot, so it becomes a chef's hat
(()=>{const i=ALL_ITEMS.hat_parrot;if(i){i.name="Galley Chef's Hat";i.st='chef';i.col='#FFFFFF';}})();
W_HAT.chef=(c,x,y,h)=>{R(c,x+1.4,y+1.2,5.2,1.6,h.col);disc(c,x+2.2,y,1.6,h.col);disc(c,x+4,y-.8,1.9,h.col);disc(c,x+5.8,y,1.6,h.col);R(c,x+1.4,y+2.4,5.2,.4,'#E6DCC4');};

/* ---------- hideout: Hall of Fame lives in More, decor sized to fit its spots ---------- */
drawIslet=function(c,t,pid){_drawIslet9(c,t,pid);};
HIDE_SPOTS.length=0;[[22,80],[36,83.5],[50,85.5],[64,86.5],[101,86.5],[115,85],[129,82.5],[143,79.5]].forEach(s=>HIDE_SPOTS.push(s));

/* ---------- weekly boss: say what it is ---------- */
function weeklyBossLine(W){if(!W||!W.hp)return '';const ws=weekStart(G.today);const left=Math.max(0,7-Math.round((Date.parse(G.today)-Date.parse(ws))/864e5)-1);
  return `<small class="tiny">${W.done?`Weekly boss sunk! +400 XP and 120 ${CN} each.`:`Every DM either of you sends this week hits it. Sink it by Sunday night for +400 XP and 120 ${CN} each. ${fmtN(W.dmg)} of ${fmtN(W.hp)} HP · ${left} day${left===1?'':'s'} left.`}</small>`;}

/* ---------- How to play, without duplicates ---------- */
(()=>{const set=(t,txt,nt)=>{const x=HELP.find(h=>h[0]===t);if(x){x[1]=txt;if(nt)x[0]=nt;}};const drop=t=>{const i=HELP.findIndex(h=>h[0]===t);if(i>=0)HELP.splice(i,1);};
  drop('Challenges');
  set('Lock In voyages','Lock In has two kinds of voyage, Fishing and Monsters, and each can be Solo or Crew. Pick one, set a length and log DMs as you go: every DM is a cast or a cannonball, and still counts towards the crew target. Tap bottles and chests at sea for loot. Reach Treasure Island when the timer ends and a finished voyage pays a doubloon for every DM you sent on it. Full screen leaves just the scene and the DM button (space bar works too).');
  set('Crew hunts','Pick Monsters, then Crew, in Lock In. You both sail one ship (a coin toss picks the captain) against a raid boss sized to the length of the trip, with three phases. Every DM either of you sends hits it, and two DMs from different captains within 10 seconds of each other fire a broadside for double damage. Breaking each phase pays you both straight away, and sinking the boss pays the rest plus a rare Bestiary part, then a bigger raid boss turns up. You only earn what is broken while you are aboard.','Raids');
  set('Your hideout','Switch from Ship to Hideout to see your pirate cove. It upgrades as you level up: a dock at level 5, a lookout tower at 10, a torch-lit skull cave at 20, a rope bridge and hammock at 30, a cannon battery at 40 and a crown for the skull at 50. Decorate it with up to 8 decor pieces (see Decorating). Clients you win go in the Hall of Fame, under More.');
  const i=HELP.findIndex(h=>h[0]==='Pet sightings');HELP.splice(i<0?HELP.length:i,0,["Ship's parrot",PARROT_STORY]);
  const j=HELP.findIndex(h=>h[0]==='Emissary flag');HELP.splice(j<0?HELP.length:j+1,0,['Weekly boss','Each week has a boss with HP equal to the week’s crew target. Every DM either of you sends hits it, and sinking it by Sunday night pays +400 XP and 120 doubloons each. You can follow it on the Today card.']);
  const d=HELP.find(h=>h[0]==='Decorating');if(d)d[1]=d[1].replace(' The Shop also has 13 new faces, 10 new coats and 6 new hats.','');})();

/* 21 Nov: little painted scenes on the Fishing and Monsters buttons */
function drawLiArt(cv,t){const k=cv.dataset.liart;const c=cv.getContext('2d');c.setTransform(cv.width/150,0,0,cv.width/150,0,0);const W2=150,H2=70;
  if(k==='fish'){const g=c.createLinearGradient(0,0,0,H2);g.addColorStop(0,'#F7B58A');g.addColorStop(.55,'#F6D7A8');g.addColorStop(.56,'#6FB3C9');g.addColorStop(1,'#2E6F93');c.fillStyle=g;c.fillRect(0,0,W2,H2);
    disc(c,112,30,9,'rgba(255,240,200,.9)');c.fillStyle='rgba(120,90,110,.35)';c.beginPath();c.moveTo(0,39);c.lineTo(22,26);c.lineTo(40,36);c.lineTo(62,24);c.lineTo(86,39);c.closePath();c.fill();
    for(let i=0;i<5;i++)R(c,96+i*6-((t/60+i*9)%30),46+i*4,10,.6,'rgba(255,255,255,.55)');
    c.fillStyle='#5A3A26';c.beginPath();c.moveTo(18,46);c.lineTo(54,46);c.lineTo(50,52);c.lineTo(22,52);c.closePath();c.fill();R(c,34,30,1.2,16,'#5A3A26');c.fillStyle='#F4EFE4';c.beginPath();c.moveTo(35.5,31);c.lineTo(48,44);c.lineTo(35.5,44);c.closePath();c.fill();
    line(c,46,46,70,22,'#7A4E30',1);c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=.4;c.beginPath();c.moveTo(70,22);c.quadraticCurveTo(84,30,88,48);c.stroke();
    const a=((t/1600)%1),fx=84+a*18,fy=48-Math.sin(a*Math.PI)*20;if(a<.95){c.save();c.translate(fx,fy);c.rotate(-.7+a*1.4);try{drawFish(c,FISH.find(f=>f.name==='Mahi-mahi')||FISH.find(f=>f.rar==='rare')||FISH[0],0,0,1.6,t,false,'');}catch(e){ell(c,0,0,4,2,'#F2A33A');}c.restore();}
    for(let i=0;i<5;i++){const an=-Math.PI*(i+.5)/5;disc(c,88+Math.cos(an)*5,48+Math.sin(an)*3,.7,'rgba(255,255,255,.85)');}}
  else{const g=c.createLinearGradient(0,0,0,H2);g.addColorStop(0,'#3A3F6A');g.addColorStop(.55,'#6A6A9A');g.addColorStop(.56,'#3E5F86');g.addColorStop(1,'#1C2E4A');c.fillStyle=g;c.fillRect(0,0,W2,H2);
    for(let i=0;i<14;i++){const x=(i*23+t/30)%W2,y=(i*13+t/14)%40;line(c,x,y,x-1.4,y+4,'rgba(200,210,255,.35)',.4);}
    if(Math.sin(t/700)>.92){c.fillStyle='rgba(255,255,255,.15)';c.fillRect(0,0,W2,H2);}
    const prev=THEME.scene;try{THEME.scene=null;drawBoss(c,{type:'kraken',col:'#9B5DE5',eye:'#3F3A30'},108,40,12,.8,t,false,46);}catch(e){}THEME.scene=prev;
    c.fillStyle='#2A1E18';c.beginPath();c.moveTo(10,46);c.lineTo(46,46);c.lineTo(42,52);c.lineTo(14,52);c.closePath();c.fill();R(c,27,28,1.2,18,'#2A1E18');c.fillStyle='#1C1A22';c.beginPath();c.moveTo(28.5,29);c.lineTo(40,43);c.lineTo(28.5,43);c.closePath();c.fill();
    const a=((t/1300)%1),bx=46+a*52,by=42-Math.sin(a*Math.PI)*22;disc(c,bx,by,1.6,'#2A2A2A');for(let i=1;i<5;i++){const q=Math.max(0,a-i*.04);disc(c,46+q*52,42-Math.sin(q*Math.PI)*22,1.2-i*.2,`rgba(255,220,150,${.5-i*.1})`);}
    if(a<.15){disc(c,47,42,3*(1-a/.15)+1,'rgba(255,240,200,.8)');}
    R(c,0,52,W2,18,'rgba(20,30,60,.25)');}}
(function liArtLoop(){const run=()=>{const l=document.querySelectorAll('canvas[data-liart]');if(l.length){const t=performance.now();l.forEach(cv=>{try{drawLiArt(cv,t);}catch(e){}});}requestAnimationFrame(run);};requestAnimationFrame(run);})();
