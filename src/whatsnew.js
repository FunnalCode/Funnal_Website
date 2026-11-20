/* ============================== CONTENT ACCESS, WHAT'S NEW, GAME FEEL SETTINGS (Stage 0) ============================== */
function CT(){return (typeof window!=='undefined'&&window.HL_CONTENT)||{};}
// the same line for both captains on the same day (and a different one tomorrow)
function pickLine(list,seed){if(!list||!list.length)return '';return list[h32(String(seed))%list.length];}
function contentLines(key){return (CT().lines||{})[key]||[];}

/* ---------- What's new: a card on the first open after each release ---------- */
function whatsNewHtml(v){const W=(CT().whatsNew||{})[v];if(!W)return '';
  return `<h2>What's new</h2><p class="muted" style="margin:2px 0 10px">${esc(W.title)}</p><ul class="wnList">${W.lines.map(l=>`<li>${l}</li>`).join('')}</ul><div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn primary" data-act="wnClose">Aye, got it</button></div>`;}
function whatsNewCheck(){if(!S.me||!G||!$('#modal')||!$('#modal').hidden)return false;let seen=0;try{seen=+localStorage.getItem('hl_seen_ver')||0;}catch(e){}
  const v=Math.min(HL_VERSION,CT().version||HL_VERSION);if(seen>=v)return true;
  try{localStorage.setItem('hl_seen_ver',String(v));}catch(e){}
  if(!seen&&!localStorage.getItem('hl_sound')&&!localStorage.getItem('hl_prefs'))return true; // a brand-new device gets the tour, not release notes
  const h=whatsNewHtml(v);if(h)openModal(h);return true;}
ACT.wnClose=()=>closeModal();
ACT.wnShow=()=>{const h=whatsNewHtml(Math.min(HL_VERSION,CT().version||HL_VERSION));if(h)openModal(h);};
(function wnLoop(){let n=0;const iv=setInterval(()=>{n++;try{if(whatsNewCheck()||n>60)clearInterval(iv);}catch(e){clearInterval(iv);}},2000);})();

/* ---------- Settings > Game feel ---------- */
// switches appear when the feature they control ships (intros: Stage 2, storms: Stage 6)
const FEATURES={intros:false,storms:false};
function gameFeelHtml(){const me=S.players[S.me]||{};const mail=me.stormMail!==false;const m=PREFS.motion;
  const seg=(v,l)=>`<button class="pill ${m===v?'on':''}" data-act="prefMotion" data-v="${v}" aria-pressed="${m===v}">${l}</button>`;
  return `<div class="card gameFeel"><h3>Game feel</h3><p class="tiny muted" style="margin:4px 0 8px">These stay on this device. More switches arrive with the features they control.</p>
   <div class="list">
    ${FEATURES.intros?`<label class="li" for="pfIntro"><span class="grow">Cinematic boss intros<br><small class="muted">A short reveal the first time each day's boss appears.</small></span><input id="pfIntro" type="checkbox" data-act="prefToggle" data-k="intros" ${PREFS.intros?'checked':''}></label>`:''}
    <label class="li" for="pfHeckle"><span class="grow">Gary's heckles<br><small class="muted">Gary's nagging card on the Harbour, and his comments elsewhere.</small></span><input id="pfHeckle" type="checkbox" data-act="prefToggle" data-k="heckles" ${PREFS.heckles?'checked':''}></label>
    ${FEATURES.storms?`<label class="li" for="pfStorm"><span class="grow">Storm warning emails<br><small class="muted">An email when a storm rolls in during working hours (starts once the email service is switched on).</small></span><input id="pfStorm" type="checkbox" data-act="prefStorm" ${mail?'checked':''}></label>`:''}
    <div class="li"><span class="grow">Motion<br><small class="muted">Reduced slows the sea, weather and effects. Auto follows your phone's setting.</small></span><span class="row" style="gap:4px">${seg('auto','Auto')}${seg('full','Full')}${seg('reduced','Reduced')}</span></div>
   </div><div class="row" style="margin-top:8px"><button class="btn sm ghost" data-act="wnShow">See what's new</button></div></div>`;}
ACT.prefToggle=(d,el)=>{setPref(d.k,!!el.checked);applyPrefClasses();};
ACT.prefMotion=(d)=>{setPref('motion',d.v);applyPrefClasses();render();};
ACT.prefStorm=async(d,el)=>{try{await writePlayer(S.me,{stormMail:!!el.checked});toast(el.checked?'Storm emails on. Gary will scream at your inbox when the sky turns.':'Storm emails off. You\'ll find out the old-fashioned way: getting wet.');}catch(e){writeFail(e);}};
function applyPrefClasses(){const r=document.documentElement;r.classList.toggle('hl-noheckle',!PREFS.heckles);r.classList.toggle('hl-reduced',!!THEME.reduced);}
const _settings16=SCREENS.settings;SCREENS.settings=()=>{const h=_settings16();const k='<div class="card"><h3>Your captain handle</h3>';return h.includes(k)?h.replace(k,gameFeelHtml()+k):h;};
setTimeout(applyPrefClasses,0);
HELP.push(['Game feel settings','Settings has a Game feel card: turn Gary\'s heckles on or off and pick Full, Reduced or Auto motion (Auto follows your phone). "See what\'s new" shows the latest release notes again.']);
