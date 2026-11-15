// Hundred Cannons pet sighting email: sends once a day at the sighting start (called every 2 minutes by pg_cron)
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
Deno.serve(async (req) => {
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
  const to = (Deno.env.get("MAIL_TO") || "sam@funnal.co.uk,james@funnal.co.uk").split(",");
  const key = Deno.env.get("RESEND_API_KEY");
  if (dry || !key) return Response.json({ dry: true, haveKey: !!key, D, ...s, subject, to }, { headers: {} });
  const ins = await rest("hl_mail_log?on_conflict=d", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=representation" }, body: JSON.stringify({ d: D }) });
  const rows = await ins.json(); if (!Array.isArray(rows) || !rows.length) return Response.json({ skip: "already sent", D });
  const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: Deno.env.get("MAIL_FROM") || "Hundred Cannons <onboarding@resend.dev>", to, subject, html, text }) });
  const out = await r.text();
  if (!r.ok) { await rest(`hl_mail_log?d=eq.${D}`, { method: "DELETE" }); return Response.json({ error: out }, { status: 500 }); }
  await rest(`hl_mail_log?d=eq.${D}`, { method: "PATCH", body: JSON.stringify({ info: out }) });
  return Response.json({ sent: true, D, out });
});
