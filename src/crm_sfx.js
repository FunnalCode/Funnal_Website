/* ===== 23 Nov: pipeline sounds. Soft, clean UI sounds made in Web Audio (no files to load).
   They follow the game's sound switch (S.sound), so muting the game mutes these too. */
const CSND=(()=>{let ac=null,bus=null;const last={};
  function ctx(){if(S.sound===false)return null;try{if(!ac){ac=getAC();if(!ac)return null;
      const comp=ac.createDynamicsCompressor();comp.threshold.value=-20;comp.knee.value=18;comp.ratio.value=3;comp.attack.value=.003;comp.release.value=.2;
      const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=7200;lp.Q.value=.4;
      bus=ac.createGain();bus.gain.value=.8;bus.connect(lp);lp.connect(comp);comp.connect(ac.destination);}
    if(ac.state==='suspended')ac.resume();return ac;}catch(e){return null;}}
  const thr=(k,ms)=>{const n=performance.now();if(last[k]&&n-last[k]<ms)return false;last[k]=n;return true;};
  // a soft mallet: sine body plus a quick, quiet overtone, with a gentle attack and natural decay
  function mallet(f,when=0,vol=.08,dec=.32,bright=.22){const a=ctx();if(!a)return;const t=a.currentTime+.005+when;
    [[1,vol,dec],[3.98,vol*bright,dec*.28],[2,vol*.18,dec*.5]].forEach(([m,v,d])=>{const o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.setValueAtTime(f*m,t);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(bus);o.start(t);o.stop(t+d+.02);});}
  function blip(f0,f1,dur,vol,when=0,type='sine'){const a=ctx();if(!a)return;const t=a.currentTime+.005+when;const o=a.createOscillator(),g=a.createGain();o.type=type;
    o.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)o.frequency.exponentialRampToValueAtTime(f1,t+dur);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.006);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(bus);o.start(t);o.stop(t+dur+.02);}
  let NB=null;function air(dur,vol,f0,f1,when=0,q=.9){const a=ctx();if(!a)return;if(!NB){NB=a.createBuffer(1,a.sampleRate,a.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}
    const t=a.currentTime+.005+when;const s=a.createBufferSource();s.buffer=NB;const f=a.createBiquadFilter();f.type='bandpass';f.Q.value=q;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur);
    const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+dur*.35);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(bus);s.start(t);s.stop(t+dur+.02);}
  return{
    on:()=>S.sound!==false,
    tap(){if(thr('tap',40))blip(1500,1150,.03,.035);},
    tick(){if(thr('tick',30))blip(2200,1900,.018,.02);},
    toggle(on){blip(on?900:700,on?1300:520,.06,.045);},
    open(){if(!thr('open',90))return;air(.2,.05,700,2600);mallet(660,.03,.035,.22,.1);},
    close(){if(!thr('close',90))return;air(.16,.035,2200,600);blip(620,420,.09,.03);},
    swipe(dir){if(thr('swipe',60))air(.14,.04,dir>0?900:1800,dir>0?1800:900,0,1.4);},
    lift(){blip(440,620,.07,.05);},
    move(){mallet(659,0,.07,.3);mallet(988,.075,.06,.34);},
    back(){mallet(784,0,.06,.28);mallet(587,.07,.05,.3);},
    add(){mallet(784,0,.06,.25);mallet(1175,.06,.055,.3);blip(1568,1568,.05,.015,.12);},
    done(){if(thr('done',120)){mallet(1047,0,.05,.22,.12);mallet(1397,.055,.045,.26,.12);}},
    send(){air(.22,.045,600,3000);mallet(784,.05,.05,.26);mallet(1175,.12,.05,.3);mallet(1568,.19,.04,.36);},
    del(){mallet(392,0,.07,.26,.1);mallet(294,.07,.06,.34,.1);},
    paid(){mallet(1568,0,.06,.5,.35);mallet(2349,.06,.05,.6,.35);blip(3136,3136,.08,.012,.1);},
    notify(){if(thr('notify',800)){mallet(880,0,.07,.4,.25);mallet(1319,.12,.065,.55,.25);}},
    won(){[523,659,784,1047,1319].forEach((f,i)=>mallet(f,i*.075,.065,.5,.3));air(.6,.03,3000,7000,.3,.7);},
    err(){blip(220,160,.14,.06,0,'triangle');},
  };})();
/* map pipeline buttons to sounds (anything not listed stays silent) */
const CSND_MAP={view:'tap',tab:'tap',setTab:'tap',calMode:'tap',calOwner:'tap',anP:'tap',rail:'tap',searchT:'tap',pri:'tap',snooze:'tap',stage:'tap',stageGo:'tap',goalNav:'tap',goal:'tap',review:'tap',quiet:'tap',rag:'tap',prod:'tap',next:'tap',qtPick:'tap',
  open:'open',add:'open',settings:'open',evNew:'open',evNewAt:'open',evOpen:'open',qtNew:'open',qtOpen:'open',
  close:'close',sheetClose:'close',addClose:'close',back:'close',
  addGo:'add',catAdd:'add',evSave:'done',done:'done',ok:'done',okRow:'done',qtCopy:'done',
  del:'del',catHide:'del',evDel:'del',qtDel:'del',closed:'back'};
function csndClick(c,b){try{if(!CSND.on())return;if(c==='calMove'){CSND.swipe(+b.dataset.n||1);return;}if(c==='qtSave'){b.dataset.pub==='1'?CSND.send():CSND.done();return;}
  if(b.type==='checkbox'||b.matches('input[type=checkbox]')){CSND.toggle(b.checked);return;}const k=CSND_MAP[c];if(k)CSND[k]();}catch(e){}}
/* stage moves: one clean sound in the pipeline instead of the game's pop + fanfare */
{const _m=pMove;pMove=async function(id,to,opts){if(!document.documentElement.classList.contains('crmOpen'))return _m.apply(this,arguments);
  const r=PIPE.rows.find(x=>x.id===id);const from=r&&r.stage;const sp=SND.pop,sl=SND.level;SND.pop=()=>{};SND.level=()=>{};
  try{const res=await _m.apply(this,arguments);const r2=PIPE.rows.find(x=>x.id===id);if(r2&&r2.stage===to&&from!==to){
      if(to==='client')CSND.won();else if((P_IDX[to]??99)<(P_IDX[from]??-1)||!(to in P_IDX))CSND.back();else CSND.move();}return res;}
  finally{SND.pop=sp;SND.level=sl;}};}
{const _p=payMark;payMark=async function(r,d){const was=payPaid(r,d);const res=await _p.apply(this,arguments);if(!was&&payPaid(r,d))CSND.paid();return res;};}
{const _a=qevAlert;qevAlert=function(e){_a.apply(this,arguments);try{if(e.kind==='accept')CSND.won();else if(e.kind==='open')CSND.notify();}catch(x){}};}
