/* ============================== ATMOSPHERIC LOOK (optional) ==============================
   A softer, more cinematic take on the same game: deeper skies with a warm horizon, hazy layered islands
   on the horizon, a big soft sun glow, mist where sea meets sky and a gentle colour grade. The ships, Gary,
   the cards and buttons stay exactly as they are. Switch it on in Settings, Game feel (or ?theme=atmos). */
PAL_LOOKS.atmos={
  sky:{day:['#2A8AD8','#79C6F0','#FFF0D8'],dawn:['#5C74C4','#F0A9B4','#FFE6C6'],sunset:['#34357E','#E0688A','#FFBE80'],gold:['#E9825C','#F9BE7C','#FFEDC2'],night:['#0B1230','#22306E','#5A5496']},
  sea:{day:['#62D0DC','#1F86BE'],dawn:['#A9C4D8','#3F80B8'],sunset:['#EC9E8A','#30528E'],gold:['#EFC69A','#3392BC'],night:['#36548E','#102244']},
  cloud:{day:['#FFFFFF','rgba(150,190,225,.5)'],dawn:['#FFE6E0','rgba(225,150,165,.5)'],sunset:['#FFCDB4','rgba(190,95,125,.55)'],gold:['#FFEFD2','rgba(235,165,110,.55)'],night:['rgba(140,150,210,.24)','rgba(60,70,140,.2)']}};
// the atmospheric palette wins over the season palette, but storms still darken it
{const _tp=themePal;themePal=function(kind,mode){if(THEME.look!=='atmos'||THEME.weather==='storm')return _tp.apply(this,arguments);const base=_tp.apply(this,arguments);const o=PAL_LOOKS.atmos[kind]&&PAL_LOOKS.atmos[kind][mode];return o||base;};}
{const _tn=themeNow;themeNow=function(){const r=_tn.apply(this,arguments);THEME.look=(PREFS.look==='atmos'||(typeof THEME_Q!=='undefined'&&THEME_Q.includes('atmos')))?'atmos':'classic';return r;};}
const HORIZON={harbour:108,ship:110,islet:104,voyage:96};
const isAtmos=()=>THEME.look==='atmos';
function hazeCols(mode){return {day:['#B4D6EC','#8EC0DF'],dawn:['#D2B4CC','#AE96BE'],sunset:['#C484A2','#9A6690'],gold:['#E8B496','#CC9680'],night:['#2C3670','#212A5C']}[mode]||['#B4D6EC','#8EC0DF'];}
function hazeRidge(c,y0,amp,seed,col,step){c.fillStyle=col;c.beginPath();c.moveTo(-90,y0+2);let x=-90,i=0,py=y0;while(x<=W+90){const y=y0-((h32(seed+'r'+i)%1000)/1000)*amp;const mx=x-step/2;if(i===0)c.lineTo(x,y);else c.quadraticCurveTo(mx,py,(x+mx)/2+step/4,(y+py)/2);py=y;x+=step;i++;}c.lineTo(W+90,y0+2);c.closePath();c.fill();}
// distant islands and horizon haze, drawn just after the sky
addLayer('sky','atmosHaze',(c,t,ctx)=>{const y0=HORIZON[THEME.scene];if(!y0)return;const mode=(ctx&&ctx.mode)||'day';const night=mode==='night';const hc=hazeCols(mode);
  if(!night&&SUN){const g=c.createRadialGradient(SUN.x,SUN.y,4,SUN.x,SUN.y,170);g.addColorStop(0,`rgba(${SUN.col},.32)`);g.addColorStop(1,`rgba(${SUN.col},0)`);c.fillStyle=g;c.fillRect(-80,-300,W+160,y0+300);}
  const m=c.createLinearGradient(0,y0-34,0,y0);m.addColorStop(0,'rgba(255,240,225,0)');m.addColorStop(1,night?'rgba(120,130,190,.22)':'rgba(255,240,225,.38)');c.fillStyle=m;c.fillRect(-80,y0-34,W+160,34);
  c.globalAlpha=night?.85:.8;hazeRidge(c,y0,16,'far'+THEME.scene,hc[0],46);c.globalAlpha=night?.95:.9;hazeRidge(c,y0,9,'mid'+THEME.scene,hc[1],34);c.globalAlpha=1;
  const m2=c.createLinearGradient(0,y0-8,0,y0);m2.addColorStop(0,'rgba(255,245,235,0)');m2.addColorStop(1,night?'rgba(150,160,210,.25)':'rgba(255,245,235,.45)');c.fillStyle=m2;c.fillRect(-80,y0-8,W+160,8);},{z:2,when:isAtmos});
// mist on the water near the horizon, and depth further down
addLayer('sea','atmosSea',(c,t,ctx)=>{const y0=(ctx&&ctx.y0)||108;const night=SUN&&SUN.night;const g=c.createLinearGradient(0,y0,0,y0+26);g.addColorStop(0,night?'rgba(150,160,210,.28)':'rgba(255,244,232,.3)');g.addColorStop(1,'rgba(255,240,228,0)');c.fillStyle=g;c.fillRect(-80,y0,W+160,26);
  const d=c.createLinearGradient(0,y0+40,0,H+40);d.addColorStop(0,'rgba(10,20,50,0)');d.addColorStop(1,night?'rgba(5,10,30,.3)':'rgba(10,30,70,.14)');c.fillStyle=d;c.fillRect(-80,y0+40,W+160,H);},{z:-5,when:isAtmos});
// a soft colour grade and vignette over the whole scene
addLayer('overlay','atmosGrade',(c,t)=>{const mode=SUN?SUN.mode:'day';const tint={day:'rgba(255,220,180,.035)',dawn:'rgba(255,170,190,.06)',sunset:'rgba(255,140,120,.06)',gold:'rgba(255,190,120,.06)',night:'rgba(80,90,180,.08)'}[mode]||'rgba(255,220,180,.035)';
  c.fillStyle=tint;c.fillRect(-80,-300,W+160,H+600);const v=c.createRadialGradient(W/2,H*.55,H*.45,W/2,H*.55,H*1.05);v.addColorStop(0,'rgba(20,20,50,0)');v.addColorStop(1,'rgba(20,20,50,.12)');c.fillStyle=v;c.fillRect(-80,-300,W+160,H+600);},{z:-10,when:isAtmos});
// Settings, Game feel: Look
{const _gf=gameFeelHtml;gameFeelHtml=function(){const h=_gf.apply(this,arguments);const cur=PREFS.look==='atmos'?'atmos':'classic';const seg=(v,l)=>`<button type="button" class="chip ${cur===v?'on':''}" data-act="prefLook" data-v="${v}">${l}</button>`;
  const row=`<div class="li"><span class="grow">Look<br><small class="muted">Atmospheric adds deeper skies, hazy islands on the horizon and softer light. Everything else stays the same.</small></span><span class="row" style="gap:4px">${seg('classic','Classic')}${seg('atmos','Atmospheric')}</span></div>`;const k='<div class="li"><span class="grow">Motion';return h.includes(k)?h.replace(k,row+k):h;};}
ACT.prefLook=d=>{setPref('look',d.v);render();};
setTimeout(()=>{try{themeNow();}catch(e){}},0);
