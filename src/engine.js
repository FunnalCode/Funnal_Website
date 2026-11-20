/* ============================== UTILITIES ============================== */
const $ = (s,r=document)=>r.querySelector(s);
const esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtN = n=>Math.round(n).toLocaleString('en-GB');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function h32(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}h^=h>>>13;h=Math.imul(h,0x5bd1e995);h^=h>>>15;return h>>>0;}
const pick=(arr,seed)=>arr[h32(String(seed))%arr.length];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,10);
const TZ='Europe/London';
const DTF=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
// UK time without Intl in the hot path: BST runs from 01:00 UTC on the last Sunday of March to 01:00 UTC on the last Sunday of October
const BST={};function lastSunUTC(y,m){const d=new Date(Date.UTC(y,m+1,0,1));d.setUTCDate(d.getUTCDate()-d.getUTCDay());return d.getTime();}
function L(ts=Date.now()){const y=new Date(ts).getUTCFullYear();const r=BST[y]||(BST[y]=[lastSunUTC(y,2),lastSunUTC(y,9)]);const ld=new Date(ts+(ts>=r[0]&&ts<r[1]?3600000:0));
  const mo=ld.getUTCMonth()+1,da=ld.getUTCDate();return{date:ld.getUTCFullYear()+'-'+(mo<10?'0':'')+mo+'-'+(da<10?'0':'')+da,min:ld.getUTCHours()*60+ld.getUTCMinutes()};}
const wd=date=>new Date(date+'T12:00:00Z').getUTCDay();
function addDays(date,n){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
const weekStart=date=>addDays(date,-((wd(date)+6)%7));
const hm=s=>{const[a,b]=String(s||'0:0').split(':');return (+a||0)*60+(+b||0);};
function londonTs(date,min){const guess=Date.UTC(+date.slice(0,4),+date.slice(5,7)-1,+date.slice(8,10),0,min);const l=L(guess);let lm=l.min;if(l.date>date)lm+=1440;else if(l.date<date)lm-=1440;return guess-(lm-min)*60000;}
const DAYN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function niceDate(date){const d=new Date(date+'T12:00:00Z');return d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'});}
function shortDate(date){const d=new Date(date+'T12:00:00Z');return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',timeZone:'UTC'});}
function clockStr(ms){ms=Math.max(0,ms);const s=Math.floor(ms/1000);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(x).padStart(2,'0');}
function fill(t,o){return t.replace(/\{(\w+)\}/g,(_,k)=>o[k]??'');}

/* ============================== STORE ============================== */
function makeLocalDB(){
  const KEY='hl_local_db_v1'; let data={};
  try{data=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
  const subs=new Set();
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}};
  let pend=false; const notify=()=>{if(pend)return;pend=true;setTimeout(()=>{pend=false;for(const s of subs)s();},0)};
  try{window.addEventListener('storage',e=>{if(e.key===KEY){try{data=JSON.parse(e.newValue||'{}')}catch(_){}notify();}})}catch(e){}
  const clone=o=>JSON.parse(JSON.stringify(o));
  const merge=(a,b)=>{for(const k in b){const v=b[k];if(v&&typeof v==='object'&&v.__delete__===true){delete a[k];}else if(v&&typeof v==='object'&&!Array.isArray(v)){a[k]=merge(a[k]&&typeof a[k]==='object'&&!Array.isArray(a[k])?a[k]:{},v);}else a[k]=v;}return a;};
  const snap=p=>({id:p.split('/').pop(),exists:p in data,data:()=>data[p],metadata:{fromCache:false,hasPendingWrites:false}});
  function doc(path){return{id:path.split('/').pop(),path,
    async get(){return snap(path)},
    async set(d){data[path]=clone(d);save();notify();},
    async update(d){if(!(path in data))throw{code:'invalid_argument',message:'Document does not exist'};data[path]=merge(data[path],clone(d));save();notify();},
    async delete(){delete data[path];save();notify();},
    async acquire(o){const now=Date.now();let cur=null;try{cur=JSON.parse(localStorage.getItem('hl_lease_'+path)||'null')}catch(e){}
      if(cur&&cur.exp>now&&cur.holder!==o.holder)return{acquired:false,expiresAt:new Date(cur.exp).toISOString()};
      const exp=now+clamp(o.ttlMs||30000,1000,600000);try{localStorage.setItem('hl_lease_'+path,JSON.stringify({holder:o.holder,exp}))}catch(e){}
      return{acquired:true,expiresAt:new Date(exp).toISOString(),holder:o.holder};},
    onSnapshot(next){const f=()=>next(snap(path));subs.add(f);setTimeout(f,0);return()=>subs.delete(f);},
    collection(p){return collection(path+'/'+p)}};}
  function collection(cp){const n=cp.split('/').length;
    const snapC=()=>{const docs=Object.keys(data).filter(p=>p.startsWith(cp+'/')&&p.split('/').length===n+1).sort().map(snap);return{docs,size:docs.length,empty:!docs.length,docChanges:()=>[],metadata:{fromCache:false,hasPendingWrites:false}};};
    return{path:cp,doc(id){return doc(cp+'/'+(id||uid()))},async get(){return snapC()},onSnapshot(next){const f=()=>next(snapC());subs.add(f);setTimeout(f,0);return()=>subs.delete(f);}};}
  return{doc,collection,local:true,_data:()=>data};
}

/* ============================== STATE ============================== */
const S={mode:"local",db:null,user:null,uid:null,isOwner:true,me:null,sightings:{},hits:[],
  config:null,days:{},players:{},challenges:{},forfeits:{},
  pending:{},cdUntil:0,cdStart:0,btnLock:{},loaded:{config:false,days:false,players:false},
  screen:'harbour',sub:{},view:{islet:null,book:'all',lb:'day',shop:'decor',lockDur:25,wheelMode:'virtual'},
  sound:true,lastG:null,firstDerive:true,lanterns:[],bossFlash:0,readOnly:false,reminderIdx:0};
let G=null; // derived game state
const C=()=>{const c={...DEFAULT_CONFIG,...(S.config||{})};c.players={...DEFAULT_CONFIG.players,...(c.players||{})};c.caps={...DEFAULT_CONFIG.caps,...(c.caps||{})};c.cooldowns={...DEFAULT_CONFIG.cooldowns,...(c.cooldowns||{})};return c;};
const pname=p=>esc(S.players[p]?.handle||C().players[p]?.name||p);
const pnameRaw=p=>S.players[p]?.handle||C().players[p]?.name||p;
const pcol=p=>p===C().playerIds[0]?'var(--sam)':'var(--james)';
const pcolHex=p=>p===C().playerIds[0]?'#E07A34':'#4A7EC2';
const other=p=>C().playerIds.find(x=>x!==p);

const wq={};
function queue(path,fn){const run=(wq[path]||Promise.resolve()).then(fn,fn);wq[path]=run.catch(()=>{});return run;}
async function writeDay(pid,date,patch){
  const ref=S.db.doc(`days/${date}_${pid}`);
  return queue(ref.path,async()=>{
    try{await ref.update(patch);}
    catch(e){
      if(e&&e.code==='invalid_argument'){const s=await ref.get();if(s.exists)await ref.update(patch);else await ref.set({pid,date,...patch});}
      else throw e;
    }
  });
}
async function writePlayer(pid,patch){
  const ref=S.db.doc(`players/${pid}`);
  return queue(ref.path,async()=>{try{await ref.update(patch);}catch(e){if(e&&e.code==='invalid_argument'){const s=await ref.get();if(s.exists)await ref.update(patch);else await ref.set({pid,...patch});}else throw e;}});
}
async function writeConfig(patch){
  const ref=S.db.doc('config/main');
  return queue(ref.path,async()=>{try{await ref.update(patch);}catch(e){if(e&&e.code==='invalid_argument'){const s=await ref.get();if(s.exists)await ref.update(patch);else{const base=JSON.parse(JSON.stringify(DEFAULT_CONFIG));delete base.forfeits;await ref.set(deepMerge(base,patch));}}else throw e;}});
}
function deepMerge(a,b){for(const k in b){const v=b[k];if(v&&typeof v==='object'&&!Array.isArray(v)&&!(v.__delete__===true)){a[k]=deepMerge(a[k]&&typeof a[k]==='object'?a[k]:{},v);}else if(v&&v.__delete__===true)delete a[k];else a[k]=v;}return a;}
function writeFail(e){
  console.warn(e);
  if(e&&e.code==='invalid_argument'){S.readOnly=true;toast('<b>Couldn\'t save that.</b> Your account can only view this game. Ask the owner to share it with you as a Contributor or Editor.','joke',7000);}
  else if(e&&e.code==='quota_exceeded')toast('<b>The game\'s storage is full.</b> '+esc(e.message||''),'joke',7000);
  else toast('<b>Not saved.</b> The connection hiccupped, try again in a moment.','joke',4000);
}

/* ============================== RULES ============================== */
const WDC=new Map();const wdc=d=>{let v=WDC.get(d);if(v===undefined){v=wd(d);WDC.set(d,v);}return v;};
function isWork(d,cfg=C()){return cfg.workdays.includes(wdc(d))&&!(cfg.holidays||[]).includes(d);}
function absent(p,d,cfg=C()){return !!(cfg.absences||{})[d+'_'+p];}
function targetFor(d,cfg=C()){if(!isWork(d,cfg))return 0;const P=cfg.playerIds;const present=P.filter(p=>!absent(p,d,cfg)).length;if(!present)return 0;return present===P.length?cfg.target:Math.max(1,Math.round(cfg.target*cfg.absenceScale*present/(P.length-1||1)));}
function bossFor(date){const rare=h32(date+'rare')%14===0;return rare?RARE_BOSSES[h32(date+'rb')%RARE_BOSSES.length]:BOSSES[h32(date)%BOSSES.length];}
const MODC=new Map();const modFor=date=>{let v=MODC.get(date);if(!v){v=DAILY_MODS[h32(date+'mod')%DAILY_MODS.length];MODC.set(date,v);}return v;};
// levels 1-20 as before, then steadily steeper: level 100 is about a year of steady play (~1M XP)
function needXp(l){const b=25*Math.pow(l,1.4)+50;return Math.round(l<=20?b:b*(1+Math.pow((l-20)/80,1.3)));}
function levelInfo(xp){let l=1,rem=xp;while(l<100&&rem>=needXp(l)){rem-=needXp(l);l++;}return{level:l,into:rem,need:l>=100?0:needXp(l)};}
function titleFor(level){let t=TITLES[0][1];for(const[l,n]of TITLES)if(level>=l)t=n;return t;}
function lootFor(e,mod){
  const chance=({d:25,f:12,r:200,v:450,m:1000,c:1000}[e.k]||0)*(mod==='lucky'&&e.k==='d'?2:1);
  if(h32(e.id+'loot')%1000>=chance)return null;
  let r=h32(e.id+'rar')%1000;const w=[['common',450],['uncommon',280],['rare',160],['epic',70],['legendary',30],['mythic',10]];
  if(e.k==='c')r=880+r%120; else if(e.k==='m')r=Math.max(r,450);
  let rar='common';for(const[n,x]of w){if(r<x){rar=n;break;}r-=x;}
  const pool=COLLECTIBLES.filter(c=>c.rar===rar);return pool.length?pool[h32(e.id+'it')%pool.length]:null;
}
function rewardFor(e,mod,min){let xp=KINDS[e.k].xp,g=KINDS[e.k].g;
  if(e.k==='d'||e.k==='f'){if(mod==='golden'&&min>=840&&min<900)xp*=2;if(mod==='early'&&min<600)xp=Math.round(xp*1.5);}
  if(e.k==='r'&&mod==='echo')g*=2;return{xp,g};}
function merchantToday(date){const w=wd(date);if(w!==2&&w!==4)return null;const items=[...MERCHANT_ITEMS].sort((a,b)=>h32(date+a.id)-h32(date+b.id)).slice(0,3);return items.map(i=>({...i,price:Math.round(i.price*(1-(h32(date+i.id+'d')%21)/100)/10)*10}));}
function approvedForfeits(cfg=C()){const ap=cfg.approvals||{};const all=[...(cfg.forfeits||DEFAULT_FORFEITS),...Object.entries(cfg.custom||{}).map(([id,f])=>({id,...f,custom:true}))];
  return all.map(f=>{const by={};cfg.playerIds.forEach(p=>{const v=ap[p]?.[f.id];by[p]=v===undefined?(f.custom?f.by===p:true):!!v;});return{...f,by,ok:cfg.playerIds.every(p=>by[p])};});}

/* ============================== DERIVE ============================== */
function derive(){
  const cfg=C(),P=cfg.playerIds,now=Date.now(),T=L(now),today=T.date;
  const evs=[],seen=new Set(),bonus={},spend={},contrib={},sessions={},undone={},pendingConf=[],mc=[];
  P.forEach(p=>{bonus[p]=[];spend[p]=[];contrib[p]=[];sessions[p]=[];undone[p]=0;});
  for(const k in S.days){const d=S.days[k];if(!d||!P.includes(d.pid)||!d.date)continue;
    for(const id in d.ev||{}){const e=d.ev[id];seen.add(id);if(!e||!KINDS[e.k]||typeof e.t!=='number')continue;if(e.u||e.x){undone[d.pid]++;continue;}
      if(e.k==='m'||e.k==='c')mc.push({id,pid:d.pid,date:d.date,k:e.k,t:e.t,pr:e.pr||'',ok:e.ok||(cfg.requireConfirm?null:'auto')});
      if((e.k==='m'||e.k==='c')&&cfg.requireConfirm&&!e.ok){pendingConf.push({id,pid:d.pid,date:d.date,k:e.k,t:e.t,pr:e.pr||''});continue;}
      evs.push({id,pid:d.pid,date:d.date,k:e.k,t:e.t,pr:e.pr});}
    for(const id in d.bonus||{})bonus[d.pid].push({key:id,date:d.date,...d.bonus[id]});
    for(const id in d.spend||{})spend[d.pid].push({id,date:d.date,...d.spend[id]});
    for(const id in d.contrib||{})contrib[d.pid].push({id,date:d.date,...d.contrib[id]});
    for(const id in d.ses||{})sessions[d.pid].push({id,date:d.date,...d.ses[id]});
  }
  for(const id in S.pending){if(seen.has(id))delete S.pending[id];else{const x=S.pending[id];if((x.k==='m'||x.k==='c')){mc.push({...x,ok:null});if(cfg.requireConfirm){pendingConf.push(x);continue;}}evs.push(x);}}
  evs.sort((a,b)=>a.t-b.t);
  const blank=()=>({d:0,r:0,v:0,m:0,c:0,f:0,early:0,b10:0,b12:0});
  const days={};
  const dayOf=date=>days[date]||(days[date]={date,p:Object.fromEntries(P.map(p=>[p,blank()])),seq:[]});
  const per={};P.forEach(p=>per[p]={xp:0,g:0,gNoAch:0,loot:{},dupes:0,lootLog:[]});const teamSoFar={};const st0={};P.forEach(p=>st0[p]={em5:0,goldenDms:0});
  for(const e of evs){const D=dayOf(e.date),c=D.p[e.pid];c[e.k]++;const lm=L(e.t);e.min=lm.min;
    if(e.k==='d'){D.seq.push(e);if(e.min<510)c.early++;if(e.min<600)c.b10++;if(e.min<720)c.b12++;}
    const mod=modFor(e.date).id;const rw=rewardFor(e,mod,e.min);let mult=1;
    if(e.k==='d'){const kk=e.date+'|'+e.pid;const sofar=teamSoFar[kk]||0;mult*=EMISSARY[emGrade(sofar)].mult;teamSoFar[kk]=sofar+1;if(sofar>=EMISSARY[4].at)st0[e.pid].em5=1;}
    else if(e.k==='f')mult*=EMISSARY[emGrade(teamSoFar[e.date+'|'+e.pid]||0)].mult;
    const gt=goldenFor(e.date);if(isWork(e.date,cfg)&&e.min>=gt.start&&e.min<gt.end){mult*=2;if(e.k==='d')st0[e.pid].goldenDms++;}
    const gx=Math.round(rw.xp*mult),gg=Math.round(rw.g*mult);if(SHARED_K[e.k]&&P.length>1)P.forEach(q=>{per[q].xp+=gx;per[q].g+=gg;});else{per[e.pid].xp+=gx;per[e.pid].g+=gg;}
    const it=lootFor(e,mod);if(it){const L2=per[e.pid].loot;if(L2[it.id])per[e.pid].dupes++;else L2[it.id]=e.t;per[e.pid].lootLog.push({it,t:e.t,id:e.id});}
  }
  dayOf(today);
  const start=cfg.startDate||(evs.length?evs[0].date:today);
  const workdays=[];const from=start<addDays(today,-3650)?addDays(today,-3650):start;for(let d=from;d<=today;d=addDays(d,1)){if(isWork(d,cfg))workdays.push(d);}
  // per-day team analysis
  const A=P[0],B=P[1];
  const st={};P.forEach(p=>st[p]={teamWins:0,bosses:0,finalBlows:0,overtakes:0,comebacks:0,bigComebacks:0,perfect50:0,perfectEqual:0,photoFinish:0,fridayBlow:0,rareBosses:0,roster:new Set(),stretch:0,earlyDm:0,morning50:0,palindrome:0,answer42:0,lucky7:0,triple:0,fullHouse:0,syncDm:0,fastBoss:0,bestDay:0,activeDays:0,dayXp:0,dayG:0});
  for(const date in days){const D=days[date];const tgt=targetFor(date,cfg);D.target=tgt;D.team=P.reduce((s,p)=>s+D.p[p].d,0);
    D.boss=bossFor(date);D.mod=modFor(date);let run={},lastSign=0,minDiff={},tot=0;P.forEach(p=>{run[p]=0;minDiff[p]=0;});D.over=[];
    for(let i=0;i<D.seq.length;i++){const e=D.seq[i];run[e.pid]++;tot++;
      if(tgt>0&&tot===tgt){D.hit=true;D.blow=e.pid;D.hitT=e.t;D.hitMin=e.min;}
      if(B){const diff=run[A]-run[B];minDiff[A]=Math.min(minDiff[A],diff);minDiff[B]=Math.min(minDiff[B],-diff);const sg=Math.sign(diff);if(sg!==0&&lastSign!==0&&sg!==lastSign){const who=sg>0?A:B;st[who].overtakes++;D.over.push({who,t:e.t});}if(sg!==0)lastSign=sg;}
      if(i>0){const pr=D.seq[i-1];if(pr.pid!==e.pid&&e.t-pr.t<=3000)P.forEach(p=>st[p].syncDm=1);}
    }
    D.leader=B?(run[A]>run[B]?A:run[B]>run[A]?B:null):A;
    if(B&&wd(date)===5&&P.every(p=>D.p[p].d>=JOINT_NEED)){D.joint=true;P.forEach(p=>{st[p].jointBoss=(st[p].jointBoss||0)+1;st[p].dayXp+=150;st[p].dayG+=200;});}
    const final=date<today;
    P.forEach(p=>{const c=D.p[p];const dm=c.d;if(dm>0&&isWork(date,cfg))st[p].activeDays++;st[p].bestDay=Math.max(st[p].bestDay,dm);st[p].bestF=Math.max(st[p].bestF||0,c.f);if(dm>=25&&c.f>=25)st[p].fuDouble=1;
      const cr=k=>P.reduce((a,q)=>a+D.p[q][k],0);if(c.early)st[p].earlyDm=1;if(c.b12>=50)st[p].morning50=1;if(c.r>=7)st[p].lucky7=1;if(c.r&&cr('v')&&cr('m'))st[p].triple=1;if(c.d&&c.r&&cr('v')&&cr('m')&&cr('c'))st[p].fullHouse=1;
      if(D.hit&&dm>0){st[p].teamWins++;st[p].bosses++;st[p].roster.add(D.boss.id);(st[p].kills=st[p].kills||{})[D.boss.id]=(st[p].kills[D.boss.id]||0)+1;if(D.boss.rare)st[p].rareBosses++;st[p].dayXp+=100;st[p].dayG+=30;
        if(D.hitMin<660)st[p].fastBoss=1;if(D.team>=150)st[p].stretch++;
        for(const[m,x,g]of[[125,50,15],[150,80,25],[200,150,50]])if(D.team>=m){st[p].dayXp+=x;st[p].dayG+=g;}}
      if(D.blow===p){st[p].finalBlows++;if(wd(date)===5)st[p].fridayBlow=1;}
      if(D.hit&&D.hitMin>=hm(cfg.dayEnd)-15&&D.hitMin<=hm(cfg.dayEnd)&&dm>0)st[p].photoFinish=1;
      if(final){const s=String(dm);if(dm>=11&&s===[...s].reverse().join(''))st[p].palindrome=1;if(dm===42)st[p].answer42=1;
        if(B){const o=D.p[other(p)].d;if(dm>o&&minDiff[p]<=-15)st[p].comebacks++;if(dm>o&&minDiff[p]<=-30)st[p].bigComebacks++;
          if(D.hit&&dm===o){st[p].perfectEqual=1;if(dm===50&&D.team===100)st[p].perfect50=1;}}}
    });
  }
  // forfeits & shields
  const ff=S.forfeits;const shieldsUsed={},redemptions={};P.forEach(p=>{shieldsUsed[p]=0;redemptions[p]=0;});
  for(const k in ff){const f=ff[k];if(!f||!P.includes(f.pid))continue;if(f.status==='shield')shieldsUsed[f.pid]++;if(f.status==='redeemed')redemptions[f.pid]++;}
  const shielded=(p,d)=>['ind','team'].some(t=>ff[`${d}_${p}_${t}`]?.status==='shield');
  // streaks
  P.forEach(p=>{let cur=0,best=0;for(const d of workdays){if(absent(p,d,cfg))continue;const D=days[d];const ok=(D&&D.hit&&D.p[p].d>0)||shielded(p,d);if(ok){cur++;best=Math.max(best,cur);}else if(d!==today)cur=0;}st[p].curStreak=cur;st[p].bestStreak=best;});
  // weeks
  // a week's boss has the HP of every working day in that week (future days included), so once it is beaten it stays beaten
  const weeks={};const lastDay=addDays(weekStart(today),6);const wdSet=new Set(workdays);for(let d=from;d<=lastDay;d=addDays(d,1)){if(d>today?!isWork(d,cfg):!wdSet.has(d))continue;const w=weekStart(d);(weeks[w]||(weeks[w]={w,days:[],hp:0,dmg:0,p:Object.fromEntries(P.map(p=>[p,0]))})).days.push(d);}
  for(const w in weeks){const W=weeks[w];W.days.forEach(d=>{W.hp+=targetFor(d,cfg);const D=days[d];if(D){W.dmg+=D.team;P.forEach(p=>W.p[p]+=D.p[p].d);}});W.boss=WEEKLY_BOSSES[h32(w)%WEEKLY_BOSSES.length];W.done=W.hp>0&&W.dmg>=W.hp;
    const first=W.days[0];W.missedFirst=first<today&&days[first]&&targetFor(first,cfg)>0&&!days[first].hit||(first<today&&!days[first]&&targetFor(first,cfg)>0);}
  for(const w in weeks){const W=weeks[w];W.hits=W.days.filter(d=>days[d]&&days[d].hit).length;W.crew=W.hits>=CREW_WEEK_NEED;}
  P.forEach(p=>{st[p].crewWeeks=0;for(const w in weeks){const W=weeks[w];if(W.crew&&W.p[p]>0){st[p].crewWeeks++;st[p].dayXp+=300;st[p].dayG+=400;}}});
  P.forEach(p=>{st[p].weeks=0;st[p].againstOdds=0;for(const w in weeks){const W=weeks[w];if(W.done&&W.p[p]>0){st[p].weeks++;st[p].dayXp+=400;st[p].dayG+=120;if(W.missedFirst)st[p].againstOdds=1;}}});
  // sessions
  const dmIn=(p,a,b)=>{let lo=0,hi=evs.length;while(lo<hi){const m=(lo+hi)>>1;if(evs[m].t<a)lo=m+1;else hi=m;}const o=[];for(let i=lo;i<evs.length&&evs[i].t<=b;i++){const e=evs[i];if(e.pid===p&&e.k==='d')o.push(e);}return o;};
  P.forEach(p=>{const s=st[p];s.sessions=0;s.lockMin=0;s.bestSession=0;s.lateSession=0;for(const x of sessions[p]){s.sessions++;s.lockMin+=Math.round((x.dur||0)/60000);s.bestSession=Math.max(s.bestSession,x.dms||0);if(L(x.s||0).min>=1260)s.lateSession=1;const calm=modFor(x.date).id==='calm'?60:0;s.dayXp+=25+Math.round((x.dur||0)/60000)*2+calm;s.dayG+=5+Math.round((x.dur||0)/300000)+(x.full?(x.dms||0)*((x.s||0)>=V10_AT?1:3):0);if(x.full)s.islands=(s.islands||0)+1;if(x.mode==='crewhunt'&&typeof crewHuntPay==='function')crewHuntPay(p,x,s,evs);
    else if(x.hv===2&&!isFish(x.mode)&&VOYAGE_DIFF[x.diff]){const h=huntRun(x.id,x.diff,dmIn(p,x.s,x.e||x.s+(x.dur||0)),x.s);h.kills.forEach(k=>{s.dayXp+=k.xp;s.dayG+=k.g;s.vBoss=(s.vBoss||0)+1;(s.vk=s.vk||{})[k.mon]=(s.vk[k.mon]||0)+1;(s.drops=s.drops||{})[k.drop.id]=(s.drops[k.drop.id]||0)+1;});s.bestWaves=Math.max(s.bestWaves||0,h.kills.length);}
    else if(x.beat&&VOYAGE_DIFF[x.diff]){s.dayXp+=VOYAGE_DIFF[x.diff].xp;s.dayG+=VOYAGE_DIFF[x.diff].g;s.vBoss=(s.vBoss||0)+1;(s.vk=s.vk||{})[x.diff]=(s.vk[x.diff]||0)+1;}}});
  // challenges
  const chals=[];P.forEach(p=>{st[p].chalWon=0;st[p].chalPlayed=0;st[p].sprintWins=0;st[p].finalSecond=0;st[p].coopWins=0;});
  for(const id in S.challenges){const c=S.challenges[id];if(!c)continue;const ch=evalChallenge(id,c,evs,now);chals.push(ch);
    if(ch.state==='done'){P.forEach(p=>{if(!ch.players.includes(p))return;st[p].chalPlayed++;const r=ch.reward[p];if(r){st[p].dayXp+=r.xp;st[p].dayG+=r.g;}if(ch.won[p]){st[p].chalWon++;if(ch.coop)st[p].coopWins++;if(c.type==='sprint'||c.type==='triple')st[p].sprintWins++;if(ch.lastSecond===p||(ch.coop&&ch.lastSecond))st[p].finalSecond=1;}});}}
  chals.sort((a,b)=>(b.c.created||0)-(a.c.created||0));
  // projects
  const teamDm=evs.filter(e=>e.k==='d').length;const teamClients=evs.filter(e=>e.k==='c').length;
  const teamK={r:0,v:0,m:0,c:0};evs.forEach(e=>{if(e.k in teamK)teamK[e.k]++;});
  VENTURES.forEach(v=>{if(teamDm>=v.dm)P.forEach(p=>{st[p].dayG+=v.g;st[p].dayXp+=v.xp;});});
  const proj=PROJECTS.map(pr=>({...pr,by:Object.fromEntries(P.map(p=>[p,0])),funded:0}));
  P.forEach(p=>contrib[p].forEach(x=>{const pr=proj.find(q=>q.id===x.proj);if(pr){pr.by[p]+=x.amt||0;pr.funded+=x.amt||0;}}));
  let prevBuilt=true;proj.forEach(pr=>{pr.dmOk=teamDm>=pr.dm;pr.gOk=pr.funded>=pr.g;pr.built=prevBuilt&&pr.dmOk&&pr.gOk;pr.open=prevBuilt&&!pr.built;prevBuilt=pr.built;});
  const built=proj.filter(p=>p.built).length;
  // per player totals
  if(typeof coopPrime==='function')coopPrime(sessions,P);
  const out={};const recHeld=typeof fishRecordsHeld==='function'?fishRecordsHeld(P,evs,sessions,S.players):{};
  P.forEach(p=>{const s=st[p],pl=S.players[p]||{};
    const bx=bonus[p].reduce((a,b)=>a+(b.xp||0),0),bg=bonus[p].reduce((a,b)=>a+(b.g||0),0);
    const xp=per[p].xp+s.dayXp+bx;const prest=(pl.prestige||[]);const lastP=prest.length?prest[prest.length-1]:0;
    const li=levelInfo(Math.max(0,xp-lastP));
    const counts={d:0,r:0,v:0,m:0,c:0,f:0};evs.forEach(e=>{if(e.pid===p)counts[e.k]++;});
    const spent=spend[p].reduce((a,b)=>a+(b.cost||0),0),given=contrib[p].reduce((a,b)=>a+(b.amt||0),0);
    const owned={};spend[p].forEach(x=>{owned[x.item]=(owned[x.item]||0)+1;});
    const segs=[];let prevX=0;prest.forEach(px=>{segs.push(levelInfo(Math.max(0,px-prevX)).level);prevX=px;});segs.push(li.level);
    const maxLevel=Math.max(...segs);let lvlGold=0;segs.forEach(l=>{for(let k=2;k<=l;k++)lvlGold+=levelGold(k);});const dist=li.level>=100?Math.floor(li.into/DIST_XP):0;lvlGold+=dist*DIST_GOLD;
    ITEMS.forEach(it=>{if(it.free||(it.track&&maxLevel>=it.track)||(it.dtrack&&dist>=it.dtrack))owned[it.id]=owned[it.id]||1;});
    const fs=typeof fishMetrics==='function'?fishMetrics(p,evs,sessions[p],pl.lock):{};fs.fishRecords=recHeld[p]||0;const fsPre=typeof fishMetricsPre==='function'?fishMetricsPre(p,evs,sessions[p],pl.lock):null;const dr=s.drops||{};Object.assign(fs,{drops:Object.keys(dr).length,trophies:Object.keys(dr).filter(id=>id.endsWith('_2')).length,crewWeeks:s.crewWeeks||0,jointBoss:s.jointBoss||0,bestWaves:s.bestWaves||0,clientsWon:teamClients,ventures:VENTURES.filter(v=>teamDm>=v.dm).length});const ek={...fs};Object.entries(s.kills||{}).forEach(([k,n])=>{ek['kill_'+k]=n;});Object.entries(s.vk||{}).forEach(([k,n])=>{ek['vk_'+k]=n;});
    const earnP={};ITEMS.forEach(it=>{if(it.earn){const k0=it.earn[0];const v=(s[k0]??(SHARED_K[k0]?teamK[k0]:counts[k0])??ek[k0]??0);earnP[it.id]=v;if(v>=it.earn[1])owned[it.id]=owned[it.id]||1;}});
    const gNoAch=per[p].g+per[p].dupes*10+s.dayG+bg+lvlGold;
    const collected=Object.keys(per[p].loot).length;const sets=COLLECT_SETS.filter(set=>set.items.every(([id])=>per[p].loot[id])).length;
    const moth=MOTH_STAGES.reduce((a,x,i)=>counts.d>=x.at?i:a,0);
    const decor=(pl.decor||[]).filter(Boolean);
    const shieldsEarned=Math.floor(s.teamWins/10),shieldsBought=owned.shield||0;
    const pets={};bonus[p].forEach(b=>{if(b.key.startsWith('pet_')&&PET_BY_ID[b.pet])pets[b.pet]=pets[b.pet]||b.date;});
    const m={pets:Object.keys(pets).length,petMythic:Object.keys(pets).some(id=>PET_BY_ID[id].rar==='mythic')?1:0,petLegend:Object.keys(pets).some(id=>['legendary','mythic'].includes(PET_BY_ID[id].rar))?1:0,em5:st0[p].em5,goldenDms:st0[p].goldenDms,islands:s.islands||0,vBoss:s.vBoss||0,...fs,...counts,r:teamK.r,v:teamK.v,m:teamK.m,c:teamK.c,dm:counts.d,bestDay:s.bestDay,activeDays:s.activeDays,bestStreak:s.bestStreak,teamWins:s.teamWins,sessions:s.sessions,lockMin:s.lockMin,bestSession:s.bestSession,
      earned:gNoAch,spent,bosses:s.bosses,finalBlows:s.finalBlows,chalWon:s.chalWon,chalPlayed:s.chalPlayed,coopWins:s.coopWins||0,collected,level:li.level+(prest.length?100:0)*0,teamDm,weeks:s.weeks,built,stretch:s.stretch,
      perfect50:s.perfect50,comebacks:s.comebacks,bigComebacks:s.bigComebacks,rainmaker:teamClients,sets,earlyDm:s.earlyDm,morning50:s.morning50,photoFinish:s.photoFinish,fridayBlow:s.fridayBlow,
      overtakes:s.overtakes,rareBosses:s.rareBosses,rosterDone:BOSSES.every(b=>s.roster.has(b.id))?1:0,prestige:prest.length,dist,mothStage:moth,redemptions:redemptions[p],shieldsUsed:shieldsUsed[p],
      merchantBuys:spend[p].filter(x=>String(x.item).startsWith('m_')).length,cosmetics:Object.keys(owned).filter(id=>ALL_ITEMS[id]&&ALL_ITEMS[id].cat!=='shield'&&!ALL_ITEMS[id].free).length,fullRig:['hull','sail','flag','figure'].every(k=>pl[k]&&!ALL_ITEMS[pl[k]]?.free)?1:0,decorFull:decor.length>=6?1:0,questsClaimed:bonus[p].filter(b=>b.key.startsWith('q_')).length,sprintWins:s.sprintWins,
      perfectEqual:s.perfectEqual,againstOdds:s.againstOdds,finalSecond:s.finalSecond,lateSession:s.lateSession,palindrome:s.palindrome,answer42:s.answer42,lucky7:s.lucky7,triple:s.triple,fullHouse:s.fullHouse,syncDm:s.syncDm,fastBoss:s.fastBoss,mythics:0,teamClients};
    // level metric uses max level ever (prestige counts as having reached 50+)
    if(prest.length)m.level=Math.max(li.level,50);
    m.bestF=s.bestF||0;m.fuDouble=s.fuDouble||0;
    const unlocked={};
    for(const a of ACHIEVEMENTS){if(a.metric==='mythics')continue;if((m[a.metric]||0)>=a.target)unlocked[a.id]=true;}
    m.mythics=ACHIEVEMENTS.filter(a=>a.rar==='mythic'&&unlocked[a.id]).length;
    if(m.mythics>=5)unlocked.s_unseen=true;
    const achG=Object.keys(unlocked).reduce((a,id)=>a+RARITY_GLOW[ACH_BY_ID[id].rar],0);
    const earned=gNoAch+achG;
    out[p]={pid:p,m,counts,xp,li,prest:prest.length,earned,spent,given,balance:earned-spent-given,owned,unlocked,achG,loot:per[p].loot,lootLog:per[p].lootLog,dupes:per[p].dupes,
      curStreak:s.curStreak,bestStreak:s.bestStreak,maxLevel,dist,distInto:li.level>=100?li.into%DIST_XP:0,earnP,fish:fs,drops:s.drops||{},vk:s.vk||{},lvlGold,pets,moth,shields:shieldsEarned+shieldsBought-shieldsUsed[p],shieldsEarned,claimed:new Set(bonus[p].map(b=>b.key)),bonus:bonus[p],sessions:sessions[p],undone:undone[p]};
  });
  return {cfg,P,now,T,today,evs,pendingConf,mc,days,workdays,weeks,players:out,chals,proj,built,teamDm,teamClients,shielded};
}

function evalChallenge(id,c,evs,now){
  const P=C().playerIds;const players=P.filter(p=>c.acc?.[p]);const allIn=P.every(p=>c.acc?.[p]);
  const start=c.start||0,end=start+(c.dur||0);
  let state=c.status==='declined'||c.status==='cancelled'?c.status:!allIn?(now-(c.created||0)>15*60000?'expired':'pending'):now<start?'countdown':now<end?'live':'done';
  const cnt=Object.fromEntries(P.map(p=>[p,0]));let last={};
  if(start){let lo=0,hi=evs.length;while(lo<hi){const mid=(lo+hi)>>1;if(evs[mid].t<start)lo=mid+1;else hi=mid;}for(let i=lo;i<evs.length&&evs[i].t<=end;i++){const e=evs[i];if(e.k!=='d')continue;cnt[e.pid]++;last[e.pid]=e.t;}}
  const coop=['sprint','lastpush','bossrush','raid'].includes(c.type);let raceWin=null;
  if(c.type==='race'&&start){const run=Object.fromEntries(P.map(p=>[p,0]));for(const e of evs){if(e.t<start)continue;if(e.t>end)break;if(e.k!=='d')continue;run[e.pid]++;if(run[e.pid]>=(c.target||25)){raceWin=e.pid;break;}}}const team=P.reduce((a,p)=>a+cnt[p],0);
  const won={},reward={};let lastSecond=null;
  if(state==='done'){
    if(coop){const ok=team>=(c.target||0);P.forEach(p=>{won[p]=ok;reward[p]=ok?{xp:200,g:60}:{xp:40,g:5};});if(ok){const lt=Math.max(...P.map(p=>last[p]||0));if(end-lt<=10000)lastSecond=true;}}
    else if(raceWin){const l=other(raceWin);won[raceWin]=true;reward[raceWin]={xp:180,g:50};reward[l]={xp:50,g:10};}
    else{const[a,b]=P;if(cnt[a]===cnt[b]){reward[a]=reward[b]={xp:100,g:25};}else{const w=cnt[a]>cnt[b]?a:b,l=other(w);won[w]=true;reward[w]={xp:150,g:40};reward[l]={xp:50,g:10};if(last[w]&&end-last[w]<=10000)lastSecond=w;}}
  }
  if(c.type==='race'&&raceWin&&state==='live')state='done';
  return{id,c,state,start,end,cnt,team,coop,won,reward,players,lastSecond,raceWin};
}

/* ---------- Daily pet sighting ---------- */
function sightingFor(date){
  const cfg=C();if(!isWork(date,cfg))return null;
  const doc=S.sightings[date];let start,rar;
  if(doc&&doc.start){start=doc.start;rar=PET_RARITY[doc.rar]?doc.rar:rollRarity(h32(date+'rar'));}
  else if(cfg.sightingMode==='email')return null;
  else{rar=rollRarity(h32(date+'rar'));const win=PET_RARITY[rar].win;const sm=420+h32(date+'sight')%(720-win);start=londonTs(date,sm);}
  const R=PET_RARITY[rar];const pet=petFor(date,rar);const need=date<'2026-11-14'?{common:3,uncommon:4,rare:5,epic:6,legendary:7,mythic:8}[rar]:R.need;const win=date<'2026-11-14'?{common:30,uncommon:25,rare:20,epic:15,legendary:10,mythic:5}[rar]:R.win;if(!(doc&&doc.start)&&win!==R.win)start=londonTs(date,420+h32(date+'sight')%(720-win));return{date,start,end:start+win*60000,rar,need,win,pet};
}
function sightingState(p,sg,now=Date.now()){if(!sg)return null;const n=G?G.evs.filter(e=>e.pid===p&&e.k==='d'&&e.t>=sg.start&&e.t<=sg.end).length:0;const claimed=G?.players[p]?.claimed.has('pet_'+sg.date);
  return{...sg,n,claimed,owned:!!G?.players[p]?.pets?.[sg.pet.id],phase:now<sg.start?'soon':now<=sg.end?'live':'over',ok:n>=sg.need};}
