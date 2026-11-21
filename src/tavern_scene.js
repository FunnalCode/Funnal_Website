/* ============================== THE RUSTY ANCHOR: THE ROOM AND THE SCREEN (Stage 5) ============================== */
const TVW=320,TVH=180;let TVHITS=[];
const tvHit=(x,y,w,h,act,title)=>TVHITS.push({x,y,w,h,act,title});
function tvPhase(){try{return skyPhase();}catch(e){return 'day';}}
function drawBill(c,x,y,t){const w=Math.sin(t/380);const xm=xmasNowSafe();
  rr(c,x-11,y+14,22,26,6,'#3C5A8C');for(let i=0;i<5;i++)R(c,x-11+i*4.6,y+14,1.4,26,'rgba(255,255,255,.12)');rr(c,x-8,y+20,16,20,3,'#F2EEE4');R(c,x-8,y+19.4,16,1.4,'#D9D2C2');
  c.strokeStyle='#E8B43A';c.lineWidth=.6;c.beginPath();c.moveTo(x-4,y+13);c.quadraticCurveTo(x,y+20,x+4,y+13);c.stroke();disc(c,x,y+20.4,2.2,'#E8B43A');disc(c,x-.5,y+19.9,.8,'#FFF0B0');
  rr(c,x-3,y+10,6,5,1.5,'#E2A982');ell(c,x,y+3,8.4,9,'#E8B48E');ell(c,x-8.2,y+4,1.6,2.4,'#E2A982');ell(c,x+8.2,y+4,1.6,2.4,'#E2A982');
  ell(c,x-6.4,y+7.4,2.6,4.4,'#A8A29A');ell(c,x+6.4,y+7.4,2.6,4.4,'#A8A29A');ell(c,x,y+9.6,4.6,1.6,'#A8A29A');disc(c,x,y+6.4,2.1,'#D9786A');
  const bl=(Math.sin(t/1900)>.97)?.2:1.3;ell(c,x-3.2,y+2.4,1.1,bl,'#2A2730');ell(c,x+3.2,y+2.4,1.1,bl,'#2A2730');line(c,x-5,y-.6,x-1.6,y-.2,'#8A847C',.8);line(c,x+1.6,y-.2,x+5,y-.6,'#8A847C',.8);
  R(c,x-2,y+11.2,4,.8,'#8A4A3A');ell(c,x-2,y-4.4,3.4,1.2,'rgba(255,255,255,.35)');
  if(xm){poly(c,[[x-8,y-4],[x-5,y-9],[x-2,y-5],[x+1,y-10],[x+4,y-5],[x+7,y-9],[x+8.4,y-4]],'#E0453B');R(c,x-8.2,y-4.6,16.6,1.6,'#F2C462');}
  const gx=x+10+w*2.2,gy=y+22+Math.cos(t/380)*1.6;rr(c,gx-2.4,gy-4,4.8,6,1.4,'rgba(220,240,255,.7)');ell(c,gx+3.2,gy,3,2.4,'#F2EEE4');ell(c,x+9,y+18,3,2.4,'#3C5A8C');}
function drawFire(c,t,lv){const cx=50,by=146;const sp=THEME.reduced?.35:1;
  rr(c,30,141,40,5,2,'#4A2E1C');rr(c,34,138,32,4,2,'#5C3A22');const h=10+38*Math.min(1.15,lv);
  for(let k=0;k<3;k++){const col=['#E0453B','#F2A33A','#FFE7A0'][k];const s=1-k*.28;c.fillStyle=col;c.beginPath();c.moveTo(cx-18*s,by-4);
    for(let i=0;i<=8;i++){const u=i/8;const x=cx-18*s+36*s*u;const fl=Math.sin(t*sp/(120+i*17)+i*1.7)*.5+.5;const y=by-4-(h*s)*(.35+.65*Math.sin(u*Math.PI))*(.75+.35*fl);c.lineTo(x,y);}c.lineTo(cx+18*s,by-4);c.closePath();c.fill();}
  for(let i=0;i<Math.round(6+10*lv);i++){const p=((t*sp/1800)+i*.137)%1;const x=cx-14+((i*37)%28)+Math.sin(t/400+i)*3,y=by-8-p*(50+30*lv);disc(c,x,y,.7*(1-p)+.2,`rgba(255,${180+((i*13)%60)},90,${1-p})`);}}
function drawCat(c,x,y,t){const br=Math.sin(t/900)*.4;ell(c,x,y-2.6-br*.3,8,4.4+br*.3,'#E89A4A');disc(c,x+7,y-4,3.4,'#E89A4A');poly(c,[[x+5,y-6.4],[x+6,y-9.4],[x+7.6,y-6.8]],'#E89A4A');poly(c,[[x+8,y-6.8],[x+9.6,y-9],[x+10,y-6]],'#E89A4A');
  line(c,x+5.6,y-4,x+7,y-4.2,'#7A4A2A',.4);line(c,x+8,y-4.2,x+9.4,y-4,'#7A4A2A',.4);[[-4,0],[-1,0],[2,0]].forEach(([a])=>line(c,x+a,y-5.6,x+a+1,y-1.6,'#C97A34',.6));c.strokeStyle='#E89A4A';c.lineWidth=1.6;c.beginPath();c.moveTo(x-7,y-1);c.quadraticCurveTo(x-11,y+1,x-8,y+2);c.stroke();
  if(Math.sin(t/2200)>.6){c.globalAlpha=.6;txt(c,'z',x+12,y-10-(t/400%4),'#FFFFFF',4,'center');c.globalAlpha=1;}}
function drawJukebox(c,x,y,t,on){rr(c,x,y,24,48,10,'#7A3E22');rr(c,x+2,y+2,20,44,9,'#A85A2E');rr(c,x+5,y+8,14,12,6,'#2A1C14');
  for(let i=0;i<5;i++){const hue=on?(t/8+i*60)%360:30;c.fillStyle=on?`hsla(${hue},85%,62%,.9)`:'rgba(255,200,120,.35)';c.fillRect(x+4+i*3.4,y+24,2.2,16);}rr(c,x+6,y+42,12,3,1,'#2A1C14');
  if(on){for(let i=0;i<2;i++){const p=((t/1400)+i*.5)%1;txt(c,'♪',x+12+Math.sin(p*6+i)*6,y-2-p*16,`rgba(255,240,200,${1-p})`,6,'center');}}}
function drawDartboard(c,x,y){disc(c,x,y,10,'#1E1A16');for(let i=0;i<10;i++){c.fillStyle=i%2?'#F2E6C8':'#22201C';c.beginPath();c.moveTo(x,y);c.arc(x,y,8.6,i*Math.PI/5,(i+1)*Math.PI/5);c.fill();}disc(c,x,y,1.8,'#C8102E');
  c.save();c.translate(x+3,y-2);c.rotate(-.6);R(c,0,-.3,6,.6,'#C9CDD4');poly(c,[[6,-1.2],[8,0],[6,1.2]],'#2F8F4E');c.restore();}
function drawStocking(c,x,y,fill_,col){const f=Math.min(1,fill_/18);rr(c,x-3,y,6,12,1.4,col);ell(c,x+1,y+12,4.6,2.6,col);rr(c,x-3.6,y-1,7.2,3,1.2,'#FFFFFF');
  for(let i=0;i<Math.round(f*4);i++)disc(c,x-1.6+i*1.2,y-1.6-((i%2)*1.2),1,['#F2C462','#2F8F4E','#C8102E','#4A9BE0'][i%4]);}
function drawTreeSmall(c,x,y,t){rr(c,x-2,y-6,4,6,1,'#6B4630');for(let k=0;k<3;k++){poly(c,[[x-12+k*3,y-6-k*9],[x,y-24-k*8],[x+12-k*3,y-6-k*9]],'#2F7A52');}
  for(let i=0;i<9;i++){const on=Math.sin(t/300+i*1.9)>-.2;disc(c,x-8+((i*7)%16),y-9-((i*5)%24),.9,on?['#E0453B','#F2C462','#4A9BE0'][i%3]:'rgba(255,255,255,.3)');}poly(c,[[x,y-39],[x+1.4,y-35.6],[x-1.4,y-35.6]],'#F2C462');}
function tvTrophyMount(c,x,y){const pl=G.players[S.me];const lt=(pl.legendTrophies||[]);if(!lt.length){rr(c,x-14,y-10,28,18,1.5,'#8A6A40');rr(c,x-12,y-8,24,14,1,'#BFD8E8');poly(c,[[x-8,y+2],[x-2,y-5],[x+4,y+2]],'#FFFFFF');rr(c,x-9,y+2,14,2.4,1,'#7A4E30');return;}
  const L_=LEGENDS.find(l=>l.id===lt[lt.length-1]);rr(c,x-12,y-2,24,14,3,'#5C3A22');const b=L_;try{if(b)drawBoss(c,b,x,y-2,9,.2,1000,false,null);else disc(c,x,y-2,7,'#5A3A6E');}catch(e){disc(c,x,y-2,7,'#5A3A6E');}}
function drawTavern(cv,t){const c=cv.getContext('2d');const s=cv.width/TVW;c.setTransform(s,0,0,s,0,0);TVHITS=[];const ph=tvPhase();const night=ph==='night'||ph==='dusk';const xm=xmasNowSafe();const winter=THEME.season==='winter';
  const lv=fireLevel();const both=peerIn();const me=S.me,o=other(S.me);
  // walls, beams, floor
  const g=c.createLinearGradient(0,0,0,150);g.addColorStop(0,'#4A2E1E');g.addColorStop(1,'#6A4430');c.fillStyle=g;c.fillRect(0,0,TVW,150);for(let x=0;x<TVW;x+=18){R(c,x,12,1,98,'rgba(0,0,0,.12)');}
  R(c,0,108,TVW,42,'#3E2618');R(c,0,107,TVW,2.4,'#7A4E30');for(let x=6;x<TVW;x+=22){rr(c,x,113,16,31,2,'rgba(0,0,0,.14)');}
  c.fillStyle='#6B4630';c.fillRect(0,150,TVW,50);for(let i=0;i<9;i++)R(c,0,150+i*6,TVW,.6,'rgba(0,0,0,.18)');for(let i=0;i<14;i++)R(c,(i*41+((i%2)*20))%TVW,150+(i%8)*6,.6,6,'rgba(0,0,0,.15)');
  ell(c,58,164,46,9,'#8A2E2A');ell(c,58,164,40,7,'#B2493A');ell(c,58,164,30,5,'#8A2E2A');for(let i=0;i<9;i++)disc(c,22+i*9,164,.9,'#E8B43A');ell(c,113,178,10,1.6,'#3A2416');R(c,111,166,4,12,'#4A2E1C');rr(c,98,162,30,4,1.5,'#5C3A22');rr(c,102,156,5,6,1.2,'rgba(240,200,120,.9)');rr(c,118,157,1.6,4,.6,'#F4EFE4');ell(c,118.8,156,.6,1.2,'#FFD27A');tvHit(96,150,34,28,'table','Table');R(c,0,0,TVW,10,'#2E1C12');[40,150,260].forEach(x=>{R(c,x-4,0,8,14,'#2E1C12');});R(c,0,10,TVW,2,'rgba(0,0,0,.3)');
  // window with rain or snow, steamed up
  const wx=108,wy=28,ww=42,wh=56;rr(c,wx-3,wy-3,ww+6,wh+6,2,'#3A2416');const sky=ph==='night'?['#141A33','#2A3260']:ph==='dusk'?['#3A3A6E','#C07A6A']:ph==='dawn'?['#7A8AC0','#F2C49A']:['#8FBFDC','#CFE6F2'];
  const sg=c.createLinearGradient(0,wy,0,wy+wh);sg.addColorStop(0,sky[0]);sg.addColorStop(1,sky[1]);c.fillStyle=sg;c.fillRect(wx,wy,ww,wh);
  c.save();c.beginPath();c.rect(wx,wy,ww,wh);c.clip();if(ph==='night')for(let i=0;i<10;i++)disc(c,wx+(i*13.7)%ww,wy+(i*7.3)%(wh*.6),.5,'rgba(255,255,255,.8)');
  const storm=THEME.weather==='storm';const n=storm?40:winter?22:16;for(let i=0;i<n;i++){const p=((t/(winter&&!storm?2600:700))+i*.137)%1;const x=wx+((i*29.3)%ww)+(winter&&!storm?Math.sin(t/500+i)*2:0),y=wy+p*wh;if(winter&&!storm)disc(c,x,y,.8,'rgba(255,255,255,.85)');else line(c,x,y,x-1.2,y+4,'rgba(200,220,255,.55)',.4);}
  const st=c.createLinearGradient(0,wy+wh*.5,0,wy+wh);st.addColorStop(0,'rgba(255,255,255,0)');st.addColorStop(1,'rgba(255,255,255,.28)');c.fillStyle=st;c.fillRect(wx,wy,ww,wh);c.restore();
  R(c,wx+ww/2-1,wy,2,wh,'#3A2416');R(c,wx,wy+wh/2-1,ww,2,'#3A2416');R(c,wx-5,wy+wh+2,ww+10,3,'#5C3A22');if(xm||winter){ell(c,wx+ww/2,wy+wh+2,ww/2+4,1.6,'#FFFFFF');}
  // fireplace and mantel
  rr(c,8,18,86,132,3,'#7A6E66');for(let r=0;r<11;r++)for(let k=0;k<5;k++){const bx=10+k*17+(r%2?8:0),by=20+r*12;if(bx<90)rr(c,bx,by,15,10,2,r%3===k%3?'#857870':'#6E625A');}
  c.fillStyle='#1A1210';c.beginPath();c.moveTo(24,148);c.lineTo(24,108);c.quadraticCurveTo(50,86,76,108);c.lineTo(76,148);c.closePath();c.fill();drawFire(c,t,lv);
  R(c,4,80,94,6,'#5C3A22');R(c,4,85.6,94,1.4,'rgba(0,0,0,.3)');tvTrophyMount(c,50,62);
  [[14,76],[86,76]].forEach(([x,y])=>{rr(c,x-1.6,y-6,3.2,6,1,'#F4EFE4');const f=Math.sin(t/180+x)*.4;ell(c,x,y-7.6+f*.2,.9,1.8,'#FFD27A');});
  if(xm){for(let i=0;i<10;i++){const x=6+i*9.2;c.fillStyle='#2F7A52';c.beginPath();c.arc(x+4.6,86,4.8,0,Math.PI);c.fill();const on=Math.sin(t/260+i*1.3)>-.3;disc(c,x+4.6,90,.9,on?['#E0453B','#F2C462','#4A9BE0','#3FA34D'][i%4]:'rgba(255,255,255,.3)');}
    const sm=stockingState(me),so=stockingState(o);drawStocking(c,32,92,sm.n,pcolHex(me));drawStocking(c,68,92,so.n,pcolHex(o));tvHit(26,88,48,20,'stocking','Stockings');
    drawTreeSmall(c,166,150,t);rr(c,152,34,6,1,.3,'#8A6A40');poly(c,[[150,40],[156,32],[160,40]],'#C8102E');R(c,149.6,39.4,11,1.6,'#FFFFFF');disc(c,156,31.6,1,'#FFFFFF');}
  else if(winter){[[26,79],[74,79]].forEach(([x,y])=>{ell(c,x,y,2.2,1.4,'#7A5A3A');ell(c,x+3,y,1.8,1.2,'#7A5A3A');});}
  tvHit(24,96,52,52,'fire','The fire');
  // dartboard, jukebox, barrel and cat
  drawDartboard(c,174,58);tvHit(162,46,24,24,'darts','Darts');
  drawJukebox(c,124,102,t,!!JUKE.on);tvHit(122,100,28,50,'juke','Jukebox');
  rr(c,94,128,22,22,5,'#7A4E30');R(c,94,133,22,1.4,'#4A2E1C');R(c,94,144,22,1.4,'#4A2E1C');drawCat(c,104,129,t);tvHit(92,116,26,34,'cat','Admiral');
  // the bar: shelves, Bill, counter
  rr(c,188,26,96,6,1,'#5C3A22');rr(c,188,50,96,6,1,'#5C3A22');rr(c,188,74,96,6,1,'#5C3A22');
  for(let r=0;r<3;r++)for(let i=0;i<9;i++){const x=192+i*10.4,y=26+r*24;const col=['#2F7A52','#7A3E22','#C9A24A','#4A6A9A','#8A2E3A'][(i+r*2)%5];rr(c,x,y-12,5,12,1.6,col);R(c,x+1.6,y-15,1.8,4,col);R(c,x+.8,y-9,3.4,3,'rgba(255,255,255,.5)');}
  rr(c,288,24,28,46,2,'#3A2416');rr(c,290,26,24,42,1.5,'#C9B48A');txt(c,'THE WALL',302,32,'#3A2416',3.6,'center');wallNames().slice(0,6).forEach((x,i)=>txt(c,`${pnameRaw(x.p)} ${x.date.slice(8)}/${x.date.slice(5,7)}`,302,38+i*5,'#3A2416',3.2,'center'));
  drawBill(c,262,74,t);tvHit(246,60,32,50,'bill','Barnacle Bill');
  rr(c,176,116,148,6,2,'#8A5A3A');R(c,176,121,148,29,'#5C3A22');for(let x=180;x<320;x+=20)rr(c,x,124,16,22,2,'rgba(0,0,0,.15)');R(c,176,148,148,2,'#3A2416');
  [[192,116],[300,116]].forEach(([x,y])=>{rr(c,x-1.4,y-5,2.8,5,.8,'#F4EFE4');ell(c,x,y-6.4+Math.sin(t/160+x)*.15,.8,1.6,'#FFD27A');});
  if(xm){ell(c,282,115,7,1.6,'#F4EFE4');[[278,113],[282,112.4],[286,113]].forEach(([x,y])=>{ell(c,x,y,2,1.4,'#C98A4A');disc(c,x,y-.6,.6,'#F4EFE4');});}
  // captains at the bar
  const seat=(x,p,pres)=>{R(c,x+3,150,2,-18+18,'#3A2416');rr(c,x-2,128,14,3,1.4,'#7A4E30');R(c,x+1,131,2,19,'#4A2E1C');R(c,x+9,131,2,19,'#4A2E1C');
    if(pres){const pl=S.players[p]||{};c.save();c.translate(x-8,86);c.scale(3.5,3.5);try{drawKeeper(c,0,0,p,pl,t,{});}catch(e){}c.restore();const cl=TVP.clinkT&&performance.now()-TVP.clinkT<1600;
      const mx=x+(p===me?18:-8),my=cl?104-Math.sin(Math.min(1,(performance.now()-TVP.clinkT)/400)*Math.PI/2)*14:116;rr(c,mx,my,6,8,1.4,'rgba(240,200,120,.9)');ell(c,mx+3,my,3.2,1.2,'#FFFFFF');}
    else{rr(c,x-4,108,20,10,1.5,'#C9B48A');txt(c,'GONE',x+6,112,'#3A2416',3.4,'center');txt(c,'FISHING',x+6,116,'#3A2416',3.4,'center');line(c,x+1,108,x+6,103,'#3A2416',.4);line(c,x+11,108,x+6,103,'#3A2416',.4);}
    txt(c,pnameRaw(p),x+6,158,pcolHex(p),5,'center');};
  seat(198,me,true);seat(232,o,both);
  if(TVP.clinkT&&performance.now()-TVP.clinkT<1600){const u=(performance.now()-TVP.clinkT)/1600;c.globalAlpha=1-u;txt(c,'Cheers!',222,90-u*10,'#FFE7A0',8,'center');for(let i=0;i<6;i++)disc(c,222+Math.cos(i)*10*u*2,100+Math.sin(i*2)*6*u*2,1,'#FFE7A0');c.globalAlpha=1;}
  // light: lamps, fire glow, night
  if(night){c.fillStyle='rgba(12,8,24,.3)';c.fillRect(0,0,TVW,TVH);}
  c.save();c.globalCompositeOperation='lighter';const fg=c.createRadialGradient(50,130,4,50,130,70+50*lv);fg.addColorStop(0,`rgba(255,140,60,${.28+.12*Math.sin(t/140)*.5})`);fg.addColorStop(1,'rgba(255,140,60,0)');c.fillStyle=fg;c.fillRect(0,40,200,160);
  [[150,22],[230,22]].forEach(([x,y])=>{const lg=c.createRadialGradient(x,y+8,1,x,y+8,46);lg.addColorStop(0,'rgba(255,210,140,.22)');lg.addColorStop(1,'rgba(255,210,140,0)');c.fillStyle=lg;c.fillRect(x-50,y-40,100,100);});c.restore();
  [[150,12],[230,12]].forEach(([x,y])=>{line(c,x,10,x,y+6,'#2E1C12',.6);rr(c,x-4,y+6,8,6,2,'#3A2416');rr(c,x-2.6,y+7,5.2,4,1.4,'#FFD98A');});
  if(TVS.logBoost>0)TVS.logBoost=Math.max(0,TVS.logBoost-.004);}
function tvLoop(){if(S.screen!=='tavern'){TVS.raf=0;return;}const cv=document.getElementById('tvCv');if(cv){try{drawTavern(cv,performance.now());}catch(e){console.warn('tavern draw',e);}}TVS.raf=requestAnimationFrame(tvLoop);}
document.addEventListener('click',ev=>{const cv=ev.target.closest&&ev.target.closest('#tvCv');if(!cv)return;const r=cv.getBoundingClientRect();const x=(ev.clientX-r.left)/r.width*TVW,y=(ev.clientY-r.top)/r.height*TVH;
  for(let i=TVHITS.length-1;i>=0;i--){const h=TVHITS[i];if(x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h){tvTap(h.act);return;}}});
function tvTap(a){const T=TV();if(a==='fire'){TVS.logBoost=Math.min(.5,(TVS.logBoost||0)+.25);SND.pop();if(Math.random()<.5)tvSetLine(tvSay(T.fire),'');}
  else if(a==='cat'){tvSetLine(tvSay(T.cat),'');}else if(a==='table'){tvSetLine(tvSay(T.alone),'');}else if(a==='bill'){tvSetLine(tvNextLine(),'');TVS.next=Date.now()+20000;}else if(a==='darts')ACT.tvDarts();
  else if(a==='juke'){document.querySelector('.jukeCard')?.scrollIntoView({behavior:'smooth',block:'center'});}else if(a==='stocking'){document.querySelector('.stockCard')?.scrollIntoView({behavior:'smooth',block:'center'});}}
ACT.tvTalk=()=>tvTap('bill');
ACT.tvCheers=()=>{tvClinkFx(S.me);try{TVP.ch&&TVP.ch.send({type:'broadcast',event:'clink',payload:{from:S.me}});}catch(e){}};
function tvClinkFx(from){TVP.clinkT=performance.now();TVP.clinkBy=from;try{const ac=getAC();const t0=ac.currentTime;[2600,3400,2900].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t0+i*.05);g.gain.exponentialRampToValueAtTime(S.sound?.05:.0001,t0+i*.05+.01);g.gain.exponentialRampToValueAtTime(.0001,t0+i*.05+.5);o.connect(g);g.connect(ac.destination);o.start(t0+i*.05);o.stop(t0+i*.05+.55);});}catch(e){}
  if(from&&from!==S.me)toast(`<b>${esc(pnameRaw(from))} raises a glass to you.</b> Cheers!`);}

/* ---------- the screen ---------- */
SCREENS.tavern=()=>{const me=G.players[S.me];const open=tvOpenNow();const ask=askToday();const both=peerIn();const T=TV();const b=activeBoost(S.me);const pb=paybacks();const stk=xmasNowSafe()||G.today.slice(5,7)==='12'?stockingState(S.me):null;
  const staked=tvStakedToday();const st=S.tvStake||25;
  return `<div class="pad tavernPad"><div class="tvScene"><canvas id="tvCv" width="960" height="540"></canvas>${open?'':'<div class="tvShut">Closed. Bill is still here.</div>'}</div>
   <div class="billSay ${TVS.kind==='whisper'?'whisper':''}"><span class="name">Barnacle Bill</span><p>${esc(TVS.line||'...')}</p><button class="btn sm ghost" data-act="tvTalk">Chat</button></div>
   ${ask?`<div class="card tvAsk"><small>Bill leans over the bar</small><p>"${esc(ask)}"</p><div class="row"><button class="btn sm" data-act="tvLend" data-n="20">Lend him 20</button><button class="btn sm" data-act="tvLend" data-n="50">Lend him 50</button><button class="btn sm ghost" data-act="tvLend" data-n="0">Absolutely not</button></div></div>`:''}
   ${both?`<div class="card tvBoth"><b>${esc(pnameRaw(other(S.me)))} is in the Tavern.</b><button class="btn sm primary" data-act="tvCheers">Cheers!</button></div>`:''}
   ${pb.map(x=>`<div class="card tvPay"><small>Bill's loyalty ledger</small><p>You've lent Bill money ${x.k*5} times. He wants to "pay you back".</p><button class="btn sm primary" data-act="tvPayback" data-key="${x.key}">${x.item?`Take ${esc(ALL_ITEMS[x.item].name)}`:`Take ${x.g} doubloons`}</button></div>`).join('')}
   ${stk?`<div class="card stockCard"><h3>Your Christmas stocking</h3><p class="tiny">${stk.n} target day${stk.n===1?'':'s'} in it so far (1 to 24 December). It opens on ${shortDate(stk.open)}: 20 doubloons and 30 XP per day.</p>${stk.done?'<span class="okTag">Opened</span>':`<button class="btn sm ${stk.can?'primary':''}" data-act="tvStocking" ${stk.can?'':'disabled'}>${stk.can?`Open it: +${stk.g} ${CN}, +${stk.xp} XP`:'Not yet'}</button>`}</div>`:''}
   <div class="card"><h3>Drinks</h3>${b?`<p class="tiny okLine">${esc(boostText(b))}</p>`:''}<div class="list">${DRINKS.filter(d=>!d.xmas||xmasNowSafe()).map(d=>`<div class="li"><span class="grow"><b>${esc(d.name)}</b><br><small>${esc(d.desc)}</small></span><button class="btn sm" data-act="tvDrink" data-id="${d.id}" ${!open||me.balance<d.price?'disabled':''}>${d.price?`${fmtN(d.price)} ${CN}`:'Free'}</button></div>`).join('')}</div>${open?'':'<p class="tiny muted">Drinks are served 8am to 11pm on working days.</p>'}</div>
   <div class="card"><h3>Games</h3><p class="tiny muted">Doubloons only. You can stake up to 500 a day across all games (${staked} so far today).</p>
    <div class="row stakeRow"><span class="tiny">Stake</span>${[10,25,50,100].map(v=>`<button class="chip ${st===v?'on':''}" data-act="tvStake" data-v="${v}">${v}</button>`).join('')}</div>
    <div class="list"><div class="li"><span class="grow"><b>21</b><br><small>Blackjack against Bill. Dealer stands on 17. Blackjack pays 3 to 2.</small></span><button class="btn sm" data-act="bjStart" ${open?'':'disabled'}>Play</button></div>
     <div class="li"><span class="grow"><b>Liar's Dice</b><br><small>Against Gary, who bluffs a lot and cheats badly.</small></span><button class="btn sm" data-act="ldStart" ${open?'':'disabled'}>Play</button></div>
     <div class="li"><span class="grow"><b>Pirate Poker</b><br><small>Five-card draw against Old Pete and One-Eyed Sal. Winner takes the pot.</small></span><button class="btn sm" data-act="pkStart" ${open?'':'disabled'}>Play</button></div>
     <div class="li"><span class="grow"><b>Darts</b><br><small>One free throw a day. Bullseye 50, outer ring 10.</small></span><button class="btn sm" data-act="tvDarts" ${open&&!me.claimed.has('tv_dart_'+G.today)?'':'disabled'}>${me.claimed.has('tv_dart_'+G.today)?'Thrown':'Throw'}</button></div></div></div>
   ${jukeboxHtml()}
   <div class="card"><h3>The wall</h3><p class="tiny muted">Everyone who bought the Captain's Special.</p>${wallNames().length?`<div class="list">${wallNames().slice(0,8).map(x=>`<div class="li"><span class="grow">${pname(x.p)}</span><small>${shortDate(x.date)}</small></div>`).join('')}</div>`:'<p class="tiny">Empty. Bill has left a nail ready.</p>'}</div></div>`;};
ACT.tvStake=d=>{S.tvStake=+d.v;render();};
function tvStakedToday(){return tvSpends(S.me).filter(x=>x.item==='tv_bet'&&x.date===G.today).reduce((a,x)=>a+(x.cost||0),0);}
{let was=false;const _rdTV=render;render=function(){_rdTV.apply(this,arguments);try{const on=S.screen==='tavern';if(on&&!was){tvJoin();tvEnter();}
  if(!on&&was){tvLeave();if(Math.random()<.35&&tvOpenNow())toast('<b>Bill:</b> '+esc(tvSay(TV().leaving)),'joke');}was=on;if(on&&!TVS.raf)TVS.raf=requestAnimationFrame(tvLoop);
  const b=document.querySelector('.billSay p');if(on&&b&&TVS.line&&b.textContent!==TVS.line)b.textContent=TVS.line;}catch(e){console.warn('tavern',e);}};}

/* ---------- getting in: a tile in More and a pub on the Harbour ---------- */
APP_ICONS.tavern=['#B4683A','M5 5h11v3h2a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-2v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zm11 5v5h2a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM8 8v9h2V8zm4 0v9h2V8z'];
{const _moreTV=SCREENS.more;SCREENS.more=function(){const h=_moreTV.apply(this,arguments);const tile=`<a href="#tavern"><span class="appIco" style="background:${APP_ICONS.tavern[0]}"><svg viewBox="0 0 24 24"><path d="${APP_ICONS.tavern[1]}"/></svg></span>Tavern<small>${tvOpenNow()?'Open till 11pm':'Closed, Bill is in'}</small></a>`;const k='<a href="#herald">';return h.includes(k)?h.replace(k,tile+k):h;};}
addLayer('world','tavernPub',(c,t)=>{const x=200,y=112;rr(c,x-8,y-14,17,14,1.5,'#8A5A3A');poly(c,[[x-10,y-13],[x+.5,y-21],[x+11,y-13]],'#5C3A22');rr(c,x-2,y-7,5,7,1.2,'#3A2416');
  const lit=tvOpenNow();rr(c,x-6.4,y-11,3.6,3.4,.6,lit?'#FFD98A':'#6A5A4A');rr(c,x+4,y-11,3.6,3.4,.6,lit?'#FFD98A':'#6A5A4A');if(lit&&isNight())lamp(c,x,y-9,10,.45,'255,200,120');
  R(c,x+10,y-16,.7,7,'#3A2416');rr(c,x+10.6,y-15.6,6,4,.6,'#C9B48A');disc(c,x+13.6,y-13.6,1,'#7A3E22');if(xmasNowSafe())ell(c,x+.5,y-20.6,7,1.2,'#FFFFFF');
  hit(x-11,y-22,30,22,'The Rusty Anchor',`Barnacle Bill's tavern. ${tvOpenNow()?'Open until 11pm.':'Closed, but Bill is in.'} Drinks, games and gossip. Tap to go in.`,{go:'tavern'});},{scenes:['harbour'],z:3});
HELP.push(['The Rusty Anchor','The Tavern (More, or tap the pub by the jetty) is open 8am to 11pm on working days. Barnacle Bill gossips from the real numbers and may ask to borrow money once a day (every 5 loans he pays you back with something better). Drinks give small boosts, the games use doubloons with a 500-a-day stake cap, darts is one free throw a day, and the jukebox unlocks shanties. If the other captain has the Tavern open you\'ll see them at the bar and can raise a glass.']);
