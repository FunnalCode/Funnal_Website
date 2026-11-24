// Hundred Cannons emails (called every 2 minutes by pg_cron):
//  - The Salty Herald, every working day at 08:00: yesterday's scoreboard, the Herald's stories and front-page drawing
//    (published by the game into hl_herald) and "Today on deck": the follow-ups due today and everything in the calendar
//    today, as a reminder. On Sundays it is the Sunday Herald, with the week in numbers for the game and the pipeline.
//  - The pet sighting email, once a working day at the sighting start.
// The Resend key, sender and recipients live in hl_private (server-only: resend_key, mail_from, mail_to, mail_owner),
// or the RESEND_API_KEY / MAIL_FROM / MAIL_TO secrets. No addresses are kept in this file.
// Until funnal.co.uk is verified in Resend, mail falls back to Resend's test sender, which only reaches the account owner.
// ?dry shows what would send; ?test sends a test email now.
// ?html=herald|sunday|pet returns that email as a page (nothing sent); ?preview=... sends it to the owner only; &date=YYYY-MM-DD.
const KEY_URL = Deno.env.get("SUPABASE_URL")!;
const SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const IMG = "https://cdn.jsdelivr.net/gh/FunnalCode/Funnal_Website@9e3be02df23c056a6c333ae5f9b3b2bb4cd5eb52/assets/email/hc/";
const SITE = "https://funnal.co.uk/crew";
const SERIF = "Georgia,'Times New Roman',Times,serif";
const SANS = "'Helvetica Neue',Helvetica,'Segoe UI',Arial,sans-serif";
// palette: night harbour and lantern gold
const NAVY = "#0E1A2B", DEEP = "#08111D", PANEL = "#15263D", LINE = "#24395A", GOLD = "#F2C462", GOLD2 = "#C99A2E", PAPER = "#F7F1E3", INK = "#1E1B16", MIST = "#9FB1C8";

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
async function resendKey() { return Deno.env.get("RESEND_API_KEY") || (await priv("resend_key")) || ""; }
async function mail(subject: string, html: string, text: string, only?: string[]) {
  const key = await resendKey(); if (!key) throw new Error("no key");
  const to = only || (Deno.env.get("MAIL_TO") || (await priv("mail_to")) || "").split(",").map((x) => x.trim()).filter(Boolean);
  if (!to.length) throw new Error("no recipients: set mail_to in hl_private");
  const from = Deno.env.get("MAIL_FROM") || (await priv("mail_from")) || "Hundred Cannons <onboarding@resend.dev>";
  const go = (f: string, t: string[]) => fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: f, to: t, subject, html, text }) });
  let r = await go(from, to); let out = await r.text();
  // domain not verified yet: Resend's test sender, which can only email the account owner
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
const shortDay = (d: string) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short" }).format(new Date(d + "T12:00:00Z"));
const money = (n: number) => "£" + Math.round(n || 0).toLocaleString("en-GB");
const n0 = (n: number) => Math.round(n || 0).toLocaleString("en-GB");
const isSunday = (d: string) => new Date(d + "T12:00:00Z").getUTCDay() === 0;

// ---------- design pieces ----------
const T = (inner: string, style = "", attrs = "") => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ${attrs} style="${style}">${inner}</table>`;
function button(label: string, href: string, bg = GOLD, fg = NAVY) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto"><tr><td align="center" bgcolor="${bg}" style="background:${bg};border-radius:999px;box-shadow:0 6px 0 rgba(0,0,0,.25)"><a href="${href}" target="_blank" style="display:inline-block;padding:16px 38px;font-family:${SANS};font-size:16px;font-weight:800;letter-spacing:.5px;color:${fg};text-decoration:none;border-radius:999px"><font color="${fg}">${label}</font></a></td></tr></table>`;
}
const ghost = (label: string, href: string) => `<a href="${href}" target="_blank" style="font-family:${SANS};font-size:14px;font-weight:700;color:${GOLD};text-decoration:none;border-bottom:1px solid ${GOLD2}">${label}</a>`;
const pre = (t: string) => `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(t)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>`;
function page(preheader: string, inner: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><meta name="supported-color-schemes" content="dark light"><title>Hundred Cannons</title></head><body style="margin:0;padding:0;background:${DEEP}" bgcolor="${DEEP}">${pre(preheader)}<div style="background:${DEEP};padding:18px 8px 34px">${inner}<div style="max-width:640px;margin:18px auto 0;text-align:center;font-family:${SANS};font-size:11px;letter-spacing:1px;color:#5D7290">HUNDRED CANNONS &middot; FUNNAL CREW ONLY &middot; <a href="${SITE}" style="color:#5D7290">FUNNAL.CO.UK/CREW</a></div></div></body></html>`;
}
const kicker = (t: string, c = GOLD) => `<div style="font-family:${SANS};font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:${c}">${t}</div>`;
const paperHead = (t: string) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="font-family:${SANS};font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#8A6A1F;padding-bottom:6px;border-bottom:2px solid ${INK}">${t}</td></tr></table>`;
const col = (t: string, body: string) => body ? `<div style="display:inline-block;vertical-align:top;width:100%;max-width:258px;margin:0 8px 22px;text-align:left">${paperHead(t)}<div style="font-family:${SERIF};font-size:15px;line-height:1.6;color:#3A3328;padding-top:8px">${body}</div></div>` : "";

// ---------- game numbers, worked out from the raw logs ----------
type Day = { date: string; p: Record<string, Record<string, number>>; team: number; target: number; hit: boolean };
async function gameData() {
  const [cfgRow, docs] = await Promise.all([J("hl_docs?path=eq.config/main&select=data"), J("hl_docs?coll=eq.days&select=path,data")]);
  const cfg = (cfgRow[0] && cfgRow[0].data) || {}; const P = ["sam", "james"];
  const names: Record<string, string> = { sam: "Sam", james: "James" };
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
  return { P, names, day, best, cfg };
}

// ---------- today on deck: the follow-ups due today and what's in the calendar ----------
const GAP: Record<string, number> = { messaged: 5, followed_up: 5, talking: 3, quote_sent: 4 };
const STAGE: Record<string, string> = { video_needed: "Video needed", video_made: "Video made", messaged: "Video sent", followed_up: "Followed up", talking: "Talking", meeting: "Meeting", quote_sent: "Quote sent", not_now: "Not now", client: "Client" };
const NAME: Record<string, string> = { sam: "Sam", james: "James" };
const KIND: Record<string, string> = { meeting: "Meeting", call: "Call", google: "Calendar", task: "Task", reminder: "Reminder" };
function dueOf(r: any): string | null {
  if (["archived", "client", "no_response"].includes(r.stage)) return null; if (r.stage === "not_now") return r.return_on || null;
  if (r.stage === "meeting" && !r.meeting_held && r.meeting_at) return String(r.meeting_at).slice(0, 10);
  if (r.next_due) return r.next_due; const g = GAP[r.stage]; return g && r.last_contact ? dayAdd(r.last_contact, g) : null;
}
// one row on the day's list: a time or tag on the left, the thing itself on the right
function drow(left: string, title: string, sub: string, accent = GOLD) {
  return `<tr><td width="74" valign="top" style="padding:12px 0 12px 16px;border-top:1px solid ${LINE}"><div style="display:inline-block;background:${accent};color:${NAVY};font-family:${SANS};font-size:12px;font-weight:800;letter-spacing:.5px;padding:5px 9px;border-radius:8px;white-space:nowrap">${left}</div></td><td valign="top" style="padding:12px 16px 12px 10px;border-top:1px solid ${LINE};font-family:${SANS}"><div style="font-size:16px;font-weight:700;color:#FFFFFF;line-height:1.3">${title}</div>${sub ? `<div style="font-size:13px;color:${MIST};margin-top:3px;line-height:1.4">${sub}</div>` : ""}</td></tr>`;
}
async function todayBlock(D: string) {
  const [pros, evs, pays, quotes, qev] = await Promise.all([
    J("hl_prospects?select=id,business,contact,stage,last_contact,next_due,next_action,return_on,meeting_at,meeting_held,owner&limit=5000"),
    J(`hl_events?select=*&deleted=eq.false&starts_at=gte.${dayAdd(D, -1)}T00:00:00Z&starts_at=lt.${dayAdd(D, 2)}T00:00:00Z&order=starts_at`),
    J(`hl_payments?select=*&paid_at=is.null&due=eq.${D}`),
    J("hl_quotes?select=id,prospect_id,status,valid_until,viewed_at,title&status=in.(sent,viewed)"),
    J(`hl_quote_events?select=quote_id&kind=eq.open&at=gte.${dayAdd(D, -1)}T00:00:00Z`)]);
  const byId: Record<string, any> = Object.fromEntries((pros as any[]).map((p) => [p.id, p]));
  const who = (o: string) => NAME[o] ? ` &middot; ${NAME[o]}` : "";
  // the diary: everything in the calendar today, all-day things first, then by time
  const today = (evs as any[]).filter((e) => (e.all_day ? String(e.starts_at).slice(0, 10) : ukDay(e.starts_at)) === D)
    .sort((a, b) => (a.all_day ? 0 : 1) - (b.all_day ? 0 : 1) || String(a.starts_at).localeCompare(String(b.starts_at)));
  const diary = today.map((e: any) => drow(e.all_day ? "ALL DAY" : ukTime(e.starts_at), esc(e.title || "(No title)"), `${e.prospect_id && byId[e.prospect_id] ? esc(byId[e.prospect_id].business) + " &middot; " : ""}${esc(KIND[e.kind] || "Calendar")}${e.location ? " &middot; " + esc(e.location) : ""}${who(e.owner)}`));
  // follow-ups due today (not the backlog)
  const inDiary = new Set(today.map((e: any) => e.prospect_id).filter(Boolean));
  const dueToday = (pros as any[]).filter((r) => dueOf(r) === D && !(r.stage === "meeting" && inDiary.has(r.id)));
  const fu = dueToday.map((r) => {
    const what = r.stage === "meeting" ? "Meeting today" : r.stage === "not_now" ? "Back on the list today" : r.next_action ? esc(r.next_action) : `Follow up &middot; ${esc(STAGE[r.stage] || r.stage)}`;
    return drow("&#9744;", esc(r.business || "Unnamed"), `${what}${r.contact ? " &middot; " + esc(r.contact) : ""}${who(r.owner)}`, "#8FD3B6");
  });
  const py = (pays as any[]).map((p) => drow("&pound;", `${esc(byId[p.prospect_id]?.business || "Client")} pays today`, money(p.amount), "#F5A97F"));
  const opens: Record<string, number> = {}; for (const e of qev as any[]) opens[e.quote_id] = (opens[e.quote_id] || 0) + 1;
  const qs: string[] = [];
  for (const q of quotes as any[]) {
    const b = byId[q.prospect_id]?.business ? esc(byId[q.prospect_id].business) : esc(q.title || "A quote");
    const opened = opens[q.id] || (q.viewed_at && q.viewed_at >= dayAdd(D, -1) + "T00:00:00Z" ? 1 : 0);
    if (opened) qs.push(drow("&#9733;", `${b} opened your quote`, `${opened > 1 ? opened + " times " : ""}since yesterday. A good day to call.`, "#B9A2F5"));
    else if (q.valid_until === D) qs.push(drow("&#9203;", `${b}: quote ends today`, "Worth a nudge.", "#B9A2F5"));
  }
  const rows = [...diary, ...fu, ...py, ...qs]; const n = rows.length;
  const parts = [diary.length && `${diary.length} in the diary`, fu.length && `${fu.length} follow-up${fu.length === 1 ? "" : "s"}`, py.length && `${py.length} payment${py.length === 1 ? "" : "s"}`, qs.length && `${qs.length} quote${qs.length === 1 ? "" : "s"}`].filter(Boolean) as string[];
  const sum = n ? parts.join(", ") : "a clear horizon";
  const block = `<tr><td style="padding:0 20px">${T(`<tr><td style="height:4px;background:${GOLD};font-size:0;line-height:0">&nbsp;</td></tr><tr><td style="padding:20px 16px 14px">
      ${kicker("Today on deck")}<div style="font-family:${SERIF};font-size:26px;font-weight:bold;color:#FFFFFF;margin-top:6px;line-height:1.2">${n ? `${n} thing${n === 1 ? "" : "s"} on today, captains` : "A clear horizon today"}</div>
      <div style="font-family:${SANS};font-size:14px;color:${MIST};margin-top:4px">${n ? parts.join(" &middot; ") : "Nothing in the diary and no follow-ups due. Plenty of room for DMs."}</div></td></tr>
      ${n ? `<tr><td>${T(rows.join(""))}</td></tr>` : ""}
      <tr><td align="center" style="padding:16px 16px 20px;border-top:1px solid ${LINE}">${ghost("Open the pipeline &rarr;", SITE + "#pipeline")}</td></tr>`, `background:${PANEL};border-radius:18px;border:1px solid ${LINE};overflow:hidden`)}</td></tr>`;
  const text = `Today on deck: ${sum}.\n${today.map((e: any) => `- ${e.all_day ? "All day" : ukTime(e.starts_at)} ${e.title}`).join("\n")}\n${dueToday.map((r) => `- Follow up: ${r.business}`).join("\n")}`;
  return { block, text, n, sum };
}

// ---------- the Sunday pages: the week in numbers ----------
async function weekBlock(G: any, D: string) {
  const days = Array.from({ length: 7 }, (_, i) => dayAdd(D, i - 7)), prev = Array.from({ length: 7 }, (_, i) => dayAdd(D, i - 14));
  const W = days.map(G.day), PW = prev.map(G.day);
  const tot = (L: Day[], k: string) => L.reduce((a, x) => a + G.P.reduce((b: number, p: string) => b + (x.p[p]?.[k] || 0), 0), 0);
  const dm = tot(W, "d"), pdm = tot(PW, "d"); const ch = pdm ? Math.round((dm - pdm) / pdm * 100) : 0;
  const hits = W.filter((x) => x.hit).length, work = W.filter((x) => x.target > 0).length;
  const bestD = W.reduce((a, x) => x.team > a.team ? x : a, W[0]);
  const mx = Math.max(1, ...W.map((x) => Math.max(x.team, x.target)));
  const bars = W.map((x) => { const h = Math.max(4, Math.round(x.team / mx * 120)); const c = x.hit ? GOLD : "#3D5A80";
    return `<td align="center" valign="bottom" style="padding:0 4px;font-family:${SANS}"><div style="font-size:13px;font-weight:800;color:${x.hit ? GOLD : "#FFFFFF"};margin-bottom:6px">${x.team}</div><div style="height:${h}px;line-height:${h}px;font-size:0;background:${c};border-radius:8px 8px 3px 3px">&nbsp;</div><div style="font-size:11px;font-weight:700;color:${MIST};margin-top:7px;letter-spacing:1.5px;text-transform:uppercase">${shortDay(x.date)}</div></td>`; }).join("");
  const from = days[0], to = D;
  const [newP, won, paid, qsent, qo] = await Promise.all([
    J(`hl_prospects?select=id&created_at=gte.${from}T00:00:00Z&created_at=lt.${to}T00:00:00Z`),
    J(`hl_prospects?select=id&won_at=gte.${from}&won_at=lt.${to}`),
    J(`hl_payments?select=amount&paid_at=gte.${from}T00:00:00Z&paid_at=lt.${to}T00:00:00Z`),
    J(`hl_quotes?select=id&status=neq.draft&created_at=gte.${from}T00:00:00Z&created_at=lt.${to}T00:00:00Z`),
    J(`hl_quote_events?select=id&kind=eq.open&at=gte.${from}T00:00:00Z&at=lt.${to}T00:00:00Z`)]);
  const money_in = (paid as any[]).reduce((a, p) => a + Number(p.amount || 0), 0);
  const tile = (v: string, l: string) => `<td width="33%" style="padding:5px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${NAVY};border:1px solid ${LINE};border-radius:14px"><tr><td align="center" style="padding:14px 6px;font-family:${SANS}"><div style="font-size:24px;font-weight:800;color:#FFFFFF">${v}</div><div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${MIST};margin-top:3px">${l}</div></td></tr></table></td>`;
  const wk = (p: string) => W.reduce((a, x) => a + (x.p[p]?.d || 0), 0); const topWk = Math.max(...G.P.map(wk));
  const per = G.P.map((p: string) => { const t = wk(p); const top = t > 0 && t === topWk;
    return `<td width="50%" style="padding:5px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${NAVY};border:1px solid ${top ? GOLD2 : LINE};border-radius:14px"><tr><td style="padding:14px 16px;font-family:${SANS}"><div style="font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${top ? GOLD : MIST}">${esc(G.names[p])}${top ? " &#9813;" : ""}</div><div style="font-size:34px;font-weight:800;color:#FFFFFF;line-height:1.1;margin-top:2px">${n0(t)}</div><div style="font-size:12px;color:${MIST}">DMs &middot; ${W.reduce((a, x) => a + (x.p[p]?.f || 0), 0)} follow-ups &middot; ${W.reduce((a, x) => a + (x.p[p]?.r || 0), 0)} replies</div></td></tr></table></td>`; }).join("");
  const html = `<tr><td style="padding:0 20px 22px">${T(`<tr><td style="padding:22px 20px 8px">${kicker("The week in numbers")}
      <div style="font-family:${SANS};font-size:68px;font-weight:800;line-height:1;color:${GOLD};margin-top:10px">${n0(dm)}</div><div style="font-family:${SANS};font-size:15px;color:#FFFFFF;margin-top:4px">DMs sent this week</div>
      <div style="margin-top:12px"><span style="display:inline-block;font-family:${SANS};font-size:13px;font-weight:800;padding:5px 11px;border-radius:999px;background:${!pdm ? LINE : ch >= 0 ? "#1F6E4A" : "#7A2A22"};color:#FFFFFF">${pdm ? `${ch >= 0 ? "&#9650;" : "&#9660;"} ${Math.abs(ch)}% on last week` : "First full week"}</span> <span style="font-family:${SANS};font-size:13px;color:${MIST}">&nbsp;Target hit ${hits} of ${work} days &middot; best day ${shortDay(bestD.date)} (${bestD.team})</span></div></td></tr>
    <tr><td style="padding:18px 16px 6px">${T(`<tr>${bars}</tr>`, "table-layout:fixed")}</td></tr>
    <tr><td style="padding:4px 20px 14px;font-family:${SANS};font-size:11px;color:${MIST}"><span style="color:${GOLD}">&#9632;</span> target hit &nbsp; <span style="color:#3D5A80">&#9632;</span> short</td></tr>
    <tr><td style="padding:0 15px">${T(`<tr>${per}</tr>`)}</td></tr>
    <tr><td style="padding:12px 20px 0">${kicker("Crew", MIST)}</td></tr>
    <tr><td style="padding:4px 15px 0">${T(`<tr>${tile(n0(tot(W, "f")), "follow-ups")}${tile(n0(tot(W, "r")), "replies")}${tile(n0(tot(W, "m")), "meetings")}</tr>`)}</td></tr>
    <tr><td style="padding:12px 20px 0">${kicker("Pipeline", MIST)}</td></tr>
    <tr><td style="padding:4px 15px 16px">${T(`<tr>${tile(String((newP as any[]).length), "new prospects")}${tile(String((won as any[]).length), "clients won")}${tile(money(money_in), "money in")}</tr><tr>${tile(String((qsent as any[]).length), "quotes sent")}${tile(String((qo as any[]).length), "quote opens")}${tile(String(tot(W, "v")), "videos")}</tr>`)}</td></tr>`, `background:${PANEL};border-radius:18px;border:1px solid ${LINE}`)}</td></tr>`;
  const text = `The week: ${dm} DMs (${pdm ? (ch >= 0 ? "+" : "") + ch + "% on last week" : "first week"}), target hit ${hits} of ${work} days, best day ${bestD.date} with ${bestD.team}. Pipeline: ${(newP as any[]).length} new prospects, ${(won as any[]).length} clients won, ${money(money_in)} in.`;
  return { html, text, dm, ch };
}

// ---------- The Salty Herald ----------
async function heraldMail(D: string, sunday: boolean) {
  const G = await gameData();
  const yd = dayAdd(D, -1); const Y = G.day(yd);
  const hr = (await J(`hl_herald?d=eq.${yd}&select=data,img`))[0] || null; const h = (hr && hr.data) || {};
  const won = Y.target > 0 && Y.team >= Y.target;
  const head = h.head || (Y.target ? (won ? `Crew sinks the day: ${Y.team} DMs` : Y.team ? `${Y.target - Y.team} short. Gary "not angry, just disappointed"` : "A quiet day on the water") : "A day off. The sea was told to behave.");
  const deck = h.deck || (Y.target ? `The crew logged ${Y.team} of ${Y.target}.` : "No target yesterday.");
  const today = await todayBlock(D);
  const week = sunday ? await weekBlock(G, D) : null;
  const issue = Math.round((new Date(D + "T12:00:00Z").getTime() - new Date("2026-11-10T12:00:00Z").getTime()) / 86400000);
  const [a, b] = G.P; const da = Y.p[a]?.d || 0, db = Y.p[b]?.d || 0;
  const side = (p: string, v: number, lead: boolean) => `<td width="42%" align="center" valign="top" style="font-family:${SANS};padding:4px 0"><div style="font-size:12px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:${lead ? GOLD : MIST}">${esc(G.names[p])}${lead ? " &#9813;" : ""}</div><div style="font-size:64px;font-weight:800;line-height:1.05;color:${lead ? GOLD : "#FFFFFF"}">${v}</div><div style="font-size:12px;color:${MIST};line-height:1.6">${Y.p[p]?.f || 0} follow-ups &middot; ${Y.p[p]?.r || 0} repl${(Y.p[p]?.r || 0) === 1 ? "y" : "ies"}${(Y.p[p]?.m || 0) ? ` &middot; ${Y.p[p].m} meeting${Y.p[p].m === 1 ? "" : "s"}` : ""}${(Y.p[p]?.c || 0) ? ` &middot; ${Y.p[p].c} client${Y.p[p].c === 1 ? "" : "s"}` : ""}</div></td>`;
  const pct = Y.target ? Math.min(100, Math.round(Y.team / Y.target * 100)) : 0;
  const record = G.best.date === yd && Y.team > 0;
  const score = `<tr><td style="padding:0 20px 22px">${T(`<tr><td style="padding:20px 18px 6px" align="center">${kicker("Yesterday's scoreboard")}</td></tr>
     <tr><td style="padding:6px 10px">${T(`<tr>${side(a, da, da > db)}<td width="16%" align="center" valign="middle" style="font-family:${SERIF};font-style:italic;font-size:18px;color:${MIST}">vs</td>${side(b, db, db > da)}</tr>`)}</td></tr>
     ${Y.target ? `<tr><td style="padding:14px 22px 6px">${T(`<tr><td style="font-family:${SANS};font-size:13px;color:#FFFFFF"><b>Team ${Y.team}</b> <span style="color:${MIST}">of ${Y.target}</span></td><td align="right" style="font-family:${SANS};font-size:12px;font-weight:800;letter-spacing:1px;color:${won ? GOLD : MIST}">${won ? "&#10003; TARGET HIT" : `${Y.target - Y.team} SHORT`}${record ? ` &middot; <span style="color:#FF8A7A">RECORD DAY</span>` : ""}</td></tr>`)}</td></tr>
     <tr><td style="padding:4px 22px 22px">${T(`<tr><td style="background:${LINE};border-radius:999px;height:12px;font-size:0;line-height:0">${T(`<tr><td style="background:${won ? GOLD : "#5B7BA6"};border-radius:999px;height:12px;font-size:0;line-height:0">&nbsp;</td></tr>`, "", `width="${Math.max(3, pct)}%"`)}</td></tr>`)}</td></tr>` : `<tr><td style="padding:6px 20px 20px" align="center"><div style="font-family:${SANS};font-size:13px;color:${MIST}">No target yesterday.</div></td></tr>`}`, `background:${PANEL};border-radius:18px;border:1px solid ${LINE}`)}</td></tr>`;
  const recs = [...(h.records || []).map((r: string) => esc(r)), ...(h.achs || []).map((x: any) => `${esc(x.p)}: <i>${esc(x.n)}</i>`)];
  const cols = [col("Hunting news", story(h.hunting)), col("Gary's Corner", story(h.gary)), col("Fishing report", story(h.fishing)), col("Forecast", story(h.forecast)), col("Leaderboard", story(h.leader)), col("Records &amp; trophies", recs.join("<br>")), col("Bottle post", story(h.bottle))].filter(Boolean).join("");
  const paper = `<tr><td style="padding:0 20px 22px">${T(`<tr><td style="padding:22px 22px 4px">${paperHead(`${sunday ? "Sunday" : "Morning"} edition &middot; No. ${issue}`)}${h.special ? `<div style="display:inline-block;margin-top:10px;background:#B23A2B;color:#FFFFFF;font-family:${SANS};font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:4px 10px;border-radius:4px">${esc(h.special)}</div>` : ""}
       <div style="font-family:${SERIF};font-size:34px;line-height:1.12;font-weight:bold;color:${INK};margin-top:12px">${esc(head)}</div>
       <div style="font-family:${SERIF};font-style:italic;font-size:17px;line-height:1.5;color:#5A4F3E;margin-top:10px">${esc(deck)}</div></td></tr>
     ${hr && hr.img ? `<tr><td style="padding:14px 22px 0"><img src="${esc(hr.img)}" width="556" alt="${esc(h.caption || "The Herald's front page")}" style="display:block;width:100%;max-width:556px;height:auto;border:2px solid ${INK}"><div style="font-family:${SERIF};font-style:italic;font-size:13px;color:#6B5F4A;margin-top:6px">${esc(h.caption || "")}</div></td></tr>` : ""}
     ${cols ? `<tr><td align="center" style="padding:22px 8px 0;font-size:0">${cols}</td></tr>` : `<tr><td style="padding:16px 22px 22px;font-family:${SERIF};font-style:italic;font-size:15px;color:#6B5F4A">Gary is still writing up yesterday's stories. They'll be waiting in the game.</td></tr>`}
     ${h.stop ? `<tr><td style="padding:0 22px 22px"><div style="background:#B23A2B;padding:12px 16px;font-family:${SANS};font-size:14px;font-weight:800;letter-spacing:.5px;color:#FFFFFF;text-align:center;border-radius:6px">${esc(h.stop)}</div></td></tr>` : ""}`, `background:${PAPER};border-radius:18px`, `bgcolor="${PAPER}"`)}</td></tr>`;
  const inner = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${NAVY}" style="max-width:640px;margin:0 auto;background:${NAVY};border-radius:22px;overflow:hidden;border:1px solid ${LINE}">
   <tr><td style="line-height:0;font-size:0"><img src="${IMG}mast-${sunday ? "sunday" : "herald"}.jpg" width="640" alt="${sunday ? "The Sunday Herald" : "The Salty Herald"}" style="display:block;width:100%;max-width:640px;height:auto;border:0"></td></tr>
   <tr><td align="center" style="padding:4px 20px 20px;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${MIST}">${esc(longDate(D))}</td></tr>
   ${today.block}<tr><td style="height:22px;font-size:0;line-height:0">&nbsp;</td></tr>
   ${week ? week.html : ""}
   ${score}
   ${paper}
   <tr><td align="center" style="padding:6px 20px 34px">${button("Board the ship &rarr;", SITE)}<div style="font-family:${SERIF};font-style:italic;font-size:13px;color:${MIST};margin-top:18px">Printed at dawn by Gary the gull, Editor in Chief. He would like a chip.</div></td></tr>
  </table>`;
  const subject = sunday ? `The Sunday Herald: ${n0(week!.dm)} DMs this week${week!.ch ? ` (${week!.ch > 0 ? "+" : ""}${week!.ch}%)` : ""}` : `The Salty Herald: ${head}`.slice(0, 110) + (today.n ? ` · ${today.n} on today` : "");
  const pre = `${today.n ? `Today: ${today.sum}.` : "A clear horizon today."} Yesterday: team ${Y.team}${Y.target ? " of " + Y.target : ""}.`;
  const text = `${sunday ? "THE SUNDAY HERALD" : "THE SALTY HERALD"} - ${longDate(D)}\n\n${today.text}\n\n${head}\n${deck}\n\n${week ? week.text + "\n\n" : ""}Yesterday: ${G.P.map((p: string) => `${G.names[p]} ${Y.p[p]?.d || 0}`).join(", ")}. Team ${Y.team}${Y.target ? " of " + Y.target : ""}.\n\n${SITE}`;
  return { subject, html: page(pre, inner), text };
}

// ---------- pet sighting ----------
const RAR: Record<string, [string, string, string]> = { common: ["#B8C4D0", "small and slightly suspicious", "Common"], uncommon: ["#4FD69C", "unusual", "Uncommon"], rare: ["#5AA8FF", "properly rare", "Rare"], epic: ["#B286FF", "epic", "Epic"], legendary: ["#FFC94D", "legendary", "Legendary"], mythic: ["#FF6FA8", "mythic, which almost never happens,", "Mythic"] };
const JOKES = ["Gary saw it first and has not stopped talking about it.", "It looked at the lighthouse like it owns the place.", "The parrot is already jealous.", "It has not signed any paperwork yet.", "Please do not tell it about the cannons.", "Finders keepers is legally binding at sea."];
function petHtml(D: string) {
  const s = sighting(D); const c = RAR[s.rar]; const an = /^[aeiou]/.test(s.rar) ? "An" : "A";
  const tile = (v: string, l: string) => `<td width="33%" style="padding:5px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${NAVY};border:1px solid ${LINE};border-radius:16px"><tr><td align="center" style="padding:16px 4px;font-family:${SANS}"><div style="font-size:26px;font-weight:800;color:${c[0]};white-space:nowrap">${v}</div><div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${MIST};margin-top:4px">${l}</div></td></tr></table></td>`;
  const inner = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${PANEL}" style="max-width:600px;margin:0 auto;background:${PANEL};border-radius:24px;overflow:hidden;border:1px solid ${LINE}">
   <tr><td style="line-height:0;font-size:0"><img src="${IMG}pet-${s.rar}.jpg" width="600" alt="Something glowing in the water at Funnal Cove" style="display:block;width:100%;max-width:600px;height:auto;border:0"></td></tr>
   <tr><td style="height:4px;background:${c[0]};font-size:0;line-height:0">&nbsp;</td></tr>
   <tr><td align="center" style="padding:28px 28px 6px">${kicker(`${c[2]} pet sighting`, c[0])}
     <div style="font-family:${SERIF};font-size:32px;line-height:1.15;font-weight:bold;color:#FFFFFF;margin-top:10px">Something ${c[1]} has surfaced, captains.</div>
     <p style="font-family:${SANS};font-size:16px;line-height:1.6;color:#C9D6E6;margin:14px 0 0">${an} <b style="color:${c[0]}">${s.rar}</b> pet is in Funnal Cove right now. Log <b style="color:#FFFFFF">${s.need} DMs</b> before <b style="color:#FFFFFF">${s.en}</b> and it's yours to keep.</p></td></tr>
   <tr><td style="padding:18px 22px 8px">${T(`<tr>${tile(String(s.need), "DMs to log")}${tile(String(s.win), "minutes")}${tile(s.en, "gone at")}</tr>`)}</td></tr>
   <tr><td align="center" style="padding:20px 28px 30px">${button("Board the ship &rarr;", SITE)}<p style="font-family:${SERIF};font-style:italic;font-size:14px;line-height:1.5;color:${MIST};margin:20px 0 0">${JOKES[h32(D + "joke") % JOKES.length]} The pet stays a surprise until you claim it.<br>Gary the gull, Head of Pet Sightings</p></td></tr></table>`;
  return { s, subject: `${c[2]} pet sighted: ${s.need} DMs by ${s.en}`, html: page(`${an} ${s.rar} pet is in Funnal Cove until ${s.en}. Log ${s.need} DMs to claim it.`, inner), text: `${an} ${s.rar} pet is in Funnal Cove right now. Log ${s.need} DMs in Hundred Cannons by ${s.en} UK time to claim it. Board the ship: ${SITE}  -- Gary the gull` };
}
async function petMail(req: Request) {
  const u = new URL(req.url); const dry = u.searchParams.has("dry"); const now = ukNow(); const D = u.searchParams.get("date") || now.D;
  const s = sighting(D);
  if (!dry && (now.min < s.sm || now.min >= s.em)) return Response.json({ skip: "outside window", D, ...s });
  const wd = await (await rest("rpc/hl_is_workday", { method: "POST", body: JSON.stringify({ d: D }) })).text();
  if (wd.trim() === "false") return Response.json({ skip: "day off", D });
  const m = petHtml(D); const key = await resendKey();
  if (dry || !key) return Response.json({ dry: true, haveKey: !!key, D, ...s, subject: m.subject });
  const ins = await rest("hl_mail_log?on_conflict=d", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=representation" }, body: JSON.stringify({ d: D }) });
  const rows = await ins.json(); if (!Array.isArray(rows) || !rows.length) return Response.json({ skip: "already sent", D });
  let out = "";
  try { out = await mail(m.subject, m.html, m.text); } catch (e) { await rest(`hl_mail_log?d=eq.${D}`, { method: "DELETE" }); return Response.json({ error: (e as Error).message }, { status: 500 }); }
  await rest(`hl_mail_log?d=eq.${D}`, { method: "PATCH", body: JSON.stringify({ info: out }) });
  return Response.json({ sent: true, D, out });
}

async function sample(kind: string, D: string) {
  if (kind === "pet") return petHtml(D);
  return heraldMail(D, kind === "sunday" || isSunday(D));
}

Deno.serve(async (req) => {
  const u = new URL(req.url); const dry = u.searchParams.has("dry"); const now = ukNow(); const res: Record<string, unknown> = {};
  const D = u.searchParams.get("date") || now.D;
  if (u.searchParams.has("html")) { const m = await sample(u.searchParams.get("html") || "herald", D); return new Response(m.html, { headers: { "Content-Type": "text/html; charset=utf-8" } }); }
  if (u.searchParams.has("preview")) { try { const m = await sample(u.searchParams.get("preview") || "herald", D); const o = await owner(); const out = await mail("[Preview] " + m.subject, m.html, m.text, o ? [o] : []); return Response.json({ preview: "sent", out }); } catch (e) { return Response.json({ preview: "failed", error: (e as Error).message }); } }
  if (u.searchParams.has("test")) { try { const m = await heraldMail(now.D, false); const out = await mail("Hundred Cannons: email is working", m.html, m.text); return Response.json({ test: "sent", out }); } catch (e) { return Response.json({ test: "failed", error: (e as Error).message }); } }
  if (dry || (now.min >= 480 && now.min < 540)) {
    // The Salty Herald goes out from 08:00 on working days (retries until 09:00 if sending fails); Sundays get the weekly edition
    const wd = await (await rest("rpc/hl_is_workday", { method: "POST", body: JSON.stringify({ d: now.D }) })).text();
    if (dry) res.herald = { would: isSunday(now.D) ? "sunday" : "daily", workday: wd.trim() !== "false" };
    else if (wd.trim() !== "false" && await claim("herald-" + now.D)) {
      try { const m = await heraldMail(now.D, isSunday(now.D)); await mail(m.subject, m.html, m.text); res.herald = "sent"; } catch (e) { await unclaim("herald-" + now.D); res.herald = (e as Error).message; }
    }
  }
  const pet = await petMail(req); res.pet = await pet.json().catch(() => null);
  res.haveKey = !!(await resendKey());
  return Response.json(res);
});
