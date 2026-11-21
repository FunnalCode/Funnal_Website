shell=open('shell.html').read();css=open('style.css').read();mark=open('mark.txt').read().strip()
js='\n'.join(open(f).read() for f in ['data.js','data2.js','data3.js','engine.js','art_head.js','art_pets.js','decor_part.js','art_tail.js','art_v6.js','art_v6b.js','ui.js','ui_ship.js','ui_ledger.js','ui_v4.js','ui_v5.js','ui_v6.js','fish.js','fish2.js','cosmo.js','v9.js','v10.js','v11.js','coop.js','lockin.js','wardrobe.js','v15.js','fit.js','theme.js','season.js','winter.js','xmas.js','bosskit.js','herald.js','xmas2.js','whatsnew.js','roster.js','loot.js','gary.js','market.js','tavern.js','tavern_games.js','tavern_music.js','tavern_scene.js','tavern_h2h.js','events.js','records.js','treasure.js','rewards.js','cove.js','atmos.js','hideout_art.js','art_scenery.js','voyage_envs.js','voyage_sound.js','supa.js','boot.js'])
content=open('content.js').read()
js=js.replace("const fn=SCREENS[S.screen]||SCREENS.harbour;","const fn=S.me?(SCREENS[S.screen]||SCREENS.harbour):SCREENS.harbour;")
open('index.html','w').write(shell.replace('__MARK__',mark).replace('/*__CSS__*/',css).replace('/*__JS__*/',content+'\n'+js))

# ---------- Webflow embed build: one JS file that mounts the whole game into the page ----------
import re,json
body=shell.split('<body>')[1].split('<script>')[0].replace('__MARK__',mark)
embed_js = """(function(){
Array.prototype.forEach.call(document.querySelectorAll('link[rel="stylesheet"],style'),function(x){try{x.disabled=true;x.media='not all';x.setAttribute('data-hl-off','1');}catch(e){}});
var f=document.createElement('link');f.rel='stylesheet';f.href='https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800&display=swap';document.head.appendChild(f);
var st=document.createElement('style');st.textContent=%s;document.head.appendChild(st);
document.documentElement.classList.add('hl-host');
var host=document.getElementById('hl-root')||document.body;
var wrap=document.createElement('div');wrap.id='hl-wrap';wrap.innerHTML=%s;
document.body.innerHTML='';document.body.appendChild(wrap);
})();
""" % (json.dumps(css+"\nhtml.hl-host,html.hl-host body{height:100%;margin:0;overflow:hidden;background:#F5EFDF}#hl-wrap{height:100%}#hl-wrap,#gate,#modal,#toasts,#focus{color:#3F5160;font:600 15px/1.45 Nunito,'Trebuchet MS',system-ui,sans-serif;letter-spacing:normal;text-transform:none}#hl-wrap h1,#hl-wrap h2,#hl-wrap h3,#gate h1,#modal h1,#modal h2,#modal h3,.banner h1{color:inherit;font-family:Fredoka,Nunito,sans-serif;font-weight:600;line-height:1.2;margin:0;letter-spacing:.005em}.banner h1{color:#E06034}#hl-wrap p,#gate p,#modal p{margin-bottom:0}#hl-wrap label,#gate label,#modal label{margin-bottom:0}#hl-wrap a,#modal a{text-decoration:none}#hl-wrap img{max-width:100%}#hl-wrap canvas,#modal canvas,#focus canvas{max-width:none;max-height:none}#hl-wrap *,#gate *,#modal *{box-sizing:border-box}"), json.dumps(body))
js_host=re.sub(r"const PASS=\{[^}]*\};","const PASS={sam:'',james:''};",js)
assert js_host!=js
open('hl-game.js','w').write(embed_js+js_host)
# make the embed file pure ASCII so it renders right whatever charset the host serves it with
s=open('hl-game.js',encoding='utf-8').read()
s=''.join(ch if ord(ch)<128 else ('\\u%04x'%ord(ch) if ord(ch)<0x10000 else ''.join('\\u%04x'%u for u in __import__('struct').unpack('<2H',ch.encode('utf-16-le')))) for ch in s)
open('hl-game.js','w',encoding='ascii').write(s)

# content registry ships as its own small file, loaded before hl-game.js
cs=''.join(ch if ord(ch)<128 else ('\\u%04x'%ord(ch)) for ch in content)
open('hl-content.js','w',encoding='ascii').write(cs)
