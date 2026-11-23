// Hundred Cannons: Google Calendar sync that runs on the server (23 Nov).
// One connection for the crew: whoever connects signs in with Google once, the refresh token stays in
// hl_gcal_auth (no browser can read it), and pg_cron calls /gcal/sync every 5 minutes, so the calendar keeps
// syncing both ways even when nobody has the game open.
// Routes (last path segment): link, secret, callback, status, cals, setcal, sync, disconnect.
const SB = Deno.env.get("SUPABASE_URL")!;
const SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CREW: Record<string, string> = { "sam@funnal.co.uk": "sam", "james@funnal.co.uk": "james" };
const FN = `${SB}/functions/v1/gcal`;
const REDIRECT = `${FN}/callback`;
const SCOPE = "https://www.googleapis.com/auth/calendar";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-hl-user", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" };
const J = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

async function rest(path: string, init: RequestInit = {}) {
  const r = await fetch(`${SB}/rest/v1/${path}`, { ...init, headers: { apikey: SRK, Authorization: `Bearer ${SRK}`, "Content-Type": "application/json", Prefer: "return=representation", ...(init.headers || {}) } });
  const t = await r.text(); let j: any = null; try { j = t ? JSON.parse(t) : null; } catch { j = t; }
  if (!r.ok) throw new Error(`db ${r.status}: ${t.slice(0, 200)}`); return j;
}
async function auth(): Promise<any> { const r = await rest("hl_gcal_auth?id=eq.main&select=*"); return (r && r[0]) || null; }
async function saveAuth(p: Record<string, unknown>) { await rest("hl_gcal_auth?on_conflict=id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify({ id: "main", ...p, updated_at: new Date().toISOString() }) }); }
async function cfg(k: string) { const r = await rest(`hl_catalogue?id=eq.cfg_${k}&select=note`); return (r && r[0] && r[0].note) || null; }
async function setCfg(k: string, v: string) { await rest("hl_catalogue?on_conflict=id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ id: "cfg_" + k, name: k, kind: "config", note: v, period: "one_off", active: false, sort: 999 }) }); }

async function who(req: Request) {
  const tok = (req.headers.get("authorization") || "").replace(/^Bearer /, ""); if (!tok) return null;
  const r = await fetch(`${SB}/auth/v1/user`, { headers: { apikey: req.headers.get("apikey") || SRK, Authorization: `Bearer ${tok}` } });
  if (!r.ok) return null; const u = await r.json(); return CREW[(u.email || "").toLowerCase()] ? { email: u.email.toLowerCase(), me: CREW[u.email.toLowerCase()] } : null;
}
const enc = new TextEncoder();
async function hmac(s: string) { const k = await crypto.subtle.importKey("raw", enc.encode(SRK), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(s))))).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" }[c]!)); }
const okReturn = (u: string) => { try { const x = new URL(u); return x.protocol === "https:" && (/(^|\.)funnal\.co\.uk$/.test(x.hostname) || /\.webflow\.io$/.test(x.hostname)); } catch { return false; } };

// ---------- Google ----------
async function accessToken(a: any) {
  const id = await cfg("gcal_client"); if (!id || !a?.client_secret || !a?.refresh_token) throw new Error("Not connected");
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: id, client_secret: a.client_secret, refresh_token: a.refresh_token, grant_type: "refresh_token" }) });
  const j = await r.json().catch(() => ({})); if (!r.ok) { const e = new Error(j.error === "invalid_grant" ? "Google access was removed or expired. Connect again" : `Token refresh failed (${r.status}): ${j.error || ""} ${j.error_description || ""}`.trim()); (e as any).grant = j.error === "invalid_grant"; throw e; }
  return j.access_token as string;
}
async function gapi(tok: string, path: string, opt: RequestInit = {}) {
  const r = await fetch("https://www.googleapis.com/calendar/v3" + path, { ...opt, headers: { Authorization: "Bearer " + tok, ...(opt.body ? { "Content-Type": "application/json" } : {}), ...(opt.headers || {}) } });
  if (r.status === 204 || r.status === 410) return null; const j = await r.json().catch(() => ({}));
  if (!r.ok) { const det = (j.error && (j.error.errors?.[0]?.reason || j.error.status)) || ""; const e = new Error(`Google Calendar ${r.status}${det ? " " + det : ""}: ${(j.error && j.error.message) || "request failed"}`); (e as any).status = r.status; throw e; } return j;
}
const londonDay = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date(iso));
const addDays = (d: string, n: number) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const localISO = (d: string) => { const p = new Date(d + "T12:00:00Z"); const off = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", timeZoneName: "shortOffset" }).formatToParts(p).find((x) => x.type === "timeZoneName")?.value || "GMT"; const m = off.match(/GMT([+-]\d+)?/); const h = m && m[1] ? +m[1] : 0; return new Date(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10), -h)).toISOString(); };
function toG(e: any, pros: Record<string, any>) {
  const pr = e.prospect_id && pros[e.prospect_id];
  const desc = [e.notes || "", pr ? `Pipeline: ${pr.business}${pr.contact ? " (" + pr.contact + ")" : ""}` : ""].filter(Boolean).join("\n\n");
  const o: any = { summary: e.title || "(No title)", description: desc || undefined, location: e.location || undefined, extendedProperties: { private: { funnal: e.id, kind: e.kind || "" } } };
  if (e.all_day) { const d = londonDay(e.starts_at); const end = e.ends_at ? londonDay(e.ends_at) : addDays(d, 1); o.start = { date: d }; o.end = { date: end > d ? end : addDays(d, 1) }; }
  else { const s = new Date(e.starts_at); const en = e.ends_at ? new Date(e.ends_at) : new Date(s.getTime() + 3600e3); o.start = { dateTime: s.toISOString(), timeZone: "Europe/London" }; o.end = { dateTime: en.toISOString(), timeZone: "Europe/London" }; }
  return o;
}
function fromG(g: any) {
  const allDay = !!(g.start && g.start.date); const notes = (g.description || "").replace(/\n*Pipeline: [^\n]*$/, "").trim() || null;
  return { title: g.summary || "(No title)", notes, location: g.location || null, all_day: allDay, starts_at: allDay ? localISO(g.start.date) : new Date(g.start.dateTime).toISOString(), ends_at: allDay ? localISO(g.end.date) : (g.end && g.end.dateTime ? new Date(g.end.dateTime).toISOString() : null) };
}
const tms = (s: string | null) => (s ? new Date(s).getTime() : 0);

async function sync() {
  const a = await auth(); if (!a?.refresh_token) return { skip: "not connected" };
  let cal = a.cal_id;
  if (!cal) { const cals = await calendars(a).catch(async (e) => { await saveAuth({ last_error: (e as Error).message }); throw e; }); const pick = cals.find((c: any) => /funnal/i.test(c.name)) || cals.find((c: any) => c.primary) || cals[0]; if (!pick) return { skip: "no writable calendar" }; cal = pick.id; await saveAuth({ cal_id: cal }); await setCfg("gcal_cal", cal); a.cal_id = cal; }
  let tok: string; try { tok = await accessToken(a); } catch (e) { await saveAuth({ last_error: (e as Error).message, ...((e as any).grant ? { refresh_token: null } : {}) }); throw e; }
  const base = `/calendars/${encodeURIComponent(cal)}/events`; const n = { sent: 0, edited: 0, deleted: 0, pulled: 0, changed: 0, removed: 0 };
  try {
    const evs: any[] = await rest("hl_events?select=*&limit=5000");
    const pl: any[] = await rest("hl_prospects?select=id,business,contact&limit=5000"); const pros = Object.fromEntries(pl.map((p) => [p.id, p]));
    const upd = (id: string, p: any) => rest(`hl_events?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(p) });
    const del = (id: string) => rest(`hl_events?id=eq.${id}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
    // 1. new pipeline events go to Google
    for (const e of evs.filter((x) => (!x.gcal_id || x.gcal_cal !== cal) && !x.deleted && x.created_by !== "google")) { const g = await gapi(tok, base, { method: "POST", body: JSON.stringify(toG(e, pros)) }); if (g) { await upd(e.id, { gcal_id: g.id, gcal_cal: cal, gcal_etag: g.etag, gcal_updated: g.updated }); e.gcal_id = g.id; e.gcal_cal = cal; e.gcal_updated = g.updated; n.sent++; } }
    // 2. deletions made in the pipeline
    for (const e of evs.filter((x) => x.deleted)) { if (x_has(e, cal)) { try { await gapi(tok, `${base}/${encodeURIComponent(e.gcal_id)}`, { method: "DELETE" }); } catch (er) { if (![404, 410].includes((er as any).status)) throw er; } } await del(e.id); n.deleted++; }
    // 3. edits made in the pipeline since the last sync
    for (const e of evs.filter((x) => x_has(x, cal) && !x.deleted && tms(x.updated_at) > tms(x.gcal_updated) + 1500)) {
      try { const g = await gapi(tok, `${base}/${encodeURIComponent(e.gcal_id)}`, { method: "PATCH", body: JSON.stringify(toG(e, pros)) }); if (g) { await upd(e.id, { gcal_etag: g.etag, gcal_updated: g.updated, updated_at: g.updated }); n.edited++; } }
      catch (er) { if ([404, 410].includes((er as any).status)) { await del(e.id); n.removed++; } else throw er; } }
    // 4. Google's side: new events, edits and deletions
    const tmin = new Date(Date.now() - 90 * 864e5).toISOString(), tmax = new Date(Date.now() + 400 * 864e5).toISOString(); let page: string | null = null; const items: any[] = [];
    do { const j: any = await gapi(tok, `${base}?singleEvents=true&showDeleted=true&maxResults=2500&timeMin=${encodeURIComponent(tmin)}&timeMax=${encodeURIComponent(tmax)}${page ? "&pageToken=" + encodeURIComponent(page) : ""}`); items.push(...(j.items || [])); page = j.nextPageToken || null; } while (page);
    const fresh: any[] = [];
    for (const g of items) {
      const e = evs.find((x) => x.gcal_id === g.id && x.gcal_cal === cal && !x.deleted);
      if (g.status === "cancelled") { if (e) { await del(e.id); n.removed++; } continue; } if (!g.start) continue;
      if (!e) { const mine = g.extendedProperties?.private?.funnal; const own = mine && evs.find((x) => x.id === mine);
        if (own) { if (!own.deleted) await upd(own.id, { gcal_id: g.id, gcal_cal: cal, gcal_etag: g.etag, gcal_updated: g.updated }); continue; }
        fresh.push({ ...fromG(g), kind: g.extendedProperties?.private?.kind || "google", gcal_id: g.id, gcal_cal: cal, gcal_etag: g.etag, gcal_updated: g.updated, updated_at: g.updated, created_by: "google", updated_by: "google", deleted: false }); }
      else if (tms(g.updated) > tms(e.gcal_updated) + 1500 && tms(g.updated) > tms(e.updated_at)) { await upd(e.id, { ...fromG(g), gcal_etag: g.etag, gcal_updated: g.updated, updated_at: g.updated, updated_by: "google" }); n.changed++; }
    }
    if (fresh.length) { await rest("hl_events?on_conflict=gcal_cal,gcal_id", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify(fresh) }); n.pulled = fresh.length; }
    await saveAuth({ last_sync: new Date().toISOString(), last_error: null });
    return { ok: true, ...n };
  } catch (e) { await saveAuth({ last_error: (e as Error).message || "Sync failed" }); throw e; }
}
function x_has(e: any, cal: string) { return !!e.gcal_id && e.gcal_cal === cal; }

async function calendars(a: any) { const tok = await accessToken(a); const j: any = await gapi(tok, "/users/me/calendarList?minAccessRole=writer&maxResults=250"); return (j.items || []).map((c: any) => ({ id: c.id, name: c.summaryOverride || c.summary, primary: !!c.primary })); }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const u = new URL(req.url); const route = u.pathname.split("/").filter(Boolean).pop();
  try {
    if (route === "callback") {
      const back = (ret: string, q: string) => Response.redirect((okReturn(ret) ? ret : "https://funnal.co.uk/crew").replace(/#.*$/, "") + (/\?/.test(ret) ? "&" : "?") + q + "#pipeline", 302);
      const [body, sig] = (u.searchParams.get("state") || "").split("."); let st: any = {};
      try { st = JSON.parse(atob(body.replace(/-/g, "+").replace(/_/g, "/"))); } catch { /* bad state */ }
      if (!sig || sig !== (await hmac(body)) || !(st.exp > Date.now())) return back(st.ret || "", "gcal=expired");
      if (u.searchParams.get("error")) return back(st.ret, "gcal=" + encodeURIComponent(u.searchParams.get("error")!));
      const a = await auth(); const id = await cfg("gcal_client");
      const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code: u.searchParams.get("code") || "", client_id: id || "", client_secret: a?.client_secret || "", redirect_uri: REDIRECT, grant_type: "authorization_code" }) });
      const j = await r.json(); if (!r.ok || !j.refresh_token) { await saveAuth({ last_error: j.error_description || j.error || "Google did not hand over a refresh token" }); return back(st.ret, "gcal=failed"); }
      await saveAuth({ refresh_token: j.refresh_token, email: st.email, connected_by: st.me, last_error: null });
      try { const na = await auth(); const cals = await calendars(na); const cur = na.cal_id || (await cfg("gcal_cal"));
        const pick = cals.find((c: any) => c.id === cur) || cals.find((c: any) => /funnal/i.test(c.name)) || cals.find((c: any) => c.primary) || cals[0];
        if (pick) { await saveAuth({ cal_id: pick.id }); await setCfg("gcal_cal", pick.id); } await sync(); } catch (e) { await saveAuth({ last_error: (e as Error).message }); }
      return back(st.ret, "gcal=ok");
    }
    if (route === "sync" && !req.headers.get("x-hl-user")) {
      // cron or a manual "Sync now": both just run the sync, which is safe to repeat
      const r = await sync().catch((e) => ({ error: (e as Error).message })); return J(r);
    }
    const w = await who(req); if (!w) return J({ error: "Sign in as Sam or James" }, 401);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const a = await auth();
    if (route === "status") return J({ connected: !!a?.refresh_token, hasSecret: !!a?.client_secret, hasClient: !!(await cfg("gcal_client")), email: a?.email || null, by: a?.connected_by || null, cal: a?.cal_id || null, last_sync: a?.last_sync || null, last_error: a?.last_error || null, redirect: REDIRECT });
    if (route === "secret") { const s = String(body.secret || "").trim(); if (s && s.length < 10) return J({ error: "That doesn't look like a client secret" }, 400); await saveAuth({ client_secret: s || null }); return J({ ok: true }); }
    if (route === "link") {
      const id = await cfg("gcal_client"); if (!id) return J({ error: "Save the Client ID first" }, 400); if (!a?.client_secret) return J({ error: "Save the client secret first" }, 400);
      const ret = okReturn(body.ret || "") ? body.ret : "https://funnal.co.uk/crew";
      const sb = btoa(JSON.stringify({ me: w.me, email: w.email, ret, exp: Date.now() + 15 * 60000 })).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" }[c]!));
      const q = new URLSearchParams({ client_id: id, redirect_uri: REDIRECT, response_type: "code", scope: SCOPE, access_type: "offline", prompt: "consent", include_granted_scopes: "true", login_hint: w.email, state: sb + "." + (await hmac(sb)) });
      return J({ url: "https://accounts.google.com/o/oauth2/v2/auth?" + q.toString() });
    }
    if (route === "cals") return J({ cals: await calendars(a), cal: a?.cal_id });
    if (route === "setcal") { const c = String(body.cal || ""); if (!c) return J({ error: "Pick a calendar" }, 400); await saveAuth({ cal_id: c }); await setCfg("gcal_cal", c); return J(await sync().catch((e) => ({ error: (e as Error).message }))); }
    if (route === "sync") return J(await sync().catch((e) => ({ error: (e as Error).message })));
    if (route === "disconnect") { if (a?.refresh_token) await fetch("https://oauth2.googleapis.com/revoke?token=" + encodeURIComponent(a.refresh_token), { method: "POST" }).catch(() => {}); await saveAuth({ refresh_token: null, email: null, connected_by: null, last_error: null }); return J({ ok: true }); }
    return J({ error: "Unknown route" }, 404);
  } catch (e) { return J({ error: (e as Error).message }, 500); }
});
