/* ============================== CHRISTMAS EVERYWHERE (Stage 1D) ==============================
   Christmas bosses in the daily rotation, tinsel and Santa hats on the regular monsters, a Christmas
   edition of the Herald, festive quest names and a snowy frame on the weekly review image. */
const XMAS_BOSSES=[
  {id:'grinchfish',name:'The Grinchfish',type:'kit',col:'#6FAE4A',eye:'#3F3A30',kit:{body:'fish',col:'#6FAE4A',col2:'#D7EFB8',pat:'scales',eyes:2,eyeStyle:'angry',mouth:'fangs',acc:['santa','fins'],mood:'smug'},
   lines:{start:"I've stolen Christmas. Well, the mince pies. Same thing.",p75:'Oi! That was my good fin!',p50:'Fine. You can have the sprouts back. Nobody wanted them.',p25:"My heart's growing three sizes... it really HURTS.",dead:'Merry Christmas. I hate it. Bye.'}},
  {id:'xmaspast',name:'The Ghost of Christmas Past',type:'kit',col:'#BFD8E8',eye:'#3F3A30',kit:{body:'jelly',col:'#BFD8E8',col2:'#EAF5FB',eyes:2,mouth:'pout',acc:['chains','tinsel'],mood:'calm',floats:true},
   lines:{start:'Ooooh... remember last Christmas... when you missed the target...',p75:"I rattle my chains because I've lost the key. Seen a key?",p50:"I'm fading... like your New Year's resolutions...",p25:'Wait... this Christmas is going rather well...',dead:'Merry Christmas... boo... I mean, bye.'}}
];
// one day in three from 1 to 26 December, a Christmas boss takes the harbour (the Grinchfish or the Ghost)
{const _bf=bossFor;bossFor=function(date){if(inXmas(date)&&h32(date+'xboss')%3===0)return XMAS_BOSSES[h32(date+'xbb')%XMAS_BOSSES.length];return _bf.apply(this,arguments);};}
// tinsel and Santa hats on the regular monsters while Christmas is on
{const _db=drawBoss;drawBoss=function(c,boss,bx,by,r,ratio,t,flash,wl){_db.apply(this,arguments);if(!boss||boss.kit||!xmasNow())return;
  const hx=bx+r*.12,hy=by-r*.78,w=r*.42;c.save();c.translate(hx,hy);c.rotate(.25);c.fillStyle='#D9363E';c.beginPath();c.moveTo(-w,0);c.quadraticCurveTo(-w*.2,-w*1.8,w*1.2,-w*1.1);c.quadraticCurveTo(w*.4,-w*.8,w,0);c.closePath();c.fill();
  rr(c,-w*1.1,-w*.25,w*2.2,w*.45,w*.22,'#FFFFFF');disc(c,w*1.25,-w*1.05,w*.25,'#FFFFFF');c.restore();
  for(let i=0;i<9;i++){const q=i/8;const x=bx-r*.8+q*r*1.6,y=by+r*.25+Math.sin(q*Math.PI)*r*.3;disc(c,x,y,r*.06,XMAS_COLS[i%5]);}};}

/* ---------- festive quest names (same quests, same numbers) ---------- */
const XQN={dm10:'Send 10 Christmas cards (personalised DMs)',dm25:'Deliver 25 DMs before the elves do',dm40:'Send 40 DMs: the full sleigh',lock1:'Complete one Lock In voyage through the snow',resp1:'Get a card back (log a genuine response)',early5:'Send 5 DMs before 10:00, before the mince pies',share:'Pull your weight on the sleigh (30% of the target)',burst:'Log 15 DMs in a single snowy voyage',w150:'Send 150 DMs this week (one per mince pie)',w250:'Send 250 DMs this week: Santa-level output',wlock5:'Complete five snowy voyages',wresp:'Log 5 responses: the cards came back'};
{const _qs=questState;questState=function(p){const r=_qs.apply(this,arguments);if(!xmasNow())return r;const fx=l=>(l||[]).map(x=>XQN[x.id]?{...x,name:XQN[x.id]}:x);return{...r,daily:fx(r.daily),weekly:fx(r.weekly)};};}

/* ---------- the Salty Herald: Christmas edition with an Advent report ---------- */
function heraldXmasStory(){try{const A=adventState();const n=A.nOpen,left=Math.max(0,26-(+G.today.slice(8,10)||0));
  const quips=['Gary claims door 7 was "already like that".','A seal on the ice floe has been singing the same carol since Tuesday. Police are aware.','The island tree has more baubles than sense.','Barnacle Bill is selling "genuine reindeer licences". They are napkins.','Sources confirm the Grinchfish has never once been invited to anything.'];
  return `<div class="hXmas"><h4>ADVENT REPORT</h4><p>The crew has opened <b>${n}</b> of 24 Advent doors${G.today.slice(5,7)==='12'?` with ${left} day${left===1?'':'s'} of Christmas left`:''}. ${esc(quips[h32(G.today+'hq')%quips.length])}</p></div>`;}catch(e){return '';}}
{const _hr=SCREENS.herald;SCREENS.herald=function(){let h=_hr.apply(this,arguments);if(!xmasNow())return h;h=h.replace('<h1>THE SALTY HERALD</h1>','<h1>THE SALTY HERALD</h1><div class="xEd">Christmas Edition</div>');const k='<div class="head">';return h.includes(k)?h.replace(k,heraldXmasStory()+k):h+heraldXmasStory();};}
{const _hx=SCREENS.harbour;SCREENS.harbour=function(){const h=_hx.apply(this,arguments);return xmasNow()?h.replace('<b>THE SALTY HERALD</b>','<b>THE SALTY HERALD</b><em class="xEdS">Christmas Edition</em>'):h;};}

/* ---------- a snowy frame on the weekly review image for Christmas weeks ---------- */
{const _wi=weekImage;weekImage=async function(ws){const cv=await _wi.apply(this,arguments);try{const y=ws.slice(0,4);const end=addDays(ws,6);const xm=(ws<=`${y}-12-26`&&end>=`${y}-12-01`)||(typeof THEME!=='undefined'&&THEME.preview&&THEME.festive==='christmas');if(!xm)return cv;
  const c=cv.getContext('2d'),W=cv.width;c.save();c.fillStyle='#FFFFFF';c.beginPath();c.moveTo(0,0);c.lineTo(W,0);c.lineTo(W,34);for(let x=W;x>=0;x-=40)c.quadraticCurveTo(x-20,34+((x/40)%2?22:8),x-40,34);c.closePath();c.fill();
  for(let i=0;i<90;i++){const x=(i*97)%W,yy=(i*53)%1150;c.globalAlpha=.25+(i%4)*.15;c.beginPath();c.arc(x,yy,1.5+(i%3),0,TAU);c.fill();}c.globalAlpha=1;
  const holly=(x,y,s)=>{c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#2F7A52';[[-1,-.3],[1,-.3],[0,.9]].forEach(([a,b])=>{c.beginPath();c.ellipse(a*14,b*10,16,7,a*.6+b*.4,0,TAU);c.fill();});['#D9363E','#C8102E','#E0453B'].forEach((col,i)=>{c.fillStyle=col;c.beginPath();c.arc(-5+i*5,-2+(i%2)*4,5,0,TAU);c.fill();});c.restore();};
  holly(70,62,1.4);holly(W-70,62,1.4);c.font='800 22px Nunito, sans-serif';c.fillStyle='#C8102E';c.textAlign='center';c.fillText('CHRISTMAS WEEK',W/2,32);c.restore();}catch(e){console.warn('xmas frame',e);}return cv;};}
HELP.push(['Christmas bosses','From 1 to 26 December, one day in three the Harbour gets a Christmas boss instead of the usual monster: the Grinchfish or the Ghost of Christmas Past. The regular monsters wear Santa hats and tinsel, and sinking them counts the same as ever.']);
