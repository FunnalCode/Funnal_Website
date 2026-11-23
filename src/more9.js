/* ============================== 22 Nov: the More section, regrouped ==============================
   A Pipeline banner, then four labelled groups (Business, Progress, Collections, Places) and a small footer row.
   Every tile shows a live line. Tiles that need you rise to the top of their group.
   How to play and Rewards merge into one Guide page with two tabs. Captain's Log and Funnal Cove live here only. */
const MORE_GROUPS=[
 ['business','Business','M4 20V10h3v10zm6 0V4h3v16zm6 0v-7h3v7z',['ledger','review','hall']],
 ['progress','Progress','M12 2l2.4 6.3L21 9l-5 4.4L17.5 20 12 16.6 6.5 20 8 13.4 3 9l6.6-.7z',['log','book','rivals']],
 ['collections','Collections','M4 7l8-4 8 4v10l-8 4-8-4zm8 2L6.5 6.6 12 9.4l5.5-2.8z',['trophy','bestiary','pets','vault']],
 ['places','Places','M3 20V11l5-4 5 4v9zm10 0v-7l4-3 4 3v7zM6 14h4v6H6z',['cove','tavern','herald']]];
const MORE_NAMES={ledger:'Ledger',review:'Weekly review',hall:'Hall of Fame',log:"Captain's Log",book:'Achievements',rivals:'Rivals',trophy:'Trophy case',bestiary:'Bestiary',pets:'Pets',vault:'Treasure',cove:'Funnal Cove',tavern:'Tavern',herald:'Herald'};
// live lines: reuse what each module already shows on its old tile, then improve the ones we can work out here
function moreLive(){const out={},need={};let old='';try{old=MORE_OLD();}catch(e){}
  const re=/<a href="#([a-z]+)"[^>]*>[\s\S]*?<small>([\s\S]*?)<\/small><\/a>/g;let m;while((m=re.exec(old)))out[m[1]]=m[2].replace(/<[^>]+>/g,'');
  try{const me=G.players[S.me];const L=me.li.level;const nx=(typeof LV_REW!=='undefined'&&LV_REW[me.maxLevel+1])||[];out.log=`Level ${L}${nx[0]?` · next: ${lvName(nx[0])}`:''}`;if((me.lvPending||[]).length){out.log=`${me.lvPending.length} chest${me.lvPending.length>1?'s':''} to open`;need.log=1;}}catch(e){}
  try{const wk=weekStart(G.today);const n=G.evs.filter(e=>e.k==='d'&&e.date>=wk).length;out.review=`${fmtN(n)} crew DMs this week`;}catch(e){}
  try{if(typeof PIPE!=='undefined'&&PIPE.ready){const cl=PIPE.rows.filter(r=>r.stage==='client');const mrr=Math.round(cl.reduce((a,r)=>a+(typeof pMonthly==='function'?pMonthly(r):r.deal_period==='monthly'?(+r.deal_value||0):0),0));out.ledger=`${cl.length} client${cl.length===1?'':'s'} on the books`;}}catch(e){}
  try{const open=typeof tvOpenNow==='function'&&tvOpenNow();out.tavern=open?'Open now. Bill\'s pouring.':'Closed. Opens at 5pm.';if(open)need.tavern=1;}catch(e){}
  try{const rows=typeof coveRows==='function'?coveRows():[];const nx=rows.find(r=>!r.done);if(nx&&out.cove)out.cove+=` · next: ${nx.name||nx.n||''}`.replace(/ · next: $/,'');}catch(e){}
  try{const me=G.players[S.me],ot=G.players[other(S.me)];if(me&&ot){const wk=weekStart(G.today);const c=p=>G.evs.filter(e=>e.k==='d'&&e.pid===p&&e.date>=wk).length;const a=c(S.me),b=c(other(S.me));out.rivals=a===b?'Level pegging this week':a>b?`You're ahead by ${a-b} this week`:`${pnameRaw(other(S.me))} leads by ${b-a} this week`;}}catch(e){}
  try{const pend=typeof activeForfeitsFor==='function'&&activeForfeitsFor(S.me).length;if(pend){out.herald=`${pend} forfeit${pend>1?'s':''} to do`;need.herald=1;}}catch(e){}
  return {out,need};}
let MORE_OLD=()=>'';
{const _old=SCREENS.more;MORE_OLD=()=>_old.apply(this,[]);}
SCREENS.more=()=>{let pip='';try{pipeStart();const due=PIPE.ready?pDueN():0;const act=PIPE.rows.filter(r=>r.stage in P_IDX&&r.stage!=='client').length;
    pip=`<a class="card pBanner moreBanner" href="#pipeline"><span class="appIco" style="background:#2C3E50"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h4v14H3zm7 0h4v9h-4zm7 0h4v5h-4z"/></svg></span><span class="grow"><b>Pipeline</b><small>${PIPE.ready?`${act} open prospect${act===1?'':'s'}${due?` · <b class="pGoDue">${due} follow-up${due===1?'':'s'} due</b>`:' · all caught up'}`:'Prospects, follow-ups and clients'}</small></span>${due?`<span class="pGoBadge">${due}</span>`:''}<span class="chev">›</span></a>`;}catch(e){}
  const {out,need}=moreLive();
  const tile=(k,i)=>{const ic=APP_ICONS[k]||['#7A8794','M4 4h16v16H4z'];return `<a href="#${k}" class="mTile ${need[k]?'need':''}" style="--i:${i}"><span class="appIco mIco mi-${k}" style="background:${ic[0]}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ic[1]}"/></svg></span><span class="mTxt"><b>${esc(MORE_NAMES[k])}</b><small>${out[k]||''}</small></span>${need[k]?'<i class="mDot" aria-label="Needs you"></i>':''}</a>`;};
  const groups=MORE_GROUPS.map(([id,name,icon,keys])=>{const ks=keys.slice().sort((a,b)=>(need[b]?1:0)-(need[a]?1:0));return `<section class="mGroup"><h3><span class="mGIco"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icon}"/></svg></span>${name}</h3><div class="mGrid">${ks.map(tile).join('')}</div></section>`;}).join('');
  return `<div class="pad morePage"><h2 class="mTitle">More</h2>${pip}${groups}<div class="mFoot"><a href="#guide" class="mSmall"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${(APP_ICONS.help||[])[1]||''}"/></svg>Guide</a><a href="#settings" class="mSmall"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${(APP_ICONS.settings||[])[1]||''}"/></svg>Settings</a></div></div>`;};
/* ---------- the Guide: How to play + Rewards, two tabs ---------- */
SCREENS.guide=()=>{const t=S.view.gtab||'play';let body='';try{body=(t==='earn'?SCREENS.rewards():SCREENS.help());}catch(e){body='';}
  body=body.replace(/^\s*<div class="pad">/,'').replace(/<\/div>\s*$/,'');
  return `<div class="pad guidePage"><h2 class="mTitle">Guide</h2>${pillNav('gTabs',[['play','How to play'],['earn','How to earn everything']],t,'gTab')}<div class="guideBody">${body}</div></div>`;};
ACT.gTab=d=>{S.view.gtab=d.t;render();};
// keep the old links working
{const _r=SCREENS.help;SCREENS.help=function(){return _r.apply(this,arguments);};}
// Captain's Log and Funnal Cove now live in More, so the Quests tab drops its links to them
{const _q=SCREENS.quests;SCREENS.quests=function(){let h=_q.apply(this,arguments);return h.replace(/<a class="card nextReward" href="#log"[\s\S]*?<\/a>/,'').replace(/<a class="card tvGo" href="#cove"[\s\S]*?<\/a>/,'');};}
