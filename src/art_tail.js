/* ---------- Extra hideout decorations ---------- */
function palm(c,x,y,h=14,t=0){const sw=Math.sin(t/900)*.6;c.strokeStyle='#A8784A';c.lineWidth=1.8;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+2,y-h/2,x+1+sw,y-h);c.stroke();
  for(let i=0;i<6;i++){const a=-Math.PI/2+(i-2.5)*.55;c.fillStyle=i%2?'#4FA552':'#5FBF5A';c.beginPath();c.ellipse(x+1+sw+Math.cos(a)*4.4,y-h+Math.sin(a)*2.2+2,5,1.5,a,0,TAU);c.fill();}disc(c,x+.4+sw,y-h+1.4,1,'#8A5A3A');disc(c,x+2+sw,y-h+1.6,1,'#8A5A3A');}
Object.assign(DECOR,{
  pine:(c,x,y,t)=>palm(c,x,y,16,t),
  flowers:(c,x,y)=>{ell(c,x,y-1.4,7,2.4,'#5FAE4E');[[-5,'#E0457B'],[-2,'#F2C230'],[1,'#F27A5E'],[4,'#E0457B']].forEach(([d,col])=>{disc(c,x+d,y-3.4,1.4,col);disc(c,x+d,y-3.4,.5,'#FFF3B8');});},
  sandcastle:(c,x,y)=>{rr(c,x-6,y-5,12,5,1,'#EBCB8A');rr(c,x-5,y-9,3,4,.6,'#E3BE77');rr(c,x+2,y-9,3,4,.6,'#E3BE77');rr(c,x-1.5,y-11,3,6,.6,'#EBCB8A');poly(c,[[x,y-14],[x+3,y-13],[x,y-12]],'#D9485F');R(c,x-.2,y-14,.4,3,'#7A4E30');},
  hammock:(c,x,y)=>{R(c,x-9,y-12,1.4,12,'#A8704A');R(c,x+8,y-12,1.4,12,'#A8704A');c.fillStyle='#F2E2C4';c.beginPath();c.moveTo(x-8,y-10);c.quadraticCurveTo(x,y-2,x+8.6,y-10);c.quadraticCurveTo(x,y-5,x-8,y-10);c.fill();for(let i=-6;i<6;i+=3)R(c,x+i,y-7+Math.abs(i)*-.3,1.2,1.2,'#D9485F');},
  campfire:(c,x,y,t)=>{line(c,x-4,y-1,x+4,y-2.4,'#7A4E30',1.2);line(c,x-4,y-2.4,x+4,y-1,'#7A4E30',1.2);glowAt(c,x,y-4,9,'255,170,80',.35);const f=Math.sin(t/120)*.6;poly(c,[[x-2.6,y-2],[x,y-8-f],[x+2.6,y-2]],'#F27A3A');poly(c,[[x-1.4,y-2],[x,y-5.6+f],[x+1.4,y-2]],'#FFD45A');},
  umbrella:(c,x,y)=>{R(c,x-.4,y-14,.8,14,'#7A4E30');c.fillStyle='#FFFFFF';c.beginPath();c.arc(x,y-13,8,Math.PI,0);c.fill();c.save();c.beginPath();c.arc(x,y-13,8,Math.PI,0);c.clip();for(let i=0;i<4;i++){c.fillStyle='#E0603F';c.beginPath();c.moveTo(x,y-13);c.arc(x,y-13,8,Math.PI+i*Math.PI/4,Math.PI+(i+.5)*Math.PI/4);c.fill();}c.restore();rr(c,x-7,y-2,7,2,1,'#4A7EC2');},
  tiki:(c,x,y,t)=>{[-5,5].forEach(d=>{R(c,x+d-.5,y-13,1,13,'#8A5A3A');glowAt(c,x+d,y-15,5,'255,180,90',.4);poly(c,[[x+d-1.4,y-13],[x+d,y-17.5-Math.sin(t/110+d)*.6],[x+d+1.4,y-13]],'#F2A33A');});},
  xmark:(c,x,y)=>{ell(c,x,y-1,6,2,'#E3C487');line(c,x-3,y-2.4,x+3,y+.4,'#D9485F',1.2);line(c,x+3,y-2.4,x-3,y+.4,'#D9485F',1.2);R(c,x+4,y-8,.6,7,'#A8704A');rr(c,x+3.6,y-11,4,3,.6,'#F4EFE4');},
  cannonfort:(c,x,y)=>{rr(c,x-6,y-5,12,5,1.2,'#B9AE98');rr(c,x-3,y-9,9,3,1.4,'#55606E');disc(c,x+6,y-7.5,1,'#2E2B33');disc(c,x-2,y-3,2,'#7A4E30');},
  maptable:(c,x,y)=>{rr(c,x-7,y-7,14,2,.6,'#A8704A');R(c,x-6,y-5,1,5,'#7A4E30');R(c,x+5,y-5,1,5,'#7A4E30');rr(c,x-5,y-8.4,10,2,.4,'#F4E8CC');line(c,x-3,y-7.4,x+2,y-7.6,'#D9485F',.4);disc(c,x+3,y-7.6,.5,'#D9485F');},
  skullrock:(c,x,y)=>{ell(c,x,y-7,9,8,'#A9A396');disc(c,x-3,y-8,2,'#5A5650');disc(c,x+3,y-8,2,'#5A5650');poly(c,[[x,y-6],[x-1,y-3.6],[x+1,y-3.6]],'#5A5650');ell(c,x,y,10,1.6,'rgba(0,0,0,.08)');},
  wreck:(c,x,y)=>{c.save();c.translate(x,y);c.rotate(-.18);c.fillStyle='#8A5A3A';c.beginPath();c.moveTo(-12,-6);c.lineTo(10,-6);c.quadraticCurveTo(13,-6,12,-2);c.quadraticCurveTo(0,1,-10,-1);c.closePath();c.fill();R(c,-2,-18,1.2,12,'#7A4E30');poly(c,[[-1,-17],[7,-12],[-1,-9]],'#E9DFC6');c.restore();disc(c,x+8,y-2,1,'#F2C462');disc(c,x+10,y-1,.8,'#F2C462');},
  goldpile:(c,x,y,t)=>{glowAt(c,x,y-4,12,'255,210,90',.35);for(let i=0;i<14;i++){const a=i*2.4,r=(i%5)*1.4;disc(c,x+Math.cos(a)*r*1.4,y-1.6-(4-i%5)*1.4,1.5,i%3?'#F2C462':'#E3A93A');}rr(c,x-6,y-1.6,12,1.6,.8,'#E3A93A');disc(c,x+1,y-8,1,'#FFF3B8');},
});
function drawDecor(c,id,x,y,t){(DECOR[id]||((c,x,y)=>{disc(c,x,y-5,4,'#9B7FD9');}))(c,x,y,t);}

/* ---------- Sky, sea and weather ---------- */
const STARS=Array.from({length:50},(_,i)=>[h32('s'+i)%W,h32('y'+i)%90,h32('b'+i)%3]);
const CLOUDS=[[30,22,1],[120,14,.8],[210,30,1.1],[290,12,.7]];
function skyMode(){const cfg=C();const m=L().min;return (m>=hm(cfg.dayEnd)+30||m<hm(cfg.dayStart)-90)?'dusk':'day';}
function sky(c,t,opts={}){
  const mode=opts.mode||(opts.dawn?'gold':skyMode());
  const cols={day:['#6CC0EC','#C3EAF7'],gold:['#F4A86A','#FFE3A8'],dusk:['#34437A','#8E7FB0']}[mode];
  const g=c.createLinearGradient(0,0,0,130);g.addColorStop(0,cols[0]);g.addColorStop(1,cols[1]);c.fillStyle=g;c.fillRect(0,0,W,H);
  if(mode==='dusk'){STARS.forEach(([x,y,b],i)=>{const tw=(Math.sin(t/600+i)+1)/2;if(tw>.3||b===2)disc(c,x,y,b===2?.8:.5,'#FFFFFF');});disc(c,46,28,8,'#FFF6D8');disc(c,50,25,7,cols[0]);}
  else{const sx=mode==='gold'?60:44,sy=mode==='gold'?74:30;glowAt(c,sx,sy,32,'255,240,170',.85);disc(c,sx,sy,9,'#FFF3B8');}
  if(opts.rainbow){['#E0453B','#F2A33A','#F2D24A','#5DBE9C','#4A7EC2','#9B5DE5'].forEach((col,i)=>{c.strokeStyle=col;c.globalAlpha=.32;c.lineWidth=2.4;c.beginPath();c.arc(200,140,90-i*2.4,Math.PI,TAU);c.stroke();});c.globalAlpha=1;}
  if(opts.aurora){for(let x=0;x<W;x+=3){const y=26+Math.sin(x/30+t/1500)*8;c.fillStyle=`hsla(${150+Math.sin(x/50+t/2000)*50},90%,75%,.25)`;c.fillRect(x,y,3,26);}}
  if(mode!=='dusk')CLOUDS.forEach(([x0,y,s],i)=>{const x=((x0+t/(260+i*60))%(W+60))-30;c.globalAlpha=.92;disc(c,x,y,6*s,'#FFFFFF');disc(c,x+7*s,y-3*s,7*s,'#FFFFFF');disc(c,x+15*s,y,6*s,'#FFFFFF');rr(c,x-2*s,y,20*s,5*s,2.5*s,'#FFFFFF');c.globalAlpha=1;});
  if(opts.shooting){const p=(t%4000)/4000;if(p<.3){const x=260-p*500,y=10+p*120;line(c,x,y,x+14,y-7,'rgba(255,255,255,.9)',1);}}
  if(opts.fireworks){const p=(t%2600)/2600;if(p<.6){const cx=80+(Math.floor(t/2600)*97)%180,cy=30+(Math.floor(t/2600)*31)%30;for(let i=0;i<14;i++){const a=i/14*TAU;disc(c,cx+Math.cos(a)*p*22,cy+Math.sin(a)*p*22,.9*(1-p)+.2,['#F2C462','#E0457B','#7CC7E6'][i%3]);}}}
}
function sea(c,y0,t,opts={}){const g=c.createLinearGradient(0,y0,0,H);g.addColorStop(0,opts.glow?'#3EB6C9':'#5FCFD8');g.addColorStop(1,opts.glow?'#1F6F9A':'#3DA4C6');c.fillStyle=g;c.fillRect(0,y0,W,H-y0);
  c.strokeStyle=opts.glow?'rgba(150,255,240,.85)':'rgba(255,255,255,.55)';c.lineWidth=.9;c.lineCap='round';for(let y=y0+5;y<H;y+=8){const off=(t/70+y*11)%40;for(let x=-40;x<W;x+=40){c.beginPath();c.moveTo(x+off,y);c.quadraticCurveTo(x+off+4,y-1.6,x+off+8,y);c.stroke();}}
  if(opts.glow)for(let i=0;i<24;i++)disc(c,(i*47+t/50)%W,y0+6+(i*13)%(H-y0-8),.6+.4*Math.sin(t/300+i),'rgba(170,255,240,.9)');}
function island(c,cx,cy,rx,ry,t){ell(c,cx,cy+2,rx+5+Math.sin(t/600),ry+3,'rgba(255,255,255,.55)');ell(c,cx,cy,rx,ry,'#F4E1B0');ell(c,cx,cy-3,rx-6,ry-3,'#8CCB63');ell(c,cx,cy-5,rx-12,ry-6,'#A2D877');}
function tree(c,x,y){ell(c,x,y,4,1.2,'rgba(0,0,0,.1)');rr(c,x-.9,y-7,1.8,7,.8,'#9A6B45');disc(c,x,y-10,5,'#5FAE4E');disc(c,x-3,y-8,3.5,'#6CBB57');disc(c,x+3,y-8.5,3.5,'#78C760');}
function dolphins(c,t){for(let i=0;i<2;i++){const p=((t/2600)+i*.5)%1;if(p>.5)continue;const q=p*2;const x=40+i*150+q*50,y=150-Math.sin(q*Math.PI)*16;c.save();c.translate(x,y);c.rotate(-Math.cos(q*Math.PI)*.9);ell(c,0,0,6,2.2,'#7FA3C8');poly(c,[[-6,0],[-9,-2],[-9,2]],'#7FA3C8');poly(c,[[-1,-2],[1,-4.6],[2,-1.6]],'#7FA3C8');disc(c,3.6,-.6,.4,'#3F3A30');c.restore();}}
function whale(c,t){const x=250+Math.sin(t/4000)*20,y=158;ell(c,x,y,16,5,'#5E86B8');ell(c,x+2,y+1.6,13,2.6,'#C9DCF0');disc(c,x+10,y-1,.7,'#3F3A30');const p=(t%3000)/3000;if(p<.5)for(let i=0;i<5;i++)disc(c,x+6+(i-2)*1.8*p*2,y-6-p*14+Math.abs(i-2)*p*4,1.2,'rgba(255,255,255,.85)');}

/* ---------- Faces & bosses ---------- */
function bossFace(c,cx,cy,r,ratio,t){const er=Math.max(1.2,r/7.5);const dizzy=ratio<.25;
  [-r*.32,r*.32].forEach(dx=>{disc(c,cx+dx,cy,er+.9,'#FFFFFF');if(dizzy){line(c,cx+dx-er,cy-er*.6,cx+dx+er,cy+er*.6,'#3F3A30',.8);line(c,cx+dx-er,cy+er*.6,cx+dx+er,cy-er*.6,'#3F3A30',.8);}else{disc(c,cx+dx+.4,cy+.2,er*.75,'#3F3A30');disc(c,cx+dx+.9,cy-.4,er*.25,'#FFFFFF');}});
  c.globalAlpha=.5;disc(c,cx-r*.55,cy+r*.28,r*.12,'#F49A9A');disc(c,cx+r*.55,cy+r*.28,r*.12,'#F49A9A');c.globalAlpha=1;
  c.strokeStyle='#3F3A30';c.lineWidth=1;c.lineCap='round';c.beginPath();const mw=r*.26;
  if(ratio>.5)c.arc(cx,cy+r*.22,mw,.15*Math.PI,.85*Math.PI);else{c.moveTo(cx-mw,cy+r*.42);c.quadraticCurveTo(cx,cy+r*.2+Math.sin(t/150)*1.5,cx+mw,cy+r*.42);}c.stroke();
  if(ratio<.5){rr(c,cx+r*.5,cy-r*.6,r*.36,r*.16,1,'#F7E3C0');rr(c,cx+r*.6,cy-r*.72,r*.16,r*.4,1,'#F7E3C0');}
  if(ratio<.75){const d=(t/40)%12;disc(c,cx-r*.85,cy-r*.3+d*.4,1,'rgba(140,200,255,.9)');}}
function drawBoss(c,boss,bx,by,r,ratio,t,flash){
  let col=boss.col;if(boss.rare&&boss.type!=='whale')col=`hsl(${(t/20)%360},62%,72%)`;if(flash)col='#FFFFFF';
  const type=boss.type||'storm';
  if(type==='storm'){ell(c,bx,by+r*.9,r*.9,r*.2,'rgba(0,0,0,.08)');for(let i=0;i<7;i++){const a=i/7*TAU+t/3000;disc(c,bx+Math.cos(a)*r*.6,by+Math.sin(a)*r*.35,r*.55,col);}disc(c,bx,by,r*.78,col);disc(c,bx-r*.3,by-r*.35,r*.22,'rgba(255,255,255,.5)');
    if(Math.sin(t/400)>.85){poly(c,[[bx-2,by+r*.7],[bx+2,by+r*.7],[bx-1,by+r*1.3],[bx+3,by+r*1.3],[bx-3,by+r*2]],'#FFE07A');}
    for(let i=0;i<5;i++){const yy=by+r*.8+((t/8+i*13)%30);line(c,bx-r*.6+i*r*.3,yy,bx-r*.6+i*r*.3-1,yy+3,'rgba(120,170,220,.7)',.7);}
    bossFace(c,bx,by-r*.05,r,ratio,t);}
  else if(type==='serpent'){for(let i=0;i<3;i++){const hx=bx-r*1.2+i*r*.75,hy=by+r*.55;c.fillStyle=col;c.beginPath();c.arc(hx,hy,r*.32,Math.PI,0);c.fill();}
    c.fillStyle=col;c.beginPath();c.moveTo(bx+r*.2,by+r*.6);c.quadraticCurveTo(bx+r*.2,by-r*.3,bx+r*.5,by-r*.5);c.lineTo(bx+r*.9,by-r*.4);c.quadraticCurveTo(bx+r*.7,by+r*.1,bx+r*.75,by+r*.6);c.fill();
    ell(c,bx+r*.6,by-r*.55,r*.55,r*.42,col);for(let i=0;i<3;i++)poly(c,[[bx+r*(.2+i*.2),by-r*.9],[bx+r*(.3+i*.2),by-r*1.2],[bx+r*(.4+i*.2),by-r*.9]],'#F2C462');
    bossFace(c,bx+r*.6,by-r*.6,r*.6,ratio,t);}
  else if(type==='octopus'||type==='kraken'){const n=type==='kraken'?8:6;for(let i=0;i<n;i++){const a=Math.PI*(.1+i*.8/(n-1));const sx=bx+Math.cos(a)*r*.7,sy=by+r*.35;c.strokeStyle=col;c.lineWidth=r*.2;c.lineCap='round';c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(sx+Math.cos(t/400+i)*r*.5,sy+r*.5,sx+Math.sin(t/500+i)*r*.4,sy+r*.95);c.stroke();}
    ell(c,bx,by-r*.15,r*.8,r*.9,col);disc(c,bx-r*.3,by-r*.6,r*.18,'rgba(255,255,255,.45)');for(let i=0;i<4;i++)disc(c,bx-r*.5+i*r*.33,by+r*.5,r*.07,'rgba(255,255,255,.4)');
    if(type==='octopus'){rr(c,bx-r*.7,by-r*1.05,r*1.4,r*.25,r*.1,'#FFFFFF');txt(c,'OOO',bx,by-r*1.05,'#E0457B',Math.max(4,r*.22),'center');}
    bossFace(c,bx,by-r*.1,r*.85,ratio,t);}
  else if(type==='crab'){[-1,1].forEach(sd=>{c.strokeStyle=col;c.lineWidth=r*.12;c.beginPath();c.moveTo(bx+sd*r*.6,by);c.quadraticCurveTo(bx+sd*r*1.1,by-r*.4,bx+sd*r*1.05,by-r*.8);c.stroke();const snip=Math.sin(t/200)*.25;ell(c,bx+sd*r*1.05,by-r*1,r*.35,r*.28,col,sd*snip);
      for(let k=0;k<3;k++)line(c,bx+sd*r*.5,by+r*.2+k*r*.12,bx+sd*r*1,by+r*.45+k*r*.12,col,r*.07);});
    ell(c,bx,by,r*.8,r*.55,col);disc(c,bx-r*.3,by-r*.25,r*.14,'rgba(255,255,255,.45)');R(c,bx-r*.3,by-r*.7,r*.06,r*.3,col);R(c,bx+r*.24,by-r*.7,r*.06,r*.3,col);
    bossFace(c,bx,by-r*.05,r*.7,ratio,t);for(let i=0;i<5;i++)disc(c,bx-r*.5+i*r*.25,by+r*.32,r*.06,'#C9654A');}
  else if(type==='whale'){glowAt(c,bx,by,r*1.6,'255,220,120',.35);ell(c,bx,by,r*1.15,r*.7,col);ell(c,bx+r*.1,by+r*.3,r*.9,r*.32,'#FFF3D0');poly(c,[[bx-r*1.05,by],[bx-r*1.6,by-r*.55],[bx-r*1.5,by+r*.4]],col);
    const p=(t%2400)/2400;if(p<.5)for(let i=0;i<5;i++)disc(c,bx+r*.1+(i-2)*p*4,by-r*.8-p*r*1.1+Math.abs(i-2)*p*3,1.4,'rgba(255,255,255,.9)');bossFace(c,bx+r*.4,by-r*.1,r*.7,ratio,t);}
  else if(type==='ship'){const pl={hull:boss.ghost?'hull_ghost':'hull_navy',sail:boss.ghost?'sail_canvas':'sail_black',flag:'flag_skull'};c.save();if(boss.ghost)c.globalAlpha=.78+.12*Math.sin(t/500);
    c.translate(bx,by+r*.7);c.scale(-1,1);drawShip(c,0,0,r/34,pl,t,{captain:false});c.restore();c.globalAlpha=1;
    bossFace(c,bx-r*.05,by+r*.3,r*.55,ratio,t);
    if(ratio<.5)for(let i=0;i<3;i++){const fx=bx-r*.6+i*r*.5;glowAt(c,fx,by+r*.2,4,'255,140,60',.6);poly(c,[[fx-1.4,by+r*.3],[fx,by+r*.3-4-Math.sin(t/100+i)],[fx+1.4,by+r*.3]],'#F2A33A');}}
}

/* ---------- Funnal Cove harbour (shared) ---------- */
function drawHarbour(c,t){
  if(!G)return;S.target=null;const today=G.days[G.today];const tgt=today.target,team=today.team;const won=tgt>0&&team>=tgt;
  const teamFog=Object.values(S.forfeits).some(f=>f&&f.type==='team'&&f.status==='spun'&&Date.now()-f.ts<86400000);
  sky(c,t,{fireworks:won&&skyPhase()==='night'});
  ell(c,18,112,30,7,'#86BDB6');ell(c,302,110,40,8,'#86BDB6');
  const B=Object.fromEntries(G.proj.map(p=>[p.id,p]));
  if(B.sky.built){const x=(t/60)%380-40;ell(c,x,34,12,5,'#E06034');rr(c,x-6,39,12,4,1.5,'#7A5A3A');}
  sea(c,108,t);
  island(c,110,118,100,16,t);
  palm(c,26,116,15,t);palm(c,192,116,13,t+400);
  const open=G.proj.find(p=>p.open);
  const drawIf=(id,fn,sx,sy,w,h)=>{const pr=B[id];if(pr.built){fn();hit(sx,sy,w,h,pr.name,pr.blurb+' Built by the crew.');}else if(open&&open.id===id){hit(sx,sy-8,w,h+8,'Next build: '+pr.name,`${pr.blurb} Needs ${fmtN(pr.dm)} crew DMs (you have ${fmtN(G.teamDm)}) and ${fmtN(pr.g)} doubloons of funding (${fmtN(pr.funded)} so far). Fund it from the Quests tab.`);c.strokeStyle='rgba(63,81,96,.45)';c.lineWidth=.8;c.setLineDash([2,2]);c.beginPath();c.roundRect?c.roundRect(sx,sy,w,h,3):c.rect(sx,sy,w,h);c.stroke();c.setLineDash([]);txt(c,'next build',sx+w/2,sy-8,'#3F5160',6,'center');}};
  drawIf('jetty',()=>{rr(c,196,116,36,3,1,'#B98552');for(let i=199;i<232;i+=7)R(c,i,119,1.6,7,'#8A5E38');},196,113,36,12);
  drawIf('boats',()=>{[[250,122],[272,130]].forEach(([x,y],i)=>{const b=Math.sin(t/500+i);rr(c,x-6,y+b,12,3.4,1.7,'#D9485F');R(c,x-.3,y-7+b,.7,7,'#FFFFFF');poly(c,[[x+.5,y-6+b],[x+5,y-1+b],[x+.5,y-1+b]],'#FFFFFF');});},240,112,40,24);
  drawIf('stall',()=>{rr(c,40,96,16,11,2,'#E8B46A');for(let i=0;i<4;i++)rr(c,39+i*4.5,92,4.5,5,1.5,i%2?'#E06034':'#FFFFFF');disc(c,44,101,1.5,'#FFE7A0');disc(c,51,101,1.5,'#FFE7A0');},38,88,20,19);
  drawIf('bakery',()=>{rr(c,60,88,22,18,2,'#FFF4DE');poly(c,[[57,89],[71,79],[85,89]],'#C9654A');rr(c,68,98,5,8,2,'#9A6B45');rr(c,62,92,4,4,1,'#9FD7F0');rr(c,75,92,4,4,1,'#9FD7F0');R(c,82,91,.7,6,'#7A4E30');rr(c,82.6,91,6,4,1,'#F4E8CC');disc(c,85.6,93,1,'#C9654A');disc(c,78,76-(t/120%6),1.5,'rgba(255,255,255,.7)');},57,78,32,28);
  drawIf('market',()=>{rr(c,86,104,40,3,1.5,'#E9D6A8');for(let i=0;i<3;i++){rr(c,89+i*13,96,10,8,1.5,'#F4C77D');rr(c,88+i*13,93,12,3.5,1.5,i%2?'#4A7EC2':'#FFFFFF');}},86,92,40,15);
  const beacon=B.beacon.built;drawLighthouse(c,104,106,beacon?50:34,beacon?'#C91E36':'#D9485F',t,{gold:beacon});hit(98,64,14,44,'Funnal Cove lighthouse','Your shared port. It grows as the crew completes building projects (see Quests).');
  drawIf('clock',()=>{rr(c,128,70,12,36,2,'#E6D7B5');poly(c,[[126,71],[134,62],[142,71]],'#486790');disc(c,134,78,4,'#FFFFFF');const a=t/2000;line(c,134,78,134+Math.cos(a)*3,78+Math.sin(a)*3,'#3F5160',.6);rr(c,132,96,4,10,2,'#9A6B45');},126,62,16,44);
  drawIf('carto',()=>{rr(c,146,92,18,14,2,'#C79A6A');poly(c,[[143,93],[155,84],[167,93]],'#486790');rr(c,151,98,4,8,2,'#7A5A3A');disc(c,160,96,2,'#FFE7A0');},143,84,24,22);
  drawIf('observatory',()=>{rr(c,170,90,20,16,2,'#F2EEE6');c.fillStyle='#9FB3D9';c.beginPath();c.arc(180,90,10,Math.PI,0);c.fill();R(c,179,80,2,8,'#3F5160');rr(c,177,98,5,8,2,'#3F5160');},169,80,22,26);
  drawIf('flags',()=>{c.strokeStyle='#9A8A6A';c.lineWidth=.5;c.beginPath();c.moveTo(40,85);c.quadraticCurveTo(110,96,190,85);c.stroke();for(let i=0;i<15;i++){const x=44+i*10,y=85+Math.sin(i/14*Math.PI)*5.5+Math.sin(t/400+i)*.6;poly(c,[[x,y],[x+4,y],[x+2,y+4]],['#D9485F','#DDA94D','#5DBE9C','#4A7EC2'][i%4]);}},40,82,150,10);
  drawIf('bridge',()=>{c.strokeStyle='#B98552';c.lineWidth=2;c.beginPath();for(let x=215;x<=320;x+=2){const y=104-Math.sin((x-215)/105*Math.PI)*22;x===215?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();for(let x=221;x<320;x+=12){const y=104-Math.sin((x-215)/105*Math.PI)*22;R(c,x,y-5,.8,5,'#8A5E38');disc(c,x+.4,y-6,1.4,'#FFE07A');}},215,80,105,26);
  // the two flagships
  const P=G.P;const lead=today.leader;
  P.forEach((p,i)=>{const pl=S.players[p]||{};const x=i?142:58,y=154+i*4;const ch=activeForfeitsFor(p).some(f=>f.result==='chicken');
    const fire=S.fired&&S.fired[p]?Math.max(0,1-(performance.now()-S.fired[p])/600):0;
    drawShip(c,x,y,.62,pl,t,{pid:p,chicken:ch,moth:G.players[p]?.moth,phase:i*2,firing:fire,em:emGrade(today.p[p]?.d||0),pet:PET_BY_ID[pl.pet]});
    hit(x-24,y-50,50,52,`Captain ${pnameRaw(p)}'s ship`,`${today.p[p].d} DMs today. Tap Ship below to customise yours.`);
    if(lead===p){const cx=x,cy=y-56+Math.sin(t/400)*1.2;poly(c,[[cx-5,cy+3],[cx-5,cy-2],[cx-2.5,cy+.5],[cx,cy-3.5],[cx+2.5,cy+.5],[cx+5,cy-2],[cx+5,cy+3]],'#DDA94D');}
    txt(c,C().players[p]?.name||p,x,y+4,pcolHex(p),8,'center');});
  if(tgt>0){const boss=today.boss;const hp=Math.max(0,tgt-team);const ratio=hp/tgt;
    if(!won){const r=12+20*ratio;const off={storm:null,ship:.7,serpent:.55,octopus:.45,kraken:.45,crab:.4,whale:.35}[boss.type||'storm'];const bx=266+Math.sin(t/1700)*4,by=off==null?66+Math.sin(t/1100)*3:113-r*off+Math.sin(t/1100)*1.4;drawBoss(c,boss,bx,by,r,ratio,t,S.bossFlash>t,off==null?null:113);S.target={x:bx,y:by};
      hit(bx-r*1.2,by-r*1.2,r*2.4,r*2.4,boss.name,`Today's sea foe${boss.rare?' (rare!)':''}. It has ${hp} of ${tgt} HP left: every DM either of you logs fires one cannonball. Sink it to earn +100 XP and 30 doubloons each.`);}
    else drawSunk(c,t,boss,today);}
  updateLanterns(c,t);harbourNight(c,t,B);
  if(teamFog){c.fillStyle='rgba(200,206,220,.5)';c.fillRect(0,0,W,H);for(let i=0;i<6;i++){const x=(i*67+t/80)%380-30,y=60+(i%3)*30;for(let k=0;k<5;k++)disc(c,x+k*7,y+Math.sin(k)*3,10,'rgba(240,242,248,.55)');}txt(c,'Team forfeit: the fog moved in for the day',160,6,'#3F5160',8,'center');}
}
function launchLantern(p){if(!G)return;const i=G.P.indexOf(p);const voy=S.focus?S.focusMode==='voyage':S.screen==='lockin';if(voy&&p===S.me&&!S.target){const lk=S.players[p]?.lock;if(lk&&!isFish(lk.mode)){S.haul={at:performance.now(),n:(S.haul&&S.haul.lk===lk.id?S.haul.n:0)+1,lk:lk.id};}return;}S.fired=S.fired||{};S.fired[p]=performance.now();S.lanterns.push({x:voy?126:(i?168:84),y:voy?122:140+i*4,born:performance.now(),col:pcolHex(p),tx:S.target?.x||262,ty:S.target?.y||78,st:(ALL_ITEMS[S.players[p]?.shot]||{}).st});if(S.lanterns.length>40)S.lanterns.shift();}
function updateLanterns(c,t){const nowp=performance.now();S.lanterns=S.lanterns.filter(l=>{const age=(nowp-l.born)/1000;if(age>1.6)return false;const p=Math.min(1,age/1.1);const x=l.x+(l.tx-l.x)*p,y=l.y+(l.ty-l.y)*p-Math.sin(p*Math.PI)*40;
  for(let k=1;k<5;k++){const q=Math.max(0,p-k*.04);disc(c,l.x+(l.tx-l.x)*q,l.y+(l.ty-l.y)*q-Math.sin(q*Math.PI)*40,1.6-k*.3,`rgba(255,255,255,${.5-k*.1})`);}
  drawShot(c,x,y,l.st,t);if(p>=1&&!l.hit){l.hit=true;S.bossFlash=t+110;S.boom={x,y,t:nowp};}return p<1;});
  if(S.boom){const a=(nowp-S.boom.t)/400;if(a<1){for(let i=0;i<7;i++){const an=i/7*TAU;disc(c,S.boom.x+Math.cos(an)*a*9,S.boom.y+Math.sin(an)*a*9,2.4*(1-a),i%2?'#FFD45A':'#F27A3A');}disc(c,S.boom.x,S.boom.y,5*(1-a),'rgba(255,255,255,.8)');}}}

/* ---------- Your ship (personal) and hideout ---------- */
const DECOR_SPOTS=[[24,63],[38,66],[52,68],[112,68],[126,66],[140,63]];
function drawShipScene(c,t,pid){
  if(!G)return;const pl=S.players[pid]||{};const me=G.players[pid];const fx=pl.effect;const act=activeForfeitsFor(pid);
  sky(c,t,{aurora:fx==='fx_aurora',shooting:fx==='fx_shooting',rainbow:fx==='fx_rainbow',fireworks:fx==='fx_fireworks'});
  island(c,268,112,34,6,t);palm(c,262,108,10,t);palm(c,276,109,8,t+300);
  sea(c,110,t,{glow:fx==='fx_biolum'});
  if(fx==='fx_whale')whale(c,t);
  const ch=act.some(f=>f.result==='chicken'),dance=act.some(f=>f.result==='dance');
  drawShip(c,140,152,1.55,pl,t,{pid,chicken:ch,dance,moth:me.moth,em:emGrade(G.days[G.today].p[pid]?.d||0),pet:PET_BY_ID[pl.pet]});
  hit(140-20,30,40,20,'Emissary flag',`Grade ${['I','II','III','IV','V'][emGrade(G.days[G.today].p[pid]?.d||0)]}: ${pname(pid)}'s own flag. It rises with their DMs today (10, 22, 35, 50) and resets each morning. Higher grades make each of their DMs worth more, up to double, on voyages too.`);
  hit(140+2,152-104,20,14,'Your flag',`${(it(pl.flag||SHIP_DEFAULT.flag)||{}).name}. Change it under Wardrobe & rigging.`);
  hit(140-30,152-90,50,50,'Sails',`${(it(pl.sail||SHIP_DEFAULT.sail)||{}).name}. Change them under Wardrobe & rigging.`);
  hit(140-55,152-30,120,32,'Hull',`${(it(pl.hull||SHIP_DEFAULT.hull)||{}).name}${pl.figure?' with a '+it(pl.figure).name:''}.`);
  if(pl.pet&&PET_BY_ID[pl.pet])hit(140-14,152-36,14,16,PET_BY_ID[pl.pet].name,`Your ${PET_BY_ID[pl.pet].rar} pet. Collect more from daily sightings.`);
  if(fx==='fx_dolphins')dolphins(c,t);
  if(act.some(f=>f.result==='gull'))drawGull(c,90+Math.sin(t/700)*4,104,t);
  if(fx==='fx_fireflies')for(let i=0;i<16;i++){const a=t/1500+i;const on=Math.sin(t/300+i)>0;disc(c,40+((i*37)%240)+Math.sin(a)*6,40+((i*23)%60)+Math.cos(a*1.3)*4,on?1.2:.6,on?'#F4FF9A':'#C8D27A');}
  if(fx==='fx_snow')for(let i=0;i<60;i++)disc(c,(i*53+t/40)%W,(i*29+t/25)%H,.8,'#FFFFFF');
  if(fx==='m_fx_bubbles')for(let i=0;i<14;i++){const y=H-((t/30+i*40)%120),x=40+(i*41)%250+Math.sin(t/500+i)*3;c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=.6;c.beginPath();c.arc(x,y,2+i%3,0,TAU);c.stroke();}
  const today=G.days[G.today];if(today.leader!==pid&&today.leader&&today.over.some(o=>o.who!==pid))txt(c,`${C().players[other(pid)]?.name||''} is ahead today`,160,6,pcolHex(other(pid)),8,'center');
}
function drawIslet(c,t,pid){
  if(!G)return;const pl=S.players[pid]||{};const me=G.players[pid];const fx=pl.effect;const act=activeForfeitsFor(pid);
  sky(c,t,{aurora:fx==='fx_aurora',shooting:fx==='fx_shooting',rainbow:fx==='fx_rainbow',fireworks:fx==='fx_fireworks'});
  sea(c,124,t,{glow:fx==='fx_biolum'});
  c.save();c.scale(2,2);
  island(c,80,71,66,10,t);palm(c,16,68,14,t);palm(c,148,67,12,t+200);
  (pl.decor||[]).forEach((id,i)=>{if(id&&DECOR_SPOTS[i])drawDecor(c,id,DECOR_SPOTS[i][0],DECOR_SPOTS[i][1],t+i*300);});
  if(act.some(f=>f.result==='gnomes'))[[60,67],[68,68],[104,68]].forEach(([x,y])=>drawGnome(c,x,y));
  if(act.some(f=>f.result==='statue')){c.save();c.translate(40,38);c.scale(2,2);drawKeeper(c,0,0,other(pid),S.players[other(pid)],0);c.restore();rr(c,38,60,20,4,1.5,'#C9C3B6');}
  const ch=act.some(f=>f.result==='chicken'),dance=act.some(f=>f.result==='dance');
  const kx=78,ky=54;drawKeeper(c,kx,ky,pid,pl,t,{chicken:ch,dance});if(pl.pet&&PET_BY_ID[pl.pet])drawPet(c,PET_BY_ID[pl.pet],kx+14,ky+12,t,.7);
  if(act.some(f=>f.result==='gull'))drawGull(c,kx-13+Math.sin(t/700)*3,ky+6,t);
  const ma=t/1200;drawMoth(c,kx+4+Math.cos(ma)*14,ky-6+Math.sin(ma*1.7)*5,me?.moth||0,t,pl.moth);
  c.restore();
  if(act.some(f=>f.result==='statue'))txt(c,(C().players[other(pid)]?.name||'Rival')+' the Great',96,58,'#3F5160',8,'center');
  if(fx==='fx_dolphins')dolphins(c,t);if(fx==='fx_whale')whale(c,t);
  if(fx==='fx_fireflies')for(let i=0;i<16;i++){const a=t/1500+i;const on=Math.sin(t/300+i)>0;disc(c,40+((i*37)%240)+Math.sin(a)*6,80+((i*23)%50)+Math.cos(a*1.3)*4,on?1.2:.6,on?'#F4FF9A':'#C8D27A');}
  if(fx==='fx_snow')for(let i=0;i<60;i++)disc(c,(i*53+t/40)%W,(i*29+t/25)%H,.8,'#FFFFFF');
}
/* ---------- Lock In voyage: open ocean, encounters, monster, treasure island ---------- */
/* 23 Nov: the whale, turtle and mermaid were a few loose ellipses that read as random blobs. Drawn properly now. */
function encWhale(c,ex,ey,p,t){const bp=Math.sin(Math.min(1,p*1.6)*Math.PI);const y=ey+6-bp*20,ang=-.55+Math.min(1,p*1.6)*1.1;
  if(bp>.05){c.save();c.globalAlpha=.75*bp;for(let k=0;k<7;k++){const a=-Math.PI*(.15+k*.12);disc(c,ex+Math.cos(a)*(10+bp*6),ey+4+Math.sin(a)*(4+bp*7),1.4+bp*1.6,'#FFFFFF');}c.restore();}
  c.save();c.translate(ex,y);c.rotate(ang);
  c.fillStyle='#35577E';c.beginPath();c.moveTo(-20,0);c.bezierCurveTo(-16,-9,10,-10,19,-3);c.bezierCurveTo(22,0,20,4,15,5);c.bezierCurveTo(4,8,-12,6,-20,1);c.closePath();c.fill();
  c.fillStyle='#D8E6F2';c.beginPath();c.moveTo(-14,3);c.bezierCurveTo(-4,7,10,7,17,3.5);c.bezierCurveTo(10,5.5,-2,6,-14,3);c.closePath();c.fill();
  c.strokeStyle='rgba(53,87,126,.55)';c.lineWidth=.45;for(let k=0;k<4;k++){c.beginPath();c.moveTo(4+k*2.6,4.2);c.lineTo(8+k*2.6,5.6);c.stroke();}
  c.fillStyle='#35577E';c.beginPath();c.moveTo(-19,0);c.quadraticCurveTo(-24,-2,-28,-7);c.quadraticCurveTo(-25,-1,-29,3);c.quadraticCurveTo(-24,1.5,-19,2);c.closePath();c.fill();
  c.beginPath();c.moveTo(2,4);c.quadraticCurveTo(0,10,-5,11);c.quadraticCurveTo(-1,7,-2,4);c.closePath();c.fill();
  disc(c,13,-.6,1,'#FFFFFF');disc(c,13.3,-.6,.55,'#1B2A3A');c.restore();
  if(p>.55){const q=Math.min(1,(p-.55)/.3);c.save();c.globalAlpha=1-q;for(let k=0;k<3;k++)ell(c,ex,ey+6,8+q*16+k*4,2+q*3+k,'rgba(255,255,255,0)');c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=.8;c.beginPath();c.ellipse(ex,ey+6,8+q*18,2+q*3.5,0,0,Math.PI*2);c.stroke();c.restore();}}
function encTurtle(c,ex,ey,t){const bob=Math.sin(t/500)*1;const y=ey+5+bob,f=Math.sin(t/260);c.save();c.translate(ex,y);c.scale(1.5,1.5);
  c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=.5;c.beginPath();c.ellipse(0,3.2,11,2,0,0,Math.PI*2);c.stroke();
  c.fillStyle='#7CC39A';c.beginPath();c.ellipse(-6,2+f*.6,3.2,1.2,-.5-f*.3,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(5,2.4-f*.6,3.4,1.3,.5+f*.3,0,Math.PI*2);c.fill();
  c.beginPath();c.ellipse(9.4,-.6,2.6,2,-.2,0,Math.PI*2);c.fill();disc(c,10.6,-1.2,.55,'#1B2A2A');
  c.fillStyle='#3F7A52';c.beginPath();c.ellipse(0,0,7.6,4.6,0,Math.PI,0);c.lineTo(7.6,1.2);c.lineTo(-7.6,1.2);c.closePath();c.fill();
  c.fillStyle='#5E9F6A';[[-3.6,-1.8],[0,-2.8],[3.6,-1.8]].forEach(([x,yy])=>{c.beginPath();c.ellipse(x,yy,2,1.4,0,0,Math.PI*2);c.fill();});
  c.fillStyle='#C9B67A';c.fillRect(-7.6,.8,15.2,.9);c.restore();}
function encMermaid(c,ex,ey,t){const sw=Math.sin(t/420);c.save();c.translate(ex,ey+2);c.scale(1.6,1.6);
  c.fillStyle='#6E6A70';c.beginPath();c.moveTo(-9,5);c.quadraticCurveTo(-7,-2,0,-1);c.quadraticCurveTo(7,-2,9,5);c.closePath();c.fill();c.fillStyle='#8A868C';c.beginPath();c.moveTo(-6,0);c.quadraticCurveTo(0,-2.5,5,0);c.lineTo(0,1);c.closePath();c.fill();
  c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=.5;c.beginPath();c.ellipse(0,5,11,1.6,0,0,Math.PI*2);c.stroke();
  c.fillStyle='#2FA38E';c.beginPath();c.moveTo(-1,-2);c.quadraticCurveTo(5,-1,7,1.5);c.quadraticCurveTo(9,3,10.5,2+sw);c.lineTo(10,1.2);c.quadraticCurveTo(8,1.6,6.5,.4);c.quadraticCurveTo(4,-2,-1.5,-4);c.closePath();c.fill();
  c.beginPath();c.moveTo(10,1.6+sw);c.lineTo(13.5,-1+sw*1.4);c.lineTo(12.2,2.2+sw);c.lineTo(13.6,4.6+sw*1.2);c.closePath();c.fill();
  c.fillStyle='#F2C9A8';c.beginPath();c.moveTo(-2.2,-4);c.quadraticCurveTo(-2.8,-7,-1.2,-9);c.lineTo(1,-9);c.quadraticCurveTo(1.6,-7,.8,-4);c.closePath();c.fill();
  c.strokeStyle='#F2C9A8';c.lineWidth=.9;c.lineCap='round';c.beginPath();c.moveTo(.6,-8);c.lineTo(3.4+sw*.4,-11.5-sw*.8);c.stroke();
  c.fillStyle='#E0607E';disc(c,-1.4,-7.4,.8,'#E0607E');disc(c,.4,-7.4,.8,'#E0607E');
  disc(c,-.2,-11,2.1,'#F2C9A8');c.fillStyle='#D2522E';c.beginPath();c.moveTo(-2.4,-11.6);c.quadraticCurveTo(-.2,-14.4,2,-11.8);c.quadraticCurveTo(-.6,-12.6,-2,-11);c.quadraticCurveTo(-4.4,-7,-3.4,-4.2);c.quadraticCurveTo(-4.8,-8,-2.4,-11.6);c.closePath();c.fill();
  disc(c,.6,-11,.32,'#2A1A14');c.restore();}
function voyageEnc(lk,el){if(!lk||!lk.id)return null;let at=70000+h32(lk.id+'e0')%60000;let i=0;while(at<el+1){const end=at+26000;if(el>=at&&el<end){let ei=h32(lk.id+'e'+i)%ENCOUNTERS.length;if(ENCOUNTERS[ei].id==='stars'&&skyPhase()!=='night')ei=(ei+1)%ENCOUNTERS.length;const e=ENCOUNTERS[ei];return{...e,i,p:(el-at)/26000};}i++;at=end+90000+h32(lk.id+'e'+i)%110000;}return null;}
function voyageBoss(lk){const d=VOYAGE_DIFF[lk.diff||'calm'];return{...d,hp:Math.max(5,Math.round(lk.dur/60000*d.rate))};}
function drawVoyage(c,t,lk,dms,progress){
  const pl=((lk.mode==='coop'||lk.mode==='crewhunt')&&typeof coopShipPl==='function'?coopShipPl(lk):S.players[S.me])||{};const el=progress*lk.dur;const enc=voyageEnc(lk,el);const vb=voyageBoss(lk);const left=Math.max(0,vb.hp-dms);
  sky(c,t,{rainbow:enc?.id==='rainbow',shooting:enc?.id==='stars'});
  const speed=isFish(lk.mode)?.25:1+Math.min(2,(S.voyBoost||0));
  // horizon swell and parallax clouds handled by sky; sea with faster scroll
  sea(c,96,t*1.8*speed,{glow:pl.effect==='fx_biolum'||enc?.id==='jelly'});
  c.fillStyle='rgba(255,255,255,.25)';for(let i=0;i<6;i++){const x=((i*70-t/14*speed)%400+400)%400-40;c.fillRect(x,98+i%3*2,30,.8);}
  // encounters
  if(enc){const p=enc.p;const ex=330-p*380,ey=130;
    if(enc.id==='whale'){encWhale(c,ex,ey,p,t);}
    else if(enc.id==='dolphins'){for(let k=0;k<3;k++){const q=(p*3+k*.33)%1;c.save();c.translate(ex+k*14,ey+8-Math.sin(q*Math.PI)*12);c.rotate(-Math.cos(q*Math.PI)*.9);ell(c,0,0,6,2.2,'#7FA3C8');poly(c,[[-6,0],[-9,-2],[-9,2]],'#7FA3C8');c.restore();}}
    else if(enc.id==='bottle'||enc.id==='chest'){const got=G.players[S.me]?.claimed.has(`vb_${lk.id}_${enc.i}`);if(!got){const by=ey+Math.sin(t/300)*1.5;if(enc.id==='bottle'){c.save();c.translate(ex,by);c.rotate(.4);rr(c,-2,-6,4,8,1.5,'rgba(170,220,200,.9)');rr(c,-1,-8,2,2.4,.6,'#9A6B45');rr(c,-1.2,-3,2.4,3,.4,'#F4E8CC');c.restore();}else{rr(c,ex-5,by-4,10,6,1,'#A8704A');c.fillStyle='#8A5A3A';c.beginPath();c.ellipse(ex,by-4,5,2.4,0,Math.PI,0);c.fill();R(c,ex-.6,by-5,1.2,5,'#F2C462');}
      glowAt(c,ex,by-3,9,'255,240,170',.4+.2*Math.sin(t/200));hit(ex-10,by-14,20,22,enc.id==='chest'?'Floating chest':'Message in a bottle','Tap to collect a small reward!',{collect:`vb_${lk.id}_${enc.i}`,kind:enc.id});}}
    else if(enc.id==='turtle'){encTurtle(c,ex,ey,t);}
    else if(enc.id==='flyingfish'){for(let k=0;k<6;k++){const q=(p*4+k*.2)%1;const fx=ex+k*8,fy=ey-Math.sin(q*Math.PI)*16;ell(c,fx,fy,2.4,.9,'#9FD7F0',-.3);poly(c,[[fx,fy],[fx-1,fy-2.6],[fx+1.4,fy-.6]],'#DCEFF8');}}
    else if(enc.id==='ghost'){c.globalAlpha=.55;c.save();c.translate(ex,ey-4);c.scale(-1,1);drawShip(c,0,0,.6,{hull:'hull_ghost',sail:'sail_canvas',flag:'flag_skull'},t,{captain:false});c.restore();c.globalAlpha=1;}
    else if(enc.id==='spout'){for(let k=0;k<20;k++){const yy=ey-k*4;disc(c,ex+Math.sin(t/120+k*.5)*(2+k*.3),yy,2+k*.18,'rgba(200,225,240,.55)');}}
    else if(enc.id==='jelly'){for(let k=0;k<5;k++){const jx=ex+k*12,jy=ey+6+Math.sin(t/400+k)*3;glowAt(c,jx,jy,6,'200,160,255',.6);ell(c,jx,jy,3,2,'rgba(230,200,255,.9)');for(let l=-1;l<=1;l++)line(c,jx+l,jy+1,jx+l+Math.sin(t/200+l),jy+5,'rgba(230,200,255,.7)',.4);}}
    else if(enc.id==='mermaid'){encMermaid(c,ex,ey,t);}
    else if(enc.id==='barge'){rr(c,ex-12,ey,24,5,2,'#8A5A3A');rr(c,ex-6,ey-7,12,7,1.5,'#E8B46A');R(c,ex-.4,ey-15,.8,8,'#7A4E30');poly(c,[[ex+.4,ey-15],[ex+7,ey-12],[ex+.4,ey-9]],'#9B5DE5');}
    else if(enc.id==='gulls'){for(let k=0;k<4;k++){const gx=ex-20+k*10,gy=40+Math.sin(t/300+k)*4;c.strokeStyle='#FFFFFF';c.lineWidth=1;c.beginPath();c.moveTo(gx-3,gy);c.quadraticCurveTo(gx-1.5,gy-2,gx,gy);c.quadraticCurveTo(gx+1.5,gy-2,gx+3,gy);c.stroke();}}
  }
  // the voyage monster
  const mx=250+Math.sin(t/900)*6,my=118;
  if(isFish(lk.mode)){S.target=null;drawFishing(c,t,lk);}
  else if(lk.hv===2){drawHuntV2(c,t,lk,mx,my);}
  else if(left>0){const r=10+12*(left/vb.hp);const vd=VOYAGE_DIFF[lk.diff]||{};const type=vd.type||(lk.diff==='legend'?'kraken':lk.diff==='rough'?'serpent':'seal');
    if(type==='seal'){const sc=vd.col||'#9AA8B8';ell(c,mx,my+4,r,r*.62,sc);disc(c,mx+r*.6,my-r*.2,r*.55,sc);disc(c,mx+r*.45,my-r*.35,r*.12,'#3F3A30');disc(c,mx+r*.85,my-r*.35,r*.12,'#3F3A30');ell(c,mx+r*.7,my-r*.05,r*.22,r*.14,'#5A5650');line(c,mx+r*.95,my,mx+r*1.4,my-r*.1,'#5A5650',.4);c.globalAlpha=.5;disc(c,mx+r*.35,my,r*.12,'#F49A9A');c.globalAlpha=1;}
    else drawBoss(c,{type:type==='ghost'?'ship':type,ghost:type==='ghost',rare:lk.diff==='goldleviathan'?0:0,col:vd.col||(type==='kraken'?'#9B5DE5':'#7FB59A'),eye:'#3F3A30'},mx,my-r*.3,r,left/vb.hp,t,S.bossFlash>t,my+r*.2);
    hit(mx-r-4,my-r-4,r*2+8,r*2+8,vb.name,vb.desc+'. '+`${left} of ${vb.hp} HP left. Every DM you log this voyage hits it. Defeat it before the timer ends for +${vb.xp} XP and ${vb.g} doubloons.`);S.target={x:mx,y:my};}
  else{S.target=null;drawPlunder(c,t,lk,dms,vb);}
  // treasure island arrives at the end
  if(progress>.86){const q=Math.min(1,(progress-.86)/.14);const ix=340-q*120;island(c,ix,128,36,8,t);palm(c,ix-10,122,14,t);palm(c,ix+12,123,11,t+300);rr(c,ix-4,116,8,5,1,'#A8704A');R(c,ix-.5,116,1,5,'#F2C462');line(c,ix+16,122,ix+20,126,'#D9485F',1);line(c,ix+20,122,ix+16,126,'#D9485F',1);txt(c,'Treasure Island',ix,100,'#E06034',8,'center');hit(ix-36,100,72,32,'Treasure Island','Reach it when the timer ends. Your chest is worth 3 doubloons for every DM you sent on this voyage.');}
  drawShip(c,90+(S.haul?Math.max(0,1-(performance.now()-S.haul.at)/700)*5:0),146,1.05,pl,t,{em:emGrade(G.days[G.today]?.p[S.me]?.d||0),moving:!isFish(lk.mode),pid:lk.cid?coopCap(lk.cid):S.me,moth:G?.players[lk.cid?coopCap(lk.cid):S.me]?.moth,pet:PET_BY_ID[pl.pet],firing:S.fired&&S.fired[S.me]?Math.max(0,1-(performance.now()-S.fired[S.me])/600):0});
  for(let i=0;i<6;i++){const x=48-i*8-((t/30*speed)%8);line(c,x,148,x+5,148,'rgba(255,255,255,.85)',1);}
  if((lk.mode==='coop'||lk.mode==='crewhunt')&&typeof drawCoopExtras==='function')drawCoopExtras(c,t,lk);
  updateLanterns(c,t);
  if(enc)txt(c,enc.text,160,6,'#3F5160',8,'center');
}

/* ---------- Icons ---------- */
function drawItemIcon(cv,id){cv.width=120;cv.height=120;const c=cv.getContext('2d');c.setTransform(3,0,0,3,0,0);const d=it(id);const t=1000;if(!d)return;
  const mine={...(S.players[S.me]||{})};
  if(['hat','face','coat'].includes(d.cat)){c.save();c.translate(20,31.5);c.scale(2.3,2.3);drawKeeper(c,-4,-11.5,S.me,{...mine,[d.cat]:id},t);c.restore();}
  else if(['hull','sail','flag','figure'].includes(d.cat)){const pl={...mine,[d.cat]:id,deck:[]};if(d.cat==='flag'){c.save();c.translate(20,20);c.scale(2.2,2.2);drawFlag(c,-6,-4,id,t);c.restore();}else if(d.cat==='figure'){c.save();drawShip(c,-25,40,1.3,pl,t,{captain:false});c.restore();}else{c.save();drawShip(c,19,33,.5,pl,t,{captain:false});c.restore();}}
  else if(d.cat==='trail'){c.fillStyle='#5FCFD8';c.beginPath();c.arc(20,20,19,0,TAU);c.fill();drawWake(c,30,24,d.st,1600,.9);drawWake(c,30,24,d.st,2300,.9);drawWake(c,30,24,d.st,3100,.9);c.save();drawShip(c,26,30,.36,{...mine,trail:id,deck:[]},t,{captain:false});c.restore();}
  else if(d.cat==='shot'){c.save();c.translate(20,20);c.scale(2.6,2.6);drawShot(c,0,0,d.st,1000);c.restore();}
  else if(d.cat==='deck'){const big=['teatray','twinrods','bottles'].includes(d.st);c.save();c.translate(20,big?31:30);c.scale(big?2.7:2,big?2.7:2);drawDeckItem(c,id,0,0,t);c.restore();}
  else if(d.cat==='decor'){ell(c,20,33,15,4,'#9BD27A');drawDecor(c,id,20,33,t);}
  else if(d.cat==='moth'){c.save();c.translate(20,24);c.scale(2,2);drawMoth(c,0,0,3,t,id,false);c.restore();}
  else if(d.cat==='shield'){poly(c,[[20,8],[31,12],[31,20],[20,33],[9,20],[9,12]],'#4A7EC2');poly(c,[[20,12],[27,15],[27,20],[20,29],[13,20],[13,15]],'#DDA94D');drawMark(c,20,20,9,'#FFFFFF');}
  else{c.save();c.beginPath();c.arc(20,20,19,0,TAU);c.clip();const g=c.createLinearGradient(0,0,0,40);g.addColorStop(0,'#5B6FA8');g.addColorStop(1,'#9E8FC4');c.fillStyle=g;c.fillRect(0,0,40,40);
    if(id==='fx_aurora')for(let x=0;x<40;x+=2){c.fillStyle=`hsla(${140+x*3},90%,72%,.7)`;c.fillRect(x,10+Math.sin(x/6)*4,2,12);}
    else if(id==='fx_snow')for(let i=0;i<22;i++)disc(c,(i*13)%40,(i*7)%40,.9,'#fff');
    else if(id==='fx_fireflies')for(let i=0;i<10;i++)disc(c,(i*11)%38+1,(i*17)%38+1,1.3,'#F4FF9A');
    else if(id==='fx_shooting'){line(c,10,24,30,12,'#fff',1.2);disc(c,30,12,1.5,'#fff');}
    else if(id==='fx_rainbow'){['#E0453B','#F2A33A','#F2D24A','#5DBE9C','#4A7EC2','#9B5DE5'].forEach((col,i)=>{c.strokeStyle=col;c.lineWidth=1.6;c.beginPath();c.arc(20,34,16-i*1.6,Math.PI,TAU);c.stroke();});}
    else if(id==='fx_dolphins'||id==='fx_whale'||id==='fx_biolum'){c.fillStyle=id==='fx_biolum'?'#1F6F9A':'#5FCFD8';c.fillRect(0,22,40,18);if(id==='fx_biolum')for(let i=0;i<10;i++)disc(c,(i*9)%38+1,25+(i*5)%12,.8,'#AAFFF0');else{c.save();c.translate(-238+20,-152+26);id==='fx_whale'?whale(c,0):null;c.restore();if(id==='fx_dolphins'){ell(c,20,18,7,2.6,'#7FA3C8',-.4);poly(c,[[14,21],[11,20],[12,24]],'#7FA3C8');}}}
    else if(id==='fx_fireworks'){for(let i=0;i<12;i++){const a=i/12*TAU;disc(c,20+Math.cos(a)*9,16+Math.sin(a)*9,1.2,['#F2C462','#E0457B','#7CC7E6'][i%3]);}}
    else if(id==='goldlh'){c.fillStyle='#BFE8F6';c.fillRect(0,0,40,40);drawShip(c,19,33,.5,{...mine,effect:'goldlh',deck:[]},t,{captain:false});}
    else for(let i=0;i<8;i++){c.strokeStyle='#E6F6FF';c.lineWidth=.8;c.beginPath();c.arc((i*9)%36+3,(i*13)%34+3,2,0,TAU);c.stroke();}
    c.restore();}
}
function drawCollectIcon(cv,item,found){cv.width=84;cv.height=84;const c=cv.getContext('2d');c.setTransform(4.2,0,0,4.2,0,0);
  if(!found){txt(c,'?',10,4,'#B9B1A0',10,'center');return;}
  const col={common:'#9AA3AE',uncommon:'#45B07C',rare:'#3E8DDB',epic:'#9B5DE5',legendary:'#D99A17',mythic:'#E0457B'}[item.rar];const set=item.set;
  if(set==='shells'){c.fillStyle=col;c.beginPath();c.moveTo(10,16);c.lineTo(4,8);c.quadraticCurveTo(10,1,16,8);c.closePath();c.fill();}
  else if(set==='bottles'){rr(c,8.5,3,3,3,1,'#9A6B45');rr(c,6,6,8,11,3,col);rr(c,8,9,4,3,1,'#FFFFFF');}
  else if(set==='lanterns'){rr(c,6,5,8,10,3,col);disc(c,10,10,2,'#FFF3B8');R(c,9,3,2,2,'#3F5160');}
  else if(set==='charts'){rr(c,4,5,12,10,1.5,'#F4E8CC');line(c,6,8,13,12,col,.6);line(c,12,7,14,9,'#D9485F',.7);line(c,14,7,12,9,'#D9485F',.7);}
  else if(set==='feathers'){ell(c,10,10,3,7,col,.6);line(c,6,15,14,5,'#fff',.5);}
  else{disc(c,10,10,6,col);disc(c,10,10,4.6,'rgba(255,255,255,.25)');txt(c,'$',10,5.4,'#fff',8,'center');}
}
function avatarCanvas(pid){const cv=document.createElement('canvas');cv.width=96;cv.height=96;const c=cv.getContext('2d');c.setTransform(6,0,0,6,0,0);const g=c.createLinearGradient(0,0,0,16);g.addColorStop(0,'#BFE8F6');g.addColorStop(1,'#E9F7FC');c.fillStyle=g;c.fillRect(0,0,16,16);c.save();c.translate(3.2,2.4);c.scale(1.2,1.2);drawKeeper(c,0,0,pid,S.players[pid],0,{chicken:activeForfeitsFor(pid).some(f=>f.result==='chicken')});c.restore();return cv.toDataURL();}
function drawGullIcon(cv){cv.width=96;cv.height=96;const c=cv.getContext('2d');c.setTransform(8,0,0,8,0,0);drawGull(c,0,3,200);}
