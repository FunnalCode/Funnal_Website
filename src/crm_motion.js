/* ============================== 25 Nov: pipeline motion ==============================
   Every render is compared with the one before, so things move instead of jumping:
   - cards and rows glide to their new place (FLIP), and gaps close smoothly
   - a card that changes stage flies into the next column, or into its stage pill when that column is off screen
   - a ticked-off follow-up gets a check swoosh and slides away
   - a new prospect drops in with a bounce
   - a new client: gold "Won" seal, Funnal-colour confetti and the retainer total counting up
   - numbers on the Today cards count to their new value
   - Hot cards glow like embers, Cold ones get a frosty edge, warmth chips pop when they change,
     and the warmth dial in the prospect panel spins to its number
   - a quote opened live: the prospect blinks an eye at you
   - the New prospect form lights up the existing card when it spots a duplicate
   - hitting the monthly retainer goal: the bar fills and a wave bursts, once a month
   Respects reduced motion. */
const CM={stages:null,warm:{},dial:{},dropT:0};
const cmOff=()=>CRM_REDUCED();
const cmState=()=>[CRM.view,CRM.tab,CRM.stage,CRM.q,CRM.owner,CRM.closed,CRM.review].join('|');
const cmKey=el=>el.dataset.id+(el.classList.contains('cCard')?'c':'r');
const cmEls=root=>root.querySelectorAll('.crmMain .cCard[data-id],.crmMain .crmRow[data-id]');
addEventListener('drop',()=>{CM.dropT=Date.now();},true);
// the old fade-before-move steps would hide the card before the motion layer could fly it, so these act at once
CRM_ACT.next=b=>{const id=b.dataset.id;const r=PIPE.rows.find(x=>x.id===id);const nx=r&&PIPE_STAGES[P_IDX[r.stage]+1];if(nx)pMove(id,nx.id);};
CRM_ACT.done=b=>{ACT.pDone({id:b.dataset.id});};

function cmBefore(){const root=document.getElementById('crm');if(!root||!root.classList.contains('on'))return null;
  const els=new Map(),H=innerHeight;cmEls(root).forEach(el=>{const r=el.getBoundingClientRect();if(r.width&&r.height&&r.bottom>-80&&r.top<H+80)els.set(cmKey(el),{el,r});});
  const nums=[...root.querySelectorAll('.crmMain .cStats .cNum')].map(e=>+e.dataset.n||0);
  return {root,els,nums,state:cmState()};}

/* ---------- small helpers ---------- */
function cmFlip(el,dx,dy,sc){el.style.transition='none';el.style.transform=`translate(${dx}px,${dy}px)${sc?` scale(${sc})`:''}`;el.getBoundingClientRect();
  requestAnimationFrame(()=>{el.style.transition='transform .55s cubic-bezier(.2,.9,.25,1.08)';el.style.transform='';setTimeout(()=>{el.style.transition='';el.style.transform='';},600);});}
function cmGhost(root,el,r){const hold=el.parentElement?el.parentElement.cloneNode(false):document.createElement('div');
  hold.removeAttribute('data-scroll');hold.className+=' cmHold';hold.style.cssText='position:absolute;inset:0;width:0;height:0;padding:0;margin:0;border:0;background:none;overflow:visible;pointer-events:none;z-index:6';
  el.classList.remove('cLeaving','cTicked');el.style.height='';el.classList.add('cmGhost');el.querySelectorAll('[data-c]').forEach(x=>x.removeAttribute('data-c'));el.removeAttribute('data-c');
  Object.assign(el.style,{position:'fixed',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',margin:'0',transform:'',transition:'',animation:'none'});
  hold.appendChild(el);root.appendChild(hold);return {g:el,hold,done:()=>hold.remove()};}
const cmMid=r=>[r.left+r.width/2,r.top+r.height/2];
function cmPulse(el,cls='cmPulse'){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),900);}
const CM_CHECK=`<span class="cmCheck"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>`;

/* the card or row is gone from view: say why */
// where a moved card lands: its new spot if you can see it, else its column header, else its stage pill
function cmTarget(root,to,n){if(n){const r=n.getBoundingClientRect(),l=n.closest('.cList');const c=l?l.getBoundingClientRect():{top:0,bottom:innerHeight};
    if(r.width&&r.top>=c.top-4&&r.bottom<=c.bottom+4&&r.bottom<=innerHeight)return {el:n,r,card:true};}
  const h=root.querySelector(`.cCol[data-stage="${to}"] header`);if(h){const r=h.getBoundingClientRect();if(r.width&&r.top>=0&&r.bottom<=innerHeight)return {el:h,r};}
  const p=root.querySelector(`.cStageBar [data-s="${to}"]`)||root.querySelector('.cNav [data-v="board"]');return p?{el:p,r:p.getBoundingClientRect()}:null;}
function cmLeave(root,k,o,why,to,n){const {g,done}=cmGhost(root,o.el,o.r);
  if(why==='done'){g.insertAdjacentHTML('beforeend',CM_CHECK);g.classList.add('cmDoneG');
    g.animate([{transform:'none',opacity:1},{transform:'none',opacity:1,offset:.45},{transform:'translateX(56px) scale(.97)',opacity:0}],{duration:760,easing:'cubic-bezier(.5,0,.3,1)'}).onfinish=done;return;}
  if(why==='fly'){const t=cmTarget(root,to,n);
    if(t&&t.card){const [x1,y1]=cmMid(o.r),[x2,y2]=cmMid(t.r);t.el.style.visibility='hidden';const lift=Math.min(60,Math.abs(x2-x1)*.15+20);
      g.animate([{transform:'none'},{transform:`translate(${(x2-x1)*.5}px,${(y2-y1)*.5-lift}px) scale(1.06) rotate(${x2>x1?2:-2}deg)`,offset:.5},{transform:`translate(${x2-x1}px,${y2-y1}px)`}],{duration:620,easing:'cubic-bezier(.4,0,.2,1)'}).onfinish=()=>{done();t.el.style.visibility='';cmPulse(t.el,'cmSettle');};return;}
    if(t){const [x1,y1]=cmMid(o.r),[x2,y2]=cmMid(t.r);
      g.animate([{transform:'none',opacity:1},{transform:`translate(${(x2-x1)*.35}px,${(y2-y1)*.35-40}px) scale(.7) rotate(-4deg)`,opacity:.95,offset:.45},{transform:`translate(${x2-x1}px,${y2-y1}px) scale(.12) rotate(6deg)`,opacity:.1}],{duration:720,easing:'cubic-bezier(.45,0,.25,1)'}).onfinish=()=>{done();cmPulse(t.el,'cmCatch');const c=t.el.closest('.cCol');if(c)cmPulse(c.querySelector('.cCount'),'cmBump');};return;}
    g.animate([{transform:'none',opacity:1},{transform:'translateX(80px)',opacity:0}],{duration:450,easing:'ease-in'}).onfinish=done;return;}
  if(why==='won'){g.insertAdjacentHTML('beforeend','<span class="cmSeal">Won</span>');g.classList.add('cmWonG');
    g.animate([{transform:'none',opacity:1},{transform:'scale(1.03)',opacity:1,offset:.2},{transform:'scale(1)',opacity:1,offset:.75},{transform:'translateY(-30px) scale(.94)',opacity:0}],{duration:1700,easing:'ease-out'}).onfinish=done;return;}
  g.animate([{transform:'none',opacity:1},{transform:'scale(.85)',opacity:0}],{duration:380,easing:'ease-in'}).onfinish=done;}

/* numbers count to their new value */
function cmTween(el,from,to,ms=900){const fmt=el.dataset.fmt;const show=v=>fmt==='money'?pMoney(Math.round(v)):fmt==='pct'?Math.round(v)+'%':String(Math.round(v));
  const t0=performance.now();const step=t=>{const p=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-p,3);el.textContent=show(from+(to-from)*e);if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);cmPulse(el,'cmBump');}

/* ---------- confetti, in Funnal colours ---------- */
function cmConfetti(x,y,n=140,spread=1){const root=document.getElementById('crm');if(!root||cmOff())return;const c=document.createElement('canvas');c.className='cmConf';const dpr=Math.min(2,devicePixelRatio||1);
  c.width=innerWidth*dpr;c.height=innerHeight*dpr;root.appendChild(c);const ctx=c.getContext('2d');ctx.scale(dpr,dpr);
  const col=['#DDA94D','#F2C462','#E06034','#3F5160','#7FA2D2','#5DBE9C'];
  const P=Array.from({length:n},()=>{const a=-Math.PI/2+(Math.random()-.5)*Math.PI*.95*spread,s=6+Math.random()*9;return {x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,w:5+Math.random()*6,h:3+Math.random()*4,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:col[Math.random()*col.length|0],round:Math.random()<.25};});
  const t0=performance.now();const tick=t=>{const el=(t-t0)/1000;ctx.clearRect(0,0,innerWidth,innerHeight);let alive=0;
    P.forEach(p=>{p.vy+=.32;p.vx*=.985;p.vy*=.985;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;if(p.y<innerHeight+20)alive++;ctx.save();ctx.globalAlpha=Math.max(0,1-Math.max(0,el-1.4)/.8);ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;
      if(p.round){ctx.beginPath();ctx.arc(0,0,p.h*.8,0,7);ctx.fill();}else ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(p.r*2)));ctx.restore();});
    if(alive&&el<2.3)requestAnimationFrame(tick);else c.remove();};requestAnimationFrame(tick);}

/* ---------- a new client ---------- */
function cmWon(ids,rects){const root=document.getElementById('crm');if(!root)return;
  ids.forEach((id,i)=>setTimeout(()=>{const r=PIPE.rows.find(x=>x.id===id);if(!r)return;
    const el=root.querySelector(`.crmMain [data-id="${id}"].cCard,.crmMain .crmRow[data-id="${id}"]`);const rr=rects[id]||(el&&el.getBoundingClientRect());
    const [x,y]=rr&&rr.width?cmMid(rr):[innerWidth/2,innerHeight*.35];cmConfetti(x,y);
    if(el){el.insertAdjacentHTML('beforeend','<span class="cmSeal stay">Won</span>');setTimeout(()=>{const s=el.querySelector('.cmSeal.stay');if(s)s.remove();},4200);}
    const now=Math.round(PIPE.rows.filter(x=>x.stage==='client').reduce((a,x)=>a+pMonthly(x),0)),add=Math.round(pMonthly(r)),before=now-add;
    const b=document.createElement('div');b.className='cmWonBanner';b.innerHTML=`<span class="cmWonIc">${cSvg('star')}</span><div><small>New client</small><b>${cEsc(r.business||'A new client')}</b>${add?`<span>Retainers <em class="cNum" data-fmt="money">${pMoney(before)}</em> a month</span>`:''}</div>`;
    root.appendChild(b);if(add){const n=b.querySelector('.cNum');setTimeout(()=>cmTween(n,before,now,1300),450);}
    setTimeout(()=>{b.classList.add('out');setTimeout(()=>b.remove(),500);},4300);},i*900));}

/* ---------- after every render ---------- */
function cmAfter(b,first){const now={};PIPE.rows.forEach(r=>now[r.id]=r.stage);const prev=CM.stages;CM.stages=now;
  const wNow={};PIPE.rows.forEach(r=>{const w=cWarm(r);if(w)wNow[r.id]=w.n;});const wPrev=CM.warm;CM.warm=wNow;
  if(!prev||cmOff())return;
  const won=Object.keys(now).filter(id=>now[id]==='client'&&prev[id]&&prev[id]!=='client');
  const root=document.getElementById('crm');if(!root||!b||first===true){if(won.length)cmWon(won,{});return;}
  const rects={};
  if(b.state===cmState()){const nowEls=new Map();cmEls(root).forEach(el=>{if(el.offsetParent!==null&&el.getClientRects().length)nowEls.set(cmKey(el),el);});const dropped=Date.now()-CM.dropT<700;
    b.els.forEach((o,k)=>{const id=k.slice(0,-1),card=k.endsWith('c');const n=nowEls.get(k);rects[id]=o.r;
      if(n&&prev[id]!==now[id]&&card){if(dropped){cmPulse(n,'cmSettle');return;}return cmLeave(root,k,o,now[id]==='client'?'won':'fly',now[id],n);}
      if(n){if(n===o.el)return;const r2=n.getBoundingClientRect();if(!r2.width)return;const dx=o.r.left-r2.left,dy=o.r.top-r2.top;
        if(Math.abs(dx)>1||Math.abs(dy)>1)cmFlip(n,dx,dy);return;}
      if(!(id in now))return cmLeave(root,k,o,'gone');
      if(prev[id]!==now[id])return cmLeave(root,k,o,now[id]==='client'?'won':card?'fly':'done',now[id]);
      if(!card)return cmLeave(root,k,o,'done');
      cmLeave(root,k,o,'gone');});
    nowEls.forEach((el,k)=>{const id=k.slice(0,-1);if(!b.els.has(k)&&!(id in prev))cmPulse(el,'cmNew');
      if(wPrev[id]!=null&&wNow[id]!=null&&wPrev[id]!==wNow[id])cmPulse(el.querySelector('.cWarm'),'cmPop');});
    const nums=[...root.querySelectorAll('.crmMain .cStats .cNum')];if(nums.length===b.nums.length)nums.forEach((el,i)=>{const to=+el.dataset.n||0;if(to!==b.nums[i])cmTween(el,b.nums[i],to);});}
  if(won.length)cmWon(won,rects);
  cmGoal(root);}

/* ---------- the monthly goal, once a month ---------- */
function cmGoal(root){if(CRM.view!=='today')return;const mrr=Math.round(PIPE.rows.filter(r=>r.stage==='client').reduce((a,r)=>a+pMonthly(r),0));if(!mrr||mrr<pGoal())return;
  const k='hl_goal_cel_'+G.today.slice(0,7);try{if(localStorage.getItem(k))return;localStorage.setItem(k,'1');}catch(e){return;}
  const st=root.querySelector('.crmMain .cStat.ink');if(!st)return;st.classList.add('cmGoalHit');st.insertAdjacentHTML('beforeend','<svg class="cmWave" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 20 Q25 4 50 20 T100 20 T150 20 T200 20 V40 H0z"/></svg>');
  const r=st.getBoundingClientRect();setTimeout(()=>cmConfetti(r.left+r.width/2,r.top+r.height*.6,90,.7),700);
  setTimeout(()=>{st.classList.remove('cmGoalHit');const w=st.querySelector('.cmWave');if(w)w.remove();},3400);}

{const _r=crmRender;crmRender=function(first){const b=(()=>{try{return cmBefore();}catch(e){return null;}})();const out=_r.apply(this,arguments);try{cmAfter(b,first);}catch(e){console.warn('motion',e);}return out;};}

/* ---------- warmth on cards: embers and frost ---------- */
{const _cc=crmCard;crmCard=function(r){const h=_cc.apply(this,arguments);const w=cWarm(r);if(!w)return h;const cls=w.n>=70?'wHot':w.n<25?'wCold':'';return cls?h.replace('<article class="cCard ',`<article class="cCard ${cls} `):h;};}

/* ---------- the warmth dial spins to its number ---------- */
{const _df=crmDrawerFill;crmDrawerFill=function(first){_df.apply(this,arguments);if(cmOff())return;const d=document.querySelector('#crm .crmDrawer');const dial=d&&d.querySelector('.cWarmDial');if(!dial||!CRM.open)return;
  const to=+getComputedStyle(dial).getPropertyValue('--p')||0;const from=CM.dial[CRM.open]!=null?CM.dial[CRM.open]:(first===true?0:to);CM.dial[CRM.open]=to;if(from===to)return;
  const b=dial.querySelector('b');const t0=performance.now(),ms=first===true?1000:800;dial.classList.add('cmSpin');
  const step=t=>{const p=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-p,3),v=from+(to-from)*e;dial.style.setProperty('--p',v.toFixed(1));if(b)b.textContent=Math.round(v);if(p<1)requestAnimationFrame(step);else dial.classList.remove('cmSpin');};requestAnimationFrame(step);};}

/* ---------- a new prospect's badge bounces in the panel ---------- */
{const _go=crmAddGo;crmAddGo=async function(){const res=await _go.apply(this,arguments);setTimeout(()=>cmPulse(document.querySelector('#crm .crmDrawer .cDHero .cBizAv'),'cmNew'),120);return res;};}

/* ---------- a quote opened while you watch ---------- */
{const _qa=qevAlert;qevAlert=function(e){_qa.apply(this,arguments);try{if(e.kind!=='open'||cmOff())return;const q=CDB.quo.find(x=>x.id===e.quote_id);if(!q||!q.prospect_id)return;
  document.querySelectorAll(`#crm .cCard[data-id="${q.prospect_id}"],#crm .crmRow[data-id="${q.prospect_id}"],#crm .cUp`).forEach(el=>{if(el.classList.contains('cUp')&&!el.querySelector(`[data-id="${q.prospect_id}"]`))return;
    el.querySelectorAll('.cmEye').forEach(x=>x.remove());el.insertAdjacentHTML('beforeend','<span class="cmEye" title="Looking at their quote now"><svg viewBox="0 0 24 24"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></span>');cmPulse(el,'cmPeek');
    setTimeout(()=>{const x=el.querySelector('.cmEye');if(x)x.remove();},12000);});}catch(x){}};}

/* ---------- the duplicate lights up behind the New prospect form ---------- */
{const _ac=crmAddCheck;crmAddCheck=function(){_ac.apply(this,arguments);document.querySelectorAll('#crm .cmDupeGlow').forEach(x=>x.classList.remove('cmDupeGlow'));
  const i=document.getElementById('crmAddIn');if(!i||!i.value.trim())return;cDupes(pParse(i.value)).forEach(r=>document.querySelectorAll(`#crm .crmMain [data-id="${r.id}"]`).forEach(x=>x.classList.add('cmDupeGlow')));};}
