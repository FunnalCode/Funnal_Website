/* ============================== 23 Nov: calendar, payments, packages and settings for the pipeline ============================== */
const CRM_ACT={};
CRM.cal={m:null,sel:null,mode:(()=>{try{return localStorage.getItem('hl_cal_mode')||'month';}catch(e){return 'month';}})(),fu:true,dvKey:null};
CRM.sheet=null;
const cMonthName=ym=>new Date(ym+'-15T12:00:00Z').toLocaleDateString('en-GB',{month:'long',year:'numeric',timeZone:'UTC'});
const cDayName=d=>new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'});
const cDow=d=>(new Date(d+'T12:00:00Z').getUTCDay()+6)%7; // Monday = 0
const cYm=(ym,n)=>{const d=new Date(ym+'-15T12:00:00Z');d.setUTCMonth(d.getUTCMonth()+n);return d.toISOString().slice(0,7);};
const cAgo=t=>{if(!t)return 'not yet';const s=Math.round((Date.now()-t)/1000);return s<45?'just now':s<3600?Math.round(s/60)+' min ago':Math.round(s/3600)+' h ago';};
Object.assign(cIcon,{cal:'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 10h16M8 3v4M16 3v4',cog:'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  sync:'M20 11a8 8 0 0 0-14.8-4M4 4v4h4M4 13a8 8 0 0 0 14.8 4M20 20v-4h-4',pound:'M17 19H7c2-1.5 2.5-3.5 2.5-6V9a3.5 3.5 0 0 1 6.3-2.1M7 13h7',g:'M20.5 12.2c0-.6-.1-1.2-.2-1.8H12v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.6-3.9 2.6-6.5zM12 21c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H3.9v2.3A9 9 0 0 0 12 21zM6.9 13.7a5.4 5.4 0 0 1 0-3.4V8H3.9a9 9 0 0 0 0 8zM12 6.5c1.3 0 2.5.5 3.5 1.4l2.6-2.6A9 9 0 0 0 3.9 8l3 2.3C7.6 8.1 9.6 6.5 12 6.5z',link:'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',copy:'M9 9h10v10H9zM5 15V5h10',pin:'M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 7.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'});

/* ---------- what lands on a day ---------- */
function calItems(from,to,rows){const ow=CRM.calOwner||'all';const out=[];
  evLive().forEach(e=>{const d=evDay(e);if(d<from||d>to)return;if(ow!=='all'&&e.owner&&e.owner!==ow)return;const pr=e.prospect_id&&PIPE.rows.find(r=>r.id===e.prospect_id);
    const sdt=new Date(e.starts_at),edt=e.ends_at?new Date(e.ends_at):new Date(sdt.getTime()+3600e3);const sm=sdt.getHours()*60+sdt.getMinutes();let em=evDay({starts_at:edt.toISOString()})>d?1440:edt.getHours()*60+edt.getMinutes();if(em<=sm)em=Math.min(1440,sm+30);
    out.push({t:'ev',allDay:!!e.all_day,sm,em,endTime:e.all_day?'':edt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),d,id:e.id,sort:e.all_day?'00:00':evTime(e),time:evTime(e),title:e.title||'(No title)',sub:[pr&&pr.business,e.location].filter(Boolean).join(' · '),col:(EV_KIND[e.kind]||EV_KIND.other).c,kind:(EV_KIND[e.kind]||EV_KIND.other).n,g:!!e.gcal_id});});
  rows.filter(r=>r.stage==='client').forEach(r=>payDates(r,from,to).forEach(d=>{const paid=payPaid(r,d);out.push({t:'pay',d,id:r.id,sort:'00:01',time:'Payment',title:`${r.business}: ${pMoney(r.deal_value)}`,sub:paid?'Paid':d<G.today?'Late':P_PERIOD[r.deal_period],col:'#C7A1A1',kind:'Payment',paid:!!paid,late:!paid&&d<G.today});}));
  if(CRM.cal.fu)rows.forEach(r=>{const dd=pDueDate(r);if(!dd||dd<from||dd>to||r.stage==='meeting')return;if(dd<G.today)return;out.push({t:'fu',d:dd,id:r.id,sort:'00:02',time:'Follow up',title:r.business||'Unnamed',sub:(PIPE_BY[r.stage]||{}).name||'',col:CRM_STAGE_COL[r.stage]||'#6B6B6B',kind:'Follow-up'});});
  return out.sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:a.sort<b.sort?-1:1);}

function crmGBar(){const st=gcalState();
  if(st==='off')return `<button class="cGBar off" data-c="settings" data-t="google">${cSvg('g')}<span><b>Connect Google Calendar</b><small>Add the Client ID once and both of you sync the same calendar.</small></span>${cSvg('arrow')}</button>`;
  if(st==='idle')return `<div class="cGBar">${cSvg('g')}<span><b>Google Calendar</b><small>${GCAL.err?cEsc(GCAL.err):'Connect once to sync both ways, even when the game is closed.'}</small></span><button class="cPillBtn dark" data-c="gcalGo">Connect</button></div>`;
  const cal=(GCAL.cals||[]).find(c=>c.id===gcalCal());
  return `<div class="cGBar on ${GCAL.err?'err':''}">${cSvg('g')}<span><b>${GCAL.busy?'Syncing…':GCAL.err?'Sync problem':'Synced with Google'}</b><small>${GCAL.err?cEsc(GCAL.err):`${cEsc(cal?cal.name:'Your calendar')} · ${cAgo(GCAL.last)}`}</small></span><button class="cIconBtn sm ${GCAL.busy?'spin':''}" data-c="gcalSync" aria-label="Sync now" title="Sync now">${cSvg('sync')}</button></div>`;}

function crmCal(rows){const c=CRM.cal;if(!c.m)c.m=G.today.slice(0,7);if(!c.sel)c.sel=G.today;
  const first=c.m+'-01';const start=addDays(first,-cDow(first));const days=Array.from({length:42},(_,i)=>addDays(start,i));
  const items=calItems(days[0],days[41],rows);const by={};items.forEach(x=>(by[x.d]=by[x.d]||[]).push(x));
  const monthN=items.filter(x=>x.t==='ev'&&x.d.slice(0,7)===c.m).length;const sel=by[c.sel]||[];
  const owed=payOwed(rows).length;
  const head=`<div ${cIn(0,'cHello')}><div><h1>${c.mode==='day'?cEsc(cDayName(c.sel)):cEsc(cMonthName(c.m))}</h1><p>${c.mode==='day'?(()=>{const n=(by[c.sel]||[]).filter(x=>x.t==='ev').length;return `${n} event${n===1?'':'s'}${c.sel===G.today?' today':''}`;})():`${monthN} event${monthN===1?'':'s'} this month`}${owed?` · <em class="bad">${owed} payment${owed===1?'':'s'} to chase</em>`:''}</p></div>
    <div class="cCalTools">${crmWhoM()}<div class="cTabs cCalMode" data-pill="calMode"><button class="${c.mode==='day'?'on':''}" data-c="calMode" data-m="day">Day</button><button class="${c.mode==='month'?'on':''}" data-c="calMode" data-m="month">Month</button><button class="${c.mode==='agenda'?'on':''}" data-c="calMode" data-m="agenda">Agenda</button></div>
     <span class="cCalNav"><button class="cIconBtn" data-c="calMove" data-n="-1" aria-label="${c.mode==='day'?'Previous day':'Previous month'}">${cSvg('back')}</button><button class="cPillBtn" data-c="calToday">Today</button><button class="cIconBtn" data-c="calMove" data-n="1" aria-label="${c.mode==='day'?'Next day':'Next month'}">${cSvg('back','fwd')}</button></span>
     <button class="crmPrimary cEvNewBtn" data-c="evNew" data-d="${c.sel}">${cSvg('plus')}<span>New event</span></button></div></div>`;
  const chip=x=>`<span class="cChip t-${x.t} ${x.paid?'paid':''} ${x.late?'late':''}" style="--ec:${x.col}">${x.t==='ev'&&x.time!=='All day'?`<i>${cEsc(x.time)}</i>`:''}${cEsc(x.title)}</span>`;
  const grid=`<section ${cIn(1,'cPanel cMonth')}><div class="cWk">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>`<span>${d}</span>`).join('')}</div>
   <div class="cDays">${days.map((d,i)=>{const l=by[d]||[];const cls=[d.slice(0,7)!==c.m?'out':'',d===G.today?'today':'',d===c.sel?'sel':'',i%7>4?'wkend':''].join(' ');
     return `<button class="cDay ${cls}" data-c="calDay" data-d="${d}" style="--i:${i}"><b>${+d.slice(8)}</b><span class="cDayChips">${l.slice(0,3).map(chip).join('')}${l.length>3?`<span class="cMoreN">+${l.length-3} more</span>`:''}</span><span class="cDDots">${l.slice(0,4).map(x=>`<i style="--ec:${x.col}"></i>`).join('')}</span></button>`;}).join('')}</div></section>`;
  const row=x=>{const act=x.t==='pay'?`<button class="cPillBtn ${x.paid?'':'dark'}" data-c="payToggle" data-id="${x.id}" data-d="${x.d}">${x.paid?'Paid':'Mark paid'}</button>`:'';
    return `<div class="cAgItem t-${x.t} ${x.paid?'paid':''} ${x.late?'late':''}" data-c="${x.t==='ev'?'evOpen':'open'}" data-id="${x.id}" tabindex="0" style="--ec:${x.col}"><span class="cAgT">${cEsc(x.time)}</span><span class="cAgBar"></span><span class="cAgM"><b>${cEsc(x.title)}</b><small>${cEsc([x.kind,x.sub].filter(Boolean).join(' · '))}${x.g?' · <span class="cGTag">Google</span>':''}</small></span>${act}</div>`;};
  const dayPanel=`<section ${cIn(2,'cPanel cDayPanel')}><header class="cPanelH"><div><h3>${cEsc(cDayName(c.sel))}</h3><p>${sel.length?`${sel.length} thing${sel.length===1?'':'s'}`:'Nothing booked'}</p></div><span class="cDPBtns"><button class="cPillBtn" data-c="calMode" data-m="day">By hour</button><button class="cIconBtn sm" data-c="evNew" data-d="${c.sel}" aria-label="Add an event on this day">${cSvg('plus')}</button></span></header>
    <div class="cAgList">${sel.length?sel.map(row).join(''):`<div class="crmEmpty sm"><span class="cEmptyIc">${cSvg('cal')}</span><b>A clear day.</b><button class="crmGhost" data-c="evNew" data-d="${c.sel}">${cSvg('plus')}Add an event</button></div>`}</div>
    <label class="cFuTog"><input type="checkbox" data-c="calFu" ${c.fu?'checked':''}><span class="cTog"></span><span>Show follow-ups on the calendar</span></label></section>`;
  if(c.mode==='day')return `<div class="cPage">${head}${crmGBar()}${crmCalDay(rows,by[c.sel]||[],row)}</div>`;
  if(c.mode==='agenda'){const ag=calItems(G.today,addDays(G.today,60),rows);const g={};ag.forEach(x=>(g[x.d]=g[x.d]||[]).push(x));
    return `<div class="cPage">${head}${crmGBar()}<section ${cIn(1,'cPanel cAgenda')}>${Object.keys(g).length?Object.keys(g).map((d,i)=>`<div class="cAgDay" style="--i:${Math.min(i,12)}"><h4>${d===G.today?'Today':d===addDays(G.today,1)?'Tomorrow':cEsc(cDayName(d))}</h4><div class="cAgList">${g[d].map(row).join('')}</div></div>`).join(''):`<div class="crmEmpty"><span class="cEmptyIc">${cSvg('cal')}</span><b>Nothing in the next 60 days.</b><button class="crmGhost" data-c="evNew" data-d="${G.today}">${cSvg('plus')}Add an event</button></div>`}</section></div>`;}
  return `<div class="cPage">${head}${crmGBar()}<div class="cCalWrap">${grid}${dayPanel}</div></div>`;}

/* ---------- event sheet ---------- */
function crmEvHtml(){const s=CRM.sheet;const e=s.ev;const pr=PIPE.rows.slice().sort((a,b)=>(a.business||'').localeCompare(b.business||''));
  const d=evDay(e),st=e.all_day?'09:00':new Date(e.starts_at).toTimeString().slice(0,5),en=e.ends_at&&!e.all_day?new Date(e.ends_at).toTimeString().slice(0,5):addMinT(st,60);
  const g=gcalState()==='on'?'It will appear in Google Calendar too.':gcalState()==='idle'?'It goes to Google Calendar next time one of you connects.':'Connect Google in Settings to see it there too.';
  return `<div class="crmScrim add" data-c="sheetClose"></div><div class="crmAdd cSheet" role="dialog" aria-label="${e.id?'Edit event':'New event'}">
   <div class="crmAddHead"><span class="cEvIc" style="--ec:${(EV_KIND[e.kind]||EV_KIND.meeting).c}">${cSvg('cal')}</span><div><h3>${e.id?'Edit event':'New event'}</h3><p>${cEsc(g)}</p></div><button class="cIconBtn sm" data-c="sheetClose" aria-label="Close">${cSvg('x')}</button></div>
   <label class="crmAddIn">${cSvg('cal')}<input id="ce_title" placeholder="Call with Helen at Nest" value="${cEsc(e.title||'')}" autocomplete="off"></label>
   <div class="cSeg cEvKinds" role="group" aria-label="Type">${['meeting','call','task','other'].map(k=>`<button class="${e.kind===k?'on':''}" data-c="evKind" data-k="${k}" style="--ec:${EV_KIND[k].c}"><span class="crmDot" style="--sc:${EV_KIND[k].c}"></span>${EV_KIND[k].n}</button>`).join('')}</div>
   <div class="cGrid cEvGrid"><label class="cF"><span>Date</span><input id="ce_date" type="date" value="${d}"></label>
    <label class="cF cCheck"><input type="checkbox" id="ce_all" ${e.all_day?'checked':''}><span class="cTog"></span><span>All day</span></label>
    <label class="cF cTimeF"><span>Starts</span><input id="ce_start" type="time" value="${st}" ${e.all_day?'disabled':''}></label><label class="cF cTimeF"><span>Ends</span><input id="ce_end" type="time" value="${en}" ${e.all_day?'disabled':''}></label>
    <label class="cF wide"><span>Prospect or client</span><select id="ce_pr"><option value="">None</option>${pr.map(r=>`<option value="${r.id}" ${r.id===e.prospect_id?'selected':''}>${cEsc(r.business||'Unnamed')}</option>`).join('')}</select></label>
    <label class="cF"><span>Who</span><select id="ce_owner">${['sam','james'].map(p=>`<option value="${p}" ${p===(e.owner||S.me)?'selected':''}>${cEsc(cName(p))}</option>`).join('')}<option value="" ${e.owner===''?'selected':''}>Both</option></select></label>
    <label class="cF"><span>Where or link</span><input id="ce_loc" value="${cEsc(e.location||'')}" placeholder="Zoom, Meet or address"></label>
    <label class="cF wide"><span>Notes</span><textarea id="ce_notes" rows="3" placeholder="Agenda, what to bring">${cEsc(e.notes||'')}</textarea></label></div>
   <div class="crmAddFoot">${e.id?`<button class="crmGhost danger" data-c="evDel"><span>Delete</span></button><span class="grow"></span>`:''}<button class="crmGhost" data-c="sheetClose">Cancel</button><button class="crmPrimary" data-c="evSave">${e.id?'Save':'Add to calendar'}${cSvg('arrow')}</button></div></div>`;}
const addMinT=(t,m)=>{const [h,mi]=t.split(':').map(Number);const x=h*60+mi+m;return `${String(Math.floor(x/60)%24).padStart(2,'0')}:${String(x%60).padStart(2,'0')}`;};
function crmEvNew(o){const d=o.d||CRM.cal.sel||G.today;const t0=o.t||'10:00',t1=addMinT(t0,60);const pr=o.pid&&PIPE.rows.find(r=>r.id===o.pid);
  CRM.sheet={type:'event',key:'ev'+Date.now(),ev:{title:pr?`Meeting: ${pr.business}`:'',kind:'meeting',starts_at:localISO(d,t0),ends_at:localISO(d,t1),all_day:false,prospect_id:pr?pr.id:null,owner:pr?pr.owner:S.me,location:'',notes:''}};crmRender();}

/* ---------- settings: prices and Google ---------- */
function crmSettingsHtml(){const s=CRM.sheet;const t=s.tab||'prices';
  const groups=[['package','Packages'],['service','Services'],['addon','Add-ons']];
  const per=c=>`<select data-cat="${c.id}" data-k="period">${Object.entries({monthly:'Monthly',four_weekly:'Every 4 weeks',one_off:'One-off'}).map(([k,v])=>`<option value="${k}" ${c.period===k?'selected':''}>${v}</option>`).join('')}</select>`;
  /* 23 Nov: prices as a clean list; tap one to open it in its own box with room for the full description */
  const PER={monthly:'a month',four_weekly:'every 4 weeks',one_off:'one-off'};
  const ed=s.edit&&catBy(s.edit);
  const prices=ed?`<div class="cCatEd"><button class="cTxtLink cCatBack" data-c="catBack">${cSvg('back')}All prices</button>
     <label class="cF wide"><span>Name</span><input data-cat="${ed.id}" data-k="name" value="${cEsc(ed.name)}"></label>
     <div class="cCatEdRow"><label class="cF"><span>Price (£)</span><input data-cat="${ed.id}" data-k="price" type="number" inputmode="decimal" value="${ed.price==null?'':ed.price}" placeholder="Ask"></label>
       <label class="cF"><span>Billing</span>${per(ed)}</label></div>
     <label class="cF wide"><span>What's included</span><textarea data-cat="${ed.id}" data-k="note" rows="5" placeholder="A short description shown when you pick this package">${cEsc(ed.note||'')}</textarea></label>
     <div class="cCatEdFoot"><button class="crmGhost danger" data-c="catHide" data-id="${ed.id}">${cSvg('trash')}Remove</button><button class="crmPrimary" data-c="catBack">${cSvg('check')}Done</button></div></div>`
   :groups.map(([k,n])=>`<div class="cSetGroup"><h4>${n}</h4><div class="cCatList">${catItems(k).map(c=>`<button class="cCatItem" data-c="catEdit" data-id="${c.id}"><span class="cCatTxt"><b>${cEsc(c.name)}</b>${c.note?`<small>${cEsc(c.note)}</small>`:''}</span><span class="cCatPr"><b>${c.price==null?'Ask':pMoney(c.price)}</b><small>${PER[c.period]||''}</small></span>${cSvg('back','flip')}</button>`).join('')}</div><button class="cMore" data-c="catAdd" data-k="${k}">${cSvg('plus')} Add to ${n.toLowerCase()}</button></div>`).join('');
  const st=gcalState();const cal=gcalCal();
  const google=HLD&&HLD.googleHtml?HLD.googleHtml():typeof gsrvHtml==='function'&&GSRV.ok?gsrvHtml():`<div class="cSetGroup"><h4>Client ID</h4><p class="cSetP">From Google Cloud: <b>APIs &amp; Services → Credentials → OAuth client ID</b> (Web application) with <code>https://www.funnal.co.uk</code> and <code>https://funnal.co.uk</code> as authorised JavaScript origins. It is not a secret.</p>
     <div class="cCatRow one"><input id="cs_gid" value="${cEsc(gcalClient()||'')}" placeholder="1234-abc.apps.googleusercontent.com" autocomplete="off"><button class="crmPrimary" data-c="gcalSave">Save</button></div></div>
    <div class="cSetGroup"><h4>Your connection</h4>${st==='off'?'<p class="cSetP">Save a Client ID first.</p>':st==='idle'?`<p class="cSetP">${GCAL.err?cEsc(GCAL.err)+'. ':''}Each of you connects on your own device. Google asks once, then remembers.</p><button class="crmPrimary" data-c="gcalGo">${cSvg('g')}Connect Google Calendar</button>`:`<p class="cSetP">Connected as ${cEsc(gcalEmail()||cName(S.me))}. Last sync ${cAgo(GCAL.last)}.${GCAL.err?` <em class="bad">${cEsc(GCAL.err)}</em>`:''}</p><div class="cRowBtns"><button class="crmGhost" data-c="gcalSync">${cSvg('sync')}Sync now</button><button class="crmGhost danger" data-c="gcalOff"><span>Disconnect</span></button></div>`}</div>
    ${st==='on'?`<div class="cSetGroup"><h4>Calendar to sync</h4><p class="cSetP">Shared by both of you. A calendar called Funnal, shared with James, works best.</p><select id="cs_gcal" class="cSetSel">${(GCAL.cals||[]).map(c=>`<option value="${cEsc(c.id)}" ${c.id===cal?'selected':''}>${cEsc(c.name)}${c.primary?' (main)':''}</option>`).join('')}</select></div>`:''}`;
  return `<div class="crmScrim add" data-c="sheetClose"></div><div class="crmAdd cSheet wide" role="dialog" aria-label="Settings">
   <div class="crmAddHead"><span class="cEvIc">${cSvg('cog')}</span><div><h3>Settings</h3><p>Shared by ${cName('sam')} and ${cName('james')}. Changes save as you go.</p></div><button class="cIconBtn sm" data-c="sheetClose" aria-label="Close">${cSvg('x')}</button></div>
   <div class="cTabs" data-pill="setTabs"><button class="${t==='prices'?'on':''}" data-c="setTab" data-t="prices">Prices</button><button class="${t==='google'?'on':''}" data-c="setTab" data-t="google">Calendar</button><button class="${t==='team'?'on':''}" data-c="setTab" data-t="team">Photos</button><button class="${t==='sound'?'on':''}" data-c="setTab" data-t="sound">Sounds</button></div>
   <div class="cSetBody" data-scroll="settings">${t==='prices'?prices:t==='sound'?crmSoundHtml():t==='team'?crmTeamHtml():google}</div></div>`;}

/* ---------- details panel extras ---------- */
function crmDealHtml(r){const cat=catItems();const grp=k=>cat.filter(c=>c.kind===k);const pk=r.package&&catBy(r.package);
  const opts=[['package','Packages'],['service','Services'],['addon','Add-ons']].map(([k,n])=>`<optgroup label="${n}">${grp(k).map(c=>`<option value="${c.id}" ${r.package===c.id?'selected':''}>${cEsc(c.name)}${c.price!=null?` · ${pMoney(c.price)}${P_PERIOD_SHORT[c.period]}`:''}</option>`).join('')}</optgroup>`).join('');
  return `<label class="cF wide"><span>Package or service</span><select data-f="package"><option value="">Custom</option>${opts}</select>${pk&&pk.note?`<small class="cFNote">${cEsc(pk.note)}</small>`:''}</label>`;}
function crmBillHtml(r){const sel=v=>r.deal_period===v?'selected':'';
  const per=`<label class="cF"><span>Billing</span><select data-f="deal_period"><option value="" ${!r.deal_period?'selected':''}>Not set</option><option value="monthly" ${sel('monthly')}>Monthly</option><option value="four_weekly" ${sel('four_weekly')}>Every 4 weeks</option><option value="one_off" ${sel('one_off')}>One-off</option></select></label>`;
  if(r.stage!=='client')return per;
  const t=G.today;const past=payDates(r,addDays(t,-120),t).slice(-4);const next=payDates(r,addDays(t,1),addDays(t,120)).slice(0,2);
  const pill=(d)=>{const p=payPaid(r,d);const late=!p&&d<t;return `<button class="cPayChip ${p?'paid':late?'late':d<=t?'due':''}" data-c="payToggle" data-id="${r.id}" data-d="${d}" title="${p?'Paid. Tap to undo':'Tap when paid'}">${p?cSvg('check'):''}<b>${pShortD(d)}</b><small>${p?'Paid':late?'Late':d===t?'Due today':'Due'}</small></button>`;};
  const pm=pMonthly(r);
  return `${per}<label class="cF"><span>First payment</span><input data-f="billing_start" type="date" value="${r.billing_start||''}"></label><label class="cF"><span>Commitment ends</span><input data-f="commit_end" type="date" value="${r.commit_end||''}"></label>
   <div class="cF wide cPays"><span>Payments${r.deal_period==='four_weekly'&&pm?` <em>· about ${pMoney(pm)} a month</em>`:''}</span>${!r.billing_start||!r.deal_period?'<small class="cFNote">Set the billing and first payment date to track payments.</small>':`<div class="cPayRow">${past.map(pill).join('')}${next.map(pill).join('')}</div>`}</div>`;}
function crmMeetHtml(r){const ev=evLive().filter(e=>e.prospect_id===r.id).sort((a,b)=>a.starts_at<b.starts_at?-1:1);const up=ev.filter(e=>evDay(e)>=G.today),past=ev.filter(e=>evDay(e)<G.today).slice(-2);
  const it=e=>`<button class="cMeetIt ${evDay(e)<G.today?'past':''}" data-c="evOpen" data-id="${e.id}" style="--ec:${(EV_KIND[e.kind]||EV_KIND.other).c}"><span class="cMeetD"><b>${new Date(e.starts_at).getDate()}</b><small>${new Date(e.starts_at).toLocaleDateString('en-GB',{month:'short'})}</small></span><span><b>${cEsc(e.title)}</b><small>${cEsc(evTime(e))}${e.gcal_id?' · in Google':''}</small></span></button>`;
  return `<div class="cMeets">${[...past,...up].map(it).join('')}<button class="cMore" data-c="evNew" data-pid="${r.id}">${cSvg('plus')} Book a meeting or call</button></div>`;}

/* ---------- Today extras ---------- */
function crmPayPanel(rows,i){const owed=payOwed(rows),up=payUpcoming(rows,14);if(!owed.length&&!up.length)return '';
  const it=(x,late)=>`<div class="cPayIt ${late?'late':''}">${cBiz(x.r)}<div><b>${cEsc(x.r.business)}</b><small>${pMoney(x.amt)} · ${x.d===G.today?'due today':late?`due ${pShortD(x.d)}`:pShortD(x.d)}</small></div><button class="cPillBtn ${late||x.d<=G.today?'dark':''}" data-c="payToggle" data-id="${x.r.id}" data-d="${x.d}">${cSvg('check')}Paid</button></div>`;
  return `<section ${cIn(i,'cPanel cPayPanel')}><header class="cPanelH"><div><h3>Payments</h3><p>${owed.length?`${pMoney(owed.reduce((a,x)=>a+x.amt,0))} waiting to come in`:'All paid up'}</p></div>${owed.length?`<span class="cBadge">${owed.length}</span>`:''}</header>
   ${owed.map(x=>it(x,x.d<G.today)).join('')}${up.length?`<p class="cSubH">Next two weeks</p>${up.slice(0,4).map(x=>it(x,false)).join('')}`:''}</section>`;}
function crmDiaryPanel(rows,i){const t=G.today,t1=addDays(t,1);const l=calItems(t,t1,rows).filter(x=>x.t==='ev');if(!l.length)return '';
  return `<section ${cIn(i,'cPanel cDiary')}><header class="cPanelH"><div><h3>Diary</h3><p>Today and tomorrow</p></div><button class="cIconBtn sm" data-c="view" data-v="calendar" aria-label="Open the calendar">${cSvg('up')}</button></header>
   <div class="cAgList">${l.map(x=>`<div class="cAgItem t-ev" data-c="evOpen" data-id="${x.id}" tabindex="0" style="--ec:${x.col}"><span class="cAgT">${x.d===t?'':'Tmrw '}${cEsc(x.time)}</span><span class="cAgBar"></span><span class="cAgM"><b>${cEsc(x.title)}</b><small>${cEsc([x.kind,x.sub].filter(Boolean).join(' · '))}</small></span></div>`).join('')}</div></section>`;}

/* ---------- actions ---------- */
Object.assign(CRM_ACT,{
  calOwner:b=>{CRM.calOwner=b.dataset.o;crmRender();},
  calDay:b=>{CRM.cal.sel=b.dataset.d;if(b.dataset.d.slice(0,7)!==CRM.cal.m)CRM.cal.m=b.dataset.d.slice(0,7);crmRender();const p=document.querySelector('#crm .cDayPanel');if(p&&matchMedia('(max-width:899px)').matches)p.scrollIntoView({behavior:'smooth',block:'start'});},
  calMove:b=>{const c=CRM.cal;if(c.mode==='day'){c.sel=addDays(c.sel,+b.dataset.n);c.m=c.sel.slice(0,7);crmRender();const v=document.querySelector('#crm .cDayView');if(v){v.classList.remove('slideL','slideR');void v.offsetWidth;v.classList.add(+b.dataset.n>0?'slideL':'slideR');}return;}c.m=cYm(c.m,+b.dataset.n);CRM.anim=true;crmRender();},
  calToday:()=>{CRM.cal.m=G.today.slice(0,7);CRM.cal.sel=G.today;crmRender();},
  calMode:b=>{CRM.cal.mode=b.dataset.m;try{localStorage.setItem('hl_cal_mode',b.dataset.m);}catch(e){}CRM.anim=true;crmRender();const m=document.querySelector('#crm .crmMain');if(m)m.scrollTop=0;},
  evNewAt:b=>crmEvNew({d:b.dataset.d,t:b.dataset.t}),
  calFu:b=>{CRM.cal.fu=b.checked;crmRender();},
  evNew:b=>crmEvNew({d:b.dataset.d,pid:b.dataset.pid}),
  evOpen:b=>{const e=CDB.ev.find(x=>x.id===b.dataset.id);if(!e)return;CRM.sheet={type:'event',key:'ev'+e.id+Date.now(),ev:{...e}};crmRender();},
  evKind:b=>{CRM.sheet.ev.kind=b.dataset.k;b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));const ic=document.querySelector('#crm .cSheet .cEvIc');if(ic)ic.style.setProperty('--ec',EV_KIND[b.dataset.k].c);},
  evSave:async()=>{const v=id=>{const el=document.getElementById(id);return el?el.value:'';};const all=document.getElementById('ce_all').checked;const d=v('ce_date')||G.today;
    const title=v('ce_title').trim();if(!title){const w=document.querySelector('#crm .cSheet .crmAddIn');if(w){w.classList.remove('cShake');void w.offsetWidth;w.classList.add('cShake');}document.getElementById('ce_title').focus();return;}
    let s=v('ce_start')||'10:00',e=v('ce_end')||addMinT(s,60);if(e<=s)e=addMinT(s,60);const ev=CRM.sheet.ev;
    const o={...(ev.id?{id:ev.id}:{}),title,kind:ev.kind||'meeting',all_day:all,starts_at:all?localISO(d,'00:00'):localISO(d,s),ends_at:all?localISO(addDays(d,1),'00:00'):localISO(d,e),prospect_id:v('ce_pr')||null,owner:v('ce_owner'),location:v('ce_loc').trim()||null,notes:v('ce_notes').trim()||null};
    CRM.sheet=null;CRM.cal.sel=d;CRM.cal.m=d.slice(0,7);crmRender();await evSave(o);crmSaved&&crmSaved('Saved');toast(`<b>${cEsc(title)}</b> is in the calendar${gcalState()==='on'?' and going to Google':''}.`,'good');},
  evDel:async b=>{if(!b.dataset.sure){b.dataset.sure=1;b.classList.add('sure');b.querySelector('span').textContent='Tap again to delete';return;}const id=CRM.sheet.ev.id;CRM.sheet=null;crmRender();await evDelete(id);},
  sheetClose:()=>{const w=document.querySelector('#crm .cSheet');if(w&&!CRM_REDUCED()){w.classList.add('out');document.querySelector('#crm .crmSheetWrap .crmScrim')?.classList.add('out');setTimeout(()=>{CRM.sheet=null;crmRender();},180);}else{CRM.sheet=null;crmRender();}},
  settings:b=>{CRM.sheet={type:'settings',key:'set'+Date.now(),tab:b.dataset.t||'prices'};crmRender();},
  setTab:b=>{CRM.sheet.tab=b.dataset.t;CRM.sheet.edit=null;CRM.sheet.key='set'+Date.now();crmRender();},
  catHide:b=>{cdbUpdate('cat',b.dataset.id,{active:false,updated_by:S.me});CRM.sheet.edit=null;CRM.sheet.key='set'+Date.now();crmRender();},
  catEdit:b=>{CRM.sheet.edit=b.dataset.id;CRM.sheet.key='set'+Date.now();crmRender();try{CSND.open();}catch(e){}},
  catBack:b=>{const a=document.activeElement;if(a&&a.blur)a.blur();CRM.sheet.edit=null;CRM.sheet.key='set'+Date.now();crmRender();try{CSND.close();}catch(e){}},
  catAdd:async b=>{const k=b.dataset.k;const n=catItems(k).length;const nid='c_'+cdbUid().slice(0,8);CRM.sheet.edit=nid;await cdbInsert('cat',{id:nid,name:k==='package'?'New package':k==='addon'?'New add-on':'New service',kind:k,price:null,period:'monthly',sort:(k==='package'?0:k==='service'?10:80)+n+1,active:true,updated_by:S.me});CRM.sheet.key='set'+Date.now();crmRender();},
  gcalSave:async()=>{const v=(document.getElementById('cs_gid').value||'').trim();if(v&&!/\.apps\.googleusercontent\.com$/.test(v)){toast('<b>That doesn\'t look like a Client ID.</b> It ends in .apps.googleusercontent.com','joke');return;}await cfgSet('gcal_client',v||null);GCAL.tc=null;gcalPrepare();CRM.sheet.key='set'+Date.now();crmRender();toast('<b>Client ID saved.</b> Now connect Google Calendar.','good');},
  gcalGo:()=>gcalConnect(),
  gcalSync:()=>{gcalSync();},
  gcalOff:()=>{gcalDisconnect();CRM.sheet&&(CRM.sheet.key='set'+Date.now());crmRender();},
  payToggle:async b=>{const r=PIPE.rows.find(x=>x.id===b.dataset.id);if(!r)return;const d=b.dataset.d;if(payPaid(r,d)){await payUnmark(r,d);}else{b.classList.add('cPop');await payMark(r,d);toast(`<b>${cEsc(r.business)}</b> paid ${pMoney(r.deal_value)} for ${pShortD(d)}.`,'good');}},
});
// settings inputs save as you type
function crmSetBind(el){el.addEventListener('change',e=>{if(e.target.matches&&e.target.matches('[data-face]')){crmFaceFile(e.target);return;}const c=e.target.closest('[data-cat]');if(c){const k=c.dataset.k;let v=c.value;if(k==='price')v=v===''?null:+v;else v=v.trim()||null;if(k==='name'&&!v)return;cdbUpdate('cat',c.dataset.cat,{[k]:v,updated_by:S.me});return;}
    if(e.target.id==='cs_gcal'){cfgSet('gcal_cal',e.target.value);gcalSoon();return;}
    if(e.target.id==='ce_all'){['ce_start','ce_end'].forEach(i=>{const x=document.getElementById(i);if(x)x.disabled=e.target.checked;});}});}

/* ---------- the day, hour by hour ---------- */
function crmCalDay(rows,items,row){const c=CRM.cal,d=c.sel;const timed=items.filter(x=>x.t==='ev'&&!x.allDay).sort((a,b)=>a.sm-b.sm||b.em-a.em);const other=items.filter(x=>!(x.t==='ev'&&!x.allDay));
  const now=new Date(),nowM=now.getHours()*60+now.getMinutes(),isToday=d===G.today;
  let h0=7,h1=21;timed.forEach(x=>{h0=Math.min(h0,Math.floor(x.sm/60));h1=Math.max(h1,Math.ceil(x.em/60));});if(isToday){h0=Math.min(h0,Math.floor(nowM/60));h1=Math.max(h1,Math.ceil((nowM+1)/60));}h1=Math.min(24,h1);
  // side-by-side lanes for events that overlap
  const lanes=[];let group=[],gEnd=-1;const done=[];
  const flush=()=>{const n=Math.max(1,...group.map(x=>x.lane+1));group.forEach(x=>x.n=n);done.push(...group);group=[];lanes.length=0;};
  timed.forEach(x=>{if(x.sm>=gEnd&&group.length)flush();let l=lanes.findIndex(e=>e<=x.sm);if(l<0){l=lanes.length;lanes.push(0);}lanes[l]=x.em;x.lane=l;group.push(x);gEnd=Math.max(gEnd,x.em);});if(group.length)flush();
  const lab=h=>h===0?'12am':h<12?h+'am':h===12?'12pm':(h-12)+'pm';const hrs=[];for(let h=h0;h<h1;h++)hrs.push(h);
  const ev=done.map((x,i)=>{const top=(x.sm-h0*60)/60,ht=Math.max(.42,(x.em-x.sm)/60);const short=ht<.75;
    return `<button class="cDVEv ${short?'short':''} ${x.g?'g':''}" data-c="evOpen" data-id="${x.id}" style="--ec:${x.col};--t:${top};--h:${ht};--l:${x.lane};--n:${x.n};--i:${i}"><b>${cEsc(x.title)}</b><small>${cEsc(x.time)}–${cEsc(x.endTime)}${x.sub?' · '+cEsc(x.sub):''}</small></button>`;}).join('');
  if(c.dvKey!==d){c.dvKey=d;setTimeout(()=>{const v=document.querySelector('#crm [data-scroll=dayv]');if(!v)return;const hh=v.querySelector('.cDVRow')?v.querySelector('.cDVRow').offsetHeight:60;const target=isToday?nowM-90:(timed[0]?timed[0].sm-60:9*60);v.scrollTo({top:Math.max(0,(target-h0*60)/60*hh),behavior:CRM_REDUCED()?'auto':'smooth'});},60);}
  const side=`<section ${cIn(2,'cPanel cDayPanel')}><header class="cPanelH"><div><h3>All day and reminders</h3><p>${other.length?`${other.length} thing${other.length===1?'':'s'}`:'Nothing else on'}</p></div><button class="cIconBtn sm" data-c="evNew" data-d="${d}" aria-label="Add an event on this day">${cSvg('plus')}</button></header>
    <div class="cAgList">${other.length?other.map(row).join(''):`<p class="cSetP" style="margin:4px 0 0">Payments, follow-ups and all-day events for this day show here.</p>`}</div>
    <label class="cFuTog"><input type="checkbox" data-c="calFu" ${c.fu?'checked':''}><span class="cTog"></span><span>Show follow-ups on the calendar</span></label></section>`;
  return `<div class="cCalWrap"><section ${cIn(1,'cPanel cDayView')}><div class="cDV" data-scroll="dayv"><div class="cDVIn" style="--rows:${hrs.length}">
    ${hrs.map(h=>`<div class="cDVRow"><span class="cDVH">${lab(h)}</span><button class="cDVSlot" data-c="evNewAt" data-d="${d}" data-t="${String(h).padStart(2,'0')}:00" aria-label="New event at ${lab(h)}"></button><button class="cDVSlot half" data-c="evNewAt" data-d="${d}" data-t="${String(h).padStart(2,'0')}:30" aria-label="New event at ${lab(h)} 30"></button></div>`).join('')}
    <div class="cDVEvs" style="--h0:${h0}">${ev}</div>
    ${isToday&&nowM>=h0*60&&nowM<=h1*60?`<div class="cDVNow" style="--t:${(nowM-h0*60)/60}"><i></i><span>${now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</span></div>`:''}
    ${!timed.length?`<div class="cDVEmpty"><b>Nothing booked.</b><span>Tap any hour to add something.</span></div>`:''}
   </div></div></section>${side}</div>`;}

/* ---------- sounds ---------- */
function crmSoundHtml(){const on=S.sound!==false;const demo=[['tap','Tap'],['open','Open'],['move','Move a prospect'],['done','Save'],['paid','Payment in'],['notify','Quote opened'],['won','New client']];
  return `<div class="cSetGroup"><h4>Sounds</h4><p class="cSetP">Soft sounds when you move prospects, save, get paid or win a client. This is the same switch as the sound button in the game.</p>
   <label class="cFuTog"><input type="checkbox" data-c="sndToggle" ${on?'checked':''}><span class="cTog"></span><span>Play sounds</span></label></div>
   <div class="cSetGroup"><h4>Have a listen</h4><div class="cSndDemo">${demo.map(([k,n])=>`<button class="cPillBtn" data-c="sndTry" data-k="${k}" ${on?'':'disabled'}>${cSvg('play')}${n}</button>`).join('')}</div></div>`;}
Object.assign(CRM_ACT,{
  sndToggle:b=>{S.sound=!!b.checked;try{localStorage.setItem('hl_sound',S.sound?'1':'0');}catch(e){}const m=document.getElementById('mute');if(m)m.classList.toggle('off',!S.sound);if(S.sound)CSND.toggle(true);
    document.querySelectorAll('#crm [data-c=sndTry]').forEach(x=>x.disabled=!S.sound);},
  sndTry:b=>{const k=b.dataset.k;if(CSND[k])CSND[k]();}});

/* ---------- 23 Nov: profile photos (shared, so you both see each other's face) ---------- */
function crmTeamHtml(){return `<div class="cSetGroup"><h4>Profile photos</h4><p class="cSetP">Shown in the pipeline and on the calendar. Pick a photo and it is cropped to a circle and saved for both of you.</p>
  <div class="cFaces">${['sam','james'].map(p=>{const f=cFace(p);return `<div class="cFaceCard"><span class="cFaceBig" style="--ac:${pcolHex(p)}">${f?`<img src="${f}" alt="">`:cEsc(cName(p)[0])}</span><b>${cName(p)}</b>
    <label class="crmGhost cFacePick">${cSvg('plus')}${f?'Change':'Add photo'}<input type="file" accept="image/*" data-face="${p}" hidden></label>${f?`<button class="cTxtLink" data-c="faceDel" data-p="${p}">Remove</button>`:''}</div>`;}).join('')}</div></div>`;}
function crmFaceFile(inp){const f=inp.files&&inp.files[0];if(!f)return;const p=inp.dataset.face;const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=async()=>{
  const S2=320,cv=document.createElement('canvas');cv.width=cv.height=S2;const c=cv.getContext('2d');const s=Math.min(im.width,im.height);c.imageSmoothingQuality='high';c.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,S2,S2);
  const url=cv.toDataURL('image/jpeg',.86);await cfgSet('face_'+p,url);CRM.sheet.key='set'+Date.now();crmRender();try{CSND.done();}catch(e){}toast(`<b>Photo saved.</b> ${p===S.me?'Looking good.':cName(p)+' will see it too.'}`);};im.src=rd.result;};rd.readAsDataURL(f);}
Object.assign(CRM_ACT,{
  faceOpen:b=>{CRM.sheet={type:'settings',tab:'team',key:'set'+Date.now()};crmRender();try{CSND.open();}catch(e){}},
  faceDel:async b=>{await cfgSet('face_'+b.dataset.p,null);CRM.sheet.key='set'+Date.now();crmRender();}});
