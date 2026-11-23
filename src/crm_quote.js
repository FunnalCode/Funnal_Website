/* ============================== 23 Nov: quote maker ==============================
   Builds a quote in the pipeline and publishes it as a private page on funnal.co.uk/quote, in the same design as the
   Nest Interiors quote: package switcher, monthly services, breakdown, terms, thank-you with signature, print and PDF,
   plus an Accept button that lands back here. A password is optional; with one, the page arrives locked. */
const QT_TERMS=['One-off fees are 50% to start and 50% at launch. If it helps with cash flow, we can split them into monthly payments.','Monthly services need a minimum commitment of 3 months, then 28 days’ written notice, with payment up front for the month ahead.','Any additional software costs and platforms needed are covered by the client. Ad spend is paid directly.','Funnal Ltd reserves the right to showcase work for our own marketing.','Past performance may not be indicative of future results. Funnal Ltd does not guarantee specific results or outcomes.','Further details will be provided in the Master Creative Services Agreement once the quotation has been accepted.'];
const QT_ADDON={
  email_sms:{g:'Email',d:'Turn past customers into repeat work and referrals.',li:['Customer list cleaned and sorted','Automated welcome, follow-up and re-engagement emails','A monthly campaign or newsletter','Monthly report on opens, clicks and enquiries']},
  soc_starter:{g:'Social',d:'Instagram and Facebook, run for you.',li:['12 posts and 4 Reels a month','Instagram and Facebook managed','Content created and photos edited','Comments and messages answered','Monthly content calendar and report']},
  soc_growth:{g:'Social',d:'Adds a third platform, such as LinkedIn.',li:['16 posts and 8 Reels a month','Three platforms managed','Graphic design and video editing','Active engagement and follower growth','Competitor and trend research']},
  soc_premium:{g:'Social',d:'Every platform, with weekly strategy.',li:['20+ posts and 12+ Reels a month','Up to five platforms','Custom graphics and video production','Weekly strategy calls','Reputation monitoring']},
  ai_auto:{g:'Grow',d:'We look for ways to save you time, then build the automations.',li:['A monthly look at where your time goes','Up to two new automations a month','Ideas like enquiry alerts, quote follow-ups and review requests','Fixes, monitoring and small tweaks']},
  outreach:{g:'Grow',d:'We message potential clients for you. 100 a week.',li:['A target list of the right buyers','100 personal LinkedIn DMs a week, in your voice','Interested replies passed straight to you','Monthly report of who we contacted']},
  paid_ads:{g:'Grow',d:'Google and Meta ads, managed for you.',li:['Campaign set-up and targeting','Ad creative and testing','Monthly report on leads and spend','Ad spend paid directly']},
  web_care:{g:'Grow',d:'Hosting, updates and security for your website.',li:['Fast, secure hosting','Updates and backups','Small changes each month']}};
function qtNew(r){const pk=r.package&&catBy(r.package);const first=(r.contact||'').split(/\s+/)[0];
  const p0=pk?{name:pk.name.replace(/ package$/i,''),price:pk.price||0,period:pk.period,care:0,careName:'',tag:'',rec:false,cat:pk.id}:{name:'Classic',price:0,period:'one_off',care:0,careName:'Hosting and care',tag:'',rec:false};
  return {v:1,business:r.business||'',greet:first||r.contact||'',short:(r.business||'').replace(/^the\s+/i,'').split(/\s+/)[0]||'',from:S.me==='james'?'james':'sam',
    kicker:`Your plan for ${r.business||'your business'}.`,lede:'Pick a package, add any monthly services, and your total updates as you go. When you’re happy, print it as a PDF or accept it here.',
    pkgTitle:'',pkgNote:'',packages:[p0],items:pk&&pk.note?pk.note.split(/,\s*/).filter(Boolean).map(n=>({n:n.charAt(0).toUpperCase()+n.slice(1),s:'',m:'',from:0})):[],
    addonsTitle:'Add monthly services',addonsNote:'No set-up fees with your package. Hover or tap the i for details.',noSetup:true,addons:[],
    spread:'',payplanTitle:'',payplan:'',receiptNote:'',letterThanks:'Thank you for your time, it was lovely to meet you.',intro:'Following on from our conversation, please find your quote below.',
    payment:'One-off fees are 50% to start and 50% at launch. Monthly services are paid up front for the month ahead.',terms:QT_TERMS.slice(),validUntil:addDays(G.today,30),thanksTitle:'',thanks:'If anything here raises a question, just give me a call or drop me an email.',pw:''};}
function qtOpen(pid,qid){const r=PIPE.rows.find(x=>x.id===pid);if(!r)return;const q=qid&&CDB.quo.find(x=>x.id===qid);
  CRM.sheet={type:'quote',key:'qt'+Date.now(),pid,qid:q?q.id:null,Q:q&&q.data?JSON.parse(JSON.stringify(q.data)):qtNew(r)};crmRender();}
const qtGet=(o,p)=>p.split('.').reduce((a,k)=>a==null?a:a[k],o);
function qtSet(o,p,v){const ks=p.split('.');const last=ks.pop();const t=ks.reduce((a,k)=>a[k],o);t[last]=v;}
function qtTotalHint(Q){const p=Q.packages.find(x=>x.rec)||Q.packages[0]||{};return p.price?`${pMoney(p.price)} ${P_PERIOD[p.period]||''}${p.care?` + ${pMoney(p.care)} a month`:''}`:'';}
function crmQuoteHtml(){const s=CRM.sheet,Q=s.Q,r=PIPE.rows.find(x=>x.id===s.pid)||{};const q=s.qid&&CDB.quo.find(x=>x.id===s.qid);
  const inp=(p,ph,cls='',type='text')=>`<input data-q="${p}" type="${type}" value="${cEsc(qtGet(Q,p)??'')}" placeholder="${cEsc(ph||'')}" class="${cls}" ${type==='number'?'inputmode="decimal"':''}>`;
  const ta=(p,ph,rows=2)=>`<textarea data-q="${p}" rows="${rows}" placeholder="${cEsc(ph||'')}">${cEsc(qtGet(Q,p)??'')}</textarea>`;
  const fld=(lab,h,w)=>`<label class="cF ${w?'wide':''}"><span>${lab}</span>${h}</label>`;
  const per=p=>`<select data-q="${p}">${[['one_off','One-off'],['monthly','Monthly'],['four_weekly','Every 4 weeks']].map(([k,n])=>`<option value="${k}" ${qtGet(Q,p)===k?'selected':''}>${n}</option>`).join('')}</select>`;
  const pkgOpts=c=>`<option value="">Pick from your prices…</option>${catItems().filter(x=>x.price!=null).map(x=>`<option value="${x.id}" ${c===x.id?'selected':''}>${cEsc(x.name)} · ${pMoney(x.price)}${P_PERIOD_SHORT[x.period]}</option>`).join('')}`;
  const pk=Q.packages.map((p,i)=>`<div class="cQPk ${p.rec?'rec':''}"><div class="cQPkH"><b>Package ${i+1}</b><select class="cQCat" data-qc="cat" data-i="${i}">${pkgOpts(p.cat)}</select><button class="cIconBtn sm" data-c="qtRec" data-i="${i}" title="Recommended" aria-label="Mark as recommended">${cSvg('star')}</button>${Q.packages.length>1?`<button class="cIconBtn sm" data-c="qtPkDel" data-i="${i}" aria-label="Remove package">${cSvg('trash')}</button>`:''}</div>
     <div class="cGrid">${fld('Name',inp(`packages.${i}.name`,'Classic'))}${fld('Price (£)',inp(`packages.${i}.price`,'0','','number'))}${fld('Charged',per(`packages.${i}.period`))}${fld('Label under the price',inp(`packages.${i}.unit`,p.period==='one_off'?'one-off build':''))}
      ${fld('Monthly care (£)',inp(`packages.${i}.care`,'0','','number'))}${fld('Care is for',inp(`packages.${i}.careName`,'Hosting and care'))}${fld('One line about it',inp(`packages.${i}.tag`,'A high-end website that sells the bigger jobs.'),1)}</div></div>`).join('');
  const items=Q.items.map((it,i)=>`<div class="cQItem"><div class="cGrid">${fld('Included',inp(`items.${i}.n`,'High-end website redesign'))}${fld('From',`<select data-q="items.${i}.from" data-num="1">${Q.packages.map((p,k)=>`<option value="${k}" ${+it.from===k?'selected':''}>${cEsc(p.name||'Package '+(k+1))}${k<Q.packages.length-1?' and up':''}</option>`).join('')}</select>`)}${fld('Short line',inp(`items.${i}.s`,'Portfolio-led and built in Webflow.'),1)}${fld('More detail (shown in the breakdown)',ta(`items.${i}.m`,'',2),1)}</div><button class="cIconBtn sm cQDel" data-c="qtItemDel" data-i="${i}" aria-label="Remove">${cSvg('x')}</button></div>`).join('');
  const avail=catItems().filter(c=>c.kind!=='package'&&c.period!=='one_off');
  const addons=avail.map(c=>{const i=Q.addons.findIndex(a=>a.cat===c.id);const on=i>=0;return `<div class="cQAdd ${on?'on':''}"><button class="cQAddT" data-c="qtAdd" data-id="${c.id}"><span class="cQTick">${on?cSvg('check'):''}</span><b>${cEsc(c.name)}</b><small>${c.price!=null?pMoney(c.price)+' a month':'Price on request'}</small></button>${on?`<div class="cGrid">${fld('Price (£ a month)',inp(`addons.${i}.m`,'0','','number'))}${fld('Group',inp(`addons.${i}.g`,'Grow'))}${fld('One line',inp(`addons.${i}.d`,''),1)}${fld('What they get (one per line)',`<textarea data-q="addons.${i}.li" data-lines="1" rows="3">${cEsc((Q.addons[i].li||[]).join('\n'))}</textarea>`,1)}</div>`:''}</div>`;}).join('');
  const link=q&&q.status!=='draft'?QUOTE_URL(q.token):'';
  const qs=q?qevSum(q.id):null,vc=Math.max(q?q.view_count||0:0,qs?qs.visits:0);
  const st=q?(q.status==='accepted'?`Accepted: ${q.accepted_choice||''}`:q.status==='draft'?'Draft':vc?`Opened ${vc} time${vc===1?'':'s'}`:'Sent, not opened yet'):'Not saved yet';
  return `<div class="crmScrim add" data-c="sheetClose"></div><div class="crmAdd cSheet wide tall cQuote" role="dialog" aria-label="Quote">
   <div class="crmAddHead"><span class="cEvIc">${cSvg('doc')}</span><div><h3>Quote for ${cEsc(r.business||Q.business||'')}</h3><p>${cEsc(st)}${q&&q.has_pw?' · password protected':''}</p></div><button class="cIconBtn sm" data-c="sheetClose" aria-label="Close">${cSvg('x')}</button></div>
   <div class="cSetBody" data-scroll="quote">
    ${q?qtUsageHtml(q):''}
    ${link?`<div class="cQLink">${cSvg('link')}<input readonly value="${cEsc(link)}" aria-label="Quote link"><button class="cPillBtn" data-c="qtCopy">${cSvg('copy')}Copy</button><a class="cPillBtn" href="${cEsc(link)}&peek=1" target="_blank" rel="noopener">Open</a></div>`:''}
    <div class="cSetGroup"><h4>Who it's for</h4><div class="cGrid">${fld('Greeting names',inp('greet','Helen and Bella'))}${fld('Business',inp('business','Nest Interiors'))}${fld('Short name (for "Recommended for …")',inp('short','Nest'))}${fld('Valid until',inp('validUntil','','','date'))}</div></div>
    <div class="cSetGroup"><h4>Top of the page</h4><div class="cGrid">${fld('Big line',inp('kicker','Three ways to launch Nest Interiors.'),1)}${fld('Intro',ta('lede','',2),1)}</div></div>
    <div class="cSetGroup"><h4>Packages <em>· 1 to 3, the switcher shows them side by side</em></h4>${pk}${Q.packages.length<3?`<button class="cMore" data-c="qtPkAdd">${cSvg('plus')} Add a package</button>`:''}</div>
    <div class="cSetGroup"><h4>What's included <em>· each line shows from its package upwards</em></h4>${items}<button class="cMore" data-c="qtItemAdd">${cSvg('plus')} Add a line</button></div>
    <div class="cSetGroup"><h4>Monthly services they can add</h4><div class="cQAdds">${addons}</div><label class="cF cCheck"><input type="checkbox" data-q="noSetup" ${Q.noSetup?'checked':''}><span class="cTog"></span><span>No set-up fees with a package</span></label></div>
    <div class="cSetGroup"><h4>Payment</h4><div class="cGrid">${fld('Payment terms (letter and PDF)',ta('payment','',2),1)}${fld('Note under the price (optional)',inp('spread','Prefer to spread it? We can split the build into 6 monthly payments.'),1)}${fld('Highlight title',inp('payplanTitle','Easier on cash flow?'))}${fld('Highlight text',inp('payplan','We’re happy to split the build into 6 monthly payments.'))}${fld('Receipt note',inp('receiptNote','6-month payment plan available'),1)}</div></div>
    <div class="cSetGroup"><h4>Letter</h4><div class="cGrid">${fld('Opening line',inp('letterThanks',''),1)}${fld('Paragraph',ta('intro','',3),1)}</div></div>
    <div class="cSetGroup"><h4>Terms <em>· one per line</em></h4><textarea class="cQTerms" data-q="terms" data-lines="1" rows="6">${cEsc((Q.terms||[]).join('\n'))}</textarea></div>
    <div class="cSetGroup"><h4>Thank you</h4><div class="cGrid">${fld('Title',inp('thanksTitle',''),1)}${fld('Message',ta('thanks','',3),1)}</div></div>
    <div class="cSetGroup"><h4>Password <em>· optional</em></h4><div class="cGrid">${fld('Password to open it',inp('pw','Leave empty for link only'))}<p class="cSetP">Send the password separately from the link. Changing it locks the page again.</p></div></div>
   </div>
   <div class="crmAddFoot cQFoot"><span class="cQSum">${cEsc(qtTotalHint(Q))}</span><span class="grow"></span><button class="crmGhost" data-c="qtSave" data-pub="0">Save draft</button><button class="crmPrimary" data-c="qtSave" data-pub="1">${q&&q.status!=='draft'?'Update the live quote':'Create the link'}${cSvg('arrow')}</button></div></div>`;}
function crmQuotesHtml(r){const l=quotesFor(r.id);const lab={draft:'Draft',sent:'Sent',viewed:'Opened',accepted:'Accepted'};
  return `<div class="cQList">${l.map(q=>`<button class="cQRow ${q.status}" data-c="qtOpen" data-id="${q.id}"><span class="cQIc">${cSvg('doc')}</span><span><b>${cEsc(q.title||'Quote')}</b><small>${lab[q.status]||q.status}${(()=>{const u=qevSum(q.id);return u.visits?` · opened ${u.visits}×${u.secs?' · '+cMins(u.secs):''} · ${cAgoT(u.last)}`:q.status==='viewed'?` · ${q.view_count} view${q.view_count===1?'':'s'}`:'';})()}${q.valid_until&&q.status!=='accepted'?(q.valid_until<G.today?' · ended':` · until ${pShortD(q.valid_until)}`):''}${q.status==='accepted'?` · ${cEsc(q.accepted_choice||'')}`:''} · ${pShortD((q.updated_at||q.created_at||'').slice(0,10))}</small></span>${q.status!=='draft'?`<span class="cQCopy" data-c="qtCopyRow" data-id="${q.id}" role="button" title="Copy link">${cSvg('copy')}</span>`:''}</button>`).join('')}
   <button class="cMore" data-c="qtNew">${cSvg('plus')} Make a quote</button></div>`;}
function qtRefresh(){const s=CRM.sheet;if(!s||s.type!=='quote')return;s.key='qt'+Date.now();crmRender();}
async function qtSave(pub){const s=CRM.sheet;const Q=s.Q;const r=PIPE.rows.find(x=>x.id===s.pid);if(!r)return;
  Q.packages.forEach(p=>{p.price=+p.price||0;p.care=+p.care||0;});Q.addons.forEach(a=>{a.m=+a.m||0;});
  if(!Q.packages.length||!Q.packages[0].name){toast('<b>Add at least one package</b> with a name and price first.','joke');return;}
  const pw=(Q.pw||'').trim();const has_pw=!!pw;const title=`${Q.packages.map(p=>p.name).join(' / ')}`.slice(0,80);
  const q=s.qid&&CDB.quo.find(x=>x.id===s.qid);const status=pub?(q&&q.status!=='draft'?q.status:'sent'):(q?q.status:'draft');
  crmSaved&&crmSaved('Saving…');
  let enc=null;if(has_pw&&pub){try{const pub_={...Q};delete pub_.pw;enc=await quoteEncrypt(pub_,pw);}catch(e){toast('<b>Couldn\'t lock it.</b> This browser can\'t encrypt.','joke');return;}}
  const row={title,data:Q,enc,has_pw,status,prospect_id:r.id,valid_until:Q.validUntil||null,updated_at:new Date().toISOString()};
  let saved;if(q){await cdbUpdate('quo',q.id,row);saved=CDB.quo.find(x=>x.id===q.id);}else{saved=await cdbInsert('quo',{...row,token:quoteTok(),created_by:S.me,view_count:0});}
  if(!saved)return;s.qid=saved.id;
  if(pub){const p=Q.packages.find(x=>x.rec)||Q.packages[0];const patch={quote_url:QUOTE_URL(saved.token),quote_value:p.price||null};crmSet(r.id,patch);pipeLog(r.id,'quote',{title});
    try{await navigator.clipboard.writeText(QUOTE_URL(saved.token));}catch(e){}
    toast(`<b>Quote link ready${has_pw?', locked':''}.</b> Copied to your clipboard.${['video_needed','video_made','messaged','followed_up','talking','meeting'].includes(r.stage)?` <button class="tLink" data-act="pQuoteStage" data-id="${r.id}">Move to Quote sent</button>`:''}`,'good');}
  else crmSaved&&crmSaved('Saved');
  qtRefresh();}
ACT.pQuoteStage=({id})=>{pMove(id,'quote_sent');};
Object.assign(CRM_ACT,{
  qtNew:()=>{if(CRM.open)qtOpen(CRM.open,null);},
  qtOpen:(b,e)=>{if(e.target.closest('[data-c=qtCopyRow]'))return;qtOpen(CRM.open,b.dataset.id);},
  qtCopyRow:b=>{const q=CDB.quo.find(x=>x.id===b.dataset.id);if(!q)return;try{navigator.clipboard.writeText(QUOTE_URL(q.token));}catch(e){}toast('<b>Quote link copied.</b>','good');},
  qtCopy:()=>{const q=CDB.quo.find(x=>x.id===CRM.sheet.qid);if(!q)return;try{navigator.clipboard.writeText(QUOTE_URL(q.token));}catch(e){}toast('<b>Quote link copied.</b>','good');},
  qtFrom:b=>{CRM.sheet.Q.from=b.dataset.p;b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));cPills(b.parentElement.parentElement);},
  qtRec:b=>{const Q=CRM.sheet.Q;const i=+b.dataset.i;Q.packages.forEach((p,k)=>p.rec=k===i?!p.rec:false);qtRefresh();},
  qtPkAdd:()=>{const Q=CRM.sheet.Q;const n=['Classic','Executive','Prestige'][Q.packages.length]||'Package';Q.packages.push({name:n,price:0,period:Q.packages[0].period,care:Q.packages[0].care||0,careName:Q.packages[0].careName||'',tag:'',rec:false});qtRefresh();},
  qtPkDel:b=>{const Q=CRM.sheet.Q;const i=+b.dataset.i;Q.packages.splice(i,1);Q.items.forEach(it=>{if(+it.from>=Q.packages.length)it.from=Q.packages.length-1;});qtRefresh();},
  qtItemAdd:()=>{CRM.sheet.Q.items.push({n:'',s:'',m:'',from:0});qtRefresh();setTimeout(()=>{const l=document.querySelectorAll('#crm .cQItem input[data-q$=".n"]');if(l.length)l[l.length-1].focus();},60);},
  qtItemDel:b=>{CRM.sheet.Q.items.splice(+b.dataset.i,1);qtRefresh();},
  qtAdd:b=>{const Q=CRM.sheet.Q;const id=b.dataset.id;const i=Q.addons.findIndex(a=>a.cat===id);if(i>=0)Q.addons.splice(i,1);else{const c=catBy(id);const d=QT_ADDON[id]||{};Q.addons.push({cat:id,n:c.name.replace(/^Social Media: /,'Social '),m:c.price||0,g:d.g||(/^soc_/.test(id)?'Social':'Grow'),d:d.d||c.note||'',li:d.li||[]});}qtRefresh();},
  qtSave:b=>qtSave(b.dataset.pub==='1'),
});
// typing in the quote form updates the quote without redrawing it
function crmQuoteBind(el){
  const upd=t=>{const s=CRM.sheet;if(!s||s.type!=='quote')return;const p=t.dataset.q;if(!p)return;let v=t.type==='checkbox'?t.checked:t.value;if(t.dataset.lines)v=v.split('\n').map(x=>x.trim()).filter(Boolean);else if(t.type==='number'||t.dataset.num)v=v===''?0:+v;qtSet(s.Q,p,v);
    const sum=document.querySelector('#crm .cQSum');if(sum)sum.textContent=qtTotalHint(s.Q);};
  el.addEventListener('input',e=>{if(e.target.closest('.cQuote'))upd(e.target);});
  el.addEventListener('change',e=>{const t=e.target;if(!t.closest('.cQuote'))return;if(t.dataset.qc==='cat'){const c=catBy(t.value);const p=CRM.sheet.Q.packages[+t.dataset.i];if(c){const i=+t.dataset.i;Object.assign(p,{cat:c.id,name:c.name.replace(/ package$/i,''),price:c.price||0,period:c.period});if(!p.tag&&c.note&&c.note.length<90)p.tag=c.note;
      const Q=CRM.sheet.Q;if(c.kind==='package'&&c.note){const have=new Set(Q.items.map(x=>(x.n||'').toLowerCase()));c.note.split(/,\s*/).filter(Boolean).forEach(n=>{const nm=n.charAt(0).toUpperCase()+n.slice(1);if(!have.has(nm.toLowerCase()))Q.items.push({n:nm,s:'',m:'',from:i});});}}qtRefresh();return;}
    upd(t);if(/^packages\.\d+\.(period|name)$/.test(t.dataset.q||''))qtRefresh();});}

function qtUsageHtml(q){const u=qevSum(q.id);const exp=q.valid_until&&q.status!=='accepted'&&q.valid_until<G.today;
  if(!u.n)return `<div class="cQUse empty">${cSvg('trend')}<span><b>${q.status==='draft'?'Not sent yet':'Not opened yet'}</b><small>${q.status==='draft'?'Create the link to share it.':'You\'ll see here when they open it, what they look at and for how long.'}${q.valid_until?` Valid until ${pShortD(q.valid_until)}${exp?' (ended)':''}.`:''}</small></span></div>`;
  const chips=o=>Object.entries(o).sort((a,b)=>b[1]-a[1]).map(([n,c])=>`<span class="cQChip">${cEsc(n)}<i>${c}</i></span>`).join('')||'<span class="cSetP" style="margin:0">None yet</span>';
  const lab={open:'Opened the quote',package:'Looked at',addon:'Added',breakdown:'Opened the breakdown',terms:'Read the terms',print:'Printed it',pdf:'Downloaded the PDF',copy:'Copied the plan',time:'Spent',email:'Copied your email',accept:'Accepted'};
  const line=e=>{const d=e.detail||{};const what=e.kind==='package'?`${lab.package} ${d.name}`:e.kind==='addon'?`${d.on?'Added':'Removed'} ${d.name}`:e.kind==='time'?`Spent ${cMins(+d.s||0)}${d.scroll?` · scrolled ${d.scroll}%`:''}`:e.kind==='open'?`${lab.open}${d.dev?' on a '+d.dev:''}${d.back?' again':''}`:e.kind==='accept'?`Accepted: ${d.choice||''}`:(lab[e.kind]||e.kind);return `<li><span class="cQDot k-${e.kind}"></span><div>${cEsc(what)}<small>${cEsc(cAgoT(e.at))}</small></div></li>`;};
  return `<div class="cQUse">
   <div class="cQUseTop"><div><small>Visits</small><b>${u.visits}</b></div><div><small>Time on it</small><b>${cMins(u.secs)}</b></div><div><small>Last seen</small><b>${cEsc(cAgoT(u.last))}</b></div><div><small>Device</small><b>${cEsc(u.dev.join(', ')||'–')}</b></div></div>
   <div class="cQUseRow"><small>Packages they looked at</small><div>${chips(u.pk)}</div></div><div class="cQUseRow"><small>Services they tried</small><div>${chips(u.ad)}</div></div>
   <div class="cQUseFlags">${[['print','Printed'],['pdf','Downloaded PDF'],['breakdown','Opened breakdown'],['terms','Read terms']].map(([k,n])=>`<span class="${u[k]?'on':''}">${u[k]?cSvg('check'):''}${n}</span>`).join('')}${q.valid_until?`<span class="${exp?'bad':''}">${exp?'Ended':'Valid until'} ${pShortD(q.valid_until)}</span>`:''}</div>
   <details class="cQUseLog"><summary>Everything they did</summary><ol>${u.l.slice().reverse().slice(0,40).map(line).join('')}</ol></details></div>`;}
