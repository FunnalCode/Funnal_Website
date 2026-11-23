/* Funnal quote page: one template for every quote made in the pipeline. The quote itself is fetched by its private link
   (?q=...) from the pipeline's database; if it has a password it arrives locked and opens in the browser. Built from the
   first client quote page by build_quote.py. */
(function () {
var root = document.getElementById('nq-root');
if (!root) return;
var SB = window.HL_SUPABASE || {};
var SELF = (document.currentScript && document.currentScript.src) || '';
var BASE = SELF ? SELF.replace(/[^\/]*$/, '') + 'assets/' : '';
var params = new URLSearchParams(location.search), TOK = (params.get('q') || '').replace(/[^a-f0-9]/gi, ''), PEEK = params.get('peek') === '1';
var F = function () { return window.__funnal || null; };
var snd = function (k) { try { var f = F(); f && f.play && f.play(k); } catch (e) {} };
var e = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
var plain = function (s) { return String(s == null ? '' : s).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'); };
var WHO = {"sam": {"full": "Samuel Whittaker", "title": "Director", "email": "sam@funnal.co.uk", "face": "https://cdn.prod.website-files.com/64b161c37205c935da2172b2/68efb527a730c66a575569b5_Sam-p-500.jpg", "sig": "sam.svg"}, "james": {"full": "James", "title": "Director", "email": "james@funnal.co.uk", "face": "__BASE__james.jpg", "sig": "james.svg"}};
Object.keys(WHO).forEach(function (k) { WHO[k].face = WHO[k].face.replace('__BASE__', BASE); });
var KEY = 'fq-pw-' + TOK;
var bytes = function (s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
var P = '';
function unlock(pw) {
if (!window.crypto || !crypto.subtle) return Promise.reject(new Error('nocrypto'));
var raw = bytes(P), salt = raw.slice(0, 16), iv = raw.slice(16, 28), ct = raw.slice(28);
return crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey'])
.then(function (k) { return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: 310000, hash: 'SHA-256' }, k, { name: 'AES-GCM', length: 256 }, false, ['decrypt']); })
.then(function (key) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, raw.slice(28)); })
.then(function (buf) { return JSON.parse(new TextDecoder().decode(buf)); });
}
function sigPng(W) {
  return fetch(BASE + W.sig).then(function (r) { return r.text(); }).then(function (svg) {
    svg = svg.replace(/ mask="url\([^)]*\)"/g, '').replace('class="fn-sg-o"', 'class="fn-sg-o" fill="#283338"').replace(/<svg /, '<svg xmlns="http://www.w3.org/2000/svg" ');
    var vb = (svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) || [0, 600, 180]);
    return new Promise(function (ok, bad) { var img = new Image(); img.onload = function () { var c = document.createElement('canvas'); c.width = 760; c.height = Math.round(760 * vb[2] / vb[1]); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); ok(c.toDataURL('image/png')); }; img.onerror = bad; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
  });
}
var STYLE = "/* gentler motion: replaces the heavy blur reveal */@keyframes nqIn{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:none}}#nq-root .fn-fx-in{animation-name:nqIn;animation-duration:.7s}.nq-rv{animation:nqIn .7s cubic-bezier(.2,.8,.2,1) both}@supports (animation-timeline: view()){.nq-rv{animation:nqIn linear both;animation-timeline:view();animation-range:entry 0% entry 40%}}@media (prefers-reduced-motion:reduce){.nq-rv,#nq-root .fn-fx-in{animation:none}}.nq-hero{padding-top:clamp(28px,6vw,72px);padding-bottom:clamp(56px,8vw,104px)}.nq-eb{margin:0}.nq-kick{margin:0;font-size:clamp(20px,2.2vw,28px);font-weight:600;letter-spacing:-.035em;line-height:1.2;color:var(--ink)}.nq-step{cursor:pointer}.nq-step .fn-step-p small{font-weight:500}/* tier */.nq-seg{margin-bottom:16px}.nq-tier{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:12px}@media (max-width:900px){.nq-tier{grid-template-columns:minmax(0,1fr)}}.nq-tier.nq-swap > *{animation:nqIn .5s cubic-bezier(.2,.8,.2,1) backwards}.nq-tier.nq-swap > *:nth-child(2){animation-delay:70ms}.nq-amt{display:flex;align-items:flex-end;flex-wrap:wrap;gap:4px 10px}.nq-amt b{font-size:clamp(52px,7vw,88px);font-weight:600;letter-spacing:-.055em;line-height:1;color:var(--ink-d);font-variant-numeric:tabular-nums}.nq-amt span{padding-bottom:9px;font-size:15px;color:var(--tx)}.nq-care{display:flex;flex-direction:column;gap:4px;width:100%;padding:16px 18px;border-radius:20px;background:color-mix(in srgb,var(--surf) 72%,transparent);font-size:15px;line-height:1.5;color:var(--tx)}.nq-care b{color:var(--ink);font-weight:600}.nq-care i{font-style:normal;font-size:14px;color:var(--mu)}.nq-inc-h{margin:0 0 4px}.fn-inc{position:relative}.fn-inc.nq-no{color:var(--mu)}.fn-inc.nq-no b{color:var(--mu);font-weight:500}.fn-inc.nq-no .fn-ck{background:transparent;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--ink) 14%,transparent);color:var(--mu)}/* info tips */.nq-tip-host{position:relative}.nq-i{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;margin-left:6px;padding:0;border:0;border-radius:99px;background:color-mix(in srgb,var(--ink) 9%,transparent);color:var(--ink);font-family:inherit;font-size:12px;font-weight:600;line-height:1;vertical-align:2px;cursor:help;transition:background .25s,transform .4s cubic-bezier(.3,1.6,.4,1)}.nq-i:hover,.nq-tip-host.nq-open .nq-i{background:var(--ink);color:var(--bg);transform:scale(1.1)}.nq-pop{position:absolute;left:40px;right:0;top:calc(100% - 4px);z-index:40;padding:14px 16px;border-radius:16px;background:var(--brand-d);color:#fff;border:1px solid color-mix(in srgb,#fff 10%,transparent);font-size:14px;line-height:1.55;font-weight:400;letter-spacing:0;box-shadow:0 18px 40px -18px rgba(16,21,24,.55);opacity:0;visibility:hidden;transform:translateY(6px);transition:opacity .2s,transform .3s cubic-bezier(.2,.8,.2,1),visibility .2s;pointer-events:none}.nq-pop ul{margin:6px 0 0;padding-left:18px}.nq-pop li{margin:2px 0}.nq-pop b{display:inline;margin:0;font-size:14px;color:inherit}.nq-tip-host.nq-open > .nq-pop,.nq-i:focus-visible + .nq-pop{opacity:1;visibility:visible;transform:none}@media (hover:hover){.nq-tip-host:hover > .nq-pop{opacity:1;visibility:visible;transform:none;transition-delay:.12s}}/* add-ons */.nq-build{display:flex;flex-direction:column;gap:12px}.nq-group{display:flex;flex-direction:column;gap:10px}.nq-group + .nq-group{margin-top:14px}.nq-group-h{margin:0;font-size:13px;font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--mu)}.nq-group-h i{font-style:normal;text-transform:none;letter-spacing:0;font-weight:500}.fn-ao.nq-tip-host{overflow:visible}.fn-ao .nq-pop{left:0;right:0;top:calc(100% + 8px)}.fn-ao .nq-i{position:absolute;top:14px;right:14px;margin:0}.fn-ao .fn-ao-t{padding-right:22px}.nq-ao-p{margin-top:6px;font-size:14px;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums}.nq-ao-p em{font-style:normal;font-weight:500;color:var(--mu)}.nq-plan{align-items:stretch}.nq-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:12px;width:100%}.nq-col{padding:16px 18px;border-radius:18px;background:color-mix(in srgb,var(--surf) 70%,transparent);min-width:0}.nq-col-h{margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--mu)}.nq-row{display:flex;justify-content:space-between;gap:12px;padding:6px 0;font-size:15px;line-height:1.45;color:var(--tx)}.nq-row span:last-child{color:var(--ink);font-variant-numeric:tabular-nums;white-space:nowrap}.nq-row.nq-sum{margin-top:6px;padding-top:12px;border-top:1px solid color-mix(in srgb,var(--ink) 12%,transparent);font-weight:600;color:var(--ink);font-size:17px}.nq-payplan{margin:0;padding:14px 16px;border-radius:16px;background:color-mix(in srgb,var(--surf) 70%,transparent);font-size:15px;line-height:1.55;color:var(--tx)}.nq-payplan b{color:var(--ink);font-weight:600}.nq-mail{margin-left:0}/* breakdown */.nq-cmp{--lab:300px;margin-bottom:12px}.nq-cmp .fn-cmp-lab{position:relative}.nq-cmp .fn-cmp-lab .nq-pop{left:0;right:auto;width:min(340px,80vw)}.nq-cmp .nq-tot .fn-cmp-lab,.nq-cmp .nq-tot .fn-cmp-c{font-weight:600;color:var(--ink)}.nq-cmp .nq-pay .fn-cmp-lab{font-size:18px}.nq-cmp .nq-pay .fn-cmp-c{font-size:20px;font-weight:600;letter-spacing:-.03em;color:var(--ink-d)}@media (max-width:860px){.nq-cmp{--lab:0px}}.nq-terms .fn-terms-b svg{flex:0 0 auto;transition:transform .45s cubic-bezier(.2,1.3,.3,1)}.nq-terms .fn-terms-b[aria-expanded=\"true\"] svg{transform:rotate(180deg)}/* receipt printer */.nq-modal{position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:max(24px,env(safe-area-inset-top)) 16px 32px}.nq-modal[hidden]{display:none}.nq-modal-bg{position:fixed;inset:0;background:color-mix(in srgb,#101518 55%,transparent);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);animation:nqFade .3s both}.nq-modal-c{position:relative;width:min(100%,420px);display:flex;flex-direction:column;align-items:center;margin-top:min(6vh,60px);animation:nqIn .4s cubic-bezier(.2,.8,.2,1) both}.nq-modal-eb{margin:0 0 14px;color:#fff;opacity:.85}.nq-printer{position:relative;z-index:2;width:100%;height:74px;border-radius:22px 22px 14px 14px;background:linear-gradient(180deg,#4b5e6e,#283338);box-shadow:0 20px 40px -20px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.18)}.nq-printer-top{position:absolute;left:22px;right:22px;bottom:16px;display:flex;align-items:center;gap:12px}.nq-led{flex:0 0 auto;width:9px;height:9px;border-radius:99px;background:#DDA94D;box-shadow:0 0 10px #DDA94D;animation:nqBlink .7s steps(2) infinite}.nq-modal.nq-done .nq-led{background:#7ac38f;box-shadow:0 0 10px #7ac38f;animation:none}.nq-slot{flex:1;height:8px;border-radius:99px;background:#101518;box-shadow:inset 0 2px 3px rgba(0,0,0,.7)}.nq-paper-wrap{position:relative;z-index:1;width:calc(100% - 64px);margin-top:-14px;overflow:hidden}.nq-paper{position:relative;padding:26px 22px 34px;background:#FFFEFB;color:#2A2B2D;font:13px/1.55 ui-monospace,\"SF Mono\",Menlo,Consolas,monospace;box-shadow:0 18px 30px -16px rgba(0,0,0,.45);transform:translateY(-100%);  -webkit-mask:linear-gradient(#000,#000) top/100% calc(100% - 10px) no-repeat,conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) bottom/16px 10px repeat-x;  mask:linear-gradient(#000,#000) top/100% calc(100% - 10px) no-repeat,conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) bottom/16px 10px repeat-x}.nq-paper.nq-go{transition:transform 2.6s steps(26,end)}.nq-paper.nq-go.nq-in{transform:none}.nq-paper .r-c{text-align:center}.nq-paper .r-b{font-weight:700}.nq-paper .r-big{font-size:15px;font-weight:700;letter-spacing:.04em}.nq-paper .r-row{display:flex;justify-content:space-between;gap:10px}.nq-paper .r-row span:first-child{min-width:0}.nq-paper .r-row span:last-child{white-space:nowrap}.nq-paper .r-mu{color:#757575}.nq-paper .r-hr{border:0;border-top:1px dashed #b9b4ab;margin:10px 0}.nq-paper .r-bars{height:34px;margin:14px auto 0;width:70%;background:repeating-linear-gradient(90deg,#2A2B2D 0 2px,transparent 2px 4px,#2A2B2D 4px 7px,transparent 7px 9px,#2A2B2D 9px 10px,transparent 10px 13px)}.nq-modal-act{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:18px;opacity:0;transform:translateY(8px);transition:opacity .35s,transform .45s cubic-bezier(.2,.8,.2,1)}.nq-modal.nq-done .nq-modal-act{opacity:1;transform:none}.nq-modal-act .fn-ghost{background:rgba(255,255,255,.12);color:#fff}@keyframes nqBlink{50%{opacity:.25}}@keyframes nqFade{from{opacity:0}}@media (prefers-reduced-motion:reduce){.nq-paper.nq-go{transition:none}.nq-led{animation:none}}@media (max-width:479px){.nq-stairs .fn-addb em{display:none}}/* tooltip stacking: lift the hovered card above its neighbours */.fn-ao.nq-tip-host{position:relative}.nq-tip-host:hover,.nq-tip-host.nq-open,.nq-tip-host:has(.nq-i:focus-visible){z-index:30}.nq-group,.fn-ao-grid{position:relative}.nq-group:hover,.nq-group:has(.nq-open),.nq-group:has(.nq-i:focus-visible){z-index:20}.fn-t-inc{position:relative;z-index:1}/* breakdown toggle */.nq-cmp-box{display:flex;flex-direction:column;gap:12px;margin-bottom:12px}.nq-cmp-box .nq-cmp{margin-bottom:0;animation:nqIn .45s cubic-bezier(.2,.8,.2,1) both}.nq-cmp-box .fn-cmp-tg b{font-size:clamp(17px,1.8vw,20px);font-weight:600;letter-spacing:-.03em}.nq-cmp-box .fn-cmp-tg[aria-expanded=\"true\"] .fn-cmp-act svg{transform:rotate(180deg)}/* thank you + signature */.nq-sign{width:min(100%,300px);margin-top:6px}.nq-sign .fn-sg{color:var(--ink)}.nq-signame{margin:0;display:flex;flex-direction:column;gap:2px;font-size:15px;color:var(--mu)}.nq-signame b{font-size:17px;font-weight:600;letter-spacing:-.02em;color:var(--ink)}#nq-root [hidden]{display:none!important}#nq-aos{display:flex;flex-direction:column;padding:clamp(18px,2.6vw,28px);border-radius:24px;background:var(--card)}.nq-thanks{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);align-items:center;gap:clamp(20px,4vw,56px)}@media (max-width:820px){.nq-thanks{grid-template-columns:minmax(0,1fr)}}.nq-thanks-t{display:flex;flex-direction:column;gap:14px;min-width:0}.nq-thanks-s{display:flex;align-items:center;gap:clamp(16px,2.4vw,24px);min-width:0}.nq-face{flex:0 0 auto;width:clamp(76px,9vw,104px);aspect-ratio:1;max-width:100%;border-radius:999px;background:var(--card2) url(\"https://cdn.prod.website-files.com/64b161c37205c935da2172b2/68efb527a730c66a575569b5_Sam-p-500.jpg\") center 25%/cover no-repeat;box-shadow:0 0 0 4px var(--bg),0 0 0 5.5px var(--rose,#C7B1B1)}.nq-thanks-n{display:flex;flex-direction:column;gap:4px;min-width:0;flex:1}.nq-thanks-n .nq-sign{width:min(100%,240px);margin:0}\n.nq-accept{background:var(--ac-gold,#DDA94D)!important;color:#283338!important}.nq-accept:hover{filter:brightness(1.04)}\n.nq-accepted{margin-top:4px;padding:14px 16px;border-radius:16px;background:color-mix(in srgb,var(--ac-blue,#486790) 12%,var(--surf));color:var(--ink);font-size:15px;line-height:1.5}.nq-accepted b{font-weight:600}\n.nq-acard{width:min(100%,460px);background:var(--bg);color:var(--ink);border-radius:26px;padding:26px 24px 22px;align-items:stretch;gap:10px;box-shadow:0 30px 70px -30px rgba(0,0,0,.6)}\n.nq-a-sum{padding:14px 16px;border-radius:16px;background:var(--card);font-size:15px;line-height:1.6;color:var(--tx)}.nq-a-sum b{color:var(--ink);font-weight:600}\n.nq-a-note{margin:0;font-size:14px;color:var(--mu);line-height:1.5}.nq-a-act{opacity:1!important;transform:none!important;justify-content:flex-start;margin-top:8px}.nq-acard .fn-ghost{background:var(--card2)!important;color:var(--ink)!important}\n.nq-msg{max-width:560px;margin:clamp(60px,12vh,140px) auto;text-align:center;display:flex;flex-direction:column;gap:12px;align-items:center}\n";
function tpl(Q, FROM) {
  var n = Q.packages.length, h = ['var(--h1)', 'var(--h2)', 'var(--h3)'];
  var cmpLab = n === 3 ? 'Compare all three packages' : n === 2 ? 'Compare both packages' : 'See everything included';
  return '<section class="fn-wrap nq-hero"><div class="fn-pk-hero"><div class="fn-hero-t">' +
    '<p class="fn-eyebrow fn-fx-in nq-eb">Prepared for ' + e(Q.greet || Q.business) + (Q.greet && Q.business ? ' · ' + e(Q.business) : '') + '</p>' +
    '<h1 class="fn-h1 fn-fx-in">Your <em>Quote</em></h1>' +
    (Q.kicker ? '<p class="fn-fx-in nq-kick" style="animation-delay:140ms">' + e(Q.kicker) + '</p>' : '') +
    (Q.lede ? '<p class="fn-lede fn-fx-in" style="animation-delay:220ms">' + e(Q.lede) + '</p>' : '') +
    '</div><div class="fn-stairs nq-stairs" role="group" aria-label="The packages">' +
    ((Q.addons || []).length ? '<a class="fn-addb" href="#nq-addons">+ ' + e(Q.addonsTitle || 'Add monthly services') + ' <em>· mix and match</em></a>' : '') +
    '<span class="fn-climb" aria-hidden="true"></span>' +
    Q.packages.map(function (p, i) { return '<a class="fn-step nq-step' + (i === 0 ? ' fn-on' : '') + ' fn-fx-in" href="#nq-explorer" data-pk="' + i + '" style="--h:' + h[Math.min(2, i + (3 - Math.min(3, n)))] + ';animation-delay:' + (300 + i * 150) + 'ms"><span class="fn-step-n">' + e(p.name) + '</span><span class="fn-step-p" data-price="' + i + '"></span></a>'; }).join('') +
    '</div></div></section>' +
    '<section class="fn-wrap fn-sec" id="nq-explorer" aria-labelledby="nq-explorer-h"><h2 class="fn-sh nq-rv" id="nq-explorer-h">' + e(Q.pkgTitle || (n > 1 ? 'Choose a package' : 'Your package')) + (Q.pkgNote ? ' <span>· ' + e(Q.pkgNote) + '</span>' : '') + '</h2>' +
    '<div class="nq-rv"><div class="fn-seg nq-seg" role="tablist" aria-label="Package" style="--k:0;--n:' + n + ';--w:' + Math.min(560, 190 * n) + 'px' + (n < 2 ? ';display:none' : '') + '"><span class="fn-seg-th" aria-hidden="true"></span>' +
    Q.packages.map(function (p, i) { return '<div class="fn-seg-b' + (i === 0 ? ' fn-on' : '') + '" role="tab" tabindex="' + (i === 0 ? 0 : -1) + '" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + e(p.name) + '</div>'; }).join('') +
    '</div><div class="nq-tier" id="nq-tier" role="tabpanel"></div></div></section>' +
    '<section class="fn-wrap fn-sec" id="nq-addons" aria-labelledby="nq-addons-h"><h2 class="fn-sh nq-rv" id="nq-addons-h">' + ((Q.addons || []).length ? e(Q.addonsTitle || 'Add monthly services') + (Q.addonsNote ? ' <span>· ' + e(Q.addonsNote) + '</span>' : '') : 'Your total') + '</h2>' +
    '<div class="nq-rv nq-build"><div id="nq-aos"' + ((Q.addons || []).length ? '' : ' hidden') + '></div><div class="fn-plan nq-plan" aria-live="polite"><div class="fn-plan-row" id="nq-chips"></div>' +
    '<div class="nq-cols"><div class="nq-col"><p class="nq-col-h">One-off</p><div id="nq-oneoff"></div></div><div class="nq-col"><p class="nq-col-h">Monthly</p><div id="nq-monthly"></div></div></div>' +
    (Q.payplan ? '<p class="nq-payplan">' + (Q.payplanTitle ? '<b>' + e(Q.payplanTitle) + '</b> ' : '') + e(Q.payplan) + '</p>' : '') +
    '<div class="fn-plan-act"><button type="button" class="fn-cta" id="nq-print"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/></svg> Print my quote</button><button type="button" class="fn-cta fn-ghost" id="nq-copy">Copy my plan</button><button type="button" class="fn-cta nq-accept" id="nq-accept">Accept this quote</button><button type="button" class="fn-mail nq-mail">' + FROM.email + '</button></div>' +
    '<div class="nq-accepted" id="nq-accepted" hidden></div></div></div></section>' +
    '<section class="fn-wrap fn-sec" id="nq-compare" aria-labelledby="nq-compare-h"><h2 class="fn-sh nq-rv" id="nq-compare-h">Full breakdown <span>· What ' + (n > 1 ? 'each package includes' : 'is included') + '.</span></h2>' +
    '<div class="nq-rv nq-cmp-box"><button type="button" class="fn-cmp-tg" id="nq-cmp-tg" aria-expanded="false" aria-controls="nq-cmp"><span><b>' + cmpLab + '</b></span><span class="fn-cmp-act"><span id="nq-cmp-tl">Show breakdown</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span></button><div class="fn-cmp nq-cmp" id="nq-cmp" style="--k:0;--n:' + n + '" hidden></div></div>' +
    '<div class="fn-terms nq-terms nq-rv"><button type="button" class="fn-terms-b" id="nq-terms-b" aria-expanded="false" aria-controls="nq-terms-l"><span><b>Terms</b><i>Payment, notice and what each package covers</i></span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>' +
    '<ol class="fn-terms-l" id="nq-terms-l" hidden>' + (Q.terms || []).map(function (t) { return '<li>' + e(t) + '</li>'; }).join('') + '</ol></div></section>' +
    '<section class="fn-wrap fn-sec" id="nq-thanks" aria-labelledby="nq-thanks-h"><div class="fn-sig nq-thanks nq-rv"><div class="nq-thanks-t"><h2 class="fn-sig-h" id="nq-thanks-h">' + e(Q.thanksTitle || ('Thank you, ' + (Q.greet || 'and speak soon') + '.')) + '</h2>' +
    (Q.thanks ? '<p class="fn-sig-p">' + e(Q.thanks) + '</p>' : '') + '</div>' +
    '<div class="nq-thanks-s"><span class="nq-face" role="img" aria-label="' + e(FROM.full) + '" style="background-image:url(' + FROM.face + ')"></span><div class="nq-thanks-n"><div class="nq-sign" id="nq-sign"></div><p class="nq-signame"><b>' + e(FROM.full) + '</b><span>' + e(FROM.title) + ', Funnal Ltd</span></p></div></div></div></section>' +
    '<div class="nq-modal" id="nq-modal" hidden><div class="nq-modal-bg" data-close="1"></div><div class="nq-modal-c" role="dialog" aria-modal="true" aria-labelledby="nq-modal-h"><p class="fn-eyebrow nq-modal-eb" id="nq-modal-h">Printing your quote</p><div class="nq-printer" aria-hidden="true"><div class="nq-printer-top"><span class="nq-led"></span><span class="nq-slot"></span></div></div><div class="nq-paper-wrap"><div class="nq-paper" id="nq-paper"></div></div><div class="nq-modal-act"><button type="button" class="fn-cta" id="nq-pdf" disabled>Download PDF</button><button type="button" class="fn-cta fn-ghost" data-close="1">Close</button></div></div></div>' +
    '<div class="nq-modal nq-amodal" id="nq-amodal" hidden><div class="nq-modal-bg" data-aclose="1"></div><div class="nq-modal-c nq-acard" role="dialog" aria-modal="true" aria-labelledby="nq-a-h"><p class="fn-eyebrow" style="margin:0">Accept your quote</p><h2 class="fn-h3" id="nq-a-h"></h2><div class="nq-a-sum" id="nq-a-sum"></div><p class="nq-a-note">We\'ll be in touch to agree a start date and send the agreement. Nothing is charged yet.</p><div class="nq-modal-act nq-a-act"><button type="button" class="fn-cta" id="nq-a-go">Yes, accept</button><button type="button" class="fn-cta fn-ghost" data-aclose="1">Not yet</button></div></div></div>';
}
function msg(h, p) { root.innerHTML = '<section class="fn-wrap fn-sec"><div class="nq-msg fn-fx-in"><p class="fn-eyebrow" style="margin:0">Private quote</p><h1 class="fn-h2">' + h + '</h1><p class="fn-lede">' + p + '</p><a class="fn-cta" href="mailto:sam@funnal.co.uk">Email Funnal</a></div></section>'; }
function mount(Q, meta) {
  if (!document.getElementById('fq-style')) { var st = document.createElement('style'); st.id = 'fq-style'; st.textContent = STYLE; document.head.appendChild(st); }
  if (!Q || !Q.packages || !Q.packages.length) { msg('This quote is empty', 'Get in touch and we\'ll send it again.'); return; }
  try { document.title = 'Your quote · ' + plain(Q.business || 'Funnal'); } catch (x) {}
  var W = WHO[Q.from] || WHO.sam;
  root.innerHTML = tpl(Q, W);
  fetch(BASE + W.sig).then(function (r) { return r.text(); }).then(function (svg) { var s = root.querySelector('#nq-sign'); if (s) { s.innerHTML = svg; signIn(s); } }).catch(function () {});
  try { app(root, Q, meta || {}); } catch (x) { if (window.console) console.error('[quote]', x); }
}
function signIn(s) {
  var go = function () { s.classList.add('fn-is-sign'); var g = s.querySelector('.fn-sg'); if (g) g.classList.add('fn-is-sign'); };
  if (!('IntersectionObserver' in window)) { go(); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { setTimeout(go, 250); io.disconnect(); } }); }, { threshold: 0.6 }); io.observe(s);
}
function app(root, Q, META) {
var F = window.__funnal || null;
var snd = function (k) { try { F && F.play && F.play(k); } catch (e) {} };
var say = function (t) { try { F && F.toast && F.toast(t); } catch (e) {} };
var $ = function (s) { return root.querySelector(s); };
var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
var gbp = function (n) { return '£' + Math.round(n).toLocaleString('en-GB'); };
var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var TICK = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';
var DASH = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>';
var PLUS = '<svg class="fn-p" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><svg class="fn-c" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';
var TONES = ['bronze', 'silver', 'gold'];

var ITEMS = (Q.items || []).map(function (it) { return [esc(it.n || ''), esc(it.s || ''), esc(it.m || ''), Math.max(0, Math.min((Q.packages.length || 1) - 1, +it.from || 0))]; });
var PK = Q.packages.map(function (p) { return { name: esc(p.name || 'Package'), price: +p.price || 0, period: p.period || 'one_off', care: +p.care || 0, careName: esc(p.careName || 'Monthly care'), rec: !!p.rec, tag: esc(p.tag || ''), unit: esc(p.unit || '') }; });
var ADD = (Q.addons || []).map(function (a, i) { return { k: 'a' + i, g: a.g || 'Services', n: esc(a.n || ''), d: esc(a.d || ''), m: +a.m || 0, li: a.li || [] }; });
var GROUPS = []; ADD.forEach(function (a) { if (!GROUPS.some(function (g) { return g[0] === a.g; })) GROUPS.push([a.g, a.g === 'Social' ? 'Social media <i>· pick one</i>' : esc(a.g)]); });
var ONE = function (p) { return p.period === 'one_off'; };
var PER = function (p) { return p.unit || (p.period === 'monthly' ? 'a month' : p.period === 'four_weekly' ? 'every 4 weeks' : 'one-off'); };
var PERS = function (p) { return p.period === 'monthly' ? '/month' : p.period === 'four_weekly' ? '/4 weeks' : ''; };
var FROM = WHO[Q.from] || WHO.sam;
var NOSET = Q.noSetup !== false;
var pk = 0, picked = {};

function tip(html) { return '<button type="button" class="nq-i" aria-label="More info" aria-expanded="false">i</button><span class="nq-pop" role="tooltip">' + html + '</span>'; }

function totals() {
  var p = PK[pk], lines = ADD.filter(function (a) { return picked[a.k]; });
  var mon = lines.reduce(function (t, a) { return t + a.m; }, 0);
  return { p: p, lines: lines, one: ONE(p) ? p.price : 0, month: (ONE(p) ? 0 : p.price) + p.care + mon };
}

function stepPrices() {
  $$('[data-price]').forEach(function (el) { var p = PK[+el.getAttribute('data-price')]; el.innerHTML = gbp(p.price) + '<small>' + PER(p) + '</small>'; });
}

function renderTier(anim) {
  var p = PK[pk], el = $('#nq-tier');
  var inc = ITEMS.filter(function (it) { return it[3] <= pk; }), no = ITEMS.filter(function (it) { return it[3] > pk; });
  var prev = pk > 0 ? '<div class="fn-inc"><span class="fn-ck">' + TICK + '</span><span><b>Everything in ' + PK[pk - 1].name + '</b>' + inc.filter(function (it) { return it[3] < pk; }).map(function (it) { return it[0]; }).join(', ') + '.</span></div>' : '';
  var own = inc.filter(function (it) { return it[3] === pk; });
  el.innerHTML = '<div class="fn-t-card">' +
    (p.rec ? '<span class="fn-chip-b nq-rec">Recommended' + (Q.short ? ' for ' + esc(Q.short) : '') + '</span>' : '') +
    '<div><h3 class="fn-t-name">' + p.name + '</h3><p class="fn-t-tag">' + p.tag + '</p></div>' +
    '<div class="nq-amt"><b>' + gbp(p.price) + '</b><span>' + PER(p) + '</span></div>' +
    (p.care || Q.spread ? '<div class="nq-care">' + (p.care ? '<span><b>+ ' + gbp(p.care) + ' per month</b> · ' + p.careName + '</span>' : '') + (Q.spread ? '<i>' + esc(Q.spread) + '</i>' : '') + '</div>' : '') +
    '<a class="fn-cta fn-t-cta" href="#nq-addons">' + (ADD.length ? esc(Q.addonsTitle || 'Add monthly services') : 'See your total') + '</a></div>' +
    '<div class="fn-t-inc"><p class="fn-eyebrow nq-inc-h">What’s included</p>' + prev +
    own.map(function (it) { return '<div class="fn-inc"><span class="fn-ck">' + TICK + '</span><span><b>' + it[0] + '</b>' + it[1] + '</span></div>'; }).join('') +
    no.map(function (it) { return '<div class="fn-inc nq-no"><span class="fn-ck">' + DASH + '</span><span><b>' + it[0] + '</b>In ' + PK[it[3]].name + '</span></div>'; }).join('') +
    '</div>';
  if (anim && !reduce) { el.classList.remove('nq-swap'); void el.offsetWidth; el.classList.add('nq-swap'); }
}

function renderAddons() {
  var box = $('#nq-aos');
  box.innerHTML = GROUPS.map(function (g) {
    return '<div class="nq-group"><p class="nq-group-h">' + g[1] + '</p><div class="fn-ao-grid">' +
      ADD.filter(function (a) { return a.g === g[0]; }).map(function (a) {
        var on = !!picked[a.k];
        return '<div class="fn-ao nq-tip-host' + (on ? ' fn-on' : '') + '" role="button" tabindex="0" aria-pressed="' + on + '" data-k="' + a.k + '">' +
          '<span class="fn-pl" aria-hidden="true">' + PLUS + '</span><span class="fn-ao-t"><b>' + a.n + '</b>' + a.d +
          '<span class="nq-ao-p">' + (a.m ? gbp(a.m) + '/month' : 'Price on request') + (NOSET ? ' <em>· no set-up fee</em>' : '') + '</span></span>' +
          tip('<b>What you get</b><ul>' + a.li.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>') + '</div>';
      }).join('') + '</div></div>';
  }).join('');
  $$('#nq-aos .fn-ao').forEach(function (c) {
    var go = function (kb) {
      var k = c.getAttribute('data-k'), a = ADD.filter(function (x) { return x.k === k; })[0];
      if (picked[k]) { delete picked[k]; snd('close'); }
      else {
        if (a.g === 'Social') ADD.forEach(function (x) { if (x.g === 'Social') delete picked[x.k]; });
        picked[k] = true; snd('open');
      }
      renderAddons(); renderPlan();
      var again = root.querySelector('.fn-ao[data-k="' + k + '"]'); if (again && kb) again.focus();
    };
    c.addEventListener('click', function (e) { if (e.target.closest('.nq-i')) return; go(false); });
    c.addEventListener('keydown', function (e) { if (e.target === c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go(true); } });
  });
}

function row(a, b, c) { return '<div class="nq-row' + (c ? ' ' + c : '') + '"><span>' + a + '</span><span>' + b + '</span></div>'; }

function renderPlan() {
  var t = totals();
  var oc = $('#nq-oneoff').parentNode, mc = $('#nq-monthly').parentNode; oc.hidden = !PK.some(ONE); mc.hidden = PK.every(ONE) && !PK.some(function (p) { return p.care; }) && !ADD.length;
  $('#nq-chips').innerHTML = '<span class="fn-chip-b">' + t.p.name + '</span>' + t.lines.map(function (l) { return '<span class="fn-chip-a">' + l.n + '</span>'; }).join('');
  $('#nq-oneoff').innerHTML = (ONE(t.p) ? row(t.p.name, gbp(t.p.price)) : '') + (NOSET ? row('Set-up fees', gbp(0)) : '') + row('One-off total', gbp(t.one), 'nq-sum');
  $('#nq-monthly').innerHTML = (ONE(t.p) ? '' : row(t.p.name, gbp(t.p.price))) + (t.p.care ? row(t.p.careName, gbp(t.p.care)) : '') +
    (t.lines.length ? t.lines.map(function (l) { return row(l.n, gbp(l.m)); }).join('') : (ADD.length ? row('No services added yet', gbp(0)) : '')) +
    row('Monthly total', gbp(t.month), 'nq-sum');
}

function renderCmp() {
  var cols = PK.map(function (p, i) { return '<div><button type="button" class="fn-cmp-h" data-i="' + i + '"><b>' + p.name + '</b><i>' + gbp(p.price) + ' ' + PER(p) + '</i></button></div>'; }).join('');
  var cell = function (i, txt, na) { return '<div class="fn-cmp-c' + (na ? ' fn-na' : '') + '" data-i="' + i + '" data-t="' + PK[i].name + '">' + txt + '</div>'; };
  var h = '<span class="fn-cmp-hl" aria-hidden="true"></span><div class="fn-cmp-row fn-cmp-head"><span></span>' + cols + '</div>';
  ITEMS.forEach(function (it) {
    h += '<div class="fn-cmp-row"><div class="fn-cmp-lab">' + it[0] + '</div>' +
      PK.map(function (p, i) { return i >= it[3] ? cell(i, 'Included') : cell(i, 'Not included', true); }).join('') + '</div>';
  });
  var tot = function (lab, fn, cls) { return '<div class="fn-cmp-row ' + cls + '"><div class="fn-cmp-lab">' + lab + '</div>' + PK.map(function (p, i) { return cell(i, fn(p)); }).join('') + '</div>'; };
  h += tot(PK.every(ONE) ? 'One-off price' : 'Price', function (p) { return gbp(p.price) + PERS(p); }, 'nq-tot nq-pay');
  if (PK.some(function (p) { return p.care; })) h += tot('Monthly care', function (p) { return p.care ? gbp(p.care) + '/month' : '–'; }, '');
  $('#nq-cmp').innerHTML = h;
  $$('#nq-cmp .fn-cmp-h').forEach(function (b) { b.addEventListener('click', function () { choose(+b.getAttribute('data-i')); snd('tab'); }); });
}

function choose(i, quiet) {
  var changed = i !== pk;
  pk = i;
  $('.nq-seg').style.setProperty('--k', i);
  $$('.nq-seg .fn-seg-b').forEach(function (b) { var on = +b.getAttribute('data-i') === i; b.classList.toggle('fn-on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); b.setAttribute('tabindex', on ? '0' : '-1'); });
  $$('.nq-step').forEach(function (s) { s.classList.toggle('fn-on', +s.getAttribute('data-pk') === i); });
  var cmp = $('#nq-cmp'); cmp.style.setProperty('--k', i);
  $$('#nq-cmp .fn-cmp-c').forEach(function (c) { c.classList.toggle('fn-on', +c.getAttribute('data-i') === i); });
  renderTier(changed);
  if (!quiet) renderPlan();
}

/* info tips: hover on desktop, tap on touch */
root.addEventListener('click', function (e) {
  var b = e.target.closest && e.target.closest('.nq-i');
  $$('.nq-tip-host.nq-open').forEach(function (h) { if (!b || h !== b.closest('.nq-tip-host')) { h.classList.remove('nq-open'); var x = h.querySelector('.nq-i'); x && x.setAttribute('aria-expanded', 'false'); } });
  if (!b) return;
  e.preventDefault(); e.stopPropagation();
  var host = b.closest('.nq-tip-host'), open = !host.classList.contains('nq-open');
  host.classList.toggle('nq-open', open); b.setAttribute('aria-expanded', open ? 'true' : 'false');
  snd(open ? 'open' : 'close');
}, true);
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { $$('.nq-tip-host.nq-open').forEach(function (h) { h.classList.remove('nq-open'); }); closeModal(); } });

$$('.nq-seg .fn-seg-b').forEach(function (b) {
  b.addEventListener('click', function () { choose(+b.getAttribute('data-i')); snd('tab'); });
  b.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    var n = (pk + (e.key === 'ArrowRight' ? 1 : PK.length - 1)) % PK.length;
    choose(n); snd('tab'); $$('.nq-seg .fn-seg-b')[n].focus();
  });
});
$$('.nq-step').forEach(function (s) { s.addEventListener('click', function () { choose(+s.getAttribute('data-pk')); snd('tab'); }); });

function planLines() {
  var t = totals();
  var mon = [];
  if (!ONE(t.p)) mon.push(t.p.name + ' ' + gbp(t.p.price)); if (t.p.care) mon.push(t.p.careName + ' ' + gbp(t.p.care));
  t.lines.forEach(function (l) { mon.push(l.n + ' ' + gbp(l.m)); });
  return [Q.business + ' quote from Funnal',
    'Package: ' + t.p.name + ', ' + gbp(t.p.price) + ' ' + PER(t.p),
    mon.length ? 'Monthly: ' + mon.join(', ') : '',
    'One-off total: ' + gbp(t.one), 'Monthly total: ' + gbp(t.month),
    Q.receiptNote || ''].filter(Boolean).join('\n').replace(/&amp;/g, '&').replace(/&lt;/g, '<');
}
$('#nq-copy').addEventListener('click', function () {
  var txt = planLines();
  if (F && F.copy) { F.copy(txt, 'Plan copied. Paste it into an email to ' + FROM.email); return; }
  try { navigator.clipboard.writeText(txt); } catch (e) {}
});
$('.nq-mail').addEventListener('click', function (e) { if (F && F.copy) { e.stopPropagation(); F.copy(FROM.email, 'Email copied'); } });
$('#nq-terms-b').addEventListener('click', function () {
  var b = $('#nq-terms-b'), l = $('#nq-terms-l'), open = b.getAttribute('aria-expanded') === 'true';
  b.setAttribute('aria-expanded', open ? 'false' : 'true'); l.hidden = open; snd(open ? 'close' : 'open');
});

$('#nq-cmp-tg').addEventListener('click', function () {
  var b = $('#nq-cmp-tg'), c = $('#nq-cmp'), open = b.getAttribute('aria-expanded') === 'true';
  b.setAttribute('aria-expanded', open ? 'false' : 'true'); c.hidden = open;
  $('#nq-cmp-tl').textContent = open ? 'Show breakdown' : 'Hide breakdown';
  snd(open ? 'close' : 'open');
});
(function () {
  var s = $('#nq-sign'); if (!s) return;
  var go = function () { s.classList.add('fn-is-sign'); };
  if (reduce || !('IntersectionObserver' in window)) { go(); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { setTimeout(go, 250); io.disconnect(); } }); }, { threshold: 0.6 });
  io.observe(s);
})();

/* receipt printer + PDF */
var today = new Date();
var dateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
var ref = (String(Q.business || 'FQ').split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 3).toUpperCase() || 'FQ') + '-' + String(today.getFullYear()).slice(2) + String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0');
var modal = $('#nq-modal'), lastFocus = null, printTimer = null;

function receipt() {
  var t = totals(), dots = '<hr class="r-hr">';
  var r = function (a, b, c) { return '<div class="r-row' + (c ? ' ' + c : '') + '"><span>' + a + '</span><span>' + b + '</span></div>'; };
  return '<div class="r-c r-big">' + esc(String(Q.business || '').toUpperCase()) + '</div><div class="r-c r-mu">quote by Funnal</div>' + dots +
    r('Date', dateStr, 'r-mu') + r('Ref', ref + '-' + t.p.name.charAt(0), 'r-mu') + dots +
    r('<span class="r-b">' + t.p.name.toUpperCase() + '</span>', gbp(t.p.price) + (ONE(t.p) ? '' : PERS(t.p))) +
    ITEMS.filter(function (it) { return it[3] <= pk; }).map(function (it) { return '<div class="r-mu">&nbsp; + ' + it[0] + '</div>'; }).join('') + dots +
    (t.p.care || t.lines.length ? '<div class="r-b">MONTHLY</div>' + (t.p.care ? r(t.p.careName, gbp(t.p.care)) : '') + t.lines.map(function (l) { return r(l.n, gbp(l.m)); }).join('') + dots : '') +
    (t.one ? r('<span class="r-b">ONE-OFF TOTAL</span>', '<span class="r-b">' + gbp(t.one) + '</span>') : '') +
    r('<span class="r-b">MONTHLY TOTAL</span>', '<span class="r-b">' + gbp(t.month) + '</span>') + dots +
    (NOSET ? '<div class="r-c r-mu">No set-up fees</div>' : '') + (Q.receiptNote ? '<div class="r-c r-mu">' + esc(Q.receiptNote) + '</div>' : '') + dots +
    '<div class="r-c">Thank you, ' + esc(Q.greet || '') + '</div><div class="r-c r-mu">' + FROM.email + '</div><div class="r-bars"></div>';
}

var actx = null;
function printNoise(secs) {
  try {
    if (F && F.soundOn && !F.soundOn()) return;
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    actx = actx || new AC(); if (actx.state === 'suspended') actx.resume();
    var now = actx.currentTime + 0.05, sr = actx.sampleRate;
    var buf = actx.createBuffer(1, Math.floor(sr * 0.05), sr), ch = buf.getChannelData(0);
    for (var i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length);
    var out = actx.createGain(); out.gain.value = 0.55; out.connect(actx.destination);
    /* motor hum */
    var hum = actx.createOscillator(), hg = actx.createGain(), hf = actx.createBiquadFilter();
    hum.type = 'sawtooth'; hum.frequency.value = 96; hf.type = 'lowpass'; hf.frequency.value = 420;
    hg.gain.setValueAtTime(0, now); hg.gain.linearRampToValueAtTime(0.05, now + 0.08); hg.gain.setValueAtTime(0.05, now + secs - 0.1); hg.gain.linearRampToValueAtTime(0, now + secs);
    hum.connect(hf); hf.connect(hg); hg.connect(out); hum.start(now); hum.stop(now + secs + 0.05);
    /* print head ticks */
    var step = secs / 26;
    for (var s = 0; s < 26; s++) {
      for (var r = 0; r < 3; r++) {
        var t = now + s * step + r * step / 3, src = actx.createBufferSource(), bp = actx.createBiquadFilter(), g = actx.createGain();
        src.buffer = buf; bp.type = 'bandpass'; bp.frequency.value = 2600 + Math.random() * 900; bp.Q.value = 3;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(r === 0 ? 0.32 : 0.16, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
        src.connect(bp); bp.connect(g); g.connect(out); src.start(t); src.stop(t + 0.05);
      }
    }
    /* paper tear at the end */
    var tb = actx.createBuffer(1, Math.floor(sr * 0.22), sr), td = tb.getChannelData(0);
    for (var k = 0; k < td.length; k++) td[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / td.length, 1.5);
    var ts = actx.createBufferSource(), thp = actx.createBiquadFilter(), tg = actx.createGain();
    ts.buffer = tb; thp.type = 'highpass'; thp.frequency.setValueAtTime(1200, now + secs); thp.frequency.linearRampToValueAtTime(4200, now + secs + 0.2);
    tg.gain.value = 0.22; ts.connect(thp); thp.connect(tg); tg.connect(out); ts.start(now + secs + 0.02);
  } catch (e) {}
}
function openModal() {
  lastFocus = document.activeElement;
  var paper = $('#nq-paper'), pdfB = $('#nq-pdf');
  paper.innerHTML = receipt();
  paper.classList.remove('nq-go', 'nq-in');
  modal.classList.remove('nq-done');
  pdfB.disabled = true;
  modal.hidden = false;
  document.documentElement.style.overflow = 'hidden';
  snd('open');
  void paper.offsetWidth;
  var done = function () { modal.classList.add('nq-done'); pdfB.disabled = false; pdfB.focus(); snd('success'); };
  if (reduce) { paper.classList.add('nq-in'); done(); return; }
  paper.classList.add('nq-go');
  printNoise(2.6);
  requestAnimationFrame(function () { paper.classList.add('nq-in'); });
  clearTimeout(printTimer); printTimer = setTimeout(done, 2700);
}
function closeModal() {
  if (!modal || modal.hidden) return;
  clearTimeout(printTimer);
  modal.hidden = true; document.documentElement.style.overflow = '';
  snd('close');
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
$('#nq-print').addEventListener('click', openModal);
$$('#nq-modal [data-close]').forEach(function (b) { b.addEventListener('click', closeModal); });

function loadPdf() {
  return new Promise(function (ok, bad) {
    if (window.jspdf && window.jspdf.jsPDF) return ok(window.jspdf.jsPDF);
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload = function () { window.jspdf && window.jspdf.jsPDF ? ok(window.jspdf.jsPDF) : bad(); };
    s.onerror = bad;
    document.head.appendChild(s);
  });
}
var LOGO = 'data:image/png;base64,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';
var SIGPNG = 'data:image/png;base64,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';
var SIGIMG = Q.from === 'james' ? null : SIGPNG;
var sigReady = Q.from === 'james' ? sigPng(FROM).then(function (u) { SIGIMG = u; }, function () {}) : Promise.resolve();
function ordinal(d) { var n = d.getDate(), s = (n % 10 === 1 && n !== 11) ? 'st' : (n % 10 === 2 && n !== 12) ? 'nd' : (n % 10 === 3 && n !== 13) ? 'rd' : 'th'; return n + s + ' ' + d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); }
function makePdf(jsPDF) {
  var t = totals(), d = new jsPDF({ unit: 'mm', format: 'a4' }), W = 210, H = 297, L = 27, R = 183, y = 0;
  var slate = [63, 81, 96], dark = [40, 51, 56], grey = [125, 125, 125];
  var col = function (c) { d.setTextColor(c[0], c[1], c[2]); };
  var head = function () {
    d.setFillColor(slate[0], slate[1], slate[2]); d.rect(46, 0, W - 46, 6, 'F');
    d.addImage(LOGO, 'PNG', 14, 13, 17, 17);
    d.setDrawColor(40, 40, 40); d.setLineWidth(0.35); d.line(39, 13, 39, 30);
    d.setFont('helvetica', 'normal'); d.setFontSize(10); col(grey);
    d.text('Funnal Ltd', 43, 18); d.text(ordinal(today), 43, 23);
  };
  var foot = function () {
    d.setFillColor(slate[0], slate[1], slate[2]); d.rect(0, H - 5, 46, 5, 'F');
    d.setDrawColor(40, 40, 40); d.setLineWidth(0.35); d.line(39, H - 34, 39, H - 9);
    d.setFont('helvetica', 'normal'); d.setFontSize(7.5); col(grey);
    ['Pennine Business Park, Abacus House,', 'Longbow Cl, Huddersfield HD2 1GQ', '+44 7597 222338', FROM.email + ', www.funnal.co.uk', 'Registered Company: 14615991']
      .forEach(function (s, i) { d.text(s, 43, H - 31 + i * 4.6); });
  };
  var page = function () { d.addPage(); head(); foot(); y = 46; };
  var need = function (h) { if (y + h > H - 42) page(); };
  var para = function (s, size, c, gap) {
    d.setFont('helvetica', 'normal'); d.setFontSize(size || 10); col(c || grey);
    var w = d.splitTextToSize(s, R - L); need(w.length * 4.6); d.text(w, L, y); y += w.length * 4.6 + (gap === undefined ? 3 : gap);
  };
  var h2 = function (s) { need(12); d.setFont('helvetica', 'normal'); d.setFontSize(11.5); col(dark); d.text(s, L, y); y += 5.2; };
  var bullet = function (s) {
    d.setFont('helvetica', 'normal'); d.setFontSize(10); col(grey);
    var w = d.splitTextToSize(s, R - L - 6); need(w.length * 4.5); d.text('•', L + 1, y); d.text(w, L + 6, y); y += w.length * 4.5;
  };

  head(); foot(); y = 46;
  para('Hi ' + plain(Q.greet || 'there') + ',', 10.5, grey, 5);
  if (Q.letterThanks) para(plain(Q.letterThanks), 10, grey, 4);
  if (Q.intro) para(plain(Q.intro), 10, grey, 4);
  para('Please see below your personalised quote;', 10, grey, 6);

  need(20);
  d.setFont('helvetica', 'normal'); d.setFontSize(11.5);
  var nm = plain(t.p.name) + (/package/i.test(t.p.name) ? '' : ' Package'), nw = d.getTextWidth(nm);
  d.setFillColor(250, 217, 181); d.rect(L - 0.8, y - 4.3, nw + 1.6, 5.6, 'F');
  col(dark); d.text(nm, L, y); y += 5.2;
  d.text(gbp(t.p.price) + ' ' + plain(PER(t.p)), L, y); y += 5.2;
  if (t.p.care) { d.text('+ ' + gbp(t.p.care) + ' per month for ' + plain(t.p.careName).charAt(0).toLowerCase() + plain(t.p.careName).slice(1), L, y); y += 5.2; } y += 2.8;

  h2('What’s included');
  ITEMS.filter(function (it) { return it[3] <= pk; }).forEach(function (it) { bullet(plain(it[0])); });
  y += 4;

  if (ADD.length) { h2('Monthly services');
  if (t.lines.length) t.lines.forEach(function (l) { bullet(plain(l.n) + ' – ' + gbp(l.m) + ' per month'); });
  else bullet('None added yet. These can be added at any time.');
  if (NOSET) bullet('No set-up fees with your package');
  y += 4; }

  h2('Your totals');
  bullet('One-off total – ' + gbp(t.one));
  bullet('Monthly total – ' + gbp(t.month) + ' per month');
  y += 4;

  h2('Payment');
  para(plain(Q.payment || 'Payment terms are set out in the terms below.'), 10, grey, 4);

  need(12); d.setDrawColor(40, 40, 40); d.setLineWidth(0.3); d.line(L, y, R, y); y += 5;
  d.setFont('helvetica', 'normal'); d.setFontSize(9.5); col(grey); d.text('Terms & Conditions on next page', L, y);

  page();
  h2('Terms & Conditions'); y += 1;
  (Q.terms || []).map(plain)
    .forEach(bullet);
  y += 5; d.setDrawColor(40, 40, 40); d.setLineWidth(0.3); d.line(L, y, R, y); y += 12;
  d.setFont('helvetica', 'normal'); d.setFontSize(10); col(grey); d.text('Kindest Regards,', L, y); y += 4;
  if (SIGIMG) d.addImage(SIGIMG, 'PNG', L - 1, y, 38, 11.2); y += 15;
  d.setFontSize(10.5); col(dark); d.text(FROM.full, L, y); y += 4.6;
  d.setFontSize(10); col(grey); d.text(FROM.title, L, y);
  d.save(plain(Q.business || 'Funnal').replace(/[^A-Za-z0-9]+/g, '-') + '-quote-' + plain(t.p.name).replace(/[^A-Za-z0-9]+/g, '-') + '.pdf');
}

$('#nq-pdf').addEventListener('click', function () {
  var b = $('#nq-pdf'); b.disabled = true; b.textContent = 'Preparing PDF…';
  loadPdf().then(function (J) { return sigReady.then(function () { makePdf(J); }); }).then(function () { snd('success'); say('Your quote PDF is downloading'); }, function () { say('Could not create the PDF. Email ' + FROM.email + ' and we’ll send it.'); })
    .then(function () { b.disabled = false; b.textContent = 'Download PDF'; });
});

stepPrices();
renderCmp();
acceptWire();
choose(0, true);
renderAddons();
renderPlan();

function acceptWire() {
  var btn = $('#nq-accept'), box = $('#nq-accepted'), m = $('#nq-amodal');
  var choice = function () { var t = totals(); return plain(t.p.name) + (t.lines.length ? ' + ' + t.lines.map(function (l) { return plain(l.n); }).join(', ') : ''); };
  var done = function (c) { btn.hidden = true; box.hidden = false; box.innerHTML = '<b>Accepted, thank you.</b> You chose ' + e(c) + '. ' + e(FROM.full.split(' ')[0]) + ' will be in touch to agree a start date.'; };
  if (META.status === 'accepted') done(META.accepted_choice || '');
  if (!TOK) btn.hidden = true;
  btn.addEventListener('click', function () { var t = totals(); $('#nq-a-h').textContent = plain(t.p.name); $('#nq-a-sum').innerHTML = [t.one ? '<b>' + gbp(t.one) + '</b> one-off' : '', t.month ? '<b>' + gbp(t.month) + '</b> a month' : ''].filter(Boolean).join(' · ') + (t.lines.length ? '<br>With ' + t.lines.map(function (l) { return l.n; }).join(', ') : ''); m.hidden = false; snd('open'); $('#nq-a-go').focus(); });
  $$('#nq-amodal [data-aclose]').forEach(function (b) { b.addEventListener('click', function () { m.hidden = true; snd('close'); }); });
  $('#nq-a-go').addEventListener('click', function () {
    var b = $('#nq-a-go'), c = choice(); b.disabled = true; b.textContent = 'Sending…';
    rpc('quote_accept', { p_token: TOK, p_choice: c }).then(function (ok) { m.hidden = true; if (ok) { done(c); snd('success'); say('Accepted. Thank you!'); } else { b.disabled = false; b.textContent = 'Yes, accept'; } }, function () { b.disabled = false; b.textContent = 'Try again'; });
  });
}
}
function rpc(fn, body) {
  return fetch(SB.url + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SB.key, Authorization: 'Bearer ' + SB.key }, body: JSON.stringify(body) })
    .then(function (r) { if (!r.ok) throw new Error('rpc ' + r.status); return r.json(); });
}
function gate() {
root.innerHTML =
'<section class="fn-wrap fn-sec nq-gate"><div class="nq-gate-c fn-fx-in">' +
'<span class="nq-lock" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span>' +
'<p class="fn-eyebrow" style="margin:0">Private quote</p>' +
'<h1 class="fn-h1">Your <em>Quote</em></h1>' +
'<p class="fn-lede">Enter the password we sent you to open it.</p>' +
'<form class="nq-form" novalidate><label class="nq-vh" for="nq-pw">Password</label>' +
'<div class="nq-field"><input id="nq-pw" name="nq-pw" type="password" autocomplete="current-password" placeholder="Password" required>' +
'<button class="fn-cta" type="submit">Open quote</button></div>' +
'<p class="nq-err" role="alert"></p></form></div></section>';
var form = root.querySelector('.nq-form'), input = root.querySelector('#nq-pw'), btn = form.querySelector('button'), err = root.querySelector('.nq-err'), card = root.querySelector('.nq-gate-c');
form.addEventListener('submit', function (e) {
e.preventDefault();
var pw = input.value;
if (!pw) { err.textContent = 'Enter the password to open the quote.'; input.focus(); return; }
btn.disabled = true; btn.textContent = 'Opening…'; err.textContent = '';
unlock(pw).then(function (d) {
try { sessionStorage.setItem(KEY, pw); } catch (x) {}
snd('success');
card.classList.add('nq-out');
setTimeout(function () { mount_(d); window.scrollTo(0, 0); }, 380);
}, function (x) {
btn.disabled = false; btn.textContent = 'Open quote';
err.textContent = x && x.message === 'nocrypto' ? 'This browser cannot open the quote. Try an up-to-date browser.' : 'That password is not right. Check the email we sent and try again.';
snd('close');
card.classList.remove('nq-shake'); void card.offsetWidth; card.classList.add('nq-shake');
input.select();
});
});
}
function mount_(d) { mount(d, window.__fqMeta); }
if (!TOK || !SB.url) { mount(null); msg('This link isn\'t complete', 'Check you copied the whole link from our email, or get in touch and we\'ll send it again.'); return; }
root.innerHTML = '<section class="fn-wrap fn-sec"><div class="nq-msg"><p class="fn-eyebrow" style="margin:0">Opening your quote…</p></div></section>';
rpc('quote_get', { p_token: TOK, p_peek: PEEK }).then(function (res) {
  if (!document.getElementById('fq-style')) { var st = document.createElement('style'); st.id = 'fq-style'; st.textContent = STYLE; document.head.appendChild(st); }
  if (!res) { msg('This quote isn\'t available', 'It may have been replaced by a newer one. Get in touch and we\'ll send you the latest.'); return; }
  window.__fqMeta = res;
  if (res.has_pw) { P = res.enc; var saved = null; try { saved = sessionStorage.getItem(KEY); } catch (x) {} if (saved) { unlock(saved).then(function (d) { mount(d, res); }, gate); } else gate(); }
  else mount(res.data, res);
}, function () { msg('We couldn\'t open your quote', 'Please refresh the page. If it still doesn\'t open, email us and we\'ll send it as a PDF.'); });
})();
