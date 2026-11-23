/* ============================== 23 Nov: Google Calendar synced by the server ==============================
   The old way kept Google's sign-in in the browser tab: it ran out after an hour and only synced while someone had
   the pipeline open, so in practice the calendar never stayed in step. Now one of you connects once, the Supabase
   function "gcal" keeps the Google access on the server and syncs both ways on its own. The browser way stays as a
   fallback if the server can't be reached. */
const GSRV={ok:null,st:null,loading:false,cals:null};
function gsrvUrl(p){const u=(window.HL_SUPABASE&&HL_SUPABASE.url)||'';return u?u.replace(/\/$/,'')+'/functions/v1/gcal/'+p:null;}
async function gsrv(p,body){const url=gsrvUrl(p);if(!url||!S.sb)throw new Error('offline');const {data}=await S.sb.auth.getSession();const tok=data&&data.session&&data.session.access_token;if(!tok)throw new Error('Not signed in');
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok,apikey:(window.HL_SUPABASE&&HL_SUPABASE.key)||'','x-hl-user':'1'},body:JSON.stringify(body||{})});
  const j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw new Error(j.error||('Server said '+r.status));return j;}
async function gsrvStatus(){if(GSRV.loading)return GSRV.st;GSRV.loading=true;try{GSRV.st=await gsrv('status');GSRV.ok=true;if(GSRV.st.last_sync)GCAL.last=new Date(GSRV.st.last_sync).getTime();GCAL.err=GSRV.st.connected?GSRV.st.last_error:GCAL.err;
    if(GSRV.st.connected&&!GSRV.cals){gsrv('cals').then(j=>{GSRV.cals=j.cals||[];GCAL.cals=GSRV.cals;cdbChanged();}).catch(()=>{});}}
  catch(e){GSRV.ok=false;}finally{GSRV.loading=false;}cdbChanged();return GSRV.st;}
const gsrvOn=()=>!!(GSRV.ok&&GSRV.st&&GSRV.st.connected);

{const _st=gcalState;gcalState=function(){if(gsrvOn())return 'on';if(GSRV.ok&&GSRV.st&&gcalClient())return 'idle';return _st();};}
{const _sy=gcalSync;gcalSync=async function(){if(!gsrvOn())return _sy();if(GCAL.busy)return;GCAL.busy=true;cdbChanged();
  try{const r=await gsrv('sync');if(r.error)throw new Error(r.error);GCAL.last=Date.now();GCAL.err=null;if(typeof cdbLoadAll==='function'&&CDB.src==='supa')await cdbLoadAll();}
  catch(e){GCAL.err=e.message;}finally{GCAL.busy=false;cdbChanged();}};}
{const _cn=gcalConnect;gcalConnect=function(){if(!GSRV.ok)return _cn();const st=GSRV.st||{};
  if(!st.hasSecret){CRM.sheet={type:'settings',key:'set'+Date.now(),tab:'google'};crmRender();toast('<b>One more step.</b> Paste the client secret from Google Cloud first.','joke');return;}
  gsrv('link',{ret:location.href.replace(/[?&]gcal=[^&#]*/,'')}).then(j=>{location.href=j.url;}).catch(e=>toast(`<b>Couldn't start the Google sign-in.</b> ${cEsc(e.message)}`,'joke'));};}
{const _off=gcalDisconnect;gcalDisconnect=function(){if(!gsrvOn())return _off();gsrv('disconnect').then(()=>{GSRV.cals=null;return gsrvStatus();}).catch(e=>toast(`<b>Couldn't disconnect.</b> ${cEsc(e.message)}`,'joke'));};}
// while the pipeline is open, keep the status fresh (the server syncs every few minutes by itself)
{const _tk=gcalTick;gcalTick=function(){_tk();gsrvStatus();};}
{const _rs=gcalRestore;gcalRestore=function(){_rs();if(GSRV.ok===null)gsrvStatus();};}

function gsrvHtml(){const st=GSRV.st||{};const on=gsrvOn();const cal=st.cal;const who=st.by?cName(st.by):'';
  return `<div class="cSetGroup"><h4>Google Calendar</h4><p class="cSetP">${on?`Synced by the server, both ways, every few minutes, even when the game is closed. Connected through ${cEsc(st.email||who)}. Last sync ${cAgo(GCAL.last)}.${GCAL.err?` <em class="bad">${cEsc(GCAL.err)}</em>`:''}`:'One of you connects once and it stays connected for both of you. It keeps syncing when the game is closed.'}</p>
   ${on?`<div class="cRowBtns"><button class="crmGhost" data-c="gcalSync">${cSvg('sync')}Sync now</button><button class="crmGhost danger" data-c="gcalOff"><span>Disconnect</span></button></div>`
      :`<button class="crmPrimary" data-c="gcalGo" ${st.hasSecret&&gcalClient()?'':'disabled'}>${cSvg('g')}Connect Google Calendar</button>${st.last_error?`<p class="cSetP"><em class="bad">${cEsc(st.last_error)}</em></p>`:''}`}</div>
   ${on?`<div class="cSetGroup"><h4>Calendar to sync</h4><p class="cSetP">Shared by both of you. A calendar called Funnal, shared with James, works best.</p><select id="cs_gcal" class="cSetSel">${(GSRV.cals||[]).map(c=>`<option value="${cEsc(c.id)}" ${c.id===cal?'selected':''}>${cEsc(c.name)}${c.primary?' (main)':''}</option>`).join('')||`<option>${cEsc(cal||'Loading…')}</option>`}</select></div>`:''}
   <details class="cSetGroup cGSetup" ${on?'':'open'}><summary><h4>Google Cloud setup</h4></summary>
    <p class="cSetP">In Google Cloud, <b>APIs &amp; Services → Credentials</b>, open the OAuth client (Web application):</p>
    <ol class="cSetP cSteps"><li>Under <b>Authorised redirect URIs</b>, add<br><code class="cCopy" data-c="gsrvCopy">${cEsc(st.redirect||gsrvUrl('callback')||'')}</code></li>
     <li>Copy the <b>Client secret</b> into the box below.</li>
     <li>On the <b>OAuth consent screen</b>, set publishing status to <b>In production</b>. In testing mode Google cuts the connection after 7 days.</li>
     <li>Make sure the <b>Google Calendar API</b> is enabled in the same project.</li></ol>
    <h4>Client ID</h4><div class="cCatRow one"><input id="cs_gid" value="${cEsc(gcalClient()||'')}" placeholder="1234-abc.apps.googleusercontent.com" autocomplete="off"><button class="crmPrimary" data-c="gcalSave">Save</button></div>
    <h4>Client secret</h4><p class="cSetP">${st.hasSecret?'Saved on the server. Paste a new one to replace it.':'Kept on the server only. Nobody can read it back.'}</p><div class="cCatRow one"><input id="cs_gsec" type="password" placeholder="${st.hasSecret?'••••••••••••':'GOCSPX-…'}" autocomplete="off"><button class="crmPrimary" data-c="gsrvSecret">Save</button></div>
   </details>`;}
Object.assign(CRM_ACT,{
  gsrvSecret:async()=>{const v=(document.getElementById('cs_gsec').value||'').trim();if(!v)return;try{await gsrv('secret',{secret:v});await gsrvStatus();CRM.sheet&&(CRM.sheet.key='set'+Date.now());crmRender();toast('<b>Client secret saved.</b> Now tap Connect Google Calendar.','good');}catch(e){toast(`<b>Couldn't save it.</b> ${cEsc(e.message)}`,'joke');}},
  gsrvCopy:b=>{try{navigator.clipboard.writeText(b.textContent.trim());toast('<b>Copied.</b> Paste it into Google Cloud.','good');}catch(e){}},
});
// picking a calendar tells the server too
document.addEventListener('change',e=>{if(e.target&&e.target.id==='cs_gcal'&&gsrvOn()){gsrv('setcal',{cal:e.target.value}).then(()=>gsrvStatus()).catch(er=>toast(`<b>Couldn't switch calendar.</b> ${cEsc(er.message)}`,'joke'));}},true);
// coming back from Google's sign-in
(function(){const m=/[?&]gcal=([^&#]+)/.exec(location.search);if(!m)return;const v=decodeURIComponent(m[1]);
  try{history.replaceState(null,'',location.pathname+location.search.replace(/[?&]gcal=[^&#]*/,'').replace(/^&/,'?')+location.hash);}catch(e){}
  setTimeout(()=>{if(v==='ok')toast('<b>Google Calendar connected.</b> It now syncs on its own, both ways.','good');else toast(`<b>Google Calendar didn't connect.</b> ${v==='expired'?'The sign-in took too long. Try again.':v==='access_denied'?'Access was not allowed.':'Check the setup steps in Settings → Calendar.'}`,'joke');},2500);})();
