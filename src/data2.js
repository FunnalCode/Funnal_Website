/* ============================== v4 CONTENT ============================== */
DEFAULT_CONFIG.sightingMode='auto'; // 'auto' = game picks the daily time itself; 'email' = a scheduled email task opens the sighting
/* ---------- Emissary flag: YOUR DMs today raise YOUR grade; higher grade = your DMs worth more ---------- */
const EMISSARY=[{at:0,mult:1,name:'Grade I'},{at:10,mult:1.2,name:'Grade II'},{at:22,mult:1.4,name:'Grade III'},{at:35,mult:1.7,name:'Grade IV'},{at:50,mult:2,name:'Grade V'}];
const emGrade=n=>EMISSARY.reduce((g,x,i)=>n>=x.at?i:g,0);
/* ---------- Golden Tide: one 25-minute double-score window every working day ---------- */
const GOLDEN_LEN=25;
const GTC=new Map();function goldenFor(date){let g=GTC.get(date);if(g)return g;const s=570+h32(date+'golden')%(1000-570-GOLDEN_LEN);g={start:s,end:s+GOLDEN_LEN};GTC.set(date,g);return g;} // between 09:30 and ~16:15
/* ---------- Limited-time pets ---------- */
// season: evergreen | winter (Dec-Feb) | spring (Mar-May) | summer (Jun-Aug) | autumn (Sep-Nov). Rarer = shorter sighting, more DMs needed, cooler pet.
const PET_RARITY={common:{p:45,win:30,need:5},uncommon:{p:27,win:30,need:8},rare:{p:15,win:35,need:14},epic:{p:8,win:40,need:22},legendary:{p:4,win:45,need:35},mythic:{p:1,win:45,need:50}};
const PETS=[
  {id:'p_pup',name:'Ship Pup',sp:'dog',col:'#D9A066',col2:'#F4E2C6',ear:'flop',rar:'common',season:'evergreen'},
  {id:'p_cat',name:'Harbour Cat',sp:'cat',col:'#F2A33A',col2:'#FFFFFF',rar:'uncommon',season:'evergreen',x:'stripes'},
  {id:'p_otter',name:'Sea Otter',sp:'otter',col:'#9A6B45',col2:'#E9D2B4',rar:'rare',season:'evergreen'},
  {id:'p_corgi',name:'Captain Corgi',sp:'dog',col:'#E8934A',col2:'#FFFFFF',ear:'point',rar:'epic',season:'evergreen',x:'tricorn'},
  {id:'p_seadragon',name:'Baby Sea Dragon',sp:'dragon',col:'#3FA59A',col2:'#BFF0E4',rar:'legendary',season:'evergreen'},
  {id:'p_phoenixhound',name:'Phoenix Hound',sp:'dog',col:'#F2683A',col2:'#FFE07A',ear:'point',rar:'mythic',season:'evergreen',x:'flame'},
  {id:'p_hedgehog',name:'Conker Hedgehog',sp:'hedgehog',col:'#8A6244',col2:'#F2D6B6',rar:'common',season:'autumn'},
  {id:'p_fox',name:'Fox Kit',sp:'cat',col:'#E8763E',col2:'#FFFFFF',ear:'point',rar:'uncommon',season:'autumn',x:'foxtail'},
  {id:'p_owl',name:'Lantern Owl',sp:'bird',col:'#B98552',col2:'#F4E2C6',rar:'rare',season:'autumn',x:'lantern'},
  {id:'p_emberwolf',name:'Ember Wolf',sp:'dog',col:'#55606E',col2:'#F2A33A',ear:'point',rar:'epic',season:'autumn',x:'embers'},
  {id:'p_pumpkindragon',name:'Pumpkin Dragon',sp:'dragon',col:'#E8763E',col2:'#5FAE4E',rar:'legendary',season:'autumn'},
  {id:'p_ghostkraken',name:'Ghost Kraken Pup',sp:'kraken',col:'#CFE5E1',col2:'#9B5DE5',rar:'mythic',season:'autumn',x:'ghost'},
  {id:'p_penguin',name:'Penguin Chick',sp:'bird',col:'#3F4A5C',col2:'#FFFFFF',rar:'common',season:'winter',x:'penguin'},
  {id:'p_snowpug',name:'Snow Pug',sp:'dog',col:'#F4E9D8',col2:'#4A3F3A',ear:'flop',rar:'uncommon',season:'winter',x:'scarf'},
  {id:'p_arcticfox',name:'Arctic Fox',sp:'cat',col:'#FFFFFF',col2:'#CFE3F2',ear:'point',rar:'rare',season:'winter',x:'foxtail'},
  {id:'p_husky',name:'Lantern Husky',sp:'dog',col:'#7F8A95',col2:'#FFFFFF',ear:'point',rar:'epic',season:'winter',x:'lantern'},
  {id:'p_frostdragon',name:'Frost Dragon',sp:'dragon',col:'#8FD0F0',col2:'#FFFFFF',rar:'legendary',season:'winter',x:'frost'},
  {id:'p_auroranarwhal',name:'Aurora Narwhal',sp:'narwhal',col:'#7F8AD9',col2:'#E6F0FF',rar:'mythic',season:'winter',x:'aurora'},
  {id:'p_duckling',name:'Puddle Duckling',sp:'bird',col:'#F7D24A',col2:'#F2A33A',rar:'common',season:'spring',x:'duck'},
  {id:'p_bunny',name:'Dune Bunny',sp:'bunny',col:'#F2E6D8',col2:'#F4A6C0',rar:'uncommon',season:'spring'},
  {id:'p_axolotl',name:'Axolotl',sp:'axolotl',col:'#F7A6C4',col2:'#E0457B',rar:'rare',season:'spring'},
  {id:'p_dalmatian',name:'Lucky Dalmatian',sp:'dog',col:'#FFFFFF',col2:'#3F3A40',ear:'flop',rar:'epic',season:'spring',x:'spots'},
  {id:'p_blossomdragon',name:'Blossom Dragon',sp:'dragon',col:'#F4A6C0',col2:'#FFF0F6',rar:'legendary',season:'spring',x:'petals'},
  {id:'p_rainbowseahorse',name:'Rainbow Seahorse',sp:'seahorse',col:'#9B5DE5',col2:'#FFE07A',rar:'mythic',season:'spring',x:'rainbow'},
  {id:'p_hermit',name:'Hermit Crab',sp:'crab',col:'#E8866A',col2:'#E8C36A',rar:'common',season:'summer'},
  {id:'p_turtle',name:'Sea Turtle',sp:'turtle',col:'#5DBE9C',col2:'#A8704A',rar:'uncommon',season:'summer'},
  {id:'p_redpanda',name:'Red Panda',sp:'cat',col:'#C9543A',col2:'#FFFFFF',ear:'round',rar:'rare',season:'summer',x:'stripes'},
  {id:'p_goldie',name:'Pirate Retriever',sp:'dog',col:'#E8BC52',col2:'#FFF0C8',ear:'flop',rar:'epic',season:'summer',x:'bandana'},
  {id:'p_stormdragon',name:'Storm Dragon',sp:'dragon',col:'#4A5A8C',col2:'#FFE07A',rar:'legendary',season:'summer',x:'storm'},
  {id:'p_celestialwhale',name:'Celestial Whale',sp:'narwhal',col:'#2E3A6C',col2:'#FFF3B8',rar:'mythic',season:'summer',x:'stars'},
  {id:'p_biscuit',name:'Biscuit the Deck Dog',sp:'dog',col:'#C98A55',col2:'#F4E2C6',ear:'flop',rar:'common',season:'evergreen',v2:1},
  {id:'p_pebble',name:'Pebble Crab',sp:'crab',col:'#B9A58C',col2:'#E9DCC6',rar:'common',season:'evergreen',v2:1},
  {id:'p_mop',name:'Mop the Shaggy Pup',sp:'dog',col:'#E9DCC0',col2:'#FFFFFF',ear:'flop',rar:'common',season:'evergreen',v2:1},
  {id:'p_nibbles',name:'Nibbles the Bunny',sp:'bunny',col:'#C9B49A',col2:'#FFFFFF',rar:'common',season:'evergreen',v2:1},
  {id:'p_doubloon',name:'Doubloon the Cat',sp:'cat',col:'#3F3A30',col2:'#F2C462',rar:'common',season:'evergreen',v2:1},
  {id:'p_puddle',name:'Puddle Turtle',sp:'turtle',col:'#8FBF7A',col2:'#E9DCC0',rar:'common',season:'evergreen',v2:1},
  {id:'p_gullet',name:'Gullet the Gull',sp:'bird',col:'#F4F1E8',col2:'#F2A33A',rar:'common',season:'evergreen',v2:1},
  {id:'p_kelp',name:'Kelp the Seahorse',sp:'seahorse',col:'#7FB59A',col2:'#DFF2E6',rar:'common',season:'evergreen',v2:1},
  {id:'p_bramble',name:'Bramble Hedgehog',sp:'hedgehog',col:'#9A6B45',col2:'#F4E2C6',rar:'common',season:'evergreen',v2:1},
  {id:'p_soggy',name:'Sir Soggy Otter',sp:'otter',col:'#7A5434',col2:'#E9D2B4',rar:'common',season:'evergreen',v2:1},
  {id:'p_rusty',name:'Rusty the Ship Cat',sp:'cat',col:'#C9653A',col2:'#FFFFFF',rar:'common',season:'evergreen',v2:1,x:'stripes'},
  {id:'p_minnow',name:'Minnow the Axolotl',sp:'axolotl',col:'#F7B6CC',col2:'#FFE6EF',rar:'common',season:'evergreen',v2:1},
  {id:'p_barnacle',name:'Barnacle Bill',sp:'crab',col:'#D9744A',col2:'#FFD9C2',rar:'common',season:'evergreen',v2:1,x:'spots'},
  {id:'p_toast',name:'Toast the Corgi',sp:'dog',col:'#D99A57',col2:'#FFFFFF',ear:'point',rar:'common',season:'evergreen',v2:1},
  {id:'p_salty',name:'Salty the Sea Dog',sp:'dog',col:'#6E7F8C',col2:'#E9EEF2',ear:'flop',rar:'uncommon',season:'evergreen',v2:1,x:'bandana'},
  {id:'p_marmalade',name:'Marmalade Purrbeard',sp:'cat',col:'#F2A33A',col2:'#FFF0C8',rar:'uncommon',season:'evergreen',v2:1,x:'tricorn'},
  {id:'p_puffin',name:'Captain Puffin',sp:'bird',col:'#2E3440',col2:'#F27A3A',rar:'uncommon',season:'evergreen',v2:1},
  {id:'p_clementine',name:'Clementine Crab',sp:'crab',col:'#F29A3A',col2:'#FFE2B8',rar:'uncommon',season:'evergreen',v2:1,x:'bandana'},
  {id:'p_moss',name:'Moss-Back Turtle',sp:'turtle',col:'#5E8C4A',col2:'#CFE6B8',rar:'uncommon',season:'evergreen',v2:1,x:'petals'},
  {id:'p_dumpling',name:'Dumpling Bunny',sp:'bunny',col:'#F4E8D4',col2:'#F7B6CC',rar:'uncommon',season:'evergreen',v2:1,x:'scarf'},
  {id:'p_inkwell',name:'Inkwell Otter',sp:'otter',col:'#3F4A5C',col2:'#C9D3DE',rar:'uncommon',season:'evergreen',v2:1},
  {id:'p_coral',name:'Coral the Seahorse',sp:'seahorse',col:'#F2768F',col2:'#FFD3DC',rar:'uncommon',season:'evergreen',v2:1,x:'spots'},
  {id:'p_bubbles',name:'Bubbles the Axolotl',sp:'axolotl',col:'#9FD7F0',col2:'#E8F7FC',rar:'uncommon',season:'evergreen',v2:1},
  {id:'p_hazel',name:'Hazel Hedgehog',sp:'hedgehog',col:'#C9A27A',col2:'#FFF0DC',rar:'uncommon',season:'evergreen',v2:1,x:'scarf'},
  {id:'p_parley',name:'Parley the Parrot',sp:'bird',col:'#45B07C',col2:'#F2C462',rar:'uncommon',season:'evergreen',v2:1},
  {id:'p_pip',name:'Pip the Sea Pup',sp:'dog',col:'#B7C4CF',col2:'#FFFFFF',ear:'point',rar:'uncommon',season:'evergreen',v2:1,x:'scarf'},
  {id:'p_admiral',name:'Admiral Whiskers',sp:'cat',col:'#9AA8B8',col2:'#FFFFFF',rar:'rare',season:'evergreen',v2:1,x:'tricorn'},
  {id:'p_jade',name:'Jade Turtle',sp:'turtle',col:'#2F8F62',col2:'#9FE0C0',rar:'rare',season:'evergreen',v2:1,x:'stars'},
  {id:'p_lagoon',name:'Lagoon Axolotl',sp:'axolotl',col:'#4AB8C8',col2:'#FFF3B8',rar:'rare',season:'evergreen',v2:1,x:'spots'},
  {id:'p_bosun',name:'Bosun the Bulldog',sp:'dog',col:'#E9D2B4',col2:'#FFFFFF',ear:'point',rar:'rare',season:'evergreen',v2:1,x:'bandana'},
  {id:'p_ruby',name:'Ruby the Macaw',sp:'bird',col:'#E0453B',col2:'#4A7EC2',rar:'rare',season:'evergreen',v2:1},
  {id:'p_lantern2',name:'Lantern Hedgehog',sp:'hedgehog',col:'#8A5A3A',col2:'#FFE07A',rar:'rare',season:'evergreen',v2:1,x:'lantern'},
  {id:'p_velvet',name:'Velvet Bunny',sp:'bunny',col:'#6F5BA8',col2:'#E8DFF7',rar:'rare',season:'evergreen',v2:1,x:'stars'},
  {id:'p_sapphire',name:'Sapphire Seahorse',sp:'seahorse',col:'#3E6FD0',col2:'#BFD6FF',rar:'rare',season:'evergreen',v2:1,x:'stars'},
  {id:'p_pearl',name:'Pearl Otter',sp:'otter',col:'#E9E4DA',col2:'#FFFFFF',rar:'rare',season:'evergreen',v2:1,x:'ghost'},
  {id:'p_tidecrab',name:'Tide-King Crab',sp:'crab',col:'#5B7FD0',col2:'#DCE6FF',rar:'rare',season:'evergreen',v2:1,x:'tricorn'},
  {id:'p_ember',name:'Ember Pup',sp:'dog',col:'#E05A3A',col2:'#FFD27A',ear:'flop',rar:'epic',season:'evergreen',v2:1,x:'embers'},
  {id:'p_moonbun',name:'Moon Rabbit',sp:'bunny',col:'#DCE3F2',col2:'#FFF3B8',rar:'epic',season:'evergreen',v2:1,x:'stars'},
  {id:'p_wyrmling',name:'Reef Wyrmling',sp:'dragon',col:'#45B07C',col2:'#F2C462',rar:'epic',season:'evergreen',v2:1,x:'petals'},
  {id:'p_glacier',name:'Glacier Narwhal',sp:'narwhal',col:'#BFE3F5',col2:'#FFFFFF',rar:'epic',season:'evergreen',v2:1,x:'frost'},
  {id:'p_phantomcat',name:'Phantom Cat',sp:'cat',col:'#9FE8D0',col2:'#FFFFFF',rar:'epic',season:'evergreen',v2:1,x:'ghost'},
  {id:'p_auroraturt',name:'Aurora Turtle',sp:'turtle',col:'#3E8F86',col2:'#B6FFE0',rar:'epic',season:'evergreen',v2:1,x:'aurora'},
  {id:'p_goldfin',name:'Goldfin Axolotl',sp:'axolotl',col:'#F2C462',col2:'#FFF3B8',rar:'epic',season:'evergreen',v2:1,x:'rainbow'},
  {id:'p_ironclad',name:'Ironclad Dragon',sp:'dragon',col:'#5A6370',col2:'#F27A3A',rar:'legendary',season:'evergreen',v2:1,x:'flame'},
  {id:'p_starfall',name:'Starfall Narwhal',sp:'narwhal',col:'#3B2F7A',col2:'#FFE07A',rar:'legendary',season:'evergreen',v2:1,x:'stars'},
  {id:'p_sunbird',name:'Sunbird Phoenix',sp:'bird',col:'#F2743A',col2:'#FFE07A',rar:'legendary',season:'evergreen',v2:1,x:'flame'},
  {id:'p_tempest',name:'Tempest Kraken',sp:'kraken',col:'#4A5A8C',col2:'#BFE3F5',rar:'legendary',season:'evergreen',v2:1,x:'storm'},
  {id:'p_treasurepup',name:'Treasure Hound',sp:'dog',col:'#F2C462',col2:'#FFF6CF',ear:'flop',rar:'legendary',season:'evergreen',v2:1,x:'tricorn'},
  {id:'p_prism',name:'Prism Dragon',sp:'dragon',col:'#9B5DE5',col2:'#FFFFFF',rar:'mythic',season:'evergreen',v2:1,x:'rainbow'},
  {id:'p_abyssal',name:'The Abyssal Leviathan',sp:'kraken',col:'#1F2A44',col2:'#9FE8D0',rar:'mythic',season:'evergreen',v2:1,x:'aurora'},
];
const PET_BY_ID=Object.fromEntries(PETS.map(p=>[p.id,p]));
function seasonOf(date){const m=+date.slice(5,7);return m===12||m<=2?'winter':m<=5?'spring':m<=8?'summer':'autumn';}
function seasonEnds(date){const y=+date.slice(0,4),m=+date.slice(5,7);const endM={winter:2,spring:5,summer:8,autumn:11}[seasonOf(date)];const yy=(m===12)?y+1:y;return new Date(Date.UTC(yy,endM,0)).toISOString().slice(0,10);}
function rollRarity(r){let x=r%100;for(const k of Object.keys(PET_RARITY)){if(x<PET_RARITY[k].p)return k;x-=PET_RARITY[k].p;}return 'common';}
function petFor(date,rar){const v2=date>='2026-11-14';const pool=PETS.filter(p=>p.rar===rar&&(v2||!p.v2)&&(p.season===seasonOf(date)||p.season==='evergreen'));return pool[h32(date+rar+'pet')%pool.length];}

/* ---------- More cosmetics: colour variants and two new categories ---------- */
const MORE_ITEMS=[];
[['red','Red','#D9485F'],['blue','Blue','#4A7EC2'],['green','Green','#3FA57E'],['purple','Purple','#8E5DD9'],['gold','Gold','#E2AE45'],['pink','Pink','#F08CB0']].forEach(([k,n,col],i)=>{
  MORE_ITEMS.push({id:'hat_bandana_'+k,name:n+' Bandana',cat:'hat',st:'bandana',col,price:120+i*40,lvl:2+i});
  MORE_ITEMS.push({id:'hat_beanie_'+k,name:n+' Beanie',cat:'hat',st:'beanie',col,price:180+i*50,lvl:3+i});
  MORE_ITEMS.push({id:'coat_'+k,name:n+' Deck Coat',cat:'coat',st:'trim',col,col2:'#F4EFE4',price:260+i*80,lvl:4+i*2});
  MORE_ITEMS.push({id:'sail_stripe_'+k,name:n+' Stripe Sails',cat:'sail',col:'#FFFCF2',col2:col,pat:'stripe',price:400+i*120,lvl:5+i*2});
  MORE_ITEMS.push({id:'hull_'+k+'2',name:n+' Lacquer Hull',cat:'hull',col,col2:shade(col),price:600+i*200,lvl:8+i*3});
  MORE_ITEMS.push({id:'flag_skull_'+k,name:n+' Jolly Roger',cat:'flag',col,sym:'skull',sc:'#FFFFFF',price:300+i*90,lvl:4+i*2});
});
[['hat_tricorn_red','Crimson Tricorn','#8E1F3A',2200,20],['hat_tricorn_white','Admiralty White Tricorn','#F4EFE4',3000,24],['hat_tricorn_gold','Golden Tricorn','#E2AE45',9000,44]].forEach(([id,name,col,price,lvl])=>MORE_ITEMS.push({id,name,cat:'hat',st:'tricorn',col,price,lvl}));
[['tr_bubbles','Bubble Wake','bubbles',350,4],['tr_sparkle','Sparkle Wake','sparkle',900,9],['tr_petals','Petal Wake','petals',1600,14],['tr_flame','Flame Wake','flame',3200,22],['tr_rainbow','Rainbow Wake','rainbow',6000,32],['tr_stars','Stardust Wake','stars',12000,48]].forEach(([id,name,st,price,lvl])=>MORE_ITEMS.push({id,name,cat:'trail',st,price,lvl}));
[['shot_fire','Fireballs','fire',500,5],['shot_snow','Snowballs','snow',700,7],['shot_heart','Love Letters','heart',1100,11],['shot_glitter','Glitter Bombs','glitter',2000,16],['shot_duck','Rubber Ducks','duck',3500,26],['shot_drop','Funnal Drops','drop',0,12,'track']].forEach(([id,name,st,price,lvl,tr])=>MORE_ITEMS.push(tr?{id,name,cat:'shot',st,track:lvl}:{id,name,cat:'shot',st,price,lvl}));
function shade(hex){const n=parseInt(hex.slice(1),16);const f=v=>Math.max(0,Math.round(v*.72));return '#'+[f(n>>16),f(n>>8&255),f(n&255)].map(v=>v.toString(16).padStart(2,'0')).join('');}
MORE_ITEMS.forEach(i=>{ITEMS.push(i);ALL_ITEMS[i.id]=i;if(i.track){i.price=0;i.lvl=i.track;TRACK.push(i);}});
TRACK.sort((a,b)=>a.track-b.track);
Object.assign(CAT_NAMES,{trail:'Wakes',shot:'Cannonballs'});
// re-order category tabs
const CAT_ORDER=['hat','face','coat','hull','sail','flag','figure','deck','trail','shot','decor','moth','effect'];

/* ---------- Voyage (Lock In) ---------- */
const VOYAGE_TIERS=[
 {id:'shallows',name:'The Shallows',m:15,blurb:'A quick sprint. Small, cheeky monsters.',mon:[
  ['grumbleflap','Sir Grumbleflap','seal','#9AA8B8',.45,'A grumpy seal blocking the harbour mouth'],['pinch','Captain Pinch','crab','#E8674A',.6,'A crab with a strong sense of personal space'],['inky','Inky Ingrid','octopus','#F29AC0',.8,'An octopus who squirts ink at outreach'],['drizzle','Little Drizzle','storm','#9FB3D9',1,'A small cloud with a big attitude']]},
 {id:'open',name:'Open Sea',m:25,blurb:'One focus block. Proper monsters.',mon:[
  ['sidney','Sidney the Serpent','serpent','#7FB59A',.5,'A sea serpent who just wants to chat'],['krabbington','King Krabbington','crab','#C2453A',.65,'Royal crab, very interested in tolls'],['squall','The Squall Sisters','storm','#7E8FB8',.85,'Two storm clouds who finish each other\'s thunder'],['sloop','The Rival Sloop','ship','#3F5160',1.05,'Another crew. Same leads. Fire first']]},
 {id:'deep',name:'Deep Water',m:45,blurb:'A long haul. Big, slow, stubborn monsters.',mon:[
  ['moby','Moby Dave','whale','#5E86B8',.55,'A whale who has seen things'],['octavia','Octavia of the Deep','octopus','#7A5BC8',.75,'Eight arms, zero patience'],['twinfin','The Twin-Fin Leviathan','serpent','#3E8F86',.95,'It is longer than the ship. Considerably'],['fundraiser','The Flying Fundraiser','ghost','#9FE8D0',1.1,'A ghost ship that only wants your budget']]},
 {id:'abyss',name:'The Abyss',m:60,blurb:'A full hour. Legendary monsters, legendary loot.',mon:[
  ['kraken','The Kraken','kraken','#9B5DE5',.65,'The Kraken itself rises'],['eye','Eye of the Hurricane','storm','#56608C',.85,'Calm in the middle. Rude everywhere else'],['locker','Davy Jones\'s Locker Room','ghost','#7FD9C0',1.05,'Haunted. Smells of wet socks'],['goldleviathan','The Golden Leviathan','whale','#F2C462',1.25,'Covered in gold. Rarely seen, never caught']]}];
const VOYAGE_DIFF=Object.assign({calm:{name:'Calm waters',rate:.5,xp:40,g:15,desc:'A grumpy seal blocks the route'},rough:{name:'Rough seas',rate:.8,xp:90,g:35,desc:'A sea serpent hunts your ship'},legend:{name:'Legendary',rate:1.15,xp:200,g:80,desc:'The Kraken itself rises'}},...VOYAGE_TIERS.flatMap((T,ti)=>T.mon.map(([id,name,type,col,rate,desc],k)=>({[id]:{id,name,type,col,rate,desc,tier:T.id,lvl:k+1,xp:Math.round(T.m*rate*3.2+ti*20),g:Math.round(T.m*rate*1.2+ti*8)}}))));
function voyageTier(min){let best=VOYAGE_TIERS[0];VOYAGE_TIERS.forEach(T=>{if(min>=T.m-5)best=T;});return best;}
const ENCOUNTERS=[
  {id:'whale',text:'A whale breaches off the starboard bow!'},{id:'dolphins',text:'A pod of dolphins races alongside.'},{id:'bottle',text:'A message in a bottle bobs past. Tap it!',tap:true},
  {id:'turtle',text:'An old sea turtle waves a flipper.'},{id:'flyingfish',text:'Flying fish skip over the waves.'},{id:'ghost',text:'A ghost ship drifts by in the mist... spooky.'},
  {id:'spout',text:'A waterspout twists on the horizon.'},{id:'rainbow',text:'A rainbow arcs over the sea.'},{id:'jelly',text:'Glowing jellyfish light up the water.'},
  {id:'chest',text:'A floating chest! Tap it before it sinks!',tap:true},{id:'stars',text:'A shower of shooting stars.'},{id:'mermaid',text:'Was that... a mermaid? She waved.'},
  {id:'barge',text:'Pell\'s barge toots its horn as it passes.'},{id:'gulls',text:'Gary and friends hitch a ride on the mast.'},
];

/* ---------- How to play ---------- */
const HELP=[
  ['The goal','Your crew (Sam and James together) aims for 100 Instagram DMs every working day. Each DM you log fires a cannonball at today\'s sea foe, which has 100 HP. Sink it and you both get a reward.'],
  ['The five buttons','DM sent: tap once after each personalised DM (5-second reload). Response, Video, Meeting, Client: tap when it really happens. Meetings and clients ask for the prospect\'s name, need a press-and-hold, and only pay out once the other captain confirms them on the Harbour screen.'],
  ['XP, levels and doubloons','Everything you log earns XP and doubloons. XP raises your level (1 to 100) and rank. Every level pays doubloons and many unlock free cosmetics: see the Captain\'s Log. Spend doubloons in the Shop or on Funnal Cove building projects.'],
  ['Emissary flag','Each of you has your own emissary flag, flying above your own ship. It grows with your own DMs today, not the crew total: Grade I at 0 (×1), II at 10 (×1.2), III at 22 (×1.4), IV at 35 (×1.7) and V at 50 (×2). The multiplier boosts the XP and doubloons from your DMs, including DMs on Lock In voyages and fishing trips. Each grade has its own flag animation. Your flag resets every morning.'],
  ['Golden Tide','Once every working day there\'s a 25-minute Golden Tide at a surprise time between 09:30 and 16:40. Everything logged during it scores double. Stack it with Grade V for 4x DMs.'],
  ['Pet sightings','Once a working day, between 07:00 and 19:00, a limited-time pet is spotted. Log the shown number of DMs before the window closes, then claim it. Rarer pets give shorter windows and need more DMs. Pets rotate with the seasons, so some only appear a few months a year.'],
  ['Lock In voyages','Pick a time, choose a sea monster to fight and set sail. Every DM fires at the monster and pushes your ship on. Strange things appear at sea: tap bottles and chests for loot. When the timer ends you reach Treasure Island and open a chest worth more the more DMs you sent. Full screen mode leaves just the ship and the DM button (space bar works too).'],
  ['Challenges','From Lock In, challenge the other captain: Showdown, Rivalry, Treasure Race, or co-op Century Sprint, Last Push, Boss Rush and Kraken Raid. The other captain has to accept.'],
  ['Forfeits','If you log zero DMs on a working day, or the crew misses the target, you owe a forfeit. Spin the wheel in the Herald. Forfeits are silly and temporary. Days off you add in Settings never count.'],
  ['Your hideout','Switch from Ship to Hideout to see your pirate cove. It upgrades itself as you level up: a dock at level 5, a lookout tower at 10, a torch-lit skull cave at 20, a rope bridge and hammock at 30, a cannon battery at 40 and a crown for the skull at 50. The treasure pile grows with your doubloons, the tent is stitched from your sails, and the tower flies your flag. Tap anything for details.'],
  ['Feats and gold gear','Some cosmetics cannot be bought. The Golden Funnal Banner is earned by sinking 10 daily sea foes with the crew, the Gilded Funnal Sails at 2,500 lifetime DMs, and the Obsidian & Gold Hull by landing the final blow on 15 foes. They show in the Shop with a gold Feat ribbon and your progress.'],
  ['Full screen and sea sounds','Every harbour, ship, hideout and voyage view has a full screen button in its corner. In full screen you get the scene, a DM sent button (space bar works too) and a soundscape of sea, wind, gulls and creaking timber. The wave button turns the soundscape off; the speaker button mutes everything.'],
  ['Monster hunts','On a Lock In hunt, monsters come in waves. Every DM fires a cannonball, and about 1 in 8 is a critical hit for 3 damage. Sink a monster and the next one arrives, a little tougher, and every 4th wave is a golden Elite worth double. Each kill pays XP and doubloons when you land and drops a part (common, rare or a legendary trophy) for your Bestiary in the More tab. Collecting parts unlocks hunter gear.'],
  ['Meetings and clients','Meetings and clients are the real treasure. A meeting pays 150 doubloons and 400 XP, and a client pays 1,000 doubloons and 2,000 XP, plus a share for your crewmate (40 for a meeting, 250 for a client). Each one triggers a full-screen celebration for you both, and every client gets a gold plaque in the Client Hall of Fame and in both hideouts.'],
  ['Crew goals','You share a target, so some rewards need you both. Crew week: sink the daily sea foe on 5 days in a week for +400 doubloons and 300 XP each. Friday Kraken: every Friday, if you both log 30 or more DMs, you each get +200 doubloons and 150 XP. Grand ventures are giant projects built from your combined lifetime DMs (2,500 up to 100,000). Each one adds a monument to the harbour and pays you both.'],
  ['Reviews','The Weekly review in the More tab compares this week with last: DMs, replies, meetings and clients for each captain, your busiest hours, fishing and monster hunts. The game also shows an end-of-day card after 17:30 and an end-of-week card on Friday evening, ready to screenshot.'],
  ['Fishing trips','In Lock In, switch from Monster hunt to Fishing trip. Every DM is a cast and about 7 in 10 land a fish. Every trip drops anchor at a random spot (The Shallows, Open Sea, Deep Water or The Abyss) in random waters, whatever the length. Every fish can bite on any trip, transcendent ones included. Deeper spots nudge the odds on rare fish a little, and a few fish only bite before 09:00 or after 17:00. Every catch has its own size, so each species has a record holder: a gold crown in the Trophy case (More tab) means you hold it. About 1 catch in 30 is a Golden, Albino or Rainbow variant, which counts as its own trophy. Bait is optional and used up by one trip: Glow Worms double the odds of rare-or-better fish, Squid Chunk makes fish about 20% bigger, and the Golden Lure triples variant odds. The Fish of the day is 6 times more likely, and the first captain to land the week\'s Big One wins 500 doubloons. The ten transcendent fish each turn up roughly once in 2,000 to 5,000 casts.'],
  ['Rigging your ship','Besides shop items and level rewards, some hulls, sails, figureheads, flags and deck pieces are earned. Fish gear unlocks from your Trophy case (species caught, fish landed, Whoppers, variants). Boss trophies unlock by sinking a particular daily sea foe or voyage monster several times. Veteran pieces unlock with time: days played, weeks sailed or a long streak. The grandest ships simply cost a fortune. Every locked item in the Shop shows what it needs and how far along you are.'],
  ['Honesty','All counts are self-reported. Caps, reload timers and crew confirmation stop accidental spam, but the game works because you both log honestly.'],
];

[['pet1','New Best Friend','Claim your first pet','uncommon','Pets',['pets',1]],['pet5','Menagerie','Collect 5 different pets','rare','Pets',['pets',5]],['pet15','Noah\'s Galleon','Collect 15 different pets','legendary','Pets',['pets',15]],['pet30','Every Creature Under the Sea','Collect 30 different pets','transcendent','Pets',['pets',30]],
 ['petleg','Here Be Dragons','Claim a legendary or mythic pet','epic','Pets',['petLegend',1]],['petmyth','One in a Hundred','Claim a mythic pet','mythic','Pets',['petMythic',1]],
 ['em5','Grade Five Emissary','Fire a DM while flying your own Grade V emissary flag (50+ DMs in a day)','epic','Team',['em5',1]],
 ['gold1','Golden Hour Hero','Send 25 DMs during Golden Tides','uncommon','Daily',['goldenDms',25]],['gold2','Midas Touch','Send 500 DMs during Golden Tides','legendary','Daily',['goldenDms',500]],
 ['isle1','X Marks the Spot','Reach Treasure Island at the end of a voyage','common','Focus',['islands',1]],['isle50','Island Hopper','Reach Treasure Island 50 times','epic','Focus',['islands',50]],
 ['vb1','Monster Hunter','Defeat a voyage monster','uncommon','Focus',['vBoss',1]],['vb25','Kraken Wrangler','Defeat 25 voyage monsters','legendary','Focus',['vBoss',25]],
].forEach(([id,name,desc,rar,cat,[metric,target]])=>{const a={id,name,desc,rar,cat,metric,target};ACHIEVEMENTS.push(a);ACH_BY_ID[id]=a;});
