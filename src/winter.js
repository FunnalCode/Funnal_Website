/* ============================== WINTER, CHRISTMAS AND NIGHT GLOW (Stage 1B) ==============================
   All of it hangs off THEME: winter = December to February (snowy islands, pines, ice floes,
   snow on the rigging, northern lights at night); Christmas = 1 to 26 December on top (fairy lights,
   the island tree with a bauble per target day, carol-singing seals, Gary's Santa hat);
   night glow = every night, all year. Add ?theme=christmas,night to the address to preview. */
const isWinter=()=>THEME.season==='winter',isXmas=()=>THEME.festive==='christmas',isNight=()=>!!(typeof SUN!=='undefined'&&SUN&&SUN.night);
const XMAS_COLS=['#E0453B','#F2C462','#5DBE9C','#7CC7E6','#E07AB8'];

/* ---------- snowy islands, pines instead of palms, snow on round trees ---------- */
const _island17=island;island=function(c,cx,cy,rx,ry,t){_island17.apply(this,arguments);if(!isWinter())return;const m=v=>Math.max(.6,v);
  ell(c,cx,cy-3.2,m(rx-5.4),m(ry-2.8),'#EAF2F6');ell(c,cx-rx*.08,cy-4.6,m(rx-10),m(ry-5),'#FFFFFF');ell(c,cx+rx*.25,cy-2.6,m(rx*.3),m(ry*.25),'rgba(170,200,220,.35)');};
function drawPine(c,x,y,h,t,xmas,baubles){const w=h*.42;ell(c,x,y,w*.8,1.2,'rgba(0,0,0,.1)');R(c,x-.7,y-h*.22,1.4,h*.22,'#7A4E30');
  [[0,.95],[.28,.78],[.52,.58]].forEach(([q,s],i)=>{const by=y-h*.18-q*h*.95,ww=w*s;c.fillStyle=i%2?'#2F7A52':'#367F57';c.beginPath();c.moveTo(x-ww,by);c.lineTo(x,by-h*.36);c.lineTo(x+ww,by);c.closePath();c.fill();
    if(isWinter()){c.fillStyle='#FFFFFF';c.beginPath();c.moveTo(x-ww*.45,by-h*.2);c.lineTo(x,by-h*.36);c.lineTo(x+ww*.45,by-h*.2);c.quadraticCurveTo(x,by-h*.16,x-ww*.45,by-h*.2);c.fill();c.beginPath();c.moveTo(x-ww,by);c.quadraticCurveTo(x,by-1.4,x+ww,by);c.lineTo(x+ww*.9,by+.6);c.quadraticCurveTo(x,by-.6,x-ww*.9,by+.6);c.fill();}});
  if(!xmas)return;const top=y-h*.18-.52*h*.95-h*.36;
  // star, tinsel, fairy lights and one bauble per target day this Christmas
  c.save();c.translate(x,top-.4);c.fillStyle='#F2C462';c.beginPath();for(let i=0;i<10;i++){const a=i/10*TAU-Math.PI/2,r=i%2?.7:1.7;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.fill();c.restore();
  if(isNight())lamp(c,x,top,6,.5,'255,220,120');
  for(let k=0;k<3;k++){const yy=y-h*(.3+k*.22),ww=w*(.85-k*.22);c.strokeStyle='rgba(242,196,98,.85)';c.lineWidth=.35;c.beginPath();c.moveTo(x-ww,yy);c.quadraticCurveTo(x,yy+1.2,x+ww*.9,yy-.8);c.stroke();}
  const n=Math.min(24,baubles||0);for(let i=0;i<n;i++){const q=(i*.618)%1,row=(i*.38)%1;const yy=y-h*.24-row*h*.62,ww=w*(.95-row*.62)*.82;const bx=x+(q*2-1)*ww;disc(c,bx,yy,.62,XMAS_COLS[i%5]);disc(c,bx-.2,yy-.2,.2,'rgba(255,255,255,.7)');}
  for(let i=0;i<10;i++){const q=i/9,yy=y-h*(.26+q*.6),ww=w*(.9-q*.65);const bx=x+Math.sin(i*2.1)*ww*.8;const on=Math.sin(t/300+i*1.7)>-.2;disc(c,bx,yy,.32,on?XMAS_COLS[(i+2)%5]:'rgba(255,255,255,.3)');if(on&&isNight())lamp(c,bx,yy,2.2,.35,'255,230,160');}}
function xmasBaubles(){try{const y=THEME.date.slice(0,4);let n=0;for(const d in G.days){if(d<y+'-12-01'||d>y+'-12-26')continue;const D=G.days[d];if(D.target>0&&D.team>=D.target)n++;}return THEME.preview&&!n?7:n;}catch(e){return 0;}}
const _palm17=palm;palm=function(c,x,y,h=14,t=0){if(!isWinter()||!THEME.scene)return _palm17.apply(this,arguments);const xm=isXmas()&&THEME.scene==='harbour'&&Math.abs(x-192)<2;drawPine(c,x,y,xm?h*1.9:h*1.15,t,xm,xm?xmasBaubles():0);};
if(typeof tree==='function'){const _tree17=tree;tree=function(c,x,y){_tree17.apply(this,arguments);if(!isWinter())return;disc(c,x,y-13.4,3.2,'#FFFFFF');disc(c,x-3.2,y-10.6,2.1,'#FFFFFF');disc(c,x+3.4,y-11,2.1,'#F4F8FA');};}

/* ---------- northern lights (winter nights) ---------- */
addLayer('sky','aurora',(c,t,ctx)=>{const sp=THEME.reduced?.25:1;for(let k=0;k<3;k++){const g=c.createLinearGradient(0,10,0,70);const col=k===1?'190,120,255':'90,255,190';g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(.5,`rgba(${col},${.16-k*.03})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;
  c.beginPath();const y0=18+k*9;c.moveTo(-10,y0+30);for(let i=0;i<=12;i++){const x=-10+i*29;c.lineTo(x,y0+Math.sin(t*sp/2600+i*.7+k)*7+Math.sin(i*1.9+k)*4);}for(let i=12;i>=0;i--){const x=-10+i*29;c.lineTo(x,y0+34+Math.sin(t*sp/3100+i*.5+k*2)*6);}c.closePath();c.fill();}},{z:-5,when:()=>isWinter()&&isNight()});

/* ---------- ice floes and the carol-singing seals ---------- */
function drawFloe(c,x,y,w,t,i){const b=Math.sin(t/1300+i)*.5;ell(c,x,y+1.4+b,w*1.08,w*.26,'rgba(255,255,255,.35)');c.fillStyle='#EAF4F8';c.beginPath();c.moveTo(x-w,y+b);c.lineTo(x-w*.6,y-w*.18+b);c.lineTo(x+w*.4,y-w*.22+b);c.lineTo(x+w,y-.2+b);c.lineTo(x+w*.7,y+w*.2+b);c.lineTo(x-w*.7,y+w*.18+b);c.closePath();c.fill();
  c.fillStyle='rgba(150,190,215,.45)';c.beginPath();c.moveTo(x-w*.7,y+w*.18+b);c.lineTo(x+w*.7,y+w*.2+b);c.lineTo(x+w,y-.2+b);c.lineTo(x+w*.9,y+w*.32+b);c.lineTo(x-w*.6,y+w*.3+b);c.closePath();c.fill();}
function drawSeal(c,x,y,t,i,hat){const sing=Math.sin(t/260+i*2)>0;ell(c,x,y,3.4,1.8,'#7C8A96');disc(c,x+2.6,y-1.8,1.6,'#8795A1');ell(c,x-3.4,y+.6,1.2,.6,'#6E7B86',.4);disc(c,x+3.1,y-2.1,.28,'#1E2228');
  if(sing)disc(c,x+3.9,y-1.2,.5,'#3A2A2A');else line(c,x+3.6,y-1.2,x+4.2,y-1.2,'#3A2A2A',.3);disc(c,x+4.1,y-1.7,.32,'#2E3338');
  if(hat){c.fillStyle='#D9363E';c.beginPath();c.moveTo(x+1.4,y-3.1);c.lineTo(x+3.8,y-3.2);c.lineTo(x+2,y-5.4);c.closePath();c.fill();R(c,x+1.3,y-3.4,2.6,.6,'#FFFFFF');disc(c,x+2,y-5.5,.4,'#FFFFFF');}}
addLayer('sea','floes',(c,t,ctx)=>{const y0=ctx.y0||108,h=H-y0;const sp=THEME.reduced?.3:1;const F=[[.15,.32,7],[.62,.22,5],[.88,.55,9],[.4,.8,6]];
  F.forEach(([fx,fy,w],i)=>{const x=((fx*W+t*sp/(260+i*70))%(W+40))-20;drawFloe(c,x,y0+fy*h,w,t,i);});
  if(isXmas()&&THEME.scene==='harbour'){const x=28,y=y0+h*.46;drawFloe(c,x,y,11,t,7);[[-5,0],[3,-.4]].forEach(([dx,dy],i)=>drawSeal(c,x+dx,y-1.6+dy,t,i,i===0));
    for(let i=0;i<3;i++){const q=((t/1600)+i/3)%1;c.globalAlpha=1-q;txt(c,i%2?'♫':'♪',x+4+q*6+Math.sin(q*6)*2,y-8-q*14,'#3E6FA3',3.4);}c.globalAlpha=1;}},{z:5,when:()=>isWinter()});

/* ---------- night glow: moon path, reflected stars ---------- */
addLayer('sea','moonpath',(c,t,ctx)=>{const y0=ctx.y0||108;const mx=SUN.x||48;for(let i=0;i<14;i++){const y=y0+3+i*((H-y0)/14);const w=(5+i*1.6)*(.7+.3*Math.sin(t/400+i*1.7));c.fillStyle=`rgba(225,232,255,${.34-i*.018})`;c.fillRect(mx-w/2+Math.sin(t/700+i)*2,y,w,.7);}
  for(let i=0;i<26;i++){const x=(i*61.7)%W,y=y0+4+((i*37.3)%(H-y0-6));const tw=.5+.5*Math.sin(t/(380+i%5*70)+i);c.globalAlpha=.25+.45*tw;disc(c,x,y,.32,'#FFFFFF');}c.globalAlpha=1;},{z:-2,when:()=>isNight()});

/* ---------- the ships: snow on the rigging, fairy lights, icicles, night lanterns and glowing wake ---------- */
const _drawShip17=drawShip;drawShip=function(c,x,y,s,pl,t,opts={}){_drawShip17.apply(this,arguments);const win=isWinter(),xm=isXmas(),nt=isNight();pl=pl||{};const hull=it(pl.hull||SHIP_DEFAULT.hull)||{};
  if(!win&&!xm&&!nt&&!hull.ice)return;const ph=opts.phase||0;const fire=opts.firing>0?opts.firing:0,kick=fire*fire;const rock=Math.sin(t/900+ph)*.04+Math.sin(t/410+ph*2)*.012-kick*.045,bob=Math.sin(t/650+ph)*1.3+Math.sin(t/270+ph)*.3;
  c.save();c.translate(x-kick*2.2*s,y+bob*s*.4);c.rotate(rock);c.scale(s,s);
  try{
  // 21 Nov: the glow under the hull drifts slowly (it raced along before); the painted ship has its own lanterns, so the extra ones are for Classic only
  const artS=typeof isArtLook==='function'&&isArtLook();
  if(nt){for(let i=0;i<9;i++){const q=((t/(artS?5200:2600))+i/9)%1;const xx=40-q*78;c.globalAlpha=(artS?.3:.45)*(1-Math.abs(q-.5)*1.6);ell(c,xx,3.6+Math.sin(t/1400+i)*.5,3.4,.7,'#6FF2D8');}c.globalAlpha=1;
    c.save();c.globalCompositeOperation='lighter';ell(c,2,4.6,34,2.6,'rgba(60,220,200,.10)');c.restore();
    if(!artS)[[0,-60],[36,-24],[-19,-46]].forEach(([lx,ly],i)=>{const fl=.8+.2*Math.sin(t/180+i*2);lamp(c,lx,ly+1.4,9*fl,.6,'255,200,110');rr(c,lx-1.2,ly,2.4,2.8,.8,'#FFE7A0');R(c,lx-.4,ly-.8,.8,.8,'#3F5160');});}
  // the painted ship has a different shape: its own snow, icicles and fairy lights
  if(artS){if(win){const snow='#FFFFFF';[[-26.6,-44.6,15.4],[-11.6,-55.4,28.6],[16.6,-46.4,15.4]].forEach(([sx,sy,w])=>{rr(c,sx,sy-1.2,w,1.5,.7,snow);for(let k=0;k<3;k++)disc(c,sx+w*(.2+k*.3),sy-1.1,.8,snow);});
      rr(c,-10.6,-16,31,1.5,.7,snow);for(let k=0;k<5;k++)disc(c,-8+k*6.6,-15.9,.85,snow);rr(c,-31.6,-24.2,16.4,1.5,.7,snow);rr(c,-3.4,-64.4,12.2,1.4,.7,snow);}
    if(hull.ice||win){const n=hull.ice?12:6;for(let k=0;k<n;k++){const ix=-30+k*(48/(n-1)),top=ix<-14?-22.4:-12.4,len=(hull.ice?2:1.3)+((k*37)%10)/10*(hull.ice?2:1);c.fillStyle='rgba(225,245,255,.92)';c.beginPath();c.moveTo(ix-.5,top);c.lineTo(ix+.5,top);c.lineTo(ix,top+len);c.closePath();c.fill();}}
    if(xm){[[[2.7,-73],[47.4,-24.4]],[[2.7,-73],[-30.6,-23.6]],[[-18.9,-50],[-30.6,-23.6]]].forEach(([a,b],li)=>{const n=li===2?6:11;for(let i=1;i<n;i++){const q=i/n;const bx=a[0]+(b[0]-a[0])*q,by=a[1]+(b[1]-a[1])*q+Math.sin(q*Math.PI)*1.2;const on=Math.sin(t/320+i*1.9+li)>-.3;
      disc(c,bx,by,.5,on?XMAS_COLS[(i+li)%5]:'rgba(255,255,255,.35)');if(on&&nt)lamp(c,bx,by,2.6,.28,'255,230,160');}});}
    c.restore();return;}
  if(win){const snow='#FFFFFF';[[-14,-54,24],[-17,-39,30],[-29,-40,18]].forEach(([sx,sy,w])=>{rr(c,sx-.6,sy-1.4,w+1.2,1.7,.8,snow);for(let k=0;k<3;k++)disc(c,sx+w*(.2+k*.3),sy-1.3,.9,snow);});
    rr(c,-4.8,-49.3,9.6,1.6,.8,snow);rr(c,-35.4,-18.6,66.6,1.7,.8,snow);for(let k=0;k<8;k++)disc(c,-31+k*8.4,-18.4,1,snow);disc(c,0,-58.6,1,snow);}
  if(hull.ice||win){const n=hull.ice?13:6;for(let k=0;k<n;k++){const ix=-31+k*(60/(n-1)),len=(hull.ice?2.2:1.4)+((k*37)%10)/10*(hull.ice?2.4:1.2);c.fillStyle='rgba(225,245,255,.92)';c.beginPath();c.moveTo(ix-.6,-15.6);c.lineTo(ix+.6,-15.6);c.lineTo(ix,-15.6+len);c.closePath();c.fill();}}
  if(xm){[[[0,-58],[32,-15]],[[0,-58],[-32,-14]],[[-18,-44],[-33,-14]]].forEach(([a,b],li)=>{const n=li===2?6:10;for(let i=1;i<n;i++){const q=i/n;const bx=a[0]+(b[0]-a[0])*q,by=a[1]+(b[1]-a[1])*q+Math.sin(q*Math.PI)*1.2;const on=Math.sin(t/320+i*1.9+li)>-.3;
      disc(c,bx,by,.55,on?XMAS_COLS[(i+li)%5]:'rgba(255,255,255,.35)');if(on&&nt)lamp(c,bx,by,3,.3,'255,230,160');}});}
  }catch(e){console.warn('ship winter',e);}c.restore();};

/* ---------- the hideout: snow on the skull, fairy lights round it, fireflies at night ---------- */
addLayer('world','hideSnow',(c,t)=>{c.fillStyle='#FFFFFF';c.beginPath();c.moveTo(108,81);c.quadraticCurveTo(150,30,192,79);c.quadraticCurveTo(184,74,178,76);c.quadraticCurveTo(172,72,166,76);c.quadraticCurveTo(160,64,150,66);c.quadraticCurveTo(140,64,134,74);c.quadraticCurveTo(126,70,120,77);c.quadraticCurveTo(115,74,110,80);c.closePath();c.fill();
  c.fillStyle='rgba(170,200,220,.35)';c.beginPath();c.moveTo(134,74);c.quadraticCurveTo(140,66,150,66);c.quadraticCurveTo(142,69,138,75);c.closePath();c.fill();},{z:-10,scenes:['islet'],when:()=>isWinter()});
addLayer('world','hideLights',(c,t)=>{const P0=[112,86],P1=[150,46],P2=[188,84];for(let i=1;i<16;i++){const u=i/16;const x=(1-u)*(1-u)*P0[0]+2*(1-u)*u*P1[0]+u*u*P2[0],y=(1-u)*(1-u)*P0[1]+2*(1-u)*u*P1[1]+u*u*P2[1]+Math.sin(u*Math.PI*6)*.8;
  const on=Math.sin(t/300+i*1.7)>-.3;disc(c,x,y,.9,on?XMAS_COLS[i%5]:'rgba(255,255,255,.35)');if(on&&isNight())lamp(c,x,y,4,.35,'255,230,160');}},{z:-9,scenes:['islet'],when:()=>isXmas()});
addLayer('world','fireflies',(c,t)=>{const sp=THEME.reduced?.3:1;for(let i=0;i<14;i++){const x=40+((i*53.3+Math.sin(t*sp/1700+i)*16)%240),y=95+((i*29.1)%55)+Math.sin(t*sp/900+i*2)*5;const a=.5+.5*Math.sin(t*sp/260+i*3);
  c.globalAlpha=a;lamp(c,x,y,3.2,.5,'200,255,140');disc(c,x,y,.45,'#F4FFB0');}c.globalAlpha=1;},{z:2,scenes:['islet'],when:()=>isNight()});

/* ---------- Gary in a Santa hat ---------- */
const _gull17=drawGull;drawGull=function(c,x,y,t){_gull17.apply(this,arguments);if(!isXmas())return;c.fillStyle='#D9363E';c.beginPath();c.moveTo(x+5.4,y+.9);c.quadraticCurveTo(x+6.2,y-2.4,x+4.4,y-2.9);c.quadraticCurveTo(x+7.6,y-1.6,x+8.6,y+.6);c.closePath();c.fill();
  rr(c,x+5.1,y+.3,3.8,.9,.45,'#FFFFFF');disc(c,x+4.3,y-2.9,.62,'#FFFFFF');};
