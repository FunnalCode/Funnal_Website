/* ============================== THE BLACK MARKET (Stage 4) ==============================
   9pm to 1am, a lantern-lit stall on the far side of the Harbour. The seller is a cloaked figure with a beak
   who is definitely not Gary. Four items a night (two exclusive cosmetics, two joke trinkets), one of them
   "tonight's bargain" at 40% off; one night a week the bargain is a dud (a Soggy Biscuit).
   Duplicate boss loot pieces can be fenced here for doubloons. Purchases are ordinary spend entries. */
const BM_REAL=[
  {id:'hat_bmcrown',name:'Definitely Not Stolen Crown',cat:'hat',st:'bmcrown',col:'#E8B43A',price:3200},
  {id:'fig_bmhood',name:'Suspiciously Familiar Figurehead',cat:'figure',st:'bmhood',price:4500},
  {id:'hull_bmkraken',name:'Pre-Owned Kraken Hull',cat:'hull',col:'#5A3A6E',col2:'#3A2448',suckers:true,price:5000},
  {id:'sail_bmshiny',name:'The Shiniest Sail',cat:'sail',col:'#F6E6A8',col2:'#D9E4F2',pat:'grad',shiny:true,price:3800},
  {id:'flag_bmgull',name:'The Jolly Gull',cat:'flag',col:'#22252E',sym:'gull',sc:'#FFFFFF',price:1500},
  {id:'bm_chest',name:'Chest of Definitely Legal Goods',cat:'decor',price:1200},
  // 21 Nov: more things you can only get here, after dark
  {id:'sail_bmmoon',name:"Smuggler's Moonlight Sails",cat:'sail',col:'#0E1424',col2:'#9FE3F5',pat:'galaxy',price:4200},
  {id:'sail_bmtiger',name:'Contraband Tiger Sails',cat:'sail',col:'#2A2024',col2:'#C9A24A',pat:'tiger',price:3600},
  {id:'sail_bmcheck',name:"Pickpocket's Chequers",cat:'sail',col:'#2A2433',col2:'#F2C462',pat:'checker',price:2600},
  {id:'hull_bmrum',name:"Rum-Runner's Hull",cat:'hull',col:'#1C2A30',col2:'#122026',lights:true,price:6200},
  {id:'flag_bmspot',name:'The Black Spot',cat:'flag',col:'#0E0E12',sym:'skull',sc:'#C91E36',price:1400},
  {id:'flag_bmblades',name:'Hot Cutlasses',cat:'flag',col:'#5A1E2A',sym:'swords',sc:'#F2C462',price:1800},
  {id:'hat_bmmoon',name:'Moonshine Tricorn',cat:'hat',st:'tricorn',col:'#3A2A5C',price:2200},
  {id:'hat_bmband',name:"Smuggler's Bandana",cat:'hat',st:'bandana',col:'#1E1A24',price:900},
  {id:'coat_bmfence',name:"The Fence's Coat",cat:'coat',st:'trim',col:'#2A2433',col2:'#F2C462',price:3400}];
const BM_JOKE=[
  {id:'bm_scale',name:'Genuine Mermaid Scale (laminated)',cat:'decor',price:120},
  {id:'bm_map',name:'Slightly Used Treasure Map (Tesco car park)',cat:'decor',price:150},
  {id:'bm_bottle',name:'Message in a Bottle (it says "help")',cat:'decor',price:90},
  {id:'bm_tooth',name:'Real Kraken Tooth (plastic)',cat:'decor',price:140},
  {id:'bm_shipbottle',name:'Ship in a Bottle (ship sold separately)',cat:'decor',price:110},
  {id:'bm_air',name:'Bag of Premium Sea Air',cat:'decor',price:60},
  {id:'bm_rock',name:'Pet Rock (answers to Kevin)',cat:'decor',price:80},
  {id:'bm_spoon',name:'Captain Blackbeard\'s Spoon (probably)',cat:'decor',price:100}];
const BM_DUD={id:'bm_soggy',name:'Soggy Biscuit',cat:'decor',price:0};
[...BM_REAL,...BM_JOKE,BM_DUD].forEach(i=>{i.bm=true;i.lvl=1;if(!ALL_ITEMS[i.id]){ITEMS.push(i);ALL_ITEMS[i.id]=i;}});
const BM_IDS=new Set([...BM_REAL,...BM_JOKE,BM_DUD].map(i=>i.id));
// the shop never lists Black Market goods; owners still see theirs in the wardrobe and hideout
{const _shopBM=SCREENS.shop;if(_shopBM)SCREENS.shop=function(){const me=G&&G.players[S.me];const keep=ITEMS.slice();ITEMS.length=0;keep.forEach(i=>{if(!BM_IDS.has(i.id)||(me&&me.owned[i.id]))ITEMS.push(i);});try{return _shopBM.apply(this,arguments);}finally{ITEMS.length=0;keep.forEach(i=>ITEMS.push(i));}};}
(function bmTags(){const st=document.createElement('style');const ids=[...BM_IDS];st.textContent=ids.map(i=>`.shopItem:has(canvas[data-id="${i}"])`).join(',')+`{position:relative}`+ids.map(i=>`.shopItem:has(canvas[data-id="${i}"])::after`).join(',')+`{content:'Black Market';position:absolute;top:6px;right:6px;background:#2A2433;color:#F2C462;font:600 9.5px var(--display);padding:2px 6px;border-radius:8px}`;document.head.appendChild(st);})();

/* ---------- opening hours: the night belongs to the evening's date ---------- */
function marketNight(ts=Date.now()){const l=L(ts);if(l.min>=21*60)return l.date;if(l.min<60)return addDays(l.date,-1);return null;}
function marketOpen(){return !!marketNight();}
function nextNight(){const l=L();return l.min<60?addDays(l.date,-1):l.date;}
function dudNight(night){const ws=weekStart(night);return addDays(ws,h32(ws+'bmdud')%7)===night;}
function marketStock(night){const pick=(arr,n,salt)=>arr.map(i=>({i,k:h32(night+i.id+salt)})).sort((a,b)=>a.k-b.k).slice(0,n).map(x=>x.i);
  const real=pick(BM_REAL,3,'r'),joke=pick(BM_JOKE,2,'j');const bar=joke[h32(night+'bar')%2];
  const dud=dudNight(night);return [...real,...joke].map(i=>({it:i,bargain:i===bar,price:i===bar?Math.max(10,Math.round(i.price*(dud?.4:.6)/10)*10):i.price}));}

/* ---------- fenced treasure: two relics you're missing, each night, at a proper price ---------- */
function bmRelics(night){if(typeof relicList!=='function'||!G||!S.me)return [];const have=relicCounts(S.me);const miss=relicList().filter(r=>!(have[r.id]>0));
  return miss.map(r=>({r,k:h32(night+r.id+'bmr')})).sort((a,b)=>a.k-b.k).slice(0,2).map(x=>({r:x.r,price:900+(x.r.si%5)*150}));}
ACT.bmRelic=async d=>{const night=marketNight();if(!night)return toast('<b>Shut.</b> The stall packed up at 1am.','joke');const x=bmRelics(night).find(y=>y.r.id===d.id);if(!x)return;const me=G.players[S.me];
  if(me.balance<x.price)return toast('<b>Not enough doubloons.</b> "Treasure costs treasure," says the trader.','joke');const id=uid();
  try{await writeDay(S.me,G.today,{spend:{[id]:{item:'bm_relic',cost:x.price,ts:Date.now(),bm:night,relic:x.r.id}},bonus:{['bmr_'+id]:{xp:0,g:0,ts:Date.now(),relic:x.r.id}}});SFX.ach();toast(`<b>${esc(x.r.name)}</b> is in your Treasure. "Found it on a beach. Honest."`);}catch(e){writeFail(e);}};

/* ---------- fencing duplicate loot pieces ---------- */
const FENCE_PAY={common:15,uncommon:30,rare:70,legendary:180};
function fenceList(){if(typeof bossLoot!=='function'||!G)return [];const {have}=bossLoot(S.me);return Object.entries(have).filter(([id,n])=>n>1).map(([id,n])=>{const bid=id.split('_').slice(1,-1).join('_');const b=ALL_BOSSES[bid];if(!b)return null;const pc=setOf(b)[+id.split('_').pop()];return pc?{pc,n,pay:FENCE_PAY[pc.rar]||15}:null;}).filter(Boolean).sort((a,b)=>b.pay-a.pay);}

/* ---------- the screen ---------- */
function bmSay(salt){const l=GL().market||[];return l.length?l[h32(String(salt))%l.length]:"I'm not Gary.";}
SCREENS.market=()=>{const night=marketNight();const me=G.players[S.me];
  if(!night){const tonight=nextNight();return `<div class="pad"><div class="card bmShut"><canvas class="bmArt" width="480" height="260" data-bm="shut"></canvas><h2>The Black Market</h2><p>The stall is shut. A soggy sign says: <i>"Back at 9pm. Not Gary."</i></p><p class="tiny muted">Open every night from 9pm to 1am on the far side of the Harbour. Four shady items a night, and the trader buys duplicate boss loot. ${dudNight(tonight)?'':''}</p></div></div>`;}
  const st=marketStock(night);const fl=fenceList();S.bmSalt=(S.bmSalt||0);
  return `<div class="pad"><div class="card bmCard"><canvas class="bmArt" width="480" height="260" data-bm="open"></canvas><small>The Black Market · open until 1am</small><h2>"${esc(bmSay(night+S.bmSalt))}"</h2><button class="btn sm ghost" data-act="bmTalk">Ask if he's Gary</button></div>
   <div class="card"><h3>Tonight's goods</h3><div class="list">${st.map(x=>{const own=me.owned[x.it.id];return `<div class="li bmItem ${x.bargain?'bargain':''}"><canvas class="lfIco" width="96" height="96" data-bmi="${x.it.id}"></canvas><span class="grow"><b>${esc(x.it.name)}</b>${x.bargain?' <span class="bmTag">Tonight\'s bargain</span>':''}<br><small>${x.it.cat==='decor'?'Hideout decoration':esc(CAT_NAMES[x.it.cat]||x.it.cat)}${BM_REAL.includes(x.it)?' · only sold here':''}${x.bargain?` · <s>${fmtN(x.it.price)}</s>`:''}</small></span>${own?'<span class="okTag">Owned</span>':`<button class="btn sm ${x.bargain?'primary':''}" data-act="bmBuy" data-id="${x.it.id}" ${me.balance<x.price?'disabled':''}>${fmtN(x.price)} ${CN}</button>`}</div>`;}).join('')}</div>
   <p class="tiny muted">The first three are only ever sold here. No receipts, no refunds. The trinket bargain is usually 40% off; if it looks too good to be true, it probably is. Stock changes every night.</p></div>
   ${(()=>{const rl=bmRelics(night);return rl.length?`<div class="card"><h3>Fenced treasure</h3><p class="tiny muted">Relics you haven't found yet. They go straight into your Treasure and count towards their set.</p><div class="list">${rl.map(x=>`<div class="li"><canvas width="96" height="96" class="lfIco" data-relic="${x.r.id}" data-found="1"></canvas><span class="grow"><b>${esc(x.r.name)}</b><br><small>${esc(x.r.set)}</small></span><button class="btn sm" data-act="bmRelic" data-id="${x.r.id}" ${me.balance<x.price?'disabled':''}>${fmtN(x.price)} ${CN}</button></div>`).join('')}</div></div>`:'';})()}
   <div class="card"><h3>Fencing</h3><p class="tiny muted">The trader buys duplicate boss loot pieces (Pell won't). He always leaves you one of each.</p>${fl.length?`<div class="list">${fl.map(x=>`<div class="li"><canvas width="96" height="96" class="lfIco" data-piece="${x.pc.id}"></canvas><span class="grow"><b>${esc(x.pc.name)}</b><br><small class="r-${x.pc.rar}">${x.pc.rar} · you have ${x.n}</small></span><button class="btn sm" data-act="bmFence" data-id="${x.pc.id}">Sell 1 · ${x.pay} ${CN}</button></div>`).join('')}</div>`:'<p class="tiny">No duplicates to sell. Sink more bosses. "I\'ll be here," he says. "Not as Gary."</p>'}</div></div>`;};
ACT.bmTalk=()=>{S.bmSalt=(S.bmSalt||0)+1;const h=document.querySelector('.bmCard h2');if(h)h.textContent='"'+bmSay(marketNight()+S.bmSalt)+'"';SND.pop();};
ACT.bmBuy=async d=>{const night=marketNight();if(!night)return toast('<b>Shut.</b> The stall packed up at 1am.','joke');const x=marketStock(night).find(y=>y.it.id===d.id);if(!x)return;const me=G.players[S.me];
  if(me.owned[x.it.id])return;if(me.balance<x.price)return toast('<b>Not enough doubloons.</b> "Come back richer," says the trader.','joke');
  const dud=x.bargain&&dudNight(night);const id=uid();
  try{await writeDay(S.me,G.today,{spend:{[id]:{item:dud?BM_DUD.id:x.it.id,cost:x.price,ts:Date.now(),bm:night,...(dud?{dud:x.it.id}:{})}}});
    if(dud){SND.err();const l=GL().scammed||[];toast(`<b>Scammed by a gull.</b> The "${esc(x.it.name)}" was a Soggy Biscuit in a box. "${esc(l.length?l[h32(id)%l.length]:'No refunds.')}"`,'joke');banner('SCAMMED BY A GULL','Soggy Biscuit acquired');}
    else{SFX.ach();toast(`<b>Bought ${esc(x.it.name)}.</b> "Pleasure. Tell nobody. Especially not Gary."`);banner('NEW '+x.it.name.toUpperCase(),'Black Market');
      if(x.it.cat==='decor')await ACT.place({id:x.it.id,cat:'decor'});else if(EQUIP_CATS.includes(x.it.cat))await writePlayer(S.me,{[x.it.cat]:x.it.id});}}catch(e){writeFail(e);}};
ACT.bmFence=async d=>{if(!marketOpen())return toast('<b>Shut.</b> Fencing happens after 9pm.','joke');const x=fenceList().find(y=>y.pc.id===d.id);if(!x||x.n<2)return;
  try{await writeDay(S.me,G.today,{bonus:{[`fn_${uid()}`]:{xp:0,g:x.pay,take:x.pc.id,n:1,ts:Date.now()}}});SND.coin();toast(`<b>Sold ${esc(x.pc.name)}</b> for ${x.pay} ${CN}. "Lovely. No questions."`);}catch(e){writeFail(e);}};

/* the Scammed by a Gull achievement */
{const _fm=fishMetrics;fishMetrics=function(p){const m=_fm.apply(this,arguments)||{};let n=0;try{for(const k in S.days){const d=S.days[k];if(!d||d.pid!==p)continue;for(const id in d.spend||{}){if(d.spend[id]&&d.spend[id].item===BM_DUD.id)n++;}}}catch(e){}m.scammed=n;return m;};}
[['scammed1','Scammed by a Gull','Buy a Black Market bargain that turns out to be a Soggy Biscuit','rare','Secret',['scammed',1]]].forEach(([id,name,desc,rar,cat,[metric,target]])=>{if(ACH_BY_ID[id])return;const a={id,name,desc,rar,cat,metric,target,secret:true,reveal:'Something about a biscuit.'};ACHIEVEMENTS.push(a);ACH_BY_ID[id]=a;});

/* ---------- art: the stall, the trader and the goods ---------- */
function drawTrader(c,x,y,t,s=1){c.save();c.translate(x,y);c.scale(s,s);const b=Math.sin(t/700)*.3;
  c.fillStyle='#2A2433';c.beginPath();c.moveTo(-5,0);c.quadraticCurveTo(-5.6,-8,-2.6,-12+b);c.quadraticCurveTo(0,-14.4+b,2.6,-12+b);c.quadraticCurveTo(5.6,-8,5,0);c.closePath();c.fill();
  ell(c,.4,-10.2+b,2.4,2.2,'#15121B');poly(c,[[1.6,-10.6+b],[5.8,-9.8+b],[1.6,-9+b]],'#F2A33A');disc(c,.9,-11+b,.45,'#FFE7A0');disc(c,.9,-11+b,.2,'#15121B');
  R(c,-2.2,-7+b,1.3,3.2,'#FFFFFF');c.restore();}
function drawStall(c,x,y,t){const glow=.75+.25*Math.sin(t/230)+.06*Math.sin(t/57);
  const g=c.createRadialGradient(x+2,y-12,1,x+2,y-12,26);g.addColorStop(0,`rgba(255,196,110,${.42*glow})`);g.addColorStop(1,'rgba(255,196,110,0)');c.fillStyle=g;c.fillRect(x-26,y-40,56,52);
  R(c,x-9,y-15,1,15,'#4A3628');R(c,x+11,y-15,1,15,'#4A3628');for(let i=0;i<5;i++)rr(c,x-10+i*4.4,y-18,4.4,4,1.4,i%2?'#3A2448':'#1E1A26');
  rr(c,x-9,y-6,21,6,1,'#5C4330');R(c,x-9,y-6.6,21,1,'#7A5A3A');disc(c,x-5,y-7.6,1.2,'#E8B43A');rr(c,x-1,y-9,3.4,2.6,.6,'#8A5A3A');disc(c,x+6,y-7.8,1.4,'rgba(170,220,255,.8)');
  if(xmasNowSafe())for(let i=0;i<9;i++){const on=Math.sin(t/300+i*1.7)>-.3;disc(c,x-9.5+i*2.6,y-13.6+Math.sin(i*1.4)*.4,.55,on?['#E0453B','#F2C462','#3FA34D','#4A9BE0'][i%4]:'rgba(255,255,255,.3)');}drawTrader(c,x+2.5,y-6.6,t,.62);R(c,x+11.5,y-15.4,.6,3,'#4A3628');disc(c,x+11.8,y-11.4,1.3,`rgba(255,214,130,${glow})`);lamp(c,x+11.8,y-11.4,6,.5*glow,'255,200,120');}
addLayer('world','blackMarket',(c,t)=>{const x=21,y=111;drawStall(c,x,y,t);hit(x-12,y-22,28,24,'The Black Market','Open 9pm to 1am. A cloaked trader with a beak sells shady goods and buys duplicate loot. Tap to visit.',{go:'market'});},{scenes:['harbour'],z:6,when:()=>marketOpen()});
{const _rdM=render;render=function(){_rdM.apply(this,arguments);try{document.querySelectorAll('canvas[data-bmi]').forEach(cv=>drawItemIcon(cv,cv.dataset.bmi));const pcs=document.querySelectorAll('#screen canvas[data-piece]');if(pcs.length&&typeof drawPiece==='function')pcs.forEach(cv=>drawPiece(cv,cv.dataset.piece));
  document.querySelectorAll('canvas[data-bm]').forEach(cv=>{if(cv.__on)return;cv.__on=1;const c=cv.getContext('2d');const open=cv.dataset.bm==='open';let raf;const go=()=>{if(!document.body.contains(cv))return cancelAnimationFrame(raf);const t=performance.now();c.setTransform(2,0,0,2,0,0);
    const g=c.createLinearGradient(0,0,0,130);g.addColorStop(0,'#141A33');g.addColorStop(1,'#2C3560');c.fillStyle=g;c.fillRect(0,0,240,130);for(let i=0;i<24;i++){disc(c,(i*47.3)%240,(i*19.7)%70,.5+(i%3)*.25,`rgba(255,255,255,${.4+.4*Math.sin(t/600+i)})`);}
    c.fillStyle='#1B2A44';c.fillRect(0,104,240,26);ell(c,120,106,110,10,'#3A3428');
    if(open){c.save();c.translate(120,104);c.scale(3,3);drawStall(c,0,0,t);c.restore();}else{c.save();c.translate(120,104);c.scale(3,3);R(c,-9,-15,1,15,'#4A3628');R(c,11,-15,1,15,'#4A3628');rr(c,-9,-6,21,6,1,'#5C4330');for(let i=0;i<5;i++)rr(c,-10+i*4.4,-18,4.4,4,1.4,'#3A3440');rr(c,-6,-12,14,5,.6,'#C9B48A');c.restore();txt(c,'BACK AT 9',123,84,'#3A2A1C',7,'center');}
    raf=requestAnimationFrame(go);};go();});}catch(e){}};}

// cosmetics
W_HAT.bmcrown=(c,x,y,h,t)=>{const g='#E8B43A';c.fillStyle=g;c.beginPath();c.moveTo(x+.4,y+2.8);c.lineTo(x+.4,y-.4);c.lineTo(x+2,y+1);c.lineTo(x+4,y-1.6);c.lineTo(x+6,y+1);c.lineTo(x+7.6,y-.4);c.lineTo(x+7.6,y+2.8);c.closePath();c.fill();
  R(c,x+.4,y+1.9,7.2,.9,'#C8922A');disc(c,x+4,y+.6,.75,'#C8102E');disc(c,x+2,y+2.3,.45,'#3A7BD5');disc(c,x+6,y+2.3,.45,'#2F8F4E');[[.4,-.4],[4,-1.6],[7.6,-.4]].forEach(([a,b])=>disc(c,x+a,y+b,.4,'#FFF0B0'));
  c.strokeStyle='#D9D2C2';c.lineWidth=.2;c.beginPath();c.moveTo(x+7.6,y+1.6);c.lineTo(x+8.8,y+3.4);c.stroke();rr(c,x+8.2,y+3.3,1.8,1.1,.3,'#F4EFE4');};
{const _dfB=drawFigure;drawFigure=function(c,x,y,fid){const f=it(fid);if(!f||f.st!=='bmhood')return _dfB.apply(this,arguments);
  ell(c,x+1.6,y-1.4,2.8,1.7,'#2A2433');disc(c,x+3.4,y-3.2,1.9,'#2A2433');disc(c,x+3.9,y-3,1.15,'#F4F2EE');poly(c,[[x+4.6,y-3.3],[x+6.6,y-2.8],[x+4.6,y-2.3]],'#F2A33A');disc(c,x+4,y-3.4,.3,'#2A2730');disc(c,x+6.9,y-2.2,.6,'#E8B43A');};}
if(typeof drawSymbolBase==='function'){const _dsG=drawSymbolBase;drawSymbolBase=function(c,sym,cx,cy,s,col){if(sym!=='gull')return _dsG.apply(this,arguments);ell(c,cx-.3*s,cy+.2*s,1.9*s,1.1*s,col);disc(c,cx+1.3*s,cy-.8*s,.9*s,col);poly(c,[[cx+2*s,cy-.95*s],[cx+3*s,cy-.65*s],[cx+2*s,cy-.4*s]],'#F2A33A');poly(c,[[cx-.9*s,cy-.1*s],[cx-.2*s,cy-1.7*s],[cx+.6*s,cy-.1*s]],col);disc(c,cx+1.5*s,cy-1*s,.2*s,'#22252E');};}
{const _dsK=drawShip;drawShip=function(c,x,y,s,pl,t,opts={}){_dsK.apply(this,arguments);pl=pl||{};const hull=it(pl.hull||SHIP_DEFAULT.hull)||{},sail=it(pl.sail||SHIP_DEFAULT.sail)||{};if(!hull.suckers&&!sail.shiny)return;const ph=opts.phase||0;const fire=opts.firing>0?opts.firing:0,kick=fire*fire;
  const rock=Math.sin(t/900+ph)*.04+Math.sin(t/410+ph*2)*.012-kick*.045,bob=Math.sin(t/650+ph)*1.3+Math.sin(t/270+ph)*.3;c.save();c.translate(x-kick*2.2*s,y+bob*s*.4);c.rotate(rock);c.scale(s,s);
  if(hull.suckers)for(let i=0;i<9;i++){const bx=-28+i*6.6,by=-10.6+Math.sin(i*1.3)*.5;disc(c,bx,by,1.5,'#7A5490');disc(c,bx,by,.8,'#3A2448');}
  if(sail.shiny)for(let i=0;i<4;i++){const a=Math.sin(t/260+i*1.9);if(a<.3)continue;const sx=[-8,6,-3,9][i],sy=[-40,-34,-27,-22][i],r=1.4*a;c.fillStyle=`rgba(255,255,255,${a})`;c.beginPath();c.moveTo(sx,sy-r*1.8);c.lineTo(sx+r*.4,sy);c.lineTo(sx,sy+r*1.8);c.lineTo(sx-r*.4,sy);c.closePath();c.fill();c.beginPath();c.moveTo(sx-r*1.8,sy);c.lineTo(sx,sy+r*.4);c.lineTo(sx+r*1.8,sy);c.lineTo(sx,sy-r*.4);c.closePath();c.fill();}
  c.restore();};}
Object.assign(DECOR,{
  bm_chest:(c,x,y)=>{rr(c,x-5,y-6,10,6,1,'#6B4A2E');R(c,x-5,y-4.4,10,.8,'#3A2A1C');rr(c,x-5.2,y-8.4,10.4,3,1.6,'#7A5A3A');disc(c,x,y-4,.9,'#E8B43A');disc(c,x-3,y-8.8,.7,'#E8B43A');disc(c,x+2.4,y-9,.6,'#C8102E');},
  bm_scale:(c,x,y,t)=>{rr(c,x-3.4,y-9,6.8,8.4,1,'rgba(230,245,255,.7)');ell(c,x,y-5,2.2,2.8,'#5BC8C0');ell(c,x-.5,y-5.6,1,1.4,`rgba(255,255,255,${.5+.3*Math.sin((t||0)/300)})`);R(c,x-.5,y-.6,1,.6,'#9A8A6A');},
  bm_map:(c,x,y)=>{rr(c,x-4.6,y-6.4,9.2,6.2,.6,'#EADBB8');c.strokeStyle='#A88A5A';c.lineWidth=.3;c.setLineDash([.8,.6]);c.beginPath();c.moveTo(x-3.4,y-1.6);c.quadraticCurveTo(x-1,y-5,x+1.8,y-3.4);c.stroke();c.setLineDash([]);line(c,x+1.2,y-4.6,x+3,y-2.8,'#C8102E',.5);line(c,x+3,y-4.6,x+1.2,y-2.8,'#C8102E',.5);},
  bm_bottle:(c,x,y)=>{rr(c,x-3.6,y-3.4,7.2,3.2,1.4,'rgba(140,200,170,.75)');R(c,x+3.4,y-2.4,1.6,1.2,'#8A6A45');rr(c,x-2.4,y-2.8,3.6,1.8,.4,'#F4EFE4');},
  bm_tooth:(c,x,y)=>{poly(c,[[x-2.4,y],[x,y-9],[x+2.4,y]],'#F4F0E4');poly(c,[[x+.6,y],[x,y-9],[x+2.4,y]],'#DCD6C6');R(c,x-1.6,y-2.2,3.2,.7,'#E87FA6');},
  bm_shipbottle:(c,x,y)=>{rr(c,x-5,y-4,9,3.8,1.8,'rgba(190,225,245,.6)');R(c,x+3.8,y-2.8,1.8,1.5,'#8A6A45');ell(c,x-.6,y-.8,3.4,.6,'rgba(60,120,170,.5)');},
  bm_air:(c,x,y,t)=>{const p=Math.sin((t||0)/700)*.3;ell(c,x,y-4,3.4+p,3.8+p,'rgba(245,245,240,.85)');R(c,x-1,y-8.2,2,1,'#C8102E');txt(c,'AIR',x,y-3.4,'#8A8A8A',2.4,'center');},
  bm_rock:(c,x,y)=>{ell(c,x,y-2.2,3.4,2.4,'#8E8A86');disc(c,x-1,y-2.8,.45,'#FFFFFF');disc(c,x+1,y-2.8,.45,'#FFFFFF');disc(c,x-1,y-2.8,.2,'#222');disc(c,x+1,y-2.8,.2,'#222');},
  bm_spoon:(c,x,y)=>{line(c,x-3.6,y-1,x+1.6,y-4.6,'#C9CDD4',.8);ell(c,x+2.6,y-5.4,1.6,1,'#C9CDD4',-.6);},
  bm_soggy:(c,x,y)=>{ell(c,x,y-1.6,4,1.6,'#B88E55');ell(c,x,y-2,3.4,1.2,'#C9A06A');[[-1.6,-2],[0,-2.4],[1.6,-1.8]].forEach(([a,b])=>disc(c,x+a,y+b,.3,'#8A6A40'));R(c,x+3,y-1.2,.5,1.8,'rgba(120,170,210,.7)');}});

/* ---------- a card on the Harbour while it's open ---------- */
function marketCardHtml(){if(!marketOpen())return '';return `<a class="card bmTease" href="#market"><canvas class="bmMini" width="96" height="96" data-bmmini="1"></canvas><div><small>Far side of the island · until 1am</small><h3>The Black Market is open</h3><p class="tiny">Four shady items tonight. Duplicate loot bought. Definitely not run by Gary.</p></div></a>`;}
{const _hM=SCREENS.harbour;SCREENS.harbour=function(){const h=_hM.apply(this,arguments);const x=marketCardHtml();if(!x)return h;const k='<div class="card today">';return h.includes(k)?h.replace(k,x+k):h+x;};}
{const _rdMm=render;render=function(){_rdMm.apply(this,arguments);try{document.querySelectorAll('canvas[data-bmmini]').forEach(cv=>{const c=cv.getContext('2d');c.setTransform(4,0,0,4,0,0);c.clearRect(0,0,24,24);c.fillStyle='#1E2440';c.fillRect(0,0,24,24);drawTrader(c,11,22,0,1.3);});}catch(e){}};}
HELP.push(['The Black Market','From 9pm to 1am a lantern-lit stall opens on the far side of the Harbour. The cloaked trader (not Gary, he insists) sells four items a night: two cosmetics you can\'t get anywhere else and two joke trinkets for the hideout. One of them is tonight\'s bargain, usually 40% off. One night a week the bargain is a dud: if it looks too cheap to be true, it is. He also buys duplicate boss loot pieces for doubloons, always leaving you one of each.']);
