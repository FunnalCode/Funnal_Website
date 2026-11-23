/* ============================== 23 Nov: pipeline data beyond prospects ==============================
   Packages and prices, payments, calendar events and quotes. Shared through Supabase (crew only, live updates),
   or kept in this browser when there is no Supabase (tests and offline). Google Calendar sync lives in crm_google.js. */
const CDB={cat:[],pay:[],ev:[],quo:[],ready:false,src:null};
const CDB_T={cat:['hl_catalogue','hl_cat_v1','sort'],pay:['hl_payments','hl_pay_v1','due'],ev:['hl_events','hl_ev_v1','starts_at'],quo:['hl_quotes','hl_quo_v1','created_at']};
const CAT_SEED=[
 ['pkg_classic','Classic package','package',895,'monthly',null,'Social on Facebook and Instagram, monthly email/SMS campaign, simple automations, lite branding, monthly review, small ad campaigns'],
 ['pkg_executive','Executive package','package',1395,'monthly',null,'Up to three social platforms, two email/SMS campaigns a month, automations, Google or Meta ads managed, creative bundle, monthly strategy call, website build included (hosting separate)'],
 ['pkg_prestige','Prestige package','package',2495,'monthly',null,'All social platforms, weekly email/SMS, outbound prospecting, advanced automations, ads with creative testing, brand and design lab, priority support, bi-weekly strategy calls, website build if needed'],
 ['soc_starter','Social Media: Starter','service',399,'monthly',null,'2 platforms'],['soc_growth','Social Media: Growth','service',649,'monthly',null,'3 platforms'],['soc_premium','Social Media: Premium','service',999,'monthly',null,'5 platforms'],
 ['web_build','Website build','service',1950,'one_off',null,'From £1,950'],['web_care','Website hosting and care','service',99,'monthly',null,'Hosting, updates and security'],
 ['branding','Branding','service',1100,'one_off',null,'Complete brand identity'],['ai_auto','AI automation','service',399,'monthly',499,'£499 set-up'],
 ['paid_ads','Paid advertising','service',199,'monthly',null,'Plus 20% of ad spend. Ad spend paid directly'],['email_sms','Email and SMS','service',349,'monthly',749,'From £749 set-up'],
 ['outreach','Commercial outreach','service',275,'monthly',null,'100 LinkedIn DMs a week'],['print','Print design','service',199,'one_off',null,'From £199 per project'],
 ['add_platform','Extra social platform','addon',null,'monthly',null,null],['add_contentday','Content day','addon',null,'one_off',null,'Photo and video shoot, on-site or virtual'],['add_landing','Landing page','addon',null,'one_off',null,null],
 ['add_outbound','Outbound campaign','addon',null,'monthly',null,'GDPR-safe list building and outreach'],['add_seasonal','Seasonal campaign','addon',null,'one_off',null,null],['add_automation','Extra automation','addon',null,'monthly',null,null],['add_reporting','Advanced reporting','addon',null,'monthly',null,null]
].map((a,i)=>({id:a[0],name:a[1],kind:a[2],price:a[3],period:a[4],setup:a[5],note:a[6],sort:i+1,active:true}));
const cdbLocal=k=>({get(){try{return JSON.parse(localStorage.getItem(CDB_T[k][1])||'null');}catch(e){return null;}},set(v){try{localStorage.setItem(CDB_T[k][1],JSON.stringify(v));}catch(e){}}});
const cdbUid=()=>(crypto.randomUUID&&crypto.randomUUID())||(Date.now().toString(36)+Math.random().toString(36).slice(2));
function cdbSort(k){const f=CDB_T[k][2];CDB[k].sort((a,b)=>(a[f]>b[f]?1:a[f]<b[f]?-1:0));}
function cdbChanged(){if(typeof pipeRefresh==='function')pipeRefresh();}
function cdbStart(){if(CDB.src)return;
  if(S.sb){CDB.src='supa';cdbLoadAll();try{const ch=S.sb.channel('hl-crm-extra');Object.keys(CDB_T).forEach(k=>ch.on('postgres_changes',{event:'*',schema:'public',table:CDB_T[k][0]},p=>{
      if(p.eventType==='DELETE'){CDB[k]=CDB[k].filter(r=>r.id!==(p.old&&p.old.id));}else if(p.new){const i=CDB[k].findIndex(r=>r.id===p.new.id);if(i>=0)CDB[k][i]=p.new;else CDB[k].push(p.new);cdbSort(k);}cdbChanged();if(k==='ev'&&typeof gcalSoon==='function')gcalSoon();}));ch.subscribe();}catch(e){console.warn('crm sub',e);}
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)cdbLoadAll();});}
  else{CDB.src='local';Object.keys(CDB_T).forEach(k=>{CDB[k]=cdbLocal(k).get()||(k==='cat'?CAT_SEED.slice():[]);cdbSort(k);});CDB.ready=true;}}
async function cdbLoadAll(){await Promise.all(Object.keys(CDB_T).map(async k=>{try{let q=S.sb.from(CDB_T[k][0]).select('*').order(CDB_T[k][2],{ascending:true}).limit(5000);if(k==='ev')q=q.gte('starts_at',new Date(Date.now()-400*864e5).toISOString());const {data,error}=await q;if(error)throw error;CDB[k]=data||[];}catch(e){console.warn('crm load',k,e);}}));CDB.ready=true;cdbChanged();}
function cdbSave(k){if(CDB.src==='local')cdbLocal(k).set(CDB[k]);}
async function cdbInsert(k,o){const r=Object.assign({id:cdbUid(),created_at:new Date().toISOString()},o);CDB[k].push(r);cdbSort(k);cdbSave(k);cdbChanged();
  if(CDB.src==='supa'){const {error}=await S.sb.from(CDB_T[k][0]).insert(r);if(error){CDB[k]=CDB[k].filter(x=>x.id!==r.id);cdbChanged();toast(`<b>Couldn't save.</b> ${esc(error.message||'')}`,'joke');return null;}}return r;}
async function cdbUpdate(k,id,patch){const r=CDB[k].find(x=>x.id===id);if(!r)return false;const prev={};Object.keys(patch).forEach(f=>prev[f]=r[f]);Object.assign(r,patch);cdbSort(k);cdbSave(k);cdbChanged();
  if(CDB.src==='supa'){const {error}=await S.sb.from(CDB_T[k][0]).update(patch).eq('id',id);if(error){Object.assign(r,prev);cdbChanged();toast(`<b>Couldn't save.</b> ${esc(error.message||'')}`,'joke');return false;}}return prev;}
async function cdbRemove(k,id){const r=CDB[k].find(x=>x.id===id);if(!r)return;CDB[k]=CDB[k].filter(x=>x.id!==id);cdbSave(k);cdbChanged();
  if(CDB.src==='supa'){const {error}=await S.sb.from(CDB_T[k][0]).delete().eq('id',id);if(error){CDB[k].push(r);cdbSort(k);cdbChanged();toast(`<b>Couldn't remove it.</b> ${esc(error.message||'')}`,'joke');}}}

/* ---------- packages and prices ---------- */
const P_PERIOD={monthly:'a month',four_weekly:'every 4 weeks',one_off:'one-off'};
const P_PERIOD_SHORT={monthly:'/mo',four_weekly:'/4wk',one_off:''};
const catItems=(kind)=>CDB.cat.filter(c=>c.kind!=='config'&&c.active!==false&&(!kind||c.kind===kind)).sort((a,b)=>(a.sort||0)-(b.sort||0));
const catBy=id=>CDB.cat.find(c=>c.id===id);
const catPrice=c=>c.price==null?'Price on request':pMoney(c.price)+(c.period==='one_off'?'':' '+P_PERIOD[c.period]);
function cfgGet(k){const c=CDB.cat.find(x=>x.id==='cfg_'+k);return c?c.note:null;}
async function cfgSet(k,v){const id='cfg_'+k;if(catBy(id))return cdbUpdate('cat',id,{note:v,updated_by:S.me});return cdbInsert('cat',{id,name:k,kind:'config',note:v,period:'one_off',active:false,sort:999});}

/* ---------- billing: monthly, every 4 weeks or one-off ---------- */
// monthly-equivalent income: 4-weekly is 13 payments a year, so 13/12 of the amount
const pMonthly=r=>{const v=+r.deal_value||0;return r.deal_period==='monthly'?v:r.deal_period==='four_weekly'?v*13/12:0;};
const pRecurring=r=>r.deal_period==='monthly'||r.deal_period==='four_weekly';
function addMonthsKeep(start,n){const d=new Date(start+'T12:00:00Z');const day=d.getUTCDate();const t=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+n,1,12));const last=new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth()+1,0,12)).getUTCDate();t.setUTCDate(Math.min(day,last));return t.toISOString().slice(0,10);}
// every payment date for a client between two dates (inclusive)
function payDates(r,from,to){if(r.stage!=='client'||!r.billing_start||!r.deal_period)return [];const out=[];
  if(r.deal_period==='one_off'){if(r.billing_start>=from&&r.billing_start<=to)out.push(r.billing_start);return out;}
  for(let n=0;n<400;n++){const d=r.deal_period==='monthly'?addMonthsKeep(r.billing_start,n):addDays(r.billing_start,28*n);if(d>to)break;if(d>=from)out.push(d);}return out;}
const payPaid=(r,d)=>CDB.pay.find(p=>p.prospect_id===r.id&&p.due===d);
// payments that have fallen due and are not marked paid (looks back a year)
function payOwed(rows){const t=G.today,from=addDays(t,-370);const out=[];(rows||PIPE.rows).forEach(r=>payDates(r,from,t).forEach(d=>{if(!payPaid(r,d))out.push({r,d,amt:+r.deal_value||0,late:d<t});}));return out.sort((a,b)=>a.d<b.d?-1:1);}
function payNext(r){const t=G.today;const l=payDates(r,t,addDays(t,400)).find(d=>!payPaid(r,d));return l||null;}
function payUpcoming(rows,days){const t=G.today,to=addDays(t,days||14);const out=[];(rows||PIPE.rows).forEach(r=>payDates(r,addDays(t,1),to).forEach(d=>{if(!payPaid(r,d))out.push({r,d,amt:+r.deal_value||0});}));return out.sort((a,b)=>a.d<b.d?-1:1);}
async function payMark(r,d){if(payPaid(r,d))return;const p=await cdbInsert('pay',{prospect_id:r.id,due:d,amount:+r.deal_value||0,paid_by:S.me,paid_at:new Date().toISOString()});if(p&&typeof pipeLog==='function')pipeLog(r.id,'paid',{due:d,amount:p.amount});return p;}
async function payUnmark(r,d){const p=payPaid(r,d);if(p)await cdbRemove('pay',p.id);}

/* ---------- calendar events ---------- */
const EV_KIND={meeting:{n:'Meeting',c:'#DDA94D'},call:{n:'Call',c:'#486790'},task:{n:'Task',c:'#3F5160'},other:{n:'Other',c:'#B98A8A'},google:{n:'Google',c:'#7FA2D2'}};
const evLive=()=>CDB.ev.filter(e=>!e.deleted);
const evDay=e=>{const d=new Date(e.starts_at);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const evTime=e=>e.all_day?'All day':new Date(e.starts_at).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
const localISO=(date,time)=>new Date(`${date}T${time||'00:00'}:00`).toISOString();
async function evSave(o){o.updated_by=S.me;o.updated_at=new Date().toISOString();let r;
  if(o.id&&CDB.ev.find(e=>e.id===o.id)){const id=o.id;const p={...o};delete p.id;await cdbUpdate('ev',id,p);r=CDB.ev.find(e=>e.id===id);}else{r=await cdbInsert('ev',{...o,created_by:S.me,deleted:false});}
  if(r&&r.prospect_id&&r.kind==='meeting'){const pr=PIPE.rows.find(x=>x.id===r.prospect_id);if(pr&&pr.meeting_at!==evDay(r))pipePatch(pr.id,{meeting_at:evDay(r),meeting_held:false},'edit',{fields:['meeting_at']});}
  if(typeof gcalSoon==='function')gcalSoon();return r;}
async function evDelete(id){const e=CDB.ev.find(x=>x.id===id);if(!e)return;if(e.gcal_id)await cdbUpdate('ev',id,{deleted:true,updated_by:S.me,updated_at:new Date().toISOString()});else await cdbRemove('ev',id);if(typeof gcalSoon==='function')gcalSoon();}

/* ---------- quotes ---------- */
const QUOTE_URL=tok=>`https://www.funnal.co.uk/quote?q=${tok}`;
const quoteTok=()=>{const a=new Uint8Array(12);crypto.getRandomValues(a);return [...a].map(x=>x.toString(16).padStart(2,'0')).join('');};
async function quoteEncrypt(obj,pw){const enc=new TextEncoder();const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const k=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveKey']);const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:310000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt']);
  const ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(obj))));const all=new Uint8Array(28+ct.length);all.set(salt,0);all.set(iv,16);all.set(ct,28);
  let s='';for(let i=0;i<all.length;i+=8192)s+=String.fromCharCode.apply(null,all.subarray(i,i+8192));return btoa(s);}
const quotesFor=id=>CDB.quo.filter(q=>q.prospect_id===id).sort((a,b)=>a.created_at<b.created_at?1:-1);
