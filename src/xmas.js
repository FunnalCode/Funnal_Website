/* ============================== CHRISTMAS: ADVENT CHEST, LIMITED ITEMS, FISH, PENGUIN (Stage 1C) ==============================
   1 to 26 December. Everything derives from the days you hit the crew target, like the rest of the game. */
const inXmas=date=>{const m=date.slice(5,7),d=+date.slice(8,10);return m==='12'&&d<=26;};
const xmasNow=()=>(typeof THEME!=='undefined'&&THEME.festive==='christmas')||inXmas(G?G.today:L(Date.now()).date);

/* ---------- limited items (on sale 1 to 26 December only; owners keep them forever) ---------- */
const XMAS_ITEMS=[
  {id:'sail_tinsel',name:'Tinsel Sails',cat:'sail',col:'#C8102E',col2:'#F2C462',pat:'stars',price:600},
  {id:'fig_reindeer',name:'Reindeer Figurehead',cat:'figure',st:'reindeer',price:2500},
  {id:'coat_xjumper',name:'Christmas Jumper',cat:'coat',st:'xjumper',col:'#C8102E',col2:'#FFFFFF',price:900},
  {id:'hat_elf',name:'Elf Hat',cat:'hat',st:'elf',col:'#2F8F4E',price:450},
  {id:'face_santa',name:'Santa Beard',cat:'face',st:'santa',col:'#FFFFFF',price:700},
  {id:'shot_sprout',name:'Sprout Cannonballs',cat:'shot',st:'sprout',price:300},
  {id:'snowglobe',name:'Snow Globe',cat:'decor',price:500},
  {id:'gingerbread',name:'Gingerbread Cabin',cat:'decor',price:800},
  {id:'hull_fairy',name:'Fairy-Light Hull',cat:'hull',col:'#2E3A5C',col2:'#22304F',lights:true,price:1800},
  {id:'flag_mistletoe',name:'Mistletoe Flag',cat:'flag',col:'#FFFFFF',sym:'mistletoe',sc:'#2F8F4E',price:400},
  {id:'fig_goldreindeer',name:'Golden Reindeer',cat:'figure',st:'goldreindeer',xmasEarn:true}
];
XMAS_ITEMS.forEach(i=>{i.xmas=2026;i.lvl=1;if(i.xmasEarn){i.earn=['advent',24,'Open all 24 doors of the Advent Chest','doors'];delete i.xmasEarn;}if(!ALL_ITEMS[i.id]){ITEMS.push(i);ALL_ITEMS[i.id]=i;}});
// the shop only shows them while Christmas is on (unless you own one)
const _shopX=SCREENS.shop;if(_shopX)SCREENS.shop=function(){const on=xmasNow();if(on)return _shopX.apply(this,arguments);const me=G&&G.players[S.me];const keep=ITEMS.slice();const hide=new Set(XMAS_ITEMS.filter(i=>!(me&&me.owned[i.id])).map(i=>i.id));
  ITEMS.length=0;keep.forEach(i=>{if(!hide.has(i.id))ITEMS.push(i);});try{return _shopX.apply(this,arguments);}finally{ITEMS.length=0;keep.forEach(i=>ITEMS.push(i));}};
(function xmasTags(){const st=document.createElement('style');st.textContent=XMAS_ITEMS.map(i=>`.shopItem:has(canvas[data-id="${i.id}"])`).join(',')+`{position:relative}`+XMAS_ITEMS.map(i=>`.shopItem:has(canvas[data-id="${i.id}"])::after`).join(',')+`{content:'Christmas 2026';position:absolute;top:6px;right:6px;background:#C8102E;color:#fff;font:600 9.5px var(--display);padding:2px 6px;border-radius:8px;letter-spacing:.02em}`;document.head.appendChild(st);})();

/* ---------- their art, in the game's flat style ---------- */
W_HAT.elf=(c,x,y,h,t)=>{const sw=Math.sin((t||0)/500)*.4;c.fillStyle=h.col;c.beginPath();c.moveTo(x+.3,y+2.6);c.quadraticCurveTo(x+3,y-3.4,x+8.4+sw,y-1.2);c.quadraticCurveTo(x+6.4,y+.2,x+7.7,y+2.6);c.closePath();c.fill();rr(c,x+.1,y+1.9,7.8,1.2,.6,'#C8102E');disc(c,x+8.6+sw,y-1,.75,'#F2C462');};
W_FACE.santa=(c,x,y,f)=>{c.fillStyle='#FFFFFF';c.beginPath();c.moveTo(x+.5,y+3.6);c.quadraticCurveTo(x+.2,y+7.2,x+2,y+8.6);for(let i=0;i<4;i++){const x1=x+2+(i+1)*1.05;c.quadraticCurveTo(x1-.5,y+10.2-(i%2)*.6,x1,y+8.8);}c.quadraticCurveTo(x+7.8,y+7.2,x+7.5,y+3.6);c.quadraticCurveTo(x+6,y+5.8,x+4,y+6.1);c.quadraticCurveTo(x+2,y+5.8,x+.5,y+3.6);c.closePath();c.fill();
  [[2.2,7],[4,8.2],[5.8,7]].forEach(([a,b])=>disc(c,x+a,y+b,.9,'#F2F4F6'));fitTash(c,x,y,'#F4F6F8',false);};
W_COAT.xjumper=(c,x,y,o)=>{rr(c,x+1.3,y+6,5.4,4.6,2,o.col);c.save();rr(c,x+1.3,y+6,5.4,4.6,2,'rgba(0,0,0,0)');c.clip();R(c,x+1.2,y+7.2,5.6,.9,o.col2);for(let i=0;i<6;i++)poly(c,[[x+1.4+i*.95,y+7.2],[x+1.87+i*.95,y+6.7],[x+2.35+i*.95,y+7.2]],o.col2);R(c,x+1.2,y+10,5.6,.6,o.col2);c.restore();
  disc(c,x+4,y+9,.8,'#7A4BB8');for(let i=0;i<3;i++)line(c,x+3.4+i*.6,y+9.5,x+3.2+i*.6,y+10.2,'#7A4BB8',.25);disc(c,x+3.7,y+8.9,.15,'#FFFFFF');disc(c,x+4.3,y+8.9,.15,'#FFFFFF');rr(c,x+2.7,y+5.9,2.6,.8,.4,o.col2);};
{const _df=drawFigure;drawFigure=function(c,x,y,fid){const f=it(fid);if(!f||(f.st!=='reindeer'&&f.st!=='goldreindeer'))return _df.apply(this,arguments);const g=f.st==='goldreindeer',b=g?'#E8BC52':'#9A6B45',a=g?'#F7DA86':'#C9A27A';
  [[-1,0],[1,1]].forEach(([s])=>{c.strokeStyle=a;c.lineWidth=.45;c.lineCap='round';c.beginPath();c.moveTo(x+2.6+s*.7,y-5.4);c.lineTo(x+2.6+s*2.2,y-8.4);c.moveTo(x+2.6+s*1.5,y-6.9);c.lineTo(x+2.6+s*2.6,y-7.2);c.stroke();});
  ell(c,x+2.6,y-3.4,2.3,2.7,b);ell(c,x+3.9,y-2.2,1.6,1.2,g?'#F2C462':'#B98A5E');disc(c,x+5.2,y-2.3,.75,g?'#FFFFFF':'#E0453B');disc(c,x+2.1,y-4,.4,'#2A2730');ell(c,x+1.2,y-5,.8,.4,b,-.5);if(g){disc(c,x+1.6,y-5.4,.25,'#FFFFFF');}};}
{const _ds=drawShot;drawShot=function(c,x,y,st,t){if(st!=='sprout')return _ds.apply(this,arguments);disc(c,x,y,2.1,'#6BAE45');disc(c,x-.5,y-.5,1.2,'#8CCB63');c.strokeStyle='#4E8A32';c.lineWidth=.25;c.beginPath();c.arc(x,y,1.4,-.6,1.6);c.stroke();c.beginPath();c.moveTo(x,y-2);c.lineTo(x+.2,y+1.6);c.stroke();};}
DECOR.snowglobe=(c,x,y,t)=>{rr(c,x-5,y-2.6,10,2.6,1,'#8A5A3A');disc(c,x,y-8,5.4,'rgba(220,240,255,.55)');ell(c,x,y-3.6,4.4,1.2,'#FFFFFF');poly(c,[[x-2,y-4],[x,y-9.6],[x+2,y-4]],'#2F7A52');disc(c,x,y-9.8,.5,'#F2C462');
  for(let i=0;i<8;i++){const q=((t/2200)+i/8)%1;disc(c,x-3.6+((i*37)%72)/10,y-12.4+q*8,.3,'#FFFFFF');}ell(c,x-2.2,y-10.4,1.2,2,'rgba(255,255,255,.5)');};
DECOR.gingerbread=(c,x,y,t)=>{rr(c,x-6,y-8,12,8,1,'#B9773E');poly(c,[[x-7.4,y-7.4],[x,y-13.6],[x+7.4,y-7.4]],'#8A5A2A');c.strokeStyle='#FFFFFF';c.lineWidth=.6;c.beginPath();for(let i=0;i<=6;i++)c.lineTo(x-7+i*2.33,y-7.6+(i%2?.8:0));c.stroke();
  rr(c,x-1.6,y-5,3.2,5,1.4,'#6B4429');[[-4,-5.6],[4,-5.6]].forEach(([a,b])=>{rr(c,x+a-1.2,y+b-1.2,2.4,2.4,.4,'#FFE7A0');});[-4.6,-2.2,2.2,4.6].forEach((a,i)=>disc(c,x+a,y-1,.55,XMAS_COLS[i]));disc(c,x,y-10.6,.8,'#E0453B');};
if(typeof drawSymbolBase==='function'){const _ds2=drawSymbolBase;drawSymbolBase=function(c,sym,cx,cy,s,col){if(sym!=='mistletoe')return _ds2.apply(this,arguments);[[-1,-.4],[1,-.6],[-.5,1],[.8,.9]].forEach(([a,b],i)=>ell(c,cx+a*1.2*s,cy+b*.9*s,1.3*s,.6*s,col,a*b*1.2));[[0,0],[.6,.3],[-.5,.35]].forEach(([a,b])=>disc(c,cx+a*s,cy+b*s,.5*s,'#E0453B'));};}
// fairy-light hull: bulbs along the rail and the waterline band
{const _dsX=drawShip;drawShip=function(c,x,y,s,pl,t,opts={}){_dsX.apply(this,arguments);pl=pl||{};const hull=it(pl.hull||SHIP_DEFAULT.hull)||{};if(!hull.lights)return;const ph=opts.phase||0;const fire=opts.firing>0?opts.firing:0,kick=fire*fire;
  const rock=Math.sin(t/900+ph)*.04+Math.sin(t/410+ph*2)*.012-kick*.045,bob=Math.sin(t/650+ph)*1.3+Math.sin(t/270+ph)*.3;c.save();c.translate(x-kick*2.2*s,y+bob*s*.4);c.rotate(rock);c.scale(s,s);
  for(let i=0;i<14;i++){const bx=-33+i*4.8,on=Math.sin(t/280+i*1.3)>-.4;disc(c,bx,-15.4+Math.sin(i*1.7)*.3,.6,on?XMAS_COLS[i%5]:'rgba(255,255,255,.4)');if(on&&isNight())lamp(c,bx,-15.4,2.6,.35,'255,230,160');}
  for(let i=0;i<11;i++){const bx=-24+i*4.8,on=Math.sin(t/320+i*2.1)>-.4;disc(c,bx,-5.6,.5,on?XMAS_COLS[(i+2)%5]:'rgba(255,255,255,.35)');}c.restore();};}

/* ---------- Christmas fish: in every bait and depth from 1 to 26 December ---------- */
const XMAS_FISH=[['Bauble Puffer','common','puffer','#D9363E','#F2C462','bands'],['Candy Cane Eel','uncommon','eel','#FFFFFF','#D9363E','stripes'],['Tinsel Tetra','rare','oval','#C9D3DC','#5DBE9C','spots'],['Mince Pie Plaice','epic','flat','#C98A4A','#7A4A28','spots'],['Golden Turkey Fish','legendary','puffer','#E8BC52','#B9773E','belly']];
XMAS_FISH.forEach(([name,rar,shape,c1,c2,pat],i)=>{const id='f_'+name.toLowerCase().replace(/[^a-z]+/g,'_');if(FISH_BY_ID[id])return;const f={id,name,rar,i:90+i,shape,c1,c2,pat,len:Math.round(14+i*22),depth:999,xmas:true};FISH.push(f);FISH_BY_ID[id]=f;});
const XMAS_BY_RAR=Object.fromEntries(XMAS_FISH.map(([name,rar])=>[rar,FISH_BY_ID['f_'+name.toLowerCase().replace(/[^a-z]+/g,'_')]]));
if(typeof fishRollV4==='function'){const _fr4=fishRollV4;fishRollV4=function(id,t,trip,date){const f=_fr4.apply(this,arguments);if(!f||f.rar==='transcendent'||!date||!inXmas(date))return f;const x=XMAS_BY_RAR[f.rar];if(!x)return f;return h32(id+'xmasfish')%100<12?x:f;};}

/* ---------- the Santa Penguin: December sightings only ---------- */
if(!PET_BY_ID.p_santapenguin){const p={id:'p_santapenguin',name:'Santa Penguin',sp:'bird',col:'#2E3440',col2:'#FFFFFF',rar:'rare',season:'winter',x:'penguin',santa:true,dec:true,v2:1};PETS.push(p);PET_BY_ID[p.id]=p;}
petFor=function(date,rar){const v2=date>='2026-11-14';const pool=PETS.filter(p=>p.rar===rar&&(v2||!p.v2)&&(p.season===seasonOf(date)||p.season==='evergreen')&&(!p.dec||inXmas(date)));return pool[h32(date+rar+'pet')%pool.length];};
{const _dp=drawPet;drawPet=function(c,pet,x,y,t,s=1,opts={}){_dp.apply(this,arguments);if(!pet||!pet.santa||opts.silhouette)return;const bob=Math.abs(Math.sin(t/260))*(opts.still?0:1.2);c.save();c.translate(x,y);c.scale(s,s);c.translate(0,-bob);
  c.fillStyle='#D9363E';c.beginPath();c.moveTo(-2.2,-9.2);c.quadraticCurveTo(-.4,-13.4,2.8,-12.6);c.quadraticCurveTo(1.6,-11,2.4,-9.4);c.closePath();c.fill();rr(c,-2.6,-9.9,5.4,1.2,.6,'#FFFFFF');disc(c,3,-12.6,.7,'#FFFFFF');c.restore();};}

/* ---------- the Advent Chest ---------- */
const ADVENT=[null,{g:50},{item:'hat_elf'},{g:80},{joke:'A single sprout. Gary ate half of it.'},{g:100},{item:'snowglobe'},{g:120},{joke:'A cracker joke: why did the kraken blush? It saw the ocean\'s bottom.'},{item:'sail_tinsel'},{g:150},{g:75,xp:50},{item:'face_santa'},{g:90},{joke:'Gary, in a stocking. He says he was "testing it".'},{xp:200},{item:'flag_mistletoe'},{g:110},{xp:250},{item:'shot_sprout'},{g:130},{xp:300},{g:160},{g:200},{g:300,xp:300,feast:true}];
function adventYear(){return (G?G.today:THEME.date).slice(0,4);}
function adventState(){const y=adventYear(),today=G.today;const open={},via={};const work=d=>{try{return isWork(d,C());}catch(e){const w=new Date(d+'T12:00:00Z').getUTCDay();return w>0&&w<6;}};
  const hit=d=>{const D=G.days[d];return !!(D&&D.target>0&&D.team>=D.target);};
  for(let dd=1;dd<=26;dd++){const d=`${y}-12-${String(dd).padStart(2,'0')}`;if(d>today)break;if(!hit(d))continue;
    if(dd<=24&&!open[dd]){open[dd]=d;via[dd]='day';}
    const wd=new Date(d+'T12:00:00Z').getUTCDay();if(wd===1){[dd-2,dd-1].forEach(k=>{if(k>=1&&k<=24&&!open[k]&&!work(`${y}-12-${String(k).padStart(2,'0')}`)){open[k]=d;via[k]='weekend';}});}
    // one earlier missed door per target day
    for(let k=1;k<dd&&k<=24;k++){const kd=`${y}-12-${String(k).padStart(2,'0')}`;if(!open[k]&&work(kd)&&kd<d){open[k]=d;via[k]='catchup';break;}}}
  const me=G.players[S.me];const claimed=k=>me.claimed.has(`adv${y}_${String(k).padStart(2,'0')}`);
  return{y,open,via,claimed,nOpen:Object.keys(open).length,nClaimed:Array.from({length:24},(_,i)=>i+1).filter(k=>open[k]&&claimed(k)).length};}
function adventPrizeText(k){const p=ADVENT[k];if(p.item)return ALL_ITEMS[p.item].name;if(p.joke)return p.joke;if(p.feast)return `A Christmas Eve feast: ${p.g} ${CN} and ${p.xp} XP`;return [p.g?`${p.g} ${CN}`:'',p.xp?`${p.xp} XP`:''].filter(Boolean).join(' and ');}
function adventHtml(){if(!xmasNow()||!G)return '';const A=adventState();const today=+G.today.slice(8,10);const curMonth=G.today.slice(5,7)==='12';
  const doors=Array.from({length:24},(_,i)=>{const k=i+1,o=A.open[k],cl=o&&A.claimed(k),p=ADVENT[k];const future=!curMonth||k>today;const cls=cl?'cl':o?'ready':future?'future':'shut';
    return `<button class="advDoor ${cls}" data-act="advDoor" data-k="${k}" aria-label="Door ${k}${cl?', opened':o?', ready to open':''}"><b>${k}</b>${cl?(p.item?`<canvas class="icon" data-id="${p.item}"></canvas>`:`<span>${p.joke?'🎄':p.feast?'🍗':'🎁'}</span>`):''}</button>`;}).join('');
  const ready=Array.from({length:24},(_,i)=>i+1).filter(k=>A.open[k]&&!A.claimed(k)).length;
  return `<div class="card advent"><div class="row" style="justify-content:space-between;align-items:baseline"><h3>Advent Chest</h3><small class="muted">${A.nClaimed}/24 opened</small></div>
    <p class="tiny muted" style="margin:2px 0 8px">Hit the crew target to open today's door. Weekend doors open on Monday, and every target day also opens one door you missed. All 24 earns the Golden Reindeer figurehead.</p>
    <div class="advGrid">${doors}</div>${ready?`<button class="btn primary" style="width:100%;margin-top:8px" data-act="advOpenAll">Open ${ready} door${ready===1?'':'s'}</button>`:''}</div>`;}
ACT.advDoor=async d=>{const k=+d.k;const A=adventState();const key=`adv${A.y}_${String(k).padStart(2,'0')}`;
  if(A.open[k]&&!A.claimed(k))return ACT.advOpenAll({only:k});
  if(A.claimed(k))return toast(`<b>Door ${k}:</b> ${adventPrizeText(k)}`);
  const day=+G.today.slice(8,10);toast(k>day||G.today.slice(5,7)!=='12'?`<b>Door ${k}</b> is for ${k} December. No peeking. Gary already tried.`:`<b>Door ${k}</b> is still shut. Hit the crew target on any day before Boxing Day and it'll open.`);};
ACT.advOpenAll=async d=>{const A=adventState();const ks=Array.from({length:24},(_,i)=>i+1).filter(k=>A.open[k]&&!A.claimed(k)&&(!d||!d.only||k===d.only));if(!ks.length)return;const bonus={};let g=0,xp=0;
  ks.forEach(k=>{const p=ADVENT[k];bonus[`adv${A.y}_${String(k).padStart(2,'0')}`]={xp:p.xp||0,g:p.g||0,ts:Date.now()};g+=p.g||0;xp+=p.xp||0;});
  try{await writeDay(S.me,G.today,{bonus});SFX.ach();openModal(`<h2>Advent Chest</h2><div class="advReveal">${ks.map(k=>{const p=ADVENT[k];return `<div><b>Door ${k}</b>${p.item?`<canvas class="icon" data-id="${p.item}"></canvas>`:''}<span>${adventPrizeText(k)}</span></div>`;}).join('')}</div>${g||xp?`<p class="muted">+${fmtN(g)} ${CN}${xp?`, +${fmtN(xp)} XP`:''}</p>`:''}<div class="row" style="justify-content:flex-end"><button class="btn primary" data-act="wnClose">Merry Christmas</button></div>`);setTimeout(()=>{try{document.querySelectorAll('#modal canvas.icon').forEach(cv=>drawItemIcon(cv,cv.dataset.id));}catch(e){}},50);}catch(e){writeFail(e);}};
// advent items become yours when their door is opened; all 24 earns the Golden Reindeer
const _deriveAdv=derive;derive=function(){const g=_deriveAdv.apply(this,arguments);try{const y=g.today.slice(0,4);g.P.forEach(p=>{const pl=g.players[p];if(!pl)return;let n=0;
  for(let k=1;k<=24;k++){if(pl.claimed.has(`adv${y}_${String(k).padStart(2,'0')}`)){n++;const it_=ADVENT[k].item;if(it_)pl.owned[it_]=pl.owned[it_]||1;}}if(pl.earnP)pl.earnP.fig_goldreindeer=n;if(n>=24)pl.owned.fig_goldreindeer=1;});}catch(e){console.warn('advent derive',e);}return g;};
// on the Harbour, above the Today card
const _harbX=SCREENS.harbour;SCREENS.harbour=function(){const h=_harbX.apply(this,arguments);const a=adventHtml();if(!a)return h;const k='<div class="card today">';return h.includes(k)?h.replace(k,a+k):h+a;};
HELP.push(['Christmas','From 1 to 26 December the whole game goes Christmassy. The Advent Chest on the Harbour has 24 doors: hitting the crew target opens that day\'s door, weekend doors open on Monday, and every target day also opens one door you missed. Doors hold doubloons, XP, Christmas items and the odd joke; all 24 earns the Golden Reindeer figurehead. The shop sells ten limited Christmas items until Boxing Day (you keep them forever), five Christmas fish swim in every depth, and a Santa Penguin can turn up in December pet sightings.']);
