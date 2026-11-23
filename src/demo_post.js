/* ===== Client hub demo, part 2: runs after the pipeline code, before the app boots ===== */
if(window.HL_DEMO){(function(){
const D=window.HL_DEMO;
{const f=document.createElement('link');f.rel='stylesheet';f.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';document.head.appendChild(f);}
/* a general set of stages and services (same ids underneath, so all the logic still works) */
const ST={video_needed:['New lead','Just came in'],video_made:['Researched','Ready to contact'],messaged:['Contacted','First message sent'],followed_up:['Followed up','Nudged at least once'],
  talking:['In conversation','They replied'],meeting:['Meeting','Booked or held'],quote_sent:['Proposal sent','Waiting on a yes'],client:['Client','Won']};
PIPE_STAGES.forEach(s=>{if(ST[s.id]){s.name=ST[s.id][0];s.hint=ST[s.id][1];}});
Object.assign(CRM_STAGE_HINT,{video_needed:'Fresh enquiries to qualify',video_made:'Ready to contact',messaged:'First message sent',followed_up:'Nudged at least once',talking:'In conversation',meeting:'Call booked or held',quote_sent:'Waiting on a decision',client:'Signed'});
PIPE_PRODUCTS.splice(0,PIPE_PRODUCTS.length,'Website','Branding','Social media','Marketing','Consulting','Support plan');

/* no game in the demo: no game pop-ups, no leaving the hub */
openModal=function(){};fireworks=function(){};pQuip=function(){return '';};
window.addEventListener('hashchange',()=>{if(location.hash!=='#pipeline')location.hash='#pipeline';});
crmSoundHtml=(f=>()=>f().replace(' This is the same switch as the sound button in the game.',''))(crmSoundHtml);

/* Google Calendar: shown as connected, nothing leaves the page */
const GD={on:true,last:Date.now()-4*60e3};
gcalState=function(){return GD.on?'on':'idle';};gcalRestore=function(){};gcalPrepare=async function(){};gcalTick=function(){};gcalSoon=function(){};gcalConnect=function(){};gcalSync=async function(){};
D.googleHtml=()=>`<div class="cSetGroup"><h4>Google Calendar</h4>${GD.on?`<p class="cSetP">Connected as <b>${D.emails[S.me]}</b>. Two-way sync: anything you add here appears in Google, and anything added in Google appears here. Last sync ${cAgo(GD.last)}.</p><div class="cRowBtns"><button class="crmGhost" data-c="gcalSync">${cSvg('sync')}Sync now</button><button class="crmGhost danger" data-c="gcalOff"><span>Disconnect</span></button></div>`:`<p class="cSetP">Connect once and your meetings, calls and payment dates stay in step with Google Calendar.</p><button class="crmPrimary" data-c="gcalGo">${cSvg('g')}Connect Google Calendar</button>`}</div>
  ${GD.on?`<div class="cSetGroup"><h4>Calendar to sync</h4><select class="cSetSel"><option>${D.biz} team</option><option>${D.names[S.me]} (main)</option></select></div>`:''}`;
const reSet=()=>{if(CRM.sheet)CRM.sheet.key='set'+Date.now();crmRender();};
Object.assign(CRM_ACT,{
  back:()=>{},
  gcalSave:()=>{},
  gcalGo:b=>{b.disabled=true;b.innerHTML=`${cSvg('sync')}Connecting…`;setTimeout(()=>{GD.on=true;GD.last=Date.now();reSet();CSND.done();toast(`<b>Google Calendar connected.</b> ${CDB.ev.filter(e=>!e.deleted).length} events in sync.`);},1100);},
  gcalSync:b=>{b.classList.add('spin');b.disabled=true;setTimeout(()=>{GD.last=Date.now();reSet();CSND.done();toast(`<b>Synced with Google.</b> Everything is up to date.`);},900);},
  gcalOff:()=>{GD.on=false;reSet();}});

/* the client's quote page is a separate private page in the live version; here, opening it shows the client side being simulated */
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href*="crm-demo-quote"]');if(!a)return;e.preventDefault();
  const q=CDB.quo.find(x=>a.href.indexOf(x.token)>-1);toast(`<b>That opens the client's private quote page.</b> Watch what happens when they read it.`);if(q)setTimeout(()=>demoQuoteVisit(q,'phone'),4000);},true);

/* ---------- sign in: same password as Sam's real account, checked by the server, never stored ---------- */
gate=function(){return new Promise(resolve=>{
  const ok=(()=>{try{const v=JSON.parse(localStorage.getItem('hl_demo_ok')||'null');return v&&v>Date.now();}catch(e){return false;}})();
  const go=()=>{try{localStorage.setItem('hl_demo_ok',JSON.stringify(Date.now()+12*3600e3));}catch(e){}demoIntro(()=>resolve('sam'));};
  if(ok){resolve('sam');return;}
  document.body.insertAdjacentHTML('beforeend',`<div id="dmGate"><div class="dmBg"><i></i><i></i><i></i></div><form class="dmCard" autocomplete="on">
    <span class="dmMark">${D.mark}</span><h1>${D.biz}</h1><p>Client hub · live demo</p>
    <label><span>Password</span><input id="dmPw" type="password" autocomplete="current-password" placeholder="Enter the demo password" required></label>
    <button id="dmGo" type="submit"><span>Open the demo</span><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
    <small id="dmMsg">Sample business and data, made up for demonstration.</small></form></div>`);
  const g=document.getElementById('dmGate'),f=g.querySelector('form'),pw=g.querySelector('#dmPw'),btn=g.querySelector('#dmGo'),msg=g.querySelector('#dmMsg');setTimeout(()=>pw.focus(),300);
  f.addEventListener('submit',async e=>{e.preventDefault();if(!pw.value.trim())return;btn.disabled=true;btn.classList.add('busy');
    try{if(!window.supabase||!window.supabase.createClient||!D.auth||!D.auth.email)throw new Error('offline');
      const sb=window.supabase.createClient(D.auth.url,D.auth.key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false,storageKey:'hl-demo-auth'}});
      const {error}=await sb.auth.signInWithPassword({email:D.auth.email,password:pw.value.trim()});if(error)throw error;
      g.classList.add('out');try{CSND.done();}catch(x){}setTimeout(()=>{g.remove();go();},450);}
    catch(err){btn.disabled=false;btn.classList.remove('busy');f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake');pw.value='';
      msg.textContent=err&&err.message==='offline'?'Could not reach the server. Check the connection and try again.':'That password is not right. Try again.';msg.classList.add('bad');try{CSND.err();}catch(x){}}});
});};
function demoIntro(done){document.body.insertAdjacentHTML('beforeend',`<div id="dmIntro"><span class="dmMark">${D.mark}</span><b>${D.biz}</b></div>`);const el=document.getElementById('dmIntro');
  setTimeout(()=>{done();el.classList.add('out');setTimeout(()=>el.remove(),700);},1050);}

/* ---------- live demo: things keep happening, like a real working day ---------- */
const LEADS=[['Maple & Moss Interiors','Zara Ahmed','Interior design'],['Coastline Kayaks','Ethan Brooks','Outdoor activities'],['The Gilded Fork','Amelia Stone','Restaurant'],['Fresh Start Cleaning','Mia Robinson','Cleaning'],['Stonebridge Builders','Liam Murphy','Construction'],
  ['Cloud Nine Cakes','Poppy Evans','Bakery'],['Northern Light Photography','Harvey Scott','Photography'],['Blue Door Boutique','Ivy Parker','Fashion'],['Forge Strength Club','Noah Wright','Gym'],['Hearth & Home Lettings','Ella Morgan','Lettings']];
let leadN=0,quiet=0;
function demoQuoteVisit(q,dev){const t=Date.now(),v='live'+Math.random().toString(36).slice(2,6);const ev=(k,d,ms)=>({id:cdbUid(),quote_id:q.id,kind:k,detail:d,visit:v,at:new Date(t+ms).toISOString()});
  const steps=[ev('open',{dev:dev||'phone'},0),ev('package',{name:'Growth'},9000),ev('package',{name:'Scale'},16000),ev('breakdown',{},24000),ev('addon',{name:'Content day',on:true},31000),ev('pdf',{},42000),ev('time',{s:228,scroll:94},50000)];
  steps.forEach((e,i)=>setTimeout(()=>{CDB.qev.push(e);cdbSave('qev');if(i===0){q.status=q.status==='accepted'?'accepted':'viewed';q.view_count=(q.view_count||0)+1;q.viewed_at=e.at;cdbSave('quo');qevAlert(e);}
    if(typeof CRM!=='undefined'&&CRM.sheet&&CRM.sheet.type==='quote'&&typeof qtRefresh==='function')qtRefresh();else crmRender();},+new Date(e.at)-t));}
const EVENTS=[
  [3,()=>{const q=CDB.quo.filter(x=>x.status!=='accepted')[Math.floor(Math.random()*CDB.quo.length)]||CDB.quo[0];if(!q)return false;demoQuoteVisit(q,Math.random()<.6?'phone':'computer');}],
  [3,async()=>{const l=LEADS[leadN++%LEADS.length];const src=['website form','Instagram','a referral','Google'][leadN%4];
    await pipeInsert({business:l[0],contact:l[1],niche:l[2],stage:'video_needed',owner:leadN%2?'sam':'james',notes:`New enquiry via ${src}.`,products:[PIPE_PRODUCTS[leadN%PIPE_PRODUCTS.length]],rag:'likely',last_contact:G.today});
    CSND.add();toast(`<b>New lead:</b> ${cEsc(l[0])} came in through ${src}.`);demoFlash(l[0]);}],
  [2,async()=>{const r=PIPE.rows.find(x=>x.stage==='messaged'||x.stage==='followed_up');if(!r)return false;await pMove(r.id,'talking');toast(`<b>${cEsc(r.contact||r.business)} replied.</b> ${cEsc(r.business)} moved to In conversation.`);demoFlash(r.business);}],
  [2,async()=>{const due=[];PIPE.rows.filter(r=>r.stage==='client'&&r.deal_period&&r.deal_period!=='one_off').forEach(r=>{payDates(r,addDays(G.today,-40),addDays(G.today,6)).forEach(d=>{if(!payPaid(r,d))due.push([r,d]);});});
    if(!due.length){const r=PIPE.rows.find(x=>x.stage==='client'&&x.deal_period==='monthly');if(!r)return false;await cdbInsert('pay',{prospect_id:r.id,due:G.today,amount:+r.deal_value,paid_by:S.me,paid_at:new Date().toISOString()});CSND.paid();toast(`<b>Payment in:</b> ${pMoney(r.deal_value)} from ${cEsc(r.business)}.`);demoConfetti(.5);return;}
    const [r,d]=due[0];await payMark(r,d);toast(`<b>Payment in:</b> ${pMoney(r.deal_value)} from ${cEsc(r.business)}.`);demoConfetti(.5);}],
  [1,async()=>{const r=PIPE.rows.find(x=>x.stage==='quote_sent');if(!r)return false;const q=CDB.quo.find(x=>x.prospect_id===r.id);if(q){q.status='accepted';q.accepted_at=new Date().toISOString();q.accepted_choice='Growth';cdbSave('quo');
      qevAlert({quote_id:q.id,kind:'accept',detail:{choice:'Growth'},at:new Date().toISOString()});}
    await pipePatch(r.id,{deal_value:r.deal_value||995,deal_period:r.deal_period||'monthly',billing_start:G.today,package:r.package||'pkg_growth'});await pMove(r.id,'client');toast(`<b>${cEsc(r.business)} said yes!</b> New client on ${pMoney(r.deal_value||995)} a month.`);}]];
function demoTick(){const t=setTimeout(demoTick,14000+Math.random()*12000);
  if(document.hidden||!document.documentElement.classList.contains('crmOpen'))return;const a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))return;
  if(CRM.drag||document.querySelector('#crm .cCard.dragging'))return;
  const tot=EVENTS.reduce((s,e)=>s+e[0],0);let x=Math.random()*tot,ev=EVENTS[0];for(const e of EVENTS){x-=e[0];if(x<=0){ev=e;break;}}Promise.resolve(ev[1]()).catch(()=>{});}
function demoFlash(name){setTimeout(()=>{[...document.querySelectorAll('#crm .cCard,#crm .cRow,#crm .crmTr')].filter(el=>el.textContent.indexOf(name)>-1).forEach(el=>{el.classList.remove('dmFlash');void el.offsetWidth;el.classList.add('dmFlash');});},250);}

/* ---------- confetti for a won client ---------- */
function demoConfetti(power=1){if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;let cv=document.getElementById('dmConfetti');if(!cv){cv=document.createElement('canvas');cv.id='dmConfetti';document.body.appendChild(cv);}
  const dpr=Math.min(2,devicePixelRatio||1);cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;const c=cv.getContext('2d');c.scale(dpr,dpr);
  const cols=['#3E6AAE','#D3962A','#C2405A','#5DBE9C','#FFEDED','#F6D58A'],N=Math.round(160*power),P=[];
  for(let i=0;i<N;i++){const side=i%2?1:-1;P.push({x:innerWidth/2+side*innerWidth*.18,y:innerHeight*.35,vx:(Math.random()*7+2)*side*(Math.random()<.3?-1:1),vy:-(Math.random()*11+6),r:Math.random()*360,vr:(Math.random()-.5)*14,w:6+Math.random()*6,h:3+Math.random()*4,col:cols[i%cols.length],sh:Math.random()<.3});}
  const t0=performance.now();cancelAnimationFrame(cv._raf);const step=t=>{const e=t-t0;c.clearRect(0,0,innerWidth,innerHeight);P.forEach(p=>{p.vy+=.32;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;c.save();c.translate(p.x,p.y);c.rotate(p.r*Math.PI/180);c.globalAlpha=Math.max(0,1-e/2600);c.fillStyle=p.col;
    if(p.sh){c.beginPath();c.arc(0,0,p.h*.8,0,Math.PI*2);c.fill();}else c.fillRect(-p.w/2,-p.h/2,p.w,Math.cos(p.r/20)*p.h);c.restore();});if(e<2700)cv._raf=requestAnimationFrame(step);else c.clearRect(0,0,innerWidth,innerHeight);};cv._raf=requestAnimationFrame(step);}
{const _w=CSND.won;CSND.won=function(){_w.apply(this,arguments);demoConfetti(1);};}

/* ---------- once the hub is up: finish the sample quotes, add the live badge, start the day ---------- */
const ready=setInterval(()=>{if(!document.documentElement.classList.contains('crmOpen')||!CDB.ready||!PIPE.rows.length)return;clearInterval(ready);
  let ch=false;CDB.quo.forEach(q=>{if(q.data&&q.data.v)return;const r=PIPE.rows.find(x=>x.id===q.prospect_id);if(!r)return;const d=qtNew(r);
    d.from=q.created_by==='james'?'james':'sam';d.validUntil=q.valid_until||d.validUntil;d.packages=['pkg_starter','pkg_growth','pkg_scale'].map((id,i)=>{const c=catBy(id);return {name:c.name,price:c.price,period:'monthly',care:0,careName:'',tag:i===1?'Most popular':'',rec:i===1,cat:id};});
    d.items=(catBy('pkg_growth').note||'').split(/,\s*|\s+and\s+/).filter(Boolean).slice(0,5).map(n=>({n:n.charAt(0).toUpperCase()+n.slice(1),s:'',m:'',from:0}));q.data=d;ch=true;});
  if(ch){cdbSave('quo');crmRender();}
  if(!document.getElementById('dmLive'))document.body.insertAdjacentHTML('beforeend',`<div id="dmLive" title="Sample data. Things happen on their own, like a real day."><i></i>Live demo</div>`);
  setTimeout(demoTick,7000);},300);
})();}
