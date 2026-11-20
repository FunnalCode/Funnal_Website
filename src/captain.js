/* ============================== CAPTAINS REDRAWN (Stage 0b) ==============================
   One rig, drawn in its own units (feet at 0,0; about 62 tall) and scaled to the old
   8 x 12.4 footprint, so every scene, icon and portrait keeps working. The same rig draws the
   close-up bust (drawCaptainBust) used by the header portrait and, later, the Tavern and intros.
   Light comes from the top left; every shape gets a soft shadow side and a warm outline. */
const CP_INK='rgba(36,24,18,.8)',CP_LW=1.25;
function cpShade(hex,k){try{return bkShade(hex,k);}catch(e){return hex;}}
function cpFill(c,col,ink=true,lw=CP_LW){c.fillStyle=col;c.fill();if(ink){c.strokeStyle=CP_INK;c.lineWidth=lw;c.lineJoin='round';c.stroke();}}
function cpEll(c,x,y,rx,ry,col,ink=true,rot=0){c.beginPath();c.ellipse(x,y,Math.max(.2,rx),Math.max(.2,ry),rot,0,TAU);cpFill(c,col,ink);}
function cpRR(c,x,y,w,h,r,col,ink=true){c.beginPath();c.roundRect?c.roundRect(x,y,w,h,Math.min(r,w/2,h/2)):c.rect(x,y,w,h);cpFill(c,col,ink);}
function cpStroke(c,col,lw){c.strokeStyle=col;c.lineWidth=lw;c.lineCap='round';c.lineJoin='round';c.stroke();}

/* ---------- who looks like what ---------- */
function cpLook(pid){const base=pid===C().playerIds[0];return base?{hair:'#7A4B2A',hairStyle:'messy',skin:'#F6D2B2',iris:'#5A3A22'}:{hair:'#33363F',hairStyle:'swept',skin:'#F3CBA8',iris:'#2E4A6A'};}

/* ---------- mood: cheer when you log, slump if the day's target was missed ---------- */
function cpExpr(pid,opts,face){if(opts.expr)return opts.expr;if(opts.dance)return 'cheer';
  if(typeof S!=='undefined'&&pid===S.me&&Date.now()<(S.cheerUntil||0))return 'cheer';
  try{const D=G&&G.days&&G.days[G.today];const h=new Date().getHours();if(D&&D.target>0&&h>=18&&D.team<D.target&&!opts.icon)return 'slump';}catch(e){}
  if(face&&face.st==='goldtooth')return 'grin';return 'happy';}

/* ---------- body pieces ---------- */
function cpTorsoPath(c){c.beginPath();c.moveTo(-8,-33);c.quadraticCurveTo(-16.6,-32.6,-16.2,-26.4);c.lineTo(-12.4,-17.5);c.quadraticCurveTo(-13.8,-10.5,-13.4,-8.4);c.quadraticCurveTo(0,-6.8,13.4,-8.4);c.quadraticCurveTo(13.8,-10.5,12.4,-17.5);c.lineTo(16.2,-26.4);c.quadraticCurveTo(16.6,-32.6,8,-33);c.closePath();}
function cpTorsoShade(c){c.save();cpTorsoPath(c);c.clip();ell(c,10,-19,8.5,16,'rgba(40,20,10,.13)');ell(c,-9,-28,7,5,'rgba(255,255,255,.13)');
  c.beginPath();c.moveTo(-6,-22);c.quadraticCurveTo(-4.5,-16,-6.2,-10);cpStroke(c,'rgba(40,20,10,.13)',.9);c.beginPath();c.moveTo(7,-24);c.quadraticCurveTo(5.4,-17,7.2,-10.5);cpStroke(c,'rgba(40,20,10,.13)',.9);c.restore();}
function cpArm(c,side,col,pose,t){const s=side;let sx=s*13,sy=-28.8,ex,ey;
  if(pose==='cheer'){const w=Math.sin(t/110+s)*1.4;ex=s*17+w*.3;ey=-50+w;}else if(pose==='slump'){ex=s*14;ey=-12.5;}else{const sw=Math.sin(t/900+s*1.3)*.6;ex=s*16.2+sw*.2;ey=-15.5+sw;}
  c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(s*17,(sy+ey)/2-1,ex,ey);c.strokeStyle=CP_INK;c.lineWidth=7.6;c.lineCap='round';c.stroke();c.strokeStyle=col;c.lineWidth=5.6;c.stroke();
  c.strokeStyle='rgba(40,20,10,.14)';c.lineWidth=2;c.beginPath();c.moveTo(sx+s*1.6,sy+2);c.quadraticCurveTo(s*16.4,(sy+ey)/2,ex+s*1.4,ey);c.stroke();return [ex,ey];}
function cpHand(c,x,y,skin){cpEll(c,x,y+1.2,2.9,2.8,skin);ell(c,x-1,y,1.1,.9,'rgba(255,255,255,.35)');}
function cpLegs(c,col,pose){const sl=pose==='slump'?.6:0;cpRR(c,-9.2,-14.5+sl,7.6,11.2,3.2,col);cpRR(c,1.6,-14.5+sl,7.6,11.2,3.2,col);R(c,-1.6,-14,1.2,6,'rgba(40,20,10,.12)');
  cpRR(c,-10.8,-5.2,9.8,5.4,2.6,'#3F3A30');cpRR(c,1,-5.2,9.8,5.4,2.6,'#3F3A30');ell(c,-7.2,-3.9,2.4,.9,'rgba(255,255,255,.25)');ell(c,4.6,-3.9,2.4,.9,'rgba(255,255,255,.25)');}

/* ---------- coats: every style, drawn in rig units on the torso ---------- */
function cpBase(c,col){cpTorsoPath(c);cpFill(c,col);}
function cpClipT(c,f){c.save();cpTorsoPath(c);c.clip();f();c.restore();}
function cpButtons(c,xs,col,n=3,y0=-25,dy=5){xs.forEach(x=>{for(let i=0;i<n;i++){disc(c,x,y0+i*dy,1,col);disc(c,x-.3,y0+i*dy-.3,.35,'rgba(255,255,255,.6)');}});}
function cpCollarV(c,col){c.beginPath();c.moveTo(-5,-32.6);c.lineTo(0,-25.5);c.lineTo(5,-32.6);c.closePath();cpFill(c,col,true,.9);}
const CP_COAT={
  none(c,o,L){cpBase(c,o.col);cpCollarV(c,L.skin);cpClipT(c,()=>{R(c,-15,-17.4,30,3.4,'#3F3A30');});cpRR(c,-2.6,-18.2,5.2,5,1.2,'#DDA94D');R(c,-1.2,-16.9,2.4,2.4,'#3F3A30');},
  plain(c,o){cpBase(c,o.col);cpCollarV(c,'#FFFFFF');cpButtons(c,[0],cpShade(o.col,-.35),3,-23,4.5);},
  hull(c,o){CP_COAT.plain(c,o);},
  stripe(c,o){cpBase(c,o.col);cpClipT(c,()=>{for(let i=0;i<5;i++)R(c,-16,-29+i*4.4,32,1.9,o.col2||'#4A7EC2');});cpCollarV(c,o.col2||'#4A7EC2');},
  vest(c,o){cpBase(c,o.col2||'#F4EFE4');cpClipT(c,()=>{c.beginPath();c.moveTo(-15,-33);c.lineTo(-3.4,-33);c.lineTo(-1.4,-8);c.lineTo(-15,-8);c.closePath();c.fillStyle=o.col;c.fill();c.beginPath();c.moveTo(15,-33);c.lineTo(3.4,-33);c.lineTo(1.4,-8);c.lineTo(15,-8);c.closePath();c.fill();
    c.beginPath();c.moveTo(-3.4,-33);c.lineTo(-1.4,-8);c.moveTo(3.4,-33);c.lineTo(1.4,-8);cpStroke(c,cpShade(o.col,-.35),.9);});cpButtons(c,[-4.5],'#DDA94D',2,-20,5);},
  trim(c,o){cpBase(c,o.col);const t2=o.col2||'#DDA94D';cpClipT(c,()=>{c.beginPath();c.moveTo(-7.5,-33);c.lineTo(-1.2,-22);c.lineTo(-6,-21.5);c.closePath();c.fillStyle=cpShade(o.col,.18);c.fill();c.beginPath();c.moveTo(7.5,-33);c.lineTo(1.2,-22);c.lineTo(6,-21.5);c.closePath();c.fill();R(c,-.5,-25,1,18,t2);R(c,-16,-10,32,1.3,t2);});
    cpCollarV(c,'#FFFFFF');cpButtons(c,[-3.4,3.4],t2,3,-20,4.4);},
  cloak(c,o){cpBase(c,cpShade(o.col,-.12));const t2=o.col2||'#FFFFFF';c.beginPath();c.moveTo(-15,-32);c.quadraticCurveTo(-11,-34.5,0,-34.6);c.quadraticCurveTo(11,-34.5,15,-32);c.lineTo(13,-29);c.quadraticCurveTo(0,-31,-13,-29);c.closePath();cpFill(c,o.col);disc(c,0,-30.5,1.7,t2);disc(c,-.5,-31,.6,'rgba(255,255,255,.7)');
    cpClipT(c,()=>{for(let i=0;i<6;i++)disc(c,-12+i*5,-26+(i%2)*9,.55,t2);});},
  oil(c,o){cpBase(c,o.col);cpClipT(c,()=>{c.beginPath();c.moveTo(-8,-33);c.lineTo(0,-26.5);c.lineTo(8,-33);c.lineTo(9,-29);c.lineTo(0,-23.8);c.lineTo(-9,-29);c.closePath();c.fillStyle=cpShade(o.col,-.18);c.fill();R(c,-.5,-24,1,16,cpShade(o.col,-.25));});cpButtons(c,[-2.2],o.col2||'#3F3A30',3,-21,4.4);},
  hoodie(c,o){cpBase(c,o.col);const t2=o.col2||'#FFFFFF';cpClipT(c,()=>{cpRR(c,-7,-17.5,14,6,2.4,cpShade(o.col,-.15),false);});c.beginPath();c.moveTo(-1.5,-31);c.lineTo(-2,-24.5);c.moveTo(1.5,-31);c.lineTo(2,-24.5);cpStroke(c,t2,.7);disc(c,-2,-24.2,.7,t2);disc(c,2,-24.2,.7,t2);
    c.save();c.translate(-1,-21.6);c.scale(.0075,.0075);c.translate(-500,-500);try{c.fillStyle=t2;c.fill(markPath(),'evenodd');}catch(e){}c.restore();},
  admiral(c,o){cpBase(c,o.col);const g=o.col2||'#F2C462';cpClipT(c,()=>{R(c,-.8,-33,1.6,26,'#C8102E');});cpButtons(c,[-4,4],g,4,-26,4.4);[-1,1].forEach(s=>{cpEll(c,s*11.5,-30.2,4.4,2,g);for(let i=0;i<4;i++)line(c,s*(8.2+i*2),-28.6,s*(8.2+i*2),-26.6,g,.7);});cpCollarV(c,'#FFFFFF');},
  sash(c,o){cpBase(c,o.col);cpCollarV(c,'#FFFFFF');cpClipT(c,()=>{c.beginPath();c.moveTo(-15,-31);c.lineTo(-10,-33);c.lineTo(15,-12);c.lineTo(13,-8);c.closePath();c.fillStyle=o.col2||'#C8102E';c.fill();});cpEll(c,11,-12,2.4,2,o.col2||'#C8102E');},
  knit(c,o){cpBase(c,o.col);const t2=o.col2||'#C9BFA8';cpClipT(c,()=>{for(let k=-2;k<=2;k++){c.beginPath();for(let i=0;i<10;i++)c.lineTo(k*5.4+(i%2?1.2:-1.2),-31+i*2.6);cpStroke(c,t2,.8);}R(c,-16,-12,32,4,t2);});cpRR(c,-6.5,-34,13,3.6,1.8,t2);},
  apron(c,o){cpBase(c,'#F4EFE4');cpClipT(c,()=>{cpRR(c,-9,-26,18,20,3,o.col,false);c.beginPath();c.moveTo(-8,-26);c.lineTo(-4.5,-32.6);c.moveTo(8,-26);c.lineTo(4.5,-32.6);cpStroke(c,o.col,1.1);R(c,-4,-18,8,4,'rgba(0,0,0,.1)');});},
  hawaii(c,o){cpBase(c,o.col);const t2=o.col2||'#FFD166';cpClipT(c,()=>{[[-8,-26],[5,-24],[-2,-17],[9,-14],[-10,-12],[2,-30]].forEach(([a,b])=>{for(let k=0;k<5;k++)disc(c,a+Math.cos(k*1.26)*1.9,b+Math.sin(k*1.26)*1.9,1.2,t2);disc(c,a,b,.9,'#E0457B');});});cpCollarV(c,'#FFFFFF');},
  tux(c,o){cpBase(c,o.col);c.beginPath();c.moveTo(-5.5,-33);c.lineTo(5.5,-33);c.lineTo(0,-14);c.closePath();cpFill(c,o.col2||'#FFFFFF',true,.8);poly(c,[[-3.6,-31.6],[0,-29.6],[-3.6,-27.6]],'#C8102E');poly(c,[[3.6,-31.6],[0,-29.6],[3.6,-27.6]],'#C8102E');disc(c,0,-29.6,1,'#A00D24');cpButtons(c,[0],'#26232B',2,-24,4);},
  life(c,o){cpBase(c,'#4A7EC2');cpClipT(c,()=>{cpRR(c,-14,-33,11.5,26,4,o.col,true);cpRR(c,2.5,-33,11.5,26,4,o.col,true);R(c,-16,-23,32,1.8,o.col2||'#FFFFFF');R(c,-16,-16,32,1.8,o.col2||'#FFFFFF');});},
  cape(c,o){cpBase(c,cpShade(o.col,-.18));disc(c,0,-31,1.8,'#F2C462');},
};
// cloaks and capes hang behind the body
function cpBehind(c,o,t){if(!o)return;const sw=Math.sin(t/650)*1.2;if(o.st==='cloak'||o.st==='cape'){c.beginPath();c.moveTo(-14,-31);c.lineTo(14,-31);c.quadraticCurveTo(18,-16,19+sw,-1.5);
    if(o.st==='cape'){for(let i=0;i<6;i++){const x1=19+sw-(i+1)*(38/6);c.quadraticCurveTo(x1+3.2,4,x1,-1.5);}}else c.quadraticCurveTo(0,1.5,-19+sw,-1.5);
    c.quadraticCurveTo(-18,-16,-14,-31);c.closePath();cpFill(c,o.col);if(o.st==='cape'){c.save();c.clip();ell(c,10,-10,10,16,'rgba(0,0,0,.14)');c.restore();}}
  if(o.st==='hoodie'){cpEll(c,0,-31.8,11,4.6,cpShade(o.col,-.12));}}

/* ---------- head ---------- */
const CP_HEAD=[0,-46.4],CP_RX=17,CP_RY=16.2;
function cpHairBack(c,L){const d=cpShade(L.hair,-.25);c.beginPath();c.ellipse(0,-49,18.4,14.5,0,Math.PI*.92,Math.PI*2.08);c.lineTo(17.6,-40);c.lineTo(-17.6,-40);c.closePath();cpFill(c,d);}
function cpHairFront(c,L,t){const h=L.hair,hi=cpShade(h,.28);const sway=Math.sin(t/800)*.4;c.beginPath();c.moveTo(-17.5,-42.5);c.bezierCurveTo(-19,-61,-6,-66.6,2,-65.2);c.bezierCurveTo(14,-64,19.4,-55,17.5,-42.5);
  if(L.hairStyle==='swept'){c.quadraticCurveTo(16.4,-48.5,13.5,-50.5);c.quadraticCurveTo(9,-49+sway,4,-53.6);c.quadraticCurveTo(-1,-50.4+sway,-6.5,-54.4);c.quadraticCurveTo(-10,-51.6,-12.4,-53.4);c.quadraticCurveTo(-15.4,-49.5,-16,-46.6);}
  else{const p=[[13.5,-50.6,16.4,-46],[8.6,-51.8,12.4,-47.2+sway],[3,-52.2,6.6,-47+sway],[-2.6,-52.2,0,-47.4+sway],[-8.2,-51.6,-5.6,-47+sway],[-13.4,-50.2,-11.6,-46.4],[-16.4,-44.6,-16.6,-48]];p.forEach(([x,y,cx,cy])=>c.quadraticCurveTo(cx,cy,x,y));}
  c.closePath();cpFill(c,h);
  c.save();c.clip();c.beginPath();c.moveTo(-12,-56);c.quadraticCurveTo(-6,-63,3,-62.4);cpStroke(c,hi,1.6);c.beginPath();c.moveTo(-14.6,-52);c.quadraticCurveTo(-13,-57,-9.4,-59.2);cpStroke(c,hi,.8);
  c.beginPath();c.moveTo(6,-61);c.quadraticCurveTo(11,-58,13,-53);cpStroke(c,cpShade(h,-.25),.8);c.restore();
  // sideburns
  cpRR(c,-17.6,-45,2.6,6,1.2,h,false);cpRR(c,15,-45,2.6,6,1.2,h,false);}
function cpHead(c,L){const[hx,hy]=CP_HEAD;[-1,1].forEach(s=>{cpEll(c,s*16.6,hy+2.4,3.2,3.8,L.skin);ell(c,s*16.9,hy+2.6,1.4,2,'rgba(190,100,80,.35)');});
  c.beginPath();c.moveTo(-16.6,hy-2);c.bezierCurveTo(-17.4,hy-22,17.4,hy-22,16.6,hy-2);c.bezierCurveTo(16.2,hy+5,13.4,hy+10.6,8.6,hy+14.2);c.quadraticCurveTo(4,hy+17.4,0,hy+17.4);c.quadraticCurveTo(-4,hy+17.4,-8.6,hy+14.2);c.bezierCurveTo(-13.4,hy+10.6,-16.2,hy+5,-16.6,hy-2);c.closePath();cpFill(c,L.skin);
  c.save();c.clip();ell(c,10.5,hy+7,12,14,'rgba(150,80,55,.17)');ell(c,0,hy+17,10,4.6,'rgba(150,80,55,.16)');c.globalAlpha=.07;ell(c,0,hy+13,14,6,L.hair);c.globalAlpha=1;ell(c,-7,hy-9,6,4,'rgba(255,255,255,.1)');c.restore();}

/* ---------- faces: eyes, brows, nose, mouth with expressions ---------- */
function cpEyes(c,L,expr,t,pid,face){const[hx,hy]=CP_HEAD;const ey=hy+2;const blinkP=3600+((pid||'').length*331)%900;const blink=(t%blinkP)<130;
  const lx=Math.sin(t/2300+(pid||'').length)*.6,ly=Math.sin(t/3100)*.25;const patch=face&&face.st==='patch';
  [-1,1].forEach(s=>{const x=s*6;if(patch&&s===1)return;
    if(blink){c.beginPath();c.moveTo(x-3.2,ey);c.quadraticCurveTo(x,ey+1,x+3.2,ey-.2);cpStroke(c,'#2A1E16',1.2);return;}
    const ry=expr==='gasp'?3.3:2.6,rx=3.2;const lid=expr==='gasp'?-3.6:expr==='slump'?.1:expr==='cheer'?-1.9:-1.75;
    c.beginPath();c.moveTo(x-rx,ey+.2);c.quadraticCurveTo(x-.4,ey-ry*1.35,x+rx,ey-.3);c.quadraticCurveTo(x+.3,ey+ry*1.1,x-rx,ey+.2);c.closePath();c.fillStyle='#F6F2EA';c.fill();
    c.save();c.clip();const ir=expr==='gasp'?1.55:2;disc(c,x+lx,ey+.25+ly,ir,L.iris);disc(c,x+lx,ey+.3+ly,ir*.5,'#140F0C');disc(c,x+lx-.6,ey-.35+ly,.42,'rgba(255,255,255,.9)');
      R(c,x-4,ey-5,8,5+lid,L.skin);ell(c,x,ey+lid,4,1,'rgba(120,60,40,.18)');c.restore();
    c.beginPath();c.moveTo(x-rx-.3,ey+.3);c.quadraticCurveTo(x-.4,ey+lid-.6,x+rx+.2,ey-.1);cpStroke(c,'#2A1E16',1.45);
    c.beginPath();c.moveTo(x-rx+.8,ey+1.6);c.quadraticCurveTo(x,ey+2.6,x+rx-.6,ey+1.3);cpStroke(c,'rgba(90,50,35,.35)',.5);
    c.beginPath();c.moveTo(x-rx+.4,ey-2.6+lid*.3);c.quadraticCurveTo(x,ey-3.6+lid*.3,x+rx,ey-2.4+lid*.3);cpStroke(c,'rgba(120,60,40,.25)',.5);});}
function cpBrows(c,L,expr){const[hx,hy]=CP_HEAD;const by=hy-3.2;const col=cpShade(L.hair,-.3);
  [-1,1].forEach(s=>{const x=s*6;let inner=.8,outer=-.4,dy=0;if(expr==='slump'){inner=-1;outer=.6;}else if(expr==='gasp'){dy=-1.8;inner=-.4;outer=-.2;}else if(expr==='cheer'){dy=-.8;inner=0;}else if(expr==='smug'&&s===1){dy=-1.2;inner=-.4;}
    c.beginPath();c.moveTo(x-s*3.6,by+dy+outer);c.quadraticCurveTo(x,by+dy-1.1,x+s*3.4,by+dy+inner);c.lineTo(x+s*3.2,by+dy+inner+1.1);c.quadraticCurveTo(x,by+dy+.2,x-s*3.4,by+dy+outer+.7);c.closePath();c.fillStyle=col;c.fill();});}
function cpNose(c,L){const[hx,hy]=CP_HEAD;c.beginPath();c.moveTo(1.2,hy+1.6);c.quadraticCurveTo(2.6,hy+5.4,1.6,hy+7.2);cpStroke(c,'rgba(130,70,50,.45)',.8);ell(c,.2,hy+7.6,2.4,.9,'rgba(130,70,50,.22)');c.beginPath();c.moveTo(-1.6,hy+7.2);c.quadraticCurveTo(0,hy+8.2,1.8,hy+7.1);cpStroke(c,'rgba(110,55,40,.5)',.6);}
function cpMouth(c,L,expr){const[hx,hy]=CP_HEAD;const my=hy+11.2;const lip='#6A2E24';
  if(expr==='cheer'||expr==='grin'){c.beginPath();c.moveTo(-4.6,my-1);c.quadraticCurveTo(0,my-1.6,4.6,my-1);c.quadraticCurveTo(4,my+4.6,0,my+4.8);c.quadraticCurveTo(-4,my+4.6,-4.6,my-1);c.closePath();cpFill(c,'#7A2E2A',true,.8);
    c.save();c.clip();R(c,-5,my-1.4,10,1.6,'#FFFFFF');ell(c,0,my+4.4,2.6,1.6,'#E06A6A');c.restore();return;}
  if(expr==='gasp'){cpEll(c,0,my+1,1.9,2.4,'#7A2E2A');return;}
  if(expr==='slump'){c.beginPath();c.moveTo(-3,my+1.6);c.quadraticCurveTo(0,my-.6,3,my+1.6);cpStroke(c,lip,1.2);return;}
  if(expr==='smug'){c.beginPath();c.moveTo(-3,my+.4);c.quadraticCurveTo(1,my+1.8,3.8,my-.9);cpStroke(c,lip,1.2);return;}
  c.beginPath();c.moveTo(-3.2,my+.5);c.quadraticCurveTo(.4,my+1.5,3.6,my-.5);cpStroke(c,'#6A2E24',1.1);ell(c,.2,my+2.6,1.8,.6,'rgba(130,70,50,.2)');}
function cpCheeks(c){const[hx,hy]=CP_HEAD;c.globalAlpha=.1;ell(c,-10.6,hy+6.4,2.6,1.6,'#F49A9A');ell(c,10.6,hy+6.4,2.6,1.6,'#F49A9A');c.globalAlpha=1;}

/* ---------- face gear: beards and hair made of shaded locks ---------- */
function cpLocks(c,col,pts,t){const hi=cpShade(col,.3),lo=cpShade(col,-.3);const sw=Math.sin(t/650)*.7;
  // under-layer, body, then a lock pattern and highlights
  c.save();c.translate(0,1.1);c.beginPath();pts(c,sw);cpFill(c,lo,false);c.restore();c.beginPath();pts(c,sw);cpFill(c,col);
  c.save();c.beginPath();pts(c,sw);c.clip();for(let i=-3;i<=3;i++){c.beginPath();c.moveTo(i*4.4,-40);c.quadraticCurveTo(i*4.4+1.6,-30,i*4.2+sw,-20);cpStroke(c,lo,.6);}
  c.beginPath();c.moveTo(-11,-38);c.quadraticCurveTo(-10,-31,-6,-27);cpStroke(c,hi,1);c.beginPath();c.moveTo(-5,-30);c.quadraticCurveTo(-3.6,-27,-1,-25);cpStroke(c,hi,.7);c.restore();}
function cpMoustache(c,col,big){const[hx,hy]=CP_HEAD;const y=hy+8.8;[-1,1].forEach(s=>{c.beginPath();c.moveTo(0,y-1);c.quadraticCurveTo(s*3.5,y-2.4,s*(big?8.6:6.8),y+(big?-.6:.8));
    if(big){c.quadraticCurveTo(s*10.6,y-3.2,s*9,y-4);c.quadraticCurveTo(s*10,y-1.4,s*7.6,y+1.4);}else c.quadraticCurveTo(s*4.4,y+2.4,0,y+.8);c.quadraticCurveTo(s*1,y+1.2,0,y+.6);c.closePath();cpFill(c,col,true,.8);});
  ell(c,-3.4,y-1,1.6,.5,'rgba(255,255,255,.3)');}
function cpBeardPath(full){return (c,sw)=>{const[hx,hy]=CP_HEAD;c.moveTo(-16.8,hy-2);c.quadraticCurveTo(-17.4,hy+12,-9.4,hy+19);
    const tips=full?[[-6.4,hy+22.4],[-2.4,hy+24.6],[2.4,hy+24.6],[6.4,hy+22.4],[9.4,hy+19]]:[[-3,hy+20.6],[3,hy+20.6],[9.4,hy+19]];
    let px=-9.4;tips.forEach(([x,y])=>{c.quadraticCurveTo((px+x)/2+sw,y+2.4,x+sw*.5,y);px=x;});
    c.quadraticCurveTo(17.4,hy+12,16.8,hy-2);c.quadraticCurveTo(14.4,hy+6.8,7.6,hy+8.4);c.quadraticCurveTo(0,hy+9.6,-7.6,hy+8.4);c.quadraticCurveTo(-14.4,hy+6.8,-16.8,hy-2);c.closePath();};}
const CP_FACE={
  stubble(c,f,L){const[hx,hy]=CP_HEAD;c.save();c.beginPath();c.ellipse(0,hy+10,14.5,7.6,0,0,TAU);c.clip();c.globalAlpha=.22;ell(c,0,hy+11,14,7,f.col);c.globalAlpha=.55;for(let i=0;i<40;i++){const a=i*2.4,d=(i*37%100)/100;disc(c,Math.cos(a)*13*d,hy+11+Math.sin(a)*6*d,.32,f.col);}c.restore();},
  beard(c,f,L,t){cpLocks(c,f.col,cpBeardPath(true),t);},
  braid(c,f,L,t){const[hx,hy]=CP_HEAD;cpLocks(c,f.col,cpBeardPath(true),t);const sw=Math.sin(t/650)*.7;[-3.2,3.2].forEach(bx=>{for(let i=0;i<4;i++)cpEll(c,bx+sw*(i/4),hy+24+i*3,1.9,1.9,i%2?cpShade(f.col,-.12):f.col,true);cpEll(c,bx+sw,hy+36.4,1.4,1.4,'#F2C462');});},
  goatee(c,f,L,t){const[hx,hy]=CP_HEAD;cpLocks(c,f.col,(c,sw)=>{c.moveTo(-4.4,hy+12.4);c.quadraticCurveTo(-4,hy+18,-1.4+sw,hy+22.6);c.quadraticCurveTo(0,hy+21,1.4+sw,hy+22.6);c.quadraticCurveTo(4,hy+18,4.4,hy+12.4);c.quadraticCurveTo(0,hy+14,-4.4,hy+12.4);c.closePath();},t);},
  mutton(c,f,L,t){const[hx,hy]=CP_HEAD;[-1,1].forEach(s=>{c.beginPath();c.moveTo(s*17,hy-4);c.quadraticCurveTo(s*17.6,hy+8,s*12.4,hy+14);c.quadraticCurveTo(s*9.4,hy+12,s*10,hy+6);c.quadraticCurveTo(s*13,hy+2,s*13.8,hy-4);c.closePath();cpFill(c,f.col);});},
  moustache(){},
  handlebar(){},
  patch(c,f){const[hx,hy]=CP_HEAD;c.beginPath();c.moveTo(-17,hy-9);c.lineTo(17,hy-3.6);cpStroke(c,'#2E2B33',1.3);cpEll(c,6.2,hy+1.6,4.4,4,'#2E2B33');ell(c,5,hy+.4,1.4,.9,'rgba(255,255,255,.18)');},
  monocle(c,f){const[hx,hy]=CP_HEAD;c.beginPath();c.arc(6.2,hy+1.6,4.6,0,TAU);cpStroke(c,f.col,1);c.beginPath();c.moveTo(10.4,hy+3.6);c.quadraticCurveTo(12,hy+12,10,hy+18);cpStroke(c,f.col,.5);ell(c,4.6,hy,1.4,.8,'rgba(255,255,255,.35)');},
  earring(c,f){const[hx,hy]=CP_HEAD;c.beginPath();c.arc(-17,hy+7.4,1.9,0,TAU);cpStroke(c,f.col,.9);disc(c,-17.6,hy+6.6,.4,'#FFFFFF');},
  specs(c,f){const[hx,hy]=CP_HEAD;[-1,1].forEach(s=>{c.beginPath();c.arc(s*6.2,hy+1.6,4.5,0,TAU);cpStroke(c,f.col,.9);});c.beginPath();c.moveTo(-1.8,hy+1);c.quadraticCurveTo(0,hy,1.8,hy+1);cpStroke(c,f.col,.8);},
  shades(c,f){const[hx,hy]=CP_HEAD;[-1,1].forEach(s=>{cpRR(c,s*6.2-4.6,hy-1.6,9.2,6,2.6,f.col,true);});line(c,-1.6,hy-.4,1.6,hy-.4,f.col,1);R(c,-9.4,hy-.6,3,1,'rgba(255,255,255,.55)');R(c,3,hy-.6,3,1,'rgba(255,255,255,.55)');},
  scar(c,f){const[hx,hy]=CP_HEAD;c.beginPath();c.moveTo(3.4,hy-6.4);c.lineTo(9.4,hy+7.4);cpStroke(c,f.col,1);for(let i=0;i<4;i++){const q=i/3.5;line(c,3.4+q*6-1.2,hy-6.4+q*13.8+.4,3.4+q*6+1.2,hy-6.4+q*13.8-.6,f.col,.6);}},
  goldtooth(c,f){const[hx,hy]=CP_HEAD;R(c,1,hy+9.6,1.8,1.6,f.col);},
  warpaint(c,f){const[hx,hy]=CP_HEAD;[-1,1].forEach(s=>{for(let i=0;i<2;i++){c.beginPath();c.moveTo(s*7.4,hy+5+i*2.4);c.lineTo(s*14,hy+4.6+i*2.4);cpStroke(c,f.col,1.2);}});},
  plaster(c,f){const[hx,hy]=CP_HEAD;c.save();c.translate(-10,hy+5.4);c.rotate(.6);cpRR(c,-3.6,-1.1,7.2,2.2,.8,f.col,true);c.rotate(-1.2);cpRR(c,-3.6,-1.1,7.2,2.2,.8,f.col,true);c.restore();},
  pipe(c,f,L,t){const[hx,hy]=CP_HEAD;c.beginPath();c.moveTo(2.6,hy+11);c.lineTo(10.4,hy+13.2);cpStroke(c,'#6B4429',1.3);cpRR(c,9.4,hy+9.8,3.8,5.2,1.4,f.col);const q=((t||0)%2400)/2400;c.globalAlpha=.55*(1-q);disc(c,11.4+q*4,hy+7.4-q*13,1.6+q*2.4,'#E8ECEF');c.globalAlpha=1;},
  freckles(c,f){const[hx,hy]=CP_HEAD;c.globalAlpha=.75;[[-11.4,5],[-9.2,6.4],[-12.4,7.2],[-8.8,4.4],[11.4,5],[9.2,6.4],[12.4,7.2],[8.8,4.4]].forEach(([a,b])=>disc(c,a,hy+b,.5,f.col));c.globalAlpha=1;},
  anchor(c,f){const[hx,hy]=CP_HEAD;const ax=11.2,ay=hy+6;line(c,ax,ay-2.6,ax,ay+2.2,f.col,.6);line(c,ax-1.4,ay-1.4,ax+1.4,ay-1.4,f.col,.5);c.beginPath();c.arc(ax,ay+.4,1.9,.3,Math.PI-.3);cpStroke(c,f.col,.55);}
};
const CP_FACE_OVER_MOUTH={beard:1,braid:1,mutton:1,moustache:1,handlebar:1,goatee:1},CP_TASH={beard:0,braid:0,mutton:0,moustache:0,handlebar:1};

/* ---------- hats, all redrawn around the new head (top of head is y = -62.6) ---------- */
function cpBand(c,y,w,col,h=2.6){cpRR(c,-w/2,y,w,h,1.2,col,true);}
const CP_HAT={
  bandana(c,h){c.beginPath();c.moveTo(-18.4,-48.4);c.bezierCurveTo(-19.6,-64,-6,-68.4,2,-67);c.bezierCurveTo(14,-66,19.6,-58,18.4,-48.4);c.quadraticCurveTo(0,-52.6,-18.4,-48.4);c.closePath();cpFill(c,h.col);
    c.beginPath();c.moveTo(16.4,-52);c.quadraticCurveTo(25,-55.6,26.4,-51.4);c.quadraticCurveTo(22.4,-49.4,24.4,-45.4);c.quadraticCurveTo(19.4,-46.6,16.8,-49);c.closePath();cpFill(c,h.col);
    if(h.id==='hat_skull'){cpEll(c,0,-59,3.8,3.4,'#FFFFFF');disc(c,-1.4,-59,.8,'#2E2B33');disc(c,1.4,-59,.8,'#2E2B33');}else{[[-8,-58],[2,-62.4],[9,-56.6],[-2,-55]].forEach(([a,b])=>disc(c,a,b,1,'rgba(255,255,255,.85)'));}
    c.save();c.beginPath();c.moveTo(-18.4,-48.4);c.bezierCurveTo(-19.6,-64,-6,-68.4,2,-67);c.lineTo(2,-48);c.closePath();c.clip();ell(c,-8,-62,6,3,'rgba(255,255,255,.18)');c.restore();},
  cap(c,h){c.beginPath();c.arc(0,-47.6,19,Math.PI,0);c.closePath();cpFill(c,h.col);cpRR(c,0,-50.4,23,4.4,2.2,cpShade(h.col,-.12));disc(c,0,-66.4,1.6,cpShade(h.col,-.2));ell(c,-8,-60,6,3,'rgba(255,255,255,.18)');},
  beanie(c,h){c.beginPath();c.arc(0,-47.6,19,Math.PI,0);c.closePath();cpFill(c,h.col);cpBand(c,-51,39.6,cpShade(h.col,-.12),5);cpEll(c,0,-67.6,4.4,4,'#FFFFFF');for(let i=-3;i<=3;i++)line(c,i*5,-64+Math.abs(i)*1.3,i*5,-52,cpShade(h.col,-.15),.7);},
  straw(c,h){cpEll(c,0,-50.6,30,6.4,h.col);c.beginPath();c.ellipse(0,-52,15,13,0,Math.PI,0);c.closePath();cpFill(c,h.col);cpBand(c,-56.4,30,'#D9485F',3.4);for(let i=0;i<8;i++)line(c,-26+i*7.4,-51,-24+i*7.4,-49,cpShade(h.col,-.2),.5);},
  tricorn(c,h){CP_TRI(c,h);if(h.id==='hat_tricorn'){cpEll(c,0,-62,3.6,3.2,'#FFFFFF');disc(c,-1.3,-62.2,.7,'#2E2B33');disc(c,1.3,-62.2,.7,'#2E2B33');}},
  feather(c,h){CP_TRI(c,h);c.save();c.translate(12,-68);c.rotate(.8);cpEll(c,0,0,4.4,15,'#F2E7FF');for(let i=-3;i<=3;i++)line(c,0,i*3.8,3.6,i*3.8-2,'rgba(160,140,200,.6)',.5);line(c,0,-14,0,14,'#B9A8D9',.6);c.restore();},
  bicorne(c,h){c.beginPath();c.ellipse(0,-54,32,13,0,Math.PI,0);c.closePath();cpFill(c,h.col);cpBand(c,-56,62,'#F2C462',2.6);cpEll(c,0,-60.6,4.4,4.4,'#F2C462');cpEll(c,0,-60.6,2,2,'#C8102E',false);ell(c,-14,-62,8,3,'rgba(255,255,255,.12)');},
  crown(c,h){c.beginPath();c.moveTo(-15,-54.4);c.lineTo(-15,-70);c.lineTo(-7.6,-62.6);c.lineTo(0,-73);c.lineTo(7.6,-62.6);c.lineTo(15,-70);c.lineTo(15,-54.4);c.closePath();cpFill(c,h.col);R(c,-15,-58.4,30,3,cpShade(h.col,-.15));[-7.6,0,7.6].forEach((x,i)=>cpEll(c,x,-56.9,1.6,1.6,['#3A7BD5','#D9485F','#5DBE9C'][i],false));[-15,0,15].forEach((x,i)=>disc(c,x,[-70,-73,-70][i],1.4,'#FFF4D0'));},
  halo(c,h,t){c.beginPath();c.ellipse(0,-72+Math.sin(t/500)*.8,15,4.6,0,0,TAU);cpStroke(c,'rgba(255,240,170,.5)',5);cpStroke(c,h.col,2.6);},
  lantern(c,h,t){cpRR(c,-6,-77,12,15,4,'#FFE7A0');const p=.6+.4*Math.sin(t/260);lamp(c,0,-69,18*p,.5,'255,220,120');cpRR(c,-3,-81,6,4,1.4,'#3F5160');R(c,-6,-70,12,1.2,'#3F5160');},
  kraken(c,h,t){const sw=Math.sin(t/500);for(let i=0;i<4;i++){const x=[-19,-14,14,19][i];c.beginPath();c.moveTo(x,-50);c.quadraticCurveTo(x-4+sw,-38,x+2,-32+(i%2)*3);cpStroke(c,CP_INK,4.6);cpStroke(c,h.col,3.2);}
    c.beginPath();c.arc(0,-49,21,Math.PI,0);c.closePath();cpFill(c,h.col);[-7,7].forEach(x=>{cpEll(c,x,-58,3.6,3.6,'#FFFFFF');disc(c,x+.6,-57.6,1.8,'#2E2B33');});for(let i=0;i<5;i++)disc(c,-14+i*7,-51.4,1.1,cpShade(h.col,.3));},
  peak(c,h){cpEll(c,0,-58.6,21,7.4,h.col);cpBand(c,-56.4,36,'#1E2228',5);cpRR(c,-2,-52.4,24,3.6,1.8,'#1E2228');cpEll(c,0,-54,2.6,2.6,'#F2C462');},
  souwester(c,h){c.beginPath();c.arc(0,-49,18.4,Math.PI,0);c.closePath();cpFill(c,h.col);c.beginPath();c.moveTo(-28,-45);c.quadraticCurveTo(0,-57,28,-43);c.quadraticCurveTo(30,-37,24,-39);c.quadraticCurveTo(0,-50,-24,-40.6);c.quadraticCurveTo(-30,-41,-28,-45);c.closePath();cpFill(c,h.col);ell(c,-7,-60,6,3,'rgba(255,255,255,.22)');},
  party(c,h){c.beginPath();c.moveTo(-11,-55);c.lineTo(2,-86);c.lineTo(12,-55);c.closePath();cpFill(c,h.col);c.save();c.clip();for(let i=0;i<4;i++)R(c,-14,-80+i*7,30,2.4,['#FFD166','#4FA3C7','#FFFFFF','#5DBE9C'][i]);c.restore();cpEll(c,2,-87,3.8,3.8,'#FFD166');},
  viking(c,h){[[-17,-1],[17,1]].forEach(([hx,s])=>{c.beginPath();c.moveTo(hx,-54);c.quadraticCurveTo(hx+s*14,-58,hx+s*11,-75);c.quadraticCurveTo(hx+s*6,-62,hx-s*3,-60);c.closePath();cpFill(c,'#F4EFE4');});
    c.beginPath();c.arc(0,-49,19,Math.PI,0);c.closePath();cpFill(c,h.col);cpBand(c,-53,39,'#7A6A4A',4);R(c,-1.2,-68,2.4,15,'#7A6A4A');for(let i=0;i<6;i++)disc(c,-16+i*6.4,-51,.8,'#C9BFA8');ell(c,-8,-61,5,3,'rgba(255,255,255,.3)');},
  topper(c,h){cpEll(c,0,-53,24,5,h.col);cpRR(c,-13,-82,26,30,3,h.col);cpBand(c,-61,26,'#C8102E',4.4);ell(c,-7,-75,3,6,'rgba(255,255,255,.14)');},
  chef(c,h){cpBand(c,-56.6,32,h.col,6);[[-9,-66,8],[0,-70,9],[9,-66,8]].forEach(([x,y,r])=>cpEll(c,x,y,r,r*.9,h.col));c.save();c.beginPath();c.rect(-16,-60.6,32,4);c.clip();R(c,-16,-61,32,5,h.col);c.restore();ell(c,-6,-70,4,2.4,'rgba(255,255,255,.8)');for(let i=-2;i<=2;i++)line(c,i*5,-62,i*5,-56.6,'rgba(150,150,150,.35)',.6);},
  parrot(c,h,t){const b=Math.sin((t||0)/300)*1.4;c.save();c.translate(0,b);c.beginPath();c.moveTo(-6,-60);c.quadraticCurveTo(-16,-52,-12,-44);c.quadraticCurveTo(-8,-52,-3,-58);c.closePath();cpFill(c,'#E0453B');cpEll(c,0,-68,8.4,10.4,h.col);cpEll(c,4.6,-79,6.4,6,h.col);
    c.beginPath();c.moveTo(9.6,-80);c.quadraticCurveTo(16,-78,10.6,-73);c.closePath();cpFill(c,'#F2A33A');disc(c,6,-80.6,1.5,'#FFFFFF');disc(c,6.4,-80.4,.9,'#1E2228');cpEll(c,-3,-67,4,7,'#4FA3C7',true,.3);c.restore();}
};
function CP_TRI(c,h){c.beginPath();c.moveTo(-30,-50);c.quadraticCurveTo(-16,-59,0,-74);c.quadraticCurveTo(16,-59,30,-50);c.quadraticCurveTo(0,-57.4,-30,-50);c.closePath();cpFill(c,h.col);
  c.beginPath();c.moveTo(-28,-50.4);c.quadraticCurveTo(0,-57,28,-50.4);cpStroke(c,'#DDA94D',1.8);ell(c,-10,-60,6,2.4,'rgba(255,255,255,.14)');}

/* ---------- the whole captain ---------- */
function cpDraw(c,pid,pl,t,opts){pl=pl||{};const L=cpLook(pid);const pal=keeperPal(pl,pid);const coat=it(pl.coat),hat=it(pl.hat),face=it(pl.face);
  const expr=cpExpr(pid,opts,face);const pose=expr==='cheer'?'cheer':expr==='slump'?'slump':'idle';
  const breathe=Math.sin(t/900)*.35;const bob=opts.dance?Math.sin(t/120)*6:pose==='cheer'?-Math.abs(Math.sin(t/140))*2.2:breathe;
  const headTilt=opts.dance?Math.sin(t/240)*.08:pose==='slump'?.05:Math.sin(t/2600)*.025;
  const cs=coat?{...coat}:{st:'none',col:pal.c,col2:'#FFFFFF'};const cf=CP_COAT[cs.st]||CP_COAT.plain;
  if(!opts.bust){ell(c,0,1,15.6,3.4,'rgba(0,0,0,.12)');cpLegs(c,pal.p,pose);}
  c.save();c.translate(0,bob*.5);
  cpBehind(c,coat,t);
  const sleeve=cs.st==='life'?'#4A7EC2':cs.st==='apron'||cs.st==='vest'?(cs.st==='vest'?cs.col2||'#F4EFE4':'#F4EFE4'):cs.st==='cloak'||cs.st==='cape'?cpShade(cs.col,-.12):cs.st==='none'?pal.c:cs.col;
  const back=pose==='cheer';const hands=[];if(!back){hands.push(cpArm(c,-1,sleeve,pose,t),cpArm(c,1,sleeve,pose,t));}
  cf(c,cs,L,t);cpTorsoShade(c);
  if(back){hands.push(cpArm(c,-1,sleeve,pose,t),cpArm(c,1,sleeve,pose,t));}
  hands.forEach(([x,y])=>cpHand(c,x,y,L.skin));
  c.restore();
  // head follows the body with a small lag
  c.save();c.translate(0,bob*.75+(pose==='slump'?1.6:0));c.translate(0,-30);c.rotate(headTilt);c.scale(.9,.9);c.translate(0,30);
  const hasHat=hat&&CP_HAT[hat.st];
  cpHairBack(c,L);cpHead(c,L);cpHairFront(c,L,t);cpCheeks(c);
  cpEyes(c,L,expr,t,pid,face);cpBrows(c,L,expr);cpNose(c,L);
  const fg=face&&CP_FACE[face.st];
  if(fg&&CP_FACE_OVER_MOUTH[face.st]){fg(c,face,L,t);cpMouth(c,L,expr==='slump'||expr==='smug'?expr:expr==='cheer'||expr==='grin'?'cheer':expr==='gasp'?'gasp':'happy');if(face.st in CP_TASH)cpMoustache(c,face.col,!!CP_TASH[face.st]);}
  else{cpMouth(c,L,expr);if(fg)fg(c,face,L,t);}
  if(hasHat){const sw=Math.sin(t/700)*.02;c.save();c.translate(0,-50);c.rotate(sw);c.translate(0,50);CP_HAT[hat.st](c,hat,t);c.restore();}
  c.restore();}

const _drawKeeperOld=drawKeeper;
drawKeeper=function(c,x,y,pid,pl,t,opts={}){if(opts.chicken)return _drawKeeperOld(c,x,y,pid,pl,t,opts);
  c.save();c.translate(x+4,y+12.4);const lean=opts.dance?Math.sin(t/240)*.25:0;c.rotate(lean);c.scale(.2,.2);try{cpDraw(c,pid,pl,t,opts);}catch(e){console.warn('captain',e);}c.restore();};
// close-up: centre (cx,cy) of the head, size = head height in the canvas's units
function drawCaptainBust(c,cx,cy,size,pid,pl,t,opts={}){const k=size/34;c.save();c.translate(cx,cy);c.scale(k,k);c.translate(0,46.4);try{cpDraw(c,pid,pl,t,{...opts,bust:true});}catch(e){console.warn('bust',e);}c.restore();}

/* ---------- the header portrait is now a proper close-up ---------- */
avatarCanvas=function(pid){const cv=document.createElement('canvas');cv.width=128;cv.height=128;const c=cv.getContext('2d');c.setTransform(8,0,0,8,0,0);const g=c.createLinearGradient(0,0,0,16);g.addColorStop(0,'#BFE8F6');g.addColorStop(1,'#E9F7FC');c.fillStyle=g;c.fillRect(0,0,16,16);
  const ch=activeForfeitsFor(pid).some(f=>f.result==='chicken');if(ch){c.save();c.translate(3.2,2.4);c.scale(1.2,1.2);_drawKeeperOld(c,0,0,pid,S.players[pid],0,{chicken:true});c.restore();}
  else drawCaptainBust(c,8,7.6,9.2,pid,S.players[pid],0,{icon:true,expr:'happy'});return cv.toDataURL();};

/* ---------- cheer when you log anything ---------- */
if(typeof logAction==='function'&&!logAction.__cheer){const _la16=logAction;logAction=function(k,btn){try{S.cheerUntil=Date.now()+1500;}catch(e){}return _la16.apply(this,arguments);};logAction.__cheer=true;}

/* ---------- Gary, redrawn in the same style (same footprint as before) ---------- */
const _drawGullOld=drawGull;
drawGull=function(c,x,y,t){c.save();c.translate(x+4,y+3);c.scale(.2,.2);const up=Math.sin(t/150)>0;
  try{
  [[-3.4,9],[3.4,9]].forEach(([lx,ly])=>{c.beginPath();c.moveTo(lx,ly);c.lineTo(lx-.6,ly+7);cpStroke(c,'#E89A2E',1.8);c.beginPath();c.moveTo(lx-3,ly+7.4);c.lineTo(lx+2,ly+7.4);cpStroke(c,'#E89A2E',1.6);});
  c.beginPath();c.moveTo(-15,-3);c.lineTo(-27,-8);c.lineTo(-25,-1);c.lineTo(-27,4);c.closePath();cpFill(c,'#E9EDF0');
  cpEll(c,0,0,18,11,'#FFFFFF');c.save();c.beginPath();c.ellipse(0,0,18,11,0,0,TAU);c.clip();ell(c,-3,-8.6,19,8,'#C9D1D8');ell(c,6,6,12,6,'rgba(120,140,160,.12)');c.restore();
  c.beginPath();if(up){c.moveTo(-8,-5);c.quadraticCurveTo(-14,-26,-27,-25);c.quadraticCurveTo(-18,-14,-12,-3);}else{c.moveTo(-8,-4);c.quadraticCurveTo(-18,-4,-26,6);c.quadraticCurveTo(-14,3,-6,2);}c.closePath();cpFill(c,'#B9C3CC');
  c.save();c.clip();ell(c,up?-24:-23,up?-23:4.6,5,4,'#3A3F48');c.restore();
  cpEll(c,15,-7,8.6,8.2,'#FFFFFF');ell(c,12,-11,3.6,2,'rgba(255,255,255,.9)');
  c.beginPath();c.moveTo(21.4,-8.4);c.quadraticCurveTo(28,-8.6,31.4,-6);c.quadraticCurveTo(27,-3.6,21.4,-3.4);c.closePath();cpFill(c,'#F2C13A');disc(c,28.4,-5.6,1.1,'#E0453B');
  cpEll(c,17.6,-8.8,2.6,2.6,'#FFFFFF');disc(c,18.2,-8.6,1.4,'#1E1A16');disc(c,17.7,-9.3,.5,'#FFFFFF');
  c.beginPath();c.moveTo(13.6,-12.6);c.lineTo(20.6,-11.2);cpStroke(c,'#5A6470',1.5);
  }catch(e){c.restore();return _drawGullOld(c,x,y,t);}c.restore();};
