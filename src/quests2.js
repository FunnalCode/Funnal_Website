/* ============================== 22 Nov: Quests and Events ==============================
   The Quests tab opens on two painted buttons, Quests and Events, that animate like Fishing and Monsters in Lock In.
   Quests: today's three bounties on a board (a ring that fills, a stamp that thumps down, coins that fly to your purse),
   this week's bounties with the time to Monday's reset, and the long voyages drawn as routes on a sea chart.
   Events: what's on or next (the Christmas Event, with its Advent Calendar and its 40-tier pass), what's coming, what's past.
   Claims, quests and the advent rules are unchanged; this is the new front for them. */

/* ---------- small helpers ---------- */
function qClaimables(p){const me=G.players[p];const q=questState(p);const ws=weekStart(G.today);const out=[];
  q.daily.forEach(x=>{const k=`q_d_${G.today}_${x.id}`;if(x.prog>=x.n&&!me.claimed.has(k))out.push({k,xp:x.xp,g:x.g});});
  q.weekly.forEach(x=>{const k=`q_w_${ws}_${x.id}`;if(x.prog>=x.n&&!me.claimed.has(k))out.push({k,xp:x.xp,g:x.g});});
  q.long.forEach(x=>{const k=`q_l_${x.id}`;if(x.prog>=x.n&&!me.claimed.has(k))out.push({k,xp:x.xp,g:x.g});});return out;}
function qResetIn(){const nx=addDays(weekStart(G.today),7);const ms=Math.max(0,londonTs(nx,0)-Date.now());const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4);
  return d?`${d}d ${h}h`:h?`${h}h ${m}m`:`${m}m`;}
function qRing(prog,n,state){const r=18,C2=2*Math.PI*r,f=Math.max(0,Math.min(1,prog/n));
  return `<span class="qRingW ${state}"><svg class="qRing" viewBox="0 0 44 44" aria-hidden="true"><circle class="trk" cx="22" cy="22" r="${r}"/><circle class="val" cx="22" cy="22" r="${r}" stroke-dasharray="${(C2*f).toFixed(1)} ${C2.toFixed(1)}"/></svg><b class="num">${state==='cl'?'✓':Math.min(prog,n)}</b><small>${state==='cl'?'':'/ '+fmtN(n)}</small></span>`;}
S.justStamped=S.justStamped||new Set();
function qBounty(x,key,kind,i){const me=G.players[S.me];const done=x.prog>=x.n,cl=me.claimed.has(key);const st=cl?'cl':done?'ready':'go';
  const rot=[-.6,.5,-.3,.4,-.5][i%5];const left=Math.max(0,x.n-x.prog);
  const act=cl?`<span class="qStamp ${S.justStamped.has(key)?'thump':''}">Done</span>`
    :done?`<button class="btn primary sm qClaimBtn" data-act="qClaim" data-key="${key}" data-xp="${x.xp}" data-g="${x.g}">Claim</button>`
    :`<small class="qLeft">${fmtN(left)} to go</small>`;
  return `<div class="bounty ${st} k-${kind}" style="--rot:${rot}deg">${qRing(x.prog,x.n,st)}<div class="grow"><b>${esc(x.name)}</b><span class="qRew"><i class="xp">+${fmtN(x.xp)} XP</i><i class="gd">+${fmtN(x.g)} ${CN}</i></span></div>${act}</div>`;}

/* ---------- the sea chart of long voyages ---------- */
function qChartHtml(list){const me=G.players[S.me];const data=list.map(x=>({n:x.name,p:Math.min(x.prog,x.n),t:x.n,d:x.prog>=x.n?1:0,c:me.claimed.has(`q_l_${x.id}`)?1:0}));
  const h=data.length*46+22;return `<canvas class="qChart" width="680" height="${h*2}" style="aspect-ratio:340/${h}" data-qchart='${esc(JSON.stringify(data))}' role="img" aria-label="Long voyages: ${data.map(d=>`${d.n}, ${fmtN(d.p)} of ${fmtN(d.t)}`).join('; ')}"></canvas>`;}
function drawQChart(cv,t){let data;try{data=JSON.parse(cv.dataset.qchart);}catch(e){return;}const c=cv.getContext('2d');const W=340,H=cv.height/2;c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,W,H);
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#F5E9CB');g.addColorStop(1,'#EBDBB5');c.fillStyle=g;c.fillRect(0,0,W,H);
  // faint grid and a compass rose, like an old chart
  c.strokeStyle='rgba(120,90,50,.10)';c.lineWidth=.6;for(let x=20;x<W;x+=40){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}for(let y=16;y<H;y+=40){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  const rx=W-24,ry=16;c.save();c.translate(rx,ry);c.rotate(Math.sin(t/4000)*.05);c.fillStyle='rgba(138,94,52,.55)';for(let k=0;k<4;k++){c.rotate(Math.PI/2);c.beginPath();c.moveTo(0,-9);c.lineTo(2.2,0);c.lineTo(-2.2,0);c.closePath();c.fill();}c.restore();
  c.fillStyle='rgba(120,80,40,.18)';const vg=c.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(110,70,30,.22)');c.fillStyle=vg;c.fillRect(0,0,W,H);
  data.forEach((d,i)=>{const y=14+i*46;c.font='700 13px Nunito, Fredoka, sans-serif';c.textBaseline='alphabetic';c.textAlign='left';c.fillStyle='#3B2F1E';c.fillText(d.n,14,y+9);
    c.font='800 11.5px Nunito, sans-serif';c.textAlign='right';c.fillStyle=d.d?'#2F7A4E':'#6B5636';c.fillText(d.c?'claimed':`${fmtN(d.p)} / ${fmtN(d.t)}`,W-54,y+9);
    const x0=22,x1=W-46,yy=y+24;c.setLineDash([2.5,4]);c.strokeStyle='rgba(110,80,46,.65)';c.lineWidth=1.3;c.beginPath();c.moveTo(x0,yy);
    for(let x=x0;x<=x1;x+=8)c.lineTo(x,yy+Math.sin(x/22+i)*2.2);c.stroke();c.setLineDash([]);
    // the island at the end
    ell(c,x1+16,yy+3,13,4.5,'rgba(70,120,140,.25)');ell(c,x1+16,yy+1,11,4,'#E3C88E');ell(c,x1+14,yy-1,6,2.6,'#79A960');
    line(c,x1+20,yy,x1+20,yy-14,'#5A4030',1.1);const fc=d.c?'#D9A33A':d.d?'#2F9A63':'#C0392B';const wv=Math.sin(t/300+i)*1.2;poly(c,[[x1+20,yy-14],[x1+30,yy-11+wv*.3],[x1+20,yy-8]],fc);
    if(d.d&&!d.c){c.strokeStyle=`rgba(242,196,98,${.5+.4*Math.sin(t/260)})`;c.lineWidth=1.6;c.beginPath();c.ellipse(x1+16,yy+1,16,7,0,0,TAU);c.stroke();}
    // the ship, at your progress
    const f=Math.min(1,d.p/d.t),sx=x0+f*(x1-x0-8),sy=yy+Math.sin(sx/22+i)*2.2+Math.sin(t/420+i)*1.1;c.save();c.translate(sx,sy);c.rotate(Math.sin(t/520+i)*.06);
    poly(c,[[-7,-1],[7,-1],[5,3],[-5,3]],'#7A4A2C');line(c,0,-1,0,-12,'#4A3020',1);poly(c,[[.6,-11.5],[6.5,-3],[.6,-3]],'#FBF6EA');poly(c,[[-.6,-10],[-5,-3],[-.6,-3]],'#F1E8D6');poly(c,[[0,-12],[3,-11],[0,-10]],'#C0392B');c.restore();});}
(function qChartLoop(){const run=()=>{const l=document.querySelectorAll('canvas[data-qchart]');if(l.length){const t=performance.now();l.forEach(cv=>{try{drawQChart(cv,t);}catch(e){}});}requestAnimationFrame(run);};requestAnimationFrame(run);})();

/* ---------- coins that fly to the purse ---------- */
function coinFly(fromEl,n=9){try{if(!fromEl||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const to=$('#glowNum');if(!to)return;const a=fromEl.getBoundingClientRect(),b=to.getBoundingClientRect();
  const ax=a.left+a.width/2,ay=a.top+a.height/2,bx=b.left+b.width/2,by=b.top+b.height/2;
  for(let i=0;i<n;i++){const el=document.createElement('i');el.className='flyCoin';el.style.left=ax+'px';el.style.top=ay+'px';document.body.appendChild(el);
    const dx=bx-ax,dy=by-ay,sp=(i-(n-1)/2)*14,lift=-60-Math.random()*40;
    const an=el.animate([{transform:'translate(-50%,-50%) scale(.6)',opacity:0},{transform:`translate(calc(-50% + ${sp}px),calc(-50% + ${lift}px)) scale(1.1)`,opacity:1,offset:.3},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.7)`,opacity:.9}],{duration:720+i*45,easing:'cubic-bezier(.5,0,.4,1)',delay:i*35,fill:'forwards'});
    an.onfinish=()=>{el.remove();if(i===n-1){to.classList.remove('purseBump');void to.offsetWidth;to.classList.add('purseBump');}};}}catch(e){}}

ACT.qClaim=async(d,el)=>{if(G.players[S.me].claimed.has(d.key))return;coinFly(el);S.justStamped.add(d.key);setTimeout(()=>S.justStamped.delete(d.key),1600);await ACT.claim(d);};
ACT.qClaimAll=async(d,el)=>{const list=qClaimables(S.me);if(!list.length)return;const bonus={};let xp=0,g=0;list.forEach(x=>{bonus[x.k]={xp:x.xp,g:x.g,ts:Date.now()};xp+=x.xp;g+=x.g;S.justStamped.add(x.k);});
  coinFly(el,12);setTimeout(()=>list.forEach(x=>S.justStamped.delete(x.k)),1600);
  try{await writeDay(S.me,G.today,{bonus});SFX.ach();toast(`<b>${list.length} quests claimed!</b> +${fmtN(xp)} XP, +${fmtN(g)} ${CN}. Gary has started calling you "the boss". Sarcastically.`);}catch(e){writeFail(e);}};

/* ---------- the Quests side ---------- */
function questsSideHtml(){const q=questState(S.me);const ws=weekStart(G.today);const all=qClaimables(S.me);const tx=all.reduce((a,x)=>a+x.xp,0),tg=all.reduce((a,x)=>a+x.g,0);
  const dDone=q.daily.filter(x=>x.prog>=x.n).length;const longReady=q.long.filter(x=>x.prog>=x.n&&!G.players[S.me].claimed.has(`q_l_${x.id}`));
  return `${all.length>1?`<button class="btn primary qAll" data-act="qClaimAll"><b>Claim all ${all.length}</b><small>+${fmtN(tx)} XP · +${fmtN(tg)} ${CN}</small></button>`:''}
  <div class="card qBoard"><div class="qHead"><h2>Today's bounties</h2><small>${dDone} of ${q.daily.length} done · ${shortDate(G.today)}</small></div>
    <div class="qList">${q.daily.map((x,i)=>qBounty(x,`q_d_${G.today}_${x.id}`,'d',i)).join('')}</div></div>
  <div class="card qBoard week"><div class="qHead"><h2>This week</h2><small>resets in <b>${qResetIn()}</b></small></div>
    <div class="qList">${q.weekly.map((x,i)=>qBounty(x,`q_w_${ws}_${x.id}`,'w',i+1)).join('')}</div></div>
  <div class="card qVoy"><div class="qHead"><h2>Long voyages</h2><small>lifetime goals</small></div>${qChartHtml(q.long)}
    ${longReady.length?`<div class="qList" style="margin-top:8px">${longReady.map((x,i)=>qBounty(x,`q_l_${x.id}`,'l',i)).join('')}</div>`:`<p class="tiny muted" style="margin:8px 2px 0">Your ship sits at your progress on each route. Reach the island to claim.</p>`}</div>`;}

/* ---------- the Events side ---------- */
const EVENT_LOOK={winter:{a:'#C8102E',b:'#1F3B63',word:'Event'},storm:{a:'#5B6C8F',b:'#1E2638',word:'Season'},spring:{a:'#E58BB0',b:'#3C4E6E',word:'Season'},summer:{a:'#F2A33A',b:'#1F5E7A',word:'Season'},autumn:{a:'#D9772B',b:'#3A2A3E',word:'Season'}};
function evDays(se){return daysBetween(se.start,se.end)+1;}
function evHeroHtml(se,mode){const lk=EVENT_LOOK[se.look]||EVENT_LOOK.winter;const today=G.today;let sub;
  if(mode==='now'){const day=daysBetween(se.start,today)+1;sub=`Day ${day} of ${evDays(se)} · ends ${fmtDateLong(se.end)}`;}else{const d=daysBetween(today,se.start);sub=`Starts ${fmtDateLong(se.start)} · in ${d} day${d===1?'':'s'}`;}
  return `<div class="evHero" style="--ea:${lk.a};--eb:${lk.b}"><canvas width="680" height="318" data-evart="${se.look}" aria-hidden="true"></canvas><div class="evTxt"><small>${mode==='now'?'Now on':'Next up'} · ${esc(seLabel(se))}</small><h2>${esc(se.name)}</h2><span>${sub}</span></div>${mode!=='now'?`<div class="evCount"><b class="num">${daysBetween(today,se.start)}</b><small>days</small></div>`:''}</div>`;}
function advCalHtml(){if(typeof adventState!=='function')return '';const A=adventState();const inDec=G.today.slice(5,7)==='12';const day=+G.today.slice(8,10);
  const doors=Array.from({length:24},(_,i)=>{const k=i+1,o=A.open[k],cl=o&&A.claimed(k),p=ADVENT[k];const future=!inDec||k>day;const cls=cl?'cl':o?'ready':future?'future':'shut';
    const inside=cl?(p.item?`<canvas class="icon" data-id="${p.item}"></canvas>`:`<span>${p.joke?'🎄':p.feast?'🍗':p.xp&&!p.g?'⭐':'🪙'}</span>`):'';
    return `<button class="advDoor ${cls} c${k%3}" data-act="advDoor" data-k="${k}" aria-label="Door ${k}${cl?', opened':o?', ready to open':future?', opens '+k+' December':', still shut'}"><span class="in">${inside}</span><span class="leaf"><b>${k}</b></span></button>`;}).join('');
  const ready=Array.from({length:24},(_,i)=>i+1).filter(k=>A.open[k]&&!A.claimed(k)).length;
  return `<div class="card advCal"><div class="qHead"><h2>Advent Calendar</h2><small>${A.nClaimed} of 24 opened</small></div>
    <p class="tiny muted" style="margin:2px 0 10px">Hit the crew target to open that day's door. Weekend doors open on Monday, and every target day also opens one door you missed. Open all 24 for the Golden Reindeer figurehead.</p>
    <div class="advGrid">${doors}</div>${ready?`<button class="btn primary" style="width:100%;margin-top:10px" data-act="advOpenAll">Open ${ready} door${ready===1?'':'s'}</button>`:''}</div>`;}
function evComingHtml(list){if(!list.length)return '';return `<h3 class="evH">Coming up</h3>${list.map(se=>{const lk=EVENT_LOOK[se.look]||EVENT_LOOK.storm;const R_=SP_REWARDS[se.n]||{};
  return `<div class="card evCard" style="--ea:${lk.a}"><div class="evDot"></div><div class="grow"><small class="muted">${esc(seLabel(se))} · ${fmtDateLong(se.start)} to ${fmtDateLong(se.end)}</small><b>${esc(se.name)}</b><p class="tiny muted">${esc(se.blurb)} Boss: ${esc(se.boss)}.</p>
    ${Object.keys(R_).length?`<div class="spCos">${Object.entries(R_).map(([t,id])=>`<div class="spCosI"><canvas class="icon" data-id="${id}"></canvas><b>${esc(ALL_ITEMS[id].name)}</b><small>Tier ${t}</small></div>`).join('')}</div>`:`<small class="muted">Rewards revealed nearer the time.</small>`}</div></div>`;}).join('')}`;}
function evPastHtml(list){return `<h3 class="evH">Past events</h3>${list.length?list.map(se=>{const st=seasonState(S.me,se);return `<div class="card evCard past"><div class="grow"><b>${esc(se.name)}</b><small class="muted">${fmtDateLong(se.start)} to ${fmtDateLong(se.end)} · you reached tier ${st?st.tier:0}</small></div><button class="btn sm" data-act="spRecap" data-id="${se.id}">Recap</button></div>`;}).join(''):`<p class="tiny muted" style="margin:0 4px 12px">Nothing here yet. Your first event starts on ${fmtDateLong(GSEASONS[0].start)}.</p>`}`;}
function eventsSideHtml(){const today=G.today;const now=seasonAt(today);const nxt=seasonNext(today);const hero=now||nxt;
  const pass=seasonTabHtml().replace(/^<div class="pad">/,'<div class="evPass">').replace(/<small class="muted">[^<]*<\/small><h2>[^<]*<\/h2>/,'<h3 class="evPassH">The event pass</h3>').replace(/<div class="spCount">[\s\S]*?<\/div>/,'');
  const coming=GSEASONS.filter(s=>s.start>today&&s!==hero).slice(0,3);const past=GSEASONS.filter(s=>s.end<today).reverse();
  return `${hero?evHeroHtml(hero,now?'now':'next'):''}${hero&&hero.id==='frozen'?advCalHtml():''}${hero?pass:''}${evComingHtml(coming)}${evPastHtml(past)}`;}

/* ---------- the two painted buttons ---------- */
{const _dla=drawLiArt;drawLiArt=function(cv,t){const k=cv.dataset.liart;if(k!=='quests'&&k!=='events')return _dla(cv,t);const c=cv.getContext('2d');c.setTransform(cv.width/150,0,0,cv.width/150,0,0);const W2=150,H2=70;
  if(k==='quests'){c.fillStyle='#6E4A2E';c.fillRect(0,0,W2,H2);for(let y=0;y<H2;y+=10){R(c,0,y,W2,.8,'rgba(40,24,12,.35)');}for(let i=0;i<9;i++)R(c,(i*37)%W2,(i*23)%H2,5,.5,'rgba(255,220,170,.10)');
    rr(c,14,8,92,56,3,'#4A2F1C');rr(c,16,10,88,52,2,'#B88A55');for(let i=0;i<6;i++)disc(c,22+i*15,36+((i*7)%9),.9,'rgba(90,60,30,.35)');
    const notes=[[20,14,-.07],[48,12,.05],[76,15,-.04]];notes.forEach(([x,y,r],i)=>{const fl=Math.sin(t/380+i*1.7)*.03;c.save();c.translate(x+13,y);c.rotate(r+fl);rr(c,-13,0,26,34,1.5,'#F6EBCF');R(c,-9,7,18,1.6,'rgba(70,50,30,.55)');R(c,-9,12,14,1.2,'rgba(70,50,30,.35)');R(c,-9,16,16,1.2,'rgba(70,50,30,.35)');
      if(i===1){const ph=(t%2600)/2600;const s=ph<.08?2.2-ph/.08*1.2:1;const a=ph<.08?ph/.08:1;c.save();c.globalAlpha=a;c.translate(0,26);c.rotate(-.25);c.scale(s,s);c.strokeStyle='#C0392B';c.lineWidth=1.2;c.strokeRect(-8,-3.5,16,7);c.fillStyle='#C0392B';c.font='800 5px Fredoka, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('DONE',0,.3);c.restore();}
      else{c.strokeStyle='#2F9A63';c.lineWidth=1.4;c.beginPath();c.arc(0,25,5,-Math.PI/2,-Math.PI/2+TAU*(i===0?.66:.33));c.stroke();}
      disc(c,0,1.5,1.8,'#C0392B');disc(c,-.5,1,.6,'rgba(255,255,255,.6)');c.restore();});
    c.save();c.translate(124,40);c.rotate(-.6+Math.sin(t/900)*.05);poly(c,[[0,-24],[4,-6],[1.5,10],[-1.5,10],[-4,-6]],'#F4EFE6');line(c,0,-22,0,12,'#B9A98E',.6);R(c,-1,10,2,6,'#3B2F25');c.restore();
    for(let i=0;i<6;i++){const x=(i*29+t/50)%W2,y=10+((i*17+t/90)%50);disc(c,x,y,.5,'rgba(255,230,180,.35)');}}
  else{const g=c.createLinearGradient(0,0,0,H2);g.addColorStop(0,'#14213D');g.addColorStop(.7,'#2E4A78');g.addColorStop(.71,'#1E3A5C');g.addColorStop(1,'#0F2440');c.fillStyle=g;c.fillRect(0,0,W2,H2);
    for(let i=0;i<18;i++){const x=(i*41)%W2,y=(i*13)%34;disc(c,x,y,.45+((i*7)%3)*.15,`rgba(255,255,255,${.4+.4*Math.sin(t/500+i)})`);}
    // a firework every few seconds
    const fw=(t%3200)/3200;if(fw<.55){const fx=112,fy=20,rad=fw*30;for(let k2=0;k2<14;k2++){const an=k2/14*TAU;disc(c,fx+Math.cos(an)*rad,fy+Math.sin(an)*rad*.8,1.1*(1-fw),`hsla(${(k2*30+t/20)%360},90%,70%,${1-fw*1.6})`);}}
    // shore, tree, presents
    poly(c,[[0,54],[70,50],[96,56],[0,60]],'#EAF2F8');R(c,0,58,96,2,'#CFE0EE');
    const tx=40;[[0,30,18],[0,22,14],[0,15,10]].forEach(([o,y,w],i)=>poly(c,[[tx-w,y+12],[tx,y-6],[tx+w,y+12]],i%2?'#2F7A4E':'#256B43'));R(c,tx-2,42,4,6,'#5A3A26');
    poly(c,[[tx,6],[tx+2,10],[tx+6,10],[tx+3,13],[tx+4,17],[tx,15],[tx-4,17],[tx-3,13],[tx-6,10],[tx-2,10]],'#F2C462');
    for(let i=0;i<10;i++){const lx=tx-14+((i*11)%28),ly=18+((i*7)%24);disc(c,lx,ly,1,['#FF5A5A','#FFD45A','#7AD7FF','#FF9AE6'][i%4]);if(Math.sin(t/240+i*1.3)>.4)disc(c,lx,ly,2,'rgba(255,240,180,.25)');}
    rr(c,52,47,9,7,1,'#C8102E');R(c,55.8,47,1.4,7,'#F2C462');rr(c,62,49,7,5,1,'#2E6FB8');R(c,64.8,49,1.2,5,'#FFFFFF');rr(c,22,48,8,6,1,'#F2C462');R(c,25.3,48,1.2,6,'#C8102E');
    // a little ship on the water with a lantern
    c.save();c.translate(118,62+Math.sin(t/500)*1);poly(c,[[-12,-2],[12,-2],[9,3],[-9,3]],'#2A1E18');line(c,0,-2,0,-18,'#2A1E18',1);poly(c,[[.8,-17],[10,-4],[.8,-4]],'#E8EEF4');disc(c,-8,-5,1.4,'#FFD27A');c.restore();
    for(let i=0;i<22;i++){const x=(i*31+t/40+Math.sin(t/900+i)*6)%W2,y=(i*19+t/26)%H2;disc(c,x,y,.6+((i%3)*.25),'rgba(255,255,255,.85)');}}};}

/* the hero art is the Events painting, drawn large */
(function evArtLoop(){const run=()=>{const l=document.querySelectorAll('canvas[data-evart]');if(l.length){const t=performance.now();l.forEach(cv=>{try{const k=cv.dataset.liart;cv.dataset.liart='events';drawLiArt(cv,t);if(k)cv.dataset.liart=k;else delete cv.dataset.liart;}catch(e){}});}requestAnimationFrame(run);};requestAnimationFrame(run);})();

/* ---------- the screen ---------- */
SCREENS.quests=()=>{const tab=S.view.qtab==='season'?'events':(S.view.qtab||'quests');const q=questState(S.me);
  const claim=qClaimables(S.me).length;const dDone=q.daily.filter(x=>x.prog>=x.n).length;
  const se=seasonAt(G.today),nx=seasonNext(G.today);const un=se?unclaimedTiers(S.me,seasonState(S.me,se)).length:0;
  let adv=0;try{if(typeof adventState==='function'&&G.today.slice(5,7)==='12'){const A=adventState();adv=Array.from({length:24},(_,i)=>i+1).filter(k=>A.open[k]&&!A.claimed(k)).length;}}catch(e){}
  const evSub=se?`${esc(se.name)}: day ${daysBetween(se.start,G.today)+1} of ${evDays(se)}`:nx?`${esc(nx.label||nx.name)} in ${daysBetween(G.today,nx.start)} days`:'Nothing on right now';
  const btns=`<div class="liGroups qGroups"><button class="liGroup ${tab==='quests'?'on':''}" data-act="qTab" data-t="quests"><canvas class="liArt" width="300" height="140" data-liart="quests"></canvas><b>Quests${claim?` <span class="qBadge">${claim}</span>`:''}</b><small>${claim?`${claim} ready to claim`:`${dDone} of ${q.daily.length} done today`}</small></button><button class="liGroup ${tab==='events'?'on':''}" data-act="qTab" data-t="events"><canvas class="liArt" width="300" height="140" data-liart="events"></canvas><b>Events${un+adv?` <span class="qBadge">${un+adv}</span>`:''}</b><small>${evSub}</small></button></div>`;
  return `<div class="pad qPage">${btns}${tab==='events'?eventsSideHtml():questsSideHtml()}</div>`;};

/* the Harbour keeps a small nudge for the Advent Calendar instead of the whole grid */
if(typeof adventHtml==='function'){adventHtml=function(){if(!xmasNow()||!G)return '';const A=adventState();const ready=Array.from({length:24},(_,i)=>i+1).filter(k=>A.open[k]&&!A.claimed(k)).length;
  return `<a class="card advNudge" href="#quests" data-act="goEvents"><span class="advNudgeIco">🎄</span><span class="grow"><b>${ready?`${ready} advent door${ready===1?'':'s'} ready`:'Advent Calendar'}</b><small>${A.nClaimed} of 24 opened · in Quests, Events</small></span><span class="chev">›</span></a>`;};}
ACT.goEvents=()=>{S.view.qtab='events';if(location.hash==='#quests')render();else location.hash='#quests';};
// the door swings open before the reward appears
{const _ad=ACT.advDoor;ACT.advDoor=(d,el)=>{const A=adventState();const k=+d.k;if(el&&A.open[k]&&!A.claimed(k)&&!matchMedia('(prefers-reduced-motion: reduce)').matches){el.classList.add('opening');try{SND.pop&&SND.pop();}catch(e){}setTimeout(()=>_ad(d,el),520);return;}return _ad(d,el);};}

HELP.forEach(h=>{if(h[0]==='The Christmas Event and seasons'&&typeof h[1]==='string')h[1]=h[1].replace('in the Christmas Event tab of Quests','in Quests, under Events');if(h[0]==='Christmas'&&typeof h[1]==='string')h[1]=h[1].replace('The Advent Chest on the Harbour has 24 doors','The Advent Calendar (Quests, then Events) has 24 doors');});
