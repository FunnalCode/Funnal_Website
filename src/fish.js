function isFish(m){return m==='fish'||m==='coop';}
/* ============================== FISHING TRIPS & THE TROPHY CASE ============================== */
const FISH_RAR={common:{w:5500,col:'#9AA3AE'},uncommon:{w:2500,col:'#45B07C'},rare:{w:1200,col:'#3E8DDB'},epic:{w:550,col:'#9B5DE5'},legendary:{w:200,col:'#D99A17'},mythic:{w:45,col:'#E0457B'},transcendent:{w:5,col:'#3F5160'}};
const FISH_NAMES={
 common:['Sardine','Anchovy','Mackerel','Herring','Sprat','Pilchard','Whiting','Pollock','Dab','Plaice','Flounder','Sole','Gurnard','Goby','Blenny','Bream','Mullet','Wrasse','Pouting','Smelt','Rockling','Weever','Sand Eel','Shanny','Dogfish','Garfish','Scad','Bass','Coley','Haddock'],
 uncommon:['Cod','Hake','Ling','John Dory','Red Snapper','Sea Robin','Clownfish','Blue Tang','Butterflyfish','Damselfish','Parrotfish','Triggerfish','Pufferfish','Boxfish','Lionfish','Grouper','Halibut','Turbot','Monkfish','Catshark','Barracuda','Remora','Mahi-Mahi','Pompano','Tarpon'],
 rare:['Angelfish','Moorish Idol','Mandarin Fish','Flying Fish','Sunfish','Swordfish','Bluefin Tuna','Yellowfin Tuna','Sailfish','Wahoo','Moray Eel','Seadragon','Stonefish','Frogfish','Cuttlefish','Electric Ray','Manta Ray','Hammerhead','Lanternfish','Hatchetfish'],
 epic:['Anglerfish','Gulper Eel','Oarfish','Coelacanth','Goblin Shark','Blobfish','Barreleye','Viperfish','Firefly Squid','Glass Octopus','Ghost Shark','Dragonfish'],
 legendary:['Golden Koi','Rainbow Marlin','Crystal Ray','Ember Eel','Storm Salmon','Moonfish','Sunscale Tuna','Kraken Fry'],
 mythic:['Leviathan Hatchling','Phoenix Fin','Siren Carp','Abyssal Pearl-Eater'],
 transcendent:['The Funnal Fish']};
const FISH_SHAPES={common:['oval','long','flat','oval','long'],uncommon:['oval','round','puffer','long','flat','eel'],rare:['sail','ray','shark','eel','round','long'],epic:['angler','eel','shark','round'],legendary:['sail','ray','eel','oval'],mythic:['eel','sail','angler','ray'],transcendent:['mark']};
const FISH=[];Object.entries(FISH_NAMES).forEach(([rar,ns])=>ns.forEach((name,i)=>{const h=h32('fish'+name);const sh=FISH_SHAPES[rar];const hue=h%360;
  FISH.push({id:'f_'+name.toLowerCase().replace(/[^a-z]+/g,'_'),name,rar,i,shape:/eel/i.test(name)?'eel':/ray/i.test(name)?'ray':/shark|dogfish/i.test(name)?'shark':/puffer|blob|box/i.test(name)?'puffer':/angler|monk|frog/i.test(name)?'angler':/sail|marlin|sword/i.test(name)?'sail':/flounder|plaice|sole|dab|halibut|turbot|dory/i.test(name)?'flat':sh[(h>>9)%sh.length],
    c1:rar==='transcendent'?'#17181D':rar==='legendary'?`hsl(${[45,200,15,260,30][i%5]},80%,62%)`:`hsl(${hue},${40+(h>>5)%40}%,${52+(h>>12)%16}%)`,c2:rar==='transcendent'?'#F2C462':`hsl(${(hue+40+(h>>3)%120)%360},${55+(h>>7)%30}%,${70+(h>>14)%14}%)`,pat:['none','stripes','spots','belly','bands'][(h>>16)%5],len:Math.round(8+((h>>4)%60)+['common','uncommon','rare','epic','legendary','mythic','transcendent'].indexOf(rar)*25)});}));
const FISH_BY_ID=Object.fromEntries(FISH.map(f=>[f.id,f]));
const FISH_V1=FISH.slice();
const FISH_TOTAL_W=Object.values(FISH_RAR).reduce((a,b)=>a+b.w,0);
function fishRoll(evId){const h=h32(evId+'fish');if(h%100>=72)return null;let x=h32(evId+'fr')%FISH_TOTAL_W,rar='common';for(const k in FISH_RAR){if(x<FISH_RAR[k].w){rar=k;break;}x-=FISH_RAR[k].w;}const pool=FISH_V1.filter(f=>f.rar===rar);return pool[h32(evId+'fs')%pool.length];}
function fishTrips(p){const me=G?.players[p];if(!me)return[];const t=(me.sessions||[]).filter(x=>x.mode==='fish').map(x=>({s:x.s,e:x.e||x.s+(x.dur||0)}));const lk=S.players[p]?.lock;if(lk&&lk.mode==='fish')t.push({s:lk.s,e:Date.now()+1});return t;}
let _fishMemo={k:'',v:null};
function fishCatches(p){if(!G)return{list:[],by:{}};const trips=fishTrips(p);const k=p+G.evs.length+'|'+trips.map(x=>x.s+'-'+Math.floor(x.e/5000)).join(',');if(_fishMemo[p]&&_fishMemo[p].k===k)return _fishMemo[p].v;
  const list=[];for(const e of G.evs){if(e.pid!==p||e.k!=='d')continue;if(!trips.some(x=>e.t>=x.s&&e.t<=x.e))continue;const f=fishRoll(e.id);if(f)list.push({f,t:e.t,id:e.id});}
  const by={};list.forEach(c=>{by[c.f.id]=(by[c.f.id]||0)+1;});const v={list,by};_fishMemo[p]={k,v};return v;}

function drawFish(c,f,x,y,s,t=0,sil=false){if(!f)return;const C1=sil?'#C9BFA8':f.c1,C2=sil?'#B9AF98':f.c2,ink=sil?'#B0A68F':'#2E2A26';const sw=Math.sin(t/180)*.12;
  c.save();c.translate(x,y);c.scale(s,s);
  if(!sil&&['legendary','mythic','transcendent'].includes(f.rar))glowAt(c,0,0,14,f.rar==='mythic'?'255,150,200':'255,214,110',.5);
  const tail=(tx,ty,w)=>{c.save();c.translate(tx,ty);c.rotate(sw);c.fillStyle=C2;c.beginPath();c.moveTo(0,0);c.lineTo(-w,-w*.75);c.quadraticCurveTo(-w*.6,0,-w,w*.75);c.closePath();c.fill();c.restore();};
  const eye=(ex,ey,r=1)=>{disc(c,ex,ey,r,'#fff');disc(c,ex+.2,ey,r*.6,ink);};
  const body=(rx,ry)=>{ell(c,0,0,rx,ry,C1);if(!sil){c.save();c.beginPath();c.ellipse(0,0,rx,ry,0,0,TAU);c.clip();
    if(f.pat==='stripes')for(let i=-3;i<=3;i++)R(c,i*rx*.32-.6,-ry,1.2,ry*2,'rgba(0,0,0,.14)');
    if(f.pat==='spots')for(let i=0;i<6;i++)disc(c,-rx*.6+((i*37)%10)/10*rx*1.2,-ry*.5+((i*53)%10)/10*ry,ry*.16,C2);
    if(f.pat==='belly')ell(c,0,ry*.55,rx,ry*.6,C2);
    if(f.pat==='bands'){R(c,-rx*.2,-ry,rx*.18,ry*2,C2);R(c,rx*.25,-ry,rx*.14,ry*2,C2);}
    ell(c,-rx*.2,-ry*.45,rx*.6,ry*.25,'rgba(255,255,255,.25)');c.restore();}};
  switch(f.shape){
   case'long':tail(-8,0,4);body(9,3);poly(c,[[-2,-3],[2,-5],[4,-2.6]],C2);eye(5.6,-.6,.9);break;
   case'flat':tail(-7,0,3.5);body(7.5,5);poly(c,[[-6,-3],[0,-6],[6,-3]],C2);eye(4,-1.6,.9);eye(5.4,-.4,.7);break;
   case'round':tail(-6,0,4);body(6.5,5.6);poly(c,[[-2,-5],[1,-8.6],[3,-5]],C2);poly(c,[[-2,5],[1,8],[3,5]],C2);eye(3.4,-1.4,1.2);break;
   case'puffer':for(let i=0;i<14;i++){const a=i/14*TAU;line(c,Math.cos(a)*6,Math.sin(a)*6,Math.cos(a)*8,Math.sin(a)*8,C2,.7);}tail(-6.6,0,3);body(7,6.6);eye(3,-1.8,1.4);disc(c,6.4,1.4,.8,'#E0457B');break;
   case'eel':c.strokeStyle=C1;c.lineWidth=3.4;c.lineCap='round';c.beginPath();for(let i=0;i<=12;i++){const u=i/12;c.lineTo(-10+u*19,Math.sin(u*6+t/200)*2*(1-u*.5));}c.stroke();c.strokeStyle=C2;c.lineWidth=1;c.stroke();disc(c,9,0,2.2,C1);eye(9.6,-.6,.8);break;
   case'ray':c.fillStyle=C1;c.beginPath();c.moveTo(7,0);c.quadraticCurveTo(0,-11+sw*8,-4,-9);c.quadraticCurveTo(-4,0,-4,9);c.quadraticCurveTo(0,11-sw*8,7,0);c.fill();line(c,-4,0,-12,sw*10,C2,.9);if(!sil){ell(c,0,0,3,5,C2);ell(c,-1,0,2,3.4,'rgba(255,255,255,.18)');}eye(4.4,-1.5,.65);eye(4.4,1.5,.65);break;
   case'shark':tail(-9,0,5);c.fillStyle=C1;c.beginPath();c.moveTo(11,1);c.quadraticCurveTo(6,-5,-9,-1);c.quadraticCurveTo(0,5,11,1);c.fill();if(!sil)ell(c,2,2,6,1.6,C2);poly(c,[[-1,-3],[1,-9],[4,-3]],C1);eye(8,-.1,.72);line(c,4.6,-.4,4.3,1.6,ink,.3);break;
   case'sail':tail(-8,0,4);poly(c,[[-6,-2.6],[-3,-11],[5,-2.6]],C2);body(8.6,3.6);line(c,8,0,15,-.6,C1,1);eye(5.4,-.8,.9);break;
   case'angler':tail(-7,0,3.6);body(7,6);c.strokeStyle=C2;c.lineWidth=.6;c.beginPath();c.moveTo(3,-5.6);c.quadraticCurveTo(6,-12,10,-8);c.stroke();disc(c,10,-8,1.4,sil?C2:'#FFF3A0');if(!sil)glowAt(c,10,-8,5,'255,240,150',.8);for(let i=0;i<4;i++)poly(c,[[3.6+i*.9,2],[4+i*.9,3.6],[4.4+i*.9,2]],'#FFFFFF');line(c,3,2,7,2.4,ink,.4);eye(2.6,-2,1.2);break;
   case'squid':{const g=.5+.5*Math.sin(t/260);for(let i=0;i<6;i++){c.strokeStyle=C2;c.lineWidth=.9;c.lineCap='round';c.beginPath();c.moveTo(-3,-1.6+i*.64);c.quadraticCurveTo(-7,-2+i*.8+Math.sin(t/220+i)*1.2,-10.4,-2.6+i*1.1+Math.sin(t/200+i)*1.6);c.stroke();}c.fillStyle=C1;c.beginPath();c.moveTo(-3.6,-2.4);c.quadraticCurveTo(4,-5.4,9.6,0);c.quadraticCurveTo(4,5.4,-3.6,2.4);c.closePath();c.fill();if(!sil){poly(c,[[9.6,0],[6.4,-3.6],[6.8,0]],C2);poly(c,[[9.6,0],[6.4,3.6],[6.8,0]],C2);for(let i=0;i<5;i++)disc(c,-1+i*1.9,-.6+(i%2)*1.2,.45,`rgba(255,255,255,${.25+.35*g})`);}eye(-1.6,-.6,1.05);break;}
   case'mark':tail(-8,0,5);body(9,6.5);if(!sil){drawMark(c,1,0,8.6,'#F2C462');for(let i=0;i<3;i++){const a=t/300+i*2.1;line(c,Math.cos(a)*12-1,Math.sin(a)*8,Math.cos(a)*12+1,Math.sin(a)*8,'#FFF6CF',.6);}}eye(6,-2.4,1);break;
   default:tail(-7,0,4);body(7.6,4.4);poly(c,[[-3,-4],[0,-7.6],[3,-4]],C2);eye(4.4,-1,1);}
  c.restore();}
function drawFishIcon(cv,f,sil){const c=cv.getContext('2d');const k=cv.width/48;c.setTransform(k,0,0,k,0,0);c.clearRect(0,0,48,48);const col=sil?'#E9E1CC':FISH_RAR[f.rar].col;c.save();c.beginPath();c.arc(24,24,23,0,TAU);c.clip();const g=c.createLinearGradient(0,0,0,48);g.addColorStop(0,sil?'#F3EDDD':'#DFF4FA');g.addColorStop(1,sil?'#E7DEC8':'#9FD7F0');c.fillStyle=g;c.fillRect(0,0,48,48);if(!sil)for(let i=0;i<4;i++)disc(c,8+i*9,40-i%2*6,1.2,'rgba(255,255,255,.7)');c.restore();c.strokeStyle=col;c.lineWidth=2.4;c.beginPath();c.arc(24,24,22,0,TAU);c.stroke();drawFish(c,f,24,25,1.45,1200,sil);}
function paintFish(root=document){root.querySelectorAll('canvas.fishIco').forEach(cv=>drawFishIcon(cv,FISH_BY_ID[cv.dataset.f],cv.dataset.s==='1'));}

/* the fishing scene that replaces the monster on a fishing trip */
function drawFishing(c,t,lk){const bx=196+Math.sin(t/1400)*3,by=128+Math.sin(t/500)*1.2;
  c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=.45;c.beginPath();c.moveTo(118,92);c.quadraticCurveTo(160,96,bx,by-2);c.stroke();line(c,108,112,120,90,'#7A4E30',1.1);
  for(let i=0;i<2;i++){const q=((t/1600)+i/2)%1;c.strokeStyle=`rgba(255,255,255,${.7*(1-q)})`;c.lineWidth=.6;c.beginPath();c.ellipse(bx,by+1.4,3+q*8,1+q*2.4,0,0,TAU);c.stroke();}
  disc(c,bx,by,2.4,'#FFFFFF');c.save();c.beginPath();c.rect(bx-3,by-3,6,3);c.clip();disc(c,bx,by,2.4,'#E0453B');c.restore();R(c,bx-.3,by-4.4,.6,2,'#3F3A30');
  hit(bx-8,by-8,16,14,'Fishing trip','Every DM you log is a cast. Most casts land a fish, rarer ones far less often. Your catches go in the Trophy case under More.');
  const lc=S.lastCatch;if(lc){const a=(performance.now()-lc.at)/(S.focus?2600:1800);if(a<1){const x=bx-6+a*10,y=by-Math.sin(Math.min(1,a*1.4)*Math.PI)*46;for(let i=0;i<6;i++){const an=-Math.PI*(i+.5)/6;disc(c,bx+Math.cos(an)*a*14,by+Math.sin(an)*a*10+a*a*10,1.2*(1-a)+.2,'rgba(255,255,255,.9)');}
    c.save();c.translate(x,y);c.rotate(-.6+a*1.4);drawFish(c,lc.f,0,0,S.focus?2.1:1.5,t,false,lc.v||'');c.restore();if(a>.15&&a<.9){c.globalAlpha=Math.min(1,(a-.15)*5,(.9-a)*6);fishTag(c,lc.f.name,x,y-23.5,FISH_RAR[lc.f.rar].col);c.globalAlpha=1;}}}}

/* toast and animation when a new DM on a fishing trip lands a fish */
S.fishSeen=S.fishSeen||null;
function checkCatch(){const lk=S.players[S.me]?.lock;if(!G||!lk||lk.mode!=='fish'){S.fishSeen=null;return;}const fc=fishCatches(S.me);const trip=fc.list.filter(x=>x.t>=lk.s);
  if(S.fishSeen==null){S.fishSeen=trip.length;return;}if(trip.length>S.fishSeen){const last=trip[trip.length-1];const first=(fc.by[last.f.id]||0)===1;S.lastCatch={f:last.f,at:performance.now()};
    toast(`<b>${first?'New species! ':''}${esc(last.f.name)}</b> · <span class="rtag r-${last.f.rar}">${last.f.rar}</span>${first?' Added to your trophy case.':''}`,first&&['epic','legendary','mythic','transcendent'].includes(last.f.rar)?'level':'pet');
    try{(first?SND.chest:SND.splash)();}catch(e){}}S.fishSeen=trip.length;}

/* trophy case */
function trophyHtml(p){const fc=fishCatches(p);const got=Object.keys(fc.by).length;const order=Object.keys(FISH_RAR);
  return `<div class="card trophy"><div class="row between"><h3>Trophy case</h3><span class="pill">${got} / ${FISH.length} fish</span></div><p class="tiny muted" style="margin:4px 0 8px">Go on a fishing trip from Lock In. Every DM you log is a cast. ${fc.list.length?`${fmtN(fc.list.length)} fish landed so far.`:'Nothing landed yet.'}</p>
   ${order.map(r=>{const fs=FISH.filter(f=>f.rar===r);const n=fs.filter(f=>fc.by[f.id]).length;return `<div class="tRow"><small><span class="rtag r-${r}">${r}</span> ${n}/${fs.length}</small><div class="fishGrid">${fs.map(f=>{const k=fc.by[f.id]||0;return `<button class="fishCell ${k?'got':''}" data-act="fishInfo" data-f="${f.id}" aria-label="${k?esc(f.name):'Uncaught fish'}"><canvas class="fishIco" width="96" height="96" data-f="${f.id}" data-s="${k?0:1}"></canvas>${k>1?`<i>×${k}</i>`:''}</button>`;}).join('')}</div></div>`;}).join('')}</div>`;}
Object.assign(ACT,{
  fishInfo(d){const f=FISH_BY_ID[d.f];const fc=fishCatches(S.me);const k=fc.by[f.id]||0;const odds=Math.round(FISH_TOTAL_W/FISH_RAR[f.rar].w*FISH.filter(x=>x.rar===f.rar).length/.72);
    openModal(`<div style="text-align:center"><canvas class="fishIco big" width="240" height="240" data-f="${f.id}" data-s="${k?0:1}"></canvas><h2>${k?esc(f.name):'Unknown fish'}</h2><p><span class="rtag r-${f.rar}">${f.rar}</span></p><p class="muted">${k?`Caught ${k} time${k>1?'s':''}. Biggest so far: ${f.len} cm (allegedly).`:'Not caught yet.'} Roughly 1 in ${fmtN(odds)} casts.</p><button class="btn" data-act="closeModal">Close</button></div>`);paintFish($('#modal'));},
  lockMode(d){S.view.lockMode=d.m;render();}});

/* emissary flag: a different animation for each of the five stages */
function drawEmissary(c,x,y,grade,t){const col=EM_COLS[grade];const len=10+grade*2.4;const amp=.8+grade*.15;
  if(grade>=2){const p=.5+.5*Math.sin(t/(500-grade*60));glowAt(c,x+len/2,y+2.4,6+grade*2.4,grade>=4?'255,214,110':'255,255,255',.18+p*.12*grade);}
  if(grade>=4){c.save();c.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const a=t/900+i/6*TAU;c.strokeStyle=`hsla(${(t/8+i*60)%360},90%,70%,.35)`;c.lineWidth=.5;c.beginPath();c.moveTo(x+len/2,y+2.4);c.lineTo(x+len/2+Math.cos(a)*(10+len*.4),y+2.4+Math.sin(a)*(7+len*.25));c.stroke();}c.restore();}
  const wv=i=>Math.sin(t/(180-grade*12)+i*.8)*amp;
  c.fillStyle=col;c.beginPath();c.moveTo(x,y);for(let i=0;i<=6;i++)c.lineTo(x+i*len/6,y+wv(i)+i*.25);for(let i=6;i>=0;i--)c.lineTo(x+i*len/6,y+4.6-i*.38+wv(i));c.closePath();c.fill();
  if(grade>=2){c.strokeStyle=grade>=3?'#F2C462':'rgba(255,255,255,.6)';c.lineWidth=.35;c.stroke();}
  if(grade>=4){c.save();c.clip();const sx=x+((t/8)%(len+12))-6;c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.moveTo(sx,y-3);c.lineTo(sx+2,y-3);c.lineTo(sx-1,y+8);c.lineTo(sx-3,y+8);c.fill();c.restore();}
  for(let i=0;i<=grade;i++)disc(c,x+1.8+i*2,y+2.2+wv(i)*.6,.6,'#FFFFFF');
  if(grade>=1)for(let i=0;i<grade+1;i++){const q=((t/(1300-grade*150))+i/(grade+1))%1;const sx=x+len+q*10,sy=y+2+Math.sin(q*8+i)*2-q*2;if(grade>=3)disc(c,sx,sy-q*3,.7*(1-q)+.15,`rgba(255,${180+q*60|0},90,${1-q})`);else{line(c,sx-.9*(1-q),sy,sx+.9*(1-q),sy,`rgba(255,246,207,${1-q})`,.35);line(c,sx,sy-.9*(1-q),sx,sy+.9*(1-q),`rgba(255,246,207,${1-q})`,.35);}}
  if(grade>=4){const cy=y-3.6+Math.sin(t/400)*.4;poly(c,[[x+1,cy+2.4],[x+1,cy],[x+2.4,cy+1.2],[x+3.4,cy-.8],[x+4.4,cy+1.2],[x+5.8,cy],[x+5.8,cy+2.4]],'#F2C462');}}

SCREENS.trophy=()=>{const pid=S.view.trophyP||S.me;return `<div class="pad"><div class="row between"><h2>Trophy case</h2><div class="seg mini">${G.P.map(p=>`<button class="${p===pid?'on':''}" data-act="trophyP" data-p="${p}">${pname(p)}</button>`).join('')}</div></div>${trophyHtml(pid)}</div>`;};
ACT.trophyP=d=>{S.view.trophyP=d.p;render();};

/* after the voyage monster sinks: every DM hauls plunder out of the wreck */
function drawPlunder(c,t,lk,dms,vb){const wx=232-((t/40)%40),wy=124;
  // the wreck, slowly going down, with flotsam
  c.save();c.translate(258,120+Math.sin(t/900)*1.2);c.rotate(-.35);R(c,-14,-2,26,6,'#6B4429');R(c,-14,-2,26,1.4,'#8A5A3A');R(c,-2,-18,1.4,16,'#7A4E30');poly(c,[[-1,-17],[8,-12],[-1,-8]],'#3F3A30');c.restore();
  for(let i=0;i<5;i++){const fx=((300-(t/30)-i*44)%340+340)%340-20,fy=130+i%3*6+Math.sin(t/500+i)*1.4;if(i%2)rr(c,fx-3,fy-2,6,3.4,.8,'#A8704A');else{disc(c,fx,fy,1.8,'#F2C462');disc(c,fx-.5,fy-.5,.6,'#FFF3B8');}}
  for(let i=0;i<3;i++){const q=((t/1400)+i/3)%1;c.strokeStyle=`rgba(255,255,255,${.6*(1-q)})`;c.lineWidth=.6;c.beginPath();c.ellipse(258,128,8+q*14,2+q*3,0,0,TAU);c.stroke();}
  const H=S.haul&&S.haul.lk===lk.id?S.haul:null;const n=H?H.n:0;
  txt(c,n?`Monster sunk! Plunder hauled: ${n} · chest ${dms*3}`:'Monster sunk! Keep logging DMs to haul plunder from the wreck',160,16,'#3F5160',7,'center');
  hit(236,100,44,34,'The wreck',`${vb.name||'The monster'} is sunk. Every DM you log now hauls treasure out of the wreck into your chest (3 doubloons each, banked when you reach Treasure Island), and your emissary flag still multiplies your DMs.`);
  if(H){const a=(performance.now()-H.at)/900;if(a<1){for(let i=0;i<7;i++){const q=Math.min(1,a*1.2+i*.04);const x=250-q*150,y=118-Math.sin(q*Math.PI)*(34+i*3)+q*12;disc(c,x,y,1.6,'#F2C462');disc(c,x-.4,y-.4,.6,'#FFF3B8');}
    lamp(c,250,120,14*(1-a),.6*(1-a),'255,214,110');c.globalAlpha=1-a;txt(c,'+3',112,96-a*12,'#C07E0C',9,'center');c.globalAlpha=1;
    if(a<.4)for(let i=0;i<8;i++){const an=-Math.PI*(i+.5)/8;disc(c,252+Math.cos(an)*a*30,124+Math.sin(an)*a*20,1.1,'rgba(255,255,255,.9)');}}}}

function fishTag(c,s,x,cy,col){c.save();const art=typeof isArtLook==='function'&&isArtLook();c.font=art?'600 7.2px Fredoka, Nunito, sans-serif':'7px "Pixelify Sans", monospace';c.textAlign='center';c.textBaseline='middle';const w=Math.max(40,c.measureText(s).width+12);rr(c,x-w/2,cy-6.5,w,13,6,'rgba(255,252,244,.95)');c.fillStyle=col;c.fillText(s,x,cy+.4);c.restore();}
