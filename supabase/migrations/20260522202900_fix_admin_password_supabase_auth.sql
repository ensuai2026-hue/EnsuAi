/*
  # Fix admin password using Supabase Auth compatible hash
  Sets admin@ensu.ai password to Ensu@Admin2024
*/
UPDATE auth.users
SET
  encrypted_password = crypt('Ensu@Admin2024', gen_salt('bf', 10)),
  updated_at = now(),
  email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email = 'admin@ensu.ai';
