/*
  # Set admin password to a known working value
  Uses Supabase's pgcrypto crypt with bf (bcrypt) to set password for admin@ensu.ai
*/
UPDATE auth.users
SET
  encrypted_password = crypt('Admin@Ensu2024', gen_salt('bf', 10)),
  updated_at = now()
WHERE email = 'admin@ensu.ai';
