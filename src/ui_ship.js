const CN='<i class="cn" aria-label="doubloons"></i>';
const EQUIP_CATS=['hat','face','coat','hull','sail','flag','figure','trail','shot','moth','effect'];
function itemLocked(it,me){if(it.earn)return (me.earnP?.[it.id]||0)<it.earn[1]?`${fmtN(me.earnP?.[it.id]||0)} / ${fmtN(it.earn[1])} ${it.earn[3]||''}`.trim():'';if(it.track)return me.maxLevel<it.track?`Level ${it.track}`:'';if(it.dtrack&&(me.dist||0)<it.dtrack)return `Distinction ${roman(it.dtrack)}`;if(it.dist&&(me.dist||0)<it.dist)return `Needs Distinction ${roman(it.dist)}`;if(it.lvl&&me.maxLevel<it.lvl)return `Level ${it.lvl}`;return '';}
SCREENS.ship=()=>{
  const pid=S.view.islet||S.me||G.P[0];const me=G.players[pid];const pl=S.players[pid]||{};const mine=pid===S.me;const mode=S.view.shipMode||'ship';
  const st=MOTH_STAGES[me.moth],nx=MOTH_STAGES[me.moth+1];const ff=activeForfeitsFor(pid);
  const show=(pl.showcase&&pl.showcase.length?pl.showcase:ACHIEVEMENTS.filter(a=>me.unlocked[a.id]).sort((a,b)=>RARITIES.indexOf(b.rar)-RARITIES.indexOf(a.rar)).slice(0,3).map(a=>a.id)).filter(id=>me.unlocked[id]);
  const wc=S.view.wardrobe||'hat';
  const owned=Object.keys(me.owned).map(id=>ALL_ITEMS[id]).filter(Boolean);
  const ownedIn=cat=>owned.filter(i=>i.cat===cat);
  const cur=cat=>pl[cat]||SHIP_DEFAULT[cat]||null;
  const slotCat=wc==='deck'?'deck':wc==='decor'?'decor':null;const slots=slotCat?(pl[slotCat]||[]):[];const nSlots=slotCat==='deck'?3:6;
  const nextTrack=TRACK.find(i=>i.track>me.maxLevel);
  return `<div class="pad" style="padding-bottom:0"><div class="row between"><div class="seg" style="flex:1">${G.P.map(p=>`<button class="${p===pid?'on':''}" data-act="viewIslet" data-p="${p}">${pname(p)}</button>`).join('')}</div><div class="seg">${[['ship','Ship'],['hideout','Hideout']].map(([k,n])=>`<button class="${mode===k?'on':''}" data-act="shipMode" data-m="${k}">${n}</button>`).join('')}</div></div></div>
  <canvas id="scene" class="scene" width="960" height="540" aria-label="${pname(pid)}'s ${mode}"></canvas>
  <div class="pad">
   <div class="card hero"><div class="row between"><div><small>${esc(ff.find(f=>f.result==='title')?"Ship's Napper":titleFor(me.li.level))}</small><h2 style="color:${pcol(pid)}">Captain ${pname(pid)}</h2></div>
    <div class="row" style="gap:6px"><span class="pill">Lv ${me.li.level}</span>${me.prest?`<span class="pill" style="color:var(--r-legendary)">${'★'.repeat(Math.min(5,me.prest))}</span>`:''}<span class="pill">🔥 ${me.curStreak}</span><span class="pill">${CN} ${fmtN(me.balance)}</span></div></div>
    <div class="grid3" style="margin-top:10px"><div class="stat"><b class="num">${fmtN(me.counts.d)}</b><small>lifetime DMs</small></div><div class="stat"><b class="num">${Object.keys(me.unlocked).length}</b><small>achievements</small></div><div class="stat"><b class="num">${me.m.cosmetics}</b><small>cosmetics owned</small></div></div>
    ${nextTrack?`<a class="nextReward" href="#log"><canvas class="icon" data-id="${nextTrack.id}"></canvas><div><small>Next reward · level ${nextTrack.track}</small><b>${esc(nextTrack.name)}</b>${bar(me.maxLevel,nextTrack.track)}</div><span class="chev">›</span></a>`:''}</div>
   <div class="card"><div class="row between"><div><small>Companion</small><h3>${esc(pl.mothName||'Polly')} the ${esc(st.name)}</h3></div>${mine?`<button class="btn sm ghost" data-act="renameMoth">Rename</button>`:''}</div>
    <div class="speech" style="margin-top:8px">"${esc(pick(MOTH_LINES,G.today+pid+(me.counts.d>>3)))}"</div>
    <div style="margin-top:8px">${nx?`<small>Grows into a ${esc(nx.name)} at ${fmtN(nx.at)} lifetime DMs</small>${bar(me.counts.d-st.at,nx.at-st.at)}`:'<small>Fully evolved. Sings sea shanties when you send DMs.</small>'}</div></div>
   ${mine?`<div class="card"><div class="row between"><h3>Wardrobe & rigging</h3><a class="btn sm" href="#shop">Shop</a></div>
    <div class="chips" role="tablist">${[...EQUIP_CATS,'deck','decor'].map(k=>`<button class="chip ${wc===k?'on':''}" data-act="wardrobe" data-c="${k}">${CAT_NAMES[k]}</button>`).join('')}</div>
    ${slotCat?`<div class="slots">${Array.from({length:nSlots},(_,i)=>`<button class="slot ${slots[i]?'full':''}" ${slots[i]?`data-act="unplace" data-cat="${slotCat}" data-i="${i}"`:'disabled'} aria-label="${slots[i]?'Remove '+esc(ALL_ITEMS[slots[i]]?.name):'Empty spot'}">${slots[i]?`<canvas class="icon" data-id="${slots[i]}"></canvas><small>${esc(ALL_ITEMS[slots[i]]?.name)}</small>`:`<small>Empty</small>`}</button>`).join('')}</div><small class="tiny">Tap a filled spot to clear it. Tap an item below to place it.</small>`:''}
    <div class="wardrobe">${ownedIn(wc).map(i=>{const on=slotCat?slots.includes(i.id):cur(wc)===i.id;return `<button class="ward ${on?'on':''}" data-act="${slotCat?'place':'equip'}" data-id="${i.id}" data-cat="${wc}" aria-pressed="${on}"><canvas class="icon" data-id="${i.id}"></canvas><span>${esc(i.name)}</span></button>`;}).join('')||`<p class="muted tiny" style="grid-column:1/-1;margin:6px 0">Nothing here yet. Unlock ${esc(CAT_NAMES[wc].toLowerCase())} through levelling or the shop.</p>`}</div></div>`:''}
   <div class="card"><div class="row between"><h3>Pets · ${Object.keys(me.pets).length}/${PETS.length}</h3><a class="btn sm" href="#pets">All pets</a></div><div class="petRow">${Object.keys(me.pets).length?Object.keys(me.pets).map(id=>`<button class="petCard r-${PET_BY_ID[id].rar} ${pl.pet===id?'on':''}" ${mine?`data-act="equipPet" data-pet="${id}"`:'disabled'}><canvas class="petIco" data-pet="${id}" data-sil="0"></canvas><b>${esc(PET_BY_ID[id].name)}</b></button>`).join(''):'<p class="tiny muted" style="margin:6px 0">No pets yet. Watch for the daily sighting on the Harbour.</p>'}</div></div>
   <div class="card"><h3>Showcase</h3><div class="achGrid" style="margin-top:8px">${show.length?show.map(id=>achCard(ACH_BY_ID[id],me)).join(''):'<small>No achievements yet. The first DM unlocks one.</small>'}</div></div>
   <div class="card"><h3>Treasure hoard · ${Object.keys(me.loot).length}/${COLLECTIBLES.length}</h3><div style="display:grid;gap:10px;margin-top:8px">${COLLECT_SETS.map(set=>`<div><small>${esc(set.name)}${set.items.every(([i])=>me.loot[i])?' <b class="done">· complete</b>':''}</small><div class="row" style="gap:6px;margin-top:4px">${set.items.map(([i,n])=>`<canvas class="collect" data-c="${i}" data-f="${me.loot[i]?1:0}" title="${me.loot[i]?esc(n):'Not found yet'}"></canvas>`).join('')}</div></div>`).join('')}</div><small>Treasure drops from logged activity: roughly 1 in 40 DMs, often from responses, always from confirmed meetings and clients.</small></div>
  </div>`;
};
SCREENS.islet=SCREENS.ship;
SCREENS.log=()=>{
  const me=G.players[S.me];const lv=me.maxLevel;
  const rows=[];for(let L=2;L<=100;L++){const items=TRACK.filter(i=>i.track===L);const ti=TITLES.find(t=>t[0]===L);if(items.length||ti||L%10===0)rows.push({L,items,ti});}
  return `<div class="pad"><div class="card hero"><small>Captain's Log · reward track</small><h2>Level ${me.li.level}${me.prest?` <small>(best ${lv})</small>`:''}</h2>${me.li.need?`${bar(me.li.into,me.li.need)}<small class="num">${fmtN(me.li.into)} / ${fmtN(me.li.need)} XP to level ${me.li.level+1}</small>`:''}
   <p class="tiny muted" style="margin:8px 0 0">Every level pays out doubloons (${fmtN(levelGold(me.li.level+1))} for the next one). Named levels unlock free cosmetics and new ranks. You've banked ${fmtN(me.lvlGold)} doubloons from levelling so far.</p></div>
  <div class="track">${rows.map(r=>{const got=lv>=r.L;return `<div class="tstep ${got?'got':''} ${!got&&rows.find(x=>x.L>lv)===r?'next':''}"><span class="tl">${r.L}</span><div class="tbody">${r.ti?`<b>Rank: ${esc(r.ti[1])}</b>`:''}${r.items.map(i=>`<div class="row" style="gap:8px;flex-wrap:nowrap"><canvas class="icon sm" data-id="${i.id}"></canvas><span>${esc(i.name)} <small>${esc(CAT_NAMES[i.cat])}</small></span></div>`).join('')}${!r.ti&&!r.items.length?`<small>${CN} ${fmtN(levelGold(r.L))} doubloons</small>`:''}</div>${got?'<span class="done">✓</span>':''}</div>`;}).join('')}</div></div>`;
};
SCREENS.shop=()=>{
  const me=G.players[S.me];const pl=S.players[S.me]||{};const cat=S.view.shop||'hat';const mer=merchantToday(G.today);
  const items=ITEMS.filter(i=>i.cat===cat&&!i.merchantOnly&&!i.free).concat(Object.keys(me.owned).filter(id=>id.startsWith('m_')&&ALL_ITEMS[id].cat===cat).map(id=>ALL_ITEMS[id]));
  const card=(it,price,merchant)=>{const owned=me.owned[it.id];const lock=itemLocked(it,me);const eq=EQUIP_CATS.includes(it.cat)&&pl[it.cat]===it.id;
    return `<div class="shopItem ${lock&&!owned?'locked':''}">${it.track?'<span class="ribbon">Reward</span>':it.earn?'<span class="ribbon gold">Feat</span>':''}<canvas class="icon" data-id="${it.id}" data-act="itemInfo" data-p="${price}" title="More about this"></canvas><b data-act="itemInfo" data-id="${it.id}" data-p="${price}">${esc(it.name)}</b>${it.desc?`<small class="desc" data-act="itemInfo" data-id="${it.id}" data-p="${price}">${esc(it.desc)}</small>${it.desc.length>40?`<button class="moreLink" data-act="itemInfo" data-id="${it.id}" data-p="${price}">Read more</button>`:''}`:''}
    ${owned&&it.cat!=='shield'?(EQUIP_CATS.includes(it.cat)?`<button class="btn sm ${eq?'':'primary'}" data-act="equip" data-id="${it.id}" data-cat="${it.cat}">${eq?'Wearing':'Use'}</button>`:`<small class="done">Owned</small>`):lock?`<small class="lockTxt">🔒 ${esc(lock)}</small>`:`<button class="btn sm" data-act="buy" data-id="${it.id}" data-p="${price}" ${me.balance<price||(it.cat==='shield'&&me.shields>=3)?'disabled':''}>${CN} ${fmtN(price)}</button>`}${merchant?'<small>Barge price</small>':''}</div>`;};
  const total=ITEMS.filter(i=>i.cat!=='shield'&&!i.free).length+MERCHANT_ITEMS.length;
  return `<div class="pad"><div class="row between"><h2>Shop</h2><span class="pill">${CN} <b class="num">${fmtN(me.balance)}</b></span></div>
  <div class="card flat row between" style="padding:10px 14px"><small>Collection: <b>${me.m.cosmetics}</b> of ${total} cosmetics</small><a class="btn sm" href="#log">Reward track</a></div>
  ${mer?`<div class="card barge"><h3>Pell's Travelling Barge</h3><p class="tiny muted" style="margin:2px 0 8px">"Rare goods, rarer prices. Back Tuesday or Thursday, tide permitting."</p><div class="grid3">${mer.map(it=>card(it,it.price,true)).join('')}</div></div>`:`<p class="tiny muted" style="margin:0">Pell's barge sails in on Tuesdays and Thursdays with rare stock.</p>`}
  <div class="chips">${CAT_ORDER.map(c=>`<button class="chip ${cat===c?'on':''}" data-act="shopCat" data-c="${c}">${CAT_NAMES[c]}</button>`).join('')}</div>
  <div class="grid3">${items.map(it=>card(it,it.price||0)).join('')}</div>
  ${cat==='shield'?`<p class="tiny muted">You have ${me.shields} shield${me.shields===1?'':'s'} (max 3). You also earn one free shield for every 10 crew-target days.</p>`:''}
  <p class="tiny muted">${me.li.level>=100?`Distinction ${roman(me.dist||0)}: keep earning XP for new Distinction ranks, each with ${fmtN(DIST_GOLD)} doubloons and some with exclusive gear.`:'Past level 100 you earn Distinction ranks, with their own rewards and gear.'}</p></div>`;
};

/* ---------- Crew confirmations ---------- */
function crewCheckHtml(){
  if(!G.cfg.requireConfirm||!G.pendingConf.length)return '';const mineToCheck=G.pendingConf.filter(e=>e.pid!==S.me);const waiting=G.pendingConf.filter(e=>e.pid===S.me);
  const ago=t=>{const m=Math.round((Date.now()-t)/60000);return m<60?`${m} min ago`:m<1440?`${Math.round(m/60)} h ago`:`${Math.round(m/1440)} d ago`;};
  return `<div class="card crew"><div class="row between"><h3>Crew check</h3><small>Rewards land once confirmed</small></div><div class="list" style="margin-top:8px">
   ${mineToCheck.map(e=>`<div class="li"><span class="kdot k-${e.k}"></span><div class="grow"><b>${pname(e.pid)} logged a ${e.k==='c'?'new client':'meeting'}</b><br><small>${esc(e.pr||'no name given')} · ${ago(e.t)}</small></div><button class="btn sm primary" data-act="confirmMC" data-p="${e.pid}" data-d="${e.date}" data-id="${e.id}">Confirm</button><button class="btn sm ghost" data-act="disputeMC" data-p="${e.pid}" data-d="${e.date}" data-id="${e.id}">Dispute</button></div>`).join('')}
   ${waiting.map(e=>`<div class="li"><span class="kdot k-${e.k}"></span><div class="grow"><b>Your ${e.k==='c'?'client':'meeting'} is waiting</b><br><small>${esc(e.pr)} · ${pname(other(S.me))} needs to confirm · ${ago(e.t)}</small></div></div>`).join('')}
  </div></div>`;
}
function normPr(s){return String(s||'').toLowerCase().replace(/^@+/,'').replace(/[^a-z0-9]+/g,'');}
function openMCSheet(k){
  const cfg=C();const name=k==='c'?'new client':'meeting';
  openModal(`<div class="sheetHead k-${k}"><span class="kbig">${k==='c'?'<svg><use href="#i-star"/></svg>':'<svg><use href="#i-meet"/></svg>'}</span><div><h2>Log a ${name}</h2><small>${k==='c'?'A new paying client.':'Booked or held with a prospect.'} Pays both captains the same${cfg.requireConfirm?`, once ${pname(other(S.me))} confirms it`:''}.</small></div></div>
   <label class="f" for="prIn">Who is the prospect?<input id="prIn" maxlength="60" placeholder="@instagramhandle or business name" autocomplete="off"></label>
   <p class="tiny muted" style="margin:0">Limit ${cfg.caps[k]} per day · one every ${cfg.cooldowns[k]>=60?Math.round(cfg.cooldowns[k]/60)+' min':cfg.cooldowns[k]+' s'}${k==='c'?' · each prospect can only become a client once':' · same prospect at most once a month'}.</p>
   <button class="hold" id="holdBtn" data-k="${k}"><i></i><span>Press and hold to log</span></button>
   <button class="btn ghost" data-act="closeModal">Cancel</button>`);
  const b=$('#holdBtn');let tm=null;const start=e=>{e.preventDefault();const v=$('#prIn').value.trim();if(normPr(v).length<2){$('#prIn').focus();$('#prIn').classList.add('err');toast('<b>Who’s the lucky prospect?</b> Add their handle or business name. Gary can’t read minds. He’s a gull.','joke',2200);return;}b.classList.add('holding');tone(330,.4,'triangle',.03);tm=setTimeout(()=>{b.classList.remove('holding');b.classList.add('ok');submitMC(k,v);},950);};
  const stop=()=>{if(tm){clearTimeout(tm);tm=null;}b.classList.remove('holding');};
  b.addEventListener('pointerdown',start);['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,stop));b.addEventListener('contextmenu',e=>e.preventDefault());
  setTimeout(()=>$('#prIn')?.focus(),60);
}
async function submitMC(k,pr){
  const cfg=C();const now=Date.now();const n=normPr(pr);const today=L(now).date;
  const all=G.mc.filter(e=>e.k===k);
  if(k==='c'&&all.some(e=>normPr(e.pr)===n)){closeModal();return toast(`<b>${esc(pr)} is already a client.</b> You can't win the same client twice. We checked. Twice.`,'joke',4000);}
  if(k==='m'&&all.some(e=>normPr(e.pr)===n&&now-e.t<30*86400000)){closeModal();return toast(`<b>Already logged a meeting with ${esc(pr)} this month.</b>`,'joke',4000);}
  const todayN=all.filter(e=>e.pid===S.me&&e.date===today).length;if(todayN>=cfg.caps[k]){closeModal();return toast(`<b>Daily limit reached.</b> ${cfg.caps[k]} ${KINDS[k].short.toLowerCase()}s a day is the cap. Save some for tomorrow, legend.`,'joke',4000);}
  const id=uid();
  try{const lease=await S.db.doc(`cool/${S.me}_${k}`).acquire({holder:id,ttlMs:clamp(cfg.cooldowns[k]*1000,1000,600000)});
    if(!lease.acquired){closeModal();const left=Math.max(1,Math.ceil(((Date.parse(lease.expiresAt)||now)-now)/1000));return toast(`<b>Easy, tiger.</b> Next ${KINDS[k].short.toLowerCase()} can be logged in ${left>=60?Math.ceil(left/60)+' min':left+' s'}.`,'joke',3500);}
    S.pending[id]={id,pid:S.me,date:today,k,t:now,pr:pr.slice(0,60)};refresh();
    await writeDay(S.me,today,{ev:{[id]:{k,t:now,pr:pr.slice(0,60)}}});closeModal();
    if(cfg.requireConfirm){toast(`<b>Logged!</b> ${pname(other(S.me))} has to confirm it. Bribes not accepted. Biscuits considered.`,'',4200);SFX.ach();}
    else celebrate(k,$('#b_'+k));
  }catch(e){delete S.pending[id];refresh();closeModal();writeFail(e);}
}
