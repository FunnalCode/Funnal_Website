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
  const key=`artbd_${scene}_${mode}_${THEME.weather}_${snow?1:0}`;
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
  if(ART_HZ[THEME.scene])artBackdrop(c,THEME.scene);
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
  pl=pl||{};const hull=it(pl.hull||SHIP_DEFAULT.hull)||it('hull_oak');const sail=it(pl.sail||SHIP_DEFAULT.sail)||it('sail_canvas');const P=artPal();const night=!!(SUN&&SUN.night);
  const lit=artLitNow()||THEME.weather==='storm';const ph=opts.phase||0;const gild=pl.effect==='goldlh'||hull.gold;const fire=opts.firing>0?opts.firing:0,kick=fire*fire;
  const rock=Math.sin(t/900+ph)*.04+Math.sin(t/410+ph*2)*.012-kick*.045,bob=Math.sin(t/650+ph)*1.3+Math.sin(t/270+ph)*.3;
  const shadow=shadeHex(P.isl,.78);const hc=mixHex(hull.col||'#A8704A',shadow,night?.55:.4),hd=shadeHex(hc,.7),hlc=shadeHex(hc,1.32),wood=mixHex('#3A2418',shadow,.45);
  let scol=mixHex(sail.col||'#FFFCF2',P.fog,.1);if(night)scol=mixHex(scol,'#3A4B82',.38);else if(SUN&&SUN.mode!=='day')scol=mixHex(scol,P.sky[2],.14);const sdk=shadeHex(scol,.86);
  const lights='#FFC46A',lampOn=lit;const billow=wind(t)*2;
  c.save();c.translate(x-kick*2.2*s,y+bob*s*.4);
  // reflection: a dark, squashed mirror image and long streaks under the lights
  c.save();c.scale(s,s);c.save();c.globalAlpha=.26;c.translate(0,4.6);c.scale(.45,-.45*.72);c.fillStyle=hc;c.fill(artHullPath());c.fillStyle=wood;[[-42,-98],[6,-152],[52,-102]].forEach(([mx,top])=>c.fillRect(mx-1.6,top,3.2,-14-top));c.restore();
  if(lampOn){[[-21.6,7],[-29.7,3],[45,3]].forEach(([lx,wd],k)=>{for(let i=0;i<7;i++){const ww=wd*(.6+.5*Math.sin(t/300+i*1.7+k));c.fillStyle=`rgba(255,196,106,${.55-i*.07})`;c.fillRect(lx-ww/2+Math.sin(t/400+i)*.8,4+i*1.6,ww,.7);}});}
  else for(let i=0;i<4;i++){c.fillStyle=rgbaOf(shadow,.18-i*.04);c.fillRect(-28+Math.sin(t/300+i+ph)*2,4+i*2.2,56-i*6,1.2);}
  c.restore();
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
  if(pl.figure)drawFigure(c,36,-17.6,pl.figure);
  if(gild)for(let i=0;i<3;i++){const tw=Math.sin(t/260+i*2.1);if(tw>.5){const gx=-20+i*22,gy=-9;line(c,gx-1.6,gy,gx+1.6,gy,'#FFF6CF',.4);line(c,gx,gy-1.6,gx,gy+1.6,'#FFF6CF',.4);}}
  // water lapping at the hull and a little bow spray
  {const hz=ART_HZ[THEME.scene]||108,f=Math.max(0,Math.min(1,(y-hz)/(H-hz)));const wc=f<.3?mixHex(P.sea[0],P.sea[1],f/.3):mixHex(P.sea[1],P.sea[2],(f-.3)/.7);c.fillStyle=rgbaOf(wc,.9);}c.beginPath();c.moveTo(-36,0);for(let i=0;i<=8;i++)c.quadraticCurveTo(-36+i*9.6+4.8,-1.4+Math.sin(t/300+i)*.6,-36+(i+1)*9.6,0);c.lineTo(48,6);c.lineTo(-36,6);c.closePath();c.fill();
  c.fillStyle=rgbaOf(P.rip,.35);c.fillRect(-30,.4,64,.4);
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
{const _db=drawBoss;drawBoss=function(c,boss,bx,by,r,...rest){if(!isArtLook()||!THEME.scene||!['harbour','voyage'].includes(THEME.scene))return _db.call(this,c,boss,bx,by,r,...rest);
  const P=artPal();const self=this;const pad=r*2.8;artTinted(c,bx-pad,by-pad,pad*2,pad*2.2,shadeHex(P.near,.7),.55,q=>_db.call(self,q,boss,bx,by,r,...rest));};}

/* ---------- the Harbour: crew buildings as silhouettes with lit windows, everything else in the same places ---------- */
function artHarbour(c,t){
  if(!G)return;S.target=null;const today=G.days[G.today];const tgt=today.target,team=today.team;const won=tgt>0&&team>=tgt;const P=artPal();
  const teamFog=Object.values(S.forfeits).some(f=>f&&f.type==='team'&&f.status==='spun'&&Date.now()-f.ts<86400000);
  sky(c,t,{fireworks:won&&skyPhase()==='night'});
  const B=Object.fromEntries(G.proj.map(p=>[p.id,p]));
  if(B.sky.built){const x=(t/60)%380-40;ell(c,x,34,12,5,mixHex('#E06034',P.near,.35));rr(c,x-6,39,12,4,1.5,shadeHex(P.near,.7));}
  sea(c,108,t);
  // a far headland on each side for depth
  island(c,18,111,30,5,t);island(c,302,110,40,6,t);
  island(c,110,118,100,16,t);
  palm(c,26,116,15,t);palm(c,192,116,13,t+400);
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
  // grand ventures, as silhouettes on the left headland
  const n=VENTURES.filter(v=>TEAMDM()>=v.dm).length;if(n){const vx=28,vy=96;island(c,vx,vy+2,22,4,t);
    if(n>=1){R(c,vx+8,vy-1,12,1.6,S2);for(let i=0;i<3;i++)R(c,vx+9+i*4.4,vy,.8,3.4,S2);}
    if(n>=2){R(c,vx-14,vy-16,3,15,S1);rr(c,vx-15,vy-19,5,3,1,WIN);lamp(c,vx-12.5,vy-17.6,7,.5+.2*Math.sin(t/300),'255,236,170');}
    if(n>=3){rr(c,vx-5,vy-3,6,3,.6,S2);ell(c,vx-2,vy-7,1.8,3,S1);disc(c,vx-2,vy-11,1.4,S1);}
    if(n>=4){R(c,vx+3,vy-9,10,8,S1);poly(c,[[vx+2,vy-9],[vx+8,vy-13],[vx+14,vy-9]],S2);R(c,vx+6,vy-5,3,4,WIN);}
    if(n>=5)for(let i=0;i<3;i++){const sx=vx-10+i*12,sy=vy+12+Math.sin(t/700+i)*.6;c.save();c.translate(sx,sy);c.scale(.12,.12);drawShip(c,0,0,1,{hull:'hull_royal',sail:'sail_royal',flag:'flag_crown2'},t,{captain:false,phase:i});c.restore();}
    if(n>=6){const cy=vy-22+Math.sin(t/500);poly(c,[[vx-4,cy+3],[vx-4,cy-1],[vx-2,cy+1],[vx,cy-3],[vx+2,cy+1],[vx+4,cy-1],[vx+4,cy+3]],'#F2C462');}
    hit(vx-24,vy-26,48,34,'Grand ventures',`Built so far: ${VENTURES.slice(0,n).map(x=>x.name).join(', ')}. ${VENTURES[n]?`Next: ${VENTURES[n].name} at ${fmtN(VENTURES[n].dm)} crew DMs (${fmtN(TEAMDM())} so far).`:'Every venture complete.'}`);}
}
{const _dh=drawHarbour;drawHarbour=function(c,t){if(!isArtLook())return _dh.apply(this,arguments);return artHarbour(c,t);};}

/* ---------- the Black Market stall and the Rusty Anchor, redrawn in the same style ---------- */
{const _st=drawStall;drawStall=function(c,x,y,t){if(!isArtLook())return _st.apply(this,arguments);const P=artPal();const glow=.75+.25*Math.sin(t/230)+.06*Math.sin(t/57);
  glowAt(c,x+2,y-10,26,'190,120,255',.38*glow);const tent=mixHex('#2A1840',P.isl,.3);
  poly(c,[[x-10,y],[x-7,y-15],[x+13,y-15],[x+16,y]],tent);poly(c,[[x-9,y-15],[x+3,y-24],[x+15,y-15]],mixHex('#4A2668',P.isl,.25));
  rr(c,x-7,y-6,19,6,1,shadeHex(tent,.7));drawTrader(c,x+2.5,y-6.6,t,.62);
  [x-7,x+3,x+13].forEach((lx,i)=>{const a=glow*(.8+.2*Math.sin(t/300+i));lamp(c,lx,y-14,6,.55*a,'200,150,255');disc(c,lx,y-14,1.2,`rgba(220,190,255,${a})`);});
  if(xmasNowSafe())for(let i=0;i<9;i++){const on=Math.sin(t/300+i*1.7)>-.3;disc(c,x-8+i*2.6,y-15.6,.55,on?['#E0453B','#F2C462','#3FA34D','#4A9BE0'][i%4]:'rgba(255,255,255,.3)');}};}
{const L_=LAYERS.world.find(e=>e.id==='tavernPub');if(L_){const _pub=L_.fn;L_.fn=function(c,t,ctx){if(!isArtLook())return _pub.call(this,c,t,ctx);const P=artPal();const x=200,y=112;const S1=P.bld,S2=shadeHex(P.bld,.74);
  const open=tvOpenNow(),lit=open&&(artLitNow()||THEME.weather==='storm');if(lit)glowAt(c,x,y-8,18,'255,183,96',.35);
  R(c,x-8,y-14,17,14,S1);poly(c,[[x-10,y-13.5],[x+.5,y-22],[x+11,y-13.5]],S2);R(c,x+4.5,y-22,2.2,6,S2);
  const wc=open?(lit?'#FFC46A':rgbaOf(P.win,.75)):shadeHex(S1,.8);R(c,x-6.2,y-11,3.4,3.4,wc);R(c,x+3.8,y-11,3.4,3.4,wc);rr(c,x-1.8,y-7,4.6,7,1,lit?'#E89A4A':S2);
  R(c,x+10,y-16,.8,7,S2);rr(c,x+10.6,y-15.6,6,4,.6,S2);disc(c,x+13.6,y-13.6,1,lit?'#FFC46A':shadeHex(S2,1.4));
  if(xmasNowSafe()||artSnowy()){c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.moveTo(x-10,y-13.5);c.lineTo(x+.5,y-22);c.lineTo(x+11,y-13.5);c.lineTo(x+8,y-14.5);c.lineTo(x+.5,y-20.6);c.lineTo(x-7,y-14.5);c.closePath();c.fill();}
  if(xmasNowSafe())for(let i=0;i<7;i++){const on=Math.sin(t/300+i*1.7)>-.3;disc(c,x-7+i*2.4,y-14,.55,on?['#FF5A5A','#FFD45A','#5AE08A'][i%3]:'rgba(255,255,255,.3)');}
  hit(x-11,y-22,30,22,'The Rusty Anchor',`Barnacle Bill's tavern. ${tvOpenNow()?'Open until 11pm.':'Closed, but Bill is in.'} Drinks, games and gossip. Tap to go in.`,{go:'tavern'});};}}
{const L_=LAYERS.fx.find(e=>e.id==='atmosMotes');if(L_){const w=L_.when;L_.when=()=>(w&&w())||(isArtLook()&&!!(SUN&&SUN.mode!=='day'));}}
