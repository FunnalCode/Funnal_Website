/* ============================== v9: hunts, sharks, celebrations, crew goals, ventures, reviews ============================== */
const JOINT_NEED=30,CREW_WEEK_NEED=5;
const pickR=a=>a[Math.floor(Math.random()*a.length)];
// S.coveDm is only set while the Funnal Cove page draws its preview of the town at another size
const TEAMDM=()=>S.coveDm!=null?S.coveDm:(G.players[G.P[0]]?.m.teamDm||0);
const VENTURES=[
 {id:'v1',dm:2500,name:'The Funnal Jetty',g:600,xp:600,desc:'A proper jetty for the cove. Gary insists on a gull-only lane.'},
 {id:'v2',dm:6000,name:'The Grand Lighthouse',g:1200,xp:1000,desc:'A lighthouse so bright it shows up on other people\'s Instagram.'},
 {id:'v3',dm:12000,name:'Statue of the Captains',g:2000,xp:1600,desc:'A giant statue of you both. Pigeons sold separately.'},
 {id:'v4',dm:25000,name:'Fort Funnal',g:3500,xp:2500,desc:'A stone fort on the headland, cannons and all. Gary has claimed the tallest tower.'},
 {id:'v5',dm:50000,name:'The Golden Fleet',g:6000,xp:4000,desc:'A fleet of golden ships moored in the bay. Unnecessary. Glorious.'},
 {id:'v6',dm:100000,name:'Funnal Island',g:12000,xp:8000,desc:'One hundred thousand DMs. The island is officially yours. Gary is the mayor.'}];

/* ---------- economy: bigger moments for meetings and clients, top-end prices softened ---------- */
KINDS.m.g=150;KINDS.m.xp=400;KINDS.c.g=1000;KINDS.c.xp=2000;
ITEMS.forEach(i=>{if(i.price>10000&&!i._p9){i._p9=1;i.price=Math.round(i.price*.7/100)*100;}});

/* ---------- sharks: 11 more fish, 120 in total (new pools apply to casts from tonight) ---------- */
const FISH_V3_AT=Date.UTC(2026,10,14,0,0);
[['Blacktip Reef Shark','uncommon',150,0],['Lemon Shark','uncommon',240,1],['Nurse Shark','uncommon',280,0],['Bull Shark','rare',300,1],['Mako Shark','rare',320,1],['Thresher Shark','rare',500,2],['Tiger Shark','epic',450,2],['Basking Shark','epic',800,2],['Great White Shark','legendary',550,2],['Whale Shark','legendary',1200,2],['Megalodon','mythic',1800,3]]
 .forEach(([name,rar,len,depth],i)=>{const h=h32('fish'+name);const id='f_'+name.toLowerCase().replace(/[^a-z]+/g,'_');const pal={Lemon:['#D9C25A','#F2E8B0'],Tiger:['#8C9AA6','#5A6774'],Bull:['#7E8A96','#DDE3E8'],Nurse:['#B89A72','#EBDCC4'],Mako:['#3E6FD0','#DCE6F7'],Blacktip:['#8C99A6','#E9EEF2'],Thresher:['#6E5E8C','#DCD6E8'],Basking:['#5E6670','#B8C0C8']}[name.split(' ')[0]]||['#7E8C99','#E9EEF2'];
  const f={id,name,rar,i:FISH.length,shape:'shark',c1:pal[0],c2:pal[1],pat:name.startsWith('Tiger')?'stripes':'belly',len,depth,time:'',v3:1};FISH.push(f);FISH_BY_ID[id]=f;});
Object.keys(_fpool).forEach(k=>delete _fpool[k]);
Object.assign(FA,{
 f_great_white_shark(c,t){const sw=Math.sin(t/220)*.18;c.save();c.translate(-9,0);c.rotate(sw);poly(c,[[0,0],[-5,-6],[-3.4,0],[-5,4.6]],'#6E7B88');c.restore();c.fillStyle='#7E8C99';c.beginPath();c.moveTo(12,1);c.quadraticCurveTo(7,-6.4,-9,-1.4);c.quadraticCurveTo(-2,6,12,1);c.fill();
  c.save();c.beginPath();c.moveTo(12,1);c.quadraticCurveTo(7,-6.4,-9,-1.4);c.quadraticCurveTo(-2,6,12,1);c.clip();ell(c,2,3.4,11,2.6,'#F2F5F7');c.restore();poly(c,[[-1,-3.4],[1.6,-10.4],[4.6,-3.4]],'#6E7B88');poly(c,[[0,2],[3,6.4],[4,2.4]],'#6E7B88');
  c.fillStyle='#8E2232';c.beginPath();c.moveTo(4.6,1.2);c.quadraticCurveTo(9,3.8,12,1.2);c.quadraticCurveTo(9,2,4.6,1.2);c.fill();for(let i=0;i<5;i++){poly(c,[[5.2+i*1.3,1.3],[5.8+i*1.3,2.6],[6.4+i*1.3,1.4]],'#fff');}for(let i=0;i<3;i++)line(c,1.6+i*1.1,-1.6,1.2+i*1.1,.6,'rgba(40,50,60,.45)',.35);disc(c,7.6,-1.6,.8,'#1F2630');disc(c,7.8,-1.8,.25,'#fff');},
 f_whale_shark(c,t){const sw=Math.sin(t/300)*.14;c.save();c.translate(-9,0);c.rotate(sw);poly(c,[[0,0],[-4,-6.4],[-3,0],[-4,5]],'#3E5B7A');c.restore();ell(c,1,0,11,5,'#4A6E94');c.save();c.beginPath();c.ellipse(1,0,11,5,0,0,TAU);c.clip();ell(c,1,3.6,12,2.4,'#DCE6EE');
  for(let r=0;r<3;r++)for(let i=0;i<8;i++)disc(c,-8+i*2.4+(r%2)*1.2,-3.4+r*1.6,.45,'#EAF1F6');for(let i=0;i<4;i++)line(c,-6+i*3.2,-5,-6.6+i*3.2,1,'rgba(234,241,246,.6)',.3);c.restore();poly(c,[[-2,-4.6],[0,-8.6],[2.4,-4.6]],'#3E5B7A');rr(c,8,-.4,4,2,1,'#2E4A66');disc(c,9.4,-2,.6,'#1F2630');for(let i=0;i<3;i++){const q=((t/1500)+i/3)%1;disc(c,13+q*3,-1-q*5,.5+q*.6,`rgba(255,255,255,${.7*(1-q)})`);}},
 f_megalodon(c,t){glowAt(c,0,0,14,'255,90,70',.25);const sw=Math.sin(t/200)*.2;c.save();c.translate(-10,0);c.rotate(sw);poly(c,[[0,0],[-5,-7],[-3.4,0],[-5,5.6]],'#2A2F3A');c.restore();c.fillStyle='#3A404C';c.beginPath();c.moveTo(12,1.6);c.quadraticCurveTo(7,-7.6,-10,-1.6);c.quadraticCurveTo(-2,7,12,1.6);c.fill();
  for(let i=0;i<4;i++)line(c,-6+i*3.6,-4.6,-7.6+i*3.6,1.4,'rgba(200,210,220,.25)',.6);poly(c,[[-2,-4.4],[1.4,-12],[5,-4]],'#2A2F3A');c.fillStyle='#5A0F1A';c.beginPath();c.moveTo(3,1);c.quadraticCurveTo(8,6.4,12.4,1.6);c.quadraticCurveTo(8,2.6,3,1);c.fill();for(let i=0;i<6;i++){poly(c,[[3.6+i*1.4,1.1],[4.3+i*1.4,3],[5+i*1.4,1.3]],'#FFF8E6');poly(c,[[4+i*1.3,4.4-i*.4],[4.6+i*1.3,2.8-i*.3],[5.2+i*1.3,4.2-i*.4]],'#FFF8E6');}
  disc(c,8,-2.2,1,'#FF4A3A');disc(c,8.2,-2.4,.3,'#FFE0DA');c.strokeStyle='rgba(200,210,220,.5)';c.lineWidth=.35;c.beginPath();c.moveTo(-4,-1);c.lineTo(-1,1.4);c.moveTo(0,-3);c.lineTo(2,-1);c.stroke();}});

/* ---------- monster hunts: waves, crits, Elites and a Bestiary ---------- */
const MON_PARTS={seal:['Whisker','Grumpy Fish','Monocle'],crab:['Barnacle Shell','Pincer Tip','Crown'],octopus:['Ink Sac','Golden Sucker','Tiny Top Hat'],storm:['Cloud Wisp','Bottled Lightning','Eye of the Storm'],serpent:['Shed Scale','Fang','Coiled Crown'],ship:['Ship\'s Bell','Cursed Doubloon','Captain\'s Hat'],ghost:['Ectoplasm Jar','Ghostly Lantern','Phantom Compass'],whale:['Bottled Whale Song','Ambergris','Leviathan Pearl'],kraken:['Tentacle Tip','Kraken Beak','Heart of the Deep']};
const PART_RAR=['common','rare','legendary'];
// hunts started after the v10 update have much tougher monsters (you can send 5 DMs a minute) and pay a little less gold per kill
function monBase(id,t0){const d=VOYAGE_DIFF[id];const T=VOYAGE_TIERS.find(x=>x.id===d.tier);return Math.round(3+T.m*d.rate*((t0||Date.now())>=V10_AT?.8:.2));}
function huntPart(mon,k){const d=VOYAGE_DIFF[mon];const nm=(MON_PARTS[d.type]||MON_PARTS.seal)[k];return{id:mon+'_'+k,mon,k,rar:PART_RAR[k],name:`${d.name.replace(/^The /,'')}'s ${nm}`};}
function huntWave(tierMons,start,n,t0){const mon=tierMons[(start+n)%tierMons.length];const elite=(n+1)%4===0;return{n,mon,elite,hp:Math.round(monBase(mon,t0)*(1+.15*n)*(elite?1.5:1))};}
function huntRun(sid,diff,dms,t0){const d=VOYAGE_DIFF[diff];if(!d||!d.tier)return{kills:[],cur:null,crits:0};const T=VOYAGE_TIERS.find(x=>x.id===d.tier);const ti=VOYAGE_TIERS.indexOf(T);const mons=T.mon.map(m=>m[0]);const start=Math.max(0,mons.indexOf(diff));
  const kills=[];let n=0,w=huntWave(mons,start,0,t0),dmg=0,crits=0,last=null;const nw=(t0||Date.now())>=V10_AT;
  for(const e of dms){const crit=h32(e.id+'crit')%100<12;if(crit)crits++;dmg+=crit?3:1;last={id:e.id,crit,t:e.t};
    while(dmg>=w.hp){dmg-=w.hp;const base=monBase(w.mon,t0);const r=h32(String(h32(sid+'drop'+n))+'x')%100;const k=w.elite?(r<35?2:1):(r<7?2:r<33?1:0);
      kills.push({n,mon:w.mon,elite:w.elite,t:e.t,xp:Math.round(base*3+ti*15)*(w.elite?2:1),g:Math.round(nw?base*.45+ti*3:base*.9+ti*4)*(w.elite?2:1),drop:huntPart(w.mon,k)});n++;w=huntWave(mons,start,n,t0);}}
  return{kills,cur:{...w,dmg,left:w.hp-dmg},crits,last};}
let _huntMemo={k:''};
function huntLive(lk){if(!G||!lk)return null;const k=lk.id+'|'+G.evs.length;if(_huntMemo.k===k)return _huntMemo.v;const dms=G.evs.filter(e=>e.pid===S.me&&e.k==='d'&&e.t>=lk.s);const v=huntRun(lk.id,lk.diff,dms,lk.s);_huntMemo={k,v};return v;}
function drawMonster(c,mon,x,y,r,ratio,t,flash,elite){const vd=VOYAGE_DIFF[mon]||{};const type=vd.type||'seal';
  if(elite){glowAt(c,x,y-r*.2,r*2,'255,214,110',.45+.15*Math.sin(t/200));}
  if(type==='seal'){const sc=flash?'#fff':vd.col;ell(c,x,y+4,r,r*.62,sc);disc(c,x+r*.6,y-r*.2,r*.55,sc);disc(c,x+r*.45,y-r*.35,r*.12,'#3F3A30');disc(c,x+r*.85,y-r*.35,r*.12,'#3F3A30');ell(c,x+r*.7,y-r*.05,r*.22,r*.14,'#5A5650');}
  else drawBoss(c,{type:type==='ghost'?'ship':type,ghost:type==='ghost',col:elite?'#F2C462':vd.col,eye:'#3F3A30'},x,y-r*.3,r,ratio,t,flash,y+r*.2);
  if(elite){const cy=y-r*1.25+Math.sin(t/400);poly(c,[[x-5,cy+3],[x-5,cy-2],[x-2.5,cy+.5],[x,cy-3.6],[x+2.5,cy+.5],[x+5,cy-2],[x+5,cy+3]],'#F2C462');disc(c,x,cy+1,.9,'#E0457B');}}
function drawHuntV2(c,t,lk,mx,my){const h=huntLive(lk);if(!h||!h.cur){S.target=null;return;}const w=h.cur;const now=performance.now();const K=S.huntFx&&S.huntFx.lk===lk.id?S.huntFx:null;
  const since=K?now-K.at:1e9;const r=10+12*(w.left/w.hp);
  if(K&&since<1400){const q=since/1400;const pw=K.kill;const pr=12;c.save();c.beginPath();c.rect(0,0,W,my+pr*.2+(1-q)*0);c.clip();c.translate(Math.sin(since/40)*2*(1-q),q*30);c.rotate(q*.5);drawMonster(c,pw.mon,mx,my,pr,0,t,since<120,pw.elite);c.restore();
    for(let i=0;i<14;i++){const a=i/14*TAU,d=q*34;disc(c,mx+Math.cos(a)*d,my-6+Math.sin(a)*d*.6+q*q*14,2.2*(1-q)+.3,i%2?'#FFD45A':'#FFFFFF');}lamp(c,mx,my,40*(1-q),.8*(1-q),'255,220,140');
    c.globalAlpha=Math.min(1,(1-q)*3);txt(c,pw.elite?'ELITE SUNK!':'SUNK!',mx,my-34-q*8,pw.elite?'#C07E0C':'#2C3E50',12,'center');c.globalAlpha=1;S.target=null;}
  else{const rise=K&&since<2400?Math.min(1,(since-1400)/1000):1;c.save();c.beginPath();c.rect(0,0,W,my+r*.2);c.clip();c.translate(0,(1-rise)*30);drawMonster(c,w.mon,mx,my,r,w.left/w.hp,t,S.bossFlash>t,w.elite);c.restore();S.target=rise>=1?{x:mx,y:my}:null;
    for(let i=0;i<3;i++){const q=((t/1000)+i/3)%1;c.strokeStyle=`rgba(255,255,255,${.6*(1-q)})`;c.lineWidth=.7;c.beginPath();c.ellipse(mx,my+r*.25,r*(1+q*.5),r*.12*(1+q),0,0,TAU);c.stroke();}}
  const vd=VOYAGE_DIFF[w.mon];rr(c,mx-34,my-r-24,68,16,6,'rgba(255,252,244,.94)');txt(c,`Wave ${w.n+1}${w.elite?' · ELITE':''}`,mx,my-r-20,w.elite?'#C07E0C':'#7F8A95',6,'center');txt(c,vd.name,mx,my-r-13.6,'#2C3E50',6.6,'center');
  rr(c,mx-26,my-r-6,52,4,2,'#E9E1CC');rr(c,mx-26,my-r-6,52*(w.left/w.hp),4,2,w.elite?'#E2AE2C':'#E0453B');
  if(S.huntCrit&&now-S.huntCrit<900){const q=(now-S.huntCrit)/900;c.globalAlpha=1-q;txt(c,'CRIT ×3',mx+18,my-14-q*14,'#E0453B',9,'center');c.globalAlpha=1;}
  txt(c,`${h.kills.length} sunk this hunt`,160,16,'#3F5160',7,'center');
  hit(mx-r-6,my-r-26,r*2+12,r*2+30,`${vd.name} · wave ${w.n+1}`,`${w.left} of ${w.hp} HP left. Every DM fires a cannonball (about 1 in 8 is a critical hit for 3 damage). Sink it and the next monster arrives, a little tougher. Every 4th wave is an Elite worth double with a better drop. Each kill drops a part for your Bestiary.`);}
function huntCheck(){const lk=S.players[S.me]?.lock;if(!lk||isFish(lk.mode)||lk.hv!==2){S.huntSeen=null;return;}const h=huntLive(lk);if(!h)return;
  if(!S.huntSeen||S.huntSeen.lk!==lk.id){S.huntSeen={lk:lk.id,n:h.kills.length,last:h.last?.id};return;}
  if(h.last&&h.last.id!==S.huntSeen.last&&h.last.crit)S.huntCrit=performance.now();
  if(h.kills.length>S.huntSeen.n){const k=h.kills[h.kills.length-1];S.huntFx={lk:lk.id,at:performance.now(),kill:k};const own=G.players[S.me].drops||{};const first=!(own[k.drop.id]);
    toast(`<b>${k.elite?'Elite sunk!':'Sunk!'} +${k.xp} XP, +${k.g} ${CN}</b> Dropped <span class="rtag r-${k.drop.rar}">${k.drop.rar}</span> ${esc(k.drop.name)}${first?' (new for your Bestiary)':''}`,k.drop.rar==='legendary'||k.elite?'level':'');try{(k.elite||k.drop.rar==='legendary'?SND.level:SND.chest)();}catch(e){}}
  S.huntSeen={lk:lk.id,n:h.kills.length,last:h.last?.id};}
function huntCardHtml(lk){const h=huntLive(lk);if(!h||!h.cur)return '';const w=h.cur,vd=VOYAGE_DIFF[w.mon];const xp=h.kills.reduce((a,k)=>a+k.xp,0),g=h.kills.reduce((a,k)=>a+k.g,0);
  return `<div class="vboss"><small>Wave ${w.n+1}${w.elite?' · Elite':''} · ${esc(vd.name)}</small><div class="hp"><i class="s" style="width:${100-w.left/w.hp*100}%"></i><i class="x" style="flex:1"></i><span>${w.left} / ${w.hp} HP</span></div>
   <small>${h.kills.length?`${h.kills.length} sunk so far: +${xp} XP and ${g} ${CN} banked when you land.`:'Sink it and the next one arrives. Every 4th wave is an Elite.'}</small>${h.kills.length?`<div class="drops">${h.kills.slice(-8).reverse().map(k=>`<span class="rtag r-${k.drop.rar}" title="${esc(k.drop.name)}">${esc(k.drop.name.split("'s ").pop())}</span>`).join('')}</div>`:''}</div>`;}
SCREENS.bestiary=()=>{const pid=S.view.bestP||S.me;const me=G.players[pid];const dr=me.drops||{};const vk=me.m?{}:{};let got=0,tot=0;
  return `<div class="pad"><div class="row between"><h2>Bestiary</h2><div class="seg mini">${G.P.map(p=>`<button class="${p===pid?'on':''}" data-act="bestP" data-p="${p}">${pname(p)}</button>`).join('')}</div></div><p class="muted tiny">Every monster you sink on a Lock In hunt drops a part: common, rare or a legendary trophy. Elites drop better ones.</p>
  ${VOYAGE_TIERS.map(T=>`<div class="card"><h3>${esc(T.name)} <small class="muted">(${T.m} min hunts)</small></h3><div class="best">${T.mon.map(([id])=>{const d=VOYAGE_DIFF[id];const parts=[0,1,2].map(k=>huntPart(id,k));parts.forEach(p=>{tot++;if(dr[p.id])got++;});const kills=(me.vk||{})[id]||0;
    return `<div class="bRow"><canvas class="monIco" width="120" height="120" data-mon="${id}"></canvas><div class="grow"><b>${esc(d.name)}</b><div class="parts">${parts.map(p=>`<span class="part ${dr[p.id]?'got r-'+p.rar:''}">${dr[p.id]?esc(p.name.split("'s ").pop())+(dr[p.id]>1?' ×'+dr[p.id]:''):'???'}</span>`).join('')}</div><small class="muted">${kills} sunk${kills&&!parts.some(p=>dr[p.id])?' (before parts existed)':''}</small></div></div>`;}).join('')}</div></div>`).join('')}
  <p class="tiny muted" style="text-align:center">${got} of ${tot} parts collected.</p></div>`;};
ACT.bestP=d=>{S.view.bestP=d.p;render();};

/* ---------- celebrations for meetings and clients ---------- */
function bigFx(kind,e){$('#bigFx')?.remove();const o=other(e.pid);const isC=kind==='c';const host=$('#focus')||document.body;const me=e.pid===S.me;
  host.insertAdjacentHTML('beforeend',`<div id="bigFx" class="bf-${kind}" data-act="bigFxClose"><canvas id="bigFxCv"></canvas><div class="bfCard"><small>${isC?'Cannon salute':'All hands on deck'}</small><h1>${isC?'NEW CLIENT!':'MEETING BOOKED!'}</h1><h2>${esc(e.pr||'A mystery prospect')}</h2>
   <p>${me?'You did it':pname(e.pid)+' did it'}. +${fmtN(KINDS[kind].g)} ${CN} and +${fmtN(KINDS[kind].xp)} XP for both captains.</p><p class="bfQuip">${esc(pickR(isC?CLIENT_QUIPS:MEET_QUIPS))}</p>${isC?'<p class="tiny">Added to the Hall of Fame.</p>':''}<small class="muted">tap to carry on</small></div></div>`);
  const cv=$('#bigFxCv'),cx=cv.getContext('2d');const dpr=Math.min(2,window.devicePixelRatio||1);const fit=()=>{cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;};fit();const t0=performance.now();const parts=[];
  const burst=(x,y,n,cols)=>{for(let i=0;i<n;i++){const a=Math.random()*TAU,v=2+Math.random()*5;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.5,life:1,col:cols[i%cols.length],s:2+Math.random()*3});}};
  const cols=isC?['#F2C462','#FFE79A','#E0457B','#FFFFFF','#45B07C']:['#45B07C','#7CC7E6','#F2C462','#FFFFFF'];
  const step=now=>{if(!$('#bigFx'))return;const el=now-t0;const Wd=cv.width,Hd=cv.height;cx.clearRect(0,0,Wd,Hd);
    if(Math.random()<(el<3500?.14:.04))burst(Wd*(.15+Math.random()*.7),Hd*(.1+Math.random()*.35),isC?60:36,cols);
    if(isC&&el<4000&&Math.random()<.05){for(let i=0;i<12;i++)parts.push({x:Math.random()<.5?0:Wd,y:Hd*.75,vx:(Math.random()<.5?1:-1)*(3+Math.random()*3),vy:-8-Math.random()*4,life:1.4,col:'#F2C462',s:4,coin:1});}
    for(const p of parts){p.x+=p.vx*dpr;p.y+=p.vy*dpr;p.vy+=.12;p.vx*=.985;p.life-=.012;if(p.life<=0)continue;cx.globalAlpha=Math.min(1,p.life);cx.fillStyle=p.col;cx.beginPath();if(p.coin){cx.ellipse(p.x,p.y,p.s*dpr*Math.abs(Math.cos(el/90+p.x)),p.s*dpr,0,0,TAU);}else cx.arc(p.x,p.y,p.s*dpr*p.life,0,TAU);cx.fill();}
    cx.globalAlpha=1;for(let i=parts.length-1;i>=0;i--)if(parts[i].life<=0)parts.splice(i,1);requestAnimationFrame(step);};requestAnimationFrame(step);
  try{SND.cannon();setTimeout(()=>SND.cannon(),220);setTimeout(()=>SND.level(),520);if(isC)setTimeout(()=>SND.horn(),900);}catch(err){}
  clearTimeout(S.bfT);S.bfT=setTimeout(()=>$('#bigFx')?.remove(),isC?9000:6500);}
ACT.bigFxClose=()=>$('#bigFx')?.remove();
const CLIENT_QUIPS=['Gary has fainted. He is fine. He is being dramatic.','Somewhere, a competitor just felt a chill.','The parrot has started a slow clap. It cannot clap. It is trying anyway.','Retainer secured? Gary is already spending it on chips.','Pell has closed the barge early to celebrate. Out of respect. And envy.','The sea foe has resigned in shame.','Somebody tell the Herald. Actually, Gary already did. Loudly.','Champagne for the crew. Fish for Gary. Everyone wins.'];
const MEET_QUIPS=['Gary is ironing his best feathers.','A real human wants to talk to you. On purpose. Incredible.','Put the kettle on. Practise your firm handshake.','The parrot has prepared a slideshow. It is mostly crackers.','Remember: smile, nod, mention the retainer.','Gary suggests wearing trousers for this one.'];
function checkMC(){if(!G||!S.me)return;const ids=new Set(G.evs.filter(e=>e.k==='m'||e.k==='c').map(e=>e.id));if(!S.mcSeen){S.mcSeen=ids;return;}
  const fresh=G.evs.filter(e=>(e.k==='m'||e.k==='c')&&!S.mcSeen.has(e.id));S.mcSeen=ids;const now=Date.now();
  const show=fresh.filter(e=>now-e.t<7*86400000).sort((a,b)=>(b.k==='c')-(a.k==='c'))[0];if(show)bigFx(show.k,show);}

/* ---------- Client Hall of Fame ---------- */
function hallList(){return G.evs.filter(e=>e.k==='c').sort((a,b)=>a.t-b.t);}
SCREENS.hall=()=>{const L2=hallList();const by=p=>L2.filter(e=>e.pid===p).length;
  return `<div class="pad"><div class="hallHead"><svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" fill="#F2C462"/></svg><h2>Client Hall of Fame</h2><p class="muted">Every client won, forever. ${L2.length?`${L2.length} so far: ${G.P.map(p=>`${pname(p)} ${by(p)}`).join(', ')}.`:'The first plaque is waiting for you.'}</p></div>
  ${L2.length?`<div class="plaques">${L2.slice().reverse().map((e,i)=>`<div class="plaque"><span class="pNum">#${L2.length-i}</span><b>${esc(e.pr||'Mystery client')}</b><small>Won by ${pname(e.pid)} · ${shortDate(e.date||L(e.t).date)}</small></div>`).join('')}</div>`:`<div class="card" style="text-align:center"><p>No clients yet. When one is logged${G.cfg.requireConfirm?' and confirmed':''}, it gets a golden plaque here and in both hideouts.</p></div>`}</div>`;};
const _drawIslet9=drawIslet;
drawIslet=function(c,t,pid){_drawIslet9(c,t,pid);if(!G)return;const L2=hallList();const x=236,y=160;
  rr(c,x,y-14,28,14,1.5,'#9B958E');rr(c,x+1,y-13,26,12,1,'#B9B3AB');R(c,x-1,y-15,30,1.6,'#8A847D');
  for(let i=0;i<8;i++){const px=x+2.4+(i%4)*6.2,py=y-11.6+Math.floor(i/4)*5.4;if(i<L2.length){rr(c,px,py,4.8,4,.6,'#F2C462');R(c,px+.8,py+1.4,3.2,.5,'#B8862C');if(Math.sin(t/300+i)>.85){line(c,px+4,py,px+5.6,py,'#FFF6CF',.4);}}else rr(c,px,py,4.8,4,.6,'rgba(0,0,0,.12)');}
  txt(c,'HALL OF FAME',x+14,y-18.6,'#5A544D',4.6,'center');hit(x-2,y-22,32,24,'Client Hall of Fame',L2.length?`${L2.length} client${L2.length>1?'s':''} won: ${L2.slice(-6).map(e=>e.pr||'Mystery client').join(', ')}${L2.length>6?' and more':''}. Every client gets a gold plaque.`:'Empty for now. Every client you win gets a gold plaque here.');};

/* ---------- harbour: the sunk sea foe, monuments from ventures ---------- */
function ribbon(c,x,y,w,text,col,t){const h=15,wv=Math.sin(t/500)*.6;let fs=9;c.font=`600 ${fs}px Fredoka, Nunito, sans-serif`;let tw=c.measureText(text).width;const maxW=280;while(tw+16>maxW&&fs>6){fs-=.5;c.font=`600 ${fs}px Fredoka, Nunito, sans-serif`;tw=c.measureText(text).width;}w=Math.max(w,Math.min(maxW,tw+16));x=Math.min(Math.max(x,w/2+14),320-w/2-14);const d=shade(col);poly(c,[[x-w/2-10,y+3],[x-w/2,y+3],[x-w/2,y+h+3],[x-w/2-10,y+h+3],[x-w/2-6,y+h/2+3]],d);poly(c,[[x+w/2+10,y+3],[x+w/2,y+3],[x+w/2,y+h+3],[x+w/2+10,y+h+3],[x+w/2+6,y+h/2+3]],d);rr(c,x-w/2,y+wv,w,h,3,col);R(c,x-w/2,y+wv+h-2.4,w,2.4,'rgba(0,0,0,.14)');R(c,x-w/2+2,y+wv+1.4,w-4,.8,'rgba(255,255,255,.25)');
  c.font=`600 ${fs}px Fredoka, Nunito, sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#FFFFFF';c.fillText(text,x,y+wv+h/2-.6);}
function shade(hex){const n=parseInt(hex.slice(1),16);const f=v=>Math.max(0,Math.round(v*.72));return '#'+[f(n>>16),f((n>>8)&255),f(n&255)].map(v=>v.toString(16).padStart(2,'0')).join('');}
function drawSunk(c,t,boss,today){const now=performance.now();if(!S.sunkSeen||S.sunkSeen.date!==G.today){S.sunkSeen={date:G.today,at:S.firstDerive?now-1e6:now};}
  if(S.sunkSeen.live==null)S.sunkSeen.live=false;const since=now-S.sunkSeen.at;const wl=113,bx=266;
  // 1) the foe goes down: tilts, sinks, bubbles
  if(since<2600){const q=Math.min(1,since/2600);const r=18;c.save();c.beginPath();c.rect(0,0,W,wl);c.clip();c.translate(bx,wl-r*.4+q*34);c.rotate(q*.7);drawBoss(c,boss,0,0,r,0,t,since<150,null);c.restore();
    for(let i=0;i<10;i++){const a=-Math.PI*(i+.5)/10,d=Math.min(1,since/700)*24;disc(c,bx+Math.cos(a)*d,wl+Math.sin(a)*d*.8+(since/700)**2*8,1.8*(1-Math.min(1,since/900))+.2,'rgba(255,255,255,.9)');}
    lamp(c,bx,wl-8,22*(1-q),.35*(1-q),'255,220,150');}
  // 2) what is left: a bobbing wreck, a flag going under, treasure floating up
  const bob=Math.sin(t/700)*1.2,app=Math.min(1,Math.max(0,(since-1600)/900));c.globalAlpha=app;
  c.save();c.translate(bx-14,wl+bob);c.rotate(-.18);rr(c,-12,-2,22,5,1.5,'#6B4429');R(c,-12,-2,22,1.2,'#8A5A3A');R(c,-1,-16,1.4,14,'#7A4E30');poly(c,[[.4,-15.6],[9,-12.4],[.4,-9.6]],'#2E2B33');drawSymbolBase(c,'skull',4,-12.6,.5,'#F4EFE4');c.restore();
  for(let i=0;i<4;i++){const fx=bx+8+i*9,fy=wl+1+Math.sin(t/500+i*1.7)*1.2;if(i%2)rr(c,fx-3,fy-1.4,6,2.6,.8,'#A8704A');else{disc(c,fx,fy,1.6,'#F2C462');disc(c,fx-.5,fy-.5,.5,'#FFF3B8');}}
  const cy=wl-3+Math.sin(t/600)*1.4;rr(c,bx+16,cy-4,9,6,1,'#A8704A');c.fillStyle='#8A5A3A';c.beginPath();c.ellipse(bx+20.5,cy-4,4.5,2.2,0,Math.PI,0);c.fill();R(c,bx+20,cy-4,1,6,'#F2C462');glowAt(c,bx+20.5,cy-4,8,'255,226,140',.35+.2*Math.sin(t/250));
  for(let i=0;i<3;i++){const q=((t/1500)+i/3)%1;disc(c,bx-10+i*7,wl-q*8,.6+q*.8,`rgba(255,255,255,${.6*(1-q)})`);}
  c.globalAlpha=1;
  // 3) a ribbon: what happened, in words
  const dropIn=Math.min(1,Math.max(0,(since-400)/600)),ry=52-(1-dropIn)*30;c.globalAlpha=dropIn;ribbon(c,bx-4,ry,78,`${boss.name.replace(/^(The|Captain|Lady|Admiral) /,'').split(',')[0]} sunk!`,'#2C3E50',t);c.font='700 6px Nunito, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle=SUN.night?'#F4EFE4':'#2C3E50';c.fillText('+100 XP and 30 doubloons each',bx-4,ry+24);c.globalAlpha=1;
  if(since>1600&&since<5200)for(let i=0;i<12;i++){const q=((since-1600)/3600+i/12)%1;const px=bx-40+((i*37)%80),py=20+q*90;c.save();c.translate(px,py);c.rotate(q*8+i);R(c,-1,-1.6,2,3.2,['#F2C462','#E0457B','#45B07C','#7CC7E6'][i%4]);c.restore();}
  hit(bx-46,40,92,80,`${boss.name} is sunk`,`The crew logged ${today.team} DMs against a target of ${today.target}. Everyone who fired gets +100 XP and 30 doubloons. Stretch goals pay more at 125, 150 and 200.`);}
const _drawHarbour9=drawHarbour;
drawHarbour=function(c,t){_drawHarbour9(c,t);if(!G)return;const n=VENTURES.filter(v=>TEAMDM()>=v.dm).length;if(!n)return;
  const vx=28,vy=96;island(c,vx,vy+2,22,4,t);
  if(n>=1){R(c,vx+8,vy-1,12,1.6,'#B98552');for(let i=0;i<3;i++)R(c,vx+9+i*4.4,vy,.8,3.4,'#7A4E30');}
  if(n>=2){R(c,vx-14,vy-16,3,15,'#FFFFFF');R(c,vx-14,vy-12,3,2.4,'#E0453B');R(c,vx-14,vy-6,3,2.4,'#E0453B');rr(c,vx-15,vy-19,5,3,1,'#F2C462');lamp(c,vx-12.5,vy-17.6,7,.5+.2*Math.sin(t/300),'255,236,170');}
  if(n>=3){rr(c,vx-5,vy-3,6,3,.6,'#B9B3AB');ell(c,vx-2,vy-7,1.8,3,'#C9C3B6');disc(c,vx-2,vy-11,1.4,'#C9C3B6');poly(c,[[vx-3.6,vy-12],[vx-2,vy-14.4],[vx-.4,vy-12]],'#C9C3B6');}
  if(n>=4){R(c,vx+3,vy-9,10,8,'#A8704A');poly(c,[[vx+2,vy-9],[vx+8,vy-13],[vx+14,vy-9]],'#7A4E30');R(c,vx+6,vy-5,3,4,'#5A4030');}
  if(n>=5)for(let i=0;i<3;i++){const sx=vx-10+i*12,sy=vy+12+Math.sin(t/700+i)*.6;c.save();c.translate(sx,sy);c.scale(.12,.12);drawShip(c,0,0,1,{hull:'hull_royal',sail:'sail_royal',flag:'flag_crown2'},t,{captain:false,phase:i});c.restore();}
  if(n>=6){const cy=vy-22+Math.sin(t/500);poly(c,[[vx-4,cy+3],[vx-4,cy-1],[vx-2,cy+1],[vx,cy-3],[vx+2,cy+1],[vx+4,cy-1],[vx+4,cy+3]],'#F2C462');}
  const v=VENTURES[n-1];hit(vx-24,vy-26,48,34,'Grand ventures',`Built so far: ${VENTURES.slice(0,n).map(x=>x.name).join(', ')}. ${VENTURES[n]?`Next: ${VENTURES[n].name} at ${fmtN(VENTURES[n].dm)} crew DMs (${fmtN(TEAMDM())} so far).`:'Every venture complete.'}`);};

/* ---------- harbour screen: the daily loop ---------- */
SCREENS.harbour=()=>{
  const D=G.days[G.today],P=G.P,tgt=D.target,team=D.team,won=tgt>0&&team>=tgt,hp=Math.max(0,tgt-team),boss=D.boss,mod=D.mod;const me=G.players[S.me];
  const seg=p=>tgt?clamp(D.p[p].d/Math.max(tgt,team)*100,0,100):0;const ms=[125,150,200].find(m=>team<m);const W=G.weeks[weekStart(G.today)];
  const rem=reminder();const mer=merchantToday(G.today);const act=P.flatMap(p=>activeForfeitsFor(p).map(f=>({...f,p})));const yd=G.workdays.filter(d=>d<G.today).pop();const sumK=k=>P.reduce((a,p)=>a+D.p[p][k],0);
  const q=questState(S.me);const qrow=x=>{const key=`q_d_${G.today}_${x.id}`;const done=x.prog>=x.n,cl=me.claimed.has(key);return `<div class="qRow ${cl?'cl':done?'ok':''}"><span class="qTick">${cl?'✓':done?'!':''}</span><div class="grow"><b>${esc(x.name)}</b><span class="miniBar"><i style="width:${Math.min(100,x.prog/x.n*100)}%"></i></span></div>${cl?'<small>Done</small>':done?`<button class="btn sm primary" data-act="claim" data-key="${key}" data-xp="${x.xp}" data-g="${x.g}">Claim</button>`:`<small class="num">${Math.min(x.prog,x.n)}/${x.n}</small>`}</div>`;};
  const wk=W||{hits:0};const hits=G.weeks[weekStart(G.today)]?.hits||0;const isFri=wd(G.today)===5;const joint=isFri&&P.length>1;const vn=VENTURES.find(v=>TEAMDM()<v.dm);const vp=VENTURES.filter(v=>TEAMDM()>=v.dm).length;
  return `<canvas id="scene" class="scene" width="960" height="540" aria-label="Funnal Cove harbour and today's sea foe. Tap anything for details."></canvas>
  <div class="pad">
   ${statusChips()}
   ${crewCheckWrap()}
   ${offReqHtml()}
   ${rem?`<div class="remind"><span class="name">Gary the gull</span><canvas class="gull" id="gullIco"></canvas><div>${esc(rem)}</div><button class="btn sm ghost" data-act="nextReminder" aria-label="Another reminder">Next</button></div>`:''}
   <div class="card today">
    ${tgt>0?`<div class="bossTop"><div><small>Today's target · ${esc(boss.name)}${boss.rare?' (rare)':''}</small><div class="bossName">${won?'Sunk! Every DM now is bonus':hp+' DMs to sink it'}</div></div><b class="score num">${team}<small> / ${tgt}</small></b></div>
    <div class="hp" role="img" aria-label="${hp} HP left">${P.map(p=>`<i class="${p===P[0]?'s':'j'}" style="width:${seg(p)}%"></i>`).join('')}<i class="x" style="flex:1"></i><span>${won?(ms?`Stretch ${team}/${ms}`:'All stretch goals!'):hp+' HP'}</span></div>
    <div class="contrib">${P.map(p=>`<span><i class="dot" style="background:${pcol(p)}"></i>${pname(p)} <b class="num">${D.p[p].d}</b>${absent(p,G.today)?' <small>(away)</small>':''}</span>`).join('')}<span class="pill" id="timeLeft">${timeLeftStr()}</span></div>`
    :`<h2>No battle today</h2><p class="muted" style="margin:0">${isWork(G.today)?'Everyone is away. Rest up.':'Not a working day. Anything you log still counts towards your totals.'}</p>`}
    <div class="tSub"><small>Your daily quests</small><a href="#quests" class="tiny">All quests ›</a></div>
    <div class="qList">${q.daily.slice(0,3).map(qrow).join('')}</div>
   </div>
   <div class="card crewGoals"><div class="row between"><h3>Crew goals</h3><small>together, not against</small></div>
    <div class="cgRow"><span class="cgIco">⚓</span><div class="grow"><b>Crew week</b><small>Sink the daily foe on ${CREW_WEEK_NEED} days this week: +400 ${CN} & 300 XP each</small><span class="pips">${Array.from({length:CREW_WEEK_NEED},(_,i)=>`<i class="${i<hits?'on':''}"></i>`).join('')}</span></div><b class="num">${Math.min(hits,CREW_WEEK_NEED)}/${CREW_WEEK_NEED}</b></div>
    <div class="cgRow ${joint?'':'dim'}"><span class="cgIco">🐙</span><div class="grow"><b>Friday Kraken</b><small>${joint?`Today! Both log ${JOINT_NEED}+ DMs: +200 ${CN} & 150 XP each`:`Every Friday, both log ${JOINT_NEED}+ DMs to sink it together`}</small>${joint?`<span class="duo">${P.map(p=>`<span><i class="dot" style="background:${pcol(p)}"></i>${Math.min(D.p[p].d,JOINT_NEED)}/${JOINT_NEED}</span>`).join('')}</span>`:''}</div><b class="num">${D.joint?'Sunk!':joint?'':'Fri'}</b></div>
    ${vn?`<div class="cgRow"><span class="cgIco">🏴‍☠️</span><div class="grow"><b>${esc(vn.name)}</b><small>Grand venture ${vp+1} of ${VENTURES.length}: ${esc(vn.desc)}</small>${bar(TEAMDM()-(VENTURES[vp-1]?.dm||0),vn.dm-(VENTURES[vp-1]?.dm||0),'team')}</div><b class="num">${fmtN(TEAMDM())}<small>/${fmtN(vn.dm)}</small></b></div>`:''}
   </div>
   <details class="card more"><summary>More about today</summary><div class="moreBody">
    ${tgt>0?`<div class="speech withName"><span class="who2">${esc(boss.name.split(' ').slice(-1)[0])}</span>${esc(phaseLine(boss,hp/tgt,won))}</div><div class="twist"><b>${esc(mod.name)}</b><span>${esc(mod.desc)}</span></div>`:''}
    <div class="miniStats">${['r','v','m','c'].map(k=>`<div><b class="num">${sumK(k)}</b><small>${KINDS[k].short}s</small></div>`).join('')}</div>
    ${W&&W.hp?`<small>Weekly boss · ${esc(W.boss.name)}</small>${bar(W.dmg,W.hp,'team')}${weeklyBossLine(W)}`:''}
   </div></details>
   <div class="links">
    ${act.length?`<a class="linkRow warn" href="#herald"><span>${act.length} active forfeit${act.length>1?'s':''}</span><span class="chev">›</span></a>`:''}
    ${mer?`<a class="linkRow" href="#shop"><span>Pell's barge is in port with rare stock</span><span class="chev">›</span></a>`:''}
    <a class="linkRow" href="#review"><span>${wd(G.today)===0?'This week\'s review is ready':'Weekly review'}</span><span class="chev">›</span></a>
    ${yd?heraldCard(yd):''}
   </div>
  </div>`;};

/* ---------- reviews: day card, week card, the Friday review ---------- */
function periodStats(dates){const set=new Set(dates);const P=G.P;const o={days:dates.length,p:{},team:{d:0,r:0,v:0,m:0,c:0,f:0},hours:Array(24).fill(0),best:null,fish:{},kills:{},clients:[]};
  P.forEach(p=>o.p[p]={d:0,r:0,v:0,m:0,c:0,f:0});
  for(const e of G.evs){if(!set.has(e.date))continue;o.p[e.pid][e.k]++;o.team[e.k]++;if(e.k==='d')o.hours[Math.floor(L(e.t).min/60)]++;if(e.k==='c')o.clients.push(e);}
  dates.forEach(d=>{const D=G.days[d];if(D&&(!o.best||D.team>o.best.team))o.best={date:d,team:D.team};});
  P.forEach(p=>{const fc=fishCatches(p).list.filter(x=>set.has(x.date));o.fish[p]={n:fc.length,big:fc.reduce((a,x)=>!a||x.cm>a.cm?x:a,null)};
    o.kills[p]=(G.players[p].sessions||[]).filter(x=>set.has(x.date)&&x.hv===2&&!isFish(x.mode)).reduce((a,x)=>a+huntRun(x.id,x.diff,G.evs.filter(e=>e.pid===p&&e.k==='d'&&e.t>=x.s&&e.t<=(x.e||x.s+(x.dur||0))),x.s).kills.length,0);});
  o.hits=dates.filter(d=>G.days[d]?.hit).length;return o;}
const datesOfWeek=ws=>Array.from({length:7},(_,i)=>addDays(ws,i)).filter(d=>d<=G.today&&(!G.workdays||!G.workdays.length||d>=G.workdays[0]));
function delta(a,b){if(!b)return a?'<i class="up">new</i>':'';const p=Math.round((a-b)/b*100);return p===0?'<i>=</i>':`<i class="${p>0?'up':'down'}">${p>0?'▲':'▼'}${Math.abs(p)}%</i>`;}
SCREENS.review=()=>{const ws0=weekStart(G.today);const off=S.view.revOff||0;const ws=addDays(ws0,-7*off);const A=periodStats(datesOfWeek(ws)),B=periodStats(datesOfWeek(addDays(ws,-7)));const P=G.P;
  const hmax=Math.max(1,...A.hours);const bh=A.hours.indexOf(Math.max(...A.hours));const rr0=A.team.d?Math.round(A.team.r/A.team.d*1000)/10:0;
  const row=(k,l)=>`<div class="rvRow"><span>${l}</span><b class="num">${fmtN(A.team[k])}</b>${delta(A.team[k],B.team[k])}<span class="rvSplit">${P.map(p=>`<span><i class="dot" style="background:${pcol(p)}"></i>${A.p[p][k]}</span>`).join('')}</span></div>`;
  const mvp=P.slice().sort((a,b)=>(A.p[b].d+A.p[b].f*.5+A.p[b].r*5+A.p[b].m*20+A.p[b].c*100)-(A.p[a].d+A.p[a].f*.5+A.p[a].r*5+A.p[a].m*20+A.p[a].c*100))[0];
  return `<div class="pad"><div class="row between"><h2>${off?'Week of '+shortDate(ws):'This week'}</h2><div class="seg mini"><button data-act="revOff" data-o="${off+1}">‹ Earlier</button><button ${off?'':'disabled'} data-act="revOff" data-o="${Math.max(0,off-1)}">Later ›</button></div></div>
   <div class="card rvHero"><small>Weekly review · ${shortDate(ws)} to ${shortDate(addDays(ws,6))}</small><div class="rvBig"><div><b class="num">${fmtN(A.team.d)}</b><small>DMs ${delta(A.team.d,B.team.d)}</small></div><div><b class="num">${fmtN(A.team.f)}</b><small>follow-ups</small></div><div><b class="num">${A.team.r}</b><small>replies</small></div><div><b class="num">${A.team.m}</b><small>meetings</small></div><div><b class="num">${A.team.c}</b><small>clients</small></div></div>
    <p class="rvLine">${esc(reviewLine(A,B,mvp))}</p></div>
   <div class="card"><h3>The numbers</h3>${row('d','DMs')}${row('f','Follow-ups')}${row('r','Replies')}${row('v','Videos sent')}${row('m','Meetings')}${row('c','Clients')}<p class="tiny muted">Reply rate ${rr0}% · ${A.team.d?(A.team.f/A.team.d*10).toFixed(1):0} follow-ups per 10 DMs · foe sunk on ${A.hits} of ${A.days} days${A.best?` · best day ${shortDate(A.best.date)} (${A.best.team})`:''}</p></div>
   <div class="card"><h3>When you DM</h3><div class="hours">${A.hours.slice(6,22).map((n,i)=>`<i style="height:${Math.round(n/hmax*100)}%" class="${i+6===bh?'top':''}" title="${i+6}:00 · ${n}"></i>`).join('')}</div><div class="hoursAx"><span>6am</span><span>12</span><span>6pm</span><span>10</span></div><p class="tiny muted">${A.team.d?`Busiest hour: ${bh}:00 to ${bh+1}:00.`:'No DMs yet this week.'}</p></div>
   <div class="card"><h3>At sea</h3>${P.map(p=>`<div class="rvRow"><span><i class="dot" style="background:${pcol(p)}"></i>${pname(p)}</span><small>${A.fish[p].n} fish${A.fish[p].big?`, biggest ${cmStr(A.fish[p].big.cm)} ${esc(A.fish[p].big.f.name)}`:''} · ${A.kills[p]} monsters sunk</small></div>`).join('')}
    ${A.clients.length?`<p><b>Clients won:</b> ${A.clients.map(e=>esc(e.pr||'Mystery client')).join(', ')}</p>`:''}<p class="tiny muted">Crew week: ${A.hits>=CREW_WEEK_NEED?'achieved!':`${A.hits} of ${CREW_WEEK_NEED} days`}.</p></div>
   <div class="row" style="gap:8px"><button class="btn" data-act="weekCard" data-w="${ws}">Show the week card</button><button class="btn primary" data-act="weekPng" data-w="${ws}">Download the review</button></div></div>`;};
ACT.revOff=d=>{S.view.revOff=+d.o;render();};
function reviewLine(A,B,mvp){if(!A.team.d)return 'Quiet week so far. Gary is drumming his little feet.';const up=A.team.d-B.team.d;
  if(A.team.c)return `${A.team.c} client${A.team.c>1?'s':''} won this week. Frame this one. ${pnameRaw(mvp)} is captain of the week.`;
  if(A.team.m)return `${A.team.m} meeting${A.team.m>1?'s':''} booked. The cannons are working. ${pnameRaw(mvp)} is captain of the week.`;
  return up>=0?`${fmtN(A.team.d)} DMs${A.team.f?` and ${fmtN(A.team.f)} follow-ups`:''}, ${up?fmtN(up)+' more than last week':'level with last week'}. ${pnameRaw(mvp)} is captain of the week.`:`${fmtN(-up)} fewer DMs than last week. Gary is disappointed but still loves you. ${pnameRaw(mvp)} led the way.`;}
function summaryCard(kind,dates,title){const A=periodStats(dates);const P=G.P;const ach=P.reduce((a,p)=>a+Object.values(S.players[p]?.ach||{}).filter(ts=>dates.includes(L(ts).date)).length,0);
  openModal(`<div class="sumCard"><div class="sumTop"><small>${kind==='day'?'End of day':'End of week'}</small><h2>${esc(title)}</h2></div>
   <div class="sumGrid"><div><b class="num">${fmtN(A.team.d)}</b><small>DMs</small></div><div><b class="num">${A.team.r}</b><small>replies</small></div><div><b class="num">${A.team.m}</b><small>meetings</small></div><div><b class="num">${A.team.c}</b><small>clients</small></div></div>
   <div class="sumWho">${P.map(p=>`<div><b><i class="dot" style="background:${pcol(p)}"></i>${pname(p)}</b><span>${A.p[p].d} DMs · ${A.p[p].f||0} follow-ups · ${A.fish[p].n} fish · ${A.kills[p]} sunk</span></div>`).join('')}</div>
   <p class="sumLine">${kind==='day'?(A.hits?'Sea foe sunk. ':'The foe survived. ')+'':(A.hits>=CREW_WEEK_NEED?'Crew week achieved. ':'')}${ach?ach+' achievement'+(ach>1?'s':'')+' unlocked. ':''}${esc(pickR(kind==='day'?DAY_QUIPS:WEEK_QUIPS))}</p>
   <div class="row"><a class="btn" href="#review" data-act="closeModal">Full review</a><button class="btn ghost" data-act="closeModal">Close</button></div><small class="tiny muted">Screenshot it and send it to your crewmate. Or your mum.</small></div>`);}
const DAY_QUIPS=['Gary has filed today under "pretty good, actually".','Another day, another pile of cannonballs. Rest those thumbs.','The sea foe will remember this. It has a very small brain, but still.','Clock off, captain. The parrot will keep watch. Badly.','Gary rates today four fish out of five.'];
const WEEK_QUIPS=['A week of cannon fire. The harbour smells of victory and slightly of fish.','Gary has written a sea shanty about this week. Nobody asked.','Same time next week? The DMs will not send themselves. Yet.','The Herald will run this on the front page. Gary owns the Herald.'];
ACT.weekCard=d=>summaryCard('week',datesOfWeek(d.w),'Week of '+shortDate(d.w));
function autoCards(){if(!G||!S.me||S.firstDerive)return;const T=G.T;let ls={};try{ls=JSON.parse(localStorage.getItem('hc_cards')||'{}');}catch(e){}const save=()=>{try{localStorage.setItem('hc_cards',JSON.stringify(ls));}catch(e){}};
  if($('#modal')&&!$('#modal').hidden)return;
  const ws=weekStart(G.today),lw=addDays(ws,-7);
  if(wd(G.today)===0&&T.min>=1050&&!ls['w'+ws]){ls['w'+ws]=1;ls['d'+G.today]=1;save();return summaryCard('week',datesOfWeek(ws),'Week of '+shortDate(ws));}
  if(!ls['w'+lw]&&G.evs.some(e=>e.date>=lw&&e.date<ws)&&(wd(G.today)===1||wd(G.today)===2)){ls['w'+lw]=1;save();return summaryCard('week',datesOfWeek(lw),'Last week');}
  if(T.min>=1050&&!ls['d'+G.today]&&G.days[G.today]?.team>0){ls['d'+G.today]=1;save();return summaryCard('day',[G.today],shortDate(G.today));}
  const yd=addDays(G.today,-1);if(T.min<720&&!ls['d'+yd]&&G.days[yd]?.team>0){ls['d'+yd]=1;save();return summaryCard('day',[yd],'Yesterday');}}

/* ---------- more for Gary ---------- */
Object.entries({
 nobody:["The DM button is right there. It's big. It's blue. It's lonely.","Gary has been staring at the leaderboard for an hour. It hasn't moved. Neither has Gary.","The sea foe is doing a crossword. That's how relaxed it is.","Even the barnacles are getting more done today.","Your Instagram inbox called. It's worried about you.","Gary once sent 40 DMs with his beak. You have thumbs. Just saying.","A prospect somewhere is waiting to be wowed. They don't know it yet. Neither do you, apparently."],
 lagger:["{lagger}, the parrot has started calling {leader} 'Dad'.","{leader} has {lead} DMs. {lagger}, Gary has started a GoFundMe for your thumbs.","{lagger} is currently sponsored by 'Maybe Later'.","Gary has drawn a moustache on {lagger}'s portrait. Earn it back.","{lagger}, even the sea foe feels sorry for you. It sent a card."],
 ahead:["{leader} is {gap} ahead and has started humming. Loudly.","{gap} DMs between you. {lagger}, the comeback writes itself. Literally, with DMs.","{leader} leads by {gap}. Gary has made a little crown out of a crisp packet."],
 close:["{left} DMs left. Gary is holding his breath. He can't do this for long.","{left} to go. The foe is sweating. Monsters can sweat. Who knew.","One last push. {left} DMs. Gary has the party hat on already."],
 won:["Sunk it. Gary did a lap of honour around the lighthouse. He's tired now.","Victory! Every DM from here is gravy. Fish gravy. Gary's favourite.","The foe is sunk. Gary is telling everyone he helped. He didn't.","Foe down! The stretch goals are looking at you like a dog looks at a sausage."],
 steady:["Gary's advice: write like a human, send like a machine.","Fun fact: Gary has never been left on read. He's a gull. Nobody DMs gulls.","Personalised DMs get replies. 'Hey' gets ignored. Gary has data. Gary has no data.","Somebody, somewhere, needs a website. Find them.","Pell says the barge has new stock. Pell says that every day. Pell is lying, probably.","A meeting is just a DM that went really well. Go make some go really well.","Gary checked: no prospect has ever been annoyed by a genuinely nice message. He asked three of them."],
 deadline:["{mins} minutes, {left} DMs. Gary is pacing. Gulls are bad at pacing.","Clock's ticking: {left} DMs in {mins} minutes. You've done harder. Probably."],
}).forEach(([k,arr])=>{if(REMINDERS[k])REMINDERS[k].push(...arr);});

/* ---------- rewards for hunting, clients and crew goals ---------- */
[{id:'sail_bestiary',name:"Hunter's Trophy Sails",cat:'sail',col:'#3A2F2A',col2:'#F2C462',pat:'bones',earn:['drops',12,'Collect 12 different Bestiary parts','parts']},
 {id:'flag_hunter',name:"Hunter's Mark",cat:'flag',col:'#B5543A',sym:'swords',sc:'#F2C462',earn:['trophies',3,'Collect 3 legendary Bestiary trophies','trophies']},
 {id:'hull_hunter',name:'Monster Hunter Hull',cat:'hull',col:'#4A2E2A',col2:'#38221F',pat:'bones',gold:true,earn:['drops',30,'Collect 30 different Bestiary parts','parts']},
 {id:'fig_crew',name:'Twin Captains',cat:'figure',st:'eagle',earn:['crewWeeks',4,'Achieve 4 crew weeks together','weeks']},
 {id:'flag_crew',name:'Crew Colours',cat:'flag',col:'#2C3E50',sym:'anchor',sc:'#F2C462',earn:['crewWeeks',1,'Achieve a crew week together','weeks']},
 {id:'sail_crew',name:'Shared Sails',cat:'sail',col:'#FFFCF2',col2:'#2C3E50',pat:'compass',earn:['jointBoss',5,'Sink 5 Friday Krakens together','sunk']},
 {id:'hull_client',name:'Rainmaker Hull',cat:'hull',col:'#F2C462',col2:'#D99A17',pat:'royal',gold:true,earn:['clientsWon',3,'Win 3 clients yourself','clients']},
 {id:'dk_bell',name:"Client Bell",cat:'deck',st:'hoard',earn:['clientsWon',1,'Win a client','clients']}].forEach(i=>{ITEMS.push(i);ALL_ITEMS[i.id]=i;});
[['hunt1','First Blood','Sink a monster on a Lock In hunt','common','Voyages',['vBoss',1]],['hunt5w','Wave Rider','Sink 5 waves in a single hunt','rare','Voyages',['bestWaves',5]],['hunt10w','Unstoppable','Sink 10 waves in a single hunt','legendary','Voyages',['bestWaves',10]],
 ['best12','Collector of Bits','Collect 12 Bestiary parts','uncommon','Voyages',['drops',12]],['best30','Taxidermist','Collect 30 Bestiary parts','epic','Voyages',['drops',30]],['best48','Complete Bestiary','Collect all 48 Bestiary parts','mythic','Voyages',['drops',48]],['trophy1','Trophy Hunter','Get a legendary Bestiary trophy','rare','Voyages',['trophies',1]],
 ['crew1','Stronger Together','Achieve a crew week','uncommon','Team',['crewWeeks',1]],['crew10','Inseparable','Achieve 10 crew weeks','epic','Team',['crewWeeks',10]],['joint1','Kraken Tag Team','Sink the Friday Kraken together','uncommon','Team',['jointBoss',1]],['joint10','Friday Legends','Sink 10 Friday Krakens','epic','Team',['jointBoss',10]],
 ['vent1','Ground Broken','Complete the first grand venture','uncommon','Team',['ventures',1]],['vent3','Empire Builders','Complete 3 grand ventures','epic','Team',['ventures',3]],['vent6','Funnal Island','Complete every grand venture','transcendent','Team',['ventures',6]],
 ['client1','Rainmaker','Win your first client','rare','Outreach',['clientsWon',1]],['client5','Retainer Royalty','Win 5 clients','legendary','Outreach',['clientsWon',5]],['client15','The Hall Is Full','Win 15 clients','mythic','Outreach',['clientsWon',15]]]
 .forEach(([id,name,desc,rar,cat,[metric,target]])=>{if(ACH_BY_ID[id])return;const a={id,name,desc,rar,cat,metric,target,secret:false};ACHIEVEMENTS.push(a);ACH_BY_ID[id]=a;});
Object.assign(ACH_GLYPH,{drops:'skull',trophies:'trophy',bestWaves:'wave',crewWeeks:'anchor',jointBoss:'tentacle',ventures:'hammer',clientsWon:'crown'});
