/* ============================== UI v6: full screen for every scene, ambience, emblems ============================== */
try{S.amb=localStorage.getItem('hl_amb')!=='0';}catch(e){S.amb=true;}
const AMB=(()=>{let ac=null,out=null,live=[],on=false,timers=[];
  function buf(a,brown){const n=Math.floor(a.sampleRate*4),f=Math.floor(a.sampleRate*.4);const x=new Float32Array(n+f);let last=0;for(let i=0;i<n+f;i++){const w=Math.random()*2-1;if(brown){last=(last+.02*w)/1.02;x[i]=last*3.2;}else x[i]=w;}
    const b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=i<f?x[i]*(i/f)+x[n+i]*(1-i/f):x[i];return b;}
  function layer(a,brown,type,freq,q,gain,lfoHz,depth,fLfoHz,fDepth){const s=a.createBufferSource();s.buffer=buf(a,brown);s.loop=true;const fl=a.createBiquadFilter();fl.type=type;fl.frequency.value=freq;fl.Q.value=q;const g=a.createGain();g.gain.value=gain;
    const l=a.createOscillator();l.frequency.value=lfoHz;const lg=a.createGain();lg.gain.value=depth;l.connect(lg);lg.connect(g.gain);l.start();live.push(l);
    if(fLfoHz){const l2=a.createOscillator();l2.frequency.value=fLfoHz;const g2=a.createGain();g2.gain.value=fDepth;l2.connect(g2);g2.connect(fl.frequency);l2.start();live.push(l2);}
    s.connect(fl);fl.connect(g);g.connect(out);s.start();live.push(s);}
  function gull(){if(!on||!ac)return;const t0=ac.currentTime+.05;for(let k=0;k<2+Math.floor(Math.random()*2);k++){const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';const t=t0+k*.34;o.frequency.setValueAtTime(1500+Math.random()*200,t);o.frequency.exponentialRampToValueAtTime(2100,t+.08);o.frequency.exponentialRampToValueAtTime(1150,t+.3);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.022,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g);g.connect(out);o.start(t);o.stop(t+.34);}}
  function creak(){if(!on||!ac)return;const t=ac.currentTime+.05;const o=ac.createOscillator(),g=ac.createGain(),f=ac.createBiquadFilter();o.type='sawtooth';f.type='bandpass';f.frequency.value=320;f.Q.value=6;o.frequency.setValueAtTime(62,t);o.frequency.linearRampToValueAtTime(84,t+.5);o.frequency.linearRampToValueAtTime(58,t+1);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.03,t+.2);g.gain.exponentialRampToValueAtTime(.0001,t+1.05);o.connect(f);f.connect(g);g.connect(out);o.start(t);o.stop(t+1.1);}
  const loop=(fn,min,max)=>{const go=()=>{timers.push(setTimeout(()=>{fn();if(on)go();},(min+Math.random()*(max-min))*1000));};go();};
  return{get on(){return on;},
    start(){if(on||!S.sound||!S.amb)return;try{ac=ac||getAC();if(!ac)throw 0;if(ac.state==='suspended')ac.resume();out=ac.createGain();out.gain.setValueAtTime(.0001,ac.currentTime);out.gain.exponentialRampToValueAtTime(.9,ac.currentTime+2);out.connect(ac.destination);on=true;
      layer(ac,true,'lowpass',520,.4,.2,.11,.13);            // the swell
      layer(ac,false,'bandpass',1500,.5,.03,.083,.026);       // surf hiss as each wave breaks
      layer(ac,false,'bandpass',620,1.4,.035,.047,.028,.031,260); // wind, wandering in pitch
      loop(gull,14,38);loop(creak,9,22);}catch(e){on=false;}},
    stop(){if(!on)return;on=false;timers.forEach(clearTimeout);timers=[];const o=out,l=live;live=[];try{o.gain.cancelScheduledValues(ac.currentTime);o.gain.setTargetAtTime(.0001,ac.currentTime,.25);}catch(e){}setTimeout(()=>{l.forEach(n=>{try{n.stop();}catch(e){}});try{o.disconnect();}catch(e){}},1200);},
    sync(){const want=!!(S.focus&&S.sound&&S.amb);if(want&&!on)this.start();else if(!want&&on)this.stop();}};})();

const FS_ICON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const AMB_ICON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9c2.2-2.4 4.4-2.4 6.6 0s4.4 2.4 6.6 0 4.4-2.4 6.6 0M2 15c2.2-2.4 4.4-2.4 6.6 0s4.4 2.4 6.6 0 4.4-2.4 6.6 0" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/></svg>';
function focusHtml(){const voy=S.focusMode==='voyage';return `<div id="focus" role="dialog" aria-label="Full screen view" class="${voy?'voy':''}"><canvas id="focusCv" class="scene" width="1280" height="720"></canvas>
  <div class="fTop"><span class="fTimer" id="fTimer">${voy?'--:--':''}</span><span class="fStat" id="fStat"></span><button class="fExit fAmb ${S.amb?'':'off'}" id="fAmb" data-act="ambToggle" aria-label="Sea and wind sounds" aria-pressed="${S.amb?'true':'false'}">${AMB_ICON}</button><button class="fExit" data-act="focusOff" aria-label="Exit full screen">✕</button></div>
  <button class="fDm" id="fDm" aria-label="DM sent"><span class="dmIcon"><svg class="mk"><use href="#funnal"/></svg><svg class="ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="track"/><circle cx="50" cy="50" r="44" class="prog" id="fRing"/></svg></span><b>DM sent</b><small>tap, click or press space</small></button></div>`;}
function focusOn(){if(S.focus||!G)return;const lk=S.players[S.me]?.lock;
  S.focusMode=S.screen==='lockin'&&lk?'voyage':S.screen==='ship'?((S.view.shipMode||'ship')==='ship'?'ship':'hideout'):'harbour';S.focusPid=S.view.islet||S.me;
  S.focus=true;document.body.insertAdjacentHTML('beforeend',focusHtml());$('#fDm').addEventListener('click',()=>logAction('d',$('#fDm')));const f=$('#focus');try{f.requestFullscreen?.().catch(()=>{});}catch(e){}SND.open();AMB.sync();focusTick();}
function focusOff(){if(!S.focus)return;S.focus=false;AMB.sync();try{if(document.fullscreenElement)document.exitFullscreen();}catch(e){}$('#focus')?.remove();SND.close();}
function drawFocusScene(c,t,lk){const m=S.focusMode;if(m==='voyage'&&lk)drawVoyage(c,t,lk,myDmSince(S.me,lk.s),Math.min(1,lockElapsed(lk)/lk.dur));else if(m==='ship')drawShipScene(c,t,S.focusPid||S.me);else if(m==='hideout')drawIslet(c,t,S.focusPid||S.me);else drawHarbour(c,t);}
function focusTick(){try{checkCatch();huntCheck();checkMC();}catch(e){}if(!S.focus||!G)return;const lk=S.players[S.me]?.lock;const st=$('#fStat');if(!st)return;
  if(S.focusMode==='voyage'){if(!lk){focusOff();return;}const el=lockElapsed(lk);$('#fTimer').textContent=clockStr(lk.dur-el);const dms=myDmSince(S.me,lk.s);const vb=voyageBoss(lk);st.textContent=isFish(lk.mode)?`${dms} casts · ${fishCatches(S.me).list.filter(x=>x.t>=lk.s).length} fish landed`:lk.hv===2?(()=>{const h=huntLive(lk);return h&&h.cur?`Wave ${h.cur.n+1} · ${h.cur.left} HP left · ${h.kills.length} sunk`:'';})():`${dms} DMs · ${Math.max(0,vb.hp-dms)?Math.max(0,vb.hp-dms)+' HP left on the monster':'monster beaten!'} · chest ${dms*3}`;}
  else{const d=G.days[G.today];st.textContent=d.target>0?`${d.p[S.me]?.d||0} DMs from you today · crew ${d.team} of ${d.target}`:`${d.p[S.me]?.d||0} DMs from you today`;}
  AMB.sync();}
Object.assign(ACT,{ambToggle(){S.amb=!S.amb;try{localStorage.setItem('hl_amb',S.amb?'1':'0')}catch(e){}const b=$('#fAmb');if(b){b.classList.toggle('off',!S.amb);b.setAttribute('aria-pressed',S.amb?'true':'false');}AMB.sync();if(S.amb&&!S.sound)toast('<b>Sound is muted.</b> Turn it on with the speaker button to hear the sea.','joke');else SND.pop();}});

/* every scene gets a full screen button; every medal gets its emblem */
function paintMons(root=document){root.querySelectorAll('canvas.monIco').forEach(cv=>{const d=VOYAGE_DIFF[cv.dataset.mon];if(!d)return;const c=cv.getContext('2d');const k=cv.width/48;c.setTransform(k,0,0,k,0,0);c.clearRect(0,0,48,48);c.save();c.beginPath();c.arc(24,24,24,0,TAU);c.clip();const g=c.createLinearGradient(0,0,0,48);g.addColorStop(0,'#BFE6F5');g.addColorStop(.6,'#E8F6FB');g.addColorStop(.6,'#56CBD9');g.addColorStop(1,'#2F97C4');c.fillStyle=g;c.fillRect(0,0,48,48);const t=performance.now();const type=d.type;
  if(type==='seal'){const r=11,mx=21,my=27;ell(c,mx,my+4,r,r*.62,d.col);disc(c,mx+r*.6,my-r*.2,r*.55,d.col);disc(c,mx+r*.45,my-r*.35,r*.12,'#3F3A30');disc(c,mx+r*.85,my-r*.35,r*.12,'#3F3A30');ell(c,mx+r*.7,my-r*.05,r*.22,r*.14,'#5A5650');}
  else{const r=type==='kraken'||type==='whale'?12:type==='storm'?11:13;const off={storm:null,ghost:.7,ship:.7,serpent:.55,octopus:.45,kraken:.45,crab:.4,whale:.35}[type];drawBoss(c,{type:type==='ghost'?'ship':type,ghost:type==='ghost',col:d.col},type==='serpent'?27:24,off==null?22:29-r*off,r,1,3000,false,off==null?null:29);}
  c.restore();});}
function decorateView(){paintMons();paintFish();try{checkCatch();}catch(e){}try{checkMC();huntCheck();autoCards();}catch(e){console.error(e);}const cv=$('#scene');if(cv&&!cv.nextElementSibling?.classList.contains('fsBtn'))cv.insertAdjacentHTML('afterend',`<button class="fsBtn" data-act="focusOn" aria-label="Full screen" title="Full screen">${FS_ICON}</button>`);paintAch();}
const _render6=render;render=function(){_render6();try{decorateView();}catch(e){console.error(e);}};
const _openModal6=openModal;openModal=function(html){_openModal6(html);try{paintAch($('#modal'));paintFish($('#modal'));}catch(e){}};

/* 21 Nov: every More tile gets its own icon and colour (Hall of Fame and Achievements both had a star; Vault matched the review) */
APP_ICONS.hall=['#3E7C8A','M7 3h10v2h3v3a4 4 0 0 1-4 4h-.4A5 5 0 0 1 13 14.9V17h3v2.2H8V17h3v-2.1A5 5 0 0 1 8.4 12H8a4 4 0 0 1-4-4V5h3zM6 7v1a2 2 0 0 0 1 1.7V7zm12 0h-1v2.7A2 2 0 0 0 18 8zM7 20.4h10V22H7z'];
APP_ICONS.book=['#DDA94D','M6 2h4l2 4 2-4h4l-3.4 5.9A6.5 6.5 0 1 1 9.4 7.9zM12 10.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z'];
// 21 Nov: the Trophy case gets a proper fish
APP_ICONS.trophy=['#3E9FB8','M1.6 12C4.2 7.8 8 5.8 12 5.8c3.4 0 6.3 1.6 8.4 4.2l2-3.2v10.4l-2-3.2c-2.1 2.6-5 4.2-8.4 4.2-4 0-7.8-2-10.4-6.2zM8.4 10.6a1.4 1.4 0 0 0-2.8 0a1.4 1.4 0 0 0 2.8 0zM12.6 15.6c1.4-1 2.2-2.2 2.2-3.6s-.8-2.6-2.2-3.6c.6 1.1.9 2.3.9 3.6s-.3 2.5-.9 3.6z'];
