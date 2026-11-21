/* ============================== RECORDS AND THE GSHIP SHIP (Stage 6) ==============================
   Personal bests worked out from the event log, so old days count too. A Records card on Rivals compares both
   captains; a new record gets a banner and a line in the next Herald. In Lock In your best voyage of the same
   length sails beside you as a see-through ghost ship. */
const LOCK_BUCKETS=[15,25,45,60];
const bucketOf=ms=>{const m=(ms||0)/60000;return LOCK_BUCKETS.reduce((a,b)=>Math.abs(b-m)<Math.abs(a-m)?b:a,15);};
function lockDms(p,s,e){return G.evs.filter(x=>x.pid===p&&x.k==='d'&&x.t>=s&&x.t<=e).length;}
function captainRecords(p,until){if(!G)return null;const ck=p+'|'+(until||'')+'|'+G.evs.length+'|'+((G.players[p]||{}).sessions||[]).length;captainRecords._c=captainRecords._c||{};if(captainRecords._c[ck])return captainRecords._c[ck];
  const ts=G.evs.filter(e=>e.pid===p&&e.k==='d'&&(!until||e.date<=until)).sort((a,b)=>a.t-b.t);const byDay={};ts.forEach(e=>{(byDay[e.date]=byDay[e.date]||[]).push(e.t);});
  const R={};const fast=n=>{let best=null;for(const d in byDay){const l=byDay[d];if(l.length>=n){const v=l[n-1]-l[0];if(!best||v<best.v)best={v,date:d};}}return best;};R.fast25=fast(25);R.fast50=fast(50);
  let j=0,bh=null;for(let i=0;i<ts.length;i++){while(ts[i].t-ts[j].t>3600000)j++;const n=i-j+1;if(!bh||n>bh.v)bh={v:n,date:ts[i].date};}R.hour=bh;
  let run=null,st=0;for(let i=1;i<=ts.length;i++){if(i===ts.length||ts[i].t-ts[i-1].t>180000){const v=ts[i-1]?ts[i-1].t-ts[st].t:0;if(v>0&&(!run||v>run.v))run={v,date:ts[st].date};st=i;}}R.run=run;
  let bd=null;for(const d in byDay)if(!bd||byDay[d].length>bd.v)bd={v:byDay[d].length,date:d};R.day=bd;
  R.lock={};((G.players[p]||{}).sessions||[]).forEach(x=>{if(!x.s||!x.e)return;const d=L(x.s).date;if(until&&d>until)return;const b=bucketOf(x.planned||x.dur);const v=lockDms(p,x.s,x.e);if(!R.lock[b]||v>R.lock[b].v)R.lock[b]={v,date:d,ses:x};});
  captainRecords._c[ck]=R;return R;}
const fmtDur=ms=>{const m=Math.round(ms/60000);return m>=60?`${Math.floor(m/60)}h ${m%60}m`:`${m} min`;};
const REC_ROWS=[['fast25','Fastest 25 DMs',x=>fmtDur(x.v),true],['fast50','Fastest 50 DMs',x=>fmtDur(x.v),true],['hour','Best hour',x=>`${x.v} DMs`],['run','Longest unbroken run',x=>fmtDur(x.v)],['day','Best day',x=>`${x.v} DMs`]];
function recordsHtml(){const P=G.P;const R=Object.fromEntries(P.map(p=>[p,captainRecords(p)]));const cell=(p,k,f,low)=>{const x=R[p][k];if(!x)return '<td class="muted">–</td>';const o=R[P.find(q=>q!==p)][k];const win=o?(low?x.v<o.v:x.v>o.v):true;return `<td class="${win?'recWin':''}">${f(x)}<small>${shortDate(x.date)}</small></td>`;};
  const lockRows=LOCK_BUCKETS.map(b=>[`lock${b}`,`Best ${b}-min Lock In`]).filter(([k])=>P.some(p=>R[p].lock[+k.slice(4)]));
  return `<div class="card recCard"><h3>Records</h3><p class="tiny muted">Personal bests for speed and focus, from every DM you've logged.</p><table class="recTable"><tr><th></th>${P.map(p=>`<th>${pname(p)}</th>`).join('')}</tr>
   ${REC_ROWS.map(([k,n,f,low])=>`<tr><th>${n}</th>${P.map(p=>cell(p,k,f,low)).join('')}</tr>`).join('')}
   ${lockRows.map(([k,n])=>{const b=+k.slice(4);return `<tr><th>${n}</th>${P.map(p=>{const x=R[p].lock[b];if(!x)return '<td class="muted">–</td>';const o=R[P.find(q=>q!==p)].lock[b];return `<td class="${!o||x.v>o.v?'recWin':''}">${x.v} DMs<small>${shortDate(x.date)}</small></td>`;}).join('')}</tr>`;}).join('')}</table>
   <p class="tiny muted">In Lock In, your best voyage of the same length races you as a ghost ship.</p></div>`;}
{const _rv=SCREENS.rivals;SCREENS.rivals=function(){const h=_rv.apply(this,arguments);try{const x=recordsHtml();const i=h.indexOf('<div class="card');return i>=0?h.slice(0,i)+x+h.slice(i):h+x;}catch(e){return h;}};}
// a banner the moment a record falls (checked against what this phone last saw)
function recFlat(R){const o={};REC_ROWS.forEach(([k])=>{if(R[k])o[k]=R[k].v;});LOCK_BUCKETS.forEach(b=>{if(R.lock[b])o['lock'+b]=R.lock[b].v;});return o;}
setInterval(()=>{try{if(!G||!S.me)return;const R=captainRecords(S.me);const now=recFlat(R);let old=null;try{old=JSON.parse(localStorage.getItem('hl_rec_'+S.me)||'null');}catch(e){}localStorage.setItem('hl_rec_'+S.me,JSON.stringify(now));if(!old)return;
  for(const k in now){const low=k.startsWith('fast');const better=old[k]==null?false:(low?now[k]<old[k]:now[k]>old[k]);if(!better)continue;const row=REC_ROWS.find(r=>r[0]===k);const name=row?row[1]:`Best ${k.slice(4)}-min Lock In`;const val=row?row[2]({v:now[k]}):`${now[k]} DMs`;
    banner('NEW RECORD',`${name}: ${val}`);if(k.startsWith('lock'))toast(`<b>Ghost ship:</b> "${esc(((CT().lines||{}).ghostShip||{}).record||'')}"`,'joke');break;}}catch(e){}},15000);
function recordsSetOn(date){const out=[];if(!G)return out;G.P.forEach(p=>{const a=captainRecords(p,date),b=captainRecords(p,addDays(date,-1));REC_ROWS.forEach(([k,n,f,low])=>{const x=a[k],y=b[k];if(x&&x.date===date&&y&&(low?x.v<y.v:x.v>y.v))out.push(`${pnameRaw(p)}: ${n.toLowerCase()}, ${f(x)}`);});});return out;}

/* ---------- the ghost ship in Lock In ---------- */
const GSHIP={say:'',until:0,next:0,passed:false,lk:null};
function ghostFor(lk){if(!lk||!G)return null;const b=bucketOf(lk.dur);const sess=((G.players[S.me]||{}).sessions||[]).filter(x=>x.s&&x.e&&x.s!==lk.s&&bucketOf(x.planned||x.dur)===b);let best=null;sess.forEach(x=>{const v=lockDms(S.me,x.s,x.e);if(!best||v>best.v)best={v,x};});return best&&best.v>0?best:null;}
{const _dvG=drawVoyage;drawVoyage=function(c,t,lk,dms,progress){_dvG.apply(this,arguments);try{if(!lk||lk.mode==='coop'||lk.mode==='crewhunt')return;const g=ghostFor(lk);if(!g)return;const el=progress*lk.dur;const span=g.x.e-g.x.s,scale=span/Math.max(1,g.x.dur||span);
    const gd=G.evs.filter(x=>x.pid===S.me&&x.k==='d'&&x.t>=g.x.s&&x.t<=g.x.s+el*scale).length;const diff=gd-dms;if(diff<-20)return;
    const gx=90+clamp(diff*6,-60,170);const artG=typeof isArtLook==='function'&&isArtLook();c.save();if(artG){GSHIP.drawAt={gx,at:performance.now()};}else{c.globalAlpha=.4;try{drawShip(c,gx,138,.85,{...(S.players[S.me]||{}),hull:'hull_ghost'},t,{captain:false,phase:2});}catch(e){}}c.restore();
    const T=((CT().lines||{}).ghostShip)||{};const now=performance.now();if(GSHIP.lk!==lk.s){GSHIP.lk=lk.s;GSHIP.passed=false;GSHIP.next=now+8000;}
    if(diff<0&&!GSHIP.passed&&dms>3){GSHIP.passed=true;GSHIP.say=pickLine(T.passed,lk.s);GSHIP.until=now+4500;}else if(now>GSHIP.next){GSHIP.next=now+22000;GSHIP.say=diff>=3?pickLine(T.behind,lk.s+Math.floor(now/22000)):Math.abs(diff)<3?pickLine(T.close,1):'';GSHIP.until=now+4500;}
    if(GSHIP.say&&now<GSHIP.until){c.globalAlpha=.85;c.font='600 6.4px Fredoka, Nunito, sans-serif';const w=c.measureText(GSHIP.say).width+8;const bx=clamp(gx-w/2,4,W-w-4);rr(c,bx,96,w,11,4,'rgba(230,236,248,.9)');c.fillStyle='#3F5160';c.textAlign='left';c.fillText(GSHIP.say,bx+4,103.6);c.globalAlpha=1;}
    plainTxt(c,`Past you: ${gd}`,gx,artG?114:154,'rgba(240,244,252,.9)',artG?5:5.6);}catch(e){}};}

function plainTxt(c,s,x,y,col,size){c.save();c.font=`700 ${size}px Fredoka, Nunito, sans-serif`;c.textAlign='center';c.fillStyle='rgba(20,40,60,.35)';c.fillText(s,x+.4,y+.4);c.fillStyle=col;c.fillText(s,x,y);c.restore();}
