/* ============================== ONE PLACE FOR TREASURE, AND A REWARDS GUIDE (21 Nov) ==============================
   The Treasure hoard (trinkets from logging work) and the Vault (relics from chests at sea) are now one page: Treasure.
   Both kinds come in sets, and every complete set pays the same: 250 doubloons and 150 XP, once. Boss loot stays with
   each boss in the Bestiary. "How rewards work" (More) lists every way to earn, in one place. */
const SET_PAY={g:250,xp:150};
function hoardSets(p){const me=G.players[p];return COLLECT_SETS.map(set=>({set,n:set.items.filter(([id])=>me.loot[id]).length,total:set.items.length,key:'hs_'+set.id}));}
function treasureFound(p){const have=relicCounts(p);return Object.keys(G.players[p].loot).length+relicList().filter(r=>(have[r.id]||0)>0).length;}
const TREASURE_TOTAL=()=>COLLECTIBLES.length+relicList().length;
ACT.hoardSet=async d=>{const hs=hoardSets(S.me).find(x=>x.key===d.key);if(!hs||hs.n<hs.total||G.players[S.me].claimed.has(hs.key))return;
  try{await writeDay(S.me,G.today,{bonus:{[hs.key]:{xp:SET_PAY.xp,g:SET_PAY.g,ts:Date.now()}}});SFX.ach();banner('SET COMPLETE',hs.set.name);}catch(e){writeFail(e);}};

// the Treasure page: trinkets first, then relics, maps and donations (the old Vault)
{const _vT=SCREENS.vault;SCREENS.vault=function(){let h=_vT.apply(this,arguments);const me=G.players[S.me];const hs=hoardSets(S.me);const nT=Object.keys(me.loot).length;
  const head=`<div class="card vaultHead"><small>Under the skull cave</small><h2>Treasure</h2><p class="tiny"><b>${treasureFound(S.me)} of ${TREASURE_TOTAL()}</b> found. Two kinds: <b>trinkets</b> turn up as you log work (about 1 in 40 DMs, more often from responses, always from meetings and clients), and <b>relics</b> wash up in chests and bottles at sea (about 1 in 20). Every complete set pays ${SET_PAY.g} doubloons and ${SET_PAY.xp} XP, once.</p><a class="tiny" href="#rewards">How every reward works ›</a></div>`;
  const trinkets=`<div class="card"><h3>Trinkets <small class="muted">${nT} of ${COLLECTIBLES.length}</small></h3><div style="display:grid;gap:12px;margin-top:8px">${hs.map(x=>{const got=me.claimed.has(x.key),done=x.n===x.total;
    return `<div><div class="row between"><small><b>${esc(x.set.name)}</b> · ${x.n} of ${x.total}</small>${done?(got?'<span class="okTag">Set reward claimed</span>':`<button class="btn sm primary" data-act="hoardSet" data-key="${x.key}">Claim ${SET_PAY.g} ${CN}, ${SET_PAY.xp} XP</button>`):''}</div><div class="row" style="gap:6px;margin-top:4px">${x.set.items.map(([i,n])=>`<canvas class="collect" data-c="${i}" data-f="${me.loot[i]?1:0}" title="${me.loot[i]?esc(n):'Not found yet'}"></canvas>`).join('')}</div></div>`;}).join('')}</div></div><h3 class="vaultSub">Relics from the sea</h3>`;
  h=h.replace(/<div class="card vaultHead">[\s\S]*?<\/div>/,head+trinkets);return h;};}
// the Ship page keeps a small link instead of the full hoard
{const _shT=SCREENS.ship;if(_shT)SCREENS.ship=function(){const h=_shT.apply(this,arguments);return h.replace(/<div class="card"><h3>Treasure hoard[\s\S]*?<\/small><\/div>/,`<a class="card tvGo" href="#vault"><span class="appIco" style="background:${APP_ICONS.vault[0]}"><svg viewBox="0 0 24 24"><path d="${APP_ICONS.vault[1]}"/></svg></span><span class="grow"><b>Treasure</b><small>${treasureFound(S.me)} of ${TREASURE_TOTAL()} trinkets and relics found</small></span><span class="tvGoArrow">›</span></a>`);};}
// More: the Vault tile becomes Treasure, plus the rewards guide
APP_ICONS.rewards=['#E0823A','M12 2l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 15.6 6.6 18.5l1.2-6L3.3 8.3l6.1-.7zM5 20h14v2H5z'];
{const _mT=SCREENS.more;SCREENS.more=function(){let h=_mT.apply(this,arguments);h=h.replace(/(<a href="#vault">[\s\S]*?<\/span>)Vault<small>[^<]*<\/small>/,`$1Treasure<small>${treasureFound(S.me)} of ${TREASURE_TOTAL()} found</small>`);
  const tile=`<a href="#rewards"><span class="appIco" style="background:${APP_ICONS.rewards[0]}"><svg viewBox="0 0 24 24"><path d="${APP_ICONS.rewards[1]}"/></svg></span>Rewards<small>How to earn everything</small></a>`;const k='<a href="#help">';return h.includes(k)?h.replace(k,tile+k):h;};}

/* ---------- How rewards work ---------- */
SCREENS.rewards=()=>{const k=x=>KINDS[x];const row=(n,d,where)=>`<div class="li rwRow"><span class="grow"><b>${n}</b><br><small>${d}</small></span>${where?`<a class="btn sm ghost" href="#${where}">Open</a>`:''}</div>`;
  return `<div class="pad"><div class="card hero"><small>Everything in one place</small><h2>How rewards work</h2><p class="tiny muted">You earn XP (it levels you up) and doubloons (to spend in the Shop). Everything below is worked out from what you both log.</p></div>
   <div class="card"><h3>Every time you log something</h3><div class="list">
    ${row('DM sent',`${k('d').xp} XP and ${k('d').g} doubloons. A follow-up is half that.`)}
    ${row('Response',`${k('r').xp} XP and ${k('r').g} doubloons each, for both of you.`)}
    ${row('Video sent',`${k('v').xp} XP and ${k('v').g} doubloons each.`)}
    ${row('Meeting set',`${k('m').xp} XP and ${k('m').g} doubloons each, plus a celebration.`)}
    ${row('Client won',`${fmtN(k('c').xp)} XP and ${k('c').g} doubloons each, plus a celebration.`)}</div></div>
   <div class="card"><h3>Every day</h3><div class="list">
    ${row('Sink the boss of the day','Hit the crew target: +100 XP and 30 doubloons each. Each boss you sink adds to its mounted head in the Trophy Room.','book')}
    ${row('Crew goals','Sink the foe on 5 days in a week: +400 doubloons and 300 XP each. Every Friday you both log 30+ DMs: +200 doubloons and 150 XP each.')}
    ${row('Quests','Three daily quests and weekly ones, each with its own XP and doubloons. Claim them in Quests.','quests')}
    ${row('Pet sightings','One pet a day between 7am and 7pm. Log the DMs it asks for before the window closes, then claim it.','pets')}
    ${row('The Rusty Anchor','One free dart a day, Bill\'s paybacks, and games for doubloons (against Bill, or each other).','tavern')}</div></div>
   <div class="card"><h3>As you go</h3><div class="list">
    ${row('Levelling up','Every level pays doubloons. Named levels give a free cosmetic and a new rank. See the Captain\'s Log.','log')}
    ${row('Treasure','Trinkets from logging work and relics from chests at sea. Every full set pays 250 doubloons and 150 XP.','vault')}
    ${row('Fishing','Fishing trips in Lock In catch fish for your Trophy case. Rare colours (golden, albino, rainbow) are a bonus.','trophy')}
    ${row('Boss loot','From 1 December each boss drops a piece of its 4-piece set when you help sink it. Full sets earn the boss\'s banner.','bestiary')}
    ${row('Achievements','Hundreds of them. Each one pays doubloons by rarity, from 10 (common) up to 3,000 (transcendent).','book')}
    ${row('Funnal Cove','Your combined lifetime DMs grow the town, and the big landmarks pay you both when they open.','harbour')}</div></div>
   <div class="card"><h3>Christmas</h3><div class="list">${row('The Christmas Event','1 to 24 December. Points from everything you log fill a 40-tier pass of doubloons, XP and cosmetics, sized to finish by Christmas Eve.','quests')}</div></div></div>`;};
HELP.push(['How rewards work','More, Rewards lists every way to earn XP and doubloons in one place: logging work, the boss of the day, quests, pets, levels, treasure, fishing, boss loot, achievements, the town and the Christmas Event.']);
// the relic toast points at the new name
{const _tT=toast;toast=function(m,...r){if(typeof m==='string')m=m.replace('(More, Vault)','(More, Treasure)');return _tT.call(this,m,...r);};}
