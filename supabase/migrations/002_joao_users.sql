-- Migrate jovi → joao and support separate user accounts
-- Run in Supabase SQL Editor if you already applied schema.sql

alter type participant add value if not exists 'joao';

update events set participants = 'joao' where participants::text = 'jovi';
update checklist_items set checked_by = 'joao' where checked_by = 'jovi';

alter table checklist_items drop constraint if exists checklist_items_checked_by_check;
alter table checklist_items add constraint checklist_items_checked_by_check
  check (checked_by in ('joao', 'paula'));

-- Create auth users in Supabase Dashboard (Authentication → Users):
--   João: email from VITE_JOAO_EMAIL, password of your choice
--   Paula: email from VITE_PAULA_EMAIL, password of your choice
