/* ============================== v5: launch polish ============================== */
/* ---------- Password gate ---------- */
const PASS={sam:'',james:''}; // local-mode hashes kept out of the repo
function sha256js(ascii){// compact fallback for browsers without crypto.subtle
  const rr=(v,a)=>(v>>>a)|(v<<(32-a));const k=[],hh=[];let primes=0;const isC={};for(let c=2;primes<64;c++){if(!isC[c]){for(let i=0;i<313;i+=c)isC[i]=c;hh[primes]=(Math.pow(c,.5)*4294967296)|0;k[primes++]=(Math.pow(c,1/3)*4294967296)|0;}}
  let hash=hh.slice(0,8);const words=[];const bytes=unescape(encodeURIComponent(ascii));const bl=bytes.length*8;let s=bytes+'\x80';while(s.length%64-56)s+='\x00';
  for(let i=0;i<s.length;i++){const j=s.charCodeAt(i);words[i>>2]|=j<<((3-i)%4)*8;}words[words.length]=((bl/4294967296)|0);words[words.length]=bl;
  for(let j=0;j<words.length;){const w=words.slice(j,j+=16);const old=hash;hash=hash.slice(0,8);
    for(let i=0;i<64;i++){const w15=w[i-15],w2=w[i-2];const a=hash[0],e=hash[4];const t1=hash[7]+(rr(e,6)^rr(e,11)^rr(e,25))+((e&hash[5])^(~e&hash[6]))+k[i]+(w[i]=(i<16)?w[i]:(w[i-16]+(rr(w15,7)^rr(w15,18)^(w15>>>3))+w[i-7]+(rr(w2,17)^rr(w2,19)^(w2>>>10)))|0);
      const t2=(rr(a,2)^rr(a,13)^rr(a,22))+((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));hash=[(t1+t2)|0].concat(hash);hash[4]=(hash[4]+t1)|0;hash.length=8;}
    for(let i=0;i<8;i++)hash[i]=(hash[i]+old[i])|0;}
  return hash.map(v=>((v>>>0).toString(16)).padStart(8,'0')).join('');}
async function sha(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}catch(e){return sha256js(s);}}
function gate(){return new Promise(resolve=>{
  let saved=null;try{saved=JSON.parse(localStorage.getItem('hl_auth')||'null');}catch(e){}
  if(saved&&PASS[saved.pid]&&saved.h===PASS[saved.pid])return resolve(saved.pid);
  let pick=null;
  document.body.insertAdjacentHTML('beforeend',`<div id="gate"><div class="gateCard">
    <svg class="gateMark" aria-hidden="true"><use href="#funnal"/></svg><h1>Hundred Cannons</h1><p class="muted">A Funnal pirate game · crew only. Landlubbers, kindly walk the plank.</p>
    <div class="gateWho">${['sam','james'].map(p=>`<button class="gWho" data-p="${p}" type="button"><span class="gAv" style="--c:${p==='sam'?'#E07A34':'#4A7EC2'}">${p==='sam'?'S':'J'}</span>${p==='sam'?'Sam':'James'}</button>`).join('')}</div>
    <form id="gateForm" autocomplete="on"><label class="f" for="gatePw">Password<input id="gatePw" type="password" autocomplete="current-password" placeholder="Pick your captain first" disabled></label>
    <button class="btn primary big" id="gateGo" type="submit" disabled>Board the ship</button></form>
    <small class="muted">Forgotten it? Ask the other captain, then act like you didn't.</small></div></div>`);
  const g=$('#gate');
  g.querySelectorAll('.gWho').forEach(b=>b.addEventListener('click',()=>{pick=b.dataset.p;g.querySelectorAll('.gWho').forEach(x=>x.classList.toggle('on',x===b));const pw=$('#gatePw');pw.disabled=false;pw.placeholder=`${b.dataset.p==='sam'?'Sam':'James'}'s password`;pw.focus();$('#gateGo').disabled=false;SND.pop();}));
  $('#gateForm').addEventListener('submit',async e=>{e.preventDefault();if(!pick)return;const h=await sha(`hl:${pick}:${$('#gatePw').value.trim()}`);
    if(h===PASS[pick]){try{localStorage.setItem('hl_auth',JSON.stringify({pid:pick,h}))}catch(err){}SND.success();g.classList.add('out');setTimeout(()=>{g.remove();resolve(pick);},420);}
    else{SND.err();const c=g.querySelector('.gateCard');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');$('#gatePw').value='';$('#gatePw').placeholder=WRONG_PW[Math.floor(Math.random()*WRONG_PW.length)];}});
});}

/* ---------- Harbour: calmer layout, details on tap ---------- */
function statusChips(){const now=Date.now(),T=L(now),D=G.days[G.today];const gr=emGrade(D.p[S.me]?.d||0);let out=`<button class="sChip em g${gr}" data-act="evInfo"><span class="emflag g${gr}"><i></i><b>${['I','II','III','IV','V'][gr]}</b></span><span>×${EMISSARY[gr].mult}</span></button>`;
  if(isWork(G.today)){const gt=goldenFor(G.today);const live=T.min>=gt.start&&T.min<gt.end;const hm2=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
    out+=`<button class="sChip gold ${live?'live':''}" data-act="evInfo"><span class="sun sm"></span><span>${live?'Golden Tide!':T.min>=gt.end?'Tide passed':T.min<gt.start-120?'Golden Tide later':'Gold '+hm2(gt.start)}</span></button>`;}
  const ss=sightingState(S.me,sightingFor(G.today),now);
  if(ss){const lab=ss.claimed?'Pet caught':ss.phase==='soon'?'Pet sighting later':ss.phase==='live'?`${ss.rar} pet ${Math.min(ss.n,ss.need)}/${ss.need}`:ss.ok?'Claim pet!':'Pet gone';
    out+=`<button class="sChip pet r-${ss.rar} ${ss.phase==='live'?'live':''} ${ss.ok&&!ss.claimed?'claim':''}" data-act="${ss.ok&&!ss.claimed?'claimPet':'evInfo'}" data-pet="${ss.pet.id}"><canvas class="petIco xs" data-pet="${ss.pet.id}" data-sil="${ss.phase==='soon'&&!ss.claimed?1:0}"></canvas><span>${esc(lab)}</span></button>`;}
  return `<div class="chipsRow">${out}</div>`;}
SCREENS.harbour=()=>{
  const D=G.days[G.today],P=G.P,tgt=D.target,team=D.team,won=tgt>0&&team>=tgt,hp=Math.max(0,tgt-team),boss=D.boss,mod=D.mod;
  const seg=p=>tgt?clamp(D.p[p].d/Math.max(tgt,team)*100,0,100):0;const ms=[125,150,200].find(m=>team<m);const W=G.weeks[weekStart(G.today)];
  const rem=reminder();const mer=merchantToday(G.today);const act=P.flatMap(p=>activeForfeitsFor(p).map(f=>({...f,p})));const yd=G.workdays.filter(d=>d<G.today).pop();
  const sumK=k=>P.reduce((a,p)=>a+D.p[p][k],0);
  return `<canvas id="scene" class="scene" width="960" height="540" aria-label="Funnal Cove harbour and today's sea foe. Tap anything for details."></canvas>
  <div class="pad">
   ${statusChips()}
   ${crewCheckWrap()}
   ${rem?`<div class="remind"><span class="name">Gary the gull</span><canvas class="gull" id="gullIco"></canvas><div>${esc(rem)}</div><button class="btn sm ghost" data-act="nextReminder" aria-label="Another reminder">Next</button></div>`:''}
   <div class="card mission">
    ${tgt>0?`<div class="bossTop"><div><small>Today's sea foe</small><div class="bossName ${boss.rare?'rare':''}">${esc(boss.name)}${boss.rare?' <span class="pill" style="color:var(--r-legendary)">Rare</span>':''}</div></div><b class="score num">${team}<small> / ${tgt}</small></b></div>
    <div class="hp" role="img" aria-label="${hp} HP left">${P.map(p=>`<i class="${p===P[0]?'s':'j'}" style="width:${seg(p)}%"></i>`).join('')}<i class="x" style="flex:1"></i><span>${won?'Sunk!':hp+' HP'}</span></div>
    <div class="contrib">${P.map(p=>`<span><i class="dot" style="background:${pcol(p)}"></i>${pname(p)} <b class="num">${D.p[p].d}</b>${absent(p,G.today)?' <small>(away)</small>':''}</span>`).join('')}<span class="pill" id="timeLeft">${timeLeftStr()}</span></div>
    <details class="more"><summary>Battle details</summary><div class="moreBody">
     <div class="speech withName"><span class="who2">${esc(boss.name.split(' ').slice(-1)[0])}</span>${esc(phaseLine(boss,hp/tgt,won))}</div>
     <p class="tiny muted">Sink it to earn +100 XP and 30 ${CN} each. ${won&&ms?`Stretch goal: ${team}/${ms}.`:!won?`Next phase at ${[75,50,25].find(x=>hp>x)??0} HP.`:'Every stretch goal smashed.'}</p>
     <div class="twist"><b>${esc(mod.name)}</b><span>${esc(mod.desc)}</span></div></div></details>`
    :`<h2>No battle today</h2><p class="muted" style="margin:0">${isWork(G.today)?'Everyone is away. Rest up.':'Not a working day. Anything you log still counts towards your totals.'}</p>`}
   </div>
   <div class="card week"><div class="row between"><small>Today</small>${W&&W.hp?`<small>Weekly boss · ${esc(W.boss.name)}</small>`:''}</div>
    <div class="miniStats">${['r','v','m','c'].map(k=>`<div><b class="num">${sumK(k)}</b><small>${KINDS[k].short}s</small></div>`).join('')}</div>
    ${W&&W.hp?`${bar(W.dmg,W.hp,'team')}<small class="tiny">${W.done?'Weekly boss sunk! +400 XP and 120 '+CN+' each.':`${fmtN(W.dmg)} of ${fmtN(W.hp)} this week`}</small>`:''}</div>
   <div class="links">
    ${act.length?`<a class="linkRow warn" href="#herald"><span>${act.length} active forfeit${act.length>1?'s':''}</span><span class="chev">›</span></a>`:''}
    ${mer?`<a class="linkRow" href="#shop"><span>Pell's barge is in port with rare stock</span><span class="chev">›</span></a>`:''}
    ${yd?heraldCard(yd):''}
   </div>
  </div>`;
};

/* ---------- Achievement book: overview, collections, details on tap ---------- */
const CAT_COL={Outreach:'#E06034',Responses:'#7CC7E6',Videos:'#9B7FD9',Meetings:'#5DBE9C',Clients:'#DDA94D',Daily:'#F08C9C',Consistency:'#3FA57E',Team:'#4A7EC2',Focus:'#486790',Treasure:'#E2AE45',Battles:'#C91E36',Rivalry:'#9B5DE5',Progress:'#3F5160',World:'#8CC665',Companion:'#5FBF5A',Forfeits:'#B9AE98',Quests:'#C9654A',Style:'#E0457B',Pets:'#F2A33A',Secret:'#7F8A95'};
function achCompact(a,me){const un=me.unlocked[a.id];const secret=a.secret&&!un;const prog=Math.min(me.m[a.metric]||0,a.target);
  return `<button class="achC r-${a.rar} ${un?'got':''} ${secret?'secret':''}" data-act="achInfo" data-id="${a.id}"><canvas class="medalArt" width="96" height="96" data-ach="${a.id}" data-un="${un?1:0}" data-sec="${secret?1:0}"></canvas><span class="achT"><b>${secret?'Hidden':esc(a.name)}</b>${un?`<small class="rtag">${a.rar}</small>`:secret?'<small>Secret</small>':`<span class="miniBar"><i style="width:${clamp(prog/a.target*100,0,100)}%"></i></span>`}</span></button>`;}
SCREENS.book=()=>{
  const pid=S.view.bookP||S.me;const me=G.players[pid];const cat=S.view.bookCat;const cats=[...new Set(ACHIEVEMENTS.map(a=>a.cat))];
  const head=`<div class="row between"><h2>${cat?`<button class="iconBtn" data-act="bookCat" data-c="" aria-label="Back">‹</button> ${esc(cat)}`:'Achievements'}</h2><div class="seg mini">${G.P.map(p=>`<button class="${p===pid?'on':''}" data-act="bookP" data-p="${p}">${pname(p)}</button>`).join('')}</div></div>`;
  if(cat){const list=ACHIEVEMENTS.filter(a=>a.cat===cat).sort((a,b)=>(!!me.unlocked[b.id]-!!me.unlocked[a.id])||((me.m[b.metric]||0)/b.target-(me.m[a.metric]||0)/a.target));
    return `<div class="pad">${head}<div class="achList">${list.map(a=>achCompact(a,me)).join('')}</div><p class="tiny muted">Tap any achievement for its details and reward.</p></div>`;}
  const total=ACHIEVEMENTS.length,got=Object.keys(me.unlocked).length;const pc=got/total;const R=34,Cc=2*Math.PI*R;
  const near=ACHIEVEMENTS.filter(a=>!me.unlocked[a.id]&&!a.secret&&(me.m[a.metric]||0)>0).sort((a,b)=>(me.m[b.metric]||0)/b.target-(me.m[a.metric]||0)/a.target).slice(0,4);
  const ach=S.players[pid]?.ach||{};const recent=Object.keys(me.unlocked).filter(id=>ach[id]).sort((a,b)=>ach[b]-ach[a]).slice(0,4).map(id=>ACH_BY_ID[id]).filter(Boolean);
  return `<div class="pad">${head}
   <div class="card bookHero"><svg viewBox="0 0 80 80" class="ring2" aria-hidden="true"><circle cx="40" cy="40" r="${R}" class="t"/><circle cx="40" cy="40" r="${R}" class="p" style="stroke-dasharray:${Cc};stroke-dashoffset:${Cc*(1-pc)}"/></svg><div class="ringTxt"><b class="num">${got}</b><small>of ${total}</small></div>
    <div class="rars">${RARITIES.map(r=>{const t=ACHIEVEMENTS.filter(a=>a.rar===r).length,u=ACHIEVEMENTS.filter(a=>a.rar===r&&me.unlocked[a.id]).length;return `<div class="r-${r}"><span class="rtag">${r}</span><span class="miniBar"><i style="width:${u/t*100}%"></i></span><small class="num">${u}/${t}</small></div>`;}).join('')}</div></div>
   ${near.length?`<div class="card"><h3>Almost there</h3><div class="achList" style="margin-top:8px">${near.map(a=>achCompact(a,me)).join('')}</div></div>`:''}
   ${recent.length?`<div class="card"><h3>Recently earned</h3><div class="achList" style="margin-top:8px">${recent.map(a=>achCompact(a,me)).join('')}</div></div>`:''}
   <div class="card"><h3>Collections</h3><div class="cats">${cats.map(c=>{const l=ACHIEVEMENTS.filter(a=>a.cat===c);const u=l.filter(a=>me.unlocked[a.id]).length;return `<button class="catRow" data-act="bookCat" data-c="${esc(c)}"><span class="catDot" style="background:${CAT_COL[c]||'#7F8A95'}">${esc(c[0])}</span><span class="grow"><b>${esc(c)}</b><span class="miniBar"><i style="width:${u/l.length*100}%;background:${CAT_COL[c]||'#7F8A95'}"></i></span></span><small class="num">${u}/${l.length}</small><span class="chev">›</span></button>`;}).join('')}</div></div></div>`;
};
Object.assign(ACT,{
  bookCat(d){S.view.bookCat=d.c||null;render();$('#screen').scrollTop=0;},
  evInfo(){openModal(`<h2>Today at sea</h2>${eventsHtml()}<div class="row"><a class="btn" href="#help">How it all works</a><button class="btn ghost" data-act="closeModal">Close</button></div>`);paintPets($('#modal'));},
  async logout(){try{localStorage.removeItem('hl_auth')}catch(e){}if(S.sb){try{await S.sb.auth.signOut();}catch(e){}}location.reload();},
});
