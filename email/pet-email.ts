// Hundred Cannons notifications (called every 2 minutes by pg_cron):
//  - the pet sighting email, once a working day at the sighting start
//  - 23 Nov: the 08:00 pipeline digest (follow-ups due, today's meetings and events, payments due)
//  - 23 Nov: a heads-up 30 minutes before each meeting or call in the pipeline calendar
// The Resend key and sender live in hl_private (server-only), or the RESEND_API_KEY / MAIL_FROM secrets.
// Until funnal.co.uk is verified in Resend, mail falls back to Resend's test sender, which only reaches Sam.
// ?dry shows what would send; ?test sends a test email now.
const TPL = `<div style="background-color:#F5EFDF;padding:24px 12px;font-family:'Trebuchet MS',Verdana,sans-serif;color:#3F5160"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#FFFCF4" style="max-width:600px;margin:0 auto;background-color:#FFFCF4;border-radius:22px;overflow:hidden;border:2px solid #E9DFC6"><tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#1E3550" align="center" style="background:#1E3550;padding:26px 16px 8px;font-family:Arial,sans-serif"><div style="font-size:12px;letter-spacing:3px;color:#F2C462;font-weight:bold">PET SIGHTING &middot; FUNNAL COVE</div><div style="font-size:72px;line-height:96px">PETEMOJI</div></td></tr><tr><td bgcolor="COLOUR" align="center" style="background:COLOUR;padding:10px 16px;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;letter-spacing:2px">RARITYUP PET &middot; NEED DMS BY END</td></tr><tr><td bgcolor="#2A6E8C" style="background:#2A6E8C;font-size:6px;line-height:6px">&nbsp;</td></tr></table></td></tr><tr><td bgcolor="COLOUR" style="background-color:COLOUR;color:#ffffff;text-align:center;padding:10px 16px;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase"><font color="#ffffff">RARITY pet sighting &middot; Funnal Cove</font></td></tr><tr><td style="padding:26px 28px 6px;text-align:center"><div style="font-size:27px;line-height:1.2;font-weight:bold;color:#2C3E50">Something PHRASE has surfaced, captains.</div><p style="font-size:16px;line-height:1.5;margin:14px 0 0">A <b style="color:COLOUR">RARITY</b> pet is in Funnal Cove right now, until <b>END</b> UK time. Log NEED DMs before then and it is yours. Rarer pets ask for more, so clear your diary.</p></td></tr><tr><td style="padding:16px 28px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="32%" bgcolor="#EEF2F5" style="background-color:#EEF2F5;border-radius:14px;padding:14px 6px;text-align:center"><div style="font-size:26px;font-weight:bold;color:#2C3E50">NEED</div><div style="font-size:12px">DMs to log</div></td><td width="2%"></td><td width="32%" bgcolor="#EEF2F5" style="background-color:#EEF2F5;border-radius:14px;padding:14px 6px;text-align:center"><div style="font-size:26px;font-weight:bold;color:#2C3E50">WINDOW</div><div style="font-size:12px">minutes</div></td><td width="2%"></td><td width="32%" bgcolor="#EEF2F5" style="background-color:#EEF2F5;border-radius:14px;padding:14px 6px;text-align:center"><div style="font-size:19px;line-height:31px;font-weight:bold;color:#2C3E50;white-space:nowrap">START&ndash;END</div><div style="font-size:12px">UK time</div></td></tr></table></td></tr><tr><td align="center" style="padding:8px 28px 28px;text-align:center"><table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto"><tr><td align="center" bgcolor="#2C3E50" style="background-color:#2C3E50;border-radius:999px;border-bottom:4px solid #1D2A36"><a href="https://funnal.co.uk/crew" target="_blank" style="display:inline-block;padding:15px 38px;font-size:18px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px"><font color="#ffffff">Board the ship &rarr;</font></a></td></tr></table><p style="font-size:13px;line-height:1.5;color:#7F8A95;margin:18px 0 0">JOKE The pet stays a surprise until you claim it.<br>Gary the gull, Head of Pet Sightings, Hundred Cannons</p></td></tr></table></div>`;
const KEY_URL = Deno.env.get("SUPABASE_URL")!;
const SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
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
const PRIV: Record<string, string> = {};
async function priv(k: string) { if (k in PRIV) return PRIV[k]; const r = await rest(`hl_private?k=eq.${k}&select=v`); const j = r.ok ? await r.json() : []; PRIV[k] = (j[0] && j[0].v) || ""; return PRIV[k]; }
async function resendKey() { return Deno.env.get("RESEND_API_KEY") || (await priv("resend_key")) || ""; }
async function mail(subject: string, html: string, text: string) {
  const key = await resendKey(); if (!key) throw new Error("no key");
  const to = (Deno.env.get("MAIL_TO") || "sam@funnal.co.uk,james@funnal.co.uk").split(",");
  const from = Deno.env.get("MAIL_FROM") || (await priv("mail_from")) || "Hundred Cannons <onboarding@resend.dev>";
  const go = (f: string, t: string[]) => fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: f, to: t, subject, html, text }) });
  let r = await go(from, to); let out = await r.text();
  // domain not verified yet: Resend's test sender, which can only email the account owner
  if (!r.ok && /verif|domain|own email/i.test(out) && !/resend\.dev/.test(from)) { r = await go("Hundred Cannons <onboarding@resend.dev>", ["sam@funnal.co.uk"]); out = (await r.text()) + " (sent from the Resend test address to Sam only: verify funnal.co.uk in Resend)"; }
  if (!r.ok) throw new Error(out); return out;
}
async function petMail(req: Request) {
  const u = new URL(req.url); const dry = u.searchParams.has("dry"); const now = ukNow(); const D = u.searchParams.get("date") || now.D;
  const s = sighting(D);
  if (!dry && (now.min < s.sm || now.min >= s.em)) return Response.json({ skip: "outside window", D, ...s });
  const wd = await (await rest("rpc/hl_is_workday", { method: "POST", body: JSON.stringify({ d: D }) })).text();
  if (wd.trim() === "false") return Response.json({ skip: "day off", D });
  const C: Record<string, [string, string, string]> = { common: ["#7D8894", "small and slightly suspicious", "&#x1F980;"], uncommon: ["#2F8F62", "unusual", "&#x1F422;"], rare: ["#2A6FBF", "properly rare", "&#x1F99C;"], epic: ["#7440C4", "epic", "&#x1F419;"], legendary: ["#C07E0C", "legendary", "&#x1F984;"], mythic: ["#B92A62", "mythic, which almost never happens,", "&#x1F409;"] };
  const jokes = ["Gary saw it first and has not stopped talking about it.", "It looked at the lighthouse like it owns the place.", "The parrot is already jealous.", "It has not signed any paperwork yet.", "Please do not tell it about the cannons.", "Finders keepers is legally binding at sea."];
  let html = TPL; const c = C[s.rar];
  for (const [a, b] of [["PETEMOJI", c[2]], ["RARITYUP", s.rar.toUpperCase()], ["COLOUR", c[0]], ["RARITY", s.rar], ["PHRASE", c[1]], ["NEED", String(s.need)], ["WINDOW", String(s.win)], ["START", s.st], ["END", s.en], ["JOKE", jokes[h32(D + "joke") % jokes.length]]]) html = html.split(a).join(b);
  const subject = `Pet sighting now: ${s.rar[0].toUpperCase() + s.rar.slice(1)} pet, ${s.need} DMs by ${s.en}`;
  const text = `A ${s.rar} pet is in Funnal Cove right now. Log ${s.need} DMs in Hundred Cannons by ${s.en} UK time to claim it. Board the ship: https://funnal.co.uk/crew  -- Gary the gull`;
  const key = await resendKey();
  if (dry || !key) return Response.json({ dry: true, haveKey: !!key, D, ...s, subject });
  const ins = await rest("hl_mail_log?on_conflict=d", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=representation" }, body: JSON.stringify({ d: D }) });
  const rows = await ins.json(); if (!Array.isArray(rows) || !rows.length) return Response.json({ skip: "already sent", D });
  let out = "";
  try { out = await mail(subject, html, text); } catch (e) { await rest(`hl_mail_log?d=eq.${D}`, { method: "DELETE" }); return Response.json({ error: (e as Error).message }, { status: 500 }); }
  await rest(`hl_mail_log?d=eq.${D}`, { method: "PATCH", body: JSON.stringify({ info: out }) });
  return Response.json({ sent: true, D, out });
}

// ---------- 23 Nov: pipeline notifications ----------
const MAIL_TO = () => (Deno.env.get("MAIL_TO") || "sam@funnal.co.uk,james@funnal.co.uk").split(",");
const NAME: Record<string, string> = { sam: "Sam", james: "James" };
const esc = (x: unknown) => String(x ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
async function J(path: string) { const r = await rest(path); return r.ok ? r.json() : []; }
async function claim(k: string) { const r = await rest("hl_notify_log?on_conflict=k", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=representation" }, body: JSON.stringify({ k }) }); const j = await r.json().catch(() => []); return Array.isArray(j) && j.length > 0; }
async function unclaim(k: string) { await rest(`hl_notify_log?k=eq.${encodeURIComponent(k)}`, { method: "DELETE" }); }
const send = (subject: string, html: string, text: string) => mail(subject, html, text);
const dayAdd = (d: string, n: number) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const ukDay = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date(iso));
const ukTime = (iso: string) => new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
const GAP: Record<string, number> = { messaged: 5, followed_up: 5, talking: 3, quote_sent: 4 };
const STAGE: Record<string, string> = { video_needed: "Video needed", video_made: "Video made", messaged: "Video sent", followed_up: "Followed up", talking: "Talking", meeting: "Meeting", quote_sent: "Quote sent", not_now: "Not now" };
function dueOf(r: any): string | null {
  if (["archived", "client", "no_response"].includes(r.stage)) return null; if (r.stage === "not_now") return r.return_on || null;
  if (r.stage === "meeting" && !r.meeting_held && r.meeting_at) return String(r.meeting_at).slice(0, 10);
  if (r.next_due) return r.next_due; const g = GAP[r.stage]; return g && r.last_contact ? dayAdd(r.last_contact, g) : null;
}
function card(title: string, rows: string[], empty: string) {
  return `<tr><td style="padding:14px 24px 4px"><div style="font-size:13px;letter-spacing:2px;font-weight:bold;color:#7F8A95;text-transform:uppercase">${title}</div>${rows.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">${rows.join("")}</table>` : `<p style="margin:8px 0 0;color:#7F8A95;font-size:14px">${empty}</p>`}</td></tr>`;
}
const row = (a: string, b: string, tag = "") => `<tr><td style="padding:9px 12px;border-radius:12px;background:#F3F5F7;font-size:15px"><b>${a}</b>${tag ? ` <span style="font-size:12px;color:#C0392B;font-weight:bold">${tag}</span>` : ""}<div style="font-size:13px;color:#6B7680;margin-top:2px">${b}</div></td></tr><tr><td style="height:6px"></td></tr>`;
function shell(head: string, sub: string, body: string) {
  return `<div style="background:#F3F3F3;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#3F5160"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:20px;overflow:hidden"><tr><td style="background:#1E3550;padding:22px 24px;color:#FFFFFF"><div style="font-size:12px;letter-spacing:3px;color:#F2C462;font-weight:bold">FUNNAL PIPELINE</div><div style="font-size:24px;font-weight:bold;margin-top:6px">${head}</div><div style="font-size:14px;opacity:.8;margin-top:4px">${sub}</div></td></tr>${body}<tr><td align="center" style="padding:18px 24px 26px"><a href="https://funnal.co.uk/crew#pipeline" style="display:inline-block;background:#3F5160;color:#FFFFFF;text-decoration:none;font-weight:bold;padding:13px 30px;border-radius:999px">Open the pipeline &rarr;</a></td></tr></table></div>`;
}
async function digest(D: string, dry: boolean) {
  const pros: any[] = await J("hl_prospects?select=*&limit=5000");
  const evs: any[] = await J(`hl_events?select=*&deleted=eq.false&starts_at=gte.${dayAdd(D, -1)}T00:00:00Z&starts_at=lt.${dayAdd(D, 2)}T00:00:00Z&order=starts_at`);
  const pays: any[] = await J(`hl_payments?select=*&paid_at=is.null&due=lte.${D}&order=due`);
  const byId = Object.fromEntries(pros.map((p) => [p.id, p]));
  const due = pros.map((r) => ({ r, d: dueOf(r) })).filter((x) => x.d && x.d <= D).sort((a, b) => (a.d! < b.d! ? -1 : 1));
  const today = evs.filter((e) => ukDay(e.starts_at) === D);
  const fu = due.map(({ r, d }) => row(esc(r.business || "Unnamed"), `${esc(STAGE[r.stage] || r.stage)} · ${esc(NAME[r.owner] || "")}${r.contact ? " · " + esc(r.contact) : ""}`, d! < D ? `overdue since ${d!.slice(8)}/${d!.slice(5, 7)}` : ""));
  const ev = today.map((e) => row(esc(e.title || "(No title)"), `${e.all_day ? "All day" : ukTime(e.starts_at)}${e.prospect_id && byId[e.prospect_id] ? " · " + esc(byId[e.prospect_id].business) : ""}${e.location ? " · " + esc(e.location) : ""}`));
  const py = pays.map((p) => row(`${esc(byId[p.prospect_id]?.business || "Client")} · £${Number(p.amount || 0).toLocaleString("en-GB")}`, p.due < D ? `Was due ${p.due}` : "Due today", p.due < D ? "late" : ""));
  const vids = pros.filter((r) => r.stage === "video_needed").length;
  const n = due.length + today.length + pays.length;
  const sub = n ? `${due.length} follow-up${due.length === 1 ? "" : "s"}, ${today.length} in the calendar, ${pays.length} payment${pays.length === 1 ? "" : "s"}` : "Nothing urgent today";
  const body = card("Follow up today", fu, "Nobody is waiting on you.") + card("In the calendar", ev, "No meetings or calls today.") + (pays.length ? card("Payments due", py, "") : "") + (vids ? `<tr><td style="padding:10px 24px 0;font-size:14px;color:#6B7680">${vids} prospect${vids === 1 ? "" : "s"} still need a video.</td></tr>` : "");
  const html = shell("Today in the pipeline", sub, body);
  const text = `Today in the pipeline: ${sub}.\n\nFollow up:\n${due.map(({ r, d }) => `- ${r.business} (${STAGE[r.stage] || r.stage}${d! < D ? ", overdue" : ""})`).join("\n") || "- nobody"}\n\nCalendar:\n${today.map((e) => `- ${e.all_day ? "All day" : ukTime(e.starts_at)} ${e.title}`).join("\n") || "- nothing"}\n\nhttps://funnal.co.uk/crew#pipeline`;
  if (dry) return { dry: true, subject: `Pipeline today: ${sub}`, n };
  if (!(await claim("digest-" + D))) return { skip: "digest already sent" };
  try { await send(`Pipeline today: ${sub}`, html, text); return { sent: "digest" }; } catch (e) { await unclaim("digest-" + D); return { error: (e as Error).message }; }
}
async function soon(dry: boolean) {
  const now = Date.now(); const from = new Date(now + 20 * 60000).toISOString(), to = new Date(now + 35 * 60000).toISOString();
  const evs: any[] = await J(`hl_events?select=*&deleted=eq.false&all_day=eq.false&starts_at=gte.${from}&starts_at=lt.${to}`);
  const out: string[] = [];
  for (const e of evs.filter((x) => ["meeting", "call"].includes(x.kind) || x.prospect_id)) {
    const k = "soon-" + e.id + "-" + e.starts_at; if (dry) { out.push(e.title); continue; } if (!(await claim(k))) continue;
    const pr = e.prospect_id ? (await J(`hl_prospects?select=business,contact,phone,email&id=eq.${e.prospect_id}`))[0] : null;
    const who = pr ? [pr.business, pr.contact].filter(Boolean).join(", ") : "";
    const body = card("Coming up", [row(esc(e.title || "Meeting"), `${ukTime(e.starts_at)}${who ? " · " + esc(who) : ""}${e.location ? " · " + esc(e.location) : ""}${pr?.phone ? " · " + esc(pr.phone) : ""}`)], "");
    try { await send(`In 30 minutes: ${e.title || "meeting"} at ${ukTime(e.starts_at)}`, shell(`${esc(e.title || "Meeting")} at ${ukTime(e.starts_at)}`, "Starts in about 30 minutes", body), `${e.title} at ${ukTime(e.starts_at)}${who ? " with " + who : ""}. https://funnal.co.uk/crew#pipeline`); out.push(e.title); }
    catch (er) { await unclaim(k); out.push("error: " + (er as Error).message); }
  }
  return out;
}
Deno.serve(async (req) => {
  const u = new URL(req.url); const dry = u.searchParams.has("dry"); const now = ukNow(); const res: Record<string, unknown> = {};
  if (u.searchParams.has("test")) { try { const out = await mail("Hundred Cannons: email is working", shell("Email is working", "Pet sightings, the 08:00 pipeline summary and meeting reminders will land here.", card("What you'll get", [row("Pet sightings", "Once a working day, when a pet turns up in Funnal Cove"), row("Pipeline today", "08:00 on working days: follow-ups due, meetings and payments"), row("Meeting reminders", "30 minutes before each meeting or call in the pipeline calendar")], "")), "Hundred Cannons email is working."); return Response.json({ test: "sent", out }); } catch (e) { return Response.json({ test: "failed", error: (e as Error).message }); } }
  try { res.soon = await soon(dry); } catch (e) { res.soon = (e as Error).message; }
  if (dry || (now.min >= 480 && now.min < 540)) {
    // the morning digest goes out from 08:00 on working days (retries until 09:00 if sending fails)
    const wd = await (await rest("rpc/hl_is_workday", { method: "POST", body: JSON.stringify({ d: now.D }) })).text();
    if (dry || wd.trim() !== "false") { try { res.digest = await digest(now.D, dry); } catch (e) { res.digest = (e as Error).message; } }
  }
  const pet = await petMail(req); res.pet = await pet.json().catch(() => null);
  res.haveKey = !!(await resendKey());
  return Response.json(res);
});
