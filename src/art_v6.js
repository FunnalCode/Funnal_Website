/* ============================== ART v6: atmosphere, living ships, living sea foes ============================== */
let SKY_TOP='#3FA4E4',SEA_BOT='#2F97C4',SUN={x:58,y:30,night:false,col:'255,250,210',mode:'day'};
function wind(t){return .65+.3*Math.sin(t/2300)+.2*Math.sin(t/710+1.3);}
const VIEW_EXT={top:0,bot:0,side:0};
// real London sunrise and sunset for the date, so the harbour sky follows the seasons (dark by 5pm in winter, light past 9pm in June)
const SUNT={};function sunTimes(ts=Date.now()){const l=L(ts);if(SUNT[l.date])return SUNT[l.date];const d=new Date(l.date+'T12:00:00Z');const doy=Math.round((d-Date.UTC(d.getUTCFullYear(),0,0))/864e5);
  const dec=-23.44*Math.cos(TAU*(doy+10)/365)*Math.PI/180,lat=51.5*Math.PI/180;const cw=(Math.sin(-.833*Math.PI/180)-Math.sin(lat)*Math.sin(dec))/(Math.cos(lat)*Math.cos(dec));const half=Math.acos(Math.max(-1,Math.min(1,cw)))*180/Math.PI*4;
  const B=TAU*(doy-81)/364,eot=9.87*Math.sin(2*B)-7.53*Math.cos(B)-1.5*Math.sin(B);const utcMin=new Date(ts).getUTCHours()*60+new Date(ts).getUTCMinutes();const off=((l.min-utcMin)%1440+1440)%1440>=60?60:0;const noon=720-eot+.5+off;
  return SUNT[l.date]={rise:noon-half,set:noon+half};}
function skyPhase(){const m=L().min,s=sunTimes();return m<s.rise-35||m>=s.set+40?'night':m<s.rise+55?'dawn':m<s.set-55?'day':'sunset';}
function skyMode(){return skyPhase()==='night'?'dusk':'day';}
function cloud(c,x,y,s,col,sh){c.save();c.translate(x,y);c.scale(s,s);ell(c,10,3.6,13,3,sh);disc(c,0,0,5.5,col);disc(c,7,-3.4,7,col);disc(c,15,-.8,6,col);disc(c,21,1,4,col);rr(c,-2,0,24,5,2.5,col);disc(c,5.4,-5.2,2.6,'rgba(255,255,255,.35)');c.restore();}
function sky(c,t,opts={}){
  let mode=opts.mode||(opts.dawn?'gold':skyPhase());if(mode==='dusk')mode='night';
  const P=themePal('sky',mode);
  const g=c.createLinearGradient(0,-40,0,125);g.addColorStop(0,P[0]);g.addColorStop(.55,P[1]);g.addColorStop(1,P[2]);c.fillStyle=g;c.fillRect(-80,-300,W+160,H+360);SKY_TOP=P[0];
  const night=mode==='night';const sp={day:[58,30],dawn:[248,92],sunset:[66,92],gold:[60,76],night:[48,27]}[mode];
  SUN={x:sp[0],y:sp[1],night,col:night?'225,232,255':mode==='day'?'255,250,210':'255,214,150',mode};
  if(night){
    layerCache(c,'stars',-60,-282,W+120,382,q=>{for(let i=0;i<46;i++)disc(q,(i*83.7)%W,(i*47.3)%98,.3,'rgba(255,255,255,.45)');for(let i=0;i<90;i++)disc(q,((i*71.3)%(W+120))-60,-((i*53.9)%280),i%6?.32:.6,'rgba(255,255,255,.5)');});
    STARS.forEach(([x,y,b],i)=>{const tw=.5+.5*Math.sin(t/(500+i%7*90)+i*1.7);c.globalAlpha=.35+.65*tw;disc(c,x,y,b===2?.85:.48,'#FFFFFF');if(b===2&&tw>.85){line(c,x-2,y,x+2,y,'rgba(255,255,255,.7)',.25);line(c,x,y-2,x,y+2,'rgba(255,255,255,.7)',.25);}});c.globalAlpha=1;
    glowAt(c,sp[0],sp[1],34,'200,215,255',.4);disc(c,sp[0],sp[1],8,'#FFF8E0');disc(c,sp[0]+3.8,sp[1]-2.6,7,'#1A2250');disc(c,sp[0]-3,sp[1]+2,1.1,'rgba(200,190,150,.5)');
    const sh=(t%9000)/9000;if(sh<.08){const q=sh/.08,x=250-q*120,y=14+q*40;line(c,x,y,x+16*(1-q)+4,y-6*(1-q)-1.5,'rgba(255,255,255,.85)',.7);}
  }else{
    if(mode!=='day')glowAt(c,sp[0],104,120,'255,196,128',.42);
    glowAt(c,sp[0],sp[1],mode==='day'?36:56,SUN.col,mode==='day'?.8:.95);
    if(mode==='day')for(let i=0;i<10;i++){const a=i/10*TAU+t/9000;c.strokeStyle='rgba(255,250,210,.22)';c.lineWidth=1.2;c.lineCap='round';c.beginPath();c.moveTo(sp[0]+Math.cos(a)*12,sp[1]+Math.sin(a)*12);c.lineTo(sp[0]+Math.cos(a)*(17+Math.sin(t/700+i)*1.5),sp[1]+Math.sin(a)*(17+Math.sin(t/700+i)*1.5));c.stroke();}
    disc(c,sp[0],sp[1],mode==='day'?8.5:11,mode==='day'?'#FFF6C4':'#FFE9A6');
  }
  if(opts.rainbow){['#E0453B','#F2A33A','#F2D24A','#5DBE9C','#4A7EC2','#9B5DE5'].forEach((col,i)=>{c.strokeStyle=col;c.globalAlpha=.32;c.lineWidth=2.4;c.beginPath();c.arc(200,140,90-i*2.4,Math.PI,TAU);c.stroke();});c.globalAlpha=1;}
  if(opts.aurora){for(let x=0;x<W;x+=3){const y=26+Math.sin(x/30+t/1500)*8;c.fillStyle=`hsla(${150+Math.sin(x/50+t/2000)*50},90%,75%,.25)`;c.fillRect(x,y,3,26);}}
  const cc=themePal('cloud',mode);
  CLOUDS.forEach(([x0,y,s],i)=>{const x=((x0+t/(250+i*60))%(W+90))-45;cloud(c,x,y,s,cc[0],cc[1]);});
  if(VIEW_EXT.top>20&&!night)for(let k=0;k<8;k++){const y=-22-k*34;if(y<-VIEW_EXT.top-10)break;const x=((k*97+t/(300+k*40))%(W+120))-60;c.globalAlpha=.85-k*.06;cloud(c,x,y,1.1+(k%3)*.25,cc[0],cc[1]);c.globalAlpha=1;}
  if(!night&&!opts.noBirds)for(let i=0;i<3;i++){const bx=((t/95+i*31)%(W+80))-40,by=46+i*5+Math.sin(t/900+i)*3,fl=Math.sin(t/160+i*2)*1.6;c.strokeStyle='rgba(60,70,95,.5)';c.lineWidth=.55;c.lineCap='round';c.beginPath();c.moveTo(bx-3,by-fl);c.quadraticCurveTo(bx-1.2,by-1.1,bx,by);c.quadraticCurveTo(bx+1.2,by-1.1,bx+3,by-fl);c.stroke();}
  if(opts.shooting){const p=(t%4000)/4000;if(p<.3){const x=260-p*500,y=10+p*120;line(c,x,y,x+14,y-7,'rgba(255,255,255,.9)',1);}}
  runLayers('sky',c,t,{mode,night,opts});
  if(opts.fireworks){const p=(t%2600)/2600;if(p<.6){const cx=80+(Math.floor(t/2600)*97)%180,cy=30+(Math.floor(t/2600)*31)%30;for(let i=0;i<14;i++){const a=i/14*TAU;disc(c,cx+Math.cos(a)*p*22,cy+Math.sin(a)*p*22,.9*(1-p)+.2,['#F2C462','#E0457B','#7CC7E6'][i%3]);}}}
}
function sea(c,y0,t,opts={}){
  const P=opts.glow?['#2FA7C0','#176488']:themePal('sea',SUN.mode);
  const g=c.createLinearGradient(0,y0,0,H);g.addColorStop(0,P[0]);g.addColorStop(1,P[1]);c.fillStyle=g;c.fillRect(-80,y0,W+160,H-y0+300);SEA_BOT=P[1];
  const hz=c.createLinearGradient(0,y0,0,y0+9);hz.addColorStop(0,'rgba(255,255,255,.42)');hz.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=hz;c.fillRect(-80,y0,W+160,9);
  for(let i=0;i<24;i++){const yy=y0+1.5+i*1.1+i*i*.15;if(yy>H)break;const wv=(3+i*1.5)*(.55+.45*Math.sin(t/260+i*1.9));c.fillStyle=`rgba(${SUN.col},${(SUN.night?.42:.5)*(1-i/26)})`;c.fillRect(SUN.x-wv/2+Math.sin(t/400+i)*1.5,yy,wv,.9);}
  c.lineCap='round';
  for(let k=0,y=y0+4;y<H+4+VIEW_EXT.bot;k++,y+=Math.min(14,4.5+k*.8)){const dep=Math.min(1,(y-y0)/(H-y0));const len=5+dep*9,gap=24+dep*30;c.strokeStyle=opts.glow?`rgba(150,255,240,${.5+dep*.4})`:`rgba(255,255,255,${.26+dep*.4})`;c.lineWidth=.5+dep*.55;const off=((t/(95-dep*45))+k*37)%gap;
    for(let x=-gap;x<W+gap;x+=gap){const xx=x+off+Math.sin(k*3.1)*9,yy=y+Math.sin(t/700+k+x*.05)*.8;c.beginPath();c.moveTo(xx,yy);c.quadraticCurveTo(xx+len/2,yy-1.3-dep,xx+len,yy);c.stroke();}}
  runLayers('sea',c,t,{y0,opts});
  if(opts.glow)for(let i=0;i<24;i++)disc(c,(i*47+t/50)%W,y0+6+(i*13)%(H-y0-8),.6+.4*Math.sin(t/300+i),'rgba(170,255,240,.9)');
}
function island(c,cx,cy,rx,ry,t){const lap=Math.sin(t/900)*1.2,m=v=>Math.max(.6,v);
  ell(c,cx,cy+2.6,rx+7+lap,ry+3.6,'rgba(255,255,255,.3)');ell(c,cx,cy+2,rx+4+lap*.6,ry+2.6,'rgba(255,255,255,.6)');
  ell(c,cx,cy+.9,rx+1.4,ry+.8,'#E0C68A');ell(c,cx,cy,rx,ry,'#F6E3B4');
  ell(c,cx,cy-3,m(rx-6),m(ry-3),'#7DBF58');ell(c,cx,cy-4.4,m(rx-10),m(ry-5),'#93D06A');ell(c,cx-rx*.18,cy-5.2,rx*.42,m(ry-7),'#A9DC7C');
  for(let i=0;i<Math.floor(rx/10);i++){const a=.5+i*2.4;if(Math.sin(a)>.1)disc(c,cx+Math.cos(a)*(rx-3)*.92,cy+Math.sin(a)*(ry-1)*.62+.6,.8,'#CDB58A');}}
function flame(c,x,y,s,t,k=0){const f=Math.sin(t/90+k)*.5+Math.sin(t/53+k*2)*.3;[['#F2743A',1],['#F9A63A',.72],['#FFE27A',.42]].forEach(([col,q])=>{c.fillStyle=col;c.beginPath();c.moveTo(x-2.2*s*q,y);c.quadraticCurveTo(x-2.8*s*q,y-3*s*q,x+f*s*.6,y-(6.5+f)*s*q);c.quadraticCurveTo(x+2.8*s*q,y-3*s*q,x+2.2*s*q,y);c.closePath();c.fill();});}
function nightVeil(c,a=.2){if(!SUN.night)return false;c.fillStyle=`rgba(14,22,66,${a})`;c.fillRect(-80,-300,W+160,H+600);return true;}
function lamp(c,x,y,r,a=.75,rgb='255,190,100'){c.save();c.globalCompositeOperation='lighter';glowAt(c,x,y,r,rgb,a);c.restore();}

/* ---------- Flags & sails that actually feel the wind ---------- */
function drawFlag(c,x,y,fid,t,w=12,h=8){const f=it(fid)||it('flag_skull');const n=8,wd=wind(t);const wave=i=>Math.sin(t/200-i*.85)*(.3+i/n*1.1)*wd+(i/n)*(1.2-wd)*1.6;
  c.save();c.beginPath();c.moveTo(x,y);for(let i=1;i<=n;i++)c.lineTo(x+i*w/n,y+wave(i));for(let i=n;i>=0;i--)c.lineTo(x+i*w/n,y+h+wave(i)*1.05);c.closePath();c.fillStyle=f.col;c.fill();
  if(f.gold){c.strokeStyle='#F2C462';c.lineWidth=.55;c.stroke();}
  c.save();c.clip();for(let i=0;i<n;i++){const sh=Math.cos(t/200-i*.85);c.fillStyle=sh>0?`rgba(255,255,255,${sh*.13})`:`rgba(0,0,0,${-sh*.16})`;c.fillRect(x+i*w/n,y-4,w/n+.2,h+8);}
  drawSymbol(c,f.sym,x+w/2,y+h/2+wave(n/2),h/7.4,f.sc);
  if(f.gold){const p=(t/1500)%2;const sx=x+p*w*1.3-w*.3;c.fillStyle='rgba(255,240,190,.5)';c.beginPath();c.moveTo(sx,y-4);c.lineTo(sx+1.8,y-4);c.lineTo(sx-1.2,y+h+4);c.lineTo(sx-3,y+h+4);c.fill();}
  c.restore();c.restore();}
function drawSail(c,x,y,w,h,sid,t,showMark){const s=it(sid)||it('sail_canvas');const wd=wind(t+x*40);const billow=1.1+wd*2.6+Math.sin(t/330+x)*.3*wd;
  c.save();sailPath(c,x,y,w,h,billow);c.fillStyle=s.col;c.fill();c.clip();
  if(s.pat==='stripe')for(let i=0;i<6;i+=2)R(c,x-3,y+i*h/6,w+8,h/6,s.col2);
  if(s.pat==='patch'){R(c,x+w*.15,y+h*.2,w*.25,h*.3,s.col2);R(c,x+w*.6,y+h*.55,w*.22,h*.28,'#D9C08E');}
  if(s.pat==='grad'){const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,s.col);g.addColorStop(1,s.col2);c.fillStyle=g;c.fillRect(x-3,y-2,w+8,h+4);}
  if(s.pat==='stars')for(let i=0;i<9;i++)disc(c,x+((i*37)%100)/100*w,y+((i*61)%100)/100*h,.45,s.col2);
  if(s.pat==='rainbow')['#E0453B','#F2A33A','#F2D24A','#5DBE9C','#4A7EC2','#9B5DE5'].forEach((col,i)=>R(c,x-3,y+i*h/6,w+8,h/6+.2,col));
  if(s.pat==='mark'&&showMark)drawMark(c,x+w/2+1+billow*.3,y+h/2,Math.min(w,h)*.62,s.col2);
  if(s.pat==='skull'&&showMark)drawSymbol(c,'skull',x+w/2+1+billow*.3,y+h/2,Math.min(w,h)/9,s.col2);
  if(s.pat&&SAIL_PATS[s.pat])try{SAIL_PATS[s.pat](c,s,x,y,w,h,t,showMark,billow);}catch(e){}
  c.strokeStyle='rgba(0,0,0,.07)';c.lineWidth=.3;for(let i=1;i<4;i++){c.beginPath();c.moveTo(x+i*w/4+billow*.4,y-1);c.quadraticCurveTo(x+i*w/4+billow*1.05,y+h/2,x+i*w/4+billow*.4,y+h+1);c.stroke();}
  const g=c.createLinearGradient(x,0,x+w+billow,0);g.addColorStop(0,'rgba(255,255,255,.18)');g.addColorStop(.5,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(0,0,0,.14)');c.fillStyle=g;c.fillRect(x-3,y-3,w+12,h+6);
  if(SUN.night){c.fillStyle='rgba(24,34,90,.25)';c.fillRect(x-3,y-3,w+12,h+6);}
  c.restore();}

/* ---------- The ship ---------- */
function drawShip(c,x,y,s,pl,t,opts={}){
  if(typeof artShip==='function'&&isArtLook())return artShip(c,x,y,s,pl,t,opts);
  pl=pl||{};const hull=it(pl.hull||SHIP_DEFAULT.hull)||it('hull_oak');const gild=pl.effect==='goldlh'||hull.gold;const ph=opts.phase||0,night=SUN.night;
  const fire=opts.firing>0?opts.firing:0,kick=fire*fire;const trim=gild?'#F2C462':'#6B4429';
  const rock=Math.sin(t/900+ph)*.04+Math.sin(t/410+ph*2)*.012-kick*.045,bob=Math.sin(t/650+ph)*1.3+Math.sin(t/270+ph)*.3;
  c.save();c.translate(x-kick*2.2*s,y+bob*s*.4);
  // rippling reflection
  c.save();c.scale(s,s);for(let i=0;i<5;i++){const wv=Math.sin(t/300+i*1.3+ph)*2.2;c.fillStyle=`rgba(40,30,30,${.13-i*.022})`;c.fillRect(-30+wv+i*2,3.5+i*2.3,60-i*6,1.4);}if(night)for(let i=0;i<4;i++){c.fillStyle=`rgba(255,200,120,${.3-i*.07})`;c.fillRect(-39+Math.sin(t/260+i)*1.4,4+i*2.4,5-i*.8,1.1);}c.restore();
  c.rotate(rock);c.scale(s,s);
  if(pl.trail)drawWake(c,-34,1,(it(pl.trail)||{}).st,t,1);
  if(opts.moving)for(let i=0;i<8;i++){const q=((t/520)+i/8)%1;disc(c,-38-q*30,1.6+Math.sin(i*2.3)*1.3,1.7*(1-q)+.4,`rgba(255,255,255,${.75*(1-q)})`);}
  // masts and sails
  R(c,-1,-58,2,46,'#7A4E30');R(c,-.3,-58,.5,46,'rgba(255,255,255,.2)');R(c,-19,-44,1.6,32,'#7A4E30');
  drawSail(c,-14,-54,24,13,pl.sail,t,false);drawSail(c,-17,-39,30,20,pl.sail,t,true);drawSail(c,-29,-40,18,22,pl.sail,t,false);
  const jb=wind(t)*2.4;c.fillStyle=(it(pl.sail)||it('sail_canvas')).col;c.beginPath();c.moveTo(2,-50);c.quadraticCurveTo(18+jb,-30,30,-14);c.quadraticCurveTo(16,-13.4-jb*.5,3,-14);c.closePath();c.fill();c.fillStyle=night?'rgba(24,34,90,.28)':'rgba(0,0,0,.07)';c.fill();
  rr(c,-4.5,-48,9,3,1.2,'#8A5A3A');R(c,-4.5,-48.4,9,.7,trim);
  drawFlag(c,1,-66,pl.flag||SHIP_DEFAULT.flag,t);R(c,-.4,-67,.8,10,'#7A4E30');
  if(opts.em!=null){R(c,-.4,-76,.8,10,'#7A4E30');disc(c,0,-76.4,1,'#E2AE45');drawEmissary(c,.4,-75,opts.em,t);}
  // rigging and ratlines
  c.strokeStyle='rgba(90,60,40,.55)';c.lineWidth=.35;c.beginPath();c.moveTo(0,-58);c.lineTo(32,-15);c.moveTo(0,-58);c.lineTo(-32,-14);c.moveTo(-18,-44);c.lineTo(-33,-14);c.stroke();
  if(s>=.9){c.strokeStyle='rgba(90,60,40,.3)';c.lineWidth=.25;c.beginPath();for(let i=2;i<7;i++){const q=i/7;c.moveTo(-32*q,-58+44*q);c.lineTo(-1,-58+44*q);}c.stroke();}
  // captain & parrot at the helm
  if(opts.captain!==false&&opts.pid){c.save();c.translate(-24,-27+Math.sin(t/650+ph)*.25);drawKeeper(c,0,0,opts.pid,pl,t,{chicken:opts.chicken,dance:opts.dance});c.restore();
    if(opts.moth!=null)drawMoth(c,-15,-23,opts.moth,t,pl.moth,false);}
  if(opts.pet)drawPet(c,opts.pet,-4,-16,t,.6);
  (pl.deck||[]).slice(0,4).forEach((id,i)=>id&&drawDeckItem(c,id,(typeof DECK_SPOTS!=='undefined'?DECK_SPOTS:[-8,6,18])[i],-14,t));
  {const sh=pl.shot&&ALL_ITEMS[pl.shot];if(sh){c.save();c.translate(-30,-18.4);c.scale(.8,.8);drawShot(c,-2.3,0,sh.st,t);drawShot(c,2.3,0,sh.st,t+300);drawShot(c,0,-3.3,sh.st,t+600);c.restore();}}
  // hull
  c.fillStyle=hull.col;c.beginPath();c.moveTo(-34,-16);c.lineTo(30,-16);c.quadraticCurveTo(38,-17,40,-22);c.quadraticCurveTo(39,-6,24,2);c.quadraticCurveTo(0,5,-24,2);c.quadraticCurveTo(-33,-2,-36,-18);c.closePath();c.fill();
  c.save();c.clip();R(c,-40,-9,82,4,hull.col2);R(c,-40,-2,82,8,hull.col2);if(hull.pat)try{hullPat(c,hull,t);}catch(e){}
  const hg=c.createLinearGradient(0,-17,0,4);hg.addColorStop(0,'rgba(255,255,255,.16)');hg.addColorStop(.4,'rgba(255,255,255,0)');hg.addColorStop(1,'rgba(0,0,0,.22)');c.fillStyle=hg;c.fillRect(-40,-24,84,30);
  c.fillStyle='rgba(0,0,0,.09)';for(let i=0;i<9;i++)c.fillRect(-36+i*9+(i%2)*3,-16,.4,20);
  if(gild){R(c,-40,-5.4,82,.8,'#F2C462');}
  if(night){c.fillStyle='rgba(20,30,80,.25)';c.fillRect(-40,-24,84,30);}c.restore();
  R(c,-35,-17.2,66,1.6,trim);
  for(let i=0;i<5;i++){disc(c,-20+i*10,-11.5,1.6,gild?'#F2C462':'#DDA94D');disc(c,-20+i*10,-11.5,1.05,night?'#FFD98A':'#2E3A5C');}
  rr(c,-38,-24,6,8,1.5,hull.col2);R(c,-38,-24.6,6,1,trim);rr(c,-36.6,-22.6,3.2,3,.6,night?'#FFD98A':'#9FD7F0');
  // stern lantern
  R(c,-37.3,-31,.6,6.4,'#5A4030');rr(c,-38.4,-33.6,2.8,3.2,.8,night?'#FFE39A':'#F7E7B5');R(c,-38.6,-34.2,3.2,.8,'#5A4030');
  if(night){lamp(c,-37,-32,13,.7);for(let i=0;i<5;i++)lamp(c,-20+i*10,-11.5,3.2,.5);}
  if(pl.figure)drawFigure(c,37,-21,pl.figure);
  if(gild)for(let i=0;i<3;i++){const tw=Math.sin(t/260+i*2.1);if(tw>.5){const gx=-26+i*24,gy=-17.6;line(c,gx-1.6,gy,gx+1.6,gy,'#FFF6CF',.4);line(c,gx,gy-1.6,gx,gy+1.6,'#FFF6CF',.4);}}
  // water lapping at the hull, bow spray under way
  c.fillStyle=night?'rgba(60,120,170,.5)':'rgba(95,207,216,.45)';c.beginPath();c.moveTo(-40,0);for(let i=0;i<=8;i++)c.quadraticCurveTo(-40+i*10+5,-1.6+Math.sin(t/300+i)*.7,-40+(i+1)*10,0);c.lineTo(42,6);c.lineTo(-40,6);c.closePath();c.fill();
  c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=.6;c.beginPath();for(let i=0;i<4;i++){const sx=-30+i*16+Math.sin(t/500+i)*2;c.moveTo(sx,1);c.quadraticCurveTo(sx+3,-.4,sx+6,1);}c.stroke();
  if(opts.moving)for(let i=0;i<7;i++){const q=((t/380)+i/7)%1;disc(c,36+q*5-i%3,-1-Math.sin(q*Math.PI)*(4+i%3*1.5),1.3*(1-q)+.3,`rgba(255,255,255,${.85*(1-q)})`);}
  // cannon: muzzle flash, then smoke
  if(fire){const p=1-fire;if(p<.3){lamp(c,37,-13,5+10*(1-p/.3),.9,'255,200,90');disc(c,36.5,-13,2.4*(1-p/.3),'#FFF1B8');}for(let i=0;i<5;i++)disc(c,34+p*9+i*2.2,-14-p*8-i*1.2,2+p*3.4,`rgba(250,250,250,${.7*(1-p)})`);}
  c.restore();
}

/* ---------- Sea foes ---------- */
function bossFace(c,cx,cy,r,ratio,t,look=-1){const er=Math.max(1.2,r/7.5);const dizzy=ratio<.25,cross=ratio<.6;const blink=(t%3700)<130;
  [-r*.32,r*.32].forEach((dx,k)=>{const ex=cx+dx;
    if(blink&&!dizzy){line(c,ex-er,cy,ex+er,cy,'#3F3A30',.8);return;}
    disc(c,ex,cy,er+.9,'#FFFFFF');
    if(dizzy){const a=t/200+k*2;c.strokeStyle='#3F3A30';c.lineWidth=.55;c.beginPath();for(let i=0;i<16;i++){const q=i/16;c.lineTo(ex+Math.cos(a+q*9)*er*q,cy+Math.sin(a+q*9)*er*q);}c.stroke();}
    else{disc(c,ex+look*er*.3,cy+.2,er*.75,'#3F3A30');disc(c,ex+look*er*.3+.5,cy-.4,er*.25,'#FFFFFF');}
    if(cross&&!dizzy){const sd=k?-1:1;line(c,ex-sd*er*1.3,cy-er*1.9,ex+sd*er*1.1,cy-er*1.15,'#3F3A30',.9);}});
  c.globalAlpha=.5;disc(c,cx-r*.55,cy+r*.28,r*.12,'#F49A9A');disc(c,cx+r*.55,cy+r*.28,r*.12,'#F49A9A');c.globalAlpha=1;
  c.strokeStyle='#3F3A30';c.lineWidth=1;c.lineCap='round';c.beginPath();const mw=r*.26;
  if(ratio>.6)c.arc(cx,cy+r*.22,mw,.15*Math.PI,.85*Math.PI);else if(ratio>.25){c.moveTo(cx-mw,cy+r*.42);c.quadraticCurveTo(cx,cy+r*.2+Math.sin(t/150)*1.5,cx+mw,cy+r*.42);}else{c.moveTo(cx-mw,cy+r*.36);for(let i=1;i<=4;i++)c.lineTo(cx-mw+i*mw/2,cy+r*.36+(i%2?1.4:0));}c.stroke();
  if(ratio<.5){rr(c,cx+r*.5,cy-r*.6,r*.36,r*.16,1,'#F7E3C0');rr(c,cx+r*.6,cy-r*.72,r*.16,r*.4,1,'#F7E3C0');}
  if(ratio<.75){const d=(t/40)%12;disc(c,cx-r*.85,cy-r*.3+d*.4,1,'rgba(140,200,255,.9)');}}
function tentacle(c,x0,y0,len,side,w,col,t,ph,curl=1){const n=18;for(let i=0;i<n;i++){const u=i/(n-1);const sway=Math.sin(t/480+ph+u*2.6)*len*.2*u;const cu=u>.6?(u-.6)/.4:0;const x=x0+side*(u*len*.18+sway+Math.sin(cu*2.4)*len*.2*curl),y=y0-u*len*(1-cu*.28)+ (1-Math.cos(cu*2.2))*len*.12;const rad=w*(1-u*.72);disc(c,x,y,rad,col);if(i%3===1&&u<.9)disc(c,x-side*rad*.45,y+rad*.1,rad*.32,'rgba(255,255,255,.4)');}}
function drawBoss(c,boss,bx,by,r,ratio,t,flash,wl){
  let col=boss.col;if(boss.rare&&boss.type!=='whale')col=`hsl(${(t/20)%360},62%,72%)`;if(flash)col='#FFFFFF';
  const type=boss.type||'storm';const hitK=Math.max(0,Math.min(1,((S.bossFlash||0)+260-t)/370));const br=1+Math.sin(t/620)*.035;const wet=wl!=null&&type!=='storm'&&type!=='ship';
  const W1='rgba(255,255,255,.35)',D1='rgba(0,0,0,.14)';
  c.save();c.translate(bx+hitK*r*.2,by-hitK*r*.04);c.rotate(hitK*.1*Math.sin(t/28));c.scale(br+hitK*.05,2-br-hitK*.05);c.translate(-bx,-by);
  if(wet){c.save();c.beginPath();c.rect(bx-r*5,by-r*5,r*10,wl-(by-r*5));c.clip();}
  if(type==='storm'){
    const flashing=Math.sin(t/400)>.85||Math.sin(t/173+2)>.97;if(flashing)lamp(c,bx,by,r*2.2,.35,'255,245,200');
    for(let i=0;i<5;i++){const yy=by+r*.7+((t/7+i*17)%(r*2.2));line(c,bx-r*.7+i*r*.35,yy,bx-r*.7+i*r*.35-2.2*wind(t),yy+4,'rgba(120,170,220,.75)',.7);}
    for(let i=0;i<9;i++){const a=i/9*TAU+t/2600;disc(c,bx+Math.cos(a)*r*.68,by+Math.sin(a)*r*.36,r*.5+Math.sin(t/500+i)*r*.04,col);}disc(c,bx,by,r*.8,col);
    ell(c,bx,by+r*.42,r*.95,r*.3,D1);disc(c,bx-r*.3,by-r*.38,r*.22,'rgba(255,255,255,.5)');disc(c,bx+r*.25,by-r*.5,r*.12,'rgba(255,255,255,.35)');
    for(let k=0;k<3;k++){const a=t/900+k*2.1;c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=.6;c.beginPath();c.arc(bx,by,r*(1.15+k*.14),a,a+1.1);c.stroke();}
    if(flashing){const lx=bx+Math.sin(Math.floor(t/400)*7)*r*.4;c.strokeStyle='#FFE88A';c.lineWidth=1.3;c.lineJoin='miter';c.beginPath();c.moveTo(lx,by+r*.6);c.lineTo(lx-3,by+r*1.15);c.lineTo(lx+1.5,by+r*1.2);c.lineTo(lx-2.5,by+r*1.9);c.stroke();c.strokeStyle='#FFFFFF';c.lineWidth=.45;c.stroke();line(c,lx-.5,by+r*1.18,lx+4,by+r*1.5,'#FFE88A',.6);}
    bossFace(c,bx,by-r*.05,r,ratio,t);}
  else if(type==='serpent'){const base=by+r*.55;
    for(let i=0;i<4;i++){const hx=bx-r*1.75+i*r*.62,up=Math.sin(t/520-i*1.25);const hr=r*(.3+.05*i);const hy=base-r*.08-up*r*.18;
      c.fillStyle=col;c.beginPath();c.ellipse(hx,hy,hr*1.15,hr*1.5,0,Math.PI,0);c.fill();c.fillStyle=W1;c.beginPath();c.ellipse(hx,hy,hr*.75,hr*.6,0,Math.PI,0);c.fill();
      for(let k=-1;k<=1;k++)poly(c,[[hx+k*hr*.5-hr*.18,hy-hr*1.4+Math.abs(k)*hr*.25],[hx+k*hr*.5,hy-hr*1.95+Math.abs(k)*hr*.3],[hx+k*hr*.5+hr*.18,hy-hr*1.4+Math.abs(k)*hr*.25]],'#F2C462');}
    const sway=Math.sin(t/700)*r*.12,hb=Math.sin(t/520)*r*.06;const hx=bx+r*.6+sway,hy=by-r*.55+hb;
    c.strokeStyle=col;c.lineWidth=r*.5;c.lineCap='round';c.beginPath();c.moveTo(bx+r*.42,base+r*.2);c.quadraticCurveTo(bx+r*.1+sway*.4,by-r*.1,hx-r*.1,hy+r*.2);c.stroke();
    c.strokeStyle=W1;c.lineWidth=r*.18;c.beginPath();c.moveTo(bx+r*.52,base+r*.2);c.quadraticCurveTo(bx+r*.22+sway*.4,by-r*.1,hx,hy+r*.25);c.stroke();
    for(let i=0;i<3;i++)poly(c,[[hx-r*.42+i*r*.22,hy-r*.32],[hx-r*.3+i*r*.22,hy-r*.68-Math.sin(t/300+i)*r*.05],[hx-r*.18+i*r*.22,hy-r*.32]],'#F2C462');
    ell(c,hx,hy,r*.56,r*.42,col);ell(c,hx-r*.3,hy+r*.12,r*.3,r*.2,col);disc(c,hx-r*.5,hy+r*.02,r*.035,'#3F3A30');disc(c,hx-r*.2,hy-r*.2,r*.12,W1);
    if((t%2600)<500){const q=(t%2600)/500,tl=Math.sin(q*Math.PI)*r*.4;c.strokeStyle='#E0457B';c.lineWidth=.8;c.beginPath();c.moveTo(hx-r*.55,hy+r*.16);c.lineTo(hx-r*.55-tl,hy+r*.2);c.moveTo(hx-r*.55-tl*.7,hy+r*.19);c.lineTo(hx-r*.55-tl-1.6,hy+r*.2-1.4);c.moveTo(hx-r*.55-tl*.7,hy+r*.19);c.lineTo(hx-r*.55-tl-1.6,hy+r*.2+1.4);c.stroke();}
    bossFace(c,hx+r*.04,hy-r*.05,r*.56,ratio,t);}
  else if(type==='octopus'||type==='kraken'){const kr=type==='kraken';const n=kr?6:4;const base=wl!=null?wl+r*.1:by+r*1.05;
    for(let i=0;i<n;i++){const u=i/(n-1),side=u<.5?-1:1;const x0=bx+(u-.5)*r*(kr?3.4:2.6);const slam=Math.max(0,Math.sin(t/1300+i*1.7));tentacle(c,x0,base,r*(.9+.35*slam+(i%2)*.2),side,r*.15,col,t,i*1.9,1+slam*.4);}
    const wob=Math.sin(t/450)*r*.03;
    if(kr){poly(c,[[bx-r*.62,by-r*.62],[bx-r*1.02,by-r*1.12],[bx-r*.3,by-r*.92]],col);poly(c,[[bx+r*.62,by-r*.62],[bx+r*1.02,by-r*1.12],[bx+r*.3,by-r*.92]],col);}
    ell(c,bx,by-r*.15,r*.8+wob,r*.92-wob,col);ell(c,bx,by+r*.3,r*.74,r*.4,D1);ell(c,bx,by-r*.2,r*.72,r*.78,col);
    disc(c,bx-r*.3,by-r*.62,r*.18,'rgba(255,255,255,.45)');for(let i=0;i<5;i++)disc(c,bx-r*.44+i*r*.2+Math.sin(i*5)*r*.04,by-r*.82+Math.abs(i-2)*r*.1,r*.045,'rgba(0,0,0,.12)');
    for(let i=0;i<4;i++)disc(c,bx-r*.5+i*r*.33,by+r*.5,r*.07,'rgba(255,255,255,.4)');
    if(!kr){rr(c,bx-r*.7,by-r*1.07,r*1.4,r*.25,r*.1,'#FFFFFF');txt(c,'OOO',bx,by-r*1.07,'#E0457B',Math.max(4,r*.22),'center');}
    bossFace(c,bx,by-r*.1,r*.85,ratio,t);
    for(let i=0;i<2;i++){const side=i?1:-1;const slam=Math.max(0,Math.sin(t/1100+i*3));tentacle(c,bx+side*r*.95,base,r*(.7+.5*slam),side,r*.17,col,t,5+i*2.3,1.3);}}
  else if(type==='crab'){const sc=Math.sin(t/520)*r*.16;const x=bx+sc;
    [-1,1].forEach((sd,k)=>{for(let j=0;j<3;j++){const st=Math.sin(t/140+j*1.6+k*Math.PI)*r*.06;c.strokeStyle=col;c.lineWidth=r*.08;c.lineCap='round';c.beginPath();c.moveTo(x+sd*r*.5,by+r*.12+j*r*.1);c.quadraticCurveTo(x+sd*r*(.95+j*.05),by-r*.02+j*r*.12-st,x+sd*r*(1.1+j*.06),by+r*.42+j*r*.05+st);c.stroke();}
      const raise=Math.max(0,Math.sin(t/900+k*Math.PI))*r*.25;const cx2=x+sd*r*1.05,cy2=by-r*.9-raise;c.strokeStyle=col;c.lineWidth=r*.14;c.beginPath();c.moveTo(x+sd*r*.6,by-r*.05);c.quadraticCurveTo(x+sd*r*1.15,by-r*.35,cx2,cy2+r*.2);c.stroke();
      const snip=.12+Math.abs(Math.sin(t/190+k))*.5;ell(c,cx2,cy2-r*.1,r*.36,r*.2,col,sd*(-.35-snip));ell(c,cx2,cy2+r*.08,r*.3,r*.15,col,sd*(.15+snip*.4));disc(c,cx2-sd*r*.2,cy2+r*.02,r*.2,col);disc(c,cx2-sd*r*.1,cy2-r*.1,r*.07,W1);});
    ell(c,x,by,r*.82,r*.56,col);ell(c,x,by+r*.2,r*.7,r*.3,D1);ell(c,x,by-r*.06,r*.76,r*.46,col);disc(c,x-r*.32,by-r*.26,r*.14,'rgba(255,255,255,.45)');
    for(let i=0;i<5;i++)disc(c,x-r*.5+i*r*.25,by+r*.3,r*.06,'#C9654A');
    bossFace(c,x,by-r*.05,r*.7,ratio,t);
    for(let i=0;i<3;i++){const q=((t/1400)+i/3)%1;c.strokeStyle=`rgba(255,255,255,${.7*(1-q)})`;c.lineWidth=.5;c.beginPath();c.arc(x-r*.2+i*r*.3,by-r*.6-q*r*.9,1+q*1.6,0,TAU);c.stroke();}}
  else if(type==='whale'){glowAt(c,bx,by,r*1.7,'255,220,120',.35);const fl=Math.sin(t/420)*.35;
    c.save();c.translate(bx-r*1.05,by);c.rotate(fl);poly(c,[[0,0],[-r*.62,-r*.6],[-r*.42,-r*.05],[-r*.6,r*.42]],col);c.restore();
    ell(c,bx,by,r*1.15,r*.7,col);ell(c,bx+r*.1,by+r*.3,r*.9,r*.32,'#FFF3D0');for(let i=0;i<4;i++)line(c,bx-r*.3+i*r*.22,by+r*.2,bx-r*.22+i*r*.22,by+r*.5,'rgba(200,170,110,.6)',.4);
    disc(c,bx-r*.2,by-r*.38,r*.2,'rgba(255,255,255,.4)');ell(c,bx+r*.2,by+r*.25,r*.3,r*.12,col,.5+fl*.4);
    const p=(t%2400)/2400;if(p<.6)for(let i=0;i<9;i++){const q=p/.6,a=-Math.PI/2+(i-4)*.2;const d=q*r*1.5;disc(c,bx+r*.15+Math.cos(a)*d,by-r*.75+Math.sin(a)*d+q*q*r*.9,1.5*(1-q)+.4,'rgba(255,255,255,.9)');}
    bossFace(c,bx+r*.4,by-r*.1,r*.7,ratio,t);}
  else if(type==='ship'){const pl={hull:boss.ghost?'hull_ghost':'hull_navy',sail:boss.ghost?'sail_canvas':'sail_black',flag:'flag_skull'};
    if(boss.ghost){lamp(c,bx,by+r*.4,r*1.7,.22,'140,255,220');}
    c.save();if(boss.ghost)c.globalAlpha=.72+.14*Math.sin(t/500)+(Math.sin(t/61)>.96?-.25:0);c.translate(bx,by+r*.7);c.scale(-1,1);drawShip(c,0,0,r/34,pl,t,{captain:false,firing:Math.max(0,1-((t+600)%5200)/600)});c.restore();
    bossFace(c,bx-r*.05,by+r*.3,r*.55,ratio,t);
    if(boss.ghost)for(let i=0;i<4;i++){const a=t/800+i*TAU/4,wx=bx+Math.cos(a)*r*1.25,wy=by+Math.sin(a*1.3)*r*.5;lamp(c,wx,wy,4.5,.7,'150,255,225');disc(c,wx,wy,1.1,'rgba(230,255,245,.9)');disc(c,wx-Math.cos(a+1.4)*2,wy+1.4,.7,'rgba(200,255,235,.5)');}
    if(ratio<.5)for(let i=0;i<3;i++){const fx=bx-r*.6+i*r*.5;lamp(c,fx,by+r*.2,5,.6,'255,140,60');flame(c,fx,by+r*.32,.5+ratio,t,i);}}
  if(wet)c.restore();
  c.restore();
  if(wet){const fw=r*(type==='serpent'?2:type==='whale'?1.5:type==='kraken'?2:1.5),fx=type==='serpent'?bx-r*.45:bx;
    for(let i=0;i<3;i++){const q=((t/1000)+i/3)%1;c.strokeStyle=`rgba(255,255,255,${.65*(1-q)})`;c.lineWidth=.8;c.beginPath();c.ellipse(fx,wl+.6,fw*(.75+q*.45),r*.11*(.8+q*.7),0,0,TAU);c.stroke();}
    ell(c,fx,wl+.6,fw*.78,r*.085,'rgba(255,255,255,.6)');
    if(hitK>0)for(let i=0;i<8;i++){const a=-Math.PI*(i+.5)/8,d=(1-hitK)*r*1.2;disc(c,bx+Math.cos(a)*(fw*.5+d*.5),wl+Math.sin(a)*d-hitK*2,1.3*hitK+.3,'rgba(255,255,255,.85)');}}
}

/* ---------- Cannonballs: arcs, smoke trails, impact rings and damage numbers ---------- */
function updateLanterns(c,t){const nowp=performance.now();S.lanterns=S.lanterns.filter(l=>{const age=(nowp-l.born)/1000;if(age>1.6)return false;const p=Math.min(1,age/1.1);const at=q=>[l.x+(l.tx-l.x)*q,l.y+(l.ty-l.y)*q-Math.sin(q*Math.PI)*40];const[x,y]=at(p);
  for(let k=1;k<8;k++){const q=Math.max(0,p-k*.03);const[sx,sy]=at(q);disc(c,sx,sy-k*.15,1.7-k*.16+k*.12,`rgba(255,255,255,${.5-k*.06})`);}
  drawShot(c,x,y,l.st,t);if(p>=1&&!l.hit){l.hit=true;S.bossFlash=t+110;S.boom={x,y,t:nowp};}return p<1;});
  if(S.boom){const a=(nowp-S.boom.t)/520;if(a<1){const{x,y}=S.boom;lamp(c,x,y,16*(1-a),.8*(1-a),'255,210,120');
    c.strokeStyle=`rgba(255,255,255,${.9*(1-a)})`;c.lineWidth=1.4*(1-a)+.2;c.beginPath();c.arc(x,y,3+a*13,0,TAU);c.stroke();
    for(let i=0;i<9;i++){const an=i/9*TAU+.3;disc(c,x+Math.cos(an)*a*12,y+Math.sin(an)*a*12+a*a*5,2.3*(1-a),i%2?'#FFD45A':'#F27A3A');}disc(c,x,y,5*(1-a),'rgba(255,255,255,.85)');
    c.globalAlpha=1-a;txt(c,'-1',x+7,y-9-a*10,'#E0453B',7,'center');c.globalAlpha=1;}}}

/* ---------- Night over Funnal Cove: lighthouse beam and lit windows ---------- */
function harbourNight(c,t,B){if(!nightVeil(c,.2))return;const lit=(id,pts)=>{if(B[id]&&B[id].built)pts.forEach(([x,y,r])=>{disc(c,x,y,.9,'#FFE39A');lamp(c,x,y,r||6,.6);});};
  const tall=B.beacon&&B.beacon.built;const lx=109,ly=tall?62:76;const a=t/1700,dir=Math.cos(a),len=150*Math.abs(dir);
  c.save();c.globalCompositeOperation='lighter';const g=c.createLinearGradient(lx,0,lx+Math.sign(dir)*len,0);g.addColorStop(0,'rgba(255,240,180,.42)');g.addColorStop(1,'rgba(255,240,180,0)');c.fillStyle=g;c.beginPath();c.moveTo(lx,ly-1);c.lineTo(lx+Math.sign(dir)*len,ly-4-len*.09);c.lineTo(lx+Math.sign(dir)*len,ly+4+len*.09);c.lineTo(lx,ly+1);c.fill();c.restore();
  lamp(c,lx,ly,12+6*Math.abs(Math.sin(a)),.85,'255,236,170');
  lit('bakery',[[64,94],[77,94]]);lit('stall',[[44,101,7],[51,101,7]]);lit('carto',[[160,96,7]]);lit('clock',[[134,78,7]]);lit('observatory',[[180,86,6]]);lit('market',[[94,100],[107,100],[120,100]]);lit('jetty',[[230,115,5]]);
  for(let i=0;i<7;i++){const fx=30+((i*53)%170)+Math.sin(t/900+i)*5,fy=96+((i*17)%14)+Math.cos(t/700+i*2)*2;if(Math.sin(t/350+i*1.7)>0){disc(c,fx,fy,.6,'#F4FF9A');lamp(c,fx,fy,3,.5,'230,255,140');}}}
