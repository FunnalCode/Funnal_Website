"use strict";
/* ============================== GAME DATA (pirate edition) ============================== */
const KINDS = {
  d:{name:'DM sent',          xp:10,   g:2,   short:'DM'},
  r:{name:'Response',         xp:45,   g:10,  short:'Response', desc:'Any real human reply to a DM, good or bad. Auto-replies do not count. Pays both captains the same.'},
  v:{name:'Video sent',       xp:120,  g:30,  short:'Video',    desc:'A personalised video sent to a prospect. Pays both captains the same.'},
  m:{name:'Meeting set',      xp:300,  g:75,  short:'Meeting',  desc:'A meeting booked or held with a prospect. Pays both captains the same.'},
  c:{name:'Client won',       xp:1500, g:400, short:'Client',   desc:'A new paying client. Pays both captains the same.'},
  f:{name:'Follow-up',        xp:5,    g:1,   short:'Follow-up',desc:'A quick follow-up to someone you already DMed. Half a DM\'s XP and doubloons. Does not count towards targets, foes, voyages or quests. Pays only you.'},
};
// videos, meetings and clients are crew wins: whoever logs them, both captains are paid the same
const SHARED_K={r:1,v:1,m:1,c:1};
const RARITIES = ['common','uncommon','rare','epic','legendary','mythic','transcendent'];
const RARITY_GLOW = {common:10,uncommon:25,rare:60,epic:150,legendary:400,mythic:1000,transcendent:3000};
const TIERS = ['Bronze','Silver','Gold','Platinum','Diamond','Master'];

const DEFAULT_FORFEITS = [
  {id:'chicken', text:'Your captain becomes a giant chicken for a day', kind:'virtual'},
  {id:'title', text:'Your rank becomes "Ship\'s Napper" for a day', kind:'virtual'},
  {id:'statue', text:'A statue of your rival is erected in your hideout', kind:'virtual'},
  {id:'gnomes', text:'Barnacle gnomes take over your hideout', kind:'virtual'},
  {id:'gull', text:'Gary the seagull follows you everywhere, judging', kind:'virtual'},
  {id:'wall', text:'Your WANTED poster goes up in the tavern', kind:'virtual'},
  {id:'headline', text:'The Salty Herald runs a dramatic front page about you', kind:'virtual'},
  {id:'dance', text:'Your captain must perform a sea shanty jig all day', kind:'virtual'},
  {id:'coffee', text:'You owe the other captain a coffee', kind:'real'},
  {id:'biscuits', text:'You bring biscuits to the next meeting', kind:'real'},
  {id:'playlist', text:'The other captain picks the office playlist for an hour', kind:'real'},
];
const DEFAULT_CONFIG = {
  target:100, cooldownSec:5, workdays:[1,2,3,4,5,6,0], dayStart:'09:00', dayEnd:'17:30', finalWarning:'16:30',
  absenceScale:0.5, holidays:[], absences:{}, startDate:'', forfeits:DEFAULT_FORFEITS.map(f=>({...f})),
  playerIds:['sam','james'], players:{sam:{name:'Sam'},james:{name:'James'}}, undoMinutes:15,
  caps:{r:60,v:20,m:8,c:4}, cooldowns:{r:3,v:20,m:60,c:300}, requireConfirm:true,
};

/* ---------- Daily sea foes (ids are stored history: never rename them) ---------- */
// type: storm | serpent | ship | octopus | crab | kraken | whale
const BOSSES = [
  {id:'grumble', name:'Grumblesquall', type:'storm', col:'#A9B6D3', eye:'#3F3A30', lines:{start:"Hrmph. Another hundred cannonballs? I'll just rain on you.",p75:'Oi! That one went straight through my left cloud.',p50:"Half a squall? I'm telling the sea.",p25:"I'm... drizzling. That's not even a storm.",dead:'Fine. FINE. Clear skies. Happy now?'}},
  {id:'drizzle', name:'Lady Drizzle', type:'storm', col:'#9CC7E2', eye:'#3F3A30', lines:{start:"Darling, I'm only a little shower. Must you?",p75:'Cannonballs? How terribly keen.',p50:'You realise this is rather rude?',p25:'My mascara is running. Stop it.',dead:'I shall drizzle on another fleet. Ta-ta.'}},
  {id:'seenzone', name:'The Marrow Serpent', type:'serpent', col:'#7FB59A', eye:'#3F3A30', lines:{start:'Ssslither closer, little ssship.',p75:'You ssscratched my ssscales!',p50:'Ssstop that at once.',p25:"I've ssshed my lassst ssskin for you people.",dead:'Sssunk... by a sssloop...'}},
  {id:'algo', name:'Admiral Blackbarnacle', type:'ship', col:'#7C86A6', eye:'#3F3A30', lines:{start:'SURRENDER YOUR VESSEL TO THE ROYAL NAVY OF THE DEEP.',p75:'A HIT? ON MY FLAGSHIP?',p50:'MAN THE PUMPS. ALL OF THEM.',p25:'I SHALL WRITE A STRONGLY WORDED LOGBOOK ENTRY.',dead:'ABANDON SHIP... ADMIRALS FIRST...'}},
  {id:'ghostwell', name:'Captain Ghostwell', type:'ship', col:'#B9D3CF', eye:'#3F3A30', ghost:true, lines:{start:'Arr. Dead two hundred years and still a better sailor than ye.',p75:'Ye shot straight through me. Rude, but it tickled.',p50:'Me timbers are... less ghostly.',p25:"Blast ye, I'm going solid!",dead:'Tell me crew... I was never here. Classic me.'}},
  {id:'mondaymist', name:"The Widow's Fog", type:'storm', col:'#B7B9C9', eye:'#3F3A30', lines:{start:'Shhh. Sail into me. Nobody ever sails out.',p75:'Cannon fire? In MY fog?',p50:"I'm thinning... I'm thinning!",p25:'I can see the sun. I hate the sun.',dead:'I will roll back in. I always do.'}},
  {id:'outofoffice', name:'Old Eightfold', type:'octopus', col:'#E89AB4', eye:'#3F3A30', lines:{start:'Eight arms. Eight grudges. One ship.',p75:"You've hit arm number three. He was my favourite.",p50:'Seven arms is still plenty, captain.',p25:'Back to my cave... I need a cuddle... from myself...',dead:'Ink... everywhere... goodbye...'}},
  {id:'budgetbeast', name:'Old Crusty, the Barnacle Crab', type:'crab', col:'#E8866A', eye:'#3F3A30', lines:{start:'Snip snip. Your hull looks crunchy.',p75:"Oi! That's my good claw!",p50:"Fine, I'll use the other claw.",p25:'My shell is cracking... like my confidence...',dead:'Fine. Off I go. Sideways.'}},
];
const RARE_BOSSES = [
  {id:'aurora', name:'Aurelia, the Golden Whale', type:'whale', col:'#F2C462', eye:'#3F3A30', rare:true, lines:{start:'A rare sight, captain. Catch me and the sea remembers.',p75:'Oh, you noticed me. How sweet.',p50:'Shimmering... flickering...',p25:'Make it beautiful at least.',dead:'Gloriously outsailed. Have a trophy.'}},
  {id:'kraken', name:'The Kraken', type:'kraken', col:'#B57FD9', eye:'#3F3A30', rare:true, lines:{start:'EIGHT ARMS. EIGHT HUNDRED YEARS. ONE VERY SMALL BOAT.',p75:'Was that a cannon? How DARE you.',p50:'My tentacles are bruising!',p25:'Back... to the deep... soon...',dead:'Sunk. For now.'}},
];
const WEEKLY_BOSSES = [
  {id:'leviathan', name:'The Abyssal Leviathan'},{id:'stormcloud', name:'The Black Gale'},
  {id:'tidequeen', name:'The Ebb Queen\'s Armada'},{id:'hollow', name:'The Hollow Galleon'},
];
const DAILY_MODS = [
  {id:'echo', name:'Echo Tide', desc:'Responses give double doubloons today.'},
  {id:'golden', name:'Golden Hour', desc:'DMs logged between 14:00 and 15:00 give double XP.'},
  {id:'lucky', name:'Lucky Currents', desc:'Treasure from DMs is twice as likely today.'},
  {id:'early', name:'Dawn Raid', desc:'DMs before 10:00 give +50% XP.'},
  {id:'calm', name:'Calm Seas', desc:'Finishing a voyage (Lock In) gives +60 bonus XP today.'},
  {id:'none', name:'Fair Winds', desc:'No twist today. Just you, the inbox and the sea.'},
];

/* ---------- Treasure: 6 sets of 5, found as loot ---------- */
const COLLECT_SETS = [
  {id:'shells', name:'Tidepool Shells', items:[['cockle','Cockle Shell','common'],['whelk','Whelk Spiral','common'],['scallop','Fan Scallop','uncommon'],['conch','Rose Conch','rare'],['nautilus','Pearl Nautilus','epic']]},
  {id:'bottles', name:'Messages in Bottles', items:[['b1','"Dear Sir/Madam" Bottle','common'],['b2','Typo-ridden Bottle','common'],['b3','Bottle With a Discount Code','uncommon'],['b4','Bottle That Says "Yes!"','rare'],['b5','Bottle From the Future','legendary']]},
  {id:'lanterns', name:"Ship's Lanterns", items:[['l1','Tin Lantern','common'],['l2','Paper Lantern','uncommon'],['l3','Brass Deck Lantern','uncommon'],['l4','Lighthouse Lens Shard','rare'],['l5','The First Lantern','legendary']]},
  {id:'charts', name:'Treasure Maps', items:[['c1','Map of the Shallows','common'],['c2','Map of Marrow Strait','uncommon'],['c3','Map of Replyhaven','rare'],['c4','Map of the Meeting Isles','epic'],['c5','Map of Client Cove','legendary']]},
  {id:'feathers', name:'Parrot Feathers', items:[['f1','Grey Feather','common'],['f2','Speckled Feather','common'],['f3','Gary\'s Feather','uncommon'],['f4','Golden Feather','epic'],['f5','Feather of the Moon Parrot','mythic']]},
  {id:'stars', name:'Cursed Doubloons', items:[['s1','Tarnished Doubloon','uncommon'],['s2','Silver Piece of Eight','rare'],['s3','Pirate King\'s Coin','epic'],['s4','Twin-Faced Coin','legendary'],['s5','The Hundredth Doubloon','mythic']]},
];
const COLLECTIBLES = []; COLLECT_SETS.forEach(s=>s.items.forEach(([id,name,rar])=>COLLECTIBLES.push({id,name,rar,set:s.id})));

/* ---------- Cosmetics ----------
   cat: hat | face | coat | hull | sail | flag | figure | deck | decor | moth (parrot gear) | effect | shield
   track:L = free reward at level L. lvl = shop unlock level. prestige:n = needs n prestiges. Old ids kept for saved purchases. */
const SHIP_DEFAULT={hull:'hull_oak',sail:'sail_canvas',flag:'flag_skull'};
const ITEMS = [
  // Hats
  {id:'hat_bandana', name:'Red Bandana', cat:'hat', st:'bandana', col:'#D9485F', track:2},
  {id:'hat_cap', name:"Deckhand's Cap", cat:'hat', st:'cap', col:'#4A7EC2', price:80, lvl:1},
  {id:'hat_beanie', name:"Sailor's Beanie", cat:'hat', st:'beanie', col:'#E06034', price:150, lvl:3},
  {id:'hat_straw', name:'Straw Sun Hat', cat:'hat', st:'straw', col:'#E8C36A', price:300, lvl:5},
  {id:'hat_skull', name:'Skull Bandana', cat:'hat', st:'bandana', col:'#3F3A40', price:450, lvl:7},
  {id:'hat_tricorn', name:"Captain's Tricorn", cat:'hat', st:'tricorn', col:'#3F3A40', price:700, lvl:9},
  {id:'hat_feather', name:'Plumed Captain\'s Hat', cat:'hat', st:'feather', col:'#5A3E8C', track:15},
  {id:'hat_teal', name:'Sea-glass Tricorn', cat:'hat', st:'tricorn', col:'#3FA59A', price:1600, lvl:18},
  {id:'hat_crown', name:'Driftwood Crown', cat:'hat', st:'crown', col:'#DDA94D', price:4000, lvl:25},
  {id:'hat_bicorne', name:"Admiral's Bicorne", cat:'hat', st:'bicorne', col:'#2E3A5C', track:30},
  {id:'hat_kraken', name:'Kraken Helm', cat:'hat', st:'kraken', col:'#9B5DE5', track:50},
  {id:'hat_halo', name:'Lantern Halo', cat:'hat', st:'halo', col:'#FFE58A', price:12000, lvl:40, dist:1},
  // Faces
  {id:'face_patch', name:'Eyepatch', cat:'face', st:'patch', col:'#3F3A40', track:3},
  {id:'face_stubble', name:'Sea-salt Stubble', cat:'face', st:'stubble', col:'#7A5A3A', price:120, lvl:2},
  {id:'face_beard', name:'Proper Pirate Beard', cat:'face', st:'beard', col:'#6B4429', price:500, lvl:8},
  {id:'face_ginger', name:'Ginger Bushbeard', cat:'face', st:'beard', col:'#D9733A', price:900, lvl:12},
  {id:'face_moust', name:'Twirled Moustache', cat:'face', st:'moustache', col:'#4A3324', price:650, lvl:10},
  {id:'face_monocle', name:'Gold Monocle', cat:'face', st:'monocle', col:'#DDA94D', price:2200, lvl:22},
  {id:'face_earring', name:'Golden Hoop', cat:'face', st:'earring', col:'#DDA94D', price:350, lvl:4},
  // Coats
  {id:'coat_stripe', name:'Striped Sailor Shirt', cat:'coat', st:'stripe', col:'#FFFFFF', col2:'#4A7EC2', price:100, lvl:1},
  {id:'coat_yellow', name:'Yellow Oilskin', cat:'coat', st:'plain', col:'#F2C230', price:160, lvl:2},
  {id:'coat_vest', name:'Leather Vest', cat:'coat', st:'vest', col:'#8A5A3A', col2:'#F4EFE4', price:350, lvl:5},
  {id:'coat_navy', name:'Navy Peacoat', cat:'coat', st:'trim', col:'#2E3A5C', col2:'#DDA94D', price:600, lvl:7},
  {id:'coat_red', name:"Captain's Red Coat", cat:'coat', st:'trim', col:'#C91E36', col2:'#DDA94D', price:1100, lvl:12},
  {id:'coat_green', name:'Bosun\'s Bottle-green', cat:'coat', st:'trim', col:'#2F7A5C', col2:'#F4EFE4', price:1500, lvl:16},
  {id:'coat_admiral', name:"Admiral's Coat", cat:'coat', st:'trim', col:'#1F2A4A', col2:'#F2C462', track:40},
  {id:'coat_star', name:'Starweave Cloak', cat:'coat', st:'cloak', col:'#5A4AA8', col2:'#FFFFFF', price:7000, lvl:35},
  {id:'coat_king', name:'Pirate King\'s Robe', cat:'coat', st:'cloak', col:'#8E1F3A', col2:'#F2C462', track:75},
  {id:'coat_ghost', name:'Ghost-captain Coat', cat:'coat', st:'cloak', col:'#B9D3CF', col2:'#FFFFFF', price:20000, lvl:50, dist:3},
  // Hulls
  {id:'hull_oak', name:'Honest Oak', cat:'hull', col:'#A8704A', col2:'#7A4E30', price:0, lvl:1, free:true},
  {id:'hull_cherry', name:'Cherry Lacquer', cat:'hull', col:'#C9454F', col2:'#8E2C36', price:400, lvl:4},
  {id:'hull_navy', name:'Midnight Navy', cat:'hull', col:'#34466E', col2:'#22304F', price:700, lvl:7},
  {id:'hull_mint', name:'Sea-foam Mint', cat:'hull', col:'#6CC7A8', col2:'#3E9C7E', price:900, lvl:10},
  {id:'hull_sunset', name:'Sunset Orange', cat:'hull', col:'#E8763E', col2:'#B9532A', price:1300, lvl:14},
  {id:'hull_black', name:'Black Pearl', cat:'hull', col:'#2E2B33', col2:'#17151B', track:20},
  {id:'hull_royal', name:'Royal Plum', cat:'hull', col:'#7A4AA8', col2:'#54307A', price:3500, lvl:28},
  {id:'hull_coral', name:'Coral Reef', cat:'hull', col:'#F08C9C', col2:'#C95E70', price:5000, lvl:33},
  {id:'hull_ghost', name:'Ghost Ship Pale', cat:'hull', col:'#CFE5E1', col2:'#9DBDB8', track:60},
  {id:'hull_gold', name:'Legend of the Seven Seas', cat:'hull', col:'#E8BC52', col2:'#B88A2A', track:100},
  // Sails
  {id:'sail_canvas', name:'Canvas', cat:'sail', col:'#FFFCF2', col2:'#EDE3CC', pat:'plain', price:0, lvl:1, free:true},
  {id:'sail_redstripe', name:'Candy Stripe', cat:'sail', col:'#FFFCF2', col2:'#D9485F', pat:'stripe', price:300, lvl:3},
  {id:'sail_bluestripe', name:'Harbour Blue Stripe', cat:'sail', col:'#FFFCF2', col2:'#4A7EC2', pat:'stripe', price:300, lvl:4},
  {id:'sail_patch', name:'Patchwork', cat:'sail', col:'#F4E6C8', col2:'#C79A6A', pat:'patch', price:600, lvl:6},
  {id:'sail_funnal', name:'Funnal Colours', cat:'sail', col:'#E06034', col2:'#FFFFFF', pat:'mark', track:10},
  {id:'sail_black', name:'Midnight Black', cat:'sail', col:'#2E2B33', col2:'#FFFFFF', pat:'skull', price:1800, lvl:16},
  {id:'sail_sunset', name:'Sunset Fade', cat:'sail', col:'#F7B26A', col2:'#E0457B', pat:'grad', price:2600, lvl:22},
  {id:'sail_stars', name:'Starry Night', cat:'sail', col:'#34437A', col2:'#FFF3B8', pat:'stars', track:35},
  {id:'sail_rainbow', name:'Rainbow Run', cat:'sail', col:'#FFFFFF', col2:'#FFFFFF', pat:'rainbow', track:70},
  {id:'sail_gold', name:'Cloth of Gold', cat:'sail', col:'#F2CF7A', col2:'#DDA94D', pat:'grad', price:30000, lvl:60, dist:2},
  // Flags
  {id:'flag_skull', name:'Classic Jolly Roger', cat:'flag', col:'#2E2B33', sym:'skull', sc:'#FFFFFF', price:0, lvl:1, free:true},
  {id:'flag_gold_mark', name:'Golden Funnal Banner', cat:'flag', col:'#17181D', sym:'mark', sc:'#F2C462', gold:true, desc:'Black silk, gold thread. Sink 10 sea foes together.', earn:['teamWins',10,'Sink 10 daily sea foes with the crew','foes sunk']},
  {id:'sail_gold_mark', name:'Gilded Funnal Sails', cat:'sail', col:'#1D1F26', col2:'#F2C462', pat:'mark', desc:'Black canvas, gold mark. Earned at 2,500 DMs.', earn:['d',2500,'Send 2,500 lifetime DMs','DMs']},
  {id:'hull_obsidian', name:'Obsidian & Gold Hull', cat:'hull', col:'#2A2C36', col2:'#16171C', gold:true, desc:'Earned with 15 final blows.', earn:['finalBlows',15,'Land the final blow on 15 sea foes','final blows']},
  {id:'flag_mark', name:'Funnal Banner', cat:'flag', col:'#E06034', sym:'mark', sc:'#FFFFFF', track:5},
  {id:'flag_swords', name:'Crossed Cutlasses', cat:'flag', col:'#2E2B33', sym:'swords', sc:'#F4EFE4', price:250, lvl:3},
  {id:'flag_anchor', name:'Anchor Ensign', cat:'flag', col:'#34466E', sym:'anchor', sc:'#FFFFFF', price:350, lvl:5},
  {id:'flag_heart', name:'Heart-and-Bones', cat:'flag', col:'#D9485F', sym:'heart', sc:'#FFFFFF', price:500, lvl:7},
  {id:'flag_parrot', name:'Parrot Pennant', cat:'flag', col:'#3FA57E', sym:'parrot', sc:'#FFE58A', price:800, lvl:11},
  {id:'flag_star', name:'North Star', cat:'flag', col:'#2E3A5C', sym:'star', sc:'#F2C462', price:1200, lvl:15},
  {id:'flag_cupcake', name:'The Cupcake Flag', cat:'flag', col:'#F4A6C0', sym:'cupcake', sc:'#FFFFFF', price:1500, lvl:19},
  {id:'flag_kraken', name:'Kraken Standard', cat:'flag', col:'#5A3E8C', sym:'kraken', sc:'#E8C7FF', price:4000, lvl:30},
  {id:'flag_crown', name:'Royal Standard', cat:'flag', col:'#8E1F3A', sym:'crown', sc:'#F2C462', price:8000, lvl:42},
  {id:'flag_diamond', name:'Diamond Colours', cat:'flag', col:'#1F2A4A', sym:'diamond', sc:'#9FE3F5', track:85},
  // Figureheads
  {id:'m_figure', name:'Mermaid Figurehead', cat:'figure', st:'mermaid', price:3500, merchantOnly:true},
  {id:'fig_gull', name:'Seagull Figurehead', cat:'figure', st:'gull', price:600, lvl:6},
  {id:'fig_dragon', name:'Sea Dragon', cat:'figure', st:'dragon', price:2400, lvl:20},
  {id:'fig_lion', name:'Golden Lion', cat:'figure', st:'lion', track:25},
  {id:'fig_kraken', name:'Kraken Prow', cat:'figure', st:'kraken', price:6500, lvl:38},
  {id:'fig_owl', name:'Gilded Owl', cat:'figure', st:'owl', track:65},
  // Deck (3 slots)
  {id:'dk_barrels', name:'Barrels of Grog', cat:'deck', st:'barrels', price:150, lvl:2},
  {id:'dk_cannon', name:'Brass Cannon', cat:'deck', st:'cannon', price:400, lvl:4},
  {id:'dk_lanterns', name:'String of Lanterns', cat:'deck', st:'lanterns', price:500, lvl:6},
  {id:'dk_chest', name:'Treasure on Deck', cat:'deck', st:'chest', price:900, lvl:9},
  {id:'dk_bunting', name:'Bunting', cat:'deck', st:'bunting', price:700, lvl:8},
  {id:'dk_plants', name:'Potted Palms', cat:'deck', st:'plants', price:1000, lvl:13},
  {id:'dk_wheel', name:'Golden Ship\'s Wheel', cat:'deck', st:'wheel', track:90},
  // Hideout decor (6 spots)
  {id:'flowers', name:'Hibiscus Bed', cat:'decor', price:60, lvl:1},
  {id:'bench', name:'Driftwood Bench', cat:'decor', price:90, lvl:1},
  {id:'post', name:'Lantern Post', cat:'decor', price:140, lvl:2},
  {id:'crates', name:'Stack of Crates', cat:'decor', price:120, lvl:2},
  {id:'pine', name:'Palm Tree', cat:'decor', price:200, lvl:3},
  {id:'sandcastle', name:'Sandcastle Fort', cat:'decor', price:180, lvl:3},
  {id:'mailbox', name:'Bottle Post', cat:'decor', price:260, lvl:4},
  {id:'hammock', name:'Hammock', cat:'decor', price:380, lvl:5},
  {id:'campfire', name:'Beach Campfire', cat:'decor', price:420, lvl:6},
  {id:'telescope', name:'Brass Telescope', cat:'decor', price:450, lvl:6},
  {id:'umbrella', name:'Beach Umbrella', cat:'decor', price:500, lvl:7},
  {id:'rowboat', name:'Little Rowboat', cat:'decor', price:600, lvl:8},
  {id:'tiki', name:'Tiki Torches', cat:'decor', price:700, lvl:9},
  {id:'cat', name:'Ship\'s Cat (Biscuit)', cat:'decor', price:800, lvl:10},
  {id:'xmark', name:'X Marks the Spot', cat:'decor', price:900, lvl:11},
  {id:'well', name:'Wishing Well', cat:'decor', price:1200, lvl:12},
  {id:'cannonfort', name:'Shore Cannon', cat:'decor', price:1400, lvl:14},
  {id:'windmill', name:'Tiny Windmill', cat:'decor', price:1800, lvl:15},
  {id:'maptable', name:'Captain\'s Map Table', cat:'decor', price:2000, lvl:17},
  {id:'trophy', name:'Trophy Cabinet', cat:'decor', price:2500, lvl:18},
  {id:'fountain', name:'Lantern Fountain', cat:'decor', price:3200, lvl:20},
  {id:'skullrock', name:'Skull Rock', cat:'decor', price:4200, lvl:26},
  {id:'crystal', name:'Tide Crystal', cat:'decor', price:6000, lvl:30},
  {id:'wreck', name:'Shipwreck', cat:'decor', price:9000, lvl:40},
  {id:'goldpile', name:'Mountain of Gold', cat:'decor', price:18000, lvl:55},
  // Parrot gear
  {id:'moth_bow', name:'Parrot Bowtie', cat:'moth', price:200, lvl:4},
  {id:'moth_scarf', name:'Parrot Scarf', cat:'moth', price:500, lvl:9},
  {id:'moth_hat', name:'Tiny Tricorn', cat:'moth', price:900, lvl:12},
  {id:'moth_patch', name:'Tiny Eyepatch', cat:'moth', price:700, lvl:11},
  {id:'moth_monocle', name:'Parrot Monocle', cat:'moth', price:1500, lvl:16},
  {id:'moth_chain', name:'Gold Chain', cat:'moth', track:45},
  // Effects
  {id:'fx_fireflies', name:'Firefly Swarm', cat:'effect', price:400, lvl:5},
  {id:'fx_dolphins', name:'Dolphin Escort', cat:'effect', price:1200, lvl:12},
  {id:'fx_snow', name:'Gentle Snowfall', cat:'effect', price:900, lvl:10},
  {id:'fx_shooting', name:'Shooting Stars', cat:'effect', price:2200, lvl:18},
  {id:'fx_rainbow', name:'Rainbow Sky', cat:'effect', price:3000, lvl:24},
  {id:'fx_biolum', name:'Glowing Waves', cat:'effect', track:55},
  {id:'fx_whale', name:'Whale Friend', cat:'effect', track:80},
  {id:'fx_aurora', name:'Aurora Sky', cat:'effect', price:15000, lvl:45},
  {id:'fx_fireworks', name:'Victory Fireworks', cat:'effect', track:95},
  // 21 Nov: Gilded Trim is a hull now (it trims the hull in gold), not a sky and sea effect
  {id:'goldlh', name:'Gilded Trim', cat:'hull', col:'#22304F', col2:'#F2C462', gold:true, price:25000, lvl:50, dist:1, desc:'Midnight blue with gold trim along the whole hull.'},
];
const MERCHANT_ITEMS = [
  {id:'m_jelly', name:'Jellyfish Lamp', cat:'decor', price:1100},
  {id:'m_anchor', name:'Ancient Anchor', cat:'decor', price:1600},
  {id:'m_bonsai', name:'Coral Bonsai', cat:'decor', price:2400},
  {id:'m_orrery', name:'Clockwork Orrery', cat:'decor', price:9000},
  {id:'m_dragon', name:'Kite Dragon', cat:'decor', price:20000},
  {id:'m_hat_lantern', name:'Lantern Hat', cat:'hat', st:'lantern', col:'#DDA94D', price:2800},
  {id:'m_coat_pearl', name:'Pearl Coat', cat:'coat', st:'trim', col:'#EEE8F4', col2:'#B9A8D9', price:5200},
  {id:'m_moth_crown', name:'Parrot Crown', cat:'moth', price:4200},
  {id:'m_fx_bubbles', name:'Bubble Drift', cat:'effect', price:3000},
  {id:'m_figure', name:'Mermaid Figurehead', cat:'figure', st:'mermaid', price:3500},
  {id:'m_hull_pearl', name:'Mother-of-Pearl Hull', cat:'hull', col:'#E9E2F2', col2:'#B9A8D9', price:6000},
  {id:'m_sail_tiger', name:'Tiger Sails', cat:'sail', col:'#F2A33A', col2:'#3F3A30', pat:'stripe', price:4500},
];
const ALL_ITEMS = Object.fromEntries([...ITEMS.filter(i=>!i.merchantOnly),...MERCHANT_ITEMS].map(i=>[i.id,i]));
ITEMS.forEach(i=>{if(i.track){i.price=0;i.lvl=i.track;}});
const TRACK = ITEMS.filter(i=>i.track).sort((a,b)=>a.track-b.track);
const levelGold = L=>20+5*L; // doubloons granted on reaching level L
const CAT_NAMES={hat:'Hats',face:'Faces',coat:'Coats',hull:'Hulls',sail:'Sails',flag:'Flags',figure:'Figureheads',deck:'Deck',decor:'Hideout',moth:'Parrot',effect:'Sky & sea',shield:'Shields'};

/* ---------- Funnal Cove: the shared pirate port (ids stored) ---------- */
const PROJECTS = [
  {id:'jetty', name:'Mend the Old Jetty', dm:300, g:100, blurb:'Ships can dock again. Small steps.'},
  {id:'stall', name:'Rum & Lantern Stall', dm:800, g:300, blurb:'Someone has to sell all these lanterns.'},
  {id:'bakery', name:'The Salty Biscuit Bakery', dm:1500, g:600, blurb:'Smells like cinnamon and replied messages.'},
  {id:'flags', name:'Signal Flag Line', dm:2500, g:900, blurb:'Bunting that spells F-U-N-N-A-L.'},
  {id:'carto', name:"Map-maker's Hut", dm:4000, g:1500, blurb:'Charts every prospect island ever found.'},
  {id:'boats', name:'Fishing Fleet', dm:5500, g:2000, blurb:'Three little boats. Very proud.'},
  {id:'market', name:'Market Square', dm:7500, g:3000, blurb:'Trade, gossip and a man who sells only spoons.'},
  {id:'clock', name:'Harbour Clocktower', dm:10000, g:4000, blurb:'Chimes at 16:30 to shame everyone.'},
  {id:'observatory', name:'Navigator\'s Observatory', dm:12500, g:6000, blurb:'Roughly six months of DMs. Look how far you have sailed.'},
  {id:'beacon', name:'The Grand Lighthouse', dm:20000, g:10000, blurb:'Visible from every inbox in the land.'},
  {id:'sky', name:"The Smugglers' Caves", dm:35000, g:20000, blurb:'Secret tunnels under the cliffs, for treasure and Gary\'s snacks.'},
  {id:'bridge', name:'Bridge of a Hundred Cannons', dm:60000, g:40000, blurb:'The legend is complete. Every cannon fires at sunset.'},
];

/* ---------- Parrot companion (stage ids kept) ---------- */
const MOTH_STAGES = [
  {at:0, name:'Speckled Egg'}, {at:50, name:'Hatchling'}, {at:300, name:'Fluffy Chick'}, {at:1000, name:'Parrot'},
  {at:3000, name:'Scarlet Macaw'}, {at:8000, name:'Phoenix Parrot'},
];
const MOTH_LINES = ['*squawk* Pieces of eight!','I believe in you. Mostly.','That DM had real warmth. Squawk.','Have you considered: one more?','I ate a biscuit. Not sorry.','Prospects love a specific compliment.','Small parrot, large ambitions.','The fog fears us.','Tea break after ten more?','Polly wants a client.'];
const TITLES = [[1,'Deckhand'],[3,'Swabbie'],[6,'Powder Monkey'],[10,'Lookout'],[15,'Bosun'],[20,'Navigator'],[25,'Quartermaster'],[30,'First Mate'],[40,'Captain'],[50,'Commodore'],[60,'Admiral'],[75,'Pirate Lord'],[90,'Pirate King'],[100,'Legend of the Seven Seas']];

/* ---------- Achievements (ids stored: never change) ---------- */
const FAMILIES = [
  ['dm','Send {n} lifetime DMs','Outreach',[250,2500,7500,20000,40000,75000],['Loose Cannon','Broadside','Full Volley','Thunder of the Fleet','Ten Thousand Cannons','The Endless Barrage']],
  ['r','Log {n} genuine responses','Responses',[5,25,100,250,600,1500],['Echo Catcher','Tide Listener','Reply Wrangler','Conversation Cartographer','Voice of the Bay','The Answered']],
  ['v','Send {n} prospect videos as a crew','Videos',[1,10,40,100,250,600],['First Reel','Projectionist','Lantern Show','Picture Palace','Silver Screen Captain','Grand Cinematographer']],
  ['m','Set {n} meetings as a crew','Meetings',[1,10,30,75,150,400],['First Handshake','Table Setter','Parley Pro','Council Caller','Summit Host','The Diplomat']],
  ['c','Win {n} paying clients as a crew','Clients',[1,5,15,40,80,150],['First Anchor','Fleet Starter','Trade Winds','Merchant Prince','Harbour Magnate','Admiral of Accounts']],
  ['bestDay','Personally send {n} DMs in one day','Daily',[30,50,75,90,125,150],['Brisk Tide','Swell','Rogue Wave','High Tide','Storm Surge','The Maelstrom']],
  ['activeDays','Log DMs on {n} different working days','Consistency',[5,25,75,150,300,600],['Signed Aboard','Regular Crew','Old Salt','Pillar of the Pier','Barnacle-Grade Loyalty','Part of the Coastline']],
  ['bestStreak','Reach a {n}-day qualifying streak','Consistency',[3,10,25,50,75,200],['Spark Chain','Tidy Run','Unbroken Wick','Long Burn','Ironwick','Perpetual Flame']],
  ['teamWins','Contribute to {n} team-target days','Team',[5,30,75,150,300,1000],['Crewmates','The Dream Team','Harbour Duo','Two-Ship Legend','Twin Flagships','The Thousand-Day Empire']],
  ['sessions','Complete {n} Lock In voyages','Focus',[1,10,40,100,250,600],['Cast Off','Focused','Deep Water','Monk of the Mist','The Lock-In Legend','The Still Point']],
  ['lockMin','Spend {n} minutes locked in','Focus',[60,300,1200,3000,7500,15000],['First Watch','Long Watch','Night Watchman','Tidewatcher','Keeper of Hours','Timeless']],
  ['bestSession','Log {n} DMs in a single voyage','Focus',[10,20,35,50,75,100],['Quick Oar','Sprint Rower','Swift Current','Jet Stream','Lightning Skiff','Speed of Light']],
  ['earned','Earn {n} doubloons','Treasure',[500,5000,20000,60000,150000,400000],['Pocket Change','Jingling','Treasure Chest','Doubloon Baron','Doubloon Tycoon','Emperor of Gold']],
  ['spent','Spend {n} doubloons','Treasure',[200,2000,10000,30000,80000,200000],['Window Shopper','Patron','Big Spender','Connoisseur','Collector Royal','Patron of the Seas']],
  ['bosses','Help defeat {n} daily sea foes','Battles',[1,10,50,150,300,750],['Fog Lifter','Monster Hunter','Foebane','Stormbreaker','Weatherlord','Clear Seas Forever']],
  ['finalBlows','Fire the final shot {n} times','Battles',[1,10,30,75,150,300],['The Final Shot',"Closer's Instinct",'Executioner of Fog','Last Word','Coup de Grâce',"Fate's Hand"]],
  ['chalWon','Win {n} multiplayer challenges','Rivalry',[1,5,20,50,100,250],['First Blood','Duellist','Champion','Gladiator','Warlord','Undisputed']],
  ['chalPlayed','Complete {n} multiplayer challenges','Rivalry',[1,10,30,60,100,250],['Game On','Up For It','Competitor','Veteran','The Ultimate Rivalry','Arena Eternal']],
  ['collected','Find {n} different treasures','Treasure',[2,6,12,18,24,30],['Beachcomber','Treasure Hunter','Curator','Archivist','Grand Collector','The Complete Hoard']],
  ['level','Reach level {n}','Progress',[5,15,30,50,75,100],['Swabbie','Lookout','Quartermaster','Commodore','Pirate Lord','Legend of the Seas']],
  ['teamDm','Your crew sends {n} DMs together','Team',[1000,5000,12500,25000,50000,100000],['Little Harbour','Busy Port','Bustling Bay','City of Sails','Pirate Metropolis','Constellation Fleet']],
  ['weeks','Help defeat {n} weekly bosses','Battles',[1,5,15,30,52,150],['Week Warrior','Five-Week Flame','Season of Plunder','Half-Year Hero','Year of the Fleet','Three-Year Tide']],
  ['built','Complete {n} Funnal Cove projects','World',[1,3,5,7,9,12],['Carpenter','Shipwright','Architect','Town Planner','Harbourmaster','Founder of Funnal Cove']],
  ['stretch','Contribute to {n} days of 150+ crew DMs','Daily',[1,5,15,30,60,120],['Overtime Glow','Extra Mile','Overachiever','The Furnace','Inferno','Supernova']],
];
const SINGLES = [
  ['first','First Contact','Send your first DM','common','Outreach',['dm',1]],
  ['ice','Breaking the Ice','Send 10 DMs','common','Outreach',['dm',10]],
  ['century','Century Club','Send 100 lifetime DMs','uncommon','Outreach',['dm',100]],
  ['adventurer','Inbox Adventurer','Send 500 DMs','rare','Outreach',['dm',500]],
  ['four','Four Figures','Send 1,000 DMs','rare','Outreach',['dm',1000]],
  ['longgame','The Long Game','Send 10,000 DMs','legendary','Outreach',['dm',10000]],
  ['unstoppable','The Unstoppable','Send 50,000 DMs','transcendent','Outreach',['dm',50000]],
  ['slayer','Century Slayer','Personally send 100 DMs in one day','legendary','Daily',['bestDay',100]],
  ['unbreakable','The Unbreakable','Complete 100 qualifying working days in a row','legendary','Consistency',['bestStreak',100]],
  ['balanced','Perfectly Balanced','Finish a 100-DM day with exactly 50 each','epic','Team',['perfect50',1]],
  ['comebackking','Comeback King','Be 15+ DMs behind and still win the day','rare','Rivalry',['comebacks',1]],
  ['rainmaker','The Rainmaker','Contribute towards 100 crew paying clients','transcendent','Clients',['rainmaker',100]],
  ['setcomplete','The Collector','Complete any treasure set','epic','Treasure',['sets',1]],
  ['allsets','Museum of the Tides','Complete all six treasure sets','mythic','Treasure',['sets',6]],
  ['early','Dawn Raider','Log a DM before 08:30','uncommon','Daily',['earlyDm',1]],
  ['speed50','Morning Rush','Send 50 DMs before noon','epic','Daily',['morning50',1]],
  ['photofinish','Photo Finish','Crew target reached in the last 15 minutes of the day','rare','Team',['photoFinish',1]],
  ['friday','Friday Finisher','Fire the final shot on a Friday','uncommon','Battles',['fridayBlow',1]],
  ['overtaker','Overtaker','Overtake your rival 10 times','rare','Rivalry',['overtakes',10]],
  ['overtaker2','Lead Changer','Overtake your rival 100 times','legendary','Rivalry',['overtakes',100]],
  ['rarefog','Rare Waters','Help defeat a rare sea foe','epic','Battles',['rareBosses',1]],
  ['roster','Monster Manual','Help defeat every regular sea foe at least once','legendary','Battles',['rosterDone',1]],
  ['prest1','Distinguished','Reach Distinction I, beyond level 100','epic','Progress',['dist',1]],
  ['prest3','Storied','Reach Distinction V','legendary','Progress',['dist',5]],
  ['prest5','Myth of the Seven Seas','Reach Distinction X','mythic','Progress',['dist',10]],
  ['hatch','Hatched!','Your parrot egg hatches','common','Companion',['mothStage',1]],
  ['wings','Pretty Polly','Your companion becomes a Parrot','rare','Companion',['mothStage',3]],
  ['greatmoth','Phoenix Rising','Fully evolve your parrot','mythic','Companion',['mothStage',5]],
  ['redeemed','Back From the Brig','Complete a redemption quest','uncommon','Forfeits',['redemptions',1]],
  ['merchant','Pell\'s Favourite','Buy something from the travelling barge','uncommon','Treasure',['merchantBuys',1]],
  ['decorator','Island Decorator','Fill all six spots in your hideout','rare','World',['decorFull',1]],
  ['firstresp','Someone Answered!','Log your first response','common','Responses',['r',1]],
  ['quests10','Errand Runner','Claim 10 quest rewards','uncommon','Quests',['questsClaimed',10]],
  ['quests100','Quest Machine','Claim 100 quest rewards','epic','Quests',['questsClaimed',100]],
  ['quests500','Saga Keeper','Claim 500 quest rewards','mythic','Quests',['questsClaimed',500]],
  ['sprint','The Century Sprint','Hit the target in a co-op Century Sprint','rare','Rivalry',['sprintWins',1]],
  ['s_comeback','The Comeback','???','legendary','Secret',['bigComebacks',1],true,'Be 30+ DMs behind and still win the day'],
  ['s_partners','Perfect Partners','???','epic','Secret',['perfectEqual',1],true,'Finish a successful crew day with exactly equal contributions'],
  ['s_odds','Against All Odds','???','legendary','Secret',['againstOdds',1],true,'Defeat the weekly boss after missing the first working day of the week'],
  ['s_final','The Final Second','???','epic','Secret',['finalSecond',1],true,'Win a timed challenge with a DM in its last 10 seconds'],
  ['s_midnight','Midnight Lantern','???','rare','Secret',['lateSession',1],true,'Finish a Lock In voyage that started after 21:00'],
  ['s_palindrome','Palindrome Day','???','rare','Secret',['palindrome',1],true,'End a day with a palindromic DM count of 11 or more'],
  ['s_answer','The Answer','???','uncommon','Secret',['answer42',1],true,'End a day on exactly 42 DMs'],
  ['s_seven','Lucky Seven','???','epic','Secret',['lucky7',1],true,'Log 7 responses in a single day'],
  ['s_triple','Triple Crown','???','epic','Secret',['triple',1],true,'Log a response on a day the crew also makes a video and sets a meeting'],
  ['s_full','Full House','???','legendary','Secret',['fullHouse',1],true,'Log all five action types on the same day'],
  ['s_sync','Synchronised Swimmers','???','rare','Secret',['syncDm',1],true,'Both captains log a DM within the same 3 seconds'],
  ['s_fogwhisper','Monster Whisperer','???','epic','Secret',['fastBoss',1],true,'Defeat the daily foe before 11:00'],
  ['s_unseen','The Unseen Legend','???','transcendent','Secret',['mythics',5],true,'Earn five mythic achievements'],
  ['wardrobe','Fashion of the Fleet','Own 25 cosmetics','rare','Style',['cosmetics',25]],
  ['wardrobe2','Admiral of Style','Own 60 cosmetics','legendary','Style',['cosmetics',60]],
  ['fullrig','Fully Rigged','Customise your hull, sails, flag and figurehead','rare','Style',['fullRig',1]],
];
const ACHIEVEMENTS = [];
FAMILIES.forEach(([metric,desc,cat,targets,names])=>{targets.forEach((n,i)=>{let rar=RARITIES[i];if(metric==='teamWins'&&i===5)rar='transcendent';
  ACHIEVEMENTS.push({id:`${metric}_${i}`,name:names[i],desc:desc.replace('{n}',n.toLocaleString('en-GB')),rar,cat,metric,target:n,tier:TIERS[i],fam:metric});});});
SINGLES.forEach(([id,name,desc,rar,cat,[metric,target],secret,reveal])=>ACHIEVEMENTS.push({id,name,desc,rar,cat,metric,target,secret:!!secret,reveal}));
const ACH_BY_ID = Object.fromEntries(ACHIEVEMENTS.map(a=>[a.id,a]));

/* ---------- Quests ---------- */
const DAILY_QUESTS = [
  {id:'dm10', name:'Send 10 personalised DMs', m:'dDm', n:10, xp:40, g:12},
  {id:'dm25', name:'Send 25 DMs', m:'dDm', n:25, xp:80, g:25},
  {id:'dm40', name:'Send 40 DMs', m:'dDm', n:40, xp:140, g:40},
  {id:'lock1', name:'Complete one Lock In voyage', m:'dSes', n:1, xp:60, g:15},
  {id:'resp1', name:'Log a genuine response', m:'dResp', n:1, xp:50, g:15},
  {id:'boss', name:'Help sink today\'s sea foe', m:'dBoss', n:1, xp:70, g:20},
  {id:'early5', name:'Send 5 DMs before 10:00', m:'dEarly', n:5, xp:50, g:15},
  {id:'share', name:'Make a meaningful contribution (30% of the target)', m:'dShare', n:30, xp:70, g:20},
  {id:'burst', name:'Log 15 DMs in a single voyage', m:'dBestSes', n:15, xp:90, g:25},
];
const WEEKLY_QUESTS = [
  {id:'w150', name:'Send 150 individual DMs', m:'wDm', n:150, xp:400, g:120},
  {id:'w250', name:'Send 250 individual DMs', m:'wDm', n:250, xp:650, g:200},
  {id:'wlock5', name:'Complete five voyages', m:'wSes', n:5, xp:350, g:100},
  {id:'wboss5', name:'Help defeat five daily foes', m:'wBoss', n:5, xp:500, g:150},
  {id:'wteam', name:'Defeat the weekly boss', m:'wWeekly', n:1, xp:450, g:140},
  {id:'wchal', name:'Complete two shared challenges', m:'wChal', n:2, xp:300, g:90},
  {id:'wresp', name:'Log 5 responses', m:'wResp', n:5, xp:350, g:100},
];
const LONG_QUESTS = [
  {id:'l1k', name:'Send 1,000 lifetime DMs', m:'dm', n:1000, xp:1500, g:500},
  {id:'l5k', name:'Send 5,000 lifetime DMs', m:'dm', n:5000, xp:5000, g:1500},
  {id:'lprest', name:'Reach Distinction I', m:'dist', n:1, xp:3000, g:1000},
  {id:'lclients', name:'Win 10 clients as a crew', m:'teamClients', n:10, xp:6000, g:2000},
  {id:'lteam100', name:'Complete 100 successful crew days', m:'teamWins', n:100, xp:5000, g:1500},
  {id:'lobs', name:'Build the Navigator\'s Observatory', m:'built', n:9, xp:8000, g:2500},
];

/* ---------- Reminders ---------- */
const REMINDERS = {
  nobody:["Your future clients are currently unaware you exist. Sort that out.","The leaderboard is looking suspiciously unemployed.","Two grown captains. One target. An alarming lack of cannon fire.","Congratulations on achieving absolutely nothing today. There's still time.","The sea foe has made itself a cup of tea. It plans to stay.","Funnal Cove's economy is collapsing. Have you considered sending a DM?","Your prospects haven't rejected you yet. Give them a chance.","The cannons are loaded. Nobody's firing."],
  lagger:["{leader} has sent {lead} DMs. {lagger} appears to have entered early retirement.","{lagger}'s captain has started applying for other ships.","{lagger}, your parrot is pretending not to know you.","Breaking: {lagger} last seen staring at a blank DM. Search party assembled.","{leader} is carrying this ship on their back. Very noble. Very tired."],
  ahead:["{leader} is {gap} DMs ahead. {lagger}, this is your villain origin story.","The crown is drifting towards {leader}. {lagger}, are you just going to let that happen?","{leader} leads by {gap}. The gulls are taking bets."],
  overtaken:["Plot twist: {leader} has overtaken {lagger}!","{leader} just stole the lead. {lagger}'s parrot gasped audibly.","Lead change! {lagger} is now officially the underdog."],
  close:["{left} DMs to go. The beast is wheezing. Finish it.","The foe is on {left} HP. Somebody be the hero.","So close you can smell the victory grog. {left} left."],
  deadline:["{mins} minutes left and {left} DMs to go. Not ideal. Not impossible.","The clocktower is judging you. {left} DMs, {mins} minutes.","Final warning: {left} DMs to go before the sea wins today."],
  missed:["Yesterday the sea won. Today we get revenge.","Yesterday's foe is still gloating. Don't let it happen twice.","The Herald printed yesterday's miss in very large letters. Sort it out."],
  won:["Foe sunk! Everything after this is pure plunder.","Victory! Stretch goals glitter at 125, 150 and 200.","Victory! Your Majesty may now enjoy a smug biscuit."],
  steady:["Keep firing. 100 DMs won't send themselves, Captain.","Every cannonball counts. Probably. We haven't checked.","A personalised DM a day keeps the kraken away. Well, 100 do.","Somewhere out there is a business that needs you and doesn't know it yet."],
};
const JOKES = ["Steady on, cowboy.","Your mouse is faster than your sales pitch.","Nice try. The button remembers.","One at a time, you absolute machine.","The inbox needs a breather.","The cannon is still reloading.","Patience, captain. Even cannons need five seconds.","Hold your seahorses.","That's not how personalisation works.","The gulls saw that. They're judging."];
const HEADLINES = {
  win:["{top} FIRES {topn} DMS, STILL REFUSES TO TAKE A BREAK","SEA FOE SUNK AGAIN. MONSTER DESCRIBED AS \"QUITE UPSET\"","{team} CANNONBALLS LIGHT UP THE BAY. RESIDENTS SQUINT","{top} CLAIMS VICTORY. {bottom} DEMANDS RECOUNT"],
  miss:["ECONOMY IN CRISIS AFTER CREW MISSES TARGET BY {short}","SEA FOE SURVIVES, THROWS SMALL PARTY","COVE DARK AS CREW FALLS {short} SHORT","\"WE'LL GET IT TOMORROW,\" SAY EXHAUSTED CAPTAINS"],
  client:["NEW CLIENT ARRIVES. COVE DECLARES PUBLIC HOLIDAY","GROG SHORTAGE AS CLIENT SIGNS","BAY ERUPTS IN CELEBRATION: \"WE HAVE A CLIENT\""],
  stretch:["{team} DMS?! LOCAL SCIENTISTS BAFFLED","OVERTIME CANNON FIRE VISIBLE FROM SPACE"],
  zero:["{zero} SPOTTED DOING ABSOLUTELY NOTHING, SOURCES CONFIRM","WHERE WAS {zero}? INVESTIGATION LAUNCHED"],
};
const AWARDS = [
  {id:'champ', name:'Outreach Champion', rule:'Most DMs this week', m:'wDm'},
  {id:'reply', name:'Reply Magnet', rule:'Most responses this week', m:'wResp'},
  {id:'wizard', name:'Appraisal Wizard', rule:'Most videos sent this week', m:'wVid'},
  {id:'meet', name:'Meeting Machine', rule:'Sets the most meetings this week', m:'wMeet'},
  {id:'closer', name:'The Closer', rule:'Most confirmed clients this week', m:'wClient'},
  {id:'improved', name:'Most Improved', rule:'Biggest % rise in DMs vs last week (min. 20 DMs)', m:'wImprove'},
  {id:'comeback', name:'Comeback King', rule:'Most daily comebacks this week (15+ behind, finished ahead)', m:'wComeback'},
  {id:'consistent', name:'Consistency Champion', rule:'Most working days with 30+ DMs this week', m:'wSteady'},
  {id:'teamplayer', name:'Team Player', rule:'Most final shots plus target days contributed to', m:'wTeam'},
];

/* ---------- v10: one moment for every rule change, and Distinction past level 100 ---------- */
// Anything that happened before this keeps the old rules (fishing tables, hunt monsters, lock-in gold).
const V10_AT=Date.UTC(2026,10,14,8,30);
const DIST_XP=25000,DIST_GOLD=1500;
const DIST_TITLES=[[1,'Distinguished Legend'],[3,'Honoured Legend'],[5,'Storied Legend'],[10,'Mythic Legend'],[20,'Eternal Legend'],[30,'Sea God']];
function distTitle(n){let t=DIST_TITLES[0][1];for(const[r,x]of DIST_TITLES)if(n>=r)t=x;return t;}
function roman(n){if(!n)return '0';const M=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let o='';for(const[v,s]of M)while(n>=v){o+=s;n-=v;}return o;}
