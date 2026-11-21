/* ============================== v12: crew fishing trips ============================== */
// Both captains sail one ship (a coin toss picks the captain and the ship). Normal fish bite as usual and
// anything either of you lands on the trip counts for both. Every DM can also hook one of 50 giants that
// only live out here; the other captain then has 90 seconds to send a DM and heave it in.
const HEAVE_MS=90000;
const GI_ODDS={common:240,uncommon:600,rare:1200,epic:2200,legendary:3500};
// [name, rarity, body, length cm, weight kg at that length, body colour, accent colour, options, odds override]
const GIANT_TABLE=[
['Bottlenose Dolphin','common','dolphin',300,300,'#8FA3B5','#E6EEF3'],
['Common Dolphin','common','dolphin',230,150,'#3E5368','#F0F2F4',{hour:1}],
['Harbour Porpoise','common','porpoise',170,60,'#5E6B78','#D9DEE3'],
["Risso's Dolphin",'common','dolphin',350,500,'#B9C2CA','#EDF1F4',{scars:1,blunt:1}],
['Pilot Whale','common','porpoise',600,2300,'#2F3640','#59626E',{melon:1}],
['Minke Whale','common','whale',800,7000,'#5D6C7B','#E7ECEF'],
['Blue Shark','common','shark',300,200,'#3A6FB8','#E8F0F8',{slim:1}],
['Basking Shark','common','basking',900,5000,'#6C6F73','#B9BCC0'],
['Giant Bluefin Tuna','common','tuna',300,600,'#22406B','#D7DEE6'],
['Ocean Sunfish','common','sunfish',250,1000,'#9AA6AE','#D8DEE2'],
['Leatherback Turtle','common','turtle',200,600,'#3B4048','#7E8792',{ridges:1}],
['Manta Ray','common','ray',500,1500,'#2E3742','#F1F3F5'],
['Humpback Whale','uncommon','whale',1500,30000,'#2F3A47','#DDE3E8',{flip:6,bumps:1}],
['Orca','uncommon','orca',800,6000,'#1E2228','#FFFFFF'],
['Great Hammerhead','uncommon','hammer',550,450,'#7D8A96','#E6EAEE'],
['Tiger Shark','uncommon','shark',450,600,'#7A7F6E','#E9E6DA',{stripes:1}],
['Shortfin Mako','uncommon','shark',380,500,'#2F4E8C','#F0F3F7',{slim:1}],
['Swordfish','uncommon','marlin',450,600,'#3D4A63','#C9D2DE',{sword:1}],
['Blue Marlin','uncommon','marlin',450,700,'#1F4E8C','#DCE7F2'],
['Giant Pacific Octopus','uncommon','octopus',600,70,'#B4473A','#E9937E'],
['Beluga','uncommon','beluga',500,1500,'#F2F4F6','#DCE2E8'],
['Thresher Shark','uncommon','thresher',550,500,'#5E6E86','#E8ECF1'],
['Gray Whale','uncommon','whale',1400,35000,'#7C858C','#A9B0B6',{mottle:1}],
['Bull Shark','uncommon','shark',350,300,'#8A8F88','#ECEDE8',{stocky:1}],
['Great White Shark','rare','shark',600,2000,'#6F7C88','#F4F6F7',{teeth:1}],
['Whale Shark','rare','whaleshark',1200,20000,'#3C5C7A','#E9EEF2',{spots:1}],
['Sperm Whale','rare','sperm',1600,45000,'#5A5F66','#878C92'],
['Narwhal','rare','narwhal',500,1500,'#9AA3AC','#E1E5E8'],
['Fin Whale','rare','whale',2200,70000,'#4D5965','#E6EAED'],
['Giant Squid','rare','squid',1300,275,'#C9584A','#F0A08F'],
['Pink River Dolphin','rare','dolphin',250,180,'#E79AB2','#F8D6E1',{long:1}],
['Greenland Shark','rare','shark',640,1000,'#5E6669','#8E979A',{sleepy:1,stocky:1}],
['Giant Oceanic Manta','rare','ray',700,3000,'#1C2430','#FFFFFF',{big:1}],
['Bowhead Whale','rare','bowhead',1800,80000,'#23272D','#F2F2F2'],
['Blue Whale','epic','whale',2900,150000,'#4A6E93','#BCD0E2',{mottle:1}],
['Colossal Squid','epic','squid',1400,500,'#8E2F45','#E26E86',{hooks:1}],
['Megamouth Shark','epic','whaleshark',550,1200,'#4A3F48','#D9C9D0',{mega:1}],
['Iceberg the White Orca','epic','orca',800,6000,'#F4F6F8','#9FB4C8',{white:1}],
['Sea Serpent','epic','serpent',2500,3000,'#2F8F7A','#F2D06B'],
['Shadow Ray','epic','ray',1500,8000,'#2B1F3D','#7B5EA7',{glow:1,big:1}],
['Ironclad Turtle','epic','turtle',900,9000,'#5C6670','#B08D57',{armour:1}],
['Ghost Sperm Whale','epic','sperm',1800,50000,'#CFE3EE','#F4FAFD',{ghost:1}],
['The Old Kraken','legendary','kraken',3000,90000,'#7A3E9B','#C58BE0'],
['Leviathan','legendary','serpent',4000,120000,'#1D2F4F','#4FA3C7',{spikes:1}],
['Moby Dick','legendary','sperm',2000,60000,'#F5F2EA','#E6E0D2',{scars:1}],
['The Lighthouse Whale','legendary','whale',3000,140000,'#3C4F66','#F4D78A',{lamp:1}],
['Thunder Orca','legendary','orca',1000,9000,'#2C3550','#FFE066',{storm:1}],
['The Island Turtle','mythic','turtle',5000,900000,'#3E6B4E','#C9A66B',{island:1},4000],
['The Cosmic Whale','mythic','whale',6000,1000000,'#1B1F4A','#8EA8FF',{stars:1},4500],
["Bryn's Mum",'mythic','mum',7000,0,'#C98BB0','#F6DCE8',{},5000],
];
const GIANTS=GIANT_TABLE.map(([name,rar,body,len,kg,c1,c2,o,odds])=>({id:'g_'+name.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,''),name,rar,body,len,kg,c1,c2,o:o||{},odds:odds||GI_ODDS[rar],giant:true,depth:0,shape:'oval'}));
const MUM_ID="g_bryn_s_mum";
GIANTS.forEach(g=>{FISH_BY_ID[g.id]=g;});
const GI_ORDER=['common','uncommon','rare','epic','legendary','mythic'];
const GIANT_BLURB={[MUM_ID]:'Nobody who has seen her has been quite the same. She will ask if you have eaten.','g_the_island_turtle':'Has had three pubs built on it by mistake.','g_the_cosmic_whale':'Sings in frequencies only the stars can hear.','g_moby_dick':'Still not over it.','g_the_old_kraken':'Older than the sea, and twice as grumpy.','g_greenland_shark':'Can live 400 years. Is in no rush.','g_ocean_sunfish':'Looks like it was assembled from spare parts. Loves it.'};

/* ---------- rolls ---------- */
const _GROLL=GIANTS.slice().sort((a,b)=>a.odds-b.odds);
function giantRoll(id){let x=h32(id+'giant')/4294967296;for(const g of _GROLL){const p=1/g.odds;if(x<p)return g;x-=p;}return null;}
function giantVar(id){const q=h32(id+'gvar')/4294967296;return q<.004?'r':q<.015?'a':q<.032?'g':'';}
function giantKg(g,cm){return g.kg*Math.pow(cm/g.len,3);}
function kgStr(kg,g){if(g&&g.id===MUM_ID)return 'a lady never tells';return kg>=1000?(kg/1000).toFixed(kg>=10000?0:1)+' t':Math.round(kg)+' kg';}

/* ---------- who was aboard together ---------- */
let COOP_SES=null,COOP_P=null;
function coopPrime(ses,P){COOP_SES=ses;COOP_P=P;}
function coopPlayers(){return (COOP_P||G?.P||[]).slice().sort();}
function coopCap(cid){const P=coopPlayers();return P[h32(cid+'cap')%P.length];}
function coopSegs(p){const ses=(COOP_SES&&COOP_SES[p])||G?.players[p]?.sessions||[];const a=ses.filter(x=>x.mode==='coop'&&x.cid).map(x=>({cid:x.cid,s:x.s,e:x.e||x.s+(x.dur||0)}));
  const lk=S.players[p]?.lock;if(lk&&lk.mode==='coop'&&lk.cid)a.push({cid:lk.cid,s:lk.s,e:Infinity,live:1});return a;}
function coopWindows(){const P=coopPlayers();if(P.length<2)return[];const A=coopSegs(P[0]),B=coopSegs(P[1]);const out=[];
  A.forEach(a=>B.forEach(b=>{if(a.cid!==b.cid)return;const s=Math.max(a.s,b.s),e=Math.min(a.e,b.e);if(e>s)out.push({cid:a.cid,s,e,P,cap:coopCap(a.cid),live:a.live&&b.live});}));return out.sort((x,y)=>x.s-y.s);}

/* ---------- normal fish: anything either of you lands on a crew trip counts for both ---------- */
const _cf12=computeFish;const _cfc={};
computeFish=function(p,evs,sessions,lock){const v=_cf12(p,evs,sessions,lock);const W=coopWindows();if(!W.length||!W[0].P.includes(p))return v;
  const o=W[0].P.find(q=>q!==p);const os=(COOP_SES&&COOP_SES[o])||G?.players[o]?.sessions||[];const oc=_cf12(o,evs,os,S.players[o]?.lock);
  const k=W.map(w=>w.s+':'+w.e).join();const c=_cfc[p];if(c&&c.v0===v&&c.o0===oc&&c.k===k)return c.v;
  const sh=oc.list.filter(x=>W.some(w=>x.t>=w.s&&x.t<=w.e)).map(x=>({...x,crew:o}));let out=v;
  if(sh.length){const by={...v.by},vars={...v.vars};sh.forEach(x=>{by[x.f.id]=(by[x.f.id]||0)+1;if(x.v)vars[x.f.id+'~'+x.v]=(vars[x.f.id+'~'+x.v]||0)+1;});out={...v,list:[...v.list,...sh].sort((a,b)=>a.t-b.t),by,vars};}
  _cfc[p]={v0:v,o0:oc,k,v:out};return out;};

/* ---------- giants: hooked by one DM, heaved in by the other captain's DM within 90 seconds ---------- */
let _cg={k:'',v:null};
function coopGiants(evs){evs=evs||G?.evs||[];const W=coopWindows();const now=Date.now();
  const k=evs.length+'|'+(evs.length?evs[evs.length-1].id:'')+'|'+W.map(w=>w.cid+w.s+':'+w.e).join()+'|'+Math.floor(now/2000);if(_cg.k===k)return _cg.v;
  const list=[],lost=[],pending=[],by={},best={},vars={};
  for(const w of W){const ds=evs.filter(e=>e.k==='d'&&e.t>=w.s&&e.t<=w.e&&w.P.includes(e.pid));
    ds.forEach((e,i)=>{const g=giantRoll(e.id);if(!g)return;const mate=w.P.find(q=>q!==e.pid);let hv=null;for(let j=i+1;j<ds.length&&ds[j].t<=e.t+HEAVE_MS;j++)if(ds[j].pid===mate){hv=ds[j];break;}
      const cm=fishSize(g,e.id,''),v=giantVar(e.id);const base={g,f:g,id:e.id,hook:e.pid,heave:mate,cm,v,kg:giantKg(g,cm),t:e.t,date:e.date||L(e.t).date,cid:w.cid};
      if(hv){const x={...base,t:hv.t,date:hv.date||L(hv.t).date};list.push(x);by[g.id]=(by[g.id]||0)+1;if(!best[g.id]||cm>best[g.id].cm)best[g.id]=x;if(v)vars[g.id+'~'+v]=(vars[g.id+'~'+v]||0)+1;}
      else if(now<=e.t+HEAVE_MS&&w.e>now)pending.push({...base,until:e.t+HEAVE_MS});else lost.push(base);});}
  list.sort((a,b)=>a.t-b.t);lost.sort((a,b)=>a.t-b.t);const v={list,lost,pending,by,best,vars};_cg={k,v};return v;}
const _fm12=fishMetrics;
fishMetrics=function(p,evs,sessions,lock){const m=_fm12(p,evs,sessions,lock);if(!coopPlayers().includes(p))return m;const cg=coopGiants(evs);const ids=Object.keys(cg.by);
  return {...m,fishGiants:cg.list.length,fishGiantSp:ids.length,fishMum:cg.by[MUM_ID]?1:0,fishGiantVar:Object.keys(cg.vars).length,fishGiantMythic:ids.filter(id=>FISH_BY_ID[id].rar==='mythic').length,fishGiantLegend:ids.filter(id=>FISH_RI[FISH_BY_ID[id].rar]>=4).length};};

/* ---------- achievements and gear ---------- */
[['gi_1','Two to Tango','Land your first crew giant','common','fishGiants',1],['gi_25','Heave Ho','Land 25 crew giants','rare','fishGiants',25],['gi_100','Whale of a Time','Land 100 crew giants','epic','fishGiants',100],
 ['gi_sp10','Big Game Crew','Land 10 different giants','rare','fishGiantSp',10],['gi_sp25','Half the Ocean','Land 25 different giants','epic','fishGiantSp',25],['gi_sp50','Every Giant in the Sea','Land all 50 giants','mythic','fishGiantSp',50],
 ['gi_var','Shiny and Enormous','Land a Golden, Albino or Rainbow giant','epic','fishGiantVar',1],['gi_leg','Legend Wrestlers','Land a legendary giant','legendary','fishGiantLegend',1],['gi_myth','Mythical Haul','Land a mythic giant','legendary','fishGiantMythic',1],
 ['gi_mum','Met the Parents',"Land Bryn's Mum",'mythic','fishMum',1]]
 .forEach(([id,name,desc,rar,metric,target])=>{if(ACH_BY_ID[id])return;const a={id,name,desc,rar,cat:'Fishing',metric,target};ACHIEVEMENTS.push(a);ACH_BY_ID[id]=a;});
Object.assign(ACH_GLYPH,{fishGiants:'fish',fishGiantSp:'fish',fishGiantVar:'fish',fishGiantLegend:'fish',fishGiantMythic:'fish',fishMum:'fish'});
[{id:'dk_twinrods',name:'Twin Rod Rack',cat:'deck',st:'twinrods',desc:'One rod each. Neither is enough alone.',earn:['fishGiants',1,'Land a crew giant','giants']},
 {id:'flag_tail',name:'Whale Tail Flag',cat:'flag',col:'#1F4E8C',sym:'tail',sc:'#FFFFFF',desc:'Flown by crews who have heaved in something enormous.',earn:['fishGiants',25,'Land 25 crew giants','giants']},
 {id:'dk_teatray',name:"Bryn's Mum's Tea Tray",cat:'deck',st:'teatray',desc:'She insisted. You will finish every sandwich.',earn:['fishMum',1,"Land Bryn's Mum",'catch']}]
 .forEach(i=>{if(!ALL_ITEMS[i.id]){ITEMS.push(i);ALL_ITEMS[i.id]=i;}});

/* ---------- art ---------- */
function gEye(c,x,y,r=.6){disc(c,x,y,r,'#1E2228');disc(c,x+r*.3,y-r*.35,r*.36,'#FFFFFF');}
function gFlukes(c,x,y,s,col,t){c.save();c.translate(x,y);c.rotate(Math.sin(t/520)*.16);poly(c,[[.6,0],[-1.4*s,-.8*s],[-3.6*s,-3.6*s],[-2.4*s,0],[-3.6*s,3.6*s],[-1.4*s,.8*s]],col);c.restore();}
function gBody(c,x0,x1,h,col,bl=.6){const L=x1-x0;c.beginPath();c.moveTo(x0,0);c.bezierCurveTo(x0+L*.3,-h*.95,x1-L*.4,-h*1.05,x1-L*.12,-h*.8);c.quadraticCurveTo(x1,-h*bl,x1,h*.15);c.quadraticCurveTo(x1-L*.03,h*.85,x1-L*.18,h*.9);c.bezierCurveTo(x1-L*.45,h*1.05,x0+L*.3,h*.85,x0,0);c.closePath();c.fillStyle=col;c.fill();}
function gBelly(c,col,y,rx,ry,x=1){c.save();c.clip();ell(c,x,y,rx,ry,col);c.restore();}
function gSharkTail(c,x,col,t,long){c.save();c.translate(x,0);c.rotate(Math.sin(t/380)*.14);poly(c,long?[[.6,-.4],[-4,-2.6],[-13,-7.4],[-5.6,-.8],[-3.6,2.8],[.6,.6]]:[[.6,-.4],[-2.6,-3],[-4.6,-6],[-3.4,-.4],[-3.2,3],[.6,.6]],col);c.restore();}
function gDorsal(c,x,y,h,col,lean=.5){poly(c,[[x-1.4,y+.4],[x+lean,y-h],[x+1.6,y+.4]],col);}
const GA={
 whale(c,g,t){const o=g.o,A=g.c1,B=g.c2;gFlukes(c,-10,0,1,A,t);gBody(c,-10,12.4,4.1,A,.55);gBelly(c,B,3.4,11,2,1.4);c.save();c.clip();for(let i=0;i<4;i++)line(c,5,2.1+i*.5,11.6,1.4+i*.45,'rgba(0,0,0,.18)',.25);c.restore();
  if(o.mottle){c.save();gBody(c,-10,12.4,4.1,'rgba(0,0,0,0)');c.clip();for(let i=0;i<14;i++)disc(c,-8+((i*37)%19),-2.6+((i*13)%5)*.9,.35+(i%3)*.12,'rgba(255,255,255,.28)');c.restore();}
  if(o.stars){c.save();gBody(c,-10,12.4,4.1,'rgba(0,0,0,0)');c.clip();for(let i=0;i<18;i++){const a=.4+.6*Math.abs(Math.sin(t/400+i));disc(c,-9+((i*29)%21),-3+((i*17)%7),.25+(i%3)*.12,`rgba(220,230,255,${a.toFixed(2)})`);}c.restore();glowAt(c,0,0,14,'140,160,255',.25);}
  gDorsal(c,-4.4,-2.9,1.4,A,.7);ell(c,3,2.9,o.flip||2.4,.75,o.flip?B:A,.55);if(o.bumps)for(let i=0;i<4;i++)disc(c,8.4+i*.9,-2.4+i*.35,.32,'rgba(255,255,255,.35)');
  gEye(c,7.4,.5,.5);line(c,12.2,.8,6.6,1.3,'rgba(0,0,0,.35)',.35);
  if(o.lamp){R(c,8.4,-6.6,1.4,3,'#3F3A30');rr(c,7.9,-8.8,2.4,2.4,.5,'#FFE9A8');glowAt(c,9.1,-7.6,9,'255,220,120',.55+.25*Math.sin(t/300));poly(c,[[7.6,-8.8],[9.1,-10.2],[10.6,-8.8]],'#B5402F');}
  if(t%5000<1400){for(let i=0;i<6;i++){const q=(t%1400)/1400;disc(c,9+Math.sin(i)*q*2,-4.4-q*5-i*.6,.5*(1-q)+.2,'rgba(220,235,245,.8)');}}},
 bowhead(c,g,t){const A=g.c1,B=g.c2;gFlukes(c,-10,0,1,A,t);c.beginPath();c.moveTo(-10,0);c.bezierCurveTo(-5,-4,2,-5.6,8,-5);c.quadraticCurveTo(12.6,-3,12.6,0);c.quadraticCurveTo(12,4,6,4.2);c.bezierCurveTo(0,4.4,-6,3,-10,0);c.closePath();c.fillStyle=A;c.fill();
  c.save();c.clip();ell(c,9,3.6,4,2.4,B);c.restore();ell(c,3,2.8,2.2,.7,A,.6);gEye(c,6.4,1.2,.5);line(c,12.4,.4,5,2.6,'rgba(255,255,255,.4)',.35);},
 porpoise(c,g,t){const o=g.o,A=g.c1,B=g.c2;gFlukes(c,-9,0,.75,A,t);gBody(c,-9,10.4,3.4,A,o.melon?.95:.75);gBelly(c,B,2.8,9,1.6,1);gDorsal(c,-1.4,-3,o.melon?2:2.4,A,o.melon?1.4:.8);ell(c,3,2.2,1.6,.55,A,.6);gEye(c,7,.2,.45);line(c,10.2,.8,8,1,'rgba(0,0,0,.4)',.3);},
 dolphin(c,g,t){const o=g.o,A=g.c1,B=g.c2;gFlukes(c,-9.4,0,.8,A,t);gBody(c,-9.4,9.2,3.2,A,.7);gBelly(c,B,2.6,9,1.6,1);
  if(o.hour){c.save();gBody(c,-9.4,9.2,3.2,'rgba(0,0,0,0)');c.clip();ell(c,3,.6,4,1.2,'#F2D58A',-.12);ell(c,-4,.4,3,1,'#AEB8C2',.1);c.restore();}
  if(!o.blunt){ell(c,10.4+(o.long?1:0),.95,2+(o.long?1.2:0),.6,A);}
  gDorsal(c,-1,-2.8,3,A,1.8);ell(c,3.4,2.3,1.8,.55,A,.7);gEye(c,6.8,.1,.45);line(c,o.blunt?9.2:12,1.1,7.4,1,'rgba(0,0,0,.35)',.3);
  if(o.scars)for(let i=0;i<6;i++)line(c,-6+i*2.4,-2+((i*7)%3)*.6,-4.4+i*2.4,-1+((i*5)%3)*.6,'rgba(255,255,255,.8)',.2);},
 orca(c,g,t){const o=g.o,A=g.c1,B=g.c2;gFlukes(c,-9.4,0,.9,A,t);gBody(c,-9.4,10.6,3.9,A,.85);gBelly(c,B,3,9.4,1.8,1.4);
  ell(c,5.8,-1,1.9,.75,B,-.15);ell(c,-2.6,-2.6,2,.8,o.white?'#C9D6E2':'#9AA3AC',.1);gDorsal(c,-1,-3.4,o.white?5:6,A,.4);ell(c,3.6,2.8,1.9,.9,A,.5);gEye(c,6.6,.1,.4);
  if(o.storm){line(c,-6,-1,-4,0,B,.5);line(c,-4,0,-5,1,B,.5);line(c,-5,1,-2,2,B,.5);glowAt(c,-4,.5,6,'255,224,102',.35+.2*Math.sin(t/120));}},
 beluga(c,g,t){const A=g.c1,B=g.c2;gFlukes(c,-9,0,.8,A,t);gBody(c,-9,9.6,3.6,A,1);disc(c,7.4,-1,2.6,A);gBelly(c,B,3.2,9,1.4,1);ell(c,2.6,2.3,1.6,.6,B,.6);gEye(c,6.8,.1,.42);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=.3;c.beginPath();c.arc(8.6,.6,1.2,.2,1.4);c.stroke();},
 narwhal(c,g,t){c.save();c.translate(-3,0);const A=g.c1,B=g.c2;gFlukes(c,-8,0,.8,A,t);gBody(c,-8,8.4,3.3,A,.9);gBelly(c,B,2.6,8,1.6,1);c.save();gBody(c,-8,8.4,3.3,'rgba(0,0,0,0)');c.clip();for(let i=0;i<12;i++)disc(c,-7+((i*23)%14),-2.4+((i*11)%5)*.7,.35,'rgba(40,50,60,.35)');c.restore();
  line(c,8,-.2,18,-1.8,'#F2EAD8',.9);for(let i=0;i<7;i++)line(c,9+i*1.3,-.1-i*.2,9.6+i*1.3,-.9-i*.2,'#C9BFA8',.2);ell(c,2.6,2.2,1.5,.5,A,.6);gEye(c,5.6,0,.42);c.restore();},
 sperm(c,g,t){const o=g.o,A=g.c1,B=g.c2;if(o.ghost){c.globalAlpha=.85;glowAt(c,0,0,15,'200,230,255',.35);}gFlukes(c,-10,0,1,A,t);c.beginPath();c.moveTo(-10,0);c.bezierCurveTo(-6,-3.2,-1,-3.6,2,-3.8);c.lineTo(10.4,-3.8);c.quadraticCurveTo(12.6,-3.6,12.6,-1);c.lineTo(12.4,1.6);c.quadraticCurveTo(12,3,9,3);c.lineTo(2,3.2);c.bezierCurveTo(-3,3.4,-7,2.4,-10,0);c.closePath();c.fillStyle=A;c.fill();
  c.save();c.clip();for(let i=0;i<5;i++)line(c,-7+i*2.6,-2.6,-6.4+i*2.6,2,'rgba(0,0,0,.12)',.35);c.restore();line(c,11.6,2.4,4,2.6,B,.6);gEye(c,4.6,.9,.42);gDorsal(c,-4,-2.6,.9,A,.5);
  if(o.scars)for(let i=0;i<5;i++)line(c,-2+i*2,-2.8+i*.4,-1+i*2,-.6+i*.3,'rgba(150,130,110,.6)',.25);if(o.ghost)c.globalAlpha=1;},
 shark(c,g,t){const o=g.o,A=g.c1,B=g.c2;const h=o.slim?2.8:o.stocky?3.8:3.3;gSharkTail(c,-9,A,t);gBody(c,-9,11.6,h,A,.4);gBelly(c,B,h*.8,10,h*.55,2);
  if(o.stripes){c.save();gBody(c,-9,11.6,h,'rgba(0,0,0,0)');c.clip();for(let i=0;i<7;i++)line(c,-6+i*2,-h,-6.6+i*2,-.4,'rgba(40,40,30,.45)',.5);c.restore();}
  gDorsal(c,-.6,-h*.82,h*1.1,A,1.2);gDorsal(c,-6,-h*.5,1,A,.5);poly(c,[[3,1.4],[1,4.4],[4.6,1.8]],A);for(let i=0;i<4;i++)line(c,6.2+i*.6,-.8,6,.9,'rgba(0,0,0,.3)',.25);
  gEye(c,8.6,-.6,o.sleepy?.25:.45);if(o.sleepy)line(c,8.1,-.8,9.1,-.8,'#1E2228',.25);c.strokeStyle='rgba(0,0,0,.45)';c.lineWidth=.35;c.beginPath();c.moveTo(11,1);c.quadraticCurveTo(9.6,2,7.6,1.6);c.stroke();
  if(o.teeth)for(let i=0;i<4;i++)poly(c,[[8.2+i*.7,1.6],[8.5+i*.7,2.2],[8.8+i*.7,1.6]],'#FFFFFF');},
 hammer(c,g,t){GA.shark(c,{...g,o:{}},t);rr(c,10.6,-3.4,1.6,6.8,.8,g.c1);gEye(c,11.4,-3,.4);gEye(c,11.4,3,.4);},
 thresher(c,g,t){const A=g.c1,B=g.c2;gSharkTail(c,-7,A,t,true);gBody(c,-7,11,3,A,.5);gBelly(c,B,2.6,9,1.6,2);gDorsal(c,1,-2.6,3,A,1.2);poly(c,[[4,1.2],[2.2,4],[5.4,1.6]],A);gEye(c,8.4,-.4,.55);for(let i=0;i<4;i++)line(c,6+i*.5,-.7,5.8+i*.5,.8,'rgba(0,0,0,.3)',.25);},
 basking(c,g,t){const A=g.c1,B=g.c2;gSharkTail(c,-9,A,t);gBody(c,-9,11,3.8,A,.7);gBelly(c,B,3,9,1.6,1);gDorsal(c,-.4,-3.2,3.6,A,1);for(let i=0;i<5;i++)line(c,4+i*.9,-3,3.6+i*.9,3,'rgba(255,255,255,.28)',.4);
  ell(c,11,0,1.6,2.6,'#3A2E32');ell(c,11.2,0,1,1.8,'#C97A86');gEye(c,9,-1.8,.4);},
 whaleshark(c,g,t){const o=g.o,A=g.c1,B=g.c2;gSharkTail(c,-10,A,t);c.beginPath();c.moveTo(-10,0);c.bezierCurveTo(-5,-4,4,-4.6,10,-3);c.quadraticCurveTo(12.6,-2,12.6,0);c.quadraticCurveTo(12.4,2.6,9,3.2);c.bezierCurveTo(3,4.4,-5,3.4,-10,0);c.closePath();c.fillStyle=A;c.fill();
  c.save();c.clip();ell(c,2,3.4,11,1.6,B);if(o.spots)for(let i=0;i<30;i++)disc(c,-8+((i*31)%20),-3.4+((i*7)%6)*.8,.32,'rgba(255,255,255,.75)');for(let i=0;i<5;i++)line(c,-8,-1+i*.5,8,-2.2+i*.4,'rgba(255,255,255,.15)',.25);c.restore();
  gDorsal(c,-1,-3.6,2.6,A,.8);poly(c,[[3,2],[1,5],[4.4,2.4]],A);line(c,12.4,.6,9.2,1.2,o.mega?'#F2E6EA':'#1E2228',o.mega?.9:.4);gEye(c,10.4,-1.2,.38);},
 tuna(c,g,t){const A=g.c1,B=g.c2;c.save();c.translate(-8.6,0);c.rotate(Math.sin(t/300)*.12);poly(c,[[.6,0],[-2.8,-4.2],[-1.6,0],[-2.8,4.2]],A);c.restore();gBody(c,-8.6,10.4,3.6,A,.55);gBelly(c,B,2.4,9.4,2,1);
  for(let i=0;i<4;i++){poly(c,[[-7.4+i*1.1,-1.6+i*.15],[-6.9+i*1.1,-2.4+i*.2],[-6.6+i*1.1,-1.5+i*.15]],'#F2C13A');poly(c,[[-7.4+i*1.1,1.6-i*.15],[-6.9+i*1.1,2.4-i*.2],[-6.6+i*1.1,1.5-i*.15]],'#F2C13A');}
  gDorsal(c,1,-3.2,2.4,A,.8);ell(c,4,1,2.4,.5,A,-.3);line(c,-6,0,8,-.4,'rgba(255,255,255,.35)',.3);gEye(c,7.8,-.4,.6);},
 marlin(c,g,t){const o=g.o,A=g.c1,B=g.c2;c.save();c.translate(-3,0);c.save();c.translate(-8,0);c.rotate(Math.sin(t/300)*.14);poly(c,[[.6,0],[-3,-4.6],[-1.4,0],[-3,4.6]],A);c.restore();
  gBody(c,-8,9,2.6,A,.4);gBelly(c,B,2,8,1.4,1);if(!o.sword){c.beginPath();c.moveTo(-3,-1.8);c.quadraticCurveTo(0,-8,6,-2.2);c.closePath();c.fillStyle=A;c.fill();for(let i=0;i<5;i++)line(c,-2+i*1.4,-2,-1.4+i*1.4,-5+Math.abs(i-2)*.4,'rgba(255,255,255,.25)',.2);for(let i=0;i<6;i++)line(c,-5+i*2.4,-1.4,-5+i*2.4,1.4,'rgba(140,190,255,.5)',.3);}
  else gDorsal(c,1,-2.2,2.6,A,.4);line(c,8.4,-.1,17,-.6,A,o.sword?.9:.55);gEye(c,6.8,-.5,.5);c.restore();},
 sunfish(c,g,t){const A=g.c1,B=g.c2;const f=Math.sin(t/500)*.6;poly(c,[[-1.6,-5],[0+f,-12],[2.2,-5]],A);poly(c,[[-1.6,5],[0-f,12],[2.2,5]],A);ell(c,0,0,7,6.6,A);c.save();ell(c,0,0,7,6.6,'rgba(0,0,0,0)');c.clip();ell(c,1.6,3,6,3,B);for(let i=0;i<5;i++)line(c,-6,-3+i*1.6,6,-3.4+i*1.6,'rgba(255,255,255,.12)',.3);c.restore();
  for(let i=0;i<6;i++)disc(c,-7,-3+i*1.2,.9,A);gEye(c,4.4,-1.2,.6);disc(c,6.6,.4,.5,'#5A646C');ell(c,2.6,.6,1.3,.5,B,.4);},
 turtle(c,g,t){const o=g.o,A=g.c1,B=g.c2;const fl=Math.sin(t/420)*.25;ell(c,4.4,3.6,3.2,1,'#5C6A55',.6+fl);ell(c,4.4,-3.4,3.6,1.1,'#5C6A55',-.6-fl);ell(c,-5,3,2,.8,'#5C6A55',-.5);ell(c,-5,-3,2,.8,'#5C6A55',.5);
  if(o.island){ell(c,0,0,9.6,5.6,'#4B5E44');ell(c,9.6,.4,2.2,1.7,'#6B7A5C');gEye(c,10.4,-.2,.4);ell(c,0,-3.4,7.2,2.4,'#E6C98A');poly(c,[[-3,-3.6],[-1.6,-6.4],[0,-3.6]],'#7C6A4A');R(c,1.6,-10.4,.6,7,'#8A5A3A');for(let i=0;i<5;i++)ell(c,1.9+Math.cos(i*1.3)*2.2,-10.6+Math.sin(i*1.3)*1,2.4,.7,'#3E8E5A',i*1.3);rr(c,-6,-6,3,2.6,.4,'#E8D2A8');poly(c,[[-6.4,-6],[-4.5,-7.6],[-2.6,-6]],'#B5402F');return;}
  ell(c,0,0,8.4,4.6,A);c.save();ell(c,0,0,8.4,4.6,'rgba(0,0,0,0)');c.clip();if(o.ridges)for(let i=0;i<5;i++)line(c,-8,-3.4+i*1.7,8,-3.4+i*1.7,'rgba(255,255,255,.25)',.3);
  if(o.armour){for(let i=0;i<4;i++)line(c,-8,-3+i*2,8,-3+i*2,B,.45);for(let i=0;i<10;i++)disc(c,-7+i*1.6,-2+(i%2)*2,.35,'#E6C98A');}else for(let i=0;i<9;i++)disc(c,-6+((i*5)%13),-2.6+((i*3)%5)*1.2,.5,B);c.restore();
  ell(c,9.6,.4,2,1.6,'#6B7A72');gEye(c,10.4,-.1,.4);},
 ray(c,g,t){const o=g.o,A=g.c1,B=g.c2;const k=o.big?1.12:1,w=Math.sin(t/450)*1.6;if(o.glow)glowAt(c,0,0,15,'150,110,220',.4+.15*Math.sin(t/300));
  line(c,-5,0,-15,Math.sin(t/300)*1.2,A,.5);c.beginPath();c.moveTo(7*k,0);c.quadraticCurveTo(1,-4*k,-2*k,-11*k+w);c.quadraticCurveTo(-3*k,-3*k,-6*k,0);c.quadraticCurveTo(-3*k,3*k,-2*k,11*k-w);c.quadraticCurveTo(1,4*k,7*k,0);c.fillStyle=A;c.fill();
  c.save();c.clip();ell(c,-1,0,2.6,6,B==='#FFFFFF'?'rgba(255,255,255,.18)':B);c.restore();ell(c,7.6,-1.2,1.4,.5,A,-.5);ell(c,7.6,1.2,1.4,.5,A,.5);gEye(c,5.6,-1.6,.35);gEye(c,5.6,1.6,.35);},
 octopus(c,g,t){const A=g.c1,B=g.c2;for(let i=0;i<8;i++){c.strokeStyle=i%2?A:B;c.lineWidth=1.4-i*.05;c.lineCap='round';c.beginPath();c.moveTo(1,1+i*.3);const ph=t/400+i;c.bezierCurveTo(-3+i*.4,4+Math.sin(ph)*2,-8+i,5+Math.cos(ph)*2,-11+i*.6,2+Math.sin(ph*1.2)*3+i*.4);c.stroke();}
  ell(c,4,-1.4,5.4,4.2,A,-.4);ell(c,5,-2.6,3,1.6,B,-.4);gEye(c,4.6,.6,.7);gEye(c,7.4,-.4,.6);},
 squid(c,g,t){const o=g.o,A=g.c1,B=g.c2;for(let i=0;i<8;i++){c.strokeStyle=A;c.lineWidth=.7;c.beginPath();c.moveTo(5,0);const ph=t/350+i;c.quadraticCurveTo(9,(i-3.5)*.7+Math.sin(ph),13,(i-3.5)*1.1+Math.sin(ph*1.3)*1.4);c.stroke();}
  c.strokeStyle=A;c.lineWidth=.5;c.beginPath();c.moveTo(5,0);c.quadraticCurveTo(11,-4,16,-3+Math.sin(t/300));c.stroke();ell(c,16,-3+Math.sin(t/300),1.2,.6,A);if(o.hooks)for(let i=0;i<3;i++)poly(c,[[14.6+i*.8,-3.4],[15+i*.8,-4.4],[15.3+i*.8,-3.4]],'#F2EAD8');
  c.beginPath();c.moveTo(6,0);c.quadraticCurveTo(4,-3.4,-6,-1.6);c.lineTo(-11,0);c.lineTo(-6,1.6);c.quadraticCurveTo(4,3.4,6,0);c.fillStyle=A;c.fill();poly(c,[[-7,-1.4],[-11,-4.6],[-10.4,0],[-11,4.6],[-7,1.4]],A);c.save();c.clip();c.restore();ell(c,0,.2,5,1,B);gEye(c,4.6,-.4,1.1);},
 kraken(c,g,t){const A=g.c1,B=g.c2;glowAt(c,0,0,15,'170,110,220',.3);for(let i=0;i<6;i++){c.strokeStyle=i%2?A:B;c.lineWidth=1.8-i*.15;c.lineCap='round';c.beginPath();const bx=-6+i*2.4,ph=t/380+i;c.moveTo(bx,2);c.bezierCurveTo(bx-2,6,bx+3,8+Math.sin(ph),bx+Math.sin(ph)*3,-6-i%3*2);c.stroke();}
  ell(c,0,-1,8,6,A);ell(c,1,-3.6,5,2,B);disc(c,3,0,1.8,'#FFE066');disc(c,3.3,0,.8,'#1E2228');disc(c,-2.6,.4,1.2,'#FFE066');disc(c,-2.4,.4,.5,'#1E2228');for(let i=0;i<5;i++)disc(c,-5+i*2.6,3.6,.45,B);},
 serpent(c,g,t){const o=g.o,A=g.c1,B=g.c2;const pts=[];for(let i=0;i<=24;i++){const x=-12+i,y=Math.sin(i/3.2+t/400)*3.2;pts.push([x,y]);}
  for(let i=0;i<pts.length;i++){const r=1.2+Math.sin(i/24*Math.PI)*1.2;disc(c,pts[i][0],pts[i][1],r,A);}for(let i=2;i<pts.length-2;i+=2){disc(c,pts[i][0],pts[i][1]+.6,.7,B);if(o.spikes)poly(c,[[pts[i][0]-.6,pts[i][1]-1.6],[pts[i][0],pts[i][1]-3.4],[pts[i][0]+.6,pts[i][1]-1.6]],'#4FA3C7');}
  const h=pts[pts.length-1];ell(c,h[0]+1.4,h[1]-.4,2.8,1.8,A,-.2);poly(c,[[h[0]-1,h[1]-1.4],[h[0]-.4,h[1]-4.6],[h[0]+1,h[1]-1.6]],B);gEye(c,h[0]+2.2,h[1]-1,.5);line(c,h[0]+4,h[1],h[0]+5.4,h[1]+.8,'#E0453B',.3);},
 mum(c,g,t){const A=g.c1,B=g.c2;glowAt(c,0,0,16,'255,190,220',.35+.1*Math.sin(t/400));gFlukes(c,-10,0,1,A,t);gBody(c,-10,12.4,4.4,A,.75);gBelly(c,B,3.4,11,2,1.4);
  // pearls, curlers, glasses, lipstick, a handbag
  for(let i=0;i<9;i++){const a=-1.2+i*.3;disc(c,4.4+Math.cos(a)*1.2,Math.sin(a)*4,.45,'#FFFDF6');}
  [['#F7A8C4',6.6],['#9FD3F2',8.4],['#FFE08A',10.1]].forEach(([col,x],i)=>{rr(c,x-.7,-5.3-(i===1?.5:0),1.4,2.1,.6,col);line(c,x-.7,-4.3-(i===1?.5:0),x+.7,-4.3-(i===1?.5:0),'rgba(0,0,0,.18)',.2);});
  ell(c,3.4,3,2.6,.8,A,.6);rr(c,4.6,4,2.2,1.6,.4,'#7A3E5C');c.strokeStyle='#7A3E5C';c.lineWidth=.25;c.beginPath();c.arc(5.7,4,.7,Math.PI,0);c.stroke();
  gEye(c,8.6,.1,.55);for(let i=0;i<3;i++)line(c,8.1+i*.5,-.5,7.9+i*.6,-1.1,'#1E2228',.18);c.strokeStyle='#5A3A4A';c.lineWidth=.3;c.beginPath();c.arc(8.6,.1,1.05,0,TAU);c.stroke();line(c,7.55,0,5.6,-.4,'#5A3A4A',.25);
  c.globalAlpha=.5;disc(c,9.8,1.6,.9,'#F07AA0');c.globalAlpha=1;ell(c,12.2,1.1,.9,.45,'#D62E5C');}
};
function drawGiant(c,g,t){(GA[g.body]||GA.whale)(c,g,t||0);}
GIANTS.forEach(g=>{FA[g.id]=(c,t)=>drawGiant(c,g,t);});
// flag symbol and deck pieces
const _ds12=drawSymbol;drawSymbol=function(c,sym,cx,cy,s,col){if(sym!=='tail')return _ds12(c,sym,cx,cy,s,col);c.save();c.translate(cx,cy);c.scale(s,s);poly(c,[[0,2.6],[-.5,.4],[-3,-1.2],[-1.2,-1.2],[0,-.2],[1.2,-1.2],[3,-1.2],[.5,.4]],col);R(c,-.5,1.6,1,1.6,col);c.restore();};
const _dd12=drawDeckItem;drawDeckItem=function(c,id,x,y,t){const d=it(id);if(!d||(d.st!=='twinrods'&&d.st!=='teatray'))return _dd12(c,id,x,y,t);
  if(d.st==='twinrods'){y-=1.6;rr(c,x-3.6,y-2.4,7.2,2.4,.4,'#8A5A3A');[-1.6,1.6].forEach((ox,i)=>{line(c,x+ox,y-2,x+ox+(i?2.4:-2.4),y-11,'#5A3A24',.5);c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=.15;c.beginPath();c.moveTo(x+ox+(i?2.4:-2.4),y-11);c.quadraticCurveTo(x+ox+(i?3.4:-3.4),y-6,x+ox+(i?2.6:-2.6),y-3);c.stroke();disc(c,x+ox,y-3.4,.6,'#B5402F');});return;}
  y-=2.4;c.save();c.translate(x,y);c.scale(1.35,1.35);c.translate(-x,-y);rr(c,x-4.6,y-1.4,9.2,1.4,.5,'#C9A44C');R(c,x-4.2,y-1.9,8.4,.5,'#E8C870');rr(c,x-3.4,y-4.4,2.6,2.8,.4,'#F4F0E8');rr(c,x-3.6,y-4.8,3,.6,.2,'#F4F0E8');disc(c,x-2.1,y-4.9,.3,'#E07AA0');
  for(let i=0;i<3;i++){poly(c,[[x+.2+i*1.3,y-1.9],[x+.8+i*1.3,y-3.6],[x+1.4+i*1.3,y-1.9]],'#F6E7C1');line(c,x+.4+i*1.3,y-2.4,x+1.2+i*1.3,y-2.4,'#8FBF6A',.25);}c.restore();};

/* ---------- Lock In: start, join, panel ---------- */
function coopPartner(){return other(S.me);}
function coopOpen(p){const lk=S.players[p]?.lock;if(!lk||!(lk.mode==='coop'||lk.mode==='crewhunt')||!lk.cid)return null;const left=lk.s+lk.dur-Date.now();return left>60000?{...lk,left}:null;}
function coopPanelHtml(tier){const o=coopPartner(),op=coopOpen(o),ob=S.players[o]?.lock;const n=GI_ORDER.map(r=>[r,GIANTS.filter(g=>g.rar===r)]);
  return `<div class="tierHead"><b>Crew trip · two rods, one ship</b><small>You both sail on one ship. A coin toss picks the captain, and you sail their ship. Normal fish still bite, and anything either of you lands on the trip goes in both trophy cases. Every DM also has a chance to hook one of ${GIANTS.length} giants that only swim out here. When a giant bites, the other captain has 90 seconds to send a DM and heave it in, or it snaps the line.</small></div>
   ${op?`<div class="coopNote"><b>${pname(o)} is already out there</b> with ${clockStr(op.left)} left. <button class="btn sm primary" data-act="coopJoin">Climb aboard</button></div>`:ob?`<div class="coopNote">${pname(o)} is on their own voyage right now. Start a crew trip and they can join when they are back.</div>`:`<div class="coopNote">Setting sail calls ${pname(o)} to the dock. They can climb aboard any time while the trip is running.</div>`}
   <div class="giOdds">${n.map(([r,gs])=>`<div><span class="rtag r-${r}">${r}</span><small>${gs.length} giant${gs.length>1?'s':''} · ${r==='mythic'?'1 in 4,000 to 5,000':'1 in '+fmtN(GI_ODDS[r])} each per DM</small></div>`).join('')}</div>
   <small class="muted">Biggest of all: Bryn's Mum, 1 in 5,000 per DM. Bring sandwiches.</small>`;}
const _lockStart12=ACT.lockStart;ACT.lockStart=async function(){if(S.view.lockMode!=='coop')return _lockStart12.apply(this,arguments);
  const o=coopPartner();if(coopOpen(o)?.mode==='coop')return ACT.coopJoin();const cm=+($('#lockCustom')?.value||0);const m=cm>=5?Math.min(180,cm):S.view.lockDur||25;const cid=uid();
  try{await writePlayer(S.me,{lock:{id:uid(),s:Date.now(),dur:m*60000,paused:0,pausedAt:null,diff:'calm',mode:'coop',bait:'',hv:2,cid,cdur:m*60000}});tone(392,.2,'triangle',.06);tone(523,.25,'triangle',.06,.15);
    toast(`<b>Crew trip launched.</b> ${pname(coopCap(cid))} has the helm. ${pname(o)} has been called to the dock.`,'level',4200);}catch(e){writeFail(e);}};
ACT.coopJoin=async function(){const o=coopPartner(),op=coopOpen(o);if(!op)return toast('That crew trip has already sailed.');if(S.players[S.me]?.lock)return toast('Finish your own voyage first, then climb aboard.');
  try{await writePlayer(S.me,{lock:{id:uid(),s:Date.now(),dur:op.left,paused:0,pausedAt:null,diff:op.diff||'calm',mode:op.mode,bait:'',hv:2,cid:op.cid,cdur:op.cdur||op.dur}});S.view.lockMode=op.mode;tone(523,.15,'triangle',.06);tone(659,.15,'triangle',.06,.12);tone(784,.25,'triangle',.06,.24);
    toast(`<b>All aboard!</b> ${op.mode==='crewhunt'?'Two gunners on deck.':'Two rods in the water.'} ${pname(coopCap(op.cid))} is captain.`,'level',3600);if(S.screen!=='lockin')location.hash='#lockin';}catch(e){writeFail(e);}};
ACT.coopDismiss=()=>{const op=coopOpen(coopPartner());if(op)S.coopDis=op.cid;coopTick();};
const _lockScr12=SCREENS.lockin;SCREENS.lockin=()=>{const h=_lockScr12();const op=coopOpen(coopPartner());if(!op||S.players[S.me]?.lock)return h;
  return `<div class="pad" style="padding-bottom:0"><div class="card coopInvite"><b>🎣 ${pname(coopPartner())} is waiting at the dock</b><small>A crew trip with ${clockStr(op.left)} left. ${pname(coopCap(op.cid))} is captain.</small><button class="btn primary" data-act="coopJoin">Climb aboard</button></div></div>`+h;};
function coopCardHtml(lk){const W=coopWindows().filter(w=>w.cid===lk.cid);const o=coopPartner();const live=W.some(w=>w.live);const cg=coopGiants();const mine=cg.list.filter(x=>x.cid===lk.cid);const lost=cg.lost.filter(x=>x.cid===lk.cid).length;const pend=cg.pending.filter(x=>x.cid===lk.cid);
  return `<div class="vboss coopCard"><small>Crew trip · captain ${pname(coopCap(lk.cid))}</small><b>${live?`${pname(o)} is aboard. Two rods in the water.`:W.length?`${pname(o)} has gone ashore.`:`Waiting for ${pname(o)} to climb aboard…`}</b>
   ${pend.length?`<div class="heaveNow">${pend.map(x=>x.hook===S.me?`Something enormous is on your line! ${pname(x.heave)} has ${Math.max(0,Math.ceil((x.until-Date.now())/1000))}s to heave.`:`HEAVE! ${pname(x.hook)} has hooked a giant. Send a DM in ${Math.max(0,Math.ceil((x.until-Date.now())/1000))}s!`).join('<br>')}</div>`:''}
   <small>${mine.length} giant${mine.length===1?'':'s'} landed this trip${lost?` · ${lost} got away`:''}</small><div class="tripFish">${mine.slice(-8).reverse().map(x=>`<canvas class="fishIco" width="72" height="72" data-f="${x.g.id}" data-v="${x.v||''}" title="${esc(x.g.name)}"></canvas>`).join('')}</div></div>`;}

/* ---------- the scene ---------- */
function coopShipPl(lk){return S.players[coopCap(lk.cid)]||S.players[S.me];}
function drawCoopExtras(c,t,lk){if(lk.mode==='crewhunt')return drawCrewHuntExtras(c,t,lk);const W=coopWindows().filter(w=>w.cid===lk.cid&&w.live);const cap=coopCap(lk.cid),mate=coopPlayers().find(p=>p!==cap);
  if(W.length){c.save();c.translate(70,122);c.scale(.62,.62);try{drawKeeper(c,0,0,mate,S.players[mate]||{},t);}catch(e){}c.restore();
    const bx=236+Math.sin(t/1200)*3,by=132+Math.sin(t/460)*1.1;c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=.45;c.beginPath();c.moveTo(62,96);c.quadraticCurveTo(150,92,bx,by-2);c.stroke();line(c,74,118,62,96,'#7A4E30',1.1);disc(c,bx,by,2.2,'#FFFFFF');c.save();c.beginPath();c.rect(bx-3,by-3,6,3);c.clip();disc(c,bx,by,2.2,'#3E8DDB');c.restore();}
  txt(c,`Crew trip · captain ${pnameRaw(cap)}${W.length?'':' · waiting for '+pnameRaw(mate)}`,160,26,'#3F5160',6.4,'center');
  const cg=coopGiants();const pend=cg.pending.filter(x=>x.cid===lk.cid);if(pend.length){const x=pend[0];const q=(x.until-Date.now())/HEAVE_MS;const sx=214+Math.sin(t/200)*4,sy=150;
    c.globalAlpha=.35;ell(c,sx,sy,24,6,'#0E2A4A');c.globalAlpha=1;for(let i=0;i<3;i++){const k=((t/500)+i/3)%1;c.strokeStyle=`rgba(255,255,255,${(.8*(1-k)).toFixed(2)})`;c.lineWidth=.7;c.beginPath();c.ellipse(sx,sy-4,6+k*20,1.6+k*4,0,0,TAU);c.stroke();}
    const s=1+.12*Math.sin(t/90);c.save();c.translate(sx,sy-26);c.scale(s,s);txt(c,'HEAVE!',0,0,'#E0453B',13,'center');c.restore();rr(c,sx-20,sy-16,40,3,1.5,'rgba(0,0,0,.25)');rr(c,sx-20,sy-16,40*Math.max(0,q),3,1.5,'#F2C462');}}

/* ---------- live bar: invites and heave alerts ---------- */
function coopTick(){if(!G||!S.me)return;let bar=$('#coopBar');if(!bar){document.body.insertAdjacentHTML('beforeend','<div id="coopBar" hidden></div>');bar=$('#coopBar');}
  const o=coopPartner(),op=coopOpen(o),mine=S.players[S.me]?.lock;let html='',cls='';const cg=coopGiants();const pend=cg.pending.filter(x=>x.hook===o&&x.heave===S.me),hooked=cg.pending.filter(x=>x.hook===S.me);
  if(pend.length){const s=Math.max(0,Math.ceil((pend[0].until-Date.now())/1000));html=`<b>HEAVE!</b> ${pname(o)} has hooked something enormous. Send a DM in <b>${s}s</b> to reel it in!`;cls='heave';}
  else if(hooked.length){const s=Math.max(0,Math.ceil((hooked[0].until-Date.now())/1000));html=`<b>Something huge is on your line!</b> ${pname(o)} has ${s}s to heave.`;cls='hooked';}
  else if(op&&!mine&&S.coopDis!==op.cid){html=`${op.mode==='crewhunt'?'⚔️':'🎣'} <b>${pname(o)} is waiting at the dock</b> for a ${op.mode==='crewhunt'?'crew hunt':'crew fishing trip'} · ${clockStr(op.left)} left <button class="btn sm primary" data-act="coopJoin">Climb aboard</button><button class="btn sm ghost" data-act="coopDismiss">Not now</button>`;cls='invite';}
  bar.hidden=!html;bar.className=cls;if(bar._h!==html){bar.innerHTML=html;bar._h=html;}$('#b_d')?.classList.toggle('heaveNow',!!pend.length);if($('#focus'))$('#fDm')?.classList.toggle('heaveNow',!!pend.length);
  coopNotify(cg);}
function coopNotify(cg){const now=Date.now();if(!S.giSeen){S.giSeen=new Set([...cg.list,...cg.lost].map(x=>x.id));S.coopLive=coopWindows().some(w=>w.live);return;}
  const live=coopWindows().some(w=>w.live);if(live&&!S.coopLive){toast(`<b>${pname(coopPartner())} climbed aboard!</b> Two rods in the water. Giants are biting.`,'level',4000);try{SND.chest();}catch(e){}}S.coopLive=live;
  cg.list.forEach(x=>{if(S.giSeen.has(x.id))return;S.giSeen.add(x.id);if(x.t<now-120000)return;S.lastCatch={f:x.g,v:x.v,at:performance.now()};if(x.g.id===MUM_ID)mumFx(x);else giantFx(x,cg);});
  cg.lost.forEach(x=>{if(S.giSeen.has(x.id))return;S.giSeen.add(x.id);if(x.t+HEAVE_MS<now-120000)return;toast(`<b>It got away!</b> Something about ${fmtN(Math.round(x.cm*1.6/100))} m long, honest. ${pname(x.heave)} needed to send a DM within 90 seconds.`,'joke',5200);});}
setInterval(()=>{try{coopTick();}catch(e){}},1000);
function giantFx(x,cg){const g=x.g,first=cg.by[g.id]===1,rec=cg.best[g.id]&&cg.best[g.id].id===x.id&&!first;const notes=[`Hooked by ${pname(x.hook)}, heaved in by ${pname(x.heave)}.`,`Weight: <b>${kgStr(x.kg,g)}</b>. Counts for both of you.`];
  if(first)notes.push('New giant for the crew log.');else if(rec)notes.push('New crew record for this giant.');if(x.v&&cg.vars[g.id+'~'+x.v]===1)notes.push(`First ${FISH_VARS[x.v].name} one.`);
  catchFx(x,'Crew catch!',notes);if(FISH_RI[g.rar]>=3){try{fireworks(FISH_RI[g.rar]>=4?4200:2600);}catch(e){}}try{SND.chest();}catch(e){}}

/* ---------- Bryn's Mum ---------- */
function mumFx(x){$('#mumFx')?.remove();const host=$('#focus')||document.body;
  const lines=['The sonar has run out of screen.','Both rods have bent into perfect circles.','Gary has fainted.','The tide went out. Then thought better of it.','A gull has started filming.','It is…','IT IS BRYN’S MUM.'];
  host.insertAdjacentHTML('beforeend',`<div id="mumFx"><div class="mumSea"></div><div class="mumLine" id="mumLine"></div>
   <div class="mumCard" id="mumCard" hidden><small>Crew catch · mythic · 1 in 5,000</small><canvas id="mumArt" width="720" height="420"></canvas>
    <h2>${x.v?FISH_VARS[x.v].name+' ':''}Bryn's Mum</h2><p><b>${cmStr(x.cm)}</b> long · weight: a lady never tells</p>
    <p class="cfNote">Hooked by ${pname(x.hook)}, heaved in by ${pname(x.heave)}. It took both of you, the anchor and a strongly worded prayer.</p>
    <div class="mumQuotes" id="mumQ"></div>
    <p class="cfNote">She has been gently released back into the sea, with a kiss on the cheek for each of you. Bryn, ring your mother.</p>
    <button class="btn primary" data-act="mumClose">Thank you, Mrs B</button></div></div>`);
  document.body.classList.add('quake');let i=0;const el=$('#mumLine');const step=()=>{if(!$('#mumFx'))return;if(i<lines.length){el.textContent=lines[i];el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');
    try{tone(i===lines.length-1?98:73+i*6,.6,'sawtooth',.05);tone(i===lines.length-1?147:110+i*5,.6,'triangle',.04,.05);}catch(e){}i++;S.mumT=setTimeout(step,i===lines.length?2200:1500);}
   else{document.body.classList.remove('quake');el.remove();$('#mumCard').hidden=false;mumPortrait(x.v);try{fireworks(7000,['#F7A8C4','#FFE08A','#9FD3F2','#C98BB0','#FFFFFF']);banner("BRYN'S MUM","The legend is real");}catch(e){}
     const qs=['She asks if you have both eaten.','She has brought a tray of sandwiches for the crew. Crusts off.','She says Bryn never rings.','She would like to know when you are both settling down.','She has tidied the ship. You cannot find anything now.'];let k=0;const q=$('#mumQ');const nq=()=>{if(!$('#mumFx')||k>=qs.length)return;q.insertAdjacentHTML('beforeend',`<p class="mumQ">“${qs[k]}”</p>`);k++;try{tone(660+k*40,.12,'sine',.04);}catch(e){}S.mumT=setTimeout(nq,1300);};nq();}};
  step();}
ACT.mumClose=()=>{clearTimeout(S.mumT);document.body.classList.remove('quake');$('#mumFx')?.remove();};

/* ---------- Trophy case: crew catches ---------- */
function crewCardHtml(){const cg=coopGiants(),ws=weekStart(G.today);const wk=cg.list.filter(x=>x.date>=ws&&x.g.id!==MUM_ID),all=cg.list.filter(x=>x.g.id!==MUM_ID);const top=l=>l.reduce((a,x)=>!a||x.kg>a.kg?x:a,null);const bw=top(wk),ba=top(all);const mumN=cg.by[MUM_ID]||0;
  const got=Object.keys(cg.by).length;const big=x=>x?`<b>${kgStr(x.kg,x.g)}</b><span>${x.v?FISH_VARS[x.v].name+' ':''}${esc(x.g.name)} · ${cmStr(x.cm)}</span><small>${pname(x.hook)} hooked, ${pname(x.heave)} heaved · ${shortDate(x.date)}</small>`:'<span>Nothing landed yet</span>';
  return `<div class="card crewC"><div class="row between"><h3>Crew catches</h3><span class="pill">${got}/${GIANTS.length} giants</span></div>
   <p class="tiny muted" style="margin:4px 0 8px">Giants only bite on crew trips (Lock In, then Crew trip). One of you hooks it, the other has 90 seconds to send a DM and heave it in. Everything landed on a crew trip counts for both of you.</p>
   <div class="weigh"><div class="lead"><b>This week's biggest joint catch</b>${big(bw)}</div><div><b>All-time biggest joint catch</b>${big(ba)}</div></div>
   <div class="row tiny" style="margin:6px 0">${cg.list.length} giant${cg.list.length===1?'':'s'} landed · ${cg.lost.length} got away${mumN?` · Bryn's Mum met ${mumN} time${mumN>1?'s':''}`:''}</div>
   ${GI_ORDER.map(r=>{const gs=GIANTS.filter(g=>g.rar===r);const n=gs.filter(g=>cg.by[g.id]).length;return `<div class="tRow"><small><span class="rtag r-${r}">${r}</span> ${n}/${gs.length}</small><div class="fishGrid">${gs.map(g=>{const k=cg.by[g.id]||0;const vs=['g','a','r'].filter(v=>cg.vars[g.id+'~'+v]);return `<button class="fishCell ${k?'got':''}" data-act="giantInfo" data-f="${g.id}" aria-label="${k?esc(g.name):'Unknown giant'}"><canvas class="fishIco" width="96" height="96" data-f="${g.id}" data-s="${k?0:1}"></canvas>${k>1?`<i>×${k}</i>`:''}${vs.length?`<em>${vs.map(v=>`<s style="background:${FISH_VARS[v].col}"></s>`).join('')}</em>`:''}</button>`;}).join('')}</div></div>`;}).join('')}</div>`;}
const _th12=trophyHtml;trophyHtml=function(p){const h=_th12(p);const i=h.indexOf('<div class="card trophy">');const cc=crewCardHtml();return i<0?h+cc:h.slice(0,i)+cc+h.slice(i);};
ACT.giantInfo=d=>{const g=FISH_BY_ID[d.f];if(!g)return;const cg=coopGiants();const k=cg.by[g.id]||0,b=cg.best[g.id];
  openModal(`<div class="fishInfo"><canvas class="fishIco big" width="320" height="320" data-f="${g.id}" data-s="${k?0:1}"></canvas><h2>${k?esc(g.name):'Unknown giant'}</h2><p><span class="rtag r-${g.rar}">${g.rar}</span> · crew trips only · 1 in ${fmtN(g.odds)} per DM</p>
   ${k?`<p>Typical length ${cmStr(g.len)}${g.id===MUM_ID?'':' · around '+kgStr(g.kg,g)}. Landed ${k} time${k>1?'s':''}.</p>${b?`<p>Crew record: <b>${cmStr(b.cm)}</b>, ${kgStr(b.kg,g)} · ${pname(b.hook)} hooked, ${pname(b.heave)} heaved · ${shortDate(b.date)}</p>`:''}<p class="tiny muted">${esc(GIANT_BLURB[g.id]||'Takes two rods and a lot of shouting.')}</p>
     <p class="tiny">Variants: ${['g','a','r'].map(v=>`${FISH_VARS[v].name} ${cg.vars[g.id+'~'+v]?'✓':'—'}`).join(' · ')}</p>`:'<p class="muted">Not landed yet. Go on a crew trip and keep both rods busy.</p>'}
   <button class="btn ghost" data-act="closeModal">Close</button></div>`);paintFish($('#modal'));};

/* ---------- Herald ---------- */
const _herald12=herald;herald=function(date){const h=_herald12(date);try{const l=coopGiants().list.filter(x=>x.date===date);if(l.some(x=>x.g.id===MUM_ID))h.head="BRYN'S MUM LANDED. BRYN UNAVAILABLE FOR COMMENT.";
  else{const b=l.sort((a,c)=>FISH_RI[c.g.rar]-FISH_RI[a.g.rar]||c.kg-a.kg)[0];if(b&&FISH_RI[b.g.rar]>=3&&!h.clients)h.head=`CREW HAULS ${kgStr(b.kg,b.g).toUpperCase()} ${b.g.name.toUpperCase()} FROM THE DEEP`;}}catch(e){}return h;};
function heraldFish(date){const cg=coopGiants();const l=cg.list.filter(x=>x.date===date),lost=cg.lost.filter(x=>x.date===date).length;if(!l.length)return lost?`${lost} giant${lost>1?'s':''} got away. The crew blames each other.`:'No crew trip. The giants had a lie-in.';
  const b=l.reduce((a,x)=>!a||x.kg>a.kg?x:a,null);return `${l.length} giant${l.length>1?'s':''} landed by the crew. Biggest: ${esc(b.g.name)}, ${kgStr(b.kg,b.g)}.${lost?` ${lost} got away.`:''}`;}

/* ---------- help ---------- */
(()=>{const i=HELP.findIndex(x=>x[0]==='Fishing rewards');HELP.splice(i<0?HELP.length:i+1,0,['Crew trips','Pick Crew trip in Lock In to fish together on one ship. A coin toss picks the captain, and you sail their ship. The other captain gets a call to the dock and can climb aboard any time while the trip runs. Normal fish still bite, and every fish either of you lands on a crew trip goes in both trophy cases (your personal biggest-catch records stay individual). Every DM also has a chance to hook one of 50 giants that only live out here: dolphins, sharks, whales, orcas, squid, serpents and stranger things, from 1 in 240 per DM up to 1 in 5,000 for the mythics. Giants come in all sizes and can be Golden, Albino or Rainbow. When one of you hooks a giant, the other has 90 seconds to send a DM and heave it in; miss it and it snaps the line. Landed giants count for both of you and go in the Crew catches section of the Trophy case, with this week\'s biggest joint catch and the all-time record. Rumour has it the biggest of them all is Bryn\'s Mum.']);})();

function mumPortrait(v){const cv=$('#mumArt');if(!cv)return;const c=cv.getContext('2d');const g=FISH_BY_ID[MUM_ID];const loop=()=>{if(!$('#mumArt'))return;const t=performance.now();c.setTransform(1,0,0,1,0,0);
  const bg=c.createLinearGradient(0,0,0,420);bg.addColorStop(0,'#FBE3EE');bg.addColorStop(.55,'#9FD3F2');bg.addColorStop(1,'#1F4E8C');c.fillStyle=bg;c.fillRect(0,0,720,420);
  for(let i=0;i<14;i++){const y=(420-((t/30+i*60)%460));c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.arc(60+((i*97)%600),y,3+i%4,0,TAU);c.fill();}
  c.setTransform(24,0,0,24,350,230+Math.sin(t/700)*6);c.rotate(Math.sin(t/900)*.04);if(v)drawFish(c,g,0,0,1,t,false,v);else drawGiant(c,g,t);requestAnimationFrame(loop);};loop();}
// leaving a crew trip always logs it, so the crew's catches never vanish
const _lockCancel12=ACT.lockCancel;ACT.lockCancel=async function(){const lk=S.players[S.me]?.lock;if(lk&&(lk.mode==='coop'||lk.mode==='crewhunt')){toast(`<b>Back to shore.</b> The crew trip is logged so nothing you both caught is lost.`);return finishLock(true);}return _lockCancel12.apply(this,arguments);};

/* ---------- variant viewer on fish and giant cards ---------- */
function addVarTabs(fid,caught){const cv=$('#modal canvas.fishIco.big');if(!cv||cv.dataset.s==='1')return;const b=(v,l)=>`<button class="${v===''?'on':''} ${v&&!caught[v]?'notYet':''}" data-act="fiVar" data-v="${v}"><i style="background:${v?FISH_VARS[v].col:'#9FD3F2'}"></i>${l}${v?(caught[v]?' ✓':''):''}</button>`;
  cv.insertAdjacentHTML('afterend',`<div class="varTabs">${b('','Normal')}${['g','a','r'].map(v=>b(v,FISH_VARS[v].name)).join('')}</div><small class="muted varNote" id="varNote">Tap a variant to see it.</small>`);}
ACT.fiVar=d=>{const cv=$('#modal canvas.fishIco.big');if(!cv)return;cv.dataset.v=d.v||'';document.querySelectorAll('#modal .varTabs button').forEach(x=>x.classList.toggle('on',x.dataset.v===(d.v||'')));paintFish($('#modal'));
  const n=$('#varNote');if(n){const c=n.dataset.c?JSON.parse(n.dataset.c):{};const miss=!!d.v&&!c[d.v];cv.style.filter=miss?'grayscale(1) brightness(1.05)':'';cv.style.opacity=miss?'.55':'';n.textContent=!d.v?'The everyday look.':c[d.v]?`You have caught a ${FISH_VARS[d.v].name} one.`:`Not caught yet. ${FISH_VARS[d.v].name} ones are rare.`;}};
const _fishInfo12=ACT.fishInfo;ACT.fishInfo=d=>{_fishInfo12(d);const f=FISH_BY_ID[d.f];const p=d.p||S.view.trophyP||S.me;const fc=fishCatches(p);const c={};['g','a','r'].forEach(v=>c[v]=!!fc.vars[f.id+'~'+v]);addVarTabs(f.id,c);const n=$('#varNote');if(n)n.dataset.c=JSON.stringify(c);};
const _giantInfo12=ACT.giantInfo;ACT.giantInfo=d=>{_giantInfo12(d);const cg=coopGiants();const c={};['g','a','r'].forEach(v=>c[v]=!!cg.vars[d.f+'~'+v]);addVarTabs(d.f,c);const n=$('#varNote');if(n)n.dataset.c=JSON.stringify(c);};

/* ---------- shop: full item details ---------- */
ACT.itemInfo=d=>{const it=ALL_ITEMS[d.id];if(!it)return;const me=G.players[S.me],pl=S.players[S.me]||{};const owned=me.owned[it.id],lock=itemLocked(it,me),eq=EQUIP_CATS.includes(it.cat)&&pl[it.cat]===it.id;const price=+(d.p||it.price||0);
  const act=owned&&it.cat!=='shield'?(EQUIP_CATS.includes(it.cat)?`<button class="btn ${eq?'':'primary'}" data-act="equip" data-id="${it.id}" data-cat="${it.cat}">${eq?'Wearing':'Use'}</button>`:'<p class="done">Owned</p>')
    :lock?`<p class="lockTxt">🔒 ${esc(lock)}</p>`:`<button class="btn primary" data-act="buy" data-id="${it.id}" data-p="${price}" ${me.balance<price?'disabled':''}>${CN} ${fmtN(price)}</button>`;
  const how=it.earn?`<p class="tiny">How to get it: ${esc(it.earn[2])}.</p>`:it.track?`<p class="tiny">A reward on the level track (level ${it.track}).</p>`:it.lvl?`<p class="tiny">Unlocks at level ${it.lvl}.</p>`:'';
  openModal(`<div class="itemInfo"><canvas class="icon big" id="itemInfoCv" data-id="${it.id}"></canvas><small class="muted">${esc(CAT_NAMES[it.cat]||it.cat)}${it.track?' · reward':it.earn?' · feat':''}</small><h2>${esc(it.name)}</h2>${it.desc?`<p>${esc(it.desc)}</p>`:''}${how}<div class="row" style="justify-content:center;gap:8px;margin-top:8px">${act}<button class="btn ghost" data-act="closeModal">Close</button></div></div>`);
  const cv=$('#itemInfoCv');if(cv)drawItemIcon(cv,it.id);};

/* ---------- mouse-friendly sideways rows ---------- */
document.addEventListener('wheel',e=>{const el=e.target.closest&&e.target.closest('.chips,.chipsRow');if(!el||el.scrollWidth<=el.clientWidth+2||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;el.scrollLeft+=e.deltaY;e.preventDefault();},{passive:false});
