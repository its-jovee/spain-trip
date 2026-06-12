-- Allow authenticated users to delete/update documents (needed for reset-trip dedupe)
create policy "Authenticated users can delete documents"
  on documents for delete to authenticated using (true);

create policy "Authenticated users can update documents"
  on documents for update to authenticated using (true);
