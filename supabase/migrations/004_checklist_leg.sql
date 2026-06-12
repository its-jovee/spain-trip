alter table checklists add column if not exists leg text not null default 'gru-mad';

alter table checklists drop constraint if exists checklists_leg_check;
alter table checklists add constraint checklists_leg_check
  check (leg in ('gru-mad', 'mad-sev', 'sev-mad', 'mad-gru'));
