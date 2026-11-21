/* ============================== THE HIDEOUT, PAINTED (21 Nov) ==============================
   Same hideout, same upgrades, same spots for your items and the same tap areas, redrawn as a mossy, faceted rock island:
   cliffs and palm-topped terraces behind, the skull carved into the stone with steps up to its glowing mouth, skull
   banners once the torches are lit (Skull Cove, level 20), a bright waterfall with mist, sand and grass in front,
   mossy rocks in the shallows. The rest of the hideout code is the original, so every stage still appears on cue. */
let ART_ISLE_LATE=null;
const HIDE_C={stone:'#7E8AA6',stoneL:'#A2AECA',stoneD:'#596480',moss:'#6FB04A',mossD:'#4C8A36',sand:'#EAD4A2',sandD:'#D2B67E',grass:'#78B652',grassD:'#5A963E'};
function hidePalm(c,x,y,h=14,t=0){const sw=Math.sin(t/900+x)*.7;const trunk='#8A5E3A';c.strokeStyle=trunk;c.lineWidth=Math.max(1.2,h*.1);c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+2,y-h/2,x+1+sw,y-h);c.stroke();
  c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=.4;for(let k=1;k<5;k++){const u=k/5;c.beginPath();c.moveTo(x+u*2-1,y-h*u);c.lineTo(x+u*2+1,y-h*u);c.stroke();}
  const tx=x+1+sw,ty=y-h;[-170,-140,-110,-75,-40,-10,15].forEach((a,i)=>{const r=a*Math.PI/180+Math.sin(t/1100+i)*.05,ex=tx+Math.cos(r)*h*.55,ey=ty+Math.sin(r)*h*.45+h*.22;
    c.fillStyle=i%2?'#4E9A3A':'#62B048';c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo((tx+ex)/2,ty-h*.2,ex,ey);c.quadraticCurveTo((tx+ex)/2,ty-h*.04,tx,ty);c.fill();});disc(c,tx-.6,ty+1,1.1,'#6A4A2A');disc(c,tx+1.2,ty+1.2,1.1,'#6A4A2A');}
function hideFacet(c,pts,col,light){c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();if(light){c.fillStyle=light;c.beginPath();light.pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}}
function hideMoss(c,pts){c.fillStyle=HIDE_C.moss;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.fillStyle=HIDE_C.mossD;for(let i=0;i<pts.length-1;i+=2){const [x,y]=pts[i];c.beginPath();c.moveTo(x,y);c.lineTo(x+1.6,y+3+(i%3));c.lineTo(x+3.2,y);c.closePath();c.fill();}}
function hideGround(c,t,stg){const C_=HIDE_C;
  // cliffs behind: left and right shoulders and a tall back peak, each with a mossy, palm-topped terrace
  c.fillStyle=C_.stoneD;c.beginPath();c.moveTo(80,150);c.lineTo(86,96);c.lineTo(98,74);c.lineTo(112,70);c.lineTo(122,88);c.lineTo(124,150);c.closePath();c.fill();
  c.fillStyle=C_.stone;c.beginPath();c.moveTo(80,150);c.lineTo(86,96);c.lineTo(98,74);c.lineTo(102,150);c.closePath();c.fill();hideMoss(c,[[95,76],[98,72],[112,68],[118,76],[110,78],[100,79]]);
  c.fillStyle=C_.stoneD;c.beginPath();c.moveTo(186,150);c.lineTo(194,80);c.lineTo(210,60);c.lineTo(228,58);c.lineTo(242,78);c.lineTo(248,150);c.closePath();c.fill();
  c.fillStyle=C_.stone;c.beginPath();c.moveTo(186,150);c.lineTo(194,80);c.lineTo(210,60);c.lineTo(214,150);c.closePath();c.fill();hideMoss(c,[[206,62],[210,58],[228,56],[238,66],[226,66],[214,67]]);
  c.fillStyle=shadeHex(C_.stoneD,.9);c.beginPath();c.moveTo(126,60);c.lineTo(140,30);c.lineTo(158,24);c.lineTo(174,34);c.lineTo(182,60);c.closePath();c.fill();hideMoss(c,[[138,32],[146,24],[160,22],[172,30],[160,32],[148,31]]);
  hidePalm(c,104,74,14,t+300);hidePalm(c,232,60,13,t+700);hidePalm(c,166,26,12,t+100);hidePalm(c,92,80,10,t+500);
  // sand and a grassy terrace in front, with a line of surf
  c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(172,153.4,150+Math.sin(t/600),27,0,0,TAU);c.fill();
  c.fillStyle=C_.sandD;c.beginPath();c.ellipse(172,151.2,143,25,0,0,TAU);c.fill();c.fillStyle=C_.sand;c.beginPath();c.ellipse(172,150,141,23.4,0,0,TAU);c.fill();
  c.fillStyle=C_.grassD;c.beginPath();c.ellipse(178,138.6,114,12.4,0,0,TAU);c.fill();c.fillStyle=C_.grass;c.beginPath();c.ellipse(178,136.6,106,10,0,0,TAU);c.fill();
  for(let i=0;i<26;i++){const x=78+i*8+(i%3),y=136+((i*7)%9)-4;c.fillStyle=i%2?C_.grassD:'#8ACB60';c.beginPath();c.moveTo(x,y+2);c.lineTo(x+1,y-1.6);c.lineTo(x+2,y+2);c.closePath();c.fill();}
  for(let i=0;i<9;i++){const px=52+i*29+(i*13)%9,py=158+((i*7)%9);disc(c,px,py,.8,C_.sandD);if(i%3===0){ell(c,px+6,py+2,2.2,1.2,'#F4D7C8');disc(c,px+6,py+1.8,.5,'#E9B8A0');}}
  // mossy rocks in the shallows
  [[8,170,14,10],[300,168,16,12],[262,176,10,7]].forEach(([x,y,w,h])=>{c.fillStyle=C_.stoneD;c.beginPath();c.moveTo(x-w,y+3);c.lineTo(x-w*.7,y-h*.6);c.lineTo(x-w*.1,y-h);c.lineTo(x+w*.6,y-h*.7);c.lineTo(x+w,y+3);c.closePath();c.fill();c.fillStyle=C_.stone;c.beginPath();c.moveTo(x-w,y+3);c.lineTo(x-w*.7,y-h*.6);c.lineTo(x-w*.1,y-h);c.lineTo(x-w*.2,y+3);c.closePath();c.fill();
    hideMoss(c,[[x-w*.7,y-h*.6],[x-w*.1,y-h-1],[x+w*.6,y-h*.7],[x+w*.2,y-h*.55],[x-w*.4,y-h*.45]]);c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=.7;c.beginPath();c.ellipse(x,y+3,w*1.05+Math.sin(t/500+x),2,0,0,TAU);c.stroke();});
  hidePalm(c,36,147,21,t);hidePalm(c,226,134,15,t+900);hidePalm(c,300,150,20,t+500);hidePalm(c,272,153,17,t+200);}
function hideRock(c,t,stg){const C_=HIDE_C;const P=[[104,141.5],[99,112],[106,86],[120,64],[138,51],[160,48],[178,57],[192,76],[201,104],[198,141.5]];
  ell(c,154,141.5,54,6,'rgba(0,0,0,.16)');c.fillStyle=C_.stone;c.beginPath();P.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();
  c.save();c.clip();c.fillStyle=C_.stoneL;c.beginPath();c.moveTo(99,141.5);c.lineTo(99,112);c.lineTo(106,86);c.lineTo(120,64);c.lineTo(138,51);c.lineTo(130,78);c.lineTo(118,104);c.lineTo(116,141.5);c.closePath();c.fill();
  c.fillStyle=C_.stoneD;c.beginPath();c.moveTo(178,57);c.lineTo(192,76);c.lineTo(201,104);c.lineTo(198,141.5);c.lineTo(184,141.5);c.lineTo(188,104);c.lineTo(180,80);c.closePath();c.fill();
  c.strokeStyle='rgba(40,46,70,.35)';c.lineWidth=.6;c.beginPath();c.moveTo(130,78);c.lineTo(150,70);c.lineTo(172,76);c.moveTo(118,104);c.lineTo(124,118);c.moveTo(180,80);c.lineTo(184,96);c.moveTo(152,58);c.lineTo(148,68);c.lineTo(152,74);c.stroke();c.restore();
  hideMoss(c,[[116,68],[126,58],[140,50],[160,47],[178,56],[186,66],[174,63],[160,59],[146,60],[132,64]]);disc(c,126,66.5,2.4,C_.moss);disc(c,170,64.6,2,C_.moss);
  hideMoss(c,[[100,112],[104,104],[110,106],[108,112]]);hideMoss(c,[[194,92],[198,86],[201,96],[197,98]]);
  // the waterfall off the skull's shoulder, with mist where it lands
  const wf=c.createLinearGradient(0,79,0,141);wf.addColorStop(0,'rgba(170,225,250,.95)');wf.addColorStop(1,'rgba(120,200,240,.95)');c.fillStyle=wf;c.beginPath();c.moveTo(186,79);c.quadraticCurveTo(195,83,197,100);c.lineTo(203,141);c.lineTo(193,141);c.lineTo(190.6,100);c.quadraticCurveTo(190,88,184,83);c.closePath();c.fill();
  for(let i=0;i<10;i++){const q=((t/600)+i/10)%1;line(c,192.2+i%4*2.6,86+q*52,192.8+i%4*2.6,91+q*52,'rgba(255,255,255,.95)',.7);}
  ell(c,199,143,15,4,'#7FD3E6');c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=.6;c.beginPath();c.ellipse(199,143,15+Math.sin(t/500),4,0,0,TAU);c.stroke();
  for(let i=0;i<8;i++){const q=((t/900)+i/8)%1;disc(c,190+i*3,141-q*9,1.8+q*2.2,`rgba(255,255,255,${.5*(1-q)})`);}}
function hideStairs(c){const C_=HIDE_C;for(let k=0;k<4;k++){const y=141.5+k*3,w=26+k*5;c.fillStyle=k%2?C_.stoneL:shadeHex(C_.stoneL,.92);c.fillRect(150-w/2,y,w,3.2);c.fillStyle='rgba(40,46,70,.25)';c.fillRect(150-w/2,y+2.6,w,.6);}}
function hideBanners(c,t){[[116,92],[186,98]].forEach(([x,y],k)=>{const sw=Math.sin(t/900+k)*.6;R(c,x-6,y-1,12,1,'#5A3A22');c.fillStyle='#7A2232';c.beginPath();c.moveTo(x-5,y);c.lineTo(x+5,y);c.lineTo(x+5+sw,y+16);c.lineTo(x+sw,y+13);c.lineTo(x-5+sw,y+16);c.closePath();c.fill();
  c.fillStyle='rgba(0,0,0,.18)';c.fillRect(x+2,y,3,15);try{drawSymbol(c,'skull',x+sw*.5,y+7,.7,'#F2E8D8');}catch(e){disc(c,x,y+6,2,'#F2E8D8');}});}
function artIsletDraw(c,t,pid){
  if(!G)return;const pl=S.players[pid]||{};const me=G.players[pid];const fx=pl.effect;const act=activeForfeitsFor(pid);const lv=me?.maxLevel||1;const stg=hideStage(lv);const nx=HIDE_STAGES[stg+1];
  sky(c,t,{aurora:fx==='fx_aurora',shooting:fx==='fx_shooting',rainbow:fx==='fx_rainbow',fireworks:fx==='fx_fireworks'});
  sea(c,104,t,{glow:fx==='fx_biolum'});
  if(fx==='fx_whale')whale(c,t);
  drawShip(c,44,126,.4,pl,t,{captain:false,phase:1.3});hit(26,98,38,30,'Your ship, at anchor','Parked legally, for once. Customise it from the Ship view.');
  const night=SUN.night,lap=Math.sin(t/900)*1.4;
  hideGround(c,t,stg);
  // dock and rowboat (level 5)
  if(stg>=1){for(let i=0;i<4;i++)R(c,10+i*11,150,1.6,9,'#7A5434');rr(c,6,148,46,3.2,1,'#B98552');for(let i=0;i<7;i++)R(c,9+i*6,148,.4,3.2,'rgba(0,0,0,.15)');
    const b=Math.sin(t/600)*.8;line(c,12,151,15,161+b,'rgba(90,60,40,.6)',.3);c.save();c.translate(16,164+b);c.rotate(Math.sin(t/800)*.05);c.fillStyle='#A8704A';c.beginPath();c.moveTo(-10,-3);c.lineTo(10,-3);c.quadraticCurveTo(9,3,5,3);c.lineTo(-6,3);c.quadraticCurveTo(-10,2,-10,-3);c.fill();R(c,-10,-3.6,20,1,'#6B4429');R(c,-3,-2.6,6,.8,'#6B4429');line(c,2,-3,9,-8,'#B98552',.7);c.restore();
    hit(4,142,50,28,'The dock','Unlocked at level 5. The rowboat is called "Plausible Deniability".');}
  hideRock(c,t,stg);
  hit(184,78,24,68,'The waterfall','Fresh water, a rainbow on good days, and somewhere to rinse the glitter cannon.');
  // eyes, nose, mouth cave
  const lit=stg>=3;
  [[133,93],[167,93]].forEach(([ex,ey],k)=>{ell(c,ex,ey,9.6,10.6,'#3B3842');ell(c,ex+.4,ey+1,8.4,9.2,'#211E29');if(lit){const fl=.75+.25*Math.sin(t/110+k*3);glowAt(c,ex,ey+3,8.4,'255,150,60',.85*fl);flame(c,ex,ey+8.6,.78,t,k*5);}else disc(c,ex+2,ey+2,1,'rgba(255,255,255,.08)');});
  poly(c,[[150,101],[146,111],[150,108.6],[154,111]],'#2A2731');
  c.fillStyle='#1B1924';c.beginPath();c.moveTo(128,141.5);c.lineTo(128,124);c.quadraticCurveTo(150,110,172,124);c.lineTo(172,141.5);c.closePath();c.fill();
  if(lit)glowAt(c,150,138,19,'255,170,80',.55);
  for(let i=0;i<6;i++){const tx=131+i*6.4,ty=123.6-Math.sin((i+.5)/6*Math.PI)*5.2;poly(c,[[tx,ty],[tx+5.4,ty],[tx+2.7,ty+5.6+((i*7)%3)]],'#E6E0D2');}
  for(let i=0;i<5;i++){const tx=131.5+i*8;poly(c,[[tx,141.5],[tx+5,141.5],[tx+2.5,136+(i%2)]],'#CFC8BA');}
  hit(106,44,90,76,HIDE_STAGES[stg][1],`${HIDE_STAGES[stg][2]} Hideout stage ${stg+1} of ${HIDE_STAGES.length}.${nx?` Next: ${nx[1]} at level ${nx[0]}.`:' Fully upgraded.'}`);
  if(stg>=6||(me?.prest||0)>=1){const cy=46+Math.sin(t/900)*.5;poly(c,[[139,cy+6],[139,cy-3],[144.5,cy+1.5],[150,cy-6],[155.5,cy+1.5],[161,cy-3],[161,cy+6]],'#F2C462');R(c,139,cy+4.6,22,2,'#D99A17');disc(c,150,cy+1.6,1.3,'#E0457B');disc(c,143,cy+2.6,.9,'#5DBE9C');disc(c,157,cy+2.6,.9,'#4A7EC2');if(Math.sin(t/300)>.6){line(c,150,cy-9.5,150,cy-6.5,'#FFF6CF',.5);line(c,148.5,cy-8,151.5,cy-8,'#FFF6CF',.5);}}
  // torches by the cave (level 20)
  if(lit)[[122,140],[178,140]].forEach(([x,y],k)=>{R(c,x-.6,y-11,1.2,11,'#6B4429');rr(c,x-1.4,y-12.4,2.8,2,.6,'#3F3A30');flame(c,x,y-12,.62,t,k*9+2);});
  hideStairs(c);if(lit)hideBanners(c,t);
  // cannon battery (level 40)
  if(stg>=5){rr(c,82,133,28,8,2,'#9B958E');for(let i=0;i<4;i++)R(c,83+i*7.4,130.6,4.2,3,'#A8A29A');R(c,82,138,28,1,'rgba(0,0,0,.12)');
    [[80,131],[94,128.6]].forEach(([x,y])=>{rr(c,x-8,y-1.7,13,3.4,1.7,'#2E2B33');rr(c,x-9,y-2.2,2,4.4,.8,'#3F3A40');disc(c,x+2,y+2.2,2.2,'#7A4E30');disc(c,x+2,y+2.2,.8,'#3F3A30');});for(let i=0;i<3;i++)disc(c,101+i*2.4,139.4-(i===1?2:0),1.2,'#2E2B33');
    hit(72,124,40,18,'Cannon battery','Unlocked at level 40. Purely decorative. Mostly.');}
  // lookout tower (level 10)
  if(stg>=2){const tx=252;line(c,tx-7,147,tx-5,104,'#8A5E38',1.6);line(c,tx+7,147,tx+5,104,'#8A5E38',1.6);line(c,tx-6.4,134,tx+6,118,'#7A4E30',.8);line(c,tx+6.4,134,tx-6,118,'#7A4E30',.8);
    line(c,tx-1.6,147,tx-1.6,105,'#B98552',.5);line(c,tx+1.6,147,tx+1.6,105,'#B98552',.5);for(let i=0;i<8;i++)line(c,tx-1.6,144-i*5.2,tx+1.6,144-i*5.2,'#B98552',.6);
    rr(c,tx-11,102,22,3,1,'#B98552');for(let i=0;i<5;i++)R(c,tx-10+i*4.8,97,.7,5,'#8A5E38');R(c,tx-10.4,96.6,20.8,.8,'#8A5E38');
    rr(c,tx-6,90,12,12,1,'#C79A6A');rr(c,tx-2,93.4,4,4.4,.8,night?'#FFD98A':'#3F5160');poly(c,[[tx-10.5,91],[tx,80.5],[tx+10.5,91]],'#D9B25F');line(c,tx-5,86,tx-7.5,90.6,'rgba(0,0,0,.14)',.4);line(c,tx+1,84,tx-.5,90.6,'rgba(0,0,0,.14)',.4);line(c,tx+6,87,tx+5,90.6,'rgba(0,0,0,.14)',.4);
    R(c,tx-.4,68,.8,13,'#7A4E30');drawFlag(c,tx+.4,68.4,pl.flag||SHIP_DEFAULT.flag,t,11,7);
    hit(tx-12,66,24,82,'Lookout tower','Unlocked at level 10. Flies whichever flag you have equipped. Excellent for spotting pets and avoiding admin.');}
  // rope bridge and hammock (level 30)
  if(stg>=4){const P0=[185,75.5],P1=[241,101.5];const pt=q=>[P0[0]+(P1[0]-P0[0])*q,P0[1]+(P1[1]-P0[1])*q+Math.sin(q*Math.PI)*(9+Math.sin(t/800)*.7)];
    c.strokeStyle='#8A6A45';c.lineWidth=.6;[0,-4].forEach(dy=>{c.beginPath();for(let i=0;i<=14;i++){const[a,b]=pt(i/14);i?c.lineTo(a,b+dy):c.moveTo(a,b+dy);}c.stroke();});
    for(let i=1;i<14;i++){const[a,b]=pt(i/14);line(c,a,b,a,b-4,'#8A6A45',.35);line(c,a-1.5,b+.3,a+1.5,b+.3,'#C79A6A',1);}
    const sw=Math.sin(t/1100)*1.2;c.strokeStyle='#E06034';c.lineWidth=2.6;c.lineCap='round';c.beginPath();c.moveTo(273.5,140);c.quadraticCurveTo(286+sw,153,300.5,137);c.stroke();c.strokeStyle='#FFF4DE';c.lineWidth=.6;c.setLineDash([1.6,2.2]);c.stroke();c.setLineDash([]);
    hit(270,132,34,22,'The hammock','Unlocked at level 30. Officially a "strategy station".');}
  // lean-to made from your sails, and the campfire
  const sl=it(pl.sail)||it('sail_canvas');poly(c,[[44,149],[62,127],[79,149]],sl.col);poly(c,[[62,127],[79,149],[71,149]],'rgba(0,0,0,.14)');poly(c,[[57,149],[62,137],[67,149]],'#3A2F3A');line(c,62,125,62,149,'#7A4E30',.8);rr(c,74,146,5,4,1,'#A8704A');rr(c,79.6,147,4,3,1,'#8A5A3A');hit(44,125,36,25,'The lean-to','Stitched from your current sails. Change your sails and the tent changes too.');
  const fx0=112,fy0=158;ell(c,fx0,fy0+1,7.4,2.2,'rgba(0,0,0,.15)');for(let i=0;i<6;i++){const a=i/6*TAU;disc(c,fx0+Math.cos(a)*5.6,fy0+Math.sin(a)*1.9+.4,1.1,'#9B958E');}
  line(c,fx0-4,fy0,fx0+4,fy0-1.4,'#7A4E30',1.6);line(c,fx0+4,fy0,fx0-4,fy0-1.4,'#6B4429',1.6);
  for(let i=0;i<4;i++){const q=((t/2600)+i/4)%1;disc(c,fx0+Math.sin(q*3+i)*3+q*8*wind(t),fy0-12-q*30,1.6+q*3.2,`rgba(240,240,240,${.2*(1-q)})`);}
  flame(c,fx0,fy0-.6,1.2,t);for(let i=0;i<5;i++){const q=((t/1300)+i/5)%1;disc(c,fx0+Math.sin(q*6+i)*3,fy0-8-q*22,.45,`rgba(255,${200-q*80|0},90,${1-q})`);}
  hit(fx0-8,fy0-14,16,18,'The campfire','Never goes out. Nobody knows who keeps feeding it.');
  // treasure pile grows with your doubloons
  const bal=me?.balance||0;const tz=bal>=5000?3:bal>=1000?2:bal>=150?1:0;
  if(tz){ell(c,160,148.4,6+tz*3.6,1.8+tz*.8,'#D99A17');ell(c,160,147.6,5.4+tz*3.4,1.5+tz*.9,'#F2C462');for(let i=0;i<tz*8;i++){const a=i*2.4,q=((i*5)%10)/10,d=q*(5+tz*3);disc(c,160+Math.cos(a)*d,147.2-(1-q)*(1+tz*1.5)-Math.abs(Math.sin(a))*.8,1,i%3?'#F2C462':'#FFE08A');}}
  rr(c,155,141.4,10,6,1,'#A8704A');R(c,155,143.8,10,.8,'#6B4429');R(c,159.4,143,1.2,2.2,'#F2C462');c.fillStyle='#8A5A3A';c.beginPath();c.ellipse(160,141.4,5,2.6,0,Math.PI,0);c.fill();if(tz)ell(c,160,141.4,4,1.1,'#F2C462');
  if(tz)for(let i=0;i<3;i++){const tw=Math.sin(t/240+i*2.2);if(tw>.55){const gx=153+i*7,gy=144-i%2*3-tz;line(c,gx-1.6,gy,gx+1.6,gy,'#FFF6CF',.4);line(c,gx,gy-1.6,gx,gy+1.6,'#FFF6CF',.4);}}
  hit(148,136,24,16,'The hoard',`Grows with your purse: you hold ${fmtN(bal)} doubloons. ${tz<3?'It gets bigger at '+fmtN([150,1000,5000][tz])+'.':'It cannot physically get bigger.'}`);
  // signpost
  line(c,222,160,222,149,'#7A4E30',1);rr(c,216,148,13,5,1,'#C79A6A');poly(c,[[229,148],[232,150.5],[229,153]],'#C79A6A');line(c,218,150.5,227,150.5,'rgba(0,0,0,.25)',.4);
  hit(214,146,20,16,nx?`Next upgrade: ${nx[1]}`:'Hideout complete',nx?`${nx[2]} Arrives at level ${nx[0]} (you are level ${lv}).`:'Every stage unlocked. The estate agent would call it "characterful".');
  // decor, captain, companions (drawn at 2x like the old islet so every item keeps its size)
  c.save();c.scale(2,2);
  (pl.decor||[]).forEach((id,i)=>{if(id&&HIDE_SPOTS[i]){c.save();c.translate(HIDE_SPOTS[i][0],HIDE_SPOTS[i][1]);c.scale(.72,.72);drawDecor(c,id,0,0,t+i*300);c.restore();}});
  if(act.some(f=>f.result==='gnomes'))[[44,76],[100,78],[122,76]].forEach(([x,y])=>drawGnome(c,x,y));
  if(act.some(f=>f.result==='statue')){rr(c,104,74,20,4,1.5,'#C9C3B6');c.save();c.translate(106,52);c.scale(2,2);drawKeeper(c,0,0,other(pid),S.players[other(pid)],0);c.restore();}
  const ch=act.some(f=>f.result==='chicken'),dance=act.some(f=>f.result==='dance');
  const kx=61,ky=66;ell(c,kx+4,ky+12.4,5,1.1,'rgba(0,0,0,.14)');drawKeeper(c,kx,ky,pid,pl,t,{chicken:ch,dance});if(pl.pet&&PET_BY_ID[pl.pet])drawPet(c,PET_BY_ID[pl.pet],kx+13,ky+12.5,t,.7);
  if(act.some(f=>f.result==='gull'))drawGull(c,kx-13+Math.sin(t/700)*3,ky+6,t);
  const ma=t/1200;drawMoth(c,kx+4+Math.cos(ma)*16,ky-8+Math.sin(ma*1.7)*5,me?.moth||0,t,pl.moth);
  c.restore();
  if(act.some(f=>f.result==='statue'))txt(c,(C().players[other(pid)]?.name||'Rival')+' the Great',228,92,'#3F5160',7,'center');
  if(fx==='fx_dolphins')dolphins(c,t);
  if(fx==='fx_snow')for(let i=0;i<60;i++)disc(c,(i*53+t/40)%W,(i*29+t/25)%H,.8,'#FFFFFF');
  // night: fire, torches and fireflies do the lighting
  // the lights go on after the colour grade, so the fire and torches glow warm instead of being tinted blue
  ART_ISLE_LATE=()=>{if(nightVeil(c,.22)){lamp(c,fx0,fy0-6,20,.38,'255,150,70');if(lit){lamp(c,122,128,13,.7);lamp(c,178,128,13,.7);lamp(c,133,96,13,.6,'255,150,60');lamp(c,167,96,13,.6,'255,150,60');lamp(c,150,134,16,.3);}if(stg>=2)lamp(c,252,95,9,.7);if(tz)lamp(c,160,146,8+tz*2,.35,'255,220,120');}
  if(fx==='fx_fireflies')for(let i=0;i<14;i++){const a=t/1500+i;const on=Math.sin(t/300+i*1.3)>0;const x=40+((i*37)%250)+Math.sin(a)*6,y=96+((i*23)%44)+Math.cos(a*1.3)*4;disc(c,x,y,on?.8:.4,on?'#F4FF9A':'#C8D27A');if(on)lamp(c,x,y,3.4,.5,'230,255,140');}};
  txt(c,HIDE_STAGES[stg][1]+(nx?`  ·  next upgrade at level ${nx[0]}`:''),160,5,'#3F5160',7,'center');
}
