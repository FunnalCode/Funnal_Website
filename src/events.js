/* ============================== STORMS AND LIVE EVENTS (Stage 6) ==============================
   Times come from the date and a seed, so both phones agree. Up to 2 events a week (at most 1 a day) between
   10am and 4pm on working days, never on a legendary day. About 1 in 3 is a Golden Shoal or Ghost Fleet instead
   of a storm. Gary's Heist runs once a fortnight in the afternoon. Every result is worked out from the DMs
   logged in the window, and rewards are claims, so nothing is ever taken away. */
const EVENT_FROM='2026-11-23';
const EVL=()=>((CT().lines||{}).events)||{};
const EV_LEN={storm:30,shoal:20,ghost:30,heist:15},EV_HP={storm:40,ghost:30,heist:15};
function weekEvents(ws){if(weekEvents._c&&weekEvents._c[ws])return weekEvents._c[ws];const out=[];
  const days=[0,1,2,3,4].map(i=>addDays(ws,i)).filter(d=>d>=EVENT_FROM&&isWork(d)&&!(typeof LEGEND_BY_DATE!=='undefined'&&LEGEND_BY_DATE[d]));
  const pick=days.map(d=>({d,k:h32(d+'evday')})).sort((a,b)=>a.k-b.k);const n=h32(ws+'evn')%3===0?1:2;
  pick.slice(0,n).forEach(({d})=>{const r=h32(d+'evtype')%6;const type=r===0?'shoal':r===1?'ghost':'storm';const start=type==='ghost'?945:600+(h32(d+'evt')%34)*10;out.push({date:d,type,start});});
  const wk=Math.round((new Date(ws+'T12:00:00Z')-new Date('2026-11-23T12:00:00Z'))/604800000);
  if(wk%2===0){const free=days.filter(d=>!out.some(e=>e.date===d));if(free.length){const d=free[h32(ws+'heist')%free.length];out.push({date:d,type:'heist',start:780+(h32(d+'ht')%15)*10});}}
  (weekEvents._c=weekEvents._c||{})[ws]=out;return out;}
function eventOn(date){return weekEvents(weekStart(date)).find(e=>e.date===date)||null;}
const evStartTs=e=>londonTs(e.date,e.start),evEndTs=e=>londonTs(e.date,e.start+EV_LEN[e.type]);
function evPhase(e,ts=Date.now()){if(!e)return null;const s=evStartTs(e),en=evEndTs(e);if(ts<s-15*60000)return 'later';if(ts<s)return 'warn';if(ts<en)return 'live';return 'over';}
function stormNow(ts=Date.now()){const e=eventOn(L(ts).date);if(!e||e.type!=='storm')return false;const p=evPhase(e,ts);return p==='warn'||p==='live';}
function evState(e){if(!G||!e)return null;const s=evStartTs(e),en=evEndTs(e);let hits=0,sunkAt=null;const hp=EV_HP[e.type]||0;
  for(const x of G.evs){if(x.t<s||x.t>=en)continue;let d=0;if(e.type==='storm'&&x.k==='d')d=2;else if(e.type==='ghost')d=x.k==='f'?3:x.k==='d'?1:0;else if(e.type==='heist'&&x.k==='d')d=1;if(!d)continue;hits+=d;if(hp&&sunkAt==null&&hits>=hp)sunkAt=x.t;}
  return{e,hits,hp,sunk:hp?hits>=hp:false,sunkAt,phase:evPhase(e),key:{storm:'stm_',ghost:'gfl_',heist:'gh_',shoal:'gs_'}[e.type]+e.date};}
function evReward(st,p){const e=st.e;if(e.type==='storm'){const g=100+h32(e.date+p+'sc')%151;let piece=null;const D=G.days[e.date];if(h32(e.date+p+'pc')%4===0&&D&&D.boss&&typeof setOf==='function'&&e.date>=ROSTER_FROM)piece=setOf(D.boss)[2].id;return{g,xp:60,piece};}
  if(e.type==='ghost')return{g:80+h32(e.date+p+'gc')%71,xp:50};if(e.type==='heist')return{g:60,xp:40};return null;}
ACT.evClaim=async d=>{const e=eventOn(d.date);const st=evState(e);if(!st||!st.sunk||st.phase!=='over'&&st.phase!=='live')return;if(G.players[S.me].claimed.has(st.key))return;const r=evReward(st,S.me);if(!r)return;
  try{await writeDay(S.me,G.today,{bonus:{[st.key]:{xp:r.xp,g:r.g,ts:Date.now(),...(r.piece?{piece:r.piece}:{})}}});SFX.ach();banner(e.type==='storm'?'STORM CHEST':e.type==='ghost'?'GHOST FLEET CHEST':'CHEST RECOVERED',`+${r.g} doubloons, +${r.xp} XP${r.piece?' and a rare loot piece':''}`);}catch(e){writeFail(e);}};
// storm chest loot pieces count towards boss sets
{const _blE=bossLoot;bossLoot=function(p){const v=_blE.apply(this,arguments);try{if(v.__ev)return v;(G.players[p]?.bonus||[]).forEach(b=>{if(b.piece&&/^(stm_|xm_)/.test(b.key))v.have[b.piece]=(v.have[b.piece]||0)+1;});v.__ev=1;}catch(e){}return v;};}

/* ---------- golden shoal: extra variant rolls for fish caught in the window ---------- */
{const _cfS=computeFish;computeFish=function(p,evs,sessions,lock){const v=_cfS.apply(this,arguments);try{if(v.__sh)return v;
  v.list.forEach(f=>{if(f.v||FISH_RI[f.f.rar]>=4||f.date<EVENT_FROM)return;const e=eventOn(f.date);if(!e||e.type!=='shoal')return;if(f.t<evStartTs(e)||f.t>=evEndTs(e))return;
    const q=h32(f.id+'shoal')/4294967296;const nv=q<.008?'r':q<.03?'a':q<.064?'g':'';if(nv){f.v=nv;f.shoal=1;v.vars[f.f.id+'~'+nv]=(v.vars[f.f.id+'~'+nv]||0)+1;}});v.__sh=1;}catch(e){}return v;};}

/* ---------- the Harbour card ---------- */
const hmS=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
function evCardHtml(){if(!G)return '';const e=eventOn(G.today);if(!e)return '';const st=evState(e);const T=EVL();const tm=hmS(e.start);const me=G.players[S.me];const claimed=me.claimed.has(st.key);
  const left=Math.max(0,Math.ceil((evEndTs(e)-Date.now())/60000)),to=Math.max(0,Math.ceil((evStartTs(e)-Date.now())/60000));const bar=st.hp?`<div class="evBar"><i style="width:${Math.min(100,st.hits/st.hp*100)}%"></i></div><small>${Math.min(st.hits,st.hp)} of ${st.hp} damage</small>`:'';
  const claimBtn=st.sunk&&!claimed&&e.type!=='shoal'?`<button class="btn sm primary" data-act="evClaim" data-date="${e.date}">Open the chest</button>`:claimed?'<span class="okTag">Chest opened</span>':'';
  if(st.phase==='later')return '';
  if(e.type==='storm'){if(st.phase==='warn')return `<div class="card evCard storm warn"><small>Storm warning</small><h3>Squall at ${tm}</h3><p>${esc(fill(T.warn?.[0]||'',{time:tm}))}</p><small>Arrives in ${to} min</small></div>`;
    if(st.phase==='live')return `<div class="card evCard storm live"><small>Storm · ${left} min left</small><h3>${st.sunk?'Storm sunk!':'The storm is here'}</h3><p>${esc(st.sunk?T.stormWon||'':pickLine(T.storm,Math.floor(Date.now()/20000))||'')}</p>${bar}${claimBtn}</div>`;
    return `<div class="card evCard storm over"><small>Today's storm, ${tm}</small><h3>${st.sunk?'Storm sunk':'The storm moved on'}</h3><p class="tiny">${esc(st.sunk?T.stormWon:T.stormLost)}</p>${bar}${claimBtn}</div>`;}
  if(e.type==='ghost'){if(st.phase==='warn')return `<div class="card evCard ghost warn"><small>Mist on the horizon</small><h3>Ghost fleet at ${tm}</h3><p class="tiny">${esc(T.ghost||'')}</p><small>In ${to} min</small></div>`;
    return `<div class="card evCard ghost ${st.phase}"><small>Ghost fleet${st.phase==='live'?` · ${left} min left`:''}</small><h3>${st.sunk?'Ghost fleet scattered':st.phase==='live'?'The ghost fleet is here':'The ghost fleet drifted off'}</h3><p class="tiny">${esc(st.sunk?T.ghostWon:st.phase==='live'?T.ghost:T.ghostLost)}</p>${bar}${claimBtn}</div>`;}
  if(e.type==='shoal'){if(st.phase==='warn')return `<div class="card evCard shoal warn"><small>The water's shimmering</small><h3>Golden shoal at ${tm}</h3><p class="tiny">For 20 minutes every fish is 3 times more likely to be a variant. Start a fishing trip.</p></div>`;
    if(st.phase==='live')return `<div class="card evCard shoal live"><small>Golden shoal · ${left} min left</small><h3>The water's gone gold</h3><p class="tiny">${esc(T.shoal||'')}</p><a class="btn sm primary" href="#lockin">Go fishing</a></div>`;return '';}
  if(e.type==='heist'){if(st.phase==='warn')return '';if(st.phase==='live')return `<div class="card evCard heist live"><small>Gary's heist · ${left} min left</small><h3>${st.sunk?'Chest recovered!':'Gary has the chest!'}</h3><p>${esc(st.sunk?T.heistWon:T.heist)}</p>${bar}${claimBtn}</div>`;
    return `<div class="card evCard heist over"><small>Gary's heist, ${tm}</small><h3>${st.sunk?'You got the chest back':'Gary got away'}</h3><p class="tiny">${esc(st.sunk?T.heistWon:T.heistLost)}</p>${claimBtn}</div>`;}return '';}
{const _hE=SCREENS.harbour;SCREENS.harbour=function(){const h=_hE.apply(this,arguments);const x=evCardHtml();if(!x)return h;const k='<div class="card today">';return h.includes(k)?h.replace(k,x+k):x+h;};}
// a rumble when the warning goes up, a flash when it lands
(function evWatch(){let last='';setInterval(()=>{try{if(!G||!S.me)return;const e=eventOn(G.today);if(!e)return;const ph=evPhase(e);const k=e.date+ph;if(k===last)return;const first=!last;last=k;if(first)return;
  if(ph==='warn'){rumble();toast(e.type==='storm'?`<b>Storm warning.</b> Squall at ${hmS(e.start)}. Double damage for 30 minutes.`:e.type==='ghost'?`<b>Mist rising.</b> The ghost fleet arrives at ${hmS(e.start)}.`:`<b>The water's shimmering.</b> Golden shoal at ${hmS(e.start)}.`);}
  if(ph==='live'){if(e.type==='storm')rumble();toast(e.type==='heist'?`<b>${esc(EVL().heist)}</b>`:e.type==='storm'?'<b>The storm hits!</b> Every DM does double damage.':e.type==='ghost'?'<b>Ghost ships!</b> Follow-ups do triple damage.':`<b>${esc(EVL().shoal)}</b>`);}
  if(typeof render==='function')render();}catch(err){}},5000);})();
function rumble(){if(!S.sound)return;try{const ac=getAC();const len=1.6;const buf=ac.createBuffer(1,ac.sampleRate*len,ac.sampleRate);const d=buf.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.2*(1-i/d.length);}
  const src=ac.createBufferSource();src.buffer=buf;const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=140;const g=ac.createGain();g.gain.value=.5;src.connect(f);f.connect(g);g.connect(ac.destination);src.start();}catch(e){}}

/* ---------- on the Harbour: the storm boss, the ghost fleet, the shoal, Gary with the chest ---------- */
const STORM_BOSS={id:'squall',name:'The Squall',type:'storm',col:'#4A5568',eye:'#F2E6C8',kit:{body:'blob',col:'#56677A',col2:'#3A4658',eyes:2,eyeStyle:'angry',mouth:'grin',acc:['spikes'],floats:true}};
addLayer('world','liveEvent',(c,t)=>{if(!G)return;const e=eventOn(G.today);if(!e)return;const st=evState(e);if(st.phase!=='live'&&!(st.phase==='warn'&&e.type==='storm'))return;
  if(e.type==='storm'){if(st.phase==='live'&&!st.sunk){const bx=60+Math.sin(t/1300)*10,by=34+Math.sin(t/900)*2;try{drawBoss(c,STORM_BOSS,bx,by,15,1-st.hits/st.hp,t,false,null);}catch(err){ell(c,bx,by,18,9,'#4A5568');}
      rr(c,bx-16,by-24,32,3,1.5,'rgba(0,0,0,.35)');rr(c,bx-16,by-24,32*Math.max(0,1-st.hits/st.hp),3,1.5,'#F2C462');hit(bx-18,by-18,36,30,'The Squall',`Today's storm. ${st.hp-st.hits} HP left. Every DM does double damage until ${hmS(e.start+30)}.`);}
    const fl=(h32(String(Math.floor(t/2300)))%5===0)&&((t%2300)<140);if(fl){c.fillStyle='rgba(255,255,255,.35)';c.fillRect(-80,-200,W+160,H+400);c.strokeStyle='rgba(255,250,220,.9)';c.lineWidth=1.2;c.beginPath();let x=180+(h32(String(Math.floor(t/2300)))%100),y=-10;c.moveTo(x,y);while(y<90){x+=Math.random()*10-5;y+=8;c.lineTo(x,y);}c.stroke();}}
  else if(e.type==='ghost'){}
  else if(e.type==='shoal'){for(let i=0;i<26;i++){const x=(i*37+t/40)%W,y=112+(i*13)%60;const a=.4+.4*Math.sin(t/200+i);disc(c,x,y,.9,`rgba(255,215,90,${a})`);}}
  else if(e.type==='heist'&&!st.sunk){const u=((t/9000)%1);const x=40+u*240,y=40+Math.sin(u*Math.PI*4)*8;drawGull(c,x-5,y-3,t);rr(c,x+3,y+1,6,4,1,'#A8704A');R(c,x+5.6,y+1,.8,4,'#F2C462');if(u<.3)txt(c,'Mine!',x,y-8,'#FFFFFF',5,'center');}},{scenes:['harbour'],z:8});

addLayer('sea','ghostFleet',(c,t,ctx)=>{const e=G&&eventOn(G.today);if(!e||e.type!=='ghost'||evPhase(e)!=='live'||evState(e).sunk)return;const y0=(ctx&&ctx.y0)||108;c.fillStyle='rgba(210,218,235,.22)';c.fillRect(-80,y0-14,W+160,22);
  c.globalAlpha=.62;for(let i=0;i<3;i++){const x=(340-((t/110+i*130)%440)),y=y0+2+i;c.save();c.translate(x,y);c.scale(-.42,.42);try{drawShip(c,0,0,1,{hull:'hull_ghost',sail:'sail_canvas',flag:'flag_skull'},t,{captain:false});}catch(err){}c.restore();}c.globalAlpha=1;},{scenes:['harbour'],z:5});
addLayer('fx','stormRain',(c,t)=>{const top=-VIEW_EXT.top-6,span=H+VIEW_EXT.top+VIEW_EXT.bot+12,left=-VIEW_EXT.side-6,wid=W+VIEW_EXT.side*2+12;const n=THEME.reduced?40:110;const sp=THEME.reduced?.4:1;
  c.fillStyle='rgba(30,40,60,.12)';c.fillRect(left,top,wid,span);c.strokeStyle='rgba(200,215,235,.5)';c.lineWidth=.6;c.beginPath();for(let i=0;i<n;i++){const x=left+((i*53.7+t*sp*.09)%wid),y=top+((i*91.3+t*sp*.42)%span);c.moveTo(x,y);c.lineTo(x-2.4,y+7);}c.stroke();},{z:12,when:()=>THEME.weather==='storm'});

/* ---------- Gary and Bill notice ---------- */
{const _gsE=garySituation;garySituation=function(){try{const e=G&&eventOn(G.today);if(e&&e.type==='storm'&&evPhase(e)==='live')return 'storm';}catch(err){}return _gsE.apply(this,arguments);};}
HELP.push(['Storms and live events','Up to twice a week, between 10am and 4pm, something happens at sea. Storm: a 15-minute warning, then 30 minutes where every DM does double damage to the Squall (40 HP); sink it for a storm chest each (100 to 250 doubloons, sometimes a rare loot piece). Ghost fleet: 30 minutes near dusk where follow-ups do triple damage. Golden shoal: 20 minutes where fish are 3 times more likely to be variants. Every other week Gary steals a bonus chest: 15 DMs in 15 minutes between you gets it back. Times are the same on both phones.']);
