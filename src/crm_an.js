/* ============================== 23 Nov: analytics ==============================
   How outreach turns into clients and money. Everything comes from the pipeline's own history: prospects, stage moves,
   calendar events, quotes and payments. Period switch at the top; charts follow the Funnal palette (checked for colour
   blindness and contrast), with hover tips and a legend wherever there is more than one series. */
CRM.an={p:'90'};
const CRM_AN={ev:null,loading:false};
Object.assign(cIcon,{chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',trend:'M3 17l6-6 4 4 8-8M15 7h6v6'});
const AN_COL={light:['#3E6AAE','#D3962A','#C2405A'],dark:['#4F7FC4','#BD8628','#D45A70']};
const anDark=()=>typeof hcTheme==='function'&&hcTheme()==='dark';
function anLoad(){if(CRM_AN.ev||CRM_AN.loading)return;CRM_AN.loading=true;
  if(PIPE.src==='supa'){S.sb.from('hl_prospect_events').select('prospect_id,by,kind,detail,at').in('kind',['stage','created','quote','paid']).gte('at',new Date(Date.now()-420*864e5).toISOString()).order('at',{ascending:true}).limit(20000)
    .then(({data})=>{CRM_AN.ev=data||[];CRM_AN.loading=false;if(CRM.view==='analytics')crmRender();},()=>{CRM_AN.ev=[];CRM_AN.loading=false;});}
  else{const all=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf('hl_pipe_ev_')===0)JSON.parse(localStorage.getItem(k)||'[]').forEach(e=>all.push(e));}}catch(e){}CRM_AN.ev=all;CRM_AN.loading=false;}}
const anDay=s=>(s||'').slice(0,10);
function anRange(p){const t=G.today;if(p==='all')return [ '2000-01-01',t];const n=+p;return [addDays(t,-(n-1)),t];}
function anPrev(p){if(p==='all')return null;const n=+p;return [addDays(G.today,-(2*n-1)),addDays(G.today,-n)];}
const inR=(d,r)=>d&&d>=r[0]&&d<=r[1];
function anStats(r){const ev=CRM_AN.ev||[];const rows=PIPE.rows;
  const moves=ev.filter(e=>e.kind==='stage'&&inR(anDay(e.at),r));const to=k=>moves.filter(e=>e.detail&&e.detail.to===k).length;
  const meet=evLive().filter(e=>(e.kind==='meeting'||e.kind==='call')&&inR(evDay(e),r)).length;
  const qs=CDB.quo.filter(q=>q.status!=='draft'&&inR(anDay(q.created_at),r));
  return {added:rows.filter(x=>inR(anDay(x.created_at),r)).length,msg:to('messaged'),fu:to('followed_up'),talk:to('talking'),meet:Math.max(meet,to('meeting')),
    quotes:qs.length,accepted:qs.filter(q=>q.status==='accepted').length,opened:qs.filter(q=>q.status==='viewed'||q.status==='accepted').length,
    won:rows.filter(x=>inR(x.won_at,r)).length,cash:CDB.pay.filter(p=>inR(anDay(p.paid_at),r)).reduce((a,p)=>a+(+p.amount||0),0)};}
function anDelta(cur,prev){if(prev==null)return '';if(!prev&&!cur)return '<span class="cDelta">no change</span>';if(!prev)return '<span class="cDelta up">new</span>';const p=Math.round((cur-prev)/prev*100);return `<span class="cDelta ${p>0?'up':p<0?'down':''}">${p>0?'↑':p<0?'↓':''} ${Math.abs(p)}%</span>`;}
// time buckets for the activity chart
function anBuckets(p){const t=G.today;const out=[];
  if(p==='30'||p==='90'){const n=p==='30'?5:13;const mon=addDays(t,-cDow(t));for(let i=n-1;i>=0;i--){const a=addDays(mon,-7*i);out.push({a,b:addDays(a,6),lab:pShortD(a)});}}
  else{const n=12;for(let i=n-1;i>=0;i--){const ym=cYm(t.slice(0,7),-i);out.push({a:ym+'-01',b:addDays(cYm(ym,1)+'-01',-1),lab:new Date(ym+'-15T12:00:00Z').toLocaleDateString('en-GB',{month:'short',timeZone:'UTC'})});}}
  return out;}
function anBars(id,buckets,series,opt={}){const max=Math.max(1,...buckets.map((_,i)=>series.reduce((a,s)=>a+(s.v[i]||0),0)));const nice=anNice(max);
  const ticks=[0,nice/2,nice];const fmt=opt.money?pMoney:(v=>String(Math.round(v)));
  return `<div class="cChart" data-chart="${id}">
    <div class="cChartY">${ticks.slice().reverse().map(t=>`<span>${fmt(t)}</span>`).join('')}</div>
    <div class="cChartPlot">${ticks.map(t=>`<i class="cGridL" style="--y:${t/nice}"></i>`).join('')}
     <div class="cBarsRow" style="--n:${buckets.length}">${buckets.map((b,i)=>{const tot=series.reduce((a,s)=>a+(s.v[i]||0),0);
       const tip=`<b>${cEsc(b.tip||b.lab)}</b>`+series.map(s=>`<span><i style="--c:${s.c}"></i>${cEsc(s.n)}: ${fmt(s.v[i]||0)}</span>`).join('');
       return `<div class="cBarCol" data-tip="${cEsc(tip)}" tabindex="0" style="--i:${i}"><div class="cBarStack" style="--h:${tot/nice}">${series.map(s=>(s.v[i]?`<span class="cSeg ${s.cls||''}" style="--c:${s.c};flex:${s.v[i]}"></span>`:'')).reverse().join('')}</div><small>${cEsc(b.lab)}</small></div>`;}).join('')}</div></div>
    ${series.length>1||opt.legend?`<div class="cLegend">${series.map(s=>`<span><i class="${s.cls||''}" style="--c:${s.c}"></i>${cEsc(s.n)}</span>`).join('')}</div>`:''}</div>`;}
function anNice(m){const p=Math.pow(10,Math.floor(Math.log10(m)));const f=m/p;return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p;}


/* 23 Nov: DM numbers from the game (both of you together) */
function anDms(r){const out={dm:0,fu:0,resp:0,vid:0,meet:0,work:0,hit:0,best:0,bestD:null,days:0};if(typeof G==='undefined'||!G||!G.days)return out;const cfg=C();
  const first=Object.keys(G.days).filter(k=>Object.values(G.days[k].p||{}).some(x=>x.d)).sort()[0]||G.today;let d=r[0]<first?first:r[0];
  for(let i=0;i<800&&d<=r[1];i++,d=addDays(d,1)){const D=G.days[d];const w=isWork(d,cfg);if(w&&d<=G.today)out.work++;if(!D)continue;
    const sum=k=>Object.values(D.p||{}).reduce((a,x)=>a+(x[k]||0),0);const dm=sum('d');out.dm+=dm;out.fu+=sum('f');out.resp+=sum('r');out.vid+=sum('v');out.meet+=sum('m');if(dm)out.days++;
    if(D.hit)out.hit++;if(dm>out.best){out.best=dm;out.bestD=d;}}
  return out;}
function anDmBuckets(p){const t=G.today;if(p==='30'){const o=[];for(let i=29;i>=0;i--){const a=addDays(t,-i);o.push({a,b:a,lab:i%5===0||i===29?pShortD(a):'',tip:pShortD(a)});}return o;}return anBuckets(p);}
function crmAnalytics(rows){anLoad();const p=CRM.an.p;const r=anRange(p),pr=anPrev(p);const cur=anStats(r),prev=pr?anStats(pr):null;const C=AN_COL[anDark()?'dark':'light'];
  const periods=[['30','30 days'],['90','90 days'],['365','12 months'],['all','All time']];
  const cl=PIPE.rows.filter(x=>x.stage==='client');const mrr=Math.round(cl.reduce((a,x)=>a+pMonthly(x),0));const goal=pGoal();
  const tile=(i,ic,lab,val,fmt,d,foot,cls='')=>`<div ${cIn(i,'cStat '+cls)}><span class="cStatL">${cSvg(ic)}${lab}</span><b>${cNum(val,fmt)}</b><span class="cStatF">${d}${foot?` <span>${foot}</span>`:''}</span></div>`;
  const pv=k=>prev?anDelta(cur[k],prev[k]):'';const vs=prev?'vs the '+(p==='365'?'12 months':p+' days')+' before':'';
  // activity
  const bk=anBuckets(p);const ev=CRM_AN.ev||[];const cnt=(k,b)=>ev.filter(e=>e.kind==='stage'&&e.detail&&e.detail.to===k&&anDay(e.at)>=b.a&&anDay(e.at)<=b.b).length;
  const meetIn=b=>evLive().filter(e=>(e.kind==='meeting'||e.kind==='call')&&evDay(e)>=b.a&&evDay(e)<=b.b).length;
  const act=anBars('act',bk.map(b=>({...b,tip:`${p==='30'||p==='90'?'Week of ':''}${b.lab}`})),[{n:'First messages',c:C[0],v:bk.map(b=>cnt('messaged',b))},{n:'Follow-ups',c:C[1],v:bk.map(b=>cnt('followed_up',b))},{n:'Meetings and calls',c:C[2],v:bk.map(meetIn)}]);
  // money: 9 months back, this month, 2 ahead
  const mk=[];for(let i=-8;i<=3;i++){const ym=cYm(G.today.slice(0,7),i);mk.push({ym,a:ym+'-01',b:addDays(cYm(ym,1)+'-01',-1),lab:new Date(ym+'-15T12:00:00Z').toLocaleDateString('en-GB',{month:'short',timeZone:'UTC'}),fut:ym>G.today.slice(0,7)});}
  const got=mk.map(m=>CDB.pay.filter(x=>anDay(x.paid_at)>=m.a&&anDay(x.paid_at)<=m.b).reduce((a,x)=>a+(+x.amount||0),0));
  const due=mk.map(m=>{let s=0;cl.forEach(x=>payDates(x,m.ym===G.today.slice(0,7)?G.today:m.a,m.b).forEach(d=>{if(!payPaid(x,d))s+=+x.deal_value||0;}));return m.ym<G.today.slice(0,7)?0:s;});
  const money=anBars('money',mk.map(m=>({...m,tip:new Date(m.ym+'-15T12:00:00Z').toLocaleDateString('en-GB',{month:'long',year:'numeric',timeZone:'UTC'})})),[{n:'Paid',c:C[0],v:got},{n:'Still to come',c:C[0],v:due,cls:'ghost'}],{money:true,legend:true});
  // funnel for prospects added in the period
  const coh=PIPE.rows.filter(x=>p==='all'||inR(anDay(x.created_at),r));const reach=k=>coh.filter(x=>pReach(x)>=P_IDX[k]||(x.stage==='client'&&k)).length;
  const fst=[['Added',coh.length],['Messaged',reach('messaged')],['Followed up',reach('followed_up')],['Talking',reach('talking')],['Meeting',reach('meeting')],['Quote sent',reach('quote_sent')],['Client',coh.filter(x=>x.stage==='client').length]];
  const fmax=Math.max(1,fst[0][1]);
  const funnel=`<div class="cFun">${fst.map(([n,v],i)=>`<div class="cFunStep" style="--i:${i}"><span class="cFunLab">${n}</span><span class="cFunTrack"><i style="--w:${v/fmax*100}%"></i></span><b>${v}</b><small>${i&&fst[i-1][1]?Math.round(v/fst[i-1][1]*100)+'%':''}</small></div>`).join('')}</div>`;
  // quotes
  const qAll=CDB.quo.filter(q=>q.status!=='draft'&&(p==='all'||inR(anDay(q.created_at),r)));const qAcc=qAll.filter(q=>q.status==='accepted');
  const qVal=qAcc.map(q=>{const d=q.data||{};const pk=(d.packages||[]).find(x=>(q.accepted_choice||'').indexOf(x.name)===0)||(d.packages||[])[0]||{};return +pk.price||0;});
  const quotes=`<div class="cKV">${[['Sent',qAll.length,''],['Opened',qAll.filter(q=>q.status==='viewed'||q.status==='accepted').length,qAll.length?Math.round(qAll.filter(q=>q.status==='viewed'||q.status==='accepted').length/qAll.length*100)+'%':''],['Accepted',qAcc.length,qAll.length?Math.round(qAcc.length/qAll.length*100)+'%':''],['Average accepted',qVal.length?pMoney(qVal.reduce((a,b)=>a+b,0)/qVal.length):'–','']].map(([k,v,s])=>`<div><small>${k}</small><b>${v}</b>${s?`<em>${s}</em>`:''}</div>`).join('')}</div>`;
  // speed and drop-off
  const days=(a,b)=>Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/864e5);
  const wonR=PIPE.rows.filter(x=>x.won_at&&x.created_at&&(p==='all'||inR(x.won_at,r)));const close=wonR.length?Math.round(wonR.reduce((a,x)=>a+days(anDay(x.created_at),x.won_at),0)/wonR.length):null;
  const byP={};ev.filter(e=>e.kind==='stage').forEach(e=>{(byP[e.prospect_id]=byP[e.prospect_id]||[]).push(e);});
  const reply=[];Object.values(byP).forEach(l=>{const m=l.find(e=>e.detail&&e.detail.to==='messaged');const t=m&&l.find(e=>e.detail&&e.detail.to==='talking'&&e.at>m.at);if(t&&(p==='all'||inR(anDay(t.at),r)))reply.push(days(anDay(m.at),anDay(t.at)));});
  const talkers=PIPE.rows.filter(x=>pReach(x)>=P_IDX.talking);const fuAvg=talkers.length?(talkers.reduce((a,x)=>a+(x.follow_ups||0),0)/talkers.length):null;
  const lost={nn:PIPE.rows.filter(x=>x.stage==='not_now').length,nr:PIPE.rows.filter(x=>x.stage==='no_response').length};
  const speed=`<div class="cKV">${[['Days to win a client',close==null?'–':close,''],['Days from first message to a reply',reply.length?Math.round(reply.reduce((a,b)=>a+b,0)/reply.length):'–',''],['Follow-ups before they talk',fuAvg==null?'–':fuAvg.toFixed(1),''],['Parked',lost.nn+lost.nr,lost.nn+lost.nr?`${lost.nn} not now · ${lost.nr} no reply`:'']].map(([k,v,s])=>`<div><small>${k}</small><b>${v}</b>${s?`<em>${s}</em>`:''}</div>`).join('')}</div>`;
  // income by package or service
  const inc={};cl.forEach(x=>{const k=(x.package&&catBy(x.package)&&catBy(x.package).name)||(x.products||[])[0]||'Other';inc[k]=(inc[k]||0)+pMonthly(x);});const incL=Object.entries(inc).filter(e=>e[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,6);const imax=Math.max(1,...incL.map(e=>e[1]));
  const income=incL.length?`<div class="cHBars">${incL.map(([n,v],i)=>`<div class="cHBar" style="--i:${i}" data-tip="${cEsc(`<b>${cEsc(n)}</b><span>${pMoney(v)} a month</span>`)}" tabindex="0"><span>${cEsc(n)}</span><span class="cFunTrack"><i style="--w:${v/imax*100}%;--c:${C[0]}"></i></span><b>${pMoney(v)}</b></div>`).join('')}</div>`:`<p class="cSetP">Retainer clients show here once they have billing set.</p>`;
  // DMs (from the game)
  const dmC=anDms(r),dmP=pr?anDms(pr):null;const dbk=anDmBuckets(p);const dsum=(b,k)=>{let t=0;for(let d=b.a,i=0;d<=b.b&&i<40;d=addDays(d,1),i++){const D=G.days&&G.days[d];if(D)t+=Object.values(D.p||{}).reduce((a,x)=>a+(x[k]||0),0);}return t;};
  const dmChart=anBars('dms',dbk.map(b=>({...b,tip:b.tip||`${p==='90'?'Week of ':''}${b.lab}`})),[{n:'DMs',c:C[0],v:dbk.map(b=>dsum(b,'d'))},{n:'Follow-ups',c:C[1],v:dbk.map(b=>dsum(b,'f'))}]);
  const dmKV=`<div class="cKV cKV6">${[['DMs sent',fmtN(dmC.dm),dmP?anDelta(dmC.dm,dmP.dm):''],['A working day',dmC.work?Math.round(dmC.dm/dmC.work):'–','on average'],['Target hit',`${dmC.hit} of ${dmC.work}`,'working days'],['Best day',dmC.best||'–',dmC.bestD?pShortD(dmC.bestD):''],['Follow-ups',fmtN(dmC.fu),dmP?anDelta(dmC.fu,dmP.fu):''],['Responses',fmtN(dmC.resp),dmC.dm?`${(dmC.resp/dmC.dm*100).toFixed(1)}% of DMs`:'']].map(([k,v,sub])=>`<div><small>${k}</small><b>${v}</b>${sub?`<em>${sub}</em>`:''}</div>`).join('')}</div>`;
  const empty=!PIPE.rows.length&&!CDB.pay.length;
  return `<div class="cPage cAnalytics">
   <div ${cIn(0,'cHello')}><div><h1>Analytics</h1><p>${empty?'Numbers fill in as you use the pipeline.':`How outreach is turning into clients${p==='all'?'':', over the last '+(p==='365'?'12 months':p+' days')}.`}</p></div>
    <div class="cTabs" data-pill="anP">${periods.map(([k,n])=>`<button class="${p===k?'on':''}" data-c="anP" data-p="${k}">${n}</button>`).join('')}</div></div>
   <div class="cStats">${tile(1,'layers','New prospects',cur.added,'int',pv('added'),'')}${tile(2,'arrow','First messages',cur.msg,'int',pv('msg'),cur.fu?`${cur.fu} follow-ups`:'')}${tile(3,'cal','Meetings and calls',cur.meet,'int',pv('meet'),'')}${tile(4,'doc','Quotes sent',cur.quotes,'int',pv('quotes'),cur.accepted?`${cur.accepted} accepted`:'')}</div>
   <div class="cStats">${tile(5,'star','Clients won',cur.won,'int',pv('won'),'','tint')}${tile(6,'money','Money in',cur.cash,'money',pv('cash'),'')}${tile(7,'trend','Monthly income now',mrr,'money',`<span class="cMiniBar"><i style="--w:${Math.min(100,Math.round(mrr/goal*100))}%"></i></span>${Math.min(999,Math.round(mrr/goal*100))}% of ${pMoney(goal)}`,'','ink')}${tile(8,'target','Messages to a client',cur.won?Math.round(cur.msg/cur.won):0,'int',cur.won?'first messages per client won':'needs a win in this period','')}</div>
   ${vs?`<p class="cVs">Arrows compare with the ${p==='365'?'12 months':p+' days'} before.</p>`:''}
   <div class="cAnGrid">
    <section ${cIn(9,'cPanel cAnWide')}><header class="cPanelH"><div><h3>DMs</h3><p>From the game, both of you together · ${p==='30'?'day by day':p==='90'?'week by week':'month by month'}</p></div></header>${dmKV}${dmChart}</section>
    <section ${cIn(9,'cPanel cAnWide')}><header class="cPanelH"><div><h3>Outreach</h3><p>${p==='30'||p==='90'?'Week by week':'Month by month'}</p></div></header>${CRM_AN.ev?act:'<div class="crmLoading"><i></i><i></i><i></i></div>'}</section>
    <section ${cIn(10,'cPanel cAnWide')}><header class="cPanelH"><div><h3>Money in</h3><p>Payments marked paid, and what is still due from current clients</p></div></header>${money}</section>
    <section ${cIn(11,'cPanel')}><header class="cPanelH"><div><h3>From prospect to client</h3><p>${p==='all'?'Everyone in the pipeline':'Prospects added in this period'}, and how far they got</p></div></header>${funnel}</section>
    <section ${cIn(12,'cPanel')}><header class="cPanelH"><div><h3>Quotes</h3><p>Links sent from the quote maker</p></div></header>${quotes}<header class="cPanelH cSubP"><div><h3>Speed and drop-off</h3></div></header>${speed}</section>
    <section ${cIn(13,'cPanel cAnWide')}><header class="cPanelH"><div><h3>Monthly income by package</h3><p>Current clients, 4-weekly billing counted as a monthly amount</p></div></header>${income}</section>
   </div></div>`;}
Object.assign(CRM_ACT,{anP:b=>{CRM.an.p=b.dataset.p;CRM.anim=true;crmRender();}});
// hover and focus tips on charts
(function(){let tip=null;const show=(el,x,y)=>{if(!tip){tip=document.createElement('div');tip.className='cTip';document.getElementById('crm').appendChild(tip);}tip.innerHTML=el.dataset.tip;tip.classList.add('on');const w=tip.offsetWidth,h=tip.offsetHeight;tip.style.left=Math.max(8,Math.min(innerWidth-w-8,x-w/2))+'px';tip.style.top=Math.max(8,y-h-12)+'px';};
  const hide=()=>{if(tip)tip.classList.remove('on');};
  document.addEventListener('pointerover',e=>{const el=e.target.closest&&e.target.closest('#crm [data-tip]');if(!el)return;const r=el.getBoundingClientRect();show(el,r.left+r.width/2,r.top);});
  document.addEventListener('pointerout',e=>{const el=e.target.closest&&e.target.closest('#crm [data-tip]');if(el&&!el.contains(e.relatedTarget))hide();});
  document.addEventListener('focusin',e=>{const el=e.target.closest&&e.target.closest('#crm [data-tip]');if(!el){hide();return;}const r=el.getBoundingClientRect();show(el,r.left+r.width/2,r.top);});
  document.addEventListener('scroll',hide,true);})();
