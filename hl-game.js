(function(){
var f=document.createElement('link');f.rel='stylesheet';f.href='https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800&display=swap';document.head.appendChild(f);
var st=document.createElement('style');st.textContent="/* Hundred Lanterns by Funnal \u2014 a sunny island-life look: cream paper, rounded bubbly cards, chunky soft buttons.\n   Layout: slim HUD, scrolling scene + cards, a floating action dock above a pill tab bar. Single bright theme by choice. */\n:root{\n  --bg:#F5EFDF; --dot:#EADFC4; --card:#FFFCF4; --card2:#FBF5E6; --line:#EADFC6; --shadow:#E2D5B6;\n  --ink:#3F5160; --muted:#7F8A95; --soft:#A9B2BA;\n  --gold:#DDA94D; --bracken:#E06034; --rowan:#C91E36; --res:#486790; --mint:#5DBE9C; --sky:#7CC7E6; --leaf:#8CC665;\n  --sam:#E07A34; --james:#4A7EC2; --good:#3FA57E; --bad:#D9485F;\n  --r-common:#9AA3AE; --r-uncommon:#45B07C; --r-rare:#3E8DDB; --r-epic:#9B5DE5; --r-legendary:#D99A17; --r-mythic:#E0457B; --r-transcendent:#3F5160;\n  --display:\"Fredoka\",\"Nunito\",\"Trebuchet MS\",system-ui,sans-serif;\n  --body:\"Nunito\",\"Trebuchet MS\",system-ui,sans-serif;\n  --radius:22px;\n  color-scheme:light;\n}\n*{box-sizing:border-box}\nhtml,body{height:100%;margin:0}\nbody{background:var(--bg);color:var(--ink);font:600 15px/1.45 var(--body);-webkit-tap-highlight-color:transparent;overflow:hidden}\nbutton{font:inherit;color:inherit;cursor:pointer}\nbutton:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid var(--sky);outline-offset:2px}\nh1,h2,h3{font-family:var(--display);font-weight:600;margin:0;text-wrap:balance;letter-spacing:.005em}\nh2{font-size:21px} h3{font-size:17px}\nsmall{color:var(--muted);font-weight:600}\n.num{font-variant-numeric:tabular-nums}\n#app{height:100%;display:grid;grid-template-rows:auto auto 1fr auto auto;max-width:760px;margin:0 auto;position:relative;\n  background:radial-gradient(circle at 1px 1px,var(--dot) 1.6px,transparent 1.8px) 0 0/18px 18px,var(--bg)}\nsvg{fill:currentColor}\n\n/* HUD */\n#hud{display:grid;grid-template-columns:1fr auto;gap:6px 10px;align-items:center;padding:10px 14px 8px;background:var(--card);border-radius:0 0 26px 26px;box-shadow:0 3px 0 var(--shadow);position:relative;z-index:2}\n.brand{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--ink);min-width:0}\n.brand .mark{width:30px;height:30px;color:var(--ink);flex:none}\n.brand span{display:flex;flex-direction:column;line-height:1.05;min-width:0}\n.brand b{font:600 18px var(--display);white-space:nowrap}\n.brand small{font-size:11px;color:var(--gold);font-weight:800;letter-spacing:.04em;text-transform:uppercase}\n.hudRight{display:flex;gap:8px;align-items:center}\n.glow{display:flex;align-items:center;gap:6px;font:600 16px var(--display);background:#FFF4DA;border:0;border-radius:99px;padding:5px 12px 5px 9px;box-shadow:inset 0 0 0 2px #F3DFAF}\n.gem{width:15px;height:15px;background:var(--gold);border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:inline-block;box-shadow:inset -2px 2px 0 #F2CF86}\n.who{width:40px;height:40px;border-radius:50%;border:0;padding:0;background:none}\n.av{display:block;width:40px;height:40px;border-radius:50%;background:#E9F5FB center/cover;box-shadow:0 0 0 3px var(--sam)}\n.lvlRow{grid-column:1/-1;display:flex;align-items:center;gap:8px;min-width:0}\n.lvlBadge{font:600 13px var(--display);background:var(--ink);color:#fff;border-radius:99px;padding:2px 9px;white-space:nowrap}\n.xpbar{flex:1;min-width:60px;height:10px;background:#EFE7D3;border-radius:99px;overflow:hidden}\n.xpbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--mint),#8FDCBF);border-radius:99px;transition:width .5s}\n.xpTxt{font-size:11px;color:var(--muted);white-space:nowrap}\n.whoTxt{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:40%}\n.whoTxt b{font-family:var(--display);font-weight:600}\n.sync{font-size:12px;text-align:center;padding:4px 10px;margin:6px 14px 0;background:#FFF0C9;border-radius:99px;color:#7A5A17}\n#screen{overflow-y:auto;overflow-x:hidden;padding:0 0 14px;outline:none;scrollbar-width:none}\n#screen::-webkit-scrollbar{display:none}\n.pad{padding:12px 14px;display:grid;gap:12px;grid-template-columns:minmax(0,1fr)}\n.pad>*{min-width:0}\ncanvas.scene{width:calc(100% - 28px);margin:12px 14px 0;display:block;aspect-ratio:16/9;border-radius:var(--radius);background:#9BD9F0;box-shadow:0 4px 0 var(--shadow)}\n.card{background:var(--card);border-radius:var(--radius);padding:14px 16px;box-shadow:0 4px 0 var(--shadow)}\n.card.flat{box-shadow:inset 0 0 0 2px var(--line)}\n.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}\n.between{justify-content:space-between}\n.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}\n.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:8px}\n.pill{display:inline-flex;align-items:center;gap:5px;font-size:12px;padding:3px 10px;border-radius:99px;background:var(--card2);box-shadow:inset 0 0 0 2px var(--line);font-weight:700}\n.btn{background:var(--card);border:0;border-radius:99px;padding:9px 16px;font:600 14px var(--display);box-shadow:0 3px 0 var(--shadow),inset 0 0 0 2px var(--line);transition:transform .08s}\n.btn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--shadow),inset 0 0 0 2px var(--line)}\n.btn.primary{background:var(--gold);color:#fff;box-shadow:0 3px 0 #B8862E}\n.btn.ghost{background:transparent;box-shadow:inset 0 0 0 2px var(--line)}\n.btn:disabled{opacity:.45;cursor:not-allowed}\n.btn.sm{padding:6px 12px;font-size:13px}\n.muted{color:var(--muted)}\n.tiny{font-size:12px}\ninput,select{background:#fff;color:var(--ink);border:0;box-shadow:inset 0 0 0 2px var(--line);border-radius:14px;padding:8px 12px;font:inherit;min-width:0}\ninput[type=checkbox]{accent-color:var(--mint);width:18px;height:18px;box-shadow:none}\nlabel.f{display:grid;gap:4px;font-size:13px;color:var(--muted)}\n.seg{display:flex;background:#EFE6D0;border-radius:99px;padding:4px;gap:4px;flex-wrap:wrap}\n.seg button{flex:1;background:none;border:0;padding:7px 10px;border-radius:99px;font:600 13px var(--display);color:var(--muted);white-space:nowrap}\n.seg button.on{background:var(--card);color:var(--ink);box-shadow:0 2px 0 var(--shadow)}\n\n/* Boss / mission */\n.mission{display:grid;gap:10px}\n.bossTop{display:flex;justify-content:space-between;align-items:flex-end;gap:8px;flex-wrap:wrap}\n.bossName{font:600 20px var(--display)}\n.bossName.rare{color:var(--r-legendary)}\n.score{font:600 30px/1 var(--display)}\n.score small{font-size:16px}\n.hp{height:22px;background:#EFE6D0;border-radius:99px;position:relative;overflow:hidden;display:flex;box-shadow:inset 0 2px 0 #E2D7BD}\n.hp i{display:block;height:100%;transition:width .4s}\n.hp .s{background:var(--sam)} .hp .j{background:var(--james)}\n.hp .x{background:transparent}\n.hp span{position:absolute;inset:0;text-align:center;font:600 12px/22px var(--display);color:var(--ink);text-shadow:0 0 4px #fff,0 0 2px #fff}\n.ticks{position:relative;height:12px;font-size:10px;color:var(--soft)}\n.ticks b{position:absolute;transform:translateX(-50%);font-weight:700}\n.contrib{display:flex;gap:14px;flex-wrap:wrap;font-size:14px;align-items:center}\n.dot{width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:5px;vertical-align:middle}\n.speech{background:#FFF8E6;border-radius:20px;padding:10px 14px;font-size:14px;position:relative;box-shadow:inset 0 0 0 2px #F1E2BC}\n.speech .who2{position:absolute;top:-12px;left:14px;background:var(--gold);color:#fff;font:600 12px var(--display);padding:2px 10px;border-radius:99px;transform:rotate(-3deg)}\n.speech.withName{margin-top:6px;padding-top:14px}\n.remind{position:relative;background:var(--card);border-radius:var(--radius);padding:18px 14px 12px;box-shadow:0 4px 0 var(--shadow);display:flex;gap:10px;align-items:center;margin-top:6px}\n.remind .name{position:absolute;top:-10px;left:16px;background:var(--sky);color:#fff;font:600 12px var(--display);padding:2px 12px;border-radius:99px;transform:rotate(-2deg)}\n.remind .gull{flex:none;width:34px;height:34px}\n.remind>div{flex:1}\n.stat{background:var(--card2);border-radius:16px;padding:9px 11px;box-shadow:inset 0 0 0 2px var(--line)}\n.stat b{display:block;font:600 21px var(--display)}\n.stat small{font-size:11px}\n.twist{display:flex;gap:8px;align-items:center;background:#E9F6F0;border-radius:16px;padding:8px 12px;font-size:13px}\n.twist b{font-family:var(--display);font-weight:600;color:#2E8466}\n\n/* Action dock */\n#actions{background:var(--card);border-radius:26px 26px 0 0;box-shadow:0 -3px 0 var(--shadow);padding:10px 12px 8px;display:grid;gap:9px;position:relative;z-index:2}\n.smallBtns{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}\n.act{background:none;border:0;display:flex;flex-direction:column;align-items:center;gap:3px;font:600 12px var(--display);color:var(--ink);padding:0}\n.act .ico{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;box-shadow:0 3px 0 rgba(0,0,0,.12);transition:transform .1s}\n.act .ico svg{width:22px;height:22px;fill:#fff}\n.c-r{background:var(--sky)} .c-v{background:#9B7FD9} .c-m{background:var(--mint)} .c-c{background:linear-gradient(145deg,#F2C462,var(--gold))}\n.act:active .ico{transform:translateY(3px) scale(.95);box-shadow:none}\n.act.busy .ico{opacity:.5}\n.dmRow{display:grid;grid-template-columns:48px 1fr 54px;gap:10px;align-items:center}\n.undo{width:48px;height:48px;border-radius:50%;border:0;background:var(--card2);box-shadow:0 3px 0 var(--shadow),inset 0 0 0 2px var(--line);display:grid;place-items:center;color:var(--muted)}\n.undo svg{width:22px;height:22px}\n.undo:active{transform:translateY(2px)}\n.todayMini{text-align:center;line-height:1}\n.todayMini b{font:600 26px var(--display);display:block;color:var(--bracken)}\n.todayMini small{font-size:11px}\n.dm{position:relative;height:66px;border:0;border-radius:99px;background:linear-gradient(180deg,#F08A4F,var(--bracken));color:#fff;display:flex;align-items:center;justify-content:center;gap:12px;box-shadow:0 5px 0 #B24622;transition:filter .2s,transform .08s;overflow:hidden}\n.dm:before{content:\"\";position:absolute;left:18px;right:18px;top:6px;height:14px;border-radius:99px;background:rgba(255,255,255,.22)}\n.dm:active{transform:translateY(4px);box-shadow:0 1px 0 #B24622}\n.dm b{font:600 25px/1 var(--display);letter-spacing:.01em}\n.dmLabel{display:flex;flex-direction:column;align-items:flex-start;position:relative}\n.dmLabel small{color:#FFE3D2;font-size:12px}\n.dmIcon{width:40px;height:40px;border-radius:50%;background:#fff;display:grid;place-items:center;position:relative;z-index:1}\n.dmIcon .mk{width:22px;height:22px;fill:var(--bracken)}\n.dm .ring{position:absolute;left:-6px;top:-6px;width:52px;height:52px;transform:rotate(-90deg);pointer-events:none}\n.ring circle{fill:none;stroke-width:8}\n.ring .track{stroke:transparent}\n.ring .prog{stroke:#fff;stroke-dasharray:277;stroke-dashoffset:277;stroke-linecap:round}\n.dm.cooling{filter:saturate(.35) brightness(.98)}\n.dm.cooling .dmIcon .mk{animation:reload .9s ease-in-out infinite}\n@keyframes reload{50%{transform:rotate(-14deg) scale(.92)}}\n.dm.shake{animation:shake .35s}\n@keyframes shake{25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}\n\n/* Tabs */\n#tabs{display:grid;grid-template-columns:repeat(5,1fr);background:var(--card);padding:4px 8px calc(6px + env(safe-area-inset-bottom));gap:4px;border-top:2px solid var(--line)}\n#tabs a{color:var(--soft);text-decoration:none;font:600 11px var(--display);display:flex;flex-direction:column;align-items:center;gap:1px;padding:6px 0;border-radius:16px}\n#tabs a svg{width:22px;height:22px}\n#tabs a.on{color:var(--ink);background:#FFF1CC}\n\n/* FX */\n#fx{position:fixed;inset:0;pointer-events:none;z-index:40;overflow:hidden}\n.float{position:absolute;font:600 17px var(--display);color:var(--mint);text-shadow:0 2px 0 #fff;animation:floatUp .9s ease-out forwards;white-space:nowrap}\n@keyframes floatUp{to{transform:translateY(-70px);opacity:0}}\n.coin{position:absolute;width:13px;height:13px;background:var(--gold);border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 0 0 2px #fff}\n#fireworks{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:45;display:none}\n#toasts{position:fixed;top:64px;left:50%;transform:translateX(-50%);display:grid;gap:8px;z-index:60;width:min(92vw,420px);pointer-events:none}\n.toast{background:var(--card);border-radius:20px;padding:10px 16px;box-shadow:0 4px 0 var(--shadow),0 10px 24px rgba(63,81,96,.18);animation:tin .3s cubic-bezier(.3,1.6,.6,1);pointer-events:auto;border-left:6px solid var(--mint)}\n.toast b{font-family:var(--display);font-weight:600}\n.toast.joke{border-left-color:var(--bracken)}\n@keyframes tin{from{transform:translateY(-14px) scale(.96);opacity:0}}\n.banner{position:fixed;left:50%;top:36%;transform:translate(-50%,-50%);z-index:55;text-align:center;pointer-events:none;animation:bannerIn 2.6s forwards;background:var(--card);padding:18px 30px 16px;border-radius:30px;box-shadow:0 6px 0 var(--shadow),0 20px 50px rgba(63,81,96,.25);min-width:min(80vw,300px)}\n.banner h1{font-size:clamp(26px,7vw,40px);color:var(--bracken);line-height:1.05}\n.banner p{margin:4px 0 0;font:600 15px var(--display);color:var(--muted)}\n@keyframes bannerIn{0%{transform:translate(-50%,-50%) scale(.4);opacity:0}12%{transform:translate(-50%,-50%) scale(1.06);opacity:1}20%{transform:translate(-50%,-50%) scale(1)}85%{opacity:1}100%{opacity:0;transform:translate(-50%,-56%)}}\n#modal{position:fixed;inset:0;background:rgba(63,81,96,.42);z-index:70;display:grid;place-items:center;padding:16px;backdrop-filter:blur(3px)}\n#modal[hidden]{display:none}\n.sheet{background:var(--card);border-radius:28px;max-width:520px;width:100%;max-height:88vh;overflow:auto;padding:20px;display:grid;gap:12px;box-shadow:0 6px 0 var(--shadow);animation:tin .3s cubic-bezier(.3,1.5,.6,1)}\n\n/* Achievements */\n.achGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}\n.ach{--rc:var(--r-common);background:var(--card);border:0;border-radius:20px;padding:12px;display:grid;gap:5px;position:relative;text-align:left;box-shadow:0 3px 0 var(--shadow),inset 0 0 0 2px color-mix(in srgb,var(--rc) 30%,transparent);align-content:start}\n.ach.locked{opacity:.6;filter:grayscale(.7)}\n.ach .medal{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font:600 17px var(--display);color:#fff;background:var(--rc);box-shadow:0 3px 0 color-mix(in srgb,var(--rc) 70%,#000)}\n.ach.secret .medal{background:#CFC6B0;box-shadow:0 3px 0 #B5AC96}\n.ach b{font-family:var(--display);font-weight:600;font-size:15px;line-height:1.15}\n.ach small{font-size:11.5px;line-height:1.3}\n.ach .bar{height:6px;background:#EFE6D0;border-radius:99px;overflow:hidden}\n.ach .bar i{display:block;height:100%;background:var(--rc);border-radius:99px}\n.r-uncommon{--rc:var(--r-uncommon)}.r-rare{--rc:var(--r-rare)}.r-epic{--rc:var(--r-epic)}.r-legendary{--rc:var(--r-legendary)}.r-mythic{--rc:var(--r-mythic)}.r-transcendent{--rc:var(--r-transcendent)}\n.ach.r-legendary:not(.locked) .medal,.ach.r-mythic:not(.locked) .medal{animation:pulse 2.2s infinite}\n.ach.r-transcendent:not(.locked) .medal{background:conic-gradient(#E0457B,#DDA94D,#45B07C,#3E8DDB,#9B5DE5,#E0457B);animation:spin 6s linear infinite}\n@keyframes pulse{50%{box-shadow:0 3px 0 color-mix(in srgb,var(--rc) 70%,#000),0 0 0 6px color-mix(in srgb,var(--rc) 25%,transparent)}}\n@keyframes spin{to{filter:hue-rotate(360deg)}}\n.rtag{font:600 10px var(--display);text-transform:uppercase;letter-spacing:.08em;color:var(--rc)}\n.tier{font:600 10px var(--display);background:var(--card2);border-radius:99px;padding:1px 7px;justify-self:start;box-shadow:inset 0 0 0 1.5px var(--line)}\n\n/* Lists */\n.list{display:grid;gap:8px}\n.li{display:flex;gap:10px;align-items:center;background:var(--card2);border-radius:18px;padding:10px 12px;box-shadow:inset 0 0 0 2px var(--line)}\n.li .grow{flex:1;min-width:0}\n.prog{height:9px;background:#EFE6D0;border-radius:99px;overflow:hidden;margin-top:5px}\n.prog i{display:block;height:100%;background:var(--gold);border-radius:99px}\n.prog.team i{background:linear-gradient(90deg,var(--sam),var(--james))}\n.done{color:var(--good)}\n.shopItem{display:grid;gap:6px;background:var(--card);border-radius:20px;padding:10px;text-align:center;box-shadow:0 3px 0 var(--shadow);align-content:start}\n.shopItem canvas{width:72px;height:72px;justify-self:center;background:#E7F5EC;border-radius:50%}\n.price{font-family:var(--display);font-weight:600}\n.appGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 10px;padding:6px 0}\n.appGrid a{display:flex;flex-direction:column;align-items:center;gap:6px;text-decoration:none;color:var(--ink);font:600 13px var(--display);text-align:center}\n.appGrid .appIco{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;box-shadow:0 4px 0 rgba(0,0,0,.13);transition:transform .15s}\n.appGrid a:active .appIco{transform:scale(.92)}\n.appGrid .appIco svg{width:30px;height:30px;fill:#fff}\n.appGrid small{font:600 11px var(--body);color:var(--muted);margin-top:-4px}\n.phone{background:var(--card);border-radius:30px;padding:18px 14px;box-shadow:0 4px 0 var(--shadow)}\n.paper{background:#FFFBF0;color:#3F3A30;border-radius:var(--radius);padding:16px;box-shadow:0 4px 0 var(--shadow);font-family:Georgia,\"Times New Roman\",serif;display:grid;gap:10px;background-image:repeating-linear-gradient(transparent 0 27px,#F3EBD6 27px 28px)}\n.paper .mast{text-align:center;border-bottom:3px double #3F3A30;padding-bottom:6px}\n.paper .mast h1{font:600 26px var(--display);letter-spacing:.04em}\n.paper .head{font:700 21px/1.15 Georgia,serif;text-transform:uppercase;text-wrap:balance}\n.paper .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;font-size:14px}\n.paper h3{font:700 15px Georgia,serif;border-bottom:1px solid #3F3A30;margin-bottom:4px}\n.podium{display:flex;align-items:flex-end;justify-content:center;gap:10px;height:150px}\n.podium div{width:96px;border-radius:20px 20px 6px 6px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:8px;font-family:var(--display);font-weight:600;box-shadow:0 4px 0 var(--shadow)}\n.wheelWrap{display:grid;place-items:center;position:relative}\n.wheelWrap canvas{width:min(78vw,300px);height:min(78vw,300px)}\n.wheelWrap .pin{position:absolute;top:-6px;width:0;height:0;border:13px solid transparent;border-top:22px solid var(--ink);z-index:1}\ntable.lb{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}\ntable.lb td,table.lb th{padding:7px 4px;text-align:right;border-bottom:2px solid var(--line)}\ntable.lb tr:last-child td{border-bottom:0}\ntable.lb td:first-child,table.lb th:first-child{text-align:left}\ntable.lb th{font:600 12px var(--display);color:var(--muted)}\n.chart{width:100%;overflow-x:auto}\n.timer{font:600 60px/1 var(--display);text-align:center;font-variant-numeric:tabular-nums}\n.crown{color:var(--gold)}\n.collect{width:42px;height:42px;border-radius:50%;background:#E7F5EC}\n@media (min-width:700px){.dm{height:74px}.act .ico{width:52px;height:52px}}\n@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition:none!important}}\n\n/* ---------- v3 polish ---------- */\n.gem{border-radius:50%;transform:none;background:radial-gradient(circle at 35% 35%,#FBE3A0,#E2AE45 60%,#C98F28);box-shadow:inset 0 0 0 1.5px #C98F28}\n.cn{display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;background:radial-gradient(circle at 35% 35%,#FBE3A0,#E2AE45 60%,#C98F28);box-shadow:inset 0 0 0 1.5px #C98F28}\n#screen>*{animation:enter .28s cubic-bezier(.2,.9,.3,1.1)}\n@keyframes enter{from{opacity:0;transform:translateY(8px)}}\n.hero{background:linear-gradient(160deg,#FFFCF4 40%,#FFF1D6)}\n.chips{display:flex;gap:6px;overflow-x:auto;padding:10px 2px 6px;scrollbar-width:none}\n.chips::-webkit-scrollbar{display:none}\n.chip{flex:none;border:0;border-radius:99px;padding:7px 13px;font:600 13px var(--display);background:var(--card2);box-shadow:inset 0 0 0 2px var(--line);color:var(--muted)}\n.chip.on{background:var(--ink);color:#fff;box-shadow:0 3px 0 #2A3742}\n.wardrobe{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px;margin-top:8px}\n.ward{border:0;background:var(--card2);border-radius:18px;padding:8px 6px;display:grid;justify-items:center;gap:4px;font:600 11.5px/1.2 var(--display);box-shadow:inset 0 0 0 2px var(--line);transition:transform .12s}\n.ward:active{transform:scale(.95)}\n.ward.on{background:#FFF1CC;box-shadow:inset 0 0 0 3px var(--gold)}\ncanvas.icon{flex:none;aspect-ratio:1;max-width:none;min-width:0;box-sizing:content-box;width:60px;height:60px;border-radius:50%;background:#E7F5EC}\ncanvas.icon.sm{width:40px;height:40px;flex:none}\n.shopItem canvas.icon{width:76px;height:76px}\n.slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;margin:8px 0 4px}\n.slot{border:2px dashed var(--line);background:transparent;border-radius:18px;min-height:86px;display:grid;place-items:center;padding:6px;gap:2px}\n.slot.full{border-style:solid;background:var(--card2)}\n.slot small{font-size:10.5px;text-align:center;line-height:1.15}\n.nextReward{display:flex;align-items:center;gap:12px;margin-top:12px;padding:10px 12px;border-radius:18px;background:#FFF6E0;text-decoration:none;color:var(--ink);box-shadow:inset 0 0 0 2px #F3DFAF}\n.nextReward>div{flex:1;min-width:0}\n.nextReward b{font-family:var(--display);font-weight:600}\n.nextReward canvas.icon{width:48px;height:48px;flex:none}\n.chev{font:600 26px var(--display);color:var(--soft)}\n.appIco.sm{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;flex:none}\n.appIco.sm svg{width:22px;height:22px;fill:#fff}\n.shopItem{position:relative}\n.shopItem b{font:600 13px/1.2 var(--display)}\n.shopItem.locked canvas{filter:grayscale(.85) opacity(.6)}\n.lockTxt{font-size:11px}\n.ribbon{position:absolute;top:8px;right:-4px;background:var(--bracken);color:#fff;font:600 10px var(--display);padding:2px 8px;border-radius:99px 0 0 99px;box-shadow:0 2px 0 #B24622}\n.barge{background:linear-gradient(160deg,#FFFCF4,#EAF5FB);box-shadow:0 4px 0 var(--shadow),inset 0 0 0 2px #CFE7F2}\n.track{display:grid;gap:0;position:relative;padding-left:4px}\n.tstep{display:flex;gap:12px;align-items:center;padding:8px 0;position:relative}\n.tstep:before{content:\"\";position:absolute;left:19px;top:0;bottom:0;width:4px;background:var(--line)}\n.tstep.got:before{background:var(--mint)}\n.tl{position:relative;z-index:1;width:42px;height:42px;flex:none;border-radius:50%;display:grid;place-items:center;font:600 15px var(--display);background:var(--card);box-shadow:0 3px 0 var(--shadow),inset 0 0 0 2px var(--line)}\n.tstep.got .tl{background:var(--mint);color:#fff;box-shadow:0 3px 0 #3E9C7E}\n.tstep.next .tl{background:var(--gold);color:#fff;box-shadow:0 3px 0 #B8862E;animation:pulse 2s infinite;--rc:var(--gold)}\n.tbody{flex:1;background:var(--card);border-radius:18px;padding:9px 12px;box-shadow:0 3px 0 var(--shadow);display:grid;gap:6px}\n.tstep:not(.got) .tbody{opacity:.85}\n.tbody b{font-family:var(--display);font-weight:600}\n.crew{box-shadow:0 4px 0 var(--shadow),inset 0 0 0 3px #CDEBDD}\n.kdot{width:30px;height:30px;border-radius:50%;flex:none}\n.k-m.kdot,.k-m .kbig{background:var(--mint)} .k-c.kdot,.k-c .kbig{background:linear-gradient(145deg,#F2C462,var(--gold))}\n.sheetHead{display:flex;gap:12px;align-items:center}\n.kbig{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;flex:none;box-shadow:0 3px 0 rgba(0,0,0,.12)}\n.kbig svg{width:26px;height:26px;fill:#fff}\ninput.err{box-shadow:inset 0 0 0 2px var(--bad)}\n.hold{position:relative;overflow:hidden;border:0;border-radius:99px;height:58px;background:var(--ink);color:#fff;font:600 17px var(--display);box-shadow:0 4px 0 #2A3742;user-select:none;-webkit-user-select:none;touch-action:none}\n.hold i{position:absolute;inset:0 auto 0 0;width:0;background:linear-gradient(90deg,var(--mint),#8FDCBF)}\n.hold span{position:relative}\n.hold.holding i{width:100%;transition:width .95s linear}\n.hold.ok i{width:100%}\n.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}\n.kpi{background:var(--card);border-radius:18px;padding:10px 12px;box-shadow:0 3px 0 var(--shadow);display:grid;gap:1px}\n.kpi b{font:600 24px var(--display)}\n.kpi small{font-size:11.5px}\n.up{color:var(--good);font-weight:800}.down{color:var(--bad);font-weight:800}.flat{color:var(--soft)}\n.navrow{display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--card);border-radius:99px;padding:5px;box-shadow:0 3px 0 var(--shadow)}\n.navrow b{font:600 15px var(--display);flex:1;text-align:center}\n.navrow .btn{width:40px;height:36px;padding:0;font-size:20px}\ntable.lb tr.today td{background:#FFF6E0}\ntable.lb tr.tot td{font-weight:800;border-top:2px solid var(--ink)}\ntable.lb td{white-space:nowrap}\n.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-top:8px}\n.cal>span{text-align:center;font:600 11px var(--display);color:var(--muted)}\n.cal i{aspect-ratio:1;border-radius:12px;background:rgba(224,96,52,calc(var(--a,0)*.75 + .05));display:grid;place-items:center;align-content:center;font-style:normal;position:relative;box-shadow:inset 0 0 0 2px transparent}\n.cal i b{font:600 12px var(--display)}\n.cal i small{font-size:9.5px;color:var(--ink)}\n.cal i.hit{box-shadow:inset 0 0 0 2.5px var(--good)} .cal i.miss{box-shadow:inset 0 0 0 2.5px var(--bad)} .cal i.off{background:#EFE6D0;opacity:.6}\n.cal i.now{outline:3px solid var(--sky);outline-offset:1px}\n.heat{display:grid;grid-template-columns:30px repeat(14,1fr);gap:3px;margin:8px 0 4px;font-size:10px}\n.heat i{aspect-ratio:1;border-radius:5px;box-shadow:inset 0 0 0 1px var(--line)}\n.heat .hh{color:var(--muted);text-align:left}\n.heat .hd{color:var(--muted);font:600 11px var(--display);align-self:center}\n.funnel{display:grid;gap:8px;margin-top:8px}\n.fstep{display:grid;grid-template-columns:110px 1fr 54px 48px;gap:8px;align-items:center}\n.flab{font:600 13px var(--display)}\n.fbar{height:16px;background:#EFE6D0;border-radius:99px;overflow:hidden}\n.fbar i{display:block;height:100%;border-radius:99px}\n.fstep small{text-align:right}\n@media (max-width:420px){.fstep{grid-template-columns:86px 1fr 44px 42px}}\n\n.seg.mini{flex-wrap:nowrap;flex:none}\n.seg.mini button{flex:none;padding:6px 10px}\n.nextReward small{display:block}\n\n/* ---------- v4: events, pets, voyage, focus, sound, tooltips ---------- */\n.mute{width:36px;height:36px;border-radius:50%;border:0;background:var(--card2);box-shadow:inset 0 0 0 2px var(--line);display:grid;place-items:center;color:var(--ink)}\n.mute svg{width:20px;height:20px}.mute .x{display:none}.mute.off .x{display:block}.mute.off .w{display:none}.mute.off{color:var(--soft)}\n.bump{animation:bump .28s cubic-bezier(.3,1.8,.5,1)}\n@keyframes bump{40%{transform:scale(.93)}}\n.card,.shopItem,.ward,.petCard,.kpi,.li{transition:transform .15s,box-shadow .15s}\n@media (hover:hover){.shopItem:hover,.ward:hover,.petCard:not([disabled]):hover,.appGrid a:hover .appIco{transform:translateY(-2px)}}\n.pad>*{animation:enter .35s cubic-bezier(.2,.9,.3,1.1) both}\n.pad>*:nth-child(2){animation-delay:.03s}.pad>*:nth-child(3){animation-delay:.06s}.pad>*:nth-child(4){animation-delay:.09s}.pad>*:nth-child(5){animation-delay:.12s}.pad>*:nth-child(n+6){animation-delay:.15s}\n.xpbar i{position:relative;overflow:hidden}\n.xpbar i:after{content:\"\";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.55) 50%,transparent 70%);animation:shimmer 2.8s infinite}\n@keyframes shimmer{from{transform:translateX(-100%)}to{transform:translateX(100%)}}\n#tabs a.on svg{animation:hop .4s cubic-bezier(.3,1.8,.5,1)}\n@keyframes hop{40%{transform:translateY(-4px)}}\n#tip{position:fixed;z-index:80;background:var(--ink);color:#fff;border-radius:16px;padding:9px 12px;font-size:13px;line-height:1.35;transform:translateY(-100%);pointer-events:none;box-shadow:0 8px 22px rgba(63,81,96,.3);display:grid;gap:2px;animation:tin .18s}\n#tip b{font:600 14px var(--display);color:#FFE7A0}\n#tip.below{transform:translateY(34px)}\n.events{display:grid;gap:8px}\n.ev{display:flex;gap:10px;align-items:center;background:var(--card);border-radius:20px;padding:10px 12px;box-shadow:0 3px 0 var(--shadow);cursor:pointer}\n.ev .grow{flex:1;min-width:0;display:grid}\n.ev b{font:600 14.5px var(--display)}\n.ev small{font-size:12px}\n.ev .q{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--card2);box-shadow:inset 0 0 0 2px var(--line);font:600 13px var(--display);color:var(--muted);flex:none}\n.ev.live{animation:liveGlow 1.6s infinite}\n@keyframes liveGlow{50%{box-shadow:0 3px 0 var(--shadow),0 0 0 4px rgba(226,174,69,.35)}}\n.ev.gold.live{background:linear-gradient(120deg,#FFF6D8,#FFE7A0)}\n.sun{width:34px;height:34px;border-radius:50%;flex:none;background:radial-gradient(circle,#FFF3B8 35%,#F2C462 36%,#F2C462 55%,transparent 56%),repeating-conic-gradient(#F2C462 0 12deg,transparent 12deg 30deg);animation:spin 10s linear infinite}\n.emflag{position:relative;width:34px;height:34px;flex:none}\n.emflag i{position:absolute;left:4px;top:3px;width:2.5px;height:28px;background:#7A4E30;border-radius:2px}\n.emflag b{position:absolute;left:7px;top:4px;height:16px;min-width:22px;padding:0 4px;font:600 11px/16px var(--display);color:#fff;clip-path:polygon(0 0,100% 0,82% 50%,100% 100%,0 100%);animation:wave 1.4s ease-in-out infinite;transform-origin:left}\n.emflag.g0 b{background:#9AA3AE}.emflag.g1 b{background:#5DBE9C}.emflag.g2 b{background:#4A7EC2}.emflag.g3 b{background:#9B5DE5}.emflag.g4 b{background:#E2AE45;box-shadow:0 0 12px #E2AE45}\n@keyframes wave{50%{transform:skewY(-6deg) scaleX(.94)}}\ncanvas.petIco{width:52px;height:52px;border-radius:50%;background:#E7F5EC;flex:none}\ncanvas.petIco.big{width:140px;height:140px}\n.ev.pet{--rc:var(--r-common)}\n.ev.pet canvas{box-shadow:0 0 0 3px var(--rc)}\n.ev.pet .rtag{color:var(--rc)}\n.crewPill{display:flex;justify-content:space-between;align-items:center;gap:8px;border:0;background:var(--card);border-radius:99px;padding:9px 16px;font:600 13px var(--display);box-shadow:0 3px 0 var(--shadow);color:var(--muted)}\n.crewPill b{color:var(--bracken)}.crewPill span{color:var(--ink)}\n.petGrid,.petRow{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px;margin-top:8px}\n.petCard{--rc:var(--r-common);border:0;background:var(--card2);border-radius:18px;padding:10px 6px;display:grid;justify-items:center;gap:3px;box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--rc) 35%,var(--line));font:600 12px/1.2 var(--display);text-align:center}\n.petCard canvas{width:64px;height:64px}\n.petCard.on{background:#FFF1CC;box-shadow:inset 0 0 0 3px var(--gold)}\n.petCard.locked{opacity:.75}\n.petCard small{font:600 10.5px var(--body)}\n.petCard.r-legendary:not(.locked) canvas,.petCard.r-mythic:not(.locked) canvas{animation:pulse 2.2s infinite}\n.rates{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:4px 10px;margin-top:8px;font-size:12px}\n.rates span{display:flex;gap:6px;align-items:center}\n.reveal{display:grid;justify-items:center;text-align:center;gap:8px}\n.reveal canvas{animation:revealIn .7s cubic-bezier(.3,1.6,.5,1)}\n@keyframes revealIn{from{transform:scale(.2) rotate(-20deg);opacity:0}}\n.help summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between}\n.help summary:after{content:\"+\";font:600 20px var(--display);color:var(--muted)}\n.help[open] summary:after{content:\"\u2013\"}\n.help p{margin:8px 0 0}\n.tour{display:grid;gap:10px}\n.tourGlow{position:relative;z-index:75;box-shadow:0 0 0 6px rgba(255,231,160,.9),0 0 30px rgba(226,174,69,.8)!important;border-radius:22px}\n.diffs{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:4px}\n.diff{border:0;text-align:left;background:var(--card2);border-radius:18px;padding:10px 12px;display:grid;gap:2px;box-shadow:inset 0 0 0 2px var(--line)}\n.diff b{font:600 14px var(--display)}.diff small{font-size:11.5px}\n.diff.on{background:#FFF1CC;box-shadow:inset 0 0 0 3px var(--gold)}\n.vboss{display:grid;gap:4px}\n#focus{position:fixed;inset:0;z-index:90;background:#0d1a2a;display:grid;place-items:center;animation:tin .3s}\n#focus canvas{position:absolute;inset:0;width:100%;height:100%;border-radius:0;margin:0;box-shadow:none;aspect-ratio:auto}\n.fTop{position:absolute;top:calc(14px + env(safe-area-inset-top));left:14px;right:14px;display:flex;align-items:center;gap:10px}\n.fTimer{font:600 34px var(--display);color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.35);font-variant-numeric:tabular-nums}\n.fStat{flex:1;font:600 13px var(--display);color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.4)}\n.fExit{width:42px;height:42px;border-radius:50%;border:0;background:rgba(255,255,255,.85);font:600 18px var(--display)}\n.fDm{position:absolute;bottom:calc(28px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);border:0;border-radius:99px;padding:14px 34px 14px 18px;display:flex;align-items:center;gap:14px;background:linear-gradient(180deg,#F08A4F,var(--bracken));color:#fff;box-shadow:0 6px 0 #B24622,0 12px 30px rgba(0,0,0,.25);font-family:var(--display)}\n.fDm b{font-size:28px;font-weight:600}.fDm small{color:#FFE3D2;font-size:12px;position:absolute;bottom:-22px;left:0;right:0;text-align:center;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.4)}\n.fDm:active{transform:translate(-50%,4px);box-shadow:0 2px 0 #B24622}\n.fDm.cooling{filter:saturate(.4)}\n.fDm .dmIcon{position:relative}\n.chestAnim{position:relative;width:120px;height:96px}\n.chestAnim .box{position:absolute;left:10px;right:10px;bottom:6px;height:50px;border-radius:10px;background:linear-gradient(#B98552,#8A5A3A);box-shadow:inset 0 -6px 0 rgba(0,0,0,.15)}\n.chestAnim .box:after{content:\"\";position:absolute;left:50%;top:10px;width:12px;height:16px;margin-left:-6px;border-radius:3px;background:#F2C462}\n.chestAnim .lid{position:absolute;left:10px;right:10px;top:16px;height:30px;border-radius:30px 30px 6px 6px;background:linear-gradient(#C99560,#9A6B45);transform-origin:50% 100%;animation:lid .9s .2s cubic-bezier(.3,1.6,.5,1) forwards;z-index:2}\n.chestAnim .shine{position:absolute;left:30px;right:30px;top:20px;height:40px;border-radius:50%;background:radial-gradient(#FFF3B8,transparent 70%);opacity:0;animation:shine 1s .5s forwards}\n@keyframes lid{to{transform:translateY(-14px) rotate(-24deg)}}\n@keyframes shine{to{opacity:1;transform:scale(1.6)}}\n.ev.pet.r-uncommon{--rc:var(--r-uncommon)}.ev.pet.r-rare{--rc:var(--r-rare)}.ev.pet.r-epic{--rc:var(--r-epic)}.ev.pet.r-legendary{--rc:var(--r-legendary)}.ev.pet.r-mythic{--rc:var(--r-mythic)}\n\n.reveal .grid3{justify-self:stretch;width:100%}\n.fDm b{white-space:nowrap}\n.rates{grid-template-columns:repeat(auto-fit,minmax(170px,1fr))}\n.brand b{font-size:17px}\n@media (max-width:440px){.brand small{display:none}.brand b{font-size:16px}.mute{width:32px;height:32px}.glow{padding:4px 10px 4px 8px;font-size:15px}}\n\n/* ---------- v5 launch polish ---------- */\n#tabs{grid-template-columns:repeat(6,1fr)}\n#tabs a{font-size:10.5px}\n.dmIcon{display:grid;place-items:center}\n.dmIcon .ring{position:absolute;left:-6px;top:-6px;width:52px;height:52px;transform:rotate(-90deg);pointer-events:none}\n.fDm .dmIcon{width:46px;height:46px;flex:none}\n.fDm .dmIcon .mk{width:26px;height:26px;fill:var(--bracken)}\n.fDm .dmIcon .ring{left:-6px;top:-6px;width:58px;height:58px}\n.fDm .ring .prog{stroke:#fff}\n/* hover + press life on every control */\n@media (hover:hover){\n .act:hover .ico{transform:translateY(-3px);box-shadow:0 6px 0 rgba(0,0,0,.1)}\n .act[data-k=\"r\"]:hover svg{animation:wiggle .5s ease}\n .act[data-k=\"v\"]:hover svg{animation:pulseS .6s ease}\n .act[data-k=\"m\"]:hover svg{animation:flip .55s ease}\n .act[data-k=\"c\"]:hover svg{animation:spin1 .7s cubic-bezier(.3,1.4,.5,1)}\n .dm:hover .mk{animation:fly .6s ease}\n .dm:hover{filter:brightness(1.05)}\n .undo:hover svg{animation:spinBack .5s ease}\n #tabs a:hover svg{animation:hop .45s cubic-bezier(.3,1.8,.5,1)}\n #tabs a:hover{color:var(--ink)}\n .appGrid a:hover .appIco svg{animation:wiggle .5s ease}\n .btn:hover{transform:translateY(-1px)}\n .chip:hover,.sChip:hover{transform:translateY(-1px)}\n .catRow:hover .catDot{transform:scale(1.1) rotate(-6deg)}\n .achC:hover .medal{transform:rotate(-10deg) scale(1.08)}\n .linkRow:hover .chev{transform:translateX(3px)}\n .glow:hover .gem{animation:spin1 .7s ease}\n .who:hover .av{transform:scale(1.06) rotate(-4deg)}\n .mute:hover svg{animation:wiggle .5s ease}\n}\n.act .ico svg,.mk,.appIco svg,.catDot,.medal,.chev,.av,.gem{transition:transform .2s}\n.act .ico{transition:transform .18s,box-shadow .18s}\n.act:active .ico svg{transform:scale(.85)}\n.dm:active .mk{transform:scale(.8) rotate(-12deg)}\n@keyframes wiggle{25%{transform:rotate(-12deg)}75%{transform:rotate(10deg)}}\n@keyframes pulseS{50%{transform:scale(1.25)}}\n@keyframes flip{50%{transform:rotateY(180deg) scale(1.1)}}\n@keyframes spin1{to{transform:rotate(360deg)}}\n@keyframes fly{40%{transform:translate(3px,-3px) rotate(8deg)}}\n@keyframes spinBack{to{transform:rotate(-360deg)}}\n/* Harbour */\n.chipsRow{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px}\n.chipsRow::-webkit-scrollbar{display:none}\n.sChip{flex:none;border:0;display:flex;align-items:center;gap:7px;background:var(--card);border-radius:99px;padding:5px 12px 5px 6px;font:600 13px var(--display);box-shadow:0 3px 0 var(--shadow);color:var(--ink);text-transform:none;transition:transform .15s}\n.sChip .emflag{width:26px;height:26px}.sChip .emflag i{height:22px;left:3px;top:2px}.sChip .emflag b{left:5px;top:2px;height:14px;font-size:10px;line-height:14px;min-width:18px}\n.sun.sm{width:24px;height:24px}\n.sChip.live{background:linear-gradient(120deg,#FFF6D8,#FFE7A0);animation:liveGlow 1.6s infinite}\n.sChip.claim{background:var(--gold);color:#fff;box-shadow:0 3px 0 #B8862E;animation:liveGlow 1.6s infinite}\n.sChip.pet span{text-transform:capitalize}\ncanvas.petIco.xs{width:26px;height:26px}\n.gary{display:flex;align-items:center;gap:8px;background:transparent;padding:0 4px}\n.gary .gull{width:30px;height:30px;flex:none}\n.gary p{flex:1;margin:0;background:var(--card);border-radius:18px 18px 18px 4px;padding:9px 13px;font-size:14px;box-shadow:0 3px 0 var(--shadow)}\n.iconBtn{width:34px;height:34px;border-radius:50%;border:0;background:var(--card2);box-shadow:inset 0 0 0 2px var(--line);font:600 16px var(--display);color:var(--muted);flex:none;display:inline-grid;place-items:center;vertical-align:middle}\ndetails.more summary{cursor:pointer;list-style:none;font:600 13px var(--display);color:var(--muted);display:flex;align-items:center;gap:6px}\ndetails.more summary::-webkit-details-marker{display:none}\ndetails.more summary:after{content:\"\u203a\";transition:transform .2s;font-size:16px}\ndetails.more[open] summary:after{transform:rotate(90deg)}\n.moreBody{display:grid;gap:8px;margin-top:10px;animation:enter .25s}\n.miniStats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:6px 0}\n.miniStats div{text-align:center}\n.miniStats b{display:block;font:600 22px var(--display)}\n.miniStats small{font-size:11px}\n.links{display:grid;gap:6px}\n.linkRow{display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--card);border-radius:18px;padding:11px 14px;text-decoration:none;color:var(--ink);box-shadow:0 3px 0 var(--shadow);font:600 14px var(--display)}\n.linkRow.warn{box-shadow:0 3px 0 var(--shadow),inset 0 0 0 2px #F3C3CB;color:var(--bad)}\n.paperRow span:first-child{display:grid;font:700 14px/1.2 Georgia,serif}\n.paperRow small{font:600 11px var(--display);color:var(--muted)}\n/* Achievements */\n.bookHero{display:grid;grid-template-columns:96px 1fr;gap:16px;align-items:center;position:relative}\n.ring2{width:96px;height:96px;transform:rotate(-90deg)}\n.ring2 circle{fill:none;stroke-width:9;stroke-linecap:round}\n.ring2 .t{stroke:#EFE6D0}.ring2 .p{stroke:var(--gold);transition:stroke-dashoffset 1s}\n.ringTxt{position:absolute;left:16px;top:50%;width:96px;transform:translateY(-50%);text-align:center;display:grid}\n.ringTxt b{font:600 26px/1 var(--display)}.ringTxt small{font-size:11px}\n.rars{display:grid;gap:4px}\n.rars div{display:grid;grid-template-columns:92px 1fr 40px;gap:6px;align-items:center}\n.rars small{text-align:right}\n.miniBar{display:block;height:6px;border-radius:99px;background:#EFE6D0;overflow:hidden}\n.miniBar i{display:block;height:100%;border-radius:99px;background:var(--rc,var(--gold))}\n.achList{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}\n.achC{--rc:var(--r-common);border:0;text-align:left;display:flex;align-items:center;gap:9px;background:var(--card2);border-radius:16px;padding:8px 10px;box-shadow:inset 0 0 0 2px var(--line);min-width:0}\n.achC .medal{width:34px;height:34px;border-radius:50%;flex:none;display:grid;place-items:center;font:600 14px var(--display);color:#fff;background:#CFC6B0;box-shadow:0 2px 0 #B5AC96}\n.achC.got .medal{background:var(--rc);box-shadow:0 2px 0 color-mix(in srgb,var(--rc) 70%,#000)}\n.achC.got{background:var(--card);box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--rc) 40%,var(--line))}\n.achC.r-transcendent.got .medal{background:conic-gradient(#E0457B,#DDA94D,#45B07C,#3E8DDB,#9B5DE5,#E0457B)}\n.achT{display:grid;gap:3px;min-width:0;flex:1}\n.achT b{font:600 13px/1.15 var(--display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.achT small{font-size:10.5px}\n.cats{display:grid;gap:6px;margin-top:8px}\n.catRow{border:0;background:var(--card2);border-radius:16px;padding:8px 10px;display:flex;align-items:center;gap:10px;text-align:left;box-shadow:inset 0 0 0 2px var(--line)}\n.catRow .grow{display:grid;gap:4px;flex:1;min-width:0}\n.catRow b{font:600 14px var(--display)}\n.catDot{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;color:#fff;font:600 14px var(--display);flex:none}\n/* Gate */\n#gate{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:20px;background:radial-gradient(circle at 1px 1px,var(--dot) 1.6px,transparent 1.8px) 0 0/18px 18px,linear-gradient(180deg,#BFE8F6,var(--bg) 60%);transition:opacity .4s,transform .4s}\n#gate.out{opacity:0;transform:scale(1.04)}\n.gateCard{background:var(--card);border-radius:30px;padding:26px 22px;width:min(380px,100%);display:grid;gap:14px;justify-items:center;text-align:center;box-shadow:0 6px 0 var(--shadow),0 24px 60px rgba(63,81,96,.18);animation:tin .5s cubic-bezier(.3,1.5,.6,1)}\n.gateCard.shake{animation:shake .4s}\n.gateCard h1{font-size:28px}\n.gateCard p{margin:-8px 0 0}\n.gateMark{width:58px;height:58px;color:var(--bracken);fill:var(--bracken);animation:floaty 3s ease-in-out infinite}\n@keyframes floaty{50%{transform:translateY(-5px) rotate(-4deg)}}\n.gateWho{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}\n.gWho{border:0;background:var(--card2);border-radius:20px;padding:12px;display:grid;justify-items:center;gap:6px;font:600 16px var(--display);box-shadow:inset 0 0 0 2px var(--line);transition:transform .15s}\n.gWho:hover{transform:translateY(-2px)}\n.gWho.on{background:#FFF1CC;box-shadow:inset 0 0 0 3px var(--gold)}\n.gAv{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;background:var(--c);color:#fff;font:600 22px var(--display);box-shadow:0 3px 0 rgba(0,0,0,.12)}\n#gateForm{display:grid;gap:10px;width:100%}\n#gateForm input{width:100%;text-align:center;font-size:16px;padding:12px}\n.btn.big{padding:13px 18px;font-size:16px}\n/* calmer surfaces */\n.card{box-shadow:0 3px 0 var(--shadow)}\n.li{box-shadow:inset 0 0 0 1.5px var(--line)}\n.stat{box-shadow:inset 0 0 0 1.5px var(--line)}\n@media (max-width:380px){#tabs a{font-size:9.5px}#tabs a svg{width:20px;height:20px}.act .ico{width:42px;height:42px}}\n#tip[hidden]{display:none}\n\nhtml.hl-host,html.hl-host body{height:100%;margin:0;overflow:hidden;background:#F5EFDF}#hl-wrap{height:100%}#hl-wrap,#gate,#modal,#toasts,#focus{color:#3F5160;font:600 15px/1.45 Nunito,'Trebuchet MS',system-ui,sans-serif;letter-spacing:normal;text-transform:none}#hl-wrap h1,#hl-wrap h2,#hl-wrap h3,#gate h1,#modal h1,#modal h2,#modal h3,.banner h1{color:inherit;font-family:Fredoka,Nunito,sans-serif;font-weight:600;line-height:1.2;margin:0;letter-spacing:.005em}.banner h1{color:#E06034}#hl-wrap p,#gate p,#modal p{margin-bottom:0}#hl-wrap label,#gate label,#modal label{margin-bottom:0}#hl-wrap a,#modal a{text-decoration:none}#hl-wrap img{max-width:100%}#hl-wrap canvas,#modal canvas,#focus canvas{max-width:none;max-height:none}#hl-wrap *,#gate *,#modal *{box-sizing:border-box}";document.head.appendChild(st);
document.documentElement.classList.add('hl-host');
var host=document.getElementById('hl-root')||document.body;
var wrap=document.createElement('div');wrap.id='hl-wrap';wrap.innerHTML="\n<svg width=\"0\" height=\"0\" style=\"position:absolute\" aria-hidden=\"true\">\n  <symbol id=\"funnal\" viewBox=\"0 0 1000 999.2\"><path fill-rule=\"evenodd\" d=\"M501.35 998.79C498.67 998.90 496.03 998.67 493.36 998.54C488.28 998.29 483.25 998.13 478.20 997.48C444.72 993.18 413.20 978.71 386.65 958.09C376.04 949.86 364.96 939.950 356.64 929.38C325.03 889.18 330.17 839.91 336.48 792.60C339.25 771.81 342.89 750.75 342.01 729.72C341.88 726.79 341.99 723.85 341.71 720.92C340.56 708.70 337.65 696.57 331.61 685.80C329.94 682.83 328.14 679.66 325.63 677.33C316.32 668.67 288.49 660.01 275.78 656.17C231.86 642.91 186.66 634.16 143.01 619.96C124.93 614.09 99.46 605.64 86.11 591.79C80.67 586.13 77.95 578.75 74.70 571.74C71.89 565.69 69.04 559.65 66.15 553.65C52.73 525.76 38.88 498.05 26.88 469.51C5.28 418.13 -14.36 356.05 17.81 304.56C30.60 284.09 49.55 268.26 70.07 255.95C74.83 253.09 79.70 250.08 84.80 247.86C89.66 245.74 94.89 244.26 99.90 242.55C107.73 239.88 115.52 237.09 123.31 234.33C142.93 227.39 162.55 220.43 182.18 213.53C224.22 198.74 266.25 183.95 308.27 169.14C331.17 161.07 354.24 153.49 377.16 145.48C405.62 135.55 434.25 126.05 462.90 116.70C494.87 106.27 526.80 95.79 558.88 85.75C632.83 62.59 707.58 40.39 783.09 22.96C812.97 16.06 843.01 9.69 873.38 5.39C885.02 3.75 896.63 2.35 908.36 1.45C912.36 1.15 916.32 0.78 920.33 0.69C926.19 0.55 932.07 0.15 937.94 0.40C958.03 1.24 986.43 3.81 996.56 24.33C1003.64 38.69 998.15 53.05 992.07 66.52C990.09 70.90 988.11 75.27 986.13 79.65C981.84 89.13 977.59 98.64 973.34 108.13C906.48 257.44 842.14 407.84 776.84 557.82C756.50 604.56 736.49 651.44 715.94 698.08C690.56 755.72 665.58 813.53 639.91 871.04C634.25 883.71 628.54 896.36 622.88 909.03C615.39 925.79 608.88 941.46 596.89 955.70C578.43 977.65 551.77 991.85 523.64 996.66C516.27 997.92 508.82 998.48 501.35 998.79Z M485.34 885.18C487.13 884.85 489.07 884.34 490.51 883.17C492.78 881.30 496.34 873.80 497.95 870.88C518.23 834.20 537.29 796.91 556.59 759.71C568.38 736.98 579.96 714.09 591.21 691.08C597.06 679.09 603.24 667.25 609.04 655.23C623.99 624.22 639.13 593.31 653.92 562.22C666.31 536.20 678.30 509.98 690.51 483.87C713.01 435.77 735.53 387.67 757.58 339.36C775.75 299.54 794.03 259.75 810.63 219.25C815.89 206.41 820.95 193.48 825.49 180.36C829.90 167.62 836.07 149.53 835.87 136.13C835.83 133.86 835.90 131.12 834.69 129.09C831.19 123.23 816.15 125.52 810.32 126.29C793.92 128.47 777.78 132.21 761.68 135.95C739.33 141.14 717.12 146.90 694.92 152.70C628.32 170.12 562.30 189.59 496.28 209.10C448.69 223.16 401.39 238.23 354.17 253.49C307.73 268.50 261.37 284.01 215.71 301.30C192.68 310.02 168.22 319.20 146.46 330.67C142.45 332.78 136.83 335.59 133.51 338.62C132.31 339.72 131.38 340.96 130.58 342.38C122.98 355.81 127.87 384.44 131.16 399.07C138.20 430.34 150.72 463.64 167.60 490.96C171.76 497.69 176.81 505.26 182.75 510.52C186.33 513.69 190.56 516.19 194.64 518.64C205.86 525.36 217.80 530.82 229.91 535.74C274.41 553.850 322.28 565.03 369.07 575.43C383.91 578.73 398.80 581.81 413.65 585.06C419.39 586.32 425.10 587.62 430.79 589.10C433.88 589.91 437.00 590.67 439.98 591.85C443.26 593.14 446.20 594.89 448.61 597.49C453.87 603.18 455.58 611.51 456.23 618.99C456.90 626.71 456.32 634.49 455.68 642.17C454.12 661.08 450.37 679.66 447.06 698.31C442.58 723.52 437.41 748.59 433.23 773.87C431.49 784.39 430.08 794.99 429.01 805.60C427.09 824.60 425.35 845.82 429.77 864.56C430.25 866.58 430.88 870.58 432.32 872.07C433.95 873.75 452.12 879.97 455.45 880.97C464.13 883.57 476.32 886.83 485.34 885.18Z\"/></symbol>\n  <symbol id=\"i-resp\" viewBox=\"0 0 24 24\"><path d=\"M4 5.5C4 4.1 5.1 3 6.5 3h11C18.9 3 20 4.1 20 5.5v8c0 1.4-1.1 2.5-2.5 2.5H11l-4.3 3.6c-.6.5-1.7.1-1.7-.8V16h0c-.6-.4-1-1-1-1.8z\"/></symbol>\n  <symbol id=\"i-video\" viewBox=\"0 0 24 24\"><path d=\"M5 4h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm5 4.3v7.4c0 .7.8 1.2 1.4.8l5.6-3.7c.5-.4.5-1.2 0-1.6l-5.6-3.7c-.6-.4-1.4.1-1.4.8z\"/></symbol>\n  <symbol id=\"i-meet\" viewBox=\"0 0 24 24\"><path d=\"M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1zM4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9zm4 3h3v3H8z\"/></symbol>\n  <symbol id=\"i-star\" viewBox=\"0 0 24 24\"><path d=\"M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8z\"/></symbol>\n  <symbol id=\"i-undo\" viewBox=\"0 0 24 24\"><path d=\"M9.5 4.3a1 1 0 0 1 0 1.4L7.2 8H14a6 6 0 0 1 0 12h-3a1 1 0 1 1 0-2h3a4 4 0 0 0 0-8H7.2l2.3 2.3a1 1 0 1 1-1.4 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.4 0z\"/></symbol>\n  <symbol id=\"t-harbour\" viewBox=\"0 0 24 24\"><path d=\"M10 2h4l1 3h-6zM8.5 6h7l1.5 13h-10zM3 20h18a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2z\"/></symbol>\n  <symbol id=\"t-ship\" viewBox=\"0 0 24 24\"><path d=\"M11 2h1.6v2.2l6.2 6.3H12.6V12H11zM6.6 5.6 10 4.8v5.7H4.4zM2.5 13.5h19l-2.6 5.2a2.4 2.4 0 0 1-2.1 1.3H7.2a2.4 2.4 0 0 1-2.1-1.3z\"/></symbol><symbol id=\"t-islet\" viewBox=\"0 0 24 24\"><path d=\"M12 6c2-3 6-3 8-1-2 0-4 .5-5.5 2 2.5-.5 5 .5 6 3-2.5-1.3-5-1.4-6.8-.4L14 19h-2.5l1.3-9.2C11 9.2 8.5 9.6 6 11c.8-2.6 3.4-4 6-4C10.6 5.8 8.6 5 6 5.5 8 3.5 11 3.8 12 6zM2 20.5C5 18.5 9 18 12 18s7 .5 10 2.5V22H2z\"/></symbol>\n  <symbol id=\"t-lock\" viewBox=\"0 0 24 24\"><path d=\"M10 1h4a1 1 0 1 1 0 2h-1v1.1A9 9 0 1 1 11 4.1V3h-1a1 1 0 1 1 0-2zm2 6a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 2a1 1 0 0 1 1 1v3.6l2.2 2.2a1 1 0 0 1-1.4 1.4l-2.5-2.5A1 1 0 0 1 11 14v-4a1 1 0 0 1 1-1z\"/></symbol>\n  <symbol id=\"t-quest\" viewBox=\"0 0 24 24\"><path d=\"M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm9.7 9.3a1 1 0 0 0-1.4 0L11 14.6l-1.3-1.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4a1 1 0 0 0 0-1.4z\"/></symbol>\n  <symbol id=\"t-shop\" viewBox=\"0 0 24 24\"><path d=\"M7 7V6a5 5 0 0 1 10 0v1h2.2a1 1 0 0 1 1 .9l1 12.3A2 2 0 0 1 19.2 22H4.8a2 2 0 0 1-2-1.8l1-12.3a1 1 0 0 1 1-.9zm2 0h6V6a3 3 0 0 0-6 0zm-.5 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z\"/></symbol>\n  <symbol id=\"t-more\" viewBox=\"0 0 24 24\"><circle cx=\"6.5\" cy=\"6.5\" r=\"3.5\"/><circle cx=\"17.5\" cy=\"6.5\" r=\"3.5\"/><circle cx=\"6.5\" cy=\"17.5\" r=\"3.5\"/><circle cx=\"17.5\" cy=\"17.5\" r=\"3.5\"/></symbol>\n</svg>\n<div id=\"app\">\n  <header id=\"hud\">\n    <a class=\"brand\" href=\"#harbour\" aria-label=\"Hundred Lanterns by Funnal, home\"><svg class=\"mark\" aria-hidden=\"true\"><use href=\"#funnal\"/></svg><span><b>Hundred Lanterns</b><small>A Funnal pirate game</small></span></a>\n    <div class=\"hudRight\">\n      <button class=\"mute\" id=\"mute\" aria-label=\"Sound on or off\"><svg viewBox=\"0 0 24 24\"><path d=\"M4 9h4l5-4v14l-5-4H4z\"/><path class=\"w\" d=\"M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path class=\"x\" d=\"M16 9l5 6M21 9l-5 6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg></button>\n      <button class=\"glow\" id=\"glowBox\" aria-label=\"Glowpennies, open shop\"><span class=\"gem\"></span><b id=\"glowNum\">0</b></button>\n      <button id=\"who\" class=\"who\" aria-label=\"Your islet\"><span id=\"whoAv\" class=\"av\"></span></button>\n    </div>\n    <div class=\"lvlRow\">\n      <span class=\"lvlBadge\">Lv <b id=\"lvlNum\">1</b></span>\n      <div class=\"xpbar\"><i id=\"xpFill\"></i></div>\n      <span class=\"xpTxt\" id=\"xpTxt\">0 / 75 XP</span>\n      <span class=\"whoTxt\"><b id=\"whoName\">Keeper</b> \u00b7 <small id=\"whoTitle\">Apprentice</small></span>\n    </div>\n  </header>\n  <div id=\"sync\" class=\"sync\" hidden></div>\n  <main id=\"screen\" tabindex=\"-1\"></main>\n  <section id=\"actions\" aria-label=\"Log outreach\">\n    <div class=\"smallBtns\">\n      <button class=\"act\" data-k=\"r\" id=\"b_r\"><span class=\"ico c-r\"><svg><use href=\"#i-resp\"/></svg></span><span>Response</span></button>\n      <button class=\"act\" data-k=\"v\" id=\"b_v\"><span class=\"ico c-v\"><svg><use href=\"#i-video\"/></svg></span><span>Video</span></button>\n      <button class=\"act\" data-k=\"m\" id=\"b_m\"><span class=\"ico c-m\"><svg><use href=\"#i-meet\"/></svg></span><span>Meeting</span></button>\n      <button class=\"act\" data-k=\"c\" id=\"b_c\"><span class=\"ico c-c\"><svg><use href=\"#i-star\"/></svg></span><span>Client</span></button>\n    </div>\n    <div class=\"dmRow\">\n      <button id=\"undo\" class=\"undo\" aria-label=\"Undo last log\"><svg><use href=\"#i-undo\"/></svg></button>\n      <button class=\"dm\" data-k=\"d\" id=\"b_d\" aria-label=\"DM sent\">\n        <span class=\"dmIcon\" aria-hidden=\"true\"><svg class=\"mk\"><use href=\"#funnal\"/></svg><svg class=\"ring\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"44\" class=\"track\"/><circle cx=\"50\" cy=\"50\" r=\"44\" class=\"prog\" id=\"cdRing\"/></svg></span>\n        <span class=\"dmLabel\"><b>DM sent</b><small id=\"dmSub\">tap after each DM</small></span>\n      </button>\n      <div class=\"todayMini\"><b id=\"myToday\">0</b><small>today</small></div>\n    </div>\n  </section>\n  <nav id=\"tabs\" aria-label=\"Screens\">\n    <a href=\"#harbour\" data-s=\"harbour\"><svg><use href=\"#t-harbour\"/></svg>Harbour</a>\n    <a href=\"#ship\" data-s=\"ship\"><svg><use href=\"#t-ship\"/></svg>Ship</a>\n    <a href=\"#lockin\" data-s=\"lockin\"><svg><use href=\"#t-lock\"/></svg>Lock In</a>\n    <a href=\"#quests\" data-s=\"quests\"><svg><use href=\"#t-quest\"/></svg>Quests</a>\n    <a href=\"#shop\" data-s=\"shop\"><svg><use href=\"#t-shop\"/></svg>Shop</a>\n    <a href=\"#more\" data-s=\"more\"><svg><use href=\"#t-more\"/></svg>More</a>\n  </nav>\n</div>\n<div id=\"fx\" aria-hidden=\"true\"></div>\n<canvas id=\"fireworks\" aria-hidden=\"true\"></canvas>\n<div id=\"toasts\" aria-live=\"polite\"></div>\n<div id=\"modal\" hidden></div>\n";
document.body.innerHTML='';document.body.appendChild(wrap);
})();
"use strict";
/* ============================== GAME DATA (pirate edition) ============================== */
const KINDS = {
  d:{name:'DM sent',          xp:10,   g:2,   short:'DM'},
  r:{name:'Response',         xp:45,   g:10,  short:'Response'},
  v:{name:'Video wanted',     xp:120,  g:30,  short:'Video'},
  m:{name:'Meeting wanted',   xp:300,  g:75,  short:'Meeting'},
  c:{name:'Client gained',    xp:1500, g:400, short:'Client'},
};
const RARITIES = ['common','uncommon','rare','epic','legendary','mythic','transcendent'];
const RARITY_GLOW = {common:10,uncommon:25,rare:60,epic:150,legendary:400,mythic:1000,transcendent:3000};
const TIERS = ['Bronze','Silver','Gold','Platinum','Diamond','Master'];

const DEFAULT_FORFEITS = [
  {id:'chicken', text:'Your captain becomes a giant chicken for a day', kind:'virtual'},
  {id:'title', text:'Your rank becomes "Ship\'s Napper" for a day', kind:'virtual'},
  {id:'statue', text:'A statue of your rival is erected in your hideout', kind:'virtual'},
  {id:'gnomes', text:'Barnacle gnomes take over your hideout', kind:'virtual'},
  {id:'gull', text:'Gary the seagull follows you everywhere, judging', kind:'virtual'},
  {id:'wall', text:'Your WANTED poster goes up in the tavern', kind:'virtual'},
  {id:'headline', text:'The Salty Herald runs a dramatic front page about you', kind:'virtual'},
  {id:'dance', text:'Your captain must perform a sea shanty jig all day', kind:'virtual'},
  {id:'coffee', text:'You owe the other captain a coffee', kind:'real'},
  {id:'biscuits', text:'You bring biscuits to the next meeting', kind:'real'},
  {id:'playlist', text:'The other captain picks the office playlist for an hour', kind:'real'},
];
const DEFAULT_CONFIG = {
  target:100, cooldownSec:5, workdays:[1,2,3,4,5], dayStart:'09:00', dayEnd:'17:30', finalWarning:'16:30',
  absenceScale:0.5, holidays:[], absences:{}, startDate:'', forfeits:DEFAULT_FORFEITS.map(f=>({...f})),
  playerIds:['sam','james'], players:{sam:{name:'Sam'},james:{name:'James'}}, undoMinutes:15,
  caps:{r:60,v:20,m:8,c:4}, cooldowns:{r:3,v:20,m:60,c:300}, requireConfirm:true,
};

/* ---------- Daily sea foes (ids are stored history: never rename them) ---------- */
// type: storm | serpent | ship | octopus | crab | kraken | whale
const BOSSES = [
  {id:'grumble', name:'Grumblesquall', type:'storm', col:'#A9B6D3', eye:'#3F3A30', lines:{start:"Hrmph. Another hundred cannonballs? I'll just rain on you.",p75:'Oi! That one went straight through my left cloud.',p50:"Half a squall? I'm telling the sea.",p25:"I'm... drizzling. That's not even a storm.",dead:'Fine. FINE. Clear skies. Happy now?'}},
  {id:'drizzle', name:'Lady Drizzle', type:'storm', col:'#9CC7E2', eye:'#3F3A30', lines:{start:'Darling, nobody replies before ten. Why bother?',p75:'Cannonballs? How terribly keen.',p50:'You realise this is rather rude?',p25:'My mascara is running. Stop it.',dead:'I shall drizzle on another fleet. Ta-ta.'}},
  {id:'seenzone', name:'The Seenzone Serpent', type:'serpent', col:'#7FB59A', eye:'#3F3A30', lines:{start:'Ssseen. Ssseen. All of them, left on ssseen.',p75:'One of them typed... and ssstopped.',p50:'Ssstop being ssso perssonable.',p25:"They're... replying? Impossssible.",dead:'Read receipts... turned... off...'}},
  {id:'algo', name:'Admiral Algorithmo', type:'ship', col:'#7C86A6', eye:'#3F3A30', lines:{start:'I HAVE THROTTLED YOUR REACH BY 3.7 PERCENT.',p75:'ENGAGEMENT DETECTED. RECALIBRATING.',p50:'YOUR AUTHENTICITY IS... UNEXPECTED.',p25:'ERROR: TOO MANY GENUINE CONVERSATIONS.',dead:'SHADOWBAN... FAILED... ABANDON SHIP...'}},
  {id:'ghostwell', name:'Captain Ghostwell', type:'ship', col:'#B9D3CF', eye:'#3F3A30', ghost:true, lines:{start:'Arr. I ghosted every client I ever had. Proud of it.',p75:'Ye sent a follow-up? The audacity.',p50:'Me timbers are... less ghostly.',p25:"Blast it, they're answering!",dead:'Tell me crew... I was never here. Classic me.'}},
  {id:'mondaymist', name:'The Monday Mist', type:'storm', col:'#B7B9C9', eye:'#3F3A30', lines:{start:'Coffee first. Cannons later. Maybe Tuesday.',p75:"You're... motivated? On my day?",p50:'Have you tried a long lunch instead?',p25:'This is deeply unsettling energy.',dead:'See you next week. I always come back.'}},
  {id:'outofoffice', name:'Out-of-Office Octopus', type:'octopus', col:'#E89AB4', eye:'#3F3A30', lines:{start:'Eight arms, all away until the 14th.',p75:'Who sent that? It was quite good.',p50:'Auto-replies cannot stop you, it seems.',p25:'Back in... the office... soon...',dead:'Out of office. Permanently.'}},
  {id:'budgetbeast', name:'The Budget Barnacle Crab', type:'crab', col:'#E8866A', eye:'#3F3A30', lines:{start:'"We\'ll circle back next quarter." Snip snip.',p75:"Who's handing out free appraisal videos? Unfair.",p50:'Value? You are offering VALUE?',p25:'My excuses are running out...',dead:'Fine, they have budget. Happy now?'}},
];
const RARE_BOSSES = [
  {id:'aurora', name:'Aurelia, the Golden Whale', type:'whale', col:'#F2C462', eye:'#3F3A30', rare:true, lines:{start:'A rare sight, captain. Catch me and the sea remembers.',p75:'Oh, you noticed me. How sweet.',p50:'Shimmering... flickering...',p25:'Make it beautiful at least.',dead:'Gloriously outsailed. Have a trophy.'}},
  {id:'kraken', name:'The Inbox Kraken', type:'kraken', col:'#B57FD9', eye:'#3F3A30', rare:true, lines:{start:'EIGHT ARMS. EIGHT THOUSAND UNREAD MESSAGES.',p75:'Is that a personalised opener? Disgusting.',p50:'My tentacles are getting replies!',p25:'Inbox... zero... approaching...',dead:'Archived. Forever.'}},
];
const WEEKLY_BOSSES = [
  {id:'leviathan', name:'The Unread Leviathan'},{id:'stormcloud', name:'The Black Gale'},
  {id:'tidequeen', name:'The Ebb Queen\'s Armada'},{id:'hollow', name:'The Hollow Galleon'},
];
const DAILY_MODS = [
  {id:'echo', name:'Echo Tide', desc:'Responses give double doubloons today.'},
  {id:'golden', name:'Golden Hour', desc:'DMs logged between 14:00 and 15:00 give double XP.'},
  {id:'lucky', name:'Lucky Currents', desc:'Treasure from DMs is twice as likely today.'},
  {id:'early', name:'Dawn Raid', desc:'DMs before 10:00 give +50% XP.'},
  {id:'calm', name:'Calm Seas', desc:'Finishing a voyage (Lock In) gives +60 bonus XP today.'},
  {id:'none', name:'Fair Winds', desc:'No twist today. Just you, the inbox and the sea.'},
];

/* ---------- Treasure: 6 sets of 5, found as loot ---------- */
const COLLECT_SETS = [
  {id:'shells', name:'Tidepool Shells', items:[['cockle','Cockle Shell','common'],['whelk','Whelk Spiral','common'],['scallop','Fan Scallop','uncommon'],['conch','Rose Conch','rare'],['nautilus','Pearl Nautilus','epic']]},
  {id:'bottles', name:'Messages in Bottles', items:[['b1','"Dear Sir/Madam" Bottle','common'],['b2','Typo-ridden Bottle','common'],['b3','Bottle With a Discount Code','uncommon'],['b4','Bottle That Says "Yes!"','rare'],['b5','Bottle From the Future','legendary']]},
  {id:'lanterns', name:"Ship's Lanterns", items:[['l1','Tin Lantern','common'],['l2','Paper Lantern','uncommon'],['l3','Brass Deck Lantern','uncommon'],['l4','Lighthouse Lens Shard','rare'],['l5','The First Lantern','legendary']]},
  {id:'charts', name:'Treasure Maps', items:[['c1','Map of the Shallows','common'],['c2','Map of Seenzone Strait','uncommon'],['c3','Map of Replyhaven','rare'],['c4','Map of the Meeting Isles','epic'],['c5','Map of Client Cove','legendary']]},
  {id:'feathers', name:'Parrot Feathers', items:[['f1','Grey Feather','common'],['f2','Speckled Feather','common'],['f3','Gary\'s Feather','uncommon'],['f4','Golden Feather','epic'],['f5','Feather of the Moon Parrot','mythic']]},
  {id:'stars', name:'Cursed Doubloons', items:[['s1','Tarnished Doubloon','uncommon'],['s2','Silver Piece of Eight','rare'],['s3','Pirate King\'s Coin','epic'],['s4','Twin-Faced Coin','legendary'],['s5','The Hundredth Doubloon','mythic']]},
];
const COLLECTIBLES = []; COLLECT_SETS.forEach(s=>s.items.forEach(([id,name,rar])=>COLLECTIBLES.push({id,name,rar,set:s.id})));

/* ---------- Cosmetics ----------
   cat: hat | face | coat | hull | sail | flag | figure | deck | decor | moth (parrot gear) | effect | shield
   track:L = free reward at level L. lvl = shop unlock level. prestige:n = needs n prestiges. Old ids kept for saved purchases. */
const SHIP_DEFAULT={hull:'hull_oak',sail:'sail_canvas',flag:'flag_skull'};
const ITEMS = [
  // Hats
  {id:'hat_bandana', name:'Red Bandana', cat:'hat', st:'bandana', col:'#D9485F', track:2},
  {id:'hat_cap', name:"Deckhand's Cap", cat:'hat', st:'cap', col:'#4A7EC2', price:80, lvl:1},
  {id:'hat_beanie', name:"Sailor's Beanie", cat:'hat', st:'beanie', col:'#E06034', price:150, lvl:3},
  {id:'hat_straw', name:'Straw Sun Hat', cat:'hat', st:'straw', col:'#E8C36A', price:300, lvl:5},
  {id:'hat_skull', name:'Skull Bandana', cat:'hat', st:'bandana', col:'#3F3A40', price:450, lvl:7},
  {id:'hat_tricorn', name:"Captain's Tricorn", cat:'hat', st:'tricorn', col:'#3F3A40', price:700, lvl:9},
  {id:'hat_feather', name:'Plumed Captain\'s Hat', cat:'hat', st:'feather', col:'#5A3E8C', track:15},
  {id:'hat_teal', name:'Sea-glass Tricorn', cat:'hat', st:'tricorn', col:'#3FA59A', price:1600, lvl:18},
  {id:'hat_crown', name:'Driftwood Crown', cat:'hat', st:'crown', col:'#DDA94D', price:4000, lvl:25},
  {id:'hat_bicorne', name:"Admiral's Bicorne", cat:'hat', st:'bicorne', col:'#2E3A5C', track:30},
  {id:'hat_kraken', name:'Kraken Helm', cat:'hat', st:'kraken', col:'#9B5DE5', track:50},
  {id:'hat_halo', name:'Lantern Halo', cat:'hat', st:'halo', col:'#FFE58A', price:12000, lvl:40, prestige:1},
  // Faces
  {id:'face_patch', name:'Eyepatch', cat:'face', st:'patch', col:'#3F3A40', track:3},
  {id:'face_stubble', name:'Sea-salt Stubble', cat:'face', st:'stubble', col:'#7A5A3A', price:120, lvl:2},
  {id:'face_beard', name:'Proper Pirate Beard', cat:'face', st:'beard', col:'#6B4429', price:500, lvl:8},
  {id:'face_ginger', name:'Ginger Bushbeard', cat:'face', st:'beard', col:'#D9733A', price:900, lvl:12},
  {id:'face_moust', name:'Twirled Moustache', cat:'face', st:'moustache', col:'#4A3324', price:650, lvl:10},
  {id:'face_monocle', name:'Gold Monocle', cat:'face', st:'monocle', col:'#DDA94D', price:2200, lvl:22},
  {id:'face_earring', name:'Golden Hoop', cat:'face', st:'earring', col:'#DDA94D', price:350, lvl:4},
  // Coats
  {id:'coat_stripe', name:'Striped Sailor Shirt', cat:'coat', st:'stripe', col:'#FFFFFF', col2:'#4A7EC2', price:100, lvl:1},
  {id:'coat_yellow', name:'Yellow Oilskin', cat:'coat', st:'plain', col:'#F2C230', price:160, lvl:2},
  {id:'coat_vest', name:'Leather Vest', cat:'coat', st:'vest', col:'#8A5A3A', col2:'#F4EFE4', price:350, lvl:5},
  {id:'coat_navy', name:'Navy Peacoat', cat:'coat', st:'trim', col:'#2E3A5C', col2:'#DDA94D', price:600, lvl:7},
  {id:'coat_red', name:"Captain's Red Coat", cat:'coat', st:'trim', col:'#C91E36', col2:'#DDA94D', price:1100, lvl:12},
  {id:'coat_green', name:'Bosun\'s Bottle-green', cat:'coat', st:'trim', col:'#2F7A5C', col2:'#F4EFE4', price:1500, lvl:16},
  {id:'coat_admiral', name:"Admiral's Coat", cat:'coat', st:'trim', col:'#1F2A4A', col2:'#F2C462', track:40},
  {id:'coat_star', name:'Starweave Cloak', cat:'coat', st:'cloak', col:'#5A4AA8', col2:'#FFFFFF', price:7000, lvl:35},
  {id:'coat_king', name:'Pirate King\'s Robe', cat:'coat', st:'cloak', col:'#8E1F3A', col2:'#F2C462', track:75},
  {id:'coat_ghost', name:'Ghost-captain Coat', cat:'coat', st:'cloak', col:'#B9D3CF', col2:'#FFFFFF', price:20000, lvl:50, prestige:3},
  // Hulls
  {id:'hull_oak', name:'Honest Oak', cat:'hull', col:'#A8704A', col2:'#7A4E30', price:0, lvl:1, free:true},
  {id:'hull_cherry', name:'Cherry Lacquer', cat:'hull', col:'#C9454F', col2:'#8E2C36', price:400, lvl:4},
  {id:'hull_navy', name:'Midnight Navy', cat:'hull', col:'#34466E', col2:'#22304F', price:700, lvl:7},
  {id:'hull_mint', name:'Sea-foam Mint', cat:'hull', col:'#6CC7A8', col2:'#3E9C7E', price:900, lvl:10},
  {id:'hull_sunset', name:'Sunset Orange', cat:'hull', col:'#E8763E', col2:'#B9532A', price:1300, lvl:14},
  {id:'hull_black', name:'Black Pearl', cat:'hull', col:'#2E2B33', col2:'#17151B', track:20},
  {id:'hull_royal', name:'Royal Plum', cat:'hull', col:'#7A4AA8', col2:'#54307A', price:3500, lvl:28},
  {id:'hull_coral', name:'Coral Reef', cat:'hull', col:'#F08C9C', col2:'#C95E70', price:5000, lvl:33},
  {id:'hull_ghost', name:'Ghost Ship Pale', cat:'hull', col:'#CFE5E1', col2:'#9DBDB8', track:60},
  {id:'hull_gold', name:'Legend of the Seven Seas', cat:'hull', col:'#E8BC52', col2:'#B88A2A', track:100},
  // Sails
  {id:'sail_canvas', name:'Canvas', cat:'sail', col:'#FFFCF2', col2:'#EDE3CC', pat:'plain', price:0, lvl:1, free:true},
  {id:'sail_redstripe', name:'Candy Stripe', cat:'sail', col:'#FFFCF2', col2:'#D9485F', pat:'stripe', price:300, lvl:3},
  {id:'sail_bluestripe', name:'Harbour Blue Stripe', cat:'sail', col:'#FFFCF2', col2:'#4A7EC2', pat:'stripe', price:300, lvl:4},
  {id:'sail_patch', name:'Patchwork', cat:'sail', col:'#F4E6C8', col2:'#C79A6A', pat:'patch', price:600, lvl:6},
  {id:'sail_funnal', name:'Funnal Colours', cat:'sail', col:'#E06034', col2:'#FFFFFF', pat:'mark', track:10},
  {id:'sail_black', name:'Midnight Black', cat:'sail', col:'#2E2B33', col2:'#FFFFFF', pat:'skull', price:1800, lvl:16},
  {id:'sail_sunset', name:'Sunset Fade', cat:'sail', col:'#F7B26A', col2:'#E0457B', pat:'grad', price:2600, lvl:22},
  {id:'sail_stars', name:'Starry Night', cat:'sail', col:'#34437A', col2:'#FFF3B8', pat:'stars', track:35},
  {id:'sail_rainbow', name:'Rainbow Run', cat:'sail', col:'#FFFFFF', col2:'#FFFFFF', pat:'rainbow', track:70},
  {id:'sail_gold', name:'Cloth of Gold', cat:'sail', col:'#F2CF7A', col2:'#DDA94D', pat:'grad', price:30000, lvl:60, prestige:2},
  // Flags
  {id:'flag_skull', name:'Classic Jolly Roger', cat:'flag', col:'#2E2B33', sym:'skull', sc:'#FFFFFF', price:0, lvl:1, free:true},
  {id:'flag_mark', name:'Funnal Banner', cat:'flag', col:'#E06034', sym:'mark', sc:'#FFFFFF', track:5},
  {id:'flag_swords', name:'Crossed Cutlasses', cat:'flag', col:'#2E2B33', sym:'swords', sc:'#F4EFE4', price:250, lvl:3},
  {id:'flag_anchor', name:'Anchor Ensign', cat:'flag', col:'#34466E', sym:'anchor', sc:'#FFFFFF', price:350, lvl:5},
  {id:'flag_heart', name:'Heart-and-Bones', cat:'flag', col:'#D9485F', sym:'heart', sc:'#FFFFFF', price:500, lvl:7},
  {id:'flag_parrot', name:'Parrot Pennant', cat:'flag', col:'#3FA57E', sym:'parrot', sc:'#FFE58A', price:800, lvl:11},
  {id:'flag_star', name:'North Star', cat:'flag', col:'#2E3A5C', sym:'star', sc:'#F2C462', price:1200, lvl:15},
  {id:'flag_cupcake', name:'The Cupcake Flag', cat:'flag', col:'#F4A6C0', sym:'cupcake', sc:'#FFFFFF', price:1500, lvl:19},
  {id:'flag_kraken', name:'Kraken Standard', cat:'flag', col:'#5A3E8C', sym:'kraken', sc:'#E8C7FF', price:4000, lvl:30},
  {id:'flag_crown', name:'Royal Standard', cat:'flag', col:'#8E1F3A', sym:'crown', sc:'#F2C462', price:8000, lvl:42},
  {id:'flag_diamond', name:'Diamond Colours', cat:'flag', col:'#1F2A4A', sym:'diamond', sc:'#9FE3F5', track:85},
  // Figureheads
  {id:'m_figure', name:'Mermaid Figurehead', cat:'figure', st:'mermaid', price:3500, merchantOnly:true},
  {id:'fig_gull', name:'Seagull Figurehead', cat:'figure', st:'gull', price:600, lvl:6},
  {id:'fig_dragon', name:'Sea Dragon', cat:'figure', st:'dragon', price:2400, lvl:20},
  {id:'fig_lion', name:'Golden Lion', cat:'figure', st:'lion', track:25},
  {id:'fig_kraken', name:'Kraken Prow', cat:'figure', st:'kraken', price:6500, lvl:38},
  {id:'fig_owl', name:'Gilded Owl', cat:'figure', st:'owl', track:65},
  // Deck (3 slots)
  {id:'dk_barrels', name:'Barrels of Grog', cat:'deck', st:'barrels', price:150, lvl:2},
  {id:'dk_cannon', name:'Brass Cannon', cat:'deck', st:'cannon', price:400, lvl:4},
  {id:'dk_lanterns', name:'String of Lanterns', cat:'deck', st:'lanterns', price:500, lvl:6},
  {id:'dk_chest', name:'Treasure on Deck', cat:'deck', st:'chest', price:900, lvl:9},
  {id:'dk_bunting', name:'Bunting', cat:'deck', st:'bunting', price:700, lvl:8},
  {id:'dk_plants', name:'Potted Palms', cat:'deck', st:'plants', price:1000, lvl:13},
  {id:'dk_wheel', name:'Golden Ship\'s Wheel', cat:'deck', st:'wheel', track:90},
  // Hideout decor (6 spots)
  {id:'flowers', name:'Hibiscus Bed', cat:'decor', price:60, lvl:1},
  {id:'bench', name:'Driftwood Bench', cat:'decor', price:90, lvl:1},
  {id:'post', name:'Lantern Post', cat:'decor', price:140, lvl:2},
  {id:'crates', name:'Stack of Crates', cat:'decor', price:120, lvl:2},
  {id:'pine', name:'Palm Tree', cat:'decor', price:200, lvl:3},
  {id:'sandcastle', name:'Sandcastle Fort', cat:'decor', price:180, lvl:3},
  {id:'mailbox', name:'Bottle Post', cat:'decor', price:260, lvl:4},
  {id:'hammock', name:'Hammock', cat:'decor', price:380, lvl:5},
  {id:'campfire', name:'Beach Campfire', cat:'decor', price:420, lvl:6},
  {id:'telescope', name:'Brass Telescope', cat:'decor', price:450, lvl:6},
  {id:'umbrella', name:'Beach Umbrella', cat:'decor', price:500, lvl:7},
  {id:'rowboat', name:'Little Rowboat', cat:'decor', price:600, lvl:8},
  {id:'tiki', name:'Tiki Torches', cat:'decor', price:700, lvl:9},
  {id:'cat', name:'Ship\'s Cat (Biscuit)', cat:'decor', price:800, lvl:10},
  {id:'xmark', name:'X Marks the Spot', cat:'decor', price:900, lvl:11},
  {id:'well', name:'Wishing Well', cat:'decor', price:1200, lvl:12},
  {id:'cannonfort', name:'Shore Cannon', cat:'decor', price:1400, lvl:14},
  {id:'windmill', name:'Tiny Windmill', cat:'decor', price:1800, lvl:15},
  {id:'maptable', name:'Captain\'s Map Table', cat:'decor', price:2000, lvl:17},
  {id:'trophy', name:'Trophy Cabinet', cat:'decor', price:2500, lvl:18},
  {id:'fountain', name:'Lantern Fountain', cat:'decor', price:3200, lvl:20},
  {id:'skullrock', name:'Skull Rock', cat:'decor', price:4200, lvl:26},
  {id:'crystal', name:'Tide Crystal', cat:'decor', price:6000, lvl:30},
  {id:'wreck', name:'Shipwreck', cat:'decor', price:9000, lvl:40},
  {id:'goldpile', name:'Mountain of Gold', cat:'decor', price:18000, lvl:55},
  // Parrot gear
  {id:'moth_bow', name:'Parrot Bowtie', cat:'moth', price:200, lvl:4},
  {id:'moth_scarf', name:'Parrot Scarf', cat:'moth', price:500, lvl:9},
  {id:'moth_hat', name:'Tiny Tricorn', cat:'moth', price:900, lvl:12},
  {id:'moth_patch', name:'Tiny Eyepatch', cat:'moth', price:700, lvl:11},
  {id:'moth_monocle', name:'Parrot Monocle', cat:'moth', price:1500, lvl:16},
  {id:'moth_chain', name:'Gold Chain', cat:'moth', track:45},
  // Effects
  {id:'fx_fireflies', name:'Firefly Swarm', cat:'effect', price:400, lvl:5},
  {id:'fx_dolphins', name:'Dolphin Escort', cat:'effect', price:1200, lvl:12},
  {id:'fx_snow', name:'Gentle Snowfall', cat:'effect', price:900, lvl:10},
  {id:'fx_shooting', name:'Shooting Stars', cat:'effect', price:2200, lvl:18},
  {id:'fx_rainbow', name:'Rainbow Sky', cat:'effect', price:3000, lvl:24},
  {id:'fx_biolum', name:'Glowing Waves', cat:'effect', track:55},
  {id:'fx_whale', name:'Whale Friend', cat:'effect', track:80},
  {id:'fx_aurora', name:'Aurora Sky', cat:'effect', price:15000, lvl:45},
  {id:'fx_fireworks', name:'Victory Fireworks', cat:'effect', track:95},
  {id:'goldlh', name:'Gilded Trim', cat:'effect', price:25000, lvl:50, prestige:1},
  {id:'shield', name:'Lantern Shield', cat:'shield', price:400, lvl:3, desc:'Protects one missed day: cancels its forfeit and keeps your streak.'},
];
const MERCHANT_ITEMS = [
  {id:'m_jelly', name:'Jellyfish Lamp', cat:'decor', price:1100},
  {id:'m_anchor', name:'Ancient Anchor', cat:'decor', price:1600},
  {id:'m_bonsai', name:'Coral Bonsai', cat:'decor', price:2400},
  {id:'m_orrery', name:'Clockwork Orrery', cat:'decor', price:9000},
  {id:'m_dragon', name:'Kite Dragon', cat:'decor', price:20000},
  {id:'m_hat_lantern', name:'Lantern Hat', cat:'hat', st:'lantern', col:'#DDA94D', price:2800},
  {id:'m_coat_pearl', name:'Pearl Coat', cat:'coat', st:'trim', col:'#EEE8F4', col2:'#B9A8D9', price:5200},
  {id:'m_moth_crown', name:'Parrot Crown', cat:'moth', price:4200},
  {id:'m_fx_bubbles', name:'Bubble Drift', cat:'effect', price:3000},
  {id:'m_figure', name:'Mermaid Figurehead', cat:'figure', st:'mermaid', price:3500},
  {id:'m_hull_pearl', name:'Mother-of-Pearl Hull', cat:'hull', col:'#E9E2F2', col2:'#B9A8D9', price:6000},
  {id:'m_sail_tiger', name:'Tiger Sails', cat:'sail', col:'#F2A33A', col2:'#3F3A30', pat:'stripe', price:4500},
];
const ALL_ITEMS = Object.fromEntries([...ITEMS.filter(i=>!i.merchantOnly),...MERCHANT_ITEMS].map(i=>[i.id,i]));
ITEMS.forEach(i=>{if(i.track){i.price=0;i.lvl=i.track;}});
const TRACK = ITEMS.filter(i=>i.track).sort((a,b)=>a.track-b.track);
const levelGold = L=>20+5*L; // doubloons granted on reaching level L
const CAT_NAMES={hat:'Hats',face:'Faces',coat:'Coats',hull:'Hulls',sail:'Sails',flag:'Flags',figure:'Figureheads',deck:'Deck',decor:'Hideout',moth:'Parrot',effect:'Sky & sea',shield:'Shields'};

/* ---------- Funnal Cove: the shared pirate port (ids stored) ---------- */
const PROJECTS = [
  {id:'jetty', name:'Mend the Old Jetty', dm:300, g:100, blurb:'Ships can dock again. Small steps.'},
  {id:'stall', name:'Rum & Lantern Stall', dm:800, g:300, blurb:'Someone has to sell all these lanterns.'},
  {id:'bakery', name:'The Salty Biscuit Tavern', dm:1500, g:600, blurb:'Smells like cinnamon and replied messages.'},
  {id:'flags', name:'Signal Flag Line', dm:2500, g:900, blurb:'Bunting that spells F-U-N-N-A-L.'},
  {id:'carto', name:"Map-maker's Hut", dm:4000, g:1500, blurb:'Charts every prospect island ever found.'},
  {id:'boats', name:'Fishing Fleet', dm:5500, g:2000, blurb:'Three little boats. Very proud.'},
  {id:'market', name:'Market Square', dm:7500, g:3000, blurb:'Trade, gossip and a man who sells only spoons.'},
  {id:'clock', name:'Harbour Clocktower', dm:10000, g:4000, blurb:'Chimes at 16:30 to shame everyone.'},
  {id:'observatory', name:'Navigator\'s Observatory', dm:12500, g:6000, blurb:'Roughly six months of DMs. Look how far you have sailed.'},
  {id:'beacon', name:'The Grand Lighthouse', dm:20000, g:10000, blurb:'Visible from every inbox in the land.'},
  {id:'sky', name:'Sky Galleon Dock', dm:35000, g:20000, blurb:'Flying ships. Obviously.'},
  {id:'bridge', name:'Bridge of a Hundred Lanterns', dm:60000, g:40000, blurb:'The legend is complete.'},
];

/* ---------- Parrot companion (stage ids kept) ---------- */
const MOTH_STAGES = [
  {at:0, name:'Speckled Egg'}, {at:50, name:'Hatchling'}, {at:300, name:'Fluffy Chick'}, {at:1000, name:'Parrot'},
  {at:3000, name:'Scarlet Macaw'}, {at:8000, name:'Phoenix Parrot'},
];
const MOTH_LINES = ['*squawk* Pieces of eight!','I believe in you. Mostly.','That DM had real warmth. Squawk.','Have you considered: one more?','I ate a biscuit. Not sorry.','Prospects love a specific compliment.','Small parrot, large ambitions.','The fog fears us.','Tea break after ten more?','Polly wants a client.'];
const TITLES = [[1,'Deckhand'],[3,'Swabbie'],[6,'Powder Monkey'],[10,'Lookout'],[15,'Bosun'],[20,'Navigator'],[25,'Quartermaster'],[30,'First Mate'],[40,'Captain'],[50,'Commodore'],[60,'Admiral'],[75,'Pirate Lord'],[90,'Pirate King'],[100,'Legend of the Seven Seas']];

/* ---------- Achievements (ids stored: never change) ---------- */
const FAMILIES = [
  ['dm','Send {n} lifetime DMs','Outreach',[250,2500,7500,20000,40000,75000],['Loose Cannon','Broadside','Full Volley','Thunder of the Fleet','Ten Thousand Cannons','The Endless Barrage']],
  ['r','Log {n} genuine responses','Responses',[5,25,100,250,600,1500],['Echo Catcher','Tide Listener','Reply Wrangler','Conversation Cartographer','Voice of the Bay','The Answered']],
  ['v','Log {n} video appraisal requests','Videos',[1,10,40,100,250,600],['First Reel','Projectionist','Lantern Show','Picture Palace','Silver Screen Captain','Grand Cinematographer']],
  ['m','Log {n} confirmed meeting requests','Meetings',[1,10,30,75,150,400],['First Handshake','Table Setter','Parley Pro','Council Caller','Summit Host','The Diplomat']],
  ['c','Gain {n} confirmed paying clients','Clients',[1,5,15,40,80,150],['First Anchor','Fleet Starter','Trade Winds','Merchant Prince','Harbour Magnate','Admiral of Accounts']],
  ['bestDay','Personally send {n} DMs in one day','Daily',[30,50,75,90,125,150],['Brisk Tide','Swell','Rogue Wave','High Tide','Storm Surge','The Maelstrom']],
  ['activeDays','Log DMs on {n} different working days','Consistency',[5,25,75,150,300,600],['Signed Aboard','Regular Crew','Old Salt','Pillar of the Pier','Barnacle-Grade Loyalty','Part of the Coastline']],
  ['bestStreak','Reach a {n}-day qualifying streak','Consistency',[3,10,25,50,75,200],['Spark Chain','Tidy Run','Unbroken Wick','Long Burn','Ironwick','Perpetual Flame']],
  ['teamWins','Contribute to {n} team-target days','Team',[5,30,75,150,300,1000],['Crewmates','The Dream Team','Harbour Duo','Two-Ship Legend','Twin Flagships','The Thousand-Day Empire']],
  ['sessions','Complete {n} Lock In voyages','Focus',[1,10,40,100,250,600],['Cast Off','Focused','Deep Water','Monk of the Mist','The Lock-In Legend','The Still Point']],
  ['lockMin','Spend {n} minutes locked in','Focus',[60,300,1200,3000,7500,15000],['First Watch','Long Watch','Night Watchman','Tidewatcher','Keeper of Hours','Timeless']],
  ['bestSession','Log {n} DMs in a single voyage','Focus',[10,20,35,50,75,100],['Quick Oar','Sprint Rower','Swift Current','Jet Stream','Lightning Skiff','Speed of Light']],
  ['earned','Earn {n} doubloons','Treasure',[500,5000,20000,60000,150000,400000],['Pocket Change','Jingling','Treasure Chest','Doubloon Baron','Doubloon Tycoon','Emperor of Gold']],
  ['spent','Spend {n} doubloons','Treasure',[200,2000,10000,30000,80000,200000],['Window Shopper','Patron','Big Spender','Connoisseur','Collector Royal','Patron of the Seas']],
  ['bosses','Help defeat {n} daily sea foes','Battles',[1,10,50,150,300,750],['Fog Lifter','Monster Hunter','Foebane','Stormbreaker','Weatherlord','Clear Seas Forever']],
  ['finalBlows','Fire the final shot {n} times','Battles',[1,10,30,75,150,300],['The Final Shot',"Closer's Instinct",'Executioner of Fog','Last Word','Coup de Gr\u00e2ce',"Fate's Hand"]],
  ['chalWon','Win {n} multiplayer challenges','Rivalry',[1,5,20,50,100,250],['First Blood','Duellist','Champion','Gladiator','Warlord','Undisputed']],
  ['chalPlayed','Complete {n} multiplayer challenges','Rivalry',[1,10,30,60,100,250],['Game On','Up For It','Competitor','Veteran','The Ultimate Rivalry','Arena Eternal']],
  ['collected','Find {n} different treasures','Treasure',[2,6,12,18,24,30],['Beachcomber','Treasure Hunter','Curator','Archivist','Grand Collector','The Complete Hoard']],
  ['level','Reach level {n}','Progress',[5,15,30,50,75,100],['Swabbie','Lookout','Quartermaster','Commodore','Pirate Lord','Legend of the Seas']],
  ['teamDm','Your crew sends {n} DMs together','Team',[1000,5000,12500,25000,50000,100000],['Little Harbour','Busy Port','Bustling Bay','City of Sails','Pirate Metropolis','Constellation Fleet']],
  ['weeks','Help defeat {n} weekly bosses','Battles',[1,5,15,30,52,150],['Week Warrior','Five-Week Flame','Season of Plunder','Half-Year Hero','Year of the Fleet','Three-Year Tide']],
  ['built','Complete {n} Funnal Cove projects','World',[1,3,5,7,9,12],['Carpenter','Shipwright','Architect','Town Planner','Harbourmaster','Founder of Funnal Cove']],
  ['stretch','Contribute to {n} days of 150+ crew DMs','Daily',[1,5,15,30,60,120],['Overtime Glow','Extra Mile','Overachiever','The Furnace','Inferno','Supernova']],
];
const SINGLES = [
  ['first','First Contact','Send your first DM','common','Outreach',['dm',1]],
  ['ice','Breaking the Ice','Send 10 DMs','common','Outreach',['dm',10]],
  ['century','Century Club','Send 100 lifetime DMs','uncommon','Outreach',['dm',100]],
  ['adventurer','Inbox Adventurer','Send 500 DMs','rare','Outreach',['dm',500]],
  ['four','Four Figures','Send 1,000 DMs','rare','Outreach',['dm',1000]],
  ['longgame','The Long Game','Send 10,000 DMs','legendary','Outreach',['dm',10000]],
  ['unstoppable','The Unstoppable','Send 50,000 DMs','transcendent','Outreach',['dm',50000]],
  ['slayer','Century Slayer','Personally send 100 DMs in one day','legendary','Daily',['bestDay',100]],
  ['unbreakable','The Unbreakable','Complete 100 qualifying working days in a row','legendary','Consistency',['bestStreak',100]],
  ['balanced','Perfectly Balanced','Finish a 100-DM day with exactly 50 each','epic','Team',['perfect50',1]],
  ['comebackking','Comeback King','Be 15+ DMs behind and still win the day','rare','Rivalry',['comebacks',1]],
  ['rainmaker','The Rainmaker','Contribute towards 100 crew paying clients','transcendent','Clients',['rainmaker',100]],
  ['setcomplete','The Collector','Complete any treasure set','epic','Treasure',['sets',1]],
  ['allsets','Museum of the Tides','Complete all six treasure sets','mythic','Treasure',['sets',6]],
  ['early','Dawn Raider','Log a DM before 08:30','uncommon','Daily',['earlyDm',1]],
  ['speed50','Morning Rush','Send 50 DMs before noon','epic','Daily',['morning50',1]],
  ['photofinish','Photo Finish','Crew target reached in the last 15 minutes of the day','rare','Team',['photoFinish',1]],
  ['friday','Friday Finisher','Fire the final shot on a Friday','uncommon','Battles',['fridayBlow',1]],
  ['overtaker','Overtaker','Overtake your rival 10 times','rare','Rivalry',['overtakes',10]],
  ['overtaker2','Lead Changer','Overtake your rival 100 times','legendary','Rivalry',['overtakes',100]],
  ['rarefog','Rare Waters','Help defeat a rare sea foe','epic','Battles',['rareBosses',1]],
  ['roster','Monster Manual','Help defeat every regular sea foe at least once','legendary','Battles',['rosterDone',1]],
  ['prest1','Rekindled','Prestige for the first time','epic','Progress',['prestige',1]],
  ['prest3','Thrice Kindled','Prestige three times','legendary','Progress',['prestige',3]],
  ['prest5','Phoenix Captain','Prestige five times','mythic','Progress',['prestige',5]],
  ['hatch','Hatched!','Your parrot egg hatches','common','Companion',['mothStage',1]],
  ['wings','Pretty Polly','Your companion becomes a Parrot','rare','Companion',['mothStage',3]],
  ['greatmoth','Phoenix Rising','Fully evolve your parrot','mythic','Companion',['mothStage',5]],
  ['redeemed','Back From the Brig','Complete a redemption quest','uncommon','Forfeits',['redemptions',1]],
  ['shielded','Shield Bearer','Use a Lantern Shield','uncommon','Forfeits',['shieldsUsed',1]],
  ['merchant','Pell\'s Favourite','Buy something from the travelling barge','uncommon','Treasure',['merchantBuys',1]],
  ['decorator','Island Decorator','Fill all six spots in your hideout','rare','World',['decorFull',1]],
  ['firstresp','Someone Answered!','Log your first response','common','Responses',['r',1]],
  ['quests10','Errand Runner','Claim 10 quest rewards','uncommon','Quests',['questsClaimed',10]],
  ['quests100','Quest Machine','Claim 100 quest rewards','epic','Quests',['questsClaimed',100]],
  ['quests500','Saga Keeper','Claim 500 quest rewards','mythic','Quests',['questsClaimed',500]],
  ['sprint','The Century Sprint','Hit the target in a co-op Century Sprint','rare','Rivalry',['sprintWins',1]],
  ['s_comeback','The Comeback','???','legendary','Secret',['bigComebacks',1],true,'Be 30+ DMs behind and still win the day'],
  ['s_partners','Perfect Partners','???','epic','Secret',['perfectEqual',1],true,'Finish a successful crew day with exactly equal contributions'],
  ['s_odds','Against All Odds','???','legendary','Secret',['againstOdds',1],true,'Defeat the weekly boss after missing the first working day of the week'],
  ['s_final','The Final Second','???','epic','Secret',['finalSecond',1],true,'Win a timed challenge with a DM in its last 10 seconds'],
  ['s_midnight','Midnight Lantern','???','rare','Secret',['lateSession',1],true,'Finish a Lock In voyage that started after 21:00'],
  ['s_palindrome','Palindrome Day','???','rare','Secret',['palindrome',1],true,'End a day with a palindromic DM count of 11 or more'],
  ['s_answer','The Answer','???','uncommon','Secret',['answer42',1],true,'End a day on exactly 42 DMs'],
  ['s_seven','Lucky Seven','???','epic','Secret',['lucky7',1],true,'Log 7 responses in a single day'],
  ['s_triple','Triple Crown','???','epic','Secret',['triple',1],true,'Log a response, a video request and a meeting request on the same day'],
  ['s_full','Full House','???','legendary','Secret',['fullHouse',1],true,'Log all five action types on the same day'],
  ['s_sync','Synchronised Swimmers','???','rare','Secret',['syncDm',1],true,'Both captains log a DM within the same 3 seconds'],
  ['s_fogwhisper','Monster Whisperer','???','epic','Secret',['fastBoss',1],true,'Defeat the daily foe before 11:00'],
  ['s_unseen','The Unseen Legend','???','transcendent','Secret',['mythics',5],true,'Earn five mythic achievements'],
  ['wardrobe','Fashion of the Fleet','Own 25 cosmetics','rare','Style',['cosmetics',25]],
  ['wardrobe2','Admiral of Style','Own 60 cosmetics','legendary','Style',['cosmetics',60]],
  ['fullrig','Fully Rigged','Customise your hull, sails, flag and figurehead','rare','Style',['fullRig',1]],
];
const ACHIEVEMENTS = [];
FAMILIES.forEach(([metric,desc,cat,targets,names])=>{targets.forEach((n,i)=>{let rar=RARITIES[i];if(metric==='teamWins'&&i===5)rar='transcendent';
  ACHIEVEMENTS.push({id:`${metric}_${i}`,name:names[i],desc:desc.replace('{n}',n.toLocaleString('en-GB')),rar,cat,metric,target:n,tier:TIERS[i],fam:metric});});});
SINGLES.forEach(([id,name,desc,rar,cat,[metric,target],secret,reveal])=>ACHIEVEMENTS.push({id,name,desc,rar,cat,metric,target,secret:!!secret,reveal}));
const ACH_BY_ID = Object.fromEntries(ACHIEVEMENTS.map(a=>[a.id,a]));

/* ---------- Quests ---------- */
const DAILY_QUESTS = [
  {id:'dm10', name:'Send 10 personalised DMs', m:'dDm', n:10, xp:40, g:12},
  {id:'dm25', name:'Send 25 DMs', m:'dDm', n:25, xp:80, g:25},
  {id:'dm40', name:'Send 40 DMs', m:'dDm', n:40, xp:140, g:40},
  {id:'lock1', name:'Complete one Lock In voyage', m:'dSes', n:1, xp:60, g:15},
  {id:'resp1', name:'Log a genuine response', m:'dResp', n:1, xp:50, g:15},
  {id:'boss', name:'Help sink today\'s sea foe', m:'dBoss', n:1, xp:70, g:20},
  {id:'early5', name:'Send 5 DMs before 10:00', m:'dEarly', n:5, xp:50, g:15},
  {id:'share', name:'Make a meaningful contribution (30% of the target)', m:'dShare', n:30, xp:70, g:20},
  {id:'burst', name:'Log 15 DMs in a single voyage', m:'dBestSes', n:15, xp:90, g:25},
];
const WEEKLY_QUESTS = [
  {id:'w150', name:'Send 150 individual DMs', m:'wDm', n:150, xp:400, g:120},
  {id:'w250', name:'Send 250 individual DMs', m:'wDm', n:250, xp:650, g:200},
  {id:'wlock5', name:'Complete five voyages', m:'wSes', n:5, xp:350, g:100},
  {id:'wboss5', name:'Help defeat five daily foes', m:'wBoss', n:5, xp:500, g:150},
  {id:'wteam', name:'Defeat the weekly boss', m:'wWeekly', n:1, xp:450, g:140},
  {id:'wchal', name:'Complete two shared challenges', m:'wChal', n:2, xp:300, g:90},
  {id:'wresp', name:'Log 5 responses', m:'wResp', n:5, xp:350, g:100},
];
const LONG_QUESTS = [
  {id:'l1k', name:'Send 1,000 lifetime DMs', m:'dm', n:1000, xp:1500, g:500},
  {id:'l5k', name:'Send 5,000 lifetime DMs', m:'dm', n:5000, xp:5000, g:1500},
  {id:'lprest', name:'Reach a prestige milestone', m:'prestige', n:1, xp:3000, g:1000},
  {id:'lclients', name:'Win 10 clients as a crew', m:'teamClients', n:10, xp:6000, g:2000},
  {id:'lteam100', name:'Complete 100 successful crew days', m:'teamWins', n:100, xp:5000, g:1500},
  {id:'lobs', name:'Build the Navigator\'s Observatory', m:'built', n:9, xp:8000, g:2500},
];

/* ---------- Reminders ---------- */
const REMINDERS = {
  nobody:["Your future clients are currently unaware you exist. Sort that out.","The leaderboard is looking suspiciously unemployed.","Two grown captains. One target. An alarming lack of cannon fire.","Congratulations on achieving absolutely nothing today. There's still time.","The sea foe has made itself a cup of tea. It plans to stay.","Funnal Cove's economy is collapsing. Have you considered sending a DM?","Your prospects haven't rejected you yet. Give them a chance.","The cannons are loaded. Nobody's firing."],
  lagger:["{leader} has sent {lead} DMs. {lagger} appears to have entered early retirement.","{lagger}'s captain has started applying for other ships.","{lagger}, your parrot is pretending not to know you.","Breaking: {lagger} last seen staring at a blank DM. Search party assembled.","{leader} is carrying this ship on their back. Very noble. Very tired."],
  ahead:["{leader} is {gap} DMs ahead. {lagger}, this is your villain origin story.","The crown is drifting towards {leader}. {lagger}, are you just going to let that happen?","{leader} leads by {gap}. The gulls are taking bets."],
  overtaken:["Plot twist: {leader} has overtaken {lagger}!","{leader} just stole the lead. {lagger}'s parrot gasped audibly.","Lead change! {lagger} is now officially the underdog."],
  close:["{left} DMs to go. The beast is wheezing. Finish it.","The foe is on {left} HP. Somebody be the hero.","So close you can smell the victory grog. {left} left."],
  deadline:["{mins} minutes left and {left} DMs to go. Not ideal. Not impossible.","The clocktower is judging you. {left} DMs, {mins} minutes.","Final warning: {left} DMs to go before the sea wins today."],
  missed:["Yesterday the sea won. Today we get revenge.","Yesterday's foe is still gloating. Don't let it happen twice.","The Herald printed yesterday's miss in very large letters. Sort it out."],
  won:["Foe sunk! Everything after this is pure plunder.","Victory! Stretch goals glitter at 125, 150 and 200.","Victory! Your Majesty may now enjoy a smug biscuit."],
  steady:["Keep firing. 100 DMs won't send themselves, Captain.","Every cannonball counts. Probably. We haven't checked.","A personalised DM a day keeps the kraken away. Well, 100 do.","Somewhere out there is a business that needs you and doesn't know it yet."],
};
const JOKES = ["Steady on, cowboy.","Your mouse is faster than your sales pitch.","Nice try. The button remembers.","One at a time, you absolute machine.","The inbox needs a breather.","The cannon is still reloading.","Patience, captain. Even cannons need five seconds.","Hold your seahorses.","That's not how personalisation works.","The gulls saw that. They're judging."];
const HEADLINES = {
  win:["{top} FIRES {topn} DMS, STILL REFUSES TO TAKE A BREAK","SEA FOE SUNK AGAIN. MONSTER DESCRIBED AS \"QUITE UPSET\"","{team} CANNONBALLS LIGHT UP THE BAY. RESIDENTS SQUINT","{top} CLAIMS VICTORY. {bottom} DEMANDS RECOUNT"],
  miss:["ECONOMY IN CRISIS AFTER CREW MISSES TARGET BY {short}","SEA FOE SURVIVES, THROWS SMALL PARTY","COVE DARK AS CREW FALLS {short} SHORT","\"WE'LL GET IT TOMORROW,\" SAY EXHAUSTED CAPTAINS"],
  client:["NEW CLIENT ARRIVES. COVE DECLARES PUBLIC HOLIDAY","GROG SHORTAGE AS CLIENT SIGNS","BAY ERUPTS IN CELEBRATION: \"WE HAVE A CLIENT\""],
  stretch:["{team} DMS?! LOCAL SCIENTISTS BAFFLED","OVERTIME CANNON FIRE VISIBLE FROM SPACE"],
  zero:["{zero} SPOTTED DOING ABSOLUTELY NOTHING, SOURCES CONFIRM","WHERE WAS {zero}? INVESTIGATION LAUNCHED"],
};
const AWARDS = [
  {id:'champ', name:'Outreach Champion', rule:'Most DMs this week', m:'wDm'},
  {id:'reply', name:'Reply Magnet', rule:'Most responses this week', m:'wResp'},
  {id:'wizard', name:'Appraisal Wizard', rule:'Most video requests this week', m:'wVid'},
  {id:'meet', name:'Meeting Machine', rule:'Most confirmed meeting requests this week', m:'wMeet'},
  {id:'closer', name:'The Closer', rule:'Most confirmed clients this week', m:'wClient'},
  {id:'improved', name:'Most Improved', rule:'Biggest % rise in DMs vs last week (min. 20 DMs)', m:'wImprove'},
  {id:'comeback', name:'Comeback King', rule:'Most daily comebacks this week (15+ behind, finished ahead)', m:'wComeback'},
  {id:'consistent', name:'Consistency Champion', rule:'Most working days with 30+ DMs this week', m:'wSteady'},
  {id:'teamplayer', name:'Team Player', rule:'Most final shots plus target days contributed to', m:'wTeam'},
];

/* ============================== v4 CONTENT ============================== */
DEFAULT_CONFIG.sightingMode='auto'; // 'auto' = game picks the daily time itself; 'email' = a scheduled email task opens the sighting
/* ---------- Emissary flag: crew DMs today raise the grade; higher grade = DMs worth more ---------- */
const EMISSARY=[{at:0,mult:1,name:'Grade I'},{at:20,mult:1.2,name:'Grade II'},{at:45,mult:1.4,name:'Grade III'},{at:70,mult:1.7,name:'Grade IV'},{at:100,mult:2,name:'Grade V'}];
const emGrade=n=>EMISSARY.reduce((g,x,i)=>n>=x.at?i:g,0);
/* ---------- Golden Tide: one 25-minute double-score window every working day ---------- */
const GOLDEN_LEN=25;
const GTC=new Map();function goldenFor(date){let g=GTC.get(date);if(g)return g;const s=570+h32(date+'golden')%(1000-570-GOLDEN_LEN);g={start:s,end:s+GOLDEN_LEN};GTC.set(date,g);return g;} // between 09:30 and ~16:15
/* ---------- Limited-time pets ---------- */
// season: evergreen | winter (Dec-Feb) | spring (Mar-May) | summer (Jun-Aug) | autumn (Sep-Nov). Rarer = shorter sighting, more DMs needed, cooler pet.
const PET_RARITY={common:{p:45,win:30,need:3},uncommon:{p:27,win:25,need:4},rare:{p:15,win:20,need:5},epic:{p:8,win:15,need:6},legendary:{p:4,win:10,need:7},mythic:{p:1,win:5,need:8}};
const PETS=[
  {id:'p_pup',name:'Ship Pup',sp:'dog',col:'#D9A066',col2:'#F4E2C6',ear:'flop',rar:'common',season:'evergreen'},
  {id:'p_cat',name:'Harbour Cat',sp:'cat',col:'#F2A33A',col2:'#FFFFFF',rar:'uncommon',season:'evergreen',x:'stripes'},
  {id:'p_otter',name:'Sea Otter',sp:'otter',col:'#9A6B45',col2:'#E9D2B4',rar:'rare',season:'evergreen'},
  {id:'p_corgi',name:'Captain Corgi',sp:'dog',col:'#E8934A',col2:'#FFFFFF',ear:'point',rar:'epic',season:'evergreen',x:'tricorn'},
  {id:'p_seadragon',name:'Baby Sea Dragon',sp:'dragon',col:'#3FA59A',col2:'#BFF0E4',rar:'legendary',season:'evergreen'},
  {id:'p_phoenixhound',name:'Phoenix Hound',sp:'dog',col:'#F2683A',col2:'#FFE07A',ear:'point',rar:'mythic',season:'evergreen',x:'flame'},
  {id:'p_hedgehog',name:'Conker Hedgehog',sp:'hedgehog',col:'#8A6244',col2:'#F2D6B6',rar:'common',season:'autumn'},
  {id:'p_fox',name:'Fox Kit',sp:'cat',col:'#E8763E',col2:'#FFFFFF',ear:'point',rar:'uncommon',season:'autumn',x:'foxtail'},
  {id:'p_owl',name:'Lantern Owl',sp:'bird',col:'#B98552',col2:'#F4E2C6',rar:'rare',season:'autumn',x:'lantern'},
  {id:'p_emberwolf',name:'Ember Wolf',sp:'dog',col:'#55606E',col2:'#F2A33A',ear:'point',rar:'epic',season:'autumn',x:'embers'},
  {id:'p_pumpkindragon',name:'Pumpkin Dragon',sp:'dragon',col:'#E8763E',col2:'#5FAE4E',rar:'legendary',season:'autumn'},
  {id:'p_ghostkraken',name:'Ghost Kraken Pup',sp:'kraken',col:'#CFE5E1',col2:'#9B5DE5',rar:'mythic',season:'autumn',x:'ghost'},
  {id:'p_penguin',name:'Penguin Chick',sp:'bird',col:'#3F4A5C',col2:'#FFFFFF',rar:'common',season:'winter',x:'penguin'},
  {id:'p_snowpug',name:'Snow Pug',sp:'dog',col:'#F4E9D8',col2:'#4A3F3A',ear:'flop',rar:'uncommon',season:'winter',x:'scarf'},
  {id:'p_arcticfox',name:'Arctic Fox',sp:'cat',col:'#FFFFFF',col2:'#CFE3F2',ear:'point',rar:'rare',season:'winter',x:'foxtail'},
  {id:'p_husky',name:'Lantern Husky',sp:'dog',col:'#7F8A95',col2:'#FFFFFF',ear:'point',rar:'epic',season:'winter',x:'lantern'},
  {id:'p_frostdragon',name:'Frost Dragon',sp:'dragon',col:'#8FD0F0',col2:'#FFFFFF',rar:'legendary',season:'winter',x:'frost'},
  {id:'p_auroranarwhal',name:'Aurora Narwhal',sp:'narwhal',col:'#7F8AD9',col2:'#E6F0FF',rar:'mythic',season:'winter',x:'aurora'},
  {id:'p_duckling',name:'Puddle Duckling',sp:'bird',col:'#F7D24A',col2:'#F2A33A',rar:'common',season:'spring',x:'duck'},
  {id:'p_bunny',name:'Dune Bunny',sp:'bunny',col:'#F2E6D8',col2:'#F4A6C0',rar:'uncommon',season:'spring'},
  {id:'p_axolotl',name:'Axolotl',sp:'axolotl',col:'#F7A6C4',col2:'#E0457B',rar:'rare',season:'spring'},
  {id:'p_dalmatian',name:'Lucky Dalmatian',sp:'dog',col:'#FFFFFF',col2:'#3F3A40',ear:'flop',rar:'epic',season:'spring',x:'spots'},
  {id:'p_blossomdragon',name:'Blossom Dragon',sp:'dragon',col:'#F4A6C0',col2:'#FFF0F6',rar:'legendary',season:'spring',x:'petals'},
  {id:'p_rainbowseahorse',name:'Rainbow Seahorse',sp:'seahorse',col:'#9B5DE5',col2:'#FFE07A',rar:'mythic',season:'spring',x:'rainbow'},
  {id:'p_hermit',name:'Hermit Crab',sp:'crab',col:'#E8866A',col2:'#E8C36A',rar:'common',season:'summer'},
  {id:'p_turtle',name:'Sea Turtle',sp:'turtle',col:'#5DBE9C',col2:'#A8704A',rar:'uncommon',season:'summer'},
  {id:'p_redpanda',name:'Red Panda',sp:'cat',col:'#C9543A',col2:'#FFFFFF',ear:'round',rar:'rare',season:'summer',x:'stripes'},
  {id:'p_goldie',name:'Pirate Retriever',sp:'dog',col:'#E8BC52',col2:'#FFF0C8',ear:'flop',rar:'epic',season:'summer',x:'bandana'},
  {id:'p_stormdragon',name:'Storm Dragon',sp:'dragon',col:'#4A5A8C',col2:'#FFE07A',rar:'legendary',season:'summer',x:'storm'},
  {id:'p_celestialwhale',name:'Celestial Whale',sp:'narwhal',col:'#2E3A6C',col2:'#FFF3B8',rar:'mythic',season:'summer',x:'stars'},
];
const PET_BY_ID=Object.fromEntries(PETS.map(p=>[p.id,p]));
function seasonOf(date){const m=+date.slice(5,7);return m===12||m<=2?'winter':m<=5?'spring':m<=8?'summer':'autumn';}
function seasonEnds(date){const y=+date.slice(0,4),m=+date.slice(5,7);const endM={winter:2,spring:5,summer:8,autumn:11}[seasonOf(date)];const yy=(m===12)?y+1:y;return new Date(Date.UTC(yy,endM,0)).toISOString().slice(0,10);}
function rollRarity(r){let x=r%100;for(const k of Object.keys(PET_RARITY)){if(x<PET_RARITY[k].p)return k;x-=PET_RARITY[k].p;}return 'common';}
function petFor(date,rar){const pool=PETS.filter(p=>p.rar===rar&&(p.season===seasonOf(date)||p.season==='evergreen'));return pool[h32(date+rar+'pet')%pool.length];}

/* ---------- More cosmetics: colour variants and two new categories ---------- */
const MORE_ITEMS=[];
[['red','Red','#D9485F'],['blue','Blue','#4A7EC2'],['green','Green','#3FA57E'],['purple','Purple','#8E5DD9'],['gold','Gold','#E2AE45'],['pink','Pink','#F08CB0']].forEach(([k,n,col],i)=>{
  MORE_ITEMS.push({id:'hat_bandana_'+k,name:n+' Bandana',cat:'hat',st:'bandana',col,price:120+i*40,lvl:2+i});
  MORE_ITEMS.push({id:'hat_beanie_'+k,name:n+' Beanie',cat:'hat',st:'beanie',col,price:180+i*50,lvl:3+i});
  MORE_ITEMS.push({id:'coat_'+k,name:n+' Deck Coat',cat:'coat',st:'trim',col,col2:'#F4EFE4',price:260+i*80,lvl:4+i*2});
  MORE_ITEMS.push({id:'sail_stripe_'+k,name:n+' Stripe Sails',cat:'sail',col:'#FFFCF2',col2:col,pat:'stripe',price:400+i*120,lvl:5+i*2});
  MORE_ITEMS.push({id:'hull_'+k+'2',name:n+' Lacquer Hull',cat:'hull',col,col2:shade(col),price:600+i*200,lvl:8+i*3});
  MORE_ITEMS.push({id:'flag_skull_'+k,name:n+' Jolly Roger',cat:'flag',col,sym:'skull',sc:'#FFFFFF',price:300+i*90,lvl:4+i*2});
});
[['hat_tricorn_red','Crimson Tricorn','#8E1F3A',2200,20],['hat_tricorn_white','Admiralty White Tricorn','#F4EFE4',3000,24],['hat_tricorn_gold','Golden Tricorn','#E2AE45',9000,44]].forEach(([id,name,col,price,lvl])=>MORE_ITEMS.push({id,name,cat:'hat',st:'tricorn',col,price,lvl}));
[['tr_bubbles','Bubble Wake','bubbles',350,4],['tr_sparkle','Sparkle Wake','sparkle',900,9],['tr_petals','Petal Wake','petals',1600,14],['tr_flame','Flame Wake','flame',3200,22],['tr_rainbow','Rainbow Wake','rainbow',6000,32],['tr_stars','Stardust Wake','stars',12000,48]].forEach(([id,name,st,price,lvl])=>MORE_ITEMS.push({id,name,cat:'trail',st,price,lvl}));
[['shot_fire','Fireballs','fire',500,5],['shot_snow','Snowballs','snow',700,7],['shot_heart','Love Letters','heart',1100,11],['shot_glitter','Glitter Bombs','glitter',2000,16],['shot_duck','Rubber Ducks','duck',3500,26],['shot_drop','Funnal Drops','drop',0,12,'track']].forEach(([id,name,st,price,lvl,tr])=>MORE_ITEMS.push(tr?{id,name,cat:'shot',st,track:lvl}:{id,name,cat:'shot',st,price,lvl}));
function shade(hex){const n=parseInt(hex.slice(1),16);const f=v=>Math.max(0,Math.round(v*.72));return '#'+[f(n>>16),f(n>>8&255),f(n&255)].map(v=>v.toString(16).padStart(2,'0')).join('');}
MORE_ITEMS.forEach(i=>{ITEMS.push(i);ALL_ITEMS[i.id]=i;if(i.track){i.price=0;i.lvl=i.track;TRACK.push(i);}});
TRACK.sort((a,b)=>a.track-b.track);
Object.assign(CAT_NAMES,{trail:'Wakes',shot:'Cannonballs'});
// re-order category tabs
const CAT_ORDER=['hat','face','coat','hull','sail','flag','figure','deck','trail','shot','decor','moth','effect','shield'];

/* ---------- Voyage (Lock In) ---------- */
const VOYAGE_DIFF={calm:{name:'Calm waters',rate:.5,xp:40,g:15,desc:'A grumpy seal blocks the route'},rough:{name:'Rough seas',rate:.8,xp:90,g:35,desc:'A sea serpent hunts your ship'},legend:{name:'Legendary',rate:1.15,xp:200,g:80,desc:'The Kraken itself rises'}};
const ENCOUNTERS=[
  {id:'whale',text:'A whale breaches off the starboard bow!'},{id:'dolphins',text:'A pod of dolphins races alongside.'},{id:'bottle',text:'A message in a bottle bobs past. Tap it!',tap:true},
  {id:'turtle',text:'An old sea turtle waves a flipper.'},{id:'flyingfish',text:'Flying fish skip over the waves.'},{id:'ghost',text:'A ghost ship drifts by in the mist... spooky.'},
  {id:'spout',text:'A waterspout twists on the horizon.'},{id:'rainbow',text:'A rainbow arcs over the sea.'},{id:'jelly',text:'Glowing jellyfish light up the water.'},
  {id:'chest',text:'A floating chest! Tap it before it sinks!',tap:true},{id:'stars',text:'A shower of shooting stars.'},{id:'mermaid',text:'Was that... a mermaid? She waved.'},
  {id:'barge',text:'Pell\'s barge toots its horn as it passes.'},{id:'gulls',text:'Gary and friends hitch a ride on the mast.'},
];

/* ---------- How to play ---------- */
const HELP=[
  ['The goal','Your crew (Sam and James together) aims for 100 Instagram DMs every working day. Each DM you log fires a cannonball at today\'s sea foe, which has 100 HP. Sink it and you both get a reward.'],
  ['The five buttons','DM sent: tap once after each personalised DM (5-second reload). Response, Video, Meeting, Client: tap when it really happens. Meetings and clients ask for the prospect\'s name, need a press-and-hold, and only pay out once the other captain confirms them on the Harbour screen.'],
  ['XP, levels and doubloons','Everything you log earns XP and doubloons. XP raises your level (1 to 100) and rank. Every level pays doubloons and many unlock free cosmetics: see the Captain\'s Log. Spend doubloons in the Shop or on Funnal Cove building projects.'],
  ['Emissary flag','The flag above both ships grows with the crew\'s DMs today: Grade I at 0, II at 20, III at 45, IV at 70, V at 100. Higher grades make each DM worth more (up to double). It resets every morning.'],
  ['Golden Tide','Once every working day there\'s a 25-minute Golden Tide at a surprise time between 09:30 and 16:40. Everything logged during it scores double. Stack it with Grade V for 4x DMs.'],
  ['Pet sightings','Once a working day, between 07:00 and 19:00, a limited-time pet is spotted. Log the shown number of DMs before the window closes, then claim it. Rarer pets give shorter windows and need more DMs. Pets rotate with the seasons, so some only appear a few months a year.'],
  ['Lock In voyages','Pick a time, choose a sea monster to fight and set sail. Every DM fires at the monster and pushes your ship on. Strange things appear at sea: tap bottles and chests for loot. When the timer ends you reach Treasure Island and open a chest worth more the more DMs you sent. Full screen mode leaves just the ship and the DM button (space bar works too).'],
  ['Challenges','From Lock In, challenge the other captain: Showdown, Rivalry, Treasure Race, or co-op Century Sprint, Last Push, Boss Rush and Kraken Raid. The other captain has to accept.'],
  ['Forfeits','If you log zero DMs on a working day, or the crew misses the target, you owe a forfeit. Spin the wheel in the Herald. Forfeits are silly and temporary. Days off you add in Settings never count. Lantern Shields cancel one.'],
  ['Honesty','All counts are self-reported. Caps, reload timers and crew confirmation stop accidental spam, but the game works because you both log honestly.'],
];

[['pet1','New Best Friend','Claim your first pet','uncommon','Pets',['pets',1]],['pet5','Menagerie','Collect 5 different pets','rare','Pets',['pets',5]],['pet15','Noah\'s Galleon','Collect 15 different pets','legendary','Pets',['pets',15]],['pet30','Every Creature Under the Sea','Collect all 30 pets','transcendent','Pets',['pets',30]],
 ['petleg','Here Be Dragons','Claim a legendary or mythic pet','epic','Pets',['petLegend',1]],['petmyth','One in a Hundred','Claim a mythic pet','mythic','Pets',['petMythic',1]],
 ['em5','Grade Five Emissary','Fire a DM while the crew flies a Grade V emissary flag','epic','Team',['em5',1]],
 ['gold1','Golden Hour Hero','Send 25 DMs during Golden Tides','uncommon','Daily',['goldenDms',25]],['gold2','Midas Touch','Send 500 DMs during Golden Tides','legendary','Daily',['goldenDms',500]],
 ['isle1','X Marks the Spot','Reach Treasure Island at the end of a voyage','common','Focus',['islands',1]],['isle50','Island Hopper','Reach Treasure Island 50 times','epic','Focus',['islands',50]],
 ['vb1','Monster Hunter','Defeat a voyage monster','uncommon','Focus',['vBoss',1]],['vb25','Kraken Wrangler','Defeat 25 voyage monsters','legendary','Focus',['vBoss',25]],
].forEach(([id,name,desc,rar,cat,[metric,target]])=>{const a={id,name,desc,rar,cat,metric,target};ACHIEVEMENTS.push(a);ACH_BY_ID[id]=a;});

/* ============================== v6: more jokes ============================== */
Object.assign(REMINDERS,{
  nobody:[...REMINDERS.nobody,"Your inbox called. It's lonely.","The sea foe is sunbathing. Unbothered. Moisturised. Undefeated.","Fun fact: zero DMs converts at exactly 0%.","Gary has started a book club because nobody is sending DMs.","Even the barnacles are more productive right now.","The cannons are cold. The tea is not. Choose wisely."],
  lagger:[...REMINDERS.lagger,"{lagger} is currently in stealth mode. Very stealthy. Too stealthy.","{leader}: {lead}. {lagger}: a strong commitment to mystery.","Gary is drafting a missing-person poster for {lagger}.","{lagger}'s parrot is now taking DMs from {leader} out of pity."],
  ahead:[...REMINDERS.ahead,"{leader} is {gap} ahead and has started humming. Loudly.","{gap} DMs between you. That's roughly one {lagger}-sized excuse each.","{leader} is ordering a victory biscuit in advance. Bold."],
  overtaken:[...REMINDERS.overtaken,"{leader} sails past {lagger} and doesn't even wave. Cold.","New leader: {leader}. {lagger} is said to be 'regrouping'. Sure."],
  close:[...REMINDERS.close,"{left} DMs left. The monster has started writing its will.","The foe is down to {left} HP and has asked for a lawyer."],
  deadline:[...REMINDERS.deadline,"{left} to go, {mins} minutes left. This is the montage bit. Cue music.","The clock is ticking louder than Gary's opinions. {left} DMs, {mins} minutes."],
  missed:[...REMINDERS.missed,"Yesterday's monster is still telling everyone about it. Make it stop.","We don't talk about yesterday. We just send DMs today."],
  won:[...REMINDERS.won,"Monster sunk. Gary is doing a little dance. Please don't look directly at it.","Target hit. Every DM now is pure showing off. Encouraged showing off."],
  steady:[...REMINDERS.steady,"Remember: personalised DMs only. 'Hey' is not a sales pitch.","You're doing great. Gary is contractually obliged to say that, but still.","Tip: compliments that mention something specific work better than 'love your vibe'.","Hydrate, captain. Then DM. Then hydrate again."],
  golden:["Golden Tide is LIVE. Every DM counts double. Gary also counts double, emotionally.","Double points right now. This is not a drill. Well, it's a bit of a drill.","Golden Tide! The doubloons are basically falling out of the sky. Catch them."],
  pet:["A {rar} pet has been spotted. It's not going to adopt itself.","There's a {rar} pet out there with your name on it. Possibly literally.","Pet sighting! {need} DMs and it's yours. Gary will be jealous, but that's his problem."],
});
JOKES.push("Woah there, speedy.","Even cannons need a cuppa between shots.","That's not a DM, that's a drum solo.","The button is reloading. Use this moment to reflect on your choices.","Slow down, the fish are getting dizzy.","Patience. Rome wasn't DM'd in a day.");
const DM_QUIPS=["fire away","boom, another one","the inbox trembles","Gary approves","pew pew","that one was spicy","personalised, right?","nice aim, captain","straight to the DMs","they'll love that one","cannon reloading","splash","excellent outreach","chef's kiss","plot armour activated","main character energy"];
const LEVEL_QUIPS=["Your hat feels slightly fancier.","Gary nods. Respectfully.","The sea foes have heard of you now.","You may now say 'arr' in meetings.","Somewhere, a prospect felt a disturbance.","Your parrot has updated its LinkedIn."];
const WRONG_PW=["Nope. Gary is pretending he didn't see that.","That's not it. Try the one you didn't write on a sticky note.","Wrong password. The ship remains unboarded.","Incorrect. The parrot is judging you silently."];
const ACH_QUIPS=["Frame it.","Tell your mum.","Gary is impressed. Don't tell him we told you.","Shiny.","One for the trophy cabinet.","Absolute scenes."];

/* ============================== UTILITIES ============================== */
const $ = (s,r=document)=>r.querySelector(s);
const esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtN = n=>Math.round(n).toLocaleString('en-GB');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function h32(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}h^=h>>>13;h=Math.imul(h,0x5bd1e995);h^=h>>>15;return h>>>0;}
const pick=(arr,seed)=>arr[h32(String(seed))%arr.length];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,10);
const TZ='Europe/London';
const DTF=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
// UK time without Intl in the hot path: BST runs from 01:00 UTC on the last Sunday of March to 01:00 UTC on the last Sunday of October
const BST={};function lastSunUTC(y,m){const d=new Date(Date.UTC(y,m+1,0,1));d.setUTCDate(d.getUTCDate()-d.getUTCDay());return d.getTime();}
function L(ts=Date.now()){const y=new Date(ts).getUTCFullYear();const r=BST[y]||(BST[y]=[lastSunUTC(y,2),lastSunUTC(y,9)]);const ld=new Date(ts+(ts>=r[0]&&ts<r[1]?3600000:0));
  const mo=ld.getUTCMonth()+1,da=ld.getUTCDate();return{date:ld.getUTCFullYear()+'-'+(mo<10?'0':'')+mo+'-'+(da<10?'0':'')+da,min:ld.getUTCHours()*60+ld.getUTCMinutes()};}
const wd=date=>new Date(date+'T12:00:00Z').getUTCDay();
function addDays(date,n){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
const weekStart=date=>addDays(date,-((wd(date)+6)%7));
const hm=s=>{const[a,b]=String(s||'0:0').split(':');return (+a||0)*60+(+b||0);};
function londonTs(date,min){const guess=Date.UTC(+date.slice(0,4),+date.slice(5,7)-1,+date.slice(8,10),0,min);const l=L(guess);let lm=l.min;if(l.date>date)lm+=1440;else if(l.date<date)lm-=1440;return guess-(lm-min)*60000;}
const DAYN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function niceDate(date){const d=new Date(date+'T12:00:00Z');return d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'});}
function shortDate(date){const d=new Date(date+'T12:00:00Z');return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',timeZone:'UTC'});}
function clockStr(ms){ms=Math.max(0,ms);const s=Math.floor(ms/1000);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(x).padStart(2,'0');}
function fill(t,o){return t.replace(/\{(\w+)\}/g,(_,k)=>o[k]??'');}

/* ============================== STORE ============================== */
function makeLocalDB(){
  const KEY='hl_local_db_v1'; let data={};
  try{data=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
  const subs=new Set();
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}};
  let pend=false; const notify=()=>{if(pend)return;pend=true;setTimeout(()=>{pend=false;for(const s of subs)s();},0)};
  try{window.addEventListener('storage',e=>{if(e.key===KEY){try{data=JSON.parse(e.newValue||'{}')}catch(_){}notify();}})}catch(e){}
  const clone=o=>JSON.parse(JSON.stringify(o));
  const merge=(a,b)=>{for(const k in b){const v=b[k];if(v&&typeof v==='object'&&v.__delete__===true){delete a[k];}else if(v&&typeof v==='object'&&!Array.isArray(v)){a[k]=merge(a[k]&&typeof a[k]==='object'&&!Array.isArray(a[k])?a[k]:{},v);}else a[k]=v;}return a;};
  const snap=p=>({id:p.split('/').pop(),exists:p in data,data:()=>data[p],metadata:{fromCache:false,hasPendingWrites:false}});
  function doc(path){return{id:path.split('/').pop(),path,
    async get(){return snap(path)},
    async set(d){data[path]=clone(d);save();notify();},
    async update(d){if(!(path in data))throw{code:'invalid_argument',message:'Document does not exist'};data[path]=merge(data[path],clone(d));save();notify();},
    async delete(){delete data[path];save();notify();},
    async acquire(o){const now=Date.now();let cur=null;try{cur=JSON.parse(localStorage.getItem('hl_lease_'+path)||'null')}catch(e){}
      if(cur&&cur.exp>now&&cur.holder!==o.holder)return{acquired:false,expiresAt:new Date(cur.exp).toISOString()};
      const exp=now+clamp(o.ttlMs||30000,1000,600000);try{localStorage.setItem('hl_lease_'+path,JSON.stringify({holder:o.holder,exp}))}catch(e){}
      return{acquired:true,expiresAt:new Date(exp).toISOString(),holder:o.holder};},
    onSnapshot(next){const f=()=>next(snap(path));subs.add(f);setTimeout(f,0);return()=>subs.delete(f);},
    collection(p){return collection(path+'/'+p)}};}
  function collection(cp){const n=cp.split('/').length;
    const snapC=()=>{const docs=Object.keys(data).filter(p=>p.startsWith(cp+'/')&&p.split('/').length===n+1).sort().map(snap);return{docs,size:docs.length,empty:!docs.length,docChanges:()=>[],metadata:{fromCache:false,hasPendingWrites:false}};};
    return{path:cp,doc(id){return doc(cp+'/'+(id||uid()))},async get(){return snapC()},onSnapshot(next){const f=()=>next(snapC());subs.add(f);setTimeout(f,0);return()=>subs.delete(f);}};}
  return{doc,collection,local:true,_data:()=>data};
}

/* ============================== STATE ============================== */
const S={mode:"local",db:null,user:null,uid:null,isOwner:true,me:null,sightings:{},hits:[],
  config:null,days:{},players:{},challenges:{},forfeits:{},
  pending:{},cdUntil:0,cdStart:0,btnLock:{},loaded:{config:false,days:false,players:false},
  screen:'harbour',sub:{},view:{islet:null,book:'all',lb:'day',shop:'decor',lockDur:25,wheelMode:'virtual'},
  sound:true,lastG:null,firstDerive:true,lanterns:[],bossFlash:0,readOnly:false,reminderIdx:0};
let G=null; // derived game state
const C=()=>{const c={...DEFAULT_CONFIG,...(S.config||{})};c.players={...DEFAULT_CONFIG.players,...(c.players||{})};c.caps={...DEFAULT_CONFIG.caps,...(c.caps||{})};c.cooldowns={...DEFAULT_CONFIG.cooldowns,...(c.cooldowns||{})};return c;};
const pname=p=>esc(S.players[p]?.handle||C().players[p]?.name||p);
const pnameRaw=p=>S.players[p]?.handle||C().players[p]?.name||p;
const pcol=p=>p===C().playerIds[0]?'var(--sam)':'var(--james)';
const pcolHex=p=>p===C().playerIds[0]?'#E07A34':'#4A7EC2';
const other=p=>C().playerIds.find(x=>x!==p);

const wq={};
function queue(path,fn){const run=(wq[path]||Promise.resolve()).then(fn,fn);wq[path]=run.catch(()=>{});return run;}
async function writeDay(pid,date,patch){
  const ref=S.db.doc(`days/${date}_${pid}`);
  return queue(ref.path,async()=>{
    try{await ref.update(patch);}
    catch(e){
      if(e&&e.code==='invalid_argument'){const s=await ref.get();if(s.exists)await ref.update(patch);else await ref.set({pid,date,...patch});}
      else throw e;
    }
  });
}
async function writePlayer(pid,patch){
  const ref=S.db.doc(`players/${pid}`);
  return queue(ref.path,async()=>{try{await ref.update(patch);}catch(e){if(e&&e.code==='invalid_argument'){const s=await ref.get();if(s.exists)await ref.update(patch);else await ref.set({pid,...patch});}else throw e;}});
}
async function writeConfig(patch){
  const ref=S.db.doc('config/main');
  return queue(ref.path,async()=>{try{await ref.update(patch);}catch(e){if(e&&e.code==='invalid_argument'){const s=await ref.get();if(s.exists)await ref.update(patch);else{const base=JSON.parse(JSON.stringify(DEFAULT_CONFIG));delete base.forfeits;await ref.set(deepMerge(base,patch));}}else throw e;}});
}
function deepMerge(a,b){for(const k in b){const v=b[k];if(v&&typeof v==='object'&&!Array.isArray(v)&&!(v.__delete__===true)){a[k]=deepMerge(a[k]&&typeof a[k]==='object'?a[k]:{},v);}else if(v&&v.__delete__===true)delete a[k];else a[k]=v;}return a;}
function writeFail(e){
  console.warn(e);
  if(e&&e.code==='invalid_argument'){S.readOnly=true;toast('<b>Couldn\'t save that.</b> Your account can only view this game. Ask the owner to share it with you as a Contributor or Editor.','joke',7000);}
  else if(e&&e.code==='quota_exceeded')toast('<b>The game\'s storage is full.</b> '+esc(e.message||''),'joke',7000);
  else toast('<b>Not saved.</b> The connection hiccupped, try again in a moment.','joke',4000);
}

/* ============================== RULES ============================== */
const WDC=new Map();const wdc=d=>{let v=WDC.get(d);if(v===undefined){v=wd(d);WDC.set(d,v);}return v;};
function isWork(d,cfg=C()){return cfg.workdays.includes(wdc(d))&&!(cfg.holidays||[]).includes(d);}
function absent(p,d,cfg=C()){return !!(cfg.absences||{})[d+'_'+p];}
function targetFor(d,cfg=C()){if(!isWork(d,cfg))return 0;const P=cfg.playerIds;const present=P.filter(p=>!absent(p,d,cfg)).length;if(!present)return 0;return present===P.length?cfg.target:Math.max(1,Math.round(cfg.target*cfg.absenceScale*present/(P.length-1||1)));}
function bossFor(date){const rare=h32(date+'rare')%14===0;return rare?RARE_BOSSES[h32(date+'rb')%RARE_BOSSES.length]:BOSSES[h32(date)%BOSSES.length];}
const MODC=new Map();const modFor=date=>{let v=MODC.get(date);if(!v){v=DAILY_MODS[h32(date+'mod')%DAILY_MODS.length];MODC.set(date,v);}return v;};
function needXp(l){return Math.round(25*Math.pow(l,1.4)+50);}
function levelInfo(xp){let l=1,rem=xp;while(l<100&&rem>=needXp(l)){rem-=needXp(l);l++;}return{level:l,into:rem,need:l>=100?0:needXp(l)};}
function titleFor(level){let t=TITLES[0][1];for(const[l,n]of TITLES)if(level>=l)t=n;return t;}
function lootFor(e,mod){
  const chance={d:25,r:200,v:450,m:1000,c:1000}[e.k]*(mod==='lucky'&&e.k==='d'?2:1);
  if(h32(e.id+'loot')%1000>=chance)return null;
  let r=h32(e.id+'rar')%1000;const w=[['common',450],['uncommon',280],['rare',160],['epic',70],['legendary',30],['mythic',10]];
  if(e.k==='c')r=880+r%120; else if(e.k==='m')r=Math.max(r,450);
  let rar='common';for(const[n,x]of w){if(r<x){rar=n;break;}r-=x;}
  const pool=COLLECTIBLES.filter(c=>c.rar===rar);return pool.length?pool[h32(e.id+'it')%pool.length]:null;
}
function rewardFor(e,mod,min){let xp=KINDS[e.k].xp,g=KINDS[e.k].g;
  if(e.k==='d'){if(mod==='golden'&&min>=840&&min<900)xp*=2;if(mod==='early'&&min<600)xp=Math.round(xp*1.5);}
  if(e.k==='r'&&mod==='echo')g*=2;return{xp,g};}
function merchantToday(date){const w=wd(date);if(w!==2&&w!==4)return null;const items=[...MERCHANT_ITEMS].sort((a,b)=>h32(date+a.id)-h32(date+b.id)).slice(0,3);return items.map(i=>({...i,price:Math.round(i.price*(1-(h32(date+i.id+'d')%21)/100)/10)*10}));}
function approvedForfeits(cfg=C()){const ap=cfg.approvals||{};const all=[...(cfg.forfeits||DEFAULT_FORFEITS),...Object.entries(cfg.custom||{}).map(([id,f])=>({id,...f,custom:true}))];
  return all.map(f=>{const by={};cfg.playerIds.forEach(p=>{const v=ap[p]?.[f.id];by[p]=v===undefined?(f.custom?f.by===p:true):!!v;});return{...f,by,ok:cfg.playerIds.every(p=>by[p])};});}

/* ============================== DERIVE ============================== */
function derive(){
  const cfg=C(),P=cfg.playerIds,now=Date.now(),T=L(now),today=T.date;
  const evs=[],seen=new Set(),bonus={},spend={},contrib={},sessions={},undone={},pendingConf=[],mc=[];
  P.forEach(p=>{bonus[p]=[];spend[p]=[];contrib[p]=[];sessions[p]=[];undone[p]=0;});
  for(const k in S.days){const d=S.days[k];if(!d||!P.includes(d.pid)||!d.date)continue;
    for(const id in d.ev||{}){const e=d.ev[id];seen.add(id);if(!e||!KINDS[e.k]||typeof e.t!=='number')continue;if(e.u||e.x){undone[d.pid]++;continue;}
      if(e.k==='m'||e.k==='c')mc.push({id,pid:d.pid,date:d.date,k:e.k,t:e.t,pr:e.pr||'',ok:e.ok||(cfg.requireConfirm?null:'auto')});
      if((e.k==='m'||e.k==='c')&&cfg.requireConfirm&&!e.ok){pendingConf.push({id,pid:d.pid,date:d.date,k:e.k,t:e.t,pr:e.pr||''});continue;}
      evs.push({id,pid:d.pid,date:d.date,k:e.k,t:e.t,pr:e.pr});}
    for(const id in d.bonus||{})bonus[d.pid].push({key:id,date:d.date,...d.bonus[id]});
    for(const id in d.spend||{})spend[d.pid].push({id,date:d.date,...d.spend[id]});
    for(const id in d.contrib||{})contrib[d.pid].push({id,date:d.date,...d.contrib[id]});
    for(const id in d.ses||{})sessions[d.pid].push({id,date:d.date,...d.ses[id]});
  }
  for(const id in S.pending){if(seen.has(id))delete S.pending[id];else{const x=S.pending[id];if((x.k==='m'||x.k==='c')){mc.push({...x,ok:null});if(cfg.requireConfirm){pendingConf.push(x);continue;}}evs.push(x);}}
  evs.sort((a,b)=>a.t-b.t);
  const blank=()=>({d:0,r:0,v:0,m:0,c:0,early:0,b10:0,b12:0});
  const days={};
  const dayOf=date=>days[date]||(days[date]={date,p:Object.fromEntries(P.map(p=>[p,blank()])),seq:[]});
  const per={};P.forEach(p=>per[p]={xp:0,g:0,gNoAch:0,loot:{},dupes:0,lootLog:[]});const teamSoFar={};const st0={};P.forEach(p=>st0[p]={em5:0,goldenDms:0});
  for(const e of evs){const D=dayOf(e.date),c=D.p[e.pid];c[e.k]++;const lm=L(e.t);e.min=lm.min;
    if(e.k==='d'){D.seq.push(e);if(e.min<510)c.early++;if(e.min<600)c.b10++;if(e.min<720)c.b12++;}
    const mod=modFor(e.date).id;const rw=rewardFor(e,mod,e.min);let mult=1;
    if(e.k==='d'){const sofar=teamSoFar[e.date]||0;mult*=EMISSARY[emGrade(sofar)].mult;teamSoFar[e.date]=sofar+1;if(sofar>=100)st0[e.pid].em5=1;}
    const gt=goldenFor(e.date);if(isWork(e.date,cfg)&&e.min>=gt.start&&e.min<gt.end){mult*=2;if(e.k==='d')st0[e.pid].goldenDms++;}
    per[e.pid].xp+=Math.round(rw.xp*mult);per[e.pid].g+=Math.round(rw.g*mult);
    const it=lootFor(e,mod);if(it){const L2=per[e.pid].loot;if(L2[it.id])per[e.pid].dupes++;else L2[it.id]=e.t;per[e.pid].lootLog.push({it,t:e.t,id:e.id});}
  }
  dayOf(today);
  const start=cfg.startDate||(evs.length?evs[0].date:today);
  const workdays=[];const from=start<addDays(today,-3650)?addDays(today,-3650):start;for(let d=from;d<=today;d=addDays(d,1)){if(isWork(d,cfg))workdays.push(d);}
  // per-day team analysis
  const A=P[0],B=P[1];
  const st={};P.forEach(p=>st[p]={teamWins:0,bosses:0,finalBlows:0,overtakes:0,comebacks:0,bigComebacks:0,perfect50:0,perfectEqual:0,photoFinish:0,fridayBlow:0,rareBosses:0,roster:new Set(),stretch:0,earlyDm:0,morning50:0,palindrome:0,answer42:0,lucky7:0,triple:0,fullHouse:0,syncDm:0,fastBoss:0,bestDay:0,activeDays:0,dayXp:0,dayG:0});
  for(const date in days){const D=days[date];const tgt=targetFor(date,cfg);D.target=tgt;D.team=P.reduce((s,p)=>s+D.p[p].d,0);
    D.boss=bossFor(date);D.mod=modFor(date);let run={},lastSign=0,minDiff={},tot=0;P.forEach(p=>{run[p]=0;minDiff[p]=0;});D.over=[];
    for(let i=0;i<D.seq.length;i++){const e=D.seq[i];run[e.pid]++;tot++;
      if(tgt>0&&tot===tgt){D.hit=true;D.blow=e.pid;D.hitT=e.t;D.hitMin=e.min;}
      if(B){const diff=run[A]-run[B];minDiff[A]=Math.min(minDiff[A],diff);minDiff[B]=Math.min(minDiff[B],-diff);const sg=Math.sign(diff);if(sg!==0&&lastSign!==0&&sg!==lastSign){const who=sg>0?A:B;st[who].overtakes++;D.over.push({who,t:e.t});}if(sg!==0)lastSign=sg;}
      if(i>0){const pr=D.seq[i-1];if(pr.pid!==e.pid&&e.t-pr.t<=3000)P.forEach(p=>st[p].syncDm=1);}
    }
    D.leader=B?(run[A]>run[B]?A:run[B]>run[A]?B:null):A;
    const final=date<today;
    P.forEach(p=>{const c=D.p[p];const dm=c.d;if(dm>0&&isWork(date,cfg))st[p].activeDays++;st[p].bestDay=Math.max(st[p].bestDay,dm);
      if(c.early)st[p].earlyDm=1;if(c.b12>=50)st[p].morning50=1;if(c.r>=7)st[p].lucky7=1;if(c.r&&c.v&&c.m)st[p].triple=1;if(c.d&&c.r&&c.v&&c.m&&c.c)st[p].fullHouse=1;
      if(D.hit&&dm>0){st[p].teamWins++;st[p].bosses++;st[p].roster.add(D.boss.id);if(D.boss.rare)st[p].rareBosses++;st[p].dayXp+=100;st[p].dayG+=30;
        if(D.hitMin<660)st[p].fastBoss=1;if(D.team>=150)st[p].stretch++;
        for(const[m,x,g]of[[125,50,15],[150,80,25],[200,150,50]])if(D.team>=m){st[p].dayXp+=x;st[p].dayG+=g;}}
      if(D.blow===p){st[p].finalBlows++;if(wd(date)===5)st[p].fridayBlow=1;}
      if(D.hit&&D.hitMin>=hm(cfg.dayEnd)-15&&D.hitMin<=hm(cfg.dayEnd)&&dm>0)st[p].photoFinish=1;
      if(final){const s=String(dm);if(dm>=11&&s===[...s].reverse().join(''))st[p].palindrome=1;if(dm===42)st[p].answer42=1;
        if(B){const o=D.p[other(p)].d;if(dm>o&&minDiff[p]<=-15)st[p].comebacks++;if(dm>o&&minDiff[p]<=-30)st[p].bigComebacks++;
          if(D.hit&&dm===o){st[p].perfectEqual=1;if(dm===50&&D.team===100)st[p].perfect50=1;}}}
    });
  }
  // forfeits & shields
  const ff=S.forfeits;const shieldsUsed={},redemptions={};P.forEach(p=>{shieldsUsed[p]=0;redemptions[p]=0;});
  for(const k in ff){const f=ff[k];if(!f||!P.includes(f.pid))continue;if(f.status==='shield')shieldsUsed[f.pid]++;if(f.status==='redeemed')redemptions[f.pid]++;}
  const shielded=(p,d)=>['ind','team'].some(t=>ff[`${d}_${p}_${t}`]?.status==='shield');
  // streaks
  P.forEach(p=>{let cur=0,best=0;for(const d of workdays){if(absent(p,d,cfg))continue;const D=days[d];const ok=(D&&D.hit&&D.p[p].d>0)||shielded(p,d);if(ok){cur++;best=Math.max(best,cur);}else if(d!==today)cur=0;}st[p].curStreak=cur;st[p].bestStreak=best;});
  // weeks
  const weeks={};for(const d of workdays){const w=weekStart(d);(weeks[w]||(weeks[w]={w,days:[],hp:0,dmg:0,p:Object.fromEntries(P.map(p=>[p,0]))})).days.push(d);}
  for(const w in weeks){const W=weeks[w];W.days.forEach(d=>{W.hp+=targetFor(d,cfg);const D=days[d];if(D){W.dmg+=D.team;P.forEach(p=>W.p[p]+=D.p[p].d);}});W.boss=WEEKLY_BOSSES[h32(w)%WEEKLY_BOSSES.length];W.done=W.hp>0&&W.dmg>=W.hp;
    const first=W.days[0];W.missedFirst=first<today&&days[first]&&targetFor(first,cfg)>0&&!days[first].hit||(first<today&&!days[first]&&targetFor(first,cfg)>0);}
  P.forEach(p=>{st[p].weeks=0;st[p].againstOdds=0;for(const w in weeks){const W=weeks[w];if(W.done&&W.p[p]>0){st[p].weeks++;st[p].dayXp+=400;st[p].dayG+=120;if(W.missedFirst)st[p].againstOdds=1;}}});
  // sessions
  P.forEach(p=>{const s=st[p];s.sessions=0;s.lockMin=0;s.bestSession=0;s.lateSession=0;for(const x of sessions[p]){s.sessions++;s.lockMin+=Math.round((x.dur||0)/60000);s.bestSession=Math.max(s.bestSession,x.dms||0);if(L(x.s||0).min>=1260)s.lateSession=1;const calm=modFor(x.date).id==='calm'?60:0;s.dayXp+=25+Math.round((x.dur||0)/60000)*2+calm;s.dayG+=5+Math.round((x.dur||0)/300000)+(x.full?(x.dms||0)*3:0);if(x.full)s.islands=(s.islands||0)+1;if(x.beat&&VOYAGE_DIFF[x.diff]){s.dayXp+=VOYAGE_DIFF[x.diff].xp;s.dayG+=VOYAGE_DIFF[x.diff].g;s.vBoss=(s.vBoss||0)+1;}}});
  // challenges
  const chals=[];P.forEach(p=>{st[p].chalWon=0;st[p].chalPlayed=0;st[p].sprintWins=0;st[p].finalSecond=0;});
  for(const id in S.challenges){const c=S.challenges[id];if(!c)continue;const ch=evalChallenge(id,c,evs,now);chals.push(ch);
    if(ch.state==='done'){P.forEach(p=>{if(!ch.players.includes(p))return;st[p].chalPlayed++;const r=ch.reward[p];if(r){st[p].dayXp+=r.xp;st[p].dayG+=r.g;}if(ch.won[p]){st[p].chalWon++;if(c.type==='sprint')st[p].sprintWins++;if(ch.lastSecond===p||(ch.coop&&ch.lastSecond))st[p].finalSecond=1;}});}}
  chals.sort((a,b)=>(b.c.created||0)-(a.c.created||0));
  // projects
  const teamDm=evs.filter(e=>e.k==='d').length;const teamClients=evs.filter(e=>e.k==='c').length;
  const proj=PROJECTS.map(pr=>({...pr,by:Object.fromEntries(P.map(p=>[p,0])),funded:0}));
  P.forEach(p=>contrib[p].forEach(x=>{const pr=proj.find(q=>q.id===x.proj);if(pr){pr.by[p]+=x.amt||0;pr.funded+=x.amt||0;}}));
  let prevBuilt=true;proj.forEach(pr=>{pr.dmOk=teamDm>=pr.dm;pr.gOk=pr.funded>=pr.g;pr.built=prevBuilt&&pr.dmOk&&pr.gOk;pr.open=prevBuilt&&!pr.built;prevBuilt=pr.built;});
  const built=proj.filter(p=>p.built).length;
  // per player totals
  const out={};
  P.forEach(p=>{const s=st[p],pl=S.players[p]||{};
    const bx=bonus[p].reduce((a,b)=>a+(b.xp||0),0),bg=bonus[p].reduce((a,b)=>a+(b.g||0),0);
    const xp=per[p].xp+s.dayXp+bx;const prest=(pl.prestige||[]);const lastP=prest.length?prest[prest.length-1]:0;
    const li=levelInfo(Math.max(0,xp-lastP));
    const counts={d:0,r:0,v:0,m:0,c:0};evs.forEach(e=>{if(e.pid===p)counts[e.k]++;});
    const spent=spend[p].reduce((a,b)=>a+(b.cost||0),0),given=contrib[p].reduce((a,b)=>a+(b.amt||0),0);
    const owned={};spend[p].forEach(x=>{owned[x.item]=(owned[x.item]||0)+1;});
    const segs=[];let prevX=0;prest.forEach(px=>{segs.push(levelInfo(Math.max(0,px-prevX)).level);prevX=px;});segs.push(li.level);
    const maxLevel=Math.max(...segs);let lvlGold=0;segs.forEach(l=>{for(let k=2;k<=l;k++)lvlGold+=levelGold(k);});
    ITEMS.forEach(it=>{if(it.free||(it.track&&maxLevel>=it.track))owned[it.id]=owned[it.id]||1;});
    const gNoAch=per[p].g+per[p].dupes*10+s.dayG+bg+lvlGold;
    const collected=Object.keys(per[p].loot).length;const sets=COLLECT_SETS.filter(set=>set.items.every(([id])=>per[p].loot[id])).length;
    const moth=MOTH_STAGES.reduce((a,x,i)=>counts.d>=x.at?i:a,0);
    const decor=(pl.decor||[]).filter(Boolean);
    const shieldsEarned=Math.floor(s.teamWins/10),shieldsBought=owned.shield||0;
    const pets={};bonus[p].forEach(b=>{if(b.key.startsWith('pet_')&&PET_BY_ID[b.pet])pets[b.pet]=pets[b.pet]||b.date;});
    const m={pets:Object.keys(pets).length,petMythic:Object.keys(pets).some(id=>PET_BY_ID[id].rar==='mythic')?1:0,petLegend:Object.keys(pets).some(id=>['legendary','mythic'].includes(PET_BY_ID[id].rar))?1:0,em5:st0[p].em5,goldenDms:st0[p].goldenDms,islands:s.islands||0,vBoss:s.vBoss||0,...counts,bestDay:s.bestDay,activeDays:s.activeDays,bestStreak:s.bestStreak,teamWins:s.teamWins,sessions:s.sessions,lockMin:s.lockMin,bestSession:s.bestSession,
      earned:gNoAch,spent,bosses:s.bosses,finalBlows:s.finalBlows,chalWon:s.chalWon,chalPlayed:s.chalPlayed,collected,level:li.level+(prest.length?100:0)*0,teamDm,weeks:s.weeks,built,stretch:s.stretch,
      perfect50:s.perfect50,comebacks:s.comebacks,bigComebacks:s.bigComebacks,rainmaker:teamClients,sets,earlyDm:s.earlyDm,morning50:s.morning50,photoFinish:s.photoFinish,fridayBlow:s.fridayBlow,
      overtakes:s.overtakes,rareBosses:s.rareBosses,rosterDone:BOSSES.every(b=>s.roster.has(b.id))?1:0,prestige:prest.length,mothStage:moth,redemptions:redemptions[p],shieldsUsed:shieldsUsed[p],
      merchantBuys:spend[p].filter(x=>String(x.item).startsWith('m_')).length,cosmetics:Object.keys(owned).filter(id=>ALL_ITEMS[id]&&ALL_ITEMS[id].cat!=='shield'&&!ALL_ITEMS[id].free).length,fullRig:['hull','sail','flag','figure'].every(k=>pl[k]&&!ALL_ITEMS[pl[k]]?.free)?1:0,decorFull:decor.length>=6?1:0,questsClaimed:bonus[p].filter(b=>b.key.startsWith('q_')).length,sprintWins:s.sprintWins,
      perfectEqual:s.perfectEqual,againstOdds:s.againstOdds,finalSecond:s.finalSecond,lateSession:s.lateSession,palindrome:s.palindrome,answer42:s.answer42,lucky7:s.lucky7,triple:s.triple,fullHouse:s.fullHouse,syncDm:s.syncDm,fastBoss:s.fastBoss,mythics:0,teamClients};
    // level metric uses max level ever (prestige counts as having reached 50+)
    if(prest.length)m.level=Math.max(li.level,50);
    const unlocked={};
    for(const a of ACHIEVEMENTS){if(a.metric==='mythics')continue;if((m[a.metric]||0)>=a.target)unlocked[a.id]=true;}
    m.mythics=ACHIEVEMENTS.filter(a=>a.rar==='mythic'&&unlocked[a.id]).length;
    if(m.mythics>=5)unlocked.s_unseen=true;
    const achG=Object.keys(unlocked).reduce((a,id)=>a+RARITY_GLOW[ACH_BY_ID[id].rar],0);
    const earned=gNoAch+achG;
    out[p]={pid:p,m,counts,xp,li,prest:prest.length,earned,spent,given,balance:earned-spent-given,owned,unlocked,achG,loot:per[p].loot,lootLog:per[p].lootLog,dupes:per[p].dupes,
      curStreak:s.curStreak,bestStreak:s.bestStreak,maxLevel,lvlGold,pets,moth,shields:shieldsEarned+shieldsBought-shieldsUsed[p],shieldsEarned,claimed:new Set(bonus[p].map(b=>b.key)),bonus:bonus[p],sessions:sessions[p],undone:undone[p]};
  });
  return {cfg,P,now,T,today,evs,pendingConf,mc,days,workdays,weeks,players:out,chals,proj,built,teamDm,teamClients,shielded};
}

function evalChallenge(id,c,evs,now){
  const P=C().playerIds;const players=P.filter(p=>c.acc?.[p]);const allIn=P.every(p=>c.acc?.[p]);
  const start=c.start||0,end=start+(c.dur||0);
  let state=c.status==='declined'||c.status==='cancelled'?c.status:!allIn?(now-(c.created||0)>15*60000?'expired':'pending'):now<start?'countdown':now<end?'live':'done';
  const cnt=Object.fromEntries(P.map(p=>[p,0]));let last={};
  if(start){let lo=0,hi=evs.length;while(lo<hi){const mid=(lo+hi)>>1;if(evs[mid].t<start)lo=mid+1;else hi=mid;}for(let i=lo;i<evs.length&&evs[i].t<=end;i++){const e=evs[i];if(e.k!=='d')continue;cnt[e.pid]++;last[e.pid]=e.t;}}
  const coop=['sprint','lastpush','bossrush','raid'].includes(c.type);let raceWin=null;
  if(c.type==='race'&&start){const run=Object.fromEntries(P.map(p=>[p,0]));for(const e of evs){if(e.t<start)continue;if(e.t>end)break;if(e.k!=='d')continue;run[e.pid]++;if(run[e.pid]>=(c.target||25)){raceWin=e.pid;break;}}}const team=P.reduce((a,p)=>a+cnt[p],0);
  const won={},reward={};let lastSecond=null;
  if(state==='done'){
    if(coop){const ok=team>=(c.target||0);P.forEach(p=>{won[p]=ok;reward[p]=ok?{xp:200,g:60}:{xp:40,g:5};});if(ok){const lt=Math.max(...P.map(p=>last[p]||0));if(end-lt<=10000)lastSecond=true;}}
    else if(raceWin){const l=other(raceWin);won[raceWin]=true;reward[raceWin]={xp:180,g:50};reward[l]={xp:50,g:10};}
    else{const[a,b]=P;if(cnt[a]===cnt[b]){reward[a]=reward[b]={xp:100,g:25};}else{const w=cnt[a]>cnt[b]?a:b,l=other(w);won[w]=true;reward[w]={xp:150,g:40};reward[l]={xp:50,g:10};if(last[w]&&end-last[w]<=10000)lastSecond=w;}}
  }
  if(c.type==='race'&&raceWin&&state==='live')state='done';
  return{id,c,state,start,end,cnt,team,coop,won,reward,players,lastSecond,raceWin};
}

/* ---------- Daily pet sighting ---------- */
function sightingFor(date){
  const cfg=C();if(!isWork(date,cfg))return null;
  const doc=S.sightings[date];let start,rar;
  if(doc&&doc.start){start=doc.start;rar=PET_RARITY[doc.rar]?doc.rar:rollRarity(h32(date+'rar'));}
  else if(cfg.sightingMode==='email')return null;
  else{rar=rollRarity(h32(date+'rar'));const win=PET_RARITY[rar].win;const sm=420+h32(date+'sight')%(720-win);start=londonTs(date,sm);}
  const R=PET_RARITY[rar];const pet=petFor(date,rar);return{date,start,end:start+R.win*60000,rar,need:R.need,win:R.win,pet};
}
function sightingState(p,sg,now=Date.now()){if(!sg)return null;const n=G?G.evs.filter(e=>e.pid===p&&e.k==='d'&&e.t>=sg.start&&e.t<=sg.end).length:0;const claimed=G?.players[p]?.claimed.has('pet_'+sg.date);
  return{...sg,n,claimed,owned:!!G?.players[p]?.pets?.[sg.pet.id],phase:now<sg.start?'soon':now<=sg.end?'live':'over',ok:n>=sg.need};}

/* ============================== ART: soft, rounded pirate world ============================== */
// World units are 320x180; canvases are 960x540 and scaled 3x so curves stay smooth.
const W=320,H=180;
const TAU=Math.PI*2;
function R(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h);}
function disc(c,cx,cy,r,col){c.fillStyle=col;c.beginPath();c.arc(cx,cy,Math.max(.2,r),0,TAU);c.fill();}
function ell(c,cx,cy,rx,ry,col,rot=0){c.fillStyle=col;c.beginPath();c.ellipse(cx,cy,Math.max(.2,rx),Math.max(.2,ry),rot,0,TAU);c.fill();}
function rr(c,x,y,w,h,r,col){c.fillStyle=col;c.beginPath();c.roundRect?c.roundRect(x,y,w,h,Math.min(r,w/2,h/2)):c.rect(x,y,w,h);c.fill();}
function poly(c,pts,col){c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function line(c,x1,y1,x2,y2,col,w=1){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();}
function glowAt(c,x,y,r,rgb,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
function txt(c,s,x,y,col='#fff',size=8,align='left'){c.font=`600 ${size}px Fredoka, Nunito, sans-serif`;c.textAlign=align;c.textBaseline='top';c.lineJoin='round';c.lineWidth=2.4;c.strokeStyle='rgba(255,255,255,.92)';c.strokeText(s,x,y);c.fillStyle=col;c.fillText(s,x,y);}
function prep(cv){const c=cv.getContext('2d');c.setTransform(cv.width/W,0,0,cv.height/H,0,0);c.imageSmoothingEnabled=true;return c;}
let MARK_PATH=null;function markPath(){if(!MARK_PATH){try{MARK_PATH=new Path2D(document.querySelector('#funnal path').getAttribute('d'));}catch(e){MARK_PATH=new Path2D('M0 0h1000v1000H0z');}}return MARK_PATH;}
function drawMark(c,cx,cy,size,col){c.save();c.translate(cx-size/2,cy-size/2);c.scale(size/1000,size/1000);c.fillStyle=col;c.fill(markPath(),'evenodd');c.restore();}
const it=id=>ALL_ITEMS[id]||null;

/* ---------- Captain (8 wide x 12 tall, top-left at x,y) ---------- */
function keeperPal(pl,pid){const base=pid===C().playerIds[0];return{hair:base?'#7A4B2A':'#33363F',s:'#F6D2B2',e:'#3F3A30',c:base?'#E07A34':'#4A7EC2',c2:'#FFFFFF',p:'#55606E'};}
function drawKeeper(c,x,y,pid,pl,t,opts={}){
  if(opts.chicken){const b=Math.sin(t/180)>0?.5:0;ell(c,x+4,y+12,4,1,'rgba(0,0,0,.12)');ell(c,x+4,y+8+b,4.6,3.6,'#FFFFFF');disc(c,x+6,y+3.6+b,2.6,'#FFFFFF');disc(c,x+5.6,y+.8+b,1,'#E0453B');disc(c,x+6.8,y+1+b,.9,'#E0453B');
    poly(c,[[x+8.4,y+3.6+b],[x+10,y+4.2+b],[x+8.4,y+4.8+b]],'#F2A33A');disc(c,x+6.8,y+3.3+b,.45,'#3F3A30');R(c,x+3,y+11,.8,1.5,'#F2A33A');R(c,x+5,y+11,.8,1.5,'#F2A33A');return;}
  pl=pl||{};const pal=keeperPal(pl,pid);const coat=it(pl.coat),hat=it(pl.hat),face=it(pl.face);
  const bob=opts.dance?Math.sin(t/120)*1.4:Math.sin(t/700)*.25;const lean=opts.dance?Math.sin(t/240)*.25:0;
  ell(c,x+4,y+12,3.6,.9,'rgba(0,0,0,.12)');
  c.save();c.translate(x+4,y+12);c.rotate(lean);c.translate(-x-4,-y-12);
  rr(c,x+2.2,y+9.6,1.6,2.6,.8,pal.p);rr(c,x+4.2,y+9.6,1.6,2.6,.8,pal.p);rr(c,x+1.9,y+11.4,2.1,1,.5,'#3F3A30');rr(c,x+4.1,y+11.4,2.1,1,.5,'#3F3A30');
  const cc=coat?coat.col:pal.c,c2=coat?.col2||'#FFFFFF';
  if(coat?.st==='cloak'){poly(c,[[x+.4,y+6.5+bob],[x+7.6,y+6.5+bob],[x+8.4,y+11+bob],[x-.4,y+11+bob]],cc);}
  rr(c,x+1.3,y+6+bob,5.4,4.6,2,cc);
  if(coat?.st==='stripe'){for(let i=0;i<3;i++)R(c,x+1.6,y+6.8+i*1.3+bob,4.8,.55,c2);}
  if(coat?.st==='vest'){rr(c,x+3.2,y+6.2+bob,1.6,4.2,.7,c2);}
  if(coat?.st==='trim'||coat?.st==='cloak'){R(c,x+3.75,y+6.2+bob,.5,4.2,c2);disc(c,x+3,y+7.6+bob,.3,c2);disc(c,x+3,y+9+bob,.3,c2);disc(c,x+5,y+7.6+bob,.3,c2);disc(c,x+5,y+9+bob,.3,c2);}
  if(!coat){R(c,x+1.5,y+8.4+bob,5,.8,'#3F3A30');rr(c,x+3.4,y+8.2+bob,1.2,1.2,.3,'#DDA94D');}
  disc(c,x+1.2,y+8.2+bob,1,pal.s);disc(c,x+6.8,y+8.2+bob,1,pal.s);
  disc(c,x+4,y+3.6+bob,3.5,pal.s);
  c.fillStyle=pal.hair;c.beginPath();c.arc(x+4,y+3.2+bob,3.7,Math.PI*1.02,Math.PI*1.98);c.fill();
  // face gear under hats
  if(face){const f=face.st,fc=face.col;
    if(f==='stubble'){c.globalAlpha=.35;ell(c,x+4,y+5.6+bob,2.6,1.4,fc);c.globalAlpha=1;}
    if(f==='beard'){c.fillStyle=fc;c.beginPath();c.moveTo(x+.8,y+4+bob);c.quadraticCurveTo(x+4,y+10.5+bob,x+7.2,y+4+bob);c.quadraticCurveTo(x+4,y+6.4+bob,x+.8,y+4+bob);c.fill();}
    if(f==='moustache'){c.strokeStyle=fc;c.lineWidth=.7;c.lineCap='round';c.beginPath();c.moveTo(x+4,y+5.4+bob);c.quadraticCurveTo(x+2.4,y+6.2+bob,x+1.6,y+5+bob);c.moveTo(x+4,y+5.4+bob);c.quadraticCurveTo(x+5.6,y+6.2+bob,x+6.4,y+5+bob);c.stroke();}
  }
  disc(c,x+2.7,y+4.3+bob,.48,pal.e);
  if(face?.st==='patch'){ell(c,x+5.3,y+4.2+bob,.95,.8,'#2E2B33');line(c,x+.8,y+2.6+bob,x+7.4,y+3.6+bob,'#2E2B33',.35);}else disc(c,x+5.3,y+4.3+bob,.48,pal.e);
  if(face?.st==='monocle'){c.strokeStyle=face.col;c.lineWidth=.35;c.beginPath();c.arc(x+5.3,y+4.3+bob,.95,0,TAU);c.stroke();line(c,x+5.8,y+5.1+bob,x+6.4,y+7+bob,face.col,.2);}
  if(face?.st==='earring'){c.strokeStyle=face.col;c.lineWidth=.35;c.beginPath();c.arc(x+.6,y+5.2+bob,.6,0,TAU);c.stroke();}
  c.globalAlpha=.45;disc(c,x+1.9,y+5.3+bob,.7,'#F49A9A');disc(c,x+6.1,y+5.3+bob,.7,'#F49A9A');c.globalAlpha=1;
  if(face?.st!=='beard'){c.strokeStyle='#B5654A';c.lineWidth=.3;c.beginPath();c.arc(x+4,y+5.2+bob,.6,.2,Math.PI-.2);c.stroke();}
  // hats
  if(hat){const h=hat.st,hc=hat.col,hy=y+bob;
    if(h==='bandana'){c.fillStyle=hc;c.beginPath();c.arc(x+4,hy+3.1,3.85,Math.PI,0);c.fill();poly(c,[[x+7.4,hy+2.6],[x+9.2,hy+2.2],[x+8.6,hy+4]],hc);if(hat.id==='hat_skull'){disc(c,x+4,hy+1.4,.8,'#fff');}else{disc(c,x+2.6,hy+1.6,.35,'#fff');disc(c,x+5,hy+.8,.35,'#fff');}}
    if(h==='cap'||h==='beanie'){c.fillStyle=hc;c.beginPath();c.arc(x+4,hy+3,3.9,Math.PI,0);c.fill();if(h==='cap')rr(c,x+4,hy+2.4,4.6,1,.5,hc);else{disc(c,x+4,hy-1,1,'#fff');R(c,x+.2,hy+2.4,7.6,1,'rgba(255,255,255,.35)');}}
    if(h==='straw'){ell(c,x+4,hy+2.4,6,1.3,hc);c.fillStyle=hc;c.beginPath();c.arc(x+4,hy+2.2,3,Math.PI,0);c.fill();R(c,x+1,hy+1.5,6,.7,'#D9485F');}
    if(h==='tricorn'||h==='feather'){poly(c,[[x-1.4,hy+2.4],[x+4,hy-2],[x+9.4,hy+2.4],[x+4,hy+1.2]],hc);c.fillStyle=hc;c.beginPath();c.arc(x+4,hy+1.6,3,Math.PI,0);c.fill();R(c,x-.6,hy+1.8,9.2,.4,'#DDA94D');
      if(h==='feather'){c.fillStyle='#F2E7FF';c.beginPath();c.ellipse(x+6.5,hy-1.6,1,3.2,.9,0,TAU);c.fill();}else if(hat.id==='hat_tricorn'){disc(c,x+4,hy,.8,'#fff');}}
    if(h==='bicorne'){c.fillStyle=hc;c.beginPath();c.ellipse(x+4,hy+.6,6.4,2.4,0,Math.PI,0);c.fill();R(c,x-2.2,hy+.4,12.4,.5,'#F2C462');disc(c,x+4,hy-.6,.9,'#F2C462');}
    if(h==='crown'){poly(c,[[x+1,hy+1],[x+1,hy-2],[x+2.5,hy-.5],[x+4,hy-2.6],[x+5.5,hy-.5],[x+7,hy-2],[x+7,hy+1]],hc);disc(c,x+4,hy-.2,.45,'#D9485F');}
    if(h==='halo'){c.strokeStyle=hc;c.lineWidth=.8;c.beginPath();c.ellipse(x+4,hy-1.4,3,1,0,0,TAU);c.stroke();}
    if(h==='lantern'){rr(c,x+2.8,hy-2.6,2.4,3,.8,'#FFE7A0');R(c,x+3.6,hy-3.4,.8,1,'#3F5160');}
    if(h==='kraken'){c.fillStyle=hc;c.beginPath();c.arc(x+4,hy+2.6,4.2,Math.PI,0);c.fill();for(let i=0;i<3;i++){c.strokeStyle=hc;c.lineWidth=.9;c.beginPath();c.moveTo(x+1+i*3,hy+2.4);c.quadraticCurveTo(x+i*3,hy+5,x+1.6+i*3,hy+6);c.stroke();}disc(c,x+2.6,hy+.6,.6,'#fff');disc(c,x+5.4,hy+.6,.6,'#fff');}
  }
  c.restore();
}
function drawGull(c,x,y,t){const f=Math.sin(t/150)>0;ell(c,x+4,y+3,3.6,2.2,'#FFFFFF');disc(c,x+7,y+1.6,1.6,'#FFFFFF');poly(c,[[x+8.4,y+1.4],[x+10,y+2],[x+8.4,y+2.5]],'#F2A33A');disc(c,x+7.4,y+1.2,.35,'#3F3A30');
  ell(c,x+3,y+(f?1:2.6),3,1.1,'#D8DEE6',f?-.5:.2);R(c,x+3.4,y+5,.6,1.4,'#F2A33A');R(c,x+5,y+5,.6,1.4,'#F2A33A');}
function drawGnome(c,x,y){poly(c,[[x,y-4],[x+3,y-12],[x+6,y-4]],'#D9485F');disc(c,x+3,y-3.4,2,'#F6D2B2');poly(c,[[x+1,y-3],[x+3,y+1],[x+5,y-3]],'#FFFFFF');rr(c,x+.8,y-1,4.4,3.6,1.4,'#4A7EC2');disc(c,x+2.2,y-3.6,.35,'#3F3A30');disc(c,x+3.8,y-3.6,.35,'#3F3A30');}

/* ---------- Parrot companion ---------- */
function drawMoth(c,x,y,stage,t,acc,flying=true){
  const flap=flying&&Math.sin(t/90)>0;
  if(stage===0){glowAt(c,x,y,7,'255,226,140',.45);ell(c,x,y,3,3.8,'#FFF6DE');disc(c,x-1,y-1,.6,'#9CCB7A');disc(c,x+1,y+1,.5,'#E07A34');disc(c,x+.6,y-2,.4,'#4A7EC2');ell(c,x-1,y-1.6,.8,1.2,'rgba(255,255,255,.7)');return;}
  if(stage<=2){const r=stage===1?2.6:3.4;const col=stage===1?'#B9E3A0':'#8CCB63';
    disc(c,x,y,r,col);disc(c,x-r*.15,y-r*.9,r*.7,col);disc(c,x-r*.15,y-r*1.6,r*.25,col);disc(c,x+r*.15,y-r*1.7,r*.2,col);
    disc(c,x-r*.4,y-r,.45,'#3F3A30');poly(c,[[x+r*.2,y-r*1],[x+r*.9,y-r*.75],[x+r*.2,y-r*.5]],'#F2A33A');
    ell(c,x+r*.3,y+r*.1,r*.5,r*.35,'#6FB34E',flap?-.6:.2);R(c,x-.8,y+r*.9,.5,1,'#F2A33A');R(c,x+.4,y+r*.9,.5,1,'#F2A33A');}
  else{
    const pal=stage===3?{b:'#5FBF5A',w:'#3F9C47',h:'#7ED36A',t:'#E0453B',k:'#F2E2C4'}:stage===4?{b:'#E0453B',w:'#3E7FD9',h:'#E85A4A',t:'#F2C230',k:'#F6EBD8'}:{b:'#F2A33A',w:'#E0453B',h:'#F7C25A',t:'#FFE07A',k:'#FFF3D0'};
    const s=stage===5?1.25:stage===4?1.1:1;
    if(stage===5)glowAt(c,x,y,12,'255,180,80',.4);
    c.fillStyle=pal.t;c.beginPath();c.moveTo(x-1*s,y+2*s);c.quadraticCurveTo(x-4*s,y+8*s,x-3*s,y+10*s);c.quadraticCurveTo(x-.5*s,y+7*s,x+.8*s,y+2.6*s);c.fill();
    if(stage===5){for(let i=0;i<3;i++){c.fillStyle=['#FFE07A','#F2A33A','#E0453B'][i];c.beginPath();c.ellipse(x-2.5*s-i,y+9*s+Math.sin(t/120+i)*.6,.8,2,.4,0,TAU);c.fill();}}
    ell(c,x,y,3*s,4*s,pal.b);disc(c,x+.6*s,y-3.6*s,2.6*s,pal.h);
    ell(c,x-.8*s,y+.4*s,2*s,3.2*s,pal.w,flap?-.9:.15);
    disc(c,x+1.6*s,y-4*s,1*s,'#FFFFFF');disc(c,x+1.8*s,y-4*s,.5*s,'#3F3A30');
    c.fillStyle=pal.k;c.beginPath();c.moveTo(x+2.8*s,y-3.8*s);c.quadraticCurveTo(x+5*s,y-3.6*s,x+4*s,y-1.6*s);c.lineTo(x+2.8*s,y-2.4*s);c.fill();
    R(c,x-.6*s,y+3.6*s,.6,1.2,'#8A8A8A');R(c,x+.8*s,y+3.6*s,.6,1.2,'#8A8A8A');
    if(acc==='moth_bow'){disc(c,x,y-.8*s,.8,'#D9485F');disc(c,x+1.6,y-.8*s,.8,'#D9485F');}
    if(acc==='moth_scarf'){rr(c,x-1.6,y-1.2*s,4,1.2,.6,'#4A7EC2');R(c,x-1.4,y-.4*s,1,2,'#4A7EC2');}
    if(acc==='moth_monocle'){c.strokeStyle='#DDA94D';c.lineWidth=.4;c.beginPath();c.arc(x+1.8*s,y-4*s,1.1*s,0,TAU);c.stroke();}
    if(acc==='moth_patch'){disc(c,x+1.8*s,y-4*s,1*s,'#2E2B33');}
    if(acc==='moth_hat'){poly(c,[[x-1.6*s,y-5.6*s],[x+.6*s,y-8.4*s],[x+3*s,y-5.6*s]],'#2E2B33');R(c,x-1.8*s,y-5.9*s,5*s,.5,'#DDA94D');}
    if(acc==='moth_chain'){c.strokeStyle='#F2C462';c.lineWidth=.5;c.beginPath();c.arc(x+.6*s,y-1.6*s,2*s,.3,Math.PI-.3);c.stroke();disc(c,x+.6*s,y+.4*s,.6,'#F2C462');}
    if(acc==='m_moth_crown'){poly(c,[[x-.8*s,y-5.8*s],[x-.8*s,y-7.6*s],[x+.4*s,y-6.6*s],[x+.9*s,y-8.2*s],[x+1.4*s,y-6.6*s],[x+2.6*s,y-7.6*s],[x+2.6*s,y-5.8*s]],'#DDA94D');}
  }
}

function drawLighthouse(c,x,y,h,col,t,opts={}){
  const w=10;const a=opts.gold?'#F2CF7A':'#FFFFFF',b=col||'#D9485F';
  ell(c,x+w/2,y,w*.8,2,'rgba(0,0,0,.1)');
  c.save();c.beginPath();c.moveTo(x+1,y);c.lineTo(x+2,y-h);c.lineTo(x+w-2,y-h);c.lineTo(x+w-1,y);c.closePath();c.clip();
  for(let i=0;i<h;i+=7)R(c,x,y-h+i,w,7,(i/7)%2?b:a);c.restore();
  rr(c,x-.5,y-h-2.5,w+1,2.5,1.2,'#3F5160');rr(c,x+1.2,y-h-9,w-2.4,7,2,'#3F5160');rr(c,x+2.2,y-h-8,w-4.4,5,1.5,'#FFF2BC');
  c.fillStyle=b;c.beginPath();c.arc(x+w/2,y-h-9,4,Math.PI,0);c.fill();
  if(opts.lit!==false){const g=c.createRadialGradient(x+w/2,y-h-5.5,0,x+w/2,y-h-5.5,14);g.addColorStop(0,'rgba(255,236,160,.55)');g.addColorStop(1,'rgba(255,236,160,0)');c.fillStyle=g;c.beginPath();c.arc(x+w/2,y-h-5.5,14,0,7);c.fill();}
  rr(c,x+3.2,y-7,3.6,7,1.8,'#7A5A3A');
}

/* ---------- Flags & sails ---------- */
function drawSymbol(c,sym,cx,cy,s,col){
  if(sym==='skull'){disc(c,cx,cy-.4*s,1.6*s,col);rr(c,cx-1*s,cy+.6*s,2*s,1.2*s,.4*s,col);disc(c,cx-.6*s,cy-.4*s,.45*s,'rgba(0,0,0,.75)');disc(c,cx+.6*s,cy-.4*s,.45*s,'rgba(0,0,0,.75)');line(c,cx-2.2*s,cy+2.2*s,cx+2.2*s,cy+1*s,col,.6*s);line(c,cx-2.2*s,cy+1*s,cx+2.2*s,cy+2.2*s,col,.6*s);}
  else if(sym==='swords'){line(c,cx-2*s,cy-2*s,cx+2*s,cy+2*s,col,.5*s);line(c,cx+2*s,cy-2*s,cx-2*s,cy+2*s,col,.5*s);line(c,cx-2.4*s,cy+1.2*s,cx-1.2*s,cy+2.4*s,'#DDA94D',.5*s);line(c,cx+2.4*s,cy+1.2*s,cx+1.2*s,cy+2.4*s,'#DDA94D',.5*s);}
  else if(sym==='anchor'){line(c,cx,cy-2*s,cx,cy+2*s,col,.5*s);line(c,cx-1.2*s,cy-1*s,cx+1.2*s,cy-1*s,col,.45*s);c.strokeStyle=col;c.lineWidth=.5*s;c.beginPath();c.arc(cx,cy+.6*s,1.8*s,.2,Math.PI-.2);c.stroke();c.beginPath();c.arc(cx,cy-2.4*s,.6*s,0,TAU);c.stroke();}
  else if(sym==='heart'){c.fillStyle=col;c.beginPath();c.moveTo(cx,cy+2*s);c.bezierCurveTo(cx-3*s,cy,cx-1.6*s,cy-2.6*s,cx,cy-1*s);c.bezierCurveTo(cx+1.6*s,cy-2.6*s,cx+3*s,cy,cx,cy+2*s);c.fill();}
  else if(sym==='star'){c.fillStyle=col;c.beginPath();for(let i=0;i<10;i++){const a=i/10*TAU-Math.PI/2,r=(i%2?1:2.4)*s;c.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}c.fill();}
  else if(sym==='parrot'){ell(c,cx,cy+.4*s,1.3*s,1.9*s,col);disc(c,cx+.5*s,cy-1.4*s,1*s,col);poly(c,[[cx+1.3*s,cy-1.5*s],[cx+2.3*s,cy-1*s],[cx+1.3*s,cy-.7*s]],'#F2A33A');}
  else if(sym==='cupcake'){poly(c,[[cx-1.6*s,cy],[cx+1.6*s,cy],[cx+1.1*s,cy+2*s],[cx-1.1*s,cy+2*s]],'#E8B46A');disc(c,cx,cy-.4*s,1.7*s,col);disc(c,cx,cy-2.2*s,.5*s,'#D9485F');}
  else if(sym==='kraken'){disc(c,cx,cy-.8*s,1.6*s,col);for(let i=-1;i<=1;i++){c.strokeStyle=col;c.lineWidth=.5*s;c.beginPath();c.moveTo(cx+i*s,cy+.4*s);c.quadraticCurveTo(cx+i*2*s,cy+1.6*s,cx+i*1.2*s,cy+2.6*s);c.stroke();}}
  else if(sym==='crown'){poly(c,[[cx-2*s,cy+1.4*s],[cx-2*s,cy-1.2*s],[cx-1*s,cy],[cx,cy-2*s],[cx+1*s,cy],[cx+2*s,cy-1.2*s],[cx+2*s,cy+1.4*s]],col);}
  else if(sym==='diamond'){poly(c,[[cx,cy-2.4*s],[cx+1.8*s,cy-.6*s],[cx,cy+2.4*s],[cx-1.8*s,cy-.6*s]],col);line(c,cx-1.8*s,cy-.6*s,cx+1.8*s,cy-.6*s,'rgba(255,255,255,.6)',.25*s);}
  else if(sym==='mark'){drawMark(c,cx,cy,4.6*s,col);}
}
function drawFlag(c,x,y,fid,t,w=12,h=8){const f=it(fid)||it('flag_skull');c.save();const wave=i=>Math.sin(t/220+i*.9)*.9;
  c.fillStyle=f.col;c.beginPath();c.moveTo(x,y);for(let i=0;i<=4;i++)c.lineTo(x+i*w/4,y+wave(i));for(let i=4;i>=0;i--)c.lineTo(x+i*w/4,y+h+wave(i));c.closePath();c.fill();
  drawSymbol(c,f.sym,x+w/2,y+h/2+wave(2),h/7.4,f.sc);c.restore();}
function sailPath(c,x,y,w,h,billow){c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+w/2,y-1.5,x+w,y);c.quadraticCurveTo(x+w+billow,y+h/2,x+w-1,y+h);c.quadraticCurveTo(x+w/2,y+h+1.5,x+1,y+h);c.quadraticCurveTo(x+billow,y+h/2,x,y);c.closePath();}
function drawSail(c,x,y,w,h,sid,t,showMark){const s=it(sid)||it('sail_canvas');const billow=2.2+Math.sin(t/600)*.6;
  c.save();sailPath(c,x,y,w,h,billow);c.fillStyle=s.col;c.fill();c.clip();
  if(s.pat==='stripe')for(let i=0;i<6;i+=2)R(c,x-3,y+i*h/6,w+6,h/6,s.col2);
  if(s.pat==='patch'){R(c,x+w*.15,y+h*.2,w*.25,h*.3,s.col2);R(c,x+w*.6,y+h*.55,w*.22,h*.28,'#D9C08E');}
  if(s.pat==='grad'){const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,s.col);g.addColorStop(1,s.col2);c.fillStyle=g;c.fillRect(x-3,y-2,w+6,h+4);}
  if(s.pat==='stars')for(let i=0;i<9;i++)disc(c,x+((i*37)%100)/100*w,y+((i*61)%100)/100*h,.45,s.col2);
  if(s.pat==='rainbow')['#E0453B','#F2A33A','#F2D24A','#5DBE9C','#4A7EC2','#9B5DE5'].forEach((col,i)=>R(c,x-3,y+i*h/6,w+6,h/6+.2,col));
  if(s.pat==='mark'&&showMark)drawMark(c,x+w/2+1,y+h/2,Math.min(w,h)*.62,s.col2);
  if(s.pat==='skull'&&showMark)drawSymbol(c,'skull',x+w/2+1,y+h/2,Math.min(w,h)/9,s.col2);
  c.fillStyle='rgba(0,0,0,.06)';c.fillRect(x+w*.62,y-2,w,h+4);c.restore();
}

/* ---------- Figureheads & deck items ---------- */
function drawFigure(c,x,y,fid){const f=it(fid);if(!f)return;const st=f.st;
  if(st==='mermaid'){disc(c,x+1.6,y-3.4,1.5,'#F6D2B2');ell(c,x+.8,y-2.6,1.6,2.4,'#C9654A');ell(c,x+2,y,1.4,2.2,'#5DBE9C');}
  else if(st==='gull'){ell(c,x+1.6,y-1.4,2.6,1.6,'#FFFFFF');disc(c,x+3.6,y-2.8,1.3,'#FFFFFF');poly(c,[[x+4.6,y-3],[x+6,y-2.6],[x+4.6,y-2.2]],'#F2A33A');}
  else if(st==='dragon'){c.fillStyle='#3FA59A';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+2,y-5,x+5,y-5.4);c.lineTo(x+6.4,y-4.4);c.lineTo(x+4.4,y-3.6);c.quadraticCurveTo(x+2.6,y-2,x+2,y+1);c.fill();disc(c,x+4.6,y-4.8,.35,'#F2C462');poly(c,[[x+2.6,y-5],[x+3,y-7],[x+3.6,y-5.2]],'#2F7A6E');}
  else if(st==='lion'){disc(c,x+2.6,y-3,2.6,'#C98A2A');disc(c,x+2.8,y-3,1.7,'#F2C462');disc(c,x+3.4,y-3.4,.3,'#3F3A30');}
  else if(st==='kraken'){disc(c,x+2.4,y-3.6,2.2,'#9B5DE5');for(let i=0;i<3;i++){c.strokeStyle='#9B5DE5';c.lineWidth=.8;c.beginPath();c.moveTo(x+1.4+i,y-2);c.quadraticCurveTo(x+i*1.6,y+.6,x+2+i,y+2);c.stroke();}disc(c,x+3,y-4,.5,'#fff');}
  else if(st==='owl'){ell(c,x+2.4,y-2.6,2,2.8,'#E8BC52');disc(c,x+1.8,y-3.6,.7,'#FFF6D8');disc(c,x+3.2,y-3.6,.7,'#FFF6D8');disc(c,x+1.8,y-3.6,.3,'#3F3A30');disc(c,x+3.2,y-3.6,.3,'#3F3A30');}
}
function drawDeckItem(c,id,x,y,t){const d=it(id);if(!d)return;const st=d.st;
  if(st==='barrels'){rr(c,x-4,y-5,3.6,5,1.2,'#B98552');rr(c,x,y-5,3.6,5,1.2,'#A8704A');R(c,x-4,y-3.4,7.6,.5,'#6B4429');}
  else if(st==='cannon'){rr(c,x-4,y-3.6,7,2.6,1.2,'#55606E');disc(c,x-2,y-.8,1.2,'#7A4E30');disc(c,x+1.6,y-.8,1.2,'#7A4E30');disc(c,x+3,y-2.3,.7,'#2E2B33');}
  else if(st==='lanterns'){c.strokeStyle='#7A4E30';c.lineWidth=.3;c.beginPath();c.moveTo(x-6,y-8);c.quadraticCurveTo(x,y-5,x+6,y-8);c.stroke();for(let i=-1;i<=1;i++){glowAt(c,x+i*4,y-6.4+Math.abs(i)*-.6,2.6,'255,220,130',.5+.2*Math.sin(t/300+i));rr(c,x+i*4-.8,y-7.4+Math.abs(i)*-.6,1.6,2,.6,'#F2C462');}}
  else if(st==='chest'){rr(c,x-3.4,y-4,6.8,4,.8,'#A8704A');c.fillStyle='#8A5A3A';c.beginPath();c.ellipse(x,y-4,3.4,1.6,0,Math.PI,0);c.fill();R(c,x-.5,y-4,1,4,'#F2C462');disc(c,x-1.6,y-4.8,.6,'#F2C462');disc(c,x+1.2,y-5,.6,'#F2C462');}
  else if(st==='bunting'){c.strokeStyle='#7A4E30';c.lineWidth=.3;c.beginPath();c.moveTo(x-7,y-9);c.quadraticCurveTo(x,y-6,x+7,y-9);c.stroke();for(let i=-3;i<=3;i++)poly(c,[[x+i*2-.8,y-7.6+Math.abs(i)*-.35],[x+i*2+.8,y-7.6+Math.abs(i)*-.35],[x+i*2,y-5.8+Math.abs(i)*-.35]],['#D9485F','#F2C230','#5DBE9C','#4A7EC2'][(i+3)%4]);}
  else if(st==='plants'){rr(c,x-2,y-2.4,4,2.4,.8,'#C9654A');for(let i=0;i<5;i++){c.fillStyle='#5FAE4E';c.beginPath();c.ellipse(x+Math.cos(i*1.3)*1.6,y-4.4,.8,2.4,i*1.3-.5,0,TAU);c.fill();}}
  else if(st==='wheel'){c.strokeStyle='#E8BC52';c.lineWidth=.6;c.beginPath();c.arc(x,y-4,2.6,0,TAU);c.stroke();for(let i=0;i<8;i++){const a=i/8*TAU+t/2000;line(c,x,y-4,x+Math.cos(a)*3.6,y-4+Math.sin(a)*3.6,'#E8BC52',.4);}disc(c,x,y-4,.8,'#E8BC52');}
}

/* ---------- The ship (bow faces right; x,y = waterline centre; s = scale) ---------- */
function drawShip(c,x,y,s,pl,t,opts={}){
  pl=pl||{};const hull=it(pl.hull||SHIP_DEFAULT.hull)||it('hull_oak');const gild=pl.effect==='goldlh';
  const rock=Math.sin(t/900+(opts.phase||0))*.035,bob=Math.sin(t/650+(opts.phase||0))*1.1;
  c.save();c.translate(x,y+bob*s*.4);c.rotate(rock);c.scale(s,s);
  ell(c,0,4,34,3.2,'rgba(30,60,90,.18)');
  if(pl.trail)drawWake(c,-34,1,(it(pl.trail)||{}).st,t,1);
  // masts and sails
  R(c,-1,-58,2,46,'#7A4E30');R(c,-19,-44,1.6,32,'#7A4E30');
  drawSail(c,-14,-54,24,13,pl.sail,t,false);drawSail(c,-17,-39,30,20,pl.sail,t,true);drawSail(c,-29,-40,18,22,pl.sail,t,false);
  c.fillStyle=(it(pl.sail)||it('sail_canvas')).col;c.beginPath();c.moveTo(2,-50);c.quadraticCurveTo(18,-30,30,-14);c.lineTo(3,-14);c.closePath();c.fill();c.fillStyle='rgba(0,0,0,.05)';c.fill();
  rr(c,-4.5,-48,9,3,1.2,'#8A5A3A');
  drawFlag(c,1,-66,pl.flag||SHIP_DEFAULT.flag,t);R(c,-.4,-67,.8,10,'#7A4E30');
  if(opts.em!=null){R(c,-.4,-76,.8,10,'#7A4E30');disc(c,0,-76.4,1,'#E2AE45');drawEmissary(c,.4,-75,opts.em,t);}
  // rigging
  c.strokeStyle='rgba(90,60,40,.55)';c.lineWidth=.35;c.beginPath();c.moveTo(0,-58);c.lineTo(32,-15);c.moveTo(0,-58);c.lineTo(-32,-14);c.moveTo(-18,-44);c.lineTo(-33,-14);c.stroke();
  // captain & parrot at the helm
  if(opts.captain!==false&&opts.pid){c.save();c.translate(-24,-27);drawKeeper(c,0,0,opts.pid,pl,t,{chicken:opts.chicken,dance:opts.dance});c.restore();
    if(opts.moth!=null)drawMoth(c,-15,-23,opts.moth,t,pl.moth,false);}
  if(opts.pet)drawPet(c,opts.pet,-4,-16,t,.6);
  // deck items
  (pl.deck||[]).slice(0,3).forEach((id,i)=>id&&drawDeckItem(c,id,[-8,6,18][i],-14,t));
  // hull
  c.fillStyle=hull.col;c.beginPath();c.moveTo(-34,-16);c.lineTo(30,-16);c.quadraticCurveTo(38,-17,40,-22);c.quadraticCurveTo(39,-6,24,2);c.quadraticCurveTo(0,5,-24,2);c.quadraticCurveTo(-33,-2,-36,-18);c.closePath();c.fill();
  c.save();c.clip();R(c,-40,-9,82,4,hull.col2);R(c,-40,-2,82,8,hull.col2);c.restore();
  R(c,-35,-17.2,66,1.6,gild?'#F2C462':'#6B4429');
  for(let i=0;i<5;i++){disc(c,-20+i*10,-11.5,1.6,gild?'#F2C462':'#DDA94D');disc(c,-20+i*10,-11.5,1.05,'#2E3A5C');}
  rr(c,-38,-24,6,8,1.5,hull.col2);R(c,-38,-24.6,6,1,gild?'#F2C462':'#6B4429');
  if(pl.figure)drawFigure(c,37,-21,pl.figure);
  // water lapping at the hull
  c.fillStyle='rgba(95,207,216,.45)';c.beginPath();c.moveTo(-40,0);for(let i=0;i<=8;i++)c.quadraticCurveTo(-40+i*10+5,-1.6+Math.sin(t/300+i)*.6,-40+(i+1)*10,0);c.lineTo(42,6);c.lineTo(-40,6);c.closePath();c.fill();
  c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=.6;c.beginPath();for(let i=0;i<4;i++){const sx=-30+i*16+Math.sin(t/500+i)*2;c.moveTo(sx,1);c.quadraticCurveTo(sx+3,-.4,sx+6,1);}c.stroke();
  // cannon smoke
  if(opts.firing&&opts.firing>0){const p=1-opts.firing;for(let i=0;i<4;i++)disc(c,34+p*10+i*2,-14-p*6-i,2.2+p*3,`rgba(255,255,255,${.7*(1-p)})`);}
  c.restore();
}

/* ---------- Hover/tap info regions (world units) ---------- */
function hit(x,y,w,h,title,body,act){S.hits.push({x,y,w,h,title,body,act});}

/* ============================== PETS ============================== */
// x,y = feet centre. Pets are ~10 units tall at s=1. Rarer pets get auras, sparkles and particles.
function drawPet(c,pet,x,y,t,s=1,opts={}){
  if(!pet)return;const sil=opts.silhouette;const C1=sil?'#C9BFA8':pet.col,C2=sil?'#B9AF98':pet.col2,ink=sil?'#B0A68F':'#3F3A30';
  const bob=Math.abs(Math.sin(t/260))*(opts.still?0:1.2);const rar=pet.rar;
  c.save();c.translate(x,y);c.scale(s,s);
  if(!sil){if(rar==='mythic'){const g=c.createRadialGradient(0,-5,0,0,-5,14);g.addColorStop(0,`hsla(${(t/12)%360},90%,75%,.55)`);g.addColorStop(1,'hsla(0,0%,100%,0)');c.fillStyle=g;c.beginPath();c.arc(0,-5,14,0,TAU);c.fill();}
    else if(rar==='legendary')glowAt(c,0,-5,12,'255,214,110',.45);else if(rar==='epic')glowAt(c,0,-5,10,'190,150,255',.3);}
  ell(c,0,.4,5,1.1,'rgba(0,0,0,.12)');
  c.translate(0,-bob);
  const eye=(ex,ey,r=.55)=>{disc(c,ex,ey,r,ink);if(!sil)disc(c,ex+.18,ey-.2,r*.35,'#fff');};
  const blush=(bx,by)=>{if(sil)return;c.globalAlpha=.45;disc(c,bx,by,.6,'#F49A9A');c.globalAlpha=1;};
  const sp=pet.sp;
  if(sp==='dog'||sp==='cat'||sp==='bunny'||sp==='hedgehog'){
    // tail
    if(pet.x==='foxtail'){c.fillStyle=C1;c.beginPath();c.ellipse(-5.2,-3.6,1.8,3.4,-.7+Math.sin(t/300)*.2,0,TAU);c.fill();disc(c,-6.6,-5.8,1.1,'#FFFFFF');}
    else if(sp!=='bunny'&&sp!=='hedgehog'){c.strokeStyle=C1;c.lineWidth=1.3;c.lineCap='round';c.beginPath();c.moveTo(-3.6,-3);c.quadraticCurveTo(-6,-4+Math.sin(t/200)*1.5,-5.4,-6.4);c.stroke();}
    else if(sp==='bunny')disc(c,-3.8,-3,1.4,'#FFFFFF');
    // body
    if(sp==='hedgehog'){c.fillStyle=C1;c.beginPath();for(let i=0;i<13;i++){const a=Math.PI+i/12*Math.PI;const r=i%2?4.6:5.8;c.lineTo(Math.cos(a)*r*1.1-.6,-2.6+Math.sin(a)*r);}c.closePath();c.fill();}
    ell(c,-.4,-2.6,4,2.8,sp==='hedgehog'?C2:C1);ell(c,.4,-2,2.4,1.8,C2);
    rr(c,-3,-1.2,1.3,1.6,.6,C1);rr(c,1.6,-1.2,1.3,1.6,.6,C1);
    if(pet.x==='spots'&&!sil){disc(c,-2,-3.4,.7,C2);disc(c,.6,-3.8,.5,C2);disc(c,-1,-2,.45,C2);}
    if(pet.x==='stripes'&&!sil){for(let i=0;i<3;i++)rr(c,-3+i*1.4,-5,.5,2,.25,C2==='#FFFFFF'?shade(C1):C2);}
    // head
    const hx=3,hy=-6;disc(c,hx,hy,3.2,sp==='hedgehog'?C2:C1);
    if(sp==='dog'){if(pet.ear==='flop'){ell(c,hx-2.6,hy-.4,1,2.2,shade(C1),.3);ell(c,hx+2.6,hy-.4,1,2.2,shade(C1),-.3);}else{poly(c,[[hx-2.8,hy-1.6],[hx-2.4,hy-4.8],[hx-.8,hy-2.6]],C1);poly(c,[[hx+2.8,hy-1.6],[hx+2.4,hy-4.8],[hx+.8,hy-2.6]],C1);}
      ell(c,hx+.4,hy+1.3,1.7,1.2,C2);disc(c,hx+.4,hy+.6,.6,ink);}
    if(sp==='cat'){const pt=pet.ear==='round';if(pt){disc(c,hx-2.3,hy-2.4,1.1,C1);disc(c,hx+2.3,hy-2.4,1.1,C1);}else{poly(c,[[hx-3,hy-1],[hx-2.4,hy-4.6],[hx-.6,hy-2.6]],C1);poly(c,[[hx+3,hy-1],[hx+2.4,hy-4.6],[hx+.6,hy-2.6]],C1);}
      ell(c,hx,hy+1.2,1.6,1,C2);disc(c,hx,hy+.6,.4,'#E07A7A');}
    if(sp==='bunny'){ell(c,hx-1.2,hy-4.6,.9,2.8,C1,-.15);ell(c,hx+1.2,hy-4.6,.9,2.8,C1,.15);ell(c,hx-1.2,hy-4.4,.4,1.8,C2,-.15);ell(c,hx+1.2,hy-4.4,.4,1.8,C2,.15);disc(c,hx,hy+.8,.4,C2);}
    if(sp==='hedgehog')disc(c,hx+2.8,hy+.6,.55,ink);
    eye(hx-1.2,hy-.2);eye(hx+1.4,hy-.2);blush(hx-2,hy+1);blush(hx+2.2,hy+1);
    if(pet.x==='tricorn'&&!sil){poly(c,[[hx-3.6,hy-2.4],[hx,hy-5.6],[hx+3.6,hy-2.4],[hx,hy-3.2]],'#2E2B33');R(c,hx-3.2,hy-2.8,6.4,.4,'#DDA94D');}
    if(pet.x==='bandana'&&!sil){rr(c,hx-2,hy+2.2,4,1,.5,'#D9485F');}
    if(pet.x==='scarf'&&!sil){rr(c,hx-2.2,hy+2.2,4.4,1.1,.5,'#D9485F');rr(c,hx-2,hy+2.8,1,2,.5,'#D9485F');}
    if(pet.x==='lantern'&&!sil){R(c,hx+3.2,hy+1,.3,2,'#7A4E30');glowAt(c,hx+3.4,hy+3.6,3,'255,220,130',.6);rr(c,hx+2.7,hy+2.8,1.4,1.8,.5,'#F2C462');}
    if(pet.x==='flame'&&!sil){for(let i=0;i<4;i++){const fx=-3+i*1.6;poly(c,[[fx-.8,-5],[fx+.2,-8-Math.sin(t/90+i)*1.2],[fx+.9,-5]],i%2?'#FFD45A':'#F27A3A');}}
    if(pet.x==='embers'&&!sil)for(let i=0;i<4;i++){const p=((t/900)+i/4)%1;disc(c,-2+i*1.5,-5-p*7,.4*(1-p)+.1,'#F2A33A');}
  }
  else if(sp==='bird'){ell(c,0,-3.6,3.6,4,C1);ell(c,.4,-2.6,2.4,2.8,C2);disc(c,.2,-7.6,2.6,C1);
    if(pet.x==='penguin'){ell(c,.6,-7.2,1.8,1.6,C2);poly(c,[[1.6,-6.8],[3,-6.4],[1.6,-6]],'#F2A33A');R(c,-1.4,0,1,.6,'#F2A33A');R(c,.6,0,1,.6,'#F2A33A');}
    else if(pet.x==='duck'){poly(c,[[2,-7.4],[4,-7],[2,-6.4]],'#F2A33A');}
    else{disc(c,-.8,-7.8,1.1,C2);disc(c,1.4,-7.8,1.1,C2);poly(c,[[.2,-7.2],[.8,-6.2],[-.4,-6.2]],'#F2A33A');poly(c,[[-2.2,-9.2],[-1.6,-10.6],[-.8,-9.6]],C1);poly(c,[[2.6,-9.2],[2,-10.6],[1.2,-9.6]],C1);}
    eye(-.8,-7.8,.45);eye(1.4,-7.8,.45);ell(c,-2.6,-3.6,1.2,2.6,shade(C1),.3);
    if(pet.x==='lantern'&&!sil){glowAt(c,3.6,-3,3,'255,220,130',.6);rr(c,3,-4,1.4,1.8,.5,'#F2C462');}}
  else if(sp==='dragon'){
    const fl=Math.sin(t/140)*.5;c.fillStyle=sil?C2:pet.col2;[-1,1].forEach(sd=>{c.save();c.translate(-.6,-5.6);c.rotate(sd*(.5+fl*.4)-Math.PI/2*0);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(sd*-1,-6,sd*-5.6,-5.4);c.quadraticCurveTo(sd*-4,-2.6,sd*-4.4,-.6);c.closePath();c.fill();c.restore();});
    c.strokeStyle=C1;c.lineWidth=1.4;c.lineCap='round';c.beginPath();c.moveTo(-3.6,-2.6);c.quadraticCurveTo(-7,-2,-7,-5);c.stroke();poly(c,[[-7.6,-5],[-7,-6.6],[-6.2,-5]],C1);
    ell(c,-.6,-3.4,3.8,3,C1);ell(c,0,-2.6,2.2,2,C2);rr(c,-3,-1.4,1.4,1.8,.6,C1);rr(c,1,-1.4,1.4,1.8,.6,C1);
    disc(c,2.6,-7.2,3,C1);ell(c,4.6,-6.4,1.6,1.2,C1);poly(c,[[1.2,-9.6],[.8,-12],[2.4,-10]],sil?C2:'#F2E2C4');poly(c,[[3.4,-9.8],[3.8,-12.2],[4.4,-9.8]],sil?C2:'#F2E2C4');
    eye(2.2,-7.4);eye(4.2,-7.4);blush(1.4,-6);disc(c,5.6,-6.6,.3,ink);
    for(let i=0;i<4;i++)poly(c,[[-3+i*1.6,-6],[-2.4+i*1.6,-7.4],[-1.8+i*1.6,-6]],sil?C2:pet.col2);
    if(!sil){if(pet.x==='frost')for(let i=0;i<5;i++){const a=t/600+i*1.3;disc(c,Math.cos(a)*8,-6+Math.sin(a)*5,.45,'#E6F6FF');}
      if(pet.x==='petals')for(let i=0;i<5;i++){const p=((t/1400)+i/5)%1;ell(c,-6+i*3,-12+p*13,.7,.4,'#F7B6CC',p*6);}
      if(pet.x==='storm'&&Math.sin(t/300)>.8)poly(c,[[5,-12],[6,-12],[5,-9],[6.6,-9],[4,-5]],'#FFE07A');
      if(rar==='legendary'&&Math.sin(t/500)>.6){disc(c,7,-6.4,1,'rgba(255,170,80,.7)');disc(c,8.4,-6.6,.7,'rgba(255,220,120,.6)');}}
  }
  else if(sp==='otter'||sp==='axolotl'){ell(c,0,-3,4.6,3,C1);disc(c,3,-6,3,C1);ell(c,3.3,-5,1.8,1.3,C2);eye(2,-6.6);eye(4.2,-6.6);blush(1.4,-5.2);blush(5,-5.2);
    if(sp==='axolotl'&&!sil)[-1,1].forEach(sd=>{for(let k=0;k<3;k++){c.strokeStyle=C2;c.lineWidth=.6;c.beginPath();c.moveTo(3+sd*2.6,-6.6);c.lineTo(3+sd*(4+k*.3),-8.4+k*1.2);c.stroke();}});
    if(sp==='otter'&&!sil){rr(c,1.2,-3.6,3,1.6,.8,'#B9DDEB');}
    c.strokeStyle=C1;c.lineWidth=1.2;c.beginPath();c.moveTo(-4,-2.4);c.quadraticCurveTo(-6.6,-1.4,-6,-3.6);c.stroke();}
  else if(sp==='crab'){[-1,1].forEach(sd=>{ell(c,sd*4.6,-5.2,1.6,1.2,C1,sd*.4);for(let k=0;k<3;k++)line(c,sd*2.4,-1.8+k*.4,sd*4.6,-.4+k*.6,C1,.5);});ell(c,-1,-5.4,3.4,3.4,C2);ell(c,0,-2.6,3.6,2.2,C1);R(c,-1,-5.4,.4,1.6,C1);R(c,.8,-5.4,.4,1.6,C1);eye(-.8,-5.8,.5);eye(1,-5.8,.5);}
  else if(sp==='turtle'){ell(c,0,-3,5,3.2,C2);c.fillStyle=C1;c.beginPath();c.ellipse(0,-3.6,4.4,3,0,Math.PI,0);c.fill();for(let i=-1;i<=1;i++)disc(c,i*2,-4.6,.8,shade(C1));disc(c,5,-3.4,1.8,C2);eye(5.6,-3.8,.45);rr(c,-3.6,-1.4,1.4,1.4,.6,C2);rr(c,2,-1.4,1.4,1.4,.6,C2);}
  else if(sp==='kraken'){c.globalAlpha=sil?1:(.75+.15*Math.sin(t/400));for(let i=0;i<5;i++){c.strokeStyle=i%2?C2:C1;c.lineWidth=1.1;c.lineCap='round';c.beginPath();c.moveTo(-3+i*1.5,-3);c.quadraticCurveTo(-4+i*2+Math.sin(t/300+i),-1,-3+i*1.5+Math.cos(t/300+i),.4);c.stroke();}disc(c,0,-6,4,C1);c.globalAlpha=1;eye(-1.4,-6,.7);eye(1.4,-6,.7);blush(-2.6,-4.8);blush(2.6,-4.8);}
  else if(sp==='narwhal'){ell(c,0,-4,6,3.4,C1);ell(c,.6,-3,4.4,2,C2);poly(c,[[-6,-4],[-9,-6.6],[-9,-1.6]],C1);line(c,5,-6,9.6,-10,sil?C2:'#FFF3D0',.8);eye(3.4,-5,.55);blush(4.4,-3.6);
    if(!sil&&pet.x==='stars')for(let i=0;i<6;i++)disc(c,-4+i*1.6,-5.6+(i%2),.35,'#FFF3B8');
    if(!sil&&pet.x==='aurora'){for(let i=0;i<5;i++){c.fillStyle=`hsla(${150+i*30+(t/20)%60},90%,70%,.5)`;c.fillRect(-6+i*2.4,-12-Math.sin(t/400+i)*2,1.6,5);}}}
  else if(sp==='seahorse'){c.fillStyle=C1;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-3,-1,-2,-4);c.quadraticCurveTo(-3,-7,0,-9);c.quadraticCurveTo(3,-9,2.6,-7);c.lineTo(5,-6.4);c.lineTo(2.4,-5.6);c.quadraticCurveTo(1,-3,1.6,-1);c.quadraticCurveTo(1.4,1.4,-.6,1.6);c.closePath();c.fill();eye(.8,-7.4,.5);
    if(!sil&&pet.x==='rainbow')['#E0453B','#F2A33A','#F2D24A','#5DBE9C','#4A7EC2'].forEach((col,i)=>disc(c,-1.6+i*.2,-8+i*1.4,.5,col));}
  if(!sil&&(rar==='legendary'||rar==='mythic'))for(let i=0;i<4;i++){const a=t/700+i*1.6;const sx=Math.cos(a)*9,sy=-6+Math.sin(a*1.3)*6;c.fillStyle=rar==='mythic'?`hsl(${(t/8+i*90)%360},90%,75%)`:'#FFE07A';c.beginPath();for(let k=0;k<8;k++){const an=k/8*TAU,r=k%2?.35:1.1;c.lineTo(sx+Math.cos(an)*r,sy+Math.sin(an)*r);}c.fill();}
  c.restore();
}
function drawPetIcon(cv,pet,sil){cv.width=120;cv.height=120;const c=cv.getContext('2d');c.setTransform(3,0,0,3,0,0);drawPet(c,pet,20,32,1200,2.1,{silhouette:sil,still:true});}

/* ---------- Emissary pennant, wakes and cannonball styles ---------- */
const EM_COLS=['#9AA3AE','#5DBE9C','#4A7EC2','#9B5DE5','#E2AE45'];
function drawEmissary(c,x,y,grade,t){const col=EM_COLS[grade];const len=10+grade*2.4;c.fillStyle=col;c.beginPath();c.moveTo(x,y);for(let i=0;i<=6;i++)c.lineTo(x+i*len/6,y+Math.sin(t/180+i*.8)*.8+i*.25);for(let i=6;i>=0;i--)c.lineTo(x+i*len/6,y+4.6-i*.38+Math.sin(t/180+i*.8)*.8);c.closePath();c.fill();
  for(let i=0;i<=grade;i++)disc(c,x+1.8+i*2,y+2.2+Math.sin(t/180+i)*.5,.6,'#FFFFFF');if(grade===4)glowAt(c,x+len/2,y+2,8,'255,214,110',.35);}
function drawWake(c,x,y,st,t,s=1){if(!st)return;for(let i=0;i<9;i++){const p=((t/900)+i/9)%1;const wx=x-p*40*s,wy=y+Math.sin(p*9+i)*1.5*s;const a=1-p;
  if(st==='bubbles'){c.strokeStyle=`rgba(255,255,255,${a})`;c.lineWidth=.5*s;c.beginPath();c.arc(wx,wy,(1+p*2)*s,0,TAU);c.stroke();}
  else if(st==='sparkle')disc(c,wx,wy,(1.2-p)*s,`rgba(255,240,170,${a})`);
  else if(st==='petals')ell(c,wx,wy,1.2*s,.6*s,`rgba(247,182,204,${a})`,p*6);
  else if(st==='flame')disc(c,wx,wy,(1.6-p)*s,`hsla(${30-p*30},95%,60%,${a})`);
  else if(st==='rainbow')disc(c,wx,wy,1.3*s,`hsla(${i*40},85%,65%,${a})`);
  else if(st==='stars'){c.fillStyle=`rgba(255,243,184,${a})`;c.beginPath();for(let k=0;k<8;k++){const an=k/8*TAU,r=(k%2?.35:1.2)*s;c.lineTo(wx+Math.cos(an)*r,wy+Math.sin(an)*r);}c.fill();}}}
function drawShot(c,x,y,st,t){
  if(st==='fire'){glowAt(c,x,y,5,'255,150,60',.7);disc(c,x,y,2,'#F27A3A');disc(c,x-.4,y-.4,1,'#FFE07A');}
  else if(st==='snow'){disc(c,x,y,2.2,'#FFFFFF');disc(c,x+.6,y+.6,.8,'#DCEBF5');}
  else if(st==='heart')drawSymbol(c,'heart',x,y,1.1,'#E0457B');
  else if(st==='glitter'){for(let i=0;i<5;i++)disc(c,x+Math.cos(t/60+i)*2,y+Math.sin(t/60+i)*2,.6,`hsl(${i*70+(t/5)%360},90%,70%)`);}
  else if(st==='duck'){ell(c,x,y+.4,2.2,1.4,'#F7D24A');disc(c,x+1.2,y-1,1.1,'#F7D24A');poly(c,[[x+2.2,y-1],[x+3.2,y-.8],[x+2.2,y-.4]],'#F2A33A');}
  else if(st==='drop')drawMark(c,x,y,5,'#E06034');
  else{disc(c,x,y,2.2,'#3F3A40');disc(c,x-.6,y-.6,.7,'#8A8790');}
}

const DECOR={
  flowers:(c,x,y)=>{R(c,x-6,y-2,12,3,'#3d7a3a');[[-5,'#ff6b9a'],[-2,'#ffdf6b'],[1,'#c58bff'],[4,'#ff6b9a']].forEach(([d,col])=>R(c,x+d,y-4,2,2,col));},
  bench:(c,x,y)=>{R(c,x-7,y-5,14,2,'#a0754a');R(c,x-7,y-9,14,2,'#8a6238');R(c,x-6,y-3,1,3,'#6b4a2a');R(c,x+5,y-3,1,3,'#6b4a2a');},
  post:(c,x,y,t)=>{R(c,x,y-18,2,18,'#2b2340');R(c,x-2,y-22,6,5,'#2b2340');R(c,x-1,y-21,4,3,'#ffdf6b');c.fillStyle='rgba(255,220,120,.2)';c.beginPath();c.arc(x+1,y-19,7+Math.sin(t/300),0,7);c.fill();},
  crates:(c,x,y)=>{R(c,x-7,y-7,7,7,'#a7783e');R(c,x,y-7,7,7,'#946833');R(c,x-4,y-13,7,6,'#b88647');R(c,x-7,y-4,14,1,'#6b4a2a');},
  pine:(c,x,y)=>{R(c,x-1,y-4,2,4,'#5a3a1e');for(let i=0;i<4;i++)R(c,x-7+i*2,y-8-i*4,14-i*4,4,i%2?'#2f6b3f':'#3a7d4a');},
  mailbox:(c,x,y)=>{R(c,x,y-10,2,10,'#6b4a2a');R(c,x-4,y-15,9,6,'#3b8fc4');R(c,x+4,y-17,1,4,'#e33');R(c,x+4,y-17,3,2,'#e33');},
  telescope:(c,x,y)=>{R(c,x-3,y-2,1,2,'#333');R(c,x+3,y-2,1,2,'#333');R(c,x,y-6,1,4,'#333');for(let i=0;i<8;i++)R(c,x-3+i,y-7-i*0.6,3,2,'#c8a26a');},
  rowboat:(c,x,y)=>{R(c,x-9,y-4,18,3,'#8a5a32');R(c,x-7,y-1,14,2,'#6b4024');R(c,x-9,y-5,18,1,'#c9965c');R(c,x+2,y-9,1,5,'#ddd');},
  cat:(c,x,y,t)=>{R(c,x-3,y-4,7,4,'#e08a3a');R(c,x+2,y-7,4,4,'#e08a3a');R(c,x+2,y-8,1,1,'#e08a3a');R(c,x+5,y-8,1,1,'#e08a3a');R(c,x+3,y-6,1,1,'#111');const tw=Math.sin(t/400)>0?1:0;R(c,x-5,y-6+tw,2,2,'#e08a3a');},
  well:(c,x,y)=>{R(c,x-6,y-6,12,6,'#8d8d9a');R(c,x-5,y-5,10,1,'#2f6b8f');R(c,x-6,y-15,1,9,'#6b4a2a');R(c,x+5,y-15,1,9,'#6b4a2a');R(c,x-8,y-17,16,3,'#a33');},
  windmill:(c,x,y,t)=>{R(c,x-4,y-14,8,14,'#e9dcc0');R(c,x-1,y-4,3,4,'#5a3a1e');const a=t/500;for(let k=0;k<4;k++){const an=a+k*Math.PI/2;for(let r=2;r<11;r++)R(c,x+Math.cos(an)*r,y-14+Math.sin(an)*r,2,2,'#c94b4b');}},
  fountain:(c,x,y,t)=>{ell(c,x,y-2,9,3,'#9aa3b8');ell(c,x,y-3,7,2,'#5fb6ff');R(c,x-1,y-11,2,8,'#9aa3b8');for(let i=0;i<5;i++){const p=((t/60+i*7)%20)/20;R(c,x-1+(i-2)*p*4,y-12+p*p*9-6*p,1,1,'#bfe6ff');}},
  crystal:(c,x,y,t)=>{const g=.4+.3*Math.sin(t/300);c.fillStyle=`rgba(120,220,255,${g*.4})`;c.beginPath();c.arc(x,y-8,10,0,7);c.fill();R(c,x-2,y-16,4,16,'#7fe0ff');R(c,x-5,y-9,3,9,'#5fb6ff');R(c,x+2,y-11,3,11,'#a6ecff');},
  trophy:(c,x,y)=>{R(c,x-7,y-14,14,14,'#6b4024');R(c,x-6,y-13,12,12,'#2b2340');R(c,x-4,y-11,3,4,'#ffbf4d');R(c,x+1,y-11,3,4,'#c0c8d8');R(c,x-2,y-5,4,3,'#c58bff');},
  m_jelly:(c,x,y,t)=>{const b=Math.sin(t/300)*2;ell(c,x,y-12+b,5,3,'#ff9fd0');for(let i=-3;i<=3;i+=2)R(c,x+i,y-9+b,1,6,'#ffc4e4');c.fillStyle='rgba(255,160,210,.2)';c.beginPath();c.arc(x,y-10+b,9,0,7);c.fill();},
  m_anchor:(c,x,y)=>{R(c,x-1,y-15,2,14,'#55606f');R(c,x-5,y-12,10,2,'#55606f');R(c,x-6,y-4,12,2,'#55606f');R(c,x-6,y-6,2,2,'#55606f');R(c,x+4,y-6,2,2,'#55606f');ell(c,x,y-16,2,2,'#55606f');},
  m_figure:(c,x,y)=>{R(c,x-3,y-16,6,6,'#d9a87a');R(c,x-4,y-17,8,3,'#8a3a8a');R(c,x-3,y-10,6,6,'#5fb6ff');R(c,x-5,y-4,10,4,'#2f8a8a');},
  m_bonsai:(c,x,y)=>{R(c,x-5,y-3,10,3,'#4f5f8f');R(c,x,y-8,1,5,'#8a5a32');ell(c,x-2,y-10,4,2,'#ff7a6b');ell(c,x+3,y-12,3,2,'#ff9f8b');},
  m_orrery:(c,x,y,t)=>{R(c,x-1,y-8,2,8,'#c8a26a');disc(c,x,y-12,2,'#ffbf4d');for(let k=0;k<3;k++){const a=t/(600+k*300)+k;R(c,x+Math.cos(a)*(5+k*3),y-12+Math.sin(a)*(2+k),2,2,['#5fb6ff','#ff6b7f','#79e2a0'][k]);}},
  m_dragon:(c,x,y,t)=>{R(c,x,y-30,1,30,'#ddd');const b=Math.sin(t/250)*3;for(let i=0;i<8;i++)R(c,x+2+i*3,y-34+Math.sin(t/200+i)*2+b,3,3,i?'#ff5f5f':'#ffbf4d');R(c,x+2,y-36+b,2,1,'#fff');},
};

/* ---------- Extra hideout decorations ---------- */
function palm(c,x,y,h=14,t=0){const sw=Math.sin(t/900)*.6;c.strokeStyle='#A8784A';c.lineWidth=1.8;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+2,y-h/2,x+1+sw,y-h);c.stroke();
  for(let i=0;i<6;i++){const a=-Math.PI/2+(i-2.5)*.55;c.fillStyle=i%2?'#4FA552':'#5FBF5A';c.beginPath();c.ellipse(x+1+sw+Math.cos(a)*4.4,y-h+Math.sin(a)*2.2+2,5,1.5,a,0,TAU);c.fill();}disc(c,x+.4+sw,y-h+1.4,1,'#8A5A3A');disc(c,x+2+sw,y-h+1.6,1,'#8A5A3A');}
Object.assign(DECOR,{
  pine:(c,x,y,t)=>palm(c,x,y,16,t),
  flowers:(c,x,y)=>{ell(c,x,y-1.4,7,2.4,'#5FAE4E');[[-5,'#E0457B'],[-2,'#F2C230'],[1,'#F27A5E'],[4,'#E0457B']].forEach(([d,col])=>{disc(c,x+d,y-3.4,1.4,col);disc(c,x+d,y-3.4,.5,'#FFF3B8');});},
  sandcastle:(c,x,y)=>{rr(c,x-6,y-5,12,5,1,'#EBCB8A');rr(c,x-5,y-9,3,4,.6,'#E3BE77');rr(c,x+2,y-9,3,4,.6,'#E3BE77');rr(c,x-1.5,y-11,3,6,.6,'#EBCB8A');poly(c,[[x,y-14],[x+3,y-13],[x,y-12]],'#D9485F');R(c,x-.2,y-14,.4,3,'#7A4E30');},
  hammock:(c,x,y)=>{R(c,x-9,y-12,1.4,12,'#A8704A');R(c,x+8,y-12,1.4,12,'#A8704A');c.fillStyle='#F2E2C4';c.beginPath();c.moveTo(x-8,y-10);c.quadraticCurveTo(x,y-2,x+8.6,y-10);c.quadraticCurveTo(x,y-5,x-8,y-10);c.fill();for(let i=-6;i<6;i+=3)R(c,x+i,y-7+Math.abs(i)*-.3,1.2,1.2,'#D9485F');},
  campfire:(c,x,y,t)=>{line(c,x-4,y-1,x+4,y-2.4,'#7A4E30',1.2);line(c,x-4,y-2.4,x+4,y-1,'#7A4E30',1.2);glowAt(c,x,y-4,9,'255,170,80',.35);const f=Math.sin(t/120)*.6;poly(c,[[x-2.6,y-2],[x,y-8-f],[x+2.6,y-2]],'#F27A3A');poly(c,[[x-1.4,y-2],[x,y-5.6+f],[x+1.4,y-2]],'#FFD45A');},
  umbrella:(c,x,y)=>{R(c,x-.4,y-14,.8,14,'#7A4E30');c.fillStyle='#FFFFFF';c.beginPath();c.arc(x,y-13,8,Math.PI,0);c.fill();c.save();c.beginPath();c.arc(x,y-13,8,Math.PI,0);c.clip();for(let i=0;i<4;i++){c.fillStyle='#E0603F';c.beginPath();c.moveTo(x,y-13);c.arc(x,y-13,8,Math.PI+i*Math.PI/4,Math.PI+(i+.5)*Math.PI/4);c.fill();}c.restore();rr(c,x-7,y-2,7,2,1,'#4A7EC2');},
  tiki:(c,x,y,t)=>{[-5,5].forEach(d=>{R(c,x+d-.5,y-13,1,13,'#8A5A3A');glowAt(c,x+d,y-15,5,'255,180,90',.4);poly(c,[[x+d-1.4,y-13],[x+d,y-17.5-Math.sin(t/110+d)*.6],[x+d+1.4,y-13]],'#F2A33A');});},
  xmark:(c,x,y)=>{ell(c,x,y-1,6,2,'#E3C487');line(c,x-3,y-2.4,x+3,y+.4,'#D9485F',1.2);line(c,x+3,y-2.4,x-3,y+.4,'#D9485F',1.2);R(c,x+4,y-8,.6,7,'#A8704A');rr(c,x+3.6,y-11,4,3,.6,'#F4EFE4');},
  cannonfort:(c,x,y)=>{rr(c,x-6,y-5,12,5,1.2,'#B9AE98');rr(c,x-3,y-9,9,3,1.4,'#55606E');disc(c,x+6,y-7.5,1,'#2E2B33');disc(c,x-2,y-3,2,'#7A4E30');},
  maptable:(c,x,y)=>{rr(c,x-7,y-7,14,2,.6,'#A8704A');R(c,x-6,y-5,1,5,'#7A4E30');R(c,x+5,y-5,1,5,'#7A4E30');rr(c,x-5,y-8.4,10,2,.4,'#F4E8CC');line(c,x-3,y-7.4,x+2,y-7.6,'#D9485F',.4);disc(c,x+3,y-7.6,.5,'#D9485F');},
  skullrock:(c,x,y)=>{ell(c,x,y-7,9,8,'#A9A396');disc(c,x-3,y-8,2,'#5A5650');disc(c,x+3,y-8,2,'#5A5650');poly(c,[[x,y-6],[x-1,y-3.6],[x+1,y-3.6]],'#5A5650');ell(c,x,y,10,1.6,'rgba(0,0,0,.08)');},
  wreck:(c,x,y)=>{c.save();c.translate(x,y);c.rotate(-.18);c.fillStyle='#8A5A3A';c.beginPath();c.moveTo(-12,-6);c.lineTo(10,-6);c.quadraticCurveTo(13,-6,12,-2);c.quadraticCurveTo(0,1,-10,-1);c.closePath();c.fill();R(c,-2,-18,1.2,12,'#7A4E30');poly(c,[[-1,-17],[7,-12],[-1,-9]],'#E9DFC6');c.restore();disc(c,x+8,y-2,1,'#F2C462');disc(c,x+10,y-1,.8,'#F2C462');},
  goldpile:(c,x,y,t)=>{glowAt(c,x,y-4,12,'255,210,90',.35);for(let i=0;i<14;i++){const a=i*2.4,r=(i%5)*1.4;disc(c,x+Math.cos(a)*r*1.4,y-1.6-(4-i%5)*1.4,1.5,i%3?'#F2C462':'#E3A93A');}rr(c,x-6,y-1.6,12,1.6,.8,'#E3A93A');disc(c,x+1,y-8,1,'#FFF3B8');},
});
function drawDecor(c,id,x,y,t){(DECOR[id]||((c,x,y)=>{disc(c,x,y-5,4,'#9B7FD9');}))(c,x,y,t);}

/* ---------- Sky, sea and weather ---------- */
const STARS=Array.from({length:50},(_,i)=>[h32('s'+i)%W,h32('y'+i)%90,h32('b'+i)%3]);
const CLOUDS=[[30,22,1],[120,14,.8],[210,30,1.1],[290,12,.7]];
function skyMode(){const cfg=C();const m=L().min;return (m>=hm(cfg.dayEnd)+30||m<hm(cfg.dayStart)-90)?'dusk':'day';}
function sky(c,t,opts={}){
  const mode=opts.mode||(opts.dawn?'gold':skyMode());
  const cols={day:['#6CC0EC','#C3EAF7'],gold:['#F4A86A','#FFE3A8'],dusk:['#34437A','#8E7FB0']}[mode];
  const g=c.createLinearGradient(0,0,0,130);g.addColorStop(0,cols[0]);g.addColorStop(1,cols[1]);c.fillStyle=g;c.fillRect(0,0,W,H);
  if(mode==='dusk'){STARS.forEach(([x,y,b],i)=>{const tw=(Math.sin(t/600+i)+1)/2;if(tw>.3||b===2)disc(c,x,y,b===2?.8:.5,'#FFFFFF');});disc(c,46,28,8,'#FFF6D8');disc(c,50,25,7,cols[0]);}
  else{const sx=mode==='gold'?60:44,sy=mode==='gold'?74:30;glowAt(c,sx,sy,32,'255,240,170',.85);disc(c,sx,sy,9,'#FFF3B8');}
  if(opts.rainbow){['#E0453B','#F2A33A','#F2D24A','#5DBE9C','#4A7EC2','#9B5DE5'].forEach((col,i)=>{c.strokeStyle=col;c.globalAlpha=.32;c.lineWidth=2.4;c.beginPath();c.arc(200,140,90-i*2.4,Math.PI,TAU);c.stroke();});c.globalAlpha=1;}
  if(opts.aurora){for(let x=0;x<W;x+=3){const y=26+Math.sin(x/30+t/1500)*8;c.fillStyle=`hsla(${150+Math.sin(x/50+t/2000)*50},90%,75%,.25)`;c.fillRect(x,y,3,26);}}
  if(mode!=='dusk')CLOUDS.forEach(([x0,y,s],i)=>{const x=((x0+t/(260+i*60))%(W+60))-30;c.globalAlpha=.92;disc(c,x,y,6*s,'#FFFFFF');disc(c,x+7*s,y-3*s,7*s,'#FFFFFF');disc(c,x+15*s,y,6*s,'#FFFFFF');rr(c,x-2*s,y,20*s,5*s,2.5*s,'#FFFFFF');c.globalAlpha=1;});
  if(opts.shooting){const p=(t%4000)/4000;if(p<.3){const x=260-p*500,y=10+p*120;line(c,x,y,x+14,y-7,'rgba(255,255,255,.9)',1);}}
  if(opts.fireworks){const p=(t%2600)/2600;if(p<.6){const cx=80+(Math.floor(t/2600)*97)%180,cy=30+(Math.floor(t/2600)*31)%30;for(let i=0;i<14;i++){const a=i/14*TAU;disc(c,cx+Math.cos(a)*p*22,cy+Math.sin(a)*p*22,.9*(1-p)+.2,['#F2C462','#E0457B','#7CC7E6'][i%3]);}}}
}
function sea(c,y0,t,opts={}){const g=c.createLinearGradient(0,y0,0,H);g.addColorStop(0,opts.glow?'#3EB6C9':'#5FCFD8');g.addColorStop(1,opts.glow?'#1F6F9A':'#3DA4C6');c.fillStyle=g;c.fillRect(0,y0,W,H-y0);
  c.strokeStyle=opts.glow?'rgba(150,255,240,.85)':'rgba(255,255,255,.55)';c.lineWidth=.9;c.lineCap='round';for(let y=y0+5;y<H;y+=8){const off=(t/70+y*11)%40;for(let x=-40;x<W;x+=40){c.beginPath();c.moveTo(x+off,y);c.quadraticCurveTo(x+off+4,y-1.6,x+off+8,y);c.stroke();}}
  if(opts.glow)for(let i=0;i<24;i++)disc(c,(i*47+t/50)%W,y0+6+(i*13)%(H-y0-8),.6+.4*Math.sin(t/300+i),'rgba(170,255,240,.9)');}
function island(c,cx,cy,rx,ry,t){ell(c,cx,cy+2,rx+5+Math.sin(t/600),ry+3,'rgba(255,255,255,.55)');ell(c,cx,cy,rx,ry,'#F4E1B0');ell(c,cx,cy-3,rx-6,ry-3,'#8CCB63');ell(c,cx,cy-5,rx-12,ry-6,'#A2D877');}
function tree(c,x,y){ell(c,x,y,4,1.2,'rgba(0,0,0,.1)');rr(c,x-.9,y-7,1.8,7,.8,'#9A6B45');disc(c,x,y-10,5,'#5FAE4E');disc(c,x-3,y-8,3.5,'#6CBB57');disc(c,x+3,y-8.5,3.5,'#78C760');}
function dolphins(c,t){for(let i=0;i<2;i++){const p=((t/2600)+i*.5)%1;if(p>.5)continue;const q=p*2;const x=40+i*150+q*50,y=150-Math.sin(q*Math.PI)*16;c.save();c.translate(x,y);c.rotate(-Math.cos(q*Math.PI)*.9);ell(c,0,0,6,2.2,'#7FA3C8');poly(c,[[-6,0],[-9,-2],[-9,2]],'#7FA3C8');poly(c,[[-1,-2],[1,-4.6],[2,-1.6]],'#7FA3C8');disc(c,3.6,-.6,.4,'#3F3A30');c.restore();}}
function whale(c,t){const x=250+Math.sin(t/4000)*20,y=158;ell(c,x,y,16,5,'#5E86B8');ell(c,x+2,y+1.6,13,2.6,'#C9DCF0');disc(c,x+10,y-1,.7,'#3F3A30');const p=(t%3000)/3000;if(p<.5)for(let i=0;i<5;i++)disc(c,x+6+(i-2)*1.8*p*2,y-6-p*14+Math.abs(i-2)*p*4,1.2,'rgba(255,255,255,.85)');}

/* ---------- Faces & bosses ---------- */
function bossFace(c,cx,cy,r,ratio,t){const er=Math.max(1.2,r/7.5);const dizzy=ratio<.25;
  [-r*.32,r*.32].forEach(dx=>{disc(c,cx+dx,cy,er+.9,'#FFFFFF');if(dizzy){line(c,cx+dx-er,cy-er*.6,cx+dx+er,cy+er*.6,'#3F3A30',.8);line(c,cx+dx-er,cy+er*.6,cx+dx+er,cy-er*.6,'#3F3A30',.8);}else{disc(c,cx+dx+.4,cy+.2,er*.75,'#3F3A30');disc(c,cx+dx+.9,cy-.4,er*.25,'#FFFFFF');}});
  c.globalAlpha=.5;disc(c,cx-r*.55,cy+r*.28,r*.12,'#F49A9A');disc(c,cx+r*.55,cy+r*.28,r*.12,'#F49A9A');c.globalAlpha=1;
  c.strokeStyle='#3F3A30';c.lineWidth=1;c.lineCap='round';c.beginPath();const mw=r*.26;
  if(ratio>.5)c.arc(cx,cy+r*.22,mw,.15*Math.PI,.85*Math.PI);else{c.moveTo(cx-mw,cy+r*.42);c.quadraticCurveTo(cx,cy+r*.2+Math.sin(t/150)*1.5,cx+mw,cy+r*.42);}c.stroke();
  if(ratio<.5){rr(c,cx+r*.5,cy-r*.6,r*.36,r*.16,1,'#F7E3C0');rr(c,cx+r*.6,cy-r*.72,r*.16,r*.4,1,'#F7E3C0');}
  if(ratio<.75){const d=(t/40)%12;disc(c,cx-r*.85,cy-r*.3+d*.4,1,'rgba(140,200,255,.9)');}}
function drawBoss(c,boss,bx,by,r,ratio,t,flash){
  let col=boss.col;if(boss.rare&&boss.type!=='whale')col=`hsl(${(t/20)%360},62%,72%)`;if(flash)col='#FFFFFF';
  const type=boss.type||'storm';
  if(type==='storm'){ell(c,bx,by+r*.9,r*.9,r*.2,'rgba(0,0,0,.08)');for(let i=0;i<7;i++){const a=i/7*TAU+t/3000;disc(c,bx+Math.cos(a)*r*.6,by+Math.sin(a)*r*.35,r*.55,col);}disc(c,bx,by,r*.78,col);disc(c,bx-r*.3,by-r*.35,r*.22,'rgba(255,255,255,.5)');
    if(Math.sin(t/400)>.85){poly(c,[[bx-2,by+r*.7],[bx+2,by+r*.7],[bx-1,by+r*1.3],[bx+3,by+r*1.3],[bx-3,by+r*2]],'#FFE07A');}
    for(let i=0;i<5;i++){const yy=by+r*.8+((t/8+i*13)%30);line(c,bx-r*.6+i*r*.3,yy,bx-r*.6+i*r*.3-1,yy+3,'rgba(120,170,220,.7)',.7);}
    bossFace(c,bx,by-r*.05,r,ratio,t);}
  else if(type==='serpent'){for(let i=0;i<3;i++){const hx=bx-r*1.2+i*r*.75,hy=by+r*.55;c.fillStyle=col;c.beginPath();c.arc(hx,hy,r*.32,Math.PI,0);c.fill();}
    c.fillStyle=col;c.beginPath();c.moveTo(bx+r*.2,by+r*.6);c.quadraticCurveTo(bx+r*.2,by-r*.3,bx+r*.5,by-r*.5);c.lineTo(bx+r*.9,by-r*.4);c.quadraticCurveTo(bx+r*.7,by+r*.1,bx+r*.75,by+r*.6);c.fill();
    ell(c,bx+r*.6,by-r*.55,r*.55,r*.42,col);for(let i=0;i<3;i++)poly(c,[[bx+r*(.2+i*.2),by-r*.9],[bx+r*(.3+i*.2),by-r*1.2],[bx+r*(.4+i*.2),by-r*.9]],'#F2C462');
    bossFace(c,bx+r*.6,by-r*.6,r*.6,ratio,t);}
  else if(type==='octopus'||type==='kraken'){const n=type==='kraken'?8:6;for(let i=0;i<n;i++){const a=Math.PI*(.1+i*.8/(n-1));const sx=bx+Math.cos(a)*r*.7,sy=by+r*.35;c.strokeStyle=col;c.lineWidth=r*.2;c.lineCap='round';c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(sx+Math.cos(t/400+i)*r*.5,sy+r*.5,sx+Math.sin(t/500+i)*r*.4,sy+r*.95);c.stroke();}
    ell(c,bx,by-r*.15,r*.8,r*.9,col);disc(c,bx-r*.3,by-r*.6,r*.18,'rgba(255,255,255,.45)');for(let i=0;i<4;i++)disc(c,bx-r*.5+i*r*.33,by+r*.5,r*.07,'rgba(255,255,255,.4)');
    if(type==='octopus'){rr(c,bx-r*.7,by-r*1.05,r*1.4,r*.25,r*.1,'#FFFFFF');txt(c,'OOO',bx,by-r*1.05,'#E0457B',Math.max(4,r*.22),'center');}
    bossFace(c,bx,by-r*.1,r*.85,ratio,t);}
  else if(type==='crab'){[-1,1].forEach(sd=>{c.strokeStyle=col;c.lineWidth=r*.12;c.beginPath();c.moveTo(bx+sd*r*.6,by);c.quadraticCurveTo(bx+sd*r*1.1,by-r*.4,bx+sd*r*1.05,by-r*.8);c.stroke();const snip=Math.sin(t/200)*.25;ell(c,bx+sd*r*1.05,by-r*1,r*.35,r*.28,col,sd*snip);
      for(let k=0;k<3;k++)line(c,bx+sd*r*.5,by+r*.2+k*r*.12,bx+sd*r*1,by+r*.45+k*r*.12,col,r*.07);});
    ell(c,bx,by,r*.8,r*.55,col);disc(c,bx-r*.3,by-r*.25,r*.14,'rgba(255,255,255,.45)');R(c,bx-r*.3,by-r*.7,r*.06,r*.3,col);R(c,bx+r*.24,by-r*.7,r*.06,r*.3,col);
    bossFace(c,bx,by-r*.05,r*.7,ratio,t);for(let i=0;i<5;i++)disc(c,bx-r*.5+i*r*.25,by+r*.32,r*.06,'#C9654A');}
  else if(type==='whale'){glowAt(c,bx,by,r*1.6,'255,220,120',.35);ell(c,bx,by,r*1.15,r*.7,col);ell(c,bx+r*.1,by+r*.3,r*.9,r*.32,'#FFF3D0');poly(c,[[bx-r*1.05,by],[bx-r*1.6,by-r*.55],[bx-r*1.5,by+r*.4]],col);
    const p=(t%2400)/2400;if(p<.5)for(let i=0;i<5;i++)disc(c,bx+r*.1+(i-2)*p*4,by-r*.8-p*r*1.1+Math.abs(i-2)*p*3,1.4,'rgba(255,255,255,.9)');bossFace(c,bx+r*.4,by-r*.1,r*.7,ratio,t);}
  else if(type==='ship'){const pl={hull:boss.ghost?'hull_ghost':'hull_navy',sail:boss.ghost?'sail_canvas':'sail_black',flag:'flag_skull'};c.save();if(boss.ghost)c.globalAlpha=.78+.12*Math.sin(t/500);
    c.translate(bx,by+r*.7);c.scale(-1,1);drawShip(c,0,0,r/34,pl,t,{captain:false});c.restore();c.globalAlpha=1;
    bossFace(c,bx-r*.05,by+r*.3,r*.55,ratio,t);
    if(ratio<.5)for(let i=0;i<3;i++){const fx=bx-r*.6+i*r*.5;glowAt(c,fx,by+r*.2,4,'255,140,60',.6);poly(c,[[fx-1.4,by+r*.3],[fx,by+r*.3-4-Math.sin(t/100+i)],[fx+1.4,by+r*.3]],'#F2A33A');}}
}

/* ---------- Funnal Cove harbour (shared) ---------- */
function drawHarbour(c,t){
  if(!G)return;S.target=null;const today=G.days[G.today];const tgt=today.target,team=today.team;const won=tgt>0&&team>=tgt;
  const teamFog=Object.values(S.forfeits).some(f=>f&&f.type==='team'&&f.status==='spun'&&Date.now()-f.ts<86400000);
  sky(c,t,{dawn:won});
  ell(c,18,112,30,7,'#86BDB6');ell(c,302,110,40,8,'#86BDB6');
  const B=Object.fromEntries(G.proj.map(p=>[p.id,p]));
  if(B.sky.built){const x=(t/60)%380-40;ell(c,x,34,12,5,'#E06034');rr(c,x-6,39,12,4,1.5,'#7A5A3A');}
  sea(c,108,t);
  island(c,110,118,100,16,t);
  palm(c,26,116,15,t);palm(c,192,116,13,t+400);
  const open=G.proj.find(p=>p.open);
  const drawIf=(id,fn,sx,sy,w,h)=>{const pr=B[id];if(pr.built){fn();hit(sx,sy,w,h,pr.name,pr.blurb+' Built by the crew.');}else if(open&&open.id===id){hit(sx,sy-8,w,h+8,'Next build: '+pr.name,`${pr.blurb} Needs ${fmtN(pr.dm)} crew DMs (you have ${fmtN(G.teamDm)}) and ${fmtN(pr.g)} doubloons of funding (${fmtN(pr.funded)} so far). Fund it from the Quests tab.`);c.strokeStyle='rgba(63,81,96,.45)';c.lineWidth=.8;c.setLineDash([2,2]);c.beginPath();c.roundRect?c.roundRect(sx,sy,w,h,3):c.rect(sx,sy,w,h);c.stroke();c.setLineDash([]);txt(c,'next build',sx+w/2,sy-8,'#3F5160',6,'center');}};
  drawIf('jetty',()=>{rr(c,196,116,36,3,1,'#B98552');for(let i=199;i<232;i+=7)R(c,i,119,1.6,7,'#8A5E38');},196,113,36,12);
  drawIf('boats',()=>{[[250,122],[272,130]].forEach(([x,y],i)=>{const b=Math.sin(t/500+i);rr(c,x-6,y+b,12,3.4,1.7,'#D9485F');R(c,x-.3,y-7+b,.7,7,'#FFFFFF');poly(c,[[x+.5,y-6+b],[x+5,y-1+b],[x+.5,y-1+b]],'#FFFFFF');});},240,112,40,24);
  drawIf('stall',()=>{rr(c,40,96,16,11,2,'#E8B46A');for(let i=0;i<4;i++)rr(c,39+i*4.5,92,4.5,5,1.5,i%2?'#E06034':'#FFFFFF');disc(c,44,101,1.5,'#FFE7A0');disc(c,51,101,1.5,'#FFE7A0');},38,88,20,19);
  drawIf('bakery',()=>{rr(c,60,88,22,18,2,'#FFF4DE');poly(c,[[57,89],[71,79],[85,89]],'#C9654A');rr(c,68,98,5,8,2,'#9A6B45');rr(c,62,92,4,4,1,'#9FD7F0');rr(c,75,92,4,4,1,'#9FD7F0');R(c,82,91,.7,6,'#7A4E30');rr(c,82.6,91,6,4,1,'#F4E8CC');disc(c,85.6,93,1,'#C9654A');disc(c,78,76-(t/120%6),1.5,'rgba(255,255,255,.7)');},57,78,32,28);
  drawIf('market',()=>{rr(c,86,104,40,3,1.5,'#E9D6A8');for(let i=0;i<3;i++){rr(c,89+i*13,96,10,8,1.5,'#F4C77D');rr(c,88+i*13,93,12,3.5,1.5,i%2?'#4A7EC2':'#FFFFFF');}},86,92,40,15);
  const beacon=B.beacon.built;drawLighthouse(c,104,106,beacon?50:34,beacon?'#C91E36':'#D9485F',t,{gold:beacon});hit(98,64,14,44,'Funnal Cove lighthouse','Your shared port. It grows as the crew completes building projects (see Quests).');
  drawIf('clock',()=>{rr(c,128,70,12,36,2,'#E6D7B5');poly(c,[[126,71],[134,62],[142,71]],'#486790');disc(c,134,78,4,'#FFFFFF');const a=t/2000;line(c,134,78,134+Math.cos(a)*3,78+Math.sin(a)*3,'#3F5160',.6);rr(c,132,96,4,10,2,'#9A6B45');},126,62,16,44);
  drawIf('carto',()=>{rr(c,146,92,18,14,2,'#C79A6A');poly(c,[[143,93],[155,84],[167,93]],'#486790');rr(c,151,98,4,8,2,'#7A5A3A');disc(c,160,96,2,'#FFE7A0');},143,84,24,22);
  drawIf('observatory',()=>{rr(c,170,90,20,16,2,'#F2EEE6');c.fillStyle='#9FB3D9';c.beginPath();c.arc(180,90,10,Math.PI,0);c.fill();R(c,179,80,2,8,'#3F5160');rr(c,177,98,5,8,2,'#3F5160');},169,80,22,26);
  drawIf('flags',()=>{c.strokeStyle='#9A8A6A';c.lineWidth=.5;c.beginPath();c.moveTo(40,85);c.quadraticCurveTo(110,96,190,85);c.stroke();for(let i=0;i<15;i++){const x=44+i*10,y=85+Math.sin(i/14*Math.PI)*5.5+Math.sin(t/400+i)*.6;poly(c,[[x,y],[x+4,y],[x+2,y+4]],['#D9485F','#DDA94D','#5DBE9C','#4A7EC2'][i%4]);}},40,82,150,10);
  drawIf('bridge',()=>{c.strokeStyle='#B98552';c.lineWidth=2;c.beginPath();for(let x=215;x<=320;x+=2){const y=104-Math.sin((x-215)/105*Math.PI)*22;x===215?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();for(let x=221;x<320;x+=12){const y=104-Math.sin((x-215)/105*Math.PI)*22;R(c,x,y-5,.8,5,'#8A5E38');disc(c,x+.4,y-6,1.4,'#FFE07A');}},215,80,105,26);
  // the two flagships
  const P=G.P;const lead=today.leader;
  P.forEach((p,i)=>{const pl=S.players[p]||{};const x=i?142:58,y=154+i*4;const ch=activeForfeitsFor(p).some(f=>f.result==='chicken');
    const fire=S.fired&&S.fired[p]?Math.max(0,1-(performance.now()-S.fired[p])/600):0;
    drawShip(c,x,y,.62,pl,t,{pid:p,chicken:ch,moth:G.players[p]?.moth,phase:i*2,firing:fire,em:emGrade(today.team),pet:PET_BY_ID[pl.pet]});
    hit(x-24,y-50,50,52,`Captain ${pnameRaw(p)}'s ship`,`${today.p[p].d} DMs today. Tap Ship below to customise yours.`);
    if(lead===p){const cx=x,cy=y-56+Math.sin(t/400)*1.2;poly(c,[[cx-5,cy+3],[cx-5,cy-2],[cx-2.5,cy+.5],[cx,cy-3.5],[cx+2.5,cy+.5],[cx+5,cy-2],[cx+5,cy+3]],'#DDA94D');}
    txt(c,C().players[p]?.name||p,x,y+4,pcolHex(p),8,'center');});
  if(tgt>0){const boss=today.boss;const hp=Math.max(0,tgt-team);const ratio=hp/tgt;
    if(!won){const r=12+20*ratio;const bx=262+Math.sin(t/1700)*4,by=78+Math.sin(t/1100)*3;drawBoss(c,boss,bx,by,r,ratio,t,S.bossFlash>t);S.target={x:bx,y:by};
      hit(bx-r*1.2,by-r*1.2,r*2.4,r*2.4,boss.name,`Today's sea foe${boss.rare?' (rare!)':''}. It has ${hp} of ${tgt} HP left: every DM either of you logs fires one cannonball. Sink it to earn +100 XP and 30 doubloons each.`);}
    else{txt(c,'Sunk! Victory!',262,62,'#E06034',10,'center');for(let i=0;i<8;i++){const a=t/700+i*.8;disc(c,262+Math.cos(a)*20,78+Math.sin(a)*9,1.2,'#DDA94D');}rr(c,250,84,24,6,2,'#8A5A3A');}}
  updateLanterns(c,t);
  if(teamFog){c.fillStyle='rgba(200,206,220,.5)';c.fillRect(0,0,W,H);for(let i=0;i<6;i++){const x=(i*67+t/80)%380-30,y=60+(i%3)*30;for(let k=0;k<5;k++)disc(c,x+k*7,y+Math.sin(k)*3,10,'rgba(240,242,248,.55)');}txt(c,'Team forfeit: the fog moved in for the day',160,6,'#3F5160',8,'center');}
}
function launchLantern(p){if(!G)return;const i=G.P.indexOf(p);const voy=S.screen==='lockin'||S.focus;if(voy&&p===S.me&&!S.target)return;S.fired=S.fired||{};S.fired[p]=performance.now();S.lanterns.push({x:voy?126:(i?168:84),y:voy?122:140+i*4,born:performance.now(),col:pcolHex(p),tx:S.target?.x||262,ty:S.target?.y||78,st:(ALL_ITEMS[S.players[p]?.shot]||{}).st});if(S.lanterns.length>40)S.lanterns.shift();}
function updateLanterns(c,t){const nowp=performance.now();S.lanterns=S.lanterns.filter(l=>{const age=(nowp-l.born)/1000;if(age>1.6)return false;const p=Math.min(1,age/1.1);const x=l.x+(l.tx-l.x)*p,y=l.y+(l.ty-l.y)*p-Math.sin(p*Math.PI)*40;
  for(let k=1;k<5;k++){const q=Math.max(0,p-k*.04);disc(c,l.x+(l.tx-l.x)*q,l.y+(l.ty-l.y)*q-Math.sin(q*Math.PI)*40,1.6-k*.3,`rgba(255,255,255,${.5-k*.1})`);}
  drawShot(c,x,y,l.st,t);if(p>=1&&!l.hit){l.hit=true;S.bossFlash=t+110;S.boom={x,y,t:nowp};}return p<1;});
  if(S.boom){const a=(nowp-S.boom.t)/400;if(a<1){for(let i=0;i<7;i++){const an=i/7*TAU;disc(c,S.boom.x+Math.cos(an)*a*9,S.boom.y+Math.sin(an)*a*9,2.4*(1-a),i%2?'#FFD45A':'#F27A3A');}disc(c,S.boom.x,S.boom.y,5*(1-a),'rgba(255,255,255,.8)');}}}

/* ---------- Your ship (personal) and hideout ---------- */
const DECOR_SPOTS=[[24,63],[38,66],[52,68],[112,68],[126,66],[140,63]];
function drawShipScene(c,t,pid){
  if(!G)return;const pl=S.players[pid]||{};const me=G.players[pid];const fx=pl.effect;const act=activeForfeitsFor(pid);
  sky(c,t,{aurora:fx==='fx_aurora',shooting:fx==='fx_shooting',rainbow:fx==='fx_rainbow',fireworks:fx==='fx_fireworks'});
  island(c,268,112,34,6,t);palm(c,262,108,10,t);palm(c,276,109,8,t+300);
  sea(c,110,t,{glow:fx==='fx_biolum'});
  if(fx==='fx_whale')whale(c,t);
  const ch=act.some(f=>f.result==='chicken'),dance=act.some(f=>f.result==='dance');
  drawShip(c,140,152,1.55,pl,t,{pid,chicken:ch,dance,moth:me.moth,em:emGrade(G.days[G.today].team),pet:PET_BY_ID[pl.pet]});
  hit(140-20,30,40,20,'Emissary flag',`Grade ${['I','II','III','IV','V'][emGrade(G.days[G.today].team)]}: rises with the crew's DMs today (20, 45, 70, 100). Higher grades make every DM worth more, up to double.`);
  hit(140+2,152-104,20,14,'Your flag',`${(it(pl.flag||SHIP_DEFAULT.flag)||{}).name}. Change it under Wardrobe & rigging.`);
  hit(140-30,152-90,50,50,'Sails',`${(it(pl.sail||SHIP_DEFAULT.sail)||{}).name}. Change them under Wardrobe & rigging.`);
  hit(140-55,152-30,120,32,'Hull',`${(it(pl.hull||SHIP_DEFAULT.hull)||{}).name}${pl.figure?' with a '+it(pl.figure).name:''}.`);
  if(pl.pet&&PET_BY_ID[pl.pet])hit(140-14,152-36,14,16,PET_BY_ID[pl.pet].name,`Your ${PET_BY_ID[pl.pet].rar} pet. Collect more from daily sightings.`);
  if(fx==='fx_dolphins')dolphins(c,t);
  if(act.some(f=>f.result==='gull'))drawGull(c,90+Math.sin(t/700)*4,104,t);
  if(fx==='fx_fireflies')for(let i=0;i<16;i++){const a=t/1500+i;const on=Math.sin(t/300+i)>0;disc(c,40+((i*37)%240)+Math.sin(a)*6,40+((i*23)%60)+Math.cos(a*1.3)*4,on?1.2:.6,on?'#F4FF9A':'#C8D27A');}
  if(fx==='fx_snow')for(let i=0;i<60;i++)disc(c,(i*53+t/40)%W,(i*29+t/25)%H,.8,'#FFFFFF');
  if(fx==='m_fx_bubbles')for(let i=0;i<14;i++){const y=H-((t/30+i*40)%120),x=40+(i*41)%250+Math.sin(t/500+i)*3;c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=.6;c.beginPath();c.arc(x,y,2+i%3,0,TAU);c.stroke();}
  const today=G.days[G.today];if(today.leader!==pid&&today.leader&&today.over.some(o=>o.who!==pid))txt(c,`${C().players[other(pid)]?.name||''} is ahead today`,160,6,pcolHex(other(pid)),8,'center');
}
function drawIslet(c,t,pid){
  if(!G)return;const pl=S.players[pid]||{};const me=G.players[pid];const fx=pl.effect;const act=activeForfeitsFor(pid);
  sky(c,t,{aurora:fx==='fx_aurora',shooting:fx==='fx_shooting',rainbow:fx==='fx_rainbow',fireworks:fx==='fx_fireworks'});
  sea(c,124,t,{glow:fx==='fx_biolum'});
  c.save();c.scale(2,2);
  island(c,80,71,66,10,t);palm(c,16,68,14,t);palm(c,148,67,12,t+200);
  (pl.decor||[]).forEach((id,i)=>{if(id&&DECOR_SPOTS[i])drawDecor(c,id,DECOR_SPOTS[i][0],DECOR_SPOTS[i][1],t+i*300);});
  if(act.some(f=>f.result==='gnomes'))[[60,67],[68,68],[104,68]].forEach(([x,y])=>drawGnome(c,x,y));
  if(act.some(f=>f.result==='statue')){c.save();c.translate(40,38);c.scale(2,2);drawKeeper(c,0,0,other(pid),S.players[other(pid)],0);c.restore();rr(c,38,60,20,4,1.5,'#C9C3B6');}
  const ch=act.some(f=>f.result==='chicken'),dance=act.some(f=>f.result==='dance');
  const kx=78,ky=54;drawKeeper(c,kx,ky,pid,pl,t,{chicken:ch,dance});if(pl.pet&&PET_BY_ID[pl.pet])drawPet(c,PET_BY_ID[pl.pet],kx+14,ky+12,t,.7);
  if(act.some(f=>f.result==='gull'))drawGull(c,kx-13+Math.sin(t/700)*3,ky+6,t);
  const ma=t/1200;drawMoth(c,kx+4+Math.cos(ma)*14,ky-6+Math.sin(ma*1.7)*5,me?.moth||0,t,pl.moth);
  c.restore();
  if(act.some(f=>f.result==='statue'))txt(c,(C().players[other(pid)]?.name||'Rival')+' the Great',96,58,'#3F5160',8,'center');
  if(fx==='fx_dolphins')dolphins(c,t);if(fx==='fx_whale')whale(c,t);
  if(fx==='fx_fireflies')for(let i=0;i<16;i++){const a=t/1500+i;const on=Math.sin(t/300+i)>0;disc(c,40+((i*37)%240)+Math.sin(a)*6,80+((i*23)%50)+Math.cos(a*1.3)*4,on?1.2:.6,on?'#F4FF9A':'#C8D27A');}
  if(fx==='fx_snow')for(let i=0;i<60;i++)disc(c,(i*53+t/40)%W,(i*29+t/25)%H,.8,'#FFFFFF');
}
/* ---------- Lock In voyage: open ocean, encounters, monster, treasure island ---------- */
function voyageEnc(lk,el){if(!lk||!lk.id)return null;let at=70000+h32(lk.id+'e0')%60000;let i=0;while(at<el+1){const end=at+26000;if(el>=at&&el<end){const e=ENCOUNTERS[h32(lk.id+'e'+i)%ENCOUNTERS.length];return{...e,i,p:(el-at)/26000};}i++;at=end+90000+h32(lk.id+'e'+i)%110000;}return null;}
function voyageBoss(lk){const d=VOYAGE_DIFF[lk.diff||'calm'];return{...d,hp:Math.max(5,Math.round(lk.dur/60000*d.rate))};}
function drawVoyage(c,t,lk,dms,progress){
  const pl=S.players[S.me]||{};const el=progress*lk.dur;const enc=voyageEnc(lk,el);const vb=voyageBoss(lk);const left=Math.max(0,vb.hp-dms);
  sky(c,t,{rainbow:enc?.id==='rainbow',shooting:enc?.id==='stars'});
  const speed=1+Math.min(2,(S.voyBoost||0));
  // horizon swell and parallax clouds handled by sky; sea with faster scroll
  sea(c,96,t*1.8*speed,{glow:pl.effect==='fx_biolum'||enc?.id==='jelly'});
  c.fillStyle='rgba(255,255,255,.25)';for(let i=0;i<6;i++){const x=((i*70-t/14*speed)%400+400)%400-40;c.fillRect(x,98+i%3*2,30,.8);}
  // encounters
  if(enc){const p=enc.p;const ex=330-p*380,ey=130;
    if(enc.id==='whale'){const bp=Math.sin(Math.min(1,p*2)*Math.PI);ell(c,ex,ey-bp*18,16,6,'#5E86B8',-.3+p*.6);ell(c,ex+2,ey-bp*18+2,12,3,'#C9DCF0',-.3+p*.6);for(let k=0;k<6;k++)disc(c,ex-12+k*5,ey+2,2+bp*2,'rgba(255,255,255,.8)');}
    else if(enc.id==='dolphins'){for(let k=0;k<3;k++){const q=(p*3+k*.33)%1;c.save();c.translate(ex+k*14,ey+8-Math.sin(q*Math.PI)*12);c.rotate(-Math.cos(q*Math.PI)*.9);ell(c,0,0,6,2.2,'#7FA3C8');poly(c,[[-6,0],[-9,-2],[-9,2]],'#7FA3C8');c.restore();}}
    else if(enc.id==='bottle'||enc.id==='chest'){const got=G.players[S.me]?.claimed.has(`vb_${lk.id}_${enc.i}`);if(!got){const by=ey+Math.sin(t/300)*1.5;if(enc.id==='bottle'){c.save();c.translate(ex,by);c.rotate(.4);rr(c,-2,-6,4,8,1.5,'rgba(170,220,200,.9)');rr(c,-1,-8,2,2.4,.6,'#9A6B45');rr(c,-1.2,-3,2.4,3,.4,'#F4E8CC');c.restore();}else{rr(c,ex-5,by-4,10,6,1,'#A8704A');c.fillStyle='#8A5A3A';c.beginPath();c.ellipse(ex,by-4,5,2.4,0,Math.PI,0);c.fill();R(c,ex-.6,by-5,1.2,5,'#F2C462');}
      glowAt(c,ex,by-3,9,'255,240,170',.4+.2*Math.sin(t/200));hit(ex-10,by-14,20,22,enc.id==='chest'?'Floating chest':'Message in a bottle','Tap to collect a small reward!',{collect:`vb_${lk.id}_${enc.i}`,kind:enc.id});}}
    else if(enc.id==='turtle'){ell(c,ex,ey+4,7,3,'#5DBE9C');disc(c,ex+7,ey+3,2,'#8CCB9C');disc(c,ex+7.6,ey+2.6,.4,'#3F3A30');}
    else if(enc.id==='flyingfish'){for(let k=0;k<6;k++){const q=(p*4+k*.2)%1;const fx=ex+k*8,fy=ey-Math.sin(q*Math.PI)*16;ell(c,fx,fy,2.4,.9,'#9FD7F0',-.3);poly(c,[[fx,fy],[fx-1,fy-2.6],[fx+1.4,fy-.6]],'#DCEFF8');}}
    else if(enc.id==='ghost'){c.globalAlpha=.55;c.save();c.translate(ex,ey-4);c.scale(-1,1);drawShip(c,0,0,.6,{hull:'hull_ghost',sail:'sail_canvas',flag:'flag_skull'},t,{captain:false});c.restore();c.globalAlpha=1;}
    else if(enc.id==='spout'){for(let k=0;k<20;k++){const yy=ey-k*4;disc(c,ex+Math.sin(t/120+k*.5)*(2+k*.3),yy,2+k*.18,'rgba(200,225,240,.55)');}}
    else if(enc.id==='jelly'){for(let k=0;k<5;k++){const jx=ex+k*12,jy=ey+6+Math.sin(t/400+k)*3;glowAt(c,jx,jy,6,'200,160,255',.6);ell(c,jx,jy,3,2,'rgba(230,200,255,.9)');for(let l=-1;l<=1;l++)line(c,jx+l,jy+1,jx+l+Math.sin(t/200+l),jy+5,'rgba(230,200,255,.7)',.4);}}
    else if(enc.id==='mermaid'){disc(c,ex,ey-2,2.2,'#F6D2B2');ell(c,ex-.6,ey-1,2,3,'#C9654A');ell(c,ex+4,ey+3,4,1.4,'#5DBE9C',.5);poly(c,[[ex+7.4,ey+2],[ex+9.6,ey+.6],[ex+9.6,ey+4]],'#5DBE9C');}
    else if(enc.id==='barge'){rr(c,ex-12,ey,24,5,2,'#8A5A3A');rr(c,ex-6,ey-7,12,7,1.5,'#E8B46A');R(c,ex-.4,ey-15,.8,8,'#7A4E30');poly(c,[[ex+.4,ey-15],[ex+7,ey-12],[ex+.4,ey-9]],'#9B5DE5');}
    else if(enc.id==='gulls'){for(let k=0;k<4;k++){const gx=ex-20+k*10,gy=40+Math.sin(t/300+k)*4;c.strokeStyle='#FFFFFF';c.lineWidth=1;c.beginPath();c.moveTo(gx-3,gy);c.quadraticCurveTo(gx-1.5,gy-2,gx,gy);c.quadraticCurveTo(gx+1.5,gy-2,gx+3,gy);c.stroke();}}
  }
  // the voyage monster
  const mx=250+Math.sin(t/900)*6,my=118;
  if(left>0){const r=10+12*(left/vb.hp);const type=lk.diff==='legend'?'kraken':lk.diff==='rough'?'serpent':'seal';
    if(type==='seal'){ell(c,mx,my+4,r,r*.62,'#9AA8B8');disc(c,mx+r*.6,my-r*.2,r*.55,'#9AA8B8');disc(c,mx+r*.45,my-r*.35,r*.12,'#3F3A30');disc(c,mx+r*.85,my-r*.35,r*.12,'#3F3A30');ell(c,mx+r*.7,my-r*.05,r*.22,r*.14,'#5A5650');line(c,mx+r*.95,my,mx+r*1.4,my-r*.1,'#5A5650',.4);c.globalAlpha=.5;disc(c,mx+r*.35,my,r*.12,'#F49A9A');c.globalAlpha=1;}
    else drawBoss(c,{type,col:type==='kraken'?'#9B5DE5':'#7FB59A',eye:'#3F3A30'},mx,my,r,left/vb.hp,t,S.bossFlash>t);
    hit(mx-r-4,my-r-4,r*2+8,r*2+8,vb.desc,`${left} of ${vb.hp} HP left. Every DM you log this voyage hits it. Defeat it before the timer ends for +${vb.xp} XP and ${vb.g} doubloons.`);S.target={x:mx,y:my};}
  else{S.target=null;}
  // treasure island arrives at the end
  if(progress>.86){const q=Math.min(1,(progress-.86)/.14);const ix=340-q*120;island(c,ix,128,36,8,t);palm(c,ix-10,122,14,t);palm(c,ix+12,123,11,t+300);rr(c,ix-4,116,8,5,1,'#A8704A');R(c,ix-.5,116,1,5,'#F2C462');line(c,ix+16,122,ix+20,126,'#D9485F',1);line(c,ix+20,122,ix+16,126,'#D9485F',1);txt(c,'Treasure Island',ix,100,'#E06034',8,'center');hit(ix-36,100,72,32,'Treasure Island','Reach it when the timer ends. Your chest is worth 3 doubloons for every DM you sent on this voyage.');}
  drawShip(c,90,146,1.05,pl,t,{pid:S.me,moth:G?.players[S.me]?.moth,pet:PET_BY_ID[pl.pet],firing:S.fired&&S.fired[S.me]?Math.max(0,1-(performance.now()-S.fired[S.me])/600):0});
  for(let i=0;i<6;i++){const x=48-i*8-((t/30*speed)%8);line(c,x,148,x+5,148,'rgba(255,255,255,.85)',1);}
  updateLanterns(c,t);
  if(enc)txt(c,enc.text,160,6,'#3F5160',8,'center');
}

/* ---------- Icons ---------- */
function drawItemIcon(cv,id){cv.width=120;cv.height=120;const c=cv.getContext('2d');c.setTransform(3,0,0,3,0,0);const d=it(id);const t=1000;if(!d)return;
  const mine={...(S.players[S.me]||{})};
  if(['hat','face','coat'].includes(d.cat)){c.save();c.translate(20,31.5);c.scale(2.3,2.3);drawKeeper(c,-4,-11.5,S.me,{...mine,[d.cat]:id},t);c.restore();}
  else if(['hull','sail','flag','figure'].includes(d.cat)){const pl={...mine,[d.cat]:id,deck:[]};if(d.cat==='flag'){c.save();c.translate(20,20);c.scale(2.2,2.2);drawFlag(c,-6,-4,id,t);c.restore();}else if(d.cat==='figure'){c.save();drawShip(c,15,33,.62,pl,t,{captain:false});c.restore();}else{c.save();drawShip(c,19,33,.5,pl,t,{captain:false});c.restore();}}
  else if(d.cat==='trail'){c.fillStyle='#5FCFD8';c.beginPath();c.arc(20,20,19,0,TAU);c.fill();drawWake(c,30,24,d.st,1600,.9);drawWake(c,30,24,d.st,2300,.9);drawWake(c,30,24,d.st,3100,.9);c.save();drawShip(c,26,30,.36,{...mine,trail:id,deck:[]},t,{captain:false});c.restore();}
  else if(d.cat==='shot'){c.save();c.translate(20,20);c.scale(2.6,2.6);drawShot(c,0,0,d.st,1000);c.restore();}
  else if(d.cat==='deck'){c.save();c.translate(20,30);c.scale(2,2);drawDeckItem(c,id,0,0,t);c.restore();}
  else if(d.cat==='decor'){ell(c,20,33,15,4,'#9BD27A');drawDecor(c,id,20,33,t);}
  else if(d.cat==='moth'){c.save();c.translate(20,24);c.scale(2,2);drawMoth(c,0,0,3,t,id,false);c.restore();}
  else if(d.cat==='shield'){poly(c,[[20,8],[31,12],[31,20],[20,33],[9,20],[9,12]],'#4A7EC2');poly(c,[[20,12],[27,15],[27,20],[20,29],[13,20],[13,15]],'#DDA94D');drawMark(c,20,20,9,'#FFFFFF');}
  else{c.save();c.beginPath();c.arc(20,20,19,0,TAU);c.clip();const g=c.createLinearGradient(0,0,0,40);g.addColorStop(0,'#5B6FA8');g.addColorStop(1,'#9E8FC4');c.fillStyle=g;c.fillRect(0,0,40,40);
    if(id==='fx_aurora')for(let x=0;x<40;x+=2){c.fillStyle=`hsla(${140+x*3},90%,72%,.7)`;c.fillRect(x,10+Math.sin(x/6)*4,2,12);}
    else if(id==='fx_snow')for(let i=0;i<22;i++)disc(c,(i*13)%40,(i*7)%40,.9,'#fff');
    else if(id==='fx_fireflies')for(let i=0;i<10;i++)disc(c,(i*11)%38+1,(i*17)%38+1,1.3,'#F4FF9A');
    else if(id==='fx_shooting'){line(c,10,24,30,12,'#fff',1.2);disc(c,30,12,1.5,'#fff');}
    else if(id==='fx_rainbow'){['#E0453B','#F2A33A','#F2D24A','#5DBE9C','#4A7EC2','#9B5DE5'].forEach((col,i)=>{c.strokeStyle=col;c.lineWidth=1.6;c.beginPath();c.arc(20,34,16-i*1.6,Math.PI,TAU);c.stroke();});}
    else if(id==='fx_dolphins'||id==='fx_whale'||id==='fx_biolum'){c.fillStyle=id==='fx_biolum'?'#1F6F9A':'#5FCFD8';c.fillRect(0,22,40,18);if(id==='fx_biolum')for(let i=0;i<10;i++)disc(c,(i*9)%38+1,25+(i*5)%12,.8,'#AAFFF0');else{c.save();c.translate(-238+20,-152+26);id==='fx_whale'?whale(c,0):null;c.restore();if(id==='fx_dolphins'){ell(c,20,18,7,2.6,'#7FA3C8',-.4);poly(c,[[14,21],[11,20],[12,24]],'#7FA3C8');}}}
    else if(id==='fx_fireworks'){for(let i=0;i<12;i++){const a=i/12*TAU;disc(c,20+Math.cos(a)*9,16+Math.sin(a)*9,1.2,['#F2C462','#E0457B','#7CC7E6'][i%3]);}}
    else if(id==='goldlh'){c.fillStyle='#BFE8F6';c.fillRect(0,0,40,40);drawShip(c,19,33,.5,{...mine,effect:'goldlh',deck:[]},t,{captain:false});}
    else for(let i=0;i<8;i++){c.strokeStyle='#E6F6FF';c.lineWidth=.8;c.beginPath();c.arc((i*9)%36+3,(i*13)%34+3,2,0,TAU);c.stroke();}
    c.restore();}
}
function drawCollectIcon(cv,item,found){cv.width=84;cv.height=84;const c=cv.getContext('2d');c.setTransform(4.2,0,0,4.2,0,0);
  if(!found){txt(c,'?',10,4,'#B9B1A0',10,'center');return;}
  const col={common:'#9AA3AE',uncommon:'#45B07C',rare:'#3E8DDB',epic:'#9B5DE5',legendary:'#D99A17',mythic:'#E0457B'}[item.rar];const set=item.set;
  if(set==='shells'){c.fillStyle=col;c.beginPath();c.moveTo(10,16);c.lineTo(4,8);c.quadraticCurveTo(10,1,16,8);c.closePath();c.fill();}
  else if(set==='bottles'){rr(c,8.5,3,3,3,1,'#9A6B45');rr(c,6,6,8,11,3,col);rr(c,8,9,4,3,1,'#FFFFFF');}
  else if(set==='lanterns'){rr(c,6,5,8,10,3,col);disc(c,10,10,2,'#FFF3B8');R(c,9,3,2,2,'#3F5160');}
  else if(set==='charts'){rr(c,4,5,12,10,1.5,'#F4E8CC');line(c,6,8,13,12,col,.6);line(c,12,7,14,9,'#D9485F',.7);line(c,14,7,12,9,'#D9485F',.7);}
  else if(set==='feathers'){ell(c,10,10,3,7,col,.6);line(c,6,15,14,5,'#fff',.5);}
  else{disc(c,10,10,6,col);disc(c,10,10,4.6,'rgba(255,255,255,.25)');txt(c,'$',10,5.4,'#fff',8,'center');}
}
function avatarCanvas(pid){const cv=document.createElement('canvas');cv.width=96;cv.height=96;const c=cv.getContext('2d');c.setTransform(6,0,0,6,0,0);const g=c.createLinearGradient(0,0,0,16);g.addColorStop(0,'#BFE8F6');g.addColorStop(1,'#E9F7FC');c.fillStyle=g;c.fillRect(0,0,16,16);c.save();c.translate(3.2,2.4);c.scale(1.2,1.2);drawKeeper(c,0,0,pid,S.players[pid],0,{chicken:activeForfeitsFor(pid).some(f=>f.result==='chicken')});c.restore();return cv.toDataURL();}
function drawGullIcon(cv){cv.width=96;cv.height=96;const c=cv.getContext('2d');c.setTransform(8,0,0,8,0,0);drawGull(c,0,3,200);}

/* ============================== HELPERS FOR UI ============================== */
function activeForfeitsFor(p){const now=Date.now();return Object.values(S.forfeits).filter(f=>f&&f.pid===p&&f.status==='spun'&&f.kind==='virtual'&&now-f.ts<86400000);}
function myDmSince(p,ts){return G?G.evs.filter(e=>e.pid===p&&e.k==='d'&&e.t>=ts).length:0;}
function pendingForfeits(p){
  if(!G)return[];const out=[];const cfg=G.cfg;const cut=addDays(G.today,-14);
  for(const d of G.workdays){if(d>=G.today||d<cut||absent(p,d,cfg))continue;const D=G.days[d];const dm=D?D.p[p].d:0;const tgt=targetFor(d,cfg);
    if(dm===0)out.push({date:d,type:'ind',why:`${C().players[p]?.name} logged zero DMs on ${shortDate(d)}`});
    if(tgt>0&&(D?D.team:0)<tgt)out.push({date:d,type:'team',why:`Team reached ${D?D.team:0}/${tgt} on ${shortDate(d)}`});}
  return out.filter(f=>!S.forfeits[`${f.date}_${p}_${f.type}`]);
}
function bar(v,max,cls=''){const w=max>0?clamp(v/max*100,0,100):0;return `<div class="prog ${cls}"><i style="width:${w}%"></i></div>`;}
function phaseLine(boss,ratio,hit){const l=boss.lines;if(hit)return l.dead;if(ratio<=.25)return l.p25;if(ratio<=.5)return l.p50;if(ratio<=.75)return l.p75;return l.start;}
function timeLeftStr(){const cfg=C();const today=L().date;if(!isWork(today,cfg))return 'Day off';const end=londonTs(today,hm(cfg.dayEnd));const st=londonTs(today,hm(cfg.dayStart));const now=Date.now();if(now<st)return `Starts in ${clockStr(st-now)}`;if(now>end)return 'Working day over';return `${clockStr(end-now)} left`;}

/* ============================== SCREENS ============================== */
const SCREENS={};
SCREENS.harbour=()=>{
  const D=G.days[G.today],P=G.P,tgt=D.target,team=D.team,hit=tgt>0&&team>=tgt,hp=Math.max(0,tgt-team),boss=D.boss,mod=D.mod;
  const seg=p=>tgt?clamp(D.p[p].d/Math.max(tgt,team)*100,0,100):0;
  const ms=[125,150,200].find(m=>team<m);const W=G.weeks[weekStart(G.today)];
  const rem=reminder();const mer=merchantToday(G.today);
  const act=P.flatMap(p=>activeForfeitsFor(p).map(f=>({...f,p})));
  const yd=G.workdays.filter(d=>d<G.today).pop();
  return `<canvas id="scene" class="scene" width="960" height="540" aria-label="Lantern Bay harbour and today's fog boss"></canvas>
  <div class="pad">
   ${eventsHtml()}
   ${crewCheckWrap()}
   ${rem?`<div class="remind"><span class="name">Gary the gull</span><canvas class="gull" id="gullIco"></canvas><div>${esc(rem)}</div><button class="btn sm ghost" data-act="nextReminder" aria-label="Another reminder">Next</button></div>`:''}
   <div class="card mission">
    ${tgt>0?`<div class="bossTop"><div><small>Today's sea foe \u00b7 ${esc(niceDate(G.today))}</small><div class="bossName ${boss.rare?'rare':''}">${esc(boss.name)}${boss.rare?' <span class="pill" style="color:var(--r-legendary)">Rare</span>':''}</div></div><b class="score num">${team}<small> / ${tgt}</small></b></div>
    <div class="hp" role="img" aria-label="${hp} HP left">${P.map(p=>`<i class="${p===P[0]?'s':'j'}" style="width:${seg(p)}%"></i>`).join('')}<i class="x" style="flex:1"></i><span>${hit?'DEFEATED':hp+' HP'}</span></div>
    <div class="ticks"><b style="left:25%">75</b><b style="left:50%">50</b><b style="left:75%">25</b></div>
    <div class="speech withName"><span class="who2">${esc(boss.name.split(' ').slice(-1)[0])}</span>${esc(phaseLine(boss,hp/tgt,hit))}</div>
    <div class="contrib">${P.map(p=>`<span><i class="dot" style="background:${pcol(p)}"></i>${pname(p)} <b class="num">${D.p[p].d}</b>${absent(p,G.today)?' <small>(away)</small>':''}</span>`).join('')}<span class="pill" id="timeLeft">${timeLeftStr()}</span></div>
    <div class="row tiny muted" style="gap:14px"><span>Win: <b style="color:var(--ink)">+100 XP, +30 ${CN} each</b></span>${hit&&ms?`<span>Stretch goal: <b style="color:var(--ink)">${team}/${ms}</b></span>`:!hit?`<span>Next phase at ${[75,50,25].find(x=>hp>x)??0} HP</span>`:'<span>All stretch goals smashed</span>'}</div>
    <div class="twist"><b>${esc(mod.name)}</b><span>${esc(mod.desc)}</span></div>`
    :`<h2>No battle today</h2><p class="muted" style="margin:0">${isWork(G.today)?'Everyone is away. Rest up.':'It\'s not a scheduled working day. You can still log anything genuine, it all counts towards your lifetime totals.'}</p>`}
   </div>
   ${W&&W.hp?`<div class="card"><div class="row between"><div><small>Weekly boss</small><h3>${esc(W.boss.name)}</h3></div><b class="num">${fmtN(W.dmg)} / ${fmtN(W.hp)}</b></div>${bar(W.dmg,W.hp,'team')}<small>${W.done?'Defeated! +400 XP and +120 ${CN} to everyone who helped.':`Phases at 66% and 33%. ${fmtN(Math.max(0,W.hp-W.dmg))} DMs to go this week.`}</small></div>`:''}
   <div class="grid3">${['r','v','m','c'].map(k=>`<div class="stat"><b class="num">${P.reduce((a,p)=>a+D.p[p][k],0)}</b><small>${KINDS[k].short}s today</small></div>`).join('')}</div>
   ${act.length?`<div class="card flat" style="border-color:var(--bad)"><b>Active forfeits</b><div class="list" style="margin-top:6px">${act.map(f=>`<div class="li"><span class="grow">${pname(f.p)}: ${esc(f.text)}</span></div>`).join('')}</div></div>`:''}
   ${mer?`<a class="card" href="#shop" style="text-decoration:none;color:inherit;display:block"><b style="font-family:var(--display)">Pell's barge is in the harbour</b><br><small>Three rare items today only. Tap to browse.</small></a>`:''}
   ${yd?`<a class="card" href="#herald" style="text-decoration:none;color:inherit;display:block"><small>The Harbour Herald \u00b7 ${shortDate(yd)}</small><div style="font:700 15px Georgia,serif">${esc(herald(yd).head)}</div></a>`:''}
  </div>`;
};
SCREENS.lockin=()=>{
  const pl=S.players[S.me]||{};const lk=pl.lock;const me=G.players[S.me];
  let main;
  if(lk&&lk.s){const el=lockElapsed(lk);const dms=myDmSince(S.me,lk.s);const mins=el/60000;
    main=`<canvas id="scene" class="scene" width="960" height="540" aria-label="Your voyage"></canvas>
    <div class="pad"><div class="card"><div class="timer" id="lockTimer">${clockStr(lk.dur-el)}</div><p class="muted" style="text-align:center;margin:4px 0 10px">${lk.pausedAt?'Paused':'Locked in. Log every DM with the big button.'}</p>
    <div class="grid3"><div class="stat"><b class="num">${dms}</b><small>DMs this session</small></div><div class="stat"><b class="num" id="lockPace">${mins>0.5?Math.round(dms/mins*60):'\u2014'}</b><small>pace per hour</small></div><div class="stat"><b class="num">${me.m.bestSession}</b><small>session record</small></div><div class="stat"><b class="num">${G.days[G.today].team}/${G.days[G.today].target||'\u2014'}</b><small>team today</small></div></div>
    ${bar(el,lk.dur)}
    <div class="row" style="margin-top:12px;justify-content:center">${lk.pausedAt?`<button class="btn primary" data-act="lockResume">Resume</button>`:`<button class="btn" data-act="lockPause">Pause</button>`}<button class="btn ghost" data-act="lockFinish">Finish now</button><button class="btn ghost" data-act="lockCancel">Cancel</button></div></div></div>`;}
  else{main=`<div class="pad"><div class="card"><h2>Lock In</h2><p class="muted" style="margin:4px 0 10px">Pick a session, set sail and log DMs. Your boat travels one nautical mile per DM.</p>
    <div class="seg">${[[15,'Sprint 15'],[25,'Pomodoro 25'],[45,'Focus 45'],[60,'Marathon 60']].map(([m,l])=>`<button class="${S.view.lockDur===m?'on':''}" data-act="lockDur" data-m="${m}">${l}</button>`).join('')}</div>
    <div class="row" style="margin-top:10px"><label class="f" for="lockCustom">Custom minutes<input id="lockCustom" type="number" min="5" max="180" placeholder="e.g. 35" style="width:110px"></label><button class="btn primary" data-act="lockStart" style="margin-left:auto;align-self:end">Set sail</button></div></div>
    <div class="grid3"><div class="stat"><b class="num">${me.m.sessions}</b><small>sessions</small></div><div class="stat"><b class="num">${fmtN(me.m.lockMin)}</b><small>minutes locked in</small></div><div class="stat"><b class="num">${me.m.bestSession}</b><small>best session DMs</small></div></div>
    ${me.sessions.length?`<div class="card"><h3>Recent voyages</h3><div class="list" style="margin-top:6px">${[...me.sessions].sort((a,b)=>b.s-a.s).slice(0,5).map(s=>`<div class="li"><span class="grow">${shortDate(s.date)} \u00b7 ${Math.round(s.dur/60000)} min</span><b>${s.dms} DMs</b></div>`).join('')}</div></div>`:''}</div>`;}
  return main+`<div class="pad">${challengesHtml()}</div>`;
};
function challengesHtml(){
  const live=G.chals.filter(c=>['pending','countdown','live'].includes(c.state));const recent=G.chals.filter(c=>c.state==='done').slice(0,4);
  const D=G.days[G.today];const remaining=Math.max(0,D.target-D.team);
  const types=[['showdown','The 15-Minute Showdown','Head-to-head. Most DMs in 15 minutes wins.',15,0],['rivalry','The Rivalry','A 30-minute duel. Winner takes the bragging rights.',30,0],['sprint','The Century Sprint','Co-op: 40 team DMs in 30 minutes.',30,40],['lastpush','The Last Push',`Co-op: finish today's remaining ${remaining} DMs in 45 minutes.`,45,remaining],['bossrush','Boss Rush','Co-op: beat three mini-monsters (10, 15, 20 HP) in 30 minutes.',30,45],['race','Treasure Race','First captain to 25 DMs wins (30 minutes max).',30,25],['raid','Kraken Raid','Co-op: sink a 60 HP kraken together in 45 minutes.',45,60]];
  return `<div class="card"><h3>Multiplayer challenges</h3>
  ${live.map(ch=>{const c=ch.c;const t=types.find(x=>x[0]===c.type)||types[0];const mineToAccept=ch.state==='pending'&&!c.acc?.[S.me];
    return `<div class="li" style="display:grid;gap:6px;margin-top:8px"><div class="row between"><b>${esc(t[1])}</b><span class="pill">${ch.state==='pending'?'waiting for '+(mineToAccept?'you':pname(other(S.me))):ch.state==='countdown'?'starts in <span class="cdn" data-t="'+ch.start+'">'+Math.ceil((ch.start-Date.now())/1000)+'s</span>':'<span class="cdn" data-t="'+ch.end+'">'+clockStr(ch.end-Date.now())+'</span> left'}</span></div>
    ${ch.state!=='pending'?(ch.coop?`<div class="row between tiny"><span>Team ${ch.team} / ${c.target}</span><span>${G.P.map(p=>`${pname(p)} ${ch.cnt[p]}`).join(' \u00b7 ')}</span></div>${bar(ch.team,c.target,'team')}`:`<div class="row between">${G.P.map(p=>`<span style="color:${pcol(p)};font:600 18px var(--display)">${pname(p)} ${ch.cnt[p]}</span>`).join('<span class="muted">vs</span>')}</div>`):''}
    <div class="row">${mineToAccept?`<button class="btn primary sm" data-act="chalAccept" data-id="${ch.id}">Accept</button><button class="btn ghost sm" data-act="chalDecline" data-id="${ch.id}">Decline</button>`:''}${ch.state==='pending'&&c.by===S.me?`<button class="btn ghost sm" data-act="chalDecline" data-id="${ch.id}">Cancel</button>`:''}</div></div>`;}).join('')}
  ${live.length?'':`<p class="muted tiny" style="margin:4px 0 8px">Start one and ${pname(other(S.me))} gets an invite on their screen. Every DM still needs its 5-second recharge.</p>
  <div class="list">${types.map(([id,n,d,m,tg])=>`<div class="li"><div class="grow"><b>${esc(n)}</b><br><small>${esc(d)}</small></div><button class="btn sm" data-act="chalCreate" data-type="${id}" data-m="${m}" data-tg="${tg}" ${id==='lastpush'&&!remaining?'disabled':''}>Challenge</button></div>`).join('')}</div>`}
  ${recent.length?`<h3 style="margin-top:12px">Recent results</h3><div class="list" style="margin-top:6px">${recent.map(ch=>{const t=types.find(x=>x[0]===ch.c.type)||types[0];const res=ch.coop?(ch.won[G.P[0]]?'Success':'Failed'):(G.P.find(p=>ch.won[p])?pname(G.P.find(p=>ch.won[p]))+' won':'Draw');return `<div class="li"><span class="grow">${esc(t[1])} \u00b7 ${G.P.map(p=>ch.cnt[p]).join('\u2013')}</span><b>${res}</b></div>`;}).join('')}</div>`:''}
  </div>`;
}
SCREENS.quests=()=>{
  const me=G.players[S.me];const q=questState(S.me);
  const row=(x,key)=>{const done=x.prog>=x.n;const claimed=me.claimed.has(key);return `<div class="li"><div class="grow"><b>${esc(x.name)}</b> <small>+${x.xp} XP \u00b7 +${x.g} ${CN}</small>${bar(x.prog,x.n)}<small class="num">${Math.min(x.prog,x.n)} / ${x.n}</small></div>${claimed?'<span class="done">Claimed</span>':`<button class="btn sm ${done?'primary':''}" ${done?'':'disabled'} data-act="claim" data-key="${key}" data-xp="${x.xp}" data-g="${x.g}">Claim</button>`}</div>`;};
  return `<div class="pad">
  <div class="card"><div class="row between"><h2>Daily quests</h2><small>${shortDate(G.today)}</small></div><div class="list" style="margin-top:8px">${q.daily.map(x=>row(x,`q_d_${G.today}_${x.id}`)).join('')}</div></div>
  <div class="card"><div class="row between"><h2>Weekly quests</h2><small>week of ${shortDate(weekStart(G.today))}</small></div><div class="list" style="margin-top:8px">${q.weekly.map(x=>row(x,`q_w_${weekStart(G.today)}_${x.id}`)).join('')}</div></div>
  <a class="card nextReward" href="#log" style="text-decoration:none;color:inherit"><span class="appIco sm" style="background:#C9654A"><svg viewBox="0 0 24 24"><path d="M5 3h11l3 3v15H5zm3 5v2h8V8zm0 4v2h8v-2zm0 4v2h5v-2z"/></svg></span><div><b>Captain's Log</b><br><small>Free cosmetics and doubloons every level</small></div><span class="chev">\u203a</span></a>
  <div class="card"><h2>Long voyages</h2><div class="list" style="margin-top:8px">${q.long.map(x=>row(x,`q_l_${x.id}`)).join('')}</div></div>
  <div class="card"><div class="row between"><h2>Funnal Cove projects</h2><small>${G.built}/${PROJECTS.length} built</small></div><p class="muted tiny" style="margin:4px 0 8px">Projects need team lifetime DMs plus doubloons from either of you. They appear in the harbour when complete.</p>
   <div class="list">${G.proj.map(p=>`<div class="li" style="${p.built||p.open?'':'opacity:.5'}"><div class="grow"><b>${esc(p.name)}</b> ${p.built?'<span class="done">\u00b7 built</span>':''}<br><small>${esc(p.blurb)}</small>
    ${p.built?'':`<div class="tiny" style="margin-top:4px">Team DMs ${fmtN(Math.min(G.teamDm,p.dm))} / ${fmtN(p.dm)}</div>${bar(G.teamDm,p.dm,'team')}<div class="tiny" style="margin-top:4px">Funding ${fmtN(p.funded)} / ${fmtN(p.g)} ${CN} \u00b7 ${G.P.map(x=>`${pname(x)} ${fmtN(p.by[x])}`).join(' \u00b7 ')}</div>${bar(p.funded,p.g)}`}</div>
    ${p.open&&!p.gOk?`<div style="display:grid;gap:4px">${[50,250,1000].map(a=>`<button class="btn sm" data-act="fund" data-id="${p.id}" data-a="${a}" ${me.balance<Math.min(a,p.g-p.funded)?'disabled':''}>+${a}</button>`).join('')}</div>`:''}</div>`).join('')}</div></div>
  </div>`;
};
function questState(p){
  const me=G.players[p];const D=G.days[G.today];const ws=weekStart(G.today);const W=G.weeks[ws];
  const todaySes=me.sessions.filter(s=>s.date===G.today);
  const wDays=Object.values(G.days).filter(d=>d.date>=ws&&d.date<=G.today);
  const v={dDm:D.p[p].d,dSes:todaySes.length,dResp:D.p[p].r,dBoss:D.hit&&D.p[p].d>0?1:0,dEarly:D.p[p].b10,dShare:D.target?Math.round(D.p[p].d/D.target*100):0,dBestSes:Math.max(0,...todaySes.map(s=>s.dms||0)),
    wDm:wDays.reduce((a,d)=>a+d.p[p].d,0),wSes:me.sessions.filter(s=>s.date>=ws).length,wBoss:wDays.filter(d=>d.hit&&d.p[p].d>0).length,wWeekly:W&&W.done?1:0,wChal:G.chals.filter(c=>c.state==='done'&&c.start>=londonTs(ws,0)&&c.players.includes(p)).length,wResp:wDays.reduce((a,d)=>a+d.p[p].r,0),
    ...me.m};
  const pickN=(pool,seed,n)=>[...pool].sort((a,b)=>h32(seed+a.id)-h32(seed+b.id)).slice(0,n);
  const map=x=>({...x,prog:v[x.m]||0});
  return{daily:pickN(DAILY_QUESTS,G.today+p,3).map(map),weekly:pickN(WEEKLY_QUESTS,ws+p,3).map(map),long:LONG_QUESTS.map(map)};
}
const APP_ICONS={pets:['#E0457B','M8.5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM4 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm16 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM12 11c3 0 6 4 6 7a3 3 0 0 1-3 3c-1.2 0-2-.6-3-.6s-1.8.6-3 .6a3 3 0 0 1-3-3c0-3 3-7 6-7z'],help:['#486790','M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 14a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6zm.2-10C10 6 8.6 7.3 8.6 9h2.2c0-.6.5-1.1 1.3-1.1s1.3.5 1.3 1.1c0 1.3-2.4 1.3-2.4 3.8v.5h2.2v-.3c0-1.7 2.5-1.9 2.5-4.1C15.7 7.2 14.3 6 12.2 6z'],log:['#C9654A','M5 3h11l3 3v15H5zm3 5v2h8V8zm0 4v2h8v-2zm0 4v2h5v-2z'],book:['#DDA94D','M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8z'],shop:['#E06034','M6 7V6a6 6 0 0 1 12 0v1h2a1 1 0 0 1 1 1.1l-1.2 12A2 2 0 0 1 17.8 22H6.2a2 2 0 0 1-2-1.9L3 8.1A1 1 0 0 1 4 7zm2 0h8V6a4 4 0 0 0-8 0z'],rivals:['#9B7FD9','M3 7l4.5 3.5L12 4l4.5 6.5L21 7l-2 11H5zM5 20h14v2H5z'],herald:['#5DBE9C','M4 3h13a2 2 0 0 1 2 2v1h1a1 1 0 0 1 1 1v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1zm2 4v4h5V7zm7 0v2h4V7zm0 4v2h4v-2zm-7 4v2h11v-2z'],ledger:['#4A7EC2','M4 20V10h3v10zm6.5 0V4h3v16zM17 20v-7h3v7z'],settings:['#7F8A95','M10.3 2h3.4l.5 2.6 1.6.9 2.5-.9 1.7 2.9-2 1.8v1.8l2 1.8-1.7 2.9-2.5-.9-1.6.9-.5 2.6h-3.4l-.5-2.6-1.6-.9-2.5.9-1.7-2.9 2-1.8v-1.8l-2-1.8 1.7-2.9 2.5.9 1.6-.9zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z']};
SCREENS.more=()=>`<div class="pad"><div class="phone"><div class="row between" style="margin-bottom:10px"><h2>Funnal Cove</h2><small>${esc(niceDate(G.today))}</small></div><div class="appGrid">
  ${[['log','Captain\'s Log',`Level ${G.players[S.me].li.level} rewards`],['pets','Pets',`${Object.keys(G.players[S.me].pets).length} of ${PETS.length}`],['help','How to play','Everything explained'],['book','Achievements',`${Object.keys(G.players[S.me].unlocked).length} of ${ACHIEVEMENTS.length}`],['rivals','Rivals','Leaderboards'],['herald','Herald','Paper & forfeits'],['ledger','Ledger','Business numbers'],['settings','Settings','Days off & more']].map(([h,n,d])=>`<a href="#${h}"><span class="appIco" style="background:${APP_ICONS[h][0]}"><svg viewBox="0 0 24 24"><path d="${APP_ICONS[h][1]}"/></svg></span>${n}<small>${d}</small></a>`).join('')}
  </div></div><p class="tiny muted" style="text-align:center">All counts are self-reported taps. The game trusts you.</p></div>`;
function achCard(a,me,clickable=false){const un=me.unlocked[a.id];const secret=a.secret&&!un;const prog=me.m[a.metric]||0;const date=(S.players[me.pid]?.ach||{})[a.id];
  return `<${clickable?'button':'div'} class="ach r-${a.rar} ${un?'':'locked'} ${secret?'secret':''}" ${clickable?`data-act="achInfo" data-id="${a.id}"`:''}><div class="row" style="gap:8px;flex-wrap:nowrap"><span class="medal">${secret?'?':un?'\u2605':a.tier?a.tier[0]:'\u2022'}</span><div><span class="rtag">${a.rar}</span>${a.tier?` <span class="tier">${a.tier}</span>`:''}</div></div>
  <b>${secret?'Hidden achievement':esc(a.name)}</b><small>${secret?'Keep playing. Some secrets need unusual combinations.':esc(a.desc)}</small>
  ${!un&&!secret&&a.target>1?`<div class="bar"><i style="width:${clamp(prog/a.target*100,0,100)}%"></i></div><small class="num">${fmtN(Math.min(prog,a.target))} / ${fmtN(a.target)}</small>`:''}
  ${un?`<small>${date?'Earned '+shortDate(L(date).date):'Earned'} \u00b7 +${RARITY_GLOW[a.rar]} ${CN}</small>`:''}</${clickable?'button':'div'}>`;}
SCREENS.book=()=>{
  const pid=S.view.bookP||S.me;const me=G.players[pid];const f=S.view.book;const cats=[...new Set(ACHIEVEMENTS.map(a=>a.cat))];
  let list=ACHIEVEMENTS;if(f==='unlocked')list=list.filter(a=>me.unlocked[a.id]);else if(f==='locked')list=list.filter(a=>!me.unlocked[a.id]);else if(f!=='all')list=list.filter(a=>a.cat===f);
  const counts=RARITIES.map(r=>[r,ACHIEVEMENTS.filter(a=>a.rar===r&&me.unlocked[a.id]).length,ACHIEVEMENTS.filter(a=>a.rar===r).length]);
  return `<div class="pad"><div class="row between"><h2>Achievement Book</h2><div class="seg">${G.P.map(p=>`<button class="${p===pid?'on':''}" data-act="bookP" data-p="${p}">${pname(p)}</button>`).join('')}</div></div>
  <div class="row" style="gap:6px">${counts.map(([r,u,t])=>`<span class="pill r-${r}" style="border-color:var(--rc)"><span class="rtag">${r}</span> ${u}/${t}</span>`).join('')}</div>
  <label class="f" for="bookFilter">Show<select id="bookFilter" data-act="bookFilter"><option value="all">All ${ACHIEVEMENTS.length}</option><option value="unlocked">Unlocked</option><option value="locked">Locked</option>${cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select></label>
  <div class="achGrid">${list.map(a=>achCard(a,me,true)).join('')}</div></div>`;
};
function periodRange(per){const t=G.today;if(per==='day')return[t,t];if(per==='week')return[weekStart(t),t];if(per==='month')return[t.slice(0,8)+'01',t];return['0000',t];}
function sumRange(p,a,b){const o={d:0,r:0,v:0,m:0,c:0};for(const d in G.days)if(d>=a&&d<=b)for(const k in o)o[k]+=G.days[d].p[p][k];return o;}
SCREENS.rivals=()=>{
  const per=S.view.lb;const[a,b]=periodRange(per);const P=G.P;const rows=P.map(p=>({p,...sumRange(p,a,b)}));
  const lead=[...rows].sort((x,y)=>y.d-x.d);const aw=awards(weekStart(G.today));
  const rec=P.map(p=>{const m=G.players[p].m;return{p,best:m.bestDay,streak:G.players[p].bestStreak,ses:m.bestSession,fb:m.finalBlows,ot:m.overtakes,ach:Object.keys(G.players[p].unlocked).length,cw:m.chalWon};});
  return `<div class="pad"><h2>Rivals</h2><div class="seg">${[['day','Today'],['week','Week'],['month','Month'],['life','Lifetime']].map(([k,n])=>`<button class="${per===k?'on':''}" data-act="lb" data-k="${k}">${n}</button>`).join('')}</div>
  <div class="card"><table class="lb"><thead><tr><th>Keeper</th><th>DMs</th><th>Resp.</th><th>Video</th><th>Meet</th><th>Client</th></tr></thead><tbody>${lead.map((r,i)=>`<tr><td style="color:${pcol(r.p)}">${i===0&&r.d>0&&r.d!==lead[1]?.d?'<span class="crown">\u265b</span> ':''}${pname(r.p)}</td><td>${fmtN(r.d)}</td><td>${r.r}</td><td>${r.v}</td><td>${r.m}</td><td>${r.c}</td></tr>`).join('')}</tbody></table></div>
  <div class="card"><h3>Personal records</h3><table class="lb" style="margin-top:6px"><thead><tr><th></th>${P.map(p=>`<th style="color:${pcol(p)}">${pname(p)}</th>`).join('')}</tr></thead><tbody>
  ${[['Best day (DMs)','best'],['Best streak','streak'],['Best Lock In session','ses'],['Final blows','fb'],['Overtakes','ot'],['Challenges won','cw'],['Achievements','ach']].map(([n,k])=>`<tr><td>${n}</td>${rec.map(r=>`<td>${fmtN(r[k])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  <div class="card"><div class="row between"><h3>Friday Awards Ceremony</h3><small>week of ${shortDate(weekStart(G.today))}${wd(G.today)===5?' \u00b7 LIVE TODAY':''}</small></div>
   ${podium(aw)}
   <div class="list" style="margin-top:8px">${aw.map(x=>`<div class="li"><div class="grow"><b>${esc(x.name)}</b><br><small>${esc(x.rule)}</small></div><b style="color:${x.win?pcol(x.win):'var(--muted)'}">${x.win?pname(x.win):x.tie?'Shared':'Nobody yet'}</b></div>`).join('')}</div></div></div>`;
};
function awards(ws){const P=G.P;const we=addDays(ws,6);const prev=addDays(ws,-7);
  const v=p=>{const s=sumRange(p,ws,we),ps=sumRange(p,prev,addDays(prev,6));let steady=0,team=0;for(const d in G.days){if(d<ws||d>we)continue;const D=G.days[d];if(D.p[p].d>=30)steady++;if(D.hit&&D.p[p].d>0)team++;if(D.blow===p)team++;}
    return{wDm:s.d,wResp:s.r,wVid:s.v,wMeet:s.m,wClient:s.c,wImprove:ps.d>=20?Math.round((s.d-ps.d)/ps.d*100):-1e9,wComeback:comebacksIn(p,ws,we),wSteady:steady,wTeam:team};};
  const vals=Object.fromEntries(P.map(p=>[p,v(p)]));
  return AWARDS.map(a=>{const sc=P.map(p=>[p,vals[p][a.m]]);const max=Math.max(...sc.map(x=>x[1]));if(max<=0||max===-1e9)return{...a};const w=sc.filter(x=>x[1]===max);return w.length>1?{...a,tie:true}:{...a,win:w[0][0]};});}
function comebacksIn(p,a,b){let n=0;for(const d in G.days){if(d<a||d>b||d>=G.today)continue;const D=G.days[d];let r={},min=0;G.P.forEach(x=>r[x]=0);for(const e of D.seq){r[e.pid]++;min=Math.min(min,r[p]-r[other(p)]);}if(min<=-15&&D.p[p].d>D.p[other(p)].d)n++;}return n;}
function podium(aw){const P=G.P;const wins=P.map(p=>[p,aw.filter(a=>a.win===p).length]).sort((a,b)=>b[1]-a[1]);
  return `<div class="podium" aria-label="Awards won this week">${wins.map(([p,n],i)=>`<div style="height:${i===0?130:90}px;background:${i===0?'linear-gradient(#F2CF7A,#DDA94D)':'#EFE6D0'};color:${i===0?'#fff':'var(--ink)'}"><span style="font-size:22px">${i===0&&n>wins[1]?.[1]?'\u265b':''}</span><b>${pname(p)}</b><span>${n} award${n===1?'':'s'}</span></div>`).join('')}</div>`;}
function herald(date){
  const D=G.days[date]||{p:Object.fromEntries(G.P.map(p=>[p,{d:0,r:0,v:0,m:0,c:0}])),team:0,target:targetFor(date),boss:bossFor(date)};const P=G.P;
  const sorted=[...P].sort((a,b)=>D.p[b].d-D.p[a].d);const top=sorted[0],bottom=sorted[1];const clients=P.reduce((a,p)=>a+D.p[p].c,0);
  const zero=P.find(p=>D.p[p].d===0&&!absent(p,date));const vars={top:(C().players[top]?.name||'').toUpperCase(),bottom:(C().players[bottom]?.name||'').toUpperCase(),topn:D.p[top].d,team:D.team,short:Math.max(0,D.target-D.team),zero:(C().players[zero]?.name||'').toUpperCase()};
  const hit=D.target>0&&D.team>=D.target;const cat=clients?'client':zero?'zero':D.team>=150?'stretch':hit?'win':D.target>0?'miss':'win';
  const head=fill(pick(HEADLINES[cat],date),vars);
  const achs=P.flatMap(p=>Object.entries(S.players[p]?.ach||{}).filter(([id,ts])=>L(ts).date===date&&ACH_BY_ID[id]).map(([id])=>({p,a:ACH_BY_ID[id]})));
  return{date,D,head,hit,achs,top,bottom,clients};
}
SCREENS.herald=()=>{
  const yd=G.workdays.filter(d=>d<G.today).pop()||G.today;const h=herald(yd);const D=h.D;const P=G.P;
  const pend=pendingForfeits(S.me);const all=Object.values(S.forfeits).filter(Boolean).sort((a,b)=>b.ts-a.ts);
  const wall=all.filter(f=>f.result==='wall'&&f.status==='spun'&&Date.now()-f.ts<7*86400000);
  const owed=all.filter(f=>f.kind==='real'&&f.status==='spun');
  const quote=P.map(p=>activeForfeitsFor(p).find(f=>f.result==='headline')).find(Boolean);
  return `<div class="pad"><article class="paper"><div class="mast"><small style="color:#5a4a30">Est. the day the first cannon fired \u00b7 Price: one DM</small><h1>THE SALTY HERALD</h1><small style="color:#5a4a30">${esc(niceDate(yd))}</small></div>
   <div class="head">${esc(quote?`${(C().players[quote.pid]?.name||'').toUpperCase()} FAILS. NATION IN SHOCK. MORE AT 11.`:h.head)}</div>
   <div class="cols"><div><h3>The numbers</h3>${P.map(p=>`${pname(p)}: <b>${D.p[p].d}</b> DMs, ${D.p[p].r} replies, ${D.p[p].v} video, ${D.p[p].m} meetings, ${D.p[p].c} clients`).join('<br>')}<br>Team: <b>${D.team}</b>${D.target?' of '+D.target:''}</div>
   <div><h3>Weather report</h3>${D.target?`${esc(D.boss.name)} ${h.hit?`was defeated${D.blow?`, final blow by ${pname(D.blow)}`:''}${D.hitMin!=null?` at ${String(Math.floor(D.hitMin/60)).padStart(2,'0')}:${String(D.hitMin%60).padStart(2,'0')}`:''}.`:`survived with ${D.target-D.team} HP and is reportedly "quite smug".`}`:'No fog. A day off.'}</div>
   <div><h3>Leaderboard</h3>${D.p[h.top].d===D.p[h.bottom]?.d?'Dead heat. Both keepers refuse to comment.':`${pname(h.top)} won the day by ${D.p[h.top].d-D.p[h.bottom].d}.`} ${pick(['Sources close to the loser cite "a dodgy wifi signal".','The gulls were unavailable for comment.','A rematch has been demanded.','The bakery has named a bun after the winner.'],yd)}</div>
   <div><h3>Achievements</h3>${h.achs.length?h.achs.slice(0,6).map(x=>`${pname(x.p)}: <i>${esc(x.a.name)}</i>`).join('<br>'):'A quiet day in the trophy cabinet.'}</div>
   <div><h3>Outstanding forfeits</h3>${owed.length?owed.slice(0,5).map(f=>`${pname(f.pid)}: ${esc(f.text)}`).join('<br>'):'All debts settled. Suspicious.'}</div></div></article>
  <div class="card"><h3>Your forfeits</h3>${pend.length?`<div class="list" style="margin-top:8px">${pend.map(f=>`<div class="li"><div class="grow"><b>${f.type==='team'?'Team failure':'Individual failure'}</b><br><small>${esc(f.why)}</small></div><button class="btn sm primary" data-act="wheel" data-d="${f.date}" data-t="${f.type}">Spin</button>${G.players[S.me].shields>0?`<button class="btn sm" data-act="shield" data-d="${f.date}" data-t="${f.type}">Shield</button>`:''}</div>`).join('')}</div>`:'<p class="muted" style="margin:6px 0 0">Nothing owed. Your conscience is spotless.</p>'}
   ${all.filter(f=>f.pid===S.me&&f.status==='spun'&&Date.now()-f.ts<86400000).map(f=>{const n=myDmSince(S.me,f.ts);return `<div class="li" style="margin-top:6px"><div class="grow"><b>Active:</b> ${esc(f.text)}<br><small>Redemption quest: send 30 DMs to lift it early (${Math.min(n,30)}/30)</small>${bar(n,30)}</div><button class="btn sm" data-act="redeem" data-id="${esc(f.id)}" ${n>=30?'':'disabled'}>Redeem</button>${f.kind==='real'?`<button class="btn sm ghost" data-act="paid" data-id="${esc(f.id)}">Paid it</button>`:''}</div>`;}).join('')}
   <p class="tiny muted" style="margin:8px 0 0">Forfeits are temporary and harmless: they never remove achievements, items or doubloons. Approved holidays, sick days and days off never trigger one. Missed days older than two weeks are quietly forgiven.</p></div>
  ${wall.length?`<div class="card"><h3>Wall of Shame</h3><div class="row" style="margin-top:8px">${wall.map(f=>`<div style="text-align:center"><img src="${avatarCanvas(f.pid)}" alt="" style="width:60px;height:60px;border-radius:50%;box-shadow:0 0 0 4px #C9654A"><br><small>${pname(f.pid)} \u00b7 ${shortDate(f.date)}</small></div>`).join('')}</div></div>`:''}
  </div>`;
};
SCREENS.settings=()=>{
  const cfg=C();const admin=S.isOwner;const P=cfg.playerIds;const ff=approvedForfeits(cfg);
  const abs=Object.entries(cfg.absences||{}).sort().reverse().slice(0,20);
  return `<div class="pad"><h2>Settings</h2>
  <div class="card"><h3>You</h3><p class="tiny muted" style="margin:4px 0 8px">${S.mode==='local'?`Signed in as <b>${pname(S.me)}</b>. This copy saves in this browser only (no live sync between captains).`:S.mode==='supa'?`Signed in as <b>${pname(S.me)}</b> (${esc(HL_EMAIL[S.me]||'')}). Progress syncs live between both captains.`:`Signed in as <b>${pname(S.me)}</b>. Progress syncs live between both captains.`}</p>
   <div class="row"><label class="row tiny" for="sndT"><input id="sndT" type="checkbox" data-act="sound" ${S.sound?'checked':''}> Sound effects</label><button class="btn sm ghost" data-act="logout">Lock the treasure chest on this device</button></div></div>
  <div class="card"><h3>Your captain handle</h3>${S.players[S.me]?.handle?`<p style="margin:6px 0 0">You sail as <b>${esc(S.players[S.me].handle)}</b>. Handles are claimed once and can't be changed.</p>`:`<p class="tiny muted" style="margin:4px 0 8px">Pick the name shown across the game. You can claim it once, and both captains may pick the same name.</p><div class="row"><input id="handleIn" maxlength="20" placeholder="e.g. Salty Sam" style="flex:1"><button class="btn primary" data-act="claimHandle">Claim</button></div>`}</div>
  <div class="card"><h3>Daily mission ${admin?'':'<small>(the game owner can change these)</small>'}</h3>
   <div class="grid2" style="margin-top:8px">
    <label class="f" for="cfgTarget">Team target per working day<input id="cfgTarget" type="number" min="1" value="${cfg.target}" ${admin?'':'disabled'}></label>
    <label class="f" for="cfgCd">DM cooldown (seconds)<input id="cfgCd" type="number" min="1" max="120" value="${cfg.cooldownSec}" ${admin?'':'disabled'}></label>
    <label class="f" for="cfgStart">Day starts<input id="cfgStart" type="time" value="${cfg.dayStart}" ${admin?'':'disabled'}></label>
    <label class="f" for="cfgEnd">Day ends<input id="cfgEnd" type="time" value="${cfg.dayEnd}" ${admin?'':'disabled'}></label>
    <label class="f" for="cfgWarn">Final warning<input id="cfgWarn" type="time" value="${cfg.finalWarning}" ${admin?'':'disabled'}></label>
    <label class="f" for="cfgScale">Target when one keeper is away (%)<input id="cfgScale" type="number" min="10" max="100" value="${Math.round(cfg.absenceScale*100)}" ${admin?'':'disabled'}></label>
    <label class="f" for="cfgPen">Count forfeits from<input id="cfgPen" type="date" value="${cfg.startDate||''}" ${admin?'':'disabled'}></label>
   </div>
   <div class="row" style="margin-top:8px">${[1,2,3,4,5,6,0].map(d=>`<label class="pill" for="wd${d}"><input id="wd${d}" type="checkbox" class="wdBox" value="${d}" ${cfg.workdays.includes(d)?'checked':''} ${admin?'':'disabled'}>${DAYN[d]}</label>`).join('')}</div>
   <h3 style="margin-top:14px">Logging safeguards</h3><p class="tiny muted" style="margin:4px 0 8px">Daily caps and minimum gaps per button, per captain. Meetings and clients need a prospect name, a press-and-hold, and (if switched on) the other captain's confirmation before rewards are paid.</p>
   <div class="grid2">${['r','v','m','c'].map(k=>`<label class="f" for="cap_${k}">${KINDS[k].short}s: max per day<input id="cap_${k}" type="number" min="1" max="500" value="${cfg.caps[k]}" ${admin?'':'disabled'}></label><label class="f" for="cd_${k}">${KINDS[k].short}s: seconds between logs<input id="cd_${k}" type="number" min="1" max="600" value="${cfg.cooldowns[k]}" ${admin?'':'disabled'}></label>`).join('')}</div>
   <label class="f" for="sightMode" style="margin-top:8px">Pet sightings<select id="sightMode" ${admin?'':'disabled'}><option value="auto" ${cfg.sightingMode!=='email'?'selected':''}>Game picks a surprise time each working day</option><option value="email" ${cfg.sightingMode==='email'?'selected':''}>Started by the scheduled email reminder</option></select></label>
   <label class="row tiny" for="reqConf" style="margin-top:8px"><input id="reqConf" type="checkbox" ${cfg.requireConfirm?'checked':''} ${admin?'':'disabled'}> Crewmate must confirm meetings and clients</label>
   ${admin?`<button class="btn primary" style="margin-top:10px" data-act="saveCfg">Save mission settings</button>`:''}
   <p class="tiny muted">Times use UK time (Europe/London) and follow British Summer Time automatically.</p></div>
  <div class="card"><h3>Days off</h3><p class="tiny muted" style="margin:4px 0 8px">Holidays, sickness and planned absences never trigger forfeits or break streaks. When one keeper is away the team target scales down.</p>
   <div class="row"><label class="f" for="absDate">Date<input id="absDate" type="date" value="${G.today}"></label><label class="f" for="absWho">Who<select id="absWho"><option value="__all">Whole team (holiday)</option>${P.map(p=>`<option value="${p}" ${p===S.me?'selected':''}>${pname(p)}</option>`).join('')}</select></label><label class="f" for="absType">Type<select id="absType"><option>holiday</option><option>sick</option><option>planned</option></select></label><button class="btn" data-act="addAbs" style="align-self:end">Add</button></div>
   <div class="list" style="margin-top:8px">${(cfg.holidays||[]).slice().sort().reverse().slice(0,10).map(d=>`<div class="li"><span class="grow">${shortDate(d)} \u00b7 whole team</span><button class="btn sm ghost" data-act="rmHol" data-d="${d}">Remove</button></div>`).join('')}${abs.map(([k,v])=>{const[d,p]=k.split('_');return `<div class="li"><span class="grow">${shortDate(d)} \u00b7 ${pname(p)} \u00b7 ${esc(v)}</span><button class="btn sm ghost" data-act="rmAbs" data-k="${k}">Remove</button></div>`;}).join('')}</div></div>
  <div class="card"><h3>Forfeit wheel</h3><p class="tiny muted" style="margin:4px 0 8px">A forfeit only goes on the wheel when both keepers approve it. Tick the ones you agree to.</p>
   <div class="list">${ff.map(f=>`<div class="li"><div class="grow">${esc(f.text)} <span class="pill">${f.kind==='real'?'real life':'in game'}</span><br><small>${P.map(p=>`${pname(p)} ${f.by[p]?'\u2713':'\u2717'}`).join(' \u00b7 ')}</small></div><label class="pill" for="ap_${f.id}"><input id="ap_${f.id}" type="checkbox" data-act="approve" data-id="${f.id}" ${f.by[S.me]?'checked':''}> I approve</label></div>`).join('')}</div>
   <div class="row" style="margin-top:8px"><label class="f" for="newFf" style="flex:1">Add your own forfeit<input id="newFf" maxlength="90" placeholder="e.g. Wear a party hat on the next call"></label><select id="newFfKind" aria-label="Forfeit type"><option value="real">Real life</option><option value="virtual">In game</option></select><button class="btn" data-act="addFf" style="align-self:end">Add</button></div></div>
  <div class="card"><h3>Reminders</h3><p class="tiny muted" style="margin:4px 0 0">While the game is open, Gary the gull nags you on the Harbour screen and pops up at the final warning time. Reminders that arrive when the game is closed (email, scheduled summaries, the Friday recap) need a scheduler outside this page. Ask Claude to set up a scheduled email reminder and it can read this game's live numbers each morning, at the final warning and on Fridays.</p></div>
  ${S.mode!=='local'&&admin?`<div class="card"><h3>Keeper accounts</h3><div class="list" style="margin-top:8px">${P.map(p=>`<div class="li"><span class="grow">${pname(p)}: ${S.players[p]?.uid?'claimed':'not claimed yet'}</span>${S.players[p]?.uid?`<button class="btn sm ghost" data-act="release" data-p="${p}">Release</button>`:''}</div>`).join('')}</div><p class="tiny muted">Releasing lets someone else claim that keeper. Progress stays.</p></div>`:''}
  <p class="tiny muted">Hundred Lanterns \u00b7 built for Funnal. Rewards are worked out from the activity log, so they can't be awarded twice. Every number here is self-reported.</p></div>`;
};

/* ============================== REMINDERS ============================== */
function reminder(){
  if(!G||!S.me)return null;const D=G.days[G.today];if(!D.target)return null;const P=G.P;const cfg=G.cfg;const min=G.T.min;
  const[a,b]=[...P].sort((x,y)=>D.p[y].d-D.p[x].d);const left=Math.max(0,D.target-D.team);const mins=hm(cfg.dayEnd)-min;
  const v={leader:C().players[a]?.name,lagger:C().players[b]?.name,lead:D.p[a].d,gap:D.p[a].d-D.p[b].d,left,mins};
  const yd=G.workdays.filter(d=>d<G.today).pop();let cat='steady';
  const gt=goldenFor(G.today);const sgs=sightingState(S.me,sightingFor(G.today));
  if(isWork(G.today)&&min>=gt.start&&min<gt.end)cat='golden';else if(sgs&&sgs.phase==='live'&&!sgs.ok){cat='pet';v.rar=sgs.rar;v.need=sgs.need;}else if(D.hit)cat='won';else if(D.team===0&&min>=hm(cfg.dayStart)+30)cat='nobody';else if(mins<=60&&mins>0)cat='deadline';else if(left<=15)cat='close';
  else if(D.over.length&&Date.now()-D.over[D.over.length-1].t<20*60000){cat='overtaken';v.leader=C().players[D.over[D.over.length-1].who]?.name;v.lagger=C().players[other(D.over[D.over.length-1].who)]?.name;}
  else if(D.p[b].d===0&&D.p[a].d>=10&&!absent(b,G.today))cat='lagger';else if(v.gap>=15)cat='ahead';else if(yd&&G.days[yd]&&G.days[yd].target&&!G.days[yd].hit&&min<720)cat='missed';
  const list=REMINDERS[cat];return fill(list[(h32(G.today+cat)+S.reminderIdx)%list.length],v);
}

/* ============================== FX ============================== */
let AC=null;
function tone(f,d=.08,type='square',vol=.05,when=0){if(!S.sound)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.value=vol;o.connect(g);g.connect(AC.destination);const t=AC.currentTime+when;o.start(t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.stop(t+d+.02);}catch(e){}}
const SFX={d:()=>{tone(660,.06);tone(990,.08,'square',.04,.05);},r:()=>{[523,659,784].forEach((f,i)=>tone(f,.1,'triangle',.06,i*.07));},v:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,.12,'triangle',.06,i*.07));},m:()=>{[392,523,659,784,1046].forEach((f,i)=>tone(f,.14,'triangle',.07,i*.08));},c:()=>{[523,659,784,1046,784,1046,1318].forEach((f,i)=>tone(f,.18,'square',.06,i*.1));},no:()=>tone(140,.15,'sawtooth',.04),lvl:()=>{[784,988,1175,1568].forEach((f,i)=>tone(f,.15,'triangle',.07,i*.09));},ach:()=>{[880,1320].forEach((f,i)=>tone(f,.15,'triangle',.06,i*.1));}};
function floatText(text,x,y,col){const el=document.createElement('div');el.className='float';el.textContent=text;el.style.left=x+'px';el.style.top=y+'px';if(col)el.style.color=col;$('#fx').appendChild(el);setTimeout(()=>el.remove(),1000);}
function coins(n,from){const to=$('#glowBox').getBoundingClientRect();const r=from.getBoundingClientRect();for(let i=0;i<n;i++){const el=document.createElement('div');el.className='coin';const sx=r.left+r.width/2+(Math.random()-.5)*40,sy=r.top+r.height/2;el.style.left=sx+'px';el.style.top=sy+'px';$('#fx').appendChild(el);
  el.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${(Math.random()-.5)*60}px,${-40-Math.random()*40}px) scale(1.2)`,offset:.35},{transform:`translate(${to.left+to.width/2-sx}px,${to.top+to.height/2-sy}px) scale(.6)`,opacity:.8}],{duration:650+i*60,easing:'ease-in'}).onfinish=()=>el.remove();}}
function toast(html,cls='',ms=3200){const el=document.createElement('div');el.className='toast '+cls;el.innerHTML=html;$('#toasts').appendChild(el);setTimeout(()=>{el.style.transition='opacity .3s';el.style.opacity=0;setTimeout(()=>el.remove(),300);},ms);while($('#toasts').children.length>4)$('#toasts').firstChild.remove();}
function banner(title,sub){const el=document.createElement('div');el.className='banner';el.innerHTML=`<h1>${esc(title)}</h1>${sub?`<p>${esc(sub)}</p>`:''}`;document.body.appendChild(el);setTimeout(()=>el.remove(),2700);}
function fireworks(ms=2600,colors=['#DDA94D','#E06034','#C91E36','#486790','#5DBE9C']){const cv=$('#fireworks');cv.style.display='block';const c=cv.getContext('2d');cv.width=innerWidth;cv.height=innerHeight;const parts=[];const t0=performance.now();let last=0;
  function burst(){const x=Math.random()*cv.width,y=cv.height*(.15+Math.random()*.4);const col=colors[Math.floor(Math.random()*colors.length)];for(let i=0;i<40;i++){const a=Math.random()*7,s=1+Math.random()*4;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,col});}}
  (function f(now){if(now-last>280&&now-t0<ms-600){burst();last=now;}c.clearRect(0,0,cv.width,cv.height);for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.life-=.012;if(p.life>0){c.fillStyle=p.col;c.globalAlpha=p.life;c.fillRect(p.x,p.y,4,4);}}c.globalAlpha=1;if(now-t0<ms)requestAnimationFrame(f);else{cv.style.display='none';c.clearRect(0,0,cv.width,cv.height);}})(t0);}
function celebrate(k,btn){const r=btn.getBoundingClientRect();const kd=KINDS[k];floatText(`+${kd.xp} XP`,r.left+r.width/2-24,r.top-6);
  if(k==='d'){coins(2,btn);if(S.me)launchLantern(S.me);}
  else if(k==='r'){coins(5,btn);toast('<b>A reply!</b> A real human wants to talk to you. Stay calm. Be normal.');}
  else if(k==='v'){coins(8,btn);banner('VIDEO WANTED','The projector warms up');}
  else if(k==='m'){coins(12,btn);banner('MEETING WANTED','Set the good biscuits out');fireworks(1600);}
  else if(k==='c'){coins(20,btn);banner('NEW CLIENT!','Lantern Bay declares a public holiday');fireworks(3200);}
  (SFX[k]||SFX.d)();try{navigator.vibrate&&navigator.vibrate(k==='c'?[60,40,120]:15)}catch(e){}}

/* ============================== ACTIONS ============================== */
async function logAction(k,btn){
  if(!S.me)return askWho();if(S.readOnly)return toast('<b>View only.</b> Ask the owner to share this game with you as a Contributor or Editor.','joke',5000);
  if(k==='m'||k==='c')return openMCSheet(k);
  const now=Date.now(),cfg=C();
  if(k==='d'){if(now<S.cdUntil){btn.classList.remove('shake');void btn.offsetWidth;btn.classList.add('shake');SFX.no();toast(`<b>${esc(pick(JOKES,now))}</b> <small>${Math.ceil((S.cdUntil-now)/1000)}s to reload</small>`,'joke',1800);return;}S.cdStart=now;S.cdUntil=now+cfg.cooldownSec*1000;S.quip=DM_QUIPS[Math.floor(Math.random()*DM_QUIPS.length)];}
  else{const today=L(now).date;const n=G.days[today]?G.days[today].p[S.me][k]:0;if(n>=(cfg.caps[k]||99)){toast(`<b>Daily limit reached.</b> ${cfg.caps[k]} ${KINDS[k].short.toLowerCase()}s a day is the cap. Save some for tomorrow, legend.`,'joke',3000);return;}
    if(now<(S.btnLock[k]||0)){toast(`<b>${esc(pick(JOKES,now))}</b> <small>${Math.ceil((S.btnLock[k]-now)/1000)}s</small>`,'joke',1500);return;}S.btnLock[k]=now+(cfg.cooldowns[k]||3)*1000;btn.classList.add('busy');setTimeout(()=>btn.classList.remove('busy'),(cfg.cooldowns[k]||3)*1000);}
  const id=uid();const date=L(now).date;S.pending[id]={id,pid:S.me,date,k,t:now};celebrate(k,btn);refresh();
  try{
    const lease=await S.db.doc(`cool/${S.me}_${k}`).acquire({holder:id,ttlMs:k==='d'?cfg.cooldownSec*1000:clamp((cfg.cooldowns[k]||3)*1000,1000,600000)});
    if(!lease.acquired){delete S.pending[id];const exp=Date.parse(lease.expiresAt)||now+5000;if(k==='d'){S.cdStart=exp-cfg.cooldownSec*1000;S.cdUntil=exp;}toast('<b>Nice try. The button remembers.</b> <small>Another tab or device just logged one.</small>','joke',2600);refresh();return;}
    await writeDay(S.me,date,{ev:{[id]:{k,t:now}}});
  }catch(e){delete S.pending[id];refresh();writeFail(e);}
}
async function undo(){
  if(!S.me||!G)return;const cfg=C();const mine=[...G.evs,...G.pendingConf].filter(e=>e.pid===S.me&&Date.now()-e.t<cfg.undoMinutes*60000).sort((a,b)=>b.t-a.t);const e=mine[0];
  if(!e)return toast(`<b>Nothing to undo.</b> Your record is spotless. Suspiciously spotless. <small>You can undo your own logs from the last ${cfg.undoMinutes} minutes.</small>`,'',2500);
  if(S.pending[e.id])return toast('<b>Still saving that one.</b> Try again in a second.','',1500);
  try{await writeDay(S.me,e.date,{ev:{[e.id]:{u:1}}});toast(`<b>Undone:</b> one ${esc(KINDS[e.k].name)}. We'll pretend that never happened.`,'',2200);}catch(err){writeFail(err);}
}
const ACT={
  nextReminder(){S.reminderIdx++;render();},
  viewIslet(d){S.view.islet=d.p;render();},
  bookP(d){S.view.bookP=d.p;render();},
  lb(d){S.view.lb=d.k;render();},
  shopCat(d){S.view.shop=d.c;render();},
  lockDur(d){S.view.lockDur=+d.m;render();},
  async renameMoth(){openModal(`<h2>Name your companion</h2><input id="mothIn" maxlength="20" value="${esc(S.players[S.me]?.mothName||'Wick')}"><div class="row"><button class="btn primary" data-act="saveMoth">Save</button><button class="btn ghost" data-act="closeModal">Cancel</button></div>`);},
  async saveMoth(){const v=$('#mothIn').value.trim().slice(0,20);closeModal();if(v)try{await writePlayer(S.me,{mothName:v});}catch(e){writeFail(e);}},
  closeModal(){closeModal();},
  async place(d){const cat=d.cat==='deck'?'deck':'decor';const n=cat==='deck'?3:6;const pl=S.players[S.me]||{};const dec=[...(pl[cat]||[])];while(dec.length<n)dec.push(null);if(dec.includes(d.id)){dec[dec.indexOf(d.id)]=null;}else{const i=dec.findIndex(x=>!x);if(i<0)return toast('<b>No free spot.</b> Tap a filled spot to clear it first.');dec[i]=d.id;}try{await writePlayer(S.me,{[cat]:dec});tone(660,.06,'triangle',.04);}catch(e){writeFail(e);}},
  async unplace(d){const cat=d.cat==='deck'?'deck':'decor';const dec=[...((S.players[S.me]||{})[cat]||[])];dec[+d.i]=null;try{await writePlayer(S.me,{[cat]:dec});}catch(e){writeFail(e);}},
  shipMode(d){S.view.shipMode=d.m;render();},
  wardrobe(d){S.view.wardrobe=d.c;render();},
  async confirmMC(d){try{await writeDay(d.p,d.d,{ev:{[d.id]:{ok:S.me,okT:Date.now()}}});toast('<b>Confirmed.</b> Honesty 1, sea monsters 0. Rewards are on their way to '+pname(d.p)+'.');tone(784,.1,'triangle',.05);}catch(e){writeFail(e);}},
  async disputeMC(d){openModal(`<h2>Dispute this?</h2><p>It will be removed from the stats and nobody gets rewards for it. ${pname(d.p)} can log it again if it was a mistake.</p><div class="row"><button class="btn primary" data-act="doDispute" data-p="${d.p}" data-d="${d.d}" data-id="${d.id}">Dispute it</button><button class="btn ghost" data-act="closeModal">Keep it</button></div>`);},
  async doDispute(d){closeModal();try{await writeDay(d.p,d.d,{ev:{[d.id]:{x:S.me,xT:Date.now()}}});toast('Disputed. The parrot has filed a formal complaint.');}catch(e){writeFail(e);}},
  led(d){S.view.led=d.v;render();},
  ledNav(d){const tw=weekStart(G.today);const cur=S.view.ledWeek||tw;S.view.ledWeek=addDays(cur,7*+d.d);if(S.view.ledWeek>tw)S.view.ledWeek=tw;render();},
  ledNavM(d){const m=S.view.ledMonth||G.today.slice(0,7);const dt=new Date(Date.UTC(+m.slice(0,4),+m.slice(5,7)-1+(+d.d),1));S.view.ledMonth=dt.toISOString().slice(0,7);render();},
  heatWho(d){S.view.heatWho=d.w;render();},
  async csv(){try{await navigator.clipboard.writeText(csvText());toast('<b>Copied.</b> Paste it into a spreadsheet: one row per day, every button per captain.');}catch(e){openModal(`<h2>Your data as CSV</h2><p class="tiny muted">Select all and copy.</p><textarea style="width:100%;height:240px;font:12px monospace;border-radius:14px;padding:10px;border:0;box-shadow:inset 0 0 0 2px var(--line)">${esc(csvText())}</textarea><button class="btn" data-act="closeModal">Done</button>`);}},
  async buy(d){const it=ALL_ITEMS[d.id];const lk=itemLocked(it,G.players[S.me]);if(lk&&!String(d.id).startsWith('m_'))return toast('<b>Locked.</b> '+esc(lk),'joke');const me=G.players[S.me];const price=+d.p;if(me.balance<price)return toast('<b>Not enough doubloons.</b> Pell suggests sending more DMs. Pell is wise, and very greedy.','joke');if(me.owned[d.id]&&it.cat!=='shield')return;
    const id=uid();try{await writeDay(S.me,G.today,{spend:{[id]:{item:it.id,cost:price,ts:Date.now()}}});SFX.ach();toast(`<b>Bought ${esc(it.name)}!</b> Looking sharp, captain.`);
      banner('NEW '+it.name.toUpperCase(),CAT_NAMES[it.cat]);if(it.cat==='decor'||it.cat==='deck'){await ACT.place({id:it.id,cat:it.cat});}else if(EQUIP_CATS.includes(it.cat))await writePlayer(S.me,{[it.cat]:it.id});}catch(e){writeFail(e);}},
  async equip(d){const it=ALL_ITEMS[d.id];const cur=(S.players[S.me]||{})[it.cat];const dflt=SHIP_DEFAULT[it.cat];const next=cur===it.id?(dflt||null):it.id;try{await writePlayer(S.me,{[it.cat]:next});tone(880,.06,'triangle',.04);}catch(e){writeFail(e);}},
  async claim(d){if(G.players[S.me].claimed.has(d.key))return;try{await writeDay(S.me,G.today,{bonus:{[d.key]:{xp:+d.xp,g:+d.g,ts:Date.now()}}});SFX.ach();toast(`<b>Quest complete!</b> +${d.xp} XP, +${d.g} ${CN}. Gary is mildly impressed.`);}catch(e){writeFail(e);}},
  async fund(d){const p=G.proj.find(x=>x.id===d.id);const amt=Math.min(+d.a,p.g-p.funded,G.players[S.me].balance);if(amt<=0)return;try{await writeDay(S.me,G.today,{contrib:{[uid()]:{proj:p.id,amt,ts:Date.now()}}});toast(`<b>+${amt} ${CN}</b> towards ${esc(p.name)}`);}catch(e){writeFail(e);}},
  async prestige(){openModal(`<h2>Rekindle your lantern?</h2><p>Your level resets to 1 and you gain a permanent prestige star, a new lighthouse colour and access to prestige items. Lifetime stats, achievements, items and doubloons all stay.</p><div class="row"><button class="btn primary" data-act="doPrestige">Rekindle</button><button class="btn ghost" data-act="closeModal">Not yet</button></div>`);},
  async doPrestige(){closeModal();const me=G.players[S.me];if(me.li.level<50)return;const arr=[...((S.players[S.me]||{}).prestige||[]),me.xp];try{await writePlayer(S.me,{prestige:arr});banner('REKINDLED','A new star burns above your lighthouse');fireworks(3000);}catch(e){writeFail(e);}},
  async lockStart(){const cm=+($('#lockCustom')?.value||0);const m=cm>=5?Math.min(180,cm):S.view.lockDur;try{await writePlayer(S.me,{lock:{id:uid(),s:Date.now(),dur:m*60000,paused:0,pausedAt:null,diff:S.view.lockDiff||'rough'}});tone(392,.2,'triangle',.06);tone(523,.25,'triangle',.06,.15);}catch(e){writeFail(e);}},
  async lockPause(){const lk=S.players[S.me].lock;try{await writePlayer(S.me,{lock:{...lk,pausedAt:Date.now()}});}catch(e){writeFail(e);}},
  async lockResume(){const lk=S.players[S.me].lock;try{await writePlayer(S.me,{lock:{...lk,paused:(lk.paused||0)+(Date.now()-lk.pausedAt),pausedAt:null}});}catch(e){writeFail(e);}},
  async lockCancel(){try{await writePlayer(S.me,{lock:null});toast('Voyage abandoned. No judgement. (Some judgement.)');}catch(e){writeFail(e);}},
  async lockFinish(){await finishLock(true);},
  async chalCreate(d){const id=uid();try{await S.db.collection('challenges').doc(id).set({type:d.type,dur:+d.m*60000,target:+d.tg,by:S.me,acc:{[S.me]:true},created:Date.now(),status:'pending'});toast(`<b>Challenge sent.</b> Waiting for ${pname(other(S.me))} to accept.`);}catch(e){writeFail(e);}},
  async chalAccept(d){try{await S.db.doc('challenges/'+d.id).update({acc:{[S.me]:true},start:Date.now()+10000,status:'on'});banner('CHALLENGE ACCEPTED','Starts in 10 seconds');}catch(e){writeFail(e);}},
  async chalDecline(d){try{await S.db.doc('challenges/'+d.id).update({status:S.challenges[d.id]?.by===S.me?'cancelled':'declined'});}catch(e){writeFail(e);}},
  wheel(d){openWheel(d.d,d.t);},
  async shield(d){try{await S.db.doc(`forfeits/${d.d}_${S.me}_${d.t}`).set({pid:S.me,date:d.d,type:d.t,status:'shield',ts:Date.now(),text:'Lantern Shield used'});toast('<b>Shield raised.</b> That day never happened. Officially.');}catch(e){writeFail(e);}},
  async redeem(d){try{await S.db.doc('forfeits/'+d.id).update({status:'redeemed',redeemedAt:Date.now()});banner('REDEEMED','The shame lifts. Mostly.');}catch(e){writeFail(e);}},
  async paid(d){try{await S.db.doc('forfeits/'+d.id).update({status:'paid',paidAt:Date.now()});toast('<b>Debt settled.</b> A captain of honour. Gary is welling up.');}catch(e){writeFail(e);}},
  async achInfo(d){const a=ACH_BY_ID[d.id];const pid=S.view.bookP||S.me;const me=G.players[pid];const un=me.unlocked[a.id];const sc=(S.players[S.me]?.showcase)||[];
    openModal(`<div class="ach r-${a.rar} ${un?'':'locked'}" style="padding:14px"><span class="rtag">${a.rar}${a.tier?' \u00b7 '+a.tier:''} \u00b7 ${esc(a.cat)}</span><h2>${a.secret&&!un?'Hidden achievement':esc(a.name)}</h2><p>${a.secret&&!un?'Some secrets need unusual combinations of genuine activity. No hints.':esc(a.secret?a.reveal:a.desc)}</p><small>Reward: ${RARITY_GLOW[a.rar]} doubloons</small></div>
    <div class="row">${un&&pid===S.me?`<button class="btn primary" data-act="toggleShow" data-id="${a.id}">${sc.includes(a.id)?'Remove from showcase':'Add to showcase'}</button>`:''}<button class="btn ghost" data-act="closeModal">Close</button></div>`);},
  async toggleShow(d){let sc=[...((S.players[S.me]?.showcase)||[])];sc=sc.includes(d.id)?sc.filter(x=>x!==d.id):[d.id,...sc].slice(0,3);closeModal();try{await writePlayer(S.me,{showcase:sc});toast('Showcase updated.');}catch(e){writeFail(e);}},
  sound(){S.sound=!S.sound;try{localStorage.setItem('hl_sound',S.sound?'1':'0')}catch(e){}},
  switchMe(){S.me=other(S.me);try{localStorage.setItem('hl_me',S.me)}catch(e){}S.view.islet=null;S.view.bookP=null;refresh(true);},
  async saveCfg(){const v=id=>$('#'+id).value;const wds=[...document.querySelectorAll('.wdBox')].filter(x=>x.checked).map(x=>+x.value);
    const patch={target:Math.max(1,+v('cfgTarget')||100),cooldownSec:clamp(+v('cfgCd')||5,1,120),dayStart:v('cfgStart')||'09:00',dayEnd:v('cfgEnd')||'17:30',finalWarning:v('cfgWarn')||'16:30',absenceScale:clamp((+v('cfgScale')||50)/100,.1,1),startDate:v('cfgPen')||'',workdays:wds.length?wds:[1,2,3,4,5],caps:Object.fromEntries(['r','v','m','c'].map(k=>[k,clamp(+v('cap_'+k)||1,1,500)])),cooldowns:Object.fromEntries(['r','v','m','c'].map(k=>[k,clamp(+v('cd_'+k)||1,1,600)])),requireConfirm:$('#reqConf').checked,sightingMode:$('#sightMode').value};
    try{await writeConfig(patch);toast('<b>Saved.</b> The sea monsters have been informed.');}catch(e){writeFail(e);}},
  async addAbs(){const d=$('#absDate').value,w=$('#absWho').value,t=$('#absType').value;if(!d)return;try{if(w==='__all'){const h=[...new Set([...(C().holidays||[]),d])];await writeConfig({holidays:h});}else await writeConfig({absences:{[d+'_'+w]:t}});toast('<b>Day off recorded.</b> Enjoy it. The monsters will wait. Grumpily.');}catch(e){writeFail(e);}},
  async rmHol(d){try{await writeConfig({holidays:(C().holidays||[]).filter(x=>x!==d.d)});}catch(e){writeFail(e);}},
  async rmAbs(d){try{await writeConfig({absences:{[d.k]:{__delete__:true}}});}catch(e){writeFail(e);}},
  async approve(d,el){try{await writeConfig({approvals:{[S.me]:{[d.id]:!!el.checked}}});}catch(e){writeFail(e);}},
  async addFf(){const t=$('#newFf').value.trim();if(!t)return;try{await writeConfig({custom:{['c'+uid()]:{text:t.slice(0,90),kind:$('#newFfKind').value,by:S.me}}});$('#newFf').value='';toast(`Added. ${pname(other(S.me))} needs to approve it too.`);}catch(e){writeFail(e);}},
  async release(d){try{await writePlayer(d.p,{uid:null});}catch(e){writeFail(e);}},
  async claimKeeper(d){await claimKeeper(d.p);},
  async spin(){await doSpin();},
  wheelMode(d){S.view.wheelMode=d.m;drawWheel(0);$('#wheelModeSeg').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.m===d.m));},
};
function lockElapsed(lk){const end=lk.pausedAt||Date.now();return Math.max(0,end-lk.s-(lk.paused||0));}
async function finishLock(early){const lk=S.players[S.me]?.lock;if(!lk||S.finishing)return;S.finishing=true;const el=lockElapsed(lk);const dms=myDmSince(S.me,lk.s);const vb=voyageBoss(lk);const beat=dms>=vb.hp;const full=!early&&el>=lk.dur-1000;
  try{if(el>=60000){await writeDay(S.me,L(lk.s).date,{ses:{[lk.id]:{s:lk.s,e:Date.now(),dur:Math.min(el,lk.dur),planned:lk.dur,dms,diff:lk.diff||'calm',beat,full}}});}await writePlayer(S.me,{lock:null});focusOff();
    const me=G.players[S.me];const mins=Math.max(1,el/60000);const chest=full?dms*3:0;
    openModal(`<div class="reveal">${full?'<div class="chestAnim"><i class="lid"></i><i class="box"></i><i class="shine"></i></div>':''}<h2>${full?'Treasure Island!':'Anchors down'}</h2>
     <div class="grid3"><div class="stat"><b>${Math.round(el/60000)} min</b><small>voyage</small></div><div class="stat"><b>${dms}</b><small>DMs sent</small></div><div class="stat"><b>${Math.round(dms/mins*60)}</b><small>per hour</small></div>
     <div class="stat"><b>${chest?'+'+chest:'\u2014'}</b><small>chest doubloons</small></div><div class="stat"><b>${beat?'Beaten':'Escaped'}</b><small>${esc(vb.desc.toLowerCase())}</small></div><div class="stat"><b>${dms>me.m.bestSession?'NEW!':me.m.bestSession}</b><small>best voyage</small></div></div>
     ${el<60000?'<p class="tiny muted">Voyages under a minute aren\'t recorded.</p>':''}${!full&&el>=60000?'<p class="tiny muted">Dropping anchor early skips the treasure chest.</p>':''}
     <p class="muted">${dms>=20?'Absolute machine. Take five minutes, stretch, drink some water.':dms>=8?'Solid voyage. Stretch your legs before the next one.':'Every voyage counts. Quick break?'}</p><button class="btn primary" data-act="closeModal">Back to port</button></div>`);
    if(full){SND.chest();fireworks(2200);}}catch(e){writeFail(e);}S.finishing=false;}

/* ---------- Forfeit wheel ---------- */
let WHEEL={rot:0,date:null,type:null,spinning:false};
function wheelItems(){const all=approvedForfeits().filter(f=>f.ok);const m=S.view.wheelMode;const l=all.filter(f=>m==='both'?true:f.kind===m);return l.length?l:all.filter(f=>f.kind==='virtual');}
function openWheel(date,type){WHEEL={rot:0,date,type,spinning:false};
  openModal(`<h2>Wheel of Forfeits</h2><p class="tiny muted">${type==='team'?'Team failure':'Individual failure'} \u00b7 ${esc(niceDate(date))}</p><div class="seg" id="wheelModeSeg">${[['virtual','In game'],['real','Real life'],['both','Both']].map(([m,n])=>`<button class="${S.view.wheelMode===m?'on':''}" data-act="wheelMode" data-m="${m}">${n}</button>`).join('')}</div><div class="wheelWrap"><div class="pin"></div><canvas id="wheel" width="300" height="300"></canvas></div><p id="wheelRes" style="text-align:center;min-height:2.6em;font-family:var(--display)"></p><div class="row" style="justify-content:center"><button class="btn primary" id="spinBtn" data-act="spin">Spin the wheel</button><button class="btn ghost" data-act="closeModal">Later</button></div>`);drawWheel(0);}
function drawWheel(rot){const cv=$('#wheel');if(!cv)return;const c=cv.getContext('2d');const it=wheelItems();const n=it.length;c.clearRect(0,0,300,300);const cols=['#E06034','#DDA94D','#7CC7E6','#9B7FD9','#5DBE9C','#E0457B'];
  for(let i=0;i<n;i++){const a0=rot+i/n*Math.PI*2,a1=rot+(i+1)/n*Math.PI*2;c.beginPath();c.moveTo(150,150);c.arc(150,150,145,a0,a1);c.closePath();c.fillStyle=cols[i%cols.length];c.fill();c.strokeStyle='#FFFCF4';c.lineWidth=3;c.stroke();
    c.save();c.translate(150,150);c.rotate((a0+a1)/2);c.fillStyle='#FFFFFF';c.font='700 11px Nunito, sans-serif';c.textAlign='right';const s=it[i].text;c.fillText(s.length>26?s.slice(0,25)+'\u2026':s,138,4);c.restore();}
  disc(c,150,150,16,'#FFFCF4');disc(c,150,150,8,'#3F5160');}
async function doSpin(){if(WHEEL.spinning)return;const it=wheelItems();if(!it.length)return;WHEEL.spinning=true;$('#spinBtn').disabled=true;const n=it.length;const idx=Math.floor(Math.random()*n);
  const target=-Math.PI/2-(idx+.5)/n*Math.PI*2;const total=Math.PI*2*6+((target%(Math.PI*2))+Math.PI*2)%(Math.PI*2);const t0=performance.now(),dur=3600;let lastTick=0;
  await new Promise(res=>{(function f(now){const p=Math.min(1,(now-t0)/dur);const e=1-Math.pow(1-p,4);const r=total*e;drawWheel(r);const seg=Math.floor(r/(Math.PI*2/n));if(seg!==lastTick){lastTick=seg;tone(900,.02,'square',.03);}if(p<1)requestAnimationFrame(f);else res();})(t0);});
  const f=it[idx];$('#wheelRes').textContent=f.text;SFX.no();
  try{await S.db.doc(`forfeits/${WHEEL.date}_${S.me}_${WHEEL.type}`).set({pid:S.me,date:WHEEL.date,type:WHEEL.type,status:'spun',result:f.id,text:f.text,kind:f.kind,ts:Date.now()});}catch(e){writeFail(e);}
  WHEEL.spinning=false;}

/* ---------- Modal ---------- */
function openModal(html){const m=$('#modal');m.innerHTML=`<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;m.hidden=false;}
function closeModal(){const m=$('#modal');m.hidden=true;m.innerHTML='';}

const CN='<i class="cn" aria-label="doubloons"></i>';
const EQUIP_CATS=['hat','face','coat','hull','sail','flag','figure','trail','shot','moth','effect'];
function itemLocked(it,me){if(it.track)return me.maxLevel<it.track?`Reward at level ${it.track}`:'';if(it.prestige&&me.prest<it.prestige)return `Needs ${it.prestige} prestige${it.prestige>1?'s':''}`;if(it.lvl&&me.maxLevel<it.lvl)return `Level ${it.lvl}`;return '';}
SCREENS.ship=()=>{
  const pid=S.view.islet||S.me||G.P[0];const me=G.players[pid];const pl=S.players[pid]||{};const mine=pid===S.me;const mode=S.view.shipMode||'ship';
  const st=MOTH_STAGES[me.moth],nx=MOTH_STAGES[me.moth+1];const ff=activeForfeitsFor(pid);
  const show=(pl.showcase&&pl.showcase.length?pl.showcase:ACHIEVEMENTS.filter(a=>me.unlocked[a.id]).sort((a,b)=>RARITIES.indexOf(b.rar)-RARITIES.indexOf(a.rar)).slice(0,3).map(a=>a.id)).filter(id=>me.unlocked[id]);
  const wc=S.view.wardrobe||'hat';
  const owned=Object.keys(me.owned).map(id=>ALL_ITEMS[id]).filter(Boolean);
  const ownedIn=cat=>owned.filter(i=>i.cat===cat);
  const cur=cat=>pl[cat]||SHIP_DEFAULT[cat]||null;
  const slotCat=wc==='deck'?'deck':wc==='decor'?'decor':null;const slots=slotCat?(pl[slotCat]||[]):[];const nSlots=slotCat==='deck'?3:6;
  const nextTrack=TRACK.find(i=>i.track>me.maxLevel);
  return `<div class="pad" style="padding-bottom:0"><div class="row between"><div class="seg" style="flex:1">${G.P.map(p=>`<button class="${p===pid?'on':''}" data-act="viewIslet" data-p="${p}">${pname(p)}</button>`).join('')}</div><div class="seg">${[['ship','Ship'],['hideout','Hideout']].map(([k,n])=>`<button class="${mode===k?'on':''}" data-act="shipMode" data-m="${k}">${n}</button>`).join('')}</div></div></div>
  <canvas id="scene" class="scene" width="960" height="540" aria-label="${pname(pid)}'s ${mode}"></canvas>
  <div class="pad">
   <div class="card hero"><div class="row between"><div><small>${esc(ff.find(f=>f.result==='title')?"Ship's Napper":titleFor(me.li.level))}</small><h2 style="color:${pcol(pid)}">Captain ${pname(pid)}</h2></div>
    <div class="row" style="gap:6px"><span class="pill">Lv ${me.li.level}</span>${me.prest?`<span class="pill" style="color:var(--r-legendary)">${'\u2605'.repeat(Math.min(5,me.prest))}</span>`:''}<span class="pill">\ud83d\udd25 ${me.curStreak}</span><span class="pill">${CN} ${fmtN(me.balance)}</span></div></div>
    <div class="grid3" style="margin-top:10px"><div class="stat"><b class="num">${fmtN(me.counts.d)}</b><small>lifetime DMs</small></div><div class="stat"><b class="num">${Object.keys(me.unlocked).length}</b><small>achievements</small></div><div class="stat"><b class="num">${me.m.cosmetics}</b><small>cosmetics owned</small></div></div>
    ${nextTrack?`<a class="nextReward" href="#log"><canvas class="icon" data-id="${nextTrack.id}"></canvas><div><small>Next reward \u00b7 level ${nextTrack.track}</small><b>${esc(nextTrack.name)}</b>${bar(me.maxLevel,nextTrack.track)}</div><span class="chev">\u203a</span></a>`:''}</div>
   <div class="card"><div class="row between"><div><small>Companion</small><h3>${esc(pl.mothName||'Polly')} the ${esc(st.name)}</h3></div>${mine?`<button class="btn sm ghost" data-act="renameMoth">Rename</button>`:''}</div>
    <div class="speech" style="margin-top:8px">"${esc(pick(MOTH_LINES,G.today+pid+(me.counts.d>>3)))}"</div>
    <div style="margin-top:8px">${nx?`<small>Grows into a ${esc(nx.name)} at ${fmtN(nx.at)} lifetime DMs</small>${bar(me.counts.d-st.at,nx.at-st.at)}`:'<small>Fully evolved. Sings sea shanties when you send DMs.</small>'}</div></div>
   ${mine?`<div class="card"><div class="row between"><h3>Wardrobe & rigging</h3><a class="btn sm" href="#shop">Shop</a></div>
    <div class="chips" role="tablist">${[...EQUIP_CATS,'deck','decor'].map(k=>`<button class="chip ${wc===k?'on':''}" data-act="wardrobe" data-c="${k}">${CAT_NAMES[k]}</button>`).join('')}</div>
    ${slotCat?`<div class="slots">${Array.from({length:nSlots},(_,i)=>`<button class="slot ${slots[i]?'full':''}" ${slots[i]?`data-act="unplace" data-cat="${slotCat}" data-i="${i}"`:'disabled'} aria-label="${slots[i]?'Remove '+esc(ALL_ITEMS[slots[i]]?.name):'Empty spot'}">${slots[i]?`<canvas class="icon" data-id="${slots[i]}"></canvas><small>${esc(ALL_ITEMS[slots[i]]?.name)}</small>`:`<small>Empty</small>`}</button>`).join('')}</div><small class="tiny">Tap a filled spot to clear it. Tap an item below to place it.</small>`:''}
    <div class="wardrobe">${ownedIn(wc).map(i=>{const on=slotCat?slots.includes(i.id):cur(wc)===i.id;return `<button class="ward ${on?'on':''}" data-act="${slotCat?'place':'equip'}" data-id="${i.id}" data-cat="${wc}" aria-pressed="${on}"><canvas class="icon" data-id="${i.id}"></canvas><span>${esc(i.name)}</span></button>`;}).join('')||`<p class="muted tiny" style="grid-column:1/-1;margin:6px 0">Nothing here yet. Unlock ${esc(CAT_NAMES[wc].toLowerCase())} through levelling or the shop.</p>`}</div></div>`:''}
   <div class="card"><div class="row between"><h3>Pets \u00b7 ${Object.keys(me.pets).length}/${PETS.length}</h3><a class="btn sm" href="#pets">All pets</a></div><div class="petRow">${Object.keys(me.pets).length?Object.keys(me.pets).map(id=>`<button class="petCard r-${PET_BY_ID[id].rar} ${pl.pet===id?'on':''}" ${mine?`data-act="equipPet" data-pet="${id}"`:'disabled'}><canvas class="petIco" data-pet="${id}" data-sil="0"></canvas><b>${esc(PET_BY_ID[id].name)}</b></button>`).join(''):'<p class="tiny muted" style="margin:6px 0">No pets yet. Watch for the daily sighting on the Harbour.</p>'}</div></div>
   <div class="card"><h3>Showcase</h3><div class="achGrid" style="margin-top:8px">${show.length?show.map(id=>achCard(ACH_BY_ID[id],me)).join(''):'<small>No achievements yet. The first DM unlocks one.</small>'}</div></div>
   <div class="card"><h3>Treasure hoard \u00b7 ${Object.keys(me.loot).length}/${COLLECTIBLES.length}</h3><div style="display:grid;gap:10px;margin-top:8px">${COLLECT_SETS.map(set=>`<div><small>${esc(set.name)}${set.items.every(([i])=>me.loot[i])?' <b class="done">\u00b7 complete</b>':''}</small><div class="row" style="gap:6px;margin-top:4px">${set.items.map(([i,n])=>`<canvas class="collect" data-c="${i}" data-f="${me.loot[i]?1:0}" title="${me.loot[i]?esc(n):'Not found yet'}"></canvas>`).join('')}</div></div>`).join('')}</div><small>Treasure drops from logged activity: roughly 1 in 40 DMs, often from responses, always from confirmed meetings and clients.</small></div>
  </div>`;
};
SCREENS.islet=SCREENS.ship;
SCREENS.log=()=>{
  const me=G.players[S.me];const lv=me.maxLevel;
  const rows=[];for(let L=2;L<=100;L++){const items=TRACK.filter(i=>i.track===L);const ti=TITLES.find(t=>t[0]===L);if(items.length||ti||L%10===0)rows.push({L,items,ti});}
  return `<div class="pad"><div class="card hero"><small>Captain's Log \u00b7 reward track</small><h2>Level ${me.li.level}${me.prest?` <small>(best ${lv})</small>`:''}</h2>${me.li.need?`${bar(me.li.into,me.li.need)}<small class="num">${fmtN(me.li.into)} / ${fmtN(me.li.need)} XP to level ${me.li.level+1}</small>`:''}
   <p class="tiny muted" style="margin:8px 0 0">Every level pays out doubloons (${fmtN(levelGold(me.li.level+1))} for the next one). Named levels unlock free cosmetics and new ranks. You've banked ${fmtN(me.lvlGold)} doubloons from levelling so far.</p></div>
  <div class="track">${rows.map(r=>{const got=lv>=r.L;return `<div class="tstep ${got?'got':''} ${!got&&rows.find(x=>x.L>lv)===r?'next':''}"><span class="tl">${r.L}</span><div class="tbody">${r.ti?`<b>Rank: ${esc(r.ti[1])}</b>`:''}${r.items.map(i=>`<div class="row" style="gap:8px;flex-wrap:nowrap"><canvas class="icon sm" data-id="${i.id}"></canvas><span>${esc(i.name)} <small>${esc(CAT_NAMES[i.cat])}</small></span></div>`).join('')}${!r.ti&&!r.items.length?`<small>${CN} ${fmtN(levelGold(r.L))} doubloons</small>`:''}</div>${got?'<span class="done">\u2713</span>':''}</div>`;}).join('')}</div></div>`;
};
SCREENS.shop=()=>{
  const me=G.players[S.me];const pl=S.players[S.me]||{};const cat=S.view.shop||'hat';const mer=merchantToday(G.today);
  const items=ITEMS.filter(i=>i.cat===cat&&!i.merchantOnly&&!i.free).concat(Object.keys(me.owned).filter(id=>id.startsWith('m_')&&ALL_ITEMS[id].cat===cat).map(id=>ALL_ITEMS[id]));
  const card=(it,price,merchant)=>{const owned=me.owned[it.id];const lock=itemLocked(it,me);const eq=EQUIP_CATS.includes(it.cat)&&pl[it.cat]===it.id;
    return `<div class="shopItem ${lock&&!owned?'locked':''}">${it.track?'<span class="ribbon">Reward</span>':''}<canvas class="icon" data-id="${it.id}"></canvas><b>${esc(it.name)}</b>${it.desc?`<small>${esc(it.desc)}</small>`:''}
    ${owned&&it.cat!=='shield'?(EQUIP_CATS.includes(it.cat)?`<button class="btn sm ${eq?'':'primary'}" data-act="equip" data-id="${it.id}" data-cat="${it.cat}">${eq?'Wearing':'Use'}</button>`:`<small class="done">Owned</small>`):lock?`<small class="lockTxt">\ud83d\udd12 ${esc(lock)}</small>`:`<button class="btn sm" data-act="buy" data-id="${it.id}" data-p="${price}" ${me.balance<price||(it.cat==='shield'&&me.shields>=3)?'disabled':''}>${CN} ${fmtN(price)}</button>`}${merchant?'<small>Barge price</small>':''}</div>`;};
  const total=ITEMS.filter(i=>i.cat!=='shield'&&!i.free).length+MERCHANT_ITEMS.length;
  return `<div class="pad"><div class="row between"><h2>Shop</h2><span class="pill">${CN} <b class="num">${fmtN(me.balance)}</b></span></div>
  <div class="card flat row between" style="padding:10px 14px"><small>Collection: <b>${me.m.cosmetics}</b> of ${total} cosmetics</small><a class="btn sm" href="#log">Reward track</a></div>
  ${mer?`<div class="card barge"><h3>Pell's Travelling Barge</h3><p class="tiny muted" style="margin:2px 0 8px">"Rare goods, rarer prices. Back Tuesday or Thursday, tide permitting."</p><div class="grid3">${mer.map(it=>card(it,it.price,true)).join('')}</div></div>`:`<p class="tiny muted" style="margin:0">Pell's barge sails in on Tuesdays and Thursdays with rare stock.</p>`}
  <div class="chips">${CAT_ORDER.map(c=>`<button class="chip ${cat===c?'on':''}" data-act="shopCat" data-c="${c}">${CAT_NAMES[c]}</button>`).join('')}</div>
  <div class="grid3">${items.map(it=>card(it,it.price||0)).join('')}</div>
  ${cat==='shield'?`<p class="tiny muted">You have ${me.shields} shield${me.shields===1?'':'s'} (max 3). You also earn one free shield for every 10 crew-target days.</p>`:''}
  ${me.li.level>=50?`<div class="card"><h3>Rekindle (prestige)</h3><p class="tiny muted">Reset your level to 1 for a permanent star, a new rank cycle and prestige-only items. Lifetime stats, achievements, items and doubloons are kept.</p><button class="btn primary" data-act="prestige">Rekindle</button></div>`:`<p class="tiny muted">Reach level 50 to Rekindle (prestige) for permanent stars and exclusive items.</p>`}</div>`;
};

/* ---------- Crew confirmations ---------- */
function crewCheckHtml(){
  if(!G.cfg.requireConfirm||!G.pendingConf.length)return '';const mineToCheck=G.pendingConf.filter(e=>e.pid!==S.me);const waiting=G.pendingConf.filter(e=>e.pid===S.me);
  const ago=t=>{const m=Math.round((Date.now()-t)/60000);return m<60?`${m} min ago`:m<1440?`${Math.round(m/60)} h ago`:`${Math.round(m/1440)} d ago`;};
  return `<div class="card crew"><div class="row between"><h3>Crew check</h3><small>Rewards land once confirmed</small></div><div class="list" style="margin-top:8px">
   ${mineToCheck.map(e=>`<div class="li"><span class="kdot k-${e.k}"></span><div class="grow"><b>${pname(e.pid)} logged a ${e.k==='c'?'new client':'meeting request'}</b><br><small>${esc(e.pr||'no name given')} \u00b7 ${ago(e.t)}</small></div><button class="btn sm primary" data-act="confirmMC" data-p="${e.pid}" data-d="${e.date}" data-id="${e.id}">Confirm</button><button class="btn sm ghost" data-act="disputeMC" data-p="${e.pid}" data-d="${e.date}" data-id="${e.id}">Dispute</button></div>`).join('')}
   ${waiting.map(e=>`<div class="li"><span class="kdot k-${e.k}"></span><div class="grow"><b>Your ${e.k==='c'?'client':'meeting request'} is waiting</b><br><small>${esc(e.pr)} \u00b7 ${pname(other(S.me))} needs to confirm \u00b7 ${ago(e.t)}</small></div></div>`).join('')}
  </div></div>`;
}
function normPr(s){return String(s||'').toLowerCase().replace(/^@+/,'').replace(/[^a-z0-9]+/g,'');}
function openMCSheet(k){
  const cfg=C();const name=k==='c'?'client':'meeting request';
  openModal(`<div class="sheetHead k-${k}"><span class="kbig">${k==='c'?'<svg><use href="#i-star"/></svg>':'<svg><use href="#i-meet"/></svg>'}</span><div><h2>Log a ${name}</h2><small>${cfg.requireConfirm?`${pname(other(S.me))} confirms it before the rewards land.`:'Only log genuine ones, please.'}</small></div></div>
   <label class="f" for="prIn">Who is the prospect?<input id="prIn" maxlength="60" placeholder="@instagramhandle or business name" autocomplete="off"></label>
   <p class="tiny muted" style="margin:0">Limit ${cfg.caps[k]} per day \u00b7 one every ${cfg.cooldowns[k]>=60?Math.round(cfg.cooldowns[k]/60)+' min':cfg.cooldowns[k]+' s'}${k==='c'?' \u00b7 each prospect can only become a client once':' \u00b7 same prospect at most once a month'}.</p>
   <button class="hold" id="holdBtn" data-k="${k}"><i></i><span>Press and hold to log</span></button>
   <button class="btn ghost" data-act="closeModal">Cancel</button>`);
  const b=$('#holdBtn');let tm=null;const start=e=>{e.preventDefault();const v=$('#prIn').value.trim();if(normPr(v).length<2){$('#prIn').focus();$('#prIn').classList.add('err');toast('<b>Who\u2019s the lucky prospect?</b> Add their handle or business name. Gary can\u2019t read minds. He\u2019s a gull.','joke',2200);return;}b.classList.add('holding');tone(330,.4,'triangle',.03);tm=setTimeout(()=>{b.classList.remove('holding');b.classList.add('ok');submitMC(k,v);},950);};
  const stop=()=>{if(tm){clearTimeout(tm);tm=null;}b.classList.remove('holding');};
  b.addEventListener('pointerdown',start);['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,stop));b.addEventListener('contextmenu',e=>e.preventDefault());
  setTimeout(()=>$('#prIn')?.focus(),60);
}
async function submitMC(k,pr){
  const cfg=C();const now=Date.now();const n=normPr(pr);const today=L(now).date;
  const all=G.mc.filter(e=>e.k===k);
  if(k==='c'&&all.some(e=>normPr(e.pr)===n)){closeModal();return toast(`<b>${esc(pr)} is already a client.</b> You can't win the same client twice. We checked. Twice.`,'joke',4000);}
  if(k==='m'&&all.some(e=>normPr(e.pr)===n&&now-e.t<30*86400000)){closeModal();return toast(`<b>Already logged a meeting with ${esc(pr)} this month.</b>`,'joke',4000);}
  const todayN=all.filter(e=>e.pid===S.me&&e.date===today).length;if(todayN>=cfg.caps[k]){closeModal();return toast(`<b>Daily limit reached.</b> ${cfg.caps[k]} ${KINDS[k].short.toLowerCase()}s a day is the cap. Save some for tomorrow, legend.`,'joke',4000);}
  const id=uid();
  try{const lease=await S.db.doc(`cool/${S.me}_${k}`).acquire({holder:id,ttlMs:clamp(cfg.cooldowns[k]*1000,1000,600000)});
    if(!lease.acquired){closeModal();const left=Math.max(1,Math.ceil(((Date.parse(lease.expiresAt)||now)-now)/1000));return toast(`<b>Easy, tiger.</b> Next ${KINDS[k].short.toLowerCase()} can be logged in ${left>=60?Math.ceil(left/60)+' min':left+' s'}.`,'joke',3500);}
    S.pending[id]={id,pid:S.me,date:today,k,t:now,pr:pr.slice(0,60)};refresh();
    await writeDay(S.me,today,{ev:{[id]:{k,t:now,pr:pr.slice(0,60)}}});closeModal();
    if(cfg.requireConfirm){toast(`<b>Logged!</b> ${pname(other(S.me))} has to confirm it. Bribes not accepted. Biscuits considered.`,'',4200);SFX.ach();}
    else celebrate(k,$('#b_'+k));
  }catch(e){delete S.pending[id];refresh();closeModal();writeFail(e);}
}

/* ============================== THE CAPTAIN'S LEDGER (analytics) ============================== */
const KK=['d','r','v','m','c'];
function blankC(){return{d:0,r:0,v:0,m:0,c:0};}
function rangeStats(a,b){const P=G.P;const o={team:blankC(),p:Object.fromEntries(P.map(p=>[p,blankC()])),tgt:0,wd:0,hit:0,days:[]};
  for(let d=a;d<=b;d=addDays(d,1)){const D=G.days[d];const tg=d<=G.today?targetFor(d):0;if(tg>0&&d<=G.today){o.tgt+=tg;if(d<G.today||D?.hit)o.wd++;if(D?.hit)o.hit++;}
    const row={d,tg,team:D?D.team:0,hit:!!D?.hit,p:Object.fromEntries(P.map(p=>[p,D?D.p[p]:blankC()]))};o.days.push(row);
    if(D)P.forEach(p=>KK.forEach(k=>{o.p[p][k]+=D.p[p][k];o.team[k]+=D.p[p][k];}));}
  o.pend=G.pendingConf.filter(e=>e.date>=a&&e.date<=b).length;return o;}
const pct=(a,b,dp=1)=>b?(a/b*100).toFixed(dp)+'%':'\u2014';
function delta(a,b){if(!b)return a?'<span class="up">new</span>':'<span class="flat">\u2014</span>';const d=(a-b)/b*100;return `<span class="${d>=0?'up':'down'}">${d>=0?'\u25b2':'\u25bc'} ${Math.abs(d).toFixed(0)}%</span>`;}
function svgBars(rows,opts){// rows: [{label, parts:[[val,col]], target, title}]
  const h=opts.h||160,bw=opts.bw||26,gap=opts.gap||10,pad=34,w=pad+rows.length*(bw+gap)+6;const max=Math.max(1,...rows.map(r=>Math.max(r.parts.reduce((a,x)=>a+x[0],0),r.target||0)));const top=10,ch=h-34;
  let s=`<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(opts.label||'chart')}">`;
  [0,.5,1].forEach(f=>{const y=top+ch-f*ch;s+=`<line x1="${pad}" x2="${w}" y1="${y}" y2="${y}" stroke="#EADFC6"/><text x="${pad-6}" y="${y+3.5}" fill="#7F8A95" font-size="10" text-anchor="end">${Math.round(max*f)}</text>`;});
  rows.forEach((r,i)=>{const X=pad+6+i*(bw+gap);let y=top+ch;r.parts.forEach(([v,col],j)=>{const hh=v/max*ch;y-=hh;s+=`<rect x="${X}" y="${y}" width="${bw}" height="${Math.max(0,hh)}" rx="${j===r.parts.length-1?5:0}" fill="${col}"><title>${esc(r.title||'')}</title></rect>`;});
    if(r.target){const ty=top+ch-r.target/max*ch;s+=`<line x1="${X-3}" x2="${X+bw+3}" y1="${ty}" y2="${ty}" stroke="#3F5160" stroke-width="2" stroke-dasharray="4 3"/>`;}
    if(r.mark)s+=`<circle cx="${X+bw/2}" cy="${top+4}" r="4" fill="${r.mark}"/>`;
    s+=`<text x="${X+bw/2}" y="${h-8}" fill="#7F8A95" font-size="10" text-anchor="middle">${esc(r.label)}</text>`;});
  return s+'</svg>';}
function svgLines(series,labels,opts){// series:[{vals,col,name,dash}]
  const n=labels.length;const h=opts.h||170,pw=opts.pw||Math.max(6,Math.min(18,560/n)),pad=34,w=pad+n*pw+10,top=10,ch=h-34;const all=series.flatMap(s=>s.vals.filter(v=>v!=null));const max=Math.max(1,opts.max||0,...all);
  let s=`<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(opts.label||'trend')}">`;
  [0,.5,1].forEach(f=>{const y=top+ch-f*ch;s+=`<line x1="${pad}" x2="${w}" y1="${y}" y2="${y}" stroke="#EADFC6"/><text x="${pad-6}" y="${y+3.5}" fill="#7F8A95" font-size="10" text-anchor="end">${opts.pct?Math.round(max*f)+'%':Math.round(max*f)}</text>`;});
  if(opts.target){const y=top+ch-opts.target/max*ch;s+=`<line x1="${pad}" x2="${w}" y1="${y}" y2="${y}" stroke="#3F5160" stroke-width="1.5" stroke-dasharray="4 3"/>`;}
  series.forEach(se=>{let d='',area='';se.vals.forEach((v,i)=>{if(v==null)return;const x=pad+6+i*pw,y=top+ch-v/max*ch;d+=(d?'L':'M')+x.toFixed(1)+' '+y.toFixed(1);});
    if(se.fill&&d){const xs=se.vals.map((v,i)=>v==null?null:pad+6+i*pw).filter(x=>x!=null);area=d+`L${xs[xs.length-1]} ${top+ch}L${xs[0]} ${top+ch}Z`;s+=`<path d="${area}" fill="${se.col}" opacity=".15"/>`;}
    s+=`<path d="${d}" fill="none" stroke="${se.col}" stroke-width="${se.w||2}" stroke-linejoin="round" stroke-linecap="round" ${se.dash?'stroke-dasharray="5 4"':''}/>`;
    const li=se.vals.map((v,i)=>[v,i]).filter(x=>x[0]!=null).pop();if(li&&!se.dash)s+=`<circle cx="${pad+6+li[1]*pw}" cy="${top+ch-li[0]/max*ch}" r="3.5" fill="${se.col}" stroke="#fff" stroke-width="1.5"/>`;});
  const step=Math.ceil(n/8);labels.forEach((l,i)=>{if(i%step===0)s+=`<text x="${pad+6+i*pw}" y="${h-8}" fill="#7F8A95" font-size="10" text-anchor="middle">${esc(l)}</text>`;});
  return s+'</svg>';}
function heatmapHtml(a,b,who){const grid=Array.from({length:7},()=>Array(14).fill(0));// hours 7..20
  G.evs.forEach(e=>{if(e.k!=='d'||e.date<a||e.date>b||(who!=='team'&&e.pid!==who))return;const h=Math.floor(e.min/60);if(h<7||h>20)return;grid[(wd(e.date)+6)%7][h-7]++;});
  const max=Math.max(1,...grid.flat());const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return `<div class="heat" role="img" aria-label="DMs by weekday and hour"><span></span>${Array.from({length:14},(_,i)=>`<span class="hh">${i%2?'':String(i+7).padStart(2,'0')}</span>`).join('')}
   ${grid.map((row,di)=>`<span class="hd">${days[di]}</span>`+row.map((v,hi)=>`<i style="background:rgba(224,96,52,${v?(.12+.88*v/max).toFixed(2):0})" title="${days[di]} ${hi+7}:00 \u00b7 ${v} DMs"></i>`).join('')).join('')}</div>`;}
function bestPeriod(fn,list){let best=null;list.forEach(k=>{const v=fn(k);if(!best||v>best.v)best={k,v};});return best;}
SCREENS.ledger=()=>{
  const P=G.P;const view=S.view.led||'week';const tw=weekStart(G.today);
  const ws=S.view.ledWeek&&S.view.ledWeek<=tw?S.view.ledWeek:tw;const mo=S.view.ledMonth||G.today.slice(0,7);
  let a,b,pa,pb,title;
  if(view==='week'){a=ws;b=addDays(ws,6);pa=addDays(ws,-7);pb=addDays(ws,-1);title=`Week of ${shortDate(ws)}`;}
  else if(view==='month'){a=mo+'-01';const nm=new Date(Date.UTC(+mo.slice(0,4),+mo.slice(5,7),1)).toISOString().slice(0,10);b=addDays(nm,-1);const pm=new Date(Date.UTC(+mo.slice(0,4),+mo.slice(5,7)-2,1)).toISOString().slice(0,10);pa=pm;pb=addDays(a,-1);title=new Date(a+'T12:00:00Z').toLocaleDateString('en-GB',{month:'long',year:'numeric',timeZone:'UTC'});}
  else if(view==='q'){a=addDays(tw,-77);b=addDays(tw,6);pa=addDays(a,-84);pb=addDays(a,-1);title='Last 12 weeks';}
  else{const first=G.evs.length?G.evs[0].date:G.today;a=weekStart(first);b=G.today;pa=a;pb=addDays(a,-1);title='All time';}
  const R0=rangeStats(a,b),R1=rangeStats(pa,pb);const T=R0.team,T1=R1.team;
  const kpi=(n,v,pv,sub)=>`<div class="kpi"><small>${n}</small><b class="num">${v}</b>${sub?`<small>${sub}</small>`:''}${pv!=null?`<small>${pv}</small>`:''}</div>`;
  const nav=view==='week'?`<div class="navrow"><button class="btn sm" data-act="ledNav" data-d="-1" aria-label="Previous week">\u2039</button><b>${title}</b><button class="btn sm" data-act="ledNav" data-d="1" ${ws>=tw?'disabled':''} aria-label="Next week">\u203a</button></div>`
    :view==='month'?`<div class="navrow"><button class="btn sm" data-act="ledNavM" data-d="-1" aria-label="Previous month">\u2039</button><b>${title}</b><button class="btn sm" data-act="ledNavM" data-d="1" ${mo>=G.today.slice(0,7)?'disabled':''} aria-label="Next month">\u203a</button></div>`:`<div class="navrow"><b>${title}</b></div>`;
  let main='';
  if(view==='week'){
    main=`<div class="card"><h3>Day by day</h3><div class="chart" style="margin-top:6px">${svgBars(R0.days.map(r=>({label:DAYN[wd(r.d)],parts:P.map(p=>[r.p[p].d,pcolHex(p)]),target:r.tg,mark:r.tg?(r.hit?'#3FA57E':(r.d<G.today?'#D9485F':null)):null,title:`${shortDate(r.d)}: ${r.team}${r.tg?'/'+r.tg:''}`})),{label:'DMs per day this week',bw:30,gap:12})}</div>
     <div style="overflow-x:auto;margin-top:8px"><table class="lb"><thead><tr><th>Day</th>${P.map(p=>`<th style="color:${pcol(p)}">${pname(p)}</th>`).join('')}<th>Crew</th><th>Target</th><th>Resp</th><th>Video</th><th>Meet</th><th>Client</th></tr></thead><tbody>
     ${R0.days.map(r=>`<tr class="${r.d===G.today?'today':''}"><td>${DAYN[wd(r.d)]} ${shortDate(r.d)}</td>${P.map(p=>`<td>${r.p[p].d}</td>`).join('')}<td><b>${r.team}</b></td><td>${r.tg?(r.hit?'<span class="up">\u2713 '+r.tg+'</span>':r.d<G.today?'<span class="down">\u2717 '+r.tg+'</span>':r.tg):'<small>off</small>'}</td>${['r','v','m','c'].map(k=>`<td>${P.reduce((s,p)=>s+r.p[p][k],0)||''}</td>`).join('')}</tr>`).join('')}
     <tr class="tot"><td>Total</td>${P.map(p=>`<td>${fmtN(R0.p[p].d)}</td>`).join('')}<td>${fmtN(T.d)}</td><td>${fmtN(R0.tgt)}</td>${['r','v','m','c'].map(k=>`<td>${T[k]}</td>`).join('')}</tr></tbody></table></div></div>`;
  } else if(view==='month'){
    const first=new Date(a+'T12:00:00Z');const lead=(first.getUTCDay()+6)%7;const maxD=Math.max(1,...R0.days.map(r=>r.team));
    main=`<div class="card"><h3>Calendar</h3><div class="cal"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>${'<i></i>'.repeat(lead)}${R0.days.map(r=>`<i class="${r.tg?(r.hit?'hit':r.d<G.today?'miss':''):'off'} ${r.d===G.today?'now':''}" style="--a:${(r.team/maxD).toFixed(2)}" title="${shortDate(r.d)}: ${r.team} DMs${r.tg?' of '+r.tg:''}"><b>${+r.d.slice(8)}</b><small>${r.team||''}</small></i>`).join('')}</div>
     <div class="row tiny muted" style="margin-top:8px"><span><i class="dot" style="background:#3FA57E"></i>target hit</span><span><i class="dot" style="background:#D9485F"></i>missed</span><span>Darker = more DMs</span></div></div>`;
  } else {
    const weeks=[];for(let w=weekStart(a);w<=b;w=addDays(w,7))weeks.push(w);
    const wr=weeks.map(w=>{const s=rangeStats(w,addDays(w,6));return{w,s};});
    main=`<div class="card"><h3>Weekly DMs</h3><small>Stacked by captain; dashed line is the week's target</small><div class="chart" style="margin-top:6px">${svgBars(wr.map(x=>({label:shortDate(x.w),parts:P.map(p=>[x.s.p[p].d,pcolHex(p)]),target:x.s.tgt,title:`Week of ${shortDate(x.w)}: ${x.s.team.d} of ${x.s.tgt}`})),{label:'Weekly DMs',bw:weeks.length>20?14:26,gap:weeks.length>20?6:10})}</div></div>
     <div class="card"><h3>Hit rate and response rate by week</h3><div class="chart" style="margin-top:6px">${svgLines([{vals:wr.map(x=>x.s.wd?Math.round(x.s.hit/x.s.wd*100):null),col:'#3FA57E',name:'Target days hit',fill:true},{vals:wr.map(x=>x.s.team.d?+(x.s.team.r/x.s.team.d*100).toFixed(1):null),col:'#E06034',name:'Response rate'}],wr.map(x=>shortDate(x.w)),{pct:true,max:100,label:'Weekly hit rate and response rate',pw:weeks.length>20?14:36})}</div>
      <div class="row tiny"><span><i class="dot" style="background:#3FA57E"></i>% of working days the target was hit</span><span><i class="dot" style="background:#E06034"></i>responses per DM</span></div></div>`;
  }
  // daily trend with 7-day average (90 days)
  const dl=[];for(let i=89;i>=0;i--)dl.push(addDays(G.today,-i));const dv=dl.map(d=>isWork(d)||G.days[d]?.team?(G.days[d]?.team||0):null);const avg=dv.map((v,i)=>{const w=dv.slice(Math.max(0,i-6),i+1).filter(x=>x!=null);return w.length?+(w.reduce((s,x)=>s+x,0)/w.length).toFixed(1):null;});
  const who=S.view.heatWho||'team';
  const bestDay=bestPeriod(d=>G.days[d]?.team||0,Object.keys(G.days));const wks=[...new Set(Object.keys(G.days).map(weekStart))];const bestWeek=bestPeriod(w=>rangeStats(w,addDays(w,6)).team.d,wks);
  const months=[...new Set(Object.keys(G.days).map(d=>d.slice(0,7)))];const bestMonth=bestPeriod(m=>Object.keys(G.days).filter(d=>d.startsWith(m)).reduce((s,d)=>s+G.days[d].team,0),months);
  return `<div class="pad"><div class="row between"><h2>The Captain's Ledger</h2><button class="btn sm" data-act="csv">Copy CSV</button></div>
  <div class="seg">${[['week','Week'],['month','Month'],['q','12 weeks'],['all','All time']].map(([k,n])=>`<button class="${view===k?'on':''}" data-act="led" data-v="${k}">${n}</button>`).join('')}</div>
  ${nav}
  <div class="kpis">${kpi('Crew DMs',fmtN(T.d),view==='all'?null:delta(T.d,T1.d)+' vs previous',R0.tgt?`target ${fmtN(R0.tgt)} \u00b7 ${pct(T.d,R0.tgt,0)}`:'')}${kpi('Target days hit',R0.wd?`${R0.hit}/${R0.wd}`:'\u2014',null,R0.wd?pct(R0.hit,R0.wd,0):'')}${kpi('Responses',T.r,view==='all'?null:delta(T.r,T1.r),'rate '+pct(T.r,T.d))}${kpi('Video requests',T.v,view==='all'?null:delta(T.v,T1.v))}${kpi('Meetings',T.m,view==='all'?null:delta(T.m,T1.m))}${kpi('Clients',T.c,view==='all'?null:delta(T.c,T1.c),R0.pend?`${R0.pend} awaiting confirmation`:'')}</div>
  ${main}
  <div class="card"><h3>Captain by captain</h3><div style="overflow-x:auto"><table class="lb" style="margin-top:6px"><thead><tr><th></th><th>DMs</th><th>Share</th><th>Resp.</th><th>Resp. rate</th><th>Video</th><th>Meet</th><th>Client</th></tr></thead><tbody>${P.map(p=>{const c=R0.p[p];return `<tr><td style="color:${pcol(p)}">${pname(p)}</td><td>${fmtN(c.d)}</td><td>${pct(c.d,T.d,0)}</td><td>${c.r}</td><td>${pct(c.r,c.d)}</td><td>${c.v}</td><td>${c.m}</td><td>${c.c}</td></tr>`;}).join('')}</tbody></table></div></div>
  <div class="card"><h3>Funnel (${esc(title.toLowerCase())})</h3><div class="funnel">${[['DMs',T.d,'#E06034'],['Responses',T.r,'#7CC7E6'],['Video requests',T.v,'#9B7FD9'],['Meetings',T.m,'#5DBE9C'],['Clients',T.c,'#DDA94D']].map(([n,v,col],i,arr)=>`<div class="fstep"><span class="flab">${n}</span><span class="fbar"><i style="width:${T.d?Math.max(2,v/T.d*100):0}%;background:${col}"></i></span><b class="num">${fmtN(v)}</b><small>${i?pct(v,arr[i-1][1]):''}</small></div>`).join('')}</div>
   <p class="tiny muted">These are activity ratios between independent taps, not tracked prospects, so read them as a pulse check rather than exact conversion rates. Meetings and clients only count once confirmed by your crewmate.</p></div>
  <div class="card"><h3>Daily crew DMs \u00b7 last 90 days</h3><div class="chart" style="margin-top:6px">${svgLines([{vals:dv,col:'#E9B48F',name:'Daily',w:1.4},{vals:avg,col:'#E06034',name:'7-day average',w:2.6,fill:true}],dl.map(d=>shortDate(d)),{target:G.cfg.target,label:'Daily crew DMs with 7-day average',pw:6})}</div>
   <div class="row tiny"><span><i class="dot" style="background:#E9B48F"></i>each working day</span><span><i class="dot" style="background:#E06034"></i>7-day average</span><span>dashed = daily target</span></div></div>
  <div class="card"><div class="row between"><h3>When you send DMs</h3><div class="seg mini">${[['team','Crew'],...P.map(p=>[p,C().players[p]?.name])].map(([k,n])=>`<button class="${who===k?'on':''}" data-act="heatWho" data-w="${k}">${esc(n)}</button>`).join('')}</div></div>${heatmapHtml(a,b,who)}<small>${esc(title)} \u00b7 UK time</small></div>
  <div class="card"><h3>Records</h3><div class="grid3" style="margin-top:6px">${[['Best crew day',bestDay,k=>shortDate(k)],['Best week',bestWeek,k=>'w/c '+shortDate(k)],['Best month',bestMonth,k=>new Date(k+'-01T12:00:00Z').toLocaleDateString('en-GB',{month:'short',year:'numeric',timeZone:'UTC'})]].map(([n,x,f])=>`<div class="stat"><b class="num">${x?fmtN(x.v):'\u2014'}</b><small>${n}${x?' \u00b7 '+f(x.k):''}</small></div>`).join('')}</div></div>
  </div>`;
};
function csvText(){const P=G.P;const ds=Object.keys(G.days).sort();const head=['date','weekday','target','crew_dms',...P.flatMap(p=>KK.map(k=>`${p}_${KINDS[k].short.toLowerCase()}`))];
  return [head.join(','),...ds.map(d=>{const D=G.days[d];return [d,DAYN[wd(d)],D.target||0,D.team,...P.flatMap(p=>KK.map(k=>D.p[p][k]))].join(',');})].join('\n');}

/* ============================== SOUND (synthesised, same family as funnal.co.uk) ============================== */
const SND=(()=>{let ac=null,master=null;let last={};
  function ctx(){if(!S.sound)return null;try{if(!ac){ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=.55;master.connect(ac.destination);}if(ac.state==='suspended')ac.resume();return ac;}catch(e){return null;}}
  function osc(type,f0,f1,dur,vol,when=0){const a=ctx();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type;const t=a.currentTime+when;o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.03);}
  function noise(dur,vol,freq,q=1,when=0,type='lowpass'){const a=ctx();if(!a)return;const n=Math.floor(a.sampleRate*dur);const b=a.createBuffer(1,n,a.sampleRate);const d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);const s=a.createBufferSource();s.buffer=b;const f=a.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;const g=a.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(master);s.start(a.currentTime+when);}
  const thr=(k,ms)=>{const n=performance.now();if(last[k]&&n-last[k]<ms)return false;last[k]=n;return true;};
  return{
    tick(){if(thr('tick',45))osc('sine',2400,1800,.025,.025);},
    pop(){osc('sine',520,880,.07,.09);osc('triangle',1040,1300,.05,.03,.01);},
    tab(){osc('sine',660,660,.06,.06);osc('sine',990,990,.07,.05,.05);},
    open(){osc('sine',380,760,.14,.07);noise(.12,.03,2400,1,0,'bandpass');},
    close(){osc('sine',700,340,.12,.06);},
    success(){[523,659,784,1046].forEach((f,i)=>osc('triangle',f,f,.16,.07,i*.07));},
    coin(){osc('square',1568,1568,.06,.025);osc('square',2093,2093,.12,.025,.05);},
    cannon(){noise(.35,.5,320,.8);osc('sine',140,48,.3,.22);noise(.08,.12,3000,1,0,'highpass');},
    splash(){noise(.4,.18,900,.6,0,'bandpass');},
    horn(){osc('sawtooth',196,190,.9,.05);osc('sawtooth',247,240,.9,.035);osc('sine',98,98,.9,.06);},
    chest(){noise(.15,.1,500,1);[784,988,1175,1568,2093].forEach((f,i)=>osc('triangle',f,f,.22,.06,.12+i*.07));},
    err(){osc('square',180,120,.16,.05);},
    level(){[523,659,784,1046,1318].forEach((f,i)=>osc('triangle',f,f,.2,.07,i*.08));},
    hold(){osc('sine',220,660,.95,.05);},
    unlock(){[1046,1318,1568].forEach((f,i)=>osc('sine',f,f,.25,.06,i*.06));},
  };})();
// remap the game's existing effects onto the new sound set
SFX.d=()=>{SND.cannon();setTimeout(SND.coin,180);};SFX.r=()=>{SND.pop();SND.success();};SFX.v=()=>{SND.success();SND.coin();};SFX.m=()=>{SND.success();SND.chest();};SFX.c=()=>{SND.chest();setTimeout(SND.level,300);};
SFX.no=()=>SND.err();SFX.lvl=()=>SND.level();SFX.ach=()=>SND.unlock();
function tone(f,d=.08,type='sine',vol=.05,when=0){/* legacy calls: soften into the new palette */if(f<300)SND.err();else SND.pop();}
const _openModal=openModal,_closeModal=closeModal;
openModal=function(html){_openModal(html);SND.open();};
closeModal=function(){const was=!$('#modal').hidden;_closeModal();if(was)SND.close();};

/* ============================== TOOLTIPS ON SCENES ============================== */
function setupTips(){
  const tip=document.createElement('div');tip.id='tip';tip.hidden=true;document.body.appendChild(tip);
  const find=(cv,ev)=>{const r=cv.getBoundingClientRect();let x=(ev.clientX-r.left)/r.width*W,y=(ev.clientY-r.top)/r.height*H;if(cv.id==='focusCv'&&S.focusXf){const f=S.focusXf;x=((ev.clientX-r.left)*f.dpr-f.ox)/f.s;y=((ev.clientY-r.top)*f.dpr-f.oy)/f.s;}for(let i=S.hits.length-1;i>=0;i--){const h=S.hits[i];if(x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h)return h;}return null;};
  const show=(h,ev)=>{if(!h){tip.hidden=true;return;}tip.innerHTML=`<b>${esc(h.title)}</b><span>${esc(h.body)}</span>`;tip.hidden=false;const w=Math.min(280,innerWidth-24);tip.style.maxWidth=w+'px';const x=clamp(ev.clientX-w/2,12,innerWidth-w-12),y=ev.clientY-14;tip.style.left=x+'px';tip.style.top=y+'px';tip.classList.toggle('below',y<160);};
  document.addEventListener('pointermove',ev=>{const cv=ev.target.closest&&ev.target.closest('canvas.scene');if(!cv||ev.pointerType==='touch'){if(!tip.hidden&&!S.tipPinned)tip.hidden=true;return;}const h=find(cv,ev);cv.style.cursor=h?(h.act?'pointer':'help'):'default';if(h&&h!==S.tipLast)SND.tick();S.tipLast=h;show(h,ev);});
  document.addEventListener('click',ev=>{const cv=ev.target.closest&&ev.target.closest('canvas.scene');if(!cv){tip.hidden=true;S.tipPinned=false;return;}const h=find(cv,ev);
    if(h&&h.act&&h.act.collect){collectFloat(h.act);tip.hidden=true;return;}
    S.tipPinned=!!h;show(h,ev);if(h)SND.pop();clearTimeout(S.tipT);S.tipT=setTimeout(()=>{tip.hidden=true;S.tipPinned=false;},4200);});
}
async function collectFloat(a){if(!S.me||G.players[S.me].claimed.has(a.collect))return;const g=a.kind==='chest'?25:10;try{await writeDay(S.me,G.today,{bonus:{[a.collect]:{xp:15,g,ts:Date.now()}}});SND.chest();toast(`<b>${a.kind==='chest'?'Treasure!':'A note inside says: "Keep going, captain."'}</b> +15 XP, +${g} ${CN}`);}catch(e){writeFail(e);}}

/* ============================== HARBOUR EVENT PANELS ============================== */
function eventsHtml(){
  const now=Date.now(),T=L(now),D=G.days[G.today];const work=isWork(G.today);let out='';
  // emissary
  const gr=emGrade(D.team);const nx=EMISSARY[gr+1];
  out+=`<div class="ev em" data-act="help" data-h="Emissary flag"><span class="emflag g${gr}"><i></i><b>${['I','II','III','IV','V'][gr]}</b></span><div class="grow"><b>Emissary ${EMISSARY[gr].name}</b><small>DMs worth \u00d7${EMISSARY[gr].mult}${nx?` \u00b7 Grade ${['I','II','III','IV','V'][gr+1]} at ${nx.at} crew DMs (${nx.at-D.team} to go)`:' \u00b7 maximum grade!'}</small></div><span class="q">?</span></div>`;
  if(work){const gt=goldenFor(G.today);const live=T.min>=gt.start&&T.min<gt.end;const done=T.min>=gt.end;const hm2=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
    out+=`<div class="ev gold ${live?'live':''}" data-act="help" data-h="Golden Tide"><span class="sun"></span><div class="grow"><b>${live?'GOLDEN TIDE: everything scores double!':done?'Golden Tide has passed':'Golden Tide today'}</b><small>${live?`ends ${hm2(gt.end)} \u00b7 <span class="cdn" data-t="${londonTs(G.today,gt.end)}"></span> left`:done?`It was ${hm2(gt.start)}\u2013${hm2(gt.end)}. Back tomorrow.`:`A surprise 25 minutes of double XP and doubloons. ${T.min<gt.start-120?'Time revealed at '+hm2(Math.max(0,gt.start-120))+'.':'Starts at '+hm2(gt.start)+'.'}`}</small></div><span class="q">?</span></div>`;}
  const sg=sightingFor(G.today);const ss=sightingState(S.me,sg,now);
  if(ss){const R=ss.rar;const hm2=t=>{const l=L(t);return String(Math.floor(l.min/60)).padStart(2,'0')+':'+String(l.min%60).padStart(2,'0');};
    const show=ss.phase!=='soon'||ss.claimed;
    out+=`<div class="ev pet r-${R} ${ss.phase==='live'?'live':''}"><canvas class="petIco" data-pet="${ss.pet.id}" data-sil="${show?0:1}"></canvas><div class="grow"><b>${ss.claimed?`You caught the ${esc(ss.pet.name)}!`:ss.phase==='soon'?'A pet sighting is coming today':ss.phase==='live'?`${esc(ss.pet.name)} spotted!`:ss.ok?`Claim your ${esc(ss.pet.name)}`:`The ${esc(ss.pet.name)} swam away`}</b>
      <small><span class="rtag">${R}</span> \u00b7 ${ss.phase==='soon'?`Some time between 07:00 and 19:00. Rarer pets give shorter windows.`:ss.phase==='live'?`Log ${ss.need} DMs before ${hm2(ss.end)} (<span class="cdn" data-t="${ss.end}"></span>) \u00b7 ${Math.min(ss.n,ss.need)}/${ss.need}`:ss.claimed?'Now in your pet collection.':ss.ok?`You logged ${ss.n} DMs in the window.`:`Window was ${hm2(ss.start)}\u2013${hm2(ss.end)}. Another sighting tomorrow.`}</small>${ss.phase==='live'&&!ss.claimed?bar(ss.n,ss.need):''}</div>
      ${!ss.claimed&&ss.ok?`<button class="btn sm primary" data-act="claimPet" data-pet="${ss.pet.id}">Claim</button>`:'<span class="q" data-act="help" data-h="Pet sightings">?</span>'}</div>`;}
  return `<div class="events">${out}</div>`;
}
function crewCheckWrap(){const n=G.pendingConf.length;if(!n||!G.cfg.requireConfirm)return '';const mine=G.pendingConf.filter(e=>e.pid!==S.me).length;
  if(S.view.crewHide)return `<button class="crewPill" data-act="crewToggle">Crew check \u00b7 ${n}${mine?` <b>${mine} need you</b>`:''}<span>Show</span></button>`;
  return crewCheckHtml().replace('<small>Rewards land once confirmed</small>','<button class="btn sm ghost" data-act="crewToggle">Hide</button>');}

/* ============================== PETS SCREEN ============================== */
SCREENS.pets=()=>{const me=G.players[S.me];const pl=S.players[S.me]||{};const se=seasonOf(G.today);const got=me.pets;
  const groups=['evergreen','winter','spring','summer','autumn'];
  return `<div class="pad"><div class="row between"><h2>Pet collection</h2><span class="pill">${Object.keys(got).length}/${PETS.length}</span></div>
  <div class="card flat"><p class="tiny" style="margin:0">One pet is sighted every working day between 07:00 and 19:00. Log enough DMs inside its window, then claim it. This season is <b>${se}</b> (until ${shortDate(seasonEnds(G.today))}): ${se} pets and evergreen pets can appear. Seasonal pets return next year.</p>
   <div class="rates">${Object.entries(PET_RARITY).map(([r,x])=>`<span class="r-${r}"><b class="rtag">${r}</b>${x.p}% \u00b7 ${x.win} min \u00b7 ${x.need} DMs</span>`).join('')}</div></div>
  ${groups.map(g=>`<div class="card"><div class="row between"><h3 style="text-transform:capitalize">${g}${g===se?' <span class="pill live">in season</span>':''}</h3></div><div class="petGrid">${PETS.filter(p=>p.season===g).map(p=>{const own=got[p.id];const on=pl.pet===p.id;return `<button class="petCard r-${p.rar} ${own?'':'locked'} ${on?'on':''}" ${own?`data-act="equipPet" data-pet="${p.id}"`:'disabled'}><canvas class="petIco" data-pet="${p.id}" data-sil="${own?0:1}"></canvas><b>${own?esc(p.name):'???'}</b><span class="rtag">${p.rar}</span>${on?'<small>Sailing with you</small>':own?'<small>Tap to bring aboard</small>':''}</button>`;}).join('')}</div></div>`).join('')}</div>`;};

/* ============================== HELP & TOUR ============================== */
SCREENS.help=()=>`<div class="pad"><div class="card hero"><h2>How Hundred Lanterns works</h2><p class="muted" style="margin:6px 0 0">The short version: send a personalised DM, tap DM sent. Together you aim for 100 a day. Everything else (levels, pets, ships, battles) grows out of that.</p><button class="btn primary" style="margin-top:10px" data-act="tour">Play the 30-second tour</button></div>
  ${HELP.map(([h,b])=>`<details class="card help" ${S.view.helpOpen===h?'open':''}><summary><b>${esc(h)}</b></summary><p>${esc(b)}</p></details>`).join('')}</div>`;
const TOUR=[['Welcome aboard','Hundred Lanterns turns Instagram outreach into a pirate game for Sam and James. Every real DM you send, you log here with one tap. Gary the gull will be supervising. Badly.','b_d'],['The DM button','Tap it right after sending each personalised DM. It reloads for 5 seconds, so it can\'t be spammed. Space bar works too.','b_d'],['Bigger moments','Response, Video, Meeting and Client sit above it. Meetings and clients need the prospect\'s name and the other captain\'s confirmation.','b_c'],['Your crew target','Together you aim for 100 DMs a day. Each DM fires at today\'s sea monster on the Harbour. Tap anything in the scene to learn what it is.','tabs'],['Grow your ship','Earn XP and doubloons, unlock cosmetics, collect daily pets and Lock In for focused voyages. The Help page in More explains everything.','tabs']];
function runTour(i=0){const s=TOUR[i];if(!s){try{localStorage.setItem('hl_tour_v4','1')}catch(e){}closeModal();return;}
  document.querySelectorAll('.tourGlow').forEach(e=>e.classList.remove('tourGlow'));const el=document.getElementById(s[2]);if(el)el.classList.add('tourGlow');
  _openModal(`<div class="tour"><span class="pill">${i+1} of ${TOUR.length}</span><h2>${esc(s[0])}</h2><p>${esc(s[1])}</p><div class="row"><button class="btn primary" data-act="tourNext" data-i="${i+1}">${i===TOUR.length-1?'Set sail':'Next'}</button><button class="btn ghost" data-act="tourNext" data-i="99">Skip</button></div></div>`);SND.tab();}

/* ============================== LOCK IN (voyage) ============================== */
SCREENS.lockin=()=>{
  const pl=S.players[S.me]||{};const lk=pl.lock;const me=G.players[S.me];let main;
  if(lk&&lk.s){const el=lockElapsed(lk);const dms=myDmSince(S.me,lk.s);const mins=el/60000;const vb=voyageBoss(lk);const left=Math.max(0,vb.hp-dms);
    main=`<canvas id="scene" class="scene" width="960" height="540" aria-label="Your voyage"></canvas>
    <div class="pad"><div class="card"><div class="row between"><span class="pill">${esc(vb.name)}</span><button class="btn sm" data-act="focusOn">Full screen</button></div><div class="timer" id="lockTimer">${clockStr(lk.dur-el)}</div><p class="muted" style="text-align:center;margin:4px 0 10px">${lk.pausedAt?'Paused':'Every DM fires a cannon and fills your treasure chest. Aim for the face.'}</p>
    <div class="vboss"><small>${esc(vb.desc)}</small>${left?`<div class="hp"><i class="s" style="width:${100-left/vb.hp*100}%"></i><i class="x" style="flex:1"></i><span>${left} / ${vb.hp} HP</span></div>`:`<b class="done">Defeated! +${vb.xp} XP and ${vb.g} doubloons when you land.</b>`}</div>
    <div class="grid3" style="margin-top:10px"><div class="stat"><b class="num">${dms}</b><small>DMs this voyage</small></div><div class="stat"><b class="num" id="lockPace">${mins>0.5?Math.round(dms/mins*60):'\u2014'}</b><small>pace per hour</small></div><div class="stat"><b class="num">${dms*3}</b><small>chest doubloons</small></div><div class="stat"><b class="num">${me.m.bestSession}</b><small>best voyage</small></div></div>
    ${bar(el,lk.dur)}
    <div class="row" style="margin-top:12px;justify-content:center">${lk.pausedAt?`<button class="btn primary" data-act="lockResume">Resume</button>`:`<button class="btn" data-act="lockPause">Pause</button>`}<button class="btn ghost" data-act="lockFinish">Drop anchor early</button><button class="btn ghost" data-act="lockCancel">Abandon</button></div></div></div>`;}
  else{const diff=S.view.lockDiff||'rough';main=`<div class="pad"><div class="card hero"><h2>Lock In voyage</h2><p class="muted" style="margin:4px 0 10px">Set sail into open water. Every DM fires at the monster hunting you and adds 3 doubloons to your chest. Reach Treasure Island when the timer ends. Tap bottles and chests that float past.</p>
    <small>Voyage length</small><div class="seg" style="margin-top:4px">${[[15,'15 min'],[25,'25 min'],[45,'45 min'],[60,'60 min']].map(([m,l])=>`<button class="${S.view.lockDur===m?'on':''}" data-act="lockDur" data-m="${m}">${l}</button>`).join('')}</div>
    <small style="display:block;margin-top:10px">Monster</small><div class="diffs">${Object.entries(VOYAGE_DIFF).map(([k,d])=>`<button class="diff ${diff===k?'on':''}" data-act="lockDiff" data-d="${k}"><b>${d.name}</b><small>${d.desc}</small><small>${Math.max(5,Math.round(S.view.lockDur*d.rate))} HP \u00b7 +${d.xp} XP \u00b7 +${d.g} ${CN}</small></button>`).join('')}</div>
    <div class="row" style="margin-top:12px"><label class="f" for="lockCustom">Custom minutes<input id="lockCustom" type="number" min="5" max="180" placeholder="e.g. 35" style="width:110px"></label><button class="btn primary" data-act="lockStart" style="margin-left:auto;align-self:end">Set sail</button></div></div>
    <div class="grid3"><div class="stat"><b class="num">${me.m.sessions}</b><small>voyages</small></div><div class="stat"><b class="num">${me.m.islands}</b><small>treasure islands</small></div><div class="stat"><b class="num">${me.m.vBoss}</b><small>monsters beaten</small></div></div>
    ${me.sessions.length?`<div class="card"><h3>Ship's log</h3><div class="list" style="margin-top:6px">${[...me.sessions].sort((a,b)=>b.s-a.s).slice(0,5).map(s=>`<div class="li"><span class="grow">${shortDate(s.date)} \u00b7 ${Math.round(s.dur/60000)} min ${s.full?'\u00b7 reached the island':''} ${s.beat?'\u00b7 monster beaten':''}</span><b>${s.dms} DMs</b></div>`).join('')}</div></div>`:''}</div>`;}
  return main+`<div class="pad">${challengesHtml()}</div>`;
};
function focusHtml(){return `<div id="focus" role="dialog" aria-label="Full screen voyage"><canvas id="focusCv" class="scene" width="1280" height="720"></canvas>
  <div class="fTop"><span class="fTimer" id="fTimer">--:--</span><span class="fStat" id="fStat"></span><button class="fExit" data-act="focusOff" aria-label="Exit full screen">\u2715</button></div>
  <button class="fDm" id="fDm" aria-label="DM sent"><span class="dmIcon"><svg class="mk"><use href="#funnal"/></svg><svg class="ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="track"/><circle cx="50" cy="50" r="44" class="prog" id="fRing"/></svg></span><b>DM sent</b><small>click or press space</small></button></div>`;}
function focusOn(){if(S.focus)return;S.focus=true;document.body.insertAdjacentHTML('beforeend',focusHtml());$('#fDm').addEventListener('click',()=>logAction('d',$('#fDm')));const f=$('#focus');try{f.requestFullscreen?.().catch(()=>{});}catch(e){}SND.open();}
function focusOff(){if(!S.focus)return;S.focus=false;try{if(document.fullscreenElement)document.exitFullscreen();}catch(e){}$('#focus')?.remove();SND.close();}
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&S.focus){/* keep overlay; user pressed Esc to leave OS full screen */}});

Object.assign(ACT,{
  help(d){S.view.helpOpen=d.h;location.hash='#help';},
  tour(){runTour(0);},tourNext(d){runTour(+d.i);},
  crewToggle(){S.view.crewHide=!S.view.crewHide;try{localStorage.setItem('hl_crewHide',S.view.crewHide?'1':'0')}catch(e){}render();},
  async claimPet(d){const key='pet_'+G.today;if(G.players[S.me].claimed.has(key))return;const pet=PET_BY_ID[d.pet];try{await writeDay(S.me,G.today,{bonus:{[key]:{pet:d.pet,xp:{common:40,uncommon:60,rare:90,epic:140,legendary:220,mythic:400}[pet.rar],g:{common:10,uncommon:15,rare:25,epic:40,legendary:70,mythic:150}[pet.rar],ts:Date.now()}}});
    SND.chest();openModal(`<div class="reveal r-${pet.rar}"><canvas class="petIco big" data-pet="${pet.id}" data-sil="0"></canvas><span class="rtag">${pet.rar} pet</span><h2>${esc(pet.name)}</h2><p class="muted">It followed you home. You're legally its parent now. Bring it aboard from Ship or Pets.</p><div class="row" style="justify-content:center"><button class="btn primary" data-act="equipPet" data-pet="${pet.id}">Bring aboard</button><button class="btn ghost" data-act="closeModal">Later</button></div></div>`);
    paintPets();if(['legendary','mythic','epic'].includes(pet.rar))fireworks(2600);}catch(e){writeFail(e);}},
  async equipPet(d){closeModal();const cur=(S.players[S.me]||{}).pet;try{await writePlayer(S.me,{pet:cur===d.pet?null:d.pet});SND.pop();}catch(e){writeFail(e);}},
  lockDiff(d){S.view.lockDiff=d.d;render();},
  focusOn(){focusOn();},focusOff(){focusOff();},
  async claimHandle(){const v=($('#handleIn')?.value||'').trim().replace(/[^A-Za-z0-9 _.'-]/g,'').slice(0,20);if(v.length<2)return toast('<b>Pick a handle</b> of 2 to 20 letters or numbers.','joke');if(S.players[S.me]?.handle)return;
    openModal(`<h2>Claim "${esc(v)}"?</h2><p>Handles can only be claimed once and can't be changed afterwards. Both captains may pick the same one.</p><div class="row"><button class="btn primary" data-act="doHandle" data-v="${esc(v)}">Claim it</button><button class="btn ghost" data-act="closeModal">Think again</button></div>`);},
  async doHandle(d){closeModal();try{await writePlayer(S.me,{handle:d.v,handleAt:Date.now()});SND.unlock();toast(`<b>Ahoy, ${esc(d.v)}!</b> The name is set in stone. Well, in a database.`);}catch(e){writeFail(e);}},
});
function paintPets(root=document){root.querySelectorAll('canvas.petIco').forEach(cv=>drawPetIcon(cv,PET_BY_ID[cv.dataset.pet],cv.dataset.sil==='1'));}

/* ============================== v5: launch polish ============================== */
/* ---------- Password gate ---------- */
const PASS={sam:'5831c033631d3eab56b5c9994b9aca427bdfa25ec18f9353cef8fdcaaaddf407',james:'bb5257d7536785a1ca9b6b369e92e428550a87a5ae29c3ba354fb8826664bd2a'};
function sha256js(ascii){// compact fallback for browsers without crypto.subtle
  const rr=(v,a)=>(v>>>a)|(v<<(32-a));const k=[],hh=[];let primes=0;const isC={};for(let c=2;primes<64;c++){if(!isC[c]){for(let i=0;i<313;i+=c)isC[i]=c;hh[primes]=(Math.pow(c,.5)*4294967296)|0;k[primes++]=(Math.pow(c,1/3)*4294967296)|0;}}
  let hash=hh.slice(0,8);const words=[];const bytes=unescape(encodeURIComponent(ascii));const bl=bytes.length*8;let s=bytes+'\x80';while(s.length%64-56)s+='\x00';
  for(let i=0;i<s.length;i++){const j=s.charCodeAt(i);words[i>>2]|=j<<((3-i)%4)*8;}words[words.length]=((bl/4294967296)|0);words[words.length]=bl;
  for(let j=0;j<words.length;){const w=words.slice(j,j+=16);const old=hash;hash=hash.slice(0,8);
    for(let i=0;i<64;i++){const w15=w[i-15],w2=w[i-2];const a=hash[0],e=hash[4];const t1=hash[7]+(rr(e,6)^rr(e,11)^rr(e,25))+((e&hash[5])^(~e&hash[6]))+k[i]+(w[i]=(i<16)?w[i]:(w[i-16]+(rr(w15,7)^rr(w15,18)^(w15>>>3))+w[i-7]+(rr(w2,17)^rr(w2,19)^(w2>>>10)))|0);
      const t2=(rr(a,2)^rr(a,13)^rr(a,22))+((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));hash=[(t1+t2)|0].concat(hash);hash[4]=(hash[4]+t1)|0;hash.length=8;}
    for(let i=0;i<8;i++)hash[i]=(hash[i]+old[i])|0;}
  return hash.map(v=>((v>>>0).toString(16)).padStart(8,'0')).join('');}
async function sha(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}catch(e){return sha256js(s);}}
function gate(){return new Promise(resolve=>{
  let saved=null;try{saved=JSON.parse(localStorage.getItem('hl_auth')||'null');}catch(e){}
  if(saved&&PASS[saved.pid]&&saved.h===PASS[saved.pid])return resolve(saved.pid);
  let pick=null;
  document.body.insertAdjacentHTML('beforeend',`<div id="gate"><div class="gateCard">
    <svg class="gateMark" aria-hidden="true"><use href="#funnal"/></svg><h1>Hundred Lanterns</h1><p class="muted">A Funnal pirate game \u00b7 crew only. Landlubbers, kindly walk the plank.</p>
    <div class="gateWho">${['sam','james'].map(p=>`<button class="gWho" data-p="${p}" type="button"><span class="gAv" style="--c:${p==='sam'?'#E07A34':'#4A7EC2'}">${p==='sam'?'S':'J'}</span>${p==='sam'?'Sam':'James'}</button>`).join('')}</div>
    <form id="gateForm" autocomplete="on"><label class="f" for="gatePw">Password<input id="gatePw" type="password" autocomplete="current-password" placeholder="Pick your captain first" disabled></label>
    <button class="btn primary big" id="gateGo" type="submit" disabled>Board the ship</button></form>
    <small class="muted">Forgotten it? Ask the other captain, then act like you didn't.</small></div></div>`);
  const g=$('#gate');
  g.querySelectorAll('.gWho').forEach(b=>b.addEventListener('click',()=>{pick=b.dataset.p;g.querySelectorAll('.gWho').forEach(x=>x.classList.toggle('on',x===b));const pw=$('#gatePw');pw.disabled=false;pw.placeholder=`${b.dataset.p==='sam'?'Sam':'James'}'s password`;pw.focus();$('#gateGo').disabled=false;SND.pop();}));
  $('#gateForm').addEventListener('submit',async e=>{e.preventDefault();if(!pick)return;const h=await sha(`hl:${pick}:${$('#gatePw').value.trim()}`);
    if(h===PASS[pick]){try{localStorage.setItem('hl_auth',JSON.stringify({pid:pick,h}))}catch(err){}SND.success();g.classList.add('out');setTimeout(()=>{g.remove();resolve(pick);},420);}
    else{SND.err();const c=g.querySelector('.gateCard');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');$('#gatePw').value='';$('#gatePw').placeholder=WRONG_PW[Math.floor(Math.random()*WRONG_PW.length)];}});
});}

/* ---------- Harbour: calmer layout, details on tap ---------- */
function statusChips(){const now=Date.now(),T=L(now),D=G.days[G.today];const gr=emGrade(D.team);let out=`<button class="sChip em g${gr}" data-act="evInfo"><span class="emflag g${gr}"><i></i><b>${['I','II','III','IV','V'][gr]}</b></span><span>\u00d7${EMISSARY[gr].mult}</span></button>`;
  if(isWork(G.today)){const gt=goldenFor(G.today);const live=T.min>=gt.start&&T.min<gt.end;const hm2=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
    out+=`<button class="sChip gold ${live?'live':''}" data-act="evInfo"><span class="sun sm"></span><span>${live?'Golden Tide!':T.min>=gt.end?'Tide passed':T.min<gt.start-120?'Golden Tide later':'Gold '+hm2(gt.start)}</span></button>`;}
  const ss=sightingState(S.me,sightingFor(G.today),now);
  if(ss){const lab=ss.claimed?'Pet caught':ss.phase==='soon'?'Pet sighting later':ss.phase==='live'?`${ss.rar} pet ${Math.min(ss.n,ss.need)}/${ss.need}`:ss.ok?'Claim pet!':'Pet gone';
    out+=`<button class="sChip pet r-${ss.rar} ${ss.phase==='live'?'live':''} ${ss.ok&&!ss.claimed?'claim':''}" data-act="${ss.ok&&!ss.claimed?'claimPet':'evInfo'}" data-pet="${ss.pet.id}"><canvas class="petIco xs" data-pet="${ss.pet.id}" data-sil="${ss.phase==='soon'&&!ss.claimed?1:0}"></canvas><span>${esc(lab)}</span></button>`;}
  return `<div class="chipsRow">${out}</div>`;}
SCREENS.harbour=()=>{
  const D=G.days[G.today],P=G.P,tgt=D.target,team=D.team,won=tgt>0&&team>=tgt,hp=Math.max(0,tgt-team),boss=D.boss,mod=D.mod;
  const seg=p=>tgt?clamp(D.p[p].d/Math.max(tgt,team)*100,0,100):0;const ms=[125,150,200].find(m=>team<m);const W=G.weeks[weekStart(G.today)];
  const rem=reminder();const mer=merchantToday(G.today);const act=P.flatMap(p=>activeForfeitsFor(p).map(f=>({...f,p})));const yd=G.workdays.filter(d=>d<G.today).pop();
  const sumK=k=>P.reduce((a,p)=>a+D.p[p][k],0);
  return `<canvas id="scene" class="scene" width="960" height="540" aria-label="Funnal Cove harbour and today's sea foe. Tap anything for details."></canvas>
  <div class="pad">
   ${statusChips()}
   ${crewCheckWrap()}
   ${rem?`<div class="remind"><span class="name">Gary the gull</span><canvas class="gull" id="gullIco"></canvas><div>${esc(rem)}</div><button class="btn sm ghost" data-act="nextReminder" aria-label="Another reminder">Next</button></div>`:''}
   <div class="card mission">
    ${tgt>0?`<div class="bossTop"><div><small>Today's sea foe</small><div class="bossName ${boss.rare?'rare':''}">${esc(boss.name)}${boss.rare?' <span class="pill" style="color:var(--r-legendary)">Rare</span>':''}</div></div><b class="score num">${team}<small> / ${tgt}</small></b></div>
    <div class="hp" role="img" aria-label="${hp} HP left">${P.map(p=>`<i class="${p===P[0]?'s':'j'}" style="width:${seg(p)}%"></i>`).join('')}<i class="x" style="flex:1"></i><span>${won?'Sunk!':hp+' HP'}</span></div>
    <div class="contrib">${P.map(p=>`<span><i class="dot" style="background:${pcol(p)}"></i>${pname(p)} <b class="num">${D.p[p].d}</b>${absent(p,G.today)?' <small>(away)</small>':''}</span>`).join('')}<span class="pill" id="timeLeft">${timeLeftStr()}</span></div>
    <details class="more"><summary>Battle details</summary><div class="moreBody">
     <div class="speech withName"><span class="who2">${esc(boss.name.split(' ').slice(-1)[0])}</span>${esc(phaseLine(boss,hp/tgt,won))}</div>
     <p class="tiny muted">Sink it to earn +100 XP and 30 ${CN} each. ${won&&ms?`Stretch goal: ${team}/${ms}.`:!won?`Next phase at ${[75,50,25].find(x=>hp>x)??0} HP.`:'Every stretch goal smashed.'}</p>
     <div class="twist"><b>${esc(mod.name)}</b><span>${esc(mod.desc)}</span></div></div></details>`
    :`<h2>No battle today</h2><p class="muted" style="margin:0">${isWork(G.today)?'Everyone is away. Rest up.':'Not a working day. Anything you log still counts towards your totals.'}</p>`}
   </div>
   <div class="card week"><div class="row between"><small>Today</small>${W&&W.hp?`<small>Weekly boss \u00b7 ${esc(W.boss.name)}</small>`:''}</div>
    <div class="miniStats">${['r','v','m','c'].map(k=>`<div><b class="num">${sumK(k)}</b><small>${KINDS[k].short}s</small></div>`).join('')}</div>
    ${W&&W.hp?`${bar(W.dmg,W.hp,'team')}<small class="tiny">${W.done?'Weekly boss sunk! +400 XP and 120 '+CN+' each.':`${fmtN(W.dmg)} of ${fmtN(W.hp)} this week`}</small>`:''}</div>
   <div class="links">
    ${act.length?`<a class="linkRow warn" href="#herald"><span>${act.length} active forfeit${act.length>1?'s':''}</span><span class="chev">\u203a</span></a>`:''}
    ${mer?`<a class="linkRow" href="#shop"><span>Pell's barge is in port with rare stock</span><span class="chev">\u203a</span></a>`:''}
    ${yd?`<a class="linkRow paperRow" href="#herald"><span><small>The Salty Herald</small>${esc(herald(yd).head)}</span><span class="chev">\u203a</span></a>`:''}
   </div>
  </div>`;
};

/* ---------- Achievement book: overview, collections, details on tap ---------- */
const CAT_COL={Outreach:'#E06034',Responses:'#7CC7E6',Videos:'#9B7FD9',Meetings:'#5DBE9C',Clients:'#DDA94D',Daily:'#F08C9C',Consistency:'#3FA57E',Team:'#4A7EC2',Focus:'#486790',Treasure:'#E2AE45',Battles:'#C91E36',Rivalry:'#9B5DE5',Progress:'#3F5160',World:'#8CC665',Companion:'#5FBF5A',Forfeits:'#B9AE98',Quests:'#C9654A',Style:'#E0457B',Pets:'#F2A33A',Secret:'#7F8A95'};
function achCompact(a,me){const un=me.unlocked[a.id];const secret=a.secret&&!un;const prog=Math.min(me.m[a.metric]||0,a.target);
  return `<button class="achC r-${a.rar} ${un?'got':''} ${secret?'secret':''}" data-act="achInfo" data-id="${a.id}"><span class="medal">${secret?'?':un?'\u2605':a.tier?a.tier[0]:'\u2022'}</span><span class="achT"><b>${secret?'Hidden':esc(a.name)}</b>${un?`<small class="rtag">${a.rar}</small>`:secret?'<small>Secret</small>':`<span class="miniBar"><i style="width:${clamp(prog/a.target*100,0,100)}%"></i></span>`}</span></button>`;}
SCREENS.book=()=>{
  const pid=S.view.bookP||S.me;const me=G.players[pid];const cat=S.view.bookCat;const cats=[...new Set(ACHIEVEMENTS.map(a=>a.cat))];
  const head=`<div class="row between"><h2>${cat?`<button class="iconBtn" data-act="bookCat" data-c="" aria-label="Back">\u2039</button> ${esc(cat)}`:'Achievements'}</h2><div class="seg mini">${G.P.map(p=>`<button class="${p===pid?'on':''}" data-act="bookP" data-p="${p}">${pname(p)}</button>`).join('')}</div></div>`;
  if(cat){const list=ACHIEVEMENTS.filter(a=>a.cat===cat).sort((a,b)=>(!!me.unlocked[b.id]-!!me.unlocked[a.id])||((me.m[b.metric]||0)/b.target-(me.m[a.metric]||0)/a.target));
    return `<div class="pad">${head}<div class="achList">${list.map(a=>achCompact(a,me)).join('')}</div><p class="tiny muted">Tap any achievement for its details and reward.</p></div>`;}
  const total=ACHIEVEMENTS.length,got=Object.keys(me.unlocked).length;const pc=got/total;const R=34,Cc=2*Math.PI*R;
  const near=ACHIEVEMENTS.filter(a=>!me.unlocked[a.id]&&!a.secret&&(me.m[a.metric]||0)>0).sort((a,b)=>(me.m[b.metric]||0)/b.target-(me.m[a.metric]||0)/a.target).slice(0,4);
  const ach=S.players[pid]?.ach||{};const recent=Object.keys(me.unlocked).filter(id=>ach[id]).sort((a,b)=>ach[b]-ach[a]).slice(0,4).map(id=>ACH_BY_ID[id]).filter(Boolean);
  return `<div class="pad">${head}
   <div class="card bookHero"><svg viewBox="0 0 80 80" class="ring2" aria-hidden="true"><circle cx="40" cy="40" r="${R}" class="t"/><circle cx="40" cy="40" r="${R}" class="p" style="stroke-dasharray:${Cc};stroke-dashoffset:${Cc*(1-pc)}"/></svg><div class="ringTxt"><b class="num">${got}</b><small>of ${total}</small></div>
    <div class="rars">${RARITIES.map(r=>{const t=ACHIEVEMENTS.filter(a=>a.rar===r).length,u=ACHIEVEMENTS.filter(a=>a.rar===r&&me.unlocked[a.id]).length;return `<div class="r-${r}"><span class="rtag">${r}</span><span class="miniBar"><i style="width:${u/t*100}%"></i></span><small class="num">${u}/${t}</small></div>`;}).join('')}</div></div>
   ${near.length?`<div class="card"><h3>Almost there</h3><div class="achList" style="margin-top:8px">${near.map(a=>achCompact(a,me)).join('')}</div></div>`:''}
   ${recent.length?`<div class="card"><h3>Recently earned</h3><div class="achList" style="margin-top:8px">${recent.map(a=>achCompact(a,me)).join('')}</div></div>`:''}
   <div class="card"><h3>Collections</h3><div class="cats">${cats.map(c=>{const l=ACHIEVEMENTS.filter(a=>a.cat===c);const u=l.filter(a=>me.unlocked[a.id]).length;return `<button class="catRow" data-act="bookCat" data-c="${esc(c)}"><span class="catDot" style="background:${CAT_COL[c]||'#7F8A95'}">${esc(c[0])}</span><span class="grow"><b>${esc(c)}</b><span class="miniBar"><i style="width:${u/l.length*100}%;background:${CAT_COL[c]||'#7F8A95'}"></i></span></span><small class="num">${u}/${l.length}</small><span class="chev">\u203a</span></button>`;}).join('')}</div></div></div>`;
};
Object.assign(ACT,{
  bookCat(d){S.view.bookCat=d.c||null;render();$('#screen').scrollTop=0;},
  evInfo(){openModal(`<h2>Today at sea</h2>${eventsHtml()}<div class="row"><a class="btn" href="#help">How it all works</a><button class="btn ghost" data-act="closeModal">Close</button></div>`);paintPets($('#modal'));},
  async logout(){try{localStorage.removeItem('hl_auth')}catch(e){}if(S.sb){try{await S.sb.auth.signOut();}catch(e){}}location.reload();},
});

/* ============================== SUPABASE STORE (used when hosted on funnal.co.uk) ============================== */
// Mirrors the small slice of the artifact db API the game uses: doc().get/set/update/delete/acquire/onSnapshot, collection().doc/onSnapshot.
const HL_EMAIL={sam:'sam@funnal.co.uk',james:'james@funnal.co.uk'};
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
  try{const {data}=await sb.auth.getSession();const em=data?.session?.user?.email;const pid=Object.keys(HL_EMAIL).find(p=>HL_EMAIL[p]===em);if(pid)return{pid,uid:data.session.user.id};}catch(e){}
  return new Promise(resolve=>{
    let pick=null;
    document.body.insertAdjacentHTML('beforeend',`<div id="gate"><div class="gateCard">
      <svg class="gateMark" aria-hidden="true"><use href="#funnal"/></svg><h1>Hundred Lanterns</h1><p class="muted">A Funnal pirate game \u00b7 crew only. Landlubbers, kindly walk the plank.</p>
      <div class="gateWho">${['sam','james'].map(p=>`<button class="gWho" data-p="${p}" type="button"><span class="gAv" style="--c:${p==='sam'?'#E07A34':'#4A7EC2'}">${p==='sam'?'S':'J'}</span>${p==='sam'?'Sam':'James'}</button>`).join('')}</div>
      <form id="gateForm" autocomplete="on"><input type="email" id="gateEm" autocomplete="username" hidden><label class="f" for="gatePw">Password<input id="gatePw" type="password" autocomplete="current-password" placeholder="Pick your captain first" disabled></label>
      <button class="btn primary big" id="gateGo" type="submit" disabled>Board the ship</button></form>
      <small class="muted" id="gateMsg">Forgotten it? Ask the other captain, then act like you didn't.</small></div></div>`);
    const g=$('#gate');
    g.querySelectorAll('.gWho').forEach(b=>b.addEventListener('click',()=>{pick=b.dataset.p;$('#gateEm').value=HL_EMAIL[pick];g.querySelectorAll('.gWho').forEach(x=>x.classList.toggle('on',x===b));const pw=$('#gatePw');pw.disabled=false;pw.placeholder=`${b.textContent.trim()}'s password`;pw.focus();$('#gateGo').disabled=false;SND.pop();}));
    $('#gateForm').addEventListener('submit',async e=>{e.preventDefault();if(!pick)return;$('#gateGo').disabled=true;
      const {data,error}=await sb.auth.signInWithPassword({email:HL_EMAIL[pick],password:$('#gatePw').value.trim()});$('#gateGo').disabled=false;
      if(!error&&data?.user){SND.success();g.classList.add('out');setTimeout(()=>{g.remove();resolve({pid:pick,uid:data.user.id});},420);}
      else{SND.err();const c=g.querySelector('.gateCard');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');$('#gatePw').value='';$('#gatePw').placeholder=/fetch|network/i.test(error?.message||'')?'No connection. Check your internet.':WRONG_PW[Math.floor(Math.random()*WRONG_PW.length)];}});
  });
}

/* ============================== RENDER LOOP ============================== */
let renderQueued=false;
function refresh(force){if(force){G=derive();afterDerive();render();return;}if(renderQueued)return;renderQueued=true;requestAnimationFrame(()=>{renderQueued=false;G=derive();afterDerive();render();});}
function render(){
  if(!G)return;hud();
  const ae=document.activeElement;const typing=ae&&$('#screen').contains(ae)&&/INPUT|SELECT|TEXTAREA/.test(ae.tagName)&&ae.type!=='checkbox';
  if(typing&&S.lastScreen===S.screen)return;
  const fn=S.me?(SCREENS[S.screen]||SCREENS.harbour):SCREENS.harbour;const sc=$('#screen');sc.innerHTML=fn();S.lastScreen=S.screen;
  if(S.screen==='book'){const sel=$('#bookFilter');if(sel)sel.value=S.view.book;}
  sc.querySelectorAll('canvas.icon').forEach(cv=>drawItemIcon(cv,cv.dataset.id));paintPets(sc);
  sc.querySelectorAll('canvas.collect').forEach(cv=>drawCollectIcon(cv,COLLECTIBLES.find(x=>x.id===cv.dataset.c),cv.dataset.f==='1'));
  const gi=$('#gullIco');if(gi)drawGullIcon(gi);
  document.querySelectorAll('#tabs a').forEach(a=>a.classList.toggle('on',a.dataset.s===S.screen||(a.dataset.s==='more'&&['book','rivals','herald','ledger','settings','log','pets','help'].includes(S.screen))));
}
function hud(){
  const me=S.me&&G.players[S.me];if(!me)return;
  $('#whoName').textContent=C().players[S.me]?.name||S.me;$('#whoName').style.color=pcol(S.me);
  const tf=activeForfeitsFor(S.me).find(f=>f.result==='title');$('#whoTitle').textContent=(me.prest?'\u2605'.repeat(Math.min(me.prest,5))+' ':'')+(tf?'Professional Napper':titleFor(me.li.level));
  $('#lvlNum').textContent=me.li.level;$('#xpFill').style.width=me.li.need?(me.li.into/me.li.need*100)+'%':'100%';$('#xpTxt').textContent=me.li.need?`${fmtN(me.li.into)} / ${fmtN(me.li.need)} XP`:'MAX LEVEL';
  $('#glowNum').textContent=fmtN(me.balance);$('#myToday').textContent=G.days[G.today].p[S.me].d;
  const av=$('#whoAv');const key=S.me+JSON.stringify([S.players[S.me]?.hat,S.players[S.me]?.coat,activeForfeitsFor(S.me).length]);if(av.dataset.k!==key){av.dataset.k=key;av.style.backgroundImage=`url(${avatarCanvas(S.me)})`;}
  av.style.boxShadow=`0 0 0 3px ${pcolHex(S.me)}`;
}
function afterDerive(){
  if(!G||!S.me)return;if(!(S.loaded.config&&S.loaded.days&&S.loaded.players)){S.lastG=null;return;}const me=G.players[S.me];const prev=S.lastG;const D=G.days[G.today];
  // record achievement unlock dates for me (write once)
  const rec=(S.players[S.me]||{}).ach||{};const fresh=Object.keys(me.unlocked).filter(id=>!rec[id]&&!(S.achWritten||{})[id]);
  if(fresh.length&&S.loaded.players&&S.loaded.days&&!S.readOnly){S.achWritten=S.achWritten||{};const patch={};const now=Date.now();fresh.forEach(id=>{patch[id]=now;S.achWritten[id]=1;});writePlayer(S.me,{ach:patch}).catch(writeFail);
    if(!S.firstDerive){const sorted=fresh.map(id=>ACH_BY_ID[id]).sort((a,b)=>RARITIES.indexOf(b.rar)-RARITIES.indexOf(a.rar));sorted.slice(0,3).forEach(a=>toast(`<span class="rtag r-${a.rar}" style="color:var(--rc)">${a.rar} achievement</span><br><b>${esc(a.name)}</b> <small>+${RARITY_GLOW[a.rar]} ${CN} \u00b7 ${pick(ACH_QUIPS,a.id)}</small>`,'',4200));SFX.ach();
      const big=sorted.find(a=>RARITIES.indexOf(a.rar)>=3);if(big){banner(big.name.toUpperCase(),`${big.rar[0].toUpperCase()+big.rar.slice(1)} achievement unlocked`);fireworks(2200);}}}
  if(prev&&!S.firstDerive){
    const pm=prev.players[S.me];if(me.li.level>pm.li.level&&me.prest===pm.prest){banner(`LEVEL ${me.li.level}`,`${titleFor(me.li.level)} \u00b7 ${pick(LEVEL_QUIPS,me.li.level)}`);SFX.lvl();const unl=ITEMS.filter(i=>i.lvl>pm.li.level&&i.lvl<=me.li.level);if(unl.length)toast(`<b>New in the shop:</b> ${unl.map(i=>esc(i.name)).join(', ')}`,'',4500);}
    const newTrack=TRACK.filter(i=>i.track>pm.maxLevel&&i.track<=me.maxLevel);if(newTrack.length){setTimeout(()=>{banner('REWARD UNLOCKED',newTrack.map(i=>i.name).join(', '));fireworks(1800);},2800);}
    ['m','c'].forEach(k=>{if(me.counts[k]>pm.counts[k]){const btn=$('#b_'+k);if(btn)celebrate(k,btn);toast(`<b>${pname(other(S.me))} confirmed your ${k==='c'?'client':'meeting'}!</b> +${KINDS[k].xp} XP`,'',4000);}});
    if(me.moth>pm.moth)toast(`<b>Your companion evolved!</b> It's now a ${esc(MOTH_STAGES[me.moth].name)}.`,'',4500);
    const nl=Object.keys(me.loot).filter(k=>!pm.loot[k]);nl.forEach(k=>{const c=COLLECTIBLES.find(x=>x.id===k);toast(`<b>Loot!</b> You found a ${esc(c.rar)} ${esc(c.name)}.`,'',3800);});
    const pD=prev.days[G.today];
    if(pD&&D.target){if(!pD.hit&&D.hit){banner('FOG DEFEATED',`${D.boss.name} is gone. Final blow: ${C().players[D.blow]?.name}`);fireworks(3000);SFX.c();}
      [125,150,200].forEach(m=>{if(pD.team<m&&D.team>=m&&D.hit)toast(`<b>Stretch goal ${m} reached!</b> Bonus XP and doubloons for both captains.`,'',3500);});
      const ph=r=>r<=.25?3:r<=.5?2:r<=.75?1:0;const a=ph((pD.target-pD.team)/pD.target),b=ph((D.target-D.team)/D.target);if(b>a&&!D.hit&&S.screen==='harbour')toast(`<b>${esc(D.boss.name)}:</b> "${esc(phaseLine(D.boss,(D.target-D.team)/D.target,false))}"`,'',3800);
      if(D.over.length>pD.over.length){const o=D.over[D.over.length-1];toast(`<b>Lead change!</b> ${pname(o.who)} overtakes ${pname(other(o.who))}.`,'',3000);}}
    const o=other(S.me);if(o&&G.players[o]&&prev.players[o]){const dd=G.players[o].counts.d-prev.players[o].counts.d;for(let i=0;i<Math.min(dd,3);i++)launchLantern(o);
      ['r','v','m','c'].forEach(k=>{if(G.players[o].counts[k]>prev.players[o].counts[k]){toast(`<b>${pname(o)}</b> logged: ${esc(KINDS[k].name)}!`,'',3200);if(k==='c'){banner('NEW CLIENT!',`${C().players[o]?.name} landed one`);fireworks(3000);}}});}
    {const T=L(),gt=goldenFor(G.today);const ws=isWork(G.today)&&T.min>=gt.start&&T.min<gt.end;if(ws&&!S.goldenShown){S.goldenShown=G.today;banner('GOLDEN TIDE','25 minutes of double XP and doubloons');SND.horn();}if(!ws)S.goldenShown=null;}
    {const sg=sightingFor(G.today);const ss=sightingState(S.me,sg);if(ss&&ss.phase==='live'&&S.sightShown!==G.today){S.sightShown=G.today;banner(ss.pet.rar.toUpperCase()+' PET SPOTTED',`${ss.pet.name}: log ${ss.need} DMs in ${ss.win} minutes`);SND.horn();}
     if(ss&&ss.phase==='live'&&!ss.claimed&&ss.ok&&S.sightOk!==G.today){S.sightOk=G.today;toast(`<b>You've done it!</b> Claim your ${esc(ss.pet.name)} on the Harbour.`,'',6000);SND.unlock();}}
    {const pD=prev.days[G.today];if(pD&&emGrade(D.team)>emGrade(pD.team)){const g=emGrade(D.team);banner('EMISSARY '+EMISSARY[g].name.toUpperCase(),`DMs now worth \u00d7${EMISSARY[g].mult}`);SND.unlock();}}
    G.pendingConf.filter(e=>e.pid!==S.me&&!prev.pendingConf.some(x=>x.id===e.id)).forEach(e=>{toast(`<b>${pname(e.pid)} logged a ${e.k==='c'?'new client':'meeting request'}!</b> Confirm it on the Harbour.`,'',6000);tone(660,.1,'triangle',.05);});
    G.chals.forEach(ch=>{const p0=prev.chals.find(x=>x.id===ch.id);if(!p0&&ch.state==='pending'&&ch.c.by!==S.me)toast(`<b>${pname(ch.c.by)} challenges you!</b> Open Lock In to accept.`,'',6000);});
    G.chals.forEach(ch=>{const p=prev.chals.find(x=>x.id===ch.id);if(p&&p.state!==ch.state){if(ch.state==='live'){banner('GO!','Challenge started');tone(880,.2);}if(ch.state==='done'){const w=G.P.find(x=>ch.won[x]);banner(ch.coop?(ch.won[G.P[0]]?'CHALLENGE WON':'SO CLOSE'):(w?`${(C().players[w]?.name||'').toUpperCase()} WINS`:'DRAW'),`${G.P.map(x=>ch.cnt[x]).join(' \u2013 ')}`);}}
      if(false)toast(`<b>${pname(ch.c.by)} challenges you!</b> Open Lock In to accept.`,'',6000);});
  }
  if(S.firstDerive){let seen=null;try{seen=localStorage.getItem('hl_tour_v4')}catch(e){}if(!seen&&$('#modal').hidden)setTimeout(()=>runTour(0),900);}
  S.lastG=G;S.firstDerive=false;
}
function tick(){
  if(!G)return;const now=Date.now();
  // cooldown ring
  const btn=$('#b_d'),ring=$('#cdRing');const cd=C().cooldownSec*1000;const left=S.cdUntil-now;
  if(left>0){btn.classList.add('cooling');ring.style.strokeDashoffset=String(277*(1-left/Math.max(cd,S.cdUntil-S.cdStart)));$('#dmSub').textContent=`${S.quip||'reloading'} \u00b7 ${Math.ceil(left/1000)}s`;}
  else if(btn.classList.contains('cooling')){btn.classList.remove('cooling');ring.style.strokeDashoffset='277';$('#dmSub').textContent='tap after each DM';tone(1320,.05,'triangle',.03);}
  const fr=$('#fRing');if(fr){fr.style.strokeDashoffset=left>0?String(277*(1-left/Math.max(cd,S.cdUntil-S.cdStart))):'277';$('#fDm').classList.toggle('cooling',left>0);}
  if(S.focus){const lk=S.players[S.me]?.lock;if(!lk){focusOff();}else{const el=lockElapsed(lk);$('#fTimer').textContent=clockStr(lk.dur-el);const dms=myDmSince(S.me,lk.s);const vb=voyageBoss(lk);$('#fStat').textContent=`${dms} DMs \u00b7 ${Math.max(0,vb.hp-dms)?Math.max(0,vb.hp-dms)+' HP left on the monster':'monster beaten!'} \u00b7 chest ${dms*3}`;}}
  const tl=$('#timeLeft');if(tl)tl.textContent=timeLeftStr();
  document.querySelectorAll('.cdn').forEach(el=>{const t=+el.dataset.t;el.textContent=t-now>60000?clockStr(t-now):Math.max(0,Math.ceil((t-now)/1000))+'s';});
  const lk=S.players[S.me]?.lock;if(lk&&lk.s){const el=lockElapsed(lk);const lt=$('#lockTimer');if(lt)lt.textContent=clockStr(lk.dur-el);if(el>=lk.dur&&!S.finishing)finishLock(false);}
  // re-derive when day rolls over or challenge state changes
  const T=L(now);if(T.date!==G.today||G.chals.some(c=>(c.state==='countdown'&&now>=c.start)||(c.state==='live'&&now>=c.end)))refresh();
  // final warning
  const cfg=C();if(isWork(T.date)&&T.min===hm(cfg.finalWarning)&&S.warned!==T.date){S.warned=T.date;const D=G.days[G.today];if(D.target&&!D.hit){toast(`<b>Final warning!</b> ${D.target-D.team} DMs to go. ${esc(pick(REMINDERS.deadline,T.date))}`.replace('{left}',D.target-D.team).replace('{mins}',hm(cfg.dayEnd)-T.min),'joke',9000);tone(220,.3,'sawtooth',.05);}}
}
let lastFrame=0;
function frame(t){requestAnimationFrame(frame);if(t-lastFrame<40)return;lastFrame=t;if(!G)return;S.hits=[];
  if(S.focus){const fc=$('#focusCv');const lk=S.players[S.me]?.lock;if(fc&&lk){const dpr=Math.min(2,devicePixelRatio||1);const w=Math.round(innerWidth*dpr),h=Math.round(innerHeight*dpr);if(fc.width!==w||fc.height!==h){fc.width=w;fc.height=h;}
    const c=fc.getContext('2d');const s=Math.max(w/W,Math.min(h/H,w/W*1.25));const oy=(h-H*s)/2,ox=(w-W*s)/2;c.setTransform(1,0,0,1,0,0);c.fillStyle=skyMode()==='dusk'?'#34437A':'#6CC0EC';c.fillRect(0,0,w,h/2);c.fillStyle='#3DA4C6';c.fillRect(0,h/2,w,h/2);
    c.setTransform(s,0,0,s,ox,oy);drawVoyage(c,t,lk,myDmSince(S.me,lk.s),Math.min(1,lockElapsed(lk)/lk.dur));S.focusXf={s,ox,oy,dpr};}return;}
  const cv=$('#scene');if(!cv)return;const c=prep(cv);
  try{if(S.screen==='harbour')drawHarbour(c,t);else if(S.screen==='ship'){if((S.view.shipMode||'ship')==='ship')drawShipScene(c,t,S.view.islet||S.me);else drawIslet(c,t,S.view.islet||S.me);}else if(S.screen==='lockin'){const lk=S.players[S.me]?.lock;if(lk)drawVoyage(c,t,lk,myDmSince(S.me,lk.s),Math.min(1,lockElapsed(lk)/lk.dur));}}catch(e){console.error(e);}}

/* ============================== IDENTITY ============================== */
function askWho(){if(S.authPid){resolveMe();return;}
  const P=C().playerIds;
  openModal(`<h2>Who's keeping the lantern?</h2><p class="muted">${S.mode==='local'?'Practice mode: pick a keeper. You can switch in Settings.':'Choose your keeper. This links your account to them, so it can only be done once per keeper.'}</p>
  <div class="grid2">${P.map(p=>{const taken=S.mode!=='local'&&S.players[p]?.uid&&S.players[p].uid!==S.uid;return `<button class="btn ${taken?'':'primary'}" data-act="claimKeeper" data-p="${p}" ${taken?'disabled':''} style="padding:16px;font-size:18px">${pname(p)}${taken?'<br><small>taken</small>':''}</button>`;}).join('')}</div>`);
}
async function claimKeeper(p){
  if(S.mode==='local'){S.me=p;closeModal();refresh(true);return;}
  try{const ref=S.db.doc('players/'+p);const lease=await ref.acquire({holder:S.uid,ttlMs:5000});if(!lease.acquired)return toast('Someone is claiming that keeper right now. Try again in a few seconds.','joke');
    const s=await ref.get();const d=s.exists?s.data():null;if(d&&d.uid&&d.uid!==S.uid){toast('That keeper is already taken.','joke');return askWho();}
    if(s.exists)await ref.update({uid:S.uid});else await ref.set({pid:p,uid:S.uid,decor:[],ach:{}});S.me=p;closeModal();refresh(true);banner(`WELCOME ABOARD, ${(C().players[p]?.name||p).toUpperCase()}`,'Your ship is ready');
  }catch(e){writeFail(e);}
}
function resolveMe(){
  if(!S.authPid)return;
  if(S.mode==='local'||S.mode==='supa'){S.me=S.authPid;return;}
  if(!S.loaded.players)return;
  const pl=S.players[S.authPid]||{};
  if(pl.uid&&pl.uid===S.uid){if(S.me!==S.authPid){S.me=S.authPid;refresh();}return;}
  if(!pl.uid){if(!S.claiming){S.claiming=true;claimKeeper(S.authPid).finally(()=>{S.claiming=false;});}return;}
  S.me=null;if($('#modal').hidden)openModal(`<h2>Captain ${pname(S.authPid)} is linked to another account</h2><p>Each captain is tied to one Claude account. If that's you on a different account, ask the game owner to release this captain in Settings, then reload.</p><button class="btn" data-act="logout">Use a different captain</button>`);
}
/* ============================== BOOT ============================== */
function route(){let h=(location.hash||'#harbour').slice(1);if(h==='islet')h='ship';S.screen=SCREENS[h]?h:'harbour';closeModal();refresh(true);$('#screen').scrollTop=0;}
function bindUI(){
  document.querySelectorAll('.act,.dm').forEach(b=>b.addEventListener('click',()=>logAction(b.dataset.k,b)));
  $('#undo').addEventListener('click',undo);
  $('#who').addEventListener('click',()=>{location.hash='#ship';});
  $('#glowBox').addEventListener('click',()=>{location.hash='#shop';});
  document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.tagName==='SELECT')return;if(el.tagName==='INPUT'&&el.type==='checkbox'){ACT[el.dataset.act]?.(el.dataset,el);return;}const fn=ACT[el.dataset.act];if(fn){e.preventDefault();fn(el.dataset,el);}});
  document.addEventListener('change',e=>{const el=e.target;if(el.id==='bookFilter'){S.view.book=el.value;el.blur();render();}});
  $('#modal').addEventListener('click',e=>{if(e.target.id==='modal'&&!WHEEL.spinning&&S.me)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modal').hidden&&S.me)closeModal();if(S.focus&&(e.key===' '||e.code==='Space')){e.preventDefault();logAction('d',$('#fDm'));return;}if(e.key==='Escape'&&S.focus){focusOff();return;}if((e.key===' '||e.key==='Enter')&&e.target===document.body){e.preventDefault();logAction('d',$('#b_d'));}});
  window.addEventListener('hashchange',()=>{SND.tab();const tp=$('#tip');if(tp)tp.hidden=true;route();});
  document.addEventListener('pointerdown',e=>{const el=e.target.closest('button,a,.chip,summary');if(!el||el.closest('#actions')||el.id==='fDm'||el.id==='holdBtn')return;SND.pop();el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');},true);
  if(matchMedia('(hover:hover)').matches)document.addEventListener('pointerover',e=>{const el=e.target.closest('button,a,.chip,summary');if(el&&el!==S.hoverEl){S.hoverEl=el;SND.tick();}});
  setupTips();try{S.view.crewHide=localStorage.getItem('hl_crewHide')==='1';}catch(e){}
  $('#mute').addEventListener('click',()=>{S.sound=!S.sound;try{localStorage.setItem('hl_sound',S.sound?'1':'0')}catch(e){}$('#mute').classList.toggle('off',!S.sound);if(S.sound)SND.pop();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
}
function subscribe(){
  const db=S.db;let timer=setTimeout(()=>{const s=$('#sync');s.hidden=false;s.textContent='Still connecting to Lantern Bay\u2026 numbers may be out of date.';},10000);
  const ok=()=>{if(S.loaded.config&&S.loaded.days&&S.loaded.players){clearTimeout(timer);$('#sync').hidden=true;}};
  const err=e=>{console.warn(e);const s=$('#sync');s.hidden=false;s.textContent=e&&e.code==='revoked'?'Access to this game changed. Reload to continue.':'Lost the connection to Lantern Bay. Your recent taps may not have saved.';};
  db.doc('config/main').onSnapshot(s=>{S.config=s.exists?s.data():null;S.loaded.config=true;ok();resolveMe();refresh();},err);
  db.collection('days').onSnapshot(s=>{const m={};s.docs.forEach(d=>{if(d.exists)m[d.id]=d.data();});S.days=m;if(!s.metadata?.fromCache)S.loaded.days=true;ok();refresh();},err);
  db.collection('players').onSnapshot(s=>{const m={};s.docs.forEach(d=>{if(d.exists)m[d.id]=d.data();});S.players=m;S.loaded.players=true;ok();resolveMe();refresh();},err);
  db.collection('challenges').onSnapshot(s=>{const m={};s.docs.forEach(d=>{if(d.exists)m[d.id]=d.data();});S.challenges=m;refresh();},err);
  db.collection('sightings').onSnapshot(s=>{const m={};s.docs.forEach(d=>{if(d.exists)m[d.id]=d.data();});S.sightings=m;refresh();},err);
  db.collection('forfeits').onSnapshot(s=>{const m={};s.docs.forEach(d=>{if(d.exists)m[d.id]={id:d.id,...d.data()};});S.forfeits=m;refresh();},err);
}
async function boot(){
  try{S.sound=localStorage.getItem('hl_sound')!=='0';}catch(e){}$('#mute').classList.toggle('off',!S.sound);
  bindUI();S.screen=(location.hash||'#harbour').slice(1);if(S.screen==='islet')S.screen='ship';if(!SCREENS[S.screen])S.screen='harbour';
  let db=null,user=null;
  if(window.HL_SUPABASE&&window.supabase){S.mode='supa';const sb=window.supabase.createClient(window.HL_SUPABASE.url,window.HL_SUPABASE.key,{auth:{persistSession:true,storageKey:'hl-auth'}});S.sb=sb;
    const a=await supaGate(sb);S.authPid=a.pid;S.uid=a.uid;S.me=a.pid;S.isOwner=a.pid==='sam';S.db=makeSupaDB(sb);
    subscribe();setInterval(tick,250);requestAnimationFrame(frame);return;}
  try{if(window.claude&&typeof window.claude.use==='function'){[db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);}}catch(e){db=null;}
  if(db&&user){S.mode='shared';S.db=db;S.user=user;try{S.uid=await user.id();}catch(e){}try{S.isOwner=!!user.isOwner();}catch(e){S.isOwner=false;}
    try{const can=await user.can?.('data.write');if(can===false)S.readOnly=true;}catch(e){}
    if(!S.uid){S.mode='local';S.db=makeLocalDB();S.isOwner=true;}}
  else{S.mode='local';S.db=makeLocalDB();S.isOwner=true;}
  if(S.mode==='local'){const s=$('#sync');s.hidden=false;s.textContent='Practice mode: progress saves in this browser only.';setTimeout(()=>{s.hidden=true;},5000);}
  S.authPid=await gate();if(S.mode==='local')S.me=S.authPid;
  subscribe();setInterval(tick,250);requestAnimationFrame(frame);
}
boot();
