/* ===== 23 Nov: the Herald by email =====
   The morning email is written on the server, but the Herald's stories (headline, hunting news, Gary's Corner, forecast,
   stop press...) and its front-page drawing come from the game itself. So whenever a captain has the game open, the game
   quietly publishes the edition for the last working day (and, after 9pm, for today) to hl_herald, with the drawing
   uploaded to the public hl-mail bucket. If nobody has opened the game, the email still goes out with the numbers. */
function hmClean(h){return String(h||'').replace(/<br\s*\/?>/gi,'\n').replace(/<(?!\/?(b|i)>)[^>]*>/gi,'').trim();}
function heraldMailData(yd){
  const h=herald(yd),D=h.D,P=G.P,fs=frontStory(yd,h);const won=D.target>0&&D.team>=D.target;
  const sp=(()=>{try{const d=D8().herald||{};return dlPick(d.stopPress,'herald.sp',0,1,yd)||'';}catch(e){return '';}})();
  const lead=D.p[h.top].d===D.p[h.bottom]?.d?'Dead heat. Both keepers refuse to comment.':`${pnameRaw(h.top)} won the day by ${D.p[h.top].d-D.p[h.bottom].d}.`;
  let rec=[];try{rec=recordsSetOn(yd);}catch(e){}
  const safe=f=>{try{return hmClean(f());}catch(e){return '';}};
  return {v:1,date:yd,head:fs.head||h.head,deck:fs.deck,special:fs.special||'',boss:D.boss?D.boss.name:'',won,team:D.team,target:D.target,
    players:Object.fromEntries(P.map(p=>[p,{name:pnameRaw(p),d:D.p[p].d||0,f:D.p[p].f||0,r:D.p[p].r||0,v:D.p[p].v||0,m:D.p[p].m||0,c:D.p[p].c||0}])),
    caption:D.target&&D.boss?(won?`${D.boss.name}, moments before going under.`:`${D.boss.name}, looking pleased with itself.`)+" Artist's impression (Gary).":'',
    hunting:safe(()=>hHunting(yd,D)),fishing:safe(()=>hFishing(yd)),gary:safe(()=>hGary(yd)),forecast:safe(()=>hWeather(yd)),leader:lead,
    records:rec.slice(0,4),achs:h.achs.slice(0,6).map(x=>({p:pnameRaw(x.p),n:x.a.name})),bottle:safe(()=>heraldBottle(yd,D)),stop:sp};
}
/* the front-page drawing at twice the game's size, so it is sharp in email */
function heraldArt(yd){const cv=document.createElement('canvas');cv.width=1280;cv.height=560;cv.dataset.hillo=yd;const ctx=cv.getContext('2d');
  const st=ctx.setTransform.bind(ctx),rs=ctx.resetTransform?ctx.resetTransform.bind(ctx):null;ctx.setTransform=function(a,b,c,d,e,f){if(typeof a==='object')return st(a);return st(a*2,b*2,c*2,d*2,e*2,f*2);};
  if(rs)ctx.resetTransform=function(){st(2,0,0,2,0,0);};paintHillo(cv);
  const out=document.createElement('canvas');out.width=1280;out.height=560;const c=out.getContext('2d');c.filter='sepia(.3)';c.drawImage(cv,0,0);return out;}
async function heraldPublish(yd){
  if(S.mode!=='supa'||!S.sb||!G||!G.days)return;const data=heraldMailData(yd);const js=JSON.stringify(data);const key='hl_hm_'+yd;
  let last={};try{last=JSON.parse(localStorage.getItem(key)||'{}');}catch(e){}if(last.h===h32(js))return;
  let img=last.img||null;const artKey=h32((data.boss||'')+data.won+(data.target||0));
  if(data.boss&&(last.art!==artKey||!img)){try{
    const out=heraldArt(yd);
    const blob=await new Promise(r=>out.toBlob(r,'image/jpeg',.84));const path=`herald/${yd}.jpg`;
    const up=await S.sb.storage.from('hl-mail').upload(path,blob,{upsert:true,contentType:'image/jpeg',cacheControl:'300'});
    if(!up.error)img=S.sb.storage.from('hl-mail').getPublicUrl(path).data.publicUrl+'?v='+artKey;}catch(e){}}
  const r=await S.sb.from('hl_herald').upsert({d:yd,data,img,updated_at:new Date().toISOString()});
  if(!r.error)try{localStorage.setItem(key,JSON.stringify({h:h32(js),art:artKey,img}));}catch(e){}
}
function heraldPublishTick(){try{if(S.mode!=='supa'||!G||!G.today)return;const yd=G.workdays.filter(d=>d<G.today).pop();const ds=[];if(yd)ds.push(yd);
  const uk=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',hour:'2-digit',hour12:false}).format(new Date());if(+uk>=21&&isWork(G.today))ds.push(G.today);
  ds.reduce((p,d)=>p.then(()=>heraldPublish(d).catch(()=>{})),Promise.resolve());}catch(e){}}
setTimeout(heraldPublishTick,12000);setInterval(heraldPublishTick,15*60*1000);
