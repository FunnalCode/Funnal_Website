/* ============================== 24 Nov: character voices ==============================
   Animal Crossing style babble (the synth is in vox_synth.js) (no sound files). Each character has a voice:
   Bill a deep slow rumble, Gary a gull squawk, Pell a quick nasal patter, the fence a whisper, Crab clicks,
   and each of the townsfolk their own. The babble follows the words (one blip per syllable-ish), is capped
   at a couple of seconds, and a new line cuts the old one off. Follows the game's sound switch, plus its
   own "Character voices" switch in Settings. */
const VOX=(()=>{let bus=null,cur=null;const cache={};
  const on=()=>S.sound!==false&&S.voices!==false&&document.visibilityState!=='hidden';
  function ctx(){if(!on())return null;try{const ac=getAC();if(!ac)return null;if(!bus){bus=ac.createGain();bus.gain.value=.55;bus.connect(ac.destination);}return ac;}catch(e){return null;}}
  function stop(){if(cur){try{const ac=window.__hlAC;const g=cur.g;g.gain.setTargetAtTime(0,ac.currentTime,.015);cur.s.stop(ac.currentTime+.08);}catch(e){}cur=null;}}
  function say(who,text){if(!text)return;const ac=ctx();if(!ac)return;const key=who+'|'+text;
    let b=cache[key];if(!b){const d=VOXSYN.render(who,text,ac.sampleRate);if(!d)return;b=ac.createBuffer(1,d.length,ac.sampleRate);b.getChannelData(0).set(d);cache[key]=b;}
    stop();const s=ac.createBufferSource(),g=ac.createGain();s.buffer=b;g.gain.value=1;s.connect(g);g.connect(bus);s.start(ac.currentTime+.01);cur={s,g};s.onended=()=>{if(cur&&cur.s===s)cur=null;};}
  return {say,stop,cast:VOXSYN.cast};})();

// the Settings switch, next to "Sound effects"
try{S.voices=localStorage.getItem('hl_voices')!=='0';}catch(e){S.voices=true;}
ACT.voices=()=>{S.voices=!S.voices;try{localStorage.setItem('hl_voices',S.voices?'1':'0');}catch(e){}if(S.voices)setTimeout(()=>VOX.say('gary','Hello! Voices are on!'),80);};
{const _st=SCREENS.settings;SCREENS.settings=function(){const h=_st.apply(this,arguments);const k=' Sound effects</label>';const i=h.indexOf(k);if(i<0)return h;
  return h.slice(0,i+k.length)+`<label class="row tiny" for="voxT"><input id="voxT" type="checkbox" data-act="voices" ${S.voices!==false?'checked':''}> Character voices</label>`+h.slice(i+k.length);};}

/* ---------- who speaks when ---------- */
// Gary: when you poke him
{const _gp=ACT.garyPoke;ACT.garyPoke=function(){_gp.apply(this,arguments);try{if(S.garyPoke&&S.garyPoke.line)VOX.say('gary',S.garyPoke.line);}catch(e){}};}
// Bill: each new line in the tavern
{const _ts=tvSetLine;tvSetLine=function(t,kind){_ts.apply(this,arguments);try{if(S.screen==='tavern'&&t)VOX.say(kind==='whisper'?'bill':'bill',t);}catch(e){}};}
// Pell: on his barge, haggling and when you buy
{const _sb=ACT.s7Barge;ACT.s7Barge=function(){_sb.apply(this,arguments);setTimeout(()=>{const p=document.querySelector('#modal p.muted');if(p)VOX.say('pell',p.textContent);},120);};}
{const _ph=ACT.pellHaggle;ACT.pellHaggle=function(){_ph.apply(this,arguments);const p=document.querySelector('#modal p.muted');if(p)VOX.say('pell',p.textContent);};}
// the fence: when you ask if he's Gary
{const _bt=ACT.bmTalk;if(_bt)ACT.bmTalk=function(){_bt.apply(this,arguments);const h=document.querySelector('.bmCard h2');if(h)VOX.say('fence',h.textContent);};}
// anyone with a data-vox line: tap to hear them (town talk, the case file, the reveal)
ACT.voxSay=d=>{VOX.say(d.w,d.t||'');};
