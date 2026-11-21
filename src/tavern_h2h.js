/* ============================== THE RUSTY ANCHOR: HEAD TO HEAD (21 Nov) ==============================
   When you're both in the Tavern you can challenge each other, live, for doubloons: Liar's Dice, five-card Poker and a
   three-dart Darts duel. The one who challenges hosts the game: they shuffle and roll, apply both players' moves and send
   the table to the other after every move over the Tavern's existing Supabase channel. Each of you pays your own stake
   when the game starts; the winner claims both stakes (a draw hands each stake back). A game left half way refunds both. */
const H2H_GAMES=[
  {id:'dice',name:"Liar's Dice",desc:'Five dice each under the cup. Bid on what\'s under both cups, or call the other a liar.'},
  {id:'poker',name:'Poker',desc:'Five-card draw, heads up. Hold what you like, draw once, best hand takes both stakes.'},
  {id:'darts',name:'Darts duel',desc:'Three darts each. Highest total wins.'}];
const H2H={g:null,invite:null,sent:null,paid:{},settled:{}};
// local practice mode: two tabs talk over a BroadcastChannel so the head-to-head games can be tried without Supabase
const TVNET={bc:null};
function tvNetInit(){if(TVNET.bc||S.mode!=='local'||typeof BroadcastChannel==='undefined')return;try{TVNET.bc=new BroadcastChannel('hl-tavern');TVNET.bc.onmessage=m=>{const d=m.data||{};if(d.ev==='here'){if(d.payload&&d.payload.from&&d.payload.from!==S.me)TVP.last[d.payload.from]=Date.now();}else if(d.ev==='h2h')h2hRecv(d.payload);else if(d.ev==='clink')tvClinkFx(d.payload&&d.payload.from);};}catch(e){}}
setInterval(()=>{try{tvNetInit();if(TVNET.bc&&S.screen==='tavern'&&S.me)TVNET.bc.postMessage({ev:'here',payload:{from:S.me}});}catch(e){}},2000);
function h2hSend(p){p.from=S.me;try{if(TVP.ch)TVP.ch.send({type:'broadcast',event:'h2h',payload:p});}catch(e){}try{if(TVNET.bc)TVNET.bc.postMessage({ev:'h2h',payload:p});}catch(e){}}
{const _ch=ACT.tvCheers;ACT.tvCheers=function(){_ch.apply(this,arguments);try{if(TVNET.bc)TVNET.bc.postMessage({ev:'clink',payload:{from:S.me}});}catch(e){}};}

const h2hName=id=>(H2H_GAMES.find(g=>g.id===id)||{}).name||'a game';
ACT.h2hInvite=d=>{if(!peerIn())return toast(`<b>${esc(pnameRaw(other(S.me)))} isn't in the Tavern.</b>`,'joke');if(H2H.g&&!H2H.g.done)return toast('<b>Finish this game first.</b>','joke');
  const stake=tvStakeNow();const me=G.players[S.me];if(me.balance<stake)return toast('<b>Not enough doubloons for that stake.</b>','joke');if(tvStakedToday()+stake>TV_DAY_CAP)return toast(`<b>That's your lot for today.</b> ${fmtN(TV_DAY_CAP)} a day.`,'joke');
  const id='h'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);H2H.sent={id,game:d.g,stake,at:Date.now()};h2hSend({t:'invite',id,game:d.g,stake});
  openModal(`<div class="tvGame"><h2>${h2hName(d.g)}</h2><p>Challenge sent to <b>${esc(pnameRaw(other(S.me)))}</b> for <b>${fmtN(stake)} ${CN}</b> each.</p><p class="tiny muted">Waiting for them to accept...</p><div class="row"><button class="btn ghost" data-act="h2hCancel">Cancel</button></div></div>`);};
ACT.h2hCancel=()=>{if(H2H.sent){h2hSend({t:'decline',id:H2H.sent.id,cancel:true});H2H.sent=null;}closeModal();};
ACT.h2hAccept=async()=>{const iv=H2H.invite;if(!iv)return;H2H.invite=null;const paid=await tvStakePay('h2h_'+iv.game,iv.stake);if(!paid){h2hSend({t:'decline',id:iv.id});closeModal();return;}
  H2H.paid[iv.id]=iv.stake;h2hSend({t:'accept',id:iv.id});openModal(`<div class="tvGame"><h2>${h2hName(iv.game)}</h2><p class="tiny muted">Shuffling...</p></div>`);};
ACT.h2hDecline=()=>{const iv=H2H.invite;if(iv)h2hSend({t:'decline',id:iv.id});H2H.invite=null;closeModal();};
ACT.h2hLeave=()=>{const g=H2H.g;if(g&&!g.done){h2hSend({t:'abort',id:g.id});h2hRefund(g.id);}H2H.g=null;closeModal();};

async function h2hRefund(id){const amt=H2H.paid[id];if(!amt||H2H.settled[id])return;H2H.settled[id]=1;try{await writeDay(S.me,G.today,{bonus:{['tv_h2hr_'+id]:{xp:0,g:amt,ts:Date.now(),game:'h2h_refund'}}});toast(`<b>Game abandoned.</b> Your ${fmtN(amt)} ${CN} stake is back.`);}catch(e){writeFail(e);}}
async function h2hSettle(g){if(!g.done||H2H.settled[g.id]||!H2H.paid[g.id])return;H2H.settled[g.id]=1;const st=g.stake;let amt=0,note='';
  if(g.winner===S.me){amt=st*2;note='win';}else if(g.winner==='draw'){amt=st;note='draw';}
  if(amt){try{await writeDay(S.me,G.today,{bonus:{['tv_h2h_'+g.id]:{xp:0,g:amt,ts:Date.now(),game:'h2h_'+g.game,note}}});SND.coin();}catch(e){writeFail(e);}}else SND.err();}

/* ---------- messages ---------- */
async function h2hRecv(p){if(!p||!G||!S.me||p.from===S.me)return;const o=other(S.me);if(p.from!==o)return;
  if(p.t==='invite'){if(H2H.g&&!H2H.g.done){h2hSend({t:'decline',id:p.id,busy:true});return;}H2H.invite=p;SND.pop();
    openModal(`<div class="tvGame"><h2>${esc(pnameRaw(o))} challenges you</h2><p><b>${h2hName(p.game)}</b> for <b>${fmtN(p.stake)} ${CN}</b> each. Winner takes ${fmtN(p.stake*2)}.</p><p class="tiny muted">${esc((H2H_GAMES.find(g=>g.id===p.game)||{}).desc||'')}</p><div class="row"><button class="btn primary" data-act="h2hAccept">Accept</button><button class="btn ghost" data-act="h2hDecline">Not now</button></div></div>`);}
  else if(p.t==='decline'){if(H2H.sent&&H2H.sent.id===p.id){H2H.sent=null;closeModal();if(!p.cancel)toast(`<b>${esc(pnameRaw(o))} ${p.busy?'is in another game':'said not now'}.</b>`,'joke');}else if(H2H.invite&&H2H.invite.id===p.id){H2H.invite=null;closeModal();}}
  else if(p.t==='accept'){const sv=H2H.sent;if(!sv||sv.id!==p.id)return;H2H.sent=null;const paid=await tvStakePay('h2h_'+sv.game,sv.stake);if(!paid){h2hSend({t:'abort',id:sv.id});return;}
    H2H.paid[sv.id]=sv.stake;H2H.g=h2hNew(sv,S.me,o);h2hPush();}
  else if(p.t==='state'){const g=p.g;if(!g||(H2H.g&&H2H.g.host===S.me))return;H2H.g=g;h2hShow();if(g.done)h2hSettle(g);}
  else if(p.t==='act'){const g=H2H.g;if(!g||g.host!==S.me||g.id!==p.id||g.done)return;h2hApply(g,p.from,p.a);h2hPush();}
  else if(p.t==='abort'){if(H2H.g&&H2H.g.id===p.id&&!H2H.g.done){H2H.g=null;closeModal();}h2hRefund(p.id);}}
function h2hPush(){const g=H2H.g;if(!g)return;h2hSend({t:'state',g});h2hShow();if(g.done)h2hSettle(g);}
function h2hAct(a){const g=H2H.g;if(!g||g.done)return;if(g.host===S.me){h2hApply(g,S.me,a);h2hPush();}else h2hSend({t:'act',id:g.id,a});}

/* ---------- the games (the host runs these) ---------- */
function h2hNew(sv,host,guest){const g={id:sv.id,game:sv.game,stake:sv.stake,host,guest,P:[host,guest],done:false,winner:null,msg:'',log:[]};
  if(g.game==='dice'){g.dice={[host]:roll5(),[guest]:roll5()};g.turn=host;g.bid=null;g.by=null;g.msg=`${pnameRaw(host)} bids first.`;}
  else if(g.game==='poker'){const deck=newDeck();g.hands={[host]:[],[guest]:[]};for(let i=0;i<5;i++){g.hands[host].push(deck.pop());g.hands[guest].push(deck.pop());}g.deck=deck;g.drawn={};g.msg='Tap cards to hold them, then draw.';}
  else if(g.game==='darts'){g.throws={[host]:[],[guest]:[]};g.msg='Three darts each.';}
  return g;}
function dartScore(){const r=Math.random();if(r<.04)return{v:50,l:'Bull!'};if(r<.1)return{v:25,l:'Outer bull'};const n=1+Math.floor(Math.random()*20);if(r<.18)return{v:n*3,l:'Treble '+n};if(r<.26)return{v:n*2,l:'Double '+n};if(r<.9)return{v:n,l:String(n)};return{v:0,l:'Missed the board'};}
function h2hApply(g,who,a){const nm=p=>pnameRaw(p);const o=g.P.find(p=>p!==who);
  if(g.game==='dice'){if(a.k==='bid'){if(g.turn!==who)return;const q=+a.q,f=+a.f;if(!(q>=1&&q<=10&&f>=1&&f<=6))return;if(g.bid&&!(q>g.bid.q||(q===g.bid.q&&f>g.bid.f)))return;g.bid={q,f};g.by=who;g.turn=o;g.msg=`${nm(who)} bids ${q} × ${f}s. ${nm(o)}: raise, or call them a liar.`;}
    else if(a.k==='call'){if(g.turn!==who||!g.bid)return;const total=[...g.dice[g.host],...g.dice[g.guest]].filter(d=>d===g.bid.f).length;const bidTrue=total>=g.bid.q;g.winner=bidTrue?g.by:who;g.done=true;
      g.msg=`${nm(who)} calls LIAR! There ${total===1?'is':'are'} ${total} × ${g.bid.f}s under the cups, so ${nm(g.winner)} wins ${fmtN(g.stake*2)} doubloons.`;}}
  else if(g.game==='poker'){if(a.k!=='draw'||g.drawn[who])return;const h=g.hands[who];g.hands[who]=h.map((c,i)=>a.hold&&a.hold[i]?c:g.deck.pop());g.drawn[who]=true;g.msg=`${nm(who)} has drawn.`;
    if(g.drawn[g.host]&&g.drawn[g.guest]){const eh=evalHand(g.hands[g.host]),eg=evalHand(g.hands[g.guest]);const c=cmpHand(eh,eg);g.done=true;g.winner=c>0?g.host:c<0?g.guest:'draw';
      g.msg=g.winner==='draw'?`Both ${HAND_NAMES[eh[0]].toLowerCase()}. A draw: stakes back.`:`${nm(g.winner)} wins with ${HAND_NAMES[(c>0?eh:eg)[0]].toLowerCase()}: ${fmtN(g.stake*2)} doubloons.`;}}
  else if(g.game==='darts'){if(a.k!=='throw'||g.throws[who].length>=3)return;const d=dartScore();g.throws[who].push(d);g.msg=`${nm(who)}: ${d.l}${d.v?` (${d.v})`:''}.`;
    if(g.throws[g.host].length===3&&g.throws[g.guest].length===3){const th=g.throws[g.host].reduce((s,x)=>s+x.v,0),tg=g.throws[g.guest].reduce((s,x)=>s+x.v,0);g.done=true;g.winner=th>tg?g.host:tg>th?g.guest:'draw';
      g.msg=g.winner==='draw'?`${th} each. A draw: stakes back.`:`${nm(g.winner)} wins ${Math.max(th,tg)} to ${Math.min(th,tg)}: ${fmtN(g.stake*2)} doubloons.`;}}}

/* ---------- the table ---------- */
const H2HUI={q:2,f:3,hold:[false,false,false,false,false]};
function h2hShow(){const g=H2H.g;if(!g)return;const me=S.me,o=g.P.find(p=>p!==me);const nm=p=>esc(pnameRaw(p));let body='';
  if(g.game==='dice'){if(g.bid&&(H2HUI.q<g.bid.q||(H2HUI.q===g.bid.q&&H2HUI.f<=g.bid.f))){H2HUI.q=g.bid.f===6?g.bid.q+1:g.bid.q;H2HUI.f=g.bid.f===6?g.bid.f:g.bid.f+1;}const ok=!g.bid||H2HUI.q>g.bid.q||(H2HUI.q===g.bid.q&&H2HUI.f>g.bid.f);const myTurn=!g.done&&g.turn===me;
    body=`<div class="hand"><small>${nm(o)}'s cup</small><div class="dice">${g.done?g.dice[o].map(d=>dieHtml(d)).join(''):'<span class="cup"></span>'}</div></div>
     <div class="hand"><small>Your dice</small><div class="dice">${g.dice[me].map(d=>dieHtml(d,'mine')).join('')}</div></div>
     ${g.bid?`<p class="ldBid">Current bid: <b>${g.bid.q} × ${pips[g.bid.f]}</b> (${g.by===me?'you':nm(o)})</p>`:''}
     ${myTurn?`<div class="row ldPick"><span class="tiny">Bid</span><button class="chip" data-act="h2hQ" data-v="-1">−</button><b>${H2HUI.q}</b><button class="chip" data-act="h2hQ" data-v="1">+</button><span class="tiny">of</span>${[1,2,3,4,5,6].map(f=>`<button class="chip ${H2HUI.f===f?'on':''}" data-act="h2hF" data-v="${f}">${pips[f]}</button>`).join('')}</div>
      <div class="row"><button class="btn primary" data-act="h2hBid" ${ok?'':'disabled'}>Bid ${H2HUI.q} × ${pips[H2HUI.f]}</button>${g.bid&&g.by!==me?'<button class="btn" data-act="h2hCall">Liar!</button>':''}</div>`:g.done?'':`<p class="tiny muted">${nm(o)} is thinking...</p>`}`;}
  else if(g.game==='poker'){const mine=g.hands[me],theirs=g.hands[o];const drawn=!!g.drawn[me];
    body=`<div class="hand"><small>${nm(o)}${g.done?` · ${HAND_NAMES[evalHand(theirs)[0]]}`:g.drawn[o]?' · drawn':''}</small><div>${theirs.map(c=>cardHtml(c,!g.done)).join('')}</div></div>
     <div class="hand"><small>You · ${HAND_NAMES[evalHand(mine)[0]]}</small><div>${mine.map((c,i)=>cardHtml(c,false,!drawn&&H2HUI.hold[i],drawn||g.done?null:i).replace('data-act="pkHold"','data-act="h2hHold"')).join('')}</div></div>
     ${!drawn&&!g.done?'<div class="row"><button class="btn primary" data-act="h2hDraw">Draw</button></div>':g.done?'':`<p class="tiny muted">Waiting for ${nm(o)} to draw...</p>`}`;}
  else if(g.game==='darts'){const row=p=>{const l=g.throws[p];const tot=l.reduce((s,x)=>s+x.v,0);return `<div class="li"><span class="grow"><b>${p===me?'You':nm(p)}</b><br><small>${l.map(x=>esc(x.l)).join(' · ')||'No darts yet'}</small></span><b>${tot}</b></div>`;};
    const left=3-g.throws[me].length;body=`<div class="list">${row(me)}${row(o)}</div>${!g.done&&left?`<div class="row"><button class="btn primary" data-act="h2hThrow">Throw (${left} left)</button></div>`:g.done?'':`<p class="tiny muted">Waiting for ${nm(o)}...</p>`}`;}
  const res=g.done?(g.winner===me?'win':g.winner==='draw'?'draw':'lose'):'';
  openModal(`<div class="tvGame h2h ${res}"><h2>${h2hName(g.game)} <small class="muted">vs ${nm(o)}</small></h2><p class="tiny muted">${fmtN(g.stake)} ${CN} each · winner takes ${fmtN(g.stake*2)}</p>${body}<p class="gameMsg">${esc(g.msg||'')}</p>
   <div class="row">${g.done?`<button class="btn primary" data-act="h2hInvite" data-g="${g.game}">Rematch</button><button class="btn ghost" data-act="h2hClose">Leave the table</button>`:'<button class="btn ghost sm" data-act="h2hLeave">Abandon (stakes back)</button>'}</div></div>`);}
ACT.h2hQ=d=>{H2HUI.q=clamp(H2HUI.q+(+d.v),1,10);h2hShow();};ACT.h2hF=d=>{H2HUI.f=+d.v;h2hShow();};
ACT.h2hBid=()=>h2hAct({k:'bid',q:H2HUI.q,f:H2HUI.f});ACT.h2hCall=()=>h2hAct({k:'call'});
ACT.h2hHold=d=>{H2HUI.hold[+d.i]=!H2HUI.hold[+d.i];h2hShow();};ACT.h2hDraw=()=>{const hold=H2HUI.hold.slice();H2HUI.hold=[false,false,false,false,false];h2hAct({k:'draw',hold});};
ACT.h2hThrow=()=>{SND.pop();h2hAct({k:'throw'});};
ACT.h2hClose=()=>{H2H.g=null;H2HUI.q=2;H2HUI.f=3;closeModal();};
