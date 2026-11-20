/* ============================== FIT PASS (Stage 0b, take two) ==============================
   The captains keep their original look. These pieces are redrawn in that same flat style so
   they sit properly on the head and body: beards follow the jaw with the mouth under a
   moustache, chops stay on the cheeks, hats sit on the head instead of perching, and the
   kraken cape hangs behind the legs. Same shapes, colours and sizes as everything else. */
function fitDk(col,k){try{return bkShade(col,k);}catch(e){return col;}}
function fitBeardPath(c,x,y,chin){c.beginPath();c.moveTo(x+.55,y+3.5);c.quadraticCurveTo(x+.5,y+6.4,x+1.7,y+7.5);
  // locks along the bottom edge
  const tips=[[x+2.6,y+chin-.35],[x+3.4,y+chin],[x+4.6,y+chin],[x+5.4,y+chin-.35],[x+6.3,y+7.5]];let px=x+1.7,py=y+7.5;
  tips.forEach(([tx,ty])=>{c.quadraticCurveTo((px+tx)/2,Math.max(py,ty)+.55,tx,ty);px=tx;py=ty;});
  c.quadraticCurveTo(x+7.5,y+6.4,x+7.45,y+3.5);c.quadraticCurveTo(x+7,y+5.2,x+5.6,y+5.6);c.quadraticCurveTo(x+4,y+6.2,x+2.4,y+5.6);c.quadraticCurveTo(x+1,y+5.2,x+.55,y+3.5);c.closePath();}
function fitBeard(c,x,y,col,chin){c.save();c.translate(0,.28);fitBeardPath(c,x,y,chin);c.fillStyle=fitDk(col,-.28);c.fill();c.restore();
  fitBeardPath(c,x,y,chin);c.fillStyle=col;c.fill();
  c.save();fitBeardPath(c,x,y,chin);c.clip();[[2.2,6.3,2.6,8.2],[3.6,6.6,3.7,8.8],[5,6.6,4.9,8.8],[6.1,6.2,5.6,8.1]].forEach(([a,b,cx,d])=>{c.beginPath();c.moveTo(x+a,y+b);c.quadraticCurveTo(x+cx-.2,y+(b+d)/2,x+cx,y+d);c.strokeStyle=fitDk(col,-.3);c.lineWidth=.16;c.stroke();});
  c.beginPath();c.moveTo(x+1.2,y+4.6);c.quadraticCurveTo(x+1.4,y+6.6,x+2.4,y+7.6);c.strokeStyle=fitDk(col,.3);c.lineWidth=.22;c.stroke();c.restore();}
function fitTash(c,x,y,col,big){const yy=y+5.35;[-1,1].forEach(s=>{c.fillStyle=col;c.beginPath();c.moveTo(x+4,yy-.15);c.quadraticCurveTo(x+4+s*1.1,yy-.65,x+4+s*(big?2.9:2.2),yy+(big?-.2:.3));
    if(big){c.quadraticCurveTo(x+4+s*3.6,yy-.9,x+4+s*3.1,yy-1.2);c.quadraticCurveTo(x+4+s*3.5,yy-.3,x+4+s*2.7,yy+.55);}else c.quadraticCurveTo(x+4+s*1.5,yy+.75,x+4,yy+.35);c.quadraticCurveTo(x+4+s*.3,yy+.45,x+4,yy+.25);c.closePath();c.fill();});
  disc(c,x+3.1,yy-.3,.22,'rgba(255,255,255,.3)');}

/* ---------- faces ---------- */
W_FACE.beard=(c,x,y,f)=>{fitBeard(c,x,y,f.col,8.9);fitTash(c,x,y,fitDk(f.col,-.12),false);};
W_FACE.braid=(c,x,y,f)=>{fitBeard(c,x,y,f.col,8.6);[3.3,4.7].forEach(bx=>{for(let i=0;i<3;i++){ell(c,x+bx,y+8.9+i*.62,.42,.36,i%2?fitDk(f.col,-.15):f.col);}disc(c,x+bx,y+10.75,.32,'#F2C462');disc(c,x+bx-.1,y+10.65,.1,'rgba(255,255,255,.7)');});fitTash(c,x,y,fitDk(f.col,-.12),false);};
W_FACE.goatee=(c,x,y,f)=>{c.fillStyle=f.col;c.beginPath();c.moveTo(x+3.1,y+6);c.quadraticCurveTo(x+3.2,y+7.4,x+3.75,y+8.2);c.quadraticCurveTo(x+4,y+7.8,x+4.25,y+8.2);c.quadraticCurveTo(x+4.8,y+7.4,x+4.9,y+6);c.quadraticCurveTo(x+4,y+6.4,x+3.1,y+6);c.closePath();c.fill();
  c.beginPath();c.moveTo(x+4,y+6.3);c.lineTo(x+4,y+7.7);c.strokeStyle=fitDk(f.col,-.3);c.lineWidth=.14;c.stroke();};
W_FACE.mutton=(c,x,y,f)=>{[-1,1].forEach(s=>{const ex=s<0?x+.55:x+7.45;c.fillStyle=f.col;c.beginPath();c.moveTo(ex,y+3.2);c.quadraticCurveTo(ex-s*.1,y+5.5,ex+s*-.1+(s<0?1.1:-1.1),y+6.9);c.quadraticCurveTo(ex+(s<0?2.2:-2.2),y+6.6,ex+(s<0?2.1:-2.1),y+5.6);c.quadraticCurveTo(ex+(s<0?1.2:-1.2),y+5,ex+(s<0?1.05:-1.05),y+3.3);c.closePath();c.fill();});};
W_FACE.handlebar=(c,x,y,f)=>{fitTash(c,x,y,f.col,true);};
W_FACE.moustache=(c,x,y,f)=>{fitTash(c,x,y,f.col,false);};
W_FACE.stubble=(c,x,y,f)=>{c.save();c.beginPath();c.arc(x+4,y+3.6,3.5,0,TAU);c.clip();c.beginPath();c.moveTo(x+.4,y+4.6);c.quadraticCurveTo(x+4,y+6.2,x+7.6,y+4.6);c.lineTo(x+7.6,y+8);c.lineTo(x+.4,y+8);c.closePath();c.globalAlpha=.16;c.fillStyle=fitDk(f.col,-.35);c.fill();c.globalAlpha=.35;for(let i=0;i<22;i++){const a=(i*37%100)/100,b=(i*61%100)/100;disc(c,x+1.3+a*5.4,y+5.6+b*1.4,.07,fitDk(f.col,-.4));}c.globalAlpha=1;c.restore();};
W_FACE.plaster=(c,x,y,f)=>{c.save();c.translate(x+6,y+5.2);[.6,-.6].forEach(r=>{c.save();c.rotate(r);rr(c,-.95,-.32,1.9,.64,.22,'#E3B98A');rr(c,-.85,-.24,1.7,.48,.2,f.col);R(c,-.25,-.18,.5,.36,'#E3B98A');c.restore();});c.restore();};

/* ---------- hats that perched: now they sit on the head ---------- */
W_HAT.straw=(c,x,y,h)=>{ell(c,x+4,y+2.5,6.2,1.25,h.col);ell(c,x+4,y+2.75,6.2,.5,fitDk(h.col,-.15));c.fillStyle=h.col;c.beginPath();c.arc(x+4,y+2.4,3.6,Math.PI,0);c.fill();R(c,x+.45,y+1.55,7.1,.75,'#D9485F');
  for(let i=0;i<6;i++)line(c,x-.9+i*1.9,y+2.6,x-.5+i*1.9,y+3.1,fitDk(h.col,-.2),.12);};
W_HAT.bicorne=(c,x,y,h)=>{c.fillStyle=h.col;c.beginPath();c.ellipse(x+4,y+1.9,6.3,2.6,0,Math.PI,0);c.fill();ell(c,x+4,y+1.95,6.3,.5,fitDk(h.col,-.2));R(c,x-2.2,y+1.6,12.4,.45,'#F2C462');disc(c,x+4,y+.5,.85,'#F2C462');disc(c,x+4,y+.5,.4,'#C8102E');};
W_HAT.peak=(c,x,y,h)=>{ell(c,x+4,y+1.4,4.4,1.7,h.col);R(c,x+.3,y+1.8,7.4,1.25,'#1E2228');rr(c,x+3.4,y+2.85,4.8,.8,.4,'#1E2228');disc(c,x+4,y+1.9,.55,'#F2C462');};
W_HAT.chef=(c,x,y,h)=>{disc(c,x+2.1,y-.1,1.7,h.col);disc(c,x+5.9,y-.1,1.7,h.col);disc(c,x+4,y-.9,2,h.col);rr(c,x+.4,y+.4,7.2,2.3,.6,h.col);R(c,x+.4,y+2.3,7.2,.45,'#E6DCC4');for(let i=1;i<5;i++)line(c,x+.4+i*1.45,y+.6,x+.4+i*1.45,y+2.2,'rgba(150,140,120,.35)',.12);};

/* ---------- the kraken cape hangs behind the legs ---------- */
W_COAT.cape=(c,x,y,o,pal)=>{c.fillStyle=o.col;c.beginPath();c.moveTo(x+1,y+6.4);c.lineTo(x+7,y+6.4);c.quadraticCurveTo(x+8.6,y+8.8,x+9,y+11.6);
  for(let i=0;i<5;i++){const x1=x+9-(i+1)*2;c.quadraticCurveTo(x1+1,y+12.5,x1,y+11.6);}c.quadraticCurveTo(x-.6,y+8.8,x+1,y+6.4);c.closePath();c.fill();
  for(let i=0;i<5;i++)disc(c,x+8-i*2,y+11.75,.3,o.col2||'#C58BE0');
  const p=pal&&pal.p||'#55606E';rr(c,x+2.2,y+9.6,1.6,2.6,.8,p);rr(c,x+4.2,y+9.6,1.6,2.6,.8,p);rr(c,x+1.9,y+11.4,2.1,1,.5,'#3F3A30');rr(c,x+4.1,y+11.4,2.1,1,.5,'#3F3A30');
  rr(c,x+1.3,y+6,5.4,4.6,2,fitDk(o.col,-.15));c.fillStyle=o.col;c.beginPath();c.moveTo(x+1.1,y+6.3);c.quadraticCurveTo(x+4,y+5.4,x+6.9,y+6.3);c.lineTo(x+6.4,y+7.1);c.quadraticCurveTo(x+4,y+6.4,x+1.6,y+7.1);c.closePath();c.fill();disc(c,x+4,y+6.7,.5,'#F2C462');};
