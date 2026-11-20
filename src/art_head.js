/* ============================== ART: soft, rounded pirate world ============================== */
// World units are 320x180; canvases are 960x540 and scaled 3x so curves stay smooth.
const W=320,H=180;
const TAU=Math.PI*2;
function R(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h);}
function disc(c,cx,cy,r,col){c.fillStyle=col;c.beginPath();c.arc(cx,cy,Math.max(.2,r),0,TAU);c.fill();}
function ell(c,cx,cy,rx,ry,col,rot=0){c.fillStyle=col;c.beginPath();c.ellipse(cx,cy,Math.max(.2,rx),Math.max(.2,ry),rot,0,TAU);c.fill();}
function rr(c,x,y,w,h,r,col){c.fillStyle=col;c.beginPath();c.roundRect?c.roundRect(x,y,w,h,Math.min(r,w/2,h/2)):c.rect(x,y,w,h);c.fill();}
function poly(c,pts,col){c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function line(c,x1,y1,x2,y2,col,w=1){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();}
function glowAt(c,x,y,r,rgb,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
function txt(c,s,x,y,col='#fff',size=8,align='left'){c.font=`600 ${size}px Fredoka, Nunito, sans-serif`;c.textAlign=align;c.textBaseline='top';c.lineJoin='round';c.lineWidth=2.4;c.strokeStyle='rgba(255,255,255,.92)';c.strokeText(s,x,y);c.fillStyle=col;c.fillText(s,x,y);}
function prep(cv){const c=cv.getContext('2d');c.setTransform(cv.width/W,0,0,cv.height/H,0,0);c.imageSmoothingEnabled=true;return c;}
let MARK_PATH=null;function markPath(){if(!MARK_PATH){try{MARK_PATH=new Path2D(document.querySelector('#funnal path').getAttribute('d'));}catch(e){MARK_PATH=new Path2D('M0 0h1000v1000H0z');}}return MARK_PATH;}
function drawMark(c,cx,cy,size,col){c.save();c.translate(cx-size/2,cy-size/2);c.scale(size/1000,size/1000);c.fillStyle=col;c.fill(markPath(),'evenodd');c.restore();}
const it=id=>ALL_ITEMS[id]||null;

/* ---------- Captain (8 wide x 12 tall, top-left at x,y) ---------- */
function keeperPal(pl,pid){const base=pid===C().playerIds[0];return{hair:base?'#7A4B2A':'#33363F',s:'#F6D2B2',e:'#3F3A30',c:base?'#E07A34':'#4A7EC2',c2:'#FFFFFF',p:'#55606E'};}
function drawKeeper(c,x,y,pid,pl,t,opts={}){
  if(opts.chicken){const b=Math.sin(t/180)>0?.5:0;ell(c,x+4,y+12,4,1,'rgba(0,0,0,.12)');ell(c,x+4,y+8+b,4.6,3.6,'#FFFFFF');disc(c,x+6,y+3.6+b,2.6,'#FFFFFF');disc(c,x+5.6,y+.8+b,1,'#E0453B');disc(c,x+6.8,y+1+b,.9,'#E0453B');
    poly(c,[[x+8.4,y+3.6+b],[x+10,y+4.2+b],[x+8.4,y+4.8+b]],'#F2A33A');disc(c,x+6.8,y+3.3+b,.45,'#3F3A30');R(c,x+3,y+11,.8,1.5,'#F2A33A');R(c,x+5,y+11,.8,1.5,'#F2A33A');return;}
  pl=pl||{};const pal=keeperPal(pl,pid);const coat=it(pl.coat),hat=it(pl.hat),face=it(pl.face);
  const bob=opts.dance?Math.sin(t/120)*1.4:Math.sin(t/700)*.25;const lean=opts.dance?Math.sin(t/240)*.25:0;
  ell(c,x+4,y+12,3.6,.9,'rgba(0,0,0,.12)');
  c.save();c.translate(x+4,y+12);c.rotate(lean);c.translate(-x-4,-y-12);
  rr(c,x+2.2,y+9.6,1.6,2.6,.8,pal.p);rr(c,x+4.2,y+9.6,1.6,2.6,.8,pal.p);rr(c,x+1.9,y+11.4,2.1,1,.5,'#3F3A30');rr(c,x+4.1,y+11.4,2.1,1,.5,'#3F3A30');
  const cc=coat?coat.col:pal.c,c2=coat?.col2||'#FFFFFF';
  if(coat?.st==='cloak'){poly(c,[[x+.4,y+6.5+bob],[x+7.6,y+6.5+bob],[x+8.4,y+11+bob],[x-.4,y+11+bob]],cc);}
  rr(c,x+1.3,y+6+bob,5.4,4.6,2,cc);
  if(coat?.st==='stripe'){for(let i=0;i<3;i++)R(c,x+1.6,y+6.8+i*1.3+bob,4.8,.55,c2);}
  if(coat?.st==='vest'){rr(c,x+3.2,y+6.2+bob,1.6,4.2,.7,c2);}
  if(coat?.st==='trim'||coat?.st==='cloak'){R(c,x+3.75,y+6.2+bob,.5,4.2,c2);disc(c,x+3,y+7.6+bob,.3,c2);disc(c,x+3,y+9+bob,.3,c2);disc(c,x+5,y+7.6+bob,.3,c2);disc(c,x+5,y+9+bob,.3,c2);}
  if(!coat){R(c,x+1.5,y+8.4+bob,5,.8,'#3F3A30');rr(c,x+3.4,y+8.2+bob,1.2,1.2,.3,'#DDA94D');}
  disc(c,x+1.2,y+8.2+bob,1,pal.s);disc(c,x+6.8,y+8.2+bob,1,pal.s);
  disc(c,x+4,y+3.6+bob,3.5,pal.s);
  c.fillStyle=pal.hair;c.beginPath();c.arc(x+4,y+3.2+bob,3.7,Math.PI*1.02,Math.PI*1.98);c.fill();
  // face gear under hats
  if(face){const f=face.st,fc=face.col;
    if(f==='stubble'){c.globalAlpha=.35;ell(c,x+4,y+5.6+bob,2.6,1.4,fc);c.globalAlpha=1;}
    if(f==='beard'){c.fillStyle=fc;c.beginPath();c.moveTo(x+.8,y+4+bob);c.quadraticCurveTo(x+4,y+10.5+bob,x+7.2,y+4+bob);c.quadraticCurveTo(x+4,y+6.4+bob,x+.8,y+4+bob);c.fill();}
    if(f==='moustache'){c.strokeStyle=fc;c.lineWidth=.7;c.lineCap='round';c.beginPath();c.moveTo(x+4,y+5.4+bob);c.quadraticCurveTo(x+2.4,y+6.2+bob,x+1.6,y+5+bob);c.moveTo(x+4,y+5.4+bob);c.quadraticCurveTo(x+5.6,y+6.2+bob,x+6.4,y+5+bob);c.stroke();}
  }
  disc(c,x+2.7,y+4.3+bob,.48,pal.e);
  if(face?.st==='patch'){ell(c,x+5.3,y+4.2+bob,.95,.8,'#2E2B33');line(c,x+.8,y+2.6+bob,x+7.4,y+3.6+bob,'#2E2B33',.35);}else disc(c,x+5.3,y+4.3+bob,.48,pal.e);
  if(face?.st==='monocle'){c.strokeStyle=face.col;c.lineWidth=.35;c.beginPath();c.arc(x+5.3,y+4.3+bob,.95,0,TAU);c.stroke();line(c,x+5.8,y+5.1+bob,x+6.4,y+7+bob,face.col,.2);}
  if(face?.st==='earring'){c.strokeStyle=face.col;c.lineWidth=.35;c.beginPath();c.arc(x+.6,y+5.2+bob,.6,0,TAU);c.stroke();}
  c.globalAlpha=.45;disc(c,x+1.9,y+5.3+bob,.7,'#F49A9A');disc(c,x+6.1,y+5.3+bob,.7,'#F49A9A');c.globalAlpha=1;
  if(face?.st!=='beard'){c.strokeStyle='#B5654A';c.lineWidth=.3;c.beginPath();c.arc(x+4,y+5.2+bob,.6,.2,Math.PI-.2);c.stroke();}
  // hats
  if(hat){const h=hat.st,hc=hat.col,hy=y+bob;
    if(h==='bandana'){c.fillStyle=hc;c.beginPath();c.arc(x+4,hy+3.1,3.85,Math.PI,0);c.fill();poly(c,[[x+7.4,hy+2.6],[x+9.2,hy+2.2],[x+8.6,hy+4]],hc);if(hat.id==='hat_skull'){disc(c,x+4,hy+1.4,.8,'#fff');}else{disc(c,x+2.6,hy+1.6,.35,'#fff');disc(c,x+5,hy+.8,.35,'#fff');}}
    if(h==='cap'||h==='beanie'){c.fillStyle=hc;c.beginPath();c.arc(x+4,hy+3,3.9,Math.PI,0);c.fill();if(h==='cap')rr(c,x+4,hy+2.4,4.6,1,.5,hc);else{disc(c,x+4,hy-1,1,'#fff');R(c,x+.2,hy+2.4,7.6,1,'rgba(255,255,255,.35)');}}
    if(h==='straw'){ell(c,x+4,hy+2.4,6,1.3,hc);c.fillStyle=hc;c.beginPath();c.arc(x+4,hy+2.2,3,Math.PI,0);c.fill();R(c,x+1,hy+1.5,6,.7,'#D9485F');}
    if(h==='tricorn'||h==='feather'){poly(c,[[x-1.4,hy+2.4],[x+4,hy-2],[x+9.4,hy+2.4],[x+4,hy+1.2]],hc);c.fillStyle=hc;c.beginPath();c.arc(x+4,hy+1.6,3,Math.PI,0);c.fill();R(c,x-.6,hy+1.8,9.2,.4,'#DDA94D');
      if(h==='feather'){c.fillStyle='#F2E7FF';c.beginPath();c.ellipse(x+6.5,hy-1.6,1,3.2,.9,0,TAU);c.fill();}else if(hat.id==='hat_tricorn'){disc(c,x+4,hy,.8,'#fff');}}
    if(h==='bicorne'){c.fillStyle=hc;c.beginPath();c.ellipse(x+4,hy+.6,6.4,2.4,0,Math.PI,0);c.fill();R(c,x-2.2,hy+.4,12.4,.5,'#F2C462');disc(c,x+4,hy-.6,.9,'#F2C462');}
    if(h==='crown'){poly(c,[[x+1,hy+1],[x+1,hy-2],[x+2.5,hy-.5],[x+4,hy-2.6],[x+5.5,hy-.5],[x+7,hy-2],[x+7,hy+1]],hc);disc(c,x+4,hy-.2,.45,'#D9485F');}
    if(h==='halo'){c.strokeStyle=hc;c.lineWidth=.8;c.beginPath();c.ellipse(x+4,hy-1.4,3,1,0,0,TAU);c.stroke();}
    if(h==='lantern'){rr(c,x+2.8,hy-2.6,2.4,3,.8,'#FFE7A0');R(c,x+3.6,hy-3.4,.8,1,'#3F5160');}
    if(h==='kraken'){c.fillStyle=hc;c.beginPath();c.arc(x+4,hy+2.6,4.2,Math.PI,0);c.fill();for(let i=0;i<3;i++){c.strokeStyle=hc;c.lineWidth=.9;c.beginPath();c.moveTo(x+1+i*3,hy+2.4);c.quadraticCurveTo(x+i*3,hy+5,x+1.6+i*3,hy+6);c.stroke();}disc(c,x+2.6,hy+.6,.6,'#fff');disc(c,x+5.4,hy+.6,.6,'#fff');}
  }
  c.restore();
}
function drawGull(c,x,y,t){const f=Math.sin(t/150)>0;ell(c,x+4,y+3,3.6,2.2,'#FFFFFF');disc(c,x+7,y+1.6,1.6,'#FFFFFF');poly(c,[[x+8.4,y+1.4],[x+10,y+2],[x+8.4,y+2.5]],'#F2A33A');disc(c,x+7.4,y+1.2,.35,'#3F3A30');
  ell(c,x+3,y+(f?1:2.6),3,1.1,'#D8DEE6',f?-.5:.2);R(c,x+3.4,y+5,.6,1.4,'#F2A33A');R(c,x+5,y+5,.6,1.4,'#F2A33A');}
function drawGnome(c,x,y){poly(c,[[x,y-4],[x+3,y-12],[x+6,y-4]],'#D9485F');disc(c,x+3,y-3.4,2,'#F6D2B2');poly(c,[[x+1,y-3],[x+3,y+1],[x+5,y-3]],'#FFFFFF');rr(c,x+.8,y-1,4.4,3.6,1.4,'#4A7EC2');disc(c,x+2.2,y-3.6,.35,'#3F3A30');disc(c,x+3.8,y-3.6,.35,'#3F3A30');}

/* ---------- Parrot companion ---------- */
function drawMoth(c,x,y,stage,t,acc,flying=true){
  const flap=flying&&Math.sin(t/90)>0;
  if(stage===0){glowAt(c,x,y,7,'255,226,140',.45);ell(c,x,y,3,3.8,'#FFF6DE');disc(c,x-1,y-1,.6,'#9CCB7A');disc(c,x+1,y+1,.5,'#E07A34');disc(c,x+.6,y-2,.4,'#4A7EC2');ell(c,x-1,y-1.6,.8,1.2,'rgba(255,255,255,.7)');return;}
  if(stage<=2){const r=stage===1?2.6:3.4;const col=stage===1?'#B9E3A0':'#8CCB63';
    disc(c,x,y,r,col);disc(c,x-r*.15,y-r*.9,r*.7,col);disc(c,x-r*.15,y-r*1.6,r*.25,col);disc(c,x+r*.15,y-r*1.7,r*.2,col);
    disc(c,x-r*.4,y-r,.45,'#3F3A30');poly(c,[[x+r*.2,y-r*1],[x+r*.9,y-r*.75],[x+r*.2,y-r*.5]],'#F2A33A');
    ell(c,x+r*.3,y+r*.1,r*.5,r*.35,'#6FB34E',flap?-.6:.2);R(c,x-.8,y+r*.9,.5,1,'#F2A33A');R(c,x+.4,y+r*.9,.5,1,'#F2A33A');}
  else{
    const pal=stage===3?{b:'#5FBF5A',w:'#3F9C47',h:'#7ED36A',t:'#E0453B',k:'#F2E2C4'}:stage===4?{b:'#E0453B',w:'#3E7FD9',h:'#E85A4A',t:'#F2C230',k:'#F6EBD8'}:{b:'#F2A33A',w:'#E0453B',h:'#F7C25A',t:'#FFE07A',k:'#FFF3D0'};
    const s=stage===5?1.25:stage===4?1.1:1;
    if(stage===5)glowAt(c,x,y,12,'255,180,80',.4);
    c.fillStyle=pal.t;c.beginPath();c.moveTo(x-1*s,y+2*s);c.quadraticCurveTo(x-4*s,y+8*s,x-3*s,y+10*s);c.quadraticCurveTo(x-.5*s,y+7*s,x+.8*s,y+2.6*s);c.fill();
    if(stage===5){for(let i=0;i<3;i++){c.fillStyle=['#FFE07A','#F2A33A','#E0453B'][i];c.beginPath();c.ellipse(x-2.5*s-i,y+9*s+Math.sin(t/120+i)*.6,.8,2,.4,0,TAU);c.fill();}}
    ell(c,x,y,3*s,4*s,pal.b);disc(c,x+.6*s,y-3.6*s,2.6*s,pal.h);
    ell(c,x-.8*s,y+.4*s,2*s,3.2*s,pal.w,flap?-.9:.15);
    disc(c,x+1.6*s,y-4*s,1*s,'#FFFFFF');disc(c,x+1.8*s,y-4*s,.5*s,'#3F3A30');
    c.fillStyle=pal.k;c.beginPath();c.moveTo(x+2.8*s,y-3.8*s);c.quadraticCurveTo(x+5*s,y-3.6*s,x+4*s,y-1.6*s);c.lineTo(x+2.8*s,y-2.4*s);c.fill();
    R(c,x-.6*s,y+3.6*s,.6,1.2,'#8A8A8A');R(c,x+.8*s,y+3.6*s,.6,1.2,'#8A8A8A');
    if(acc==='moth_bow'){disc(c,x,y-.8*s,.8,'#D9485F');disc(c,x+1.6,y-.8*s,.8,'#D9485F');}
    if(acc==='moth_scarf'){rr(c,x-1.6,y-1.2*s,4,1.2,.6,'#4A7EC2');R(c,x-1.4,y-.4*s,1,2,'#4A7EC2');}
    if(acc==='moth_monocle'){c.strokeStyle='#DDA94D';c.lineWidth=.4;c.beginPath();c.arc(x+1.8*s,y-4*s,1.1*s,0,TAU);c.stroke();}
    if(acc==='moth_patch'){disc(c,x+1.8*s,y-4*s,1*s,'#2E2B33');}
    if(acc==='moth_hat'){poly(c,[[x-1.6*s,y-5.6*s],[x+.6*s,y-8.4*s],[x+3*s,y-5.6*s]],'#2E2B33');R(c,x-1.8*s,y-5.9*s,5*s,.5,'#DDA94D');}
    if(acc==='moth_chain'){c.strokeStyle='#F2C462';c.lineWidth=.5;c.beginPath();c.arc(x+.6*s,y-1.6*s,2*s,.3,Math.PI-.3);c.stroke();disc(c,x+.6*s,y+.4*s,.6,'#F2C462');}
    if(acc==='m_moth_crown'){poly(c,[[x-.8*s,y-5.8*s],[x-.8*s,y-7.6*s],[x+.4*s,y-6.6*s],[x+.9*s,y-8.2*s],[x+1.4*s,y-6.6*s],[x+2.6*s,y-7.6*s],[x+2.6*s,y-5.8*s]],'#DDA94D');}
  }
}

function drawLighthouse(c,x,y,h,col,t,opts={}){
  const w=10;const a=opts.gold?'#F2CF7A':'#FFFFFF',b=col||'#D9485F';
  ell(c,x+w/2,y,w*.8,2,'rgba(0,0,0,.1)');
  c.save();c.beginPath();c.moveTo(x+1,y);c.lineTo(x+2,y-h);c.lineTo(x+w-2,y-h);c.lineTo(x+w-1,y);c.closePath();c.clip();
  for(let i=0;i<h;i+=7)R(c,x,y-h+i,w,7,(i/7)%2?b:a);c.restore();
  rr(c,x-.5,y-h-2.5,w+1,2.5,1.2,'#3F5160');rr(c,x+1.2,y-h-9,w-2.4,7,2,'#3F5160');rr(c,x+2.2,y-h-8,w-4.4,5,1.5,'#FFF2BC');
  c.fillStyle=b;c.beginPath();c.arc(x+w/2,y-h-9,4,Math.PI,0);c.fill();
  if(opts.lit!==false){const g=c.createRadialGradient(x+w/2,y-h-5.5,0,x+w/2,y-h-5.5,14);g.addColorStop(0,'rgba(255,236,160,.55)');g.addColorStop(1,'rgba(255,236,160,0)');c.fillStyle=g;c.beginPath();c.arc(x+w/2,y-h-5.5,14,0,7);c.fill();}
  rr(c,x+3.2,y-7,3.6,7,1.8,'#7A5A3A');
}

/* ---------- Flags & sails ---------- */
function drawSymbolBase(c,sym,cx,cy,s,col){
  if(sym==='skull'){disc(c,cx,cy-.4*s,1.6*s,col);rr(c,cx-1*s,cy+.6*s,2*s,1.2*s,.4*s,col);disc(c,cx-.6*s,cy-.4*s,.45*s,'rgba(0,0,0,.75)');disc(c,cx+.6*s,cy-.4*s,.45*s,'rgba(0,0,0,.75)');line(c,cx-2.2*s,cy+2.2*s,cx+2.2*s,cy+1*s,col,.6*s);line(c,cx-2.2*s,cy+1*s,cx+2.2*s,cy+2.2*s,col,.6*s);}
  else if(sym==='swords'){line(c,cx-2*s,cy-2*s,cx+2*s,cy+2*s,col,.5*s);line(c,cx+2*s,cy-2*s,cx-2*s,cy+2*s,col,.5*s);line(c,cx-2.4*s,cy+1.2*s,cx-1.2*s,cy+2.4*s,'#DDA94D',.5*s);line(c,cx+2.4*s,cy+1.2*s,cx+1.2*s,cy+2.4*s,'#DDA94D',.5*s);}
  else if(sym==='anchor'){line(c,cx,cy-2*s,cx,cy+2*s,col,.5*s);line(c,cx-1.2*s,cy-1*s,cx+1.2*s,cy-1*s,col,.45*s);c.strokeStyle=col;c.lineWidth=.5*s;c.beginPath();c.arc(cx,cy+.6*s,1.8*s,.2,Math.PI-.2);c.stroke();c.beginPath();c.arc(cx,cy-2.4*s,.6*s,0,TAU);c.stroke();}
  else if(sym==='heart'){c.fillStyle=col;c.beginPath();c.moveTo(cx,cy+2*s);c.bezierCurveTo(cx-3*s,cy,cx-1.6*s,cy-2.6*s,cx,cy-1*s);c.bezierCurveTo(cx+1.6*s,cy-2.6*s,cx+3*s,cy,cx,cy+2*s);c.fill();}
  else if(sym==='star'){c.fillStyle=col;c.beginPath();for(let i=0;i<10;i++){const a=i/10*TAU-Math.PI/2,r=(i%2?1:2.4)*s;c.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}c.fill();}
  else if(sym==='parrot'){ell(c,cx,cy+.4*s,1.3*s,1.9*s,col);disc(c,cx+.5*s,cy-1.4*s,1*s,col);poly(c,[[cx+1.3*s,cy-1.5*s],[cx+2.3*s,cy-1*s],[cx+1.3*s,cy-.7*s]],'#F2A33A');}
  else if(sym==='cupcake'){poly(c,[[cx-1.6*s,cy],[cx+1.6*s,cy],[cx+1.1*s,cy+2*s],[cx-1.1*s,cy+2*s]],'#E8B46A');disc(c,cx,cy-.4*s,1.7*s,col);disc(c,cx,cy-2.2*s,.5*s,'#D9485F');}
  else if(sym==='kraken'){disc(c,cx,cy-.8*s,1.6*s,col);for(let i=-1;i<=1;i++){c.strokeStyle=col;c.lineWidth=.5*s;c.beginPath();c.moveTo(cx+i*s,cy+.4*s);c.quadraticCurveTo(cx+i*2*s,cy+1.6*s,cx+i*1.2*s,cy+2.6*s);c.stroke();}}
  else if(sym==='crown'){poly(c,[[cx-2*s,cy+1.4*s],[cx-2*s,cy-1.2*s],[cx-1*s,cy],[cx,cy-2*s],[cx+1*s,cy],[cx+2*s,cy-1.2*s],[cx+2*s,cy+1.4*s]],col);}
  else if(sym==='diamond'){poly(c,[[cx,cy-2.4*s],[cx+1.8*s,cy-.6*s],[cx,cy+2.4*s],[cx-1.8*s,cy-.6*s]],col);line(c,cx-1.8*s,cy-.6*s,cx+1.8*s,cy-.6*s,'rgba(255,255,255,.6)',.25*s);}
  else if(sym==='mark'){drawMark(c,cx,cy,4.6*s,col);}
}
function drawFlag(c,x,y,fid,t,w=12,h=8){const f=it(fid)||it('flag_skull');c.save();const wave=i=>Math.sin(t/220+i*.9)*.9;
  c.fillStyle=f.col;c.beginPath();c.moveTo(x,y);for(let i=0;i<=4;i++)c.lineTo(x+i*w/4,y+wave(i));for(let i=4;i>=0;i--)c.lineTo(x+i*w/4,y+h+wave(i));c.closePath();c.fill();
  drawSymbol(c,f.sym,x+w/2,y+h/2+wave(2),h/7.4,f.sc);c.restore();}
function sailPath(c,x,y,w,h,billow){c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+w/2,y-1.5,x+w,y);c.quadraticCurveTo(x+w+billow,y+h/2,x+w-1,y+h);c.quadraticCurveTo(x+w/2,y+h+1.5,x+1,y+h);c.quadraticCurveTo(x+billow,y+h/2,x,y);c.closePath();}
function drawSail(c,x,y,w,h,sid,t,showMark){const s=it(sid)||it('sail_canvas');const billow=2.2+Math.sin(t/600)*.6;
  c.save();sailPath(c,x,y,w,h,billow);c.fillStyle=s.col;c.fill();c.clip();
  if(s.pat==='stripe')for(let i=0;i<6;i+=2)R(c,x-3,y+i*h/6,w+6,h/6,s.col2);
  if(s.pat==='patch'){R(c,x+w*.15,y+h*.2,w*.25,h*.3,s.col2);R(c,x+w*.6,y+h*.55,w*.22,h*.28,'#D9C08E');}
  if(s.pat==='grad'){const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,s.col);g.addColorStop(1,s.col2);c.fillStyle=g;c.fillRect(x-3,y-2,w+6,h+4);}
  if(s.pat==='stars')for(let i=0;i<9;i++)disc(c,x+((i*37)%100)/100*w,y+((i*61)%100)/100*h,.45,s.col2);
  if(s.pat==='rainbow')['#E0453B','#F2A33A','#F2D24A','#5DBE9C','#4A7EC2','#9B5DE5'].forEach((col,i)=>R(c,x-3,y+i*h/6,w+6,h/6+.2,col));
  if(s.pat==='mark'&&showMark)drawMark(c,x+w/2+1,y+h/2,Math.min(w,h)*.62,s.col2);
  if(s.pat==='skull'&&showMark)drawSymbol(c,'skull',x+w/2+1,y+h/2,Math.min(w,h)/9,s.col2);
  c.fillStyle='rgba(0,0,0,.06)';c.fillRect(x+w*.62,y-2,w,h+4);c.restore();
}

/* ---------- Figureheads & deck items ---------- */
function drawFigureBase(c,x,y,fid){const f=it(fid);if(!f)return;const st=f.st;
  if(st==='mermaid'){disc(c,x+1.6,y-3.4,1.5,'#F6D2B2');ell(c,x+.8,y-2.6,1.6,2.4,'#C9654A');ell(c,x+2,y,1.4,2.2,'#5DBE9C');}
  else if(st==='gull'){ell(c,x+1.6,y-1.4,2.6,1.6,'#FFFFFF');disc(c,x+3.6,y-2.8,1.3,'#FFFFFF');poly(c,[[x+4.6,y-3],[x+6,y-2.6],[x+4.6,y-2.2]],'#F2A33A');}
  else if(st==='dragon'){c.fillStyle='#3FA59A';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+2,y-5,x+5,y-5.4);c.lineTo(x+6.4,y-4.4);c.lineTo(x+4.4,y-3.6);c.quadraticCurveTo(x+2.6,y-2,x+2,y+1);c.fill();disc(c,x+4.6,y-4.8,.35,'#F2C462');poly(c,[[x+2.6,y-5],[x+3,y-7],[x+3.6,y-5.2]],'#2F7A6E');}
  else if(st==='lion'){disc(c,x+2.6,y-3,2.6,'#C98A2A');disc(c,x+2.8,y-3,1.7,'#F2C462');disc(c,x+3.4,y-3.4,.3,'#3F3A30');}
  else if(st==='kraken'){disc(c,x+2.4,y-3.6,2.2,'#9B5DE5');for(let i=0;i<3;i++){c.strokeStyle='#9B5DE5';c.lineWidth=.8;c.beginPath();c.moveTo(x+1.4+i,y-2);c.quadraticCurveTo(x+i*1.6,y+.6,x+2+i,y+2);c.stroke();}disc(c,x+3,y-4,.5,'#fff');}
  else if(st==='owl'){ell(c,x+2.4,y-2.6,2,2.8,'#E8BC52');disc(c,x+1.8,y-3.6,.7,'#FFF6D8');disc(c,x+3.2,y-3.6,.7,'#FFF6D8');disc(c,x+1.8,y-3.6,.3,'#3F3A30');disc(c,x+3.2,y-3.6,.3,'#3F3A30');}
}
function drawDeckItemBase(c,id,x,y,t){const d=it(id);if(!d)return;const st=d.st;
  if(st==='barrels'){rr(c,x-4,y-5,3.6,5,1.2,'#B98552');rr(c,x,y-5,3.6,5,1.2,'#A8704A');R(c,x-4,y-3.4,7.6,.5,'#6B4429');}
  else if(st==='cannon'){rr(c,x-4,y-3.6,7,2.6,1.2,'#55606E');disc(c,x-2,y-.8,1.2,'#7A4E30');disc(c,x+1.6,y-.8,1.2,'#7A4E30');disc(c,x+3,y-2.3,.7,'#2E2B33');}
  else if(st==='lanterns'){c.strokeStyle='#7A4E30';c.lineWidth=.3;c.beginPath();c.moveTo(x-6,y-8);c.quadraticCurveTo(x,y-5,x+6,y-8);c.stroke();for(let i=-1;i<=1;i++){glowAt(c,x+i*4,y-6.4+Math.abs(i)*-.6,2.6,'255,220,130',.5+.2*Math.sin(t/300+i));rr(c,x+i*4-.8,y-7.4+Math.abs(i)*-.6,1.6,2,.6,'#F2C462');}}
  else if(st==='chest'){rr(c,x-3.4,y-4,6.8,4,.8,'#A8704A');c.fillStyle='#8A5A3A';c.beginPath();c.ellipse(x,y-4,3.4,1.6,0,Math.PI,0);c.fill();R(c,x-.5,y-4,1,4,'#F2C462');disc(c,x-1.6,y-4.8,.6,'#F2C462');disc(c,x+1.2,y-5,.6,'#F2C462');}
  else if(st==='bunting'){c.strokeStyle='#7A4E30';c.lineWidth=.3;c.beginPath();c.moveTo(x-7,y-9);c.quadraticCurveTo(x,y-6,x+7,y-9);c.stroke();for(let i=-3;i<=3;i++)poly(c,[[x+i*2-.8,y-7.6+Math.abs(i)*-.35],[x+i*2+.8,y-7.6+Math.abs(i)*-.35],[x+i*2,y-5.8+Math.abs(i)*-.35]],['#D9485F','#F2C230','#5DBE9C','#4A7EC2'][(i+3)%4]);}
  else if(st==='plants'){rr(c,x-2,y-2.4,4,2.4,.8,'#C9654A');for(let i=0;i<5;i++){c.fillStyle='#5FAE4E';c.beginPath();c.ellipse(x+Math.cos(i*1.3)*1.6,y-4.4,.8,2.4,i*1.3-.5,0,TAU);c.fill();}}
  else if(st==='wheel'){c.strokeStyle='#E8BC52';c.lineWidth=.6;c.beginPath();c.arc(x,y-4,2.6,0,TAU);c.stroke();for(let i=0;i<8;i++){const a=i/8*TAU+t/2000;line(c,x,y-4,x+Math.cos(a)*3.6,y-4+Math.sin(a)*3.6,'#E8BC52',.4);}disc(c,x,y-4,.8,'#E8BC52');}
}

/* ---------- The ship (bow faces right; x,y = waterline centre; s = scale) ---------- */
function drawShip(c,x,y,s,pl,t,opts={}){
  pl=pl||{};const hull=it(pl.hull||SHIP_DEFAULT.hull)||it('hull_oak');const gild=pl.effect==='goldlh';
  const rock=Math.sin(t/900+(opts.phase||0))*.035,bob=Math.sin(t/650+(opts.phase||0))*1.1;
  c.save();c.translate(x,y+bob*s*.4);c.rotate(rock);c.scale(s,s);
  ell(c,0,4,34,3.2,'rgba(30,60,90,.18)');
  if(pl.trail)drawWake(c,-34,1,(it(pl.trail)||{}).st,t,1);
  // masts and sails
  R(c,-1,-58,2,46,'#7A4E30');R(c,-19,-44,1.6,32,'#7A4E30');
  drawSail(c,-14,-54,24,13,pl.sail,t,false);drawSail(c,-17,-39,30,20,pl.sail,t,true);drawSail(c,-29,-40,18,22,pl.sail,t,false);
  c.fillStyle=(it(pl.sail)||it('sail_canvas')).col;c.beginPath();c.moveTo(2,-50);c.quadraticCurveTo(18,-30,30,-14);c.lineTo(3,-14);c.closePath();c.fill();c.fillStyle='rgba(0,0,0,.05)';c.fill();
  rr(c,-4.5,-48,9,3,1.2,'#8A5A3A');
  drawFlag(c,1,-66,pl.flag||SHIP_DEFAULT.flag,t);R(c,-.4,-67,.8,10,'#7A4E30');
  if(opts.em!=null){R(c,-.4,-76,.8,10,'#7A4E30');disc(c,0,-76.4,1,'#E2AE45');drawEmissary(c,.4,-75,opts.em,t);}
  // rigging
  c.strokeStyle='rgba(90,60,40,.55)';c.lineWidth=.35;c.beginPath();c.moveTo(0,-58);c.lineTo(32,-15);c.moveTo(0,-58);c.lineTo(-32,-14);c.moveTo(-18,-44);c.lineTo(-33,-14);c.stroke();
  // captain & parrot at the helm
  if(opts.captain!==false&&opts.pid){c.save();c.translate(-24,-27);drawKeeper(c,0,0,opts.pid,pl,t,{chicken:opts.chicken,dance:opts.dance});c.restore();
    if(opts.moth!=null)drawMoth(c,-15,-23,opts.moth,t,pl.moth,false);}
  if(opts.pet)drawPet(c,opts.pet,-4,-16,t,.6);
  // deck items
  (pl.deck||[]).slice(0,3).forEach((id,i)=>id&&drawDeckItem(c,id,[-8,6,18][i],-14,t));
  // hull
  c.fillStyle=hull.col;c.beginPath();c.moveTo(-34,-16);c.lineTo(30,-16);c.quadraticCurveTo(38,-17,40,-22);c.quadraticCurveTo(39,-6,24,2);c.quadraticCurveTo(0,5,-24,2);c.quadraticCurveTo(-33,-2,-36,-18);c.closePath();c.fill();
  c.save();c.clip();R(c,-40,-9,82,4,hull.col2);R(c,-40,-2,82,8,hull.col2);c.restore();
  R(c,-35,-17.2,66,1.6,gild?'#F2C462':'#6B4429');
  for(let i=0;i<5;i++){disc(c,-20+i*10,-11.5,1.6,gild?'#F2C462':'#DDA94D');disc(c,-20+i*10,-11.5,1.05,'#2E3A5C');}
  rr(c,-38,-24,6,8,1.5,hull.col2);R(c,-38,-24.6,6,1,gild?'#F2C462':'#6B4429');
  if(pl.figure)drawFigure(c,37,-21,pl.figure);
  // water lapping at the hull
  c.fillStyle='rgba(95,207,216,.45)';c.beginPath();c.moveTo(-40,0);for(let i=0;i<=8;i++)c.quadraticCurveTo(-40+i*10+5,-1.6+Math.sin(t/300+i)*.6,-40+(i+1)*10,0);c.lineTo(42,6);c.lineTo(-40,6);c.closePath();c.fill();
  c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=.6;c.beginPath();for(let i=0;i<4;i++){const sx=-30+i*16+Math.sin(t/500+i)*2;c.moveTo(sx,1);c.quadraticCurveTo(sx+3,-.4,sx+6,1);}c.stroke();
  // cannon smoke
  if(opts.firing&&opts.firing>0){const p=1-opts.firing;for(let i=0;i<4;i++)disc(c,34+p*10+i*2,-14-p*6-i,2.2+p*3,`rgba(255,255,255,${.7*(1-p)})`);}
  c.restore();
}

/* ---------- Hover/tap info regions (world units) ---------- */
function hit(x,y,w,h,title,body,act){S.hits.push({x,y,w,h,title,body,act});}
