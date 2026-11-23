/* ============================== THE RUSTY ANCHOR TAVERN (Stage 5) ==============================
   A cosy room: crackling fire that grows with today's DMs, rain (or snow) on the windows, Admiral the cat,
   the jukebox, a dartboard and both captains drawn large at the bar. Barnacle Bill, the two-faced landlord,
   gossips from real numbers, asks to borrow money, and runs the drinks and the games.
   Live presence (who's in) uses the game's existing Supabase connection (Realtime presence + broadcast).
   Every doubloon movement is an ordinary spend or claim entry, so balances stay derived like the rest of the game. */
const TV=()=>((CT().lines||{}).bill)||{};
const tvPick=(l,seed)=>l&&l.length?l[(seed==null?Math.floor(Math.random()*l.length):h32(String(seed))%l.length)]:'';
// 21 Nov: the Rusty Anchor never closes
function tvOpenNow(){return true;}
function tvSpends(p){if(!S.days)return [];const k=Object.keys(S.days).length+'|'+(G?G.evs.length:0)+'|'+(G&&G.players[p]?G.players[p].spent:0);tvSpends._c=tvSpends._c||{};const c=tvSpends._c[p];if(c&&c.k===k)return c.v;
  const out=[];for(const id0 in S.days){const d=S.days[id0];if(!d||d.pid!==p||!d.date)continue;for(const id in d.spend||{}){const x=d.spend[id];if(x&&String(x.item).startsWith('tv_'))out.push({id,date:d.date,p,...x});}}
  out.sort((a,b)=>(a.ts||0)-(b.ts||0));tvSpends._c[p]={k,v:out};return out;}
const tvAll=item=>G.P.flatMap(p=>tvSpends(p)).filter(x=>x.item===item);
function tvVars(){const me=S.me,o=other(S.me),D=G.days[G.today]||{p:{}};const nm=p=>C().players[p]?.name||p;
  const best=Math.max(0,...Object.values(G.days).map(x=>x.p&&x.p[me]?x.p[me].d:0));const hr=Date.now()-3600000;
  let fish='';try{const l=G.P.flatMap(p=>fishCatches(p).list.filter(f=>f.date===G.today));if(l.length)fish=l[l.length-1].f.name;}catch(e){}
  return{here:nm(me),absent:nm(o),other:nm(o),dms:(D.p[me]||{}).d||0,odms:(D.p[o]||{}).d||0,left:Math.max(0,(D.target||0)-(D.team||0)),boss:(D.boss&&D.boss.name)||'the boss',best,fish,pace:G.evs.filter(e=>e.pid===o&&e.k==='d'&&e.t>hr).length};}
const tvSay=(l,seed)=>fill(tvPick(l,seed),tvVars());

/* ---------- presence: who's in (Supabase Realtime), 60-second grace ---------- */
const TVP={ch:null,last:{},was:false,clinkT:0,clinkBy:null};
function tvJoin(){if(TVP.ch||!S.sb||!S.me)return;try{const ch=S.sb.channel('hl-tavern',{config:{presence:{key:S.me},broadcast:{self:false}}});
  ch.on('presence',{event:'sync'},()=>{tvPeerCheck();}).on('broadcast',{event:'clink'},m=>{tvClinkFx(m&&m.payload&&m.payload.from);})
    .on('broadcast',{event:'h2h'},m=>{try{h2hRecv(m&&m.payload);}catch(e){}})
    .subscribe(async st=>{if(st==='SUBSCRIBED'){try{await ch.track({at:Date.now()});}catch(e){}}});TVP.ch=ch;}catch(e){console.warn('tavern presence',e);}}
function tvLeave(){if(!TVP.ch)return;try{TVP.ch.untrack();S.sb.removeChannel(TVP.ch);}catch(e){}TVP.ch=null;}
function peerIn(){if(S.tvFakePeer)return true;const o=other(S.me);try{const st=TVP.ch?TVP.ch.presenceState():{};if(st[o]&&st[o].length){TVP.last[o]=Date.now();return true;}}catch(e){}return !!(TVP.last[o]&&Date.now()-TVP.last[o]<60000);}
function tvPeerCheck(){const now=peerIn();if(now&&!TVP.was&&TVS.entered&&Date.now()-TVS.entered>1500){tvSetLine(tvSay(TV().switchIn),'switch');}TVP.was=now;}

/* ---------- Bill's patter ---------- */
const TVS={line:'',kind:'',next:0,whisperAt:0,entered:0,randUsed:false,closingSaid:false,asked:false};
function tvSetLine(t,kind){TVS.line=t;TVS.kind=kind||'';const el=document.querySelector('.billSay p');if(el){el.textContent=t;const b=el.closest('.billSay');b.classList.toggle('whisper',kind==='whisper');b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');}}
function tvNextLine(){const T=TV();const D=G.days[G.today]||{};const lm=L().min;const both=peerIn();
  if(!tvOpenNow())return tvSay(T.closed);
  // no closing time any more, so no last orders
  const pool=[];const add=(w,l)=>{if(l&&l.length)pool.push([w,l]);};
  add(.3,T.gossip);add(.12,both?T.both:T.alone);add(.1,T.fire);add(.08,fireLevel()>.7?T.fireBig:fireLevel()<.25?T.fireLow:null);add(.05,T.cat);
  if(!TVS.randUsed&&TVS.randOk)add(.18,(CT().lines||{}).landlordRandom);
  const v=tvVars();if(v.fish)add(.06,T.gossipFish);if(D.hit)add(.08,T.gossipHit);
  const yd=G.workdays.filter(d=>d<G.today).pop();if(yd&&G.days[yd]&&G.days[yd].target&&G.days[yd].team<G.days[yd].target)add(.08,T.gossipMiss);
  if(typeof legendToday==='function'&&legendToday())add(.1,T.gossipLegend);if(xmasNowSafe())add(.15,T.xmas);if(lm>=1200)add(.06,T.night);if(THEME.weather==='storm')add(.2,T.storm);
  const tot=pool.reduce((a,x)=>a+x[0],0);let r=Math.random()*tot;for(const [w,l] of pool){if((r-=w)<=0){if(l===(CT().lines||{}).landlordRandom)TVS.randUsed=true;let s=tvSay(l);if(!v.fish&&s.includes('{fish}'))s=tvSay(T.alone);return s;}}return tvSay(T.alone);}
function tvTick(){if(S.screen!=='tavern'||!G)return;const now=Date.now();tvPeerCheck();
  if(now>TVS.next){tvSetLine(tvNextLine(),'');TVS.next=now+22000+Math.random()*9000;}
  if(peerIn()&&tvOpenNow()&&now>TVS.whisperAt){if(TVS.whisperAt){tvSetLine(tvSay(TV().whisper),'whisper');TVS.next=now+15000;}TVS.whisperAt=now+120000+Math.random()*120000;}}
setInterval(tvTick,1000);
function tvEnter(){TVS.entered=Date.now();TVS.randUsed=false;TVS.randOk=Math.random()<.25;TVS.closingSaid=false;TVS.whisperAt=0;const T=TV();
  tvSetLine(!tvOpenNow()?tvSay(T.closed):peerIn()?tvSay(T.both):tvSay(T.alone),'');TVS.next=Date.now()+16000;TVP.was=peerIn();}

/* ---------- the fire: bigger the more DMs today ---------- */
function fireLevel(){const D=G&&G.days[G.today];if(!D)return .3;const tgt=D.target||100;return clamp(.12+.88*(D.team/tgt),.12,1.15)+(TVS.logBoost||0);}

/* ---------- drinks ---------- */
// 21 Nov: drinks are just for show now: whatever you order sits in your pirate's hand at the bar for the rest of the day.
// (Old orders of Grog, Stout, Mojito and the Captain's Special keep their effects so nothing already bought is lost.)
// the whole cellar; tonight's menu is a rotating pick from it (see tonightsMenu)
const DRINKS=[
  {id:'dk_grog',name:'Grog',kind:'spirit',price:20,glass:'mug',col:'#B8732E',desc:'A tankard of the house grog. Mostly rum, partly regret.'},
  {id:'dk_stout',name:'Kraken Ink Stout',kind:'spirit',price:30,glass:'pint',col:'#2A1A14',desc:'Black as the trench, with a creamy head.'},
  {id:'dk_rum',name:'Spiced Rum',kind:'spirit',price:35,glass:'tumbler',col:'#C9852E',desc:'A short glass of something warming.'},
  {id:'dk_whisky',name:"Old Salty's Whisky",kind:'spirit',price:45,glass:'tumbler',col:'#B9772A',desc:'Aged in a barrel that used to hold anchovies.'},
  {id:'dk_gin',name:'Gunpowder Gin',kind:'spirit',price:35,glass:'tumbler',col:'#DDEFF2',desc:'Goes off with a bang. Metaphorically. Mostly.'},
  {id:'dk_ale',name:"Captain's Cask Ale",kind:'spirit',price:25,glass:'pint',col:'#C98A2E',desc:'Brewed below deck. Tastes like it.'},
  {id:'dk_shandy',name:'Sea Shanty Shandy',kind:'spirit',price:20,glass:'pint',col:'#E8C76A',desc:'Half ale, half lemonade, half singing.'},
  {id:'dk_fog',name:'The Fog Cutter',kind:'spirit',price:40,glass:'tumbler',col:'#B8C4CC',desc:'Clears the head. Then clouds it again.'},
  {id:'dk_mule',name:'Mutiny Mule',kind:'cocktail',price:35,glass:'copper',col:'#E9E2C0',desc:'Ginger, lime and a strong sense of injustice.'},
  {id:'dk_mojito',name:"Mermaid's Mojito",kind:'cocktail',price:40,glass:'tall',col:'#8FD9B0',desc:'Minty, fizzy and suspiciously sparkly.'},
  {id:'dk_colada',name:'Kraken Colada',kind:'cocktail',price:45,glass:'tall',col:'#C9A0E8',desc:'Pineapple, coconut and a tentacle garnish.'},
  {id:'dk_triangle',name:'Bermuda Triangle',kind:'cocktail',price:45,glass:'coupe',col:'#5FB8E0',desc:'Three rums go in. Nobody knows where they go.'},
  {id:'dk_plank',name:'Walk the Plank',kind:'cocktail',price:35,glass:'tumbler',col:'#F2913A',desc:'Orange, bitter, and you don\'t get a choice.'},
  {id:'dk_sunset',name:'Sunset on the Poop Deck',kind:'cocktail',price:40,glass:'tall',col:'#F26A4A',desc:'Tastes better than it sounds. It would have to.'},
  {id:'dk_bellini',name:'Barnacle Bellini',kind:'cocktail',price:40,glass:'flute',col:'#F7C59A',desc:'Peach, bubbles and one barnacle (decorative).'},
  {id:'dk_shiver',name:'Shiver Me Timbers',kind:'cocktail',price:35,glass:'coupe',col:'#BFE6F2',desc:'Served over a small iceberg.'},
  {id:'dk_scurvy',name:'The Scurvy Cure',kind:'cocktail',price:30,glass:'tall',col:'#A6D94A',desc:'Mostly lime. Some cure.'},
  {id:'dk_parrot',name:'Parrot Juice',kind:'cocktail',price:30,glass:'tall',col:'#F2C43A',desc:'No parrots were harmed. One was annoyed.'},
  {id:'dk_plunder',name:'The Plunderita',kind:'cocktail',price:40,glass:'coupe',col:'#D8E86A',desc:'Salt on the rim, gold in the glass (it\'s lime).'},
  {id:'dk_locker',name:"Davy Jones's Punch",kind:'cocktail',price:45,glass:'cup',col:'#6A2A4A',desc:'Ladled from a chest. Do not ask whose chest.'},
  {id:'dk_cocoa',name:'Hot Cocoa',kind:'spirit',price:25,glass:'cup',col:'#6A3A22',desc:'With a splash. Bill won\'t say of what.'},
  {id:'bilge',name:'Bilge Water',kind:'house',price:0,glass:'tin',col:'#7A8A5A',desc:'Free. You get what you pay for.'},
  {id:'sherry',name:"Bryn's Mum's Sherry",kind:'house',price:50,glass:'sherry',col:'#8A2A3A',desc:'December only. The parrot sings a carol.',xmas:true}];
// tonight's menu: four cocktails and three spirits, a new pick every day, plus Bilge Water (and the sherry in December)
function tonightsMenu(date){date=date||(G?G.today:'');const pick=(kind,n)=>DRINKS.filter(d=>d.kind===kind).map(d=>({d,k:h32(date+d.id+'menu')})).sort((a,b)=>a.k-b.k).slice(0,n).map(x=>x.d);
  return {cocktails:pick('cocktail',4),spirits:pick('spirit',3),house:DRINKS.filter(d=>d.kind==='house'&&(!d.xmas||xmasNowSafe()))};}
const DRINK_BY=Object.fromEntries(DRINKS.map(d=>[d.id,d]));
const hourEnd=x=>Math.min((x.ts||0)+3600000,londonTs(x.date,1439)+60000);
function stoutUsed(x,p){return stoutDay(x,p)!=null;}
function stoutDay(x,p){const pm=(x.ts||0)-londonTs(x.date,0);for(const d of Object.keys(G.days).sort()){if(d<x.date||d>G.today)continue;const D=G.days[d];if(!D||!D.target||D.team<D.target||!(D.p[p]&&D.p[p].d>0))continue;if(d===x.date&&(D.hitMin==null||D.hitMin*60000<pm))continue;return d;}return null;}
function mojitoTrip(x,p){try{const tr=fishTripsOf(G.players[p].sessions,S.players[p]?.lock).find(t=>t.s>=(x.ts||0));return tr||null;}catch(e){return null;}}
function activeBoost(p){const now=Date.now();const mine=tvSpends(p);
  const g=mine.filter(x=>x.item==='tv_grog').find(x=>now<hourEnd(x));if(g)return{kind:'grog',until:hourEnd(g),x:g};
  const sp=tvAll('tv_special').find(x=>now<hourEnd(x));if(sp)return{kind:'special',until:hourEnd(sp),x:sp};
  const st=mine.filter(x=>x.item==='tv_stout').find(x=>!stoutUsed(x,p));if(st)return{kind:'stout',x:st};
  const mj=mine.filter(x=>x.item==='tv_mojito').find(x=>{const tr=mojitoTrip(x,p);return !tr||tr.e===Infinity||tr.e>now;});if(mj)return{kind:'mojito',x:mj};return null;}
function boostText(b){if(!b)return '';const m=b.until?Math.max(1,Math.round((b.until-Date.now())/60000)):0;return b.kind==='grog'?`Grog: +5% XP for ${m} more min`:b.kind==='special'?`Captain's Special: +5% XP for ${m} more min`:b.kind==='stout'?'Kraken Ink Stout: next boss you sink pays double':"Mermaid's Mojito: double variant chance on your next trip";}
function chipDays(p){return new Set(tvSpends(p).filter(x=>x.item==='tv_chip').map(x=>x.date));}
// Gary keeps his beak shut on a Chip Shot day
{const _remT=reminder;reminder=function(){try{if(G&&S.me&&chipDays(S.me).has(G.today))return null;}catch(e){}return _remT.apply(this,arguments);};}

/* claims that come due: boost XP after the hour, the Stout bonus, Bill's paybacks are claimed by hand */
async function tvSettle(){if(!G||!S.me||S.readOnly)return;const me=G.players[S.me];if(!me)return;const now=Date.now();const out={};
  [...tvSpends(S.me).filter(x=>x.item==='tv_grog'),...tvAll('tv_special')].forEach(x=>{const key='tv_bx_'+x.id;if(me.claimed.has(key)||now<hourEnd(x))return;const end=hourEnd(x);
    const xp=G.evs.filter(e=>e.t>=x.ts&&e.t<end&&(e.pid===S.me||SHARED_K[e.k])).reduce((a,e)=>a+(KINDS[e.k]?.xp||0),0);out[key]={xp:Math.round(xp*.05),g:0,ts:now,boost:x.item};});
  tvSpends(S.me).filter(x=>x.item==='tv_stout').forEach(x=>{const key='tv_st_'+x.id;if(me.claimed.has(key))return;const d=stoutDay(x,S.me);if(d)out[key]={xp:0,g:30,ts:now,day:d};});
  const keys=Object.keys(out);if(!keys.length)return;try{await writeDay(S.me,G.today,{bonus:out});const xp=keys.reduce((a,k)=>a+(out[k].xp||0),0),g=keys.reduce((a,k)=>a+(out[k].g||0),0);
    toast(`<b>From the Rusty Anchor:</b> ${xp?`+${xp} XP from your drink boost`:''}${xp&&g?' and ':''}${g?`+${g} ${CN} from the Kraken Ink Stout`:''}.`);}catch(e){}}
setInterval(()=>{try{tvSettle();}catch(e){}},45000);setTimeout(()=>{try{tvSettle();}catch(e){}},8000);

ACT.tvDrink=async d=>{const dr=DRINK_BY[d.id];if(!dr)return;const me=G.players[S.me];
  if(dr.xmas&&!xmasNowSafe())return toast('<b>December only.</b> Bryn\'s Mum keeps the sherry locked up the rest of the year.','joke');
  if(me.balance<dr.price)return toast('<b>Not enough doubloons.</b> Bill offers to start a tab. Don\'t.','joke');
  try{await writeDay(S.me,G.today,{spend:{[uid()]:{item:'tv_'+dr.id,cost:dr.price,ts:Date.now()}}});SND.coin();tvSetLine(fill(TV().drinks?.[dr.id.replace('dk_','')]||tvPick(TV().drinkAny||['Coming right up.','One '+dr.name+'. Pay the parrot.','There you go. Don\'t tell the cat.']),tvVars()),'');TVS.next=Date.now()+20000;
    if(dr.id==='sherry')sherryCard();TVS.cheerT=Date.now();}catch(e){writeFail(e);}};
// the drink in each captain's hand: the last one they ordered today
function drinkInHand(p){try{const l=tvSpends(p).filter(x=>x.date===G.today&&/^tv_(dk_|bilge|sherry|grog|stout|mojito)/.test(x.item));if(!l.length)return null;const id=l[l.length-1].item.slice(3);return DRINK_BY[id]||DRINK_BY['dk_'+id]||null;}catch(e){return null;}}
function sherryCard(){jukeOnce('wewish');openModal(`<div class="mrsB"><h2>A card from Mrs B</h2><p><i>To my favourite captain (don't tell the other one),</i></p><p>Merry Christmas, pet. Send your DMs, eat your sprouts, and stay away from my fishing spot. I mean it.</p><p style="text-align:right">Love, Mrs B. x</p><p class="tiny muted">Your parrot is singing a carol. Badly. Lovingly.</p><button class="btn" data-act="closeModal">Lovely</button></div>`);}
ACT.closeModal=()=>closeModal();

/* ---------- Bill's money asks and his loyalty ledger ---------- */
function loans(p){return tvSpends(p).filter(x=>x.item==='tv_loan');}
function loanWeek(p){const ws=weekStart(G.today);return loans(p).filter(x=>x.date>=ws).reduce((a,x)=>a+(x.cost||0),0);}
function askToday(){if(!G||!S.me||!tvOpenNow())return null;const me=G.players[S.me];const today=G.today;if(me.claimed.has('tv_no_'+today)||loans(S.me).some(x=>x.date===today))return null;
  if(loanWeek(S.me)>=200||h32(today+S.me+'ask')%100>=40)return null;const T=TV();const pool=xmasNowSafe()?[...(T.asks||[]),...(T.asksXmas||[])]:T.asks;return fill(tvPick(pool,today+S.me),tvVars());}
ACT.tvLend=async d=>{const n=+d.n;const me=G.players[S.me];const cap=200-loanWeek(S.me);
  try{if(!n){await writeDay(S.me,G.today,{bonus:{['tv_no_'+G.today]:{xp:0,g:0,ts:Date.now()}}});tvSetLine(tvSay(TV().askNo),'');}
    else{const amt=Math.min(n,cap);if(me.balance<amt)return toast('<b>You\'re skint.</b> Bill looks at you with pity, then asks anyway.','joke');await writeDay(S.me,G.today,{spend:{[uid()]:{item:'tv_loan',cost:amt,ts:Date.now()}}});tvSetLine(tvSay(TV().askYes),'');SND.coin();}
    TVS.next=Date.now()+20000;}catch(e){writeFail(e);}};
const TV_ITEMS=[{id:'flag_rusty',name:'The Rusty Anchor',cat:'flag',col:'#7A3E22',sym:'anchor',sc:'#F2C462'},{id:'fig_medallion',name:"Bill's Lucky Medallion",cat:'figure',st:'medallion'}];
TV_ITEMS.forEach(i=>{i.tavern=true;i.lvl=1;if(!ALL_ITEMS[i.id]){ITEMS.push(i);ALL_ITEMS[i.id]=i;}});
{const _shopTV=SCREENS.shop;if(_shopTV)SCREENS.shop=function(){const me=G&&G.players[S.me];const keep=ITEMS.slice();ITEMS.length=0;keep.forEach(i=>{if(!i.tavern||(me&&me.owned[i.id]))ITEMS.push(i);});try{return _shopTV.apply(this,arguments);}finally{ITEMS.length=0;keep.forEach(i=>ITEMS.push(i));}};}
function paybacks(){const me=G.players[S.me];const n=Math.floor(loans(S.me).length/5);const out=[];for(let k=1;k<=n;k++){const key='tv_pay_'+k;if(!me.claimed.has(key))out.push({k,key,item:k===1?'flag_rusty':k===2?'fig_medallion':null,g:k>=3?150:0});}return out;}
ACT.tvPayback=async d=>{const pb=paybacks().find(x=>x.key===d.key);if(!pb)return;try{await writeDay(S.me,G.today,{bonus:{[pb.key]:{xp:0,g:pb.g,ts:Date.now(),item:pb.item||''}}});SFX.ach();
  if(pb.item){banner('NEW '+ALL_ITEMS[pb.item].name.toUpperCase(),'From Barnacle Bill');}else toast(`<b>Bill pays you back.</b> +${pb.g} ${CN}. Nobody is more surprised than him.`);tvSetLine(tvSay(TV().payback),'');}catch(e){writeFail(e);}};
const _deriveTV=derive;derive=function(){const g=_deriveTV.apply(this,arguments);try{g.P.forEach(p=>{const pl=g.players[p];if(!pl)return;if(pl.claimed.has('tv_pay_1'))pl.owned.flag_rusty=1;if(pl.claimed.has('tv_pay_2'))pl.owned.fig_medallion=1;});}catch(e){}return g;};

/* ---------- achievements: I Was Thirsty, Bill's Pension Plan ---------- */
{const _fmT=fishMetrics;fishMetrics=function(p){const m=_fmT.apply(this,arguments)||{};try{let b=0,l=0;for(const k in S.days){const d=S.days[k];if(!d||d.pid!==p)continue;for(const id in d.spend||{}){const x=d.spend[id];if(!x)continue;if(x.item==='tv_bilge')b++;if(x.item==='tv_loan')l++;}}m.bilge=b;m.lent=l;}catch(e){}return m;};}
[['thirsty','I Was Thirsty','Order a Bilge Water at the Rusty Anchor','common','Secret',['bilge',1],'Ask the landlord for the cheapest thing on the menu.'],['pension','Bill\'s Pension Plan','Lend Barnacle Bill money 10 times','rare','Secret',['lent',10],'Somebody has to keep the pub afloat.']]
 .forEach(([id,name,desc,rar,cat,[metric,target],reveal])=>{if(ACH_BY_ID[id])return;const a={id,name,desc,rar,cat,metric,target,secret:true,reveal};ACHIEVEMENTS.push(a);ACH_BY_ID[id]=a;});

/* ---------- Mermaid's Mojito: a second variant roll on the next trip ---------- */
{const _cfM=computeFish;computeFish=function(p,evs,sessions,lock){const v=_cfM.apply(this,arguments);try{const mj=tvSpends(p).filter(x=>x.item==='tv_mojito');if(!mj.length)return v;const trips=fishTripsOf(sessions,lock);
  const wins=mj.map(x=>trips.find(t=>t.s>=(x.ts||0))).filter(Boolean);if(!wins.length)return v;const key=wins.map(t=>t.s).join()+'|'+v.list.length;if(v.__mj===key)return v;
  wins.forEach(tr=>{v.list.forEach(f=>{if(f.v||f.t<tr.s||f.t>tr.e||FISH_RI[f.f.rar]>=4)return;const q=h32(f.id+'mojito')/4294967296/(tr.bait==='lure'?3:1);const nv=q<.004?'r':q<.015?'a':q<.032?'g':'';if(nv){f.v=nv;f.mojito=1;v.vars[f.f.id+'~'+nv]=(v.vars[f.f.id+'~'+nv]||0)+1;}});});v.__mj=key;}catch(e){}return v;};}

/* ---------- Christmas stockings: fill with each target day 1 to 24 December, open on the last working day before Christmas ---------- */
function stockingState(p){const y=G.today.slice(0,4);const days=Object.values(G.days).filter(D=>D.date>=y+'-12-01'&&D.date<=y+'-12-24'&&D.target&&D.team>=D.target).length;
  let open=y+'-12-24';while(!isWork(open)&&open>y+'-12-18')open=addDays(open,-1);const key='stk'+y;return{n:days,open,key,can:G.today>=open&&G.today<=y+'-12-31'&&!G.players[p].claimed.has(key),done:G.players[p].claimed.has(key),g:20*days,xp:30*days};}
ACT.tvStocking=async()=>{const st=stockingState(S.me);if(!st.can)return;try{await writeDay(S.me,G.today,{bonus:{[st.key]:{xp:st.xp,g:st.g,ts:Date.now()}}});SFX.ach();banner('YOUR STOCKING',`+${st.g} doubloons, +${st.xp} XP`);}catch(e){writeFail(e);}};

/* ---------- wall of the Captain's Special ---------- */
function wallNames(){return tvAll('tv_special').map(x=>({p:x.p,date:x.date})).reverse();}

/* ---------- darts: one free throw a day ---------- */
ACT.tvDarts=()=>{const key='tv_dart_'+G.today;if(G.players[S.me].claimed.has(key))return toast('<b>One throw a day.</b> Bill has hidden the darts.','joke');
  openModal(`<div class="tvGame"><h2>Darts</h2><canvas id="dartCv" width="480" height="360"></canvas><p id="dartMsg" class="tiny">One free throw a day. Bullseye pays 50, the outer ring 10.</p><div class="row"><button class="btn primary" data-act="tvThrow">Throw</button><button class="btn ghost" data-act="closeModal">Not today</button></div></div>`);setTimeout(()=>drawDart(null,0),30);};
function drawDart(hitPt,u){const cv=document.getElementById('dartCv');if(!cv)return;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);c.fillStyle='#5A3A26';c.fillRect(0,0,240,180);c.fillStyle='rgba(0,0,0,.18)';for(let i=0;i<8;i++)c.fillRect(0,i*24,240,1);
  const cx=120,cy=86;disc(c,cx,cy,62,'#1E1A16');for(let i=0;i<20;i++){c.fillStyle=i%2?'#F2E6C8':'#22201C';c.beginPath();c.moveTo(cx,cy);c.arc(cx,cy,52,i*Math.PI/10-Math.PI/20,(i+1)*Math.PI/10-Math.PI/20);c.fill();}
  c.lineWidth=5;for(let i=0;i<20;i++){c.strokeStyle=i%2?'#2F8F4E':'#C8102E';c.beginPath();c.arc(cx,cy,49,i*Math.PI/10-Math.PI/20,(i+1)*Math.PI/10-Math.PI/20);c.stroke();c.beginPath();c.arc(cx,cy,30,i*Math.PI/10-Math.PI/20,(i+1)*Math.PI/10-Math.PI/20);c.stroke();}
  disc(c,cx,cy,7,'#2F8F4E');disc(c,cx,cy,3.4,'#C8102E');
  if(hitPt){const x=240+(hitPt[0]-240)*u,y=hitPt[1]-(1-u)*30-Math.sin(u*Math.PI)*20;
    // 23 Nov: the dart is drawn with its tip exactly on the point that was scored (it used to be drawn 19px off, tail first)
    if(u>=1){c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.arc(hitPt[0],hitPt[1],1.6,0,Math.PI*2);c.fill();}
    c.save();c.translate(x,y);c.rotate(-.5);R(c,5,-1,14,2,'#C9CDD4');poly(c,[[16,-3],[22,-3.6],[22,3.6],[16,3]],'#C8102E');poly(c,[[5,-1.6],[0,0],[5,1.6]],'#8A9099');c.restore();}}
ACT.tvThrow=async()=>{const key='tv_dart_'+G.today;if(G.players[S.me].claimed.has(key))return;const r=Math.random();const res=r<.08?'bull':r<.38?'ring':'miss';
  const a=Math.random()*Math.PI*2;
  // where it lands always matches what it pays: bull = the green and red centre (r<=7), ring = the outer red/green double ring (r 46.5 to 51.5), miss = the plain board or off it
  const rad=res==='bull'?Math.random()*5.5:res==='ring'?47.3+Math.random()*3.4:(Math.random()<.45?64+Math.random()*14:9+Math.random()*35);
  const pt=[120+Math.cos(a)*rad,86+Math.sin(a)*rad];const t0=performance.now();const g=res==='bull'?50:res==='ring'?10:0;
  try{await writeDay(S.me,G.today,{bonus:{[key]:{xp:0,g,ts:Date.now(),darts:res}}});}catch(e){return writeFail(e);}
  const step=()=>{const u=Math.min(1,(performance.now()-t0)/450);drawDart(pt,u);if(u<1)requestAnimationFrame(step);else{SND.pop();const D=TV().darts||{};const m=document.getElementById('dartMsg');if(m)m.innerHTML=`<b>${res==='bull'?'+50 '+CN:res==='ring'?'+10 '+CN:'Nothing.'}</b> ${esc(res==='miss'?tvPick(D.miss):D[res]||'')}`;document.querySelector('[data-act="tvThrow"]')?.setAttribute('disabled','');}};step();};
