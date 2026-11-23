/* ============================== 22 Nov (night): the pipeline, second pass ==============================
   A calm, high-end workspace on top of the game, in Funnal's colours. Laid out like a modern studio dashboard:
   a sidebar that folds to a slim rail, a greeting, four stat cards (one tinted, one dark), a follow-up list with
   sliding pill tabs, a dark "Up next" card, a board of soft columns and a floating details panel.
   Phones get a floating tab bar at the bottom and sheets that slide up.
   Motion: pill highlights slide with the leading edge first and the trailing edge catching up, numbers count up,
   panels rise in one after another, bars grow, ticked rows fold away. All of it switches off for reduced motion.
   Same data, shared tables and history as before. Edits save as you type. */
const CRM={view:'today',q:'',owner:'all',stage:'messaged',open:null,closed:false,review:false,tab:null,adding:false,from:'harbour',drag:null,saveT:{},anim:true,search:false,
  rail:(()=>{try{return localStorage.getItem('hl_crm_rail')==='1';}catch(e){return false;}})()};
const CRM_STAGE_COL={video_needed:'#C91E36',video_made:'#B98A8A',messaged:'#486790',followed_up:'#7FA2D2',talking:'#DDA94D',meeting:'#B8862E',quote_sent:'#566C80',client:'#3F5160',not_now:'#9A9A9A',no_response:'#B4B4B4'};
const CRM_STAGE_HINT={video_needed:'Record a Loom for these',video_made:'Ready to send',messaged:'First message sent',followed_up:'Nudged at least once',talking:'In conversation',meeting:'Call booked or held',quote_sent:'Waiting on a decision',client:'Signed',not_now:'Comes back on a date',no_response:'Parked'};
const CRM_REDUCED=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const cEsc=s=>esc(s==null?'':String(s));
const cIni=s=>String(s||'?').replace(/^the\s+/i,'').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase()||'?';
const cDays=d=>d?Math.round((Date.parse(d+'T12:00:00Z')-Date.parse(G.today+'T12:00:00Z'))/864e5):null;
function cRel(d){const n=cDays(d);if(n==null)return '';if(n===0)return 'today';if(n===1)return 'tomorrow';if(n===-1)return 'yesterday';if(n<0)return `${-n} days ago`;if(n<7)return 'on '+new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'long',timeZone:'UTC'});return pShortD(d);}
function cDueLabel(x){const n=cDays(x.d);if(x.cls==='stale')return 'Gone quiet';if(n<0)return `${-n}d overdue`;if(n===0)return 'Due today';if(n===1)return 'Tomorrow';return pShortD(x.d);}
const cName=p=>p==='sam'?'Sam':p==='james'?'James':(p?pnameRaw(p):'');
const cOwnerName=p=>p?cName(p):'Unassigned';
const cAv=(p,cls='')=>p?`<span class="cAv ${cls}" style="--ac:${pcolHex(p)}" title="${cEsc(cOwnerName(p))}">${cEsc(cOwnerName(p)[0])}</span>`:'';
const cOwnerChip=p=>cAv(p);
const cBiz=(r,cls='')=>`<span class="cBizAv ${cls}" style="--sc:${CRM_STAGE_COL[r.stage]||'#6B6B6B'}">${cEsc(cIni(r.business))}</span>`;
const cRows=()=>{const q=CRM.q.trim().toLowerCase();return PIPE.rows.filter(r=>(!CRM.review||r.review)&&(!q||pSearchKey(r).includes(q)));};
const cIcon={back:'M15 18l-6-6 6-6',search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16l-4.3-4.3',plus:'M12 5v14M5 12h14',x:'M6 6l12 12M18 6L6 18',check:'M5 12.5l4.2 4.2L19 7',clock:'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',arrow:'M5 12h14M13 6l6 6-6 6',up:'M7 17L17 7M8 7h9v9',play:'M8 5v14l11-7z',doc:'M7 3h7l5 5v13H7zM14 3v5h5',ig:'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-1.5h.01',web:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z',trash:'M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',star:'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',flag:'M5 21V4M5 4h11l-2 4 2 4H5',
  today:'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 9h16M9 13.5l2 2 4-4',board:'M4 5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM10.5 5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1zM17 5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1z',clients:'M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z',
  users:'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M18 14a6 6 0 0 1 4 7',rail:'M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM9 4v16',sun:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',moon:'M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z',
  money:'M12 3v18M16.5 7.5c-.7-1.4-2.4-2.2-4.5-2.2-2.6 0-4.3 1.3-4.3 3.2 0 4.5 9 2.3 9 6.8 0 1.9-1.9 3.4-4.7 3.4-2.3 0-4-.9-4.8-2.5',target:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',layers:'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5'};
const cSvg=(k,cls='')=>`<svg class="cI ${cls}${k==='g'?' fill':''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${cIcon[k]}"/></svg>`;
const CRM_LOGO='M289.6 2.9C288.6 2.3 288.0 2.1 287.0 1.7C286.0 1.4 285.6 1.1 283.7 0.8C281.7 0.5 278.5 0.0 275.2 0.0C271.9 -0.0 267.6 0.4 263.8 0.8C260.1 1.1 256.8 1.6 252.7 2.3C248.7 3.0 245.2 3.6 239.5 4.8C233.8 6.1 225.5 8.0 218.7 9.7C211.9 11.4 206.5 12.9 198.9 15.1C191.3 17.2 182.1 19.9 173.1 22.7C164.1 25.4 154.8 28.4 144.8 31.7C134.8 34.9 133.1 35.3 113.1 42.2C93.2 49.1 40.9 67.3 25.3 73.0C9.6 78.7 21.4 74.9 19.4 76.2C17.4 77.5 15.1 79.2 13.2 80.7C11.4 82.2 9.8 83.9 8.4 85.5C7.0 87.1 5.8 88.9 5.0 90.2C4.1 91.6 3.7 92.4 3.2 93.5C2.7 94.7 2.4 95.3 1.9 97.1C1.4 98.9 0.6 102.1 0.4 104.4C0.1 106.7 0.1 108.5 0.3 111.0C0.5 113.5 1.0 116.7 1.6 119.5C2.2 122.3 3.0 125.0 3.9 128.0C4.9 131.0 6.1 134.1 7.5 137.5C8.9 140.8 9.5 142.3 12.2 148.1C15.0 153.9 21.7 168.0 23.9 172.4C26.2 176.9 25.1 174.0 25.8 174.7C26.5 175.4 27.1 176.0 28.1 176.6C29.1 177.3 30.5 178.1 31.9 178.7C33.2 179.4 33.1 179.5 36.1 180.6C39.2 181.6 42.2 182.8 50.1 185.0C58.0 187.3 76.6 192.0 83.6 194.1C90.7 196.1 90.5 196.6 92.3 197.4C94.2 198.2 94.2 198.4 94.9 198.9C95.7 199.4 96.1 199.9 96.7 200.5C97.2 201.2 97.7 202.0 98.2 202.9C98.6 203.8 99.1 204.9 99.5 206.0C99.8 207.1 100.1 208.2 100.3 209.5C100.6 210.8 100.8 211.7 100.8 213.5C100.9 215.4 101.2 216.0 100.8 220.6C100.4 225.2 98.8 236.7 98.3 241.4C97.8 246.0 97.8 246.1 97.8 248.5C97.8 250.8 97.9 253.4 98.1 255.6C98.3 257.8 98.6 259.5 99.2 261.7C99.8 263.9 100.8 266.6 101.9 268.8C103.0 270.9 104.0 272.7 105.7 274.7C107.5 276.7 109.8 279.0 112.2 281.0C114.6 283.0 117.3 285.0 120.0 286.6C122.7 288.2 125.5 289.6 128.3 290.7C131.0 291.8 134.4 292.7 136.8 293.3C139.1 293.9 140.5 294.0 142.2 294.2C143.8 294.3 144.7 294.5 146.7 294.4C148.6 294.4 151.8 294.1 153.8 293.9C155.7 293.6 156.9 293.3 158.2 292.9C159.6 292.5 160.1 292.5 161.8 291.7C163.5 290.9 167.0 289.1 168.6 288.2C170.3 287.2 170.7 286.8 171.7 285.9C172.7 285.0 173.5 284.4 174.8 283.0C176.0 281.5 177.8 279.5 179.2 277.0C180.6 274.6 179.7 276.7 183.3 268.5C187.0 260.4 187.7 259.2 201.1 228.4C214.6 197.6 248.5 119.0 263.9 83.8C279.3 48.7 288.3 29.1 293.4 17.2C298.6 5.4 294.5 13.9 294.7 12.5C294.8 11.1 294.7 10.2 294.4 9.0C294.1 7.8 293.5 6.5 292.7 5.5C291.9 4.4 290.5 3.5 289.6 2.9ZM245.1 37.3C245.5 37.5 246.0 38.0 246.3 38.5C246.5 39.1 246.6 39.7 246.6 40.6C246.5 41.6 246.4 42.8 246.1 44.2C245.8 45.5 245.7 46.3 244.9 48.9C244.0 51.5 243.1 54.7 241.1 59.8C239.1 64.8 237.1 69.6 232.9 79.1C228.7 88.6 223.3 100.4 215.8 116.7C208.3 132.9 195.8 159.7 187.7 176.7C179.6 193.6 172.4 207.8 167.0 218.5C161.7 229.1 159.2 233.8 155.7 240.4C152.2 247.1 147.9 255.0 146.0 258.4C144.0 261.8 144.8 260.2 144.0 260.6C143.3 261.1 142.7 261.2 141.7 261.2C140.8 261.2 139.8 261.1 138.4 260.9C137.0 260.6 135.1 260.2 133.4 259.6C131.8 259.1 129.6 258.3 128.5 257.7C127.5 257.2 127.5 257.1 127.1 256.4C126.7 255.8 126.5 254.7 126.3 253.7C126.1 252.7 126.0 252.3 125.9 250.4C125.8 248.4 125.7 245.7 125.9 242.1C126.2 238.5 126.4 235.6 127.5 228.9C128.6 222.1 131.4 207.8 132.5 201.5C133.6 195.1 133.8 194.0 134.1 190.8C134.4 187.7 134.4 184.2 134.3 182.3C134.3 180.4 134.0 180.3 133.8 179.5C133.6 178.7 133.4 178.1 132.9 177.4C132.5 176.7 131.9 175.9 131.1 175.4C130.2 174.8 134.2 175.6 128.0 174.1C121.8 172.6 101.5 168.1 94.0 166.3C86.5 164.5 86.5 164.3 83.1 163.3C79.8 162.3 77.4 161.7 73.9 160.4C70.4 159.1 64.9 156.8 62.1 155.6C59.4 154.4 58.7 153.8 57.4 153.0C56.1 152.3 55.4 152.0 54.3 151.0C53.2 150.0 52.0 148.8 50.8 147.1C49.6 145.5 48.3 143.3 47.2 141.2C46.1 139.2 45.1 137.1 44.0 134.6C43.0 132.1 41.8 129.0 40.9 126.4C40.0 123.8 39.4 121.6 38.8 119.0C38.2 116.5 37.7 113.4 37.4 111.2C37.1 109.1 37.1 107.4 37.1 106.0C37.2 104.7 37.4 103.8 37.6 103.0C37.8 102.2 37.8 101.8 38.3 101.1C38.7 100.4 39.2 99.7 40.4 98.9C41.6 98.1 41.6 97.9 45.3 96.2C49.1 94.5 56.3 91.4 63.1 88.8C69.9 86.2 75.4 84.2 86.2 80.5C97.0 76.9 114.2 71.3 127.8 67.1C141.4 62.9 153.2 59.3 167.7 55.1C182.1 51.0 204.3 45.0 214.5 42.3C224.6 39.6 224.9 39.8 228.6 38.9C232.4 38.1 234.8 37.7 236.9 37.3C239.0 37.0 240.2 36.9 241.4 36.8C242.5 36.8 243.1 36.8 243.7 36.9C244.4 37.0 244.7 37.0 245.1 37.3Z';
const cMark=(cls='')=>`<span class="crmMark ${cls}"><svg viewBox="0 0 295 295" aria-hidden="true"><path fill-rule="evenodd" d="${CRM_LOGO}"/></svg></span>`;
// a number that counts up when its panel first appears
const cNum=(n,fmt='int')=>{const txt=fmt==='money'?pMoney(n):fmt==='pct'?n+'%':String(n);return `<span class="cNum" data-n="${+n||0}" data-fmt="${fmt}">${cEsc(txt)}</span>`;};

/* ---------- sliding pills: the leading edge goes first, the trailing edge catches up ---------- */
const CRM_PILL={};
function cPills(root,animate=true){
  /* 23 Nov: read every size first, then write, so the browser lays the page out once rather than once per pill group */
  const gs=[...root.querySelectorAll('[data-pill]')];
  gs.forEach(g=>{if(!g.querySelector(':scope>.cPill')){const p=document.createElement('i');p.className='cPill';p.setAttribute('aria-hidden','true');g.prepend(p);}});
  const ms=gs.map(g=>{const on=g.querySelector(':scope>.on');if(!on||!g.offsetWidth)return null;
    const gr=g.getBoundingClientRect(),r=on.getBoundingClientRect();const cl=g.clientLeft,ct=g.clientTop;
    return {to:[r.top-gr.top-ct,gr.width-cl*2-(r.left-gr.left-cl+r.width),gr.height-ct*2-(r.top-gr.top-ct+r.height),r.left-gr.left-cl],rad:parseFloat(getComputedStyle(on).borderTopLeftRadius)||12};});
  gs.forEach((g,gi)=>{const p=g.querySelector(':scope>.cPill');const m=ms[gi];if(!m){p.style.opacity='0';return;}p.style.opacity='1';
  const key=g.dataset.pill;const to=m.to,rad=m.rad;const from=CRM_PILL[key];CRM_PILL[key]=to;
  const paint=v=>{p.style.clipPath=`inset(${v[0]}px ${v[1]}px ${v[2]}px ${v[3]}px round ${rad}px)`;};
  cancelAnimationFrame(p._raf);
  if(!animate||!from||CRM_REDUCED()||from.every((x,i)=>Math.abs(x-to[i])<.5)){paint(to);return;}
  const horiz=Math.abs(to[3]-from[3])>=Math.abs(to[0]-from[0]);const fwd=horiz?to[3]>from[3]:to[0]>from[0];
  const lead=horiz?(fwd?1:3):(fwd?2:0),trail=horiz?(fwd?3:1):(fwd?0:2);
  const eo=x=>1-Math.pow(1-x,3),eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;const t0=performance.now(),D1=340,D2=560;paint(from);
  const step=now=>{const e=now-t0;const a=eo(Math.min(1,e/D1)),b=eio(Math.min(1,e/D2));paint(from.map((f,i)=>f+(to[i]-f)*(i===trail?b:a)));if(e<D2)p._raf=requestAnimationFrame(step);};
  p._raf=requestAnimationFrame(step);});}
function cCount(root){if(CRM_REDUCED())return;root.querySelectorAll('.cNum').forEach(el=>{const n=+el.dataset.n||0,fmt=el.dataset.fmt;if(!n)return;const t0=performance.now(),D=900;
  const f=v=>fmt==='money'?pMoney(Math.round(v)):fmt==='pct'?Math.round(v)+'%':String(Math.round(v));
  const step=now=>{const k=Math.min(1,(now-t0)/D);el.textContent=f(n*(1-Math.pow(1-k,4)));if(k<1)requestAnimationFrame(step);};el.textContent=f(0);requestAnimationFrame(step);});}

/* ---------- open and close ---------- */
SCREENS.pipeline=()=>'<div class="pad crmHold"></div>';
function crmShow(){document.querySelectorAll('#toasts .toast').forEach(t=>{if(t.querySelector('[data-act=pGoSched]'))t.remove();});let el=document.getElementById('crm');if(!el){el=document.createElement('div');el.id='crm';el.setAttribute('role','application');el.setAttribute('aria-label','Pipeline');el.innerHTML='<div class="crmApp"></div><div class="crmScrim" data-c="close"></div><aside class="crmDrawer" aria-label="Prospect details"></aside><div class="crmAddWrap"></div><div class="crmSheetWrap"></div>';document.body.appendChild(el);crmBind(el);crmSetBind(el);crmQuoteBind(el);}
  if(!el.classList.contains('on')){el.classList.add('on');document.documentElement.classList.add('crmOpen');clearTimeout(CRM.coverT);CRM.coverT=setTimeout(()=>{if(el.classList.contains('on'))document.documentElement.classList.add('crmCover');},420);pipeStart();cdbStart();gcalRestore();gcalPrepare();gcalTick();if(gcalState()==='on')setTimeout(gcalSync,800);if(typeof pEvStart==='function')pEvStart();CRM.anim=true;crmRender(true);}}
function crmHide(){const el=document.getElementById('crm');if(el&&el.classList.contains('on')){el.classList.remove('on');clearTimeout(CRM.coverT);document.documentElement.classList.remove('crmOpen','crmDr','crmCover');CRM.open=null;}}
let CRM_PREV='harbour';
{const _dv=decorateView;decorateView=function(){_dv.apply(this,arguments);try{if(S.screen==='pipeline'){if(S.view.ptab){CRM.view=S.view.ptab==='schedule'?'today':S.view.ptab==='clients'?'clients':S.view.ptab==='board'?'board':CRM.view;if(S.view.pstage){CRM.stage=S.view.pstage;CRM.view='board';}S.view.ptab=null;S.view.pstage=null;}CRM.from=CRM_PREV;crmShow();}else{CRM_PREV=S.screen||'harbour';crmHide();}}catch(e){console.warn('crm',e);}};}
let CRM_RAF=0;
pipeRefresh=function(){if(document.documentElement.classList.contains('crmOpen')){cancelAnimationFrame(CRM_RAF);CRM_RAF=requestAnimationFrame(()=>crmRender());}else if(S.screen==='more'||S.screen==='harbour'){render();if(S.screen==='harbour'&&typeof pRemind==='function')setTimeout(pRemind,400);}};
{const _g=ACT.pGoalGo;ACT.pGoalGo=function(){_g.apply(this,arguments);if(document.documentElement.classList.contains('crmOpen'))crmRender();};}
addEventListener('resize',()=>{const r=document.getElementById('crm');if(r&&r.classList.contains('on'))cPills(r,false);});

/* ---------- the frame ---------- */
function crmRender(first){const root=document.getElementById('crm');if(!root)return;const el=root.querySelector('.crmApp');
  const keep={};root.querySelectorAll('[data-scroll]').forEach(s=>keep[s.dataset.scroll]=[s.scrollLeft,s.scrollTop]);
  const act=document.activeElement;const typing=act&&act.matches&&act.matches('[data-crm-q]');const caret=typing?act.selectionStart:null;
  const rows=cRows();const items=pSchedItems(rows);const due=items.filter(x=>x.cls==='over'||x.cls==='today').length;
  const open=rows.filter(r=>r.stage in P_IDX&&r.stage!=='client').length;const cl=rows.filter(r=>r.stage==='client').length;
  const evT=typeof evLive==='function'?evLive().filter(e=>evDay(e)===G.today).length:0;
  const views=[['today','Today','today',due,'due'],['board','Board','board',open],['calendar','Calendar','cal',evT],['clients','Clients','clients',cl],['analytics','Analytics','chart',0]];
  const crumbs={today:'Today',board:'Board',calendar:'Calendar',clients:'Clients',analytics:'Analytics'};const dark=typeof hcTheme==='function'&&hcTheme()==='dark';
  const mrr=Math.round(PIPE.rows.filter(r=>r.stage==='client').reduce((a,r)=>a+pMonthly(r),0));const goal=pGoal();const gp=Math.min(100,Math.round(mrr/goal*100));
  root.classList.toggle('rail',CRM.rail);
  const P={side:`
   <aside class="cSide" aria-label="Pipeline navigation">
    <div class="cBrand">${cMark()}<span class="cBrandTxt"><b>Funnal</b><small>Pipeline</small></span><button class="cIconBtn cRailBtn" data-c="rail" aria-label="${CRM.rail?'Expand sidebar':'Collapse sidebar'}" title="${CRM.rail?'Expand':'Collapse'}">${cSvg('rail')}</button></div>
    <button class="cBackBtn" data-c="back">${cSvg('back')}<span>Back to the game</span></button>
    <div class="cSideLbl"><span>Workspace</span></div>
    <nav class="cNav" data-pill="nav" role="tablist">${views.map(([k,n,ic,c,cls])=>`<button role="tab" aria-selected="${CRM.view===k}" class="${CRM.view===k?'on':''}" data-c="view" data-v="${k}" title="${n}">${cSvg(ic)}<span class="cNavTxt">${n}</span>${c?`<i class="${cls||''}">${c}</i>`:''}</button>`).join('')}</nav>
    <div class="cGrow"></div>
    <button class="cGoalCard" data-c="goalNav" title="Monthly retainers"><span class="cGoalTop"><span>Retainers</span>${cSvg('up')}</span><b>${pMoney(mrr)}<small>/${pMoney(goal)}</small></b><span class="cDots">${Array.from({length:20},(_,i)=>`<i class="${i<Math.round(gp/5)?'on':''}"></i>`).join('')}</span><small class="cGoalFoot">${gp}% of the monthly goal</small></button>
    <div class="cMe">${cAv(S.me,'lg')}<span class="cNavTxt"><b>${cEsc(cName(S.me))}</b><small>Signed in</small></span><button class="cIconBtn" data-c="settings" aria-label="Settings" title="Settings">${cSvg('cog')}</button><button class="cIconBtn cMeTheme" data-c="theme" aria-label="${dark?'Switch to light mode':'Switch to dark mode'}">${cSvg(dark?'sun':'moon')}</button></div>
   </aside>`,top:`<header class="cTop">
     <div class="cTopL"><button class="cIconBtn cBackTop" data-c="back" aria-label="Back to the game">${cSvg('back')}</button>${cMark()}<div class="cCrumb"><span>Pipeline</span>${cSvg('back','flip')}<b>${crumbs[CRM.view]}</b></div></div>
     <div class="cTopR">
      <label class="cSearch ${CRM.search||CRM.q?'show':''}">${cSvg('search')}<input data-crm-q type="search" placeholder="Search prospects" value="${cEsc(CRM.q)}" aria-label="Search prospects"><kbd>/</kbd></label>
      <button class="cIconBtn cSearchBtn" data-c="searchT" aria-label="Search">${cSvg(CRM.search||CRM.q?'x':'search')}</button>
      <button class="cIconBtn cSetTop" data-c="settings" aria-label="Settings">${cSvg('cog')}</button><button class="cIconBtn cThemeTop" data-c="theme" aria-label="${dark?'Switch to light mode':'Switch to dark mode'}">${cSvg(dark?'sun':'moon')}</button>
      <button class="crmPrimary crmAddBtn" data-c="add">${cSvg('plus')}<span>New prospect</span></button>
     </div>
    </header>`,err:`${PIPE.err?`<div class="crmErr">${cEsc(PIPE.err)} <button data-c="reload">Try again</button></div>`:''}`,main:`${!PIPE.ready?'<div class="crmLoading"><i></i><i></i><i></i></div>':`<main class="crmMain view-${CRM.view} ${CRM.anim?'enter':''}" data-scroll="main">${CRM.view==='board'?crmBoard(rows):CRM.view==='clients'?crmClients(rows):CRM.view==='calendar'?crmCal(rows):CRM.view==='analytics'?crmAnalytics(rows):crmToday(rows,items)}</main>`}`};
  P.topK=P.top.replace(/value="[^"]*" aria-label="Search prospects"/,'');const prevP=el.__p;let swapped=false;
  const col=el.querySelector(':scope>.cMainCol');
  if(!prevP||!col){el.innerHTML=P.side+`<div class="cMainCol">${P.top}${P.err}${P.main}</div><button class="crmFab" data-c="add" aria-label="New prospect">${cSvg('plus')}</button>`;swapped=true;}
  else{if(prevP.side!==P.side){el.querySelector(':scope>.cSide').outerHTML=P.side;}
    if(prevP.err!==P.err||!col.lastElementChild){col.innerHTML=P.top+P.err+P.main;swapped=true;}
    else{if(prevP.topK!==P.topK)col.querySelector(':scope>.cTop').outerHTML=P.top;if(CRM.anim||prevP.main!==P.main){col.lastElementChild.outerHTML=P.main;swapped=true;}}}
  el.__p=P;
  root.classList.toggle('drawerOn',!!CRM.open);document.documentElement.classList.toggle('crmDr',!!CRM.open);const dr=root.querySelector('.crmDrawer');dr.setAttribute('aria-hidden',String(!CRM.open));
  const sw=root.querySelector('.crmSheetWrap');if(CRM.sheet){if(sw.dataset.k!==CRM.sheet.key||(CRM.sheet.type==='settings'&&!sw.contains(document.activeElement))){const top=sw.querySelector('.cSetBody');const st=top&&sw.dataset.t===CRM.sheet.type?top.scrollTop:0;sw.innerHTML=CRM.sheet.type==='event'?crmEvHtml():CRM.sheet.type==='quote'?crmQuoteHtml():crmSettingsHtml();sw.dataset.k=CRM.sheet.key;sw.dataset.t=CRM.sheet.type;const t2=sw.querySelector('.cSetBody');if(t2)t2.scrollTop=st;cPills(sw,false);if(CRM.sheet.type==='event'&&!CRM.sheet.ev.id)setTimeout(()=>{const i=document.getElementById('ce_title');if(i)i.focus();},40);}}else if(sw.firstChild){sw.innerHTML='';sw.dataset.k='';}
  const aw=root.querySelector('.crmAddWrap');if(CRM.adding&&!aw.firstChild)aw.innerHTML=crmAddHtml();else if(!CRM.adding&&aw.firstChild)aw.innerHTML='';
  if(typing){const i=el.querySelector('[data-crm-q]');if(i){i.focus();try{i.setSelectionRange(caret,caret);}catch(e){}}}
  if(CRM.open&&(first===true||!dr.contains(document.activeElement))){const ds=dr.querySelector('[data-scroll=drawer]');const top=first===true?0:(ds?ds.scrollTop:0);crmDrawerFill(first);const ds2=dr.querySelector('[data-scroll=drawer]');if(ds2)ds2.scrollTop=top;}else if(!CRM.open){dr.classList.remove('on');}
  root.querySelectorAll('[data-scroll]').forEach(s=>{if(s.dataset.scroll==='drawer')return;const k=keep[s.dataset.scroll];if(k&&!CRM.anim){s.scrollLeft=k[0];s.scrollTop=k[1];}});
  cPills(root);if(CRM.anim){cCount(el);CRM.anim=false;}
  if(CRM.adding){const i=root.querySelector('#crmAddIn');if(i&&document.activeElement!==i&&first!=='keep')setTimeout(()=>i.focus(),30);}}
const cIn=(i,cls='')=>`class="cIn ${cls}" style="--i:${i}"`;

/* ---------- Today ---------- */
function crmUpNext(rows,items){const wk=G.today;const meet=rows.filter(r=>r.stage==='meeting'&&r.meeting_at&&r.meeting_at>=wk&&!r.meeting_held).sort((a,b)=>a.meeting_at<b.meeting_at?-1:1)[0];
  if(meet)return {r:meet,kind:'Meeting',when:cRel(meet.meeting_at),big:meet.meeting_at===wk?'Today':cDays(meet.meeting_at)===1?'Tomorrow':pShortD(meet.meeting_at),it:items.find(x=>x.r.id===meet.id)};
  const it=items.find(x=>x.cls==='over')||items.find(x=>x.cls==='today')||items.find(x=>x.cls==='later');if(!it)return null;
  return {r:it.r,kind:it.what,when:'',big:cDueLabel(it),it};}
function crmToday(rows,items){const open=rows.filter(r=>r.stage in P_IDX&&r.stage!=='client');const cl=rows.filter(r=>r.stage==='client');const mrr=Math.round(cl.reduce((a,r)=>a+pMonthly(r),0));
  const reached=rows.filter(r=>pReach(r)>=P_IDX.messaged).length;const win=reached?Math.round(cl.length/reached*100):0;const goal=pGoal();const gp=Math.min(100,Math.round(mrr/goal*100));
  const wk=G.today,wk7=addDays(G.today,7);const meets=rows.filter(r=>r.stage==='meeting'&&r.meeting_at&&r.meeting_at>=wk&&r.meeting_at<=wk7).length;
  const quoted=open.filter(r=>r.stage==='quote_sent').reduce((a,r)=>a+(pVal(r)||0),0);
  const groups={over:items.filter(x=>x.cls==='over'),today:items.filter(x=>x.cls==='today'),week:items.filter(x=>x.cls==='later'&&x.d<=wk7),later:items.filter(x=>x.cls==='later'&&x.d>wk7),quiet:items.filter(x=>x.cls==='stale')};
  if(!CRM.tab||!groups[CRM.tab])CRM.tab='over';if(!groups[CRM.tab].length&&CRM.anim)CRM.tab=['over','today','week','later','quiet'].find(k=>groups[k].length)||'over';
  const tabs=[['over','Overdue'],['today','Today'],['week','This week'],['later','Later'],['quiet','Quiet']];
  const h=new Date().getHours();const hello=h<12?'Good morning':h<18?'Good afternoon':'Good evening';
  const dateTxt=new Date(G.today+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'});
  const nDue=groups.over.length+groups.today.length;const rev=rows.filter(r=>r.review);const up=crmUpNext(rows,items);
  const maxSt=Math.max(1,...PIPE_STAGES.map(s=>rows.filter(r=>r.stage===s.id).length));
  const list=groups[CRM.tab];
  return `<div class="cPage">
   <div ${cIn(0,'cHello')}><div><h1>${hello}, <em>${cEsc(cName(S.me))}</em></h1><p>${cEsc(dateTxt)}${nDue?` · <button class="cTxtLink" data-c="tab" data-t="${groups.over.length?'over':'today'}">${nDue} follow-up${nDue===1?'':'s'} waiting</button>`:' · all caught up'}${meets?` · <span>${meets} meeting${meets===1?'':'s'} this week</span>`:''}</p></div></div>
   <div class="cStats">
    <div ${cIn(1,'cStat tint')}><span class="cStatL">${cSvg('clock')}Due now</span><b>${cNum(nDue)}</b><span class="cStatF">${groups.over.length?`<em class="bad">${groups.over.length} overdue</em>`:'<em class="good">Nothing overdue</em>'}${groups.today.length?` · ${groups.today.length} today`:''}</span></div>
    <button ${cIn(2,'cStat')} data-c="view" data-v="board"><span class="cStatL">${cSvg('layers')}Open prospects</span><b>${cNum(open.length)}</b><span class="cStatF">${quoted?`${pMoney(quoted)} quoted, waiting`:`${meets} meeting${meets===1?'':'s'} this week`}</span></button>
    <button ${cIn(3,'cStat ink')} data-c="view" data-v="clients"><span class="cStatL">${cSvg('money')}Monthly retainers</span><b>${cNum(mrr,'money')}</b><span class="cStatF"><span class="cMiniBar"><i style="--w:${gp}%"></i></span>${gp}% of ${pMoney(goal)}</span></button>
    <div ${cIn(4,'cStat')}><span class="cStatL">${cSvg('target')}Win rate</span><b>${cNum(win,'pct')}</b><span class="cStatF">${cl.length} client${cl.length===1?'':'s'} from ${reached} reached</span><svg class="cRing" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18"/><circle class="v" cx="22" cy="22" r="18" style="--p:${Math.min(100,win)}"/></svg></div>
   </div>
   <div class="cSplit">
    <section ${cIn(5,'cPanel cFollow')}>
     <header class="cPanelH"><div><h3>Follow-ups</h3><p>Oldest first. Tick them off as you go.</p></div></header>
     <div class="cTabs" data-pill="ftabs">${tabs.map(([k,n])=>`<button class="${CRM.tab===k?'on':''} ${k==='over'&&groups.over.length?'hot':''}" data-c="tab" data-t="${k}">${n}<i>${groups[k].length}</i></button>`).join('')}</div>
     ${list.length?`<div class="crmRows">${list.map((x,i)=>crmRow(x,i)).join('')}</div>`:`<div class="crmEmpty"><span class="cEmptyIc">${cSvg('check')}</span><b>${CRM.tab==='over'?'Nothing overdue.':'Nothing here.'}</b><span>${CRM.tab==='quiet'?'Nobody has gone quiet on you.':'A good moment to add someone new.'}</span><button class="crmGhost" data-c="add">${cSvg('plus')}New prospect</button></div>`}
    </section>
    <div class="cSideCol">
     ${up?`<section ${cIn(6,'cUp')}><header><span>Up next</span><button class="cRound" data-c="open" data-id="${up.r.id}" aria-label="Open ${cEsc(up.r.business)}">${cSvg('up')}</button></header>
       <div class="cUpWho">${cBiz(up.r,'lg')}<div><b>${cEsc(up.r.business||'Unnamed')}</b><small>${cEsc([up.r.contact,(PIPE_BY[up.r.stage]||{}).name].filter(Boolean).join(' · '))}</small></div></div>
       <small class="cUpK">${cEsc(up.kind)}</small><div class="cUpBig">${cEsc(up.big)}</div>${up.r.notes?`<p class="cUpNote">${cEsc(up.r.notes.slice(0,120))}${up.r.notes.length>120?'…':''}</p>`:''}
       <footer><span class="grow"></span>${up.it?`<button class="cUpDone" data-c="done" data-id="${up.r.id}">${cSvg('check')}${cEsc(up.it.done)}</button>`:''}<button class="cUpGhost" data-c="open" data-id="${up.r.id}">Open</button></footer></section>`:''}
     ${rev.length?`<section ${cIn(7,'cPanel cChecks')}><header class="cPanelH"><div><h3>Needs a check</h3><p>Imported rows that could be read two ways.</p></div><span class="cBadge">${rev.length}</span></header>
       ${rev.slice(0,3).map(r=>`<div class="cCheckRow">${cBiz(r)}<div><b>${cEsc(r.business||'Unnamed')}</b><small>${cEsc(r.review)}</small><span class="cCheckAct"><button class="cPillBtn dark" data-c="okRow" data-id="${r.id}">${cSvg('check')}Looks right</button><button class="cPillBtn" data-c="open" data-id="${r.id}">Review</button></span></div></div>`).join('')}
       ${rev.length>3?`<button class="cMore" data-c="review">See all ${rev.length}</button>`:''}</section>`:''}
     ${crmDiaryPanel(rows,7)}${crmPayPanel(rows,7)}
     <section ${cIn(8,'cPanel cFunnel')}><header class="cPanelH"><div><h3>Stages</h3><p>Where everyone sits right now.</p></div></header>
      ${PIPE_STAGES.map(s=>{const n=rows.filter(r=>r.stage===s.id).length;return `<button class="cFunRow" data-c="stageGo" data-s="${s.id}"><span class="crmDot" style="--sc:${CRM_STAGE_COL[s.id]}"></span><span class="cFunN">${cEsc(s.name)}</span><span class="cFunBar"><i style="--w:${Math.round(n/maxSt*100)}%;--sc:${CRM_STAGE_COL[s.id]}"></i></span><b>${n}</b></button>`;}).join('')}</section>
    </div>
   </div></div>`;}
function crmRow(x,i){const r=x.r;const st=PIPE_BY[r.stage]||{};const sub=[x.what,r.last_contact?`last contact ${cRel(r.last_contact)}`:'',r.contact].filter(Boolean).join(' · ');
  return `<div class="crmRow ${x.cls}" data-c="open" data-id="${r.id}" tabindex="0" style="--i:${Math.min(i||0,12)}">${cBiz(r)}
   <div class="crmRowMain"><b>${cEsc(r.business||'Unnamed')}</b><small>${cEsc(sub)}</small></div>
   <span class="crmStage" style="--sc:${CRM_STAGE_COL[r.stage]}"><span class="crmDot"></span>${cEsc(st.name||'')}</span>
   <span class="crmDue ${x.cls}">${cSvg('clock')}${cEsc(cDueLabel(x))}</span>
   <div class="crmRowAct">${x.cls==='stale'?`<button class="cPillBtn" data-c="quiet" data-id="${r.id}">Let go</button>`:''}<button class="crmDone" data-c="done" data-id="${r.id}" title="${cEsc(x.done)}">${cSvg('check')}<span>${cEsc(x.done)}</span></button>${r.stage==='meeting'&&r.meeting_at&&!r.meeting_held?'':`<button class="cIconBtn sm" data-c="snooze" data-id="${r.id}" title="Push back 3 days" aria-label="Push back 3 days">${cSvg('clock')}</button>`}</div></div>`;}
function crmWhoM(){const o=CRM.calOwner||'all';return `<div class="cWhoM" data-pill="whoM">${[['all','Both'],['sam','Sam'],['james','James']].map(([k,n])=>`<button class="${o===k?'on':''}" data-c="calOwner" data-o="${k}">${n}</button>`).join('')}</div>`;}

/* ---------- Board ---------- */
function crmCard(r,i){const due=pDue(r);const v=pVal(r);const nx=PIPE_STAGES[P_IDX[r.stage]+1];const host=r.insta?'@'+r.insta:r.website?pHost(r.website):'';
  const dueTxt=due?(due.cls==='stale'?'Gone quiet':due.cls==='over'?`${-cDays(due.d)}d overdue`:due.cls==='today'?'Today':cRel(due.d)):'';
  return `<article class="cCard ${r.review?'rev':''}" draggable="true" data-c="open" data-id="${r.id}" tabindex="0" style="--sc:${CRM_STAGE_COL[r.stage]};--i:${Math.min(i||0,10)}">
   <div class="cCardSub"><span class="crmDot"></span><span>${cEsc([r.contact,host].filter(Boolean).join(' · ')||(PIPE_BY[r.stage]||{}).name||'')}</span></div>
   <b class="cCardT">${cEsc(r.business||'Unnamed')}</b>
   <div class="cMeta">${dueTxt?`<span class="cDue ${due.cls}">${cSvg('clock')}${cEsc(dueTxt)}</span>`:''}${v?`<span class="cVal">${pMoney(v)}${P_PERIOD_SHORT[r.deal_period]||''}</span>`:''}${r.priority?`<span class="cTag pri">Priority</span>`:''}${r.rag&&r.rag!=='maybe'?`<span class="cTag ${r.rag}">${cEsc((PIPE_RAG[r.rag]||{}).n||'')}</span>`:''}${r.review?'<span class="cTag chk">Check</span>':''}
    <span class="cIcons">${r.video_url?cSvg('play'):''}${r.quote_url?cSvg('doc'):''}</span></div>
   ${nx?`<button class="cNext" data-c="next" data-id="${r.id}" title="Move to ${cEsc(nx.name)}" aria-label="Move to ${cEsc(nx.name)}">${cSvg('arrow')}</button>`:''}</article>`;}
function crmBoard(rows){const byS=s=>rows.filter(r=>r.stage===s).sort((a,b)=>(b.priority?1:0)-(a.priority?1:0)||(a.sort||0)-(b.sort||0));
  if(CRM.q.trim()&&!byS(CRM.stage).length){const hit=[...PIPE_STAGES,...PIPE_EXITS].find(s=>byS(s.id).length);if(hit){CRM.stage=hit.id;if(PIPE_EXITS.includes(hit))CRM.closed=true;}}
  const open=rows.filter(r=>r.stage in P_IDX&&r.stage!=='client');const over=pSchedItems(open).filter(x=>x.cls==='over').length;const quoted=open.filter(r=>r.stage==='quote_sent').reduce((a,r)=>a+(pVal(r)||0),0);
  const col=(s,ci)=>{const list=byS(s.id);const tot=list.reduce((a,r)=>a+(pVal(r)||0),0);return `<section class="cCol ${CRM.stage===s.id?'sel':''}" data-stage="${s.id}" style="--sc:${CRM_STAGE_COL[s.id]};--i:${ci}"><header><span class="cColDot"></span><b>${cEsc(s.name)}</b><span class="cCount">${list.length}</span>${tot?`<span class="cTot">${pMoney(tot)}</span>`:''}<button class="cIconBtn sm" data-c="addIn" data-s="${s.id}" aria-label="Add to ${cEsc(s.name)}">${cSvg('plus')}</button></header><p class="cHint">${cEsc(CRM_STAGE_HINT[s.id]||'')}</p><div class="cList" data-scroll="col-${s.id}">${list.map(crmCard).join('')||'<div class="cEmptyCol">Drop a card here</div>'}</div></section>`;};
  const exits=PIPE_EXITS.map(s=>({...s,n:rows.filter(r=>r.stage===s.id).length}));const nClosed=exits.reduce((a,s)=>a+s.n,0);
  const stages=[...PIPE_STAGES,...(CRM.closed?PIPE_EXITS:[])];
  return `<div class="cBoardWrap">
   <div ${cIn(0,'cHello slim')}><div><h1>Board</h1><p>${open.length} open across ${PIPE_STAGES.length-1} stages${over?` · <em class="bad">${over} overdue</em>`:''}${quoted?` · ${pMoney(quoted)} quoted`:''}${CRM.review?' · <button class="cTxtLink" data-c="review">Showing rows to check. Show everything</button>':''}</p></div>
    <div class="cBoardTools"><button class="cSwitch ${CRM.closed?'on':''}" data-c="closed" role="switch" aria-checked="${CRM.closed}"><span class="cKnob"></span>Closed <i>${nClosed}</i></button></div></div>
   <div class="cStageBar" data-scroll="stagebar">${stages.map(s=>{const n=rows.filter(r=>r.stage===s.id).length;return `<button class="${CRM.stage===s.id?'on':''}" data-c="stage" data-s="${s.id}" style="--sc:${CRM_STAGE_COL[s.id]}"><span class="crmDot"></span>${cEsc(s.name)}<i>${n}</i></button>`;}).join('')}</div>
   <div class="cBoard" data-scroll="board">${stages.map(col).join('')}</div></div>`;}

/* ---------- Clients ---------- */
function crmClients(rows){const cl=rows.filter(r=>r.stage==='client').sort((a,b)=>(pMonthly(b)||pVal(b)||0)-(pMonthly(a)||pVal(a)||0));const mon=cl.filter(pRecurring);const mrr=Math.round(mon.reduce((a,r)=>a+pMonthly(r),0));const one=cl.filter(r=>!pRecurring(r)).reduce((a,r)=>a+(+r.deal_value||0),0);
  const goal=pGoal();const pct=Math.min(100,Math.round(mrr/goal*100));
  return `<div class="cPage">
   <div ${cIn(0,'cHello')}><div><h1>Clients</h1><p>${cl.length} signed · ${mon.length} on a retainer</p></div></div>
   <div class="cStats three">
    <div ${cIn(1,'cStat ink wide')}><span class="cStatL">${cSvg('money')}Monthly retainers</span><b>${cNum(mrr,'money')}<small> / ${pMoney(goal)}</small></b><span class="cDots big">${Array.from({length:30},(_,i)=>`<i class="${i<Math.round(pct*.3)?'on':''}" style="--d:${i}"></i>`).join('')}</span><span class="cStatF">${mrr<goal?`${pct}% of the goal · ${pMoney(goal-mrr)} to go`:'Goal reached. Time to raise it.'} · <button class="cTxtLink light" data-c="goal">Change goal</button></span></div>
    <div ${cIn(2,'cStat tint')}><span class="cStatL">${cSvg('doc')}One-off work</span><b>${cNum(one,'money')}</b><span class="cStatF">${cl.length-mon.length} project${cl.length-mon.length===1?'':'s'}</span></div>
    <div ${cIn(3,'cStat')}><span class="cStatL">${cSvg('clients')}Clients</span><b>${cNum(cl.length)}</b><span class="cStatF">${mon.length} monthly</span></div>
   </div>
   ${cl.length?`<section ${cIn(4,'cPanel cTablePanel')}><header class="cPanelH"><div><h3>Everyone you work with</h3><p>Highest value first.</p></div></header><div class="crmTable" role="table"><div class="crmTr th" role="row"><span>Client</span><span>Service</span><span>Value</span><span>Billing</span></div>${cl.map((r,i)=>`<div class="crmTr" role="row" data-c="open" data-id="${r.id}" tabindex="0" style="--i:${Math.min(i,12)}"><span class="crmCli">${cBiz(r)}<span><b>${cEsc(r.business)}</b><small>${cEsc(r.contact||'')}</small></span></span><span class="cSvc">${cEsc((r.package&&catBy(r.package)&&catBy(r.package).name)||(r.products||[]).join(', ')||'—')}</span><span class="num">${r.deal_value!=null?pMoney(r.deal_value)+(P_PERIOD_SHORT[r.deal_period]||''):'—'}</span><span>${r.deal_period?`<span class="cBill ${pRecurring(r)?'m':''}">${r.deal_period==='monthly'?'Monthly':r.deal_period==='four_weekly'?'Every 4 weeks':'One-off'}</span>${pRecurring(r)&&payNext(r)?`<small class="cNextPay">next ${pShortD(payNext(r))}</small>`:''}`:'—'}</span></div>`).join('')}</div></section>`:`<div class="crmEmpty"><span class="cEmptyIc">${cSvg('clients')}</span><b>No clients yet.</b><span>Move a card to Client on the board and it lands here.</span></div>`}</div>`;}

/* ---------- details panel ---------- */
function crmDrawerFill(first){const d=document.querySelector('#crm .crmDrawer');if(!d)return;const r=PIPE.rows.find(x=>x.id===CRM.open);if(!r){CRM.open=null;d.classList.remove('on');return;}
  const nx=PIPE_STAGES[P_IDX[r.stage]+1];const sItem=pSchedItems([r])[0];
  const f=(k,label,val,type='text',ph='',wide)=>`<label class="cF ${wide?'wide':''}"><span>${label}</span><input data-f="${k}" type="${type}" value="${cEsc(val??'')}" placeholder="${cEsc(ph)}" ${type==='number'?'inputmode="decimal" step="any"':''}></label>`;
  const link=(u,ic,label)=>u?`<a class="cLinkBtn" href="${cEsc(/^https?:/i.test(u)?u:'https://'+u)}" target="_blank" rel="noopener">${cSvg(ic)}${cEsc(label)}</a>`:'';
  const evHtml=ev=>ev.length?ev.slice(0,30).map(e=>`<li><span class="cEvDot"></span><div>${cEsc(pEvText(e).replace(/^(\w+) it /,'$1 ').replace(/^./,m=>m.toUpperCase()))}<small>${cEsc(pWhen(e.at))}</small></div></li>`).join(''):'<li class="none">No activity yet.</li>';
  const ev=PIPE.ev[r.id];
  d.innerHTML=`<div class="cDHead"><select class="cStageSel" data-f="stage" style="--sc:${CRM_STAGE_COL[r.stage]}" aria-label="Stage">${PIPE_ALL.map(s=>`<option value="${s.id}" ${s.id===r.stage?'selected':''}>${cEsc(s.name)}</option>`).join('')}</select>
     <span class="cSaved" aria-live="polite"></span><button class="cIconBtn" data-c="close" aria-label="Close">${cSvg('x')}</button></div>
   <div class="cDBody" data-scroll="drawer">
    <div class="cDHero">${cBiz(r,'xl')}<div class="cDHeroTxt"><input class="cName" data-f="business" value="${cEsc(r.business)}" placeholder="Business name" aria-label="Business name">
     <input class="cContact" data-f="contact" value="${cEsc(r.contact||'')}" placeholder="Add a contact name" aria-label="Contact name"></div></div>
    <div class="cLinks">${link(r.insta?'https://instagram.com/'+r.insta:'','ig','@'+(r.insta||''))}${link(r.website,'web',pHost(r.website||'')||'Website')}${link(r.video_url,'play','Video')}${link(r.quote_url,'doc','Quote')}</div>
    ${r.review?`<div class="cReview">${cSvg('flag')}<div><b>Check this one</b><p>${cEsc(r.review)}</p></div><button class="cPillBtn dark" data-c="ok">Looks right</button></div>`:''}
    ${sItem?`<div class="cNextUp ${sItem.cls}"><div><small>${cEsc(sItem.what)}</small><b>${cEsc(cDueLabel(sItem))}${sItem.cls!=='today'&&sItem.cls!=='stale'?` · ${pShortD(sItem.d)}`:''}</b></div><button class="crmDone" data-c="done" data-id="${r.id}">${cSvg('check')}<span>${cEsc(sItem.done)}</span></button>${r.stage==='meeting'&&r.meeting_at&&!r.meeting_held?'':`<button class="cPillBtn" data-c="snooze" data-id="${r.id}">+3 days</button>`}</div>`:''}
    <div class="cGroup"><h4>Deal</h4>
     <div class="cSeg" role="group" aria-label="Likelihood">${Object.entries(PIPE_RAG).map(([k,v])=>`<button class="${r.rag===k?'on':''} ${k}" data-c="rag" data-v="${k}"><span class="crmDot"></span>${v.n}</button>`).join('')}<button class="${r.priority?'on pri':''}" data-c="pri">${cSvg('star')}Priority</button></div>
     <div class="cChips">${PIPE_PRODUCTS.map(p=>`<button class="${(r.products||[]).includes(p)?'on':''}" data-c="prod" data-p="${cEsc(p)}">${cEsc(p)}</button>`).join('')}</div>
     <div class="cGrid">${crmDealHtml(r)}${f('quote_value','Quote (£)',r.quote_value,'number')}${f('deal_value','Deal (£)',r.deal_value,'number')}
      ${crmBillHtml(r)}${f('editor','Editor',r.editor)}
      ${f('video_url','Video link',r.video_url,'url','Loom link')}${f('quote_url','Quote link',r.quote_url,'url','Drive link')}</div></div>
    <div class="cGroup"><h4>Quotes</h4>${crmQuotesHtml(r)}</div>
    <div class="cGroup"><h4>Meetings and calls</h4>${crmMeetHtml(r)}</div>
    <div class="cGroup"><h4>Contact</h4><div class="cGrid">${f('insta','Instagram',r.insta,'text','handle')}${f('website','Website',r.website,'url','https://')}${f('email','Email',r.email,'email')}${f('phone','Phone',r.phone,'tel')}</div></div>
    <div class="cGroup"><h4>Dates</h4><div class="cGrid">${f('last_contact','Last contact',r.last_contact,'date')}${f('next_due','Next follow-up',r.next_due||'','date')}
      <label class="cF"><span>Follow-ups sent</span><input data-f="follow_ups" type="number" min="0" value="${r.follow_ups||0}"></label>${r.stage==='not_now'?f('return_on','Bring back on',r.return_on,'date'):''}
      <label class="cF cCheck wide"><input type="checkbox" data-f="meeting_held" ${r.meeting_held?'checked':''}><span class="cTog"></span><span>Meeting happened</span></label></div></div>
    <div class="cGroup"><h4>Notes</h4><textarea data-f="notes" rows="4" placeholder="Anything worth remembering">${cEsc(r.notes||'')}</textarea></div>
    <div class="cGroup"><h4>Activity</h4><ol class="cTimeline">${ev?evHtml(ev):'<li class="none">Loading…</li>'}</ol></div>
   </div>
   <div class="cDFoot"><button class="crmGhost danger" data-c="del">${cSvg('trash')}<span>Delete</span></button><span class="grow"></span>${nx?`<button class="crmPrimary" data-c="next" data-id="${r.id}">Move to ${cEsc(nx.name)}${cSvg('arrow')}</button>`:''}</div>`;
  if(first===true)d.classList.remove('fresh'),void d.offsetWidth,d.classList.add('fresh');
  d.classList.add('on');cPills(d,first!==true);
  if(first===true||!PIPE.ev[r.id])pipeEvents(r.id).then(()=>{if(CRM.open===r.id){const tl=d.querySelector('.cTimeline');if(tl)tl.innerHTML=evHtml(PIPE.ev[r.id]||[]);}});}
function crmSaved(t){const s=document.querySelector('#crm .cSaved');if(!s)return;s.textContent=t||'Saved';s.classList.add('on');clearTimeout(s._t);s._t=setTimeout(()=>s.classList.remove('on'),1400);}
async function crmSet(id,patch){const r=PIPE.rows.find(x=>x.id===id);if(!r)return;const keys=Object.keys(patch).filter(k=>JSON.stringify(r[k]??null)!==JSON.stringify(patch[k]??null));if(!keys.length)return;const p={};keys.forEach(k=>p[k]=patch[k]);
  crmSaved('Saving…');const prev=await pipePatch(id,p,'edit',{fields:keys});crmSaved(prev===false?'Couldn\'t save':'Saved');}
function crmFieldVal(el){const k=el.dataset.f;if(el.type==='checkbox')return el.checked;let v=el.value.trim();if(el.type==='number')return v===''?null:+v;if(el.type==='date')return v||null;if(k==='insta')v=v.replace(/^@/,'').replace(/^https?:\/\/(www\.)?instagram\.com\//i,'').replace(/\/.*$/,'');return v===''?null:v;}

/* ---------- quick add ---------- */
function crmAddHtml(){const st=CRM.addStage||'video_needed';return `<div class="crmScrim add" data-c="addClose"></div><div class="crmAdd" role="dialog" aria-label="New prospect"><div class="crmAddHead">${cMark()}<div><h3>New prospect</h3><p>Paste an Instagram link or handle, a website, or just type the business name.</p></div></div>
  <label class="crmAddIn">${cSvg('search')}<input id="crmAddIn" placeholder="instagram.com/thesaltybiscuit" autocomplete="off"></label><div class="crmAddRow one"><label><span>Stage</span><select id="crmAddSt">${PIPE_STAGES.map(s=>`<option value="${s.id}" ${s.id===st?'selected':''}>${cEsc(s.name)}</option>`).join('')}</select></label></div>
  <div class="crmAddFoot"><button class="crmGhost" data-c="addClose">Cancel</button><button class="crmPrimary" data-c="addGo">Add prospect${cSvg('arrow')}</button></div></div>`;}
async function crmAddGo(){const i=document.getElementById('crmAddIn');const o=pParse(i&&i.value);if(!o.business){if(i){const w=i.closest('.crmAddIn')||i;w.classList.remove('cShake');void w.offsetWidth;w.classList.add('cShake');i.focus();}return;}
  const st=(document.getElementById('crmAddSt')||{}).value||'video_needed',ow=(document.getElementById('crmAddOw')||{}).value||S.me;CRM.adding=false;const r=await pipeInsert({...o,stage:st,owner:ow});if(!r)return crmRender();
  CRM.open=r.id;CRM.stage=st;crmRender(true);crmSaved('Added');}

/* ---------- events ---------- */
function crmBind(el){
  el.addEventListener('click',async e=>{const b=e.target.closest('[data-c]');if(!b||!el.contains(b))return;const c=b.dataset.c,id=b.dataset.id;csndClick(c,b);
    if(c!=='open'&&c!=='close')e.stopPropagation();
    if(CRM_ACT[c]){CRM_ACT[c](b,e,el);return;}
    if(c==='back'){location.hash='#'+(CRM.from&&CRM.from!=='pipeline'?CRM.from:'harbour');return;}
    if(c==='view'){if(CRM.view!==b.dataset.v){CRM.view=b.dataset.v;CRM.anim=true;}CRM.open=null;crmRender();const m=el.querySelector('.crmMain');if(m)m.scrollTop=0;return;}
    if(c==='owner'){CRM.owner=b.dataset.o;crmRender();return;}
    if(c==='tab'){CRM.tab=b.dataset.t;if(CRM.view!=='today'){CRM.view='today';CRM.anim=true;}crmRender();const l=el.querySelector('.crmRows');if(l)l.classList.add('swap');return;}
    if(c==='rail'){CRM.rail=!CRM.rail;try{localStorage.setItem('hl_crm_rail',CRM.rail?'1':'0');}catch(x){}crmRender();const s=el.querySelector('.cSide');if(s)s.addEventListener('transitionend',()=>cPills(el,false),{once:true});return;}
    if(c==='theme'){if(typeof hcSwitch==='function')hcSwitch(e);setTimeout(()=>crmRender(),60);return;}
    if(c==='searchT'){if(CRM.search||CRM.q){CRM.search=false;CRM.q='';crmRender();}else{CRM.search=true;crmRender();const i=el.querySelector('[data-crm-q]');if(i)i.focus();}return;}
    if(c==='goalNav'){CRM.view='clients';CRM.anim=true;CRM.open=null;crmRender();return;}
    if(c==='reload'){PIPE.err=null;pipeLoad();return;}
    if(c==='stage'){CRM.stage=b.dataset.s;crmRender();const col=el.querySelector(`.cCol[data-stage="${b.dataset.s}"]`);if(col&&matchMedia('(min-width:900px)').matches)col.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});return;}
    if(c==='stageGo'){CRM.stage=b.dataset.s;CRM.view='board';CRM.anim=true;crmRender();setTimeout(()=>{const col=el.querySelector(`.cCol[data-stage="${b.dataset.s}"]`);if(col&&matchMedia('(min-width:900px)').matches)col.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});},60);return;}
    if(c==='closed'){CRM.closed=!CRM.closed;if(!CRM.closed&&PIPE_EXITS.some(s=>s.id===CRM.stage))CRM.stage='messaged';crmRender();return;}
    if(c==='review'){CRM.review=!CRM.review;if(CRM.review){CRM.view='board';CRM.closed=true;CRM.anim=true;}crmRender();return;}
    if(c==='add'||c==='addIn'){CRM.adding=true;CRM.addStage=b.dataset.s||(CRM.view==='board'?CRM.stage:'video_needed');crmRender();return;}
    if(c==='addClose'){const w=el.querySelector('.crmAdd');if(w&&!CRM_REDUCED()){w.classList.add('out');el.querySelector('.crmScrim.add')?.classList.add('out');setTimeout(()=>{CRM.adding=false;crmRender();},180);}else{CRM.adding=false;crmRender();}return;}
    if(c==='addGo'){crmAddGo();return;}
    if(c==='open'){if(e.target.closest('a'))return;CRM.open=id;crmRender(true);return;}
    if(c==='close'){CRM.open=null;crmRender();return;}
    if(c==='next'){const r=PIPE.rows.find(x=>x.id===id);const nx=r&&PIPE_STAGES[P_IDX[r.stage]+1];if(nx){const card=b.closest('.cCard');if(card)card.classList.add('cLeaving');setTimeout(()=>pMove(id,nx.id),card?220:0);}return;}
    if(c==='done'){const row=b.closest('.crmRow');if(row){row.style.height=row.offsetHeight+'px';void row.offsetWidth;row.classList.add('cTicked');}setTimeout(()=>ACT.pDone({id}),row?320:0);return;}
    if(c==='snooze'){ACT.pSnooze({id,n:3});return;}
    if(c==='quiet'){pMove(id,'no_response');return;}
    if(c==='goal'){ACT.pGoal();return;}
    if(c==='okRow'){const row=b.closest('.cCheckRow');if(row)row.classList.add('cTicked');setTimeout(()=>pipePatch(id,{review:null},'checked',{}),row?260:0);return;}
    const r=PIPE.rows.find(x=>x.id===CRM.open);if(!r)return;
    if(c==='setOwner'){crmSet(r.id,{owner:b.dataset.o});const g=b.parentElement;g.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));cPills(g.parentElement);return;}
    if(c==='rag'){crmSet(r.id,{rag:r.rag===b.dataset.v?null:b.dataset.v});return;}
    if(c==='pri'){crmSet(r.id,{priority:!r.priority});return;}
    if(c==='prod'){const p=b.dataset.p;const cur=r.products||[];crmSet(r.id,{products:cur.includes(p)?cur.filter(x=>x!==p):[...cur,p]});return;}
    if(c==='ok'){await pipePatch(r.id,{review:null},'checked',{});crmSaved('Checked');return;}
    if(c==='del'){if(b.dataset.sure){CRM.open=null;await pipeRemove(r.id);crmRender();return;}b.dataset.sure=1;b.classList.add('sure');b.querySelector('span').textContent='Tap again to delete';setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.classList.remove('sure');b.querySelector('span').textContent='Delete';}},3000);return;}
  });
  el.addEventListener('input',e=>{const q=e.target.closest('[data-crm-q]');if(q){CRM.q=q.value;cancelAnimationFrame(CRM_RAF);CRM_RAF=requestAnimationFrame(()=>crmRender());return;}
    const f=e.target.closest('.crmDrawer [data-f]');if(f&&!['SELECT'].includes(f.tagName)&&f.type!=='checkbox'&&f.type!=='date'){const id=CRM.open;clearTimeout(CRM.saveT[f.dataset.f]);CRM.saveT[f.dataset.f]=setTimeout(()=>crmSet(id,{[f.dataset.f]:crmFieldVal(f)}),700);}});
  el.addEventListener('change',e=>{const f=e.target.closest('.crmDrawer [data-f]');if(!f)return;const id=CRM.open;const k=f.dataset.f;clearTimeout(CRM.saveT[k]);
    if(k==='stage'){const r=PIPE.rows.find(x=>x.id===id);if(r&&r.stage!==f.value)pMove(id,f.value);return;}
    if(k==='package'){const c=catBy(f.value);const p={package:f.value||null};if(c){if(c.price!=null)p.deal_value=c.price;p.deal_period=c.period;const pr=PIPE.rows.find(x=>x.id===id);if(pr&&pr.stage!=='client'&&c.price!=null)p.quote_value=c.price;}crmSet(id,p).then(()=>{if(CRM.open===id){const d=document.querySelector('#crm .crmDrawer');const ds=d.querySelector('[data-scroll=drawer]');const t=ds?ds.scrollTop:0;crmDrawerFill();const d2=d.querySelector('[data-scroll=drawer]');if(d2)d2.scrollTop=t;}});return;}
    if(k==='deal_period'||k==='billing_start'){crmSet(id,{[k]:crmFieldVal(f)}).then(()=>{if(CRM.open===id){const d=document.querySelector('#crm .crmDrawer');const ds=d.querySelector('[data-scroll=drawer]');const t=ds?ds.scrollTop:0;crmDrawerFill();const d2=d.querySelector('[data-scroll=drawer]');if(d2)d2.scrollTop=t;}});return;}crmSet(id,{[k]:crmFieldVal(f)});});
  el.addEventListener('keydown',e=>{if(e.key==='Escape')return;
    if(e.key==='Enter'&&e.target.id==='crmAddIn'){e.preventDefault();crmAddGo();return;}
    if(e.key==='Enter'&&e.target.matches('[data-c="open"]')){CRM.open=e.target.dataset.id;crmRender(true);}});
  // drag and drop between columns (desktop)
  el.addEventListener('dragstart',e=>{const c=e.target.closest('.cCard');if(!c)return;try{CSND.lift();}catch(x){}CRM.drag=c.dataset.id;c.classList.add('cDragging');try{e.dataTransfer.setData('text/plain',c.dataset.id);e.dataTransfer.effectAllowed='move';}catch(x){}});
  el.addEventListener('dragend',()=>{CRM.drag=null;el.querySelectorAll('.cDragging,.cOver').forEach(x=>x.classList.remove('cDragging','cOver'));});
  el.addEventListener('dragover',e=>{const col=e.target.closest('.cCol');if(!col||!CRM.drag)return;e.preventDefault();el.querySelectorAll('.cOver').forEach(x=>x!==col&&x.classList.remove('cOver'));col.classList.add('cOver');});
  el.addEventListener('drop',e=>{const col=e.target.closest('.cCol');if(!col||!CRM.drag)return;e.preventDefault();const id=CRM.drag;CRM.drag=null;col.classList.remove('cOver');const r=PIPE.rows.find(x=>x.id===id);if(r&&r.stage!==col.dataset.stage)pMove(id,col.dataset.stage);});}
document.addEventListener('keydown',e=>{if(!document.documentElement.classList.contains('crmOpen'))return;
  if(e.key==='Escape'){try{if(CRM.open||CRM.sheet||CRM.adding)CSND.close();}catch(x){}const m=document.getElementById('modal');if(m&&!m.hidden)return;if(CRM.sheet){CRM.sheet=null;crmRender();}else if(CRM.adding){CRM.adding=false;crmRender();}else if(CRM.open){CRM.open=null;crmRender();}else if(CRM.search||CRM.q){CRM.search=false;CRM.q='';crmRender();}return;}
  if(e.target.matches('input,textarea,select'))return;
  if(e.key==='/'||(e.key==='k'&&(e.metaKey||e.ctrlKey))){e.preventDefault();CRM.search=true;const i=document.querySelector('#crm [data-crm-q]');if(i){i.closest('.cSearch')?.classList.add('show');i.focus();}}else if(e.key==='n'&&!e.metaKey&&!e.ctrlKey){e.preventDefault();CRM.adding=true;crmRender();}});
// buttons inside the pipeline keep its own calm style, not the game's bouncy one
{const _pt=pzTag;pzTag=function(root){_pt.apply(this,arguments);document.querySelectorAll('#crm [class*=pz]').forEach(x=>[...x.classList].forEach(k=>{if(/^pz/.test(k))x.classList.remove(k);}));};}
