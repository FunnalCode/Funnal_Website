/* ============================== 23 Nov: Google Calendar, both ways ==============================
   Uses Google's own sign-in in the browser (no server, no secret). The Client ID and the chosen calendar are shared
   settings, so Sam and James sync the same calendar. Whoever is connected does the syncing for both:
   events made in the pipeline go to Google, events made in Google come into the pipeline, edits and deletions follow
   whichever side changed last. Payments and follow-ups stay in the pipeline only. */
const GCAL={tok:null,exp:0,busy:false,last:null,err:null,tc:null,cals:null,timer:0,soon:0};
const GCAL_SCOPE='https://www.googleapis.com/auth/calendar';
const gcalClient=()=>cfgGet('gcal_client')||(window.HL_GOOGLE&&window.HL_GOOGLE.clientId)||null;
const gcalCal=()=>cfgGet('gcal_cal')||null;
const gcalKey=()=>'hl_gcal_tok_'+S.me;
const gcalEmail=()=>{try{return (window.HL_SUPABASE&&HL_SUPABASE.emails&&HL_SUPABASE.emails[S.me])||'';}catch(e){return '';}};
function gcalRestore(){try{const s=JSON.parse(sessionStorage.getItem(gcalKey())||'null');if(s&&s.exp>Date.now()+60000){GCAL.tok=s.tok;GCAL.exp=s.exp;}}catch(e){}}
function gcalState(){if(!gcalClient())return 'off';if(GCAL.tok&&GCAL.exp>Date.now()+30000)return 'on';return 'idle';}
function gcalLoadGis(){return new Promise((res,rej)=>{if(window.google&&google.accounts&&google.accounts.oauth2)return res();let s=document.getElementById('gisJs');if(!s){s=document.createElement('script');s.id='gisJs';s.src='https://accounts.google.com/gsi/client';s.async=true;document.head.appendChild(s);}s.addEventListener('load',()=>res());s.addEventListener('error',()=>rej(new Error('Google sign-in did not load')));});}
// get the sign-in ready before anyone clicks, so the Google window opens straight from the click (browsers block it otherwise)
async function gcalPrepare(){const id=gcalClient();if(!id||GCAL.tc&&GCAL.tc._id===id)return;try{await gcalLoadGis();GCAL.tc=google.accounts.oauth2.initTokenClient({client_id:id,scope:GCAL_SCOPE,login_hint:gcalEmail()||undefined,callback:gcalGot,error_callback:e=>{GCAL.err=(e&&e.type)==='popup_closed'?'Google window closed before finishing':'Google sign-in failed';cdbChanged();}});GCAL.tc._id=id;}catch(e){GCAL.err=e.message;}}
function gcalGot(r){if(r&&r.error){GCAL.err=r.error_description||r.error;cdbChanged();return;}GCAL.tok=r.access_token;GCAL.exp=Date.now()+((+r.expires_in||3600)-60)*1000;GCAL.err=null;try{sessionStorage.setItem(gcalKey(),JSON.stringify({tok:GCAL.tok,exp:GCAL.exp}));}catch(e){}
  gcalAfterConnect();}
function gcalConnect(){if(!GCAL.tc){gcalPrepare().then(()=>{if(GCAL.tc)GCAL.tc.requestAccessToken({prompt:''});});return;}GCAL.tc.requestAccessToken({prompt:GCAL.tok?'':''});}
function gcalDisconnect(){try{if(GCAL.tok&&window.google)google.accounts.oauth2.revoke(GCAL.tok,()=>{});}catch(e){}GCAL.tok=null;GCAL.exp=0;try{sessionStorage.removeItem(gcalKey());}catch(e){}cdbChanged();}
async function gapi(path,opt={}){const r=await fetch('https://www.googleapis.com/calendar/v3'+path,{...opt,headers:{Authorization:'Bearer '+GCAL.tok,'Content-Type':'application/json',...(opt.headers||{})}});
  if(r.status===401){GCAL.tok=null;try{sessionStorage.removeItem(gcalKey());}catch(e){}throw new Error('Google sign-in expired. Reconnect to keep syncing');}
  if(r.status===204||r.status===410)return null;const j=await r.json().catch(()=>({}));if(!r.ok){const e=new Error((j.error&&j.error.message)||('Google said '+r.status));e.status=r.status;throw e;}return j;}
async function gcalCalendars(){const j=await gapi('/users/me/calendarList?minAccessRole=writer&maxResults=250');GCAL.cals=(j.items||[]).map(c=>({id:c.id,name:c.summaryOverride||c.summary,primary:!!c.primary,col:c.backgroundColor}));return GCAL.cals;}
async function gcalAfterConnect(){try{const cals=await gcalCalendars();if(!gcalCal()||!cals.some(c=>c.id===gcalCal())){const pick=cals.find(c=>/funnal/i.test(c.name))||cals.find(c=>c.primary)||cals[0];if(pick)await cfgSet('gcal_cal',pick.id);}await gcalSync();}catch(e){GCAL.err=e.message;}cdbChanged();}
const gEnc=encodeURIComponent;
function gcalTo(e){const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'Europe/London';const pr=e.prospect_id&&PIPE.rows.find(r=>r.id===e.prospect_id);
  const desc=[e.notes||'',pr?`Pipeline: ${pr.business}${pr.contact?' ('+pr.contact+')':''}`:''].filter(Boolean).join('\n\n');
  const o={summary:e.title||'(No title)',description:desc||undefined,location:e.location||undefined,extendedProperties:{private:{funnal:e.id,kind:e.kind||''}}};
  if(e.all_day){const d=evDay(e);const end=e.ends_at?evDay({starts_at:e.ends_at}):addDays(d,1);o.start={date:d};o.end={date:end>d?end:addDays(d,1)};}
  else{const s=new Date(e.starts_at);const en=e.ends_at?new Date(e.ends_at):new Date(s.getTime()+3600e3);o.start={dateTime:s.toISOString(),timeZone:tz};o.end={dateTime:en.toISOString(),timeZone:tz};}return o;}
function gcalFrom(g){const allDay=!!(g.start&&g.start.date);const notes=(g.description||'').replace(/\n*Pipeline: [^\n]*$/,'').trim()||null;
  return {title:g.summary||'(No title)',notes,location:g.location||null,all_day:allDay,starts_at:allDay?localISO(g.start.date):new Date(g.start.dateTime).toISOString(),ends_at:allDay?localISO(g.end.date):(g.end&&g.end.dateTime?new Date(g.end.dateTime).toISOString():null)};}
const tms=s=>s?new Date(s).getTime():0;
async function gcalSync(){if(gcalState()!=='on'||GCAL.busy)return;const cal=gcalCal();if(!cal)return;GCAL.busy=true;cdbChanged();
  try{const base=`/calendars/${gEnc(cal)}/events`;
    // 1. send new pipeline events to Google
    for(const e of CDB.ev.filter(x=>!x.gcal_id&&!x.deleted)){const g=await gapi(base,{method:'POST',body:JSON.stringify(gcalTo(e))});if(g)await cdbUpdate('ev',e.id,{gcal_id:g.id,gcal_cal:cal,gcal_etag:g.etag,gcal_updated:g.updated});}
    // 2. deletions made in the pipeline
    for(const e of CDB.ev.filter(x=>x.gcal_id&&x.gcal_cal===cal&&x.deleted)){try{await gapi(`${base}/${gEnc(e.gcal_id)}`,{method:'DELETE'});}catch(er){if(er.status!==404&&er.status!==410)throw er;}await cdbRemove('ev',e.id);}
    // 3. edits made in the pipeline since the last sync
    for(const e of CDB.ev.filter(x=>x.gcal_id&&x.gcal_cal===cal&&!x.deleted&&tms(x.updated_at)>tms(x.gcal_updated)+1500)){try{const g=await gapi(`${base}/${gEnc(e.gcal_id)}`,{method:'PATCH',body:JSON.stringify(gcalTo(e))});if(g)await cdbUpdate('ev',e.id,{gcal_etag:g.etag,gcal_updated:g.updated});}catch(er){if(er.status===404||er.status===410)await cdbRemove('ev',e.id);else throw er;}}
    // 4. bring Google's side in: new events, edits and deletions
    const tmin=new Date(Date.now()-90*864e5).toISOString(),tmax=new Date(Date.now()+400*864e5).toISOString();let page=null;const items=[];
    do{const j=await gapi(`${base}?singleEvents=true&showDeleted=true&maxResults=2500&timeMin=${gEnc(tmin)}&timeMax=${gEnc(tmax)}${page?'&pageToken='+gEnc(page):''}`);items.push(...(j.items||[]));page=j.nextPageToken;}while(page);
    const fresh=[];
    for(const g of items){const e=CDB.ev.find(x=>x.gcal_id===g.id&&x.gcal_cal===cal);
      if(g.status==='cancelled'){if(e)await cdbRemove('ev',e.id);continue;}if(!g.start)continue;
      if(!e){const mine=g.extendedProperties&&g.extendedProperties.private&&g.extendedProperties.private.funnal;const own=mine&&CDB.ev.find(x=>x.id===mine);
        if(own){await cdbUpdate('ev',own.id,{gcal_id:g.id,gcal_cal:cal,gcal_etag:g.etag,gcal_updated:g.updated});continue;}
        fresh.push({id:cdbUid(),...gcalFrom(g),kind:(g.extendedProperties&&g.extendedProperties.private&&g.extendedProperties.private.kind)||'google',gcal_id:g.id,gcal_cal:cal,gcal_etag:g.etag,gcal_updated:g.updated,updated_at:g.updated,created_at:new Date().toISOString(),created_by:'google',updated_by:'google',deleted:false});}
      else if(tms(g.updated)>tms(e.gcal_updated)+1500&&tms(g.updated)>tms(e.updated_at)){await cdbUpdate('ev',e.id,{...gcalFrom(g),gcal_etag:g.etag,gcal_updated:g.updated,updated_at:g.updated,updated_by:'google'});}}
    if(fresh.length){if(CDB.src==='supa'){const {data,error}=await S.sb.from('hl_events').upsert(fresh,{onConflict:'gcal_cal,gcal_id',ignoreDuplicates:true}).select();if(error)throw error;(data||[]).forEach(r=>{if(!CDB.ev.some(x=>x.id===r.id))CDB.ev.push(r);});cdbSort('ev');}else{CDB.ev.push(...fresh);cdbSort('ev');cdbSave('ev');}}
    GCAL.last=Date.now();GCAL.err=null;
  }catch(e){GCAL.err=e.message||'Sync failed';console.warn('gcal',e);}finally{GCAL.busy=false;cdbChanged();}}
function gcalSoon(){clearTimeout(GCAL.soon);if(gcalState()==='on')GCAL.soon=setTimeout(gcalSync,1500);}
function gcalTick(){clearInterval(GCAL.timer);GCAL.timer=setInterval(()=>{if(document.hidden||!document.documentElement.classList.contains('crmOpen'))return;if(gcalState()==='on')gcalSync();},120000);}
