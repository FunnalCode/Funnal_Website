/* ============================== 25 Nov: character voices, take two ==============================
   Animal Crossing style "animalese": every letter of the line is sung as a tiny, fast, pitched-up
   syllable, the way the villagers talk. The sound is a voice, not a beep: a buzzing vocal source shaped
   by vowel formants (the resonances that make "ah", "ee", "oo"), so each letter sounds like a sped-up
   spoken letter. Each character has a pitch, a speed and a "head size" (a smaller head = higher, brighter
   formants). Gary and his mum squawk instead of talking.
   Pure maths into a sample buffer, no Web Audio nodes, so the same code renders a preview file in Node. */
const VOXSYN=(()=>{
  // vowel formants (F1, F2, F3) in Hz for an adult voice
  const V={a:[730,1090,2440],e:[530,1840,2480],i:[300,2250,2950],o:[570,840,2410],u:[320,900,2250],y:[400,1600,2500],er:[490,1350,1690]};
  // each letter as it's said out loud: [vowel start, vowel end, consonant type]
  const L={a:['e','i',''],b:['i','i','p'],c:['i','i','s'],d:['i','i','p'],e:['i','i',''],f:['e','e','f'],g:['i','i','p'],h:['e','i','h'],
    i:['a','i',''],j:['e','i','p'],k:['e','i','p'],l:['e','o','l'],m:['e','e','m'],n:['e','e','m'],o:['o','u',''],p:['i','i','p'],
    q:['u','u','p'],r:['a','er','l'],s:['e','e','s'],t:['i','i','p'],u:['u','u','y'],v:['i','i','f'],w:['u','u','l'],x:['e','e','s'],
    y:['a','i','l'],z:['i','i','s']};
  // a steady pitch step per letter, so a line always sounds the same (semitones)
  const STEP=ch=>[0,2,-1,3,1,-2,4,0,2,-1,1,3][(ch.charCodeAt(0)*5)%12];
  let seed=1;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  function res(F,BW,sr){const c=-Math.exp(-2*Math.PI*BW/sr),b=2*Math.exp(-Math.PI*BW/sr)*Math.cos(2*Math.PI*F/sr),a=1-b-c;return {a,b,c,y1:0,y2:0};}
  function setRes(r,F,BW,sr){r.c=-Math.exp(-2*Math.PI*BW/sr);r.b=2*Math.exp(-Math.PI*BW/sr)*Math.cos(2*Math.PI*Math.min(F,sr*.45)/sr);r.a=1-r.b-r.c;}
  const run=(r,x)=>{const y=r.a*x+r.b*r.y1+r.c*r.y2;r.y2=r.y1;r.y1=y;return y;};

  /* one syllable: consonant onset into cb, the voiced vowel into vb, from sample n0 */
  function syl(vb,cb,n0,sr,p,o){
    const len=Math.round(o.dur*sr),con=o.con,conLen=con==='s'||con==='f'||con==='h'?Math.round(.02*sr*p.cons):con==='p'?Math.round(.01*sr):0;
    const R=[res(500,80,sr),res(1500,100,sr),res(2500,140,sr),res(3500,250,sr)];let ph=0,lp=0,lp2=0,prev=0,hp=0,hpx=0;
    const k=p.k,v1=V[o.v1],v2=V[o.v2];
    // consonant: soft "s" hiss, breathy f/h, a tiny tap for plosives
    for(let i=0;i<conLen;i++){const n=n0+i;if(n>=cb.length)break;const nz=rnd()*2-1;hp=.55*(hp+nz-hpx);hpx=nz;
      const env=Math.sin(Math.PI*i/conLen),amp=con==='p'?.05:con==='s'?.07:.035;cb[n]+=(con==='s'?hp:(con==='p'?hp:nz*.4))*env*amp*p.vol;}
    const vs=con==='p'?Math.round(conLen*.6):conLen;
    for(let i=vs;i<len;i++){const n=n0+i;if(n>=vb.length)break;const tv=(i-vs)/Math.max(1,len-vs);
      let f0=o.f0*(1+(p.lilt||0)*(.5-Math.abs(tv-.3))*.1)*(1+(o.glide-1)*tv);
      if(p.vib)f0*=1+p.vib[1]*Math.sin(2*Math.PI*p.vib[0]*n/sr);
      if(p.jit)f0*=1+(rnd()*2-1)*p.jit;
      ph+=f0/sr;let src=0;if(ph>=1){ph-=1;src=1;}
      // glottal pulse: an impulse rounded off by two gentle low-passes
      lp+=.25*(src-lp);lp2+=.25*(lp-lp2);let x=lp2;if(p.breath)x=x*(1-p.breath*.6)+(rnd()*2-1)*p.breath*.02;
      const m=con==='m'&&tv<.3?.55:1,gl=con==='l'&&tv<.25?.8:1,ease=Math.min(1,tv*1.5);
      for(let j=0;j<3;j++){const F=(v1[j]+(v2[j]-v1[j])*ease)*k*(j===0?m:1)*(j===1?gl:1);setRes(R[j],F,(55+j*35)*(p.bw||1),sr);}
      setRes(R[3],3500*k,260,sr);
      let y=run(R[3],run(R[2],run(R[1],run(R[0],x))));const out=y-.8*prev;prev=y;   // cascade, then lip radiation (gentle, keeps some chest)
      const a=Math.min(1,(i-vs)/(.005*sr)),r=Math.min(1,(len-i)/(.016*sr));
      vb[n]+=out*a*r*p.vol;}
    return len;}

  /* a squawk: a harsh "aark" that drops in pitch, for gulls */
  function squawk(vb,n0,sr,p,o){const len=Math.round(o.dur*sr);const R=[res(900,150,sr),res(1700,200,sr),res(3000,300,sr)];let ph=0,lp=0,prev=0;
    for(let i=0;i<len;i++){const n=n0+i;if(n>=vb.length)break;const t=i/len;
      const f0=o.f0*(1.25-t*.55)*(1+(rnd()*2-1)*.05);ph+=f0/sr;let src=0;if(ph>=1){ph-=1;src=1;}
      lp+=.4*(src-lp);const x=lp+(rnd()*2-1)*.015;
      setRes(R[0],820*p.k,180,sr);setRes(R[1],(1500-t*350)*p.k,240,sr);setRes(R[2],2900*p.k,340,sr);
      const y=run(R[2],run(R[1],run(R[0],x)));const out=y-prev;prev=y;
      const a=Math.min(1,t/.04),r=Math.pow(1-t,1.4);vb[n]+=out*a*r*p.vol;}
    return len;}

  /* the cast. f0: talking pitch. k: head size (formant scale). rate: seconds per letter. max: letters per line */
  const CAST={
    bill:  {f0:96, k:.84,rate:.088,max:24,vol:1.15,lilt:.6,bw:1.2,cons:1.1},          // big, deep, unhurried
    gary:  {squawk:true,f0:620,k:1.35,vol:1},                                          // squawks, that's all
    mum:   {squawk:true,f0:760,k:1.5,vol:.85},
    pell:  {f0:245,k:1.08,rate:.058,max:34,vol:1,lilt:1.4,bw:.7,cons:1},               // quick, nasal salesman
    fence: {f0:150,k:.95,rate:.072,max:24,vol:.7,lilt:.3,breath:.9,cons:1.6},          // low, breathy, shifty
    crab:  {f0:330,k:1.45,rate:.048,max:22,vol:.85,lilt:.4,staccato:.55,cons:.6},     // small, clipped
    crumb: {f0:265,k:1.12,rate:.064,max:30,vol:1,lilt:1,cons:1},                       // warm baker
    hobbs: {f0:118,k:.9,rate:.07,max:28,vol:1,lilt:.5,cons:1},                         // gruff harbourmaster
    nell:  {f0:330,k:1.22,rate:.052,max:36,vol:.95,lilt:1.2,vib:[7,.025],cons:1},      // chatty, sing-song
    lenny: {f0:140,k:.95,rate:.1,max:20,vol:1,lilt:.3,cons:1},                         // slow and sleepy
    fergus:{f0:200,k:1.02,rate:.062,max:30,vol:1,lilt:1.6,bounce:true,cons:1},         // bouncy
    pike:  {f0:290,k:1.18,rate:.047,max:36,vol:.95,lilt:.7,cons:1},                    // fast and sharp
    oldtom:{f0:160,k:.92,rate:.09,max:22,vol:.95,lilt:.4,vib:[5,.04],jit:.01,cons:1},  // old and wobbly
    harbour:{f0:220,k:1.05,rate:.062,max:28,vol:1,lilt:1,cons:1}};
  const ALIAS={baker:'crumb',harbourmaster:'hobbs',town:'harbour',landmark:'harbour',houses:'harbour'};

  /* render a line for a character. returns a Float32Array at sample rate sr */
  function render(who,text,sr){who=ALIAS[who]||who;const p=CAST[who];if(!p||!text)return null;seed=7;
    text=String(text).replace(/\{[^}]*\}/g,'').toLowerCase();
    if(p.squawk){const words=text.split(/\s+/).filter(Boolean);const n=Math.max(1,Math.min(4,Math.ceil(words.length/4)));const bang=/!/.test(text);
      const buf=new Float32Array(Math.round(sr*(n*.36+.2)));let at=Math.round(.02*sr);
      for(let i=0;i<n;i++){const big=i===0||(bang&&i===n-1);const d=big?.26:.16;squawk(buf,at,sr,p,{f0:p.f0*(big?1:1.12)*(i%2?1.06:1),dur:d});at+=Math.round((d+.09)*sr);}
      return norm(buf.subarray(0,Math.min(buf.length,at+Math.round(.05*sr))),.8);}
    // letters only, spaces become short rests, sentence ends longer ones, capped like the games do
    const ev=[];let count=0;for(const ch of text){if(count>=p.max)break;if(L[ch]){ev.push({ch});count++;}else if(/\s/.test(ch)){if(ev.length&&ev[ev.length-1].rest==null)ev.push({rest:.35});}else if(/[.!?,]/.test(ch))ev.push({rest:ch===','?.9:1.6,end:ch});}
    while(ev.length&&ev[ev.length-1].rest!=null)ev.pop();
    const q=/\?\s*$/.test(text),total=ev.reduce((s,e)=>s+(e.rest!=null?e.rest*p.rate:p.rate),0);
    const buf=new Float32Array(Math.round(sr*(total+.15))),cb=new Float32Array(buf.length);let at=Math.round(.01*sr),li=0;
    ev.forEach((e,i)=>{if(e.rest!=null){at+=Math.round(e.rest*p.rate*sr);return;}
      const [v1,v2,con]=L[e.ch];let semi=STEP(e.ch)*(p.lilt||1)*.8;if(p.bounce)semi+=li%2?2.5:0;
      const last=!ev.slice(i+1).some(x=>x.ch);if(last&&q)semi+=4;
      const f0=p.f0*Math.pow(2,semi/12),dur=p.rate*(p.staccato||.92);
      syl(buf,cb,at,sr,p,{f0,dur,v1,v2,con,glide:last?(q?1.12:.86):.97});at+=Math.round(p.rate*sr);li++;});
    norm(buf,.72);for(let i=0;i<buf.length;i++)buf[i]=Math.max(-.95,Math.min(.95,buf[i]+cb[i]*6));
    return buf;}
  function norm(b,to){let m=0;for(let i=0;i<b.length;i++)m=Math.max(m,Math.abs(b[i]));if(m>0){const g=to/m;for(let i=0;i<b.length;i++)b[i]*=g;}return b;}
  return {render,cast:Object.keys(CAST),alias:ALIAS};})();
if(typeof module!=='undefined')module.exports=VOXSYN;
