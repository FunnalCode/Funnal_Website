/* ============================== 22 Nov: the big dialogue haul ==============================
   About 1,600 new lines live in the content file (lines.d8). This file decides who says what and when:
   - lines come round in a fixed order shared by both captains, so the same pool can't repeat for about a month
   - some lines use what really happened (yesterday, your best day, who's ahead, a client you just logged)
   - Gary and Bill have stories told a chapter a week, and some gags get worse (better) every time
   - new speakers: Pell on his barge, the fence at the Black Market, Crab, six townsfolk in Funnal Cove,
     every monster when it appears and when it's hit, your pets, the curses and the client pipeline. */
const D8=()=>((CT().lines||{}).d8)||{};
const DL_START='2026-11-23';
const dlDay=d=>Math.round((Date.parse((d||G.today)+'T12:00:00Z')-Date.parse('2026-01-05T12:00:00Z'))/864e5);
const dlWeek=d=>Math.max(0,Math.floor((Date.parse(weekStart(d||G.today)+'T12:00:00Z')-Date.parse(weekStart(DL_START)+'T12:00:00Z'))/6048e5));
const _dlPerms={};
function dlPerm(len,key){const k=key+'|'+len;if(_dlPerms[k])return _dlPerms[k];const a=[...Array(len).keys()];for(let i=len-1;i>0;i--){const j=h32(key+':'+i)%(i+1);[a[i],a[j]]=[a[j],a[i]];}return _dlPerms[k]=a;}
// the line for this pool on this day and slot: each day takes `per` consecutive lines from a fixed shuffle
function dlPick(arr,key,slot=0,per=4,date){if(!arr||!arr.length)return '';const L=arr.length;const p=dlPerm(L,key);const n=dlDay(date)*per+(((slot%per)+per)%per);return arr[p[((n%L)+L)%L]];}
function dlRand(arr){return arr&&arr.length?arr[Math.floor(Math.random()*arr.length)]:'';}
const dlChip=()=>Math.max(1,dlDay()-dlDay('2026-10-13'));

/* ---------- 1. fold the new lines into the pools the game already reads ---------- */
(function(){const d=D8(),L=CT().lines||{};const fold=(dst,src,keys)=>{if(!dst||!src)return;keys.forEach(k=>{if(Array.isArray(src[k])&&src[k].length){if(!Array.isArray(dst[k]))dst[k]=[];src[k].forEach(x=>{if(!dst[k].includes(x))dst[k].push(x);});}});};
  fold(L.gary,d.gary,['morning','fast','slow','hit','miss','boss','fish','weekend','poke','night','storm','nest','legend','complaints']);
  fold(L.bill,d.bill,['gossip','alone','both','fire','night','storm','gossipHit','gossipMiss','gossipFish','switchIn']);
  fold(L.herald,d.herald,['forecast','ads','columns','mrsB']);
  if(L.ghostShip&&d.curses&&d.curses.ghostShip){const g=d.curses.ghostShip;L.ghostShip.behind=(L.ghostShip.behind||[]).concat(g.slice(0,6));L.ghostShip.close=(L.ghostShip.close||[]).concat(g.slice(6,8));L.ghostShip.passed=(L.ghostShip.passed||[]).concat(g.slice(8));}
  try{if(typeof MOOD_LINES!=='undefined'&&d.boss)['smug','panic','beg','sulk','dead','early'].forEach(k=>{if(MOOD_LINES[k]&&d.boss[k])d.boss[k].forEach(x=>{if(!MOOD_LINES[k].includes(x))MOOD_LINES[k].push(x);});});}catch(e){}})();

/* ---------- 2. Gary: no repeats, plus lines that remember ---------- */
garyLine=function(cat,seed,extra){const l=GL()[cat]||(D8().gary||{})[cat];if(!l||!l.length)return '';const s=String(seed);
  const line=cat==='poke'?l[h32(s)%l.length]:dlPick(l,'gary.'+cat,0,1);return fill(line,garyVars(extra));};
function dlFacts(){const o={};try{if(!G||!S.me)return o;const me=G.players[S.me],ot=other(S.me);const wd=G.workdays.filter(d=>d<G.today&&G.days[d]&&G.days[d].target);const yd=wd[wd.length-1],yd2=wd[wd.length-2];
  if(yd&&G.days[yd]){const D=G.days[yd];o.ydTeam=D.team||0;o.yHit=D.target>0&&D.team>=D.target;o.yMiss=D.target>0&&D.team<D.target;
    const a=x=>((G.days[x]||{}).p||{})[S.me]?.d||0,b=x=>((G.days[x]||{}).p||{})[ot]?.d||0;
    if(yd2&&G.days[yd2]){if(b(yd)>a(yd)&&b(yd2)>a(yd2))o.otherAhead=true;if(a(yd)>b(yd)&&a(yd2)>b(yd2))o.meAhead=true;}o.gap=Math.abs(b(yd)-a(yd));
    const best=(me.m&&me.m.bestDay)||0;if(best>=20&&a(yd)===best)o.best=best;}
  const st=me.curStreak||me.streak||0;if(st>=3)o.streak=st;
  const today=G.evs.filter(e=>e.date===G.today&&e.pid===S.me);if(today.some(e=>e.k==='c'))o.client=true;else if(today.some(e=>e.k==='m'))o.meeting=true;
  const pl=S.players[S.me]||{};if(pl.curse&&typeof curseOf==='function'&&curseOf(S.me,pl))o.curse=true;}catch(e){}return o;}
{const _gv=garyVars;garyVars=function(extra){const f=dlFacts();return _gv.call(this,Object.assign({ydTeam:f.ydTeam||0,gap:f.gap||0,streak:f.streak||0,best:f.best||0,chip:dlChip()},extra||{}));};}
// the special lines take one slot in three, so the everyday commentary still comes through
{const _gs=garySituation;garySituation=function(){const base=_gs.apply(this,arguments);try{if(!G||!S.me||base==='night'||base==='legend')return base;const hr=Math.floor(L().min/60);const slot=(h32(G.today+'dl')+hr)%3;if(slot!==0)return base;
  const f=dlFacts();const wd=new Date(G.today+'T12:00:00Z').getUTCDay();const opts=[];
  if(f.client)opts.push('client');if(f.meeting)opts.push('meeting');
  if(hr<12&&wd>=1&&wd<=4)opts.push('chapter');if(wd===4)opts.push('gag');
  if(f.best)opts.push('best');if(f.otherAhead)opts.push('otherAhead');if(f.meAhead)opts.push('meAhead');if(f.streak)opts.push('streak');
  if(hr<13){if(f.yHit)opts.push('yHit');if(f.yMiss)opts.push('yMiss');}if(f.curse)opts.push('curse');opts.push('crab');
  return opts.length?opts[(h32(G.today+hr)>>>3)%opts.length]:base;}catch(e){return base;}};}
{const _gl=garyLine;garyLine=function(cat,seed,extra){const d=D8().gary||{};
  if(cat==='chapter'){const ch=d.chapters||[];if(!ch.length)return '';const c=ch[dlWeek()%ch.length];const wd=new Date(G.today+'T12:00:00Z').getUTCDay();return fill(c[Math.max(0,Math.min(c.length-1,wd-1))],garyVars(extra));}
  if(cat==='gag'){const g=d.gag||[];return g.length?fill(g[Math.min(g.length-1,dlWeek())],garyVars(extra)):'';}
  if(cat==='crab'){const l=(D8().crab||{}).lines;if(Math.random()<.5&&l&&l.length)return 'Crab, from under the jetty: '+fill(dlPick(l,'crab',h32(String(seed)),3),garyVars(extra));return fill(dlPick(d.crab,'gary.crab',h32(String(seed)),2),garyVars(extra));}
  return _gl.call(this,cat,seed,extra);};}

/* ---------- 3. Bill: cocktails, his running tab gag, and a story a chapter a week ---------- */
const TV_RECENT=[];{const _tn0=tvNextLine;const _tn=function(){let x='';for(let i=0;i<6;i++){x=_tn0.apply(this,arguments);if(!TV_RECENT.includes(x))break;}TV_RECENT.push(x);if(TV_RECENT.length>40)TV_RECENT.shift();return x;};tvNextLine=function(){const d=D8().bill||{};try{if(!tvOpenNow())return _tn.apply(this,arguments);const r=Math.random();const v=tvVars();const sub=l=>fill(l,v);
  if(r<.14&&d.chapters){const c=d.chapters[dlWeek()%d.chapters.length];TVS.chap=((TVS.chap||0)%c.length);return sub(c[TVS.chap++]);}
  if(r<.24&&d.cocktail)return sub(dlPick(d.cocktail,'bill.ck',Math.floor(Date.now()/600000),3));
  if(r<.29&&d.tab)return sub(d.tab[Math.min(d.tab.length-1,dlWeek())]);
  if(r<.34&&d.quote&&typeof PIPE!=='undefined'&&PIPE.rows&&PIPE.rows.some(x=>x.stage==='quote_sent'))return sub(dlRand(d.quote));
  if(r<.5&&d.any)return sub(dlRand(d.any));}catch(e){}return _tn.apply(this,arguments);};}

/* ---------- 4. the Herald: corrections, letters and stop press ---------- */
{const _hs=SCREENS.herald;SCREENS.herald=function(){const h=_hs.apply(this,arguments);try{const d=D8().herald||{};const yd=G.workdays.filter(x=>x<G.today).pop()||G.today;const n=dlDay(yd);
  const corr=(d.corrections||[])[((n%(d.corrections||[1]).length)+(d.corrections||[1]).length)%(d.corrections||[1]).length];
  const letters=[...(d.letters||[]),...((D8().crab||{}).letters||[])];const lt=[dlPick(letters,'herald.lt',0,2,yd),dlPick(letters,'herald.lt',1,2,yd)].map(x=>fill(x,{chip:dlChip()}));
  const sp=dlPick(d.stopPress,'herald.sp',0,1,yd);const sec=(t,b)=>`<div><h3>${t}</h3>${b}</div>`;
  const add=`${sp?`<div class="hStop"><b>${esc(sp)}</b></div>`:''}${sec('Letters to the editor',lt.map(x=>`<p class="hLetter">${esc(x)}</p>`).join(''))}${corr?sec('Corrections',`<i>${esc(corr)}</i>`):''}`;
  const k='<div><h3>Classifieds</h3>';return h.includes(k)?h.replace(k,add+k):h;}catch(e){return h;}};}

/* ---------- 5. Pell on his barge ---------- */
const pellSay=k=>{const l=(D8().pell||{})[k];return l&&l.length?dlRand(l):'';};
{const _sb=ACT.s7Barge;ACT.s7Barge=function(){_sb.apply(this,arguments);const p=document.querySelector('#modal p.muted');const a=pellSay('arrive'),u=pellSay('upsell');if(p&&a)p.innerHTML=`"${esc(a)}"<br><small>"${esc(u)}"</small>`;
  const r=document.querySelector('#modal .row');if(r&&!r.querySelector('[data-act=pellHaggle]'))r.insertAdjacentHTML('afterbegin','<button class="btn ghost sm" data-act="pellHaggle">Haggle</button>');};}
ACT.pellHaggle=(d,el)=>{const p=document.querySelector('#modal p.muted');if(p)p.innerHTML=`"${esc(pellSay('haggle'))}"`;if(el){el.classList.remove('pPop');void el.offsetWidth;el.classList.add('pPop');}};
{const _by=ACT.buy;ACT.buy=async function(d){const mer=(typeof merchantToday==='function'&&merchantToday(G.today))||[];const isPell=mer.some(i=>i.id===d.id);const me=G.players[S.me];
  if(isPell&&me&&me.balance<(+d.p||0)){toast(`<b>Pell:</b> "${esc(pellSay('broke'))}"`,'joke',4200);return;}const out=await _by.apply(this,arguments);if(isPell&&G.players[S.me].owned[d.id])setTimeout(()=>toast(`<b>Pell:</b> "${esc(pellSay('buy'))}"`,'',4600),900);return out;};}
{const _hp=SCREENS.harbour;SCREENS.harbour=function(){const h=_hp.apply(this,arguments);try{const k="Pell's barge is in the harbour</b><br>";const i=h.indexOf(k);if(i<0)return h;const j=h.indexOf('</a>',i);const line=dlPick((D8().pell||{}).arrive,'pell.harbour',0,1);return line?h.slice(0,i+k.length)+`<small>"${esc(line)}"</small>`+h.slice(j):h;}catch(e){return h;}};}

/* ---------- 6. the fence at the Black Market: a new disguise every week ---------- */
bmSay=function(salt){const f=D8().fence||{};const s=String(salt);if(!S.bmSalt){const dz=f.disguises||[];if(dz.length)return fill(dz[Math.min(dz.length-1,dlWeek())],garyVars());}
  const pool=[...(f.deny||[]),...(f.sell||[]).slice(0,4)];return pool.length?fill(pool[h32(s)%pool.length],garyVars()):"I'm not Gary.";};

/* ---------- 7. Funnal Cove: word on the street ---------- */
const TOWNSFOLK=[['baker','Mrs Crumb, the baker'],['harbourmaster','Hobbs, the harbourmaster'],['nell','Nell, who mends the nets'],['lenny','Lenny, the lighthouse keeper'],['fergus','Fergus, the fishmonger'],['pike','Miss Pike, the schoolteacher'],['crab','Crab']];
function townHtml(){const t=D8().town||{};const day=dlDay();const who=dlPerm(TOWNSFOLK.length,'town.who'+day).slice(0,3).map(i=>TOWNSFOLK[i]);const vars=Object.assign(garyVars(),{chip:dlChip()});
  const quotes=who.map(([k,n],i)=>{const l=k==='crab'?(D8().crab||{}).lines:t[k];return l&&l.length?{n,q:fill(dlPick(l,'town.'+k,i,1),vars)}:null;}).filter(Boolean);
  try{const dm=TEAMDM();const op=VENTURES.filter(v=>dm>=v.dm).sort((a,b)=>b.dm-a.dm)[0];if(op&&t.landmark)quotes.unshift({n:'Overheard by the pier',q:fill(dlPick(t.landmark,'town.lm',0,1),{name:op.name})});else if(t.houses)quotes.unshift({n:'Overheard by the pier',q:dlPick(t.houses,'town.h',0,1)});}catch(e){}
  return `<div class="card townTalk"><h3>Word on the street</h3>${quotes.slice(0,4).map((x,i)=>`<div class="ttRow" style="--d:${i*80}ms"><p>"${esc(x.q)}"</p><small>${esc(x.n)}</small></div>`).join('')}</div>`;}
{const _cv=SCREENS.cove;SCREENS.cove=function(){const h=_cv.apply(this,arguments);try{const k='<div class="card"><h2>Funnal Cove</h2>';return h.includes(k)?h.replace(k,townHtml()+k):h;}catch(e){return h;}};}

/* ---------- 8. monsters: an opening line, and they react when hit ---------- */
{const _bs=bossSay;bossSay=function(force){try{const D=G.days[G.today];const ap=(D8().boss||{}).appear;if(force&&D&&D.boss&&!bossMood()&&ap&&ap.length&&Math.random()<.5){const now=Date.now();BUB.text=dlPick(ap,'boss.appear',0,1);BUB.until=now+6000;BUB.next=now+180000;return;}}catch(e){}return _bs.apply(this,arguments);};}
let DL_HITNEXT=0;
{const _cel=celebrate;celebrate=function(k,btn){_cel.apply(this,arguments);try{const now=Date.now();const d8=D8();
  if(k==='d'&&S.screen==='harbour'&&now>DL_HITNEXT&&Math.random()<.18&&d8.boss&&d8.boss.hit){const D=G.days[G.today];if(D&&D.boss&&D.team<D.target){BUB.text=dlRand(d8.boss.hit);BUB.until=now+3500;DL_HITNEXT=now+90000;}}
  if(['r','v','m','c'].includes(k)&&Math.random()<.45)petSay(k);}catch(e){}};}

/* ---------- 9. pets ---------- */
function petSay(){const pl=S.players[S.me]||{};const p=pl.pet&&PET_BY_ID[pl.pet];if(!p||PREFS.heckles===false)return;const d=D8().pets||{};const l=(d[p.sp]&&Math.random()<.7)?d[p.sp]:d.any;if(!l||!l.length)return;
  setTimeout(()=>toast(`<b>${esc(p.name)}:</b> ${esc(dlRand(l))}`,'',4200),1400);}

/* ---------- 10. curses ---------- */
if(typeof lvCurseShow==='function'){const _lcs=lvCurseShow;lvCurseShow=function(id,fresh){try{const l=(D8().curses||{})[id];if(l&&l.length&&CURSE_BY[id]){if(!CURSE_BY[id].line0)CURSE_BY[id].line0=CURSE_BY[id].line;CURSE_BY[id].line=fresh?CURSE_BY[id].line0:dlRand(l);}}catch(e){}return _lcs.apply(this,arguments);};}

/* ---------- 11. the pipeline ---------- */
function pQuip(to){const l=(D8().pipe||{})[to];return l&&l.length?dlRand(l):'';}
if(typeof P_REM_QUIPS!=='undefined'){const o=(D8().pipe||{}).overdue;if(o&&o.length){P_REM_QUIPS.length=0;o.forEach(x=>P_REM_QUIPS.push(x));}}
