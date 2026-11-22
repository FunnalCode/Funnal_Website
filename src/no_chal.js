/* ============================== 22 Nov: Challenges are gone ==============================
   The duels and co-op goals are removed everywhere. Stakes live in the Tavern only. Past results still count:
   the XP and doubloons they paid stay, and the two achievements already unlocked from them (First Blood, Game On)
   stay unlocked. Everything that could only be earned through challenges now comes from levels instead. */

// 1. No challenge screens, links, invites, banners or toasts. Old results stay inside the numbers that derive() adds up.
challengesHtml=()=>'';
wagersHtml=()=>'';
{const _dv=derive;derive=function(){const g=_dv.apply(this,arguments);if(g)g.chals=[];return g;};}

// 2. The weekly quest that needed a challenge becomes one you can finish on your own (same id, so this week's slot stays put)
{const q=WEEKLY_QUESTS.find(x=>x.id==='wchal');if(q)Object.assign(q,{name:'Send 40 follow-ups',m:'wFu',n:40,xp:300,g:90});}

// 3. Achievements nobody can reach any more are retired. The ones already unlocked stay (chalWon_0, chalPlayed_0).
{const gone=new Set(['chalWon_1','chalWon_2','chalWon_3','chalWon_4','chalWon_5','chalPlayed_1','chalPlayed_2','chalPlayed_3','chalPlayed_4','chalPlayed_5','coop10','coop50','s_final']);
 for(let i=ACHIEVEMENTS.length-1;i>=0;i--)if(gone.has(ACHIEVEMENTS[i].id)){delete ACH_BY_ID[ACHIEVEMENTS[i].id];ACHIEVEMENTS.splice(i,1);}}

// 4. The four challenge-only items move onto the level track
{const lv={flag_duellist:23,flag_raid:28,hull_arena:33,sail_champion:38};
 Object.entries(lv).forEach(([id,L])=>{const it=ALL_ITEMS[id];if(!it)return;delete it.earn;it.track=L;it.price=0;it.lvl=L;if(!TRACK.includes(it))TRACK.push(it);});
 TRACK.sort((a,b)=>a.track-b.track);}

// 5. Words: help, records and the tavern no longer mention challenges
{const drop=t=>{let i;while((i=HELP.findIndex(h=>h[0]===t))>=0)HELP.splice(i,1);};drop('Challenges');
 HELP.forEach(h=>{if(typeof h[1]==='string')h[1]=h[1].replace(', challenge gear','').replace('fish gear, boss trophies, hunter gear, veteran pieces','fish gear, boss trophies, hunter gear, veteran pieces');});}
{const _rv=SCREENS.rivals;if(_rv)SCREENS.rivals=function(){return _rv.apply(this,arguments).replace(/<tr><td>Challenges won<\/td>[\s\S]*?<\/tr>/,'');};}
{const _tv=SCREENS.tavern;if(_tv)SCREENS.tavern=function(){return _tv.apply(this,arguments).replace(/Challenges open when /g,'Head-to-head games open when ');};}
