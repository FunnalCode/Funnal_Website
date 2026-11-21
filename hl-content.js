/* ============================== CONTENT REGISTRY ==============================
   Words and boss settings live here, loaded as their own small file next to the game,
   so new lines, bosses and release notes can be added without touching the game code.
   Lines are picked by a fixed seed, so both captains see the same line on the same day. */
window.HL_CONTENT={
  version:17,
  whatsNew:{
    17:{title:"Season 1 and Christmas",lines:[
      "<b>Seasons:</b> Season 1, The Frozen Fathoms, starts on 1 December. Each of you gets a free 40-tier pass in the new Season tab of Quests. Every DM moves you along, and responses, videos, meetings and clients give big jumps.",
      "<b>Christmas, 1 to 26 December:</b> an Advent Chest on the Harbour (hit the target to open a door), ten limited Christmas items in the shop, five Christmas fish, a Santa Penguin in December sightings, and two Christmas bosses: the Grinchfish and the Ghost of Christmas Past.",
      "<b>Bosses with character:</b> from 1 December the daily boss comes from a roster of 36, each with a title, a weak spot (hit it for a bonus once it's sunk) and a Bestiary page with your record against it. Bosses talk back depending on how the day is going, and get a short intro the first time you open the Harbour each day.",
      "<b>Loot, trophies and legends:</b> every boss you help sink from 1 December drops a piece of its loot set (complete it for the boss's banner; Pell swaps 5 duplicates for a missing piece). A Trophy Room in Achievements mounts a head for every boss you sink, from bronze to diamond. Legendary hunts arrive with a warning the day before: the Krampus Kraken on Friday 18 December. And your ships now show how the last few days went (looks only, never a cost).",
      "<b>Winter:</b> snow on the islands and the rigging, pines, ice floes, northern lights, a Christmas tree that grows a bauble for every target day, and seals singing carols. Gary has a Santa hat. He did not ask for one.",
      "<b>Night-time glow:</b> after sunset the sea glows behind the ship, lanterns light up, stars reflect and the moon draws a silver path. Fireflies come out at the hideout.",
      "<b>Better fits:</b> beards follow your jaw, mutton chops stay on your cheeks, and the straw hat, bicorne, captain's cap and chef's hat sit on your head.",
      "<b>Settings, Game feel:</b> turn Gary's heckles on or off, and pick reduced motion if the sea makes you queasy."]},
    16:{title:"Behind-the-scenes refit",lines:[
      "<b>Better fits:</b> beards follow your jaw instead of sitting on it like a mask, mutton chops stay on your cheeks, the straw hat, bicorne, captain's cap and chef's hat sit on your head, and the kraken cape hangs behind you.",
      "<b>Settings, Game feel:</b> turn Gary's heckles on or off, and pick reduced motion if the sea makes you queasy.",
      "<b>Smoother on phones:</b> the scenes now reuse what doesn't move, so less battery goes on redrawing stars.",
      "<b>Safer updates:</b> every new version is saved, tried on a preview copy first, and can be rolled back in a minute without touching your progress.",
      "<b>Something is coming on 1 December.</b> Gary has been seen buying tinsel."]}
  },
  // boss settings for the boss builder (see bosskit.js); the Christmas pair goes live in Stage 1
  bossKits:{
    grinchfish:{name:'The Grinchfish',title:'Thief of Christmas',kit:{body:'fish',col:'#6FAE4A',col2:'#D7EFB8',pat:'scales',eyes:2,eyeStyle:'angry',mouth:'fangs',acc:['santa','fins'],mood:'smug'}},
    christmas_past:{name:'The Ghost of Christmas Past',title:'Rattler of Chains',kit:{body:'jelly',col:'#BFD8E8',col2:'#EAF5FB',eyes:2,mouth:'pout',acc:['chains','tinsel'],mood:'calm',floats:true}},
    ironclaw:{name:'Ironclaw',title:'Crusher of Hulls',kit:{body:'crab',col:'#C9583A',pat:'spots',eyes:2,eyeStyle:'angry',mouth:'fangs',acc:['claws','barnacles','scars','bubbles'],mood:'angry'}},
    frostfang:{name:'Frostfang Narwhal',title:'Terror of the Ice Shelf',kit:{body:'fish',col:'#8FA9C9',col2:'#E6EEF7',pat:'spots',eyes:2,eyeStyle:'angry',mouth:'smirk',acc:['tusk','fins','frost'],mood:'smug'}},
    pufferdread:{name:'Pufferdread',title:'Swells With Fury',kit:{body:'puffer',col:'#E8A23A',col2:'#FFF1C9',eyes:2,eyeStyle:'angry',mouth:'fangs',acc:['horns','scars'],mood:'angry'}},
    shadowwing:{name:'Shadowwing Ray',title:'Glides Unseen',kit:{body:'ray',col:'#5C4F86',col2:'#8E80B8',eyes:2,eyeStyle:'shades',mouth:'smirk',acc:['bubbles'],mood:'smug',floats:true}},
    inkmaw:{name:'Inkmaw',title:'Three Eyes of the Trench',kit:{body:'squid',col:'#8E3E6E',eyes:3,mouth:'beak',acc:['crown','eyepatch'],mood:'angry'}},
    shellback:{name:'Old Shellback',title:'Lives In A Skull',kit:{body:'shell',col:'#E5866A',col2:'#F2E3C4',eyes:2,mouth:'grin',acc:['barnacles','bubbles'],mood:'scared'}},
    lanternjaw:{name:'Lanternjaw Angler',title:'Follow The Light',kit:{body:'blob',col:'#3E4A6E',col2:'#5C6A94',eyes:2,eyeStyle:'round',mouth:'fangs',acc:['lure','spikes'],mood:'smug'}}
  },
  lines:{
    // Barnacle Bill, out of nowhere (used by the Tavern in Stage 5)
    landlordRandom:[
      "I had a wife once. Lovely woman. Bit of a mermaid. Don't ask which half.",
      "I've been banned from three harbours and a christening.",
      "That stool you're on was made from a ship that sank. Twice. Same ship.",
      "My mother was a lighthouse keeper. Never once looked me in the eye. Too bright.",
      "I once arm-wrestled a squid. Technically I won eight times and lost once.",
      "There's a man buried under the dartboard. Not dead, just very committed to a bet.",
      "I used to be a cabin boy. Then a cabin man. Now I'm more of a cabin situation.",
      "Don't drink the water in the back. It's not water. It's Kevin.",
      "I can't read, you know. Been pretending for forty years. Nice menu, isn't it?",
      "The cat's called Admiral. He outranks you. Show some respect.",
      "I was nearly famous once. Then the other bloke got famous instead. Smug git.",
      "Every night at midnight I hear singing from the cellar. I've stopped going down there. It's got better acoustics than me.",
      "I've got a tattoo of a woman on my back. Never met her. Woke up with it in Lisbon.",
      "Some people collect stamps. I collect grudges. I've got a lovely one about a goat.",
      "My first ship was called the Unsinkable. Funny story. Short story.",
      "I don't trust seagulls. Or men who own more than one hat. Or Thursdays.",
      "I've been 52 for eleven years now. Nobody's checked.",
      "Saw a ghost in the gents last week. He was washing his hands. More than most of you lot.",
      "I was engaged to a woman in Cornwall and a woman in Wales at the same time. The bridge was the hard part.",
      "If anyone asks, I was here all night Tuesday. With you. Playing dominoes."
    ]
  }
};
