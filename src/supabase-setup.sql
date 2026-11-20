-- Hundred Lanterns: database setup for Supabase.
-- Paste this whole file into Supabase > SQL Editor > New query, then press Run. Safe to run twice.

create table if not exists public.hl_docs (
  path text primary key,
  coll text not null,
  data jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);
create index if not exists hl_docs_coll_idx on public.hl_docs (coll);

create table if not exists public.hl_leases (
  path text primary key,
  holder text not null,
  expires_at timestamptz not null
);

-- Only signed-in crew (Sam and James) can read or write anything.
alter table public.hl_docs enable row level security;
alter table public.hl_leases enable row level security;
drop policy if exists "crew can read" on public.hl_docs;
drop policy if exists "crew can write" on public.hl_docs;
drop policy if exists "crew leases" on public.hl_leases;
create policy "crew can read" on public.hl_docs for select to authenticated using (true);
create policy "crew can write" on public.hl_docs for all to authenticated using (true) with check (true);
create policy "crew leases" on public.hl_leases for all to authenticated using (true) with check (true);

-- Deep merge of a JSON patch into a document ({"__delete__": true} removes a key).
create or replace function public.hl_merge(a jsonb, b jsonb) returns jsonb
language plpgsql immutable as $$
declare k text; v jsonb; r jsonb := coalesce(a, '{}'::jsonb);
begin
  if jsonb_typeof(r) is distinct from 'object' then r := '{}'::jsonb; end if;
  for k, v in select * from jsonb_each(b) loop
    if jsonb_typeof(v) = 'object' and v ? '__delete__' and v -> '__delete__' = 'true'::jsonb then
      r := r - k;
    elsif jsonb_typeof(v) = 'object' then
      r := jsonb_set(r, array[k], public.hl_merge(r -> k, v), true);
    else
      r := jsonb_set(r, array[k], v, true);
    end if;
  end loop;
  return r;
end $$;

-- Atomic merge-update (row lock makes concurrent taps from both captains safe).
create or replace function public.hl_update(p_path text, p_patch jsonb) returns integer
language plpgsql as $$
declare n integer;
begin
  update public.hl_docs
     set data = public.hl_merge(data, p_patch), version = version + 1, updated_at = now()
   where path = p_path
  returning version into n;
  if n is null then raise exception 'not_found' using errcode = 'P0002'; end if;
  return n;
end $$;

-- Server-side cooldown lease: the 5-second DM reload and the meeting/client gaps.
create or replace function public.hl_acquire(p_path text, p_holder text, p_ttl_ms integer) returns jsonb
language plpgsql as $$
declare r public.hl_leases%rowtype;
        exp timestamptz := now() + make_interval(secs => greatest(1000, least(600000, p_ttl_ms)) / 1000.0);
begin
  insert into public.hl_leases as l (path, holder, expires_at) values (p_path, p_holder, exp)
  on conflict (path) do update set holder = excluded.holder, expires_at = excluded.expires_at
    where l.expires_at < now() or l.holder = excluded.holder
  returning * into r;
  if not found then
    select * into r from public.hl_leases where path = p_path;
    return jsonb_build_object('acquired', false, 'expiresAt', r.expires_at);
  end if;
  return jsonb_build_object('acquired', true, 'expiresAt', r.expires_at, 'holder', r.holder);
end $$;

grant execute on function public.hl_merge(jsonb, jsonb), public.hl_update(text, jsonb), public.hl_acquire(text, text, integer) to authenticated;

-- Live updates between both captains' screens.
alter table public.hl_docs replica identity full;
do $$ begin
  alter publication supabase_realtime add table public.hl_docs;
exception when duplicate_object then null; end $$;
