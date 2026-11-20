/* ============================== PIXEL ART ============================== */
const W=320,H=180;
function R(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function disc(c,cx,cy,r,col){c.fillStyle=col;for(let y=-r;y<=r;y++){const w=Math.round(Math.sqrt(r*r-y*y));c.fillRect(Math.round(cx-w),Math.round(cy+y),w*2+1,1);}}
function ell(c,cx,cy,rx,ry,col){c.fillStyle=col;for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(1-(y*y)/(ry*ry)));c.fillRect(Math.round(cx-w),Math.round(cy+y),w*2+1,1);}}
function spr(c,rows,pal,x,y,s=1,flip=false){for(let j=0;j<rows.length;j++){const r=rows[j];for(let i=0;i<r.length;i++){const ch=r[i];if(ch==='.')continue;c.fillStyle=pal[ch]||'#f0f';const xi=flip?(r.length-1-i):i;c.fillRect(Math.round(x+xi*s),Math.round(y+j*s),s,s);}}}
function txt(c,s,x,y,col='#fff',size=8,align='left'){c.font=`${size}px "Pixelify Sans", monospace`;c.textAlign=align;c.textBaseline='top';c.fillStyle='#000';c.fillText(s,x+1,y+1);c.fillStyle=col;c.fillText(s,x,y);}

const KEEPER=["..hhhh..",".hhhhhh.","..ssss..","..esse..","..ssss..",".cccccc.","cccccccc","s.cccc.s","..cccc..","..pppp..","..p..p..",".bb..bb."];
const CHICKEN=["....rr....","...rrr....","..wwwww...","..wewwwo..","..wwwwwoo.","..wwwww...",".wwwwwwww.","wwwwwwwwww","wwwwwwwwww",".wwwwwwww.","...y..y...","..yy..yy.."];
const GULL=["..ww....",".wwww...","wwwwwwyy","..wwww..","...gg..."];
const GNOME=["..r..",".rrr.","rrrrr",".sss.","bwwwb",".bbb.",".b.b."];
const HATS={hat_cap:'#c94b4b',hat_beanie:'#ff7a3d',hat_tricorn:'#2b2340',hat_crown:'#c8a26a',hat_halo:'#ffef9a',m_hat_lantern:'#ffbf4d'};
const COATS={coat_yellow:'#f2c230',coat_navy:'#2f3f7a',coat_red:'#d8433b',coat_star:'#4b3a8c',m_coat_pearl:'#e9e4f0'};
function keeperPal(pl,pid){const base=pid===C().playerIds[0];return{h:HATS[pl?.hat]||(base?'#5a3a1e':'#2a2a3a'),s:'#f3c9a0',e:'#1b1840',c:COATS[pl?.coat]||(base?'#d9822b':'#3b8fc4'),p:'#2c2f4a',b:'#1b1b22'};}
function drawKeeper(c,x,y,pid,pl,t,opts={}){
  if(opts.chicken){spr(c,CHICKEN,{r:'#e33',w:'#fafafa',e:'#111',o:'#f90',y:'#f90'},x-1,y-1+(Math.sin(t/180)>0?1:0));return;}
  const bob=opts.dance?Math.round(Math.sin(t/120)*2):0;
  spr(c,KEEPER,keeperPal(pl,pid),x,y+bob,1,opts.dance&&Math.sin(t/240)>0);
  const hat=pl?.hat;
  if(hat==='hat_crown'){R(c,x+1,y-2+bob,6,2,'#c8a26a');R(c,x+1,y-3+bob,1,1,'#c8a26a');R(c,x+4,y-3+bob,1,1,'#c8a26a');R(c,x+6,y-3+bob,1,1,'#c8a26a');}
  if(hat==='hat_halo'){R(c,x+1,y-4+bob,6,1,'#ffef9a');}
  if(hat==='hat_tricorn'){R(c,x-1,y+1+bob,10,1,'#2b2340');}
  if(hat==='m_hat_lantern'){R(c,x+3,y-4+bob,2,3,'#fff3b0');}
  if(pl?.coat==='coat_star'){R(c,x+2,y+6+bob,1,1,'#fff');R(c,x+5,y+8+bob,1,1,'#fff');}
}
function drawMoth(c,x,y,stage,t,acc){
  const f=Math.sin(t/90)>0;const glow=(r,a)=>{c.fillStyle=`rgba(255,220,120,${a})`;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
  if(stage===0){glow(7,.18);ell(c,x,y,3,4,'#fff1c4');R(c,x-1,y-2,1,1,'#fff');return;}
  if(stage===1){glow(6,.15);R(c,x-4,y,8,2,'#d9e7a3');R(c,x-4,y-1,2,1,'#d9e7a3');R(c,x+3,y-3,1,2,'#ffbf4d');R(c,x-3,y,1,1,'#111');return;}
  if(stage===2){R(c,x,y-8,1,4,'#8a7a5a');ell(c,x,y,3,5,'#c9b38a');R(c,x-1,y-2,1,4,'#e0cfa8');glow(6,.12);return;}
  const big=stage>=4,sz=stage===5?7:big?5:4;glow(sz+5,stage>=4?.3:.18);
  const wc=stage===5?'#ffd27a':stage===4?'#f7e7b0':'#e8d9b8';
  if(f){ell(c,x-sz,y-2,sz,sz-1,wc);ell(c,x+sz,y-2,sz,sz-1,wc);}else{ell(c,x-sz+1,y,sz-1,sz-2,wc);ell(c,x+sz-1,y,sz-1,sz-2,wc);}
  if(stage===5){R(c,x-sz-1,y-3,2,2,'#ff7a3d');R(c,x+sz,y-3,2,2,'#ff7a3d');}
  R(c,x-1,y-3,2,7,'#6b4f2e');R(c,x-2,y-5,1,2,'#6b4f2e');R(c,x+1,y-5,1,2,'#6b4f2e');R(c,x-1,y-2,1,1,'#fff');
  if(acc==='moth_bow'){R(c,x-2,y+1,1,1,'#e33');R(c,x+1,y+1,1,1,'#e33');R(c,x-1,y+1,2,1,'#b11');}
  if(acc==='moth_scarf'){R(c,x-2,y,4,1,'#5fb6ff');R(c,x+1,y+1,1,2,'#5fb6ff');}
  if(acc==='moth_monocle'){R(c,x,y-3,2,2,'#ffdf6b');}
  if(acc==='m_moth_crown'){R(c,x-2,y-6,4,1,'#ffbf4d');R(c,x-2,y-7,1,1,'#ffbf4d');R(c,x+1,y-7,1,1,'#ffbf4d');}
}
function drawLighthouse(c,x,y,h,col,t,opts={}){
  const w=10;const a=opts.gold?'#e8b84a':'#f2efe6',b=col||'#d84a4a';
  for(let i=0;i<h;i+=6)R(c,x,y-h+i,w,Math.min(6,h-i),(i/6)%2?b:a);
  R(c,x-1,y-h-2,w+2,2,'#2b2340');R(c,x+1,y-h-8,w-2,6,'#2b2340');R(c,x+2,y-h-7,w-4,4,'#fff3b0');R(c,x+1,y-h-10,w-2,2,'#2b2340');
  if(opts.lit!==false){const ang=(t/1400)%(Math.PI*2);const cx=x+w/2,cy=y-h-5;c.save();c.globalAlpha=.18;c.fillStyle='#fff3b0';c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(ang)*140-Math.sin(ang)*12,cy+Math.sin(ang)*40);c.lineTo(cx+Math.cos(ang)*140+Math.sin(ang)*12,cy+Math.sin(ang)*40+14);c.closePath();c.fill();c.restore();
    c.fillStyle='rgba(255,230,150,.25)';c.beginPath();c.arc(cx,cy,9,0,7);c.fill();}
  R(c,x+3,y-8,4,8,'#3a2a20');
}
const DECOR={
  flowers:(c,x,y)=>{R(c,x-6,y-2,12,3,'#3d7a3a');[[-5,'#ff6b9a'],[-2,'#ffdf6b'],[1,'#c58bff'],[4,'#ff6b9a']].forEach(([d,col])=>R(c,x+d,y-4,2,2,col));},
  bench:(c,x,y)=>{R(c,x-7,y-5,14,2,'#a0754a');R(c,x-7,y-9,14,2,'#8a6238');R(c,x-6,y-3,1,3,'#6b4a2a');R(c,x+5,y-3,1,3,'#6b4a2a');},
  post:(c,x,y,t)=>{R(c,x,y-18,2,18,'#2b2340');R(c,x-2,y-22,6,5,'#2b2340');R(c,x-1,y-21,4,3,'#ffdf6b');c.fillStyle='rgba(255,220,120,.2)';c.beginPath();c.arc(x+1,y-19,7+Math.sin(t/300),0,7);c.fill();},
  crates:(c,x,y)=>{R(c,x-7,y-7,7,7,'#a7783e');R(c,x,y-7,7,7,'#946833');R(c,x-4,y-13,7,6,'#b88647');R(c,x-7,y-4,14,1,'#6b4a2a');},
  pine:(c,x,y)=>{R(c,x-1,y-4,2,4,'#5a3a1e');for(let i=0;i<4;i++)R(c,x-7+i*2,y-8-i*4,14-i*4,4,i%2?'#2f6b3f':'#3a7d4a');},
  mailbox:(c,x,y)=>{R(c,x,y-10,2,10,'#6b4a2a');R(c,x-4,y-15,9,6,'#3b8fc4');R(c,x+4,y-17,1,4,'#e33');R(c,x+4,y-17,3,2,'#e33');},
  telescope:(c,x,y)=>{R(c,x-3,y-2,1,2,'#333');R(c,x+3,y-2,1,2,'#333');R(c,x,y-6,1,4,'#333');for(let i=0;i<8;i++)R(c,x-3+i,y-7-i*0.6,3,2,'#c8a26a');},
  rowboat:(c,x,y)=>{R(c,x-9,y-4,18,3,'#8a5a32');R(c,x-7,y-1,14,2,'#6b4024');R(c,x-9,y-5,18,1,'#c9965c');R(c,x+2,y-9,1,5,'#ddd');},
  cat:(c,x,y,t)=>{R(c,x-3,y-4,7,4,'#e08a3a');R(c,x+2,y-7,4,4,'#e08a3a');R(c,x+2,y-8,1,1,'#e08a3a');R(c,x+5,y-8,1,1,'#e08a3a');R(c,x+3,y-6,1,1,'#111');const tw=Math.sin(t/400)>0?1:0;R(c,x-5,y-6+tw,2,2,'#e08a3a');},
  well:(c,x,y)=>{R(c,x-6,y-6,12,6,'#8d8d9a');R(c,x-5,y-5,10,1,'#2f6b8f');R(c,x-6,y-15,1,9,'#6b4a2a');R(c,x+5,y-15,1,9,'#6b4a2a');R(c,x-8,y-17,16,3,'#a33');},
  windmill:(c,x,y,t)=>{R(c,x-4,y-14,8,14,'#e9dcc0');R(c,x-1,y-4,3,4,'#5a3a1e');const a=t/500;for(let k=0;k<4;k++){const an=a+k*Math.PI/2;for(let r=2;r<11;r++)R(c,x+Math.cos(an)*r,y-14+Math.sin(an)*r,2,2,'#c94b4b');}},
  fountain:(c,x,y,t)=>{ell(c,x,y-2,9,3,'#9aa3b8');ell(c,x,y-3,7,2,'#5fb6ff');R(c,x-1,y-11,2,8,'#9aa3b8');for(let i=0;i<5;i++){const p=((t/60+i*7)%20)/20;R(c,x-1+(i-2)*p*4,y-12+p*p*9-6*p,1,1,'#bfe6ff');}},
  crystal:(c,x,y,t)=>{const g=.4+.3*Math.sin(t/300);c.fillStyle=`rgba(120,220,255,${g*.4})`;c.beginPath();c.arc(x,y-8,10,0,7);c.fill();R(c,x-2,y-16,4,16,'#7fe0ff');R(c,x-5,y-9,3,9,'#5fb6ff');R(c,x+2,y-11,3,11,'#a6ecff');},
  trophy:(c,x,y)=>{R(c,x-7,y-14,14,14,'#6b4024');R(c,x-6,y-13,12,12,'#2b2340');R(c,x-4,y-11,3,4,'#ffbf4d');R(c,x+1,y-11,3,4,'#c0c8d8');R(c,x-2,y-5,4,3,'#c58bff');},
  m_jelly:(c,x,y,t)=>{const b=Math.sin(t/300)*2;ell(c,x,y-12+b,5,3,'#ff9fd0');for(let i=-3;i<=3;i+=2)R(c,x+i,y-9+b,1,6,'#ffc4e4');c.fillStyle='rgba(255,160,210,.2)';c.beginPath();c.arc(x,y-10+b,9,0,7);c.fill();},
  m_anchor:(c,x,y)=>{R(c,x-1,y-15,2,14,'#55606f');R(c,x-5,y-12,10,2,'#55606f');R(c,x-6,y-4,12,2,'#55606f');R(c,x-6,y-6,2,2,'#55606f');R(c,x+4,y-6,2,2,'#55606f');ell(c,x,y-16,2,2,'#55606f');},
  m_figure:(c,x,y)=>{R(c,x-3,y-16,6,6,'#d9a87a');R(c,x-4,y-17,8,3,'#8a3a8a');R(c,x-3,y-10,6,6,'#5fb6ff');R(c,x-5,y-4,10,4,'#2f8a8a');},
  m_bonsai:(c,x,y)=>{R(c,x-5,y-3,10,3,'#4f5f8f');R(c,x,y-8,1,5,'#8a5a32');ell(c,x-2,y-10,4,2,'#ff7a6b');ell(c,x+3,y-12,3,2,'#ff9f8b');},
  m_orrery:(c,x,y,t)=>{R(c,x-1,y-8,2,8,'#c8a26a');disc(c,x,y-12,2,'#ffbf4d');for(let k=0;k<3;k++){const a=t/(600+k*300)+k;R(c,x+Math.cos(a)*(5+k*3),y-12+Math.sin(a)*(2+k),2,2,['#5fb6ff','#ff6b7f','#79e2a0'][k]);}},
  m_dragon:(c,x,y,t)=>{R(c,x,y-30,1,30,'#ddd');const b=Math.sin(t/250)*3;for(let i=0;i<8;i++)R(c,x+2+i*3,y-34+Math.sin(t/200+i)*2+b,3,3,i?'#ff5f5f':'#ffbf4d');R(c,x+2,y-36+b,2,1,'#fff');},
};
function drawDecor(c,id,x,y,t){(DECOR[id]||((c,x,y)=>{disc(c,x,y-5,4,'#c58bff');}))(c,x,y,t);}

/* ---------- Scene backgrounds ---------- */
const STARS=Array.from({length:60},(_,i)=>[h32('s'+i)%W,h32('y'+i)%95,h32('b'+i)%3]);
function sky(c,t,opts={}){
  const bands=opts.dawn?['#2b2a5c','#4a3a78','#7a4a7a','#c26a6a','#f0a066']:['#0b1028','#101840','#16204e','#1d2a5c','#27346a'];
  bands.forEach((col,i)=>R(c,0,i*24,W,24,col));
  if(opts.aurora){for(let x=0;x<W;x+=2){const y=30+Math.sin(x/30+t/1500)*10;c.fillStyle=`hsla(${140+Math.sin(x/50+t/2000)*40},90%,60%,.18)`;c.fillRect(x,y,2,30);}}
  STARS.forEach(([x,y,b],i)=>{const tw=(Math.sin(t/600+i)+1)/2;if(tw>.25||b===2)R(c,x,y,1,1,b===2?'#fff':'#c7d1f5');});
  if(!opts.dawn){disc(c,46,28,9,'#f4ecd0');disc(c,50,25,8,bands[1]);}else{disc(c,70,92,14,'#ffd27a');}
  if(opts.shooting){const p=(t%4000)/4000;if(p<.3){const x=260-p*500,y=10+p*120;for(let i=0;i<8;i++)R(c,x+i*2,y-i,1,1,`rgba(255,255,255,${1-i/8})`);}}
}
function sea(c,y0,t,col='#1b4a72'){R(c,0,y0,W,H-y0,col);for(let y=y0+3;y<H;y+=5){const off=(t/90+y*7)%24;for(let x=-24;x<W;x+=24)R(c,x+off,y,6,1,'#2f6f96');}}
function fogBlob(c,cx,cy,r,col,t,seed=0){for(let i=0;i<7;i++){const a=i/7*Math.PI*2+t/3000+seed;disc(c,cx+Math.cos(a)*r*.6,cy+Math.sin(a)*r*.35,Math.max(2,Math.round(r*.55)),col);}disc(c,cx,cy,Math.round(r*.75),col);}

/* ---------- Harbour (communal) scene ---------- */
function drawHarbour(c,t){
  if(!G)return;const today=G.days[G.today];const tgt=today.target,team=today.team;const hit=tgt>0&&team>=tgt;
  const teamFog=Object.values(S.forfeits).some(f=>f&&f.type==='team'&&f.status==='spun'&&Date.now()-f.ts<86400000);
  sky(c,t,{dawn:hit});
  // far islands
  ell(c,20,118,30,6,'#1a2a4a');ell(c,300,116,40,7,'#1a2a4a');
  const sky2=G.proj.find(p=>p.id==='sky');
  if(sky2.built){const x=(t/60)%380-40;ell(c,x,40,14,5,'#c94b4b');R(c,x-5,46,10,4,'#6b4024');}
  sea(c,118,t);
  // island
  ell(c,125,128,100,14,'#d8c08a');ell(c,125,124,94,10,'#5b9a4a');ell(c,125,121,86,6,'#6aac54');
  const B=Object.fromEntries(G.proj.map(p=>[p.id,p]));
  const open=G.proj.find(p=>p.open);
  const drawIf=(id,fn,sx,sy,w,h)=>{if(B[id].built)fn();else if(open&&open.id===id){c.strokeStyle='rgba(255,220,140,.6)';c.setLineDash([2,2]);c.strokeRect(sx+.5,sy+.5,w,h);c.setLineDash([]);}};
  drawIf('jetty',()=>{R(c,210,126,40,3,'#8a6238');for(let i=212;i<250;i+=8)R(c,i,129,2,8,'#5a3a1e');},210,124,40,10);
  drawIf('boats',()=>{[[262,140],[285,150],[240,158]].forEach(([x,y],i)=>{const b=Math.sin(t/500+i)*1;R(c,x-6,y+b,12,3,'#c94b4b');R(c,x-4,y+3+b,8,1,'#7a2a2a');R(c,x,y-7+b,1,7,'#ddd');R(c,x+1,y-6+b,4,4,'#f2efe6');});},234,130,60,30);
  drawIf('stall',()=>{R(c,52,108,16,10,'#a7783e');for(let i=0;i<4;i++)R(c,51+i*5,104,4,4,i%2?'#ff7a3d':'#ffdf6b');R(c,54,111,3,3,'#fff3b0');R(c,61,111,3,3,'#fff3b0');},50,100,20,18);
  drawIf('bakery',()=>{R(c,72,100,20,18,'#e9dcc0');R(c,70,96,24,5,'#b0503a');R(c,79,110,5,8,'#5a3a1e');R(c,74,104,4,4,'#ffdf6b');R(c,86,104,4,4,'#ffdf6b');R(c,87,90,3,6,'#777');c.fillStyle='rgba(220,220,230,.4)';c.fillRect(88,84-(t/100%6),2,4);},70,90,24,28);
  drawIf('market',()=>{R(c,96,116,40,3,'#c9b38a');for(let i=0;i<3;i++){R(c,99+i*13,108,10,8,'#d9822b');R(c,98+i*13,106,12,3,i%2?'#3b8fc4':'#e9dcc0');}},96,104,40,15);
  // central lighthouse (always) — grows into Grand Beacon
  const beacon=B.beacon.built;drawLighthouse(c,120,118,beacon?52:34,beacon?'#c94b4b':'#d84a4a',t,{gold:beacon});
  drawIf('clock',()=>{R(c,140,82,12,36,'#b8a888');R(c,138,78,16,5,'#6b5a4a');disc(c,146,90,4,'#f2efe6');const a=t/2000;R(c,146,90,1,1,'#111');R(c,146+Math.round(Math.cos(a)*3),90+Math.round(Math.sin(a)*3),1,1,'#111');R(c,144,108,4,10,'#5a3a1e');},138,78,16,40);
  drawIf('carto',()=>{R(c,158,104,18,14,'#7a5a3a');R(c,156,100,22,5,'#4a3a2a');R(c,163,110,4,8,'#2b1a10');R(c,170,106,4,4,'#ffdf6b');R(c,174,96,1,6,'#ddd');R(c,175,96,4,3,'#5fb6ff');},156,96,22,22);
  drawIf('observatory',()=>{R(c,182,102,20,16,'#cfcfe0');ell(c,192,102,11,8,'#9aa3c8');R(c,191,94,2,8,'#2b2340');R(c,193,92,6,2,'#c8a26a');R(c,189,110,5,8,'#2b2340');},181,92,22,26);
  drawIf('flags',()=>{for(let i=0;i<14;i++){const x=62+i*10,y=96+Math.abs(i-6.5)*1.2+Math.sin(t/400+i);R(c,x,y,4,4,['#ff6b7f','#ffdf6b','#79e2a0','#5fb6ff'][i%4]);}},60,94,140,10);
  drawIf('bridge',()=>{for(let x=225;x<320;x+=2){const y=112-Math.sin((x-225)/95*Math.PI)*22;R(c,x,y,2,2,'#8a6238');if(x%10===1){R(c,x,y-5,1,5,'#5a3a1e');R(c,x-1,y-7,3,2,'#ffdf6b');}}},225,88,95,26);
  // keepers + crown
  const P=G.P;const lead=today.leader;
  P.forEach((p,i)=>{const pl=S.players[p];const x=i?150:80,y=94;const ch=activeForfeitsFor(p).some(f=>f.result==='chicken');
    c.save();c.translate(x,y);c.scale(2,2);drawKeeper(c,0,0,p,pl,t+i*500,{chicken:ch});
    if(lead===p){R(c,1,-6,6,2,'#ffbf4d');R(c,1,-8,1,2,'#ffbf4d');R(c,3,-8,2,2,'#ffbf4d');R(c,6,-8,1,2,'#ffbf4d');}c.restore();
    txt(c,C().players[p]?.name||p,x+8,y+26,pcolHex(p),8,'center');});
  // boss
  if(tgt>0){
    const boss=today.boss;const hp=Math.max(0,tgt-team);const ratio=hp/tgt;
    if(!hit){const r=10+Math.round(24*ratio);const bx=262+Math.sin(t/1700)*4,by=72+Math.sin(t/1100)*3;
      let col=boss.col;if(boss.rare){col=`hsl(${(t/20)%360},70%,72%)`;}
      if(S.bossFlash>t){col='#ffffff';}
      fogBlob(c,bx,by,r,'rgba(0,0,0,.25)',t,1);fogBlob(c,bx,by-2,r,col,t);
      const er=Math.max(1,Math.round(r/9));const ey=by-r*.2;const dizzy=ratio<.25;
      [[-r*.35,0],[r*.3,0]].forEach(([dx])=>{disc(c,bx+dx,ey,er+1,'#fff');if(dizzy){R(c,bx+dx-er,ey,er*2+1,1,'#111');}else disc(c,bx+dx+1,ey,er,boss.eye==='#ffffff'?'#222':boss.eye);});
      const mw=Math.round(r*.5);if(ratio>.5)R(c,bx-mw/2,by+r*.25,mw,2,'#2b2340');else{for(let i=0;i<mw;i++)R(c,bx-mw/2+i,by+r*.25+Math.round(Math.sin(i/1.5+t/150)),1,2,'#2b2340');}
      if(ratio<.5)for(let i=0;i<3;i++){const a=t/500+i*2;R(c,bx+Math.cos(a)*(r+4),by-r+Math.sin(a)*3,2,2,'#dfe6ff');}
    } else {txt(c,'FOG CLEARED',262,62,'#fff3b0',9,'center');for(let i=0;i<6;i++){const a=t/700+i;R(c,262+Math.cos(a)*18,74+Math.sin(a)*8,2,2,'#ffdf6b');}}
  }
  // lanterns
  updateLanterns(c,t);
  if(teamFog){c.fillStyle='rgba(150,160,185,.35)';for(let y=0;y<H;y+=2)for(let x=(y/2)%2*2;x<W;x+=4)c.fillRect(x,y,2,2);txt(c,'Team forfeit: the fog has moved in for the day',160,4,'#fff',8,'center');}
}
function launchLantern(p){S.lanterns.push({x:p===G?.P[0]?88:158,y:92,vx:0,vy:-1.4,born:performance.now(),col:pcolHex(p),tx:262,ty:72});if(S.lanterns.length>40)S.lanterns.shift();}
function updateLanterns(c,t){const nowp=performance.now();S.lanterns=S.lanterns.filter(l=>{const age=(nowp-l.born)/1000;if(age>2.2)return false;const p=Math.min(1,age/1.6);const x=l.x+(l.tx-l.x)*p,y=l.y+(l.ty-l.y)*p-Math.sin(p*Math.PI)*35;
  c.fillStyle='rgba(255,210,120,.25)';c.beginPath();c.arc(x,y,5,0,7);c.fill();R(c,x-1,y-2,3,4,l.col);R(c,x,y-3,1,1,'#2b2340');if(p>=1&&!l.hit){l.hit=true;S.bossFlash=t+90;}return p<1||age<1.8;});}

/* ---------- Personal islet scene (drawn at 2x zoom) ---------- */
const DECOR_SPOTS=[[24,63],[38,66],[52,68],[112,68],[126,66],[140,63]];
function drawIslet(c,t,pid){
  if(!G)return;const pl=S.players[pid]||{};const me=G.players[pid];const fx=pl.effect;const act=activeForfeitsFor(pid);
  sky(c,t,{aurora:fx==='fx_aurora',shooting:fx==='fx_shooting'});
  sea(c,128,t);
  c.save();c.scale(2,2);
  ell(c,80,70,66,9,'#d8c08a');ell(c,80,67,62,6,'#5b9a4a');ell(c,80,65,57,4,'#6aac54');
  const goldPaint=fx==='goldlh';const prestCol=['#d84a4a','#3b8fc4','#7a4ad8','#2f9a6a','#e0a020','#ff5fa8'][Math.min(5,me?.prest||0)];
  drawLighthouse(c,92,66,26+Math.min(8,Math.floor((me?.li.level||1)/12)),prestCol,t,{gold:goldPaint});
  for(let i=0;i<Math.min(10,me?.prest||0);i++)R(c,86+i*3,20,1,1,'#ffdf6b');
  (pl.decor||[]).forEach((id,i)=>{if(id&&DECOR_SPOTS[i])drawDecor(c,id,DECOR_SPOTS[i][0],DECOR_SPOTS[i][1],t+i*300);});
  if(act.some(f=>f.result==='gnomes'))[[62,67],[70,68],[106,68]].forEach(([x,y])=>spr(c,GNOME,{r:'#d33',s:'#f3c9a0',w:'#eee',b:'#3a6ad8'},x,y-7));
  if(act.some(f=>f.result==='statue')){spr(c,KEEPER,{h:'#9aa',s:'#bbb',e:'#555',c:'#999',p:'#888',b:'#777'},40,36,2);R(c,38,60,20,4,'#888');}
  const ch=act.some(f=>f.result==='chicken'),dance=act.some(f=>f.result==='dance');
  const kx=70,ky=54;drawKeeper(c,kx,ky,pid,pl,t,{chicken:ch,dance});
  if(act.some(f=>f.result==='gull')){const gx=kx-12+Math.sin(t/700)*3;spr(c,GULL,{w:'#f2f2f2',y:'#f90',g:'#f90'},gx,ky+7);}
  const today=G.days[G.today];if(today.leader===pid){R(c,kx+1,ky-6,6,2,'#ffbf4d');R(c,kx+1,ky-8,1,2,'#ffbf4d');R(c,kx+3,ky-8,2,2,'#ffbf4d');R(c,kx+6,ky-8,1,2,'#ffbf4d');}
  else if(today.leader&&today.over.some(o=>o.who!==pid)){const o=other(pid);R(c,60,44,1,22,'#ddd');R(c,61,44,8,5,pcolHex(o));}
  const ma=t/1200;drawMoth(c,kx+4+Math.cos(ma)*13,ky-4+Math.sin(ma*1.7)*5,me?.moth||0,t,pl.moth);
  c.restore();
  if(act.some(f=>f.result==='statue'))txt(c,(C().players[other(pid)]?.name||'Rival')+' the Great',96,56,'#ddd',8,'center');
  if(today.leader!==pid&&today.leader&&today.over.some(o=>o.who!==pid))txt(c,'claimed by '+(C().players[other(pid)]?.name||''),130,76,pcolHex(other(pid)),8,'center');
  if(fx==='fx_fireflies')for(let i=0;i<16;i++){const a=t/1500+i;R(c,40+((i*37)%240)+Math.sin(a)*6,80+((i*23)%50)+Math.cos(a*1.3)*4,2,2,Math.sin(t/300+i)>0?'#e6ff7a':'#7a8a3a');}
  if(fx==='fx_snow')for(let i=0;i<60;i++){const x=(i*53+t/40)%W,y=(i*29+t/25)%H;R(c,x,y,1,1,'#fff');}
  if(fx==='m_fx_bubbles')for(let i=0;i<14;i++){const y=H-((t/30+i*40)%120),x=40+(i*41)%250+Math.sin(t/500+i)*3;c.strokeStyle='rgba(190,230,255,.7)';c.beginPath();c.arc(x,y,2+i%3,0,7);c.stroke();}
}

/* ---------- Lock In voyage scene ---------- */
function drawVoyage(c,t,dms,progress){
  sky(c,t,{});
  const off=dms*24+t/80;
  for(let i=0;i<6;i++){const ix=((i*90-off*.5)%540+540)%540-60;ell(c,ix,112,26,6,'#1f3358');}
  sea(c,112,t*2);
  for(let k=Math.floor(off/240)-1;k<Math.floor(off/240)+3;k++){const x=k*240-off+200;if(x<-40||x>360)continue;ell(c,x,128,30,7,'#d8c08a');ell(c,x,125,24,4,'#5b9a4a');R(c,x-1,108,2,16,'#5a3a1e');R(c,x+1,108,8,5,['#ff6b7f','#ffdf6b','#79e2a0','#5fb6ff'][((k%4)+4)%4]);txt(c,`${Math.max(0,k*10)}`,x,98,'#fff3b0',7,'center');}
  const bob=Math.sin(t/300)*2;const bx=45;c.save();c.translate(0,-126);c.scale(2,2);
  R(c,bx-14,128+bob,28,5,'#8a5a32');R(c,bx-11,133+bob,22,2,'#6b4024');R(c,bx,104+bob,2,24,'#ddd');
  c.fillStyle='#f2efe6';c.beginPath();c.moveTo(bx+2,106+bob);c.lineTo(bx+20,124+bob);c.lineTo(bx+2,124+bob);c.fill();
  drawKeeper(c,bx-10,116+bob,G?S.me:'sam',S.players[S.me],t);
  for(let i=0;i<6;i++){R(c,bx-18-i*6-((t/40)%6),132+bob+(i%2),4,1,'#9fd6ff');}c.restore();
  const fogX=Math.max(-40,-80+progress*90);fogBlob(c,fogX,90,40,'rgba(170,180,210,.6)',t);
}

/* ---------- Item icon (shop) ---------- */
function drawItemIcon(cv,id){const c=cv.getContext('2d');cv.width=40;cv.height=40;c.imageSmoothingEnabled=false;R(c,0,0,40,40,'#0b1230');const it=ALL_ITEMS[id];const t=1000;
  if(!it)return;if(it.cat==='decor'){R(c,0,32,40,8,'#5b9a4a');drawDecor(c,id,20,34,t);}
  else if(it.cat==='hat'||it.cat==='coat'){c.save();c.scale(2,2);drawKeeper(c,6,6,S.me,{[it.cat]:id},t);c.restore();}
  else if(it.cat==='moth'){c.save();c.scale(2,2);drawMoth(c,10,11,3,t,id);c.restore();}
  else if(it.cat==='shield'){ell(c,20,18,10,12,'#5fb6ff');ell(c,20,18,7,9,'#ffbf4d');R(c,19,10,2,16,'#fff3b0');}
  else{const g=c;R(g,0,0,40,40,'#101840');if(id==='fx_aurora')for(let x=0;x<40;x+=2)R(g,x,10+Math.sin(x/6)*4,2,10,'hsla('+(140+x*3)+',90%,60%,.6)');else if(id==='fx_snow')for(let i=0;i<20;i++)R(g,(i*13)%40,(i*7)%40,1,1,'#fff');else if(id==='fx_fireflies')for(let i=0;i<10;i++)R(g,(i*11)%38,(i*17)%38,2,2,'#e6ff7a');else if(id==='fx_shooting')for(let i=0;i<10;i++)R(g,30-i*2,5+i,2,1,'#fff');else if(id==='goldlh')drawLighthouse(g,15,38,20,'#e8b84a',t,{gold:true,lit:false});else for(let i=0;i<8;i++){c.strokeStyle='#bfe6ff';c.beginPath();c.arc((i*9)%36+3,(i*13)%34+3,2,0,7);c.stroke();}}
}
function drawCollectIcon(cv,item,found){const c=cv.getContext('2d');cv.width=20;cv.height=20;c.imageSmoothingEnabled=false;R(c,0,0,20,20,'#0b1230');if(!found){R(c,7,6,6,8,'#2a3366');txt(c,'?',10,5,'#5a66a0',8,'center');return;}
  const col={common:'#b9c0d4',uncommon:'#79e2a0',rare:'#5fb6ff',epic:'#c58bff',legendary:'#ffbf4d',mythic:'#ff5fa8'}[item.rar];const set=item.set;
  if(set==='shells'){ell(c,10,11,6,5,col);for(let i=-4;i<=4;i+=2)R(c,10+i,8,1,6,'#0003');}
  else if(set==='bottles'){R(c,8,4,4,3,'#8a5a32');R(c,6,7,8,10,col);R(c,8,10,4,3,'#f2efe6');}
  else if(set==='lanterns'){R(c,9,3,2,2,'#2b2340');R(c,6,5,8,10,'#2b2340');R(c,7,6,6,8,col);}
  else if(set==='charts'){R(c,4,5,12,10,'#e9dcc0');R(c,6,8,4,3,col);R(c,11,10,3,1,'#c33');}
  else if(set==='feathers'){for(let i=0;i<10;i++)R(c,5+i,15-i,2,2,col);}
  else{for(let i=0;i<4;i++){R(c,10-i,10-i,1+2*i,1,col);R(c,10-i,10+i,1+2*i,1,col);}R(c,9,3,2,14,col);R(c,3,9,14,2,col);}
}
function avatarCanvas(pid){const cv=document.createElement('canvas');cv.width=14;cv.height=14;const c=cv.getContext('2d');R(c,0,0,14,14,'#1b2450');drawKeeper(c,3,1,pid,S.players[pid],0,{chicken:activeForfeitsFor(pid).some(f=>f.result==='chicken')});return cv.toDataURL();}
