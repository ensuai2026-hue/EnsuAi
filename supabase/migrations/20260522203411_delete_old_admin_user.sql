/*
  # Remove stale admin user row
  The auth.users row for admin@ensu.ai was created outside Supabase Auth admin API
  and is causing a conflict. Delete it so the edge function can create it cleanly.
*/
DELETE FROM auth.users WHERE email = 'admin@ensu.ai';
