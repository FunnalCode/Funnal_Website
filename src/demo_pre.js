/* ===== Client hub demo (23 Nov 2026) =====
   A live demo of the pipeline for videos: same design and code, a made-up business, sample data that is always
   dated around today, and its own storage so it never touches the real pipeline or the game. Runs before everything else. */
(function(){
  var MARK='<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lmG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".95"/><stop offset="1" stop-color="currentColor" stop-opacity=".55"/></linearGradient></defs><circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" stroke-width="3.2"/><path d="M24 9a15 15 0 0 1 0 30z" fill="url(#lmG)"/><circle cx="24" cy="24" r="4.2" fill="currentColor"/></svg>';
  window.HL_DEMO={biz:'Lumen Studio',names:{sam:'Alex',james:'Jordan'},emails:{sam:'alex@lumenstudio.co',james:'jordan@lumenstudio.co'},mark:MARK,
    auth:window.HL_DEMO_AUTH||null};

  document.documentElement.classList.add('hlDemo');

  /* --- own storage: every key gets a "demo:" prefix, so the real game and pipeline on this site are never touched --- */
  var P='demo:',SP=Storage.prototype,oG=SP.getItem,oS=SP.setItem,oR=SP.removeItem,oK=SP.key,oC=SP.clear,LS=window.localStorage;
  var lenD=Object.getOwnPropertyDescriptor(SP,'length');
  var mine=function(){var a=[];for(var i=0;i<lenD.get.call(LS);i++){var k=oK.call(LS,i);if(k&&k.indexOf(P)===0)a.push(k.slice(P.length));}return a;};
  SP.getItem=function(k){return this===LS?oG.call(this,P+k):oG.call(this,k);};
  SP.setItem=function(k,v){return this===LS?oS.call(this,P+k,v):oS.call(this,k,v);};
  SP.removeItem=function(k){return this===LS?oR.call(this,P+k):oR.call(this,k);};
  SP.key=function(i){return this===LS?(mine()[i]||null):oK.call(this,i);};
  SP.clear=function(){if(this!==LS)return oC.call(this);mine().forEach(function(k){oR.call(LS,P+k);});};
  Object.defineProperty(SP,'length',{configurable:true,get:function(){return this===LS?mine().length:lenD.get.call(this);}});

  /* --- sample data, rebuilt each day so dates always look current --- */
  var pad=function(n){return (n<10?'0':'')+n;};
  var iso=function(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());};
  var now=new Date(),TODAY=iso(now);
  var add=function(s,n){var d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return iso(d);};
  var SEED_V='v5:'+TODAY;
  if(localStorage.getItem('hl_demo_seed')===SEED_V)return;
  var keep=localStorage.getItem('hl_theme'),snd=localStorage.getItem('hl_sound');
  localStorage.clear();if(keep)localStorage.setItem('hl_theme',keep);if(snd)localStorage.setItem('hl_sound',snd);
  var seed=1;var rnd=function(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
  var pick=function(a){return a[Math.floor(rnd()*a.length)];};
  var uid=function(){return 'd'+Math.floor(rnd()*1e12).toString(36)+Math.floor(rnd()*1e12).toString(36);};
  var isWork=function(s){var d=new Date(s+'T12:00:00').getDay();return d>0&&d<6;};

  // the game side (only used for outreach numbers on Analytics)
  var db={'config/main':{target:90,dayStart:'09:00',dayEnd:'17:30',finalWarning:'16:30',workdays:[1,2,3,4,5],cooldownSec:5,caps:{c:4,m:8,r:60,v:20},cooldowns:{c:300,m:60,r:3,v:20},requireConfirm:false,sightingMode:'off',absences:{},offReq:{},absenceScale:.5,startDate:''},
    'players/sam':{pid:'sam',handle:'Alex'},'players/james':{pid:'james',handle:'Jordan'}};
  for(var i=75;i>=0;i--){var day=add(TODAY,-i);if(!isWork(day))continue;['sam','james'].forEach(function(p,pi){
    var ev={},base=new Date(day+'T09:05:00').getTime();var n=Math.round((i===0?Math.min(1,(now.getHours()-9)/8):1)*(38+rnd()*22+(pi?-4:3)+(75-i)*.12));
    for(var k=0;k<n;k++)ev[uid()]={k:'d',t:base+Math.floor(rnd()*8*3600e3)};
    var f=Math.round(n*(.28+rnd()*.12));for(var k2=0;k2<f;k2++)ev[uid()]={k:'f',t:base+Math.floor(rnd()*8*3600e3)};
    var r=Math.round(n*(.06+rnd()*.05));for(var k3=0;k3<r;k3++)ev[uid()]={k:'r',t:base+Math.floor(rnd()*8*3600e3)};
    if(rnd()<.35)ev[uid()]={k:'m',t:base+Math.floor(rnd()*8*3600e3)};
    db['days/'+day+'_'+p]={pid:p,date:day,ev:ev};});}
  localStorage.setItem('hl_local_db_v1',JSON.stringify(db));

  // catalogue: a general set of packages, services and add-ons
  var cat=[['pkg_starter','Starter','package',495,'monthly',null,'A simple monthly plan: core service, a monthly check-in and email support. Ideal for small teams getting started.'],
    ['pkg_growth','Growth','package',995,'monthly',null,'Everything in Starter plus priority support, a dedicated account manager, quarterly strategy sessions and monthly reporting.'],
    ['pkg_scale','Scale','package',1995,'monthly',null,'Our full service for growing businesses: weekly delivery, advanced reporting, a named team, same-day support and an annual planning day.'],
    ['svc_setup','Onboarding and set-up','service',750,'one_off',null,'Discovery workshop, account set-up, data import and a team training session.'],
    ['svc_web','Website build','service',2400,'one_off',null,'A fast, modern website designed and built around your brand. Five pages, copywriting and launch support.'],
    ['svc_brand','Brand refresh','service',1200,'one_off',null,'Logo tidy-up, colours, type and a one-page brand guide.'],
    ['svc_care','Care plan','service',129,'monthly',null,'Hosting, updates, backups and small changes each month.'],
    ['svc_social','Social media','service',549,'monthly',null,'Two platforms planned, written and scheduled each month.'],
    ['svc_ads','Paid ads','service',299,'monthly',null,'Google or Meta ads managed, plus 15% of ad spend.'],
    ['svc_email','Email marketing','service',349,'monthly',null,'A monthly newsletter and a welcome series, designed and sent.'],
    ['add_shoot','Content day','addon',650,'one_off',null,'A half-day photo and video shoot, on site.'],
    ['add_landing','Landing page','addon',450,'one_off',null,'One high-converting page for a campaign or offer.'],
    ['add_report','Extra reporting','addon',99,'monthly',null,'A live dashboard and a monthly video walkthrough.']]
    .map(function(a,i){return {id:a[0],name:a[1],kind:a[2],price:a[3],period:a[4],setup:a[5],note:a[6],sort:i+1,active:true};});
  localStorage.setItem('hl_cat_v1',JSON.stringify(cat));

  // prospects
  var biz=[['Bloom & Wild Florist','Priya Shah','Florist','Leeds'],['Northside Physio','Daniel Okafor','Physiotherapy','Manchester'],['The Copper Kettle','Hannah Price','Café','York'],['Peak Fitness Studio','Marcus Lee','Gym','Sheffield'],['Willow Dental Care','Dr. Sarah Holt','Dentist','Harrogate'],
    ['Oak & Iron Joinery','Tom Bradley','Joinery','Halifax'],['Little Acorns Nursery','Emma Walsh','Childcare','Wakefield'],['Harbour Fish Bar','Ali Hassan','Takeaway','Whitby'],['Summit Accountants','Rebecca Moore','Accountancy','Bradford'],['Velvet Hair Studio','Chloe Barnes','Salon','Huddersfield'],
    ['Greenleaf Landscapes','James Carter','Landscaping','Ilkley'],['Moorland Lodge B&B','Fiona Grant','Hospitality','Hebden Bridge'],['Bright Smile Ortho','Dr. Imran Khan','Orthodontics','Leeds'],['Riverside Vets','Laura Pearce','Vets','Otley'],['Hartley Law','Simon Hartley','Solicitors','Leeds'],
    ['Pedal & Spoke Cycles','Ben Turner','Bike shop','Skipton'],['Saltwater Swim School','Megan Ellis','Swim school','Scarborough'],['Fern & Fable Books','Olivia Reed','Bookshop','Saltaire'],['Ironside Roofing','Gary Nolan','Roofing','Doncaster'],['Lumière Skin Clinic','Sophie Martin','Aesthetics','Wetherby'],
    ['Kings Arms Pub','Rob Fletcher','Pub','Knaresborough'],['Tidy Paws Grooming','Jess Hughes','Pet grooming','Pudsey'],['Atlas Removals','Kieran Doyle','Removals','Rotherham'],['Honeycomb Bakery','Grace Lin','Bakery','Holmfirth'],['Elm Tree Care Home','Margaret Bell','Care home','Barnsley'],
    ['Vantage Estate Agents','Chris Ward','Estate agent','Leeds'],['Studio Nine Yoga','Aisha Begum','Yoga','Manchester'],['Crafted Kitchens','Paul Dixon','Kitchens','Huddersfield'],['Evergreen Garden Centre','Linda Shaw','Garden centre','Selby'],['Spark Electrical','Ryan Webb','Electrician','Castleford'],
    ['Pebble Beach Cottages','Nina Cole','Holiday lets','Robin Hood\'s Bay'],['Brew & Bean Roasters','Theo Grant','Coffee','Sheffield'],['Fable Tattoo Co.','Luca Romano','Tattoo','Leeds'],['Clearview Opticians','Helen Ford','Opticians','Ripon'],['Rowan Wedding Barn','Kate Simmons','Weddings','Malton'],
    ['Apex Driving School','Sam Patel','Driving school','Batley'],['Marlow Interiors','Isabel Marlow','Interior design','Harrogate'],['Nomad Street Food','Jay Thompson','Street food','Leeds'],['Wellspring Chiropractic','Owen Price','Chiropractor','Halifax'],['Little Paper Co.','Ruby Ward','Stationery','York']];
  var stages=['client','client','client','client','client','client','quote_sent','quote_sent','quote_sent','meeting','meeting','meeting','talking','talking','talking','talking','followed_up','followed_up','followed_up','followed_up','followed_up','messaged','messaged','messaged','messaged','messaged','messaged','video_made','video_made','video_made','video_needed','video_needed','video_needed','video_needed','not_now','not_now','no_response','no_response','messaged','talking'];
  var products=['Website','Branding','Social media','Marketing','Consulting','Support plan'];
  var deals=[['pkg_growth',995,'monthly',140],['pkg_scale',1995,'monthly',96],['pkg_starter',495,'monthly',61],['pkg_growth',995,'monthly',40],['pkg_starter',495,'four_weekly',23],['svc_web',2400,'one_off',12]];
  var rows=[],pays=[],evs={},rags=['likely','likely','maybe','maybe','unlikely'];
  biz.forEach(function(b,i){var st=stages[i]||'messaged';var created=add(TODAY,-Math.floor(4+rnd()*200));
    var r={id:uid(),business:b[0],contact:b[1],niche:b[2],location:b[3],insta:b[0].toLowerCase().replace(/[^a-z]/g,'').slice(0,18),website:b[0].toLowerCase().replace(/[^a-z]/g,'')+'.co.uk',
      products:[pick(products)].concat(rnd()<.4?[pick(products)]:[]).filter(function(x,j,a){return a.indexOf(x)===j;}),stage:st,owner:i%3?'sam':'james',priority:i%7===2,rag:pick(rags),follow_ups:Math.floor(rnd()*3),
      last_contact:add(TODAY,-Math.floor(rnd()*9)),notes:pick(['Found via Instagram. Strong reviews, dated website.','Referred by a happy client.','Met at the local business breakfast.','Enquired through the website form.','Busy owner, prefers WhatsApp.','Wants to grow bookings before spring.']),
      sort:i,created_at:created+'T10:00:00.000Z',tags:[],links:[]};
    if(st==='meeting')r.meeting_at=add(TODAY,[0,1,3][i%3]);
    if(st==='quote_sent'){var q=[['pkg_growth',995],['pkg_scale',1995],['svc_web',2400]][i%3];r.package=q[0];r.deal_value=q[1];r.deal_period=q[0]==='svc_web'?'one_off':'monthly';}
    if(st==='talking'||st==='followed_up'){if(rnd()<.6){r.deal_value=[495,995,1995][i%3];r.deal_period='monthly';}}
    if(st==='not_now')r.return_on=add(TODAY,12+i);
    if(st==='client'){var dl=deals[i];r.package=dl[0];r.deal_value=dl[1];r.deal_period=dl[2];r.won_at=add(TODAY,-dl[3]);r.billing_start=add(TODAY,-dl[3]+2);r.created_at=add(TODAY,-dl[3]-25)+'T10:00:00.000Z';
      if(dl[2]==='one_off'){pays.push({id:uid(),prospect_id:r.id,due:r.billing_start,amount:dl[1],paid_at:r.billing_start+'T12:00:00Z',paid_by:'sam'});}
      else{var d=r.billing_start,step=dl[2]==='four_weekly'?28:0;while(d<TODAY){pays.push({id:uid(),prospect_id:r.id,due:d,amount:dl[1],paid_at:d+'T11:00:00Z',paid_by:i%2?'sam':'james'});
        if(step)d=add(d,step);else{var x=new Date(d+'T12:00:00');x.setMonth(x.getMonth()+1);d=iso(x);}}}}
    rows.push(r);
    // history for analytics and the activity feed
    var l=[],c=created,path=['messaged','followed_up','talking','meeting','quote_sent','client'],stop=path.indexOf(st);
    l.push({prospect_id:r.id,by:r.owner,kind:'created',detail:{},at:created+'T09:30:00.000Z'});
    for(var s=0;s<=stop&&stop>=0;s++){c=add(c,1+Math.floor(rnd()*6));if(c>TODAY)c=TODAY;l.push({prospect_id:r.id,by:r.owner,kind:'stage',detail:{from:s?path[s-1]:'video_needed',to:path[s]},at:c+'T1'+Math.floor(rnd()*7)+':'+pad(Math.floor(rnd()*59))+':00.000Z'});}
    if(st==='client')l[l.length-1].at=r.won_at+'T15:10:00.000Z';
    evs['hl_pipe_ev_'+r.id]=l.reverse();});
  localStorage.setItem('hl_pipe_v1',JSON.stringify(rows));
  Object.keys(evs).forEach(function(k){localStorage.setItem(k,JSON.stringify(evs[k]));});
  localStorage.setItem('hl_pay_v1',JSON.stringify(pays));

  // calendar: a realistic week of meetings, calls and tasks
  var E=[],mk=function(dayOff,st,en,title,kind,owner,pid,loc){var d=add(TODAY,dayOff);if(!isWork(d)&&dayOff)return;E.push({id:uid(),title:title,kind:kind,owner:owner,prospect_id:pid||null,location:loc||'',starts_at:new Date(d+'T'+st+':00').toISOString(),ends_at:new Date(d+'T'+en+':00').toISOString(),all_day:false,deleted:false,created_by:owner,updated_at:new Date().toISOString()});};
  var byStage=function(s){return rows.filter(function(r){return r.stage===s;});};
  var mt=byStage('meeting'),qs=byStage('quote_sent'),tk=byStage('talking'),cl=byStage('client');
  mk(0,'09:30','10:00','Team stand-up','meeting','sam',null,'Studio');mk(0,'10:00','11:00','Discovery call: '+mt[0].business,'call','sam',mt[0].id,'Google Meet');
  mk(0,'11:30','12:30','Proposal review: '+qs[0].business,'meeting','james',qs[0].id,'Their office');mk(0,'14:00','15:30','Website workshop: '+cl[0].business,'meeting','james',cl[0].id,'Studio');
  mk(0,'14:30','15:00','Follow-up call: '+tk[0].business,'call','sam',tk[0].id,'Phone');mk(0,'16:00','17:00','Write monthly reports','task','sam');
  for(var w=1;w<12;w++){mk(w,'09:30','10:00','Team stand-up','meeting','sam',null,'Studio');var a=rows[(w*3)%rows.length],b2=rows[(w*5+1)%rows.length];
    mk(w,['10:00','11:00','13:30'][w%3],['11:00','12:00','14:30'][w%3],(w%2?'Strategy session: ':'Check-in: ')+a.business,w%2?'meeting':'call',w%2?'james':'sam',a.id,w%2?'Studio':'Zoom');
    mk(w,['14:00','15:00','15:30'][w%3],['15:00','16:00','16:30'][w%3],(w%3?'Quote walkthrough: ':'Content planning: ')+b2.business,w%3?'call':'task',w%3?'sam':'james',b2.id);}
  for(var pw=-1;pw>-120;pw-=(pw>-25?1:2)){var z=rows[(-pw*7)%rows.length];mk(pw,'10:00','11:00','Call: '+z.business,'call',pw%2?'sam':'james',z.id);mk(pw,'14:00','15:00','Meeting: '+rows[(-pw*11)%rows.length].business,'meeting','james');}
  localStorage.setItem('hl_ev_v1',JSON.stringify(E));

  // quotes, some already opened and read
  var Q=[],QE=[];qs.concat([tk[1]]).forEach(function(r,i){var tok='';for(var t=0;t<24;t++)tok+='0123456789abcdef'[Math.floor(rnd()*16)];var id=uid();
    var pk=[{id:'pkg_starter',name:'Starter',price:495},{id:'pkg_growth',name:'Growth',price:995},{id:'pkg_scale',name:'Scale',price:1995}];
    var data={business:r.business,contact:r.contact,from:i%2?'james':'sam',packages:pk.map(function(p){return {cat:p.id,name:p.name,price:p.price,period:'monthly',items:[]};}),services:[],validUntil:add(TODAY,30-i*9),thanksTitle:''};
    Q.push({id:id,token:tok,prospect_id:r.id,title:r.business+' proposal',data:data,enc:null,has_pw:false,status:i===0?'viewed':i===1?'viewed':'sent',view_count:i<2?3-i:0,viewed_at:i<2?new Date(now-3600e3*(i*20+2)).toISOString():null,valid_until:data.validUntil,created_by:data.from,created_at:new Date(now-86400e3*(3+i*2)).toISOString(),updated_at:new Date().toISOString()});
    if(i<2){var v='v'+i,t0=now.getTime()-3600e3*(i*20+2);[['open',{dev:i?'computer':'phone'}],['package',{name:'Growth'}],['package',{name:'Scale'}],['breakdown',{}],['addon',{name:'Content day',on:true}],['pdf',{}],['time',{s:340+i*120,scroll:96}]].forEach(function(x,j){QE.push({id:uid(),quote_id:id,kind:x[0],detail:x[1],visit:v,at:new Date(t0+j*55e3).toISOString()});});}});
  localStorage.setItem('hl_quo_v1',JSON.stringify(Q));localStorage.setItem('hl_qev_v1',JSON.stringify(QE));

  // settings and flags so the demo opens straight into the hub
  localStorage.setItem('hl_pipe_goal','8000');localStorage.setItem('hl_me','sam');localStorage.setItem('hl_tour_v4','1');localStorage.setItem('hl_intro_'+TODAY,'1');localStorage.setItem('hl_seen_ver','99');localStorage.setItem('hl_cmp_44','1');
  localStorage.setItem('hl_demo_seed',SEED_V);
})();
if(!/#pipeline/.test(location.hash))try{history.replaceState(null,'',location.pathname+location.search+'#pipeline');}catch(e){location.hash='#pipeline';}
