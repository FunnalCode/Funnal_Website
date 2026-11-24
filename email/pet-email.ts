// Hundred Cannons emails (called every 2 minutes by pg_cron). Every email is personal: Sam and James each get their own.
//  - The Salty Herald, every working day at 08:00: a hello, "Today on deck" (your diary today and your follow-ups due
//    today, plus anything unassigned), yesterday's scoreboard from your side, and the Herald's front page (stories and
//    drawing published by the game into hl_herald). On Sundays it is the Sunday Herald, with the week in numbers.
//  - The pet sighting email, once a working day at the sighting start, with how many DMs you've logged so far today.
// Looks like the game: cream cards, Fredoka headings, Nunito text, gold buttons, Sam orange and James blue.
// The Resend key, sender and addresses live in hl_private (server-only: resend_key, mail_from, mail_sam, mail_james,
// mail_owner; mail_to is the old shared list), never in this file.
// ?dry shows what would send; ?test sends a test email now.
// ?html=herald|sunday|pet&me=sam|james returns that email as a page (nothing sent); ?preview=... sends both captains'
// versions to the owner only; &date=YYYY-MM-DD.
const KEY_URL = Deno.env.get("SUPABASE_URL")!;
const SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const IMG = "https://cdn.jsdelivr.net/gh/FunnalCode/Funnal_Website@9e3be02df23c056a6c333ae5f9b3b2bb4cd5eb52/assets/email/hc/";
const SITE = "https://funnal.co.uk/crew";
const DISPLAY = "'Fredoka','Nunito','Trebuchet MS',Arial,sans-serif";
const BODY = "'Nunito','Trebuchet MS',Arial,sans-serif";
// the game's palette
const BG = "#F5EFDF", CARD = "#FFFCF4", CARD2 = "#FBF5E6", LINE = "#EADFC6", SHADOW = "#E2D5B6", INK = "#3F5160", SOFT = "#66717C",
  GOLD = "#DDA94D", GOLD_DK = "#B8862E", BRACKEN = "#E06034", GOOD = "#3FA57E", BAD = "#D9485F";
const P = ["sam", "james"];
const NAME: Record<string, string> = { sam: "Sam", james: "James" };
const COL: Record<string, string> = { sam: "#E07A34", james: "#4A7EC2" };

function h32(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i) & 0xff; h = Math.imul(h, 16777619) >>> 0; }
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995) >>> 0; h ^= h >>> 15; return h >>> 0;
}
function sighting(D: string) {
  let x = h32(D + "rar") % 100, rar = "common";
  for (const [k, w] of [["common", 45], ["uncommon", 27], ["rare", 15], ["epic", 8], ["legendary", 4], ["mythic", 1]] as [string, number][]) { if (x < w) { rar = k; break; } x -= w; }
  const NEW: Record<string, [number, number]> = { common: [5, 30], uncommon: [8, 30], rare: [14, 35], epic: [22, 40], legendary: [35, 45], mythic: [50, 45] };
  const [need, win] = NEW[rar]; const sm = 420 + h32(D + "sight") % (720 - win);
  const f = (m: number) => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
  return { rar, need, win, sm, em: sm + win, st: f(sm), en: f(sm + win) };
}
function ukNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { D: `${p.year}-${p.month}-${p.day}`, min: (+p.hour % 24) * 60 + +p.minute };
}
async function rest(path: string, init: RequestInit = {}) {
  return fetch(`${KEY_URL}/rest/v1/${path}`, { ...init, headers: { apikey: SRK, Authorization: `Bearer ${SRK}`, "Content-Type": "application/json", ...(init.headers || {}) } });
}
async function J(path: string) { const r = await rest(path); return r.ok ? r.json() : []; }
const PRIV: Record<string, string> = {};
async function priv(k: string) { if (k in PRIV) return PRIV[k]; const r = await rest(`hl_private?k=eq.${k}&select=v`); const j = r.ok ? await r.json() : []; PRIV[k] = (j[0] && j[0].v) || ""; return PRIV[k]; }
async function owner() { return (await priv("mail_owner")) || ""; }
async function addr(p: string) { return Deno.env.get("MAIL_" + p.toUpperCase()) || (await priv("mail_" + p)) || ""; }
async function resendKey() { return Deno.env.get("RESEND_API_KEY") || (await priv("resend_key")) || ""; }
async function mail(subject: string, html: string, text: string, to: string[]) {
  const key = await resendKey(); if (!key) throw new Error("no key");
  to = to.filter(Boolean); if (!to.length) throw new Error("no recipient: set mail_sam / mail_james in hl_private");
  const from = Deno.env.get("MAIL_FROM") || (await priv("mail_from")) || "Hundred Cannons <onboarding@resend.dev>";
  const go = (f: string, t: string[]) => fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: f, to: t, subject, html, text }) });
  let r = await go(from, to); let out = await r.text();
  // domain not verified: Resend's test sender, which can only email the account owner
  if (!r.ok && /verif|domain|own email/i.test(out) && !/resend\.dev/.test(from)) { const o = await owner(); if (o) { r = await go("Hundred Cannons <onboarding@resend.dev>", [o]); out = (await r.text()) + " (sent from the Resend test address to the account owner only: verify funnal.co.uk in Resend)"; } }
  if (!r.ok) throw new Error(out); return out;
}
async function claim(k: string) { const r = await rest("hl_notify_log?on_conflict=k", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=representation" }, body: JSON.stringify({ k }) }); const j = await r.json().catch(() => []); return Array.isArray(j) && j.length > 0; }
async function unclaim(k: string) { await rest(`hl_notify_log?k=eq.${encodeURIComponent(k)}`, { method: "DELETE" }); }
const esc = (x: unknown) => String(x ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
// the Herald's stories arrive as small bits of HTML from the game: keep only <b>, <i> and line breaks
const story = (h: unknown) => String(h ?? "").replace(/<(?!\/?(b|i)>)[^>]*>/gi, "").replace(/\n/g, "<br>");
const dayAdd = (d: string, n: number) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const ukDay = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date(iso));
const ukTime = (iso: string) => new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
const longDate = (d: string) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(new Date(d + "T12:00:00Z"));
const subjDate = (d: string) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(new Date(d + "T12:00:00Z"));
const shortDay = (d: string) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short" }).format(new Date(d + "T12:00:00Z"));
const money = (n: number) => "£" + Math.round(n || 0).toLocaleString("en-GB");
const n0 = (n: number) => Math.round(n || 0).toLocaleString("en-GB");
const isSunday = (d: string) => new Date(d + "T12:00:00Z").getUTCDay() === 0;
const plural = (n: number, one: string, many = one + "s") => `${n} ${n === 1 ? one : many}`;
const other = (me: string) => P.find((p) => p !== me) || me;

// ---------- design pieces (the game's look) ----------
const T = (inner: string, style = "", attrs = "") => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ${attrs} style="${style}">${inner}</table>`;
const card = (inner: string, pad = "20px 20px") => `<tr><td style="padding:0 16px 18px">${T(`<tr><td style="padding:${pad}">${inner}</td></tr>`, `background:${CARD};border-radius:22px;box-shadow:0 4px 0 ${SHADOW};border:1px solid ${LINE}`, `bgcolor="${CARD}"`)}</td></tr>`;
function button(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto"><tr><td align="center" bgcolor="${GOLD}" style="background:${GOLD};border-radius:99px;box-shadow:0 4px 0 ${GOLD_DK}"><a href="${href}" target="_blank" style="display:inline-block;padding:14px 34px;font-family:${DISPLAY};font-size:17px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:99px"><font color="#FFFFFF">${label}</font></a></td></tr></table>`;
}
const pillBtn = (label: string, href: string) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto"><tr><td align="center" bgcolor="${CARD}" style="background:${CARD};border-radius:99px;border:2px solid ${LINE};box-shadow:0 3px 0 ${SHADOW}"><a href="${href}" target="_blank" style="display:inline-block;padding:10px 22px;font-family:${DISPLAY};font-size:15px;font-weight:600;color:${INK};text-decoration:none">${label}</a></td></tr></table>`;
const pre = (t: string) => `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(t)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>`;
function page(preheader: string, inner: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>Hundred Cannons</title><link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet"><style>@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800&display=swap');</style></head><body style="margin:0;padding:0;background:${BG}" bgcolor="${BG}">${pre(preheader)}<div style="background:${BG};padding:14px 4px 30px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;margin:0 auto">${inner}</table><div style="max-width:620px;margin:6px auto 0;text-align:center;font-family:${BODY};font-size:12px;font-weight:700;color:#A3967A">Hundred Cannons &middot; Funnal crew only &middot; <a href="${SITE}" style="color:#A3967A">funnal.co.uk/crew</a></div></div></body></html>`;
}
const label = (t: string, c = SOFT) => `<div style="font-family:${DISPLAY};font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:${c}">${t}</div>`;
const h2 = (t: string) => `<div style="font-family:${DISPLAY};font-size:24px;font-weight:600;line-height:1.2;color:${INK};margin-top:4px">${t}</div>`;
const col = (t: string, body: string) => body ? `<div style="display:inline-block;vertical-align:top;width:100%;max-width:262px;margin:0 6px 16px;text-align:left">${T(`<tr><td style="padding:14px 16px">${label(t, BRACKEN)}<div style="font-family:${BODY};font-size:15px;font-weight:600;line-height:1.55;color:${INK};padding-top:6px">${body}</div></td></tr>`, `background:${CARD2};border-radius:16px`)}</div>` : "";
function masthead(title: string, hello: string, line: string, D: string, me: string) {
  return `<tr><td align="center" style="padding:18px 16px 20px">
    <div style="display:inline-block;font-family:${DISPLAY};font-size:14px;font-weight:600;color:#FFFFFF;background:${COL[me] || INK};border-radius:99px;padding:6px 14px">${hello}</div>
    <div style="font-family:${DISPLAY};font-size:44px;font-weight:700;line-height:1.05;color:${BRACKEN};margin-top:12px">${title}</div>
    <div style="font-family:${BODY};font-size:14px;font-weight:700;color:${SOFT};margin-top:8px">${esc(longDate(D))}</div>
    ${line ? `<div style="font-family:${BODY};font-size:16px;font-weight:700;color:${INK};margin-top:12px;line-height:1.45">${line}</div>` : ""}</td></tr>`;
}

// ---------- game numbers, worked out from the raw logs ----------
type Day = { date: string; p: Record<string, Record<string, number>>; team: number; target: number; hit: boolean };
async function gameData() {
  const [cfgRow, docs] = await Promise.all([J("hl_docs?path=eq.config/main&select=data"), J("hl_docs?coll=eq.days&select=path,data")]);
  const cfg = (cfgRow[0] && cfgRow[0].data) || {};
  const days: Record<string, Day> = {};
  const blank = () => ({ d: 0, f: 0, r: 0, v: 0, m: 0, c: 0 });
  for (const r of docs) {
    const m = /^days\/(\d{4}-\d{2}-\d{2})_(\w+)$/.exec(r.path); if (!m) continue; const [, date, pid] = m;
    const D = days[date] || (days[date] = { date, p: Object.fromEntries(P.map((p) => [p, blank()])), team: 0, target: 0, hit: false });
    const c = D.p[pid] || (D.p[pid] = blank());
    for (const e of Object.values((r.data && r.data.ev) || {}) as any[]) { if (!e || e.u) continue; if (e.k in c) c[e.k]++; }
  }
  const wd: number[] = cfg.workdays || [1, 2, 3, 4, 5]; const hol: any = cfg.holidays || {}; const isHol = (d: string) => Array.isArray(hol) ? hol.includes(d) : d in hol;
  const target = (d: string) => {
    if (!wd.includes(new Date(d + "T12:00:00Z").getUTCDay()) || isHol(d)) return 0;
    const abs = cfg.absences || {}; const present = P.filter((p) => !abs[d + "_" + p]).length; if (!present) return 0;
    return present === P.length ? (cfg.target || 100) : Math.max(1, Math.round((cfg.target || 100) * (cfg.absenceScale ?? 0.5) * present / (P.length - 1 || 1)));
  };
  const day = (d: string): Day => { const D = days[d] || { date: d, p: Object.fromEntries(P.map((p) => [p, blank()])), team: 0, target: 0, hit: false }; D.team = P.reduce((a, p) => a + (D.p[p]?.d || 0), 0); D.target = target(d); D.hit = D.target > 0 && D.team >= D.target; return D; };
  const best = Object.keys(days).map(day).reduce((a, D) => D.team > a.team ? D : a, { team: 0, date: "" } as any);
  return { day, best, cfg };
}

// ---------- today on deck: your diary and your follow-ups due today ----------
const GAP: Record<string, number> = { video_needed: 7, messaged: 5, followed_up: 5, talking: 3, quote_sent: 4 };
const STAGE: Record<string, string> = { video_needed: "Video needed", video_made: "Video made", messaged: "Video sent", followed_up: "Followed up", talking: "Talking", meeting: "Meeting", quote_sent: "Quote sent", not_now: "Not now", client: "Client" };
const KIND: Record<string, string> = { meeting: "Meeting", call: "Call", google: "Calendar", task: "Task", reminder: "Reminder" };
function dueOf(r: any): string | null {
  if (["archived", "client", "no_response"].includes(r.stage)) return null; if (r.stage === "not_now") return r.return_on || null;
  if (r.stage === "meeting" && !r.meeting_held && r.meeting_at) return String(r.meeting_at).slice(0, 10);
  if (r.next_due) return r.next_due; const g = GAP[r.stage];
  // a video that has waited a week (from the last contact, or from when they were added) is due
  const base = r.last_contact || (r.stage === "video_needed" && r.created_at ? String(r.created_at).slice(0, 10) : null);
  return g && base ? dayAdd(base, g) : null;
}
function drow(left: string, title: string, sub: string, chip = CARD2, chipInk = INK) {
  return `<tr><td style="padding:0 0 8px">${T(`<tr><td width="70" valign="middle" style="padding:12px 0 12px 12px"><div style="display:inline-block;background:${chip};color:${chipInk};font-family:${DISPLAY};font-size:14px;font-weight:600;padding:5px 10px;border-radius:99px;white-space:nowrap">${left}</div></td><td valign="middle" style="padding:12px 14px 12px 8px;font-family:${BODY}"><div style="font-size:16px;font-weight:800;color:${INK};line-height:1.3">${title}</div>${sub ? `<div style="font-size:13px;font-weight:700;color:${SOFT};margin-top:2px;line-height:1.4">${sub}</div>` : ""}</td></tr>`, `background:${CARD2};border-radius:16px`)}</td></tr>`;
}
async function todayBlock(D: string, me: string) {
  const [pros, evs, pays, quotes, qev] = await Promise.all([
    J("hl_prospects?select=id,business,contact,stage,last_contact,next_due,next_action,return_on,meeting_at,meeting_held,owner,created_at&limit=5000"),
    J(`hl_events?select=*&deleted=eq.false&starts_at=gte.${dayAdd(D, -1)}T00:00:00Z&starts_at=lt.${dayAdd(D, 2)}T00:00:00Z&order=starts_at`),
    J(`hl_payments?select=*&paid_at=is.null&due=eq.${D}`),
    J("hl_quotes?select=id,prospect_id,status,valid_until,viewed_at,title&status=in.(sent,viewed)"),
    J(`hl_quote_events?select=quote_id&kind=eq.open&at=gte.${dayAdd(D, -1)}T00:00:00Z`)]);
  const byId: Record<string, any> = Object.fromEntries((pros as any[]).map((p) => [p.id, p]));
  const mine = (o: unknown) => !o || o === me; // yours, or nobody's yet
  const tag = (o: string) => o && o !== me ? ` &middot; ${NAME[o] || ""}` : "";
  const today = (evs as any[]).filter((e) => (e.all_day ? String(e.starts_at).slice(0, 10) : ukDay(e.starts_at)) === D && mine(e.owner))
    .sort((a, b) => (a.all_day ? 0 : 1) - (b.all_day ? 0 : 1) || String(a.starts_at).localeCompare(String(b.starts_at)));
  const diary = today.map((e: any) => drow(e.all_day ? "All day" : ukTime(e.starts_at), esc(e.title || "(No title)"), `${e.prospect_id && byId[e.prospect_id] ? esc(byId[e.prospect_id].business) + " &middot; " : ""}${esc(KIND[e.kind] || "Calendar")}${e.location ? " &middot; " + esc(e.location) : ""}`, "#E4F0FA", "#2F5E8C"));
  const inDiary = new Set(today.map((e: any) => e.prospect_id).filter(Boolean));
  const dueToday = (pros as any[]).filter((r) => mine(r.owner) && dueOf(r) === D && !(r.stage === "meeting" && inDiary.has(r.id)));
  const fu = dueToday.map((r) => {
    const what = r.stage === "meeting" ? "Meeting today" : r.stage === "video_needed" ? "Video waiting a week: make it today" : r.stage === "not_now" ? "Back on the list today" : r.next_action ? esc(r.next_action) : `Follow up &middot; ${esc(STAGE[r.stage] || r.stage)}`;
    return drow("&#10003;", esc(r.business || "Unnamed"), `${what}${r.contact ? " &middot; " + esc(r.contact) : ""}`, "#E3F4EC", GOOD);
  });
  // videos that have waited more than a week: one gentle line, oldest first
  const late = (pros as any[]).filter((r) => r.stage === "video_needed" && mine(r.owner) && (dueOf(r) || "9999") < D).sort((x, y) => String(dueOf(x)).localeCompare(String(dueOf(y))));
  if (late.length) fu.push(drow("&#9654;", `${plural(late.length, "video")} waiting over a week`, late.slice(0, 3).map((r) => esc(r.business || "Unnamed")).join(", ") + (late.length > 3 ? ` and ${late.length - 3} more` : ""), "#F1E8FB", "#7A4FB8"));
  const py = (pays as any[]).filter((p) => mine(byId[p.prospect_id]?.owner)).map((p) => drow("&pound;", `${esc(byId[p.prospect_id]?.business || "Client")} pays today`, money(p.amount) + tag(byId[p.prospect_id]?.owner), "#FDEBDD", BRACKEN));
  const opens: Record<string, number> = {}; for (const e of qev as any[]) opens[e.quote_id] = (opens[e.quote_id] || 0) + 1;
  const qs: string[] = [];
  for (const q of quotes as any[]) {
    const pr = byId[q.prospect_id]; if (pr && !mine(pr.owner)) continue;
    const b = pr?.business ? esc(pr.business) : esc(q.title || "A quote");
    const opened = opens[q.id] || (q.viewed_at && q.viewed_at >= dayAdd(D, -1) + "T00:00:00Z" ? 1 : 0);
    if (opened) qs.push(drow("&#9733;", `${b} opened your quote`, `${opened > 1 ? opened + " times " : ""}since yesterday. A good day to call.`, "#FBF0D6", GOLD_DK));
    else if (q.valid_until === D) qs.push(drow("&#9203;", `${b}: quote ends today`, "Worth a nudge.", "#FBF0D6", GOLD_DK));
  }
  const rows = [...diary, ...fu, ...py, ...qs]; const n = rows.length;
  const parts = [diary.length && `${diary.length} in your diary`, fu.length && plural(fu.length, "follow-up"), py.length && plural(py.length, "payment"), qs.length && plural(qs.length, "quote")].filter(Boolean) as string[];
  const sum = n ? parts.join(", ") : "a clear horizon";
  const block = card(`${label("Today on deck", BRACKEN)}${h2(n ? `${plural(n, "thing")} on today` : "A clear horizon today")}
      <div style="font-family:${BODY};font-size:14px;font-weight:700;color:${SOFT};margin:4px 0 14px">${n ? parts.join(" &middot; ") : "Nothing in your diary and no follow-ups due. Plenty of room for DMs."}</div>
      ${n ? T(rows.join("")) : ""}<div style="height:6px"></div>${pillBtn("Open the pipeline &rarr;", SITE + "#pipeline")}`);
  const text = `Today on deck: ${sum}.\n${today.map((e: any) => `- ${e.all_day ? "All day" : ukTime(e.starts_at)} ${e.title}`).join("\n")}\n${dueToday.map((r) => `- Follow up: ${r.business}`).join("\n")}`;
  return { block, text, n, sum };
}

// ---------- the Sunday pages: the week in numbers ----------
async function weekBlock(G: any, D: string, me: string) {
  const days = Array.from({ length: 7 }, (_, i) => dayAdd(D, i - 7)), prev = Array.from({ length: 7 }, (_, i) => dayAdd(D, i - 14));
  const W = days.map(G.day), PW = prev.map(G.day);
  const tot = (L: Day[], k: string, who = P) => L.reduce((a, x) => a + who.reduce((b: number, p: string) => b + (x.p[p]?.[k] || 0), 0), 0);
  const dm = tot(W, "d"), pdm = tot(PW, "d"); const ch = pdm ? Math.round((dm - pdm) / pdm * 100) : 0;
  const myW = tot(W, "d", [me]), myP = tot(PW, "d", [me]), myCh = myP ? Math.round((myW - myP) / myP * 100) : 0;
  const hits = W.filter((x) => x.hit).length, work = W.filter((x) => x.target > 0).length;
  const bestD = W.reduce((a, x) => x.team > a.team ? x : a, W[0]);
  const mx = Math.max(1, ...W.map((x) => x.team));
  const bars = W.map((x) => {
    const seg = (p: string) => { const v = x.p[p]?.d || 0; const h = Math.round(v / mx * 120); return h ? `<div style="height:${h}px;line-height:${h}px;font-size:0;background:${COL[p]};${p === me ? "" : "opacity:.45;"}">&nbsp;</div>` : ""; };
    return `<td align="center" valign="bottom" style="padding:0 4px;font-family:${DISPLAY}"><div style="font-size:14px;font-weight:600;color:${x.hit ? GOOD : INK};margin-bottom:5px">${x.team}${x.hit ? " &#10003;" : ""}</div><div style="border-radius:10px 10px 4px 4px;overflow:hidden">${seg(other(me))}${seg(me)}${x.team ? "" : `<div style="height:4px;font-size:0;line-height:0;background:${LINE}">&nbsp;</div>`}</div><div style="font-size:12px;font-weight:600;color:${SOFT};margin-top:6px">${shortDay(x.date)}</div></td>`;
  }).join("");
  const from = days[0], to = D;
  const [newP, won, paid, qsent, qo] = await Promise.all([
    J(`hl_prospects?select=id&created_at=gte.${from}T00:00:00Z&created_at=lt.${to}T00:00:00Z`),
    J(`hl_prospects?select=id&won_at=gte.${from}&won_at=lt.${to}`),
    J(`hl_payments?select=amount&paid_at=gte.${from}T00:00:00Z&paid_at=lt.${to}T00:00:00Z`),
    J(`hl_quotes?select=id&status=neq.draft&created_at=gte.${from}T00:00:00Z&created_at=lt.${to}T00:00:00Z`),
    J(`hl_quote_events?select=id&kind=eq.open&at=gte.${from}T00:00:00Z&at=lt.${to}T00:00:00Z`)]);
  const money_in = (paid as any[]).reduce((a, p) => a + Number(p.amount || 0), 0);
  const tile = (v: string, l: string) => `<td width="33%" style="padding:4px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CARD2};border-radius:16px"><tr><td align="center" style="padding:14px 4px"><div style="font-family:${DISPLAY};font-size:24px;font-weight:600;color:${INK}">${v}</div><div style="font-family:${BODY};font-size:12px;font-weight:700;color:${SOFT};margin-top:2px">${l}</div></td></tr></table></td>`;
  const chip = (c: number, base: number) => base ? `<span style="display:inline-block;font-family:${DISPLAY};font-size:14px;font-weight:600;padding:4px 12px;border-radius:99px;background:${c >= 0 ? "#E3F4EC" : "#FBE3E7"};color:${c >= 0 ? GOOD : BAD}">${c >= 0 ? "&#9650;" : "&#9660;"} ${Math.abs(c)}% on last week</span>` : "";
  const html = card(`${label("Your week", COL[me])}
      <div style="font-family:${DISPLAY};font-size:60px;font-weight:700;line-height:1;color:${COL[me]};margin-top:8px">${n0(myW)}</div><div style="font-family:${BODY};font-size:15px;font-weight:700;color:${INK};margin:4px 0 10px">DMs from you this week</div>${chip(myCh, myP)}
      <div style="font-family:${BODY};font-size:14px;font-weight:700;color:${SOFT};margin-top:14px">The crew logged <b style="color:${INK}">${n0(dm)}</b> together${pdm ? ` (${ch >= 0 ? "+" : ""}${ch}% on last week)` : ""}. Target hit ${hits} of ${work} days, best day ${shortDay(bestD.date)} with ${bestD.team}.</div>
      <div style="height:16px"></div>${T(`<tr>${bars}</tr>`, "table-layout:fixed")}
      <div style="font-family:${BODY};font-size:12px;font-weight:700;color:${SOFT};margin:10px 0 16px"><span style="color:${COL[me]}">&#9632;</span> you &nbsp; <span style="color:${COL[other(me)]};opacity:.6">&#9632;</span> ${NAME[other(me)]}</div>
      ${T(`<tr>${tile(n0(tot(W, "f", [me])), "your follow-ups")}${tile(n0(tot(W, "r", [me])), "your replies")}${tile(n0(tot(W, "m", [me])), "your meetings")}</tr><tr>${tile(String((newP as any[]).length), "new prospects")}${tile(String((won as any[]).length), "clients won")}${tile(money(money_in), "money in")}</tr><tr>${tile(String((qsent as any[]).length), "quotes sent")}${tile(String((qo as any[]).length), "quote opens")}${tile(String(tot(W, "v")), "videos")}</tr>`)}`);
  const text = `Your week: ${myW} DMs. Crew: ${dm} DMs (${pdm ? (ch >= 0 ? "+" : "") + ch + "% on last week" : "first week"}), target hit ${hits} of ${work} days. Pipeline: ${(newP as any[]).length} new prospects, ${(won as any[]).length} clients won, ${money(money_in)} in.`;
  return { html, text, myW };
}

// ---------- The Salty Herald ----------
async function heraldMail(D: string, sunday: boolean, me: string, G?: any) {
  G = G || await gameData();
  const yd = dayAdd(D, -1); const Y = G.day(yd); const op = other(me);
  const hr = (await J(`hl_herald?d=eq.${yd}&select=data,img`))[0] || null; const h = (hr && hr.data) || {};
  const won = Y.target > 0 && Y.team >= Y.target;
  const head = h.head || (Y.target ? (won ? `Crew sinks the day: ${Y.team} DMs` : Y.team ? `${Y.target - Y.team} short. Gary "not angry, just disappointed"` : "A quiet day on the water") : "A day off. The sea was told to behave.");
  const deck = h.deck || (Y.target ? `The crew logged ${Y.team} of ${Y.target}.` : "No target yesterday.");
  const today = await todayBlock(D, me);
  const week = sunday ? await weekBlock(G, D, me) : null;
  const mineY = Y.p[me]?.d || 0, theirs = Y.p[op]?.d || 0;
  const line = !mineY && !theirs ? "Fresh start today. The cannons are loaded." : mineY > theirs ? `You won yesterday by ${mineY - theirs}. Keep the crown.` : mineY < theirs ? `${NAME[op]} beat you by ${theirs - mineY} yesterday. Time to take it back.` : "Dead heat yesterday. Someone has to blink first.";
  const side = (p: string) => { const v = Y.p[p]?.d || 0, lead = v > (Y.p[other(p)]?.d || 0);
    return `<td width="50%" align="center" valign="top" style="padding:6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CARD2};border-radius:18px;${p === me ? `border:2px solid ${COL[p]}` : `border:2px solid ${CARD2}`}"><tr><td align="center" style="padding:14px 8px"><div style="font-family:${DISPLAY};font-size:15px;font-weight:600;color:${COL[p]}">${p === me ? "You" : NAME[p]}${lead ? " &#128081;" : ""}</div><div style="font-family:${DISPLAY};font-size:54px;font-weight:700;line-height:1.05;color:${INK}">${v}</div><div style="font-family:${BODY};font-size:12px;font-weight:700;color:${SOFT};line-height:1.5">${plural(Y.p[p]?.f || 0, "follow-up")} &middot; ${plural(Y.p[p]?.r || 0, "reply", "replies")}${(Y.p[p]?.m || 0) ? ` &middot; ${plural(Y.p[p].m, "meeting")}` : ""}${(Y.p[p]?.c || 0) ? ` &middot; ${plural(Y.p[p].c, "client")}` : ""}</div></td></tr></table></td>`; };
  const pct = Y.target ? Math.min(100, Math.round(Y.team / Y.target * 100)) : 0;
  const record = G.best.date === yd && Y.team > 0;
  const score = card(`${label("Yesterday", BRACKEN)}<div style="height:8px"></div>${T(`<tr>${side(me)}${side(op)}</tr>`)}
     ${Y.target ? `<div style="height:12px"></div>${T(`<tr><td style="font-family:${BODY};font-size:14px;font-weight:800;color:${INK}">Crew ${Y.team} <span style="color:${SOFT}">of ${Y.target}</span></td><td align="right" style="font-family:${DISPLAY};font-size:14px;font-weight:600;color:${won ? GOOD : SOFT}">${won ? "Target hit &#10003;" : `${Y.target - Y.team} short`}${record ? ` &middot; <span style="color:${BAD}">record day!</span>` : ""}</td></tr>`)}
     <div style="height:8px"></div>${T(`<tr><td style="background:${LINE};border-radius:99px;height:14px;font-size:0;line-height:0">${T(`<tr><td style="background:${won ? GOOD : GOLD};border-radius:99px;height:14px;font-size:0;line-height:0">&nbsp;</td></tr>`, "", `width="${Math.max(3, pct)}%"`)}</td></tr>`)}` : `<div style="font-family:${BODY};font-size:14px;font-weight:700;color:${SOFT};margin-top:10px;text-align:center">No target yesterday.</div>`}`);
  const recs = [...(h.records || []).map((r: string) => esc(r)), ...(h.achs || []).map((x: any) => `${esc(x.p)}: <i>${esc(x.n)}</i>`)];
  const cols = [col("Hunting news", story(h.hunting)), col("Gary's Corner", story(h.gary)), col("Fishing report", story(h.fishing)), col("Forecast", story(h.forecast)), col("Leaderboard", story(h.leader)), col("Records &amp; trophies", recs.join("<br>")), col("Bottle post", story(h.bottle))].filter(Boolean).join("");
  const paper = card(`${label("The front page", BRACKEN)}${h.special ? `<div style="display:inline-block;margin-top:10px;background:${BAD};color:#FFFFFF;font-family:${DISPLAY};font-size:13px;font-weight:600;padding:4px 12px;border-radius:99px">${esc(h.special)}</div>` : ""}
     <div style="font-family:${DISPLAY};font-size:30px;font-weight:600;line-height:1.15;color:${INK};margin-top:10px">${esc(head)}</div>
     <div style="font-family:${BODY};font-size:16px;font-weight:700;line-height:1.5;color:${SOFT};margin-top:8px">${esc(deck)}</div>
     ${hr && hr.img ? `<img src="${esc(hr.img)}" width="540" alt="${esc(h.caption || "The Herald's front page")}" style="display:block;width:100%;max-width:540px;height:auto;border-radius:16px;margin-top:14px"><div style="font-family:${BODY};font-style:italic;font-size:13px;font-weight:600;color:${SOFT};margin-top:6px">${esc(h.caption || "")}</div>` : ""}
     ${cols ? `<div style="height:14px"></div><div style="font-size:0;text-align:center;margin:0 -6px">${cols}</div>` : `<div style="font-family:${BODY};font-size:15px;font-weight:700;color:${SOFT};margin-top:14px">Gary is still writing up yesterday's stories. They'll be waiting in the game.</div>`}
     ${h.stop ? `<div style="background:${BAD};padding:12px 16px;font-family:${DISPLAY};font-size:16px;font-weight:600;color:#FFFFFF;text-align:center;border-radius:16px;margin-top:4px">${esc(h.stop)}</div>` : ""}`, "20px 20px 18px");
  const title = sunday ? "The Sunday Herald" : "The Salty Herald";
  const hello = `${sunday ? "Happy Sunday" : "Morning"}, ${NAME[me]}!`;
  const inner = `${masthead(title, hello, line, D, me)}${today.block}${week ? week.html : ""}${score}${paper}
   <tr><td align="center" style="padding:8px 16px 26px">${button("Board the ship &rarr;", SITE)}<div style="font-family:${BODY};font-size:13px;font-weight:700;color:${SOFT};margin-top:16px">Printed at dawn by Gary the gull, Editor in Chief. He would like a chip.</div></td></tr>`;
  // clean subjects: the paper's name and the date; the personal line goes in the preview text
  const subject = `${title} · ${subjDate(D)}`;
  const pre = `${hello} ${line} ${today.n ? `Today: ${today.sum}.` : "Nothing in your diary today."}`;
  const text = `${title} - ${longDate(D)}\n${hello} ${line}\n\n${today.text}\n\n${head}\n${deck}\n\n${week ? week.text + "\n\n" : ""}Yesterday: you ${mineY}, ${NAME[op]} ${theirs}. Crew ${Y.team}${Y.target ? " of " + Y.target : ""}.\n\n${SITE}`;
  return { subject, html: page(pre, inner), text };
}

// ---------- pet sighting ----------
const RAR: Record<string, [string, string, string]> = { common: ["#8A97A5", "small and slightly suspicious", "Common"], uncommon: ["#3FA57E", "unusual", "Uncommon"], rare: ["#4A7EC2", "properly rare", "Rare"], epic: ["#8B5CF6", "epic", "Epic"], legendary: ["#DDA94D", "legendary", "Legendary"], mythic: ["#E0528A", "mythic, which almost never happens,", "Mythic"] };
const JOKES = ["Gary saw it first and has not stopped talking about it.", "It looked at the lighthouse like it owns the place.", "The parrot is already jealous.", "It has not signed any paperwork yet.", "Please do not tell it about the cannons.", "Finders keepers is legally binding at sea."];
async function petHtml(D: string, me: string, G?: any) {
  const s = sighting(D); const c = RAR[s.rar]; const an = /^[aeiou]/.test(s.rar) ? "an" : "a";
  G = G || await gameData(); const so = G.day(D).p[me]?.d || 0;
  const tile = (v: string, l: string) => `<td width="33%" style="padding:4px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CARD2};border-radius:16px"><tr><td align="center" style="padding:14px 4px"><div style="font-family:${DISPLAY};font-size:26px;font-weight:600;color:${c[0]};white-space:nowrap">${v}</div><div style="font-family:${BODY};font-size:12px;font-weight:700;color:${SOFT};margin-top:2px">${l}</div></td></tr></table></td>`;
  const inner = `<tr><td style="padding:4px 16px 18px">${T(`<tr><td style="line-height:0;font-size:0"><img src="${IMG}pet-${s.rar}.jpg" width="588" alt="Something glowing in the water at Funnal Cove" style="display:block;width:100%;max-width:588px;height:auto;border:0;border-radius:22px 22px 0 0"></td></tr>
   <tr><td align="center" style="padding:22px 24px 6px"><div style="display:inline-block;font-family:${DISPLAY};font-size:14px;font-weight:600;color:#FFFFFF;background:${c[0]};border-radius:99px;padding:6px 14px">${c[2]} pet sighting</div>
     <div style="font-family:${DISPLAY};font-size:30px;font-weight:600;line-height:1.15;color:${INK};margin-top:12px">${NAME[me]}, something ${c[1]} has surfaced!</div>
     <p style="font-family:${BODY};font-size:16px;font-weight:700;line-height:1.55;color:${SOFT};margin:12px 0 0">It's ${an} <b style="color:${c[0]}">${s.rar}</b> pet in Funnal Cove. Log <b style="color:${INK}">${s.need} DMs</b> before <b style="color:${INK}">${s.en}</b> and it's yours to keep.${so ? ` You've logged <b style="color:${COL[me]}">${so}</b> today so far.` : ""}</p></td></tr>
   <tr><td style="padding:14px 18px 6px">${T(`<tr>${tile(String(s.need), "DMs to log")}${tile(String(s.win), "minutes")}${tile(s.en, "gone at")}</tr>`)}</td></tr>
   <tr><td align="center" style="padding:18px 24px 26px">${button("Board the ship &rarr;", SITE)}<p style="font-family:${BODY};font-size:13px;font-weight:700;line-height:1.5;color:${SOFT};margin:18px 0 0">${JOKES[h32(D + "joke") % JOKES.length]} The pet stays a surprise until you claim it.<br>Gary the gull, Head of Pet Sightings</p></td></tr>`, `background:${CARD};border-radius:22px;box-shadow:0 4px 0 ${SHADOW};border:1px solid ${LINE}`, `bgcolor="${CARD}"`)}</td></tr>`;
  return { s, subject: `${c[2]} pet sighted · until ${s.en}`, html: page(`${NAME[me]}, log ${s.need} DMs by ${s.en} to claim it.`, inner), text: `${NAME[me]}, ${an} ${s.rar} pet is in Funnal Cove right now. Log ${s.need} DMs in Hundred Cannons by ${s.en} UK time to claim it. Board the ship: ${SITE}  -- Gary the gull` };
}
async function petMail(req: Request) {
  const u = new URL(req.url); const dry = u.searchParams.has("dry"); const now = ukNow(); const D = u.searchParams.get("date") || now.D;
  const s = sighting(D);
  if (!dry && (now.min < s.sm || now.min >= s.em)) return { skip: "outside window", D, ...s };
  const wd = await (await rest("rpc/hl_is_workday", { method: "POST", body: JSON.stringify({ d: D }) })).text();
  if (wd.trim() === "false") return { skip: "day off", D };
  if (dry) return { dry: true, D, ...s };
  const out: Record<string, string> = {}; const G = await gameData();
  for (const p of P) {
    const k = `pet-${D}-${p}`; const to = await addr(p); if (!to) { out[p] = "no address"; continue; }
    if (!(await claim(k))) { out[p] = "already sent"; continue; }
    try { const m = await petHtml(D, p, G); await mail(m.subject, m.html, m.text, [to]); out[p] = "sent"; } catch (e) { await unclaim(k); out[p] = (e as Error).message; }
  }
  return { D, ...out };
}

async function sample(kind: string, D: string, me: string) {
  if (kind === "pet") return petHtml(D, me);
  return heraldMail(D, kind === "sunday" || isSunday(D), me);
}

Deno.serve(async (req) => {
  const u = new URL(req.url); const dry = u.searchParams.has("dry"); const now = ukNow(); const res: Record<string, unknown> = {};
  const D = u.searchParams.get("date") || now.D; const me = P.includes(u.searchParams.get("me") || "") ? u.searchParams.get("me")! : "sam";
  if (u.searchParams.has("html")) { const m = await sample(u.searchParams.get("html") || "herald", D, me); return new Response(m.html, { headers: { "Content-Type": "text/html; charset=utf-8" } }); }
  if (u.searchParams.has("preview")) {
    const o = await owner(); const out: Record<string, string> = {};
    for (const p of P) { try { const m = await sample(u.searchParams.get("preview") || "herald", D, p); out[p] = await mail(`[Preview for ${NAME[p]}] ${m.subject}`, m.html, m.text, o ? [o] : []); } catch (e) { out[p] = (e as Error).message; } }
    return Response.json({ preview: out });
  }
  if (u.searchParams.has("test")) { try { const m = await heraldMail(now.D, false, me); const out = await mail("Hundred Cannons: email is working", m.html, m.text, [await addr(me)]); return Response.json({ test: "sent", out }); } catch (e) { return Response.json({ test: "failed", error: (e as Error).message }); } }
  if (dry || (now.min >= 480 && now.min < 540)) {
    // The Salty Herald goes out from 08:00 on working days (retries until 09:00 if sending fails), one per captain
    const wd = await (await rest("rpc/hl_is_workday", { method: "POST", body: JSON.stringify({ d: now.D }) })).text();
    if (dry) res.herald = { would: isSunday(now.D) ? "sunday" : "daily", workday: wd.trim() !== "false", to: Object.fromEntries(await Promise.all(P.map(async (p) => [p, !!(await addr(p))]))) };
    else if (wd.trim() !== "false") {
      const out: Record<string, string> = {}; let G: any = null;
      for (const p of P) {
        const k = `herald-${now.D}-${p}`; const to = await addr(p); if (!to) { out[p] = "no address"; continue; }
        if (!(await claim(k))) continue;
        try { G = G || await gameData(); const m = await heraldMail(now.D, isSunday(now.D), p, G); await mail(m.subject, m.html, m.text, [to]); out[p] = "sent"; } catch (e) { await unclaim(k); out[p] = (e as Error).message; }
      }
      res.herald = out;
    }
  }
  res.pet = await petMail(req);
  return Response.json(res);
});
