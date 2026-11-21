/* ============================== GARY THE GULL, FULL CHARACTER (Stage 4) ==============================
   Gary's lines live in the content file (lines.gary). He comments on the day as it happens, can be poked,
   pinches one doubloon on a missed-target day (from GARY_FROM) and gives them all back on the next target day,
   files a complaint once a week, keeps a nest on the Funnal Cove lighthouse and runs a Lost and Found. */
const GARY_FROM='2026-11-23';
const GL=()=>((CT().lines||{}).gary)||{};
function garyVars(extra){const D=G&&G.days[G.today]||{};const o=G?other(S.me):'';
  return Object.assign({me:C().players[S.me]?.name||'Captain',other:C().players[o]?.name||'the other captain',boss:(D.boss&&D.boss.name)||'the boss',target:D.target||0,team:D.team||0,left:Math.max(0,(D.target||0)-(D.team||0)),mins:Math.max(0,hm(G.cfg.dayEnd)-L().min)},extra||{});}
function garyLine(cat,seed,extra){const l=GL()[cat];if(!l||!l.length)return '';return fill(l[h32(String(seed))%l.length],garyVars(extra));}

/* ---------- what's Gary's take on the moment? ---------- */
function garySituation(){if(!G||!S.me)return null;const D=G.days[G.today];const lm=L().min;
  if(lm>=21*60||lm<5*60)return 'night';
  if(!isWork(G.today)||!D||!D.target)return 'weekend';
  if(typeof legendToday==='function'&&legendToday()&&!D.hit)return 'legend';
  if(D.hit)return h32(G.today+'gh')%2?'hit':'boss';
  const yd=G.workdays.filter(d=>d<G.today).pop();const st=hm(G.cfg.dayStart),en=hm(G.cfg.dayEnd);
  if(yd&&G.days[yd]&&G.days[yd].target&&G.days[yd].team<G.days[yd].target&&lm<12*60&&D.team<D.target*.3)return 'miss';
  if(D.team===0)return 'morning';
  const f=clamp((lm-st)/Math.max(1,en-st),0,1),exp=D.target*f;
  if(D.team>=10&&D.team>=exp*1.25)return 'fast';
  if(f>.35&&D.team<exp*.7)return 'slow';
  return null;}
function garyUrgent(){try{const D=G.days[G.today];if(!D||!D.target||D.hit)return false;const lm=L().min;const gt=goldenFor(G.today);if(isWork(G.today)&&lm>=gt.start&&lm<gt.end)return true;
  const sg=sightingState(S.me,sightingFor(G.today));if(sg&&sg.phase==='live'&&!sg.ok)return true;const mins=hm(G.cfg.dayEnd)-lm;const left=D.target-D.team;return (mins<=60&&mins>0)||left<=15;}catch(e){return false;}}
{const _remG=reminder;reminder=function(){let base=null;try{base=_remG.apply(this,arguments);}catch(e){}if(!G||!S.me)return base;if(S.garyPoke&&Date.now()<S.garyPoke.until)return S.garyPoke.line;
  if(base&&garyUrgent())return base;let sit=garySituation();if(!sit)return base;
  if(xmasNowSafe()&&h32(G.today+'x'+Math.floor(L().min/45))%3===0&&sit!=='night')sit='xmas';
  const hr=Math.floor(L().min/60);return garyLine(sit,G.today+sit+hr+'|'+S.reminderIdx)||base;};}
function xmasNowSafe(){try{return typeof xmasNow==='function'&&xmasNow();}catch(e){return false;}}

/* ---------- poking Gary ---------- */
const POKES=[];
ACT.garyPoke=()=>{const now=Date.now();while(POKES.length&&now-POKES[0]>60000)POKES.shift();POKES.push(now);
  const el=document.querySelector('.remind > div');let line;
  if(POKES.length>3)line=GL().pokeLimit||'Stop poking me.';
  else{const sit=garySituation();const pool=Math.random()<.6||!sit?'poke':sit;line=garyLine(pool,now+'p'+POKES.length);}
  S.garyPoke={line,until:now+9000};if(el){el.textContent=line;const r=el.closest('.remind');r.classList.remove('gPoke');void r.offsetWidth;r.classList.add('gPoke');}else toast('<b>Gary:</b> '+esc(line),'joke');SND.pop();};
{const _hG=SCREENS.harbour;SCREENS.harbour=function(){const h=_hG.apply(this,arguments);return h.replace('<canvas class="gull" id="gullIco">','<canvas class="gull" id="gullIco" data-act="garyPoke" title="Poke Gary">');};}

/* ---------- the nest: a doubloon pinched per missed day, all returned on the next target day ---------- */
function garyNestCalc(g,p){let held=0,stolen=0,returned=0,chips=0;const log=[];
  Object.keys(g.days).filter(d=>d>=GARY_FROM&&d<g.today).sort().forEach(d=>{const D=g.days[d];if(!D||!D.target)return;if(typeof absent==='function'&&absent(p,d))return;
    if(D.team>=D.target){if(held){returned+=held;chips++;log.push({date:d,k:'back',n:held});held=0;}}else{held++;stolen++;log.push({date:d,k:'took'});}});
  return{held,stolen,returned,chips,log};}
const _deriveGary=derive;derive=function(){const g=_deriveGary.apply(this,arguments);try{g.P.forEach(p=>{const pl=g.players[p];if(!pl)return;const n=garyNestCalc(g,p);pl.nest=n;pl.balance-=n.held;});}catch(e){console.warn('gary derive',e);}return g;};
function myNest(){return (G&&G.players[S.me]&&G.players[S.me].nest)||{held:0,stolen:0,returned:0,chips:0,log:[]};}

/* ---------- weekly formal complaints ---------- */
function complaintFor(ws){if(ws<weekStart(GARY_FROM))return null;const days=[0,1,2,3,4].map(i=>addDays(ws,i));const date=days[h32(ws+'cmp')%5];
  const n=44+Math.round((new Date(ws+'T12:00:00Z')-new Date(weekStart(GARY_FROM)+'T12:00:00Z'))/604800000);
  const l=GL().complaints||[];return{date,n,text:l.length?fill(l[h32(ws+'cmpT')%l.length],garyVars()):''};}
function complaintsSoFar(){const out=[];if(!G)return out;let ws=weekStart(GARY_FROM);const end=G.today;while(ws<=end){const c=complaintFor(ws);if(c&&c.date<=end)out.push(c);ws=addDays(ws,7);}return out.reverse();}
function complaintCardHtml(){if(!G||PREFS.heckles===false)return '';const c=complaintFor(weekStart(G.today));if(!c||c.date!==G.today)return '';let seen=false;try{seen=localStorage.getItem('hl_cmp_'+c.n)==='1';}catch(e){}if(seen)return '';
  return `<div class="card gComplaint"><small>Gary has filed a complaint</small><h3>Complaint #${c.n}</h3><p>"${esc(c.text)}"</p><div class="row"><a class="btn sm ghost" href="#nest">See the complaints drawer</a><button class="btn sm ghost" data-act="cmpSeen" data-n="${c.n}">Noted</button></div></div>`;}
ACT.cmpSeen=d=>{try{localStorage.setItem('hl_cmp_'+d.n,'1');}catch(e){}render();};
{const _hC=SCREENS.harbour;SCREENS.harbour=function(){const h=_hC.apply(this,arguments);const x=complaintCardHtml();if(!x)return h;const k='<div class="remind">';return h.includes(k)?h.replace(k,x+k):h;};}

/* ---------- Gary's Lost and Found: things that fell off the other captain's ship, at a markup ---------- */
function lostFound(){if(!G||!S.me)return [];const me=G.players[S.me],o=G.players[other(S.me)];if(!me||!o)return [];const ws=weekStart(G.today);
  const pool=ITEMS.filter(i=>o.owned[i.id]&&!me.owned[i.id]&&i.price>0&&!i.free&&!i.merchantOnly&&!i.xmas&&!i.bm&&!i.earn&&!i.track&&!i.setBanner&&i.cat!=='shield'&&!String(i.id).startsWith('m_')&&!itemLocked(i,me));
  return pool.map(i=>({i,k:h32(ws+i.id+'lf')})).sort((a,b)=>a.k-b.k).slice(0,3).map(x=>({it:x.i,price:Math.ceil(x.i.price*1.25/10)*10}));}

/* ---------- the nest screen ---------- */
SCREENS.nest=()=>{const n=myNest();const cs=complaintsSoFar();const lf=lostFound();const me=G.players[S.me];const quote=garyLine('nest',G.today+'n'+(S.reminderIdx||0));
  const logH=n.log.slice(-8).reverse().map(x=>`<div class="li"><span class="grow">${shortDate(x.date)}</span><span>${x.k==='took'?'Pinched 1 doubloon (target missed)':`Gave back ${x.n} (target hit) + 1 chip, owed`}</span></div>`).join('');
  return `<div class="pad"><div class="card nestHead"><canvas class="gull" id="nestGull" width="96" height="96"></canvas><div><small>Gary's nest, top of the lighthouse</small><h2>${n.held?`${n.held} of your doubloons in here`:'No doubloons of yours. Yet.'}</h2><p class="tiny">"${esc(quote)}"</p></div></div>
   <div class="card"><h3>How it works</h3><p class="tiny">On any working day the crew misses the target, Gary pinches one doubloon from each captain. The next day you hit the target he gives them all back, plus interest of exactly one chip (chips are not a currency; he still owes you them). ${GARY_FROM>G.today?'He starts on '+shortDate(GARY_FROM)+'.':''}</p>
   <div class="statRow"><div><b>${n.stolen}</b><small>pinched</small></div><div><b>${n.returned}</b><small>given back</small></div><div><b>${n.chips}</b><small>chips owed</small></div></div>${logH?`<div class="list" style="margin-top:8px">${logH}</div>`:''}</div>
   <div class="card"><h3>Lost and Found</h3><p class="tiny muted">Things that "fell off" Captain ${esc(pnameRaw(other(S.me)))}'s ship. Gary's markup is 25%. It changes every Monday.</p>
   ${lf.length?`<div class="list">${lf.map(x=>`<div class="li"><canvas class="lfIco" width="96" height="96" data-lf="${x.it.id}"></canvas><span class="grow"><b>${esc(x.it.name)}</b><br><small>${esc(CAT_NAMES[x.it.cat]||x.it.cat)} · shop price ${fmtN(x.it.price)}</small></span><button class="btn sm" data-act="buy" data-id="${x.it.id}" data-p="${x.price}" ${me.balance<x.price?'disabled':''}>${fmtN(x.price)} ${CN}</button></div>`).join('')}</div>`:'<p class="tiny">Nothing this week. Gary says the other ship is "annoyingly well secured".</p>'}</div>
   <div class="card"><h3>The complaints drawer</h3>${cs.length?`<div class="list">${cs.slice(0,12).map(c=>`<div class="li"><span class="grow"><b>Complaint #${c.n}</b> <small class="muted">${shortDate(c.date)}</small><br><small>${esc(c.text)}</small></span></div>`).join('')}</div>`:`<p class="tiny">Empty. Gary starts filing on ${shortDate(GARY_FROM)}. He has a lot saved up.</p>`}</div>
   <p class="tiny muted" style="text-align:center">Gary's column runs every week in the Salty Herald.</p></div>`;};
{const _rdG=render;render=function(){_rdG.apply(this,arguments);try{const cv=document.getElementById('nestGull');if(cv)drawGullIcon(cv);document.querySelectorAll('canvas[data-lf]').forEach(cv=>drawItemIcon(cv,cv.dataset.lf));}catch(e){}};}

/* ---------- on the Harbour: the nest on the lighthouse, and the doubloon heist ---------- */
function lighthouseTop(){const B=G&&G.proj?G.proj.find(p=>p.id==='beacon'):null;return 106-(B&&B.built?50:34);}
function drawNest(c,x,y,t,coins,gary){ell(c,x,y+1.2,6.4,2.2,'#7A5A3A');c.strokeStyle='#A8784A';c.lineWidth=.5;for(let i=0;i<7;i++){c.beginPath();c.moveTo(x-6+i*1.9,y+.4+(i%2)*.8);c.lineTo(x-4+i*1.7,y-.6+(i%3)*.6);c.stroke();}
  for(let i=0;i<Math.min(coins,5);i++){const gx=x-3.6+i*1.8,gy=y-.4-(i%2)*.5;disc(c,gx,gy,.95,'#E8B43A');if(Math.sin(t/300+i*2)>.85)disc(c,gx-.3,gy-.3,.35,'#FFFFFF');}
  if(gary){const b=Math.sin(t/600)*.3;ell(c,x+.5,y-1.6+b,3.2,2,'#FFFFFF');disc(c,x+2.6,y-3.6+b,1.5,'#FFFFFF');poly(c,[[x+3.8,y-3.8+b],[x+5.6,y-3.3+b],[x+3.8,y-2.9+b]],'#F2A33A');disc(c,x+3,y-4+b,.35,'#3F3A30');ell(c,x-1.6,y-1.4+b,2.2,1,'#B8C2CC');
    if(xmasNowSafe()){poly(c,[[x+1.2,y-4.8+b],[x+4,y-5+b],[x+2.2,y-7.6+b]],'#C8102E');R(c,x+1.1,y-5.2+b,3,.7,'#FFFFFF');disc(c,x+2.1,y-7.8+b,.55,'#FFFFFF');}}}
addLayer('world','garyNest',(c,t)=>{if(!G||!S.me)return;const n=myNest();const top=lighthouseTop();const away=typeof marketOpen==='function'&&marketOpen();const x=114,y=top+12;
  R(c,x-4,y+2.6,8,.8,'#6B5040');drawNest(c,x,y,t,n.held,!away&&!HEIST.on);if(away)txt(c,'out',x,y-4,'rgba(255,255,255,.7)',4.6,'center');
  hit(x-8,y-9,16,13,"Gary's nest",n.held?`${n.held} of your doubloons are in here. Hit the target to get them back. Tap to visit.`:'Twigs, chip papers and anything shiny. Tap to visit.',{go:'nest'});},{scenes:['harbour'],z:4});
const HEIST={on:false,t0:0,back:false};
addLayer('fx','garyHeist',(c,t)=>{if(!HEIST.on)return;const u=(performance.now()-HEIST.t0)/5200;if(u>=1){HEIST.on=false;return;}const top=lighthouseTop();
  const [x0,y0,x1,y1]=HEIST.back?[114,top+8,150,150]:[150,150,114,top+8];const x=x0+(x1-x0)*u,y=y0+(y1-y0)*u-Math.sin(u*Math.PI)*36;
  drawGull(c,x-5,y-3,t);disc(c,x+5.6,y+.4,1.3,'#E8B43A');disc(c,x+5.2,y,.4,'#FFF4C0');if(u<.25){c.globalAlpha=1-u*4;txt(c,HEIST.back?'Fine. Here.':'Mine now.',x,y-8,'#FFFFFF',6,'center');}},{scenes:['harbour'],z:20});
function heistCheck(){try{if(!G||!S.me||S.screen!=='harbour')return;const n=myNest();const last=n.log[n.log.length-1];if(!last)return;const yd=G.workdays.filter(d=>d<G.today).pop();if(last.date!==yd)return;
  const k='hl_heist_'+last.date;if(localStorage.getItem(k))return;localStorage.setItem(k,'1');HEIST.on=true;HEIST.back=last.k==='back';HEIST.t0=performance.now();
  setTimeout(()=>toast(last.k==='took'?`<b>Gary pinched a doubloon.</b> Yesterday's target was missed. Hit today's and he'll give ${n.held>1?'all '+n.held:'it'} back.`:`<b>Gary gave back ${last.n} doubloon${last.n>1?'s':''}.</b> Plus one chip. He still owes you the chip.`,'joke'),900);}catch(e){}}
{const _rdH=render;render=function(){_rdH.apply(this,arguments);setTimeout(heistCheck,600);};}

/* scene hit regions that open a screen: {go:'nest'} */
document.addEventListener('click',ev=>{const cv=ev.target.closest&&ev.target.closest('canvas.scene');if(!cv||cv.id==='focusCv'||!S.hits)return;const r=cv.getBoundingClientRect();const x=(ev.clientX-r.left)/r.width*W,y=(ev.clientY-r.top)/r.height*H;
  for(let i=S.hits.length-1;i>=0;i--){const h=S.hits[i];if(x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h){if(h.act&&h.act.go){const tp=document.getElementById('tip');if(tp)tp.hidden=true;setTimeout(()=>{location.hash='#'+h.act.go;},120);}return;}}});

HELP.push(["Gary's nest",'Gary lives on top of the Funnal Cove lighthouse. On a missed-target day he pinches one doubloon from each captain; the next day you hit the target he gives them all back, plus one chip. Tap the nest to see what he has, his complaints drawer, and the Lost and Found (things the other captain owns, at a 25% markup). Poke him on his Harbour card for a comment.']);
