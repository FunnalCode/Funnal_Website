/* ============================== 22 Nov: an animation for every button ==============================
   Every pressable thing gets the shared press (a quick squash and spring, under 300 ms) plus a signature motion
   for its kind: the DM cannon recoils, each log button acts out its icon, every bottom tab has its own move,
   claim buttons shine and throw coins, buy buttons shake a bag, toggles slide, close buttons quarter-turn,
   delete buttons wobble, and sound and theme have their own. With reduce motion on, it's a simple fade.
   After every render each button is tagged with its kind (pz + pz-<kind>); the test checks none are missed. */
const PZ_RULES=[
 ['dm',el=>el.id==='b_d'],
 ['log',el=>el.classList.contains('act')&&/^[rvmc]$/.test(el.dataset.k||'')],
 ['tab',el=>!!el.closest('#tabs')],
 ['sound',el=>el.id==='mute'||el.id==='sndT'],
 ['theme',el=>el.id==='themeBtn'],
 ['close',el=>/^(closeModal|wnClose|s7TryClose|lvCurseClose|back|goBack|navBack)$/.test(el.dataset.act||'')||el.classList.contains('back')||el.getAttribute('aria-label')==='Close'],
 ['danger',el=>/(remove|delete|del$|cancel|giveUp|abandon|pQuiet|reset)/i.test(el.dataset.act||'')||el.classList.contains('danger')],
 ['claim',el=>/(claim|collect|lvOpen|lvCatch|advDoor|open$|redeem)/i.test(el.dataset.act||'')],
 ['buy',el=>/^(buy|s7Buy|s7Supply|s7BuySet|bmBuy|buyShield|mBuy|fenceSell|bmSell)$/.test(el.dataset.act||'')],
 ['toggle',el=>!!el.closest('.seg,.chips,.pillNav,.s7Tools,.pOwn,.lvTiers,.s7Secs')||el.getAttribute('role')==='tab'],
 ['picture',el=>!!el.closest('.liGroup,.liPick,.lockPick,.modePick')||el.classList.contains('liBtn')],
 ['tile',el=>!!el.closest('.mGrid,.mFoot')],
];
const PZ_SEL='button,a[href^="#"],[data-act],.btn';
function pzKind(el){for(const [k,f] of PZ_RULES){try{if(f(el))return k;}catch(e){}}return 'base';}
function pzTag(root){(root||document).querySelectorAll(PZ_SEL).forEach(el=>{if(el.dataset.pz)return;const k=pzKind(el);el.dataset.pz=k;el.classList.add('pz','pz-'+k);});}
const pzReduced=()=>{try{return (typeof THEME!=='undefined'&&THEME.reduced)||matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}};
function pzPlay(el){if(!el||!el.classList)return;const k=el.dataset.pz||pzKind(el);el.classList.remove('pzGo');void el.offsetWidth;el.classList.add('pzGo');clearTimeout(el._pzT);el._pzT=setTimeout(()=>el.classList.remove('pzGo'),420);
  if(pzReduced())return;try{if(k==='claim')pzCoins(el,6);else if(k==='buy')pzCoins(el,1,true);else if(k==='dm')pzPuff(el);}catch(e){}}
function pzCoins(el,n,drop){const r=el.getBoundingClientRect();for(let i=0;i<n;i++){const c=document.createElement('i');c.className='pzCoin'+(drop?' drop':'');c.style.left=(r.left+r.width/2+(drop?0:(Math.random()-.5)*r.width*.6))+'px';c.style.top=(r.top+(drop?-6:r.height/2))+'px';c.style.setProperty('--dx',((Math.random()-.5)*90)+'px');c.style.setProperty('--dy',(drop?26:-50-Math.random()*40)+'px');c.style.animationDelay=(i*35)+'ms';document.body.appendChild(c);setTimeout(()=>c.remove(),900);}}
function pzPuff(el){const ic=el.querySelector('.dmIcon')||el;const r=ic.getBoundingClientRect();for(let i=0;i<3;i++){const p=document.createElement('i');p.className='pzPuff';p.style.left=(r.left+r.width*.75)+'px';p.style.top=(r.top+r.height*.3)+'px';p.style.setProperty('--dx',(10+i*8)+'px');p.style.animationDelay=(i*50)+'ms';document.body.appendChild(p);setTimeout(()=>p.remove(),800);}
  const n=document.querySelector('.dmRow .num, #dmToday, .dmCount');if(n){n.classList.remove('pzRoll');void n.offsetWidth;n.classList.add('pzRoll');}}
let PZ_CLICK=0;
document.addEventListener('pointerdown',e=>{const el=e.target.closest&&e.target.closest(PZ_SEL);if(!el||el.disabled||el.closest('#crm'))return;if(!el.dataset.pz){el.dataset.pz=pzKind(el);el.classList.add('pz','pz-'+el.dataset.pz);}pzPlay(el);
  const now=Date.now();if(now-PZ_CLICK>60&&['toggle','tab','tile','close','base','picture'].includes(el.dataset.pz)&&!el.dataset.act){PZ_CLICK=now;try{SND.tick&&SND.tick();}catch(e){}}},{passive:true});
// keyboard presses get the same motion
document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const el=document.activeElement&&document.activeElement.closest&&document.activeElement.closest(PZ_SEL);if(el)pzPlay(el);});
{const _dv=decorateView;decorateView=function(){_dv.apply(this,arguments);try{pzTag(document);if(S.screen!=='pipeline'&&typeof pillPlace==='function')document.querySelectorAll('#screen .pillNav').forEach(pillPlace);}catch(e){}};}
// closing a modal: the panel slides away (a copy animates out, so nothing waits on it)
{const _cm=closeModal;closeModal=function(){try{const m=$('#modal');if(m&&!m.hidden&&!pzReduced()){const box=m.firstElementChild;if(box){const r=box.getBoundingClientRect();const g=box.cloneNode(true);g.classList.add('pzGhost');Object.assign(g.style,{position:'fixed',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',margin:0,zIndex:9500,pointerEvents:'none'});g.querySelectorAll('canvas').forEach(c=>c.remove());document.body.appendChild(g);setTimeout(()=>g.remove(),260);}}}catch(e){}return _cm.apply(this,arguments);};}
// the modal gets tagged too when it opens
{const _om=openModal;openModal=function(){const r=_om.apply(this,arguments);try{pzTag($('#modal'));}catch(e){}return r;};}
