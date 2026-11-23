/* ============================== FUNNAL COVE: ONE PAGE FOR THE TOWN (21 Nov) ==============================
   Everything that grows the harbour, in one place and in order: houses fill in with your combined lifetime DMs, town
   features appear at milestones, landmarks pay you both when they open, and projects also need doubloons from either
   of you. A live picture of the town at the top has a slider, so you can preview it at any size, all the way to finished. */
APP_ICONS.cove=['#5E8C88','M3 20V11l5-4 5 4v9zm10 0v-7l4-3 4 3v7zM6 14h4v6H6z'];
const COVE={dm:null,raf:0};
function coveRows(){const dm=TEAMDM();const rows=[];
  (G.proj||[]).forEach(p=>rows.push({dm:p.dm,kind:'build',name:p.name,desc:p.blurb,done:p.built,open:p.open,p}));
  VENTURES.forEach(v=>rows.push({dm:v.dm,kind:'landmark',name:v.name,desc:v.desc,done:dm>=v.dm,pay:`${fmtN(v.g)} ${CN} and ${fmtN(v.xp)} XP each`}));
  TOWN_STEPS.forEach(s=>rows.push({dm:s.dm,kind:'feature',name:s.name,desc:'Appears in the town.',done:dm>=s.dm}));
  return rows.sort((a,b)=>a.dm-b.dm||(a.kind==='build'?-1:1));}
SCREENS.cove=()=>{const dm=TEAMDM();const me=G.players[S.me];const n=townCount(dm),tot=townPlan().total;const nx=townNextAt(dm);const pv=COVE.dm==null?dm:COVE.dm;const MAX=100000;
  const kinds={build:['Build','Needs crew DMs and doubloons from either of you'],landmark:['Landmark','Opens on its own and pays you both'],feature:['Town','Appears on its own']};
  const rows=coveRows();const next=rows.find(r=>!r.done);
  return `<div class="pad"><div class="card coveHero"><canvas id="coveCv" class="scene" width="960" height="540" aria-label="Preview of Funnal Cove"></canvas>
    <div class="coveCtl"><div class="row between"><small><b>${pv===dm?'Now':'Preview'}:</b> ${fmtN(pv)} crew DMs</small><small>${townCount(pv)} of ${tot} houses</small></div>
     <input id="coveRange" type="range" min="0" max="${MAX}" step="100" value="${Math.min(MAX,pv)}" aria-label="Preview the town at any size">
     <div class="row coveBtns"><button class="chip ${pv===dm?'on':''}" data-act="coveSet" data-v="now">Now</button><button class="chip" data-act="coveSet" data-v="12500">12,500</button><button class="chip" data-act="coveSet" data-v="45000">45,000</button><button class="chip ${pv>=MAX?'on':''}" data-act="coveSet" data-v="${MAX}">Finished</button></div></div></div>
   <div class="card"><h2>Funnal Cove</h2><p class="tiny muted">Your combined lifetime DMs grow the town: <b>${fmtN(dm)}</b> so far, <b>${n} houses</b>${nx?`, the next one at ${fmtN(nx)}`:', every plot built'}. Town features appear at milestones, landmarks open on their own and pay you both, and builds also need doubloons from either of you.</p>
    ${next?`<div class="coveNext"><small>Next up</small><b>${esc(next.name)}</b><small>${fmtN(Math.max(0,next.dm-dm))} crew DMs to go${next.kind==='build'&&next.p?` · ${fmtN(next.p.funded)} of ${fmtN(next.p.g)} ${CN} raised`:''}</small>${bar(Math.min(dm,next.dm),next.dm,'team')}</div>`:''}</div>
   <div class="card"><h3>The plan</h3><div class="coveList">${rows.map(r=>{const p=r.p;const st=r.done?'done':(r.kind==='build'?(r.open?'open':'locked'):(dm>=r.dm?'done':'locked'));
     return `<div class="coveRow ${st} k-${r.kind}"><span class="cvDot"></span><div class="grow"><div class="row between"><b>${esc(r.name)}</b><small class="cvDm">${fmtN(r.dm)} DMs</small></div><small class="cvKind">${kinds[r.kind][0]} · ${r.done?(r.kind==='landmark'?'opened':'built'):kinds[r.kind][1]}${r.pay&&!r.done?` · pays ${r.pay}`:''}</small><small>${esc(r.desc||'')}</small>
      ${r.kind==='build'&&!r.done&&p?`<div class="tiny" style="margin-top:4px">Crew DMs ${fmtN(Math.min(dm,p.dm))} / ${fmtN(p.dm)}${p.dmOk?' ✓':''}</div>${bar(Math.min(dm,p.dm),p.dm,'team')}<div class="tiny" style="margin-top:4px">Doubloons ${fmtN(p.funded)} / ${fmtN(p.g)} · ${G.P.map(x=>`${pname(x)} ${fmtN(p.by[x])}`).join(' · ')}</div>${bar(p.funded,p.g)}
       ${p.open&&!p.gOk?`<div class="row" style="gap:6px;margin-top:6px">${[50,250,1000].map(a=>`<button class="btn sm" data-act="fund" data-id="${p.id}" data-a="${a}" ${me.balance<Math.min(a,p.g-p.funded)?'disabled':''}>Give ${a}</button>`).join('')}</div>`:''}`:''}</div></div>`;}).join('')}</div>
    <p class="tiny muted" style="margin-top:8px">Builds go in order: each one opens when the one before is built. Spare relics can be donated in Treasure too.</p></div></div>`;};
ACT.coveSet=d=>{COVE.dm=d.v==='now'?null:+d.v;render();};
document.addEventListener('input',ev=>{if(ev.target&&ev.target.id==='coveRange'){const v=+ev.target.value;const dm=TEAMDM();COVE.dm=Math.abs(v-dm)<150?null:v;const lab=document.querySelector('.coveCtl small');if(lab)lab.innerHTML=`<b>${COVE.dm==null?'Now':'Preview'}:</b> ${fmtN(COVE.dm==null?dm:v)} crew DMs`;const h=document.querySelectorAll('.coveCtl small')[1];if(h)h.textContent=`${townCount(COVE.dm==null?dm:v)} of ${townPlan().total} houses`;}});
// draw the preview: the harbour as it would look at that many DMs, with every build up to there finished
function drawCove(t){const cv=document.getElementById('coveCv');if(!cv||!G)return;const real=TEAMDM();const dm=COVE.dm==null?real:COVE.dm;const hits=S.hits,proj=G.proj,prevScene=THEME.scene;
  try{if(COVE.dm!=null){S.coveDm=dm;G.proj=(proj||[]).map(p=>({...p,built:dm>=p.dm,open:false,funded:dm>=p.dm?p.g:p.funded}));}S.hits=[];const c=prep(cv);THEME.scene='harbour';drawHarbour(c,t);}catch(e){console.warn('cove',e);}
  finally{S.coveDm=null;G.proj=proj;S.hits=hits;THEME.scene=prevScene;}}
(function coveLoop(){const run=()=>{if(S&&S.screen==='cove'&&G){drawCove(performance.now());}hlRAF(run);};hlRAF(run);})();
// get there: a tile in More, a link on the Harbour, and the "next build" sign in the town
{const _mC=SCREENS.more;SCREENS.more=function(){const h=_mC.apply(this,arguments);const tile=`<a href="#cove"><span class="appIco" style="background:${APP_ICONS.cove[0]}"><svg viewBox="0 0 24 24"><path d="${APP_ICONS.cove[1]}"/></svg></span>Funnal Cove<small>${townCount(TEAMDM())} houses</small></a>`;const k='<a href="#log">';return h.includes(k)?h.replace(k,tile+k):h;};}
{const _hC2=SCREENS.harbour;SCREENS.harbour=function(){const h=_hC2.apply(this,arguments);const rows=coveRows();const nx=rows.find(r=>!r.done);const L='<a class="tvGo" href="#tavern">';const btn=`<a class="tvGo" href="#cove"><span class="appIco" style="background:${APP_ICONS.cove[0]}"><svg viewBox="0 0 24 24"><path d="${APP_ICONS.cove[1]}"/></svg></span><span class="grow"><b>Funnal Cove</b><small>${nx?`Next: ${esc(nx.name)} at ${fmtN(nx.dm)} crew DMs`:'Fully built'}</small></span><span class="tvGoArrow">›</span></a>`;return h.includes(L)?h.replace(L,btn+L):h;};}
HELP.push(['Funnal Cove','More, Funnal Cove (or the Funnal Cove link on the Harbour) shows how the town grows. Houses fill in with your combined lifetime DMs, town features appear at milestones, landmarks open on their own and pay you both, and builds also need doubloons from either of you, one at a time. Slide the picture at the top to preview the town at any size, right up to finished.']);
