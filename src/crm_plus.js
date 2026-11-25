/* ============================== 25 Nov: warmth, Instagram and duplicates ==============================
   Warmth: one number per open prospect (0 to 100) from their stage, how recently you spoke, quote opens,
     meetings, likelihood and unanswered nudges. Shown on cards, rows, Up next and the prospect panel, and
     Up next picks the warmest of the most urgent.
   Instagram: a Message button that opens their DMs in the Instagram app (ig.me), on cards, Up next and the panel.
   Add from Instagram: open the game with ?add=<link> (the iPhone share-sheet shortcut does this) and the
     New prospect form opens filled in. The form also has a Paste button.
   Duplicates: the New prospect form warns when the business is already in the pipeline (either captain),
     and the prospect panel flags a twin. */

/* ---------- reading Instagram links properly ---------- */
const IG_NOT_HANDLES=/^(p|reel|reels|tv|stories|explore|accounts|direct|share|s)$/i;
function igHandle(s){s=String(s||'');let m=s.match(/instagram\.com\/stories\/([A-Za-z0-9_.]+)/i)||s.match(/instagram\.com\/([A-Za-z0-9_.]+)/i);
  if(m&&!IG_NOT_HANDLES.test(m[1]))return m[1].replace(/\.$/,'');m=s.match(/(?:^|\s|\()@([A-Za-z0-9_.]{2,30})/);return m?m[1].replace(/\.$/,''):null;}
{const _pp=pParse;pParse=function(txt){const s=String(txt||'').trim();const h=igHandle(s);
  if(h&&!/^@?[A-Za-z0-9_.]+$/.test(s)){const o=_pp('instagram.com/'+h);// a shared blurb like "Salty Biscuit (@thesaltybiscuit) • Instagram photos..."
    const nm=s.match(/^([^(@•|\n]{2,60}?)\s*\(@/);if(nm)o.business=nm[1].trim();return o;}
  if(/instagram\.com\/(p|reel|reels|tv)\//i.test(s))return {business:'',igPost:true};
  return _pp(s);};}
{const _fv=crmFieldVal;crmFieldVal=function(el){const v=_fv(el);if(el.dataset.f==='insta'&&typeof v==='string'){const h=igHandle(el.value)||v.replace(/[?#].*$/,'');return h||null;}return v;};}
const igDm=h=>h?`https://ig.me/m/${encodeURIComponent(String(h).replace(/^@/,''))}`:'';

/* ---------- warmth ---------- */
const WARM_BASE={video_needed:30,messaged:18,followed_up:22,talking:52,meeting:66,quote_sent:62,not_now:12,no_response:5,archived:0};
function cWarm(r){if(!r||r.stage==='client'||r.stage==='archived')return null;let n=WARM_BASE[r.stage]??10;const why=[];
  const add=(v,t)=>{if(!v||!t)return;n+=v;why.push([v,t]);};
  why.push(['base',n,(PIPE_BY[r.stage]||{}).name||'']);
  // a lead still waiting for its video: fresh ones are warmer, long waits cool off
  if(r.stage==='video_needed'&&r.created_at){const age=-cDays(String(r.created_at).slice(0,10));add(age<=3?10:age<=7?5:age>21?-6:0,age<=3?'Fresh lead':age<=7?'Added this week':age>21?'Waiting a while for a video':'');}
  const d=r.last_contact?-cDays(r.last_contact):null;
  if(d!=null&&r.stage!=='video_needed')add(d<=2?15:d<=7?10:d<=14?5:d<=30?0:-10,d<=2?'Spoke in the last 2 days':d<=7?'Spoke this week':d<=14?'Spoke in the last fortnight':'Not spoken for over a month');
  // their quote: recent visits are the strongest signal there is
  try{const qs=quotesFor(r.id);if(qs.length){let acc=false,vis=new Set(),fresh=false;const wk2=Date.now()-14*864e5,d2=Date.now()-2*864e5;
    qs.forEach(q=>qevFor(q.id).forEach(e=>{if(e.kind==='accept')acc=true;if(e.kind==='open'){const t=new Date(e.at).getTime();if(t>wk2)vis.add(e.visit);if(t>d2)fresh=true;}}));
    if(acc){return {n:100,label:'Hot',col:'#E0563B',why:[[0,'Accepted their quote']]};}
    if(vis.size)add(Math.min(24,vis.size*8),`Opened their quote ${vis.size===1?'once':vis.size+' times'} lately`);if(fresh)add(8,'Looked at it in the last 2 days');}}catch(e){}
  if(r.stage==='meeting'){if(r.meeting_held)add(6,'Meeting happened');else if(r.meeting_at&&r.meeting_at>=G.today)add(8,'Meeting booked');}
  if(r.rag==='likely')add(12,'Marked likely');else if(r.rag==='unlikely')add(-15,'Marked unlikely');
  if(r.priority)add(5,'Priority');
  const fu=+r.follow_ups||0;if((r.stage==='messaged'||r.stage==='followed_up')&&fu>2)add(-Math.min(15,(fu-2)*5),`${fu} nudges, no reply yet`);
  const due=pDue(r);if(due&&due.cls==='stale'&&r.stage!=='video_needed')add(-12,'Gone quiet');
  n=Math.max(0,Math.min(100,Math.round(n)));
  const [label,col]=n>=70?['Hot','#E0563B']:n>=45?['Warm','#E39B2D']:n>=25?['Cool','#4F98C9']:['Cold','#8497A8'];
  return {n,label,col,why};}
cIcon.flame='M12 3c.6 2.6 3.4 4.4 4.6 7.1A5 5 0 1 1 7 12c0-1.6.7-2.8 1.8-3.8.1 1.6.9 2.6 2 3-.4-2.9.1-5.6 1.2-8.2z';
cIcon.dm='M21 4L3 11l7 2.5L12.5 21 21 4zM10 13.5L21 4';
cIcon.paste='M9 4h6v3H9zM7 6H5v15h14V6h-2M9 12h6M9 16h4';
const cWarmChip=(r,cls='')=>{const w=cWarm(r);return w?`<span class="cWarm ${cls}" style="--w:${w.col}" title="Warmth ${w.n} of 100: ${cEsc(w.label)}">${cSvg('flame')}<b>${w.n}</b></span>`:'';};

/* ---------- duplicates ---------- */
const dupBiz=s=>String(s||'').toLowerCase().replace(/^the\s+/,'').replace(/\b(ltd|limited|uk|co)\b/g,'').replace(/[^a-z0-9]/g,'');
function cDupes(o,skipId){if(!o)return [];const ig=(o.insta||'').toLowerCase(),host=o.website?pHost(o.website).replace(/^www\./,''):'',bz=dupBiz(o.business);
  return PIPE.rows.filter(r=>r.id!==skipId&&(
    (ig&&(r.insta||'').toLowerCase()===ig)||
    (host&&r.website&&pHost(r.website).replace(/^www\./,'')===host)||
    (bz.length>=4&&dupBiz(r.business)===bz)));}
const dupWho=r=>`${cEsc(r.business||'Unnamed')}${r.insta?` <span>@${cEsc(r.insta)}</span>`:''}`;
const dupMeta=r=>[r.owner?(r.owner===S.me?'Yours':cOwnerName(r.owner)+"'s"):'Unassigned',(PIPE_BY[r.stage]||{}).name,r.last_contact?cMsgAgo(r).replace(/^Messaged/,'messaged'):''].filter(Boolean).join(' · ');
function dupBox(list,lead){return list.length?`<div class="cDupe">${cSvg('flag')}<div><b>${lead}</b>${list.slice(0,3).map(r=>`<button class="cDupeRow" data-c="dupeOpen" data-id="${r.id}"><span>${dupWho(r)}</span><small>${cEsc(dupMeta(r))}</small></button>`).join('')}</div></div>`:'';}
CRM_ACT.dupeOpen=b=>{CRM.adding=false;CRM.open=b.dataset.id;crmRender(true);};

/* ---------- the New prospect form: live preview, duplicate warning, paste, share-sheet help ---------- */
{const _ah=crmAddHtml;crmAddHtml=function(){let h=_ah.apply(this,arguments);
  h=h.replace('placeholder="instagram.com/thesaltybiscuit" autocomplete="off"></label>','placeholder="instagram.com/thesaltybiscuit" autocomplete="off"><button class="cPaste" data-c="addPaste" type="button">'+cSvg('paste')+'<span>Paste</span></button></label><div class="cAddPrev" aria-live="polite"></div>');
  h=h.replace('<div class="crmAddFoot">','<button class="cTxtLink cShareHelp" data-c="shareHelp" type="button">Add straight from Instagram’s Share button</button><div class="crmAddFoot">');
  return h;};}
function crmAddCheck(){const i=document.getElementById('crmAddIn');const box=document.querySelector('#crm .cAddPrev');if(!i||!box)return;const v=i.value.trim();const go=document.querySelector('#crm [data-c=addGo]');
  if(!v){box.innerHTML='';if(go)go.firstChild.nodeValue='Add prospect';return;}
  const o=pParse(v);if(o.igPost){box.innerHTML=`<p class="cAddNote">That’s a link to a post, not a profile. Open their profile and share or copy that link instead.</p>`;return;}
  const dup=cDupes(o);
  box.innerHTML=(o.business?`<p class="cAddNote">Adds <b>${cEsc(o.business)}</b>${o.insta?` · @${cEsc(o.insta)}`:o.website?` · ${cEsc(pHost(o.website))}`:''}</p>`:'')+dupBox(dup,dup.length===1?'Already in the pipeline':'Already in the pipeline ('+dup.length+')');
  if(go)go.firstChild.nodeValue=dup.length?'Add anyway':'Add prospect';}
CRM_ACT.addPaste=async()=>{const i=document.getElementById('crmAddIn');if(!i)return;try{const t=await navigator.clipboard.readText();if(t){i.value=t.trim();crmAddCheck();i.focus();}}catch(e){toast('Couldn’t read the clipboard. Long-press the box and choose Paste.','joke');}};
document.addEventListener('input',e=>{if(e.target&&e.target.id==='crmAddIn')crmAddCheck();},true);
// a post link can't make a prospect
{const _go=crmAddGo;crmAddGo=async function(){const i=document.getElementById('crmAddIn');if(i&&pParse(i.value).igPost){crmAddCheck();return;}return _go.apply(this,arguments);};}

CRM_ACT.shareHelp=()=>{const base=`${location.origin}${location.pathname}`;
  openModal(`<div class="cShareSheet"><h2>Add from Instagram in one tap</h2>
   <p class="muted">Set this up once on your iPhone. After that, on any Instagram profile tap <b>•••</b>, then <b>Share this profile</b>, then <b>Add to Hundred Cannons</b>. The game opens with the New prospect form filled in, and warns you if they’re already in.</p>
   <ol><li>Open the <b>Shortcuts</b> app and tap <b>+</b>.</li>
    <li>Tap the <b>i</b> (or the shortcut name) and turn on <b>Show in Share Sheet</b>. Set it to receive <b>URLs</b> and <b>Text</b>.</li>
    <li>Add the action <b>URL Encode</b> and set it to encode the <b>Shortcut Input</b>.</li>
    <li>Add the action <b>URL</b> with this, then tap at the end and insert the <b>URL Encoded Text</b> variable:<code>${cEsc(base)}?add=</code><button class="btn sm" data-act="copyAddBase">Copy</button></li>
    <li>Add the action <b>Open URLs</b>.</li>
    <li>Name it <b>Add to Hundred Cannons</b>.</li></ol>
   <p class="muted tiny">No shortcut? Copy the profile link in Instagram and use the Paste button on the New prospect form.</p>
   <div class="row" style="justify-content:flex-end"><button class="btn primary" data-act="closeModal">Got it</button></div></div>`);};
ACT.copyAddBase=()=>{const t=`${location.origin}${location.pathname}?add=`;try{navigator.clipboard.writeText(t);toast('Copied.','good');}catch(e){}};

/* ---------- ?add=… opens the form filled in ---------- */
(function(){let v=null;try{const u=new URL(location.href);v=u.searchParams.get('add');if(v!=null){u.searchParams.delete('add');history.replaceState(null,'',u.pathname+(u.search||'')+u.hash);sessionStorage.setItem('hl_add',v);}else v=sessionStorage.getItem('hl_add');}catch(e){}
  if(!v)return;let tries=0;const t=setInterval(()=>{tries++;if(tries>240){clearInterval(t);return;}
    if(!S.me||typeof PIPE==='undefined'||!PIPE.ready||typeof CRM==='undefined')return;clearInterval(t);try{sessionStorage.removeItem('hl_add');}catch(e){}
    CRM.adding=true;CRM.addStage='video_needed';if(S.screen!=='pipeline')location.hash='#pipeline';
    let n=0;const f=setInterval(()=>{n++;crmRender();const i=document.getElementById('crmAddIn');if(i){clearInterval(f);i.value=v.trim();crmAddCheck();}else if(n>30)clearInterval(f);},120);},250);})();

/* ---------- showing it all ---------- */
// board cards: warmth, and a DM button
{const _cc=crmCard;crmCard=function(r){let h=_cc.apply(this,arguments);
  const dm=r.insta&&r.stage!=='client'?`<a class="cDmBtn" data-c="igdm" data-id="${r.id}" href="${cEsc(igDm(r.insta))}" target="_blank" rel="noopener" title="Message @${cEsc(r.insta)} on Instagram" aria-label="Message on Instagram">${cSvg('dm')}</a>`:'';
  return h.replace('<span class="cIcons">',cWarmChip(r)+'<span class="cIcons">'+dm);};}
// follow-up rows
{const _cr=crmRow;crmRow=function(x){const h=_cr.apply(this,arguments);const r=x.r;
  const dm=r.insta?`<a class="cIconBtn sm cDmBtn2" data-c="igdm" data-id="${r.id}" href="${cEsc(igDm(r.insta))}" target="_blank" rel="noopener" title="Message on Instagram" aria-label="Message on Instagram">${cSvg('dm')}</a>`:'';
  return h.replace('<div class="crmRowMain"><b>',`<div class="crmRowMain"><b>${cWarmChip(r,'sm')}`).replace('<div class="crmRowAct">','<div class="crmRowAct">'+dm);};}
// Up next: the warmest of the most urgent group
{const _un=crmUpNext;crmUpNext=function(rows,items){const up=_un.apply(this,arguments);if(!up||up.kind==='Meeting'||!up.it)return up;
  const same=items.filter(x=>x.cls===up.it.cls);if(same.length<2)return up;const w=x=>(cWarm(x.r)||{n:0}).n;const best=same.slice().sort((a,b)=>w(b)-w(a)||(a.d<b.d?-1:1))[0];
  return best===up.it?up:{r:best.r,kind:best.what,when:'',big:cDueLabel(best),it:best};};}
{const _ct=crmToday;crmToday=function(rows,items){let h=_ct.apply(this,arguments);const up=crmUpNext(rows,items);if(!up)return h;const w=cWarm(up.r);
  if(w)h=h.replace('<small class="cUpAgo">',`<div class="cUpWarm" style="--w:${w.col}"><span class="cUpWarmBar"><i style="--p:${w.n}%"></i></span><b>${cSvg('flame')}${w.n} · ${w.label}</b></div><small class="cUpAgo">`);
  if(up.r.insta)h=h.replace('<footer><span class="grow"></span>',`<footer><a class="cUpGhost cUpDm" data-c="igdm" data-id="${up.r.id}" href="${cEsc(igDm(up.r.insta))}" target="_blank" rel="noopener">${cSvg('dm')}Message</a><span class="grow"></span>`);
  return h;};}
// on a phone, open the Instagram app on their profile (one tap on Message from there). If the app doesn't open,
// fall back to ig.me. On a computer the ig.me link opens the DM on the web.
const IG_PHONE=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function igOpen(h,e){if(!h)return;if(!IG_PHONE)return;if(e)e.preventDefault();let left=false;const off=()=>{left=true;};
  document.addEventListener('visibilitychange',off,{once:true});addEventListener('pagehide',off,{once:true});
  location.href='instagram://user?username='+encodeURIComponent(h);
  setTimeout(()=>{if(!left&&!document.hidden)location.href=igDm(h);},1600);}
CRM_ACT.igdm=(b,e)=>{const r=PIPE.rows.find(x=>x.id===b.dataset.id);igOpen(r&&r.insta,e);};
// the prospect panel: Message button, warmth breakdown, twin warning
{const _df=crmDrawerFill;crmDrawerFill=function(){_df.apply(this,arguments);const d=document.querySelector('#crm .crmDrawer');if(!d||!CRM.open)return;const r=PIPE.rows.find(x=>x.id===CRM.open);if(!r)return;
  const links=d.querySelector('.cLinks');
  if(links&&r.insta&&!links.querySelector('.cLinkDm'))links.insertAdjacentHTML('afterbegin',`<a class="cLinkBtn cLinkDm" data-c="igdm" data-id="${r.id}" href="${cEsc(igDm(r.insta))}" target="_blank" rel="noopener">${cSvg('dm')}Message</a>`);
  const w=cWarm(r);if(links&&w&&!d.querySelector('.cWarmPanel'))links.insertAdjacentHTML('afterend',`<details class="cWarmPanel" style="--w:${w.col}"><summary><span class="cWarmDial" style="--p:${w.n}"><b>${w.n}</b></span><div><small>Warmth</small><b>${w.label}</b></div><span class="cUpWarmBar"><i style="--p:${w.n}%"></i></span></summary><ul>${w.why.map(x=>x[0]==='base'?`<li><span>${x[1]}</span>${cEsc(x[2])} to start</li>`:`<li><span class="${x[0]>0?'up':'dn'}">${x[0]>0?'+'+x[0]:x[0]}</span>${cEsc(x[1])}</li>`).join('')}</ul></details>`);
  const tw=cDupes(r,r.id);if(tw.length&&!d.querySelector('.cDupe')){const at=d.querySelector('.cWarmPanel')||links;if(at)at.insertAdjacentHTML('afterend',dupBox(tw,tw.length===1?'Looks like a twin of':'Looks like twins of'));}};}
