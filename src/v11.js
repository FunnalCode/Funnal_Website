/* ============================== v11: follow-ups ============================== */
// Hold the DM sent button to flip it into follow-up mode. A follow-up pays half a DM
// (5 XP, 1 doubloon, boosted by the emissary flag and the Golden Tide) and never counts
// towards the target, sea foes, voyages, fishing, challenges or quests.
const FU_CAP=400,FU_CD=1,FU_HOLD=450,FU_IDLE=5*60000;
const DM_SUB='hold for follow-ups';
const FU_BOTTLE='M9.2 2.6h5.6v2.2h-.9v3.1c2.5 1 4.1 3.3 4.1 6v5.4c0 1.2-1 2.1-2.2 2.1H8.2c-1.2 0-2.2-.9-2.2-2.1V13.9c0-2.7 1.6-5 4.1-6V4.8h-.9z';

/* ---------- achievements ---------- */
const FU_FAM=[[1,'Message in a Bottle'],[50,'Second Wind'],[250,'Boomerang Bosun'],[1000,'The Persistent Parrot'],[3000,'Relentless Tide'],[7500,'The Tide Always Returns']];
FU_FAM.forEach(([n,name],i)=>{const id='f_'+i;if(ACH_BY_ID[id])return;const a={id,name,desc:`Send ${n.toLocaleString('en-GB')} follow-up${n>1?'s':''}`,rar:RARITIES[i],cat:'Follow-ups',metric:'f',target:n,tier:TIERS[i],fam:'f'};ACHIEVEMENTS.push(a);ACH_BY_ID[id]=a;});
[['fu_day30','Bottle Storm','Send 30 follow-ups in one day','rare','Follow-ups',['bestF',30]],
 ['fu_day75','Message Monsoon','Send 75 follow-ups in one day','epic','Follow-ups',['bestF',75]],
 ['fu_double','One-Two Punch','Send 25 DMs and 25 follow-ups on the same day','rare','Follow-ups',['fuDouble',1]]]
 .forEach(([id,name,desc,rar,cat,[metric,target]])=>{if(ACH_BY_ID[id])return;const a={id,name,desc,rar,cat,metric,target,secret:false};ACHIEVEMENTS.push(a);ACH_BY_ID[id]=a;});
const FU_ACH=[...FU_FAM.map((_,i)=>'f_'+i),'fu_day30','fu_day75','fu_double'];
Object.assign(ACH_GLYPH,{f:'bottle',bestF:'bottle',fuDouble:'bottle'});

/* ---------- cosmetics ---------- */
const FU_ITEMS=[
 {id:'dk_bottles',name:'Bottle Rack',cat:'deck',st:'bottles',desc:'Three messages, ready to go back out.',earn:['f',25,'Send 25 follow-ups','follow-ups']},
 {id:'flag_bottle',name:'Message-in-a-Bottle Flag',cat:'flag',col:'#246A63',sym:'bottle',sc:'#FFF3D6',desc:'Flown by captains who always write back.',earn:['f',150,'Send 150 follow-ups','follow-ups']},
 {id:'sail_bottle',name:'Bottle Post Sails',cat:'sail',col:'#F4EFE4',col2:'#246A63',pat:'bottles',desc:'Every bottle finds a shore eventually.',earn:['f',750,'Send 750 follow-ups','follow-ups']},
 {id:'hull_echo',name:'Echo Hull',cat:'hull',col:'#2F6F6A',col2:'#245854',pat:'echo',gold:true,desc:'Ripples that never quite stop.',earn:['f',2500,'Send 2,500 follow-ups','follow-ups']},
];
FU_ITEMS.forEach(i=>{if(!ALL_ITEMS[i.id]){ITEMS.push(i);ALL_ITEMS[i.id]=i;}});

/* ---------- art ---------- */
const _ds11=drawSymbol;drawSymbol=function(c,sym,cx,cy,s,col){if(sym!=='bottle')return _ds11(c,sym,cx,cy,s,col);
  c.save();c.translate(cx,cy);c.scale(s,s);c.rotate(-.6);rr(c,-1.6,-.9,3.2,4.3,1.1,col);R(c,-.7,-2.7,1.4,2,col);R(c,-.85,-3.4,1.7,.8,col);
  c.globalAlpha=.45;R(c,-.9,.3,1.8,2.2,'#000');c.globalAlpha=1;c.restore();};
const _ag11=achGlyph;achGlyph=function(c,g,col,acc){if(g!=='bottle')return _ag11(c,g,col,acc);
  c.save();c.rotate(-.55);rr(c,-4.8,-2.6,9.6,12,3.6,col);R(c,-2.2,-8,4.4,5.8,col);R(c,-2.7,-10.4,5.4,2.6,acc);rr(c,-2.8,.6,5.6,5.2,.8,acc);c.restore();};
SAIL_PATS.bottles=function(c,s,x,y,w,h,t,mk){
  c.fillStyle=s.col2;c.globalAlpha=.22;c.beginPath();c.moveTo(x-3,y+h+3);for(let xx=x-3;xx<=x+w+8;xx+=1.5)c.lineTo(xx,y+h*.76+Math.sin(xx/2.6+t/520)*.9);c.lineTo(x+w+8,y+h+3);c.closePath();c.fill();c.globalAlpha=1;
  for(let i=0;i<3;i++)drawSymbol(c,'bottle',x+w*(.18+i*.32),y+h*.8+Math.sin(t/450+i*2)*.7,Math.min(w,h)/24,s.col2);
  if(mk)drawSymbol(c,'bottle',x+w/2+1,y+h*.4,Math.min(w,h)/9.5,s.col2);};
const _hp11=hullPat;hullPat=function(c,h,t){if(h.pat!=='echo')return _hp11(c,h,t);
  c.lineWidth=.7;for(let k=0;k<5;k++){const r=((t/70)+k*10)%50,a=Math.max(0,1-r/50);c.strokeStyle=`rgba(191,230,223,${(a*.55).toFixed(3)})`;c.beginPath();c.arc(2,-6,r,0,TAU);c.stroke();}
  R(c,-40,-18,84,1.4,'#F2C462');R(c,-40,1.6,84,.8,'rgba(242,196,98,.7)');drawSymbol(c,'bottle',2,-7,1.5,'#FFF3D6');};
const _dd11=drawDeckItem;drawDeckItem=function(c,id,x,y,t){const d=it(id);if(!d||d.st!=='bottles')return _dd11(c,id,x,y,t);
  [[-2.6,'#3A8C84'],[0,'#7CC7E6'],[2.6,'#45B07C']].forEach(([ox,col],i)=>{const bob=Math.sin(t/700+i)*.15;rr(c,x+ox-1.05,y-7.6+bob,2.1,4.8,.8,col);R(c,x+ox-.45,y-9.2+bob,.9,1.8,col);R(c,x+ox-.55,y-9.8+bob,1.1,.7,'#B98A4A');R(c,x+ox-.55,y-6.6+bob,1.1,1.8,'rgba(255,243,214,.85)');});
  rr(c,x-4.2,y-3.2,8.4,3.2,.5,'#9A6A44');R(c,x-4.2,y-2.1,8.4,.45,'#7C5233');};

/* ---------- the flip ---------- */
function fuPaintMini(){const b=$('#myToday');if(!b)return;const box=b.parentElement;if(box)box.classList.toggle('fu',!!S.fuMode);const l=$('#myTodayL');if(l)l.textContent=S.fuMode?'follow-ups':'today';
  if(G&&S.me&&G.days[G.today])b.textContent=G.days[G.today].p[S.me][S.fuMode?'f':'d']||0;}
function fuSet(on,quiet){const btn=$('#b_d');if(!btn)return;S.fuMode=!!on;S.fuLast=Date.now();
  const flip=()=>{btn.classList.toggle('fu',S.fuMode);btn.dataset.k=S.fuMode?'f':'d';btn.setAttribute('aria-label',S.fuMode?'Follow-up sent':'DM sent');fuPaintMini();};
  btn.classList.remove('holding');
  if(quiet||!btn.animate){flip();return;}
  const a=btn.animate([{transform:'perspective(600px) rotateX(0deg)'},{transform:'perspective(600px) rotateX(90deg)'}],{duration:130,easing:'ease-in'});
  a.onfinish=()=>{flip();btn.animate([{transform:'perspective(600px) rotateX(-90deg)'},{transform:'perspective(600px) rotateX(0deg)'}],{duration:190,easing:'ease-out'});};
  try{tone(S.fuMode?520:780,.06,'triangle',.05);tone(S.fuMode?780:520,.08,'triangle',.05,.07);navigator.vibrate&&navigator.vibrate(25);}catch(e){}
  if(S.fuMode){let seen=false;try{seen=localStorage.getItem('hc_fu_seen')==='1';localStorage.setItem('hc_fu_seen','1');}catch(e){}
    toast(seen?'<b>Follow-up mode.</b> Hold again for DMs.':`<b>Follow-up mode.</b> Each tap logs a follow-up: half a DM's XP and ${CN}. They don't count towards the target, foes or voyages. Hold again to switch back.`,'',seen?1600:5200);}
  else toast('<b>Back to DMs.</b>','',1200);}
function fuSplash(btn){S.fuLast=Date.now();if(!btn)return;btn.classList.remove('ping');void btn.offsetWidth;btn.classList.add('ping');clearTimeout(btn._pt);btn._pt=setTimeout(()=>btn.classList.remove('ping'),650);}
SFX.f=()=>{tone(740,.05,'triangle',.05);tone(1110,.06,'sine',.035,.045);};
function fuBind(){const btn=$('#b_d');if(!btn||btn._fu)return;btn._fu=1;
  const hb=document.createElement('i');hb.className='holdBar';btn.appendChild(hb);
  let tm=null,sx=0,sy=0;const cancel=()=>{clearTimeout(tm);tm=null;btn.classList.remove('holding');};
  btn.addEventListener('pointerdown',e=>{if(e.button)return;sx=e.clientX;sy=e.clientY;cancel();btn.classList.add('holding');
    tm=setTimeout(()=>{tm=null;S.fuSuppress=Date.now()+1200;fuSet(!S.fuMode);},FU_HOLD);});
  btn.addEventListener('pointermove',e=>{if(tm&&Math.hypot(e.clientX-sx,e.clientY-sy)>14)cancel();});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>btn.addEventListener(ev,cancel));
  btn.addEventListener('contextmenu',e=>e.preventDefault());
  // the click that ends a hold must not log anything
  btn.addEventListener('click',e=>{if(Date.now()<(S.fuSuppress||0)){S.fuSuppress=0;e.preventDefault();e.stopImmediatePropagation();}},true);
  setInterval(()=>{if(S.fuMode&&Date.now()-(S.fuLast||0)>FU_IDLE){fuSet(false,true);toast('<b>Back to DMs.</b> Follow-up mode switches off after 5 quiet minutes.','',3000);}},15000);}

/* ---------- follow-ups card in the Captain's Ledger ---------- */
function fuLedgerCard(){const P=G.P,today=G.today;const days=Array.from({length:14},(_,i)=>addDays(today,i-13));const fOf=(p,d)=>G.days[d]?.p[p]?.f||0;
  return `<div class="card"><h3>Follow-ups · last 14 days</h3><small>Stacked by captain. Hold the DM sent button to log one.</small><div class="chart" style="margin-top:6px">${svgBars(days.map(d=>({label:DAYN[wd(d)].slice(0,2),parts:P.map(p=>[fOf(p,d),pcolHex(p)]),title:`${shortDate(d)}: ${P.map(p=>pname(p)+' '+fOf(p,d)).join(', ')}`})),{label:'Follow-ups per day',bw:13,gap:6,h:140})}</div>
   <div class="row tiny" style="margin-top:4px">${P.map(p=>{const pl=G.players[p];return `<span><i class="dot" style="background:${pcol(p)}"></i>${pname(p)}: ${fmtN(pl.counts.f||0)} all time · best day ${pl.m.bestF||0}</span>`;}).join('')}</div>
   <p class="tiny muted" style="margin:6px 0 0">Bottle gear is in the Shop and follow-up achievements are in Achievements.</p></div>`;}

/* ---------- help ---------- */
(()=>{const i=HELP.findIndex(x=>x[0]==='Golden Tide');HELP.splice(i<0?HELP.length:i+1,0,['Follow-ups','When you go back and nudge someone you already DMed, log it as a follow-up. Press and hold the DM sent button for half a second and it flips into a teal Follow-up button; hold again to flip back (it also flips back by itself after 5 quiet minutes). A follow-up pays half a DM: 5 XP and 1 doubloon, boosted by your emissary flag and the Golden Tide, with a small chance of loot. Follow-ups are personal and never count towards the daily target, sea foes, voyages, fishing casts, challenges or DM quests, but some daily and weekly quests ask for follow-ups. The Ledger tracks them for both captains (with a 14-day chart and follow-ups per 10 DMs), the Salty Herald reports them in its Bottle post column, and the end-of-day card, end-of-week card and Weekly review (including the shareable image) all show them. They have their own achievements in Achievements and four pieces of bottle gear in the Shop: Bottle Rack (25), Message-in-a-Bottle Flag (150), Bottle Post Sails (750) and Echo Hull (2,500).']);})();

/* ---------- follow-up quests (in the pools from 20 Nov 2026 for daily, the week of 23 Nov for weekly,
   so quests already shown before the feature existed are not reshuffled) ---------- */
const FU_Q_DAY='2026-11-20',FU_Q_WEEK='2026-11-23';
const FU_DQ=[{id:'fu10',name:'Send 10 follow-ups',m:'dFu',n:10,xp:30,g:10},{id:'fu25',name:'Send 25 follow-ups',m:'dFu',n:25,xp:60,g:18}];
const FU_WQ=[{id:'wfu60',name:'Send 60 follow-ups',m:'wFu',n:60,xp:250,g:70}];
const FU_LQ=[{id:'lfu1k',name:'Send 1,000 lifetime follow-ups',m:'f',n:1000,xp:2000,g:600}];
function fuQuestPool(pool,date,kind){if(kind==='d')return date>=FU_Q_DAY?[...pool,...FU_DQ]:pool;if(kind==='w')return date>=FU_Q_WEEK?[...pool,...FU_WQ]:pool;return [...pool,...FU_LQ];}

/* ---------- the Herald's follow-up column ---------- */
function heraldBottle(date,D){const P=G.P;const n=p=>D.p[p].f||0;const tot=P.reduce((a,p)=>a+n(p),0);
  if(!tot)return 'No bottles went out. Somewhere, a prospect wonders if you ever cared.';
  const top=[...P].sort((a,b)=>n(b)-n(a))[0];const quip=pick(['The postman has filed a formal complaint.','Several prospects report hearing a gentle knocking.','Gary carried three of them himself. He wants a raise.','Persistence, the editor notes, is just politeness with stamina.','The bottle factory is running a double shift.'],date+'fu');
  return `${tot} follow-up${tot>1?'s':''} sent${P.length>1?`, ${n(top)} by ${pname(top)}`:''}. ${quip}`;}
(()=>{const add=(t,s)=>{const x=HELP.find(h=>h[0]===t);if(x&&!x[1].includes(s))x[1]+=' '+s;};
  add('The five buttons','Hold DM sent for half a second to flip it into a Follow-up button for nudging people you already messaged; hold again to flip back.');
  add('What each one pays','Follow-up: 5 XP and 1 doubloon (half a DM, with the same boosts).');
  add('Reviews','Follow-ups appear in the weekly review, the shareable image, the end-of-day and end-of-week cards, the Ledger and the Salty Herald.');})();
