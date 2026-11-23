// Hundred Cannons emails (called every 2 minutes by pg_cron):
//  - The Salty Herald, every working day at 08:00: yesterday's numbers, the Herald's stories and front-page drawing
//    (published by the game into hl_herald), and today's pipeline reminders. On Sundays it is the Sunday edition,
//    with the week in numbers for the game and the pipeline.
//  - The pet sighting email, once a working day at the sighting start.
//  - A heads-up 30 minutes before each meeting or call in the pipeline calendar.
// The Resend key, sender and recipients live in hl_private (server-only: resend_key, mail_from, mail_to, mail_owner),
// or the RESEND_API_KEY / MAIL_FROM / MAIL_TO secrets. No addresses are kept in this file.
// Until funnal.co.uk is verified in Resend, mail falls back to Resend's test sender, which only reaches the account owner.
// ?dry shows what would send; ?test sends a test email now.
// ?html=herald|sunday|pet|meeting returns that email as a page (nothing sent); ?preview=... sends it to the owner only.
const KEY_URL = Deno.env.get("SUPABASE_URL")!;
const SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const IMG = "https://cdn.jsdelivr.net/gh/FunnalCode/Funnal_Website@336567c55c5112ab7bfd22eddd41c8ba07863633/assets/email/hc/";
const SITE = "https://funnal.co.uk/crew";
const SERIF = "Georgia,'Times New Roman',Times,serif";
const SANS = "'Trebuchet MS','Segoe UI',Arial,sans-serif";

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
function button(label: string, href: string, bg = "#1E3550", fg = "#FFFFFF") {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto"><tr><td align="center" bgcolor="${bg}" style="background:${bg};border-radius:999px;border-bottom:3px solid rgba(0,0,0,.25)"><a href="${href}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:${SANS};font-size:16px;font-weight:bold;color:${fg};text-decoration:none;border-radius:999px"><font color="${fg}">${label}</font></a></td></tr></table>`;
}
const pre = (t: string) => `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(t)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>`;
function page(preheader: string, inner: string, bg = "#EDE5D0") {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>Hundred Cannons</title></head><body style="margin:0;padding:0;background:${bg}">${pre(preheader)}<div style="background:${bg};padding:22px 10px 30px">${inner}</div></body></html>`;
}
const sectionHead = (t: string) => `<div style="font-family:${SERIF};font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#2A2620;border-bottom:2px solid #2A2620;padding-bottom:5px;margin:0 0 8px">${t}</div>`;
const col = (t: string, body: string) => body ? `<div style="display:inline-block;vertical-align:top;width:100%;max-width:282px;margin:0 8px 18px;text-align:left">${sectionHead(t)}<div style="font-family:${SERIF};font-size:15px;line-height:1.55;color:#3A3328">${body}</div></div>` : "";

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

// ---------- pipeline: what needs doing today ----------
const GAP: Record<string, number> = { messaged: 5, followed_up: 5, talking: 3, quote_sent: 4 };
const STAGE: Record<string, string> = { video_needed: "Video needed", video_made: "Video made", messaged: "Video sent", followed_up: "Followed up", talking: "Talking", meeting: "Meeting", quote_sent: "Quote sent", not_now: "Not now", client: "Client" };
const NAME: Record<string, string> = { sam: "Sam", james: "James" };
const KIND: Record<string, string> = { meeting: "Meeting", call: "Call", google: "Google Calendar", task: "Task", reminder: "Reminder" };
function dueOf(r: any): string | null {
  if (["archived", "client", "no_response"].includes(r.stage)) return null; if (r.stage === "not_now") return r.return_on || null;
  if (r.stage === "meeting" && !r.meeting_held && r.meeting_at) return String(r.meeting_at).slice(0, 10);
  if (r.next_due) return r.next_due; const g = GAP[r.stage]; return g && r.last_contact ? dayAdd(r.last_contact, g) : null;
}
const pill = (t: string, bg: string, fg: string) => ` <span style="display:inline-block;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:.5px;text-transform:uppercase;background:${bg};color:${fg};padding:2px 8px;border-radius:999px;vertical-align:1px">${t}</span>`;
function prow(title: string, sub: string, right = "", tag = "") {
  return `<tr><td style="padding:10px 14px;background:#F6F7F9;border-radius:12px;font-family:${SANS}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="font-size:15px;color:#22303C;font-weight:bold">${title}${tag}<div style="font-size:13px;font-weight:normal;color:#66717C;margin-top:2px">${sub}</div></td>${right ? `<td align="right" style="font-size:14px;color:#22303C;font-weight:bold;white-space:nowrap;padding-left:10px">${right}</td>` : ""}</tr></table></td></tr><tr><td style="height:6px;font-size:0;line-height:0">&nbsp;</td></tr>`;
}
const pgroup = (t: string, n: number, rows: string[]) => rows.length ? `<div style="font-family:${SANS};font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#486790;margin:14px 0 8px">${t} <span style="color:#9AA3AC">${n}</span></div><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows.join("")}</table>` : "";
async function pipelineToday(D: string) {
  const [pros, evs, pays, quotes, qev] = await Promise.all([
    J("hl_prospects?select=*&limit=5000"),
    J(`hl_events?select=*&deleted=eq.false&starts_at=gte.${dayAdd(D, -1)}T00:00:00Z&starts_at=lt.${dayAdd(D, 2)}T00:00:00Z&order=starts_at`),
    J(`hl_payments?select=*&paid_at=is.null&due=lte.${D}&order=due`),
    J("hl_quotes?select=id,prospect_id,status,valid_until,view_count,viewed_at,title&status=in.(sent,viewed)"),
    J(`hl_quote_events?select=quote_id,kind,at&kind=eq.open&at=gte.${dayAdd(D, -1)}T00:00:00Z`)]);
  const byId: Record<string, any> = Object.fromEntries((pros as any[]).map((p) => [p.id, p]));
  const due = (pros as any[]).map((r) => ({ r, d: dueOf(r) })).filter((x) => x.d && x.d <= D).sort((a, b) => (a.d! < b.d! ? -1 : 1));
  const today = (evs as any[]).filter((e) => ukDay(e.starts_at) === D);
  const fmtD = (d: string) => `${+d.slice(8)}/${+d.slice(5, 7)}`;
  const fu = due.slice(0, 12).map(({ r, d }) => prow(esc(r.business || "Unnamed"), `${esc(STAGE[r.stage] || r.stage)}${r.contact ? " &middot; " + esc(r.contact) : ""}`, "", d! < D ? pill(`overdue since ${fmtD(d!)}`, "#FDE8E8", "#B42318") : pill("today", "#FFF4D6", "#8A5A00")));
  const ev = today.map((e: any) => prow(esc(e.title || "(No title)"), `${e.prospect_id && byId[e.prospect_id] ? esc(byId[e.prospect_id].business) : esc(KIND[e.kind] || e.kind || "Event")}${e.location ? " &middot; " + esc(e.location) : ""}${e.owner ? " &middot; " + esc(NAME[e.owner] || "") : ""}`, e.all_day ? "All day" : ukTime(e.starts_at)));
  const py = (pays as any[]).map((p) => prow(esc(byId[p.prospect_id]?.business || "Client"), p.due < D ? `Was due ${fmtD(p.due)}` : "Due today", money(p.amount), p.due < D ? pill("late", "#FDE8E8", "#B42318") : ""));
  const opens: Record<string, number> = {}; for (const e of qev as any[]) opens[e.quote_id] = (opens[e.quote_id] || 0) + 1;
  for (const q of quotes as any[]) if (!opens[q.id] && q.viewed_at && q.viewed_at >= dayAdd(D, -1) + "T00:00:00Z") opens[q.id] = 1;
  const qrows: string[] = [];
  for (const q of quotes as any[]) {
    const b = byId[q.prospect_id]?.business ? esc(byId[q.prospect_id].business) : `Quote: ${esc(q.title || "untitled")}`;
    if (opens[q.id]) qrows.push(prow(b, `Opened your quote ${opens[q.id] === 1 ? "once" : opens[q.id] + " times"} since yesterday. A good moment to call.`, "", pill("warm", "#E7F6EE", "#1F7A4D")));
    else if (q.valid_until && q.valid_until >= D && q.valid_until <= dayAdd(D, 3)) qrows.push(prow(b, `Quote ends ${q.valid_until === D ? "today" : longDate(q.valid_until)}`, "", pill("ending", "#FFF4D6", "#8A5A00")));
  }
  const vids = (pros as any[]).filter((r) => r.stage === "video_needed").length;
  const n = due.length + today.length + pays.length + qrows.length;
  const html = n ? pgroup("Follow up", due.length, fu) + (due.length > 12 ? `<div style="font-family:${SANS};font-size:13px;color:#66717C;margin:-2px 0 4px">and ${due.length - 12} more in the pipeline.</div>` : "") + pgroup("In the calendar", today.length, ev) + pgroup("Payments due", pays.length, py) + pgroup("Quotes", qrows.length, qrows)
    : `<div style="font-family:${SANS};font-size:15px;color:#66717C;padding:6px 0">Nothing is waiting on you today. Lovely.</div>`;
  const extra = vids ? `<div style="font-family:${SANS};font-size:13px;color:#66717C;margin-top:10px">${vids} prospect${vids === 1 ? "" : "s"} still need${vids === 1 ? "s" : ""} a video.</div>` : "";
  const sum = n ? [due.length && `${due.length} follow-up${due.length === 1 ? "" : "s"}`, today.length && `${today.length} in the calendar`, pays.length && `${pays.length} payment${pays.length === 1 ? "" : "s"}`, qrows.length && `${qrows.length} quote${qrows.length === 1 ? "" : "s"} to watch`].filter(Boolean).join(", ") : "nothing waiting";
  const text = `Pipeline today: ${sum}.\n${due.map(({ r, d }) => `- ${r.business} (${STAGE[r.stage] || r.stage}${d! < D ? ", overdue" : ""})`).join("\n")}\n${today.map((e: any) => `- ${e.all_day ? "All day" : ukTime(e.starts_at)} ${e.title}`).join("\n")}`;
  const block = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:18px;border:1px solid #E4DCC6"><tr><td style="padding:18px 18px 14px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="font-family:${SANS};font-size:12px;font-weight:bold;letter-spacing:2px;color:#C99A2E;text-transform:uppercase">Funnal pipeline</td><td align="right" style="font-family:${SANS};font-size:12px;color:#9AA3AC">${esc(longDate(D))}</td></tr></table>
    <div style="font-family:${SANS};font-size:21px;font-weight:bold;color:#22303C;margin:4px 0 2px">Today on the pipeline</div><div style="font-family:${SANS};font-size:14px;color:#66717C">${esc(sum[0].toUpperCase() + sum.slice(1))}.</div>
    ${html}${extra}<div style="height:14px"></div>${button("Open the pipeline &rarr;", SITE + "#pipeline", "#3F5160")}</td></tr></table>`;
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
  const bars = W.map((x) => { const h = Math.max(4, Math.round(x.team / mx * 110)); const c = x.hit ? "#C99A2E" : "#8FA0B3";
    return `<td align="center" valign="bottom" style="padding:0 3px;font-family:${SANS}"><div style="font-size:12px;font-weight:bold;color:#2A2620;margin-bottom:4px">${x.team}</div><div style="height:${h}px;line-height:${h}px;font-size:0;background:${c};border-radius:6px 6px 2px 2px">&nbsp;</div><div style="font-size:11px;color:#6B5F4A;margin-top:5px;text-transform:uppercase;letter-spacing:1px">${shortDay(x.date)}</div></td>`; }).join("");
  const per = G.P.map((p: string) => { const t = W.reduce((a, x) => a + (x.p[p]?.d || 0), 0); return `<td width="50%" style="padding:0 5px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #E4DCC6;border-radius:14px"><tr><td style="padding:12px 14px;font-family:${SANS}"><div style="font-size:13px;color:#6B5F4A">${esc(G.names[p])}</div><div style="font-size:26px;font-weight:bold;color:#2A2620">${n0(t)}</div><div style="font-size:12px;color:#6B5F4A">DMs &middot; ${W.reduce((a, x) => a + (x.p[p]?.f || 0), 0)} follow-ups &middot; ${W.reduce((a, x) => a + (x.p[p]?.r || 0), 0)} replies</div></td></tr></table></td>`; }).join("");
  // the pipeline's week
  const from = days[0], to = D;
  const [newP, won, paid, qs, qo] = await Promise.all([
    J(`hl_prospects?select=id&created_at=gte.${from}T00:00:00Z&created_at=lt.${to}T00:00:00Z`),
    J(`hl_prospects?select=id&won_at=gte.${from}&won_at=lt.${to}`),
    J(`hl_payments?select=amount&paid_at=gte.${from}T00:00:00Z&paid_at=lt.${to}T00:00:00Z`),
    J(`hl_quotes?select=id&status=neq.draft&created_at=gte.${from}T00:00:00Z&created_at=lt.${to}T00:00:00Z`),
    J(`hl_quote_events?select=id&kind=eq.open&at=gte.${from}T00:00:00Z&at=lt.${to}T00:00:00Z`)]);
  const money_in = (paid as any[]).reduce((a, p) => a + Number(p.amount || 0), 0);
  const tile = (v: string, l: string) => `<td width="33%" style="padding:4px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #E4DCC6;border-radius:14px"><tr><td align="center" style="padding:12px 6px;font-family:${SANS}"><div style="font-size:22px;font-weight:bold;color:#2A2620">${v}</div><div style="font-size:12px;color:#6B5F4A">${l}</div></td></tr></table></td>`;
  const html = `<tr><td style="padding:6px 24px 4px">${sectionHead("The week in numbers")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="font-family:${SERIF};font-size:46px;font-weight:bold;color:#2A2620;line-height:1">${n0(dm)}<span style="font-size:18px;font-weight:normal;color:#6B5F4A"> DMs this week</span></td></tr>
    <tr><td style="font-family:${SANS};font-size:14px;color:${ch >= 0 ? "#1F7A4D" : "#B42318"};padding-top:6px">${pdm ? `${ch >= 0 ? "&#9650;" : "&#9660;"} ${Math.abs(ch)}% on last week (${n0(pdm)})` : "The first full week on the books."} <span style="color:#6B5F4A">&middot; target hit ${hits} of ${work} days &middot; best day ${shortDay(bestD.date)} with ${bestD.team}</span></td></tr></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 4px;table-layout:fixed"><tr>${bars}</tr></table>
    <div style="font-family:${SANS};font-size:11px;color:#6B5F4A;margin-bottom:14px"><span style="color:#C99A2E">&#9632;</span> target hit &nbsp; <span style="color:#8FA0B3">&#9632;</span> short of target</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 -5px"><tr>${per}</tr></table>
    <div style="height:14px"></div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${tile(n0(tot(W, "f")), "follow-ups")}${tile(n0(tot(W, "r")), "replies")}${tile(n0(tot(W, "m")), "meetings")}</tr>
    <tr>${tile(String((newP as any[]).length), "new prospects")}${tile(String((won as any[]).length), "clients won")}${tile(money(money_in), "money in")}</tr>
    <tr>${tile(String((qs as any[]).length), "quotes sent")}${tile(String((qo as any[]).length), "quote opens")}${tile(String(tot(W, "v")), "videos")}</tr></table></td></tr>`;
  const text = `The week: ${dm} DMs (${pdm ? (ch >= 0 ? "+" : "") + ch + "% on last week" : "first week"}), target hit ${hits} of ${work} days, best day ${bestD.date} with ${bestD.team}. Pipeline: ${(newP as any[]).length} new prospects, ${(won as any[]).length} clients won, ${money(money_in)} in.`;
  return { html, text, dm, ch };
}

// ---------- The Salty Herald ----------
async function heraldMail(D: string, sunday: boolean) {
  const G = await gameData();
  const yd = dayAdd(D, -1); const Y = G.day(yd);
  const hr = (await J(`hl_herald?d=eq.${yd}&select=data,img`))[0] || null; const h = (hr && hr.data) || {};
  const won = Y.target > 0 && Y.team >= Y.target;
  const head = h.head || (Y.target ? (won ? `CREW SINKS THE DAY: ${Y.team} DMS` : Y.team ? `${Y.target - Y.team} SHORT. GARY "NOT ANGRY, JUST DISAPPOINTED"` : "QUIET DAY ON THE WATER") : "A DAY OFF. THE SEA WAS TOLD TO BEHAVE.");
  const deck = h.deck || (Y.target ? `Crew total ${Y.team} of ${Y.target}.` : "No target yesterday.");
  const pipe = await pipelineToday(D);
  const week = sunday ? await weekBlock(G, D) : null;
  const issue = Math.round((new Date(D + "T12:00:00Z").getTime() - new Date("2026-11-10T12:00:00Z").getTime()) / 86400000);
  const score = G.P.map((p: string) => { const x = Y.p[p] || {}; const lead = Y.p[p]?.d > Math.max(...G.P.filter((q: string) => q !== p).map((q: string) => Y.p[q]?.d || 0));
    return `<td width="50%" valign="top" style="padding:0 5px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #E4DCC6;border-radius:14px"><tr><td style="padding:12px 14px;font-family:${SANS}"><div style="font-size:13px;color:#6B5F4A">${esc(G.names[p])}${lead ? pill("top", "#FFF4D6", "#8A5A00") : ""}</div><div style="font-family:${SERIF};font-size:34px;font-weight:bold;color:#2A2620;line-height:1.1">${x.d || 0}<span style="font-size:14px;font-weight:normal;color:#6B5F4A"> DMs</span></div><div style="font-size:12px;color:#6B5F4A;line-height:1.5">${x.f || 0} follow-ups &middot; ${x.r || 0} replies<br>${x.v || 0} videos &middot; ${x.m || 0} meetings &middot; ${x.c || 0} clients</div></td></tr></table></td>`; }).join("");
  const pct = Y.target ? Math.min(100, Math.round(Y.team / Y.target * 100)) : 0;
  const bar = Y.target ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px"><tr><td style="font-family:${SANS};font-size:13px;color:#2A2620;padding-bottom:6px"><b>Team ${Y.team}</b> of ${Y.target}${won ? " &middot; target hit &#10003;" : ""}${G.best.date === yd && Y.team > 0 ? pill("record day", "#FDE8E8", "#B42318") : ""}</td></tr><tr><td style="background:#E4DCC6;border-radius:999px;height:10px;font-size:0;line-height:0"><table role="presentation" width="${Math.max(2, pct)}%" cellpadding="0" cellspacing="0"><tr><td style="background:${won ? "#C99A2E" : "#8FA0B3"};border-radius:999px;height:10px;font-size:0;line-height:0">&nbsp;</td></tr></table></td></tr></table>` : "";
  const recs = [...(h.records || []).map((r: string) => esc(r)), ...(h.achs || []).map((a: any) => `${esc(a.p)}: <i>${esc(a.n)}</i>`)];
  const cols = [col("Hunting news", story(h.hunting)), col("Gary's Corner", story(h.gary)), col("Fishing report", story(h.fishing)), col("Forecast", story(h.forecast)), col("Leaderboard", story(h.leader)), col("Records and trophies", recs.join("<br>")), col("Bottle post", story(h.bottle))].filter(Boolean).join("");
  const name = sunday ? "THE SUNDAY HERALD" : "THE SALTY HERALD";
  const inner = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#FBF7EC;border:1px solid #D9CFB4;border-radius:6px;box-shadow:0 2px 0 #D9CFB4">
   <tr><td style="padding:12px 24px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="font-family:${SANS};font-size:11px;letter-spacing:2px;color:#6B5F4A;text-transform:uppercase">Hundred Cannons</td><td align="right" style="font-family:${SANS};font-size:11px;letter-spacing:2px;color:#6B5F4A;text-transform:uppercase">No. ${issue}</td></tr></table></td></tr>
   <tr><td align="center" style="padding:10px 24px 0"><div style="font-family:${SERIF};font-style:italic;font-size:12px;color:#6B5F4A">Est. the day the first cannon fired &middot; Price: one DM</div>
     <div style="font-family:${SERIF};font-size:40px;line-height:1.05;font-weight:bold;letter-spacing:2px;color:#2A2620;margin:6px 0 4px">${name}</div>
     <div style="font-family:${SERIF};font-size:13px;color:#3A3328">${esc(longDate(D))} &middot; ${sunday ? "Weekly edition" : "Morning edition"}${h.special ? ` &middot; <b style="color:#B23A2B">${esc(h.special)}</b>` : ""}</div></td></tr>
   <tr><td style="padding:10px 24px 0"><div style="border-top:3px solid #2A2620;border-bottom:1px solid #2A2620;height:3px;font-size:0;line-height:0">&nbsp;</div></td></tr>
   <tr><td style="padding:16px 24px 6px"><div style="font-family:${SERIF};font-size:27px;line-height:1.15;font-weight:bold;color:#2A2620">${esc(head)}</div></td></tr>
   ${hr && hr.img ? `<tr><td style="padding:8px 24px 0"><img src="${esc(hr.img)}" width="592" alt="${esc(h.caption || "The Herald's front page")}" style="display:block;width:100%;max-width:592px;height:auto;border:1px solid #3F3A30"><div style="font-family:${SERIF};font-style:italic;font-size:13px;color:#6B5F4A;margin-top:5px">${esc(h.caption || "")}</div></td></tr>` : ""}
   <tr><td style="padding:12px 24px 6px;font-family:${SERIF};font-size:17px;line-height:1.55;color:#3A3328">${esc(deck)}</td></tr>
   ${week ? week.html : ""}
   <tr><td style="padding:12px 24px 6px">${sectionHead(sunday ? "Yesterday" : "The numbers")}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 -5px"><tr>${score}</tr></table>${bar}</td></tr>
   <tr><td style="padding:18px 24px 10px">${pipe.block}</td></tr>
   ${cols ? `<tr><td align="center" style="padding:14px 16px 0;font-size:0">${cols}</td></tr>` : `<tr><td style="padding:4px 24px 0;font-family:${SERIF};font-style:italic;font-size:14px;color:#6B5F4A">Gary is still writing up yesterday's stories. They'll be in the game when you get there.</td></tr>`}
   ${h.stop ? `<tr><td style="padding:2px 24px 16px"><div style="border:2px solid #2A2620;background:#FFF7DE;padding:10px 14px;font-family:${SERIF};font-size:15px;font-weight:bold;color:#2A2620;text-align:center">${esc(h.stop)}</div></td></tr>` : ""}
   <tr><td align="center" style="padding:6px 24px 26px">${button("Board the ship &rarr;", SITE)}<div style="font-family:${SERIF};font-style:italic;font-size:13px;color:#6B5F4A;margin-top:16px">Printed at dawn by Gary the gull, Editor in Chief. He would like a chip.</div></td></tr>
  </table>
  <div style="max-width:640px;margin:12px auto 0;text-align:center;font-family:${SANS};font-size:11px;color:#8C8068">Hundred Cannons &middot; Funnal crew only &middot; <a href="${SITE}" style="color:#8C8068">funnal.co.uk/crew</a></div>`;
  const subject = sunday ? `The Sunday Herald: ${week!.dm} DMs this week${week!.ch ? ` (${week!.ch > 0 ? "+" : ""}${week!.ch}%)` : ""}, ${pipe.sum}` : `The Salty Herald: ${head.charAt(0) + head.slice(1).toLowerCase()}`.slice(0, 120);
  const pre = sunday ? `Your week in numbers, yesterday's paper and today's pipeline: ${pipe.sum}.` : `Yesterday: team ${Y.team}${Y.target ? " of " + Y.target : ""}. Today on the pipeline: ${pipe.sum}.`;
  const text = `${name} - ${longDate(D)}\n\n${head}\n${deck}\n\n${week ? week.text + "\n\n" : ""}Yesterday: ${G.P.map((p: string) => `${G.names[p]} ${Y.p[p]?.d || 0}`).join(", ")}. Team ${Y.team}${Y.target ? " of " + Y.target : ""}.\n\n${pipe.text}\n\n${SITE}`;
  return { subject, html: page(pre, inner), text };
}

// ---------- pet sighting ----------
const RAR: Record<string, [string, string, string]> = { common: ["#6E7B88", "small and slightly suspicious", "Common"], uncommon: ["#2F8F62", "unusual", "Uncommon"], rare: ["#2A6FBF", "properly rare", "Rare"], epic: ["#7440C4", "epic", "Epic"], legendary: ["#B7790A", "legendary", "Legendary"], mythic: ["#B92A62", "mythic, which almost never happens,", "Mythic"] };
const JOKES = ["Gary saw it first and has not stopped talking about it.", "It looked at the lighthouse like it owns the place.", "The parrot is already jealous.", "It has not signed any paperwork yet.", "Please do not tell it about the cannons.", "Finders keepers is legally binding at sea."];
function petHtml(D: string) {
  const s = sighting(D); const c = RAR[s.rar];
  const tile = (v: string, l: string) => `<td width="33%" style="padding:4px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3EEDF;border-radius:14px"><tr><td align="center" style="padding:14px 4px;font-family:${SANS}"><div style="font-size:24px;font-weight:bold;color:#22303C;white-space:nowrap">${v}</div><div style="font-size:12px;color:#6B5F4A">${l}</div></td></tr></table></td>`;
  const inner = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#FFFCF4;border-radius:22px;overflow:hidden;border:1px solid #E4DCC6">
   <tr><td style="line-height:0;font-size:0"><img src="${IMG}pet-${s.rar}.jpg" width="600" alt="Something glowing in the water at Funnal Cove" style="display:block;width:100%;max-width:600px;height:auto;border:0"></td></tr>
   <tr><td bgcolor="${c[0]}" style="background:${c[0]};padding:9px 16px;text-align:center;font-family:${SANS};font-size:13px;font-weight:bold;letter-spacing:3px;color:#FFFFFF;text-transform:uppercase"><font color="#FFFFFF">${c[2]} pet sighting &middot; until ${s.en}</font></td></tr>
   <tr><td style="padding:26px 30px 4px;text-align:center"><div style="font-family:${SANS};font-size:28px;line-height:1.2;font-weight:bold;color:#22303C">Something ${c[1]} has surfaced, captains.</div>
     <p style="font-family:${SANS};font-size:16px;line-height:1.55;color:#4A5662;margin:14px 0 0">${/^[aeiou]/.test(s.rar) ? "An" : "A"} <b style="color:${c[0]}">${s.rar}</b> pet is in Funnal Cove right now. Log <b>${s.need} DMs</b> before <b>${s.en}</b> UK time and it's yours to keep. Rarer pets ask for more, so clear the diary.</p></td></tr>
   <tr><td style="padding:16px 26px 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${tile(String(s.need), "DMs to log")}${tile(String(s.win), "minutes")}${tile(`${s.st}&ndash;${s.en}`, "UK time")}</tr></table></td></tr>
   <tr><td align="center" style="padding:14px 28px 28px">${button("Board the ship &rarr;", SITE, "#22303C")}<p style="font-family:${SANS};font-size:13px;line-height:1.5;color:#7F8A95;margin:18px 0 0">${JOKES[h32(D + "joke") % JOKES.length]} The pet stays a surprise until you claim it.<br>Gary the gull, Head of Pet Sightings</p></td></tr></table>`;
  return { s, subject: `Pet sighting now: ${c[2]} pet, ${s.need} DMs by ${s.en}`, html: page(`${/^[aeiou]/.test(s.rar) ? "An" : "A"} ${s.rar} pet is in Funnal Cove until ${s.en}. Log ${s.need} DMs to claim it.`, inner, "#E9E2CF"), text: `${/^[aeiou]/.test(s.rar) ? "An" : "A"} ${s.rar} pet is in Funnal Cove right now. Log ${s.need} DMs in Hundred Cannons by ${s.en} UK time to claim it. Board the ship: ${SITE}  -- Gary the gull` };
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

// ---------- 30 minutes before a meeting or call ----------
function meetingHtml(e: any, pr: any) {
  const t = e.all_day ? "All day" : ukTime(e.starts_at); const end = e.ends_at && !e.all_day ? ukTime(e.ends_at) : "";
  const line = (k: string, v: string) => v ? `<tr><td style="padding:7px 0;border-top:1px solid #EEF0F2;font-family:${SANS};font-size:14px;color:#66717C;width:96px">${k}</td><td style="padding:7px 0;border-top:1px solid #EEF0F2;font-family:${SANS};font-size:15px;color:#22303C;font-weight:bold">${v}</td></tr>` : "";
  const inner = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #E1E4E8">
   <tr><td bgcolor="#1E3550" style="background:#1E3550;padding:22px 26px"><div style="font-family:${SANS};font-size:12px;font-weight:bold;letter-spacing:3px;color:#F2C462">IN 30 MINUTES</div>
     <div style="font-family:${SANS};font-size:44px;font-weight:bold;color:#FFFFFF;line-height:1.1;margin-top:6px">${t}${end ? `<span style="font-size:20px;color:#AFC0D3;font-weight:normal"> &ndash; ${end}</span>` : ""}</div>
     <div style="font-family:${SANS};font-size:19px;color:#FFFFFF;margin-top:6px">${esc(e.title || "Meeting")}</div></td></tr>
   <tr><td style="padding:16px 26px 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
     ${line("With", esc([pr?.business, pr?.contact].filter(Boolean).join(", ")))}${line("Where", esc(e.location || ""))}${line("Phone", pr?.phone ? `<a href="tel:${esc(pr.phone)}" style="color:#2A6FBF;text-decoration:none">${esc(pr.phone)}</a>` : "")}${line("Email", pr?.email ? `<a href="mailto:${esc(pr.email)}" style="color:#2A6FBF;text-decoration:none">${esc(pr.email)}</a>` : "")}${line("Stage", pr ? esc(STAGE[pr.stage] || pr.stage || "") : "")}${line("Who", esc(NAME[e.owner] || ""))}
   </table>${e.notes || pr?.notes ? `<div style="margin-top:12px;background:#F6F7F9;border-radius:12px;padding:12px 14px;font-family:${SANS};font-size:14px;line-height:1.5;color:#3F4B57">${esc(e.notes || pr.notes).slice(0, 400)}</div>` : ""}</td></tr>
   <tr><td align="center" style="padding:16px 26px 26px">${button("Open in the pipeline &rarr;", SITE + "#pipeline", "#3F5160")}</td></tr></table>`;
  return page(`${e.title || "Meeting"} at ${t}${pr?.business ? " with " + pr.business : ""}.`, inner, "#EEF0F2");
}
async function soon(dry: boolean) {
  const now = Date.now(); const from = new Date(now + 20 * 60000).toISOString(), to = new Date(now + 35 * 60000).toISOString();
  const evs: any[] = await J(`hl_events?select=*&deleted=eq.false&all_day=eq.false&starts_at=gte.${from}&starts_at=lt.${to}`);
  const out: string[] = [];
  for (const e of evs.filter((x) => ["meeting", "call"].includes(x.kind) || x.prospect_id)) {
    const k = "soon-" + e.id + "-" + e.starts_at; if (dry) { out.push(e.title); continue; } if (!(await claim(k))) continue;
    const pr = e.prospect_id ? (await J(`hl_prospects?select=business,contact,phone,email,stage,notes&id=eq.${e.prospect_id}`))[0] : null;
    const who = pr ? [pr.business, pr.contact].filter(Boolean).join(", ") : "";
    try { await mail(`In 30 minutes: ${e.title || "meeting"} at ${ukTime(e.starts_at)}`, meetingHtml(e, pr), `${e.title} at ${ukTime(e.starts_at)}${who ? " with " + who : ""}. ${SITE}#pipeline`); out.push(e.title); }
    catch (er) { await unclaim(k); out.push("error: " + (er as Error).message); }
  }
  return out;
}

// ---------- examples for checking the designs ----------
async function sample(kind: string, D: string) {
  if (kind === "pet") return petHtml(D);
  if (kind === "meeting") { const e = (await J(`hl_events?select=*&deleted=eq.false&all_day=eq.false&or=(kind.in.(meeting,call),prospect_id.not.is.null)&order=starts_at.desc&limit=1`))[0] || { title: "Discovery call", kind: "call", starts_at: new Date(Date.now() + 1800000).toISOString(), ends_at: new Date(Date.now() + 3600000).toISOString(), owner: "sam", location: "Google Meet" };
    const pr = e.prospect_id ? (await J(`hl_prospects?select=business,contact,phone,email,stage,notes&id=eq.${e.prospect_id}`))[0] : null; return { subject: `In 30 minutes: ${e.title}`, html: meetingHtml(e, pr), text: e.title }; }
  return heraldMail(D, kind === "sunday" || isSunday(D));
}

Deno.serve(async (req) => {
  const u = new URL(req.url); const dry = u.searchParams.has("dry"); const now = ukNow(); const res: Record<string, unknown> = {};
  const D = u.searchParams.get("date") || now.D;
  if (u.searchParams.has("html")) { const m = await sample(u.searchParams.get("html") || "herald", D); return new Response(m.html, { headers: { "Content-Type": "text/html; charset=utf-8" } }); }
  if (u.searchParams.has("preview")) { try { const m = await sample(u.searchParams.get("preview") || "herald", D); const o = await owner(); const out = await mail("[Preview] " + m.subject, m.html, m.text, o ? [o] : []); return Response.json({ preview: "sent", out }); } catch (e) { return Response.json({ preview: "failed", error: (e as Error).message }); } }
  if (u.searchParams.has("test")) { try { const m = await heraldMail(now.D, false); const out = await mail("Hundred Cannons: email is working", m.html, m.text); return Response.json({ test: "sent", out }); } catch (e) { return Response.json({ test: "failed", error: (e as Error).message }); } }
  try { res.soon = await soon(dry); } catch (e) { res.soon = (e as Error).message; }
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
