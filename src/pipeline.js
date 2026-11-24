/* ============================== 22 Nov: the client pipeline (part 1) ==============================
   Prospects live in Supabase (hl_prospects, hl_prospect_events), readable only by Sam's and James's logins, and sync
   live between you. No client details are in this file or the bundle. Opened from the banner at the top of More (and
   #pipeline). Part 1: the Board (stages, cards, quick add, swipe to move, full edit, history), Clients, and the
   import check. Part 2 adds Overview, Schedule, Growth, reminders, game taps and the Harbour button. */
const PIPE_STAGES=[
  {id:'video_needed',name:'Video needed',col:'#C0392B',hint:'Record a video for these'},
  // 24 Nov: 'Video made' and 'Video sent' are one stage now, called Video made (the id stays 'messaged')
  {id:'messaged',name:'Video made',col:'#3E8DDB',hint:'Made and sent, waiting to hear back'},
  {id:'followed_up',name:'Followed up',col:'#2E8C88',hint:'Nudged at least once'},
  {id:'talking',name:'Talking',col:'#2F9A63',hint:'They replied'},
  {id:'meeting',name:'Meeting',col:'#D9902B',hint:'Booked or held'},
  {id:'quote_sent',name:'Quote sent',col:'#B8642A',hint:'Waiting on a yes'},
  {id:'client',name:'Client',col:'#A9781C',hint:'Won'}];
const PIPE_EXITS=[{id:'not_now',name:'Not now',col:'#7A8794',hint:'Comes back on a set date'},{id:'no_response',name:'No response',col:'#5E6A76',hint:'Kept for later'},{id:'archived',name:'Archived',col:'#A3ACB5',hint:'No longer relevant'}];
const PIPE_ALL=[...PIPE_STAGES,...PIPE_EXITS];const PIPE_BY=Object.fromEntries(PIPE_ALL.map(s=>[s.id,s]));PIPE_BY.video_made=PIPE_BY.messaged;
// anything still marked with the old 'video made' stage joins Video made
const pNorm=r=>{if(r&&r.stage==='video_made')r.stage='messaged';return r;};
const PIPE_PRODUCTS=['Websites','Full Package','Social Media Management','Branding','Email & SMS','Paid Adverts'];
const PIPE_RAG={likely:{n:'Likely',c:'#2F9A63'},maybe:{n:'Maybe',c:'#D9902B'},unlikely:{n:'Unlikely',c:'#C0392B'}};
const PIPE={rows:[],ready:false,err:null,src:null,ev:{},undo:null,allEv:null};

/* ---------- data ---------- */
const pLocal={get(){try{return JSON.parse(localStorage.getItem('hl_pipe_v1')||'[]');}catch(e){return [];}},set(r){try{localStorage.setItem('hl_pipe_v1',JSON.stringify(r));}catch(e){}}};
function pipeStart(){if(PIPE.src)return;if(S.sb){PIPE.src='supa';pipeLoad();
    try{S.sb.channel('hl-pipe').on('postgres_changes',{event:'*',schema:'public',table:'hl_prospects'},p=>{if(p.eventType==='DELETE'){PIPE.rows=PIPE.rows.filter(r=>r.id!==(p.old&&p.old.id));}else if(p.new){const i=PIPE.rows.findIndex(r=>r.id===p.new.id);pNorm(p.new);if(i>=0)PIPE.rows[i]=p.new;else PIPE.rows.push(p.new);}pipeRefresh();}).subscribe();}catch(e){console.warn('pipe sub',e);}
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)pipeLoad();});}
  else{PIPE.src='local';PIPE.rows=pLocal.get().map(pNorm);PIPE.ready=true;}}
async function pipeLoad(){try{const {data,error}=await S.sb.from('hl_prospects').select('*').order('sort',{ascending:true}).limit(5000);if(error)throw error;PIPE.rows=(data||[]).map(pNorm);PIPE.ready=true;PIPE.err=null;}catch(e){PIPE.err=(e&&e.message)||'Could not load the pipeline';PIPE.ready=true;}pipeRefresh();}
function pipeRefresh(){if(S.screen==='pipeline'||S.screen==='more')render();}
function pipeSaveLocal(){if(PIPE.src==='local')pLocal.set(PIPE.rows);}
async function pipeLog(id,kind,detail){const ev={prospect_id:id,by:S.me,kind,detail:detail||{},at:new Date().toISOString()};(PIPE.ev[id]=PIPE.ev[id]||[]).unshift(ev);if(PIPE.allEv)PIPE.allEv.unshift(ev);
  if(PIPE.src==='supa'){try{await S.sb.from('hl_prospect_events').insert({prospect_id:id,by:S.me,kind,detail:detail||{}});}catch(e){}}else{try{const k='hl_pipe_ev_'+id;const l=JSON.parse(localStorage.getItem(k)||'[]');l.unshift(ev);localStorage.setItem(k,JSON.stringify(l.slice(0,200)));}catch(e){}}}
async function pipePatch(id,patch,kind,detail){const r=PIPE.rows.find(x=>x.id===id);if(!r)return;const prev={};Object.keys(patch).forEach(k=>prev[k]=r[k]);Object.assign(r,patch,{updated_by:S.me,updated_at:new Date().toISOString()});pipeSaveLocal();pipeRefresh();
  if(PIPE.src==='supa'){const {error}=await S.sb.from('hl_prospects').update({...patch,updated_by:S.me}).eq('id',id);if(error){Object.assign(r,prev);pipeRefresh();toast(`<b>Couldn't save.</b> ${esc(error.message||'')}`,'joke');return false;}}
  if(kind)pipeLog(id,kind,detail);return prev;}
async function pipeInsert(o){const id=(crypto.randomUUID&&crypto.randomUUID())||uid();const st=o.stage||'video_needed';const sort=Math.max(0,...PIPE.rows.filter(r=>r.stage===st).map(r=>r.sort||0))+1;
  const r=Object.assign({id,business:'',owner:S.me,stage:st,products:[],tags:[],links:[],priority:false,follow_ups:0,meeting_held:false,sort,source:'Added in the game',created_at:new Date().toISOString(),updated_by:S.me},o);
  PIPE.rows.push(r);pipeSaveLocal();pipeRefresh();
  if(PIPE.src==='supa'){const {error}=await S.sb.from('hl_prospects').insert(r);if(error){PIPE.rows=PIPE.rows.filter(x=>x.id!==id);pipeRefresh();toast(`<b>Couldn't add it.</b> ${esc(error.message||'')}`,'joke');return null;}}
  pipeLog(id,'created',{stage:st});return r;}
async function pipeRemove(id){const r=PIPE.rows.find(x=>x.id===id);if(!r)return;PIPE.rows=PIPE.rows.filter(x=>x.id!==id);pipeSaveLocal();pipeRefresh();
  if(PIPE.src==='supa'){const {error}=await S.sb.from('hl_prospects').delete().eq('id',id);if(error){PIPE.rows.push(r);pipeRefresh();toast(`<b>Couldn't remove it.</b> ${esc(error.message||'')}`,'joke');}}else{try{localStorage.removeItem('hl_pipe_ev_'+id);}catch(e){}}}
async function pipeEvents(id){if(PIPE.src==='supa'){try{const {data}=await S.sb.from('hl_prospect_events').select('*').eq('prospect_id',id).order('at',{ascending:false}).limit(100);PIPE.ev[id]=data||[];}catch(e){}}
  else{try{PIPE.ev[id]=JSON.parse(localStorage.getItem('hl_pipe_ev_'+id)||'[]');}catch(e){PIPE.ev[id]=[];}}return PIPE.ev[id]||[];}

/* ---------- helpers ---------- */
const PAV={};const pAvatar=p=>{const k=p+'|'+JSON.stringify((S.players[p]||{}).look||{});if(!PAV[k])PAV[k]=avatarCanvas(p);return PAV[k];};
const pIni=s=>{const w=String(s||'?').replace(/[^\p{L}\p{N} &]/gu,' ').split(/\s+/).filter(x=>x&&x!=='&'&&!/^(the|and|of)$/i.test(x));return ((w[0]||'?')[0]+((w[1]||'')[0]||'')).toUpperCase();};
const pMoney=n=>n==null||n===''?'':'£'+fmtN(Math.round(+n));
const pVal=r=>r.deal_value!=null?+r.deal_value:r.quote_value!=null?+r.quote_value:null;
// when a prospect is next due: the date you set, else a sensible gap after the last contact (so the imported sheet has dates too)
const P_GAP={video_needed:7,messaged:5,followed_up:5,talking:3,quote_sent:4};
// a video that's been waiting a week (from the last contact, or from when they were added) is due
const pBase=r=>r.last_contact||(r.stage==='video_needed'&&r.created_at?String(r.created_at).slice(0,10):null);
function pDueDate(r){if(r.stage==='archived')return null;if(r.stage==='not_now')return r.return_on||null;if(r.stage==='client'||r.stage==='no_response')return null;if(r.stage==='meeting'&&!r.meeting_held&&r.meeting_at)return r.meeting_at;if(r.next_due)return r.next_due;const g=P_GAP[r.stage];const b=pBase(r);return g&&b?addDays(b,g):null;}
function pDue(r){const d=pDueDate(r);if(!d)return null;const t=G.today;return{d,cls:d<addDays(t,-30)?'stale':d<t?'over':d===t?'today':'later'};}
function pDueN(rows){return (rows||PIPE.rows).filter(r=>{const d=pDue(r);return d&&(d.cls==='over'||d.cls==='today');}).length;}
const pShortD=d=>{try{return new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short'});}catch(e){return d;}};
const pHost=u=>{try{return new URL(/^https?:/.test(u)?u:'https://'+u).hostname.replace(/^www\./,'');}catch(e){return u;}};
function pFilter(rows){const ow=S.view.powner||'all';return rows.filter(r=>ow==='all'||r.owner===ow);}
function pRank(st){return (a,b)=>(b.priority?1:0)-(a.priority?1:0)||(st==='video_needed'?(pDueDate(a)||'9999').localeCompare(pDueDate(b)||'9999'):0)||(a.sort||0)-(b.sort||0);}
function pStageRows(st){return pFilter(PIPE.rows.filter(r=>r.stage===st)).sort(pRank(st));}
function pSearchKey(r){return [r.business,r.contact,r.insta,r.website,r.niche,r.location,(r.products||[]).join(' '),r.notes].filter(Boolean).join(' ').toLowerCase();}

/* ---------- the sliding pill tab bar (the reel's stretchy motion: the front edge leads, the back edge catches up) ---------- */
function pillNav(id,tabs,cur,act){return `<nav class="pillNav" id="${id}" data-cur="${cur}">${tabs.map(([k,n,b])=>`<button class="${k===cur?'on':''}" data-act="${act}" data-t="${k}">${n}${b?` <span class="qBadge">${b}</span>`:''}</button>`).join('')}<i class="pillInd" aria-hidden="true"></i></nav>`;}
const PILL_POS={};
function pillPlace(nav){const on=nav.querySelector('button.on');const ind=nav.querySelector('.pillInd');if(!on||!ind)return;const nr=nav.getBoundingClientRect(),br=on.getBoundingClientRect();const L=br.left-nr.left+nav.scrollLeft,Rr=nr.width-(br.right-nr.left)-nav.scrollLeft;
  const prev=PILL_POS[nav.id];ind.style.transition='none';if(prev){ind.style.left=prev.L+'px';ind.style.right=prev.R+'px';void ind.offsetWidth;const right=L>prev.L;
    ind.style.transition=right?'left .42s cubic-bezier(.5,0,.2,1) .06s,right .26s cubic-bezier(.4,0,.2,1)':'left .26s cubic-bezier(.4,0,.2,1),right .42s cubic-bezier(.5,0,.2,1) .06s';}
  ind.style.left=L+'px';ind.style.right=Rr+'px';PILL_POS[nav.id]={L,R:Rr};}

/* ---------- cards ---------- */
function pCard(r){const st=PIPE_BY[r.stage]||PIPE_STAGES[0];const due=pDue(r);const v=pVal(r);const rag=PIPE_RAG[r.rag];
  const prod=(r.products||[]).map(p=>p==='Social Media Management'?'Social':p==='Full Package'?'Full package':p).join(' · ');
  const nextSt=PIPE_STAGES[PIPE_STAGES.findIndex(s=>s.id===r.stage)+1];
  return `<div class="pCard ${r.priority?'prio':''}" data-act="pOpen" data-id="${r.id}" data-q="${esc(pSearchKey(r))}" style="--sc:${st.col}">
    <span class="pIni">${esc(pIni(r.business))}</span>
    <div class="grow"><b>${esc(r.business||'Unnamed')}</b><small>${esc([r.contact,prod].filter(Boolean).join(' · ')||'No details yet')}</small>
      <div class="pMeta">${rag?`<span class="pRag" style="--rc:${rag.c}">${rag.n}</span>`:''}${r.priority?'<span class="pTag hot">Priority</span>':''}${v!=null?`<span class="pTag">${pMoney(v)}${r.deal_period==='monthly'?'/mo':''}</span>`:''}${r.follow_ups?`<span class="pTag">${r.follow_ups}× followed up</span>`:''}${due?`<span class="pDue ${due.cls}">${due.cls==='stale'?`Gone quiet${r.last_contact?' · '+pShortD(r.last_contact):''}`:(due.cls==='over'?'Overdue · ':due.cls==='today'?'Today · ':'')+pShortD(due.d)}</span>`:''}${r.review?'<span class="pTag chk">Check</span>':''}</div></div>
    <div class="pSide"><img class="pOwner" alt="${esc(pname(r.owner))}" src="${pAvatar(r.owner)}">${nextSt?`<button class="pNext" data-act="pNext" data-id="${r.id}" aria-label="Move to ${esc(nextSt.name)}" title="Move to ${esc(nextSt.name)}">›</button>`:''}</div></div>`;}

/* ---------- the screen ---------- */
SCREENS.pipeline=()=>{pipeStart();const tab=S.view.ptab||'overview';
  if(!PIPE.ready)return `<div class="pad pipePage"><div class="card pEmpty"><h2>Pipeline</h2><p class="muted">Loading your prospects…</p></div></div>`;
  const act=PIPE.rows.filter(r=>PIPE_STAGES.some(s=>s.id===r.stage)&&r.stage!=='client');const cl=PIPE.rows.filter(r=>r.stage==='client');
  const mrr=cl.filter(r=>r.deal_period==='monthly').reduce((a,r)=>a+(+r.deal_value||0),0);const due=pDueN();const chk=PIPE.rows.filter(r=>r.review).length;
  const head=`<div class="pipeTop"><div class="grow"><h2>Pipeline</h2><small>${act.length} active · ${cl.length} client${cl.length===1?'':'s'}${mrr?` · ${pMoney(mrr)} a month`:''}${due?` · <b data-act="pTab" data-t="schedule" class="pDueLink">${due} due</b>`:''}</small></div><button class="btn primary pAddBtn" data-act="pAdd">+ New</button></div>
    ${PIPE.err?`<div class="card pErr"><b>Couldn't reach the pipeline.</b><small>${esc(PIPE.err)}</small><button class="btn sm" data-act="pReload">Try again</button></div>`:''}
    ${pillNav('pTabs',[['overview','Overview'],['board','Board'],['schedule','Schedule',due],['clients','Clients'],['growth','Growth'],...(chk?[['review','Check import',chk]]:[])],tab,'pTab')}`;
  const body={overview:()=>pOverviewHtml(),schedule:()=>pScheduleHtml(),growth:()=>pGrowthHtml(),clients:()=>pClientsHtml(cl),review:()=>pReviewHtml()}[tab];
  return `<div class="pad pipePage">${head}${body?body():pBoardHtml()}</div>`;};
function pBoardHtml(){const cur=S.view.pstage||'video_needed';const st=PIPE_BY[cur];const rows=pStageRows(cur);const tot=rows.reduce((a,r)=>a+(pVal(r)||0),0);const ow=S.view.powner||'all';
  const strip=`<div class="pStrip" role="tablist">${PIPE_ALL.map((s,i)=>`${i===PIPE_STAGES.length?'<span class="pStripGap"></span>':''}<button class="pStage ${s.id===cur?'on':''}" role="tab" aria-selected="${s.id===cur}" data-act="pStage" data-s="${s.id}" style="--sc:${s.col}"><i></i>${esc(s.name)}<b>${pFilter(PIPE.rows.filter(r=>r.stage===s.id)).length}</b></button>`).join('')}</div>`;
  return `<div class="pTools"><input class="pSearch" type="search" placeholder="Search name, contact, product or notes" aria-label="Search the pipeline" value="${esc(S.view.pq||'')}" data-pq><div class="seg mini pOwn">${[['all','Everyone'],['sam',pnameRaw('sam')],['james',pnameRaw('james')]].map(([k,n])=>`<button class="${ow===k?'on':''}" data-act="pOwner" data-o="${k}">${esc(n)}</button>`).join('')}</div></div>
   ${strip}
   <div class="pCol" style="--sc:${st.col}"><div class="pColHead"><div class="grow"><b>${esc(st.name)}</b><small>${rows.length} · ${esc(st.hint)}${tot?` · ${pMoney(tot)}`:''}</small></div><button class="btn sm" data-act="pAdd" data-s="${cur}">+ Add here</button></div>
     <div class="pList">${rows.length?rows.map(pCard).join(''):`<p class="pNone">Nothing in ${esc(st.name)}${ow!=='all'?` for ${esc(pnameRaw(ow))}`:''}.</p>`}</div>
     <p class="pHint">Swipe a card right to move it on, or tap it to edit.</p></div>
   <div class="pAllRes" hidden></div>`;}
function pClientsHtml(cl){const mrr=cl.filter(r=>r.deal_period==='monthly').reduce((a,r)=>a+(+r.deal_value||0),0),one=cl.filter(r=>r.deal_period!=='monthly').reduce((a,r)=>a+(+r.deal_value||0),0);
  return `<div class="pTotals"><div><b class="num">${pMoney(mrr)}</b><small>a month in retainers</small></div><div><b class="num">${pMoney(one)}</b><small>one-off work</small></div><div><b class="num">${cl.length}</b><small>clients</small></div></div>
   <div class="pList">${cl.length?cl.sort((a,b)=>(b.deal_value||0)-(a.deal_value||0)).map(r=>`<div class="pCard client" data-act="pOpen" data-id="${r.id}" style="--sc:${PIPE_BY.client.col}"><span class="pIni">${esc(pIni(r.business))}</span><div class="grow"><b>${esc(r.business)}</b><small>${esc([r.contact,(r.products||[]).join(' · ')].filter(Boolean).join(' · ')||'No details yet')}</small>
     <div class="pMeta">${r.deal_value!=null?`<span class="pTag gold">${pMoney(r.deal_value)}${r.deal_period==='monthly'?' a month':' one-off'}</span>`:''}${r.editor?`<span class="pTag">Editor: ${esc(r.editor)}</span>`:''}${r.website?`<a class="pTag link" href="${esc(/^https?:/.test(r.website)?r.website:'https://'+r.website)}" target="_blank" rel="noopener">${esc(pHost(r.website))}</a>`:''}</div></div><div class="pSide"><img class="pOwner" alt="" src="${pAvatar(r.owner)}"></div></div>`).join(''):'<p class="pNone">No clients yet. The first one gets fireworks.</p>'}</div>`;}
function pReviewHtml(){const rows=PIPE.rows.filter(r=>r.review);return `<div class="card pRev"><h3>Check the import</h3><p class="tiny muted">These rows from your sheet need a quick look. Open one to fix it, or mark it as right.</p></div>
  <div class="pList">${rows.map(r=>`<div class="pCard rev" style="--sc:${(PIPE_BY[r.stage]||PIPE_STAGES[0]).col}"><span class="pIni">${esc(pIni(r.business))}</span><div class="grow"><b>${esc(r.business)}</b><small>${esc(r.review)}</small><div class="pMeta"><span class="pTag">${esc((PIPE_BY[r.stage]||{}).name||r.stage)}</span></div></div>
    <div class="pRevBtns"><button class="btn sm" data-act="pOpen" data-id="${r.id}">Open</button><button class="btn sm primary" data-act="pOk" data-id="${r.id}">Looks right</button></div></div>`).join('')||'<p class="pNone">All checked. Nice work.</p>'}</div>`;}

/* ---------- moving cards ---------- */
async function pMove(id,to,opts){const r=PIPE.rows.find(x=>x.id===id);if(!r||r.stage===to)return;const from=r.stage;const t=G.today;const patch={stage:to};
  if(to==='messaged'||to==='followed_up'){patch.last_contact=t;if(!r.next_due||r.next_due<=t)patch.next_due=addDays(t,5);}
  if(to==='followed_up')patch.follow_ups=(r.follow_ups||0)+1;if(to==='client'&&!r.won_at)patch.won_at=t;if(to==='messaged'&&from==='video_needed')patch.priority=false;
  if(to==='not_now'){patch.return_on=(opts&&opts.ret)||r.return_on||addDays(t,30);}
  const sort=Math.max(0,...PIPE.rows.filter(x=>x.stage===to).map(x=>x.sort||0))+1;patch.sort=sort;
  const prev=await pipePatch(id,patch,'stage',{from,to});if(prev===false)return;PIPE.undo={id,prev,to};try{SND.pop&&SND.pop();}catch(e){}
  if(to==='client'){try{fireworks(2600);SND.level&&SND.level();}catch(e){}}
  const gk=P_GAME[to];const offer=gk&&!(r.tags||[]).includes('game:'+gk)&&!(opts&&opts.quiet);
  toast(`<b>${esc(r.business)}</b> moved to ${esc(PIPE_BY[to].name)}.${typeof pQuip==='function'&&pQuip(to)?` <i class="pQuip">${esc(pQuip(to))}</i>`:''}${offer?` <button class="tLink gold" data-act="pGame" data-k="${gk}" data-id="${r.id}">Count it: +${fmtN(KINDS[gk].xp)} XP</button>`:''} <button class="tLink" data-act="pUndo">Undo</button>`,'',offer?8000:5000);}
ACT.pNext=(d,el)=>{const r=PIPE.rows.find(x=>x.id===d.id);if(!r)return;const i=PIPE_STAGES.findIndex(s=>s.id===r.stage);const nx=PIPE_STAGES[i+1];if(!nx)return;const card=el&&el.closest('.pCard');
  if(card&&!matchMedia('(prefers-reduced-motion: reduce)').matches){card.classList.add('sailOff');setTimeout(()=>pMove(r.id,nx.id),260);}else pMove(r.id,nx.id);};
ACT.pUndo=async()=>{const u=PIPE.undo;if(!u)return;PIPE.undo=null;await pipePatch(u.id,u.prev,'stage',{from:u.to,to:u.prev.stage,undo:true});};
ACT.pStage=d=>{S.view.pstage=d.s;render();};
ACT.pTab=d=>{S.view.ptab=d.t;render();};
ACT.pOwner=d=>{S.view.powner=d.o;render();};
ACT.pReload=()=>{PIPE.ready=false;render();pipeLoad();};
ACT.pOk=async d=>{await pipePatch(d.id,{review:null},'checked',{});};

/* ---------- quick add ---------- */
function pParse(txt){const s=String(txt||'').trim();const o={};if(!s)return o;
  const ig=s.match(/instagram\.com\/([A-Za-z0-9_.]+)/i)||s.match(/^@([A-Za-z0-9_.]+)$/);
  const nice=w=>w.replace(/[._-]+/g,' ').replace(/\b(uk|co|ltd)\b$/i,'').trim().replace(/\s+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  if(ig){o.insta=ig[1];o.business=nice(ig[1]);return o;}
  if(/^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(s)){const h=pHost(s);o.website=/^https?:/.test(s)?s:'https://'+s;o.business=nice(h.split('.')[0]);return o;}
  o.business=s;return o;}
ACT.pAdd=d=>{const st=(d&&d.s)||S.view.pstage||'video_needed';
  openModal(`<h2>New prospect</h2><p class="muted" style="margin:2px 0 10px">Paste a website or Instagram link, or type the business name. Everything else can wait.</p>
   <label class="f">Link or name<input id="pqa" placeholder="instagram.com/… or www.… or a name" autocomplete="off"></label>
   <div id="pqaPrev" class="pQaPrev tiny muted">It'll go into <b>${esc(PIPE_BY[st].name)}</b>, owned by ${esc(pnameRaw(S.me))}.</div>
   <label class="f">Stage<select id="pqaSt">${PIPE_ALL.map(s=>`<option value="${s.id}" ${s.id===st?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label>
   <div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px"><button class="btn ghost" data-act="wnClose">Cancel</button><button class="btn primary" data-act="pAddGo">Add</button></div>`);
  setTimeout(()=>{const i=$('#pqa');if(!i)return;i.focus();i.addEventListener('input',()=>{const o=pParse(i.value);$('#pqaPrev').innerHTML=o.business?`Adds <b>${esc(o.business)}</b>${o.insta?` (@${esc(o.insta)})`:o.website?` (${esc(pHost(o.website))})`:''}. You can rename it after.`:'';});i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();ACT.pAddGo();}});},30);};
ACT.pAddGo=async()=>{const o=pParse(($('#pqa')||{}).value);if(!o.business){const i=$('#pqa');if(i){i.focus();i.classList.add('shake');setTimeout(()=>i.classList.remove('shake'),400);}return;}
  const st=($('#pqaSt')||{}).value||'video_needed';closeModal();const r=await pipeInsert({...o,stage:st});if(!r)return;S.view.ptab='board';S.view.pstage=st;if(location.hash!=='#pipeline')location.hash='#pipeline';else render();
  toast(`<b>${esc(r.business)}</b> added to ${esc(PIPE_BY[st].name)}. Tap it to add details.`);};

/* ---------- the full card: edit everything, see the history ---------- */
const pv=(id)=>{const e=$('#'+id);return e?e.value.trim():'';};
ACT.pOpen=async d=>{const r=PIPE.rows.find(x=>x.id===d.id);if(!r)return;const st=PIPE_BY[r.stage]||PIPE_STAGES[0];const opt=(v,n,cur)=>`<option value="${v}" ${v===cur?'selected':''}>${n}</option>`;
  const fld=(id,lab,val,type='text',ph='')=>`<label class="f">${lab}<input id="${id}" type="${type}" value="${esc(val==null?'':val)}" placeholder="${esc(ph)}"></label>`;
  openModal(`<div class="pDet" style="--sc:${st.col}" data-id="${r.id}">
   <div class="pDetHead"><span class="pIni big">${esc(pIni(r.business))}</span><div class="grow"><input id="pf_business" class="pBigIn" value="${esc(r.business||'')}" aria-label="Business name"><small>${r.created_at?`Added ${pShortD(String(r.created_at).slice(0,10))}`:''}${r.source?` · ${esc(r.source)}`:''}</small></div></div>
   ${r.review?`<div class="pRevNote"><b>Check:</b> ${esc(r.review)}<label class="pChk"><input type="checkbox" id="pf_reviewed" checked> Mark as checked when I save</label></div>`:''}
   <div class="pGrid2"><label class="f">Stage<select id="pf_stage">${PIPE_ALL.map(s=>opt(s.id,s.name,r.stage)).join('')}</select></label>
     <label class="f">Owner<select id="pf_owner">${['sam','james'].map(p=>opt(p,esc(pnameRaw(p)),r.owner)).join('')}</select></label></div>
   <div class="pGrid2"><label class="f">How likely<select id="pf_rag">${opt('','Not set',r.rag||'')}${Object.entries(PIPE_RAG).map(([k,v])=>opt(k,v.n,r.rag)).join('')}</select></label>
     <label class="f pChkF"><span>Priority</span><input type="checkbox" id="pf_priority" ${r.priority?'checked':''}></label></div>
   <div class="f"><span>Products</span><div class="pProds">${PIPE_PRODUCTS.map(p=>`<label class="pProd"><input type="checkbox" value="${esc(p)}" ${(r.products||[]).includes(p)?'checked':''}> ${esc(p)}</label>`).join('')}</div></div>
   <h4 class="pSec">Who</h4>
   <div class="pGrid2">${fld('pf_contact','Contact',r.contact)}${fld('pf_niche','Niche',r.niche,'text','e.g. Interiors')}</div>
   <div class="pGrid2">${fld('pf_website','Website',r.website,'url','https://')}${fld('pf_insta','Instagram',r.insta,'text','handle')}</div>
   <div class="pGrid2">${fld('pf_email','Email',r.email,'email')}${fld('pf_phone','Phone',r.phone,'tel')}</div>
   ${fld('pf_location','Location',r.location)}
   <h4 class="pSec">Links</h4>
   <div class="pLinkRow">${fld('pf_video_url','Video (Loom)',r.video_url,'url','https://www.loom.com/share/…')}${r.video_url?`<a class="btn sm" href="${esc(r.video_url)}" target="_blank" rel="noopener">Play</a>`:''}</div>
   <div class="pLinkRow">${fld('pf_quote_url','Quote',r.quote_url,'url','https://')}${r.quote_url?`<a class="btn sm" href="${esc(r.quote_url)}" target="_blank" rel="noopener">Open</a>`:''}</div>
   <div class="pOpenRow">${r.website?`<a class="btn sm" href="${esc(/^https?:/.test(r.website)?r.website:'https://'+r.website)}" target="_blank" rel="noopener">Website</a>`:''}${r.insta?`<a class="btn sm" href="https://www.instagram.com/${esc(r.insta)}/" target="_blank" rel="noopener">Instagram</a>`:''}${r.email?`<a class="btn sm" href="mailto:${esc(r.email)}">Email</a>`:''}</div>
   <h4 class="pSec">Money</h4>
   <div class="pGrid2">${fld('pf_quote_value','Quote value (£)',r.quote_value,'number')}${fld('pf_deal_value','Deal value (£)',r.deal_value,'number')}</div>
   <div class="pGrid2"><label class="f">Paid<select id="pf_deal_period">${opt('','Not set',r.deal_period||'')}${opt('monthly','Monthly',r.deal_period)}${opt('one_off','One-off',r.deal_period)}</select></label>${fld('pf_editor','Looked after by',r.editor)}</div>
   <h4 class="pSec">Dates</h4>
   <div class="pGrid2">${fld('pf_last_contact','Last contact',r.last_contact,'date')}<label class="f">Follow-ups<input id="pf_follow_ups" type="number" min="0" value="${r.follow_ups||0}"></label></div>
   <div class="pGrid2">${fld('pf_meeting_at','Meeting',r.meeting_at,'date')}<label class="f pChkF"><span>Meeting held</span><input type="checkbox" id="pf_meeting_held" ${r.meeting_held?'checked':''}></label></div>
   <div class="pGrid2">${fld('pf_next_action','Next action',r.next_action,'text','e.g. Send the quote')}${fld('pf_next_due','Due',r.next_due,'date')}</div>
   ${fld('pf_return_on','Bring back on (for Not now)',r.return_on,'date')}
   <label class="f">Notes<textarea id="pf_notes" rows="3">${esc(r.notes||'')}</textarea></label>
   <h4 class="pSec">History</h4><div class="pHist" id="pHist"><small class="muted">Loading…</small></div>
   <div class="pDetBtns"><button class="btn ghost danger" data-act="pDel" data-id="${r.id}">Remove</button><span class="grow"></span><button class="btn ghost" data-act="wnClose">Close</button><button class="btn primary" data-act="pSave" data-id="${r.id}">Save</button></div></div>`);
  const ev=await pipeEvents(r.id);const h=$('#pHist');if(h)h.innerHTML=ev.length?ev.map(e=>`<div class="pEv"><b>${esc(pnameRaw(e.by||'')||'Someone')}</b> ${esc(pEvText(e))}<small>${pWhen(e.at)}</small></div>`).join(''):'<small class="muted">Nothing yet. Changes show up here.</small>';};
function pEvText(e){const d=e.detail||{};if(e.kind==='stage')return d.undo?`undid the move back to ${(PIPE_BY[d.to]||{}).name||d.to}`:`moved it from ${(PIPE_BY[d.from]||{}).name||d.from} to ${(PIPE_BY[d.to]||{}).name||d.to}`;if(e.kind==='created')return `added it to ${(PIPE_BY[d.stage]||{}).name||'the pipeline'}`;if(e.kind==='edit')return `edited ${(d.fields||[]).slice(0,4).join(', ')}${(d.fields||[]).length>4?'…':''}`;if(e.kind==='checked')return 'checked the imported details';if(e.kind==='import')return 'imported it from the sheet';return e.kind;}
function pWhen(at){try{const d=new Date(at);return d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})+' '+d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});}catch(e){return '';}}
ACT.pSave=async d=>{const r=PIPE.rows.find(x=>x.id===d.id);if(!r)return;const num=v=>v===''?null:+v;const dt=v=>v||null;
  const patch={business:pv('pf_business')||r.business,owner:pv('pf_owner')||r.owner,rag:pv('pf_rag')||null,priority:!!($('#pf_priority')||{}).checked,
    products:[...document.querySelectorAll('.pProds input:checked')].map(i=>i.value),contact:pv('pf_contact')||null,niche:pv('pf_niche')||null,website:pv('pf_website')||null,insta:(pv('pf_insta')||'').replace(/^@/,'').replace(/.*instagram\.com\//i,'').replace(/\/.*$/,'')||null,
    email:pv('pf_email')||null,phone:pv('pf_phone')||null,location:pv('pf_location')||null,video_url:pv('pf_video_url')||null,quote_url:pv('pf_quote_url')||null,
    quote_value:num(pv('pf_quote_value')),deal_value:num(pv('pf_deal_value')),deal_period:pv('pf_deal_period')||null,editor:pv('pf_editor')||null,
    last_contact:dt(pv('pf_last_contact')),follow_ups:Math.max(0,parseInt(pv('pf_follow_ups')||'0',10)||0),meeting_at:dt(pv('pf_meeting_at')),meeting_held:!!($('#pf_meeting_held')||{}).checked,
    next_action:pv('pf_next_action')||null,next_due:dt(pv('pf_next_due')),return_on:dt(pv('pf_return_on')),notes:pv('pf_notes')||null};
  if(r.review&&($('#pf_reviewed')||{}).checked)patch.review=null;
  const newStage=pv('pf_stage');const changed=Object.keys(patch).filter(k=>JSON.stringify(patch[k]??null)!==JSON.stringify(r[k]??null));
  if(changed.length){const ok=await pipePatch(r.id,patch,'edit',{fields:changed.map(k=>k.replace(/_/g,' '))});if(ok===false)return;}
  closeModal();if(newStage&&newStage!==r.stage)await pMove(r.id,newStage);else if(changed.length)toast(`<b>Saved.</b> ${esc(r.business)} is up to date.`);};
ACT.pDel=d=>{const r=PIPE.rows.find(x=>x.id===d.id);if(!r)return;openModal(`<h2>Remove ${esc(r.business)}?</h2><p class="muted">This deletes the prospect and its history for both of you. It can't be undone. If they've just gone quiet, Not now or No response keeps them for later.</p>
  <div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px"><button class="btn ghost" data-act="pOpen" data-id="${r.id}">Keep it</button><button class="btn danger" data-act="pDelGo" data-id="${r.id}">Remove for good</button></div>`);};
ACT.pDelGo=async d=>{const r=PIPE.rows.find(x=>x.id===d.id);closeModal();await pipeRemove(d.id);if(r)toast(`<b>${esc(r.business)}</b> removed.`);};

/* ---------- search filters cards in place (no re-render, so typing stays smooth) ---------- */
document.addEventListener('input',e=>{const i=e.target.closest&&e.target.closest('[data-pq]');if(!i)return;S.view.pq=i.value;pApplySearch();});
function pApplySearch(){const q=(S.view.pq||'').trim().toLowerCase();const box=$('.pAllRes'),col=$('.pCol'),strip=$('.pStrip');if(!box||!col)return;
  if(!q){box.hidden=true;box.innerHTML='';col.hidden=false;if(strip)strip.hidden=false;return;}
  const hits=pFilter(PIPE.rows).filter(r=>pSearchKey(r).includes(q));col.hidden=true;if(strip)strip.hidden=true;box.hidden=false;
  box.innerHTML=`<p class="pHint" style="margin:6px 4px">${hits.length} match${hits.length===1?'':'es'} across every stage</p><div class="pList">${hits.map(r=>pCard(r).replace('<div class="grow"><b>',`<div class="grow"><em class="pStTag" style="--sc:${(PIPE_BY[r.stage]||{}).col}">${esc((PIPE_BY[r.stage]||{}).name||'')}</em><b>`)).join('')||'<p class="pNone">Nothing matches.</p>'}</div>`;}

/* ---------- swipe a card right to move it on ---------- */
(function pSwipe(){let st=null;
  document.addEventListener('pointerdown',e=>{const c=e.target.closest&&e.target.closest('.pCard');if(!c||e.target.closest('button,a,input')||!c.closest('.pCol,.pAllRes'))return;st={c,x:e.clientX,y:e.clientY,dx:0,on:false,id:pid(c)};},{passive:true});
  const pid=c=>c.dataset.id||((c.querySelector('[data-id]')||{}).dataset||{}).id;
  document.addEventListener('pointermove',e=>{if(!st)return;const dx=e.clientX-st.x,dy=e.clientY-st.y;if(!st.on){if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){st=null;return;}if(dx>10&&Math.abs(dx)>Math.abs(dy)){st.on=true;st.c.classList.add('swiping');}}
    if(st&&st.on){st.dx=Math.max(0,dx);st.c.style.transform=`translateX(${st.dx}px)`;st.c.style.setProperty('--sw',Math.min(1,st.dx/90));}},{passive:true});
  const end=()=>{if(!st)return;const s=st;st=null;if(!s.on)return;s.c.classList.remove('swiping');S.pSwiped=Date.now();
    if(s.dx>90){const r=PIPE.rows.find(x=>x.id===s.id);const i=r?PIPE_STAGES.findIndex(t=>t.id===r.stage):-1;const nx=PIPE_STAGES[i+1];if(nx){s.c.style.transition='transform .22s ease-in,opacity .22s';s.c.style.transform='translateX(110%)';s.c.style.opacity='0';setTimeout(()=>pMove(r.id,nx.id),200);return;}}
    s.c.style.transition='transform .25s cubic-bezier(.3,1.4,.5,1)';s.c.style.transform='';setTimeout(()=>{s.c.style.transition='';},260);};
  document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
  // a swipe shouldn't also count as a tap that opens the card
  document.addEventListener('click',e=>{if(S.pSwiped&&Date.now()-S.pSwiped<350&&e.target.closest('.pCard')){e.stopPropagation();e.preventDefault();}},true);})();

/* ---------- after each render: place the pill, re-apply search ---------- */
{const _dv=decorateView;decorateView=function(){_dv.apply(this,arguments);try{if(S.screen==='pipeline'){document.querySelectorAll('.pillNav').forEach(pillPlace);pApplySearch();const on=$('.pStage.on');if(on&&on.scrollIntoView&&!S.pStripKept){on.scrollIntoView({block:'nearest',inline:'center'});}}}catch(e){console.warn(e);}};}

/* ---------- way in: a banner at the top of More ---------- */
{const _mP=SCREENS.more;SCREENS.more=function(){pipeStart();const h=_mP.apply(this,arguments);const act=PIPE.rows.filter(r=>PIPE_STAGES.some(s=>s.id===r.stage)&&r.stage!=='client').length;const chk=PIPE.rows.filter(r=>r.review).length;const due=PIPE.ready?pDueN():0;
  const ban=`<a class="card pBanner" href="#pipeline"><span class="pBanIco"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h4v14H3zm7 0h4v9h-4zm7 0h4v5h-4z"/></svg></span><span class="grow"><b>Pipeline</b><small>${PIPE.ready?`${act} active prospects${due?` · ${due} due`:''}${chk?` · ${chk} to check`:''}`:'Your prospects, clients and follow-ups'}</small></span><span class="chev">›</span></a>`;
  return h.replace('<div class="pad">','<div class="pad">'+ban);};}
HELP.push(['Pipeline','More, then Pipeline, is your client pipeline: every prospect from first video to signed client, shared between you both and saved straight away. Tap + New and paste a website or Instagram link to add someone. Swipe a card right (or tap ›) to move it to the next stage, or tap it to edit everything: contact, products, links to the Loom video and quote, money, dates and notes. Each card keeps a history of who changed what. Not now asks when to bring them back.']);
