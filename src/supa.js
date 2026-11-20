/* ============================== SUPABASE STORE (used when hosted on funnal.co.uk) ============================== */
// Mirrors the small slice of the artifact db API the game uses: doc().get/set/update/delete/acquire/onSnapshot, collection().doc/onSnapshot.
// login emails live in the page's HL_SUPABASE config (Webflow footer), not in this public bundle
const HL_EMAIL=(typeof window!=='undefined'&&window.HL_SUPABASE&&window.HL_SUPABASE.emails)||{};
function makeSupaDB(sb){
  const cache=new Map();const subs=new Set();let ready=false;let pend=false;
  const notify=()=>{if(pend)return;pend=true;setTimeout(()=>{pend=false;for(const f of subs)f();},0);};
  const clone=o=>JSON.parse(JSON.stringify(o));
  const merge=(a,b)=>{for(const k in b){const v=b[k];if(v&&typeof v==='object'&&v.__delete__===true)delete a[k];else if(v&&typeof v==='object'&&!Array.isArray(v))a[k]=merge(a[k]&&typeof a[k]==='object'&&!Array.isArray(a[k])?a[k]:{},v);else a[k]=v;}return a;};
  const collOf=p=>p.split('/').slice(0,-1).join('/');
  const err=(e)=>{const m=(e&&(e.message||e.details))||'error';if(/not_found|P0002/.test(m+(e&&e.code)))return{code:'invalid_argument',message:'Document does not exist'};if(/JWT|auth|permission|policy|401|403/i.test(m))return{code:'revoked',message:m};return{code:'unavailable',message:m};};
  async function loadAll(){const rows=[];for(let from=0;;from+=1000){const {data,error}=await sb.from('hl_docs').select('path,data').range(from,from+999);if(error)throw err(error);rows.push(...data);if(data.length<1000)break;}
    cache.clear();rows.forEach(r=>cache.set(r.path,r.data));ready=true;notify();}
  const start=loadAll().catch(e=>{console.warn(e);ready=true;notify();});
  sb.channel('hl-docs').on('postgres_changes',{event:'*',schema:'public',table:'hl_docs'},p=>{if(p.eventType==='DELETE'){if(p.old&&p.old.path)cache.delete(p.old.path);}else if(p.new&&p.new.path)cache.set(p.new.path,p.new.data);notify();}).subscribe(st=>{if(st==='SUBSCRIBED'&&ready)loadAll().catch(()=>{});});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&ready)loadAll().catch(()=>{});});
  const snap=p=>({id:p.split('/').pop(),exists:cache.has(p),data:()=>cache.get(p),metadata:{fromCache:!ready,hasPendingWrites:false}});
  function doc(path){return{id:path.split('/').pop(),path,
    async get(){await start;if(!cache.has(path)){const {data}=await sb.from('hl_docs').select('data').eq('path',path).maybeSingle();if(data)cache.set(path,data.data);}return snap(path);},
    async set(d){const v=clone(d);const prev=cache.get(path);cache.set(path,v);notify();const {error}=await sb.from('hl_docs').upsert({path,coll:collOf(path),data:v,updated_at:new Date().toISOString()});if(error){if(prev===undefined)cache.delete(path);else cache.set(path,prev);notify();throw err(error);}},
    async update(d){const v=clone(d);if(cache.has(path)){cache.set(path,merge(clone(cache.get(path)),v));notify();}const {error}=await sb.rpc('hl_update',{p_path:path,p_patch:v});if(error){throw err(error);}},
    async delete(){cache.delete(path);notify();const {error}=await sb.from('hl_docs').delete().eq('path',path);if(error)throw err(error);},
    async acquire(o){const {data,error}=await sb.rpc('hl_acquire',{p_path:path,p_holder:String(o.holder),p_ttl_ms:Math.round(o.ttlMs||30000)});if(error)throw err(error);return data;},
    onSnapshot(next){const f=()=>{if(ready)next(snap(path));};subs.add(f);setTimeout(f,0);return()=>subs.delete(f);},
    collection(p){return collection(path+'/'+p);}};}
  function collection(cp){const n=cp.split('/').length;
    const snapC=()=>{const docs=[...cache.keys()].filter(p=>p.startsWith(cp+'/')&&p.split('/').length===n+1).sort().map(snap);return{docs,size:docs.length,empty:!docs.length,docChanges:()=>[],metadata:{fromCache:!ready,hasPendingWrites:false}};};
    return{path:cp,doc(id){return doc(cp+'/'+(id||uid()))},async get(){await start;return snapC();},onSnapshot(next){const f=()=>{if(ready)next(snapC());};subs.add(f);setTimeout(f,0);return()=>subs.delete(f);}};}
  return{doc,collection,supa:true};
}
// Password sign-in against Supabase Auth (real accounts) instead of the in-page hash check.
async function supaGate(sb){
  try{const {data}=await sb.auth.getSession();const em=data?.session?.user?.email;const pid=Object.keys(HL_EMAIL).find(p=>HL_EMAIL[p]===em)||(em&&['sam','james'].find(p=>em.toLowerCase().startsWith(p+'@')));if(pid)return{pid,uid:data.session.user.id};}catch(e){}
  return new Promise(resolve=>{
    let pick=null;
    document.body.insertAdjacentHTML('beforeend',`<div id="gate"><div class="gateCard">
      <svg class="gateMark" aria-hidden="true"><use href="#funnal"/></svg><h1>Hundred Cannons</h1><p class="muted">A Funnal pirate game · crew only. Landlubbers, kindly walk the plank.</p>
      <div class="gateWho">${['sam','james'].map(p=>`<button class="gWho" data-p="${p}" type="button"><span class="gAv" style="--c:${p==='sam'?'#E07A34':'#4A7EC2'}">${p==='sam'?'S':'J'}</span>${p==='sam'?'Sam':'James'}</button>`).join('')}</div>
      <form id="gateForm" autocomplete="on"><input type="email" id="gateEm" autocomplete="username" hidden><label class="f" for="gatePw">Password<input id="gatePw" type="password" autocomplete="current-password" placeholder="Pick your captain first" disabled></label>
      <button class="btn primary big" id="gateGo" type="submit" disabled>Board the ship</button></form>
      <small class="muted" id="gateMsg">Forgotten it? Ask the other captain, then act like you didn't.</small></div></div>`);
    const g=$('#gate');
    g.querySelectorAll('.gWho').forEach(b=>b.addEventListener('click',()=>{pick=b.dataset.p;$('#gateEm').value=HL_EMAIL[pick]||'';g.querySelectorAll('.gWho').forEach(x=>x.classList.toggle('on',x===b));const pw=$('#gatePw');pw.disabled=false;pw.placeholder=`${pick==='sam'?'Sam':'James'}'s password`;pw.focus();$('#gateGo').disabled=false;SND.pop();}));
    $('#gateForm').addEventListener('submit',async e=>{e.preventDefault();if(!pick)return;$('#gateGo').disabled=true;
      const {data,error}=await sb.auth.signInWithPassword({email:HL_EMAIL[pick],password:$('#gatePw').value.trim()});$('#gateGo').disabled=false;
      if(!error&&data?.user){SND.success();g.classList.add('out');setTimeout(()=>{g.remove();resolve({pid:pick,uid:data.user.id});},420);}
      else{SND.err();const c=g.querySelector('.gateCard');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');$('#gatePw').value='';$('#gatePw').placeholder=/fetch|network/i.test(error?.message||'')?'No connection. Check your internet.':WRONG_PW[Math.floor(Math.random()*WRONG_PW.length)];}});
  });
}
