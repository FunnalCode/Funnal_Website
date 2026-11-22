/* ============================== 22 Nov: levels 1 to 1000, a reward at every level, and ten curses ==============================
   Levels 1 to 100 keep their XP curve. Distinctions I to IX add 100 levels each (101 to 1000), at roughly a level a day
   at your current pace, so each Distinction takes two to three months. Every level unlocks something on a pattern that
   repeats every 10 levels; every hundredth level unlocks a curse that changes how your captain looks everywhere.
   Rewards that are items (set pieces, hideout pieces) use the normal ownership-by-level rule. Dyes, records, titles,
   frames and DM effects are earned by level too and kept in their own list, so they don't count as shop cosmetics.
   Doubloon hauls, bait packs and streak shields are added when you reach the level. Chests are opened by tapping. */
const LV_MAX=1000;
const LV_TIERS=[
 {t:1,name:'The Haunted Shallows',adj:'Ghostly',curse:'ghost',col:'#9EC9DC',col2:'#E8F4F8',acc:'#5E8FA6'},
 {t:2,name:'The Coral Reach',adj:'Coral',curse:'coral',col:'#F07B6A',col2:'#FFD6C2',acc:'#2A9D8F'},
 {t:3,name:'The Inkwell Deep',adj:'Inkwell',curse:'ink',col:'#6B3FA0',col2:'#C9A8EE',acc:'#2B1745'},
 {t:4,name:'The Frostbound North',adj:'Frostbound',curse:'frost',col:'#8FD3F4',col2:'#F2FBFF',acc:'#3A7CA5'},
 {t:5,name:'The Emberforge',adj:'Ember',curse:'ember',col:'#E2552B',col2:'#FFC15E',acc:'#3A1E16'},
 {t:6,name:'The Storm Coast',adj:'Storm',curse:'storm',col:'#5C6F86',col2:'#FFE066',acc:'#28323F'},
 {t:7,name:'The Shadowtide',adj:'Shadow',curse:'shadow',col:'#2A2238',col2:'#B388FF',acc:'#0E0B14'},
 {t:8,name:'The Bone Isles',adj:'Bone',curse:'bone',col:'#E9E1CC',col2:'#3A332B',acc:'#8C7F66'},
 {t:9,name:'The Starward Sea',adj:'Starlit',curse:'star',col:'#1E2A5E',col2:'#FFE38A',acc:'#7FA3FF'},
 {t:10,name:'El Dorado',adj:'Golden',curse:'gold',col:'#E8B83A',col2:'#FFF4C2',acc:'#8A5A12'}];
const CURSES=[
 {id:'ghost',lv:100,name:'Ghost Curse',look:'See-through and pale blue, with mist trailing behind',line:'You feel a chill. Mostly because you are now partly fog.'},
 {id:'coral',lv:200,name:'Coral Curse',look:'Coral and barnacles growing on skin and coat',line:'Congratulations, you are now a listed reef. Fish will visit.'},
 {id:'ink',lv:300,name:'Ink Curse',look:'Deep purple skin, with hair that curls into tentacles',line:'Your hair has opinions now. Eight of them.'},
 {id:'frost',lv:400,name:'Frost Curse',look:'Icy blue, with frosty breath and a glittering edge',line:'Cool under pressure. Also cool under everything else.'},
 {id:'ember',lv:500,name:'Ember Curse',look:'Glowing cracks, giving off smoke and sparks',line:'Please do not stand near the powder kegs.'},
 {id:'storm',lv:600,name:'Storm Curse',look:'Grey-blue, with lightning crackling now and then',line:'Every hair stands on end. Permanently. Gary is keeping his distance.'},
 {id:'shadow',lv:700,name:'Shadow Curse',look:'A dark silhouette with glowing eyes',line:'Excellent for sneaking. Terrible for photos.'},
 {id:'bone',lv:800,name:'Bone Curse',look:'A skeleton face that still wears the outfit',line:'Lighter on your feet than ever. About 60% lighter.'},
 {id:'star',lv:900,name:'Star Curse',look:'A night-sky body with drifting stars',line:'You contain multitudes. Mainly constellations.'},
 {id:'gold',lv:1000,name:'Golden Curse',look:'Solid gold with a shimmer, dropping coins on every DM',line:'Every DM now costs the sea a coin. The sea has no objections.'}];
const CURSE_BY=Object.fromEntries(CURSES.map(c=>[c.id,c]));

/* ---------- XP and doubloons per level past 100 ---------- */
function needXpD(l){const d=Math.floor((l-100)/100)+1,k=(l-100)%100;return Math.round(1000+50*(d-1)+k);}
const lvNeed=l=>l<100?needXp(l):needXpD(l);
levelInfo=function(xp){let l=1,rem=xp;while(l<LV_MAX){const n=lvNeed(l);if(rem<n)break;rem-=n;l++;}return{level:l,into:rem,need:l>=LV_MAX?0:lvNeed(l)};};
const lvGold=L=>L<=100?levelGold(L):Math.round(400+L*.5);
const lvDist=L=>L>100?Math.ceil((L-100)/100):0;
const lvTier=L=>LV_TIERS[Math.min(9,Math.max(0,Math.ceil(L/100)-1))];

/* ---------- the exclusive set for each tier: 10 pieces on levels ending in 0 ---------- */
const LV_SET_CATS=['hat','coat','face','hull','sail','flag','figure','trail','shot','decor'];
const LV_SETS={
 2:[['Coral Crown',{st:'crown',col:'#F07B6A'}],["Reef Diver's Coat",{st:'trim',col:'#2A9D8F',col2:'#F07B6A'}],['Barnacle Beard',{st:'beard',col:'#D9826E'}],['Living Reef Hull',{col:'#F07B6A',col2:'#B9533F',pat:'scales'}],['Coral Fan Sails',{col:'#FFD6C2',col2:'#F07B6A',pat:'waves'}],['Reef Banner',{col:'#2A9D8F',sym:'fish',sc:'#FFD6C2'}],['Coral Mermaid',{st:'mermaid'}],['Coral Bloom Wake',{st:'lv2'}],['Coral Shot',{st:'lv2'}],['The Reef Idol',{}]],
 3:[['Inkwell Kraken Helm',{st:'kraken',col:'#6B3FA0'}],['Ink-Stained Cape',{st:'cape',col:'#3E1F66',col2:'#C9A8EE'}],['Tentacle Moustache',{st:'handlebar',col:'#2B1745'}],['Inkwell Hull',{col:'#4B2A7A',col2:'#2B1745',pat:'suckers'}],['Tentacle Sails',{col:'#2B1745',col2:'#9B6BD6',pat:'tentacle'}],['Ink Flag',{col:'#2B1745',sym:'kraken',sc:'#C9A8EE'}],['The Ink Kraken',{st:'kraken'}],['Ink Cloud Wake',{st:'lv3'}],['Ink Bombs',{st:'lv3'}],['The Inkwell Idol',{}]],
 4:[['Frost Giant Helm',{st:'viking',col:'#BFE6F7'}],['Glacier Greatcoat',{st:'admiral',col:'#3A7CA5',col2:'#F2FBFF'}],['Frostbitten Beard',{st:'braid',col:'#E8F6FF'}],['Icebreaker Hull',{col:'#BFE6F7',col2:'#7FB3D5',pat:'iron'}],['Aurora Sails',{col:'#22334D',col2:'#6EE7B7',pat:'aurora'}],['Snowflake Flag',{col:'#3A7CA5',sym:'snowflake',sc:'#F2FBFF'}],['The Ice Narwhal',{st:'narwhal'}],['Snowflake Wake',{st:'lv4'}],['Iceballs',{st:'lv4'}],['The Frost Idol',{}]],
 5:[['Emberforge Tricorn',{st:'tricorn',col:'#3A1E16'}],['Smouldering Coat',{st:'cloak',col:'#5A2416',col2:'#FFC15E'}],['Soot Smudges',{st:'warpaint',col:'#3A1E16'}],['Molten Hull',{col:'#3A1E16',col2:'#E2552B',pat:'flames'}],['Wildfire Sails',{col:'#E2552B',col2:'#FFC15E',pat:'flames'}],['Ember Flag',{col:'#3A1E16',sym:'star',sc:'#FF7A1A'}],['The Fire Phoenix',{st:'phoenix'}],['Ember Wake',{st:'lv5'}],['Magma Shot',{st:'lv5'}],['The Ember Idol',{}]],
 6:[["Stormcaller's Sou'wester",{st:'souwester',col:'#5C6F86'}],['Squall Oilskin',{st:'oil',col:'#3D4A5C',col2:'#FFE066'}],['Rain-Soaked Stubble',{st:'stubble',col:'#3D4A5C'}],['Thunderhead Hull',{col:'#3D4A5C',col2:'#28323F',pat:'lightning'}],['Lightning Sails',{col:'#5C6F86',col2:'#FFE066',pat:'lightning'}],['Thunder Flag',{col:'#28323F',sym:'diamond',sc:'#FFE066'}],['The Storm Eagle',{st:'eagle'}],['Spark Wake',{st:'lv6'}],['Thunderballs',{st:'lv6'}],['The Storm Idol',{}]],
 7:[['Shadow Bicorne',{st:'bicorne',col:'#1A1622'}],["Night Stalker's Cloak",{st:'cloak',col:'#1A1622',col2:'#B388FF'}],['Shadow Mask',{st:'shades',col:'#0E0B14'}],['Shadowtide Hull',{col:'#1A1622',col2:'#0E0B14',pat:'glow'}],['Eclipse Sails',{col:'#0E0B14',col2:'#B388FF',pat:'galaxy'}],['Shade Flag',{col:'#0E0B14',sym:'skull',sc:'#B388FF'}],['The Shadow Serpent',{st:'serpent'}],['Shade Wake',{st:'lv7'}],['Shadow Orbs',{st:'lv7'}],['The Shadow Idol',{}]],
 8:[['Bone Crown',{st:'crown',col:'#E9E1CC'}],["Gravedigger's Vest",{st:'vest',col:'#3A332B',col2:'#E9E1CC'}],['Old Scar',{st:'scar',col:'#8C7F66'}],['Ossuary Hull',{col:'#E9E1CC',col2:'#8C7F66',pat:'bones'}],['Ribcage Sails',{col:'#3A332B',col2:'#E9E1CC',pat:'bones'}],['Jolly Roger Royale',{col:'#2A2622',sym:'skull',sc:'#E9E1CC'}],['The Grinning Skull',{st:'skull'}],['Bone Dust Wake',{st:'lv8'}],['Skull Shot',{st:'lv8'}],['The Bone Idol',{}]],
 9:[['Star Halo',{st:'halo',col:'#FFE38A'}],['Constellation Coat',{st:'tux',col:'#1E2A5E',col2:'#FFE38A'}],['Moon Monocle',{st:'monocle',col:'#D9DEE8'}],['Starfall Hull',{col:'#1E2A5E',col2:'#0D1030',pat:'galaxy'}],['Night Sky Sails',{col:'#1E2A5E',col2:'#FFE38A',pat:'stars'}],['Comet Flag',{col:'#0D1030',sym:'star',sc:'#FFE38A'}],['The Star Whale',{st:'swordfish'}],['Comet Tail Wake',{st:'lv9'}],['Shooting Stars',{st:'lv9'}],['The Star Idol',{}]],
 10:[['Crown of El Dorado',{st:'crown',col:'#E8B83A'}],['Golden Admiral Coat',{st:'admiral',col:'#E8B83A',col2:'#FFF4C2'}],['Gold Tooth Grin',{st:'goldtooth',col:'#E8B83A'}],['Hull of El Dorado',{col:'#E8B83A',col2:'#B8862B',pat:'royal'}],['Cloth of Gold Sails',{col:'#FFF4C2',col2:'#E8B83A',pat:'sun'}],['Golden Standard',{col:'#E8B83A',sym:'crown',sc:'#FFF4C2'}],['The Golden Lion',{st:'lion'}],['Gold Dust Wake',{st:'lv10'}],['Golden Doubloons',{st:'lv10'}],['The Golden Idol',{}]]};
const LV_SET_IDS={};
Object.entries(LV_SETS).forEach(([t,arr])=>{t=+t;arr.forEach(([name,o],i)=>{const cat=LV_SET_CATS[i];const id=cat==='decor'?`lvd_idol_${t}`:`lv_${cat}_${t}`;const L=(t-1)*100+(i+1)*10;
  const item={id,name,cat,track:L,lvset:t,merchantOnly:true,...o};if(cat==='figure')item.gold=true;ITEMS.push(item);ALL_ITEMS[id]=item;LV_SET_IDS[L]=id;TRACK.push(item);});});
// the old Distinction rewards move onto the new levels (nobody had reached them yet)
const LV_DIST_MOVE={1:101,2:201,3:301,5:501,7:701,10:901,15:951,20:991};
ITEMS.forEach(i=>{if(i.dtrack&&LV_DIST_MOVE[i.dtrack]){i.track=LV_DIST_MOVE[i.dtrack];delete i.dtrack;if(!TRACK.includes(i))TRACK.push(i);}});
TRACK.sort((a,b)=>a.track-b.track);
['prest1','prest3','prest5'].forEach((id,i)=>{const a=ACH_BY_ID[id];if(!a)return;a.target=[1,5,9][i];a.desc=['Reach Distinction I (level 101)','Reach Distinction V (level 401)','Reach Distinction IX (level 901)'][i];});

/* ---------- the extras: dyes, records, DM effects, hideout pieces, titles, frames ---------- */
const LV_DYES={1:'Ghostly Teal #5FB3B3|Pale Spirit #CFE5EA|Moonmist #A8B8D8|Haunt Grey #8C969E|Wisp Blue #7FB8E0|Lantern Glow #F2D48A|Sea Fog #B9C6C9|Phantom Lilac #B9A6D6|Grave Moss #6E8B6A|Night Harbour #2E4057',
 2:'Coral Pink #F07B6A|Lagoon Teal #2A9D8F|Sea Anemone #E85D9E|Sandbar #E9C99A|Kelp Green #4E7D45|Clownfish #F28C28|Shell White #FFF1E6|Urchin Purple #6B3A6E|Reef Blue #1F7A9C|Starfish Orange #F2A541',
 3:'Squid Ink #2B1745|Octopus Violet #6B3FA0|Deep Plum #4A1942|Abyss Blue #1B2A4A|Bioluminous #5EF2D6|Lilac Ink #C9A8EE|Midnight Mauve #593C6E|Jellyfish Pink #F29BD4|Trench Black #121018|Anglerfish Glow #F5E663',
 4:'Glacier Blue #8FD3F4|Snowdrift #F2FBFF|Icicle #BFE6F7|Polar Night #22334D|Frostbite #5B8DB8|Aurora Green #6EE7B7|Berg Teal #4FA3A5|Silver Frost #C7D0D8|Winter Plum #7A5C8E|Sleet Grey #8A9BA8',
 5:'Ember Red #E2552B|Molten Gold #FFC15E|Charcoal #3A1E16|Lava Orange #FF7A1A|Ash Grey #6E6461|Brimstone #D4A017|Cinder Rose #C0524A|Forge Bronze #A0612D|Smoke #4A4446|Flame Yellow #FFD34E',
 6:'Storm Slate #5C6F86|Lightning Yellow #FFE066|Thundercloud #3D4A5C|Rain Blue #6C8EAD|Squall Teal #3E7C7A|Gale Grey #A3ADB8|Hail White #EEF2F5|Tempest Indigo #3B3F7A|Sea Spray #9CC9D3|Wet Deck #4F4A45',
 7:'Shadow Black #1A1622|Wraith Violet #B388FF|Dusk Purple #4B3A66|Eclipse #0E0B14|Gloom Green #3F5E4E|Midnight Red #6B1F2A|Smoke Lilac #8E7FA8|Raven #2F2B3A|Dim Teal #2E4A50|Ghost Ember #C4623A',
 8:'Bone White #E9E1CC|Old Ivory #D8CBA8|Crypt Grey #6F6A62|Tomb Brown #5A4632|Skull Black #2A2622|Marrow Red #8C2F2F|Dust #B5A88C|Grave Green #5E6B4E|Pale Bone #F4EFE1|Rust #9A5B34',
 9:'Starlit Navy #1E2A5E|Comet Gold #FFE38A|Nebula Pink #E07BB5|Cosmic Blue #7FA3FF|Moon Silver #D9DEE8|Galaxy Purple #5B3A99|Sunrise #FFB26B|Void #0D1030|Meteor Red #D9534F|Aurora Teal #4DD4C6',
 10:'Pure Gold #E8B83A|Champagne #FFF4C2|Rose Gold #E6A38C|Antique Gold #B8862B|Royal Purple #5B2A86|Emperor Red #A11D2B|Pearl #F6F1E7|Jade #3E9C77|Sapphire #2647A6|Black Gold #3A2E12'};
const LV_TITLES={2:['Reef Wrangler','Barnacle Baron','Commodore of Coral','Polyp Whisperer','Lord of the Lagoon'],3:['Ink Slinger','Squid Botherer','Duke of the Deep','The Smudged One','Inkwell Admiral'],
 4:['Icebreaker','Captain Chilly','Baron of Brrr','Frostbeard','Warden of the North'],5:['Firestarter','Smoulder Lord','Toasty Terror','Keeper of the Coals','Emberlord'],
 6:['Thunderclap','Squall Seeker','Rain Magnet','Human Lightning Rod','Stormcaller'],7:['Lurker','Night Owl','The Unseen','Shade of the Shoals','Shadow Admiral'],
 8:['Bone Rattler','Calcium Captain','Rattlebones','Skull and Crossbones','Bone King'],9:['Stargazer','Comet Chaser','Captain Cosmos','Moon Pirate','Navigator of the Heavens'],
 10:['The Gilded One','Doubloon Duke','Midas of the Main','Golden Legend','The Hundred Cannons']};
const LV_FRAME_N=['Ring','Halo','Crest','Wreath','Seal'];
const LV_REC_N=['Hornpipe','Reel','Jig','Shanty','Waltz','Lament','March','Ballad','Polka','Air'];
const LV_FX_SHAPES=['confetti','spark','bubble','star','coin','ring','petal','drop','burst','comet'];const LV_FX_N=['Confetti','Sparkles','Bubbles','Stars','Coins','Rings','Petals','Drops','Burst','Comets'];
const LV_DECOR_F=['banner','lantern','painting','statue','chest','vase','rug','globe','trophy','shrine'];const LV_DECOR_N=['Banner','Lantern','Painting','Statue','Chest','Vase','Rug','Globe','Trophy','Shrine'];
const LVX={};// id -> extra (dye, rec, fx, title, frame, curse)
for(let t=1;t<=10;t++){const T=LV_TIERS[t-1];
  LV_DYES[t].split('|').forEach((s,i)=>{const m=/^(.*) (#[0-9A-F]{6})$/i.exec(s);LVX[`dye_${t}_${i}`]={id:`dye_${t}_${i}`,kind:'dye',name:m[1],col:m[2],t};});
  LV_REC_N.forEach((n,i)=>{LVX[`rec_${t}_${i}`]={id:`rec_${t}_${i}`,kind:'rec',name:`The ${T.adj} ${n}`,t,i};});
  LV_FX_N.forEach((n,i)=>{LVX[`fx_${t}_${i}`]={id:`fx_${t}_${i}`,kind:'fx',name:`${T.adj} ${n}`,shape:LV_FX_SHAPES[i],t};});
  if(LV_TITLES[t])LV_TITLES[t].forEach((n,i)=>{LVX[`ttl_${t}_${i}`]={id:`ttl_${t}_${i}`,kind:'title',name:n,t};});
  if(t>1)LV_FRAME_N.forEach((n,i)=>{LVX[`frm_${t}_${i}`]={id:`frm_${t}_${i}`,kind:'frame',name:`${T.adj} ${n}`,t,v:i};});
  LV_DECOR_N.forEach((n,i)=>{const id=`lvd_${LV_DECOR_F[i]}_${t}`;const item={id,name:`${T.adj} ${n}`,cat:'decor',lvset:t,merchantOnly:true,fam:LV_DECOR_F[i],tier:t};ITEMS.push(item);ALL_ITEMS[id]=item;});}
CURSES.forEach(c=>{LVX['curse_'+c.id]={id:'curse_'+c.id,kind:'curse',name:c.name,curse:c.id,t:c.lv/100};});

/* ---------- the table: what every level gives ---------- */
const BAIT_PACKS=[['glow',3],['squid',2],['lure',1]];
const LV_REW=[];// LV_REW[L] = [reward,...]
(function(){const old={};TRACK.forEach(i=>{if(!i.lvset)(old[i.track]=old[i.track]||[]).push(i.id);});
  for(let L=2;L<=LV_MAX;L++){const t=Math.ceil(L/100),e=L%10,k=Math.floor(((L-1)%100)/10),r=[];
    if(old[L])old[L].forEach(id=>r.push({kind:'item',id}));
    else if(e===0){if(LV_SET_IDS[L])r.push({kind:'item',id:LV_SET_IDS[L]});}
    else if(e===5)r.push(k%2===0?{kind:'title',id:`ttl_${t}_${k/2}`}:{kind:'frame',id:`frm_${t}_${(k-1)/2}`});
    else if(e===1)r.push({kind:'dye',id:`dye_${t}_${k}`});
    else if(e===3)r.push({kind:'rec',id:`rec_${t}_${k}`});
    else if(e===7)r.push({kind:'fx',id:`fx_${t}_${k}`});
    else if(e===9)r.push({kind:'item',id:`lvd_${LV_DECOR_F[k]}_${t}`});
    else if(e===2)r.push({kind:'chest'});
    else if(e===4){const [b,n]=BAIT_PACKS[k%3];r.push({kind:'bait',b,n});}
    else if(e===6)r.push({kind:'gold',g:Math.round((120+L*4)/10)*10});
    else if(e===8)r.push(k%2===0?{kind:'shield'}:{kind:'gold',g:Math.round((120+L*4)/10)*20,big:true});
    if(L%100===0)r.push({kind:'curse',id:'curse_'+LV_TIERS[t-1].curse});
    // a title or frame slot in tier 1 already has an item, so it keeps it
    if(!r.length){if(e===5&&t===1)r.push({kind:'gold',g:Math.round((120+L*4)/10)*10});}
    LV_REW[L]=r.filter(x=>x.kind!=='title'&&x.kind!=='frame'||LVX[x.id]);if(!LV_REW[L].length)LV_REW[L]=[{kind:'gold',g:Math.round((120+L*4)/10)*10}];}})();
// records: tunes written by the ship's band, one per record (seeded, so the same for both of you)
(function(){const SC={maj:[0,2,4,5,7,9,11],min:[0,2,3,5,7,8,10],dor:[0,2,3,5,7,9,10],mix:[0,2,4,5,7,9,10]};const NN=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const moodOf=t=>['min','maj','dor','min','mix','dor','min','min','maj','maj'][t-1];const RH=[[2,2,2,2],[2,1,1,2,2],[1,1,2,1,1,2],[3,1,2,2],[2,2,4],[1,1,1,1,2,2],[4,2,2],[2,1,1,4]];
  const note=(root,deg)=>{const sc=SC[moodOf(root.t)];const o=Math.floor(deg/7),d=((deg%7)+7)%7;const semi=root.r+sc[d]+12*o;const oct=4+Math.floor(semi/12);return NN[((semi%12)+12)%12]+oct;};
  for(let t=1;t<=10;t++)for(let i=0;i<10;i++){const id=`rec_${t}_${i}`;const u=k=>h32(id+k)/4294967296;const root={t,r:[0,2,5,7,9][Math.floor(u('r')*5)]};const bpm=[96,120,132,150,108,84,126,100,160,112][i];
    const phrase=s=>{let deg=Math.floor(u(s+'s')*3)*2;const out=[];for(let b=0;b<2;b++){const rh=RH[Math.floor(u(s+'h'+b)*RH.length)];rh.forEach((d,j)=>{deg+=Math.round((u(s+b+'m'+j)-.5)*4);deg=Math.max(-2,Math.min(9,deg));out.push(note(root,deg)+':'+d);});}return out;};
    const A=phrase('a'),B=phrase('b'),A2=A.slice(0,-1).concat([note(root,0)+':4']);const notes=[...A,...B,...A,...A2,'R:2'].join(' ');
    const s={id:'lv_'+id,name:LVX[id].name,bpm,notes,lvrec:id};SONG_BY[s.id]=s;LVX[id].song=s.id;}})();
const LV_OF={};LV_REW.forEach((r,L)=>{if(r)r.forEach(x=>{if(x.id)LV_OF[x.id]=L;});});
Object.keys(LVX).forEach(id=>{if(LVX[id].kind!=='curse'&&LV_OF[id]==null)delete LVX[id];});
CURSES.forEach(c=>{LV_OF['curse_'+c.id]=c.lv;});
const lvHas=(pid,id)=>{const me=G&&G.players[pid];return !!me&&LV_OF[id]!=null&&me.maxLevel>=LV_OF[id];};

/* ---------- applying it all after each derive ---------- */
const LV_CHEST_POOL=()=>ITEMS.filter(i=>i.price>0&&!i.track&&!i.earn&&!i.merchantOnly&&!i.free&&!i.xmas&&!i.bm&&!i.setBanner&&i.cat!=='shield'&&CAT_ORDER.includes(i.cat));
{const _d=derive;derive=function(){const g=_d.apply(this,arguments);try{(g.P||[]).forEach(p=>{const me=g.players[p];if(!me)return;const ml=me.maxLevel;
    let extra=0,shields=0;const bait={glow:0,squid:0,lure:0};for(let L=101;L<=ml;L++)extra+=lvGold(L)-levelGold(L);
    for(let L=2;L<=ml;L++)(LV_REW[L]||[]).forEach(x=>{if(x.kind==='gold')extra+=x.g;else if(x.kind==='shield')shields++;else if(x.kind==='bait')bait[x.b]+=x.n;});
    me.balance+=extra;me.earned+=extra;me.lvlGold+=extra;me.shields+=shields;me.shieldsEarned+=shields;
    Object.keys(bait).forEach(b=>{bait[b]-=me.owned['baitfree_'+b]||0;});me.baitCred=bait;
    me.lvChests={};(me.bonus||[]).forEach(b=>{if(String(b.key).startsWith('lvc_')){me.lvChests[+b.key.slice(4)]=b.item||1;if(b.item&&ALL_ITEMS[b.item])me.owned[b.item]=me.owned[b.item]||1;}});
    me.lvPending=[];for(let L=2;L<=ml;L++)if((LV_REW[L]||[]).some(x=>x.kind==='chest')&&!me.lvChests[L])me.lvPending.push(L);
    const d=lvDist(me.li.level);if(d!==me.dist){me.dist=d;if(me.m)me.m.dist=d;['prest1','prest3','prest5'].forEach(id=>{const a=ACH_BY_ID[id];if(a&&d>=a.target&&!me.unlocked[id]){me.unlocked[id]=true;const gg=RARITY_GLOW[a.rar]||0;me.balance+=gg;me.earned+=gg;}});}
    me.distInto=me.li.into;});}catch(e){console.warn('levels',e);}return g;};}

/* ---------- header: the real level, a Distinction badge, your title and frame ---------- */
const lvTitleOf=(pid)=>{const pl=S.players[pid]||{};return pl.title&&LVX[pl.title]&&lvHas(pid,pl.title)?LVX[pl.title].name:null;};
function lvFrameCss(pid){const pl=S.players[pid]||{};const f=pl.frame&&LVX[pl.frame];if(!f||!lvHas(pid,pl.frame))return '';const T=LV_TIERS[f.t-1];const a=T.col,b=T.col2,c=T.acc;
  return [`0 0 0 2px ${a}, 0 0 0 4px ${c}`,`0 0 0 3px ${b}, 0 0 0 5px ${a}, 0 0 10px ${a}`,`0 0 0 2px ${c}, 0 0 0 4px ${b}, 0 0 0 6px ${a}`,`0 0 0 4px ${a}, 0 0 0 5px ${b}, 0 0 14px 2px ${b}`,`0 0 0 2px ${b}, 0 0 0 5px ${a}, 0 0 0 7px ${c}, 0 0 16px 3px ${a}`][f.v]||'';}
{const _hud=hud;hud=function(){_hud.apply(this,arguments);try{const me=S.me&&G.players[S.me];if(!me)return;const L=me.li.level;
  const ln=$('#lvlNum');if(ln){ln.textContent=L;const bd=ln.parentElement.querySelector('.lvDist');const d=lvDist(L);if(d){if(bd)bd.textContent=roman(d);else ln.insertAdjacentHTML('afterend',`<i class="lvDist" title="Distinction ${roman(d)}">${roman(d)}</i>`);}else if(bd)bd.remove();}
  $('#xpFill').style.width=me.li.need?(me.li.into/me.li.need*100)+'%':'100%';$('#xpTxt').textContent=me.li.need?`${fmtN(me.li.into)} / ${fmtN(me.li.need)} XP`:'Level 1000. Legend.';
  const tf=activeForfeitsFor(S.me).find(f=>f.result==='title');const own=lvTitleOf(S.me);if(!tf)$('#whoTitle').textContent=(me.prest?'★'.repeat(Math.min(me.prest,5))+' ':'')+(own||(lvDist(L)?distTitle(lvDist(L)):titleFor(L)));
  const pl=S.players[S.me]||{};const av=$('#whoAv');const key=S.me+JSON.stringify([pl.hat,pl.coat,pl.face,pl.curse,pl.dyes,activeForfeitsFor(S.me).length,me.maxLevel>=100]);if(av&&av.dataset.lk!==key){av.dataset.lk=key;av.dataset.k=key;av.style.backgroundImage=`url(${avatarCanvas(S.me)})`;}
  const fc=lvFrameCss(S.me);if(av&&fc)av.style.boxShadow=fc;
  lvWatch(me);}catch(e){console.warn('lv hud',e);}};}

/* ---------- dyes: a new colour for something you own ---------- */
const LV_DYE_SLOTS=[['hat','Hat'],['coat','Coat'],['hull','Hull'],['sail','Sails'],['flag','Flag']];
function dyedPl(pl,pid){if(!pl||!pl.dyes)return pl;let o=null;for(const [cat] of LV_DYE_SLOTS){const dy=pl.dyes[cat];const dx=dy&&LVX[dy];if(!dx||(pid&&G&&G.players[pid]&&!lvHas(pid,dy)))continue;const base=pl[cat]||(typeof SHIP_DEFAULT!=='undefined'&&SHIP_DEFAULT[cat]);const bi=base&&ALL_ITEMS[base];if(!bi)continue;
  const vid=base+'~'+dy;if(!ALL_ITEMS[vid]){const v={...bi,id:vid,col:dx.col};if(cat==='hull')v.col2=lvShade(dx.col,-.28);if(cat==='flag'&&bi.sc&&bi.sc.toLowerCase()===dx.col.toLowerCase())v.sc='#FFFFFF';ALL_ITEMS[vid]=v;}(o=o||{...pl})[cat]=vid;}return o||pl;}
{const _ds=drawShip;drawShip=function(c,x,y,s,pl,t,opts={}){return _ds.call(this,c,x,y,s,dyedPl(pl,opts&&opts.pid),t,opts);};}

/* ---------- curses: drawn over the captain rig ---------- */
let CP_CURSE=null;
{const _kp=keeperPal;keeperPal=function(pl,pid){const L=_kp.apply(this,arguments);const cu=CP_CURSE;if(!cu)return L;
  const S2={ghost:['#D6EEF7','#A9CFE0','#5E8FA6'],coral:['#F2A28C','#E0655A','#2A9D8F'],ink:['#8A5BB8','#4A2475','#F5E663'],frost:['#D9F1FF','#F2FBFF','#3A7CA5'],ember:['#4A2A24','#1E1412','#FFB347'],storm:['#A9B7C6','#5B6878','#FFE066'],shadow:['#2A2533','#16131C','#B388FF'],bone:['#EFE8D6','#E3DAC2','#2A2622'],star:['#2A3570','#1E2650','#FFE38A'],gold:['#F2CF6B','#D9A62B','#8A5A12']}[cu];
  return S2?{...L,s:S2[0],hair:S2[1],e:S2[2]}:L;};}
const _cvPool={};function lvOffCv(k,w,h){let cv=_cvPool[k];if(!cv){cv=_cvPool[k]=document.createElement('canvas');}if(cv.width<w)cv.width=w;if(cv.height<h)cv.height=h;return cv;}
function curseOf(pid,pl,opts){if(opts&&opts.curse!==undefined)return opts.curse||null;const id=pl&&pl.curse;if(!id||!CURSE_BY[id])return null;try{if(G&&G.players[pid]&&G.players[pid].maxLevel<CURSE_BY[id].lv)return null;}catch(e){}return id;}
const CP_EYES=[[-6.5,-40.5],[6.5,-40.5]];// the captain's eyes, in rig units (5 per pixel, feet at 0,0)
{const _dk=drawKeeper;drawKeeper=function(c,x,y,pid,pl,t,opts={}){opts=opts||{};if(opts.chicken)return _dk.apply(this,arguments);pl=dyedPl(pl||{},pid);const cu=curseOf(pid,pl,opts);if(!cu)return _dk.call(this,c,x,y,pid,pl,t,opts);
  const self=this;const inner=q=>{q.save();q.scale(5,5);q.translate(-x-4,-y-12.4);CP_CURSE=cu;try{_dk.call(self,q,x,y,pid,pl,t,opts);}finally{CP_CURSE=null;q.restore();}};
  c.save();c.translate(x+4,y+12.4);c.scale(.2,.2);try{lvCurseDraw(c,cu,inner,t,opts,pid);}catch(e){console.warn('curse',e);inner(c);}c.restore();};}
// a close-up of the captain: head and shoulders centred on (cx,cy), size = roughly the head-and-body height
function lvBust(c,cx,cy,size,pid,pl,t,opts={}){const k=size/14;c.save();c.translate(cx,cy);c.scale(k,k);drawKeeper(c,-4,-5.6,pid,pl,t,opts);c.restore();}
function lvCurseDraw(c,cu,inner,t,opts,pid){const m=c.getTransform();const box=[[-30,-82],[30,-82],[30,6],[-30,6]].map(([x,y])=>[m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f]);
  const x0=Math.floor(Math.min(...box.map(p=>p[0])))-2,y0=Math.floor(Math.min(...box.map(p=>p[1])))-2,x1=Math.ceil(Math.max(...box.map(p=>p[0])))+2,y1=Math.ceil(Math.max(...box.map(p=>p[1])))+2;const W=x1-x0,H=y1-y0;
  if(W<=2||H<=2||W*H>1400*1400){inner(c);return;}
  const reduce=typeof THEME!=='undefined'&&THEME.reduced;const tt=reduce?0:t;
  const off=lvOffCv('a',W,H),q=off.getContext('2d');q.setTransform(1,0,0,1,0,0);q.globalCompositeOperation='source-over';q.globalAlpha=1;q.clearRect(0,0,off.width,off.height);
  const cpT=()=>q.setTransform(m.a,m.b,m.c,m.d,m.e-x0,m.f-y0);cpT();inner(q);
  const tint=(col,a,op='source-atop')=>{q.save();q.setTransform(1,0,0,1,0,0);q.globalCompositeOperation=op;q.globalAlpha=a;q.fillStyle=col;q.fillRect(0,0,W,H);q.restore();};
  const mask=()=>{const mk=lvOffCv('m',W,H),mq=mk.getContext('2d');mq.setTransform(1,0,0,1,0,0);mq.clearRect(0,0,mk.width,mk.height);mq.drawImage(off,0,0,W,H,0,0,W,H);return mk;};
  const reMask=mk=>{q.save();q.setTransform(1,0,0,1,0,0);q.globalCompositeOperation='destination-in';q.drawImage(mk,0,0,W,H,0,0,W,H);q.restore();};
  const atop=f=>{q.save();cpT();q.globalCompositeOperation='source-atop';f(q);q.restore();};
  const front=[];// things drawn on the scene after the captain, in rig units
  const behind=[];
  const bust=!!opts.bust;let alpha=1;
  if(cu==='ghost'){tint('rgba(190,228,246,1)',.45);alpha=.74;
    behind.push(k=>{for(let i=0;i<4;i++){const p=((tt/2600)+i/4)%1;k.globalAlpha=(1-p)*.35;ell(k,-6-p*26,(bust?-28:-4)-i*3,9+p*8,3+p*2,'#DDF1FA');}k.globalAlpha=1;});}
  else if(cu==='coral'){tint('rgba(255,120,90,1)',.1);
    atop(k=>{[[-11,-27],[9,-22],[-5,-15],[12,-30],[-14,-20],[4,-12],[-9,-56],[10,-60]].forEach(([x,y],i)=>{disc(k,x,y,1.6+(i%3)*.4,'#EADBC4');disc(k,x,y,.7,'#7A6A58');});});
    front.push(k=>{const br=(x,y,a,col)=>{k.strokeStyle=col;k.lineWidth=1.6;k.lineCap='round';k.beginPath();k.moveTo(x,y);k.lineTo(x+Math.cos(a)*5,y+Math.sin(a)*5);k.moveTo(x+Math.cos(a)*3,y+Math.sin(a)*3);k.lineTo(x+Math.cos(a-.6)*6,y+Math.sin(a-.6)*6);k.moveTo(x+Math.cos(a)*3,y+Math.sin(a)*3);k.lineTo(x+Math.cos(a+.6)*6.5,y+Math.sin(a+.6)*6.5);k.stroke();};
      br(-14,-31,-2.2,'#F07B6A');br(15,-30,-.9,'#E85D9E');br(-16,-62,-2.5,'#F28C28');});}
  else if(cu==='ink'){front.push(k=>{for(let s of[-1,1])for(let i=0;i<2;i++){const sw=Math.sin(tt/700+i+s)*2;k.strokeStyle='#4A2475';k.lineWidth=2.6-i*.6;k.lineCap='round';k.beginPath();const sx=s*(15+i*2),sy=-44+i*6;k.moveTo(sx,sy);k.bezierCurveTo(sx+s*6,sy+4,sx+s*2+sw,sy+11,sx+s*7,sy+14+sw);k.stroke();k.fillStyle='#C9A8EE';for(let j=1;j<4;j++)disc(k,sx+s*(2+j*1.4),sy+3+j*3,.5,'#C9A8EE');}});}
  else if(cu==='frost'){tint('rgba(170,220,255,1)',.26);
    atop(k=>{for(let i=0;i<10;i++){const tw=(Math.sin(tt/300+i*1.7)+1)/2;if(tw>.55)disc(k,((h32('fr'+i)%46)-23),-(h32('fy'+i)%70)-4,.5+tw*.6,'rgba(255,255,255,.95)');}});
    front.push(k=>{const p=(tt%2600)/2600;if(p<.5){k.globalAlpha=(.5-p)*1.4;ell(k,8+p*14,-35-p*4,2+p*5,1.4+p*3,'#F2FBFF');k.globalAlpha=1;}});}
  else if(cu==='ember'){tint('rgba(30,8,0,1)',.22);
    atop(k=>{k.strokeStyle=`rgba(255,${140+Math.round(Math.sin(tt/240)*40)},40,.95)`;k.lineWidth=.8;k.lineCap='round';[[[-8,-50],[-5,-46],[-7,-42],[-4,-38]],[[6,-56],[8,-51],[5,-48]],[[-10,-28],[-7,-23],[-9,-18],[-6,-14]],[[9,-26],[6,-21],[8,-16]]].forEach(pts=>{k.beginPath();pts.forEach(([x,y],i)=>i?k.lineTo(x,y):k.moveTo(x,y));k.stroke();});});
    front.push(k=>{for(let i=0;i<6;i++){const p=((tt/1500)+i/6)%1;disc(k,((h32('em'+i)%30)-15)+Math.sin(p*6+i)*2,-30-p*48,(1-p)*1.2,`rgba(255,${150+i*15},60,${1-p})`);}for(let i=0;i<3;i++){const p=((tt/3000)+i/3)%1;k.globalAlpha=(1-p)*.25;disc(k,4+Math.sin(p*4+i)*4,-70-p*18,3+p*5,'#6E6461');}k.globalAlpha=1;});}
  else if(cu==='storm'){tint('rgba(80,100,135,1)',.3);
    front.push(k=>{const ph=tt%3200;if(ph<220){const a=1-ph/220;k.strokeStyle=`rgba(255,240,140,${a})`;k.lineWidth=1.4;k.beginPath();let x=-18+(h32('st'+Math.floor(tt/3200))%36),y=-80;k.moveTo(x,y);for(let i=0;i<5;i++){x+=(i%2?5:-5);y+=10;k.lineTo(x,y);}k.stroke();const gg=k.createRadialGradient(0,-40,2,0,-40,34);gg.addColorStop(0,`rgba(255,246,192,${a*.35})`);gg.addColorStop(1,'rgba(255,246,192,0)');k.fillStyle=gg;k.fillRect(-34,-74,68,68);}
      for(let i=0;i<2;i++){if(((tt/90+i*7)|0)%11===0){k.strokeStyle='rgba(255,240,140,.9)';k.lineWidth=.6;const bx=i?13:-15,by=-52;k.beginPath();k.moveTo(bx,by);k.lineTo(bx+2,by-3);k.lineTo(bx-1,by-5);k.stroke();}}});}
  else if(cu==='shadow'){tint('#120F1A',.93);front.push(k=>{CP_EYES.forEach(([x,y])=>{k.save();k.globalCompositeOperation='lighter';glowAt(k,x,y,5,'179,136,255',.8);disc(k,x,y,1.3,'#E6D8FF');k.restore();});});}
  else if(cu==='bone'){front.push(k=>{CP_EYES.forEach(([x,y])=>{ell(k,x,y,2.6,2.9,'#1E1A16');disc(k,x+.4,y-.2,.55,'#F4EFE1');});poly(k,[[0,-39],[-1.2,-36.8],[1.2,-36.8]],'#2A2622');k.fillStyle='#2A2622';k.fillRect(-4,-34.4,8,.5);for(let i=-3;i<=3;i+=1.5)k.fillRect(i-.15,-35.2,.3,1.8);});}
  else if(cu==='star'){const mk=mask();tint('#141A3C',.9);atop(k=>{for(let i=0;i<22;i++){const x=((h32('sx'+i)%56)-28)+Math.sin(tt/4000+i)*2,y=-((h32('sy'+i)%82))+((tt/90+i*13)%8)*.2;const tw=(Math.sin(tt/400+i)+1)/2;disc(k,x,y,.35+tw*.45,i%5?'rgba(255,255,255,.9)':'rgba(255,227,138,.95)');}});reMask(mk);
    front.push(k=>{CP_EYES.forEach(([x,y])=>{k.save();k.globalCompositeOperation='lighter';glowAt(k,x,y,4,'255,227,138',.6);disc(k,x,y,1,'#FFF6D6');k.restore();});});}
  else if(cu==='gold'){const mk=mask();tint('#E8B83A',1,'color');tint('#F7C948',.35,'overlay');tint('#FFF4C8',.16,'screen');reMask(mk);
    atop(k=>{const p=((tt/2400)%1.6)-.3;const gx=-30+p*60;const gr=k.createLinearGradient(gx-6,-80,gx+6,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');k.fillStyle=gr;k.beginPath();k.moveTo(gx-8,-84);k.lineTo(gx+4,-84);k.lineTo(gx+14,8);k.lineTo(gx+2,8);k.fill();});}
  c.save();behind.forEach(f=>{c.save();f(c);c.restore();});c.setTransform(1,0,0,1,0,0);c.globalAlpha*=alpha;c.drawImage(off,0,0,W,H,x0,y0,W,H);c.restore();front.forEach(f=>{c.save();f(c);c.restore();});}

/* ---------- golden curse coins and DM effects on the DM button ---------- */
function lvBurst(btn,fxId){const fx=LVX[fxId];if(!fx||!btn||!btn.getBoundingClientRect)return;const r=btn.getBoundingClientRect();const T=LV_TIERS[fx.t-1];const cols=[T.col,T.col2,T.acc,LVX[`dye_${fx.t}_${(fx.t*3)%10}`].col];
  const box=$('#fx')||document.body;const n=fx.shape==='burst'?18:14;for(let i=0;i<n;i++){const el=document.createElement('i');el.className='lvp '+fx.shape;const a=(i/n)*Math.PI*2+Math.random()*.4;const d=40+Math.random()*50;
    el.style.left=(r.left+r.width/2)+'px';el.style.top=(r.top+r.height/2)+'px';el.style.setProperty('--dx',Math.cos(a)*d+'px');el.style.setProperty('--dy',(Math.sin(a)*d-(fx.shape==='bubble'?40:fx.shape==='comet'?20:0))+'px');el.style.setProperty('--c',cols[i%cols.length]);el.style.setProperty('--r',(Math.random()*360|0)+'deg');el.style.animationDelay=(Math.random()*80|0)+'ms';box.appendChild(el);setTimeout(()=>el.remove(),1100);}}
{const _cel=celebrate;celebrate=function(k,btn){_cel.apply(this,arguments);try{if(k!=='d'||!S.me)return;const pl=S.players[S.me]||{};if(typeof THEME!=='undefined'&&THEME.reduced)return;
  if(pl.dmfx&&lvHas(S.me,pl.dmfx))lvBurst(btn,pl.dmfx);if(curseOf(S.me,pl)==='gold')coins(5,btn);}catch(e){}};}

/* ---------- free bait from bait packs ---------- */
{const _ls=ACT.lockStart;ACT.lockStart=async function(){const me=G.players[S.me];const b=S.view.lockMode==='fish'?BAITS[S.view.bait]:null;
  if(b&&me&&me.baitCred&&me.baitCred[b.id]>0){try{await writeDay(S.me,G.today,{spend:{['bait'+uid()]:{item:'baitfree_'+b.id,cost:0,ts:Date.now()}}});}catch(e){return writeFail(e);}S._bait=b.id;S.view.bait='';toast(`<b>Free ${esc(b.name)}</b> from your bait pack. ${me.baitCred[b.id]-1} left.`,'',2600);return _lockStart7.apply(this,arguments);}
  return _ls.apply(this,arguments);};}
{const _fp=fishPanelHtml;fishPanelHtml=function(){let h=_fp.apply(this,arguments);try{const cr=(G.players[S.me]||{}).baitCred||{};Object.keys(cr).forEach(b=>{if(cr[b]>0&&BAITS[b])h=h.replace(new RegExp(`(data-b="${b}"[^>]*>\\s*<b>[^<]*</b>)`),`$1<em class="lvFree">${cr[b]} free</em>`);});}catch(e){}return h;};}

/* ---------- records in the jukebox: the ones you've unlocked, and the next one ---------- */
{const _jb=jukeboxHtml;jukeboxHtml=function(){const me=G&&G.players[S.me];const ml=me?me.maxLevel:1;for(let i=SONGS.length-1;i>=0;i--)if(SONGS[i].lvrec)SONGS.splice(i,1);
  const recs=Object.values(LVX).filter(x=>x.kind==='rec').sort((a,b)=>LV_OF[a.id]-LV_OF[b.id]);let nextAdded=false;recs.forEach(r=>{const L=LV_OF[r.id];if(L<=ml)SONGS.push({...SONG_BY[r.song],lv:L});else if(!nextAdded){SONGS.push({...SONG_BY[r.song],lv:L});nextAdded=true;}});
  return _jb.apply(this,arguments);};}
{const _su=songUnlocked;songUnlocked=function(s){if(s&&s.lvrec){const me=G&&G.players[S.me];return !!me&&me.maxLevel>=(s.lv||LV_OF[s.lvrec]);}return _su.apply(this,arguments);};}
{const _sh=songHint;songHint=function(s){if(s&&s.lvrec)return `Level ${s.lv||LV_OF[s.lvrec]}`;return _sh.apply(this,arguments);};}

/* ---------- hideout pieces: ten families, coloured by tier ---------- */
function lvDecorDraw(fam,t,c,x,y,tm){const T=LV_TIERS[t-1];const a=T.col,b=T.col2,k=T.acc;const sym=['skull','fish','kraken','snowflake','star','diamond','skull','skull','star','crown'][t-1];
  if(fam==='banner'){line(c,x-5,y,x-5,y-18,'#6B4A2E',1.2);const w=Math.sin(tm/500)*.6;poly(c,[[x-5,y-17],[x+6,y-17+w],[x+6,y-8+w],[x+.5,y-10],[x-5,y-8]],a);drawSymbol(c,sym,x+.6,y-13,.5,b);}
  else if(fam==='lantern'){line(c,x,y,x,y-14,'#4A3A2A',1);rr(c,x-3,y-20,6,7,1.5,k);glowAt(c,x,y-16.5,7,'255,220,140',.35+Math.sin(tm/400)*.1);rr(c,x-2,y-19,4,5,1,b);}
  else if(fam==='painting'){rr(c,x-8,y-17,16,12,1,'#8A5A2A');rr(c,x-6.6,y-15.6,13.2,9.2,.5,a);c.fillStyle=b;c.fillRect(x-6.6,y-10,13.2,3.6);disc(c,x+3,y-13,1.6,b);}
  else if(fam==='statue'){rr(c,x-5,y-4,10,4,1,'#9A9590');ell(c,x,y-10,3.4,5.6,k);disc(c,x,y-16.5,2.6,k);ell(c,x-1,y-11,1.2,3,'rgba(255,255,255,.18)');}
  else if(fam==='chest'){rr(c,x-6,y-7,12,7,1.4,k);rr(c,x-6,y-10,12,4,2,a);c.fillStyle=b;c.fillRect(x-.8,y-8,1.6,3);disc(c,x,y-5.5,.8,b);}
  else if(fam==='vase'){ell(c,x,y-6,4.4,5.6,a);rr(c,x-2,y-14,4,3,1,a);c.fillStyle=b;c.fillRect(x-4.2,y-7,8.4,1.4);}
  else if(fam==='rug'){ell(c,x,y-1,10,2.8,a);ell(c,x,y-1,7.4,1.9,b);ell(c,x,y-1,3.4,1,k);}
  else if(fam==='globe'){rr(c,x-3,y-2,6,2,1,'#6B4A2E');line(c,x,y-2,x,y-6,'#6B4A2E',1);disc(c,x,y-11,5,a);ell(c,x-1,y-12,2.6,1.6,b);ell(c,x+2,y-9,1.6,1.2,b);}
  else if(fam==='trophy'){rr(c,x-4,y-3,8,3,1,'#6B4A2E');rr(c,x-1,y-7,2,4,.5,a);c.beginPath();c.moveTo(x-5,y-15);c.quadraticCurveTo(x,y-4,x+5,y-15);c.closePath();c.fillStyle=a;c.fill();ell(c,x,y-15,5,1.3,b);}
  else if(fam==='shrine'){rr(c,x-7,y-3,14,3,1,'#8C8680');rr(c,x-6,y-14,12,11,1,k);poly(c,[[x-8,y-14],[x,y-19],[x+8,y-14]],a);disc(c,x,y-8.5,2.4,b);glowAt(c,x,y-8.5,5,'255,240,200',.25);}
  else if(fam==='idol'){rr(c,x-6,y-4,12,4,1,'#7A746C');glowAt(c,x,y-12,10,'255,240,200',.3+Math.sin(tm/500)*.1);ell(c,x,y-10,4.6,6.4,a);disc(c,x,y-17.5,3.4,a);disc(c,x-1.2,y-18,.7,b);disc(c,x+1.2,y-18,.7,b);ell(c,x,y-9,2.4,3.4,b);}}
ITEMS.filter(i=>i.fam).forEach(i=>{DECOR[i.id]=(c,x,y,t)=>lvDecorDraw(i.fam,i.tier,c,x,y,t);});
for(let t=2;t<=10;t++)DECOR[`lvd_idol_${t}`]=(c,x,y,tm)=>lvDecorDraw('idol',t,c,x,y,tm);
/* ---------- wakes and cannonballs for the sets ---------- */
{const _dw=drawWake;drawWake=function(c,x,y,st,t,s=1){if(!st||!/^lv\d+$/.test(st))return _dw.apply(this,arguments);const T=LV_TIERS[+st.slice(2)-1];
  for(let i=0;i<9;i++){const p=((t/2200)+i/9)%1;const wx=x-p*40*s,wy=y+Math.sin(p*9+i)*1.5*s;const a=1-p;c.globalAlpha=a;
    if(T.t===4||T.t===6)drawSymbol(c,T.t===4?'snowflake':'diamond',wx,wy,.35*s,T.t===4?'#F2FBFF':'#FFE066');else if(T.t===8)drawSymbol(c,'skull',wx,wy,.32*s,'#E9E1CC');else if(T.t===9||T.t===10){c.fillStyle=T.t===9?'#FFE38A':'#F2C462';c.beginPath();for(let k=0;k<8;k++){const an=k/8*TAU,r=(k%2?.35:1.2)*s;c.lineTo(wx+Math.cos(an)*r,wy+Math.sin(an)*r);}c.fill();}
    else disc(c,wx,wy,(1.4-p*.6)*s,i%2?T.col:T.col2);}c.globalAlpha=1;};}
{const _dsh=drawShot;drawShot=function(c,x,y,st,t){if(!st||!/^lv\d+$/.test(st))return _dsh.apply(this,arguments);const T=LV_TIERS[+st.slice(2)-1];
  if(T.t===8){drawSymbol(c,'skull',x,y,.7,'#E9E1CC');return;}if(T.t===9){glowAt(c,x,y,5,'255,227,138',.6);drawSymbol(c,'star',x,y,.8,'#FFE38A');return;}if(T.t===10){disc(c,x,y,2.3,'#E8B83A');disc(c,x,y,1.5,'#F7D774');c.fillStyle='#8A5A12';c.fillRect(x-.3,y-1,.6,2);return;}
  if(T.t===5||T.t===6||T.t===7)glowAt(c,x,y,5,T.t===5?'255,120,40':T.t===6?'255,230,100':'179,136,255',.6);disc(c,x,y,2.2,T.col);disc(c,x-.6,y-.6,.9,T.col2);};}

/* ---------- icons for every kind of reward ---------- */
{const _di=drawItemIcon;drawItemIcon=function(cv,id){if(!id||!String(id).startsWith('lv:'))return _di.apply(this,arguments);lvIcon(cv,id.slice(3));};}
function lvIcon(cv,key,size=120){cv.width=size;cv.height=size;const c=cv.getContext('2d');const k=size/40;c.setTransform(k,0,0,k,0,0);const [kind,a1,a2]=key.split('|');const x=LVX[a1];const T=x?LV_TIERS[x.t-1]:LV_TIERS[0];
  const bgc=getComputedStyle(document.documentElement).getPropertyValue('--card').trim()||'#FBF6EA';
  if(kind==='dye'){disc(c,20,22,12,x.col);ell(c,16,17,4,3,'rgba(255,255,255,.35)');poly(c,[[20,4],[26,14],[14,14]],x.col);}
  else if(kind==='rec'){disc(c,20,20,15,'#1E1A22');[12,9.5,7].forEach(r=>{c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=.6;c.beginPath();c.arc(20,20,r,0,TAU);c.stroke();});disc(c,20,20,5.4,T.col);disc(c,20,20,1.2,'#1E1A22');}
  else if(kind==='fx'){for(let i=0;i<8;i++){const an=i/8*TAU;const cc=[T.col,T.col2,T.acc][i%3];if(x.shape==='star'||x.shape==='spark')drawSymbol(c,'star',20+Math.cos(an)*11,20+Math.sin(an)*11,.55,cc);else if(x.shape==='ring'){c.strokeStyle=cc;c.lineWidth=1.4;c.beginPath();c.arc(20+Math.cos(an)*11,20+Math.sin(an)*11,2.2,0,TAU);c.stroke();}else disc(c,20+Math.cos(an)*11,20+Math.sin(an)*11,x.shape==='bubble'?2.6:2,cc);}disc(c,20,20,4,T.col2);}
  else if(kind==='title'){rr(c,8,12,24,16,2,'#F2E3C0');c.fillStyle=T.col;c.fillRect(8,12,24,3);c.fillRect(8,25,24,3);c.fillStyle='#6B4A2E';for(let i=0;i<3;i++)c.fillRect(12,17.5+i*2.2,16-i*4,.9);}
  else if(kind==='frame'){c.strokeStyle=T.acc;c.lineWidth=5;c.beginPath();c.arc(20,20,12,0,TAU);c.stroke();c.strokeStyle=T.col;c.lineWidth=3;c.stroke();disc(c,20,20,8,bgc);}
  else if(kind==='curse'){disc(c,20,20,18,T.acc);const cu=CURSE_BY[x.curse];c.save();c.beginPath();c.arc(20,20,18,0,TAU);c.clip();try{lvBust(c,20,21,30,S.me||G.P[0],S.players[S.me]||{},1000,{curse:cu.id});}catch(e){}c.restore();}
  else if(kind==='chest'){rr(c,8,18,24,14,2,'#8A5A2A');rr(c,8,12,24,8,3,'#A8703A');c.fillStyle='#F2C462';c.fillRect(19,16,2,6);c.fillRect(8,19,24,1.4);disc(c,20,23,1.6,'#F2C462');if(a1==='open')glowAt(c,20,12,12,'255,220,120',.6);}
  else if(kind==='bait'){const col={glow:'#B6F25E',squid:'#E8A0C8',lure:'#F2C462'}[a1]||'#ccc';c.strokeStyle='#8A8790';c.lineWidth=1;c.beginPath();c.moveTo(20,4);c.lineTo(20,14);c.stroke();ell(c,20,22,6,9,col);disc(c,18,19,1.4,'rgba(255,255,255,.5)');c.strokeStyle='#5A5560';c.lineWidth=1.4;c.beginPath();c.arc(20,33,3,0,Math.PI);c.stroke();}
  else if(kind==='gold'){[[13,26],[20,22],[27,26],[20,30]].forEach(([px,py])=>{disc(c,px,py,6,'#C9962A');disc(c,px,py-1,6,'#F2C462');disc(c,px,py-1,3.6,'#F7D774');});}
  else if(kind==='shield'){c.beginPath();c.moveTo(20,6);c.lineTo(32,11);c.quadraticCurveTo(32,27,20,34);c.quadraticCurveTo(8,27,8,11);c.closePath();c.fillStyle='#4A7EC2';c.fill();c.strokeStyle='#F2C462';c.lineWidth=2;c.stroke();drawSymbol(c,'anchor',20,19,.8,'#FFFFFF');}}
const lvIconKey=r=>r.kind==='item'?r.id:r.kind==='bait'?`lv:bait|${r.b}`:r.kind==='gold'||r.kind==='shield'||r.kind==='chest'?`lv:${r.kind}|${r.kind==='chest'&&r.open?'open':''}`:`lv:${r.kind}|${r.id}`;
function lvName(r){if(r.kind==='item')return (ALL_ITEMS[r.id]||{}).name||r.id;if(r.kind==='bait')return `${r.n} × ${BAITS[r.b].name}`;if(r.kind==='gold')return `${fmtN(r.g)} doubloons`;if(r.kind==='shield')return 'Streak shield';if(r.kind==='chest')return 'Reward chest';return (LVX[r.id]||{}).name||r.id;}
function lvKindName(r){if(r.kind==='item'){const i=ALL_ITEMS[r.id]||{};return i.lvset&&i.cat!=='decor'||/^lvd_idol/.test(r.id)?`${LV_TIERS[(i.lvset||1)-1].adj} set · ${CAT_NAMES[i.cat]||i.cat}`:(CAT_NAMES[i.cat]||i.cat);}
  return {dye:'Dye',rec:'Jukebox record',fx:'DM button effect',title:'Title',frame:'Portrait frame',curse:'Curse',chest:'A shop item you don\'t own',bait:'Bait pack',gold:r.big?'Big doubloon haul':'Doubloon haul',shield:'Streak shield'}[r.kind]||'';}
{const _dv=decorateView;decorateView=function(){_dv.apply(this,arguments);try{document.querySelectorAll('canvas[data-lvi]').forEach(cv=>{if(cv.dataset.done)return;cv.dataset.done=1;const k=cv.dataset.lvi;if(k.startsWith('lv:'))lvIcon(cv,k.slice(3),cv.dataset.sz?+cv.dataset.sz:120);else drawItemIcon(cv,k);});}catch(e){console.warn(e);}};}

/* ---------- the Captain's Log: all 1000 levels ---------- */
function lvCell(L,me){const r=LV_REW[L]||[];const main=r.find(x=>x.kind==='curse')||r[0];const got=me.maxLevel>=L;const chest=r.some(x=>x.kind==='chest');const pend=chest&&got&&!me.lvChests[L];
  return `<button class="lvCell ${got?'got':''} ${L===me.maxLevel+1?'next':''} ${main.kind==='curse'?'curse':''} ${L%10===0?'ms':''} ${pend?'pend':''}" data-act="lvInfo" data-l="${L}" aria-label="Level ${L}: ${esc(lvName(main))}"><canvas data-lvi="${lvIconKey(main)}" data-sz="64"></canvas><small>${L}</small></button>`;}
SCREENS.log=()=>{const me=G.players[S.me];const L=me.li.level,ml=me.maxLevel;const d=lvDist(L);const tier=S.view.lvTier||Math.min(10,Math.max(1,Math.ceil((ml+1)/100)));const T=LV_TIERS[tier-1];const cu=CURSE_BY[T.curse];
  const next=[];for(let l=ml+1;l<=LV_MAX&&next.length<10;l++)next.push(l);
  const pend=me.lvPending||[];
  return `<div class="pad lvPage"><div class="card hero lvHero"><div class="row between"><div><small>Captain's Log · level track</small><h2>Level ${L}${d?` <span class="lvDistBig">Distinction ${roman(d)}</span>`:''}</h2></div><canvas class="lvHeroIco" data-lvi="lv:curse|curse_${T.curse}" data-sz="96" aria-hidden="true"></canvas></div>
     ${me.li.need?`${bar(me.li.into,me.li.need)}<small class="num">${fmtN(me.li.into)} / ${fmtN(me.li.need)} XP to level ${L+1}</small>`:'<small>Level 1000. There is nowhere left to climb. Have a sit down.</small>'}
     <p class="tiny muted" style="margin:8px 0 0">Every level pays doubloons and unlocks something. Every hundredth level unlocks a curse. You've banked ${fmtN(me.lvlGold)} doubloons from levelling.</p></div>
   ${pend.length?`<div class="card lvChestCard"><canvas data-lvi="lv:chest|" data-sz="80"></canvas><div class="grow"><b>${pend.length} reward chest${pend.length>1?'s':''} to open</b><small>Each holds a shop item you don't own yet.</small></div><button class="btn primary" data-act="lvOpenChests">Open</button></div>`:''}
   ${next.length?`<h3 class="lvH">Coming up</h3><div class="lvNext">${next.map((l,i)=>{const r=LV_REW[l]||[];return `<button class="lvBig ${i===0?'first':''} ${r.some(x=>x.kind==='curse')?'curse':''}" data-act="lvInfo" data-l="${l}">${i===0?`<span class="lvIn">${fmtN(Math.max(0,me.li.need-me.li.into))} XP to go</span>`:''}<small>Level ${l}</small><div class="lvBigIcos">${r.slice(0,2).map(x=>`<canvas data-lvi="${lvIconKey(x)}" data-sz="96"></canvas>`).join('')}</div><b>${esc(r.map(lvName).join(' + '))}</b><em>${esc(r.map(lvKindName).join(' · '))}</em></button>`;}).join('')}</div>`:''}
   <h3 class="lvH">The ten tiers</h3><div class="lvTiers">${LV_TIERS.map(x=>`<button class="lvTierBtn ${x.t===tier?'on':''} ${ml>=x.t*100?'done':''}" data-act="lvTier" data-t="${x.t}" style="--tc:${x.col};--ta:${x.acc}"><b>${x.t===1?'1–100':`${roman(x.t-1)}`}</b><small>${esc(x.name.replace(/^The /,''))}</small></button>`).join('')}</div>
   <div class="card lvTierCard" style="--tc:${T.col};--ta:${T.acc};--t2:${T.col2}"><div class="lvTierHead"><canvas class="lvCurseIco" data-lvi="lv:curse|curse_${T.curse}" data-sz="140"></canvas><div class="grow"><small>Levels ${(tier-1)*100+1} to ${tier*100}${tier>1?` · Distinction ${roman(tier-1)}`:''}</small><h3>${esc(T.name)}</h3><p class="tiny"><b>${esc(cu.name)}</b> at level ${cu.lv}: ${esc(cu.look)}.</p></div></div>
     <div class="lvGrid">${Array.from({length:100},(_,i)=>(tier-1)*100+i+1).filter(l=>l>=2).map(l=>lvCell(l,me)).join('')}</div>
     <p class="tiny muted" style="margin:8px 0 0">Bigger squares are the ${esc(T.adj)} set: a piece every ten levels. Tap any level to see what it gives.</p></div></div>`;};
ACT.lvTier=d=>{S.view.lvTier=+d.t;render();};
ACT.lvInfo=d=>{const L=+d.l;const r=LV_REW[L]||[];const me=G.players[S.me];const got=me.maxLevel>=L;
  openModal(`<div class="lvInfo"><small>Level ${L}${lvDist(L)?` · Distinction ${roman(lvDist(L))}`:''}</small><h2>${got?'Unlocked':'Locked'}</h2>${r.map(x=>`<div class="lvInfoRow"><canvas data-lvi="${lvIconKey(x)}" data-sz="120"></canvas><div><b>${esc(lvName(x))}</b><small>${esc(lvKindName(x))}${x.kind==='curse'?` · ${esc(CURSE_BY[LVX[x.id].curse].look)}`:''}${x.kind==='chest'&&me.lvChests[L]&&ALL_ITEMS[me.lvChests[L]]?` · held ${esc(ALL_ITEMS[me.lvChests[L]].name)}`:''}</small></div></div>`).join('')}
   <p class="tiny muted">${got?'It\'s yours.':`${fmtN(lvXpTo(me,L))} XP to go.`}${lvGold(L)?` Reaching it also pays ${fmtN(lvGold(L))} doubloons.`:''}</p>
   <div class="row" style="justify-content:flex-end;gap:8px">${got&&r.some(x=>x.kind==='chest')&&!me.lvChests[L]?'<button class="btn primary" data-act="lvOpenChests">Open the chest</button>':''}${got&&r.some(x=>['curse','dye','title','frame','fx'].includes(x.kind))?`<button class="btn" data-act="lvWear" data-l="${L}">Use it</button>`:''}<button class="btn ghost" data-act="closeModal">Close</button></div></div>`);
  setTimeout(()=>{if(typeof decorateView==='function')document.querySelectorAll('#modal canvas[data-lvi]').forEach(cv=>{const k=cv.dataset.lvi;if(k.startsWith('lv:'))lvIcon(cv,k.slice(3),120);else drawItemIcon(cv,k);});},20);};
function lvXpTo(me,L){if(me.li.level>=L)return 0;let x=me.li.need-me.li.into;for(let l=me.li.level+1;l<L;l++)x+=lvNeed(l);return x;}
ACT.lvWear=d=>{const r=LV_REW[+d.l]||[];const x=r.find(y=>['curse','dye','title','frame','fx'].includes(y.kind));closeModal();if(!x)return;S.view.islet=S.me;S.view.wardrobe={curse:'curse',dye:'dye',title:'title',frame:'frame',fx:'dmfx'}[x.kind];location.hash='#ship';};

/* ---------- opening chests ---------- */
ACT.lvOpenChests=async()=>{const me=G.players[S.me];const pend=(me.lvPending||[]).slice();if(!pend.length)return;const pool=LV_CHEST_POOL();const have=new Set(Object.keys(me.owned));const got=[];const bonus={};
  pend.forEach(L=>{const cap=400+L*60;let opts=pool.filter(i=>!have.has(i.id)&&(i.price||0)<=cap);if(!opts.length)opts=pool.filter(i=>!have.has(i.id));const pick=opts.length?opts.slice().sort((a,b)=>h32(S.me+L+a.id)-h32(S.me+L+b.id))[0]:null;
    if(pick){have.add(pick.id);got.push(pick);}bonus['lvc_'+L]={xp:0,g:pick?0:Math.round((120+L*4)/10)*20,item:pick?pick.id:'',ts:Date.now()};});
  try{await writeDay(S.me,G.today,{bonus});}catch(e){return writeFail(e);}closeModal();try{SFX.ach();}catch(e){}
  openModal(`<div class="lvChestOpen"><canvas data-lvi="lv:chest|open" data-sz="160" class="lvChestBig"></canvas><h2>${got.length>1?`${got.length} chests opened`:'Chest opened'}</h2><div class="lvGot">${got.map(i=>`<div class="lvGotItem"><canvas class="icon" data-id="${i.id}"></canvas><b>${esc(i.name)}</b><small>${esc(CAT_NAMES[i.cat]||'')} · worth ${fmtN(i.price)}</small></div>`).join('')||'<p>The shop has nothing left you don\'t own, so you get doubloons instead. Show-off.</p>'}</div><div class="row" style="justify-content:flex-end;gap:8px"><a class="btn" href="#ship" data-act="closeModal">Wardrobe</a><button class="btn primary" data-act="closeModal">Lovely</button></div></div>`);
  setTimeout(()=>{document.querySelectorAll('#modal canvas.icon').forEach(cv=>drawItemIcon(cv,cv.dataset.id));document.querySelectorAll('#modal canvas[data-lvi]').forEach(cv=>lvIcon(cv,cv.dataset.lvi.slice(3),160));try{fireworks(1400);}catch(e){}},30);};

/* ---------- catch-up chest, level-up toasts and the curse unlock ---------- */
let LV_WATCH=null;
function lvWatch(me){if(!S.me||!S.players[S.me])return;const pl=S.players[S.me];const ml=me.maxLevel;
  if(LV_WATCH===null){LV_WATCH=ml;if(pl.lvSeen==null&&ml>=2&&!S.lvCatchShown){S.lvCatchShown=true;setTimeout(()=>lvCatchUp(me),1800);}else if(pl.lvSeen!=null&&ml>pl.lvSeen)setTimeout(()=>lvLevelled(pl.lvSeen,ml),1500);return;}
  if(ml>LV_WATCH){const from=LV_WATCH;LV_WATCH=ml;setTimeout(()=>lvLevelled(from,ml),3600);}}
function lvNewList(from,to){const out=[];for(let L=from+1;L<=to;L++)(LV_REW[L]||[]).forEach(r=>{if(r.kind==='item'&&!ALL_ITEMS[r.id]?.lvset&&!/^lvd_/.test(r.id))return;out.push({L,r});});return out;}
function lvCatchUp(me){if(document.querySelector('#modal:not([hidden]) .lvCatch'))return;const list=lvNewList(1,me.maxLevel);if(!list.length){writePlayer(S.me,{lvSeen:me.maxLevel}).catch(()=>{});return;}
  const gold=list.filter(x=>x.r.kind==='gold').reduce((a,x)=>a+x.r.g,0);const chests=(me.lvPending||[]).length;
  openModal(`<div class="lvCatch"><canvas data-lvi="lv:chest|open" data-sz="160" class="lvChestBig"></canvas><small>New: a reward at every level</small><h2>Your catch-up chest</h2><p class="muted">Levels now go to 1,000, and every one of them unlocks something. You've already passed level ${me.maxLevel}, so here's everything you'd have earned on the way.</p>
   <div class="lvCatchList">${list.map(({L,r})=>`<div class="lvCatchRow"><canvas data-lvi="${lvIconKey(r)}" data-sz="72"></canvas><div class="grow"><b>${esc(lvName(r))}</b><small>Level ${L} · ${esc(lvKindName(r))}</small></div></div>`).join('')}</div>
   <p class="tiny muted">${gold?`${fmtN(gold)} doubloons are already in your purse. `:''}Dyes, titles, frames and DM effects are in your Wardrobe. Records are in the Tavern jukebox.${chests?` ${chests===1?'One chest holds':`${chests} chests hold`} a shop item you don't own yet.`:''}</p>
   <div class="row" style="justify-content:flex-end;gap:8px"><button class="btn primary" data-act="lvCatchGo">${chests?'Open it all':'Lovely, thanks'}</button></div></div>`);
  setTimeout(()=>{document.querySelectorAll('#modal canvas[data-lvi]').forEach(cv=>{const k=cv.dataset.lvi;if(k.startsWith('lv:'))lvIcon(cv,k.slice(3),+cv.dataset.sz||72);else drawItemIcon(cv,k);});try{SFX.ach();}catch(e){}},30);}
ACT.lvCatchGo=async()=>{const me=G.players[S.me];try{await writePlayer(S.me,{lvSeen:me.maxLevel});}catch(e){}if((me.lvPending||[]).length)return ACT.lvOpenChests();closeModal();};
function lvLevelled(from,to){const me=G.players[S.me];if(!me)return;const list=lvNewList(from,to).filter(x=>x.r.kind!=='item');writePlayer(S.me,{lvSeen:to}).catch(()=>{});
  const cu=list.find(x=>x.r.kind==='curse');if(cu){lvCurseShow(LVX[cu.r.id].curse,true);return;}
  if(list.length)toast(`<b>Level ${to} reward:</b> ${list.slice(0,3).map(x=>esc(lvName(x.r))).join(', ')}${list.length>3?` and ${list.length-3} more`:''}. ${list.some(x=>x.r.kind==='chest')?'<button class="tLink" data-act="lvOpenChests">Open the chest</button>':'<a class="tLink" href="#log">See it</a>'}`,'',6500);}
function lvCurseShow(id,fresh){const cu=CURSE_BY[id];if(!cu)return;document.querySelectorAll('.lvCurseFx').forEach(e=>e.remove());const T=LV_TIERS[cu.lv/100-1];
  const el=document.createElement('div');el.className='lvCurseFx';el.style.setProperty('--tc',T.col);el.style.setProperty('--ta',T.acc);el.style.setProperty('--t2',T.col2);
  el.innerHTML=`<canvas width="520" height="520"></canvas><div class="lvCurseTxt"><small>${fresh?`Level ${cu.lv} · curse unlocked`:'Curse'}</small><h1>The ${esc(cu.name)}</h1><p>${esc(cu.line)}</p><div class="row" style="justify-content:center;gap:8px">${fresh?`<button class="btn primary" data-act="lvCurseWear" data-c="${id}">Wear it now</button>`:''}<button class="btn ghost" data-act="lvCurseClose">${fresh?'Later':'Close'}</button></div></div>`;document.body.appendChild(el);
  try{if(fresh){SFX.lvl&&SFX.lvl();fireworks(2400,[T.col,T.col2,T.acc,'#FFFFFF']);}}catch(e){}
  const cv=el.querySelector('canvas'),c=cv.getContext('2d');const t0=performance.now();const pid=S.me;const pl=S.players[pid]||{};
  const loop=now=>{if(!el.isConnected)return;const t=now-t0;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,520,520);const k=Math.min(1,t/1600);c.save();c.globalAlpha=Math.min(1,t/400);
    lvBust(c,260,280,330*(.92+.08*k),pid,pl,t,{dance:k>=1,curse:k<.5?null:id});if(k<1){c.globalCompositeOperation='lighter';c.globalAlpha=Math.sin(k*Math.PI)*.9;const g=c.createRadialGradient(260,240,10,260,240,260);g.addColorStop(0,'#FFFFFF');g.addColorStop(.4,T.col2);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,520,520);}
    c.restore();requestAnimationFrame(loop);};requestAnimationFrame(loop);}
ACT.lvCurseClose=()=>document.querySelectorAll('.lvCurseFx').forEach(e=>{e.classList.add('out');setTimeout(()=>e.remove(),300);});
ACT.lvCurseWear=async d=>{ACT.lvCurseClose();try{await writePlayer(S.me,{curse:d.c});toast(`<b>${esc(CURSE_BY[d.c].name)}</b> on. Switch it off any time in the Wardrobe.`);}catch(e){writeFail(e);}};

/* ---------- the Wardrobe: curses, dyes, titles, frames and DM effects ---------- */
const LV_WCATS=[['curse','Curses'],['dye','Dyes'],['title','Titles'],['frame','Frames'],['dmfx','DM effects']];
{const _sh=SCREENS.ship;SCREENS.ship=function(){const wc=S.view.wardrobe;const ours=LV_WCATS.some(([k])=>k===wc);if(ours)S.view.wardrobe='hat';let h;try{h=_sh.apply(this,arguments);}finally{if(ours)S.view.wardrobe=wc;}
  const pid=S.view.islet||S.me;if(pid!==S.me)return h;
  h=h.replace(/(<div class="chips" role="tablist">[\s\S]*?)(<\/div>)/,(m,a,b)=>{let a2=ours?a.replace(/chip on"/,'chip"'):a;return a2+LV_WCATS.map(([k,n])=>`<button class="chip lvChip ${wc===k?'on':''}" data-act="wardrobe" data-c="${k}">${n}</button>`).join('')+b;});
  if(ours){h=h.replace(/<div class="slots">[\s\S]*?<\/div>/,'');h=h.replace(/<div class="wardrobe">[\s\S]*?<\/div><\/div>/,`${lvWardHtml(wc)}</div>`);}
  const own=lvTitleOf(pid);if(own)h=h.replace(/(<div class="card hero"><div class="row between"><div><small>)[^<]*(<\/small>)/,`$1${esc(own)}$2`);
  return h;};}
function lvWardHtml(wc){const me=G.players[S.me];const pl=S.players[S.me]||{};const ml=me.maxLevel;const all=Object.values(LVX).filter(x=>x.kind===(wc==='dmfx'?'fx':wc)&&LV_OF[x.id]!=null).sort((a,b)=>LV_OF[a.id]-LV_OF[b.id]);const own=all.filter(x=>lvHas(S.me,x.id));const nxt=all.find(x=>!lvHas(S.me,x.id));
  const nextLine=nxt?`<p class="tiny muted lvWNext">Next: ${esc(nxt.name)} at level ${LV_OF[nxt.id]}.</p>`:'';
  if(wc==='curse')return `<div class="lvCurses">${CURSES.map(cu=>{const has=ml>=cu.lv;const on=pl.curse===cu.id;return `<button class="lvCurse ${has?'':'locked'} ${on?'on':''}" data-act="${has?'lvCurseToggle':'lvCurseLook'}" data-c="${cu.id}"><canvas data-lvi="lv:curse|curse_${cu.id}" data-sz="120"></canvas><b>${esc(cu.name)}</b><small>${has?(on?'Wearing':'Tap to wear'):`Level ${cu.lv}`}</small></button>`;}).join('')}</div><p class="tiny muted">One curse at a time. James sees it too. Tap a locked one to preview it.</p>`;
  if(!own.length&&wc==='dye')return `<p class="muted tiny" style="margin:6px 0">No dyes yet.</p>${nextLine}`;
  if(wc==='dye'){const used=pl.dyes||{};return `<div class="lvDyeOn">${LV_DYE_SLOTS.map(([k,n])=>{const d=used[k]&&LVX[used[k]];return `<span class="lvDyeSlot"><i style="background:${d?d.col:'transparent'}" class="${d?'':'none'}"></i>${n}${d?`: ${esc(d.name)}`:''}</span>`;}).join('')}</div>
     <div class="lvDyes">${own.map(x=>`<button class="lvDye" data-act="lvDye" data-id="${x.id}" title="${esc(x.name)}"><i style="background:${x.col}"></i><span>${esc(x.name)}</span></button>`).join('')}</div>${nextLine}`;}
  if(wc==='title')return `<div class="lvList">${[{id:'',name:`${lvDist(me.li.level)?distTitle(lvDist(me.li.level)):titleFor(me.li.level)} (your rank)`},...own].map(x=>`<button class="lvRowBtn ${(pl.title||'')===x.id?'on':''}" data-act="lvSet" data-k="title" data-id="${x.id}"><b>${esc(x.name)}</b>${(pl.title||'')===x.id?'<small>Wearing</small>':''}</button>`).join('')}</div>${nextLine}`;
  if(wc==='frame')return `<div class="lvFrames"><button class="lvFrame ${!pl.frame?'on':''}" data-act="lvSet" data-k="frame" data-id=""><span class="lvFrAv" style="background-image:url(${avatarCanvas(S.me)})"></span><small>None</small></button>${own.map(x=>`<button class="lvFrame ${pl.frame===x.id?'on':''}" data-act="lvSet" data-k="frame" data-id="${x.id}"><span class="lvFrAv" style="background-image:url(${avatarCanvas(S.me)});box-shadow:${lvFrameCssFor(x)}"></span><small>${esc(x.name)}</small></button>`).join('')}</div>${nextLine}`;
  if(wc==='dmfx')return `<div class="lvList">${[{id:'',name:'None'},...own].map(x=>`<button class="lvRowBtn ${(pl.dmfx||'')===x.id?'on':''}" data-act="lvSet" data-k="dmfx" data-id="${x.id}">${x.id?`<canvas data-lvi="lv:fx|${x.id}" data-sz="56"></canvas>`:''}<b>${esc(x.name)}</b>${(pl.dmfx||'')===x.id?'<small>On</small>':''}</button>`).join('')}</div><p class="tiny muted">Plays when you log a DM.</p>${nextLine}`;
  return '';}
function lvFrameCssFor(x){const T=LV_TIERS[x.t-1];const a=T.col,b=T.col2,c=T.acc;return [`0 0 0 2px ${a}, 0 0 0 4px ${c}`,`0 0 0 3px ${b}, 0 0 0 5px ${a}, 0 0 10px ${a}`,`0 0 0 2px ${c}, 0 0 0 4px ${b}, 0 0 0 6px ${a}`,`0 0 0 4px ${a}, 0 0 0 5px ${b}, 0 0 14px 2px ${b}`,`0 0 0 2px ${b}, 0 0 0 5px ${a}, 0 0 0 7px ${c}, 0 0 16px 3px ${a}`][x.v];}
ACT.lvSet=async(d,el)=>{const patch={[d.k]:d.id||null};try{await writePlayer(S.me,patch);tone(880,.06,'triangle',.04);if(d.k==='dmfx'&&d.id)lvBurst(el,d.id);}catch(e){writeFail(e);}};
ACT.lvCurseToggle=async d=>{const pl=S.players[S.me]||{};const on=pl.curse===d.c;try{await writePlayer(S.me,{curse:on?null:d.c});if(!on)lvCurseShow(d.c,false);}catch(e){writeFail(e);}};
ACT.lvCurseLook=d=>lvCurseShow(d.c,false);
ACT.lvDye=d=>{const x=LVX[d.id];const pl=S.players[S.me]||{};const used=pl.dyes||{};
  openModal(`<h2>${esc(x.name)}</h2><p class="muted" style="margin:2px 0 10px">Which item should this colour go on?</p><div class="lvDyePick">${LV_DYE_SLOTS.map(([k,n])=>{const base=pl[k]||(typeof SHIP_DEFAULT!=='undefined'&&SHIP_DEFAULT[k]);const ok=!!(base&&ALL_ITEMS[base]);return `<button class="btn ${used[k]===x.id?'primary':''}" data-act="lvDyeGo" data-id="${x.id}" data-k="${k}" ${ok?'':'disabled title="Wear one first"'}><i class="lvSw" style="background:${x.col}"></i>${n}${used[k]===x.id?' ✓':''}</button>`;}).join('')}</div>
   ${Object.keys(used).length?`<p class="tiny muted" style="margin:10px 0 4px">Remove a dye:</p><div class="lvDyePick">${Object.keys(used).map(k=>`<button class="btn ghost sm" data-act="lvDyeGo" data-id="" data-k="${k}">${LV_DYE_SLOTS.find(s=>s[0]===k)[1]}</button>`).join('')}</div>`:''}
   <div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn ghost" data-act="closeModal">Done</button></div>`);};
ACT.lvDyeGo=async d=>{const pl=S.players[S.me]||{};const dyes={...(pl.dyes||{})};if(d.id)dyes[d.k]=d.id;else delete dyes[d.k];try{await writePlayer(S.me,{dyes});closeModal();toast(d.id?`<b>${esc(LVX[d.id].name)}</b> on your ${d.k}.`:'Dye removed.');}catch(e){writeFail(e);}};
Object.assign(CAT_NAMES,{curse:'Curses',dye:'Dyes',title:'Titles',frame:'Frames',dmfx:'DM effects'});

/* ---------- How to play ---------- */
{const i=HELP.findIndex(h=>h[0]==='Levels and Distinction');const txt=['Levels and Distinction','XP raises your level from 1 to 1,000. Levels 1 to 100 take about a year. After that come Distinctions I to IX, 100 levels each, at roughly a level a day, so each Distinction takes two to three months. Every level pays doubloons and unlocks something: a piece of that tier\'s exclusive set every ten levels, titles and portrait frames, dyes, jukebox records, DM button effects, hideout pieces, reward chests, bait packs, streak shields and doubloon hauls. Every hundredth level unlocks a curse that changes how your captain looks everywhere: Ghost at 100, then Coral, Ink, Frost, Ember, Storm, Shadow, Bone, Star, and Golden at 1,000. Wear one curse at a time from the Wardrobe. The Captain\'s Log shows all 1,000 levels.'];if(i>=0)HELP[i]=txt;else HELP.push(txt);}
function lvShade(hex,k){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(k<0?v*(1+k):v+(255-v)*k)));return '#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('');}
