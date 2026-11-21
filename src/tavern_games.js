/* ============================== THE RUSTY ANCHOR: TABLE GAMES (Stage 5) ==============================
   The stake is paid as a spend when the hand is dealt; winnings come back as a claim when it's settled.
   A combined 500-doubloon stake cap per captain per day across all games. */
const SUITS=['♠','♥','♦','♣'],RANKS={11:'J',12:'Q',13:'K',14:'A'};
const rk=r=>RANKS[r]||String(r);
function newDeck(){const d=[];for(let s=0;s<4;s++)for(let r=2;r<=14;r++)d.push({r,s});for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}return d;}
const cardHtml=(c,hid,sel,i)=>hid?'<span class="pc back"></span>':`<span class="pc ${c.s===1||c.s===2?'red':''} ${sel?'sel':''}" ${i!=null?`data-act="pkHold" data-i="${i}"`:''}><b>${rk(c.r)}</b><i>${SUITS[c.s]}</i></span>`;
async function tvStakePay(game,amt){const st=amt||tvStakeNow();const me=G.players[S.me];
  if(tvStakedToday()+st>TV_DAY_CAP){toast(`<b>That's your lot for today.</b> ${fmtN(TV_DAY_CAP)} a day across all games. Bill says "go and do some DMs, darling".`,'joke');return 0;}
  if(me.balance<st){toast('<b>Not enough doubloons.</b>','joke');return 0;}try{await writeDay(S.me,G.today,{spend:{[uid()]:{item:'tv_bet',cost:st,game,ts:Date.now()}}});return st;}catch(e){writeFail(e);return 0;}}
async function tvPayout(game,g,note){if(g<=0)return;try{await writeDay(S.me,G.today,{bonus:{['tv_w_'+uid()]:{xp:0,g,ts:Date.now(),game,note:note||''}}});SND.coin();}catch(e){writeFail(e);}}

/* ---------- 21 against Bill ---------- */
const BJ={};const bjVal=h=>{let v=0,a=0;h.forEach(c=>{v+=c.r>=11&&c.r<=13?10:c.r===14?11:c.r;if(c.r===14)a++;});while(v>21&&a){v-=10;a--;}return v;};
ACT.bjStart=async()=>{const st=await tvStakePay('21');if(!st)return;Object.assign(BJ,{deck:newDeck(),p:[],d:[],st,done:false,msg:''});BJ.p.push(BJ.deck.pop(),BJ.deck.pop());BJ.d.push(BJ.deck.pop(),BJ.deck.pop());
  if(bjVal(BJ.p)===21){await bjEnd();return;}bjShow();};
function bjShow(){const T=TV();openModal(`<div class="tvGame"><h2>21 with Bill</h2><p class="tiny muted">Stake ${BJ.st}</p>
  <div class="hand"><small>Bill${BJ.done?` · ${bjVal(BJ.d)}`:''}</small><div>${BJ.d.map((c,i)=>cardHtml(c,!BJ.done&&i===1)).join('')}</div></div>
  <div class="hand"><small>You · ${bjVal(BJ.p)}</small><div>${BJ.p.map(c=>cardHtml(c)).join('')}</div></div>
  ${BJ.msg?`<p class="gameMsg">${BJ.msg}</p>`:''}
  <div class="row">${BJ.done?`<button class="btn primary" data-act="bjStart">Deal again (${tvStakeNow()})</button><button class="btn ghost" data-act="closeModal">Leave the table</button>`:`<button class="btn primary" data-act="bjHit">Hit</button><button class="btn" data-act="bjStand">Stand</button>`}</div></div>`);}
ACT.bjHit=async()=>{if(BJ.done)return;BJ.p.push(BJ.deck.pop());if(bjVal(BJ.p)>21){BJ.done=true;BJ.msg=`Bust. ${esc(TV().lose21||'')}`;SND.err();bjShow();}else if(bjVal(BJ.p)===21)await ACT.bjStand();else bjShow();};
ACT.bjStand=async()=>{if(BJ.done)return;while(bjVal(BJ.d)<17)BJ.d.push(BJ.deck.pop());await bjEnd();};
async function bjEnd(){BJ.done=true;const T=TV();const pv=bjVal(BJ.p),dv=bjVal(BJ.d),nat=pv===21&&BJ.p.length===2;
  if(nat&&!(dv===21&&BJ.d.length===2)){const g=Math.floor(BJ.st*2.5);BJ.msg=`Blackjack! +${g-BJ.st} ${CN}. ${esc(T.bj21||'')}`;await tvPayout('21',g,'blackjack');}
  else if(pv>21){BJ.msg=`Bust. ${esc(T.lose21||'')}`;}
  else if(dv>21||pv>dv){BJ.msg=`${dv>21?'Bill busts. ':''}You win +${BJ.st} ${CN}. ${esc(T.win21||'')}`;await tvPayout('21',BJ.st*2,'win');}
  else if(pv===dv){BJ.msg=`Push. Stake back. ${esc(T.push21||'')}`;await tvPayout('21',BJ.st,'push');}
  else{BJ.msg=`Bill wins with ${dv}. ${esc(T.lose21||'')}`;SND.err();}bjShow();}

/* ---------- Liar's Dice against Gary ---------- */
const LD={};const roll5=()=>Array.from({length:5},()=>1+Math.floor(Math.random()*6));const DOTS={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
const pips=new Proxy({},{get:(o,n)=>`<span class="dieS">${Array.from({length:9},(_,i)=>`<i class="${DOTS[+n]&&DOTS[+n].includes(i)?'on':''}"></i>`).join('')}</span>`});
const dieHtml=(n,cls)=>`<span class="die ${cls||''}">${Array.from({length:9},(_,i)=>`<i class="${DOTS[n].includes(i)?'on':''}"></i>`).join('')}</span>`;
const binomAtLeast=(k,n,p)=>{if(k<=0)return 1;if(k>n)return 0;let s=0;const C=(n,r)=>{let x=1;for(let i=1;i<=r;i++)x=x*(n-i+1)/i;return x;};for(let i=k;i<=n;i++)s+=C(n,i)*Math.pow(p,i)*Math.pow(1-p,n-i);return s;};
ACT.ldStart=async()=>{const st=await tvStakePay('dice');if(!st)return;Object.assign(LD,{me:roll5(),gary:roll5(),bid:null,by:null,st,done:false,msg:'Your bid first. How many of a face are under both cups?',q:2,f:3,log:[]});ldShow();};
function ldShow(){const minQ=LD.bid?LD.bid.q:1;openModal(`<div class="tvGame"><h2>Liar's Dice with Gary</h2><p class="tiny muted">Stake ${LD.st} · 10 dice on the table, no wilds</p>
  <div class="hand"><small>Gary's cup</small><div class="dice">${LD.done?LD.gary.map(d=>dieHtml(d)).join(''):'<span class="cup"></span>'}</div></div>
  <div class="hand"><small>Your dice</small><div class="dice">${LD.me.map(d=>dieHtml(d,'mine')).join('')}</div></div>
  ${LD.bid?`<p class="ldBid">Current bid: <b>${LD.bid.q} × ${pips[LD.bid.f]}</b> (${LD.by==='gary'?'Gary':'you'})</p>`:''}
  <p class="gameMsg">${LD.msg}</p>
  ${LD.done?`<div class="row"><button class="btn primary" data-act="ldStart">Play again (${tvStakeNow()})</button><button class="btn ghost" data-act="closeModal">Leave</button></div>`:
   `<div class="row ldPick"><span class="tiny">Bid</span><button class="chip" data-act="ldQ" data-v="-1">−</button><b>${LD.q}</b><button class="chip" data-act="ldQ" data-v="1">+</button><span class="tiny">of</span>${[1,2,3,4,5,6].map(f=>`<button class="chip ${LD.f===f?'on':''}" data-act="ldF" data-v="${f}">${pips[f]}</button>`).join('')}</div>
   <div class="row"><button class="btn primary" data-act="ldBid" ${ldValid(LD.q,LD.f)?'':'disabled'}>Bid ${LD.q} × ${pips[LD.f]}</button>${LD.by==='gary'?'<button class="btn" data-act="ldCall">Liar!</button>':''}</div>`}</div>`);}
const ldValid=(q,f)=>!LD.bid||q>LD.bid.q||(q===LD.bid.q&&f>LD.bid.f);
ACT.ldQ=d=>{LD.q=clamp(LD.q+(+d.v),1,10);ldShow();};ACT.ldF=d=>{LD.f=+d.v;ldShow();};
ACT.ldBid=()=>{if(LD.done||!ldValid(LD.q,LD.f))return;LD.bid={q:LD.q,f:LD.f};LD.by='me';garyTurn();};
function garyTurn(){const b=LD.bid;const mine=LD.gary.filter(d=>d===b.f).length;const pTrue=binomAtLeast(b.q-mine,5,1/6);const bluffy=Math.random()<.5;
  if(pTrue<(bluffy?.18:.42)){LD.msg=`Gary squawks: "LIAR!"`;return ldReveal('gary');}
  const cnt=[0,0,0,0,0,0,0];LD.gary.forEach(d=>cnt[d]++);let best=1;for(let f=2;f<=6;f++)if(cnt[f]>cnt[best]||(cnt[f]===cnt[best]&&f>best))best=f;
  let nb=best>b.f?{q:b.q,f:best}:{q:b.q+1,f:best};if(bluffy&&Math.random()<.4)nb={q:b.q+1,f:b.f};if(nb.q>10){LD.msg='Gary squawks: "LIAR!"';return ldReveal('gary');}
  LD.bid=nb;LD.by='gary';LD.q=nb.q;LD.f=nb.f;LD.msg=`Gary bids <b>${nb.q} × ${pips[nb.f]}</b>. ${hPick(['He looks very calm. Too calm.','He is sweating. Gulls don\'t sweat.','He winks at you. It\'s horrible.','He taps the cup twice.'],Math.random())} Raise, or call him a liar.`;ldShow();}
ACT.ldCall=()=>{if(LD.by!=='gary')return;LD.msg='You slam the table: "LIAR!"';ldReveal('me');};
async function ldReveal(caller){LD.done=true;const T=TV().dice||{};const b=LD.bid;const total=[...LD.me,...LD.gary].filter(d=>d===b.f).length;const bidTrue=total>=b.q;
  let win=caller==='me'?!bidTrue:bidTrue;let note='';if(!win&&Math.random()<.1){win=true;note=' '+esc(T.caught||'Caught him cheating!');}
  LD.msg+=` There ${total===1?'is':'are'} <b>${total} × ${pips[b.f]}</b>. ${win?`You win +${LD.st} ${CN}.${note||' '+esc(T.win||'')}`:`Gary wins. ${esc(T.lose||'')}`}`;if(win)await tvPayout('dice',LD.st*2,note?'caught':'win');else SND.err();ldShow();}

/* ---------- Pirate Poker against Old Pete and One-Eyed Sal ---------- */
function evalHand(h){const rs=h.map(c=>c.r).sort((a,b)=>b-a);const cnt={};rs.forEach(r=>cnt[r]=(cnt[r]||0)+1);const groups=Object.entries(cnt).map(([r,n])=>[n,+r]).sort((a,b)=>b[0]-a[0]||b[1]-a[1]);
  const flush=h.every(c=>c.s===h[0].s);const uniq=[...new Set(rs)];let straight=uniq.length===5&&(rs[0]-rs[4]===4);let top=rs[0];if(uniq.length===5&&rs[0]===14&&rs[1]===5){straight=true;top=5;}
  const cat=straight&&flush?8:groups[0][0]===4?7:groups[0][0]===3&&groups[1][0]===2?6:flush?5:straight?4:groups[0][0]===3?3:groups[0][0]===2&&groups[1][0]===2?2:groups[0][0]===2?1:0;
  return [cat,...(straight?[top]:groups.map(g=>g[1]))];}
const HAND_NAMES=['High card','Pair','Two pair','Three of a kind','Straight','Flush','Full house','Four of a kind','Straight flush'];
const cmpHand=(a,b)=>{for(let i=0;i<Math.max(a.length,b.length);i++){const d=(a[i]||0)-(b[i]||0);if(d)return d;}return 0;};
function botDraw(h,deck){const e=evalHand(h);if(e[0]>=4)return h;const cnt={};h.forEach(c=>cnt[c.r]=(cnt[c.r]||0)+1);let keep=h.filter(c=>cnt[c.r]>=2);
  if(!keep.length){const bySuit=[0,1,2,3].map(s=>h.filter(c=>c.s===s));const fl=bySuit.find(x=>x.length===4);keep=fl||[...h].sort((a,b)=>b.r-a.r).slice(0,2);}return [...keep,...Array.from({length:5-keep.length},()=>deck.pop())];}
const PK={};
ACT.pkStart=async()=>{const st=await tvStakePay('poker');if(!st)return;const deck=newDeck();Object.assign(PK,{deck,me:[],pete:[],sal:[],hold:[false,false,false,false,false],st,phase:'draw',msg:'Tap cards to hold them, then draw.'});
  for(let i=0;i<5;i++){PK.me.push(deck.pop());PK.pete.push(deck.pop());PK.sal.push(deck.pop());}pkShow();};
function pkShow(){const done=PK.phase==='done';const name=h=>HAND_NAMES[evalHand(h)[0]];openModal(`<div class="tvGame"><h2>Pirate Poker</h2><p class="tiny muted">Ante ${PK.st} each · pot ${PK.st*3}</p>
  <div class="hand"><small>Old Pete${done?` · ${name(PK.pete)}`:''}</small><div>${PK.pete.map(c=>cardHtml(c,!done)).join('')}</div></div>
  <div class="hand"><small>One-Eyed Sal${done?` · ${name(PK.sal)}`:''}</small><div>${PK.sal.map(c=>cardHtml(c,!done)).join('')}</div></div>
  <div class="hand"><small>You · ${name(PK.me)}</small><div>${PK.me.map((c,i)=>cardHtml(c,false,PK.hold[i]&&!done,done?null:i)).join('')}</div></div>
  <p class="gameMsg">${PK.msg}</p><div class="row">${done?`<button class="btn primary" data-act="pkStart">Deal again (${tvStakeNow()})</button><button class="btn ghost" data-act="closeModal">Leave</button>`:'<button class="btn primary" data-act="pkDraw">Draw</button>'}</div></div>`);}
ACT.pkHold=d=>{if(PK.phase!=='draw')return;PK.hold[+d.i]=!PK.hold[+d.i];pkShow();};
ACT.pkDraw=async()=>{if(PK.phase!=='draw')return;PK.me=PK.me.map((c,i)=>PK.hold[i]?c:PK.deck.pop());PK.pete=botDraw(PK.pete,PK.deck);PK.sal=botDraw(PK.sal,PK.deck);PK.phase='done';const T=TV().poker||{};
  const hs=[['me',evalHand(PK.me)],['pete',evalHand(PK.pete)],['sal',evalHand(PK.sal)]];const best=hs.reduce((a,x)=>cmpHand(x[1],a[1])>0?x:a,hs[0]);const winners=hs.filter(x=>cmpHand(x[1],best[1])===0).map(x=>x[0]);
  const pot=PK.st*3;if(winners.includes('me')){const share=Math.floor(pot*.97/winners.length);PK.msg=winners.length>1?`Split pot: +${share-PK.st} ${CN}. ${esc(T.split||'')}`:`You win with ${HAND_NAMES[evalHand(PK.me)[0]].toLowerCase()}: +${share-PK.st} ${CN}. ${esc(T.win||'')}`;await tvPayout('poker',share,'win');}
  else{PK.msg=`${winners[0]==='pete'?'Old Pete':'One-Eyed Sal'} takes it with ${HAND_NAMES[best[1][0]].toLowerCase()}. ${esc(winners[0]==='sal'?(T.lose||''):'He grins with all four teeth.')}`;SND.err();}pkShow();};
