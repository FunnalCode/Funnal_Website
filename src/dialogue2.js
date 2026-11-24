/* ============================== 24 Nov: Stage 9, the town comes alive ==============================
   Builds on dialogue.js. The words live in the content file (lines.d9); this decides who says what.
   1. About 370 more lines for Gary and Barnacle Bill, folded into the pools they already use, plus new ones:
      Gary's musings, gentle lines after a rough day, new weekly stories for both.
   2. Characters remember you: a prospect who's gone quiet, a client you won, your usual drink, what you bought,
      your best day, your streak, the fish you caught, how long since you read the Herald or came to the tavern.
   3. Town gossip: Bill, Gary and the townsfolk pass on what the other captain has really been up to.
   4. The monthly mystery: clues through the month, a case file, both captains vote, then a party or Gary is barred.
   See the character voice guide in the project for how each of them talks. */
const D9=()=>((CT().lines||{}).d9)||{};

/* ---------- 1. fold the new lines in ---------- */
(function(){const d=D9(),L=CT().lines||{},d8=(L.d8)||{};const fold=(dst,src,keys)=>{if(!dst||!src)return;keys.forEach(k=>{if(Array.isArray(src[k])&&src[k].length){if(!Array.isArray(dst[k]))dst[k]=[];src[k].forEach(x=>{if(!dst[k].includes(x))dst[k].push(x);});}});};
  fold(L.gary,d.gary,['morning','fast','slow','hit','miss','boss','fish','weekend','poke','night','storm','nest','complaints']);
  fold(L.bill,d.bill,['gossip','alone','both','night','storm','fire','switchIn']);
  if(d8.bill){fold(d8.bill,d.bill,['any','cocktail']);if(d.bill&&d.bill.chapters)d8.bill.chapters=(d8.bill.chapters||[]).concat(d.bill.chapters);}
  if(d8.gary&&d.gary&&d.gary.chapters)d8.gary.chapters=(d8.gary.chapters||[]).concat(d.gary.chapters);})();

/* ---------- 2. what the characters know ---------- */
const dlHM=m=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
const dlDaysSince=d=>d?Math.round((Date.parse(G.today+'T12:00:00Z')-Date.parse(String(d).slice(0,10)+'T12:00:00Z'))/864e5):null;
function dlSpends(p,days){const from=addDays(G.today,-(days||30));const out=[];try{Object.entries(S.days||{}).forEach(([k,doc])=>{if(!k.endsWith('_'+p)||!doc||!doc.spend)return;const date=k.slice(0,10);if(date<from)return;Object.values(doc.spend).forEach(s=>s&&s.item&&out.push({...s,date}));});}catch(e){}return out.sort((a,b)=>(a.ts||0)-(b.ts||0));}
function dlBought(p,days){const l=dlSpends(p,days).filter(s=>ALL_ITEMS[s.item]&&ALL_ITEMS[s.item].cat!=='supply'&&ALL_ITEMS[s.item].cat!=='shield');const x=l[l.length-1];return x?ALL_ITEMS[x.item].name:'';}
function dlDrinks(p,days){const n={};dlSpends(p,days).forEach(s=>{if(String(s.item).startsWith('tv_')){const id=s.item.slice(3);n[id]=(n[id]||0)+1;}});return n;}
const dlDrinkName=id=>{try{return (DRINK_BY[id]&&DRINK_BY[id].name)||'';}catch(e){return '';}};
function dlFish(p,days){try{const from=addDays(G.today,-(days||5));const l=fishCatches(p).list.filter(f=>f.date>=from);if(!l.length)return '';l.sort((a,b)=>(FISH_RI[b.f.rar]||0)-(FISH_RI[a.f.rar]||0)||(b.date>a.date?1:-1));return l[0].f.name;}catch(e){return '';}}
const dlDayDMs=(p,d)=>(((G.days[d]||{}).p||{})[p]||{}).d||0;
const dlEvs=(p,d,k='d')=>G.evs.filter(e=>e.pid===p&&e.date===d&&e.k===k&&!e.u);
function dlLastWork(){return G.workdays.filter(d=>d<G.today).pop();}
function dlLocalGap(key){try{const v=localStorage.getItem(key);return v?dlDaysSince(v):null;}catch(e){return null;}}
const dlMark=key=>{try{localStorage.setItem(key,G.today);}catch(e){}};

function dlMe(){const f={};try{const me=S.me,pl=S.players[me]||{},M=G.players[me]||{};f.me=C().players[me]?.name||'Captain';f.here=f.me;f.chip=dlChip();
  if(typeof PIPE!=='undefined'&&PIPE.ready){const mine=PIPE.rows.filter(r=>r.owner===me);
    const q=mine.filter(r=>(r.stage==='messaged'||r.stage==='followed_up')&&r.last_contact&&dlDaysSince(r.last_contact)>=10&&dlDaysSince(r.last_contact)<=60&&r.business);
    if(q.length){const r=q[h32(G.today+'quiet')%q.length];f.quiet=r.business;f.quietDays=dlDaysSince(r.last_contact);}
    const w=mine.filter(r=>r.stage==='client'&&r.won_at&&dlDaysSince(r.won_at)<=21&&r.business).sort((a,b)=>a.won_at<b.won_at?1:-1)[0];if(w)f.won=w.business;}
  const dk=dlDrinks(me,60);const top=Object.entries(dk).sort((a,b)=>b[1]-a[1])[0];if(top&&top[1]>=3&&dlDrinkName(top[0])){f.drink=dlDrinkName(top[0]);f.drinkN=top[1];}
  const b=dlBought(me,10);if(b)f.bought=b;const fi=dlFish(me,5);if(fi)f.fish=fi;
  if(pl.pet&&typeof PET_BY_ID!=='undefined'&&PET_BY_ID[pl.pet])f.pet=PET_BY_ID[pl.pet].name;
  const best=(M.m&&M.m.bestDay)||0;if(best>=20)f.best=best;const st=M.curStreak||M.streak||0;if(st>=3)f.streak=st;
  const hg=dlLocalGap('hl_herald_seen');if(hg!=null&&hg>=3&&hg<60)f.heraldGap=hg;
  const tg=S.tvGap!=null?S.tvGap:dlLocalGap('hl_tavern_seen');if(tg!=null&&tg>=4&&tg<90)f.tavernGap=tg;
  const yd=dlLastWork();if(yd){const n=dlDayDMs(me,yd);if(n>=5)f.yd=n;const e=dlEvs(me,yd);if(e.length){const m=Math.min(...e.map(x=>x.min||0));if(m&&m<9*60)f.early=dlHM(m);}}
  const hats=Object.keys(M.owned||{}).filter(id=>ALL_ITEMS[id]&&ALL_ITEMS[id].cat==='hat'&&!ALL_ITEMS[id].free);if(!hats.length)f.hatless=1;}catch(e){}return f;}

function dlOther(){const f={};try{const me=S.me,o=other(me),M=G.players[o]||{},pl=S.players[o]||{};f.o=C().players[o]?.name||'the other captain';f.here=C().players[me]?.name||'Captain';
  const lm=L().min;const te=dlEvs(o,G.today);if(te.length){f.oFirst=dlHM(Math.min(...te.map(x=>x.min||0)));}const n=dlDayDMs(o,G.today);if(n>=5)f.oDms=n;
  const mine=dlDayDMs(me,G.today);if(n>=5&&n-mine>=3)f.oFaster=1;if(mine>=5&&mine-n>=3)f.meFaster=1;
  if(!n&&lm>=11*60&&isWork(G.today)&&!absent(o,G.today))f.oQuietToday=1;
  const yd=dlLastWork();if(yd){const y=dlDayDMs(o,yd);if(y>=10)f.oYd=y;const e=dlEvs(o,yd);if(e.length){const m=Math.max(...e.map(x=>x.min||0));if(m>=18*60)f.oLast=dlHM(m);}}
  const fi=dlFish(o,2);if(fi)f.oFish=fi;const b=dlBought(o,3);if(b)f.oBought=b;
  const dl=dlSpends(o,2).filter(s=>String(s.item).startsWith('tv_'));if(dl.length){const nm=dlDrinkName(dl[dl.length-1].item.slice(3));if(nm)f.oDrink=nm;}
  const st=M.curStreak||M.streak||0;if(st>=3)f.oStreak=st;if(pl.pet&&typeof PET_BY_ID!=='undefined'&&PET_BY_ID[pl.pet])f.oPet=PET_BY_ID[pl.pet].name;
  if(typeof PIPE!=='undefined'&&PIPE.ready){const w=PIPE.rows.filter(r=>r.owner===o&&r.stage==='client'&&r.won_at&&dlDaysSince(r.won_at)<=7&&r.business).sort((a,b)=>a.won_at<b.won_at?1:-1)[0];if(w)f.oWon=w.business;}}catch(e){}return f;}

// pick a line whose every {key} is known; {?key} only checks, it never prints
function dlTpl(list,facts,seed,peek){if(!list||!list.length)return '';const ok=list.filter(t=>(t.match(/\{\??([a-zA-Z]+)\}/g)||[]).every(m=>{const k=m.replace(/[{}?]/g,'');return facts[k]!=null&&facts[k]!==''&&facts[k]!==0;}));if(!ok.length)return '';
  // don't say the same remembered thing twice in a row
  if(peek)return 'y';const fresh=ok.filter(t=>!DL_SAID.includes(t));const pool=fresh.length?fresh:ok;const t=pool[h32(String(seed))%pool.length];DL_SAID.push(t);if(DL_SAID.length>12)DL_SAID.shift();
  return t.replace(/\{\?[a-zA-Z]+\}/g,'').replace(/\{([a-zA-Z]+)\}/g,(m,k)=>facts[k]!=null?String(facts[k]):m).replace(/\b([Aa]) ([AEIOUaeiou])/g,'$1n $2').trim();}
const DL_SAID=[];
function dlRemember(who,seed,peek){return dlTpl((D9().remember||{})[who],dlMe(),seed,peek);}
function dlGossip(who,seed,peek){return dlTpl((D9().gossip||{})[who],dlOther(),seed,peek);}

/* ---------- 4. the monthly mystery (here, so Gary and Bill can talk about it) ---------- */
const CASE_WHO={gary:'Gary',bill:'Barnacle Bill',nell:'Nell',crab:'Crab',lenny:'Lenny',fergus:'Fergus',pike:'Miss Pike',hobbs:'Hobbs, the harbourmaster',pell:'Pell',crumb:'Mrs Crumb',mum:"Gary's mum, in a letter to the Herald",oldtom:"Old Tom's ghost"};
const caseDays=(a,b)=>Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/864e5);
// the case running today, or the one that's just finished (shown until 7 days after it ends)
function caseNow(d){d=d||G.today;const cs=D9().cases||[];return cs.find(c=>d>=c.start&&d<=c.end)||null;}
function caseJustDone(d){d=d||G.today;const cs=D9().cases||[];return cs.filter(c=>d>c.end&&caseDays(c.end,d)<=7).pop()||null;}
function caseClueDate(c,i){const span=Math.max(1,caseDays(c.start,c.end)-3);return addDays(c.start,Math.floor(i*span/Math.max(1,c.clues.length-1)));}
function caseClues(c,d){d=d||G.today;return c.clues.map((x,i)=>({who:x[0],text:x[1],date:caseClueDate(c,i),i})).filter(x=>x.date<=d);}
function caseVoteOpen(c,d){d=d||G.today;return d<=c.end&&(caseClues(c,d).length>=Math.ceil(c.clues.length*.6)||caseDays(d,c.end)<=10);}
const caseVote=(c,p)=>((((S.players[p]||{}).cases)||{})[c.id]||{}).vote||null;
const caseSus=(c,id)=>(c.suspects.find(s=>s.id===id)||{}).name||id;
function caseOutcome(c){const v=G.P.map(p=>caseVote(c,p));const right=v.some(x=>x===c.culprit);return {right,votes:v};}
// Gary is barred from the tavern for the week after a case nobody solved
function garyBarred(d){d=d||G.today;const c=caseJustDone(d);return !!(c&&!caseOutcome(c).right&&caseDays(c.end,d)<=7);}
function partyNow(d){d=d||G.today;const c=caseJustDone(d);return !!(c&&caseOutcome(c).right&&caseDays(c.end,d)<=2);}
function caseNewest(){const c=caseNow();if(!c)return null;const l=caseClues(c);return l.length?{c,x:l[l.length-1],fresh:l[l.length-1].date===G.today}:null;}

/* ---------- Gary: more to say, and he remembers ---------- */
{const _gs=garySituation;garySituation=function(){const base=_gs.apply(this,arguments);try{if(!G||!S.me||base==='night'||base==='legend')return base;const hr=Math.floor(L().min/60);
  if(partyNow())return h32(G.today+hr)%2?'party':base;
  if(garyBarred()&&(h32(G.today+'gb'+hr)%3===0))return 'barred';
  const yd=dlLastWork();const D=yd&&G.days[yd];if(base==='miss'&&D&&D.target&&D.team<D.target*.6)return 'rough';
  const slot=(h32(G.today+'d9')+hr)%4;if(slot!==1)return base;
  const opts=['any','any'];if(dlRemember('gary',0,1))opts.push('remember','remember');if(dlGossip('gary',0,1))opts.push('gossip','gossip');if(caseNewest())opts.push('case');
  return opts[(h32(G.today+'o'+hr)>>>2)%opts.length];}catch(e){return base;}};}
{const _gl=garyLine;garyLine=function(cat,seed,extra){const d=D9().gary||{};const s=String(seed);
  if(cat==='remember')return dlRemember('gary',s)||_gl.call(this,'any',seed,extra);
  if(cat==='gossip')return dlGossip('gary',s)||_gl.call(this,'any',seed,extra);
  if(cat==='case'){const n=caseNewest();if(!n)return _gl.call(this,'any',seed,extra);return n.x.who==='gary'?n.x.text:`Have you seen the case file? ${n.c.title} I'm not a suspect. I'm a witness. A very relaxed witness.`;}
  if(['any','rough','barred','party'].includes(cat)){const l=d[cat];return l&&l.length?fill(dlPick(l,'gary9.'+cat,h32(s)%4,4),garyVars(extra)):'';}
  return _gl.call(this,cat,seed,extra);};}
// poking Gary sometimes gets his news, a memory or gossip
{const _gp=ACT.garyPoke;ACT.garyPoke=function(){_gp.apply(this,arguments);try{if(POKES.length>3||Math.random()>.35)return;const now=Date.now();const k=['any','remember','gossip'][Math.floor(Math.random()*3)];
  const line=garyLine(k,now+'p9');if(!line)return;S.garyPoke={line,until:now+9000};const el=document.querySelector('.remind > div');if(el)el.textContent=line;}catch(e){}};}

/* ---------- Bill: remembers your drink, passes on gossip, talks about the case ---------- */
{const _tn=tvNextLine;tvNextLine=function(){try{const d=D9().bill||{};const r=Math.random();const sub=l=>fill(l,tvVars());const seed=Date.now();
  if(partyNow()&&r<.5&&d.party)return sub(dlRand(d.party));
  if(garyBarred()&&r<.25&&d.barred)return sub(dlRand(d.barred));
  if(!TVS.d9first){TVS.d9first=1;const yd=dlLastWork();const D=yd&&G.days[yd];if(D&&D.target&&D.team<D.target*.6&&d.rough)return sub(dlRand(d.rough));const m=dlRemember('bill',seed);if(m&&Math.random()<.7)return m;}
  if(r<.13){const m=dlRemember('bill',seed);if(m)return m;}
  if(r<.27){const g=dlGossip('bill',seed);if(g)return g;}
  if(r<.36){const n=caseNewest();if(n)return n.x.who==='bill'?n.x.text:`About the case. ${CASE_WHO[n.x.who]||'Someone'} reckons: "${n.x.text}" I'm saying nothing. I'm saying it twice.`;}}catch(e){}
  return _tn.apply(this,arguments);};}
// how long since you were last in: counted when you walk through the door
{const _tv=SCREENS.tavern;if(_tv)SCREENS.tavern=function(){if(S.tvGapDay!==G.today){S.tvGap=dlLocalGap('hl_tavern_seen');S.tvGapDay=G.today;dlMark('hl_tavern_seen');TVS.d9first=0;}return _tv.apply(this,arguments);};}
{const _hs=SCREENS.herald;SCREENS.herald=function(){dlMark('hl_herald_seen');return _hs.apply(this,arguments);};}
try{if(!localStorage.getItem('hl_herald_seen'))localStorage.setItem('hl_herald_seen',new Date().toISOString().slice(0,10));if(!localStorage.getItem('hl_tavern_seen'))localStorage.setItem('hl_tavern_seen',new Date().toISOString().slice(0,10));}catch(e){}

/* ---------- Pell remembers what you never buy ---------- */
{const _sb=ACT.s7Barge;ACT.s7Barge=function(){_sb.apply(this,arguments);try{if(Math.random()<.4){const m=dlRemember('pell',Date.now());const p=document.querySelector('#modal p.muted');if(m&&p)p.innerHTML=`"${esc(m)}"`;}}catch(e){}};}

/* ---------- 3. word on the street: gossip, memories and the case ---------- */
const TOWN_VOX={'Mrs Crumb, the baker':'crumb','Hobbs, the harbourmaster':'hobbs','Nell, who mends the nets':'nell','Lenny, the lighthouse keeper':'lenny','Fergus, the fishmonger':'fergus','Miss Pike, the schoolteacher':'pike','Crab':'crab','Overheard by the pier':'harbour'};
{const _th=townHtml;townHtml=function(){let h=_th.apply(this,arguments);try{const seed=G.today+Math.floor(L().min/30);const extra=[];
  const who=[['nell','Nell, who mends the nets'],['fergus','Fergus, the fishmonger'],['pike','Miss Pike, the schoolteacher'],['lenny','Lenny, the lighthouse keeper'],['crab','Crab']];
  for(const [k,n] of who.sort((a,b)=>h32(seed+a[0])-h32(seed+b[0]))){if(dlGossip(k,0,1)){extra.push({n,q:dlGossip(k,seed),w:k});break;}}
  for(const [k,n] of [['nell','Nell, who mends the nets'],['crab','Crab']]){if(dlRemember(k,0,1)){extra.push({n,q:dlRemember(k,seed),w:k});break;}}
  const n=caseNewest();if(n&&n.x.who!=='gary'&&n.x.who!=='bill')extra.push({n:(CASE_WHO[n.x.who]||'Someone')+', about the case',q:n.x.text,w:n.x.who});
  if(extra.length){const rows=extra.map(x=>`<div class="ttRow" data-act="voxSay" data-w="${x.w}" data-t="${esc(x.q)}"><p>"${esc(x.q)}"</p><small>${esc(x.n)}</small></div>`).join('');h=h.replace('<h3>Word on the street</h3>','<h3>Word on the street</h3>'+rows);}
  // tap anyone to hear them
  h=h.replace(/<div class="ttRow" style="--d:[^"]*"><p>"([^<]*)"<\/p><small>([^<]*)<\/small><\/div>/g,(all,q,nm)=>{const w=TOWN_VOX[nm.replace(/&amp;/g,'&').replace(/&#39;/g,"'")]||'harbour';return all.replace('<div class="ttRow"',`<div class="ttRow" data-act="voxSay" data-w="${w}" data-t="${q}"`);});}catch(e){}return h;};}

/* ---------- 4b. the case: harbour row, case file, voting, the Herald and the reveal ---------- */
function caseRowHtml(){const c=caseNow();const done=caseJustDone();if(c){const l=caseClues(c);const fresh=l.length&&l[l.length-1].date===G.today;const mine=caseVote(c,S.me);
    return `<a class="linkRow caseRow" href="javascript:void 0" data-act="caseOpen"><span class="caseIco">?</span><span class="grow"><b>The case: ${esc(c.title)}</b><small>${fresh?'New clue today':`${l.length} of ${c.clues.length} clues`}${caseVoteOpen(c)?(mine?` · you named ${esc(caseSus(c,mine))}`:' · voting open'):''}</small></span><span class="chev">›</span></a>`;}
  if(done){const o=caseOutcome(done);return `<a class="linkRow caseRow ${o.right?'solved':'cold'}" href="javascript:void 0" data-act="caseReveal" data-id="${done.id}"><span class="caseIco">${o.right?'✓':'✗'}</span><span class="grow"><b>Case closed: ${esc(done.title)}</b><small>${o.right?'Solved! Party at the Rusty Anchor':'Not solved. Gary is barred from the tavern this week'}</small></span><span class="chev">›</span></a>`;}
  return '';}
{const _hb=SCREENS.harbour;SCREENS.harbour=function(){const h=_hb.apply(this,arguments);try{const row=caseRowHtml();if(!row)return h;const k='<div class="links">';return h.includes(k)?h.replace(k,k+row):h;}catch(e){return h;}};}
ACT.caseOpen=()=>{const c=caseNow()||caseJustDone();if(!c)return;const l=caseClues(c);const open=caseVoteOpen(c);const mine=caseVote(c,S.me);const ot=other(S.me);const theirs=caseVote(c,ot);
  const next=c.clues.length>l.length?caseClueDate(c,l.length):null;
  openModal(`<div class="caseFile"><div class="caseHead"><span class="caseStamp">Case file</span><h2>${esc(c.title)}</h2><p class="muted">${esc(c.intro)}</p></div>
    <h3 class="caseH">The suspects</h3><div class="caseSus">${c.suspects.map(s=>`<div class="caseS ${mine===s.id?'on':''}"><b>${esc(s.name)}</b><small>${esc(s.bio)}</small>${open?`<button class="btn sm ${mine===s.id?'primary':'ghost'}" data-act="caseVote" data-s="${s.id}">${mine===s.id?'Your pick ✓':'Name them'}</button>`:''}</div>`).join('')}</div>
    <p class="tiny muted" style="margin:8px 2px 0">${open?`Voting closes ${esc(pShortD(c.end))}. ${esc(pnameRaw(ot))} ${theirs?'has named someone. No peeking.':'hasn\'t voted yet.'} Get it right for 400 doubloons and 300 XP.`:`Voting opens once most of the clues are in. Get it right for 400 doubloons and 300 XP; get it wrong and Gary is barred from the Rusty Anchor for a week.`}</p>
    <h3 class="caseH">Clues so far <small>${l.length} of ${c.clues.length}</small></h3>
    <div class="caseClues">${l.slice().reverse().map(x=>`<div class="caseClue ${x.date===G.today?'fresh':''}" data-act="voxSay" data-w="${x.who}" data-t="${esc(x.text)}"><small>${esc(CASE_WHO[x.who]||x.who)} · ${esc(pShortD(x.date))}${x.date===G.today?' · new':''}</small><p>"${esc(x.text)}"</p></div>`).join('')}</div>
    ${next?`<p class="tiny muted" style="margin:6px 2px 0">Next clue around ${esc(pShortD(next))}. Bill, Gary and the town drop hints too.</p>`:''}
    <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn ghost" data-act="closeModal">Close</button></div></div>`);};
ACT.caseVote=async d=>{const c=caseNow();if(!c||!caseVoteOpen(c))return;const pl=S.players[S.me]||{};const cases={...(pl.cases||{}),[c.id]:{vote:d.s,at:Date.now()}};
  try{await writePlayer(S.me,{cases});}catch(e){return writeFail(e);}try{SND.pop();}catch(e){}
  const quips={gary:"Gary has been informed. Gary has fainted. Gary is fine.",pell:"Pell is outraged. Pell is also selling 'I Named Pell' badges.",crab:"Crab has moved his rock two inches to the left. In protest.",admiral:"Admiral looked at you. Then looked away. That's a confession or a nap.",nell:"Nell has told everyone you suspect her. Twice.",hobbs:"Hobbs has named a bench after you. It's called Gary."};
  toast(`<b>You named ${esc(caseSus(c,d.s))}.</b> ${esc(quips[d.s]||'The town gasps. Nell gasps loudest.')}`,'',5200);ACT.caseOpen();};
// the reveal, once per captain, the first time they open the game after the case closes
ACT.caseReveal=d=>{const cs=D9().cases||[];const c=cs.find(x=>x.id===(d&&d.id))||caseJustDone();if(!c)return;const o=caseOutcome(c);const mine=caseVote(c,S.me);const right=mine===c.culprit;
  const vname=mine?caseSus(c,mine):'nobody';const body=(o.right?c.right:c.wrong).replace('{vote}',vname);const gline=(o.right?c.garyRight:c.garyWrong).replace('{vote}',vname);
  openModal(`<div class="caseFile reveal ${o.right?'solved':'cold'}"><div class="caseHead"><span class="caseStamp">${o.right?'Solved':'Case closed'}</span><h2>${esc(c.title)}</h2></div>
    <div class="caseCulprit"><small>The culprit</small><b>${esc(caseSus(c,c.culprit))}</b></div><p>${esc(body)}</p>
    <div class="caseClue" data-act="voxSay" data-w="gary" data-t="${esc(gline)}"><small>Gary</small><p>"${esc(gline)}"</p></div>
    <p class="tiny muted">${mine?(right?'You named the right one. 400 doubloons and 300 XP are yours.':`You named ${esc(vname)}. Close. Not very close.`):'You didn\'t name anyone this time.'} ${G.P.filter(p=>p!==S.me).map(p=>{const v=caseVote(c,p);return `${esc(pnameRaw(p))} named ${v?esc(caseSus(c,v)):'nobody'}.`;}).join(' ')}</p>
    <div class="row" style="justify-content:flex-end;margin-top:10px">${right&&!caseClaimed(c)?`<button class="btn primary" data-act="caseClaim" data-id="${c.id}">Collect 400 doubloons</button>`:''}<button class="btn ghost" data-act="closeModal">Close</button></div></div>`);
  try{localStorage.setItem('hl_case_seen_'+c.id,'1');}catch(e){}setTimeout(()=>VOX.say('gary',gline),400);};
const caseClaimed=c=>Object.entries(S.days||{}).some(([k,doc])=>k.endsWith('_'+S.me)&&doc&&doc.bonus&&doc.bonus['case_'+c.id]);
ACT.caseClaim=async d=>{const c=(D9().cases||[]).find(x=>x.id===d.id);if(!c||caseVote(c,S.me)!==c.culprit||caseClaimed(c))return;
  try{await writeDay(S.me,G.today,{bonus:{['case_'+c.id]:{xp:300,g:400,ts:Date.now()}}});}catch(e){return writeFail(e);}closeModal();try{SND.chest&&SND.chest();}catch(e){}toast(`<b>Case solved!</b> +400 ${CN} and 300 XP. Bill's put your name on the wall. Spelt wrong.`,'',5200);};
// show the reveal once, on the Harbour
{const _hb2=SCREENS.harbour;SCREENS.harbour=function(){const h=_hb2.apply(this,arguments);try{const c=caseJustDone();if(c&&!localStorage.getItem('hl_case_seen_'+c.id)&&!S.caseRevealT){S.caseRevealT=setTimeout(()=>{S.caseRevealT=null;const m=document.getElementById('modal');if(S.screen==='harbour'&&(!m||m.hidden))ACT.caseReveal({id:c.id});},1600);}}catch(e){}return h;};}
// the Herald runs the case
{const _hh=SCREENS.herald;SCREENS.herald=function(){const h=_hh.apply(this,arguments);try{const c=caseNow(),done=caseJustDone();let sec='';
  if(c){const n=caseNewest();sec=`<div class="hCase"><h3>The Case: ${esc(c.title)}</h3>${n?`<p><i>"${esc(n.x.text)}"</i> <small>${esc(CASE_WHO[n.x.who]||'')}</small></p>`:`<p>${esc(c.intro)}</p>`}<button class="btn sm ghost" data-act="caseOpen">Read the case file</button></div>`;}
  else if(done){const o=caseOutcome(done);sec=`<div class="hCase"><h3>${o.right?'CASE SOLVED':'CASE GOES COLD'}: ${esc(done.title)}</h3><p>${esc((o.right?done.right:done.wrong).replace('{vote}','the wrong one'))}</p></div>`;}
  if(!sec)return h;const k='<div><h3>Classifieds</h3>';return h.includes(k)?h.replace(k,sec+k):h+sec;}catch(e){return h;}};}
