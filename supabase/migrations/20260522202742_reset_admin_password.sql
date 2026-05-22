/*
  # Reset admin password
  Updates the admin@ensu.ai password to a known value using Supabase's crypt function.
*/
UPDATE auth.users
SET 
  encrypted_password = crypt('Ensu@Admin2024', gen_salt('bf')),
  updated_at = now()
WHERE email = 'admin@ensu.ai';
