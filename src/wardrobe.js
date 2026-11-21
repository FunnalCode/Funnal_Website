/* ============================== v14: new faces, clothes, hats + ship/hideout customiser ============================== */
const WARD_ITEMS=[
 // faces
 ['face_goatee','Pointy Goatee','face','goatee','#5A3A24',220,3],['face_mutton','Mutton Chops','face','mutton','#6B4429',380,5],['face_freckles','Sun Freckles','face','freckles','#C9805A',150,2],
 ['face_specs','Round Specs','face','specs','#3F3A40',450,6],['face_shades',"Captain's Shades",'face','shades','#1E2228',900,9],['face_scar','Battle Scar','face','scar','#C46A5A',600,11],
 ['face_goldtooth','Gold Tooth Grin','face','goldtooth','#F2C462',1200,14],['face_warpaint','Warpaint','face','warpaint','#3A7BD5',800,16],['face_plaster','Sticking Plaster','face','plaster','#F2D3A8',300,4],
 ['face_pipe','Corncob Pipe','face','pipe','#B98A4A',1500,18],['face_braid','Braided Beard','face','braid','#7A4B2A',2400,24],['face_handlebar','Handlebar Moustache','face','handlebar','#3F2A1C',1800,20],['face_anchor','Anchor Tattoo','face','anchor','#2F4E8C',700,8],
 // coats
 ['coat_oilskin','Yellow Oilskin','coat','oil','#F2C13A',600,5,'#3F3A30'],['coat_funnal','Funnal Hoodie','coat','hoodie','#2C3E50',900,7,'#FFFFFF'],['coat_admiral',"Admiral's Jacket",'coat','admiral','#1F2F57',3600,30,'#F2C462'],
 ['coat_sash','Scarlet Sash','coat','sash','#F4EFE4',700,8,'#C8102E'],['coat_knit',"Fisherman's Jumper",'coat','knit','#E9DFC6',800,9,'#C9BFA8'],['coat_apron',"Fishmonger's Apron",'coat','apron','#4A7EC2',500,4,'#FFFFFF'],
 ['coat_hawaii','Shore Leave Shirt','coat','hawaii','#2FA39A',1100,12,'#FFD166'],['coat_tux',"Captain's Tuxedo",'coat','tux','#1E2228',2800,26,'#FFFFFF'],['coat_life','Life Jacket','coat','life','#F26B1D',400,3,'#FFFFFF'],['coat_cape','Kraken Cape','coat','cape','#4B2E6B',4200,36,'#C58BE0'],
 // hats
 ['hat_peak',"Captain's Cap",'hat','peak','#FFFFFF',900,10],['hat_souwester',"Sou'wester",'hat','souwester','#F2C13A',600,6],['hat_party','Party Hat','hat','party','#E0457B',350,3],
 ['hat_viking','Viking Helmet','hat','viking','#9AA3AC',2200,22],['hat_topper','Top Hat','hat','topper','#1E2228',1600,17],['hat_parrot','Parrot Perch','hat','parrot','#2FA35A',3000,28],
];
WARD_ITEMS.forEach(([id,name,cat,st,col,price,lvl,col2])=>{if(ALL_ITEMS[id])return;const i={id,name,cat,st,col,price,lvl};if(col2)i.col2=col2;ITEMS.push(i);ALL_ITEMS[id]=i;});

const W_FACE={
 goatee(c,x,y,f){poly(c,[[x+3,y+5.8],[x+5,y+5.8],[x+4,y+8.2]],f.col);},
 mutton(c,x,y,f){[x+1,x+7].forEach((sx,i)=>{c.fillStyle=f.col;c.beginPath();c.ellipse(sx,y+4.8,.9,1.8,i?-.3:.3,0,TAU);c.fill();});},
 freckles(c,x,y,f){c.globalAlpha=.7;[[1.9,4.9],[2.5,5.4],[1.5,5.5],[6.1,4.9],[5.5,5.4],[6.5,5.5]].forEach(([a,b])=>disc(c,x+a,y+b,.18,f.col));c.globalAlpha=1;},
 specs(c,x,y,f){c.strokeStyle=f.col;c.lineWidth=.3;[2.7,5.3].forEach(ex=>{c.beginPath();c.arc(x+ex,y+4.3,.95,0,TAU);c.stroke();});line(c,x+3.6,y+4.2,x+4.4,y+4.2,f.col,.25);},
 shades(c,x,y,f){rr(c,x+1.6,y+3.7,2.2,1.3,.5,f.col);rr(c,x+4.2,y+3.7,2.2,1.3,.5,f.col);line(c,x+3.8,y+4.1,x+4.2,y+4.1,f.col,.3);R(c,x+1.9,y+3.9,.7,.25,'rgba(255,255,255,.5)');},
 scar(c,x,y,f){line(c,x+4.6,y+2.8,x+6.2,y+5.6,f.col,.3);for(let i=0;i<3;i++)line(c,x+4.9+i*.45,y+3.6+i*.7,x+5.5+i*.45,y+3.4+i*.7,f.col,.2);},
 goldtooth(c,x,y,f){c.fillStyle='#FFFFFF';c.beginPath();c.arc(x+4,y+5.1,1,0,Math.PI);c.fill();R(c,x+4.2,y+5.1,.5,.55,f.col);},
 warpaint(c,x,y,f){[1.9,6.1].forEach(cx=>{R(c,x+cx-.8,y+5,1.6,.35,f.col);R(c,x+cx-.8,y+5.6,1.6,.35,f.col);});},
 plaster(c,x,y,f){c.save();c.translate(x+6,y+5.3);c.rotate(.6);rr(c,-.9,-.3,1.8,.6,.2,f.col);c.rotate(-1.2);rr(c,-.9,-.3,1.8,.6,.2,f.col);c.restore();},
 pipe(c,x,y,f,t){line(c,x+4.4,y+5.4,x+6.6,y+6,'#6B4429',.35);rr(c,x+6.3,y+5.2,1,1.2,.3,f.col);const q=((t||0)%2400)/2400;c.globalAlpha=.5*(1-q);disc(c,x+6.9+q*1.2,y+4.6-q*3,.4+q*.6,'#E8ECEF');c.globalAlpha=1;},
 braid(c,x,y,f){c.fillStyle=f.col;c.beginPath();c.moveTo(x+.8,y+4);c.quadraticCurveTo(x+4,y+9,x+7.2,y+4);c.quadraticCurveTo(x+4,y+6.4,x+.8,y+4);c.fill();[3,5].forEach(bx=>{line(c,x+bx,y+7.2,x+bx,y+9.4,f.col,.6);disc(c,x+bx,y+9.6,.35,'#F2C462');});},
 handlebar(c,x,y,f){c.strokeStyle=f.col;c.lineWidth=.8;c.lineCap='round';c.beginPath();c.moveTo(x+4,y+5.3);c.quadraticCurveTo(x+2,y+6.4,x+.9,y+5);c.quadraticCurveTo(x+.6,y+4.2,x+1.3,y+4.3);c.moveTo(x+4,y+5.3);c.quadraticCurveTo(x+6,y+6.4,x+7.1,y+5);c.quadraticCurveTo(x+7.4,y+4.2,x+6.7,y+4.3);c.stroke();},
 anchor(c,x,y,f){const ax=x+6.2,ay=y+5.2;line(c,ax,ay-.7,ax,ay+.6,f.col,.18);line(c,ax-.35,ay-.4,ax+.35,ay-.4,f.col,.15);c.strokeStyle=f.col;c.lineWidth=.15;c.beginPath();c.arc(ax,ay+.1,.5,.3,Math.PI-.3);c.stroke();},
};
const W_COAT={
 oil(c,x,y,o){rr(c,x+1.3,y+6,5.4,4.6,2,o.col);for(let i=0;i<3;i++)disc(c,x+4,y+7+i*1.1,.28,o.col2);poly(c,[[x+2.2,y+6.1],[x+4,y+7.2],[x+5.8,y+6.1]],shade(o.col));},
 hoodie(c,x,y,o){ell(c,x+4,y+6.5,2.8,.9,shade(o.col));rr(c,x+1.3,y+6,5.4,4.6,2,o.col);R(c,x+2.4,y+9.2,3.2,.9,shade(o.col));drawMark(c,x+4.05,y+7.95,2.1,o.col2);line(c,x+3.5,y+6.4,x+3.4,y+7.4,o.col2,.15);line(c,x+4.5,y+6.4,x+4.6,y+7.4,o.col2,.15);},
 admiral(c,x,y,o){rr(c,x+1.3,y+6,5.4,4.6,2,o.col);ell(c,x+1.6,y+6.6,1.3,.55,o.col2);ell(c,x+6.4,y+6.6,1.3,.55,o.col2);for(let i=0;i<3;i++){disc(c,x+3.2,y+7.3+i*1,.25,o.col2);disc(c,x+4.8,y+7.3+i*1,.25,o.col2);}R(c,x+3.8,y+6.1,.4,4.3,'#C8102E');},
 sash(c,x,y,o){rr(c,x+1.3,y+6,5.4,4.6,2,o.col);c.save();rr(c,x+1.3,y+6,5.4,4.6,2,'rgba(0,0,0,0)');c.clip();c.strokeStyle=o.col2;c.lineWidth=1.1;c.beginPath();c.moveTo(x+1.2,y+6.2);c.lineTo(x+6.8,y+10.6);c.stroke();c.restore();disc(c,x+6.2,y+10,.5,o.col2);},
 knit(c,x,y,o){rr(c,x+1.3,y+6,5.4,4.6,2,o.col);c.save();rr(c,x+1.3,y+6,5.4,4.6,2,'rgba(0,0,0,0)');c.clip();for(let k=0;k<3;k++){c.strokeStyle=o.col2;c.lineWidth=.25;c.beginPath();for(let i=0;i<6;i++){c.lineTo(x+2.4+k*1.6+(i%2?.4:-.4),y+6.2+i*.8);}c.stroke();}c.restore();R(c,x+1.6,y+6.1,4.8,.6,o.col2);},
 apron(c,x,y,o){rr(c,x+1.3,y+6,5.4,4.6,2,o.col);rr(c,x+2.3,y+7,3.4,3.8,.6,o.col2);line(c,x+2.4,y+7,x+3,y+6.1,o.col2,.25);line(c,x+5.6,y+7,x+5,y+6.1,o.col2,.25);R(c,x+3.2,y+8.6,1.6,.9,'rgba(0,0,0,.08)');},
 hawaii(c,x,y,o){rr(c,x+1.3,y+6,5.4,4.6,2,o.col);c.save();rr(c,x+1.3,y+6,5.4,4.6,2,'rgba(0,0,0,0)');c.clip();[[2.2,7],[5,7.6],[3.4,9.2],[6.1,9.6],[2.1,10]].forEach(([a,b])=>{for(let k=0;k<5;k++)disc(c,x+a+Math.cos(k*1.26)*.45,y+b+Math.sin(k*1.26)*.45,.3,o.col2);disc(c,x+a,y+b,.22,'#E0457B');});c.restore();poly(c,[[x+3,y+6],[x+4,y+7],[x+5,y+6]],'#FFFFFF');},
 tux(c,x,y,o){rr(c,x+1.3,y+6,5.4,4.6,2,o.col);poly(c,[[x+3,y+6],[x+5,y+6],[x+4,y+9.6]],o.col2);poly(c,[[x+3.2,y+6.4],[x+4,y+6.9],[x+3.2,y+7.4]],'#C8102E');poly(c,[[x+4.8,y+6.4],[x+4,y+6.9],[x+4.8,y+7.4]],'#C8102E');disc(c,x+4,y+6.9,.25,'#A00D24');},
 life(c,x,y,o){rr(c,x+1.3,y+6,5.4,4.6,2,'#4A7EC2');rr(c,x+1.5,y+6.1,2.2,4.3,1,o.col);rr(c,x+4.3,y+6.1,2.2,4.3,1,o.col);R(c,x+1.6,y+8.1,4.8,.45,o.col2);R(c,x+1.6,y+9.3,4.8,.45,o.col2);},
 cape(c,x,y,o){poly(c,[[x+.6,y+6.4],[x+7.4,y+6.4],[x+8.8,y+11.4],[x-.8,y+11.4]],o.col);for(let i=0;i<6;i++)disc(c,x-.4+i*1.8,y+11.4,.5,o.col2);rr(c,x+1.3,y+6,5.4,4.6,2,shade(o.col));disc(c,x+4,y+6.6,.5,'#F2C462');},
};
const W_HAT={
 peak(c,x,y,h){ell(c,x+4,y+1,4.1,1.6,h.col);R(c,x+.4,y+1.4,7.2,1.2,'#1E2228');rr(c,x+3.2,y+2.4,4.8,.8,.4,'#1E2228');disc(c,x+4,y+1.4,.55,'#F2C462');},
 souwester(c,x,y,h){c.fillStyle=h.col;c.beginPath();c.arc(x+4,y+2.6,3.6,Math.PI,0);c.fill();c.beginPath();c.moveTo(x-1.6,y+3.2);c.quadraticCurveTo(x+4,y+.8,x+9.6,y+3.8);c.quadraticCurveTo(x+9.8,y+5,x+8.6,y+4.4);c.quadraticCurveTo(x+4,y+2.2,x-.6,y+4);c.closePath();c.fill();},
 party(c,x,y,h){poly(c,[[x+1.8,y+1.4],[x+4.6,y-5],[x+6.6,y+1.4]],h.col);line(c,x+2.6,y-.4,x+6,y+.2,'#FFD166',.45);line(c,x+3.6,y-2.6,x+5.4,y-2.2,'#4FA3C7',.45);disc(c,x+4.6,y-5.2,.8,'#FFD166');},
 viking(c,x,y,h){c.fillStyle=h.col;c.beginPath();c.arc(x+4,y+2.6,3.7,Math.PI,0);c.fill();R(c,x+.2,y+2.2,7.6,.8,'#7A6A4A');[[x+.6,-1],[x+7.4,1]].forEach(([hx,s])=>{c.fillStyle='#F4EFE4';c.beginPath();c.moveTo(hx,y+1.6);c.quadraticCurveTo(hx-s*2.6,y+.6,hx-s*2.2,y-2.6);c.quadraticCurveTo(hx-s*1.2,y+.2,hx+s*.6,y+.6);c.closePath();c.fill();});disc(c,x+4,y,.4,'#C9BFA8');},
 topper(c,x,y,h){ell(c,x+4,y+1.9,4.6,1,h.col);rr(c,x+1.6,y-3.6,4.8,5.6,.6,h.col);R(c,x+1.6,y+.4,4.8,.8,'#C8102E');},
 parrot(c,x,y,h,t){const b=Math.sin((t||0)/300)*.3;ell(c,x+4,y-.4+b,1.8,2.2,h.col);disc(c,x+5,y-2.2+b,1.3,h.col);poly(c,[[x+6.1,y-2.4+b],[x+7.4,y-1.8+b],[x+6.1,y-1.2+b]],'#F2A33A');disc(c,x+5.4,y-2.5+b,.3,'#1E2228');poly(c,[[x+2.6,y+.4+b],[x+1,y+2.6+b],[x+3,y+1.4+b]],'#E0453B');ell(c,x+3.4,y-.2+b,.9,1.4,'#4FA3C7',.3);},
};
const _dk14=drawKeeper;drawKeeper=function(c,x,y,pid,pl,t,opts={}){pl=pl||{};if(opts.chicken)return _dk14(c,x,y,pid,pl,t,opts);const f=it(pl.face),co=it(pl.coat),h=it(pl.hat);
  const nf=f&&W_FACE[f.st],nc=co&&W_COAT[co.st],nh=h&&W_HAT[h.st];if(!nf&&!nc&&!nh)return _dk14(c,x,y,pid,pl,t,opts);
  const p2={...pl};if(nf)p2.face=null;if(nh)p2.hat=null;if(nc)p2.coat=null;_dk14(c,x,y,pid,p2,t,opts);
  const bob=opts.dance?Math.sin(t/120)*1.4:Math.sin(t/700)*.25,lean=opts.dance?Math.sin(t/240)*.25:0;const pal=keeperPal(pl,pid);
  c.save();c.translate(x+4,y+12);c.rotate(lean);c.translate(-x-4,-y-12);
  if(nc){nc(c,x,y+bob,co,pal);disc(c,x+1.2,y+8.2+bob,1,pal.s);disc(c,x+6.8,y+8.2+bob,1,pal.s);}
  if(nf)nf(c,x,y+bob,f,t);if(nh)nh(c,x,y+bob,h,t);c.restore();};

/* ---------- placing deck pieces and hideout decor exactly where you want them ---------- */
const DECK_SPOTS=[-10,2,14,25],DECK_N=4,DECOR_N=8;
HIDE_SPOTS.push([14,77],[150,77]);
function spotPos(cat,i){if(cat==='deck')return[140+DECK_SPOTS[i]*1.55,167];const s=HIDE_SPOTS[i];return s?[s[0]*2,Math.min(174,s[1]*2+9)]:[0,0];}
ACT.place=async function(d){const cat=d.cat==='deck'?'deck':'decor';const n=cat==='deck'?DECK_N:DECOR_N;const pl=S.players[S.me]||{};const dec=[...(pl[cat]||[])];while(dec.length<n)dec.push(null);
  const sp=S.view.spot!=null&&S.view.spotCat===cat?S.view.spot:null;const cur=dec.indexOf(d.id);
  if(sp!=null){if(cur>=0)dec[cur]=null;dec[sp]=dec[sp]===d.id?null:d.id;S.view.spot=null;}
  else if(cur>=0)dec[cur]=null;else{const i=dec.findIndex(x=>!x);if(i<0)return toast('<b>No free spot.</b> Tap a spot on the picture to swap something out.');dec[i]=d.id;}
  try{await writePlayer(S.me,{[cat]:dec.slice(0,n)});tone(660,.06,'triangle',.04);}catch(e){writeFail(e);}};
ACT.spotPick=d=>{const i=+d.i;S.view.spot=S.view.spot===i&&S.view.spotCat===d.cat?null:i;S.view.spotCat=d.cat;render();};
ACT.spotClear=async()=>{const cat=S.view.spotCat,i=S.view.spot;if(i==null)return;const dec=[...((S.players[S.me]||{})[cat]||[])];dec[i]=null;S.view.spot=null;try{await writePlayer(S.me,{[cat]:dec});}catch(e){writeFail(e);}};
const _ward14=ACT.wardrobe;ACT.wardrobe=d=>{S.view.spot=null;if(d.c==='deck')S.view.shipMode='ship';if(d.c==='decor')S.view.shipMode='hideout';_ward14(d);};
const _ship14=SCREENS.ship;SCREENS.ship=()=>{let h=_ship14();const pid=S.view.islet||S.me;const wc=S.view.wardrobe||'hat';const mode=S.view.shipMode||'ship';
  if(pid!==S.me||!(wc==='deck'&&mode==='ship'||wc==='decor'&&mode==='hideout'))return h;const cat=wc;const n=cat==='deck'?DECK_N:DECOR_N;const slots=(S.players[S.me]||{})[cat]||[];
  const layer=Array.from({length:n},(_,i)=>{const[x,y]=spotPos(cat,i);const id=slots[i];return `<button class="spot ${id?'full':''} ${S.view.spot===i&&S.view.spotCat===cat?'sel':''}" style="left:${(x/320*100).toFixed(2)}%;top:${(y/180*100).toFixed(2)}%" data-act="spotPick" data-cat="${cat}" data-i="${i}" aria-label="Spot ${i+1}${id?': '+esc(ALL_ITEMS[id]?.name||''):' (empty)'}">${i+1}</button>`;}).join('');
  h=h.replace(/(<canvas id="scene"[^>]*><\/canvas>)/,`<div class="sceneWrap">$1<div class="spotLayer">${layer}</div></div>`);
  const sel=S.view.spot!=null&&S.view.spotCat===cat?S.view.spot:null;const selId=sel!=null?slots[sel]:null;
  const chips=`<div class="spotChips">${Array.from({length:n},(_,i)=>{const id=slots[i];return `<button class="spotChip ${id?'full':''} ${sel===i?'sel':''}" data-act="spotPick" data-cat="${cat}" data-i="${i}"><i>${i+1}</i>${id?`<canvas class="icon" data-id="${id}"></canvas>`:'<span>+</span>'}</button>`;}).join('')}</div>`;
  const help=`<div class="spotHelp">${sel==null?`<small>Tap a numbered spot on the ${cat==='deck'?'ship':'hideout'} above, then pick an item below to put it there. Picking an item that's already out moves it.</small>`:`<small><b>Spot ${sel+1}</b> ${selId?`holds ${esc(ALL_ITEMS[selId]?.name||'')}. Pick another item to swap it.`:'is empty. Pick an item to put it here.'}</small>${selId?'<button class="btn sm ghost" data-act="spotClear">Clear spot</button>':''}`}</div>`;
  h=h.replace(/<div class="slots">[\s\S]*?<\/small>(?=\s*<div class="wardrobe">)/,chips+help);return h;};
// deck pieces drawn at the new spots, with the cannonball pile tucked by the stern
(()=>{})();
(()=>{HELP.push(['Decorating','On the Ship screen, open Wardrobe & rigging and pick Deck or Decor. Numbered spots appear on your ship (4 deck spots) or hideout (8 spots). Tap a spot, then tap an item to put it exactly there; tap an item that is already out to move it. Equipped cannonballs sit in a pile by the stern. The Shop also has 13 new faces, 10 new coats and 6 new hats.']);})();
