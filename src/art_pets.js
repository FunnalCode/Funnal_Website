/* ============================== PETS ============================== */
// x,y = feet centre. Pets are ~10 units tall at s=1. Rarer pets get auras, sparkles and particles.
function drawPet(c,pet,x,y,t,s=1,opts={}){
  if(!pet)return;const sil=opts.silhouette;const C1=sil?'#C9BFA8':pet.col,C2=sil?'#B9AF98':pet.col2,ink=sil?'#B0A68F':'#3F3A30';
  const bob=Math.abs(Math.sin(t/260))*(opts.still?0:1.2);const rar=pet.rar;
  c.save();c.translate(x,y);c.scale(s,s);
  if(!sil){if(rar==='mythic'){const g=c.createRadialGradient(0,-5,0,0,-5,14);g.addColorStop(0,`hsla(${(t/12)%360},90%,75%,.55)`);g.addColorStop(1,'hsla(0,0%,100%,0)');c.fillStyle=g;c.beginPath();c.arc(0,-5,14,0,TAU);c.fill();}
    else if(rar==='legendary')glowAt(c,0,-5,12,'255,214,110',.45);else if(rar==='epic')glowAt(c,0,-5,10,'190,150,255',.3);}
  ell(c,0,.4,5,1.1,'rgba(0,0,0,.12)');
  c.translate(0,-bob);
  const eye=(ex,ey,r=.55)=>{disc(c,ex,ey,r,ink);if(!sil)disc(c,ex+.18,ey-.2,r*.35,'#fff');};
  const blush=(bx,by)=>{if(sil)return;c.globalAlpha=.45;disc(c,bx,by,.6,'#F49A9A');c.globalAlpha=1;};
  const sp=pet.sp;
  if(sp==='dog'||sp==='cat'||sp==='bunny'||sp==='hedgehog'){
    // tail
    if(pet.x==='foxtail'){c.fillStyle=C1;c.beginPath();c.ellipse(-5.2,-3.6,1.8,3.4,-.7+Math.sin(t/300)*.2,0,TAU);c.fill();disc(c,-6.6,-5.8,1.1,'#FFFFFF');}
    else if(sp!=='bunny'&&sp!=='hedgehog'){c.strokeStyle=C1;c.lineWidth=1.3;c.lineCap='round';c.beginPath();c.moveTo(-3.6,-3);c.quadraticCurveTo(-6,-4+Math.sin(t/200)*1.5,-5.4,-6.4);c.stroke();}
    else if(sp==='bunny')disc(c,-3.8,-3,1.4,'#FFFFFF');
    // body
    if(sp==='hedgehog'){c.fillStyle=C1;c.beginPath();for(let i=0;i<13;i++){const a=Math.PI+i/12*Math.PI;const r=i%2?4.6:5.8;c.lineTo(Math.cos(a)*r*1.1-.6,-2.6+Math.sin(a)*r);}c.closePath();c.fill();}
    ell(c,-.4,-2.6,4,2.8,sp==='hedgehog'?C2:C1);ell(c,.4,-2,2.4,1.8,C2);
    rr(c,-3,-1.2,1.3,1.6,.6,C1);rr(c,1.6,-1.2,1.3,1.6,.6,C1);
    if(pet.x==='spots'&&!sil){disc(c,-2,-3.4,.7,C2);disc(c,.6,-3.8,.5,C2);disc(c,-1,-2,.45,C2);}
    if(pet.x==='stripes'&&!sil){for(let i=0;i<3;i++)rr(c,-3+i*1.4,-5,.5,2,.25,C2==='#FFFFFF'?shade(C1):C2);}
    // head
    const hx=3,hy=-6;disc(c,hx,hy,3.2,sp==='hedgehog'?C2:C1);
    if(sp==='dog'){if(pet.ear==='flop'){ell(c,hx-2.6,hy-.4,1,2.2,shade(C1),.3);ell(c,hx+2.6,hy-.4,1,2.2,shade(C1),-.3);}else{poly(c,[[hx-2.8,hy-1.6],[hx-2.4,hy-4.8],[hx-.8,hy-2.6]],C1);poly(c,[[hx+2.8,hy-1.6],[hx+2.4,hy-4.8],[hx+.8,hy-2.6]],C1);}
      ell(c,hx+.4,hy+1.3,1.7,1.2,C2);disc(c,hx+.4,hy+.6,.6,ink);}
    if(sp==='cat'){const pt=pet.ear==='round';if(pt){disc(c,hx-2.3,hy-2.4,1.1,C1);disc(c,hx+2.3,hy-2.4,1.1,C1);}else{poly(c,[[hx-3,hy-1],[hx-2.4,hy-4.6],[hx-.6,hy-2.6]],C1);poly(c,[[hx+3,hy-1],[hx+2.4,hy-4.6],[hx+.6,hy-2.6]],C1);}
      ell(c,hx,hy+1.2,1.6,1,C2);disc(c,hx,hy+.6,.4,'#E07A7A');}
    if(sp==='bunny'){ell(c,hx-1.2,hy-4.6,.9,2.8,C1,-.15);ell(c,hx+1.2,hy-4.6,.9,2.8,C1,.15);ell(c,hx-1.2,hy-4.4,.4,1.8,C2,-.15);ell(c,hx+1.2,hy-4.4,.4,1.8,C2,.15);disc(c,hx,hy+.8,.4,C2);}
    if(sp==='hedgehog')disc(c,hx+2.8,hy+.6,.55,ink);
    eye(hx-1.2,hy-.2);eye(hx+1.4,hy-.2);blush(hx-2,hy+1);blush(hx+2.2,hy+1);
    if(pet.x==='tricorn'&&!sil){poly(c,[[hx-3.6,hy-2.4],[hx,hy-5.6],[hx+3.6,hy-2.4],[hx,hy-3.2]],'#2E2B33');R(c,hx-3.2,hy-2.8,6.4,.4,'#DDA94D');}
    if(pet.x==='bandana'&&!sil){rr(c,hx-2,hy+2.2,4,1,.5,'#D9485F');}
    if(pet.x==='scarf'&&!sil){rr(c,hx-2.2,hy+2.2,4.4,1.1,.5,'#D9485F');rr(c,hx-2,hy+2.8,1,2,.5,'#D9485F');}
    if(pet.x==='lantern'&&!sil){R(c,hx+3.2,hy+1,.3,2,'#7A4E30');glowAt(c,hx+3.4,hy+3.6,3,'255,220,130',.6);rr(c,hx+2.7,hy+2.8,1.4,1.8,.5,'#F2C462');}
    if(pet.x==='flame'&&!sil){for(let i=0;i<4;i++){const fx=-3+i*1.6;poly(c,[[fx-.8,-5],[fx+.2,-8-Math.sin(t/90+i)*1.2],[fx+.9,-5]],i%2?'#FFD45A':'#F27A3A');}}
    if(pet.x==='embers'&&!sil)for(let i=0;i<4;i++){const p=((t/900)+i/4)%1;disc(c,-2+i*1.5,-5-p*7,.4*(1-p)+.1,'#F2A33A');}
  }
  else if(sp==='bird'){ell(c,0,-3.6,3.6,4,C1);ell(c,.4,-2.6,2.4,2.8,C2);disc(c,.2,-7.6,2.6,C1);
    if(pet.x==='penguin'){ell(c,.6,-7.2,1.8,1.6,C2);poly(c,[[1.6,-6.8],[3,-6.4],[1.6,-6]],'#F2A33A');R(c,-1.4,0,1,.6,'#F2A33A');R(c,.6,0,1,.6,'#F2A33A');}
    else if(pet.x==='duck'){poly(c,[[2,-7.4],[4,-7],[2,-6.4]],'#F2A33A');}
    else{disc(c,-.8,-7.8,1.1,C2);disc(c,1.4,-7.8,1.1,C2);poly(c,[[.2,-7.2],[.8,-6.2],[-.4,-6.2]],'#F2A33A');poly(c,[[-2.2,-9.2],[-1.6,-10.6],[-.8,-9.6]],C1);poly(c,[[2.6,-9.2],[2,-10.6],[1.2,-9.6]],C1);}
    eye(-.8,-7.8,.45);eye(1.4,-7.8,.45);ell(c,-2.6,-3.6,1.2,2.6,shade(C1),.3);
    if(pet.x==='lantern'&&!sil){glowAt(c,3.6,-3,3,'255,220,130',.6);rr(c,3,-4,1.4,1.8,.5,'#F2C462');}}
  else if(sp==='dragon'){
    const fl=Math.sin(t/140)*.5;c.fillStyle=sil?C2:pet.col2;[-1,1].forEach(sd=>{c.save();c.translate(-.6,-5.6);c.rotate(sd*(.5+fl*.4)-Math.PI/2*0);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(sd*-1,-6,sd*-5.6,-5.4);c.quadraticCurveTo(sd*-4,-2.6,sd*-4.4,-.6);c.closePath();c.fill();c.restore();});
    c.strokeStyle=C1;c.lineWidth=1.4;c.lineCap='round';c.beginPath();c.moveTo(-3.6,-2.6);c.quadraticCurveTo(-7,-2,-7,-5);c.stroke();poly(c,[[-7.6,-5],[-7,-6.6],[-6.2,-5]],C1);
    ell(c,-.6,-3.4,3.8,3,C1);ell(c,0,-2.6,2.2,2,C2);rr(c,-3,-1.4,1.4,1.8,.6,C1);rr(c,1,-1.4,1.4,1.8,.6,C1);
    disc(c,2.6,-7.2,3,C1);ell(c,4.6,-6.4,1.6,1.2,C1);poly(c,[[1.2,-9.6],[.8,-12],[2.4,-10]],sil?C2:'#F2E2C4');poly(c,[[3.4,-9.8],[3.8,-12.2],[4.4,-9.8]],sil?C2:'#F2E2C4');
    eye(2.2,-7.4);eye(4.2,-7.4);blush(1.4,-6);disc(c,5.6,-6.6,.3,ink);
    for(let i=0;i<4;i++)poly(c,[[-3+i*1.6,-6],[-2.4+i*1.6,-7.4],[-1.8+i*1.6,-6]],sil?C2:pet.col2);
    if(!sil){if(pet.x==='frost')for(let i=0;i<5;i++){const a=t/600+i*1.3;disc(c,Math.cos(a)*8,-6+Math.sin(a)*5,.45,'#E6F6FF');}
      if(pet.x==='petals')for(let i=0;i<5;i++){const p=((t/1400)+i/5)%1;ell(c,-6+i*3,-12+p*13,.7,.4,'#F7B6CC',p*6);}
      if(pet.x==='storm'&&Math.sin(t/300)>.8)poly(c,[[5,-12],[6,-12],[5,-9],[6.6,-9],[4,-5]],'#FFE07A');
      if(rar==='legendary'&&Math.sin(t/500)>.6){disc(c,7,-6.4,1,'rgba(255,170,80,.7)');disc(c,8.4,-6.6,.7,'rgba(255,220,120,.6)');}}
  }
  else if(sp==='otter'||sp==='axolotl'){ell(c,0,-3,4.6,3,C1);disc(c,3,-6,3,C1);ell(c,3.3,-5,1.8,1.3,C2);eye(2,-6.6);eye(4.2,-6.6);blush(1.4,-5.2);blush(5,-5.2);
    if(sp==='axolotl'&&!sil)[-1,1].forEach(sd=>{for(let k=0;k<3;k++){c.strokeStyle=C2;c.lineWidth=.6;c.beginPath();c.moveTo(3+sd*2.6,-6.6);c.lineTo(3+sd*(4+k*.3),-8.4+k*1.2);c.stroke();}});
    if(sp==='otter'&&!sil){rr(c,1.2,-3.6,3,1.6,.8,'#B9DDEB');}
    c.strokeStyle=C1;c.lineWidth=1.2;c.beginPath();c.moveTo(-4,-2.4);c.quadraticCurveTo(-6.6,-1.4,-6,-3.6);c.stroke();}
  else if(sp==='crab'){[-1,1].forEach(sd=>{ell(c,sd*4.6,-5.2,1.6,1.2,C1,sd*.4);for(let k=0;k<3;k++)line(c,sd*2.4,-1.8+k*.4,sd*4.6,-.4+k*.6,C1,.5);});ell(c,-1,-5.4,3.4,3.4,C2);ell(c,0,-2.6,3.6,2.2,C1);R(c,-1,-5.4,.4,1.6,C1);R(c,.8,-5.4,.4,1.6,C1);eye(-.8,-5.8,.5);eye(1,-5.8,.5);}
  else if(sp==='turtle'){ell(c,0,-3,5,3.2,C2);c.fillStyle=C1;c.beginPath();c.ellipse(0,-3.6,4.4,3,0,Math.PI,0);c.fill();for(let i=-1;i<=1;i++)disc(c,i*2,-4.6,.8,shade(C1));disc(c,5,-3.4,1.8,C2);eye(5.6,-3.8,.45);rr(c,-3.6,-1.4,1.4,1.4,.6,C2);rr(c,2,-1.4,1.4,1.4,.6,C2);}
  else if(sp==='kraken'){c.globalAlpha=sil?1:(.75+.15*Math.sin(t/400));for(let i=0;i<5;i++){c.strokeStyle=i%2?C2:C1;c.lineWidth=1.1;c.lineCap='round';c.beginPath();c.moveTo(-3+i*1.5,-3);c.quadraticCurveTo(-4+i*2+Math.sin(t/300+i),-1,-3+i*1.5+Math.cos(t/300+i),.4);c.stroke();}disc(c,0,-6,4,C1);c.globalAlpha=1;eye(-1.4,-6,.7);eye(1.4,-6,.7);blush(-2.6,-4.8);blush(2.6,-4.8);}
  else if(sp==='narwhal'){ell(c,0,-4,6,3.4,C1);ell(c,.6,-3,4.4,2,C2);poly(c,[[-6,-4],[-9,-6.6],[-9,-1.6]],C1);line(c,5,-6,9.6,-10,sil?C2:'#FFF3D0',.8);eye(3.4,-5,.55);blush(4.4,-3.6);
    if(!sil&&pet.x==='stars')for(let i=0;i<6;i++)disc(c,-4+i*1.6,-5.6+(i%2),.35,'#FFF3B8');
    if(!sil&&pet.x==='aurora'){for(let i=0;i<5;i++){c.fillStyle=`hsla(${150+i*30+(t/20)%60},90%,70%,.5)`;c.fillRect(-6+i*2.4,-12-Math.sin(t/400+i)*2,1.6,5);}}}
  else if(sp==='seahorse'){c.fillStyle=C1;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-3,-1,-2,-4);c.quadraticCurveTo(-3,-7,0,-9);c.quadraticCurveTo(3,-9,2.6,-7);c.lineTo(5,-6.4);c.lineTo(2.4,-5.6);c.quadraticCurveTo(1,-3,1.6,-1);c.quadraticCurveTo(1.4,1.4,-.6,1.6);c.closePath();c.fill();eye(.8,-7.4,.5);
    if(!sil&&pet.x==='rainbow')['#E0453B','#F2A33A','#F2D24A','#5DBE9C','#4A7EC2'].forEach((col,i)=>disc(c,-1.6+i*.2,-8+i*1.4,.5,col));}
  if(!sil&&(rar==='legendary'||rar==='mythic'))for(let i=0;i<4;i++){const a=t/700+i*1.6;const sx=Math.cos(a)*9,sy=-6+Math.sin(a*1.3)*6;c.fillStyle=rar==='mythic'?`hsl(${(t/8+i*90)%360},90%,75%)`:'#FFE07A';c.beginPath();for(let k=0;k<8;k++){const an=k/8*TAU,r=k%2?.35:1.1;c.lineTo(sx+Math.cos(an)*r,sy+Math.sin(an)*r);}c.fill();}
  c.restore();
}
function drawPetIcon(cv,pet,sil){cv.width=120;cv.height=120;const c=cv.getContext('2d');c.setTransform(3,0,0,3,0,0);drawPet(c,pet,20,32,1200,2.1,{silhouette:sil,still:true});}

/* ---------- Emissary pennant, wakes and cannonball styles ---------- */
const EM_COLS=['#9AA3AE','#5DBE9C','#4A7EC2','#9B5DE5','#E2AE45'];
function drawEmissary(c,x,y,grade,t){const col=EM_COLS[grade];const len=10+grade*2.4;c.fillStyle=col;c.beginPath();c.moveTo(x,y);for(let i=0;i<=6;i++)c.lineTo(x+i*len/6,y+Math.sin(t/180+i*.8)*.8+i*.25);for(let i=6;i>=0;i--)c.lineTo(x+i*len/6,y+4.6-i*.38+Math.sin(t/180+i*.8)*.8);c.closePath();c.fill();
  for(let i=0;i<=grade;i++)disc(c,x+1.8+i*2,y+2.2+Math.sin(t/180+i)*.5,.6,'#FFFFFF');if(grade===4)glowAt(c,x+len/2,y+2,8,'255,214,110',.35);}
function drawWake(c,x,y,st,t,s=1){if(!st)return;for(let i=0;i<9;i++){const p=((t/900)+i/9)%1;const wx=x-p*40*s,wy=y+Math.sin(p*9+i)*1.5*s;const a=1-p;
  if(st==='bubbles'){c.strokeStyle=`rgba(255,255,255,${a})`;c.lineWidth=.5*s;c.beginPath();c.arc(wx,wy,(1+p*2)*s,0,TAU);c.stroke();}
  else if(st==='sparkle')disc(c,wx,wy,(1.2-p)*s,`rgba(255,240,170,${a})`);
  else if(st==='petals')ell(c,wx,wy,1.2*s,.6*s,`rgba(247,182,204,${a})`,p*6);
  else if(st==='flame')disc(c,wx,wy,(1.6-p)*s,`hsla(${30-p*30},95%,60%,${a})`);
  else if(st==='rainbow')disc(c,wx,wy,1.3*s,`hsla(${i*40},85%,65%,${a})`);
  else if(st==='stars'){c.fillStyle=`rgba(255,243,184,${a})`;c.beginPath();for(let k=0;k<8;k++){const an=k/8*TAU,r=(k%2?.35:1.2)*s;c.lineTo(wx+Math.cos(an)*r,wy+Math.sin(an)*r);}c.fill();}}}
function drawShot(c,x,y,st,t){
  if(st==='fire'){glowAt(c,x,y,5,'255,150,60',.7);disc(c,x,y,2,'#F27A3A');disc(c,x-.4,y-.4,1,'#FFE07A');}
  else if(st==='snow'){disc(c,x,y,2.2,'#FFFFFF');disc(c,x+.6,y+.6,.8,'#DCEBF5');}
  else if(st==='heart')drawSymbol(c,'heart',x,y,1.1,'#E0457B');
  else if(st==='glitter'){for(let i=0;i<5;i++)disc(c,x+Math.cos(t/60+i)*2,y+Math.sin(t/60+i)*2,.6,`hsl(${i*70+(t/5)%360},90%,70%)`);}
  else if(st==='duck'){ell(c,x,y+.4,2.2,1.4,'#F7D24A');disc(c,x+1.2,y-1,1.1,'#F7D24A');poly(c,[[x+2.2,y-1],[x+3.2,y-.8],[x+2.2,y-.4]],'#F2A33A');}
  else if(st==='drop')drawMark(c,x,y,5,'#E06034');
  else{disc(c,x,y,2.2,'#3F3A40');disc(c,x-.6,y-.6,.7,'#8A8790');}
}
