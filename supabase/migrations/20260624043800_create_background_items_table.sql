/*
  # Background tab content table

  1. New Tables
    - `background_items`
      - `id` (uuid, primary key)
      - `section` (text) - one of: certification | partner | factory | lab | specialist
      - `name` (text)
      - `subtitle` (text)
      - `description` (text)
      - `image_url` (text) - logo or photo
      - `accent_color` (text) - optional brand accent for logo cards
      - `display_order` (int)
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled
    - Public SELECT (anon + authenticated) - brand-facing content
    - Authenticated INSERT/UPDATE/DELETE for admin curation
*/

CREATE TABLE IF NOT EXISTS background_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  name text NOT NULL DEFAULT '',
  subtitle text DEFAULT '',
  description text DEFAULT '',
  image_url text DEFAULT '',
  accent_color text DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE background_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_background_items" ON background_items FOR SELECT TO anon USING (true);
CREATE POLICY "auth_select_background_items" ON background_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_background_items" ON background_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_background_items" ON background_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_background_items" ON background_items FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_background_items_section ON background_items(section, display_order);
