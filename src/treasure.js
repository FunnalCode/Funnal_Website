/* ============================== TREASURE: RELICS, THE VAULT, MAPS, VENTURES (Stage 6) ==============================
   About 1 in 20 chests and bottles at sea now holds a relic instead of coins. 60 relics in 10 sets of 6; a full set
   pays out once. Torn map pieces drop at 1 in 150 per DM in Lock In; four different pieces make a map, and the next
   Lock In of 25 minutes or more follows it to an X Marks the Spot chest. Spare relics can be donated to the crew's
   current build. Everything is worked out from logged events and claims. */
const RELIC_FROM='2026-11-23';const RELIC_TS=()=>londonTs(RELIC_FROM,0);
const SET_COLS=['#8A8A8A','#C9A24A','#B98A5A','#7A4A9A','#9A6B45','#3FA59A','#E8E8E8','#4A7EC2','#7A3E22','#2E3A5C'];
function relicList(){const rl=(CT().lines||{}).relics||[];const out=[];rl.forEach(([set,names],si)=>names.forEach((n,i)=>out.push({id:`rl_${si}_${i}`,name:n,set,si,i})));return out;}
const RELIC_BY=()=>Object.fromEntries(relicList().map(r=>[r.id,r]));
function relicRoll(seed){const l=relicList();return l.length?l[h32(seed+'rid')%l.length].id:null;}
// chests and bottles at sea: 1 in 20 holds a relic instead of coins
{const _cf=collectFloat;collectFloat=async function(a){try{if(a&&a.collect&&S.me&&!G.players[S.me].claimed.has(a.collect)&&Date.now()>=RELIC_TS()&&h32(a.collect+'relic')%20===0){const rid=relicRoll(a.collect);const r=RELIC_BY()[rid];
  await writeDay(S.me,G.today,{bonus:{[a.collect]:{xp:15,g:0,ts:Date.now(),relic:rid}}});SND.chest();banner('A RELIC!',r.name);toast(`<b>A relic: ${esc(r.name)}.</b> It's gone in the Vault (More, Vault). Set: ${esc(r.set)}.`);return;}}catch(e){}return _cf.apply(this,arguments);};}
function relicCounts(p){const have={};(G.players[p]?.bonus||[]).forEach(b=>{if(b.relic)have[b.relic]=(have[b.relic]||0)+1;if(b.relicGive)have[b.relicGive]=(have[b.relicGive]||0)-1;});return have;}

/* ---------- treasure maps ---------- */
function mapState(p){if(!G)return{pieces:[],maps:[]};const ses=((G.players[p]||{}).sessions||[]).filter(x=>x.s&&x.s>=RELIC_TS());const lock=S.players[p]?.lock;const wins=[...ses.map(x=>[x.s,x.e||x.s+(x.dur||0)]),...(lock&&lock.s>=RELIC_TS()?[[lock.s,Date.now()]]:[])];
  const drops=G.evs.filter(e=>e.pid===p&&e.k==='d'&&e.t>=RELIC_TS()&&wins.some(([s,en])=>e.t>=s&&e.t<=en)&&h32(e.id+'map')%150===0).map(e=>({t:e.t,i:h32(e.id+'mpi')%4})).sort((a,b)=>a.t-b.t);
  const maps=[];let cur=new Set(),loose=[];drops.forEach(d=>{cur.add(d.i);loose.push(d);if(cur.size===4){maps.push({n:maps.length+1,t:d.t});cur=new Set();loose=[];}});
  maps.forEach(m=>{const v=ses.find(x=>x.s>m.t&&x.e&&(x.planned||x.dur)>=25*60000&&(x.full||x.dur>=(x.planned||x.dur)*.95)&&!maps.some(o=>o!==m&&o.voy===x));if(v)m.voy=v;});
  return{pieces:[...cur],loose,maps};}
function readyMap(p){const m=mapState(p).maps.find(x=>!x.voy);return m||null;}
ACT.digMap=async d=>{const n=+d.n;const m=mapState(S.me).maps.find(x=>x.n===n);const key='xm_'+n;if(!m||!m.voy||G.players[S.me].claimed.has(key))return;
  const rid=relicRoll(key+S.me);let piece=null;try{const bs=Object.values(ALL_BOSSES).filter(b=>!b.legend);const b=bs[h32(key+S.me+'b')%bs.length];piece=setOf(b)[2].id;}catch(e){}
  openModal(`<div class="tvGame"><h2>X Marks the Spot</h2><canvas id="digCv" width="480" height="300"></canvas><p id="digMsg" class="tiny">Digging...</p></div>`);const t0=performance.now();
  const step=()=>{const cv=document.getElementById('digCv');if(!cv)return;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);const u=Math.min(1,(performance.now()-t0)/2600);c.fillStyle='#F2D9A0';c.fillRect(0,0,240,150);c.fillStyle='#9FD7F0';c.fillRect(0,0,240,46);
    ell(c,120,112,60*Math.min(1,u*1.6),16*Math.min(1,u*1.6),'#C9A266');for(let i=0;i<8;i++){const p=(u*4+i*.13)%1;disc(c,120+Math.cos(i)*30*p,100-Math.sin(p*Math.PI)*40,2,'#B89060');}
    if(u<.85){line(c,100,60+Math.sin(u*40)*6,124,104+Math.sin(u*40)*6,'#7A5A3A',3);rr(c,120,100+Math.sin(u*40)*6,10,8,2,'#8E9AA6');}
    else{const k=(u-.85)/.15;rr(c,104,96-k*14,32,18,3,'#A8704A');R(c,104,102-k*14,32,3,'#7A4E30');disc(c,120,106-k*14,2.4,'#F2C462');for(let i=0;i<10;i++)disc(c,120+Math.cos(i*.7)*26*k,92-k*14-Math.sin(i*.7)*16*k,1.4,'#F2C462');}
    poly(c,[[60,104],[66,98],[72,104],[66,110]],'#C8102E');if(u<1)requestAnimationFrame(step);};step();
  try{await writeDay(S.me,G.today,{bonus:{[key]:{xp:150,g:300,ts:Date.now(),relic:rid,...(piece?{piece}:{})}}});setTimeout(()=>{const el=document.getElementById('digMsg');if(el)el.innerHTML=`<b>+300 ${CN}, +150 XP</b>, the relic <b>${esc(RELIC_BY()[rid]?.name||'')}</b>${piece?' and a rare loot piece':''}. <button class="btn sm" data-act="closeModal">Lovely</button>`;SFX.ach();},2700);}catch(e){writeFail(e);}};
// the route on the sea while a map voyage is under way
{const _dvM=drawVoyage;drawVoyage=function(c,t,lk,dms,progress){_dvM.apply(this,arguments);try{if(!lk||lk.dur<25*60000||!readyMap(S.me))return;const art=typeof isArtLook==='function'&&isArtLook();c.save();c.setLineDash([3,3]);c.strokeStyle=art?`rgba(255,214,122,${.65+.2*Math.sin(t/500)})`:'rgba(200,16,46,.75)';c.lineWidth=art?1.1:1;if(art){c.shadowColor='rgba(255,200,110,.8)';c.shadowBlur=4;}c.beginPath();c.moveTo(100,150);c.quadraticCurveTo(200,118,300,128);c.stroke();c.setLineDash([]);
  const xx=300-Math.max(0,(1-progress))*0;c.shadowBlur=0;if(art)glowAt(c,xx,128,16,'255,210,120',.45+.15*Math.sin(t/400));line(c,xx-4,124,xx+4,132,art?'#FF6A5A':'#C8102E',1.6);line(c,xx+4,124,xx-4,132,art?'#FF6A5A':'#C8102E',1.6);c.restore();plainTxt(c,`X marks the spot · ${Math.round(progress*100)}%`,262,120,'#FFFFFF',6);}catch(e){}};}

/* ---------- the Vault ---------- */
const RELIC_VALUE=40;
function curProject(){return G&&G.proj?G.proj.find(p=>p.open&&p.funded<p.g)||null:null;}
SCREENS.vault=()=>{const have=relicCounts(S.me);const rl=relicList();const me=G.players[S.me];const ms=mapState(S.me);const rm=readyMap(S.me);const pr=curProject();
  const sets=[...new Set(rl.map(r=>r.si))].map(si=>{const items=rl.filter(r=>r.si===si);const n=items.filter(r=>(have[r.id]||0)>0).length;return{si,set:items[0].set,items,n};});
  const found=rl.filter(r=>(have[r.id]||0)>0).length;const dupes=rl.filter(r=>(have[r.id]||0)>1);
  const digs=ms.maps.filter(m=>m.voy&&!me.claimed.has('xm_'+m.n));
  return `<div class="pad"><div class="card vaultHead"><small>Under the skull cave</small><h2>The Vault</h2><p class="tiny">${found} of ${rl.length} relics found. About 1 in 20 chests and bottles at sea holds a relic instead of coins${Date.now()<RELIC_TS()?` (from ${shortDate(RELIC_FROM)})`:''}. Complete a set of 6 for a one-off reward.</p></div>
   ${digs.map(m=>`<div class="card digCard"><h3>The map led somewhere</h3><p class="tiny">Your Lock In followed the map. Something is buried here.</p><button class="btn primary" data-act="digMap" data-n="${m.n}">Dig</button></div>`).join('')}
   <div class="card"><h3>Treasure map</h3><div class="mapPieces">${[0,1,2,3].map(i=>`<span class="mp ${rm||ms.pieces.includes(i)?'on':''}">${rm||ms.pieces.includes(i)?['NW','NE','SW','SE'][i]:'?'}</span>`).join('')}</div>
    <p class="tiny">${rm?'<b>Map complete.</b> Your next Lock In of 25 minutes or more follows it to X Marks the Spot: 300 doubloons, a relic and a rare loot piece.':`${ms.pieces.length} of 4 pieces. Torn pieces wash up about once every 150 DMs sent during a Lock In.`}</p></div>
   ${sets.map(s=>{const key='rs_'+s.si;const done=s.n===6;const got=me.claimed.has(key);return `<div class="card relicSet"><div class="row between"><h3>${esc(s.set)}</h3><small>${s.n} of 6</small></div><div class="relics">${s.items.map(r=>{const n=have[r.id]||0;return `<div class="relic ${n?'':'none'}"><canvas width="96" height="96" data-relic="${r.id}" data-found="${n?1:0}"></canvas><small>${n?esc(r.name):'???'}${n>1?` ×${n}`:''}</small></div>`;}).join('')}</div>
     ${done?(got?'<span class="okTag">Set reward claimed</span>':`<button class="btn sm primary" data-act="relicSet" data-si="${s.si}">Claim set reward: 250 ${CN}, 150 XP</button>`):''}</div>`;}).join('')}
   <div class="card"><h3>Donate spares</h3>${pr?`<p class="tiny">Spare relics can go to the crew's current build, <b>${esc(pr.name)}</b> (${fmtN(pr.funded)} of ${fmtN(pr.g)}), at ${RELIC_VALUE} doubloons plus 25%.</p>${dupes.length?`<div class="list">${dupes.map(r=>`<div class="li"><span class="grow">${esc(r.name)} <small>×${have[r.id]}</small></span><button class="btn sm" data-act="relicGive" data-id="${r.id}">Donate (+${Math.round(RELIC_VALUE*1.25)})</button></div>`).join('')}</div>`:'<p class="tiny muted">No spares yet.</p>'}`:'<p class="tiny muted">No build is being funded right now.</p>'}</div></div>`;};
ACT.relicSet=async d=>{const si=+d.si;const key='rs_'+si;const have=relicCounts(S.me);if(G.players[S.me].claimed.has(key)||relicList().filter(r=>r.si===si).some(r=>!(have[r.id]>0)))return;try{await writeDay(S.me,G.today,{bonus:{[key]:{xp:150,g:250,ts:Date.now()}}});SFX.ach();banner('SET COMPLETE',relicList().find(r=>r.si===si).set);}catch(e){writeFail(e);}};
ACT.relicGive=async d=>{const have=relicCounts(S.me);const pr=curProject();if(!pr||(have[d.id]||0)<2)return;const amt=Math.min(Math.round(RELIC_VALUE*1.25),pr.g-pr.funded);if(amt<=0)return;
  try{await writeDay(S.me,G.today,{contrib:{[uid()]:{proj:pr.id,amt,ts:Date.now(),relic:d.id}},bonus:{['rd_'+uid()]:{xp:0,g:amt,ts:Date.now(),relicGive:d.id}}});SND.coin();toast(`<b>Donated.</b> +${amt} towards ${esc(pr.name)}. Bill says it was probably worth more.`);}catch(e){writeFail(e);}};
function drawRelic(cv){const r=RELIC_BY()[cv.dataset.relic];const c=cv.getContext('2d');c.setTransform(4,0,0,4,0,0);c.clearRect(0,0,24,24);const f=cv.dataset.found==='1';c.fillStyle=f?'#F4EEDF':'#E6E0D0';c.fillRect(0,0,24,24);
  rr(c,3,17,18,3,1,'#9A6B45');if(!f){txt(c,'?',12,14,'#B8AE98',10,'center');return;}const col=SET_COLS[r.si%SET_COLS.length];const k=h32(r.id)%4;
  if(k===0){ell(c,12,12,5,4,col);disc(c,10.5,10.5,1.2,'rgba(255,255,255,.6)');}else if(k===1){rr(c,8,6,8,11,2,col);R(c,9,9,6,1,'rgba(255,255,255,.4)');}else if(k===2){poly(c,[[12,4],[17,12],[12,17],[7,12]],col);disc(c,12,11,1.2,'rgba(255,255,255,.6)');}else{line(c,7,16,17,6,col,2);disc(c,17,6,2.2,col);}
  rr(c,2,2,20,16,3,'rgba(200,230,255,.25)');}
{const _rdV=render;render=function(){_rdV.apply(this,arguments);try{document.querySelectorAll('canvas[data-relic]').forEach(drawRelic);}catch(e){}};}
APP_ICONS.vault=['#2E3A5C','M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm8 2.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm0 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z'];
{const _moreV=SCREENS.more;SCREENS.more=function(){const h=_moreV.apply(this,arguments);const n=relicList().filter(r=>(relicCounts(S.me)[r.id]||0)>0).length;const tile=`<a href="#vault"><span class="appIco" style="background:${APP_ICONS.vault[0]}"><svg viewBox="0 0 24 24"><path d="${APP_ICONS.vault[1]}"/></svg></span>Vault<small>${n} of 60 relics</small></a>`;const k='<a href="#herald">';return h.includes(k)?h.replace(k,tile+k):h;};}
HELP.push(['Relics and treasure maps','About 1 in 20 chests and bottles at sea now holds a relic instead of coins. There are 60 in 10 sets of 6; a full set pays 250 doubloons and 150 XP once. Torn map pieces wash up about once every 150 DMs during a Lock In; with all four, your next Lock In of 25 minutes or more follows the map to X Marks the Spot (300 doubloons, a relic and a rare loot piece). Spare relics can be donated to the crew\'s current build. All in More, Vault.']);
