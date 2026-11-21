/* ============================== LOOT, TROPHIES AND LEGENDS (Stage 3) ==============================
   Loot sets: from 1 December every boss you help sink drops one piece of its 4-piece set (both of you
   roll; Stubborn bosses drop two). Complete a set for its banner. Five duplicates of a piece trade at
   Pell's for a missing one. Trophies: a mounted head per boss, bronze at 1 kill, silver 10, gold 50,
   diamond 200, with one-off rewards to claim. Legendary hunts: a giant raid boss on set days, 1.4 times
   the crew target, announced the day before. Ship damage: looks only, from the last few working days. */
const PIECE_T={crab:['Claw Tip','Shell Shard','Barnacle Crown','Golden Pincer'],fish:['Scale','Fin','Tooth','Golden Scale'],squid:['Ink Sac','Sucker','Beak','Pearl of the Deep'],kraken:['Ink Sac','Sucker','Beak','Pearl of the Deep'],octopus:['Ink Sac','Sucker','Beak','Pearl of the Deep'],
  eel:['Scale','Fang','Spine','Golden Coil'],serpent:['Scale','Fang','Spine','Golden Coil'],jelly:['Tendril','Glow Drop','Bell Shard','Moon Pearl'],puffer:['Spine','Puff','Grumpy Face','Golden Spine'],shell:['Shell Chip','Pincer','Spiral','Perfect Shell'],
  ray:['Wing Tip','Barb','Shadow Scale','Night Pearl'],blob:['Whisker','Slime','Tooth','Strange Pearl'],storm:['Raindrop','Thundercloud','Lightning Bolt','Bottled Storm'],ship:['Rusty Cannonball','Torn Flag',"Captain's Log",'Golden Wheel'],whale:['Barnacle','Song','Spout','Golden Ambergris']};
const PIECE_RAR=['common','uncommon','rare','legendary'],SET_SYM={crab:'anchor',fish:'fish',squid:'kraken',kraken:'kraken',octopus:'kraken',eel:'fin',serpent:'fin',jelly:'diamond',puffer:'star',shell:'heart',ray:'fin',blob:'skull',storm:'diamond',ship:'swords',whale:'fish'};
const bodyOf=b=>(b.kit&&b.kit.body)||b.type||'blob';const shortName=b=>b.name.replace(/^The /,'').replace(/,.*$/,'');
function setOf(b){const t=PIECE_T[bodyOf(b)]||PIECE_T.blob;return t.map((n,i)=>({id:`lp_${b.id}_${i}`,name:`${shortName(b)}'s ${n}`,rar:PIECE_RAR[i],i,boss:b.id}));}

/* ---------- legendary hunts ---------- */
const LEGENDS=[
  {date:'2026-12-18',id:'krampus',name:'The Krampus Kraken',title:'Keeper of the Naughty List',type:'kraken',col:'#7A2A3A',eye:'#3F3A30',legend:true,kit:{body:'squid',col:'#7A2A3A',eyes:3,eyeStyle:'angry',mouth:'fangs',acc:['antlers','tentacles','chains']},lines:{start:"You've been VERY slow this year.",p75:"I've got a list. You're on it. Twice.",p50:'Coal for everyone! Except Bryn\'s Mum. I\'m scared of Bryn\'s Mum.',p25:'Wait... this is very festive of you...',dead:'Merry Christmas. You\'re off the list. For now.'},bio:'Enjoys: lists, checking them twice, coal. Dislikes: good behaviour. Last seen: up a chimney.',trophy:"the Krampus Kraken's Sack"},
  {date:'2027-01-13',id:'leviathan',name:'The Leviathan',title:'Older Than Ships',type:'whale',col:'#3A5A7A',eye:'#3F3A30',legend:true,kit:{body:'fish',col:'#3A5A7A',col2:'#9FB8CC',pat:'scales',eyes:2,eyeStyle:'angry',mouth:'fangs',acc:['fins','barnacles','scars','spikes']},lines:{start:'I am older than your ship. I am older than ships.',p75:'A scratch. I have had worse from a reef.',p50:'You... are persistent.',p25:'The deep is calling me home...',dead:'Remember me when the tide turns.'},bio:'Enjoys: the abyss, centuries. Dislikes: being disturbed. Last seen: 1702.',trophy:"the Leviathan's skeleton"},
  {date:'2027-02-10',id:'krakenqueen',name:'The Kraken Queen',title:'Mother Of All Tentacles',type:'kraken',col:'#8A4AB8',eye:'#3F3A30',legend:true,kit:{body:'squid',col:'#8A4AB8',eyes:2,eyeStyle:'angry',mouth:'beak',acc:['crown','tentacles']},lines:{start:'You sank my son. He was a disappointment, but still.',p75:'How dare you. I am royalty.',p50:'Guards! Guards? Oh. I ate the guards.',p25:'This is treason.',dead:'Long live... the queen... ugh.'},bio:'Enjoys: crowns, ruling, revenge. Dislikes: republicans, calamari. Last seen: on her throne of shipwrecks.',trophy:"the Kraken Queen's crown"}
];
const LEGEND_BY_DATE=Object.fromEntries(LEGENDS.map(l=>[l.date,l]));LEGENDS.forEach(l=>{ALL_BOSSES[l.id]=l;});
{const _bfL=bossFor;bossFor=function(date){return LEGEND_BY_DATE[date]||_bfL.apply(this,arguments);};}
function legendToday(){return G&&LEGEND_BY_DATE[G.today];}
function legendTomorrow(){if(!G)return null;let d=addDays(G.today,1);for(let i=0;i<4;i++){if(LEGEND_BY_DATE[d])return i===0?LEGEND_BY_DATE[d]:null;if(isWork(d))return null;d=addDays(d,1);}return null;}
function legendState(date){const L_=LEGEND_BY_DATE[date],D=G.days[date];if(!L_||!D||!D.target)return null;const hp=Math.ceil(D.target*1.4);return{L:L_,hp,team:D.team,won:D.team>=hp,key:`lg_${L_.id}_${date}`};}

/* ---------- loot, worked out from the days ---------- */
function bossLoot(p){if(!G)return{have:{},sets:{}};const ck=p+'|'+G.evs.length+'|'+G.today+'|'+((G.players[p]||{}).bonus||[]).length;if(bossLoot._c&&bossLoot._c.k===ck)return bossLoot._c.v;const have={};const add=(id,n=1)=>{have[id]=(have[id]||0)+n;};
  Object.values(G.days).forEach(D=>{if(!D.boss||D.date<ROSTER_FROM||!D.target||!(D.p[p]?.d>0))return;const L_=LEGEND_BY_DATE[D.date];const set=setOf(D.boss);
    if(L_){const st=legendState(D.date);if(st&&st.won)add(set[3].id);return;}if(D.team<D.target)return;
    const rolls=D.boss.weak==='stub'?2:1;for(let r=0;r<rolls;r++){const u=h32(D.date+p+'loot'+r)%100;add(set[u<55?0:u<85?1:u<97?2:3].id);}});
  (G.players[p]?.bonus||[]).forEach(b=>{if(b.key.startsWith('lt_')&&b.take&&b.give){add(b.take,-(b.n||5));add(b.give,1);}else if(b.key.startsWith('fn_')&&b.take){add(b.take,-(b.n||1));}});
  const v={have};bossLoot._c={k:ck,v};return v;}
function setDone(p,b){const {have}=bossLoot(p);return setOf(b).every(x=>(have[x.id]||0)>0||G.players[p]?.bonus?.some(y=>y.give===x.id));}
// set banners: one per boss, earned by completing its set, hidden from the shop until owned
const SET_FLAGS={};Object.values(ALL_BOSSES).forEach(b=>{const id=`flag_set_${b.id}`;const it={id,name:`${shortName(b)} Banner`,cat:'flag',col:b.col||'#5C6A80',sym:SET_SYM[bodyOf(b)]||'skull',sc:'#FFFFFF',earn:[`set_${b.id}`,4,`Complete the ${shortName(b)} loot set`,'pieces'],setBanner:true};SET_FLAGS[b.id]=id;if(!ALL_ITEMS[id]){ITEMS.push(it);ALL_ITEMS[id]=it;}});
const _deriveLoot=derive;derive=function(){const g=_deriveLoot.apply(this,arguments);try{const prev=G;G=g;g.P.forEach(p=>{const pl=g.players[p];if(!pl)return;const {have}=bossLoot(p);
  Object.values(ALL_BOSSES).forEach(b=>{const id=SET_FLAGS[b.id];const n=setOf(b).filter(x=>(have[x.id]||0)>0).length;if(pl.earnP)pl.earnP[id]=n;if(n>=4)pl.owned[id]=pl.owned[id]||1;});
  LEGENDS.forEach(L_=>{if(pl.claimed.has(`lg_${L_.id}_${L_.date}`))pl.legendTrophies=(pl.legendTrophies||[]).concat(L_.id);});});G=prev;}catch(e){console.warn('loot derive',e);}return g;};
{const _shopL=SCREENS.shop;SCREENS.shop=function(){const me=G&&G.players[S.me];const keep=ITEMS.slice();const hide=new Set(keep.filter(i=>i.setBanner&&!(me&&me.owned[i.id])).map(i=>i.id));if(!hide.size)return _shopL.apply(this,arguments);
  ITEMS.length=0;keep.forEach(i=>{if(!hide.has(i.id))ITEMS.push(i);});try{return _shopL.apply(this,arguments);}finally{ITEMS.length=0;keep.forEach(i=>ITEMS.push(i));}};}

/* ---------- loot on the boss page, with Pell's 5-for-1 trade ---------- */
function lootHtml(id){const b=ALL_BOSSES[id];if(!b)return '';const {have}=bossLoot(S.me);const set=setOf(b);const done=set.every(x=>(have[x.id]||0)>0);const missing=set.filter(x=>!(have[x.id]>0));
  return `<h3 style="margin-top:12px">Loot set ${done?'<small class="okTag">complete</small>':''}</h3><div class="lootSet">${set.map(x=>{const n=have[x.id]||0;return `<div class="lootPc r-${x.rar} ${n?'':'none'}"><canvas width="96" height="96" data-piece="${x.id}"></canvas><b>${esc(x.name)}</b><small>${x.rar}${n>1?` · ×${n}`:''}</small>${n>=6&&missing.length?`<button class="btn sm ghost" data-act="lootTrade" data-id="${x.id}">Trade 5 at Pell's</button>`:''}</div>`;}).join('')}</div>
    <p class="tiny muted">From 1 December, every time ${esc(shortName(b))} is sunk on a day you sent at least one DM, you get a piece (Stubborn bosses drop two). Complete the set for the <b>${esc(ALL_ITEMS[SET_FLAGS[b.id]].name)}</b>. Pell swaps 5 duplicates for a missing piece.</p>`;}
ACT.lootTrade=async d=>{const pc=d.id;const bid=pc.split('_').slice(1,-1).join('_');const b=ALL_BOSSES[bid];const set=setOf(b);const {have}=bossLoot(S.me);if((have[pc]||0)<6)return;const i=+pc.split('_').pop();
  const miss=set.filter(x=>!(have[x.id]>0));if(!miss.length)return toast('<b>Set complete.</b> Pell has nothing you need.');const give=(miss.find(x=>x.i>i)||miss[0]);
  try{await writeDay(S.me,G.today,{bonus:{[`lt_${uid()}`]:{xp:0,g:0,take:pc,give:give.id,n:5,ts:Date.now()}}});SFX.ach();toast(`<b>Pell trades!</b> 5 × ${esc(set[i].name)} for ${esc(give.name)}. "Pleasure doing business. Mostly."`);setTimeout(()=>ACT.bossInfo({id:bid}),300);}catch(e){writeFail(e);}};
function drawPiece(cv,id){const [_,...rest]=id.split('_');const i=+rest.pop();const bid=rest.join('_');const b=ALL_BOSSES[bid];if(!b)return;const c=cv.getContext('2d');c.setTransform(cv.width/48,0,0,cv.width/48,0,0);c.clearRect(0,0,48,48);
  const cols={0:'#C9BFA8',1:'#7CC7A6',2:'#7CB0E6',3:'#F2C462'};disc(c,24,24,21,cols[i]);disc(c,24,24,18,'#FFFFFF');c.save();c.beginPath();c.arc(24,24,18,0,TAU);c.clip();try{drawBoss(c,b,24,30,11,1,1000,false,null);}catch(e){}c.restore();
  if(i===3){c.strokeStyle='#F2C462';c.lineWidth=2;c.beginPath();c.arc(24,24,20,0,TAU);c.stroke();}}
{const _bpL=bossPageHtml;bossPageHtml=function(id){const h=_bpL.apply(this,arguments);const k='<div class="row" style="justify-content:flex-end;margin-top:10px">';return h.replace(k,lootHtml(id)+k);};}
{const _biL=ACT.bossInfo;ACT.bossInfo=d=>{_biL(d);setTimeout(()=>document.querySelectorAll('#modal canvas[data-piece]').forEach(cv=>drawPiece(cv,cv.dataset.piece)),60);};}

/* ---------- the Trophy Room ---------- */
const TR_TIERS=[[1,'bronze','#C98A4A'],[10,'silver','#AEB8C2'],[50,'gold','#F2C462'],[200,'diamond','#9FE8F2']];const TR_PAY={silver:{xp:100,g:0},gold:{xp:300,g:100},diamond:{xp:1000,g:300}};
function trophyTier(n){let t=null;TR_TIERS.forEach(x=>{if(n>=x[0])t=x;});return t;}
function trophies(p){return Object.values(ALL_BOSSES).filter(b=>!b.legend).map(b=>{const s=bossStats(b.id,p);return{b,n:s.sunk,t:trophyTier(s.sunk)};}).filter(x=>x.t);}
function trophyClaims(p){const me=G.players[p];const out=[];trophies(p).forEach(x=>{TR_TIERS.forEach(([n,name])=>{if(x.n>=n&&TR_PAY[name]){const key=`tr_${x.b.id}_${name}`;if(!me.claimed.has(key))out.push({key,...TR_PAY[name],b:x.b,name});}});});return out;}
function trophyRoomHtml(){const p=S.me;const list=trophies(p).sort((a,b)=>b.n-a.n);const leg=LEGENDS.filter(L_=>G.players[p].claimed.has(`lg_${L_.id}_${L_.date}`));const cl=trophyClaims(p);
  return `<div class="card trophyRoom"><h3>Trophy Room <small class="muted">${list.length} mounted${leg.length?` · ${leg.length} legendary`:''}</small></h3><p class="tiny muted">A mounted head for every boss you've helped sink: bronze at 1, silver at 10, gold at 50, diamond at 200. Upgrades pay out once.</p>
    ${cl.length?`<button class="btn primary" style="width:100%;margin:6px 0" data-act="trClaim">Claim ${cl.length} trophy reward${cl.length===1?'':'s'}</button>`:''}
    ${list.length||leg.length?`<div class="trGrid">${leg.map(L_=>`<div class="trPl legend"><canvas width="120" height="120" data-trophy="${L_.id}" data-tier="legend"></canvas><b>${esc(L_.trophy)}</b><small>Legendary</small></div>`).join('')}${list.map(x=>`<div class="trPl ${x.t[1]}"><canvas width="120" height="120" data-trophy="${x.b.id}" data-tier="${x.t[1]}"></canvas><b>${esc(shortName(x.b))}</b><small>${x.t[1]} · ${x.n} sunk</small></div>`).join('')}</div>`:'<p class="muted">No trophies yet. Sink a boss of the day.</p>'}</div>`;}
ACT.trClaim=async()=>{const cl=trophyClaims(S.me);if(!cl.length)return;const bonus={};let xp=0,g=0;cl.forEach(x=>{bonus[x.key]={xp:x.xp,g:x.g,ts:Date.now()};xp+=x.xp;g+=x.g;});try{await writeDay(S.me,G.today,{bonus});SFX.ach();toast(`<b>Trophies polished!</b> +${fmtN(xp)} XP${g?`, +${fmtN(g)} ${CN}`:''}.`);}catch(e){writeFail(e);}};
function drawTrophy(cv,id,tier){const c=cv.getContext('2d');c.setTransform(cv.width/60,0,0,cv.width/60,0,0);c.clearRect(0,0,60,60);const col=tier==='legend'?'#7A2A3A':(TR_TIERS.find(x=>x[1]===tier)||[0,0,'#C98A4A'])[2];
  c.fillStyle='#8A5A3A';c.beginPath();c.moveTo(10,8);c.lineTo(50,8);c.lineTo(52,40);c.quadraticCurveTo(30,58,8,40);c.closePath();c.fill();c.fillStyle=col;c.beginPath();c.moveTo(13,11);c.lineTo(47,11);c.lineTo(48.6,38.6);c.quadraticCurveTo(30,53,11.4,38.6);c.closePath();c.fill();
  const b=ALL_BOSSES[id];c.save();c.beginPath();c.moveTo(13,11);c.lineTo(47,11);c.lineTo(48.6,38.6);c.quadraticCurveTo(30,53,11.4,38.6);c.closePath();c.clip();try{drawBoss(c,b,30,32,12,1,1000,false,null);}catch(e){}c.restore();
  if(tier==='diamond'||tier==='legend'){for(let i=0;i<4;i++){c.fillStyle='rgba(255,255,255,.85)';c.beginPath();const x=16+i*9,y=14+(i%2)*6;c.moveTo(x,y-2);c.lineTo(x+.8,y);c.lineTo(x,y+2);c.lineTo(x-.8,y);c.closePath();c.fill();}}}
{const _bk=SCREENS.book;if(_bk)SCREENS.book=function(){const h=_bk.apply(this,arguments);const k='<div class="card';const i=h.indexOf(k);return i<0?h+trophyRoomHtml():h.slice(0,i)+trophyRoomHtml()+h.slice(i);};}
{const _rdL=render;render=function(){_rdL.apply(this,arguments);try{document.querySelectorAll('canvas[data-trophy]').forEach(cv=>drawTrophy(cv,cv.dataset.trophy,cv.dataset.tier));}catch(e){}};}

/* ---------- legendary hunt cards, the eve, and the Herald ---------- */
function legendCardHtml(){const st=legendToday()&&legendState(G.today);if(st){const pct=Math.min(100,st.team/st.hp*100);const cl=G.players[S.me].claimed.has(st.key);
    return `<div class="card legendCard"><small>Legendary hunt · today only</small><h3>${esc(st.L.name)}</h3><p class="tiny">${esc(st.L.title)}. HP is 1.4 times the crew target: ${st.hp} DMs. Every DM either of you sends today hits it.</p><div class="miniBar big"><i style="width:${pct}%"></i></div><small class="muted">${st.team} / ${st.hp}</small>
      ${st.won&&!cl?`<button class="btn primary" style="width:100%;margin-top:8px" data-act="legendClaim">Claim: ${esc(st.L.trophy)}, its legendary piece, +600 XP, +200 ${CN}</button>`:st.won?'<small class="okTag">Sunk! Trophy mounted.</small>':''}</div>`;}
  const tm=legendTomorrow();if(tm)return `<div class="card legendEve"><small>Herald warning</small><h3>${esc(tm.name)} approaches</h3><p class="tiny">Tomorrow is a legendary hunt: ${esc(tm.title)}. It has 1.4 times the usual HP, so it'll take a big day from both of you. Fishermen are advised to stay indoors, or at least send more DMs.</p></div>`;return '';}
ACT.legendClaim=async()=>{const st=legendState(G.today);if(!st||!st.won||G.players[S.me].claimed.has(st.key))return;try{await writeDay(S.me,G.today,{bonus:{[st.key]:{xp:600,g:200,ts:Date.now()}}});SFX.ach();toast(`<b>LEGENDARY!</b> ${esc(st.L.name)} is sunk. ${esc(st.L.trophy)} is on your wall.`);}catch(e){writeFail(e);}};
{const _hL=SCREENS.harbour;SCREENS.harbour=function(){const h=_hL.apply(this,arguments);const x=legendCardHtml();if(!x)return h;const k='<div class="card today">';return h.includes(k)?h.replace(k,x+k):h+x;};}
addLayer('sky','legendEve',(c,t)=>{c.fillStyle='rgba(30,10,50,.22)';c.fillRect(-80,-300,W+160,420);},{z:10,when:()=>THEME.scene==='harbour'&&!!(legendTomorrow()||legendToday())});
{const _hrL=SCREENS.herald;SCREENS.herald=function(){let h=_hrL.apply(this,arguments);const tm=legendTomorrow();const yd=addDays(G.today,-1);const ys=LEGEND_BY_DATE[yd]&&legendState(yd);let x='';
  if(tm)x+=`<div class="hXmas legendNote"><h4>${esc(tm.name.toUpperCase())} APPROACHES</h4><p>Fishermen advised to stay indoors, or at least send more DMs. Tomorrow's legendary hunt needs 1.4 times the usual crew target.</p></div>`;
  if(ys)x+=`<div class="hXmas legendNote"><h4>${ys.won?'SPECIAL EDITION: '+esc(ys.L.name.toUpperCase())+' SUNK':esc(ys.L.name.toUpperCase())+' ESCAPES'}</h4><p>${ys.won?`The crew landed ${ys.team} DMs and sent ${esc(ys.L.name)} back to the deep. ${esc(ys.L.trophy)} now hangs in the Trophy Room.`:`${esc(ys.L.name)} slipped away at ${ys.team} of ${ys.hp}. Its parting words: "${esc(ys.L.lines.start)}" It may return next month.`}</p></div>`;
  if(!x)return h;const k='<div class="head">';return h.includes(k)?h.replace(k,x+k):h+x;};}

/* ---------- ship damage: looks only, from the last few working days ---------- */
function shipDamage(){if(!G)return{lvl:0,shine:false};const ck=G.today+'|'+G.evs.length;if(shipDamage._c&&shipDamage._c.k===ck)return shipDamage._c.v;let lvl=0,shine=false;const days=[];let d=addDays(G.today,-1);
  for(let i=0;i<20&&days.length<8;i++){if(isWork(d)&&G.days[d]&&G.days[d].target>0)days.unshift(d);d=addDays(d,-1);}
  days.forEach(x=>{const D=G.days[x];if(D.team>=D.target*1.5){lvl=0;shine=x===days[days.length-1];}else if(D.team>=D.target)lvl=Math.max(0,lvl-1);else lvl=Math.min(3,lvl+1);});
  const T=G.days[G.today];if(T&&T.target>0&&T.team>=T.target){if(T.team>=T.target*1.5){lvl=0;shine=true;}else lvl=Math.max(0,lvl-1);}
  const v={lvl,shine};shipDamage._c={k:ck,v};return v;}
{const _dsD=drawShip;drawShip=function(c,x,y,s,pl,t,opts={}){_dsD.apply(this,arguments);if(!G||!opts.pid)return;const {lvl,shine}=shipDamage();if(!lvl&&!shine)return;const ph=opts.phase||0;const fire=opts.firing>0?opts.firing:0,kick=fire*fire;
  const rock=Math.sin(t/900+ph)*.04+Math.sin(t/410+ph*2)*.012-kick*.045,bob=Math.sin(t/650+ph)*1.3+Math.sin(t/270+ph)*.3;c.save();c.translate(x-kick*2.2*s,y+bob*s*.4);c.rotate(rock);c.scale(s,s);
  try{if(lvl>=1){rr(c,-8,-33,6,5,.6,'#E8DCC0');line(c,-8,-33,-2,-28,'rgba(120,90,60,.5)',.3);line(c,-8,-28,-2,-33,'rgba(120,90,60,.5)',.3);rr(c,-24,-30,4,4,.5,'#D9C9A4');c.save();c.translate(10,-10);c.rotate(.18);R(c,-6,-.5,12,1.4,'rgba(90,60,40,.6)');c.restore();}
    if(lvl>=2){ell(c,14,-6,3.4,2.4,'#1E1A16');for(let i=0;i<3;i++){const q=((t/700)+i/3)%1;disc(c,17+q*5,-6+q*q*10,.7*(1-q)+.3,'rgba(160,210,240,.8)');}rr(c,-14,-21,3.4,3.6,.8,'#8A939C');R(c,-14.4,-21.6,4.2,.8,'#6E7780');}
    if(lvl>=3){for(let i=0;i<5;i++){const q=((t/1500)+i/5)%1;c.globalAlpha=.55*(1-q);disc(c,-6+Math.sin(q*6+i)*3,-20-q*30,2+q*4,'#8A8A8A');}c.globalAlpha=1;
      const cx=3,cy=-17;ell(c,cx,cy,2.4,1.6,'#E0704A');line(c,cx-1,cy-1,cx-1.6,cy-6,'#E0704A',.8);line(c,cx+1,cy-1,cx+1.6,cy-6,'#E0704A',.8);disc(c,cx-.7,cy-.8,.35,'#1E1A16');disc(c,cx+.7,cy-.8,.35,'#1E1A16');}
    if(shine)for(let i=0;i<6;i++){const q=(t/900+i*.37)%1;const a=Math.sin(q*Math.PI);c.globalAlpha=a;c.fillStyle='#FFFFFF';const sx=-28+i*11,sy=-8+(i%2)*4;c.beginPath();c.moveTo(sx,sy-1.6);c.lineTo(sx+.5,sy);c.lineTo(sx,sy+1.6);c.lineTo(sx-.5,sy);c.closePath();c.fill();}c.globalAlpha=1;}catch(e){}c.restore();};}
// Gary notices repairs
(function repairWatch(){setInterval(()=>{try{if(!G||!S.me)return;const v=shipDamage();const k='hl_dmg';const prev=+(localStorage.getItem(k)??v.lvl);if(v.lvl<prev)toast(PREFS.heckles!==false?'<b>Repairs done.</b> Gary: "Finally."':'<b>Repairs done.</b>');localStorage.setItem(k,String(v.lvl));}catch(e){}},20000);})();
HELP.push(['Loot sets and trophies','From 1 December, every boss of the day you help sink (send at least one DM that day) drops a piece of its 4-piece loot set: common, uncommon, rare or legendary. Complete a set for that boss\'s banner. Pell will trade 5 duplicates of a piece for a missing one (on the boss\'s Bestiary page). Every boss you sink also earns a mounted head in the Trophy Room (in Achievements): bronze at 1 kill, silver at 10, gold at 50, diamond at 200, with a one-off reward for each upgrade.']);
HELP.push(['Legendary hunts','A few times a season a legendary boss replaces the boss of the day: the Krampus Kraken on Friday 18 December, the Leviathan in January and the Kraken Queen in February. It has 1.4 times the crew target in HP and every DM that day hits it. The Herald and the Today card warn you the day before. Sink it for a unique trophy, its legendary loot piece, 600 XP and 200 doubloons each.']);
HELP.push(['Ship damage','Your ships show how the last few working days went, as looks only: a patched sail after a missed target, a hole and a bailing bucket after two, smoke and a crab holding up the mast after three. Every target day repairs a level, and a 150% day fixes everything and gives the hull a shine. It never costs anything.']);
