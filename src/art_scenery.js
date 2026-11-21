/* ============================== PAINTED LOOK (Art stage A: scenery engine + Harbour) ==============================
   The default scenery from 21 Nov: layered faceted mountains, soft gradient skies, fog bands, still water with long
   reflections, flat silhouettes with no outlines, lit windows and lanterns after dark. Only what is drawn inside the scenes
   changes: every card, button, font, tap area and number stays exactly as it was. Settings, Game feel, Scenery switches
   to Atmospheric or Classic. Each piece (sky, sea, island, trees, lighthouse, ship, foes) checks isArtLook() and falls
   back to the classic drawing otherwise, so wrappers added by earlier stages keep working. */
const ART_HZ={harbour:108,ship:110,islet:124,voyage:96};
function hexRgb(h){if(typeof h!=='string')return [120,120,140];if(h[0]==='#'){if(h.length===4)h='#'+h[1]+h[1]+h[2]+h[2]+h[3]+h[3];return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
  const m=h.match(/[\d.]+/g);return m?[+m[0],+m[1],+m[2]]:[120,120,140];}
function rgbHex(a){return '#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');}
function mixHex(a,b,k){const A=hexRgb(a),B=hexRgb(b);return rgbHex(A.map((v,i)=>v+(B[i]-v)*k));}
function shadeHex(a,f){return rgbHex(hexRgb(a).map(v=>v*f));}
function rgbaOf(h,a){const v=hexRgb(h);return `rgba(${v[0]},${v[1]},${v[2]},${a})`;}

/* ---------- palettes: time of day, then storm and winter on top ---------- */
const ART_PAL={
  day:{sky:['#3F78BE','#8DBEE2','#F4DDBE'],far:'#9DB3D2',mid:'#7392BC',near:'#4F6E99',isl:'#2F5A6A',beach:'#E9D6A8',sea:['#A9CBE0','#6E9CC4','#22487A'],fog:'#EAF1F8',bld:'#3F6878',win:'#F1E4C6',rip:'#FFFFFF',lit:false},
  dawn:{sky:['#4E5C9E','#E0A0B4','#FFE0C4'],far:'#C9A4C0',mid:'#9A7EA8',near:'#6E5A8A',isl:'#3C3458',beach:'#D9B0A8',sea:['#F0C0B4','#9A86B0','#2E3260'],fog:'#FBE0DA',bld:'#4C4268',win:'#FFC46A',rip:'#FFE6DC',lit:true},
  sunset:{sky:['#2A2152','#9C4370','#F0905E'],far:'#C46C7E',mid:'#8E4568',near:'#5E2D58',isl:'#3A1C45',beach:'#B9637A',sea:['#F2A57A','#B2586E','#2A1638'],fog:'#F7B48E',bld:'#4A2654',win:'#FFC46A',rip:'#FFD3A6',lit:true},
  gold:{sky:['#C8604E','#F0A060','#FFE0A8'],far:'#D88C70',mid:'#B0645E',near:'#7E4452',isl:'#4A2A3C',beach:'#E0A070',sea:['#F6C890','#C0705E','#3A2038'],fog:'#FFD8B0',bld:'#5A3446',win:'#FFC46A',rip:'#FFE2B8',lit:true},
  night:{sky:['#050920','#13235A','#2E447F'],far:'#2B3E78',mid:'#1D2C5E',near:'#142049',isl:'#0B1230',beach:'#1E2B57',sea:['#2C4486','#14245A','#040817'],fog:'#4A63A8',bld:'#141E44',win:'#FFC46A',rip:'#9DB4F0',lit:true}};
const ART_STORM={sky:['#17152A','#3A3756','#6C6884'],far:'#55516F',mid:'#3E3A58',near:'#2C2944',isl:'#1B1A2C',beach:'#3A3850',sea:['#5E6380','#363A55','#101019'],fog:'#8A87A4',bld:'#26243A',win:'#FFC46A',rip:'#C9C7E2',lit:true};
const ART_WINTER={sky:['#2A3A6E','#8C9BCB','#F1D6DE'],far:'#C5CDE6',mid:'#9AA7D0',near:'#6F7DB0',isl:'#3A4777',beach:'#EEF1F8',sea:['#C8D1EA','#8494C2','#2C3766'],fog:'#F4EEF4',bld:'#46538A',win:'#F1E4C6',rip:'#FFFFFF',lit:false};
function artMode(){return (SUN&&SUN.mode)||'day';}
function artPal(mode){mode=mode||artMode();const storm=THEME.weather==='storm',win=typeof isWinter==='function'&&isWinter();
  if(storm){if(mode!=='night')return ART_STORM;return {...ART_STORM,sky:['#07060F','#191730','#33304E'],far:'#2E2B46',mid:'#24213A',sea:['#2E3250','#1A1C30','#06060C']};}
  if(win&&(mode==='day'||mode==='dawn'||mode==='gold'))return ART_WINTER;return ART_PAL[mode]||ART_PAL.day;}
const artSnowy=()=>typeof isWinter==='function'&&isWinter();
const artLitNow=()=>{const P=artPal();return !!P.lit;};

/* ---------- mountain ranges: faceted peaks, a lit face and a shaded face, snow in winter ---------- */
function artPeaks(key,n,x0,x1,hmin,hmax,wmin,wmax){const out=[];for(let i=0;i<n;i++){const u=(i+.5)/n;const j=((h32(key+'j'+i)%1000)/1000-.5)*(x1-x0)/n*.7;
  out.push([x0+(x1-x0)*u+j,hmin+((h32(key+'h'+i)%1000)/1000)*(hmax-hmin),wmin+((h32(key+'w'+i)%1000)/1000)*(wmax-wmin),(h32(key+'k'+i)%1000)/1000]);}return out;}
function artFacets(q,base,peaks,col,snow){peaks.forEach(([px,ph,hw,k])=>{const top=base-ph,l=px-hw,r=px+hw*(.9+k*.4),mx=px+(k-.5)*hw*.25;
  q.fillStyle=shadeHex(col,1.12);q.beginPath();q.moveTo(l,base+1);q.lineTo(px-hw*.45,top+ph*(.32+k*.08));q.lineTo(px,top);q.lineTo(mx,base+1);q.closePath();q.fill();
  q.fillStyle=shadeHex(col,.86);q.beginPath();q.moveTo(px,top);q.lineTo(px+hw*.5,top+ph*.38);q.lineTo(r,base+1);q.lineTo(mx,base+1);q.closePath();q.fill();
  if(snow){q.fillStyle='rgba(255,255,255,.92)';q.beginPath();q.moveTo(px,top);q.lineTo(px-hw*.22,top+ph*.2);q.lineTo(px-hw*.08,top+ph*.16);q.lineTo(px+hw*.05,top+ph*.24);q.lineTo(px+hw*.2,top+ph*.18);q.closePath();q.fill();}});}
function artFog(q,y,h,col,a){const g=q.createLinearGradient(0,y-h,0,y);g.addColorStop(0,rgbaOf(col,0));g.addColorStop(1,rgbaOf(col,a));q.fillStyle=g;q.fillRect(-90,y-h,W+180,h);}
function artBackdrop(c,scene){const y0=ART_HZ[scene]||108;const mode=artMode();const P=artPal(mode);const snow=artSnowy()||THEME.festive==='christmas';
  const key=`artbd_${scene}_${mode}_${THEME.weather}_${snow?1:0}${artBlendKey()}`;
  layerCache(c,key,-90,y0-80,W+180,82,q=>{
    artFacets(q,y0,artPeaks(scene+'far',7,-70,W+70,22,48,26,46),P.far,snow);artFog(q,y0,30,P.fog,.55);
    artFacets(q,y0,artPeaks(scene+'mid',6,-60,W+60,12,30,20,32),P.mid,snow);artFog(q,y0+1,12,P.fog,.45);});}

/* ---------- sky ---------- */
const ART_STREAKS=[[30,24,46],[220,16,60],[150,44,34],[280,38,28]];
{const _sky=sky;sky=function(c,t,opts={}){if(!isArtLook())return _sky.apply(this,arguments);
  let mode=opts.mode||(opts.dawn?'gold':skyPhase());if(mode==='dusk')mode='night';const night=mode==='night';
  const sp={day:[58,30],dawn:[248,92],sunset:[66,92],gold:[60,76],night:[236,28]}[mode]||[58,30];
  SUN={x:sp[0],y:sp[1],night,col:night?'225,232,255':mode==='day'?'255,250,215':'255,214,160',mode};
  const P=artPal(mode);const y0=ART_HZ[THEME.scene]||108;
  const g=c.createLinearGradient(0,-40,0,y0);g.addColorStop(0,P.sky[0]);g.addColorStop(.55,P.sky[1]);g.addColorStop(1,P.sky[2]);c.fillStyle=g;c.fillRect(-90,-300,W+180,y0+300);SKY_TOP=P.sky[0];
  const storm=THEME.weather==='storm';
  if(night&&!storm){layerCache(c,'artstars',-90,-290,W+180,y0+290,q=>{for(let i=0;i<150;i++){const x=(h32('as'+i)%(W+180))-90,y=-290+(h32('ay'+i)%(y0+270));q.fillStyle=`rgba(255,255,255,${.25+(h32('aa'+i)%60)/100})`;q.beginPath();q.arc(x,y,.25+(h32('ar'+i)%50)/100,0,TAU);q.fill();}
      q.save();q.translate(170,30);q.rotate(-.35);for(let i=0;i<160;i++){const u=(h32('mw'+i)%1000)/1000,d=((h32('md'+i)%1000)/1000-.5)*(12+22*Math.sin(u*Math.PI));q.fillStyle=`rgba(255,255,255,${.2+(h32('mb'+i)%55)/100})`;q.fillRect(-190+u*380,d,.5,.5);}q.restore();});
    STARS.forEach(([x,y,b],i)=>{if(b!==2)return;const tw=.5+.5*Math.sin(t/(500+i%7*90)+i*1.7);c.globalAlpha=.3+.7*tw;disc(c,x,y*.9,.7,'#FFFFFF');});c.globalAlpha=1;
    const mx=sp[0],my=sp[1];glowAt(c,mx,my,40,'200,215,255',.28);c.fillStyle='#F4F0DA';c.beginPath();c.arc(mx,my,7,-Math.PI/2,Math.PI/2,true);c.ellipse(mx,my,5.4,7,0,Math.PI/2,-Math.PI/2,false);c.fill();
    const sh=(t%9000)/9000;if(sh<.07){const u=sh/.07,x=250-u*130,y=14+u*36;line(c,x,y,x+16*(1-u)+4,y-6*(1-u)-1.5,'rgba(255,255,255,.85)',.6);}}
  else if(!storm){const low=mode!=='day';if(low)glowAt(c,sp[0],y0-4,150,SUN.col,.4);glowAt(c,sp[0],sp[1],low?70:60,SUN.col,low?.6:.45);glowAt(c,sp[0],sp[1],low?24:16,SUN.col,.6);
    disc(c,sp[0],sp[1],low?14:9,mode==='day'?'#FFF6D6':mode==='sunset'?'#FFE2A6':'#FFE9B8');}
  if(storm){for(let i=0;i<6;i++){const x=((i*70+t/220)%(W+160))-80,y=8+(i%3)*12;c.fillStyle=rgbaOf(shadeHex(P.sky[0],1.3),.85);c.beginPath();c.ellipse(x,y,58,16,0,0,TAU);c.fill();}}
  else if(!night)ART_STREAKS.forEach(([x0,y,w],i)=>{const x=((x0+t/(400+i*90))%(W+120))-60;rr(c,x,y,w,1.6,.8,rgbaOf(P.fog,.55));rr(c,x+w*.18,y-2.6,w*.55,1.3,.65,rgbaOf(P.fog,.4));});
  if(!night&&!storm&&!opts.noBirds)for(let i=0;i<3;i++){const bx=((t/95+i*31)%(W+80))-40,by=46+i*5+Math.sin(t/900+i)*3,fl=Math.sin(t/160+i*2)*1.6;c.strokeStyle=rgbaOf(shadeHex(P.near,.7),.75);c.lineWidth=.6;c.lineCap='round';c.beginPath();c.moveTo(bx-3,by-fl);c.quadraticCurveTo(bx-1.2,by-1.1,bx,by);c.quadraticCurveTo(bx+1.2,by-1.1,bx+3,by-fl);c.stroke();}
  if(opts.rainbow){['#E0453B','#F2A33A','#F2D24A','#5DBE9C','#4A7EC2','#9B5DE5'].forEach((col,i)=>{c.strokeStyle=col;c.globalAlpha=.26;c.lineWidth=2.4;c.beginPath();c.arc(200,140,90-i*2.4,Math.PI,TAU);c.stroke();});c.globalAlpha=1;}
  if(opts.aurora||(night&&!storm&&!artSnowy())){c.save();c.globalCompositeOperation='lighter';for(let k=0;k<2;k++){c.beginPath();for(let x=-60;x<=W+60;x+=6){const y=26+k*12+Math.sin(x/40+t/2600+k)*8;x===-60?c.moveTo(x,y):c.lineTo(x,y);}
      const gg=c.createLinearGradient(0,8,0,70);const col=k?'150,110,255':'94,240,192';const a=opts.aurora?.2:.08;gg.addColorStop(0,`rgba(${col},0)`);gg.addColorStop(.5,`rgba(${col},${a})`);gg.addColorStop(1,`rgba(${col},0)`);c.strokeStyle=gg;c.lineWidth=18;c.stroke();}c.restore();}
  if(opts.shooting){const p=(t%4000)/4000;if(p<.3){const x=260-p*500,y=10+p*120;line(c,x,y,x+14,y-7,'rgba(255,255,255,.9)',1);}}
  if(THEME.scene==='voyage'&&VOY.lk&&isArtLook())artVoyBackdrop(c);else if(ART_HZ[THEME.scene])artBackdrop(c,THEME.scene);
  runLayers('sky',c,t,{mode,night,opts});
  if(opts.fireworks){const p=(t%2600)/2600;if(p<.6){const cx=80+(Math.floor(t/2600)*97)%180,cy=30+(Math.floor(t/2600)*31)%30;for(let i=0;i<14;i++){const a=i/14*TAU;disc(c,cx+Math.cos(a)*p*22,cy+Math.sin(a)*p*22,.9*(1-p)+.2,['#F2C462','#E0457B','#7CC7E6'][i%3]);}}}
};}

/* ---------- sea: flat colour, horizon mist, long sun or moon path, slow ripples ---------- */
{const _sea=sea;sea=function(c,y0,t,opts={}){if(!isArtLook())return _sea.apply(this,arguments);const P=artPal();
  const g=c.createLinearGradient(0,y0,0,H);g.addColorStop(0,opts.glow?'#2C6E8A':P.sea[0]);g.addColorStop(.3,opts.glow?'#1C4E70':P.sea[1]);g.addColorStop(1,P.sea[2]);c.fillStyle=g;c.fillRect(-90,y0,W+180,H-y0+300);SEA_BOT=P.sea[2];
  const m=c.createLinearGradient(0,y0,0,y0+10);m.addColorStop(0,rgbaOf(P.fog,.6));m.addColorStop(1,rgbaOf(P.fog,0));c.fillStyle=m;c.fillRect(-90,y0,W+180,10);
  if(SUN&&THEME.weather!=='storm'){const day=SUN.mode==='day';for(let i=0;i<18;i++){const yy=y0+2+i*i*.32+i*1.7;if(yy>H+VIEW_EXT.bot)break;const w=(4+i*3.4)*(.55+.45*Math.sin(t/520+i*1.9));const x=SUN.x-w/2+Math.sin(t/760+i)*1.6;
    c.fillStyle=`rgba(${SUN.col},${(day?.34:.62)*(1-i/20)})`;c.fillRect(x,yy,w,.9+i*.04);}}
  for(let i=0;i<46;i++){const dep=((h32('rp'+i)%1000)/1000);const yy=y0+3+Math.pow(dep,1.5)*(H-y0+VIEW_EXT.bot);const len=5+dep*22;const sp=60+((h32('rs'+i)%1000)/1000)*90;const x=((((h32('rx'+i)%1000)/1000)*(W+120)+t/sp)%(W+120))-60;
    c.fillStyle=rgbaOf(opts.glow?'#9AFFF0':P.rip,(.1+dep*.14)*(.6+.4*Math.sin(t/900+i)));c.fillRect(x,yy,len,.6+dep*.4);}
  if((SUN&&SUN.night)||opts.glow){c.save();c.globalCompositeOperation='lighter';for(let i=0;i<(opts.glow?40:22);i++){const x=((h32('bl'+i)%1000)/1000)*(W+40)-20+Math.sin(t/3000+i)*4,yy=y0+14+((h32('bq'+i)%1000)/1000)*(H-y0);const a=Math.max(0,Math.sin(t/(600+(i%7)*90)+i*2.9));if(a<.2)continue;c.fillStyle=`rgba(120,255,225,${a*.6})`;c.beginPath();c.arc(x,yy,.6+a*.6,0,TAU);c.fill();}c.restore();}
  runLayers('sea',c,t,{y0,opts});};}

/* ---------- islands: a flat silhouette with one lit face, a pale beach and a soft reflection ---------- */
function artIslandPath(c,cx,cy,rx,ry){c.beginPath();artIslandPathAdd(c,cx,cy,rx,ry);}
function artIslandPathAdd(c,cx,cy,rx,ry){const top=cy-ry*.85;c.moveTo(cx-rx,cy+2);c.quadraticCurveTo(cx-rx*.92,top+ry*.05,cx-rx*.7,top+ry*.1);c.lineTo(cx-rx*.42,top-ry*.06);c.quadraticCurveTo(cx-rx*.1,top+ry*.08,cx+rx*.12,top+ry*.02);
  c.lineTo(cx+rx*.52,top-ry*.05);c.lineTo(cx+rx*.74,top+ry*.14);c.quadraticCurveTo(cx+rx*.93,top+ry*.12,cx+rx,cy+2);c.closePath();}
{const _isl=island;island=function(c,cx,cy,rx,ry,t){if(!isArtLook())return _isl.apply(this,arguments);const P=artPal();const top=cy-ry*.85;
  ell(c,cx,cy+3.2,rx*.96,Math.max(1.2,ry*.42),rgbaOf(P.isl,.32));
  c.fillStyle=P.isl;artIslandPath(c,cx,cy,rx,ry);c.fill();
  c.save();artIslandPath(c,cx,cy,rx,ry);c.clip();c.fillStyle=shadeHex(P.isl,1.22);c.beginPath();c.moveTo(cx-rx,cy+3);c.lineTo(cx-rx,top-ry);c.lineTo(cx-rx*.42,top-ry);c.lineTo(cx-rx*.55,cy+3);c.closePath();c.fill();
  if(artSnowy()){const d=Math.max(1.4,ry*.22);c.fillStyle='rgba(255,255,255,.9)';
    c.beginPath();c.rect(cx-rx-4,top-ry*2,rx*2+8,ry*3+6);c.save();c.translate(0,d);artIslandPathAdd(c,cx,cy,rx,ry);c.restore();c.fill('evenodd');}
  c.restore();
  c.fillStyle=P.beach;c.beginPath();c.ellipse(cx,cy+1.6,rx*.99,Math.max(1,ry*.16),0,0,TAU);c.fill();
  c.fillStyle=rgbaOf(P.fog,.35);c.fillRect(cx-rx*.98,cy+2.4,rx*1.96,.6);};}
/* ---------- trees: silhouette palms, snowy pines in winter ---------- */
function artPine(c,x,y,h,col,snow){R(c,x-h*.025,y-h,h*.05,h,col);const n=Math.max(4,Math.round(h/3.2)),w=h*.34;c.fillStyle=col;
  for(let i=0;i<n;i++){const u=i/n,yy=y-h*.12-u*h*.82,ww=w*(1-u)*.95+w*.08;c.beginPath();c.moveTo(x,yy-h*.06);c.lineTo(x-ww,yy+h*.035);c.lineTo(x-ww*.35,yy);c.lineTo(x,yy+h*.01);c.lineTo(x+ww*.35,yy);c.lineTo(x+ww,yy+h*.035);c.closePath();c.fill();
    if(snow){c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.moveTo(x,yy-h*.06);c.lineTo(x-ww*.55,yy);c.lineTo(x+ww*.55,yy);c.closePath();c.fill();c.fillStyle=col;}}}
{const _palm=palm;palm=function(c,x,y,h=14,t=0){if(!isArtLook()||!THEME.scene)return _palm.apply(this,arguments);const P=artPal();const col=shadeHex(P.isl,.72);
  if(artSnowy()){const xm=typeof isXmas==='function'&&isXmas()&&THEME.scene==='harbour'&&Math.abs(x-192)<2;artPine(c,x,y,xm?h*1.9:h*1.2,col,true);
    if(xm){for(let i=0;i<9;i++){const u=(i+1)/10,yy=y-h*1.9*(.15+u*.7),ww=h*1.9*.34*(1-u)*.8;const on=Math.sin(t/300+i*1.7)>-.3;disc(c,x+(i%2?ww:-ww)*.7,yy+1,.8,on?['#FF5A5A','#FFD45A','#5AE08A'][i%3]:'rgba(255,255,255,.3)');}
      c.fillStyle='#FFD45A';c.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,r=k%2?1:2.4;c.lineTo(x+Math.cos(a)*r,y-h*1.9-1+Math.sin(a)*r);}c.closePath();c.fill();lamp(c,x,y-h*1.9-1,8,.5,'255,220,120');}return;}
  const sw=Math.sin(t/900)*.6;c.strokeStyle=col;c.lineWidth=Math.max(1,h*.09);c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+2,y-h/2,x+1+sw,y-h);c.stroke();
  c.fillStyle=col;const tx=x+1+sw,ty=y-h;[-170,-135,-95,-60,-25,8].forEach((a,i)=>{const r=a*Math.PI/180+Math.sin(t/1100+i)*.04,ex=tx+Math.cos(r)*h*.52,ey=ty+Math.sin(r)*h*.5+h*.2;
    c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo((tx+ex)/2,ty-h*.17,ex,ey);c.quadraticCurveTo((tx+ex)/2,ty-h*.05,tx,ty);c.fill();});};}

/* ---------- lighthouse: a tall silhouette, the lamp always glowing, a sweeping beam after dark and in storms ---------- */
{const _lh=drawLighthouse;drawLighthouse=function(c,x,y,h,col,t,opts={}){if(!isArtLook()||THEME.scene!=='harbour')return _lh.apply(this,arguments);const P=artPal();const w=10;
  const body=shadeHex(P.isl,opts.gold?1.05:.92),band=mixHex(body,col||'#D9485F',.32),lampY=y-h-5.5;const dark=artLitNow()||THEME.weather==='storm';
  if(dark&&!(SUN&&SUN.night)){const a=Math.sin(t/2600)*.9+.15;c.save();c.globalCompositeOperation='lighter';const L=170;const g=c.createLinearGradient(x+w/2,lampY,x+w/2+Math.cos(a)*L,lampY+Math.sin(a)*L*.25);g.addColorStop(0,'rgba(255,236,170,.42)');g.addColorStop(1,'rgba(255,236,170,0)');
    c.fillStyle=g;c.beginPath();c.moveTo(x+w/2,lampY);c.lineTo(x+w/2+Math.cos(a-.07)*L,lampY+Math.sin(a-.07)*L*.25-9);c.lineTo(x+w/2+Math.cos(a+.07)*L,lampY+Math.sin(a+.07)*L*.25+9);c.closePath();c.fill();c.restore();}
  glowAt(c,x+w/2,lampY,SUN&&SUN.night?10:dark?24:14,'255,236,170',SUN&&SUN.night?.3:dark?.5:.35);
  c.fillStyle=body;c.beginPath();c.moveTo(x+.5,y);c.lineTo(x+2,y-h);c.lineTo(x+w-2,y-h);c.lineTo(x+w-.5,y);c.closePath();c.fill();
  c.save();c.clip();c.fillStyle=shadeHex(body,1.25);c.fillRect(x,y-h,w*.38,h);for(let i=1;i<h/7;i+=2)R(c,x,y-h+i*7,w,3.2,rgbaOf(band,.9));c.restore();
  rr(c,x-1,y-h-2.6,w+2,2.6,1,shadeHex(body,.8));rr(c,x+1.4,y-h-9,w-2.8,6.6,1.4,shadeHex(body,.8));rr(c,x+2.4,y-h-8,w-4.8,4.6,1,'#FFE7A6');
  c.fillStyle=shadeHex(body,.8);c.beginPath();c.moveTo(x+.8,y-h-9);c.lineTo(x+w/2,y-h-13.5);c.lineTo(x+w-.8,y-h-9);c.closePath();c.fill();if(opts.gold)R(c,x-1,y-h-2.6,w+2,.7,'#F2C462');
  rr(c,x+3.4,y-6,3.2,6,1.6,dark?'#FFC46A':shadeHex(body,.7));};}
{const _nv=nightVeil;nightVeil=function(c,a){if(!isArtLook())return _nv.apply(this,arguments);return !!(SUN&&SUN.night);};}

/* ---------- the ship: chunky hull, raised stern with glowing windows, lanterns, crow's nest, one big sail per mast ----------
   Drawn in a design space and scaled to the classic footprint, so the captain, pet, deck items, figurehead, flags,
   snow, lights, damage and every tap area sit where they always did. Cosmetic colours and sail patterns carry over. */
const ART_HULL='M-66,-34 L-30,-34 L-28,-14 L44,-14 L46,-22 L70,-22 L80,-26 L77,-8 Q67,18 40,23 L-40,23 Q-62,18 -64,-6 Z';
let ART_HULL_P=null;const artHullPath=()=>ART_HULL_P||(ART_HULL_P=new Path2D(ART_HULL));
function artSail(c,cx,top,w,h,bel,sail,scol,sdk,t,mark,billow){const l=cx-w/2,r=cx+w/2,b=top+h;const wv=Math.sin(t/700+cx)*1.2;
  const path=()=>{c.beginPath();c.moveTo(l,top);c.lineTo(r,top);c.quadraticCurveTo(r+bel+wv,top+h*.5,r-2,b);c.quadraticCurveTo(cx,b+bel*.5,l+2,b);c.quadraticCurveTo(l-bel*.6+wv*.5,top+h*.5,l,top);c.closePath();};
  c.save();path();c.fillStyle=scol;c.fill();c.clip();const x=l,y=top;const c2=sail.col2?mixHex(sail.col2,scol,.15):sdk;
  if(sail.pat==='stripe')for(let i=0;i<6;i+=2)R(c,x-3,y+i*h/6,w+8,h/6,c2);
  if(sail.pat==='patch'){R(c,x+w*.15,y+h*.2,w*.25,h*.3,c2);R(c,x+w*.6,y+h*.55,w*.22,h*.28,shadeHex(scol,.9));}
  if(sail.pat==='grad'){const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,scol);g.addColorStop(1,c2);c.fillStyle=g;c.fillRect(x-3,y-2,w+8,h+4);}
  if(sail.pat==='stars')for(let i=0;i<9;i++)disc(c,x+((i*37)%100)/100*w,y+((i*61)%100)/100*h,1,c2);
  if(sail.pat==='rainbow')['#E0453B','#F2A33A','#F2D24A','#5DBE9C','#4A7EC2','#9B5DE5'].forEach((col,i)=>R(c,x-3,y+i*h/6,w+8,h/6+.4,mixHex(col,scol,.2)));
  if(sail.pat==='mark'&&mark)drawMark(c,cx+billow*.3,y+h/2,Math.min(w,h)*.62,c2);
  if(sail.pat==='skull'&&mark)drawSymbol(c,'skull',cx+billow*.3,y+h/2,Math.min(w,h)/9,c2);
  if(sail.pat&&SAIL_PATS[sail.pat])try{SAIL_PATS[sail.pat](c,{...sail,col:scol,col2:c2},x,y,w,h,t,mark,billow);}catch(e){}
  if(mark&&(!sail.pat||sail.pat==='plain')){const k=shadeHex(scol,.32);c.save();c.globalAlpha=.8;c.translate(cx+2,y+h*.45);c.scale(1.25,1.25);c.strokeStyle=k;c.lineWidth=3.4;c.lineCap='round';
    c.beginPath();c.moveTo(-7,7);c.lineTo(7,-7);c.moveTo(7,7);c.lineTo(-7,-7);c.stroke();[[-8.6,8.6],[8.6,8.6],[-8.6,-8.6],[8.6,-8.6]].forEach(([bx,by])=>disc(c,bx,by,2,k));
    disc(c,0,-8,7.2,k);rr(c,-4.4,-3,8.8,4,1.4,k);disc(c,-2.6,-8.4,2,scol);disc(c,2.6,-8.4,2,scol);c.restore();}
  c.fillStyle='rgba(0,0,0,.12)';c.beginPath();c.moveTo(cx+w*.12,top);c.lineTo(r+3,top);c.lineTo(r+bel+wv+3,top+h);c.lineTo(cx+w*.12,b+bel);c.closePath();c.fill();
  c.restore();}
function artShip(c,x,y,s,pl,t,opts={}){
  pl=pl||{};const hull=it(pl.hull||SHIP_DEFAULT.hull)||it('hull_oak');const sail=it(pl.sail||SHIP_DEFAULT.sail)||it('sail_canvas');const neutral=!THEME.scene;const P=neutral?ART_PAL.day:artPal();const night=!neutral&&!!(SUN&&SUN.night);
  const lit=!neutral&&(artLitNow()||THEME.weather==='storm');const ph=opts.phase||0;const gild=pl.effect==='goldlh'||hull.gold;const fire=opts.firing>0?opts.firing:0,kick=fire*fire;
  const rock=Math.sin(t/900+ph)*.04+Math.sin(t/410+ph*2)*.012-kick*.045,bob=Math.sin(t/650+ph)*1.3+Math.sin(t/270+ph)*.3;
  const shadow=shadeHex(P.isl,.78);const hc=mixHex(hull.col||'#A8704A',shadow,neutral?.12:night?.55:.4),hd=shadeHex(hc,.7),hlc=shadeHex(hc,1.32),wood=mixHex('#3A2418',shadow,.45);
  let scol=neutral?(sail.col||'#FFFCF2'):mixHex(sail.col||'#FFFCF2',P.fog,.1);if(night)scol=mixHex(scol,'#3A4B82',.38);else if(SUN&&SUN.mode!=='day')scol=mixHex(scol,P.sky[2],.14);const sdk=shadeHex(scol,.86);
  const lights='#FFC46A',lampOn=lit;const billow=wind(t)*2;
  c.save();c.translate(x-kick*2.2*s,y+bob*s*.4);
  // reflection: a dark, squashed mirror image and long streaks under the lights
  if(!neutral){c.save();c.scale(s,s);c.save();c.globalAlpha=.26;c.translate(0,4.6);c.scale(.45,-.45*.72);c.fillStyle=hc;c.fill(artHullPath());c.fillStyle=wood;[[-42,-98],[6,-152],[52,-102]].forEach(([mx,top])=>c.fillRect(mx-1.6,top,3.2,-14-top));c.restore();
  if(lampOn){[[-21.6,7],[-29.7,3],[45,3]].forEach(([lx,wd],k)=>{for(let i=0;i<7;i++){const ww=wd*(.6+.5*Math.sin(t/300+i*1.7+k));c.fillStyle=`rgba(255,196,106,${.55-i*.07})`;c.fillRect(lx-ww/2+Math.sin(t/400+i)*.8,4+i*1.6,ww,.7);}});}
  else for(let i=0;i<4;i++){c.fillStyle=rgbaOf(shadow,.18-i*.04);c.fillRect(-28+Math.sin(t/300+i+ph)*2,4+i*2.2,56-i*6,1.2);}
  c.restore();}
  c.rotate(rock);c.scale(s,s);
  if(pl.trail)drawWake(c,-34,1,(it(pl.trail)||{}).st,t,1);
  if(opts.moving)for(let i=0;i<8;i++){const q=((t/520)+i/8)%1;disc(c,-34-q*30,1.6+Math.sin(i*2.3)*1.3,1.7*(1-q)+.4,`rgba(255,255,255,${.6*(1-q)})`);}
  c.save();c.translate(0,-6);c.scale(.45,.45);
  c.fillStyle=wood;[[-42,-98],[6,-152],[52,-102]].forEach(([mx,top])=>c.fillRect(mx-1.6,top,3.2,-14-top));
  c.strokeStyle=wood;c.lineCap='round';c.lineWidth=2.4;c.beginPath();c.moveTo(74,-23);c.lineTo(106,-40);c.stroke();
  c.lineWidth=.7;c.globalAlpha=.85;c.beginPath();[[[106,-40],[52,-100]],[[52,-100],[6,-148]],[[6,-148],[-42,-96]],[[-42,-96],[-66,-34]],[[6,-120],[-28,-14]],[[6,-120],[40,-14]]].forEach(([a,b])=>{c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);});c.stroke();
  c.lineWidth=.6;c.beginPath();[[-8,-14,0,-108],[22,-14,12,-108]].forEach(([x0,y0,x1,y1])=>{c.moveTo(x0-3,y0);c.lineTo(x1-1.6,y1);c.moveTo(x0+3,y0);c.lineTo(x1+1.6,y1);for(let k=1;k<13;k++){const u=k/13;c.moveTo(x0-3+(x1-1.6-x0+3)*u,y0+(y1-y0)*u);c.lineTo(x0+3+(x1+1.6-x0-3)*u,y0+(y1-y0)*u);}});c.stroke();c.globalAlpha=1;
  artSail(c,-42,-84,32,38,5,sail,scol,sdk,t,false,billow);artSail(c,54,-88,34,40,6,sail,scol,sdk,t+300,false,billow);artSail(c,6,-108,62,62,9,sail,scol,sdk,t+600,true,billow);
  [[-42,-84,32],[54,-88,34],[6,-108,62]].forEach(([cx,top,w])=>rr(c,cx-w/2-3,top-1.8,w+6,2.6,1.2,wood));
  c.fillStyle=scol;c.beginPath();c.moveTo(74,-24);c.quadraticCurveTo(92+billow,-34,104,-38);c.lineTo(84,-58);c.closePath();c.fill();c.fillStyle='rgba(0,0,0,.08)';c.fill();
  // crow's nest
  c.fillStyle=wood;c.beginPath();c.moveTo(-6,-126);c.lineTo(18,-126);c.lineTo(15,-112);c.lineTo(-3,-112);c.closePath();c.fill();rr(c,-8,-128,28,3,1,shadeHex(wood,.8));
  if(lampOn){glowAt(c,6,-120,18,'255,196,106',.35);[-1,4.5,10].forEach(wx=>rr(c,wx,-123,3.6,5.4,1.2,lights));}else[-1,4.5,10].forEach(wx=>rr(c,wx,-123,3.6,5.4,1.2,shadeHex(wood,1.4)));
  // swallowtail pennants on the fore and mizzen (the main mast flies your own flag)
  [[-42,-98,18],[52,-102,16]].forEach(([mx,top,w],k)=>{const wv=Math.sin(t/260+k*2)*1.6;c.fillStyle=mixHex((it(pl.flag||SHIP_DEFAULT.flag)||{}).col||'#2E2B33',shadow,.25);c.beginPath();c.moveTo(mx,top);c.lineTo(mx+w,top+1+wv);c.quadraticCurveTo(mx+w*.7,top+4+wv,mx+w+3,top+8+wv);c.lineTo(mx,top+7);c.closePath();c.fill();});
  // hull
  c.fillStyle=hc;c.fill(artHullPath());c.save();c.clip(artHullPath());
  if(hull.col2){c.fillStyle=mixHex(hull.col2,shadow,night?.55:.4);c.fillRect(-70,-10,160,4);}
  if(hull.pat)try{c.save();c.translate(0,13.3);c.scale(2.22,2.22);hullPat(c,hull,t);c.restore();c.fillStyle=rgbaOf(shadow,night?.55:.4);c.fillRect(-70,-40,160,70);}catch(e){}
  c.fillStyle=hd;c.beginPath();c.moveTo(-70,0);c.lineTo(90,0);c.lineTo(90,30);c.lineTo(-70,30);c.closePath();c.fill();
  c.fillStyle=shadeHex(hc,1.22);c.fillRect(-70,-34,30,40);
  if(gild){c.fillStyle='#F2C462';c.fillRect(-70,-7,160,1.6);}c.restore();
  c.strokeStyle=hlc;c.globalAlpha=.55;c.lineWidth=1.1;c.beginPath();c.moveTo(-62,-10);c.lineTo(-26,-10);c.lineTo(-24,-6);c.lineTo(72,-6);c.stroke();c.globalAlpha=1;
  c.fillStyle=hc;[[-66,-30,-34],[-28,44,-14],[46,72,-22]].forEach(([x0,x1,yy])=>{c.fillRect(x0,yy-6,x1-x0,1.4);for(let px=x0;px<=x1;px+=5)c.fillRect(px,yy-6,1,6);});
  [-58,-50,-42].forEach(wx=>{c.fillStyle=lampOn?lights:shadeHex(hd,1.15);c.beginPath();c.moveTo(wx,-16);c.lineTo(wx,-24);c.quadraticCurveTo(wx+2.8,-29,wx+5.6,-24);c.lineTo(wx+5.6,-16);c.closePath();c.fill();});
  if(lampOn)glowAt(c,-48,-22,22,'255,196,106',.4);
  c.fillStyle=hd;for(let px=-20;px<40;px+=11)c.fillRect(px,-6,3.4,3);
  const lantern=(lx,ly)=>{if(lampOn)glowAt(c,lx,ly-3,18,'255,196,106',.55);rr(c,lx-2.4,ly-6,4.8,7,1,lampOn?lights:sdk);c.fillStyle=wood;c.beginPath();c.moveTo(lx-3.2,ly-6);c.lineTo(lx,ly-9);c.lineTo(lx+3.2,ly-6);c.closePath();c.fill();c.fillRect(lx-3,ly+1,6,1.4);};
  c.fillStyle=wood;c.fillRect(-67,-46,1.6,14);lantern(-66,-46);c.strokeStyle=wood;c.lineWidth=.7;c.beginPath();c.moveTo(100,-37);c.lineTo(100,-30);c.stroke();lantern(100,-24);
  c.restore();
  // your flag at the top of the main mast, the emissary pennant above it
  drawFlag(c,3.4,-74.4,pl.flag||SHIP_DEFAULT.flag,t);
  if(opts.em!=null){R(c,2.3,-84,.9,11,wood);disc(c,2.75,-84.4,1,'#E2AE45');drawEmissary(c,3.1,-83,opts.em,t);}
  if(opts.captain!==false&&opts.pid){c.save();c.translate(-22,-31.4+Math.sin(t/650+ph)*.25);drawKeeper(c,0,0,opts.pid,pl,t,{chicken:opts.chicken,dance:opts.dance});c.restore();if(opts.moth!=null)drawMoth(c,-13,-27,opts.moth,t,pl.moth,false);}
  if(opts.pet)drawPet(c,opts.pet,-2,-12.6,t,.6);
  (pl.deck||[]).slice(0,4).forEach((id,i)=>id&&drawDeckItem(c,id,(typeof DECK_SPOTS!=='undefined'?DECK_SPOTS:[-8,6,18])[i],-12.6,t));
  {const sh=pl.shot&&ALL_ITEMS[pl.shot];if(sh){c.save();c.translate(-24,-23.6);c.scale(.8,.8);drawShot(c,-2.3,0,sh.st,t);drawShot(c,2.3,0,sh.st,t+300);drawShot(c,0,-3.3,sh.st,t+600);c.restore();}}
  // the figurehead sits on the prow under the bowsprit, leaning out over the water, on a little carved scroll
  if(pl.figure){const gold=gild?'#F2C462':mixHex('#C9A24A',shadow,neutral?.1:.3);c.save();c.strokeStyle=gold;c.lineWidth=.8;c.lineCap='round';c.beginPath();c.moveTo(34.2,-15.4);c.quadraticCurveTo(36.6,-12,35.2,-7.6);c.stroke();
    c.beginPath();c.arc(34.2,-7.4,1,0,TAU*.75);c.stroke();c.translate(35.2,-9.4);c.rotate(.34);drawFigure(c,-.6,1.4,pl.figure);c.restore();}
  if(gild)for(let i=0;i<3;i++){const tw=Math.sin(t/260+i*2.1);if(tw>.5){const gx=-20+i*22,gy=-9;line(c,gx-1.6,gy,gx+1.6,gy,'#FFF6CF',.4);line(c,gx,gy-1.6,gx,gy+1.6,'#FFF6CF',.4);}}
  // water lapping at the hull and a little bow spray
  if(!neutral){const hz=ART_HZ[THEME.scene]||108,f=Math.max(0,Math.min(1,(y-hz)/(H-hz)));const wc=f<.3?mixHex(P.sea[0],P.sea[1],f/.3):mixHex(P.sea[1],P.sea[2],(f-.3)/.7);c.fillStyle=rgbaOf(wc,.55);c.beginPath();c.moveTo(-36,0);for(let i=0;i<=8;i++)c.quadraticCurveTo(-36+i*9.6+4.8,-1.4+Math.sin(t/300+i)*.6,-36+(i+1)*9.6,0);c.lineTo(48,6);c.lineTo(-36,6);c.closePath();c.fill();
  c.fillStyle=rgbaOf(P.rip,.35);c.fillRect(-30,.4,64,.4);}
  if(opts.moving)for(let i=0;i<7;i++){const q=((t/380)+i/7)%1;disc(c,37+q*5-i%3,-1-Math.sin(q*Math.PI)*(4+i%3*1.5),1.3*(1-q)+.3,`rgba(255,255,255,${.85*(1-q)})`);}
  if(fire){const p=1-fire;if(p<.3){lamp(c,37,-13,5+10*(1-p/.3),.9,'255,200,90');disc(c,36.5,-13,2.4*(1-p/.3),'#FFF1B8');}for(let i=0;i<5;i++)disc(c,34+p*9+i*2.2,-14-p*8-i*1.2,2+p*3.4,`rgba(250,250,250,${.7*(1-p)})`);}
  c.restore();}

/* ---------- sea foes: drawn as they are, then pulled towards a silhouette so they sit in the painted world ---------- */
let ART_TINT=null;
function artTinted(c,bx,by,bw,bh,col,a,draw){let sc=1;try{const m=c.getTransform();sc=Math.max(.5,Math.min(3,Math.hypot(m.a,m.b)));}catch(e){}
  const cw=Math.ceil(bw*sc),ch=Math.ceil(bh*sc);if(cw<2||ch<2||cw>2400||ch>2400){draw(c);return;}
  if(!ART_TINT)ART_TINT=document.createElement('canvas');const cv=ART_TINT;if(cv.width<cw)cv.width=cw;if(cv.height<ch)cv.height=ch;const q=cv.getContext('2d');
  q.setTransform(1,0,0,1,0,0);q.clearRect(0,0,cv.width,cv.height);q.setTransform(sc,0,0,sc,-bx*sc,-by*sc);try{draw(q);}catch(e){}
  q.setTransform(1,0,0,1,0,0);q.globalCompositeOperation='source-atop';q.globalAlpha=a;q.fillStyle=col;q.fillRect(0,0,cw,ch);q.globalAlpha=1;q.globalCompositeOperation='source-over';
  c.drawImage(cv,0,0,cw,ch,bx,by,bw,bh);}


/* ---------- the port town: a hillside of timber houses, a fort, a church tower and a stone quay ---------- */
const TOWN_KEYS=[[-30,80],[0,70],[22,58],[64,57],[94,74],[124,70],[152,66],[178,76],[206,88],[240,106]];
function townHillY(x){const K=TOWN_KEYS;if(x<=K[0][0])return K[0][1];for(let i=1;i<K.length;i++)if(x<=K[i][0]){const [x0,y0]=K[i-1],[x1,y1]=K[i];const u=(x-x0)/(x1-x0),e=(1-Math.cos(u*Math.PI))/2;return y0+(y1-y0)*e;}return 110;}
const TOWN_WALLS=['#C98A5A','#B8584A','#E0CDA6','#5E8C88','#D8B070','#8E7A9E','#E6D8C0','#A86A48'],TOWN_ROOFS=['#7A3A2E','#5A4A58','#8A4A32','#3E4A5A'];
let TOWN=null;function townPlan(){if(TOWN)return TOWN;const houses=[];for(let k=0;k<5;k++){let x=-26+(k%2)*5;let i=0;while(x<236){const r=h32('th'+k+'_'+i);const w=7+r%5,hh=8+((r>>4)%7)+(k===4?3:0);const base=townHillY(x+w/2)+7+k*8.5;
      if(base<=105&&!(k>=3&&x+w>98&&x<112)){houses.push({x,w,h:hh,base,k,wall:TOWN_WALLS[(r>>8)%TOWN_WALLS.length],roof:TOWN_ROOFS[(r>>11)%TOWN_ROOFS.length],gable:((r>>13)%3)!==0,win:(r>>15)%3+1,lit:((r>>17)%10)<6,chim:((r>>19)%4)===0});}
      x+=w+((r>>21)%3===0?3:.6);i++;}}
  houses.forEach((hs,i)=>{hs.id=i;hs.pri=(4-hs.k)*48+Math.abs(hs.x+hs.w/2-112)+(h32('tp'+i)%9);});const order=[...houses].sort((a,b)=>a.pri-b.pri);order.forEach((hs,i)=>hs.rank=i);
  TOWN={houses,total:houses.length};return TOWN;}
/* the town grows with the crew's lifetime DMs: a fishing village at the start, a busy port by 45,000 */
const TOWN_START=8,TOWN_FULL=45000;
function townCount(dm){const P_=townPlan();return Math.min(P_.total,Math.round(TOWN_START+(P_.total-TOWN_START)*Math.sqrt(Math.min(1,Math.max(0,dm)/TOWN_FULL))));}
function townNextAt(dm){const n=townCount(dm),P_=townPlan();if(n>=P_.total)return null;let lo=dm,hi=TOWN_FULL;while(hi-lo>1){const m=Math.floor((lo+hi)/2);if(townCount(m)>n)hi=m;else lo=m;}return hi;}
const TOWN_STEPS=[{dm:500,id:'lamps',name:'Lamp posts along the quay'},{dm:1000,id:'church',name:'The church tower'},{dm:2000,id:'lights',name:'A string of lights on the quay'},{dm:4000,id:'mill',name:'A windmill on the ridge'},{dm:8000,id:'bells',name:'Bells that ring when you hit the target'}];
const townHas=(id,dm)=>{const s_=TOWN_STEPS.find(x=>x.id===id);return !s_||dm>=s_.dm;};
function townHouse(q,hs,P,night,snow,shadeK){const {x,w,h,base}=hs;const top=base-h;const wall=mixHex(hs.wall,P.bld,shadeK),roof=mixHex(hs.roof,P.bld,shadeK*.9);
  q.fillStyle=wall;q.fillRect(x,top,w,h+1);q.fillStyle=shadeHex(wall,.82);q.fillRect(x+w*.7,top,w*.3,h+1);
  q.fillStyle=shadeHex(wall,.7);for(let j=1;j<h/4;j++)q.fillRect(x,top+j*4,w,.35);
  q.fillStyle=roof;q.beginPath();if(hs.gable){q.moveTo(x-1,top+.5);q.lineTo(x+w/2,top-w*.55);q.lineTo(x+w+1,top+.5);}else{q.moveTo(x-1,top+.5);q.lineTo(x+1.5,top-3);q.lineTo(x+w-1.5,top-3);q.lineTo(x+w+1,top+.5);}q.closePath();q.fill();
  if(snow){q.fillStyle='rgba(255,255,255,.9)';q.beginPath();if(hs.gable){q.moveTo(x-1,top+.5);q.lineTo(x+w/2,top-w*.55);q.lineTo(x+w+1,top+.5);q.lineTo(x+w-1,top-.6);q.lineTo(x+w/2,top-w*.4);q.lineTo(x+1,top-.6);}else{q.rect(x-1,top-3,w+2,1.6);}q.closePath();q.fill();}
  if(hs.chim){q.fillStyle=roof;q.fillRect(x+w*.7,top-w*.5,1.6,3.4);}
  q.fillStyle=shadeHex(wall,.6);q.fillRect(x+w/2-1,base-3.2,2,3.2);}
function townWindows(hs){const out=[];const {x,w,h,base,win}=hs;const rows=h>11?2:1;for(let r=0;r<rows;r++)for(let i=0;i<win;i++){const wx=x+(w/(win+1))*(i+1)-.7,wy=base-h+2+r*4.6;if(wy+2.2>base-3.6&&r>0)continue;out.push([wx,wy]);}return out;}
function artTown(c,t){const dm=(typeof TEAMDM==='function'?TEAMDM():0)||0;const nH=townCount(dm);const vn=VENTURES.filter(v=>dm>=v.dm).length;const P=artPal();const mode=artMode();const night=!!(SUN&&SUN.night);const snow=artSnowy()||THEME.festive==='christmas';const lit=artLitNow()||THEME.weather==='storm';const plan=townPlan();
  const stone=mixHex('#B8AC94',P.bld,.5),dk=night?.72:.5;
  layerCache(c,`arttown_${mode}${artBlendKey()}_${THEME.weather}_${snow?1:0}_${nH}_${townHas('church',dm)?1:0}_${townHas('mill',dm)?1:0}_${vn}`,-40,30,300,92,q=>{
    // the hill behind the town
    q.fillStyle=mixHex(P.isl,P.mid,.3);q.beginPath();q.moveTo(-40,112);for(let x=-40;x<=244;x+=4)q.lineTo(x,townHillY(x)+2);q.lineTo(244,112);q.closePath();q.fill();
    q.fillStyle=shadeHex(mixHex(P.isl,P.mid,.3),1.15);q.beginPath();q.moveTo(-40,112);for(let x=-40;x<=40;x+=4)q.lineTo(x,townHillY(x)+2);q.lineTo(10,112);q.closePath();q.fill();
    if(snow){q.fillStyle='rgba(255,255,255,.85)';q.beginPath();for(let x=-40;x<=244;x+=4)q.lineTo(x,townHillY(x)+2);for(let x=244;x>=-40;x-=4)q.lineTo(x,townHillY(x)+4.6);q.closePath();q.fill();}
    // trees on the ridge
    for(let i=0;i<14;i++){const x=-30+i*19+(h32('tr'+i)%9);if(x>20&&x<70)continue;const y=townHillY(x)+3;if(snow)artPine(q,x,y,7+h32('tt'+i)%5,shadeHex(P.isl,.8),true);else{q.fillStyle=shadeHex(mixHex(P.isl,P.mid,.3),.8);q.beginPath();q.arc(x,y-3,3.4,0,TAU);q.arc(x+3,y-2,2.6,0,TAU);q.fill();}}
    // the fort (Fort Funnal, venture 4), or a ruined watchtower until then
    const fy=townHillY(44)+3;if(vn<4){q.fillStyle=shadeHex(stone,.85);q.fillRect(27,fy-9,9,10);q.fillRect(27,fy-11,2.4,2.4);q.fillRect(32,fy-12.4,2.4,3.6);q.fillStyle=shadeHex(stone,.6);q.fillRect(30,fy-6,2.4,3);}else{q.fillStyle=stone;q.fillRect(14,fy-11,58,12);for(let x=14;x<72;x+=4)q.fillRect(x,fy-13.5,2.4,2.6);
    q.fillStyle=shadeHex(stone,1.12);q.fillRect(14,fy-11,8,12);q.fillStyle=shadeHex(stone,.78);q.fillRect(26,fy-16,12,17);for(let x=26;x<38;x+=3.2)q.fillRect(x,fy-18.4,2,2.6);
    q.fillStyle=shadeHex(stone,.55);[46,54,62].forEach(x=>q.fillRect(x,fy-7,3,3));q.fillRect(30.4,fy-12,3,4);
    q.fillStyle=shadeHex(stone,.4);[[47.5,-5.5],[55.5,-5.5],[63.5,-5.5]].forEach(([x,dy])=>{q.save();q.translate(x,fy+dy);q.rotate(.25);q.fillRect(0,-.8,6,1.6);q.restore();});
    }
    // the church tower (1,000 crew DMs)
    if(townHas('church',dm)){    const cx=152,cy=townHillY(152)+4;q.fillStyle=mixHex('#E0D4BC',P.bld,.5);q.fillRect(cx-4,cy-24,8,25);q.fillStyle=shadeHex(mixHex('#E0D4BC',P.bld,.5),.82);q.fillRect(cx+1.6,cy-24,2.4,25);
    q.fillStyle=mixHex('#7A3A2E',P.bld,.45);q.beginPath();q.moveTo(cx-5,cy-24);q.lineTo(cx,cy-34);q.lineTo(cx+5,cy-24);q.closePath();q.fill();q.fillRect(cx-.4,cy-38,.8,4);q.fillRect(cx-1.6,cy-36.6,3.2,.8);
    q.fillStyle=shadeHex(stone,.4);q.beginPath();q.arc(cx,cy-18,1.8,Math.PI,0);q.rect(cx-1.8,cy-18,3.6,3);q.fill();
    }
    // a windmill on the ridge (4,000 crew DMs)
    if(townHas('mill',dm)){const mx=118,my=townHillY(118)+3;q.fillStyle=mixHex('#E0D4BC',P.bld,.5);q.beginPath();q.moveTo(mx-3,my);q.lineTo(mx-2,my-11);q.lineTo(mx+2,my-11);q.lineTo(mx+3,my);q.closePath();q.fill();q.fillStyle=mixHex('#7A3A2E',P.bld,.45);q.beginPath();q.moveTo(mx-2.6,my-11);q.lineTo(mx,my-14);q.lineTo(mx+2.6,my-11);q.closePath();q.fill();}
    // houses, back rows first; only as many as the crew has earned
    plan.houses.forEach(hs=>{if(hs.rank<nH)townHouse(q,hs,P,night,snow,hs.k<2?dk+.12:dk);});
    // the quay: stone wall, a lighter cap, drains, mooring posts
    q.fillStyle=shadeHex(stone,.85);q.fillRect(-40,104.5,280,11);q.fillStyle=shadeHex(stone,1.1);q.fillRect(-40,103.6,280,1.6);
    q.fillStyle=shadeHex(stone,.6);for(let x=-36;x<240;x+=12)q.fillRect(x,107+(x%24?0:2),5,.5);for(let x=-30;x<240;x+=26){q.beginPath();q.arc(x,115.5,2.4,Math.PI,0);q.fill();}
    q.fillStyle=shadeHex(stone,.5);q.fillRect(-40,114.6,280,1.2);
    for(let x=-34;x<238;x+=18){q.fillStyle=mixHex('#5A3A28',P.bld,.4);q.fillRect(x,101.4,1.6,2.6);}
    // barrels and crates along the quay
    [[8,0],[12,1],[180,0],[186,1],[232,0]].forEach(([x,k])=>{q.fillStyle=mixHex(k?'#9A6A42':'#7A5232',P.bld,.45);k?q.fillRect(x,100.6,3.6,3.2):(q.beginPath(),q.ellipse(x+1.6,102.2,1.6,1.8,0,0,TAU),q.fill());});
  });
  // the fort's flag and a little smoke
  const fy=townHillY(44)+3;if(vn>=4){R(c,31.6,fy-30,.7,12,shadeHex(stone,.5));drawFlag(c,32.2,fy-30,vn>=6?'flag_crown2':'flag_skull',t,8,5.4);}
  if(townHas('bells',dm)&&townHas('church',dm)){const td=G.days[G.today];const won=td&&td.target>0&&td.team>=td.target;const bx=152,by=townHillY(152)+4-17;const sw=won?Math.sin(t/260)*.5:0;c.save();c.translate(bx,by-1.5);c.rotate(sw);c.fillStyle='#E2AE45';c.beginPath();c.moveTo(-1.4,2.2);c.quadraticCurveTo(-1.4,0,0,0);c.quadraticCurveTo(1.4,0,1.4,2.2);c.closePath();c.fill();c.restore();
    if(won)for(let k=0;k<3;k++){const q=((t/1800)+k/3)%1;txt(c,'♪',bx+6+q*10+k*2,by-6-q*14,`rgba(255,226,150,${1-q})`,5,'center');}}
  if(townHas('mill',dm)){const mx=118,my=townHillY(118)+3-12;c.strokeStyle=mixHex('#5A3A28',P.bld,.4);c.lineWidth=.8;const a=t/1400;c.beginPath();for(let k=0;k<4;k++){const b=a+k*Math.PI/2;c.moveTo(mx,my);c.lineTo(mx+Math.cos(b)*7,my+Math.sin(b)*7);}c.stroke();disc(c,mx,my,.8,mixHex('#5A3A28',P.bld,.4));}
  // the next house going up: a timber frame, and a note when tapped
  {const nx=plan.houses.find(h=>h.rank===nH);const at=townNextAt(dm);if(nx&&at){const {x,w,h,base}=nx;c.strokeStyle=mixHex('#C89A5A',P.bld,.35);c.lineWidth=.5;c.strokeRect(x,base-h,w,h);c.beginPath();c.moveTo(x,base);c.lineTo(x+w,base-h);c.moveTo(x-1,base-h);c.lineTo(x+w/2,base-h-w*.55);c.lineTo(x+w+1,base-h);c.stroke();}}
  // lit windows (twinkle a little), lamp posts and a string of lights along the quay
  const winC=lit?'#FFC46A':rgbaOf(P.win,.55);plan.houses.forEach((hs,i)=>{if(hs.rank>=nH)return;townWindows(hs).forEach(([wx,wy],j)=>{const on=lit?(hs.lit||j===0)&&Math.sin(t/(2400+i*37)+i*3+j)>-.85:true;R(c,wx,wy,1.4,2,on?winC:shadeHex(mixHex(hs.wall,P.bld,dk),.6));});});
  if(lit){c.save();c.globalCompositeOperation='lighter';layerCache(c,'towglow_'+nH,-40,30,300,80,q=>plan.houses.forEach((hs,i)=>{if(!hs.lit||hs.rank>=nH)return;const g=q.createRadialGradient(hs.x+hs.w/2,hs.base-hs.h/2,0,hs.x+hs.w/2,hs.base-hs.h/2,hs.w);g.addColorStop(0,'rgba(255,180,90,.16)');g.addColorStop(1,'rgba(255,180,90,0)');q.fillStyle=g;q.fillRect(hs.x-hs.w,hs.base-hs.h*1.5,hs.w*3,hs.h*2);}));c.restore();
    if(townHas('church',dm))R(c,151.2,townHillY(152)-15,1.6,2.2,'#FFC46A');}
  if(townHas('lamps',dm))for(let x=-24;x<238;x+=36){R(c,x,96,.8,8,shadeHex(stone,.45));rr(c,x-1,94.2,2.8,2.4,.6,lit?'#FFD98A':shadeHex(stone,.7));if(lit)lamp(c,x+.4,95.4,7,.55);}
  if(lit&&townHas('lights',dm)){for(let i=0;i<40;i++){const x=-24+i*6.5,y=98+Math.sin((i%6)/5*Math.PI)*1.6;const on=Math.sin(t/300+i*1.3)>-.4;disc(c,x,y,.55,on?['#FFD45A','#FF7A5A','#7AE0FF','#B88AFF'][i%4]:'rgba(255,255,255,.25)');}}
  // a timber dock on the left with a rowboat, and the town's lights shimmering in the water after dark
  if(vn>=1){const wood=mixHex('#6A4A30',P.bld,.45);R(c,-6,115.4,44,2.2,wood);for(let x=-4;x<38;x+=7)R(c,x,117,1.3,7,shadeHex(wood,.8));const b=Math.sin(t/600)*.6;
    c.fillStyle=shadeHex(wood,.9);c.beginPath();c.moveTo(12,121+b);c.lineTo(26,121+b);c.lineTo(23.5,124+b);c.lineTo(14.5,124+b);c.closePath();c.fill();line(c,26,121+b,30,117.6,shadeHex(wood,.7),.4);}
  if(vn>=2){const lx=36,ly=115.6;R(c,lx-1.6,ly-14,3.2,14,mixHex('#E0D4BC',P.bld,.45));R(c,lx-1.6,ly-10,3.2,1.6,mixHex('#C91E36',P.bld,.4));R(c,lx-1.6,ly-5,3.2,1.6,mixHex('#C91E36',P.bld,.4));rr(c,lx-2.2,ly-17,4.4,3,1,'#FFE7A6');lamp(c,lx,ly-15.5,8,.5+.2*Math.sin(t/300),'255,236,170');}
  if(vn>=3){const sx=138,sy=townHillY(138)+9;R(c,sx-2.6,sy-3,5.2,3,mixHex('#B8AC94',P.bld,.5));[-1.2,1.2].forEach(d=>{R(c,sx+d-.7,sy-8,1.4,5,mixHex('#C9B27A',P.bld,.3));disc(c,sx+d,sy-9,1,mixHex('#C9B27A',P.bld,.3));});}
  if(vn>=5)for(let i=0;i<3;i++){const gx=192+i*15,gy=128+Math.sin(t/700+i)*.6;c.save();c.translate(gx,gy);c.scale(.16,.16);drawShip(c,0,0,1,{hull:'hull_royal',sail:'sail_royal',flag:'flag_crown2'},t,{captain:false,phase:i});c.restore();}
  if(vn>=6&&lit){const p=(t%3000)/3000;if(p<.6){const fx=40+(Math.floor(t/3000)*53)%40,fyy=24;for(let i=0;i<12;i++){const a=i/12*TAU;disc(c,fx+Math.cos(a)*p*14,fyy+Math.sin(a)*p*14,.7*(1-p)+.2,['#F2C462','#E0457B','#7CC7E6'][i%3]);}}}
  // tap the town for what it has and what comes next
  {const nxt=townNextAt(dm);const st=TOWN_STEPS.find(x=>dm<x.dm);const vnx=VENTURES.find(v=>dm<v.dm);
    hit(0,40,96,62,'Funnal Cove',`${nH} houses so far, built from ${fmtN(dm)} crew DMs. ${nxt?`The next house goes up at ${fmtN(nxt)}.`:'Every house is built.'}${st?` Coming up: ${st.name.toLowerCase()} at ${fmtN(st.dm)}.`:''}${vnx?` Next grand venture: ${vnx.name} at ${fmtN(vnx.dm)}.`:''}${vn?` Built so far: ${VENTURES.slice(0,vn).map(x=>x.name).join(', ')}.`:''}`);
    hit(118,52,64,48,'Funnal Cove',`${nH} houses so far, built from ${fmtN(dm)} crew DMs. ${nxt?`The next house goes up at ${fmtN(nxt)}.`:'Every house is built.'}${st?` Coming up: ${st.name.toLowerCase()} at ${fmtN(st.dm)}.`:''}`);}
  if(lit){plan.houses.forEach((hs,i)=>{if(!hs.lit||hs.k<3||hs.rank>=nH)return;const x=hs.x+hs.w/2;for(let k=0;k<5;k++){const w=(1.6+k*.5)*(.6+.4*Math.sin(t/420+i+k));c.fillStyle=`rgba(255,196,106,${.32-k*.055})`;c.fillRect(x-w/2+Math.sin(t/600+k+i)*.8,118+k*2.6,w,.7);}});}
  // smoke from a few chimneys
  plan.houses.filter(h=>h.chim&&h.rank<nH).slice(0,5).forEach((hs,i)=>{for(let k=0;k<3;k++){const q=((t/2600)+k/3+i*.2)%1;disc(c,hs.x+hs.w*.75+q*4,hs.base-hs.h-hs.w*.5-q*10,.8+q*1.6,rgbaOf(P.fog,.4*(1-q)));}});
}

/* ---------- the Harbour: crew buildings as silhouettes with lit windows, everything else in the same places ---------- */
function artHarbour(c,t){
  if(!G)return;S.target=null;const today=G.days[G.today];const tgt=today.target,team=today.team;const won=tgt>0&&team>=tgt;const P=artPal();
  const teamFog=Object.values(S.forfeits).some(f=>f&&f.type==='team'&&f.status==='spun'&&Date.now()-f.ts<86400000);
  sky(c,t,{fireworks:won&&skyPhase()==='night'});
  const B=Object.fromEntries(G.proj.map(p=>[p.id,p]));
  if(B.sky.built){const x=(t/60)%380-40;ell(c,x,34,12,5,mixHex('#E06034',P.near,.35));rr(c,x-6,39,12,4,1.5,shadeHex(P.near,.7));}
  sea(c,108,t);
  // a far headland on each side for depth
  island(c,302,110,40,6,t);
  artTown(c,t);
  palm(c,226,104,12,t+400);
  const lit=artLitNow();const S1=P.bld,S2=shadeHex(P.bld,.74),WIN=lit?'#FFC46A':rgbaOf(P.win,.6),awn=k=>mixHex(['#E06034','#F4E2C6','#4A7EC2'][k%3],S1,.55);
  const open=G.proj.find(p=>p.open);
  const drawIf=(id,fn,sx,sy,w,h)=>{const pr=B[id];if(pr.built){fn();hit(sx,sy,w,h,pr.name,pr.blurb+' Built by the crew.');}else if(open&&open.id===id){hit(sx,sy-8,w,h+8,'Next build: '+pr.name,`${pr.blurb} Needs ${fmtN(pr.dm)} crew DMs (you have ${fmtN(G.teamDm)}) and ${fmtN(pr.g)} doubloons of funding (${fmtN(pr.funded)} so far). Fund it from the Quests tab.`);c.strokeStyle=rgbaOf(P.fog,.7);c.lineWidth=.8;c.setLineDash([2,2]);c.beginPath();c.roundRect?c.roundRect(sx,sy,w,h,3):c.rect(sx,sy,w,h);c.stroke();c.setLineDash([]);txt(c,'next build',sx+w/2,sy-8,'#3F5160',6,'center');}};
  drawIf('jetty',()=>{rr(c,196,116,36,2.4,1,S2);for(let i=199;i<232;i+=7)R(c,i,118,1.4,7,S2);},196,113,36,12);
  drawIf('boats',()=>{[[250,122],[272,130]].forEach(([x,y],i)=>{const b=Math.sin(t/500+i);rr(c,x-6,y+b,12,3.4,1.7,S2);R(c,x-.3,y-7+b,.7,7,S2);poly(c,[[x+.5,y-6+b],[x+5,y-1+b],[x+.5,y-1+b]],mixHex('#FFFFFF',P.fog,.3));});},240,112,40,24);
  drawIf('stall',()=>{rr(c,40,96,16,11,1,S1);for(let i=0;i<4;i++)rr(c,39+i*4.5,92,4.5,5,1.5,i%2?awn(0):awn(1));disc(c,44,101,1.4,WIN);disc(c,51,101,1.4,WIN);},38,88,20,19);
  drawIf('bakery',()=>{R(c,60,88,22,18,S1);poly(c,[[57,89],[71,79],[85,89]],S2);R(c,78,80,3,7,S2);rr(c,68,98,5,8,1,S2);R(c,62,92,4,4,WIN);R(c,75,92,4,4,WIN);for(let k=0;k<3;k++){const q=((t/2400)+k/3)%1;disc(c,79.5+q*4,78-q*12,1.2+q*1.6,rgbaOf(P.fog,.45*(1-q)));}},57,78,32,28);
  drawIf('market',()=>{R(c,86,104,40,2.4,S2);for(let i=0;i<3;i++){R(c,89+i*13,96,10,8,S1);rr(c,88+i*13,93,12,3.5,1.2,awn(i));if(lit)disc(c,94+i*13,100,.9,WIN);}},86,92,40,15);
  const beacon=B.beacon.built;drawLighthouse(c,104,106,beacon?50:34,beacon?'#C91E36':'#D9485F',t,{gold:beacon});hit(98,64,14,44,'Funnal Cove lighthouse','Your shared port. It grows as the crew completes building projects (see Quests).');
  drawIf('clock',()=>{R(c,128,70,12,36,S1);poly(c,[[126,71],[134,62],[142,71]],S2);disc(c,134,78,4,lit?'#FFE7A6':rgbaOf(P.win,.85));const a=t/2000;line(c,134,78,134+Math.cos(a)*3,78+Math.sin(a)*3,S2,.6);rr(c,132,96,4,10,1,S2);},126,62,16,44);
  drawIf('carto',()=>{R(c,146,92,18,14,S1);poly(c,[[143,93],[155,84],[167,93]],S2);rr(c,151,98,4,8,1,S2);R(c,158,95,3.4,3.4,WIN);},143,84,24,22);
  drawIf('observatory',()=>{R(c,170,90,20,16,S1);c.fillStyle=S2;c.beginPath();c.arc(180,90,10,Math.PI,0);c.fill();R(c,179,80,2,8,S2);rr(c,177,98,5,8,1,lit?'#FFC46A':S2);},169,80,22,26);
  drawIf('flags',()=>{c.strokeStyle=S2;c.lineWidth=.5;c.beginPath();c.moveTo(40,85);c.quadraticCurveTo(110,96,190,85);c.stroke();for(let i=0;i<15;i++){const x=44+i*10,y=85+Math.sin(i/14*Math.PI)*5.5+Math.sin(t/400+i)*.6;poly(c,[[x,y],[x+4,y],[x+2,y+4]],mixHex(['#D9485F','#DDA94D','#5DBE9C','#4A7EC2'][i%4],S1,.4));}},40,82,150,10);
  drawIf('bridge',()=>{c.strokeStyle=S2;c.lineWidth=2;c.beginPath();for(let x=215;x<=320;x+=2){const y=104-Math.sin((x-215)/105*Math.PI)*22;x===215?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();for(let x=221;x<320;x+=12){const y=104-Math.sin((x-215)/105*Math.PI)*22;R(c,x,y-5,.8,5,S2);disc(c,x+.4,y-6,1.3,WIN);if(lit)lamp(c,x+.4,y-6,5,.4);}},215,80,105,26);
  const P2=G.P;const lead=today.leader;
  P2.forEach((p,i)=>{const pl=S.players[p]||{};const x=i?142:58,y=154+i*4;const ch=activeForfeitsFor(p).some(f=>f.result==='chicken');
    const fire=S.fired&&S.fired[p]?Math.max(0,1-(performance.now()-S.fired[p])/600):0;
    drawShip(c,x,y,.62,pl,t,{pid:p,chicken:ch,moth:G.players[p]?.moth,phase:i*2,firing:fire,em:emGrade(today.p[p]?.d||0),pet:PET_BY_ID[pl.pet]});
    hit(x-24,y-50,50,52,`Captain ${pnameRaw(p)}'s ship`,`${today.p[p].d} DMs today. Tap Ship below to customise yours.`);
    if(lead===p){const cx=x+2,cy=y-60+Math.sin(t/400)*1.2;poly(c,[[cx-5,cy+3],[cx-5,cy-2],[cx-2.5,cy+.5],[cx,cy-3.5],[cx+2.5,cy+.5],[cx+5,cy-2],[cx+5,cy+3]],'#DDA94D');}
    txt(c,C().players[p]?.name||p,x,y+4,pcolHex(p),8,'center');});
  if(tgt>0){const boss=today.boss;const hp=Math.max(0,tgt-team);const ratio=hp/tgt;
    if(!won){const r=12+20*ratio;const off={storm:null,ship:.7,serpent:.55,octopus:.45,kraken:.45,crab:.4,whale:.35}[boss.type||'storm'];const bx=266+Math.sin(t/1700)*4,by=off==null?66+Math.sin(t/1100)*3:113-r*off+Math.sin(t/1100)*1.4;drawBoss(c,boss,bx,by,r,ratio,t,S.bossFlash>t,off==null?null:113);S.target={x:bx,y:by};
      hit(bx-r*1.2,by-r*1.2,r*2.4,r*2.4,boss.name,`Today's sea foe${boss.rare?' (rare!)':''}. It has ${hp} of ${tgt} HP left: every DM either of you logs fires one cannonball. Sink it to earn +100 XP and 30 doubloons each.`);}
    else drawSunk(c,t,boss,today);}
  updateLanterns(c,t);harbourNight(c,t,B);
  if(teamFog){c.fillStyle=rgbaOf(P.fog,.5);c.fillRect(0,0,W,H);for(let i=0;i<6;i++){const x=(i*67+t/80)%380-30,y=60+(i%3)*30;for(let k=0;k<5;k++)disc(c,x+k*7,y+Math.sin(k)*3,10,rgbaOf(P.fog,.55));}txt(c,'Team forfeit: the fog moved in for the day',160,6,'#3F5160',8,'center');}
}
{const _dh=drawHarbour;drawHarbour=function(c,t){if(!isArtLook())return _dh.apply(this,arguments);return artHarbour(c,t);};}

/* ---------- the Black Market stall and the Rusty Anchor, redrawn in the same style ---------- */
{const _st=drawStall;drawStall=function(c,x,y,t){if(!isArtLook())return _st.apply(this,arguments);if(THEME.scene==='harbour')y=Math.min(y,104.4);const P=artPal();const glow=.75+.25*Math.sin(t/230)+.06*Math.sin(t/57);
  glowAt(c,x+2,y-10,26,'190,120,255',.38*glow);const tent=mixHex('#2A1840',P.isl,.3);
  poly(c,[[x-10,y],[x-7,y-15],[x+13,y-15],[x+16,y]],tent);poly(c,[[x-9,y-15],[x+3,y-24],[x+15,y-15]],mixHex('#4A2668',P.isl,.25));
  rr(c,x-7,y-6,19,6,1,shadeHex(tent,.7));drawTrader(c,x+2.5,y-6.6,t,.62);
  [x-7,x+3,x+13].forEach((lx,i)=>{const a=glow*(.8+.2*Math.sin(t/300+i));lamp(c,lx,y-14,6,.55*a,'200,150,255');disc(c,lx,y-14,1.2,`rgba(220,190,255,${a})`);});
  if(xmasNowSafe())for(let i=0;i<9;i++){const on=Math.sin(t/300+i*1.7)>-.3;disc(c,x-8+i*2.6,y-15.6,.55,on?['#E0453B','#F2C462','#3FA34D','#4A9BE0'][i%4]:'rgba(255,255,255,.3)');}};}
{const L_=LAYERS.world.find(e=>e.id==='tavernPub');if(L_){const _pub=L_.fn;L_.fn=function(c,t,ctx){if(!isArtLook())return _pub.call(this,c,t,ctx);const P=artPal();const x=196,y=104.4;const S1=P.bld,S2=shadeHex(P.bld,.74);
  const open=tvOpenNow(),lit=open&&(artLitNow()||THEME.weather==='storm');if(lit)glowAt(c,x,y-8,18,'255,183,96',.35);
  R(c,x-8,y-14,17,14,S1);poly(c,[[x-10,y-13.5],[x+.5,y-22],[x+11,y-13.5]],S2);R(c,x+4.5,y-22,2.2,6,S2);
  const wc=open?(lit?'#FFC46A':rgbaOf(P.win,.75)):shadeHex(S1,.8);R(c,x-6.2,y-11,3.4,3.4,wc);R(c,x+3.8,y-11,3.4,3.4,wc);rr(c,x-1.8,y-7,4.6,7,1,lit?'#E89A4A':S2);
  R(c,x+10,y-16,.8,7,S2);rr(c,x+10.6,y-15.6,6,4,.6,S2);disc(c,x+13.6,y-13.6,1,lit?'#FFC46A':shadeHex(S2,1.4));
  if(xmasNowSafe()||artSnowy()){c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.moveTo(x-10,y-13.5);c.lineTo(x+.5,y-22);c.lineTo(x+11,y-13.5);c.lineTo(x+8,y-14.5);c.lineTo(x+.5,y-20.6);c.lineTo(x-7,y-14.5);c.closePath();c.fill();}
  if(xmasNowSafe())for(let i=0;i<7;i++){const on=Math.sin(t/300+i*1.7)>-.3;disc(c,x-7+i*2.4,y-14,.55,on?['#FF5A5A','#FFD45A','#5AE08A'][i%3]:'rgba(255,255,255,.3)');}
  hit(x-11,y-22,30,24,'The Rusty Anchor',`Barnacle Bill's tavern. ${tvOpenNow()?'Open until 11pm.':'Closed, but Bill is in.'} Drinks, games and gossip. Tap to go in.`,{go:'tavern'});};}}
{const L_=LAYERS.fx.find(e=>e.id==='atmosMotes');if(L_){const w=L_.when;L_.when=()=>(w&&w())||(isArtLook()&&!!(SUN&&SUN.mode!=='day'));}}

/* a little note when the town has grown since you last looked */
{let townSeenChk=0;const _rdT=render;render=function(){_rdT.apply(this,arguments);try{if(!G||!isArtLook()||S.screen!=='harbour'||Date.now()-townSeenChk<4000)return;townSeenChk=Date.now();const dm=TEAMDM()||0;const n=townCount(dm);const k='hl_town_seen';const was=+(localStorage.getItem(k)||0);
  if(was&&n>was){const d=n-was;const st=TOWN_STEPS.filter(x=>dm>=x.dm&&TOWN_STEPS.indexOf(x)>=0).pop();toast(`🏠 Funnal Cove grew: ${d===1?'a new house went up':d+' new houses went up'} on the hill. ${n} houses now.`);}
  if(n!==was)localStorage.setItem(k,String(n));}catch(e){}};}

/* ============================== ART STAGE B: LOCK IN VOYAGES ==============================
   Three layers of coastline slide past at different speeds while you sail: far peaks, nearer ranges and a near shore
   that changes every few minutes (pine fjords, cliffs and arches, a ruined coast, palm isles). The near shore is
   mirrored in the water. Sailing faster (the voyage boost) scrolls faster; fishing drifts slowly. */
const VOY={off:0,last:0,lk:null,el:0};
const VOY_BIOMES=['fjord','cliffs','ruins','isles'],VOY_SEG=7*60000,VOY_W=640,VOY_FADE=40000;
const VOY_NAMES={fjord:'Pine Fjords',cliffs:'The Arches',ruins:'The Ruined Coast',isles:'Palm Isles'};
{const _dv=drawVoyage;drawVoyage=function(c,t,lk,dms,progress){if(isArtLook()&&lk){const now=performance.now();const dt=VOY.last?Math.min(120,now-VOY.last):16;VOY.last=now;
    const sp=(typeof isFish==='function'&&isFish(lk.mode))?.25:1+Math.min(2,(S.voyBoost||0));VOY.off+=dt*sp*.012*(THEME.reduced?.5:1);VOY.lk=lk;VOY.el=progress*lk.dur;}
  return _dv.apply(this,arguments);};}
const STRIPS={};
function artStrip(c,key,w,h,draw){let sc=1;try{const m=c.getTransform();sc=Math.max(.5,Math.min(4,Math.hypot(m.a,m.b)));}catch(e){}const k=key+'@'+sc.toFixed(2);let cv=STRIPS[k];
  if(!cv){cv=document.createElement('canvas');cv.width=Math.ceil(w*sc);cv.height=Math.ceil(h*sc);const q=cv.getContext('2d');q.setTransform(sc,0,0,sc,0,0);draw(q);STRIPS[k]=cv;const ks=Object.keys(STRIPS);if(ks.length>36)delete STRIPS[ks[0]];}return cv;}
function stripLoop(c,cv,w,h,y,off,alpha,flip){const x0=-(((off%w)+w)%w)-90;c.save();c.globalAlpha=alpha;if(flip){c.translate(0,y);c.scale(1,-.55);for(let x=x0;x<W+90;x+=w)c.drawImage(cv,x,-h,w,h);}else for(let x=x0;x<W+90;x+=w)c.drawImage(cv,x,y-h,w,h);c.restore();}
// periodic helpers: draw a shape at x, x-640 and x+640 so the strip joins up
const wrapX=(fn,x)=>{fn(x);fn(x-VOY_W);fn(x+VOY_W);};
function voyFar(q,h,col,snow,key){const pk=artPeaks(key,10,0,VOY_W,h*.35,h*.8,28,48);pk.forEach(p=>wrapX(x=>artFacets(q,h,[[x,p[1],p[2],p[3]]],col,snow),p[0]));}
function voyNear(q,b,h,P,snow,lit){const col=P.near,dk=shadeHex(P.near,.78),lc=shadeHex(P.near,1.16);
  if(b==='fjord'){q.fillStyle=col;q.beginPath();q.moveTo(0,h);for(let x=0;x<=VOY_W;x+=4){const y=h-(16+10*Math.sin(TAU*x/VOY_W*3)+6*Math.sin(TAU*x/VOY_W*7+1)+3*Math.sin(TAU*x/VOY_W*13));q.lineTo(x,y);}q.lineTo(VOY_W,h);q.closePath();q.fill();
    for(let x=2;x<VOY_W;x+=5.5){const y=h-(16+10*Math.sin(TAU*x/VOY_W*3)+6*Math.sin(TAU*x/VOY_W*7+1)+3*Math.sin(TAU*x/VOY_W*13));const ph=7+(h32('fp'+x)%8);artPine(q,x,y+3,ph,dk,snow);}
    if(lit)[90,330,520].forEach(x=>{const y=h-(16+10*Math.sin(TAU*x/VOY_W*3)+6*Math.sin(TAU*x/VOY_W*7+1))+6;q.fillStyle='#FFC46A';q.fillRect(x,y,2,1.6);});}
  else if(b==='cliffs'){[[20,130,36],[250,100,30],[430,150,40]].forEach(([x0,w,hh],ci)=>{let x=x0;let i=0;while(x<x0+w){const bw=w*(.22+(h32('cb'+ci+i)%100)/100*.16),bh=hh*(.55+(h32('ch'+ci+i)%100)/100*.45);const top=h-bh;
      const draw=xx=>{q.fillStyle=col;q.beginPath();q.moveTo(xx,h+1);q.lineTo(xx+bw*.08,top+bh*.25);q.lineTo(xx+bw*.3,top);q.lineTo(xx+bw*.62,top+bh*.07);q.lineTo(xx+bw,top+bh*.38);q.lineTo(xx+bw*1.06,h+1);q.closePath();q.fill();
        q.fillStyle=lc;q.beginPath();q.moveTo(xx,h+1);q.lineTo(xx+bw*.08,top+bh*.25);q.lineTo(xx+bw*.3,top);q.lineTo(xx+bw*.36,h+1);q.closePath();q.fill();
        q.fillStyle=dk;q.fillRect(xx+bw*.4,top+bh*.45,bw*.5,.6);q.fillRect(xx+bw*.2,top+bh*.7,bw*.6,.6);
        if(i%2===0)artPine(q,xx+bw*.4,top+bh*.05+1,6+(h32('cp'+ci+i)%5),dk,snow);};wrapX(draw,x);x+=bw*.78;i++;}
    const ax=x0+w*.42;wrapX(xx=>{q.fillStyle=P.fog;q.globalAlpha=.5;q.beginPath();q.moveTo(xx,h+1);q.lineTo(xx,h-hh*.3);q.quadraticCurveTo(xx+7,h-hh*.52,xx+14,h-hh*.3);q.lineTo(xx+14,h+1);q.closePath();q.fill();q.globalAlpha=1;},ax);});}
  else if(b==='ruins'){[[40,150],[300,110],[470,130]].forEach(([x0,w],ri)=>{wrapX(xx=>{q.fillStyle=col;q.beginPath();q.moveTo(xx,h+1);q.lineTo(xx+8,h-10);q.lineTo(xx+w*.4,h-14);q.lineTo(xx+w-10,h-9);q.lineTo(xx+w,h+1);q.closePath();q.fill();
      const base=h-12;q.fillStyle=dk;for(let k=0;k<4;k++){const cx=xx+16+k*(w-32)/3,ch=8+(h32('rc'+ri+k)%14);q.fillRect(cx,base-ch,3.2,ch+2);if(k%2===0){q.fillRect(cx-1,base-ch-1.6,5.2,1.6);}}
      const ax=xx+w*.55;q.beginPath();q.moveTo(ax,base+2);q.lineTo(ax,base-18);q.lineTo(ax+18,base-18);q.lineTo(ax+18,base+2);q.lineTo(ax+14,base+2);q.lineTo(ax+14,base-8);q.quadraticCurveTo(ax+9,base-15,ax+4,base-8);q.lineTo(ax+4,base+2);q.closePath();q.fill();
      q.fillRect(xx+w*.2,base-26,7,28);q.fillRect(xx+w*.2-1,base-28,2.4,3);q.fillRect(xx+w*.2+3.4,base-29.6,2.4,4.6);
      if(lit){q.fillStyle='#FFC46A';q.fillRect(xx+w*.2+2.4,base-18,2,2.4);}},x0);});}
  else{[[30,60,9],[180,44,7],[330,70,11],[500,50,8]].forEach(([x0,w,hh],ii)=>wrapX(xx=>{q.fillStyle=col;q.beginPath();q.moveTo(xx,h+1);q.quadraticCurveTo(xx+w*.2,h-hh,xx+w*.5,h-hh);q.quadraticCurveTo(xx+w*.8,h-hh,xx+w,h+1);q.closePath();q.fill();
      q.fillStyle=P.beach;q.fillRect(xx+2,h-1.4,w-4,1.4);for(let k=0;k<3;k++){const px=xx+w*(.25+k*.25),ph=10+(h32('ip'+ii+k)%7);const sv=palm;try{q.save();q.translate(0,0);sv.call(null,q,px,h-hh*.7,ph,k*400);q.restore();}catch(e){}}},x0));}}
function artVoyBackdrop(c){const y0=ART_HZ.voyage,mode=artMode(),P=artPal(mode),snow=artSnowy()||THEME.festive==='christmas',lit=artLitNow()||THEME.weather==='storm';const k=`${mode}_${THEME.weather}_${snow?1:0}${artBlendKey()}`;
  const far=artStrip(c,'vfar'+k,VOY_W,80,q=>voyFar(q,80,P.far,snow,'vfar'));stripLoop(c,far,VOY_W,80,y0,VOY.off*.12,1);artFog(c,y0,32,P.fog,.55);
  const mid=artStrip(c,'vmid'+k,VOY_W,60,q=>voyFar(q,60,P.mid,snow,'vmid'));stripLoop(c,mid,VOY_W,60,y0,VOY.off*.3,1);artFog(c,y0+1,14,P.fog,.45);
  const lk=VOY.lk;const i0=lk&&lk.id?h32(String(lk.id))%VOY_BIOMES.length:0;const seg=Math.floor(VOY.el/VOY_SEG),into=VOY.el%VOY_SEG;
  const cur=VOY_BIOMES[(i0+seg)%VOY_BIOMES.length],nxt=VOY_BIOMES[(i0+seg+1)%VOY_BIOMES.length];const fade=Math.max(0,(into-(VOY_SEG-VOY_FADE))/VOY_FADE);
  const nearOf=b=>artStrip(c,'vnear'+b+k,VOY_W,62,q=>voyNear(q,b,62,P,snow,lit));
  stripLoop(c,nearOf(cur),VOY_W,62,y0+.5,VOY.off,1-fade);if(fade>0)stripLoop(c,nearOf(nxt),VOY_W,62,y0+.5,VOY.off,fade);
  VOY.biome=fade>.5?nxt:cur;VOY.cvCur=nearOf(cur);VOY.cvNxt=fade>0?nearOf(nxt):null;VOY.fade=fade;VOY.k=k;}
addLayer('sea','artVoyRefl',(c,t,ctx)=>{if(!VOY.lk||!VOY.cvCur)return;const y0=ART_HZ.voyage;
  stripLoop(c,VOY.cvCur,VOY_W,62,y0+1,VOY.off,.22*(1-VOY.fade),true);if(VOY.cvNxt)stripLoop(c,VOY.cvNxt,VOY_W,62,y0+1,VOY.off,.22*VOY.fade,true);},{scenes:['voyage'],z:-8,when:()=>isArtLook()});
// lightning over the far peaks on a stormy voyage
addLayer('fx','artVoyStorm',(c,t)=>{const k=Math.floor(t/2600),u=(t%2600);if(h32('vl'+k)%3!==0||u>160)return;c.fillStyle=`rgba(230,225,255,${.28*(1-u/160)})`;c.fillRect(-90,-300,W+180,H+600);
  let x=60+h32('vx'+k)%200,y=-10;c.strokeStyle='rgba(245,240,255,.9)';c.lineWidth=1;c.beginPath();c.moveTo(x,y);while(y<ART_HZ.voyage-10){x+=(h32('vj'+k+y)%11)-5;y+=8;c.lineTo(x,y);}c.stroke();},{scenes:['voyage'],z:11,when:()=>isArtLook()&&THEME.weather==='storm'});

/* ============================== ART STAGE C: FOES, CHARACTERS, SHIPS EVERYWHERE ==============================
   Sea foes become painted silhouettes with a rim of light on their top edge and glowing eyes that still blink, glare
   and go dizzy as they lose HP; a hit still flashes them white. The captains, pets and Gary keep their own designs
   (they are who they are) but now take the scene's light: cool blue at night, rose at sunset, grey in a storm.
   Shop and wardrobe pictures show the new ship. Everything works through transforms, so ships rocking, monsters
   rising out of the water and the Harbour's zoomed views all line up. */
// one offscreen canvas per job, sized to what that job usually needs, and only the used corner is cleared
const ART_OFF=new Map();function artOffCanvas(k,w,h){let e=ART_OFF.get(k);if(!e){const cv=document.createElement('canvas');e={cv,q:cv.getContext('2d')};ART_OFF.set(k,e);}const cv=e.cv;
  if(cv.width<w||cv.height<h||cv.width>w*2.5+64||cv.height>h*2.5+64){cv.width=Math.ceil(w*1.15)+8;cv.height=Math.ceil(h*1.15)+8;}const q=e.q;q.setTransform(1,0,0,1,0,0);q.globalCompositeOperation='source-over';q.globalAlpha=1;q.clearRect(0,0,w+2,h+2);return [cv,q];}
// draw into an offscreen canvas in device pixels, keeping the caller's full transform (scale, rotation, translation)
const ART_MAXPX=150000;
function artDevBox(c,lx,ly,lw,lh,maxpx){const m=c.getTransform();const pts=[[lx,ly],[lx+lw,ly],[lx,ly+lh],[lx+lw,ly+lh]].map(([x,y])=>[m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f]);
  const x0=Math.floor(Math.min(...pts.map(p=>p[0]))),y0=Math.floor(Math.min(...pts.map(p=>p[1]))),x1=Math.ceil(Math.max(...pts.map(p=>p[0]))),y1=Math.ceil(Math.max(...pts.map(p=>p[1])));const w=x1-x0,h=y1-y0;const f=Math.min(1,Math.sqrt((maxpx||ART_MAXPX)/Math.max(1,w*h)));return {m,x0,y0,w,h,sc:Math.hypot(m.a,m.b),f,ow:Math.max(1,Math.ceil(w*f)),oh:Math.max(1,Math.ceil(h*f))};}
let ART_EYES=null;
{const _bf=bossFace;bossFace=function(c,cx,cy,r,ratio,t,look){if(ART_EYES){const m=c.getTransform(),er=Math.max(1.2,r/7.5);[-r*.32,r*.32].forEach(dx=>{const x=cx+dx,y=cy;ART_EYES.push({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f,r:er*Math.hypot(m.a,m.b),blink:(t%3700)<130,dizzy:ratio<.25});});}return _bf.apply(this,arguments);};}
{const _kf=bkFace;bkFace=function(c,K,fx,fy,fr,ratio,t,mood){if(ART_EYES){const m=c.getTransform(),n=K.eyes||2,er=Math.max(1,fr/6.8);const xs=n===1?[0]:n===3?[-fr*.42,0,fr*.42]:[-fr*.32,fr*.32];
    xs.forEach((dx,k)=>{const x=fx+dx,y=fy-(n===3&&k===1?fr*.12:0);ART_EYES.push({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f,r:er*(n===1?1.7:1)*Math.hypot(m.a,m.b),blink:(t%(3300+(K.seed||0)%900))<120,dizzy:ratio<.25});});}return _kf.apply(this,arguments);};}
function artSilhouette(c,box,draw,o={}){const b=artDevBox(c,...box,o.maxpx||70000);if(b.w<2||b.h<2||b.w>3000||b.h>3000){draw(c);return;}const P=artPal();
  const f=b.f,ow=b.ow,oh=b.oh;const [A,qa]=artOffCanvas('sA',ow,oh);qa.setTransform(b.m.a*f,b.m.b*f,b.m.c*f,b.m.d*f,(b.m.e-b.x0)*f,(b.m.f-b.y0)*f);ART_EYES=[];try{draw(qa);}catch(e){}const eyes=ART_EYES||[];ART_EYES=null;
  const [B,qb]=artOffCanvas('sB',ow,oh);qb.drawImage(A,0,0,ow,oh,0,0,ow,oh);qb.globalCompositeOperation='source-atop';qb.fillStyle=o.col||shadeHex(P.near,.6);qb.globalAlpha=o.a==null?.84:o.a;qb.fillRect(0,0,ow,oh);qb.globalAlpha=1;qb.globalCompositeOperation='source-over';
  const [Cr,qc]=artOffCanvas('sC',ow,oh);qc.drawImage(A,0,0,ow,oh,0,0,ow,oh);qc.globalCompositeOperation='source-in';const rim=SUN&&SUN.night?'200,215,255':SUN?SUN.col:'255,240,210';qc.fillStyle=`rgb(${rim})`;qc.fillRect(0,0,ow,oh);qc.globalCompositeOperation='source-over';
  c.save();c.setTransform(1,0,0,1,0,0);const k=Math.max(1,b.sc*.7);c.globalAlpha=.55;c.drawImage(Cr,0,0,ow,oh,b.x0-k,b.y0-k,b.w,b.h);c.globalAlpha=1;c.drawImage(B,0,0,ow,oh,b.x0,b.y0,b.w,b.h);
  if(o.flash){c.globalAlpha=.75;c.drawImage(Cr,0,0,ow,oh,b.x0,b.y0,b.w,b.h);c.globalAlpha=1;}
  const tm=performance.now();eyes.forEach((e,i)=>{if(e.blink)return;const fl=e.dizzy?(.4+.6*Math.abs(Math.sin(tm/120+i))):1;const ex=b.x0+e.x/f,ey=b.y0+e.y/f;const er=Math.max(1,e.r/f*.8);
    const g=c.createRadialGradient(ex,ey,0,ex,ey,er*5);g.addColorStop(0,`rgba(255,200,110,${.55*fl})`);g.addColorStop(1,'rgba(255,200,110,0)');c.fillStyle=g;c.fillRect(ex-er*5,ey-er*5,er*10,er*10);
    c.fillStyle=`rgba(255,226,150,${fl})`;c.beginPath();c.arc(ex,ey,er,0,TAU);c.fill();c.fillStyle=`rgba(255,250,230,${fl})`;c.beginPath();c.arc(ex-er*.25,ey-er*.25,er*.4,0,TAU);c.fill();});
  c.restore();}
const artFoeScene=()=>ART_EYES===null&&isArtLook()&&!!THEME.scene&&['harbour','voyage'].includes(THEME.scene);
{const _db2=drawBoss;drawBoss=function(c,boss,bx,by,r,ratio,t,flash,...rest){if(!artFoeScene())return _db2.call(this,c,boss,bx,by,r,ratio,t,flash,...rest);const self=this;const pad=r*2.4;
  artSilhouette(c,[bx-pad,by-pad,pad*2,pad*2.1],q=>_db2.call(self,q,boss,bx,by,r,ratio,t,false,...rest),{flash});};}
if(typeof drawMonster==='function'){const _dm=drawMonster;drawMonster=function(c,mon,x,y,r,ratio,t,flash,elite){if(!artFoeScene())return _dm.apply(this,arguments);const self=this;const pad=r*2.4;
  artSilhouette(c,[x-pad,y-pad,pad*2,pad*2.1],q=>_dm.call(self,q,mon,x,y,r,ratio,t,false,elite),{flash,a:elite?.78:.84});};}
// characters keep their colours but take the scene's light
function artLightCol(){if(!isArtLook()||!THEME.scene)return null;if(THEME.scene==='tavern')return ['#B0602A',.1];if(THEME.weather==='storm')return ['#2A2840',.28];const m=artMode();return {night:['#1A2560',.34],sunset:['#7A2A5A',.14],dawn:['#6A4A8A',.12],gold:['#A0502A',.1]}[m]||null;}
// the painted finish: soft light from the top left, shade towards the bottom right, the scene's light, and a faint rim of light in scenes
function artLit(c,box,draw,o={}){if(!isArtLook()){draw(c);return;}const L_=artLightCol();const b=artDevBox(c,...box);if(b.w<2||b.h<2||b.w>2200||b.h>2200){draw(c);return;}
  const f=b.f,ow=b.ow,oh=b.oh;const slot=o.slot||'lit';const [A,qa]=artOffCanvas(slot,ow,oh);qa.setTransform(b.m.a*f,b.m.b*f,b.m.c*f,b.m.d*f,(b.m.e-b.x0)*f,(b.m.f-b.y0)*f);try{draw(qa);}catch(e){}qa.setTransform(1,0,0,1,0,0);
  const inScene=!!THEME.scene;let rimCv=null;
  if(inScene&&!o.noRim){const [Cr,qc]=artOffCanvas(slot+'r',ow,oh);qc.drawImage(A,0,0,ow,oh,0,0,ow,oh);qc.globalCompositeOperation='source-in';const rim=THEME.scene==='tavern'?'255,190,120':SUN&&SUN.night?'190,205,255':SUN?SUN.col:'255,240,210';qc.fillStyle=`rgb(${rim})`;qc.fillRect(0,0,ow,oh);qc.globalCompositeOperation='source-over';rimCv=Cr;}
  qa.globalCompositeOperation='source-atop';const g=qa.createLinearGradient(0,0,ow*.35,oh);g.addColorStop(0,'rgba(255,246,228,.16)');g.addColorStop(.5,'rgba(255,246,228,0)');g.addColorStop(1,'rgba(30,22,60,.2)');qa.fillStyle=g;qa.fillRect(0,0,ow,oh);
  if(L_){qa.fillStyle=L_[0];qa.globalAlpha=L_[1];qa.fillRect(0,0,ow,oh);qa.globalAlpha=1;}qa.globalCompositeOperation='source-over';
  c.save();c.setTransform(1,0,0,1,0,0);if(rimCv){const k=Math.max(.8,b.sc*.45);c.globalAlpha=.3;c.drawImage(rimCv,0,0,ow,oh,b.x0-k,b.y0-k,b.w,b.h);c.globalAlpha=1;}c.drawImage(A,0,0,ow,oh,b.x0,b.y0,b.w,b.h);c.restore();}
{const _dk=drawKeeper;drawKeeper=function(c,x,y,pid,pl,t,opts){const self=this,a=arguments;if(!isArtLook()||ART_EYES!==null)return _dk.apply(self,a);artLit(c,[x-8,y-10,26,26],q=>_dk.call(self,q,x,y,pid,pl,t,opts),{slot:'keeper'});};}
{const _dp=drawPet;drawPet=function(c,pet,x,y,t,s=1,opts={}){const self=this,a=arguments;if(!isArtLook()||ART_EYES!==null)return _dp.apply(self,a);
  // a little life: breathing, and now and then a hop (in scenes only)
  let sy=1,hop=0;if(THEME.scene&&!opts.still&&!THEME.reduced&&pet){const seed=h32(pet.id||'p')%5000;sy=1+Math.sin(t/650+seed)*.035;const u=((t+seed)%7400)/7400;if(u<.06)hop=Math.sin(u/.06*Math.PI)*3.2*s;}
  artLit(c,[x-16*s,y-24*s,32*s,28*s],q=>{if(sy!==1||hop){q.save();q.translate(x,y-hop);q.scale(1+(1-sy)*.6,sy);q.translate(-x,-y);_dp.call(self,q,pet,x,y,t,s,opts);q.restore();}else _dp.call(self,q,pet,x,y,t,s,opts);},{slot:'pet'});};}
{const _dg=drawGull;drawGull=function(c,x,y,t){const self=this,a=arguments;if(!isArtLook()||ART_EYES!==null)return _dg.apply(self,a);artLit(c,[x-2,y-3,15,12],q=>_dg.call(self,q,x,y,t),{slot:'gull'});};}
{const _dn=drawNest;drawNest=function(c,x,y,t,coins,gary){const self=this,a=arguments;if(!isArtLook()||ART_EYES!==null)return _dn.apply(self,a);artLit(c,[x-10,y-14,20,19],q=>_dn.call(self,q,x,y,t,coins,gary),{slot:'nest'});};}

/* ---------- the painted finish on everything else with a face or fins ---------- */
const artPass=()=>isArtLook()&&ART_EYES===null;
{const _df=drawFish;drawFish=function(c,f,x,y,s,t=0,sil=false,v=''){const self=this,a=arguments;if(!artPass()||sil)return _df.apply(self,a);
  const wig=THEME.scene&&!THEME.reduced?Math.sin(t/180+(x||0))*.07:0;artLit(c,[x-18*s,y-14*s,36*s,28*s],q=>{if(wig){q.save();q.translate(x,y);q.rotate(wig);q.translate(-x,-y);_df.call(self,q,f,x,y,s,t,sil,v);q.restore();}else _df.call(self,q,f,x,y,s,t,sil,v);},{noRim:!THEME.scene,slot:'fish'});};}
{const _dm2=drawMoth;drawMoth=function(c,x,y,stage,t,acc,fl){const self=this,a=arguments;if(!artPass())return _dm2.apply(self,a);artLit(c,[x-9,y-11,18,18],q=>_dm2.apply(self,[q,...[].slice.call(a,1)]),{slot:'moth'});};}
{const _dt=drawTrader;drawTrader=function(c,x,y,t,s=1){const self=this,a=arguments;if(!artPass())return _dt.apply(self,a);artLit(c,[x-12*s,y-24*s,24*s,27*s],q=>_dt.call(self,q,x,y,t,s),{slot:'trader'});};}
{const _dd=drawDecor;drawDecor=function(c,id,x,y,t){const self=this,a=arguments;if(!artPass()||!THEME.scene)return _dd.apply(self,a);artLit(c,[x-30,y-50,60,54],q=>_dd.call(self,q,id,x,y,t),{slot:'decor'});};}
{const _bl=drawBill;drawBill=function(c,x,y,t){const self=this,a=arguments;if(!artPass())return _bl.apply(self,a);artLit(c,[x-15,y-12,36,54],q=>_bl.call(self,q,x,y,t),{slot:'bill'});};}
{const _ct=drawCat;drawCat=function(c,x,y,t){const self=this,a=arguments;if(!artPass())return _ct.apply(self,a);artLit(c,[x-15,y-15,32,18],q=>_ct.call(self,q,x,y,t),{slot:'cat'});};}

/* ---------- the Rusty Anchor, painted: a misty view through the window, firelight that flickers across the room,
   glowing candles and lanterns, a cool shaft of window light with dust drifting in it, deep shadows in the corners ---------- */
{const _dtv=drawTavern;drawTavern=function(cv,t){if(!isArtLook())return _dtv.apply(this,arguments);const prev=THEME.scene;THEME.scene='tavern';try{_dtv.apply(this,arguments);}finally{THEME.scene=prev;}
  const c=cv.getContext('2d');const s=cv.width/TVW;c.setTransform(s,0,0,s,0,0);const ph=tvPhase();const mode=ph==='dusk'?'sunset':ph;const P=artPal(mode==='night'?'night':mode);const lv=(typeof fireLevel==='function'?fireLevel():.6);const sp=THEME.reduced?.35:1;
  const winter=THEME.season==='winter',storm=THEME.weather==='storm';
  // the view through the window
  const wx=108,wy=28,ww=42,wh=56;c.save();c.beginPath();c.rect(wx,wy,ww,wh);c.clip();const g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,P.sky[0]);g.addColorStop(.6,P.sky[1]);g.addColorStop(1,P.sky[2]);c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  if(mode==='night'){for(let i=0;i<14;i++)disc(c,wx+(i*13.7)%ww,wy+(i*7.3)%(wh*.5),.35,'rgba(255,255,255,.8)');c.fillStyle='#F4F0DA';c.beginPath();c.arc(wx+30,wy+12,3,-Math.PI/2,Math.PI/2,true);c.ellipse(wx+30,wy+12,2.3,3,0,Math.PI/2,-Math.PI/2,false);c.fill();}
  else glowAt(c,wx+30,wy+wh*.62,16,SUN?SUN.col:'255,230,190',.5);
  layerCache(c,'tvview_'+mode+(winter?'w':''),wx,wy+16,ww,wh-16,q=>{artFacets(q,wy+wh*.72,[[wx+6,14,10,.3],[wx+22,20,12,.7],[wx+38,13,9,.5]],P.far,winter);artFog(q,wy+wh*.72,8,P.fog,.5);
    q.fillStyle=P.sea[1];q.fillRect(wx,wy+wh*.72,ww,wh*.28);q.fillStyle=shadeHex(P.isl,.8);q.beginPath();q.moveTo(wx,wy+wh*.74);q.quadraticCurveTo(wx+10,wy+wh*.62,wx+18,wy+wh*.74);q.closePath();q.fill();});
  const n=storm?44:winter?24:18;for(let i=0;i<n;i++){const p=((t*sp/(winter&&!storm?2600:650))+i*.137)%1;const x=wx+((i*29.3)%ww)+(winter&&!storm?Math.sin(t/500+i)*2:0),y=wy+p*wh;if(winter&&!storm)disc(c,x,y,.7,'rgba(255,255,255,.9)');else line(c,x,y,x-1.4,y+4.4,'rgba(210,225,255,.6)',.35);}
  const st=c.createLinearGradient(0,wy+wh*.55,0,wy+wh);st.addColorStop(0,'rgba(255,255,255,0)');st.addColorStop(1,'rgba(255,255,255,.22)');c.fillStyle=st;c.fillRect(wx,wy,ww,wh);c.restore();
  R(c,wx+ww/2-1,wy,2,wh,'#2E1C12');R(c,wx,wy+wh/2-1,ww,2,'#2E1C12');
  // shadows: corners and ceiling fall away into darkness, the fire side stays warm
  c.save();c.globalCompositeOperation='multiply';const fx=50,fy=128;const sh=c.createRadialGradient(fx,fy,20,fx+80,fy-10,300);sh.addColorStop(0,'#FFFFFF');sh.addColorStop(.4,'#E2CCC4');sh.addColorStop(1,mode==='night'?'#463A62':'#5E4E6E');c.fillStyle=sh;c.fillRect(0,0,TVW,TVH);
  const top=c.createLinearGradient(0,0,0,40);top.addColorStop(0,'#8A7A90');top.addColorStop(1,'#FFFFFF');c.fillStyle=top;c.fillRect(0,0,TVW,40);c.restore();
  // firelight, flickering
  const fl=.75+.15*Math.sin(t*sp/90)+.1*Math.sin(t*sp/37+1.3)+.06*Math.sin(t*sp/13);c.save();c.globalCompositeOperation='lighter';
  const fg=c.createRadialGradient(fx,fy,6,fx,fy,150+30*lv);fg.addColorStop(0,`rgba(255,150,70,${(.26+.12*lv)*fl})`);fg.addColorStop(.5,`rgba(255,120,60,${.08*fl})`);fg.addColorStop(1,'rgba(255,120,60,0)');c.fillStyle=fg;c.fillRect(0,0,TVW,TVH);
  // candles, the lanterns over the bar
  [[14,70],[86,70],[192,110],[300,110]].forEach(([x,y],i)=>{const a=.4+.1*Math.sin(t*sp/(150+i*23)+i);glowAt(c,x,y,16,'255,200,110',a);});
  [[210,8],[250,8],[290,8]].forEach(([x,y],i)=>{const sw=Math.sin(t*sp/1300+i)*1.2;line(c,x,0,x+sw,y,'rgba(60,40,30,.9)',.5);c.globalCompositeOperation='source-over';rr(c,x+sw-2.2,y,4.4,6,1,'#FFC46A');c.globalCompositeOperation='lighter';glowAt(c,x+sw,y+3,22,'255,190,100',.35+.05*Math.sin(t/200+i));});
  // a shaft of cool light from the window, with dust drifting in it
  const cool=mode==='night'?'150,170,255':'210,225,255';c.fillStyle=`rgba(${cool},${mode==='night'?.06:.09})`;c.beginPath();c.moveTo(wx,wy);c.lineTo(wx+ww,wy);c.lineTo(wx+ww+40,150);c.lineTo(wx+20,150);c.closePath();c.fill();
  for(let i=0;i<16;i++){const u=((t*sp/9000)+i*.0625)%1;const x=wx+10+((i*23)%40)+u*28+Math.sin(t/1700+i)*3,y=wy+20+((i*37)%90)*(.4+.6*u);const a=.35+.35*Math.sin(t/600+i*2);if(a<.1)continue;c.fillStyle=`rgba(255,240,220,${a*.6})`;c.fillRect(x,y,.6,.6);}
  c.restore();
  // a curl of smoke from the fire and steam over the mugs
  for(let k=0;k<4;k++){const q=((t*sp/3000)+k/4)%1;disc(c,fx+Math.sin(q*6+k)*4,fy-34-q*40,1.6+q*3,`rgba(200,190,190,${.16*(1-q)})`);}
  // soft vignette
  const v=c.createRadialGradient(TVW/2,TVH*.55,TVH*.45,TVW/2,TVH*.55,TVH*1.05);v.addColorStop(0,'rgba(20,10,20,0)');v.addColorStop(1,'rgba(20,10,20,.35)');c.fillStyle=v;c.fillRect(0,0,TVW,TVH);};}

/* ---------- the hideout: the island keeps its pieces, graded into the painted light of the hour ---------- */
{const _di=drawIslet;drawIslet=function(c,t,pid){const r=_di.apply(this,arguments);if(!isArtLook()||!G)return r;const m=artMode();const storm=THEME.weather==='storm';
  const tint=storm?'#8A8AA0':{night:'#4A5A9A',sunset:'#E8A8B8',dawn:'#E0C4DA',gold:'#F2C8A0'}[m]||'#E8EEF6';c.save();c.globalCompositeOperation='multiply';
  const g=c.createLinearGradient(0,96,0,H);g.addColorStop(0,'#FFFFFF');g.addColorStop(.25,tint);g.addColorStop(1,shadeHex(tint,.86));c.fillStyle=g;c.fillRect(-90,96,W+180,H-96+VIEW_EXT.bot+40);c.restore();
  const v=c.createRadialGradient(W/2,H*.6,H*.4,W/2,H*.6,H*1.05);v.addColorStop(0,'rgba(20,16,40,0)');v.addColorStop(1,`rgba(20,16,40,${m==='night'?.3:.16})`);c.fillStyle=v;c.fillRect(-90,-300,W+180,H+600);return r;};}

/* ============================== ART STAGE F: PICTURES, POLISH AND SPEED ============================== */
// a small painted scene for pictures: sky, sun or moon, faceted peaks, fog, sea with a light path
function artPortraitBg(c,w,h,hz,mode,key){const P=artPal(mode);const night=mode==='night';const g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,P.sky[0]);g.addColorStop(.6,P.sky[1]);g.addColorStop(1,P.sky[2]);c.fillStyle=g;c.fillRect(0,0,w,hz+1);
  const sx=w*.5,sy=hz-12;if(night){for(let i=0;i<40;i++){c.fillStyle=`rgba(255,255,255,${.3+(h32('ps'+i)%50)/100})`;c.fillRect(h32('px'+i)%w,h32('py'+i)%(hz-10),.6,.6);}glowAt(c,w*.78,hz*.25,26,'200,215,255',.3);disc(c,w*.78,hz*.25,5,'#F4F0DA');disc(c,w*.78+2.2,hz*.25-1.4,4.6,P.sky[0]);}
  else{glowAt(c,sx,sy,w*.45,mode==='day'?'255,250,215':'255,214,160',.5);disc(c,sx,sy,w*.06,mode==='day'?'#FFF6D6':'#FFE2A6');}
  const snow=artSnowy();layerCache(c,`pbg_${key}_${mode}_${snow?1:0}`,0,hz-60,w,62,q=>{artFacets(q,hz,artPeaks(key+'f',6,-20,w+20,22,44,22,40),P.far,snow);artFog(q,hz,24,P.fog,.55);artFacets(q,hz,artPeaks(key+'m',5,-20,w+20,10,24,18,30),P.mid,snow);artFog(q,hz+1,10,P.fog,.45);});
  const sg=c.createLinearGradient(0,hz,0,h);sg.addColorStop(0,P.sea[0]);sg.addColorStop(.35,P.sea[1]);sg.addColorStop(1,P.sea[2]);c.fillStyle=sg;c.fillRect(0,hz,w,h-hz);
  const col=night?'225,232,255':mode==='day'?'255,250,215':'255,214,160';const px=night?w*.78:sx;for(let i=0;i<12;i++){const yy=hz+2+i*i*.35+i*1.4;if(yy>h)break;const ww=(4+i*3)*(.7+.3*Math.sin(i*1.9));c.fillStyle=`rgba(${col},${(night?.5:.55)*(1-i/14)})`;c.fillRect(px-ww/2,yy,ww,.9);}
  for(let i=0;i<24;i++){const dep=(h32('pr'+i)%1000)/1000;c.fillStyle=rgbaOf(P.rip,.12+dep*.12);c.fillRect(h32('prx'+i)%w,hz+3+dep*dep*(h-hz),5+dep*14,.6);}}
// the Bestiary portrait: a painted sea behind the boss, who keeps their colours but gets the painted shading
function artBestiary(c,b,t){artPortraitBg(c,240,150,118,'sunset','best');artLit(c,[60,30,120,100],q=>drawBoss(q,b,120,92,30,1,t,false,b.kit&&b.kit.floats?null:118),{slot:'best',noRim:true});}
// the boss intro: a sunset sea, and the boss rising out of it as a silhouette with glowing eyes
function artIntro(c,b,t,ease){c.clearRect(0,0,300,200);artPortraitBg(c,300,200,150,'sunset','intro');const by=200-ease*95;
  const prev=THEME.scene;THEME.scene='intro';try{artSilhouette(c,[150-110,by-110,220,190],q=>drawBoss(q,b,150,by,42,1,t,false,b.kit&&b.kit.floats?null:170),{a:.86});}finally{THEME.scene=prev;}
  c.fillStyle=rgbaOf(artPal('sunset').sea[1],.85);c.fillRect(0,170,300,30);for(let i=0;i<3;i++){const q=((t/900)+i/3)%1;c.strokeStyle=`rgba(255,220,180,${.5*(1-q)})`;c.lineWidth=.7;c.beginPath();c.ellipse(150,170,40*(1+q*.8),4*(1+q),0,0,TAU);c.stroke();}}
// the Herald's picture: the same painted scene, printed in sepia ink on newsprint
function artHillo(c,D,won){const P='sunset';artPortraitBg(c,320,140,104,P,'herald');const r=won?26:30;
  const prev=THEME.scene;THEME.scene='intro';try{artSilhouette(c,[210-90,(won?96:78)-80,180,150],q=>drawBoss(q,D.boss,210,won?96:78,r,won?.05:.7,1200,false,D.boss.kit&&D.boss.kit.floats?null:110),{a:.88});
    const pl=S.players[G.P[0]]||{};THEME.scene='ship';drawShip(c,80,124,.62,pl,1200,{pid:G.P[0],phase:0});}catch(e){}finally{THEME.scene=prev;}
  if(won)for(let i=0;i<10;i++)disc(c,190+(i*13)%46,98-(i*7)%40,1+(i%3)*.6,'rgba(255,255,255,.75)');drawGull(c,40,26,0);
  c.save();c.globalCompositeOperation='saturation';c.fillStyle='#808080';c.fillRect(0,0,320,140);c.globalCompositeOperation='multiply';c.fillStyle='#EAD9B6';c.fillRect(0,0,320,140);
  c.globalCompositeOperation='screen';c.fillStyle='#2A2012';c.fillRect(0,0,320,140);c.restore();
  for(let i=0;i<60;i++){c.strokeStyle='rgba(60,45,25,.07)';c.lineWidth=.5;c.beginPath();c.moveTo(0,i*2.4);c.lineTo(320,i*2.4+((i%2)?.6:-.6));c.stroke();}}
// Vault relics: soft light, shade and a little sparkle
{const _drR=drawRelic;drawRelic=function(cv){_drR.apply(this,arguments);if(!isArtLook()||cv.dataset.found!=='1')return;const c=cv.getContext('2d');c.save();c.setTransform(4,0,0,4,0,0);c.globalCompositeOperation='source-atop';
  const g=c.createLinearGradient(0,0,10,24);g.addColorStop(0,'rgba(255,248,230,.25)');g.addColorStop(.5,'rgba(255,248,230,0)');g.addColorStop(1,'rgba(40,28,60,.18)');c.fillStyle=g;c.fillRect(0,0,24,24);c.globalCompositeOperation='source-over';
  glowAt(c,12,11,8,'255,226,150',.25);line(c,16,5,16,8,'rgba(255,255,255,.9)',.4);line(c,14.5,6.5,17.5,6.5,'rgba(255,255,255,.9)',.4);c.restore();};}

/* ---------- smooth changes of light: for twenty minutes around sunrise and sunset the colours blend instead of switching ---------- */
const ART_BLEND={key:'',pal:null};
function artPalBlend(mode){try{const m=L().min,s=sunTimes();const B=[[s.rise-35,'night','dawn'],[s.rise+55,'dawn','day'],[s.set-55,'day','sunset'],[s.set+40,'sunset','night']];
    for(const [b,from,to] of B){if(Math.abs(m-b)<10&&(mode===from||mode===to)){const k=Math.round(((m-b+10)/20)*10)/10;return {from,to,k};}}}catch(e){}return null;}
function mixPal(A,B,k){const out={};for(const key in A){const a=A[key],b=B[key];if(Array.isArray(a))out[key]=a.map((v,i)=>mixHex(v,b[i],k));else if(typeof a==='string'&&a[0]==='#')out[key]=mixHex(a,b,k);else out[key]=k<.5?a:b;}return out;}
{const _ap=artPal;artPal=function(mode){const md=mode||artMode();const base=_ap.call(this,md);if(THEME.weather==='storm'||mode&&mode!==artMode())return base;const bl=artPalBlend(md);if(!bl||bl.from===bl.to)return base;
  const key=bl.from+bl.to+bl.k+THEME.season+THEME.festive;if(ART_BLEND.key===key)return ART_BLEND.pal;const A=_ap.call(this,bl.from),Bp=_ap.call(this,bl.to);ART_BLEND.key=key;ART_BLEND.pal=mixPal(A,Bp,bl.k);return ART_BLEND.pal;};}
const artBlendKey=()=>{const bl=artPalBlend(artMode());return bl?`_b${bl.from}${bl.k}`:'';};

/* ---------- drifting mist over the water ---------- */
addLayer('sea','artMist',(c,t,ctx)=>{const y0=(ctx&&ctx.y0)||108;const P=artPal();const q=THEME.reduced?.3:1;for(let i=0;i<5;i++){const sp=40+i*12;const x=((((h32('mw'+i)%1000)/1000)*(W+200)+t*q/sp)%(W+200))-100;const y=y0+3+i*3.2+Math.sin(t/3000+i)*1.2;
  const g=c.createRadialGradient(x,y,0,x,y,60);g.addColorStop(0,rgbaOf(P.fog,.13));g.addColorStop(1,rgbaOf(P.fog,0));c.save();c.translate(x,y);c.scale(1,.12);c.translate(-x,-y);c.fillStyle=g;c.fillRect(x-60,y-60,120,120);c.restore();}},{z:-6,when:()=>isArtLook()&&THEME.weather!=='storm'});

/* the ghost of your best run sails in the distance, on the horizon behind everything else, so it never covers the monster or your line */
addLayer('sea','artGhost',(c,t)=>{const g=typeof GSHIP!=='undefined'&&GSHIP.drawAt;if(!g||performance.now()-g.at>400)return;const y=ART_HZ.voyage+10;
  glowAt(c,g.gx,y-14,26,'159,242,224',.2+.05*Math.sin(t/700));c.save();c.globalAlpha=.55+.08*Math.sin(t/900);artTinted(c,g.gx-30,y-50,72,62,'#A8F5E6',.72,q=>drawShip(q,g.gx,y,.5,{...(S.players[S.me]||{}),hull:'hull_ghost'},t,{captain:false,phase:2}));c.restore();},{scenes:['voyage'],z:-4,when:()=>isArtLook()});
