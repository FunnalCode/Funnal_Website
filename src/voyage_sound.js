/* ============================== VOYAGE SOUNDSCAPES (21 Nov) ==============================
   Each place you sail through has its own quiet soundscape, made live in the browser (no audio files): the sea and the
   wind underneath, then the things that make the place: gulls on the coasts, an owl and a creaking wreck in Wreckers'
   Bay, a waterfall and birdsong in the Amber Gorge, chimes over the Sky Isles, a howling wind and a far bell in
   Frostholm, dry wind and a lone plucked melody in the Sunken Sands, drips and glassy chimes in the Crystal Caverns,
   koto notes in the Blossom Isles, rain and thunder on the Thunder Coast, creaking ice under the Glass Glacier, rumbles,
   crackles and bubbling lava in the Ember Isles, and insects and birds around the Emerald Temple. It plays while a voyage is on screen
   (the Lock In screen or full screen), only with sound on (the speaker button), and fades between places. */
const SCAPE={cur:null,id:null,master:null};
const SCAPE_VOL=.22;
const NBUF={};
function noiseBuf(ac,type){if(NBUF[type])return NBUF[type];const n=ac.sampleRate*4,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);let l=0,b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for(let i=0;i<n;i++){const w=Math.random()*2-1;if(type==='white')d[i]=w*.5;else if(type==='brown'){l=(l+.02*w)/1.02;d[i]=l*3.2;}else{b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11;b6=w*.115926;}}
  NBUF[type]=b;return b;}
function scapeMaster(ac){if(!SCAPE.master){const g=ac.createGain();g.gain.value=0;g.connect(ac.destination);SCAPE.master=g;}return SCAPE.master;}
// one place's soundscape: continuous beds plus little events on timers
function makeScape(ac,id){const out=ac.createGain();out.gain.value=0;out.connect(scapeMaster(ac));const nodes=[],timers=[];const now=()=>ac.currentTime;
  const src=type=>{const s=ac.createBufferSource();s.buffer=noiseBuf(ac,type);s.loop=true;s.loopStart=Math.random()*3;s.start(0,Math.random()*3);nodes.push(s);return s;};
  const lfo=(rate,depth,param)=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=rate;g.gain.value=depth;o.connect(g);g.connect(param);o.start();nodes.push(o);};
  const bed=(type,ftype,freq,q,vol,swell,rate)=>{const s=src(type),f=ac.createBiquadFilter();f.type=ftype;f.frequency.value=freq;f.Q.value=q||.7;const g=ac.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(out);if(swell)lfo(rate||.08,vol*swell,g.gain);return {f,g};};
  const waves=(v=1)=>{bed('brown','lowpass',520,.5,.55*v,.6,.09);bed('pink','lowpass',1400,.4,.05*v,.9,.07);};
  const wind=(freq,v=1)=>{const w=bed('pink','bandpass',freq,1.4,.16*v,.7,.05);lfo(.03,freq*.35,w.f.frequency);};
  const pad=(freqs,v=1,type='sine')=>{freqs.forEach((fq,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=fq;o.detune.value=(i%2?6:-6);g.gain.value=.018*v;o.connect(g);g.connect(out);lfo(.07+i*.02,.012*v,g.gain);lfo(.2,3,o.detune);o.start();nodes.push(o);});};
  const env=(g,a,peak,d,t0)=>{g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(peak,t0+a);g.gain.exponentialRampToValueAtTime(.0001,t0+a+d);};
  const tone=(fq,type,peak,a,d,{to,glide,filt,echo}={})=>{const t0=now()+.02,o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(fq,t0);if(to)o.frequency.exponentialRampToValueAtTime(to,t0+(glide||d));let n=o;if(filt){const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=filt;o.connect(f);n=f;}n.connect(g);g.connect(out);
    if(echo){const dl=ac.createDelay(1);dl.delayTime.value=echo;const fb=ac.createGain();fb.gain.value=.35;g.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(out);setTimeout(()=>{try{dl.disconnect();fb.disconnect();}catch(e){}},(a+d+3)*1000);}
    env(g,a,peak,d,t0);o.start(t0);o.stop(t0+a+d+.1);};
  const burst=(type,ftype,freq,peak,a,d)=>{const t0=now()+.02,s=ac.createBufferSource();s.buffer=noiseBuf(ac,type);const f=ac.createBiquadFilter();f.type=ftype;f.frequency.value=freq;const g=ac.createGain();s.connect(f);f.connect(g);g.connect(out);env(g,a,peak,d,t0);s.start(t0,Math.random()*3);s.stop(t0+a+d+.1);};
  const every=(min,max,fn)=>{let alive=true,h=0;const go=()=>{if(!alive)return;try{fn();}catch(e){}h=setTimeout(go,min+Math.random()*(max-min));};h=setTimeout(go,Math.random()*min);timers.push({stop:()=>{alive=false;clearTimeout(h);}});};
  const pent=[0,2,4,7,9],note=(root,deg)=>root*Math.pow(2,(pent[deg%5]+12*Math.floor(deg/5))/12);
  const bird=()=>{const n=2+Math.floor(Math.random()*4),base=2200+Math.random()*1400;for(let i=0;i<n;i++)setTimeout(()=>tone(base*(1+Math.random()*.25),'sine',.03,.01,.12,{to:base*1.35,glide:.1}),i*130);};
  const gull=()=>{const b=1500+Math.random()*300;tone(b,'sawtooth',.012,.04,.35,{to:b*.7,glide:.3,filt:2200});setTimeout(()=>tone(b*1.05,'sawtooth',.01,.04,.3,{to:b*.72,glide:.25,filt:2200}),320);};
  const owl=()=>{tone(400,'sine',.05,.08,.35,{to:370,filt:900});setTimeout(()=>tone(400,'sine',.04,.08,.5,{to:360,filt:900}),520);};
  const creak=()=>tone(90+Math.random()*40,'sawtooth',.03,.4,1.4,{to:70+Math.random()*30,glide:1.6,filt:500});
  const bell=(f=330)=>{tone(f,'sine',.04,.01,4,{echo:.4});tone(f*2.4,'sine',.012,.01,2.4);};
  const chime=(root)=>tone(note(root,Math.floor(Math.random()*10)),'sine',.035,.005,2.6,{echo:.33});
  const pluck=(root,type='triangle')=>{const t=note(root,Math.floor(Math.random()*8));tone(t,type,.05,.004,.9,{filt:2600,echo:.28});};
  const drip=()=>tone(1200+Math.random()*900,'sine',.04,.002,.25,{to:700,glide:.15,echo:.22});
  const thunder=()=>{burst('brown','lowpass',180,.5,.25,3.5);setTimeout(()=>burst('brown','lowpass',90,.4,.1,2.5),400);};
  const crackle=()=>{for(let i=0;i<3+Math.random()*4;i++)setTimeout(()=>burst('white','highpass',2500,.05,.002,.03),Math.random()*400);};
  const bubble=()=>tone(110+Math.random()*60,'sine',.08,.01,.25,{to:50,glide:.2});
  const insects=()=>{const f=4200+Math.random()*800;for(let i=0;i<6;i++)setTimeout(()=>tone(f,'square',.006,.005,.04,{filt:6000}),i*55);};
  const iceCrack=()=>{burst('white','bandpass',1800,.06,.002,.12);setTimeout(creak,200);};
  switch(id){
    case 'fjord':waves(.9);wind(420,.7);every(9000,18000,bird);break;
    case 'cliffs':waves(1.1);every(6000,14000,gull);break;
    case 'ruins':waves(1);wind(500,.6);every(8000,16000,gull);break;
    case 'isles':waves(.8);every(5000,11000,bird);every(14000,26000,gull);break;
    case 'haunted':waves(.9);wind(300,.9);pad([110,130.8,164.8],1.1);every(9000,17000,owl);every(7000,14000,creak);every(20000,32000,()=>bell(196));break;
    case 'autumn':waves(.6);bed('pink','bandpass',1800,.6,.09,.15,.2);wind(650,.6);every(4000,9000,bird);break;
    case 'sky':wind(900,.8);pad([220,277.2,329.6,440],1.2);every(2500,6000,()=>chime(523));break;
    case 'winter':waves(.5);wind(480,1.4);every(18000,30000,()=>bell(294));every(9000,20000,()=>chime(784));break;
    case 'desert':waves(.5);wind(720,1.1);every(5000,11000,()=>pluck(147,'triangle'));break;
    case 'crystal':bed('pink','bandpass',1600,.6,.06,.2,.15);pad([196,246.9,293.7],.8);every(1500,4000,drip);every(3000,7000,()=>chime(1047));break;
    case 'blossom':waves(.6);every(2500,5500,()=>pluck(294,'triangle'));every(7000,14000,bird);break;
    case 'storm':waves(1.5);wind(560,1.3);bed('white','highpass',2400,.5,.06,.3,.3);every(9000,18000,thunder);break;
    case 'glacier':waves(.5);wind(440,1.2);pad([261.6,329.6,392],.7);every(7000,15000,iceCrack);every(10000,20000,()=>chime(988));break;
    case 'volcano':waves(.6);bed('brown','lowpass',110,.7,.6,.4,.05);every(1200,3500,crackle);every(1500,4000,bubble);every(14000,26000,thunder);break;
    // the Rusty Anchor: a low fire rumble and hiss, little snaps and pops, a bigger crackle now and then, a log settling
    case 'tavern':bed('brown','lowpass',220,.7,.35,.35,.12);bed('pink','bandpass',1300,.9,.022,.6,.35);every(160,650,()=>burst('white','highpass',2200+Math.random()*2400,.02+Math.random()*.04,.001,.015+Math.random()*.03));every(1400,3800,crackle);every(7000,15000,()=>burst('brown','lowpass',320,.12,.03,.6));break;
    case 'jungle':waves(.4);bed('pink','bandpass',1600,.6,.05,.15,.2);every(1800,4000,bird);every(1200,2600,insects);break;
    default:waves(1);}
  return {out,stop(fade=2.5){const t=now();try{out.gain.cancelScheduledValues(t);out.gain.setValueAtTime(out.gain.value,t);out.gain.linearRampToValueAtTime(0,t+fade);}catch(e){}
      timers.forEach(x=>x.stop());setTimeout(()=>{nodes.forEach(n=>{try{n.stop&&n.stop();n.disconnect();}catch(e){}});try{out.disconnect();}catch(e){}},fade*1000+200);},
    start(fade=2.5){const t=now();out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(1,t+fade);}};}
// keep the right soundscape playing while the voyage is on screen
{const _dvS=drawVoyage;drawVoyage=function(){VOY.lastDraw=performance.now();return _dvS.apply(this,arguments);};}
function scapeTick(){try{const play=!!(S&&S.sound&&isArtLook()&&VOY.lk&&VOY.lastDraw&&performance.now()-VOY.lastDraw<1500&&document.visibilityState==='visible'&&ENVST.a);
    if(!play){if(SCAPE.cur){SCAPE.cur.stop(1.2);SCAPE.cur=null;SCAPE.id=null;}return;}
    const ac=getAC();if(!ac)return;const m=scapeMaster(ac);if(m.gain.value<SCAPE_VOL*.99){m.gain.setTargetAtTime(SCAPE_VOL,ac.currentTime,.4);}
    const want=(ENVST.fade>.5?ENVST.b:ENVST.a).id;if(SCAPE.id!==want){if(SCAPE.cur)SCAPE.cur.stop(3);SCAPE.cur=makeScape(ac,want);SCAPE.cur.start(3);SCAPE.id=want;}}catch(e){}}
setInterval(scapeTick,500);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible'&&SCAPE.cur){SCAPE.cur.stop(.3);SCAPE.cur=null;SCAPE.id=null;}});

// the fire in the Tavern crackles while you're in there (follows the sound button)
const TVSCAPE={cur:null};
setInterval(()=>{try{const play=!!(S&&S.sound&&S.screen==='tavern'&&document.visibilityState==='visible');if(!play){if(TVSCAPE.cur){TVSCAPE.cur.stop(1.2);TVSCAPE.cur=null;}return;}
  const ac=getAC();if(!ac)return;const m=scapeMaster(ac);if(m.gain.value<SCAPE_VOL*.99)m.gain.setTargetAtTime(SCAPE_VOL,ac.currentTime,.4);if(!TVSCAPE.cur){TVSCAPE.cur=makeScape(ac,'tavern');TVSCAPE.cur.start(2);}}catch(e){}},500);
