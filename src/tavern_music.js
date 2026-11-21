/* ============================== THE JUKEBOX (Stage 5) ==============================
   Traditional shanties and carols (all public domain), played by a small built-in synth.
   Two to start; one more per weekly boss you help sink (up to all of them); Season 1 adds its own
   tune; the Christmas set of five arrives on 1 December. Pick one to play in the Tavern or as background music. */
const SONGS=[
  {id:'drunken',name:'Drunken Sailor',bpm:150,notes:'A4:2 A4:1 A4:1 A4:2 A4:1 A4:1 A4:2 D4:2 F4:2 A4:2 G4:2 G4:1 G4:1 G4:2 G4:1 G4:1 G4:2 C4:2 E4:2 G4:2 A4:2 A4:1 A4:1 A4:2 A4:1 A4:1 A4:2 B4:2 C5:2 D5:2 C5:2 A4:2 G4:2 E4:2 D4:4 D4:4 A4:6 A4:2 A4:4 D4:2 F4:2 G4:6 G4:2 G4:4 C4:2 E4:2 A4:6 A4:2 A4:4 B4:2 C5:2 D5:2 C5:2 A4:2 G4:2 E4:2 D4:4 D4:4',base:true},
  {id:'blowdown',name:'Blow the Man Down',bpm:132,notes:'D4:2 G4:2 G4:1 G4:1 G4:2 B4:2 A4:2 G4:2 E4:4 D4:2 B4:2 A4:2 G4:2 F#4:2 A4:2 D5:6 R:2 D4:2 G4:2 G4:2 G4:2 B4:2 A4:2 G4:2 E4:4 D4:2 C5:2 B4:2 A4:2 G4:4 F#4:2 G4:6 R:2',base:true},
  {id:'haulaway',name:'Haul Away Joe',bpm:140,notes:'D4:2 G4:2 G4:2 G4:2 A4:2 B4:2 G4:2 E4:2 D4:2 G4:2 A4:2 B4:2 C5:2 B4:2 A4:4 B4:2 C5:2 D5:4 B4:2 G4:2 A4:2 B4:2 G4:6 R:2',weeks:1},
  {id:'spanish',name:'Spanish Ladies',bpm:120,notes:'D4:2 D4:1 E4:1 F4:2 F4:2 E4:2 D4:2 C4:2 A3:2 D4:4 D4:2 F4:2 A4:2 A4:2 G4:2 F4:2 E4:2 F4:2 G4:4 A4:2 G4:2 F4:2 E4:2 D4:2 C4:2 A3:2 C4:2 D4:6 R:2',weeks:3},
  {id:'johnny',name:'Leave Her, Johnny',bpm:96,notes:'C4:2 F4:2 F4:2 F4:2 A4:2 G4:2 F4:2 D4:4 C4:2 F4:2 A4:2 C5:2 A4:2 G4:4 R:2 C5:2 C5:2 A4:2 F4:2 G4:2 A4:2 G4:2 F4:2 D4:4 C4:2 F4:2 G4:2 A4:2 G4:2 F4:6 R:2',weeks:6},
  {id:'santiana',name:'Santiana',bpm:116,notes:'E4:2 A4:2 A4:2 A4:2 B4:2 C5:2 B4:2 A4:2 G4:4 E4:2 G4:2 G4:2 G4:2 A4:2 B4:2 A4:2 G4:2 E4:4 R:2 A4:2 C5:2 C5:2 B4:2 A4:2 G4:2 E4:2 D4:4 E4:2 A4:2 A4:2 B4:2 A4:6 R:2',weeks:10},
  {id:'fathoms',name:'The Frozen Fathoms (Season 1)',bpm:100,notes:'E4:3 G4:1 B4:2 E5:4 D5:2 B4:2 C5:3 B4:1 A4:2 G4:4 R:2 E4:3 G4:1 B4:2 A4:4 G4:2 F#4:2 E4:8 R:2',season:1},
  {id:'jingle',name:'Jingle Bells',bpm:160,notes:'E4:2 E4:2 E4:4 E4:2 E4:2 E4:4 E4:2 G4:2 C4:3 D4:1 E4:8 F4:2 F4:2 F4:3 F4:1 F4:2 E4:2 E4:2 E4:1 E4:1 E4:2 D4:2 D4:2 E4:2 D4:4 G4:4',xmas:true},
  {id:'deck',name:'Deck the Halls',bpm:140,notes:'G4:3 F4:1 E4:2 D4:2 C4:2 D4:2 E4:2 C4:2 D4:1 E4:1 F4:1 D4:1 E4:3 D4:1 C4:2 B3:2 C4:4 R:2',xmas:true},
  {id:'wewish',name:'We Wish You a Merry Christmas',bpm:150,notes:'D4:2 G4:2 G4:1 A4:1 G4:1 F#4:1 E4:2 E4:2 E4:2 A4:2 A4:1 B4:1 A4:1 G4:1 F#4:2 D4:2 D4:2 B4:2 B4:1 C5:1 B4:1 A4:1 G4:2 E4:2 D4:1 D4:1 E4:2 A4:2 F#4:2 G4:4 R:2',xmas:true},
  {id:'wenceslas',name:'Good King Wenceslas',bpm:120,notes:'G4:2 G4:2 G4:2 A4:2 G4:2 G4:2 D4:4 E4:2 D4:2 E4:2 F#4:2 G4:4 G4:4 R:2',xmas:true},
  {id:'godrest',name:'God Rest Ye Merry Gentlemen',bpm:130,notes:'E4:2 E4:2 B4:2 B4:2 A4:2 G4:2 F#4:2 E4:2 D4:2 E4:2 F#4:2 G4:2 A4:2 B4:6 R:2',xmas:true}];
const SONG_BY=Object.fromEntries(SONGS.map(s=>[s.id,s]));
function songUnlocked(s){if(s.base)return true;const m=(G.players[S.me]||{}).m||{};if(s.weeks)return (m.weeks||0)>=s.weeks;if(s.season)return G.today>='2026-12-01';if(s.xmas)return G.today>='2026-12-01';return false;}
function songHint(s){return s.weeks?`Help sink ${s.weeks} weekly boss${s.weeks>1?'es':''}`:s.season?'Season 1 (from 1 December)':s.xmas?'Christmas (from 1 December)':'';}
const NOTE_I={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function noteHz(n){const m=/^([A-G])(#|b)?(\d)$/.exec(n);if(!m)return 0;const midi=12*(+m[3]+1)+NOTE_I[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0);return 440*Math.pow(2,(midi-69)/12);}
const JUKE={on:null,timer:null,vol:.05,bg:false};
function jukeStop(){clearTimeout(JUKE.timer);JUKE.on=null;JUKE.bg=false;}
function jukePlay(id,opts={}){jukeStop();const s=SONG_BY[id];if(!s)return;JUKE.on=id;JUKE.bg=!!opts.bg;const once=!!opts.once;let ac;try{ac=getAC();}catch(e){return;}
  const toks=s.notes.split(/\s+/).map(t=>{const [n,d]=t.split(':');return{hz:n==='R'?0:noteHz(n),d:+d||1};});const eighth=60/s.bpm/2;
  const sched=()=>{if(JUKE.on!==id)return;const vol=(JUKE.bg&&S.screen!=='tavern')?.018:JUKE.vol;let t=ac.currentTime+.05;
    if(S.sound!==false)toks.forEach(k=>{const dur=k.d*eighth;if(k.hz){[[k.hz,'triangle',vol],[k.hz/2,'sine',vol*.45]].forEach(([f,tp,v])=>{const o=ac.createOscillator(),g=ac.createGain();o.type=tp;o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+dur*.92);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+dur);});}t+=dur;});
    const len=toks.reduce((a,k)=>a+k.d*eighth,0);JUKE.timer=setTimeout(()=>{if(once){if(JUKE.on===id)jukeStop();render();}else sched();},len*1000+600);};sched();}
function jukeOnce(id){jukePlay(id,{once:true});}
ACT.jukePlay=d=>{if(JUKE.on===d.id&&!JUKE.bg){jukeStop();render();return;}jukePlay(d.id);try{localStorage.removeItem('hl_jukebg');}catch(e){}render();};
ACT.jukeBg=d=>{let cur=null;try{cur=localStorage.getItem('hl_jukebg');}catch(e){}if(cur===d.id){try{localStorage.removeItem('hl_jukebg');}catch(e){}jukeStop();toast('<b>Background music off.</b>');}
  else{try{localStorage.setItem('hl_jukebg',d.id);}catch(e){}jukePlay(d.id,{bg:true});toast(`<b>Now playing everywhere:</b> ${esc(SONG_BY[d.id].name)}. Quietly. Gary is humming along.`);}render();};
function jukeboxHtml(){let bg=null;try{bg=localStorage.getItem('hl_jukebg');}catch(e){}const list=SONGS.filter(s=>!s.xmas||songUnlocked(s)||xmasNowSafe());
  return `<div class="card jukeCard"><h3>Jukebox</h3><p class="tiny muted">${SONGS.filter(songUnlocked).length} of ${SONGS.length} songs unlocked. Play one here, or set it as background music for the whole game (it follows the sound button).</p><div class="list">${list.map(s=>{const u=songUnlocked(s);const on=JUKE.on===s.id;
   return `<div class="li ${u?'':'locked'}"><span class="grow"><b>${esc(s.name)}</b><br><small>${u?(s.xmas?'Christmas set':s.season?'Season tune':'Shanty'):'Locked: '+esc(songHint(s))}</small></span>${u?`<button class="btn sm ${on&&!JUKE.bg?'primary':''}" data-act="jukePlay" data-id="${s.id}">${on&&!JUKE.bg?'Stop':'Play'}</button><button class="btn sm ghost ${bg===s.id?'on':''}" data-act="jukeBg" data-id="${s.id}">${bg===s.id?'Background: on':'Background'}</button>`:''}</div>`;}).join('')}</div></div>`;}
// resume background music after the first tap (browsers need a gesture before sound)
document.addEventListener('pointerdown',function jbg(){document.removeEventListener('pointerdown',jbg);setTimeout(()=>{try{const id=localStorage.getItem('hl_jukebg');if(id&&!JUKE.on&&G&&SONG_BY[id]&&songUnlocked(SONG_BY[id]))jukePlay(id,{bg:true});}catch(e){}},400);});
