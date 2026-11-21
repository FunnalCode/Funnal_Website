/* ============================== ATMOSPHERIC LOOK (the default view style) ==============================
   Only the scenes change: the ships, Gary, every card, button and font stay exactly as they are.
   Deeper skies with a warm horizon, god rays and a soft sun bloom, layered hazy islands (they drift past on
   Lock In voyages), sparkles on the sun or moon path, mist where sea meets sky, floating motes of light by day,
   fireflies, a milky way, aurora and glowing sea life by night. Settings, Game feel, Scenery switches back to Classic. */
PAL_LOOKS.atmos={
  sky:{day:['#2A8AD8','#79C6F0','#FFF0D8'],dawn:['#5C74C4','#F0A9B4','#FFE6C6'],sunset:['#2C2C78','#DA5E88','#FFBE80'],gold:['#E9825C','#F9BE7C','#FFEDC2'],night:['#070C26','#1A2462','#4A3F86']},
  sea:{day:['#62D0DC','#1F86BE'],dawn:['#A9C4D8','#3F80B8'],sunset:['#EC9E8A','#2C4A88'],gold:['#EFC69A','#3392BC'],night:['#2E4886','#0A1A3C']},
  cloud:{day:['#FFFFFF','rgba(150,190,225,.5)'],dawn:['#FFE6E0','rgba(225,150,165,.5)'],sunset:['#FFC8B0','rgba(180,85,125,.55)'],gold:['#FFEFD2','rgba(235,165,110,.55)'],night:['rgba(140,150,210,.24)','rgba(60,70,140,.2)']}};
{const _tp=themePal;themePal=function(kind,mode){if(THEME.look!=='atmos'||THEME.weather==='storm')return _tp.apply(this,arguments);const base=_tp.apply(this,arguments);const o=PAL_LOOKS.atmos[kind]&&PAL_LOOKS.atmos[kind][mode];return o||base;};}
{const _tn=themeNow;themeNow=function(){const r=_tn.apply(this,arguments);const Q=(typeof THEME_Q!=='undefined')?THEME_Q:[];THEME.look=Q.includes('classic')?'classic':Q.includes('atmos')?'atmos':(PREFS.look==='classic'?'classic':'atmos');return r;};}
const HORIZON={harbour:108,ship:110,islet:104,voyage:96};
const isAtmos=()=>THEME.look==='atmos';
const AQ=()=>THEME.reduced?.4:1;
function hazeCols(mode){return {day:['#BBDAEE','#97C4E2','#78AED4'],dawn:['#D8BBD2','#B49CC4','#927EB0'],sunset:['#C98AA8','#9C6696','#704C84'],gold:['#EDBA9C','#D29C86','#AE7E7A'],night:['#2E3874','#232C62','#1A2250']}[mode]||['#BBDAEE','#97C4E2','#78AED4'];}
// periodic ridge strips, built once and slid sideways for parallax
const RIDGES={};function ridgePath(key,amp,step,L=640){if(RIDGES[key])return RIDGES[key];const p=new Path2D();const n=Math.round(L/step);const ys=[];for(let i=0;i<n;i++)ys.push(((h32(key+i)%1000)/1000));ys.push(ys[0]);
  p.moveTo(0,40);p.lineTo(0,-ys[0]*amp);for(let i=1;i<=n;i++){const x0=(i-1)*step,x1=i*step,mx=(x0+x1)/2;p.bezierCurveTo(mx,-ys[i-1]*amp,mx,-ys[i]*amp,x1,-ys[i]*amp);}p.lineTo(L,40);p.closePath();RIDGES[key]={p,L};return RIDGES[key];}
function drawRidge(c,key,y0,amp,step,col,alpha,off){const r=ridgePath(key,amp,step);c.save();c.globalAlpha=alpha;c.fillStyle=col;let x=((off%r.L)+r.L)%r.L-r.L-90;while(x<W+90){c.save();c.translate(x,y0);c.fill(r.p);c.restore();x+=r.L;}c.restore();}
const voySpeed=()=>THEME.scene==='voyage'?(1+Math.min(2,(S.voyBoost||0))):0;
// sky: sun bloom and god rays, milky way and aurora at night, three layers of hazy islands, horizon mist
addLayer('sky','atmosHaze',(c,t,ctx)=>{const y0=HORIZON[THEME.scene];if(!y0)return;const mode=(ctx&&ctx.mode)||'day';const night=mode==='night';const hc=hazeCols(mode);const q=AQ();
  if(!night&&SUN){const g=c.createRadialGradient(SUN.x,SUN.y,4,SUN.x,SUN.y,190);g.addColorStop(0,`rgba(${SUN.col},.4)`);g.addColorStop(1,`rgba(${SUN.col},0)`);c.fillStyle=g;c.fillRect(-80,-300,W+160,y0+300);
    c.save();c.globalCompositeOperation='lighter';for(let i=0;i<9;i++){const a=.15+i*.36+Math.sin(t*q/5200+i*1.7)*.06,w=.035+.02*Math.sin(t*q/3100+i);const r=420;const al=(mode==='day'?.05:.08)*(.6+.4*Math.sin(t*q/2600+i*2.1));
      const gr=c.createRadialGradient(SUN.x,SUN.y,10,SUN.x,SUN.y,r);gr.addColorStop(0,`rgba(${SUN.col},${al})`);gr.addColorStop(1,`rgba(${SUN.col},0)`);c.fillStyle=gr;c.beginPath();c.moveTo(SUN.x,SUN.y);c.lineTo(SUN.x+Math.cos(a-w)*r,SUN.y+Math.sin(a-w)*r);c.lineTo(SUN.x+Math.cos(a+w)*r,SUN.y+Math.sin(a+w)*r);c.closePath();c.fill();}c.restore();}
  if(night){layerCache(c,'milkyway'+THEME.scene,-60,-40,W+120,y0+40,qc=>{qc.save();qc.translate(W*.55+60,y0*.35+40);qc.rotate(-.42);const g=qc.createLinearGradient(0,-26,0,26);g.addColorStop(0,'rgba(180,170,255,0)');g.addColorStop(.5,'rgba(200,190,255,.16)');g.addColorStop(1,'rgba(180,170,255,0)');qc.fillStyle=g;qc.fillRect(-260,-26,520,52);
      for(let i=0;i<180;i++){const x=((h32('mw'+i)%520)-260),y=((h32('mwy'+i)%1000)/1000-.5)*44*(1-Math.abs(x)/320);qc.fillStyle=`rgba(255,255,255,${.25+((h32('mwa'+i)%100)/100)*.5})`;qc.fillRect(x,y,.6,.6);}qc.restore();});
    if(!(typeof isWinter==='function'&&isWinter())){for(let k=0;k<2;k++){c.save();c.globalCompositeOperation='lighter';c.beginPath();for(let x=-60;x<=W+60;x+=6){const y=28+k*10+Math.sin(x/38+t*q/2400+k)*7;x===-60?c.moveTo(x,y):c.lineTo(x,y);}
      const g=c.createLinearGradient(0,10,0,70);const col=k?'150,110,255':'80,240,190';g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(.5,`rgba(${col},${.07+.04*Math.sin(t*q/1800+k)})`);g.addColorStop(1,`rgba(${col},0)`);c.strokeStyle=g;c.lineWidth=18;c.stroke();c.restore();}}
    const sh=(t%6500)/6500;if(sh<.06){const u=sh/.06,x=60+u*150,y=20+u*34;line(c,x,y,x-14*(1-u)-3,y-5*(1-u)-1,'rgba(255,255,255,.8)',.6);}}
  const m=c.createLinearGradient(0,y0-40,0,y0);m.addColorStop(0,'rgba(255,240,225,0)');m.addColorStop(1,night?'rgba(120,130,200,.24)':mode==='sunset'?'rgba(255,190,150,.5)':'rgba(255,240,225,.42)');c.fillStyle=m;c.fillRect(-80,y0-40,W+160,40);
  const sp=voySpeed(),off=-t*sp;drawRidge(c,'far',y0,20,58,hc[0],night?.85:.75,off*.004);drawRidge(c,'mid',y0,12,42,hc[1],night?.92:.85,off*.008);drawRidge(c,'near'+THEME.scene,y0+1,7,30,hc[2],night?.95:.8,off*.016);
  const m2=c.createLinearGradient(0,y0-9,0,y0);m2.addColorStop(0,'rgba(255,245,235,0)');m2.addColorStop(1,night?'rgba(150,160,220,.3)':'rgba(255,245,235,.5)');c.fillStyle=m2;c.fillRect(-80,y0-9,W+160,9);},{z:2,when:isAtmos});
// sea: mist at the horizon, glitter on the sun or moon path, shimmering light bands, glowing sea life at night, depth
addLayer('sea','atmosSea',(c,t,ctx)=>{const y0=(ctx&&ctx.y0)||108;const night=SUN&&SUN.night;const q=AQ();
  const g=c.createLinearGradient(0,y0,0,y0+28);g.addColorStop(0,night?'rgba(150,160,220,.3)':'rgba(255,244,232,.34)');g.addColorStop(1,'rgba(255,240,228,0)');c.fillStyle=g;c.fillRect(-80,y0,W+160,28);
  c.save();c.globalCompositeOperation='lighter';for(let k=0;k<7;k++){const y=y0+12+k*k*2.6+k*4;const a=(night?.03:.05)*(.5+.5*Math.sin(t*q/1700+k*1.3));c.fillStyle=`rgba(255,255,255,${a})`;c.fillRect(-80,y,W+160,1+k*.35);}
  if(SUN){const n=Math.round(34*q);for(let i=0;i<n;i++){const dep=((h32('gl'+i)%1000)/1000);const y=y0+3+dep*dep*(H-y0);const sx=SUN.x+(((h32('gx'+i)%1000)/1000)-.5)*(10+dep*70);const tw=Math.pow(Math.max(0,Math.sin(t*q/(180+(i%5)*40)+i*7.3)),10);if(tw<.05)continue;const r=(.8+dep*1.6)*tw;
      c.fillStyle=`rgba(${SUN.col},${.85*tw})`;c.fillRect(sx-r*1.8,y-.25,r*3.6,.5);c.fillRect(sx-.25,y-r*1.2,.5,r*2.4);}}
  if(night){for(let i=0;i<Math.round(46*q);i++){const x=((h32('bx'+i)%1000)/1000)*(W+40)-20+Math.sin(t/3000+i)*4,y=y0+10+((h32('by'+i)%1000)/1000)*(H-y0);const a=Math.max(0,Math.sin(t*q/(600+(i%7)*90)+i*2.9));if(a<.2)continue;c.fillStyle=`rgba(110,255,225,${a*.55})`;c.beginPath();c.arc(x,y,.7+a*.6,0,TAU);c.fill();}}
  c.restore();const d=c.createLinearGradient(0,y0+40,0,H+40);d.addColorStop(0,'rgba(10,20,50,0)');d.addColorStop(1,night?'rgba(5,10,30,.3)':'rgba(10,30,70,.14)');c.fillStyle=d;c.fillRect(-80,y0+40,W+160,H);},{z:-5,when:isAtmos});
// floating motes of light by day, golden dust at sunset, fireflies at night
addLayer('fx','atmosMotes',(c,t)=>{if(THEME.weather==='storm')return;const mode=SUN?SUN.mode:'day';const night=mode==='night';const q=AQ();const n=Math.round((night?22:16)*q);const col=night?'255,236,150':mode==='day'?'255,255,240':'255,210,150';
  c.save();c.globalCompositeOperation='lighter';for(let i=0;i<n;i++){const sp=(.4+(i%5)*.15)*q;const x=((((h32('mo'+i)%1000)/1000*(W+60)+t*sp/60+Math.sin(t/1700+i)*10)%(W+60))+(W+60))%(W+60)-30;const y=(night?70:40)+((h32('my'+i)%1000)/1000)*(night?100:120)+Math.sin(t/1300+i*1.7)*6;
    const a=night?Math.max(0,Math.sin(t*q/700+i*2.3)):(.35+.35*Math.sin(t*q/900+i*1.9));if(a<.05)continue;const r=night?1.1:.9;const g=c.createRadialGradient(x,y,0,x,y,r*5);g.addColorStop(0,`rgba(${col},${a*.55})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r*5,y-r*5,r*10,r*10);c.fillStyle=`rgba(${col},${a})`;c.fillRect(x-r/2,y-r/2,r,r);}c.restore();},{z:3,when:isAtmos});
// lens glow and a gentle grade over the whole view
addLayer('overlay','atmosGrade',(c,t)=>{const mode=SUN?SUN.mode:'day';const night=mode==='night';
  if(SUN&&!night&&THEME.weather!=='storm'){c.save();c.globalCompositeOperation='lighter';const vx=W/2-SUN.x,vy=H*.55-SUN.y;[[.55,10,.05],[.85,5,.06],[1.25,16,.035]].forEach(([k,r,a])=>{const x=SUN.x+vx*k,y=SUN.y+vy*k;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${SUN.col},${a})`);g.addColorStop(1,`rgba(${SUN.col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);});c.restore();}
  const tint={day:'rgba(255,220,180,.035)',dawn:'rgba(255,170,190,.06)',sunset:'rgba(255,120,140,.07)',gold:'rgba(255,190,120,.06)',night:'rgba(80,90,190,.08)'}[mode]||'rgba(255,220,180,.035)';c.fillStyle=tint;c.fillRect(-80,-300,W+160,H+600);
  const v=c.createRadialGradient(W/2,H*.55,H*.5,W/2,H*.55,H*1.1);v.addColorStop(0,'rgba(20,20,50,0)');v.addColorStop(1,night?'rgba(10,10,40,.22)':'rgba(20,20,50,.12)');c.fillStyle=v;c.fillRect(-80,-300,W+160,H+600);},{z:-10,when:isAtmos});
// a soft bloom around the lighthouse lamp on the Harbour at night
addLayer('world','atmosLamp',(c,t)=>{if(!SUN||!SUN.night)return;const top=typeof lighthouseTop==='function'?lighthouseTop():72;c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(104,top-4,2,104,top-4,46);g.addColorStop(0,'rgba(255,230,160,.35)');g.addColorStop(1,'rgba(255,230,160,0)');c.fillStyle=g;c.fillRect(50,top-56,108,108);c.restore();},{scenes:['harbour'],z:1,when:isAtmos});
// Settings, Game feel: Scenery
{const _gf=gameFeelHtml;gameFeelHtml=function(){const h=_gf.apply(this,arguments);const cur=PREFS.look==='classic'?'classic':'atmos';const seg=(v,l)=>`<button type="button" class="chip ${cur===v?'on':''}" data-act="prefLook" data-v="${v}">${l}</button>`;
  const row=`<div class="li"><span class="grow">Scenery<br><small class="muted">Atmospheric adds glowing skies, sun rays, sparkling water, drifting islands and starry nights. Classic is the original look.</small></span><span class="row" style="gap:4px">${seg('atmos','Atmospheric')}${seg('classic','Classic')}</span></div>`;const k='<div class="li"><span class="grow">Motion';return h.includes(k)?h.replace(k,row+k):h;};}
ACT.prefLook=d=>{setPref('look',d.v);render();};
setTimeout(()=>{try{themeNow();}catch(e){}},0);
