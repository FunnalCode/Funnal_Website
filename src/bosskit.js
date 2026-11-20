/* ============================== BOSS BUILDER (Stage 0) ==============================
   A boss described in a few settings instead of 60 lines of drawing:
   {kit:{body:'puffer', col:'#E8A23A', col2:'#FFF1C9', pat:'spots', eyes:2, eyeStyle:'round',
         mouth:'smirk', acc:['tie','headset'], mood:'smug'}}
   body:  blob fish crab jelly shell eel puffer squid ray
   pat:   spots stripes scales none
   eyes:  1-3, eyeStyle round sleepy shades specs angry
   mouth: grin fangs beak pout smirk wobble
   acc:   horns crown tophat santa antlers tie headset clipboard phone tinsel monocle spikes fins claws tentacles bubbles
   mood:  calm smug angry scared sleepy (the hit points left still win: low HP = dizzy and dented) */
const BK_DARK='#3F3A30',BK_HI='rgba(255,255,255,.42)',BK_SH='rgba(0,0,0,.14)';
function bkShade(hex,k){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(k<0?v*(1+k):v+(255-v)*k)));return '#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('');}
function bkCol(K,t){if(K.rainbow)return `hsl(${(t/20)%360},62%,72%)`;return K.col||'#7FB3D5';}

/* ---------- bodies: each returns where the face goes {fx,fy,fr} ---------- */
const BK_BODY={
  blob(c,K,x,y,r,t,col){const w=Math.sin(t/500)*r*.04;ell(c,x,y+r*.08,r*.98+w,r*.82-w,col);ell(c,x,y+r*.42,r*.82,r*.32,BK_SH);ell(c,x,y,r*.92+w,r*.78-w,col);ell(c,x,y+r*.3,r*.55,r*.3,K.col2||bkShade(col,.35));disc(c,x-r*.38,y-r*.38,r*.2,BK_HI);return{fx:x,fy:y-r*.12,fr:r*.8};},
  fish(c,K,x,y,r,t,col){const fl=Math.sin(t/300)*.3;c.save();c.translate(x+r*.95,y);c.rotate(fl);poly(c,[[0,0],[r*.6,-r*.55],[r*.42,0],[r*.6,r*.55]],bkShade(col,-.12));c.restore();
    ell(c,x,y,r*1.05,r*.72,col);ell(c,x-r*.1,y+r*.28,r*.78,r*.3,K.col2||bkShade(col,.4));poly(c,[[x-r*.2,y-r*.62],[x+r*.25,y-r*1.05],[x+r*.45,y-r*.55]],bkShade(col,-.1));
    c.strokeStyle=bkShade(col,-.2);c.lineWidth=r*.05;c.beginPath();c.arc(x-r*.42,y,r*.48,-.9,.9);c.stroke();disc(c,x-r*.3,y-r*.42,r*.15,BK_HI);return{fx:x-r*.48,fy:y-r*.08,fr:r*.62};},
  crab(c,K,x,y,r,t,col){[-1,1].forEach((sd,k)=>{for(let j=0;j<3;j++){const st=Math.sin(t/140+j*1.6+k*Math.PI)*r*.06;c.strokeStyle=col;c.lineWidth=r*.08;c.lineCap='round';c.beginPath();c.moveTo(x+sd*r*.5,y+r*.12+j*r*.1);c.quadraticCurveTo(x+sd*r*(.95+j*.05),y-r*.02+j*r*.12-st,x+sd*r*(1.1+j*.08),y+r*.45+j*r*.08);c.stroke();}});
    ell(c,x,y,r*.85,r*.58,col);ell(c,x,y+r*.22,r*.72,r*.3,BK_SH);ell(c,x,y-r*.06,r*.78,r*.48,col);disc(c,x-r*.32,y-r*.28,r*.14,BK_HI);for(let i=0;i<5;i++)disc(c,x-r*.5+i*r*.25,y+r*.3,r*.06,bkShade(col,-.25));return{fx:x,fy:y-r*.06,fr:r*.7};},
  jelly(c,K,x,y,r,t,col){c.globalAlpha=.88;for(let i=0;i<6;i++){const xx=x-r*.6+i*r*.24;c.strokeStyle=col;c.lineWidth=r*.07;c.lineCap='round';c.beginPath();c.moveTo(xx,y+r*.2);for(let k=1;k<=6;k++)c.lineTo(xx+Math.sin(t/300+i+k)*r*.08,y+r*.2+k*r*.18);c.stroke();}
    c.fillStyle=col;c.beginPath();c.moveTo(x-r*.95,y+r*.25);c.quadraticCurveTo(x-r,y-r*.95,x,y-r*.95);c.quadraticCurveTo(x+r,y-r*.95,x+r*.95,y+r*.25);for(let i=0;i<6;i++){const q=i/5;c.quadraticCurveTo(x+r*(.95-q*1.9)-r*.16,y+r*.42,x+r*(.95-(i+1)/6*1.9),y+r*.25);}c.closePath();c.fill();c.globalAlpha=1;
    ell(c,x,y-r*.35,r*.6,r*.4,K.col2||bkShade(col,.35));disc(c,x-r*.4,y-r*.55,r*.16,BK_HI);return{fx:x,fy:y-r*.25,fr:r*.75};},
  shell(c,K,x,y,r,t,col){const sc=K.col2||'#F2E3C4';c.fillStyle=sc;c.beginPath();c.arc(x+r*.25,y-r*.15,r*.75,0,TAU);c.fill();c.strokeStyle=bkShade(sc,-.3);c.lineWidth=r*.07;c.beginPath();for(let a=0;a<TAU*2.2;a+=.2){const rad=r*.7*(1-a/(TAU*2.4));c.lineTo(x+r*.25+Math.cos(a)*rad,y-r*.15+Math.sin(a)*rad);}c.stroke();
    ell(c,x-r*.35,y+r*.42,r*.9,r*.32,col);ell(c,x-r*.75,y+r*.05,r*.42,r*.45,col);disc(c,x-r*.2,y-r*.65,r*.14,BK_HI);return{fx:x-r*.75,fy:y+r*.02,fr:r*.42};},
  eel(c,K,x,y,r,t,col){c.strokeStyle=col;c.lineCap='round';c.lineWidth=r*.42;c.beginPath();for(let i=0;i<=20;i++){const q=i/20;c.lineTo(x-r*1.4+q*r*2.1,y+r*.5+Math.sin(t/400+q*6)*r*.25-q*q*r*.6);}c.stroke();c.strokeStyle=K.col2||bkShade(col,.35);c.lineWidth=r*.14;c.stroke();
    ell(c,x+r*.75,y-r*.25,r*.5,r*.42,col);return{fx:x+r*.78,fy:y-r*.3,fr:r*.45};},
  puffer(c,K,x,y,r,t,col){const p=1+Math.max(0,Math.sin(t/900))*.08;for(let i=0;i<14;i++){const a=i/14*TAU;poly(c,[[x+Math.cos(a-.12)*r*.85*p,y+Math.sin(a-.12)*r*.85*p],[x+Math.cos(a)*r*1.12*p,y+Math.sin(a)*r*1.12*p],[x+Math.cos(a+.12)*r*.85*p,y+Math.sin(a+.12)*r*.85*p]],bkShade(col,-.15));}
    disc(c,x,y,r*.9*p,col);ell(c,x,y+r*.38,r*.62,r*.36,K.col2||bkShade(col,.45));disc(c,x-r*.38,y-r*.4,r*.18,BK_HI);return{fx:x,fy:y-r*.1,fr:r*.75};},
  squid(c,K,x,y,r,t,col){for(let i=0;i<5;i++){const u=i/4;tentacle(c,x+(u-.5)*r*1.4,y+r*.75,r*.9,u<.5?-1:1,r*.12,col,t,i*1.3,1);}
    c.fillStyle=col;c.beginPath();c.moveTo(x-r*.7,y+r*.6);c.quadraticCurveTo(x-r*.85,y-r*.6,x,y-r*1.25);c.quadraticCurveTo(x+r*.85,y-r*.6,x+r*.7,y+r*.6);c.closePath();c.fill();
    poly(c,[[x-r*.5,y-r*.55],[x-r*1.05,y-r*.95],[x-r*.62,y-r*.25]],bkShade(col,-.1));poly(c,[[x+r*.5,y-r*.55],[x+r*1.05,y-r*.95],[x+r*.62,y-r*.25]],bkShade(col,-.1));disc(c,x-r*.25,y-r*.6,r*.14,BK_HI);return{fx:x,fy:y+r*.1,fr:r*.68};},
  ray(c,K,x,y,r,t,col){const fl=Math.sin(t/380)*r*.25;c.fillStyle=col;c.beginPath();c.moveTo(x,y-r*.55);c.quadraticCurveTo(x+r*.9,y-r*.4-fl,x+r*1.5,y+r*.05-fl);c.quadraticCurveTo(x+r*.7,y+r*.4,x,y+r*.5);c.quadraticCurveTo(x-r*.7,y+r*.4,x-r*1.5,y+r*.05-fl);c.quadraticCurveTo(x-r*.9,y-r*.4-fl,x,y-r*.55);c.fill();
    c.strokeStyle=col;c.lineWidth=r*.06;c.beginPath();c.moveTo(x,y+r*.45);c.quadraticCurveTo(x+r*.2,y+r*1.1,x-r*.1,y+r*1.5);c.stroke();ell(c,x,y+r*.15,r*.5,r*.22,K.col2||bkShade(col,.35));disc(c,x-r*.3,y-r*.2,r*.12,BK_HI);return{fx:x,fy:y-r*.12,fr:r*.6};}
};

/* ---------- patterns, clipped roughly to the body ---------- */
function bkPattern(c,K,x,y,r,col){const pc=K.patCol||bkShade(col,-.18);if(K.pat==='spots')for(let i=0;i<7;i++){const a=i*2.4,d=r*(.3+(i%3)*.17);disc(c,x+Math.cos(a)*d,y+Math.sin(a)*d*.7,r*(.06+(i%2)*.04),pc);}
  if(K.pat==='stripes')for(let i=-2;i<=2;i++){c.strokeStyle=pc;c.lineWidth=r*.1;c.lineCap='round';c.beginPath();c.moveTo(x+i*r*.3,y-r*.55+Math.abs(i)*r*.08);c.quadraticCurveTo(x+i*r*.3+r*.08,y,x+i*r*.3,y+r*.5-Math.abs(i)*r*.08);c.stroke();}
  if(K.pat==='scales')for(let j=0;j<3;j++)for(let i=0;i<4;i++){c.strokeStyle=pc;c.lineWidth=r*.035;c.beginPath();c.arc(x-r*.45+i*r*.28+(j%2)*r*.14,y-r*.25+j*r*.22,r*.12,0,Math.PI);c.stroke();}}

/* ---------- faces with moods ---------- */
function bkFace(c,K,fx,fy,fr,ratio,t,mood){const n=K.eyes||2,er=Math.max(1,fr/6.8);const dizzy=ratio<.25;const blink=(t%(3300+(K.seed||0)%900))<120;
  const xs=n===1?[0]:n===3?[-fr*.42,0,fr*.42]:[-fr*.32,fr*.32];const look=Math.sin(t/1700)*.35-.2;
  xs.forEach((dx,k)=>{const ex=fx+dx,ey=fy-(n===3&&k===1?fr*.12:0);const big=n===1?1.7:1;const R_=er*big;
    if(K.eyeStyle==='shades'&&!dizzy){rr(c,ex-R_*1.3,ey-R_*.7,R_*2.6,R_*1.4,R_*.5,'#26232B');disc(c,ex-R_*.5,ey-R_*.25,R_*.25,'rgba(255,255,255,.55)');if(k<xs.length-1)line(c,ex+R_*1.3,ey-R_*.2,fx+xs[k+1]-R_*1.3,ey-R_*.2,'#26232B',R_*.3);return;}
    if(blink&&!dizzy){line(c,ex-R_,ey,ex+R_,ey,BK_DARK,.8);return;}
    disc(c,ex,ey,R_+.9,'#FFFFFF');
    if(dizzy){const a=t/200+k*2;c.strokeStyle=BK_DARK;c.lineWidth=.55;c.beginPath();for(let i=0;i<16;i++){const q=i/16;c.lineTo(ex+Math.cos(a+q*9)*R_*q,ey+Math.sin(a+q*9)*R_*q);}c.stroke();}
    else{const pr=mood==='scared'?R_*.45:R_*.75;disc(c,ex+look*R_*.35,ey+.2,pr,BK_DARK);disc(c,ex+look*R_*.35+.5,ey-.4,pr*.33,'#FFFFFF');}
    const sleepy=mood==='sleepy'||K.eyeStyle==='sleepy';if(sleepy&&!dizzy){c.fillStyle=bkCol(K,t);c.beginPath();c.arc(ex,ey,R_+1,Math.PI,0);c.fill();line(c,ex-R_-.6,ey,ex+R_+.6,ey,BK_DARK,.6);}
    const angry=mood==='angry'||K.eyeStyle==='angry'||(ratio<.6&&!dizzy);const smug=mood==='smug';
    if(angry){const sd=dx<=0?1:-1;line(c,ex-sd*R_*1.3,ey-R_*1.9,ex+sd*R_*1.1,ey-R_*1.15,BK_DARK,.9);}
    else if(smug){line(c,ex-R_*1.1,ey-R_*1.5,ex+R_*1.1,ey-R_*1.7+(dx>0?-.6:0),BK_DARK,.7);}
    else if(mood==='scared'){c.strokeStyle=BK_DARK;c.lineWidth=.7;c.beginPath();c.arc(ex,ey-R_*.6,R_*1.3,-2.4,-.7);c.stroke();}
    if(K.eyeStyle==='specs'){c.strokeStyle='#3F5160';c.lineWidth=.55;c.beginPath();c.arc(ex,ey,R_+1.6,0,TAU);c.stroke();}});
  c.globalAlpha=.5;disc(c,fx-fr*.58,fy+fr*.3,fr*.12,'#F49A9A');disc(c,fx+fr*.58,fy+fr*.3,fr*.12,'#F49A9A');c.globalAlpha=1;
  const mw=fr*.28,my=fy+fr*.36;c.strokeStyle=BK_DARK;c.lineWidth=1;c.lineCap='round';c.beginPath();const mo=dizzy?'wobble':mood==='scared'?'pout':K.mouth||'grin';
  if(mo==='grin'){c.arc(fx,my-fr*.12,mw,.15*Math.PI,.85*Math.PI);c.stroke();}
  else if(mo==='smirk'){c.moveTo(fx-mw,my);c.quadraticCurveTo(fx+mw*.2,my+fr*.08,fx+mw,my-fr*.14);c.stroke();}
  else if(mo==='pout'){c.arc(fx,my+fr*.12,mw*.6,1.15*Math.PI,1.85*Math.PI);c.stroke();}
  else if(mo==='wobble'){c.moveTo(fx-mw,my);for(let i=1;i<=4;i++)c.lineTo(fx-mw+i*mw/2,my+(i%2?1.4:0));c.stroke();}
  else if(mo==='fangs'){c.moveTo(fx-mw,my);c.quadraticCurveTo(fx,my+fr*.18,fx+mw,my);c.stroke();poly(c,[[fx-mw*.6,my+fr*.04],[fx-mw*.45,my+fr*.22],[fx-mw*.3,my+fr*.07]],'#FFFFFF');poly(c,[[fx+mw*.3,my+fr*.07],[fx+mw*.45,my+fr*.22],[fx+mw*.6,my+fr*.04]],'#FFFFFF');}
  else if(mo==='beak'){poly(c,[[fx-mw*.6,my-fr*.06],[fx,my+fr*.22],[fx+mw*.6,my-fr*.06]],'#F2A33A');line(c,fx-mw*.6,my-fr*.06,fx+mw*.6,my-fr*.06,'#C9772A',.5);}
  if(ratio<.5){rr(c,fx+fr*.5,fy-fr*.6,fr*.36,fr*.16,1,'#F7E3C0');rr(c,fx+fr*.6,fy-fr*.72,fr*.16,fr*.4,1,'#F7E3C0');}
  if(ratio<.75||mood==='scared'){const d=(t/40)%12;disc(c,fx-fr*.85,fy-fr*.3+d*.4,1,'rgba(140,200,255,.9)');}}

/* ---------- accessories ---------- */
const BK_ACC={
  horns:(c,a)=>{[-1,1].forEach(s=>{c.fillStyle='#F2E3C4';c.beginPath();c.moveTo(a.hx+s*a.hr*.35,a.hy);c.quadraticCurveTo(a.hx+s*a.hr*.9,a.hy-a.hr*.3,a.hx+s*a.hr*.75,a.hy-a.hr*.85);c.quadraticCurveTo(a.hx+s*a.hr*.55,a.hy-a.hr*.3,a.hx+s*a.hr*.15,a.hy+a.hr*.05);c.fill();});},
  crown:(c,a)=>{const y=a.hy-a.hr*.1,w=a.hr*.5;poly(c,[[a.hx-w,y],[a.hx-w,y-w*.8],[a.hx-w*.5,y-w*.35],[a.hx,y-w],[a.hx+w*.5,y-w*.35],[a.hx+w,y-w*.8],[a.hx+w,y]],'#F2C462');disc(c,a.hx,y-w*.3,w*.15,'#D9485F');},
  tophat:(c,a)=>{const y=a.hy+a.hr*.05,w=a.hr*.42;rr(c,a.hx-w*1.5,y-w*.2,w*3,w*.35,w*.15,'#26232B');rr(c,a.hx-w,y-w*1.9,w*2,w*1.8,w*.2,'#26232B');R(c,a.hx-w,y-w*.6,w*2,w*.3,'#D9485F');},
  santa:(c,a)=>{const y=a.hy+a.hr*.05,w=a.hr*.55;c.fillStyle='#D9363E';c.beginPath();c.moveTo(a.hx-w,y);c.quadraticCurveTo(a.hx-w*.2,y-w*1.9,a.hx+w*1.2,y-w*1.1);c.quadraticCurveTo(a.hx+w*.4,y-w*.9,a.hx+w,y);c.fill();rr(c,a.hx-w*1.1,y-w*.25,w*2.2,w*.45,w*.22,'#FFFFFF');disc(c,a.hx+w*1.25,y-w*1.05,w*.25,'#FFFFFF');},
  antlers:(c,a)=>{[-1,1].forEach(s=>{c.strokeStyle='#8A5A34';c.lineWidth=a.hr*.08;c.lineCap='round';const bx=a.hx+s*a.hr*.35,by=a.hy;c.beginPath();c.moveTo(bx,by);c.lineTo(bx+s*a.hr*.3,by-a.hr*.7);c.moveTo(bx+s*a.hr*.15,by-a.hr*.35);c.lineTo(bx+s*a.hr*.5,by-a.hr*.45);c.moveTo(bx+s*a.hr*.25,by-a.hr*.6);c.lineTo(bx+s*a.hr*.05,by-a.hr*.9);c.stroke();});},
  tie:(c,a)=>{const x=a.fx,y=a.fy+a.fr*.75,w=a.fr*.18;poly(c,[[x-w,y],[x+w,y],[x,y+w*.9]],'#C2453D');poly(c,[[x,y+w*.6],[x-w*.8,y+w*3],[x,y+w*3.6],[x+w*.8,y+w*3]],'#D9485F');},
  headset:(c,a)=>{c.strokeStyle='#3F5160';c.lineWidth=a.fr*.08;c.beginPath();c.arc(a.fx,a.fy,a.fr*.95,Math.PI*1.08,Math.PI*1.92);c.stroke();rr(c,a.fx-a.fr*1.02,a.fy-a.fr*.25,a.fr*.2,a.fr*.45,a.fr*.08,'#3F5160');c.beginPath();c.moveTo(a.fx-a.fr*.9,a.fy+a.fr*.1);c.quadraticCurveTo(a.fx-a.fr*.8,a.fy+a.fr*.6,a.fx-a.fr*.3,a.fy+a.fr*.55);c.stroke();disc(c,a.fx-a.fr*.28,a.fy+a.fr*.55,a.fr*.08,'#26232B');},
  clipboard:(c,a)=>{const x=a.bx+a.r*.95,y=a.by+a.r*.05;c.save();c.translate(x,y);c.rotate(.2);rr(c,-a.r*.25,-a.r*.32,a.r*.5,a.r*.64,a.r*.05,'#C99A5E');R(c,-a.r*.2,-a.r*.26,a.r*.4,a.r*.54,'#FFFFFF');for(let i=0;i<4;i++)R(c,-a.r*.15,-a.r*.17+i*a.r*.11,a.r*.3,a.r*.03,'#9AA8B6');rr(c,-a.r*.08,-a.r*.37,a.r*.16,a.r*.09,a.r*.03,'#8A939C');c.restore();},
  phone:(c,a)=>{const x=a.bx-a.r*.95,y=a.by,w=a.r*.22;c.save();c.translate(x,y);c.rotate(-.25);rr(c,-w,-w*1.7,w*2,w*3.4,w*.35,'#26232B');rr(c,-w*.8,-w*1.45,w*1.6,w*2.7,w*.2,(a.t%1600)<800?'#7CC7E6':'#9FDDF2');c.restore();},
  tinsel:(c,a)=>{const cols=['#E0453B','#F2C462','#5DBE9C','#7CC7E6'];for(let i=0;i<9;i++){const q=i/8;const x=a.bx-a.r*.8+q*a.r*1.6,y=a.by-a.r*.15+Math.sin(q*Math.PI)*a.r*.35;disc(c,x,y,a.r*.07,cols[i%4]);disc(c,x,y,a.r*.035,'rgba(255,255,255,.7)');}},
  monocle:(c,a)=>{c.strokeStyle='#F2C462';c.lineWidth=.6;c.beginPath();c.arc(a.fx+a.fr*.32,a.fy,a.fr*.22,0,TAU);c.stroke();line(c,a.fx+a.fr*.45,a.fy+a.fr*.18,a.fx+a.fr*.55,a.fy+a.fr*.7,'#F2C462',.35);},
  spikes:(c,a)=>{for(let i=0;i<5;i++){const x=a.hx-a.hr*.6+i*a.hr*.3;poly(c,[[x-a.hr*.1,a.hy+a.hr*.15],[x,a.hy-a.hr*.35-(i%2)*a.hr*.12],[x+a.hr*.1,a.hy+a.hr*.15]],bkShade(a.col,-.25));}},
  fins:(c,a)=>{[-1,1].forEach(s=>{c.save();c.translate(a.bx+s*a.r*.9,a.by+a.r*.1);c.rotate(s*(.5+Math.sin(a.t/260)*.25));ell(c,s*a.r*.2,0,a.r*.32,a.r*.14,bkShade(a.col,-.12));c.restore();});},
  claws:(c,a)=>{[-1,1].forEach((s,k)=>{const snip=.12+Math.abs(Math.sin(a.t/190+k))*.5;const cx=a.bx+s*a.r*1.05,cy=a.by-a.r*.5;ell(c,cx,cy-a.r*.1,a.r*.32,a.r*.18,a.col,s*(-.35-snip));ell(c,cx,cy+a.r*.08,a.r*.26,a.r*.13,a.col,s*(.15+snip*.4));disc(c,cx-s*a.r*.18,cy,a.r*.18,a.col);});},
  tentacles:(c,a)=>{for(let i=0;i<4;i++){const u=i/3;tentacle(c,a.bx+(u-.5)*a.r*1.6,a.by+a.r*.7,a.r*.8,u<.5?-1:1,a.r*.11,a.col,a.t,i*1.7,1);}},
  tusk:(c,a)=>{const x=a.fx-a.fr*.55,y=a.fy-a.fr*.1;c.save();c.translate(x,y);c.rotate(-.35);c.fillStyle='#F4EEDC';c.beginPath();c.moveTo(0,-a.fr*.1);c.lineTo(-a.fr*1.5,0);c.lineTo(0,a.fr*.1);c.closePath();c.fill();c.strokeStyle='rgba(160,140,110,.6)';c.lineWidth=.35;for(let i=1;i<6;i++){c.beginPath();c.moveTo(-i*a.fr*.24,-a.fr*.09*(1-i/6));c.lineTo(-i*a.fr*.24-a.fr*.06,a.fr*.09*(1-i/6));c.stroke();}c.restore();},
  bubbles:(c,a)=>{for(let i=0;i<3;i++){const q=((a.t/1400)+i/3)%1;c.strokeStyle=`rgba(255,255,255,${.7*(1-q)})`;c.lineWidth=.5;c.beginPath();c.arc(a.bx-a.r*.2+i*a.r*.3,a.by-a.r*.6-q*a.r*.9,1+q*1.6,0,TAU);c.stroke();}}
};
const BK_BEHIND={tentacles:1,fins:1,claws:1},BK_HEAD={horns:1,crown:1,tophat:1,santa:1,antlers:1,spikes:1};

/* ---------- draw one kit boss, with the same hit wobble and water line as the classic bosses ---------- */
function drawBossKit(c,boss,bx,by,r,ratio,t,flash,wl){const K=boss.kit;let col=bkCol({...K,rainbow:K.rainbow||boss.rare},t);if(flash)col='#FFFFFF';
  const mood=boss.mood||K.mood||'calm';const hitK=Math.max(0,Math.min(1,((S.bossFlash||0)+260-t)/370));const br=1+Math.sin(t/620)*.035;const wet=wl!=null&&!K.floats;
  c.save();c.translate(bx+hitK*r*.2,by-hitK*r*.04);c.rotate(hitK*.1*Math.sin(t/28));c.scale(br+hitK*.05,2-br-hitK*.05);c.translate(-bx,-by);
  if(wet){c.save();c.beginPath();c.rect(bx-r*5,by-r*5,r*10,wl-(by-r*5));c.clip();}
  const acc=(K.acc||[]).filter(a=>BK_ACC[a]);const ctx0={bx,by,r,t,col};
  acc.filter(a=>BK_BEHIND[a]).forEach(a=>BK_ACC[a](c,ctx0));
  const body=BK_BODY[K.body]||BK_BODY.blob;const f=body(c,K,bx,by,r,t,col);
  if(K.pat&&K.pat!=='none')bkPattern(c,K,bx,by,r,col);
  const a={...ctx0,fx:f.fx,fy:f.fy,fr:f.fr,hx:f.fx,hy:f.fy-f.fr*.85,hr:f.fr};
  acc.filter(x=>!BK_BEHIND[x]&&!BK_HEAD[x]).forEach(x=>BK_ACC[x](c,a));
  bkFace(c,K,f.fx,f.fy,f.fr,ratio,t,mood);
  acc.filter(x=>BK_HEAD[x]).forEach(x=>BK_ACC[x](c,a));
  if(wet)c.restore();c.restore();
  if(wet){const fw=r*1.5;for(let i=0;i<3;i++){const q=((t/1000)+i/3)%1;c.strokeStyle=`rgba(255,255,255,${.65*(1-q)})`;c.lineWidth=.8;c.beginPath();c.ellipse(bx,wl+.6,fw*(.75+q*.45),r*.11*(.8+q*.7),0,0,TAU);c.stroke();}ell(c,bx,wl+.6,fw*.78,r*.085,'rgba(255,255,255,.6)');}}
const _drawBoss16=drawBoss;drawBoss=function(c,boss,...a){if(boss&&boss.kit)return drawBossKit(c,boss,...a);return _drawBoss16(c,boss,...a);};
