/* ============================== THEME + LAYERS (Stage 0) ==============================
   One theme object decides how the world looks right now: time of day, season, festive
   period, weather. Scenes draw their base art, and anything seasonal or weather-ish is a
   layer that reads THEME, so Christmas, storms or night glow never need to patch a scene.
   Layer slots, back to front: sky (after the base sky), sea (after the base sea),
   world (after the scene's own art, before speech), fx (particles, weather), overlay (tints). */
const HL_VERSION=17;
const THEME={season:'autumn',festive:null,weather:'clear',phase:'day',reduced:false,scene:null,snow:false,preview:null,date:''};
const PAL_BASE={
  sky:{day:['#3FA4E4','#86CEF2','#D9F2FB'],dawn:['#6F86CC','#F3B1A6','#FFE7BE'],sunset:['#454A98','#E57690','#FFC680'],gold:['#F0935A','#F8C079','#FFEBBB'],night:['#121838','#2B3672','#6E639E']},
  sea:{day:['#56CBD9','#2F97C4'],dawn:['#86C6D4','#4690BC'],sunset:['#7CA6C8','#3D6FA6'],gold:['#84CFC8','#3F9EBE'],night:['#2F6090','#122E5A']},
  cloud:{day:['#FFFFFF','rgba(170,205,235,.55)'],dawn:['#FFEDE2','rgba(240,160,160,.55)'],sunset:['#FFD6BC','rgba(214,110,140,.55)'],gold:['#FFF5DC','rgba(240,180,120,.55)'],night:['rgba(150,160,215,.26)','rgba(70,80,150,.22)']}
};
// per-look palette overrides (filled in by seasons and weather; empty = the classic look)
const PAL_LOOKS={
  winter:{sky:{day:['#5FA8DC','#A9D3EE','#E8F4FA']},sea:{day:['#5BBFCF','#2E88B4']}},
  christmas:{sky:{day:['#5FA8DC','#A9D3EE','#EEF6FA'],night:['#0F1636','#26306A','#5B5A94']},sea:{day:['#5BBFCF','#2E88B4']}},
  storm:{sky:{day:['#56677A','#7F8E9C','#AEB8BF'],dawn:['#4E5670','#8A7E8C','#B3A7A4'],sunset:['#3A3F5E','#6E5F78','#9C8A8C'],night:['#0C1022','#1C2342','#3A3E5C']},
         sea:{day:['#4E8C9C','#265E7A'],dawn:['#567E92','#2C5672'],sunset:['#4C6A86','#24405E'],night:['#20405E','#0C1E38']},
         cloud:{day:['#C9D1D8','rgba(80,95,110,.6)'],dawn:['#B9B6BE','rgba(80,80,100,.6)'],sunset:['#9E98AE','rgba(60,60,90,.6)'],night:['rgba(110,120,150,.32)','rgba(40,45,70,.3)']}}
};
function themePal(kind,mode){const base=PAL_BASE[kind][mode]||PAL_BASE[kind].day;const looks=[THEME.festive,THEME.weather!=='clear'?THEME.weather:null];
  let p=base;for(const k of [THEME.season,...looks]){const o=k&&PAL_LOOKS[k]&&PAL_LOOKS[k][kind]&&PAL_LOOKS[k][kind][mode];if(o)p=o;}return p;}

/* ---------- device preferences (Settings > Game feel) ---------- */
const PREF_DEF={intros:true,motion:'auto',heckles:true};
let PREFS=(()=>{try{return {...PREF_DEF,...JSON.parse(localStorage.getItem('hl_prefs')||'{}')};}catch(e){return {...PREF_DEF};}})();
function setPref(k,v){PREFS[k]=v;try{localStorage.setItem('hl_prefs',JSON.stringify(PREFS));}catch(e){}themeNow();}
function reducedMotion(){if(PREFS.motion==='reduced')return true;if(PREFS.motion==='full')return false;try{return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);}catch(e){return false;}}

/* ---------- the season calendar (Stage 1 fills in the full year; Christmas is fixed) ---------- */
function seasonFor(date){try{return seasonOf(date);}catch(e){const m=+date.slice(5,7);return m===12||m<=2?'winter':m<=5?'spring':m<=8?'summer':'autumn';}}
function festiveFor(date){const m=+date.slice(5,7),d=+date.slice(8,10);if(m===12&&d<=26)return 'christmas';return null;}
// preview: ?theme=christmas (or storm, night) in the address bar shows that look without waiting for the date
const THEME_Q=(()=>{try{const q=new URLSearchParams(location.search).get('theme');return q&&/^[a-z,]{2,40}$/.test(q)?q.split(','):[];}catch(e){return [];}})();
function themeNow(ts=Date.now()){const l=L(ts);THEME.date=l.date;THEME.season=seasonFor(l.date);THEME.festive=festiveFor(l.date);THEME.weather=(typeof stormNow==='function'&&stormNow(ts))?'storm':'clear';
  THEME_Q.forEach(q=>{if(q==='christmas'){THEME.festive='christmas';THEME.season='winter';}else if(q==='storm')THEME.weather='storm';else if(['winter','spring','summer','autumn'].includes(q))THEME.season=q;});
  THEME.preview=THEME_Q.length?THEME_Q.join(','):null;THEME.snow=THEME.festive==='christmas';THEME.reduced=reducedMotion();
  try{THEME.phase=skyPhase();}catch(e){}if(THEME_Q.includes('night'))THEME.phase='night';return THEME;}

/* ---------- layers ---------- */
const LAYERS={sky:[],sea:[],world:[],fx:[],overlay:[]};
// addLayer('fx','snow',fn,{scenes:['harbour','ship'],z:10,when:()=>THEME.snow})
function addLayer(slot,id,fn,o={}){const L_=LAYERS[slot];const i=L_.findIndex(x=>x.id===id);const e={id,fn,z:o.z||0,scenes:o.scenes||null,when:o.when||null};if(i>=0)L_[i]=e;else L_.push(e);L_.sort((a,b)=>a.z-b.z);}
function runLayers(slot,c,t,ctx={}){const L_=LAYERS[slot];if(!L_||!L_.length)return;for(const e of L_){if(e.scenes&&!e.scenes.includes(THEME.scene))continue;try{if(e.when&&!e.when(ctx))continue;c.save();e.fn(c,t,ctx);c.restore();}catch(err){console.warn('layer',e.id,err);}}}
// every scene runs world/fx/overlay after its own art, with THEME.scene set so layers can pick scenes
function sceneWrap(name,key){const f=window[name];if(typeof f!=='function'||f.__layered)return;const w=function(c,t,...a){const prev=THEME.scene;THEME.scene=key;try{f.call(this,c,t,...a);if(!prev){runLayers('world',c,t,{args:a});runLayers('fx',c,t,{args:a});runLayers('overlay',c,t,{args:a});}}finally{THEME.scene=prev;}};w.__layered=true;window[name]=w;}

/* ---------- cached static layers: drawn once into an offscreen canvas at the current pixel scale ---------- */
const LCACHE={};
function layerCache(c,key,x,y,w,h,draw){let sc=1;try{const m=c.getTransform();sc=Math.max(.25,Math.min(6,Math.hypot(m.a,m.b)));}catch(e){}
  const k=key+'@'+sc.toFixed(2);let e=LCACHE[k];
  if(!e){const cv=document.createElement('canvas');cv.width=Math.ceil(w*sc);cv.height=Math.ceil(h*sc);const q=cv.getContext('2d');q.setTransform(sc,0,0,sc,-x*sc,-y*sc);draw(q);e=LCACHE[k]={cv};
    const ks=Object.keys(LCACHE);if(ks.length>24)delete LCACHE[ks[0]];}
  c.drawImage(e.cv,x,y,w,h);}

/* ---------- first demonstration layer: snowfall, from 1 December or with ?theme=christmas ---------- */
addLayer('fx','snow',(c,t)=>{const top=-VIEW_EXT.top-6,span=H+VIEW_EXT.top+VIEW_EXT.bot+12,left=-VIEW_EXT.side-6,wid=W+VIEW_EXT.side*2+12;const n=THEME.reduced?22:56;const sp=THEME.reduced?.35:1;
  for(let i=0;i<n;i++){const fall=(t*sp)/(38+(i%7)*9);const y=top+((i*37.7+fall)%span);const sway=Math.sin(t*sp/900+i*1.3)*(2+i%3);const x=left+((i*61.3+sway+fall*.18)%wid);const r=i%4===0?1.15:i%3===0?.8:.55;
    c.globalAlpha=.55+.35*((i*13)%5)/5;disc(c,x,y,r,'#FFFFFF');}c.globalAlpha=1;},{z:20,when:()=>THEME.snow,scenes:['harbour','ship','islet','voyage','focus']});

function themeBoot(){themeNow();[['drawHarbour','harbour'],['drawShipScene','ship'],['drawIslet','islet'],['drawVoyage','voyage']].forEach(([n,k])=>sceneWrap(n,k));
  setInterval(themeNow,30000);
  // reduced motion: the scene redraws about 9 times a second instead of 25
  if(typeof frame==='function'&&!frame.__rm){const _f=frame;let last=0;frame=function(t){if(THEME.reduced&&t-last<110){requestAnimationFrame(frame);return;}last=t;_f(t);};frame.__rm=true;}}
