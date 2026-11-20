/* ============================== SHIPYARD v2: patterned hulls, painted sails, new figureheads, fish gear ============================== */
const NEW_ITEMS=[
 // --- hulls ---
 {id:'hull_candy',name:'Candy Stripe Hull',cat:'hull',col:'#FFF4F6',col2:'#F2768F',pat:'candy',price:1800},
 {id:'hull_checker',name:'Harlequin Hull',cat:'hull',col:'#F4EFE4',col2:'#2E2B33',pat:'checker',price:2500},
 {id:'hull_tiger',name:'Tiger Shark Hull',cat:'hull',col:'#E8A04A',col2:'#B86A22',pat:'tiger',price:3500},
 {id:'hull_flames',name:'Hellfire Hull',cat:'hull',col:'#2A2024',col2:'#1A1418',pat:'flames',price:9000},
 {id:'hull_iron',name:'Iron Dreadnought',cat:'hull',col:'#6E7885',col2:'#555E6A',pat:'iron',price:15000},
 {id:'hull_royal',name:'Royal Flagship',cat:'hull',col:'#22306A',col2:'#182250',pat:'royal',gold:true,price:25000},
 {id:'hull_emerald',name:'Emerald Empress',cat:'hull',col:'#1F7A5A',col2:'#155A42',pat:'gems',gold:true,price:50000},
 {id:'hull_sharkskin',name:'Sharkskin Hull',cat:'hull',col:'#7E8C99',col2:'#6C7986',pat:'shark',desc:'Has opinions about swimmers.',earn:['fishSpecies',20,'Catch 20 different fish','species']},
 {id:'hull_scales',name:'Mermaid-Scale Hull',cat:'hull',col:'#3FA59A',col2:'#2F857C',pat:'scales',earn:['fishTotal',300,'Land 300 fish','fish']},
 {id:'hull_koi',name:'Koi Pond Hull',cat:'hull',col:'#FFF8EC',col2:'#F1E6D2',pat:'koi',earn:['fishSpecies',45,'Catch 45 different fish','species']},
 {id:'hull_angler',name:'Anglerfish Hull',cat:'hull',col:'#1F2233',col2:'#141624',pat:'glow',earn:['fishLegend',3,'Catch 3 different legendary or rarer fish','species']},
 {id:'hull_galaxy',name:'Galaxy Hull',cat:'hull',col:'#2A1F66',col2:'#1C1548',pat:'galaxy',earn:['fishTrans',1,'Catch a transcendent fish','caught']},
 {id:'hull_bone',name:'Bone Collector',cat:'hull',col:'#3A3640',col2:'#2A2730',pat:'bones',earn:['kill_ghostwell',3,'Sink Captain Ghostwell 3 times','sunk']},
 {id:'hull_storm',name:'Thunderhead Hull',cat:'hull',col:'#4A5670',col2:'#394359',pat:'lightning',earn:['kill_grumble',4,'Sink Grumblesquall 4 times','sunk']},
 {id:'hull_kraken',name:'Kraken-Hide Hull',cat:'hull',col:'#7A4BB8',col2:'#5E3794',pat:'suckers',earn:['vk_kraken',3,'Beat The Kraken on 3 Abyss voyages','beaten']},
 {id:'hull_weathered',name:'Old Faithful',cat:'hull',col:'#9A7B5C',col2:'#7C6148',pat:'weathered',desc:'Barnacles included.',earn:['activeDays',60,'Play on 60 different days','days']},
 {id:'hull_veteran',name:"Veteran's Teak",cat:'hull',col:'#B5763A',col2:'#93592A',pat:'planks',gold:true,earn:['weeks',12,'Sail in 12 different weeks','weeks']},
 // --- sails ---
 {id:'sail_hearts',name:'Lovebird Sails',cat:'sail',col:'#FFF4F6',col2:'#E0457B',pat:'hearts',price:1200},
 {id:'sail_checker',name:'Racing Chequers',cat:'sail',col:'#FFFFFF',col2:'#22232B',pat:'checker',price:1500},
 {id:'sail_tiger',name:'Tiger Sails',cat:'sail',col:'#F2A33A',col2:'#2E2B33',pat:'tiger',price:2800},
 {id:'sail_sun',name:'Rising Sun Sails',cat:'sail',col:'#FFFCF2',col2:'#E0453B',pat:'sun',price:3000},
 {id:'sail_waves',name:'Great Wave Sails',cat:'sail',col:'#F4EFE0',col2:'#2A5C9A',pat:'waves',price:4000},
 {id:'sail_flames',name:'Dragonfire Sails',cat:'sail',col:'#2A2024',col2:'#F2743A',pat:'flames',price:6000},
 {id:'sail_royal',name:'Royal Purple & Gold',cat:'sail',col:'#5B2A86',col2:'#F2C462',pat:'royal',price:20000},
 {id:'sail_aurora',name:'Aurora Silk',cat:'sail',col:'#16224A',col2:'#7CFFCB',pat:'aurora',price:40000},
 {id:'sail_net',name:'Fishing-Net Sails',cat:'sail',col:'#EDE3CC',col2:'#8A7A5A',pat:'net',earn:['fishSpecies',10,'Catch 10 different fish','species']},
 {id:'sail_scales',name:'Fishscale Sails',cat:'sail',col:'#BFE8E2',col2:'#3FA59A',pat:'scales',earn:['fishTotal',100,'Land 100 fish','fish']},
 {id:'sail_koi',name:'Koi Sails',cat:'sail',col:'#FFF8EC',col2:'#F2A33A',pat:'koi',earn:['fishSpecies',30,'Catch 30 different fish','species']},
 {id:'sail_jaws',name:'Shark-Jaw Sails',cat:'sail',col:'#7E8C99',col2:'#FFFFFF',pat:'jaws',earn:['fishWhoppers',10,'Land 10 Whoppers or bigger','whoppers']},
 {id:'sail_galaxy',name:'Nebula Sails',cat:'sail',col:'#2A1F66',col2:'#F0679A',pat:'galaxy',earn:['fishTrans',2,'Catch 2 different transcendent fish','species']},
 {id:'sail_tentacle',name:'Kraken Crest Sails',cat:'sail',col:'#F4EFE4',col2:'#7A4BB8',pat:'tentacle',earn:['kill_outofoffice',4,'Sink the Out-of-Office Octopus 4 times','sunk']},
 {id:'sail_lightning',name:'Stormcaller Sails',cat:'sail',col:'#3A4560',col2:'#FFE36A',pat:'lightning',earn:['kill_mondaymist',4,'Sink The Monday Mist 4 times','sunk']},
 {id:'sail_whale',name:'Golden Whale Sails',cat:'sail',col:'#1F3F6A',col2:'#F2C462',pat:'whale',earn:['kill_aurora',1,'Sink Aurelia, the Golden Whale','sunk']},
 {id:'sail_tattered',name:'Ghost Ship Rags',cat:'sail',col:'#C9D6D0',col2:'#7E9088',pat:'tattered',earn:['vk_locker',2,"Beat Davy Jones's Locker Room twice",'beaten']},
 {id:'sail_bones',name:'Crossbones Mainsail',cat:'sail',col:'#22232B',col2:'#F4EFE4',pat:'bones',earn:['finalBlows',30,'Land the final blow on 30 sea foes','final blows']},
 {id:'sail_compass',name:"Navigator's Sails",cat:'sail',col:'#F4E9CC',col2:'#8A4B2A',pat:'compass',earn:['bestStreak',15,'Reach a 15-day streak','days']},
 {id:'sail_tally',name:'Hundred-Day Canvas',cat:'sail',col:'#EDE3CC',col2:'#3F3A30',pat:'tally',desc:'One mark for every day at sea.',earn:['activeDays',100,'Play on 100 different days','days']},
 // --- figureheads ---
 {id:'fig_skull',name:'Grinning Skull',cat:'figure',st:'skull',price:5000},
 {id:'fig_narwhal',name:'Narwhal Tusk',cat:'figure',st:'narwhal',price:8000},
 {id:'fig_eagle',name:'Golden Eagle',cat:'figure',st:'eagle',price:12000},
 {id:'fig_phoenix',name:'Phoenix',cat:'figure',st:'phoenix',price:18000},
 {id:'fig_swordfish',name:'Swordfish Prow',cat:'figure',st:'swordfish',earn:['fishSpecies',15,'Catch 15 different fish','species']},
 {id:'fig_shark',name:'Great White',cat:'figure',st:'shark',earn:['fishWhoppers',5,'Land 5 Whoppers or bigger','whoppers']},
 {id:'fig_koi',name:'Leaping Koi',cat:'figure',st:'koi',earn:['fishVariants',3,'Catch 3 variant fish (Golden, Albino or Rainbow)','variants']},
 {id:'fig_angler',name:'Anglerfish Lantern',cat:'figure',st:'angler',earn:['fishLegend',1,'Catch a legendary or rarer fish','caught']},
 {id:'fig_goldfish',name:"The Kraken's Goldfish",cat:'figure',st:'goldfish',earn:['fishTrans',3,'Catch 3 different transcendent fish','species']},
 {id:'fig_ghost',name:'Wailing Ghost',cat:'figure',st:'ghost',earn:['kill_ghostwell',5,'Sink Captain Ghostwell 5 times','sunk']},
 {id:'fig_serpent',name:'Seenzone Serpent',cat:'figure',st:'serpent',earn:['kill_seenzone',5,'Sink The Seenzone Serpent 5 times','sunk']},
 {id:'fig_claw',name:'Barnacle Claw',cat:'figure',st:'claw',earn:['kill_budgetbeast',5,'Sink The Budget Barnacle Crab 5 times','sunk']},
 {id:'fig_trident',name:"Kraken-Slayer's Trident",cat:'figure',st:'trident',earn:['vk_kraken',5,'Beat The Kraken on 5 Abyss voyages','beaten']},
 {id:'fig_anchor',name:"Old Salt's Anchor",cat:'figure',st:'anchor',earn:['weeks',20,'Sail in 20 different weeks','weeks']},
 // --- flags ---
 {id:'flag_hook',name:'Hook & Line',cat:'flag',col:'#2A5C9A',sym:'hook',sc:'#FFFFFF',price:900},
 {id:'flag_crown2',name:"Pirate King's Colours",cat:'flag',col:'#5B2A86',sym:'crown',sc:'#F2C462',gold:true,price:15000},
 {id:'flag_fish',name:"Angler's Pennant",cat:'flag',col:'#3FA59A',sym:'fish',sc:'#FFFFFF',earn:['fishSpecies',5,'Catch 5 different fish','species']},
 {id:'flag_fin',name:'Fin Flag',cat:'flag',col:'#22232B',sym:'fin',sc:'#C9D2DC',earn:['fishWhoppers',3,'Land 3 Whoppers or bigger','whoppers']},
 {id:'flag_rumour',name:'The Rumour',cat:'flag',col:'#17181D',sym:'fish',sc:'#F2C462',gold:true,earn:['fishTrans',1,'Catch a transcendent fish','caught']},
 {id:'flag_veteran',name:'Thirty Days at Sea',cat:'flag',col:'#B92A3A',sym:'star',sc:'#F2C462',earn:['activeDays',30,'Play on 30 different days','days']},
 {id:'flag_krakenslayer',name:'Monster Hunter',cat:'flag',col:'#7A4BB8',sym:'kraken',sc:'#FFFFFF',earn:['vBoss',20,'Beat 20 voyage monsters','beaten']},
 // --- deck ---
 {id:'dk_harpoon',name:'Harpoon Gun',cat:'deck',st:'harpoon',price:2200},
 {id:'dk_hoard',name:'Deck Hoard',cat:'deck',st:'hoard',price:10000},
 {id:'dk_rods',name:'Fishing Rods',cat:'deck',st:'rods',earn:['fishTotal',25,'Land 25 fish','fish']},
 {id:'dk_net',name:'Full Net',cat:'deck',st:'net',earn:['fishTotal',150,'Land 150 fish','fish']},
 {id:'dk_trophy',name:'Mounted Whopper',cat:'deck',st:'trophy',earn:['fishWhoppers',1,'Land a Whopper or bigger','whoppers']},
 {id:'dk_tank',name:'Deck Aquarium',cat:'deck',st:'tank',earn:['fishSpecies',35,'Catch 35 different fish','species']},
 // --- hideout ---
 {id:'fishrack',name:'Drying Rack',cat:'decor',earn:['fishTotal',60,'Land 60 fish','fish']},
 {id:'aquarium',name:'Grand Aquarium',cat:'decor',desc:'Shows off your rarest catches.',earn:['fishSpecies',25,'Catch 25 different fish','species']},
];
NEW_ITEMS.forEach(i=>{ITEMS.push(i);ALL_ITEMS[i.id]=i;});
/* fishing achievements */
[['fish1','First Bite','Land your first fish','common','Fishing',['fishTotal',1]],['fish50','Fishmonger','Land 50 fish','uncommon','Fishing',['fishTotal',50]],['fish500','Trawler','Land 500 fish','rare','Fishing',['fishTotal',500]],['fish2000','Emptied the Sea','Land 2,000 fish','legendary','Fishing',['fishTotal',2000]],
 ['fsp10','Pond Life','Catch 10 different fish','common','Fishing',['fishSpecies',10]],['fsp40','Marine Biologist','Catch 40 different fish','rare','Fishing',['fishSpecies',40]],['fsp75','The Whole Aquarium','Catch 75 different fish','epic','Fishing',['fishSpecies',75]],['fsp100','Gotta Net Them All','Catch 100 different fish','mythic','Fishing',['fishSpecies',100]],
 ['fwhop','That Was THIS Big','Land a Whopper','uncommon','Fishing',['fishWhoppers',1]],['fwhop25','Fisherman\'s Tales','Land 25 Whoppers','epic','Fishing',['fishWhoppers',25]],['fvar','Odd One Out','Catch a variant fish','rare','Fishing',['fishVariants',1]],['fvar10','Shiny Hunter','Catch 10 different variants','legendary','Fishing',['fishVariants',10]],
 ['fleg','Legend of the Deep','Catch a legendary or rarer fish','epic','Fishing',['fishLegend',1]],['ftr','One in Thousands','Catch a transcendent fish','mythic','Fishing',['fishTrans',1]],['ftr5','The Rumours Were True','Catch 5 different transcendent fish','transcendent','Fishing',['fishTrans',5]]]
 .forEach(([id,name,desc,rar,cat,[metric,target]])=>{const a={id,name,desc,rar,cat,metric,target,secret:false};ACHIEVEMENTS.push(a);ACH_BY_ID[id]=a;});
Object.assign(ACH_GLYPH,{fishTotal:'fishg',fishSpecies:'fishg',fishWhoppers:'fishg',fishVariants:'gem',fishLegend:'fishg',fishTrans:'fishg'});
const _achGlyph7=achGlyph;achGlyph=function(c,g,col,acc){if(g!=='fishg')return _achGlyph7(c,g,col,acc);ell(c,1,0,7,4.4,col);poly(c,[[-5,0],[-10,-4],[-10,4]],col);poly(c,[[-1,-4],[2,-7.6],[4,-3.6]],col);disc(c,4.6,-1,1.1,acc);};

/* ---------- symbols ---------- */
function drawSymbol(c,sym,cx,cy,s,col){
  if(sym==='fish'){c.save();c.translate(cx,cy);c.scale(s,s);ell(c,.4,0,2.6,1.6,col);poly(c,[[-1.8,0],[-3.6,-1.5],[-3.6,1.5]],col);disc(c,1.6,-.4,.35,'rgba(0,0,0,.45)');c.restore();}
  else if(sym==='hook'){c.save();c.translate(cx,cy);c.scale(s,s);c.strokeStyle=col;c.lineWidth=.7;c.lineCap='round';c.beginPath();c.moveTo(.6,-3);c.lineTo(.6,1);c.arc(-.6,1,1.2,0,Math.PI);c.lineTo(-1.8,.2);c.stroke();disc(c,.6,-3,.55,col);c.restore();}
  else if(sym==='fin'){c.save();c.translate(cx,cy);c.scale(s,s);c.fillStyle=col;c.beginPath();c.moveTo(-2.6,2);c.quadraticCurveTo(-.6,-3.4,2,-3);c.quadraticCurveTo(.8,-.6,2.6,2);c.closePath();c.fill();c.strokeStyle=col;c.lineWidth=.4;c.beginPath();c.moveTo(-3.4,2.6);c.quadraticCurveTo(-1.7,1.8,0,2.6);c.quadraticCurveTo(1.7,3.4,3.4,2.6);c.stroke();c.restore();}
  else drawSymbolBase(c,sym,cx,cy,s,col);}

/* ---------- hull patterns (drawn inside the hull's outline: x -36..40, y -18..5) ---------- */
function hullPat(c,h,t){const P=h.pat,d=(x,y,r,col)=>disc(c,x,y,r,col);
  if(P==='candy'){c.save();c.rotate(-.5);for(let x=-60;x<60;x+=7)R(c,x,-40,3.4,80,h.col2);c.restore();}
  else if(P==='checker'){for(let y=-18;y<6;y+=4)for(let x=-40;x<44;x+=4)if(((x+40)/4+(y+18)/4)%2<1)R(c,x,y,4,4,h.col2);}
  else if(P==='tiger'){R(c,-40,-20,84,28,h.col);c.fillStyle='#3A2A1E';for(let i=0;i<11;i++){const x=-34+i*7;c.beginPath();c.moveTo(x,-18);c.quadraticCurveTo(x+3,-8,x-1.6,4);c.lineTo(x+.6,4);c.quadraticCurveTo(x+5.6,-8,x+2.6,-18);c.fill();}R(c,-40,0,84,6,'rgba(255,240,220,.35)');}
  else if(P==='flames'){for(let i=0;i<12;i++){const x=-36+i*6.6,hh=9+Math.sin(t/160+i*1.7)*2.6+(i%3)*2;c.fillStyle='#E0453B';c.beginPath();c.moveTo(x-3.6,6);c.quadraticCurveTo(x-4,-hh*.5,x+Math.sin(t/200+i)*1.4,-hh+5);c.quadraticCurveTo(x+4,-hh*.5,x+3.6,6);c.fill();c.fillStyle='#F9A63A';c.beginPath();c.moveTo(x-2.2,6);c.quadraticCurveTo(x-2.4,-hh*.3,x,-hh*.6+5);c.quadraticCurveTo(x+2.4,-hh*.3,x+2.2,6);c.fill();c.fillStyle='#FFE27A';c.beginPath();c.moveTo(x-1,6);c.quadraticCurveTo(x,-hh*.1,x+1,6);c.fill();}}
  else if(P==='iron'){c.strokeStyle='rgba(30,36,44,.55)';c.lineWidth=.5;for(let y=-18;y<6;y+=6){c.beginPath();c.moveTo(-40,y);c.lineTo(44,y);c.stroke();for(let x=-40+((y/6)%2?5:0);x<44;x+=10){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+6);c.stroke();d(x+1.6,y+1.6,.5,'#AEB8C4');d(x+8.4,y+4.4,.5,'#AEB8C4');}}R(c,-40,-18,84,2,'rgba(255,255,255,.18)');}
  else if(P==='royal'){R(c,-40,-6,84,1,'#F2C462');R(c,-40,2.4,84,.8,'#F2C462');c.strokeStyle='#F2C462';c.lineWidth=.6;c.beginPath();for(let x=-36;x<40;x+=8){c.moveTo(x,-10);c.quadraticCurveTo(x+2,-14,x+4,-10);c.quadraticCurveTo(x+6,-6.4,x+8,-10);}c.stroke();for(let x=-32;x<40;x+=8)d(x,-1.8,.9,'#F2C462');for(let x=-28;x<40;x+=16){c.save();c.translate(x,-1.8);c.rotate(Math.PI/4);R(c,-1.3,-1.3,2.6,2.6,'#F2C462');c.restore();}}
  else if(P==='gems'){R(c,-40,-8.6,84,5,'#F2C462');R(c,-40,-8.6,84,.7,'#FFF0B8');['#E0457B','#4A7EC2','#9B5DE5','#FFFFFF','#E0453B'].forEach((col,k)=>{for(let x=-30+k*3.2;x<40;x+=16){d(x,-6.1,1.5,col);d(x-.4,-6.6,.5,'rgba(255,255,255,.8)');}});c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=.4;for(let x=-36;x<40;x+=6){c.beginPath();c.arc(x,1,3,Math.PI,0);c.stroke();}}
  else if(P==='shark'){R(c,-40,-4,84,10,'#E9EEF2');for(let i=0;i<3;i++)line(c,14+i*2.6,-12,13+i*2.6,-6.4,'rgba(40,50,60,.5)',.6);d(31,-12,1.3,'#1F2630');d(31.3,-12.3,.4,'#fff');c.fillStyle='#B92A3A';c.beginPath();c.moveTo(22,-5.6);c.quadraticCurveTo(31,-2.6,39,-8);c.quadraticCurveTo(31,-5.6,22,-5.6);c.fill();for(let i=0;i<6;i++)poly(c,[[23+i*2.6,-5.6+i*.1],[24.2+i*2.6,-3.6],[25.4+i*2.6,-5.8-i*.2]],'#FFFFFF');}
  else if(P==='scales'){for(let r=0;r<5;r++)for(let i=0;i<16;i++){const x=-38+i*5.2+(r%2)*2.6,y=-15+r*4.4;c.strokeStyle=`rgba(255,255,255,${.3+.25*Math.sin(t/400+i+r)})`;c.lineWidth=.55;c.beginPath();c.arc(x,y,2.7,.15,Math.PI-.15);c.stroke();}R(c,-40,-18,84,3,'rgba(190,255,240,.25)');}
  else if(P==='koi'){[[-24,-10,6,'#F2A33A'],[-6,-2,7,'#E0653A'],[10,-12,5,'#F7C948'],[26,-4,6,'#F2A33A'],[-34,0,4,'#2E2B33'],[18,2,3,'#2E2B33']].forEach(([x,y,r,col])=>{d(x,y,r,col);d(x+r*.5,y+r*.3,r*.6,col);});}
  else if(P==='glow'){for(let i=0;i<18;i++){const x=-34+((i*41)%72),y=-15+((i*17)%18);const a=.4+.6*Math.abs(Math.sin(t/500+i*1.3));glowAt(c,x,y,3,'120,240,255',a*.8);d(x,y,.6,'#BFF4FF');}c.strokeStyle='rgba(120,240,255,.35)';c.lineWidth=.5;c.beginPath();c.moveTo(-36,-3);c.quadraticCurveTo(0,2,40,-6);c.stroke();}
  else if(P==='galaxy'){const g=c.createLinearGradient(-36,0,40,0);g.addColorStop(0,'#2A1F66');g.addColorStop(.5,'#7B4BD0');g.addColorStop(1,'#F0679A');c.fillStyle=g;c.fillRect(-40,-20,84,28);glowAt(c,-8+Math.sin(t/1500)*6,-8,14,'255,180,230',.4);for(let i=0;i<26;i++){c.globalAlpha=.35+.65*Math.abs(Math.sin(t/350+i));d(-36+((i*37)%76),-17+((i*23)%21),i%5?.4:.8,'#FFFFFF');}c.globalAlpha=1;}
  else if(P==='bones'){for(let x=-28;x<28;x+=7){c.strokeStyle='#E9E4D8';c.lineWidth=1.2;c.lineCap='round';c.beginPath();c.moveTo(x,-15);c.quadraticCurveTo(x+3,-6,x,3);c.stroke();}R(c,-36,-16.4,70,1.6,'#E9E4D8');d(32,-9,3.6,'#E9E4D8');d(30.8,-9.6,1,'#2A2730');d(33.4,-9.6,1,'#2A2730');R(c,31,-6.6,.6,1.6,'#2A2730');R(c,32.4,-6.6,.6,1.6,'#2A2730');}
  else if(P==='lightning'){const fl=Math.sin(t/300)>.8;if(fl)R(c,-40,-20,84,28,'rgba(255,240,170,.25)');c.fillStyle='#FFE36A';[[-30,0],[-6,1],[18,0]].forEach(([x])=>{c.beginPath();c.moveTo(x,-17);c.lineTo(x+6,-17);c.lineTo(x+2.6,-9);c.lineTo(x+7,-9);c.lineTo(x-1,4);c.lineTo(x+1,-5.6);c.lineTo(x-3,-5.6);c.closePath();c.fill();});for(let i=0;i<5;i++){d(-36+i*18,-13,3,'rgba(255,255,255,.12)');d(-33+i*18,-14.4,3.6,'rgba(255,255,255,.12)');}}
  else if(P==='suckers'){R(c,-40,-3,84,9,'#E9A8D0');for(let x=-34;x<40;x+=6){c.strokeStyle='#B86AA0';c.lineWidth=.6;c.beginPath();c.arc(x,1,1.7,0,TAU);c.stroke();d(x,1,.6,'#B86AA0');}for(let i=0;i<8;i++)d(-32+i*9+(i%2)*2,-11+(i%3)*2,1.4,'rgba(255,255,255,.14)');}
  else if(P==='weathered'){[[-30,-14,9,3],[-8,-8,12,3],[14,-14,10,3],[24,-2,9,3],[-22,0,10,3]].forEach(([x,y,w,hh])=>rr(c,x,y,w,hh,.6,'rgba(230,205,170,.5)'));for(let i=0;i<12;i++)d(-34+((i*29)%70),1+((i*7)%3),.9,'#DAD3C4');[[-12,2],[8,3],[28,1.6]].forEach(([x,y])=>ell(c,x,y,3,1.2,'#6FA65A'));for(let x=-34;x<40;x+=11)line(c,x,-17,x,4,'rgba(60,40,25,.25)',.4);}
  else if(P==='planks'){for(let y=-14;y<6;y+=4)line(c,-40,y,44,y,'rgba(70,40,20,.4)',.5);for(let y=-18;y<6;y+=4)for(let x=-36+(((y+18)/4)%2?6:0);x<42;x+=12){line(c,x,y,x,y+4,'rgba(70,40,20,.4)',.4);d(x+1.4,y+2,.5,'#F2C462');}R(c,-40,-18,84,1.6,'#F2C462');}
}

/* ---------- sail patterns ---------- */
const SAIL_PATS={
 hearts(c,s,x,y,w,h){for(let i=0;i<7;i++)drawSymbolBase(c,'heart',x+2+((i*47)%100)/100*(w-2),y+2+((i*61)%100)/100*(h-3),.55,s.col2);},
 checker(c,s,x,y,w,h){const q=3.2;for(let j=0;j*q<h+2;j++)for(let i=0;i*q<w+8;i++)if((i+j)%2)R(c,x-2+i*q,y-1+j*q,q,q,s.col2);},
 tiger(c,s,x,y,w,h){c.fillStyle=s.col2;for(let i=0;i<7;i++){const xx=x-2+i*w/5;c.beginPath();c.moveTo(xx,y-2);c.quadraticCurveTo(xx+3,y+h/2,xx-2,y+h+2);c.lineTo(xx,y+h+2);c.quadraticCurveTo(xx+5.6,y+h/2,xx+2,y-2);c.fill();}},
 sun(c,s,x,y,w,h,t,mk){const cx=x+w/2+1,cy=y+h*.62;c.fillStyle=s.col2;for(let i=0;i<9;i++){const a=Math.PI+i/8*Math.PI;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a-.09)*40,cy+Math.sin(a-.09)*40);c.lineTo(cx+Math.cos(a+.09)*40,cy+Math.sin(a+.09)*40);c.fill();}disc(c,cx,cy,Math.min(w,h)*.26,s.col2);},
 waves(c,s,x,y,w,h,t){R(c,x-3,y+h*.55,w+10,h,s.col2);for(let i=0;i<5;i++){const xx=x-2+i*(w+6)/4,yy=y+h*.55;c.fillStyle=s.col2;c.beginPath();c.moveTo(xx-4,yy+1);c.quadraticCurveTo(xx-1,yy-h*.42,xx+4,yy-h*.3);c.quadraticCurveTo(xx+1,yy-h*.2,xx+3,yy+1);c.fill();disc(c,xx+4,yy-h*.3,1.1,'#FFFFFF');disc(c,xx+2.4,yy-h*.36,.7,'#FFFFFF');}c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=.4;for(let j=0;j<3;j++){c.beginPath();for(let xx=x-3;xx<x+w+8;xx+=2)c.lineTo(xx,y+h*(.68+j*.11)+Math.sin(xx*.8+j)*.7);c.stroke();}},
 flames(c,s,x,y,w,h,t){for(let i=0;i<6;i++){const xx=x+i*(w+4)/5,hh=h*(.55+.2*Math.sin(t/170+i*1.9));[[s.col2,1],['#F9A63A',.7],['#FFE27A',.4]].forEach(([col,q])=>{c.fillStyle=col;c.beginPath();c.moveTo(xx-3.4*q,y+h+2);c.quadraticCurveTo(xx-3.6*q,y+h-hh*q*.5,xx+Math.sin(t/210+i)*1.2,y+h-hh*q);c.quadraticCurveTo(xx+3.6*q,y+h-hh*q*.5,xx+3.4*q,y+h+2);c.fill();});}},
 royal(c,s,x,y,w,h,t,mk,b){c.strokeStyle=s.col2;c.lineWidth=.8;c.strokeRect(x+1.4,y+1.4,w+b-1.6,h-2.8);for(let i=0;i<4;i++)disc(c,x+3+i*(w-4)/3,y+h-3.2,.6,s.col2);if(mk)drawSymbolBase(c,'crown',x+w/2+1,y+h/2-.6,Math.min(w,h)/7.4,s.col2);},
 aurora(c,s,x,y,w,h,t){for(let xx=x-3;xx<x+w+8;xx+=1.2){const k=Math.sin(xx/5+t/900),hh=h*(.45+.3*k);c.fillStyle=`hsla(${150+60*Math.sin(xx/9+t/1300)},90%,70%,.55)`;c.fillRect(xx,y+h*.2+k*2,1.3,hh);}for(let i=0;i<8;i++)disc(c,x+((i*37)%100)/100*w,y+((i*53)%100)/100*h*.5,.35,'#FFFFFF');},
 net(c,s,x,y,w,h,t,mk){c.strokeStyle=s.col2;c.lineWidth=.35;c.beginPath();for(let i=-h;i<w+h+8;i+=3.2){c.moveTo(x+i,y-2);c.lineTo(x+i+h+4,y+h+2);c.moveTo(x+i+h+4,y-2);c.lineTo(x+i,y+h+2);}c.stroke();if(mk)drawSymbol(c,'fish',x+w/2+1,y+h/2,Math.min(w,h)/7,'#3FA59A');},
 scales(c,s,x,y,w,h,t){for(let r=0;r*3<h+3;r++)for(let i=0;i*4<w+10;i++){c.strokeStyle=s.col2;c.globalAlpha=.5+.3*Math.sin(t/500+i+r);c.lineWidth=.5;c.beginPath();c.arc(x-2+i*4+(r%2)*2,y-1+r*3,2.1,.15,Math.PI-.15);c.stroke();}c.globalAlpha=1;},
 koi(c,s,x,y,w,h,t,mk){disc(c,x+w*.2,y+h*.25,h*.2,'#F2A33A');disc(c,x+w*.85,y+h*.75,h*.24,'#E0653A');disc(c,x+w*.7,y+h*.15,h*.12,'#F7C948');if(mk){c.save();c.translate(x+w/2+1,y+h/2);c.rotate(-.5);c.scale(Math.min(w,h)/22,Math.min(w,h)/22);FA.f_golden_koi(c,t);c.restore();}},
 jaws(c,s,x,y,w,h,t,mk,b){R(c,x-3,y+h*.22,w+12,h*.56,'#B92A3A');R(c,x-3,y+h*.32,w+12,h*.36,'#7A1622');const n=Math.max(4,Math.round(w/3.4)),q=(w+b+2)/n;for(let i=0;i<n;i++){poly(c,[[x+i*q,y+h*.22],[x+(i+.5)*q,y+h*.46],[x+(i+1)*q,y+h*.22]],s.col2);poly(c,[[x+i*q,y+h*.78],[x+(i+.5)*q,y+h*.56],[x+(i+1)*q,y+h*.78]],s.col2);}},
 galaxy(c,s,x,y,w,h,t){const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#2A1F66');g.addColorStop(.55,'#7B4BD0');g.addColorStop(1,s.col2);c.fillStyle=g;c.fillRect(x-3,y-3,w+12,h+6);glowAt(c,x+w*.6,y+h*.4,h*.5,'255,190,235',.45);for(let i=0;i<14;i++){c.globalAlpha=.35+.65*Math.abs(Math.sin(t/330+i));disc(c,x+((i*37)%100)/100*(w+4),y+((i*53)%100)/100*h,i%4?.35:.7,'#FFFFFF');}c.globalAlpha=1;},
 tentacle(c,s,x,y,w,h,t,mk){for(let i=0;i<3;i++)R(c,x-3,y+h*(.12+i*.34),w+12,h*.07,'rgba(122,75,184,.3)');if(mk)drawSymbolBase(c,'kraken',x+w/2+1,y+h/2,Math.min(w,h)/7,s.col2);},
 lightning(c,s,x,y,w,h,t,mk){if(Math.sin(t/260)>.85){c.fillStyle='rgba(255,240,170,.3)';c.fillRect(x-3,y-3,w+12,h+6);}c.fillStyle=s.col2;const cx=x+w/2+1;c.beginPath();c.moveTo(cx+1,y+1);c.lineTo(cx+5,y+1);c.lineTo(cx+1.6,y+h*.45);c.lineTo(cx+4.6,y+h*.45);c.lineTo(cx-3,y+h-1);c.lineTo(cx-.6,y+h*.58);c.lineTo(cx-3.6,y+h*.58);c.closePath();c.fill();},
 whale(c,s,x,y,w,h,t,mk,b){R(c,x-3,y+h-2.4,w+12,1.2,s.col2);R(c,x-3,y+1.2,w+12,.8,s.col2);if(mk){const cx=x+w/2+1,cy=y+h*.56,k=Math.min(w,h)/12;c.fillStyle=s.col2;c.beginPath();c.moveTo(cx,cy+4*k);c.quadraticCurveTo(cx-1.2*k,cy,cx-5*k,cy-3.4*k);c.quadraticCurveTo(cx-2.4*k,cy-3.6*k,cx,cy-1.4*k);c.quadraticCurveTo(cx+2.4*k,cy-3.6*k,cx+5*k,cy-3.4*k);c.quadraticCurveTo(cx+1.2*k,cy,cx,cy+4*k);c.fill();}},
 tattered(c,s,x,y,w,h,t){c.strokeStyle=s.col2;c.lineWidth=.6;c.lineJoin='round';for(let i=0;i<4;i++){const xx=x+2+((i*43)%100)/100*(w-3),yy=y+2+((i*67)%100)/100*(h-6);c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+1.4,yy+2.4);c.lineTo(xx-.6,yy+4);c.lineTo(xx+1,yy+6.4);c.stroke();}for(let i=0;i<6;i++){const xx=x+i*(w+3)/5;poly(c,[[xx-1.6,y+h+2],[xx,y+h-2.6-(i%2)*1.6],[xx+1.6,y+h+2]],'rgba(60,80,76,.4)');}rr(c,x+w*.55,y+h*.3,w*.22,h*.24,.5,'rgba(126,144,136,.55)');},
 bones(c,s,x,y,w,h,t,mk){if(mk)drawSymbolBase(c,'skull',x+w/2+1,y+h/2,Math.min(w,h)/7.4,s.col2);else{line(c,x+2,y+2,x+w-1,y+h-2,s.col2,.9);line(c,x+w-1,y+2,x+2,y+h-2,s.col2,.9);}},
 compass(c,s,x,y,w,h,t,mk){if(!mk){line(c,x+1,y+h/2,x+w+2,y+h/2,'rgba(138,75,42,.3)',.4);return;}const cx=x+w/2+1,cy=y+h/2,r=Math.min(w,h)*.4;c.strokeStyle=s.col2;c.lineWidth=.5;c.beginPath();c.arc(cx,cy,r,0,TAU);c.stroke();for(let i=0;i<8;i++){const a=i/8*TAU,rr2=i%2?r*.55:r*1.05;poly(c,[[cx+Math.cos(a)*rr2,cy+Math.sin(a)*rr2],[cx+Math.cos(a+1.2)*r*.16,cy+Math.sin(a+1.2)*r*.16],[cx+Math.cos(a-1.2)*r*.16,cy+Math.sin(a-1.2)*r*.16]],i%4?s.col2:'#E0453B');}disc(c,cx,cy,.8,s.col2);},
 tally(c,s,x,y,w,h){c.strokeStyle=s.col2;c.lineWidth=.45;c.lineCap='round';for(let r=0;r*5.4<h-3;r++)for(let g=0;g*7.4<w-3;g++){const gx=x+2+g*7.4,gy=y+2+r*5.4;c.beginPath();for(let i=0;i<4;i++){c.moveTo(gx+i*1.2,gy);c.lineTo(gx+i*1.2,gy+3.4);}c.moveTo(gx-.8,gy+2.8);c.lineTo(gx+4.4,gy+.6);c.stroke();}},
};

/* ---------- figureheads ---------- */
function drawFigure(c,x,y,fid){const f=it(fid);if(!f)return;const st=f.st,t=performance.now();
  if(st==='skull'){disc(c,x+2.6,y-3.4,2.6,'#EDE7DA');rr(c,x+1.4,y-1.6,2.6,1.8,.5,'#EDE7DA');disc(c,x+1.8,y-3.8,.75,'#2A2730');disc(c,x+3.6,y-3.8,.75,'#2A2730');R(c,x+1.9,y-1.2,.4,1.2,'#2A2730');R(c,x+2.9,y-1.2,.4,1.2,'#2A2730');}
  else if(st==='narwhal'){ell(c,x+1.6,y-2.4,2.6,2,'#DCE8F2');line(c,x+3.4,y-3.2,x+10,y-7,'#FFF8E6',.9);for(let i=1;i<5;i++)line(c,x+3.4+i*1.3,y-3.6-i*.76,x+3.9+i*1.3,y-3.1-i*.76,'#C9B88F',.3);disc(c,x+2.4,y-2.8,.35,'#2E2A26');}
  else if(st==='eagle'){ell(c,x+2,y-2.6,2.6,3,'#C98A2A');disc(c,x+3,y-4.4,2,'#F2C462');poly(c,[[x+4.4,y-4.8],[x+7,y-4],[x+4.6,y-3.2]],'#E8A23A');disc(c,x+3.6,y-4.8,.4,'#2E2A26');poly(c,[[x,y-3],[x-2.4,y-6.4],[x+1.4,y-4.6]],'#C98A2A');}
  else if(st==='phoenix'){lamp(c,x+3,y-4,7,.5,'255,150,60');for(let i=0;i<3;i++)poly(c,[[x+.6+i*1.2,y-5],[x+1.2+i*1.2,y-8.6-Math.sin(t/120+i)*1.2],[x+2+i*1.2,y-5]],i%2?'#FFD27A':'#F2743A');ell(c,x+2,y-2.4,2.4,3,'#E0453B');disc(c,x+3.2,y-4.4,1.8,'#F2743A');poly(c,[[x+4.6,y-4.8],[x+6.8,y-4.2],[x+4.6,y-3.4]],'#F7C948');disc(c,x+3.6,y-4.8,.4,'#2E2A26');}
  else if(st==='swordfish'){ell(c,x+1.6,y-2.6,2.8,1.8,'#3E6FD0');poly(c,[[x,y-4],[x+1.6,y-7.4],[x+3,y-4]],'#2A56B0');line(c,x+3.6,y-2.8,x+11,y-4.6,'#3E6FD0',.8);disc(c,x+2.6,y-3,.4,'#fff');}
  else if(st==='shark'){c.fillStyle='#7E8C99';c.beginPath();c.moveTo(x-1,y-1);c.quadraticCurveTo(x+2,y-7,x+8,y-4);c.quadraticCurveTo(x+4,y-2.6,x+1,y+1);c.closePath();c.fill();c.fillStyle='#B92A3A';c.beginPath();c.moveTo(x+3.4,y-2.6);c.lineTo(x+7.6,y-3.8);c.lineTo(x+4.6,y-1.6);c.fill();for(let i=0;i<3;i++)poly(c,[[x+4+i*1.1,y-2.9-i*.3],[x+4.5+i*1.1,y-1.9-i*.3],[x+5+i*1.1,y-3.2-i*.3]],'#fff');disc(c,x+4,y-4.6,.45,'#1F2630');poly(c,[[x+.6,y-4.6],[x+1,y-8],[x+3,y-5.4]],'#6C7986');}
  else if(st==='koi'){c.save();c.translate(x+3,y-4);c.rotate(-.7+Math.sin(t/500)*.08);c.scale(.5,.5);FA.f_golden_koi(c,t);c.restore();}
  else if(st==='angler'){ell(c,x+2,y-2,2.8,2.6,'#1F2233');disc(c,x+3,y-2.6,.6,'#BFF4FF');c.strokeStyle='#3A4060';c.lineWidth=.45;c.beginPath();c.moveTo(x+2,y-4.4);c.quadraticCurveTo(x+3,y-9,x+7,y-7.4);c.stroke();const a=.7+.3*Math.sin(t/220);lamp(c,x+7,y-7.4,6,a*.9,'150,240,255');disc(c,x+7,y-7.4,.9,'#DFFBFF');for(let i=0;i<3;i++)poly(c,[[x+3.4+i*.8,y-1.2],[x+3.7+i*.8,y-.2],[x+4+i*.8,y-1.2]],'#fff');}
  else if(st==='goldfish'){ell(c,x+2.6,y-2.6,2.6,2,'#F27A2E');poly(c,[[x+.4,y-2.6],[x-1.6,y-4.4],[x-1.6,y-.8]],'#F9A63A');disc(c,x+3.6,y-3,.55,'#fff');disc(c,x+3.8,y-3,.3,'#2E2A26');line(c,x+2.8,y-4,x+4.4,y-3.5,'#3F2A1E',.4);poly(c,[[x+1.2,y-4.4],[x+1.2,y-6.8],[x+2.1,y-5.6],[x+2.9,y-7.4],[x+3.7,y-5.6],[x+4.6,y-6.8],[x+4.6,y-4.4]],'#F2C462');}
  else if(st==='ghost'){c.globalAlpha=.75+.2*Math.sin(t/400);lamp(c,x+2.6,y-4,6,.4,'160,255,230');c.fillStyle='#DFFFF6';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-.6,y-7.6,x+2.8,y-7.6);c.quadraticCurveTo(x+6,y-7.6,x+5.4,y);c.lineTo(x+4,y-1.4);c.lineTo(x+2.7,y);c.lineTo(x+1.4,y-1.4);c.closePath();c.fill();c.globalAlpha=1;disc(c,x+1.9,y-5,.6,'#1F3A36');disc(c,x+3.8,y-5,.6,'#1F3A36');ell(c,x+2.9,y-3.2,.6,.9,'#1F3A36');}
  else if(st==='serpent'){c.strokeStyle='#7FB59A';c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-1,y-5,x+3,y-6);c.stroke();ell(c,x+4,y-6,2.4,1.7,'#7FB59A');disc(c,x+4.8,y-6.4,.4,'#2E2A26');poly(c,[[x+1.6,y-7],[x+2.4,y-9],[x+3.2,y-7.2]],'#F2C462');line(c,x+6,y-5.6,x+8,y-5.2,'#E0457B',.4);}
  else if(st==='claw'){c.strokeStyle='#E8674A';c.lineWidth=1.6;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+1,y-4,x+3.4,y-5);c.stroke();const sn=.3+Math.abs(Math.sin(t/300))*.4;ell(c,x+5,y-6.2,2.8,1.5,'#E8674A',-.5-sn);ell(c,x+5.4,y-4.4,2.4,1.2,'#E8674A',.1+sn*.5);}
  else if(st==='trident'){line(c,x,y,x+7,y-7,'#F2C462',.9);[[-1.9,0],[0,0],[1.9,0]].forEach(([o],i)=>{const bx=x+6+o*.7,by=y-6+o*.7;line(c,bx,by,bx+2.4,by-2.4,'#F2C462',.8);poly(c,[[bx+2,by-3.2],[bx+3.6,by-3.6],[bx+3.2,by-2]],'#FFE79A');});line(c,x+4.4,y-6.4,x+7.6,y-3.2,'#F2C462',.8);}
  else if(st==='anchor'){drawSymbolBase(c,'anchor',x+3,y-3.4,1.5,'#F2C462');disc(c,x+3,y-6.6,.9,'#F2C462');disc(c,x+3,y-6.6,.4,'#8A6420');}
  else drawFigureBase(c,x,y,fid);}

/* ---------- deck items ---------- */
function drawDeckItem(c,id,x,y,t){const d=it(id);if(!d)return;const st=d.st;
  if(st==='rods'){[-1,1].forEach(sd=>{line(c,x+sd*.6,y,x+sd*5,y-11,'#8A5A3A',.5);const bx=x+sd*5+Math.sin(t/600+sd)*1.2;line(c,x+sd*5,y-11,bx,y-3.4,'rgba(255,255,255,.7)',.25);disc(c,bx,y-3.4,.7,'#E0453B');});rr(c,x-2.4,y-2,4.8,2,.6,'#A8704A');}
  else if(st==='net'){c.strokeStyle='#8A7A5A';c.lineWidth=.3;c.beginPath();c.moveTo(x-4,y-8);c.quadraticCurveTo(x,y+1.6,x+4,y-8);c.stroke();for(let i=0;i<4;i++){c.beginPath();c.moveTo(x-3.4+i*2.2,y-7);c.lineTo(x-1.8+i*1.2,y-1.6);c.stroke();}R(c,x-4.4,y-8.6,8.8,.7,'#7A4E30');[['#7CC7E6',-1.4,-4],['#F2A33A',1,-3.2],['#45B07C',-.2,-5.6]].forEach(([col,ox,oy])=>{ell(c,x+ox,y+oy,1.4,.8,col);poly(c,[[x+ox-1.2,y+oy],[x+ox-2.2,y+oy-.8],[x+ox-2.2,y+oy+.8]],col);});}
  else if(st==='trophy'){rr(c,x-4.4,y-7.4,8.8,5.6,1,'#8A5A3A');rr(c,x-3.8,y-6.8,7.6,4.4,.8,'#B98552');ell(c,x+.4,y-4.6,2.6,1.4,'#7CC7E6');poly(c,[[x-1.8,y-4.6],[x-3.4,y-5.8],[x-3.4,y-3.4]],'#4AA6CC');disc(c,x+1.8,y-4.9,.3,'#2E2A26');R(c,x-.5,y-1.8,1,1.8,'#7A4E30');rr(c,x-1.6,y-2.4,3.2,.7,.3,'#F2C462');}
  else if(st==='tank'){rr(c,x-4.6,y-6.6,9.2,6.6,.8,'#BFE8F7');R(c,x-4.6,y-6.6,9.2,1,'#E6F7FD');R(c,x-4.6,y-.9,9.2,.9,'#E2C98F');[['#F2743A',0],['#F7C948',2],['#9B5DE5',4]].forEach(([col,k])=>{const fx=x+Math.sin(t/700+k)*3,fy=y-3.6+Math.sin(t/500+k*2)*1.4,dr=Math.cos(t/700+k)>0?1:-1;ell(c,fx,fy,1.1,.7,col);poly(c,[[fx-dr*1,fy],[fx-dr*1.9,fy-.7],[fx-dr*1.9,fy+.7]],col);});line(c,x-2.6,y-1,x-2.4+Math.sin(t/600)*.4,y-3,'#45B07C',.5);c.strokeStyle='#6B4429';c.lineWidth=.5;c.strokeRect(x-4.6,y-6.6,9.2,6.6);}
  else if(st==='harpoon'){rr(c,x-1.6,y-2.6,3.2,2.6,.6,'#55606E');c.save();c.translate(x,y-3.4);c.rotate(-.35);rr(c,-2.4,-1,6.4,2,.8,'#3F4853');line(c,3.6,0,9,0,'#C9D2DC',.5);poly(c,[[8.4,-1.2],[10.8,0],[8.4,1.2]],'#C9D2DC');c.restore();disc(c,x,y-3.4,.8,'#F2C462');}
  else if(st==='hoard'){ell(c,x,y-.6,5.4,1.4,'#D99A17');for(let i=0;i<14;i++){const a=i*2.4,q=((i*5)%10)/10;disc(c,x+Math.cos(a)*q*4.6,y-1-(1-q)*4.2-Math.abs(Math.sin(a))*.6,.9,i%3?'#F2C462':'#FFE08A');}disc(c,x-1.4,y-4.4,.7,'#E0457B');disc(c,x+1.6,y-3.4,.6,'#5DBE9C');const tw=Math.sin(t/240);if(tw>.5){line(c,x-1.6,y-6,x+1.6,y-6,'#FFF6CF',.4);line(c,x,y-7.6,x,y-4.4,'#FFF6CF',.4);}}
  else drawDeckItemBase(c,id,x,y,t);}

/* ---------- hideout decor ---------- */
DECOR.fishrack=(c,x,y,t)=>{line(c,x-7,y,x-7,y-12,'#7A4E30',1);line(c,x+7,y,x+7,y-12,'#7A4E30',1);line(c,x-8,y-11.4,x+8,y-11.4,'#8A5A3A',.9);['#7CC7E6','#F2A33A','#9AA3AE','#45B07C'].forEach((col,i)=>{const fx=x-5+i*3.4,sw=Math.sin(t/600+i)*.3;line(c,fx,y-11.4,fx+sw,y-9.4,'#C9B88F',.3);ell(c,fx+sw,y-7,1.1,2.4,col);poly(c,[[fx+sw,y-4.8],[fx+sw-1.1,y-3.2],[fx+sw+1.1,y-3.2]],col);});};
DECOR.aquarium=(c,x,y,t)=>{const pid=S.focus?(S.focusPid||S.me):(S.view.islet||S.me);let fs=[];try{const fc=fishCatches(pid);fs=Object.keys(fc.by).map(id=>FISH_BY_ID[id]).sort((a,b)=>FISH_RI[b.rar]-FISH_RI[a.rar]).slice(0,3);}catch(e){}
  rr(c,x-11,y-2,22,2.4,.8,'#7A4E30');rr(c,x-10,y-15,20,13,1.4,'#8FD3EC');R(c,x-10,y-15,20,1.6,'#D6F1FA');R(c,x-10,y-3.6,20,1.6,'#E2C98F');line(c,x-6,y-3.6,x-5.4+Math.sin(t/700)*.6,y-8,'#45B07C',.7);line(c,x+6,y-3.6,x+5.4+Math.sin(t/800)*.6,y-9,'#5DBE9C',.7);
  c.save();c.beginPath();c.rect(x-10,y-15,20,13);c.clip();fs.forEach((f,i)=>{const fx=x+Math.sin(t/1400+i*2.1)*6.4,fy=y-9+i*1.6+Math.sin(t/900+i)*1.6,dr=Math.cos(t/1400+i*2.1)>0?1:-1;c.save();c.translate(fx,fy);c.scale(dr*.36,.36);drawFish(c,f,0,0,1,t);c.restore();});if(!fs.length){ell(c,x,y-8,2,1.2,'#F2743A');}for(let i=0;i<3;i++){const q=((t/1600)+i/3)%1;disc(c,x-7+i*6,y-4-q*10,.5,'rgba(255,255,255,.7)');}c.restore();
  c.strokeStyle='#5A6E7A';c.lineWidth=.6;c.strokeRect(x-10,y-15,20,13);};
