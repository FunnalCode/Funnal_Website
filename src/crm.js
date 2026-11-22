/* ============================== 22 Nov (evening): the pipeline, rebuilt as a proper tool ==============================
   A full-screen workspace on top of the game, in Funnal's own colours and type rather than the game's.
   Three views: Today (what needs doing), Board (every stage at a glance) and Clients.
   Desktop: columns side by side, drag a card to move it, details slide in from the right.
   Phone: pick a stage, cards in a list, details slide up full screen.
   Edits save as you type. Same data, same shared tables, same history as before. */
const CRM={view:'today',q:'',owner:'all',stage:'messaged',open:null,closed:false,review:false,later:false,quiet:false,adding:false,from:'harbour',drag:null,saveT:{}};
const CRM_STAGE_COL={video_needed:'#C91E36',video_made:'#7C5CC4',messaged:'#486790',followed_up:'#2E8C88',talking:'#2F8F62',meeting:'#C9962A',quote_sent:'#E06034',client:'#283338',not_now:'#7F8A93',no_response:'#A0A7AE'};
const CRM_STAGE_HINT={video_needed:'Record a Loom for these',video_made:'Ready to send',messaged:'First message sent',followed_up:'Nudged at least once',talking:'In conversation',meeting:'Call booked or held',quote_sent:'Waiting on a decision',client:'Signed',not_now:'Comes back on a date',no_response:'Parked'};
const cEsc=s=>esc(s==null?'':String(s));
const cIni=s=>String(s||'?').replace(/^the\s+/i,'').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase()||'?';
const cDays=d=>d?Math.round((Date.parse(d+'T12:00:00Z')-Date.parse(G.today+'T12:00:00Z'))/864e5):null;
function cRel(d){const n=cDays(d);if(n==null)return '';if(n===0)return 'Today';if(n===1)return 'Tomorrow';if(n===-1)return 'Yesterday';if(n<0)return `${-n} days ago`;if(n<7)return new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'long',timeZone:'UTC'});return pShortD(d);}
function cDueLabel(x){const n=cDays(x.d);if(x.cls==='stale')return 'Gone quiet';if(n<0)return `${-n}d overdue`;if(n===0)return 'Due today';if(n===1)return 'Tomorrow';return pShortD(x.d);}
const cOwnerName=p=>p?pnameRaw(p):'Unassigned';
const cOwnerChip=p=>p?`<span class="cAv" style="--ac:${pcol(p)}" title="${cEsc(cOwnerName(p))}">${cEsc(cOwnerName(p)[0])}</span>`:'';
const cRows=()=>{const q=CRM.q.trim().toLowerCase();return PIPE.rows.filter(r=>(CRM.owner==='all'||r.owner===CRM.owner)&&(!CRM.review||r.review)&&(!q||pSearchKey(r).includes(q)));};
const cIcon={back:'M15 18l-6-6 6-6',search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16l-4.3-4.3',plus:'M12 5v14M5 12h14',x:'M6 6l12 12M18 6L6 18',check:'M5 12.5l4.2 4.2L19 7',clock:'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',arrow:'M5 12h14M13 6l6 6-6 6',ext:'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',play:'M8 5v14l11-7z',doc:'M7 3h7l5 5v13H7zM14 3v5h5',ig:'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-1.5h.01',web:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z',trash:'M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',star:'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',dots:'M5 12h.01M12 12h.01M19 12h.01',flag:'M5 21V4M5 4h11l-2 4 2 4H5'};
const cSvg=(k,cls='')=>`<svg class="cI ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${cIcon[k]}"/></svg>`;

/* ---------- open and close ---------- */
SCREENS.pipeline=()=>'<div class="pad crmHold"></div>';
function crmShow(){document.querySelectorAll('#toasts .toast').forEach(t=>{if(t.querySelector('[data-act=pGoSched]'))t.remove();});let el=document.getElementById('crm');if(!el){el=document.createElement('div');el.id='crm';el.setAttribute('role','application');el.setAttribute('aria-label','Pipeline');el.innerHTML='<div class="crmApp"></div><div class="crmScrim" data-c="close"></div><aside class="crmDrawer" aria-label="Prospect details"></aside><div class="crmAddWrap"></div>';document.body.appendChild(el);crmBind(el);}
  if(!el.classList.contains('on')){el.classList.add('on');document.documentElement.classList.add('crmOpen');pipeStart();if(typeof pEvStart==='function')pEvStart();crmRender(true);}}
function crmHide(){const el=document.getElementById('crm');if(el&&el.classList.contains('on')){el.classList.remove('on');document.documentElement.classList.remove('crmOpen');CRM.open=null;}}
let CRM_PREV='harbour';
{const _dv=decorateView;decorateView=function(){_dv.apply(this,arguments);try{if(S.screen==='pipeline'){if(S.view.ptab){CRM.view=S.view.ptab==='schedule'?'today':S.view.ptab==='clients'?'clients':S.view.ptab==='board'?'board':CRM.view;if(S.view.pstage){CRM.stage=S.view.pstage;CRM.view='board';}S.view.ptab=null;S.view.pstage=null;}CRM.from=CRM_PREV;crmShow();}else{CRM_PREV=S.screen||'harbour';crmHide();}}catch(e){console.warn('crm',e);}};}
let CRM_RAF=0;
pipeRefresh=function(){if(document.documentElement.classList.contains('crmOpen')){cancelAnimationFrame(CRM_RAF);CRM_RAF=requestAnimationFrame(()=>crmRender());}else if(S.screen==='more'||S.screen==='harbour'){render();if(S.screen==='harbour'&&typeof pRemind==='function')setTimeout(pRemind,400);}};

/* ---------- the frame ---------- */
function crmRender(first){const root=document.getElementById('crm');if(!root)return;const el=root.querySelector('.crmApp');
  const keep={};root.querySelectorAll('[data-scroll]').forEach(s=>keep[s.dataset.scroll]=[s.scrollLeft,s.scrollTop]);
  const act=document.activeElement;const typing=act&&act.matches&&act.matches('[data-crm-q]');const caret=typing?act.selectionStart:null;
  const items=pSchedItems(cRows());const due=items.filter(x=>x.cls==='over'||x.cls==='today').length;const rev=PIPE.rows.filter(r=>r.review).length;
  const views=[['today','Today',due],['board','Board'],['clients','Clients']];
  el.innerHTML=`
   <header class="crmTop">
    <button class="crmIconBtn crmBack" data-c="back" aria-label="Back to the game">${cSvg('back')}<span>Game</span></button>
    <div class="crmTitle"><span class="crmMark"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h18l-7 8v6l-4 2v-8z"/></svg></span><b>Pipeline</b></div>
    <nav class="crmViews" role="tablist">${views.map(([k,n,c])=>`<button role="tab" aria-selected="${CRM.view===k}" class="${CRM.view===k?'on':''}" data-c="view" data-v="${k}">${n}${c?`<i>${c}</i>`:''}</button>`).join('')}</nav>
    <label class="crmSearch">${cSvg('search')}<input data-crm-q type="search" placeholder="Search prospects" value="${cEsc(CRM.q)}" aria-label="Search prospects"><kbd>/</kbd></label>
    <div class="crmOwner" role="group" aria-label="Whose">${[['all','All'],['sam',pnameRaw('sam')],['james',pnameRaw('james')]].map(([k,n])=>`<button class="${CRM.owner===k?'on':''}" data-c="owner" data-o="${k}">${cEsc(n)}</button>`).join('')}</div>
    <button class="crmPrimary crmAddBtn" data-c="add">${cSvg('plus')}<span>New prospect</span></button>
   </header>
   ${PIPE.err?`<div class="crmErr">${cEsc(PIPE.err)} <button data-c="reload">Try again</button></div>`:''}
   ${!PIPE.ready?'<div class="crmLoading"><i></i><i></i><i></i></div>':`<main class="crmMain view-${CRM.view}" data-scroll="main">${CRM.view==='board'?crmBoard():CRM.view==='clients'?crmClients():crmToday(items,rev)}</main>`}
   <button class="crmFab" data-c="add" aria-label="New prospect">${cSvg('plus')}</button>`;
  root.classList.toggle('drawerOn',!!CRM.open);const dr=root.querySelector('.crmDrawer');dr.setAttribute('aria-hidden',String(!CRM.open));
  const aw=root.querySelector('.crmAddWrap');if(CRM.adding&&!aw.firstChild)aw.innerHTML=crmAddHtml();else if(!CRM.adding&&aw.firstChild)aw.innerHTML='';
  if(typing){const i=el.querySelector('[data-crm-q]');if(i){i.focus();try{i.setSelectionRange(caret,caret);}catch(e){}}}
  if(CRM.open&&(first===true||!dr.contains(document.activeElement))){const ds=dr.querySelector('[data-scroll=drawer]');const top=first===true?0:(ds?ds.scrollTop:0);crmDrawerFill(first);const ds2=dr.querySelector('[data-scroll=drawer]');if(ds2)ds2.scrollTop=top;}else if(!CRM.open){dr.classList.remove('on');}
  root.querySelectorAll('[data-scroll]').forEach(s=>{if(s.dataset.scroll==='drawer')return;const k=keep[s.dataset.scroll];if(k){s.scrollLeft=k[0];s.scrollTop=k[1];}});
  if(CRM.adding){const i=root.querySelector('#crmAddIn');if(i&&document.activeElement!==i&&first!=='keep')setTimeout(()=>i.focus(),30);}}

/* ---------- Today ---------- */
function crmToday(items,rev){const rows=cRows();const open=rows.filter(r=>r.stage in P_IDX&&r.stage!=='client');const cl=rows.filter(r=>r.stage==='client');const mrr=cl.filter(r=>r.deal_period==='monthly').reduce((a,r)=>a+(+r.deal_value||0),0);
  const quoted=open.filter(r=>r.stage==='quote_sent').reduce((a,r)=>a+(pVal(r)||0),0);const reached=rows.filter(r=>pReach(r)>=P_IDX.messaged).length;const win=reached?Math.round(cl.length/reached*100):0;
  const wk=G.today,wk7=addDays(G.today,7);const meets=rows.filter(r=>r.stage==='meeting'&&r.meeting_at&&r.meeting_at>=wk&&r.meeting_at<=wk7).length;
  const over=items.filter(x=>x.cls==='over'),today=items.filter(x=>x.cls==='today'),soon=items.filter(x=>x.cls==='later'&&x.d<=wk7),later=items.filter(x=>x.cls==='later'&&x.d>wk7),quiet=items.filter(x=>x.cls==='stale');
  const stat=(n,l,c='',v='')=>`<button class="crmStat ${c}" ${v?`data-c="view" data-v="${v}"`:''}><b>${n}</b><span>${l}</span></button>`;
  const sec=(title,list,key,coll)=>!list.length?'':`<section class="crmSec ${key}"><header><h3>${title}</h3><span>${list.length}</span>${coll!=null?`<button class="crmLink" data-c="toggle" data-k="${key}">${coll?'Hide':'Show'}</button>`:''}</header>${coll===false?'':`<div class="crmRows">${list.map(crmRow).join('')}</div>`}</section>`;
  const allClear=!over.length&&!today.length;
  return `<div class="crmWrap">
   <div class="crmStats">${stat(open.length,'Open prospects','','board')}${stat(over.length+today.length,'Due now',over.length?'warn':'')}${stat(meets,'Meetings this week')}${stat(quoted?pMoney(quoted):'£0','Quoted, waiting')}${stat(pMoney(mrr),'Monthly retainers','gold','clients')}${stat(win+'%','Win rate')}</div>
   ${rev?`<div class="crmNotice"><span>${cSvg('flag')}</span><div><b>${rev} imported ${rev===1?'row needs':'rows need'} a quick check</b><small>Dates that could be read two ways, missing names and one wrong link.</small></div><button class="crmGhost" data-c="review">${CRM.review?'Show everything':'Review them'}</button></div>`:''}
   ${allClear?`<div class="crmEmpty"><b>You're all caught up.</b><span>Nothing is due today. A good moment to add someone new.</span><button class="crmPrimary" data-c="add">${cSvg('plus')}New prospect</button></div>`:''}
   ${sec('Overdue',over,'over')}${sec('Today',today,'today')}${sec('Next 7 days',soon,'soon')}${sec('Later',later,'later',CRM.later)}${sec('Gone quiet',quiet,'quiet',CRM.quiet)}
   ${quiet.length?'':''}</div>`;}
function crmRow(x){const r=x.r;const st=PIPE_BY[r.stage]||{};const n=cDays(x.d);const sub=[x.what,r.last_contact?`last contact ${cRel(r.last_contact).toLowerCase()}`:'',r.contact].filter(Boolean).join(' · ');
  return `<div class="crmRow ${x.cls}" data-c="open" data-id="${r.id}" tabindex="0"><span class="crmDot" style="--sc:${CRM_STAGE_COL[r.stage]}"></span>
   <div class="crmRowMain"><b>${cEsc(r.business||'Unnamed')}</b><small>${cEsc(sub)}</small></div>
   <span class="crmStage" style="--sc:${CRM_STAGE_COL[r.stage]}">${cEsc(st.name||'')}</span>${cOwnerChip(r.owner)}
   <span class="crmDue ${x.cls}">${cEsc(cDueLabel(x))}</span>
   <div class="crmRowAct">${x.cls==='stale'?`<button class="crmGhost sm" data-c="quiet" data-id="${r.id}">Let go</button>`:''}<button class="crmDone" data-c="done" data-id="${r.id}" title="${cEsc(x.done)}">${cSvg('check')}<span>${cEsc(x.done)}</span></button>${r.stage==='meeting'&&r.meeting_at&&!r.meeting_held?'':`<button class="crmIconBtn sm" data-c="snooze" data-id="${r.id}" title="Push back 3 days" aria-label="Push back 3 days">${cSvg('clock')}</button>`}</div></div>`;}

/* ---------- Board ---------- */
function crmCard(r){const due=pDue(r);const v=pVal(r);const nx=PIPE_STAGES[P_IDX[r.stage]+1];const host=r.insta?'@'+r.insta:r.website?pHost(r.website):'';
  const dueTxt=due?(due.cls==='stale'?'Gone quiet':due.cls==='over'?`${-cDays(due.d)}d overdue`:due.cls==='today'?'Due today':cRel(due.d)):'';
  return `<article class="cCard ${r.review?'rev':''}" draggable="true" data-c="open" data-id="${r.id}" tabindex="0" style="--sc:${CRM_STAGE_COL[r.stage]}">
   <div class="cTop"><b>${cEsc(r.business||'Unnamed')}</b>${cOwnerChip(r.owner)}</div>
   ${r.contact||host?`<div class="cSub">${cEsc([r.contact,host].filter(Boolean).join(' · '))}</div>`:''}
   <div class="cMeta">${dueTxt?`<span class="cDue ${due.cls}">${cEsc(dueTxt)}</span>`:''}${v?`<span class="cVal">${pMoney(v)}${r.deal_period==='monthly'?'/mo':''}</span>`:''}${r.priority?`<span class="cTag pri">Priority</span>`:''}${r.rag&&r.rag!=='maybe'?`<span class="cTag ${r.rag}">${cEsc((PIPE_RAG[r.rag]||{}).n||'')}</span>`:''}${r.review?'<span class="cTag chk">Check</span>':''}
    <span class="cIcons">${r.video_url?cSvg('play'):''}${r.quote_url?cSvg('doc'):''}</span></div>
   ${nx?`<button class="cNext" data-c="next" data-id="${r.id}" title="Move to ${cEsc(nx.name)}" aria-label="Move to ${cEsc(nx.name)}">${cSvg('arrow')}</button>`:''}</article>`;}
function crmBoard(){const rows=cRows();const byS=s=>rows.filter(r=>r.stage===s).sort((a,b)=>(b.priority?1:0)-(a.priority?1:0)||(a.sort||0)-(b.sort||0));
  const col=s=>{const list=byS(s.id);const tot=list.reduce((a,r)=>a+(pVal(r)||0),0);return `<section class="cCol ${CRM.stage===s.id?'sel':''}" data-stage="${s.id}" style="--sc:${CRM_STAGE_COL[s.id]}"><header><span class="crmDot"></span><b>${cEsc(s.name)}</b><span class="cCount">${list.length}</span>${tot?`<span class="cTot">${pMoney(tot)}</span>`:''}<button class="crmIconBtn sm" data-c="addIn" data-s="${s.id}" aria-label="Add to ${cEsc(s.name)}">${cSvg('plus')}</button></header><p class="cHint">${cEsc(CRM_STAGE_HINT[s.id]||'')}</p><div class="cList" data-scroll="col-${s.id}">${list.map(crmCard).join('')||'<div class="cEmptyCol">Drop a card here</div>'}</div></section>`;};
  const exits=PIPE_EXITS.map(s=>({...s,n:rows.filter(r=>r.stage===s.id).length}));
  const stages=[...PIPE_STAGES,...(CRM.closed?PIPE_EXITS:[])];
  return `<div class="cStageBar" data-scroll="stagebar">${stages.map(s=>{const n=rows.filter(r=>r.stage===s.id).length;return `<button class="${CRM.stage===s.id?'on':''}" data-c="stage" data-s="${s.id}" style="--sc:${CRM_STAGE_COL[s.id]}"><span class="crmDot"></span>${cEsc(s.name)}<i>${n}</i></button>`;}).join('')}<button class="cClosedBtn" data-c="closed">${CRM.closed?'Hide closed':`Closed ${exits.reduce((a,s)=>a+s.n,0)}`}</button></div>
   <div class="cBoard" data-scroll="board">${stages.map(col).join('')}${CRM.closed?'':`<button class="cClosedCol" data-c="closed"><b>Closed</b>${exits.map(s=>`<span>${cEsc(s.name)} · ${s.n}</span>`).join('')}<em>Show</em></button>`}</div>`;}

/* ---------- Clients ---------- */
function crmClients(){const cl=cRows().filter(r=>r.stage==='client').sort((a,b)=>(pVal(b)||0)-(pVal(a)||0));const mon=cl.filter(r=>r.deal_period==='monthly');const mrr=mon.reduce((a,r)=>a+(+r.deal_value||0),0);const one=cl.filter(r=>r.deal_period!=='monthly').reduce((a,r)=>a+(+r.deal_value||0),0);
  const goal=(typeof pGoal==='function'?pGoal():2000);const pct=Math.min(100,Math.round(mrr/goal*100));
  return `<div class="crmWrap">
   <div class="crmStats three"><div class="crmStat gold"><b>${pMoney(mrr)}</b><span>Monthly retainers · ${mon.length}</span></div><div class="crmStat"><b>${pMoney(one)}</b><span>One-off work</span></div><div class="crmStat"><b>${cl.length}</b><span>Clients</span></div></div>
   <div class="crmGoal"><div><b>${pct}% of your ${pMoney(goal)} monthly goal</b><small>${mrr<goal?`${pMoney(goal-mrr)} to go`:'Goal reached. Time to raise it.'}</small></div><div class="crmBar"><i style="width:${pct}%"></i></div><button class="crmLink" data-c="goal">Change goal</button></div>
   ${cl.length?`<div class="crmTable" role="table"><div class="crmTr th" role="row"><span>Client</span><span>Service</span><span>Value</span><span>Billing</span><span>Owner</span></div>${cl.map(r=>`<div class="crmTr" role="row" data-c="open" data-id="${r.id}" tabindex="0"><span class="crmCli"><i style="--sc:${CRM_STAGE_COL.client}">${cEsc(cIni(r.business))}</i><span><b>${cEsc(r.business)}</b><small>${cEsc(r.contact||'')}</small></span></span><span>${cEsc((r.products||[]).join(', ')||'—')}</span><span class="num">${r.deal_value!=null?pMoney(r.deal_value):'—'}</span><span>${r.deal_period==='monthly'?'Monthly':r.deal_period?'One-off':'—'}</span><span>${cOwnerChip(r.owner)}</span></div>`).join('')}</div>`:`<div class="crmEmpty"><b>No clients yet.</b><span>Move a card to Client on the board and it lands here.</span></div>`}</div>`;}

/* ---------- details drawer ---------- */
function crmDrawerFill(first){const d=document.querySelector('#crm .crmDrawer');if(!d)return;const r=PIPE.rows.find(x=>x.id===CRM.open);if(!d)return;if(!r){CRM.open=null;d.classList.remove('on');return;}
  const st=PIPE_BY[r.stage]||{};const due=pDue(r);const nx=PIPE_STAGES[P_IDX[r.stage]+1];const sItem=pSchedItems([r])[0];
  const f=(k,label,val,type='text',ph='',wide)=>`<label class="cF ${wide?'wide':''}"><span>${label}</span><input data-f="${k}" type="${type}" value="${cEsc(val??'')}" placeholder="${cEsc(ph)}" ${type==='number'?'inputmode="decimal" step="any"':''}></label>`;
  const link=(u,ic,label)=>u?`<a class="cLinkBtn" href="${cEsc(/^https?:/i.test(u)?u:'https://'+u)}" target="_blank" rel="noopener">${cSvg(ic)}${label}</a>`:'';
  const ev=(PIPE.ev[r.id]||[]);
  d.innerHTML=`<div class="cDHead"><select class="cStageSel" data-f="stage" style="--sc:${CRM_STAGE_COL[r.stage]}" aria-label="Stage">${PIPE_ALL.map(s=>`<option value="${s.id}" ${s.id===r.stage?'selected':''}>${cEsc(s.name)}</option>`).join('')}</select>
     <div class="crmOwner sm">${['sam','james'].map(p=>`<button class="${r.owner===p?'on':''}" data-c="setOwner" data-o="${p}">${cEsc(pnameRaw(p))}</button>`).join('')}</div><span class="cSaved" aria-live="polite"></span><button class="crmIconBtn" data-c="close" aria-label="Close">${cSvg('x')}</button></div>
   <div class="cDBody" data-scroll="drawer">
    <input class="cName" data-f="business" value="${cEsc(r.business)}" placeholder="Business name" aria-label="Business name">
    <input class="cContact" data-f="contact" value="${cEsc(r.contact||'')}" placeholder="Contact name" aria-label="Contact name">
    <div class="cLinks">${link(r.insta?'https://instagram.com/'+r.insta:'', 'ig','Instagram')}${link(r.website,'web',pHost(r.website||'')||'Website')}${link(r.video_url,'play','Video')}${link(r.quote_url,'doc','Quote')}</div>
    ${r.review?`<div class="cReview">${cSvg('flag')}<div><b>Check this one</b><p>${cEsc(r.review)}</p></div><button class="crmGhost sm" data-c="ok">Looks right</button></div>`:''}
    ${sItem?`<div class="cNextUp ${sItem.cls}"><div><small>${cEsc(sItem.what)}</small><b>${cEsc(cDueLabel(sItem))}${sItem.cls!=='today'&&sItem.cls!=='stale'?` · ${pShortD(sItem.d)}`:''}</b></div><button class="crmDone" data-c="done" data-id="${r.id}">${cSvg('check')}<span>${cEsc(sItem.done)}</span></button>${r.stage==='meeting'&&r.meeting_at&&!r.meeting_held?'':`<button class="crmGhost sm" data-c="snooze" data-id="${r.id}">+3 days</button>`}</div>`:''}
    <div class="cGroup"><h4>Contact</h4><div class="cGrid">${f('insta','Instagram',r.insta,'text','handle')}${f('website','Website',r.website,'url','https://')}${f('email','Email',r.email,'email')}${f('phone','Phone',r.phone,'tel')}</div></div>
    <div class="cGroup"><h4>Deal</h4>
     <div class="cSeg" role="group" aria-label="Likelihood">${Object.entries(PIPE_RAG).map(([k,v])=>`<button class="${r.rag===k?'on':''} ${k}" data-c="rag" data-v="${k}">${v.n}</button>`).join('')}<button class="${r.priority?'on pri':''}" data-c="pri">${cSvg('star')}Priority</button></div>
     <div class="cChips">${PIPE_PRODUCTS.map(p=>`<button class="${(r.products||[]).includes(p)?'on':''}" data-c="prod" data-p="${cEsc(p)}">${cEsc(p)}</button>`).join('')}</div>
     <div class="cGrid">${f('video_url','Video link',r.video_url,'url','Loom link')}${f('quote_url','Quote link',r.quote_url,'url','Drive link')}${f('quote_value','Quote (£)',r.quote_value,'number')}${f('deal_value','Deal (£)',r.deal_value,'number')}
      <label class="cF"><span>Billing</span><select data-f="deal_period"><option value="" ${!r.deal_period?'selected':''}>—</option><option value="monthly" ${r.deal_period==='monthly'?'selected':''}>Monthly</option><option value="one_off" ${r.deal_period==='one_off'?'selected':''}>One-off</option></select></label>${f('editor','Editor',r.editor)}</div></div>
    <div class="cGroup"><h4>Dates</h4><div class="cGrid">${f('last_contact','Last contact',r.last_contact,'date')}${f('next_due','Next follow-up',r.next_due||'','date')}${f('meeting_at','Meeting',r.meeting_at,'date')}
      <label class="cF cCheck"><input type="checkbox" data-f="meeting_held" ${r.meeting_held?'checked':''}><span>Meeting happened</span></label>${r.stage==='not_now'?f('return_on','Bring back on',r.return_on,'date'):''}<label class="cF"><span>Follow-ups sent</span><input data-f="follow_ups" type="number" min="0" value="${r.follow_ups||0}"></label></div></div>
    <div class="cGroup"><h4>Notes</h4><textarea data-f="notes" rows="4" placeholder="Anything worth remembering">${cEsc(r.notes||'')}</textarea></div>
    <div class="cGroup"><h4>Activity</h4><ol class="cTimeline">${ev.length?ev.slice(0,30).map(e=>`<li><span>${cOwnerChip(e.by)}</span><div><b>${cEsc(pnameRaw(e.by)||'')}</b> ${cEsc(pEvText(e))}<small>${cEsc(pWhen(e.at))}</small></div></li>`).join(''):'<li class="none">Loading…</li>'}</ol></div>
   </div>
   <div class="cDFoot"><button class="crmGhost danger" data-c="del">${cSvg('trash')}<span>Delete</span></button><span class="grow"></span>${nx?`<button class="crmPrimary" data-c="next" data-id="${r.id}">Move to ${cEsc(nx.name)}${cSvg('arrow')}</button>`:''}</div>`;
  d.classList.add('on');if(first===true||!PIPE.ev[r.id])pipeEvents(r.id).then(()=>{if(CRM.open===r.id){const tl=d.querySelector('.cTimeline');const e2=PIPE.ev[r.id]||[];if(tl)tl.innerHTML=e2.length?e2.slice(0,30).map(e=>`<li><span>${cOwnerChip(e.by)}</span><div><b>${cEsc(pnameRaw(e.by)||'')}</b> ${cEsc(pEvText(e))}<small>${cEsc(pWhen(e.at))}</small></div></li>`).join(''):'<li class="none">No activity yet.</li>';}});}
function crmSaved(t){const s=document.querySelector('#crm .cSaved');if(!s)return;s.textContent=t||'Saved';s.classList.add('on');clearTimeout(s._t);s._t=setTimeout(()=>s.classList.remove('on'),1400);}
async function crmSet(id,patch,label){const r=PIPE.rows.find(x=>x.id===id);if(!r)return;const keys=Object.keys(patch).filter(k=>JSON.stringify(r[k]??null)!==JSON.stringify(patch[k]??null));if(!keys.length)return;const p={};keys.forEach(k=>p[k]=patch[k]);
  crmSaved('Saving…');const prev=await pipePatch(id,p,'edit',{fields:keys});crmSaved(prev===false?'Couldn\'t save':'Saved');}
function crmFieldVal(el){const k=el.dataset.f;if(el.type==='checkbox')return el.checked;let v=el.value.trim();if(el.type==='number')return v===''?null:+v;if(el.type==='date')return v||null;if(k==='insta')v=v.replace(/^@/,'').replace(/^https?:\/\/(www\.)?instagram\.com\//i,'').replace(/\/.*$/,'');return v===''?null:v;}

/* ---------- quick add ---------- */
function crmAddHtml(){const st=CRM.addStage||'video_needed';return `<div class="crmScrim add" data-c="addClose"></div><div class="crmAdd" role="dialog" aria-label="New prospect"><h3>New prospect</h3><p>Paste an Instagram link or handle, a website, or just type the business name.</p>
  <input id="crmAddIn" placeholder="e.g. instagram.com/thesaltybiscuit" autocomplete="off"><div class="crmAddRow"><label><span>Stage</span><select id="crmAddSt">${PIPE_STAGES.map(s=>`<option value="${s.id}" ${s.id===st?'selected':''}>${cEsc(s.name)}</option>`).join('')}</select></label><label><span>Owner</span><select id="crmAddOw">${['sam','james'].map(p=>`<option value="${p}" ${p===S.me?'selected':''}>${cEsc(pnameRaw(p))}</option>`).join('')}</select></label></div>
  <div class="crmAddFoot"><button class="crmGhost" data-c="addClose">Cancel</button><button class="crmPrimary" data-c="addGo">Add prospect</button></div></div>`;}
async function crmAddGo(){const i=document.getElementById('crmAddIn');const o=pParse(i&&i.value);if(!o.business){if(i){i.classList.remove('cShake');void i.offsetWidth;i.classList.add('cShake');i.focus();}return;}
  const st=(document.getElementById('crmAddSt')||{}).value||'video_needed',ow=(document.getElementById('crmAddOw')||{}).value||S.me;CRM.adding=false;const r=await pipeInsert({...o,stage:st,owner:ow});if(!r)return crmRender();
  CRM.open=r.id;CRM.stage=st;crmRender(true);crmSaved('Added');}

/* ---------- events ---------- */
function crmBind(el){
  el.addEventListener('click',async e=>{const b=e.target.closest('[data-c]');if(!b||!el.contains(b))return;const c=b.dataset.c,id=b.dataset.id;
    if(c!=='open'&&c!=='close')e.stopPropagation();
    if(c==='back'){location.hash='#'+(CRM.from&&CRM.from!=='pipeline'?CRM.from:'harbour');return;}
    if(c==='view'){CRM.view=b.dataset.v;CRM.open=null;crmRender();return;}
    if(c==='owner'){CRM.owner=b.dataset.o;crmRender();return;}
    if(c==='reload'){PIPE.err=null;pipeLoad();return;}
    if(c==='stage'){CRM.stage=b.dataset.s;crmRender();const col=el.querySelector(`.cCol[data-stage="${b.dataset.s}"]`);if(col&&matchMedia('(min-width:900px)').matches)col.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});return;}
    if(c==='closed'){CRM.closed=!CRM.closed;if(!CRM.closed&&PIPE_EXITS.some(s=>s.id===CRM.stage))CRM.stage='messaged';crmRender();return;}
    if(c==='toggle'){CRM[b.dataset.k]=!CRM[b.dataset.k];crmRender();return;}
    if(c==='review'){CRM.review=!CRM.review;if(CRM.review)CRM.view='board',CRM.closed=true;crmRender();return;}
    if(c==='add'||c==='addIn'){CRM.adding=true;CRM.addStage=b.dataset.s||(CRM.view==='board'?CRM.stage:'video_needed');crmRender();return;}
    if(c==='addClose'){CRM.adding=false;crmRender();return;}
    if(c==='addGo'){crmAddGo();return;}
    if(c==='open'){if(e.target.closest('a'))return;CRM.open=id;crmRender(true);return;}
    if(c==='close'){CRM.open=null;crmRender();return;}
    if(c==='next'){const r=PIPE.rows.find(x=>x.id===id);const nx=r&&PIPE_STAGES[P_IDX[r.stage]+1];if(nx){const card=b.closest('.cCard');if(card)card.classList.add('cLeaving');setTimeout(()=>pMove(id,nx.id),card?160:0);}return;}
    if(c==='done'){const row=b.closest('.crmRow');if(row)row.classList.add('cTicked');setTimeout(()=>ACT.pDone({id}),row?220:0);return;}
    if(c==='snooze'){ACT.pSnooze({id,n:3});return;}
    if(c==='quiet'){pMove(id,'no_response');return;}
    if(c==='goal'){ACT.pGoal();return;}
    const r=PIPE.rows.find(x=>x.id===CRM.open);if(!r)return;
    if(c==='setOwner'){crmSet(r.id,{owner:b.dataset.o});return;}
    if(c==='rag'){crmSet(r.id,{rag:r.rag===b.dataset.v?null:b.dataset.v});return;}
    if(c==='pri'){crmSet(r.id,{priority:!r.priority});return;}
    if(c==='prod'){const p=b.dataset.p;const cur=r.products||[];crmSet(r.id,{products:cur.includes(p)?cur.filter(x=>x!==p):[...cur,p]});return;}
    if(c==='ok'){await pipePatch(r.id,{review:null},'checked',{});crmSaved('Checked');return;}
    if(c==='del'){if(b.dataset.sure){CRM.open=null;await pipeRemove(r.id);crmRender();return;}b.dataset.sure=1;b.classList.add('sure');b.querySelector('span').textContent='Tap again to delete';setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.classList.remove('sure');b.querySelector('span').textContent='Delete';}},3000);return;}
  });
  el.addEventListener('input',e=>{const q=e.target.closest('[data-crm-q]');if(q){CRM.q=q.value;cancelAnimationFrame(CRM_RAF);CRM_RAF=requestAnimationFrame(()=>crmRender());return;}
    const f=e.target.closest('.crmDrawer [data-f]');if(f&&!['SELECT'].includes(f.tagName)&&f.type!=='checkbox'&&f.type!=='date'){const id=CRM.open;clearTimeout(CRM.saveT[f.dataset.f]);CRM.saveT[f.dataset.f]=setTimeout(()=>crmSet(id,{[f.dataset.f]:crmFieldVal(f)}),700);}});
  el.addEventListener('change',e=>{const f=e.target.closest('.crmDrawer [data-f]');if(!f)return;const id=CRM.open;const k=f.dataset.f;clearTimeout(CRM.saveT[k]);
    if(k==='stage'){const r=PIPE.rows.find(x=>x.id===id);if(r&&r.stage!==f.value)pMove(id,f.value);return;}crmSet(id,{[k]:crmFieldVal(f)});});
  el.addEventListener('keydown',e=>{if(e.key==='Escape'){if(CRM.adding){CRM.adding=false;crmRender();}else if(CRM.open){CRM.open=null;crmRender();}return;}
    if(e.key==='Enter'&&e.target.id==='crmAddIn'){e.preventDefault();crmAddGo();return;}
    if(e.key==='Enter'&&e.target.matches('[data-c="open"]')){CRM.open=e.target.dataset.id;crmRender(true);}});
  // drag and drop between columns (desktop)
  el.addEventListener('dragstart',e=>{const c=e.target.closest('.cCard');if(!c)return;CRM.drag=c.dataset.id;c.classList.add('cDragging');try{e.dataTransfer.setData('text/plain',c.dataset.id);e.dataTransfer.effectAllowed='move';}catch(x){}});
  el.addEventListener('dragend',e=>{CRM.drag=null;el.querySelectorAll('.cDragging,.cOver').forEach(x=>x.classList.remove('cDragging','cOver'));});
  el.addEventListener('dragover',e=>{const col=e.target.closest('.cCol');if(!col||!CRM.drag)return;e.preventDefault();el.querySelectorAll('.cOver').forEach(x=>x!==col&&x.classList.remove('cOver'));col.classList.add('cOver');});
  el.addEventListener('drop',e=>{const col=e.target.closest('.cCol');if(!col||!CRM.drag)return;e.preventDefault();const id=CRM.drag;CRM.drag=null;col.classList.remove('cOver');const r=PIPE.rows.find(x=>x.id===id);if(r&&r.stage!==col.dataset.stage)pMove(id,col.dataset.stage);});}
document.addEventListener('keydown',e=>{if(!document.documentElement.classList.contains('crmOpen'))return;if(e.target.matches('input,textarea,select'))return;
  if(e.key==='/'){e.preventDefault();const i=document.querySelector('#crm [data-crm-q]');if(i)i.focus();}else if(e.key==='n'){e.preventDefault();CRM.adding=true;crmRender();}});
// buttons inside the pipeline keep its own calm style, not the game's bouncy one
{const _pt=pzTag;pzTag=function(root){_pt.apply(this,arguments);document.querySelectorAll('#crm [class*=pz]').forEach(x=>[...x.classList].forEach(k=>{if(/^pz/.test(k))x.classList.remove(k);}));};}
