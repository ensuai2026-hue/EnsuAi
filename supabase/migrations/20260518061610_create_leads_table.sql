/*
  # Create leads table for admin dashboard

  ## Summary
  Stores lead data captured from the DNA scan chatbot.

  ## New Tables
  - `leads`
    - `id` (uuid, primary key)
    - `name` (text) - lead's name from chat
    - `age_range` (text) - selected age bracket
    - `messages` (jsonb) - full chat conversation
    - `personality_profile` (jsonb) - AI-generated profile (nullable, only when diagnosis completes)
    - `completed` (boolean) - whether full diagnosis was completed
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Public insert allowed (leads submit from public app)
  - Only authenticated admin can read/update leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  age_range text,
  messages jsonb DEFAULT '[]'::jsonb,
  personality_profile jsonb,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anyone (public) can insert a lead
CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users (admin) can read leads
CREATE POLICY "Authenticated users can read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users (admin) can update leads
CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
