/* ============================== 24 Nov: character voices ==============================
   Animal Crossing style babble, made live in Web Audio (no sound files). Each character has a voice:
   Bill a deep slow rumble, Gary a gull squawk, Pell a quick nasal patter, the fence a whisper, Crab clicks,
   and each of the townsfolk their own. The babble follows the words (one blip per syllable-ish), is capped
   at a couple of seconds, and a new line cuts the old one off. Follows the game's sound switch, plus its
   own "Character voices" switch in Settings. */
const VOX=(()=>{let bus=null,live=[];
  const on=()=>S.sound!==false&&S.voices!==false&&document.visibilityState!=='hidden';
  function ctx(){if(!on())return null;try{const ac=getAC();if(!ac)return null;if(!bus){const comp=ac.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=4;bus=ac.createGain();bus.gain.value=.5;bus.connect(comp);comp.connect(ac.destination);}return ac;}catch(e){return null;}}
  let noiseBuf=null;function noise(ac){if(noiseBuf)return noiseBuf;const n=ac.sampleRate*.6|0;noiseBuf=ac.createBuffer(1,n,ac.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return noiseBuf;}
  function stop(){const ac=window.__hlAC;live.forEach(n=>{try{n.stop(ac?ac.currentTime+.02:0);}catch(e){}});live=[];}
  // a pitch for each syllable, steady for the same letters so a line always sounds the same
  const semis=(ch,spread)=>(((ch.charCodeAt(0)*7)%9)-4)*spread/4;
  function syllables(text,max){const words=String(text).replace(/\{[^}]*\}/g,'').split(/\s+/).filter(Boolean);const out=[];
    for(const w of words){const v=(w.toLowerCase().match(/[aeiouy]+/g)||['a']).length;const n=Math.max(1,Math.min(3,v));for(let i=0;i<n;i++)out.push({ch:(w.replace(/[^a-z]/gi,'')||'a')[i%Math.max(1,w.length)]||'a',end:i===n-1,stop:/[.!?]$/.test(w)&&i===n-1,bang:/!$/.test(w)});if(out.length>=max)break;}return out.slice(0,max);}
  function env(ac,g,t,a,d,peak){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+d);}
  function tone(ac,t,o){const g=ac.createGain();env(ac,g,t,o.a||.015,o.d,o.vol||.3);let out=g;
    if(o.filter){const f=ac.createBiquadFilter();f.type=o.filter[0];f.frequency.value=o.filter[1];f.Q.value=o.filter[2]||1;f.connect(g);out=f;}
    const oscs=[];(o.osc||[[o.type||'triangle',1,1]]).forEach(([type,mult,vol])=>{const x=ac.createOscillator();x.type=type;x.frequency.setValueAtTime(o.f*mult,t);if(o.glide)x.frequency.exponentialRampToValueAtTime(Math.max(30,o.f*mult*o.glide),t+o.d);
      if(o.vib){const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=o.vib[0];lg.gain.value=o.vib[1]*mult;l.connect(lg);lg.connect(x.frequency);l.start(t);l.stop(t+o.d+.05);live.push(l);}
      const vg=ac.createGain();vg.gain.value=vol;x.connect(vg);vg.connect(out);x.start(t);x.stop(t+o.d+.05);oscs.push(x);live.push(x);});
    if(o.trem){const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=o.trem[0];lg.gain.value=o.trem[1];l.connect(lg);lg.connect(g.gain);l.start(t);l.stop(t+o.d+.05);live.push(l);}
    g.connect(bus);return oscs;}
  function hiss(ac,t,o){const s=ac.createBufferSource();s.buffer=noise(ac);const f=ac.createBiquadFilter();f.type=o.filter[0];f.frequency.value=o.filter[1];f.Q.value=o.filter[2]||1;const g=ac.createGain();env(ac,g,t,o.a||.01,o.d,o.vol||.25);s.connect(f);f.connect(g);g.connect(bus);s.start(t,Math.random()*.3);s.stop(t+o.d+.05);live.push(s);}
  // the cast. f: base pitch, spread: how much it wanders, d: syllable length, gap: space between, max: most syllables per line
  const CAST={
    bill:{f:72,spread:3,d:.17,gap:.055,max:14,sing:(ac,t,f,s)=>{tone(ac,t,{f,d:.17,glide:s.stop?.82:.94,osc:[['sawtooth',1,.55],['square',.5,.35],['sine',2,.25]],filter:['lowpass',520,5],trem:[26,.12],vol:.42,a:.03});}},
    gary:{f:1250,spread:5,d:.11,gap:.07,max:6,sing:(ac,t,f,s,i)=>{const big=s.bang||i===0;const d=big?.2:.1;tone(ac,t,{f:big?f*1.15:f,d,glide:.5,osc:[['square',1,.5],['sawtooth',1.5,.25]],filter:['bandpass',1900,1.8],vol:.28,a:.008});hiss(ac,t,{d:.04,filter:['bandpass',2800,1.2],vol:.18});return d;}},
    mum:{f:950,spread:4,d:.12,gap:.07,max:6,sing:(ac,t,f,s)=>{tone(ac,t,{f,d:.13,glide:.55,osc:[['square',1,.5]],filter:['bandpass',1500,2],vol:.26,a:.01});hiss(ac,t,{d:.035,filter:['bandpass',2200,1.2],vol:.14});}},
    pell:{f:330,spread:5,d:.07,gap:.03,max:16,sing:(ac,t,f,s)=>{tone(ac,t,{f:s.stop?f*1.25:f,d:.07,glide:s.stop?1.2:1,osc:[['square',1,.5],['sawtooth',1.01,.3]],filter:['bandpass',1450,7],vol:.32});}},
    fence:{f:0,spread:0,d:.08,gap:.05,max:10,sing:(ac,t,f,s,i)=>{hiss(ac,t,{d:.08,filter:['bandpass',1500+((i*317)%900),1.6],vol:.22,a:.02});}},
    crab:{f:0,spread:0,d:.03,gap:.09,max:8,sing:(ac,t)=>{hiss(ac,t,{d:.012,filter:['highpass',3200,1],vol:.35,a:.002});hiss(ac,t+.045,{d:.012,filter:['highpass',2600,1],vol:.28,a:.002});}},
    crumb:{f:290,spread:4,d:.1,gap:.04,max:12,sing:(ac,t,f)=>{tone(ac,t,{f,d:.1,osc:[['triangle',1,.6],['sine',2,.2]],filter:['lowpass',2000,1],vol:.33});}},
    hobbs:{f:120,spread:2,d:.1,gap:.035,max:12,sing:(ac,t,f)=>{tone(ac,t,{f,d:.1,osc:[['sawtooth',1,.5],['square',.5,.2]],filter:['lowpass',850,3],vol:.34});}},
    nell:{f:430,spread:6,d:.065,gap:.025,max:18,sing:(ac,t,f)=>{tone(ac,t,{f,d:.065,vib:[9,22],osc:[['triangle',1,.6]],filter:['lowpass',2600,1],vol:.3});}},
    lenny:{f:140,spread:2,d:.2,gap:.07,max:9,sing:(ac,t,f,s)=>{tone(ac,t,{f,d:.2,glide:s.stop?.7:.92,osc:[['sine',1,.6],['triangle',1,.3]],filter:['lowpass',800,1],vol:.36,a:.04});}},
    fergus:{f:230,spread:7,d:.085,gap:.03,max:14,sing:(ac,t,f,s,i)=>{tone(ac,t,{f:i%2?f*1.2:f,d:.085,osc:[['square',1,.45],['triangle',1,.3]],filter:['lowpass',1700,2],vol:.3});}},
    pike:{f:360,spread:2,d:.06,gap:.035,max:14,sing:(ac,t,f)=>{tone(ac,t,{f,d:.06,osc:[['triangle',1,.6],['square',1,.15]],filter:['lowpass',3000,1],vol:.3,a:.006});}},
    oldtom:{f:190,spread:3,d:.26,gap:.08,max:6,sing:(ac,t,f)=>{tone(ac,t,{f,d:.28,vib:[5,18],glide:.85,osc:[['sine',1,.6],['sine',1.5,.2]],filter:['lowpass',1200,1],vol:.3,a:.06});}},
    harbour:{f:260,spread:4,d:.09,gap:.04,max:12,sing:(ac,t,f)=>{tone(ac,t,{f,d:.09,osc:[['triangle',1,.6]],filter:['lowpass',1800,1],vol:.3});}}};
  const ALIAS={baker:'crumb',harbourmaster:'hobbs',town:'harbour',landmark:'harbour',houses:'harbour'};
  function say(who,text){who=ALIAS[who]||who;const v=CAST[who];if(!v||!text)return;const ac=ctx();if(!ac)return;stop();
    const syl=syllables(text,v.max);let t=ac.currentTime+.03;const cap=t+(who==='bill'?2.8:2.2);
    syl.forEach((s,i)=>{if(t>cap)return;const f=v.f*Math.pow(2,semis(s.ch,v.spread*2)/12);const d=v.sing(ac,t,f,s,i)||v.d;t+=d+v.gap+(s.stop?v.gap*2.5:s.end?v.gap*.4:0);});}
  return {say,stop,cast:Object.keys(CAST)};})();

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
