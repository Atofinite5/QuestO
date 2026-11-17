create extension if not exists pgcrypto;

create type public.questo_role as enum ('CEO', 'CTO', 'TEAM_LEAD', 'ENGINEER', 'INTERN');

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.company_memberships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.questo_role not null default 'ENGINEER',
  created_at timestamptz not null default now(),
  unique (company_id, user_id)
);

-- Keep tenant-owned Google integrations separate from identity and secrets.
create table public.company_integrations (
  company_id uuid primary key references public.companies(id) on delete cascade,
  google_sheet_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;

create function public.is_company_member(target_company uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.company_memberships m
    where m.company_id = target_company and m.user_id = (select auth.uid())
  );
$$;

create function public.has_company_role(target_company uuid, allowed_roles public.questo_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.company_memberships m
    where m.company_id = target_company
      and m.user_id = (select auth.uid())
      and m.role = any(allowed_roles)
  );
$$;

revoke all on function public.is_company_member(uuid) from public, anon;
revoke all on function public.has_company_role(uuid, public.questo_role[]) from public, anon;

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.company_memberships enable row level security;
alter table public.company_integrations enable row level security;

create policy "Members can read their companies"
  on public.companies for select to authenticated
  using (public.is_company_member(id));

create policy "Users can read their own profile and tenant colleagues"
  on public.profiles for select to authenticated
  using (
    id = (select auth.uid()) or exists (
      select 1 from public.company_memberships mine
      join public.company_memberships theirs on theirs.company_id = mine.company_id
      where mine.user_id = (select auth.uid()) and theirs.user_id = profiles.id
    )
  );

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Members can read memberships in their companies"
  on public.company_memberships for select to authenticated
  using (public.is_company_member(company_id));

create policy "Company leaders can manage memberships"
  on public.company_memberships for all to authenticated
  using (public.has_company_role(company_id, array['CEO', 'CTO']::public.questo_role[]))
  with check (public.has_company_role(company_id, array['CEO', 'CTO']::public.questo_role[]));

create policy "Company leaders can manage company integrations"
  on public.company_integrations for all to authenticated
  using (public.has_company_role(company_id, array['CEO', 'CTO']::public.questo_role[]))
  with check (public.has_company_role(company_id, array['CEO', 'CTO']::public.questo_role[]));

grant usage on schema public to authenticated;
grant select on public.companies, public.company_memberships to authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;
grant insert, update, delete on public.company_memberships to authenticated;
grant select, insert, update, delete on public.company_integrations to authenticated;
grant execute on function public.is_company_member(uuid) to authenticated;
grant execute on function public.has_company_role(uuid, public.questo_role[]) to authenticated;
