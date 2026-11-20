/* ============================== THE CAPTAIN'S LEDGER (analytics) ============================== */
const KK=['d','r','v','m','c','f'];
function blankC(){return{d:0,r:0,v:0,m:0,c:0,f:0};}
function rangeStats(a,b){const P=G.P;const o={team:blankC(),p:Object.fromEntries(P.map(p=>[p,blankC()])),tgt:0,wd:0,hit:0,days:[]};
  for(let d=a;d<=b;d=addDays(d,1)){const D=G.days[d];const tg=d<=G.today?targetFor(d):0;if(tg>0&&d<=G.today){o.tgt+=tg;if(d<G.today||D?.hit)o.wd++;if(D?.hit)o.hit++;}
    const row={d,tg,team:D?D.team:0,hit:!!D?.hit,p:Object.fromEntries(P.map(p=>[p,D?D.p[p]:blankC()]))};o.days.push(row);
    if(D)P.forEach(p=>KK.forEach(k=>{o.p[p][k]+=D.p[p][k]||0;o.team[k]+=D.p[p][k]||0;}));}
  o.pend=G.pendingConf.filter(e=>e.date>=a&&e.date<=b).length;return o;}
const pct=(a,b,dp=1)=>b?(a/b*100).toFixed(dp)+'%':'—';
function delta(a,b){if(!b)return a?'<span class="up">new</span>':'<span class="flat">—</span>';const d=(a-b)/b*100;return `<span class="${d>=0?'up':'down'}">${d>=0?'▲':'▼'} ${Math.abs(d).toFixed(0)}%</span>`;}
function svgBars(rows,opts){// rows: [{label, parts:[[val,col]], target, title}]
  const h=opts.h||160,bw=opts.bw||26,gap=opts.gap||10,pad=34,w=pad+rows.length*(bw+gap)+6;const max=Math.max(1,...rows.map(r=>Math.max(r.parts.reduce((a,x)=>a+x[0],0),r.target||0)));const top=10,ch=h-34;
  let s=`<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(opts.label||'chart')}">`;
  [0,.5,1].forEach(f=>{const y=top+ch-f*ch;s+=`<line x1="${pad}" x2="${w}" y1="${y}" y2="${y}" stroke="#EADFC6"/><text x="${pad-6}" y="${y+3.5}" fill="#7F8A95" font-size="10" text-anchor="end">${Math.round(max*f)}</text>`;});
  rows.forEach((r,i)=>{const X=pad+6+i*(bw+gap);let y=top+ch;r.parts.forEach(([v,col],j)=>{const hh=v/max*ch;y-=hh;s+=`<rect x="${X}" y="${y}" width="${bw}" height="${Math.max(0,hh)}" rx="${j===r.parts.length-1?5:0}" fill="${col}"><title>${esc(r.title||'')}</title></rect>`;});
    if(r.target){const ty=top+ch-r.target/max*ch;s+=`<line x1="${X-3}" x2="${X+bw+3}" y1="${ty}" y2="${ty}" stroke="#3F5160" stroke-width="2" stroke-dasharray="4 3"/>`;}
    if(r.mark)s+=`<circle cx="${X+bw/2}" cy="${top+4}" r="4" fill="${r.mark}"/>`;
    s+=`<text x="${X+bw/2}" y="${h-8}" fill="#7F8A95" font-size="10" text-anchor="middle">${esc(r.label)}</text>`;});
  return s+'</svg>';}
function svgLines(series,labels,opts){// series:[{vals,col,name,dash}]
  const n=labels.length;const h=opts.h||170,pw=opts.pw||Math.max(6,Math.min(18,560/n)),pad=34,w=pad+n*pw+10,top=10,ch=h-34;const all=series.flatMap(s=>s.vals.filter(v=>v!=null));const max=Math.max(1,opts.max||0,...all);
  let s=`<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(opts.label||'trend')}">`;
  [0,.5,1].forEach(f=>{const y=top+ch-f*ch;s+=`<line x1="${pad}" x2="${w}" y1="${y}" y2="${y}" stroke="#EADFC6"/><text x="${pad-6}" y="${y+3.5}" fill="#7F8A95" font-size="10" text-anchor="end">${opts.pct?Math.round(max*f)+'%':Math.round(max*f)}</text>`;});
  if(opts.target){const y=top+ch-opts.target/max*ch;s+=`<line x1="${pad}" x2="${w}" y1="${y}" y2="${y}" stroke="#3F5160" stroke-width="1.5" stroke-dasharray="4 3"/>`;}
  series.forEach(se=>{let d='',area='';se.vals.forEach((v,i)=>{if(v==null)return;const x=pad+6+i*pw,y=top+ch-v/max*ch;d+=(d?'L':'M')+x.toFixed(1)+' '+y.toFixed(1);});
    if(se.fill&&d){const xs=se.vals.map((v,i)=>v==null?null:pad+6+i*pw).filter(x=>x!=null);area=d+`L${xs[xs.length-1]} ${top+ch}L${xs[0]} ${top+ch}Z`;s+=`<path d="${area}" fill="${se.col}" opacity=".15"/>`;}
    s+=`<path d="${d}" fill="none" stroke="${se.col}" stroke-width="${se.w||2}" stroke-linejoin="round" stroke-linecap="round" ${se.dash?'stroke-dasharray="5 4"':''}/>`;
    const li=se.vals.map((v,i)=>[v,i]).filter(x=>x[0]!=null).pop();if(li&&!se.dash)s+=`<circle cx="${pad+6+li[1]*pw}" cy="${top+ch-li[0]/max*ch}" r="3.5" fill="${se.col}" stroke="#fff" stroke-width="1.5"/>`;});
  const step=Math.ceil(n/8);labels.forEach((l,i)=>{if(i%step===0)s+=`<text x="${pad+6+i*pw}" y="${h-8}" fill="#7F8A95" font-size="10" text-anchor="middle">${esc(l)}</text>`;});
  return s+'</svg>';}
function heatmapHtml(a,b,who){const grid=Array.from({length:7},()=>Array(14).fill(0));// hours 7..20
  G.evs.forEach(e=>{if(e.k!=='d'||e.date<a||e.date>b||(who!=='team'&&e.pid!==who))return;const h=Math.floor(e.min/60);if(h<7||h>20)return;grid[(wd(e.date)+6)%7][h-7]++;});
  const max=Math.max(1,...grid.flat());const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return `<div class="heat" role="img" aria-label="DMs by weekday and hour"><span></span>${Array.from({length:14},(_,i)=>`<span class="hh">${i%2?'':String(i+7).padStart(2,'0')}</span>`).join('')}
   ${grid.map((row,di)=>`<span class="hd">${days[di]}</span>`+row.map((v,hi)=>`<i style="background:rgba(224,96,52,${v?(.12+.88*v/max).toFixed(2):0})" title="${days[di]} ${hi+7}:00 · ${v} DMs"></i>`).join('')).join('')}</div>`;}
function bestPeriod(fn,list){let best=null;list.forEach(k=>{const v=fn(k);if(!best||v>best.v)best={k,v};});return best;}
SCREENS.ledger=()=>{
  const P=G.P;const view=S.view.led||'week';const tw=weekStart(G.today);
  const ws=S.view.ledWeek&&S.view.ledWeek<=tw?S.view.ledWeek:tw;const mo=S.view.ledMonth||G.today.slice(0,7);
  let a,b,pa,pb,title;
  if(view==='week'){a=ws;b=addDays(ws,6);pa=addDays(ws,-7);pb=addDays(ws,-1);title=`Week of ${shortDate(ws)}`;}
  else if(view==='month'){a=mo+'-01';const nm=new Date(Date.UTC(+mo.slice(0,4),+mo.slice(5,7),1)).toISOString().slice(0,10);b=addDays(nm,-1);const pm=new Date(Date.UTC(+mo.slice(0,4),+mo.slice(5,7)-2,1)).toISOString().slice(0,10);pa=pm;pb=addDays(a,-1);title=new Date(a+'T12:00:00Z').toLocaleDateString('en-GB',{month:'long',year:'numeric',timeZone:'UTC'});}
  else if(view==='q'){a=addDays(tw,-77);b=addDays(tw,6);pa=addDays(a,-84);pb=addDays(a,-1);title='Last 12 weeks';}
  else{const first=G.evs.length?G.evs[0].date:G.today;a=weekStart(first);b=G.today;pa=a;pb=addDays(a,-1);title='All time';}
  const R0=rangeStats(a,b),R1=rangeStats(pa,pb);const T=R0.team,T1=R1.team;
  const kpi=(n,v,pv,sub)=>`<div class="kpi"><small>${n}</small><b class="num">${v}</b>${sub?`<small>${sub}</small>`:''}${pv!=null?`<small>${pv}</small>`:''}</div>`;
  const nav=view==='week'?`<div class="navrow"><button class="btn sm" data-act="ledNav" data-d="-1" aria-label="Previous week">‹</button><b>${title}</b><button class="btn sm" data-act="ledNav" data-d="1" ${ws>=tw?'disabled':''} aria-label="Next week">›</button></div>`
    :view==='month'?`<div class="navrow"><button class="btn sm" data-act="ledNavM" data-d="-1" aria-label="Previous month">‹</button><b>${title}</b><button class="btn sm" data-act="ledNavM" data-d="1" ${mo>=G.today.slice(0,7)?'disabled':''} aria-label="Next month">›</button></div>`:`<div class="navrow"><b>${title}</b></div>`;
  let main='';
  if(view==='week'){
    main=`<div class="card"><h3>Day by day</h3><div class="chart" style="margin-top:6px">${svgBars(R0.days.map(r=>({label:DAYN[wd(r.d)],parts:P.map(p=>[r.p[p].d,pcolHex(p)]),target:r.tg,mark:r.tg?(r.hit?'#3FA57E':(r.d<G.today?'#D9485F':null)):null,title:`${shortDate(r.d)}: ${r.team}${r.tg?'/'+r.tg:''}`})),{label:'DMs per day this week',bw:30,gap:12})}</div>
     <div style="overflow-x:auto;margin-top:8px"><table class="lb"><thead><tr><th>Day</th>${P.map(p=>`<th style="color:${pcol(p)}">${pname(p)}</th>`).join('')}<th>Crew</th><th>Target</th><th>Resp</th><th>Video</th><th>Meet</th><th>Client</th><th>F-up</th></tr></thead><tbody>
     ${R0.days.map(r=>`<tr class="${r.d===G.today?'today':''}"><td>${DAYN[wd(r.d)]} ${shortDate(r.d)}</td>${P.map(p=>`<td>${r.p[p].d}</td>`).join('')}<td><b>${r.team}</b></td><td>${r.tg?(r.hit?'<span class="up">✓ '+r.tg+'</span>':r.d<G.today?'<span class="down">✗ '+r.tg+'</span>':r.tg):'<small>off</small>'}</td>${['r','v','m','c','f'].map(k=>`<td>${P.reduce((s,p)=>s+(r.p[p][k]||0),0)||''}</td>`).join('')}</tr>`).join('')}
     <tr class="tot"><td>Total</td>${P.map(p=>`<td>${fmtN(R0.p[p].d)}</td>`).join('')}<td>${fmtN(T.d)}</td><td>${fmtN(R0.tgt)}</td>${['r','v','m','c','f'].map(k=>`<td>${T[k]}</td>`).join('')}</tr></tbody></table></div></div>`;
  } else if(view==='month'){
    const first=new Date(a+'T12:00:00Z');const lead=(first.getUTCDay()+6)%7;const maxD=Math.max(1,...R0.days.map(r=>r.team));
    main=`<div class="card"><h3>Calendar</h3><div class="cal"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>${'<i></i>'.repeat(lead)}${R0.days.map(r=>`<i class="${r.tg?(r.hit?'hit':r.d<G.today?'miss':''):'off'} ${r.d===G.today?'now':''}" style="--a:${(r.team/maxD).toFixed(2)}" title="${shortDate(r.d)}: ${r.team} DMs${r.tg?' of '+r.tg:''}"><b>${+r.d.slice(8)}</b><small>${r.team||''}</small></i>`).join('')}</div>
     <div class="row tiny muted" style="margin-top:8px"><span><i class="dot" style="background:#3FA57E"></i>target hit</span><span><i class="dot" style="background:#D9485F"></i>missed</span><span>Darker = more DMs</span></div></div>`;
  } else {
    const weeks=[];for(let w=weekStart(a);w<=b;w=addDays(w,7))weeks.push(w);
    const wr=weeks.map(w=>{const s=rangeStats(w,addDays(w,6));return{w,s};});
    main=`<div class="card"><h3>Weekly DMs</h3><small>Stacked by captain; dashed line is the week's target</small><div class="chart" style="margin-top:6px">${svgBars(wr.map(x=>({label:shortDate(x.w),parts:P.map(p=>[x.s.p[p].d,pcolHex(p)]),target:x.s.tgt,title:`Week of ${shortDate(x.w)}: ${x.s.team.d} of ${x.s.tgt}`})),{label:'Weekly DMs',bw:weeks.length>20?14:26,gap:weeks.length>20?6:10})}</div></div>
     <div class="card"><h3>Hit rate and response rate by week</h3><div class="chart" style="margin-top:6px">${svgLines([{vals:wr.map(x=>x.s.wd?Math.round(x.s.hit/x.s.wd*100):null),col:'#3FA57E',name:'Target days hit',fill:true},{vals:wr.map(x=>x.s.team.d?+(x.s.team.r/x.s.team.d*100).toFixed(1):null),col:'#E06034',name:'Response rate'}],wr.map(x=>shortDate(x.w)),{pct:true,max:100,label:'Weekly hit rate and response rate',pw:weeks.length>20?14:36})}</div>
      <div class="row tiny"><span><i class="dot" style="background:#3FA57E"></i>% of working days the target was hit</span><span><i class="dot" style="background:#E06034"></i>responses per DM</span></div></div>`;
  }
  // daily trend with 7-day average (90 days)
  const dl=[];for(let i=89;i>=0;i--)dl.push(addDays(G.today,-i));const dv=dl.map(d=>isWork(d)||G.days[d]?.team?(G.days[d]?.team||0):null);const avg=dv.map((v,i)=>{const w=dv.slice(Math.max(0,i-6),i+1).filter(x=>x!=null);return w.length?+(w.reduce((s,x)=>s+x,0)/w.length).toFixed(1):null;});
  const who=S.view.heatWho||'team';
  const bestDay=bestPeriod(d=>G.days[d]?.team||0,Object.keys(G.days));const wks=[...new Set(Object.keys(G.days).map(weekStart))];const bestWeek=bestPeriod(w=>rangeStats(w,addDays(w,6)).team.d,wks);
  const months=[...new Set(Object.keys(G.days).map(d=>d.slice(0,7)))];const bestMonth=bestPeriod(m=>Object.keys(G.days).filter(d=>d.startsWith(m)).reduce((s,d)=>s+G.days[d].team,0),months);
  return `<div class="pad"><div class="row between"><h2>The Captain's Ledger</h2><button class="btn sm" data-act="csv">Copy CSV</button></div>
  <div class="seg">${[['week','Week'],['month','Month'],['q','12 weeks'],['all','All time']].map(([k,n])=>`<button class="${view===k?'on':''}" data-act="led" data-v="${k}">${n}</button>`).join('')}</div>
  ${nav}
  <div class="kpis">${kpi('Crew DMs',fmtN(T.d),view==='all'?null:delta(T.d,T1.d)+' vs previous',R0.tgt?`target ${fmtN(R0.tgt)} · ${pct(T.d,R0.tgt,0)}`:'')}${kpi('Target days hit',R0.wd?`${R0.hit}/${R0.wd}`:'—',null,R0.wd?pct(R0.hit,R0.wd,0):'')}${kpi('Responses',T.r,view==='all'?null:delta(T.r,T1.r),'rate '+pct(T.r,T.d))}${kpi('Videos sent',T.v,view==='all'?null:delta(T.v,T1.v))}${kpi('Meetings',T.m,view==='all'?null:delta(T.m,T1.m))}${kpi('Clients',T.c,view==='all'?null:delta(T.c,T1.c),R0.pend?`${R0.pend} awaiting confirmation`:'')}${kpi('Follow-ups',fmtN(T.f),view==='all'?null:delta(T.f,T1.f),T.d?`${(T.f/T.d*10).toFixed(1)} per 10 DMs`:'')}</div>
  ${main}
  <div class="card"><h3>Captain by captain</h3><div style="overflow-x:auto"><table class="lb" style="margin-top:6px"><thead><tr><th></th><th>DMs</th><th>Share</th><th>Resp.</th><th>Resp. rate</th><th>Video</th><th>Meet</th><th>Client</th><th>F-ups</th><th>Per 10 DMs</th></tr></thead><tbody>${P.map(p=>{const c=R0.p[p];return `<tr><td style="color:${pcol(p)}">${pname(p)}</td><td>${fmtN(c.d)}</td><td>${pct(c.d,T.d,0)}</td><td>${c.r}</td><td>${pct(c.r,c.d)}</td><td>${c.v}</td><td>${c.m}</td><td>${c.c}</td><td>${fmtN(c.f)}</td><td>${c.d?(c.f/c.d*10).toFixed(1):'—'}</td></tr>`;}).join('')}</tbody></table></div></div>
  ${fuLedgerCard()}
  <div class="card"><h3>Funnel (${esc(title.toLowerCase())})</h3><div class="funnel">${[['DMs',T.d,'#E06034'],['Responses',T.r,'#7CC7E6'],['Videos sent',T.v,'#9B7FD9'],['Meetings',T.m,'#5DBE9C'],['Clients',T.c,'#DDA94D']].map(([n,v,col],i,arr)=>`<div class="fstep"><span class="flab">${n}</span><span class="fbar"><i style="width:${T.d?Math.max(2,v/T.d*100):0}%;background:${col}"></i></span><b class="num">${fmtN(v)}</b><small>${i?pct(v,arr[i-1][1]):''}</small></div>`).join('')}</div>
   <p class="tiny muted">These are activity ratios between independent taps, not tracked prospects, so read them as a pulse check rather than exact conversion rates. Meetings and clients only count once confirmed by your crewmate.</p></div>
  <div class="card"><h3>Daily crew DMs · last 90 days</h3><div class="chart" style="margin-top:6px">${svgLines([{vals:dv,col:'#E9B48F',name:'Daily',w:1.4},{vals:avg,col:'#E06034',name:'7-day average',w:2.6,fill:true}],dl.map(d=>shortDate(d)),{target:G.cfg.target,label:'Daily crew DMs with 7-day average',pw:6})}</div>
   <div class="row tiny"><span><i class="dot" style="background:#E9B48F"></i>each working day</span><span><i class="dot" style="background:#E06034"></i>7-day average</span><span>dashed = daily target</span></div></div>
  <div class="card"><div class="row between"><h3>When you send DMs</h3><div class="seg mini">${[['team','Crew'],...P.map(p=>[p,C().players[p]?.name])].map(([k,n])=>`<button class="${who===k?'on':''}" data-act="heatWho" data-w="${k}">${esc(n)}</button>`).join('')}</div></div>${heatmapHtml(a,b,who)}<small>${esc(title)} · UK time</small></div>
  <div class="card"><h3>Records</h3><div class="grid3" style="margin-top:6px">${[['Best crew day',bestDay,k=>shortDate(k)],['Best week',bestWeek,k=>'w/c '+shortDate(k)],['Best month',bestMonth,k=>new Date(k+'-01T12:00:00Z').toLocaleDateString('en-GB',{month:'short',year:'numeric',timeZone:'UTC'})]].map(([n,x,f])=>`<div class="stat"><b class="num">${x?fmtN(x.v):'—'}</b><small>${n}${x?' · '+f(x.k):''}</small></div>`).join('')}</div></div>
  </div>`;
};
function csvText(){const P=G.P;const ds=Object.keys(G.days).sort();const head=['date','weekday','target','crew_dms',...P.flatMap(p=>KK.map(k=>`${p}_${KINDS[k].short.toLowerCase()}`))];
  return [head.join(','),...ds.map(d=>{const D=G.days[d];return [d,DAYN[wd(d)],D.target||0,D.team,...P.flatMap(p=>KK.map(k=>D.p[p][k]||0))].join(',');})].join('\n');}
