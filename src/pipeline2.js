/* ============================== 22 Nov: the client pipeline (part 2) ==============================
   Overview, Schedule and Growth tabs, a daily reminder, the Harbour button, and stage moves that count in the game.
   Moving a card to Video made, Talking, Meeting or Client offers a one-tap "Count it" in the toast, so nothing is
   logged twice by accident. Caps, cooldowns and the crew check still apply, because it goes through the normal buttons. */
const P_GAME={video_made:'v',talking:'r',meeting:'m',client:'c'};
const P_IDX=Object.fromEntries(PIPE_STAGES.map((s,i)=>[s.id,i]));
const pNth=n=>n+(n%100>=11&&n%100<=13?'th':['th','st','nd','rd'][n%10]||'th');
const pAgo=at=>{const m=Math.max(0,Math.round((Date.now()-Date.parse(at))/60000));return m<1?'just now':m<60?`${m} min ago`:m<1440?`${Math.round(m/60)} h ago`:m<2880?'yesterday':`${Math.round(m/1440)} days ago`;};
const pRnd=a=>a[Math.floor(Math.random()*a.length)];
function pOwnSeg(){const ow=S.view.powner||'all';return `<div class="seg mini pOwn">${[['all','Everyone'],['sam',pnameRaw('sam')],['james',pnameRaw('james')]].map(([k,n])=>`<button class="${ow===k?'on':''}" data-act="pOwner" data-o="${k}">${esc(n)}</button>`).join('')}</div>`;}
// how far a prospect has ever got (exits keep the credit for what happened before they left)
function pReach(r){let i=r.stage in P_IDX?P_IDX[r.stage]:(r.follow_ups?P_IDX.followed_up:P_IDX.messaged);if(r.meeting_held)i=Math.max(i,P_IDX.meeting);if(r.quote_url)i=Math.max(i,P_IDX.quote_sent);if(r.stage==='video_needed'||r.stage==='video_made')i=P_IDX[r.stage];if(r.stage==='archived'&&!r.last_contact&&!r.follow_ups)i=P_IDX.video_needed;return i;}

/* ---------- everyone's recent activity (for Overview and Growth) ---------- */
function pEvStart(){if(PIPE.allEv||PIPE.evLoading)return;PIPE.evLoading=true;
  if(PIPE.src==='supa'){S.sb.from('hl_prospect_events').select('prospect_id,by,kind,detail,at').neq('kind','import').gte('at',new Date(Date.now()-70*864e5).toISOString()).order('at',{ascending:false}).limit(2000)
      .then(({data})=>{PIPE.allEv=data||[];PIPE.evLoading=false;pipeRefresh();},()=>{PIPE.allEv=[];PIPE.evLoading=false;});
    try{S.sb.channel('hl-pipe-ev').on('postgres_changes',{event:'INSERT',schema:'public',table:'hl_prospect_events'},p=>{const e=p.new;if(!e||e.by===S.me||!PIPE.allEv)return;PIPE.allEv.unshift(e);(PIPE.ev[e.prospect_id]||[]).unshift(e);pipeRefresh();}).subscribe();}catch(e){}}
  else{const a=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('hl_pipe_ev_'))a.push(...JSON.parse(localStorage.getItem(k)||'[]'));}}catch(e){}
    a.sort((x,y)=>x.at<y.at?1:-1);PIPE.allEv=a;PIPE.evLoading=false;}}
function pActText(e){const r=PIPE.rows.find(x=>x.id===e.prospect_id);const b=`<b>${esc(r?r.business:'a prospect')}</b>`;const d=e.detail||{};const sn=id=>esc((PIPE_BY[id]||{}).name||id||'');
  if(e.kind==='stage')return d.undo?`moved ${b} back to ${sn(d.to)}`:`moved ${b} to ${sn(d.to)}`;if(e.kind==='created')return `added ${b}`;if(e.kind==='followup')return `followed up with ${b}`;if(e.kind==='held')return `had the meeting with ${b}`;
  if(e.kind==='snooze')return `pushed ${b} back to ${pShortD(d.to)}`;if(e.kind==='game')return `counted ${b} in the game`;if(e.kind==='checked')return `checked ${b}`;if(e.kind==='touch')return `caught up with ${b}`;return `edited ${b}`;}
{const _pe=pEvText;pEvText=function(e){const d=e.detail||{};if(e.kind==='followup')return `logged a follow-up (${pNth(d.n||1)})`;if(e.kind==='held')return 'marked the meeting as held';if(e.kind==='snooze')return `pushed it back to ${pShortD(d.to)}`;if(e.kind==='game')return `counted it in the game (${(KINDS[d.k]||{}).name||d.k})`;if(e.kind==='touch')return 'caught up with them';return _pe.apply(this,arguments);};}

/* ---------- what's due, and the one-tap "done" for each kind ---------- */
function pSchedItems(rows){return (rows||PIPE.rows).map(r=>{const d=pDue(r);if(!d)return null;let what,done;
    if(r.stage==='video_needed'){what=d.cls==='over'||d.cls==='stale'?'Video waiting over a week':'Make their video';done='Made it';}
    else if(r.stage==='not_now'){what='Bring them back';done='Message';}
    else if(r.stage==='meeting'){if(r.meeting_at&&!r.meeting_held){what=d.cls==='later'||d.cls==='today'?'Meeting':'Meeting: did it happen?';done='Held';}else{what='Follow up after the meeting';done='Done';}}
    else if(r.stage==='messaged'){what='1st follow-up';done='Followed up';}
    else if(r.stage==='followed_up'){what=`${pNth((r.follow_ups||1)+1)} follow-up`;done='Followed up';}
    else if(r.stage==='talking'){what='Keep the chat warm';done='Caught up';}
    else if(r.stage==='quote_sent'){what='Chase the quote';done='Chased';}
    else{what='Follow up';done='Done';}
    return {r,d:d.d,cls:d.cls,what,done};}).filter(Boolean).sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:(b.r.priority?1:0)-(a.r.priority?1:0));}
function pSchedRow(x,opts){const r=x.r;const st=PIPE_BY[r.stage]||PIPE_STAGES[0];const dd=new Date(x.d+'T12:00:00Z');
  return `<div class="pSched ${x.cls}" style="--sc:${st.col}"><span class="pDay"><b>${dd.getUTCDate()}</b><small>${dd.toLocaleDateString('en-GB',{month:'short',timeZone:'UTC'})}</small></span>
    <div class="grow" data-act="pOpen" data-id="${r.id}"><b>${esc(r.business||'Unnamed')}</b><small>${esc(x.what)} · ${esc(st.name)}${r.contact?' · '+esc(r.contact):''}</small></div>
    <div class="pSchBtns">${x.cls==='stale'?`<button class="btn sm ghost" data-act="pQuiet" data-id="${r.id}" title="Move to No response">Let go</button>`:''}<button class="btn sm primary" data-act="pDone" data-id="${r.id}">${esc(x.done)}</button>${r.stage==='meeting'&&r.meeting_at&&!r.meeting_held?'':`<button class="btn sm ghost pSnz" data-act="pSnooze" data-id="${r.id}" data-n="3" title="Push back 3 days" aria-label="Push back 3 days">+3d</button>`}</div></div>`;}
ACT.pDone=async(d,el)=>{const r=PIPE.rows.find(x=>x.id===d.id);if(!r)return;const t=G.today;const row=el&&el.closest('.pSched');if(row)row.classList.add('ticked');
  const later=fn=>setTimeout(fn,row&&!matchMedia('(prefers-reduced-motion: reduce)').matches?320:0);
  later(async()=>{
    if(r.stage==='video_needed')return pMove(r.id,'video_made');
    if(r.stage==='not_now')return pMove(r.id,'messaged');
    if(r.stage==='messaged')return pMove(r.id,'followed_up');
    let patch,kind,det,msg;
    if(r.stage==='followed_up'){const n=(r.follow_ups||1)+1;patch={follow_ups:n,last_contact:t,next_due:addDays(t,5)};kind='followup';det={n};msg=`${pNth(n)} follow-up logged. Next nudge ${pShortD(addDays(t,5))}.`;}
    else if(r.stage==='meeting'&&r.meeting_at&&!r.meeting_held){patch={meeting_held:true,last_contact:t,next_due:addDays(t,2)};kind='held';msg=`Meeting marked as held. A follow-up is due ${pShortD(addDays(t,2))}.`;}
    else{const g=P_GAP[r.stage]||5;patch={last_contact:t,next_due:addDays(t,g)};kind='touch';msg=`Done. Next one ${pShortD(addDays(t,g))}.`;}
    const prev=await pipePatch(r.id,patch,kind,det);if(prev===false)return;PIPE.undoP={id:r.id,prev};try{SND.pop&&SND.pop();}catch(e){}
    toast(`<b>${esc(r.business)}</b>: ${msg} <button class="tLink" data-act="pUndoP">Undo</button>`,'',5000);});};
ACT.pSnooze=async d=>{const r=PIPE.rows.find(x=>x.id===d.id);if(!r)return;const to=addDays(G.today,+d.n||3);const patch=r.stage==='not_now'?{return_on:to}:{next_due:to};
  const prev=await pipePatch(r.id,patch,'snooze',{to});if(prev===false)return;PIPE.undoP={id:r.id,prev};toast(`<b>${esc(r.business)}</b> pushed back to ${pShortD(to)}. <button class="tLink" data-act="pUndoP">Undo</button>`,'',4500);};
ACT.pQuiet=d=>pMove(d.id,'no_response');
ACT.pUndoP=async()=>{const u=PIPE.undoP;if(!u)return;PIPE.undoP=null;await pipePatch(u.id,u.prev,'edit',{fields:['undo']});};
ACT.pGoStage=d=>{S.view.ptab='board';S.view.pstage=d.s;S.view.pq='';render();};
ACT.pGoSched=()=>{document.querySelectorAll('.toast').forEach(t=>{if(t.querySelector('[data-act=pGoSched]'))t.remove();});S.view.ptab='schedule';if(location.hash!=='#pipeline')location.hash='#pipeline';else render();};
ACT.pSchDay=d=>{const g=document.getElementById('psd-'+d.d)||document.getElementById('psg-'+d.g);if(g)g.scrollIntoView({block:'start',behavior:'smooth'});};

/* ---------- Overview ---------- */
function pOverviewHtml(){pEvStart();const rows=pFilter(PIPE.rows);const act=rows.filter(r=>r.stage in P_IDX&&r.stage!=='client');const cl=rows.filter(r=>r.stage==='client');
  const items=pSchedItems(rows);const now=items.filter(x=>x.cls==='over'||x.cls==='today');const val=act.reduce((a,r)=>a+(pVal(r)||0),0);
  const reached=rows.filter(r=>pReach(r)>=P_IDX.messaged).length;const win=reached?Math.round(cl.length/reached*100):0;
  const counts=PIPE_STAGES.map(s=>rows.filter(r=>r.stage===s.id).length);const mx=Math.max(1,...counts);
  const prod={};act.forEach(r=>(r.products||[]).forEach(p=>prod[p]=(prod[p]||0)+1));const pr=Object.entries(prod).sort((a,b)=>b[1]-a[1]);const pmx=Math.max(1,...pr.map(x=>x[1]));
  const ev=(PIPE.allEv||[]).filter(e=>(S.view.powner||'all')==='all'||e.by===S.view.powner).slice(0,8);
  return `<div class="pTools pOvTools"><span class="grow tiny muted">${rows.length} prospects${(S.view.powner||'all')!=='all'?` owned by ${esc(pnameRaw(S.view.powner))}`:''}</span>${pOwnSeg()}</div>
   <div class="pKpis">
     <button class="pKpi" data-act="pTab" data-t="board"><b class="num">${act.length}</b><small>active</small></button>
     <button class="pKpi ${now.length?'hot':''}" data-act="pTab" data-t="schedule"><b class="num">${now.length}</b><small>due now</small></button>
     ${val?`<button class="pKpi" data-act="pTab" data-t="board"><b class="num">${pMoney(val)}</b><small>quoted, open</small></button>`:`<button class="pKpi" data-act="pTab" data-t="clients"><b class="num">${pMoney(cl.filter(r=>r.deal_period==='monthly').reduce((a,r)=>a+(+r.deal_value||0),0))}</b><small>a month</small></button>`}
     <button class="pKpi" data-act="pTab" data-t="growth"><b class="num">${win}%</b><small>win rate</small></button></div>
   <div class="card pOvCard"><div class="row between"><h3>Today's jobs</h3>${now.length>4?`<button class="btn sm ghost" data-act="pTab" data-t="schedule">All ${now.length} ›</button>`:''}</div>
     ${now.length?`<div class="pSchList">${now.slice(0,4).map(x=>pSchedRow(x)).join('')}</div>`:`<p class="pNone">${pRnd(['Nothing due. Gary is suspicious.','All caught up. Treat yourself to a biscuit.','Clear decks, captain. Go and find new prospects.'])}</p>`}</div>
   <div class="card pOvCard"><h3>The pipeline</h3><p class="tiny muted" style="margin:2px 0 8px">Tap a stage to open it on the Board.</p>
     <div class="pFunnel">${PIPE_STAGES.map((s,i)=>`<button class="pFRow" data-act="pGoStage" data-s="${s.id}" style="--sc:${s.col};--w:${Math.max(counts[i]?4:0,counts[i]/mx*100)}%;--d:${i*40}ms"><span class="pFName">${esc(s.name)}</span><span class="pFBar"><i></i></span><b class="num">${counts[i]}</b></button>`).join('')}</div></div>
   ${pr.length?`<div class="card pOvCard"><h3>What they want</h3><div class="pFunnel">${pr.map(([p,n],i)=>`<div class="pFRow still" style="--sc:#3E8DDB;--w:${n/pmx*100}%;--d:${i*40}ms"><span class="pFName">${esc(p==='Social Media Management'?'Social media':p)}</span><span class="pFBar"><i></i></span><b class="num">${n}</b></div>`).join('')}</div></div>`:''}
   <div class="card pOvCard"><h3>Recent moves</h3>${!PIPE.allEv?'<p class="pNone">Loading…</p>':ev.length?`<div class="pAct">${ev.map(e=>`<div class="pActRow"><img alt="" src="${pAvatar(e.by)}"><span class="grow">${esc(pnameRaw(e.by))} ${pActText(e)}</span><small>${pAgo(e.at)}</small></div>`).join('')}</div>`:'<p class="pNone">No moves yet. The first swipe is the hardest.</p>'}</div>`;}

/* ---------- Schedule ---------- */
function pScheduleHtml(){const t=G.today;const items=pSchedItems(pFilter(PIPE.rows));const wk=[...Array(7)].map((_,i)=>addDays(t,i));
  const grp=[['over','Overdue',x=>x.cls==='over'],['today','Today',x=>x.cls==='today'],['tom','Tomorrow',x=>x.d===addDays(t,1)],['week','This week',x=>x.d>addDays(t,1)&&x.d<=addDays(t,6)],['later','Later',x=>x.d>addDays(t,6)]];
  const stale=items.filter(x=>x.cls==='stale');const cnt=d=>items.filter(x=>x.d===d).length;const ovN=items.filter(x=>x.cls==='over').length;
  const strip=`<div class="pWeek">${wk.map((d,i)=>{const n=cnt(d)+(i===0?ovN:0);const dd=new Date(d+'T12:00:00Z');return `<button class="pWDay ${i===0?'today':''} ${n?'has':''}" data-act="pSchDay" data-d="${d}" data-g="${i===0?(ovN?'over':'today'):i===1?'tom':'week'}"><small>${i===0?'Today':DAYN[dd.getUTCDay()]}</small><b>${dd.getUTCDate()}</b><i>${n?n:''}</i></button>`;}).join('')}</div>`;
  let used=new Set();const out=grp.map(([k,n,f])=>{const xs=items.filter(x=>!used.has(x)&&x.cls!=='stale'&&f(x));xs.forEach(x=>used.add(x));if(!xs.length)return '';const shown=k==='later'?xs.slice(0,25):xs;
    return `<section class="pSGroup ${k}" id="psg-${k}"><h4>${n} <span>${xs.length}</span></h4><div class="pSchList">${shown.map(x=>`<div id="psd-${x.d}" class="pSAnchor"></div>`+pSchedRow(x)).join('').replace(/<div id="psd-([\d-]+)" class="pSAnchor"><\/div>/g,(m,d,o,str)=>str.indexOf(`psd-${d}"`)<o?'':m)}${k==='later'&&xs.length>25?`<p class="pHint">${xs.length-25} more after these.</p>`:''}</div></section>`;}).join('');
  return `<div class="pTools"><span class="grow tiny muted">Follow-ups, meetings and comebacks, soonest first.</span>${pOwnSeg()}</div>${strip}
   ${out||`<div class="card"><p class="pNone">${pRnd(['Nothing scheduled. The calendar is so empty it echoes.','No follow-ups due. Either you are brilliant or something is wrong. We choose brilliant.'])}</p></div>`}
   ${stale.length?`<details class="card pStale"><summary><b>Gone quiet</b> <span class="tiny muted">${stale.length} with no contact for over a month</span></summary><p class="tiny muted" style="margin:6px 0 8px">Give them one last nudge, push them back, or let them go to No response. No hard feelings. Some hard feelings.</p><div class="pSchList">${stale.map(x=>pSchedRow(x)).join('')}</div></details>`:''}`;}

/* ---------- Growth ---------- */
const pGoal=()=>{try{return +localStorage.getItem('hl_pipe_goal')||2000;}catch(e){return 2000;}};
ACT.pGoal=()=>{openModal(`<h2>Monthly retainer goal</h2><p class="muted" style="margin:2px 0 10px">What you want coming in each month from retainers. Only saved on this device.</p><label class="f">Goal (£ a month)<input id="pGoalIn" type="number" min="100" step="50" value="${pGoal()}"></label><div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px"><button class="btn ghost" data-act="wnClose">Cancel</button><button class="btn primary" data-act="pGoalGo">Save</button></div>`);setTimeout(()=>{const i=$('#pGoalIn');i&&i.select();},40);};
ACT.pGoalGo=()=>{const v=Math.max(100,Math.round(+(($('#pGoalIn')||{}).value)||0));try{localStorage.setItem('hl_pipe_goal',String(v));}catch(e){}closeModal();render();};
function pGrowthHtml(){pEvStart();const rows=pFilter(PIPE.rows);const t=G.today;const cl=rows.filter(r=>r.stage==='client');const mon=cl.filter(r=>r.deal_period==='monthly');
  const mrr=mon.reduce((a,r)=>a+(+r.deal_value||0),0);const goal=pGoal();const avg=mon.length?mrr/mon.length:275;const left=Math.max(0,goal-mrr);const pct=Math.min(100,Math.round(mrr/goal*100));
  // how far prospects get
  const reach=PIPE_STAGES.map((s,i)=>rows.filter(r=>pReach(r)>=i).length);const rmx=Math.max(1,reach[0]);
  // the last 8 weeks of moves, by captain
  const ws0=weekStart(t);const weeks=[...Array(8)].map((_,i)=>addDays(ws0,-7*(7-i)));const ev=(PIPE.allEv||[]).filter(e=>e.kind!=='checked'&&e.kind!=='edit'&&e.kind!=='import');
  const wk=weeks.map(w=>{const e=addDays(w,7);const o={w,sam:0,james:0};ev.forEach(x=>{const d=L(Date.parse(x.at)).date;if(d>=w&&d<e&&(x.by==='sam'||x.by==='james'))o[x.by]++;});return o;});const wmx=Math.max(1,...wk.map(o=>o.sam+o.james));
  // clients won by month
  const months=[...Array(6)].map((_,i)=>{const d=new Date(t+'T12:00:00Z');d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()-(5-i));return d.toISOString().slice(0,7);});
  const won=months.map(m=>cl.filter(r=>(r.won_at||'').slice(0,7)===m).length);const before=cl.filter(r=>!r.won_at||r.won_at.slice(0,7)<months[0]).length;const cmx=Math.max(1,before,...won);
  return `<div class="pTools"><span class="grow tiny muted">How the pipeline is growing.</span>${pOwnSeg()}</div>
   <div class="card pGoalCard"><div class="row between"><h3>Retainer goal</h3><button class="btn sm ghost" data-act="pGoal">Change</button></div>
     <div class="pGoalNums"><b class="num">${pMoney(mrr)}</b><small>of ${pMoney(goal)} a month</small></div>
     <div class="pGoalBar" style="--p:${pct}%"><i></i><span>${pct}%</span></div>
     <p class="tiny muted" style="margin:8px 0 0">${left?`${pMoney(left)} to go. That's about ${Math.ceil(left/avg)} more retainer${Math.ceil(left/avg)===1?'':'s'} at your average of ${pMoney(avg)}.`:'Goal smashed. Time to raise it, you magnificent sea dogs.'}</p></div>
   <div class="card pOvCard"><h3>How far prospects get</h3><p class="tiny muted" style="margin:2px 0 8px">Everyone who has ever reached each stage, and how many make the next step.</p>
     <div class="pReach">${PIPE_STAGES.map((s,i)=>`${i?`<div class="pConv">${reach[i-1]?Math.round(reach[i]/reach[i-1]*100):0}% go on</div>`:''}<div class="pFRow still" style="--sc:${s.col};--w:${Math.max(reach[i]?3:0,reach[i]/rmx*100)}%;--d:${i*45}ms"><span class="pFName">${esc(s.name)}</span><span class="pFBar"><i></i></span><b class="num">${reach[i]}</b></div>`).join('')}</div></div>
   <div class="card pOvCard"><div class="row between"><h3>Moves per week</h3><span class="pLegend"><i style="--c:${pcol('sam')}"></i>${esc(pnameRaw('sam'))} <i style="--c:${pcol('james')}"></i>${esc(pnameRaw('james'))}</span></div>
     ${!PIPE.allEv?'<p class="pNone">Loading…</p>':`<div class="pCols">${wk.map((o,i)=>`<div class="pColW" style="--d:${i*40}ms"><div class="pColStack" title="${o.sam+o.james} moves"><i style="--h:${o.james/wmx*100}%;--c:${pcol('james')}"></i><i style="--h:${o.sam/wmx*100}%;--c:${pcol('sam')}"></i></div><b class="num">${o.sam+o.james||''}</b><small>${pShortD(o.w).replace(' ',' ')}</small></div>`).join('')}</div><p class="tiny muted" style="margin:6px 0 0">Adds, stage moves, follow-ups and meetings. Counting started with the pipeline, so the early weeks are empty.</p>`}</div>
   <div class="card pOvCard"><h3>Clients won</h3><div class="pCols">${[['Before',before],...months.map((m,i)=>[new Date(m+'-15T12:00:00Z').toLocaleDateString('en-GB',{month:'short',timeZone:'UTC'}),won[i]])].map(([n,v],i)=>`<div class="pColW" style="--d:${i*40}ms"><div class="pColStack"><i style="--h:${v/cmx*100}%;--c:${PIPE_BY.client.col}"></i></div><b class="num">${v||''}</b><small>${n}</small></div>`).join('')}</div></div>`;}

/* ---------- moves that count in the game ---------- */
ACT.pGame=d=>{const r=PIPE.rows.find(x=>x.id===d.id);if(!r)return;const k=d.k;document.querySelectorAll('.toast').forEach(t=>{if(t.querySelector('[data-act=pGame]'))t.remove();});
  const who=(r.insta?'@'+r.insta:r.business||'').slice(0,60);
  if(k==='m'||k==='c'){S.pGame={k,id:r.id};openMCSheet(k);setTimeout(()=>{const i=$('#prIn');if(i&&!i.value){i.value=who;i.dispatchEvent(new Event('input',{bubbles:true}));}},90);return;}
  const t0=Date.now();const btn=document.querySelector(`.act[data-k="${k}"]`)||document.createElement('button');logAction(k,btn);
  if(Object.values(S.pending||{}).some(x=>x.k===k&&x.pid===S.me&&x.t>=t0))pGameMark(r,k);};
function pGameMark(r,k){pipePatch(r.id,{tags:[...(r.tags||[]).filter(x=>x!=='game:'+k),'game:'+k]},'game',{k});}
{const _smc=submitMC;submitMC=async function(k,pr){const g=S.pGame;S.pGame=null;const t0=Date.now();const out=await _smc.apply(this,arguments);
  try{if(g&&g.k===k){const ok=Object.values(S.pending||{}).some(x=>x.k===k&&x.pid===S.me&&x.t>=t0)||((G&&G.mc)||[]).some(e=>e.k===k&&e.pid===S.me&&e.t>=t0);const r=PIPE.rows.find(x=>x.id===g.id);if(ok&&r)pGameMark(r,k);}}catch(e){}return out;};}

/* ---------- the daily nudge, once a day on the Harbour ---------- */
const P_REM_QUIPS=['Gary has started pecking the calendar.','The follow-ups will not send themselves. We asked them nicely.','A prospect left on read is a prospect left at sea.','Fortune favours the captain who nudges.','Even the kraken replies eventually. Usually.','Barnaby says the ink is drying on these.'];
function pRemind(){try{if(!PIPE.ready||!S.me||!G||S.screen!=='harbour')return;const k='hl_pipe_rem_'+S.me;if(localStorage.getItem(k)===G.today)return;
  const it=pSchedItems(PIPE.rows).filter(x=>x.cls==='over'||x.cls==='today');if(!it.length)return;localStorage.setItem(k,G.today);const mine=it.filter(x=>x.r.owner===S.me).length;
  const meet=it.filter(x=>x.r.stage==='meeting'&&x.d===G.today).length;
  toast(`<b>${it.length} in the pipeline need${it.length===1?'s':''} you today</b>${mine&&mine<it.length?` (${mine} yours)`:''}${meet?`, including ${meet} meeting${meet===1?'':'s'}`:''}. ${pRnd(P_REM_QUIPS)} <button class="tLink" data-act="pGoSched">Open the schedule</button>`,'',9000);}catch(e){}}
{const _pr=pipeRefresh;pipeRefresh=function(){_pr.apply(this,arguments);if(S.screen==='harbour')setTimeout(pRemind,400);};}

/* ---------- the Harbour button ---------- */
{const _hP=SCREENS.harbour;SCREENS.harbour=function(){const h=_hP.apply(this,arguments);try{pipeStart();}catch(e){}const due=PIPE.ready?pDueN():0;const act=PIPE.rows.filter(r=>r.stage in P_IDX&&r.stage!=='client').length;
  const btn=`<a class="tvGo pGoBtn" href="#pipeline"><span class="appIco" style="background:#2C3E50"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h4v14H3zm7 0h4v9h-4zm7 0h4v5h-4z"/></svg></span><span class="grow"><b>Pipeline</b><small>${PIPE.ready?`${act} active${due?` · <b class="pGoDue">${due} due</b>`:' · all caught up'}`:'Prospects, follow-ups and clients'}</small></span>${due?`<span class="pGoBadge">${due}</span>`:''}<span class="tvGoArrow">›</span></a>`;
  const L='<a class="tvGo" href="#tavern">';return h.includes(L)?h.replace(L,btn+L):h.replace('<div class="pad">','<div class="pad">'+btn);};}

/* ---------- after each render ---------- */
{const _dv=decorateView;decorateView=function(){_dv.apply(this,arguments);try{if(S.screen==='harbour')setTimeout(pRemind,600);if(S.screen==='pipeline'){const on=$('#pTabs button.on');if(on&&on.scrollIntoView)on.scrollIntoView({block:'nearest',inline:'nearest'});}}catch(e){}};}
HELP.push(['Pipeline: Overview, Schedule, Growth','Overview shows today\'s jobs, how many prospects sit in each stage, what they want and the latest moves by either of you. Schedule lists every follow-up, meeting and comeback by date. Tap the main button when it\'s done (it logs the follow-up and sets the next one) or +3d to push it back. Prospects with no contact for over a month sit under Gone quiet. Growth tracks your retainer goal, how far prospects get, and moves and wins over time. Moving a card to Video made, Talking, Meeting or Client offers "Count it" in the message, which logs the matching Video, Response, Meeting or Client in the game, once per prospect. You get one reminder a day on the Harbour when anything is due.']);
