/* ============================== THE SALTY HERALD, A PROPER BROADSHEET (Stage 4) ==============================
   Dated each morning about the last working day. Front page with an illustration drawn from the actual boss,
   hunting news, fishing report, sport, Gary's Corner, weather and forecast (real upcoming bosses), classifieds
   (real hints), Dear Mrs B, notices, and a crossword, tide table and cartoon strip at the bottom.
   Loaded before xmas2.js and loot.js so their Christmas edition and legend notes still slot into the front page. */
const HC=()=>((CT().lines||{}).herald)||{};
const hPick=(l,seed)=>l&&l.length?l[h32(String(seed))%l.length]:null;
const dayNo=d=>Math.round((new Date(d+'T12:00:00Z')-new Date('2026-01-05T12:00:00Z'))/86400000);
const hhmm=m=>{m=((m%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');};

function lootOnDay(date,p){const D=G.days[date];if(!D||!D.boss||typeof ROSTER_FROM==='undefined'||date<ROSTER_FROM||!D.target||!(D.p[p]?.d>0))return [];const set=setOf(D.boss);
  if(typeof LEGEND_BY_DATE!=='undefined'&&LEGEND_BY_DATE[date]){const st=legendState(date);return st&&st.won?[set[3]]:[];}if(D.team<D.target)return [];
  const out=[];const rolls=D.boss.weak==='stub'?2:1;for(let r=0;r<rolls;r++){const u=h32(date+p+'loot'+r)%100;out.push(set[u<55?0:u<85?1:u<97?2:3]);}return out;}
function bossQuote(b,seed){const l=(b&&b.sig&&b.sig.length?b.sig:null)||['You got lucky.','I\'ll be back. Probably as soup.','Tell my barnacles I love them.','Worth it.'];return hPick(l,seed);}

/* ---------- the front page story ---------- */
function frontStory(yd,h){const D=h.D,P=G.P;const out={head:h.head,deck:'',special:''};const boss=D.boss||{name:'The fog'};const won=D.target>0&&D.team>=D.target;
  const tm=D.hitMin!=null?` at ${hhmm(D.hitMin)}`:'';
  out.deck=D.target?(won?`${boss.name} was sunk${D.blow?` with the final blow from ${pnameRaw(D.blow)}`:''}${tm}. Crew total ${D.team} of ${D.target}.`:`${boss.name} survived with ${D.target-D.team} HP and is reportedly "quite smug". Crew total ${D.team} of ${D.target}.`):'A day off. The sea was told to behave.';
  const L_=typeof LEGEND_BY_DATE!=='undefined'&&LEGEND_BY_DATE[yd];const se=typeof GSEASONS!=='undefined'&&GSEASONS.find(s=>s.end===yd);
  const prevBest=Object.values(G.days).filter(x=>x.date<yd&&x.target).reduce((a,x)=>Math.max(a,x.team),0);
  if(L_){const st=legendState(yd);out.special='Special edition';out.head=st&&st.won?`${L_.name.toUpperCase()} SUNK. HARBOUR GOES WILD.`:`${L_.name.toUpperCase()} ESCAPES INTO THE DEEP`;}
  else if(se){const sts=P.map(p=>`${pnameRaw(p)} tier ${seasonState(p,se).tier}`).join(', ');out.special='Season finale';out.head=`${se.name.toUpperCase()} ENDS`;out.deck=`The season is over. Final tiers: ${sts}. ${out.deck}`;}
  else if(D.target&&D.team>prevBest&&prevBest>0){out.head=`RECORD DAY: ${D.team} DMS. LIGHTHOUSE KEEPER WEEPS.`;}
  else if(won&&boss.rare){out.head=`RARE SIGHTING: ${boss.name.toUpperCase()} SUNK`;}
  if(D.target&&!won&&yd>=GARY_FROM)out.deck+=' In other news, a local gull has pinched a doubloon from each captain.';
  return out;}

/* ---------- sections ---------- */
function hHunting(yd,D){const P=G.P;const b=D.boss;if(!D.target||!b)return 'No hunting. The monsters had the day off too.';const won=D.team>=D.target;let x='';
  const sunk=Object.values(G.days).filter(d=>d.boss&&d.boss.id===b.id&&d.target&&d.team>=d.target&&d.date<=yd).length;
  x+=won?`<b>${esc(b.name)}</b>${b.title?`, ${esc(b.title)},`:''} went down${D.hitMin!=null?` at ${hhmm(D.hitMin)}`:''}. Its final words: <i>"${esc(bossQuote(b,yd+'q'))}"</i> The crew has now sunk it ${sunk} time${sunk===1?'':'s'}.`
    :`<b>${esc(b.name)}</b> got away with ${D.target-D.team} HP left. Overheard on the way out: <i>"${esc(bossQuote(b,yd+'q'))}"</i>`;
  if(typeof weakBonus==='function'&&yd>=ROSTER_FROM){const wk=P.map(p=>{const w=weakBonus(yd,p);return w&&w.n?`${pnameRaw(p)} ${w.n}`:null;}).filter(Boolean);if(wk.length)x+=`<br>Weak-spot hits: ${wk.join(', ')}.`;}
  const lt=P.flatMap(p=>lootOnDay(yd,p).map(pc=>`${pnameRaw(p)} picked up ${esc(pc.name)} (${pc.rar})`));if(lt.length)x+=`<br>Loot: ${lt.join('; ')}.`;
  return x;}
function hFishing(yd){const P=G.P;let x='';try{x=heraldFish(yd);}catch(e){}
  const rows=P.map(p=>{let l=[];try{l=fishCatches(p).list.filter(f=>f.date===yd);}catch(e){}if(!l.length)return null;const big=l.reduce((a,f)=>f.cm>a.cm?f:a,l[0]);const v=l.filter(f=>f.v).length;
    return `${pnameRaw(p)} landed ${l.length} fish, the biggest a ${esc(big.f.name)} at ${big.cm} cm${v?`, plus ${v} variant${v>1?'s':''}`:''}.`;}).filter(Boolean);
  const gone=hPick(['a cod','a mackerel','a sea bass','something with teeth','a very large sardine'],yd+'gone');
  return `${rows.length?rows.join(' '):'No rods out yesterday. The fish are smug.'} ${x?esc(x):''} The one that got away: ${gone}, measured generously at ${40+h32(yd+'gw')%160} cm.`;}
function hGary(yd){const c=HC().columns||[];const ws=weekStart(yd);const xmasWk=ws.slice(5,7)==='12'&&+ws.slice(8)>=8&&+ws.slice(8)<=14;const wish=c.find(x=>/Christmas/.test(x.t));const pool=c.filter(x=>x!==wish);
  const col=xmasWk&&wish?wish:pool[Math.abs(dayNo(ws)/7|0)%pool.length]||{t:'',b:''};const n=myNest();const cmp=complaintFor(ws);
  return `<h4>${esc(col.t)}</h4><p>${esc(col.b)}</p><p class="tiny">${n.held?`Gary is currently holding ${n.held} of your doubloons. "For safekeeping."`:'Gary is holding none of your doubloons. He is "keeping an eye out".'}${cmp&&cmp.date<=G.today?` This week: Complaint #${cmp.n}, "${esc(cmp.text)}"`:''}</p>`;}
function hWeather(yd){const P=G.P;const winter=typeof seasonOf==='function'&&seasonOf(yd)==='winter';let x=`Yesterday: ${winter?'bitter cold, frost on the rigging':'mild, a light breeze'}${xmasNowSafe()?', tinsel in the air':''}. ${hPick(HC().forecast,yd+'w0')}.`;
  const days=[];let d=G.today;for(let i=0;i<10&&days.length<4;i++){if(isWork(d))days.push(d);d=addDays(d,1);}
  x+=`<div class="fcast">${days.map(dd=>{let b=null;try{b=bossFor(dd);}catch(e){}const lg=typeof LEGEND_BY_DATE!=='undefined'&&LEGEND_BY_DATE[dd];
    return `<div><b>${dd===G.today?'Today':DAYN[wd(dd)]}</b><span>${esc(hPick(HC().forecast,dd+'fc')||'')}</span><small>${lg?`<span class="lgWarn">LEGEND WARNING: ${esc(lg.name)}</span>`:b?`Chance of ${esc(b.name)}`:''}</small></div>`;}).join('')}</div>`;return x;}
function hClassifieds(yd){const ads=[];const P=G.P;
  if(typeof LEGENDS!=='undefined'){const nx=LEGENDS.find(l=>l.date>=G.today);if(nx&&dayNo(nx.date)-dayNo(G.today)<=21)ads.push(`WANTED: brave captains for ${niceDate(nx.date)}'s ${nx.name}. Bring snacks. And about 1.4 times the usual DMs.`);}
  for(let i=0;i<7;i++){const d=addDays(G.today,i);if(merchantToday(d)){ads.push(i===0?"ARRIVED: Pell's barge is in the harbour today. Rare stock, fair prices, greedy merchant.":`COMING SOON: Pell's barge docks ${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][wd(d)]}. Start saving.`);break;}}
  ads.push(marketOpen()?'NIGHT TRADER: far side of the island, open now until 1am. No questions. No Gary.':'NIGHT TRADER: far side of the island, 9pm to 1am. Duplicate loot bought. No questions. No Gary.');
  try{const {have}=bossLoot(S.me);const near=Object.values(ALL_BOSSES).map(b=>({b,set:setOf(b)})).map(x=>({...x,n:x.set.filter(pc=>have[pc.id]>0).length})).filter(x=>x.n===3)[0];
    if(near){const miss=near.set.find(pc=>!(have[pc.id]>0));ads.push(`WANTED: one ${miss.name}. Completes a set. Will pay in chips. Ask for Captain ${pnameRaw(S.me)}.`);}}catch(e){}
  const n=myNest();if(n.held)ads.push(`LOST: ${n.held} doubloon${n.held>1?'s':''}. Last seen in a gull's beak. Return on the next target day, the gull says.`);
  ads.push(hPick(HC().ads,yd+'ad'),hPick(HC().ads,yd+'ad2'));return [...new Set(ads.filter(Boolean))].slice(0,5).map(a=>`<p class="ad">${esc(a)}</p>`).join('');}
function hMrsB(yd){const l=HC().mrsB||[];const x=hPick(l,yd+'mrsb');return x?`<p><b>${esc(x.q)}</b></p><p>${esc(x.a)} <i>Mrs B.</i></p>`:'';}
function hBottom(yd){const cw=HC().crossword||[];const i=Math.abs(dayNo(yd))%Math.max(1,cw.length);const prev=cw[(i+cw.length-1)%cw.length];
  const base=(dayNo(yd)*50+300)%745;const hi=[base,base+745],lo=[base+372,base+1117];
  const st=HC().strips||[];const strip=st[Math.abs(dayNo(weekStart(yd))/7|0)%Math.max(1,st.length)]||[];
  return `<div class="hBottom"><div><h4>Crossword</h4><p>${cw[i]?esc(cw[i].c):''}</p><p class="tiny muted">Yesterday: ${prev?esc(prev.a):''}</p></div>
   <div><h4>Tides, Funnal Cove</h4><p class="tiny">High ${hhmm(hi[0])} and ${hhmm(hi[1])}<br>Low ${hhmm(lo[0])} and ${hhmm(lo[1])}</p></div></div>
   ${strip.length?`<div class="hStrip"><h4>Gull Talk, this week's strip</h4><div class="panels">${strip.map((s,k)=>`<figure><canvas width="200" height="150" data-strip="${k}" data-seed="${yd}"></canvas><figcaption>${esc(s)}</figcaption></figure>`).join('')}</div></div>`:''}`;}

/* ---------- the broadsheet ---------- */
const _heraldBase=SCREENS.herald;
SCREENS.herald=function(){const raw=_heraldBase.apply(this,arguments);const rest=raw.includes('</article>')?raw.slice(raw.indexOf('</article>')+10):'';
  const yd=G.workdays.filter(d=>d<G.today).pop()||G.today;const h=herald(yd);const D=h.D;const P=G.P;
  const all=Object.values(S.forfeits).filter(Boolean).sort((a,b)=>b.ts-a.ts);const owed=all.filter(f=>f.kind==='real'&&f.status==='spun');
  const quote=P.map(p=>activeForfeitsFor(p).find(f=>f.result==='headline')).find(Boolean);const fs=frontStory(yd,h);
  const head=quote?`${(C().players[quote.pid]?.name||'').toUpperCase()} FAILS. NATION IN SHOCK. MORE AT 11.`:fs.head;const no=G.workdays.filter(d=>d<=yd).length;
  const won=D.target>0&&D.team>=D.target;
  const art=`<article class="paper bsheet"><div class="mast"><small>Est. the day the first cannon fired · Price: one DM</small><h1>THE SALTY HERALD</h1><small>${esc(niceDate(yd))} · No. ${no}${fs.special?` · <b class="hSpecial">${esc(fs.special)}</b>`:''}</small></div>
   <div class="head">${esc(head)}</div><p class="deck">${esc(fs.deck)}</p>
   ${D.target&&D.boss?`<figure class="hIllo"><canvas width="640" height="280" data-hillo="${yd}"></canvas><figcaption>${won?`${esc(D.boss.name)}, moments before going under. Artist's impression (Gary).`:`${esc(D.boss.name)}, pictured looking pleased with itself. Artist's impression (Gary).`}</figcaption></figure>`:''}
   <div class="hGrid">
    <section><h3>Hunting news</h3><p>${hHunting(yd,D)}</p></section>
    <section><h3>Sport</h3><p>${P.map(p=>`${pname(p)}: <b>${D.p[p].d}</b> DMs, ${D.p[p].f||0} follow-ups, ${D.p[p].r} replies, ${D.p[p].v} video, ${D.p[p].m} meetings, ${D.p[p].c} clients`).join('<br>')}<br>Team: <b>${D.team}</b>${D.target?' of '+D.target:''}</p><p>${D.p[h.top].d===D.p[h.bottom]?.d?'Dead heat. Both captains refuse to comment.':`${pname(h.top)} won the day by ${D.p[h.top].d-D.p[h.bottom].d}.`} ${hPick(['Sources close to the loser cite "a dodgy wifi signal".','The gulls were unavailable for comment.','A rematch has been demanded.','The bakery has named a bun after the winner.'],yd)}</p></section>
    <section><h3>Fishing report</h3><p>${hFishing(yd)}</p></section>
    <section class="hGary"><h3>Gary's Corner</h3>${hGary(yd)}</section>
    <section><h3>Weather and forecast</h3><p>${hWeather(yd)}</p></section>
    <section><h3>Classifieds</h3>${hClassifieds(yd)}</section>
    <section><h3>Dear Mrs B</h3>${hMrsB(yd)}</section>
    <section><h3>Notices</h3><p><b>Bottle post.</b> ${heraldBottle(yd,D)}</p><p><b>Achievements.</b> ${h.achs.length?h.achs.slice(0,6).map(x=>`${pname(x.p)}: <i>${esc(x.a.name)}</i>`).join(', '):'A quiet day in the trophy cabinet.'}</p><p><b>Outstanding forfeits.</b> ${owed.length?owed.slice(0,5).map(f=>`${pname(f.pid)}: ${esc(f.text)}`).join('; '):'All debts settled. Suspicious.'}</p></section>
   </div>${hBottom(yd)}</article>`;
  return `<div class="pad">${art}${rest}`;};

/* ---------- drawings: the front-page illustration and the strip ---------- */
function paintHillo(cv){const yd=cv.dataset.hillo;const D=G.days[yd];if(!D||!D.boss)return;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);const won=D.team>=D.target;
  c.fillStyle='#E9DFC6';c.fillRect(0,0,320,140);for(let i=0;i<9;i++){c.strokeStyle='rgba(90,74,48,.18)';c.lineWidth=.6;c.beginPath();c.moveTo(0,20+i*6);c.lineTo(320,20+i*6+((i%2)?2:-2));c.stroke();}
  try{const r=won?26:30;drawBoss(c,D.boss,210,won?96:78,r,won?.05:.7,1200,false,D.boss.kit&&D.boss.kit.floats?null:110);}catch(e){}
  c.fillStyle='#B9AC8E';c.fillRect(0,104,320,36);for(let i=0;i<14;i++){c.strokeStyle='rgba(60,50,35,.35)';c.lineWidth=.7;c.beginPath();const y=108+(i%5)*6;c.moveTo(i*24-8,y);c.quadraticCurveTo(i*24+4,y-3,i*24+16,y);c.stroke();}
  if(won)for(let i=0;i<10;i++)disc(c,190+(i*13)%46,98-(i*7)%40,1+(i%3)*.6,'rgba(255,255,255,.75)');
  const pl=S.players[G.P[0]]||{};try{drawShip(c,80,124,.62,pl,1200,{pid:G.P[0],phase:0});}catch(e){}
  drawGull(c,40,26,0);cv.classList.add('inked');}
function paintStrip(cv){const k=+cv.dataset.strip;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);c.fillStyle='#F4ECD8';c.fillRect(0,0,100,75);c.fillStyle='#CFC3A6';c.fillRect(0,58,100,17);
  c.strokeStyle='rgba(58,47,34,.45)';c.lineWidth=.6;for(let i=0;i<5;i++){c.beginPath();c.moveTo(i*22,64);c.quadraticCurveTo(i*22+6,61,i*22+12,64);c.stroke();}
  const g=(x,y,t)=>{c.save();c.translate(x,y);c.scale(3,3);drawGull(c,0,0,t);c.restore();};
  if(k===0){g(30,38,0);disc(c,70,56,4,'#E8B43A');disc(c,69,55,1.4,'#FFF4C0');}
  else if(k===1){g(38,14,75);c.strokeStyle='rgba(58,47,34,.6)';c.lineWidth=.9;for(let i=0;i<3;i++){c.beginPath();c.moveTo(8+i*4,22+i*5);c.lineTo(30+i*4,22+i*5);c.stroke();}}
  else{g(34,38,0);txt(c,'!',76,30,'#C8102E',22,'center');}c.strokeStyle='#3A2F22';c.lineWidth=1;c.strokeRect(.5,.5,99,74);cv.classList.add('inked');}
{const _rdHe=render;render=function(){_rdHe.apply(this,arguments);try{document.querySelectorAll('canvas[data-hillo]').forEach(paintHillo);document.querySelectorAll('canvas[data-strip]').forEach(paintStrip);}catch(e){console.warn('herald art',e);}};}
