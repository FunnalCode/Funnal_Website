
/* ---- 24 Nov: Stage 9. More Gary and Bill, characters that remember you, town gossip about the other
   captain, and the monthly mystery. dialogue2.js decides who says what. See the voice guide in the project. ---- */
window.HL_CONTENT.lines.d9={
gary:{
 morning:[
  "Morning. I've already had breakfast. It was yours. You left it on the deck.",
  "Rise and shine. Mostly rise. I'll handle the shine. Look at these feathers.",
  "Good morning from the Editor in Chief. Today's headline depends on you. No pressure. Some pressure.",
  "I've been up since five. Not working. Just up. Judging the sunrise. It's a six.",
  "The cannons are loaded, the deck is swabbed and I've eaten a whole sandwich that wasn't mine. Productive morning.",
  "Morning. Lenny's asked me to stop doing vocal warm-ups at dawn. I've asked Lenny to stop being a lighthouse keeper. Stalemate.",
  "Today's forecast: DMs, with a strong chance of me taking credit for them.",
  "Morning, {me}. I had a dream you hit target before lunch. Then I woke up and ate a crisp packet. Make it real.",
  "First DM of the day is the hardest. I wouldn't know. I've never sent one. I've supervised loads.",
  "I've written tomorrow's front page already. It says 'CREW TRIUMPHS'. Don't make me write a correction.",
  "Morning. The {boss} turned up early and is doing stretches in the harbour. Smug stretches.",
  "Coffee's ready. It's sea water in a mug. I don't have thumbs, I did my best.",
  "Morning. I've counted the doubloons. Then I counted them again. One's missing. No idea where. Stop looking at my beak.",
  "Somewhere a prospect is opening Instagram right now, thumb hovering. Be there. Be lovely.",
  "Up and at them. Them being the prospects. Not the pigeons. I'm at the pigeons myself."
 ],
 fast:[
  "Slow down, I can't write the headlines that fast. I'm using my beak.",
  "Look at that pace. I've had to put the kettle on just to have something to do with my face.",
  "Crab just looked up from under the jetty. Crab never looks up. You've impressed a crab.",
  "At this rate I'll have to hire a second gull for the Herald. I'll pay him in compliments. Mine.",
  "You're sending DMs like I eat chips. Fast, messy, no regrets.",
  "The {boss} has gone quiet. It's doing the maths. The maths isn't good for it.",
  "I've stopped pretending to help and started genuinely watching. It's like telly. With cannons.",
  "Steady. If you finish too early the {boss} won't have time to say its lines. It practised.",
  "{team} already. I'm going to need a bigger headline font.",
  "Pigeons have downed tools to watch. Not that they were using them. They're pigeons."
 ],
 slow:[
  "Not to alarm anyone, but the {boss} has ordered a takeaway. It's settling in.",
  "I've had a lovely nap. Woke up. Checked the count. Had another nap out of solidarity.",
  "{left} to go. That's only {left} little 'hello's. I say hello to bins all day. It's easy.",
  "The DM button misses you. It told me. It's a button. It doesn't talk. But it would.",
  "Quiet out there. Like a library. If the library had a monster in it eating the books.",
  "No rush. Some rush. A medium rush. Rush like a gull who's spotted a chip at the far end of the beach.",
  "I've been staring at the sea waiting for a cannonball. I've seen a duck. Lovely duck. Not a cannonball.",
  "Small steps. One DM. Then another. Then I'll say something nice. I've got one nice thing saved up.",
  "The {boss} is doing a crossword. It's getting comfortable. Make it uncomfortable.",
  "You know what goes well with a slow afternoon? A fast ten minutes. Go on. I'll time you. With my eyes."
 ],
 hit:[
  "Target! I'm going to write a headline so big it needs two pages. I'll eat the second page.",
  "That's the target. I'll be accepting congratulations on your behalf all evening.",
  "Done! Bill's going to want to hear about this. I'm going to tell it slightly wrong so I'm in it.",
  "Target hit. I've done a celebratory lap of the lighthouse. Lenny shut the window on me. Still worth it.",
  "Brilliant. I'd hug you but I'm a gull and you'd regret it. Biologically.",
  "There it is. The {boss} is going to need a lie down. On the sea bed. Forever.",
  "Hit it. I'm awarding myself a chip for motivational services.",
  "That's the target done. The pigeons have started a slow clap. They don't have hands. It's mostly flapping.",
  "Target! Even Crab nodded. Sideways. But it counts."
 ],
 miss:[
  "Yesterday was a warm-up. A very long, very complete warm-up.",
  "Didn't quite make it yesterday. I printed it on page nine under the tide times. Nobody reads the tide times.",
  "Let's call yesterday 'character building'. Today we build something else. A target.",
  "Fresh start. I've wiped the slate. I licked it, actually. Gulls don't have cloths.",
  "Missed yesterday? Happens to the best of us. Happened to me once. I missed a chip. Still think about it."
 ],
 boss:[
  "The {boss} is gone. I've already started selling commemorative mugs. They're shells.",
  "Sunk. I want it on record I was very brave. From the lighthouse. With the door shut.",
  "Down it goes. I'd say a few words but I've only got a few and they're all 'chip'.",
  "That's the {boss} sorted. I'll do the obituary. It'll be short. And mean."
 ],
 fish:[
  "Lovely fish. I'll mind it for you. In my stomach. It's very secure in there.",
  "Is that for me? It's for me. Thank you. Oh, it's not. Awkward.",
  "Nice catch. I once caught a fish. It was in a bin. In batter. Still counts."
 ],
 weekend:[
  "It's the weekend. I'm off. The Herald's off. Crab's never on.",
  "Weekend. I'm doing a bit of light renovation. By light I mean I've moved one crisp packet.",
  "No target today. I'm going to sit on the lighthouse rail and be majestic. People pay for this.",
  "Weekend rules: no DMs required, chips encouraged, Gary in charge.",
  "Day off. Lenny's hoovering. I'm pretending to be a decorative gull. He's not buying it."
 ],
 poke:[
  "That's my wing. I need that. For flying. And for pointing at chips.",
  "Do you poke Bill like this? You don't. Because he's big. I'm big. Inside.",
  "I'm busy. I'm editing. Leave the editor alone.",
  "If you poke me again I'm putting you in the Corrections column.",
  "I'm not a button. The button is down there. The big one. Poke that.",
  "Poke me once, shame on me. Poke me twice, that's harassment of the press.",
  "Ow. My good feather.",
  "I've filed a complaint with myself. I've upheld it.",
  "You've got chip on your finger. Oh. No. That's just your finger. Disappointing.",
  "Careful. I've got a very powerful friend. Crab. He's not my friend. He's just powerful.",
  "Yes? Do you need something? Is it a chip? Tell me it's a chip.",
  "I'm thinking. Gulls think. Mostly about chips. But deeply.",
  "Oi. I'm off the clock. I'm always off the clock. Where's the clock?",
  "Every poke costs a chip. You're on four. I take IOUs.",
  "Stop it. I'm a professional. Look at my little professional face."
 ],
 night:[
  "Go to bed. The prospects are asleep. Well. Some are scrolling. Leave them. It's weird.",
  "Night shift. I'm guarding the doubloons. From whom? Exactly. It's working.",
  "Lenny's put the light on. I'm sunbathing in it. Moonbathing. Lighthousebathing.",
  "It's late. Even the {boss} has gone home. Do monsters have homes? It's got a cave. It's damp.",
  "I'm doing the Herald now. Tomorrow's paper. I've given myself a nice photo.",
  "Shh. The pigeons are asleep. If they wake up they'll want paying."
 ],
 storm:[
  "Storm's in. I'm sheltering in the lighthouse. Lenny's sheltering from me.",
  "Bit windy. I've been blown into the bakery twice. Mrs Crumb gave me a roll the second time. Worth it.",
  "Lightning! Count the seconds. One... two... I've eaten a crisp. Lost count."
 ],
 nest:[
  "The nest now has a doormat. It says 'GARY'. It's a crisp packet. The pigeons wrote it. Spelling's wrong.",
  "Nest update: I've installed a skylight. The roof fell in. Same thing, really.",
  "I've added a spare room to the nest. For guests. Nobody's allowed to stay.",
  "The nest's been valued. By me. At one billion chips."
 ],
 complaints:[
  "Lenny keeps calling it 'his' lighthouse. Possession is nine tenths of the law. I'm the other tenth too.",
  "Somebody left a chip on the jetty and then picked it back up. Cruel and unusual.",
  "The pigeons have unionised. Their demands are crumbs. I'm offering exposure.",
  "Bill called me 'that seagull'. I am THE seagull.",
  "Crab keeps saying I owe him a chip. Crab has no proof. Crab has a diary. Crab's diary is very detailed.",
  "My mum's coming to visit. Nobody told me. She told me. I'm complaining anyway.",
  "Somebody drew a moustache on my picture in the Herald. I'm keeping it. It's distinguished."
 ],
 any:[
  "I've been made Employee of the Month. I made the award. I'm the only employee. Still proud.",
  "Did you know gulls can drink sea water? I know. I'm amazing. Don't tell the pigeons, they'll want a pay rise.",
  "My mum always said, Gary, you'll never amount to anything. Look at me now. Editor. Of a newspaper. That I own. That nobody pays for.",
  "I tried a salad once. It was a leaf. I was ill for a week. Back on chips.",
  "Lenny asked me to pay rent. I've given him a painted pebble. It's a chip. It's art. It's legal tender in my nest.",
  "Bryn's Mum walked past the lighthouse today. I hid in a pot. The pot was Lenny's. Lenny was in it. Awkward.",
  "Someone asked if I'm a seagull or a herring gull. I'm a CEO gull.",
  "I've started a podcast. It's me squawking into a shell. Downloads are down. They were never up.",
  "Pell tried to sell me a mirror. Said it would 'show my true self'. It showed a gull. Rubbish. I'm much handsomer.",
  "I've been doing my accounts. Income: chips. Outgoings: chips. I'm breaking even. Ish.",
  "Fun fact: a group of gulls is called a squabble. I'm a squabble on my own.",
  "I've written my memoirs. Chapter one: Chips. Chapter two: More chips. Chapter three: The Incident. We don't talk about chapter three.",
  "Somebody's been feeding the pigeons. It's me. I've been feeding them my wages. I don't get wages. I've been feeding them yours.",
  "Bill says I'm banned from the bar stools. I'm not banned from the bar. I stand. Like a professional.",
  "I've been asked to judge the town's sandcastle contest. Everyone's going to lose. I'm going to eat the winner.",
  "Did you see the sunset? I arranged that. Took ages.",
  "I like to think of myself as a mentor. A mentor who eats your lunch. Most mentors do, if you think about it.",
  "Admiral the cat looked at me today. Not a nice look. A 'you're made of chicken' look. I'm not. Mostly chip.",
  "I've been offered a job at a rival newspaper. There isn't one. I'm keeping my options open anyway.",
  "Lenny's taken up the accordion. Lighthouses are very echoey. I've taken up earplugs. They're two peas.",
  "Mrs Crumb gave me a stale bun. I've had it framed.",
  "Crab and I are in mediation. The mediator is a rock. The rock's on Crab's side.",
  "I flew to the next town today. They've got a gull. He's not as good as me. He's got a better beak. Whatever.",
  "I've never lost an argument. I've left a lot of arguments. Very quickly. With a chip.",
  "Hot tip from the Editor: DMs sent before ten get replies before lunch. I made that up. It feels true though."
 ],
 chapters:[
  ["Big announcement: I'm doing a cooking show. 'Gary's Kitchen'. Episode one: a chip.","'Gary's Kitchen', episode two: a chip, but warm. Lenny says I set the bins on fire. It's called flambe.","Episode three: guest chef Mrs Crumb. She made bread. I ate it raw. Ratings soared. Well. Crab watched.","'Gary's Kitchen' has been cancelled. By Lenny. Over the bins. Artists are never appreciated."],
  ["I'm learning to swim. Gulls can float. I want to swim. Like a dolphin. With better hair.","Swimming lesson two. Crab's teaching me. He only goes sideways. I've done three laps of the jetty. Sideways.","I swam to the buoy. The buoy was further than it looked. I'm still out here. Send a chip.","Back on dry land. Swimming's overrated. Flying is just swimming in the sky without getting your bum wet."],
  ["My mum's visiting next week. I need the nest spotless. I need the lighthouse spotless. I need Lenny to look less like a lighthouse keeper.","Mum's here. She's moved my crisp packets. She's alphabetised them. A for Ready Salted. That's not how letters work, Mum.","Mum met Bryn's Mum. They had a coffee. They're friends now. I've never been more frightened in my life.","Mum's gone home. She left a note: 'Proud of you, love. Eat a vegetable.' I've pinned it up. I've eaten the vegetable. It was a chip."],
  ["I've applied to be harbourmaster. Hobbs doesn't know yet. My campaign slogan: 'Chips For All'. My policy: chips for me.","Campaign update: I kissed a baby. It was Fergus's prawn. Still counts. Hobbs is rattled.","Debate night. Hobbs talked about 'safe moorings'. I talked about chips. The crowd was mostly pigeons. I won the pigeon vote.","Election result: Hobbs, 9 votes. Gary, 2 pigeons and a crab who voted by accident. I'm calling for a recount. In chips."],
  ["I'm writing a novel. It's about a handsome gull who saves a harbour. Fiction, obviously. Mostly.","Chapter two is done. The handsome gull meets a crab who lies about chips. Very realistic.","Crab's read the novel. He's threatening to sue. Over 'defamation'. I've changed his name to 'Grab'. Totally different.","The novel's finished. One copy. Pell's selling it as 'limited edition'. There are nine under his counter. I don't know how."],
  ["The lighthouse is getting a new bulb. Lenny says it's for ships. I say it's for my ring light.","The new bulb is in. I've started doing photoshoots. Moody. Windswept. Lenny says ships are confused.","A ship crashed into the jetty last night. The captain said the lighthouse was 'doing poses'. Nonsense. I was doing one pose.","I've been banned from the bulb. I'm taking my photos by the fridge light now. Same energy."],
  ["I've taken up yoga. Gull yoga. It's standing on one leg. I've been doing it for years. I'm basically a master.","Yoga day two. Tried 'downward dog'. Admiral the cat saw. Admiral did 'downward gull'. It was a threat.","Yoga day three. I've found inner peace. It was behind a crisp packet. Then a pigeon took it.","I've quit yoga. I'm doing pilates now. It's yoga, but I complain in a different accent."],
  ["Pell's offered me a job. Brand ambassador. I'd stand on his barge and look expensive.","First day as ambassador. I stood there. I looked expensive. Somebody tried to buy me. I was tempted.","Pell's paying me in 'exposure' and 'vouchers for Pell'. I've done the maths. I owe Pell money.","I've resigned. Pell says I'm under contract. The contract is a napkin. I've eaten it. Free agent."]
 ],
 barred:[
  "I've been barred from the Rusty Anchor. For a week. For something I absolutely did. Allegedly.",
  "Bill won't let me in. I've been pressing my beak against the window. It's leaving marks. Good. Art.",
  "Barred. Me. The Editor in Chief. I'll be writing a very strongly worded front page.",
  "Tell Bill I miss the crisps. Don't tell Bill I miss him. I don't. I miss the crisps.",
  "I'm boycotting the tavern. Because I'm barred. But also as a choice. Mostly the barred bit."
 ],
 party:[
  "Party at the Rusty Anchor! I've been invited! I've invited myself, but still!",
  "Case closed! I'd like to thank the detectives. And me. For being an excellent suspect.",
  "I'm wearing my party hat. It's a crisp packet. A party crisp packet."
 ]
},
bill:{
 gossip:[
  "Nell says Lenny's been sleeping in the lamp room. Says it's the only place Gary can't reach. Gary can fly, Lenny. Love him.",
  "Hobbs has put a speed limit on the harbour. Three knots. The ducks are furious.",
  "Mrs Crumb's selling 'pipeline pies'. It's a pastry tube. Full of fish. Obviously.",
  "Fergus asked Nell out. Took her to his stall. Showed her a lobster. They're engaged. To the lobster? Unclear.",
  "Miss Pike's started a night class. 'Advanced Follow-Ups'. Gary enrolled. He ate the register.",
  "Pell sold Hobbs a 'rare' compass. It points at Pell's barge. Every time. Very rare, that.",
  "Somebody's been leaving chips outside Crab's rock. One at a time. Crab's counting them as interest.",
  "Bryn's Mum came in for a sherry. Looked at the jukebox. It started playing on its own. I'm not touching it.",
  "Lenny's taken up the accordion. I said Lenny, the lighthouse is meant to warn ships away, not people.",
  "The fence was seen in the bakery. Buying a baguette. To use as a disguise. Moustache, I think.",
  "Nell knitted the kraken a jumper. Eight sleeves. Took her a year. The kraken wore it once. To a funeral. Its own.",
  "Admiral's been made honorary harbourmaster. Hobbs didn't agree to it. Admiral didn't ask.",
  "Gary told the whole town he's writing a book. I've read it. It's mostly pictures of Gary.",
  "Old Tom's ghost has started leaving tips. Seaweed. It's a start.",
  "Hobbs named the new jetty. Guess. Go on. It's Gary. They're all Gary."
 ],
 alone:[
  "{here}! Just you? Good. Sit by the fire. The good chair. Not the one with the spring. That's for {absent}.",
  "Ah, {here}. You're my favourite. Don't tell {absent}. I told {absent} they were my favourite. I lied. You're my favourite. Mostly.",
  "{here}, thank goodness. {absent} came in earlier and asked for 'a coffee'. In a tavern. I had to have a lie down.",
  "Sit down, {here}. {absent}'s been in all week telling me about 'reach rates'. I don't know what they are. I nodded so hard I pulled something.",
  "On your own? Lovely. I'll put the good music on. Not the jukebox. Me humming.",
  "{here}! I've saved you a pie. It's fish. It's always fish. But it's your fish.",
  "If {absent} asks, you weren't here and I didn't give you the big glass."
 ],
 both:[
  "Both of you! My two favourite captains. My only two captains. Still favourites.",
  "Look at this. The whole crew. I'd take a picture but the last time I used the camera the kraken ate it.",
  "Together at last. Now, who's paying? Don't both look at the ceiling.",
  "Two captains, one bar, no tab paid. A beautiful sight.",
  "{here}, {other}, sit. I've got a story. It's about a kraken. You've heard it. You'll hear it again. Different ending."
 ],
 any:[
  "I once wrestled a shark. Well. A big mackerel. Well. I had an argument with a mackerel. I won. I think.",
  "This bar's been here a hundred years. I've been here ninety of them. The other ten I was in Portugal. Don't ask.",
  "The wife says hello. You've never met the wife. Nobody's met the wife. The wife says hello anyway.",
  "That stain on the ceiling? Kraken. We don't talk about it. We do. All the time. It's my favourite story.",
  "Admiral's asleep in the till again. If you want change you'll have to ask him nicely. He won't give it.",
  "Pie of the day: fish. Pie of the week: fish. Pie of the century: you'll never guess.",
  "I tried to modernise. Got a card machine. It's a shell. You tap it. I write it in the book. It's basically the same.",
  "Old Tom's in the corner again. Ghost. Lovely bloke. Never paid. Still doesn't. Very consistent.",
  "Shanty tonight. I know three. They're all the same one at different speeds.",
  "My doctor says I should cut down on rum. I've cut down on doctors.",
  "Had a captain in here last week who sent a hundred DMs in a day. I made that up. Inspire you, did it?",
  "Gary came in and asked for 'the usual'. He's never had a usual. He's had everyone else's.",
  "I've been landlord here so long I'm part of the building. Load-bearing, apparently. Don't make me laugh, the roof goes.",
  "I used to be a sailor. Then a pirate. Then a sailor again. Then a pirate's accountant. Now this. It's a lovely career ladder. All the rungs are wet.",
  "Somebody tipped me in doubloons yesterday. I nearly cried. It was one doubloon. I did cry.",
  "I'm thinking of doing a quiz night. Questions about the sea. Answer's always 'kraken'. Everyone wins.",
  "That fire's been lit since 1974. I'm not saying it's magic. I'm saying I've never paid for wood.",
  "My nan ran this pub before me. She could carry eight pints in one hand. The other hand was a hook. Long story. Great story.",
  "Saw a mermaid once. Turned out to be Nell having a swim. Still. Lovely hair.",
  "If you're ever down, come in here. I'll pour you a grog and tell you about the time I sank. You'll feel much better about yourself.",
  "I've had a sign made: 'No monsters'. Last week a monster came in and asked if it was a joke. It was. We had a laugh. It tipped well.",
  "My tab system is very simple. You drink, I write it down, I lose the book, I start again. Everybody's even.",
  "Darts board's crooked. Has been for forty years. Everyone's adjusted. If I straighten it, nobody'll hit anything.",
  "I put a 'Back in five minutes' sign up in 1998. Haven't been anywhere. Just like the sign.",
  "Don't sit on that stool, it wobbles. Don't sit on that one, Old Tom's on it. Sit on that one. Lovely. That's the cat.",
  "I've been working on a new cocktail. It's rum. With rum on top. I call it the Board Meeting.",
  "Gary asked if he could put his newspaper on the bar. I said only if someone reads it. It's been there three weeks. Admiral sleeps on it.",
  "Every captain who comes in here asks what's in the pie. Love, it's the sea. The whole sea. In a pie.",
  "Some nights I put my feet up, pour a rum and think about all the captains I've known. Then I remember their tabs and put the rum down.",
  "My cousin's a landlord in Doncaster. Says the fence came in last month. Wearing a moustache. Paid in chips."
 ],
 cocktail:[
  "Tonight's special: the Left On Read. Two shots, no chaser, nobody replies.",
  "New one: the Warm Lead. Hot rum, a bit of honey, and someone who actually wants to hear from you.",
  "The Retainer. Same drink every month, and you pay me on the first. My favourite.",
  "The Discovery Call. Half an hour of me asking questions and then pouring you something you didn't order.",
  "The Pipeline. It's a long glass. Mostly empty at the top. Lovely at the bottom.",
  "The Second Follow-Up. It's the first one, but I lean in and say 'just bumping this'."
 ],
 night:[
  "Late one, {here}? Me too. Well. Always. I live here. That door's my bedroom.",
  "Lamps are low, fire's going, Admiral's snoring. Best time of night, this.",
  "If you're still here at this hour, you've earned whatever's at the bottom of that bottle. Probably a crab.",
  "Old Tom gets chatty after midnight. I'd leave before he starts on his tab."
 ],
 storm:[
  "Hear that? Storm's in. Pull up a chair, the roof only leaks on the people I don't like.",
  "Weather like this, the kraken used to come in for a warm. Took up the whole room. Lovely company. Terrible tipper."
 ],
 fire:[
  "Warm your hands. Not too close, the fire's older than me and twice as grumpy.",
  "I put a log on. Well, a bit of an old ship. Same thing, sea's not fussy."
 ],
 switchIn:[
  "Oh, here's {other}! Act natural. {here}, stop telling me I'm your favourite.",
  "{other}'s in! Quick, hide the good crisps.",
  "Look who it is. {other}. {here} was just saying lovely things about you. I wasn't listening."
 ],
 chapters:[
  ["Did I tell you about the time I was a pirate? Briefly. Very briefly. Lunchtime.","I joined a pirate crew for one afternoon. They made me cook. I made fish pie. They mutinied. Over the pie.","They put me ashore on a desert island. It was this harbour. I walked home. Opened a tavern. Out of spite.","Moral of the story: if you're going to mutiny, make sure you're not on the same bus home."],
  ["I once had a parrot. Clever bird. Could say 'pay your tab'. Most useful thing I ever owned.","The parrot learned Gary's voice. Started squawking 'chips' at four in the morning. I had to rehome it.","It's in Pell's shop now. He's selling it as 'limited edition'. It says 'pay your tab' to Pell. I've never been prouder.","I visit sometimes. It still says 'pay your tab'. Pell's started paying it. It's the only creditor he's afraid of."],
  ["The kraken and me, part three. Our anniversary. I got her a ring. She wanted eight.","I got her seven more rings. She ate the ring box. And the jeweller. He's fine. He's in Portugal.","For our anniversary she took me to dinner. The dinner was a ship. I had the starter. A lifeboat.","We broke up over the washing up. Eight arms and she said she 'didn't have the time'. I'm still not over it."],
  ["I once entered a strongman contest. Event one: lift a barrel. I lifted it. It was empty. Nobody checked.","Event two: pull a boat. I pulled it. It was tied to the boat I was pulling. Went in a big circle.","Event three: arm wrestling. My opponent was the kraken. She let me win. I knew. Everyone knew. Lovely woman.","I came fourth. Out of three. Got a medal anyway. It's a beer mat. I wear it on special occasions."],
  ["Admiral turns fifteen this week. In cat years he's a hundred. In landlord years he's my boss.","I bought Admiral a cake. Fish cake. He sat on it. That's how cats say thank you.","Admiral caught a mouse for his birthday. Then let it go. Then caught it again. He's in sales, that cat.","Admiral's had his birthday. He's back in the till. Don't wake him. He takes a commission."],
  ["Old Tom. Let me tell you about Old Tom. Best customer I ever had. Never paid a penny.","Tom ran a tab for forty years. Biggest tab in the history of the sea. They wrote songs about it. Bad songs.","When Tom passed, I thought, well, that's the tab gone. Next morning, there he is. In the corner. Ghost. Ordering.","He still orders a grog every night. I pour it. He doesn't drink it. Still doesn't pay. We're very happy."],
  ["I had a band once. 'Bill and the Barnacles'. We were huge. In this pub. On Tuesdays.","I sang. Lenny did accordion. Fergus played a fish. Like a guitar. It was a big fish.","We got an offer from a record label. It was Pell. He wanted us to play on his barge for 'exposure'.","We split up over creative differences. Fergus wanted to play a different fish. You can't change the fish, Fergus."],
  ["Did I ever tell you how I met the wife? No? Good. Nobody's met the wife.","The wife and I met at sea. In fog. I've never actually seen her face. Lovely voice though.","The wife sends her love. I think. It might be the wind. Comes through that crack in the window.","I'm going to introduce you to the wife one day. Next Tuesday. Or the one after. She's very busy. Being mysterious."]
 ],
 barred:[
  "Gary's barred. Week off. You can see him at the window. Don't make eye contact, it encourages him.",
  "No gulls this week. Says so on the door. Gary's written 'except Gary' underneath. In crayon. He's still barred.",
  "Gary tried to come in disguised as a pigeon. I knew. The pigeon was wearing a hat.",
  "It's lovely and quiet without Gary. Too quiet. No. It's lovely. Shh, he's listening at the keyhole.",
  "Gary sent a letter. It says 'I'm sorry for what I absolutely didn't do'. I'm keeping it on the bar."
 ],
 party:[
  "Party! Drinks are on the house! Well. On the tab. Same thing. Different book.",
  "The whole town's here! Even Crab. He's under the table. He's always under something.",
  "Case solved and a party in my pub. Best night since the kraken left. Better. Less ink."
 ]
}
};
/* Characters that remember you. {key} is filled from real game data; {?key} means "only when this is true".
   A line is only used when every key in it is known. */
window.HL_CONTENT.lines.d9.remember={
 gary:[
  "Still thinking about {quiet}? {quietDays} days on read. I'd have sent a chip. Works on me.",
  "{quiet} hasn't replied in {quietDays} days. Maybe they're on a boat. Maybe they ARE a boat. Give them a nudge.",
  "Not to bring it up, but {quiet}. {quietDays} days. I'm bringing it up.",
  "I've put {quiet} in the Missing Persons column. {quietDays} days. Last seen: reading your message.",
  "Remember {won}? Client. CLIENT. I still read that headline to myself before bed.",
  "{won} signed with you and I've been insufferable about it ever since. You're welcome.",
  "Your best day is {best}. I've had it engraved. On a chip. Then I ate it. It lives in me now.",
  "{streak} days on the trot. I've started telling the pigeons you're my apprentice.",
  "You haven't opened my newspaper in {heraldGap} days. I've noticed. I'm not hurt. I'm a professional. I'm hurt.",
  "{heraldGap} days without reading the Herald. I wrote a whole column about you. It was lovely. You'll never know.",
  "Saw you bought the {bought}. Very nice. Very you. Can I borrow it? I'll give it back. I won't.",
  "The {bought} suits you. I'd know. I've got a mirror. It's a puddle.",
  "You caught a {fish}. I've told everyone I caught it. Nobody believes me. I'm a gull. It's literally my job.",
  "How's {pet}? Tell {pet} I said hello. Don't tell {pet} I ate their dinner.",
  "First DM at {early} yesterday. I was still asleep. Lying in bed. Well. Lying in a crisp packet.",
  "You did {yd} yesterday. I've circled it in the paper. With my beak. There's a hole in the paper now."
 ],
 bill:[
  "{here}! The usual? {drink}. That's {drinkN} now. I've named a stool after you. It's wobbly. Like you after the {drinkN}th.",
  "Don't tell me. {drink}? I've had it ready since you walked past the window.",
  "Your {drink}, my lovely. I don't even ask any more. It's like a marriage. The wife never asks either.",
  "Still no word from {quiet}? {quietDays} days. Their loss. I'll put a grog behind the bar for when they come round.",
  "{won}! I heard. The whole pub heard. I told them. Twice. Old Tom raised a glass. Through it, but still.",
  "You haven't been in for {tavernGap} days. Admiral's been sitting on your stool in protest. Well. He sits on every stool. But pointedly.",
  "{tavernGap} days! I thought you'd been eaten. Happened to a captain once. Kraken. Lovely woman. Bit bitey.",
  "Nice {bought}. Did Pell sell you that? Did he say 'limited edition'? Love. He's got nine.",
  "Heard you caught a {fish}. Bring it in. I'll put it in a pie. Not that pie. That pie's for decoration.",
  "Best day of {best}? I tell that story more than the kraken one. I tell it better, too. In my version you did it in a storm.",
  "{streak} days in a row, {here}. My nan would have liked you. She liked anyone who turned up. Rare quality."
 ],
 pell:[
  "Pell remembers you. Pell remembers you never buy hats. Pell has brought hats. Pell is a patient man.{?hatless}",
  "Ah, the captain who bought the {bought}! Pell knew you had taste. Pell also has its cousin. Limited edition.",
  "Captain! Pell saw you at the shop. Buying the {bought}. From the shop. Not from Pell. Pell is fine. Pell is wounded."
 ],
 nell:[
  "I heard {won} signed up with you. I've told everyone. Twice. I'll tell them again tomorrow.",
  "Lovely {fish} you caught. I told Fergus. He's sulking. Says it was his fish first.",
  "My cousin knows someone at {quiet}. Says they've been very busy. Says they 'meant to reply'. They all mean to, love."
 ],
 crab:[
  "{quiet} hasn't replied in {quietDays} days. I've been waiting for a chip for {chip}. Welcome to my world.",
  "You did {yd} DMs yesterday. I did nothing. We're both very good at what we do."
 ]
};
/* The town passes on what the other captain has been up to. */
window.HL_CONTENT.lines.d9.gossip={
 gary:[
  "Between you and me, {o} was in before {oFirst} this morning. I know. I was up. Not working. Watching.",
  "{o} has done {oDms} already. I'm not saying anything. I'm saying it in the Herald.",
  "{o} caught a {oFish}. Showed everyone. Twice. I've got the photos. I'm in all of them. In front.",
  "{o} bought the {oBought}. Between us? It's a bit much. Don't tell them I said. I've told them you said.",
  "{o} was still sending DMs at {oLast} last night. I know because I was eating their supper.",
  "{o}'s on a {oStreak}-day streak. I'm not jealous on your behalf. I am. A bit. Go on.",
  "{o} hasn't fired a cannon yet today. Probably 'strategising'. Like me. I'm strategising this chip.{?oQuietToday}",
  "{o}'s ahead today. Not by much. By a gull's beak. A long gull. Me.{?oFaster}",
  "You're ahead of {o} today. I've told them. Kindly. Through a megaphone.{?meFaster}",
  "{o} signed {oWon}. I've written a headline. It's a bit long. Mostly exclamation marks."
 ],
 bill:[
  "{o} was in earlier. Had a {oDrink}. Said it was for 'focus'. Focused on the bottom of the glass, I'd say.",
  "{o} was in here at lunch telling me they'd done {oDms}. I said {here}'ll beat that before teatime. Don't make me a liar.",
  "Don't tell {o} I told you, but they were in at {oFirst} this morning. In my pub. Before me. I live here.",
  "{o} came in showing off a {oFish}. I said very nice. Then I asked for it for the pie. They ran.",
  "{o} bought a {oBought}. Wore it in here. Admiral hissed at it. I'm not saying Admiral's right. Admiral's always right.",
  "{o} did {oYd} yesterday. Told me twice. Third time I charged them for the story.",
  "{o}'s on a {oStreak}-day run. I've started a book on it. Odds are good. On you catching up.",
  "{o} hasn't been in all day. Haven't sent a cannonball either. Gone fishing, I reckon. Or gone to Doncaster.{?oQuietToday}",
  "{o} signed {oWon}! Bought a round on the strength of it. Well. Said they would. I've added it to their tab.",
  "{o} was in till late last night. Last DM at {oLast}, they said. I said go home. They said 'one more'. Proper sailor."
 ],
 nell:[
  "Saw {o} at the harbour this morning. {oFirst}, it was. Up with the gulls. Well. Up with Gary. Gary's not really a morning gull.",
  "{o} told Fergus they'd done {oDms} already. Fergus told me. Now I'm telling you. That's how it works, love.",
  "{o} bought a {oBought}. Everyone's talking about it. Well. I'm talking about it. Loudly.",
  "I knitted {o} a scarf for their {oStreak}-day streak. I'll knit you one too. Get going."
 ],
 crab:[
  "{o} walked past my rock at {oFirst}. Didn't say hello. Did send a DM. I respect it.",
  "{o} caught a {oFish}. Big deal. I've been a crab my whole life. Nobody throws me a party."
 ],
 fergus:[
  "{o} caught a {oFish}! Reel-y impressive. Shame it wasn't from my stall. I'd have charged them.",
  "{o} says they're on a {oStreak}-day streak. That's a fin-tastic run. I'll stop. I won't stop."
 ],
 pike:[
  "{o} handed in {oDms} DMs before lunch. I've given them a gold star. Yours is in the post. Conditional.",
  "{o} did {oYd} yesterday. I've written 'good effort'. I write that on everything. It's very motivating."
 ],
 lenny:[
  "{o} was sending DMs at {oLast} last night. Saw the phone glow from the lamp room. Thought it was a ship. Nearly guided them in.",
  "Gary told me {o} is ahead today. Gary tells me a lot of things. Usually about chips. This one checked out.{?oFaster}"
 ]
};
/* The monthly mystery. Clues come out through the case, one at a time. Both captains vote near the end.
   Right: a party, doubloons and XP. Wrong: Gary is barred from the Rusty Anchor for a week. */
window.HL_CONTENT.lines.d9.cases=[
{id:'fence',start:'2026-11-24',end:'2026-12-31',title:'Who is the fence?',
 intro:"Somebody has been running the Black Market at night. They're what the old sailors call a fence: someone who buys and sells stolen and 'found' goods, no questions asked. They wear a new disguise every week. Hobbs the harbourmaster wants a name by New Year.",
 suspects:[{id:'gary',name:'Gary the gull',bio:"Editor in Chief of the Herald. Says he's never been to the Black Market. Owns a lot of hats for a gull who's never been to the Black Market."},
  {id:'pell',name:'Pell',bio:"Travelling merchant. Calls the fence 'a hobbyist'. Has nine of everything."},
  {id:'crab',name:'Crab',bio:"Lives under the jetty. Out at night. Says he's 'resting sideways'."},
  {id:'admiral',name:'Admiral the cat',bio:"Bill's cat. Catches things, lets them go, catches them again. In sales."},
  {id:'nell',name:'Nell',bio:"Mends the nets. Knows everyone's business. Possibly too well."},
  {id:'hobbs',name:'Hobbs the harbourmaster',bio:"Holds every key in the harbour. Names every new building Gary. Suspiciously keen on Gary."}],
 culprit:'gary',
 clues:[
  ['hobbs',"Notice from the harbourmaster: the Black Market has been open every night this month. The seller wears a disguise. I want a name by New Year. Signed, Hobbs."],
  ['bill',"The fence came in for a grog last night. Paid in chips. Cold chips. I'm not saying a name. I'm saying 'chips'."],
  ['nell',"I saw the fence leave the market at midnight. Didn't walk. Flew. Pell can't fly, love. I checked. I pushed him off his barge."],
  ['crab',"Sir, I was not at the Black Market. I was under my rock. My alibi is the rock. The rock will confirm. Signed, Crab."],
  ['lenny',"Somebody's been coming back into the lighthouse at two in the morning. Through the window. Wearing a moustache."],
  ['fergus',"Someone bought eleven fake moustaches off my stall this month. Paid with a painted pebble. Said it was a chip."],
  ['bill',"Admiral's slept in the till every night this month. I've got cat hair on every receipt to prove it. Whoever the fence is, it isn't my boy."],
  ['pike',"I've compared the Black Market price tags with the Herald. Both spell 'doubloon' with three o's. Spelling: C minus. Evidence: A plus."],
  ['pell',"Pell is not the fence. A fence would undercut Pell's prices. Nobody undercuts Pell. That is what upsets Pell most."],
  ['nell',"Hobbs has been at choir every evening this month. I sit next to him. He's flat, but he's present."],
  ['gary',"For the record, I was at my mum's every night this month. Ask her. Actually, don't ask her. She's very busy."],
  ['crab',"Sir, I have counted the chips under the Black Market stall. Forty-one. The exact number Gary reported 'lost' in the Herald. Signed, Crab."],
  ['lenny',"Found a box under Gary's nest. A false beard, a tiny hat and a sign: 'THE FENCE: BACK IN 5 MINS'. I've put it back. I'm frightened of him."],
  ['mum',"Dear Herald, Gary has not been to mine this month. Gary has not been to mine since August. Gary, ring your mother. Love, Mum."],
  ['bill',"Nell's been in here every night knitting. Eight-sleeved jumper. She's in the clear. Unless the fence is a jumper."],
  ['fergus',"Crab was at the market once, mind. Bought a tiny hat. For his rock. Very proud of it. Wears it on Sundays."],
  ['gary',"I'd like to point out the fence is clearly a gull of my size, build and beak shape. That narrows it down to millions of gulls. Doncaster's full of them."],
  ['hobbs',"Votes in by 31 December, captains. Get it right and the town's throwing a party. Get it wrong and Bill bans whoever he likes. It'll be Gary."]],
 right:"It was Gary. Of course it was Gary. Hobbs found forty-one chips, eleven moustaches and the 'back in 5 mins' sign under the nest. Gary has confessed, then said it was 'his cousin Barry', then confessed again.",
 wrong:"You said {vote}. It was Gary. Everyone knew. Even Gary knew. Gary is barred from the Rusty Anchor for a week anyway, because Bill always blames Gary.",
 garyRight:"Fine. FINE. It was me. I was providing a service. A very discreet, chip-based service. I'd like it noted I was excellent at it.",
 garyWrong:"Ha! They picked {vote}! I'm free! Wait. Why am I barred? Bill, I wasn't even caught!"},
{id:'chip',start:'2027-01-01',end:'2027-01-31',title:'The Great Chip Heist',
 intro:"After eighty days, Gary finally paid Crab his chip. One chip, on a doily, left by Crab's rock. By morning it was gone. Crab wants justice. Crab also wants a chip.",
 suspects:[{id:'gary',name:'Gary the gull',bio:"Paid the chip. Watched the chip. Loves chips more than freedom."},
  {id:'admiral',name:'Admiral the cat',bio:"Bill's cat. Out every night. In sales."},
  {id:'pigeons',name:'The pigeon builders',bio:"Gary's renovation crew. Paid in crumbs. Recently unionised."},
  {id:'crumb',name:'Mrs Crumb, the baker',bio:"Started selling chips to compete with nobody. A rival operation?"},
  {id:'fergus',name:'Fergus the fishmonger',bio:"Sells fish suppers. Chips are half his business."},
  {id:'bill',name:'Barnacle Bill',bio:"Needs money. Always. Could a famous chip pay off Big Steve the tab?"}],
 culprit:'admiral',
 clues:[
  ['crab',"Sir, my chip has been stolen. It was on a doily. The doily is also gone. I want both back. Mostly the chip. Signed, Crab."],
  ['gary',"I didn't take it. I'd like that on the front page. I'd also like a chip. Not that one. Any one."],
  ['lenny',"Gary was in the lighthouse all night. I know. He snores. In chips. It's a sort of crunchy whistle."],
  ['crumb',"I don't sell chips any more. I sell 'potato fingers'. Totally different. Nobody buys those either."],
  ['nell',"There were little paw prints on the jetty that morning. Four paws. Tail drag. And a doily thread."],
  ['bill',"Admiral came home at dawn looking very pleased with himself. He always looks pleased with himself. This was extra."],
  ['fergus',"I count my chips every night. Two hundred and twelve. All present. I don't need one with a crab's name on it."],
  ['pell',"Pell bought a chip this week. A rare chip. A chip with history. Pell paid a fair price. To a cat."],
  ['pike',"The pigeons were on strike that night. Picket line by the bakery. I took the register. All present, all grumpy."],
  ['bill',"The tab's still the tab, Big Steve's still Big Steve. I'd never steal a chip. I'd sell a story about one. Different thing."],
  ['crab',"Sir, I have seen the chip. In Pell's window. Labelled 'Limited edition: The Crab Chip'. There are nine. Signed, Crab."],
  ['nell',"Admiral had a doily round his neck at choir. Wore it like a little ruff. Very dashing. Very guilty."],
  ['hobbs',"Votes in by the end of January, captains. Crab's demanding a public trial. I've said no. He's sitting on my foot."]],
 right:"It was Admiral. He caught the chip, let it go, caught it again, then sold it to Pell. Pell has returned it to Crab, labelled 'Limited edition', and is selling the other eight.",
 wrong:"You said {vote}. It was Admiral the cat, in sales as ever. Bill is outraged. Bill bars Gary for a week, because Admiral is family.",
 garyRight:"Told you. It was the cat. It's always the cat. Except when it's me. This time it wasn't me. Mark the date.",
 garyWrong:"Barred? For a CAT crime? I'm writing to my MP. I don't know who my MP is. I'm writing to Crab."},
{id:'letters',start:'2027-02-01',end:'2027-02-28',title:'Who is sending Bill love letters?',
 intro:"Every morning this month, a love letter has been pushed under the Rusty Anchor's door. Damp. Smudged. Signed only 'Your Biggest Admirer'. Bill is beside himself. Bill would like to know who to buy a drink for.",
 suspects:[{id:'nell',name:'Nell',bio:"Knits Bill a scarf every Christmas. Very long scarves."},
  {id:'crumb',name:'Mrs Crumb, the baker',bio:"Brings Bill a free bun every Friday. Nobody gets free buns."},
  {id:'pike',name:'Miss Pike',bio:"Corrects Bill's spelling on the chalkboard. Fondly?"},
  {id:'brynsmum',name:"Bryn's Mum",bio:"Comes in for a sherry. Says nothing. Says everything."},
  {id:'kraken',name:'The kraken',bio:"Bill's ex. Lovely arms. Lives somewhere very deep."},
  {id:'gary',name:'Gary the gull',bio:"Wants free crisps. Would write anything for free crisps."}],
 culprit:'kraken',
 clues:[
  ['bill',"Another letter this morning. 'Your Biggest Admirer'. Smudged. Smells of the sea. Everything smells of the sea, mind. It's the sea."],
  ['pike',"The handwriting's very large. Like someone writing with a whole arm. Spelling's lovely, though. B plus."],
  ['nell',"Not me, love. I'd sign it. I'd sign it three times and tell everyone in town."],
  ['gary',"It's not me. I'd have asked for crisps in the letter. There's no mention of crisps. Amateur."],
  ['lenny',"I saw something at the tavern door at four in the morning. Something with arms. More arms than you'd want."],
  ['crumb',"I bake Bill a bun because he's lonely, not because I'm in love with him. Write that down. Underline it. Don't show him."],
  ['bill',"Today's letter had eight kisses at the bottom. Eight. Not seven. Not nine. That's very specific, that."],
  ['fergus',"The letters are written in ink. Proper ink. Squid ink. Well. Bigger than squid. Much bigger."],
  ['hobbs',"Bryn's Mum was in Portugal all month. She sent a postcard. It just said 'No.' I think it's for you."],
  ['crab',"Sir, a very large tentacle moved my rock this morning to post something. Rude. Signed, Crab."],
  ['bill',"The letter today said 'Remember the washing up?' I've had to sit down. Only one person I know who never did the washing up."],
  ['nell',"There's ink all over the jetty. Lovely heart shape. Eight of them, actually."]],
 right:"It was the kraken. Bill's ex has been rising from the deep every night to post a letter with all eight arms. She'd like to meet for a drink. She'd still like him to do the washing up.",
 wrong:"You said {vote}. It was the kraken, with eight kisses and a lot of ink. Bill is too happy to be angry, so he bars Gary for a week out of habit.",
 garyRight:"The kraken! I knew it. I knew it by the ink. I write a newspaper. I'm basically an ink expert.",
 garyWrong:"I'm barred because Bill's ex is a sea monster? That's not my fault. Some of it's my fault. I printed her letters."},
{id:'light',start:'2027-03-01',end:'2027-03-31',title:'The light that keeps going out',
 intro:"Every night this month, the lighthouse has gone dark at exactly midnight. Ships are confused. Lenny is exhausted. Somebody is taking the bulbs.",
 suspects:[{id:'gary',name:'Gary the gull',bio:"Lives in the lighthouse. Uses the bulb as a ring light."},
  {id:'lenny',name:'Lenny',bio:"The keeper. Tired. Could he be doing it to get a night off?"},
  {id:'pigeons',name:'The pigeon builders',bio:"Gary's renovation crew. Unionised. Building something of their own."},
  {id:'oldtom',name:"Old Tom's ghost",bio:"The tavern ghost. Likes it dark. Still hasn't paid."},
  {id:'pell',name:'Pell',bio:"Sells bulbs. 'Limited edition' bulbs."},
  {id:'crab',name:'Crab',bio:"Hates bright lights. Prefers 'mood lighting'."}],
 culprit:'pigeons',
 clues:[
  ['lenny',"Third bulb gone this week. I've put a padlock on the lamp room. Someone's eaten the padlock. Well. Pecked it."],
  ['gary',"Not me. I've stopped doing photoshoots. Mostly. One a night. In my own light. Which is a candle. Which I can't light."],
  ['pell',"Pell has had a run on bulbs. Pell sold them all. Pell can't remember to whom. Pell remembers they paid in crumbs."],
  ['bill',"Old Tom's been sat in his corner every night. I can see him. Faintly. So it isn't him, unless he's doing it from here. He can't. He's very lazy for a ghost."],
  ['crab',"Sir, I would never steal a bulb. I'd steal the dark. I already have it. I live under a jetty. Signed, Crab."],
  ['nell',"Strange glow on the bakery roof at night. Like a little disco. Lots of cooing."],
  ['crumb',"The pigeons have built something on my roof. It's got a conservatory. It's got a light in it. It's lovely, to be fair."],
  ['pike',"I've seen a pigeon carrying a bulb. It did not look guilty. Pigeons never do. That's what makes them dangerous."],
  ['lenny',"Gary was with me at midnight. Complaining about the dark. If it was him, he's a very good actor. He isn't. I've seen his acting."],
  ['hobbs',"The pigeon union has filed for planning permission. 'Luxury nest, with feature lighting'. I've refused. They've ignored me."],
  ['gary',"My builders have been working nights. I didn't ask them to. I didn't pay them to. I thought they were just keen."],
  ['fergus',"Found a receipt in a pigeon's beak. 'Pell's Bulbs, nine for the price of nine'. Paid in crumbs."]],
 right:"It was the pigeon builders. They've built themselves a luxury nest on the bakery roof, lit by Lenny's bulbs. Mrs Crumb has started charging them rent. In crumbs. It's working.",
 wrong:"You said {vote}. It was the pigeons, building themselves a disco nest. Bill doesn't care who it was. Gary employs the pigeons, so Gary's barred.",
 garyRight:"My own builders! Betrayed by my workforce. I'm cutting their pay. To nothing. It was nothing. It's still nothing.",
 garyWrong:"Barred because MY pigeons were stealing? That's like barring a landlord because his tenants were rude. I am a landlord. Of pigeons. Fine."},
{id:'sandwich',start:'2027-04-01',end:'2027-04-30',title:"Who ate the harbourmaster's sandwich?",
 intro:"Every lunchtime this month, Hobbs has left a cheese and pickle sandwich on his desk. Every lunchtime it's vanished, leaving only crumbs and a tiny bite mark. Hobbs is furious. Hobbs is also hungry.",
 suspects:[{id:'gary',name:'Gary the gull',bio:"Has eaten every unattended sandwich since 2019."},
  {id:'admiral',name:'Admiral the cat',bio:"Fond of cheese. Fond of crime."},
  {id:'crab',name:'Crab',bio:"Still owed food by somebody. Possibly taking it from others."},
  {id:'fergus',name:'Fergus',bio:"Lunch neighbour. Only eats fish. Or does he?"},
  {id:'nell',name:'Nell',bio:"Always pops into the harbour office around lunchtime 'for a chat'."},
  {id:'hobbs',name:'Hobbs himself',bio:"Has been very sleepy after lunch lately."}],
 culprit:'hobbs',
 clues:[
  ['hobbs',"Gone again. Cheese and pickle. I'm putting up a camera. Lenny's lent me one. It's a drawing of a camera. It's a deterrent."],
  ['gary',"I'd love to say it was me. I wish it was me. It wasn't me. I was eating someone else's."],
  ['bill',"Admiral doesn't eat pickle. Can't stand it. Spits it out on the bar. So unless there's pickle on the floor, it's not my boy."],
  ['nell',"I pop in for a chat at twelve every day. Hobbs is always asleep by ten past. Snoring. With his mouth open. Crumbs everywhere."],
  ['crab',"Sir, the bite mark is far too big for a crab. I have measured it. With my claw. It is human-sized. Signed, Crab."],
  ['fergus',"I only eat fish. Fish fingers, fish pie, fish and chips. Pickle's a vegetable, mate. I don't touch it."],
  ['pike',"Hobbs fell asleep in my parents' evening. Woke up chewing. There wasn't any food. That's a habit, that is."],
  ['lenny',"Saw Hobbs on the jetty at midnight. Sleepwalking. Holding a sandwich. Eating it with his eyes shut."],
  ['gary',"I've checked the bite marks against my beak. Not a match. I'd remember. I'd have kept the receipt."],
  ['hobbs',"Strange thing. I keep waking up full. And I've got pickle on my moustache. I don't even like pickle."],
  ['crumb',"Hobbs bought three loaves this week. Three. For one sandwich a day. He's eating something in his sleep. Probably the loaves."],
  ['nell',"His wife says he sleepwalks to the fridge every night. She's had to put a bell on it. It's a ship's bell. Wakes the whole town."]],
 right:"It was Hobbs himself. He's been eating his own sandwich in his sleep, every lunchtime, then waking up furious and starving. He's now making two sandwiches. He eats both. In his sleep.",
 wrong:"You said {vote}. It was Hobbs, sleep-eating his own lunch. Nobody's angry with Hobbs. Somebody has to be barred, though. It's Gary.",
 garyRight:"He ate his own sandwich! In his sleep! That's my dream. That's literally my dream.",
 garyWrong:"Barred because the harbourmaster sleepwalks? Bill, I'm not even in this one!"},
{id:'ghost',start:'2027-05-01',end:'2027-05-31',title:'The ghost who wants his tab paid',
 intro:"Something has been haunting the Rusty Anchor, rattling chains and moaning 'pay... your... tab'. Customers have started paying up. Bill says it's Old Tom's ghost. Old Tom says it isn't. Which is odd, because Old Tom is the ghost.",
 suspects:[{id:'oldtom',name:"Old Tom's ghost",bio:"The tavern's actual ghost. Forty years unpaid. Hates paying, hates being blamed."},
  {id:'gary',name:'Gary the gull',bio:"Owns a bedsheet. Owns a lot of other people's bedsheets."},
  {id:'bill',name:'Barnacle Bill',bio:"Is owed a lot of tabs. A LOT of tabs."},
  {id:'lenny',name:'Lenny',bio:"Up all night anyway. Bored. Owns chains for the lighthouse."},
  {id:'pell',name:'Pell',bio:"Sells 'authentic ghost chains'. Nine sets."},
  {id:'brynsmum',name:"Bryn's Mum",bio:"Can make a jukebox play by looking at it. Frightening enough without a sheet."}],
 culprit:'bill',
 clues:[
  ['bill',"There's a ghost in my pub. A new one. Not Tom. Well. It might be Tom. Who's to say. Pay your tabs, by the way. Just a thought."],
  ['oldtom',"Wooo. It's not me. I don't do the chains. I'm a quiet ghost. I just sit and don't pay. Very traditional."],
  ['gary',"I was asked to haunt. I said no. I don't do unpaid work. I don't do paid work. I mostly do chips."],
  ['pell',"Pell sold one set of ghost chains this month. Big chains. For a big customer. Pell does not ask. Pell remembers he smelled of rum."],
  ['nell',"The ghost's very tall. Taller than Lenny. Wears a sheet. The sheet's got a pie stain on it."],
  ['lenny',"I've been in the lighthouse every night. My chains are all here. I counted. Gary's eaten one link. Otherwise fine."],
  ['crab',"Sir, the ghost trod on me. Very heavy ghost. Ghosts should be light. This one is not light. Signed, Crab."],
  ['pike',"The ghost said 'pay your tab' with a spelling mistake. Out loud. I don't know how. It said 'tabb'. Only one person in town writes 'tabb'."],
  ['hobbs',"Bryn's Mum was at choir every night. She doesn't need a sheet to frighten people. She proved it. To the choir."],
  ['fergus',"The ghost asked me for fish money. I said I don't drink there. It said 'well, start'. Very pushy ghost. Very landlord-y."],
  ['bill',"Big Steve the tab has been paid off! Mysteriously! By frightened customers! Isn't that lovely! Nobody look in my cupboard."],
  ['nell',"Admiral was curled up asleep inside the ghost. I saw his tail poking out the bottom of the sheet. He only sleeps on one person."]],
 right:"It was Bill. In a pie-stained bedsheet, with Pell's chains and Admiral asleep inside it, collecting forty years of tabs. Big Steve is paid off. Old Tom still hasn't paid.",
 wrong:"You said {vote}. It was Bill, in a sheet, collecting his own tabs. Bill has barred Gary for a week to change the subject.",
 garyRight:"Bill! In a sheet! Collecting tabs! I've never respected him more. I've never been more frightened of my tab.",
 garyWrong:"He bars ME? He was the ghost! This is a cover-up! I'm running it on the front page! He's barred me from the front page!"}
];
/* second helping */
(function(d){const add=(o,k,a)=>{o[k]=(o[k]||[]).concat(a);};
add(d.gary,'any',[
 "I've been voted Most Handsome Gull in the Herald's annual poll. I counted the votes. I cast the votes. Landslide.",
 "Lenny says the lighthouse isn't a hotel. I've left him a one-star review. 'No room service. Keeper sighs a lot.'",
 "I've hired an intern. It's a sparrow. Unpaid. Like me. Except I pay myself in your chips.",
 "Hobbs asked me to stop nesting on the harbour sign. I've added a second storey to it.",
 "Pell tried to sell me a 'limited edition' chip. It was a chip. I bought it. I'm not proud. I'm full.",
 "My horoscope says 'a stranger will offer you food'. I've been standing outside the bakery since six.",
 "I've been practising my 'serious journalist' face. It's the same as my normal face but I hold a pencil.",
 "Bill says the tavern's got a dress code. I've got feathers. That's a dress. That's literally a dress.",
 "Someone left a sandwich on the jetty with a note saying 'NOT FOR GARY'. Very rude. Very delicious.",
 "Fergus says fish don't have feelings. I've seen the {boss}'s face. It's got feelings. Mostly smug.",
 "I've been working on my 'caw'. It's more of a 'CAW'. Lenny says it's more of a 'please stop'.",
 "Admiral the cat and I have agreed a truce. He doesn't eat me, I don't print his photo. Everyone wins.",
 "The pigeons asked for a pension. I've given them a crust. To share. Over thirty years.",
 "I've started calling myself 'The Gull of Wall Street'. Nobody here knows what Wall Street is. That's the beauty of it.",
 "Mrs Crumb asked if I'd model for her bakery sign. I'm in it. Eating the sign. It's very authentic.",
 "Tried meditation. Sat very still. Thought about nothing. Then thought about chips. Then went and got chips. Enlightened.",
 "I've been asked to give a speech at the school. Topic: 'Hard Work'. I'm going to need a ghost writer. Old Tom's free.",
 "Lenny's put up a 'No Gulls' sign. I've put up a 'No Lennys' sign. It's my sign. On his door. Stalemate.",
 "Nell says I gossip too much. Nell. NELL. Says that. About me. I've got it all on tape. My tape's a shell.",
 "I once flew all the way to France. Ate a croissant. Flew back. Told nobody. Telling you now. Life-changing croissant.",
 "Breaking news from the Editor: there is no news. I've printed it anyway. Eight pages of no news. It's my best work.",
 "Pell says I owe him for the mirror I 'borrowed'. I've been looking in it a lot. I've been looking great.",
 "I've been doing some light investing. I've invested in a chip. It's appreciating. In my stomach.",
 "Bryn's Mum said 'morning, Gary' today. Just that. Two words. I've not slept since.",
 "I'm writing a strongly worded letter to the sea. It keeps being wet. I'll get a reply. The sea always writes back. Usually on my head."]);
add(d.gary,'poke',[
 "You again. Have you got nothing to do? There's a big button. It's lonely.",
 "I'll have you know I'm a protected species. By Lenny. Reluctantly.",
 "Poke me one more time and I'm telling Bill you're his least favourite. He already thinks it. I'll confirm it.",
 "That's my best side. All my sides are my best side.",
 "Please. I'm on deadline. Tomorrow's headline is 'GULL POKED'. Thanks for the story.",
 "If you're looking for the Editor, he's out. I'm his identical twin. Barry.",
 "Every time you poke me, a pigeon gets a pay rise. Don't. They'll get ideas.",
 "I bruise like a banana. A very handsome banana.",
 "Are you checking I'm real? I'm real. My debts are real. Ask Crab.",
 "Yes, hello, this is Gary, Editor, Gull, Icon. How can I avoid helping you today?"]);
d.gary.rough=[
 "Quiet one yesterday. Happens. Even I have days where I only steal one chip.",
 "Bad days are just good days with the volume down. Turn it up a bit today. Just a bit.",
 "No headline about yesterday. I've printed a picture of a nice boat instead. Everyone likes a nice boat.",
 "Yesterday's gone. I chased it. Couldn't catch it. Let's have today instead. Today's got chips.",
 "Between you and me, some of my best weeks started with a terrible Monday. And a stolen sandwich.",
 "Rough day? I've saved you the warm bit of the lighthouse rail. Don't tell Lenny. Just one DM, then see how it feels."];
add(d.bill,'any',[
 "I once sailed round the world. Well. Round the harbour. Well. I rowed to that buoy and back. Took all day. Felt like the world.",
 "The kraken left me this bar stool. Well. She left a tentacle print on it. I've never sat on it since. It's a shrine.",
 "If you see a mermaid in the bath, that's Nell. If you see a kraken in the bath, that's trouble. If you see Gary in the bath, call Hobbs.",
 "I used to have hair like a lion. Then I had hair like a sheep. Now I have hair like a rumour.",
 "I've been sober for forty years. Between the hours of two and three in the afternoon.",
 "The secret to a good grog? Love. And rum. Mostly rum. Love's expensive.",
 "Pell's tried to buy this pub. Offered me nine doubloons and a 'limited edition' bar towel. I've got a bar towel. It's this one. It's my shirt.",
 "Admiral's been on a diet. He's eating less fish. He's eating more of mine.",
 "There's a rule in this pub: no talking about work. Except DMs. And pipelines. And clients. Actually it's not much of a rule.",
 "Hobbs came in asking about noise complaints. I asked him who complained. He said the sea. The sea, Hobbs. The sea's louder than me.",
 "My dad was a landlord. His dad was a landlord. His dad was a barnacle. Long story. That's why they call me Barnacle.",
 "I used to arm wrestle sailors for drinks. Never lost. Never won either. Everyone just went home. Lovely evenings.",
 "Lenny came in for a quiet one. Gary followed him. Lenny left. Gary had Lenny's quiet one.",
 "You know you're a regular when I stop pretending the pie's not fish.",
 "Life's like a pint. It goes quicker than you'd like and there's always a gull eyeing up the last bit.",
 "I keep a little book of every captain's best day. Some captains have very short books. Not you. You've got a short story. Getting longer.",
 "That jukebox has three songs and one of them's just the sound of the kraken laughing. Lovely laugh. Terrifying.",
 "I once fell asleep behind this bar for three days. Nobody noticed. Old Tom served. Badly. Ghosts can't hold glasses.",
 "My lucky barnacle's on that beam. Been there since 1962. Every captain touches it for luck. Gary licked it. We had words.",
 "People ask me why I never retire. Where would I go? Portugal? The kraken's got a timeshare there. Awkward.",
 "Fergus wants to do a fish night. I said Fergus, every night's fish night. He cried. He's very passionate about fish.",
 "My philosophy's simple: pour a good drink, tell a bad story, never let Gary near the crisps.",
 "Mrs Crumb sends a bun on Fridays. I don't know why. I don't ask. I eat the bun. That's a friendship.",
 "If anyone asks, I've never heard of Doncaster. Nobody's ever heard of Doncaster. Lovely place, Doncaster.",
 "I asked the wife what she wanted for Christmas. She said 'to be met'. I don't know what she means.",
 "The fire's lit, the cat's asleep, the tab's long. That's a good night in my book. My book's the tab.",
 "There's a captain I tell about you. Lovely captain. Works hard. Always pays. Made her up. You could be her, though.",
 "We had a pirate in last week. Real one. Eye patch, parrot, the lot. Ordered a lemonade. Respect.",
 "My knees click when I bend. My back clicks when I stand. My jaw clicks when I talk. I'm basically a ship.",
 "When I go, I want my ashes scattered in the grog. Nobody'll notice. Might improve it."]);
add(d.bill,'alone',[
 "{here}! On your own? Lovely. {absent} was in earlier asking if you'd been in. I said no. Then I said yes. Then I hid.",
 "Here's my favourite. Don't tell anyone. Especially Admiral, he thinks it's him.",
 "{here}, I've told {absent} I'm saving this stool for royalty. That's you. Sit. Mind the spring. Royalty gets the spring.",
 "Quiet in here without {absent}. Lovely and quiet. Too quiet. No. Lovely.",
 "I said to {absent}, I said, {here}'s got a head for business. {absent} said what have I got. I said a lovely hat.",
 "Ah, {here}. Come and stand by the fire. {absent} stood here yesterday and the fire went out. Coincidence. Probably."]);
add(d.bill,'both',[
 "Both of you? In my pub? At the same time? I'll get the good glasses. We've got two. One's chipped. Fight for it.",
 "The A-Team! The whole crew! Sit down before Gary takes your seats. He's been sat on {here}'s for an hour.",
 "Right. You two. Arm wrestle for the tab. Winner pays. I like this game. I always win it."]);
add(d.bill,'gossip',[
 "Pell's started a loyalty card. Ten stamps, you get a free 'limited edition' item. He's only got one stamp. He uses it on himself.",
 "Crab's written to the council about the chip. Again. The council is Hobbs. Hobbs has framed the letters.",
 "Miss Pike gave the whole town detention. Nobody knows how. We all went. It was lovely, actually. Quiet.",
 "Gary's been seen in the next town over. Apparently they've got a better bin. He's 'researching'.",
 "Fergus had a fish named after him. Well. He named a fish after himself. He's very proud. The fish is called Fergus. It's dead.",
 "Lenny's been seen smiling. Gary's away for a day. That's the only time."]);
add(d.bill,'cocktail',[
 "The Cold Call. Ice. Ice. More ice. A slice of lemon that doesn't want to be there.",
 "The Close. Champagne and a handshake. I'll only make it when somebody earns it. I'm holding the bottle very hopefully.",
 "The Out Of Office. It's a deckchair and a rum. You can't have the deckchair. It's mine."]);
d.bill.rough=[
 "Rough one yesterday? Sit there. This one's on the house. Don't tell anyone. Don't tell Big Steve.",
 "Some days the sea's flat and nothing bites. Doesn't mean you're a bad sailor. Means it's the sea. Drink up.",
 "I've had worse days, love. I once lost a ship. Well. Misplaced. Still haven't found it. You'll find your day.",
 "Nobody gets a clean sheet every day. Not even Old Tom, and he's a ghost. Have a pie. It's fish. It's comforting fish.",
 "Quiet day? Quiet days are when the good ones are getting ready to reply. That's what my nan said. About pirates. Same thing."];
})(window.HL_CONTENT.lines.d9);
