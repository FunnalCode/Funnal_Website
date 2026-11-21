/* ============================== DARK MODE (21 Nov) ==============================
   A sun and moon button next to the sound button switches the whole game between light and dark, the way the Funnal
   website does it: the new theme is revealed by a circle growing out of the button (a quick fade where the browser can't
   do that). It remembers your choice on this device and keeps open tabs in step. The scenes keep their own day and night. */
const HC_THEME={k:'hl_theme'};
function hcTheme(){try{return localStorage.getItem(HC_THEME.k)==='dark'?'dark':'light';}catch(e){return 'light';}}
function hcApply(th){document.documentElement.setAttribute('data-hc-theme',th);const b=document.getElementById('themeBtn');if(b){b.classList.toggle('on',th==='dark');b.setAttribute('aria-label',th==='dark'?'Switch to light mode':'Switch to dark mode');b.innerHTML=hcIcon(th);}
  const m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',th==='dark'?'#192124':'#F5EFDF');}
function hcIcon(th){return th==='dark'?'<svg viewBox="0 0 24 24"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z"/></svg>':'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.6"/><path d="M12 1.8v2.6M12 19.6v2.6M1.8 12h2.6M19.6 12h2.6M4.8 4.8l1.8 1.8M17.4 17.4l1.8 1.8M4.8 19.2l1.8-1.8M17.4 6.6l1.8-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';}
function hcChime(th){try{if(!S||S.sound===false)return;const ac=getAC();const t0=ac.currentTime;(th==='dark'?[660,495,392]:[392,523,659]).forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t0+i*.07);g.gain.exponentialRampToValueAtTime(.035,t0+i*.07+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+i*.07+.5);o.connect(g);g.connect(ac.destination);o.start(t0+i*.07);o.stop(t0+i*.07+.55);});}catch(e){}}
function hcSwitch(ev){const next=hcTheme()==='dark'?'light':'dark';try{localStorage.setItem(HC_THEME.k,next);}catch(e){}hcChime(next);
  const b=document.getElementById('themeBtn');const r=b?b.getBoundingClientRect():{left:innerWidth-40,top:30,width:0,height:0};const x=r.left+r.width/2,y=r.top+r.height/2;const R=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(document.startViewTransition&&!reduced){const tr=document.startViewTransition(()=>hcApply(next));tr.ready.then(()=>{document.documentElement.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${R}px at ${x}px ${y}px)`]},{duration:650,easing:'cubic-bezier(.4,0,.2,1)',pseudoElement:'::view-transition-new(root)'});}).catch(()=>{});return;}
  // fallback: a quick fade
  const f=document.createElement('div');f.style.cssText=`position:fixed;inset:0;z-index:9999;pointer-events:none;background:${next==='dark'?'#192124':'#F5EFDF'};opacity:0;transition:opacity .22s`;document.body.appendChild(f);requestAnimationFrame(()=>{f.style.opacity='1';setTimeout(()=>{hcApply(next);f.style.opacity='0';setTimeout(()=>f.remove(),260);},230);});}
function hcMount(){const m=document.getElementById('mute');if(!m||document.getElementById('themeBtn'))return;m.insertAdjacentHTML('afterend','<button class="mute themeBtn" id="themeBtn" type="button"></button>');document.getElementById('themeBtn').addEventListener('click',hcSwitch);hcApply(hcTheme());}
hcApply(hcTheme());
const hcMo=new MutationObserver(()=>{if(document.getElementById('mute')&&!document.getElementById('themeBtn'))hcMount();});
try{hcMo.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}setTimeout(hcMount,0);
window.addEventListener('storage',e=>{if(e.key===HC_THEME.k)hcApply(hcTheme());});
// Settings, Game feel: a Light / Dark choice as well
{const _gfT=gameFeelHtml;gameFeelHtml=function(){const h=_gfT.apply(this,arguments);const cur=hcTheme();const seg=(v,l)=>`<button type="button" class="chip ${cur===v?'on':''}" data-act="hcSet" data-v="${v}">${l}</button>`;
  const row=`<div class="li"><span class="grow">Theme<br><small class="muted">Dark mode for the whole game. The sun and moon button at the top does the same.</small></span><span class="row" style="gap:4px">${seg('light','Light')}${seg('dark','Dark')}</span></div>`;const k='<div class="list">';return h.includes(k)?h.replace(k,k+row):h;};}
ACT.hcSet=d=>{if(hcTheme()!==d.v)hcSwitch();setTimeout(()=>render(),700);};
