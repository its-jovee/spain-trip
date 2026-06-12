-- Spain Trip PWA schema
-- Run in Supabase SQL Editor

create extension if not exists "uuid-ossp";

create type event_type as enum ('flight', 'hotel', 'train', 'restaurant', 'activity');
create type participant as enum ('both', 'paula', 'joao');

create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  type event_type not null default 'activity',
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  location text,
  confirmation_code text,
  participants participant not null default 'both',
  notes text,
  details jsonb,
  document_id uuid,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  storage_path text,
  url text,
  event_id uuid references events(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists checklists (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists checklist_items (
  id uuid primary key default uuid_generate_v4(),
  checklist_id uuid not null references checklists(id) on delete cascade,
  text text not null,
  checked boolean not null default false,
  checked_by text check (checked_by in ('joao', 'paula')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table events enable row level security;
alter table documents enable row level security;
alter table checklists enable row level security;
alter table checklist_items enable row level security;

create policy "Authenticated users can read events"
  on events for select to authenticated using (true);
create policy "Authenticated users can insert events"
  on events for insert to authenticated with check (true);
create policy "Authenticated users can update events"
  on events for update to authenticated using (true);
create policy "Authenticated users can delete events"
  on events for delete to authenticated using (true);

create policy "Authenticated users can read documents"
  on documents for select to authenticated using (true);
create policy "Authenticated users can insert documents"
  on documents for insert to authenticated with check (true);
create policy "Authenticated users can update documents"
  on documents for update to authenticated using (true);
create policy "Authenticated users can delete documents"
  on documents for delete to authenticated using (true);

create policy "Authenticated users can read checklists"
  on checklists for select to authenticated using (true);
create policy "Authenticated users can read checklist_items"
  on checklist_items for select to authenticated using (true);
create policy "Authenticated users can update checklist_items"
  on checklist_items for update to authenticated using (true);

-- Storage bucket for PDFs
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "Authenticated users can read documents bucket"
  on storage.objects for select to authenticated
  using (bucket_id = 'documents');

create policy "Authenticated users can upload documents bucket"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'documents');

-- Enable realtime for live sync
alter publication supabase_realtime add table events;
alter publication supabase_realtime add table checklist_items;

-- Create two auth users in Supabase Dashboard (Authentication → Users):
--   João — email matching VITE_JOAO_EMAIL
--   Paula — email matching VITE_PAULA_EMAIL
