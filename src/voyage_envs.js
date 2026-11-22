/* ============================== VOYAGE ENVIRONMENTS (21 Nov) ==============================
   Every Lock In voyage sails through a run of places, a new one every six minutes with a soft fade: the four coasts
   from Art stage B plus eleven painted worlds, each with its own colours, sky, scenery in three scrolling layers,
   a framing foreground, drifting particles, a few things that move (waterfalls, lava, lamps) and its own soundscape.
   Rare places turn up less often. The order is fixed per voyage (from the Lock In id), so both screens agree. */
const ENV_SEG=6*60000,ENV_FADE=30000,ENV_W=640;
const RNDK=(k)=>(h32(k)%100000)/100000;
// colours: sky (top, middle, horizon), far/mid/near land, island, beach, sea (horizon, middle, deep), fog, ripples, lamps lit
const ENVS=[
 {id:'fjord',name:'Pine Fjords',w:3},{id:'cliffs',name:'The Arches',w:3},{id:'ruins',name:'The Ruined Coast',w:3},{id:'isles',name:'Palm Isles',w:3},
 {id:'haunted',name:'Wreckers’ Bay',w:2,pal:{sky:['#0C2A2E','#1E5A58','#4A9A8E'],far:'#2E6A66',mid:'#1E4A4A',near:'#0E2A2E',isl:'#0A2024',beach:'#2A4A48',sea:['#3A8A80','#1A4A4C','#061618'],fog:'#7AD0C0',rip:'#A8F0E0',bld:'#123234',win:'#FFC46A',lit:true},sun:{x:92,y:30,moon:true,col:'200,255,235'},fx:'mist',sound:'haunted'},
 {id:'autumn',name:'The Amber Gorge',w:3,pal:{sky:['#E06A44','#F6A86A','#FFE0A8'],far:'#C8786A',mid:'#9A4A3A',near:'#5A2A22',isl:'#4A2018',beach:'#C88A5A',sea:['#F6B07A','#B0604A','#3A1A1A'],fog:'#FFD0A0',rip:'#FFE0B8',bld:'#5A2E22',win:'#FFC46A',lit:false},sun:{x:200,y:72,col:'255,220,150'},fx:'leaves',sound:'autumn'},
 {id:'sky',name:'The Sky Isles',w:1,rare:true,pal:{sky:['#3A2A7A','#9A6AD0','#F0B0E0'],far:'#B08AD8',mid:'#8A6AC0',near:'#5A3A8A',isl:'#4A2A6A',beach:'#C8A0E0',sea:['#C8A0E8','#7A5AB8','#2A1A5A'],fog:'#F0D0F8',rip:'#FFE8FF',bld:'#4A2A6A',win:'#FFD27A',lit:true},sun:{x:60,y:40,col:'255,220,240',planet:true},fx:'sparkle',sound:'sky'},
 {id:'winter',name:'Frostholm',w:2,pal:{sky:['#0E1A4A','#2A4A9A','#6A8AD0'],far:'#4A6AB0',mid:'#2E4A8A',near:'#1A2A5A',isl:'#14224A',beach:'#E8F0FF',sea:['#4A6AB0','#1E3070','#0A1030'],fog:'#A8C0F0',rip:'#D0E0FF',bld:'#22346A',win:'#FFC46A',lit:true},sun:{x:250,y:26,moon:true,col:'220,232,255',aurora:true},fx:'snow',sound:'winter',snow:true},
 {id:'desert',name:'The Sunken Sands',w:3,pal:{sky:['#E0583A','#F6A050','#FFD890'],far:'#E0905A',mid:'#C0703A',near:'#7A3A20',isl:'#5A2A18',beach:'#E8B070',sea:['#F8B070','#C06040','#4A1A14'],fog:'#FFD8A0',rip:'#FFE8C0',bld:'#7A3A20',win:'#FFC46A',lit:false},sun:{x:150,y:66,col:'255,230,170',big:true},fx:'dust',sound:'desert'},
 {id:'crystal',name:'The Crystal Caverns',w:1,rare:true,pal:{sky:['#06061E','#141450','#24308A'],far:'#2A2A6A',mid:'#1A1A4A',near:'#0E0E30',isl:'#0A0A24',beach:'#2A2A60',sea:['#2A5AC8','#14307A','#060A24'],fog:'#6A80F0',rip:'#9AF0FF',bld:'#14143A',win:'#9AF0FF',lit:true},sun:{x:160,y:20,none:true,col:'150,220,255'},fx:'spores',sound:'crystal'},
 {id:'blossom',name:'Blossom Isles',w:3,pal:{sky:['#5A3A8A','#C86AA0','#FFB0B8'],far:'#B080B0',mid:'#8A5A90',near:'#4A2A5A',isl:'#3A1E4A',beach:'#E0A0C0',sea:['#E8A0C0','#9A5A9A','#2A1A40'],fog:'#FFD0E0',rip:'#FFE0F0',bld:'#3E2450',win:'#FFC46A',lit:true},sun:{x:110,y:70,col:'255,220,200'},fx:'petals',sound:'blossom'},
 {id:'storm',name:'The Thunder Coast',w:2,pal:{sky:['#122230','#2E4A5A','#5E7E8A'],far:'#4A6A74',mid:'#2E4A54',near:'#16262E',isl:'#101E26',beach:'#3A4A50',sea:['#4E6E78','#22404A','#08161C'],fog:'#8AA4AE',rip:'#D0E8F0',bld:'#18262E',win:'#FFC46A',lit:true},sun:{x:200,y:30,none:true,col:'210,225,235'},fx:'rain',sound:'storm'},
 {id:'glacier',name:'The Glass Glacier',w:2,pal:{sky:['#141A5A','#3A3A9A','#7A6AC8'],far:'#7A90D8',mid:'#5A70C0',near:'#9EC0EE',isl:'#3A50A0',beach:'#E8F4FF',sea:['#4A5AB8','#22307A','#0A1040'],fog:'#B0C0F0',rip:'#D8E8FF',bld:'#2A3A80',win:'#FFC46A',lit:true},sun:{x:70,y:34,moon:true,col:'220,232,255',aurora:true},fx:'snow',sound:'glacier',snow:true},
 {id:'volcano',name:'The Ember Isles',w:1,rare:true,pal:{sky:['#3A1020','#A03030','#F07040'],far:'#7A3040',mid:'#5A2030',near:'#2A0E18',isl:'#200A12',beach:'#5A2020',sea:['#F07040','#902A2A','#2A0A10'],fog:'#F0905A',rip:'#FFC080',bld:'#2A0E18',win:'#FFB050',lit:true},sun:{x:140,y:70,col:'255,200,120',big:true},fx:'embers',sound:'volcano'},
 {id:'jungle',name:'The Emerald Temple',w:3,pal:{sky:['#0E3A3A','#2A7A6A','#9AD0A0'],far:'#3A8A7A',mid:'#226A5A',near:'#0E3A34',isl:'#0A2A26',beach:'#3A6A50',sea:['#4AA090','#1E5A54','#062420'],fog:'#A8E0C0',rip:'#C8FFE8',bld:'#0E3A34',win:'#FFC46A',lit:true},sun:{x:130,y:64,col:'255,240,170'},fx:'fireflies',sound:'jungle'}];
const ENV_BY=Object.fromEntries(ENVS.map(e=>[e.id,e]));
// this voyage's route: a weighted shuffle seeded by the Lock In, never the same place twice in a row
function envRoute(lk){const id=String(lk&&(lk.id||lk.s)||'x');if(envRoute._k===id)return envRoute._r;const pool=[];ENVS.forEach(e=>{for(let i=0;i<e.w;i++)pool.push(e.id);});const out=[];let last=null;
  for(let i=0;i<14;i++){let pick;for(let tries=0;tries<20;tries++){pick=pool[Math.floor(RNDK(id+'r'+i+'_'+tries)*pool.length)];if(pick!==last&&!out.slice(-3).includes(pick))break;}out.push(pick);last=pick;}envRoute._k=id;envRoute._r=out;return out;}
const ENVST={a:null,b:null,fade:0,shownAt:0,shownId:null};
/* 21 Nov: every monster fights in its own waters. While a hunt has a monster up, the scenery fades to the place that
   suits it (the Eye of the Hurricane brings the storm, ghosts bring the haunted reef, the Golden Leviathan the sky isles). */
const BOSS_ENV={grumbleflap:'fjord',pinch:'isles',inky:'crystal',drizzle:'storm',sidney:'isles',krabbington:'desert',squall:'storm',sloop:'cliffs',
  moby:'glacier',octavia:'crystal',twinfin:'jungle',fundraiser:'haunted',kraken:'volcano',eye:'storm',locker:'haunted',goldleviathan:'sky',calm:'fjord',rough:'isles',legend:'volcano',
  grumble:'storm',seenzone:'ruins',algo:'cliffs',ghostwell:'haunted',mondaymist:'haunted',outofoffice:'autumn',budgetbeast:'desert',aurora:'sky',ironclaw:'cliffs',frostfang:'glacier',
  pufferdread:'isles',shadowwing:'haunted',inkmaw:'crystal',shellback:'ruins',gulper:'crystal',lanternjaw:'haunted',moray:'cliffs',thornback:'ruins',hydra:'isles',bonefin:'volcano',
  brineback:'jungle',stormscale:'storm',mosswhisker:'jungle',duskfin:'desert',tidecaller:'crystal',rustgill:'ruins',urchin:'jungle',hollowshell:'isles',glimmer:'crystal',
  drownedbell:'haunted',mondaykraken:'fjord',weekendsiren:'blossom',admiralgull:'cliffs',icekraken:'glacier',grinchfish:'winter',xmaspast:'winter',krampus:'winter',leviathan:'storm',krakenqueen:'volcano'};
const TYPE_ENV={storm:'storm',ghost:'haunted',serpent:'ruins',crab:'isles',whale:'glacier',octopus:'crystal',kraken:'volcano',ship:'cliffs',seal:'fjord',squid:'crystal',jelly:'crystal',fish:'cliffs',puffer:'isles',ray:'autumn',shell:'ruins',eel:'crystal',blob:'jungle'};
function bossEnvId(mon){const e=BOSS_ENV[mon]||(typeof VOYAGE_DIFF!=='undefined'&&VOYAGE_DIFF[mon]&&TYPE_ENV[VOYAGE_DIFF[mon].type]);return e&&ENV_BY[e]?e:null;}
const ENVF={id:null,prev:null,at:0,lk:null};
function envForced(lk){try{if(!lk||lk.hv!==2||typeof huntLive!=='function')return null;const h=huntLive(lk);return h&&h.cur?bossEnvId(h.cur.mon):null;}catch(e){return null;}}
function envNow(){const lk=VOY.lk;if(!lk)return null;if(ENVF.lk!==lk.id){ENVF.lk=lk.id;ENVF.id=null;}const fz=envForced(lk)||(lk.hv===2?ENVF.id:null);
  if(fz){if(ENVF.id!==fz){ENVF.prev=ENVF.id||ENVST.shownId||fz;ENVF.id=fz;ENVF.at=performance.now();}const q=Math.min(1,(performance.now()-ENVF.at)/4000);
    const a=ENV_BY[ENVF.prev]||ENV_BY[fz],b=ENV_BY[fz];ENVST.a=q>=1?b:a;ENVST.b=b;ENVST.fade=q>=1?0:q;const cur=q>.5?b:a;if(ENVST.shownId!==cur.id){ENVST.shownId=cur.id;ENVST.shownAt=performance.now();ENVST.rareNote=false;}return ENVST;}
  if(ENVF.id){ENVF.id=null;}
  const r=envRoute(lk);const seg=Math.floor(VOY.el/ENV_SEG),into=VOY.el%ENV_SEG;const a=ENV_BY[r[seg%r.length]],b=ENV_BY[r[(seg+1)%r.length]];
  const fade=Math.max(0,(into-(ENV_SEG-ENV_FADE))/ENV_FADE);ENVST.a=a;ENVST.b=b;ENVST.fade=fade;const cur=fade>.5?b:a;if(ENVST.shownId!==cur.id){ENVST.shownId=cur.id;ENVST.shownAt=performance.now();ENVST.rareNote=!!cur.rare;}return ENVST;}
const envOn=()=>isArtLook()&&THEME.scene==='voyage'&&!!VOY.lk;
// palette: a place's own colours, or the time of day for the four coasts; blended during the fade
let ENV_PCACHE={k:'',p:null};
{const _ap2=artPal;artPal=function(mode){if(!envOn()||!ENVST.a)return _ap2.apply(this,arguments);const pa=ENVST.a.pal||_ap2.call(this,mode),pb=ENVST.b.pal||_ap2.call(this,mode);const f=Math.round(ENVST.fade*20)/20;if(f<=0)return pa;if(f>=1)return pb;
  const k=ENVST.a.id+ENVST.b.id+f+(ENVST.a.pal&&ENVST.b.pal?'':artMode());if(ENV_PCACHE.k===k)return ENV_PCACHE.p;ENV_PCACHE={k,p:mixPal(pa,pb,f)};return ENV_PCACHE.p;};}
const envPalOf=e=>e.pal||ART_PAL[artMode()]||ART_PAL.day;

/* ---------- scenery strips for each place (640 wide, base at the bottom, wrapped so they join up) ---------- */
function envTree(q,x,y,r,col,col2){q.fillStyle=col;q.beginPath();q.arc(x,y-r,r,0,TAU);q.arc(x-r*.7,y-r*.6,r*.7,0,TAU);q.arc(x+r*.7,y-r*.55,r*.75,0,TAU);q.fill();if(col2){q.fillStyle=col2;q.beginPath();q.arc(x-r*.3,y-r*1.25,r*.5,0,TAU);q.fill();}q.fillStyle=shadeHex(col,.6);q.fillRect(x-.6,y-r*.3,1.2,r*.4);}
function envArches(q,x,base,n,w,h,col){q.fillStyle=col;q.fillRect(x,base-h,n*w,h*.25);for(let i=0;i<=n;i++)q.fillRect(x+i*w-w*.14,base-h,w*.28,h);q.globalCompositeOperation='destination-out';for(let i=0;i<n;i++){q.beginPath();q.moveTo(x+i*w+w*.14,base);q.lineTo(x+i*w+w*.14,base-h*.5);q.quadraticCurveTo(x+i*w+w*.5,base-h*.82,x+(i+1)*w-w*.14,base-h*.5);q.lineTo(x+(i+1)*w-w*.14,base);q.closePath();q.fill();}q.globalCompositeOperation='source-over';}
function envCastle(q,x,base,s,col,lit,win){q.fillStyle=col;q.fillRect(x,base-14*s,22*s,14*s);[[0,22],[8,30],[17,25]].forEach(([dx,h])=>{q.fillRect(x+dx*s,base-h*s,5*s,h*s);q.beginPath();q.moveTo(x+dx*s-1,base-h*s);q.lineTo(x+dx*s+2.5*s,base-h*s-6*s);q.lineTo(x+dx*s+5*s+1,base-h*s);q.closePath();q.fill();});
  if(lit){q.fillStyle=win;[[10,-22],[2,-15],[19,-18]].forEach(([dx,dy])=>q.fillRect(x+dx*s,base+dy*s,1.6*s,2.4*s));}}
function envHouse(q,x,base,w,h,col,roof,win,lit,snow){q.fillStyle=col;q.fillRect(x,base-h,w,h);q.fillStyle=roof;q.beginPath();q.moveTo(x-1,base-h);q.lineTo(x+w/2,base-h-w*.6);q.lineTo(x+w+1,base-h);q.closePath();q.fill();if(snow){q.fillStyle='rgba(255,255,255,.9)';q.beginPath();q.moveTo(x-1,base-h);q.lineTo(x+w/2,base-h-w*.6);q.lineTo(x+w+1,base-h);q.lineTo(x+w/2,base-h-w*.42);q.closePath();q.fill();}
  if(lit){q.fillStyle=win;q.fillRect(x+w*.2,base-h*.7,w*.22,h*.28);q.fillRect(x+w*.58,base-h*.7,w*.22,h*.28);}}
// 22 Nov: a mound of land under a building so nothing hangs in the air
function envPlinth(q,x,base,w,h,col,lc){q.fillStyle=col;q.beginPath();q.moveTo(x-16,h+1);q.quadraticCurveTo(x-8,base+3,x-2,base);q.lineTo(x+w+2,base);q.quadraticCurveTo(x+w+8,base+3,x+w+16,h+1);q.closePath();q.fill();
  if(lc){q.fillStyle=lc;q.beginPath();q.moveTo(x-16,h+1);q.quadraticCurveTo(x-8,base+3,x-2,base);q.lineTo(x+3,base);q.quadraticCurveTo(x-2,base+6,x-6,h+1);q.closePath();q.fill();}}
// a cliff with a lip for a waterfall to pour from
function envCliff(q,x,top,h,col,lc,moss){q.fillStyle=col;q.beginPath();q.moveTo(x-20,h+1);q.lineTo(x-16,top+16);q.lineTo(x-11,top+3);q.lineTo(x-6,top);q.lineTo(x+12,top-1);q.lineTo(x+16,top+6);q.lineTo(x+19,top+20);q.lineTo(x+23,h+1);q.closePath();q.fill();
  q.fillStyle=lc;q.beginPath();q.moveTo(x-20,h+1);q.lineTo(x-16,top+16);q.lineTo(x-11,top+3);q.lineTo(x-6,top);q.lineTo(x-4,top+2);q.lineTo(x-9,top+18);q.lineTo(x-12,h+1);q.closePath();q.fill();
  if(moss){q.fillStyle=moss;q.beginPath();q.moveTo(x-12,top+3);q.quadraticCurveTo(x-6,top-4,x,top-1);q.quadraticCurveTo(x+7,top-5,x+15,top+4);q.lineTo(x+12,top+1);q.lineTo(x-6,top+1);q.closePath();q.fill();}}
function envFar(q,e,h){const P=envPalOf(e),sn=!!e.snow||artSnowy();
  if(e.id==='desert'){[[120,52,60],[300,36,44],[470,60,70]].forEach(([x,hh,hw])=>wrapX(xx=>{q.fillStyle=shadeHex(P.far,1.08);q.beginPath();q.moveTo(xx-hw,h);q.lineTo(xx,h-hh);q.lineTo(xx,h);q.closePath();q.fill();q.fillStyle=shadeHex(P.far,.86);q.beginPath();q.moveTo(xx,h-hh);q.lineTo(xx+hw,h);q.lineTo(xx,h);q.closePath();q.fill();},x));
    q.fillStyle=P.far;q.beginPath();q.moveTo(0,h);for(let x=0;x<=ENV_W;x+=8)q.lineTo(x,h-6-4*Math.sin(TAU*x/ENV_W*4));q.lineTo(ENV_W,h);q.closePath();q.fill();return;}
  if(e.id==='sky'){q.fillStyle=rgbaOf(P.fog,.6);for(let i=0;i<9;i++){const x=i*72+20,y=h-8-(i%3)*6;q.beginPath();q.ellipse(x,y,30,7,0,0,TAU);q.fill();}return;}
  if(e.id==='crystal'){q.fillStyle=P.far;q.beginPath();q.moveTo(0,h);for(let x=0;x<=ENV_W;x+=10)q.lineTo(x,h-30-14*Math.sin(TAU*x/ENV_W*5+1)-(h32('cf'+x)%9));q.lineTo(ENV_W,h);q.closePath();q.fill();return;}
  const pk=artPeaks(e.id+'far',e.id==='blossom'?6:10,0,ENV_W,h*.35,h*.82,28,48);pk.forEach(p=>wrapX(x=>artFacets(q,h,[[x,p[1],p[2],p[3]]],P.far,sn||e.id==='blossom'&&p[1]>h*.7),p[0]));
  if(e.id==='volcano')wrapX(x=>{q.fillStyle=P.mid;q.beginPath();q.moveTo(x-74,h);q.lineTo(x-11,h-68);q.lineTo(x-5,h-64);q.lineTo(x+5,h-64);q.lineTo(x+11,h-68);q.lineTo(x+74,h);q.closePath();q.fill();
    q.fillStyle=shadeHex(P.mid,1.18);q.beginPath();q.moveTo(x-74,h);q.lineTo(x-11,h-68);q.lineTo(x-4,h);q.closePath();q.fill();
    q.strokeStyle='#FF7A30';q.lineCap='round';[[-4,-22,1.6],[3,18,1.2],[-1,-40,1]].forEach(([dx,end,w])=>{q.lineWidth=w;q.beginPath();q.moveTo(x+dx,h-64);q.quadraticCurveTo(x+dx+end*.3,h-40,x+dx+end,h-14);q.stroke();});
    q.fillStyle='#FFB050';q.fillRect(x-6,h-66,12,2.4);},420);}
function envMid(q,e,h){const P=envPalOf(e),sn=!!e.snow||artSnowy(),lit=P.lit;
  if(e.id==='sky'){[[90,30,40,true],[330,22,28,false],[520,36,46,true]].forEach(([x,y,w,castle],i)=>wrapX(xx=>{q.fillStyle=P.mid;q.beginPath();q.moveTo(xx-w,h-y);q.quadraticCurveTo(xx-w*.2,h-y+4,xx,h-y+w*.9);q.quadraticCurveTo(xx+w*.25,h-y+4,xx+w,h-y);q.closePath();q.fill();q.fillStyle=shadeHex(P.mid,1.2);q.fillRect(xx-w,h-y-2,w*2,2.4);
      artPine(q,xx-w*.6,h-y-1,7,shadeHex(P.mid,.7),false);q.fillStyle='rgba(230,240,255,.75)';q.fillRect(xx+w*.3,h-y+w*.3,3,y-w*.3);if(castle)envCastle(q,xx-6,h-y-1,.55,shadeHex(P.mid,.75),lit,P.win);},x));return;}
  if(e.id==='crystal'){return;}
  const pk=artPeaks(e.id+'mid',8,0,ENV_W,h*.25,h*.6,20,32);pk.forEach(p=>wrapX(x=>artFacets(q,h,[[x,p[1],p[2],p[3]]],P.mid,sn),p[0]));
  if(e.id==='haunted')wrapX(x=>{envPlinth(q,x,h-18,17.6,h,P.mid,shadeHex(P.mid,1.12));envCastle(q,x,h-18,.8,shadeHex(P.mid,.8),true,'#FFC46A');},470);
  if(e.id==='autumn')wrapX(x=>{envPlinth(q,x,h-20,17.6,h,P.mid,shadeHex(P.mid,1.12));envCastle(q,x,h-20,.8,shadeHex(P.mid,.85),false);},520);
  if(e.id==='glacier')wrapX(x=>{envPlinth(q,x,h-24,19.8,h,P.mid,'rgba(255,255,255,.55)');envCastle(q,x,h-24,.9,shadeHex(P.mid,.75),true,'#FFC46A');},540);
  if(e.id==='blossom')wrapX(x=>{q.fillStyle=P.mid;q.beginPath();q.moveTo(x-34,h+1);q.lineTo(x,h-48);q.lineTo(x+34,h+1);q.closePath();q.fill();q.fillStyle=shadeHex(P.mid,1.14);q.beginPath();q.moveTo(x-34,h+1);q.lineTo(x,h-48);q.lineTo(x-4,h+1);q.closePath();q.fill();q.fillStyle='#FFFFFF';q.globalAlpha=.9;q.beginPath();q.moveTo(x-10,h-36);q.lineTo(x,h-48);q.lineTo(x+10,h-36);q.lineTo(x+5,h-38);q.lineTo(x,h-35);q.lineTo(x-5,h-38);q.closePath();q.fill();q.globalAlpha=1;},300);}
function envNear(q,e,h){const P=envPalOf(e),col=P.near,dk=shadeHex(P.near,.75),lc=shadeHex(P.near,1.18),sn=!!e.snow,lit=P.lit,win=P.win;const id=e.id;const anim=[];
  const hill=(amp,base,f1,f2,c)=>{q.fillStyle=c||col;q.beginPath();q.moveTo(0,h+1);for(let x=0;x<=ENV_W;x+=4)q.lineTo(x,h-(base+amp*Math.sin(TAU*x/ENV_W*f1)+amp*.5*Math.sin(TAU*x/ENV_W*f2+1)));q.lineTo(ENV_W,h+1);q.closePath();q.fill();};
  const hy=(x,amp,base,f1,f2)=>h-(base+amp*Math.sin(TAU*x/ENV_W*f1)+amp*.5*Math.sin(TAU*x/ENV_W*f2+1));
  if(id==='haunted'){hill(6,8,3,7);for(let i=0;i<9;i++){const x=20+i*70+(h32('ht'+i)%20);const y=hy(x,6,8,3,7)+2;q.strokeStyle=dk;q.lineWidth=1.4;q.lineCap='round';q.beginPath();q.moveTo(x,y);q.lineTo(x+1,y-16);q.moveTo(x+1,y-10);q.lineTo(x-6,y-16);q.moveTo(x+1,y-13);q.lineTo(x+7,y-20);q.moveTo(x-6,y-16);q.lineTo(x-9,y-17);q.stroke();}
    wrapX(x=>{q.fillStyle=col;q.beginPath();q.moveTo(x-30,h+1);q.lineTo(x-24,h-26);q.lineTo(x+14,h-30);q.lineTo(x+26,h+1);q.closePath();q.fill();q.fillStyle=lc;q.fillRect(x-6,h-54,9,25);q.fillStyle=dk;q.fillRect(x-8,h-56,13,3);q.fillStyle='#FFE7A6';q.fillRect(x-4.4,h-62,5.8,5);q.fillStyle=dk;q.beginPath();q.moveTo(x-6,h-62);q.lineTo(x-1.5,h-67);q.lineTo(x+3,h-62);q.closePath();q.fill();},250);anim.push({t:'beam',x:248.5,y:h-59.5});
    envArches(q,60,h-4,4,12,18,dk);[[400,0],[430,1],[452,0]].forEach(([x,k])=>{q.strokeStyle=dk;q.lineWidth=2.2;q.beginPath();q.moveTo(x,h+1);q.quadraticCurveTo(x+(k?-6:6),h-12,x+(k?-2:10),h-20-(k*4));q.stroke();});}
  else if(id==='autumn'){hill(7,14,3,8);const reds=['#C8442A','#E0702A','#B8301E','#E8A03A'];for(let x=4;x<ENV_W;x+=7){const y=hy(x,7,14,3,8)+3;envTree(q,x,y,4+(h32('at'+x)%3),mixHex(reds[h32('ac'+x)%4],P.near,.35),mixHex('#F0A040',P.near,.3));}
    wrapX(x=>envArches(q,x,h-2,6,13,26,lc),180);wrapX(x=>{q.fillStyle=col;q.fillRect(x,h-44,30,45);q.fillStyle=lc;q.fillRect(x,h-44,10,45);},430);anim.push({t:'fall',x:446,y:h-42,w:8,hh:42,col:'230,240,255'});}
  else if(id==='sky'){q.fillStyle=rgbaOf(P.fog,.85);for(let i=0;i<14;i++){const x=i*48+10,r=10+(h32('sc'+i)%8);q.beginPath();q.arc(x,h-2,r,Math.PI,0);q.arc(x+r*.9,h,r*.75,Math.PI,0);q.fill();}}
  else if(id==='winter'){hill(8,12,2,6);for(let x=3;x<ENV_W;x+=6){const y=hy(x,8,12,2,6)+3;artPine(q,x,y,8+(h32('wp'+x)%7),dk,true);}
    [[110,7],[150,9],[168,7],[380,8],[400,10],[560,8]].forEach(([x,w],i)=>{const y=hy(x,8,12,2,6)+4;envHouse(q,x,y,w,w*.9,mixHex(['#6A4A3A','#8A5A40','#4A5A7A'][i%3],P.near,.35),mixHex('#3A2A30',P.near,.3),win,lit,true);if(lit)anim.push({t:'glow',x:x+w/2,y:y-w*.5});});}
  else if(id==='desert'){const dy=x=>h-(6+5*Math.sin(TAU*x/ENV_W*5)+3*Math.sin(TAU*x/ENV_W*11));
    [[60,1],[230,2],[410,1]].forEach(([x,n])=>wrapX(xx=>envArches(q,xx,h+1,n,16,29,lc),x));
    q.fillStyle=col;q.beginPath();q.moveTo(0,h+1);for(let x=0;x<=ENV_W;x+=6)q.lineTo(x,dy(x));q.lineTo(ENV_W,h+1);q.closePath();q.fill();
    for(let i=0;i<8;i++){const x=30+i*80+(h32('dp'+i)%30);try{palm.call(null,q,x,dy(x)+1.5,10+(h32('dh'+i)%6),i*300);}catch(err){}}}
  else if(id==='crystal'){q.fillStyle=col;q.beginPath();q.moveTo(0,h+1);for(let x=0;x<=ENV_W;x+=6)q.lineTo(x,h-(14+10*Math.sin(TAU*x/ENV_W*3)+8*Math.abs(Math.sin(TAU*x/ENV_W*9))));q.lineTo(ENV_W,h+1);q.closePath();q.fill();
    for(let i=0;i<16;i++){const x=10+i*40+(h32('cx'+i)%20),y=h-(14+10*Math.sin(TAU*x/ENV_W*3))+4;const c1=i%3?'#8AE8FF':'#C89AFF';for(let k=0;k<3;k++){const ch=8+(h32('cc'+i+k)%10),cx=x+k*3-3,lean=(k-1)*.25;q.fillStyle=c1;q.globalAlpha=.85;q.beginPath();q.moveTo(cx-1.6,y);q.lineTo(cx+lean*ch,y-ch);q.lineTo(cx+1.6,y);q.closePath();q.fill();}q.globalAlpha=1;anim.push({t:'crystal',x,y:y-6,col:i%3?'138,232,255':'200,154,255'});}
    for(let i=0;i<10;i++){const x=30+i*62,y=h-4;const c1=i%2?'#FF8AE0':'#7AF0FF';q.fillStyle=mixHex(c1,'#FFFFFF',.2);q.fillRect(x-.5,y-6,1,6);q.beginPath();q.ellipse(x,y-6,4,2.4,0,Math.PI,0);q.fill();}
    [[200,46],[480,52]].forEach(([x,hh])=>{envCliff(q,x+3.5,h-hh,h,shadeHex(col,1.05),shadeHex(col,1.35),null);for(let k=0;k<3;k++){const cx=x-10+k*9,cy=h-hh+4+(k%2)*3;q.fillStyle=k%2?'#C89AFF':'#8AE8FF';q.globalAlpha=.8;q.beginPath();q.moveTo(cx-1.4,cy+5);q.lineTo(cx,cy-3);q.lineTo(cx+1.4,cy+5);q.closePath();q.fill();q.globalAlpha=1;}anim.push({t:'fall',x,y:h-hh,w:7,hh,col:'130,220,255'});});}
  else if(id==='blossom'){hill(7,12,3,7);for(let x=4;x<ENV_W;x+=8){const y=hy(x,7,12,3,7)+3;envTree(q,x,y,4+(h32('bt'+x)%3),mixHex('#F4A0C8',P.near,.25),mixHex('#FFD0E8',P.near,.2));}
    [[150,1],[470,1.2]].forEach(([x,s])=>wrapX(xx=>{const base=hy(xx,7,12,3,7)+2;q.fillStyle=dk;for(let k=0;k<3;k++){const w=(14-k*3.5)*s,y=base-k*7*s;q.fillRect(xx-w/2+1,y-6*s,w-2,6*s);q.beginPath();q.moveTo(xx-w/2-3,y-6*s);q.quadraticCurveTo(xx,y-9*s,xx+w/2+3,y-6*s);q.lineTo(xx+w/2,y-5*s);q.lineTo(xx-w/2,y-5*s);q.closePath();q.fill();if(lit){q.fillStyle=win;q.fillRect(xx-1,y-4.6*s,2,2.4);q.fillStyle=dk;}}},x));
    wrapX(xx=>{const ys=hy(xx,7,12,3,7)+3,ye=hy(xx+36,7,12,3,7)+3;q.fillStyle=P.sea[1];q.beginPath();q.moveTo(xx+2,ys);q.quadraticCurveTo(xx+18,Math.max(ys,ye)+4,xx+34,ye);q.lineTo(xx+38,h+1);q.lineTo(xx-2,h+1);q.closePath();q.fill();
      q.strokeStyle=rgbaOf(P.rip,.7);q.lineWidth=.6;for(let k=0;k<3;k++){q.beginPath();q.moveTo(xx+8+k*7,h-5+k*1.5);q.lineTo(xx+13+k*7,h-5+k*1.5);q.stroke();}
      const top=Math.min(ys,ye)-12;q.strokeStyle=dk;q.lineWidth=2;q.beginPath();q.moveTo(xx,ys);q.quadraticCurveTo(xx+18,top,xx+36,ye);q.stroke();q.lineWidth=.6;
      for(let k=1;k<6;k++){const u=k/6,x=xx+36*u,y=(1-u)*(1-u)*ys+2*u*(1-u)*top+u*u*ye;q.beginPath();q.moveTo(x,y);q.lineTo(x,y-4);q.stroke();}q.beginPath();q.moveTo(xx,ys-4);q.quadraticCurveTo(xx+18,top-4,xx+36,ye-4);q.stroke();},300);}
  else if(id==='storm'){[[30,40,14],[110,58,10],[160,34,12],[330,52,13],[420,30,9],[560,46,12]].forEach(([x,hh,w])=>wrapX(xx=>{q.fillStyle=col;q.beginPath();q.moveTo(xx-w,h+1);q.lineTo(xx-w*.6,h-hh*.7);q.lineTo(xx-w*.2,h-hh);q.lineTo(xx+w*.5,h-hh*.85);q.lineTo(xx+w,h+1);q.closePath();q.fill();q.fillStyle=lc;q.beginPath();q.moveTo(xx-w,h+1);q.lineTo(xx-w*.6,h-hh*.7);q.lineTo(xx-w*.2,h-hh);q.lineTo(xx-w*.1,h+1);q.closePath();q.fill();},x));
    wrapX(x=>{q.fillStyle=col;q.beginPath();q.moveTo(x-34,h+1);q.lineTo(x-28,h-24);q.lineTo(x+30,h-28);q.lineTo(x+40,h+1);q.closePath();q.fill();envCastle(q,x-12,h-26,.9,dk,true,'#FFC46A');},480);}
  else if(id==='glacier'){[[40,44,26],[150,30,20],[300,50,30],[470,38,24],[590,28,18]].forEach(([x,hh,w],i)=>wrapX(xx=>{q.fillStyle=col;q.beginPath();q.moveTo(xx-w,h+1);q.lineTo(xx-w*.8,h-hh*.8);q.lineTo(xx-w*.2,h-hh);q.lineTo(xx+w*.6,h-hh*.9);q.lineTo(xx+w,h+1);q.closePath();q.fill();
      q.fillStyle='rgba(255,255,255,.75)';q.beginPath();q.moveTo(xx-w*.8,h-hh*.8);q.lineTo(xx-w*.2,h-hh);q.lineTo(xx+w*.6,h-hh*.9);q.lineTo(xx+w*.5,h-hh*.8);q.lineTo(xx-w*.2,h-hh*.9);q.closePath();q.fill();q.fillStyle=shadeHex(col,.8);q.fillRect(xx+w*.1,h-hh*.8,w*.5,hh*.8);
      if(i===2){q.fillStyle=P.sea[1];q.beginPath();q.moveTo(xx-8,h+1);q.lineTo(xx-8,h-12);q.quadraticCurveTo(xx,h-22,xx+8,h-12);q.lineTo(xx+8,h+1);q.closePath();q.fill();}},x));}
  else if(id==='volcano'){[[40,36,40],[260,28,30],[470,40,44]].forEach(([x,hh,w],ci)=>wrapX(xx=>{q.fillStyle=col;q.beginPath();q.moveTo(xx-w,h+1);q.lineTo(xx-w*.85,h-hh*.7);q.lineTo(xx-w*.6,h-hh*.8);q.lineTo(xx-w*.45,h-hh);q.lineTo(xx-w*.1,h-hh*.92);q.lineTo(xx+w*.2,h-hh*1.05);q.lineTo(xx+w*.5,h-hh*.8);q.lineTo(xx+w*.75,h-hh*.62);q.lineTo(xx+w*1.05,h+1);q.closePath();q.fill();
      q.fillStyle=lc;q.beginPath();q.moveTo(xx-w,h+1);q.lineTo(xx-w*.85,h-hh*.7);q.lineTo(xx-w*.6,h-hh*.8);q.lineTo(xx-w*.45,h-hh);q.lineTo(xx-w*.4,h+1);q.closePath();q.fill();},x));
    wrapX(x=>{envArches(q,x,h+1,3,14,28,lc);q.fillStyle=col;q.beginPath();q.moveTo(x-14,h+1);q.lineTo(x-6,h-7);q.lineTo(x+10,h-9);q.lineTo(x+30,h-6);q.lineTo(x+48,h-8);q.lineTo(x+58,h+1);q.closePath();q.fill();},150);[[66,30],[488,34]].forEach(([x,hh])=>anim.push({t:'lava',x,y:h-hh,w:3,hh}));}
  else if(id==='jungle'){hill(9,14,3,7);for(let x=3;x<ENV_W;x+=6){const y=hy(x,9,14,3,7)+4;envTree(q,x,y,4.5+(h32('jt'+x)%3),mixHex('#2A7A4A',P.near,.45),mixHex('#4A9A5A',P.near,.4));}
    for(let i=0;i<7;i++){const x=40+i*90;try{palm.call(null,q,x,hy(x,9,14,3,7)-2,12,i*200);}catch(err){}}
    wrapX(x=>{const base=hy(x,9,14,3,7)+4;q.fillStyle=lc;for(let k=0;k<4;k++){const w=34-k*7;q.fillRect(x-w/2,base-8-k*7,w,8);}q.fillStyle=dk;q.fillRect(x-3,base-34,6,6);if(lit){q.fillStyle=win;q.fillRect(x-1.6,base-33,3.2,4.6);anim.push({t:'glow',x,y:base-31});}},420);
    wrapX(x=>{[x-2,x+46].forEach((px,k)=>{q.fillStyle=k?col:lc;q.beginPath();q.moveTo(px-8,h+1);q.lineTo(px-5,h-26);q.lineTo(px-2,h-31);q.lineTo(px+3,h-32);q.lineTo(px+6,h-25);q.lineTo(px+8,h+1);q.closePath();q.fill();envTree(q,px,h-30,3.6,mixHex('#2A7A4A',P.near,.45),mixHex('#4A9A5A',P.near,.4));});
      q.strokeStyle=dk;q.lineWidth=.7;q.beginPath();q.moveTo(x,h-30);q.quadraticCurveTo(x+22,h-22,x+44,h-30);q.stroke();q.beginPath();q.moveTo(x,h-34);q.quadraticCurveTo(x+22,h-27,x+44,h-34);q.stroke();for(let k=1;k<8;k++){const u=k/8;q.beginPath();q.moveTo(x+44*u,h-30+8*4*u*(1-u)*.9);q.lineTo(x+44*u,h-34+7*4*u*(1-u)*.9);q.stroke();}},460);
    envCliff(q,133.5,h-44,h,shadeHex(col,1.1),shadeHex(col,1.35),mixHex('#3A9A5A',P.near,.35));anim.push({t:'fall',x:130,y:h-44,w:7,hh:44,col:'210,255,240'});}
  else{voyNear(q,id,h,P,artSnowy(),artLitNow());}
  return anim;}

/* ---------- the sky of each place ---------- */
function envSky(c,t,e,alpha){const P=envPalOf(e);const y0=ART_HZ.voyage;c.save();c.globalAlpha=alpha;const g=c.createLinearGradient(0,-40,0,y0);g.addColorStop(0,P.sky[0]);g.addColorStop(.55,P.sky[1]);g.addColorStop(1,P.sky[2]);c.fillStyle=g;c.fillRect(-90,-300,W+180,y0+300);
  const nightNow=artMode()==='night';const s=e.sun||(nightNow?{x:236,y:28,moon:true,col:'225,232,255'}:{x:58,y:30,col:'255,250,215'});const dark=!!(s.moon||s.none||e.id==='crystal');
  if(s.moon||e.id==='crystal'||e.id==='winter'||e.id==='sky'||e.id==='glacier'){layerCache(c,'envstars_'+e.id,-90,-290,W+180,y0+290,q=>{for(let i=0;i<120;i++){const x=(h32('es'+e.id+i)%(W+180))-90,y=-290+(h32('ey'+e.id+i)%(y0+250));q.fillStyle=`rgba(255,255,255,${.25+(h32('ea'+i)%60)/100})`;q.beginPath();q.arc(x,y,.25+(h32('er'+i)%50)/100,0,TAU);q.fill();}});}
  if(s.aurora){c.save();c.globalCompositeOperation='lighter';for(let k=0;k<3;k++){c.beginPath();for(let x=-60;x<=W+60;x+=6){const y=20+k*9+Math.sin(x/38+t/2600+k)*9;x===-60?c.moveTo(x,y):c.lineTo(x,y);}const gg=c.createLinearGradient(0,0,0,70);const col=k===1?'150,110,255':'94,240,192';gg.addColorStop(0,`rgba(${col},0)`);gg.addColorStop(.5,`rgba(${col},${.22*alpha})`);gg.addColorStop(1,`rgba(${col},0)`);c.strokeStyle=gg;c.lineWidth=22;c.stroke();}c.restore();}
  if(s.planet){glowAt(c,s.x,s.y,60,'255,200,240',.3);disc(c,s.x,s.y,26,'#E0A0C8');c.globalAlpha=alpha*.35;disc(c,s.x-8,s.y-6,8,'#F4C0E0');disc(c,s.x+10,s.y+8,5,'#C080B0');c.globalAlpha=alpha;disc(c,250,26,4,'#F4D0F0');}
  else if(s.moon){glowAt(c,s.x,s.y,46,s.col,.35);if(e.id==='haunted'){disc(c,s.x,s.y,16,'#D8F8EA');c.globalAlpha=alpha*.25;disc(c,s.x-5,s.y-3,4,'#9ACABA');disc(c,s.x+6,s.y+5,3,'#9ACABA');c.globalAlpha=alpha;}else{c.fillStyle='#F4F0DA';c.beginPath();c.arc(s.x,s.y,7,-Math.PI/2,Math.PI/2,true);c.ellipse(s.x,s.y,5.4,7,0,Math.PI/2,-Math.PI/2,false);c.fill();}}
  else if(!s.none){glowAt(c,s.x,s.y,s.big?120:80,s.col,.5);glowAt(c,s.x,s.y,24,s.col,.6);disc(c,s.x,s.y,s.big?18:12,`rgb(${s.col})`);}
  if(e.id==='storm'){for(let i=0;i<6;i++){const x=((i*70+t/180)%(W+160))-80,y=6+(i%3)*12;c.fillStyle=rgbaOf(shadeHex(P.sky[0],1.25),.9);c.beginPath();c.ellipse(x,y,62,17,0,0,TAU);c.fill();}}
  if(e.id==='volcano'){for(let i=0;i<5;i++){const q=((t/4000)+i/5)%1;c.fillStyle=`rgba(40,20,26,${.55*(1-q)})`;c.beginPath();c.arc(ENV_VOLC.x+Math.sin(q*4+i)*10+q*30,y0-70-q*60,8+q*24,0,TAU);c.fill();}glowAt(c,ENV_VOLC.x,y0-66,30,'255,120,50',.4+.15*Math.sin(t/300));}
  if(!dark&&e.id!=='storm')ART_STREAKS.forEach(([x0,y,w],i)=>{const x=((x0+t/(400+i*90))%(W+120))-60;rr(c,x,y,w,1.6,.8,rgbaOf(P.fog,.5));});
  c.restore();}
const ENV_VOLC={x:0};
/* ---------- the backdrop: three layers, current place and the next one during the fade ---------- */
function envBackdrop(c,t){const y0=ART_HZ.voyage;const st=ENVST;const draw=(e,alpha)=>{if(alpha<=0)return;const k=e.id+(e.pal?'':'_'+artMode()+(artSnowy()?'s':''));
    const far=artStrip(c,'efar'+k,ENV_W,80,q=>envFar(q,e,80));stripLoop(c,far,ENV_W,80,y0,VOY.off*.12,alpha);
    if(e.id==='volcano'){const off=VOY.off*.12;let vx=420-(((off%ENV_W)+ENV_W)%ENV_W)-90;if(vx<-100)vx+=ENV_W;ENV_VOLC.x=vx;}
    c.save();c.globalAlpha=alpha;artFog(c,y0,32,envPalOf(e).fog,.55);c.restore();
    const mid=artStrip(c,'emid'+k,ENV_W,60,q=>envMid(q,e,60));stripLoop(c,mid,ENV_W,60,y0,VOY.off*.3,alpha);
    c.save();c.globalAlpha=alpha;artFog(c,y0+1,14,envPalOf(e).fog,.45);c.restore();
    let spots=null;const near=artStrip(c,'enear'+k,ENV_W,62,q=>{spots=envNear(q,e,62);});if(spots)ENV_ANIM[k]=spots;stripLoop(c,near,ENV_W,62,y0+.5,VOY.off,alpha);return {cv:near,k};};
  const A=draw(st.a,1-st.fade);const B=st.fade>0?draw(st.b,st.fade):null;VOY.cvCur=A?A.cv:null;VOY.cvNxt=B?B.cv:null;VOY.fade=st.fade;
  // moving bits on the near shore: waterfalls, lava, lamps, crystals, the lighthouse beam
  [[A,1-st.fade,st.a],[B,st.fade,st.b]].forEach(([X,al,e])=>{if(!X||al<=0)return;const spots=ENV_ANIM[X.k];if(!spots)return;const off=(((VOY.off%ENV_W)+ENV_W)%ENV_W);c.save();c.globalAlpha=al;
    spots.forEach(s=>{for(const base of [-ENV_W,0,ENV_W]){const x=s.x+base-off-90;if(x<-40||x>W+40)continue;const y=y0-62+.5+s.y;envAnim(c,t,s,x,y);}});c.restore();});}
const ENV_ANIM={};
function envAnim(c,t,s,x,y){if(s.t==='fall'||s.t==='lava'){const lava=s.t==='lava';const col=lava?'255,150,60':s.col;c.fillStyle=`rgba(${col},${lava?.9:.75})`;c.fillRect(x,y,s.w,s.hh);for(let i=0;i<6;i++){const q=((t/(lava?900:420))+i/6)%1;c.fillStyle=lava?`rgba(255,230,140,${.7*(1-q)})`:`rgba(255,255,255,${.6*(1-q)})`;c.fillRect(x+((i*1.7)%s.w),y+q*s.hh,1,4);}
    glowAt(c,x+s.w/2,y+s.hh,lava?16:10,lava?'255,140,60':'230,245,255',lava?.6:.35);for(let i=0;i<4;i++){const q=((t/700)+i/4)%1;disc(c,x+s.w/2+(i-1.5)*3,y+s.hh-q*3,1+q*2,lava?`rgba(255,180,90,${.5*(1-q)})`:`rgba(255,255,255,${.4*(1-q)})`);}}
  else if(s.t==='glow'){glowAt(c,x,y,7,'255,190,100',.35+.12*Math.sin(t/300+x));}
  else if(s.t==='crystal'){glowAt(c,x,y,10,s.col,.35+.2*Math.sin(t/600+x*.3));}
  else if(s.t==='beam'){const a=Math.sin(t/2400)*.8+.2;c.save();c.globalCompositeOperation='lighter';const L=140;const g=c.createLinearGradient(x,y,x+Math.cos(a)*L,y+Math.sin(a)*L*.25);g.addColorStop(0,'rgba(220,255,240,.4)');g.addColorStop(1,'rgba(220,255,240,0)');c.fillStyle=g;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a-.07)*L,y+Math.sin(a-.07)*L*.25-8);c.lineTo(x+Math.cos(a+.07)*L,y+Math.sin(a+.07)*L*.25+8);c.closePath();c.fill();c.restore();glowAt(c,x,y,10,'255,236,170',.6);}}
/* ---------- the voyage sky, taken over while a place is showing ---------- */
{const _skyE=sky;sky=function(c,t,opts={}){if(!envOn())return _skyE.apply(this,arguments);envNow();const st=ENVST;const e=st.fade>.5?st.b:st.a;const s=e.sun||{};const mode=e.pal?(s.moon||s.none?'night':s.big?'sunset':'day'):skyPhase()==='dusk'?'night':skyPhase();
  SUN={x:s.x||58,y:s.y||30,night:!!(s.moon||s.none),col:s.col||'255,250,215',mode};if(!e.pal){return _skyE.apply(this,arguments);}
  SKY_TOP=artPal().sky[0];envSky(c,t,st.a,1);if(st.fade>0)envSky(c,t,st.b,st.fade);envBackdrop(c,t);runLayers('sky',c,t,{mode,night:SUN.night,opts});
  if(opts.rainbow){['#E0453B','#F2A33A','#F2D24A','#5DBE9C','#4A7EC2','#9B5DE5'].forEach((col,i)=>{c.strokeStyle=col;c.globalAlpha=.26;c.lineWidth=2.4;c.beginPath();c.arc(200,140,90-i*2.4,Math.PI,TAU);c.stroke();});c.globalAlpha=1;}};}
// the four coasts still use the Stage B backdrop but now follow the route
{const _vb=artVoyBackdrop;artVoyBackdrop=function(c){if(!envOn()||!ENVST.a)return _vb.apply(this,arguments);envBackdrop(c,performance.now());};}

/* ---------- foreground framing: branches, leaves, rocks and ice at the edges of the view ---------- */
function envFrame(c,t,e,alpha){const P=envPalOf(e);const L=-VIEW_EXT.side-2,R_=W+VIEW_EXT.side+2,T=-VIEW_EXT.top-2,B=H+VIEW_EXT.bot+2;const dk=shadeHex(P.near,.55);c.save();c.globalAlpha=alpha;const id=e.id;
  const branch=(x0,y0,dir,col,leaf,n)=>{c.strokeStyle=col;c.lineCap='round';c.lineWidth=4;c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo(x0+dir*30,y0+14,x0+dir*62,y0+22);c.stroke();c.lineWidth=2;c.beginPath();c.moveTo(x0+dir*26,y0+11);c.quadraticCurveTo(x0+dir*34,y0+26,x0+dir*30,y0+36);c.moveTo(x0+dir*48,y0+18);c.lineTo(x0+dir*58,y0+8);c.stroke();
    if(leaf)for(let i=0;i<n;i++){const u=(h32(id+'lf'+i)%1000)/1000,v=(h32(id+'lv'+i)%1000)/1000;const lx=x0+dir*(10+u*58),ly=y0+6+u*16+(v-.5)*22+Math.sin(t/900+i)*.8;c.fillStyle=leaf[i%leaf.length];c.beginPath();c.ellipse(lx,ly,3.4,2.2,u*3,0,TAU);c.fill();}};
  const rocks=(x,y,dir,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(x,y);c.lineTo(x+dir*8,y-16);c.lineTo(x+dir*26,y-22);c.lineTo(x+dir*44,y-8);c.lineTo(x+dir*56,y);c.closePath();c.fill();c.fillStyle=shadeHex(col,1.3);c.beginPath();c.moveTo(x+dir*8,y-16);c.lineTo(x+dir*26,y-22);c.lineTo(x+dir*22,y-10);c.closePath();c.fill();};
  const leaves=(x,y,dir,col,n)=>{for(let i=0;i<n;i++){const a=(-Math.PI/2)+dir*(.2+i*.32)+Math.sin(t/1400+i)*.04;const len=26+i*4;c.fillStyle=i%2?col:shadeHex(col,1.2);c.save();c.translate(x,y);c.rotate(a);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(len*.5,-len*.22,len,0);c.quadraticCurveTo(len*.5,len*.22,0,0);c.fill();c.restore();}};
  if(id==='haunted'){branch(L,T+8,1,dk,null,0);branch(R_,T+4,-1,dk,null,0);rocks(L,B,1,dk);rocks(R_,B,-1,dk);c.strokeStyle=dk;c.lineWidth=3;[[L+20,0],[L+34,1]].forEach(([x,k])=>{c.beginPath();c.moveTo(x,B);c.lineTo(x+10+k*4,B-30-k*8);c.stroke();});}
  else if(id==='autumn'){branch(L,T+4,1,dk,['#E0502A','#F08A2A','#C83A20','#F4B040'],26);branch(R_,T+10,-1,dk,['#E0502A','#F08A2A','#C83A20'],22);}
  else if(id==='sky'){c.fillStyle=rgbaOf(P.fog,.9);[[L+10,B-6,26],[L+40,B,20],[R_-14,B-4,28],[R_-44,B,18]].forEach(([x,y,r])=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill();});}
  else if(id==='winter'||id==='glacier'){if(id==='winter'){artPine(c,L+14,B+4,48,dk,true);artPine(c,R_-12,B+6,42,dk,true);}else{c.fillStyle='#CFE2FA';[[L,B,1],[R_,B,-1]].forEach(([x,y,d])=>{c.beginPath();c.moveTo(x,y);c.lineTo(x+d*6,y-14);c.lineTo(x+d*40,y-18);c.lineTo(x+d*52,y);c.closePath();c.fill();c.fillStyle='#FFFFFF';c.fillRect(Math.min(x,x+d*40),y-18.5,40,2.4);c.fillStyle='#CFE2FA';});}}
  else if(id==='desert'){leaves(L-4,T+6,1,dk,5);leaves(R_+4,B+4,-1,dk,5);}
  else if(id==='crystal'){c.fillStyle=dk;c.fillRect(L,T,R_-L,6);for(let i=0;i<22;i++){const x=L+i*((R_-L)/22)+(h32('st'+i)%6),hh=8+(h32('sh'+i)%22);c.beginPath();c.moveTo(x-4,T+5);c.lineTo(x,T+5+hh);c.lineTo(x+4,T+5);c.closePath();c.fill();if(i%4===1){c.fillStyle='rgba(138,232,255,.85)';c.beginPath();c.moveTo(x-2,T+5);c.lineTo(x,T+5+hh*.7);c.lineTo(x+2,T+5);c.closePath();c.fill();c.fillStyle=dk;glowAt(c,x,T+hh*.5,10,'138,232,255',.3);}}
    [[L+18,B,'255,138,224'],[R_-20,B,'122,240,255']].forEach(([x,y,col])=>{glowAt(c,x,y-12,20,col,.4+.15*Math.sin(t/700));c.fillStyle=`rgb(${col})`;c.fillRect(x-1,y-12,2,12);c.beginPath();c.ellipse(x,y-12,9,5,0,Math.PI,0);c.fill();});}
  else if(id==='blossom'){branch(L,T+6,1,dk,['#F8B4D0','#FFD6E6','#F090B8'],34);}
  else if(id==='storm'){rocks(L,B,1,dk);rocks(R_,B,-1,dk);for(let i=0;i<5;i++){const q=((t/900)+i/5)%1;disc(c,L+40+i*6,B-14-q*12,1.4*(1-q)+.4,`rgba(230,240,250,${.6*(1-q)})`);}}
  else if(id==='volcano'){rocks(L,B,1,dk);rocks(R_,B,-1,dk);c.strokeStyle=`rgba(255,120,40,${.7+.2*Math.sin(t/250)})`;c.lineWidth=.8;c.beginPath();c.moveTo(L+8,B-16);c.lineTo(L+26,B-22);c.moveTo(R_-8,B-16);c.lineTo(R_-26,B-22);c.stroke();}
  else if(id==='jungle'){leaves(L-4,T+4,1,dk,6);leaves(R_+4,T+4,-1,dk,6);leaves(L-4,B+2,1,shadeHex(dk,1.15),5);leaves(R_+4,B+2,-1,shadeHex(dk,1.15),5);c.strokeStyle=dk;c.lineWidth=1;for(let i=0;i<4;i++){const x=L+24+i*9;c.beginPath();c.moveTo(x,T);c.quadraticCurveTo(x+3,T+20+i*6,x-1,T+34+i*8);c.stroke();}}
  c.restore();}
/* ---------- drifting particles for each place ---------- */
function envFx(c,t,e,alpha){const T=-VIEW_EXT.top,span=H+VIEW_EXT.top+VIEW_EXT.bot,L=-VIEW_EXT.side,wid=W+VIEW_EXT.side*2;const q=THEME.reduced?.4:1;c.save();c.globalAlpha=alpha;const n=Math.round(30*q);
  if(e.fx==='leaves'||e.fx==='petals'){const cols=e.fx==='leaves'?['#E0502A','#F08A2A','#F4B040']:['#F8B4D0','#FFD6E6','#FFFFFF'];for(let i=0;i<n;i++){const fall=t*q/(60+(i%7)*14);const y=T+((i*37.7+fall)%span);const x=L+((i*61.3+Math.sin(t*q/900+i)*14+fall*.6)%wid);c.save();c.translate(x,y);c.rotate(t/500+i);c.fillStyle=cols[i%3];c.beginPath();c.ellipse(0,0,e.fx==='leaves'?2.2:1.6,1.1,0,0,TAU);c.fill();c.restore();}}
  else if(e.fx==='snow'){for(let i=0;i<n*1.6;i++){const fall=t*q/(38+(i%7)*9);const y=T+((i*37.7+fall)%span);const x=L+((i*61.3+Math.sin(t*q/900+i)*3+fall*.18)%wid);disc(c,x,y,i%4===0?1.1:.6,'rgba(255,255,255,.85)');}}
  else if(e.fx==='embers'){for(let i=0;i<n;i++){const rise=t*q/(50+(i%7)*12);const y=T+span-((i*37.7+rise)%span);const x=L+((i*61.3+Math.sin(t*q/600+i)*8)%wid);const a=.5+.5*Math.sin(t/200+i);disc(c,x,y,.7,`rgba(255,${150+(i%5)*20},60,${a})`);}}
  else if(e.fx==='rain'){c.strokeStyle='rgba(210,225,240,.5)';c.lineWidth=.6;c.beginPath();for(let i=0;i<n*4;i++){const x=L+((i*53.7+t*q*.12)%wid),y=T+((i*91.3+t*q*.5)%span);c.moveTo(x,y);c.lineTo(x-3,y+8);}c.stroke();
    const k=Math.floor(t/3000),u=t%3000;if(h32('el'+k)%2===0&&u<180){c.fillStyle=`rgba(230,240,255,${.3*(1-u/180)})`;c.fillRect(L,T,wid,span);let x=60+h32('ex'+k)%200,y=T;c.strokeStyle='rgba(245,250,255,.95)';c.lineWidth=1.1;c.beginPath();c.moveTo(x,y);while(y<ART_HZ.voyage-6){x+=(h32('ej'+k+y)%13)-6;y+=8;c.lineTo(x,y);}c.stroke();}}
  else if(e.fx==='spores'||e.fx==='fireflies'||e.fx==='sparkle'){const col=e.fx==='spores'?['138,232,255','200,154,255']:e.fx==='fireflies'?['220,255,140','255,230,140']:['255,240,255','255,210,240'];c.save();c.globalCompositeOperation='lighter';for(let i=0;i<n;i++){const x=L+((h32('sp'+i)%1000)/1000*wid+Math.sin(t*q/1700+i)*12+t*q/(160+i*7))%wid,y=T+span*.25+((h32('sy'+i)%1000)/1000)*span*.6+Math.sin(t*q/1300+i*1.7)*8;const a=Math.max(0,Math.sin(t*q/(500+(i%5)*120)+i*2.3));if(a<.1)continue;glowAt(c,x,y,4,col[i%2],.5*a);disc(c,x,y,.6,`rgba(${col[i%2]},${a})`);}c.restore();}
  else if(e.fx==='dust'){for(let i=0;i<n;i++){const x=L+((i*61.3+t*q/40)%wid),y=T+span*.4+((i*29.1)%(span*.5));c.fillStyle=`rgba(255,220,170,${.25+.2*Math.sin(t/400+i)})`;c.fillRect(x,y,2.4,.5);}}
  else if(e.fx==='mist'){for(let i=0;i<5;i++){const x=((((h32('hm'+i)%1000)/1000)*(W+200)+t*q/60)%(W+200))-100,y=ART_HZ.voyage+6+i*6;const g=c.createRadialGradient(x,y,0,x,y,70);g.addColorStop(0,'rgba(150,240,220,.16)');g.addColorStop(1,'rgba(150,240,220,0)');c.save();c.translate(x,y);c.scale(1,.15);c.translate(-x,-y);c.fillStyle=g;c.fillRect(x-70,y-70,140,140);c.restore();}}
  c.restore();}
addLayer('fx','envFx',(c,t)=>{const st=ENVST;if(!st.a)return;if(st.a.fx)envFx(c,t,st.a,1-st.fade);if(st.fade>0&&st.b.fx)envFx(c,t,st.b,st.fade);},{scenes:['voyage'],z:6,when:()=>envOn()});
addLayer('overlay','envFrame',(c,t)=>{const st=ENVST;if(!st.a)return;envFrame(c,t,st.a,1-st.fade);if(st.fade>0)envFrame(c,t,st.b,st.fade);
  // the name of the place as you sail in
  const age=performance.now()-ENVST.shownAt;if(ENVST.shownId&&age<5200){const e=ENV_BY[ENVST.shownId];const a=Math.min(1,age/600,(5200-age)/900);c.save();c.globalAlpha=a;const y=-VIEW_EXT.top+Math.max(36,VIEW_EXT.top*.55);
    c.font='600 5.4px Fredoka, Nunito, sans-serif';c.textAlign='center';c.fillStyle='rgba(255,255,255,.8)';c.fillText(e.rare?'A RARE PLACE':'NOW SAILING',160,y-7);c.font='700 10px Fredoka, Nunito, sans-serif';c.lineWidth=2.4;c.strokeStyle='rgba(0,0,0,.35)';c.strokeText(e.name,160,y+4);c.fillStyle='#FFFFFF';c.fillText(e.name,160,y+4);c.restore();}},{scenes:['voyage'],z:5,when:()=>envOn()});
