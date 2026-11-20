/* ============================== HIDEOUT v6: a pirate cove that grows with your level ============================== */
const HIDE_STAGES=[[1,'Castaway Camp','A fire, a lean-to and a skull-shaped rock that is definitely not ominous.'],[5,"Smuggler's Landing",'A dock and a rowboat for quiet arrivals.'],[10,'Lookout Point','A lookout tower flying your flag.'],[20,'Skull Cove','Torches burn inside the skull. Very welcoming.'],[30,'Rope-Bridge Haven','A rope bridge and a hammock for hard-earned naps.'],[40,'Fort Funnal','A cannon battery guards the bay.'],[50,"Pirate King's Stronghold",'The skull wears a crown now. So do you, spiritually.']];
const HIDE_SPOTS=[[26,80],[41,83.5],[55,85.5],[98,85.5],[116,83.5],[136,80]];
function hideStage(lv){let i=0;HIDE_STAGES.forEach((s,k)=>{if(lv>=s[0])i=k;});return i;}
function drawIslet(c,t,pid){
  if(!G)return;const pl=S.players[pid]||{};const me=G.players[pid];const fx=pl.effect;const act=activeForfeitsFor(pid);const lv=me?.maxLevel||1;const stg=hideStage(lv);const nx=HIDE_STAGES[stg+1];
  sky(c,t,{aurora:fx==='fx_aurora',shooting:fx==='fx_shooting',rainbow:fx==='fx_rainbow',fireworks:fx==='fx_fireworks'});
  ell(c,30,104,34,5,'rgba(110,160,185,.75)');ell(c,304,104,26,3.6,'rgba(110,160,185,.6)');
  sea(c,104,t,{glow:fx==='fx_biolum'});
  if(fx==='fx_whale')whale(c,t);
  drawShip(c,44,126,.4,pl,t,{captain:false,phase:1.3});hit(26,98,38,30,'Your ship, at anchor','Parked legally, for once. Customise it from the Ship view.');
  const night=SUN.night,lap=Math.sin(t/900)*1.4;
  // beach and meadow
  ell(c,172,153.4,150+lap,27.4,'rgba(255,255,255,.3)');ell(c,172,152.6,146+lap*.6,25.8,'rgba(255,255,255,.62)');ell(c,172,151,142.4,24.6,'#E0C68A');ell(c,172,150,141,23.4,'#F6E3B4');
  ell(c,178,138.4,114,12.4,'#7DBF58');ell(c,178,136.6,106,10,'#93D06A');ell(c,150,135,60,6,'#A9DC7C');
  for(let i=0;i<9;i++){const px=52+i*29+(i*13)%9,py=158+((i*7)%9);disc(c,px,py,.8,'#D9C294');if(i%3===0){ell(c,px+6,py+2,2.2,1.2,'#F4D7C8');disc(c,px+6,py+1.8,.5,'#E9B8A0');}}
  palm(c,36,147,21,t);palm(c,226,134,15,t+900);palm(c,300,150,20,t+500);palm(c,272,153,17,t+200);
  // dock and rowboat (level 5)
  if(stg>=1){for(let i=0;i<4;i++)R(c,10+i*11,150,1.6,9,'#7A5434');rr(c,6,148,46,3.2,1,'#B98552');for(let i=0;i<7;i++)R(c,9+i*6,148,.4,3.2,'rgba(0,0,0,.15)');
    const b=Math.sin(t/600)*.8;line(c,12,151,15,161+b,'rgba(90,60,40,.6)',.3);c.save();c.translate(16,164+b);c.rotate(Math.sin(t/800)*.05);c.fillStyle='#A8704A';c.beginPath();c.moveTo(-10,-3);c.lineTo(10,-3);c.quadraticCurveTo(9,3,5,3);c.lineTo(-6,3);c.quadraticCurveTo(-10,2,-10,-3);c.fill();R(c,-10,-3.6,20,1,'#6B4429');R(c,-3,-2.6,6,.8,'#6B4429');line(c,2,-3,9,-8,'#B98552',.7);c.restore();
    hit(4,142,50,28,'The dock','Unlocked at level 5. The rowboat is called "Plausible Deniability".');}
  // skull rock
  ell(c,154,141.5,54,6,'rgba(0,0,0,.14)');
  const rk=c.createLinearGradient(104,60,202,140);rk.addColorStop(0,'#B9B3AB');rk.addColorStop(.55,'#918B84');rk.addColorStop(1,'#6C6762');
  c.fillStyle=rk;c.beginPath();c.moveTo(104,141);c.quadraticCurveTo(95,100,114,74);c.quadraticCurveTo(150,39,186,72);c.quadraticCurveTo(205,100,198,141);c.closePath();c.fill();
  ell(c,112,132,12,10,'#868079');ell(c,191,132,12,10,'#76716B');ell(c,150,112,30,7,'rgba(255,255,255,.07)');
  // waterfall off the skull's shoulder
  c.fillStyle='rgba(190,235,250,.92)';c.beginPath();c.moveTo(186,79);c.quadraticCurveTo(195,83,197,100);c.lineTo(203,141);c.lineTo(193,141);c.lineTo(190.6,100);c.quadraticCurveTo(190,88,184,83);c.closePath();c.fill();
  for(let i=0;i<8;i++){const q=((t/650)+i/8)%1;line(c,192.6+i%3*3,86+q*52,193.2+i%3*3,90.5+q*52,'rgba(255,255,255,.95)',.7);}
  ell(c,199,143,14,3.8,'#7FD3E6');c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=.6;c.beginPath();c.ellipse(199,143,14+Math.sin(t/500),3.8,0,0,TAU);c.stroke();
  for(let i=0;i<6;i++){const q=((t/900)+i/6)%1;disc(c,191+i*3.4,140-q*7,1.6+q*1.6,`rgba(255,255,255,${.5*(1-q)})`);}
  hit(184,78,24,68,'The waterfall','Fresh water, a rainbow on good days, and somewhere to rinse the glitter cannon.');
  // moss, cracks
  c.fillStyle='#6FB35A';c.beginPath();c.moveTo(116,72);c.quadraticCurveTo(150,40,184,70);c.quadraticCurveTo(168,60,150,62.5);c.quadraticCurveTo(132,60,116,72);c.fill();disc(c,126,66.5,2.4,'#6FB35A');disc(c,170,64.6,2,'#6FB35A');disc(c,141,62.8,1.4,'#86C96C');
  c.strokeStyle='rgba(0,0,0,.2)';c.lineWidth=.5;c.beginPath();c.moveTo(152,62);c.lineTo(148,70);c.lineTo(152,76);c.lineTo(149,82);c.moveTo(118,112);c.lineTo(124,118);c.moveTo(184,108);c.lineTo(179,116);c.stroke();
  // eyes, nose, mouth cave
  const lit=stg>=3;
  [[133,93],[167,93]].forEach(([ex,ey],k)=>{ell(c,ex,ey,9.6,10.6,'#3B3842');ell(c,ex+.4,ey+1,8.4,9.2,'#211E29');if(lit){const fl=.75+.25*Math.sin(t/110+k*3);glowAt(c,ex,ey+3,8.4,'255,150,60',.85*fl);flame(c,ex,ey+8.6,.78,t,k*5);}else disc(c,ex+2,ey+2,1,'rgba(255,255,255,.08)');});
  poly(c,[[150,101],[146,111],[150,108.6],[154,111]],'#2A2731');
  c.fillStyle='#1B1924';c.beginPath();c.moveTo(128,141.5);c.lineTo(128,124);c.quadraticCurveTo(150,110,172,124);c.lineTo(172,141.5);c.closePath();c.fill();
  if(lit)glowAt(c,150,138,19,'255,170,80',.55);
  for(let i=0;i<6;i++){const tx=131+i*6.4,ty=123.6-Math.sin((i+.5)/6*Math.PI)*5.2;poly(c,[[tx,ty],[tx+5.4,ty],[tx+2.7,ty+5.6+((i*7)%3)]],'#E6E0D2');}
  for(let i=0;i<5;i++){const tx=131.5+i*8;poly(c,[[tx,141.5],[tx+5,141.5],[tx+2.5,136+(i%2)]],'#CFC8BA');}
  hit(106,44,90,76,HIDE_STAGES[stg][1],`${HIDE_STAGES[stg][2]} Hideout stage ${stg+1} of ${HIDE_STAGES.length}.${nx?` Next: ${nx[1]} at level ${nx[0]}.`:' Fully upgraded.'}`);
  if(stg>=6||(me?.prest||0)>=1){const cy=46+Math.sin(t/900)*.5;poly(c,[[139,cy+6],[139,cy-3],[144.5,cy+1.5],[150,cy-6],[155.5,cy+1.5],[161,cy-3],[161,cy+6]],'#F2C462');R(c,139,cy+4.6,22,2,'#D99A17');disc(c,150,cy+1.6,1.3,'#E0457B');disc(c,143,cy+2.6,.9,'#5DBE9C');disc(c,157,cy+2.6,.9,'#4A7EC2');if(Math.sin(t/300)>.6){line(c,150,cy-9.5,150,cy-6.5,'#FFF6CF',.5);line(c,148.5,cy-8,151.5,cy-8,'#FFF6CF',.5);}}
  // torches by the cave (level 20)
  if(lit)[[122,140],[178,140]].forEach(([x,y],k)=>{R(c,x-.6,y-11,1.2,11,'#6B4429');rr(c,x-1.4,y-12.4,2.8,2,.6,'#3F3A30');flame(c,x,y-12,.62,t,k*9+2);});
  // cannon battery (level 40)
  if(stg>=5){rr(c,82,133,28,8,2,'#9B958E');for(let i=0;i<4;i++)R(c,83+i*7.4,130.6,4.2,3,'#A8A29A');R(c,82,138,28,1,'rgba(0,0,0,.12)');
    [[80,131],[94,128.6]].forEach(([x,y])=>{rr(c,x-8,y-1.7,13,3.4,1.7,'#2E2B33');rr(c,x-9,y-2.2,2,4.4,.8,'#3F3A40');disc(c,x+2,y+2.2,2.2,'#7A4E30');disc(c,x+2,y+2.2,.8,'#3F3A30');});for(let i=0;i<3;i++)disc(c,101+i*2.4,139.4-(i===1?2:0),1.2,'#2E2B33');
    hit(72,124,40,18,'Cannon battery','Unlocked at level 40. Purely decorative. Mostly.');}
  // lookout tower (level 10)
  if(stg>=2){const tx=252;line(c,tx-7,147,tx-5,104,'#8A5E38',1.6);line(c,tx+7,147,tx+5,104,'#8A5E38',1.6);line(c,tx-6.4,134,tx+6,118,'#7A4E30',.8);line(c,tx+6.4,134,tx-6,118,'#7A4E30',.8);
    line(c,tx-1.6,147,tx-1.6,105,'#B98552',.5);line(c,tx+1.6,147,tx+1.6,105,'#B98552',.5);for(let i=0;i<8;i++)line(c,tx-1.6,144-i*5.2,tx+1.6,144-i*5.2,'#B98552',.6);
    rr(c,tx-11,102,22,3,1,'#B98552');for(let i=0;i<5;i++)R(c,tx-10+i*4.8,97,.7,5,'#8A5E38');R(c,tx-10.4,96.6,20.8,.8,'#8A5E38');
    rr(c,tx-6,90,12,12,1,'#C79A6A');rr(c,tx-2,93.4,4,4.4,.8,night?'#FFD98A':'#3F5160');poly(c,[[tx-10.5,91],[tx,80.5],[tx+10.5,91]],'#D9B25F');line(c,tx-5,86,tx-7.5,90.6,'rgba(0,0,0,.14)',.4);line(c,tx+1,84,tx-.5,90.6,'rgba(0,0,0,.14)',.4);line(c,tx+6,87,tx+5,90.6,'rgba(0,0,0,.14)',.4);
    R(c,tx-.4,68,.8,13,'#7A4E30');drawFlag(c,tx+.4,68.4,pl.flag||SHIP_DEFAULT.flag,t,11,7);
    hit(tx-12,66,24,82,'Lookout tower','Unlocked at level 10. Flies whichever flag you have equipped. Excellent for spotting pets and avoiding admin.');}
  // rope bridge and hammock (level 30)
  if(stg>=4){const P0=[185,75.5],P1=[241,101.5];const pt=q=>[P0[0]+(P1[0]-P0[0])*q,P0[1]+(P1[1]-P0[1])*q+Math.sin(q*Math.PI)*(9+Math.sin(t/800)*.7)];
    c.strokeStyle='#8A6A45';c.lineWidth=.6;[0,-4].forEach(dy=>{c.beginPath();for(let i=0;i<=14;i++){const[a,b]=pt(i/14);i?c.lineTo(a,b+dy):c.moveTo(a,b+dy);}c.stroke();});
    for(let i=1;i<14;i++){const[a,b]=pt(i/14);line(c,a,b,a,b-4,'#8A6A45',.35);line(c,a-1.5,b+.3,a+1.5,b+.3,'#C79A6A',1);}
    const sw=Math.sin(t/1100)*1.2;c.strokeStyle='#E06034';c.lineWidth=2.6;c.lineCap='round';c.beginPath();c.moveTo(273.5,140);c.quadraticCurveTo(286+sw,153,300.5,137);c.stroke();c.strokeStyle='#FFF4DE';c.lineWidth=.6;c.setLineDash([1.6,2.2]);c.stroke();c.setLineDash([]);
    hit(270,132,34,22,'The hammock','Unlocked at level 30. Officially a "strategy station".');}
  // lean-to made from your sails, and the campfire
  const sl=it(pl.sail)||it('sail_canvas');poly(c,[[44,149],[62,127],[79,149]],sl.col);poly(c,[[62,127],[79,149],[71,149]],'rgba(0,0,0,.14)');poly(c,[[57,149],[62,137],[67,149]],'#3A2F3A');line(c,62,125,62,149,'#7A4E30',.8);rr(c,74,146,5,4,1,'#A8704A');rr(c,79.6,147,4,3,1,'#8A5A3A');hit(44,125,36,25,'The lean-to','Stitched from your current sails. Change your sails and the tent changes too.');
  const fx0=112,fy0=158;ell(c,fx0,fy0+1,7.4,2.2,'rgba(0,0,0,.15)');for(let i=0;i<6;i++){const a=i/6*TAU;disc(c,fx0+Math.cos(a)*5.6,fy0+Math.sin(a)*1.9+.4,1.1,'#9B958E');}
  line(c,fx0-4,fy0,fx0+4,fy0-1.4,'#7A4E30',1.6);line(c,fx0+4,fy0,fx0-4,fy0-1.4,'#6B4429',1.6);
  for(let i=0;i<4;i++){const q=((t/2600)+i/4)%1;disc(c,fx0+Math.sin(q*3+i)*3+q*8*wind(t),fy0-12-q*30,1.6+q*3.2,`rgba(240,240,240,${.2*(1-q)})`);}
  flame(c,fx0,fy0-.6,1.2,t);for(let i=0;i<5;i++){const q=((t/1300)+i/5)%1;disc(c,fx0+Math.sin(q*6+i)*3,fy0-8-q*22,.45,`rgba(255,${200-q*80|0},90,${1-q})`);}
  hit(fx0-8,fy0-14,16,18,'The campfire','Never goes out. Nobody knows who keeps feeding it.');
  // treasure pile grows with your doubloons
  const bal=me?.balance||0;const tz=bal>=5000?3:bal>=1000?2:bal>=150?1:0;
  if(tz){ell(c,160,148.4,6+tz*3.6,1.8+tz*.8,'#D99A17');ell(c,160,147.6,5.4+tz*3.4,1.5+tz*.9,'#F2C462');for(let i=0;i<tz*8;i++){const a=i*2.4,q=((i*5)%10)/10,d=q*(5+tz*3);disc(c,160+Math.cos(a)*d,147.2-(1-q)*(1+tz*1.5)-Math.abs(Math.sin(a))*.8,1,i%3?'#F2C462':'#FFE08A');}}
  rr(c,155,141.4,10,6,1,'#A8704A');R(c,155,143.8,10,.8,'#6B4429');R(c,159.4,143,1.2,2.2,'#F2C462');c.fillStyle='#8A5A3A';c.beginPath();c.ellipse(160,141.4,5,2.6,0,Math.PI,0);c.fill();if(tz)ell(c,160,141.4,4,1.1,'#F2C462');
  if(tz)for(let i=0;i<3;i++){const tw=Math.sin(t/240+i*2.2);if(tw>.55){const gx=153+i*7,gy=144-i%2*3-tz;line(c,gx-1.6,gy,gx+1.6,gy,'#FFF6CF',.4);line(c,gx,gy-1.6,gx,gy+1.6,'#FFF6CF',.4);}}
  hit(148,136,24,16,'The hoard',`Grows with your purse: you hold ${fmtN(bal)} doubloons. ${tz<3?'It gets bigger at '+fmtN([150,1000,5000][tz])+'.':'It cannot physically get bigger.'}`);
  // signpost
  line(c,222,160,222,149,'#7A4E30',1);rr(c,216,148,13,5,1,'#C79A6A');poly(c,[[229,148],[232,150.5],[229,153]],'#C79A6A');line(c,218,150.5,227,150.5,'rgba(0,0,0,.25)',.4);
  hit(214,146,20,16,nx?`Next upgrade: ${nx[1]}`:'Hideout complete',nx?`${nx[2]} Arrives at level ${nx[0]} (you are level ${lv}).`:'Every stage unlocked. The estate agent would call it "characterful".');
  // decor, captain, companions (drawn at 2x like the old islet so every item keeps its size)
  c.save();c.scale(2,2);
  (pl.decor||[]).forEach((id,i)=>{if(id&&HIDE_SPOTS[i]){c.save();c.translate(HIDE_SPOTS[i][0],HIDE_SPOTS[i][1]);c.scale(.72,.72);drawDecor(c,id,0,0,t+i*300);c.restore();}});
  if(act.some(f=>f.result==='gnomes'))[[44,76],[100,78],[122,76]].forEach(([x,y])=>drawGnome(c,x,y));
  if(act.some(f=>f.result==='statue')){rr(c,104,74,20,4,1.5,'#C9C3B6');c.save();c.translate(106,52);c.scale(2,2);drawKeeper(c,0,0,other(pid),S.players[other(pid)],0);c.restore();}
  const ch=act.some(f=>f.result==='chicken'),dance=act.some(f=>f.result==='dance');
  const kx=61,ky=66;ell(c,kx+4,ky+12.4,5,1.1,'rgba(0,0,0,.14)');drawKeeper(c,kx,ky,pid,pl,t,{chicken:ch,dance});if(pl.pet&&PET_BY_ID[pl.pet])drawPet(c,PET_BY_ID[pl.pet],kx+13,ky+12.5,t,.7);
  if(act.some(f=>f.result==='gull'))drawGull(c,kx-13+Math.sin(t/700)*3,ky+6,t);
  const ma=t/1200;drawMoth(c,kx+4+Math.cos(ma)*16,ky-8+Math.sin(ma*1.7)*5,me?.moth||0,t,pl.moth);
  c.restore();
  if(act.some(f=>f.result==='statue'))txt(c,(C().players[other(pid)]?.name||'Rival')+' the Great',228,92,'#3F5160',7,'center');
  if(fx==='fx_dolphins')dolphins(c,t);
  if(fx==='fx_snow')for(let i=0;i<60;i++)disc(c,(i*53+t/40)%W,(i*29+t/25)%H,.8,'#FFFFFF');
  // night: fire, torches and fireflies do the lighting
  if(nightVeil(c,.22)){lamp(c,fx0,fy0-6,30,.75);if(lit){lamp(c,122,128,13,.7);lamp(c,178,128,13,.7);lamp(c,133,96,13,.6,'255,150,60');lamp(c,167,96,13,.6,'255,150,60');lamp(c,150,134,20,.5);}if(stg>=2)lamp(c,252,95,9,.7);if(tz)lamp(c,160,146,8+tz*2,.35,'255,220,120');}
  if(night||fx==='fx_fireflies')for(let i=0;i<14;i++){const a=t/1500+i;const on=Math.sin(t/300+i*1.3)>0;const x=40+((i*37)%250)+Math.sin(a)*6,y=96+((i*23)%44)+Math.cos(a*1.3)*4;disc(c,x,y,on?.8:.4,on?'#F4FF9A':'#C8D27A');if(on)lamp(c,x,y,3.4,.5,'230,255,140');}
  txt(c,HIDE_STAGES[stg][1]+(nx?`  ·  next upgrade at level ${nx[0]}`:''),160,5,'#3F5160',7,'center');
}

/* ============================== ACHIEVEMENT EMBLEMS: one for every achievement ============================== */
const ACH_GLYPH={dm:'cannon',r:'bubble',v:'reel',m:'calendar',c:'crown',bestDay:'sun',activeDays:'calendar',bestStreak:'flame',teamWins:'swords',sessions:'hourglass',lockMin:'hourglass',bestSession:'compass',earned:'coins',spent:'bag',bosses:'skull',finalBlows:'sword',chalWon:'trophy',chalPlayed:'flag',collected:'shell',level:'star',teamDm:'anchor',weeks:'wheel',built:'hammer',stretch:'spyglass',perfect50:'scales',comebacks:'wave',rainmaker:'rain',sets:'chest',earlyDm:'sunrise',morning50:'sunrise',photoFinish:'camera',fridayBlow:'bomb',overtakes:'arrows',rareBosses:'tentacle',rosterDone:'scroll',prestige:'wings',mothStage:'parrot',redemptions:'heart',shieldsUsed:'shield',merchantBuys:'bag',decorFull:'palm',questsClaimed:'scroll',sprintWins:'bolt',bigComebacks:'wave',perfectEqual:'scales',againstOdds:'dice',finalSecond:'hourglass',lateSession:'moon',palindrome:'eye',answer42:'eye',lucky7:'dice',triple:'dice',fullHouse:'dice',syncDm:'swords',fastBoss:'bolt',mythics:'gem',cosmetics:'hat',fullRig:'ship',pets:'paw',petLegend:'paw',petMythic:'paw',em5:'flag',goldenDms:'sun',islands:'palm',vBoss:'tentacle'};
const ACH_COL={common:['#AEB7C2','#7D8894'],uncommon:['#5CC492','#2F8F62'],rare:['#5BA3EA','#2A6FBF'],epic:['#B07CF0','#7440C4'],legendary:['#F0B63A','#C07E0C'],mythic:['#F0679A','#B92A62'],transcendent:['#3F5160','#1F2A36']};
function achGlyph(c,g,col,acc){const st=(w=1.6)=>{c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';};
  switch(g){
  case'cannon':c.save();c.rotate(-.38);rr(c,-7,-3.2,13,6.4,3.2,col);rr(c,4.6,-3.9,2.6,7.8,1,col);c.restore();disc(c,-3,4.4,3.8,col);disc(c,-3,4.4,1.4,acc);disc(c,8,-7.6,1.9,col);break;
  case'bubble':rr(c,-8,-7.5,16,11.5,4.5,col);poly(c,[[-4.5,2.5],[-6.5,8],[1,3.6]],col);[-4,0,4].forEach(x=>disc(c,x,-1.8,1.15,acc));break;
  case'reel':rr(c,-8.5,-6,17,12,3,col);poly(c,[[-2.4,-3.4],[4,0],[-2.4,3.4]],acc);disc(c,-6.4,-4,.7,acc);disc(c,6.4,-4,.7,acc);disc(c,-6.4,4,.7,acc);disc(c,6.4,4,.7,acc);break;
  case'calendar':rr(c,-7.5,-6,15,13.5,2.5,col);R(c,-7.5,-2.6,15,1.3,acc);R(c,-4.4,-8.4,1.7,4.4,col);R(c,2.7,-8.4,1.7,4.4,col);st(1.5);c.strokeStyle=acc;c.beginPath();c.moveTo(-3.4,2.6);c.lineTo(-1,5);c.lineTo(3.8,.4);c.stroke();break;
  case'crown':poly(c,[[-8,5],[-8,-4],[-4,0],[0,-7],[4,0],[8,-4],[8,5]],col);R(c,-8,5.8,16,2,col);disc(c,0,1.6,1.3,acc);disc(c,-5,2.6,.9,acc);disc(c,5,2.6,.9,acc);break;
  case'sun':disc(c,0,0,4.6,col);st(1.5);for(let i=0;i<8;i++){const a=i/8*TAU;c.beginPath();c.moveTo(Math.cos(a)*6.4,Math.sin(a)*6.4);c.lineTo(Math.cos(a)*8.8,Math.sin(a)*8.8);c.stroke();}break;
  case'flame':c.fillStyle=col;c.beginPath();c.moveTo(0,-9);c.bezierCurveTo(7,-3,7.5,3,4.4,6.6);c.bezierCurveTo(2,9,-2,9,-4.4,6.6);c.bezierCurveTo(-8,2,-4,-1,-3,-4.6);c.bezierCurveTo(-1.6,-2.4,-.6,-5,0,-9);c.fill();c.fillStyle=acc;c.beginPath();c.moveTo(0,-1);c.bezierCurveTo(3,2,3,5,0,7);c.bezierCurveTo(-3,5,-3,2,0,-1);c.fill();break;
  case'swords':st(1.9);c.beginPath();c.moveTo(-7,-7);c.lineTo(6,6);c.moveTo(7,-7);c.lineTo(-6,6);c.stroke();st(1.6);c.strokeStyle=acc;c.beginPath();c.moveTo(2.6,6.6);c.lineTo(6.6,2.6);c.moveTo(-2.6,6.6);c.lineTo(-6.6,2.6);c.stroke();disc(c,7.4,7.4,1.3,col);disc(c,-7.4,7.4,1.3,col);break;
  case'hourglass':R(c,-6,-8.6,12,1.8,col);R(c,-6,6.8,12,1.8,col);poly(c,[[-5,-6.6],[5,-6.6],[.8,0],[5,6.6],[-5,6.6],[-.8,0]],col);poly(c,[[-2.8,5.6],[2.8,5.6],[0,1.8]],acc);break;
  case'compass':disc(c,0,0,8.6,col);disc(c,0,0,6.6,acc);poly(c,[[0,-6],[1.9,0],[-1.9,0]],col);poly(c,[[0,6],[1.9,0],[-1.9,0]],'rgba(255,255,255,.55)');disc(c,0,0,.9,acc);break;
  case'coins':[5.4,1.6,-2.2].forEach((y,i)=>{ell(c,i%2?1:-1,y+1.2,7,2.8,acc);ell(c,i%2?1:-1,y,7,2.8,col);});ell(c,-1,-2.2,4.4,1.5,acc);break;
  case'bag':c.fillStyle=col;c.beginPath();c.moveTo(-2.6,-4.6);c.bezierCurveTo(-10,0,-8.6,8.6,0,8.6);c.bezierCurveTo(8.6,8.6,10,0,2.6,-4.6);c.closePath();c.fill();poly(c,[[-3.6,-8.6],[3.6,-8.6],[2.2,-4.6],[-2.2,-4.6]],col);R(c,-3,-5.2,6,1.2,acc);disc(c,0,2.6,2.6,acc);break;
  case'skull':drawSymbol(c,'skull',0,-.6,3.3,col);break;
  case'sword':st(2.2);c.beginPath();c.moveTo(0,-9);c.lineTo(0,3.4);c.stroke();st(1.8);c.strokeStyle=acc;c.beginPath();c.moveTo(-4.4,3.6);c.lineTo(4.4,3.6);c.stroke();st(2);c.beginPath();c.moveTo(0,4.6);c.lineTo(0,8);c.stroke();disc(c,0,8.6,1.4,col);break;
  case'trophy':c.fillStyle=col;c.beginPath();c.moveTo(-5.6,-8);c.lineTo(5.6,-8);c.bezierCurveTo(5.6,0,3,2.6,0,3);c.bezierCurveTo(-3,2.6,-5.6,0,-5.6,-8);c.fill();R(c,-1,2.6,2,3.4,col);rr(c,-4.4,5.8,8.8,2.6,.8,col);st(1.3);c.beginPath();c.arc(-6.2,-4.4,2.6,Math.PI*.5,Math.PI*1.5);c.moveTo(6.2,-7);c.arc(6.2,-4.4,2.6,-Math.PI*.5,Math.PI*.5);c.stroke();disc(c,0,-3.4,1.6,acc);break;
  case'flag':R(c,-6.4,-9,1.7,18,col);c.fillStyle=col;c.beginPath();c.moveTo(-4.4,-8.4);c.quadraticCurveTo(1,-10.4,7.6,-7);c.lineTo(5,-3.2);c.lineTo(7.6,.6);c.quadraticCurveTo(1,-2.4,-4.4,-.4);c.closePath();c.fill();disc(c,0,-4.6,1.5,acc);break;
  case'shell':c.fillStyle=col;c.beginPath();c.moveTo(0,8);c.lineTo(-8.6,-1.6);c.quadraticCurveTo(0,-11.6,8.6,-1.6);c.closePath();c.fill();st(.9);c.strokeStyle=acc;[-5,-2.4,0,2.4,5].forEach(x=>{c.beginPath();c.moveTo(0,7);c.lineTo(x,-4.6+Math.abs(x)*.5);c.stroke();});break;
  case'star':drawSymbol(c,'star',0,.4,3.6,col);disc(c,0,.4,1.4,acc);break;
  case'anchor':drawSymbol(c,'anchor',0,.6,3.5,col);break;
  case'wheel':st(1.7);c.beginPath();c.arc(0,0,5.6,0,TAU);c.stroke();st(1.3);for(let i=0;i<8;i++){const a=i/8*TAU;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a)*8.8,Math.sin(a)*8.8);c.stroke();}disc(c,0,0,1.9,col);disc(c,0,0,.8,acc);break;
  case'hammer':c.save();c.rotate(-.7);rr(c,-1,-3,2,13,1,col);rr(c,-5.6,-8,11.2,5.4,1.4,col);R(c,-5.6,-6,2,1.4,acc);c.restore();break;
  case'spyglass':c.save();c.rotate(-.5);rr(c,-9,-1.8,7,3.6,1,col);rr(c,-2.6,-2.6,6.4,5.2,1,col);rr(c,3.4,-3.4,5.4,6.8,1.2,col);R(c,7.2,-3.4,1.2,6.8,acc);c.restore();disc(c,6.4,-7.6,1,col);break;
  case'scales':R(c,-.8,-8,1.6,14,col);R(c,-7.6,-6.6,15.2,1.4,col);rr(c,-4.4,6,8.8,2.2,.8,col);[-6.8,6.8].forEach(x=>{st(.7);c.beginPath();c.moveTo(x,-6);c.lineTo(x-2.6,0);c.moveTo(x,-6);c.lineTo(x+2.6,0);c.stroke();c.fillStyle=col;c.beginPath();c.arc(x,0,3,0,Math.PI);c.fill();});disc(c,0,-8.4,1.4,acc);break;
  case'wave':st(2.2);[-4,1.4,6.8].forEach((y,k)=>{c.beginPath();c.moveTo(-8.6,y);c.bezierCurveTo(-5,y-5,-2.6,y+3.4,0,y);c.bezierCurveTo(2.6,y-3.4,5,y+5-k,8.6,y-1);c.stroke();});break;
  case'rain':disc(c,-3.6,-3,4,col);disc(c,2.4,-4.6,5,col);disc(c,6,-1.6,3.2,col);rr(c,-7.4,-3,16.4,4.6,2.3,col);st(1.4);c.strokeStyle=acc==='#fff'?col:col;[-4.6,0,4.6].forEach(x=>{c.beginPath();c.moveTo(x,4);c.lineTo(x-1.4,8);c.stroke();});break;
  case'chest':rr(c,-8,-1,16,9,1.6,col);c.fillStyle=col;c.beginPath();c.moveTo(-8,-1.8);c.quadraticCurveTo(-8,-8.4,0,-8.4);c.quadraticCurveTo(8,-8.4,8,-1.8);c.closePath();c.fill();R(c,-8,-2,16,1.3,acc);rr(c,-1.5,-3,3,4.4,.8,acc);break;
  case'sunrise':c.fillStyle=col;c.beginPath();c.arc(0,3,5.4,Math.PI,0);c.fill();R(c,-9,4.4,18,1.7,col);st(1.4);for(let i=0;i<5;i++){const a=Math.PI+(i+.5)/5*Math.PI;c.beginPath();c.moveTo(Math.cos(a)*7.2,3+Math.sin(a)*7.2);c.lineTo(Math.cos(a)*9.8,3+Math.sin(a)*9.8);c.stroke();}R(c,-5.6,7.4,11.2,1.3,col);break;
  case'camera':rr(c,-8.6,-4.6,17.2,11.6,2.4,col);rr(c,-3.4,-7.4,6.8,3.6,1,col);disc(c,0,1.2,3.9,acc);disc(c,0,1.2,2.1,col);disc(c,6,-2.2,.8,acc);break;
  case'bomb':disc(c,-1,2,6.6,col);rr(c,1.6,-6.6,3.4,3.4,.8,col);st(1.1);c.beginPath();c.moveTo(3.6,-6.4);c.quadraticCurveTo(6,-9.6,8,-7.4);c.stroke();disc(c,8.2,-7.4,1.4,acc==='#fff'?col:'#FFE27A');disc(c,-3.4,-.4,1.5,'rgba(255,255,255,.45)');break;
  case'arrows':st(1.9);c.beginPath();c.moveTo(-8,5);c.bezierCurveTo(-2,5,0,-5,6,-5);c.moveTo(-8,-5);c.bezierCurveTo(-2,-5,0,5,6,5);c.stroke();poly(c,[[5,-8.4],[9.6,-5],[5,-1.6]],col);poly(c,[[5,1.6],[9.6,5],[5,8.4]],col);break;
  case'tentacle':st(3.6);c.beginPath();c.moveTo(-5,9);c.bezierCurveTo(-7,0,5,2,4,-4.4);c.bezierCurveTo(3.4,-8.6,-3,-8,-2,-4);c.stroke();[[-5.4,5],[-2.6,1.4],[1.6,-.2]].forEach(([x,y])=>disc(c,x,y,.9,acc));break;
  case'scroll':rr(c,-6.6,-7.6,13.2,15.2,1.4,col);rr(c,-8.4,-8.6,16.8,3,1.5,col);rr(c,-8.4,5.6,16.8,3,1.5,col);[-2.8,0,2.8].forEach(y=>R(c,-4,y-.5,8,1,acc));break;
  case'wings':[-1,1].forEach(sd=>{c.fillStyle=col;c.beginPath();c.moveTo(sd*1,3);c.bezierCurveTo(sd*4,-9,sd*10,-8,sd*9.4,-2);c.bezierCurveTo(sd*8.6,-3,sd*7.6,-2.6,sd*7.4,.4);c.bezierCurveTo(sd*6.4,-.6,sd*5.4,0,sd*5,2.6);c.bezierCurveTo(sd*4,2,sd*2.6,2.4,sd*1,5.6);c.closePath();c.fill();});disc(c,0,2,2.2,col);disc(c,0,2,1,acc);break;
  case'parrot':drawSymbol(c,'parrot',-.6,.6,3.6,col);disc(c,1.4,-4.6,.6,acc);break;
  case'heart':drawSymbol(c,'heart',0,.4,3.5,col);break;
  case'shield':c.fillStyle=col;c.beginPath();c.moveTo(0,-8.6);c.lineTo(7.4,-5.6);c.lineTo(7.4,.6);c.quadraticCurveTo(6.6,6,0,9);c.quadraticCurveTo(-6.6,6,-7.4,.6);c.lineTo(-7.4,-5.6);c.closePath();c.fill();c.fillStyle=acc;c.beginPath();c.moveTo(0,-5.4);c.lineTo(4.4,-3.6);c.lineTo(4.4,.2);c.quadraticCurveTo(4,3.6,0,5.6);c.closePath();c.fill();break;
  case'palm':st(2);c.beginPath();c.moveTo(-1,9);c.quadraticCurveTo(1.6,2,0,-3.6);c.stroke();for(let i=0;i<5;i++){const a=-Math.PI/2+(i-2)*.62;ell(c,Math.cos(a)*4.6,-3.6+Math.sin(a)*2.4+1.6,5,1.7,col,a);}disc(c,1,-2.6,1.2,acc);ell(c,0,9,6,1.4,col);break;
  case'bolt':poly(c,[[2,-9.4],[-6,1],[-1,1],[-3,9.4],[6,-2],[.6,-2]],col);break;
  case'dice':c.save();c.rotate(.2);rr(c,-7,-7,14,14,3,col);[[-3.4,-3.4],[3.4,3.4],[0,0],[3.4,-3.4],[-3.4,3.4]].forEach(([x,y])=>disc(c,x,y,1.25,acc));c.restore();break;
  case'moon':disc(c,0,0,7.6,col);disc(c,3.6,-2.4,6.4,acc);disc(c,-7,-7,.8,col);disc(c,7.6,5.6,.7,col);break;
  case'eye':c.fillStyle=col;c.beginPath();c.moveTo(-9,0);c.quadraticCurveTo(0,-8.6,9,0);c.quadraticCurveTo(0,8.6,-9,0);c.fill();disc(c,0,0,3.6,acc);disc(c,0,0,1.6,col);break;
  case'gem':drawSymbol(c,'diamond',0,0,3.6,col);st(.6);c.strokeStyle=acc;c.beginPath();c.moveTo(-3,-2.2);c.lineTo(0,8);c.lineTo(3,-2.2);c.stroke();break;
  case'hat':c.fillStyle=col;c.beginPath();c.moveTo(-9.6,3.6);c.quadraticCurveTo(-5,-1,0,-7.6);c.quadraticCurveTo(5,-1,9.6,3.6);c.quadraticCurveTo(0,7.6,-9.6,3.6);c.fill();st(1);c.strokeStyle=acc;c.beginPath();c.moveTo(-7,3);c.quadraticCurveTo(0,6,7,3);c.stroke();drawSymbol(c,'skull',0,-.6,1.3,acc);break;
  case'ship':c.fillStyle=col;c.beginPath();c.moveTo(-8.6,3);c.lineTo(8.6,3);c.quadraticCurveTo(7,8,3.4,8);c.lineTo(-4.6,8);c.quadraticCurveTo(-7.6,7,-8.6,3);c.fill();R(c,-.6,-9,1.3,12,col);poly(c,[[1.4,-8.4],[7.6,1],[1.4,1]],col);poly(c,[[-1.4,-6],[-6.6,1],[-1.4,1]],col);R(c,-6,4.6,12,.9,acc);break;
  case'paw':ell(c,0,3.4,4.6,3.9,col);[[-5.6,-1.6],[-2,-5.6],[2,-5.6],[5.6,-1.6]].forEach(([x,y])=>ell(c,x,y,1.9,2.4,col,x*.06));break;
  default:c.font='700 15px Fredoka, Nunito, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle=col;c.fillText('?',0,1);}}
function drawAchArt(cv,a,un,secret){const S2=cv.width/48;const c=cv.getContext('2d');c.setTransform(S2,0,0,S2,0,0);c.clearRect(0,0,48,48);if(!a)return;
  const hidden=secret&&!un;const rar=hidden?'common':a.rar;const[c1,c2]=hidden?['#CFC6B0','#A79E88']:ACH_COL[rar]||ACH_COL.common;const hs=h32('art'+a.id);const ri=RARITIES.indexOf(rar);
  c.save();c.translate(24,24);
  const shape=(r,k=0)=>{c.beginPath();
    if(ri<=1)c.arc(0,0,r,0,TAU);
    else if(ri===2){c.moveTo(0,-r);c.lineTo(r*.88,-r*.62);c.lineTo(r*.88,r*.1);c.quadraticCurveTo(r*.8,r*.72,0,r*1.02);c.quadraticCurveTo(-r*.8,r*.72,-r*.88,r*.1);c.lineTo(-r*.88,-r*.62);c.closePath();}
    else if(ri===3){for(let i=0;i<6;i++){const an=i/6*TAU-Math.PI/2;c.lineTo(Math.cos(an)*r*1.04,Math.sin(an)*r*1.04);}c.closePath();}
    else{const n=ri===4?12:ri===5?8:16;for(let i=0;i<n*2;i++){const an=i/(n*2)*TAU-Math.PI/2,rad=r*(i%2?(ri===5?.8:.88):1.06);c.lineTo(Math.cos(an)*rad,Math.sin(an)*rad);}c.closePath();}};
  // drop shadow, rim, field
  c.save();c.translate(0,1.6);shape(20);c.fillStyle='rgba(0,0,0,.2)';c.fill();c.restore();
  shape(20);if(rar==='transcendent'&&c.createConicGradient){const cg=c.createConicGradient(0,0,0);['#E0457B','#DDA94D','#45B07C','#3E8DDB','#9B5DE5','#E0457B'].forEach((x,i)=>cg.addColorStop(i/5,x));c.fillStyle=cg;}else c.fillStyle=c2;c.fill();
  if(ri===1){for(let i=0;i<16;i++){const an=i/16*TAU;disc(c,Math.cos(an)*18.4,Math.sin(an)*18.4,1.1,'rgba(255,255,255,.55)');}}
  shape(ri<=1?16.6:17);const fg=c.createLinearGradient(0,-17,0,17);fg.addColorStop(0,c1);fg.addColorStop(1,c2);c.fillStyle=fg;c.fill();
  c.save();c.clip();
  // a background pattern and tint unique to this achievement
  const tint=['255,210,122','122,224,255','255,154,194','182,255,154','201,166,255','255,255,255'][hs%6];glowAt(c,((hs>>3)%20)-10,((hs>>8)%14)-12,22,tint,.5);
  c.strokeStyle='rgba(255,255,255,.16)';c.fillStyle='rgba(255,255,255,.14)';c.lineWidth=.9;const pat=(hs>>12)%6;
  if(pat===0)for(let i=0;i<12;i++){const an=i/12*TAU+(hs%7)*.1;c.beginPath();c.moveTo(0,0);c.arc(0,0,24,an,an+TAU/24);c.closePath();c.fill();}
  else if(pat===1)for(let y=-18;y<20;y+=5){c.beginPath();for(let x=-20;x<=20;x+=2)c.lineTo(x,y+Math.sin(x*.6+(hs%5))*1.5);c.stroke();}
  else if(pat===2)for(let i=0;i<40;i++)disc(c,((i*37+hs)%40)-20,((i*23+(hs>>4))%40)-20,.8,'rgba(255,255,255,.2)');
  else if(pat===3){c.save();c.rotate(.6+(hs%4)*.3);for(let x=-26;x<26;x+=6)c.fillRect(x,-26,2.4,52);c.restore();}
  else if(pat===4)for(let r0=5;r0<24;r0+=5){c.beginPath();c.arc(0,0,r0,0,TAU);c.stroke();}
  else for(let y=-18;y<20;y+=6)for(let x=-21+((y/6)%2?3:0);x<22;x+=6){c.beginPath();c.arc(x,y,3,0,Math.PI);c.stroke();}
  c.fillStyle='rgba(255,255,255,.2)';c.beginPath();c.ellipse(-4,-15,15,7,-.3,0,TAU);c.fill();
  c.restore();
  shape(ri<=1?16.6:17);c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=.8;c.stroke();
  // glyph
  const g=hidden?'?':(ACH_GLYPH[a.metric]||(a.cat==='Secret'?'eye':'star'));const tier=a.fam?(+a.id.split('_').pop()||0)+1:0;
  c.save();c.translate(0,tier?-1.4:0);c.scale(.98,.98);c.save();c.translate(0,1);achGlyph(c,g,'rgba(0,0,0,.2)','rgba(0,0,0,0)');c.restore();achGlyph(c,g,'#FFFDF5',c2);c.restore();
  // tier pips for the six-step families
  if(tier&&!hidden){const w=(tier-1)*3.4;for(let i=0;i<tier;i++){disc(c,-w/2+i*3.4,12.6,1.5,c2);disc(c,-w/2+i*3.4,12.3,1.1,'#FFE9A6');}}
  if(!tier&&!hidden){const sg=['star','flame','bolt','gem','heart','moon','sun','anchor','shell','coins','wave','flag'][(hs>>16)%12];c.save();c.translate(12.6,12.6);disc(c,0,.8,5.8,'rgba(0,0,0,.18)');disc(c,0,0,5.8,'#FFFDF5');disc(c,0,0,4.7,c2);c.scale(.4,.4);achGlyph(c,sg,'#FFFDF5',c2);c.restore();}
  if(ri===5&&!hidden)for(let i=0;i<8;i++){const an=i/8*TAU-Math.PI/2;disc(c,Math.cos(an)*19.4,Math.sin(an)*19.4,1.2,'#FFF1C2');}
  c.restore();}
function paintAch(root=document){root.querySelectorAll('canvas.medalArt').forEach(cv=>{const a=ACHIEVEMENTS.find(x=>x.id===cv.dataset.ach);drawAchArt(cv,a,cv.dataset.un==='1',cv.dataset.sec==='1');});}

/* ============================== EMAIL BANNER ART (rendered to PNG at build time) ============================== */
function drawEmailBanner(cv,rar){const c=cv.getContext('2d');const s=cv.width/W;c.setTransform(s,0,0,s,0,-44*s);const t=4200;const col={common:'#9AA3AE',uncommon:'#45B07C',rare:'#3E8DDB',epic:'#9B5DE5',legendary:'#D99A17',mythic:'#E0457B'}[rar]||'#E06034';
  sky(c,t,{mode:rar==='mythic'||rar==='legendary'?'night':rar==='epic'?'sunset':rar==='rare'?'gold':'day',noBirds:false});sea(c,112,t);island(c,236,128,58,10,t);palm(c,196,124,17,t);palm(c,278,125,14,t+300);
  drawShip(c,84,152,1,{hull:'hull_oak',sail:'sail_funnal',flag:'flag_mark'},t,{pid:'sam',moving:true});
  // the mystery pet: a glowing silhouette on the island
  const mx=236,my=106;lamp(c,mx,my,34,.55,rar==='common'?'255,255,255':'255,236,170');for(let i=0;i<10;i++){const a=i/10*TAU+.2;c.strokeStyle=col;c.globalAlpha=.5;c.lineWidth=1.2;c.lineCap='round';c.beginPath();c.moveTo(mx+Math.cos(a)*17,my+Math.sin(a)*17);c.lineTo(mx+Math.cos(a)*23,my+Math.sin(a)*23);c.stroke();}c.globalAlpha=1;
  disc(c,mx,my,14.6,'#FFFFFF');disc(c,mx,my,13,col);ell(c,mx,my+3,6.4,5.4,'rgba(20,24,40,.82)');disc(c,mx,my-3.4,4.4,'rgba(20,24,40,.82)');poly(c,[[mx-4,my-6],[mx-5.4,my-10.4],[mx-1.4,my-7.4]],'rgba(20,24,40,.82)');poly(c,[[mx+4,my-6],[mx+5.4,my-10.4],[mx+1.4,my-7.4]],'rgba(20,24,40,.82)');
  c.font='700 9px Fredoka, Nunito, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#FFFFFF';c.fillText('?',mx,my+2.6);
  for(let i=0;i<7;i++){const a=i*.9,x=mx+Math.cos(a)*(22+i%3*5),y=my+Math.sin(a)*(16+i%2*6);line(c,x-1.8,y,x+1.8,y,'#FFF6CF',.6);line(c,x,y-1.8,x,y+1.8,'#FFF6CF',.6);}
  drawGull(c,150,64,t);rr(c,155,68,7,5,.8,'#FFFFFF');poly(c,[[155,68],[158.5,71],[162,68]],'#E9E2D2');disc(c,158.5,71.4,.9,'#E06034');
}
